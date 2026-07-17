---
date: 2026-03-10T12:00:00+01:00
researcher: Claude
git_commit: 2b17592022f3d18105d706da64627193ef7df290
branch: master
repository: przeprogramowani-sites
topic: "32x32 to 64x64 Sprite Migration — Benefits, Side Effects, and Impact Analysis"
tags: [research, codebase, sprites, tiles, phaser, pixel-art, visual-quality]
status: complete
last_updated: 2026-03-10
last_updated_by: Claude
last_updated_note: "Added TILE_SIZE single-source-of-truth refactoring section"
---

# Research: 32x32 to 64x64 Sprite Migration — Benefits, Side Effects, and Impact Analysis

**Date**: 2026-03-10T12:00:00+01:00
**Researcher**: Claude
**Git Commit**: 2b175920
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Currently we're using a 32x32px sprite system. Would it be beneficial and what kind of side-effects would it have to move to 64x64px to increase resolution and decrease pixeling (pixel-art but in low-quality — user feedback)?

## Summary

Moving from 32x32 to 64x64 tiles is **feasible and would meaningfully improve visual quality**, but it requires changes across **~20+ files** and touches nearly every layer of the game system. The migration is "all or nothing" — tiles, character sprites, maps, collision bodies, interaction zones, the map editor, and the asset generation script all need updating simultaneously. There are two viable strategies: (A) a true 64px migration, or (B) keeping 32px tiles but applying a 2x scale factor via Phaser's camera zoom. Strategy B is dramatically simpler.

## Detailed Findings

### 1. Current Sprite/Tile System Inventory

All tile and sprite sizes are centralized through constants but also hardcoded in many places:

**Central constants** (`src/explorers/config/constants.ts`):
- `TILE_SIZE = 32` — the master tile constant
- `PLAYER_FRAME_WIDTH = 32`, `PLAYER_FRAME_HEIGHT = 48` — astronaut frame size
- `INTERACTION_RADIUS = 48` (1.5 tiles)
- `CAMERA_DEADZONE_X = 64`, `CAMERA_DEADZONE_Y = 48`
- `PLAYER_SPEED = 120` px/s
- `NPC_SPEED = 60` px/s

**Sprite assets** (actual PNG dimensions):
- `astronaut.png`: 128×192 (4 cols × 4 rows of 32×48 frames)
- `npc-characters.png`: 384×192 (12 cols × 4 rows of 32×48 frames)
- `placeholder.png` (tileset): 256×128 (8 cols × 4 rows of 32×32 tiles)

**Tilemap JSON files** (all 4 maps):
- `m0-awakening.json`: 12×10 tiles, tilewidth/tileheight=32
- `m0-core-ai.json`: 12×10 tiles, tilewidth/tileheight=32
- `m0-crew-room.json`: 14×10 tiles, tilewidth/tileheight=32
- `m0-exam-room.json`: 14×10 tiles, tilewidth/tileheight=32

### 2. Files That Reference 32px Dimensions

| File | References | Nature |
|------|-----------|--------|
| `config/constants.ts:1,4,5` | `TILE_SIZE=32`, `PLAYER_FRAME_WIDTH=32`, `PLAYER_FRAME_HEIGHT=48` | Central constants |
| `assets/AssetManifest.ts:13` | `frameWidth:32, frameHeight:48` | Sprite loading config |
| `scenes/PreloaderScene.ts:49-54` | `frameWidth:32, frameHeight:48` (×2) | Sprite loading |
| `entities/Astronaut.ts:31-32` | `body.setSize(24,16)`, `body.setOffset(4,26)` | Collision body (relative to 32×48 frame) |
| `entities/NPC.ts:64-65` | `body.setSize(24,16)`, `body.setOffset(4,26)` | Same collision body |
| `editor/MapCanvas.svelte:6` | `TILE_SIZE=32` | Local constant |
| `editor/MapEditor.svelte:14` | `TILE_SIZE=32` | Local constant |
| `editor/tilesetLoader.ts:1` | `TILE_SIZE=32` | Local constant |
| `editor/mapFactory.ts:64-80` | `tileheight:32`, `tilewidth:32` (×4) | Map template generation |
| `editor/types.ts:54-70` | `tileheight:32`, `tilewidth:32` (×4) | Type literals |
| `editor/mapImporter.ts:111-127` | `tileheight:32`, `tilewidth:32` (×4) | Map import |
| `state/GameStateManager.ts:10` | `position: {x:2*32, y:4*32}` | Default spawn position |
| `scripts/generate-placeholder-assets.mjs:8` | `TILE=32` | Asset generation |
| All 4 map JSONs | `tilewidth:32, tileheight:32` | Tilemap data |

### 3. Phaser Configuration

`config/gameConfig.ts`:
- `scale.mode: Phaser.Scale.RESIZE` — canvas fills container
- `pixelArt: true` — nearest-neighbor scaling (critical for pixel art)
- `roundPixels: true` — prevents sub-pixel rendering

`scenes/GameScene.ts:279-297` — Camera zoom is **dynamically computed**:
```typescript
const zoomX = canvasWidth / Math.min(mapWidth, 1280);
const zoomY = canvasHeight / Math.min(mapHeight, 720);
const zoom = Math.max(1.0, Math.min(zoomX, zoomY));
```
This already scales up small maps. A 12×10 map at 32px = 384×320px, which gets zoomed ~2-2.25× to fill a typical viewport.

### 4. Character Sprite Specifics

Characters use **32×48** frames (not 32×32), giving a taller-than-tile-wide proportion. The collision body is only 24×16 at the feet area (`offset(4,26)` from top-left). This means:
- Sprites are visually 32px wide, 48px tall
- Only the bottom 16px are used for collision
- Moving to 64px tiles would need 64×96 character frames to maintain proportions

### 5. Map Editor Impact

The map editor (`src/explorers/editor/`) has its own hardcoded `TILE_SIZE=32` in 3 files plus type definitions with literal `32` values. The editor generates and imports Tiled-compatible JSON with 32px tile dimensions.

## Architecture Insights

### Strategy A: True 64px Migration

Replace all 32px values with 64px everywhere.

**Changes required:**
1. `TILE_SIZE = 64` in constants
2. `PLAYER_FRAME_WIDTH = 64`, `PLAYER_FRAME_HEIGHT = 96`
3. New astronaut spritesheet: 256×384 (64×96 frames)
4. New NPC spritesheet: 768×384 (64×96 frames)
5. New tileset: 512×256 (64×64 tiles)
6. All 4 tilemap JSONs: double `tilewidth`/`tileheight` — BUT map grid stays same size, so `width`/`height` (in tiles) stays the same. The world just gets 4× larger in pixel area.
7. Collision bodies: `setSize(48,32)`, `setOffset(8,52)` — scaled proportionally
8. `INTERACTION_RADIUS = 96` (scaled)
9. `CAMERA_DEADZONE_X = 128`, `CAMERA_DEADZONE_Y = 96`
10. `PLAYER_SPEED = 240`, `NPC_SPEED = 120` (doubled to maintain same perceived speed)
11. Default spawn in `GameStateManager.ts`: `{x:2*64, y:4*64}`
12. All map editor files: update constants, types, factories
13. Regenerate `generate-placeholder-assets.mjs` with `TILE=64`
14. Re-export all AI-generated sprite PNGs at 2× resolution
15. InteractionPrompt offset: `-36` → `-72` (or scale accordingly)

**Pros:**
- Actually higher resolution — more pixel detail per tile/character
- Looks genuinely better at all zoom levels
- Each tile can carry 4× more visual detail (4× pixel budget)
- AI sprite generation prompts already exist — just change size parameter

**Cons:**
- 4× memory for textures (astronaut: ~96KB→384KB, tileset: ~32KB→128KB)
- All AI-generated sprites (astronaut.png, npc-characters.png) need complete re-generation
- ~20+ files to modify
- Every tilemap JSON needs updating
- Map editor needs matching changes
- All zone positions in maps are in pixel coordinates — need recalculation if map pixel dimensions change
- Risk of regression across the entire game
- Movement speed, interaction ranges, and camera all need retuning

### Strategy B: Camera Zoom Approach (Recommended)

Keep all assets at 32px but reduce the camera zoom so sprites appear larger. The game already does dynamic zoom calculation.

**How it works:**
- Set `CAMERA_BASE_WIDTH = 400` (was 800) or similar
- Adjust the zoom formula to ensure minimum zoom is ~2×
- All existing assets, maps, collision, speeds etc. remain unchanged
- The `pixelArt: true` + `roundPixels: true` config means Phaser uses nearest-neighbor upscaling — sprites scale up cleanly without blur

**Pros:**
- ~1 file change (camera zoom logic)
- Zero risk to game mechanics, collision, movement, maps
- Zero asset regeneration needed
- Reversible in seconds
- Can be fine-tuned per-map or globally

**Cons:**
- Does NOT add more detail — same 32px sprites just rendered at 2×
- Characters and tiles look "bigger" but with same pixel detail
- "Blocky pixel-art" aesthetic intensifies at higher zoom — this may be the user's complaint
- Viewport shows less of the map (but maps are small anyway)

### Strategy C: Hybrid — 64px Assets with Phaser Scaling

Use higher-resolution assets (64px sprites/tiles) but have Phaser render them at the same logical tile size via scale factors.

**How it works:**
- Generate 64px tileset and 64×96 character sprites
- Load them at double resolution
- Use Phaser's tileset `tileWidth`/`tileHeight` to render at 32px logical size
- Character sprites load with 64×96 frame config but use `setScale(0.5)` on the sprite

**Pros:**
- Higher detail visible at all zoom levels
- Map data, collision, speeds, zones all remain 32px-based — no changes
- Gradual migration possible

**Cons:**
- Sprite rendering at 0.5× scale with `pixelArt: true` may introduce artifacts
- Tilemap rendering from high-res tileset at half-size is not well-supported in Phaser
- Unusual pattern — Phaser expects tileset tile size to match map tile size
- Complexity for unclear benefit vs Strategy A

## Recommendation

**If the complaint is "sprites look too small/pixely on screen":** Start with **Strategy B** (camera zoom). It's a 5-minute change, zero risk, and may fully address the feedback. The current zoom formula already scales up small maps — the issue may simply be that the zoom isn't aggressive enough.

**If the complaint is "not enough detail/resolution in the pixel art itself":** **Strategy A** is the right approach, but plan it as a focused sprint. The main work is:
1. Regenerate AI sprites at 64px (use the existing prompts in `.ai/10x-devs/game/sprites-chatgpt.md` with doubled dimensions)
2. Update the `generate-placeholder-assets.mjs` script (change `TILE=64` and scale all drawing coordinates)
3. Update constants + 4 map JSONs + editor files
4. Scale collision bodies and interaction radius proportionally

The work is mechanical and well-scoped — all the constants and references are documented above. Estimated ~20 files, mostly find-and-replace.

## Code References

- `src/explorers/config/constants.ts:1-16` — All tile/sprite/interaction size constants
- `src/explorers/config/gameConfig.ts:1-27` — Phaser game config with pixelArt settings
- `src/explorers/scenes/GameScene.ts:279-297` — Dynamic camera zoom calculation
- `src/explorers/scenes/PreloaderScene.ts:48-55` — Sprite loading with frame dimensions
- `src/explorers/entities/Astronaut.ts:29-32` — Player collision body (24×16 at offset 4,26)
- `src/explorers/entities/NPC.ts:62-66` — NPC collision body (identical to player)
- `src/explorers/assets/AssetManifest.ts:8-20` — Asset registry with frame configs
- `src/explorers/systems/InteractionDetector.ts:37` — Probe offset uses `TILE_SIZE * 0.6`
- `src/explorers/state/GameStateManager.ts:10` — Default spawn uses `2*32, 4*32`
- `src/explorers/editor/MapCanvas.svelte:6` — Editor TILE_SIZE constant
- `src/explorers/editor/mapFactory.ts:64-80` — Map template tile dimensions
- `scripts/generate-placeholder-assets.mjs:8` — Asset generator TILE constant
- `public/game/maps/m0-awakening.json` — Sample tilemap (tilewidth=32)
- `.ai/10x-devs/game/sprites-chatgpt.md` — AI sprite generation prompts (currently 32px)
- `.ai/10x-devs/game/sprites-theme.md` — Full sprite theme specification

## Refactoring TILE_SIZE into a Single Source of Truth

### Problem: 6 Independent Definitions of TILE_SIZE

The value `32` is defined independently in **6 separate locations** across the game and editor code, plus hardcoded as literal `32` in type definitions and factory functions. This means a tile size change requires touching every location manually — a guaranteed source of bugs.

| # | Location | Current Form | Used By |
|---|----------|-------------|---------|
| 1 | `src/explorers/config/constants.ts:1` | `export const TILE_SIZE = 32` | Game runtime (GameScene, TransitionScene, InteractionDetector) |
| 2 | `src/explorers/editor/MapCanvas.svelte:6` | `const TILE_SIZE = 32` | Canvas rendering, tile picking, grid drawing |
| 3 | `src/explorers/editor/MapEditor.svelte:14` | `const TILE_SIZE = 32` | Zone creation with tile-snapped coordinates |
| 4 | `src/explorers/editor/tilesetLoader.ts:1` | `const TILE_SIZE = 32` | Slicing tileset image into tile images |
| 5 | `src/explorers/editor/types.ts:54,66-67,70` | Literal `32` in type definitions | TypeScript type checking for Tiled JSON |
| 6 | `scripts/generate-placeholder-assets.mjs:8` | `const TILE = 32` | Programmatic tileset/sprite generation |

Additionally, **derived constants** in `config/constants.ts` are hardcoded rather than computed from `TILE_SIZE`:
- `PLAYER_FRAME_WIDTH = 32` (equals `TILE_SIZE`)
- `PLAYER_FRAME_HEIGHT = 48` (equals `TILE_SIZE * 1.5`)
- `CAMERA_DEADZONE_X = 64` (equals `TILE_SIZE * 2`)
- `CAMERA_DEADZONE_Y = 48` (equals `TILE_SIZE * 1.5`)
- `INTERACTION_RADIUS = 48` (equals `TILE_SIZE * 1.5`)

And **literal 32 values** scattered in:
- `src/explorers/editor/mapFactory.ts:64,76-77,80` — map template `tilewidth`/`tileheight`
- `src/explorers/editor/mapImporter.ts:111,123-124,127` — import fallback `tilewidth`/`tileheight`
- `src/explorers/state/GameStateManager.ts:10` — default spawn `{ x: 2 * 32, y: 4 * 32 }`
- `src/explorers/assets/AssetManifest.ts:13` — `frameConfig: { frameWidth: 32, frameHeight: 48 }`
- `src/explorers/scenes/PreloaderScene.ts:49-54` — duplicate frame config in loader
- `src/explorers/entities/Astronaut.ts:31-32` — `body.setSize(24, 16)` / `body.setOffset(4, 26)`
- `src/explorers/entities/NPC.ts:64-65` — identical collision body values

### Proposed Refactoring

#### Step 1: Expand `config/constants.ts` as the Single Source

Make all size-related constants derive from `TILE_SIZE`:

```typescript
// ─── Core tile dimension (change this ONE value to resize everything) ───
export const TILE_SIZE = 32;

// ─── Character frame dimensions (derived) ───
export const PLAYER_FRAME_WIDTH = TILE_SIZE;              // was: 32
export const PLAYER_FRAME_HEIGHT = TILE_SIZE * 1.5;       // was: 48

// ─── Collision body (derived — proportional to frame) ───
export const PLAYER_BODY_WIDTH = TILE_SIZE * 0.75;        // was: 24
export const PLAYER_BODY_HEIGHT = TILE_SIZE * 0.5;        // was: 16
export const PLAYER_BODY_OFFSET_X = (PLAYER_FRAME_WIDTH - PLAYER_BODY_WIDTH) / 2;  // was: 4
export const PLAYER_BODY_OFFSET_Y = PLAYER_FRAME_HEIGHT - PLAYER_BODY_HEIGHT - 6;  // was: 26

// ─── Camera (derived) ───
export const CAMERA_DEADZONE_X = TILE_SIZE * 2;           // was: 64
export const CAMERA_DEADZONE_Y = TILE_SIZE * 1.5;         // was: 48

// ─── Interaction (derived) ───
export const INTERACTION_RADIUS = TILE_SIZE * 1.5;        // was: 48
```

#### Step 2: Replace Editor Local Constants with Import

In `MapCanvas.svelte`, `MapEditor.svelte`, and `tilesetLoader.ts`, replace the local `const TILE_SIZE = 32` with:

```typescript
import { TILE_SIZE } from '../config/constants';
```

This is straightforward — the editor modules are already TypeScript and can import from the game config. The only caveat is path depth — editor files are at `src/explorers/editor/` so the import path would be `../config/constants`.

#### Step 3: Fix Hardcoded Literals in Factory/Importer

In `mapFactory.ts` and `mapImporter.ts`, replace literal `32` with `TILE_SIZE`:

```typescript
import { TILE_SIZE } from '../config/constants';

// In createBlankMap():
tileheight: TILE_SIZE,
tilewidth: TILE_SIZE,
// ...in tilesets:
tileheight: TILE_SIZE,
tilewidth: TILE_SIZE,
```

#### Step 4: Fix Type Definitions

`editor/types.ts` uses literal `32` in the TypeScript interface. This is the trickiest part because TypeScript literal types lock the value at the type level. Two options:

**Option A — Relax the type (recommended):**
```typescript
export interface TiledMap {
  tileheight: number;   // was: 32
  tilewidth: number;    // was: 32
  tilesets: [{
    tileheight: number; // was: 32
    tilewidth: number;  // was: 32
    // ...
  }];
}
```
This loses compile-time enforcement of the exact value but gains flexibility. Runtime validation in `mapImporter.ts` can still assert correctness.

**Option B — Branded type (complex, probably overkill):**
```typescript
type TileSize = typeof TILE_SIZE;  // inferred as 32
export interface TiledMap {
  tileheight: TileSize;
  // ...
}
```
This works only if `TILE_SIZE` is declared `as const` and the type is re-exported. Breaks if the value changes at runtime.

**Recommendation:** Option A. The literal type constraint adds no real safety — if tile size changes, the types must change too.

#### Step 5: Fix Remaining Literals

| File | Line | Current | Replace With |
|------|------|---------|-------------|
| `GameStateManager.ts` | 10 | `{ x: 2 * 32, y: 4 * 32 }` | `{ x: 2 * TILE_SIZE, y: 4 * TILE_SIZE }` |
| `AssetManifest.ts` | 13 | `{ frameWidth: 32, frameHeight: 48 }` | `{ frameWidth: PLAYER_FRAME_WIDTH, frameHeight: PLAYER_FRAME_HEIGHT }` |
| `PreloaderScene.ts` | 49-54 | `frameWidth: 32, frameHeight: 48` (×2) | Import from constants (or remove duplication — use `GLOBAL_ASSETS` instead of re-declaring) |
| `Astronaut.ts` | 31-32 | `body.setSize(24, 16)` / `body.setOffset(4, 26)` | Use `PLAYER_BODY_*` constants |
| `NPC.ts` | 64-65 | `body.setSize(24, 16)` / `body.setOffset(4, 26)` | Use `PLAYER_BODY_*` constants |

#### Step 6: Asset Generator Script

`scripts/generate-placeholder-assets.mjs` is a standalone Node script that can't easily import TypeScript constants. Two options:

**Option A — Read from a shared JSON config:**
Create `src/explorers/config/tile-config.json`:
```json
{ "TILE_SIZE": 32 }
```
Both the TS constants and the MJS script import from this file.

**Option B — Accept the duplication (pragmatic):**
Keep `const TILE = 32` in the script with a comment:
```javascript
// IMPORTANT: Must match TILE_SIZE in src/explorers/config/constants.ts
const TILE = 32;
```
This is acceptable since the script runs manually and infrequently.

**Recommendation:** Option B for now. The script is a dev tool, not runtime code.

### Summary of Changes

| Priority | File | Change |
|----------|------|--------|
| **High** | `config/constants.ts` | Add derived constants (body, frame, deadzone) |
| **High** | `Astronaut.ts`, `NPC.ts` | Use `PLAYER_BODY_*` constants |
| **High** | `GameStateManager.ts` | Use `TILE_SIZE` in default spawn |
| **Medium** | `editor/MapCanvas.svelte` | Import `TILE_SIZE` instead of local const |
| **Medium** | `editor/MapEditor.svelte` | Import `TILE_SIZE` instead of local const |
| **Medium** | `editor/tilesetLoader.ts` | Import `TILE_SIZE` instead of local const |
| **Medium** | `editor/mapFactory.ts` | Import and use `TILE_SIZE` |
| **Medium** | `editor/mapImporter.ts` | Import and use `TILE_SIZE` |
| **Medium** | `editor/types.ts` | Relax literal `32` to `number` |
| **Low** | `AssetManifest.ts` | Use `PLAYER_FRAME_*` constants |
| **Low** | `PreloaderScene.ts` | Use constants or deduplicate with AssetManifest |
| **Low** | `generate-placeholder-assets.mjs` | Add comment linking to constants.ts |

**Total files: 12** | **Risk: Low** — purely mechanical, no behavioral change | **Prerequisite for:** any future TILE_SIZE migration (32→64 or other)

## Open Questions

1. **What exactly is the user feedback?** Is it "sprites are too small on screen" (→ zoom fix) or "sprites lack detail" (→ 64px assets)?
2. **Are AI-generated sprites the bottleneck?** Current astronaut/NPC PNGs were generated externally — regenerating at 64px requires new AI generations and manual verification.
3. **Would 48×48 be a better intermediate step?** It gives 2.25× more pixels per tile without the full 4× jump to 64px.
4. **Map sizes at 64px** — a 12×10 map becomes 768×640px world space. The camera zoom formula handles this, but maps may feel more cramped visually (less tiles visible at once).
5. **Performance on mobile/low-end devices** — 4× texture memory increase shouldn't matter for these small assets, but worth confirming if mobile is a target.
