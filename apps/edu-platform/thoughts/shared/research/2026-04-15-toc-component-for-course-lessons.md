---
date: 2026-04-15T12:00:00+02:00
researcher: Claude
git_commit: 34ab599b1808f79d921e82451b9e5a6bb6c4cfd6
branch: master
repository: przeprogramowani-sites
topic: "Introducing TOC component into regular course lessons based on HTML content"
tags: [research, codebase, toc, lessons, html-content, navigation]
status: complete
last_updated: 2026-04-15
last_updated_by: Claude
last_updated_note: "Resolved open questions: TOC for all courses, use direct extraction (not processHtmlForDisplay), no minimum heading threshold"
---

# Research: Introducing TOC into Regular Course Lessons

**Date**: 2026-04-15T12:00:00+02:00
**Researcher**: Claude
**Git Commit**: 34ab599b
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

What would be required to introduce the TOC component (as seen in the ebook page) into regular course lessons rendered under `/courses/[courseSlug]/lesson/[id]`, based on HTML content from content collections?

## Summary

**Almost all infrastructure already exists.** The codebase has a complete TOC system (Svelte component, heading extraction from HTML, hierarchy builder) already used in two places: the ebook page (Markdown source) and external lessons (Circle API HTML source). The regular course lesson pipeline just needs to be wired up. The key changes are in 2 files: `Course.astro` and `Lesson.astro` (or the page itself).

## Detailed Findings

### Current State: What Already Exists

#### 1. TOC Component (`src/components/navigation/TOC.svelte`)
- Full-featured Svelte 5 component with desktop sidebar + mobile overlay
- Intersection Observer for real-time scroll tracking
- Expand/collapse accordion, localStorage persistence
- Accepts `headings: TocItem[]` (hierarchical) and `storageKey: string`
- Companion `TOCTree.svelte` handles recursive rendering

#### 2. HTML Heading Extraction (`src/utils/extractHeadingsFromHtml.ts`)
- Uses cheerio to parse HTML and extract h1-h6 headings
- Generates slug-based IDs via `github-slugger`
- Returns `{ headings: TocItem[], modifiedHtml: string }` — the modified HTML has IDs injected into heading elements
- Already tested with real lesson HTML

#### 3. Hierarchy Builder (`src/utils/buildTocHierarchy.ts`)
- `buildCompleteToc(flatHeadings)` → `{ tree, flatHeadings, headingMap }`
- Stack-based algorithm handling irregular nesting
- Comprehensive test coverage

#### 4. Processing Pipeline (`src/server/circle/process-for-display.ts`)
- `processHtmlForDisplay(html, name)` → `{ html, headings }` — complete pipeline that transforms iframes, removes focus mode links, lazy-loads images, extracts headings, and builds TOC tree
- Already used for external lessons via Circle API

### Current Lesson Rendering Pipeline (without TOC)

```
[...id].astro → Course.astro → Lesson.astro
                    ↓
  getCollection(collection) → activeLesson.data.content (raw HTML string)
                    ↓
  <div set:html={content} />  ← no heading IDs, no TOC
```

Key files:
- `src/pages/courses/[...courseSlug]/lesson/[...id].astro` — route handler, auth, delegates to `Course.astro`
- `src/components/Course.astro` — fetches all lessons, finds active, renders layout + `Lesson.astro`
- `src/components/Lesson.astro` — receives `content: string`, renders via `set:html={content}`

### Reference Implementation: External Lessons (already has TOC)

File: `src/pages/external/[courseId]/[lessonId].astro`

Pattern:
1. Fetch lesson HTML from Circle API via `getLessonContent()`
2. `processHtmlForDisplay()` returns `{ html, headings }` — HTML with heading IDs + hierarchical TOC tree
3. Render `<TOC client:load headings={tocHeadings} storageKey="toc-widget-open" />` before content
4. Render content via `<div set:html={lesson.data.content} />`
5. Include FOUC prevention script

### What Needs to Change

#### Option A: Process HTML at content-fetch time (in `Course.astro`)

Modify `Course.astro` to process the HTML content before passing it to `Lesson.astro`:

```astro
// Course.astro — add imports
import TOC from '@/components/navigation/TOC.svelte';
import { extractHeadingsFromHtml } from '@/utils/extractHeadingsFromHtml';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';

// Process active lesson content for TOC
const { headings: flatHeadings, modifiedHtml } = extractHeadingsFromHtml(activeLesson.data.content);
const tocData = buildCompleteToc(flatHeadings);

// Then render TOC + pass modifiedHtml to Lesson
```

**Considerations:**
- `Course.astro` manages the layout (sidebar, topbar, etc.), so placing `<TOC>` here requires careful positioning
- The TOC component renders as a fixed overlay/sidebar, so it can be placed outside the main content flow
- `modifiedHtml` (with heading IDs) must replace `activeLesson.data.content` when passed to `Lesson.astro`

#### Option B: Process HTML at page level (in `[...id].astro`)

Modify the page route to process content and pass TOC data down through props. This keeps `Course.astro` generic but adds complexity to the page route.

#### Recommended: Option A

Option A is simpler and mirrors the external lesson pattern. The `Course.astro` component already has access to the lesson content and controls the layout.

### Concrete Changes Required

**File 1: `src/components/Course.astro`**

Add:
- Import `TOC`, `extractHeadingsFromHtml`, `buildCompleteToc`
- Extract headings from `activeLesson.data.content`
- Build TOC hierarchy
- Add FOUC prevention script
- Render `<TOC client:load ... />` component
- Pass `modifiedHtml` (with heading IDs) to `<Lesson>` instead of raw content

**File 2: `src/components/Lesson.astro`** — no changes needed (already receives content as string prop)

**File 3: `src/layouts/CourseLayout.astro`** — may need the FOUC prevention CSS if not already global

### Edge Cases to Consider

1. **Lessons with no/few headings**: TOC should gracefully handle empty heading lists (it already does — the component simply won't render meaningful content)
2. **H1 in content**: The lesson page already renders `<h1>{lessonName}</h1>` before the content. If the HTML content also starts with H1, there will be duplicate H1s. The TOC's `filterHeadingsByMinLevel` already filters out H1 by default (keeps H2+)
3. **storageKey**: Each course should probably use a unique key like `toc-${courseSlug}-open` for state persistence
4. **Performance**: `extractHeadingsFromHtml` uses cheerio which is a server-side dependency — fine for SSR on Cloudflare Workers. The processing happens once per request
5. **Content collections without headings**: Some lesson HTML may have no h2+ headings — the TOC component should hide itself or show gracefully

### Dependencies

All required dependencies are already installed:
- `cheerio` v1.1.2
- `github-slugger` (via Astro)
- TOC component, utilities, and types all exist

## Code References

- `src/pages/courses/[...courseSlug]/lesson/[...id].astro` — Route handler (entry point to modify)
- `src/components/Course.astro` — Layout orchestrator (primary file to modify)
- `src/components/Lesson.astro` — Content renderer (no changes needed)
- `src/components/navigation/TOC.svelte` — TOC component (ready to use)
- `src/components/navigation/TOCTree.svelte` — Recursive tree renderer
- `src/utils/extractHeadingsFromHtml.ts` — HTML heading extraction
- `src/utils/buildTocHierarchy.ts` — Tree hierarchy builder
- `src/types/toc.ts` — Type definitions
- `src/server/circle/process-for-display.ts` — Reference pipeline (processHtmlForDisplay)
- `src/pages/external/[courseId]/[lessonId].astro` — Reference integration (external lessons with TOC)
- `src/pages/10xdevs-3/ebook/index.astro` — Reference integration (ebook with TOC)

## Architecture Insights

The TOC system was designed to be reusable across content sources:
- **Markdown** (ebook): uses Astro's native `getHeadings()` → maps to `TocItem[]` → `buildCompleteToc()`
- **Circle API HTML** (external): uses `processHtmlForDisplay()` which internally calls `extractHeadingsFromHtml()` → `buildCompleteToc()`
- **Static HTML collections** (course lessons): should use `extractHeadingsFromHtml()` → `buildCompleteToc()` directly

The pattern is consistent: extract flat headings → build hierarchy → pass tree to `<TOC>` component.

## Resolved Questions

### 1. TOC scope: All courses

**Decision:** TOC will be enabled for all course collections unconditionally. No per-course opt-in/out needed.

### 2. Use direct extraction, not `processHtmlForDisplay()`

**Decision:** Use `extractHeadingsFromHtml()` + `buildCompleteToc()` directly.

**Why (clean code analysis):**

`processHtmlForDisplay()` bundles five concerns into one function:
1. `transformIframes()` — converts Circle's embedly Vimeo embeds → **Circle-specific**
2. `removeFocusModeLinks()` — strips "wersja focus mode" paragraphs → **Circle-specific**
3. `lazyImages()` — adds `loading="lazy"` → generic but already present in static HTML
4. `extractHeadingsFromHtml()` — heading extraction + ID injection → **what we need**
5. `buildCompleteToc()` — hierarchy builder → **what we need**
6. DOCTYPE/HTML structure cleanup → **Circle-specific** (static HTML doesn't have this issue)

Verified: **none** of the static HTML content collections contain `embedly-embed`, `cdn.embedly`, or `focus mode` patterns. These transforms would be dead code in this context.

Reusing `processHtmlForDisplay()` would violate the Single Responsibility Principle by coupling the course lesson pipeline to Circle API assumptions. The composable approach — calling `extractHeadingsFromHtml()` and `buildCompleteToc()` directly — is cleaner, more explicit, and avoids unnecessary processing.

**Implementation pattern:**
```astro
import { extractHeadingsFromHtml } from '@/utils/extractHeadingsFromHtml';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';

const { headings: flatHeadings, modifiedHtml } = extractHeadingsFromHtml(activeLesson.data.content);
const tocData = buildCompleteToc(flatHeadings);
```

### 3. No minimum heading threshold

**Decision:** No lower bound on heading count. Show TOC regardless of how many headings exist (even 0 or 1).

**Why:** The end goal is for the TOC to update the URL with hyperlinks to page sections (anchor-based navigation). Even a single heading provides a shareable/bookmarkable anchor link. The TOC component already handles empty/minimal heading lists gracefully.
