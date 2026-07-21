import { parse } from 'yaml';
import { THEME_COUNT } from '../../config/tileIndices';
import { slotForAlias } from './propAliases';
import { GRID_CHARS, ZONE_TYPES } from './types';
import type { CellKind, LevelSource, PropPlacement, ZoneSource, ZoneType } from './types';

const PROP_SLOT_COUNT = 8;

function fail(mapKey: string, message: string): never {
  throw new Error(`[${mapKey}] ${message}`);
}

function parseGrid(raw: unknown, mapKey: string): CellKind[][] {
  if (typeof raw !== 'string' || raw.trim() === '') {
    fail(mapKey, 'Missing or empty "grid" (expected a block string using ~ # . o D)');
  }
  const lines = raw.split('\n').filter((line) => line.trim() !== '');
  const width = lines[0].length;
  const cells: CellKind[][] = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    if (line.length !== width) {
      fail(mapKey, `Grid is not rectangular: row ${y} has ${line.length} chars, expected ${width}`);
    }
    const row: CellKind[] = [];
    for (let x = 0; x < line.length; x++) {
      const kind = GRID_CHARS[line[x]];
      if (!kind) {
        fail(mapKey, `Unknown grid char "${line[x]}" at (${x}, ${y}) — allowed: ~ # . o D`);
      }
      row.push(kind);
    }
    cells.push(row);
  }
  return cells;
}

function parseCoords(raw: unknown, what: string, mapKey: string): [number, number] {
  if (
    !Array.isArray(raw) ||
    raw.length !== 2 ||
    !Number.isInteger(raw[0]) ||
    !Number.isInteger(raw[1])
  ) {
    fail(mapKey, `${what} must be a [x, y] pair of integers, got ${JSON.stringify(raw)}`);
  }
  return [raw[0], raw[1]];
}

function parseProp(raw: unknown, index: number, theme: number, mapKey: string): PropPlacement {
  if (!raw || typeof raw !== 'object') {
    fail(mapKey, `props[${index}] must be an object`);
  }
  const obj = raw as Record<string, unknown>;
  let slot: number;
  if (obj.slot !== undefined) {
    if (!Number.isInteger(obj.slot) || (obj.slot as number) < 1 || (obj.slot as number) > PROP_SLOT_COUNT) {
      fail(mapKey, `props[${index}].slot must be 1-${PROP_SLOT_COUNT}, got ${JSON.stringify(obj.slot)}`);
    }
    slot = obj.slot as number;
  } else if (typeof obj.prop === 'string') {
    const resolved = slotForAlias(theme, obj.prop);
    if (resolved === undefined) {
      fail(mapKey, `props[${index}]: unknown prop alias "${obj.prop}" for theme ${theme}`);
    }
    slot = resolved;
  } else {
    fail(mapKey, `props[${index}] needs "slot" (1-${PROP_SLOT_COUNT}) or "prop" (alias)`);
  }
  const at = parseCoords(obj.at, `props[${index}].at`, mapKey);
  if (obj.solid !== undefined && typeof obj.solid !== 'boolean') {
    fail(mapKey, `props[${index}].solid must be a boolean`);
  }
  // Solid by default: most props are physical obstacles (all current maps).
  const solid = (obj.solid as boolean | undefined) ?? true;
  return { slot, at, solid };
}

function parseZone(
  raw: unknown,
  index: number,
  mapKey: string,
  propLocations: ReadonlyMap<string, [number, number]>,
): ZoneSource {
  if (!raw || typeof raw !== 'object') {
    fail(mapKey, `zones[${index}] must be an object`);
  }
  const obj = raw as Record<string, unknown>;
  if (typeof obj.id !== 'string' || obj.id === '') {
    fail(mapKey, `zones[${index}] is missing a string "id"`);
  }
  if (typeof obj.type !== 'string' || !ZONE_TYPES.includes(obj.type as ZoneType)) {
    fail(
      mapKey,
      `zones[${index}] ("${obj.id}") has invalid type ${JSON.stringify(obj.type)} — allowed: ${ZONE_TYPES.join(', ')}`,
    );
  }
  let at: [number, number];
  let propId: string | undefined;
  if (obj.propId !== undefined) {
    if (typeof obj.propId !== 'string' || obj.propId === '') {
      fail(mapKey, `zones[${index}].propId must be a non-empty string`);
    }
    const propAt = propLocations.get(obj.propId);
    if (!propAt) {
      fail(mapKey, `zones[${index}] ("${obj.id}") references unknown propId "${obj.propId}"`);
    }
    propId = obj.propId;
    at = [...propAt];
  } else {
    at = parseCoords(obj.at, `zones[${index}].at`, mapKey);
  }
  const size = obj.size === undefined ? ([1, 1] as [number, number]) : parseCoords(obj.size, `zones[${index}].size`, mapKey);
  if (size[0] < 1 || size[1] < 1) {
    fail(mapKey, `zones[${index}].size must be at least [1, 1]`);
  }
  if (obj.name !== undefined && typeof obj.name !== 'string') {
    fail(mapKey, `zones[${index}].name must be a string`);
  }
  const properties: Record<string, string | number | boolean> = {};
  if (obj.properties !== undefined) {
    if (!obj.properties || typeof obj.properties !== 'object' || Array.isArray(obj.properties)) {
      fail(mapKey, `zones[${index}].properties must be a mapping`);
    }
    for (const [key, value] of Object.entries(obj.properties as Record<string, unknown>)) {
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        fail(mapKey, `zones[${index}].properties.${key} must be a scalar`);
      }
      properties[key] = value;
    }
  }
  return {
    id: obj.id,
    ...(obj.name !== undefined ? { name: obj.name as string } : {}),
    type: obj.type as ZoneType,
    ...(propId !== undefined ? { propId } : {}),
    at,
    size,
    properties,
  };
}

/** Parse and shape-check a map.level.yaml document. Throws on malformed input. */
export function parseLevelSource(yamlText: string, mapKey: string): LevelSource {
  let doc: unknown;
  try {
    doc = parse(yamlText);
  } catch (error) {
    fail(mapKey, `Invalid yaml: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!doc || typeof doc !== 'object') {
    fail(mapKey, 'Source must be a yaml mapping with theme/grid/props/zones');
  }
  const obj = doc as Record<string, unknown>;
  if (!Number.isInteger(obj.theme)) {
    fail(mapKey, `Missing or non-integer "theme" (expected 1-${THEME_COUNT})`);
  }
  const theme = obj.theme as number;
  const cells = parseGrid(obj.grid, mapKey);
  const rawProps = obj.props ?? [];
  if (!Array.isArray(rawProps)) {
    fail(mapKey, '"props" must be a list');
  }
  const rawZones = obj.zones ?? [];
  if (!Array.isArray(rawZones)) {
    fail(mapKey, '"zones" must be a list');
  }
  const props = rawProps.map((prop, index) => parseProp(prop, index, theme, mapKey));
  const propLocations = new Map<string, [number, number]>();
  for (let index = 0; index < rawProps.length; index++) {
    const prop = rawProps[index] as Record<string, unknown>;
    if (prop.id === undefined) continue;
    if (typeof prop.id !== 'string' || prop.id === '') {
      fail(mapKey, `props[${index}].id must be a non-empty string`);
    }
    if (propLocations.has(prop.id)) {
      fail(mapKey, `duplicate prop id "${prop.id}"`);
    }
    propLocations.set(prop.id, props[index].at);
    props[index].id = prop.id;
  }
  return {
    theme,
    cells,
    props,
    zones: rawZones.map((zone, index) => parseZone(zone, index, mapKey, propLocations)),
  };
}
