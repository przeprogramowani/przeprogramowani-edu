# Mermaid Diagrams — Render, Upload, and CDN Pipeline

How to generate, regenerate, and publish mermaid diagrams from lesson markdown files.

## Quick Start

From the monorepo root (`/Users/admin/code/przeprogramowani-sites`):

```bash
# Render all diagrams (skips unchanged via content-hash cache)
npm run render:mermaid --workspace=projects/edu-platform

# Upload changed PNGs to CDN (skips unchanged via MD5 cache)
npm run upload:diagrams --workspace=projects/edu-platform
```

Or from `projects/edu-platform/`:

```bash
node workbench/scripts/render-mermaid.mjs
node workbench/scripts/upload-diagrams.mjs

# Generate 10x branded variants (OpenRouter API, optional)
node workbench/scripts/transform-diagrams-10x.mjs --concurrency=3

# Upload including 10x variants
node workbench/scripts/upload-diagrams.mjs --include-10x
```

## Prerequisites

- **Node 22+**
- **`@mermaid-js/mermaid-cli`** — installed as a devDependency in `projects/edu-platform/package.json`
- **Chromium** — required by Puppeteer (mmdc's rendering engine). Install with:
  ```bash
  npx puppeteer browsers install chrome
  ```
- **AWS CLI** — required only for upload. Must be configured with credentials that can write to the `10xdevs-images` S3 bucket in `eu-central-1`.

## How It Works

### Pipeline Overview

```
Markdown with ```mermaid blocks
        ↓
  render-mermaid.mjs  (mmdc → SVG + PNG, injects <!-- rendered: ... --> comments)
        ↓
  upload-diagrams.mjs (aws s3 cp → CloudFront invalidation)
        ↓
  CDN: https://images.przeprogramowani.pl/diagrams/<stem>.png

  (optional) transform-diagrams-10x.mjs  (OpenRouter image-to-image → 10x branded PNGs)
        ↓
  upload-diagrams.mjs --include-10x
        ↓
  CDN: https://images.przeprogramowani.pl/diagrams/<stem>-10x.png
```

### 1. Rendering (`render-mermaid.mjs`)

The script:

1. Scans markdown files for `` ```mermaid `` code blocks.
2. Extracts each block and computes a SHA-256 content hash (first 16 chars).
3. Skips blocks whose hash matches the render cache (`.render-cache.json`) and whose output files exist.
4. Renders changed blocks to SVG + PNG via `mmdc` (mermaid CLI) with the project's dark-theme config, custom CSS (Inter font, rounded corners), and Puppeteer config.
5. Injects `<!-- rendered: ... | cdn: ... -->` comments into the source markdown immediately after each mermaid block.

**Output directory:** `workbench/assets/diagrams/`

**Output naming convention:** The file path relative to `workbench/` is slugified, with the block index appended:

```
workbench/lessons/m1-l3/lesson-draft.md  block 4
→ lessons-m1-l3-lesson-draft-4.{svg,png}
```

**Rendering config:**
- Theme: dark (`#0f172a` background)
- Font: Inter (Google Fonts)
- PNG scale: 2x (high DPI)
- Node border radius: 6px, cluster border radius: 8px
- Concurrency: 4 workers (up to 8, capped by CPU cores)
- Timeout: 60s per diagram

#### CLI Options

```bash
node workbench/scripts/render-mermaid.mjs [paths...] [flags]

# Positional arguments (optional — defaults to scanning all of workbench/)
workbench/lessons/m1-l1/          # scan a directory
workbench/lessons/m1-l1/lesson-draft.md  # single file

# Flags
--dry-run          # list diagrams without rendering
--force            # ignore cache, re-render everything
--concurrency=8    # parallel workers (default: 4, max: 8)
```

### 2. Uploading (`upload-diagrams.mjs`)

The script:

1. Scans `workbench/assets/diagrams/` for PNG files.
2. Computes MD5 hash of each file and compares against the upload cache (`.upload-cache.json`).
3. Uploads changed files to S3 bucket `10xdevs-images` with prefix `diagrams/` and `Cache-Control: public, max-age=86400`.
4. Creates a CloudFront invalidation for uploaded paths (distribution `E3GAMSDNKN6396`).

**CDN base URL:** `https://images.przeprogramowani.pl`

#### CLI Options

```bash
node workbench/scripts/upload-diagrams.mjs [flags]

--dry-run          # preview uploads without executing
--force            # re-upload all files (ignore cache)
--urls             # print CDN URLs for all PNGs and exit
--no-invalidate    # skip CloudFront invalidation
--include-10x      # also scan diagrams-10x/ for 10x branded variants
```

### 3. Link Injection

After rendering, the script modifies source markdown files in place. Each mermaid block gets a comment appended:

```markdown
```mermaid
flowchart LR
    A["Step 1"] --> B["Step 2"]
`` `
<!-- rendered: ../../assets/diagrams/lessons-m1-l1-lesson-draft-1.png | cdn: https://images.przeprogramowani.pl/diagrams/lessons-m1-l1-lesson-draft-1.png -->
```

Both paths are injected:
- **Local path** — relative from the markdown file to the PNG (for local authoring/preview)
- **CDN URL** — absolute HTTPS URL (for production)

If the comment already exists, it is replaced on re-render.

### 3. 10x Branded Variants (`transform-diagrams-10x.mjs`)

An optional step that transforms rendered PNGs into cinematic sci-fi HUD versions with 10xDevs branding via OpenRouter's image-to-image API (gpt-5.4-image-2).

The script:

1. Scans `workbench/assets/diagrams/` for source PNGs (output of the render step).
2. Extracts matching mermaid source code from lesson markdown (same regex as the render script).
3. Loads a style reference image (`.style-reference.png`) for visual consistency.
4. Sends each PNG + mermaid source + style reference + transformation prompt to OpenRouter.
5. Saves output as `{stem}-10x.png` in `workbench/assets/diagrams-10x/`.
6. Tracks generation in `.transform-manifest.json` and caches via `.transform-cache.json`.

**Output directory:** `workbench/assets/diagrams-10x/`

**Configuration:** `workbench/assets/diagrams-10x/.transform-spec.json` contains the prompt, model settings, and image config.

#### CLI Options

```bash
node workbench/scripts/transform-diagrams-10x.mjs [flags]

--dry-run          # list diagrams without API calls
--filter=<pattern> # only process stems matching substring (e.g. --filter=m1-l3)
--force            # ignore cache, re-generate all
--model=<id>       # override primary model
--concurrency=<N>  # parallel API calls (default: 1, max: 4)
```

#### Performance

- API calls take ~160s each. Use `--concurrency=3` for batch runs (~27 min for all 27 diagrams).
- Cost: ~$0.02-0.08 per diagram ($0.54-2.16 for a full pass).
- Cache skips unchanged diagrams (same source PNG hash + prompt hash).

## Caching

Two independent caches prevent unnecessary work:

| Cache | File | Key | Value | Cleared by |
|-------|------|-----|-------|------------|
| Render | `assets/diagrams/.render-cache.json` | Output stem (e.g. `lessons-m1-l1-lesson-draft-1`) | SHA-256 hash of mermaid source (16 chars) | `--force` flag |
| Upload | `assets/diagrams/.upload-cache.json` | PNG filename | MD5 hash of file contents | `--force` flag |
| Transform | `assets/diagrams-10x/.transform-cache.json` | Output stem | `{sourceHash, promptHash}` | `--force` flag |

Both caches are JSON files tracked in the diagrams directory but excluded from git (the directory has `.gitkeep`).

## CI/CD — GitHub Actions

**Workflow file:** `.github/workflows/render-upload-diagrams.yml`

**Triggers:**
- Push to `master` when any of these paths change:
  - `projects/edu-platform/workbench/lessons/**/*.md`
  - `projects/edu-platform/workbench/scripts/render-mermaid.mjs`
  - `projects/edu-platform/workbench/scripts/upload-diagrams.mjs`
- Manual dispatch (`workflow_dispatch`) with optional `force` checkbox

**What it does:**
1. Checks out code, installs Node 22, runs `npm ci`
2. Installs Chromium (`npx puppeteer browsers install chrome`)
3. Restores diagram cache from GitHub Actions cache (keyed by lesson markdown hashes)
4. Runs `render-mermaid.mjs` (with `--force` if manually triggered)
5. Runs `upload-diagrams.mjs` (with `--force` if manually triggered)

**Required GitHub secrets:**
- `GH_PKG_TOKEN` — GitHub Packages token for npm install
- `AWS_ACCESS_KEY_ID` — AWS credentials for S3 upload
- `AWS_SECRET_ACCESS_KEY` — AWS credentials for S3 upload

## Common Tasks

### Render all diagrams from scratch

```bash
node workbench/scripts/render-mermaid.mjs --force
```

### Render diagrams for a single lesson

```bash
node workbench/scripts/render-mermaid.mjs workbench/lessons/m1-l3/
```

### Render a single file (e.g. a video scenario)

```bash
node workbench/scripts/render-mermaid.mjs workbench/lessons/m1-l2/videos/video-stack-assess.md
```

### Preview what would be rendered without doing it

```bash
node workbench/scripts/render-mermaid.mjs --dry-run
```

### Check which PNGs are currently on the CDN

```bash
node workbench/scripts/upload-diagrams.mjs --urls
```

### Force re-upload everything to CDN

```bash
node workbench/scripts/upload-diagrams.mjs --force
```

### Upload without CloudFront invalidation

```bash
node workbench/scripts/upload-diagrams.mjs --no-invalidate
```

### Generate 10x branded variants for all diagrams

```bash
node workbench/scripts/transform-diagrams-10x.mjs --concurrency=3
```

### Generate 10x variants for a single lesson

```bash
node workbench/scripts/transform-diagrams-10x.mjs --filter=m1-l3 --concurrency=3
```

### Upload everything including 10x variants

```bash
node workbench/scripts/upload-diagrams.mjs --include-10x
```

### Manually trigger CI render + upload

Go to GitHub Actions → "Render & Upload Diagrams" → "Run workflow". Check "Force re-render and re-upload" if needed.

## The `/mermaid` Skill

The `/mermaid` Claude Code skill provides three modes:

| Mode | What it does |
|------|-------------|
| **render** | Extract mermaid blocks from a lesson markdown and render to SVG + PNG (calls `render-mermaid.mjs`) |
| **audit** | Validate diagrams against the 13-rule style guide (`workbench/mermaid-style-guide.md`) |
| **generate** | Create a new diagram from a natural-language description, following the style guide |
| **transform** | Generate 10x branded sci-fi HUD variants via OpenRouter (calls `transform-diagrams-10x.mjs`) |

Usage: type `/mermaid` in a Claude Code session and follow the prompts.

## Style Guide

All diagrams must follow the rules in `workbench/mermaid-style-guide.md`. Key points:

- Use `flowchart` (not `graph`). `LR` for pipelines, `TD` for hierarchies.
- Dark-mode palette: `#1e293b` primary fill, `#0f172a` container fill. Semantic stroke colors (blue/green/amber/red/purple/gray).
- Style all nodes or none — no partial styling.
- Only rectangles `["text"]` and diamonds `{"text"}` — no other shapes.
- Labels in Polish with diacritics; English for filenames, commands, skill names.
- Emoji only in styled diagrams, one per node at start, from the 14 defined semantic emojis.
- Target 3-8 nodes. Flag diagrams with >10 nodes.
- Lesson cross-references use `M1L4` format (not `m1-l4`).

## File Inventory

| File | Purpose |
|------|---------|
| `workbench/scripts/render-mermaid.mjs` | Render script (mmdc wrapper with caching and link injection) |
| `workbench/scripts/upload-diagrams.mjs` | Upload script (S3 + CloudFront) |
| `workbench/mermaid-style-guide.md` | 13-rule style guide for diagram authoring |
| `workbench/assets/diagrams/` | Output directory for rendered SVG + PNG files |
| `workbench/assets/diagrams/.render-cache.json` | Content-hash render cache |
| `workbench/assets/diagrams/.upload-cache.json` | MD5 upload cache (shared with 10x variants) |
| `workbench/assets/diagrams-10x/` | 10x branded diagram variants |
| `workbench/assets/diagrams-10x/.transform-spec.json` | Transform prompt, model config, style settings |
| `workbench/assets/diagrams-10x/.style-reference.png` | Style reference image for visual consistency |
| `workbench/assets/diagrams-10x/.transform-cache.json` | Source+prompt hash cache (gitignored) |
| `workbench/assets/diagrams-10x/.transform-manifest.json` | Append-only generation log (gitignored) |
| `workbench/scripts/transform-diagrams-10x.mjs` | Transform script (OpenRouter image-to-image) |
| `.github/workflows/render-upload-diagrams.yml` | CI workflow for automatic render + upload on push |
| `.claude/skills/mermaid/SKILL.md` | Claude Code `/mermaid` skill definition |
