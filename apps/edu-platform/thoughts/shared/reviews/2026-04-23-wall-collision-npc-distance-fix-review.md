<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Wall Collision & NPC Distance Fix

- **Plan**: projects/edu-platform/thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix.md
- **Scope**: Full plan (CI review on PR #160)
- **Date**: 2026-04-23
- **CI run**: https://github.com/przeprogramowani/przeprogramowani-sites/actions/runs/24843951945
- **Verdict**: REJECTED
- **Findings**: 2 critical · 5 warnings · 3 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | FAIL |
| Scope Discipline | WARNING |
| Safety & Quality | WARNING |
| Architecture | WARNING |
| Pattern Consistency | PASS |
| Test Coverage | PASS |
| Success Criteria | FAIL |

## Summary

The PR implements Phases 1–3 of the plan: `actorDepth` Y-sort (Phase 1), an explicit-state NPC movement engine with `wandering / idle / wallRecovery / frozen` in `npcMovement.ts` (Phase 2 core), and speed standardization to `TILE_SIZE * 1.25 = 80 px/s` with the editor/runtime `speed` field removed (Phase 3). The contract tests on `webinar/02-tests` (`actorDepth.test.ts`, `npcMovement.test.ts`, `actorMovementBounds.test.ts`, `npcConstants.test.ts`) all go green — 106/106 explorers tests pass.

However, the PR also (a) violates two explicit plan prohibitions, (b) introduces an unplanned 156-line geometric containment system alongside the planned state machine, (c) leaves the plan's PLAN STATUS footer claiming Phase 5 complete when the cookbook was not touched, and (d) breaks the plan's own `npx tsc --noEmit` Automated Verification with a new `TS2339` error. That last item alone blocks the plan's declared "ready-to-ship" criteria, hence the REJECTED verdict.

## Findings

### F1 — TypeScript error: `faceTowards` not on `Interactable`

- **Severity**: ❌ CRITICAL
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: projects/edu-platform/src/explorers/scenes/GameScene.ts:438
- **Detail**: Plan Phase 2 adds `faceTowards(targetX, targetY)` to `NPC.ts` and prescribes calling it "from `GameScene.handleInteraction()` or `startDialogue()` only for `npc` interactions." The call site was added (`GameScene.ts:438`), but the shared `Interactable` interface in `src/explorers/systems/InteractionDetector.ts` was not updated, and the `case 'npc'` branch does not narrow the type before calling the method. Result: `npx tsc --noEmit` fails with `error TS2339: Property 'faceTowards' does not exist on type 'Interactable'`. The plan lists `npx tsc --noEmit` in Automated Verification for both Phase 2 and Phase 3, so this PR does not currently meet its own plan's "ready-to-ship" contract.
- **Fix**: Either add `faceTowards?: (x: number, y: number) => void` to the `Interactable` interface in `InteractionDetector.ts`, or narrow the call — e.g. check `obj instanceof NPC` (import NPC locally) before invoking `faceTowards`. The type-guard option is cleaner because `faceTowards` is an NPC-specific concern; adding it to `Interactable` widens an unrelated interface just to satisfy a case branch.
- **Decision**: PENDING

### F2 — `setImmovable(true)` used in spite of explicit plan prohibition

- **Severity**: ❌ CRITICAL
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Plan Adherence
- **Location**: projects/edu-platform/src/explorers/entities/NPC.ts:181
- **Detail**: `updateMovement(...)` in `npcMovement.ts` returns `immovable: true` for the `wallRecovery` and `frozen` states, and `NPC.update()` applies it via `body.setImmovable(result.immovable)`. The plan's Non-Goals section says *"no `setImmovable(true)` on NPCs"*, and Phase 2's "Why This Phase Differs From The Failed Implementation" repeats *"no `setImmovable(true)`"*. The failed prior attempt used this exact mechanism; the plan explicitly rejected it. Either the plan should be amended before merge (if the author now believes pinning NPCs is required to stop push-into-wall flicker), or this behavior should be removed and the state machine should stop NPCs via velocity-zero + the sticky recovery timer alone.
- **Fix A ⭐ Recommended**: Drop the `immovable: true` branches in `npcMovement.ts` and call `body.setImmovable(false)` unconditionally. Rely on `setVelocity(0, 0)` plus the sticky recovery timer to hold the NPC still.
  - Strength: Matches the plan's deliberate design decision; keeps push-into-wall dynamics driven by physics, not a frame-by-frame freeze flag.
  - Tradeoff: If push-into-wall flicker re-emerges without `setImmovable`, the state machine's grace/stability timers may need tuning — but the plan's Phase 2 rationale already accepts that cost.
  - Confidence: HIGH — the plan is unambiguous on this point.
  - Blind spot: Haven't run the game; can't rule out that the author discovered during implementation that velocity-zero alone is insufficient.
- **Fix B**: Update the plan to record that `setImmovable(true)` turned out to be necessary, then merge.
  - Strength: Preserves current runtime behavior if the author has evidence velocity-zero wasn't enough.
  - Tradeoff: Requires a plan amendment commit with a rationale; otherwise the next review re-flags this every time.
  - Confidence: MEDIUM — valid only if author has evidence the plan's stated approach failed.
  - Blind spot: No debug evidence is attached to the PR documenting why the prohibition was overridden.
- **Decision**: PENDING

### F3 — Unplanned `actorMovementBounds.ts` substitutes a geometric containment system

- **Severity**: ⚠️ WARNING
- **Impact**: 🔬 HIGH — architectural stakes; wide blast radius and unclear best path
- **Dimension**: Scope Discipline
- **Location**: projects/edu-platform/src/explorers/state/actorMovementBounds.ts:1
- **Detail**: The plan's Phase 2 mechanism is a *behavior-based* state machine (`wandering / idle / wallRecovery / frozen`) reacting to `body.blocked`. This PR adds a second containment mechanism layered on top: a BFS flood-fill of walkable tiles computed at scene create (`buildActorMovementBounds`, 156 lines, not mentioned in the plan), queried per frame in `NPC.enforceMovementBounds()`, which teleports NPCs back to `lastAllowedPosition` via `body.reset()` when they escape. The plan's Non-Goals include *"no pathfinding, tether radius, or smarter NPC AI"* — a flood-filled walkable region feeding a reset-to-last-allowed-position clamp reads as geometric "tether radius" behavior. Downstream reviewers now have to reason about *two* overlapping wall-containment systems (physics + BFS clamp) instead of one, and the debug signal from each is harder to isolate.
- **Fix**: Decide whether `actorMovementBounds` stays in scope for this PR.
  - Strength: If the state machine alone holds NPCs in corridors (manual matrix in plan covers `m0-awakening`, `m0-crew-room`, and one more map), the BFS module and `enforceMovementBounds()` can be deleted, keeping the implementation within the plan's stated spirit.
  - Tradeoff: Removing it risks NPCs drifting into unwalkable tiles if the physics/state-machine path has blind spots; retaining it widens the plan's scope and should at minimum be documented as a deliberate amendment.
  - Confidence: MEDIUM — without the manual matrix results it's hard to say which mechanism carries which case.
  - Blind spot: The postmortem of the prior attempt is the best evidence, but it predates this approach; the author may have added bounds after observing physics-only wasn't enough.
- **Decision**: PENDING

### F4 — Phase 5 (cookbook docs) is missing; plan footer falsely claims "Last Phase Completed: 5"

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — two-line fix: either write the docs or correct the status line
- **Dimension**: Plan Adherence
- **Location**: N/A (`.ai/10x-devs/game/cookbook.md` not modified)
- **Detail**: The plan's closing metadata comment reads `<!-- PLAN STATUS: Last Phase Completed: 5, Next Phase: none, Updated: 2026-04-22 -->`. But `git diff origin/webinar/02-tests...HEAD -- '**/cookbook.md'` returns empty — the cookbook file was not edited. Phase 5 mandates updating the cookbook with Y-sorted depth, idle + post-dialogue resume, wall-recovery behavior, standardized speed, and the removal of the editor `speed` field. None of that is in the diff. The misleading status line undermines downstream triage tooling and future plan audits.
- **Fix**: Either (a) complete Phase 5 by updating `.ai/10x-devs/game/cookbook.md` to describe the shipped behavior, or (b) amend the plan's status footer to `Last Phase Completed: 3` (or 4 depending on whether the bounds work is counted as Phase 4 substitute). Option (a) is the plan's declared intent and preferred.
- **Decision**: PENDING

### F5 — Lint failure: unused `tileSize` parameter introduced by this PR

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — single-line fix
- **Dimension**: Success Criteria
- **Location**: projects/edu-platform/src/explorers/state/actorMovementBounds.ts:29
- **Detail**: `getBodyRect(position: ActorPosition, tileSize: number)` accepts `tileSize` but uses `PLAYER_FRAME_WIDTH`, `PLAYER_FRAME_HEIGHT`, `PLAYER_BODY_OFFSET_X`, `PLAYER_BODY_OFFSET_Y`, `PLAYER_BODY_WIDTH`, `PLAYER_BODY_HEIGHT` instead. ESLint reports `'tileSize' is defined but never used`, and the plan lists `npm run lint` in Automated Verification for Phases 2 and 3. The repo already has many pre-existing lint errors in other workspaces, but this one is PR-introduced and blocks the plan's own commitment. Also latent bug: if NPC and player ever need different body dimensions, this function silently uses player dimensions for both actors — cf. the near-duplicate `getBodyRect` in `spawnValidation.ts:23` which uses a different anchor.
- **Fix**: Remove the unused `tileSize` parameter (and its argument at the two call sites), or prefix it with `_tileSize` if a future caller is expected to need it. Consider extracting a shared anchor-aware `getActorBodyRect` helper used by both `actorMovementBounds` and `spawnValidation` to eliminate duplication.
- **Decision**: PENDING

### F6 — `enforceMovementBounds` can strand an NPC permanently when origin starts out of bounds

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — requires a design decision about fallback behavior
- **Dimension**: Safety & Quality
- **Location**: projects/edu-platform/src/explorers/entities/NPC.ts:294
- **Detail**: In the constructor, `hasAllowedPosition` is set by `isActorPositionWithinBounds(movementBounds, this.lastAllowedPosition)`. If that returns `false` (e.g., zone center happens to be inside a wall tile at sub-tile offset, or the BFS seed is blocked), `enforceMovementBounds()` hits the `if (!this.hasAllowedPosition) { return; }` early exit (lines 294–296) and silently does nothing, forever. The NPC is then free to drift into unwalkable tiles with no recovery path and the BFS containment is effectively disabled for that instance — the worst of both worlds. There is no log, no warning, no fallback.
- **Fix**: On `!hasAllowedPosition`, fall back to the zone origin unconditionally (treating the configured zone position as authoritative) and emit a one-shot `devLog('[NPC] zone origin outside computed bounds for id=', this.npcId)`. That preserves containment and surfaces the config error during development.
- **Decision**: PENDING

### F7 — Per-frame object allocations in NPC hot path

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — performance tradeoff; measure before/after
- **Dimension**: Safety & Quality
- **Location**: projects/edu-platform/src/explorers/entities/NPC.ts:167
- **Detail**: `NPC.update()` runs every frame for every NPC (called from `GameScene.update()`). Each call allocates a fresh `blocked: BlockedFlags` literal, `enforceMovementBounds` allocates `currentPosition: {x, y}`, and `updateMovement` returns a new `result` object and a new `state` object (spread-copied on every transition). `startWandering` / `enterIdle` also spread-copy state. With multiple NPCs per scene this is measurable GC churn in a Phaser game loop; pre-change NPC wandering logic mutated primitives in place. Not a blocker today, but it's a regression in a hot path and easy to fix.
- **Fix**: Either (a) pass output params into `updateMovement` so it mutates `this.motionState` in place, or (b) keep a reusable `_blockedScratch` / `_resultScratch` as private NPC fields and reuse them. Option (b) is minimally disruptive; option (a) is purer for tests but more invasive.
- **Decision**: PENDING

### F8 — Dead `traceStateTransition` method called every frame

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — delete or wire to `devLog`
- **Dimension**: Safety & Quality
- **Location**: projects/edu-platform/src/explorers/entities/NPC.ts:312
- **Detail**: `traceStateTransition(from, to)` has body `if (from === to) { return; }` and nothing else — a no-op function. It is called from `update()` whenever state changes and conveys no intent to a reader. The established debug-logging pattern in this codebase is `devLog('[X] message')` (cf. `state/flagManager.ts`, `systems/ExamManager.ts`). Either wire this method to a real gated log line or delete it and its caller.
- **Fix**: Delete the method and the `if (result.state.movementState !== prevState) { this.traceStateTransition(...) }` block in `update()`, or replace the body with `devLog('[NPC] ${this.npcId} ${from} → ${to}')` behind a dev-mode guard.
- **Decision**: PENDING

### F9 — BFS uses O(n) `queue.shift()` for queue pop

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — single-line refactor to a head index
- **Dimension**: Safety & Quality
- **Location**: projects/edu-platform/src/explorers/state/actorMovementBounds.ts:102
- **Detail**: The BFS at `actorMovementBounds.ts:102` calls `queue.shift()` in the flood-fill loop, which is O(n) per call, making the overall fill O(n²) on queue size. Called once per NPC at scene create, so today's impact is negligible, but on larger maps with many NPCs this compounds. Sibling `state/spawnValidation.ts` avoids the issue entirely by iterating the grid directly.
- **Fix**: Replace `queue.shift()` with a head index — `let head = 0; while (head < queue.length) { const current = queue[head++]; ... }`.
- **Decision**: PENDING

### F10 — NPC animation frame-rate minimum is 1; plan suggested 4–5

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — one-number change
- **Dimension**: Plan Adherence
- **Location**: projects/edu-platform/src/explorers/entities/NPC.ts:97
- **Detail**: Plan Phase 3 says: *"If `Math.round((speed / PLAYER_SPEED) * WALK_FRAME_RATE)` produces visibly choppy playback, clamp NPC animation frame rate to a small minimum such as `4` or `5`."* The implementation clamps to `1`. With `NPC_SPEED = 80`, `PLAYER_SPEED = 240`, `WALK_FRAME_RATE = 10`, the computed value rounds to `3` — below the plan's suggested floor. Whether 3 fps walk animation reads as intentional or choppy is a judgement call that needs the Manual Acceptance matrix.
- **Fix**: Change `Math.max(1, ...)` to `Math.max(4, ...)` (or `5`) to match the plan's recommended floor.
- **Decision**: PENDING

<!-- End of report -->
