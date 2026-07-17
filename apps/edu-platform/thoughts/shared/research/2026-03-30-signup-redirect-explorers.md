---
date: 2026-03-30T18:00:00+02:00
researcher: Claude Opus 4.6
git_commit: 4f7f3fe4b1f1a3ef784b6cc24d13c8f188e18950
branch: master
repository: przeprogramowani-sites/projects/edu-platform
topic: "Signup page ?redirect=explorers support for post-auth redirect to /explorers"
tags: [research, auth, signup, redirect, explorers, oauth, magic-link]
status: complete
last_updated: 2026-03-30
last_updated_by: Claude Opus 4.6
---

# Research: Signup Page `?redirect=explorers` Support

**Date**: 2026-03-30T18:00:00+02:00
**Researcher**: Claude Opus 4.6
**Git Commit**: `4f7f3fe4`
**Branch**: master
**Repository**: przeprogramowani-sites/projects/edu-platform

## Research Question

When entering `?redirect=explorers` on `src/pages/signup.astro`, both regular signup (magic link) and social sign up (GitHub/Google) should redirect to `/explorers` instead of `/courses`.

## Summary

**There is currently NO support for `?redirect=` parameters anywhere in the auth flow.** All post-authentication redirects are hardcoded to `/courses`. Implementing this requires changes across 6 files in two auth paths (magic link + social OAuth).

### Hardcoded Redirect Locations

| File | Line | Current Redirect |
|------|------|-----------------|
| `src/pages/signup.astro` | 42 | `/courses` (if already logged in) |
| `src/pages/verify.astro` | 53 | `/courses` (after magic link verification) |
| `src/pages/api/auth.ts` | 40 | Magic link URL: `${SITE_URL}/verify?token=${token}` (no redirect param) |
| `src/pages/api/auth/github/callback.ts` | 165 | `/courses` |
| `src/pages/api/auth/google/callback.ts` | 130 | `/courses` |
| `src/components/SignupForm.svelte` | 59 | `/api/auth/{provider}` (no redirect param) |

## Detailed Findings

### 1. Signup Page (`src/pages/signup.astro`)

- Lines 30-38: Reads `?error` and `?success` query parameters
- Line 42: If user already has `token` cookie → `Astro.redirect('/courses')`
- **No `?redirect` parameter is captured or forwarded**

### 2. SignupForm Component (`src/components/SignupForm.svelte`)

**Email (magic link) path:**
- Line 36: POSTs to `/api/auth` with `{ email, newsletterOptIn }` only
- On success, shows message "check your inbox" — no redirect happens in the component itself

**Social auth path (`handleSocialLogin`):**
- Lines 53-60: Sets `newsletter_optin` cookie, then navigates to `/api/auth/{provider}`
- Line 59: `window.location.href = /api/auth/${provider}` — no redirect parameter appended

### 3. Magic Link Auth API (`src/pages/api/auth.ts`)

- Line 40: Constructs magic link as `${SITE_URL}/verify?token=${token}`
- **No mechanism to include a redirect destination in the magic link URL**
- The email body contains only the verify link

### 4. Magic Link Verification (`src/pages/verify.astro`)

- Line 13: Reads `token` from query params
- Line 53: After successful verification → `Astro.redirect('/courses')`
- **No `redirect` query param is read or used**

### 5. OAuth Initiation (`src/pages/api/auth/github.ts` and `google.ts`)

- Both generate a `state` UUID for CSRF protection
- Store `state` in `oauth_state` HttpOnly cookie (10-min TTL)
- Redirect to provider's authorization URL
- **No mechanism to pass a redirect destination through the OAuth flow**

### 6. OAuth Callbacks

**GitHub** (`src/pages/api/auth/github/callback.ts`):
- Line 165: `return Response.redirect(${SITE_URL}/courses, 302)`
- Reads `oauth_state` and `newsletter_optin` cookies
- Performs Supabase sync via `ctx.waitUntil()`

**Google** (`src/pages/api/auth/google/callback.ts`):
- Line 130: `return Response.redirect(${SITE_URL}/courses, 302)`
- Same cookie pattern and sync flow as GitHub

### 7. Existing Cookie Pattern (newsletter_optin)

The newsletter opt-in uses the **exact pattern needed** for redirect:
1. SignupForm sets a short-lived cookie before OAuth redirect
2. Callback reads the cookie after OAuth completes
3. Cookie is consumed (cleared)

This is the proven pattern for persisting state across the OAuth round-trip.

## Code References

- `src/pages/signup.astro:42` — Already-logged-in redirect
- `src/pages/verify.astro:53` — Post magic-link redirect
- `src/pages/api/auth.ts:40` — Magic link URL construction
- `src/pages/api/auth/github/callback.ts:165` — GitHub post-auth redirect
- `src/pages/api/auth/google/callback.ts:130` — Google post-auth redirect
- `src/components/SignupForm.svelte:36` — Email auth POST
- `src/components/SignupForm.svelte:53-60` — Social auth initiation with cookie pattern

## Architecture Insights

### Recommended Implementation Approach

The implementation touches two distinct auth paths that need separate handling:

**Path A: Magic Link (email)**
1. `signup.astro` — Read `?redirect` from URL, pass as prop to `SignupForm`
2. `SignupForm.svelte` — Include `redirect` param in POST body to `/api/auth`
3. `auth.ts` — Append `&redirect=explorers` to the magic link URL: `${SITE_URL}/verify?token=${token}&redirect=explorers`
4. `verify.astro` — Read `redirect` param, redirect to `/explorers` instead of `/courses`

**Path B: Social Auth (GitHub/Google)**
1. `signup.astro` — Read `?redirect` from URL, pass as prop to `SignupForm`
2. `SignupForm.svelte` — Set a `redirect_after_auth` cookie (same pattern as `newsletter_optin`)
3. `github/callback.ts` & `google/callback.ts` — Read `redirect_after_auth` cookie, use as redirect destination

### Security Considerations

- **Must validate redirect targets** to prevent open redirect attacks
- Use an allowlist of valid redirect paths (e.g., `/courses`, `/explorers`)
- Never allow arbitrary URLs or external domains
- The existing `validateReturnUrl()` in `src/server/urlValidation.ts` could be adapted, but a simpler allowlist is sufficient for internal paths

### Allowlist Suggestion

```typescript
const VALID_REDIRECTS: Record<string, string> = {
  'explorers': '/explorers',
  'courses': '/courses',
};
const DEFAULT_REDIRECT = '/courses';
```

Map `?redirect=explorers` → `/explorers`, anything else → `/courses`.

## Related Research

- `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md` — Original free-user signup research
- `thoughts/shared/research/2026-03-30-space-explorers-lead-magnet-analysis.md` — Lead magnet analysis (marketing context for this feature)
- `thoughts/shared/research/2026-03-30-signup-newsletter-checkbox.md` — Signup form newsletter checkbox research

## Open Questions

1. Should the `login.astro` page also support `?redirect=`? (The same flow likely applies there too since login and signup share similar auth paths)
2. Should the redirect parameter be preserved across error→retry flows? (e.g., user gets `?error=MISSING_TOKEN`, returns to signup — should `?redirect=explorers` still be there?)
3. Are there other redirect targets beyond `/explorers` that might be needed in the future?
