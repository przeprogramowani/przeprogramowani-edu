/**
 * Semantic tile model for the stacked placeholder tileset.
 *
 * placeholder.png is 512x1536: 6 theme blocks stacked vertically, each block
 * 8 columns x 4 rows (32 tiles). Map data uses absolute indices (firstgid=1,
 * 0 = empty): absolute index = (theme - 1) * THEME_BLOCK_SIZE + role.
 */
export const TILESET_COLS = 8;
export const TILESET_ROWS = 24;
export const TILESET_TILE_COUNT = TILESET_COLS * TILESET_ROWS;
export const THEME_COUNT = 6;
export const THEME_BLOCK_SIZE = 32;

/** Relative indices within one 8x4 theme block (1-based, firstgid=1). */
export const TileRole = {
  // Row 0: outer ring top + backgrounds. The B edge variants are NOT
  // interchangeable cosmetics: N_B/S_B are window art, W_B/E_B are door art.
  CORNER_NW: 1,
  EDGE_N_A: 2,
  EDGE_N_B: 3, // window on a north wall
  CORNER_NE: 4,
  BG_1: 5,
  BG_2: 6,
  BG_3: 7,
  BG_4: 8,

  // Row 1: west/east edges, floors, props 1-4
  EDGE_W_A: 9,
  FLOOR_1: 10,
  FLOOR_2: 11,
  EDGE_E_A: 12,
  PROP_1: 13,
  PROP_2: 14,
  PROP_3: 15,
  PROP_4: 16,

  // Row 2: edge variants, floor variants, props 5-8
  EDGE_W_B: 17, // doorway on a west wall
  FLOOR_3: 18,
  FLOOR_4: 19,
  EDGE_E_B: 20, // doorway on an east wall
  PROP_5: 21,
  PROP_6: 22,
  PROP_7: 23,
  PROP_8: 24,

  // Row 3: outer ring bottom + inner (concave) corners
  CORNER_SW: 25,
  EDGE_S_A: 26,
  EDGE_S_B: 27, // window on a south wall
  CORNER_SE: 28,
  INNER_NW: 29,
  INNER_NE: 30,
  INNER_SW: 31,
  INNER_SE: 32,
} as const;

export type TileRoleName = keyof typeof TileRole;

/** Walkable floor variants (Ground layer). */
export const FLOOR_ROLES: readonly number[] = [
  TileRole.FLOOR_1,
  TileRole.FLOOR_2,
  TileRole.FLOOR_3,
  TileRole.FLOOR_4,
];

/** Decorative void beyond the walls (Ground layer). */
export const BG_ROLES: readonly number[] = [
  TileRole.BG_1,
  TileRole.BG_2,
  TileRole.BG_3,
  TileRole.BG_4,
];

/** Theme-specific prop art, slots 1-8 (Ground or Walls layer per placement). */
export const PROP_ROLES: readonly number[] = [
  TileRole.PROP_1,
  TileRole.PROP_2,
  TileRole.PROP_3,
  TileRole.PROP_4,
  TileRole.PROP_5,
  TileRole.PROP_6,
  TileRole.PROP_7,
  TileRole.PROP_8,
];

/** Structural wall pieces: edges, outer corners, inner corners (Walls layer). */
export const WALL_ROLES: readonly number[] = [
  TileRole.CORNER_NW,
  TileRole.EDGE_N_A,
  TileRole.EDGE_N_B,
  TileRole.CORNER_NE,
  TileRole.EDGE_W_A,
  TileRole.EDGE_E_A,
  TileRole.EDGE_W_B,
  TileRole.EDGE_E_B,
  TileRole.CORNER_SW,
  TileRole.EDGE_S_A,
  TileRole.EDGE_S_B,
  TileRole.CORNER_SE,
  TileRole.INNER_NW,
  TileRole.INNER_NE,
  TileRole.INNER_SW,
  TileRole.INNER_SE,
];

/** Theme metadata for docs, tooling, and renderer labels. */
export const THEMES: Record<number, { name: string }> = {
  1: { name: 'sci-fi' },
  2: { name: 'jungle' },
  3: { name: 'snow' },
  4: { name: 'lava' },
  5: { name: 'desert' },
  6: { name: 'underwater' },
};

/** Absolute tile index for a role within a theme block. */
export function tileIndex(theme: number, role: number): number {
  if (theme < 1 || theme > THEME_COUNT) {
    throw new Error(`Theme out of range: ${theme} (expected 1-${THEME_COUNT})`);
  }
  if (role < 1 || role > THEME_BLOCK_SIZE) {
    throw new Error(`Role out of range: ${role} (expected 1-${THEME_BLOCK_SIZE})`);
  }
  return (theme - 1) * THEME_BLOCK_SIZE + role;
}

/** Theme (1-6) a given absolute tile index belongs to. */
export function themeOf(index: number): number {
  if (index < 1 || index > TILESET_TILE_COUNT) {
    throw new Error(`Tile index out of range: ${index} (expected 1-${TILESET_TILE_COUNT})`);
  }
  return Math.floor((index - 1) / THEME_BLOCK_SIZE) + 1;
}

/** Role (1-32) of a given absolute tile index within its theme block. */
export function roleOf(index: number): number {
  if (index < 1 || index > TILESET_TILE_COUNT) {
    throw new Error(`Tile index out of range: ${index} (expected 1-${TILESET_TILE_COUNT})`);
  }
  return ((index - 1) % THEME_BLOCK_SIZE) + 1;
}
