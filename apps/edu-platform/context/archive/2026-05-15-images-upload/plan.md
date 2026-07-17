# Lesson-Assets Upload Pipeline Implementation Plan

## Overview

Extend `workbench/scripts/upload-diagrams.mjs` into a unified `upload-assets.mjs` that uploads both diagrams (current behavior, unchanged) and lesson assets (new). Lesson assets live under `workbench/lessons/<lessonId>/assets/**`, get uploaded to `s3://10xdevs-images/lessons/<lessonId>/assets/<...>`, and the script appends/refreshes an idempotent `<!-- cdn: <url> -->` comment beneath every `![](./assets/<relpath>)` reference in the lesson's markdown.

## Current State Analysis

- `workbench/scripts/upload-diagrams.mjs` discovers only `workbench/assets/diagrams/*.png` (and `diagrams-10x/*.png` with `--include-10x`), uploads via `aws s3 cp` to `s3://10xdevs-images/diagrams/<file>`, then issues a CloudFront invalidation for `/diagrams/<file>` paths on distribution `E3GAMSDNKN6396`. (`workbench/scripts/upload-diagrams.mjs:85-99,162-191,199-219`)
- The upload cache (`workbench/assets/diagrams/.upload-cache.json`) is keyed by **filename only** — `{"foo.png": "<md5>"}`. With lessons added, two lessons could legitimately both have `screenshot.png`, so the cache must move to S3-key granularity (`{"diagrams/foo.png": "<md5>", "lessons/m1-l4/assets/context.png": "<md5>"}`).
- Cache-Control header is `public, max-age=86400` for all PNGs. (`workbench/scripts/upload-diagrams.mjs:31`)
- `render-mermaid.mjs` establishes the back-reference comment pattern this plan mirrors: a regex matches the source block plus an optional trailing comment line, strips the old comment if present, and appends a freshly built one. (`workbench/scripts/render-mermaid.mjs:245-256`)
- Lesson assets actually on disk today: only `workbench/lessons/m1-l4/assets/context.png` exists. Several other lesson drafts reference `./assets/<file>` paths whose files have not been committed yet — the new script will be near-empty on first run, then grow as drafts mature.
- Image references in lesson markdown use the canonical form `![](./assets/<file>)` per the workbench style guide; m1-l5 RC review flagged backtick-wrapped variants as defects, so we can assume the syntax is stable.

## Desired End State

A single command `node workbench/scripts/upload-assets.mjs` discovers every diagram PNG and every supported lesson asset, uploads only changed files, invalidates CloudFront for changed paths, prints CDN URLs, and rewrites lesson markdown to carry a fresh `<!-- cdn: <url> -->` comment beneath each image reference. Re-running with no source changes is a no-op on S3 and a no-op on disk. Existing diagram callers continue to work; `--include-10x`, `--dry-run`, `--force`, `--urls`, and `--no-invalidate` behave the same as today.

### Key Discoveries

- Comment-back idempotency pattern is already proven in `render-mermaid.mjs:245-256` (regex captures optional trailing comment, strip-and-rebuild).
- Cache key collision risk is real: `m1-l1/assets/screenshot.png` and `m2-l1/assets/screenshot.png` would both write `screenshot.png` into the current cache and clobber each other's md5 — the entry that lost the race would re-upload every run.
- Only `aws s3 cp` is used today (not `aws s3api put-object`); to pass per-file content-type the existing flag-builder must branch on extension. The current code hardcodes `--content-type image/png` (`workbench/scripts/upload-diagrams.mjs:174`).
- CloudFront invalidation paths must include the full S3 key (`/lessons/m1-l4/assets/context.png`), not just the basename.
- No CI/cron references this script — it's manual-only — so the rename is safe.

## What We're NOT Doing

- Not rewriting `![](./assets/foo.png)` markdown references to absolute CDN URLs. The relative ref stays; only a sibling HTML comment is added. (Publishing-time CDN substitution is a separate concern, out of scope.)
- Not adding any opt-in/opt-out flags for the lesson-asset behavior — it runs unconditionally. (`--include-10x` stays as-is for the diagram-variant case, which is a different axis.)
- Not adding a JSON manifest output for uploaded lesson assets.
- Not enforcing a flat or canonical structure inside `assets/` — writers can organize freely; the script preserves sub-paths in S3 keys.
- Not adding upload retries or exponential backoff — current single-attempt + per-file error reporting is preserved.
- Not changing the CloudFront distribution, bucket, region, or `max-age=86400` cache header.
- Not adding deletion / GC of stale S3 objects whose source files were removed.

## Implementation Approach

Refactor first, extend second, write back third — three phases corresponding to that order. The refactor in Phase 1 introduces a generic `Entry { sourcePath, s3Key, cdnUrl, contentType }` shape and re-keys the cache; Phase 2 adds a second discoverer that emits `Entry` values for lesson assets and a cross-reference pass for orphan detection; Phase 3 wires up the markdown comment writer using the same idempotent regex trick `render-mermaid.mjs` already uses.

## Critical Implementation Details

- **Cache migration is load-time, one-shot, silent.** The first time the new script reads `.upload-cache.json`, any top-level key without a `/` is rewritten in memory to `diagrams/<key>` before the entry list is diffed; the rewritten cache is saved back at the end of the run. Skip this and every previously cached diagram will re-upload on first run after the rename.
- **Comment-back regex must tolerate trailing whitespace and a single optional comment.** Mirror the pattern from `render-mermaid.mjs:245`: the image-match part captures the optional `\n<!-- cdn: ... -->` suffix, the replacement strips it, then re-appends a fresh comment. Without this, re-runs accumulate stacked comments.
- **Comment-back must be HTML-comment-safe in CommonMark.** Always prefix the appended comment with `\n` so it lands on its own line; without the newline, markdown renderers can attach the comment to the surrounding paragraph and break flow.

## Phase 1: Rename + refactor to S3-key-keyed entries (zero behavior change)

### Overview

Rename the script to `upload-assets.mjs`, factor the upload pipeline around a generic `Entry` shape, and migrate the cache from filename-keyed to S3-key-keyed. After this phase, diagram uploads produce identical S3 PUTs and identical CloudFront invalidations to today.

### Changes Required:

#### 1. Rename + repath

**File**: `workbench/scripts/upload-diagrams.mjs` → `workbench/scripts/upload-assets.mjs`

**Intent**: Move the file. No content change here — this is just to anchor the rename so subsequent steps land in the new file.

**Contract**: New file path is `workbench/scripts/upload-assets.mjs`. Old path no longer exists in the working tree.

#### 2. Introduce the `Entry` shape and refactor discovery

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: Replace the `pngEntries: { file, dir }[]` shape with a richer per-entry record that already carries the S3 key, CDN URL, and content-type. Diagrams flow through this shape unchanged.

**Contract**: A pure function `discoverDiagrams() → Entry[]` produces, for each `*.png` in `DIAGRAMS_DIR` (and `DIAGRAMS_10X_DIR` when `--include-10x`):

```text
Entry {
  sourcePath: string  // absolute path on disk
  s3Key:      string  // e.g. "diagrams/foo.png" or "diagrams/foo-10x.png"
  cdnUrl:     string  // CDN_BASE + "/" + s3Key
  contentType: string // "image/png"
}
```

The `cdnUrl(file)` and `s3Uri(file)` helpers are deleted in favor of `entry.cdnUrl` and `s3://${S3_BUCKET}/${entry.s3Key}` built inline.

#### 3. Cache key migration

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: Cache reads must transparently upgrade legacy filename-only keys to S3-keyed form so previously uploaded diagrams do not re-upload after the rename.

**Contract**: `loadCache()` returns an object whose keys are all S3 keys. If a parsed cache entry's key contains no `/`, it is rewritten in memory to `diagrams/<key>` before being returned. The cache file remains at `workbench/assets/diagrams/.upload-cache.json` for backward-compat. `saveCache()` writes only S3-keyed entries.

#### 4. Upload + invalidate path-through using Entry

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: The upload loop and CloudFront invalidation loop should consume `Entry.s3Key` and `Entry.contentType` directly. No more hardcoded `image/png`. No more basename-only invalidation paths.

**Contract**: `aws s3 cp <sourcePath> s3://<bucket>/<s3Key> --content-type <contentType> --cache-control <CACHE_CONTROL> --region <region>`. Invalidation paths are `/<s3Key>` for each successful upload. The diff key (`cache[s3Key] === hash`) becomes the cache lookup.

#### 5. `--urls` output uses CDN URLs from Entry

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: `--urls` mode prints one CDN URL per entry, computed from `entry.cdnUrl`.

**Contract**: Output format unchanged (one URL per line). Order matches discovery order.

### Success Criteria:

#### Automated Verification:

- The renamed script exists at `workbench/scripts/upload-assets.mjs` and the old path is gone: `test -f workbench/scripts/upload-assets.mjs && ! test -f workbench/scripts/upload-diagrams.mjs`
- `node workbench/scripts/upload-assets.mjs --urls` prints the same URLs as the pre-rename script printed (same set, same order)
- `node workbench/scripts/upload-assets.mjs --dry-run` with the legacy cache in place reports `0 changed since last upload` for an unmodified diagrams directory
- After running once, `.upload-cache.json` contains only keys that include a `/` (i.e., all migrated to `diagrams/<file>` form)

#### Manual Verification:

- Spot-check the cache file before and after: legacy `"foo.png"` keys become `"diagrams/foo.png"` with the same md5
- A `--dry-run` invocation against a deliberately touched diagram PNG lists it as changed with target key `diagrams/<file>`
- `aws s3 ls s3://10xdevs-images/diagrams/` reveals no spurious new uploads from the rename itself

**Implementation Note**: Pause here for human confirmation that the diagram flow still behaves identically before adding the lesson-asset path in Phase 2.

---

## Phase 2: Lesson-asset discovery, upload, and orphan warning

### Overview

Add a second discoverer for `workbench/lessons/<id>/assets/**` and merge its `Entry` values into the upload pipeline established in Phase 1. Cross-reference each uploaded asset against `![](./assets/...)` mentions in the lesson's markdown to surface orphans (assets on disk that no draft references). Orphans upload anyway with a warning.

### Changes Required:

#### 1. Mime map for supported extensions

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: Drive the `--content-type` flag from the file extension so png, jpg/jpeg, webp, gif, and svg all upload with correct content-types.

**Contract**: A pure `mimeFor(extension): string | null` returns `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml`, or `null` for unsupported extensions. Unsupported extensions are skipped during discovery (not errors). `discoverDiagrams()` continues to filter to `.png` only — that pipeline is intentionally unchanged.

#### 2. Lesson-asset discoverer

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: Walk every `workbench/lessons/<lessonId>/assets/` directory recursively, emit one `Entry` per supported file, and skip junk directories (`node_modules`, `.git`, `.DS_Store`-like) defensively.

**Contract**: `discoverLessonAssets() → Entry[]` returns entries shaped:

```text
sourcePath  = <absolute path>
s3Key       = "lessons/<lessonId>/assets/<relativePathInsideAssetsDir>"
cdnUrl      = CDN_BASE + "/" + s3Key
contentType = mimeFor(extension)
```

`lessonId` is the directory name directly under `workbench/lessons/` (e.g. `m1-l4`). `relativePathInsideAssetsDir` preserves any sub-folders the writer organized into (e.g. `screenshots/foo.png` → `lessons/m1-l4/assets/screenshots/foo.png`). Recursion excludes `node_modules`, `.git`, and any entry whose basename starts with a dot.

#### 3. Merge lesson assets into the main pipeline

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: After Phase 1's diagram discovery runs, append lesson-asset entries to the same list. Everything downstream (cache diff, upload loop, CloudFront invalidation, summary printout) consumes the combined list.

**Contract**: The single `entries: Entry[]` array drives all downstream work. Summary output groups counts by prefix (`diagrams/` vs `lessons/`) so the user can see at a glance what was uploaded where.

#### 4. Orphan detection + warning

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: After lesson-asset discovery, scan markdown files under each `workbench/lessons/<lessonId>/` (recursive, excluding the `assets/` directory itself) for `![](./assets/<relpath>)` references. Any discovered asset whose `relpath` does not appear in any sibling markdown is logged as an orphan.

**Contract**: A pure `findReferencedAssets(lessonDir): Set<string>` returns the set of `./assets/<relpath>` strings mentioned in any `.md` file under `lessonDir` (recursive, `assets/` excluded). The orphan warning is `[orphan] <lessonId>/assets/<relpath> not referenced in any markdown — uploading anyway`. Orphans do not affect exit code.

#### 5. `--urls` output covers lesson assets

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: `--urls` prints every entry's CDN URL — diagrams and lesson assets in one stream.

**Contract**: Output adds one line per lesson-asset entry, following the same `entry.cdnUrl` formatting; order is diagrams first, then lesson assets (insertion order from the two discoverers).

### Success Criteria:

#### Automated Verification:

- `node workbench/scripts/upload-assets.mjs --dry-run` lists `lessons/m1-l4/assets/context.png` as a queued upload with CDN URL `https://images.przeprogramowani.pl/lessons/m1-l4/assets/context.png`
- Running the script with no lesson assets present produces no errors and the diagram pipeline still uploads its diff
- The mime check is exhaustive: each of `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg` resolves to the expected content type via the helper
- An asset deliberately placed in `lessons/<id>/assets/` with no markdown reference triggers the `[orphan]` warning line in stdout

#### Manual Verification:

- `aws s3 ls s3://10xdevs-images/lessons/m1-l4/assets/` after a real run contains `context.png` with content-type `image/png`
- Loading the CDN URL in a browser returns the PNG with `Cache-Control: public, max-age=86400`
- Dropping a fake `.jpg` into `workbench/lessons/m1-l4/assets/` and running shows it uploads with content-type `image/jpeg`
- A nested asset (e.g. `workbench/lessons/m1-l4/assets/screenshots/foo.png`) lands at S3 key `lessons/m1-l4/assets/screenshots/foo.png` with the expected CDN URL

**Implementation Note**: Pause here for human confirmation that lesson assets land at the expected S3 keys and that orphans surface correctly before wiring up the markdown comment writer in Phase 3.

---

## Phase 3: Markdown comment writeback

### Overview

After each successful lesson-asset upload, find every `![](./assets/<relpath>)` reference in markdown files under the asset's lesson directory and append/refresh a `\n<!-- cdn: <url> -->` line immediately below. Idempotent: re-running produces no diff if nothing changed.

### Changes Required:

#### 1. Reference-matching regex with optional trailing comment

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: Borrow the regex shape from `render-mermaid.mjs:245`. Match the image reference plus an optional `\n<!-- cdn: ... -->` suffix so a single `replace` call both strips the old comment and appends a fresh one.

**Contract**: For a given asset's `relpath` (the path inside the lesson's `assets/`), the regex matches `![<altText>](./assets/<relpath>)` optionally followed by `\n<!-- cdn: <anything-not-newline> -->`. The replacement is the matched image markdown plus `\n<!-- cdn: <cdnUrl> -->`. `altText` and any whitespace inside the parens are preserved verbatim from the match — we never edit what the writer wrote.

```js
const escaped = relpath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(
  String.raw`(!\[[^\]]*\]\(\.\/assets\/${escaped}\))(\n<!-- cdn: [^\n]+ -->)?`,
  'g',
);
```

This is the one non-obvious code shape worth pinning in the plan; everything else is straight refactoring.

#### 2. Writeback walker

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: After Phase 2's upload loop completes, group successful lesson-asset uploads by `lessonId`. For each lesson, list every `.md` file under `workbench/lessons/<lessonId>/` (recursive, `assets/` excluded), and for each markdown file run the regex above for every successfully uploaded asset belonging to that lesson. Write only when content changed.

**Contract**: A function `rewriteCommentsForLesson(lessonDir, uploadedAssets: Entry[]): { filesTouched: number, commentsWritten: number }` does the walk and rewrite. It reads each markdown file once, applies all regex replacements in memory, then writes the result back if and only if the buffer changed. Returns counts for the summary printout.

#### 3. `--dry-run` extension for writeback

**File**: `workbench/scripts/upload-assets.mjs`

**Intent**: In `--dry-run` mode, the writeback walker reports which files *would* be modified and which `![](./assets/...)` references *would* receive a comment, without writing.

**Contract**: Dry-run output adds a `[writeback]` section listing `<markdown-file>:<asset-relpath> → <cdnUrl>` triples. No file writes occur.

### Success Criteria:

#### Automated Verification:

- Run the script with `m1-l4/assets/context.png` present and `lesson-draft.md` referencing it: `lesson-draft.md` ends up with `\n<!-- cdn: https://images.przeprogramowani.pl/lessons/m1-l4/assets/context.png -->` immediately after the image line
- Run the script a second time with no source changes: `git diff workbench/lessons/m1-l4/lesson-draft.md` is empty (idempotent)
- Re-run with a manually edited comment value (e.g. someone hand-changed the URL): the script restores the canonical comment exactly
- A markdown file with two references to the same asset receives the comment after **both** references (regex is global)
- `--dry-run` reports the would-be writes without modifying any file (`git diff` clean after dry-run)

#### Manual Verification:

- Open `workbench/lessons/m1-l4/lesson-draft.md` after a real run and confirm the comment is on its own line directly below `![](./assets/context.png)`, with no other formatting damage
- A reference inside a fenced code block (e.g. ```` `![](./assets/foo.png)` ````) does NOT receive a comment — confirm by inspecting m1-l5's known backtick-wrapped references (or by adding one as a test case) that the regex matches only un-escaped image syntax. *Note: the regex above does technically match inside fenced code; if this turns out to matter in practice, escape the regex to require the image to be at a line start. Validate manually and tighten only if needed.*
- A `videos/video-*.md` file inside the lesson directory that references the same asset also gets the comment (recursive walk works)

**Implementation Note**: This is the final phase; after manual verification, the change is ready for archival via `/10x-archive images-upload`.

---

## Testing Strategy

### Unit Tests

None — the script is a one-off maintenance tool with no existing test harness in `workbench/scripts/`. Behavior is verified via real `--dry-run` and live runs against the actual `workbench/` tree, which is small enough to inspect by eye.

### Integration Tests

Not applicable. The script's contract is "given the workbench file tree, produce these S3 PUTs, these CloudFront invalidations, these markdown edits"; that's faster to verify by running it than by mocking AWS.

### Manual Testing Steps

1. Before Phase 1: `cp workbench/assets/diagrams/.upload-cache.json /tmp/cache-before.json` to snapshot the legacy cache
2. After Phase 1: run `node workbench/scripts/upload-assets.mjs --dry-run` and confirm `0 changed since last upload`; diff `/tmp/cache-before.json` against the new cache and confirm only key-prefix changes
3. After Phase 2: temporarily add a junk `.jpg` to `workbench/lessons/m1-l4/assets/`, run `--dry-run`, confirm both the existing PNG and the new JPG are listed; remove the JPG
4. After Phase 2: add a `.png` to `lessons/m1-l4/assets/` with no markdown reference, run `--dry-run`, confirm the `[orphan]` warning fires; clean up
5. After Phase 3: run a real upload, confirm `workbench/lessons/m1-l4/lesson-draft.md` got the `<!-- cdn: ... -->` comment, then re-run and confirm `git diff` is clean

## Performance Considerations

- The discovery walk runs over a small file tree (current workbench is ~50 lesson `.md` files, ~25 diagram PNGs, 1 lesson asset). No streaming or batching needed; a synchronous walk is fine.
- `aws s3 cp` already runs sequentially in the existing script; we keep that.
- The markdown rewrite reads each `.md` file at most once per run and writes only when content changed — no thrash even with many uploaded assets per lesson.

## Migration Notes

- The cache-file migration is in-place and one-shot: legacy filename-only keys get rewritten to `diagrams/<file>` form on first load after the rename. No user action required, no flag needed.
- If something goes wrong and the user wants to fully reset: delete `workbench/assets/diagrams/.upload-cache.json` and re-run; `--force` is also available.
- No S3 bucket changes, no IAM changes, no CloudFront distribution changes.

## References

- Existing upload script: `workbench/scripts/upload-diagrams.mjs:85-219`
- Comment-back idempotency pattern: `workbench/scripts/render-mermaid.mjs:245-256`
- Workbench convention for image refs: `workbench/lessons/m1-l1/rc-review.md:41-43` and `workbench/lessons/m1-l5/rc-review.md:90`
- Mermaid skill reference for the comment shape: `workbench/.claude/skills/mermaid/SKILL.md:196,205`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Rename + refactor to S3-key-keyed entries (zero behavior change)

#### Automated

- [x] 1.1 The renamed script exists at `workbench/scripts/upload-assets.mjs` and the old path is gone — fb2e8f01
- [x] 1.2 `node workbench/scripts/upload-assets.mjs --urls` prints the same URLs as the pre-rename script printed — fb2e8f01
- [x] 1.3 `node workbench/scripts/upload-assets.mjs --dry-run` with the legacy cache reports 0 changed for an unmodified diagrams directory — fb2e8f01
- [x] 1.4 After running once, `.upload-cache.json` contains only keys that include a `/` — fb2e8f01

#### Manual

- [x] 1.5 Spot-check the cache file before and after: legacy keys become `diagrams/<file>` with the same md5 — fb2e8f01
- [x] 1.6 A `--dry-run` against a touched diagram PNG lists it as changed with target key `diagrams/<file>` — fb2e8f01
- [x] 1.7 `aws s3 ls s3://10xdevs-images/diagrams/` reveals no spurious new uploads from the rename itself — fb2e8f01

### Phase 2: Lesson-asset discovery, upload, and orphan warning

#### Automated

- [x] 2.1 `--dry-run` lists `lessons/m1-l4/assets/context.png` queued for the expected CDN URL — e7125ec4
- [x] 2.2 Script with no lesson assets present produces no errors and diagram pipeline still uploads its diff — e7125ec4
- [x] 2.3 Mime check is exhaustive: each of `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg` resolves to the expected content type — e7125ec4
- [x] 2.4 A deliberately orphaned asset triggers the `[orphan]` warning line — e7125ec4

#### Manual

- [x] 2.5 `aws s3 ls s3://10xdevs-images/lessons/m1-l4/assets/` after a real run contains `context.png` with content-type `image/png` — e7125ec4
- [x] 2.6 Loading the CDN URL in a browser returns the PNG with `Cache-Control: public, max-age=86400` — e7125ec4
- [x] 2.7 A fake `.jpg` dropped into the assets dir uploads with content-type `image/jpeg` — e7125ec4
- [x] 2.8 A nested asset lands at the expected nested S3 key with the expected CDN URL — e7125ec4

### Phase 3: Markdown comment writeback

#### Automated

- [x] 3.1 First real run writes the `<!-- cdn: ... -->` comment beneath the image reference in `lesson-draft.md` — a93efc8a
- [x] 3.2 Second run with no source changes leaves `git diff` clean (idempotent) — a93efc8a
- [x] 3.3 Re-run after a manual comment edit restores the canonical comment exactly — a93efc8a
- [x] 3.4 A markdown file with two references to the same asset receives the comment after both references — a93efc8a
- [x] 3.5 `--dry-run` reports the would-be writes without modifying any file — a93efc8a

#### Manual

- [x] 3.6 Comment lands on its own line directly below the image reference with no other formatting damage — a93efc8a
- [x] 3.7 Backtick-wrapped pseudo-references (if any) are inspected; tighten regex only if practice shows it matters — a93efc8a
- [x] 3.8 A `videos/video-*.md` file inside the lesson directory referencing the same asset also gets the comment — a93efc8a
