# Signup/Login `?redirect=explorers` Implementation Plan

## Overview

Implement `?redirect=explorers` query parameter support on both `/signup` and `/login` pages so that users arriving from marketing funnels can be redirected to `/explorers` (instead of the default `/courses`) after successful authentication. This applies to all three auth paths: magic link, GitHub OAuth, and Google OAuth.

## Current State Analysis

All post-authentication redirects are hardcoded to `/courses` across 6 files. There is no mechanism to pass a redirect destination through any auth flow.

### Key Discoveries:

- `src/pages/signup.astro:42` — Already-logged-in users always redirect to `/courses`
- `src/pages/login.astro:42` — Same hardcoded redirect for logged-in users
- `src/pages/verify.astro:53` — Post magic-link verification redirects to `/courses`
- `src/pages/api/auth.ts:40` — Magic link URL has no redirect parameter
- `src/pages/api/auth/github/callback.ts:165` — GitHub callback hardcodes `/courses`
- `src/pages/api/auth/google/callback.ts:130` — Google callback hardcodes `/courses`
- `src/components/SignupForm.svelte:55` — `newsletter_optin` cookie pattern is the proven way to persist state through OAuth round-trips
- `src/components/Login.svelte:53` — Social login navigates to `/api/auth/{provider}` with no state
- Cross-links between login↔signup (`SignupForm.svelte:152`, `Login.svelte:137`) are static and would lose `?redirect=`
- `src/server/urlValidation.ts` exists but is specific to external auth; not reusable here

## Desired End State

1. Visiting `/signup?redirect=explorers` or `/login?redirect=explorers` and completing auth via **any method** (magic link, GitHub, Google) redirects to `/explorers` instead of `/courses`
2. Already-logged-in users visiting these URLs with `?redirect=explorers` are redirected to `/explorers`
3. The `?redirect=` parameter is preserved through error flows (OAuth failures, verification errors)
4. Cross-navigation between login↔signup preserves the redirect parameter
5. Only allowlisted redirect targets are accepted — invalid values fall back to `/courses`
6. No open redirect vulnerabilities

### Verification:

- Visit `/signup?redirect=explorers` → sign up via magic link → after clicking email link, land on `/explorers`
- Visit `/signup?redirect=explorers` → sign up via GitHub → land on `/explorers`
- Visit `/signup?redirect=explorers` → sign up via Google → land on `/explorers`
- Visit `/login?redirect=explorers` → log in via magic link → land on `/explorers`
- Visit `/login?redirect=explorers` → log in via GitHub → land on `/explorers`
- Visit `/login?redirect=explorers` → log in via Google → land on `/explorers`
- Visit `/signup?redirect=explorers` while already logged in → land on `/explorers`
- Visit `/signup?redirect=invalid` → complete auth → land on `/courses` (fallback)
- Visit `/signup` (no redirect param) → complete auth → land on `/courses` (default)
- OAuth error → redirected to `/login?error=...&redirect=explorers` → retry → still redirects to `/explorers`
- Click "Zaloguj się" / "Zarejestruj się" cross-link → `?redirect=explorers` preserved in URL

## What We're NOT Doing

- Not adding `?redirect=` support to `/external/` auth routes (separate system)
- Not supporting arbitrary redirect URLs — only an explicit allowlist (`explorers`, `courses`)
- Not modifying the OAuth initiation endpoints (`github.ts`, `google.ts`) — redirect state passes via cookie, not through the OAuth flow itself
- Not changing the email template or email service — only the magic link URL changes

## Implementation Approach

Two distinct state-passing mechanisms aligned with the two auth paths:

- **Magic link path**: `?redirect=` travels as a query parameter through the chain: page → POST body → magic link URL → verify page
- **Social auth path**: `?redirect=` is stored in a short-lived cookie (same proven pattern as `newsletter_optin`) and read by the OAuth callback

A shared utility module (`src/server/redirects.ts`) provides the allowlist and validation logic used by all consumers.

## Critical Implementation Details

### Security: Open Redirect Prevention

The redirect target is validated against a strict allowlist map. Only the **key** (e.g., `"explorers"`) travels through URLs and cookies — never a full path or URL. The server resolves keys to paths.

```typescript
const VALID_REDIRECTS: Record<string, string> = {
  explorers: '/explorers',
  courses: '/courses',
};
const DEFAULT_REDIRECT = '/courses';
```

This makes open redirect attacks impossible — an attacker cannot inject arbitrary URLs because only known keys map to known paths.

### Cookie: `redirect_after_auth`

- **Purpose**: Persist redirect target across the OAuth round-trip
- **Pattern**: Identical to existing `newsletter_optin` cookie
- **Attributes**: `path=/; max-age=600; secure; samesite=lax`
- **Lifecycle**: Set before OAuth redirect, read and consumed (deleted) in the callback
- **Value**: The raw key (e.g., `"explorers"`), not a path

### Timing & Lifecycle Considerations

**N/A**: This feature involves only server-side redirects and simple cookie reads. No client-side state management, DOM mutations, or lifecycle timing concerns.

### Performance & Optimization Strategy

**N/A**: No additional API calls, database queries, or computations. The only additions are string lookups in a 2-entry map and reading one extra cookie/query parameter.

### Debug & Observability Plan

- Existing `console.info` log lines in callbacks (e.g., `[github/callback] GitHub login`) already log the email. No additional logging needed — the redirect target is visible in the HTTP response `Location` header.
- If a redirect fails to work, check: (1) `redirect_after_auth` cookie is set before OAuth redirect, (2) cookie is readable in the callback, (3) the value matches an allowlist key.

---

## Phase 1: Shared Redirect Utility

### Overview

Create a small module that validates and resolves redirect keys. Used by all auth endpoints.

### Changes Required:

#### 1. New file: `src/server/redirects.ts`

**File**: `src/server/redirects.ts`
**Changes**: Create new module

```typescript
/**
 * Redirect target resolution for post-auth flows.
 * Prevents open redirects by mapping known keys to internal paths.
 */

const VALID_REDIRECTS: Record<string, string> = {
  explorers: '/explorers',
  courses: '/courses',
};

const DEFAULT_REDIRECT = '/courses';

/**
 * Resolves a redirect key to a valid internal path.
 * Returns DEFAULT_REDIRECT for unknown/missing keys.
 */
export function resolveRedirect(key: string | null | undefined): string {
  if (!key) return DEFAULT_REDIRECT;
  return VALID_REDIRECTS[key] || DEFAULT_REDIRECT;
}

export { DEFAULT_REDIRECT };
```

### Success Criteria:

#### Automated Verification:

- [x] File exists at `src/server/redirects.ts`
- [x] TypeScript compiles without errors: `npx tsc --noEmit`

#### Manual Verification:

- [x] N/A — utility only, verified through consumers in later phases

---

## Phase 2: Astro Pages (signup.astro, login.astro)

### Overview

Read `?redirect` from the URL, pass it as a prop to form components, and honor it for already-logged-in users.

### Changes Required:

#### 1. `src/pages/signup.astro`

**File**: `src/pages/signup.astro`
**Changes**: Read `redirect` param, pass to SignupForm, honor for logged-in redirect

```astro
---
import logo from '@/images/generic/logo-white.png';
import Layout from '@/layouts/BaseLayout.astro';
import SignupForm from '@/components/SignupForm.svelte';
import { resolveRedirect } from '@/server/redirects';

const CF_SITE_KEY = Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY || '1x00000000000000000000AA';

const errorMappings = {
  /* ... unchanged ... */
};

const successMappings = {
  /* ... unchanged ... */
};

let errorMsg = '';
let successMsg = '';

if (Astro.url.searchParams.get('error')) {
  const error = Astro.url.searchParams.get('error');
  errorMsg = errorMappings[error as keyof typeof errorMappings] || 'Wystąpił nieznany błąd. Spróbuj ponownie.';
}

if (Astro.url.searchParams.get('success')) {
  const success = Astro.url.searchParams.get('success');
  successMsg = successMappings[success as keyof typeof successMappings] || 'Operacja zakończona pomyślnie.';
}

// Read redirect param (e.g., "explorers")
const redirectParam = Astro.url.searchParams.get('redirect');

// If user has an active token, redirect to intended destination
if (Astro.cookies.has('token')) {
  return Astro.redirect(resolveRedirect(redirectParam));
}
---

<Layout>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
    <img src={logo.src} alt="Logo" class="w-64 mx-auto mb-4 pb-4" />
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg">
      <SignupForm cfSiteKey={CF_SITE_KEY} redirect={redirectParam} client:only="svelte" />
      {errorMsg && <p class="text-red-500 text-sm text-center mt-4">{errorMsg}</p>}
      {successMsg && <p class="text-green-500 text-sm text-center mt-4">{successMsg}</p>}
    </div>
    <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"></script>
  </div>
</Layout>
```

#### 2. `src/pages/login.astro`

**File**: `src/pages/login.astro`
**Changes**: Same pattern — read `redirect` param, pass to LoginForm, honor for logged-in redirect

```astro
---
import logo from '@/images/generic/logo-white.png';
import Layout from '@/layouts/BaseLayout.astro';
import LoginForm from '@/components/Login.svelte';
import { resolveRedirect } from '@/server/redirects';

/* ... errorMappings, successMappings unchanged ... */

// Read redirect param
const redirectParam = Astro.url.searchParams.get('redirect');

// If user has an active token, redirect to intended destination
if (Astro.cookies.has('token')) {
  return Astro.redirect(resolveRedirect(redirectParam));
}
---

<Layout>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
    <img src={logo.src} alt="Logo" class="w-64 mx-auto mb-4 pb-4" />
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg">
      <LoginForm cfSiteKey={CF_SITE_KEY} redirect={redirectParam} client:only="svelte" />
      {errorMsg && <p class="text-red-500 text-sm text-center mt-4">{errorMsg}</p>}
      {successMsg && <p class="text-green-500 text-sm text-center mt-4">{successMsg}</p>}
    </div>
    <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"></script>
  </div>
</Layout>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] Visit `/signup?redirect=explorers` while logged in → redirected to `/explorers`
- [ ] Visit `/login?redirect=explorers` while logged in → redirected to `/explorers`
- [ ] Visit `/signup` while logged in → redirected to `/courses` (default)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Form Components (SignupForm.svelte, Login.svelte)

### Overview

Accept the `redirect` prop, include it in magic link POST body, set `redirect_after_auth` cookie for social auth, and preserve the param in cross-links between login↔signup.

### Changes Required:

#### 1. `src/components/SignupForm.svelte`

**File**: `src/components/SignupForm.svelte`
**Changes**: Add `redirect` prop, include in POST body, set cookie for social auth, update cross-link

```svelte
<script lang="ts">
  import { useCaptchaCallback } from '../hooks/useCaptcha.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  interface SignupFormProps {
    cfSiteKey: string;
    redirect?: string | null;
  }

  const { cfSiteKey, redirect }: SignupFormProps = $props();

  let email = $state('');
  let newsletterOptIn = $state(true);
  let error = $state('');
  let success = $state('');
  let loading = $state(false);
  let isCaptchaVerified = $state(false);

  onMount(async () => {
    useCaptchaCallback(cfSiteKey, (s) => {
      isCaptchaVerified = s;
    });
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isCaptchaVerified) {
      error = 'Weryfikacja nie powiodła się. Spróbuj ponownie.';
      return;
    }
    loading = true;
    error = '';
    success = '';

    try {
      await axios.post('/api/auth', { email, newsletterOptIn, redirect });
      success = 'Na wskazany email wysłaliśmy link — kliknij go, aby aktywować konto';
    } catch (err) {
      /* ... unchanged error handling ... */
    } finally {
      loading = false;
    }
  }

  function handleSocialLogin(provider: 'github' | 'google') {
    if (newsletterOptIn) {
      document.cookie = 'newsletter_optin=1; path=/; max-age=600; secure; samesite=lax';
    } else {
      document.cookie = 'newsletter_optin=; path=/; max-age=0; secure; samesite=lax';
    }
    // Persist redirect target across OAuth round-trip
    if (redirect) {
      document.cookie = `redirect_after_auth=${redirect}; path=/; max-age=600; secure; samesite=lax`;
    }
    window.location.href = `/api/auth/${provider}`;
  }

  // Build cross-link with preserved redirect param
  const loginHref = $derived(redirect ? `/login?redirect=${redirect}` : '/login');
</script>

<!-- ... template unchanged except the cross-link at the bottom ... -->

<div class="text-center text-sm text-gray-400">
  Masz już konto?
  <a href={loginHref} class="text-indigo-400 hover:text-indigo-300">Zaloguj się</a>
</div>
```

#### 2. `src/components/Login.svelte`

**File**: `src/components/Login.svelte`
**Changes**: Add `redirect` prop, include in POST body, set cookie for social auth, update cross-link

```svelte
<script lang="ts">
  import { useCaptchaCallback } from '../hooks/useCaptcha.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  interface LoginFormProps {
    cfSiteKey: string;
    redirect?: string | null;
  }

  const { cfSiteKey, redirect }: LoginFormProps = $props();

  /* ... existing state vars unchanged ... */

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    /* ... captcha check unchanged ... */
    try {
      await axios.post('/api/auth', { email, redirect });
      success = 'Na wskazany email wysłaliśmy link do logowania';
    } catch (err) {
      /* ... unchanged ... */
    } finally {
      loading = false;
    }
  }

  function handleSocialLogin(provider: 'github' | 'google') {
    // Persist redirect target across OAuth round-trip
    if (redirect) {
      document.cookie = `redirect_after_auth=${redirect}; path=/; max-age=600; secure; samesite=lax`;
    }
    window.location.href = `/api/auth/${provider}`;
  }

  // Build cross-link with preserved redirect param
  const signupHref = $derived(redirect ? `/signup?redirect=${redirect}` : '/signup');
</script>

<!-- ... template unchanged except the cross-link at the bottom ... -->

<div class="mt-4 text-center text-sm text-gray-400">
  Nie masz konta?
  <a href={signupHref} class="text-indigo-400 hover:text-indigo-300">Zarejestruj się</a>
</div>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] On `/signup?redirect=explorers`, clicking "Zaloguj się" navigates to `/login?redirect=explorers`
- [ ] On `/login?redirect=explorers`, clicking "Zarejestruj się" navigates to `/signup?redirect=explorers`
- [ ] On `/signup?redirect=explorers`, clicking GitHub sets `redirect_after_auth=explorers` cookie (check DevTools)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Magic Link API (`auth.ts`)

### Overview

Read `redirect` from the POST body and append it to the magic link URL sent via email.

### Changes Required:

#### 1. `src/pages/api/auth.ts`

**File**: `src/pages/api/auth.ts`
**Changes**: Read `redirect` from request body, append to magic link URL

```typescript
export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  const responseHeaders = new Headers();

  try {
    const { email, newsletterOptIn, redirect } = await request.json();

    if (!email) {
      return createJsonResponse({ error: 'Email jest wymagany' }, 400, responseHeaders);
    }

    /* ... newsletter subscription unchanged ... */

    const token = await generateToken(email, JWT_SECRET);

    await storeMagicLink(token, email, locals.runtime?.env);

    // Build magic link with optional redirect param
    let magicLink = `${SITE_URL}/verify?token=${token}`;
    if (redirect) {
      magicLink += `&redirect=${encodeURIComponent(redirect)}`;
    }

    /* ... email sending unchanged, uses magicLink variable ... */
  } catch (error) {
    /* ... unchanged ... */
  }
};
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] Submit signup form with `?redirect=explorers` → received email contains link with `&redirect=explorers` in the URL

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Magic Link Verification (`verify.astro`)

### Overview

Read the `redirect` query parameter from the magic link URL and use it for the post-auth redirect. Preserve it in error redirects.

### Changes Required:

#### 1. `src/pages/verify.astro`

**File**: `src/pages/verify.astro`
**Changes**: Read `redirect` param, use `resolveRedirect()` for all redirects

```astro
---
import Layout from '@/layouts/BaseLayout.astro';
import { verifyMagicLink } from '@/server/magicLinkManager';
import { generateToken } from '@/server/auth';
import { JWT_SECRET } from 'astro:env/server';
import { upsertUser } from '@/server/supabase/userService';
import { syncFromAirtable } from '@/server/supabase/airtableSyncService';
import { syncAllCircleCourses } from '@/server/supabase/circleSyncService';
import { upsertGrant } from '@/server/supabase/accessService';
import { resolveRedirect } from '@/server/redirects';

const { env, ctx } = Astro.locals.runtime;

const token = Astro.url.searchParams.get('token');
const redirectParam = Astro.url.searchParams.get('redirect');

// Build error redirect URL preserving the redirect param
const errorRedirectSuffix = redirectParam ? `&redirect=${redirectParam}` : '';

if (!token) {
  return Astro.redirect(`/login?error=MISSING_TOKEN${errorRedirectSuffix}`);
}

const email = await verifyMagicLink(token as string, env);

if (!email) {
  return Astro.redirect(`/login?error=MISSING_USER${errorRedirectSuffix}`);
}

const jwtToken = await generateToken(email as string, JWT_SECRET);

if (jwtToken) {
  Astro.cookies.set('token', jwtToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });
}

/* ... Supabase sync unchanged ... */

return Astro.redirect(resolveRedirect(redirectParam));
---

<Layout>
  <div class='min-h-screen flex flex-col items-center justify-center bg-gray-900'>
    <h1 class='text-white text-2xl font-bold'>Zalogowano</h1>
  </div>
</Layout>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] Click magic link with `?token=xxx&redirect=explorers` → land on `/explorers`
- [ ] Click magic link with `?token=xxx` (no redirect) → land on `/courses`
- [ ] Click magic link with expired token and `&redirect=explorers` → redirected to `/login?error=MISSING_TOKEN&redirect=explorers`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: OAuth Callbacks

### Overview

Read the `redirect_after_auth` cookie in both GitHub and Google callbacks. Use it for the post-auth redirect and preserve it in error redirects.

### Changes Required:

#### 1. `src/pages/api/auth/github/callback.ts`

**File**: `src/pages/api/auth/github/callback.ts`
**Changes**: Read and consume `redirect_after_auth` cookie, use for redirect

```typescript
import { resolveRedirect } from '@/server/redirects';

export const GET: APIRoute = async ({ request, cookies, locals, redirect }) => {
  /* ... state validation unchanged ... */

  try {
    cookies.delete('oauth_state');

    // Read and consume newsletter opt-in cookie
    const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
    cookies.delete('newsletter_optin', { path: '/' });

    // Read and consume redirect cookie
    const redirectTarget = cookies.get('redirect_after_auth')?.value;
    cookies.delete('redirect_after_auth', { path: '/' });

    // Helper for error redirects that preserve the redirect param
    const errorRedirect = (error: string) => {
      const params = new URLSearchParams({ error });
      if (redirectTarget) params.set('redirect', redirectTarget);
      return redirect(`/login?${params.toString()}`);
    };

    /* ... token exchange ... */

    if (!tokenResponse.ok) {
      /* ... logging ... */
      return errorRedirect('GITHUB_API_ERROR');
    }

    /* ... email fetching ... */

    if (!primaryEmail) {
      return errorRedirect('NO_VERIFIED_EMAIL');
    }

    const authResult = await handleSocialAuth(primaryEmail, locals.runtime.env);

    if (!authResult.success || !authResult.token) {
      return errorRedirect(authResult.error || 'OAUTH_ERROR');
    }

    /* ... cookie setting, Supabase sync unchanged ... */

    // Redirect to intended destination
    return redirect(resolveRedirect(redirectTarget));
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return redirect('/login?error=OAUTH_ERROR');
  }
};
```

#### 2. `src/pages/api/auth/google/callback.ts`

**File**: `src/pages/api/auth/google/callback.ts`
**Changes**: Same pattern as GitHub callback

```typescript
import { resolveRedirect } from '@/server/redirects';

export const GET: APIRoute = async ({ request, cookies, locals, redirect }) => {
  /* ... state validation unchanged ... */

  try {
    cookies.delete('oauth_state');

    const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
    cookies.delete('newsletter_optin', { path: '/' });

    // Read and consume redirect cookie
    const redirectTarget = cookies.get('redirect_after_auth')?.value;
    cookies.delete('redirect_after_auth', { path: '/' });

    const errorRedirect = (error: string) => {
      const params = new URLSearchParams({ error });
      if (redirectTarget) params.set('redirect', redirectTarget);
      return redirect(`/login?${params.toString()}`);
    };

    /* ... token exchange, user info fetching ... */

    if (!userInfo.email || !userInfo.verified_email) {
      return errorRedirect('NO_VERIFIED_EMAIL');
    }

    const authResult = await handleSocialAuth(userInfo.email, locals.runtime.env);

    if (!authResult.success || !authResult.token) {
      return errorRedirect(authResult.error || 'OAUTH_ERROR');
    }

    /* ... cookie setting, Supabase sync unchanged ... */

    // Redirect to intended destination
    return redirect(resolveRedirect(redirectTarget));
  } catch (error) {
    console.error('Google OAuth error:', error);
    return redirect('/login?error=OAUTH_ERROR');
  }
};
```

**Note on `errorRedirect` helper**: In the catch block, the `redirectTarget` variable may not be defined yet (if the error occurs before the cookie is read). The catch block keeps the simple `/login?error=OAUTH_ERROR` redirect without the redirect param — this is acceptable because such early failures (e.g., missing state) indicate a broken flow where the cookie likely doesn't exist anyway.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] `/signup?redirect=explorers` → GitHub login → land on `/explorers`
- [ ] `/signup?redirect=explorers` → Google login → land on `/explorers`
- [ ] `/login?redirect=explorers` → GitHub login → land on `/explorers`
- [ ] `/login?redirect=explorers` → Google login → land on `/explorers`
- [ ] `/signup` (no redirect) → GitHub login → land on `/courses`
- [ ] GitHub OAuth error with redirect cookie → redirected to `/login?error=...&redirect=explorers`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

No unit tests needed — the feature is pure routing/redirect logic with no complex business rules. The `resolveRedirect` function is trivial (3-line allowlist lookup).

### Integration Tests:

Not applicable — the auth flow requires real OAuth providers and email delivery.

### Manual Testing Steps:

1. **Magic link + signup + redirect**: `/signup?redirect=explorers` → email signup → click link → verify `/explorers`
2. **Magic link + login + redirect**: `/login?redirect=explorers` → email login → click link → verify `/explorers`
3. **GitHub + signup + redirect**: `/signup?redirect=explorers` → GitHub → verify `/explorers`
4. **Google + signup + redirect**: `/signup?redirect=explorers` → Google → verify `/explorers`
5. **GitHub + login + redirect**: `/login?redirect=explorers` → GitHub → verify `/explorers`
6. **Google + login + redirect**: `/login?redirect=explorers` → Google → verify `/explorers`
7. **No redirect (regression)**: `/signup` → any auth method → verify `/courses`
8. **Invalid redirect**: `/signup?redirect=evil.com` → any auth method → verify `/courses`
9. **Already logged in + redirect**: `/signup?redirect=explorers` → verify immediate redirect to `/explorers`
10. **Cross-links**: `/signup?redirect=explorers` → click "Zaloguj się" → verify URL is `/login?redirect=explorers`
11. **Error preservation**: `/signup?redirect=explorers` → trigger auth error → verify URL has `&redirect=explorers`

## Performance Considerations

None — the changes add only a string lookup in a 2-entry map and reading one additional cookie/query param. No new API calls, database queries, or external requests.

## Migration Notes

No migration needed. This is purely additive — all existing flows without `?redirect=` continue to work identically (defaulting to `/courses`).

## Files Changed Summary

| File | Type of Change |
|------|---------------|
| `src/server/redirects.ts` | **New** — Allowlist + resolver |
| `src/pages/signup.astro` | **Modified** — Read `?redirect`, pass prop, honor for logged-in |
| `src/pages/login.astro` | **Modified** — Same as signup |
| `src/components/SignupForm.svelte` | **Modified** — Accept prop, POST body, cookie, cross-link |
| `src/components/Login.svelte` | **Modified** — Accept prop, POST body, cookie, cross-link |
| `src/pages/api/auth.ts` | **Modified** — Read `redirect` from body, append to magic link URL |
| `src/pages/verify.astro` | **Modified** — Read `redirect` param, use for redirect |
| `src/pages/api/auth/github/callback.ts` | **Modified** — Read cookie, use for redirect |
| `src/pages/api/auth/google/callback.ts` | **Modified** — Read cookie, use for redirect |

## References

- Research: `thoughts/shared/research/2026-03-30-signup-redirect-explorers.md`
- Newsletter cookie pattern: `src/components/SignupForm.svelte:54-58`
- Existing URL validation (different scope): `src/server/urlValidation.ts`
