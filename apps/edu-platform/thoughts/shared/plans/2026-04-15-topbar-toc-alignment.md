# Topbar & TOC Alignment Implementation Plan

## Overview

Create a unified `ContentTopBar.svelte` component that replaces four separate topbar implementations (CourseTopBar, ebook inline header, ExternalTopBar, ChecklistTopBar), consolidates mobile overlays into a single-island architecture with mutual exclusion, and fixes the IntersectionObserver scroll root for nested scroll containers.

## Current State Analysis

Four content page types use entirely different topbar/navigation structures:

1. **Course pages** (`/courses/[courseSlug]/lesson/[id]`) — `CourseTopBar.astro` (static) with two independent Svelte islands (`MobileSidebar.svelte` + `TOC.svelte`) each owning their own z-40 overlay
2. **Ebook page** (`/10xdevs-3/ebook/`) — custom inline `<div>` header constrained to `max-w-[800px]` with `bg-gray-800`, TOC rendered inline
3. **External lesson pages** (`/external/[courseId]/[lessonId]`) — `ExternalTopBar.astro` in `ExternalLessonLayout.astro` with `ExternalMobileSidebar.svelte` (grouped sections/checklists) + floating `TOC.svelte`
4. **Checklist pages** (`/external/10xdevs-2/checklists/[slug]`) — same `ExternalLessonLayout.astro` with `ExternalTopBar.astro` + `ExternalMobileSidebar.svelte` + floating `TOC.svelte`

### Key Discoveries:

- `CourseTopBar.astro` and `ExternalTopBar.astro` share identical structure (logo center, prev/next nav, home button) but are separate files with divergent styling (`bg-gray-900` vs `bg-gray-800`) — `src/components/CourseTopBar.astro:13` vs `src/components/external/ExternalTopBar.astro:17`
- On course pages mobile, `MobileSidebar.svelte` and `TOC.svelte` both render `fixed inset-0 z-40` overlays independently — `src/components/MobileSidebar.svelte:48` and `src/components/navigation/TOC.svelte:496`
- The ebook header uses `max-w-[800px]` constraint while all other topbars are full-width — `src/pages/10xdevs-3/ebook/index.astro:32`
- `TOC.svelte` is 562 lines mixing rendering concerns (desktop widget, mobile overlay, toggle buttons) with logic concerns (IntersectionObserver, heading tracking, hash navigation, state management) — `src/components/navigation/TOC.svelte:1-562`
- IntersectionObserver uses `root: null` (viewport) even when content scrolls in a nested container (`overflow-y-auto`), making `rootMargin: '0px 0px -80% 0px'` slightly inaccurate on course/external pages — `src/components/navigation/TOC.svelte:263-285`
- `ExternalMobileSidebar.svelte` renders a full-screen slide-in overlay with grouped sections and checklists — `src/components/external/ExternalMobileSidebar.svelte:52-171`
- All pages use identical `toc-not-hydrated` FOUC prevention pattern but implement it in different layouts — `src/layouts/CourseLayout.astro:52-57`, `src/layouts/SharedLessonLayout.astro:119-125`, `src/layouts/ExternalLessonLayout.astro:142-147`

## Desired End State

After implementation:

1. One shared `ContentTopBar.svelte` component renders the topbar for all content pages with consistent full-width styling (`bg-gray-900`, `border-b border-gray-700`, `px-4 py-2`).
2. Mobile overlays use a single `activePanel` state variable — opening one panel automatically closes the other. No z-index conflicts.
3. Desktop TOC floating widget renders from the same component, using the same state as the mobile panel.
4. IntersectionObserver correctly uses the nearest scroll container as `root` when content doesn't scroll with the body.
5. All deprecated topbar/sidebar components are removed.
6. `TOCTree.svelte` remains unchanged as a pure rendering component.

### Verification

- Course lesson with headings: topbar shows logo + prev/next + "Lekcje" toggle (mobile) + "Sekcje" toggle. Desktop shows floating TOC widget. Mobile lesson panel slides from left, TOC sections panel slides from right. Opening one closes the other.
- Course lesson without headings: no "Sekcje" toggle, no TOC widget. "Lekcje" toggle works normally.
- Ebook page: topbar is full-width with `bg-gray-900` styling. Left shows breadcrumb ("10xDevs 3.0 / Ebook"). Right shows download button + "Sekcje" toggle. No "Lekcje" toggle (no lesson list). Desktop TOC widget works.
- External lesson page: topbar shows home + prev/next + logo. Mobile has lesson nav (grouped sections + checklists) and TOC sections. Desktop sidebar unchanged.
- Checklist page: same topbar as external lessons but prev/next hidden (null URLs). TOC sections panel shows checklist headings.
- `npm run build` passes.
- `npm run test` passes.
- No FOUC on any page type.
- Hash deep links work on all page types (including course pages with nested scroll containers).

## What We're NOT Doing

- Redesigning the desktop sidebar for course pages or external pages
- Changing `ExternalSidebar.astro` or `ExternalSidebarToggle.svelte` (desktop-only concerns)
- Modifying the content area layout or lesson rendering
- Adding new features (analytics, new nav patterns, animations)
- Changing the TOCTree rendering or heading hierarchy logic
- Modifying authentication or routing logic

## Implementation Approach

Extract all TOC logic (IntersectionObserver, heading tracking, hash navigation, state) into a Svelte 5 composable (`createTocManager`). Build `ContentTopBar.svelte` that uses this composable and renders the unified topbar + all overlays + desktop TOC widget. Migrate pages one family at a time (course → ebook → external), verifying each before proceeding. Fix IntersectionObserver in the composable. Clean up deprecated components last.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Hydration order**: The `toc-not-hydrated` inline script must run before `ContentTopBar` mounts. On mount, the component restores localStorage state, gathers heading elements, sets up the IntersectionObserver, handles initial hash, then removes the FOUC class.
- **onMount sequencing**: (1) Read localStorage → (2) `gatherHeadingElements()` → (3) `syncActiveIdWithViewport()` → (4) `setupIntersectionObserver()` → (5) `handleLocationNavigation()` → (6) Set `isHydrated = true` → (7) Remove `toc-not-hydrated` class. This matches the current TOC.svelte lifecycle at `src/components/navigation/TOC.svelte:226-258`.
- **Hash navigation in nested scroll containers**: `scrollIntoView()` works across scroll contexts, but `history.pushState` must happen before or alongside the scroll to avoid recursive `hashchange` events.

### User Experience Specification

- **Topbar visual**: All pages get identical topbar chrome — full viewport width, `bg-gray-900`, `border-b border-gray-700`, `px-4 py-2`. Content differs per page type.
- **Mobile mutual exclusion**: One `activePanel` state variable (`null | 'lessons' | 'sections'`). Tapping "Lekcje" when "Sekcje" is open instantly switches. Tapping backdrop or Escape closes everything.
- **Mobile panel directions**: Lesson panel slides from left (consistent with current `MobileSidebar`). Sections panel slides from right (consistent with current TOC mobile).
- **Desktop TOC**: Floating widget at `fixed top-4 right-4 z-30`, toggled by a button in the topbar. Unchanged from current behavior.
- **No-heading pages**: "Sekcje" toggle and desktop widget hidden. Only "Lekcje" toggle shown (if lessons exist).
- **No-lesson pages** (ebook): "Lekcje" toggle hidden. Only "Sekcje" toggle shown.

### Performance & Optimization Strategy

- `createTocManager` is instantiated once per page load — no duplicate observers.
- `TOCTree.svelte` is rendered in both the desktop widget and the mobile panel but only one is visible at a time (the other is not in DOM due to `{#if}` blocks).
- `gatherHeadingElements()` runs once on mount, not per panel toggle.
- Heading extraction (Cheerio, `extractHeadingsFromHtml`) remains server-side only — no client-side parsing.

### State Management Sequencing

- `ContentTopBar.svelte` owns ALL navigation state: `activePanel`, `isHydrated`, desktop `isOpen`.
- `createTocManager` owns TOC-specific state: `activeId`, `expandedIds`, `headingElements`, `observer`.
- `ContentTopBar` calls `tocManager.handleClick(id)` when a TOCTree item is clicked in either desktop or mobile panel.
- `tocManager.activeId` drives highlighting in all TOCTree instances.
- Mobile panel close triggers: backdrop click, Escape key, TOCTree item click (via `closeMobile()` callback), lesson item click.

### Debug & Observability Plan

- **Verification method**: Manual browser testing across all four page types, both mobile and desktop viewports.
- **Failure signals**:
  - Two overlays visible simultaneously → `activePanel` logic broken
  - TOC flashes on load → FOUC CSS missing from layout or `toc-not-hydrated` class not added
  - IntersectionObserver not tracking → scroll container detection failed, check `findScrollContainer()` output
  - Hash deep link doesn't scroll on course pages → nested scroll container not passed as observer root
  - External page mobile sidebar missing grouped sections → lesson data not passed to ContentTopBar
- **Logging**: No permanent logs. Temporary `console.log` in `findScrollContainer()` and `setupIntersectionObserver()` during development, removed before merge.

---

## Phase 1: Extract TOC Logic into Composable

### Overview

Extract IntersectionObserver, heading tracking, hash navigation, and state management from `TOC.svelte` into a reusable Svelte 5 composable. This decouples logic from rendering, enabling `ContentTopBar.svelte` to own all rendering while reusing proven logic.

### Changes Required:

#### 1. Create `createTocManager` composable

**File**: `src/lib/tocManager.svelte.ts` (new)
**Changes**: Extract the following from `TOC.svelte`:

```ts
import { onMount, tick } from 'svelte';
import type { TocItem } from '@/types/toc';

interface TocManagerOptions {
  headings: TocItem[];
  contentSelector: string;
  storageKey: string;
  minVisibleLevel?: number;
}

export function createTocManager(options: TocManagerOptions) {
  const { headings, contentSelector, storageKey, minVisibleLevel = 2 } = options;

  // Filter headings (from TOC.svelte:43-63)
  const filteredHeadings = filterHeadingsByMinLevel(headings, minVisibleLevel);
  const visibleHeadings = filteredHeadings.length > 0 ? filteredHeadings : headings;

  // State (from TOC.svelte:66-74)
  let activeId = $state<string | null>(null);
  let expandedIds = $state(collectParentIds(visibleHeadings));
  let headingElements = $state<Map<string, Element>>(new Map());
  let isDesktopOpen = $state(false);
  let isHydrated = $state(false);

  // Observer
  let observer: IntersectionObserver | null = null;

  // Functions extracted from TOC.svelte:
  // - filterHeadingsByMinLevel (lines 43-60)
  // - collectParentIds (lines 79-90)
  // - getCurrentHashId (lines 104-110)
  // - syncHashToHistory (lines 112-117)
  // - syncActiveIdWithViewport (lines 119-143)
  // - scrollToHeading (lines 189-206)
  // - scrollToHashHeading (lines 208-213)
  // - handleLocationNavigation (lines 215-221)
  // - gatherHeadingElements (lines 290-315)
  // - setupIntersectionObserver (lines 263-285)
  // - toggleExpand (lines 351-358)
  // - handleClick (lines 363-372) — without closeMobile, that's the topbar's concern
  // - scrollActiveItemInContainer (lines 145-178)
  // - syncTocScroll (lines 180-187)

  function init() {
    // Restore desktop open state from localStorage
    const savedState = localStorage.getItem(storageKey);
    isDesktopOpen = savedState !== null ? JSON.parse(savedState) : true;

    gatherHeadingElements();
    syncActiveIdWithViewport();
    setupIntersectionObserver();
    handleLocationNavigation();
    isHydrated = true;

    document.documentElement.classList.remove('toc-not-hydrated');
    document.documentElement.classList.remove('toc-initially-closed');

    window.addEventListener('hashchange', handleLocationNavigation);
    window.addEventListener('popstate', handleLocationNavigation);
  }

  function destroy() {
    observer?.disconnect();
    window.removeEventListener('hashchange', handleLocationNavigation);
    window.removeEventListener('popstate', handleLocationNavigation);
  }

  function toggleDesktop() {
    isDesktopOpen = !isDesktopOpen;
    localStorage.setItem(storageKey, JSON.stringify(isDesktopOpen));
  }

  function handleItemClick(id: string) {
    if (scrollToHeading(id, { behavior: 'smooth', updateHistory: true })) {
      void tick().then(() => syncTocScroll(false));
    }
  }

  return {
    get visibleHeadings() { return visibleHeadings; },
    get activeId() { return activeId; },
    get expandedIds() { return expandedIds; },
    get isDesktopOpen() { return isDesktopOpen; },
    get isHydrated() { return isHydrated; },
    init,
    destroy,
    toggleDesktop,
    toggleExpand,
    handleItemClick,
    syncTocScroll,
    // Expose for binding
    setDesktopWidget: (el: HTMLElement | null) => { /* for scrollActiveItemInContainer */ },
    setMobileContainer: (el: HTMLElement | null) => { /* for scrollActiveItemInContainer */ },
  };
}
```

The actual implementation moves the function bodies from `TOC.svelte` into this module. All `$state()` runes work in `.svelte.ts` files.

#### 2. Verify composable works standalone

Before migrating any pages, write a minimal test page or smoke-test by temporarily importing the composable in the existing TOC.svelte to confirm state management and observer setup work identically.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] The composable file compiles without errors.
- [ ] Existing pages are NOT yet changed — everything still works as before.

**Implementation Note**: This phase is pure extraction. No page or component changes. Pause here and verify the composable compiles before proceeding.

---

## Phase 2: Build `ContentTopBar.svelte`

### Overview

Create the unified topbar component that renders the bar chrome, mobile overlays with mutual exclusion, desktop TOC widget, and toggle buttons. Uses `createTocManager` for TOC state/logic and `TOCTree.svelte` for section rendering.

### Changes Required:

#### 1. Create `ContentTopBar.svelte`

**File**: `src/components/ContentTopBar.svelte` (new)

**Props interface:**

```ts
interface Props {
  // Logo & navigation
  logoUrl?: string;                    // Default: '/courses'
  logoSrc: string;                     // Full-size logo image source
  logoSmallSrc: string;                // Mobile logo image source
  prevUrl?: string | null;
  nextUrl?: string | null;
  showLogo?: boolean;                  // Default: true

  // Breadcrumb (alternative to prev/next for standalone pages)
  breadcrumb?: { primary: string; secondary: string } | null;

  // Download action
  downloadUrl?: string | null;
  downloadName?: string | null;
  downloadLabel?: string;              // Default: 'Pobierz Markdown'

  // Lesson panel data (flat list — course pages)
  lessons?: Array<{ id: string; name: string }>;
  activeLessonId?: string | null;
  courseSlug?: string;
  lessonUrlPrefix?: string;            // e.g., '/courses/10xdevs-3/lesson'

  // Lesson panel data (grouped — external pages)
  sections?: Array<{ id: number; name: string }>;
  groupedLessons?: Array<{ id: number; name: string; sectionId: number }>;
  activeExternalLessonId?: number | null;
  courseId?: string;
  checklists?: Array<{ id: string; title: string }>;
  activeChecklistId?: string | null;

  // TOC / Sections panel
  headings?: TocItem[];
  tocStorageKey?: string;
  contentSelector?: string;

  // Desktop TOC widget
  showDesktopTocWidget?: boolean;      // Default: true (when headings exist)

  // Panel labels
  lessonPanelLabel?: string;           // Default: 'Lekcje'
  sectionPanelLabel?: string;          // Default: 'Sekcje'
}
```

**Component structure:**

```
ContentTopBar.svelte
├── <script>
│   ├── createTocManager() — TOC state/logic
│   ├── activePanel state — 'lessons' | 'sections' | null
│   ├── computed: hasLessons, hasSections
│   ├── togglePanel(panel) — sets activePanel with mutual exclusion
│   ├── closePanel() — sets activePanel to null
│   └── onMount → tocManager.init(), onDestroy → tocManager.destroy()
│
├── Topbar Bar
│   ├── Left zone
│   │   ├── Lesson toggle (mobile, when hasLessons)
│   │   ├── Home icon link
│   │   ├── Prev button (when prevUrl)
│   │   └── Breadcrumb (when breadcrumb, instead of home+prev)
│   ├── Center zone
│   │   └── Logo (absolute positioned, when showLogo)
│   └── Right zone
│       ├── Next button (when nextUrl)
│       ├── Download button (when downloadUrl)
│       ├── Section toggle (desktop, when hasSections)
│       └── Section toggle (mobile, when hasSections)
│
├── Mobile Overlay (when activePanel !== null)
│   ├── Backdrop button (closes panel)
│   ├── Lesson Panel (when activePanel === 'lessons')
│   │   ├── Flat list variant (when lessons prop provided)
│   │   └── Grouped variant (when sections + groupedLessons provided)
│   └── Section Panel (when activePanel === 'sections')
│       └── TOCTree (reused, same props pattern)
│
└── Desktop TOC Widget (when hasSections && tocManager.isDesktopOpen)
    ├── Sticky header with close button
    └── TOCTree
```

**Key implementation details:**

The topbar bar HTML matches the current `CourseTopBar.astro` styling:
```html
<div class="relative flex items-center justify-between gap-3 border-b border-gray-700 px-4 py-2">
```

The mobile overlay uses ONE backdrop:
```svelte
{#if isHydrated && activePanel !== null}
  <div class="fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-sm md:hidden">
    <button class="absolute inset-0" onclick={closePanel} aria-label="Zamknij" />
    <div class="relative flex h-full w-full">
      {#if activePanel === 'lessons'}
        <!-- Lesson panel from LEFT -->
        <div class="h-full w-[min(24rem,100vw)] overflow-y-auto border-r border-gray-800 bg-gray-900 shadow-2xl">
          ...
        </div>
      {:else if activePanel === 'sections'}
        <!-- Section panel from RIGHT -->
        <div class="ml-auto h-full w-[min(24rem,100vw)] overflow-y-auto border-l border-gray-800 bg-gray-900 shadow-2xl">
          ...
        </div>
      {/if}
    </div>
  </div>
{/if}
```

Lesson panel flat list rendering matches `MobileSidebar.svelte:81-101`:
- Sticky header with count + close button
- Lesson items with active blue highlight
- Index badges
- Click closes panel and navigates

Lesson panel grouped rendering matches `ExternalMobileSidebar.svelte:76-168`:
- `<details>` sections with expand/collapse
- Active section auto-expanded
- Checklists subsection with emerald accent
- Back-to-index link

The desktop TOC widget rendering matches `TOC.svelte:459-491`:
- `fixed top-4 right-4 z-30 w-72 2xl:w-80`
- Sticky header with close button
- TOCTree with same props

#### 2. Verify component renders correctly in isolation

Create a temporary test page or use Storybook-like approach to verify the component renders all variants correctly before wiring it into real pages.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] Component compiles and renders without errors.
- [ ] Mobile overlay shows only one panel at a time.
- [ ] Desktop TOC widget shows/hides correctly.
- [ ] Existing pages still work (no changes to them yet).

**Implementation Note**: This phase creates the new component but does NOT yet wire it into any pages. Pause here for review.

---

## Phase 3: Migrate Course Pages

### Overview

Replace `CourseTopBar.astro` + `MobileSidebar.svelte` (in slot) + `TOC.svelte` (in slot) with the new `ContentTopBar.svelte` on course pages.

### Changes Required:

#### 1. Update `Course.astro`

**File**: `src/components/Course.astro`
**Changes**:

Remove imports of `CourseTopBar`, `MobileSidebar`, `TOC`. Import `ContentTopBar` and logo assets.

Replace the topbar + slots section with:

```astro
---
import ContentTopBar from './ContentTopBar.svelte';
import Lesson from './Lesson.astro';
import Sidebar from './Sidebar.astro';
import logo from '../assets/images/generic/logo-white.png';
import logoSmall from '../assets/images/generic/logo-white-mobile.png';
// ... existing collection/lesson logic unchanged ...
---

<CourseLayout courseSlug={courseSlug} lessonName={activeLesson.data.name}>
  {hasToc && (
    <script is:inline>
      document.documentElement.classList.add('toc-not-hydrated');
    </script>
  )}
  <ContentTopBar
    client:load
    logoUrl="/courses"
    logoSrc={logo.src}
    logoSmallSrc={logoSmall.src}
    prevUrl={prevLessonUrl}
    nextUrl={nextLessonUrl}
    lessons={lessons.map(l => ({ id: l.id, name: l.data.name }))}
    activeLessonId={activeLesson.id}
    courseSlug={courseSlug}
    lessonUrlPrefix={`/courses/${courseSlug}/lesson`}
    headings={hasToc ? tocData.tree : []}
    tocStorageKey={storageKey}
    contentSelector=".lesson-content"
  />
  <div class='flex h-screen overflow-hidden'>
    <div class='hidden md:block min-w-[300px] border-r border-gray-700 h-full'>
      <div class='h-full overflow-y-auto'>
        <Sidebar lessons={lessons} activeLessonId={activeLesson.id} courseSlug={courseSlug} />
      </div>
    </div>
    <div class='flex-1 h-full overflow-y-auto'>
      <div class='p-4 md:p-8'>
        <Lesson content={modifiedHtml} lessonName={activeLesson.data.name} />
      </div>
    </div>
  </div>
</CourseLayout>
```

#### 2. Verify `CourseLayout.astro` FOUC CSS is sufficient

**File**: `src/layouts/CourseLayout.astro`
**Changes**: The existing FOUC CSS at lines 52-57 already covers `toc-not-hydrated`. Verify no additional classes are needed for the new component's markup. The `toc-desktop-widget`, `toc-fab-button`, `toc-toggle-mobile`, and `toc-mobile-overlay` class names in ContentTopBar must match the FOUC selectors.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] Course lesson with headings: topbar shows prev/next, logo, "Lekcje" (mobile), "Sekcje" (both). Desktop TOC widget works.
- [ ] Mobile: open "Lekcje" panel, verify lesson list appears from left. Open "Sekcje", verify sections appear from right and "Lekcje" closed.
- [ ] Course lesson without headings: no "Sekcje" toggle, no TOC widget. "Lekcje" works.
- [ ] Hash deep link `/courses/.../lesson/...#heading-id` scrolls to correct heading.
- [ ] No FOUC on page load.
- [ ] Desktop sidebar (Sidebar.astro) still works unchanged.

**Implementation Note**: After this phase, course pages use the new component. Ebook and external pages still use old components. Pause for manual testing.

---

## Phase 4: Migrate Ebook Page

### Overview

Replace the ebook page's custom inline header with `ContentTopBar.svelte`, aligning it to the full-width course topbar style.

### Changes Required:

#### 1. Update ebook page

**File**: `src/pages/10xdevs-3/ebook/index.astro`
**Changes**:

Remove the custom `<div class="bg-gray-800 text-gray-100 p-4">` header block. Import `ContentTopBar` and logo assets. Replace with:

```astro
---
import SharedLessonLayout from '@/layouts/SharedLessonLayout.astro';
import ContentTopBar from '@/components/ContentTopBar.svelte';
import logo from '@/images/generic/logo-white.png';
import logoSmall from '@/images/generic/logo-white-mobile.png';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';
import { slugify } from '@/utils/slugify';
import { Content, getHeadings } from '@/content/resources/10xdevs3-ebook.md';
import type { TocItem } from '@/types/toc';

const EBOOK_TITLE = 'Rankingi modeli AI kłamią. Kompletny przewodnik po wyborze modelu i narzędzia do kodowania z AI';

const flatHeadings: TocItem[] = getHeadings().map((heading) => ({
  id: heading.slug,
  text: heading.text,
  level: heading.depth,
  children: [],
  parentId: null,
}));
const tocData = buildCompleteToc(flatHeadings);
const slugifiedName = slugify(EBOOK_TITLE);
---

<script is:inline>
  document.documentElement.classList.add('toc-not-hydrated');
</script>

<SharedLessonLayout title={EBOOK_TITLE}>
  <ContentTopBar
    client:load
    logoUrl="/courses"
    logoSrc={logo.src}
    logoSmallSrc={logoSmall.src}
    breadcrumb={{ primary: '10xDevs 3.0', secondary: 'Ebook' }}
    headings={tocData.tree}
    tocStorageKey="10xdevs3-ebook-toc-open"
    contentSelector=".ebook-content"
    downloadUrl="/10xdevs-3/ebook/markdown"
    downloadName={slugifiedName}
    downloadLabel="Pobierz Markdown"
  />

  <div class="bg-gray-900 rounded-xl shadow max-w-7xl mx-auto">
    <article class="ebook-content prose prose-invert mx-auto max-w-[800px] space-y-8 py-6 md:py-8">
      <Content />
    </article>
  </div>
</SharedLessonLayout>
```

The ebook-specific global styles remain unchanged.

**Visual change**: The header goes from `bg-gray-800 p-4 max-w-[800px]` to full-width `bg-gray-900 border-b border-gray-700 px-4 py-2`, matching course pages exactly.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] Ebook page shows full-width topbar with breadcrumb "10xDevs 3.0 / Ebook" on the left.
- [ ] Download button and "Sekcje" toggle on the right.
- [ ] Desktop TOC widget floats over content.
- [ ] Mobile: "Sekcje" panel opens from right. No "Lekcje" toggle (no lessons).
- [ ] Hash navigation and active section tracking work.
- [ ] No FOUC.

**Implementation Note**: Pause for manual testing. Course + ebook pages should now be visually consistent.

---

## Phase 5: Migrate External Pages

### Overview

Replace `ExternalTopBar.astro` + `ExternalMobileSidebar.svelte` + floating `TOC.svelte` on external lesson and checklist pages with `ContentTopBar.svelte`. Keep the desktop sidebar (`ExternalSidebar.astro` + `ExternalSidebarToggle.svelte`) unchanged.

### Changes Required:

#### 1. Update `ExternalLessonLayout.astro` to accept TOC props and render `ContentTopBar`

**File**: `src/layouts/ExternalLessonLayout.astro`
**Changes**:

Add new optional props for TOC data:

```ts
interface Props {
  // ... existing props ...
  tocHeadings?: TocItem[];
  tocStorageKey?: string;
  contentSelector?: string;
}
```

Replace `ExternalTopBar` with `ContentTopBar`. Remove `ExternalMobileSidebar` rendering. Keep desktop sidebar and `ExternalSidebarToggle`.

```astro
---
import ContentTopBar from '@/components/ContentTopBar.svelte';
import ExternalSidebar from '@/components/external/ExternalSidebar.astro';
import ExternalSidebarToggle from '@/components/external/ExternalSidebarToggle.svelte';
import logo from '@/images/generic/logo-white.png';
import logoSmall from '@/images/generic/logo-white-mobile.png';
// ... existing imports minus ExternalTopBar and ExternalMobileSidebar ...

const {
  // ... existing props ...
  tocHeadings = [],
  tocStorageKey = 'toc-widget-open',
  contentSelector = '.prose',
}: Props = Astro.props;

const prevLessonUrl = prevLessonId ? `/external/${courseId}/${prevLessonId}` : null;
const nextLessonUrl = nextLessonId ? `/external/${courseId}/${nextLessonId}` : null;
const hasToc = tocHeadings.length > 0;
---

<!doctype html>
<html lang="en" class="sidebar-not-hydrated">
  <head>
    <!-- ... existing head content unchanged ... -->
  </head>
  <body class="bg-gray-900 overflow-y-hidden">
    {hasToc && (
      <script is:inline>
        document.documentElement.classList.add('toc-not-hydrated');
      </script>
    )}
    <div class="flex flex-col h-screen">
      <ContentTopBar
        client:load
        logoUrl={`/external/${courseId}/`}
        logoSrc={logo.src}
        logoSmallSrc={logoSmall.src}
        prevUrl={prevLessonUrl}
        nextUrl={nextLessonUrl}
        sections={sections}
        groupedLessons={lessons}
        activeExternalLessonId={activeLessonId}
        courseId={courseId}
        checklists={checklists}
        activeChecklistId={activeChecklistId}
        headings={tocHeadings}
        tocStorageKey={tocStorageKey}
        contentSelector={contentSelector}
      />

      <div class="flex flex-1 overflow-hidden">
        <!-- Desktop sidebar (unchanged) -->
        <div class="sidebar-container hidden md:block border-r border-gray-700 h-full">
          <div class="h-full overflow-y-auto">
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

        <div class="flex-1 h-full overflow-y-auto bg-gray-900">
          <slot />
        </div>
      </div>
    </div>

    <ExternalSidebarToggle client:load />

    <script>
      document.documentElement.classList.remove('sidebar-not-hydrated');
    </script>
  </body>
</html>
```

#### 2. Update external lesson page to pass TOC props to layout

**File**: `src/pages/external/[courseId]/[lessonId].astro`
**Changes**:

Remove the floating `<TOC client:load ... />` and the `toc-not-hydrated` script (now handled by layout). Pass `tocHeadings` to the layout:

```astro
<ExternalLessonLayout
  courseId={courseId}
  lessonName={lesson.data.name}
  lessons={structure.lessons}
  sections={structure.sections}
  activeLessonId={Number(lessonId)}
  prevLessonId={prevLessonId}
  nextLessonId={nextLessonId}
  checklists={checklists}
  tocHeadings={tocHeadings}
  tocStorageKey="toc-widget-open"
>
  <!-- Content without TOC script or component -->
  <div class="p-4 md:p-8">
    <div class="bg-gray-900 rounded-xl shadow max-w-7xl mx-auto">
      <div class="prose prose-invert mx-auto max-w-[800px] space-y-8 py-6 md:py-8">
        <h1 class="text-4xl font-bold">{lesson.data.name}</h1>
        <div class="not-prose">
          <MarkdownDownloadButton ... />
        </div>
        <div set:html={lesson.data.content} />
      </div>
    </div>
  </div>
</ExternalLessonLayout>
```

#### 3. Update checklist page similarly

**File**: `src/pages/external/10xdevs-2/checklists/[slug].astro`
**Changes**:

Remove the floating `<TOC client:load ... />` and `toc-not-hydrated` script. Pass `tocHeadings` to layout:

```astro
<ExternalLessonLayout
  courseId={COURSE_ID}
  lessonName={title}
  lessons={structure.lessons}
  sections={structure.sections}
  activeLessonId={0}
  prevLessonId={null}
  nextLessonId={null}
  checklists={checklists}
  activeChecklistId={entry.id}
  tocHeadings={tocData.tree}
  tocStorageKey="checklist-toc-widget-open"
>
  <!-- Content without TOC script or component -->
  <div class="p-4 md:p-8">
    ...
  </div>
</ExternalLessonLayout>
```

#### 4. Update `ExternalLessonLayout` FOUC CSS

Verify the critical CSS in `ExternalLessonLayout.astro` already covers the TOC class names used by `ContentTopBar`. The existing selectors at lines 142-147 should be sufficient. Also ensure the `toc-not-hydrated` script now runs conditionally (only when `hasToc`).

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] External lesson page: topbar shows home + prev/next + logo. Mobile "Lekcje" shows grouped sections with expand/collapse + checklists. Mobile "Sekcje" shows TOC headings.
- [ ] Checklist page: topbar shows home + logo (no prev/next since URLs are null). Mobile panels work.
- [ ] Desktop sidebar still works (collapsible, active highlighting).
- [ ] Desktop TOC widget floats correctly.
- [ ] Opening one mobile panel closes the other.
- [ ] No FOUC.

**Implementation Note**: All four page types now use ContentTopBar. Pause for comprehensive cross-page testing.

---

## Phase 6: Fix IntersectionObserver Scroll Root

### Overview

Add automatic scroll container detection to `createTocManager` so IntersectionObserver uses the correct `root` for pages with nested scroll containers.

### Changes Required:

#### 1. Add `findScrollContainer` utility

**File**: `src/lib/tocManager.svelte.ts`
**Changes**:

Add a helper function and use it in `setupIntersectionObserver()`:

```ts
function findScrollContainer(contentEl: Element): Element | null {
  let el = contentEl.parentElement;
  while (el && el !== document.documentElement) {
    const overflow = getComputedStyle(el).overflowY;
    if (overflow === 'auto' || overflow === 'scroll') return el;
    el = el.parentElement;
  }
  return null; // body scroll — use viewport
}
```

Update `setupIntersectionObserver()`:

```ts
function setupIntersectionObserver() {
  const contentEl = document.querySelector(contentSelector);
  const scrollRoot = contentEl ? findScrollContainer(contentEl) : null;

  const options = {
    root: scrollRoot,          // scroll container or viewport
    rootMargin: '0px 0px -80% 0px',
    threshold: 0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId = entry.target.id;
      }
    });
  }, options);

  headingElements.forEach((element) => {
    observer?.observe(element);
  });
}
```

#### 2. Update `syncActiveIdWithViewport` for scroll container reference frame

**File**: `src/lib/tocManager.svelte.ts`
**Changes**:

When a scroll container is detected, use its bounding rect as the reference frame instead of `window.innerHeight`:

```ts
function syncActiveIdWithViewport() {
  if (headingElements.size === 0) return;

  const contentEl = document.querySelector(contentSelector);
  const scrollRoot = contentEl ? findScrollContainer(contentEl) : null;
  const rootRect = scrollRoot?.getBoundingClientRect();
  const viewportHeight = rootRect ? rootRect.height : window.innerHeight;
  const viewportTop = rootRect ? rootRect.top : 0;
  const threshold = viewportTop + viewportHeight * 0.2;

  let bestVisibleId: string | null = null;
  let bestVisibleTop = -Infinity;
  let nearestBelowId: string | null = null;
  let nearestBelowTop = Infinity;

  headingElements.forEach((element, id) => {
    const top = element.getBoundingClientRect().top;

    if (top <= threshold && top > bestVisibleTop) {
      bestVisibleTop = top;
      bestVisibleId = id;
    }

    if (top > threshold && top < nearestBelowTop) {
      nearestBelowTop = top;
      nearestBelowId = id;
    }
  });

  activeId = bestVisibleId ?? nearestBelowId ?? Array.from(headingElements.keys())[0] ?? null;
}
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] On course pages (nested scroll container), active section tracking accurately highlights the heading in the top 20% of the content area, not the viewport.
- [ ] On ebook pages (body scroll), active section tracking works the same as before.
- [ ] On external pages (nested scroll container), active section tracking is accurate.
- [ ] Scrolling slowly through a long lesson shows smooth, predictable active heading transitions.

**Implementation Note**: This is an improvement to accuracy. Existing behavior is "good enough" so this phase has lower risk. Pause for testing.

---

## Phase 7: Cleanup

### Overview

Remove deprecated components that are no longer imported by any page or layout.

### Changes Required:

#### 1. Delete deprecated components

**Files to delete** (verify no remaining imports first):

- `src/components/CourseTopBar.astro` — replaced by ContentTopBar in Phase 3
- `src/components/MobileSidebar.svelte` — absorbed into ContentTopBar in Phase 3
- `src/components/external/ExternalTopBar.astro` — replaced by ContentTopBar in Phase 5
- `src/components/external/ExternalMobileSidebar.svelte` — absorbed into ContentTopBar in Phase 5
- `src/components/navigation/TOC.svelte` — fully absorbed into ContentTopBar + tocManager

#### 2. Verify `ChecklistTopBar.astro` usage

**File**: `src/components/checklists/ChecklistTopBar.astro`
**Changes**: Search for imports. If unused (the checklist page uses `ExternalLessonLayout` with `ExternalTopBar`, not `ChecklistTopBar`), delete it.

#### 3. Keep `TOCTree.svelte` unchanged

**File**: `src/components/navigation/TOCTree.svelte`
**Changes**: None. This pure rendering component is still used by `ContentTopBar.svelte`.

#### 4. Audit layout FOUC CSS

Verify all three layouts have consistent FOUC CSS:
- `src/layouts/CourseLayout.astro` — lines 52-57
- `src/layouts/SharedLessonLayout.astro` — lines 119-125
- `src/layouts/ExternalLessonLayout.astro` — lines 142-147

All should use identical selectors matching ContentTopBar's class names.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` (confirms no broken imports)
- [ ] `npm run test`
- [ ] `grep -r "CourseTopBar\|MobileSidebar\|ExternalTopBar\|ExternalMobileSidebar" src/` returns no hits in `.astro` or `.svelte` files

#### Manual Verification:

- [ ] All four page types render correctly after cleanup.
- [ ] No 404 errors for deleted component files in build output.

---

## Testing Strategy

### Unit Tests

- Keep existing test suites green:
  - `src/utils/extractHeadingsFromHtml.test.ts`
  - `src/utils/extractHeadingsFromHtml.integration.test.ts`
  - `src/utils/buildTocHierarchy.test.ts`
- If `findScrollContainer` is extracted as a testable utility, add a test for:
  - Element with `overflow-y: auto` ancestor → returns that ancestor
  - Element with only body as scroll context → returns null

### Integration / Build Verification

- `npm run build` after every phase
- `npm run test` after every phase

### Manual Testing Steps

1. **Course page with headings (desktop)**: Floating TOC widget on right, toggle in topbar, active section tracking while scrolling, hash navigation.
2. **Course page with headings (mobile)**: "Lekcje" toggle on left opens lesson list panel. "Sekcje" toggle on right opens TOC panel. Mutual exclusion works. Tapping lesson navigates and closes panel. Tapping TOC item scrolls and closes panel.
3. **Course page without headings**: No "Sekcje" toggle or widget. "Lekcje" works normally.
4. **Ebook page (desktop)**: Full-width topbar with breadcrumb. Download button. TOC widget.
5. **Ebook page (mobile)**: Only "Sekcje" toggle (no lessons). Panel opens from right.
6. **External lesson page (mobile)**: Grouped sections in lesson panel. Checklists section visible. TOC sections panel. Mutual exclusion.
7. **Checklist page**: Same topbar, TOC for checklist headings.
8. **Hash deep link on course page**: `/courses/.../lesson/...#heading` scrolls to correct heading after hydration.
9. **FOUC check on all pages**: No flash of unstyled TOC elements during page load.
10. **Browser back/forward after TOC clicks**: Hash changes and section scrolls are restored.

## Performance Considerations

- No new server-side processing — heading extraction remains in existing utilities.
- `ContentTopBar.svelte` replaces 2-3 separate `client:load` islands with ONE island. This reduces hydration work.
- `findScrollContainer` runs once on mount (DOM walk is negligible).
- TOCTree is conditionally rendered (`{#if}` blocks), so only the visible instance (desktop or mobile) is in the DOM.

## Migration Notes

- Migration is incremental per phase. At any point, a subset of pages uses ContentTopBar while others still use old components.
- During migration (Phases 3-5), both old and new components coexist. This is safe because they render on different pages.
- `TOCTree.svelte` is shared between old TOC.svelte and new ContentTopBar — it's never broken during migration.
- The `toc-not-hydrated` FOUC class name is unchanged, so existing layout CSS works without modification.

## References

- Research document: `thoughts/shared/research/2026-04-15-topbar-toc-alignment.md`
- Previous TOC plan: `thoughts/shared/plans/2026-04-15-toc-component-for-course-lessons.md`
- Current course topbar: `src/components/CourseTopBar.astro:1-65`
- Current course shell: `src/components/Course.astro:1-82`
- Current mobile sidebar: `src/components/MobileSidebar.svelte:1-107`
- Current TOC component: `src/components/navigation/TOC.svelte:1-562`
- Current TOC tree: `src/components/navigation/TOCTree.svelte:1-118`
- Current ebook page: `src/pages/10xdevs-3/ebook/index.astro:1-113`
- Current external topbar: `src/components/external/ExternalTopBar.astro:1-75`
- Current external mobile sidebar: `src/components/external/ExternalMobileSidebar.svelte:1-179`
- Current external layout: `src/layouts/ExternalLessonLayout.astro:1-266`
- Current external lesson page: `src/pages/external/[courseId]/[lessonId].astro:1-93`
- Current checklist page: `src/pages/external/10xdevs-2/checklists/[slug].astro:1-129`
- Current checklist topbar: `src/components/checklists/ChecklistTopBar.astro:1-49`
- Course layout: `src/layouts/CourseLayout.astro:1-77`
- Shared lesson layout: `src/layouts/SharedLessonLayout.astro:1-170`
- Heading extraction: `src/utils/extractHeadingsFromHtml.ts`
- TOC hierarchy builder: `src/utils/buildTocHierarchy.ts`
