import { THEME_COUNT } from '../../config/tileIndices';
import { resolveWalls } from './autoTiler';
import type { LevelSource, ValidationContext, ValidationIssue, ZoneSource } from './types';

function error(mapKey: string, message: string, at?: [number, number]): ValidationIssue {
  return { level: 'error', mapKey, message, at };
}

function warning(mapKey: string, message: string, at?: [number, number]): ValidationIssue {
  return { level: 'warning', mapKey, message, at };
}

function inBounds(source: LevelSource, x: number, y: number): boolean {
  return y >= 0 && y < source.cells.length && x >= 0 && x < (source.cells[0]?.length ?? 0);
}

function isFloor(source: LevelSource, x: number, y: number): boolean {
  return inBounds(source, x, y) && source.cells[y][x] === 'FLOOR';
}

/** Walkable = floor without a solid prop on it. */
function isWalkable(source: LevelSource, x: number, y: number): boolean {
  if (!isFloor(source, x, y)) return false;
  return !source.props.some((prop) => prop.solid && prop.at[0] === x && prop.at[1] === y);
}

function doorZones(source: LevelSource): ZoneSource[] {
  return source.zones.filter((zone) => zone.type === 'door');
}

function geometryIssues(source: LevelSource, mapKey: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (source.theme < 1 || source.theme > THEME_COUNT) {
    issues.push(error(mapKey, `theme ${source.theme} out of range 1-${THEME_COUNT}`));
  }

  issues.push(...resolveWalls(source.cells, mapKey).errors);

  for (let y = 0; y < source.cells.length; y++) {
    for (let x = 0; x < source.cells[y].length; x++) {
      if (source.cells[y][x] !== 'FLOOR') continue;
      const leaky = [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
      ].some(([nx, ny]) => !inBounds(source, nx, ny) || source.cells[ny][nx] === 'OUT');
      if (leaky) {
        issues.push(error(mapKey, 'floor cell touches the outside — rooms must be sealed by walls', [x, y]));
      }
    }
  }
  return issues;
}

function propIssues(source: LevelSource, mapKey: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const prop of source.props) {
    const [x, y] = prop.at;
    if (!inBounds(source, x, y)) {
      issues.push(error(mapKey, `prop slot ${prop.slot} is out of bounds`, [x, y]));
    } else if (source.cells[y][x] !== 'FLOOR') {
      issues.push(error(mapKey, `prop slot ${prop.slot} must stand on a floor cell`, [x, y]));
    }
  }
  return issues;
}

function zoneIssues(source: LevelSource, mapKey: string, ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  for (const zone of source.zones) {
    if (seen.has(zone.id)) {
      issues.push(error(mapKey, `duplicate zone id "${zone.id}"`));
    }
    seen.add(zone.id);

    const [x, y] = zone.at;
    const [w, h] = zone.size;
    if (!inBounds(source, x, y) || !inBounds(source, x + w - 1, y + h - 1)) {
      issues.push(error(mapKey, `zone "${zone.id}" extends out of bounds`, [x, y]));
    }

    if (zone.type === 'door') {
      const target = zone.properties.targetMap;
      if (typeof target !== 'string' || target === '') {
        issues.push(error(mapKey, `door "${zone.id}" is missing a targetMap property`, [x, y]));
        continue;
      }
      if (!ctx.knownMaps.has(target)) {
        // Warning, not error: shipped maps gate doors to future content
        // behind flags (e.g. m0-core-ai's prework-door → m1-landing-pad).
        issues.push(warning(mapKey, `door "${zone.id}" targets unknown map "${target}" — future content?`, [x, y]));
        continue;
      }
      const targetSource = ctx.sources.get(target);
      const spawnX = zone.properties.spawnX;
      const spawnY = zone.properties.spawnY;
      if (typeof spawnX !== 'number' || typeof spawnY !== 'number') {
        issues.push(error(mapKey, `door "${zone.id}" is missing int spawnX/spawnY properties`, [x, y]));
      } else if (targetSource && !isWalkable(targetSource, spawnX, spawnY)) {
        issues.push(
          error(
            mapKey,
            `door "${zone.id}" spawns at (${spawnX}, ${spawnY}) in "${target}", which is not walkable floor`,
            [x, y],
          ),
        );
      }
      if (targetSource) {
        const reciprocal = doorZones(targetSource).some((door) => door.properties.targetMap === mapKey);
        if (!reciprocal) {
          issues.push(warning(mapKey, `door "${zone.id}" to "${target}" has no door leading back`, [x, y]));
        }
      }
    }
  }
  return issues;
}

/** Every `D` cell and every door zone must cover each other exactly. */
function doorGlyphIssues(source: LevelSource, mapKey: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const coverage = new Map<string, ZoneSource[]>();

  for (const door of doorZones(source)) {
    if (door.size[0] !== 1) {
      issues.push(error(mapKey, `door "${door.id}" must be one tile wide`, door.at));
    }
    for (let dy = 0; dy < door.size[1]; dy++) {
      for (let dx = 0; dx < door.size[0]; dx++) {
        const x = door.at[0] + dx;
        const y = door.at[1] + dy;
        if (!inBounds(source, x, y)) continue; // zoneIssues reports bounds
        const key = `${x},${y}`;
        const doors = coverage.get(key) ?? [];
        doors.push(door);
        coverage.set(key, doors);
        if (source.cells[y][x] !== 'DOOR') {
          // A solid prop on a floor cell may stand in for the door visual
          // (e.g. a ship-teleport shuttle the player interacts with).
          const propCover =
            source.cells[y][x] === 'FLOOR' &&
            source.props.some((prop) => prop.solid && prop.at[0] === x && prop.at[1] === y);
          if (!propCover) {
            issues.push(error(mapKey, `door "${door.id}" covers "${source.cells[y][x]}" instead of a D cell`, [x, y]));
          }
        }
      }
    }
  }

  for (let y = 0; y < source.cells.length; y++) {
    for (let x = 0; x < source.cells[y].length; x++) {
      if (source.cells[y][x] !== 'DOOR') continue;
      const doors = coverage.get(`${x},${y}`) ?? [];
      if (doors.length === 0) {
        issues.push(error(mapKey, 'D cell is not covered by a door zone', [x, y]));
      } else if (doors.length > 1) {
        issues.push(
          error(mapKey, `D cell is covered by multiple door zones: ${doors.map((door) => door.id).join(', ')}`, [x, y]),
        );
      }
    }
  }
  return issues;
}

function reachabilityIssues(source: LevelSource, mapKey: string, ctx: ValidationContext): ValidationIssue[] {
  const height = source.cells.length;
  const width = source.cells[0]?.length ?? 0;

  // Entry points are spawn targets of doors in other maps that lead here;
  // fall back to the first floor cell when no incoming door exists.
  const starts: [number, number][] = [];
  for (const [otherKey, other] of ctx.sources) {
    if (otherKey === mapKey) continue;
    for (const door of doorZones(other)) {
      if (door.properties.targetMap !== mapKey) continue;
      const spawnX = door.properties.spawnX;
      const spawnY = door.properties.spawnY;
      if (typeof spawnX === 'number' && typeof spawnY === 'number' && isWalkable(source, spawnX, spawnY)) {
        starts.push([spawnX, spawnY]);
      }
    }
  }
  if (starts.length === 0) {
    outer: for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isWalkable(source, x, y)) {
          starts.push([x, y]);
          break outer;
        }
      }
    }
  }
  if (starts.length === 0) return [];

  const visited = new Set<number>();
  const queue = [...starts];
  while (queue.length > 0) {
    const [x, y] = queue.pop()!;
    const key = y * width + x;
    if (visited.has(key)) continue;
    visited.add(key);
    for (const [nx, ny] of [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ]) {
      if (isWalkable(source, nx, ny) && !visited.has(ny * width + nx)) {
        queue.push([nx, ny]);
      }
    }
  }

  const issues: ValidationIssue[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isWalkable(source, x, y) && !visited.has(y * width + x)) {
        issues.push(warning(mapKey, 'floor cell is unreachable from any entry point', [x, y]));
      }
    }
  }
  return issues;
}

function manifestIssues(source: LevelSource, mapKey: string, ctx: ValidationContext): ValidationIssue[] {
  const manifest = ctx.manifests?.get(mapKey);
  if (!manifest) return [];
  const issues: ValidationIssue[] = [];
  const routedZoneIds = new Set(manifest.interactionRoutes.map((route) => route.zoneId));
  const examIds = new Set((manifest.exams ?? []).map((exam) => exam.id));
  const arcadeIds = new Set((manifest.arcadeGames ?? []).map((game) => game.id));

  for (const zone of source.zones) {
    if ((zone.type === 'trigger' || zone.type === 'terminal') && !routedZoneIds.has(zone.id)) {
      // Not an error: GameScene falls back to using the zone id as dialogue id.
      issues.push(warning(mapKey, `zone "${zone.id}" has no interactionRoutes entry in the manifest`, zone.at));
    }
    if (zone.type === 'exam') {
      const examId = zone.properties.examId;
      if (typeof examId !== 'string' || !examIds.has(examId)) {
        issues.push(warning(mapKey, `exam zone "${zone.id}" references missing exam "${String(examId)}"`, zone.at));
      }
    }
    if (zone.type === 'arcade') {
      const arcadeGameId = zone.properties.arcadeGameId;
      if (typeof arcadeGameId !== 'string' || !arcadeIds.has(arcadeGameId)) {
        issues.push(
          warning(mapKey, `arcade zone "${zone.id}" references missing arcade game "${String(arcadeGameId)}"`, zone.at),
        );
      }
    }
  }
  return issues;
}

/** Validate one level source against the shared context. */
export function validateLevel(source: LevelSource, mapKey: string, ctx: ValidationContext): ValidationIssue[] {
  return [
    ...geometryIssues(source, mapKey),
    ...propIssues(source, mapKey),
    ...zoneIssues(source, mapKey, ctx),
    ...doorGlyphIssues(source, mapKey),
    ...reachabilityIssues(source, mapKey, ctx),
    ...manifestIssues(source, mapKey, ctx),
  ];
}

/** Validate every source in the context. */
export function validateAll(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [mapKey, source] of ctx.sources) {
    issues.push(...validateLevel(source, mapKey, ctx));
  }
  return issues;
}
