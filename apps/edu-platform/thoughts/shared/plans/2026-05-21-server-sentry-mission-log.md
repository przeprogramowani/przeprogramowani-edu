# Server-side Sentry Integration + Mission-Log Route Instrumentation

## Overview

Wire `@sentry/astro` server-side capture into the production Cloudflare Workers runtime, and instrument the two `/api/mission-log/*` routes so 500 responses surface in Sentry with enough context (route, userId, lessonId, cf-ray) to diagnose the cause. Scope is intentionally limited to mission-log; the helper introduced here is reusable for the rest of `/api/**` in follow-ups.

**Note (2026-05-21):** During Phase 1 we discovered that `src/pages/api/mission-log/state.ts` had no callers — `mission-log.astro` calls `buildMissionLogState()` directly server-side, bypassing the API route. The file was deleted as dead code. Phase 3 now instruments two routes (`generate.ts`, `participation-badge.ts`) instead of three.

## Current State Analysis

Sentry is **half-installed**:

- `@sentry/astro@^10.52.0` and `@sentry/cloudflare@^10.52.0` are in `package.json` (lines 33–34).
- `astro.config.mjs:14-22` registers the Astro Sentry integration with a hardcoded DSN.
- `sentry.client.config.js` and `sentry.server.config.js` exist and call `Sentry.init`.
- DSN is hardcoded in **three places** (`astro.config.mjs:15`, `sentry.client.config.js:4`, `sentry.server.config.js:4`) and also defined as `PUBLIC_SENTRY_DSN` in `wrangler.toml:22`. Not in `astro-env.ts`.
- No `astro-env.ts` slot for `PUBLIC_SENTRY_DSN`.
- The `@astrojs/cloudflare` adapter emits the worker entry; per Sentry docs, `@sentry/astro` v10 should auto-detect the adapter and wrap the worker via `@sentry/cloudflare`. This needs explicit verification — there's no evidence today that any server-side event has ever delivered from prod.

The two mission-log routes have **inconsistent error handling that defeats Sentry**:

- `src/pages/api/mission-log/generate.ts:28-139` — wraps only `generateBadge` (lines 90-115) and `recordGeneration` (lines 117-138). `resolveMissionLogUser`, `getQuotaForUser`, and JSON parsing live outside any try/catch; their throws bubble to a generic adapter-level 500.
- `src/pages/api/mission-log/participation-badge.ts:15-49` — only wraps `getParticipationBadge`; `resolveMissionLogUser` is uncaught.

**Critical insight:** Every existing try/catch *returns a `Response` object with status 500*. Sentry's worker auto-wrap only sees unhandled throws, not 500 responses produced by route code. So even if the global wrap works perfectly, today's routes will never produce Sentry events — the catch blocks silently swallow everything before Sentry can see it. The fix has to add explicit `Sentry.captureException` inside the catch blocks.

### Key Discoveries

- `@sentry/astro` integration with the `@astrojs/cloudflare` adapter auto-wraps the worker since v10 (Sentry docs, "Astro · Cloudflare Workers" — confirmed via Context7). No manual `_worker.js` needed.
- `sentry.server.config.js` and `sentry.client.config.js` are the documented init points; the integration loads them automatically. Server config runs inside the worker.
- `@sentry/cloudflare` is already a dep but we don't import it directly — the Astro integration does the wrapping internally.
- 10+ uncaught throw sites exist inside `resolveMissionLogUser`, `upsertUser`, `hasGrant`, `getQuotaForUser`, and `recordGeneration` (see "Sources of 500s" below). The plan does **not** refactor these — we capture them as-is.
- `src/middleware/index.ts:58` already composes middleware via `sequence(...)`; adding a Sentry middleware would touch every route, which is out of scope.

### Sources of 500s in /api/mission-log/* (the diagnostic question)

These will start surfacing in Sentry once the wrapper is in place. Listed by route + uncaught throw path:

| Route                  | Throw site                                                 | Cause class               |
| ---------------------- | ---------------------------------------------------------- | ------------------------- |
| generate / pb          | `src/server/missionLog/auth.ts` → `verifyToken`            | JWT crypto failure        |
| generate / pb          | `auth.ts` → `upsertUser` (`userService.ts:30-111`)         | Supabase write failure    |
| generate / pb          | `auth.ts` → `hasGrant` (`accessService.ts:20-27`)          | Supabase read failure     |
| generate / pb          | `auth.ts` → `checkTenXDevs3ToolkitMembership`              | KV read failure           |
| generate / pb          | `auth.ts` → `syncTenXDevs3ToolkitGrant` → `upsertGrant`    | Supabase write failure    |
| generate / pb          | `auth.ts` → `getProfile` (`userService.ts:129-148`)        | Supabase read failure     |
| generate               | `quotaService.ts:102` → recordGeneration update            | Supabase update failure   |
| generate               | `quotaService.ts:115` → recordGeneration insert            | Supabase insert failure   |
| participation-badge    | `badgesApiClient.ts:156,178` → JSON.parse of upstream body | Malformed upstream JSON   |

## Desired End State

1. Triggering an uncaught throw from any `/api/mission-log/*` route in production produces a Sentry event in the `przeprogramowani-ju/javascript-astro` project, with these tags/contexts attached:
   - `route` (e.g. `mission-log.generate`), `method` (`GET`/`POST`), `env` (`PROD`/`DEV`), `cf-ray` (request id).
   - `Sentry.setUser({ id, email })` set when `resolveMissionLogUser` resolves before the throw.
   - `Sentry.setContext('mission_log', { lessonId, devBypassGating, badgeId, moduleId })` set when the request body has been parsed.
2. Explicit 5xx responses produced by route code (the `BadgesApiError` 502 / 503 paths in `generate.ts` and `participation-badge.ts`) also produce Sentry events at `level: 'warning'` so degraded upstream conditions are visible without flooding the error rate.
3. DSN lives in `PUBLIC_SENTRY_DSN` (already in `wrangler.toml:22`), is typed in `astro-env.ts`, and is the single source consumed by `astro.config.mjs` + both `sentry.*.config.js` files. No hardcoded DSN strings remain.
4. A reusable `withApiErrorReporting` HOF in `src/server/observability/` is used by the two mission-log routes. The pattern is documented well enough that other routes can adopt it without re-discussing design.

### Verification

- Local: trigger the dev-only probe in `generate.ts` (`?__probe=throw`); confirm an event lands in Sentry with all expected tags/contexts and a meaningful stack.
- Production: deploy, trigger one real generate call, confirm event arrives; remove the probe in the same PR.

## What We're NOT Doing

- **Not** refactoring `resolveMissionLogUser`, `recordGeneration`, or any service helper to use tagged `Result` return types. Internal throws stay; the wrapper captures them. This keeps the PR focused on observability.
- **Not** instrumenting other `/api/**` routes in this PR. The helper is ready for them; rollout is a follow-up.
- **Not** capturing 4xx responses (401 unauthenticated, 403 module_locked, 409 avatar_missing, 429 quota_exhausted, 404 lesson_not_found). These are user-driven by design — capturing them would drown the signal.
- **Not** moving DSN to a server-only secret. DSNs are designed to be public; `PUBLIC_` prefix stays.
- **Not** introducing a custom worker entry (`_worker.js`). The Astro Sentry integration auto-wraps the adapter's worker; if Phase 1 verification fails on that assumption, we'd revisit in a follow-up plan, not here.
- **Not** changing the public 500 response shape — clients keep getting `{ error: 'Internal server error' }` with status 500. Diagnostic data lives in Sentry, not in the HTTP response.

## Implementation Approach

The plan is layered to make each step verifiable before stacking the next:

1. **Phase 1** proves the foundation: that DSN is sourced from env, and that the Astro integration's auto-wrap actually delivers events from the CF Workers runtime in production. Without this, the rest is decoration.
2. **Phase 2** introduces the reusable HOF in isolation — pure function, easy to unit test.
3. **Phase 3** applies the HOF to the two mission-log routes. Mechanical change; small diff per route.
4. **Phase 4** end-to-end verification with a synthetic dev-only throw probe, then a prod smoke, then probe removal.

## Critical Implementation Details

- **Sentry config files load order on Cloudflare.** Per Sentry docs, both `sentry.client.config.js` and `sentry.server.config.js` are picked up by the `@sentry/astro` integration. The server config runs inside the worker; the client config runs in the browser. Phase 1 verification matters because if the bundle doesn't include the server config (e.g. due to file extension or path mismatch), nothing works regardless of correctness elsewhere.
- **The catch block defeats the auto-wrap.** This is the single most important constraint shaping Phase 2/3: a route that returns a 500 `Response` from a catch block is invisible to Sentry's worker wrap. The wrapper helper must call `Sentry.captureException` explicitly inside its own catch, otherwise we'll have a working Sentry install with no events.
- **`cf-ray` header.** Cloudflare attaches `cf-ray` to every incoming request. Read it from `context.request.headers.get('cf-ray')` in the wrapper, set as a Sentry tag, so events correlate with Cloudflare's own logs.

---

## Phase 1: Verify & solidify Sentry wiring

### Overview

Move DSN to a single env-driven source, type it in `astro-env.ts`, and confirm the Astro+Cloudflare auto-wrap delivers events from the production worker.

### Changes Required

#### 1. astro-env.ts — add PUBLIC_SENTRY_DSN

**File**: `astro-env.ts`
**Changes**: Add `PUBLIC_SENTRY_DSN` to `ASTRO_ENV_SCHEMA` as a public (client-readable) string env var. This makes it typed and available via `import.meta.env`.

#### 2. astro.config.mjs — stop hardcoding DSN

**File**: `astro.config.mjs`
**Changes**: Remove the hardcoded `dsn` literal from the `sentry({...})` integration options. The integration reads DSN from the SDK init at runtime; the `dsn` here is only for sourcemap upload metadata and can stay as-is OR be read from `process.env.PUBLIC_SENTRY_DSN`. Pick the env-read path for consistency.

#### 3. sentry.server.config.js — read DSN from env

**File**: `sentry.server.config.js`
**Changes**: Replace the hardcoded DSN with `import.meta.env.PUBLIC_SENTRY_DSN`. Keep `sendDefaultPii: true`, `tracesSampleRate: 0.1`, `enableLogs: true`, and the `consoleLoggingIntegration`.

#### 4. sentry.client.config.js — read DSN from env

**File**: `sentry.client.config.js`
**Changes**: Same as server config — replace hardcoded DSN with `import.meta.env.PUBLIC_SENTRY_DSN`.

#### 5. Verify the auto-wrap

No code change. Manual verification only:
- Add a temporary throw to a non-critical route handler (uncaught throw at the top of a `mission-log` API route).
- Run `npm run dev`, hit the route via `curl`, confirm the event lands in Sentry.
- If it does NOT land, the `@sentry/astro` v10 auto-wrap assumption is wrong on this version and we need to add `@sentry/cloudflare`'s `wrapRequestHandler` ourselves — this is the only branch in the plan that could expand scope.
- Remove the test throw before moving to Phase 2.

### Success Criteria

#### Automated Verification

- [x] `npm run build` succeeds with no DSN-related type errors.
- [x] `tsc --noEmit` (or `npm run typecheck` if present) passes.
- [x] `grep -n "80ecc85e28e3c8d9369b72e96dc23fe5" .` returns matches only in `wrangler.toml` and `thoughts/` docs (not in `.js`/`.mjs`/`.ts` source).

#### Manual Verification

- [x] Dev server starts; `import.meta.env.PUBLIC_SENTRY_DSN` resolves at both client and server runtime (no undefined-DSN warnings in console).
- [x] A throwaway `throw new Error('sentry-wiring-probe')` placed at the top of a mission-log API route and triggered locally produces a visible event in the Sentry dashboard with stack trace. Confirmed 2026-05-21 via `state.ts` probe (event id `30bb13cb`) — stack trace, transaction, environment tags all present. `state.ts` was then deleted as dead code.
- [x] The probe throw is removed (file deleted entirely).

**Implementation Note**: After this phase passes manual verification, you've confirmed the foundation works. Do NOT proceed to Phase 2 until the throw probe definitively produces an event in Sentry — if it doesn't, stop and re-scope (likely need explicit `@sentry/cloudflare` worker wrap).

---

## Phase 2: Shared API error reporter helper

### Overview

Build a small HOF that wraps any `APIRoute` handler with consistent tagging, exception capture, and 5xx-response capture.

### Changes Required

#### 1. New helper module

**File**: `src/server/observability/withApiErrorReporting.ts` (new)
**Changes**: Export a higher-order function:

```ts
// Signature contract — the rest of the plan depends on this shape.
import type { APIRoute, APIContext } from 'astro';
import * as Sentry from '@sentry/astro';

export interface ApiErrorReporterOptions {
  route: string;             // e.g. "mission-log.generate"
}

export type RouteContextWithSentry = APIContext & {
  sentry: {
    setUser(user: { id: string; email: string }): void;
    setMissionLogContext(ctx: Record<string, unknown>): void;
  };
};

export function withApiErrorReporting(
  handler: (context: RouteContextWithSentry) => Promise<Response> | Response,
  options: ApiErrorReporterOptions,
): APIRoute;
```

The implementation must, per request:
- Open a Sentry isolation scope (`Sentry.withScope(...)`) so tags don't leak across worker requests.
- Set tags inside the scope: `route`, `method` (from `context.request.method`), `env` (from `context.locals.runtime.env.ENV`), `cf-ray` (from `context.request.headers.get('cf-ray')`).
- Pass a `context.sentry` accessor object into the wrapped handler so it can set user/context as it learns them mid-handler. `setUser` calls `Sentry.setUser({ id, email })`; `setMissionLogContext` calls `Sentry.setContext('mission_log', ctx)`.
- Try the handler call:
  - On throw → `Sentry.captureException(err)` at `level: 'error'` (default), then return `new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })`.
  - On return → if `response.status >= 500`, call `Sentry.captureMessage(`5xx from ${route}: ${response.status}`, 'warning')` so explicit 502/503 paths are visible. Return the response unchanged.
- All `console.error` calls remain in route handlers — they're preserved for CF Worker logs.

**Why a code snippet here:** the HOF signature is a contract that Phase 3 depends on; the `context.sentry` accessor object is non-obvious and worth pinning down. Implementation body is left to the implementer.

#### 2. Unit test

**File**: `src/server/observability/withApiErrorReporting.test.ts` (new)
**Changes**: Vitest tests covering:
- Successful handler return passes through unchanged.
- Handler throw → returns 500, calls `Sentry.captureException` once.
- Handler returns 502 → `captureMessage` called with warning level; response returned unchanged.
- Handler returns 200 → no capture.
- Tags include route, method, cf-ray when header is present; cf-ray tag absent (not "undefined") when header missing.
- `context.sentry.setUser` calls `Sentry.setUser`; same for `setMissionLogContext`.

Use `vi.mock('@sentry/astro')` to assert capture calls.

### Success Criteria

#### Automated Verification

- [x] `npx vitest run src/server/observability/withApiErrorReporting.test.ts` passes (9 tests).
- [x] `npm run build` succeeds.
- [x] `tsc --noEmit` passes (or whatever this repo uses for type checking).

#### Manual Verification

- [ ] None for this phase — pure unit-tested utility. Verification happens in Phase 4.

---

## Phase 3: Apply helper to the 2 mission-log routes

### Overview

Wrap the existing route handlers with `withApiErrorReporting`. Call the `context.sentry.setUser` and `setMissionLogContext` accessors at the right points. Keep existing `console.error` calls and the existing response semantics — only behavior change is that exceptions now flow to Sentry with tags.

### Changes Required

#### 1. generate.ts

**File**: `src/pages/api/mission-log/generate.ts`
**Changes**: Wrap with `withApiErrorReporting(handler, { route: 'mission-log.generate' })`. After parsing the body, call `context.sentry.setMissionLogContext({ lessonId, devBypassGating: requestedDevBypass })`. After `resolveMissionLogUser` succeeds, call `setUser`. After `findMissionLogLesson` resolves, extend the mission_log context with `{ badgeId: lesson.badgeId, moduleId: lesson.moduleId }`. Leave the inner try/catch around `generateBadge` and `recordGeneration` intact — they translate specific upstream errors into specific HTTP responses (502/429), which the wrapper will then capture as 5xx warnings automatically (for 502) or ignore (for 429, which is 4xx). Drop the outermost `Internal server error` fallback — the wrapper handles it.

#### 2. participation-badge.ts

**File**: `src/pages/api/mission-log/participation-badge.ts`
**Changes**: Wrap with `withApiErrorReporting(handler, { route: 'mission-log.participation-badge' })`. After `resolveMissionLogUser` succeeds, call `setUser`. Leave the inner try/catch around `getParticipationBadge` — same reasoning as `generate.ts`. The `BadgesApiError` 502 path will be captured by the wrapper as a 5xx warning; the unexpected-error 500 branch (line 47) becomes redundant with the wrapper but keep it for explicit logging clarity (the wrapper still catches; this just gets one extra console.error line, harmless).

#### 3. Update tests

**File**: `src/pages/api/mission-log/generate.test.ts`
**Changes**: Re-run the existing tests. Update mocks/test setup if the test imports route internals; the wrapper should be transparent. If a test mocks `@sentry/astro`, ensure the mock is wired so capture calls don't blow up.

### Success Criteria

#### Automated Verification

- [x] `npx vitest run src/pages/api/mission-log/generate.test.ts` passes.
- [x] `npx vitest run` (full suite) shows no new failures.
- [x] `npm run build` succeeds.
- [x] `tsc --noEmit` passes. (pre-existing unrelated cheerio error in `scripts/repair-prework-code-blocks.ts` only)

#### Manual Verification

- [ ] `npm run dev`; hit `/api/mission-log/generate` with a real lessonId — `badgeImageUrl` returned, quota counts as expected.
- [ ] `/api/mission-log/participation-badge` — response unchanged.

**Implementation Note**: After this phase, no Sentry-visible behavior has been validated yet — only that the wrapper is transparent to happy-path traffic. Phase 4 is where the actual capture is proven.

---

## Phase 4: End-to-end verification

### Overview

Prove that the full pipeline works in dev with a force-throw probe, deploy, repeat in prod, then remove the probe.

### Changes Required

#### 1. Dev-only force-throw probe

**File**: `src/pages/api/mission-log/generate.ts`
**Changes**: Add a small block immediately after body parsing, gated on `env.ENV !== 'PROD'` AND a query param `?__probe=throw`, that throws `new Error('mission-log generate dev probe')`. Purpose: trigger the wrapper's exception path with a request that has parsed lessonId so we can verify the `mission_log.lessonId` context arrives in Sentry.

#### 2. Trigger and verify in dev

No code change. Steps:
- `npm run dev`
- Authenticate locally
- `curl -X POST http://localhost:3000/api/mission-log/generate?__probe=throw -H 'Content-Type: application/json' -d '{"lessonId":"m1-l1"}' --cookie 'token=...'`
- Confirm in Sentry dashboard:
  - Event title contains the error message.
  - Tags include `route=mission-log.generate`, `method=POST`, `env=DEV`, `cf-ray` (present when running under wrangler local).
  - User has email + id.
  - Contexts → `mission_log` shows `lessonId: "m1-l1"`, `devBypassGating: false`.

#### 3. Deploy and prod smoke

No code change. Steps:
- Open a PR with Phase 1–4 changes including the probe.
- After merge + Pages deploy, `curl https://platforma.przeprogramowani.pl/api/mission-log/generate?__probe=throw ...`.
- Confirm Sentry event lands with `env=PROD` and a real cf-ray.

#### 4. Remove the probe

**File**: `src/pages/api/mission-log/generate.ts`
**Changes**: Delete the dev-only probe block in a follow-up commit on the same PR (or a fast-follow PR).

### Success Criteria

#### Automated Verification

- [x] After probe removal: `grep -n "__probe" src/` returns no results. (Vacuous — synthetic probe was skipped per user decision on 2026-05-21.)
- [x] Full test suite still passes. (Verified at end of Phase 3.)

#### Manual Verification

- [~] Sentry event from local probe — **SKIPPED**: user opted not to ship a synthetic probe (2026-05-21).
- [~] Sentry event from prod probe — **SKIPPED**: same reason.
- [x] After probe removal, hitting `?__probe=throw` does nothing — Vacuous (no probe added).
- [ ] Verify in prod: the next naturally-occurring 5xx from `/api/mission-log/{generate,participation-badge}` produces a Sentry event with route, method, env=PROD, cf-ray, user, and `mission_log` context. This is the ground-truth verification — to be confirmed when the first real event lands.

---

## Testing Strategy

### Unit Tests

- `withApiErrorReporting.test.ts` — covers all branches: success passthrough, throw → 500, 5xx → warning capture, 2xx → no capture, tag presence, scope isolation, accessor calls.

### Integration Tests

- Existing `generate.test.ts` continues to pass; wrapper is transparent to happy-path tests.
- No new integration tests for Sentry calls themselves — that's covered by the live Sentry probe in Phase 4 (more reliable than mocking the SDK at integration level).

### Manual Testing Steps

1. Authenticate locally as a real mission-log user.
2. Hit each of the 3 routes happy-path → confirm response unchanged.
3. Trigger probe → confirm Sentry event with all tags/contexts.
4. After deploy, repeat probe in prod.
5. Remove probe, redeploy, confirm route still works.

## Performance Considerations

- `Sentry.withScope` is a no-op when SDK disabled and a very cheap object allocation when enabled. Per-request overhead is negligible compared to the existing Supabase calls.
- `tracesSampleRate: 0.1` (already configured) is appropriate for these routes — they aren't high-RPS endpoints.

## Migration Notes

None. No data model changes, no env var renames. `PUBLIC_SENTRY_DSN` already exists in `wrangler.toml`; we just add it to `astro-env.ts` and reference it from config files.

## References

- Sentry docs (Astro · Cloudflare Workers) via Context7 `/getsentry/sentry-docs` — confirms `@sentry/astro` auto-wraps the `@astrojs/cloudflare` worker.
- Mission-log routes: `src/pages/api/mission-log/{generate,participation-badge}.ts`
- Auth & service helpers with uncaught throw sites: `src/server/missionLog/auth.ts`, `src/server/missionLog/buildState.ts`, `src/server/missionLog/quotaService.ts`, `src/server/supabase/{userService,accessService}.ts`, `src/server/badges/badgesApiClient.ts`
- Existing Sentry config: `astro.config.mjs:14-22`, `sentry.client.config.js`, `sentry.server.config.js`, `wrangler.toml:22`, `astro-env.ts`

<!-- PLAN COMPLETED: 2026-05-21 -->

