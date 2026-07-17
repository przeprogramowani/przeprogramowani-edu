---
date: 2026-04-15T12:08:28+0200
researcher: Codex
git_commit: 35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1
branch: master
repository: przeprogramowani-sites
topic: "Why regular course lessons use a flat lesson list while external lessons use a sectioned one, and how to unify them safely"
tags: [research, codebase, courses, external-courses, navigation, sidebar, toc]
status: complete
last_updated: 2026-04-15
last_updated_by: Claude (data flow and dependency analysis added)
last_updated_note: "Added follow-up research: detailed props data-in/out, complete dependency trees, side-effects, and layout integration specifics"
---

# Research: Why Regular Course Lessons And External Lessons Use Different Lesson Navigation

**Date**: 2026-04-15T12:08:28+0200
**Researcher**: Codex
**Git Commit**: 35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Why do regular course lessons such as `/courses/opanuj-frontend` use one lesson-list form that is not split by modules, while external lessons such as `/external/10xdevs-2/2580237` use a more advanced grouped component, and can the two be unified without breaking more complex cases or assuming metadata that is not always available?

## Summary

The difference is real, but it is mostly a data-model split, not just a UI split.

- Regular course lesson pages are backed by Astro content collections whose lesson schema is flat: `id`, `name`, and `content`, with ordering derived from filename-based IDs. There is no machine-readable section/module metadata in that path today.
- External lesson pages are backed by a richer Circle-derived `CourseStructure` that explicitly contains `sections[]` plus `lessons[]` with `sectionId`, and optionally checklists. That richer shape is what enables grouped accordions and more advanced navigation.
- Part of the UI is already unified: both paths now use the same `ContentTopBar.svelte`, which supports both flat and grouped lesson navigation modes plus TOC behavior.
- The remaining split is mainly the desktop lesson navigation and the upstream navigation data contract.

The safe unification path is therefore not “replace regular courses with the external sidebar.” The safe path is:

1. Keep a shared navigation shell that supports both flat and grouped modes.
2. Extract a shared desktop lesson-navigation component that also supports both modes.
3. Introduce a common adapter layer for navigation data.
4. Only give regular courses grouped/module UI after adding real section metadata for them.

Without step 4, grouped regular-course modules would be synthetic and fragile.

## Detailed Findings

### 1. Regular course lessons are sourced from a flat local content model

- The regular lesson route only validates auth and lesson existence, then delegates to `Course.astro` with `courseSlug`, `collection`, and `lessonId`: [src/pages/courses/[...courseSlug]/lesson/[...id].astro#L1-L27](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/pages/courses/%5B...courseSlug%5D/lesson/%5B...id%5D.astro#L1-L27)
- `Course.astro` loads the whole collection via `getCollection(collection)`, computes prev/next by flat index, and passes only flat `{ id, name }` lesson items into `ContentTopBar`: [src/components/Course.astro#L22-L32](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/Course.astro#L22-L32), [src/components/Course.astro#L42-L56](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/Course.astro#L42-L56)
- The desktop sidebar for regular courses is a plain ordered list with numeric badges and no grouping logic: [src/components/Sidebar.astro#L13-L43](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/Sidebar.astro#L13-L43)
- The lesson collection schema contains only `id`, `name`, and `content`: [src/content.config.ts#L12-L16](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/content.config.ts#L12-L16)
- The loader sorts entries by the derived lesson ID string from the filename prefix, not by any module/section metadata: [src/content.config.ts#L18-L33](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/content.config.ts#L18-L33)
- `LessonEntry` mirrors the same flat shape: [src/models/LessonEntry.ts#L1-L8](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/models/LessonEntry.ts#L1-L8)
- `getLessonsForCourseCollection()` is only a thin wrapper around `getCollection()`, so it does not inject grouping: [src/server/content/courseContent.ts#L14-L30](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/content/courseContent.ts#L14-L30)

Conclusion: regular course lessons are flat because the source model is flat.

### 2. External lessons are sourced from a richer Circle course structure

- External lesson pages fetch lesson content separately from the course navigation structure: [src/pages/external/[courseId]/[lessonId].astro#L34-L50](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/pages/external/%5BcourseId%5D/%5BlessonId%5D.astro#L34-L50)
- The same page then loads `getCourseStructure(courseId, env)` and passes `structure.lessons` and `structure.sections` into `ExternalLessonLayout`: [src/pages/external/[courseId]/[lessonId].astro#L45-L65](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/pages/external/%5BcourseId%5D/%5BlessonId%5D.astro#L45-L65)
- The external structure type explicitly models `sections[]` plus `lessons[]` carrying `sectionId`: [src/server/circle/courseStructureTypes.ts#L4-L30](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureTypes.ts#L4-L30)
- External configuration hardcodes which Circle `sectionIds` belong to each course, including `opanuj-frontend`, `10xdevs-2`, and `10xdevs-3`: [src/server/circle/externalAuthConfig.ts#L16-L54](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/externalAuthConfig.ts#L16-L54)
- `fetchCourseStructure()` fetches all sections, filters them to configured `sectionIds`, fetches lessons per section, sorts them, and flattens them while preserving section order: [src/server/circle/courseStructureApi.ts#L254-L295](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureApi.ts#L254-L295)
- External structure is cache-first with a 30-day TTL, so even the grouped navigation is the result of a composed and cached data model rather than a direct page-local transform: [src/server/circle/courseStructureCache.ts#L5-L10](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureCache.ts#L5-L10), [src/server/circle/courseStructureCache.ts#L145-L160](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureCache.ts#L145-L160)

Conclusion: external lessons are grouped because their source contract is grouped.

### 3. The “advanced” external experience is partly already shared

- `ContentTopBar.svelte` accepts both flat `lessons` and grouped `sections` + `groupedLessons`: [src/components/ContentTopBar.svelte#L33-L61](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/ContentTopBar.svelte#L33-L61)
- It switches modes using `hasFlatLessons` vs `hasGroupedLessons`: [src/components/ContentTopBar.svelte#L93-L98](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/ContentTopBar.svelte#L93-L98)
- The shared top bar also owns the single mobile overlay state via `activePanel: 'lessons' | 'sections' | null`, which was explicitly the intended unification direction in prior research: [src/components/ContentTopBar.svelte#L100-L157](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/ContentTopBar.svelte#L100-L157), [src/components/ContentTopBar.svelte#L346-L593](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/ContentTopBar.svelte#L346-L593)
- `Course.astro` already uses that shared top bar for regular lessons in flat mode: [src/components/Course.astro#L42-L56](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/Course.astro#L42-L56)
- `ExternalLessonLayout.astro` already uses the same top bar for external lessons in grouped mode: [src/layouts/ExternalLessonLayout.astro#L226-L243](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/layouts/ExternalLessonLayout.astro#L226-L243)

Conclusion: mobile/topbar/TOC unification has mostly already happened. The visible split now is mainly desktop lesson navigation plus upstream data shape.

### 4. The external desktop sidebar is more advanced because it depends on section-aware and checklist-aware data

- `ExternalSidebar.astro` groups lessons by `sectionId`, opens the active section, and renders one collapsible `<details>` block per section: [src/components/external/ExternalSidebar.astro#L19-L29](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/external/ExternalSidebar.astro#L19-L29), [src/components/external/ExternalSidebar.astro#L32-L84](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/external/ExternalSidebar.astro#L32-L84)
- It also renders an optional checklist section, which regular courses do not have: [src/components/external/ExternalSidebar.astro#L86-L139](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/components/external/ExternalSidebar.astro#L86-L139)
- Checklists are the only local content schema I found that already contains a `module` field, and that field is for checklists only, not lessons: [src/content.config.ts#L85-L93](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/content.config.ts#L85-L93)

Conclusion: the external sidebar is not just visually richer; it relies on richer navigation metadata and optional secondary content.

### 5. The external path also contains source-specific complexity that regular courses do not share

- Section inclusion and order are curated through `EXTERNAL_AUTH_CONFIG.sectionIds`, not just whatever Circle returns: [src/server/circle/externalAuthConfig.ts#L16-L54](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/externalAuthConfig.ts#L16-L54), [src/server/circle/courseStructureApi.ts#L274-L287](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureApi.ts#L274-L287)
- Lesson ordering within sections has fallback logic for missing `position`, parsing numeric prefixes such as `[1x2]`, `01`, or `1.2`: [src/server/circle/courseStructureApi.ts#L54-L115](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/src/server/circle/courseStructureApi.ts#L54-L115)
- Prior research confirms this fallback exists because some Circle payloads do not reliably expose lesson `position`, especially in `10xdevs-2`: [thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md#L109-L145](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md#L109-L145)

Conclusion: copying the external component tree onto regular courses would not copy the important part, which is the source-aware adapter logic.

## Architecture Insights

### What is already unified

- Shared mobile lesson/TOC overlay state
- Shared top bar surface
- Shared TOC rendering and behavior
- Shared concept of “flat lessons vs grouped lessons” at the top-bar level

The prior topbar/TOC research explicitly pushed the codebase toward one shared top bar with one overlay owner, and the current code reflects that: [thoughts/shared/research/2026-04-15-topbar-toc-alignment.md#L303-L329](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/thoughts/shared/research/2026-04-15-topbar-toc-alignment.md#L303-L329)

### What is still intentionally split

- The regular desktop sidebar is flat because the regular source data is flat.
- The external desktop sidebar is grouped because the external source data is grouped and curated.
- External lessons optionally include checklists; regular lessons do not.

### Core design principle

The right abstraction boundary is not “course sidebar” vs “external sidebar.” The right abstraction boundary is:

- one shared navigation shell API
- separate adapters that convert each source into that API

The data adapters should absorb source-specific quirks. The UI should not.

## Recommended Unification Path

### Option A: Safe partial unification now

Unify the desktop lesson-navigation component the same way the top bar was unified, but keep two navigation modes.

Recommended shape:

- Introduce a shared `LessonNavigationSidebar` component with props for:
  - `mode: 'flat' | 'grouped'`
  - `flatLessons`
  - `sections`
  - `groupedLessons`
  - `activeLessonId`
  - `courseHrefBuilder`
  - optional `checklists`
- Keep `ContentTopBar.svelte` as-is or align its types to the same navigation contract.
- Replace `Sidebar.astro` and `ExternalSidebar.astro` with thin wrappers or one shared implementation.

This gives visual and structural consistency without inventing module data for regular courses.

### Option B: Full behavioral unification later

If the goal is for regular courses to look grouped by modules too, first add real grouping metadata for regular lessons.

Good sources:

- explicit `section` / `module` frontmatter in the regular lesson schema
- a sidecar course manifest mapping lesson IDs to sections
- an import from another source of truth if one already exists outside this repo

Bad source:

- inferring modules from HTML headings inside each lesson
- inferring modules only from filename numbering conventions unless those conventions are guaranteed

Why: headings describe content inside a lesson, not course structure across lessons.

### Option C: Hybrid adapter

Use one navigation domain model everywhere:

- `NavigationSection { id, name, order }`
- `NavigationLesson { id, name, order, sectionId? }`
- `NavigationChecklist?`
- `NavigationModel { mode, sections, lessons, checklists }`

Then provide:

- `buildNavigationFromCollection(collectionEntries)` for regular courses
- `buildNavigationFromCourseStructure(structure, checklists)` for external courses

This is the cleanest long-term design because it isolates source differences and gives the UI a stable contract.

## Refactoring Opportunities

Code-level findings from a codebase review conducted on 2026-04-15. Grouped by priority.

### High impact / low risk

**R1. `getActiveSectionId()` re-computed inside a section loop**
`src/components/ContentTopBar.svelte` — `getActiveSectionId()` runs a `.find()` over all `groupedLessons` on every iteration of `{#each sections}`. It should be a `const activeSectionId` derived once alongside the other flags at the top of the script, mirroring how `ExternalSidebar.astro:29` already handles it correctly.

**R2. `getDownloadHref()` called twice in the template**
`src/components/ContentTopBar.svelte:296,298` — the function is called once inside `{#if}` and again inside the `href` attribute. Replace with `{@const downloadHref = getDownloadHref()}` to compute once and eliminate the `!` non-null assertion.

**R3. Dead branch in `isChecklistSectionOpen`**
`src/components/external/ExternalSidebar.astro:17`:
```ts
const isChecklistSectionOpen = activeChecklistId !== null
  || checklists.some(c => c.id === activeChecklistId);
```
The `.some()` branch is dead. When `activeChecklistId === null`, `c.id === null` never matches a real ID. When it is non-null, the first condition already returns `true`. Simplify to `const isChecklistSectionOpen = activeChecklistId !== null`.

**R4. Storage key `'external-sidebar-collapsed'` hardcoded in two files**
`src/components/external/ExternalSidebarToggle.svelte:4` defines a named constant; `src/layouts/ExternalLessonLayout.astro:210` duplicates the same string literal in an inline script (needed for FOUC prevention). These two will silently diverge on rename. A comment linking them is the minimum fix; a shared `src/lib/storageKeys.ts` constant is cleaner.

**R5. `ExternalSidebarToggle.svelte` uses Svelte 4 event syntax**
`src/components/external/ExternalSidebarToggle.svelte:33` uses `on:click={toggle}` and plain `let` instead of `$state()`, while `ContentTopBar.svelte` uses Svelte 5 runes (`$state`, `$props`, `$effect`, `onclick={...}`). Both render in the same layout. The toggle component was not migrated when the topbar was.

---

### Medium — require a decision

**R6. Twin active-lesson ID props representing the same concept**
`src/components/ContentTopBar.svelte:46,50` — `activeLessonId?: string | null` and `activeExternalLessonId?: number | null` serve the same logical role but differ in type because flat lessons use string IDs and external lessons use number IDs. `getActiveSectionId()` only consults `activeExternalLessonId`, silently ignoring `activeLessonId`. This is a direct symptom of the missing `NavigationModel` abstraction (see Option C).

**R7. Three boolean flags masking a mode union**
`src/components/ContentTopBar.svelte:93-95`:
```ts
const hasFlatLessons    = lessons.length > 0;
const hasGroupedLessons = sections.length > 0 && groupedLessons.length > 0 && !!courseId;
const hasLessons        = hasFlatLessons || hasGroupedLessons;
```
These three booleans drive four branch points in the template. A discriminated `mode: 'flat' | 'grouped' | 'none'` derived once would be easier to follow and harder to get into an inconsistent state (e.g. `hasFlatLessons && hasGroupedLessons` both true simultaneously).

**R8. `breadcrumb` prop silently suppresses `prevUrl` and `homeUrl`**
`src/components/ContentTopBar.svelte:238-267` — when `breadcrumb` is provided, the entire left side (home link + prev button) is replaced by the breadcrumb text, making `prevUrl` and `homeUrl` silently inert. `breadcrumb` acts as an implicit mode selector for the left side layout, not just a display value. Only one caller uses it (`src/pages/10xdevs-3/ebook/index.astro`). The implicit coupling should be made explicit — either a dedicated layout mode prop, or documented as a mutually exclusive set.

**R9. Polish pluralization logic duplicated**
`src/components/ContentTopBar.svelte:124-128` defines `getChecklistCountLabel()`; `src/components/external/ExternalSidebar.astro:120` contains the identical ternary inline. If the label text ever changes (e.g. for a new course locale) it needs two edits.

**R10. `toc-not-hydrated` critical CSS block copy-pasted into three layouts**
`src/layouts/CourseLayout.astro:52-57`, `src/layouts/ExternalLessonLayout.astro:153-157`, `src/layouts/SharedLessonLayout.astro:120-124` all define identical CSS hiding TOC elements before hydration. A shared partial or a single global stylesheet entry would be the single source of truth.

**R11. `toc-not-hydrated` class added inconsistently across callers**
`src/components/Course.astro:37-41` and `src/layouts/ExternalLessonLayout.astro:219-223` guard the class addition behind `hasToc`; `src/pages/10xdevs-3/ebook/index.astro:25-28` adds it unconditionally regardless of whether the TOC has entries.

---

### Lower — design-level, tied to the unification roadmap

**R12. `courseId` optional prop silently gates grouped mode**
`src/components/ContentTopBar.svelte:94` — `const hasGroupedLessons = ... && !!courseId`. Passing `sections` and `groupedLessons` without `courseId` silently produces "no lessons panel" with no error. The `!!courseId` guard compensates for a type that does not express the actual constraint: grouped mode is not optional about `courseId`.

**R13. Dialog IDs fall back to `tocStorageKey`**
`src/components/ContentTopBar.svelte:97-98`:
```ts
const lessonDialogId = `topbar-lessons-${courseId ?? tocStorageKey}`;
```
When `courseId` is absent, the ARIA `id` becomes `topbar-lessons-toc-widget-open` — a localStorage key repurposed as a DOM identifier. The two concerns are semantically unrelated; the fallback should use something purpose-built for DOM uniqueness.

**R14. Sidebar width `300px` expressed three different ways**
- `src/components/Course.astro:58` — Tailwind JIT `min-w-[300px]`
- `src/layouts/ExternalLessonLayout.astro:185-186` — inline critical CSS `width: 300px; min-width: 300px`
- `src/components/external/ExternalSidebarToggle.svelte:56` — scoped style `left: 296px` (implicitly 300 − 4)

Three representations; a width change requires three edits across two files.

**R15. Highlight.js loaded via CDN in one layout and self-hosted in another**
`src/layouts/CourseLayout.astro:29` loads from `cdnjs.cloudflare.com`; `src/layouts/ExternalLessonLayout.astro:204` loads from `/styles/highlight-github-dark.min.css`. Different delivery strategies for the same stylesheet in the same platform.

**R16. `/external/${courseId}/...` URL templates duplicated across two components**
`src/components/ContentTopBar.svelte` contains four inline `/external/${courseId}/...` templates; `src/components/external/ExternalSidebar.astro` contains two more; `src/components/Sidebar.astro:25` contains the `/courses/` equivalent. Six inline constructions with no shared builder — a route rename requires editing both files.

---

### Relationship to the unification options

- R1, R2, R5 are self-contained fixes requiring no architectural decision.
- R3, R4, R9, R10, R11 are deduplication/cleanup with low coordination cost.
- R6 and R7 are unblocked by Option C: once `NavigationModel` exists, both resolve naturally.
- R8 reveals that `ContentTopBar` is already serving three distinct page types (course lesson, external lesson, ebook page) with different left-side behaviour; this should be a named concept before the component grows further.
- R12, R13, R14, R16 are stabilisation work that should precede any component merger to avoid carrying the inconsistencies into the unified shape.

## Open Questions

1. Is there already a hidden or external source of truth for module boundaries in regular courses that is not in this repo?
2. Should regular courses ever display modules when the source data lacks them, or is flat navigation acceptable there?
3. If regular courses get section metadata, should that metadata live in each lesson file, or in a single manifest per course?
4. Should checklist-style secondary content ever exist for regular courses, or remain external-only?

## Code References

- `src/pages/courses/[...courseSlug]/lesson/[...id].astro` - regular lesson route delegation
- `src/components/Course.astro` - regular lesson shell and flat navigation inputs
- `src/components/Sidebar.astro` - flat desktop sidebar
- `src/content.config.ts` - regular lesson schema and flat filename ordering
- `src/server/content/courseContent.ts` - thin collection access layer
- `src/pages/external/[courseId]/[lessonId].astro` - external lesson route and structure fetch
- `src/layouts/ExternalLessonLayout.astro` - external grouped navigation wiring
- `src/components/external/ExternalSidebar.astro` - grouped desktop sidebar with optional checklists
- `src/components/ContentTopBar.svelte` - already-shared flat/grouped mobile navigation + TOC shell
- `src/server/circle/courseStructureTypes.ts` - grouped external navigation model
- `src/server/circle/courseStructureApi.ts` - Circle section/lesson assembly and ordering
- `src/server/circle/externalAuthConfig.ts` - curated section membership/order
- `src/server/circle/courseStructureCache.ts` - cache-first external structure retrieval

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md` - explains why external ordering logic had to become source-aware and resilient to missing `position`
- `thoughts/shared/research/2026-04-15-toc-component-for-course-lessons.md` - confirms regular courses gained TOC support while preserving their existing lesson-list layout
- `thoughts/shared/plans/2026-04-15-toc-component-for-course-lessons.md` - explicitly says to keep the lesson-list sidebar/navigation intact for regular courses
- `thoughts/shared/research/2026-04-15-topbar-toc-alignment.md` - identifies the shared topbar as the right unification boundary
- `thoughts/shared/plans/2026-04-15-topbar-toc-alignment.md` - documents the move to one shared `ContentTopBar.svelte` with one mobile overlay owner

## Follow-up Research 2026-04-15: Data Flow, Dependencies & Side-Effects

Deep analysis of both sidebars' complete data pipelines, layout integration, and side-effects for unification planning.

### Sidebar.astro — Complete Data-In/Out

**Props contract:**
```typescript
interface Props {
  courseSlug: string;       // URL slug, e.g. "opanuj-frontend"
  activeLessonId: string;  // String ID from filename, e.g. "01"
  lessons: LessonEntry[];  // Full objects including content HTML
}
```

**Single consumer:** `src/components/Course.astro:60`
- Course.astro receives `courseSlug`, `collection`, `lessonId` from page routes
- Fetches full lesson list: `getCollection(collection)` → `CollectionEntry[]`
- Maps to `LessonEntry[]` (which includes full HTML content — wasteful for nav)
- Finds active lesson: `lessons.find(l => l.id === lessonId)`

**Page routes feeding Course.astro:**
1. `src/pages/courses/[...courseSlug]/index.astro` — course index, uses first lesson
2. `src/pages/courses/[...courseSlug]/lesson/[...id].astro` — specific lesson

**Data source:** Astro content collections via `src/server/content/courseContent.ts`
- `getLessonsForCourseCollection()` → `getCollection(collection)`
- `getLessonFromCourseCollection()` → `getEntry(collection, lessonId)`
- Content defined in `src/content.config.ts` with `htmlLoader()`
- Lesson ID derived from first 2 chars of filename, name from `<meta name="lesson-id">`

**Output (rendered HTML):**
- Links: `/courses/${courseSlug}/lesson/${lesson.id}`
- Numbered badge per lesson: `index + 1`
- Active state: `bg-blue-600/25 ring-1 ring-blue-400/35`
- Displays: `lesson.data.name`

**Side-effects:** None. Pure server-rendered HTML. No client JS, no state, no localStorage.

**Layout wrapper:** `Course.astro:57-61`
```
<div class="hidden md:block min-w-[300px] border-r border-gray-700 h-full">
  <div class="h-full overflow-y-auto bg-gray-800/95">
    <Sidebar />
  </div>
</div>
```
- Fixed 300px min-width via Tailwind JIT
- Hidden on mobile (`hidden md:block`)
- Independent scroll via `overflow-y-auto`
- No collapse/toggle mechanism

---

### ExternalSidebar.astro — Complete Data-In/Out

**Props contract:**
```typescript
interface Props {
  courseId: string;                    // Circle course key, e.g. "10xdevs-2"
  lessons: LessonListItem[];          // Lightweight nav items (no content)
  sections: CourseSection[];          // Section grouping metadata
  activeLessonId: number;             // Numeric Circle lesson ID
  checklists?: ChecklistItem[];       // Optional, only for 10xdevs-2
  activeChecklistId?: string | null;  // Slug of active checklist
}
```

**Single consumer:** `src/layouts/ExternalLessonLayout.astro:251-258`

**Page routes feeding ExternalLessonLayout:**
1. `src/pages/external/[courseId]/[lessonId].astro:55-65` — lesson view
2. `src/pages/external/10xdevs-2/checklists/[slug].astro:83-94` — checklist view (activeLessonId=0)
3. `src/pages/external/10xdevs-2/checklists/index.astro:32-42` — checklist index

**Data sources:**
- **Course structure:** `getCourseStructure(courseId, env)` → Circle API v2 → KV cache (30-day TTL)
  - Fetches sections from `/api/admin/v2/course_sections` (paginated)
  - Fetches lessons per section from `/api/admin/v2/course_lessons` (paginated, status='published')
  - Filters to configured `sectionIds` from `EXTERNAL_AUTH_CONFIG`
  - Complex sorting: Circle `position` field → fallback to numeric prefix parsing
  - Cache key: `v2-course-structure-${courseId}`
- **Checklists:** `getChecklistsForCourse(courseId)` → Astro content collection
  - Only returns data for courseId === '10xdevs-2', empty array otherwise
  - Sorted by `order` field

**Internal processing (lines 20-29):**
```typescript
// Groups lessons by section into Map<number, LessonListItem[]>
const lessonsBySection = new Map<number, LessonListItem[]>();
// Determines which section to auto-open
const activeSectionId = lessons.find(l => l.id === activeLessonId)?.sectionId;
```

**Output (rendered HTML):**
- Lesson links: `/external/${courseId}/${lesson.id}`
- Checklist links: `/external/${courseId}/checklists/${checklist.id}`
- Collapsible `<details>` per section, auto-opens active section
- Section header: name + lesson count (e.g. "15 lekcji")
- Checklist section: emerald theme, Polish pluralization
- Active lesson: `bg-blue-800/30 border-blue-500`
- Active checklist: `bg-emerald-800/30 border-emerald-500`

**Side-effects:** None in the component itself. But the layout wrapping it has:
- **ExternalSidebarToggle.svelte** (client:load) — manages collapse state via `localStorage['external-sidebar-collapsed']`
- **FOUC prevention script** in layout — reads localStorage before hydration, sets `body.sidebar-collapsed`
- **CSS transitions** on `.sidebar-container` — `width 0.3s ease` for collapse animation

**Layout wrapper:** `ExternalLessonLayout.astro:249-260`
```
<div class="sidebar-container hidden md:block border-r border-gray-700 h-full">
  <div class="h-full overflow-y-auto bg-gray-900">
    <ExternalSidebar />
  </div>
</div>
```
- Width 300px via critical CSS (not Tailwind)
- Collapse animation via CSS class toggle
- Includes toggle button positioned at sidebar edge

---

### Type Definitions (Full)

**LessonEntry** (`src/models/LessonEntry.ts`):
```typescript
interface LessonEntry {
  id: string;
  data: { id: string; name: string; content: string; };
}
```

**LessonListItem** (`src/server/circle/courseStructureTypes.ts:4-10`):
```typescript
interface LessonListItem {
  id: number;
  name: string;
  position?: number;
  sectionId: number;
  sectionName?: string;
}
```

**CourseSection** (`src/server/circle/courseStructureTypes.ts:15-19`):
```typescript
interface CourseSection {
  id: number;
  name: string;
  position: number;
}
```

**ChecklistItem** (`src/server/checklistData.ts:3-9`):
```typescript
interface ChecklistItem {
  id: string;
  title: string;
  module: string;
  description: string;
  order: number;
}
```

---

### Complete Dependency Trees

**Sidebar.astro dependency chain:**
```
Sidebar.astro
├── type: LessonEntry (src/models/LessonEntry.ts)
├── consumer: Course.astro (src/components/Course.astro:60)
│   ├── sibling: ContentTopBar.svelte (client:load)
│   ├── sibling: Lesson.astro
│   ├── layout: CourseLayout.astro
│   ├── server: getLessonsForCourseCollection() → getCollection()
│   └── pages:
│       ├── courses/[...courseSlug]/index.astro
│       └── courses/[...courseSlug]/lesson/[...id].astro
│           └── auth: verifyAuth() → Supabase → Airtable fallback
└── data: Astro content collections (src/content/{collection}/*.html)
    └── loader: htmlLoader() (src/content.config.ts:18-33)
```

**ExternalSidebar.astro dependency chain:**
```
ExternalSidebar.astro
├── types:
│   ├── LessonListItem (src/server/circle/courseStructureTypes.ts)
│   ├── CourseSection (src/server/circle/courseStructureTypes.ts)
│   └── ChecklistItem (src/server/checklistData.ts)
├── consumer: ExternalLessonLayout.astro (src/layouts/ExternalLessonLayout.astro:251)
│   ├── sibling: ContentTopBar.svelte (client:load, grouped mode)
│   ├── sibling: ExternalSidebarToggle.svelte (client:load)
│   ├── FOUC script (inline, reads localStorage)
│   └── pages:
│       ├── external/[courseId]/[lessonId].astro
│       ├── external/10xdevs-2/checklists/[slug].astro
│       └── external/10xdevs-2/checklists/index.astro
│           └── auth: verifyExternalAuth() → Circle membership
├── data (structure):
│   ├── getCourseStructure() (src/server/circle/courseStructureCache.ts)
│   │   ├── KV cache: PLATFORM_LESSON_CACHE (30-day TTL)
│   │   └── fetchCourseStructure() (src/server/circle/courseStructureApi.ts)
│   │       ├── Circle API v2: sections + lessons (paginated)
│   │       ├── section filter: EXTERNAL_AUTH_CONFIG.sectionIds
│   │       └── sorting: position → numeric prefix fallback
│   └── configured courses: externalAuthConfig.ts
│       └── opanuj-frontend, 10xdevs-1, 10xdevs-2, 10xdevs-3
└── data (checklists):
    └── getChecklistsForCourse() (src/server/checklistData.ts)
        └── getCollection('checklists') — only for 10xdevs-2
```

---

### Key Differences Summary for Unification

| Dimension | Sidebar.astro | ExternalSidebar.astro |
|-----------|--------------|----------------------|
| **ID type** | `string` | `number` |
| **Grouping** | Flat list | Sections via `<details>` |
| **Content in props** | Yes (full HTML in LessonEntry) | No (lightweight nav items) |
| **Background** | `bg-gray-800/95` | `bg-gray-900` |
| **Active color** | Blue ring+fill | Blue left-border |
| **Numbering** | Badge with `index+1` | None |
| **Header** | Sticky "Lekcje" + count | Per-section name + count |
| **Checklists** | None | Optional emerald section |
| **Collapse toggle** | None | ExternalSidebarToggle.svelte |
| **Width source** | Tailwind `min-w-[300px]` | Critical CSS `width: 300px` |
| **Link pattern** | `/courses/{slug}/lesson/{id}` | `/external/{courseId}/{id}` |
| **Auth model** | Supabase+Airtable | Circle membership |
| **Cache** | None (static) | KV 30-day TTL |

### Unification Implications

1. **A unified component needs a URL builder prop** — the link pattern differs fundamentally
2. **ID type must be normalized** — `string | number` or a discriminated union
3. **Section grouping is opt-in** — flat mode (no sections) must remain a valid configuration
4. **Checklists are opt-in** — only 10xdevs-2 uses them currently
5. **The collapse toggle lives outside the sidebar** — it's a layout concern, not a sidebar concern
6. **Background/styling differ subtly** — needs a decision on which to keep
7. **Content should NOT flow through nav props** — ExternalSidebar's lightweight approach is better; Sidebar currently receives full HTML content wastefully
8. **Width representation must be unified** — currently Tailwind in one place, critical CSS in another

## Related Research

- [2026-02-22-external-10xdevs2-sidebar-ordering.md](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md)
- [2026-04-15-toc-component-for-course-lessons.md](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/thoughts/shared/research/2026-04-15-toc-component-for-course-lessons.md)
- [2026-04-15-topbar-toc-alignment.md](https://github.com/przeprogramowani/przeprogramowani-sites/blob/35a5a7f739b383fbcdcb3ef3336de4a1b5374ff1/thoughts/shared/research/2026-04-15-topbar-toc-alignment.md)
