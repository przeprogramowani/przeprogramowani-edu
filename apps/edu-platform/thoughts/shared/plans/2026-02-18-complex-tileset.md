# Complex Tileset Building Blocks — Implementation Plan

## Overview

Expand the 10x Explorers tileset from 4 basic tiles (floor, wall, door, interactive) to a 32-tile spaceship interior tileset with full 9-patch walls, floor variants, windows, and ceiling pipes. Update all 3 maps to use proper wall edges, corners, and floor variants across 3 tilemap layers (Ground, Walls, Above). All tiles are programmatically generated via the existing Node script.

## Current State Analysis

**Tileset:** 4 tiles (128×32px) — floor, wall, door, interactive marker. All maps use tile index 2 (wall) for perimeters and 0 (empty, replaced at runtime with 1) for floor. No visual distinction between wall edges, corners, or orientations.

**Maps:** 3 JSON tilemaps using only Ground (all zeros) and Walls (2s for borders, 0s for walkable) layers. Ground layer is effectively unused — all tiles replaced with wall tile at runtime.

**GameScene:** `wallLayer.setCollision(2)` hardcodes collision to tile index 2. Ground layer hack replaces all 0s with 1s.

### Key Discoveries:

- `scripts/generate-placeholder-assets.mjs:14-47` — tileset generator, 4×1 grid
- `src/explorers/scenes/GameScene.ts:92` — tileset loaded as `'placeholder'` / `'tileset-placeholder'`
- `src/explorers/scenes/GameScene.ts:98-101` — Ground layer 0→1 replacement hack
- `src/explorers/scenes/GameScene.ts:108` — `setCollision(2)` hardcoded
- `src/explorers/assets/AssetManifest.ts:17-19` — tileset asset entry
- All 3 map JSONs reference `"placeholder"` tileset with `columns: 4`, `tilecount: 4`

## Desired End State

The game renders visually distinct spaceship interiors with:
- **Proper wall edges** — each wall tile shows which direction the room is in (highlight on room-facing edge)
- **Corner tiles** — outer corners, inner corners for door frames and alcoves
- **Floor variants** — clean metal, variant panels, grated sections, amber lighting strips
- **Windows** — wall tiles with viewport to space (starfield dots)
- **Ceiling pipes** — Above layer decorations visible over the floor
- **3 map layers** — Ground (walkable floors), Walls (collision structure), Above (decorative overhead)

### Verification:

- All 3 maps render with distinct wall edges, corners, and floor types
- Player collides with all wall tiles (not just one index)
- Door openings have proper inner-corner transition tiles
- Windows on corridor north wall show starfield
- Above layer pipes render on top of floor without collision
- No runtime Ground layer hack (tiles placed correctly in map data)
- `node scripts/generate-placeholder-assets.mjs` regenerates all tiles deterministically

## What We're NOT Doing

- **No AI-generated pixel art** — programmatic colored rectangles with edge highlights
- **No object tiles** (hibernation pod, terminal, chair) — interactive objects remain as colored rectangles via Zones
- **No autotiling system** — tiles placed manually in map JSONs
- **No 5-layer system** — no GroundDecor or Objects tile layers (keeping 3: Ground, Walls, Above)
- **No tileset name change** — keeping `"placeholder"` for compatibility

## Implementation Approach

3 phases: (1) Design and generate the new 32-tile tileset, (2) Update GameScene to support 3 layers and new collision, (3) Redesign all 3 map JSONs.

## Critical Implementation Details

### Tile Catalog (8 columns × 4 rows = 32 tiles, 256×128px)

**Naming convention:** Tiles are named by which side(s) face the room interior (have the bright highlight edge).

**Visual style (programmatic):**
- Wall base: `#4a4a6a` solid fill
- Room-facing edge: 1px `#6a6a8a` highlight line
- Outer edge: 1px `#3a3a5a` shadow line
- Floor base: `#1a1a2e` with subtle panel details
- Space void: `#0a0e2a` (same as game background)

```
┌──────────────────────────────────────────────────────────────────┐
│ Row 0 (data 1-8): FLOOR TILES                                   │
│  1: floor-clean     — #1a1a2e, 1px grid at 16px in #252545     │
│  2: floor-variant   — #1e1e34, offset grid at 8px in #2a2a48   │
│  3: floor-grated    — #1a1a2e, horiz lines every 4px #252545   │
│  4: floor-amber     — #1a1a2e, 3px amber strip on bottom edge  │
│  5-8: reserved (transparent)                                     │
│                                                                  │
│ Row 1 (data 9-16): WALL EDGES + OUTER CORNERS                   │
│  9:  edge-S  — wall block, highlight on BOTTOM (north wall)     │
│  10: edge-N  — wall block, highlight on TOP (south wall)        │
│  11: edge-E  — wall block, highlight on RIGHT (west wall)       │
│  12: edge-W  — wall block, highlight on LEFT (east wall)        │
│  13: corner-SE — highlights on BOTTOM+RIGHT (top-left corner)   │
│  14: corner-SW — highlights on BOTTOM+LEFT (top-right corner)   │
│  15: corner-NE — highlights on TOP+RIGHT (bottom-left corner)   │
│  16: corner-NW — highlights on TOP+LEFT (bottom-right corner)   │
│                                                                  │
│ Row 2 (data 17-24): INNER CORNERS + T-JUNCTIONS                 │
│  17: inner-SE — wall with floor cutout in SE quadrant           │
│  18: inner-SW — wall with floor cutout in SW quadrant           │
│  19: inner-NE — wall with floor cutout in NE quadrant           │
│  20: inner-NW — wall with floor cutout in NW quadrant           │
│  21: tee-N   — wall segment open to N, E, W (wall only on S)   │
│  22: tee-S   — wall segment open to S, E, W (wall only on N)   │
│  23: tee-E   — wall segment open to N, E, S (wall only on W)   │
│  24: tee-W   — wall segment open to N, W, S (wall only on E)   │
│                                                                  │
│ Row 3 (data 25-32): SOLID + SPECIAL TILES                       │
│  25: wall-solid     — full wall block, border on all sides      │
│  26: wall-vert-pass — wall with highlights on LEFT+RIGHT        │
│  27: wall-horiz-pass— wall with highlights on TOP+BOTTOM        │
│  28: space-void     — pure #0a0e2a background                   │
│  29: window         — wall with 20×12px viewport (space+stars)  │
│  30: door-tile      — floor with teal #00d4aa frame lines       │
│  31: pipe-horiz     — transparent bg, 4px #3a3a5a horiz pipe    │
│  32: pipe-vert      — transparent bg, 4px #3a3a5a vert pipe     │
└──────────────────────────────────────────────────────────────────┘
```

### Tile Placement Rules

For a rectangular room, place tiles as follows:

```
 13  9  9  9 14    <- corner-SE, edge-S, ..., corner-SW
 11  .  .  . 12    <- edge-E, floor, ..., edge-W
 11  .  .  . 12
 15 10 10 10 16    <- corner-NE, edge-N, ..., corner-NW
```

For a door opening (e.g., right wall, row 6):
```
 ... 12    <- edge-W (wall continues)
 ... 18    <- inner-SW (wall ends, door starts)
 ...  0    <- no wall (door opening)
 ... 20    <- inner-NW (wall resumes, door ends)
 ... 12    <- edge-W (wall continues)
```

For corridor internal wall dividers (standalone wall columns):
```
 22         <- tee-S at top where divider meets top wall
 26         <- wall-vert-pass (middle segments)
 21         <- tee-N at bottom where divider meets bottom wall
```

### Collision Strategy

**Current:** `wallLayer.setCollision(2)` — only tile 2.

**New:** `wallLayer.setCollisionByExclusion([-1, 0])` — everything in the Walls layer that isn't empty has collision. This is future-proof — any tile placed in the Walls layer automatically has collision without maintaining a list of IDs.

### Layer Rendering

| Layer | Depth | Purpose | Collision |
|-------|-------|---------|-----------|
| Ground | `DEPTH.GROUND` (0) | Floor tiles | No |
| Walls | `DEPTH.WALLS` (2) | Wall structure | Yes (all non-empty) |
| Above | `DEPTH.ABOVE` (10) | Ceiling pipes | No |

---

## Phase 1: Tileset Generator + Asset Updates

### Overview

Extend `generate-placeholder-assets.mjs` to produce the new 32-tile tileset (256×128px, 8 columns × 4 rows). Update `AssetManifest.ts` tileset asset dimensions. The tileset name stays `"placeholder"` for backward compatibility during development.

### Changes Required:

#### 1. Tileset Generator

**File**: `scripts/generate-placeholder-assets.mjs`

Replace `generateTileset()` with a new implementation that draws 32 tiles:

```javascript
const COLS = 8;
const ROWS = 4;

// Color palette
const FLOOR = '#1a1a2e';
const FLOOR_VARIANT = '#1e1e34';
const FLOOR_GRID = '#252545';
const FLOOR_GRID_V = '#2a2a48';
const WALL = '#4a4a6a';
const WALL_HI = '#6a6a8a';
const WALL_SH = '#3a3a5a';
const SPACE = '#0a0e2a';
const TEAL = '#00d4aa';
const AMBER = '#ffb347';
const PIPE = '#3a3a5a';

function generateTileset() {
  const canvas = createCanvas(TILE * COLS, TILE * ROWS);
  const ctx = canvas.getContext('2d');

  // Clear to transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Helper: get top-left pixel of tile at (col, row)
  const tileX = (col) => col * TILE;
  const tileY = (row) => row * TILE;

  // --- Row 0: Floor tiles ---
  drawFloorClean(ctx, tileX(0), tileY(0));
  drawFloorVariant(ctx, tileX(1), tileY(0));
  drawFloorGrated(ctx, tileX(2), tileY(0));
  drawFloorAmber(ctx, tileX(3), tileY(0));
  // 4-7: reserved (transparent)

  // --- Row 1: Wall edges + outer corners ---
  drawWallEdge(ctx, tileX(0), tileY(1), ['S']);       // edge-S
  drawWallEdge(ctx, tileX(1), tileY(1), ['N']);       // edge-N
  drawWallEdge(ctx, tileX(2), tileY(1), ['E']);       // edge-E
  drawWallEdge(ctx, tileX(3), tileY(1), ['W']);       // edge-W
  drawWallEdge(ctx, tileX(4), tileY(1), ['S','E']);   // corner-SE
  drawWallEdge(ctx, tileX(5), tileY(1), ['S','W']);   // corner-SW
  drawWallEdge(ctx, tileX(6), tileY(1), ['N','E']);   // corner-NE
  drawWallEdge(ctx, tileX(7), tileY(1), ['N','W']);   // corner-NW

  // --- Row 2: Inner corners + T-junctions ---
  drawInnerCorner(ctx, tileX(0), tileY(2), 'SE');     // inner-SE
  drawInnerCorner(ctx, tileX(1), tileY(2), 'SW');     // inner-SW
  drawInnerCorner(ctx, tileX(2), tileY(2), 'NE');     // inner-NE
  drawInnerCorner(ctx, tileX(3), tileY(2), 'NW');     // inner-NW
  drawWallEdge(ctx, tileX(4), tileY(2), ['N','E','W']); // tee-N
  drawWallEdge(ctx, tileX(5), tileY(2), ['S','E','W']); // tee-S
  drawWallEdge(ctx, tileX(6), tileY(2), ['N','E','S']); // tee-E
  drawWallEdge(ctx, tileX(7), tileY(2), ['N','S','W']); // tee-W

  // --- Row 3: Solid + Special ---
  drawWallSolid(ctx, tileX(0), tileY(3));             // wall-solid
  drawWallEdge(ctx, tileX(1), tileY(3), ['E','W']);    // wall-vert-pass
  drawWallEdge(ctx, tileX(2), tileY(3), ['N','S']);    // wall-horiz-pass
  drawSpaceVoid(ctx, tileX(3), tileY(3));              // space-void
  drawWindow(ctx, tileX(4), tileY(3));                 // window
  drawDoorTile(ctx, tileX(5), tileY(3));               // door-tile
  drawPipeHoriz(ctx, tileX(6), tileY(3));              // pipe-horiz
  drawPipeVert(ctx, tileX(7), tileY(3));               // pipe-vert

  const outPath = join(PUBLIC, 'tilesets', 'placeholder.png');
  ensureDir(outPath);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✓ ${outPath} (${COLS}×${ROWS} tiles = ${COLS * ROWS} total)`);
}
```

**Drawing functions (key ones):**

```javascript
function drawFloorClean(ctx, x, y) {
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, TILE, TILE);
  // Subtle grid lines at 16px intervals
  ctx.strokeStyle = FLOOR_GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 16, y); ctx.lineTo(x + 16, y + TILE);
  ctx.moveTo(x, y + 16); ctx.lineTo(x + TILE, y + 16);
  ctx.stroke();
}

function drawWallEdge(ctx, x, y, highlightSides) {
  // Fill wall base
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  // Highlight on room-facing edges
  ctx.fillStyle = WALL_HI;
  if (highlightSides.includes('N')) ctx.fillRect(x, y, TILE, 1);
  if (highlightSides.includes('S')) ctx.fillRect(x, y + TILE - 1, TILE, 1);
  if (highlightSides.includes('E')) ctx.fillRect(x + TILE - 1, y, 1, TILE);
  if (highlightSides.includes('W')) ctx.fillRect(x, y, 1, TILE);
}

function drawInnerCorner(ctx, x, y, openQuadrant) {
  // Wall fill with a floor-colored cutout in the specified quadrant
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  const half = TILE / 2;
  ctx.fillStyle = FLOOR;
  switch (openQuadrant) {
    case 'SE': ctx.fillRect(x + half, y + half, half, half); break;
    case 'SW': ctx.fillRect(x, y + half, half, half); break;
    case 'NE': ctx.fillRect(x + half, y, half, half); break;
    case 'NW': ctx.fillRect(x, y, half, half); break;
  }
  // Highlight on the inner edges of the cutout
  ctx.fillStyle = WALL_HI;
  switch (openQuadrant) {
    case 'SE':
      ctx.fillRect(x + half, y + half, 1, half); // left edge of cutout
      ctx.fillRect(x + half, y + half, half, 1); // top edge of cutout
      break;
    case 'SW':
      ctx.fillRect(x + half - 1, y + half, 1, half);
      ctx.fillRect(x, y + half, half, 1);
      break;
    case 'NE':
      ctx.fillRect(x + half, y, 1, half);
      ctx.fillRect(x + half, y + half - 1, half, 1);
      break;
    case 'NW':
      ctx.fillRect(x + half - 1, y, 1, half);
      ctx.fillRect(x, y + half - 1, half, 1);
      break;
  }
}

function drawWindow(ctx, x, y) {
  // Wall fill with viewport to space
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  // Viewport cutout
  const vx = x + 6, vy = y + 10, vw = 20, vh = 12;
  ctx.fillStyle = SPACE;
  ctx.fillRect(vx, vy, vw, vh);
  // Stars (fixed positions for determinism)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(vx + 3, vy + 3, 1, 1);
  ctx.fillRect(vx + 12, vy + 7, 1, 1);
  ctx.fillRect(vx + 8, vy + 2, 1, 1);
  ctx.fillRect(vx + 16, vy + 5, 1, 1);
  ctx.fillRect(vx + 5, vy + 9, 1, 1);
  // Viewport frame
  ctx.strokeStyle = WALL_HI;
  ctx.lineWidth = 1;
  ctx.strokeRect(vx - 0.5, vy - 0.5, vw + 1, vh + 1);
}
```

#### 2. Tile Index Constants

**File**: `src/explorers/config/tileIndices.ts` (new file)

```typescript
/** Tile indices as they appear in map data (firstgid=1). 0 = empty. */
export const TileIndex = {
  // Row 0: Floors (Ground layer)
  FLOOR_CLEAN: 1,
  FLOOR_VARIANT: 2,
  FLOOR_GRATED: 3,
  FLOOR_AMBER: 4,

  // Row 1: Wall edges + outer corners (Walls layer)
  EDGE_S: 9,
  EDGE_N: 10,
  EDGE_E: 11,
  EDGE_W: 12,
  CORNER_SE: 13,
  CORNER_SW: 14,
  CORNER_NE: 15,
  CORNER_NW: 16,

  // Row 2: Inner corners + T-junctions (Walls layer)
  INNER_SE: 17,
  INNER_SW: 18,
  INNER_NE: 19,
  INNER_NW: 20,
  TEE_N: 21,
  TEE_S: 22,
  TEE_E: 23,
  TEE_W: 24,

  // Row 3: Solid + Special
  WALL_SOLID: 25,
  WALL_VERT_PASS: 26,
  WALL_HORIZ_PASS: 27,
  SPACE_VOID: 28,
  WINDOW: 29,
  DOOR_TILE: 30,
  PIPE_HORIZ: 31,
  PIPE_VERT: 32,
} as const;

export const TILESET_COLS = 8;
export const TILESET_ROWS = 4;
export const TILESET_TILE_COUNT = TILESET_COLS * TILESET_ROWS;
```

### Success Criteria:

#### Automated Verification:

- [x] Script runs without errors: `node scripts/generate-placeholder-assets.mjs`
- [x] Tileset is 256×128px: `file public/game/tilesets/placeholder.png` → "PNG image data, 256 x 128"
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Open tileset PNG — 32 tiles visible in 8×4 grid
- [ ] Row 0: 4 floor variants with different patterns + 4 empty slots
- [ ] Row 1: 4 wall edges (each with highlight on different side) + 4 corners
- [ ] Row 2: 4 inner corners (each with floor cutout in different quadrant) + 4 T-junctions
- [ ] Row 3: solid wall, passes, space void, window with stars, door tile, pipes

**Implementation Note**: This phase changes only the tileset PNG and adds a constants file. The game still uses the old map data (won't render correctly yet). Pause for manual PNG review.

---

## Phase 2: GameScene Layer Support + Collision Update

### Overview

Update GameScene to support 3 tilemap layers (Ground, Walls, Above), remove the Ground layer 0→1 hack, and switch collision from `setCollision(2)` to `setCollisionByExclusion`. Update tileset metadata in map JSONs to reference the new 32-tile tileset dimensions.

### Changes Required:

#### 1. GameScene Layer Handling

**File**: `src/explorers/scenes/GameScene.ts`

Replace the current layer creation code (lines 94-110) with:

```typescript
// Create layers
const groundLayer = map.createLayer('Ground', tileset, 0, 0);
if (groundLayer) {
  groundLayer.setDepth(DEPTH.GROUND);
  // NO MORE 0→1 replacement hack — tiles are correctly placed in map data
}

const wallLayer = map.createLayer('Walls', tileset, 0, 0);
if (wallLayer) {
  wallLayer.setDepth(DEPTH.WALLS);
  // All non-empty tiles in Walls layer have collision
  wallLayer.setCollisionByExclusion([-1, 0]);
  this.wallLayer = wallLayer;
}

// Above layer (optional — only exists if map defines it)
const aboveLayer = map.createLayer('Above', tileset, 0, 0);
if (aboveLayer) {
  aboveLayer.setDepth(DEPTH.ABOVE);
  // No collision on Above layer
}
```

**Key changes:**
- Remove `forEachTile` hack that replaced 0s with 1s (lines 98-101)
- Change `setCollision(2)` → `setCollisionByExclusion([-1, 0])` (line 108)
- Add Above layer creation with `DEPTH.ABOVE`

#### 2. Update Tileset Metadata in Map JSONs

All 3 map JSON files need their `tilesets` section updated to reflect the new dimensions:

```json
"tilesets": [
  {
    "columns": 8,
    "firstgid": 1,
    "image": "../tilesets/placeholder.png",
    "imageheight": 128,
    "imagewidth": 256,
    "margin": 0,
    "name": "placeholder",
    "spacing": 0,
    "tilecount": 32,
    "tileheight": 32,
    "tilewidth": 32
  }
]
```

**Changes from current:**
- `columns`: 4 → 8
- `imageheight`: 32 → 128
- `imagewidth`: 128 → 256
- `tilecount`: 4 → 32
- Remove `tiles` array (collision by property no longer needed — using `setCollisionByExclusion`)

#### 3. Add Above Layer to Map JSONs

Each map JSON needs an "Above" tilelayer added between the Walls layer and Zones layer. Initially all zeros (empty). Content added in Phase 3.

```json
{
  "data": [0, 0, 0, ...],
  "height": <map height>,
  "id": 4,
  "name": "Above",
  "opacity": 1,
  "type": "tilelayer",
  "visible": true,
  "width": <map width>,
  "x": 0,
  "y": 0
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [x] All map JSONs are valid JSON

#### Manual Verification:

- [x] Game loads without errors (maps still use old tile indices — will look wrong but shouldn't crash)
- [x] No console errors related to layer creation

**Implementation Note**: After this phase, the game renders but maps look broken (old tile indices don't match new tileset layout). Phase 3 fixes this. Pause for quick crash-test only.

---

## Phase 3: Map Redesign — All 3 Maps

### Overview

Redesign all 3 map JSON data arrays to use the new tile indices across Ground, Walls, and Above layers. Each map gets proper wall edges, corners, floor variants, window tiles, and ceiling pipes. Zone objects (interactive triggers, doors, spawn points) remain unchanged.

### Changes Required:

#### 1. ship-hibernation.json (14×12)

**File**: `public/game/maps/ship-hibernation.json`

Room shape: rectangular with door opening at (13, 6).

**Ground layer (14×12)** — floor tiles inside the room:
```
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 2, 1, 1, 3, 3, 1, 1, 2, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
```
- `1` = floor-clean, `2` = floor-variant, `3` = floor-grated (near hibernation pod), `4` = floor-amber (near walls for lighting strip)

**Walls layer (14×12)** — wall structure with proper edges/corners:
```
13, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,14,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,18,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,20,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
15,10,10,10,10,10,10,10,10,10,10,10,10,16
```
- `13`=corner-SE (top-left), `14`=corner-SW (top-right), `15`=corner-NE (bottom-left), `16`=corner-NW (bottom-right)
- `9`=edge-S (top wall), `10`=edge-N (bottom wall), `11`=edge-E (left wall), `12`=edge-W (right wall)
- `18`=inner-SW (door frame top), `20`=inner-NW (door frame bottom)
- `0`=empty (door opening at row 6, x=13)

**Above layer (14×12)** — ceiling pipes:
```
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0,31,31,31, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0,32, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0,32, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
```
- `31`=pipe-horizontal (across ceiling near top), `32`=pipe-vertical (vertical section)

---

#### 2. ship-corridor.json (24×8)

**File**: `public/game/maps/ship-corridor.json`

Long hallway with door openings at (0,4) and (23,4), internal wall dividers at columns 11 (rows 2-3) and 14 (rows 5-6).

**Ground layer (24×8)**:
```
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
```
- Floor extends through door openings (row 4, x=0 and x=23)
- `0` under wall dividers (cols 11 rows 2-3, col 14 rows 5-6)
- `3` = grated floor sections in center corridor

**Walls layer (24×8)**:
```
13, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,22, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,14,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,20,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,22, 0, 0, 0, 0, 0, 0, 0, 0,19,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,21, 0, 0, 0, 0, 0, 0, 0, 0,12,
15,10,10,10,10,10,10,10,10,10,10,10,10,10,22,10,10,10,10,10,10,10,10,16
```
- Door openings: (0,3)→inner-SW, (0,4)→empty, (0,5)→inner-SE | (23,3)→inner-NW, (23,4)→empty, (23,5)→inner-NE
- Internal divider col 11 (rows 2-3): `26`=wall-vert-pass(row 2), `21`=tee-N(row 3 connecting to floor below)
- T-junction `22`=tee-S at (11,0) where divider meets top wall
- Internal divider col 14 (rows 5-6): `22`=tee-S(row 5 from top), `21`=tee-N(row 6 from bottom)
- T-junction `22`=tee-S at (14,7) where divider meets bottom wall
- Windows: Replace wall tiles at (6,0) and (18,0) with `29` (window tile)

**Updated top row with windows:**
```
13, 9, 9, 9, 9, 9,29, 9, 9, 9, 9,22, 9, 9, 9, 9, 9, 9,29, 9, 9, 9, 9,14,
```

**Above layer (24×8)** — corridor ceiling pipes:
```
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0,31,31,31,31,31,31,31,31,31, 0, 0, 0,31,31,31,31,31,31,31,31, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0,31,31,31,31,31,31,31,31,31, 0, 0, 0,31,31,31,31,31,31,31,31, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
```

---

#### 3. ship-bridge.json (28×18)

**File**: `public/game/maps/ship-bridge.json`

Large rectangular room with door opening at (0,8).

**Ground layer (28×18)** — polished floor with central platform area:
```
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0,
 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0,
 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0,
 0, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
```
- `2` = floor-variant in crew station areas (rows 5-6 cols 4-5, 22-23; row 13 cols 4-5, 22-23)
- `3` = floor-grated in central command platform area (rows 7-10, cols 8-19)
- Row 8 (door): floor extends to x=0

**Walls layer (28×18)** — bridge perimeter with door at (0,8):
```
13, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,14,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,
15,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,16
```
- Door opening at (0,8): `18`=inner-SW (row 7), `0`=empty (row 8), `17`=inner-SE (row 9)

**Above layer (28×18)** — bridge ceiling structure:
```
(mostly zeros with pipe decorations)
Row 3:  0, 0, 0, 0, 0, 0, 0, 0,31,31,31,31,31,31,31,31,31,31,31,31, 0, 0, 0, 0, 0, 0, 0, 0
Row 14: 0, 0, 0, 0, 0, 0, 0, 0,31,31,31,31,31,31,31,31,31,31,31,31, 0, 0, 0, 0, 0, 0, 0, 0
```

#### 4. Update Engine Cookbook

**File**: `.ai/10x-devs/game/cookbook.md`

Update §9 (How Assets Work) to document the new tileset structure:
- Update tile index table with all 32 tiles
- Update tileset dimensions (256×128, 8 columns, 4 rows)
- Document the tile naming convention and placement rules

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] All 3 tilemap JSON files are valid JSON
- [x] All tests pass: `npm run test`

#### Manual Verification:

- [ ] ship-hibernation renders with distinct wall edges — top wall looks different from left wall
- [ ] Corner tiles connect properly — no visual gaps at room corners
- [ ] Door opening at (13,6) has proper inner-corner tiles framing the gap
- [ ] Floor shows mix of clean, variant, and grated tiles
- [ ] Amber lighting strips visible near walls (row 9)
- [ ] ship-corridor renders with windows on top wall (showing stars in viewport)
- [ ] Corridor internal dividers use T-junctions at wall connections and vert-pass for middle
- [ ] Corridor door openings (both ends) have proper inner-corner frames
- [ ] ship-bridge renders with proper large room walls
- [ ] Bridge door opening at (0,8) has inner-corner tiles
- [ ] Floor-grated tiles visible in central command area
- [ ] Above layer pipe decorations render on top of floor
- [ ] Player collides with ALL wall tile types (not just one index)
- [ ] Player can walk through door openings (no false collision)
- [ ] Walk through all 3 maps via doors — transitions work correctly with new tile data
- [ ] No console errors during gameplay

**Implementation Note**: This is the main phase. After completion, do a full playthrough of all 3 maps.

---

## Testing Strategy

### Unit Tests:

- No new unit tests needed — tile rendering is visual, collision is tested via gameplay

### Manual Testing Steps:

1. Run `node scripts/generate-placeholder-assets.mjs` — verify 256×128px PNG
2. Open PNG in viewer — verify all 32 tiles are distinct and correctly drawn
3. Start game at `/explorers` — ship-hibernation loads with new tiles
4. Walk around room — walls have distinct edges, floor has variants
5. Walk to door → transition to corridor → verify corridor tiles
6. Check corridor windows (stars visible in wall viewports)
7. Check corridor dividers connect properly with T-junctions
8. Walk through corridor to bridge → verify bridge tiles
9. Verify Above layer pipes render on top of floor without blocking movement
10. Walk into walls in all 3 maps — collision works for all wall tile types
11. Walk through all door openings — no false collision
12. Complete full demo playthrough (quests, terminal, etc.) — no regressions

## Performance Considerations

- Tileset PNG grows from 128×32 (4 KB) to 256×128 (~8 KB) — negligible
- No runtime overhead — tiles are static, rendered by Phaser's tilemap system
- No additional draw calls — same number of layers, just more tile variety

## References

- Current tileset generator: `scripts/generate-placeholder-assets.mjs`
- Current GameScene: `src/explorers/scenes/GameScene.ts`
- Sprites theme (target art style): `.ai/10x-devs/game/sprites-theme.md` §2
- Demo milestone plan: `thoughts/shared/plans/2026-02-18-demo-milestone.md`
- Engine cookbook: `.ai/10x-devs/game/cookbook.md` §2, §9
