import { describe, it, expect } from 'vitest';
import {
  TILESET_COLS,
  TILESET_ROWS,
  TILESET_TILE_COUNT,
  THEME_COUNT,
  THEME_BLOCK_SIZE,
  TileRole,
  FLOOR_ROLES,
  BG_ROLES,
  PROP_ROLES,
  WALL_ROLES,
  THEMES,
  tileIndex,
  themeOf,
  roleOf,
} from './tileIndices';

describe('tileset constants', () => {
  it('matches the stacked placeholder.png geometry (512x1536, 6 themes of 8x4)', () => {
    expect(TILESET_COLS).toBe(8);
    expect(TILESET_ROWS).toBe(24);
    expect(TILESET_TILE_COUNT).toBe(192);
    expect(THEME_COUNT * THEME_BLOCK_SIZE).toBe(TILESET_TILE_COUNT);
  });

  it('has metadata for every theme', () => {
    for (let theme = 1; theme <= THEME_COUNT; theme++) {
      expect(THEMES[theme]?.name).toBeTruthy();
    }
  });
});

describe('tileIndex / themeOf / roleOf', () => {
  it('round-trips all themes x roles', () => {
    for (let theme = 1; theme <= THEME_COUNT; theme++) {
      for (let role = 1; role <= THEME_BLOCK_SIZE; role++) {
        const index = tileIndex(theme, role);
        expect(themeOf(index)).toBe(theme);
        expect(roleOf(index)).toBe(role);
      }
    }
  });

  it('covers 1..192 exactly once across all theme/role pairs', () => {
    const seen = new Set<number>();
    for (let theme = 1; theme <= THEME_COUNT; theme++) {
      for (let role = 1; role <= THEME_BLOCK_SIZE; role++) {
        seen.add(tileIndex(theme, role));
      }
    }
    expect(seen.size).toBe(TILESET_TILE_COUNT);
    expect(Math.min(...seen)).toBe(1);
    expect(Math.max(...seen)).toBe(TILESET_TILE_COUNT);
  });

  it('rejects out-of-range inputs', () => {
    expect(() => tileIndex(0, 1)).toThrow();
    expect(() => tileIndex(7, 1)).toThrow();
    expect(() => tileIndex(1, 0)).toThrow();
    expect(() => tileIndex(1, 33)).toThrow();
    expect(() => themeOf(0)).toThrow();
    expect(() => themeOf(193)).toThrow();
    expect(() => roleOf(0)).toThrow();
    expect(() => roleOf(193)).toThrow();
  });
});

describe('role groups', () => {
  it('partition roles 1..32 exactly', () => {
    const all = [...FLOOR_ROLES, ...BG_ROLES, ...PROP_ROLES, ...WALL_ROLES];
    expect(all.length).toBe(THEME_BLOCK_SIZE);
    expect(new Set(all).size).toBe(THEME_BLOCK_SIZE);
    expect([...all].sort((a, b) => a - b)).toEqual(
      Array.from({ length: THEME_BLOCK_SIZE }, (_, i) => i + 1),
    );
  });

  it('agrees with the named TileRole constants', () => {
    expect(FLOOR_ROLES).toContain(TileRole.FLOOR_1);
    expect(BG_ROLES).toContain(TileRole.BG_1);
    expect(PROP_ROLES).toContain(TileRole.PROP_8);
    expect(WALL_ROLES).toContain(TileRole.INNER_SE);
    expect(WALL_ROLES).toContain(TileRole.CORNER_NW);
  });
});
