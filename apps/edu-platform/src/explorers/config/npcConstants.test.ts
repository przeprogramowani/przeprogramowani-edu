// These tests verify NPC speed and animation constants (Phase 3).
// Run with: npm run test:explorers

import { describe, it, expect } from 'vitest';
import {
  NPC_SPEED,
  NPC_COLOR_VARIANTS,
  NPC_SPRITE_COLS,
  NPC_TYPE_ROWS,
  TILE_SIZE,
  PLAYER_SPEED,
  WALK_FRAME_RATE,
} from './constants';

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

describe('NPC spritesheet layout', () => {
  it('maps the four character blocks in left-to-right order', () => {
    expect(NPC_TYPE_ROWS).toEqual({
      scientist: 0,
      alien: 1,
      robot: 2,
      orb: 3,
    });
    expect(NPC_SPRITE_COLS).toBe(16);
  });
});

describe('NPC color variants', () => {
  it('defines the named variants available to map authors', () => {
    expect(NPC_COLOR_VARIANTS).toEqual({
      'jungle-dark-green': { color: 0x8fa383, mode: 'multiply' },
      'hologram-blue': { color: 0x66ccff, mode: 'multiply' },
      'hologram-green': { color: 0x66ff99, mode: 'multiply' },
      'hologram-magenta': { color: 0xff66cc, mode: 'multiply' },
      'hologram-blue-add': { color: 0x66ccff, mode: 'multiply', blendMode: 'add' },
      'hologram-blue-screen': { color: 0x66ccff, mode: 'multiply', blendMode: 'screen' },
    });
  });
});
