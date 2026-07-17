# Light Theme Implementation Plan

## Overview

Add a user-selectable light theme for the lesson reading shell while keeping dark as the default. The first implementation covers regular course lessons and external course lessons only, using a semantic theme layer so the shell can support both dark and light without scattering one-off Tailwind color replacements across every component.

## Current State Analysis

The platform has no theme abstraction today. The lesson shell is built from a small set of Astro/Svelte components, but those components hard-code dark Tailwind classes and dark syntax highlighting:

- Regular lessons render through `Course.astro`, which composes `CourseLayout`, `ContentTopBar`, `LessonSidebar`, `SidebarToggle`, and `Lesson` (`src/components/Course.astro:52`, `src/components/Course.astro:59`, `src/components/Course.astro:75`, `src/components/Course.astro:94`, `src/components/Course.astro:120`).
- `CourseLayout` loads the dark highlight stylesheet and sets the body to `bg-gray-900` (`src/layouts/CourseLayout.astro:27`, `src/layouts/CourseLayout.astro:45`).
- External lessons use `ExternalLessonLayout`, which duplicates critical dark CSS, loads the same dark highlight stylesheet, and wraps sidebar/content areas in dark surfaces (`src/layouts/ExternalLessonLayout.astro:138`, `src/layouts/ExternalLessonLayout.astro:198`, `src/layouts/ExternalLessonLayout.astro:210`, `src/layouts/ExternalLessonLayout.astro:228`, `src/layouts/ExternalLessonLayout.astro:260`, `src/layouts/ExternalLessonLayout.astro:285`).
- Lesson prose uses `prose prose-invert` on regular and external lesson routes (`src/components/Lesson.astro:10`, `src/components/Lesson.astro:11`, `src/pages/external/[courseId]/[lessonId].astro:331`, `src/pages/external/[courseId]/[lessonId].astro:332`, `src/pages/external/[courseId]/[lang]/[lessonId].astro:127`, `src/pages/external/[courseId]/[lang]/[lessonId].astro:128`).
- `ContentTopBar`, `LessonSidebar`, `SidebarLessonRow`, `TOCTree`, `SidebarToggle`, `LessonProgressToggle`, and `MarkdownDownloadButton` all use hard-coded dark classes for backgrounds, borders, hover states, active rows, and button contrast (`src/components/ContentTopBar.svelte:225`, `src/components/ContentTopBar.svelte:275`, `src/components/ContentTopBar.svelte:326`, `src/components/ContentTopBar.svelte:590`, `src/components/sidebar/LessonSidebar.svelte:46`, `src/components/sidebar/SidebarLessonRow.svelte:15`, `src/components/navigation/TOCTree.svelte:33`, `src/components/sidebar/SidebarToggle.svelte:57`, `src/components/progress/LessonProgressToggle.svelte:112`, `src/components/shared/MarkdownDownloadButton.astro:38`).
- Per-device client storage is already an accepted pattern for shell preferences: sidebar collapse state uses `localStorage` and a shared storage key (`src/components/sidebar/SidebarToggle.svelte:18`, `src/components/sidebar/SidebarToggle.svelte:43`, `src/lib/topBarHelpers.ts:33`), and TOC state follows the same pattern (`src/lib/tocManager.svelte.ts:284`, `src/lib/tocManager.svelte.ts:302`).
- Only white logo assets exist today: `logo-white.png` and `logo-white-mobile.png`; all current shell imports point at those files (`src/layouts/ExternalLessonLayout.astro:23`, `src/layouts/ExternalLessonLayout.astro:24`, `src/components/Course.astro:9`, `src/components/Course.astro:10`).

## Desired End State

Regular and external lesson readers open in dark mode by default. A theme toggle in the lesson top bar lets the user switch to light mode; the selection is stored client-side per device and applied before the next page paint. The reading shell, sidebar, top bar, TOC widgets, navigation controls, progress controls, markdown download button, lesson prose, and code blocks all switch coherently between dark and light.

The implementation introduces semantic theme classes and CSS variables first, then migrates only the lesson-shell components to those classes. Non-lesson routes, auth pages, course listing, checklists, ebook, Space Explorers, Mission Log, shared lessons, and marketing-like pages stay outside this change unless they are required by a regular/external lesson route.

### Key Discoveries:

- The same `ContentTopBar` and sidebar components are shared by regular lessons and external lessons, so one toggle location can serve both route families (`src/components/Course.astro:59`, `src/layouts/ExternalLessonLayout.astro:236`).
- FOUC prevention already happens in both lesson layouts through inline scripts for sidebar state; the theme should use the same pre-paint approach (`src/layouts/CourseLayout.astro:30`, `src/layouts/ExternalLessonLayout.astro:213`).
- Lesson prose and syntax highlighting are the main content-specific risk because they are controlled by Typography plugin classes plus a self-hosted dark Highlight.js stylesheet (`src/components/Lesson.astro:11`, `src/layouts/CourseLayout.astro:27`, `src/layouts/ExternalLessonLayout.astro:210`).
- Placeholder dark-logo assets need stable names before implementation because the user will recreate their contents under the same filenames.

## What We're NOT Doing

- Not changing the default theme from dark. Dark remains the initial state when no stored preference exists.
- Not adding system `prefers-color-scheme` behavior.
- Not theming login, signup, course list, profile, shared lessons, checklist index/detail pages, ebook, Space Explorers, Mission Log, badges, or error pages.
- Not replacing the whole Tailwind palette or introducing a new design system dependency.
- Not rewriting generated lesson HTML content. The shell should theme the prose container and standard HTML descendants, not mutate lesson source.
- Not adding server-side user profile storage for theme preference. The preference is per device via `localStorage`.
- Not requiring final dark-logo artwork in this change. The implementation creates empty/stable asset placeholders only.

## Implementation Approach

Implement in four phases:

1. Add the theme foundation: constants, pre-paint application, semantic CSS variables/classes, light code-block styling, and stable logo placeholders.
2. Add the top-bar theme toggle and wire it through regular and external lesson layouts with per-device storage.
3. Migrate the lesson-shell UI components from hard-coded dark classes to semantic theme classes.
4. Verify the regular and external lesson routes in both themes, including reload behavior, mobile panels, TOC widgets, syntax highlighting, logos, and progress controls.

## Critical Implementation Details

### Timing & lifecycle

The stored theme must be applied before the shell paints. Both `CourseLayout` and `ExternalLessonLayout` should run a tiny inline script in `<head>` that reads the storage key, validates `light` or `dark`, defaults to `dark`, and sets a document-level attribute such as `data-lesson-theme`. The hydrated toggle should then read the same key and keep the document attribute synchronized.

### User experience spec

The toggle belongs in `ContentTopBar` as an icon button near the existing navigation/TOC controls. It must not depend on the sidebar being visible, and it must stay usable on mobile where lesson and section panels are top-bar driven.

### Logo placeholders

Create `src/assets/images/generic/logo-dark.png` and `src/assets/images/generic/logo-dark-mobile.png` as stable placeholders. The plan assumes the user will replace their contents under the same filenames before final visual acceptance.

## Phase 1: Theme Foundation

### Overview

Add the shared theme contract that every later component uses: storage key, allowed values, pre-paint application, semantic CSS variables/classes, light prose/code styling, and placeholder assets.

### Changes Required:

#### 1. Theme helper

**File**: `src/lib/lessonTheme.ts` (new)

**Intent**: Centralize the client-side storage key, allowed values, and document-attribute contract so the layouts and Svelte toggle do not duplicate theme parsing logic.

**Contract**: Export `LESSON_THEME_STORAGE_KEY`, `LESSON_THEME_ATTRIBUTE`, `type LessonTheme = 'dark' | 'light'`, `parseLessonTheme(value: string | null): LessonTheme | null`, and `getDefaultLessonTheme(): LessonTheme` returning `dark`. Any browser-only helper must guard access to `window` and `localStorage`.

#### 2. Semantic theme CSS

**File**: `src/styles/lesson-theme.css` (new)

**Intent**: Define lesson-shell CSS variables and semantic classes used by the migrated components.

**Contract**: Define dark variables for the default theme and light overrides under `[data-lesson-theme='light']`. Include classes for shell/root surfaces, panels, topbar, sidebar, sidebar rows, overlays, buttons, icon buttons, dividers, prose container, prose text/headings/links, progress control, markdown download button, and scrollbar colors. The class names should be semantic and stable, for example `lesson-shell`, `lesson-surface`, `lesson-panel`, `lesson-topbar`, `lesson-sidebar`, `lesson-nav-row`, `lesson-button-primary`, `lesson-button-secondary`, `lesson-icon-button`, `lesson-prose`, `lesson-divider`, and `lesson-muted`.

#### 3. Light code block styling

**File**: `src/styles/lesson-theme.css`

**Intent**: Make code blocks readable in light mode instead of leaving them visually dark or low contrast.

**Contract**: Provide light-mode overrides for `.lesson-prose pre`, `.lesson-prose code`, and Highlight.js token classes under `[data-lesson-theme='light']`. Keep the existing `highlight-github-dark.min.css` import in place for dark mode unless replacing it with a dual-theme stylesheet is simpler. The visible contract is that code blocks have a light surface, readable token contrast, and clear border in light mode.

#### 4. Import the theme stylesheet in lesson layouts

**Files**: `src/layouts/CourseLayout.astro`, `src/layouts/ExternalLessonLayout.astro`

**Intent**: Ensure semantic classes and CSS variables are available on both regular and external lesson routes.

**Contract**: Import `@/styles/lesson-theme.css` alongside `@/styles/sidebar.css`. Do not import it globally through `BaseLayout`; this change is lesson-shell scoped.

#### 5. Placeholder logo assets

**Files**:

- `src/assets/images/generic/logo-dark.png` (new)
- `src/assets/images/generic/logo-dark-mobile.png` (new)

**Intent**: Reserve stable filenames for light-theme logo variants. The user will recreate the image contents under these names.

**Contract**: Add placeholder files that the Astro asset pipeline can import. They can be intentionally minimal temporary PNGs, but they must be valid image files so `npm run build` does not fail.

### Success Criteria:

#### Automated Verification:

- Theme helper unit tests pass if added: `npx vitest run src/lib/lessonTheme.test.ts`
- Existing component tests still pass after stylesheet imports: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/SidebarToggle.test.ts`
- Type checking passes: `npm run check`

#### Manual Verification:

- Loading a regular lesson with no stored preference still shows the current dark appearance.
- In browser devtools, manually setting `document.documentElement.dataset.lessonTheme = 'light'` visibly changes the shell/prose/code colors on a regular lesson.
- The new dark-logo placeholder files import successfully in a local build.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets; the corresponding checkboxes live in `## Progress`.

---

## Phase 2: Top-Bar Toggle and Persistence

### Overview

Add the actual theme switcher to the shared top bar and wire pre-paint persistence into both lesson layouts. The UI is available on regular lessons and external lessons, defaults to dark, and stores light/dark per device.

### Changes Required:

#### 1. Theme toggle component

**File**: `src/components/LessonThemeToggle.svelte` (new)

**Intent**: Render an accessible icon button that switches between dark and light lesson themes and persists the choice.

**Contract**: On mount, read `LESSON_THEME_STORAGE_KEY`, default to `dark`, apply the document attribute, and render the next action as the accessible label. On click, toggle `dark <-> light`, store the value in `localStorage`, and update `document.documentElement.dataset.lessonTheme`. Use a stable class from `lesson-theme.css` for visual styling. Storage failures should not block the visual toggle for the current page.

#### 2. Wire toggle into `ContentTopBar`

**File**: `src/components/ContentTopBar.svelte`

**Intent**: Add the theme toggle to the shared top bar so regular and external lesson shells get the same control.

**Contract**: Import `LessonThemeToggle`. Add a prop such as `showThemeToggle?: boolean` defaulting to `false`. Render the toggle in the right-side control cluster before the TOC buttons or after the navigation buttons, using a fixed-size control so the topbar does not shift. Existing non-lesson uses of `ContentTopBar`, such as the ebook page, should not get the toggle unless they opt in.

#### 3. Opt in regular lesson shell

**File**: `src/components/Course.astro`

**Intent**: Enable the theme toggle for regular course lessons.

**Contract**: Pass `showThemeToggle={true}` to `ContentTopBar`. No route/auth/content behavior changes.

#### 4. Opt in external lesson shell

**File**: `src/layouts/ExternalLessonLayout.astro`

**Intent**: Enable the theme toggle for external course lessons.

**Contract**: Pass `showThemeToggle={true}` to `ContentTopBar`. The toggle should inherit shell copy only if labels are added later; no i18n copy file changes are required if the icon button uses a neutral `aria-label` string in English/Polish-free wording or receives labels through existing shell copy.

#### 5. Pre-paint theme script

**Files**: `src/layouts/CourseLayout.astro`, `src/layouts/ExternalLessonLayout.astro`

**Intent**: Avoid a dark/light flash when a user has stored `light`.

**Contract**: Add an inline `<script is:inline>` in `<head>` before the body renders. It reads the theme storage key, validates `light`/`dark`, defaults invalid/missing values to `dark`, and sets `document.documentElement.dataset.lessonTheme`. It should catch storage exceptions and still set `dark`.

### Success Criteria:

#### Automated Verification:

- Toggle component tests pass: `npx vitest run src/components/LessonThemeToggle.test.ts`
- Content topbar tests pass: `npx vitest run src/components/ContentTopBar.test.ts`
- Type checking passes: `npm run check`

#### Manual Verification:

- On a regular lesson, clicking the theme toggle switches dark to light and back without reloading.
- On an external lesson, clicking the same toggle switches dark to light and back.
- After choosing light, reloading the page keeps light mode with no visible dark flash.
- After clearing `localStorage`, the same lesson opens in dark mode.
- The toggle remains visible and usable on mobile widths.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Migrate Lesson-Shell Components to Semantic Classes

### Overview

Replace hard-coded dark Tailwind color classes in the reading shell with semantic classes from `lesson-theme.css`. Keep layout, spacing, accessibility, and existing behavior unchanged.

### Changes Required:

#### 1. Layout and prose containers

**Files**:

- `src/layouts/CourseLayout.astro`
- `src/layouts/ExternalLessonLayout.astro`
- `src/components/Course.astro`
- `src/components/Lesson.astro`
- `src/pages/external/[courseId]/[lessonId].astro`
- `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Intent**: Put the high-level surfaces under semantic classes and remove reliance on `bg-gray-900` / `prose-invert` as the theme mechanism.

**Contract**: Body/root wrappers use `lesson-shell`. Lesson content wrappers use `lesson-surface` and `lesson-prose`. If `prose-invert` remains for dark compatibility, light mode must override it cleanly through the theme stylesheet. Keep existing content widths, padding, rounded corners, and `set:html` behavior unchanged.

#### 2. Top bar and mobile panels

**File**: `src/components/ContentTopBar.svelte`

**Intent**: Migrate the top bar, nav buttons, TOC buttons, mobile overlays, slide-in panels, sticky panel headers, active rows, and desktop TOC widget to semantic classes.

**Contract**: Preserve all existing props, aria labels, `aria-expanded` behavior, panel open/close behavior, and TOC sync behavior. Use semantic classes for visual state instead of hard-coded dark `bg-gray-*`, `text-gray-*`, `border-gray-*`, and `hover:bg-gray-*` classes. Active lesson/TOC states may keep accent-specific classes if they remain readable in both themes, but their surfaces and text contrast should come from theme tokens.

#### 3. Sidebar and sidebar rows

**Files**:

- `src/components/sidebar/LessonSidebar.svelte`
- `src/components/sidebar/SidebarLessonRow.svelte`
- `src/components/sidebar/SidebarToggle.svelte`
- `src/components/sidebar/LessonNavigationLabel.svelte`

**Intent**: Make the sidebar, section headers, lesson rows, checklist rows, collapsed toggle, and recommendation tooltip readable in both themes.

**Contract**: Preserve `details` open behavior, active-row logic, progress toggle composition, sidebar collapsed body class, and localStorage migration. Replace dark color classes with semantic classes. Keep `.sidebar-container` sizing in `src/styles/sidebar.css`; do not move sidebar layout mechanics into theme CSS.

#### 4. TOC tree

**File**: `src/components/navigation/TOCTree.svelte`

**Intent**: Make nested TOC text, guides, active item, hover states, and expand/collapse buttons theme-aware.

**Contract**: Keep tree indentation and active ID behavior unchanged. Replace level text classes and border/hover classes with semantic classes or CSS-variable-backed classes. Preserve `data-toc-active`.

#### 5. Progress and download controls

**Files**:

- `src/components/progress/LessonProgressToggle.svelte`
- `src/components/shared/MarkdownDownloadButton.astro`

**Intent**: Keep utility controls readable in both dark and light modes.

**Contract**: Use semantic button classes for content/sidebar progress variants and markdown download button. Preserve labels, optimistic update behavior, `aria-pressed`, `download`, `target`, and error display behavior.

#### 6. Logo variant wiring

**Files**:

- `src/components/Course.astro`
- `src/layouts/ExternalLessonLayout.astro`
- `src/components/ContentTopBar.svelte`

**Intent**: Use white logos in dark mode and dark-logo placeholders in light mode.

**Contract**: Pass both light-background and dark-background logo URLs into `ContentTopBar`, or pass a structured logo object if cleaner. `ContentTopBar` should render the correct asset based on the current theme without layout shift. Until the user replaces placeholders, the implementation only guarantees the import/path contract.

### Success Criteria:

#### Automated Verification:

- Component tests pass: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/LessonSidebar.test.ts src/components/sidebar/SidebarToggle.test.ts src/components/navigation/TOCTree.test.ts src/components/progress/LessonProgressToggle.test.ts`
- Type checking passes: `npm run check`
- Production build passes: `npm run build`

#### Manual Verification:

- Regular lesson shell is visually coherent in dark and light modes.
- External lesson shell is visually coherent in dark and light modes.
- Mobile lesson panel, mobile section panel, desktop TOC widget, and collapsed sidebar toggle remain readable in light mode.
- Active lesson row, active TOC item, checklist row, progress button, markdown download button, and code blocks have sufficient contrast in both themes.
- White logo is used in dark mode; dark-logo placeholder path is used in light mode.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Verification, Cleanup, and Guardrails

### Overview

Run the full verification set required for this UI-shell change, then remove any leftover hard-coded dark colors from the scoped lesson shell where they would break light mode.

### Changes Required:

#### 1. Scoped hard-coded color audit

**Files**:

- `src/components/ContentTopBar.svelte`
- `src/components/sidebar/LessonSidebar.svelte`
- `src/components/sidebar/SidebarLessonRow.svelte`
- `src/components/sidebar/SidebarToggle.svelte`
- `src/components/navigation/TOCTree.svelte`
- `src/components/progress/LessonProgressToggle.svelte`
- `src/components/shared/MarkdownDownloadButton.astro`
- `src/components/Lesson.astro`
- `src/layouts/CourseLayout.astro`
- `src/layouts/ExternalLessonLayout.astro`
- `src/pages/external/[courseId]/[lessonId].astro`
- `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Intent**: Catch accidental dark-only Tailwind colors in the scoped shell.

**Contract**: Search for `bg-gray-9`, `bg-gray-8`, `text-white`, `text-gray-`, `border-gray-`, `prose-invert`, and `highlight-github-dark` in the scoped file list. Keep only cases that are intentionally handled by theme CSS or still required for dark-mode fallback, and document any intentional leftovers in the implementation summary.

#### 2. Browser verification

**Files**: no source file required unless fixes are discovered.

**Intent**: Verify the shell in realistic browser layouts, not just component tests.

**Contract**: Run the app locally and inspect at least:

- A regular course lesson route.
- An external 10xDevs 3 lesson route.
- A localized external lesson route under `/external/<courseId>/<lang>/<lessonId>` if available locally.
- Desktop width and mobile width.
- Reload after light preference is stored.
- First load after storage is cleared.

#### 3. Final documentation note in plan progress

**File**: `context/changes/light-theme/plan.md`

**Intent**: Keep execution state in the canonical `## Progress` section as phases land.

**Contract**: Implementers should check off progress items only after the corresponding automated/manual verification passes, appending commit SHAs when phases land.

### Success Criteria:

#### Automated Verification:

- Scoped color audit command produces no unreviewed dark-only classes in the migrated shell files.
- Full component suite passes: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/LessonSidebar.test.ts src/components/sidebar/SidebarToggle.test.ts src/components/navigation/TOCTree.test.ts src/components/progress/LessonProgressToggle.test.ts`
- Astro check passes: `npm run check`
- Full production build passes: `npm run build`

#### Manual Verification:

- Dark mode remains the default on a clean browser profile.
- Light mode persists per device after reload and navigation between regular/external lessons.
- No visible dark-to-light flash occurs for stored light preference.
- Desktop and mobile shell controls remain readable, clickable, and non-overlapping.
- The user has replaced or approved the dark-logo placeholder assets before final visual acceptance.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful.

---

## Testing Strategy

### Unit Tests:

- `lessonTheme` helper: parses only `dark`/`light`, defaults to `dark`, tolerates invalid values.
- `LessonThemeToggle`: defaults to dark, toggles to light, writes `LESSON_THEME_STORAGE_KEY`, updates the document attribute, and survives storage errors.
- `ContentTopBar`: renders the theme toggle only when opted in; existing TOC/lesson panel tests continue to pass.
- Existing sidebar, TOC, and progress tests should remain behavior-focused and not assert exact color utility strings.

### Integration Tests:

- No new server integration tests are needed.
- Existing component integration around TOC scroll and sidebar storage remains relevant because the theme toggle shares the same topbar surface and storage model.

### Manual Testing Steps:

1. Start local dev server with `npm run dev`.
2. Open a regular lesson route, confirm dark default, toggle to light, reload, and confirm light persists.
3. Open an external lesson route, confirm it reads the same stored light preference.
4. Clear `localStorage`, reload, and confirm dark default.
5. Test desktop and mobile widths for topbar, sidebar, mobile panels, desktop TOC widget, progress controls, markdown button, prose, links, inline code, fenced code blocks, and scrollbars.
6. Replace or approve `logo-dark.png` and `logo-dark-mobile.png`, then repeat the topbar visual check in light mode.

## Performance Considerations

The theme switch is CSS-variable driven and should not trigger network requests except for the logo asset selected by the current theme. The pre-paint script must stay tiny and synchronous: read one storage key, validate one string, set one document attribute. No route should fetch user profile data or call the server to decide theme.

## Migration Notes

No database, KV, cookie, or server-side migration is required. Existing users start in dark mode until they explicitly choose light on a device. Invalid stored values are ignored and reset logically to the dark default by the application code.

## References

- Regular lesson composition: `src/components/Course.astro:52`
- Regular layout dark stylesheet/body: `src/layouts/CourseLayout.astro:27`
- Regular lesson prose container: `src/components/Lesson.astro:11`
- External lesson layout dark critical CSS and highlight stylesheet: `src/layouts/ExternalLessonLayout.astro:138`
- External lesson content wrapper: `src/layouts/ExternalLessonLayout.astro:285`
- External route prose containers: `src/pages/external/[courseId]/[lessonId].astro:332`, `src/pages/external/[courseId]/[lang]/[lessonId].astro:128`
- Topbar dark classes and TOC widget: `src/components/ContentTopBar.svelte:225`, `src/components/ContentTopBar.svelte:590`
- Sidebar storage pattern: `src/components/sidebar/SidebarToggle.svelte:18`
- Shared storage key pattern: `src/lib/topBarHelpers.ts:33`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` -- <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Theme Foundation

#### Automated

- [x] 1.1 Theme helper unit tests pass if added: `npx vitest run src/lib/lessonTheme.test.ts`
- [x] 1.2 Existing component tests still pass after stylesheet imports: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/SidebarToggle.test.ts`
- [x] 1.3 Type checking passes: `npm run check`

#### Manual

- [x] 1.4 Loading a regular lesson with no stored preference still shows the current dark appearance
- [x] 1.5 Manually setting `document.documentElement.dataset.lessonTheme = 'light'` visibly changes shell/prose/code colors on a regular lesson
- [x] 1.6 The new dark-logo placeholder files import successfully in a local build

### Phase 2: Top-Bar Toggle and Persistence

#### Automated

- [x] 2.1 Toggle component tests pass: `npx vitest run src/components/LessonThemeToggle.test.ts`
- [x] 2.2 Content topbar tests pass: `npx vitest run src/components/ContentTopBar.test.ts`
- [x] 2.3 Type checking passes: `npm run check`

#### Manual

- [x] 2.4 On a regular lesson, clicking the theme toggle switches dark to light and back without reloading
- [x] 2.5 On an external lesson, clicking the same toggle switches dark to light and back
- [x] 2.6 After choosing light, reloading the page keeps light mode with no visible dark flash
- [x] 2.7 After clearing `localStorage`, the same lesson opens in dark mode
- [x] 2.8 The toggle remains visible and usable on mobile widths

### Phase 3: Migrate Lesson-Shell Components to Semantic Classes

#### Automated

- [x] 3.1 Component tests pass: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/LessonSidebar.test.ts src/components/sidebar/SidebarToggle.test.ts src/components/navigation/TOCTree.test.ts src/components/progress/LessonProgressToggle.test.ts`
- [x] 3.2 Type checking passes: `npm run check`
- [x] 3.3 Production build passes: `npm run build`

#### Manual

- [x] 3.4 Regular lesson shell is visually coherent in dark and light modes
- [x] 3.5 External lesson shell is visually coherent in dark and light modes
- [x] 3.6 Mobile lesson panel, mobile section panel, desktop TOC widget, and collapsed sidebar toggle remain readable in light mode
- [x] 3.7 Active lesson row, active TOC item, checklist row, progress button, markdown download button, and code blocks have sufficient contrast in both themes
- [x] 3.8 White logo is used in dark mode; dark-logo placeholder path is used in light mode

### Phase 4: Verification, Cleanup, and Guardrails

#### Automated

- [x] 4.1 Scoped color audit command produces no unreviewed dark-only classes in the migrated shell files
- [x] 4.2 Full component suite passes: `npx vitest run src/components/ContentTopBar.test.ts src/components/sidebar/LessonSidebar.test.ts src/components/sidebar/SidebarToggle.test.ts src/components/navigation/TOCTree.test.ts src/components/progress/LessonProgressToggle.test.ts`
- [x] 4.3 Astro check passes: `npm run check`
- [x] 4.4 Full production build passes: `npm run build`

#### Manual

- [x] 4.5 Dark mode remains the default on a clean browser profile
- [x] 4.6 Light mode persists per device after reload and navigation between regular/external lessons
- [x] 4.7 No visible dark-to-light flash occurs for stored light preference
- [x] 4.8 Desktop and mobile shell controls remain readable, clickable, and non-overlapping
- [x] 4.9 The user has replaced or approved the dark-logo placeholder assets before final visual acceptance
