import { describe, it, expect } from 'vitest';
import { TileRole } from '../../config/tileIndices';
import { backgroundVariant, floorVariant, resolveWallRole, resolveWalls } from './autoTiler';
import { GRID_CHARS } from './types';
import type { CellKind } from './types';

function grid(...rows: string[]): CellKind[][] {
  return rows.map((row) => row.split('').map((char) => GRID_CHARS[char]));
}

function roleAt(cells: CellKind[][], x: number, y: number): number {
  const resolved = resolveWallRole(cells, x, y);
  if ('error' in resolved) {
    throw new Error(`Unexpected error at (${x}, ${y}): ${resolved.error}`);
  }
  return resolved.role;
}

function errorAt(cells: CellKind[][], x: number, y: number): string {
  const resolved = resolveWallRole(cells, x, y);
  if (!('error' in resolved)) {
    throw new Error(`Expected error at (${x}, ${y}), got role ${resolved.role}`);
  }
  return resolved.error;
}

describe('resolveWallRole — rectangular ring', () => {
  //   0123
  // 0 ####
  // 1 #..#
  // 2 #..#
  // 3 ####
  const ring = grid('####', '#..#', '#..#', '####');

  it('resolves outer corners by their diagonal floor neighbor', () => {
    expect(roleAt(ring, 0, 0)).toBe(TileRole.CORNER_NW);
    expect(roleAt(ring, 3, 0)).toBe(TileRole.CORNER_NE);
    expect(roleAt(ring, 0, 3)).toBe(TileRole.CORNER_SW);
    expect(roleAt(ring, 3, 3)).toBe(TileRole.CORNER_SE);
  });

  it('resolves edges to the plain A variant by their single cardinal floor neighbor', () => {
    // B variants are semantic (windows/doors), never emitted for plain walls.
    expect(roleAt(ring, 1, 0)).toBe(TileRole.EDGE_N_A);
    expect(roleAt(ring, 2, 0)).toBe(TileRole.EDGE_N_A);
    expect(roleAt(ring, 1, 3)).toBe(TileRole.EDGE_S_A);
    expect(roleAt(ring, 0, 1)).toBe(TileRole.EDGE_W_A);
    expect(roleAt(ring, 3, 1)).toBe(TileRole.EDGE_E_A);
  });
});

describe('resolveWallRole — windows ("o")', () => {
  //   0123
  // 0 #oo#
  // 1 #..#
  // 2 #..#
  // 3 #o##
  const windowed = grid('#oo#', '#..#', '#..#', '#o##');

  it('renders window art on north/south-facing wall runs', () => {
    expect(roleAt(windowed, 1, 0)).toBe(TileRole.EDGE_N_B);
    expect(roleAt(windowed, 2, 0)).toBe(TileRole.EDGE_N_B);
    expect(roleAt(windowed, 1, 3)).toBe(TileRole.EDGE_S_B);
  });

  it('rejects windows on side walls and corners', () => {
    expect(errorAt(grid('####', 'o..#', '####'), 0, 1)).toMatch(/north\/south-facing/);
    expect(errorAt(grid('####', '#..o', '####'), 3, 1)).toMatch(/north\/south-facing/);
    expect(errorAt(grid('o###', '#..#', '####'), 0, 0)).toMatch(/north\/south-facing/);
  });
});

describe('resolveWallRole — doors ("D")', () => {
  const doorRing = grid('####', 'D..D', 'D..D', '####');

  it('renders explicit doorway art on west/east-facing wall runs', () => {
    expect(roleAt(doorRing, 0, 1)).toBe(TileRole.EDGE_W_B);
    expect(roleAt(doorRing, 0, 2)).toBe(TileRole.EDGE_W_B);
    expect(roleAt(doorRing, 3, 1)).toBe(TileRole.EDGE_E_B);
    expect(roleAt(doorRing, 3, 2)).toBe(TileRole.EDGE_E_B);
  });

  it('rejects doors on north/south wall runs and corners', () => {
    expect(errorAt(grid('#D##', '#..#', '####'), 1, 0)).toMatch(/west\/east-facing/);
    expect(errorAt(grid('D###', '#..#', '####'), 0, 0)).toMatch(/west\/east-facing/);
  });
});

describe('resolveWallRole — L-shaped room', () => {
  //   012345
  // 0 ####~~
  // 1 #..#~~
  // 2 #..###
  // 3 #....#
  // 4 ######
  const lShape = grid('####~~', '#..#~~', '#..###', '#....#', '######');

  it('places the inner elbow on the concave turn', () => {
    // (3,2): floor S and W → elbow in the NE quadrant of the turn.
    expect(roleAt(lShape, 3, 2)).toBe(TileRole.INNER_NE);
  });

  it('keeps outer corners on the convex ring', () => {
    expect(roleAt(lShape, 0, 0)).toBe(TileRole.CORNER_NW);
    expect(roleAt(lShape, 3, 0)).toBe(TileRole.CORNER_NE);
    expect(roleAt(lShape, 5, 2)).toBe(TileRole.CORNER_NE);
    expect(roleAt(lShape, 0, 4)).toBe(TileRole.CORNER_SW);
    expect(roleAt(lShape, 5, 4)).toBe(TileRole.CORNER_SE);
  });

  it('resolves the full grid without errors', () => {
    expect(resolveWalls(lShape, 'test').errors).toEqual([]);
  });
});

describe('resolveWallRole — donut room', () => {
  //   0123456
  // 0 #######
  // 1 #.....#
  // 2 #.###.#
  // 3 #.#~#.#
  // 4 #.###.#
  // 5 #.....#
  // 6 #######
  const donut = grid('#######', '#.....#', '#.###.#', '#.#~#.#', '#.###.#', '#.....#', '#######');

  it('resolves the island ring with elbows facing outward', () => {
    // Island corner (2,2): floor N and W → INNER_SE.
    expect(roleAt(donut, 2, 2)).toBe(TileRole.INNER_SE);
    expect(roleAt(donut, 4, 2)).toBe(TileRole.INNER_SW);
    expect(roleAt(donut, 2, 4)).toBe(TileRole.INNER_NE);
    expect(roleAt(donut, 4, 4)).toBe(TileRole.INNER_NW);
  });

  it('resolves island edge pieces toward their floor side', () => {
    expect([TileRole.EDGE_S_A, TileRole.EDGE_S_B]).toContain(roleAt(donut, 3, 2));
    expect([TileRole.EDGE_N_A, TileRole.EDGE_N_B]).toContain(roleAt(donut, 3, 4));
    expect([TileRole.EDGE_E_A, TileRole.EDGE_E_B]).toContain(roleAt(donut, 2, 3));
    expect([TileRole.EDGE_W_A, TileRole.EDGE_W_B]).toContain(roleAt(donut, 4, 3));
  });

  it('resolves the full grid without errors', () => {
    expect(resolveWalls(donut, 'test').errors).toEqual([]);
  });
});

describe('resolveWallRole — unsupported geometry', () => {
  it('rejects thin walls (floor on both opposite sides)', () => {
    const thin = grid('#####', '#.#.#', '#####');
    expect(errorAt(thin, 2, 1)).toMatch(/thin wall/);
  });

  it('rejects walls not bordering any floor', () => {
    const isolated = grid('##~~', '##~~', '~~~~');
    expect(errorAt(isolated, 0, 0)).toMatch(/does not border any floor/);
  });

  it('rejects ambiguous pillars (2+ diagonal floors, no cardinal)', () => {
    //   012
    // 0 .~.
    // 1 ~#~
    // 2 .~.
    const pillar = grid('.~.', '~#~', '.~.');
    expect(errorAt(pillar, 1, 1)).toMatch(/ambiguous wall pillar/);
  });

  it('rejects free-standing stubs (floor on 3+ sides)', () => {
    const stub = grid('.....', '..#..', '.....');
    expect(errorAt(stub, 2, 1)).toMatch(/free-standing wall stub/);
  });

  it('collects structured errors with coordinates in resolveWalls', () => {
    const stub = grid('.....', '..#..', '.....');
    const { errors } = resolveWalls(stub, 'my-map');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({ level: 'error', mapKey: 'my-map', at: [2, 1] });
  });
});

describe('variant scatter', () => {
  it('is deterministic per (mapKey, x, y)', () => {
    expect(floorVariant('m', 3, 4)).toBe(floorVariant('m', 3, 4));
    expect(backgroundVariant('m', 3, 4)).toBe(backgroundVariant('m', 3, 4));
  });

  it('depends on the map key', () => {
    const picksA = Array.from({ length: 50 }, (_, i) => floorVariant('map-a', i, i * 7));
    const picksB = Array.from({ length: 50 }, (_, i) => floorVariant('map-b', i, i * 7));
    expect(picksA).not.toEqual(picksB);
  });

  it('keeps the plain floor dominant', () => {
    const picks = [];
    for (let x = 0; x < 40; x++) {
      for (let y = 0; y < 40; y++) {
        picks.push(floorVariant('m0-test', x, y));
      }
    }
    const plainShare = picks.filter((role) => role === TileRole.FLOOR_1).length / picks.length;
    expect(plainShare).toBeGreaterThan(0.6);
    expect(plainShare).toBeLessThan(0.8);
    expect(new Set(picks)).toEqual(
      new Set([TileRole.FLOOR_1, TileRole.FLOOR_2, TileRole.FLOOR_3, TileRole.FLOOR_4]),
    );
  });
});
