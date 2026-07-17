# External Prework Lesson Shell Localization Implementation Plan

## Overview

Localize the visible lesson shell for `src/pages/external/[courseId]/[lang]/[lessonId].astro` so `/pl` renders Polish shell text and `/en` renders English shell text. The change should cover the topbar, desktop/mobile sidebar, sidebar collapse toggle, Markdown download button, and document language for the localized prework lesson route while preserving Polish defaults for existing non-language external routes.

## Current State Analysis

The localized prework lesson route already validates `lang` as `pl | en` and uses it to load Polish or English lesson content. However, the surrounding shell is still mostly hard-coded in Polish across shared components.

The requested route currently hard-codes the Markdown button copy:

```astro
<MarkdownDownloadButton
  markdownUrl={`${prefix}/${lesson.id}/markdown`}
  slugifiedName={slugifiedName}
  buttonText="Pobierz Markdown"
  ariaLabel="Pobierz lekcję w formacie Markdown"
/>
```

`ExternalLessonLayout.astro` owns the shell composition and passes props into `ContentTopBar`, `LessonSidebar`, and `SidebarToggle`, but it does not currently accept locale or shell copy props. `ContentTopBar.svelte` already accepts a few label props (`downloadLabel`, `lessonPanelLabel`, `sectionPanelLabel`) but still contains visible Polish literals for previous/next labels, home title, table of contents labels, course-content link, and lesson counts. `LessonSidebar.svelte` and `SidebarToggle.svelte` contain their own Polish strings and do not accept labels.

Existing routes without a `[lang]` segment depend on Polish defaults and should not change.

## Desired End State

For `/external/10xdevs-3-prework/pl/[lessonId]`, visible shell text remains Polish. For `/external/10xdevs-3-prework/en/[lessonId]`, visible shell text becomes English using standard product wording:

- `Download Markdown`
- `Previous`
- `Next`
- `Lessons`
- `Sections`
- `Table of contents`
- `Home`
- `Show`, `Hide`, `Close` forms where labels are visible or currently rendered as titles/controls
- Basic singular/plural count labels such as `1 lesson`, `2 lessons`, and `2 in course`

The localized route also sets `<html lang="pl">` or `<html lang="en">` through the layout. Existing non-language external routes keep Polish defaults without needing caller changes.

### Key Discoveries:

- The route already has a reliable language source via `isPreworkLanguage(lang)` and `PreworkLanguage = 'pl' | 'en'` in `src/server/content/preworkContent.ts:8`.
- The localized route passes `lessonUrlPrefix` and `courseHomeUrl` based on `/external/${courseId}/${lang}`, so shell links already stay language-aware in `src/pages/external/[courseId]/[lang]/[lessonId].astro:41`.
- `ExternalLessonLayout.astro` is the right boundary for shell props because it composes `ContentTopBar`, `LessonSidebar`, and `SidebarToggle` in `src/layouts/ExternalLessonLayout.astro:200`.
- `ContentTopBar.svelte` has partial label-prop support but still hard-codes visible Polish strings in `src/components/ContentTopBar.svelte:240`, `src/components/ContentTopBar.svelte:257`, `src/components/ContentTopBar.svelte:286`, `src/components/ContentTopBar.svelte:428`, `src/components/ContentTopBar.svelte:529`, and `src/components/ContentTopBar.svelte:566`.
- `LessonSidebar.svelte` owns desktop sidebar counts and labels at `src/components/sidebar/LessonSidebar.svelte:46` and `src/components/sidebar/LessonSidebar.svelte:89`.
- `SidebarToggle.svelte` owns collapse/expand labels at `src/components/sidebar/SidebarToggle.svelte:50`.
- `ExternalLogin.svelte` already demonstrates a `pl | en` copy-map pattern for external auth UI, so a small typed copy helper fits local conventions.

## What We're NOT Doing

- Not building a full i18n framework.
- Not localizing lesson content, section names, or lesson titles; those already come from the selected content collection.
- Not changing existing `/external/[courseId]/[lessonId]` Polish behavior.
- Not localizing hidden accessibility-only labels beyond what is required to support currently visible shell controls; user selected visible labels only. The document `lang` is included as an explicit selected exception.
- Not adding Playwright/e2e coverage because auth and route fixture setup would be heavier than this change needs.
- Not changing Markdown export content generation; only the download button shell text changes.

## Implementation Approach

Add a small typed copy helper, likely `src/lib/externalLessonShellCopy.ts`, that exports:

- `ExternalLessonShellLanguage = 'pl' | 'en'`
- `ExternalLessonShellCopy`
- `getExternalLessonShellCopy(language: ExternalLessonShellLanguage): ExternalLessonShellCopy`
- Basic count-formatting functions for lesson counts used by topbar/sidebar

Then extend the existing prop chain:

`[courseId]/[lang]/[lessonId].astro` -> `ExternalLessonLayout.astro` -> `ContentTopBar.svelte`, `LessonSidebar.svelte`, `SidebarToggle.svelte`

The layout should default to Polish copy and `htmlLang = 'pl'` or preserve current behavior where needed. For this requested localized route, pass the selected language and shell copy explicitly so `/pl` and `/en` render correctly.

## Critical Implementation Details

### Timing & Lifecycle Considerations

No async lifecycle changes are needed. The shell copy is static data selected on the server before Astro renders the Svelte islands. The Svelte components receive JSON-serializable string/function-free props, matching the existing island prop constraint documented in `src/components/sidebar/types.ts`.

### User Experience Specification

- `/external/10xdevs-3-prework/pl/[lessonId]` keeps Polish visible shell labels.
- `/external/10xdevs-3-prework/en/[lessonId]` shows English visible shell labels.
- Existing non-language external pages remain Polish by default.
- The topbar continues to show icon-only previous/next labels on mobile where it does today; desktop text changes by locale.
- Count formatting is intentionally basic: English uses singular/plural; Polish keeps current simple wording style.
- The document element uses the localized route language: `<html lang="pl">` or `<html lang="en">`.

### Performance & Optimization Strategy

The copy helper is static and tiny. No memoization, caching, or runtime fetches are needed. Count functions should be pure and cheap.

### State Management Sequencing

No state-management changes are needed. Existing Svelte state for topbar panels, TOC hydration, and sidebar collapse remains unchanged. Only static labels passed into existing markup change.

### Debug & Observability Plan

- **Verification Method**: Inspect rendered labels via Vitest component tests and run build/type checks.
- **Logging Strategy**: No logging required; this is deterministic UI copy selection.
- **Debug Instrumentation**: If labels do not appear, inspect serialized island props in the rendered HTML and component defaults in tests.
- **Timing Debug**: Not applicable; copy does not depend on hydration timing.
- **Metrics**: Not applicable.

## Phase 1: Define Shell Copy Contract

### Overview

Create a typed source of truth for localized external lesson shell copy while preserving Polish as the default.

### Changes Required:

#### 1. Shell Copy Helper

**File**: `src/lib/externalLessonShellCopy.ts`

**Changes**:
- Add language and copy types.
- Add Polish and English copy objects.
- Add basic count-formatting helpers.
- Export `getExternalLessonShellCopy(lang)` with Polish fallback/default.

```ts
export type ExternalLessonShellLanguage = 'pl' | 'en';

export interface ExternalLessonShellCopy {
  htmlLang: ExternalLessonShellLanguage;
  downloadMarkdown: string;
  previous: string;
  next: string;
  lessons: string;
  sections: string;
  tableOfContents: string;
  courseContents: string;
  home: string;
  show: string;
  hide: string;
  close: string;
  collapseMenu: string;
  expandMenu: string;
  markdownTitle: string;
  lessonCount: (count: number) => string;
  inCourseCount: (count: number) => string;
}
```

Implementation detail: keep functions out of props passed directly to Svelte islands if Astro serialization rejects them. If needed, compute the concrete count strings at component level using simple `copy.lessonSingular` / `copy.lessonPlural` strings instead of functions. The final implementation should preserve JSON-serializable island props.

#### 2. Export JSON-Serializable Component Copy Types

**File**: `src/lib/externalLessonShellCopy.ts`

**Changes**:
- If functions would cross the Astro island boundary, split the copy model:
  - helper-level functions for Astro/server use
  - plain string labels for Svelte props
- Prefer a serializable shape for component props:

```ts
interface ExternalLessonShellLabels {
  downloadMarkdown: string;
  previous: string;
  next: string;
  lessons: string;
  sections: string;
  tableOfContents: string;
  courseContents: string;
  home: string;
  show: string;
  hide: string;
  close: string;
  collapseMenu: string;
  expandMenu: string;
  markdownTitle: string;
  inCourseSuffix: string;
  lessonSingular: string;
  lessonPlural: string;
}
```

### Success Criteria:

#### Automated Verification:

- [x] Helper compiles with TypeScript during `npm run build`.
- [x] Helper exports Polish and English labels with Polish as the fallback/default.
- [x] No non-serializable functions are passed as Svelte island props.

#### Manual Verification:

- [x] Copy table matches the selected decisions: standard English labels and current Polish defaults.
- [x] No unrelated external-course copy is changed.

**Implementation Note**: After completing this phase and automated verification passes, pause for manual confirmation that the copy strings are acceptable before proceeding to the next phase.

---

## Phase 2: Wire Copy Through Layout And Components

### Overview

Pass localized visible labels from the prework lesson route into the shared lesson layout and shell components.

### Changes Required:

#### 1. Localized Route

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:
- Import `getExternalLessonShellCopy`.
- Resolve `const shellCopy = getExternalLessonShellCopy(lang);`.
- Pass `htmlLang={lang}` and `shellCopy={shellCopy}` or similarly named props into `ExternalLessonLayout`.
- Use `shellCopy.downloadMarkdown` for `MarkdownDownloadButton.buttonText`.
- Use localized Markdown title/visible title if `MarkdownDownloadButton` accepts it after this phase.

```astro
const shellCopy = getExternalLessonShellCopy(lang);
```

#### 2. External Lesson Layout Props

**File**: `src/layouts/ExternalLessonLayout.astro`

**Changes**:
- Add optional `htmlLang?: 'pl' | 'en'` prop.
- Add optional `shellCopy?: ExternalLessonShellLabels` prop.
- Default `htmlLang` and `shellCopy` to Polish/default helper output for backwards compatibility.
- Set `<html lang={htmlLang}>`.
- Pass labels into `ContentTopBar`, `LessonSidebar`, and `SidebarToggle`.

```astro
<html lang={htmlLang} class="sidebar-not-hydrated">
```

#### 3. Content Top Bar

**File**: `src/components/ContentTopBar.svelte`

**Changes**:
- Extend props with a serializable labels object or individual labels.
- Keep existing prop defaults Polish.
- Replace visible hard-coded labels:
  - `← Poprzednia` -> localized previous
  - `Następna →` -> localized next
  - home title
  - mobile/grouped course contents link
  - `Spis treści` headings
  - visible lesson count text
- Keep mobile arrow-only previous/next controls unchanged where they are icon-only.

#### 4. Lesson Sidebar

**File**: `src/components/sidebar/types.ts`

**Changes**:
- Add optional labels prop to both flat and grouped sidebar props, or to a shared base type.

**File**: `src/components/sidebar/LessonSidebar.svelte`

**Changes**:
- Use labels for `Lekcje`, `w kursie`, `lekcji`, and optional checklist visible labels if they are part of the current shell surface.
- Preserve Polish defaults when no labels are passed.

#### 5. Sidebar Toggle

**File**: `src/components/sidebar/SidebarToggle.svelte`

**Changes**:
- Add optional labels prop for collapsed/expanded visible label source.
- Preserve current Polish aria labels by default.
- Use English labels when passed from the localized route through `ExternalLessonLayout`.

#### 6. Markdown Download Button

**File**: `src/components/shared/MarkdownDownloadButton.astro`

**Changes**:
- Add an optional `title` or `titleText` prop.
- Default to the current Polish title for backwards compatibility.
- Use the localized title from route/layout for the prework localized route.

### Success Criteria:

#### Automated Verification:

- [x] `npm run build` passes.
- [x] Existing `ContentTopBar` tests continue passing after prop/default updates.
- [x] Existing `SidebarToggle` tests continue passing with Polish defaults.
- [x] No caller of `ExternalLessonLayout` is forced to pass new props.

#### Manual Verification:

- [x] `/external/10xdevs-3-prework/pl/[lessonId]` shows Polish shell labels.
- [x] `/external/10xdevs-3-prework/en/[lessonId]` shows English shell labels.
- [x] Existing `/external/[courseId]/[lessonId]` still shows Polish shell labels.
- [x] Desktop and mobile topbar/sidebar views remain visually stable.

**Implementation Note**: After completing this phase and automated verification passes, pause for manual confirmation that `/pl` and `/en` look correct in the UI before proceeding to the next phase.

---

## Phase 3: Verify With Focused Tests

### Overview

Add and update Vitest coverage for the localized labels and default Polish behavior.

### Changes Required:

#### 1. ContentTopBar Tests

**File**: `src/components/ContentTopBar.test.ts`

**Changes**:
- Add an English-label test for visible desktop previous/next labels, lesson/section button labels, table-of-contents heading, and course contents link where practical.
- Keep existing Polish assertions for defaults or update them to use explicit Polish labels where necessary.

#### 2. SidebarToggle Tests

**File**: `src/components/sidebar/SidebarToggle.test.ts`

**Changes**:
- Add a test that passing English labels renders `Collapse menu` and toggles to `Expand menu`.
- Keep existing Polish default tests unchanged.

#### 3. LessonSidebar Tests

**File**: `src/components/sidebar/LessonSidebar.test.ts`

**Changes**:
- Add a focused test file if one does not exist.
- Verify grouped mode can render English count labels such as `2 lessons`.
- Verify default Polish labels remain unchanged.

#### 4. Optional Helper Tests

**File**: `src/lib/externalLessonShellCopy.test.ts`

**Changes**:
- Add small tests if the helper contains count logic beyond static objects.
- Verify English singular/plural and Polish fallback/default behavior.

### Success Criteria:

#### Automated Verification:

- [x] `npm run test -- ContentTopBar SidebarToggle LessonSidebar externalLessonShellCopy` or equivalent targeted Vitest command passes.
- [x] `npm run test` passes.
- [x] `npm run build` passes.

#### Manual Verification:

- [x] The tested labels match the agreed copy exactly.
- [x] No test relies on brittle implementation details such as internal Svelte state names.

**Implementation Note**: After completing this phase and all automated verification passes, pause for final manual confirmation.

---

## Testing Strategy

### Unit Tests:

- `ContentTopBar.svelte` renders English visible labels when labels are passed.
- `ContentTopBar.svelte` preserves Polish defaults when labels are not passed.
- `SidebarToggle.svelte` preserves Polish defaults and supports English labels.
- `LessonSidebar.svelte` supports English visible labels/counts and preserves Polish defaults.
- `externalLessonShellCopy.ts` returns the expected copy for `pl` and `en` if helper logic is non-trivial.

### Integration / Build Checks:

- `npm run build` verifies Astro route/layout prop typing and Svelte island serialization.
- `npm run test` verifies component behavior.

### Manual Testing Steps:

1. Start the dev server with `npm run dev`.
2. Visit an authenticated `/external/10xdevs-3-prework/pl/[lessonId]` page.
3. Confirm topbar, sidebar, Markdown button, counts, and TOC labels are Polish.
4. Confirm page source or devtools shows `<html lang="pl">`.
5. Visit the corresponding `/external/10xdevs-3-prework/en/[lessonId]` page.
6. Confirm topbar, sidebar, Markdown button, counts, and TOC labels are English.
7. Confirm page source or devtools shows `<html lang="en">`.
8. Visit an existing non-language external lesson page and confirm Polish shell labels remain unchanged.
9. Check desktop and mobile widths to verify labels do not cause topbar/sidebar overlap.

## Performance Considerations

No meaningful performance impact is expected. The helper is static, labels are tiny, and no new network calls or client-side computations are introduced.

## Migration Notes

No database, content, or route migration is needed. New layout/component props must be optional to avoid breaking existing callers. Polish remains the default for shared external shell components.

## References

- Localized route: `src/pages/external/[courseId]/[lang]/[lessonId].astro:19`
- Markdown button hard-coded copy: `src/pages/external/[courseId]/[lang]/[lessonId].astro:71`
- Layout shell boundary: `src/layouts/ExternalLessonLayout.astro:200`
- Existing hard-coded topbar defaults/literals: `src/components/ContentTopBar.svelte:75`, `src/components/ContentTopBar.svelte:240`, `src/components/ContentTopBar.svelte:257`, `src/components/ContentTopBar.svelte:286`, `src/components/ContentTopBar.svelte:428`, `src/components/ContentTopBar.svelte:529`, `src/components/ContentTopBar.svelte:566`
- Sidebar hard-coded labels/counts: `src/components/sidebar/LessonSidebar.svelte:46`, `src/components/sidebar/LessonSidebar.svelte:89`
- Sidebar toggle hard-coded labels: `src/components/sidebar/SidebarToggle.svelte:50`
- Existing localized login pattern: `src/components/ExternalLogin.svelte:17`
- Existing component tests: `src/components/ContentTopBar.test.ts`, `src/components/sidebar/SidebarToggle.test.ts`

<!-- PLAN COMPLETED: 2026-04-27 -->
