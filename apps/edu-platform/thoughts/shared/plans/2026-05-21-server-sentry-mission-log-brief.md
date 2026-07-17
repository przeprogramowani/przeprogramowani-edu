# Server-side Sentry + Mission-Log Instrumentation — Plan Brief

> Full plan: `thoughts/shared/plans/2026-05-21-server-sentry-mission-log.md`

## What & Why

Wire Sentry server-side capture into the production Cloudflare Workers runtime and instrument the three `/api/mission-log/*` routes so 500 responses surface in Sentry with route/user/lesson context. The goal is diagnostic: today, when a mission-log call returns 500, all we have is a `console.error` line in the CF tail logs with no way to slice by user, lesson, or upstream service.

## Starting Point

Sentry is half-installed: `@sentry/astro` and `@sentry/cloudflare` are in deps, `astro.config.mjs` registers the integration, and both `sentry.{client,server}.config.js` exist — but the DSN is hardcoded in three places and there's no evidence any server-side event has ever delivered from prod. Worse, every mission-log route catches its own exceptions and returns a 500 `Response` from inside the catch, which is *invisible* to Sentry's worker auto-wrap. So even if the global wiring works, no events would flow.

## Desired End State

Triggering any uncaught throw inside `/api/mission-log/*` in production produces a Sentry event with tags (`route`, `method`, `env`, `cf-ray`), authenticated user (`id` + `email`), and a `mission_log` context (`lessonId`, `devBypassGating`, `badgeId`, `moduleId`). Known 5xx responses returned by route code (BadgesApiError 502/503) also surface as warning-level events so degraded upstream conditions are visible without flooding the error rate.

## Key Decisions Made

| Decision                          | Choice                                              | Why (1 sentence)                                                                              | Source |
| --------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------ |
| Worker wrapping                   | Astro+Cloudflare auto-wrap                          | `@sentry/astro` v10 auto-detects the adapter; no manual `_worker.js` needed (verify in P1).   | Plan   |
| Scope of first PR                 | Sentry wiring + 3 mission-log routes only           | Matches the user's stated goal; helper is reusable for `/api/**` rollout later.               | Plan   |
| Route wrapper shape               | `withApiErrorReporting(handler, { route })` HOF     | Single source of truth for try/catch + capture + tags; zero per-route boilerplate.            | Plan   |
| Sentry context attached           | route/method/cf-ray/env + user{id,email} + mission_log{lessonId,…} | Maximum diagnostic value without dumping raw headers/body PII.                | Plan   |
| Internal helper refactor          | Don't refactor — just capture                       | Throws stay; wrapper catches them. Keeps PR small; refactor once Sentry tells us where to focus. | Plan |
| Non-throw capture policy          | 5xx only (incl. explicit 502/503)                   | Surfaces both bugs and degraded upstream — excludes 401/403/429 noise.                        | Plan   |
| DSN handling                      | Single `PUBLIC_SENTRY_DSN` from env, dedupe references | One source of truth; same DSN flow you'd want long-term.                                  | Plan   |
| Verification                      | Dev probe `?__probe=throw` + prod smoke + remove   | Proves the full pipeline in minutes; gated to non-PROD until the prod smoke step.             | Plan   |

## Scope

**In scope:**
- DSN dedupe via `astro-env.ts` + env reads in the 3 config files.
- New `src/server/observability/withApiErrorReporting.ts` HOF + unit tests.
- Apply HOF to `state.ts`, `generate.ts`, `participation-badge.ts`.
- Dev-only force-throw probe in `generate.ts` for verification, then removal.

**Out of scope:**
- Refactoring `resolveMissionLogUser` / `recordGeneration` / quota helpers to tagged Result returns.
- Instrumenting any other route under `src/pages/api/`.
- Capturing 4xx responses (401, 403, 404, 409, 429) — by-design user errors.
- Replacing the existing `console.error` calls (kept for CF tail logs).
- Custom `_worker.js` entry — only revisited if Phase 1 verification fails.

## Architecture / Approach

```
[CF Workers fetch]
        │
        ▼
[@sentry/astro auto-wrap] ── starts Sentry scope per request ──┐
        │                                                       │
        ▼                                                       │
[Astro middleware: rateLimiter → scannerDetection → externalNoStore]
        │                                                       │
        ▼                                                       │
[withApiErrorReporting(handler, { route })] ─ sets tags, user, ─┘
        │                                       mission_log ctx
        ▼
[mission-log route body]
        │
        ├── throws  → wrapper catches → Sentry.captureException → 500 JSON
        ├── 5xx     → wrapper warns   → Sentry.captureMessage   → pass through
        └── 2xx/4xx → wrapper noop    → pass through
```

## Phases at a Glance

| Phase                                | What it delivers                                        | Key risk                                                                  |
| ------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. Wiring & DSN dedupe               | Env-driven DSN; verified auto-wrap delivers events     | Astro+CF auto-wrap may not work on this version → would need manual wrap  |
| 2. `withApiErrorReporting` HOF       | Pure helper module + unit tests                         | Scope isolation wrong → tags leak across requests (covered by unit test)  |
| 3. Apply HOF to 3 routes             | Mission-log routes capture exceptions + 5xx with tags   | Wrapper changes response shape on edge cases → mitigated by happy-path manual test |
| 4. Dev probe + prod smoke + cleanup  | Proof the pipeline works in PROD                        | Probe accidentally left in prod → automated grep check in P4 success criteria |

**Prerequisites:** Sentry project `przeprogramowani-ju/javascript-astro` access; CF Pages deploy access; ability to authenticate locally with a real mission-log user.
**Estimated effort:** ~1–2 focused sessions across 4 phases; the bulk is Phase 2 (helper + tests) and Phase 4 (deploy + verify).

## Open Risks & Assumptions

- **Assumption:** `@sentry/astro` v10.52 actually auto-wraps the `@astrojs/cloudflare` adapter's worker. Sentry docs say it does. Phase 1 verification (force-throw probe with no wrapper) confirms; if false, scope expands to a manual `withSentry` / `wrapRequestHandler` setup — would be a follow-up plan, not absorbed here.
- **Assumption:** `cf-ray` header is present on every request reaching the worker (it is in Cloudflare's runtime; absent only in pure local dev without `wrangler pages dev`). Wrapper treats missing cf-ray as "don't set the tag" rather than "set undefined".
- **Risk:** Existing `generate.test.ts` may import route internals in a way that doesn't tolerate the wrapper; if so, mocks or refactor needed. Small surface, easy to address.

## Success Criteria (Summary)

- A forced uncaught throw in any of the 3 routes produces a Sentry event with route, user, lesson, env, cf-ray attached — in both DEV and PROD.
- BadgesApiError 502/503 responses produce warning-level Sentry events; 401/403/404/409/429 do not.
- DSN is referenced from `PUBLIC_SENTRY_DSN` env in all three config files; no hardcoded DSN strings in source.
