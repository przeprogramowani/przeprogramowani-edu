/**
 * Compile map.level.yaml sources into the Tiled JSON artifacts the game
 * loads from public/game/maps/. Validates everything first and refuses to
 * write when any source has errors.
 *
 * Usage:
 *   npm run levels:build             # build all sources
 *   npm run levels:build -- --map m0-awakening
 */
import { writeFileSync } from 'node:fs';
import { compileLevel, serializeMap } from '../src/explorers/levels/mapAuthoring/compile';
import { discoverSources, loadAndValidate } from './levels-common';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mapFlagIndex = args.indexOf('--map');
  const onlyMap = mapFlagIndex === -1 ? null : args[mapFlagIndex + 1];
  if (mapFlagIndex !== -1 && !onlyMap) {
    console.error('Usage: levels-build [--map <map-key>]');
    process.exit(1);
  }

  const ctx = await loadAndValidate();
  if (!ctx) {
    console.error('Refusing to build: fix the validation errors above first.');
    process.exit(1);
  }

  const targets = discoverSources().filter((source) => !onlyMap || source.mapKey === onlyMap);
  if (onlyMap && targets.length === 0) {
    console.error(`No map.level.yaml source found for "${onlyMap}".`);
    process.exit(1);
  }

  for (const { mapKey, jsonPath } of targets) {
    const source = ctx.sources.get(mapKey)!;
    writeFileSync(jsonPath, serializeMap(compileLevel(source, mapKey)));
    console.log(`Built ${mapKey} → public/game/maps/${mapKey}.json`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
