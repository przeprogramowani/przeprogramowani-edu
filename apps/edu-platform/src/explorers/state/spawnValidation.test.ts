import { describe, expect, it } from 'vitest';
import { isSpawnPositionValid, sanitizeSpawnPosition, type SpawnCollisionGrid } from './spawnValidation';

function createRoomGrid(): SpawnCollisionGrid {
  return {
    width: 5,
    height: 5,
    collisions: [
      [true, true, true, true, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, true, true, true, true],
    ],
  };
}

describe('spawnValidation', () => {
  it('accepts already-walkable spawn positions', () => {
    const grid = createRoomGrid();
    const position = { x: 64, y: 64 };

    expect(isSpawnPositionValid(grid, position)).toBe(true);
    expect(sanitizeSpawnPosition(grid, position)).toEqual({
      position,
      corrected: false,
    });
  });

  it('moves an out-of-bounds spawn back to the nearest open tile', () => {
    const grid = createRoomGrid();

    expect(isSpawnPositionValid(grid, { x: -32, y: 64 })).toBe(false);
    expect(sanitizeSpawnPosition(grid, { x: -32, y: 64 })).toEqual({
      position: { x: 64, y: 64 },
      corrected: true,
    });
  });

  it('moves a blocked spawn onto the nearest walkable tile', () => {
    const grid = createRoomGrid();

    expect(isSpawnPositionValid(grid, { x: 0, y: 64 })).toBe(false);
    expect(sanitizeSpawnPosition(grid, { x: 0, y: 64 })).toEqual({
      position: { x: 64, y: 64 },
      corrected: true,
    });
  });
});
