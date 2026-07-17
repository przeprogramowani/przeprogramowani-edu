# Markdown-to-HTML Content Pipeline Implementation Plan

## Overview

Implement a build-time Markdown-to-HTML content pipeline for `10xdevs-3` and `10xdevs-3-prework`.

The new model is:

- Authors edit Polish Markdown in a dedicated authoring tree under `src/content-source/...`.
- A generator renders Markdown-owned content into committed `.html` files under the current `src/content/...` collection directories.
- English `/en` HTML is produced by the translation pipeline and committed directly under `src/content/.../en`.
- Astro content collections consume `.html` only.
- CI/build verification fails when generated HTML is stale.

This replaces the previous mixed-source approach where Astro collections could consume both Markdown and HTML directly.

## Current State Analysis

The repository already has most of the rendering pieces, but they currently sit inside collection loaders rather than a build-time generation pipeline.

Today:

- `10xdevs-3` uses `mixedLocalLessonLoader()` and can consume both `.md` and `.html` from `src/content/lessons10xDevs3`.
- `10xdevs-3-prework` localized collections consume Markdown directly from `src/content/lessons10xDevs3Prework/{pl,en}`.
- `markdownLessonLoader()` parses frontmatter, strips the leading H1, renders Markdown to HTML, and adds Mermaid support.
- `htmlLessonLoader()` already defines the legacy HTML contract used by older course collections.
- Prework pair validation currently reads Markdown from the collection directory, so it must move to the new authoring source tree.

This means the implementation should not invent a new Markdown renderer. It should extract the existing renderer and metadata validation into reusable utilities, then use those utilities from a generator script and from tests.

## Desired End State

After implementation:

1. Editable Polish lesson Markdown for `10xdevs-3` and `10xdevs-3-prework/pl` lives under `src/content-source/...`.
2. Generated Polish/main-course lesson HTML is committed under the current collection directories:
   - `src/content/lessons10xDevs3/*.html`
   - `src/content/lessons10xDevs3Prework/pl/*.html`
3. English prework HTML is committed under `src/content/lessons10xDevs3Prework/en/*.html` as translation-pipeline output, not Markdown-generated output.
4. Astro collections for these courses load only `.html`.
5. Generated Polish/main-course HTML is legacy-compatible:
   - filename prefix still provides collection entry `id`
   - `<meta name="lesson-id" content="...">` still provides display name for `htmlLessonLoader()`
   - additional stable metadata preserves `lessonId`, `language`, `order`, source path, and generator identity
6. Translation-owned English HTML includes enough metadata for collection loading and navigation:
   - `<meta name="lesson-id" content="...">`
   - `canonical-lesson-id`
   - `language`
   - `order`
7. `npm run generate:lesson-html` writes generated Polish/main-course HTML.
8. `npm run check:lesson-html` fails if committed generated Polish/main-course HTML is stale.
9. `npm run build` runs the stale-output check before `astro build`.
10. Markdown download routes continue to use HTML-to-Markdown export behavior.
11. Existing external routes keep working:
   - `/external/10xdevs-3/{lessonId}`
   - `/external/10xdevs-3-prework/pl/{lessonId}`
   - `/external/10xdevs-3-prework/en/{lessonId}`
12. Pair validation compares PL Markdown source with EN HTML metadata, not EN Markdown.

### Key Discoveries

- `src/content.config.ts:63` wires `lessons10xDevs3` through `mixedLocalLessonLoader()`, which currently allows both Markdown and HTML collection inputs.
- `src/content.config.ts:77` and `src/content.config.ts:86` wire prework localized collections through `markdownLessonLoader()`, so Astro currently consumes Markdown directly.
- `src/server/content/markdownLessonLoader.ts:42` parses YAML frontmatter, and `src/server/content/markdownLessonLoader.ts:138` renders Markdown through Unified/Remark/Rehype.
- `src/server/content/markdownLessonLoader.ts:111` already adds the `mermaid` class to Mermaid code fences, and this behavior must be preserved in generated HTML.
- `src/server/content/htmlLessonLoader.ts:10` derives entry IDs from the first two filename characters.
- `src/server/content/htmlLessonLoader.ts:14` extracts lesson names from `<meta name="lesson-id" content="...">`.
- `src/server/content/preworkLessonPairs.test.ts:13` currently assumes prework Markdown lives under `src/content/lessons10xDevs3Prework`, so validation needs to follow the authoring tree.
- `src/server/content/externalMarkdownContent.ts:82` already treats collection entry `data.content` as rendered HTML, so routes should not need to know whether the HTML came from legacy exports or generated Markdown.

## What We're NOT Doing

- Not keeping Markdown as an Astro collection input for `10xdevs-3` or `10xdevs-3-prework`.
- Not keeping mixed Markdown/HTML collection loading for these courses after migration.
- Not making generated HTML uncommitted build output.
- Not serving original authoring Markdown from download routes in this plan.
- Not introducing slug URLs.
- Not changing access rules, external auth, or Circle fallback semantics for `10xdevs-3`.
- Not changing the translation pipeline itself; this plan prepares stable `.html` inputs for it.
- Not adding a rich lesson scaffold command in the first implementation.
- Not adding a separate metadata manifest.

## Implementation Approach

Use a dedicated authoring source tree for Markdown-authored content and a deterministic generator for the files it owns.

Authoring tree:

```text
src/content-source/
  lessons10xDevs3/
    01-example.md
  lessons10xDevs3Prework/
    README.md
    pl/
      01-1x1_co_potrafi_ai_w_2026r.md
```

Generated collection tree:

```text
src/content/
  lessons10xDevs3/
    01-example.html
  lessons10xDevs3Prework/
    pl/
      01-1x1_co_potrafi_ai_w_2026r.html
    en/
      01-1x1_co_potrafi_ai_w_2026r.html
```

The generator should:

1. Read Markdown files from `src/content-source`.
2. Parse and validate frontmatter.
3. Render Markdown to HTML using the same behavior as the current Markdown loader.
4. Wrap the result in a legacy-compatible HTML document.
5. Write deterministic `.html` files to generator-owned `src/content` targets.
6. In check mode, compare expected generator-owned output to files on disk and exit non-zero if any file is missing, stale, or extra.

The generator does not own `src/content/lessons10xDevs3Prework/en`; that directory is populated by the translation pipeline.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Build Timing**: `npm run build` should run `npm run check:lesson-html` before `astro build`. It should not write files during build.
- **Authoring Timing**: Authors run `npm run generate:lesson-html` after editing Markdown. This writes committed HTML.
- **Astro Collection Timing**: Astro collection loaders read generated HTML only. They do not render Markdown.
- **CI Timing**: CI should fail before or during build if generated HTML is stale.
- **No Request-Time Rendering**: External lesson routes should receive already-rendered HTML through collection entries.

### User Experience Specification

This is mostly an internal authoring workflow change. Learner-facing route behavior should stay unchanged.

- Localized prework lesson routes still render the same lesson shell and content.
- Main `10xdevs-3` local lessons still resolve before Circle fallback when generated HTML exists.
- Markdown download buttons still work by converting served HTML back to Markdown.
- Authors get a clear README that explains:
  - edit Markdown only in `src/content-source`
  - do not hand-edit generated `.html`
  - run `npm run generate:lesson-html`
  - run `npm run check:lesson-html`

### Performance & Optimization Strategy

- Generation happens in scripts, not request handlers.
- Collection loading becomes cheaper and simpler because it reads `.html` only.
- Stale-output checking should compare normalized deterministic strings, not parse DOM for every file unless needed.
- No cache layer is required for generated local files.

### State Management Sequencing

Authoring flow:

1. Author edits Polish Markdown in `src/content-source/...`.
2. Author runs `npm run generate:lesson-html`.
3. Generator validates metadata and renders PL/main-course `.html` into `src/content/...`.
4. Translation pipeline produces or updates matching EN `.html` in `src/content/.../en`.
5. Author commits Markdown source, generated PL/main-course HTML, and translation-owned EN HTML.
6. CI runs `npm run check:lesson-html`.
7. Astro build consumes HTML through `htmlLessonLoader()`.

External lesson request flow:

1. User opens an external lesson route.
2. Existing auth and access checks run.
3. Resolver reads a collection entry that now came from generated HTML.
4. Route extracts headings from `lesson.data.content`.
5. Existing layout renders the lesson.

### Debug & Observability Plan

- **Verification Method**: Focused Vitest tests for generator utilities plus `npm run check:lesson-html`, `npm run test -- ...`, and `npm run build`.
- **Logging Strategy**: Generator should print concise file-level changes in write mode and precise stale/missing/extra file diagnostics in check mode.
- **Debug Instrumentation**: Generated HTML should include stable trace metadata:
  - source Markdown path for generator-owned files
  - generator name/version string
  - content hash or source hash
- **Timestamp Policy**: Do not include generation timestamps in committed HTML because that creates noisy diffs.
- **Metrics**: No runtime metrics needed.

## Phase 1: Extract Markdown Rendering Utilities

### Overview

Refactor existing Markdown parsing/rendering out of `markdownLessonLoader.ts` so the collection loader, generator script, and tests can share one implementation.

### Changes Required

#### 1. Shared Markdown lesson utilities

**File**: `src/server/content/markdownLessonTransforms.ts`

**Changes**:

- Move or expose:
  - `parseFrontmatter`
  - `extractLeadingHeading`
  - `stripLeadingH1`
  - Markdown rendering with `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-raw`, and `rehype-stringify`
  - Mermaid `pre.mermaid` transform
- Export typed metadata interfaces:

```ts
export interface LessonFrontmatter {
  title?: string;
  hidden?: boolean;
  lessonId?: string;
  language?: 'pl' | 'en';
  order?: number;
  slug?: string;
}

export interface ParsedMarkdownLesson {
  sourcePath: string;
  frontmatter: LessonFrontmatter;
  title: string;
  bodyMarkdown: string;
  bodyHtml: string;
}
```

- Keep behavior identical to current loader:
  - hidden lessons are skipped by callers
  - leading H1 is removed from rendered body
  - raw HTML inside Markdown remains supported
  - Mermaid fences receive `class="mermaid"` on `<pre>`

#### 2. Refactor Markdown loader to use utilities

**File**: `src/server/content/markdownLessonLoader.ts`

**Changes**:

- Replace internal copies of parsing/rendering helpers with imports from `markdownLessonTransforms.ts`.
- Preserve the loader API for any remaining tests or transitional uses.
- Preserve test utility exports if tests still need them, but prefer testing the new utilities directly.

#### 3. Move/adjust tests

**Files**:

- `src/server/content/markdownLessonLoader.test.ts`
- new `src/server/content/markdownLessonTransforms.test.ts`

**Changes**:

- Move helper-level tests to `markdownLessonTransforms.test.ts`.
- Keep loader behavior tests where they still matter.
- Preserve tests for:
  - frontmatter parsing
  - leading H1 stripping
  - Mermaid class injection
  - raw HTML preservation
  - hidden lesson handling

### Success Criteria

#### Automated Verification

- [x] Markdown transform tests pass: `npm run test -- src/server/content/markdownLessonTransforms.test.ts`
- [x] Existing Markdown loader tests pass: `npm run test -- src/server/content/markdownLessonLoader.test.ts`
- [x] Mermaid rendering behavior remains covered.
- [x] No collection behavior changes yet.

#### Manual Verification

- [ ] Review the refactor diff and confirm it is behavior-preserving.
- [ ] Confirm no generated HTML files are introduced in this phase.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 2: Build Generator And Check Mode

### Overview

Add the deterministic Markdown-to-HTML generator that writes and verifies generated collection HTML.

### Changes Required

#### 1. Generator module

**File**: `src/server/content/lessonHtmlGenerator.ts`

**Changes**:

- Add pure/testable functions for:
  - source configuration
  - frontmatter validation
  - output path mapping
  - HTML document rendering
  - stale-output comparison

Suggested types:

```ts
export interface LessonHtmlGenerationTarget {
  courseKey: 'lessons10xDevs3' | 'lessons10xDevs3PreworkPl';
  sourceGlob: string;
  outputDir: string;
  defaultLanguage?: 'pl' | 'en';
  requireLanguage: boolean;
  requireOrder: boolean;
}

export interface GeneratedLessonHtml {
  sourcePath: string;
  outputPath: string;
  html: string;
  lessonId: string;
  title: string;
  language?: 'pl' | 'en';
  order?: number;
}
```

#### 2. HTML output contract

**File**: `src/server/content/lessonHtmlGenerator.ts`

**Changes**:

Generated HTML should be a stable legacy-compatible document:

```html
<!-- generated by generate-lesson-html; source: src/content-source/...; hash: ... -->
<meta name="lesson-id" content="[1.1] Co potrafi AI w 2026 r.">
<meta name="source-path" content="src/content-source/lessons10xDevs3Prework/pl/01-...md">
<meta name="source-hash" content="...">
<meta name="course-key" content="lessons10xDevs3PreworkPl">
<meta name="language" content="pl">
<meta name="order" content="1">
<html>
  <head></head>
  <body>
    ...
  </body>
</html>
```

Rules:

- Keep `<meta name="lesson-id" content="...">` because `htmlLessonLoader()` depends on it.
- Do not include timestamps.
- Escape metadata attributes safely.
- Use source hash or content hash for traceability.
- Preserve body HTML exactly as produced by the shared Markdown renderer.

#### 3. Output path mapping

**File**: `src/server/content/lessonHtmlGenerator.ts`

**Changes**:

- Preserve source basename, changing only extension:
  - `01-1x1_co_potrafi_ai_w_2026r.md`
  - `01-1x1_co_potrafi_ai_w_2026r.html`
- Generate prework PL to `src/content/lessons10xDevs3Prework/pl`.
- Do not generate prework EN; `src/content/lessons10xDevs3Prework/en` is translation-pipeline-owned HTML.
- Generate main course to `src/content/lessons10xDevs3`.
- Fail on duplicate output paths.
- Fail on non-hidden lessons missing required metadata.

#### 4. CLI script

**File**: `scripts/generate-lesson-html.ts`

**Changes**:

- Add CLI modes:
  - default/write mode: writes generated files
  - `--check`: compares without writing and exits non-zero on drift
- Print clear diagnostics:
  - generated file path
  - stale file path
  - missing file path
  - extra generated-looking file path
- Use `tsx` like existing TypeScript scripts.

Example:

```bash
tsx scripts/generate-lesson-html.ts
tsx scripts/generate-lesson-html.ts --check
```

#### 5. Package scripts

**File**: `package.json`

**Changes**:

- Add:

```json
{
  "scripts": {
    "generate:lesson-html": "tsx scripts/generate-lesson-html.ts",
    "check:lesson-html": "tsx scripts/generate-lesson-html.ts --check",
    "build": "npm run check:lesson-html && astro build"
  }
}
```

- Preserve existing build semantics except for the new pre-build check.

#### 6. Generator tests

**File**: `src/server/content/lessonHtmlGenerator.test.ts`

**Changes**:

Test:

- frontmatter metadata maps into HTML meta tags
- output paths preserve basename and switch extension
- hidden lessons are skipped
- missing `lessonId` fails
- missing/invalid `language` fails where required
- missing numeric `order` fails where required
- Mermaid class is present in generated HTML
- check mode detects stale/missing/extra files
- no timestamp appears in output

### Success Criteria

#### Automated Verification

- [x] Generator tests pass: `npm run test -- src/server/content/lessonHtmlGenerator.test.ts`
- [x] `npm run generate:lesson-html` writes deterministic output.
- [x] Running `npm run generate:lesson-html` twice produces no git diff on the second run.
- [x] `npm run check:lesson-html` passes immediately after generation.
- [x] `npm run check:lesson-html` fails when a generated HTML file is manually modified.

#### Manual Verification

- [ ] Inspect one generated PL prework HTML file and confirm metadata and body look correct.
- [ ] Inspect one generated EN prework HTML file and confirm metadata and body look correct.
- [ ] Confirm generator diagnostics are clear enough for authors.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 3: Migrate Authoring Content And Generate HTML

### Overview

Move editable Markdown out of `src/content` into `src/content-source`, then generate committed HTML into the current collection directories.

### Changes Required

#### 1. Create authoring tree

**Files/Directories**:

- `src/content-source/lessons10xDevs3/`
- `src/content-source/lessons10xDevs3Prework/pl/`
- `src/content-source/lessons10xDevs3Prework/README.md`

**Changes**:

- Move current learner-facing prework Markdown files:
  - from `src/content/lessons10xDevs3Prework/pl/*.md`
  - to `src/content-source/lessons10xDevs3Prework/pl/*.md`
- Do not create or retain English Markdown sources. Existing English Markdown should be removed after preserving or producing English HTML.
- Keep editorial files such as style/reports/todo out of generated lesson globs unless explicitly needed.
- Add authoring README with workflow rules.

#### 2. Remove Markdown from collection directories

**Directory**: `src/content/lessons10xDevs3Prework/`

**Changes**:

- Remove learner-facing `.md` files from `pl/` and `en/` after moving them.
- Generate `.html` files in the PL directory.
- Keep or add English `.html` files in `en/` as translation-pipeline-owned content.
- Decide file by file whether non-lesson editorial Markdown remains in `src/content/lessons10xDevs3Prework` or moves to `src/content-source`. Prefer moving editorial authoring docs to `src/content-source` when they are part of content production.

#### 3. Generate committed HTML

**Command**:

```bash
npm run generate:lesson-html
```

**Changes**:

- Commit generated `.html` files.
- Ensure generated prework HTML preserves filename prefixes so existing lesson IDs still work.

#### 4. Prepare main course authoring location

**Directory**: `src/content-source/lessons10xDevs3/`

**Changes**:

- Add `.gitkeep` or README if no main-course Markdown files exist yet.
- Ensure generator handles an empty main-course source directory without failing.
- If any future main-course Markdown exists, generated HTML should land in `src/content/lessons10xDevs3`.

### Success Criteria

#### Automated Verification

- [x] `npm run generate:lesson-html`
- [x] `npm run check:lesson-html`
- [x] No learner-facing `.md` files remain under `src/content/lessons10xDevs3Prework/{pl,en}`.
- [x] Generated PL `.html` and translation-owned EN `.html` files exist under `src/content/lessons10xDevs3Prework/{pl,en}`.
- [x] `git diff --check` passes.

#### Manual Verification

- [ ] Inspect file moves and confirm Polish authoring Markdown now lives under `src/content-source`.
- [ ] Inspect generated HTML diffs for a representative PL lesson and translation-owned HTML for a representative EN lesson.
- [ ] Confirm generated PL files and translation-owned EN files are acceptable for the translation pipeline.

**Implementation Note**: This phase creates the largest diff. Pause after generation so a human can inspect the source move and generated HTML before loader wiring changes.

---

## Phase 4: Switch Collections To HTML Source

### Overview

Update Astro collections and content resolvers so `10xdevs-3` and `10xdevs-3-prework` consume generated HTML only.

### Changes Required

#### 1. Extend HTML lesson metadata parsing

**File**: `src/server/content/htmlLessonLoader.ts`

**Changes**:

- Keep current behavior:
  - `id` from filename prefix
  - `name` from `<meta name="lesson-id" content="...">`
- Add optional metadata extraction:
  - `lessonId`
  - `language`
  - `order`
  - `source`
- Support generated HTML meta tags without breaking legacy HTML collections.
- Return `source: 'html'` or `source: 'generated-html'` only if schema is adjusted. If keeping schema unchanged, use `source: 'html'`.

Preferred return shape:

```ts
export interface HtmlLessonEntry {
  id: string;
  name: string;
  content: string;
  lessonId?: string;
  language?: 'pl' | 'en';
  order?: number;
  source?: 'html';
}
```

#### 2. Add localized HTML loader options if needed

**File**: `src/server/content/htmlLessonLoader.ts`

**Changes**:

- Add optional validation mode for generated localized lessons:

```ts
htmlLessonLoader(pattern, {
  idStrategy: 'frontmatterCompatibleMeta',
  defaultLanguage: 'pl',
  requireLessonId: true,
  requireOrder: true,
})
```

- Or keep options simpler if generated metadata is always present and validation lives in generator/check tests.
- Do not make legacy course collections fail because they lack generated metadata.

#### 3. Update content collections

**File**: `src/content.config.ts`

**Changes**:

- Remove `mixedLocalLessonLoader` usage for `lessons10xDevs3`.
- Stop pointing any `10xdevs-3` or prework collection at Markdown globs.
- Use generated HTML globs:

```ts
const lessons10xDevs3 = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3Prework = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3Prework/pl/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3PreworkEn = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3Prework/en/*.html')),
  schema: lessonSchema,
});
```

#### 4. Retire mixed local loader from active use

**File**: `src/server/content/mixedLocalLessonLoader.ts`

**Changes**:

- Remove if no longer used.
- Or keep temporarily if other tests/plans still reference it, but ensure production collection config does not use it.
- Update/delete `mixedLocalLessonLoader.test.ts` accordingly.

#### 5. Update resolver names/comments

**File**: `src/server/content/externalMarkdownContent.ts`

**Changes**:

- The name is now misleading because local content may be generated HTML.
- Options:
  - Rename to `externalLocalContent.ts`, or
  - Keep file name temporarily and update internal naming/comments.
- Ensure tests describe local generated HTML, not local Markdown, for `10xdevs-3` and prework.
- Keep source values compatible with current route behavior.

#### 6. Preserve Markdown export behavior

**Files**:

- `src/pages/external/[courseId]/[lessonId]/markdown.astro`
- `src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro`

**Changes**:

- Keep HTML-to-Markdown export.
- Ensure generated metadata comments/meta do not pollute exported Markdown.
- If export output includes unwanted metadata, update `htmlToMarkdown()` or pre-export cleanup to strip generator meta/comments.

### Success Criteria

#### Automated Verification

- [x] HTML loader tests pass: `npm run test -- src/server/content/htmlLessonLoader.test.ts`
- [x] External content resolver tests pass: `npm run test -- src/server/content/externalMarkdownContent.test.ts`
- [x] Prework route-related tests pass where available.
- [x] `npm run check:lesson-html`
- [x] `npm run build`
- [x] No production collection for `10xdevs-3` or `10xdevs-3-prework` points at `*.md`.

#### Manual Verification

- [ ] Open `/external/10xdevs-3-prework/pl/01` locally and confirm content renders.
- [ ] Open `/external/10xdevs-3-prework/en/01` locally and confirm content renders.
- [ ] If a generated main-course lesson exists, open `/external/10xdevs-3/01` and confirm it resolves locally before Circle.
- [ ] Confirm Markdown download still produces readable Markdown.

**Implementation Note**: After completing this phase and all automated verification passes, pause for human route smoke testing before proceeding.

---

## Phase 5: Validation, Tests, And Authoring Docs

### Overview

Finish the migration by moving validation to the authoring tree, documenting the workflow, and hardening stale-output checks.

### Changes Required

#### 1. Move prework pair validation to authoring source

**File**: `src/server/content/preworkLessonPairs.test.ts`

**Changes**:

- Change validation to read PL Markdown from `src/content-source/lessons10xDevs3Prework/pl` and EN HTML metadata from `src/content/lessons10xDevs3Prework/en`.
- Keep validation rules:
  - root folder has no learner-facing lesson Markdown
  - PL Markdown `lessonId` values align with EN HTML `canonical-lesson-id` values
  - PL Markdown `order` values align with EN HTML `order` values
  - file names start with `lessonId`
  - PL language frontmatter is `pl`
  - EN HTML language metadata is `en`

#### 2. Add generated-output validation

**File**: new `src/server/content/generatedLessonHtml.test.ts` or extend generator tests

**Changes**:

- Assert generated HTML directories contain only expected generated lesson files.
- Assert every non-hidden authoring lesson has matching generated HTML.
- Assert no stale generated-looking HTML exists without a source file.
- Assert generated HTML contains no timestamp-like metadata.

#### 3. Authoring README

**File**: `src/content-source/lessons10xDevs3Prework/README.md`

**Changes**:

Document:

- Polish Markdown is the editable source for PL.
- Generated PL HTML in `src/content` is committed output.
- English HTML in `src/content/lessons10xDevs3Prework/en` is produced by the translation pipeline.
- Do not hand-edit generated PL HTML.
- Required frontmatter:

```yaml
---
title: "[1.1] Example title"
lessonId: "01"
language: "pl"
order: 1
---
```

- Commands:

```bash
npm run generate:lesson-html
npm run check:lesson-html
npm run build
```

- How to add a lesson:
  - add PL Markdown
  - use `lessonId` and `order`
  - run generator
  - inspect generated PL HTML
  - ensure the translation pipeline produces matching EN HTML

#### 4. Update comments and plan references

**Files**:

- `src/content.config.ts`
- `src/server/content/externalMarkdownContent.ts` or renamed resolver
- affected tests

**Changes**:

- Remove comments that say local Markdown is the source consumed by collections.
- Replace with "authoring Markdown generates collection HTML".
- Keep route-level language and auth comments unchanged unless stale.

#### 5. Optional root ignore/readme guard

**File**: optional `src/content/lessons10xDevs3Prework/README.md`

**Changes**:

- If useful, add a short warning:

```text
This directory contains generated HTML consumed by Astro collections.
Edit Markdown in src/content-source/... and run npm run generate:lesson-html.
```

Only add this if it does not interfere with content collection globs.

### Success Criteria

#### Automated Verification

- [x] Pair validation passes: `npm run test -- src/server/content/preworkLessonPairs.test.ts`
- [x] Generator validation passes.
- [x] Focused content tests pass:
  - `npm run test -- src/server/content/markdownLessonTransforms.test.ts src/server/content/lessonHtmlGenerator.test.ts src/server/content/htmlLessonLoader.test.ts src/server/content/externalMarkdownContent.test.ts src/server/content/preworkLessonPairs.test.ts`
- [x] `npm run check:lesson-html`
- [x] `npm run build`

#### Manual Verification

- [ ] README is clear enough for someone adding a lesson.
- [ ] Generated HTML warning/convention is clear in the repo structure.
- [ ] Translation pipeline owners confirm generated HTML shape is acceptable.
- [ ] Smoke-test localized prework lessons and Markdown download.

**Implementation Note**: This is the final hardening phase. After it passes, the repo should have one official content workflow for these courses.

---

## Testing Strategy

### Unit Tests

- Markdown transform utility tests:
  - frontmatter parsing
  - title fallback from H1
  - leading H1 stripping
  - Mermaid class injection
  - raw HTML preservation
- Generator tests:
  - metadata validation
  - deterministic HTML output
  - path mapping
  - check mode stale/missing/extra detection
  - no timestamps
- HTML loader tests:
  - legacy `<meta name="lesson-id">` parsing
  - optional generated metadata parsing
  - numeric-aware sorting
- Pair validation:
  - PL Markdown source and EN HTML metadata alignment by `lessonId` and `order`

### Integration Tests

- External content resolver tests:
  - `10xdevs-3` local generated HTML resolves before Circle
  - `10xdevs-3` falls back to Circle when no generated file exists
  - `10xdevs-3-prework` resolves generated PL HTML and translation-owned EN HTML by language
  - unsupported courses still use Circle path
- Markdown export tests:
  - generated metadata does not leak into downloaded Markdown
  - exported Markdown remains readable

### Manual Testing Steps

1. Run `npm run generate:lesson-html`.
2. Run `npm run check:lesson-html`.
3. Run `npm run build`.
4. Start dev server with `npm run dev`.
5. Visit `/external/10xdevs-3-prework/pl/01` with valid auth and verify content.
6. Visit `/external/10xdevs-3-prework/en/01` with valid auth and verify content.
7. Use the Markdown download button and inspect output.
8. Modify one Polish authoring Markdown file, confirm `npm run check:lesson-html` fails before regeneration.
9. Regenerate and confirm the check passes.

## Performance Considerations

- The generator may process dozens of Polish Markdown files, which is small enough for a straightforward serial or Promise-based implementation.
- Check mode should remain fast enough to run before every build.
- Astro build should become simpler because collection loaders no longer render Markdown for these courses.
- Avoid timestamp metadata to keep generated diffs stable and reviewable.

## Migration Notes

- This is a source layout migration plus generated artifact introduction.
- Git history will show Polish Markdown files moving from `src/content` to `src/content-source` and generated/translation-owned HTML appearing in `src/content`.
- Generated HTML is committed intentionally.
- Existing route URLs should not change because filenames preserve the same two-character lesson ID prefixes and frontmatter `lessonId` values.
- If rollback is needed, revert the collection config changes and restore Markdown files to `src/content`, but the preferred rollback is to keep the generator and fix output issues.

## References

- Existing collection config: `src/content.config.ts:63`
- Current Markdown loader: `src/server/content/markdownLessonLoader.ts:151`
- Existing HTML loader: `src/server/content/htmlLessonLoader.ts:10`
- External local content resolver: `src/server/content/externalMarkdownContent.ts:82`
- Prework route: `src/pages/external/[courseId]/[lang]/[lessonId].astro:31`
- Prework pair validation: `src/server/content/preworkLessonPairs.test.ts:13`
- Prior local Markdown plan superseded by this decision: `thoughts/shared/plans/2026-04-26-bilingual-10xdevs3-prework-circle-sync.md`
- Prior mixed HTML/Markdown plan superseded by this decision: `thoughts/shared/plans/2026-04-27-html-and-shared-external-rendering-shell.md`

<!-- PLAN COMPLETED: 2026-04-27 -->
