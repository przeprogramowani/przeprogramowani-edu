import { TileRole } from '../../config/tileIndices';
import type { CellKind, ValidationIssue } from './types';

/**
 * Auto-tiling: resolve every wall cell to a concrete tile role and pick
 * floor/background variants deterministically. Everything here works in
 * theme-relative roles (1-32); the compiler applies the theme offset.
 *
 * Edge B variants are semantic, not cosmetic: N_B/S_B are window art
 * (author-controlled via "o"), W_B/E_B are doorway art (via "D").
 */

function kindAt(cells: CellKind[][], x: number, y: number): CellKind {
  // Everything outside the grid counts as OUT.
  return cells[y]?.[x] ?? 'OUT';
}

/** WALL, WINDOW, and DOOR cells share the same wall geometry rules. */
export function isWallCell(kind: CellKind): boolean {
  return kind === 'WALL' || kind === 'WINDOW' || kind === 'DOOR';
}

/** FNV-1a 32-bit hash — the deterministic seed for variant scatter. */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** Floor variant for a cell: plain FLOOR_1 ~70%, each decorated variant ~10%. */
export function floorVariant(mapKey: string, x: number, y: number): number {
  const bucket = fnv1a(`${mapKey}:floor:${x}:${y}`) % 10;
  if (bucket <= 6) return TileRole.FLOOR_1;
  if (bucket === 7) return TileRole.FLOOR_2;
  if (bucket === 8) return TileRole.FLOOR_3;
  return TileRole.FLOOR_4;
}

/** Background variant for a cell: BG_1 dominant, others sprinkled in. */
export function backgroundVariant(mapKey: string, x: number, y: number): number {
  const bucket = fnv1a(`${mapKey}:bg:${x}:${y}`) % 10;
  if (bucket <= 6) return TileRole.BG_1;
  if (bucket === 7) return TileRole.BG_2;
  if (bucket === 8) return TileRole.BG_3;
  return TileRole.BG_4;
}

/**
 * Resolve one WALL cell to a role via the neighbor decision table.
 * Returns a role (1-32) or an error message for unsupported geometry.
 */
export function resolveWallRole(
  cells: CellKind[][],
  x: number,
  y: number,
): { role: number } | { error: string } {
  const north = kindAt(cells, x, y - 1) === 'FLOOR';
  const south = kindAt(cells, x, y + 1) === 'FLOOR';
  const west = kindAt(cells, x - 1, y) === 'FLOOR';
  const east = kindAt(cells, x + 1, y) === 'FLOOR';
  const cardinalCount = Number(north) + Number(south) + Number(west) + Number(east);
  const isWindow = kindAt(cells, x, y) === 'WINDOW';
  const isDoor = kindAt(cells, x, y) === 'DOOR';

  if (isWindow && !((cardinalCount === 1 && (north || south)) || cardinalCount === 0)) {
    return { error: 'window ("o") is only supported on north/south-facing wall runs' };
  }
  if (isDoor && !(cardinalCount === 1 && (east || west))) {
    return { error: 'door ("D") is only supported on west/east-facing wall runs' };
  }

  if (cardinalCount >= 3) {
    return { error: 'free-standing wall stub (floor on 3+ sides) is unsupported' };
  }

  if (cardinalCount === 2) {
    if ((north && south) || (east && west)) {
      return { error: 'thin wall (floor on both opposite sides) is unsupported — walls need 2 tiles' };
    }
    // Inner (concave) corner: the elbow occupies the named quadrant.
    if (south && east) return { role: TileRole.INNER_NW };
    if (south && west) return { role: TileRole.INNER_NE };
    if (north && east) return { role: TileRole.INNER_SW };
    return { role: TileRole.INNER_SE }; // north && west
  }

  if (cardinalCount === 1) {
    // Semantic B variants are selected explicitly by the source glyph.
    if (south) return { role: isWindow ? TileRole.EDGE_N_B : TileRole.EDGE_N_A };
    if (north) return { role: isWindow ? TileRole.EDGE_S_B : TileRole.EDGE_S_A };
    if (east) return { role: isDoor ? TileRole.EDGE_W_B : TileRole.EDGE_W_A };
    return { role: isDoor ? TileRole.EDGE_E_B : TileRole.EDGE_E_A }; // west
  }

  // No cardinal floor neighbors: outer (convex) corner, identified by its
  // single diagonal floor neighbor.
  const nw = kindAt(cells, x - 1, y - 1) === 'FLOOR';
  const ne = kindAt(cells, x + 1, y - 1) === 'FLOOR';
  const sw = kindAt(cells, x - 1, y + 1) === 'FLOOR';
  const se = kindAt(cells, x + 1, y + 1) === 'FLOOR';
  const diagonalCount = Number(nw) + Number(ne) + Number(sw) + Number(se);

  if (isWindow && diagonalCount > 0) {
    return { error: 'window ("o") is only supported on north/south-facing wall runs' };
  }
  if (diagonalCount === 0) {
    return { error: 'wall does not border any floor — use "~" for outside filler' };
  }
  if (diagonalCount >= 2) {
    return { error: 'ambiguous wall pillar (floor on 2+ diagonals, none adjacent) is unsupported' };
  }
  if (se) return { role: TileRole.CORNER_NW };
  if (sw) return { role: TileRole.CORNER_NE };
  if (ne) return { role: TileRole.CORNER_SW };
  return { role: TileRole.CORNER_SE }; // nw
}

/**
 * Resolve all WALL cells. Returns a role grid (null for non-wall cells) plus
 * structured errors for unsupported wall geometry.
 */
export function resolveWalls(
  cells: CellKind[][],
  mapKey: string,
): { roles: (number | null)[][]; errors: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const roles = cells.map((row, y) =>
    row.map((cell, x) => {
      if (!isWallCell(cell)) return null;
      const resolved = resolveWallRole(cells, x, y);
      if ('error' in resolved) {
        errors.push({ level: 'error', mapKey, message: resolved.error, at: [x, y] });
        return null;
      }
      return resolved.role;
    }),
  );
  return { roles, errors };
}

/** Ground layer roles: floor variants under FLOOR, background under walls/OUT. */
export function groundRoles(cells: CellKind[][], mapKey: string): number[][] {
  return cells.map((row, y) =>
    row.map((cell, x) =>
      cell === 'FLOOR' ? floorVariant(mapKey, x, y) : backgroundVariant(mapKey, x, y),
    ),
  );
}
