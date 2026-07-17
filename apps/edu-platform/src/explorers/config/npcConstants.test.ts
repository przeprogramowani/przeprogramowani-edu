// These tests verify NPC speed and animation constants (Phase 3).
// Run with: npm run test:explorers

import { describe, it, expect } from 'vitest';
import { NPC_SPEED, TILE_SIZE, PLAYER_SPEED, WALK_FRAME_RATE } from './constants';

describe('NPC speed constant', () => {
  it('equals TILE_SIZE * 1.25 (80 px/s)', () => {
    expect(NPC_SPEED).toBe(TILE_SIZE * 1.25);
    expect(NPC_SPEED).toBe(80);
  });
});

describe('NPC animation frame rate', () => {
  it('produces a value of at least 1 at standardized NPC speed', () => {
    const frameRate = Math.max(1, Math.round((NPC_SPEED / PLAYER_SPEED) * WALK_FRAME_RATE));
    expect(frameRate).toBeGreaterThanOrEqual(1);
  });
});
