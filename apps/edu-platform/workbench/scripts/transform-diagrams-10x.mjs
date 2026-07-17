#!/usr/bin/env node
// Transforms mermaid diagram PNGs into sci-fi HUD versions via OpenRouter image-to-image API.
//
// Usage:
//   node workbench/scripts/transform-diagrams-10x.mjs                    # transform all uncached
//   node workbench/scripts/transform-diagrams-10x.mjs --dry-run          # list without API calls
//   node workbench/scripts/transform-diagrams-10x.mjs --filter=m1-l3      # only matching stems
//   node workbench/scripts/transform-diagrams-10x.mjs --force            # ignore cache
//   node workbench/scripts/transform-diagrams-10x.mjs --model=<id>       # override primary model
//   node workbench/scripts/transform-diagrams-10x.mjs --concurrency=2    # parallel calls (max 4)

import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
const WORKBENCH_DIR = join(PROJECT_ROOT, 'workbench');
const SOURCE_DIR = join(WORKBENCH_DIR, 'assets', 'diagrams');
const OUTPUT_DIR = join(WORKBENCH_DIR, 'assets', 'diagrams-10x');
const SPEC_FILE = join(OUTPUT_DIR, '.transform-spec.json');
const CACHE_FILE = join(OUTPUT_DIR, '.transform-cache.json');
const MANIFEST_FILE = join(OUTPUT_DIR, '.transform-manifest.json');
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ---------------------------------------------------------------------------
// ENV loader (mirrors generate-ebook-illustrations.ts)
// ---------------------------------------------------------------------------

function loadEnvFiles() {
  for (const envFile of ['.env.local', '.env']) {
    const envPath = join(PROJECT_ROOT, envFile);
    let raw;
    try {
      raw = readFileSync(envPath, 'utf8');
    } catch {
      continue;
    }

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const sep = trimmed.indexOf('=');
      if (sep === -1) continue;

      const key = trimmed.slice(0, sep).trim();
      let value = trimmed.slice(sep + 1).trim();
      if (!key || process.env[key] !== undefined) continue;

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    force: false,
    filter: null,
    model: null,
    concurrency: 1,
  };

  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--force') {
      opts.force = true;
    } else if (arg.startsWith('--filter=')) {
      opts.filter = arg.split('=')[1];
    } else if (arg.startsWith('--model=')) {
      opts.model = arg.split('=')[1];
    } else if (arg.startsWith('--concurrency=')) {
      opts.concurrency = Math.max(1, Math.min(4, parseInt(arg.split('=')[1], 10) || 1));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return opts;
}

// ---------------------------------------------------------------------------
// Spec / Cache / Manifest helpers
// ---------------------------------------------------------------------------

function loadSpec() {
  return JSON.parse(readFileSync(SPEC_FILE, 'utf8'));
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  const sorted = Object.keys(cache)
    .sort()
    .reduce((acc, k) => {
      acc[k] = cache[k];
      return acc;
    }, {});
  writeFileSync(CACHE_FILE, JSON.stringify(sorted, null, 2) + '\n');
}

function loadManifest() {
  try {
    return JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'));
  } catch {
    return { updatedAt: new Date().toISOString(), entries: [] };
  }
}

function saveManifest(manifest) {
  manifest.updatedAt = new Date().toISOString();
  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n');
}

function md5(buffer) {
  return createHash('md5').update(buffer).digest('hex');
}

function promptHash(text) {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

// ---------------------------------------------------------------------------
// Mermaid source extraction (mirrors render-mermaid.mjs)
// ---------------------------------------------------------------------------

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

function buildMermaidIndex() {
  const mdFiles = collectMarkdownFiles(WORKBENCH_DIR);
  const index = new Map();

  for (const filePath of mdFiles) {
    const content = readFileSync(filePath, 'utf8');
    const blocks = extractMermaidBlocks(content);
    for (const block of blocks) {
      const stem = deriveOutputStem(filePath, block.index);
      index.set(stem, block.code);
    }
  }

  return index;
}

// ---------------------------------------------------------------------------
// Source PNG discovery
// ---------------------------------------------------------------------------

function discoverSourcePngs(filter) {
  return readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith('.png'))
    .map((f) => f.replace(/\.png$/, ''))
    .filter((stem) => !filter || stem.includes(filter))
    .sort();
}

// ---------------------------------------------------------------------------
// OpenRouter API
// ---------------------------------------------------------------------------

function getModalities(spec, model) {
  const prefixes = spec.modelsRequiringTextModality || [];
  for (const prefix of prefixes) {
    if (model === prefix || model.startsWith(prefix)) {
      return ['image', 'text'];
    }
  }
  return ['image'];
}

function loadStyleReference(spec) {
  if (!spec.styleReference) return null;
  const refPath = join(OUTPUT_DIR, spec.styleReference);
  if (!existsSync(refPath)) return null;
  return readFileSync(refPath).toString('base64');
}

function buildMultimodalMessage(spec, pngBase64, mermaidCode, styleRefBase64) {
  const content = [];

  if (styleRefBase64) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/png;base64,${styleRefBase64}` },
    });
    content.push({
      type: 'text',
      text: 'The image above is the STYLE REFERENCE. Match its visual style exactly: headline treatment, HUD border style, color palette, glow effects, overall composition. Do NOT copy its diagram content — only its style.\n\nNow transform the following diagram:',
    });
  }

  content.push({
    type: 'image_url',
    image_url: { url: `data:image/png;base64,${pngBase64}` },
  });

  const textParts = [spec.prompt];
  if (mermaidCode) {
    textParts.push(`\n\nMermaid source:\n\`\`\`mermaid\n${mermaidCode}\n\`\`\``);
  }
  textParts.push(`\n\n${spec.negativePrompt}`);

  content.push({
    type: 'text',
    text: textParts.join(''),
  });

  return content;
}

async function requestTransformation(apiKey, spec, pngBase64, mermaidCode, model, styleRefBase64) {
  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://przeprogramowani.pl',
      'X-Title': '10xDevs Sci-fi Diagram Transform',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: buildMultimodalMessage(spec, pngBase64, mermaidCode, styleRefBase64),
        },
      ],
      modalities: getModalities(spec, model),
      image_config: spec.imageConfig,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const result = await response.json();

  const imageUrl =
    result.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
    result.choices?.[0]?.message?.images?.[0]?.imageUrl?.url;

  if (!imageUrl) {
    throw new Error(
      'OpenRouter response did not include message.images[0].image_url.url — ' +
        `keys: ${JSON.stringify(Object.keys(result.choices?.[0]?.message ?? {}))}`,
    );
  }

  return imageUrl;
}

function decodeDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Received image is not a base64 data URL');
  }
  return { mimeType: match[1], data: Buffer.from(match[2], 'base64') };
}

// ---------------------------------------------------------------------------
// Concurrency runner
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
// Main
// ---------------------------------------------------------------------------

async function main() {
  loadEnvFiles();
  const opts = parseArgs(process.argv);
  const spec = loadSpec();
  const startTime = performance.now();

  const stems = discoverSourcePngs(opts.filter);
  console.log(`Found ${stems.length} source PNG(s) in ${relative(PROJECT_ROOT, SOURCE_DIR)}/`);

  if (stems.length === 0) {
    console.log('Nothing to transform.');
    return;
  }

  const mermaidIndex = buildMermaidIndex();
  const model = opts.model || spec.modelPrimary;
  const fallbackModel = spec.modelFallback;

  if (opts.dryRun) {
    const cache = opts.force ? {} : loadCache();
    const assembledPrompt = spec.prompt + spec.negativePrompt;
    const pHash = promptHash(assembledPrompt);

    let toGenerate = 0;
    let cached = 0;

    console.log(`\nDry run — model: ${model}, fallback: ${fallbackModel}\n`);

    for (const stem of stems) {
      const pngPath = join(SOURCE_DIR, `${stem}.png`);
      const pngContent = readFileSync(pngPath);
      const sourceHash = md5(pngContent);
      const hasMermaid = mermaidIndex.has(stem);
      const cacheEntry = cache[stem];
      const isCached =
        cacheEntry && cacheEntry.sourceHash === sourceHash && cacheEntry.promptHash === pHash;

      if (isCached) {
        cached++;
        console.log(`  CACHED  ${stem} (mermaid: ${hasMermaid ? 'yes' : 'no'})`);
      } else {
        toGenerate++;
        console.log(`  PENDING ${stem} (mermaid: ${hasMermaid ? 'yes' : 'no'})`);
      }
    }

    console.log(
      `\nTotal: ${stems.length}, to generate: ${toGenerate}, cached: ${cached}`,
    );
    return;
  }

  // Real run — need API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required. Set it in .env or .env.local');
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const cache = opts.force ? {} : loadCache();
  const manifest = loadManifest();
  const styleRefBase64 = loadStyleReference(spec);
  if (styleRefBase64) {
    console.log(`Style reference loaded: ${spec.styleReference}`);
  }
  const assembledPrompt = spec.prompt + spec.negativePrompt;
  const pHash = promptHash(assembledPrompt);

  const toProcess = [];
  let skipped = 0;

  for (const stem of stems) {
    const pngPath = join(SOURCE_DIR, `${stem}.png`);
    const pngContent = readFileSync(pngPath);
    const sourceHash = md5(pngContent);
    const cacheEntry = cache[stem];
    const outputPath = join(OUTPUT_DIR, `${stem}-10x.png`);
    const isCached =
      cacheEntry &&
      cacheEntry.sourceHash === sourceHash &&
      cacheEntry.promptHash === pHash &&
      existsSync(outputPath);

    if (isCached) {
      skipped++;
      continue;
    }

    toProcess.push({
      stem,
      pngPath,
      pngContent,
      sourceHash,
      outputPath,
      mermaidCode: mermaidIndex.get(stem) || null,
    });
  }

  if (toProcess.length === 0) {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
    console.log(`All ${stems.length} diagram(s) up to date (cached). Nothing to transform.`);
    console.log(`Time: ${elapsed}s`);
    return;
  }

  if (skipped > 0) {
    console.log(`Skipped ${skipped} unchanged diagram(s) (cached).`);
  }
  console.log(
    `Transforming ${toProcess.length} diagram(s) via ${model} (concurrency=${opts.concurrency})...\n`,
  );

  let generated = 0;
  let failed = 0;
  const errors = [];

  const tasks = toProcess.map(
    (item) => async () => {
      const pngBase64 = item.pngContent.toString('base64');
      const mermaidNote = item.mermaidCode ? ' +mermaid' : '';
      console.log(`  [transform] ${item.stem}${mermaidNote}`);

      let usedModel = model;
      let lastError = null;

      for (const currentModel of [model, fallbackModel]) {
        if (currentModel === fallbackModel && lastError) {
          console.log(`  [transform] retrying ${item.stem} with fallback ${fallbackModel}`);
        }
        usedModel = currentModel;

        try {
          const dataUrl = await requestTransformation(
            apiKey,
            spec,
            pngBase64,
            item.mermaidCode,
            currentModel,
            styleRefBase64,
          );

          const decoded = decodeDataUrl(dataUrl);
          writeFileSync(item.outputPath, decoded.data);
          const fileSize = statSync(item.outputPath).size;

          cache[item.stem] = { sourceHash: item.sourceHash, promptHash: pHash };

          manifest.entries.push({
            stem: item.stem,
            model: currentModel,
            promptHash: pHash,
            sourceHash: item.sourceHash,
            outputFile: relative(PROJECT_ROOT, item.outputPath),
            status: 'success',
            error: null,
            mimeType: decoded.mimeType,
            fileSizeBytes: fileSize,
            createdAt: new Date().toISOString(),
          });
          saveManifest(manifest);
          saveCache(cache);

          generated++;
          console.log(
            `  [transform] OK ${item.stem}-10x.png (${(fileSize / 1024).toFixed(1)} KB) via ${currentModel}`,
          );
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          const message = err instanceof Error ? err.message : String(err);

          manifest.entries.push({
            stem: item.stem,
            model: currentModel,
            promptHash: pHash,
            sourceHash: item.sourceHash,
            outputFile: relative(PROJECT_ROOT, item.outputPath),
            status: 'error',
            error: message,
            mimeType: null,
            fileSizeBytes: null,
            createdAt: new Date().toISOString(),
          });
          saveManifest(manifest);

          console.error(`  [transform] FAIL ${item.stem} via ${currentModel}: ${message}`);

          if (currentModel === fallbackModel) {
            failed++;
            errors.push(`${item.stem}: ${message}`);
          }
        }
      }
    },
  );

  await runWithConcurrency(tasks, opts.concurrency);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

  console.log('\n--- Summary ---');
  console.log(`Diagrams found:    ${stems.length}`);
  console.log(`Skipped (cached):  ${skipped}`);
  console.log(`Generated:         ${generated}`);
  if (failed > 0) {
    console.log(`Failed:            ${failed}`);
  }
  console.log(`Model:             ${model}`);
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

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
