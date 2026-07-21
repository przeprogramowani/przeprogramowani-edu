import { TILE_SIZE } from '../../config/constants';
import {
  TILESET_COLS,
  TILESET_ROWS,
  TILESET_TILE_COUNT,
  tileIndex,
  TileRole,
} from '../../config/tileIndices';
import type { ObjectLayer, TiledMap, TiledProperty, TileLayer, ZoneObject } from '../../editor/types';
import { groundRoles, resolveWalls } from './autoTiler';
import type { LevelSource, ZoneSource } from './types';

const PROP_SLOT_ROLES = [
  TileRole.PROP_1,
  TileRole.PROP_2,
  TileRole.PROP_3,
  TileRole.PROP_4,
  TileRole.PROP_5,
  TileRole.PROP_6,
  TileRole.PROP_7,
  TileRole.PROP_8,
] as const;

/** Absolute tile index for a prop slot (1-8) within a theme. */
export function propTileIndex(theme: number, slot: number): number {
  return tileIndex(theme, PROP_SLOT_ROLES[slot - 1]);
}

/** Zone property value types: spawnX/spawnY are ints, everything else strings. */
const INT_PROPERTIES = new Set(['spawnX', 'spawnY']);

function zoneProperties(zone: ZoneSource): TiledProperty[] {
  const properties: TiledProperty[] = [
    { name: 'id', type: 'string', value: zone.id },
  ];
  for (const [name, value] of Object.entries(zone.properties)) {
    if (INT_PROPERTIES.has(name)) {
      properties.push({ name, type: 'int', value: Number(value) });
    } else {
      properties.push({ name, type: 'string', value: String(value) });
    }
  }
  return properties;
}

function tileLayer(name: string, id: number, width: number, height: number, data: number[]): TileLayer {
  return {
    data,
    height,
    id,
    name,
    opacity: 1,
    type: 'tilelayer',
    visible: true,
    width,
    x: 0,
    y: 0,
  };
}

/**
 * Compile a parsed level source into the Tiled JSON the Phaser runtime
 * consumes. Deterministic: same source + mapKey → same output object.
 * Throws if the grid has unresolvable wall geometry (run validation first
 * for friendlier reporting).
 */
export function compileLevel(source: LevelSource, mapKey: string): TiledMap {
  const height = source.cells.length;
  const width = source.cells[0]?.length ?? 0;

  const { roles: wallRoles, errors } = resolveWalls(source.cells, mapKey);
  if (errors.length > 0) {
    const first = errors[0];
    throw new Error(
      `[${mapKey}] ${errors.length} unresolvable wall cell(s); first at (${first.at?.[0]}, ${first.at?.[1]}): ${first.message}`,
    );
  }
  const ground: number[] = [];
  const walls: number[] = [];
  const groundVariantRoles = groundRoles(source.cells, mapKey);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ground.push(tileIndex(source.theme, groundVariantRoles[y][x]));
      const wallRole = wallRoles[y][x];
      walls.push(wallRole === null ? 0 : tileIndex(source.theme, wallRole));
    }
  }

  for (const prop of source.props) {
    const [x, y] = prop.at;
    const cellIndex = y * width + x;
    const propIndex = propTileIndex(source.theme, prop.slot);
    if (prop.solid) {
      walls[cellIndex] = propIndex;
    } else {
      ground[cellIndex] = propIndex;
    }
  }

  const zoneObjects: ZoneObject[] = source.zones.map((zone, index) => ({
    height: zone.size[1] * TILE_SIZE,
    id: index + 1,
    name: zone.name ?? zone.id,
    properties: zoneProperties(zone),
    type: zone.type,
    visible: true,
    width: zone.size[0] * TILE_SIZE,
    x: zone.at[0] * TILE_SIZE,
    y: zone.at[1] * TILE_SIZE,
  }));

  const zonesLayer: ObjectLayer = {
    draworder: 'topdown',
    id: 3,
    name: 'Zones',
    objects: zoneObjects,
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0,
  };

  return {
    compressionlevel: -1,
    height,
    infinite: false,
    layers: [
      tileLayer('Ground', 1, width, height, ground),
      tileLayer('Walls', 2, width, height, walls),
      tileLayer('Above', 4, width, height, new Array(width * height).fill(0)),
      zonesLayer,
    ],
    nextlayerid: 5,
    nextobjectid: zoneObjects.length + 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: TILE_SIZE,
    tilesets: [
      {
        columns: TILESET_COLS as 8,
        firstgid: 1,
        image: '../tilesets/placeholder.png',
        imageheight: TILE_SIZE * TILESET_ROWS,
        imagewidth: TILE_SIZE * TILESET_COLS,
        margin: 0,
        name: 'placeholder',
        spacing: 0,
        tilecount: TILESET_TILE_COUNT,
        tileheight: TILE_SIZE,
        tilewidth: TILE_SIZE,
      },
    ],
    tilewidth: TILE_SIZE,
    type: 'map',
    version: '1.10',
    width,
  };
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Canonical byte-stable serialization: alphabetically sorted keys, 2-space
 * indent, trailing newline — the committed artifact style.
 */
export function serializeMap(map: TiledMap): string {
  return `${JSON.stringify(sortKeysDeep(map), null, 2)}\n`;
}
