/**
 * Validate all map.level.yaml sources: geometry, auto-tiling resolvability,
 * props, zones, cross-map doors, and manifest references.
 *
 * Usage: npm run levels:check
 */
import { loadAndValidate } from './levels-common';

async function main(): Promise<void> {
  const ctx = await loadAndValidate();
  if (!ctx) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
