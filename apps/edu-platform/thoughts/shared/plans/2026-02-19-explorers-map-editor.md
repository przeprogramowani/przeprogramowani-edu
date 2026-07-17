# Explorers Map Editor — Implementation Plan

## Overview

Build an in-browser visual map editor at `/explorers-editor` for designing Tiled-compatible JSON maps for the 10x Explorers game. The editor lets you paint tiles on a grid canvas using the existing `placeholder.png` tileset, place interactive zones (triggers, doors, terminals, spawns), configure zone properties, and import/export maps as JSON — all matching the format consumed by `GameScene.ts`.

## Current State Analysis

### Existing Map Format (Tiled JSON)
All three maps (`ship-hibernation`, `ship-corridor`, `ship-bridge`) share an identical structure:
- **3 tile layers**: `Ground` (depth 0), `Walls` (depth 2, collision), `Above` (depth 10, foreground)
- **1 object group**: `Zones` — containing objects of type `spawn`, `trigger`, `door`, `terminal`
- **Single tileset**: `placeholder.png` — 256x128px, 8 columns x 4 rows = 32 tiles at 32x32px, `firstgid: 1`
- Tile data is a flat array of integers (0 = empty, 1–32 = tile IDs with firstgid offset)
- Map dimensions vary per room (14x12, 24x8, 28x18)

### Zone Property Schemas
- **spawn**: `id` (string)
- **trigger**: `id` (string), `eventId` (string), optional `requiredFlag` (string)
- **door**: `id` (string), `targetMap` (string), `spawnX` (int, tile coords), `spawnY` (int, tile coords)
- **terminal**: `id` (string), `eventId` (string)

### Key Discoveries
- `GameScene.ts:96` — tileset name must be `"placeholder"`, texture key `"tileset-placeholder"`
- `GameScene.ts:99-115` — layers are looked up by exact name: `"Ground"`, `"Walls"`, `"Above"`, `"Zones"`
- `GameScene.ts:107` — Walls layer collision set via `setCollisionByExclusion([-1, 0])` — any non-zero tile blocks
- `GameScene.ts:121-140` — Zone properties parsed from Tiled's `properties` array format
- Door `spawnX`/`spawnY` are in **tile coordinates** (multiplied by TILE_SIZE in transition logic)
- Available dialogue/event IDs: `ship-interactions.json` contains ~18 entries (e.g. `dead-screen`, `terminal-first-use`, `captain-chair`)
- Existing maps: `ship-hibernation`, `ship-corridor`, `ship-bridge` (registered in `AssetManifest.ts`)

## Desired End State

A fully functional `/explorers-editor` page where the user can:

1. **Create a new map** by specifying width x height (in tiles)
2. **Load an existing map JSON** via file picker or drag-and-drop
3. **Paint tiles** on a canvas grid by selecting from a visual tile palette (placeholder.png sliced into 32 tiles)
4. **Switch between layers** (Ground, Walls, Above) to paint on each independently
5. **Toggle layer visibility** to see individual layers or the composite
6. **Place zones** by clicking on the grid in "zone mode", then configuring type and properties in a side panel
7. **Edit/delete zones** by clicking existing zone overlays
8. **Export valid Tiled JSON** that can be dropped into `public/game/maps/` and loaded by the game directly

### Verification
- Export a map from the editor, place it in `public/game/maps/`, register it in `AssetManifest.ts` and `MAP_ASSETS`, and the game loads it without errors
- Import each of the 3 existing maps, make a change, export, and verify the output matches the expected schema

## What We're NOT Doing

- No Phaser dependency — pure Canvas2D + Svelte
- No undo/redo system (can be added later)
- No multi-tileset support — only `placeholder.png`
- No real-time game preview inside the editor
- No auto-registration in `AssetManifest.ts` — manual step
- No authentication — editor is a dev tool, no auth required
- No mobile support — desktop-only editor

## Implementation Approach

Svelte 5 island inside an Astro page, using HTML5 Canvas for the map rendering/painting and DOM for the UI panels. The map state is a reactive Svelte store mirroring the Tiled JSON structure, so export is essentially `JSON.stringify(mapState)`.

**UI Layout:**
```
┌──────────────────────────────────────────────┬────────────────────┐
│  Toolbar: [New] [Load] [Export] [Map: 28x18] │                    │
├──────────────────────────────────────────────┤  Right Panel       │
│                                              │  ┌──────────────┐  │
│                                              │  │ Tile Palette  │  │
│          Map Canvas                          │  │ (8x4 grid)   │  │
│          (scrollable, zoomable)              │  │ [selected=3]  │  │
│          Grid overlay                        │  ├──────────────┤  │
│          Zone overlays (colored rects)       │  │ Layers        │  │
│                                              │  │ [x] Ground    │  │
│                                              │  │ [x] Walls     │  │
│                                              │  │ [ ] Above     │  │
│                                              │  │ [ ] Zones     │  │
│                                              │  ├──────────────┤  │
│                                              │  │ Zone Props    │  │
│                                              │  │ (when zone    │  │
│                                              │  │  selected)    │  │
│                                              │  └──────────────┘  │
└──────────────────────────────────────────────┴────────────────────┘
```

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This is a standalone editor tool with no game lifecycle integration. Svelte `onMount` handles canvas setup, and all state is local.

### User Experience Specification

- **Tile painting**: Select tile from palette (click), then click or click-drag on map canvas to paint. Right-click or select tile 0 to erase.
- **Layer switching**: Click layer name to set active painting layer. Eye icon toggles visibility. Active layer highlighted.
- **Zone mode**: When "Zones" layer is active, clicking on map places a new zone (32x32 default). A property form appears in the right panel. Clicking an existing zone selects it for editing.
- **Import**: File picker button or drag-drop onto the canvas area. Validates JSON structure before loading.
- **Export**: Downloads a `.json` file. Filename derived from a "map name" field in toolbar.
- **Grid**: Always visible with subtle lines. Zoom via scroll wheel, pan via middle-click-drag or by holding Space+drag.

### Performance & Optimization Strategy

- Canvas redraws only on state change (not every frame) — triggered by Svelte reactivity
- Tile images pre-sliced from spritesheet once on load, cached as `ImageBitmap[]`
- Only visible tiles rendered (viewport culling for large maps)
- Zone overlays drawn as semi-transparent colored rectangles on top of tile layers

### State Management Sequencing

- Single `mapData` reactive object ($state) holding the full Tiled JSON structure
- Layer data is `number[]` arrays (flat, row-major, matching Tiled format)
- Zones stored as array of zone objects matching the Tiled `objects` format
- All mutations go through helper functions that update `mapData` and trigger canvas redraw
- Selected tile, active layer, editor mode stored as separate reactive variables

### Debug & Observability Plan

- Console logging for import/export operations
- Visual grid coordinates shown on hover (tile X,Y in status bar)
- Zone overlays always visible when Zones layer is active (colored by type)
- Export validates output against expected schema before download

---

## Phase 1: Page Scaffolding & Data Model

### Overview
Create the Astro page, layout, Svelte entry component, and TypeScript types for the map data model.

### Changes Required:

#### 1. Astro Page

**File**: `src/pages/explorers-editor.astro`

```astro
---
import GameLayout from '@/layouts/GameLayout.astro';
import MapEditor from '@/explorers/editor/MapEditor.svelte';
---

<GameLayout>
  <MapEditor client:only="svelte" />
</GameLayout>
```

#### 2. Map Data Types

**File**: `src/explorers/editor/types.ts`

TypeScript types that mirror the Tiled JSON format exactly:

```typescript
export interface TiledProperty {
  name: string;
  type: 'string' | 'int' | 'float' | 'bool';
  value: string | number | boolean;
}

export interface TileLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: 'tilelayer';
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface ZoneObject {
  id: number;
  name: string;
  type: 'spawn' | 'trigger' | 'door' | 'terminal';
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  properties: TiledProperty[];
}

export interface ObjectLayer {
  draworder: 'topdown';
  id: number;
  name: 'Zones';
  objects: ZoneObject[];
  opacity: number;
  type: 'objectgroup';
  visible: boolean;
  x: number;
  y: number;
}

export interface TiledMap {
  compressionlevel: -1;
  height: number;
  infinite: false;
  layers: [TileLayer, TileLayer, TileLayer, ObjectLayer]; // Ground, Walls, Above, Zones
  nextlayerid: number;
  nextobjectid: number;
  orientation: 'orthogonal';
  renderorder: 'right-down';
  tiledversion: '1.10.2';
  tileheight: 32;
  tilesets: [{
    columns: 8;
    firstgid: 1;
    image: string;
    imageheight: 128;
    imagewidth: 256;
    margin: 0;
    name: 'placeholder';
    spacing: 0;
    tilecount: 32;
    tileheight: 32;
    tilewidth: 32;
  }];
  tilewidth: 32;
  type: 'map';
  version: '1.10';
  width: number;
}

export type EditorMode = 'paint' | 'erase' | 'zones';
export type LayerName = 'Ground' | 'Walls' | 'Above' | 'Zones';

export const ZONE_COLORS: Record<ZoneObject['type'], string> = {
  spawn: '#4488ff',
  trigger: '#ffb347',
  door: '#00d4aa',
  terminal: '#00d4aa',
};
```

#### 3. Map Factory Function

**File**: `src/explorers/editor/mapFactory.ts`

Function to create a blank TiledMap with given dimensions:

```typescript
import type { TiledMap, TileLayer, ObjectLayer } from './types';

export function createBlankMap(width: number, height: number): TiledMap {
  const emptyData = () => new Array(width * height).fill(0);

  const ground: TileLayer = {
    data: emptyData(),
    height, id: 1, name: 'Ground', opacity: 1,
    type: 'tilelayer', visible: true, width, x: 0, y: 0,
  };
  const walls: TileLayer = {
    data: emptyData(),
    height, id: 2, name: 'Walls', opacity: 1,
    type: 'tilelayer', visible: true, width, x: 0, y: 0,
  };
  const above: TileLayer = {
    data: emptyData(),
    height, id: 4, name: 'Above', opacity: 1,
    type: 'tilelayer', visible: true, width, x: 0, y: 0,
  };
  const zones: ObjectLayer = {
    draworder: 'topdown', id: 3, name: 'Zones',
    objects: [], opacity: 1, type: 'objectgroup',
    visible: true, x: 0, y: 0,
  };

  return {
    compressionlevel: -1, height, infinite: false,
    layers: [ground, walls, above, zones],
    nextlayerid: 5, nextobjectid: 1,
    orientation: 'orthogonal', renderorder: 'right-down',
    tiledversion: '1.10.2', tileheight: 32,
    tilesets: [{
      columns: 8, firstgid: 1,
      image: '../tilesets/placeholder.png',
      imageheight: 128, imagewidth: 256, margin: 0,
      name: 'placeholder', spacing: 0, tilecount: 32,
      tileheight: 32, tilewidth: 32,
    }],
    tilewidth: 32, type: 'map', version: '1.10', width,
  };
}
```

#### 4. Svelte Entry Component (shell)

**File**: `src/explorers/editor/MapEditor.svelte`

Initial shell with layout structure — actual sub-components added in later phases:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { TiledMap, LayerName, EditorMode } from './types';
  import { createBlankMap } from './mapFactory';

  let mapData: TiledMap = $state(createBlankMap(14, 12));
  let activeLayer: LayerName = $state('Ground');
  let editorMode: EditorMode = $state('paint');
  let selectedTile: number = $state(1);
  let layerVisibility: Record<string, boolean> = $state({
    Ground: true, Walls: true, Above: true, Zones: true,
  });
</script>

<div class="flex h-full w-full bg-[#0d1117] text-gray-200 font-mono text-sm">
  <!-- Main canvas area -->
  <div class="flex-1 flex flex-col min-w-0">
    <div class="h-10 border-b border-gray-700 flex items-center px-3 gap-2">
      <!-- Toolbar placeholder -->
      <span class="text-gray-400">Explorers Map Editor</span>
    </div>
    <div class="flex-1 relative overflow-hidden">
      <!-- Canvas goes here (Phase 2) -->
    </div>
  </div>

  <!-- Right panel -->
  <div class="w-64 border-l border-gray-700 flex flex-col overflow-y-auto">
    <!-- Tile palette, layers, zone props (Phases 2-4) -->
  </div>
</div>
```

### Success Criteria:

#### Automated Verification:
- [x] Page loads at `http://localhost:3000/explorers-editor` without errors
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] `createBlankMap(14, 12)` returns valid structure with correct array lengths (14*12 = 168 per layer)

#### Manual Verification:
- [ ] Page shows the shell layout with toolbar area and right panel
- [ ] No console errors

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Phase 2: Tile Palette & Canvas Renderer

### Overview
Load and slice the `placeholder.png` tileset into individual tile images, render the map grid on an HTML5 Canvas, and build the tile palette selector.

### Changes Required:

#### 1. Tileset Loader Utility

**File**: `src/explorers/editor/tilesetLoader.ts`

Load `placeholder.png` and slice it into 32 individual tile `ImageBitmap` objects:

```typescript
const TILE_SIZE = 32;
const COLUMNS = 8;
const ROWS = 4;
const TILE_COUNT = 32;

export async function loadTileImages(): Promise<ImageBitmap[]> {
  const img = new Image();
  img.src = '/game/tilesets/placeholder.png';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const tiles: ImageBitmap[] = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const col = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);
    const bitmap = await createImageBitmap(img,
      col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    tiles.push(bitmap);
  }
  return tiles;
}
```

#### 2. Canvas Map Renderer

**File**: `src/explorers/editor/MapCanvas.svelte`

A Svelte component wrapping an `<canvas>` element that:
- Draws the tile grid for all visible layers (composited: Ground, then Walls, then Above)
- Draws a grid overlay (subtle gray lines)
- Draws zone overlays (colored semi-transparent rectangles with labels)
- Supports mouse interaction (click/drag to paint, scroll to zoom, middle-click/Space+drag to pan)
- Shows hovered tile coordinates

Key implementation details:
- Canvas sized to fill parent container, with internal coordinate transform for zoom/pan
- `drawMap()` function redraws everything: iterate visible tile layers bottom-up, draw each non-zero tile using the pre-sliced `ImageBitmap[]`
- Zone overlays drawn after all tile layers, using `ZONE_COLORS` with 0.25 alpha fill + 2px stroke
- Grid lines drawn at 0.15 alpha
- Mouse position → tile coordinate conversion accounts for zoom/pan offset
- Calls `onTilePaint(layer, x, y, tileId)` callback when painting
- Calls `onZoneClick(x, y)` callback when in zone mode
- Calls `onZoneSelect(zoneId)` when clicking an existing zone

Props:
- `mapData: TiledMap`
- `tileImages: ImageBitmap[]`
- `activeLayer: LayerName`
- `editorMode: EditorMode`
- `selectedTile: number`
- `layerVisibility: Record<string, boolean>`
- `selectedZoneId: number | null`
- `onTilePaint: (layerName: string, tileX: number, tileY: number, tileId: number) => void`
- `onZoneClick: (tileX: number, tileY: number) => void`
- `onZoneSelect: (objectId: number) => void`

Canvas redraw triggered by a reactive `$effect` watching `mapData`, `layerVisibility`, `selectedZoneId`, and viewport state.

#### 3. Tile Palette Component

**File**: `src/explorers/editor/TilePalette.svelte`

A panel showing 32 tiles in an 8x4 grid. Each tile rendered as a small canvas or `<img>` from the sliced `ImageBitmap`. Tile 0 (empty/eraser) shown as a crossed-out square. Clicking a tile sets `selectedTile`. Selected tile highlighted with a border.

Props:
- `tileImages: ImageBitmap[]`
- `selectedTile: number`
- `onSelect: (tileId: number) => void`

Also includes an "Eraser" button that selects tile 0.

#### 4. Wire into MapEditor.svelte

Update `MapEditor.svelte` to:
- Load tile images on mount via `loadTileImages()`
- Render `MapCanvas` in the main area
- Render `TilePalette` in the right panel
- Show loading state until tiles are loaded

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification:
- [ ] Canvas renders a blank grid (14x12) with gray grid lines
- [ ] Tile palette shows all 32 tiles from placeholder.png, each visually distinct
- [ ] Clicking a tile in the palette highlights it
- [ ] Hovering over the canvas shows tile coordinates (e.g., "x: 5, y: 3")
- [ ] Scroll wheel zooms in/out on the canvas
- [ ] Middle-click drag or Space+drag pans the canvas

**Implementation Note**: Pause for manual confirmation.

---

## Phase 3: Tile Painting & Layer Controls

### Overview
Enable click-and-drag tile painting on the active layer, add layer switching, and layer visibility toggles.

### Changes Required:

#### 1. Painting Logic in MapCanvas

Add to `MapCanvas.svelte`:
- On `mousedown` (left button) in paint mode: start painting at hovered tile
- On `mousemove` while button held: continue painting (drag-paint)
- On `mouseup`: stop painting
- Painting calls `onTilePaint(activeLayerName, tileX, tileY, selectedTile)`
- In erase mode or when `selectedTile === 0`: paint with 0

Prevent painting when:
- Active layer is `Zones` (zone mode handles that separately)
- Mouse is outside map bounds
- No tile images loaded

#### 2. Layer Panel Component

**File**: `src/explorers/editor/LayerPanel.svelte`

A panel listing all 4 layers with:
- Layer name (clickable to set as active)
- Eye icon toggle for visibility
- Active layer highlighted with accent color
- When clicking "Zones" layer, switches `editorMode` to `'zones'`; clicking any tile layer switches to `'paint'`

Props:
- `activeLayer: LayerName`
- `layerVisibility: Record<string, boolean>`
- `onLayerSelect: (layer: LayerName) => void`
- `onVisibilityToggle: (layer: string) => void`

#### 3. MapEditor State Mutations

In `MapEditor.svelte`, add handler functions:
- `paintTile(layerName, tileX, tileY, tileId)`: finds the matching tile layer in `mapData.layers`, computes array index (`tileY * width + tileX`), sets `layer.data[index] = tileId`
- `toggleVisibility(layerName)`: flips `layerVisibility[layerName]`
- `selectLayer(layerName)`: sets `activeLayer`, adjusts `editorMode`

#### 4. Status Bar

Add a small status bar at the bottom of the canvas area showing:
- Current tile coordinates on hover: `Tile: (5, 3)`
- Active layer name
- Map dimensions: `28 x 18`
- Selected tile ID

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification:
- [ ] Clicking on canvas with a tile selected paints that tile
- [ ] Dragging paints a continuous line of tiles
- [ ] Switching to a different layer and painting only affects that layer
- [ ] Toggling layer visibility hides/shows layers on canvas
- [ ] Eraser tool (tile 0) clears painted tiles
- [ ] Status bar shows correct coordinates, layer, and map size
- [ ] Painting on Walls layer shows tiles that would create collision

**Implementation Note**: Pause for manual confirmation.

---

## Phase 4: Zone Editor

### Overview
Enable click-to-place zones on the grid, property editing panel, zone selection and deletion.

### Changes Required:

#### 1. Zone Placement in MapCanvas

When `editorMode === 'zones'` and user clicks on the map:
- Check if click lands on an existing zone → select it (call `onZoneSelect(zone.id)`)
- If click is on empty space → call `onZoneClick(tileX, tileY)` to create a new zone

Zone overlays are rendered for all zones when the Zones layer is visible:
- Colored rectangle (fill at 0.2 alpha, stroke at 1.0) using `ZONE_COLORS`
- Zone name rendered as small text label inside the rectangle
- Selected zone has a thicker/brighter border

#### 2. Zone Properties Panel

**File**: `src/explorers/editor/ZonePropertiesPanel.svelte`

When a zone is selected, show an editable form in the right panel:

- **Name** (text input)
- **Type** (dropdown: `spawn`, `trigger`, `door`, `terminal`)
- **Position** (x, y — in pixels, read-only, derived from tile position)
- **Size** (width, height — default 32x32, allow 32/64/96 as options)

Conditional property fields based on type:
- **spawn**: `id` (text)
- **trigger**: `id` (text), `eventId` (dropdown populated from `ship-interactions.json` keys + free text), optional `requiredFlag` (text)
- **door**: `id` (text), `targetMap` (dropdown: `ship-hibernation`, `ship-corridor`, `ship-bridge` + free text), `spawnX` (number, tile coords), `spawnY` (number, tile coords)
- **terminal**: `id` (text), `eventId` (dropdown + free text)

Also includes:
- **Delete Zone** button (red, with confirmation)
- Properties update the zone object in `mapData` reactively

Props:
- `zone: ZoneObject | null`
- `onUpdate: (zone: ZoneObject) => void`
- `onDelete: (zoneId: number) => void`

#### 3. Known Event IDs & Target Maps

**File**: `src/explorers/editor/editorConstants.ts`

Constants for dropdowns:

```typescript
export const KNOWN_EVENT_IDS = [
  'dead-screen', 'notice-board', 'examine-pod', 'damaged-panel',
  'oxygen-tank', 'window-1', 'window-2', 'captain-chair',
  'station-nav', 'station-comms', 'station-eng', 'data-console',
  'holo-projector-off', 'holo-projector-on', 'star-map-off',
  'terminal-first-use', 'find-keycode', 'awakening-monologue',
];

export const KNOWN_TARGET_MAPS = [
  'ship-hibernation', 'ship-corridor', 'ship-bridge',
];
```

#### 4. MapEditor Zone Handlers

In `MapEditor.svelte`:
- `addZone(tileX, tileY)`: creates a new `ZoneObject` with default values, increments `nextobjectid`, appends to zones layer
- `updateZone(zone)`: finds zone by id in the Zones layer objects array, replaces it
- `deleteZone(zoneId)`: removes zone from the objects array
- `selectedZoneId: number | null` state variable

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification:
- [ ] Clicking on canvas in zone mode creates a colored zone overlay
- [ ] Zone properties panel appears with correct fields for the zone type
- [ ] Changing zone type updates the form fields (e.g., switching to `door` shows `targetMap`, `spawnX`, `spawnY`)
- [ ] eventId dropdown shows known dialogue IDs
- [ ] targetMap dropdown shows known maps
- [ ] Clicking an existing zone selects it and shows its properties
- [ ] Delete button removes the zone from the map
- [ ] Multiple zones of different types can coexist

**Implementation Note**: Pause for manual confirmation.

---

## Phase 5: Import/Export & Toolbar

### Overview
Add the toolbar with new map, load JSON, export JSON functionality, and map settings.

### Changes Required:

#### 1. Toolbar Component

**File**: `src/explorers/editor/Toolbar.svelte`

Toolbar at the top with:
- **New Map** button — opens a small modal/popover to input width and height (in tiles), creates a blank map
- **Load JSON** button — opens file picker (`.json`), reads file, validates, loads into editor
- **Export JSON** button — serializes `mapData` to formatted JSON, triggers download as `<mapName>.json`
- **Map Name** text input (used for export filename and can be shown in title)
- **Map dimensions** display: `28 x 18 tiles`

Props:
- `mapData: TiledMap`
- `mapName: string`
- `onNewMap: (width: number, height: number) => void`
- `onLoadMap: (data: TiledMap) => void`
- `onMapNameChange: (name: string) => void`

#### 2. JSON Import Logic

**File**: `src/explorers/editor/mapImporter.ts`

```typescript
import type { TiledMap } from './types';

export function validateAndParseMap(json: unknown): TiledMap {
  // Validate: has layers array, has correct layer names,
  // has tilesets, tile data arrays match width*height, etc.
  // Throws descriptive error if invalid.
  // Returns typed TiledMap if valid.
}
```

Validation checks:
- `type === 'map'`
- Has `width`, `height` as positive integers
- Has `layers` array with at least Ground + Walls tile layers
- Each tile layer's `data.length === width * height`
- Has at least one tileset entry
- Zone objects have valid `properties` arrays
- Missing optional layers (Above) are created as empty

#### 3. JSON Export Logic

**File**: `src/explorers/editor/mapExporter.ts`

```typescript
import type { TiledMap } from './types';

export function exportMapJSON(map: TiledMap): string {
  // Return pretty-printed JSON matching Tiled format exactly
  return JSON.stringify(map, null, 2);
}

export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

#### 4. Drag-and-Drop Import

In `MapCanvas.svelte`, add drag-and-drop support:
- Listen for `dragover` and `drop` events on the canvas container
- On drop, read the file, parse JSON, validate, and call `onLoadMap`
- Visual feedback: show "Drop JSON file here" overlay during dragover

#### 5. New Map Modal

**File**: `src/explorers/editor/NewMapModal.svelte`

Simple modal/popover with:
- Width input (number, 4–64 range, default 14)
- Height input (number, 4–64 range, default 12)
- Create button
- Cancel button

#### 6. Wire Everything into MapEditor.svelte

Final wiring:
- `mapName` state variable (default: `'new-map'`)
- `createNewMap(w, h)`: resets `mapData` to `createBlankMap(w, h)`, resets selection state
- `loadMap(data)`: sets `mapData` to imported data, resets selection state
- Render `Toolbar` in the top bar area

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`

#### Manual Verification:
- [ ] "New Map" creates a blank canvas with specified dimensions
- [ ] "Load JSON" opens file picker, loads `ship-bridge.json`, and renders all tiles and zones correctly
- [ ] "Export JSON" downloads a valid JSON file
- [ ] Exported JSON can be re-imported into the editor without data loss
- [ ] Drag-and-drop a JSON file onto the canvas loads it
- [ ] Load `ship-hibernation.json` → verify 7 zones visible, tiles match the original
- [ ] Load `ship-corridor.json` → verify doors, triggers visible
- [ ] Create new map → paint some tiles → add zones → export → reload page → import the export → everything matches

**Implementation Note**: Pause for manual confirmation.

---

## Testing Strategy

### Manual Testing Steps:
1. Load each existing map (`ship-hibernation.json`, `ship-corridor.json`, `ship-bridge.json`) and verify visual accuracy
2. Round-trip test: load map → export → diff with original (should be identical or structurally equivalent)
3. Create a new 10x10 map, paint tiles on all 3 layers, add one of each zone type, export, then load the export into the game by registering it
4. Edge cases: 1x1 map, 64x64 map, zone at map boundary, overlapping zones

### Integration Test:
- Take an exported map, place it in `public/game/maps/test-map.json`
- Add it to `MAP_ASSETS` in `AssetManifest.ts`
- Navigate to it in the game and verify tiles render, collisions work, zones trigger correctly

## Performance Considerations

- For maps up to 64x64 (4096 tiles per layer), Canvas2D performance is more than sufficient
- Pre-sliced `ImageBitmap` tiles are GPU-accelerated, drawing 12k tiles (3 layers x 4096) takes < 5ms
- No continuous animation loop needed — redraw only on user interaction

## File Summary

New files to create:
```
src/pages/explorers-editor.astro
src/explorers/editor/MapEditor.svelte
src/explorers/editor/MapCanvas.svelte
src/explorers/editor/TilePalette.svelte
src/explorers/editor/LayerPanel.svelte
src/explorers/editor/ZonePropertiesPanel.svelte
src/explorers/editor/Toolbar.svelte
src/explorers/editor/NewMapModal.svelte
src/explorers/editor/types.ts
src/explorers/editor/mapFactory.ts
src/explorers/editor/tilesetLoader.ts
src/explorers/editor/mapImporter.ts
src/explorers/editor/mapExporter.ts
src/explorers/editor/editorConstants.ts
```

No existing files need modification.
