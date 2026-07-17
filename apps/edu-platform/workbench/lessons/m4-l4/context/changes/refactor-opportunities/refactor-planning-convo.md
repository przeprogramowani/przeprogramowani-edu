# Planning Conversation Flow — refactor-opportunities

> Process log of the `/10x-plan refactor-opportunities` session (2026-06-05), for analyzing how the planning process behaved. Outputs: `plan.md`, `plan-brief.md`.

## Inputs at invocation

| Artifact | Present? | Role it played |
| --- | --- | --- |
| `change.md` | Yes (`status: preparing`) | Defined the task: rank debt → decide what to pursue; "exploring and deciding only" boundary |
| `research.md` | Yes (same-day, same commit `29bab2184d`) | Treated as the codebase baseline; its ranked shortlist + corrections taken as settled diagnostics |
| `frame.md` | No | — |
| Existing `plan.md` | No | — |

**Scaling consequence (skill Step 1.0):** "Task + research" row → question budget dropped from baseline 7–10 (MEDIUM) to **5–7**, and `[D]` diagnostic ground was not re-asked. No Explore agents were spawned to re-find what research already mapped.

## Step-by-step flow

### 1. Context gathering
- Checked the change folder, read `change.md` + `research.md` fully (no sub-agents first — per skill rule).
- Noted the one thing research deliberately left open: the ranking was labeled *"my proposal, your decision"* — so plan scope became Question #1 rather than an assumption.

### 2. Complexity assessment
- Presented summary of settled findings (C4 #1 with realized failure, C1 #2, C3 #3 narrowed, C2 rejected-but-assert).
- Proposed **MEDIUM, 5–7 solution-design questions**.
- **User: Agree — proceed with 5–7 questions.**

### 3. Questioning — Round 1 (scope + the unknown)

| # | Question | Options (⭐ = recommended) | Answer |
| --- | --- | --- | --- |
| Q1 | Plan scope | ⭐ C4 + C2 quick-win / C4 only / C4 + C1 pilot / all three | **⭐ C4 + C2 quick-win** |
| Q2 | SaveMultiple gap handling | ⭐ Investigate first, then fix or exempt / fix now / exempt + file separately | **⭐ Investigate first** (decision rule: live bug → fix; covered elsewhere → exempt) |

### 4. Questioning — Round 2 (mechanism design)

| # | Question | Options (⭐ = recommended) | Answer |
| --- | --- | --- | --- |
| Q3 | Enforcement mechanism | ⭐ Generator-emitted artifact under `check-store-layers` / reflection test / govet analyzer | **⭐ Generator-based** |
| Q4 | Exemption recording | ⭐ Explicit list with reasons / seed mechanically, document lazily / require passthrough overrides | **⭐ Explicit list with reasons** |
| Q5 | Guard scope | ⭐ PostStore on both manual layers (pilot) / all searchlayer sub-stores / every sub-store | **⭐ PostStore pilot** |
| Q6 | CI rollout | ⭐ Blocking from day one / report-only first | **⭐ Blocking from day one** |

### 5. Research & Discovery (3 parallel Explore agents)

| Agent | Mission | Key returns |
| --- | --- | --- |
| A | Layer generator + CI internals; override inventories | Generator = 2 builder funcs writing 2 files; `make store-layers` → blocking CI job; PostStore = **57 methods**; searchlayer overrides **8**, localcachelayer **6**; 6 sibling "regenerate + fail" CI gates |
| B | Is the SaveMultiple gap a live bug? | **Yes — confirmed live production bug.** Only callers = bulk import (`import_functions.go:1470,1915,2434`); no auto-reindex after import; sqlstore `Save→SaveMultiple` delegation is *below* searchlayer (override can't double-index) |
| C | sqlstore unit-test conventions + exact column-array shapes | Pure-unit precedent (`utils_test.go`, `adapters_test.go`); 4/18 columns don't kind-match naively (`Props`/`Filenames`/`FileIds` JSON-serialized; `RemoteId` `*string`) |

### 6. Findings changed three earlier positions (the analytically interesting part)

1. **Q2's conditional branch got resolved during planning, not implementation.** Agent B's investigation answered the planned "Phase 0" question before the plan was written — but the same investigation confirmed the perf tradeoff lands *exactly* on the fix's only caller. Because this was new information against a conditional decision, one **extra question (Q7)** was asked rather than silently applying the decision rule:
   - Q7: Final call on SaveMultiple → **⭐ Add the override** (over "exempt + follow-up" and "override + auto-reindex import path"). Total questions: 7 = top of budget.
2. **Mechanism refined from "emitted artifact + porcelain diff" to "generator hard-fail"** — same generator, same CI job (preserving everything Q3's choice was chosen *for*), but enforcement via exit code + actionable message instead of a rubber-stampable diff; plus **opt-in-per-layer activation** invented to let mechanism (Phase 3) land green before triage (Phase 4).
3. **C2 test design upgraded from the research's kind-check sketch to sentinel-value identity** — agent C's data showed a kind check would both false-positive (4 serialization mismatches) and false-negative (same-kind adjacent swaps, the exact danger the research flagged).

Also surfaced: triage will expose **more SaveMultiple-class gaps** (`OverwriteMultiple`, `PermanentDeleteBatch`, retention deletes) → plan bounded these to exempt-with-citation or file-follow-up, never in-scope fixes.

### 7. Phase outline approval
Proposed: (1) C2 sentinel test → (2) Save characterization + SaveMultiple fix → (3) guard mechanism, opt-in, lands green → (4) triage ~99 exemptions + activate. Phases 1–2 independent of 3–4; each one revertible commit/PR.
**User: Looks good, proceed.**

### 8. Outputs
- `plan.md` written (4 phases, Critical Implementation Details: layer-chain ordering, accepted perf tradeoff, serialized-sentinel comparison, opt-in semantics; canonical `## Progress` checklist).
- `plan-brief.md` written (Key Decisions table with Source column: Research / Plan).
- `change.md` → `status: planned`.
- `/10x-implement refactor-opportunities phase 1` copied to clipboard.

## Decision ledger (final)

| Decision | Choice | Decided by | When |
| --- | --- | --- | --- |
| Ranking C4 > C1 > C3; C2 rejected | Per research | Research | Pre-session |
| Plan scope | C4 + C2 quick-win | User (Q1) | Round 1 |
| SaveMultiple handling | Investigate → fix; **final: add override** | User (Q2, then Q7 after evidence) | Round 1 + post-research |
| Mechanism | Generator validation, hard-fail in `make store-layers` | User (Q3) + planner refinement | Round 2 + post-research |
| Exemptions | Explicit JSON per layer, mandatory reasons, stale-entry check | User (Q4) + planner detail | Round 2 |
| Guard scope | PostStore pilot, both layers | User (Q5) | Round 2 |
| Rollout | Blocking day one via opt-in activation | User (Q6) + planner detail | Round 2 |
| C2 test design | Sentinel-value identity | Planner (from agent C evidence) | Post-research |
| Triage boundary | Exempt-or-file-follow-up, no extra fixes | Planner (flagged in findings, unobjected) | Post-research |

## Process observations (for your analysis)

- **Upstream-artifact scaling worked as designed**: zero diagnostic questions were re-asked; all 7 questions were `[S]` solution-design. The research doc's "my proposal, your decision" label correctly converted ranking-acceptance into an explicit question instead of an assumption.
- **One deviation from the user's Q2 instruction, in the user's favor**: the "Phase 0 investigation" was pulled forward into planning-time research, eliminating a conditional branch from the plan — at the cost of one extra question (7/7 budget used).
- **All 8 recommendations (incl. complexity + phases) were accepted as offered** — worth watching for anchoring; the recommendations were research-grounded, but a future session could deliberately stress-test one ⭐ pick.
- **Two skill-mandated checkpoints (complexity, phase outline) both passed first try** — consistent with heavy upstream investment (frame-less but research-rich input).
- Open question carried into implementation: none in the plan itself; risks logged in brief (mock synchronizability of `indexPost`, triage may reveal further live bugs, upstream-acceptance of the exemption-file convention).
