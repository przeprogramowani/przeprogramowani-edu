---
date: 2026-02-19T16:00:00+01:00
researcher: Claude
git_commit: 1480219dbdbf1a45417fa3747897202e0b51b5a4
branch: master
repository: przeprogramowani-sites
topic: "Unified Level-Building Framework for 10x Explorers"
tags: [research, codebase, game, levels, framework, maps, events, dialogues, quests, zones]
status: complete
last_updated: 2026-02-19
last_updated_by: Claude
---

# Research: Unified Level-Building Framework for 10x Explorers

**Date**: 2026-02-19T16:00:00+01:00
**Researcher**: Claude
**Git Commit**: 1480219dbdbf1a45417fa3747897202e0b51b5a4
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

The game has an editor for maps, but events, flags, dialogs, maps, zones, quests, and other game elements are scattered across many directories and files. How can we create a simplified framework or module to build new levels from a single place — connecting maps, dialogue, quests, zones, and events together?

## Summary

The current architecture is well-structured but **fragmented across 7+ directories** with no single "level definition" concept. Creating a new level today requires touching **at minimum 6 different locations**: a Tiled JSON map, dialogue JSON files, quest JSON files, map registry, editor constants, and potentially dialogue manager imports and command handler logic. A unified level framework should introduce a **Level Manifest** pattern — a single declarative file per level that ties together all these pieces, with a runtime loader that wires everything up automatically.

## Detailed Findings

### 1. Current Architecture — Where Things Live

| Concern | Location | Format |
|---------|----------|--------|
| Map tiles & zones | `public/game/maps/{mapKey}.json` | Tiled JSON |
| Map display names | `src/explorers/config/mapRegistry.ts` | TypeScript object |
| Known event IDs | `src/explorers/editor/editorConstants.ts` | TypeScript arrays |
| Dialogue sequences | `src/explorers/data/dialogues/*.json` | JSON (named files) |
| Inline dialogues | `src/explorers/data/dialogues/ship-interactions.json` | JSON (keyed map) |
| Quest definitions | `src/explorers/data/quests/*.json` | JSON |
| Quest completion → dialogue mapping | `src/explorers/systems/QuestManager.ts` (hardcoded) | TypeScript const |
| Flag-based dialogue branching | `src/explorers/scenes/GameScene.ts` (hardcoded `if` blocks) | TypeScript logic |
| Terminal command behavior | `src/explorers/terminal/commandHandler.ts` | TypeScript |
| Asset manifest | `src/explorers/assets/AssetManifest.ts` | TypeScript |
| Game state type | `src/explorers/state/types.ts` | TypeScript interface |
| Tile indices | `src/explorers/config/tileIndices.ts` | TypeScript enum |

### 2. Pain Points (Why It's Disconnected)

**2.1 No level abstraction.** Maps are the only "level unit," but a level is really: map + dialogues + quests + flags + connections. There's no object that groups these.

**2.2 Hardcoded flag logic.** GameScene has specific `if (obj.objectId === 'holo-projector')` branches. Adding a new flag-gated interaction requires editing GameScene.ts:

```typescript
// GameScene.ts — hardcoded per-object branching
if (obj.objectId === 'holo-projector') {
  dialogueId = this.hasFlag('quest-1-complete')
    ? 'holo-projector-on'
    : 'holo-projector-off';
}
```

**2.3 Hardcoded quest-to-dialogue mapping.** QuestManager has a const:

```typescript
const QUEST_COMPLETION_DIALOGUES = {
  'demo-quest-1': 'quest-1-complete',
  'demo-quest-2': 'quest-2-complete',
};
```

**2.4 DialogueManager imports dialogue files statically.** Each new dialogue JSON requires a new import statement in DialogueManager.ts.

**2.5 Map registry is manual.** Adding a map requires updating `MAP_DISPLAY_NAMES` in mapRegistry.ts and `KNOWN_TARGET_MAPS` in editorConstants.ts separately.

**2.6 Dialogue effects are limited.** `DialogueEffect` supports only: `activateQuest`, `completeQuest`, `setFlag`, `setFlag2`, `triggerEvent`. No way to chain multiple flags or conditional effects.

### 3. Current Data Flow (Adding a New Level Today)

To add a new map "engine-room" with a quest and 2 interactive objects:

1. **Create map file** → `public/game/maps/engine-room.json` (via editor)
2. **Register map** → Add `'engine-room': 'Maszynownia'` to `mapRegistry.ts`
3. **Update editor** → Add to `KNOWN_TARGET_MAPS` in `editorConstants.ts`
4. **Create dialogues** → Add `engine-room-interactions.json` + quest dialogue JSONs to `data/dialogues/`
5. **Import dialogues** → Add imports in `DialogueManager.ts`, register them in constructor
6. **Create quest** → Add `quest-engine.json` to `data/quests/`
7. **Import quest** → Add import in `QuestManager.ts`
8. **Wire quest→dialogue** → Add to `QUEST_COMPLETION_DIALOGUES` const
9. **Wire flag logic** → Add `if` branches in `GameScene.handleInteraction()` for flag-dependent dialogues
10. **Connect door** → In source map, add door zone pointing to `engine-room` with spawn coordinates
11. **Add event IDs** → Update `KNOWN_EVENT_IDS` in editorConstants.ts

That's **11 steps across 8+ files**, most of which are boilerplate wiring.

### 4. Existing Dialogue Effect System

The `DialogueEffect` type supports:

```typescript
interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  setFlag?: string;
  setFlag2?: string;    // Hack for setting 2 flags
  triggerEvent?: string;
}
```

This is applied by `DialogueManager.applyEffects()` which emits events on the Phaser bus. The `setFlag2` field is a workaround for the single-flag limitation.

### 5. Zone System (Map-Level)

Zones in Tiled maps support these types:

| Type | Properties | Behavior |
|------|-----------|----------|
| `spawn` | `id` | Player entry point |
| `trigger` | `id`, `eventId`, `requiredFlag?` | Proximity interaction → dialogue |
| `door` | `id`, `targetMap`, `spawnX`, `spawnY` | Auto-transition on overlap |
| `terminal` | `id`, `eventId` | Terminal interaction |

Zone `requiredFlag` is already partially data-driven — the InteractionDetector checks it. But the **dialogue variant selection** (which dialogue to show based on flags) is hardcoded in GameScene.

### 6. Quest System

Quests are JSON-driven with this structure:

```typescript
{
  id: string;
  title: string;
  briefing: string;
  inputPayload: string;
  hints: string[];
  solution: string;
  validation: 'exact-lowercase' | 'exact-trim';
  rewards: { xp: number; flags: string[] };
}
```

Quests are loaded via static imports in QuestManager. The completion dialogue is wired via a hardcoded map.

### 7. State & Flags

`DemoGameState.flags` is a `string[]` checked via a cached `Set`. Flags are the primary progression mechanism — they gate:
- Dialogue variants (hardcoded in GameScene)
- Terminal commands (hardcoded in commandHandler)
- Zone interactions (via `requiredFlag` in Tiled data)
- Quest availability (via dialogue effects)

### 8. Editor Capabilities

The map editor already produces valid Tiled JSON with zones, but it has **no awareness of levels as a higher-order concept**. It edits a single map file at a time. The editor constants (`KNOWN_EVENT_IDS`, `KNOWN_TARGET_MAPS`) are manually maintained.

## Code References

- `src/explorers/config/mapRegistry.ts` — Map display names (manual registration)
- `src/explorers/editor/editorConstants.ts` — Known event IDs and target maps
- `src/explorers/systems/DialogueManager.ts` — Static dialogue imports, sequence registry
- `src/explorers/systems/DialogueTypes.ts` — DialogueLine, DialogueSequence, DialogueEffect
- `src/explorers/systems/QuestManager.ts` — Quest loading, QUEST_COMPLETION_DIALOGUES
- `src/explorers/scenes/GameScene.ts:339-363` — Hardcoded flag-based dialogue branching
- `src/explorers/terminal/commandHandler.ts` — Flag-dependent command behavior
- `src/explorers/state/types.ts` — DemoGameState interface
- `src/explorers/events/GameEvents.ts` — Event constants and payload types
- `src/explorers/data/dialogues/*.json` — All dialogue data files
- `src/explorers/data/quests/*.json` — Quest definition files
- `public/game/maps/*.json` — Tiled map files
- `src/explorers/entities/InteractiveObject.ts` — Zone wrapper with requiredFlag
- `src/explorers/scenes/BaseScene.ts` — Flag management (hasFlag, setFlag, updateState)

## Architecture Insights

### Current Strengths
1. **Event-driven architecture** — GameEvents bus decouples systems well
2. **Data-driven quests and dialogues** — JSON definitions are easy to author
3. **Zone properties in Tiled** — `requiredFlag`, `eventId`, `targetMap` are already declarative
4. **Cached flag lookups** — O(1) via Set, efficient for frequent checks
5. **Map editor** — Self-contained, produces valid Tiled JSON

### Current Weaknesses
1. **No level concept** — Map is the only grouping unit; everything else is scattered
2. **Static imports for content** — Dialogues and quests require code changes to add
3. **Hardcoded branching** — Flag→dialogue variant logic lives in GameScene
4. **Limited DialogueEffect** — Only 2 flags, single quest, single event per completion
5. **Manual registry sync** — mapRegistry, editorConstants, DialogueManager imports must stay in sync
6. **No validation** — No tooling to verify that a level's dialogues, quests, flags, and zones are consistent

### Proposed Architecture: Level Manifest Pattern

A unified **Level Manifest** per map that declares everything needed:

```
src/explorers/levels/
├── index.ts                          # Auto-discovers and registers all levels
├── types.ts                          # LevelManifest interface
├── levelLoader.ts                    # Runtime: loads manifest, registers content
├── ship-hibernation/
│   ├── manifest.ts                   # LevelManifest — the single source of truth
│   ├── map.json                      # Tiled map (symlink or moved from public/)
│   ├── dialogues.ts                  # All dialogues for this level
│   └── quests.ts                     # Quest definitions for this level (if any)
├── ship-corridor/
│   ├── manifest.ts
│   ├── map.json
│   └── dialogues.ts
├── ship-bridge/
│   ├── manifest.ts
│   ├── map.json
│   ├── dialogues.ts
│   └── quests.ts
└── engine-room/                      # New level — just add a directory!
    ├── manifest.ts
    ├── map.json
    ├── dialogues.ts
    └── quests.ts
```

**LevelManifest interface (draft):**

```typescript
interface LevelManifest {
  id: string;                          // Map key, e.g. 'ship-bridge'
  displayName: string;                 // Polish name for HUD

  // Map
  mapFile: string;                     // Path to Tiled JSON

  // Connections (informational — actual door zones live in map)
  connections: {
    doorId: string;
    targetLevel: string;
    spawnX: number;
    spawnY: number;
  }[];

  // Dialogues — all dialogue sequences for this level
  dialogues: Record<string, DialogueSequence>;

  // Dialogue routing — replaces hardcoded if/else in GameScene
  interactionRoutes: {
    zoneId: string;                    // Matches zone objectId in Tiled map
    defaultDialogue: string;           // Default dialogue ID
    flagVariants?: {
      flag: string;                    // If player has this flag...
      dialogue: string;               // ...use this dialogue instead
    }[];
  }[];

  // Quests (optional)
  quests?: QuestDefinition[];

  // Quest completion → dialogue mapping
  questCompletionDialogues?: Record<string, string>;

  // Intro sequence (optional — plays once on first visit)
  introDialogue?: string;
  introFlag?: string;                  // Flag to mark intro as seen
}
```

**Key benefits:**
- **Adding a new level = adding a directory** with a manifest + data files
- **No more editing GameScene.ts** for flag-based dialogue routing — the manifest declares it
- **No more manual registry sync** — levelLoader auto-discovers and registers everything
- **Editor integration** — editor can read/write manifests, validate event IDs against actual dialogues
- **Validation tooling** — a script can verify manifest consistency (all referenced dialogues exist, flags are used, doors connect to valid levels)

### Migration Strategy

1. **Phase 1:** Create `LevelManifest` type and `levelLoader` that reads manifests
2. **Phase 2:** Move existing dialogue/quest JSON into level directories, create manifests for 4 existing maps
3. **Phase 3:** Refactor GameScene to use manifest's `interactionRoutes` instead of hardcoded if/else
4. **Phase 4:** Refactor DialogueManager and QuestManager to load from manifests (remove static imports)
5. **Phase 5:** Update editor to be manifest-aware (validate event IDs, show level connections)
6. **Phase 6:** Add manifest validation script (`npm run validate:levels`)

### Alternative: Single-File Level Definition

Instead of a directory per level, each level could be a single `.ts` file exporting everything:

```typescript
// src/explorers/levels/ship-bridge.ts
export const level: LevelManifest = {
  id: 'ship-bridge',
  displayName: 'Mostek',
  mapFile: '/game/maps/ship-bridge.json',
  dialogues: { ... },
  interactionRoutes: [ ... ],
  quests: [ ... ],
  ...
};
```

**Tradeoff:** Simpler structure (one file vs directory), but large levels may become unwieldy. A hybrid approach (manifest.ts + separate dialogue/quest files for large levels) could work.

## Historical Context (from thoughts/)

- `thoughts/shared/plans/2026-02-19-explorers-map-editor.md` — Map editor implementation plan (5 phases, recently completed)
- `thoughts/shared/plans/2026-02-18-clean-phaser-architecture.md` — Foundational architecture plan (7 phases) that established the current scene/system/entity pattern
- `.ai/10x-devs/game/cookbook.md` — 30-section developer cookbook covering all game systems
- `.ai/10x-devs/game/demo-milestone-spec.md` — Demo milestone spec that defined the current 4-map structure
- `.ai/10x-devs/game/storyline.md` — Narrative framework defining future levels (Prework + 5 Modules)

## Open Questions

1. **Map file location:** Should maps stay in `public/game/maps/` (accessible at runtime via URL) or move into level directories? Phaser needs maps accessible via HTTP, so they'd need to stay in `public/` or be copied during build.

2. **Dialogue effect expansion:** Should `DialogueEffect` be extended to support arrays of flags, conditional effects, or chained effects? The current `setFlag`/`setFlag2` pattern is limiting.

3. **Level dependencies:** Should the manifest declare required flags from other levels (prerequisites)? This would enable validation of level ordering.

4. **Editor integration depth:** Should the editor become level-aware (edit manifest + map together), or stay as a pure map editor with a separate manifest editor?

5. **Dynamic loading vs static imports:** Should level manifests be dynamically imported (`import()`) for code-splitting, or statically imported for simplicity? The game currently has only 4 maps so static is fine, but 20+ maps may benefit from dynamic loading.

6. **Terminal command extensibility:** Should levels be able to declare custom terminal commands or command overrides? Currently commandHandler is a monolithic switch.
