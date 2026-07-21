import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseLevelSource } from './parseSource';

const LEVELS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');

function sourceKeys(): string[] {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(LEVELS_DIR, e.name, 'map.level.yaml')))
    .map((e) => e.name)
    .sort();
}

const byType: Record<string, { total: number; withProp: number; offenders: string[] }> = {};

for (const key of sourceKeys()) {
  const src = parseLevelSource(readFileSync(join(LEVELS_DIR, key, 'map.level.yaml'), 'utf-8'), key);
  const solidPropAt = (x: number, y: number) => src.props.some((p) => p.at[0] === x && p.at[1] === y);
  for (const z of src.zones) {
    byType[z.type] ??= { total: 0, withProp: 0, offenders: [] };
    byType[z.type].total++;
    const hasProp = z.propId != null || solidPropAt(z.at[0], z.at[1]);
    if (hasProp) byType[z.type].withProp++;
    else byType[z.type].offenders.push(`${key}/${z.id} @${z.at.join(',')} [${z.name ?? ''}]`);
  }
}

for (const [t, info] of Object.entries(byType).sort()) {
  console.log(`\n=== ${t} : ${info.withProp}/${info.total} have a prop ===`);
  for (const o of info.offenders) console.log(`   NO PROP: ${o}`);
}
