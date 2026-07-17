---
date: 2026-03-25T14:43:41+01:00
researcher: Codex + Claude
git_commit: 2e565dab44be972e468a0e5e54a4f4698cf352ef
branch: master
repository: edu-platform
topic: "Space Explorers implicit string references audit"
tags: [research, codebase, explorers-game, typescript, validation, maps, manifests]
status: complete
last_updated: 2026-03-25
last_updated_by: Claude
last_updated_note: "Re-audited entire codebase to verify fixes and catalog remaining open issues"
---

# Research: Space Explorers implicit string references audit

**Date**: 2026-03-25T14:43:41+01:00
**Researcher**: Codex + Claude
**Git Commit**: `2e565dab44be972e468a0e5e54a4f4698cf352ef`
**Branch**: `master`
**Repository**: `edu-platform`

## Research Question

Audit the Space Explorers game codebase for implicit references, especially string-based links between maps, manifests, dialogues, quests, exams, arcade games, flags, and events. Identify where one side can drift without the other side noticing, and propose TypeScript-heavy fixes.

## Summary

The game architecture is now centered on level manifests, but the critical joins between systems are still mostly string contracts:

- map JSON zone properties (`examId`, `arcadeGameId`, `requiredFlags`, `targetMap`)
- manifest routing (`zoneId`, `defaultDialogue`, `flagVariants`)
- dialogue effects (`activateQuest`, `completeQuest`, `afterDialogue`, `setFlags`, `triggerEvent`)
- quest objectives (`event`, `matchPayload`)
- global loader registries (dialogues, quests, exams, arcade games)

Two concrete runtime breaks existed in `m0-exam-room`:

1. exam stations pointed to deleted/renamed exam IDs
2. the CORE AI door still required deleted/renamed exam-completion flags

The Codex session fixed both map issues, added a validation test, runtime duplicate checks, stronger flag/event typing, and a proper quest completion bridge. A follow-up re-audit confirmed those fixes and cataloged 15 remaining open issues (see section 9).

## Detailed Findings

### 1. Global registries flatten cross-level content and previously overwrote collisions silently

- `src/explorers/levels/levelLoader.ts:45`
- `src/explorers/levels/levelLoader.ts:86`
- `src/explorers/levels/levelLoader.ts:140`

`loadLevelsFromData()` merges all dialogues, quests, exams, arcade games, and completion maps into flat registries. Before this pass, `Map.set()` and `Object.assign()` meant later content silently replaced earlier content on duplicate IDs. This is the highest-risk implicit reference because every consumer trusts those registries as source of truth.

Implemented fix:

- added `registerUnique()` and `assignUniqueMappings()` in `src/explorers/levels/levelLoader.ts:45`
- duplicate IDs and duplicate completion-map keys now throw immediately during load

### 2. Map JSON to manifest exam references were already broken in production content

- `public/game/maps/m0-exam-room.json:499`
- `public/game/maps/m0-exam-room.json:522`
- `public/game/maps/m0-exam-room.json:545`
- `src/explorers/levels/m0-exam-room/exams.ts:4`
- `src/explorers/scenes/GameScene.ts:483`

The exam zones used old IDs:

- `m0-exam-llm-basics`
- `m0-exam-prompting`
- `m0-exam-tokenization`

The current registered exams are:

- `m0-exam-agent-systems`
- `m0-exam-operational-procedures`
- `m0-exam-context-engineering`

Because `GameScene` reads `examId` as a raw string and emits `EXAM_SHOW`, this kind of drift compiles and only fails at runtime when the exam scene cannot resolve the ID.

Implemented fix:

- aligned the three `examId` properties in `public/game/maps/m0-exam-room.json:499`
- validation now checks every map `examId` against that level’s authored exam definitions in `src/explorers/levels/contentValidation.ts:129`

### 3. Door required flags in the exam room were also stale

- `public/game/maps/m0-exam-room.json:621`
- `src/explorers/config/flags.ts:1`

The CORE AI door still depended on old completion flags:

- `m0-exam-llm-basics-done`
- `m0-exam-prompting-done`
- `m0-exam-tokenization-done`

The active flags are:

- `m0-exam-agent-systems-done`
- `m0-exam-operational-procedures-done`
- `m0-exam-context-engineering-done`

Implemented fix:

- updated `requiredFlags` in `public/game/maps/m0-exam-room.json:621`
- validation now checks door `requiredFlags` against known flags in `src/explorers/levels/contentValidation.ts:150`

### 4. Dialogue-driven quest completion looked valid but bypassed the quest system

- `src/explorers/systems/DialogueTypes.ts:13`
- `src/explorers/systems/DialogueManager.ts:95`
- `src/explorers/systems/QuestManager.ts:150`

`DialogueEffect.completeQuest` existed, but `DialogueManager` implemented it by emitting `QUEST_COMPLETED` directly. That skipped actual quest-state mutation, rewards, flags, and cleanup in `QuestManager`.

Implemented fix:

- introduced `QUEST_COMPLETE_REQUEST` in `src/explorers/events/GameEvents.ts:21`
- `DialogueManager` now emits the request at `src/explorers/systems/DialogueManager.ts:95`
- `QuestManager.completeQuestById()` was added at `src/explorers/systems/QuestManager.ts:150`
- `PhaserGame` now routes the request to the manager in `src/explorers/PhaserGame.svelte:237`

### 5. Flag and event contracts existed, but many surfaces widened them back to plain strings

- `src/explorers/config/flags.ts:1`
- `src/explorers/events/GameEvents.ts:1`
- `src/explorers/systems/DialogueTypes.ts:1`
- `src/explorers/systems/QuestManager.ts:1`
- `src/explorers/systems/ExamTypes.ts:1`
- `src/explorers/terminal/commandRegistry.ts:1`

The repo already had a central `FLAGS` object and a central `GameEvents` object, but many authored and runtime contracts accepted plain `string`. That made rename safety much weaker than it looked from the API surface.

Implemented fix:

- `GameFlag` now includes both static flags and `arcade:${map}:${zone}:${game}` template flags in `src/explorers/config/flags.ts:1`
- flag-bearing APIs now use `GameFlag` through dialogue effects, quests, exams, state, command registry, and flag manager
- `DialogueEffect.triggerEvent` and `EventObjective.event` now use `GameEventValue`
- `PhaserGame` now uses `FLAGS.TERMINAL_FOUND` instead of raw `'terminal-found'` at `src/explorers/PhaserGame.svelte:72`

### 6. Arcade station flags were dynamic and invisible to the static flag registry

- `src/explorers/state/arcadeFlags.ts:1`
- `src/explorers/levels/m0-crew-room/games.ts:5`

Arcade clear flags are derived from map key, zone ID, and arcade game ID. That was useful, but previously the type system treated them as generic `string`, so route flags and state flags lost information immediately.

Implemented fix:

- added `ArcadeStationFlag` template-literal typing in `src/explorers/config/flags.ts:18`
- `getArcadeStationClearFlag()` now returns the typed flag in `src/explorers/state/arcadeFlags.ts:1`
- arcade mission resolution now carries a typed station flag in `src/explorers/systems/arcadeMission.ts:1`

### 7. The editor/runtime zone contract still has stale fields that are not actually enforced

- `src/explorers/editor/ZonePropertiesPanel.svelte:48`
- `src/explorers/editor/MapEditor.svelte:75`
- `src/explorers/entities/InteractiveObject.ts:8`
- `src/explorers/scenes/GameScene.ts:176`

Two editor-facing fields are still misleading:

- `eventId` is authored and stored but not used by runtime routing
- trigger `requiredFlag` is authored and exposed, but the current interaction flow does not truly gate trigger interaction on it

These are still live architectural gaps. I did not remove or fully implement them in this pass because that would change authoring behavior, not just validation.

### 8. The new validator converts the implicit-reference graph into one testable graph

- `src/explorers/levels/contentValidation.ts:62`
- `src/explorers/levels/contentValidation.test.ts:1`

The validator now walks:

- all level manifests from `ALL_LEVELS`
- every authored dialogue, quest, exam, and arcade definition
- every map JSON zone in `public/game/maps`

It checks:

- duplicate dialogue/quest/exam/arcade IDs
- map `examId` and `arcadeGameId` references
- route `zoneId` existence
- route/dialogue/completion-dialogue references
- `introDialogue` / `introFlag` pairing
- unknown flags in dialogue effects, routes, quests, exams, and door requirements
- exam question/option uniqueness and `correctOptionIds`
- invalid `npcType`

This is the most effective immediate safeguard because many of these references cross the TypeScript/JSON boundary and cannot be caught by the compiler alone.

## Code References

- `public/game/maps/m0-exam-room.json:499` - fixed stale exam zone IDs
- `public/game/maps/m0-exam-room.json:621` - fixed stale door `requiredFlags`
- `src/explorers/levels/contentValidation.ts:62` - whole-repo explorers content validator
- `src/explorers/levels/contentValidation.test.ts:1` - validation test entrypoint
- `src/explorers/levels/levelLoader.ts:45` - runtime duplicate detection helpers
- `src/explorers/systems/DialogueManager.ts:95` - quest completion now requests `QuestManager`
- `src/explorers/systems/QuestManager.ts:150` - `completeQuestById()` bridge for dialogue-driven completion
- `src/explorers/events/GameEvents.ts:20` - added `QUEST_COMPLETE_REQUEST`
- `src/explorers/config/flags.ts:18` - typed arcade station flag template

## Architecture Insights

The implicit-reference problem is split into two different categories:

1. TypeScript-to-TypeScript links
   These can be improved with stronger types, template-literal IDs, branded IDs, and helper builders.

2. TypeScript-to-map-JSON links
   These need validation, because the other side is data loaded from Tiled JSON and is not part of the same compile-time graph.

That means the right direction is layered:

- stronger ID and flag types in TS APIs
- manifest/content builder helpers for authored modules
- a validation pass for map JSON and other externalized content

Trying to solve the whole problem with types alone would miss the map files. Trying to solve it only with runtime tests would miss many simple TS-level mistakes.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-02-19-game-level-framework.md`
  This predicted the same fragmentation problem before the manifest system existed. The current audit shows the manifest refactor helped, but string joins still remain at the map, event, and global-registry boundaries.

- `thoughts/shared/research/2026-03-05-game-automated-testing-strategy.md`
  This argued that the game is highly testable because logic already lives in plain TypeScript. The validator added in this pass is a direct application of that idea to authored content integrity.

## Related Research

- `thoughts/shared/research/2026-02-19-game-level-framework.md`
- `thoughts/shared/research/2026-03-04-npc-system-design.md`
- `thoughts/shared/research/2026-03-05-game-automated-testing-strategy.md`
- `thoughts/shared/research/2026-03-24-system-flags-milestone-gating.md`

## Open Questions

- Should `eventId` be removed from the editor/runtime contract, or should trigger/terminal interactions actually dispatch it?
- Should trigger `requiredFlag` be removed, or should the interaction detector and scene logic fully honor it?
- Should `targetMap` validation fail hard on unknown maps? Right now there is at least one planned/unresolved target (`m1-prework`) that looks intentional but is still an implicit unresolved reference.
- Would you rather keep a validation-first approach, or add a second phase with builder helpers like `defineDialogues()` / `defineLevelManifest()` to move more of this graph into compile time?

## 9. Re-Audit: Current State of All Issues (2026-03-25, second pass)

A full re-audit was conducted across 6 parallel research agents to verify the Codex-session fixes and identify remaining gaps.

### Verified Fixed

| # | Issue | What Changed |
|---|-------|-------------|
| 1 | Stale exam IDs in `m0-exam-room.json` | Map zones aligned to current exam IDs (`m0-exam-agent-systems`, etc.) |
| 2 | Stale door `requiredFlags` in `m0-exam-room.json` | Updated to current exam-completion flags |
| 3 | Silent duplicate ID overwrites in loader | `registerUnique()` / `assignUniqueMappings()` now throw on duplicates |
| 4 | `completeQuest` bypassed QuestManager | New `QUEST_COMPLETE_REQUEST` event + `completeQuestById()` bridge |
| 5 | `GameFlag` type too loose | Now covers static flags + arcade template literals; flag-bearing APIs typed |
| 6 | `ArcadeStationFlag` untyped | Template-literal typing in `flags.ts:18` |
| 7 | Raw `'terminal-found'` in `PhaserGame.svelte` | Now uses `FLAGS.TERMINAL_FOUND` at line 72 |
| 8 | `FLAGS.TERMINAL_UNLOCKED` reported dead | False alarm — actively used in `SmartTerminal.svelte:89,166` |
| 9 | Content validation test added | `contentValidation.ts` + `contentValidation.test.ts` validate cross-reference graph |
| 10 | `DialogueEffect.triggerEvent` / `EventObjective.event` untyped | Now use `GameEventValue` type |

### Still Open

#### HIGH severity

**H1. Raw `'terminal-found'` in GameHud.svelte**
- `src/explorers/GameHud.svelte:54` — `payload.state.flags.includes('terminal-found')`
- `src/explorers/GameHud.svelte:76` — `state.flags.includes('terminal-found')`
- Should use `FLAGS.TERMINAL_FOUND`

**H2. Raw `'exam:completed'` in quest objectives**
- `src/explorers/levels/m0-exam-room/quests.ts:19,26,33` — `event: 'exam:completed'`
- Should use `GameEvents.EXAM_COMPLETED`
- Note: the `EventObjective.event` field was typed to `GameEventValue`, so this may already be caught by the compiler. Needs verification that the raw string still compiles.

#### MEDIUM severity

**M1. Raw exam ID strings in quest `matchPayload`**
- `src/explorers/levels/m0-exam-room/quests.ts:20,27,34` — e.g. `matchPayload: { examId: 'm0-exam-agent-systems', passed: true }`
- No shared constant for exam IDs; must match definitions in `m0-exam-room/exams.ts`

**M2. `'demo-end-screen'` event not in GameEvents**
- `src/explorers/scenes/GameScene.ts:342,372` — `this.bus.on('demo-end-screen', ...)`
- Not declared in `GameEvents` object

**M3. Hardcoded dialogue IDs outside level files**
- `src/explorers/SmartTerminal.svelte:92` — `'first-contact'`
- `src/explorers/SmartTerminal.svelte:112` — `'m0-support-github-reaction'`
- `src/explorers/scenes/GameScene.ts:443` — `'terminal-first-use'`
- These bypass the level manifest system and would silently break if renamed in dialogues

**M4. `'demoGameState'` registry key defined locally in 4 separate files**
- `src/explorers/scenes/BaseScene.ts:7`
- `src/explorers/scenes/BootScene.ts:22`
- `src/explorers/QaOverlay.svelte:16`
- `src/explorers/state/flagManager.ts:8`
- Each defines its own local `const STATE_KEY = 'demoGameState'` — no shared constant

**M5. Hardcoded API URLs**
- `src/explorers/scenes/BootScene.ts:30` — `'/api/game'`
- `src/explorers/PhaserGame.svelte` — `'/api/game/state'` (6 refs), `'/api/game/pending'` (1 ref)
- `src/explorers/QaOverlay.svelte:82` — `'/api/game/state'`
- No centralized API endpoints file

#### LOW severity

**L1. Raw flag strings in test**
- `src/explorers/state/GameStateManager.test.ts:37,48` — `'keycode-found'`, `'terminal-unlocked'`

**L2. Zone property key strings**
- `targetMap`, `examId`, `arcadeGameId`, `npcType`, `speed`, `spawnX`, `spawnY`, `requiredFlags`, `eventId`, `id`, `type`
- Used as raw strings in `GameScene.ts` and mirrored in `ZonePropertiesPanel.svelte`
- No shared constants

**L3. NPC default `'scientist'` in 3 places**
- `src/explorers/scenes/GameScene.ts:203`
- `src/explorers/entities/NPC.ts:46`
- `src/explorers/editor/ZonePropertiesPanel.svelte:65`
- Should use a shared `DEFAULT_NPC_TYPE` constant

**L4. Layer name strings**
- `'Ground'`, `'Walls'`, `'Above'`, `'Zones'` hardcoded in `GameScene.ts:98,103,111,129`
- A `LayerName` type exists in `editor/types.ts:77` but is not used by runtime

**L5. Stale QA overlay `DEFAULT_SPAWNS`**
- `src/explorers/QaOverlay.svelte:57-62` — contains old map names (`m0-001-ship`, `ship-hibernation`, `ship-corridor`, `ship-bridge`) that no longer exist

**L6. Prompt labels hardcoded**
- `src/explorers/scenes/GameScene.ts:416-420` — inline if-statements map zone types to Polish labels

**L7. Boot-time cross-reference validation missing**
- `contentValidation.test.ts` catches issues at test time, but `levelLoader.ts` has no runtime validation at boot
- A `devMode`-only validation pass at boot could catch issues before they reach players

**L8. Editor `eventId` / trigger `requiredFlag` not consumed**
- Authored in editor but not wired in runtime interaction flow (see finding 7 above)

### Recommendations for Next Pass

1. **Quick wins (HIGH):** Fix H1 and H2 — simple constant replacements, 5 lines each
2. **Centralize registry keys (MEDIUM):** Create `src/explorers/config/registryKeys.ts` exporting a single `RegistryKeys` object, update 4 local definitions
3. **Centralize API URLs (MEDIUM):** Create `src/explorers/config/apiEndpoints.ts`, update ~10 references
4. **Add exam ID constants:** Export exam IDs from `m0-exam-room/exams.ts` and reference in `quests.ts`
5. **Add `DEMO_END_SCREEN` to GameEvents**
6. **Clean up stale QA overlay spawns** — remove or update `DEFAULT_SPAWNS`
7. **Consider boot-time validation** — run `contentValidation` in dev mode at boot, not just in tests

## Notes

- I could not generate GitHub permalinks because `gh repo view` failed in the current environment due restricted network access.
