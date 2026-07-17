---
date: 2026-04-15T18:00:00+02:00
researcher: Claude
git_commit: 34ab599b1808f79d921e82451b9e5a6bb6c4cfd6
branch: master
repository: przeprogramowani-sites
topic: "Top-level area misalignment between course pages and ebook/atomic content pages"
tags: [research, codebase, toc, topbar, layout, navigation, mobile, desktop]
status: complete
last_updated: 2026-04-15
last_updated_by: Claude
last_updated_note: "Added decisions on shared topbar, full-width, z-40 explanation, and IntersectionObserver approach"
---

# Research: Top-Level Area Misalignment Between Course and Atomic Content Pages

**Date**: 2026-04-15T18:00:00+02:00
**Researcher**: Claude
**Git Commit**: 34ab599b
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How are Course pages and "atomic content" pages (ebooks) misaligned in their top-level area, and what are all the moving pieces (desktop + mobile) that need to be considered for consistent, reliable behavior?

## Summary

Course pages and ebook pages use entirely different header/topbar structures, layouts, and scroll models. While the TOC component itself is shared and consistent, its container context diverges significantly between the two page types. The core misalignment comes from:

1. **No shared topbar component** — courses use `CourseTopBar.astro` with named slots; ebooks use a custom inline header `<div>`.
2. **Different scroll models** — courses use `overflow-y-hidden` on `<body>` with a nested scroll container; ebooks use natural body scroll.
3. **Different layout widths** — CourseTopBar stretches full-width; the ebook header constrains to `max-w-[800px]`.
4. **Different visual weight** — padding, backgrounds, and content differ between the two headers.

## Detailed Findings

### 1. Course Pages: Full Component Stack

**Route**: `/courses/[courseSlug]/lesson/[id]`
**Files**: `[...id].astro` → `Course.astro` → `CourseLayout.astro`

#### Layout (`CourseLayout.astro`)
- `<body class="bg-gray-900 overflow-y-hidden">` — body scroll disabled
- Minimal CSS, TOC FOUC prevention included
- No critical CSS inlining (relies on Tailwind stylesheet)

#### Page Shell (`Course.astro`)
```
CourseLayout
  ├── <script> toc-not-hydrated (conditional)
  ├── CourseTopBar
  │     ├── slot "mobile-start" → MobileSidebar
  │     └── slot "mobile-end"  → TOC (conditional)
  └── <div class="flex h-screen overflow-hidden">
        ├── Desktop Sidebar (hidden md:block, min-w-[300px])
        └── Content Scroller (flex-1 overflow-y-auto)
              └── Lesson.astro (max-w-[800px], .lesson-content)
```

#### TopBar (`CourseTopBar.astro`)
```
<div class="relative flex items-center justify-between gap-3 border-b border-gray-700 px-4 py-2">
  ├── Left:  [slot:mobile-start] [Home icon] [← Prev button]
  ├── Center: Logo (absolute positioned, hidden on mobile for small logo variant)
  └── Right:  [Next → button] [slot:mobile-end]
</div>
```
- **Full-width**, no max-width constraint
- **Background**: inherits `bg-gray-900` from layout
- **Padding**: `px-4 py-2` (compact)
- **Border**: `border-b border-gray-700`
- Logo is absolutely positioned center

#### TOC Placement in Course
- Desktop toggle: inline button in top bar right section via `slot="mobile-end"` with `hidden md:inline-flex`
- Mobile toggle: inline button in top bar right section with `md:hidden`
- Desktop widget: fixed overlay `top-4 right-4 z-30` — floats over content
- `showDesktopFab={false}` — no FAB, toggle is in the topbar
- `contentSelector=".lesson-content"`

#### Mobile Sidebar Placement
- Toggle: inline button in top bar left section via `slot="mobile-start"` with `md:hidden`
- Panel: full overlay from left, `z-40`

### 2. Ebook Page: Custom Inline Header

**Route**: `/10xdevs-3/ebook/`
**Files**: `index.astro` → `SharedLessonLayout.astro`

#### Layout (`SharedLessonLayout.astro`)
- `<body class="bg-gray-900 text-gray-100 min-h-screen">` — natural body scroll
- Extensive critical CSS inlining (prevents FOUC for all utility classes)
- Font preloading, self-hosted highlight CSS

#### Page Structure
```
SharedLessonLayout
  ├── <script> toc-not-hydrated
  ├── Custom Header
  │     <div class="bg-gray-800 text-gray-100 p-4">
  │       <div class="max-w-7xl mx-auto">
  │         <div class="max-w-[800px] mx-auto flex flex-wrap ...">
  │           ├── Left: Breadcrumb (10xDevs 3.0 / Ebook)
  │           └── Right: [Download MD button] [TOC toggle]
  └── Content Area
        <div class="bg-gray-900 rounded-xl shadow max-w-7xl mx-auto">
          <article class="ebook-content prose prose-invert mx-auto max-w-[800px]">
```

#### Header Differences from CourseTopBar
| Aspect | CourseTopBar | Ebook Header |
|--------|-------------|--------------|
| Component | `CourseTopBar.astro` (shared) | Inline `<div>` (page-specific) |
| Width | Full viewport width | `max-w-[800px]` centered |
| Background | Inherits `bg-gray-900` | Explicit `bg-gray-800` |
| Padding | `px-4 py-2` | `p-4` (more vertical space) |
| Border | `border-b border-gray-700` | None |
| Left content | Mobile sidebar + Home + Prev/Next | Breadcrumb text (course name / page type) |
| Center content | Logo (absolute positioned) | None |
| Right content | Next button + TOC | Download button + TOC |
| Slot system | Named slots (`mobile-start`, `mobile-end`) | Direct children |
| Logo | Yes (desktop + mobile variants) | No |
| Navigation | Prev/Next lesson buttons | None |

### 3. TOC Component Behavior Comparison

The `TOC.svelte` component is the same in both contexts but receives different props:

| Prop | Course Value | Ebook Value |
|------|-------------|-------------|
| `storageKey` | `course-${courseSlug}-toc-open` | `10xdevs3-ebook-toc-open` |
| `contentSelector` | `.lesson-content` | `.ebook-content` |
| `showDesktopFab` | `false` | `false` |
| `desktopToggleClass` | `hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/95 px-3 py-2 text-gray-100 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-700/80` | Same |
| `desktopToggleLabel` | `Sekcje` | `Sekcje` |
| `mobileToggleClass` | `inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/95 px-3 py-2 text-gray-100 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-700/80 md:hidden` | Same |
| `mobileToggleLabel` | `Sekcje` | `Sekcje` |
| `mobilePanelClass` | `ml-auto h-full w-[min(24rem,100vw)] overflow-y-auto border-l border-gray-800 bg-gray-900 shadow-2xl` | Same |

**The TOC buttons and panels are consistently styled.** The visual misalignment comes from the containers they sit in, not the TOC itself.

### 4. Scroll Model Difference (Critical)

This is the most impactful architectural difference:

**Course pages:**
- `<body>` has `overflow-y-hidden` — body never scrolls
- Content scrolls inside `<div class="flex-1 h-full overflow-y-auto">`
- IntersectionObserver uses `root: null` (viewport) but headings scroll in a nested container
- Hash-based deep linking requires manual scrolling via `element.scrollIntoView()`
- The `h-screen overflow-hidden` flex wrapper means the topbar and sidebar share viewport height with content

**Ebook pages:**
- `<body>` has `min-h-screen` — natural body scroll
- Content scrolls naturally with the document
- IntersectionObserver uses `root: null` (viewport) — works naturally since headings scroll with the page
- Hash-based deep linking works with browser's native behavior (though TOC still handles it explicitly)

**Impact**: The same TOC code behaves differently regarding scroll tracking because the scroll context differs. The IntersectionObserver's `rootMargin: '0px 0px -80% 0px'` targets the viewport, which works for ebook (body scroll) but may need adjustment for course pages (nested scroll container where the viewport includes the non-scrolling sidebar and topbar).

### 5. Z-Index Stack (Combined)

| z-index | Element | Context |
|---------|---------|---------|
| z-50 | ExternalSidebarToggle | External pages only |
| z-40 | TOC FAB button (when widget closed) | All TOC pages |
| z-40 | TOC mobile toggle | All TOC pages |
| z-40 | TOC mobile overlay | All TOC pages |
| z-40 | MobileSidebar overlay | Course pages |
| z-30 | TOC desktop widget | All TOC pages |
| z-10 | Sticky headers (TOC, Sidebar) | All pages |

**Potential conflict**: MobileSidebar overlay and TOC mobile overlay both use `z-40`. If both are open simultaneously, they'd stack unpredictably. Current code closes TOC on mobile when a link is clicked, but doesn't explicitly prevent both from being open at once.

### 6. FOUC Prevention

Both contexts use the same pattern:
1. Inline `<script>` adds `toc-not-hydrated` to `<html>`
2. Layout CSS hides `.toc-desktop-widget`, `.toc-fab-button`, `.toc-toggle-mobile`, `.toc-mobile-overlay` via `display: none !important`
3. TOC.svelte removes the class on mount after restoring localStorage state

**Difference**: `SharedLessonLayout` inlines the critical CSS in `<style>` in `<head>`, ensuring styles load before any content. `CourseLayout` uses Astro's `<style>` block (scoped), which also works but relies on Astro's CSS bundling order.

### 7. Desktop Behavior

**Course**: 
- Sidebar (300px min-width) is always visible on desktop
- TOC toggle button is in the topbar, blended with navigation controls
- TOC widget floats over content (`fixed top-4 right-4`), potentially overlapping lesson text

**Ebook**:
- No sidebar
- TOC toggle is in the header, next to download button
- TOC widget floats over content (`fixed top-4 right-4`), potentially overlapping article text
- Header is constrained to `max-w-[800px]` while TOC widget floats at viewport edge

### 8. Mobile Behavior

**Course**:
- Top bar has both MobileSidebar toggle (left) and TOC toggle (right)
- Two competing overlay systems at z-40
- MobileSidebar panel slides from left (`border-r`), TOC panel slides from right (`ml-auto border-l`)
- Both panels are `w-[min(24rem,100vw)]`

**Ebook**:
- Header only has TOC toggle (right side)
- Single overlay system
- Simpler UX — only one navigation concern

## Moving Pieces Checklist

### Shared (Must Be Consistent)
- [ ] TOC toggle button styling (currently consistent)
- [ ] TOC desktop widget position and sizing
- [ ] TOC mobile panel style and behavior
- [ ] FOUC prevention CSS in all layouts
- [ ] TOC hydration lifecycle
- [ ] Active section tracking via IntersectionObserver
- [ ] Hash navigation (push/pop/initial load)

### Course-Specific Concerns
- [ ] CourseTopBar slot system for mobile-start/mobile-end
- [ ] MobileSidebar + TOC z-index conflict resolution (both z-40)
- [ ] Nested scroll container affecting IntersectionObserver
- [ ] `overflow-y-hidden` on body requiring explicit scroll management
- [ ] Prev/Next navigation buttons alongside TOC toggle
- [ ] Logo centering with slots on both sides

### Ebook/Atomic-Content-Specific Concerns
- [ ] Custom inline header vs shared component
- [ ] `max-w-[800px]` header width vs full-width
- [ ] Natural body scroll vs nested container
- [ ] Additional action buttons (Download MD) in header
- [ ] No lesson navigation (simpler header)

### Alignment Opportunities
- [ ] Extract a shared "content page header" component that both CourseTopBar and ebook headers could use
- [ ] Standardize background color (bg-gray-800 vs bg-gray-900)
- [ ] Standardize padding (py-2 vs p-4)
- [ ] Decide on max-width constraint (full-width vs content-width)
- [ ] Unify slot/insertion mechanism for action buttons

## Architecture Insights

1. **The TOC component is well-factored** — it's the same across all pages with props controlling placement. The misalignment is entirely in the container/layout layer.

2. **CourseTopBar is course-specific** — it assumes prev/next navigation and logo. Ebook pages don't need these, so they built a custom header. This is the root of divergence.

3. **The scroll model difference is fundamental** — course pages' nested scroll container creates a different behavior context for IntersectionObserver, hash navigation, and scroll-to-heading. Any alignment work must respect this architectural difference.

4. **Two overlay systems at z-40** — on course pages, MobileSidebar and TOC mobile overlay can theoretically be open simultaneously. Coordination or mutual exclusion would prevent z-fighting.

## Historical Context

- `thoughts/shared/plans/2026-04-15-toc-component-for-course-lessons.md` — Phase 1 (extraction + wiring) appears implemented in current Course.astro. Phases 2-3 (hash navigation, mobile separation) defined but execution status unclear from code alone.
- `thoughts/shared/research/2026-04-15-toc-component-for-course-lessons.md` — Original research confirming the extraction pipeline works for static HTML collections.

## Resolved Questions

### 1. Shared topbar component — YES

**Decision:** Create one shared topbar component with common patterns that both course pages and ebook/atomic content pages use.

**Rationale:** CourseTopBar and the ebook's inline header share the same structural intent (full-width bar, left/right action zones, dark theme) but diverged because CourseTopBar was course-specific. A shared component with slots eliminates the duplication and ensures visual consistency.

**Design direction:**
- The shared topbar should be an Astro component with named slots for left, center, and right content zones
- Course pages fill left with MobileSidebar + Home + Prev/Next, center with logo, right with TOC
- Ebook pages fill left with breadcrumb, right with Download + TOC
- Slots that receive no content should collapse gracefully (no empty space)

### 2. Full-width topbar — YES

**Decision:** The topbar should be full viewport width, not constrained to `max-w-[800px]`.

**Rationale:** Full-width topbar creates a clear visual boundary at the top of every content page. Content below can still be constrained to `max-w-[800px]` — but the navigation bar itself should span the full viewport.

**Impact:** The ebook page's current header (`max-w-[800px] mx-auto`) needs to change to full-width, matching CourseTopBar's current behavior.

### 3. z-40 mobile overlay conflict — MUTUAL EXCLUSION

**The problem explained:**

On course pages (mobile), two independent Svelte components each render a full-screen overlay at the same z-index:

```
MobileSidebar.svelte:
  <div class="fixed inset-0 z-40 bg-gray-950/70 ...">   ← backdrop
    <div class="... w-[min(24rem,100vw)] border-r ...">  ← panel from LEFT

TOC.svelte:
  <div class="fixed inset-0 z-40 bg-gray-950/70 ...">   ← backdrop
    <div class="ml-auto ... w-[min(24rem,100vw)] border-l ..."> ← panel from RIGHT
```

Both backdrops cover the entire screen. Both panels are ~384px wide. Since nothing coordinates their open/closed state, a user could theoretically open both simultaneously. The result: two stacked semi-transparent backdrops (making the screen very dark), two panels visible, and clicking the backdrop of one might not reach the other's close button.

On ebook pages this isn't an issue — there's no MobileSidebar, only the TOC overlay.

**Root cause analysis:**

The problem isn't that two overlays have the same z-index — it's that two independent Astro islands each own their own overlay. `MobileSidebar.svelte` and `TOC.svelte` are separate `client:load` hydration boundaries with independent state. Any coordination between them (events, stores, shared signals) is a patch on a structurally broken ownership model.

**Root-cause fix — one island, one overlay, one state:**

Merge the mobile overlay concern into a single Svelte component (the shared topbar). One component manages one state variable — `activePanel: 'lessons' | 'sections' | null` — renders one backdrop, and conditionally shows the appropriate panel.

```
Current architecture (two islands, two overlays):
  CourseTopBar.astro (static)
    ├── MobileSidebar.svelte (client:load) → own isMobileOpen + own backdrop + own panel
    └── TOC.svelte (client:load)           → own isMobileOpen + own backdrop + own panel

Root fix (one island, one overlay):
  ContentTopBar.svelte (client:load)
    ├── state: activePanel = null | 'lessons' | 'sections'
    ├── ONE backdrop div (when activePanel !== null)
    ├── Lessons panel (when activePanel === 'lessons')
    └── Sections panel (when activePanel === 'sections')
```

This eliminates the coordination problem entirely. No event bus, no shared store, no custom events — just one component with one reactive state variable. Opening "lessons" automatically means "sections" is not open, because it's one value.

**This also decides the open question:** the shared topbar must be a Svelte component (not Astro), because it needs to own interactive overlay state. The static parts (logo, prev/next links, breadcrumbs) are props or snippets; the interactive parts (toggles, overlays, panels) live in one reactive tree.

**Ebook pages** where there's no lesson list simply pass no lesson data — the component renders only the sections toggle/panel. Same component, same overlay system, zero coordination needed.

**Desktop behavior** is unaffected — the TOC desktop widget (`fixed top-4 right-4 z-30`) remains a separate floating element managed by the same topbar component, but it doesn't compete with any other overlay.

### 4. IntersectionObserver scroll root — USE `contentSelector` CONTAINER

**The problem:**

The `IntersectionObserver` in `TOC.svelte:263-285` uses `root: null` (the viewport). This works when content scrolls with the body (ebook pages). On course pages, content scrolls inside a nested `<div class="flex-1 h-full overflow-y-auto">` while the body has `overflow-y-hidden`.

With `root: null`, the observer still fires because elements move relative to the viewport when the inner container scrolls. However, the `rootMargin: '0px 0px -80% 0px'` (active zone = top 20% of viewport) includes the topbar area (~48px) that isn't part of the scrollable content. This means:
- A heading right at the top of the visible content area is actually ~5-8% below the true viewport top
- The 20% zone is slightly misaligned with what the user perceives as "the top of content"
- The fallback `syncActiveIdWithViewport()` function at `TOC.svelte:119-143` uses `getBoundingClientRect().top` which IS viewport-relative, so it has the same subtle offset

In practice this works "well enough" because 20% is generous, but it's architecturally incorrect.

**Recommended approach — pass the scroll container as `root`:**

The clean web dev pattern is to set `IntersectionObserver.root` to the actual scroll container when content doesn't scroll with the body. This is exactly what the `root` option exists for.

The TOC component already accepts `contentSelector` (e.g., `.lesson-content`). The approach:

1. **Resolve the scroll container** — walk up from `document.querySelector(contentSelector)` to find the nearest ancestor with `overflow-y: auto` or `overflow-y: scroll`. This is the actual scroll root.
2. **Pass it as `root`** to `IntersectionObserver`. Now `rootMargin` percentages are relative to the scroll container, not the viewport.
3. **Adjust `syncActiveIdWithViewport()`** — use the scroll container's `getBoundingClientRect()` as the reference frame instead of `window.innerHeight`.
4. **Fallback** — if no scrollable ancestor is found (ebook/body-scroll pages), keep `root: null`.

**Implementation sketch:**

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

Then in `setupIntersectionObserver()`:

```ts
const contentEl = document.querySelector(contentSelector);
const scrollRoot = contentEl ? findScrollContainer(contentEl) : null;

const options = {
  root: scrollRoot,  // scroll container or viewport
  rootMargin: '0px 0px -80% 0px',
  threshold: 0,
};
```

This is the standard pattern recommended by the [IntersectionObserver spec](https://w3c.github.io/IntersectionObserver/#intersection-observer-init) — use `root` for non-viewport scroll containers. It requires no changes to the component API; the existing `contentSelector` prop provides enough information.

## Open Questions

1. **Should existing external lesson pages and checklist pages also adopt the shared topbar?** They currently have their own topbar components (`ExternalTopBar.astro`, `ChecklistTopBar.astro`).
2. **Should the scroll container detection be automatic (walk the DOM) or explicit (new prop)?** Automatic is cleaner but slightly fragile if CSS changes. A `scrollContainerSelector` prop is explicit but adds API surface.
3. **How much of TOC.svelte's current logic moves into the shared topbar vs stays separate?** The desktop widget, IntersectionObserver, heading tracking, and scroll-to-heading are TOC concerns. The mobile toggle/overlay/panel are topbar concerns. The boundary needs careful definition — likely the topbar owns the mobile shell (backdrop + panel container) while TOC still owns its content (tree rendering, active tracking, desktop widget).
