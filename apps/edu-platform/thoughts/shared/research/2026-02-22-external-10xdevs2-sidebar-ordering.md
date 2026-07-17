---
date: 2026-02-22T21:17:12+0000
researcher: Codex
git_commit: 80dd0bcc6d2076dfc1d1804327327f412a77a1ca
branch: master
repository: przeprogramowani-sites
topic: "10xDevs 2.0 external course sidebar lesson ordering"
tags: [research, codebase, external-courses, circle, sidebar-order]
status: complete
last_updated: 2026-02-22
last_updated_by: Codex
last_updated_note: "Added follow-up research confirming missing lesson position field in Circle v2 API payload for 10xdevs-2"
---

# Research: 10xDevs 2.0 external course sidebar lesson ordering

**Date**: 2026-02-22T21:17:12+0000
**Researcher**: Codex
**Git Commit**: 80dd0bcc6d2076dfc1d1804327327f412a77a1ca
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Currently order of lessons in sidebar of "10xDevs 2.0" external course is not in right order. Find how it works, what could be the reason, and how we can fix this.

## Summary

The external sidebar order is not based on Circle lesson IDs. Lessons are explicitly sorted by Circle `position` in `fetchAllLessonsForSection()`, then rendered in the same order.

The most likely causes of wrong order are:

1. Section order is manually hardcoded for `10xdevs-2` and that manual array is treated as the source of truth (not Circle section `position`).
2. Course structure is cached for 30 days, so a recent reorder in Circle can remain stale.
3. Circle lesson `position` values may be wrong/duplicated (less likely if only some lessons are out of order, but possible).

## Detailed Findings

### 1. Sidebar rendering preserves incoming order

- The lesson page loads course structure via `getCourseStructure(courseId, env)` and passes `structure.lessons` / `structure.sections` into `ExternalLessonLayout` (`src/pages/external/[courseId]/[lessonId].astro:47`, `src/pages/external/[courseId]/[lessonId].astro:68`, `src/pages/external/[courseId]/[lessonId].astro:69`).
- `ExternalLessonLayout` passes those arrays directly into `ExternalSidebar` (`src/layouts/ExternalLessonLayout.astro:217`, `src/layouts/ExternalLessonLayout.astro:219`, `src/layouts/ExternalLessonLayout.astro:220`).
- `ExternalSidebar` groups lessons by filtering the original `lessons` array for each section and renders them without additional sorting (`src/components/external/ExternalSidebar.astro:21`, `src/components/external/ExternalSidebar.astro:24`, `src/components/external/ExternalSidebar.astro:34`, `src/components/external/ExternalSidebar.astro:68`).

Implication: Any wrong ordering originates upstream in course-structure fetching/caching/config, not in the sidebar component.

### 2. Lesson order uses Circle `position`, not lesson ID

- Circle lesson records are mapped to internal `LessonListItem` and sorted by `position` (`src/server/circle/courseStructureApi.ts:129`, `src/server/circle/courseStructureApi.ts:138`).
- The code comment explicitly states "sort by position" (`src/server/circle/courseStructureApi.ts:129`).
- `LessonListItem` contains both `id` and `position`, confirming ordering metadata is expected to come from `position` (`src/server/circle/courseStructureTypes.ts:4`, `src/server/circle/courseStructureTypes.ts:7`).

Implication: Non-ascending Circle lesson IDs alone should not cause incorrect order here.

### 3. Section order is hardcoded from config (overrides Circle section position)

- All Circle sections are fetched and sorted by their `position` (`src/server/circle/courseStructureApi.ts:67`, `src/server/circle/courseStructureApi.ts:74`).
- But then the code rebuilds the final section list by iterating configured `sectionIds` and mapping each ID to the fetched section, explicitly preserving config order (`src/server/circle/courseStructureApi.ts:171`, `src/server/circle/courseStructureApi.ts:173`).
- Lessons are fetched per section in that same configured order and flattened (`src/server/circle/courseStructureApi.ts:176`, `src/server/circle/courseStructureApi.ts:183`, `src/server/circle/courseStructureApi.ts:184`).
- `10xdevs-2` has a hardcoded `sectionIds` array in `EXTERNAL_AUTH_CONFIG` (`src/server/circle/externalAuthConfig.ts:33`, `src/server/circle/externalAuthConfig.ts:39`).

Implication: If the configured `sectionIds` array is stale or in the wrong order, the sidebar sequence will be wrong even if Circle data is correct.

### 4. Structure cache can keep outdated order for up to 30 days

- `getCourseStructure()` is cache-first (`src/server/circle/courseStructureCache.ts:145`, `src/server/circle/courseStructureCache.ts:147`).
- Default structure cache TTL is 30 days (`src/server/circle/courseStructureCache.ts:8`, `src/server/circle/courseStructureCache.ts:42`).
- If cached structure is still fresh, no refetch happens (`src/server/circle/courseStructureCache.ts:73`, `src/server/circle/courseStructureCache.ts:78`, `src/server/circle/courseStructureCache.ts:149`).
- There is an invalidation function, but no usage was found in the app code (`src/server/circle/courseStructureCache.ts:121`).

Implication: Reordering sections/lessons in Circle may not appear in the external sidebar until cache expiry, unless cache is manually invalidated.

## Code References

- `src/pages/external/[courseId]/[lessonId].astro:47` - Course structure fetch used for navigation/sidebar.
- `src/layouts/ExternalLessonLayout.astro:217` - Sidebar component receives lessons/sections directly.
- `src/components/external/ExternalSidebar.astro:21` - Sidebar groups lessons by section via `filter`.
- `src/server/circle/courseStructureApi.ts:129` - Lessons mapped and sorted by `position`.
- `src/server/circle/courseStructureApi.ts:171` - Sections reordered by config `sectionIds`.
- `src/server/circle/courseStructureApi.ts:176` - Lessons fetched in final section order.
- `src/server/circle/externalAuthConfig.ts:39` - Hardcoded section order for `10xdevs-2`.
- `src/server/circle/courseStructureCache.ts:8` - 30-day cache TTL.
- `src/server/circle/courseStructureCache.ts:145` - Cache-first retrieval path.

## Architecture Insights

- The external navigation order is a composition of:
  - section inclusion/order from `EXTERNAL_AUTH_CONFIG.sectionIds`
  - lesson order within each section from Circle `lesson.position`
  - long-lived KV cache of the composed structure
- This design allows deterministic inclusion of selected sections but is prone to drift when Circle content is reordered unless config and cache are maintained.

## Historical Context (from thoughts/)

- No relevant prior research/plans about external sidebar/course-structure ordering were found in `thoughts/`.

## Related Research

- None yet.

## Open Questions

- Is the visible issue within a single section, or is it the overall sequence across sections?
- Have lessons/sections in Circle been reordered recently (within the last 30 days), which would point to stale `PLATFORM_LESSON_CACHE` data?
- Do any affected Circle lessons share the same `position` value (causing ambiguous ordering)?

## Follow-up Research 2026-02-22T21:22:46+0000

User clarified that section order is correct, but lesson order *within sections* is wrong.

### Confirmed root cause (live Circle API payload)

- A direct request to Circle Admin v2 `course_lessons` for `10xdevs-2` sections showed that lesson records do **not** include a `position` field at all.
- Example record keys included `id`, `name`, `status`, `created_at`, `updated_at`, `section_id`, `body_html`, etc., but no `position`.
- This conflicts with the local type `CircleCourseLessonRecord` which assumes `position: number` (`src/server/circle/courseStructureTypes.ts:46`, `src/server/circle/courseStructureTypes.ts:49`).

### Why ordering breaks in current code

- The code sorts lessons with `.sort((a, b) => a.position - b.position)` (`src/server/circle/courseStructureApi.ts:138`).
- When `position` is missing, both values are `undefined`, so the comparator returns `NaN`.
- In practice this means the sort does not produce a meaningful order and the array remains in Circle's raw API order.
- The raw API order for affected sections is visibly not pedagogical order (e.g. module 1 lessons appeared as `[1x1], [1x3], [1x5], [1x7], [1x2], [1x4], ...`).

### Practical fixes for lesson ordering (within section)

1. **Stop trusting `position` blindly**
   - Make `position` optional in `CircleCourseLessonRecord` and `LessonListItem` handling.
   - Only sort by `position` when all records in the section have valid numeric positions.

2. **Add a fallback sort for 10xDevs naming pattern**
   - Parse lesson titles like `[1x4] ...` and sort by the second number within a section.
   - This matches the visible intended order for `10xdevs-2`.
   - Keep stable raw API order as final fallback for lessons without the prefix (e.g. guide/checklist-like lessons).

3. **Add diagnostics/logging**
   - Log once per section when no `position` is present to make future regressions obvious.

### Recommended implementation direction

- Implement a `sortLessonsForSection(courseId, lessons)` helper in `src/server/circle/courseStructureApi.ts`:
  - If all lessons have numeric `position` -> sort by `position`
  - Else if `courseId === '10xdevs-2'` (and optionally `10xdevs-2-en`) -> sort by parsed `[NxM]` prefix
  - Else preserve API order (no-op sort)

This fixes the current issue without risking incorrect heuristics for other external courses.
