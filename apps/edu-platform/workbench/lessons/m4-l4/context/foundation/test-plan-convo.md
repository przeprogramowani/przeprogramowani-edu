# Test Plan — Conversation Flow Capture

> Session record of the `/10x-test-plan` invocation that produced
> `context/foundation/test-plan.md`. Saved for further analysis of the
> skill's behavior and the decisions taken. Date: 2026-06-05.

## Invocation

```
/10x-test-plan context/changes/refactor-opportunities/plan-brief.md \
               context/changes/refactor-opportunities/research.md \
               context/changes/post-flow-analysis/research.md
```

Three explicit context sources passed as arguments; no flags.

## Flow (chronological)

### 1. Phase 0 — Preconditions + state detection

- Project marker confirmed: Mattermost monorepo (`server/`, `webapp/`, `e2e-tests/`).
- `context/foundation/test-plan.md` → **MISSING** → full write path triggered
  (Phases 1–4, then 5–6).
- `context/` structure found: `archive/` (empty), `changes/` (post-flow-analysis,
  refactor-opportunities), `foundation/` (README only), `map/` (repo-map + 3 artifacts).

### 2. Phase 1 — Discovery

**Argument sources read (all three, in full):**

| Source | Classified | Key extraction |
|---|---|---|
| `refactor-opportunities/plan-brief.md` | brief | C4 guard + SaveMultiple fix plan; live bug: bulk-imported posts unsearchable; C2 sentinel test bundled |
| `refactor-opportunities/research.md` | research | C1–C4 ranked by intentionality × cost; realized searchlayer gap; live 3-way Post contract drift |
| `post-flow-analysis/research.md` | research | Post-save e2e trace; TD-1..TD-5 debt; 10 ranked test gaps; blast-radius clusters |

**Defaults discovered:** no PRD/roadmap/tech-stack in `foundation/`;
`context/map/repo-map.md` (risk zones R1–R6) read as supplementary;
`AGENTS.CLOUD.md` (i18n constraint, dual-repo env); 6 jest configs +
Go toolchain + Cypress/Playwright e2e found.

**Test-base profile:** `meaningful` — 705 Go test files, 1,466 webapp test
files, dual e2e suites.

**MCP grounding (session):** Context7 docs ✓ (unused — local manifests
sufficed), WebSearch/WebFetch ✓ (unused), no Playwright MCP, GitHub via
`gh` CLI. All stamped `checked: 2026-06-05`.

**Hot-spot scan:**
- Scope proposed and **accepted by user**: `server/channels/`, `server/public/`,
  `webapp/channels/src/`, `webapp/platform/`; excluding generated layers,
  mocks, i18n JSON, e2e-tests, build output.
- Complication: "last 30 days" returned **0 commits** — checkout is ~45 days
  stale (HEAD 2026-04-21). Resolution: scanned the last 30 days of
  *available* history (2026-03-22 → 2026-04-21, 128 commits) and flagged the
  staleness in §1 and §8 of the guide.
- Top dirs: `webapp/channels/src/components` (578), `server/channels/app`
  (297), `server/channels/api4` (100), `server/public/model` (90),
  `server/channels/store` (79). Notable: `model/config.go` + `types/config.ts`
  churned 6× each (mirror class active); `testlib/store.go` 9× (store seam moving).

**Checkpoint:** presented; user confirmed → proceed to interview.

### 3. Phase 2 — User interview (5 questions, one at a time)

| # | Question | Answer | Implied risk(s) |
|---|---|---|---|
| 1 | Worries most | **Silent data loss/corruption** | Positional column corruption; dropped/wrong writes |
| 2 | Burned before | **SaveMultiple-class silent gaps** | Manual-layer passthrough class |
| 3 | Change without confidence | **The store seam & layers** | 5-layer chain; generated/manual split |
| 4 | Under-tested (multi-select) | **Manual-layer behavior hooks + column-write invariant** | Index-on-save, cache invalidation, 18-col pairing |
| 5 | NOT spend budget on (multi-select) | **More happy-path e2e; UI snapshot tests** | Negative space |

Observation recorded at synthesis: all five answers converge on one theme —
**silent failure** (writes that succeed while corrupting, skipping, or drifting).

### 4. Mid-flow state discovery (material to §3 design)

`context/changes/refactor-opportunities/` already contained an approved
`plan.md` (change status `planned`, all Progress items unchecked) covering
exactly what rollout Phase 1 would otherwise re-plan (C2 sentinel test,
searchlayer characterization + SaveMultiple override, generator completeness
guard, exemption triage). Decision: **adopt it as rollout Phase 1** instead
of opening a duplicate `testing-*` change folder.

### 5. Phase 3 — Seed brief + challenger pass

Brief presented with 6 risks, response-guidance table, 4 proposed phases.

**Challenger findings (disclosed to user):**
1. Risk 6 reframed from "burn-on-read leaks" to "per-recipient sanitization
   regression" with an explicit coverage-unknown flag — research must verify
   before tests are written.
2. "Messages not delivered via WS fan-out" (offered as a Q1 example) dropped
   as a standalone risk — no gap evidence in either research doc beyond the
   frontend rollback item, which was folded into Risk 5.
3. Risk 5's response explicitly demands **contract-sourced oracles** — pure
   characterization of error branches would green-light possibly-wrong
   current behavior (oracle problem).

Abuse/security lens applied: Risk 6 is the mandated abuse row (auth product,
user content). AI-native layer considered and **rejected** under cost ×
signal — every risk has a cheaper deterministic guard.

**User verdict: Accept.**

### 6. Phase 4 — Guide written

`context/foundation/test-plan.md` written against the locked schema
(§1–§8). Notable content decisions:

- §1 carries the repo-specific corollary: prefer the "regenerate + fail on
  porcelain" seam over new test infrastructure.
- §2 Source column: research-doc/interview/hot-spot-dir citations only — no
  code anchors (principle #3 enforced).
- §3: 4 phases — (1) Guards & silent-gap closure [adopts
  refactor-opportunities], (2) Post contract drift gate, (3) Error-path &
  leakage coverage, (4) Extend the proven guards.
- §4: AI-native row explicitly "none — deliberately omitted", with checked date.
- §7: four negative-space bullets (happy-path e2e, UI snapshots,
  generated-layer bodies, AI-native layers).
- §8: extra refresh trigger added — re-scan hot-spots once the checkout is
  refreshed past 2026-04-21.

### 7. Phases 5–6 — State derivation + handoff

- Current rollout phase: §3 Phase 1, on-disk sub-state: `plan.md` with all
  Progress pending → **Handoff D**.
- §3 Status updated `planned` → `implementing` (per Handoff D first-transition rule).
- Invocation copied to clipboard, session stopped:

```
/10x-implement refactor-opportunities phase 1
```

## Decisions ledger (for later audit)

| # | Decision | Rationale |
|---|---|---|
| 1 | Scan stale-history window instead of skipping the hot-spot scan | 128 commits of real signal existed; staleness flagged in §1/§8 rather than hidden |
| 2 | Adopt existing `refactor-opportunities` change as rollout Phase 1 | Approved plan already on disk delivering the phase goal; duplicate folder = waste |
| 3 | Reject AI-native layer | Every §2 risk has a cheaper deterministic guard (cost × signal) |
| 4 | Risk 6 kept despite thin evidence | Abuse lens is mandatory for auth + user-input products; coverage-unknown delegated to research |
| 5 | No new e2e / snapshots | User Q5 negative space + existing heavy multi-layer coverage |

## Open threads for next invocations

- Phase 1 implementation pending: `/10x-implement refactor-opportunities phase 1`.
- Risk 6 coverage question must be resolved by `/10x-research` when Phase 3 opens.
- Hot-spot likelihood weights should be re-derived after the checkout is updated
  (guide §8 trigger).
