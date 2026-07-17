# Editor Zone Size Controls — 64px Migration Fix

## Overview

Update the zone size dropdowns in the map editor's `ZonePropertiesPanel` to use `TILE_SIZE`-derived values instead of hardcoded `32 / 64 / 96` pixel options. After the 32→64 sprite migration, the current dropdowns offer 0.5 / 1 / 1.5 tile zones — but should offer 1 / 2 / 3 tile zones.

## Current State Analysis

`ZonePropertiesPanel.svelte:132-153` has hardcoded `<option>` values for Width and Height:

```svelte
<option value={32}>32</option>
<option value={64}>64</option>
<option value={96}>96</option>
```

At `TILE_SIZE = 64`, these are 0.5×, 1×, and 1.5× tiles. Existing maps use zones of 64, 128, and 192 pixels (1–3 tiles), so the editor can't produce correct sizes for 2-tile or 3-tile zones.

### Key Discoveries:

- All other editor files already import and use `TILE_SIZE` from `config/constants` — `MapCanvas.svelte:5`, `MapEditor.svelte:13`, `mapFactory.ts:2`, `mapImporter.ts:2`
- New zone creation in `addZone()` already uses `TILE_SIZE` correctly — `MapEditor.svelte:83-86`
- Zone drag snapping uses `TILE_SIZE` correctly — `MapCanvas.svelte:284-286`
- Existing map zones use sizes: 64×64, 128×64, 192×64, 64×128 — all multiples of `TILE_SIZE`

## Desired End State

After this fix:
- Zone Width/Height dropdowns offer 3 options: `TILE_SIZE` (64), `TILE_SIZE * 2` (128), `TILE_SIZE * 3` (192)
- Labels show tile context: "1 tile (64px)", "2 tiles (128px)", "3 tiles (192px)"
- Options automatically adapt if `TILE_SIZE` changes again in the future

### Verification:

- `npm run build` succeeds
- Map editor opens, zone panel renders correctly
- Selecting a zone shows the correct current size highlighted in the dropdown
- Changing width/height updates the zone correctly on canvas
- Exported JSON contains correct pixel dimensions

## What We're NOT Doing

- NOT changing zone drag snapping (already correct)
- NOT changing zone creation defaults (already correct)
- NOT making zone position (X/Y) editable (currently read-only, separate concern)
- NOT touching any game runtime code

## Implementation Approach

Single-phase change to one file: import `TILE_SIZE`, generate option values dynamically.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: Static UI change, no async operations.

### User Experience Specification

- **Dropdown options**: "1 tile (64px)", "2 tiles (128px)", "3 tiles (192px)" for both Width and Height
- **Selection state**: If a zone's current size doesn't match any option (e.g., a legacy 32px zone from old data), the dropdown will show no selection — this is acceptable and signals the user to pick a valid size

### Performance & Optimization Strategy

**N/A**: Three static `<option>` elements per dropdown.

### State Management Sequencing

**N/A**: Simple prop update on change, same pattern as current code.

### Debug & Observability Plan

- **Verification**: Open map editor, load an existing map, select a zone, verify dropdown shows correct current size
- **Edge case**: Create a new zone (should default to 1×1 tile = 64×64), then resize via dropdown

---

## Phase 1: Update Zone Size Dropdowns

### Overview

Replace hardcoded pixel values with `TILE_SIZE`-derived options in `ZonePropertiesPanel.svelte`.

### Changes Required:

#### 1. ZonePropertiesPanel.svelte

**File**: `src/explorers/editor/ZonePropertiesPanel.svelte`

**Change 1** — Add import (after line 1):

```typescript
import { TILE_SIZE } from '../config/constants';
```

**Change 2** — Add a size options array in the `<script>` block:

```typescript
const ZONE_SIZE_OPTIONS = [1, 2, 3].map((n) => ({
  value: TILE_SIZE * n,
  label: `${n} ${n === 1 ? 'tile' : 'tiles'} (${TILE_SIZE * n}px)`,
}));
```

**Change 3** — Replace the Width `<select>` options (lines 137-140):

From:
```svelte
<option value={32}>32</option>
<option value={64}>64</option>
<option value={96}>96</option>
```

To:
```svelte
{#each ZONE_SIZE_OPTIONS as opt}
  <option value={opt.value}>{opt.label}</option>
{/each}
```

**Change 4** — Replace the Height `<select>` options (lines 148-151) with the same `{#each}` block.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds without errors
- [ ] TypeScript type checking passes

#### Manual Verification:

- [ ] Map editor opens without errors
- [ ] Zone Width dropdown shows: "1 tile (64px)", "2 tiles (128px)", "3 tiles (192px)"
- [ ] Zone Height dropdown shows the same three options
- [ ] Selecting a 128×64 zone from an existing map correctly highlights "2 tiles (128px)" in Width and "1 tile (64px)" in Height
- [ ] Changing a zone's size via dropdown updates the canvas rendering immediately
- [ ] Creating a new zone defaults to 1×1 tile (64×64)
- [ ] Exporting after resize produces correct pixel values in JSON

---

## Testing Strategy

### Manual Testing Steps:

1. Open map editor at `/map-editor`
2. Load `m0-awakening.json` (has zones of various sizes)
3. Click on "Info Board" zone (128×64) — verify Width shows "2 tiles (128px)", Height shows "1 tile (64px)"
4. Change Width to "3 tiles (192px)" — verify zone visually widens on canvas
5. Create a new zone — verify it's 64×64 (1 tile × 1 tile)
6. Export map and inspect JSON — verify zone dimensions are correct pixel values

## References

- Research: `thoughts/shared/research/2026-03-24-editor-zone-controls-64px-migration.md`
- Migration plan: `thoughts/shared/plans/2026-03-10-32-to-64-sprite-migration.md`
- Target file: `src/explorers/editor/ZonePropertiesPanel.svelte:129-154`
- Constants: `src/explorers/config/constants.ts:2`
