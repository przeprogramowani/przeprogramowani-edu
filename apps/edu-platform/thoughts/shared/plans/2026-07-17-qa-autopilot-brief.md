# QA Autopilot — Plan Brief

> Full plan: `thoughts/shared/plans/2026-07-17-qa-autopilot.md`

## What & Why

An **Autopilot** panel in the Space Explorers `?qa` overlay: "Start autopilot" resets all game state and begins a scripted, forward-only playthrough of the entire critical path; "Next step" (or an Auto toggle) advances one beat at a time while the maintainer watches the player walk, talk, pass exams, complete quests, and cross doors. Today nothing verifies the game is actually *playable* end-to-end — existing tests only check that referenced IDs exist. The autopilot turns a manual multi-hour playthrough into a hands-off smoke run.

## Starting Point

The `?qa` overlay (`QaOverlay.svelte`) can already jump maps, set flags/XP, launch dialogues, and reset state. The game is event-bus driven with most driving seams in place: `virtual-space` advances dialogues, `InputController` accepts virtual directional input and an interact pulse, `TRANSITION_START`/`TRANSITION_COMPLETE` handle map moves, and `QuestManager.completeQuestById` legitimately completes the six server-graded (`api-answer`) quests client-side. Progression is a strict linear flag-gated chain across 9 levels (m0-awakening → m1-uplink-bay).

## Desired End State

`/explorers?qa` → Start autopilot → confirm → state resets (local + server + pending grants) and the page reloads armed at step 0. Each step visibly executes one beat; Auto mode chains them. The run ends after `q-uplink-to-earth` completes. Any beat that can't proceed halts the run with a report (step, expected, observed) and leaves state intact for debugging. A Vitest simulation keeps the script complete and forward-only as content evolves.

## Key Decisions Made

| Decision | Choice | Why |
|---|---|---|
| Movement fidelity | Walk via BFS pathfinding + virtual input | True "watch the player" experience; implicitly verifies reachability |
| Exams | Visibly auto-answered in real ExamScene (new public hook) | Every question renders in the real UI — catches broken content visually |
| Step granularity | One beat per press + Auto toggle | Fine control for review, hands-free for smoke runs |
| Coverage | Critical path only (no arcades/optional chatter) | Answers "does progression work" with least machinery |
| Script source | Hand-authored step list + completeness Vitest | Deterministic and debuggable; test enforces forward-only sync with content |
| On failure | Halt and report | Surfacing broken progression *is* the product; state stays intact |
| api-answer quests | `QUEST_COMPLETE_REQUEST` direct-complete | Answers exist only as server-side hashes; this seam fires XP/flags/dialogue legitimately |
| `sys:` gates | QA-local registry Set override | `sys:course-m1-available` is server-controlled; setFlag rejects it by design |

## Scope

**In scope:** Autopilot script + types + simulation test; BFS pathfinder + walk driver; dialogue advancer; small public hooks on `ExamScene`, `NavigationScene`, `GameScene` (grid accessor); hardened reset (drains pending grants, resumes via sessionStorage marker); AutopilotEngine orchestrator; QA overlay panel; cookbook docs.

**Out of scope:** Arcade coverage / force-finish seam; auto-derived step solver; headless/CI playthrough; skip-on-failure; optional dialogues and flag variants; `m2-planning`; any server/API or production gameplay changes.

## Architecture / Approach

All new code in `src/explorers/qa/`, driven by `QaOverlay.svelte`. The engine holds a cursor over the authored `AUTOPILOT_SCRIPT` (typed step objects: `await-intro`, `interact`, `exam`, `complete-quest`, `door`, `navigate`, `grant-sys-flag`). Every beat = optional walk → trigger → await expected event with timeout; timeout = halt. Because the script is pure data, the Vitest replays it against `ALL_LEVELS` + compiled maps, accumulating flags and asserting every gate is satisfied by earlier steps.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Script + test | Step types, full critical-path script, forward-only simulation test | Script IDs drifting from content (the test is the mitigation) |
| 2. Driver primitives | Pathfinder, walk driver, dialogue advancer, Exam/Navigation hooks, hardened reset | Walk driver stuck-detection tuning |
| 3. AutopilotEngine | Beat-by-beat orchestrator with halt-and-report + Auto mode | Event-await races around intros/transitions |
| 4. Overlay panel | Start/Next/Auto/Stop UI, resume-after-reload, error banner | Reset→reload→resume continuity |
| 5. E2E + docs | Full-run verification, cookbook section + checklist bullet | Full-run timing flakiness (generous budgets) |

**Prerequisites:** none beyond the current `jungle-module` branch state.
**Estimated effort:** ~2-3 sessions across 5 phases.

## Open Risks & Assumptions

- Interaction targeting assumes the nearest-zone detector picks the intended zone after pathing to it; mismatch is caught by the expected-dialogue check but may need per-step approach-tile tuning.
- The m0-core-ai `/support` terminal flow is bypassed (quest activated programmatically) — terminal UX itself stays unverified by autopilot.
- Full-run duration depends on cinematic/typewriter pacing (~minutes); acceptable for a watched smoke run.

## Success Criteria (Summary)

- One click + Auto completes the whole game from hibernation bay to uplink with zero manual input, visibly.
- A broken gate/zone/dialogue halts the run with an accurate, actionable report.
- `autopilotScript.test.ts` fails CI whenever new content breaks the critical path or the script falls out of sync.
