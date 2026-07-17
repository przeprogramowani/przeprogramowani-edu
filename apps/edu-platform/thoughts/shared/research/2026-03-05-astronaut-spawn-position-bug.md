---
date: 2026-03-05T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: f0dfda764d4eb65cdea1566b82890ddbb381927c
branch: master
repository: przeprogramowani-sites
topic: "Bug: Astronaut spawns outside map walls after browser refresh"
tags: [research, bug, game, spawn, position, coordinates, 10x-explorers]
status: complete
last_updated: 2026-03-05
last_updated_by: Claude Sonnet 4.6
---

# Research: Bug - Astronaut spawns outside map walls after browser refresh

**Date**: 2026-03-05
**Researcher**: Claude Sonnet 4.6
**Git Commit**: f0dfda764d4eb65cdea1566b82890ddbb381927c
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Bug: player is at a certain position, refreshes the browser, and the astronaut spawns outside
the map walls with no way to return. This was reported after staying in one place long enough
for the auto-save to fire.

## Summary

**Root cause: double TILE_SIZE/2 offset caused by coordinate system mismatch between auto-save and spawn logic.**

The auto-save stores `this.player.x` (sprite center in pixels), but the GameScene spawn code
always adds `TILE_SIZE / 2` (16px) to the coordinates assuming they are tile top-left pixel coords.
This causes the player to drift +16px in X and +16px in Y on every refresh after an auto-save.
After enough drifts, the player can end up outside the valid map area.

## Detailed Findings

### The Two Coordinate Systems in Conflict

**Source 1 — Door transition (TransitionScene.ts:55-57):**
Saves tile top-left pixel coordinates:
```typescript
position: {
  x: payload.spawnX * TILE_SIZE,   // e.g. tile 5 → pixel 160
  y: payload.spawnY * TILE_SIZE,
},
```

**Source 2 — Auto-save (GameScene.ts:333):**
Saves sprite CENTER pixel coordinates:
```typescript
position: { x: this.player.x, y: this.player.y },  // e.g. pixel 176 (center of tile 5)
```

**Spawn logic (GameScene.ts:251) — always adds TILE_SIZE/2:**
```typescript
this.player = new Astronaut(this, this.spawnX + TILE_SIZE / 2, this.spawnY + TILE_SIZE / 2, ...);
```

### The Drift Calculation

Example: player standing at tile (5, 3) → pixel center (176, 112).

| Event | State.position.x | Spawns at x |
|-------|-------------------|-------------|
| After door transition | 160 (tile top-left) | 160 + 16 = 176 ✅ |
| After first auto-save + refresh | 176 (sprite center) | 176 + 16 = 192 ❌ (+16px drift) |
| After second auto-save + refresh | 192 | 192 + 16 = 208 ❌ (+16px more) |
| After N refreshes | 160 + N*16 | 160 + (N+1)*16 |

After ~10 refreshes staying in the same area, the player can drift by a full tile (32px).
If near a wall, this pushes them through it. With enough drift, they land outside map bounds.

### No Bounds Validation

There is no validation that `state.position.x/y` falls within the current map's bounds when
the game loads from saved state. Once the player escapes the map, there is no recovery mechanism.
Phaser's `setCollideWorldBounds(true)` only prevents physics movement outside bounds during
gameplay — it does NOT fix an invalid spawn position.

## Code References

- `src/explorers/scenes/GameScene.ts:251` - Spawn adds TILE_SIZE/2 (the problematic assumption)
- `src/explorers/scenes/GameScene.ts:332-335` - Auto-save saves `this.player.x` (sprite center)
- `src/explorers/scenes/TransitionScene.ts:55-57` - Door transition saves tile top-left coords
- `src/explorers/scenes/PreloaderScene.ts:109-113` - Passes state.position directly to GameScene
- `src/explorers/scenes/GameScene.ts:272-273` - World bounds set + `setCollideWorldBounds(true)`
- `src/explorers/state/GameStateManager.ts:5-24` - Default state: `{ x: 2*32, y: 4*32 }` (tile top-left format)

## Architecture Insights

The state's `position` field is supposed to store **tile top-left pixel coordinates** (matching
the door transition and default state format). The auto-save incorrectly stores sprite center
coordinates instead. The invariant is broken every time auto-save fires.

## Proposed Fix

In `GameScene.ts` auto-save callback, subtract `TILE_SIZE / 2` before saving to normalize
back to tile top-left coordinate system:

```typescript
// GameScene.ts ~line 332
this.updateState((s) => ({
  position: {
    x: this.player.x - TILE_SIZE / 2,   // normalize to tile top-left
    y: this.player.y - TILE_SIZE / 2,
  },
  facing: this.player.facing,
}));
```

This makes auto-save consistent with TransitionScene and the default state format,
so `spawn + TILE_SIZE/2` always correctly centers the player.

Additionally, consider adding a position bounds check when loading state:
```typescript
// In PreloaderScene or BootScene: clamp position to valid map bounds before spawning
```

## Open Questions

- Are there other places that save `this.player.x/y` directly without the TILE_SIZE/2 correction?
  (e.g. the `beforeunload` handler in PhaserGame.svelte or the scene shutdown flush)
- Should the default state and all saved positions be migrated to a single canonical format
  (e.g. always sprite-center, or always tile-top-left) with a version migration?
