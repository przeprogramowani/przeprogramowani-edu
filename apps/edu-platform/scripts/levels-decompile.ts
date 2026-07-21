/**
 * Lift a compiled/hand-authored Tiled JSON map back into a map.level.yaml
 * source.
 *
 * Usage:
 *   npm run levels:decompile -- --full <map-key>        # write the whole yaml source
 *   npm run levels:decompile -- --zones-only <map-key>  # rewrite only the zones: block
 *
 * --zones-only lifts zone edits made in /explorers-editor (exported JSON at
 * public/game/maps/<key>.json, or --from <path>) back into the yaml source,
 * leaving theme/grid/props text untouched. Comments above the zones: block
 * survive; comments inside or below it are not preserved.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { decompileLevel } from '../src/explorers/levels/mapAuthoring/decompile';
import { serializeSource, serializeZones } from '../src/explorers/levels/mapAuthoring/serializeSource';
import type { TiledMap } from '../src/explorers/editor/types';
import { LEVELS_DIR, MAPS_DIR } from './levels-common';

function readMap(mapKey: string): TiledMap {
  const jsonPath = join(MAPS_DIR, `${mapKey}.json`);
  if (!existsSync(jsonPath)) {
    console.error(`No compiled map at public/game/maps/${mapKey}.json`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(jsonPath, 'utf-8')) as TiledMap;
}

function decompileFull(mapKey: string): void {
  const { source, notes } = decompileLevel(readMap(mapKey));
  for (const note of notes) {
    console.log(`  note [${mapKey}] ${note}`);
  }
  const yamlPath = join(LEVELS_DIR, mapKey, 'map.level.yaml');
  mkdirSync(dirname(yamlPath), { recursive: true });
  writeFileSync(yamlPath, serializeSource(source));
  console.log(`Decompiled ${mapKey} → src/explorers/levels/${mapKey}/map.level.yaml`);
}

function decompileZonesOnly(mapKey: string, fromPath: string | null): void {
  const map = fromPath
    ? (JSON.parse(readFileSync(fromPath, 'utf-8')) as TiledMap)
    : readMap(mapKey);
  const { source } = decompileLevel(map);

  const yamlPath = join(LEVELS_DIR, mapKey, 'map.level.yaml');
  if (!existsSync(yamlPath)) {
    console.error(`No yaml source at src/explorers/levels/${mapKey}/map.level.yaml — use --full first.`);
    process.exit(1);
  }

  const existing = readFileSync(yamlPath, 'utf-8');
  const lines = existing.split('\n');
  const zonesStart = lines.findIndex((line) => /^zones:\s*$/.test(line));
  const kept = zonesStart === -1 ? existing : lines.slice(0, zonesStart).join('\n');
  writeFileSync(yamlPath, `${kept.replace(/\n*$/, '\n')}${serializeZones(source.zones)}`);
  console.log(`Updated zones in src/explorers/levels/${mapKey}/map.level.yaml (${source.zones.length} zone(s))`);
}

function main(): void {
  const args = process.argv.slice(2);
  const fullIndex = args.indexOf('--full');
  const zonesIndex = args.indexOf('--zones-only');
  const fromIndex = args.indexOf('--from');
  const fromPath = fromIndex === -1 ? null : args[fromIndex + 1];

  if (fullIndex !== -1 && args[fullIndex + 1]) {
    decompileFull(args[fullIndex + 1]);
  } else if (zonesIndex !== -1 && args[zonesIndex + 1]) {
    decompileZonesOnly(args[zonesIndex + 1], fromPath);
  } else {
    console.error('Usage: levels-decompile --full <map-key> | --zones-only <map-key> [--from <json-path>]');
    process.exit(1);
  }
}

main();
