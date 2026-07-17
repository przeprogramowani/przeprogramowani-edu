/** Tile indices as they appear in map data (firstgid=1). 0 = empty. */
export const TileIndex = {
  // Row 0: Floors (Ground layer)
  FLOOR_CLEAN: 1,
  FLOOR_VARIANT: 2,
  FLOOR_GRATED: 3,
  FLOOR_AMBER: 4,

  // Row 1: Wall edges + outer corners (Walls layer)
  EDGE_S: 9,
  EDGE_N: 10,
  EDGE_E: 11,
  EDGE_W: 12,
  CORNER_SE: 13,
  CORNER_SW: 14,
  CORNER_NE: 15,
  CORNER_NW: 16,

  // Row 2: Inner corners + T-junctions (Walls layer)
  INNER_SE: 17,
  INNER_SW: 18,
  INNER_NE: 19,
  INNER_NW: 20,
  TEE_N: 21,
  TEE_S: 22,
  TEE_E: 23,
  TEE_W: 24,

  // Row 3: Solid + Special
  WALL_SOLID: 25,
  WALL_VERT_PASS: 26,
  WALL_HORIZ_PASS: 27,
  SPACE_VOID: 28,
  WINDOW: 29,
  DOOR_TILE: 30,
  PIPE_HORIZ: 31,
  PIPE_VERT: 32,
} as const;

export const TILESET_COLS = 8;
export const TILESET_ROWS = 4;
export const TILESET_TILE_COUNT = TILESET_COLS * TILESET_ROWS;
