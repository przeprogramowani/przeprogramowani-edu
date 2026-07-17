# 32x32 to 64x64 Sprite Migration — Implementation Plan

## Overview

Migrate the 10x Explorers game from 32px to 64px tile/sprite dimensions to increase visual detail and resolution quality. The migration is split into two phases: first consolidate all tile-size references into a single source of truth, then change the value and update all dependent code.

## Current State Analysis

All tile/sprite sizes are scattered across **12+ files** with 6 independent `TILE_SIZE` definitions and numerous hardcoded `32`/`48` literals. Derived constants (collision body, interaction radius, camera deadzone) are independently hardcoded rather than computed from `TILE_SIZE`.

### Key Discoveries:

- `TILE_SIZE = 32` defined independently in: `constants.ts`, `MapCanvas.svelte`, `MapEditor.svelte`, `tilesetLoader.ts`, `mapFactory.ts`, `mapImporter.ts`, `types.ts`, `generate-placeholder-assets.mjs` — `src/explorers/config/constants.ts:1`
- Character frames are 32x48 (1:1.5 ratio with tile size) — `src/explorers/entities/Astronaut.ts:31-32`
- Collision bodies are 24x16 at offset (4, 26) — proportional to frame — `src/explorers/entities/NPC.ts:64-65`
- Camera zoom is dynamically computed, already scales small maps 2-2.25x — `src/explorers/scenes/GameScene.ts:279-297`
- 4 tilemap JSONs use `tilewidth: 32, tileheight: 32` — `public/game/maps/m0-awakening.json`
- `pixelArt: true` + `roundPixels: true` in Phaser config ensures clean nearest-neighbor scaling — `src/explorers/config/gameConfig.ts`

## Desired End State

After migration:
- `TILE_SIZE = 64` is the single source of truth in `config/constants.ts`
- All derived constants (frame dimensions, collision body, interaction radius, camera deadzone, speeds) are computed from `TILE_SIZE`
- All editor files import from `config/constants.ts` instead of defining local constants
- Type definitions use `number` instead of literal `32`
- All 4 map JSONs use `tilewidth: 64, tileheight: 64`
- Movement speeds doubled to maintain same perceived velocity
- Game looks and plays identically, just with 4x more pixel budget per tile/sprite

### Verification:
- `npm run build` succeeds
- `npm run test` passes
- Game loads all 4 maps without errors
- Player movement speed feels identical to before
- Collision detection works correctly (player can't walk through walls)
- NPC wandering works correctly
- Interaction prompts appear at correct positions
- Map editor can open, edit, and export maps
- Zone positions in maps are correctly scaled

## What We're NOT Doing

- NOT regenerating AI sprite assets (astronaut.png, npc-characters.png, tileset) — handled separately
- NOT changing map grid dimensions (12x10 stays 12x10 tiles)
- NOT modifying Phaser config (pixelArt, roundPixels, scale mode)
- NOT changing game mechanics or interaction logic
- NOT touching the asset generation script beyond adding a comment (it's a standalone dev tool)

## Implementation Approach

Two-phase approach:
1. **Phase 1 (Refactor):** Consolidate all TILE_SIZE references into a single source of truth with derived constants. Zero behavioral change.
2. **Phase 2 (Migrate):** Change `TILE_SIZE = 32` to `TILE_SIZE = 64`, update map JSONs, and adjust camera zoom formula reference values.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This is a static configuration change. No async operations, no lifecycle concerns.

### User Experience Specification

- **Visual Behavior**: Game should look identical at default zoom. The 64px assets (once provided separately) will have 4x pixel detail.
- **Movement Speed**: Must feel identical — doubled pixel speeds compensate for doubled world size.
- **Map Viewport**: Camera zoom formula references (`1280`, `720`) may need adjustment since world pixel dimensions double. A 12x10 map goes from 384x320 to 768x640 — the zoom formula already handles this but the resulting zoom factor will be different.

### Performance & Optimization Strategy

**N/A for code changes**: Texture memory increase (4x) is negligible for these small assets (~32KB → ~128KB for tileset). No runtime performance impact.

### State Management Sequencing

- **Saved game positions**: Existing save data in localStorage stores positions in pixel coordinates (e.g., `{x: 64, y: 128}`). After migration, these positions will be wrong (half the intended location). The plan must handle save data migration or reset.

### Debug & Observability Plan

- **Verification**: Load each of the 4 maps, verify player spawns correctly, can walk around, interact with objects, and transition between maps
- **Logging**: Existing Phaser debug mode shows collision bodies — use this to verify body sizing
- **Quick check**: In browser console, verify `game.scene.scenes[0].cameras.main.zoom` returns a reasonable value

---

## Phase 1: TILE_SIZE Single Source of Truth Refactoring

### Overview

Consolidate all independent tile-size definitions and hardcoded literals into derived constants in `config/constants.ts`. After this phase, changing `TILE_SIZE` in one place propagates everywhere. **Zero behavioral change.**

### Changes Required:

#### 1. Expand `config/constants.ts` with derived constants

**File**: `src/explorers/config/constants.ts`
**Changes**: Add derived constants for frame dimensions, collision body, and make existing constants derive from TILE_SIZE.

```typescript
// ─── Core tile dimension (change this ONE value to resize everything) ───
export const TILE_SIZE = 32;

// ─── Character frame dimensions (derived from tile size) ───
export const PLAYER_FRAME_WIDTH = TILE_SIZE;           // 32
export const PLAYER_FRAME_HEIGHT = TILE_SIZE * 1.5;    // 48

// ─── Collision body (proportional to frame) ───
export const PLAYER_BODY_WIDTH = TILE_SIZE * 0.75;     // 24
export const PLAYER_BODY_HEIGHT = TILE_SIZE * 0.5;     // 16
export const PLAYER_BODY_OFFSET_X = Math.round((PLAYER_FRAME_WIDTH - PLAYER_BODY_WIDTH) / 2); // 4
export const PLAYER_BODY_OFFSET_Y = Math.round(PLAYER_FRAME_HEIGHT - PLAYER_BODY_HEIGHT - TILE_SIZE * 0.1875); // feet gap scales with tile size

// ─── Movement speeds (pixels per second — scale with tile size for consistent feel) ───
export const PLAYER_SPEED = TILE_SIZE * 3.75;
export const NPC_SPEED = TILE_SIZE * 1.875;

// ─── Camera ───
export const CAMERA_DEADZONE_X = TILE_SIZE * 2;
export const CAMERA_DEADZONE_Y = TILE_SIZE * 1.5;

// ─── Interaction ───
export const INTERACTION_RADIUS = TILE_SIZE * 1.5;
```

Note: `PLAYER_SPEED` and `NPC_SPEED` are already exported from this file. Replace their hardcoded values with derived expressions. `CAMERA_DEADZONE_X`, `CAMERA_DEADZONE_Y`, and `INTERACTION_RADIUS` are also already exported — update their definitions in place.

#### 2. Replace editor local constants with imports

**File**: `src/explorers/editor/MapCanvas.svelte`
**Changes**: Remove `const TILE_SIZE = 32;` (line 6), add import from constants.

```typescript
import { TILE_SIZE } from '../config/constants';
```

**File**: `src/explorers/editor/MapEditor.svelte`
**Changes**: Remove `const TILE_SIZE = 32;` (line 14), add import from constants.

```typescript
import { TILE_SIZE } from '../config/constants';
```

**File**: `src/explorers/editor/tilesetLoader.ts`
**Changes**: Remove `const TILE_SIZE = 32;` (line 1), add import from constants.

```typescript
import { TILE_SIZE } from '../config/constants';
```

#### 3. Fix hardcoded literals in mapFactory and mapImporter

**File**: `src/explorers/editor/mapFactory.ts`
**Changes**: Import `TILE_SIZE` and replace all literal `32` values for tilewidth/tileheight.

```typescript
import { TILE_SIZE } from '../config/constants';

// Replace all occurrences:
// tileheight: 32  →  tileheight: TILE_SIZE
// tilewidth: 32   →  tilewidth: TILE_SIZE
```

**File**: `src/explorers/editor/mapImporter.ts`
**Changes**: Same pattern — import and replace literal `32` values.

```typescript
import { TILE_SIZE } from '../config/constants';

// Replace all occurrences:
// tileheight: 32  →  tileheight: TILE_SIZE
// tilewidth: 32   →  tilewidth: TILE_SIZE
```

#### 4. Relax type definitions

**File**: `src/explorers/editor/types.ts`
**Changes**: Change literal `32` types to `number` in TiledMap interface.

```typescript
// Lines 54, 66, 67, 70: Change from:
tileheight: 32;
tilewidth: 32;
// To:
tileheight: number;
tilewidth: number;
```

#### 5. Fix remaining hardcoded literals

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Import `TILE_SIZE`, replace `2 * 32` with `2 * TILE_SIZE` and `4 * 32` with `4 * TILE_SIZE` in default spawn position.

**File**: `src/explorers/assets/AssetManifest.ts`
**Changes**: Import `PLAYER_FRAME_WIDTH` and `PLAYER_FRAME_HEIGHT`, replace hardcoded `{ frameWidth: 32, frameHeight: 48 }`.

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: Import frame constants and use them instead of hardcoded `32`/`48` in spritesheet loading (lines 49-54).

**File**: `src/explorers/entities/Astronaut.ts`
**Changes**: Import `PLAYER_BODY_WIDTH`, `PLAYER_BODY_HEIGHT`, `PLAYER_BODY_OFFSET_X`, `PLAYER_BODY_OFFSET_Y`. Replace:
```typescript
body.setSize(24, 16);       → body.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT);
body.setOffset(4, 26);      → body.setOffset(PLAYER_BODY_OFFSET_X, PLAYER_BODY_OFFSET_Y);
```

**File**: `src/explorers/entities/NPC.ts`
**Changes**: Same as Astronaut — import and use body constants.

**File**: `scripts/generate-placeholder-assets.mjs`
**Changes**: Add comment only (standalone Node script, can't import TS):
```javascript
// IMPORTANT: Must match TILE_SIZE in src/explorers/config/constants.ts
const TILE = 32;
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` succeeds without errors
- [x] `npm run test` passes all tests
- [x] TypeScript type checking passes (no type errors from relaxed types)
- [x] ESLint passes

#### Manual Verification:

- [ ] Game loads and plays identically on all 4 maps
- [ ] Player movement, collision, and interaction work correctly
- [ ] Map editor opens, renders tiles correctly, and can export valid JSON
- [ ] No visual differences from before the refactor

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Change TILE_SIZE from 32 to 64

### Overview

With all references consolidated, change the single `TILE_SIZE` constant to 64. Update map JSONs (which are data files, not code) and adjust camera reference dimensions.

### Changes Required:

#### 1. Change TILE_SIZE

**File**: `src/explorers/config/constants.ts`
**Changes**: Single line change.

```typescript
export const TILE_SIZE = 64;  // was: 32
```

All derived constants automatically update:
- `PLAYER_FRAME_WIDTH` = 64 (was 32)
- `PLAYER_FRAME_HEIGHT` = 96 (was 48)
- `PLAYER_BODY_WIDTH` = 48 (was 24)
- `PLAYER_BODY_HEIGHT` = 32 (was 16)
- `PLAYER_BODY_OFFSET_X` = 8 (was 4)
- `PLAYER_BODY_OFFSET_Y` = 52 (was 26) — `Math.round(96 - 32 - 6) = 58`... wait, let me recalculate: `96 - 32 - 6 = 58`. At 32px this was `48 - 16 - 6 = 26`. The `-6` constant doesn't scale. We need: `PLAYER_FRAME_HEIGHT - PLAYER_BODY_HEIGHT - (6/32 * TILE_SIZE)` = `96 - 32 - 12 = 52`. So the offset formula should be:

```typescript
export const PLAYER_BODY_OFFSET_Y = Math.round(PLAYER_FRAME_HEIGHT - PLAYER_BODY_HEIGHT - TILE_SIZE * 0.1875);
// At 64px: 96 - 32 - 12 = 52
```

#### 2. Update map JSON files

**Files**: All 4 map files in `public/game/maps/`:
- `m0-awakening.json`
- `m0-core-ai.json`
- `m0-crew-room.json`
- `m0-exam-room.json`

**Changes per file**:
- `tileheight: 32` → `tileheight: 64`
- `tilewidth: 32` → `tilewidth: 64`
- Same for nested tileset `tileheight`/`tilewidth`
- **Grid dimensions stay the same** (width/height in tiles unchanged)
- **Zone positions must be doubled**: All zone objects have `x`, `y`, `width`, `height` in pixel coordinates. These must be multiplied by 2.

Example for a zone object:
```json
// Before:
{ "x": 64, "y": 128, "width": 32, "height": 32 }
// After:
{ "x": 128, "y": 256, "width": 64, "height": 64 }
```

#### 3. Adjust camera zoom reference dimensions

**File**: `src/explorers/scenes/GameScene.ts` (around line 282-284)
**Changes**: The current zoom formula constrains maps to 1280x720 max. With 64px tiles, a 12x10 map = 768x640px (was 384x320). The zoom formula:

```typescript
const zoomX = canvasWidth / Math.min(mapWidth, 1280);
const zoomY = canvasHeight / Math.min(mapHeight, 720);
```

This should still work correctly — the maps are still smaller than 1280x720, so they'll be zoomed up to fill the viewport. However, the zoom factor will be roughly half what it was (since maps are 2x larger in pixel dimensions). This may actually be desired — the assets have more detail now and don't need as much zoom.

**Action**: No change needed to the formula itself, but verify the resulting zoom levels are appropriate during manual testing. If maps appear too small, reduce the reference dimensions:

```typescript
// Only if zoom needs adjustment after testing:
const zoomX = canvasWidth / Math.min(mapWidth, 960);  // was 1280
const zoomY = canvasHeight / Math.min(mapHeight, 540); // was 720
```

#### 4. Update InteractionPrompt offset (if it exists as hardcoded)

**File**: `src/explorers/systems/InteractionDetector.ts`
**Changes**: Already uses `TILE_SIZE * 0.6` — no change needed. ✓

#### 5. Handle saved game state

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Increment save version or add migration logic. Existing saves have positions in 32px coordinates that will be invalid at 64px.

Option A (simple — recommended): Bump `SAVE_KEY` to `"space-explorers-state-v2"` so old saves are ignored and players start fresh.

Option B (migration): On load, detect old version and multiply all position values by 2.

#### 6. Update placeholder asset generator

**File**: `scripts/generate-placeholder-assets.mjs`
**Changes**: Update `const TILE = 64` and scale all drawing coordinates. Also update astronaut dimensions: `const W = 64; const H = 96;`

This allows regenerating placeholder assets at 64px for development/testing before final AI sprites are ready.

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` succeeds without errors
- [x] `npm run test` passes all tests
- [x] TypeScript type checking passes

#### Manual Verification:

- [ ] Game loads on all 4 maps without errors
- [ ] Player spawns at correct position on each map
- [ ] Player movement speed feels identical to pre-migration
- [ ] Player collision with walls works correctly (can't walk through)
- [ ] NPC wandering stays within map bounds
- [ ] Interaction prompts appear at correct positions near objects/NPCs
- [ ] Map transitions (doors) work and spawn player correctly on target map
- [ ] Camera zoom provides appropriate viewport (not too zoomed in/out)
- [ ] Map editor loads, displays tiles correctly, exports valid 64px JSON
- [ ] No visual glitches or misaligned sprites

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

---

## Testing Strategy

### Unit Tests:

- Verify derived constants compute correctly at 64px
- Existing game tests should pass without modification (they test logic, not pixel values)

### Integration Tests:

- Map loading: verify all 4 maps parse correctly with new tile dimensions
- Zone detection: verify interaction zones are at correct positions

### Manual Testing Steps:

1. Load game → verify m0-awakening loads without console errors
2. Walk around → verify speed feels the same as before
3. Walk into walls → verify collision works
4. Approach NPC → verify interaction prompt appears
5. Use door → verify map transition works and spawn is correct
6. Check all 4 maps have correct layout
7. Open map editor → verify tile rendering
8. Export a map from editor → verify JSON has 64px tile dimensions

## Performance Considerations

- Texture memory increases ~4x but total is still <1MB — negligible
- No runtime performance impact (same number of tiles, same game logic)
- Camera zoom calculation unchanged — no rendering overhead

## Migration Notes

- **Save data**: Bump `SAVE_KEY` version to invalidate old 32px saves
- **Map JSONs**: All zone pixel coordinates must be doubled
- **Assets**: New 64px sprite PNGs must be provided separately (out of scope for this plan)
- **Placeholder assets**: Update `generate-placeholder-assets.mjs` to generate 64px placeholders for development

## References

- Research document: `thoughts/shared/research/2026-03-10-32-to-64-sprite-migration.md`
- Game spec: `.ai/10x-devs/game/10x-explorers-spec.md`
- AI sprite prompts: `.ai/10x-devs/game/sprites-chatgpt.md`
- Constants: `src/explorers/config/constants.ts:1-59`
- Camera zoom: `src/explorers/scenes/GameScene.ts:279-297`
- Collision bodies: `src/explorers/entities/Astronaut.ts:29-32`, `src/explorers/entities/NPC.ts:62-66`
- Map editor: `src/explorers/editor/MapCanvas.svelte`, `MapEditor.svelte`, `tilesetLoader.ts`
- Map factory: `src/explorers/editor/mapFactory.ts:64-80`
- Map importer: `src/explorers/editor/mapImporter.ts:111-127`
- Type definitions: `src/explorers/editor/types.ts:54-70`
