# Zone Drag-to-Move Implementation Plan

## Overview

Add drag-to-move functionality for existing zones in the map editor. When in Zones mode, clicking an existing zone and dragging repositions it on the map, snapping to the 32px tile grid on release. All zone properties (type, eventId, size, etc.) remain unchanged — only `x` and `y` update.

## Current State Analysis

- Zones are rendered as colored rectangles on `MapCanvas.svelte` (lines 144-168)
- In Zones mode, clicking an existing zone selects it (`onZoneSelect`), clicking empty space creates a new zone (`onZoneClick`)
- Mouse interactions track `isPainting` (tile painting) and `isPanning` (viewport pan) but have no zone-drag state
- Zone hit-testing already exists in `handleMouseDown` (lines 193-208) — iterates zones in reverse to find which zone contains the click point
- Position fields in `ZonePropertiesPanel.svelte` are readonly (lines 112-120)
- The `onUpdate` callback in `MapEditor.svelte` (lines 93-106) already handles full zone replacement with reactivity

### Key Discoveries:

- Hit-test logic at `MapCanvas.svelte:193-208` can be reused for drag initiation
- `screenToTile()` at `MapCanvas.svelte:58-66` converts screen coords to tile coords (already handles pan/zoom)
- `onUpdate(zone)` replaces a zone by ID and triggers Svelte reactivity — perfect for updating position
- Zone creation happens on `mousedown` in empty space, so we need to distinguish "click to create" from "click on existing zone to drag"

## Desired End State

When the Zones layer is active:
1. Clicking an existing zone and dragging moves it in real-time with the cursor
2. On mouse release, position snaps to nearest tile grid (32px)
3. All zone properties remain unchanged — only `x` and `y` update
4. Clicking empty space still creates a new zone (unchanged behavior)
5. Clicking a zone without dragging still selects it (unchanged behavior)

### Verification:
- Create a zone with properties (eventId, targetMap, etc.)
- Drag it to a new location
- Confirm the zone appears at the snapped grid position
- Confirm all properties remain identical in the ZonePropertiesPanel

## What We're NOT Doing

- No drag-to-resize (zones keep width/height as-is)
- No multi-zone selection or multi-drag
- No cursor icon changes (e.g., grab/grabbing cursors)
- No undo/redo for moves
- No boundary clamping (zones can be placed outside visible map area, same as current creation behavior)

## Implementation Approach

All changes are in **MapCanvas.svelte** only. We add drag state tracking and modify mouse event handlers to support the drag lifecycle:

1. `mousedown` on an existing zone → record drag start, select zone
2. `mousemove` while dragging → update zone x/y in real-time (pixel-aligned to cursor)
3. `mouseup` → snap final position to grid, fire `onUpdate`, clear drag state
4. If the mouse didn't move (or moved < 4px), treat it as a click-to-select (not a drag)

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Drag threshold**: A 4px movement threshold distinguishes click-to-select from drag-to-move. Without this, every zone click would initiate a drag.
- **Coordinate space**: During drag, compute zone position in world-space pixels (accounting for pan/zoom via the existing `screenToTile` approach), then update `zone.x` and `zone.y` directly.
- **Snap timing**: Snap to grid only on `mouseup`, not during drag — this gives smooth visual movement.

### State Management Sequencing

- `mousedown` → set `isDraggingZone = true`, record `dragStartX/Y` (screen pixels) and `zoneStartX/Y` (original zone pixel position), select zone
- `mousemove` → if `isDraggingZone`, compute delta in world pixels, update zone position (zoneStart + delta), call `onUpdate` to trigger re-render
- `mouseup` → snap zone.x/y to nearest `TILE_SIZE` multiple, call `onUpdate`, reset drag state
- **Conflict with panning**: Panning uses space+drag or middle-click — these already set `isPanning` before zone logic runs, so no conflict
- **Conflict with zone creation**: Zone creation happens on `mousedown` in empty space. The existing hit-test already distinguishes hitting a zone vs empty space, so creation path is unaffected.

### Performance & Optimization Strategy

- **N/A**: Zone count is small (typically <50), and we're just updating x/y on one object during mousemove. No performance concerns.

### Debug & Observability Plan

- **N/A**: Simple UI interaction, no logging needed. Verify visually.

## Phase 1: Add Zone Drag-to-Move

### Overview

Add drag state, modify mouse handlers, and snap on release — all within `MapCanvas.svelte`.

### Changes Required:

#### 1. MapCanvas.svelte — New drag state variables

Add after existing state variables (around line 56):

```typescript
let isDraggingZone = $state(false);
let dragStartScreenX = 0;
let dragStartScreenY = 0;
let dragZoneStartX = 0;
let dragZoneStartY = 0;
let draggedZoneId: number | null = null;
```

#### 2. MapCanvas.svelte — Modify `handleMouseDown` for zones mode

Current behavior (lines 193-208): hit-test zones, if hit call `onZoneSelect`, else call `onZoneClick`.

New behavior: if hit, also record drag start state. Zone creation in empty space remains unchanged.

```typescript
// In zones mode, within the "zone hit" branch:
if (zone) {
  onZoneSelect(zone.id);
  // Start potential drag
  isDraggingZone = true;
  dragStartScreenX = e.clientX;
  dragStartScreenY = e.clientY;
  dragZoneStartX = zone.x;
  dragZoneStartY = zone.y;
  draggedZoneId = zone.id;
  return;
}
```

#### 3. MapCanvas.svelte — Modify `handleMouseMove` for zone dragging

Add zone drag handling before or after the existing panning/painting logic:

```typescript
if (isDraggingZone && draggedZoneId !== null) {
  const dx = (e.clientX - dragStartScreenX) / zoom;
  const dy = (e.clientY - dragStartScreenY) / zoom;

  // Only start visual drag after threshold
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4 || /* already confirmed dragging */) {
    const zones = mapData.layers[3] as ObjectLayer;
    const zone = zones.objects.find((z) => z.id === draggedZoneId);
    if (zone) {
      zone.x = dragZoneStartX + dx;
      zone.y = dragZoneStartY + dy;
      onUpdate({ ...zone });
    }
  }
  return;
}
```

#### 4. MapCanvas.svelte — Modify `handleMouseUp` for snap and cleanup

```typescript
if (isDraggingZone && draggedZoneId !== null) {
  const zones = mapData.layers[3] as ObjectLayer;
  const zone = zones.objects.find((z) => z.id === draggedZoneId);
  if (zone) {
    // Snap to grid
    zone.x = Math.round(zone.x / TILE_SIZE) * TILE_SIZE;
    zone.y = Math.round(zone.y / TILE_SIZE) * TILE_SIZE;
    onUpdate({ ...zone });
  }
  isDraggingZone = false;
  draggedZoneId = null;
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] In Zones mode, clicking a zone and dragging moves it smoothly
- [ ] On mouse release, zone snaps to 32px grid alignment
- [ ] Zone properties (name, type, eventId, etc.) remain unchanged after move
- [ ] Clicking a zone without moving still selects it (no accidental move)
- [ ] Clicking empty space still creates a new zone
- [ ] Panning (space+drag) still works correctly, doesn't conflict with zone drag
- [ ] Zone rendering updates in real-time during drag
- [ ] Works correctly at different zoom levels

## Testing Strategy

### Manual Testing Steps:

1. Open map editor, load or create a map with zones
2. Switch to Zones layer
3. Create a trigger zone with an eventId set
4. Drag the zone to a new position — verify smooth movement
5. Release — verify it snaps to grid
6. Check ZonePropertiesPanel — all properties should be identical except x/y
7. Try clicking a zone without dragging — should just select, not move
8. Try creating a new zone in empty space — should still work
9. Try panning with space+drag — should pan, not move zones
10. Zoom in/out and repeat drag — should work at all zoom levels

## References

- Zone hit-test: `src/explorers/editor/MapCanvas.svelte:193-208`
- Zone rendering: `src/explorers/editor/MapCanvas.svelte:144-168`
- Zone update callback: `src/explorers/editor/MapEditor.svelte:93-106`
- Screen-to-tile conversion: `src/explorers/editor/MapCanvas.svelte:58-66`
