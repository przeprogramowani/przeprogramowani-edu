# TOC Component for Regular Course Lessons Implementation Plan

## Overview

Introduce the existing TOC system into regular course lessons rendered at `/courses/[courseSlug]/lesson/[id]`, using the HTML stored in content collections as the source of headings. The change should preserve the current course layout, keep the lesson list sidebar/navigation intact, and add section navigation with deep-link support.

The final UX decisions for this plan are:

- Desktop TOC floats over the lesson view instead of reserving content width.
- Mobile supports both lesson navigation and section navigation.
- On mobile, lesson navigation stays on the left and TOC section navigation moves to the right.
- TOC should appear for one or more headings and stay hidden only when there are no headings.
- TOC open/closed state persists in `localStorage`.
- Clicking TOC items must update the URL hash, and deep links must open the correct section.

## Current State Analysis

The codebase already has almost all of the TOC infrastructure, but regular course lessons are not wired into it.

Regular course lessons currently follow this flow:

1. `src/pages/courses/[...courseSlug]/lesson/[...id].astro` authenticates and validates the lesson ID.
2. `src/components/Course.astro` loads the collection, resolves the active lesson, and renders the shell.
3. `src/components/Lesson.astro` prints the lesson title and raw HTML via `set:html`.

The missing pieces are:

- server-side heading extraction for regular course lesson HTML,
- TOC rendering in the course lesson shell,
- critical CSS / hydration guard support in `CourseLayout`,
- hash-aware navigation behavior,
- mobile control separation so the lesson menu and TOC do not collide.

### Key Discoveries:

- Regular course lessons currently render raw HTML without injected heading IDs or TOC data in `src/components/Course.astro:19-39` and `src/components/Lesson.astro:10-14`.
- The route layer for regular lessons is already thin and should stay thin; it only authenticates and delegates in `src/pages/courses/[...courseSlug]/lesson/[...id].astro:7-27`.
- The shared HTML extraction utility already parses headings and injects stable IDs into HTML in `src/utils/extractHeadingsFromHtml.ts:18-85`.
- The shared hierarchy builder already converts flat headings into the tree expected by the TOC in `src/utils/buildTocHierarchy.ts:23-107`.
- The existing TOC component already provides hydration-aware open state, active-section tracking, desktop floating UI, and a mobile overlay in `src/components/navigation/TOC.svelte:14-414`.
- Existing TOC pages explicitly add `document.documentElement.classList.add('toc-not-hydrated')` before mounting the widget in `src/pages/external/[courseId]/[lessonId].astro:56-63` and `src/pages/10xdevs-3/ebook/index.astro:24-31`.
- `CourseLayout` does not currently include the critical TOC CSS used by shared/external lesson layouts; compare `src/layouts/CourseLayout.astro:16-53` with `src/layouts/SharedLessonLayout.astro:115-146`.
- Mobile lesson navigation already occupies a fixed top-left button in `src/components/MobileSidebar.svelte:13-24`.
- The TOC mobile trigger also defaults to top-left, which would overlap immediately on course pages in `src/components/navigation/TOC.svelte:323-336`.
- TOC links currently prevent native anchor navigation and do not update or consume the browser hash in `src/components/navigation/TOCTree.svelte:50-52` and `src/components/navigation/TOC.svelte:284-292`.
- Because course lessons scroll inside an inner `overflow-y-auto` container rather than the `body`, hash deep linking cannot be left to default browser behavior alone; the scroll container is in `src/components/Course.astro:30-39`.
- The project’s reliable verification commands are `npm run build` and `npm run test` from `package.json:5-16`. There is no dedicated lint or standalone typecheck script.

## Desired End State

After implementation:

1. Regular course lessons extract headings from `activeLesson.data.content` on the server before render.
2. The HTML sent to `Lesson.astro` contains injected IDs for all extracted headings.
3. `Course.astro` renders the shared `TOC` component for regular course lessons when at least one heading exists.
4. `CourseLayout` supports the same no-FOUC TOC hydration pattern already used by shared/external lesson pages.
5. Desktop course lessons display a floating TOC widget on the right without shifting lesson content.
6. Mobile course lessons keep the lesson menu trigger on the left and expose TOC section navigation from the right.
7. TOC item clicks update the hash to `#section-id` and scroll the active section into view.
8. Loading a regular course lesson with a matching hash scrolls the nested lesson container to that heading after hydration.
9. Active-section highlighting while scrolling works the same way as the current TOC experience.
10. The TOC remains hidden when no headings are present, and visible even for a single heading.

### Verification

- A lesson with headings shows a floating TOC on desktop and a right-side section-navigation trigger on mobile.
- A lesson with no headings renders normally and shows no TOC UI.
- Reloading `/courses/<slug>/lesson/<id>#some-heading` lands on the correct section inside the lesson scroller.
- Clicking a TOC item changes the URL hash and scrolls to the matching section.
- The lesson list mobile navigation still opens from the left and remains usable.
- No TOC flash appears before hydration settles.
- `npm run build` passes.
- `npm run test` passes.

## What We're NOT Doing

- Replacing or redesigning the desktop lesson list sidebar
- Reserving horizontal content space for the TOC on desktop
- Introducing per-course TOC feature flags
- Reusing `processHtmlForDisplay()` for static course HTML
- Redesigning the TOC visuals beyond the minimal API needed for right-side mobile placement
- Updating ebook or external lesson page layouts to a new mobile placement by default
- Auto-updating the URL hash based on passive scroll position
- Adding a new analytics or logging pipeline for TOC interactions

## Implementation Approach

Wire TOC extraction into `Course.astro`, because that is where the regular lesson shell already resolves the active lesson and controls the full page composition. Keep the route handler unchanged.

Use the composable static-HTML path recommended by the research:

1. `extractHeadingsFromHtml(activeLesson.data.content)`
2. `buildCompleteToc(flatHeadings)`
3. pass `modifiedHtml` to `Lesson.astro`
4. render `<TOC client:load ... />` only when headings exist

Treat hash support and mobile left/right separation as shared-TOC concerns, not course-page hacks. The TOC component already owns click handling, hydration, and mobile rendering, so the cleanest implementation is to extend the shared TOC API with small placement and hash-navigation capabilities, then opt into those capabilities from `Course.astro`.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **SSR extraction before render**: Heading IDs must be injected on the server before `Lesson.astro` renders HTML, otherwise both deep links and TOC target lookup will fail.
- **Hydration guard ordering**: The page must add `toc-not-hydrated` before the TOC mounts, then `TOC.svelte` should continue removing that class only after it restores local state and gathers heading elements.
- **Initial hash handling**: Because lesson content scrolls inside an inner `overflow-y-auto` container, the implementation cannot rely on the browser’s default anchor restoration alone. On mount, after `gatherHeadingElements()`, TOC should inspect `window.location.hash`, resolve the matching heading, and trigger the same nested-scroll behavior used for TOC clicks.
- **`hashchange` support**: Manual hash changes and browser back/forward navigation should scroll the nested lesson container to the new heading if it exists.
- **Observer setup timing**: Initial active-section calculation must happen after headings are gathered and before hydration finishes so the widget opens in a correct highlighted state.

### User Experience Specification

- **Desktop**: TOC remains a floating widget on the right, matching the current shared behavior and not shifting lesson content.
- **Mobile left/right split**: The lesson navigation button stays fixed on the left. The TOC button must appear on the right, and its section-navigation panel should visually read as right-side navigation rather than another left-side menu.
- **No-heading lessons**: Render no TOC button, no TOC widget, and no hydration script side effects beyond harmless class toggling.
- **Single-heading lessons**: Render the TOC and allow direct linking to that one section.
- **Hash navigation**: Clicking a TOC entry should update the URL to `#heading-id` without a full page reload and without breaking smooth scroll.
- **Initial deep link**: Opening `/courses/...#heading-id` should land on the matching heading after hydration, even though the lesson body lives inside a nested scroll container.
- **Hydration quality**: Match the current external/shared TOC quality bar: no flash before hydration, correct remembered open/closed state, and active-section highlighting while scrolling.

### Performance & Optimization Strategy

- Parsing with Cheerio in `extractHeadingsFromHtml()` happens once per request and is already an accepted server-side pattern in this codebase.
- Avoid any duplicate client-side heading parsing. The client should only consume SSR-provided IDs and heading metadata.
- Continue using the existing `.prose` content selector by default; do not add expensive DOM rescans outside TOC initialization and explicit hash changes.
- Hide the TOC entirely when `tocData.tree.length === 0` so empty lessons pay no hydration cost for the widget.

### State Management Sequencing

Regular course lesson flow after implementation:

1. The lesson route authenticates and delegates to `Course.astro`.
2. `Course.astro` loads lessons, resolves `activeLesson`, and extracts headings from `activeLesson.data.content`.
3. `Course.astro` builds the TOC tree and passes `modifiedHtml` into `Lesson.astro`.
4. If headings exist, the page adds the `toc-not-hydrated` class and renders `<TOC client:load ... />`.
5. On mount, `TOC.svelte` restores open/closed state from `localStorage`, gathers DOM elements, syncs the active heading, and then handles any initial hash.
6. TOC clicks update the hash and scroll the inner lesson container.
7. Passive scrolling continues to update `activeId`, but does not rewrite the hash.

### Debug & Observability Plan

- **Verification method**: Use local browser testing against real course lessons with headings and without headings, plus direct hash URLs.
- **Local state inspection**: Confirm the chosen `storageKey` in DevTools `localStorage`; use a per-course key such as `course-${courseSlug}-toc-open`.
- **Failure signals**:
  - TOC renders but clicks do not move the lesson container: nested-scroll targeting is broken.
  - Hash changes in the URL but reload does not restore the section: initial hash handling is missing or ordered incorrectly.
  - Mobile buttons overlap: right-side placement API was not applied correctly.
  - TOC flashes on first paint: `CourseLayout` lacks the shared critical CSS or the page-level hydration class is missing.
- **Logging strategy**: No permanent new logs are required. Temporary console logging is acceptable during implementation if hash/scroll sequencing needs debugging, but should be removed before merge.

## Phase 1: Server-Side TOC Extraction and Course Page Wiring

### Overview

Add the server-side content processing path for regular course lessons and render the TOC only when headings exist.

### Changes Required:

#### 1. Process lesson HTML in `Course.astro`

**File**: `src/components/Course.astro`  
**Changes**:

- Import `TOC`, `extractHeadingsFromHtml`, and `buildCompleteToc`
- Extract headings from `activeLesson.data.content`
- Build the hierarchical TOC tree
- Compute a per-course `storageKey`
- Pass `modifiedHtml` into `Lesson.astro`
- Render the TOC only when headings exist

```astro
import TOC from '@/components/navigation/TOC.svelte';
import { extractHeadingsFromHtml } from '@/utils/extractHeadingsFromHtml';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';

const { headings: flatHeadings, modifiedHtml } = extractHeadingsFromHtml(activeLesson.data.content);
const tocData = buildCompleteToc(flatHeadings);
const storageKey = `course-${courseSlug}-toc-open`;
const hasToc = tocData.tree.length > 0;
```

Render pattern:

```astro
{hasToc && (
  <>
    <script is:inline>
      document.documentElement.classList.add('toc-not-hydrated');
    </script>
    <TOC client:load headings={tocData.tree} storageKey={storageKey} />
  </>
)}
```

#### 2. Keep `Lesson.astro` presentation-only

**File**: `src/components/Lesson.astro`  
**Changes**:

- Do not move extraction logic here.
- Keep the component responsible only for title + rendered HTML shell.
- Only make markup changes if a stable content wrapper hook is needed for TOC targeting or future manual testing.

If a hook is needed, prefer a minimal semantic wrapper:

```astro
<div class="lesson-content prose prose-invert mx-auto max-w-[800px] space-y-8 py-6 md:py-8">
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`
- [ ] `npx vitest run src/utils/extractHeadingsFromHtml.test.ts src/utils/extractHeadingsFromHtml.integration.test.ts src/utils/buildTocHierarchy.test.ts`

#### Manual Verification:

- [ ] Open a regular course lesson with multiple headings and confirm a desktop TOC appears.
- [ ] Inspect rendered HTML and confirm lesson headings contain injected `id` attributes.
- [ ] Open a lesson without headings and confirm the TOC does not render at all.

**Implementation Note**: Pause after this phase and verify that the server-side TOC data is correct before changing mobile placement or hash behavior.

---

## Phase 2: Add Course Layout Hydration Support and Hash-Aware TOC Navigation

### Overview

Bring `CourseLayout` up to the same hydration baseline as the other TOC pages, then extend the shared TOC behavior to support deep links inside nested scroll containers.

### Changes Required:

#### 1. Add critical TOC CSS to `CourseLayout.astro`

**File**: `src/layouts/CourseLayout.astro`  
**Changes**:

- Add the same minimal `toc-not-hydrated` CSS used by `SharedLessonLayout` / `ExternalLessonLayout`
- Keep the change focused on TOC hydration and icon sizing, not a full layout rewrite

Required CSS block:

```css
html.toc-not-hydrated .toc-desktop-widget,
html.toc-not-hydrated .toc-fab-button,
html.toc-not-hydrated .toc-toggle-mobile,
html.toc-not-hydrated .toc-mobile-overlay {
  display: none !important;
}
```

#### 2. Extend shared TOC behavior for nested-scroll hash navigation

**File**: `src/components/navigation/TOC.svelte`  
**Changes**:

- Extract click scrolling into a reusable helper such as `scrollToHeading(id, behavior)`
- On click, update the browser hash before or alongside smooth scroll
- On mount, read `window.location.hash` after headings are gathered and scroll to the matching heading
- Listen for `hashchange` so browser back/forward and manual hash edits work
- Keep passive scroll highlighting behavior unchanged

Target behavior:

```ts
function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth') {
  const element = headingElements.get(id);
  if (!element) return;
  history.pushState(null, '', `#${id}`);
  element.scrollIntoView({ behavior, block: 'start' });
}
```

For initial load:

```ts
const initialHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
if (initialHash && headingElements.has(initialHash)) {
  scrollToExistingHeading(initialHash, 'auto');
}
```

Implementation note: avoid recursive `hashchange` handling by separating "scroll existing heading without mutating history" from "navigate from TOC click".

#### 3. Stop suppressing hash semantics in `TOCTree.svelte`

**File**: `src/components/navigation/TOCTree.svelte`  
**Changes**:

- Keep the custom click handler, but treat links as real anchor navigation endpoints
- Preserve `href="#id"` for copy/share semantics
- Ensure the click handler delegates to the parent navigation method that now updates the hash intentionally

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] Load `/courses/<slug>/lesson/<id>#existing-heading` and confirm the lesson scroll container lands on that heading.
- [ ] Click several TOC items and confirm `window.location.hash` updates each time.
- [ ] Use browser back/forward after TOC clicks and confirm section scroll restoration works.
- [ ] Refresh the page on a hash URL and confirm the correct section remains in view.
- [ ] Confirm no TOC flash occurs during first paint.

**Implementation Note**: Complete this phase before changing mobile placement so deep-link debugging happens in a stable layout.

---

## Phase 3: Support Dual Mobile Navigation Without Control Collision

### Overview

Preserve the existing lesson-navigation menu on the left and add TOC section navigation on the right for mobile course lessons.

### Changes Required:

#### 1. Add mobile placement props to the shared TOC API

**File**: `src/components/navigation/TOC.svelte`  
**Changes**:

- Add a `mobileToggleClass` prop so consuming pages can move the mobile TOC trigger away from the default top-left position
- Add a `mobilePanelClass` or equivalent wrapper prop so the mobile section navigation can visually align to the right
- Keep defaults backward-compatible so ebook and external pages do not change unless they opt in

Example prop additions:

```ts
interface Props {
  headings: TocItem[];
  storageKey: string;
  mobileToggleClass?: string;
  mobilePanelClass?: string;
}
```

#### 2. Render course TOC with right-side mobile placement

**File**: `src/components/Course.astro`  
**Changes**:

- Pass course-specific TOC placement props so:
  - lesson navigation remains on the left via `MobileSidebar.svelte`
  - TOC trigger appears on the right
  - the mobile TOC panel reads as section navigation from the right side

Suggested usage:

```astro
<TOC
  client:load
  headings={tocData.tree}
  storageKey={storageKey}
  mobileToggleClass="md:hidden fixed top-2 right-2 z-50 p-2 rounded-lg bg-blue-900/80 text-white"
  mobilePanelClass="ml-auto h-full w-[min(24rem,100vw)] overflow-y-auto pt-16 px-4 bg-gray-900"
/>
```

#### 3. Keep `MobileSidebar.svelte` unchanged unless z-index tuning is required

**File**: `src/components/MobileSidebar.svelte`  
**Changes**:

- Reuse the existing left-side lesson navigation trigger if possible
- Only tune `z-index`, pointer behavior, or overlay layering if the right-side TOC drawer reveals a real interaction conflict

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build`
- [ ] `npm run test`

#### Manual Verification:

- [ ] On a mobile viewport, the lesson navigation button remains on the left.
- [ ] On a mobile viewport, the TOC button appears on the right.
- [ ] Opening the lesson menu still shows lesson navigation.
- [ ] Opening the TOC shows section navigation and does not block the lesson menu trigger permanently after closing.
- [ ] Both mobile navigations are usable on the same lesson without overlapping controls.

**Implementation Note**: If right-side drawer support creates too much shared-component complexity, keep the backdrop full-screen but still move the trigger and panel emphasis to the right. The left/right distinction matters more than introducing animation complexity.

---

## Testing Strategy

### Unit Tests

- Keep the existing extraction/hierarchy test suites green:
  - `src/utils/extractHeadingsFromHtml.test.ts`
  - `src/utils/extractHeadingsFromHtml.integration.test.ts`
  - `src/utils/buildTocHierarchy.test.ts`
- If hash-navigation logic is extracted into a small helper, add Vitest coverage for:
  - parsing a hash into a heading ID,
  - ignoring empty / unknown hashes,
  - avoiding history mutation during initial restore.

### Integration / Build Verification

- `npm run build`
- `npm run test`

### Manual Testing Steps

1. Open a regular course lesson with several `h2`/`h3` headings on desktop and verify the floating TOC appears on the right.
2. Click multiple TOC items and verify smooth scroll plus URL hash updates.
3. Copy a URL with `#heading-id`, reload it, and confirm the lesson container restores the correct section.
4. Open a lesson with no headings and verify no TOC trigger or widget is rendered.
5. Switch to a mobile viewport and verify the lesson menu trigger is left-aligned while the TOC trigger is right-aligned.
6. Open each mobile navigation independently and ensure both remain usable.
7. Scroll through a long lesson and confirm active-section highlighting updates as the viewport moves.

## Performance Considerations

- The only new server-side work is HTML parsing with Cheerio for the active lesson, which is already an accepted pattern elsewhere in the codebase.
- Client-side behavior should remain lightweight because the TOC consumes SSR-produced heading IDs instead of parsing the DOM for headings.
- Hash restoration should reuse the existing heading element map rather than querying the DOM repeatedly.

## Migration Notes

- No data migration is needed.
- Existing course lesson HTML files remain the source of truth.
- Existing TOC consumers should remain unchanged unless they opt into the new mobile placement props.
- Shared TOC hash handling will likely improve external lessons and ebook pages as a side effect, so smoke-test those surfaces after the shared-component changes even though they are not primary scope.

## References

- Related research: `thoughts/shared/research/2026-04-15-toc-component-for-course-lessons.md`
- Route entry: `src/pages/courses/[...courseSlug]/lesson/[...id].astro:7-27`
- Current course shell: `src/components/Course.astro:19-39`
- Current lesson renderer: `src/components/Lesson.astro:10-14`
- Existing TOC integration example: `src/pages/external/[courseId]/[lessonId].astro:56-93`
- Shared TOC component: `src/components/navigation/TOC.svelte:14-414`
- TOC tree link behavior: `src/components/navigation/TOCTree.svelte:47-101`
- Shared hydration CSS reference: `src/layouts/SharedLessonLayout.astro:115-146`
- External hydration CSS reference: `src/layouts/ExternalLessonLayout.astro:141-165`
- HTML heading extraction: `src/utils/extractHeadingsFromHtml.ts:18-85`
- TOC hierarchy builder: `src/utils/buildTocHierarchy.ts:23-107`
- Current mobile lesson navigation: `src/components/MobileSidebar.svelte:13-47`
- Verification commands: `package.json:5-16`
