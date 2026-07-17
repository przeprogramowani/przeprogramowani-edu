# Unify Lesson Sidebar UI/UX Implementation Plan

## Overview

Unify the two desktop lesson sidebars (`Sidebar.astro` for regular courses and `ExternalSidebar.astro` for external courses) into one shared `LessonSidebar.svelte` component. The new component adopts ExternalSidebar's visual style, supports both flat and grouped lesson modes, and includes an integrated collapse/toggle feature for both course types. This is a UI/UX alignment — no data model changes.

## Current State Analysis

Two completely separate sidebar components exist:

- **`src/components/Sidebar.astro`** — Flat lesson list for regular courses. Server-rendered, no interactivity, no collapse. Uses `bg-gray-800/95`, blue ring active state, numbered badges, 300px width via Tailwind JIT.
- **`src/components/external/ExternalSidebar.astro`** — Section-grouped sidebar for external courses. Server-rendered, collapsible via separate `ExternalSidebarToggle.svelte`. Uses `bg-gray-900`, blue left-border active state, `<details>` accordions, 300px width via critical CSS.

The mobile/topbar experience is already unified through `ContentTopBar.svelte`. The visible divergence is desktop-only.

### Key Discoveries:

- Both sidebars are consumed by exactly one parent each: `Course.astro:60` and `ExternalLessonLayout.astro:251`
- The collapse mechanism uses `body.sidebar-collapsed` class + CSS transition on `.sidebar-container` — this pattern works and should be preserved
- FOUC prevention for collapse state requires an inline `<script>` that runs before hydration to read localStorage — must stay in layouts
- `Sidebar.astro` receives full `LessonEntry[]` (with HTML content) but only uses `id` and `name` — wasteful
- Sidebar width is expressed three ways: Tailwind `min-w-[300px]`, critical CSS `width: 300px`, and toggle offset `left: 296px` — will be unified via CSS custom property
- `EXTERNAL_SIDEBAR_STORAGE_KEY` is defined in `src/lib/topBarHelpers.ts` but the FOUC script uses a hardcoded string `'external-sidebar-collapsed'`
- `ExternalSidebarToggle.svelte` already uses Svelte 5 syntax (`$state`, `onclick`)
- TOC critical CSS is duplicated across `CourseLayout.astro:52-57` and `ExternalLessonLayout.astro:153-157`
- Highlight.js is loaded via CDN in `CourseLayout.astro:29` but self-hosted in `ExternalLessonLayout.astro:204`

## Desired End State

After this plan is complete:

1. Both regular course lessons and external course lessons use the same `LessonSidebar.svelte` component for desktop navigation
2. Both sidebar instances look visually identical — same background (`bg-gray-900`), same active state (blue left-border), same typography, same hover effects
3. Regular courses gain the sidebar collapse/expand toggle that external courses already have
4. The sidebar is composed of two Svelte 5 components, both with `client:load`: `LessonSidebar.svelte` (navigation rendering) and `SidebarToggle.svelte` (collapse button). `SidebarToggle` must remain a body-level sibling of `.sidebar-container` — never a DOM descendant — so that collapsing the container (opacity:0) does not hide the toggle itself.
5. Sidebar width is controlled by a single CSS custom property `--sidebar-width: 300px`
6. No data model changes — regular courses remain flat, external courses remain grouped
7. Low-risk refactoring cleanups (R1-R3) from the research are resolved

**Verification**: Navigate to any regular course lesson (e.g., `/courses/opanuj-frontend/lesson/01`) and any external lesson (e.g., `/external/10xdevs-2/{lessonId}`). Both should show visually identical sidebar styling with functional collapse toggle. Mobile behavior is unchanged (handled by ContentTopBar).

## What We're NOT Doing

- NOT changing the data model for regular courses (no section/module metadata)
- NOT adding section grouping to regular courses (they remain flat)
- NOT adding checklists to regular courses
- NOT modifying `ContentTopBar.svelte` (it already handles both modes for mobile)
- NOT unifying the auth flow or content delivery pipeline
- NOT migrating the FOUC prevention pattern (inline scripts stay in layouts)

## Implementation Approach

Create a single `LessonSidebar.svelte` component that accepts a discriminated `mode: 'flat' | 'grouped'` prop. For flat mode, it renders a simple lesson list. For grouped mode, it renders collapsible section accordions with optional checklists. Both modes share the same visual styling.

The collapse toggle stays in a separate `SidebarToggle.svelte` component (a rename and light cleanup of today's `ExternalSidebarToggle.svelte`). It is rendered as a **body-level sibling** of `.sidebar-container` in each layout — it must never be a DOM descendant of the collapsed container, because `.sidebar-container { opacity: 0 }` would otherwise also hide the toggle (opacity establishes a stacking context that applies to fixed-position descendants).

Integrate both into the two layout paths, then remove the old components.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **FOUC Prevention**: The sidebar collapse state is read from localStorage via an inline `<script is:inline>` in the layout `<head>`, before Svelte hydration. This must remain in the layout, not the component. `SidebarToggle` reads from localStorage on `onMount` to sync its internal state.
- **Hydration Sequence**: `SidebarToggle` uses an `isHydrated` flag to avoid rendering before Svelte mounts. This prevents the button from appearing in the wrong position during SSR. The `html.sidebar-not-hydrated .sidebar-toggle-button { display: none }` guard (in `sidebar.css`) is the pre-hydration equivalent.
- **Body Class Coordination**: `document.body.classList.toggle('sidebar-collapsed', isCollapsed)` drives the CSS transition on `.sidebar-container` in the layout. `SidebarToggle` manages this after hydration; the FOUC script handles the pre-hydration state.
- **DOM Placement Constraint**: `SidebarToggle` MUST be rendered as a sibling of `.sidebar-container`, not a descendant. The collapsed state applies `opacity: 0` to `.sidebar-container`; CSS opacity establishes a stacking context that applies to all descendants including fixed-position children, so a toggle nested inside the container would become invisible (and unclickable) exactly when the user needs it most.

### User Experience Specification

- **Collapse Animation**: `width 0.3s ease, min-width 0.3s ease, opacity 0.3s ease` — matches current ExternalLessonLayout behavior
- **Toggle Button Position**: Fixed at `top: 4.5rem` (below topbar), `left: calc(var(--sidebar-width) - 4px)` when expanded, `left: 0` when collapsed
- **Active Lesson**: Blue left-border (`border-blue-500 bg-blue-800/30`) for both flat and grouped modes
- **Active Checklist**: Emerald left-border (`border-emerald-500 bg-emerald-800/30`) — grouped mode only
- **Section Headers**: Collapsible `<details>` with chevron rotation, auto-opens the section containing the active lesson
- **Flat Mode Header**: Sticky "Lekcje" header with lesson count, matching the grouped section header styling

### Performance & Optimization Strategy

- **Lightweight Nav Items**: Regular courses map `LessonEntry[]` to `{id: string, name: string}[]` before passing to the sidebar — no full HTML content in props
- **Hydration Cost**: Adding `client:load` to the sidebar means Svelte hydration for both course types. The component is small (~150 lines) and the sidebar is always visible on desktop, so the cost is minimal and the toggle interactivity justifies it.
- **No Derived Stores**: Collapse state is a simple `$state` boolean with localStorage sync — no reactive stores needed.

### State Management Sequencing

- **localStorage → FOUC script → body class** (before hydration)
- **onMount → read localStorage → sync $state → updateBodyClass** (on hydration)
- **toggle click → flip $state → write localStorage → updateBodyClass** (on interaction)

The storage key will change from `'external-sidebar-collapsed'` to `'sidebar-collapsed'` since it's now shared. A one-time migration reads the old key if the new one doesn't exist.

### Debug & Observability Plan

- **Verification Method**: Visual comparison of both sidebar types side-by-side, collapse toggle functional in both, FOUC-free on hard reload
- **Existing Tests**: `ExternalSidebarToggle.test.ts` covers toggle/localStorage logic — needs updating for the new component name and absorbed structure
- **No Additional Logging**: This is a pure UI change with no server-side effects

---

## Phase 1: Define Shared Types and CSS Custom Property

### Overview

Establish the shared navigation item types and the CSS custom property for sidebar width. This phase creates the foundation that all subsequent phases build on.

### Changes Required:

#### 1. Create shared sidebar navigation types

**File**: `src/components/sidebar/types.ts` (new)
**Changes**: Define the lightweight navigation item types used by both flat and grouped modes

```typescript
/**
 * Lightweight lesson item for sidebar navigation (no content HTML).
 * Used by both flat and grouped sidebar modes.
 */
export interface SidebarLessonItem {
  id: string | number;
  name: string;
  sectionId?: number;
}

/**
 * Section metadata for grouped sidebar mode.
 */
export interface SidebarSection {
  id: number;
  name: string;
  position: number;
}

/**
 * Checklist item for grouped sidebar mode (optional).
 */
export interface SidebarChecklistItem {
  id: string;
  title: string;
}

/**
 * Props for flat sidebar mode (regular courses).
 *
 * Note: we intentionally pass `lessonUrlPrefix` (a plain string) rather than
 * a URL-building function. The sidebar is hydrated as a `client:load` Svelte
 * island, and Astro serializes island props to JSON — functions cannot cross
 * that boundary.
 */
export interface FlatSidebarProps {
  mode: 'flat';
  lessons: SidebarLessonItem[];
  activeLessonId: string;
  lessonUrlPrefix: string; // e.g. "/courses/opanuj-frontend/lesson"
}

/**
 * Props for grouped sidebar mode (external courses).
 *
 * Note: `courseId` (a plain string) is used instead of a URL-building function
 * for the same reason as `FlatSidebarProps.lessonUrlPrefix` — Astro island
 * props must be JSON-serializable.
 */
export interface GroupedSidebarProps {
  mode: 'grouped';
  lessons: SidebarLessonItem[];
  sections: SidebarSection[];
  activeLessonId: number;
  courseId: string; // used to build `/external/${courseId}/${id}` and `/external/${courseId}/checklists/${id}`
  checklists?: SidebarChecklistItem[];
  activeChecklistId?: string | null;
}

export type LessonSidebarProps = FlatSidebarProps | GroupedSidebarProps;
```

#### 2. Add CSS custom property for sidebar width

**File**: `src/styles/sidebar.css` (new)
**Changes**: Single source of truth for sidebar width

```css
:root {
  --sidebar-width: 300px;
}

/* Sidebar container base styles */
.sidebar-container {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  transition: width 0.3s ease, min-width 0.3s ease, opacity 0.3s ease;
}

/* Collapsed state */
body.sidebar-collapsed .sidebar-container {
  width: 0;
  min-width: 0;
  opacity: 0;
  overflow: hidden;
}

/* Hide toggle button until hydrated */
html.sidebar-not-hydrated .sidebar-toggle-button {
  display: none !important;
}
```

#### 3. Update storage key constant

**File**: `src/lib/topBarHelpers.ts`
**Changes**: Add the new unified storage key alongside the old one for migration

```typescript
export const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';
/** @deprecated Use SIDEBAR_STORAGE_KEY instead */
export const EXTERNAL_SIDEBAR_STORAGE_KEY = 'external-sidebar-collapsed';
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors introduced)
- [x] No lint errors: `npm run lint`
- [x] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] No visual changes yet — this phase is foundational

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Create `LessonSidebar.svelte` and `SidebarToggle.svelte`

### Overview

Build the shared Svelte 5 sidebar as two separate components:

1. `LessonSidebar.svelte` — renders flat or grouped lesson navigation (no toggle button, no collapse state).
2. `SidebarToggle.svelte` — owns the collapse state (localStorage + body class) and renders the fixed-position toggle button. This is a rename and light cleanup of today's `ExternalSidebarToggle.svelte` so it can be reused by both layouts.

The two components are kept separate so that `SidebarToggle` can be rendered as a body-level sibling of `.sidebar-container` (see "DOM Placement Constraint" above). Absorbing the toggle into `LessonSidebar` would place it inside the collapsed container and hide it via parent `opacity: 0`.

### Changes Required:

#### 1. Create the shared sidebar component

**File**: `src/components/sidebar/LessonSidebar.svelte` (new)
**Changes**: Full Svelte 5 component with flat/grouped modes — no collapse state, no toggle button. Collapse is owned by `SidebarToggle` (see #2 below).

The component should:

**Script section:**
- Accept props via `$props()` matching `LessonSidebarProps` contract (see Phase 1 types — non-function props: `lessonUrlPrefix` for flat, `courseId` for grouped)
- For grouped mode: compute `lessonsBySection` Map and `activeSectionId` as derived values
- Import `getChecklistCountLabel` from `@/lib/topBarHelpers` for checklist count text

**Template section — flat mode:**
- Sticky header: "Lekcje" title + `{lessons.length} w kursie` count (styled to match grouped section headers: `bg-gray-900`, `text-sm font-medium text-gray-300`)
- Flat lesson list: Each lesson as an `<a>` with `border-l-2` active state (`bg-blue-800/30 border-blue-500 text-white` when active, `border-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white` otherwise). Links built as `${lessonUrlPrefix}/${lesson.id}`.
- Lesson text: `text-xs` matching grouped mode
- No numbered badges (aligning with ExternalSidebar style)

**Template section — grouped mode:**
- Sections as `<details>` with auto-open for active section
- Section summary: section name + lesson count + rotating chevron
- Lessons inside sections: same `border-l-2` active styling as flat mode. Links built as `/external/${courseId}/${lesson.id}`.
- Optional checklists section: emerald accent, clipboard icon, Polish pluralization via `getChecklistCountLabel()`. Links built as `/external/${courseId}/checklists/${checklist.id}`.

**Style section:**
- `summary::-webkit-details-marker { display: none; }` (for grouped mode)
- `details[open] a[class*="bg-blue-800"] { scroll-margin-top: 1rem; }` (unchanged from today)

```svelte
<script lang="ts">
  import { getChecklistCountLabel } from '@/lib/topBarHelpers';
  import type { LessonSidebarProps } from './types';

  const {
    mode,
    lessons,
    activeLessonId,
    lessonUrlPrefix,
    courseId,
    sections = [],
    checklists = [],
    activeChecklistId = null,
  }: LessonSidebarProps = $props();

  // Derived: group lessons by section for grouped mode
  const lessonsBySection = $derived.by(() => {
    if (mode !== 'grouped') return new Map<number, typeof lessons>();
    const map = new Map<number, typeof lessons>();
    for (const section of sections) {
      map.set(
        section.id,
        lessons.filter((l) => l.sectionId === section.id)
      );
    }
    return map;
  });

  const activeSectionId = $derived(
    mode === 'grouped'
      ? lessons.find((l) => l.id === activeLessonId)?.sectionId ?? null
      : null
  );

  const isChecklistSectionOpen = $derived(activeChecklistId !== null);

  function lessonHref(id: string | number): string {
    return mode === 'flat'
      ? `${lessonUrlPrefix}/${id}`
      : `/external/${courseId}/${id}`;
  }

  function checklistHref(id: string): string {
    return `/external/${courseId}/checklists/${id}`;
  }
</script>

<aside class="flex flex-col bg-gray-900 h-full">
  {#if mode === 'flat'}
    <!-- Flat mode: sticky header + simple lesson list -->
    <div class="sticky top-0 z-10 px-4 py-3 border-b border-gray-800 bg-gray-900">
      <span class="text-sm font-medium text-white">Lekcje</span>
      <span class="block text-xs text-gray-500">{lessons.length} w kursie</span>
    </div>
    <div class="bg-gray-800/30">
      {#each lessons as lesson}
        <a
          href={lessonHref(lesson.id)}
          class="block px-6 py-2 border-l-2 transition-colors {lesson.id === activeLessonId
            ? 'bg-blue-800/30 border-blue-500 text-white'
            : 'border-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white'}"
        >
          <span class="text-xs">{lesson.name}</span>
        </a>
      {/each}
    </div>

  {:else}
    <!-- Grouped mode: collapsible sections -->
    {#each sections as section}
      {@const sectionLessons = lessonsBySection.get(section.id) || []}
      {@const isActiveSection = section.id === activeSectionId}
      <details class="border-b border-gray-800 group" open={isActiveSection}>
        <summary class="px-4 py-3 cursor-pointer select-none hover:bg-gray-800/50 transition-colors list-none">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-300 group-open:text-white">
              {section.name}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span class="text-xs text-gray-500">{sectionLessons.length} lekcji</span>
        </summary>
        <div class="bg-gray-800/30">
          {#each sectionLessons as lesson}
            <a
              href={lessonHref(lesson.id)}
              class="block px-6 py-2 border-l-2 transition-colors {lesson.id === activeLessonId
                ? 'bg-blue-800/30 border-blue-500 text-white'
                : 'border-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white'}"
            >
              <span class="text-xs">{lesson.name}</span>
            </a>
          {/each}
        </div>
      </details>
    {/each}

    <!-- Checklists section (optional) -->
    {#if checklists.length > 0}
      <div class="border-t border-gray-700 my-2"></div>
      <details class="border-b border-gray-800 group" open={isChecklistSectionOpen}>
        <summary class="px-4 py-3 cursor-pointer select-none hover:bg-gray-800/50 transition-colors list-none">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-300 group-open:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Checklisty
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span class="text-xs text-gray-500">
            {checklists.length} {getChecklistCountLabel(checklists.length)}
          </span>
        </summary>
        <div class="bg-gray-800/30">
          {#each checklists as checklist}
            <a
              href={checklistHref(checklist.id)}
              class="block px-6 py-2 border-l-2 transition-colors {checklist.id === activeChecklistId
                ? 'bg-emerald-800/30 border-emerald-500 text-white'
                : 'border-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white'}"
            >
              <span class="text-xs">{checklist.title}</span>
            </a>
          {/each}
        </div>
      </details>
    {/if}
  {/if}
</aside>

<style>
  summary::-webkit-details-marker {
    display: none;
  }

  details[open] a[class*="bg-blue-800"] {
    scroll-margin-top: 1rem;
  }
</style>
```

#### 2. Create the shared toggle component

**File**: `src/components/sidebar/SidebarToggle.svelte` (new — replaces `src/components/external/ExternalSidebarToggle.svelte`)
**Changes**: Lightly refactored version of today's `ExternalSidebarToggle.svelte` that uses the new `SIDEBAR_STORAGE_KEY` and handles the one-time migration from the old key. The component keeps the same public contract (no props, self-contained collapse state) and the same DOM shape, so it can be rendered as a body-level sibling of `.sidebar-container` in both layouts.

The component should:

**Script section:**
- Import `SIDEBAR_STORAGE_KEY`, `EXTERNAL_SIDEBAR_STORAGE_KEY` from `@/lib/topBarHelpers`
- `isCollapsed` and `isHydrated` as `$state(false)`
- On `onMount`:
  1. Migration: if `localStorage[SIDEBAR_STORAGE_KEY]` is null and `localStorage[EXTERNAL_SIDEBAR_STORAGE_KEY]` is set, copy the value across and delete the old key
  2. Read collapse state from `localStorage[SIDEBAR_STORAGE_KEY]`
  3. Set `isHydrated = true`
  4. Call `updateBodyClass()`
- `toggle()` flips `isCollapsed`, writes to localStorage under the new key, calls `updateBodyClass()`
- `updateBodyClass()` toggles `'sidebar-collapsed'` on `document.body`

**Template section:**
- Only rendered when `isHydrated` (so SSR produces nothing)
- `<button class="sidebar-toggle-button hidden md:flex fixed z-50 ...">` with chevron SVG
- `class:collapsed={isCollapsed}` + `class:rotate-180={isCollapsed}` on the SVG
- Polish ARIA labels: "Rozwiń menu" / "Zwiń menu"

**Style section:**
- `.sidebar-toggle-button { top: 4.5rem; left: calc(var(--sidebar-width) - 4px); }`
- `.sidebar-toggle-button.collapsed { left: 0; }`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    SIDEBAR_STORAGE_KEY,
    EXTERNAL_SIDEBAR_STORAGE_KEY,
  } from '@/lib/topBarHelpers';

  let isCollapsed = $state(false);
  let isHydrated = $state(false);

  onMount(() => {
    // Migration: read old key if new one doesn't exist
    let saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved === null) {
      const legacy = localStorage.getItem(EXTERNAL_SIDEBAR_STORAGE_KEY);
      if (legacy !== null) {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, legacy);
        localStorage.removeItem(EXTERNAL_SIDEBAR_STORAGE_KEY);
        saved = legacy;
      }
    }
    if (saved !== null) {
      isCollapsed = JSON.parse(saved);
    }
    isHydrated = true;
    updateBodyClass();
  });

  function toggle() {
    isCollapsed = !isCollapsed;
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
    updateBodyClass();
  }

  function updateBodyClass() {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }
</script>

{#if isHydrated}
  <button
    class="sidebar-toggle-button hidden md:flex fixed z-50 items-center justify-center w-6 h-12 bg-gray-700 hover:bg-gray-600 rounded-r-md transition-all duration-300"
    class:collapsed={isCollapsed}
    onclick={toggle}
    aria-label={isCollapsed ? 'Rozwiń menu' : 'Zwiń menu'}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4 text-gray-300 transition-transform duration-300"
      class:rotate-180={isCollapsed}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
{/if}

<style>
  .sidebar-toggle-button {
    top: 4.5rem;
    left: calc(var(--sidebar-width) - 4px);
  }

  .sidebar-toggle-button.collapsed {
    left: 0;
  }
</style>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors in new files)
- [x] No lint errors: `npm run lint`
- [x] Existing tests pass: `npm run test` (320/320)

#### Manual Verification:

- [ ] Component file exists and compiles — not yet integrated into pages

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Integrate into External Lessons

### Overview

Replace `ExternalSidebar.astro` + `ExternalSidebarToggle.svelte` with `LessonSidebar.svelte` in `ExternalLessonLayout.astro`.

### Changes Required:

#### 1. Update ExternalLessonLayout.astro

**File**: `src/layouts/ExternalLessonLayout.astro`
**Changes**:
- Replace import of `ExternalSidebar` with `LessonSidebar`
- Replace import of `ExternalSidebarToggle` with the new shared `SidebarToggle` (same render position: body-level sibling of `.sidebar-container`)
- Import `src/styles/sidebar.css` for the CSS custom property and transition styles
- Update the FOUC prevention script to use the new storage key `'sidebar-collapsed'` (with fallback to old key)
- Replace the sidebar rendering block with `LessonSidebar` in grouped mode, passing `courseId` + lightweight `lessons`/`checklists`
- Keep `<SidebarToggle client:load />` as a body-level sibling after `</div>` closing the flex container (same position the old toggle occupied)
- Remove the inline critical CSS for `.sidebar-container`/`.sidebar-collapsed` — now handled by `sidebar.css`
- Keep the `.sidebar-container` wrapper div but remove inline width styles (now from CSS custom property)
- Keep the `sidebar-not-hydrated` class on `<html>` and the cleanup script at the bottom of `<body>` — `SidebarToggle` is still pre-hydration hidden via the `html.sidebar-not-hydrated .sidebar-toggle-button` rule

**Before** (lines 3-4, imports):
```astro
import ExternalSidebar from '@/components/external/ExternalSidebar.astro';
import ExternalSidebarToggle from '@/components/external/ExternalSidebarToggle.svelte';
```

**After**:
```astro
import LessonSidebar from '@/components/sidebar/LessonSidebar.svelte';
import SidebarToggle from '@/components/sidebar/SidebarToggle.svelte';
import '@/styles/sidebar.css';
```

**Before** (lines 249-260, sidebar rendering):
```astro
<div class="sidebar-container hidden md:block border-r border-gray-700 h-full">
  <div class="h-full overflow-y-auto bg-gray-900">
    <ExternalSidebar
      courseId={courseId}
      lessons={lessons}
      sections={sections}
      activeLessonId={activeLessonId}
      checklists={checklists}
      activeChecklistId={activeChecklistId}
    />
  </div>
</div>
```

**After**:
```astro
<div class="sidebar-container hidden md:block border-r border-gray-700 h-full">
  <div class="h-full overflow-y-auto bg-gray-900">
    <LessonSidebar
      client:load
      mode="grouped"
      courseId={courseId}
      lessons={lessons.map(l => ({ id: l.id, name: l.name, sectionId: l.sectionId }))}
      sections={sections}
      activeLessonId={activeLessonId}
      checklists={checklists.map(c => ({ id: c.id, title: c.title }))}
      activeChecklistId={activeChecklistId}
    />
  </div>
</div>
```

**Replace** the `<ExternalSidebarToggle client:load />` line (was line 270) with:
```astro
<!-- Desktop sidebar toggle button — MUST remain a body-level sibling of
     .sidebar-container so it is not hidden by opacity:0 when collapsed. -->
<SidebarToggle client:load />
```

**Update** the FOUC script (line 208-217) to handle both old and new key:
```html
<script is:inline>
  (function() {
    try {
      var saved = localStorage.getItem('sidebar-collapsed');
      if (saved === null) {
        saved = localStorage.getItem('external-sidebar-collapsed');
      }
      if (saved === 'true') {
        document.body.classList.add('sidebar-collapsed');
      }
    } catch (e) {}
  })();
</script>
```

**Remove** the inline critical CSS for sidebar container (lines 178-196) — now handled by `sidebar.css`. Keep the rest of the critical CSS (base resets, backgrounds, prose, TOC).

**Keep** the `sidebar-not-hydrated` cleanup script (line 273-275) — it still removes the class that hides the toggle button pre-hydration.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors introduced)
- [x] No lint errors: `npm run lint`
- [x] Existing tests pass: `npm run test` (320/320)
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Navigate to an external lesson (e.g., `/external/10xdevs-2/{lessonId}`) — sidebar looks identical to before
- [ ] Sections are collapsible, active section auto-opens
- [ ] Collapse toggle works — sidebar hides/shows with smooth animation
- [ ] Collapse state persists across page reload
- [ ] No FOUC on hard reload (sidebar appears in correct collapsed/expanded state immediately)
- [ ] Checklists section renders correctly for 10xdevs-2
- [ ] Mobile view unaffected (sidebar hidden, ContentTopBar handles navigation)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Integrate into Regular Courses

### Overview

Replace `Sidebar.astro` with `LessonSidebar.svelte` in `Course.astro`, and add collapse + FOUC prevention to `CourseLayout.astro`.

### Changes Required:

#### 1. Update Course.astro

**File**: `src/components/Course.astro`
**Changes**:
- Replace `Sidebar` import with `LessonSidebar` and add `SidebarToggle` import
- Map `lessons` to lightweight nav items: `lessons.map(l => ({ id: l.id, name: l.data.name }))`
- Wrap sidebar in `.sidebar-container` div (matching external layout pattern)
- Pass `mode="flat"` with `lessonUrlPrefix`
- Render `<SidebarToggle client:load />` as a body-level sibling of the outermost flex container (outside `.sidebar-container`) — same placement rule as in external layout
- Import `@/styles/sidebar.css` for the CSS custom property and collapse transition

**Before** (lines 6, 57-69):
```astro
import Sidebar from './Sidebar.astro';
...
<div class='hidden md:block min-w-[300px] border-r border-gray-700 h-full'>
  <div class='h-full overflow-y-auto bg-gray-800/95'>
    <Sidebar lessons={lessons} activeLessonId={activeLesson.id} courseSlug={courseSlug} />
  </div>
</div>
```

**After**:
```astro
import LessonSidebar from './sidebar/LessonSidebar.svelte';
import SidebarToggle from './sidebar/SidebarToggle.svelte';
import '@/styles/sidebar.css';
...
<div class='sidebar-container hidden md:block border-r border-gray-700 h-full'>
  <div class='h-full overflow-y-auto bg-gray-900'>
    <LessonSidebar
      client:load
      mode="flat"
      lessons={lessons.map(l => ({ id: l.id, name: l.data.name }))}
      activeLessonId={activeLesson.id}
      lessonUrlPrefix={`/courses/${courseSlug}/lesson`}
    />
  </div>
</div>
...
<!-- Body-level sibling of the .sidebar-container — MUST stay outside it
     so that opacity:0 on the collapsed container does not hide the toggle. -->
<SidebarToggle client:load />
```

Note the background change from `bg-gray-800/95` to `bg-gray-900` — aligning with ExternalSidebar style.

#### 2. Update CourseLayout.astro

**File**: `src/layouts/CourseLayout.astro`
**Changes**:
- Add the FOUC prevention inline script in `<head>` (same pattern as ExternalLessonLayout)
- Add `sidebar-not-hydrated` class to `<html>` element
- Import `@/styles/sidebar.css` at the top of the frontmatter for the CSS custom property, transition styles, and the pre-hydration toggle-hidden rule
- Add the `sidebar-not-hydrated` cleanup script at the end of `<body>` (mirrors ExternalLessonLayout line 273-275)
- Switch highlight.js from CDN to self-hosted (aligning with ExternalLessonLayout — R15)

**Add to frontmatter (top of file):**
```astro
import '@/styles/sidebar.css';
```

**Add to `<head>`:**
```html
<!-- Apply sidebar collapsed state immediately to prevent FOUC -->
<script is:inline>
  (function() {
    try {
      var saved = localStorage.getItem('sidebar-collapsed');
      if (saved === null) {
        saved = localStorage.getItem('external-sidebar-collapsed');
      }
      if (saved === 'true') {
        document.body.classList.add('sidebar-collapsed');
      }
    } catch (e) {}
  })();
</script>
```

**Change** `<html lang="en">` to `<html lang="en" class="sidebar-not-hydrated">`.

**Add at the end of `<body>`, before `</body>`:**
```html
<!-- Remove sidebar-not-hydrated class after hydration -->
<script>
  document.documentElement.classList.remove('sidebar-not-hydrated');
</script>
```

**Change** highlight.js from CDN:
```html
<!-- Before -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" />
<!-- After -->
<link rel="stylesheet" href="/styles/highlight-github-dark.min.css" />
```

**Note**: Current `CourseLayout.astro` does not load highlight.js from CDN; it already references `/styles/highlight-github-dark.min.css` (line 26). Skip this step if the CDN reference is no longer present — verify by reading the file before editing.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors)
- [x] No lint errors: `npm run lint`
- [x] Existing tests pass: `npm run test` (320/320)
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Navigate to a regular course lesson (e.g., `/courses/opanuj-frontend/lesson/01`) — sidebar has new ExternalSidebar-style look
- [ ] Flat lesson list renders correctly with all lessons visible
- [ ] Active lesson highlighted with blue left-border
- [ ] Collapse toggle appears and works — sidebar hides/shows with smooth animation
- [ ] Collapse state persists across page reload
- [ ] No FOUC on hard reload
- [ ] Lesson content still renders correctly alongside the sidebar
- [ ] Mobile view unaffected
- [ ] Both regular and external lessons share the same visual sidebar style

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Low-Risk Cleanups

### Overview

Deduplicate the TOC critical CSS (R10). The other cleanups from the research have already been resolved: R1, R2, R3 in prior work; R15 (highlight.js CDN→self-hosted) fixed separately.

### Changes Required:

#### 1. Deduplicate TOC critical CSS (R10)

**File**: `src/styles/sidebar.css` (extend the file created in Phase 1)
**Changes**: Add the shared TOC critical CSS:

```css
/* TOC Critical CSS - Hide until hydration */
html.toc-not-hydrated .toc-desktop-widget,
html.toc-not-hydrated .toc-fab-button,
html.toc-not-hydrated .toc-toggle-mobile,
html.toc-not-hydrated .toc-mobile-overlay {
  display: none !important;
}

@media (min-width: 1536px) {
  .toc-desktop-widget {
    width: 20rem;
  }
}

.toc-toggle-desktop svg,
.toc-toggle-mobile svg {
  width: 1.25rem;
  height: 1.25rem;
}

.toc-toggle-mobile svg {
  width: 1.5rem;
  height: 1.5rem;
}
```

Then remove the duplicated blocks from:
- `src/layouts/CourseLayout.astro` (lines 52-75 `<style>` block — replace with `import '@/styles/sidebar.css'`)
- `src/layouts/ExternalLessonLayout.astro` (lines 152-176 in the critical CSS `<style>` block)

**Note**: The critical CSS in `ExternalLessonLayout.astro` is inlined for FOUC prevention. Moving the TOC CSS to an external file is safe because TOC elements are already hidden by the `toc-not-hydrated` class added via inline script before any stylesheet loads. The layout still needs its inline critical CSS for base resets and backgrounds.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors introduced)
- [x] No lint errors: `npm run lint` (no new errors in changed files)
- [x] All tests pass: `npm run test` (320/320)
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] External lessons: grouped navigation still works correctly
- [ ] Regular lessons: flat navigation still works correctly
- [ ] TOC widget appears correctly on both course types
- [ ] No FOUC on TOC or sidebar for either course type
- [ ] Download button works in ContentTopBar

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: Remove Old Components and Final Cleanup

### Overview

Delete the old sidebar components that are no longer used and clean up any remaining references.

### Changes Required:

#### 1. Delete old components

**Files to delete:**
- `src/components/Sidebar.astro` — replaced by `LessonSidebar.svelte`
- `src/components/external/ExternalSidebar.astro` — replaced by `LessonSidebar.svelte`
- `src/components/external/ExternalSidebarToggle.svelte` — replaced by `src/components/sidebar/SidebarToggle.svelte` (already created in Phase 2; this step removes the old file)

#### 2. Migrate the toggle test

**Action**: Migrate the 6 assertions from `src/components/external/ExternalSidebarToggle.test.ts` into a new `src/components/sidebar/SidebarToggle.test.ts`. Then delete the old test file.

New file should test:
- Renders a toggle button after mount
- Correct aria-label when expanded / collapsed
- Click toggles state and writes to `SIDEBAR_STORAGE_KEY`
- Reads initial state from `SIDEBAR_STORAGE_KEY`
- Adds / removes `sidebar-collapsed` class on `document.body`
- Migration: reads `EXTERNAL_SIDEBAR_STORAGE_KEY` when `SIDEBAR_STORAGE_KEY` is absent, copies the value to the new key, and removes the old key

#### 3. Clean up imports and references

Search the codebase for any remaining imports of the deleted files:
- `Sidebar.astro` — should only be imported in `Course.astro` (already updated in Phase 4)
- `ExternalSidebar.astro` — should only be imported in `ExternalLessonLayout.astro` (already updated in Phase 3)
- `ExternalSidebarToggle.svelte` — should only be imported in `ExternalLessonLayout.astro` (already updated in Phase 3)

#### 4. Remove deprecated export and migration code

**Scope**: These three edits MUST be made together in the same commit — removing the export while `SidebarToggle` still imports it would break the build.

**File**: `src/lib/topBarHelpers.ts` — remove the deprecated constant:

```typescript
// Remove:
/** @deprecated Use SIDEBAR_STORAGE_KEY instead */
export const EXTERNAL_SIDEBAR_STORAGE_KEY = 'external-sidebar-collapsed';
```

**File**: `src/components/sidebar/SidebarToggle.svelte` — remove the migration import and the `if (saved === null)` legacy-key block from `onMount`. After this edit, `onMount` should only read the new `SIDEBAR_STORAGE_KEY`.

**File**: `src/layouts/ExternalLessonLayout.astro` and `src/layouts/CourseLayout.astro` — simplify the FOUC inline scripts to only check `'sidebar-collapsed'` (drop the `'external-sidebar-collapsed'` fallback branch).

**When to do this**: Only after at least one release has shipped with the migration logic active, so existing users have had a chance to migrate their localStorage key. If you want to remove it in the same release as the rest of this plan, make sure the migration is considered acceptable to drop for any users who haven't visited the site since the previous external-only release. If in doubt, defer this step to a follow-up commit and leave the migration in place.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors introduced)
- [x] No lint errors: `npm run lint` (no new errors in changed files)
- [x] All tests pass: `npm run test` (321/321 — added one migration test)
- [x] Build succeeds: `npm run build`
- [x] `grep -r "Sidebar.astro\|ExternalSidebar.astro\|ExternalSidebarToggle" src/` returns no results (except the new component and its tests)

#### Manual Verification:

- [ ] Both regular and external course lessons render correctly
- [ ] Collapse toggle works on both
- [ ] No console errors
- [ ] Clean git status — only expected files changed/deleted

**Note**: Step 4 (remove deprecated `EXTERNAL_SIDEBAR_STORAGE_KEY` export, migration block in `SidebarToggle.svelte`, and legacy fallback in FOUC scripts) was **deferred** to a follow-up commit per the plan's recommendation — current release ships with the migration logic active so existing users have a chance to migrate their localStorage key.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- Migrate `ExternalSidebarToggle.test.ts` assertions to `LessonSidebar.test.ts`
- Test collapse state toggle logic
- Test localStorage persistence with new key `sidebar-collapsed`
- Test migration from old key `external-sidebar-collapsed`
- Test body class toggle

### Integration Tests:

- Build succeeds for both regular and external lesson pages
- No TypeScript errors across the codebase

### Manual Testing Steps:

1. Navigate to `/courses/opanuj-frontend/lesson/01` — verify new sidebar style with collapse
2. Navigate to `/external/10xdevs-2/{firstLessonId}` — verify sidebar identical to regular course style
3. Navigate between lessons — verify active state tracking
4. Toggle sidebar collapse — verify animation and persistence
5. Hard reload — verify no FOUC (sidebar appears in correct state immediately)
6. Test on mobile viewport — verify sidebar is hidden, ContentTopBar unaffected
7. Check `/external/10xdevs-2/checklists/{slug}` — verify checklists section renders
8. Open browser DevTools → Application → localStorage → verify `sidebar-collapsed` key (not old key)

## Performance Considerations

- Adding `client:load` to the sidebar in regular courses introduces Svelte hydration where there was none before. The component is lightweight (~150 lines) and the sidebar is always visible on desktop, so the impact is negligible.
- Removing full `LessonEntry[]` (with HTML content) from sidebar props reduces data passed through the component tree for regular courses.

## Migration Notes

- **localStorage key migration**: On first hydration of the new component, it checks for the old key `external-sidebar-collapsed`. If found and the new key `sidebar-collapsed` doesn't exist, it copies the value and deletes the old key. This is a one-time migration per user.
- **FOUC scripts**: Both layouts have inline scripts that check both keys during the migration period. After sufficient time (or on a subsequent release), the old key fallback can be removed from the FOUC scripts.

## References

- Related research: `thoughts/shared/research/2026-04-15-course-vs-external-lessons-navigation-unification.md`
- Prior topbar unification: `thoughts/shared/plans/2026-04-15-topbar-toc-alignment.md`
- Sidebar ordering research: `thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md`
- Key source files: `src/components/Sidebar.astro`, `src/components/external/ExternalSidebar.astro`, `src/components/external/ExternalSidebarToggle.svelte`, `src/layouts/ExternalLessonLayout.astro`, `src/components/Course.astro`, `src/layouts/CourseLayout.astro`, `src/lib/topBarHelpers.ts`

<!-- PLAN COMPLETED: 2026-04-16 -->
