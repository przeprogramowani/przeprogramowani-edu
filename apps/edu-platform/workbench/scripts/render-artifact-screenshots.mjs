// Renders "artifact screenshots" for m4 lesson drafts: styled PNG cards showing
// sections of real context/*.md documents (research reports, plans, repo map).
// Pipeline: slice markdown section -> micromark+GFM -> dark HTML card -> Playwright
// element screenshot at 2x (1240px card width). Output lands in
// workbench/lessons/<lessonId>/assets/ and is referenced from lesson drafts as
//   ![](./assets/<name>.png)
//   <!-- cdn: https://images.przeprogramowani.pl/lessons/<lessonId>/assets/<name>.png -->
// Upload afterwards with: node workbench/scripts/upload-assets.mjs
//
// Editorial conventions baked in:
// - REDACTIONS strip artifact-creation timestamps (we do not expose how recently
//   the demo artifacts were made); historical content dates (e.g. "z 2020 r.") stay.
//   A guard warns if any ISO date survives redaction.
// - Long sections get a bottom fade (max-height + gradient) signalling the
//   document continues, instead of rendering a wall of text.
// - The card bar shows the real artifact path and an origin badge (which pipeline
//   step produced the document) — keep badges truthful to provenance.
//
// External dependency: shots sourced from the Mattermost demo repo require
// /Users/admin/code/mattermost/context (override with MATTERMOST_CONTEXT_DIR).
// Shots whose source file is missing are skipped with a warning, so the script
// stays usable on machines without the demo checkout.
//
// Usage:
//   node workbench/scripts/render-artifact-screenshots.mjs              # render all shots
//   node workbench/scripts/render-artifact-screenshots.mjs m4-l2 m4-l3 # only these lessons
//   node workbench/scripts/render-artifact-screenshots.mjs --dry-run   # list without rendering

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..');
const MONOREPO_ROOT = resolve(PROJECT_ROOT, '..', '..');
const LESSONS_DIR = join(PROJECT_ROOT, 'workbench', 'lessons');

// Workbench-internal copy of the Wide Scan artifacts (lesson m4-l2/l3 sources).
const MAP_DIR = join(LESSONS_DIR, 'm4-l4', 'context', 'map');
// Demo repo with the Deep Focus / refactor artifacts (lesson m4-l3/l4 sources).
const MATTERMOST_CONTEXT = process.env.MATTERMOST_CONTEXT_DIR ?? '/Users/admin/code/mattermost/context';
const PFA_DIR = join(MATTERMOST_CONTEXT, 'changes', 'post-flow-analysis');
const RO_DIR = join(MATTERMOST_CONTEXT, 'changes', 'refactor-opportunities');

// Sibling repos that hold the real m5-l4 distribution artifacts (cards show their
// truthful path + origin badge). Override the base with M5L4_CODE_ROOT for a
// non-default checkout layout. Missing files are skipped with a warning, so this
// stays usable on machines without these checkouts.
const CODE_ROOT = process.env.M5L4_CODE_ROOT ?? resolve(MONOREPO_ROOT, '..');
const TOOLKIT_DIR = join(CODE_ROOT, '10x-toolkit');
const CLI_DIR = join(CODE_ROOT, '10x-cli');
const CARDS_DIR = join(CODE_ROOT, '10xCards');

// Deps come from the monorepo root (playwright, micromark are hoisted there).
const require = createRequire(join(MONOREPO_ROOT, 'package.json'));
const { micromark } = require('micromark');
const { gfm, gfmHtml } = require('micromark-extension-gfm');
const { chromium } = require('playwright');

// ---------------------------------------------------------------------------
// Shot definitions
// ---------------------------------------------------------------------------
// slice: [sourceFile, startHeadingPrefix, endHeadingPrefix|null] — section is
// [start, end) by line prefix match; trailing blank lines and `---` are trimmed.
// fade: crop content at N px with a bottom gradient (document continues).

const SHOTS = [
  // --- m4-l2: Wide Scan artifacts + final repo map ---
  {
    lesson: 'm4-l2',
    name: 'artifact-territory',
    src: [join(MAP_DIR, 'artifact-1-territory.md'), '# Artefakt 1', '### Drążenie'],
    path: 'context/map/artifact-1-territory.md',
    badge: 'Wide Scan 1/3 — terytorium',
  },
  {
    lesson: 'm4-l2',
    name: 'artifact-structure',
    src: [join(MAP_DIR, 'artifact-2-structure.md'), '# Artefakt 2', '## 2. Granice warstw'],
    path: 'context/map/artifact-2-structure.md',
    badge: 'Wide Scan 2/3 — struktura',
  },
  {
    lesson: 'm4-l2',
    name: 'artifact-repo-map',
    src: [join(MAP_DIR, 'repo-map.md'), '# Mapa projektu', '## 2. Teren'],
    path: 'context/map/repo-map.md',
    badge: 'synteza — Mapa projektu',
    fade: 640,
  },
  // --- m4-l3: map decision section + Deep Focus research ---
  {
    lesson: 'm4-l3',
    name: 'map-risk-zones',
    src: [join(MAP_DIR, 'repo-map.md'), '## 4. Strefy ryzyka', '## 5. Kogo zapytać'],
    path: 'context/map/repo-map.md',
    badge: 'Mapa projektu ①',
  },
  {
    lesson: 'm4-l3',
    name: 'artifact-research-trace',
    src: [join(PFA_DIR, 'research.md'), '### Ścieżka e2e', '### Diagram Mermaid'],
    path: 'context/changes/post-flow-analysis/research.md',
    badge: 'wynik /10x-research',
    fade: 950,
  },
  {
    lesson: 'm4-l3',
    name: 'artifact-research-debt',
    src: [join(PFA_DIR, 'research.md'), '## Technical debt', '### TD-4'],
    path: 'context/changes/post-flow-analysis/research.md',
    badge: 'wynik /10x-research',
    fade: 1150,
  },
  {
    lesson: 'm4-l3',
    name: 'artifact-research-corrections',
    // Original research output correcting stale priors — NOT the ast-grep pass.
    src: [join(PFA_DIR, 'research.md'), '## Korekty nieaktualnych założeń', null],
    path: 'context/changes/post-flow-analysis/research.md',
    badge: 'wynik /10x-research',
  },
  // --- m4-l4: refactor-opportunities research + plan ---
  {
    lesson: 'm4-l4',
    name: 'artifact-research-enumeration',
    src: [join(RO_DIR, 'research.md'), '## Enumeracja i klasyfikacja', '## Podsumowanie'],
    path: 'context/changes/refactor-opportunities/research.md',
    badge: 'wynik /10x-research',
  },
  {
    lesson: 'm4-l4',
    name: 'artifact-research-ranking',
    src: [join(RO_DIR, 'research.md'), '## Okazje refaktoryzacyjne', '## Weryfikacja twierdzeń'],
    path: 'context/changes/refactor-opportunities/research.md',
    badge: 'wynik /10x-research',
    fade: 740,
  },
  {
    lesson: 'm4-l4',
    name: 'artifact-research-verification',
    src: [join(RO_DIR, 'research.md'), '## Weryfikacja twierdzeń', '### C1 — trójstronny kontrakt Post'],
    path: 'context/changes/refactor-opportunities/research.md',
    badge: 'po weryfikacji ast-grep',
  },
  {
    lesson: 'm4-l4',
    name: 'artifact-plan-scope',
    src: [join(RO_DIR, 'plan.md'), "## What We're NOT Doing", '## Critical Implementation Details'],
    path: 'context/changes/refactor-opportunities/plan.md',
    badge: 'wynik /10x-plan',
  },
  // --- m5-l4: real registry-distribution artifacts (code/config cards) ---
  // `lang` fences a non-markdown slice so it renders as a code card. Cards show
  // the truthful source path + origin badge; prose brackets the 10x-cli/toolkit
  // names as the course's own gate. Render is deferred (Phase 7 defines shots only).
  {
    lesson: 'm5-l4',
    name: 'publishconfig',
    src: [join(TOOLKIT_DIR, 'packages/internal-pkg/package.json'), '  "publishConfig"', '  "scripts"'],
    path: 'packages/internal-pkg/package.json',
    badge: '@przeprogramowani/10x-toolkit — publishConfig',
    lang: 'json',
  },
  {
    lesson: 'm5-l4',
    name: 'consumer-npmrc',
    src: [join(CARDS_DIR, '.npmrc'), '@przeprogramowani:registry', null],
    path: '.npmrc (repo konsumenta)',
    badge: 'commitowany — tylko mapowanie scope→rejestr',
    lang: 'ini',
  },
  {
    lesson: 'm5-l4',
    name: 'preinstall',
    src: [join(TOOLKIT_DIR, 'packages/internal-pkg/src/github-packages-auth.ts'), 'const REGISTRY_LINE', '// --- Workflow patching'],
    path: 'packages/internal-pkg/src/github-packages-auth.ts',
    badge: '@przeprogramowani/10x-toolkit — preinstall (no-op lokalnie)',
    lang: 'ts',
  },
  {
    lesson: 'm5-l4',
    name: 'sentinel-markers',
    src: [join(CLI_DIR, 'src/lib/sentinel-migration.ts'), 'export const OLD_BEGIN', 'export interface RulesBlockResult'],
    path: '10x-cli/src/lib/sentinel-migration.ts',
    badge: '@przeprogramowani/10x-cli — markery sentinel',
    lang: 'ts',
  },
  {
    lesson: 'm5-l4',
    name: 'manifest',
    src: [join(CARDS_DIR, '.claude/.10x-cli-manifest.json'), '{', null],
    path: '.claude/.10x-cli-manifest.json (repo konsumenta)',
    badge: 'manifest 10x-cli — tryb + lista plików',
    lang: 'json',
    fade: 520,
  },
  {
    lesson: 'm5-l4',
    name: 'signing',
    src: [join(CLI_DIR, 'src/lib/signing.ts'), 'const KEYSET', 'function loadEffectiveKeyset'],
    path: '10x-cli/src/lib/signing.ts',
    badge: '@przeprogramowani/10x-cli — podpisy Ed25519 (fail-closed)',
    lang: 'ts',
  },
  {
    lesson: 'm5-l4',
    name: 'api-allowlist',
    src: [join(CLI_DIR, 'src/lib/api-client.ts'), 'export const DEFAULT_API_BASE', 'export interface ApiErrorPayload'],
    path: '10x-cli/src/lib/api-client.ts',
    badge: '@przeprogramowani/10x-cli — allowlist hosta API',
    lang: 'ts',
    fade: 760,
  },
];

// ---------------------------------------------------------------------------
// Redaction — strip artifact-creation timestamps, keep historical content dates
// ---------------------------------------------------------------------------

const REDACTIONS = [
  [/Okno: \*\*2025-06-04 → 2026-06-04\*\* \(ostatnie 12 mies\.\)\./g, 'Okno: **ostatnie 12 miesięcy**.'],
  [/\n> Uwaga: ostatni commit w repo to `2026-04-21`[^\n]*/g, ''],
  [/12 miesięcy \(2025-06-04 → 2026-06-04\)/g, 'ostatnie 12 miesięcy'],
  [/\*\*Data\*\*: 2026-06-06 · /g, ''],
  // m5-l4 manifest card: hide the install timestamp (we don't expose how recently
  // the demo artifacts were applied); the per-file SHA list is the teachable part.
  [/"lastApplied": "20\d{2}-\d{2}-\d{2}T[^"]*"/g, '"lastApplied": "<redacted>"'],
];

function redact(md, name) {
  let out = md;
  for (const [pattern, replacement] of REDACTIONS) out = out.replace(pattern, replacement);
  const leftover = out.match(/20\d{2}-\d{2}-\d{2}/);
  if (leftover) console.warn(`  ⚠ ${name}: date survived redaction: ${leftover[0]} — add a REDACTIONS entry`);
  return out;
}

// ---------------------------------------------------------------------------
// Markdown slicing
// ---------------------------------------------------------------------------

function slice(file, start, end) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const a = lines.findIndex((l) => l.startsWith(start));
  if (a === -1) throw new Error(`start marker not found in ${file}: ${start}`);
  let b = lines.length;
  if (end) {
    b = lines.findIndex((l, i) => i > a && l.startsWith(end));
    if (b === -1) throw new Error(`end marker not found in ${file}: ${end}`);
  }
  const chunk = lines.slice(a, b);
  while (chunk.length && /^(---)?\s*$/.test(chunk[chunk.length - 1])) chunk.pop();
  return chunk.join('\n');
}

// ---------------------------------------------------------------------------
// Card template
// ---------------------------------------------------------------------------
// Palette matches the lesson mermaid diagrams: #0f172a surface, #1e293b panels,
// #3b82f6 accents, #f59e0b badge. Card width 1240px, screenshot at 2x.

const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: transparent;
         font: 15px/1.55 -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
         color: #e2e8f0; }
  .card { width: 1240px; background: #0f172a; border: 1px solid #334155;
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,.45); }
  .bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px;
         background: #1e293b; border-bottom: 1px solid #334155; }
  .dots { display: flex; gap: 6px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .d1 { background: #f87171; } .d2 { background: #fbbf24; } .d3 { background: #34d399; }
  .path { font: 12.5px/1 "SF Mono", ui-monospace, Menlo, monospace; color: #94a3b8;
          flex: 1; text-align: center; letter-spacing: .2px; }
  .badge { font: 600 11px/1 -apple-system, system-ui, sans-serif; color: #fde68a;
           background: rgba(245,158,11,.14); border: 1px solid #f59e0b;
           border-radius: 999px; padding: 4px 10px; white-space: nowrap; }
  .content { padding: 22px 30px 28px; }
  .content.faded { max-height: var(--fade-h); overflow: hidden; position: relative; }
  .content.faded::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0;
          height: 130px; background: linear-gradient(to bottom, rgba(15,23,42,0), #0f172a 88%); }
  h1 { font-size: 23px; margin: 4px 0 14px; color: #f1f5f9; }
  h2 { font-size: 21px; margin: 4px 0 14px; color: #f1f5f9; }
  h3 { font-size: 17px; margin: 22px 0 10px; color: #e2e8f0;
       padding-bottom: 6px; border-bottom: 1px solid #1e293b; }
  p { margin: 10px 0; color: #cbd5e1; }
  blockquote { margin: 12px 0; padding: 8px 16px; border-left: 3px solid #3b82f6;
               background: rgba(30,41,59,.5); border-radius: 0 6px 6px 0; }
  blockquote p { margin: 6px 0; color: #94a3b8; font-size: 13.5px; }
  ul, ol { margin: 10px 0; padding-left: 22px; }
  li { margin: 6px 0; color: #cbd5e1; }
  li::marker { color: #3b82f6; }
  strong { color: #f1f5f9; }
  code { font: 12.5px/1.4 "SF Mono", ui-monospace, Menlo, monospace;
         background: #1e293b; color: #93c5fd; border-radius: 4px; padding: 1.5px 5px; }
  pre { background: #1e293b; border: 1px solid #334155; border-radius: 8px;
        padding: 14px 16px; overflow: hidden; }
  pre code { background: none; padding: 0; color: #cbd5e1; }
  table { border-collapse: collapse; width: 100%; margin: 14px 0;
          font-size: 13px; line-height: 1.45; }
  th { background: #1e293b; color: #f1f5f9; text-align: left; font-weight: 600; }
  th, td { border: 1px solid #334155; padding: 7px 10px; vertical-align: top; }
  td { color: #cbd5e1; }
  tr:nth-child(even) td { background: rgba(30,41,59,.45); }
  td code, th code { white-space: normal; overflow-wrap: anywhere; }
  hr { border: 0; border-top: 1px solid #334155; margin: 18px 0; }
`;

function cardHtml(shot, body) {
  const fadeAttrs = shot.fade ? ` style="--fade-h:${shot.fade}px"` : '';
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
    <div class="card">
      <div class="bar">
        <div class="dots"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span></div>
        <div class="path">${shot.path}</div>
        <div class="badge">${shot.badge}</div>
      </div>
      <div class="content${shot.fade ? ' faded' : ''}"${fadeAttrs}>${body}</div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const lessonFilter = args.filter((a) => !a.startsWith('--'));

const selected = SHOTS.filter((s) => lessonFilter.length === 0 || lessonFilter.includes(s.lesson));
if (selected.length === 0) {
  console.error(`No shots match filter [${lessonFilter.join(', ')}]. Lessons: ${[...new Set(SHOTS.map((s) => s.lesson))].join(', ')}`);
  process.exit(1);
}

const renderable = [];
for (const shot of selected) {
  if (!existsSync(shot.src[0])) {
    console.warn(`⚠ skip ${shot.lesson}/${shot.name}: source missing (${shot.src[0]})`);
    continue;
  }
  renderable.push(shot);
}

if (dryRun) {
  for (const s of renderable) console.log(`${s.lesson}/assets/${s.name}.png  ←  ${s.src[0]} [${s.src[1]} … ${s.src[2] ?? 'EOF'}]${s.fade ? ` fade@${s.fade}` : ''}`);
  console.log(`${renderable.length} shot(s) would be rendered.`);
  process.exit(0);
}

const workDir = mkdtempSync(join(tmpdir(), 'artifact-shots-'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1320, height: 900 }, deviceScaleFactor: 2 });

try {
  for (const shot of renderable) {
    let md = redact(slice(...shot.src), shot.name);
    // `lang` wraps a non-markdown slice (code/config) in a fenced block so it
    // renders as a code card rather than being parsed as prose.
    if (shot.lang) md = '```' + shot.lang + '\n' + md + '\n```';
    const body = micromark(md, { allowDangerousHtml: true, extensions: [gfm()], htmlExtensions: [gfmHtml()] });
    const htmlFile = join(workDir, `${shot.name}.html`);
    writeFileSync(htmlFile, cardHtml(shot, body));

    const outDir = join(LESSONS_DIR, shot.lesson, 'assets');
    mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, `${shot.name}.png`);

    await page.goto(`file://${htmlFile}`);
    await page.locator('.card').screenshot({ path: outFile, omitBackground: true });
    console.log(`✓ ${shot.lesson}/assets/${shot.name}.png`);
  }
} finally {
  await browser.close();
  rmSync(workDir, { recursive: true, force: true });
}

console.log(`\nDone. Rendered: ${renderable.length}. Upload with: node workbench/scripts/upload-assets.mjs`);
