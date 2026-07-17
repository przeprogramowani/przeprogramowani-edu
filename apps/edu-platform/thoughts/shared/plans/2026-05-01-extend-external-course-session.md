# Extend External Course Session Lifetime Implementation Plan

## Overview

Users reported that external courses require authentication every day. The implementation extends the unified platform session from 24 hours to 7 days by aligning the JWT expiration and every session cookie `maxAge` setter behind one shared constant.

This is a reverse-engineered plan for documentation. The implementation has already been completed and verified.

## Current State Analysis

External courses authenticate with the same unified `token` cookie used by the main platform. Before this change, both the JWT payload expiration and every browser session cookie setter were hard-coded to 24 hours, causing daily re-authentication even when course membership remained valid.

Magic links use the same token-generation helper for the email URL, but actual magic-link validity is controlled by the magic-link store. Production KV stores magic links with a 15-minute TTL, so extending the signed JWT session does not make emailed login links valid for 7 days.

## Desired End State

External-course users who authenticate successfully should stay signed in for at least 7 days, provided their browser keeps the cookie and their token remains valid. The JWT `exp` claim and browser cookie `maxAge` should use the same value to avoid mismatched session behavior.

Verification should confirm:

- New session JWTs expire after 7 days.
- All unified `token` cookie writes use the shared 7-day lifetime.
- External auth and existing platform auth tests continue to pass.
- Magic links remain constrained by their 15-minute store-level TTL.

### Key Discoveries:

- `src/server/auth.ts:3` now defines `SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7`.
- `src/server/auth.ts:5` generates the JWT `exp` using that shared session constant.
- `src/pages/external/[courseId]/verify.astro:63` sets the external-course unified `token` cookie, now using the same session constant.
- `src/server/verifyAuth.ts:24` refreshes near-expiry platform tokens and now writes the refreshed cookie with the same 7-day lifetime.
- `src/server/magic-links/remoteMagicLinkManager.ts:26` keeps production magic-link validity at 15 minutes via KV TTL.

## What We're NOT Doing

- Not adding a refresh-token system.
- Not adding a separate external-course-only session cookie.
- Not changing Circle or Supabase membership validation rules.
- Not changing the 15-minute magic-link TTL.
- Not changing legacy `external_token_{courseId}` behavior beyond preserving the existing fallback.
- Not making the session lifetime configurable by environment variable in this pass.

## Implementation Approach

Use a single source of truth for session lifetime in `src/server/auth.ts`, then reuse it anywhere the unified `token` cookie is written. This keeps JWT validity and cookie lifetime aligned across main magic-link login, external-course magic-link verification, OAuth callbacks, and token refresh.

The approach deliberately changes the shared session behavior, not only external routes, because external courses now rely on the unified platform token. A route-only cookie change would leave the JWT itself expiring after 24 hours and would not solve the daily re-authentication problem.

## Phase 1: Centralize Session Lifetime

### Overview

Create one shared session lifetime constant and make generated JWTs expire after 7 days.

### Changes Required:

#### 1. Auth Helper

**File**: `src/server/auth.ts`
**Changes**: Add `SESSION_MAX_AGE_SECONDS` with a 7-day value and use it when calculating the JWT `exp` claim. Keep token verification behavior unchanged.

### Success Criteria:

#### Automated Verification:

- [x] Unit test confirms the session constant equals 7 days: `npx vitest run src/server/auth.test.ts`
- [x] Unit test confirms generated JWT `exp` is `now + SESSION_MAX_AGE_SECONDS`.

#### Manual Verification:

- [x] Code inspection confirms there is no remaining 24-hour JWT expiration in non-content code.

**Implementation Note**: Completed.

---

## Phase 2: Align Unified Session Cookie Writers

### Overview

Update every place that writes or refreshes the unified `token` cookie so the browser cookie lifetime matches the JWT lifetime.

### Changes Required:

#### 1. External Course Verification

**File**: `src/pages/external/[courseId]/verify.astro`
**Changes**: Replace the hard-coded 24-hour cookie `maxAge` with `SESSION_MAX_AGE_SECONDS`.

#### 2. Main Magic-Link Verification

**File**: `src/pages/verify.astro`
**Changes**: Replace the hard-coded cookie lifetime with the shared session constant.

#### 3. Platform Token Refresh

**File**: `src/server/verifyAuth.ts`
**Changes**: When a near-expiry token is refreshed, write the refreshed cookie with the shared session lifetime.

#### 4. OAuth Callback Sessions

**Files**:

- `src/pages/api/auth/github/callback.ts`
- `src/pages/api/auth/google/callback.ts`

**Changes**: Replace each hard-coded 24-hour cookie `maxAge` with the shared session constant.

### Success Criteria:

#### Automated Verification:

- [x] Search confirms no remaining non-content `maxAge: 60 * 60 * 24` session cookie writes.
- [x] External auth regression tests pass: `npx vitest run src/server/externalAuth.test.ts tests/api/external/auth.test.ts`
- [x] Full test suite passes: `npm run test`

#### Manual Verification:

- [x] Code inspection confirms JWT expiry and browser cookie expiry are aligned.

**Implementation Note**: Completed.

---

## Phase 3: Preserve Magic-Link Expiry Safety

### Overview

Confirm that extending the signed token helper does not extend emailed magic-link usability.

### Changes Required:

#### 1. Magic-Link Store Review

**Files**:

- `src/server/magic-links/localMagicLinkManager.ts`
- `src/server/magic-links/remoteMagicLinkManager.ts`

**Changes**: No code changes required. Both local and production magic-link stores already enforce 15-minute expiry independently of JWT `exp`.

### Success Criteria:

#### Automated Verification:

- [x] Existing external auth API tests continue to pass.

#### Manual Verification:

- [x] Code inspection confirms production KV uses `expirationTtl: 900`.
- [x] Code inspection confirms verified magic links are deleted after use.

**Implementation Note**: Completed.

---

## Testing Strategy

### Unit Tests:

- `src/server/auth.test.ts` verifies the shared session constant is 7 days.
- `src/server/auth.test.ts` verifies generated JWT expiration uses the shared constant.

### Integration / Regression Tests:

- `src/server/externalAuth.test.ts` validates external auth behavior across Supabase, Circle fallback, toolkit KV, and legacy cookie fallback.
- `tests/api/external/auth.test.ts` validates external magic-link request flow.

### Manual Testing Steps:

1. Log in to an external course and inspect the `token` cookie max age.
2. Decode the JWT payload in a safe local/debug context and confirm `exp` is roughly 7 days after `nbf`.
3. Revisit an external course after 24 hours and confirm it does not ask for re-authentication.
4. Confirm a stale magic link still fails after the configured 15-minute window.

## Performance Considerations

The change does not add new database calls, network calls, or client-side behavior. Existing membership verification still runs when protected external routes call `verifyExternalAuth`.

## Migration Notes

Existing 24-hour cookies already issued before deployment will keep their original cookie expiration and JWT expiration. Users need to authenticate once after deployment to receive a new 7-day session.

Legacy `external_token_{courseId}` cookies remain accepted only through the existing fallback path and will naturally expire according to their original lifetime.

## References

- Session token lifetime: `src/server/auth.ts:3`
- External-course session cookie: `src/pages/external/[courseId]/verify.astro:63`
- Main magic-link session cookie: `src/pages/verify.astro:34`
- Token refresh cookie: `src/server/verifyAuth.ts:32`
- GitHub OAuth session cookie: `src/pages/api/auth/github/callback.ts:154`
- Google OAuth session cookie: `src/pages/api/auth/google/callback.ts:119`
- Magic-link KV TTL remains 15 minutes: `src/server/magic-links/remoteMagicLinkManager.ts:26`
- Session expiry test: `src/server/auth.test.ts:10`
