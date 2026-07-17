# 10xDevs Editorial Workbench

This directory is the editorial workspace for creating 10xDevs 3.0 main-course lessons with Codex and Claude Code.

It is separate from the learner-facing platform content pipeline. Final publishing to `src/content*`, Circle, generated HTML, or Astro collections is handled outside this workbench.

## Core Flow

Use the lesson artifacts in this order:

1. `lesson-spec` - define the editorial contract for a lesson.
2. `lesson-grounding` - ground the spec or draft in credible sources and update schema source metadata.
3. `lesson-draft` - write Polish learner-facing lesson prose from the schema, spec, grounding, prework, and style guide.
4. `video-scenario` - prepare the recording scenario from the same lesson contract.
5. `rc-review` - review the release candidate against schema, spec, grounding, draft, and scenario.

## Add-On Skills

Two draft-to-production skills should be added next:

- `lesson-editor-pl` - refine `lesson-draft.md` into release-candidate Polish while preserving spec intent, grounding, claims, and course voice.
- `lesson-rc-review` - review the release candidate against `lessons-schema.json`, `lesson-spec.md`, `lesson-grounding.md`, `lesson-draft.md`, and `video-*.md` scenario files.

## Source Files

- `lessons-schema.json` - central curriculum contract for public 10xDevs 3.0 main-program lessons.
- `schemas/lessons-schema.schema.json` - structural JSON Schema for `lessons-schema.json`, including required fields and allowed enum values.
- `references/prework.md` - summary of prework lessons that main-course lessons may assume, deepen, or reference.
- `references/style.md` - house writing style guide (29 rules) for lesson prose.
- `references/10x-content-delivery.md` - how skills flow from toolkit to CLI to learner.
- `lessons/<lessonId>/lesson-spec.md` - lesson-level editorial contract.
- `lessons/<lessonId>/lesson-grounding.md` - research and source brief.
- `lessons/<lessonId>/lesson-draft.md` - Polish learner-facing draft.
- `lessons/<lessonId>/video-{video-slug}.md` - recording-ready screencast scenario for a specific video.

## Schema Role

`lessons-schema.json` defines order, dependencies, lesson boundaries, expected artifacts, side-effect tracking, and source metadata.
`schemas/lessons-schema.schema.json` defines the structural shape of that file for editor support, validation, and faster agent orientation.
`scripts/lesson-context.mjs <lessonId-or-title>` prints the target lesson contract, dependency/forward-neighbor boundaries, and a compact course map.

It is not a publishing manifest. Do not use it for Astro collection paths, Circle IDs, generated HTML metadata, frontmatter, deployment, or final content routing.

Grounding may update the target lesson with:

```json
"groundingSources": []
```

Do not mass-add empty fields across the schema unless a human explicitly asks for a schema migration.

## Scripts

All scripts live in `scripts/` and are runnable via `npm run` from this directory. Every script supports `--dry-run` to preview without side effects.

### lesson:context — Load lesson contract context

Prints a compact orientation bundle from `lessons-schema.json`: target lesson fields, dependency/forward-neighbor boundaries, and course map. Use it before lesson planning, grounding, drafting, editing, review, or video scenario work.

```bash
npm run lesson:context -- m3-l4
node scripts/lesson-context.mjs "Testy E2E" --json
node scripts/lesson-context.mjs m3-l4 --full
```

### transport — Copy drafts to content-source

Reads `lessons-schema.json` for ordering and titles, prepends YAML frontmatter to `lesson-draft.md`, and writes to `src/content-source/lessons10xDevs3/pl/`.

```bash
npm run transport              # all available drafts
npm run transport -- m1        # all lessons in module 1
npm run transport -- m1-l3     # single lesson
npm run transport:dry          # preview all
```

### render — Render mermaid diagrams to SVG/PNG

Scans markdown files for ` ```mermaid ` blocks, renders them via `mmdc` (@mermaid-js/mermaid-cli) to `assets/diagrams/`, and injects `<!-- rendered: ... -->` comments back into the source. Uses a content-hash cache to skip unchanged diagrams.

```bash
npm run render                        # scan all workbench markdown
npm run render -- lessons/m1-l3/      # scan a directory
npm run render -- lesson-draft.md     # single file
npm run render:dry                    # list without rendering
npm run render -- --force             # ignore cache
npm run render -- --concurrency=8     # parallel workers (default: 4)
```

### transform — Generate sci-fi HUD diagram variants

Takes rendered PNGs from `assets/diagrams/` and transforms them into stylized 10x variants via OpenRouter image-to-image API. Output goes to `assets/diagrams-10x/`. Requires `OPENROUTER_API_KEY` in `.env.local`.

```bash
npm run transform                         # transform all uncached
npm run transform:dry                     # list without API calls
npm run transform -- --filter=m1-l3       # only matching stems
npm run transform -- --force              # ignore cache
npm run transform -- --model=<id>         # override model
npm run transform -- --concurrency=2      # parallel calls (max 4)
```

### upload — Upload assets to S3 + CloudFront

Uploads diagram PNGs and lesson assets to S3 (`10xdevs-images` bucket), invalidates CloudFront, and writes `<!-- cdn: ... -->` comments into referencing markdown files. Requires configured `aws` CLI.

```bash
npm run upload                  # upload changed assets
npm run upload:dry              # preview without uploading
npm run upload -- --force       # re-upload all files
npm run upload:urls             # print CDN URL mapping
npm run upload -- --no-invalidate   # skip CloudFront invalidation
npm run upload -- --include-10x     # also upload diagrams-10x variants
```

### Typical pipeline

```bash
npm run render          # mermaid -> SVG/PNG
npm run transform       # PNG -> sci-fi 10x variants
npm run upload          # push to CDN
npm run transport       # drafts -> content-source
```

## Artifact Defaults

Default output paths:

```text
workbench/lessons/<lessonId>/lesson-spec.md
workbench/lessons/<lessonId>/lesson-grounding.md
workbench/lessons/<lessonId>/lesson-draft.md
workbench/lessons/<lessonId>/video-{video-slug}.md
```

Keep workbench artifacts editorial and platform-agnostic.

## Side-Effect Ledger

When lesson content changes materially, report:

```text
New claims introduced:
Claims removed:
Neighboring lesson references changed:
Prework references used:
Prework concepts repeated intentionally:
Potential duplicates:
Unsupported facts:
Video/text mismatches:
Needs human decision:
```

Use `(none)` when a section has no entries.
