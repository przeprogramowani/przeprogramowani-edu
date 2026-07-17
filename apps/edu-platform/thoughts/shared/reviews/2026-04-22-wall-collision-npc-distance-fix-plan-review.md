<!-- PLAN-REVIEW-REPORT -->

# Plan Review: Wall Collision & NPC Distance Fix

- **Plan**: thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix.md
- **Mode**: Deep
- **Date**: 2026-04-22
- **Verdict**: SOUND
- **Findings**: 0 critical, 1 warning, 0 observations

## Verdicts

| Dimension             | Verdict |
| --------------------- | ------- |
| Problem Framing       | PASS    |
| End-State Alignment   | PASS    |
| Lean Execution        | PASS    |
| Architectural Fitness | PASS    |
| Rabbit Holes          | PASS    |
| Blind Spots           | WARNING |
| Plan Completeness     | PASS    |
| Contradiction         | PASS    |
| Promise Gap           | PASS    |
| Contract Integrity    | PASS    |

## Grounding

5/5 paths ✓, 6/6 symbols ✓, brief↔plan consistent ✓

## Findings

### F1 — WARNING — [Blind Spots] Editor speed field becomes orphaned after Phase 2

- **Location**: Phase 2 — NPC Speed Standardization
- **Detail**: Phase 2 removes the `speed` parameter from `NPC.ts` constructor and the `speedProp` reading from `GameScene.ts:208-215`, but the level editor UI still renders a "speed (optional, px/s)" input for NPC zones (`ZonePropertiesPanel.svelte:276-284`). After Phase 2, this field writes values to map JSON that nothing reads — a level designer could set a speed, save, and wonder why it has no effect.
- **Fix**: Add removing the speed input from `ZonePropertiesPanel.svelte` to Phase 2 scope, or explicitly list the editor field in "What We're NOT Doing" as accepted tech debt.
- **Decision**: PENDING

## Review Notes

This is a well-researched, tightly-scoped plan. Key verification results:

- **Wall-bounce via `body.blocked`** — confirmed available every frame in Phaser arcade physics. No callback registration needed. Plan's timing analysis is correct.
- **Idle/unfreeze state transitions** — traced through all combinations (idle→wander, unfreeze→idle→wander, freeze-while-moving→unfreeze). All paths are clean; `isIdling` flag prevents wall-bounce during idle.
- **Body constant consumers** — only 4 files import PLAYER_BODY_* constants (NPC.ts, Astronaut.ts, constants.ts, spawnValidation.ts). All are accounted for in the plan. No hidden consumers.
- **Spawn validation tests** — existing test grid (5×5 room) passes with wider body (verified math: body at tile (1,1) extends into tile (1,2), both open).
- **Phase 3 risk management** — the plan correctly identifies body widening as highest risk, provides a concrete fallback (52×40), and requires manual testing in all 4 levels with debug overlays. Adequate.
- **Animation frame rate** — at 80 px/s with PLAYER_SPEED=240, formula gives 3 fps. Plan documents this and provides a min-5fps fallback if it looks choppy. Correct.
