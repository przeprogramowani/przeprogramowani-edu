# External Membership Cache-First And Scheduled Refresh Implementation Plan

## Overview

Implement a single membership-validation policy across external login and external page access: read Cloudflare KV first, only call Circle API when cache is missing or stale, and enforce a strict 2-month freshness window with synchronous revalidation when stale. Add a real Cloudflare scheduled refresh flow so cache maintenance is automatic.

## Current State Analysis

External page access already checks membership cache first through `verifyExternalAuth`, but stale cache is only marked with `needsRefresh` and never actually refreshed in runtime. External login (`/api/external/auth`) still calls Circle API first on every request, then writes cache. Membership cache TTL defaults to 1 week, which conflicts with the requested 2-month freshness policy.

## Desired End State

All membership checks (login + page access) follow the same cache-first rules:
- Fresh cache (<= 2 months): trusted.
- Missing cache: Circle API check, then cache result.
- Revoked cache: one Circle re-check before deny.
- Stale cache (> 2 months): synchronous Circle re-check for that request, then cache update.

A Cloudflare scheduled trigger runs every 2 months and refreshes both `active` and `revoked` cached memberships through a secured internal endpoint.

### Key Discoveries:

- `verifyExternalAuth` is cache-first and only calls Circle on cache miss (`src/server/externalAuth.ts:113`, `src/server/externalAuth.ts:133`).
- Stale state is exposed but not used by any caller (`src/server/externalAuth.ts:123`, `src/pages/external/[courseId]/index.astro:25`, `src/pages/external/[courseId]/[lessonId].astro:25`).
- `backgroundRefreshMembership` exists but has no call sites (`src/server/externalAuth.ts:191`).
- Login API calls Circle first, then caches (`src/pages/api/external/auth.ts:47`, `src/pages/api/external/auth.ts:68`).
- Cache default TTL is 168 hours (1 week) (`src/server/circle/membershipCache.ts:5`, `src/server/circle/membershipCache.ts:76`).
- KV namespace binding for memberships already exists (`wrangler.toml:9`).

## What We're NOT Doing

- No product/business policy changes beyond requested auth/cache behavior.
- No UI redesign for login/error pages.
- No analytics dashboard or long-term reporting in this phase.
- No migration of lesson cache logic.

## Implementation Approach

Create a shared membership-resolution service and make both login endpoint and page auth use it. Replace unused request-time refresh signaling with explicit stale revalidation rules. Add a secured internal refresh endpoint and a dedicated Cloudflare scheduled trigger (every 2 months) that invokes it.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Request-time stale handling**: stale membership cache is not served as authoritative; request blocks for synchronous Circle verification and then proceeds/denies.
- **Scheduled lifecycle**: refresh is performed only by cron path (not on-request background jobs), matching chosen policy.
- **Failure mode**: scheduled refresh errors do not delete cache and do not force immediate lockout.

**Derived from**: chosen behavior for stale entries (`2-3`) and scheduler-only refresh (`4-3`).

### User Experience Specification

- **Login API behavior**:
  - Fresh active cache allows login with no Circle call.
  - Revoked cache triggers one Circle re-check before final deny.
  - Missing cache checks Circle and caches outcome.
- **Protected page behavior**:
  - Fresh active cache allows access.
  - Stale cache forces synchronous Circle re-check for that request.
  - Revoked cache triggers one Circle re-check before final deny.
- **Errors**: keep current user-facing error messages; only backend decision path changes.

**Derived from**: user decisions (`1-2`, `1-2`, `2-3`, `4-1`).

### Performance & Optimization Strategy

- **Cache-first default** reduces Circle API traffic for normal active users.
- **Re-check on stale/revoked** preserves strictness while minimizing unnecessary calls.
- **Scheduled refresh every 2 months** keeps cache from drifting while avoiding high-frequency jobs.
- **Batch-safe endpoint design** (pagination over KV keys) prevents timeouts for larger keysets.

**Derived from**: existing KV caching pattern and selected refresh cadence.

### State Management Sequencing

- **Login request flow**:
  - Validate input/course -> resolve membership via shared resolver -> issue magic link only if resolver returns `active`.
- **Page request flow**:
  - Validate cookie/token -> resolve membership via shared resolver -> continue or redirect.
- **Scheduled refresh flow**:
  - Cron trigger -> authenticated internal endpoint -> iterate cached keys -> Circle check -> write refreshed cache rows.

**Derived from**: current route/auth architecture in `src/pages/external/*` and `src/pages/api/external/auth.ts`.

### Debug & Observability Plan

- **Verification method**: functional path tests for each decision branch (fresh, stale, revoked, missing, Circle error).
- **Logging strategy**:
  - Resolver: decision path (`cache_hit_active`, `cache_stale_recheck`, `cache_revoked_recheck`, `cache_miss_circle`).
  - Scheduler: run start/end + counters (`checked`, `updated_active`, `updated_revoked`, `errors`).
- **Debug instrumentation**: route-level logs with request IDs where available.
- **Metrics**: N/A for this phase (functional verification only, per requirement `5-1`).

**Derived from**: requirement to prioritize functional correctness over metrics.

## Phase 1: Unify Membership Resolution (Cache-First)

### Overview

Refactor membership decision logic into one service used by login and page auth, enforcing 2-month freshness and synchronous stale revalidation.

### Changes Required:

#### 1. Shared membership resolver

**File**: `src/server/circle/membershipResolver.ts` (new)
**Changes**: Add a pure service that implements policy decisions and returns normalized outcomes for login/page contexts.

```ts
export type MembershipDecision =
  | { status: 'active'; source: 'cache' | 'circle' | 'recheck' }
  | { status: 'revoked'; source: 'cache' | 'circle' | 'recheck' }
  | { status: 'error'; reason: string };

export async function resolveMembership(
  email: string,
  courseId: string,
  env: ExternalAuthEnv,
  options: { freshnessHours: number }
): Promise<MembershipDecision> { /* ... */ }
```

#### 2. Login endpoint uses resolver

**File**: `src/pages/api/external/auth.ts`
**Changes**: Replace direct `checkMembershipForCourse` call with shared resolver path. Keep existing response payloads/messages.

```ts
const decision = await resolveMembership(email, courseId, env, { freshnessHours: 24 * 60 });
if (decision.status !== 'active') return denyResponse();
```

#### 3. Page auth uses resolver and removes unused refresh signal path

**File**: `src/server/externalAuth.ts`
**Changes**: Route membership validation through resolver, remove/retire `needsRefresh`-only behavior, enforce synchronous stale re-check.

```ts
const decision = await resolveMembership(email, courseId, env, { freshnessHours: 24 * 60 });
return { isAuthenticated: decision.status === 'active', email, courseId };
```

#### 4. Cache freshness/retention alignment

**File**: `src/server/circle/membershipCache.ts`
**Changes**: Update defaults/config to support 2-month policy (freshness threshold + storage retention long enough to avoid premature key expiry).

### Success Criteria:

#### Automated Verification:

- [x] Unit tests for resolver branches pass: `npm run test -- src/server/circle`
- [x] Existing auth-related tests pass: `npm run test`
- [x] App build succeeds: `npm run build`

#### Manual Verification:

- [ ] Login with known active member succeeds without Circle call when cache is fresh.
- [ ] Login with revoked cache performs one Circle re-check before deny.
- [ ] Page access with stale cache performs synchronous re-check and updates cache.
- [ ] Existing login error texts remain unchanged for users.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Scheduled Refresh Infrastructure (Every 2 Months)

### Overview

Add Cloudflare-driven periodic refresh for cached membership entries by invoking a secured internal endpoint.

### Changes Required:

#### 1. Internal refresh endpoint

**File**: `src/pages/api/external/membership-refresh.ts` (new)
**Changes**: Add protected endpoint that:
- Validates `Authorization: Bearer <EXTERNAL_MEMBERSHIP_REFRESH_SECRET>`.
- Lists membership KV keys by prefix.
- Refreshes both active and revoked entries by re-checking Circle.
- Writes updated status + `verifiedAt`.

```ts
if (!isAuthorized(request, env.EXTERNAL_MEMBERSHIP_REFRESH_SECRET)) return new Response(null, { status: 401 });
for await (const key of listMembershipKeys(env.CIRCLE_MEMBERS)) {
  await refreshOneMembershipKey(key, env);
}
```

#### 2. KV list typing support

**File**: `src/env.d.ts`
**Changes**: Extend `KVNamespace` type with `list()` signature used by refresh endpoint.

#### 3. Cloudflare scheduled trigger worker

**File**: `workers/membership-refresh-cron.ts` (new)
**File**: `wrangler.membership-refresh.toml` (new)
**Changes**: Add dedicated cron worker with `triggers.crons = ["0 3 1 */2 *"]` and secure POST to refresh endpoint.

```ts
export default {
  async scheduled(_event, env) {
    await fetch(`${env.SITE_URL}/api/external/membership-refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.EXTERNAL_MEMBERSHIP_REFRESH_SECRET}` },
    });
  },
};
```

#### 4. Secret and ops docs

**File**: `docs/external-membership-cache.md` (new)
**Changes**: Document scheduler deployment, required secrets, and manual run command for incident recovery.

### Success Criteria:

#### Automated Verification:

- [x] Refresh endpoint auth and key iteration tests pass: `npm run test -- tests/api/external`
- [x] Scheduler worker compiles/lints in CI command set.
- [x] Full test suite still passes: `npm run test`

#### Manual Verification:

- [ ] Manual authenticated POST to refresh endpoint updates sample cached rows.
- [ ] Unauthorized call to refresh endpoint returns `401`.
- [ ] Scheduled worker invocation reaches endpoint successfully in staging.
- [ ] On Circle/API failure during refresh, cache entries are retained.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Hardening, Cleanup, And Regression Validation

### Overview

Finalize behavior, remove dead paths, and validate all required decision branches end-to-end.

### Changes Required:

#### 1. Remove obsolete refresh signaling and dead code paths

**File**: `src/server/externalAuth.ts`
**Changes**: Remove `needsRefresh` semantics if no longer needed, remove unused `backgroundRefreshMembership` or repurpose as scheduler helper.

#### 2. Regression test matrix

**File**: `src/server/externalAuth.test.ts` (new/updated)
**File**: `tests/api/external/auth.test.ts` (new/updated)
**Changes**: Add explicit cases for:
- fresh active cache,
- stale active cache,
- fresh revoked cache,
- cache miss,
- Circle error path.

#### 3. Config sanity checks

**File**: `astro-env.ts`
**File**: `.dev.vars` (doc/example only if needed)
**Changes**: Ensure required env vars for refresh secret and 2-month freshness are validated and documented.

### Success Criteria:

#### Automated Verification:

- [x] Resolver and auth regression tests pass: `npm run test`
- [x] Build passes: `npm run build`
- [x] No TypeScript errors in updated auth/cache modules during test/build.

#### Manual Verification:

- [ ] End-to-end login + page access works for active member without unnecessary Circle calls.
- [ ] Revoked users are denied after mandatory re-check.
- [ ] Stale cache requests are synchronously revalidated before access.
- [ ] Scheduler path can be manually triggered and produces expected cache updates.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- Resolver decision matrix for all cache/API branches.
- Key parser and course mapping logic for refresh endpoint key iteration.
- Auth guards for refresh endpoint secret validation.

### Integration Tests:

- `/api/external/auth` with mocked KV + mocked Circle API.
- `verifyExternalAuth` invoked by external page routes with stale/fresh/revoked scenarios.
- Refresh endpoint processing a mixed set of active/revoked keys.

### Manual Testing Steps:

1. Seed KV with fresh `active` record, confirm login/page access without Circle call.
2. Seed KV with stale `active` record (>2 months), confirm synchronous Circle re-check on access.
3. Seed KV with `revoked` record, confirm one Circle re-check before deny.
4. Trigger refresh endpoint with valid secret, verify active/revoked rows are refreshed.
5. Trigger refresh endpoint with invalid secret, verify `401`.

## Performance Considerations

- Cache-first path significantly reduces Circle calls for active users.
- Synchronous stale re-check adds latency only for stale entries.
- 2-month scheduler interval minimizes operational/API load while keeping cache revalidated.
- Refresh endpoint should process KV keys in pages/chunks to avoid execution timeouts.

## Migration Notes

- Existing cached keys remain usable if key format is unchanged.
- If freshness/retention env vars are renamed, provide backward-compatible fallbacks for one deployment cycle.
- If old `needsRefresh` consumers are removed, confirm no route depends on that property.

## References

- Similar implementation: `src/server/circle/membershipCache.ts:30`
- Similar implementation: `src/server/externalAuth.ts:113`
- Similar implementation: `src/pages/api/external/auth.ts:47`
- KV bindings: `wrangler.toml:6`

<!-- PLAN COMPLETED: 2026-02-18 -->
