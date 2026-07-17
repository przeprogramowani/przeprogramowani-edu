# Research input 2: Coupling map — edu-platform ↔ przeprogramowani-sites

Wide Scan of everything the extracted repo must replace, absorb or rewrite.
Every claim tagged `evidence` / `inference` / `unknown`.

## Scale

- `projects/edu-platform`: 503 MB on disk, 820 files in `src/`. [evidence: `du -sh`, `find | wc -l`]
- Bulk of the size is generated lesson HTML + assets under `src/content*` and `workbench/`. [inference]

## Coupling inventory

### C1 — `@przeprogramowani/common` (workspace package)

- Declared in `projects/edu-platform/package.json` dependencies: `"@przeprogramowani/common": "0.0.1"`. [evidence]
- Actual import surface is **narrow**: 7 files, all in `src/server/circle/`, importing only
  `@przeprogramowani/common/src/circle` (6×) and `@przeprogramowani/common/src/circle/tokens` (1×). [evidence: grep]
- The consumed subtree `projects/common/src/circle/` is 36K: `api/`, `course-config.ts`, `index.ts`, `tokens.ts`, `types.ts`. [evidence]
- Decision (gate 0): absorb as `libs/circle` in the new monorepo; rewrite the 7 import sites.

### C2 — root `utils/astro-5-adapter` (build-critical patches)

- `patch-content-datastore.js` — patches `astro@5.1.8` `MutableDataStore.writeToDisk()`
  to fix a data-store race that ships empty prework collections on Linux/CI.
  Invoked in TWO places:
  - root `postinstall` (`patch-astro-datastore`), [evidence: root package.json]
  - edu-platform `build` script via relative path `node ../../utils/astro-5-adapter/patch-content-datastore.js`. [evidence: edu package.json]
- `rewrite-deps.js` — root `postinstall` (`patch-cloudflare`), patches the Astro Cloudflare adapter. [evidence]
- Both MUST travel with the new repo (e.g. `tools/astro-patches/`) and keep running on
  postinstall + prebuild, or the CF build silently ships empty content. [inference from patch header comment]

### C3 — hoisted root dependencies

- The framework stack lives in ROOT `package.json` dependencies, not in the workspace:
  `astro@5.1.8`, `@astrojs/cloudflare@12.2.0`, `@astrojs/svelte@7.0.4`, `@astrojs/tailwind@5.1.5`,
  `@astrojs/check`, `@astrojs/compiler`, `@astrojs/sitemap`, `@inox-tools/astro-when`,
  `@tailwindcss/forms`, `@mailerlite/mailerlite-nodejs`, … [evidence: root package.json]
- edu-platform's own `package.json` declares only app-specific deps (supabase, airtable,
  sentry, cheerio, highlight.js, mermaid, phaser, resend, …). [evidence]
- The new repo's root must **explicitly declare the full merged set**, pinned to the same
  versions (astro is pinned exactly at 5.1.8 because of C2). [inference]
- Root devDependencies used by edu tests/lint (vitest, playwright config machinery,
  eslint/prettier/husky toolchain) also need merging. `unknown`: the exact minimal set —
  resolved empirically at the stage-3 success gate (install + build).

### C4 — Nx wiring

- Root `nx.json` defines `namedInputs` + `targetDefaults` (build dependsOn `^build`, `check`). [evidence]
- `projects/edu-platform/project.json` defines `deploy` / `deploy:preview` targets
  (wrangler pages deploy → CF Pages project `przeprogramowani-edu`). [evidence]
- CI drives everything through `npx nx affected -t lint check test` and `nx run edu-platform:build/deploy`. [evidence: quality-preview-deploy.yml:68-90,381-382]
- New repo replicates `nx.json` + per-project `project.json` (app + lib). [inference]

### C5 — CI workflows referencing edu-platform

- `quality-preview-deploy.yml` — build, preview deploy, gated e2e (`e2e-edu` job runs
  Playwright in `projects/edu-platform`), production deploy to `platforma.przeprogramowani.pl`,
  Slack notifications, Sentry link. [evidence: lines 26-27,121,148,194-206,302-656]
- `refresh-circle-backup.yml` — scheduled; wipes `projects/edu-platform/src/content` and
  restores it from `utils/circle-lesson-backup/backup/*`. **Depends on root util
  `utils/circle-lesson-backup`** (also root script `10x:circle:backup`). [evidence:36-38]
- `render-upload-diagrams.yml` — triggers on `projects/edu-platform/workbench/lessons/*/lesson-draft.md`. [evidence:7-8]
- `impl-review.yml`, `refresh-10x-rag.yml` — no direct edu path references found. [evidence: grep]
- New repo needs ported equivalents; secrets required: CF (wrangler), Circle, Slack webhook,
  Sentry, Supabase, GH_PKG_TOKEN(?). `unknown`: full secret list — enumerated in runbook stage.

### C6 — root config inheritance

- `projects/edu-platform/tsconfig.json` extends `../../tsconfig.json`
  (which extends `astro/tsconfigs/strict`). [evidence]
- Root ESLint/Prettier/husky/lint-staged apply repo-wide (`lint` script at root). [evidence]
- New repo gets its own root `tsconfig.json` (same options inlined), eslint + prettier
  configs, husky pre-commit. [inference]

### C7 — root scripts operating on edu-platform

- `10x:publish`, `10x:assets*`, `10x:generate`, `10x:check`, `10x:prep`, `10x:i18n:*` —
  all shell out into `projects/edu-platform` / its `workbench`. [evidence: root package.json]
- `workbench/` lives inside edu-platform with its own `package.json` (`workbench-scripts`),
  so it moves for free; only the ROOT-level `10x:*` aliases must be recreated at the new root. [evidence]

### C8 — root util `utils/circle-lesson-backup`

- Used by `10x:circle:backup` + `refresh-circle-backup.yml` to restore `src/content`. [evidence]
- Functionally belongs to edu-platform → moves into the new repo (`tools/circle-lesson-backup`). [inference]
- **Correction (caught by extraction `--check` gate):** it ALSO imports
  `@przeprogramowani/common/src/circle` in 4 files (`index.ts`, `push.ts`,
  `src/course-display.ts`, `src/file-utils.ts`) + tsconfig paths — same rewrite
  as C1 applies. Additionally `projects/edu-platform/test-real-lesson.js` (loose
  debug script) and `workbench/lessons-schema.json` (doc example) reference the
  backup path. [evidence: extract.mjs check output]

### C9 — `.npmrc` / GH Packages

- Root `preinstall` appends a GH Packages token line to `.npmrc` when `GH_PKG_TOKEN` is set. [evidence]
- `unknown`: which dependency needs it (possibly none for edu after absorbing common) —
  verified at the stage-3 install gate.

### C10 — gate-5 scope extension: 10x-assistant, 10x-rag, slides

Added to the extraction on user decision (2026-07-17). Coupling audit:

- **Zero code coupling** with edu-platform or `@przeprogramowani/common` in all three
  (grep over src for imports: no hits). [evidence]
- `10x-assistant` (Astro ^5.14 + React 19 + Tailwind 4, own dependency set — NOT the
  pinned astro 5.1.8 stack; `tools/astro-patches` does not apply to it): CF Pages project
  `10x-assistant`, deploy targets in own `project.json`; env schema wants OPENAI/CHROMA vars. [evidence]
- `10x-rag`: not an npm workspace in the source repo (own `package-lock.json`, workflow
  does `npm ci` in-dir); ingests HTML from its own `data/source`; 1.8M total. [evidence]
- **Data-plane pair**: `10x-assistant/src/services/ragRetrievalService.ts` reads the Chroma
  collections that `10x-rag/src/ingest.ts` writes (`lessonToCollectionName`) — they must
  live in the same repo or be versioned in lockstep. [evidence]
- **Correction (caught by the build gate):** the pair is ALSO code-coupled —
  `ragRetrievalService.ts` imports `../../../10x-rag/src/lib/query-service.js` via a
  RELATIVE path (bundled into the assistant's SSR build). The initial "zero code coupling"
  claim missed relative cross-project imports (grep covered package imports only).
  Consequence: `10x-rag` must stay a filesystem SIBLING of `10x-assistant` →
  it lands in `apps/10x-rag` (still not an npm workspace), not `tools/`. [evidence:
  nx build failure "Could not resolve ../../../10x-rag/src/lib/query-service.js"]
- `slides`: React+Vite deck, no CI references, no cross-imports. [evidence]

## What does NOT couple (checked, clean)

- No other workspace imports FROM edu-platform (it is a leaf app). [inference: workspaces
  build independently in CI; not exhaustively grepped — treat as low-risk assumption]
- Auth/content pipelines are self-contained under `projects/edu-platform/src` + `workbench`. [evidence: 10xdevs4-modularization research 05]
