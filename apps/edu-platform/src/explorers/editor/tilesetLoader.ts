import { TILE_SIZE } from '../config/constants';
import { TILESET_COLS, TILESET_TILE_COUNT } from '../config/tileIndices';

const COLUMNS = TILESET_COLS;
const TILE_COUNT = TILESET_TILE_COUNT;

export async function loadTileImages(): Promise<ImageBitmap[]> {
  const img = new Image();
  img.src = '/game/tilesets/placeholder.png';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const tiles: ImageBitmap[] = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const col = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);
    const bitmap = await createImageBitmap(
      img,
      col * TILE_SIZE,
      row * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
    );
    tiles.push(bitmap);
  }
  return tiles;
}
