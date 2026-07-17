# Arcade Station Completion Flags And Immersive Post-Clear State Implementation Plan

## Overview

Replace repeatable score-based arcade XP with contextual arcade station completion state. Each arcade station becomes a small authored room mission identified by `mapKey + zoneId + arcadeGameId`; first clear sets a deterministic flag, can trigger a short completion dialogue, and can feed quests or chapter beats. Arcade stations remain replayable for immersion and practice, but once solved they should clearly communicate that the mission is already done and no extra XP is available.

## Current State Analysis

The current arcade loop is mechanically isolated but progression-hostile:

- `GameScene` launches arcade content using only `arcadeGameId`, with no map or zone context in the event payload (`src/explorers/scenes/GameScene.ts:457-469`).
- `ArcadeScene` always converts score into XP and grants it immediately on every run (`src/explorers/scenes/ArcadeScene.ts:417-431`).
- Dialogue routing already supports ordered flag variants per interaction zone, which is the right primitive for room-state flavor after an arcade station is solved (`src/explorers/levels/types.ts:6-15`, `src/explorers/scenes/GameScene.ts:497-510`).
- The flag runtime already accepts arbitrary non-system strings, deduplicates them, and persists them (`src/explorers/state/flagManager.ts:9-26`).
- Quest event objectives can already match event payloads and can also auto-satisfy from a flag, so arcade station completion can be consumed by quests without a new quest architecture (`src/explorers/systems/QuestManager.ts:25-35`, `src/explorers/systems/QuestManager.ts:183-226`).
- The static `FLAGS` registry is intentionally finite and hand-curated, so per-station arcade completion should not be added there as one constant per machine (`src/explorers/config/flags.ts:1-41`).

Product decisions captured from the current discussion:

- Chapter pacing optimizes for roughly one rank-up per chapter.
- Replayable arcade content must not be the main source of rank XP.
- Arcade should stay in the game because it adds flavor, world texture, and room-specific immersion.
- We should not overload the same station interaction with a branching "talk or replay?" flow in this plan because the current dialogue system is linear and has no choice UI (`src/explorers/systems/DialogueTypes.ts:1-29`).

### Key Discoveries

- `ArcadeGameDefinition.id` is already an instance-level identifier such as `arcade-asteroid-test`, not just a renderer type, so it can continue to represent a specific station definition (`src/explorers/levels/m0-crew-room/games.ts:3-31`).
- The current crew-room map already contains three stable arcade zone IDs that match the current game IDs, so the first rollout does not need a map-format migration before contextual flags can work (`public/game/maps/m0-crew-room.json:608-670`).
- `InteractionRoute.flagVariants` is string-based, not enum-based, which means generated arcade station flags can be consumed by dialogue routing without extending route types (`src/explorers/levels/types.ts:6-15`).

## Desired End State

After implementation:

1. Every arcade session carries full station context: `mapKey`, `zoneId`, and `arcadeGameId`.
2. Each arcade definition can declare what "mission solved" means for that station.
3. First clear sets a deterministic per-station completion flag and emits an enriched completion event.
4. Arcade replay grants no rank XP by default.
5. On first clear, the game can optionally trigger a short completion dialogue to sell the fiction of "job done in this room."
6. On second and later approaches to a solved station, the arcade intro state displays a clear solved-status indicator before play starts.
7. Quests, doors, NPCs, boards, and room flavor dialogues can react to arcade completion flags using existing flag-routing patterns.
8. Arcade stations remain replayable after completion for fun and training, but replay is progression-neutral.

### Verification

- Clear each M0 arcade station once and confirm a station-scoped flag is persisted.
- Replay a cleared station and confirm XP does not change and no duplicate first-clear reward fires.
- Replay a cleared station and confirm the solved-status message is shown before the run starts.
- Confirm first-clear completion dialogue appears once when configured.
- Confirm at least one room dialogue in `m0-crew-room` changes after each respective arcade station is solved.
- Confirm any quest wired to arcade completion can complete via enriched arcade event payloads or via `requireFlag`.

## What We're NOT Doing

- No branching dialogue-choice UI for "replay vs inspect" on the same interaction.
- No persistent leaderboard or personal-best feature in this plan.
- No daily XP caps or diminishing-return systems; the plan removes replayable rank XP instead of trying to throttle it.
- No backfill migration for players who already played arcade stations before this change; existing saves have no historical station-clear state to reconstruct.
- No chapter-wide training currency in this plan.
- No removal of arcade replay itself.

## Implementation Approach

Treat arcade as authored station content, not as an infinite XP loop.

The implementation has four core moves:

1. Add a small station-context model and deterministic flag helper.
2. Stop `ArcadeScene` from granting score-based XP on every run.
3. Evaluate station success using authored clear conditions and set a per-station flag on first clear.
4. Reuse existing dialogue routing and quest event patterns so room flavor and progression react to station completion without inventing a second content system.

This keeps the change incremental:

- the arcade renderer architecture stays intact
- the flag runtime stays intact
- the quest system stays intact
- the map format can stay as-is for the first M0 rollout

## Critical Implementation Details

### Timing & Lifecycle Considerations

- `GameScene` should emit `ARCADE_SHOW` with station context at interaction time, before input is disabled, so the overlay scene has a stable source of truth for `mapKey`, `zoneId`, and `arcadeGameId`.
- `ArcadeScene` should check solved-state before gameplay starts so the intro panel can render the replay disclaimer on subsequent approaches.
- `ArcadeScene` should evaluate first-clear state after the renderer reports its final result and before the results UI is finalized, because the results copy may need to distinguish between `mission solved`, `already solved`, and `practice only`.
- First-clear dialogue should not be emitted until the arcade overlay dismisses or transitions out cleanly; otherwise the dialogue overlay competes with the results overlay. Follow the same bus-driven pattern already used for quest completion dialogues, but schedule it after arcade teardown.
- Flag-setting must remain idempotent by relying on `setFlag()` returning `false` when the station flag already exists (`src/explorers/state/flagManager.ts:9-26`).

### User Experience Specification

- Before first clear, interacting with an arcade station launches the mini-game as it does today.
- On first successful clear, the results screen should communicate that the room problem is resolved, not that the player simply farmed points.
- On second and later approaches to a solved station, the pre-start arcade UI should show a clear solved-status message: `Misja w tym miejscu jest już wykonana. Dodatkowe XP nie zostanie przyznane - możesz zagrać dla zabawy. Powodzenia!`.
- After first clear, replay remains available from the same station with unchanged controls and no progression pressure.
- Post-clear immersion should come from a short completion dialogue and from room-state dialogue variants on nearby interactables, not from removing replay access.
- If the player fails to meet the station's authored success threshold, the station remains uncleared and the results copy should signal that more work is needed.

### Performance & Optimization Strategy

- **Memoization Plan**: N/A. This feature is event-driven Phaser state, not a React selector problem.
- **Re-render Prevention**: N/A. No new Svelte or React render loop changes are required.
- **Cache Strategy**: Build the arcade station completion flag from plain string inputs at the point of use; no registry cache is needed.
- **Array References**: N/A. The only persistent mutation is appending a string flag to `GameState.flags`.

### State Management Sequencing

- Event flow should become: `player interacts with arcade zone -> GameScene emits ARCADE_SHOW with station context -> ArcadeScene runs game -> ArcadeScene evaluates mission outcome -> first-clear flag is set if appropriate -> ARCADE_COMPLETED emits enriched payload -> optional first-clear dialogue is queued -> arcade overlay dismisses`.
- Story progression should listen to `ARCADE_COMPLETED` and/or station flags, not to score-derived XP.
- Optional one-time story rewards, if ever needed later, should be granted by quest or dialogue content keyed off the station-clear flag, not by replayable arcade runtime logic.
- Existing saves remain valid because the state schema does not need a dedicated arcade-progress object; per-station completion is represented in the existing `flags` array.

### Debug & Observability Plan

- **Verification Method**: Add targeted unit tests for station-flag generation, first-clear idempotency, and mission-success evaluation. Add manual checks for dialogue variants and replay neutrality.
- **Logging Strategy**: Extend existing `devLog` calls in `ArcadeScene` and `GameScene` to include `mapKey`, `zoneId`, `arcadeGameId`, `solved`, and `firstClear`.
- **Debug Instrumentation**: QA overlay already exposes live flags, so arcade completion can be verified there without new tooling.
- **Timing Debug**: Log the order of `ARCADE_COMPLETED`, `FLAG_SET`, and queued `DIALOGUE_SHOW` to catch overlay sequencing bugs.
- **Metrics**: N/A for production telemetry. This plan relies on local logs and manual gameplay verification.

## Phase 1: Add Context-Aware Arcade Station Progress

### Overview

Introduce station context and deterministic completion flags so arcade runs can be tied to a specific room mission rather than a global score faucet.

### Changes Required

#### 1. Add an arcade station context and flag helper

**Files**: `src/explorers/systems/ArcadeTypes.ts`, `src/explorers/state/arcadeFlags.ts` (new)

**Changes**:

- Add a reusable `ArcadeStationContext` shape:
  - `mapKey: string`
  - `zoneId: string`
  - `arcadeGameId: string`
- Add a deterministic helper such as `getArcadeStationClearFlag(context)`.
- Use a machine-readable prefix such as `arcade:${mapKey}:${zoneId}:${arcadeGameId}`.
- Do not add these generated flags to `FLAGS`; keep them derived at runtime.

#### 2. Extend arcade event payloads with station context

**Files**: `src/explorers/events/GameEvents.ts`, `src/explorers/scenes/GameScene.ts`

**Changes**:

- Extend `ArcadeShowPayload` to include `mapKey` and `zoneId` in addition to `arcadeGameId`.
- Extend `ArcadeCompletedPayload` to include:
  - `mapKey`
  - `zoneId`
  - `stationFlag`
  - `solved`
  - `firstClear`
- Update `GameScene` arcade interaction (`src/explorers/scenes/GameScene.ts:457-469`) to emit full station context, using `this.mapKey` plus `obj.objectId`.

#### 3. Add authored mission-clear config to arcade definitions

**Files**: `src/explorers/systems/ArcadeTypes.ts`, `src/explorers/levels/m0-crew-room/games.ts`

**Changes**:

- Extend `ArcadeGameDefinition` with mission-success config rather than XP config.
- Replace or deprecate `baseXp` and `scoreMultiplier` for this path.
- Add a field group such as:

```ts
mission?: {
  requireCompleted?: boolean;
  minScore?: number;
  firstClearDialogueId?: string;
}
```

- For the first rollout, define simple thresholds per M0 station that map to "problem solved in this room" rather than "perfect score."

#### 4. Evaluate mission success in ArcadeScene instead of granting repeatable XP

**File**: `src/explorers/scenes/ArcadeScene.ts`

**Changes**:

- Remove score-to-XP granting from the end-of-game path (`src/explorers/scenes/ArcadeScene.ts:417-431`).
- On scene wake, compute the station-clear flag immediately and check whether it is already present so the intro panel knows whether to render the solved-status banner.
- Compute `solved` from the arcade result and the definition's mission-clear config.
- Build the station-clear flag from the current arcade context.
- On first successful clear, call `setFlag()` for the station flag.
- Emit the enriched `ARCADE_COMPLETED` payload every run, but only mark `firstClear: true` on the first successful clear.
- Update intro and result-copy rendering so the UI explains mission outcome instead of XP payout.

### Success Criteria

#### Automated Verification

- [x] `npm run build`
- [x] `npm run test:explorers`
- [x] Add unit tests for `getArcadeStationClearFlag()`
- [x] Add unit tests for mission-clear evaluation logic

#### Manual Verification

- [ ] Starting any arcade station still opens the correct mini-game
- [ ] First clear sets a new generated flag visible in QA tools
- [ ] Approaching a solved station shows the solved-status banner before play starts
- [ ] Replaying the same station does not increase XP
- [ ] Failed attempts do not set the clear flag

**Implementation Note**: After this phase, pause for manual verification of first-clear flagging and replay-neutral progression before moving on.

---

## Phase 2: Connect Station Clears To Story And Dialogue

### Overview

Make arcade completion useful to authored content by wiring first-clear dialogues and quest-friendly completion signals into the existing content pipeline.

### Changes Required

#### 1. Add optional first-clear dialogue support

**Files**: `src/explorers/scenes/ArcadeScene.ts`, `src/explorers/systems/DialogueTypes.ts` (if helper typing is needed only), relevant level dialogue files

**Changes**:

- Allow an arcade definition to name a `firstClearDialogueId`.
- After the arcade overlay dismisses, emit `DIALOGUE_SHOW` for that dialogue on first clear only.
- Keep this one-shot and flag-backed; no repeated completion dialogue on replay.

#### 2. Add solved-status replay messaging in the arcade intro UI

**Files**: `src/explorers/scenes/ArcadeScene.ts`

**Changes**:

- Extend the existing arcade intro panel so solved stations render a persistent status banner before the player starts the run.
- Use the exact replay disclaimer copy requested for now:
  - `Misja w tym miejscu jest już wykonana. Dodatkowe XP nie zostanie przyznane - możesz zagrać dla zabawy. Powodzenia!`
- Make the solved-status banner purely informational; it must not block replay.

#### 3. Reuse the existing quest event pattern for arcade-driven objectives

**Files**: `src/explorers/events/GameEvents.ts`, content quest files as needed

**Changes**:

- Keep `ARCADE_COMPLETED` as a general event that event quests can match with `matchPayload`.
- When a chapter wants an arcade station to matter for progression, use one of two existing patterns:
  - `requireFlag` against the generated station-clear flag
  - `matchPayload` against `mapKey`, `zoneId`, or `arcadeGameId`
- Do not add special arcade-only quest logic to `QuestManager`; the current event quest model is already sufficient (`src/explorers/systems/QuestManager.ts:25-35`, `src/explorers/systems/QuestManager.ts:183-226`).

#### 4. Add content hooks for post-clear room-state flavor

**Files**: `src/explorers/levels/m0-crew-room/dialogues.ts`, `src/explorers/levels/m0-crew-room/manifest.ts`

**Changes**:

- Add short completion dialogues for each M0 arcade station, for example:
  - asteroid station: no more bursts in this sector
  - signal station: no new signals in queue
  - oscilloscope station: the array is stable for now
- Add one or more room dialogue variants keyed by generated station-clear flags so the room feels different after solving each local problem.
- Favor nearby boards, crew chatter, or equipment readouts over trying to turn the arcade station itself into a dialogue-branch interaction.

### Success Criteria

#### Automated Verification

- [x] `npm run build`
- [x] `npm run test:explorers`
- [x] Add tests covering `firstClear` behavior in the arcade completion path
- [x] Add tests verifying solved stations render the replay disclaimer on later approaches
- [x] Add tests verifying duplicate first-clear dialogue does not fire on replay

#### Manual Verification

- [ ] First clear of each M0 arcade station triggers the intended one-time completion dialogue
- [ ] Second approach to each solved station shows `Misja w tym miejscu jest już wykonana. Dodatkowe XP nie zostanie przyznane - możesz zagrać dla zabawy. Powodzenia!`
- [ ] Nearby room flavor changes after the corresponding station is solved
- [ ] Replaying a solved station remains possible and does not replay the completion dialogue
- [ ] Existing non-arcade dialogues in the room still route correctly

**Implementation Note**: After this phase, pause for manual confirmation that the room still feels natural and that the post-clear dialogue beats are not intrusive.

---

## Phase 3: Migrate M0 Away From Arcade XP And Lock Pacing

### Overview

Finish the pacing shift by ensuring intro progression no longer depends on repeatable arcade XP and that M0 uses arcade as authored flavor plus optional quest support.

### Changes Required

#### 1. Remove arcade XP assumptions from progression content

**Files**: `thoughts/shared/plans/2026-03-25-xp-rank-balance.md`, any M0 progression content files affected by implementation

**Changes**:

- Align the living progression notes with the shipped behavior once implementation lands.
- Ensure M0 progression-critical rewards come from exams, quests, or explicit milestones rather than arcade runtime scoring.

#### 2. Calibrate station success thresholds against chapter pacing

**Files**: `src/explorers/levels/m0-crew-room/games.ts`, related quest/dialogue files if arcade clears participate in M0 progression

**Changes**:

- Tune each station's clear condition so it feels like "job done" rather than "mastery grind."
- Keep thresholds low enough that arcade contributes immersion and authored tasks, not skill-wall frustration.

#### 3. Add regression coverage for no-repeatable-XP behavior

**Files**: arcade scene tests, quest tests if M0 quest wiring uses arcade events

**Changes**:

- Add a regression test that repeated arcade plays leave XP unchanged.
- Add a regression test that first-clear flags remain idempotent across reloads and replays.

### Success Criteria

#### Automated Verification

- [x] `npm run build`
- [x] `npm run test:explorers`
- [x] Regression tests prove repeat arcade play no longer changes XP
- [x] Regression tests prove first-clear behavior is save-safe and idempotent

#### Manual Verification

- [ ] A fresh M0 playthrough no longer uses arcade grinding to advance rank pacing
- [ ] Arcade still feels worth interacting with because it changes room fiction and authored state
- [ ] The chapter remains completable without replay farming

**Implementation Note**: After this phase, pause for a full M0 manual pass before applying the same pattern to later chapters.

---

## Testing Strategy

### Unit Tests

- Flag helper generation for deterministic station keys
- Mission-clear evaluation for combinations of `completed`, `minScore`, and score edge cases
- First-clear idempotency when the same station is replayed
- Duplicate dialogue suppression after a station is already solved

### Integration Tests

- `GameScene` passes full station context into `ARCADE_SHOW`
- `ArcadeScene` emits enriched `ARCADE_COMPLETED` payloads with `solved` and `firstClear`
- Event quest objectives can complete from arcade completion payload matching

### Manual Testing Steps

1. Start a fresh M0 save and enter the crew room.
2. Play each arcade station once below its clear threshold and confirm no clear flag is added.
3. Replay and meet the clear threshold; confirm the station-clear flag appears and the one-time completion dialogue triggers.
4. Interact with nearby room flavor content and confirm dialogue variants reflect the solved station.
5. Replay the same station again and confirm the intro shows `Misja w tym miejscu jest już wykonana. Dodatkowe XP nie zostanie przyznane - możesz zagrać dla zabawy. Powodzenia!`.
6. Confirm no XP changes, no duplicate first-clear dialogue plays, and the mini-game still works normally.
7. Reload the save and confirm the station remains cleared and room dialogue stays updated.

## Performance Considerations

- This plan adds only string construction, one extra flag check, and small event payload expansions; runtime cost is negligible.
- The main risk is sequencing between arcade dismissal and completion dialogue display, not frame-time performance.
- Because state remains in the existing `flags` array, save payload growth is linear in the number of cleared stations. That is acceptable for the current scale.

## Migration Notes

- Existing saves remain structurally compatible because no `GameState` schema migration is required.
- Existing player XP is not rewritten; this plan only changes future arcade runs.
- There is no safe backfill for old arcade clears, so players who already played a station before this rollout may need to clear it once again to receive the new station flag and associated room-state changes.
- If later chapters reuse the same mini-game renderer in multiple rooms, the generated station flag remains unique because it includes both `mapKey` and `zoneId`.

## References

- Command template: `.claude/commands/10x-plan.md`
- Related progression note: `thoughts/shared/plans/2026-03-25-xp-rank-balance.md`
- Existing arcade plan: `thoughts/shared/plans/2026-03-25-arcade-minigames.md`
- Arcade interaction entry point: `src/explorers/scenes/GameScene.ts:457-469`
- Arcade XP grant path to replace: `src/explorers/scenes/ArcadeScene.ts:417-431`
- Dialogue route flag variants: `src/explorers/levels/types.ts:6-15`
- Dynamic flag runtime behavior: `src/explorers/state/flagManager.ts:9-26`
- Quest event matching and flag bootstrap: `src/explorers/systems/QuestManager.ts:25-35`, `src/explorers/systems/QuestManager.ts:183-226`
