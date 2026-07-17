import {
  PLAYER_BODY_HEIGHT,
  PLAYER_BODY_OFFSET_X,
  PLAYER_BODY_OFFSET_Y,
  PLAYER_BODY_WIDTH,
  PLAYER_FRAME_HEIGHT,
  PLAYER_FRAME_WIDTH,
  TILE_SIZE,
} from '../config/constants';

export interface SpawnPosition {
  x: number;
  y: number;
}

export interface SpawnCollisionGrid {
  width: number;
  height: number;
  collisions: boolean[][];
  tileSize?: number;
}

function getBodyRect(position: SpawnPosition, tileSize: number) {
  const spriteCenterX = position.x + tileSize / 2;
  const spriteCenterY = position.y + tileSize / 2;
  const left = spriteCenterX - PLAYER_FRAME_WIDTH / 2 + PLAYER_BODY_OFFSET_X;
  const top = spriteCenterY - PLAYER_FRAME_HEIGHT / 2 + PLAYER_BODY_OFFSET_Y;

  return {
    left,
    top,
    right: left + PLAYER_BODY_WIDTH,
    bottom: top + PLAYER_BODY_HEIGHT,
  };
}

export function isSpawnPositionValid(grid: SpawnCollisionGrid, position: SpawnPosition): boolean {
  const tileSize = grid.tileSize ?? TILE_SIZE;
  const mapWidthPx = grid.width * tileSize;
  const mapHeightPx = grid.height * tileSize;
  const body = getBodyRect(position, tileSize);

  if (body.left < 0 || body.top < 0 || body.right > mapWidthPx || body.bottom > mapHeightPx) {
    return false;
  }

  const startTileX = Math.floor(body.left / tileSize);
  const endTileX = Math.floor((body.right - 1) / tileSize);
  const startTileY = Math.floor(body.top / tileSize);
  const endTileY = Math.floor((body.bottom - 1) / tileSize);

  for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
    for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
      if (grid.collisions[tileY]?.[tileX]) {
        return false;
      }
    }
  }

  return true;
}

export function sanitizeSpawnPosition(grid: SpawnCollisionGrid, position: SpawnPosition): {
  position: SpawnPosition;
  corrected: boolean;
} {
  if (isSpawnPositionValid(grid, position)) {
    return { position, corrected: false };
  }

  const tileSize = grid.tileSize ?? TILE_SIZE;
  const maxX = Math.max(0, grid.width * tileSize - tileSize);
  const maxY = Math.max(0, grid.height * tileSize - tileSize);
  const anchorX = Math.min(Math.max(position.x, 0), maxX);
  const anchorY = Math.min(Math.max(position.y, 0), maxY);

  let best: SpawnPosition | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let tileY = 0; tileY < grid.height; tileY += 1) {
    for (let tileX = 0; tileX < grid.width; tileX += 1) {
      const candidate = {
        x: tileX * tileSize,
        y: tileY * tileSize,
      };

      if (!isSpawnPositionValid(grid, candidate)) {
        continue;
      }

      const dx = candidate.x - anchorX;
      const dy = candidate.y - anchorY;
      const distance = dx * dx + dy * dy;

      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }

  return {
    position: best ?? { x: 0, y: 0 },
    corrected: true,
  };
}
