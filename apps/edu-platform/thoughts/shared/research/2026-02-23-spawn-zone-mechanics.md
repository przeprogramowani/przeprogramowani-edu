---
date: 2026-02-23T12:00:00+01:00
researcher: Claude
git_commit: 355aa8d95a096f6d1a85877f0c47a4386ec38837
branch: master
repository: przeprogramowani-sites
topic: "How spawn zones work in 10x Explorers - relationship to doors, transitions, and initial player position"
tags: [research, codebase, 10x-explorers, spawn, zones, phaser, game]
status: complete
last_updated: 2026-02-23
last_updated_by: Claude
---

# Research: How Spawn Zones Work in 10x Explorers

**Date**: 2026-02-23
**Researcher**: Claude
**Git Commit**: 355aa8d9
**Branch**: master

## Research Question

How does the "spawn" zone work? Is it spawn after entering a door to this room, or what? How does it relate to the initial position of a new player?

## Summary

Spawn zones in the Tiled map editor are **visual markers only** — they mark where a player *should* appear but are **not read at runtime** to position the player. Instead, player positioning works through two separate mechanisms:

1. **Initial game start** — hardcoded default position `(2, 4)` tiles in `createDefaultState()`, on map `m0-awakening`
2. **Door transitions** — each door object carries `spawnX`/`spawnY` tile coordinates that tell the engine where to place the player on the *target* map

The spawn zone objects in Tiled maps are explicitly **skipped** during interactive object creation and debug rendering — they serve as a designer reference point, not a runtime data source.

## Detailed Findings

### 1. Spawn Zone Definition (Tiled Maps)

Spawn zones are rectangles in the `Zones` object layer of each Tiled map JSON:

```json
{
  "height": 32,
  "id": 1,
  "name": "Spawn",
  "properties": [
    { "name": "id", "type": "string", "value": "spawn" }
  ],
  "type": "spawn",
  "visible": true,
  "width": 32,
  "x": 64,
  "y": 160
}
```

In the map editor, spawn zones are colored **blue** (`#4488ff`), while doors/terminals are cyan and triggers are orange.

### 2. Spawn Zones Are Skipped at Runtime

In `GameScene.ts`, when zones are parsed, spawn zones are explicitly excluded from two things:

- **Debug overlay rendering** (line ~138): `if (zone.type === 'spawn') continue;`
- **InteractiveObject creation** (line ~160): `if (zone.type === 'spawn') continue;`

This means spawn zone objects exist in the map data but have **zero runtime behavior**. They are purely a visual reference for map designers.

### 3. Initial Player Position (New Game)

When no saved state exists, `GameStateManager.createDefaultState()` provides:

```typescript
currentMap: 'm0-awakening',
position: { x: 2 * 32, y: 4 * 32 },  // pixels: (64, 128)
```

`PreloaderScene` passes this to `GameScene.init()`:

```typescript
this.scene.start(SceneKey.GAME, {
  mapKey: state.currentMap,
  spawnX: state.position.x,  // pixel coordinates
  spawnY: state.position.y,
});
```

The player entity is then created at these coordinates, centered within the tile:

```typescript
this.player = new Astronaut(this, this.spawnX + TILE_SIZE / 2, this.spawnY + TILE_SIZE / 2, ...);
```

### 4. Door Transition Flow (Entering a Room)

When a player interacts with a door:

1. **Door properties read** (`GameScene.ts`):
   ```typescript
   const targetMap = door.properties['targetMap'] as string;
   const spawnX = door.properties['spawnX'] as number;  // tile units
   const spawnY = door.properties['spawnY'] as number;  // tile units
   ```

2. **Event emitted**: `TRANSITION_START` with `{ targetMap, spawnX, spawnY }`

3. **TransitionScene converts tile→pixel** and persists:
   ```typescript
   this.updateState((s) => ({
     currentMap: payload.targetMap,
     position: {
       x: payload.spawnX * TILE_SIZE,  // tile → pixel
       y: payload.spawnY * TILE_SIZE,
     },
   }));
   saveState(this.gameState);
   ```

4. **GameScene restarts** with pixel coordinates, player spawns at that position.

### 5. Coordinate System Summary

| Context | Unit | Example | Notes |
|---------|------|---------|-------|
| Tiled map spawn object | Pixels | `x: 64, y: 160` | Raw map coordinates |
| Door `spawnX`/`spawnY` properties | Tiles | `spawnX: 2, spawnY: 5` | Multiplied by 32 at transition time |
| Game state `position` | Pixels | `{ x: 64, y: 160 }` | Persisted to localStorage |
| `GameScene.init()` data | Pixels | `spawnX: 64` | Received from PreloaderScene or TransitionScene |
| Astronaut constructor | Pixels (centered) | `x: 80, y: 176` | +16px offset to center in tile |

### 6. Fallback Chain

1. Door properties → tile coords converted to pixels
2. `GameScene.init()` defaults → `spawnX ?? 0, spawnY ?? 0`
3. Saved game state → last persisted position
4. `createDefaultState()` → `(64, 128)` on `m0-awakening`

### 7. Map Editor Behavior

- New maps are created with an **empty** Zones layer — no default spawn zone
- Spawn zones must be manually added by the designer
- Spawn zones have minimal properties (just an auto-generated `id`)
- They exist as a visual cue to show "this is where the player appears"

## Code References

- `src/explorers/scenes/GameScene.ts:61-65` — `init()` receives spawn coordinates
- `src/explorers/scenes/GameScene.ts:109-132` — Zone parsing from Tiled data
- `src/explorers/scenes/GameScene.ts:138,160` — Spawn zones skipped
- `src/explorers/scenes/GameScene.ts:211` — Player creation with centering offset
- `src/explorers/scenes/GameScene.ts:398-409` — Door transition trigger
- `src/explorers/scenes/TransitionScene.ts:53-59` — Tile→pixel conversion and state save
- `src/explorers/scenes/TransitionScene.ts:69-73` — GameScene restart with spawn data
- `src/explorers/scenes/PreloaderScene.ts:82-86` — Initial game launch with saved position
- `src/explorers/state/GameStateManager.ts:5-25` — Default state with initial position
- `src/explorers/state/types.ts:8-9` — `position: { x, y }` in DemoGameState
- `src/explorers/editor/types.ts:20-30` — ZoneObject type definition
- `src/explorers/editor/ZonePropertiesPanel.svelte:38-58` — Spawn zone properties UI

## Architecture Insights

The spawn system follows a **dual-source pattern**:

1. **Designer intent** — Spawn zone objects in Tiled maps serve as visual documentation of where players should appear. They are blue rectangles that help designers align door `spawnX`/`spawnY` values correctly.

2. **Runtime truth** — Actual player positioning is driven entirely by door properties and game state. The spawn zone object coordinates are never read at runtime.

This means there is a potential **consistency gap**: a designer could place a spawn zone at tile (2, 5) but configure a door's `spawnX`/`spawnY` to point at tile (4, 8). The game would spawn the player at (4, 8), ignoring the visual spawn marker.

## Open Questions

1. **Should spawn zones be read at runtime?** — Currently they're visual-only. An alternative design would have the game look up the nearest spawn zone when entering a map, rather than relying on door properties.
2. **Multiple spawn zones per map?** — The current system doesn't distinguish between multiple spawn zones. If a map had two spawn zones (e.g., "spawn-from-north", "spawn-from-south"), doors could reference specific ones by ID — but this isn't implemented.
3. **Spawn zone vs default position alignment** — The hardcoded default `(2, 4)` tiles in `createDefaultState()` should match the spawn zone position in `m0-awakening.json`, but this is not enforced.
