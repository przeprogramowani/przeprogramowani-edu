# 10xDevs 3 Ebook Illustrations Runbook

## Purpose

This runbook documents the final illustration workflow for `10xdevs3-ebook.md`.

Current scope:
- illustration assets only
- `21` approved assets total
- final public asset path: `/assets/10xdevs/ebook-evals/<file>.webp`
- manual NotebookLM infographics remain outside the automated pipeline

## Key Files

- Ebook markdown: `src/content/resources/10xdevs3-ebook.md`
- Asset spec: `scripts/ebook-illustrations/spec.json`
- Generator: `scripts/generate-ebook-illustrations.ts`
- Manifest: `scripts/ebook-illustrations/generation-manifest.json`
- Approval state: `scripts/ebook-illustrations/approvals.json`
- Review record: `scripts/ebook-illustrations/review.md`
- NotebookLM brief: `scripts/ebook-illustrations/notebooklm-infographic-brief.md`
- Output directory: `public/assets/10xdevs/ebook-evals/`

## Prerequisites

- Run from the repo root: `projects/edu-platform`
- Install dependencies: `npm install`
- Set `OPENROUTER_API_KEY`

The generator automatically loads environment variables from:
- `.env.local`
- `.env`
- shell environment

Required variable:
- `OPENROUTER_API_KEY`

## Validation Commands

Validate spec and output directory resolution:

```bash
npm run generate:ebook-illustrations -- --validate-only
```

Inspect planned work without generating:

```bash
npm run generate:ebook-illustrations -- --dry-run
```

Rebuild the site after content or asset changes:

```bash
npm run build
```

## Generation Commands

Generate one asset without touching approved files:

```bash
npm run generate:ebook-illustrations -- --asset hero-overview --attempts 2
```

Force-regenerate one asset intentionally:

```bash
npm run generate:ebook-illustrations -- --asset hero-overview --attempts 2 --force
```

Generate the full batch while preserving already approved outputs:

```bash
npm run generate:ebook-illustrations -- --attempts 2
```

Important behavior:
- attempt count is capped to `2`
- approved assets are skipped unless `--force` is used
- generated-but-unapproved assets are also skipped unless `--force` is used

## Approval Flow

1. Generate or regenerate the target asset.
2. Review the output in `public/assets/10xdevs/ebook-evals/`.
3. Inspect the latest successful manifest entry for that asset.
4. Copy the latest success metadata into `scripts/ebook-illustrations/approvals.json`.

Useful inspection command:

```bash
ruby -rjson -e 'data=JSON.parse(File.read("scripts/ebook-illustrations/generation-manifest.json")); id="hero-overview"; entry=data["entries"].reverse.find{|item| item["assetId"]==id && item["status"]=="success"}; puts JSON.pretty_generate(entry)'
```

Approval record fields:
- `approved`
- `approvedAt`
- `outputFile`
- `outputPath`
- `promptHash`
- `note`

Current source of truth for approved assets:
- `scripts/ebook-illustrations/approvals.json`

## Cost-Control Rules

- Keep `--attempts 2` as the maximum
- Use `--dry-run` before large reruns
- Prefer single-asset reruns over full forced batches
- Hero uses `2K`; section illustrations use `1K`
- Assets are converted to `.webp`
- Approved assets should not be regenerated casually

## NotebookLM Infographics

The automated pipeline does not generate final text-heavy infographics.

Use:
- `scripts/ebook-illustrations/notebooklm-infographic-brief.md`

That brief contains:
- chapter-by-chapter source chunk recommendations
- style guidance matched to the illustration set
- reusable prompt instructions

## Final Output Contract

- Markdown embeds use `/assets/10xdevs/ebook-evals/<file>.webp`
- Files are stored at `public/assets/10xdevs/ebook-evals/`
- Approved asset count: `21`
- Markdown embed count should match the approved asset count

Verification commands:

```bash
rg -n '/assets/10xdevs/ebook-evals/' src/content/resources/10xdevs3-ebook.md
```

```bash
npm run build
```

## Markdown Export Behavior

Current behavior is intentionally split between on-site rendering and downloaded markdown:
- the ebook page renders the source markdown with root-relative `/assets/...` image links
- the markdown download endpoint rewrites ebook illustration links to `https://platforma.przeprogramowani.pl/assets/...`

This keeps the source markdown and on-site reading flow unchanged while making the downloaded `.md` file work in markdown readers outside the platform context.

Export verification commands:

```bash
curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg 'https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/'
```

```bash
curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg '\]\\(/assets/10xdevs/ebook-evals/' && exit 1 || true
```

Current non-goals:
- no offline packaging
- no zip or multi-file export artifact
- no shared export refactor for lessons or checklists

If ebook asset delivery rules change later, update together:
- `src/content/resources/10xdevs3-ebook.md`
- `src/pages/10xdevs-3/ebook/markdown.astro`
- `scripts/ebook-illustrations/spec.json`
- `scripts/ebook-illustrations/approvals.json`
- `scripts/ebook-illustrations/generation-manifest.json`
