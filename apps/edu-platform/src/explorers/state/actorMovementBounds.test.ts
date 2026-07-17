import { describe, expect, it } from 'vitest';
import {
  buildActorMovementBounds,
  buildLargestActorMovementBounds,
  findNearestActorPositionWithinBounds,
  isActorPositionWithinBounds,
} from './actorMovementBounds';
import type { SpawnCollisionGrid } from './spawnValidation';

function createSeparatedAreaGrid(): SpawnCollisionGrid {
  return {
    width: 5,
    height: 5,
    collisions: [
      [false, false, false, false, false],
      [true, true, true, true, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, true, true, true, true],
    ],
  };
}

describe('actorMovementBounds', () => {
  it('accepts positions inside the spawn-connected room', () => {
    const bounds = buildActorMovementBounds(createSeparatedAreaGrid(), { x: 96, y: 160 });

    expect(isActorPositionWithinBounds(bounds, { x: 96, y: 160 })).toBe(true);
    expect(isActorPositionWithinBounds(bounds, { x: 160, y: 160 })).toBe(true);
  });

  it('rejects open tiles outside the spawn-connected room when a wall separates them', () => {
    const bounds = buildActorMovementBounds(createSeparatedAreaGrid(), { x: 96, y: 160 });

    expect(isActorPositionWithinBounds(bounds, { x: 96, y: 24 })).toBe(false);
  });

  it('uses the largest standable connected area as playable bounds', () => {
    const bounds = buildLargestActorMovementBounds(createSeparatedAreaGrid());

    expect(isActorPositionWithinBounds(bounds, { x: 96, y: 160 })).toBe(true);
    expect(isActorPositionWithinBounds(bounds, { x: 96, y: 24 })).toBe(false);
  });

  it('finds the nearest position inside playable bounds', () => {
    const bounds = buildLargestActorMovementBounds(createSeparatedAreaGrid());

    expect(findNearestActorPositionWithinBounds(bounds, { x: 96, y: 24 })).toEqual({ x: 96, y: 160 });
  });
});
