# Test Plan

> Phased test rollout for this project. Strategy is frozen at the top
> (§1–§5); cookbook patterns at the bottom (§6) fill in as phases ship.
> Read before writing any new test.
>
> Refresh: re-run `/10x-test-plan --refresh` when stale (see §8).
>
> Last updated: 2026-05-29 (Phase 1 change opened)

## 1. Strategy

Tests follow three non-negotiable principles for this project:

1. **Cost × signal.** The cheapest test that gives a real signal for the
   risk wins. Do not promote to e2e because e2e "feels safer." Do not put a
   vision model on top of a deterministic visual diff that already catches
   the regression.
2. **User concerns are first-class evidence.** Risks anchored in "the team
   is worried about X, and the failure would surface somewhere in <area>"
   carry the same weight as PRD lines or hot-spot data. This rollout exists
   to build a refactor-enabling safety net over the debt-laden auth/grants
   code (interview Q2–Q4), not to chase coverage numbers.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Hot-spot scope used for likelihood weighting: `src/` (excluding
`src/content/`, `src/content-source/`, `src/assets/`, tests, build output).

## 2. Risk Map

The top failure scenarios this project must protect against, ordered by
risk = impact × likelihood. Risks are failure scenarios in user / business
terms, not test names. The Source column cites the *evidence that surfaced
this risk* — never a specific file as "where the failure lives" (that is
research's job, see §1 principle #3).

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|-------------------------|--------|------------|--------------------------------|
| 1 | The access-decision verdict goes wrong — an entitled user is **denied**, or an unentitled user is **granted** (the Supabase-primary → Airtable-fallback → deny fork) | High | High | interview Q1/Q2/Q4; hot-spot dir `src/server/` (20 commits/30d) |
| 2 | Login-time grant sync (`upsertUser` + Airtable + Circle, **fire-and-forget**) silently fails or partially syncs → a paying user ends with **zero grants and no signal** | High | High | interview Q2/Q4; CLAUDE.md "fire-and-forget on every login"; hot-spot dir `src/server/supabase/` (12 commits/30d) |
| 3 | Course-identity mapping drift — `CourseSlug` ↔ `AirtableCourse` ↔ `LessonCollection` mismatch grants the wrong course or none | High | Medium | interview Q4 (identity resolution); CLAUDE.md CollectionMappings (`CourseSlug`/`AirtableCourse`) |
| 4 | External-route lockout — `/external/[courseId]` unified-token + Supabase grant + the **10xDevs-3 KV toolkit bridge**: an email-hash mismatch after a Circle email change locks out a paid user | High | High | interview Q1; CLAUDE.md toolkit pitfall + `TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING`; hot-spot dirs `src/pages/external/` (19), `src/pages/api/` (45 commits/30d) |
| 5 | Identity-resolution mismatch — the same human via magic-link vs GitHub/Google with case/whitespace email differences yields an **orphaned second profile** or a grant keyed to the wrong email | High | Medium | interview Q4 ("identity resolution"); CLAUDE.md profiles/grants keyed by email; KV record keyed by `sha256(lowercased-email)` |
| 6 | Access-control bypass (IDOR-flavored) — a logged-in **free-tier** user reaches a course they never purchased because the gate checks "is logged in" rather than "is entitled to *this* course" | High | Medium | abuse lens (auth + paid content); interview Q1 |

**Impact × Likelihood rubric.** High = user loses access/data/money or it is
publicly visible / area changes weekly or already burned us; Medium =
degrades with a workaround / touched occasionally, has caused bugs; Low =
cosmetic / stable code. Protect High × High first.

**Abuse / security lens.** The platform has authentication and paid content,
so the map must carry abuse scenarios the happy path excludes: R4 (resource
/ identity lockout) and R6 (authorization / IDOR) are those rows. Two
surfaces were deliberately **demoted, not added**: *secret/PII leakage*
(service-role key / `JWT_SECRET` escaping into logs or error bodies — watch
item; `src/server/observability/` churned 10×/30d) and *magic-link flooding*
(already mitigated — archive `bot-magic-link-protection` + rate-limit
middleware). Re-promote either only if a concrete gap appears.

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|------|-----------------------------|----------------|--------------------------------------|-----------------------|-----------------------|
| #1 | Entitled user → access; unentitled → clean deny; a Supabase miss falls back to Airtable correctly; all three branches asserted independently | "Login success ⇒ access granted" | The verdict entry point, the grant-lookup shape, the exact condition that triggers the Airtable fallback | integration (seeded Supabase grants + mocked Airtable boundary) | Oracle problem — asserting the verdict the code currently returns instead of the entitlement rule |
| #2 | After login an entitled user **has** the expected grants per source; a sync failure is surfaced or retried, not swallowed | "A fire-and-forget call that returned ⇒ grants were written" | What each sync writes, how a failure propagates (or doesn't), what "entitled" means per source (airtable / circle / free / manual) | integration on the sync path (mock Airtable/Circle, real grant store double) | Happy-path-only; over-mocking the grant store so nothing is actually asserted |
| #3 | Every `CourseSlug` resolves to exactly one `AirtableCourse` + `LessonCollection`, and the reverse holds | "The mapping is obviously correct / it's just a constant" | The canonical mapping source of truth and its consumers | unit (table-driven parity over the mapping) | Mirroring the mapping object as its own expected value (tautology) |
| #4 | A paid 10xDevs-3 user resolves via the KV hash; the email-change / legacy-fallback path still grants; a missing record denies cleanly | "A KV hit means the correct user / lowercasing is applied everywhere" | Hash derivation, record JSON shape, the exact effect of the legacy-fallback flag on a `missing_record` | integration (mock KV namespace; toggle the fallback flag) | Brittle hash literal copied from impl; skipping the fallback-flag-off branch |
| #5 | The same email in any case/whitespace resolves to **one** profile and the same grants across login methods | "Emails arrive already normalized" | Where (and whether) normalization happens per login path; profile keying vs KV `lowercased-email` keying | unit + thin integration on identity resolution | Asserting the current normalization output instead of the "one identity" invariant |
| #6 | A logged-in user **without** a grant for course X is denied X (authentication ≠ authorization) | "Authenticated ⇒ authorized" | The gate that maps a session to a per-course entitlement check | integration (valid session, no grant → expect deny) | Testing only the entitled path; treating a 200 on login as proof of gating |

## 3. Phased Rollout

Each row is a discrete rollout phase that will open its own change folder
via `/10x-new`. Status moves left-to-right through the values below; the
orchestrator updates Status as artifacts appear on disk.

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|------------|-----------------|---------------|------------|--------|---------------|
| 1 | Access-decision safety net | Lock the verdict (entitled→access, unentitled→deny, Supabase→Airtable fallback) so the debt-laden auth code can be refactored safely | #1, #6 | integration, unit | change opened | context/changes/testing-access-decision-safety-net/ |
| 2 | Login grant-sync integrity | Prove an entitled user reliably ends up with the right grants, mapping is correct, and a silent sync failure becomes a caught failure | #2, #3 | integration, unit | not started | — |
| 3 | External-route & 10xDevs-3 access | Cover `/external` + KV-bridge lockout/regression, including the email-change and legacy-fallback branches | #4 | integration | not started | — |
| 4 | Identity resolution & email normalization | Guarantee one human = one identity across login methods and email casing | #5 | unit, integration | not started | — |

**Status vocabulary** (fixed — parser literals): `not started` →
`change opened` → `researched` → `planned` → `implementing` → `complete`.

## 4. Stack

The classic test base for this project. AI-native tools (if any) carry a
`checked:` date so future readers can see which lines need re-verification.

| Layer | Tool | Version | Notes |
|-------|------|---------|-------|
| unit + integration | Vitest | ^0.34.6 (root) | `globals: true`, `setupFiles: tests/setup.ts`; node env by default, `jsdom` only for `src/components/**` and the headings util |
| module-boundary mocking | Vitest `vi.mock` / `vi.hoisted` | (built-in) | No MSW. Convention is to mock at the module edge (e.g. `@/server/circle/membershipResolver`, `@/server/toolkit/tenXDevs3Membership`) and invoke the route handler directly |
| API route tests | Vitest (handler-direct) | — | Import the route `POST`/`GET` and pass a hand-built context with `env`. No `unstable_dev` worker spin-up. See `tests/api/external/auth.test.ts` |
| e2e | Playwright | ^1.59.1 | `tests/e2e/**`, excluded from the Vitest run. Used for external-auth / external-login flows |
| accessibility | none yet | — | Not in scope for this rollout (auth/access focus) |
| KV / Supabase doubles | in-test fakes via `env` + `vi.mock` | — | KV namespaces and the Supabase service layer are mocked at the boundary, not run live |

**Stack grounding tools (current session):**
- Docs: Context7 — available; can confirm current Vitest 0.34 / Playwright 1.59 test APIs and Supabase client test patterns; checked: 2026-05-29
- Search: no Exa.ai; built-in WebSearch available for status/discovery only; checked: 2026-05-29
- Runtime/browser: no Playwright MCP in this session — Playwright is present as the configured e2e runner, not as an MCP; checked: 2026-05-29
- Provider/platform: Cloudflare / Supabase / Sentry MCPs are exposed but require interactive auth; potential read-only use for prod log/env verification, not used in this rollout; checked: 2026-05-29

## 5. Quality Gates

| Gate | Where | Required? | Catches |
|------|-------|-----------|---------|
| lint + typecheck (`npm run check` — astro check) | local + CI | required | syntactic / type drift; Astro/Cloudflare type issues `tsc` misses |
| unit + integration (`npx vitest run`) | local + CI | required after §3 Phase 1 | access-decision and grant-sync logic regressions |
| build postcheck (`npm run build`) | local + CI | required | bundler regressions + content-bundling postcheck |
| e2e on external-auth flows (`npm run test:e2e`) | CI on PR | recommended after §3 Phase 3 | broken external login / access paths |
| `nx affected -t lint check test` | CI | required | the canonical CI round-trip |

## 6. Cookbook Patterns

How to add new tests in this project. Each sub-section is filled in once the
relevant rollout phase ships; before that, the sub-section names the future
pattern by behavior.

### 6.1 Adding a unit test
- **Location**: next to the unit under test (e.g. `src/server/**/<name>.test.ts`) or `src/utils/<name>.test.ts`.
- **Naming**: `<module>.test.ts` (project convention; no `.unit.` infix).
- **Reference test**: `src/server/supabase/accessService.test.ts`.
- **Run locally**: `npx vitest run <path>`.

### 6.2 Adding an integration test (service + mocked boundary)
- **Mocking policy**: mock at the module boundary with `vi.mock` + `vi.hoisted` — never reach a live Supabase/Airtable/Circle/KV. Do **not** introduce MSW; match the existing convention.
- **Reference test**: `src/server/circle/membershipResolver.test.ts`.
- TBD — see §3 Phase 1 for the access-decision verdict pattern (entitled/deny/fallback fork) and §3 Phase 2 for the grant-sync integrity pattern.

### 6.3 Adding an e2e test
- TBD — see §3 Phase 3 (external-auth flows in `tests/e2e/`).

### 6.4 Adding a test for a new API endpoint
- **Test type**: integration (preferred).
- **Pattern**: import the route handler (`POST`/`GET`) directly, build a context object with `env`, and mock collaborating modules via `vi.mock`. Assert response shape **and** side-effects (grants written, magic link stored). No worker spin-up.
- **Reference test**: `tests/api/external/auth.test.ts`.
- **When to add e2e instead**: only when the failure mode requires the full deployed shape (cookie + middleware + handler crossing) — see §3 Phase 3.

### 6.5 Adding a test for the course-identity mapping
- TBD — see §3 Phase 2 for the `CourseSlug` ↔ `AirtableCourse` ↔ `LessonCollection` table-driven parity pattern.

### 6.6 Per-rollout-phase notes
(Optional. After each phase lands, `/10x-implement` appends a 2–3 line note here capturing anything surprising the phase taught — e.g. a shared fixture for seeded grants.)

## 7. What We Deliberately Don't Test

Exclusions agreed during the rollout (Phase 2 interview, Q5). Future
contributors should respect these unless the underlying assumption changes.

- **Space Explorers game internals** — out of scope for this auth/access rollout; the game already has its own suite (`src/explorers/**`, `npm run test:explorers`). (Source: interview Q5.)
- **Lesson HTML / markdown export / lesson content** — high-churn, low-risk for access; snapshotting catches little. Re-evaluate only if a content-build rule starts gating access. (Source: interview Q5.)
- **OAuth provider round-trip against real GitHub/Google** — mock the provider boundary; the provider is not ours to test. Test our callback handling, not theirs. (Source: interview Q5.)

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-05-29
- Stack versions last verified: 2026-05-29
- AI-native tool references last verified: 2026-05-29

Refresh (`/10x-test-plan --refresh`) when:

- a new top-3 risk surfaces from the roadmap or archive,
- a recommended tool's `checked:` date is older than three months,
- the project's tech stack changes (new framework, new test runner),
- §7 negative-space no longer matches what the team believes.
