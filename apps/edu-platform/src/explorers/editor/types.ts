export interface TiledProperty {
  name: string;
  type: 'string' | 'int' | 'float' | 'bool';
  value: string | number | boolean;
}

export interface TileLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: 'tilelayer';
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface ZoneObject {
  id: number;
  name: string;
  type: 'trigger' | 'door' | 'terminal' | 'npc' | 'exam' | 'arcade' | 'navigation';
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  properties: TiledProperty[];
}

export interface ObjectLayer {
  draworder: 'topdown';
  id: number;
  name: 'Zones';
  objects: ZoneObject[];
  opacity: number;
  type: 'objectgroup';
  visible: boolean;
  x: number;
  y: number;
}

export interface TiledMap {
  compressionlevel: -1;
  height: number;
  infinite: false;
  layers: [TileLayer, TileLayer, TileLayer, ObjectLayer];
  nextlayerid: number;
  nextobjectid: number;
  orientation: 'orthogonal';
  renderorder: 'right-down';
  tiledversion: '1.10.2';
  tileheight: number;
  tilesets: [
    {
      columns: 8;
      firstgid: 1;
      image: string;
      imageheight: number;
      imagewidth: number;
      margin: 0;
      name: 'placeholder';
      spacing: 0;
      tilecount: number;
      tileheight: number;
      tilewidth: number;
    },
  ];
  tilewidth: number;
  type: 'map';
  version: '1.10';
  width: number;
}

export type EditorTool = 'grid' | 'props' | 'zones';

export const ZONE_COLORS: Record<ZoneObject['type'], string> = {
  trigger: '#ffb347',
  door: '#00d4aa',
  terminal: '#00d4aa',
  npc: '#e879f9',
  exam: '#a78bfa', // violet
  arcade: '#e67e22', // orange
  navigation: '#3b82f6', // blue
};
