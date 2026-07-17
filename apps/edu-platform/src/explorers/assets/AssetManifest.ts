import { PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT } from '../config/constants';

export interface AssetEntry {
  type: 'image' | 'spritesheet' | 'tilemapJSON';
  key: string;
  url: string;
  frameConfig?: { frameWidth: number; frameHeight: number };
}

export const GLOBAL_ASSETS: AssetEntry[] = [
  {
    type: 'spritesheet',
    key: 'astronaut',
    url: '/game/sprites/astronaut.png',
    frameConfig: { frameWidth: PLAYER_FRAME_WIDTH, frameHeight: PLAYER_FRAME_HEIGHT },
  },
  {
    type: 'image',
    key: 'tileset-placeholder',
    url: '/game/tilesets/placeholder.png',
  },
];

/** Derive map assets from the map key by convention. No manual registry needed. */
export function getMapAssets(mapKey: string): AssetEntry[] {
  return [
    {
      type: 'tilemapJSON',
      key: `map-${mapKey}`,
      url: `/game/maps/${mapKey}.json`,
    },
  ];
}
