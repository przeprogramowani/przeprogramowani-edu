# i18n (PL/EN) Support for 10xDevs 3.0 Main Course — Implementation Plan

## Overview

Add English language support to the `10xdevs-3` course by replicating the proven prework i18n pattern: separate content collections per language, `[lang]` URL segment in external routes, and a parameterized content pipeline for Circle push.

## Current State Analysis

The `10xdevs-3-prework` course already has full PL/EN support across 4 layers: content collections, service helpers, route structure, and content pipeline. The main `10xdevs-3` course currently serves 5 Polish lessons (Module 1) through both internal (`/courses/`) and external (`/external/`) routes, with no language awareness.

### Key Discoveries:

- Lesson schema already has `language: z.enum(['pl', 'en']).optional()` (`content.config.ts:11`)
- Link localization regex already matches `10xdevs-3` (`lessonHtmlEnricher.ts:138`)
- Shell copy (`externalLessonShellCopy.ts`) already has full PL/EN string dictionary
- Progress tracking already supports optional `language` parameter
- EN Circle space exists: group 1054673, lessons space 2601706
- `externalMarkdownContent.ts` has `getMarkdownCollection()` that ignores language for 10xdevs-3 (line 75)

## Desired End State

After this plan is complete:
- `/external/10xdevs-3/` shows a language picker (PL/EN cards with lesson counts)
- `/external/10xdevs-3/pl/{lessonId}` serves Polish lessons (from `lessons10xDevs3` collection)
- `/external/10xdevs-3/en/{lessonId}` serves English lessons (from `lessons10xDevs3En` collection)
- `/courses/10xdevs-3/` redirects to `/external/10xdevs-3/`
- `/courses/10xdevs-3/lesson/{id}` redirects to `/external/10xdevs-3/pl/{id}`
- EN content enrichment pipeline works (PL markdown → EN HTML metadata injection)
- Circle push scripts accept `--lang` flag for pushing to PL or EN spaces
- Progress is tracked per-language (completing PL lesson doesn't mark EN as done)

### Verification:

- Navigate to `/external/10xdevs-3/` and see language picker
- Navigate to `/external/10xdevs-3/pl/01` and see PL lesson content
- Navigate to `/external/10xdevs-3/en/01` and see EN lesson content (once HTML files exist)
- Navigate to `/courses/10xdevs-3/` and get redirected to `/external/10xdevs-3/`
- Run `npx tsx enrich-lesson-html.ts --lang en` and see EN metadata enrichment for 10xdevs-3
- Run `npx tsx push.ts --lang en` and push EN content to Circle space 2601706

## What We're NOT Doing

- Translating lesson content (EN HTML will be placed externally, same as prework)
- Adding an in-lesson language switcher (users go back to index to change language)
- Feature-flagging EN content (available as soon as HTML files land)
- Generalizing `preworkContent.ts` into a universal language service (duplicate-then-evolve approach)
- Creating Module 2+ PL HTML (only Module 1 exists; this plan handles the i18n infrastructure)

## Implementation Approach

Mirror the 4-layer prework pattern: collections → service helpers → routes → pipeline. Each layer is self-contained and testable before moving to the next.

---

## Phase 1: Content Collection & Service Layer

### Overview

Define the EN content collection, extend the type system, and create a service helper module for the main course that mirrors `preworkContent.ts`.

### Changes Required:

#### 1. Content Collection Definition

**File**: `src/content.config.ts`

**Intent**: Add `lessons10xDevs3En` collection loading from `lessons10xDevs3/en/*.html`, parallel to how `lessons10xDevs3PreworkEn` loads from `lessons10xDevs3Prework/en/*.html`.

**Contract**: New `defineCollection()` call with loader pattern `contentPattern('lessons10xDevs3/en/*.html')` and `lessonSchema`. Must be exported in the `collections` object.

#### 2. Type Union Extension

**File**: `src/models/LessonCollection.ts`

**Intent**: Add `'lessons10xDevs3En'` to the `LessonCollection` type union so the new collection is recognized by all typed helpers.

**Contract**: Append `| 'lessons10xDevs3En'` to the existing union type.

#### 3. Main Course Content Service

**File**: `src/server/content/mainCourseContent.ts` (NEW)

**Intent**: Create a service module for 10xdevs-3 that provides language-aware lesson fetching, adjacent lesson navigation, and localized section definitions. Mirrors `preworkContent.ts` structure.

**Contract**:
```typescript
export const MAIN_COURSE_ID = '10xdevs-3';
export type MainCourseLanguage = 'pl' | 'en';

const MAIN_COURSE_COLLECTION_BY_LANGUAGE: Record<MainCourseLanguage, LessonCollection>;

export function isMainCourseLanguage(language: string | undefined): language is MainCourseLanguage;
export async function getMainCourseLessons(language: MainCourseLanguage): Promise<MainCourseLessonEntry[]>;
export async function getMainCourseLesson(language: MainCourseLanguage, lessonId: string): Promise<MainCourseLessonEntry | null>;
export function getAdjacentMainCourseLessonIds(lessons, activeLessonId): { prevLessonId, nextLessonId };
export function getMainCourseSections(language: MainCourseLanguage): CourseSection[];
```

Section names: `language === 'pl'` returns "Moduł N: ..." strings, `'en'` returns "Module N: ..." strings. 5 sections with lesson ranges [1,5], [6,10], [11,15], [16,20], [21,25].

#### 4. External Markdown Content — Language Awareness

**File**: `src/server/content/externalMarkdownContent.ts`

**Intent**: Make `getMarkdownCollection()` and `getExternalMarkdownCourseStructure()` language-aware for `10xdevs-3`, so that passing a language parameter resolves to the correct collection and localized section names.

**Contract**:
- `MARKDOWN_COURSE_COLLECTIONS` becomes language-aware for `10xdevs-3` (or delegated to `mainCourseContent.ts`)
- `getMarkdownCollection('10xdevs-3', 'en')` returns `'lessons10xDevs3En'`
- `MAIN_COURSE_SECTIONS` gets a language parameter: `'pl'` → "Moduł N: ...", `'en'` → "Module N: ..."
- `getExternalMarkdownCourseStructure('10xdevs-3', 'en')` returns structure with English section names

#### 5. EN Content Directory

**File**: `src/content/lessons10xDevs3/en/.gitkeep` (NEW)

**Intent**: Create the EN directory so the collection loader doesn't fail when no HTML files exist yet.

**Contract**: Empty `.gitkeep` file at `src/content/lessons10xDevs3/en/`.

### Success Criteria:

#### Automated Verification:

- TypeScript compiles: `npx tsc --noEmit`
- Collection exports correctly in content config
- Unit test for `mainCourseContent.ts`: `isMainCourseLanguage('pl')` → true, `isMainCourseLanguage('fr')` → false
- Unit test for `getMainCourseSections('en')` returns English section names
- Existing tests pass: `npm run test`

#### Manual Verification:

- Dev server starts without errors: `npm run dev`
- No regressions on existing `/external/10xdevs-3/` route

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Route Structure

### Overview

Add `[lang]` URL segment routes for 10xdevs-3, redirect internal routes to external, and extend URL validation.

### Changes Required:

#### 1. External Language Route — Lesson View

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Intent**: Extend the existing `[lang]/[lessonId]` route (currently prework-only) to also handle `10xdevs-3`. When `courseId === '10xdevs-3'` and `lang` is valid, serve the lesson from the language-appropriate collection using `mainCourseContent.ts`.

**Contract**: The route currently checks `courseId !== PREWORK_COURSE_ID` (line 26-28) and returns 404 for non-prework. Change to support both `PREWORK_COURSE_ID` and `MAIN_COURSE_ID`. Use `getMainCourseLesson(lang, lessonId)` for the main course path. Wire progress tracking with `language` parameter set.

#### 2. External Language Route — Markdown Export

**File**: `src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro`

**Intent**: Extend the markdown export route to handle `10xdevs-3` lessons in both languages, following the same pattern as the lesson view.

**Contract**: Same gating logic as the lesson view route — support `MAIN_COURSE_ID` in addition to `PREWORK_COURSE_ID`.

#### 3. External Non-Language Route — Course Gate

**File**: `src/pages/external/[courseId]/[lessonId].astro`

**Intent**: When `courseId === '10xdevs-3'`, reject `lessonId` values that aren't a valid language (same logic as prework on lines 36-38). This prevents the old non-language lesson URLs from serving content — they should 404 or redirect.

**Contract**: Add `isMainCourseLanguage(lessonId)` check alongside the existing `isPreworkLanguage(lessonId)` check. When `courseId` is `MAIN_COURSE_ID` and `lessonId` is not a valid language, return 404 (or redirect to `/external/10xdevs-3/`).

#### 4. Internal Route Redirect — Course Index

**File**: `src/pages/courses/[...courseSlug]/index.astro`

**Intent**: Redirect `/courses/10xdevs-3/` to `/external/10xdevs-3/` (language picker), matching prework behavior.

**Contract**: Add condition `if (courseSlug === '10xdevs-3')` returning `Astro.redirect('/external/10xdevs-3')`, parallel to the prework redirect on line 12-13.

#### 5. Internal Route Redirect — Lesson View

**File**: `src/pages/courses/[...courseSlug]/lesson/[...id].astro`

**Intent**: Redirect `/courses/10xdevs-3/lesson/{id}` to `/external/10xdevs-3/pl/{id}`, defaulting to Polish for backward compatibility of existing links.

**Contract**: Add condition `if (courseSlug === '10xdevs-3')` returning redirect to `/external/10xdevs-3/pl/${legacyLessonId}`, parallel to the prework redirect on lines 10-13.

#### 6. URL Validation Extension

**File**: `src/server/urlValidation.ts`

**Intent**: Extend URL validation to recognize `10xdevs-3` language paths in addition to prework paths.

**Contract**: Functions `resolveExternalAuthLanguage()` and `localizeExternalAuthReturnUrl()` must handle the `10xdevs-3` course ID with `[lang]` segment. Pattern: same validation applied to both `PREWORK_COURSE_ID` and `MAIN_COURSE_ID`.

### Success Criteria:

#### Automated Verification:

- TypeScript compiles: `npx tsc --noEmit`
- URL validation tests pass (if existing)
- Existing route tests pass: `npm run test`
- No broken imports

#### Manual Verification:

- `/external/10xdevs-3/pl/01` serves PL lesson content
- `/external/10xdevs-3/en/01` returns 404 gracefully (no EN HTML yet) or empty state
- `/courses/10xdevs-3/` redirects to `/external/10xdevs-3/`
- `/courses/10xdevs-3/lesson/01` redirects to `/external/10xdevs-3/pl/01`
- `/external/10xdevs-3/01` returns 404 (no longer valid without language segment)
- Login flow preserves language in return URL

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Content Pipeline

### Overview

Parameterize the HTML enrichment and Circle push scripts to support EN content for the main course.

### Changes Required:

#### 1. HTML Enricher — Add 10xDevs3 EN Target

**File**: `src/server/content/lessonHtmlEnricher.ts`

**Intent**: Add `lessons10xDevs3En` to the enrichment targets so that EN HTML files in `src/content/lessons10xDevs3/en/` get enriched with metadata from PL source markdown, same pattern as prework EN.

**Contract**: In `createDefaultLessonHtmlEnrichmentTargets()`, add a target:
```typescript
{
  courseKey: 'lessons10xDevs3En',
  language: 'en',
  sourceGlob: path.join(rootDir, 'src/content-source/lessons10xDevs3/pl/*.md'),
  htmlDir: path.join(rootDir, 'src/content/lessons10xDevs3/en'),
  rootDir,
}
```

#### 2. Circle Prepare Script — Language Parameter

**File**: `/Users/admin/code/przeprogramowani-sites/utils/circle-lesson-backup/prepare.ts`

**Intent**: Accept `--lang pl|en` argument (defaulting to `pl` for backward compatibility). Resolve `PLATFORM_HTML_DIR` and `OUTPUT_DIR` based on language.

**Contract**:
- `--lang pl` (or no flag): reads from `lessons10xDevs3/pl`, writes to `content/lessons10xDevs3/pl` (current behavior)
- `--lang en`: reads from `lessons10xDevs3/en`, writes to `content/lessons10xDevs3/en`
- Paths derived from language parameter, not hardcoded

#### 3. Circle Push Script — Language Parameter

**File**: `/Users/admin/code/przeprogramowani-sites/utils/circle-lesson-backup/push.ts`

**Intent**: Accept `--lang pl|en` argument. Resolve `CONTENT_DIR`, `LESSON_MAP_PATH`, and Circle config based on language.

**Contract**:
- `--lang pl` (or no flag): uses `content/lessons10xDevs3/pl`, `lesson-map.json`, `TEN_X_DEVS_THIRD_ED` config (current behavior)
- `--lang en`: uses `content/lessons10xDevs3/en`, `lesson-map-en.json`, `TEN_X_DEVS_THIRD_ED_EN` config
- Both share the same push logic, only paths and config differ

#### 4. EN Circle Course Configuration

**File**: `/Users/admin/code/przeprogramowani-sites/projects/common/src/circle/course-config.ts`

**Intent**: Add `TEN_X_DEVS_THIRD_ED_EN` config entry for the English Circle space.

**Contract**:
```typescript
export const TEN_X_DEVS_THIRD_ED_EN: CourseConfig = {
  platform: Platform.CIRCLE_BRAVE,
  directory_name: '10xdevs-3ed-en',
  space_id: 2601706,
  section_ids: [998474, 998475],
};
```

Section IDs will expand as more modules are added.

#### 5. EN Lesson Map

**File**: `/Users/admin/code/przeprogramowani-sites/utils/circle-lesson-backup/content/lessons10xDevs3/lesson-map-en.json` (NEW)

**Intent**: Map EN lesson filenames to their Circle section and lesson IDs for push.

**Contract**:
```json
{
  "01-m1l1-od-pomyslu-do-prd": {
    "sectionId": 998474,
    "circleLessonId": 3788454
  },
  "02-m1l2-od-chatbota-do-agenta": {
    "sectionId": 998474,
    "circleLessonId": 3788459
  },
  "03-m1l3-ai-powered-bootstrap": {
    "sectionId": 998474,
    "circleLessonId": 3788464
  },
  "04-m1l4-agent-onboarding": {
    "sectionId": 998474,
    "circleLessonId": 3788467
  },
  "05-m1l5-od-localhosta-na-produkcje": {
    "sectionId": 998474,
    "circleLessonId": 3788472
  }
}
```

Module 2 entries (section 998475, lessons 3788456, 3788461, 3788466, 3788471, 3788476) will be added when Module 2 EN content is ready.

### Success Criteria:

#### Automated Verification:

- TypeScript compiles: `npx tsc --noEmit`
- Enricher dry-run succeeds (when EN HTML exists): `npx tsx src/server/content/enrich-lesson-html.ts --lang en --dry-run`
- Prepare dry-run succeeds: `cd ../../utils/circle-lesson-backup && npx tsx prepare.ts --lang en --dry-run`
- Existing PL pipeline still works: `npx tsx prepare.ts --dry-run` (no --lang flag)

#### Manual Verification:

- Place a test EN HTML file in `src/content/lessons10xDevs3/en/01-m1l1-od-pomyslu-do-prd.html`
- Run enricher for EN and verify metadata injection
- Run prepare for EN and verify output in `content/lessons10xDevs3/en/`
- Verify PL prepare and push still work unchanged

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Language Picker & UI

### Overview

Update the external course index to show a language picker for 10xdevs-3, wire up lesson counts, and ensure progress tracking works per-language.

### Changes Required:

#### 1. External Index — Language Picker for Main Course

**File**: `src/pages/external/[courseId]/index.astro`

**Intent**: When `courseId === '10xdevs-3'`, show a language picker UI (PL/EN cards with lesson counts) instead of the current section-based lesson list. Follows the same pattern as the prework language picker (lines 41-60).

**Contract**: Add `isMainCourse` check alongside `isPrework`. When main course, fetch lesson counts per language using `getMainCourseLessons('pl').length` and `getMainCourseLessons('en').length`. Build language entry cards with localized descriptions. The language picker template/component is reused from the prework rendering block in the page's HTML section.

#### 2. Lesson Count Formatting

**File**: `src/server/content/mainCourseContent.ts`

**Intent**: Add a `formatMainCourseLessonCount(count, language)` function for the language picker description, similar to `formatPreworkLessonCount`.

**Contract**: Returns localized string like "5 lekcji dostępnych" / "5 lessons available". Handles Polish pluralization rules (1 lekcja, 2-4 lekcje, 5+ lekcji).

#### 3. Progress Tracking — Language Parameter

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Intent**: Pass `language` to `loadLessonProgressForCourse()` when serving main course lessons, so progress is tracked per-language.

**Contract**: When course is `10xdevs-3`, pass `language: lang` (the URL segment) to the progress loader instead of `language: null`. This mirrors how prework progress is already language-aware.

### Success Criteria:

#### Automated Verification:

- TypeScript compiles: `npx tsc --noEmit`
- Unit test for `formatMainCourseLessonCount()` with both languages
- All tests pass: `npm run test`

#### Manual Verification:

- `/external/10xdevs-3/` shows language picker with PL card showing "5 lekcji" and EN card showing "0 lessons" (until EN files land)
- Clicking PL card navigates to `/external/10xdevs-3/pl` (lesson list)
- Clicking EN card navigates to `/external/10xdevs-3/en` (empty or lesson list)
- Completing a PL lesson doesn't mark the EN equivalent as done
- Login flow on external routes preserves language context

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- `mainCourseContent.test.ts` — language validation, section localization, adjacent lesson navigation
- `externalMarkdownContent.test.ts` — extend existing tests with language parameter for 10xdevs-3
- `formatMainCourseLessonCount.test.ts` — Polish/English pluralization edge cases (0, 1, 2, 5, 21)

### Integration Tests:

- External route serves correct collection based on language segment
- Internal routes redirect correctly with proper language suffix
- Progress isolation between PL and EN

### Manual Testing Steps:

1. Start dev server, navigate to `/external/10xdevs-3/` — verify language picker
2. Click through PL lesson flow end-to-end
3. Place a test EN HTML file, verify EN lesson renders
4. Verify `/courses/10xdevs-3/` redirects to external
5. Verify existing prework i18n still works (regression check)
6. Test login flow → redirect back to correct language path

## Performance Considerations

- EN collection with 0 files should not cause loader errors or add build time
- Language picker page makes 2 collection queries (PL + EN lesson counts) — both are from static collections, negligible cost
- No impact on existing PL lesson serving performance

## Migration Notes

- Existing URLs `/external/10xdevs-3/{numericLessonId}` will 404 after this change — these should now be `/external/10xdevs-3/pl/{numericLessonId}`
- Internal URLs `/courses/10xdevs-3/lesson/{id}` will redirect to `/external/10xdevs-3/pl/{id}` — backward compatible
- No database migration needed (progress tracking already supports language field)
- EN content appears automatically when HTML files are placed in `src/content/lessons10xDevs3/en/`

## References

- Research: `context/changes/support-i18n-for-10xdevs3/research.md`
- Prework pattern (model): `src/server/content/preworkContent.ts`
- Prework routes: `src/pages/external/[courseId]/[lang]/[lessonId].astro`
- Circle push: `utils/circle-lesson-backup/push.ts`
- PL Circle config: `projects/common/src/circle/course-config.ts:17-22`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Content Collection & Service Layer

#### Automated

- [x] 1.1 TypeScript compiles: `npx tsc --noEmit` — 684968e5
- [x] 1.2 Unit test for `isMainCourseLanguage` passes — 684968e5
- [x] 1.3 Unit test for `getMainCourseSections('en')` passes — 684968e5
- [x] 1.4 Existing tests pass: `npm run test` — 684968e5

#### Manual

- [x] 1.5 Dev server starts without errors — 495e5772
- [x] 1.6 No regressions on existing `/external/10xdevs-3/` route — 495e5772

### Phase 2: Route Structure

#### Automated

- [x] 2.1 TypeScript compiles: `npx tsc --noEmit` — 684968e5
- [x] 2.2 URL validation tests pass — 684968e5
- [x] 2.3 Existing tests pass: `npm run test` — 684968e5

#### Manual

- [x] 2.4 `/external/10xdevs-3/pl/01` serves PL lesson — 495e5772
- [x] 2.5 `/courses/10xdevs-3/` redirects to `/external/10xdevs-3/` — 495e5772
- [x] 2.6 `/courses/10xdevs-3/lesson/01` redirects to `/external/10xdevs-3/pl/01` — 495e5772
- [x] 2.7 `/external/10xdevs-3/01` returns 404 — 495e5772
- [x] 2.8 Login flow preserves language in return URL — 495e5772

### Phase 3: Content Pipeline

#### Automated

- [x] 3.1 TypeScript compiles: `npx tsc --noEmit` — a44ecf3a
- [x] 3.2 PL pipeline unchanged: `npx tsx prepare.ts --dry-run` — a44ecf3a
- [x] 3.3 EN prepare dry-run succeeds (when EN HTML exists) — a44ecf3a

#### Manual

- [x] 3.4 Enricher injects metadata into test EN HTML file — a44ecf3a
- [x] 3.5 PL prepare and push still work unchanged — a44ecf3a

### Phase 4: Language Picker & UI

#### Automated

- [x] 4.1 TypeScript compiles: `npx tsc --noEmit` — 495e5772
- [x] 4.2 Unit test for `formatMainCourseLessonCount()` passes — 495e5772
- [x] 4.3 All tests pass: `npm run test` — 495e5772

#### Manual

- [x] 4.4 `/external/10xdevs-3/` shows language picker — 495e5772
- [x] 4.5 PL card shows correct lesson count — 495e5772
- [x] 4.6 EN card shows correct lesson count (0 or actual) — 495e5772
- [x] 4.7 Progress tracked per-language — 495e5772
- [x] 4.8 Existing prework i18n unaffected (regression) — 495e5772
