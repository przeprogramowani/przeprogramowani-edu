---
date: 2026-05-16T17:30:00+02:00
researcher: Claude (Opus 4.6)
git_commit: c7d75f22694addcc704f4d5e5d0e07f2835673cc
branch: master
repository: przeprogramowani-sites
topic: "How i18n (PL/EN) is implemented for 10xdevs-3-prework, and what's needed to replicate it for 10xdevs-3"
tags: [research, codebase, i18n, 10xdevs-3, content-pipeline, circle-api]
status: complete
last_updated: 2026-05-16
last_updated_by: Claude (Opus 4.6)
---

# Research: i18n Support for 10xDevs 3.0 Main Course

**Date**: 2026-05-16T17:30:00+02:00
**Researcher**: Claude (Opus 4.6)
**Git Commit**: c7d75f22694addcc704f4d5e5d0e07f2835673cc
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How is i18n (PL/EN) currently implemented for `10xdevs-3-prework`, and what changes are needed to replicate the same approach for `10xdevs-3`?

## Summary

The prework i18n system uses **separate Astro content collections per language**, resolved at runtime by a language parameter embedded in the URL path (`/external/10xdevs-3-prework/{lang}/{lessonId}`). Auth is language-agnostic. The pattern is self-contained across ~8 files and can be generalized for the main course. The main architectural difference is that `10xdevs-3` currently serves lessons via **both** internal (`/courses/`) and external (`/external/`) routes, whereas prework redirects internal routes entirely to external. Additionally, the main course has a richer content pipeline (workbench → transport → generate → Circle) and section-based navigation that needs localization.

Circle already has an English space for 10xDevs 3.0 (space group 1054673, Lessons space 2601706) that can receive pushed content.

## Detailed Findings

### 1. Content Collections & Loader

**How it works for prework:**

Two separate collections load from language-specific subdirectories:

```
lessons10xDevs3Prework    → content/lessons10xDevs3Prework/pl/*.html
lessons10xDevs3PreworkEn  → content/lessons10xDevs3Prework/en/*.html
```

- `src/content.config.ts:66-74` — collection definitions
- `src/models/LessonCollection.ts:11-12` — type union includes both
- `src/server/content/htmlLessonLoader.ts:48-56` — `extractLanguage()` reads `<meta name="language">` from HTML

**Current state of 10xdevs-3:**

```
lessons10xDevs3 → content/lessons10xDevs3/pl/*.html  (5 lessons, Module 1 only)
```

No `en/` directory exists yet. The `pl/` directory structure is already in place.

**Lesson schema** (`content.config.ts:6-15`) already supports `language: z.enum(['pl', 'en']).optional()`.

### 2. Content Pipeline (Markdown → HTML → Circle)

**PL main course pipeline** (full 4-stage):

```
workbench/lessons/{lessonId}/lesson-draft.md
  ↓ transport-lesson.mjs
src/content-source/lessons10xDevs3/pl/*.md
  ↓ generate-lesson-html.ts (courseKey: 'lessons10xDevs3Pl')
src/content/lessons10xDevs3/pl/*.html
  ↓ circle-lesson-backup/prepare.ts
circle-lesson-backup/content/lessons10xDevs3/pl/*.html
  ↓ circle-lesson-backup/push.ts (space_id: 2552674, lesson-map.json)
Circle API → Space "Lekcje [10X3]"
```

Key files:
- `workbench/scripts/transport-lesson.mjs:11-18` — writes to `content-source/lessons10xDevs3/pl`
- `src/server/content/lessonHtmlGenerator.ts:102-126` — `createDefaultLessonHtmlGenerationTargets()` defines PL targets
- `utils/circle-lesson-backup/prepare.ts:5-9` — hardcoded PL paths
- `utils/circle-lesson-backup/push.ts:11-12` — hardcoded PL paths and lesson-map

**EN prework pipeline** (enrichment-only, no workbench):

```
src/content/lessons10xDevs3Prework/en/*.html (pre-translated HTML, placed externally)
  ↓ enrich-lesson-html.ts --lang en
src/content/lessons10xDevs3Prework/en/*.html (enriched with metadata from PL source)
```

- `src/server/content/lessonHtmlEnricher.ts:181-198` — targets only `lessons10xDevs3PreworkEn`
- The enricher reads PL markdown as metadata source, pairs it with the pre-existing EN HTML, and injects meta tags
- `lessonHtmlEnricher.ts:136-140` — `localizeInternalExternalLessonLinks()` already matches `10xdevs-3` (not just prework) in its regex: `/external\/(10xdevs-3(?:-prework)?)\//`

### 3. Collection Resolution (Language → Collection Name)

Two parallel mapping systems exist for prework:

**A. `preworkContent.ts`** (`src/server/content/preworkContent.ts:12-15`) — used by routes:
```typescript
const PREWORK_COLLECTION_BY_LANGUAGE: Record<PreworkLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3Prework',
  en: 'lessons10xDevs3PreworkEn',
};
```

Functions: `getPreworkLessons(language)`, `getPreworkLesson(language, lessonId)`, `isPreworkLanguage()`.

**B. `externalMarkdownContent.ts`** (`src/server/content/externalMarkdownContent.ts:61-76`) — used by content service:
```typescript
const MARKDOWN_COURSE_COLLECTIONS: Partial<Record<CourseSlug, LessonCollection>> = {
  '10xdevs-3': 'lessons10xDevs3',  // ← no language awareness
};

const PREWORK_COLLECTIONS: Record<PreworkLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3Prework',
  en: 'lessons10xDevs3PreworkEn',
};
```

`getMarkdownCollection(courseId, language)` only applies language for prework; for `10xdevs-3` it ignores the language param.

**C. `CollectionMappings.ts`** (`src/models/CollectionMappings.ts:38-39`) — used by internal routes:
```typescript
'10xdevs-3': 'lessons10xDevs3',  // ← no language variant
```

### 4. External Route Structure

**Prework routes with `[lang]`:**
- `src/pages/external/[courseId]/[lang]/[lessonId].astro` — lesson view
- `src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro` — markdown export
- `src/pages/external/[courseId]/[lang]/quiz.astro` — path quiz

**Prework routes without `[lang]` (backward compat / index):**
- `src/pages/external/[courseId]/index.astro:30-60` — language picker UI (card-style, PL/EN with lesson counts)
- `src/pages/external/[courseId]/[lessonId].astro:36-41` — when `courseId === PREWORK_COURSE_ID`, rejects non-language `lessonId`

**10xdevs-3 external route (current, no language):**
- `src/pages/external/[courseId]/[lessonId].astro:113-146` — serves 10xdevs-3 lessons without language segment via `getExternalCourseLessonContent(courseId, lessonId)` which falls back to Circle API

### 5. Internal Route Handling

- `src/pages/courses/[...courseSlug]/index.astro:12-13` — only **prework** redirects to `/external/10xdevs-3-prework`
- `src/pages/courses/[...courseSlug]/lesson/[...id].astro:10-14` — only **prework** redirects (with `/pl/` suffix)
- **10xdevs-3** is served normally via internal routes using `COLLECTION_MAPPINGS['10xdevs-3']` → `'lessons10xDevs3'`

### 6. URL Validation & Auth Flow

- `src/server/urlValidation.ts:47-58` — validates prework language paths
- `src/server/urlValidation.ts:160-190` — `resolveExternalAuthLanguage()`, `localizeExternalAuthReturnUrl()`, `resolveExternalAuthReturnUrl()`
- `src/server/externalAuth.ts` — language-agnostic, validates course access only
- Login page (`external/[courseId]/login.astro:22-29`) preserves language via `returnUrl` + `langHint`

### 7. UI & Shell Copy

- `src/lib/externalLessonShellCopy.ts:29-78` — PL/EN translation strings for all lesson UI labels
- `src/server/content/preworkLessonList.ts:31-45` — `formatPreworkLessonCount()` with Polish/English pluralization
- `src/layouts/ExternalLessonLayout.astro:49,81,105` — accepts `htmlLang` prop, sets `<html lang=...>`
- No in-lesson language switcher exists; users navigate back to index to change language

### 8. Section Names

`externalMarkdownContent.ts:82-88` hardcodes 5 module sections for the main course:
```typescript
const MAIN_COURSE_SECTIONS = [
  { id: 1, name: 'Moduł 1: Agentic Environment', lessonRange: [1, 5] },
  { id: 2, name: 'Moduł 2: Build',               lessonRange: [6, 10] },
  { id: 3, name: 'Moduł 3: Verify',              lessonRange: [11, 15] },
  { id: 4, name: 'Moduł 4: Maintain',            lessonRange: [16, 20] },
  { id: 5, name: 'Moduł 5: Scale',               lessonRange: [21, 25] },
];
```

These use a Polish prefix ("Moduł") with English topic names. For EN version, these would need localization (e.g., "Module 1: ...").

### 9. Progress Tracking

`src/server/progress/lessonProgressLoader.ts:7-33` — `LessonProgressScope` includes optional `language` field. Prework tracks progress per language. For main course lessons, `language: null` is passed (line 143 of `[lessonId].astro`).

### 10. Circle Space Configuration

**Polish (existing):**
- Space group 1052708 — "10xDevs 3.0"
- Lessons space: 2552674 "Lekcje [10X3]" (5 sections)
- Config: `TEN_X_DEVS_THIRD_ED` in `projects/common/src/circle/course-config.ts:17-22`

**English (available, not yet configured):**
- Space group 1054673 — "10xDevs 3.0 [ENG version]"
- Lessons space: 2601706 "Lessons [10X3]"
- **No `CourseConfig` entry exists yet** — section IDs unknown (need Circle API query)

## Code References

- `src/content.config.ts:61-74` — collection definitions (10xDevs3 + prework)
- `src/models/LessonCollection.ts:1-12` — type union
- `src/models/CollectionMappings.ts:29-53` — slug → collection + permission mappings
- `src/server/content/preworkContent.ts:7-59` — prework language helpers (model for 10xdevs-3)
- `src/server/content/externalMarkdownContent.ts:61-76` — markdown collection resolution
- `src/server/content/externalMarkdownContent.ts:82-88` — main course section names
- `src/server/content/lessonHtmlGenerator.ts:102-126` — PL HTML generation targets
- `src/server/content/lessonHtmlEnricher.ts:181-198` — EN HTML enrichment targets (prework only)
- `src/server/content/lessonHtmlEnricher.ts:136-140` — link localization (already matches `10xdevs-3`)
- `src/server/content/htmlLessonLoader.ts:48-56` — language extraction from HTML meta
- `src/server/urlValidation.ts:47-58,137-190` — prework URL language validation
- `src/server/progress/lessonProgressLoader.ts:7-33` — language-aware progress
- `src/lib/externalLessonShellCopy.ts:29-78` — PL/EN UI strings
- `src/pages/external/[courseId]/index.astro:30-60` — language picker UI
- `src/pages/external/[courseId]/[lang]/[lessonId].astro:23-58` — language-aware lesson route
- `src/pages/courses/[...courseSlug]/lesson/[...id].astro:10-14` — prework-only redirect
- `projects/common/src/circle/course-config.ts:17-22` — PL Circle config
- `utils/circle-lesson-backup/prepare.ts:5-9` — PL-only paths
- `utils/circle-lesson-backup/push.ts:11-12` — PL-only paths + lesson-map
- `workbench/scripts/transport-lesson.mjs:11-18` — PL-only transport destination

## Architecture Insights

### The i18n pattern is a 4-layer stack

| Layer | Mechanism | Prework Status | Main Course Status |
|-------|-----------|----------------|-------------------|
| **Content collections** | Separate collection per language | Done (PL + EN) | PL only |
| **Service helpers** | Language → collection mapper + fetchers | Done (`preworkContent.ts`) | Not started |
| **Route structure** | `/[lang]/` URL segment + validation | Done (`[lang]/[lessonId].astro`) | Not started |
| **Content pipeline** | Generate/enrich HTML → Circle push | Done (enricher for EN) | PL pipeline only |

### Key design decisions to make for 10xdevs-3

1. **Internal vs external routes**: Prework redirects `/courses/10xdevs-3-prework/` → `/external/`. Should 10xdevs-3 do the same, or keep both route systems with language support on both?

2. **Generalize vs duplicate**: `preworkContent.ts` is prework-specific. The language mapping could be generalized (e.g., a `CourseLanguageConfig` registry) or duplicated for the main course.

3. **Section name localization**: Section names are hardcoded with "Moduł" prefix. English version needs translated section names. This could be a static map or derived from data.

4. **EN content source**: The prework EN content is pre-translated HTML dropped into the `en/` directory and enriched. Same approach expected for the main course?

5. **Circle push pipeline**: The `prepare.ts` and `push.ts` scripts are hardcoded for PL. They need parameterization for language, and the EN Circle config (space 2601706) needs section IDs.

### Existing infrastructure that already supports 10xdevs-3 i18n

- Lesson schema has `language` field (`content.config.ts:11`)
- `htmlLessonLoader` extracts language from HTML meta tags
- Link localization regex already matches `10xdevs-3` (`lessonHtmlEnricher.ts:138`)
- Shell copy has full PL/EN string dictionary
- Progress tracking accepts optional `language` parameter
- `ExternalLessonLayout` accepts `htmlLang` prop

## Historical Context

No prior changes in `context/changes/` or `context/archive/` address i18n for the main course.

## Resolved Design Decisions

1. **Route strategy**: `/courses/10xdevs-3/` will redirect to `/external/10xdevs-3/` — same mechanics as prework.
2. **Service layer**: Duplicate `preworkContent.ts` for the main course (no premature generalization).
3. **Section names**: Translate "Moduł N: ..." to "Module N: ..." for the EN version.
4. **EN content source**: Pre-translated HTML placed in `content/lessons10xDevs3/en/`, same pattern as prework.
5. **Course slug strategy**: Single `10xdevs-3` slug with language in URL (`/external/10xdevs-3/{lang}/{lessonId}`).

## Open Questions

1. **EN Circle section IDs**: What are the section IDs for space 2601706 "Lessons [10X3]"? Needed for `CourseConfig` and `lesson-map-en.json`.
2. **Scope gating**: Should EN content be available immediately or feature-flagged? Prework EN was available as soon as HTML files landed.
