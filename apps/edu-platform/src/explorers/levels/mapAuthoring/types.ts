import type { ZoneObject } from '../../editor/types';

/**
 * Classification of a single grid cell in a level source.
 * WINDOW and DOOR are semantic wall cells. Windows are supported on
 * north/south-facing runs; doors are supported on west/east-facing runs.
 */
export type CellKind = 'OUT' | 'WALL' | 'FLOOR' | 'WINDOW' | 'DOOR';

export type ZoneType = ZoneObject['type'];

/** A prop placement from the yaml source. */
export interface PropPlacement {
  /** Optional authoring id, referenceable by zones via propId. Not emitted to Tiled JSON. */
  id?: string;
  /** Prop slot within the theme block, 1-8. */
  slot: number;
  /** Tile coordinates [x, y]. */
  at: [number, number];
  /** true → Walls layer (collides); false → Ground layer (walkable decal). */
  solid: boolean;
}

/** A zone definition from the yaml source. Coordinates are in tiles. */
export interface ZoneSource {
  /** Interaction key — emitted as the `id` string property on the Tiled object. */
  id: string;
  /** Optional editor display name; defaults to the id. */
  name?: string;
  type: ZoneType;
  /**
   * Authoring link to a prop id. When set, `at` mirrors that prop's coordinates
   * (kept resolved so compile/validate need no lookup). Not emitted to Tiled JSON.
   */
  propId?: string;
  at: [number, number];
  size: [number, number];
  /** Extra Tiled properties (targetMap, spawnX, requiredFlags, examId, ...). */
  properties: Record<string, string | number | boolean>;
}

/** Parsed canonical level source (map.level.yaml). */
export interface LevelSource {
  /** Theme 1-6 → tile index offset (theme - 1) * 32. */
  theme: number;
  /** Row-major cell grid, cells[y][x]. */
  cells: CellKind[][];
  props: PropPlacement[];
  zones: ZoneSource[];
}

export interface ValidationIssue {
  level: 'error' | 'warning';
  mapKey: string;
  message: string;
  /** Tile coordinates [x, y] the issue refers to, when applicable. */
  at?: [number, number];
}

/** Context shared across maps for cross-map and manifest validation. */
export interface ValidationContext {
  /** All parsed yaml sources, keyed by map key. */
  sources: ReadonlyMap<string, LevelSource>;
  /** Map keys that exist as compiled JSON or yaml source (door targets may point here). */
  knownMaps: ReadonlySet<string>;
  /** Level manifests for interaction/exam/arcade cross-checks (optional). */
  manifests?: ReadonlyMap<
    string,
    {
      interactionRoutes: { zoneId: string }[];
      exams?: { id: string }[];
      arcadeGames?: { id: string }[];
    }
  >;
}

export const GRID_CHARS: Record<string, CellKind> = {
  '~': 'OUT',
  '#': 'WALL',
  '.': 'FLOOR',
  o: 'WINDOW',
  D: 'DOOR',
};

export const CELL_CHARS: Record<CellKind, string> = {
  OUT: '~',
  WALL: '#',
  FLOOR: '.',
  WINDOW: 'o',
  DOOR: 'D',
};

export const ZONE_TYPES: readonly ZoneType[] = [
  'trigger',
  'door',
  'terminal',
  'npc',
  'exam',
  'arcade',
  'navigation',
  'label',
];
