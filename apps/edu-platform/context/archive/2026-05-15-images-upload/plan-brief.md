# Lesson-Assets Upload Pipeline — Plan Brief

> Full plan: `context/changes/images-upload/plan.md`

## What & Why

Today `workbench/scripts/upload-diagrams.mjs` ships rendered mermaid PNGs to the `images.przeprogramowani.pl` CDN, but lesson screenshots (e.g. `workbench/lessons/m1-l4/assets/context.png`) have no upload path — they live as relative `![](./assets/...)` references that don't render anywhere outside the editorial workbench. This change extends the script into a unified `upload-assets.mjs` that handles both classes of image and leaves an idempotent CDN URL breadcrumb in the source markdown.

## Starting Point

`upload-diagrams.mjs` discovers only `workbench/assets/diagrams/*.png` (plus `diagrams-10x/*.png` with `--include-10x`), shells out to `aws s3 cp` against `s3://10xdevs-images/diagrams/`, invalidates CloudFront, and caches uploads by **filename only** — a collision risk the moment two lessons own a `screenshot.png`. The diagram pipeline's idempotency and comment-writing twin, `render-mermaid.mjs`, already has the exact regex pattern this plan reuses for markdown writeback.

## Desired End State

A single command — `node workbench/scripts/upload-assets.mjs` — discovers diagrams and every supported lesson asset (png/jpg/jpeg/webp/gif/svg under `workbench/lessons/*/assets/**`), uploads what changed, invalidates CloudFront for the changed S3 keys, and appends/refreshes a `<!-- cdn: <url> -->` line beneath each `![](./assets/...)` reference in the lesson's markdown. Re-runs without source changes are no-ops on S3 and on disk.

## Key Decisions Made

| Decision                     | Choice                                                                       | Why (1 sentence)                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| S3 key layout                | `lessons/<lessonId>/assets/<...subpath>`                                     | Mirrors on-disk path; CDN URL reads like the source; bulk-delete by prefix is trivial. |
| Supported file extensions    | png, jpg/jpeg, webp, gif, svg                                                | Covers every realistic screenshot/diagram format writers will drop in.            |
| CLI surface                  | Rename to `upload-assets.mjs`; lesson + diagram upload both default-on; no opt-out flags | User-stated preference; keeps the mental model single-script.                     |
| Comment behavior             | Leave `![](./assets/foo.png)` untouched; append `<!-- cdn: <url> -->` below | Mirrors `render-mermaid.mjs` pattern; local preview still works.                  |
| Discovery scope              | `lessons/*/assets/**` recursive (with junk-dir guards)                       | Writers can organize sub-folders; current curriculum is flat but the cost is zero. |
| Orphan handling              | Upload anyway; warn loudly                                                   | Zero data loss; warning surfaces the mismatch without blocking authoring.         |
| Cache-key strategy           | Move from filename-only to full S3-key; migrate legacy keys in-place         | Fixes cross-lesson `screenshot.png` collision; one-shot, silent migration.        |

## Scope

**In scope:**
- Rename `upload-diagrams.mjs` → `upload-assets.mjs`
- Refactor around an `Entry { sourcePath, s3Key, cdnUrl, contentType }` shape
- Add lesson-asset discovery, upload, orphan warning
- Per-extension content-type via a mime map
- Markdown comment writeback (idempotent)
- Cache key migration (filename → S3-key)
- `--dry-run`, `--force`, `--urls`, `--no-invalidate`, `--include-10x` all continue to work

**Out of scope:**
- Rewriting `![](./assets/...)` to absolute CDN URLs (publishing-time concern)
- Opt-in/opt-out flags for the lesson-asset behavior
- Upload manifest JSON
- Retries / exponential backoff
- S3 garbage collection for deleted source files
- Bucket / region / CloudFront / cache-header changes

## Architecture / Approach

Two pure discoverers (`discoverDiagrams`, `discoverLessonAssets`) produce a single flat `Entry[]` list. The cache diff, upload loop, CloudFront invalidation, and `--urls` printer all consume that one list and key off `entry.s3Key`. A post-upload writeback walker groups successful lesson-asset uploads by `lessonId`, walks every `.md` file under that lesson (recursive, `assets/` excluded), and applies a render-mermaid-style "image + optional trailing comment" regex to refresh `<!-- cdn: ... -->` annotations.

## Phases at a Glance

| Phase                                                 | What it delivers                                                                                   | Key risk                                                                                  |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1. Rename + refactor to S3-key-keyed entries          | `upload-assets.mjs` exists; diagram pipeline produces byte-identical S3 PUTs; cache is S3-keyed    | Cache migration must rewrite legacy keys, else every diagram re-uploads on first run      |
| 2. Lesson-asset discovery + upload + orphan warning   | `lessons/<id>/assets/**` uploaded with correct content-types; orphans warned, not blocked         | Per-extension mime mapping needs to be exhaustive; nested sub-paths must round-trip exactly |
| 3. Markdown comment writeback                          | `<!-- cdn: <url> -->` appended/refreshed beneath every `![](./assets/...)` in the lesson's markdown | Regex must tolerate the optional trailing comment to stay idempotent across re-runs        |

**Prerequisites:** AWS CLI configured locally with write access to `10xdevs-images` and CloudFront-invalidation permission on distribution `E3GAMSDNKN6396`. No CI changes needed — this script is human-invoked only.

**Estimated effort:** ~1 session, ~3 phases. Implementation is shallow; most of the work is verification against the live S3 bucket and the markdown writeback regex.

## Open Risks & Assumptions

- The plan assumes `lessons/<lessonId>/` is always one level deep (e.g. `m1-l4`), which holds today; if the curriculum nests deeper later, the `lessons/*/assets/**` glob needs widening.
- The comment-writeback regex matches `![](./assets/<relpath>)` anywhere in the markdown — including, technically, inside fenced code blocks. Current corpus has no such case; if it appears, tighten by anchoring to line start.
- The orphan warning uploads anyway by design; long-term, this means the bucket can accumulate stale objects whose source files were deleted (acceptable for now, out of scope to garbage-collect).
- We assume no other tooling reads `workbench/assets/diagrams/.upload-cache.json` directly — if it does, the key-prefix change is a breaking contract.

## Success Criteria (Summary)

- `node workbench/scripts/upload-assets.mjs` uploads diagrams and lesson assets in one pass, prints CDN URLs, and writes idempotent `<!-- cdn: ... -->` comments into the source markdown.
- The diagram-upload behavior is identical to today's `upload-diagrams.mjs` (same S3 keys, same invalidation paths, same dry-run output for unchanged files).
- A second run with no source changes is a complete no-op (no S3 PUTs, no markdown writes, clean `git diff`).
