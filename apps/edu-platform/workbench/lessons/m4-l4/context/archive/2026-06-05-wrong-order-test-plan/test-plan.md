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
2. **User concerns are first-class evidence.** Risks anchored in "the
   team is worried about X, and the failure would surface somewhere in
   that area" carry the same weight as PRD lines or hot-spot data.
3. **Risks are scenarios, not code locations.** This plan documents *what
   could fail* and *why we believe it's likely* — drawn from documents,
   interview, and codebase *signal* (churn, structure, test base). It does
   NOT claim to know which line owns the failure. That knowledge is
   produced by `/10x-research` during each rollout phase. If the plan and
   research disagree about where the failure lives, research is the
   ground truth.

Hot-spot scope used for likelihood weighting: `server/channels/api4`,
`server/channels/app`, `server/channels/store`, `server/public/model`,
`webapp/channels/src`, `webapp/platform` — window 2026-03-22 → 2026-04-21
(anchored to HEAD date; checkout is behind calendar time), 125 commits.
Generated layers (retrylayer, timerlayer), i18n, snapshots excluded.

Scope note: this rollout is scoped to the **post-save flow** (create post →
persist → broadcast → receive), per the deep research in
`context/changes/post-flow-analysis/research.md`. It is not a whole-repo QA
strategy; widen via `--refresh` when a new area comes into focus.

## 2. Risk Map

The top failure scenarios this project must protect against, ordered by
risk = impact × likelihood. Risks are failure scenarios in user / business
terms, not test names. The Source column cites the *evidence that surfaced
this risk* — never a specific file as "where the failure lives" (that is
research's job, see §1 principle #3).

| # | Risk (failure scenario) | Impact | Likelihood | Source (evidence — not anchor) |
|---|---|---|---|---|
| 1 | **Silent message loss** — a post is accepted (optimistic UI / HTTP 201) but a persistence side-effect, retry-under-contention, or broadcast step silently fails; the sender believes the message sent | High | Medium | interview Q1; post-flow research Summary (post-commit side effects run outside the transaction) + test-gap ranking #2, #5; hot-spot dir `server/channels/store/sqlstore` (37 touches/30d) |
| 2 | **Silent search staleness** — the save→index hook regresses; new posts persist and display but stop being searchable, discovered days later by users | High | Medium | interview Q4; post-flow research test-gap #1 + TD-4/TD-5 (manual wrapper layer, zero direct coverage) |
| 3 | **Data corruption on Post schema change** — the three hand-maintained positional column arrays drift when the next field is added; the positional INSERT writes wrong data into wrong columns with no compiler protection | High | Medium | post-flow research TD-2 + Open Questions (no known CI consistency guard); repo-map R6 (migrations irreversible); recent Posts schema additions evidenced in research |
| 4 | **Front/back Post contract drift** — the manually mirrored Post model (Go ↔ TS) diverges in separate PRs; subtle client rendering/logic bugs | Medium | Medium | post-flow research TD-1 + co-change cluster 3 (2 of 300 commits co-touch both halves); hot-spot: the analogous config contract churned on *both* sides in-window (`config.go` 6, `config.ts` 6); repo-map R5 |
| 5 | **Orchestration regression in create-post error/edge branches** — store-error mapping, persistent-notification recipient validation, HTTP-level dedup, deleted-channel rejection: untested branches in an actively churning orchestrator | Medium | High | interview Q3; post-flow research test-gaps #3, #4, #6, #8, #9 + TD-3 (god file); hot-spot file-level churn in `server/channels/app` (post orchestrator: 5 commits/30d) |
| 6 | **Frontend convergence failure** — a failed create leaves the optimistic post in state, or the three converging delivery paths (optimistic, HTTP response, WS broadcast) produce a duplicate or drop | Medium | Medium | post-flow research test-gap #10 + Architecture Insights (three-path convergence on one reducer, pending-id dedup); hot-spot dir `webapp/channels/src/packages` (27 touches/30d) |
| 7 | **Authorization bypass on post create (abuse)** — a crafted root/channel mismatch or props injection lets a user write into, reply into, or leak metadata from a context they cannot access | High | Low | abuse lens (auth + user input surface); post-flow research notes thread-parent and props validation live at app/store level while the permission test matrix sits at the API level — parity unverified |

### Risk Response Guidance

| Risk | What would prove protection | Must challenge | Context `/10x-research` must ground | Likely cheapest layer | Anti-pattern to avoid |
|------|---|---|---|---|---|
| #1 | A post reported as created is durably persisted AND the `posted` broadcast fires — including under retry/contention and when post-commit side-effects fail | "A 201 / non-error return implies everything after the commit also happened" | Which side-effects run outside the transaction; retry semantics and idempotency under deadlock; where errors are swallowed in async paths | integration (server, DB-backed) + targeted unit on the retry wrapper | Asserting only the HTTP response; over-mocking until the transaction boundary disappears |
| #2 | Saving a post triggers exactly one index call; losing the indexing hook turns a test red | "Persisted implies searchable" | How the manual search wrapper composes around the store; the test seam for the index engine; whether searchtest covers this indirectly (research open question) | unit/integration on the wrapper layer with a fake index engine | Standing up a full search engine container for what a seam-level test catches |
| #3 | Any drift between the three column arrays (or between them and the model/schema) fails a deterministic check before data is written | "The next contributor will update all three arrays in the right order" | The authoritative column-order source; whether any CI guard already exists; a mechanical way to compare arrays against the model/schema | deterministic consistency test (pure unit / lint-style) | A DB round-trip test that stays green with swapped columns (reads are by-name and forgive; writes are positional and do not) |
| #4 | Divergence in field names/JSON tags between the Go Post model and the TS Post type fails a contract check | "Both halves were updated in the same PR" | Canonical serialization (JSON tags) on each side; a feasible comparison mechanism (golden fixture) short of full codegen | contract test (golden JSON fixture both sides must satisfy) | Snapshotting one side only — green while the other half drifts |
| #5 | Each untested error/edge branch returns its documented failure (correct error id / status), not a generic 500 or a silent pass | "Strong happy-path coverage in a mature suite implies branch coverage" | The expected error ids/status codes per branch from requirements, not implementation; which branches are reachable through the HTTP handler vs app-only | app + API integration on the existing harness | Oracle problem: copying expected error strings from the implementation under test |
| #6 | A failed create rolls the optimistic post out of state; the three converging paths never yield a duplicate or a drop | "Reducer convergence works because it usually works" | The action sequences for each delivery path; pending-id dedup rules; the existing redux/nock test harness | jest unit on actions/reducer (existing harness) | Browser e2e for what a reducer test proves (§7); snapshot assertions |
| #7 | A user without channel/thread access cannot create into, reply into, or leak from that context — enforced server-side regardless of client behavior | "Logged-in + channel permission implies thread and props are safe" | Where ownership/membership of the thread parent vs target channel is enforced; which props are dangerous; the boundary of the existing permission test matrix | API integration (existing permission-test idiom) | Testing only through the client SDK happy path; trusting client-side validation |

## 3. Phased Rollout

Each row is a discrete rollout phase that will open its own change folder
via `/10x-new`. Status moves left-to-right through the values below; the
orchestrator updates Status as artifacts appear on disk.

| # | Phase name | Goal (one line) | Risks covered | Test types | Status | Change folder |
|---|---|---|---|---|---|---|
| 1 | Silent-success integrity | Prove "accepted ⇒ persisted ⇒ broadcast ⇒ indexed" cannot silently break | #1, #2 | server integration + unit on wrapper layers | change opened | context/changes/testing-silent-success-integrity/ |
| 2 | Seam guards | Deterministic guards on the two costliest manual couplings (column arrays, front/back contract) | #3, #4 | consistency + contract tests | not started | — |
| 3 | Orchestration & abuse branches | Cover untested error/edge/authz branches in the hot create-post orchestrator | #5, #7 | app + API integration | not started | — |
| 4 | Frontend convergence | Assert rollback and three-path convergence on the posts reducer | #6 | jest (redux actions/reducer) | not started | — |

Order rationale: Phase 1 attacks both High-impact "silent success" failures
(the user's #1 and #4 fears — nothing fires today). Phase 2 is the cheapest
set of tests in the rollout locking the most expensive debt (TD-1, TD-2) and
is a prerequisite for any future Posts schema work. Phase 3 targets the
highest-likelihood area (active churn in the orchestrator) and rides the
same harness for the abuse pass. Phase 4 is self-contained on an existing
jest harness.

## 4. Stack

The classic test base for this project. The suite is **meaningful**: 705 Go
test files, 1,466 webapp jest test files, 119 Playwright + 666 Cypress
specs. The rollout adds *targeted* coverage; it does not bootstrap anything.

| Layer | Tool | Version | Notes |
|---|---|---|---|
| server unit + integration | Go testing + testify | go 1.25.8 / testify 1.11.1 | DB-backed storetest suite is the integration idiom |
| webapp unit | Jest | 30.1.3 | three configs (channels, mattermost-redux, root) |
| webapp API mocking | nock | 13.2.8 | existing idiom in redux action tests |
| e2e (current) | Playwright | 1.59.1 | growing; preferred for new e2e |
| e2e (legacy) | Cypress | 15.13.1 | declining; do not add new specs |
| AI-native | none | n/a | not justified under cost × signal for this rollout — all four phases are deterministic-testable |

**Stack grounding tools (current session):**
- Docs: Context7 MCP — available, not queried (local manifests sufficed for versions); checked: 2026-06-05
- Search: WebSearch tool — available, not used (no stack currency questions arose); checked: 2026-06-05
- Runtime/browser: none — not available in current session; checked: 2026-06-05
- Provider/platform: none — not available in current session; checked: 2026-06-05

## 5. Quality Gates

The full set of gates that must pass before a change reaches production.
"Required for §3 Phase N" means the gate is enforced once that rollout
phase lands; before that, the gate is `planned`.

| Gate | Where | Required? | Catches |
|---|---|---|---|
| lint + typecheck (Go vet / ESLint+tsc) | local + CI | required (already wired) | syntactic / type drift |
| server unit + integration | local + CI | required (already wired); Phase 1 + 3 widen it | logic regressions on the post path |
| webapp jest | local + CI | required (already wired); Phase 4 widens it | redux/state regressions |
| seam consistency + contract checks | CI on PR | required after §3 Phase 2 | column-array drift; front/back Post contract drift |
| generated-layer regen drift (`store-layers`, `store-mocks`, `migrations-extract`) | CI | required (already wired) | stale codegen |
| e2e on critical flows (Playwright) | CI on PR | required (already wired); rollout adds none | broken critical user paths |

## 6. Cookbook Patterns

How to add new tests in this project. Each sub-section is filled in once
the relevant rollout phase ships; before that, the sub-section reads
"TBD — see §3 Phase N."

### 6.1 Adding a silent-success integrity test (persist / broadcast / index)

- TBD — see §3 Phase 1 for the "accepted ⇒ persisted ⇒ broadcast ⇒ indexed"
  pattern, including the fake-index-engine seam and retry-under-contention
  idiom.

### 6.2 Adding a seam guard (consistency / contract test)

- TBD — see §3 Phase 2 for the column-array consistency guard and the
  front/back Post contract (golden fixture) pattern.

### 6.3 Adding an error/edge-branch test in the app or API layer

- TBD — see §3 Phase 3 for the documented-failure-not-generic-500 pattern
  and the authorization (thread/channel mismatch) idiom.

### 6.4 Adding a redux convergence/rollback test

- TBD — see §3 Phase 4 for the optimistic-insert rollback and three-path
  convergence pattern on the posts reducer.

### 6.5 Per-rollout-phase notes

(After each phase lands, /10x-implement appends a 2–3 line note here
capturing anything surprising the rollout phase taught.)

## 7. What We Deliberately Don't Test

Exclusions agreed during the rollout (Phase 2 interview, Q5). Future
contributors should respect these unless the underlying assumption changes.

- **Full e2e for unit/integration-shaped gaps** — no promoting reducer,
  wrapper-layer, or error-branch gaps to browser e2e; too slow, too flaky
  for the signal. Re-evaluate only if a gap's failure mode genuinely
  requires the deployed shape. (Source: Phase 2 interview Q5.)
- **UI snapshot tests on this flow** — high churn, low signal. (Source:
  Phase 2 interview Q5.)
- **Generated layers line-by-line** — retrylayer/timerlayer bodies are
  codegen; the CI regen-drift check is the real test. *Behavioral* tests of
  retry semantics (Risk #1) are in scope; line coverage of generated bodies
  is not. (Source: challenger pass, consistent with Q5.)
- **Re-covering already-strong happy paths** — the API/app/storetest happy
  paths are well covered; the rollout adds only the ranked gaps. (Source:
  test-base profile + research coverage inventory.)

## 8. Freshness Ledger

- Strategy (§1–§5) last reviewed: 2026-06-05
- Stack versions last verified: 2026-06-05 (from local manifests at HEAD 2026-04-21)
- AI-native tool references last verified: 2026-06-05 (none recommended)

Refresh (`/10x-test-plan --refresh`) when:

- a new top-3 risk surfaces from the roadmap or archive,
- a recommended tool's `checked:` date is older than three months,
- the project's tech stack changes (new framework, new test runner),
- §7 negative-space no longer matches what the team believes,
- the rollout widens beyond the post-save flow scope.
