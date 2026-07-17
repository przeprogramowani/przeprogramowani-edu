---
date: 2026-03-25T12:00:00+01:00
researcher: Claude
git_commit: 8bec5dcbfca0641e6690bf89d6575853d20d26d3
branch: master
repository: przeprogramowani-sites
topic: "Arcade Mini-Games System — Feasibility & Complexity Cross-Check"
tags: [research, codebase, arcade, minigames, phaser, game, 10x-explorers]
status: complete
last_updated: 2026-03-25
last_updated_by: Claude
---

# Research: Arcade Mini-Games System — Feasibility & Complexity Cross-Check

**Date**: 2026-03-25T12:00:00+01:00
**Researcher**: Claude
**Git Commit**: 8bec5dcb
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Cross-check feasibility and complexity of the arcade minigames implementation plan (`thoughts/shared/plans/2026-03-25-arcade-minigames.md`) against the existing codebase. Identify potential issues, suggestions, and improvements.

## Summary

The plan is **highly feasible** — it closely follows the established ExamScene overlay pattern and makes correct assumptions about almost every integration point. The architecture is sound and the phased approach is sensible. However, the research uncovered several **inaccuracies, gaps, and improvement opportunities** detailed below.

## Detailed Findings

### 1. Plan Accuracy — Confirmed Correct

The plan correctly identifies and mirrors these patterns:

| Aspect | Plan Reference | Codebase Reality | Status |
|--------|---------------|-------------------|--------|
| ExamScene sleep/wake lifecycle | Phase 1, §8 | `ExamScene.ts:44` sleep, `:56-58` wake | Correct |
| Dark overlay creation | Phase 1, §8 | `ExamScene.ts:99-103` rectangle 0x000000/0.75, scrollFactor(0), DEPTH.EXAM | Correct |
| Input disable pattern | Phase 1, §10 | `GameScene.ts:457-460` setEnabled(false), enterState('cutscene'), freeze NPCs | Correct |
| Input restore on dismiss | Phase 1, §10 | `GameScene.ts:236-242` onExamDismissed restores idle + enabled + unfreeze | Correct |
| Scene registration in BootScene | Phase 1, §9 | `BootScene.ts:60-64` scene.add with false parameter | Correct |
| Scene launch in GameScene | Phase 1, §10 | `GameScene.ts:313-321` isActive check + launch | Correct |
| DEPTH.EXAM = 90 | Phase 1, §6 | `constants.ts:43` EXAM: 90 | Correct |
| InteractiveObject type union | Phase 1, §4 | `InteractiveObject.ts:11,17` — 4 types | Correct |
| Event bus pattern | Phase 1, §5 | `GameEvents.ts:37-40` EXAM_SHOW/COMPLETED/DISMISSED | Correct |
| Zone parsing from Tiled | Phase 1, §10 | `GameScene.ts:124-153` parses Zones layer | Correct |
| XP via updateState + XP_GAINED | Phase 1, §11 | `ExamManager.ts:83-114` exact pattern | Correct |

### 2. Inaccuracies & Corrections Needed

#### 2a. InteractiveObjectConfig line reference is wrong
- **Plan says**: `InteractiveObjectConfig` at line 7, `objectType` at line 17
- **Actual**: `InteractiveObjectConfig` interface has `objectType` at line 11, class field at line 17-18
- **Impact**: Minor — the plan's code change is still correct, just wrong line numbers

#### 2b. GameScene handleInteraction line references are off
- **Plan says**: `handleInteraction()` at ~line 414, zone debug at ~line 158, prompt at ~line 400
- **Actual**: `handleInteraction()` at line 414 (correct), debug at line 156-171, prompt at lines 400-404
- **Impact**: Negligible — close enough

#### 2c. ExamScene does NOT extend BaseScene's updateState directly for XP
- **Plan says** (Phase 1, §11): "BaseScene already has `updateState()`" so XP is granted in ArcadeScene via `this.updateState()`
- **Actual**: ExamScene delegates XP granting to `ExamManager` (line 27), which receives a `setState` callback. The ExamManager calls `setState(() => ({ xp: newXp }))` at `ExamManager.ts:83-94` and emits `XP_GAINED` at line 110-114.
- **Recommendation**: ArcadeScene can use `this.updateState()` directly (simpler than ExamManager's callback pattern). This works fine but is a slight deviation from the exam pattern. Consider creating a small `grantXp(amount)` helper in BaseScene to standardize.

#### 2d. Exam completion check pattern won't apply to arcade
- **Plan says** (Phase 1, §10): Arcade case mirrors exam case
- **Actual**: The exam case (GameScene.ts:442-463) checks `examDone` by verifying all reward flags are present, and if done, shows a completion dialogue instead of re-launching the exam. The plan says "no unlock gating, always playable" — so the arcade case is simpler (no completion check needed).
- **Impact**: Good — the plan's arcade case code in Phase 1 §10 correctly omits completion checking.

#### 2e. m0-core-ai manifest has NO exams currently
- **Plan** (Phase 2, §3) adds a test arcade game to m0-core-ai manifest
- **Actual**: The `m0-core-ai/manifest.ts` does NOT include an `exams` field. Exams are defined in `m0-exam-room/manifest.ts`.
- **Impact**: Fine for testing — arcade games can be placed on any level. But the plan should note that m0-core-ai doesn't have exam precedent, so this is genuinely new for that level.

### 3. Gaps & Missing Considerations

#### 3a. GameManifestLevel serialized type needs updating
- **File**: `src/explorers/levels/levelLoader.ts:9-22`
- The `GameManifestLevel` interface (used for API serialization) must add `arcadeGames: ArcadeGameDefinition[]`
- The plan mentions updating levelLoader (Phase 1, §3) and api/game.ts (Phase 5, §1) but doesn't explicitly mention updating `GameManifestLevel` type
- **Suggestion**: Add `arcadeGames: ArcadeGameDefinition[]` to `GameManifestLevel` interface

#### 3b. Level index doesn't need changes but should be noted
- `src/explorers/levels/index.ts` has a server-side `getAllQuests()` helper. If arcade games need server-side access (e.g., for validation), a similar `getAllArcadeGames()` would be needed here too.
- The plan's Phase 1 §3 mentions this in levelLoader but not in the index file.

#### 3c. Cookbook should be updated
- The cookbook at `.ai/10x-devs/game/cookbook.md` has no mention of arcade games
- After implementation, a new section should be added documenting the arcade system pattern
- **Impact**: Important for future maintenance and AI-assisted development

#### 3d. Game spec file doesn't exist
- The plan references `.ai/10x-devs/game/10x-explorers-spec.md` but this file doesn't exist in the repo
- **Impact**: Documentation gap — the spec is referenced in CLAUDE.md but missing

#### 3e. No Tiled map editing guidance
- The plan correctly says "not generating Tiled maps" but doesn't document HOW to add arcade zones in Tiled
- Arcade zones need: type="arcade", property `id` (string), property `arcadeGameId` (string)
- **Suggestion**: Add a brief Tiled setup guide in the cookbook update

#### 3f. Scene shutdown cleanup
- ExamScene registers its `EXAM_SHOW` listener in `create()` and cleans up on `shutdown` (lines 39-41)
- GameScene registers `EXAM_DISMISSED` listener and cleans up in a shutdown handler
- The plan mentions cleanup but doesn't show the exact shutdown handler code
- **Suggestion**: Explicitly show shutdown cleanup in Phase 1 §8 and §10

### 4. Complexity Assessment

#### Phase 1 (Infrastructure): LOW-MEDIUM complexity
- 11 touch points, but each is small and follows established patterns
- ArcadeScene shell (~200 lines) is the largest new file
- **Estimated LOC**: ~350 new, ~50 modified
- **Risk**: Low — all patterns are well-established

#### Phase 2 (Asteroid Range): MEDIUM complexity
- Most complex renderer — real-time physics-like movement, collision detection, object pooling
- WSAD + SPACE input is straightforward but needs smooth movement (velocity tracking)
- Wave spawning system with difficulty scaling adds parameters
- **Estimated LOC**: ~300-400
- **Risk**: Medium — gameplay feel requires tuning. The procedural asteroid rendering (irregular edges via graphics.lineStyle) may look crude without careful implementation

#### Phase 3 (Memory Matrix): MEDIUM complexity
- Grid management is straightforward
- CRT/scanline aesthetic is fun but adds rendering complexity
- Round progression logic has several states (show → input → feedback → next)
- **Estimated LOC**: ~250-350
- **Risk**: Low-Medium — state machine is well-defined in the plan

#### Phase 4 (Oscilloscope): MEDIUM-HIGH complexity
- Waveform rendering requires Graphics API line drawing (200 sample points per frame)
- Parameter adjustment UI is the most complex chrome in the plan
- Match% calculation needs to feel fair and intuitive
- Composite waveforms at high difficulty could be frustrating
- **Estimated LOC**: ~350-450
- **Risk**: Medium — the UX of adjusting wave parameters needs careful design. Tab cycling through parameters could feel awkward on keyboard-only

#### Phase 5 (Polish): LOW complexity
- API serialization is trivial (1 line addition)
- Level loader deserialization mirrors existing exam pattern
- **Estimated LOC**: ~30-50
- **Risk**: Very low

### 5. Suggestions & Improvements

#### 5a. Add a shared ArcadeScene chrome component
The header bar (title, score, timer) and footer bar (ESC hint, difficulty stars) will be identical across all three games. Extract this into a reusable `ArcadeChrome` class that manages these UI elements, so ArcadeScene stays focused on lifecycle.

#### 5b. Consider a state machine for ArcadeScene
The ArcadeScene has multiple states: `idle` (sleeping), `intro` (showing description before game starts), `playing` (renderer active), `results` (showing score/XP). A simple state enum would make the lifecycle clearer than ad-hoc boolean flags.

#### 5c. Add a "Ready?" countdown before gameplay starts
The plan goes straight from "press E" to "game running." A 3-2-1 countdown would give players time to orient, especially for the asteroid game where action starts immediately.

#### 5d. Renderer registry should not use `null as any`
The plan's Phase 2 §2 uses `null as any` for unimplemented renderers. This bypasses TypeScript safety. Instead, use a `Map` or throw a descriptive error for unregistered types (which the `createRenderer` function already does).

#### 5e. Consider replayability tracking
While the plan explicitly says "no persistent high score tracking," the `ArcadeCompletedPayload` should include enough data (gameId, score, timestamp) that high scores could be added later without changing the event contract.

#### 5f. Object pooling for asteroids should be built in from the start
The plan mentions object pooling in "Performance Considerations" but doesn't include it in Phase 2 implementation. At 30 max asteroids with creation/destruction each frame, this could cause GC pressure. Include pooling in the initial implementation.

#### 5g. Memory Matrix: durationSeconds=0 needs handling
The plan sets `durationSeconds: 0` for the round-based Memory Matrix game. ArcadeScene's timer logic must handle this case (no timer display, no auto-end on time).

#### 5h. Oscilloscope: match calculation edge case
The `calculateMatch()` function uses `maxPossibleError = sampleCount * 2` which assumes amplitudes max at ±1. If difficulty adds DC offset or secondary wave amplitude, the max possible error increases. The normalization should be dynamic based on actual parameter ranges.

#### 5i. Keyboard conflict with terminal
The terminal uses text input. If a player has the terminal open and walks to an arcade zone, pressing E should not trigger arcade (and vice versa). The plan doesn't address this but it's likely safe because:
- Terminal focus disables InputController (GameScene.ts:220-223)
- Interaction detection requires `isInteractJustPressed()` which gates on `enabled`
- **Conclusion**: Safe as-is, but worth verifying during manual testing

#### 5j. ExamScene and ArcadeScene mutual exclusion
Both ExamScene and ArcadeScene use depth 90. If both were somehow active simultaneously, they'd z-fight. The plan should note that only one overlay (exam OR arcade) can be active at a time. Given the sleep/wake pattern and input gating, this is naturally enforced — but a defensive check (e.g., don't show arcade if exam is active) would be prudent.

## Code References

- `src/explorers/scenes/ExamScene.ts` — Primary pattern reference for overlay lifecycle
- `src/explorers/scenes/BaseScene.ts:31-39` — `updateState()` method for state changes
- `src/explorers/scenes/GameScene.ts:414-466` — `handleInteraction()` switch statement
- `src/explorers/scenes/GameScene.ts:313-321` — Overlay scene launching
- `src/explorers/scenes/GameScene.ts:236-242` — Exam dismissed handler
- `src/explorers/scenes/BootScene.ts:60-64` — Scene registration
- `src/explorers/entities/InteractiveObject.ts:11,17` — Object type union
- `src/explorers/events/GameEvents.ts:37-40` — Exam event constants
- `src/explorers/config/constants.ts:34-45` — DEPTH values
- `src/explorers/config/sceneRegistry.ts:1-11` — Scene key enum
- `src/explorers/levels/types.ts:17-49` — LevelManifest interface
- `src/explorers/levels/levelLoader.ts:9-22` — GameManifestLevel type
- `src/explorers/levels/levelLoader.ts:72-82` — Exam registration in loader
- `src/explorers/levels/m0-core-ai/manifest.ts` — Example manifest (no exams)
- `src/explorers/systems/ExamManager.ts:83-114` — XP granting pattern
- `src/explorers/systems/InputController.ts:30-32` — setEnabled() method
- `src/pages/api/game.ts:13-32` — API serialization

## Architecture Insights

1. **The overlay scene pattern is the backbone**: Sleep/wake + event-driven show/dismiss + input gating. The plan correctly replicates this.

2. **Renderer delegation is a good architectural choice**: Having ArcadeScene own the chrome and delegate gameplay to renderers keeps each game self-contained. This mirrors how ExamScene delegates to ExamManager.

3. **The type system is well-suited for extension**: Adding `'arcade'` to the InteractiveObject union, `arcadeGames` to LevelManifest, and new events to GameEvents all follow established patterns with minimal friction.

4. **No GameState schema changes needed**: XP is granted via existing `updateState()` + `XP_GAINED` event. No new fields in GameState. This keeps the change surface small.

5. **Phased implementation is correct**: Infrastructure first → one game → iterate. Each phase is independently testable.

## Open Questions

1. **Should arcade games grant flags?** The plan says no persistent tracking, but flags could be useful for gating content (e.g., "play all 3 games" achievement).

2. **Should arcade replays grant XP every time?** The plan allows unlimited replays with XP each time. This could be exploited for XP farming. Consider a cooldown or diminishing returns.

3. **What about mobile/touch input?** The plan is keyboard-only. If the game ever needs mobile support, the renderer interface would need touch input hooks.

4. **Viewport assumption of 800×600**: The plan hardcodes this for chrome layout. Is this guaranteed across all devices/browsers? The game config should be checked.
