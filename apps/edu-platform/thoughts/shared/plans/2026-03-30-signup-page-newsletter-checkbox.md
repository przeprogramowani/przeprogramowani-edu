# Dedicated Signup Page with Newsletter Checkbox Implementation Plan

## Overview

Extract the signup flow from `login.astro` into a dedicated `/signup` page with a new `SignupForm.svelte` component. Add a pre-checked newsletter opt-in checkbox that subscribes users to a MailerLite group during registration. The MailerLite subscription is fire-and-forget, handled inline in both the magic link auth flow and OAuth (GitHub/Google) callbacks.

## Current State Analysis

- `login.astro` handles both login and signup via `?mode=signup` query param
- `Login.svelte` has mode-dependent copy (`login` | `signup`) but identical behavior
- Auth API (`/api/auth`) accepts `{ email }` — no newsletter awareness
- OAuth callbacks (`github/callback.ts`, `google/callback.ts`) handle Supabase sync via `ctx.waitUntil` fire-and-forget pattern
- edu-platform has **zero** MailerLite integration (no SDK usage, no env var, no group ID)
- MailerLite SDK is available in the monorepo via `@mailerlite/mailerlite-nodejs`

### Key Discoveries:

- `projects/common/src/components/newsletter/NewsletterGroup.ts:3-21` — 21 group IDs exist, none for edu-platform signups
- `src/pages/api/auth/github.ts:25-31` — OAuth state cookie pattern (`oauth_state`, 10-min TTL) can be reused for newsletter opt-in cookie
- `src/pages/api/auth/github/callback.ts:142-151` — fire-and-forget `syncPromise` with `ctx.waitUntil` is the established pattern for post-auth async work
- `astro-env.ts` — no `10XDEVS_MAILERLITE_API_KEY` or `MAILERLITE_GROUP_ID` defined
- Other projects (opanuj-frontend, opanuj-ai) access the key via `locals.runtime.env.10XDEVS_MAILERLITE_API_KEY`

## Desired End State

1. A dedicated `/signup` route renders a `SignupForm.svelte` component with email input, social login buttons, and a **pre-checked** newsletter checkbox
2. `/login` remains unchanged (no checkbox, no newsletter logic)
3. `/login?mode=signup` redirects to `/signup`
4. Magic link signup (`POST /api/auth`) accepts `{ email, newsletterOptIn }` and subscribes to MailerLite when opted in
5. OAuth signup sets a `newsletter_optin` cookie before redirect; callbacks read it and subscribe via MailerLite
6. MailerLite subscription is fire-and-forget (never blocks auth flow)
7. Two new env vars: `10XDEVS_MAILERLITE_API_KEY` and `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID`

### Verification:

- Signup via magic link with checkbox checked → email appears in MailerLite group
- Signup via GitHub/Google with checkbox checked → same result
- Unchecking the checkbox → no MailerLite subscription
- Login page unchanged, no checkbox visible
- Auth flow speed unaffected (MailerLite is fire-and-forget)

## What We're NOT Doing

- Not modifying the existing `Login.svelte` component (new component instead)
- Not adding MailerLite double opt-in confirmation flow management — MailerLite handles that via `status: 'unconfirmed'`
- Not creating a separate `/api/newsletter-signup` endpoint — subscription is inline
- Not adding the newsletter group ID to the shared `NewsletterGroup` enum — using a dedicated env var since this is a custom group
- Not changing any existing auth behavior or token management

## Implementation Approach

Three phases: (1) create the new signup page and component, (2) add MailerLite subscription to auth endpoints, (3) wire up OAuth cookie-based opt-in.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- MailerLite SDK call is fire-and-forget via `ctx.waitUntil()` in OAuth callbacks and a detached promise in the auth endpoint — it must never delay the auth response
- The `newsletter_optin` cookie has a 10-minute TTL (`max-age=600`), matching the existing `oauth_state` cookie pattern, which is sufficient for the OAuth round-trip
- Cookie is set client-side (not httpOnly) since it's set before navigation and contains only a boolean flag

### User Experience Specification

- Signup page layout matches login page (same dark bg, logo, centered card)
- Checkbox appears between the email input hint text and the captcha container
- Checkbox label: "Chcę otrzymywać wiadomości email dotyczące szkolenia 10xDevs oraz powiadomienia o nowych wpisach i filmach dot. programowania z AI"
- Checkbox is **pre-checked** by default
- Checkbox state is preserved when switching between email and social login methods (Svelte state persists)
- Error/success messages work identically to the login page

### State Management Sequencing

- **Email signup**: checkbox state → form submit → `{ email, newsletterOptIn }` sent to `/api/auth` → server subscribes fire-and-forget
- **Social signup**: checkbox state → cookie set → redirect to OAuth provider → callback reads cookie → deletes cookie → subscribes fire-and-forget
- Cookie is deleted in callback regardless of subscription success/failure

### Debug & Observability Plan

- `console.info` log when MailerLite subscription is attempted (email + group)
- `console.error` on MailerLite SDK failures (caught by `.catch()`)
- Tag logs with `[newsletter]` prefix for easy filtering

---

## Phase 1: New Signup Page and SignupForm Component

### Overview

Create `src/pages/signup.astro` and `src/components/SignupForm.svelte`. The signup page mirrors the login page structure but uses the new component with the newsletter checkbox. Add redirect from `/login?mode=signup` to `/signup`.

### Changes Required:

#### 1. Create `src/pages/signup.astro`

**File**: `src/pages/signup.astro` (new)
**Changes**: New Astro page mirroring login.astro structure, using SignupForm

```astro
---
import logo from '@/images/generic/logo-white.png';
import Layout from '@/layouts/BaseLayout.astro';
import SignupForm from '@/components/SignupForm.svelte';

const CF_SITE_KEY = Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY || '1x00000000000000000000AA';

const errorMappings = {
  MISSING_TOKEN:
    'Token wygasł lub nie istnieje. Zaloguj się ponownie. W razie dalszych problemów, skontaktuj się z nami: kontakt@przeprogramowani.pl.',
  MISSING_USER: 'W bazie użytkowników nie odnaleziono Twojego adresu email. Sprawdź, na jaki email kupiłeś kurs.',
  MISSING_COURSES:
    'Brak zakupionych kursów dla podanego adresu email. Sprawdź, na jaki email kupiłeś kurs i uwzględnij czy dokonywałeś zwrotów.',
  INVALID_OAUTH: 'Nieprawidłowy token uwierzytelniający. Spróbuj zalogować się ponownie.',
  OAUTH_FAILED: 'Niepowodzenie uwierzytelniania. Spróbuj ponownie lub użyj innej metody logowania.',
  NO_VERIFIED_EMAIL: 'Nie znaleziono zweryfikowanego adresu email. Upewnij się, że Twoje konto ma zweryfikowany email.',
  OAUTH_ERROR: 'Wystąpił błąd podczas logowania przez serwis zewnętrzny. Spróbuj ponownie później.',
  EMAIL_FAILED: 'Nie udało się wysłać wiadomości email. Spróbuj ponownie lub skontaktuj się z nami.',
  AUTH_FAILED: 'Nie udało się zalogować przez serwis zewnętrzny. Spróbuj ponownie lub skontaktuj się z nami.',
};

const successMappings = {
  EMAIL_SENT: 'Na Twój adres email wysłaliśmy link do logowania. Sprawdź swoją skrzynkę.',
  LOGGED_IN: 'Zostałeś pomyślnie zalogowany. Za chwilę nastąpi przekierowanie...',
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

// If user has an active token, redirect to courses
if (Astro.cookies.has('token')) {
  return Astro.redirect('/courses');
}
---

<Layout>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
    <img src={logo.src} alt="Logo" class="w-64 mx-auto mb-4 pb-4" />
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg">
      <SignupForm cfSiteKey={CF_SITE_KEY} client:only="svelte" />
      {errorMsg && <p class="text-red-500 text-sm text-center mt-4">{errorMsg}</p>}
      {successMsg && <p class="text-green-500 text-sm text-center mt-4">{successMsg}</p>}
    </div>
    <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
    ></script>
  </div>
</Layout>
```

#### 2. Create `src/components/SignupForm.svelte`

**File**: `src/components/SignupForm.svelte` (new)
**Changes**: New Svelte component based on Login.svelte, with newsletter checkbox added

```svelte
<script lang="ts">
  import { useCaptchaCallback } from '../hooks/useCaptcha.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  interface SignupFormProps {
    cfSiteKey: string;
  }

  const { cfSiteKey }: SignupFormProps = $props();

  let email = $state('');
  let newsletterOptIn = $state(true); // Pre-checked by default
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
      await axios.post('/api/auth', { email, newsletterOptIn });
      success = 'Na wskazany email wysłaliśmy link — kliknij go, aby aktywować konto';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          error = 'Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.';
        } else {
          error = err.response?.data?.error || 'Wystąpił błąd podczas rejestracji';
        }
      } else {
        error = 'Wystąpił nieoczekiwany błąd';
      }
    } finally {
      loading = false;
    }
  }

  function handleSocialLogin(provider: 'github' | 'google') {
    // Set newsletter opt-in cookie before OAuth redirect
    if (newsletterOptIn) {
      document.cookie = 'newsletter_optin=1; path=/; max-age=600; secure; samesite=lax';
    } else {
      // Clear any existing cookie if unchecked
      document.cookie = 'newsletter_optin=; path=/; max-age=0; secure; samesite=lax';
    }
    window.location.href = `/api/auth/${provider}`;
  }
</script>

<h2 class="mt-6 text-center text-2xl font-main text-white">Utwórz konto</h2>

<form onsubmit={handleSubmit} class="mt-8 space-y-6">
  <div>
    <label for="email" class="sr-only">Email address</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      bind:value={email}
      class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Adres email" />
    <p class="mt-2 text-sm text-gray-400 text-center">Wyślij formularz aby otrzymać link do logowania.</p>
  </div>

  <!-- Newsletter opt-in checkbox -->
  <div class="flex items-start">
    <input
      id="newsletter"
      name="newsletter"
      type="checkbox"
      bind:checked={newsletterOptIn}
      class="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-900 text-indigo-600 focus:ring-indigo-500" />
    <label for="newsletter" class="ml-2 text-sm text-gray-400 cursor-pointer">
      Chcę otrzymywać wiadomości email dotyczące szkolenia 10xDevs oraz powiadomienia o nowych wpisach i filmach dot. programowania z AI
    </label>
  </div>

  <div id="cf-captcha-container" class="hidden"></div>

  {#if error}
    <div class="text-red-500 text-sm">{error}</div>
  {/if}

  {#if success}
    <div class="text-green-500 text-sm">{success}</div>
  {/if}

  <div>
    <button
      type="submit"
      disabled={!isCaptchaVerified || loading}
      class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
      {#if loading}
        Rejestracja...
      {:else}
        Zarejestruj się
      {/if}
    </button>
  </div>

  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-gray-800 text-gray-400">Lub dołącz przez</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        onclick={() => handleSocialLogin('github')}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd" />
        </svg>
        GitHub
      </button>

      <button
        type="button"
        onclick={() => handleSocialLogin('google')}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
        </svg>
        Google
      </button>
    </div>
  </div>

  <div class="mt-4 text-center text-sm text-gray-400">
    Masz już konto?
    <a href="/login" class="text-indigo-400 hover:text-indigo-300">Zaloguj się</a>
  </div>
</form>
```

#### 3. Update `src/pages/login.astro` — redirect `?mode=signup` and update switch link

**File**: `src/pages/login.astro`
**Changes**: Add redirect for `mode=signup`, update switch link to `/signup`

```diff
 // If user has an active token, redirect to courses
 if (Astro.cookies.has('token')) {
   return Astro.redirect('/courses');
 }

-const mode = Astro.url.searchParams.get('mode') === 'signup' ? 'signup' : 'login';
+// Redirect signup mode to dedicated signup page
+if (Astro.url.searchParams.get('mode') === 'signup') {
+  return Astro.redirect('/signup');
+}
```

In `Login.svelte`, update the switch link from `/login?mode=signup` to `/signup`:
```diff
-    href={mode === 'login' ? '/login?mode=signup' : '/login'}
+    href="/login?mode=signup"
```

Wait — since Login.svelte will now only be used in login mode, simplify: remove the `mode` prop entirely and hardcode login copy. The switch link becomes `/signup`.

Actually, to minimize changes to Login.svelte and keep this phase focused, just update the link target:

**File**: `src/components/Login.svelte`
**Changes**: Update switch link to point to `/signup` instead of `/login?mode=signup`

The `mode` prop and copy object can remain for backwards compatibility but the `signup` branch is now unused. The link on line 169 changes:

```diff
-      href={mode === 'login' ? '/login?mode=signup' : '/login'}
+      href="/signup"
```

And since `mode` will always be `login` now, we can also simplify the `switchText`/`switchLink` usage, but that's optional cleanup.

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` completes without errors
- [x] TypeScript types check: no type errors in new files
- [ ] `/signup` page renders (manual dev server check)

#### Manual Verification:

- [ ] `/signup` shows the signup form with newsletter checkbox (pre-checked)
- [ ] `/login?mode=signup` redirects to `/signup`
- [ ] `/login` shows the login form without newsletter checkbox
- [ ] Login page "Nie masz konta? Zarejestruj się" link goes to `/signup`
- [ ] Signup page "Masz już konto? Zaloguj się" link goes to `/login`
- [ ] Captcha works on signup page

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: MailerLite Integration in Auth API

### Overview

Add `10XDEVS_MAILERLITE_API_KEY` and `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` env vars. Modify `POST /api/auth` to accept `newsletterOptIn` and subscribe the user to MailerLite fire-and-forget.

### Changes Required:

#### 1. Add env vars to `astro-env.ts`

**File**: `astro-env.ts`
**Changes**: Add two new optional env vars

```typescript
10XDEVS_MAILERLITE_API_KEY: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
```

Both are optional so the build doesn't break without them configured.

#### 2. Create newsletter subscription helper

**File**: `src/server/newsletter.ts` (new)
**Changes**: Thin helper that wraps the MailerLite SDK call

```typescript
import MailerLite from '@mailerlite/mailerlite-nodejs';

export async function subscribeToNewsletter(
  email: string,
  apiKey: string,
  groupId: string
): Promise<void> {
  const mailerlite = new MailerLite({ api_key: apiKey });
  const res = await mailerlite.subscribers.createOrUpdate({
    email,
    status: 'unconfirmed',
    groups: [groupId],
  });
  console.info('[newsletter] Subscribed', { email, groupId, status: res.status });
}
```

#### 3. Update `src/pages/api/auth.ts`

**File**: `src/pages/api/auth.ts`
**Changes**: Extract `newsletterOptIn` from body, call MailerLite fire-and-forget

```diff
-import { SITE_URL, MAILING_SERVICE_URL, JWT_SECRET, ENV, RESEND_API_KEY } from 'astro:env/server';
+import { SITE_URL, MAILING_SERVICE_URL, JWT_SECRET, ENV, RESEND_API_KEY, 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID } from 'astro:env/server';
+import { subscribeToNewsletter } from '@/server/newsletter';

 export const POST: APIRoute = async ({ request, locals }: APIContext) => {
   const responseHeaders = new Headers();

   try {
-    const { email } = await request.json();
+    const { email, newsletterOptIn } = await request.json();

     if (!email) {
       return createJsonResponse({ error: 'Email jest wymagany' }, 400, responseHeaders);
     }

+    // Newsletter subscription — fire-and-forget
+    if (newsletterOptIn && 10XDEVS_MAILERLITE_API_KEY && 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID) {
+      subscribeToNewsletter(email, 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID)
+        .catch((err) => console.error('[newsletter] Subscription failed:', err));
+    }
+
     const token = await generateToken(email, JWT_SECRET);
```

Note: The auth endpoint doesn't have access to `ctx.waitUntil` (it's a simple POST handler, not a Cloudflare Pages function with execution context in the same way the OAuth callbacks have). The detached promise is fine here — Cloudflare Workers will attempt to complete it but won't guarantee completion after response. If we need guaranteed delivery, we can wrap it with `locals.runtime.ctx.waitUntil()`:

```typescript
if (newsletterOptIn && 10XDEVS_MAILERLITE_API_KEY && 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID) {
  const nlPromise = subscribeToNewsletter(email, 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID)
    .catch((err) => console.error('[newsletter] Subscription failed:', err));
  locals.runtime.ctx.waitUntil(nlPromise);
}
```

Use the `waitUntil` version since `locals.runtime.ctx` is available in this endpoint.

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` completes without errors
- [x] TypeScript types check for new imports and `subscribeToNewsletter`

#### Manual Verification:

- [ ] Set `10XDEVS_MAILERLITE_API_KEY` and `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` in `.env.local`
- [ ] Submit signup form with checkbox checked → email appears in MailerLite group
- [ ] Submit signup form with checkbox unchecked → no MailerLite subscription
- [ ] Auth flow (magic link email) still works correctly regardless of checkbox state
- [ ] Console shows `[newsletter] Subscribed` log on successful subscription

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: OAuth Newsletter Opt-In via Cookie

### Overview

Wire up the newsletter opt-in for GitHub and Google OAuth flows using a short-lived `newsletter_optin` cookie (set client-side in `SignupForm.svelte`, already done in Phase 1). Read and consume the cookie in both OAuth callback handlers.

### Changes Required:

#### 1. Update `src/pages/api/auth/github/callback.ts`

**File**: `src/pages/api/auth/github/callback.ts`
**Changes**: Read `newsletter_optin` cookie, add MailerLite call to sync chain

```diff
+import { subscribeToNewsletter } from '@/server/newsletter';
+import { 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID } from 'astro:env/server';

 // Inside the GET handler, after clearing oauth_state cookie:
+    // Read and consume newsletter opt-in cookie
+    const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
+    cookies.delete('newsletter_optin', { path: '/' });

 // Inside the syncPromise chain (after existing sync calls):
     const syncPromise = upsertUser(primaryEmail, syncEnv)
       .then(async (userId) => {
         await upsertGrant(userId, 'explorers', 'free', syncEnv);
         await Promise.allSettled([
           syncFromAirtable(userId, primaryEmail, syncEnv),
           syncAllCircleCourses(userId, primaryEmail, syncEnv),
         ]);
+        // Newsletter subscription
+        if (newsletterOptIn && 10XDEVS_MAILERLITE_API_KEY && 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID) {
+          await subscribeToNewsletter(primaryEmail, 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID);
+        }
       })
       .catch((err) => console.error('[github/callback] Supabase sync failed:', err));
```

#### 2. Update `src/pages/api/auth/google/callback.ts`

**File**: `src/pages/api/auth/google/callback.ts`
**Changes**: Same pattern as GitHub callback

```diff
+import { subscribeToNewsletter } from '@/server/newsletter';
+import { 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID } from 'astro:env/server';

 // Inside the GET handler, after clearing oauth_state cookie:
+    // Read and consume newsletter opt-in cookie
+    const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
+    cookies.delete('newsletter_optin', { path: '/' });

 // Inside the syncPromise chain:
     const syncPromise = upsertUser(userInfo.email, syncEnv)
       .then(async (userId) => {
         await upsertGrant(userId, 'explorers', 'free', syncEnv);
         await Promise.allSettled([
           syncFromAirtable(userId, userInfo.email, syncEnv),
           syncAllCircleCourses(userId, userInfo.email, syncEnv),
         ]);
+        // Newsletter subscription
+        if (newsletterOptIn && 10XDEVS_MAILERLITE_API_KEY && 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID) {
+          await subscribeToNewsletter(userInfo.email, 10XDEVS_MAILERLITE_API_KEY, 10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID);
+        }
       })
       .catch((err) => console.error('[google/callback] Supabase sync failed:', err));
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` completes without errors
- [x] TypeScript types check for new imports in both callback files

#### Manual Verification:

- [ ] Sign up via GitHub with checkbox checked → email in MailerLite group
- [ ] Sign up via Google with checkbox checked → email in MailerLite group
- [ ] Sign up via GitHub with checkbox unchecked → no MailerLite subscription
- [ ] OAuth flow completes normally (redirect to `/courses`)
- [ ] `newsletter_optin` cookie is cleaned up after callback (not persisted)
- [ ] Console shows `[newsletter]` logs in callback

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- `src/server/newsletter.test.ts` — test `subscribeToNewsletter` with mocked MailerLite SDK (verify correct email, status, groupId are passed)

### Integration Tests:

- Not required for this feature — MailerLite SDK calls are fire-and-forget and the subscription is verified manually via the MailerLite dashboard

### Manual Testing Steps:

1. Start dev server, navigate to `/signup`
2. Verify checkbox is pre-checked
3. Submit with valid email → check MailerLite dashboard for new subscriber in target group
4. Uncheck checkbox, submit → verify no new subscriber
5. Click GitHub login with checkbox checked → complete OAuth → check MailerLite
6. Navigate to `/login?mode=signup` → verify redirect to `/signup`
7. Navigate to `/login` → verify no checkbox, link says "Zarejestruj się" pointing to `/signup`

## Performance Considerations

- MailerLite SDK creates a new instance per call. For a signup page with low traffic this is fine. If volume becomes a concern, consider caching the SDK instance.
- The `newsletter_optin` cookie is tiny (1 byte value) and short-lived — no performance impact.
- Fire-and-forget pattern ensures zero impact on auth response latency.

## Environment Setup

Before testing, add to `.env.local`:
```
10XDEVS_MAILERLITE_API_KEY=your-api-key-here
10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID=your-group-id-here
```

For production, add both as secrets in the Cloudflare Pages dashboard (Settings → Environment Variables).

## References

- Research document: `thoughts/shared/research/2026-03-30-signup-newsletter-checkbox.md`
- MailerLite SDK handler: `projects/common/src/components/newsletter/NewsletterSignupHandler.ts`
- OAuth state cookie pattern: `src/pages/api/auth/github.ts:25-31`
- Fire-and-forget sync pattern: `src/pages/api/auth/github/callback.ts:142-151`
- Existing newsletter endpoint reference: `projects/opanuj-frontend/src/pages/api/newsletter-signup.ts`
