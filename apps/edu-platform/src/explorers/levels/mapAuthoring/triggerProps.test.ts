import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseLevelSource } from './parseSource';

const LEVELS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');

function sourceKeys(): string[] {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(LEVELS_DIR, entry.name, 'map.level.yaml')))
    .map((entry) => entry.name)
    .sort();
}

function readSource(mapKey: string) {
  return parseLevelSource(readFileSync(join(LEVELS_DIR, mapKey, 'map.level.yaml'), 'utf-8'), mapKey);
}

describe('trigger zone props', () => {
  it.each(sourceKeys())('%s: every trigger zone is backed by a prop', (mapKey) => {
    const source = readSource(mapKey);
    const propCoordinates = new Set(source.props.map((prop) => prop.at.join(',')));
    const propLessTriggers = source.zones
      .filter(
        (zone) =>
          zone.type === 'trigger' &&
          zone.propId === undefined &&
          !propCoordinates.has(zone.at.join(',')),
      )
      .map((zone) => `${zone.id} @ [${zone.at.join(', ')}]`);

    expect(
      propLessTriggers,
      `Trigger zones in "${mapKey}" must use propId or share coordinates with a prop`,
    ).toEqual([]);
  });
});
