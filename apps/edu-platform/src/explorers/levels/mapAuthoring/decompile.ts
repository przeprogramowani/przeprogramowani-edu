import { TILE_SIZE } from '../../config/constants';
import {
  BG_ROLES,
  FLOOR_ROLES,
  PROP_ROLES,
  roleOf,
  themeOf,
  TileRole,
  WALL_ROLES,
} from '../../config/tileIndices';
import type { TiledMap, TileLayer, ZoneObject } from '../../editor/types';
import { CELL_CHARS } from './types';
import type {
  CellKind,
  LevelSource,
  PropPlacement,
  ZoneSource,
  ZoneType,
} from './types';

export interface DecompileResult {
  source: LevelSource;
  /** Non-fatal normalizations applied while inverting hand-authored maps. */
  notes: string[];
}

function layerByName(map: TiledMap, name: string): TileLayer {
  const layer = map.layers.find((entry) => entry.type === 'tilelayer' && entry.name === name);
  if (!layer) {
    throw new Error(`Map has no "${name}" tile layer`);
  }
  return layer as TileLayer;
}

function propSlotOf(role: number): number {
  return PROP_ROLES.indexOf(role) + 1;
}

function detectTheme(map: TiledMap): number {
  for (const name of ['Walls', 'Ground']) {
    for (const index of layerByName(map, name).data) {
      if (index > 0) {
        return themeOf(index);
      }
    }
  }
  return 1;
}

function liftZone(obj: ZoneObject): ZoneSource {
  const properties: Record<string, string | number | boolean> = {};
  let id = `zone-${obj.id}`;
  for (const prop of obj.properties ?? []) {
    if (prop.name === 'id' && typeof prop.value === 'string') {
      id = prop.value;
    } else {
      properties[prop.name] = prop.value;
    }
  }
  const zone: ZoneSource = {
    id,
    type: obj.type as ZoneType,
    at: [obj.x / TILE_SIZE, obj.y / TILE_SIZE],
    size: [obj.width / TILE_SIZE, obj.height / TILE_SIZE],
    properties,
  };
  if (obj.name && obj.name !== id) {
    zone.name = obj.name;
  }
  return zone;
}

/**
 * Invert a compiled/hand-authored Tiled map back into a level source.
 * Cell classification is collision-driven: wall tiles on Walls → '#',
 * then floor-role ground → '.', everything else → '~'. Props on Walls
 * are solid, props on Ground are walkable decals.
 */
export function decompileLevel(map: TiledMap): DecompileResult {
  const notes: string[] = [];
  const ground = layerByName(map, 'Ground');
  const walls = layerByName(map, 'Walls');
  const zonesLayer = map.layers.find((entry) => entry.type === 'objectgroup' && entry.name === 'Zones');
  const { width, height } = map;
  const theme = detectTheme(map);
  const liftedObjects = (zonesLayer && 'objects' in zonesLayer ? zonesLayer.objects : []).map(liftZone);
  const liftedDoorObjects = liftedObjects.filter((zone) => zone.type === 'door');
  const doorCells = new Set<string>();
  for (const door of liftedDoorObjects) {
    for (let dy = 0; dy < door.size[1]; dy++) {
      for (let dx = 0; dx < door.size[0]; dx++) {
        doorCells.add(`${door.at[0] + dx},${door.at[1] + dy}`);
      }
    }
  }

  const cells: CellKind[][] = [];
  const props: PropPlacement[] = [];

  for (let y = 0; y < height; y++) {
    const row: CellKind[] = [];
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const wallTile = walls.data[index];
      const groundTile = ground.data[index];
      const wallRole = wallTile > 0 ? roleOf(wallTile) : 0;
      const groundRole = groundTile > 0 ? roleOf(groundTile) : 0;

      if (wallRole !== 0 && WALL_ROLES.includes(wallRole)) {
        // Semantic B variants lift back to their explicit source glyphs when
        // the corresponding object metadata confirms the intent.
        const isWindow = wallRole === TileRole.EDGE_N_B || wallRole === TileRole.EDGE_S_B;
        const isDoor =
          (wallRole === TileRole.EDGE_W_B || wallRole === TileRole.EDGE_E_B) &&
          doorCells.has(`${x},${y}`);
        row.push(isWindow ? 'WINDOW' : isDoor ? 'DOOR' : 'WALL');
        continue;
      }
      if (wallRole !== 0 && PROP_ROLES.includes(wallRole)) {
        props.push({ slot: propSlotOf(wallRole), at: [x, y], solid: true });
        // A solid prop stands on a floor cell; normalize if the ground
        // underneath was hand-painted as background.
        if (!FLOOR_ROLES.includes(groundRole)) {
          notes.push(`(${x}, ${y}): solid prop over non-floor ground normalized to floor`);
        }
        row.push('FLOOR');
        continue;
      }
      if (wallRole !== 0 && BG_ROLES.includes(wallRole)) {
        // Decorative void painted on the Walls layer (hand-authored maps):
        // unreachable filler, so the stray collision it added was inert.
        notes.push(`(${x}, ${y}): background tile on Walls layer treated as outside`);
        row.push('OUT');
        continue;
      }
      if (wallRole !== 0) {
        notes.push(`(${x}, ${y}): unexpected wall-layer tile role ${wallRole} treated as wall`);
        row.push('WALL');
        continue;
      }

      if (groundRole !== 0 && PROP_ROLES.includes(groundRole)) {
        props.push({ slot: propSlotOf(groundRole), at: [x, y], solid: false });
        row.push('FLOOR');
        continue;
      }
      if (groundRole !== 0 && FLOOR_ROLES.includes(groundRole)) {
        row.push('FLOOR');
        continue;
      }
      if (groundRole !== 0 && !BG_ROLES.includes(groundRole)) {
        notes.push(`(${x}, ${y}): unexpected ground tile role ${groundRole} treated as outside`);
      }
      row.push('OUT');
    }
    cells.push(row);
  }

  return { source: { theme, cells, props, zones: liftedObjects }, notes };
}

/** Render the cell grid back to its ASCII form (rows joined by newlines). */
export function gridToText(cells: CellKind[][]): string {
  return cells.map((row) => row.map((cell) => CELL_CHARS[cell]).join('')).join('\n');
}
