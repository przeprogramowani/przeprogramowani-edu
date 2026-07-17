# HTML Support and Shared External Rendering Shell Implementation Plan

## Overview

Implement the next step in the external lesson rendering model without rebuilding work that already exists.
Commit `875999e1` already introduced the Markdown loader/resolver path for bilingual prework and `10xdevs-3` local Markdown. This plan preserves that baseline, adds mixed local `.md`/`.html` support for `10xdevs-3`, and rewires localized prework lesson pages to use the same external lesson shell as `/external/10xdevs-2/{lessonId}`.

The practical problem is route-level shell drift: `/external/10xdevs-3-prework/{pl|en}/{lessonId}` renders Markdown content through a custom lightweight layout, while the newer external shell with sidebar, topbar, TOC, and Markdown download is already available elsewhere.

## Current State Analysis

The platform already has local Markdown support and localized prework content in place:

- `10xdevs-3` is configured as a Markdown-backed collection in `src/content.config.ts:80`, but the loader only scans `src/content/lessons10xDevs3/*.md`.
- `src/content/lessons10xDevs3/` currently contains only `.gitkeep`, so mixed local content support is future-facing but can be implemented safely now.
- `src/server/content/externalMarkdownContent.ts:61` maps `10xdevs-3` to `lessons10xDevs3`.
- `src/server/content/externalMarkdownContent.ts:115` resolves local Markdown first, then falls back to Circle.
- `src/server/content/externalMarkdownContent.ts:65` maps localized prework languages to `lessons10xDevs3PreworkPl` and `lessons10xDevs3PreworkEn`.
- `/external/10xdevs-3-prework/pl` and `/external/10xdevs-3-prework/en` already work as language indexes through `src/pages/external/[courseId]/[lessonId].astro:28`.
- Localized prework lesson pages are served by `src/pages/external/[courseId]/[lang]/[lessonId].astro:41`, which uses `BaseLayout` plus `Lesson`, not `ExternalLessonLayout`.
- The shared shell is `src/layouts/ExternalLessonLayout.astro:185`, with `ContentTopBar`, `LessonSidebar`, prev/next links, TOC support, and sidebar collapse behavior.
- The shared shell currently hardcodes standard external lesson URLs in a few places: `src/layouts/ExternalLessonLayout.astro:45`, `src/components/sidebar/LessonSidebar.svelte:30`, and `src/components/ContentTopBar.svelte:452`.
- The standard external Markdown export route exists at `src/pages/external/[courseId]/[lessonId]/markdown.astro:1`, but it explicitly returns 404 for `10xdevs-3-prework` at line 14.

The focused baseline tests currently pass:

- `npm run test -- src/server/content/externalMarkdownContent.test.ts src/server/content/markdownLessonLoader.test.ts src/server/content/preworkLessonPairs.test.ts src/server/urlValidation.test.ts`
- 35 tests passed during planning.

## Desired End State

After implementation:

1. The existing Markdown resolver support from `875999e1` remains intact and is explicitly covered by tests.
2. `10xdevs-3` can resolve local `.md` and local `.html` lessons from `src/content/lessons10xDevs3/`.
3. If the same `10xdevs-3` lesson ID exists as both Markdown and HTML, the loader/build fails loudly.
4. If no local `10xdevs-3` lesson exists for an ID, the existing Circle fallback remains unchanged.
5. `/external/10xdevs-3-prework/pl/{lessonId}` and `/external/10xdevs-3-prework/en/{lessonId}` render through `ExternalLessonLayout`.
6. Localized prework lessons get the same sidebar, topbar, TOC behavior, and `Pobierz Markdown` affordance as the standard external shell.
7. Localized prework Markdown export routes exist and are protected:
   - `/external/10xdevs-3-prework/pl/{lessonId}/markdown`
   - `/external/10xdevs-3-prework/en/{lessonId}/markdown`
8. Existing behavior remains unchanged for:
   - `/external/10xdevs-2/{lessonId}`
   - `/external/10xdevs-2/{lessonId}/markdown`
   - Circle-backed fallback content for `10xdevs-3`
   - `/external/10xdevs-3-prework/pl`
   - `/external/10xdevs-3-prework/en`

### Key Discoveries

- The commit named by the co-founder, `06f5a0a3814e60dadff86d5c792f9b47ab77a2d2`, only changes `src/content/lessons10xDevs3Prework/todo.md`; the relevant implementation commit is `875999e1`.
- The renderer/resolver support introduced by `875999e1` is still present on HEAD; `git diff 875999e1..HEAD` for the relevant content/route files shows no renderer regression.
- The problem is not missing Markdown rendering. The problem is that localized prework lesson routes bypass the shared external shell.
- Existing non-prework HTML collection behavior derives `id` from the first two filename characters and `name` from `<meta name="lesson-id">` in `src/content.config.ts:23`.
- `ContentTopBar` already accepts a serializable `lessonUrlPrefix` for flat lesson links in `src/components/ContentTopBar.svelte:48`, which is the right pattern to extend for grouped external links.
- `LessonSidebar` already documents why URL prefix strings are preferred over functions across Svelte island boundaries in `src/components/sidebar/types.ts:31`.

## What We're NOT Doing

- Not rebuilding Markdown rendering support already introduced by `875999e1`.
- Not changing access semantics for `10xdevs-3` or `10xdevs-3-prework`.
- Not removing Circle fallback for `10xdevs-3`.
- Not changing 10xDevs 2 external routes, Circle lesson rendering, or checklist behavior.
- Not introducing slug URLs.
- Not creating a manifest for local HTML lesson metadata.
- Not adding Playwright or a new e2e test framework in this plan.
- Not redesigning the full external course index experience.
- Not making localized prework Markdown exports public.

## Implementation Approach

Treat the existing Markdown resolver as the baseline and add small, composable extensions around it:

1. Add a local mixed-content loader/resolver for `10xdevs-3` that can read Markdown and HTML entries with a common `LessonEntry` shape.
2. Preserve the current `getExternalCourseLessonContent(courseId, lessonId, env)` boundary so routes do not need to know whether content came from Markdown, HTML, or Circle.
3. Add route-prefix props to the external shell and its hydrated Svelte children so localized routes can use `/external/10xdevs-3-prework/pl/{id}` and `/external/10xdevs-3-prework/en/{id}` without hardcoded special cases.
4. Rewire localized prework lesson pages to use `ExternalLessonLayout` and the existing localized Markdown resolver.
5. Add authenticated localized prework Markdown export routes that convert rendered HTML back through `htmlToMarkdown()`, matching existing export behavior.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **State Capture Timing**: No persistent application state changes are introduced. Sidebar collapse and TOC hydration continue to use the existing shell behavior in `ExternalLessonLayout`.
- **Svelte Island Timing**: Route URL prefixes must be passed as plain strings because `ContentTopBar` and `LessonSidebar` are hydrated islands and cannot receive functions.
- **DOM Mutation Sequence**: Keep the current flow: server renders lesson HTML with heading IDs added by `extractHeadingsFromHtml()`, then `LayoutScripts` handles syntax highlighting/copy behavior after page load.
- **Race Conditions**: No new async client race is expected. Server-side content resolution remains request-time/Astro loader-time as today.

### User Experience Specification

- Localized prework lesson pages should visually match the standard external lesson shell:
  - left sidebar on desktop
  - mobile lesson panel
  - topbar prev/next controls
  - TOC controls when headings exist
  - `Pobierz Markdown` download action
- `/external/10xdevs-3-prework/pl` and `/external/10xdevs-3-prework/en` remain language indexes.
- `/external/10xdevs-3-prework` should expose both PL and EN language entry points/lists in a lightweight way.
- Unauthenticated localized lesson and export requests redirect to `/external/10xdevs-3-prework/login?returnUrl=<encoded localized path>`.
- Missing localized lessons return 404, not a Circle fallback.
- Missing local `10xdevs-3` lessons still fall back to Circle.

### Performance & Optimization Strategy

- Mixed local content loading happens through Astro content loaders, not runtime filesystem scans in request handlers.
- Duplicate detection across Markdown and HTML for `10xdevs-3` should run during loader/build time.
- Heading extraction already uses `cheerio` in `extractHeadingsFromHtml()` and should remain centralized in `externalMarkdownContent.ts` or a renamed generalized resolver.
- The route-prefix changes add only string props and no meaningful runtime overhead.

### State Management Sequencing

Standard `10xdevs-3` lesson request:

1. User opens `/external/10xdevs-3/{lessonId}`.
2. External auth is verified.
3. Module access check runs through `isAccessAllowed(Number(lessonId))`.
4. Content resolver checks local `10xdevs-3` Markdown/HTML.
5. If found, local content renders through `ExternalLessonLayout`.
6. If not found, Circle fallback renders through the same existing route.

Localized prework lesson request:

1. User opens `/external/10xdevs-3-prework/{pl|en}/{lessonId}`.
2. External auth is verified.
3. Localized prework Markdown entry resolves by `(language, lessonId)`.
4. Route builds localized lesson structure and localized URL prefix.
5. Page renders through `ExternalLessonLayout`.
6. Sidebar/topbar links use `/external/10xdevs-3-prework/{lang}/{id}`.

Localized prework export request:

1. User opens `/external/10xdevs-3-prework/{pl|en}/{lessonId}/markdown`.
2. External auth is verified.
3. Missing auth redirects to the same login flow with the export path as return URL.
4. Localized Markdown entry resolves.
5. Rendered HTML content is converted through `htmlToMarkdown()`.
6. Response returns `text/markdown; charset=utf-8` with safe `Content-Disposition`.

### Debug & Observability Plan

- **Verification Method**: Use focused Vitest coverage for loader/resolver/link helpers plus `npm run build`; then manually smoke-test external routes in a browser.
- **Logging Strategy**: Preserve current route-level `console.error('Failed to fetch lesson content:', error)` behavior for unexpected resolver failures.
- **Debug Instrumentation**: Use existing unit tests around `externalMarkdownContent`, `markdownLessonLoader`, `urlValidation`, and topbar/sidebar helpers. Add tests near the changed helpers.
- **Timing Debug**: For UI issues, verify server-rendered links first in page source, then hydrate behavior in the browser. The URL-prefix design keeps debugging straightforward because final URLs are plain strings.
- **Metrics**: No new metrics are required; this is a rendering/routing correctness change.

## Phase 1: Preserve Existing Markdown Resolver as Baseline

### Overview

Before adding HTML and shell changes, lock in the behavior introduced by `875999e1`: `10xdevs-3` resolves local Markdown before Circle, localized prework resolves by language, and 10xDevs 2 remains on the existing Circle path.

### Changes Required

#### 1. Strengthen resolver tests as regression guard

**File**: `src/server/content/externalMarkdownContent.test.ts`

**Changes**:

- Keep existing tests that prove:
  - `10xdevs-3` maps to `lessons10xDevs3`.
  - `10xdevs-3-prework` maps to PL/EN collections only when a language is provided.
  - `10xdevs-2` returns `null` for local Markdown collection lookup.
  - `10xdevs-3` local Markdown prevents Circle calls.
  - `10xdevs-2` still calls Circle.
- Add a short test name/comment that identifies this as preserving the `875999e1` baseline.

#### 2. Capture current route mismatch in tests or plan notes

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:

- No production change in this phase.
- Use this file as the explicit current-state reference: localized prework content renders through `BaseLayout` + `Lesson`, not `ExternalLessonLayout`.

### Success Criteria

#### Automated Verification

- [x] Focused baseline tests pass: `npm run test -- src/server/content/externalMarkdownContent.test.ts src/server/content/markdownLessonLoader.test.ts src/server/content/preworkLessonPairs.test.ts src/server/urlValidation.test.ts`
- [x] `git diff` confirms no unrelated route/layout changes in this phase.

#### Manual Verification

- [ ] Confirm the plan still frames Markdown rendering as existing support from `875999e1`, not new work.

**Implementation Note**: This phase is mostly a guardrail. It should be quick and should not change visible behavior.

---

## Phase 2: Add Mixed Local HTML Support for `10xdevs-3`

### Overview

Extend `10xdevs-3` local content support from Markdown-only to mixed Markdown and HTML, while keeping the existing local-first/Circle-fallback resolver boundary.

### Changes Required

#### 1. Extract or generalize local HTML entry parsing

**File**: `src/content.config.ts` or new `src/server/content/htmlLessonLoader.ts`

**Changes**:

- Keep legacy HTML parsing semantics:
  - `id` is the first two filename characters.
  - `name` comes from `<meta name="lesson-id" content="...">`.
  - `content` is the raw HTML string.
- Add enough testable helper surface to validate HTML parsing without relying only on `npm run build`.
- Do not introduce a manifest for HTML metadata.

Example helper shape:

```ts
export async function htmlLessonLoader(pattern: string): Promise<HtmlLessonEntry[]> {
  // same legacy parsing semantics as the current htmlLoader()
}
```

#### 2. Add a mixed local lesson loader for `10xdevs-3`

**File**: new `src/server/content/mixedLocalLessonLoader.ts` or `src/server/content/localLessonLoader.ts`

**Changes**:

- Load Markdown entries from `./src/content/lessons10xDevs3/*.md`.
- Load HTML entries from `./src/content/lessons10xDevs3/*.html`.
- Merge both into the existing collection entry shape.
- Fail loudly if a duplicate ID appears across Markdown and HTML.
- Sort by ID using numeric-aware locale comparison.

Example behavior:

```ts
const entries = await mixedLocalLessonLoader({
  markdownPattern: './src/content/lessons10xDevs3/*.md',
  htmlPattern: './src/content/lessons10xDevs3/*.html',
});
```

#### 3. Wire `lessons10xDevs3` to mixed local loader

**File**: `src/content.config.ts`

**Changes**:

- Change `lessons10xDevs3` from Markdown-only:

```ts
loader: () => markdownLessonLoader('./src/content/lessons10xDevs3/*.md')
```

- To the mixed local loader:

```ts
loader: () => mixedLocalLessonLoader({
  markdownPattern: './src/content/lessons10xDevs3/*.md',
  htmlPattern: './src/content/lessons10xDevs3/*.html',
})
```

#### 4. Update resolver source naming if needed

**File**: `src/server/content/externalMarkdownContent.ts`

**Changes**:

- The file currently handles local Markdown and Circle, but after this phase it will also handle local HTML.
- Either:
  - keep the file name for minimal churn and update internal naming/comments, or
  - rename to `externalLocalContent.ts` if the implementation can do so without excessive import churn.
- Preserve `getExternalCourseLessonContent()` as the route-facing API.
- Extend `ExternalLessonContent.source` from `'markdown' | 'circle'` to include `'html'` or a generalized `'local'`, whichever creates less churn.

Preferred choice: include `'html'` so tests can prove local HTML resolution without hiding source type.

### Success Criteria

#### Automated Verification

- [x] New mixed loader tests pass for Markdown-only, HTML-only, mixed unique IDs, duplicate IDs, and empty directory behavior.
- [x] Existing resolver tests pass: `npm run test -- src/server/content/externalMarkdownContent.test.ts`
- [x] Existing Markdown loader tests pass: `npm run test -- src/server/content/markdownLessonLoader.test.ts`
- [x] `npm run build`

#### Manual Verification

- [ ] Add or temporarily use a local `10xdevs-3` `.html` fixture in development and confirm `/external/10xdevs-3/{id}` renders it through the standard external shell.
- [ ] Remove the temporary fixture if it is not intended content.
- [ ] Confirm a missing local `10xdevs-3` ID still attempts Circle fallback.

**Implementation Note**: Keep this phase focused on content loading and resolver behavior. Do not rewire localized prework shell in the same patch if duplicate detection or source typing becomes noisy.

---

## Phase 3: Route-Aware External Shell Links

### Overview

Make the shared external shell capable of rendering both standard external lesson URLs and localized prework lesson URLs by passing serializable URL prefixes into hydrated components.

### Changes Required

#### 1. Add lesson URL prefix props to the external layout

**File**: `src/layouts/ExternalLessonLayout.astro`

**Changes**:

- Add optional props:

```ts
lessonUrlPrefix?: string;
courseHomeUrl?: string;
```

- Defaults:
  - `lessonUrlPrefix = /external/${courseId}`
  - `courseHomeUrl = /external/${courseId}/`
- Build prev/next links from `lessonUrlPrefix`, not from hardcoded `/external/${courseId}`.

Example:

```ts
const normalizedLessonUrlPrefix = lessonUrlPrefix ?? `/external/${courseId}`;
const prevLessonUrl = prevLessonId ? `${normalizedLessonUrlPrefix}/${prevLessonId}` : null;
const nextLessonUrl = nextLessonId ? `${normalizedLessonUrlPrefix}/${nextLessonId}` : null;
```

#### 2. Extend grouped sidebar props

**Files**:

- `src/components/sidebar/types.ts`
- `src/components/sidebar/LessonSidebar.svelte`

**Changes**:

- Add optional `lessonUrlPrefix` for grouped mode.
- Keep `courseId` for checklist URLs and backwards compatibility.
- Use `lessonUrlPrefix ?? /external/${courseId}` for lesson links.
- Do not pass functions across the Svelte island boundary.

#### 3. Extend grouped topbar links

**File**: `src/components/ContentTopBar.svelte`

**Changes**:

- Reuse existing `lessonUrlPrefix` for grouped lesson links as well as flat lesson links.
- Default grouped behavior remains `/external/${courseId}`.
- Keep `courseId` for checklist links and dialog IDs.
- Ensure mobile grouped lesson links use the prefix at `src/components/ContentTopBar.svelte:452`.

#### 4. Add helper tests if useful

**Files**:

- `src/lib/topBarHelpers.ts`
- `src/lib/topBarHelpers.test.ts`
- Existing component tests, if the current Svelte test setup makes this cheap.

**Changes**:

- Add a small URL-building helper if it reduces duplication:

```ts
export function buildLessonHref(lessonUrlPrefix: string, id: string | number): string {
  return `${lessonUrlPrefix}/${id}`;
}
```

- Test standard and localized prefixes.

### Success Criteria

#### Automated Verification

- [x] `npm run test -- src/lib/topBarHelpers.test.ts`
- [x] Existing topbar tests pass: `npm run test -- src/components/ContentTopBar.test.ts`
- [x] Type checking through `npm run build` passes.
- [x] Existing 10xDevs 2 routes still render standard `/external/10xdevs-2/{id}` links.

#### Manual Verification

- [ ] Open a standard external lesson and confirm prev/next/sidebar links still use `/external/10xdevs-2/{id}`.
- [ ] Open a localized prework lesson after Phase 4 and confirm links use `/external/10xdevs-3-prework/{lang}/{id}`.

**Implementation Note**: This phase should be behavior-preserving for existing routes because all new props have defaults.

---

## Phase 4: Move Localized Prework Lessons onto the Shared Shell

### Overview

Rewire localized prework lesson pages to use `ExternalLessonLayout` while preserving localized indexes on `/external/10xdevs-3-prework/pl` and `/external/10xdevs-3-prework/en`.

### Changes Required

#### 1. Reuse the existing localized Markdown resolver

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:

- Replace custom `BaseLayout` + header + `Lesson` rendering with `ExternalLessonLayout`.
- Use the existing prework helpers:
  - `getPreworkLesson(lang, lessonId)`
  - `getPreworkLessons(lang)`
  - `getPreworkLessonListItems(lessons)`
  - `getPreworkCourseSections(lang)`
- Extract headings from `lesson.data.content` through the same `extractHeadingsFromHtml()` + `buildCompleteToc()` path used by the resolver.
- Pass:
  - `lessonUrlPrefix={`/external/${courseId}/${lang}`}`
  - `courseHomeUrl={`/external/${courseId}/${lang}`}` or equivalent
  - `activeLessonId={Number(lessonId)}`
  - localized structure lessons/sections
  - localized prev/next IDs
  - `tocHeadings`
- Add `MarkdownDownloadButton` pointing to `/external/${courseId}/${lang}/${lessonId}/markdown`.

#### 2. Keep language indexes in the existing route

**File**: `src/pages/external/[courseId]/[lessonId].astro`

**Changes**:

- Preserve current language-index behavior for `lessonId === 'pl'` and `lessonId === 'en'`.
- Keep language index links pointing to `/external/${courseId}/${lessonId}/${preworkLesson.id}`.
- Do not move indexes into the lesson shell.

#### 3. Ensure localized route access behavior stays unchanged

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:

- Continue verifying external auth with `verifyExternalAuth(Astro.cookies, courseId, env)`.
- Continue redirecting unauthenticated users with `buildExternalCourseLoginUrl(courseId, Astro.url.pathname)`.
- Return 404 for unsupported language, unsupported course, or missing lesson.

### Success Criteria

#### Automated Verification

- [x] `npm run build`
- [x] Existing content tests pass: `npm run test -- src/server/content/preworkLessonPairs.test.ts src/server/urlValidation.test.ts`
- [x] If helper extraction is added, focused helper tests pass.

#### Manual Verification

- [ ] As an authenticated user, open `/external/10xdevs-3-prework/pl/02` and confirm the full external shell appears.
- [ ] As an authenticated user, open `/external/10xdevs-3-prework/en/02` and confirm the full external shell appears.
- [ ] Confirm sidebar links stay within the same language.
- [ ] Confirm topbar prev/next links stay within the same language.
- [ ] Confirm the TOC appears when lesson headings exist.
- [ ] Confirm `/external/10xdevs-3-prework/pl` still renders the PL index.
- [ ] Confirm `/external/10xdevs-3-prework/en` still renders the EN index.

**Implementation Note**: The localized route should not call Circle. Prework content remains local Markdown only.

---

## Phase 5: Authenticated Localized Markdown Export

### Overview

Add Markdown export routes for localized prework lessons and protect them with the same external auth flow as lesson pages.

### Changes Required

#### 1. Add localized export route

**File**: new `src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro`

**Changes**:

- Validate:
  - `courseId === '10xdevs-3-prework'`
  - `lang` is `pl` or `en`
  - `lessonId` exists
- Verify external auth.
- If unauthenticated, redirect to:

```ts
buildExternalCourseLoginUrl(courseId, Astro.url.pathname)
```

- Resolve lesson with `getPreworkLesson(lang, lessonId)`.
- Return 404 when lesson is missing.
- Convert rendered HTML through `htmlToMarkdown(lesson.data.content)`.
- Add frontmatter similar to the existing external export route:

```yaml
---
title: "[lesson title]"
course: "10xdevs-3-prework"
language: "pl"
source: "Przeprogramowani.pl"
exported: "YYYY-MM-DD"
format: "markdown"
---
```

- Use `buildAttachmentContentDisposition(filename)` for the response header.

#### 2. Keep standard external export unchanged

**File**: `src/pages/external/[courseId]/[lessonId]/markdown.astro`

**Changes**:

- Keep the current explicit 404 for `courseId === '10xdevs-3-prework'`, because localized prework exports use the new route shape.
- Keep 10xDevs 2 behavior unchanged.
- Keep `10xdevs-3` standard export behavior through `getExternalCourseLessonContent()`.

#### 3. Add export tests where practical

**Files**:

- New route helper test if logic is extracted.
- Existing `src/utils/htmlToMarkdown.test.ts` remains the conversion coverage.

**Changes**:

- Prefer extracting frontmatter/response construction into a small helper if route-level tests are awkward.
- Test:
  - language included in localized prework frontmatter
  - title sanitized through `sanitizeForYaml`
  - content converted by `htmlToMarkdown()`

### Success Criteria

#### Automated Verification

- [x] `npm run test -- src/utils/htmlToMarkdown.test.ts`
- [x] Any new export helper tests pass.
- [x] `npm run build`

#### Manual Verification

- [ ] Authenticated `/external/10xdevs-3-prework/pl/02/markdown` downloads Markdown.
- [ ] Authenticated `/external/10xdevs-3-prework/en/02/markdown` downloads Markdown.
- [ ] Unauthenticated export request redirects to `/external/10xdevs-3-prework/login?returnUrl=...`.
- [ ] `/external/10xdevs-3-prework/02/markdown` remains 404.
- [ ] Existing `/external/10xdevs-2/{lessonId}/markdown` still works.

**Implementation Note**: The export route should use the rendered HTML from the existing Markdown loader. Do not read raw Markdown files directly in the route.

---

## Phase 6: Indexes and Regression Verification

### Overview

Preserve existing language indexes, lightly improve the root prework index, and run the regression matrix that proves standard external courses were not disturbed.

### Changes Required

#### 1. Improve root prework index

**File**: `src/pages/external/[courseId]/index.astro`

**Changes**:

- Keep `/external/10xdevs-3-prework` protected by external auth.
- Instead of showing only PL lessons, expose both language entry points:
  - `/external/10xdevs-3-prework/pl`
  - `/external/10xdevs-3-prework/en`
- Keep this lightweight. Do not redesign the whole index shell.
- Preserve current behavior for all non-prework external course indexes.

#### 2. Add regression coverage for 10xDevs 2

**Files**:

- `src/server/content/externalMarkdownContent.test.ts`
- route helper tests if added

**Changes**:

- Ensure `10xdevs-2` still does not use local Markdown/HTML resolver.
- Ensure `10xdevs-2` still calls Circle through the existing dependency.
- Ensure standard external lesson URLs remain `/external/10xdevs-2/{id}`.

#### 3. Run full verification

**Commands**:

```bash
npm run test
npm run build
```

### Success Criteria

#### Automated Verification

- [x] `npm run test`
- [x] `npm run build`
- [x] Focused tests prove:
  - `10xdevs-3` local Markdown still resolves before Circle.
  - `10xdevs-3` local HTML resolves before Circle.
  - duplicate local IDs across `.md` and `.html` fail loudly.
  - missing local `10xdevs-3` content falls back to Circle.
  - localized prework resolves local Markdown by language.
  - 10xDevs 2 remains Circle-backed.
  - localized prework export route requires auth and emits Markdown.

#### Manual Verification

- [ ] Start local dev server with `npm run dev`.
- [ ] Open `/external/10xdevs-3-prework/pl` and confirm the PL index still works.
- [ ] Open `/external/10xdevs-3-prework/en` and confirm the EN index still works.
- [ ] Open `/external/10xdevs-3-prework/pl/02` and confirm full shell behavior.
- [ ] Open `/external/10xdevs-3-prework/en/02` and confirm full shell behavior.
- [ ] Confirm `Pobierz Markdown` works for PL and EN prework lessons.
- [ ] Open an existing 10xDevs 2 external lesson and confirm rendering, sidebar, topbar, TOC, and Markdown export still work.
- [ ] Open a configured local `10xdevs-3` Markdown or HTML lesson if available.
- [ ] Open a known Circle-backed `10xdevs-3` lesson and confirm fallback still works.

**Implementation Note**: This is the final safety net phase. If manual verification finds shell link problems, fix the prefix plumbing rather than adding one-off route exceptions.

---

## Testing Strategy

### Unit Tests

- `externalMarkdownContent` or renamed resolver:
  - preserves `875999e1` Markdown baseline
  - resolves `10xdevs-3` local Markdown before Circle
  - resolves `10xdevs-3` local HTML before Circle
  - falls back to Circle when local content is absent
  - resolves localized prework by language
  - keeps `10xdevs-2` on Circle path
- Mixed loader:
  - Markdown-only
  - HTML-only
  - mixed unique IDs
  - duplicate Markdown/HTML IDs fail loudly
  - empty directory returns empty entries
- URL/link helpers:
  - standard external prefix
  - localized prework prefix
  - optional grouped `lessonUrlPrefix` defaults
- Export helper, if extracted:
  - localized language frontmatter
  - sanitized title
  - Markdown response shape

### Integration Tests

There is no dedicated Astro route integration harness today. Treat `npm run build` plus focused helper tests and manual route smoke tests as the practical integration strategy.

### Manual Testing Steps

1. Run `npm run test`.
2. Run `npm run build`.
3. Start `npm run dev`.
4. Authenticate as a user with `10XDEVS_3` access.
5. Visit `/external/10xdevs-3-prework/pl`.
6. Visit `/external/10xdevs-3-prework/en`.
7. Visit `/external/10xdevs-3-prework/pl/02`.
8. Visit `/external/10xdevs-3-prework/en/02`.
9. Confirm sidebar/topbar links stay in the active language.
10. Confirm `Pobierz Markdown` downloads for PL and EN prework.
11. In a private browser session, open a localized prework export URL and confirm it redirects to login with a localized return URL.
12. Visit an existing `/external/10xdevs-2/{lessonId}` and its Markdown export.
13. Visit a local `10xdevs-3` lesson if content exists.
14. Visit a Circle-backed `10xdevs-3` lesson and confirm fallback.

## Performance Considerations

- Local mixed content resolution is build/dev loader work, not per-request filesystem scanning.
- Duplicate detection is linear over the small local lesson set.
- Heading extraction remains per rendered local lesson, as it already is for Markdown local content.
- No new network calls are introduced for localized prework content.
- Circle fallback behavior for `10xdevs-3` remains unchanged and only runs when no local content exists.

## Migration Notes

- Existing localized prework URLs remain canonical.
- No redirects are required.
- Existing `/external/10xdevs-3-prework/pl` and `/en` language indexes remain in place.
- Existing 10xDevs 2 and checklist routes must not be retargeted.
- If local `10xdevs-3` HTML files are added later, they must follow the legacy filename/meta convention:
  - first two filename characters are the lesson ID
  - `<meta name="lesson-id" content="...">` provides the title
- If a local lesson exists in both `.md` and `.html`, the build must fail until the duplicate is resolved.

## References

- Baseline implementation commit: `875999e1 feat(edu-platform): add bilingual prework markdown support`
- Non-rendering commit mentioned during planning: `06f5a0a3814e60dadff86d5c792f9b47ab77a2d2`
- Existing plan: `thoughts/shared/plans/2026-04-26-bilingual-10xdevs3-prework-circle-sync.md`
- Starting brief: `thoughts/shared/plans/2026-04-27-html-and-shared-external-rendering-shell-brief.md`
- Markdown resolver: `src/server/content/externalMarkdownContent.ts`
- Markdown loader: `src/server/content/markdownLessonLoader.ts`
- HTML loader pattern: `src/content.config.ts`
- Localized prework route: `src/pages/external/[courseId]/[lang]/[lessonId].astro`
- Standard external lesson route: `src/pages/external/[courseId]/[lessonId].astro`
- Standard external Markdown export: `src/pages/external/[courseId]/[lessonId]/markdown.astro`
- External shell: `src/layouts/ExternalLessonLayout.astro`
- Topbar: `src/components/ContentTopBar.svelte`
- Sidebar: `src/components/sidebar/LessonSidebar.svelte`
- Sidebar prop types: `src/components/sidebar/types.ts`
- URL validation: `src/server/urlValidation.ts`

<!-- PLAN COMPLETED: 2026-04-27 -->
