import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileLevel, serializeMap } from './compile';
import { decompileLevel, gridToText } from './decompile';
import { parseLevelSource } from './parseSource';
import type { TiledMap } from '../../editor/types';

const HERE = dirname(fileURLToPath(import.meta.url));
const LEVELS_DIR = join(HERE, '..');
const MAPS_DIR = join(HERE, '../../../../public/game/maps');
const FIXTURES_DIR = join(HERE, '__fixtures__');

const MIGRATED_MAPS = ['m0-awakening', 'm0-core-ai', 'm0-crew-room', 'm0-exam-room'];

// Subset of MIGRATED_MAPS still comparable against their pre-migration fixtures.
// m0-core-ai was intentionally re-authored after migration (narrowed by one
// column in eacf8230), so its committed map no longer matches the frozen
// pre-migration snapshot — the one-off equivalence guard is obsolete for it.
const MIGRATION_EQUIVALENCE_MAPS = MIGRATED_MAPS.filter((key) => key !== 'm0-core-ai');

function sourceKeys(): string[] {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(LEVELS_DIR, entry.name, 'map.level.yaml')))
    .map((entry) => entry.name)
    .sort();
}

function readSource(mapKey: string) {
  return parseLevelSource(readFileSync(join(LEVELS_DIR, mapKey, 'map.level.yaml'), 'utf-8'), mapKey);
}

function readArtifact(mapKey: string): string {
  return readFileSync(join(MAPS_DIR, `${mapKey}.json`), 'utf-8');
}

describe('map source/artifact sync', () => {
  it('finds the four migrated sources', () => {
    expect(sourceKeys()).toEqual(expect.arrayContaining(MIGRATED_MAPS));
  });

  it.each(sourceKeys())('%s: committed JSON matches its compiled yaml source byte-for-byte', (mapKey) => {
    const compiled = serializeMap(compileLevel(readSource(mapKey), mapKey));
    // Drift gate: edit map.level.yaml + run `npm run levels:build`, never the JSON.
    expect(readArtifact(mapKey)).toBe(compiled);
  });

  it.each(sourceKeys())('%s: decompile(compile(source)) reproduces the source', (mapKey) => {
    const source = readSource(mapKey);
    const { source: roundTripped } = decompileLevel(compileLevel(source, mapKey));
    expect(roundTripped.theme).toBe(source.theme);
    expect(gridToText(roundTripped.cells)).toBe(gridToText(source.cells));
    expect(roundTripped.props).toEqual(source.props);
    expect(roundTripped.zones).toEqual(source.zones);
  });
});

describe('m0 migration equivalence (one-off, against pre-migration fixtures)', () => {
  it.each(MIGRATION_EQUIVALENCE_MAPS)('%s: role grid, props, and zones survived the migration', (mapKey) => {
    const preMigration = JSON.parse(
      readFileSync(join(FIXTURES_DIR, `${mapKey}.pre-migration.json`), 'utf-8'),
    ) as TiledMap;
    const committed = JSON.parse(readArtifact(mapKey)) as TiledMap;

    const before = decompileLevel(preMigration).source;
    const after = decompileLevel(committed).source;

    expect(after.theme).toBe(before.theme);
    expect(gridToText(after.cells)).toBe(gridToText(before.cells));
    expect(after.props).toEqual(before.props);
    expect(after.zones).toEqual(before.zones);
  });
});
