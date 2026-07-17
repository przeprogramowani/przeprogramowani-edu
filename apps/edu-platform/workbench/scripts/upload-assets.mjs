#!/usr/bin/env node
// Uploads workbench asset files to S3 and invalidates CloudFront cache for changed files.
// Currently supports diagram PNGs under workbench/assets/diagrams/ (plus diagrams-10x with --include-10x).
// Lesson assets join the pipeline in subsequent phases.
// Requires: aws CLI configured with credentials that can write to the target bucket.
//
// Usage:
//   node workbench/scripts/upload-assets.mjs                # upload changed assets
//   node workbench/scripts/upload-assets.mjs --dry-run       # preview without uploading
//   node workbench/scripts/upload-assets.mjs --force          # re-upload all files
//   node workbench/scripts/upload-assets.mjs --urls           # print CDN URL mapping
//   node workbench/scripts/upload-assets.mjs --no-invalidate  # skip CloudFront invalidation
//   node workbench/scripts/upload-assets.mjs --include-10x    # also upload diagrams-10x variants

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
const DIAGRAMS_DIR = join(PROJECT_ROOT, 'workbench', 'assets', 'diagrams');
const DIAGRAMS_10X_DIR = join(PROJECT_ROOT, 'workbench', 'assets', 'diagrams-10x');
const LESSONS_DIR = join(PROJECT_ROOT, 'workbench', 'lessons');
const UPLOAD_CACHE = join(DIAGRAMS_DIR, '.upload-cache.json');

const S3_BUCKET = '10xdevs-images';
const S3_REGION = 'eu-central-1';
const CDN_BASE = 'https://images.przeprogramowani.pl';
const CF_DISTRIBUTION_ID = 'E3GAMSDNKN6396';
const CACHE_CONTROL = 'public, max-age=86400';

// S3 prefixes per asset class.
const DIAGRAMS_PREFIX = 'diagrams';
const LESSONS_PREFIX = 'lessons';

// Supported lesson-asset extensions and their HTTP Content-Type.
const MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function mimeFor(extension) {
  return MIME_MAP[extension.toLowerCase()] ?? null;
}

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const urlsOnly = args.includes('--urls');
const skipInvalidation = args.includes('--no-invalidate');
const include10x = args.includes('--include-10x');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function md5(buffer) {
  return createHash('md5').update(buffer).digest('hex');
}

// Migrate legacy filename-only keys to S3-key-keyed form (e.g. "foo.png" -> "diagrams/foo.png").
// Legacy cache predates lesson-asset support, where filenames could collide across lessons.
function migrateLegacyCache(parsed) {
  const migrated = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (key.includes('/')) {
      migrated[key] = value;
    } else {
      migrated[`${DIAGRAMS_PREFIX}/${key}`] = value;
    }
  }
  return migrated;
}

function loadCache() {
  if (!force && existsSync(UPLOAD_CACHE)) {
    const parsed = JSON.parse(readFileSync(UPLOAD_CACHE, 'utf8'));
    return migrateLegacyCache(parsed);
  }
  return {};
}

function saveCache(cache) {
  const sorted = Object.keys(cache)
    .sort()
    .reduce((acc, k) => {
      acc[k] = cache[k];
      return acc;
    }, {});
  writeFileSync(UPLOAD_CACHE, JSON.stringify(sorted, null, 2) + '\n');
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

// An Entry represents one uploadable asset:
//   sourcePath   absolute path on disk
//   s3Key        key under the bucket (no leading slash), e.g. "diagrams/foo.png"
//   cdnUrl       fully-qualified CDN URL
//   contentType  HTTP Content-Type header value

function discoverDiagrams() {
  const entries = [];

  if (existsSync(DIAGRAMS_DIR)) {
    for (const file of readdirSync(DIAGRAMS_DIR)
      .filter((f) => f.endsWith('.png') && !f.startsWith('.'))
      .sort()) {
      const s3Key = `${DIAGRAMS_PREFIX}/${file}`;
      entries.push({
        sourcePath: join(DIAGRAMS_DIR, file),
        s3Key,
        cdnUrl: `${CDN_BASE}/${s3Key}`,
        contentType: 'image/png',
      });
    }
  }

  if (include10x && existsSync(DIAGRAMS_10X_DIR)) {
    for (const file of readdirSync(DIAGRAMS_10X_DIR)
      .filter((f) => f.endsWith('.png') && !f.startsWith('.'))
      .sort()) {
      const s3Key = `${DIAGRAMS_PREFIX}/${file}`;
      entries.push({
        sourcePath: join(DIAGRAMS_10X_DIR, file),
        s3Key,
        cdnUrl: `${CDN_BASE}/${s3Key}`,
        contentType: 'image/png',
      });
    }
  }

  return entries;
}

// Recursively walk a directory, returning absolute paths to regular files.
// Skips dot-prefixed entries (e.g. .DS_Store, .git) and node_modules. When
// excludeDir is set, the matching absolute directory is not descended into.
function walkFiles(rootDir, { excludeDir } = {}) {
  const out = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let dirents;
    try {
      dirents = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const dirent of dirents) {
      if (dirent.name.startsWith('.')) continue;
      if (dirent.name === 'node_modules') continue;
      const full = join(current, dirent.name);
      if (dirent.isDirectory()) {
        if (excludeDir && full === excludeDir) continue;
        stack.push(full);
      } else if (dirent.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

function discoverLessonAssets() {
  const entries = [];
  if (!existsSync(LESSONS_DIR)) return entries;

  const lessonIds = readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();

  for (const lessonId of lessonIds) {
    const assetsDir = join(LESSONS_DIR, lessonId, 'assets');
    if (!existsSync(assetsDir)) continue;
    let stat;
    try {
      stat = statSync(assetsDir);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;

    const files = walkFiles(assetsDir).sort();
    for (const sourcePath of files) {
      const ext = extname(sourcePath);
      const contentType = mimeFor(ext);
      if (!contentType) continue;

      const relPath = relative(assetsDir, sourcePath).split(/[\\/]/).join('/');
      const s3Key = `${LESSONS_PREFIX}/${lessonId}/assets/${relPath}`;
      entries.push({
        sourcePath,
        s3Key,
        cdnUrl: `${CDN_BASE}/${s3Key}`,
        contentType,
        lessonId,
        relPath,
      });
    }
  }

  return entries;
}

// Scan all markdown files under a lesson directory (excluding the assets/ tree)
// for `![](./assets/<relpath>)` references. Returns the set of relpaths mentioned.
function findReferencedAssets(lessonDir) {
  const referenced = new Set();
  if (!existsSync(lessonDir)) return referenced;

  const assetsDir = join(lessonDir, 'assets');
  for (const full of walkFiles(lessonDir, { excludeDir: assetsDir })) {
    if (!full.endsWith('.md')) continue;
    const content = readFileSync(full, 'utf8');
    const re = /!\[[^\]]*\]\(\.\/assets\/([^)\s]+)\)/g;
    let match;
    while ((match = re.exec(content)) !== null) {
      referenced.add(match[1]);
    }
  }
  return referenced;
}

// Build the idempotent regex that matches `![alt](./assets/<relpath>)` plus an
// optional existing `\n<!-- cdn: ... -->` suffix. Mirrors render-mermaid.mjs.
function buildAssetRefRegex(relpath) {
  const escaped = relpath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    String.raw`(!\[[^\]]*\]\(\.\/assets\/${escaped}\))(\n<!-- cdn: [^\n]+ -->)?`,
    'g',
  );
}

// Rewrite `<!-- cdn: ... -->` comments under every `![](./assets/<rel>)`
// reference inside lessonDir for the given lesson entries. Recursive walk,
// excludes the assets/ subtree. When apply=false, returns preview triples
// instead of writing.
function rewriteCommentsForLesson(lessonDir, entries, { apply }) {
  let filesTouched = 0;
  let commentsWritten = 0;
  const previews = [];

  if (!existsSync(lessonDir)) return { filesTouched, commentsWritten, previews };
  const assetsDir = join(lessonDir, 'assets');

  for (const full of walkFiles(lessonDir, { excludeDir: assetsDir })) {
    if (!full.endsWith('.md')) continue;

    const original = readFileSync(full, 'utf8');
    let updated = original;
    const perFilePreviews = [];
    let perFileWrites = 0;
    for (const entry of entries) {
      const re = buildAssetRefRegex(entry.relPath);
      const desired = `\n<!-- cdn: ${entry.cdnUrl} -->`;
      updated = updated.replace(re, (_, imgPart, existingComment) => {
        if (existingComment !== desired) {
          perFileWrites += 1;
          perFilePreviews.push({ entry });
        }
        return `${imgPart}${desired}`;
      });
    }
    if (updated !== original) {
      const relPathFromRoot = relative(PROJECT_ROOT, full).split(/[\\/]/).join('/');
      if (apply) {
        writeFileSync(full, updated);
        filesTouched += 1;
        commentsWritten += perFileWrites;
      } else {
        for (const { entry } of perFilePreviews) {
          previews.push({
            file: relPathFromRoot,
            relPath: entry.relPath,
            cdnUrl: entry.cdnUrl,
          });
        }
      }
    }
  }

  return { filesTouched, commentsWritten, previews };
}

// Group lesson entries by lessonId and run the per-lesson writeback for each.
function applyCommentWriteback(lessonEntries, { apply }) {
  const byLesson = new Map();
  for (const entry of lessonEntries) {
    if (!byLesson.has(entry.lessonId)) byLesson.set(entry.lessonId, []);
    byLesson.get(entry.lessonId).push(entry);
  }

  let filesTouched = 0;
  let commentsWritten = 0;
  const previews = [];

  for (const [lessonId, entries] of byLesson) {
    const lessonDir = join(LESSONS_DIR, lessonId);
    const result = rewriteCommentsForLesson(lessonDir, entries, { apply });
    filesTouched += result.filesTouched;
    commentsWritten += result.commentsWritten;
    previews.push(...result.previews);
  }

  return { filesTouched, commentsWritten, previews };
}

function reportOrphans(lessonEntries) {
  const byLesson = new Map();
  for (const entry of lessonEntries) {
    if (!byLesson.has(entry.lessonId)) byLesson.set(entry.lessonId, []);
    byLesson.get(entry.lessonId).push(entry);
  }
  for (const [lessonId, entries] of byLesson) {
    const referenced = findReferencedAssets(join(LESSONS_DIR, lessonId));
    for (const entry of entries) {
      if (!referenced.has(entry.relPath)) {
        console.warn(
          `[orphan] ${lessonId}/assets/${entry.relPath} not referenced in any markdown — uploading anyway`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const diagramEntries = discoverDiagrams();
const lessonEntries = discoverLessonAssets();
const entries = [...diagramEntries, ...lessonEntries];

if (entries.length === 0) {
  console.log('No asset files found.');
  process.exit(0);
}

// --urls: just print the mapping and exit
if (urlsOnly) {
  for (const entry of entries) {
    console.log(entry.cdnUrl);
  }
  process.exit(0);
}

reportOrphans(lessonEntries);

// Diff against upload cache
const cache = loadCache();
const toUpload = [];

for (const entry of entries) {
  const content = readFileSync(entry.sourcePath);
  const hash = md5(content);

  if (cache[entry.s3Key] === hash) continue;

  toUpload.push({ entry, hash, size: content.length });
}

const diagramCount = diagramEntries.length;
const lessonCount = lessonEntries.length;
console.log(
  `${entries.length} asset(s) found (${diagramCount} diagrams${
    include10x ? ' incl. 10x' : ''
  }, ${lessonCount} lesson assets), ${toUpload.length} changed since last upload.`,
);

const uploaded = [];
const failed = [];

// --dry-run: preview uploads + writeback, then exit
if (dryRun) {
  if (toUpload.length === 0) {
    console.log('Nothing to upload.');
  } else {
    console.log('\nWould upload:');
    for (const { entry, size } of toUpload) {
      console.log(`  ${entry.s3Key} (${formatKB(size)}) → ${entry.cdnUrl}`);
    }
  }

  if (lessonEntries.length > 0) {
    const { previews } = applyCommentWriteback(lessonEntries, { apply: false });
    if (previews.length > 0) {
      console.log('\n[writeback] Would update markdown comments:');
      for (const { file, relPath, cdnUrl } of previews) {
        console.log(`  ${file}:./assets/${relPath} → ${cdnUrl}`);
      }
    }
  }

  process.exit(0);
}

if (toUpload.length === 0) {
  console.log('Nothing to upload.');
}

// Upload
for (const { entry, hash, size } of toUpload) {
  try {
    execFileSync(
      'aws',
      [
        's3',
        'cp',
        entry.sourcePath,
        `s3://${S3_BUCKET}/${entry.s3Key}`,
        '--content-type',
        entry.contentType,
        '--cache-control',
        CACHE_CONTROL,
        '--region',
        S3_REGION,
      ],
      { stdio: 'pipe' },
    );

    cache[entry.s3Key] = hash;
    uploaded.push(entry);
    console.log(`  ✓ ${entry.s3Key} (${formatKB(size)})`);
  } catch (err) {
    const msg = err.stderr?.toString().trim() || err.message;
    failed.push({ s3Key: entry.s3Key, error: msg });
    console.error(`  ✗ ${entry.s3Key}: ${msg}`);
  }
}

if (toUpload.length > 0) {
  saveCache(cache);
}

// CloudFront invalidation
if (!skipInvalidation && uploaded.length > 0) {
  const paths = uploaded.map((entry) => `/${entry.s3Key}`);
  try {
    execFileSync(
      'aws',
      [
        'cloudfront',
        'create-invalidation',
        '--distribution-id',
        CF_DISTRIBUTION_ID,
        '--paths',
        ...paths,
      ],
      { stdio: 'pipe' },
    );
    console.log(`\nCloudFront invalidation created for ${paths.length} path(s).`);
  } catch (err) {
    const msg = err.stderr?.toString().trim() || err.message;
    console.error(`\nCloudFront invalidation failed: ${msg}`);
  }
}

// Markdown comment writeback (idempotent, runs over all discovered lesson assets
// so manually edited or stale comments are restored on every run).
if (lessonEntries.length > 0) {
  const { filesTouched, commentsWritten } = applyCommentWriteback(lessonEntries, {
    apply: true,
  });
  if (filesTouched > 0) {
    console.log(
      `\nWriteback: refreshed ${commentsWritten} comment(s) across ${filesTouched} markdown file(s).`,
    );
  }
}

// Summary
if (toUpload.length > 0 || failed.length > 0) {
  console.log(`\nDone. Uploaded: ${uploaded.length}, Failed: ${failed.length}`);
}

if (uploaded.length > 0) {
  console.log('\nCDN URLs:');
  for (const entry of uploaded) {
    console.log(`  ${entry.cdnUrl}`);
  }
}

if (failed.length > 0) {
  process.exit(1);
}
