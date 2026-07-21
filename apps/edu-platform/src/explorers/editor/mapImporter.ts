import type { TiledMap, TileLayer, ObjectLayer } from './types';
import { TILE_SIZE } from '../config/constants';
import { TILESET_COLS, TILESET_ROWS, TILESET_TILE_COUNT } from '../config/tileIndices';

export function validateAndParseMap(json: unknown): TiledMap {
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid JSON: not an object');
  }

  const obj = json as Record<string, unknown>;

  if (obj.type !== 'map') {
    throw new Error('Invalid map: missing type "map"');
  }

  const width = obj.width as number;
  const height = obj.height as number;
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) {
    throw new Error(`Invalid map dimensions: ${width}x${height}`);
  }

  if (!Array.isArray(obj.layers)) {
    throw new Error('Invalid map: missing layers array');
  }

  const expectedSize = width * height;
  const layers = obj.layers as Record<string, unknown>[];

  // Find required layers
  let ground: TileLayer | null = null;
  let walls: TileLayer | null = null;
  let above: TileLayer | null = null;
  let zones: ObjectLayer | null = null;

  for (const layer of layers) {
    if (layer.type === 'tilelayer') {
      const tl = layer as unknown as TileLayer;
      if (!Array.isArray(tl.data)) {
        throw new Error(`Layer "${tl.name}" has no data array`);
      }
      if (tl.data.length !== expectedSize) {
        throw new Error(
          `Layer "${tl.name}" data length ${tl.data.length} doesn't match ${width}x${height}=${expectedSize}`,
        );
      }
      if (tl.name === 'Ground') ground = tl;
      else if (tl.name === 'Walls') walls = tl;
      else if (tl.name === 'Above') above = tl;
    } else if (layer.type === 'objectgroup') {
      const ol = layer as unknown as ObjectLayer;
      if (ol.name === 'Zones') {
        // Ensure objects have properties arrays
        if (Array.isArray(ol.objects)) {
          for (const zoneObj of ol.objects) {
            if (!Array.isArray(zoneObj.properties)) {
              zoneObj.properties = [];
            }
          }
        }
        zones = ol;
      }
    }
  }

  if (!ground) throw new Error('Missing required "Ground" tile layer');
  if (!walls) throw new Error('Missing required "Walls" tile layer');

  // Create empty Above layer if missing
  if (!above) {
    above = {
      data: new Array(expectedSize).fill(0),
      height,
      id: 4,
      name: 'Above',
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      width,
      x: 0,
      y: 0,
    };
  }

  // Create empty Zones layer if missing
  if (!zones) {
    zones = {
      draworder: 'topdown',
      id: 3,
      name: 'Zones',
      objects: [],
      opacity: 1,
      type: 'objectgroup',
      visible: true,
      x: 0,
      y: 0,
    };
  }

  if (!Array.isArray(obj.tilesets) || obj.tilesets.length === 0) {
    throw new Error('Missing tilesets array');
  }

  return {
    compressionlevel: -1,
    height,
    infinite: false,
    layers: [ground, walls, above, zones],
    nextlayerid: (obj.nextlayerid as number) ?? 5,
    nextobjectid: (obj.nextobjectid as number) ?? 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: TILE_SIZE,
    tilesets: (obj.tilesets as TiledMap['tilesets']) ?? [
      {
        columns: TILESET_COLS,
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
  } as TiledMap;
}
