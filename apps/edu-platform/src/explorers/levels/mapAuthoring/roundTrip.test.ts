import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileLevel, serializeMap } from './compile';
import { parseLevelSource } from './parseSource';
import { serializeSource } from './serializeSource';

const HERE = dirname(fileURLToPath(import.meta.url));
const LEVELS_DIR = join(HERE, '..');

function sourceKeys(): string[] {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(LEVELS_DIR, entry.name, 'map.level.yaml')))
    .map((entry) => entry.name)
    .sort();
}

function readYaml(mapKey: string): string {
  return readFileSync(join(LEVELS_DIR, mapKey, 'map.level.yaml'), 'utf-8');
}

// The editor saves serializeSource(parse(yaml)) back to disk, so a lossless
// parse -> serialize -> parse cycle is a hard requirement. Byte-equal yaml is
// NOT required — hand-written files aren't canonical; the first save
// canonicalizes formatting, which must stay compile-neutral.
describe('level source round-trip (parse -> serialize -> parse)', () => {
  it.each(sourceKeys())('%s: reparse of the serialized source deep-equals the original parse', (mapKey) => {
    const source = parseLevelSource(readYaml(mapKey), mapKey);
    const reparsed = parseLevelSource(serializeSource(source), mapKey);
    expect(reparsed).toEqual(source);
  });

  it.each(sourceKeys())('%s: canonicalized source compiles to a byte-identical artifact', (mapKey) => {
    const source = parseLevelSource(readYaml(mapKey), mapKey);
    const reparsed = parseLevelSource(serializeSource(source), mapKey);
    expect(serializeMap(compileLevel(reparsed, mapKey))).toBe(serializeMap(compileLevel(source, mapKey)));
  });
});
