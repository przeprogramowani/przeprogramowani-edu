# Conversation log — /10x-test-plan rollout kickoff

> Replay document for the session of **2026-06-05** that produced
> `context/foundation/test-plan.md` and opened rollout Phase 1.
> Read top-to-bottom to revise how each artifact and decision came to be.

## Invocation

```
/10x-test-plan context/changes/post-flow-analysis/research.md
```

The argument was an explicit Phase 1 context source: the deep post-save-flow
research produced earlier (2026-06-04) under the `post-flow-analysis` change.

## Flow overview

```
Phase 0  state detection      → guide MISSING → full write path
Phase 1  discovery            → sources, test-base profile, MCP grounding, hot-spot scan
Phase 2  user interview       → 5 questions (Q2 answered "no scars", Q5 multi-select)
Phase 3  seed brief           → 7 risks, 4 rollout phases, challenger pass
Phase 4  write guide          → context/foundation/test-plan.md
Phase 5  locate current phase → §3 Phase 1 "Silent-success integrity", not started
Phase 6  Handoff A            → /10x-new testing-silent-success-integrity
         /10x-new executed    → change.md created, /10x-research invocation queued
```

## Phase 0 — State detection

- Project marker: Mattermost monorepo (`server/`, `webapp/`, `e2e-tests/`). OK.
- `context/foundation/test-plan.md` → **MISSING** → full write path.

## Phase 1 — Discovery

### Sources read

| Path | Type | Gist | Origin |
|---|---|---|---|
| `context/changes/post-flow-analysis/research.md` | research (deep) | Post-save flow e2e trace; **top-10 ranked test gaps**; blast-radius clusters; debt register TD-1…TD-5 | argument |
| `context/map/repo-map.md` | repo map | Risk zones R1–R6; `config.go↔config.ts` manual contract; store regen = cheap coupling | default |
| `context/changes/post-flow-analysis/change.md` | brief | Lesson-plan context (M4-L4), status `preparing` | default |
| `context/foundation/` | gap | No PRD / roadmap / tech-stack note | default |
| Test configs | config | jest ×3 (webapp), Playwright, Cypress, Go native | default |

### Test-base profile

**`meaningful`** — 705 Go test files, 1,466 webapp jest test files,
119 Playwright + 666 Cypress specs. Mature test culture with specific gaps.

### MCP grounding (session of 2026-06-05)

- Docs: Context7 available (not queried — local manifests sufficed)
- Search: WebSearch available (not used)
- Runtime/browser, provider: none

### Hot-spot scan

- **User decision:** scope = post-flow directories (Recommended option):
  `server/channels/{api4,app,store}`, `server/public/model`,
  `webapp/channels/src`, `webapp/platform`; generated layers, i18n,
  snapshots, tests excluded.
- **Quirk:** checkout HEAD is 2026-04-21 (~6 weeks behind calendar), so the
  30-day window was anchored to HEAD: **2026-03-22 → 2026-04-21**, 125 commits.
- Top dirs: `webapp/channels/src/components` (261), `store/sqlstore` +
  `storetest` (37+37), `webapp/.../utils` (34), `mattermost-redux` (27),
  `platform/types` (17).
- Top files: `app/channel.go` (9), `sqlstore/user_store.go` (7),
  **`config.go` (6) ↔ `config.ts` (6)** — the R5 manual contract churning on
  both sides in-window — `client4.ts` (5), **`app/post.go` (5)**.
- Checkpoint confirmed by user → proceed to interview.

## Phase 2 — Interview (user answers)

| # | Question | Answer | Implied risk |
|---|---|---|---|
| 1 | Worries most | **Silent message loss** — accepted (optimistic UI / 201) but never persisted/broadcast | persistence & broadcast integrity |
| 2 | Burned before | **None** — learning/lesson context | evidence leans on research + hot-spots |
| 3 | Least confidence | **`app/post.go` orchestration** (~4k lines) | regression in CreatePost branches |
| 4 | Under-tested | **searchlayer index hook** (research gap #1, zero coverage) | silent search staleness |
| 5 | Do NOT spend on | **Full e2e for every gap; UI snapshot tests** (multi-select) | negative space §7 |

## Phase 3 — Seed brief (accepted by user)

### 7 risks (impact × likelihood)

1. **Silent message loss** — High × Medium (interview Q1; research summary + gaps #2, #5; sqlstore churn)
2. **Silent search staleness** — High × Medium (interview Q4; gap #1 + TD-4/TD-5)
3. **Data corruption on Post schema change** (positional column arrays) — High × Medium (TD-2; repo-map R6)
4. **Front/back Post contract drift** — Medium × Medium (TD-1; co-change cluster 3; live config.go/ts churn as analogue)
5. **Orchestration regression in create-post error/edge branches** — Medium × High (interview Q3; gaps #3/#4/#6/#8/#9; TD-3; post.go churn)
6. **Frontend convergence failure** (optimistic/HTTP/WS on one reducer) — Medium × Medium (gap #10; architecture insights)
7. **Authorization bypass on post create** (abuse lens) — High × Low (mandatory abuse row; validation-parity unverified)

### Challenger pass findings

- "Retry layer has no tests" folded into Risk #1 — coverage absence is not a
  failure scenario; the scenario is loss/duplication under contention.
- R3/R4 checked for speculation: both testable now as deterministic guards.
- All Source cells carry document/interview/hot-spot evidence only; file
  anchors stripped (they live in research.md; per-phase research re-verifies).

### 4 rollout phases

| # | Phase | Risks | Rationale |
|---|---|---|---|
| 1 | Silent-success integrity | #1, #2 | both High-impact "silent" failures; user's top fears; nothing fires today |
| 2 | Seam guards | #3, #4 | cheapest tests locking costliest debt (TD-1, TD-2); prereq for schema work |
| 3 | Orchestration & abuse branches | #5, #7 | highest-likelihood area (active churn); abuse rides the same harness |
| 4 | Frontend convergence | #6 | self-contained on existing jest harness; honors Q5 (no e2e promotion) |

## Phase 4 — Guide written

`context/foundation/test-plan.md` per the locked schema:

- §1 strategy (3 principles + hot-spot scope + **post-flow scope note**)
- §2 risk map (7 rows, evidence-only sources) + Risk Response Guidance table
- §3 phased rollout (4 phases, parser-literal statuses)
- §4 stack (Go 1.25.8/testify 1.11.1, jest 30.1.3, nock 13.2.8,
  Playwright 1.59.1, Cypress 15.13.1 legacy; **no AI-native layer** — not
  justified under cost × signal) + grounding note
- §5 quality gates (mostly already wired; Phase 2 adds seam/contract gates)
- §6 cookbook placeholders (4 patterns, fill as phases ship)
- §7 negative space (Q5: no e2e promotion, no snapshots, no generated-layer
  line coverage, no re-covering happy paths)
- §8 freshness ledger (all dates 2026-06-05; extra trigger: rollout widening
  beyond post-save flow)

## Phases 5–6 — Handoff A

- Current rollout phase: §3 Phase 1 "Silent-success integrity" (`not started`).
- **User decision:** change-id `testing-silent-success-integrity` (full form).
- §3 row updated *before* handoff: Status → `change opened`, folder set
  (crash-safe resume).
- `/10x-new` invocation with full intent block copied to clipboard; STOP.

## /10x-new execution (same session)

- Validated kebab-case, uniqueness, parent dir.
- Created `context/changes/testing-silent-success-integrity/change.md`
  (status: new, title "Test rollout Phase 1 — silent-success integrity of the
  post-save flow", intent verbatim in Notes).
- Next-step: `/10x-research` chosen over default `/10x-plan` because the test
  plan deliberately omits code anchors — research produces them (§1
  principle #3). Full grounding query copied to clipboard.

## State after this conversation

| Artifact | State |
|---|---|
| `context/foundation/test-plan.md` | written; §3 Phase 1 = `change opened` |
| `context/changes/testing-silent-success-integrity/change.md` | created (status: new) |
| `research.md` / `plan.md` in that folder | **not yet** — next steps |
| Phases 2–4 in §3 | `not started` |

## Next steps (queued)

1. `/clear`, paste the copied `/10x-research` invocation (grounds Risk #1/#2
   anchors: transaction boundaries, post-commit side-effects, retry
   semantics, search-index seam; writes `research.md` to the new folder).
2. Then `/10x-plan` → `/10x-implement` per the downstream continuation rule.
3. Return to `/10x-test-plan` only for: post-research backport corrections to
   §2, marking a phase complete / selecting the next one, `--status`,
   `--refresh`.

## Decisions worth revisiting later

- Hot-spot window anchored to HEAD date (stale checkout) — re-scan after
  pulling a fresh master.
- No AI-native test layer in this rollout — re-evaluate at `--refresh` if a
  phase produces a gap deterministic tests can't cover cheaply.
- Risk #7 (abuse) scored Low likelihood on parity-unverified evidence —
  Phase 3 research may raise it.
- The rollout is scoped to the post-save flow only; widening (e.g., to
  admin_console, the #1 repo hotspot) is an explicit `--refresh` decision.
