import type { TiledMap, TileLayer, ObjectLayer } from './types';
import { TILE_SIZE } from '../config/constants';

export function createBlankMap(width: number, height: number): TiledMap {
  const emptyData = () => new Array(width * height).fill(0);

  const ground: TileLayer = {
    data: emptyData(),
    height,
    id: 1,
    name: 'Ground',
    opacity: 1,
    type: 'tilelayer',
    visible: true,
    width,
    x: 0,
    y: 0,
  };
  const walls: TileLayer = {
    data: emptyData(),
    height,
    id: 2,
    name: 'Walls',
    opacity: 1,
    type: 'tilelayer',
    visible: true,
    width,
    x: 0,
    y: 0,
  };
  const above: TileLayer = {
    data: emptyData(),
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
  const zones: ObjectLayer = {
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

  return {
    compressionlevel: -1,
    height,
    infinite: false,
    layers: [ground, walls, above, zones],
    nextlayerid: 5,
    nextobjectid: 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: TILE_SIZE,
    tilesets: [
      {
        columns: 8,
        firstgid: 1,
        image: '../tilesets/placeholder.png',
        imageheight: TILE_SIZE * 4,
        imagewidth: TILE_SIZE * 8,
        margin: 0,
        name: 'placeholder',
        spacing: 0,
        tilecount: 32,
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
