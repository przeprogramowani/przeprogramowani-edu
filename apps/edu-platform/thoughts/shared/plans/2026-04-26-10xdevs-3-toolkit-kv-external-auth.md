# 10xDevs 3 Toolkit KV External Auth Bridge Implementation Plan

> Brief: `thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth-brief.md`

## Overview

Add a temporary `edu-platform` auth bridge for the soon-to-launch `/external/10xdevs-3` course. The bridge reads the same Cloudflare KV membership namespace that `10x-toolkit/packages/api` writes and that `10x-cli` indirectly relies on through toolkit auth. This lets 10xDevs 3 external access follow the current toolkit membership authority before the centralized multi-course access broker is implemented.

This plan is intentionally narrow. It does not implement the future access broker, does not change `10x-cli`, and does not migrate every course. It creates a small, isolated service in `edu-platform` that can be replaced later by the toolkit integration API described in `/Users/admin/code/10x-toolkit/thoughts/shared/plans/2026-04-26-multi-course-access-broker.md`.

## Current State Analysis

`edu-platform` already exposes external course routes and has `10xdevs-3` Circle config:

- `src/server/circle/externalAuthConfig.ts:46-53` defines `10xdevs-3` with Circle space `2552674`.
- `src/pages/api/external/auth.ts:47-49` checks `resolveMembership()` before sending the external magic link.
- `src/server/externalAuth.ts:55-96` checks Supabase grants first, then falls through to the edu-platform Circle resolver and mirrors Circle grants back into Supabase.
- `src/pages/external/[courseId]/verify.astro:45-60` issues the unified `token` cookie, then syncs Supabase via `syncForCourse()`.
- `wrangler.toml:6-11` binds `CIRCLE_MEMBERS` to edu-platform's Circle membership cache namespace, not toolkit's membership namespace.

`10x-toolkit/packages/api` already maintains the desired 10xDevs 3 membership KV:

- `/Users/admin/code/10x-toolkit/packages/api/wrangler.toml:29-31` binds `CLI_10X3_MEMBERSHIP_KV` to namespace ID `dd7fed61a71d42bfbace69865f18e9bb`.
- `/Users/admin/code/10x-toolkit/packages/api/src/services/circle-sync.ts:10-24` defines `MembershipRecord` with `memberId`, `email`, `hasAccess`, `syncedAt`, and `source`.
- `/Users/admin/code/10x-toolkit/packages/api/src/services/circle-sync.ts:36-45` normalizes email with lowercase/trim, hashes SHA-256 hex, and stores records under `member:<hash>`.
- `/Users/admin/code/10x-toolkit/packages/api/src/services/circle-sync.ts:290-315` writes the union of the 10xDevs 3 Circle space and space group into KV.
- `/Users/admin/code/10x-toolkit/packages/api/src/services/auth.ts:128-135` rejects toolkit CLI auth login if that KV lookup is missing.
- `/Users/admin/code/10x-toolkit/packages/api/src/services/auth.ts:371-375` re-checks the same KV on refresh.

The later broker plan says toolkit should own access, while edu-platform keeps its browser session and consumes toolkit access decisions. This quick bridge should align with that direction without implementing the full broker yet.

## Desired End State

External 10xDevs 3 login and page access are decided by toolkit's current membership KV when `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.

For `/external/10xdevs-3`:

- Login denies before sending a magic link if toolkit KV has no active `member:<hash>` record.
- Page guards deny if toolkit KV has no active record, even if Supabase has a stale local grant.
- Verify re-checks toolkit KV before setting the browser token and mirrors a Supabase grant only after the email magic link is verified.
- Production fails closed if the toolkit KV binding is missing.
- Non-production may fall back to the legacy Supabase/Circle path when the binding is missing.
- A rollback env var can switch `10xdevs-3` back to the legacy path without code changes.

All other external courses keep their current behavior.

### Key Discoveries

- The current edu-platform `CIRCLE_MEMBERS` key format is `v1-membership-<platform>-<spaceId>-<email>` (`src/server/circle/membershipCache.ts:4-14`), while toolkit membership keys are `member:<sha256(email)>`. Rebinding `CIRCLE_MEMBERS` would collide conceptually with a different schema.
- The toolkit membership KV is already stronger for 10xDevs 3 than edu-platform's current v1 single-space check because toolkit sync unions the course space and course space group.
- Existing route tests for `/api/external/auth` live in `tests/api/external/auth.test.ts` and mock the auth decision service, so the bridge should expose a similarly small test seam.
- Existing `verifyExternalAuth` tests live in `src/server/externalAuth.test.ts` and already cover the Supabase fast path and Circle fallback; they must be updated so toolkit mode bypasses Supabase for `10xdevs-3`.

## What We're NOT Doing

- Not implementing the centralized multi-course access broker in `10x-toolkit`.
- Not adding toolkit HTTP integration endpoints.
- Not changing `10x-cli`.
- Not changing toolkit's KV writer, sync schedule, or membership schema.
- Not replacing edu-platform's `CIRCLE_MEMBERS` cache for other courses.
- Not moving all course access checks to toolkit.
- Not making Supabase authoritative for `10xdevs-3` external access in toolkit mode.
- Not adding arbitrary course aliases such as `10xdevs3` to edu-platform external routes in this bridge.
- Not enforcing freshness from `syncedAt` or `_sync:last`; toolkit sync health remains an operational dependency until the broker exists.

## Implementation Approach

Create an explicit read-only KV binding in `edu-platform`:

```toml
{ binding = "TOOLKIT_10X3_MEMBERSHIP_KV", id = "dd7fed61a71d42bfbace69865f18e9bb" }
```

Then add a small server service, `src/server/toolkit/tenXDevs3Membership.ts`, responsible for:

- deciding whether toolkit mode applies,
- hashing normalized email using the same SHA-256 hex algorithm as toolkit,
- reading `member:<hash>` from `TOOLKIT_10X3_MEMBERSHIP_KV`,
- parsing toolkit `MembershipRecord`,
- accepting only `hasAccess === true`,
- returning structured decisions without logging raw email.

Integrate this service in three places:

1. `src/pages/api/external/auth.ts` before the existing `resolveMembership()` call.
2. `src/server/externalAuth.ts` after token verification and before Supabase fast path.
3. `src/pages/external/[courseId]/verify.astro` before setting the cookie and before Supabase mirroring.

The bridge is gated by:

```text
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE = "toolkit_kv" | "legacy"
```

Recommended behavior:

- `toolkit_kv`: use toolkit KV for `10xdevs-3`; no Supabase/Circle fallback in production.
- `legacy`: keep current Supabase/Circle flow for rollback. For `10xdevs-3`, this legacy fallback must check the 10xDevs 3.0 Lessons space `2552674`, not any 10xDevs 2.0 space.
- unset in `ENV === "PROD"`: treat as `toolkit_kv` so production follows the intended launch authority.
- unset outside `PROD`: allow legacy fallback to keep local dev smooth.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Login request timing**: toolkit KV is checked before magic-link token generation. If denied, no magic link is sent.
- **Verify timing**: toolkit KV is checked again after the magic link token is verified but before the unified `token` cookie is set. This prevents a user from receiving a link, losing access, and still getting a fresh platform cookie.
- **Page guard timing**: `verifyExternalAuth()` checks toolkit KV on every external page request for `10xdevs-3` in toolkit mode.
- **Supabase mirroring timing**: mirror the `10xdevs-3` grant only after successful verify, not during login request.
- **KV eventual consistency**: the bridge trusts the toolkit KV hot path and does not perform request-time Circle revalidation.

**Derived from**: current external login/verify/page guard flow and the selected decisions Q5.1, Q7.2, and Q4.2.

### User Experience Specification

- **Allowed user**: submits email on `/external/10xdevs-3/login`, receives magic link, clicks it, receives the unified `token` cookie, and can open `/external/10xdevs-3/*`.
- **Denied user**: receives a `403` from `/api/external/auth` before any email is sent. Use a generic Polish access message, not the current Circle-specific text.
- **Revoked after email sent**: verify redirects back to login with an access error and does not set the cookie.
- **Rollback mode**: with `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy`, behavior returns to current Supabase/Circle logic and verifies 10xDevs 3.0 membership against Circle space `2552674`.
- **Other courses**: no visible behavior change.

**Derived from**: user decisions Q1.2, Q2.3, Q5.1, and Q8.2.

### Performance & Optimization Strategy

- One KV read per `10xdevs-3` login attempt and page guard.
- One SHA-256 digest per check; this matches toolkit's existing hashing and is negligible compared with Circle API calls.
- No Circle API call on the toolkit path.
- No KV list/scan on request paths.
- No `_sync:last` read on request paths.

**Derived from**: toolkit's current auth path and selected decision Q4.2.

### State Management Sequencing

Login:

```text
POST /api/external/auth
  -> validate email/course
  -> if courseId === "10xdevs-3" and mode toolkit_kv:
       check TOOLKIT_10X3_MEMBERSHIP_KV member:<hash>
       deny if missing/malformed/hasAccess !== true
  -> generate magic link
  -> send email
```

Verify:

```text
/external/10xdevs-3/verify
  -> validate magic-link token
  -> re-check toolkit KV
  -> set unified token cookie
  -> upsert profile
  -> upsert explorers free grant
  -> upsert 10xdevs-3 circle grant with toolkit metadata
  -> redirect
```

Page guard:

```text
verifyExternalAuth()
  -> read unified/legacy token cookie
  -> verify JWT email
  -> if courseId === "10xdevs-3" and mode toolkit_kv:
       check toolkit KV and return allowed/denied
  -> otherwise use current Supabase/Circle logic
```

**Derived from**: current `src/pages/api/external/auth.ts`, `src/pages/external/[courseId]/verify.astro`, and `src/server/externalAuth.ts`.

### Debug & Observability Plan

- **Verification Method**: unit tests for hashing/KV decisions, route tests for login and page guard, and manual preview smoke with one allowed and one denied email.
- **Logging Strategy**:
  - `tenx3_toolkit_access.check` with `emailHash`, `courseId`, `mode`, `allowed`, `reason`, and `recordSource`.
  - `tenx3_toolkit_access.misconfigured` when production lacks `TOOLKIT_10X3_MEMBERSHIP_KV`.
  - `tenx3_toolkit_access.legacy_fallback` only outside production or explicit legacy mode.
- **Debug Instrumentation**: optionally extend `src/pages/api/external/membership-debug.ts` or add a follow-up debug endpoint only if manual preview smoke is blocked. Do not expose raw toolkit KV values by default.
- **Timing Debug**: compare toolkit KV decision with preview login/page requests; do not log raw email.
- **Metrics**: no dashboard in this quick bridge; use structured logs and preview smoke.

**Derived from**: existing log style and selected verification bar Q9.2.

## Phase 1: Toolkit KV Binding and Service

### Overview

Add the explicit Cloudflare binding, env typing, rollback mode, and a testable service for reading toolkit's 10xDevs 3 membership KV.

### Changes Required

#### 1. Cloudflare and env configuration

**Files**:

- `wrangler.toml`
- `src/env.d.ts`
- `astro-env.ts`

**Changes**:

- Add KV binding:

```toml
{ binding = "TOOLKIT_10X3_MEMBERSHIP_KV", id = "dd7fed61a71d42bfbace69865f18e9bb" }
```

- Add optional env var:

```text
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE = "toolkit_kv" | "legacy"
```

- Add to `Env`:

```ts
TOOLKIT_10X3_MEMBERSHIP_KV?: KVNamespace;
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE?: string;
```

- Add optional `astro-env.ts` string field for `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE`.

#### 2. Toolkit membership service

**File**: `src/server/toolkit/tenXDevs3Membership.ts` (new)

**Changes**:

- Add constants:

```ts
export const TEN_X_DEVS_3_COURSE_ID = '10xdevs-3';
export const TOOLKIT_KV_MODE = 'toolkit_kv';
export const LEGACY_MODE = 'legacy';
```

- Add record type matching toolkit:

```ts
interface ToolkitMembershipRecord {
  memberId: number;
  email: string;
  hasAccess: boolean;
  syncedAt: string;
  source: 'bulk_sync' | 'webhook' | 'seed';
}
```

- Add `hashEmail(email)` using lowercase/trim + `crypto.subtle.digest('SHA-256')`.
- Add `getToolkitMemberKey(emailHash) -> member:<hash>`.
- Add mode resolver:

```ts
function resolveTenXDevs3AuthMode(env: EnvLike): 'toolkit_kv' | 'legacy'
```

- Add main checker:

```ts
export async function checkTenXDevs3ToolkitMembership(
  email: string,
  courseId: string,
  env: TenXDevs3ToolkitEnv
): Promise<TenXDevs3ToolkitMembershipDecision>
```

Expected decision shape:

```ts
type TenXDevs3ToolkitMembershipDecision =
  | { applies: false; reason: 'not_10xdevs_3' | 'legacy_mode' | 'dev_missing_binding_fallback' }
  | { applies: true; allowed: true; emailHash: string; record: { memberId: number; source: string; syncedAt: string } }
  | { applies: true; allowed: false; emailHash?: string; reason: 'missing_binding' | 'missing_record' | 'malformed_record' | 'inactive_record' | 'invalid_mode' };
```

Production rules:

- If `courseId !== '10xdevs-3'`, return `applies: false`.
- If mode is `legacy`, return `applies: false`.
- If mode is `toolkit_kv` and binding is missing in `ENV === 'PROD'`, return denied with `missing_binding`.
- If binding is missing outside production, return `applies: false` with `dev_missing_binding_fallback`.
- If record is missing, malformed, or `hasAccess !== true`, deny.
- Do not check freshness.
- Do not log raw email.

#### 3. Unit tests

**File**: `src/server/toolkit/tenXDevs3Membership.test.ts` (new)

**Changes**:

- Test hash output against toolkit-compatible known SHA-256 for normalized email.
- Test active record allows.
- Test missing record denies.
- Test malformed record denies.
- Test `hasAccess: false` denies.
- Test production missing binding denies.
- Test non-production missing binding returns legacy fallback.
- Test `legacy` mode returns `applies: false`.
- Test other course IDs return `applies: false`.

### Success Criteria

#### Automated Verification

- [x] Unit tests pass: `npm run test -- src/server/toolkit/tenXDevs3Membership.test.ts`
- [x] Type checking via build passes: `npm run build`

#### Manual Verification

- [ ] Cloudflare Pages preview has `TOOLKIT_10X3_MEMBERSHIP_KV` bound to namespace `dd7fed61a71d42bfbace69865f18e9bb`.
- [ ] Preview has `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.
- [ ] Existing `CIRCLE_MEMBERS` binding remains unchanged.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that the Pages binding exists before proceeding.

---

## Phase 2: External Login and Page Guard Integration

### Overview

Wire the toolkit KV service into external auth for `10xdevs-3` only. Other courses keep the legacy Supabase/Circle behavior.

### Changes Required

#### 1. External login pre-check

**File**: `src/pages/api/external/auth.ts`

**Changes**:

- Import `checkTenXDevs3ToolkitMembership`.
- After course config validation and email normalization, call the service.
- If `decision.applies && !decision.allowed`, return `403`.
- If `decision.applies && decision.allowed`, skip `resolveMembership()` and continue to magic-link generation.
- If `!decision.applies`, continue existing `resolveMembership()` flow.

User-facing denial message:

```text
Nie masz aktywnego dostępu do 10xDevs 3.0 dla tego adresu email. Sprawdź, czy używasz właściwego adresu.
```

Keep current Circle-specific message for legacy courses.

#### 2. External page guard

**File**: `src/server/externalAuth.ts`

**Changes**:

- Import `checkTenXDevs3ToolkitMembership`.
- After JWT payload email is verified, call the service.
- If `decision.applies && decision.allowed`, return authenticated immediately.
- If `decision.applies && !decision.allowed`, return unauthenticated immediately.
- Do not check Supabase first for `10xdevs-3` in toolkit mode. This enforces Q2.3 and prevents stale local grants from allowing access.
- Keep existing Supabase/Circle path when service returns `applies: false`.

#### 3. Verify page re-check and Supabase mirror

**File**: `src/pages/external/[courseId]/verify.astro`

**Changes**:

- Import `checkTenXDevs3ToolkitMembership`.
- After `verifyMagicLink()` returns an email, run the toolkit service.
- If toolkit mode applies and denies, redirect to:

```text
/external/10xdevs-3/login?error=NO_ACCESS
```

- Only after allowed, set the unified `token` cookie.
- In the Supabase sync promise:
  - always upsert user,
  - always upsert `explorers` free grant as today,
  - for toolkit-mode `10xdevs-3`, upsert `10xdevs-3` with source `circle` and `source_meta`:

```json
{
  "toolkit10x3Membership": true,
  "toolkitSource": "<record.source>",
  "toolkitSyncedAt": "<record.syncedAt>",
  "toolkitMemberId": 123
}
```

- Do not call `syncForCourse()` for toolkit-mode `10xdevs-3`.
- Keep existing `syncForCourse()` for all legacy courses and for `10xdevs-3` when rollback mode is `legacy`.
- Confirm the legacy fallback uses `getExternalAuthConfig('10xdevs-3').spaceId === 2552674`, so rollback checks the 10xDevs 3.0 Lessons space.

#### 4. Login error display

**File**: `src/pages/external/[courseId]/login.astro`

**Changes**:

- If current login page maps error query params, add `NO_ACCESS` mapping with a generic no-access Polish message.
- If error rendering is inside `ExternalLogin.svelte`, update that component instead.
- Do not add visible explanatory text beyond the existing error surface.

### Success Criteria

#### Automated Verification

- [x] External auth route tests pass: `npm run test -- tests/api/external/auth.test.ts`
- [x] External page guard tests pass: `npm run test -- src/server/externalAuth.test.ts`
- [x] Full test suite passes: `npm run test`
- [x] Build passes: `npm run build`

#### Manual Verification

- [x] In preview with toolkit mode, known allowed email can request magic link for `/external/10xdevs-3`.
- [x] In preview with toolkit mode, denied email gets `403` from `/api/external/auth` and no email is sent.
- [x] Known allowed email can click verify link and open `/external/10xdevs-3/`.
- [x] Existing `/external/10xdevs-2` behavior still works through the legacy path.
- [x] In rollback mode `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy`, `10xdevs-3` uses the old Supabase/Circle path against Circle space `2552674`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual preview confirmation before proceeding.

---

## Phase 3: Tests and Preview Smoke

### Overview

Expand automated coverage around the new authority decision and document the required launch smoke checks.

### Changes Required

#### 1. Update `/api/external/auth` tests

**File**: `tests/api/external/auth.test.ts`

**Changes**:

- Mock `checkTenXDevs3ToolkitMembership`.
- Add `10xdevs-3` toolkit allow test:
  - service returns `applies: true, allowed: true`,
  - `resolveMembership()` is not called,
  - magic link is generated and sent.
- Add `10xdevs-3` toolkit deny test:
  - service returns `applies: true, allowed: false`,
  - response is `403`,
  - no magic link/token/email calls.
- Add dev fallback test:
  - service returns `applies: false, reason: 'dev_missing_binding_fallback'`,
  - existing `resolveMembership()` path is used.
- Keep existing opanuj-frontend tests.

#### 2. Update `verifyExternalAuth` tests

**File**: `src/server/externalAuth.test.ts`

**Changes**:

- Mock `checkTenXDevs3ToolkitMembership`.
- Add toolkit allow test:
  - Supabase `hasGrant` mock would return false,
  - service returns allow,
  - result authenticates.
- Add toolkit deny test:
  - Supabase `hasGrant` mock would return true,
  - service returns denied,
  - result is unauthenticated.
- Add legacy mode test:
  - service returns `applies: false, reason: 'legacy_mode'`,
  - existing Supabase/Circle tests still apply.

#### 3. Add or verify login error test

#### 3a. Verify legacy rollback space config

**File**: `src/server/circle/externalAuthConfig.test.ts`

**Changes**:

- Keep or add coverage that `getExternalAuthConfig('10xdevs-3')` resolves to Circle space `2552674`.
- Keep or add coverage that `getExternalAuthConfig('10xdevs-2')` remains on Circle space `2166705`.
- This ensures rollback mode checks the 10xDevs 3.0 Lessons space, not the 10xDevs 2.0 space.

**File**:

- `src/pages/external/[courseId]/login.astro` or `src/components/ExternalLogin.svelte`
- Related component test if one exists

**Changes**:

- Verify `NO_ACCESS` renders a user-facing no-access error if the project already tests login errors.
- If no suitable test harness exists, cover this in manual smoke instead of adding a fragile Astro page test.

#### 4. Preview smoke checklist

**File**: plan references only, unless ops docs are added in Phase 4.

**Manual smoke**:

1. Confirm toolkit sync has run recently by checking toolkit Worker logs or known `member:<hash>` key for an allowed email.
2. Deploy edu-platform preview with:
   - `TOOLKIT_10X3_MEMBERSHIP_KV` bound to `dd7fed61a71d42bfbace69865f18e9bb`,
   - `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.
3. POST `/api/external/auth` for an allowed email and `courseId=10xdevs-3`; expect `200`.
4. POST `/api/external/auth` for a denied email and `courseId=10xdevs-3`; expect `403`.
5. Complete magic-link verify for allowed email; expect redirect to `/external/10xdevs-3/`.
6. Open one lesson and one markdown export under `/external/10xdevs-3`.
7. Switch preview mode to `legacy`; confirm rollback path still allows a known user who has access through Circle space `2552674`.

### Success Criteria

#### Automated Verification

- [x] `npm run test -- src/server/toolkit/tenXDevs3Membership.test.ts`
- [x] `npm run test -- src/server/circle/externalAuthConfig.test.ts`
- [x] `npm run test -- tests/api/external/auth.test.ts`
- [x] `npm run test -- src/server/externalAuth.test.ts`
- [x] `npm run test`
- [x] `npm run build`

#### Manual Verification

- [x] Allowed preview smoke passes.
- [x] Denied preview smoke passes.
- [x] Rollback env smoke passes against Circle space `2552674`.
- [x] Other external course smoke spot-check passes.

**Implementation Note**: After completing this phase, pause for explicit launch readiness confirmation.

---

## Phase 4: Ops Notes and Cleanup Hooks

### Overview

Document how the temporary bridge is configured, rolled back, and removed when the centralized toolkit access broker is ready.

### Changes Required

#### 1. Documentation

**Files**:

- `docs/external-10xdevs-3-toolkit-kv-auth.md` (new) or an existing external auth docs file if present
- `wrangler.toml` comments

**Changes**:

- Document the physical KV namespace:

```text
TOOLKIT_10X3_MEMBERSHIP_KV -> 10x-toolkit CLI_10X3_MEMBERSHIP_KV -> dd7fed61a71d42bfbace69865f18e9bb
```

- Document env mode:

```text
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy
```

- Document rollback:
  - set env var to `legacy`,
  - redeploy/restart Pages environment if needed,
  - verify `/external/10xdevs-3` returns to old Supabase/Circle behavior.

- Document removal path:
  - replace `checkTenXDevs3ToolkitMembership()` call sites with future toolkit broker HTTP client,
  - remove `TOOLKIT_10X3_MEMBERSHIP_KV`,
  - remove `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE`,
  - delete `src/server/toolkit/tenXDevs3Membership.ts` and tests.

#### 2. Source comments

**Files**:

- `src/server/toolkit/tenXDevs3Membership.ts`
- `src/server/externalAuth.ts`
- `src/pages/api/external/auth.ts`

**Changes**:

- Add short comments that this is a temporary bridge to the pre-broker toolkit KV.
- Link to this plan path.
- Avoid broad comments that imply this is the long-term access model.

### Success Criteria

#### Automated Verification

- [x] Docs file exists and names binding/env/rollback/removal.
- [x] `npm run build`

#### Manual Verification

- [x] Operator can identify the rollback env var from docs.
- [x] Operator can identify the Cloudflare KV namespace ID from docs.
- [x] Follow-up broker cleanup path is clear.

**Implementation Note**: Pause after docs are complete so the launch/ops owner can verify Cloudflare configuration.

---

## Testing Strategy

### Unit Tests

- `hashEmail()` matches toolkit's SHA-256 normalized email behavior.
- `member:<hash>` key construction matches toolkit.
- Active toolkit record allows access.
- Missing, malformed, inactive, invalid mode, and missing production binding all deny.
- Non-production missing binding falls back to legacy.
- Legacy mode bypasses toolkit service.

### Route/Integration Tests

- `/api/external/auth` for `10xdevs-3` skips Circle resolver when toolkit allows.
- `/api/external/auth` for `10xdevs-3` denies without sending email when toolkit denies.
- `verifyExternalAuth()` denies `10xdevs-3` even if Supabase has stale grant when toolkit denies.
- `verifyExternalAuth()` allows `10xdevs-3` when toolkit allows even if Supabase lacks a grant.
- Existing opanuj-frontend/10xdevs-2 legacy tests stay green.
- `10xdevs-3` legacy rollback uses Circle space `2552674`; `10xdevs-2` remains on Circle space `2166705`.

### Manual Testing Steps

1. Bind `TOOLKIT_10X3_MEMBERSHIP_KV` to `dd7fed61a71d42bfbace69865f18e9bb` in preview.
2. Set `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.
3. Use a known allowed email from toolkit membership KV to request and complete external login.
4. Use a known denied email to confirm `/api/external/auth` returns `403`.
5. Open `/external/10xdevs-3/`, a lesson page, and a markdown export.
6. Confirm a user with a stale local Supabase grant but no toolkit KV record is denied.
7. Set mode to `legacy` in preview and confirm rollback behavior against Circle space `2552674`.

## Performance Considerations

- Toolkit path replaces Circle API calls with a single KV read.
- Page guard adds one KV read per protected request for `10xdevs-3`.
- Supabase is not consulted before toolkit KV in toolkit mode, reducing risk from stale local grants.
- No extra background jobs are required.
- No KV scans run in request paths.

## Migration Notes

Deployment order:

1. Confirm toolkit membership KV has correct 10xDevs 3 members via existing toolkit sync.
2. Add edu-platform binding and env var in preview.
3. Deploy Phase 1 service and tests.
4. Deploy Phase 2 route integration.
5. Run Phase 3 preview smoke.
6. Add docs and production binding.
7. Deploy to production with `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.

Rollback:

1. Set `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy`.
2. Redeploy/restart Pages environment if required by Cloudflare variable propagation.
3. Verify `/external/10xdevs-3` follows current Supabase/Circle path against Circle space `2552674`.

Future broker migration:

1. Implement toolkit `/integrations/access/check` from the broker plan.
2. Replace the KV service call sites with a toolkit HTTP client.
3. Keep the same route-level shape: login pre-check, verify re-check, page guard check.
4. Remove direct KV binding and temporary service after shadow/primary broker rollout is proven.

## References

- Broker brief: `/Users/admin/code/10x-toolkit/thoughts/shared/plans/2026-04-26-multi-course-access-broker-brief.md`
- Broker full plan: `/Users/admin/code/10x-toolkit/thoughts/shared/plans/2026-04-26-multi-course-access-broker.md`
- Edu-platform external login: `src/pages/api/external/auth.ts:47`
- Edu-platform external page guard: `src/server/externalAuth.ts:55-96`
- Edu-platform external verify: `src/pages/external/[courseId]/verify.astro:45-60`
- Edu-platform 10xDevs 3 config: `src/server/circle/externalAuthConfig.ts:46-53`
- Edu-platform current Circle KV binding: `wrangler.toml:9`
- Toolkit membership binding: `/Users/admin/code/10x-toolkit/packages/api/wrangler.toml:29-31`
- Toolkit membership key/hash: `/Users/admin/code/10x-toolkit/packages/api/src/services/circle-sync.ts:36-45`
- Toolkit membership lookup: `/Users/admin/code/10x-toolkit/packages/api/src/services/circle-sync.ts:52-60`
- Toolkit auth membership gate: `/Users/admin/code/10x-toolkit/packages/api/src/services/auth.ts:128-135`
- Existing route tests: `tests/api/external/auth.test.ts`
- Existing guard tests: `src/server/externalAuth.test.ts`

<!-- PLAN COMPLETED: 2026-04-26 -->
