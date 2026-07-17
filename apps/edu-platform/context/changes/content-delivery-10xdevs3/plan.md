# 10xDevs3 Content Delivery Pipeline Fixes — Implementation Plan

## Overview

Fix three content delivery issues in the 10xDevs3 pipeline: (1) replace raw mermaid DSL blocks with CDN-hosted `<img>` tags, (2) auto-link prework bracket references like `[3.2]` to the corresponding prework lesson URLs, and (3) build a Circle-ready export step that converts inline `<code>` to `<strong>` (which Circle strips) and `<img>` to blockquote placeholders.

## Current State Analysis

The pipeline flows: `workbench/lessons/` → (transport) → `src/content-source/lessons10xDevs3/pl/` → (generate:lesson-html) → `src/content/lessons10xDevs3/pl/` → platform + Circle sync.

5 Polish lesson files generate HTML. The generation pipeline (`lessonHtmlGenerator.ts:167-208`) parses markdown, applies rehype transforms (including `rehypeMermaidContainer` which converts code fences to `<pre class="mermaid">`), and writes HTML with metadata headers. A single post-processing hook exists at line 183-186 for asset path rewriting.

Circle push (`utils/circle-lesson-backup/push.ts`) currently reads markdown from `backup/10xdevs-3ed/`, converts to HTML, and PATCHes Circle's API. Circle's sanitizer strips `<code>`, `<img>`, `<iframe>`, and many other tags but preserves `<strong>`, `<em>`, `<a>`, `<pre><code>`, and `<blockquote>`.

### Key Discoveries:

- 16 mermaid blocks across 3 lesson files (03, 04, 05) — all have `<!-- cdn-10x: URL -->` comments already in the generated HTML (`src/content/lessons10xDevs3/pl/03-m1l3-ai-powered-bootstrap.html:20-29`)
- Lesson 01 has 3 broken mermaid blocks using `******mermaid` delimiters instead of standard triple-backtick fences — these render as broken `<p>` text (`src/content-source/lessons10xDevs3/pl/01-m1l1-od-pomyslu-do-prd.md:49,156,241`)
- 14 prework references across 5 files, 7 unique bracket IDs: `[1.2]`, `[2.1]`, `[2.3]`, `[3.1]`, `[3.2]`, `[3.3]`, `[4.1]` — all render as literal text in HTML
- No English lesson or prework files exist yet — lookup table supports both languages for future use
- Existing test suite: `lessonHtmlGenerator.test.ts` (423 lines), `markdownLessonTransforms.test.ts` (112 lines) — uses vitest with jsdom, temp directory fixtures, and `generateLessonHtmlForSource()` as the main test entry point
- Existing `tagsToPlaceholders()` in `utils/circle-lesson-backup/utils/tag-placeholders.ts` already handles `<img>` → blockquote conversion

## Desired End State

After this plan is complete:

1. **Generated platform HTML** contains `<img src="https://images.przeprogramowani.pl/diagrams/...-10x.png" alt="Diagram">` where mermaid blocks + CDN comments previously appeared
2. **Prework references** like `[3.2]` in generated HTML are wrapped in `<a href="https://przeprogramowani-edu.pages.dev/external/10xdevs-3-prework/pl/10">[3.2]</a>`
3. **Lesson 01** has standard mermaid fences (fixed upstream) and renders diagrams correctly after the workbench pipeline runs
4. **Circle export** has a dedicated `prepare.ts` that reads platform HTML, converts `<code>` → `<strong>` and `<img>` → blockquote, and writes to `content/lessons10xDevs3/pl/` for inspection before push
5. All transforms have unit tests

Verification: `npm run generate:lesson-html` regenerates HTML. `npm run check:lesson-html` passes. Inspect any generated `.html` file to confirm mermaid blocks are replaced with images and prework brackets are linked. In `utils/circle-lesson-backup/`, `npm run circle:prepare` produces content ready for Circle.

## What We're NOT Doing

- Modifying the markdown → HTML rendering pipeline (`renderMarkdown()` in `markdownLessonTransforms.ts`) — all changes are post-processing on the generated HTML string
- Building English content — the lookup table supports `en` but no English files exist yet
- Automating the workbench pipeline for lesson 01 diagrams — the fix is upstream (delimiter correction), the render/upload is a manual step
- Modifying the existing `push.ts` backup-based flow — the new `prepare.ts` is additive
- Adding `pipeline:*` orchestration scripts — ~~those are a separate follow-up~~ added as Phase 4

## Implementation Approach

All three platform HTML transforms (mermaid → img, prework links) are pure string functions operating on the HTML output. They go into a new `lessonHtmlPostProcessing.ts` module, wired into `generateLessonHtmlForSource()` after the existing asset path rewrite.

The Circle export (`<code>` → `<strong>`) is a separate concern that lives in `utils/circle-lesson-backup/prepare.ts` — it reads the already-transformed platform HTML and applies Circle-specific adaptations.

---

## Phase 1: Platform HTML Post-Processing Transforms

### Overview

Add mermaid → CDN image replacement and prework link injection as post-processing steps in the lesson HTML generation pipeline. Create unit tests for both transforms.

### Changes Required:

#### 1. New post-processing module

**File**: `src/server/content/lessonHtmlPostProcessing.ts` (new)

**Intent**: Two pure string transform functions that operate on generated HTML body content. Kept separate from `markdownLessonTransforms.ts` (which operates at the rehype/AST level) and from `lessonHtmlGenerator.ts` (which orchestrates generation).

**Contract**:

`replaceMermaidWithCdnImages(html: string): string`
- Finds `<pre class="mermaid" data-language="mermaid">...</pre>` followed by `<!-- rendered: ... | cdn: ... -->` and `<!-- cdn-10x: URL -->` comments
- Replaces the entire block (pre + both comments) with `<img src="{cdn-10x URL}" alt="Diagram">`
- Must handle multi-line `<pre>` content and optional whitespace between elements
- If only `<!-- cdn: URL -->` exists (no `cdn-10x`), falls back to the `cdn:` URL
- Leaves `<pre class="mermaid">` blocks WITHOUT CDN comments untouched (they have no image to replace)

`injectPreworkLinks(html: string, language: 'pl' | 'en', baseUrl: string): string`
- Static lookup table mapping bracket notation to lessonId:

```typescript
const PREWORK_BRACKET_TO_LESSON_ID: Record<string, string> = {
  '1.1': '01', '1.2': '02', '1.3': '03',
  '2.1': '04', '2.2': '05', '2.3': '06', '2.4': '07',
  '3.1': '09', '3.2': '10', '3.3': '11', '3.4': '12', '3.5': '13',
  '4.1': '14', '4.2': '15', '4.3': '16',
};
```

- Finds `[X.Y]` patterns (where X.Y exists in the lookup table) and wraps with `<a href="{baseUrl}/external/10xdevs-3-prework/{language}/{lessonId}">[X.Y]</a>`
- Generic prework mentions without bracket IDs are left as plain text
- Must not match `[X.Y]` that's already inside an `<a>` tag (idempotency)

#### 2. Wire transforms into HTML generation

**File**: `src/server/content/lessonHtmlGenerator.ts`

**Intent**: Call the two new post-processing functions on `bodyHtml` after the existing asset path rewrite (line 186), before the HTML is wrapped in the generated template.

**Contract**: Add calls to `replaceMermaidWithCdnImages()` and `injectPreworkLinks()` in `generateLessonHtmlForSource()` after line 186. The `injectPreworkLinks` call uses `target.defaultLanguage ?? 'pl'` for the language and a production base URL constant (`https://przeprogramowani-edu.pages.dev`). Export the base URL constant for testability.

#### 3. Unit tests

**File**: `src/server/content/lessonHtmlPostProcessing.test.ts` (new)

**Intent**: Test both transform functions with representative input/output pairs covering: standard mermaid block replacement, missing cdn-10x fallback, mermaid without CDN comments left untouched, prework bracket linking, multiple brackets in one sentence (`[3.1] i [3.3]`), brackets already inside `<a>` not double-wrapped, unknown bracket IDs left alone, and both `pl`/`en` language variants.

#### 4. Regenerate HTML

**Intent**: Run `npm run generate:lesson-html` to apply the new transforms to all lesson files. Verify with `npm run check:lesson-html`.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npx vitest run src/server/content/lessonHtmlPostProcessing.test.ts`
- Existing tests still pass: `npm run test`
- Generated HTML is up to date: `npm run check:lesson-html`
- Type checking passes: `npx tsc --noEmit`

#### Manual Verification:

- Inspect `src/content/lessons10xDevs3/pl/03-m1l3-ai-powered-bootstrap.html` — mermaid `<pre>` blocks replaced with `<img src="https://images.przeprogramowani.pl/diagrams/...-10x.png" alt="Diagram">`
- Inspect `src/content/lessons10xDevs3/pl/02-m1l2-od-chatbota-do-agenta.html` — `[3.2]` wrapped in `<a>` tag pointing to `/external/10xdevs-3-prework/pl/10`
- CDN comments removed from output (no `<!-- rendered:` or `<!-- cdn-10x:` in generated HTML)
- Start dev server (`npm run dev`) and view a lesson with diagrams — images load from CDN
- Verify prework links are clickable and navigate to the correct prework lesson

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Upstream Mermaid Fix for Lesson 01

### Overview

Fix the broken `******mermaid` delimiters in lesson 01's upstream source so mermaid blocks are properly parsed. After fixing, the workbench pipeline must be run manually to render, transform, upload diagrams, and re-transport the lesson.

### Changes Required:

#### 1. Fix mermaid delimiters in upstream source

**File**: `workbench/lessons/m1-l1/lesson-draft.md`

**Intent**: Replace all `******mermaid` opening delimiters with standard ` ```mermaid ` and all standalone `******` closing delimiters with ` ``` `. Three occurrences at approximately lines 43, 150, 235.

**Contract**: `******mermaid` → ` ```mermaid ` (opening), `******` (on its own line, closing a mermaid block) → ` ``` ` (closing). No other content changes.

#### 2. Manual workbench pipeline steps

**Intent**: After the delimiter fix, the user runs the workbench pipeline to render lesson 01's mermaid diagrams, create styled versions, upload to CDN, and inject CDN comments into the source.

**Contract**: From `workbench/`:
1. `npm run render` — generates PNG from mermaid DSL
2. `npm run transform` — creates 10x-styled PNGs
3. `npm run upload` — uploads to S3, invalidates CloudFront
4. `npm run transport -- m1-l1` — re-transports to content-source with CDN comments

#### 3. Regenerate HTML

**Intent**: After transport, regenerate the HTML to pick up the newly-injected CDN comments and apply the Phase 1 mermaid → img transform.

**Contract**: Run `npm run generate:lesson-html` from `projects/edu-platform/`.

### Success Criteria:

#### Automated Verification:

- Generated HTML is up to date: `npm run check:lesson-html`
- No `******mermaid` patterns remain: `grep -r '\\*\\*\\*\\*\\*\\*mermaid' workbench/lessons/m1-l1/`

#### Manual Verification:

- Inspect `src/content/lessons10xDevs3/pl/01-m1l1-od-pomyslu-do-prd.html` — lesson 01 now has `<img>` tags for its 3 diagrams (no broken `<p>` text from malformed mermaid)
- CDN images load when viewing the lesson in browser

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Circle Prepare Pipeline

### Overview

Create a new `prepare.ts` script in `utils/circle-lesson-backup/` that reads generated platform HTML, applies Circle-specific transforms (`<code>` → `<strong>`, `<img>` → blockquote placeholder), and writes the result to a persistent `content/lessons10xDevs3/pl/` directory for inspection before pushing to Circle.

### Changes Required:

#### 1. New prepare script

**File**: `utils/circle-lesson-backup/prepare.ts` (new)

**Intent**: Read generated platform HTML files from `projects/edu-platform/src/content/lessons10xDevs3/pl/*.html`, extract the body content (strip generated wrapper), apply Circle-specific transforms, and write the result to `content/lessons10xDevs3/pl/` inside the circle-lesson-backup directory.

**Contract**:

`replaceInlineCodeWithStrong(html: string): string`
- Replaces `<code>text</code>` with `<strong>text</strong>` for inline code only
- Must NOT replace `<code>` inside `<pre>` blocks (block-level code is preserved by Circle)
- Handles nested content and attributes

`prepareForCircle(html: string): string`
- Calls `replaceInlineCodeWithStrong()`
- Calls existing `tagsToPlaceholders()` from `utils/tag-placeholders.ts` for `<img>` → blockquote conversion
- Returns Circle-ready HTML

The script:
- Reads all `.html` files from the platform content directory
- Extracts body content between `<body>` and `</body>` tags
- Applies `prepareForCircle()` transform
- Writes output to `content/lessons10xDevs3/pl/{original-filename}.html`
- Prints a summary of files processed

#### 2. Circle lesson mapping config

**File**: `utils/circle-lesson-backup/content/10xDevs3/lesson-map.json` (new)

**Intent**: Map platform lesson filenames to Circle's sectionId and lessonId so the push step knows which Circle lesson to update.

**Contract**: JSON object keyed by platform filename (without extension), containing `sectionId` (number) and `circleLessonId` (number) for each lesson. These values come from the existing `backup/10xdevs-3ed/*.md` frontmatter. The implementer extracts them once and commits the mapping.

#### 3. npm scripts

**File**: `utils/circle-lesson-backup/package.json`

**Intent**: Add `circle:prepare` and `circle:prepare:dry` scripts.

**Contract**:
- `"circle:prepare": "tsx prepare.ts"` — runs the full prepare pipeline
- `"circle:prepare:dry": "tsx prepare.ts --dry-run"` — shows what would be written without writing

#### 4. Unit tests for inline code transform

**File**: `utils/circle-lesson-backup/prepare.test.ts` (new)

**Intent**: Test `replaceInlineCodeWithStrong()` with cases: basic inline `<code>` → `<strong>`, `<code>` inside `<pre>` left untouched, multiple inline codes in one paragraph, `<code>` with attributes, and empty `<code>` tags.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npx vitest run prepare.test.ts` (from `utils/circle-lesson-backup/`)
- Existing circle-lesson-backup tests still pass: `npm run test`
- Type checking passes

#### Manual Verification:

- Run `npm run circle:prepare` and inspect `content/lessons10xDevs3/pl/` output
- Verify inline `<code>` tags are replaced with `<strong>` in the output
- Verify `<img>` tags are converted to blockquote placeholders with CDN links
- Verify `<pre><code>` blocks are preserved (block-level code untouched)
- Compare output against Circle's known allowlist to confirm compatibility

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Pipeline Orchestration Scripts

### Overview

Add chained npm scripts that compose the atomic steps into common workflows. Three scoped chains (assets, publish, circle) live in their respective workspaces, plus a full end-to-end conductor script in workbench and a root-level entry point for CI/convenience.

### Changes Required:

#### 1. Workbench chained scripts

**File**: `workbench/package.json`

**Intent**: Add `pipeline:assets` and `pipeline:publish` scripts that compose existing atomic steps.

**Contract**:
- `"pipeline:assets": "npm run render && npm run transform && npm run upload"` — renders mermaid, creates 10x-styled PNGs, uploads to CDN
- `"pipeline:publish": "npm run transport && npm run -w ../projects/edu-platform generate:lesson-html"` — transports draft to content-source and regenerates HTML (cross-workspace call to edu-platform)

#### 2. Circle chained script

**File**: `utils/circle-lesson-backup/package.json`

**Intent**: Add `pipeline:circle` that composes prepare + push.

**Contract**:
- `"pipeline:circle": "npm run circle:prepare && npm run push"` — prepares Circle-ready HTML and pushes to Circle API
- `"pipeline:circle:dry": "npm run circle:prepare:dry && npm run push:dry"` — dry-run of the full Circle chain

#### 3. Full pipeline conductor script

**File**: `workbench/scripts/pipeline-full.mjs` (new)

**Intent**: Single Node.js script that orchestrates the complete end-to-end pipeline with proper error handling, step timing, and partial-run support.

**Contract**:
- Ordered steps: `transport` → `generate:lesson-html` → `circle:prepare` → `circle:push`
- Flags: `--dry-run` (runs all steps in dry-run mode), `--from=<step>` (start from a specific step), `--to=<step>` (stop after a specific step)
- Each step prints name, timing, and ✅/❌ status
- Fails fast on first error with clear error message
- Uses `child_process.execSync` to invoke npm scripts in appropriate directories
- Invoked via `npm run pipeline:full` from workbench

#### 4. Workbench full pipeline script entry

**File**: `workbench/package.json`

**Intent**: Add `pipeline:full` script invoking the conductor.

**Contract**:
- `"pipeline:full": "node scripts/pipeline-full.mjs"` — runs the full end-to-end pipeline

#### 5. Root-level entry point

**File**: `package.json` (monorepo root)

**Intent**: Add `pipeline:10xdevs3` as a convenience entry point for the full chain.

**Contract**:
- `"pipeline:10xdevs3": "npm run pipeline:full --prefix projects/edu-platform/workbench"` — invokes the conductor from monorepo root

### Success Criteria:

#### Automated Verification:

- `npm run pipeline:assets --prefix projects/edu-platform/workbench -- --dry-run` exits 0 (from monorepo root)
- `npm run pipeline:publish --prefix projects/edu-platform/workbench -- --dry-run` exits 0 — requires transport `--dry-run` support
- `npm run pipeline:circle:dry` exits 0 (from `utils/circle-lesson-backup/`)
- `npm run pipeline:full --prefix projects/edu-platform/workbench -- --dry-run` exits 0

#### Manual Verification:

- Run `npm run pipeline:full -- --dry-run` from workbench — all steps print names/timing without executing
- Run `npm run pipeline:10xdevs3 -- --dry-run` from monorepo root — same output
- Verify `--from` and `--to` flags work: `npm run pipeline:full -- --from=circle:prepare --to=circle:prepare --dry-run`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

---

## Testing Strategy

### Unit Tests:

- `lessonHtmlPostProcessing.test.ts` — tests `replaceMermaidWithCdnImages()` and `injectPreworkLinks()` as pure functions
- `prepare.test.ts` — tests `replaceInlineCodeWithStrong()` and `prepareForCircle()`
- All edge cases: multi-line mermaid blocks, multiple bracket references, `<code>` inside `<pre>`, missing CDN comments, unknown bracket IDs, idempotency

### Integration Tests:

- Existing `generatedLessonHtml.test.ts` validates that generated HTML matches source (catches staleness after regeneration)
- `npm run check:lesson-html` runs the full check pipeline

### Manual Testing Steps:

1. View lessons with diagrams on dev server — CDN images load correctly
2. Click prework links — navigate to correct prework lesson page
3. (After Phase 3) Push prepared content to Circle staging — verify formatting preserved

## References

- Research: `context/changes/content-delivery-10xdevs3/research.md`
- Markdown transforms: `src/server/content/markdownLessonTransforms.ts:62-102`
- HTML generator: `src/server/content/lessonHtmlGenerator.ts:167-208`
- Circle push: `utils/circle-lesson-backup/push.ts:47-141`
- Tag placeholders: `utils/circle-lesson-backup/utils/tag-placeholders.ts:36-47`
- CDN constants: `workbench/scripts/upload-assets.mjs:35-38`

## Progress

### Phase 1: Platform HTML Post-Processing Transforms

#### Automated

- [x] 1.1 Unit tests pass: `npx vitest run src/server/content/lessonHtmlPostProcessing.test.ts` — c504ed4f
- [x] 1.2 Existing tests still pass: `npm run test` — c504ed4f
- [x] 1.3 Generated HTML is up to date: `npm run check:lesson-html` — c504ed4f
- [x] 1.4 Type checking passes: `npx tsc --noEmit` — c504ed4f

#### Manual

- [x] 1.5 Mermaid `<pre>` blocks replaced with `<img>` tags in generated HTML — c504ed4f
- [x] 1.6 Prework `[X.Y]` brackets wrapped in `<a>` tags in generated HTML — c504ed4f
- [x] 1.7 CDN images load when viewing lessons in browser — c504ed4f
- [x] 1.8 Prework links are clickable and navigate to correct lesson — c504ed4f

### Phase 2: Upstream Mermaid Fix for Lesson 01

#### Automated

- [x] 2.1 Generated HTML is up to date: `npm run check:lesson-html` — 131434b6
- [x] 2.2 No `******mermaid` patterns remain in workbench source — 131434b6

#### Manual

- [x] 2.3 Lesson 01 HTML has `<img>` tags for its 3 diagrams — 131434b6
- [x] 2.4 CDN images load when viewing lesson 01 in browser — 131434b6

### Phase 3: Circle Prepare Pipeline

#### Automated

- [x] 3.1 Unit tests pass: `npx vitest run prepare.test.ts` — 45205061
- [x] 3.2 Existing circle-lesson-backup tests still pass — 45205061
- [x] 3.3 Type checking passes — 45205061

#### Manual

- [x] 3.4 `circle:prepare` produces output in `content/lessons10xDevs3/pl/` — 45205061
- [x] 3.5 Inline `<code>` replaced with `<strong>` in output — 45205061
- [x] 3.6 `<img>` converted to blockquote placeholders — 45205061
- [x] 3.7 `<pre><code>` blocks preserved in output — 45205061

### Phase 4: Pipeline Orchestration Scripts

#### Automated

- [x] 4.1 `pipeline:assets --dry-run` exits 0 from workbench — 98b8b1fd
- [x] 4.2 `pipeline:circle:dry` exits 0 from circle-lesson-backup — 98b8b1fd
- [x] 4.3 `pipeline:full -- --dry-run` exits 0 from workbench — 98b8b1fd
- [x] 4.4 `pipeline:10xdevs3 -- --dry-run` exits 0 from monorepo root — 98b8b1fd

#### Manual

- [x] 4.5 `pipeline:full -- --dry-run` prints step names and timing — 98b8b1fd
- [x] 4.6 `--from` and `--to` flags work correctly — 98b8b1fd
- [x] 4.7 `pipeline:10xdevs3` invokes conductor from monorepo root — 98b8b1fd
