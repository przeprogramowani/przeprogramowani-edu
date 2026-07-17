---
date: 2026-03-24T00:00:00+01:00
researcher: Claude
git_commit: b024a71e
branch: master
repository: przeprogramowani-sites
topic: "Editor zone controls not updated for 64px tile migration"
tags: [research, codebase, editor, zones, sprite-migration, 64px]
status: complete
last_updated: 2026-03-24
last_updated_by: Claude
---

# Research: Editor Zone Controls Not Updated for 64px Tile Migration

**Date**: 2026-03-24
**Researcher**: Claude
**Git Commit**: b024a71e
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

After the 32→64 sprite migration, the editor's zone size controls in `ZonePropertiesPanel.svelte` still offer hardcoded `32 / 64 / 96` pixel options. With `TILE_SIZE = 64`, these translate to 0.5× / 1× / 1.5× tile — meaning you can create half-tile or 1.5-tile zones but not 2× or 3× tile zones. The zone drag snapping in `MapCanvas.svelte` is fine (already uses `TILE_SIZE`), but the dropdown options need updating.

## Summary

Two issues found in the editor that weren't updated during the 32→64 migration:

1. **Zone size dropdowns** (`ZonePropertiesPanel.svelte:132-153`) — Hardcoded `32 / 64 / 96` pixel values instead of deriving from `TILE_SIZE`. Should offer `TILE_SIZE` multiples: `64 / 128 / 192 / 256`.
2. **Zone size labels** — Show raw pixel values, which are less intuitive now. Could display tile-relative labels (e.g., "1 tile", "2 tiles").

Everything else in the editor already uses `TILE_SIZE` from constants correctly:
- `MapCanvas.svelte` — grid rendering, zone snap-to-grid, tile painting ✓
- `mapFactory.ts` — tileheight/tilewidth use `TILE_SIZE` ✓
- `mapImporter.ts` — uses `TILE_SIZE` for imported maps ✓
- `MapEditor.svelte` — `addZone()` creates zones with `TILE_SIZE` dimensions ✓

## Detailed Findings

### ZonePropertiesPanel.svelte — Hardcoded Size Options

**File**: `src/explorers/editor/ZonePropertiesPanel.svelte:129-154`

The Width and Height dropdowns have three hardcoded options each:

```svelte
<option value={32}>32</option>
<option value={64}>64</option>
<option value={96}>96</option>
```

At `TILE_SIZE = 32`, these meant: 1 tile / 2 tiles / 3 tiles.
At `TILE_SIZE = 64`, these mean: 0.5 tile / 1 tile / 1.5 tiles.

**Impact**: A zone of 32px at 64px tile size is a half-tile zone — unusual and likely unintended. Missing larger sizes (128, 192, 256) means you can't create 2× or 3× tile zones, which are used extensively in existing maps.

### Existing Map Zone Sizes

Current maps already use zones at these 64px-scale sizes:

| Size (px) | Tiles | Usage |
|-----------|-------|-------|
| 64×64     | 1×1   | Most single-tile zones (terminals, doors, NPCs, exams) |
| 128×64    | 2×1   | Info boards, multi-tile interactables |
| 192×64    | 3×1   | CORE AI Module, Study Notes Board |
| 64×128    | 1×2   | Vertical doors (Return Door, CoreAI) |
| 256×64    | 4×1   | (not used yet, but needed for completeness) |

So the dropdown should offer at minimum: **64, 128, 192** (i.e., `TILE_SIZE * 1`, `TILE_SIZE * 2`, `TILE_SIZE * 3`). Ideally also `TILE_SIZE * 4` = 256.

### MapEditor.svelte — New Zone Defaults

**File**: `src/explorers/editor/MapEditor.svelte:78-97`

The `addZone()` function correctly creates new zones at `TILE_SIZE × TILE_SIZE` (line 85-86). ✓

### MapCanvas.svelte — Zone Drag Snapping

**File**: `src/explorers/editor/MapCanvas.svelte:280-293`

Zone drag snapping already uses `TILE_SIZE`:
```typescript
zone.x = Math.round(zone.x / TILE_SIZE) * TILE_SIZE;
zone.y = Math.round(zone.y / TILE_SIZE) * TILE_SIZE;
```
✓ Correct.

## Code References

- `src/explorers/editor/ZonePropertiesPanel.svelte:132-153` — Hardcoded 32/64/96 zone size dropdowns (THE BUG)
- `src/explorers/editor/MapCanvas.svelte:284-286` — Zone snap uses TILE_SIZE (correct)
- `src/explorers/editor/MapEditor.svelte:83-86` — New zone uses TILE_SIZE (correct)
- `src/explorers/config/constants.ts:2` — TILE_SIZE = 64
- `thoughts/shared/plans/2026-03-10-32-to-64-sprite-migration.md` — Original migration plan

## Fix Required

In `ZonePropertiesPanel.svelte`, replace hardcoded pixel values with `TILE_SIZE`-derived options. The component needs to:

1. Import `TILE_SIZE` from `../config/constants`
2. Replace hardcoded `<option value={32}>` etc. with dynamic options based on `TILE_SIZE` multiples
3. Show tile-friendly labels (e.g., "64 (1 tile)", "128 (2 tiles)")

Suggested size options: `TILE_SIZE * 1` through `TILE_SIZE * 4` for both width and height.

## Open Questions

- Should the dropdown also allow `TILE_SIZE * 0.5` (32px) for edge cases, or is that never desired at 64px scale?
- Should zone position (X/Y) also be editable (currently read-only) with tile-snapped increments?
