# Test Plan

> Phased test rollout for this project. Strategy is frozen at the top
> (§1–§5); cookbook patterns at the bottom (§6) fill in as phases ship.
> Read before writing any new test.
>
> Refresh: re-run `/10x-test-plan --refresh` when stale (see §8).
>
> Last updated: 2026-06-05

## 1. Strategy

Tests follow three non-negotiable principles for this project:

1. **Cost × signal.** The cheapest test that gives a real signal for the
   risk wins. Do not promote to e2e because e2e "feels safer." Do not put a
   vision model on top of a deterministic visual diff that already catches
   the regression.
2. **User concerns are first-class evidence.** Risks anchored in "<the
   team is worried about X, and the failure would surface somewhere in
   <area>>" carry the same weight as PRD lines or hot-spot data.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Hot-spot scope used for likelihood weighting: `server/channels/`,
`server/public/`, `webapp/channels/src/`, `webapp/platform/` (excluding
generated layers, mocks, i18n JSON, e2e-tests, build output). Window:
2026-03-22 → 2026-04-21 — the last 30 days of *available* history; the
checkout is ~45 days stale, noted so future refreshes re-scan.

Project-specific corollary of principle #1: this repo's guard idiom is
"regenerate + fail on porcelain" under blocking CI. Any guard expressible
as a make target emitting a file becomes a hard gate for free — prefer
that seam over new test infrastructure.

## 2. Risk Map

The top failure scenarios this project must protect against, ordered by
risk = impact × likelihood. Risks are failure scenarios in user / business
terms, not test names. The Source column cites the *evidence that surfaced
this risk* — never a specific file as "where the failure lives" (that is
research's job, see §1 principle #3).

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|---|---|---|---|
| 1 | Manual-layer silent passthrough: a store method added or changed without the matching manual-layer override compiles fine, passes all tests, and silently skips search indexing or cache invalidation. Already realized: bulk-imported posts are unsearchable until a manual reindex. | High | High | `context/changes/refactor-opportunities/research.md` §C4 (realized failure); interview Q2, Q3, Q4; hot-spot dirs `server/channels/store/` (79 commits/30d), `server/channels/testlib/` (11/30d) |
| 2 | Column-write corruption: a Post column add/remove/reorder touches one of the two coupled write-mapping functions but not the other; the positional INSERT writes values into the wrong columns. The by-name read path forgives, so same-typed adjacent columns pass the behavior suite silently. | High | Medium | `context/changes/post-flow-analysis/research.md` §TD-2; `refactor-opportunities/research.md` §C2 (no guard confirmed); interview Q1, Q4; hot-spot dir `server/public/model/` (90 commits/30d) |
| 3 | Three-way Post contract drift (Go ↔ TS ↔ OpenAPI): the three hand-maintained copies of the Post contract drift apart; the webapp silently misreads or drops fields. Drift is live today (a Go field absent from TS; OpenAPI ~8 fields behind). | Medium | High | `refactor-opportunities/research.md` §C1 (live drift); `post-flow-analysis/research.md` §TD-1 (2/300 commits co-touch the mirror); `context/map/repo-map.md` R5; hot-spot: config mirror churned on both sides (6 commits each/30d) — the class is active |
| 4 | Search-index hook regression: the save→index behavior in the search layer has zero direct test coverage; a refactor that loses the hook makes all new posts unsearchable with no failing test. | High | Medium | `post-flow-analysis/research.md` §TD-5 item 1 (zero coverage; no indirect coverage via searchtest — confirmed); interview Q4 |
| 5 | Untested error/rollback branches across the save flow: store-error mapping, single-save rollback, persistent-notification validation, auto-translation errors, frontend optimistic-insert rollback. A regression returns wrong error ids or leaves half-applied state. | Medium | Medium | `post-flow-analysis/research.md` §TD-5 items 3, 5, 6, 7, 10 |
| 6 | Per-recipient sanitization leak (abuse lens): the broadcast path strips content/metadata per recipient (burn-on-read bodies, restricted metadata); a strip regression leaks content to unauthorized recipients over WebSocket. Whether any test covers the strip today is unknown — research must verify before tests are written. | High | Low–Medium | `post-flow-analysis/research.md` e2e trace (per-recipient strip recorded as behavior); abuse/leakage class — auth product carrying user content |

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|------|-----------------------------|----------------|--------------------------------------|-----------------------|-----------------------|
| #1 | A forgotten manual-layer override cannot merge: CI fails with a message naming the method and both resolutions (override or exempt-with-reason); bulk-imported posts are searchable without manual reindex | "All tests pass" implies the layers are complete — passthrough is invisible to behavior tests by construction | Generator's AST method extraction; porcelain CI gate semantics; which passthroughs are intentional (exemption policy); whether engine indexing is synchronous/mockable | Generator validation under the existing store-layers gate + Go unit tests | A rubber-stampable porcelain diff; testing generated-layer bodies |
| #2 | A column change touching only one of the two coupled functions fails a fast unit test naming the columns | "The real-DB store suite would catch it" — same-typed adjacent columns swap silently | Serialization edge cases (JSON-encoded props, pointer fields) so the sentinel test isn't fooled | Pure unit test, sentinel-value identity per column | Type-kind comparison (same-kind swaps pass); migrating the intentional positional design instead of guarding it |
| #3 | A field added to one side of the Go/TS/OpenAPI triple without the others fails CI — after known drift is fixed or exempted | "TS-only fields are drift" — client UI-state fields need an exemption policy, not deletion; the oracle is the *contract*, not whichever copy is newest | Go JSON-tag set vs TS keys vs OpenAPI properties; which live drift is real vs intentional; exemption-list shape | Detect-only comparator → non-blocking CI report → blocking | Generation-in-place (mass importer churn); a gate that is red on day one and gets ignored |
| #4 | Removing the index call from the save override fails a test | "The search test suite covers it indirectly" — research confirmed it does not | Whether the engine call has a sync point or is fire-and-forget; what indexed content/ids should be asserted | Go unit characterization test with engine mocks | Asserting only mock call counts — assert indexed content/ids with the oracle from the search contract |
| #5 | Each error branch returns its contracted error id and rolls back fully; the frontend removes the optimistic post on failure | "It returns *an* error so it's fine" — wrong error ids break client-side handling | The contracted error ids (API docs / client expectations) as the oracle — not read back from the implementation | Go app-layer tests with store mocks; one jest test for optimistic rollback | Oracle lifted from the implementation under test (tautological — green-lights possibly-wrong current behavior) |
| #6 | An unauthorized recipient's WebSocket payload provably lacks stripped content (burn-on-read body, restricted metadata) | "The author's payload is correct so all payloads are" — the strip is per-recipient | Whether any existing test covers the strip; the recipient-permission matrix; WS payload construction shape | Go test around broadcast payload construction | Asserting only that *some* event was published; testing only the author's own view |

## 3. Phased Rollout

Each row is a discrete rollout phase that will open its own change folder
via `/10x-new`. Status moves left-to-right through the values below; the
orchestrator updates Status as artifacts appear on disk. Phase 1 adopts the
pre-existing `refactor-opportunities` change, whose approved plan already
delivers this phase's goal — opening a duplicate folder would be waste.

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|---|---|---|---|---|---|
| 1 | Guards & silent-gap closure | Forgotten manual-layer overrides cannot merge; imported posts searchable; column invariant guarded | #1, #2, #4 | unit sentinel test, characterization test, generator validation + CI triage | implementing | context/changes/refactor-opportunities/ |
| 2 | Post contract drift gate | The three-way Post mirror provably in sync (Post pilot), mechanism extensible to the ~58 mirrored types | #3 | comparator script → CI report → blocking gate | not started | — |
| 3 | Error-path & leakage coverage | Untested error/rollback/sanitization branches pinned with contract-oracle tests | #5, #6 | Go app-layer unit tests (store mocks), jest unit test | not started | — |
| 4 | Extend the proven guards | Completeness guard beyond the pilot sub-store; drift gate type-by-type | #1, #3 (class-wide) | same mechanisms, wider scope | not started | — |

## 4. Stack

The classic test base for this project. Test-base profile: **meaningful**
(705 Go test files, 1,466 webapp test files, dual e2e suites) — this
rollout targets researched gaps, not bootstrap.

| Layer | Tool | Version | Notes |
|---|---|---|---|
| Go unit + integration | go test (Go) | 1.25.8 | storetest suite runs against real Postgres; blocking CI |
| Go mocks | mockery | v2.53.4 | regenerated via make target; porcelain-checked in CI |
| webapp unit | Jest + Testing Library | 30.1.3 | 6 jest configs across webapp workspaces |
| e2e (browser) | Playwright | 1.59.1 | in `e2e-tests/playwright/`; not expanded by this rollout (§7) |
| e2e (legacy) | Cypress | 15.13.1 | in `e2e-tests/cypress/`; not expanded by this rollout (§7) |
| AI-native | none | n/a | deliberately omitted — every §2 risk has a cheaper deterministic guard; checked: 2026-06-05 |

**Stack grounding tools (current session):**
- Docs: Context7 — available; not used (no version-sensitive tool claims made; §4 versions read from local manifests); checked: 2026-06-05
- Search: WebSearch/WebFetch — available; not used (local evidence sufficient); checked: 2026-06-05
- Runtime/browser: no Playwright MCP in session — repo carries its own Playwright suite; not used; checked: 2026-06-05
- Provider/platform: GitHub via `gh` CLI — possible future CI-gate verification; not used; checked: 2026-06-05

## 5. Quality Gates

The full set of gates that must pass before a change reaches production.
"Required for §3 Phase <N>" means the gate is enforced once that rollout
phase lands; before that, the gate is `planned`.

| Gate | Where | Required? | Catches |
|---|---|---|---|
| lint + typecheck (Go check-style, webapp eslint/tsc) | local + CI | required (exists) | syntactic / type drift |
| generated-artifact porcelain gates (store layers, mocks, migrations manifest) | CI on PR | required (exists) | stale generated code |
| Go unit + real-Postgres store suite | local + CI | required (exists) | logic and persistence regressions |
| manual-layer completeness validation | CI on PR (store-layers gate) | required after §3 Phase 1 | silent passthrough (Risk #1) |
| column-correspondence sentinel test | local + CI (unit) | required after §3 Phase 1 | positional write drift (Risk #2) |
| Post contract drift gate (Go ↔ TS ↔ OpenAPI) | CI on PR | non-blocking after §3 Phase 2 start; blocking when Phase 2 lands | contract drift (Risk #3) |
| error-path unit coverage | local + CI (unit) | required after §3 Phase 3 | wrong error ids, broken rollback, leakage (Risks #5, #6) |

## 6. Cookbook Patterns

How to add new tests in this project. Each sub-section is filled in once
the relevant rollout phase ships; before that, the sub-section reads
"TBD — see §3 Phase <N>."

### 6.1 Adding a guard for a coupled-array / generated-artifact invariant

- TBD — see §3 Phase 1 (column-correspondence sentinel pattern: value-identity per column, mutation-checked).

### 6.2 Adding a characterization test for a manual store-layer behavior hook

- TBD — see §3 Phase 1 (save→index characterization pattern; exemption-file triage workflow for intentional passthroughs).

### 6.3 Adding a contract drift check for a mirrored Go ↔ TS type

- TBD — see §3 Phase 2 (comparator + exemption policy for client-only UI-state fields).

### 6.4 Adding an error-path test with a contract-sourced oracle

- TBD — see §3 Phase 3 (store-mock app-layer pattern; oracle from API error contract, never from the implementation under test).

### 6.5 Adding a broadcast/sanitization test

- TBD — see §3 Phase 3 (per-recipient payload assertion pattern).

### 6.6 Per-rollout-phase notes

(After each phase lands, /10x-implement appends a 2–3 line note here
capturing anything surprising the rollout phase taught.)

## 7. What We Deliberately Don't Test

Exclusions agreed during the rollout (Phase 2 interview, Q5). Future
contributors should respect these unless the underlying assumption changes.

- **Additional happy-path e2e for the post-save flow** — already heavily
  covered at api4/app/storetest layers; browser tests there add cost, not
  signal. Re-evaluate if a cross-layer integration bug ships that none of
  those layers could have caught. (Source: Phase 2 interview Q5.)
- **UI snapshot tests** — the components tree is the highest-churn area in
  the repo (578 commits/30d); snapshots would be permanent noise.
  Re-evaluate only for stable, leaf-level design-system components.
  (Source: Phase 2 interview Q5.)
- **Generated-layer bodies (retry/timer layers, mocks)** — regeneration +
  the porcelain CI gate is the test; asserting generated output duplicates
  the generator. Re-evaluate if a generator template bug ever ships.
  (Source: interview Q5 discussion; repo guard idiom.)
- **AI-native test layers** — every §2 risk has a cheaper deterministic
  guard (§1 principle #1). Re-evaluate if a risk class emerges that
  deterministic diffs cannot express. (Source: cost × signal analysis.)

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-06-05
- Stack versions last verified: 2026-06-05
- AI-native tool references last verified: 2026-06-05

Refresh (`/10x-test-plan --refresh`) when:

- a new top-3 risk surfaces from the roadmap or archive,
- a recommended tool's `checked:` date is older than three months,
- the project's tech stack changes (new framework, new test runner),
- §7 negative-space no longer matches what the team believes,
- the checkout is refreshed past 2026-04-21 — re-run the hot-spot scan on
  current history (this guide's likelihood weights used a stale window).
