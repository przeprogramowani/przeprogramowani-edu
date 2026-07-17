import {
  PLAYER_BODY_HEIGHT,
  PLAYER_BODY_OFFSET_X,
  PLAYER_BODY_OFFSET_Y,
  PLAYER_BODY_WIDTH,
  PLAYER_FRAME_HEIGHT,
  PLAYER_FRAME_WIDTH,
  TILE_SIZE,
} from '../config/constants';
import type { SpawnCollisionGrid } from './spawnValidation';

export interface ActorPosition {
  x: number;
  y: number;
}

export interface ActorMovementBounds {
  width: number;
  height: number;
  tileSize: number;
  allowed: boolean[][];
}

interface TilePosition {
  x: number;
  y: number;
}

function getBodyRect(position: ActorPosition, tileSize: number) {
  const left = position.x - PLAYER_FRAME_WIDTH / 2 + PLAYER_BODY_OFFSET_X;
  const top = position.y - PLAYER_FRAME_HEIGHT / 2 + PLAYER_BODY_OFFSET_Y;

  return {
    left,
    top,
    right: left + PLAYER_BODY_WIDTH,
    bottom: top + PLAYER_BODY_HEIGHT,
  };
}

function getOccupiedTiles(
  width: number,
  height: number,
  tileSize: number,
  position: ActorPosition,
): TilePosition[] | null {
  const body = getBodyRect(position, tileSize);
  const mapWidthPx = width * tileSize;
  const mapHeightPx = height * tileSize;

  if (body.left < 0 || body.top < 0 || body.right > mapWidthPx || body.bottom > mapHeightPx) {
    return null;
  }

  const startTileX = Math.floor(body.left / tileSize);
  const endTileX = Math.floor((body.right - 1) / tileSize);
  const startTileY = Math.floor(body.top / tileSize);
  const endTileY = Math.floor((body.bottom - 1) / tileSize);
  const occupiedTiles: TilePosition[] = [];

  for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
    for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
      occupiedTiles.push({ x: tileX, y: tileY });
    }
  }

  return occupiedTiles;
}

export function isActorPositionValidInCollisionGrid(
  collisionGrid: SpawnCollisionGrid,
  position: ActorPosition,
): boolean {
  const tileSize = collisionGrid.tileSize ?? TILE_SIZE;
  const occupiedTiles = getOccupiedTiles(collisionGrid.width, collisionGrid.height, tileSize, position);

  if (!occupiedTiles) {
    return false;
  }

  for (const tile of occupiedTiles) {
    if (collisionGrid.collisions[tile.y]?.[tile.x]) {
      return false;
    }
  }

  return true;
}

export function buildActorMovementBounds(
  collisionGrid: SpawnCollisionGrid,
  origin: ActorPosition,
): ActorMovementBounds {
  const tileSize = collisionGrid.tileSize ?? TILE_SIZE;
  const allowed = Array.from({ length: collisionGrid.height }, () => Array(collisionGrid.width).fill(false));
  const occupiedOriginTiles = getOccupiedTiles(collisionGrid.width, collisionGrid.height, tileSize, origin);

  if (!occupiedOriginTiles) {
    return {
      width: collisionGrid.width,
      height: collisionGrid.height,
      tileSize,
      allowed,
    };
  }

  const queue: TilePosition[] = [];

  for (const tile of occupiedOriginTiles) {
    if (collisionGrid.collisions[tile.y]?.[tile.x]) {
      continue;
    }

    if (allowed[tile.y]?.[tile.x]) {
      continue;
    }

    allowed[tile.y][tile.x] = true;
    queue.push(tile);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= collisionGrid.width ||
        neighbor.y >= collisionGrid.height
      ) {
        continue;
      }

      if (collisionGrid.collisions[neighbor.y]?.[neighbor.x] || allowed[neighbor.y]?.[neighbor.x]) {
        continue;
      }

      allowed[neighbor.y][neighbor.x] = true;
      queue.push(neighbor);
    }
  }

  return {
    width: collisionGrid.width,
    height: collisionGrid.height,
    tileSize,
    allowed,
  };
}

export function buildLargestActorMovementBounds(collisionGrid: SpawnCollisionGrid): ActorMovementBounds {
  const tileSize = collisionGrid.tileSize ?? TILE_SIZE;
  const standable = Array.from({ length: collisionGrid.height }, () => Array(collisionGrid.width).fill(false));

  for (let tileY = 0; tileY < collisionGrid.height; tileY += 1) {
    for (let tileX = 0; tileX < collisionGrid.width; tileX += 1) {
      standable[tileY][tileX] = isActorPositionValidInCollisionGrid(collisionGrid, {
        x: tileX * tileSize + tileSize / 2,
        y: tileY * tileSize + tileSize / 2,
      });
    }
  }

  const visited = Array.from({ length: collisionGrid.height }, () => Array(collisionGrid.width).fill(false));
  let largestComponent: TilePosition[] = [];
  let largestComponentScore = 0;

  for (let startY = 0; startY < collisionGrid.height; startY += 1) {
    for (let startX = 0; startX < collisionGrid.width; startX += 1) {
      if (collisionGrid.collisions[startY]?.[startX] || visited[startY][startX]) {
        continue;
      }

      const component: TilePosition[] = [];
      const queue: TilePosition[] = [{ x: startX, y: startY }];
      visited[startY][startX] = true;

      while (queue.length > 0) {
        const current = queue.shift()!;
        component.push(current);

        const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ];

        for (const neighbor of neighbors) {
          if (
            neighbor.x < 0 ||
            neighbor.y < 0 ||
            neighbor.x >= collisionGrid.width ||
            neighbor.y >= collisionGrid.height
          ) {
            continue;
          }

          if (collisionGrid.collisions[neighbor.y]?.[neighbor.x] || visited[neighbor.y][neighbor.x]) {
            continue;
          }

          visited[neighbor.y][neighbor.x] = true;
          queue.push(neighbor);
        }
      }

      const componentScore = component.filter((tile) => standable[tile.y]?.[tile.x]).length;
      if (
        componentScore > largestComponentScore ||
        (componentScore === largestComponentScore && component.length > largestComponent.length)
      ) {
        largestComponent = component;
        largestComponentScore = componentScore;
      }
    }
  }

  const allowed = Array.from({ length: collisionGrid.height }, () => Array(collisionGrid.width).fill(false));
  for (const tile of largestComponent) {
    allowed[tile.y][tile.x] = true;
  }

  return {
    width: collisionGrid.width,
    height: collisionGrid.height,
    tileSize,
    allowed,
  };
}

export function isActorPositionWithinBounds(
  bounds: ActorMovementBounds,
  position: ActorPosition,
): boolean {
  const occupiedTiles = getOccupiedTiles(bounds.width, bounds.height, bounds.tileSize, position);

  if (!occupiedTiles) {
    return false;
  }

  for (const tile of occupiedTiles) {
    if (!bounds.allowed[tile.y]?.[tile.x]) {
      return false;
    }
  }

  return true;
}

export function findNearestActorPositionWithinBounds(
  bounds: ActorMovementBounds,
  position: ActorPosition,
): ActorPosition | null {
  let best: ActorPosition | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let tileY = 0; tileY < bounds.height; tileY += 1) {
    for (let tileX = 0; tileX < bounds.width; tileX += 1) {
      if (!bounds.allowed[tileY]?.[tileX]) {
        continue;
      }

      const candidate = {
        x: tileX * bounds.tileSize + bounds.tileSize / 2,
        y: tileY * bounds.tileSize + bounds.tileSize / 2,
      };

      if (!isActorPositionWithinBounds(bounds, candidate)) {
        continue;
      }

      const dx = candidate.x - position.x;
      const dy = candidate.y - position.y;
      const distance = dx * dx + dy * dy;

      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }

  return best;
}
