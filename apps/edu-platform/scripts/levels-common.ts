import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseLevelSource } from '../src/explorers/levels/mapAuthoring/parseSource';
import { validateAll } from '../src/explorers/levels/mapAuthoring/validate';
import type {
  LevelSource,
  ValidationContext,
  ValidationIssue,
} from '../src/explorers/levels/mapAuthoring/types';

export const LEVELS_DIR = join(process.cwd(), 'src/explorers/levels');
export const MAPS_DIR = join(process.cwd(), 'public/game/maps');

export interface DiscoveredSource {
  mapKey: string;
  yamlPath: string;
  jsonPath: string;
}

/** Every level directory containing a map.level.yaml source. */
export function discoverSources(): DiscoveredSource[] {
  return readdirSync(LEVELS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      mapKey: entry.name,
      yamlPath: join(LEVELS_DIR, entry.name, 'map.level.yaml'),
      jsonPath: join(MAPS_DIR, `${entry.name}.json`),
    }))
    .filter((source) => existsSync(source.yamlPath))
    .sort((a, b) => a.mapKey.localeCompare(b.mapKey));
}

export async function buildValidationContext(
  discovered: DiscoveredSource[],
): Promise<ValidationContext> {
  const sources = new Map<string, LevelSource>();
  for (const { mapKey, yamlPath } of discovered) {
    sources.set(mapKey, parseLevelSource(readFileSync(yamlPath, 'utf-8'), mapKey));
  }

  const knownMaps = new Set<string>(sources.keys());
  for (const file of readdirSync(MAPS_DIR)) {
    if (file.endsWith('.json')) {
      knownMaps.add(file.replace(/\.json$/, ''));
    }
  }

  // Manifest cross-checks; tsx resolves the TS import chain.
  const { ALL_LEVELS } = await import('../src/explorers/levels/index');
  return { sources, knownMaps, manifests: ALL_LEVELS };
}

export function reportIssues(issues: ValidationIssue[]): void {
  for (const issue of issues) {
    const location = issue.at ? ` at (${issue.at[0]}, ${issue.at[1]})` : '';
    const tag = issue.level === 'error' ? 'ERROR' : 'warn ';
    console.log(`  ${tag} [${issue.mapKey}]${location}: ${issue.message}`);
  }
}

/** Parse + validate all sources; prints a report. Returns null on errors. */
export async function loadAndValidate(): Promise<ValidationContext | null> {
  const discovered = discoverSources();
  if (discovered.length === 0) {
    console.log('No map.level.yaml sources found under src/explorers/levels/ — nothing to do.');
    return { sources: new Map(), knownMaps: new Set() };
  }

  let ctx: ValidationContext;
  try {
    ctx = await buildValidationContext(discovered);
  } catch (error) {
    console.error(`Parse error: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }

  const issues = validateAll(ctx);
  const errors = issues.filter((issue) => issue.level === 'error');
  const warnings = issues.filter((issue) => issue.level === 'warning');
  if (issues.length > 0) {
    reportIssues(issues);
  }
  console.log(
    `Validated ${ctx.sources.size} level source(s): ${errors.length} error(s), ${warnings.length} warning(s).`,
  );
  return errors.length > 0 ? null : ctx;
}
