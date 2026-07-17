#!/usr/bin/env node
// Post-build check: confirm critical lesson collections were bundled into the
// Cloudflare worker output. Counts source .html files and compares against the
// number of `<meta name="course-key" content="...">` markers found in any .mjs
// under dist/_worker.js/. Matches both the unescaped JS-string form and the
// backslash-escaped form, because Rollup picks the wrapping quote style per
// chunk based on character heuristics, and the choice can flip between
// otherwise-identical builds.

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workerRoot = path.join(projectRoot, 'dist/_worker.js');

const CRITICAL_COLLECTIONS = [
  {
    collection: 'lessons10xDevs3',
    sourceDir: 'src/content/lessons10xDevs3/pl',
    bundleKey: 'lessons10xDevs3Pl',
  },
  {
    collection: 'lessons10xDevs3Prework',
    sourceDir: 'src/content/lessons10xDevs3Prework/pl',
    bundleKey: 'lessons10xDevs3PreworkPl',
  },
  {
    collection: 'lessons10xDevs3PreworkEn',
    sourceDir: 'src/content/lessons10xDevs3Prework/en',
    bundleKey: 'lessons10xDevs3PreworkEn',
  },
];

async function countSourceHtml(absDir) {
  let entries;
  try {
    entries = await readdir(absDir);
  } catch (err) {
    if (err.code === 'ENOENT') return 0;
    throw err;
  }
  return entries.filter((name) => name.toLowerCase().endsWith('.html')).length;
}

async function walkMjs(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkMjs(full)));
    } else if (entry.isFile() && entry.name.endsWith('.mjs')) {
      results.push(full);
    }
  }
  return results;
}

async function readChunkFiles() {
  try {
    await stat(workerRoot);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        `[verify-build-content] worker output not found: ${workerRoot}\n` +
          'Run `npm run build` (or `astro build`) before this check.'
      );
    }
    throw err;
  }

  const files = await walkMjs(workerRoot);
  return Promise.all(
    files.map(async (file) => ({ file, text: await readFile(file, 'utf8') }))
  );
}

function buildMatcher(bundleKey) {
  // \\?" matches both the unescaped (single-quoted/template-literal wrappers)
  // and the escaped (double-quoted wrappers) forms of the inner double quotes.
  const key = escapeForRegex(bundleKey);
  return new RegExp(`course-key\\\\?" content=\\\\?"${key}\\\\?"`, 'g');
}

function countMatches(chunks, bundleKey) {
  const re = buildMatcher(bundleKey);
  let total = 0;
  const matchingChunks = [];
  for (const { file, text } of chunks) {
    const m = text.match(re);
    if (m && m.length > 0) {
      total += m.length;
      matchingChunks.push({ file, count: m.length });
    }
  }
  return { total, matchingChunks };
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatRow({ collection, sourceCount, bundleCount, status }) {
  return `  ${status.padEnd(4)}  ${collection.padEnd(28)} source=${String(sourceCount).padStart(3)}  bundled=${String(bundleCount).padStart(3)}`;
}

async function main() {
  console.log(`[verify-build-content] scanning ${path.relative(projectRoot, workerRoot)}/**/*.mjs`);
  const chunks = await readChunkFiles();
  console.log(`[verify-build-content] scanned ${chunks.length} .mjs file(s)`);

  const results = [];
  for (const cfg of CRITICAL_COLLECTIONS) {
    const sourceCount = await countSourceHtml(path.join(projectRoot, cfg.sourceDir));
    const { total: bundleCount, matchingChunks } = countMatches(chunks, cfg.bundleKey);
    const status = bundleCount === sourceCount ? 'OK' : 'FAIL';
    results.push({ ...cfg, sourceCount, bundleCount, matchingChunks, status });
    console.log(formatRow(results[results.length - 1]));
    for (const { file, count } of matchingChunks) {
      console.log(`           ${path.relative(workerRoot, file)} (${count})`);
    }
  }

  const failures = results.filter((r) => r.status === 'FAIL');
  if (failures.length > 0) {
    console.error('\n[verify-build-content] FAILED — bundled count does not match source for:');
    for (const f of failures) {
      console.error(
        `  - ${f.collection} (${f.sourceDir}): expected ${f.sourceCount}, found ${f.bundleCount}`
      );
    }
    console.error(
      '\nLikely causes: collection silently dropped during build, source files moved/renamed, the `course-key` meta tag changed, or the marker is encoded in a form the matcher does not recognize. Inspect chunk contents under dist/_worker.js/ for the `course-key` substring to confirm.'
    );
    process.exit(1);
  }

  console.log('[verify-build-content] OK — all critical collections bundled as expected');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
