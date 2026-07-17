# Wall Collision & NPC Distance Fix — Revised Implementation Plan

## Why This Plan Was Rewritten

The original plan bundled three different problems into one fix path:

- wall-contact behavior
- player/NPC visual overlap
- collider sizing

The postmortem shows that was the core mistake. The failed implementation proved:

- reacting to `body.blocked` every frame creates feedback loops when the player pins an NPC into a wall
- "walking over heads" is primarily a draw-order problem until proven otherwise
- changing shared body constants is high-blast-radius because the same constants feed `Astronaut.ts`, `NPC.ts`, and `spawnValidation.ts`
- the actual runtime/editor/docs touchpoints are broader than the original "3 files only" assumption

This revised plan separates those concerns and adds hard stop-gates between phases.

## Confirmed Current State

Based on the current codebase:

- `src/explorers/entities/NPC.ts` still uses timer-only random wander, no idle state, no post-dialogue reset, optional per-instance speed, and fixed `DEPTH.PLAYER`
- `src/explorers/entities/Astronaut.ts` also uses fixed `DEPTH.PLAYER`, so player/NPC ordering never changes with vertical position
- `src/explorers/scenes/GameScene.ts` still reads the zone `speed` property and passes it into the NPC constructor
- `src/explorers/editor/ZonePropertiesPanel.svelte` still exposes an NPC `speed` field, so speed standardization must include editor cleanup
- shared `PLAYER_BODY_*` constants are consumed by `Astronaut.ts`, `NPC.ts`, and `spawnValidation.ts`, so global collider edits affect both runtime movement and spawn correction
- the cookbook path is `.ai/10x-devs/game/cookbook.md`, not `src/explorers/cookbook.md`

## Desired End State

After implementation:

- NPCs do not flicker or rapidly re-roll when pushed into a wall
- NPCs occasionally pause, and they resume calmly after dialogue/exam/arcade dismissal
- player/NPC overlap reads correctly because actor render order follows Y position
- NPC speed is standardized at `80 px/s`
- the editor no longer offers a dead `speed` field if runtime speed overrides are removed
- collider/body changes happen only if debug evidence still shows a real feet-box problem after draw order is fixed
- docs reflect the runtime behavior that actually ships

## Non-Goals

- no pathfinding, tether radius, or smarter NPC AI
- no `setImmovable(true)` on NPCs
- no global player collider resize as the first attempt at fixing NPC overlap
- no assumption that a visual overlap bug automatically implies bad collider math
- no committed debug-mode change in `gameConfig.ts`

## Implementation Principles

- Fix rendering and physics separately.
- Add debug evidence before changing collider dimensions.
- Replace one-frame wall reactions with explicit movement states.
- Keep each phase independently testable and shippable.
- If a phase does not clearly improve the observed behavior, stop and reassess instead of stacking more fixes.

## Phase 0: Baseline Debug Pass

### Goal

Start from observed behavior, not inference.

### Work

- Temporarily set `arcade.debug = true` in `src/explorers/config/gameConfig.ts` during local verification only. Do not commit that as part of the feature.
- Reproduce and capture these scenarios in at least `m0-awakening` and `m0-crew-room`:
  - NPC walks into a wall by itself
  - player pushes an NPC into a wall
  - player crosses above/below an NPC in open space
  - player crosses above/below an NPC near a wall tile
- Write down which symptom is present in each scenario:
  - wall jitter/flicker
  - draw-order overlap
  - collider overlap
  - speed/approachability issue

### Success Criteria

- The team has debug evidence for all four scenarios before changing collider sizes.
- If the open-space crossover case already proves the main issue is draw order, collider work stays out of the first implementation pass.

## Phase 1: Fix Actor Draw Order First

### Goal

Solve the "walking over heads" presentation bug with the lowest-risk change.

### Files

- `src/explorers/entities/Astronaut.ts`
- `src/explorers/entities/NPC.ts`

### Changes

- Replace the fixed actor depth with Y-sorted depth inside runtime updates.
- Keep actors inside the player depth band so walls, prompts, dialogue, and above-layer content still render correctly.
- Use a stable formula such as `DEPTH.PLAYER + this.y / 1000` rather than raw `this.y`, so actor ordering changes relative to other actors without blowing past the existing layer bands.
- Leave a constructor default depth in place, but treat the per-frame depth update as the source of truth.

### Acceptance Criteria

- When the player is lower on screen than an NPC, the player renders in front.
- When the player is higher on screen than an NPC, the NPC renders in front.
- The same ordering works while both actors are moving.
- `Above`, prompt, and dialogue layers still render above actors.

### Stop Gate

- If this phase resolves the reported "walking over heads" issue, do not proceed directly to collider resizing.

## Phase 2: Replace Wall-Bounce With Explicit Wall-Recovery State

### Goal

Fix wall-contact flicker without depending on per-frame `body.blocked` reactions.

### Files

- `src/explorers/entities/NPC.ts`
- `src/explorers/config/constants.ts`

### Optional Extraction

If the NPC update method starts getting too stateful, extract pure helpers into a small module such as `src/explorers/entities/npcMovement.ts` so timer/state transitions can be tested without Phaser scene setup.

### Changes

- Replace the implicit "set a velocity and wait for the next timer tick" behavior with explicit motion states:
  - `wandering`
  - `idle`
  - `wallRecovery`
  - `frozen`
- Keep a persistent movement intent while wandering instead of setting velocity only once per timer cycle.
- Add idle behavior and post-dialogue resume as explicit state transitions rather than side effects.
- Detect blocked travel direction with a helper like `isBlockedInTravelDirection(body, moveX, moveY)` instead of treating any blocked side as equivalent.
- Add a short blocked grace window before entering recovery. The first blocked frame should do nothing.
- When the NPC is genuinely blocked long enough, enter `wallRecovery`:
  - set velocity to zero
  - hold still for a short minimum recovery duration
  - do not pick a new direction until wall contact has been clear for a short stability window
- Keep wall recovery "sticky" while the player continues pinning the NPC. The correct outcome under sustained push is a calm idle/block state, not rapid direction changes.
- Reset movement timers cleanly on `freeze()`/`unfreeze()` so dialogue/exam/arcade dismissal resumes from idle before wandering again.

### Recommended Constants

- `NPC_IDLE_CHANCE`
- `NPC_IDLE_DURATION_MIN`
- `NPC_IDLE_DURATION_MAX`
- `NPC_IDLE_AFTER_UNFREEZE_MS`
- `NPC_WALL_BLOCKED_GRACE_MS`
- `NPC_WALL_RECOVERY_MIN_MS`
- `NPC_WALL_CLEAR_STABLE_MS`

### Accepted Enhancement From The Failed Attempt

If the user still wants it, preserve the previously accepted "NPC faces the player during dialogue" behavior, but place it explicitly in the interaction flow:

- add `faceTowards(targetX, targetY)` to `NPC.ts`
- call it from `GameScene.handleInteraction()` or `startDialogue()` only for `npc` interactions
- do not bury dialogue-facing behavior inside the generic `freeze()` method

### Why This Phase Differs From The Failed Implementation

- no immediate bounce on `body.blocked`
- no `wasBlocked` edge detector
- no `setImmovable(true)`
- no attempt to solve push-into-wall flicker with one-frame direction rerolls

### Automated Verification

- `npx tsc --noEmit`
- `npm run test:explorers`
- `npm run lint`

### Manual Acceptance Criteria

- An NPC no longer flickers when pushed into a wall.
- An NPC can still recover from grazing a wall during normal wandering.
- Post-dialogue resume feels calm and predictable.
- Idle pauses read as intentional rather than rare accidents.

## Phase 3: Standardize NPC Speed And Remove The Dead Editor Affordance

### Goal

Make NPC pacing consistent across levels and keep the editor honest.

### Files

- `src/explorers/config/constants.ts`
- `src/explorers/entities/NPC.ts`
- `src/explorers/scenes/GameScene.ts`
- `src/explorers/editor/ZonePropertiesPanel.svelte`

### Changes

- Change `NPC_SPEED` to `TILE_SIZE * 1.25` (`80 px/s`).
- Remove the optional `speed` constructor parameter from `NPC.ts`.
- Remove `speedProp` reading/passing from `GameScene.ts`.
- Remove the NPC `speed` field from `ZonePropertiesPanel.svelte` so designers cannot author ignored data.
- Re-check NPC walk animation cadence at the new speed. If `Math.round((speed / PLAYER_SPEED) * WALK_FRAME_RATE)` produces visibly choppy playback, clamp NPC animation frame rate to a small minimum such as `4` or `5`.

### Automated Verification

- `npx tsc --noEmit`
- `npm run test:explorers`
- `npm run lint`

### Manual Acceptance Criteria

- NPC movement speed feels consistent across levels.
- NPCs are clearly slower and easier to approach than the player.
- Walk animation cadence still looks intentional at the standardized speed.

## Phase 4: Collider Calibration Only If Debug Still Shows A Real Body Problem

### Goal

Make collider changes only if Phase 1 proves draw order was not the whole story.

### Files

- Prefer `src/explorers/entities/NPC.ts`
- Prefer `src/explorers/config/constants.ts`
- Touch `src/explorers/state/spawnValidation.ts` only if player-body changes are explicitly required

### Changes

- Do not start by editing shared `PLAYER_BODY_*` constants.
- If NPC-only tuning is still needed, introduce dedicated NPC body constants instead of reusing player-body constants:
  - `NPC_BODY_WIDTH`
  - `NPC_BODY_HEIGHT`
  - `NPC_BODY_OFFSET_X`
  - `NPC_BODY_OFFSET_Y`
- Start with the smallest viable adjustment.
- Prefer width/offset calibration before increasing collider height.
- After each candidate change, re-run debug overlays and corridor traversal checks.
- Only change the player body and spawn-validation math if the remaining problem is explicitly player-vs-world collision, not actor-vs-actor visual ordering.

### Manual Acceptance Criteria

- Debug outlines match the intended actor footprint.
- Player/NPC collision feels solid without harming movement through tight spaces.
- Spawn correction still behaves correctly if player-body constants are touched.

### Rollback Rule

- If collider calibration harms corridor traversal or spawn safety, revert that phase and keep the draw-order + movement fixes.

## Phase 5: Documentation Updates

### Files

- `.ai/10x-devs/game/cookbook.md`

### Changes

- Update NPC behavior documentation to describe:
  - Y-sorted actor depth
  - idle + post-dialogue resume behavior
  - wall-recovery behavior instead of timer-only wall handling
  - standardized speed
- Update the editor-support section so it no longer documents an NPC `speed` field if that field is removed.
- Correct any stale references to the old cookbook path in planning notes or follow-up docs if needed.

## Testing Strategy

### Automated

- `npx tsc --noEmit`
- `npm run test:explorers`
- `npm run lint`

### Manual Matrix

Run after each relevant phase in:

- `m0-awakening`
- `m0-crew-room`
- at least one additional map before any collider change is considered complete

Required checks:

- player above/below NPC draw order
- NPC wandering into wall alone
- player pushing NPC into wall
- dialogue start/dismiss behavior
- speed consistency across maps
- corridor traversal after any collider/body tweak

## Risks

- Y-sorted depth may expose other actor-order assumptions, so keep the formula inside the actor depth band.
- Wall recovery may make NPCs feel too passive if timers are too long; tune timers before changing the physics model again.
- Collider tuning remains the highest-risk phase because it can affect movement feel and spawn safety.

## Recommended Delivery Order

Do not batch this into one large implementation. Ship in this order:

1. Phase 1 alone
2. Phase 2 alone
3. Phase 3 alone
4. Phase 4 only if still justified by debug evidence
5. Phase 5 last

Each phase should stop for manual verification before moving on.

## References

- Postmortem: `thoughts/shared/reviews/2026-04-22-wall-collision-npc-distance-postmortem.md`
- Prior review: `thoughts/shared/reviews/2026-04-22-wall-collision-npc-distance-fix-plan-review.md`
- Original brief: `thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix-brief.md`
- Runtime files:
  - `src/explorers/entities/NPC.ts`
  - `src/explorers/entities/Astronaut.ts`
  - `src/explorers/scenes/GameScene.ts`
  - `src/explorers/config/constants.ts`
  - `src/explorers/config/gameConfig.ts`
  - `src/explorers/editor/ZonePropertiesPanel.svelte`
  - `src/explorers/state/spawnValidation.ts`
  - `.ai/10x-devs/game/cookbook.md`

<!-- PLAN STATUS: Last Phase Completed: 5, Next Phase: none, Updated: 2026-04-22 -->
