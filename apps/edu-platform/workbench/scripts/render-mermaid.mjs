// Renders mermaid diagrams from markdown files to SVG and PNG images.
// Uses @mermaid-js/mermaid-cli (mmdc) under the hood.
//
// Usage:
//   node workbench/scripts/render-mermaid.mjs                           # scan workbench/lessons/ recursively
//   node workbench/scripts/render-mermaid.mjs workbench/lessons/m1-l1/  # scan a directory
//   node workbench/scripts/render-mermaid.mjs lesson-draft.md           # single file
//   node workbench/scripts/render-mermaid.mjs --dry-run                 # list without rendering
//   node workbench/scripts/render-mermaid.mjs --force                   # skip content-hash cache
//   node workbench/scripts/render-mermaid.mjs --concurrency=8           # parallel workers (default: 4)

import { execFile, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { availableParallelism } from 'node:os';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
const WORKBENCH_DIR = join(PROJECT_ROOT, 'workbench');
const LESSONS_DIR = join(WORKBENCH_DIR, 'lessons');
const OUTPUT_DIR = join(WORKBENCH_DIR, 'assets', 'diagrams');
const OUTPUT_10X_DIR = join(WORKBENCH_DIR, 'assets', 'diagrams-10x');
const CACHE_FILE = join(OUTPUT_DIR, '.render-cache.json');
const CDN_BASE_URL = 'https://images.przeprogramowani.pl/diagrams';
const PNG_SCALE = 2;
const DEFAULT_CONCURRENCY = Math.min(availableParallelism(), 8);

// Dark theme configuration for mmdc
const MMDC_CONFIG = {
  theme: 'dark',
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 60,
    rankSpacing: 60,
    diagramPadding: 30,
    htmlLabels: true,
  },
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    primaryColor: '#3b82f6',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#475569',
    secondaryColor: '#1e293b',
    secondaryTextColor: '#cbd5e1',
    secondaryBorderColor: '#475569',
    tertiaryColor: '#1e293b',
    tertiaryTextColor: '#94a3b8',
    tertiaryBorderColor: '#475569',
    lineColor: '#94a3b8',
    textColor: '#e2e8f0',
    mainBkg: '#1e293b',
    nodeBorder: '#475569',
    clusterBkg: '#1e293b',
    clusterBorder: '#475569',
    titleColor: '#f1f5f9',
    edgeLabelBackground: '#1e293b',
    nodeTextColor: '#e2e8f0',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    actorTextColor: '#e2e8f0',
    actorBkg: '#1e293b',
    actorBorder: '#475569',
    actorLineColor: '#64748b',
    labelBoxBkgColor: '#1e293b',
    labelBoxBorderColor: '#475569',
    labelTextColor: '#e2e8f0',
    loopTextColor: '#cbd5e1',
    noteBkgColor: '#1e293b',
    noteBorderColor: '#475569',
    noteTextColor: '#cbd5e1',
    signalColor: '#64748b',
    signalTextColor: '#e2e8f0',
    sectionBkgColor: '#1e293b',
    altSectionBkgColor: '#0f172a',
    sectionBkgColor2: '#1e293b',
    taskBkgColor: '#3b82f6',
    taskBorderColor: '#2563eb',
    taskTextColor: '#f1f5f9',
    taskTextLightColor: '#f1f5f9',
    activeTaskBkgColor: '#2563eb',
    activeTaskBorderColor: '#1d4ed8',
    gridColor: '#334155',
    doneTaskBkgColor: '#475569',
    doneTaskBorderColor: '#64748b',
    critBkgColor: '#ef4444',
    critBorderColor: '#dc2626',
    todayLineColor: '#f59e0b',
    relationColor: '#64748b',
    relationLabelColor: '#94a3b8',
  },
};

const CUSTOM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.nodeLabel, .edgeLabel, .flowchartTitleText, .cluster-label, .label {
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}

.node rect, .node .label-container {
  rx: 6;
  ry: 6;
}

.cluster rect {
  rx: 8;
  ry: 8;
  stroke-width: 2px !important;
}

.flowchart-link {
  stroke-width: 2px !important;
}

.edgeLabel rect {
  rx: 6;
  ry: 6;
}
`;

const PUPPETEER_CONFIG = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findMmdc() {
  const localBin = join(PROJECT_ROOT, 'node_modules', '.bin', 'mmdc');
  if (existsSync(localBin)) return localBin;

  const monoRoot = resolve(PROJECT_ROOT, '..', '..');
  const monoBin = join(monoRoot, 'node_modules', '.bin', 'mmdc');
  if (existsSync(monoBin)) return monoBin;

  try {
    execFileSync('which', ['mmdc'], { stdio: 'pipe' });
    return 'mmdc';
  } catch {
    return null;
  }
}

function collectMarkdownFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.isFile() && extname(entry.name) === '.md') {
      results.push(full);
    }
  }
  return results;
}

function extractMermaidBlocks(content) {
  const blocks = [];
  const regex = /```mermaid\s*\n([\s\S]*?)```/g;
  let match;
  let index = 1;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ index, code: match[1].trim() });
    index++;
  }
  return blocks;
}

function deriveOutputStem(filePath, blockIndex) {
  const rel = relative(WORKBENCH_DIR, filePath);
  const stem = rel
    .replace(/\.md$/, '')
    .replace(/[/\\]+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${stem}-${blockIndex}`;
}

function contentHash(code) {
  return createHash('sha256').update(code).digest('hex').slice(0, 16);
}

function writeTempFile(name, content) {
  const tempPath = join(tmpdir(), `mermaid-render-${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
  writeFileSync(tempPath, content, 'utf-8');
  return tempPath;
}

function safeUnlink(filePath) {
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch {
    // ignore
  }
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

function injectDiagramLinks(allBlocks) {
  const byFile = new Map();
  for (const block of allBlocks) {
    const list = byFile.get(block.sourcePath) ?? [];
    list.push(block);
    byFile.set(block.sourcePath, list);
  }

  let updatedFiles = 0;

  for (const [filePath, blocks] of byFile) {
    blocks.sort((a, b) => a.blockIndex - b.blockIndex);

    let content = readFileSync(filePath, 'utf-8');
    const original = content;
    const relBaseDir = relative(dirname(filePath), OUTPUT_DIR);
    const rel10xDir = relative(dirname(filePath), OUTPUT_10X_DIR);

    let blockIdx = 0;
    const re = /```mermaid\s*\n[\s\S]*?```(\n<!-- rendered: [^\n]+ -->)?/g;

    content = content.replace(re, (match) => {
      const block = blocks[blockIdx++];
      if (!block) return match;

      const tenXFile = `${block.stem}-10x.png`;
      const has10x = existsSync(join(OUTPUT_10X_DIR, tenXFile));

      let localPath;
      let cdnUrl;
      if (has10x) {
        localPath = rel10xDir ? `${rel10xDir}/${tenXFile}` : tenXFile;
        cdnUrl = `${CDN_BASE_URL}/${tenXFile}`;
      } else {
        localPath = relBaseDir ? `${relBaseDir}/${block.stem}.png` : `${block.stem}.png`;
        cdnUrl = `${CDN_BASE_URL}/${block.stem}.png`;
      }

      const comment = `\n<!-- rendered: ${localPath} | cdn: ${cdnUrl} -->`;
      const stripped = match.replace(/\n<!-- rendered: [^\n]+ -->$/, '');
      return stripped + comment;
    });

    if (content !== original) {
      writeFileSync(filePath, content, 'utf-8');
      updatedFiles++;
    }
  }

  return updatedFiles;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    dryRun: false,
    force: false,
    concurrency: DEFAULT_CONCURRENCY,
    positional: [],
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--force') {
      opts.force = true;
    } else if (arg.startsWith('--concurrency=')) {
      opts.concurrency = Math.max(1, parseInt(arg.split('=')[1], 10) || DEFAULT_CONCURRENCY);
    } else if (!arg.startsWith('--')) {
      opts.positional.push(arg);
    }
  }

  return opts;
}

// ---------------------------------------------------------------------------
// Parallel runner with concurrency limit
// ---------------------------------------------------------------------------

async function runWithConcurrency(tasks, concurrency) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Render a single diagram (SVG + PNG)
// ---------------------------------------------------------------------------

async function renderBlock(block, mmdcBin, configPath, cssPath, puppeteerPath) {
  const mmdPath = writeTempFile(`${block.stem}.mmd`, block.code);
  const svgOut = join(OUTPUT_DIR, `${block.stem}.svg`);
  const pngOut = join(OUTPUT_DIR, `${block.stem}.png`);

  try {
    await execFileAsync(
      mmdcBin,
      ['-i', mmdPath, '-o', svgOut, '-c', configPath, '-C', cssPath, '-p', puppeteerPath, '-b', '#0f172a'],
      { timeout: 60_000 },
    );
  } catch (err) {
    const msg = `SVG failed: ${block.sourceRelative} [block ${block.blockIndex}]: ${err.stderr?.toString().trim() || err.message}`;
    safeUnlink(mmdPath);
    return { status: 'failed', block, error: msg };
  }

  try {
    await execFileAsync(
      mmdcBin,
      ['-i', mmdPath, '-o', pngOut, '-c', configPath, '-C', cssPath, '-p', puppeteerPath, '-b', '#0f172a', '-s', String(PNG_SCALE)],
      { timeout: 60_000 },
    );
  } catch (err) {
    const msg = `PNG failed: ${block.sourceRelative} [block ${block.blockIndex}]: ${err.stderr?.toString().trim() || err.message}`;
    safeUnlink(mmdPath);
    return { status: 'failed', block, error: msg };
  }

  safeUnlink(mmdPath);
  return { status: 'ok', block };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv);
  const startTime = performance.now();

  let targetPaths = [];
  if (opts.positional.length === 0) {
    targetPaths = collectMarkdownFiles(LESSONS_DIR);
  } else {
    for (const arg of opts.positional) {
      const resolved = resolve(arg);
      if (!existsSync(resolved)) {
        console.error(`Error: path not found: ${arg}`);
        process.exit(1);
      }
      const stat = statSync(resolved);
      if (stat.isDirectory()) {
        targetPaths.push(...collectMarkdownFiles(resolved));
      } else if (stat.isFile()) {
        targetPaths.push(resolved);
      }
    }
  }

  if (targetPaths.length === 0) {
    console.log('No markdown files found.');
    return;
  }

  const allBlocks = [];
  for (const filePath of targetPaths) {
    const content = readFileSync(filePath, 'utf-8');
    const blocks = extractMermaidBlocks(content);
    for (const block of blocks) {
      allBlocks.push({
        sourcePath: filePath,
        sourceRelative: relative(PROJECT_ROOT, filePath),
        blockIndex: block.index,
        code: block.code,
        stem: deriveOutputStem(filePath, block.index),
        hash: contentHash(block.code),
      });
    }
  }

  console.log(`Scanned ${targetPaths.length} markdown file(s).`);
  console.log(`Found ${allBlocks.length} mermaid diagram(s).\n`);

  if (allBlocks.length === 0) return;

  if (opts.dryRun) {
    console.log('Dry run — diagrams that would be rendered:\n');
    for (const block of allBlocks) {
      console.log(`  ${block.sourceRelative} [block ${block.blockIndex}]`);
      console.log(`    -> ${relative(PROJECT_ROOT, join(OUTPUT_DIR, block.stem + '.svg'))}`);
      console.log(`    -> ${relative(PROJECT_ROOT, join(OUTPUT_DIR, block.stem + '.png'))}`);
    }
    console.log(`\nTotal: ${allBlocks.length} diagram(s), ${allBlocks.length * 2} output file(s).`);
    return;
  }

  const mmdcBin = findMmdc();
  if (!mmdcBin) {
    console.error('Error: @mermaid-js/mermaid-cli (mmdc) is not installed.\n');
    console.error('Install it with:');
    console.error('  npm install --save-dev @mermaid-js/mermaid-cli --workspace=projects/edu-platform');
    console.error('\nOr install globally:');
    console.error('  npm install -g @mermaid-js/mermaid-cli');
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Content-hash cache: skip diagrams whose mermaid source hasn't changed
  const cache = opts.force ? {} : loadCache();
  const blocksToRender = [];
  let skipped = 0;

  for (const block of allBlocks) {
    const svgExists = existsSync(join(OUTPUT_DIR, `${block.stem}.svg`));
    const pngExists = existsSync(join(OUTPUT_DIR, `${block.stem}.png`));

    if (!opts.force && cache[block.stem] === block.hash && svgExists && pngExists) {
      skipped++;
      continue;
    }
    blocksToRender.push(block);
  }

  if (blocksToRender.length === 0) {
    const injected = injectDiagramLinks(allBlocks);
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
    console.log(`All ${allBlocks.length} diagram(s) up to date (cached). Nothing to render.`);
    if (injected > 0) console.log(`Updated ${injected} markdown file(s) with diagram links.`);
    console.log(`Time: ${elapsed}s`);
    return;
  }

  if (skipped > 0) {
    console.log(`Skipped ${skipped} unchanged diagram(s) (cached).`);
  }
  console.log(`Rendering ${blocksToRender.length} diagram(s) with concurrency=${opts.concurrency}...\n`);

  const configPath = writeTempFile('config.json', JSON.stringify(MMDC_CONFIG, null, 2));
  const cssPath = writeTempFile('custom.css', CUSTOM_CSS);
  const puppeteerPath = writeTempFile('puppeteer.json', JSON.stringify(PUPPETEER_CONFIG, null, 2));

  const tasks = blocksToRender.map(
    (block) => () => renderBlock(block, mmdcBin, configPath, cssPath, puppeteerPath),
  );

  const results = await runWithConcurrency(tasks, opts.concurrency);

  safeUnlink(configPath);
  safeUnlink(cssPath);
  safeUnlink(puppeteerPath);

  let rendered = 0;
  let failed = 0;
  const errors = [];

  for (const result of results) {
    if (result.status === 'ok') {
      rendered++;
      cache[result.block.stem] = result.block.hash;
      console.log(`  OK    ${result.block.sourceRelative} [block ${result.block.blockIndex}] -> ${result.block.stem}.{svg,png}`);
    } else {
      failed++;
      errors.push(result.error);
      console.error(`  FAIL  ${result.block.sourceRelative} [block ${result.block.blockIndex}]`);
    }
  }

  saveCache(cache);

  const injected = injectDiagramLinks(allBlocks);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  console.log('\n--- Summary ---');
  console.log(`Diagrams found:    ${allBlocks.length}`);
  console.log(`Skipped (cached):  ${skipped}`);
  console.log(`Rendered:          ${rendered}`);
  if (failed > 0) {
    console.log(`Failed:            ${failed}`);
  }
  if (injected > 0) {
    console.log(`Links injected:    ${injected} file(s)`);
  }
  console.log(`Concurrency:       ${opts.concurrency}`);
  console.log(`Time:              ${elapsed}s`);
  console.log(`Output directory:  ${relative(PROJECT_ROOT, OUTPUT_DIR)}/`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const err of errors) {
      console.log(`  - ${err}`);
    }
    process.exit(1);
  }
}

main();
