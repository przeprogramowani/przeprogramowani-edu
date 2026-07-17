---
date: 2026-03-30T12:00:00+02:00
researcher: Claude
git_commit: 959167aa867b7f05e4a5077b32cbc24709b4ef4c
branch: master
repository: przeprogramowani-sites
topic: "Newsletter opt-in checkbox on signup page with MailerLite integration"
tags: [research, codebase, newsletter, mailerlite, login, signup, edu-platform]
status: complete
last_updated: 2026-03-30
last_updated_by: Claude
last_updated_note: "Added OAuth opt-in cookie strategy for social login flows"
---

# Research: Newsletter opt-in checkbox on signup page with MailerLite integration

**Date**: 2026-03-30T12:00:00+02:00
**Researcher**: Claude
**Git Commit**: 959167aa
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

When `src/pages/login.astro` is launched in signup mode, there should be a checkbox "Chce otrzymywac wiadomosci email dotyczace szkolenia 10xDevs oraz powiadomienia o nowych wpisach i filmach dot. programowania z AI". Once checked, the backend (login) should save the user's email to an additional MailerLite group. Use placeholders for MailerLite IDs. How is MailerLite already integrated in the codebase?

## Summary

MailerLite is fully integrated in `projects/common/` with an SDK wrapper, 21 group IDs, and a reusable signup handler. However, **edu-platform has zero MailerLite integration** today. The login form (`Login.svelte`) already supports a `mode` prop (`login` | `signup`) with distinct copy, but both modes send the same `{ email }` payload to `POST /api/auth`. Implementation requires changes in 3 layers: frontend checkbox, auth API payload, and a new server-side MailerLite subscription call.

## Detailed Findings

### 1. Current Login/Signup Flow

**Login page** (`src/pages/login.astro:45`):
- Reads `?mode=signup` from URL, defaults to `login`
- Passes `mode` to `LoginForm` Svelte component

**LoginForm** (`src/components/Login.svelte`):
- Has distinct copy objects for `login` vs `signup` modes (lines 7-28)
- Both modes POST `{ email }` to `/api/auth` (line 61)
- No additional fields sent in either mode
- No checkbox or opt-in UI exists

**Auth API** (`src/pages/api/auth.ts`):
- POST handler extracts `{ email }` from body (line 20)
- Generates JWT, stores magic link in KV, sends email
- No awareness of signup vs login mode
- No newsletter/MailerLite logic

### 2. Existing MailerLite Integration (in projects/common/)

**SDK Package**: `@mailerlite/mailerlite-nodejs` v1.4.1 (in `projects/common/package.json`)

**Group IDs** (`projects/common/src/components/newsletter/NewsletterGroup.ts`):
```typescript
export enum NewsletterGroup {
  OFEAll = '103732707057469118',
  OFECommunity = '103732713320613868',
  // ... 19 more groups
  KursProgramowanieAI = '131559400083031433',
}
```
No dedicated group for "10xDevs newsletter" or "edu-platform signups" exists yet.

**Signup Handler** (`projects/common/src/components/newsletter/NewsletterSignupHandler.ts`):
```typescript
export async function handleNewsletterSignup({
  request, defaultGroup, apiKey
}): Promise<Response>
```
- Creates MailerLite SDK instance with provided API key
- Calls `mailerlite.subscribers.createOrUpdate({ email, status: 'unconfirmed', groups })`
- Returns JSON response with success/error

**Request Type** (`projects/common/src/components/newsletter/NewsletterRequest.ts`):
```typescript
interface NewsletterRequest {
  email: string;
  groups: NewsletterGroup[];
}
```

**Usage Pattern** (e.g., `projects/opanuj-frontend/src/pages/api/newsletter-signup.ts`):
```typescript
export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  return await handleNewsletterSignup({
    request,
    defaultGroup: NewsletterGroup.OFEAll,
    apiKey: locals.runtime.env.SECRET_MAILERLITE_API_KEY || import.meta.env.SECRET_MAILERLITE_API_KEY,
  });
};
```

### 3. Missing Pieces in edu-platform

| What | Status |
|------|--------|
| `SECRET_MAILERLITE_API_KEY` env var | Not defined in `astro-env.ts` |
| Newsletter signup API endpoint | Does not exist |
| MailerLite group for 10xDevs/edu signups | Not defined in `NewsletterGroup` enum |
| Checkbox UI in LoginForm | Does not exist |
| `newsletterOptIn` flag in auth payload | Not supported |

### 4. Implementation Approach

#### Option A: Inline in auth flow (recommended)

Add the MailerLite subscription directly in the `/api/auth` POST handler, fire-and-forget alongside the magic link send. This keeps the signup atomic -- one request, one user action.

**Frontend changes:**
1. `Login.svelte` -- add `newsletterOptIn` state, render checkbox only when `mode === 'signup'`
2. POST body becomes `{ email, newsletterOptIn: boolean }`

**Backend changes:**
1. `astro-env.ts` -- add `SECRET_MAILERLITE_API_KEY` (optional)
2. `src/pages/api/auth.ts` -- extract `newsletterOptIn` from body; if true, call MailerLite SDK to subscribe email to the placeholder group
3. `NewsletterGroup.ts` -- add placeholder entry like `EduPlatformSignup = 'PLACEHOLDER_GROUP_ID'`

**Subscription call (in auth.ts):**
```typescript
if (newsletterOptIn) {
  const mailerlite = new MailerLite({ api_key: SECRET_MAILERLITE_API_KEY });
  mailerlite.subscribers.createOrUpdate({
    email,
    status: 'unconfirmed',
    groups: ['PLACEHOLDER_GROUP_ID'],
  }).catch(err => console.error('Newsletter signup failed:', err));
}
```

#### OAuth Social Login: Cookie-Based Opt-In (low effort)

The newsletter opt-in can be carried through GitHub/Google OAuth flows using a short-lived cookie -- the same pattern already used for CSRF state (`oauth_state` cookie in `github.ts:25-31`). This is **very low effort**: ~5 lines in `Login.svelte`, ~8 lines in each callback file.

**How it works:**

1. **Before OAuth redirect** -- `Login.svelte` sets a cookie client-side:
```typescript
// In Login.svelte, before navigating to /api/auth/github or /api/auth/google
if (newsletterOptIn) {
  document.cookie = 'newsletter_optin=1; path=/; max-age=600; secure; samesite=lax';
}
window.location.href = '/api/auth/github';
```

2. **In each OAuth callback** (`github/callback.ts`, `google/callback.ts`) -- read and consume the cookie, then append MailerLite call to the existing fire-and-forget sync chain:
```typescript
// Read opt-in preference from cookie
const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
cookies.delete('newsletter_optin', { path: '/' });

// Inside the existing syncPromise (after upsertUser), add:
if (newsletterOptIn) {
  const mailerlite = new MailerLite({ api_key: syncEnv.SECRET_MAILERLITE_API_KEY });
  mailerlite.subscribers.createOrUpdate({
    email: primaryEmail,
    status: 'unconfirmed',
    groups: ['PLACEHOLDER_GROUP_ID'],
  }).catch(err => console.error('Newsletter signup failed:', err));
}
```

**Why this works well:**
- `oauth_state` cookie (`github.ts:25-31`) already proves this cookie-through-OAuth pattern works in production
- Cookie `max-age=600` (10 min) matches the existing OAuth state cookie lifetime -- more than enough for the round-trip
- No changes to OAuth state parameters, query strings, or KV storage needed
- The cookie is `httpOnly: false` (set client-side) but only carries a boolean flag, no sensitive data
- Consumed (deleted) immediately in the callback, so it doesn't persist

**Files touched for OAuth opt-in:**
| File | Changes |
|------|---------|
| `src/components/Login.svelte` | Set `newsletter_optin` cookie before social login redirect (~5 lines) |
| `src/pages/api/auth/github/callback.ts` | Read cookie, call MailerLite in sync chain (~8 lines) |
| `src/pages/api/auth/google/callback.ts` | Same as GitHub callback (~8 lines) |

#### Option B: Separate API endpoint

Create a dedicated `/api/newsletter-signup` endpoint in edu-platform (following the opanuj-frontend pattern) and call it from the frontend after the auth POST succeeds. This decouples auth from newsletter but adds a second network call and failure point.

### 5. Checkbox Text

```
"Chce otrzymywac wiadomosci email dotyczace szkolenia 10xDevs oraz powiadomienia o nowych wpisach i filmach dot. programowania z AI"
```

This should only be visible in signup mode (`mode === 'signup'`), placed between the email input and the submit button.

## Code References

- `src/pages/login.astro:45` - Mode detection from URL params
- `src/components/Login.svelte:5-36` - AuthMode type and copy objects
- `src/components/Login.svelte:50-76` - handleSubmit with POST to /api/auth
- `src/pages/api/auth.ts:16-55` - Auth POST handler
- `projects/common/src/components/newsletter/NewsletterGroup.ts:3-21` - All MailerLite group IDs
- `projects/common/src/components/newsletter/NewsletterSignupHandler.ts:15-55` - Reusable signup handler
- `projects/common/src/components/newsletter/NewsletterRequest.ts` - Request interface
- `projects/opanuj-frontend/src/pages/api/newsletter-signup.ts` - Reference implementation
- `src/pages/api/auth/github.ts:20-31` - OAuth state cookie pattern (reference for newsletter_optin cookie)
- `src/pages/api/auth/github/callback.ts:34,142-151` - Cookie read + fire-and-forget sync chain
- `src/pages/api/auth/google/callback.ts` - Same pattern as GitHub callback
- `astro-env.ts` - Current env var definitions (no MailerLite key)

## Architecture Insights

- MailerLite SDK is a monorepo-level dependency available to edu-platform via workspace imports
- The `handleNewsletterSignup` utility expects a full `Request` object, which makes it more suited for a standalone endpoint (Option B). For inline usage (Option A), call the SDK directly
- Subscriber status `'unconfirmed'` triggers MailerLite's double opt-in flow -- the user receives a confirmation email from MailerLite separately
- The auth flow already uses fire-and-forget patterns (`ctx.waitUntil`) for Supabase sync -- the same pattern works for MailerLite subscription

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-30-space-explorers-lead-magnet-analysis.md` - Identifies zero integration between platform auth and MailerLite; recommends adding newsletter opt-in checkbox to auth flow as TIER 1 quick win
- `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md` - Free user signup plan (removes Airtable gate), touches Login.svelte and auth paths
- `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md` - Documents all auth gates that were removed for free signup

## Open Questions

1. Which MailerLite group ID should be used? Need to create a new group in MailerLite dashboard or use an existing one (e.g., `KursProgramowanieAI`)?
2. ~~Should the checkbox also appear for social login (GitHub/Google) flows?~~ **Resolved**: Yes, use a short-lived `newsletter_optin` cookie (same pattern as `oauth_state`). Very low effort -- ~5 lines in `Login.svelte`, ~8 lines per callback. See "OAuth Social Login: Cookie-Based Opt-In" section above.
3. Should the checkbox be pre-checked or unchecked by default? (GDPR best practice: unchecked)
4. Should existing `handleNewsletterSignup` be reused via a separate endpoint, or should the SDK be called directly inline?
