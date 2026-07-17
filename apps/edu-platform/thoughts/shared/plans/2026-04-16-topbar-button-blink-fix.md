# ContentTopBar Prev/Next Blink Fix Implementation Plan

## Overview

When navigating prev/next between lessons in a regular course (and equivalently in external courses), buttons in the topbar visibly blink and appear to be recreated every time. Two minimal changes eliminate the effect: render the currently hydration-gated Lekcje/Sekcje buttons in SSR output (kills the pop-in) and add hover/touchstart prefetch to prev/next `<a>` links (kills the whole-topbar rebuild flash by making the next page land from the browser cache).

## Current State Analysis

The platform does not use Astro view transitions. `astro.config.mjs:9-29` registers only `tailwind()` and `svelte()` integrations; a grep across `projects/edu-platform` for `ClientRouter`, `ViewTransitions`, `transition:persist`, `transition:name` returns zero matches in source code. Every prev/next click is therefore a plain full-page navigation.

`ContentTopBar.svelte` is rendered with `client:load` in all three call sites:

- `src/components/Course.astro:44-45` (regular courses)
- `src/layouts/ExternalLessonLayout.astro:185-186` (external courses)
- `src/pages/10xdevs-3/ebook/index.astro:31` (ebook — no prev/next navigation, but same component)

Inside the component:

- The Lekcje mobile/tablet button is wrapped in `{#if isHydrated && hasLessons}` at `src/components/ContentTopBar.svelte:207`.
- The Sekcje desktop and mobile buttons are wrapped in `{#if isHydrated && hasSections}` at `src/components/ContentTopBar.svelte:297` (covers both the desktop `toc-toggle-desktop` button on :299 and the mobile `toc-toggle-mobile` button on :315).
- `isHydrated` is initialized to `false` at `src/components/ContentTopBar.svelte:103` and only flips to `true` inside `onMount` at `src/components/ContentTopBar.svelte:151-152`.

Net effect per navigation: SSR paints a topbar **without** the Lekcje/Sekcje buttons; a moment later Svelte hydrates and the buttons pop into existence. This is the visible "blink/recreate" — a genuine layout change on every page load, not just a redraw.

Additional FOUC machinery exists around TOC:

- `src/components/Course.astro:40-43` and `src/layouts/ExternalLessonLayout.astro:178-182` add the `toc-not-hydrated` class on `<html>` when `hasToc` is true.
- `src/styles/sidebar.css` (lines in the TOC block — added during the previous unify-lesson-sidebar-ui plan) contains `html.toc-not-hydrated .toc-desktop-widget, html.toc-not-hydrated .toc-fab-button, html.toc-not-hydrated .toc-toggle-mobile, html.toc-not-hydrated .toc-mobile-overlay { display: none !important; }`. This means that even if we drop the Svelte `{#if isHydrated}` guard from the Sekcje mobile button, the CSS rule will still hide it until the `toc-not-hydrated` class is removed after hydration. We must remove the two `.toc-toggle-*` selectors from this rule for the SSR render to be actually visible.
- The `toc-not-hydrated` class removal is the responsibility of `createTocManager` (`src/lib/tocManager.svelte.ts`) during its `init()` step — unchanged by this plan.

The prev/next buttons themselves (`src/components/ContentTopBar.svelte:246-254` and `:274-282`) are **not** behind `isHydrated` and therefore already render in SSR. Their visible "blink" on navigation is the whole-page HTML swap: the old document is torn down, the new document is served over the network, and the browser paints a fresh DOM. On slow networks this is a noticeable gap; on fast networks it's a small flicker because the page has to be fetched before paint-hold can end. Prefetching collapses the fetch latency to ~0 and makes the swap imperceptible for the common prev/next path.

### Key Discoveries:

- `src/components/ContentTopBar.svelte:207` and `:297` — the two hydration-gated `{#if}` blocks that cause the pop-in. Both conditions are `isHydrated && <SSR-evaluable boolean>`, so dropping `isHydrated` leaves a clean SSR-renderable condition.
- `src/components/ContentTopBar.svelte:94-97` — `hasFlatLessons`, `hasGroupedLessons`, `hasLessons`, `hasSections` are all derived from props at the top of the `<script>`; they are fully evaluable during SSR.
- `src/styles/sidebar.css` — contains a `.toc-toggle-mobile` / `.toc-toggle-desktop` hide rule that must be narrowed so the SSR-rendered button is actually visible.
- `src/components/ContentTopBar.test.ts` — existing Vitest suite (added in commit `72a26ec1`) is the natural home for the new regression assertions.
- Astro 5 has built-in prefetch support (the project runs Astro `5.1.8` per `package.json`). Default strategies are `tap`, `hover`, `viewport`, `load`; enabling `prefetch: { defaultStrategy: 'hover' }` in `astro.config.mjs` plus adding `data-astro-prefetch` on specific links is the minimal, zero-dep configuration.
- No per-click analytics or scroll-position preservation logic exists on prev/next — they are pure `<a href>` links, so prefetch is a drop-in addition.
- The ebook page (`src/pages/10xdevs-3/ebook/index.astro`) uses `ContentTopBar` without prev/next URLs; the Svelte `{#if prevUrl}` / `{#if nextUrl}` guards mean the prefetch attribute is simply absent when those props are null. No special-casing needed.

## Desired End State

After this plan is complete:

1. Navigating prev → next (or next → prev) in a regular course lesson (e.g., `/courses/opanuj-frontend/lesson/01`) shows the Lekcje/Sekcje buttons from first paint of the new page — they do **not** pop in after hydration.
2. The same holds for external lessons (e.g., `/external/10xdevs-2/{lessonId}`).
3. Hovering over the prev or next button prefetches the destination page; clicking after hover is near-instantaneous (no visible topbar rebuild flash on reasonable network conditions).
4. Extended `ContentTopBar.test.ts` asserts the Lekcje and Sekcje buttons are present in the rendered output without waiting for `onMount`, catching any future regression.
5. The `toc-not-hydrated` CSS rule in `src/styles/sidebar.css` no longer covers `.toc-toggle-mobile` / `.toc-toggle-desktop`; it still applies to `.toc-desktop-widget`, `.toc-fab-button`, and `.toc-mobile-overlay` (which genuinely need JS to render meaningfully).

**Verification**: Open `/courses/opanuj-frontend/lesson/01`, DevTools → Network → throttle to "Slow 3G", click prev/next a few times, and observe that the Lekcje/Sekcje buttons are present from the very first paint of the new page — no staircase appearance. Remove throttle, hover prev/next, and the click feels instantaneous.

## What We're NOT Doing

- **NOT** enabling Astro View Transitions (`<ClientRouter />`) or `transition:persist` — user explicitly chose the SSR-render + prefetch approach over View Transitions.
- **NOT** changing `SidebarToggle.svelte`'s `{#if isHydrated}` guard — user confirmed the sidebar toggle pop-in is acceptable and out of scope.
- **NOT** SSR-rendering the desktop TOC widget (the `{#if ... tocManager.isDesktopOpen}` aside at `src/components/ContentTopBar.svelte:551`). Its position depends on `topbarHeight` measured after mount, and its open/closed state comes from localStorage inside the composable — leave it as is.
- **NOT** adding prefetch to sidebar lesson links or checklist links. Scope is prev/next only; broader prefetch is a separate bandwidth tradeoff.
- **NOT** introducing Playwright visual regression tests. The existing Vitest suite is sufficient for the changes we're making.
- **NOT** touching the `toc-not-hydrated` class lifecycle (when it's added/removed). We only narrow what the class hides.
- **NOT** modifying the `isHydrated` flag itself or its `onMount` assignment — it's still needed for behaviors we are not SSR-rendering (mobile overlay, desktop TOC widget).

## Implementation Approach

Two independent, additive changes. Phase 1 is a structural fix (remove a hydration guard + narrow a CSS rule + add a regression test). Phase 2 is a perf optimization (enable Astro prefetch and mark two links). Each phase is independently verifiable and rollback-safe — reverting either one leaves the platform in a known-good state.

Both phases together fully address the observed blink: phase 1 eliminates the **pop-in** of the gated buttons (a real layout shift that is visible even on fast networks), phase 2 eliminates the **HTML-swap flash** (perceivable mainly on slower networks or during rapid click-through). We do phase 1 first because it is the structural root cause; phase 2 is a polish pass on top.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **SSR render vs. client hydration**: After Phase 1, the Lekcje/Sekcze buttons render identically on SSR and on client hydration — there is no intended difference. The `onclick` handler (`togglePanel('lessons')` / `togglePanel('sections')`) is registered only during Svelte's `client:load` hydration pass. Between SSR paint and hydration, the button is visible but non-interactive. This is the **dead-click window**.
- **Dead-click window size**: With `client:load`, Svelte hydrates as soon as the component's JS bundle is downloaded and parsed. On a primed cache + modern device this is typically well under 200ms. On first-ever visit over a slow connection, it can reach ~500ms. Users clicking in that window get a silent no-op; there is no error state. This matches Astro's documented expectation for islands and is acceptable for a "pop-open-a-panel" interaction.
- **`onMount` still runs**: `isHydrated = true` still assigned at `src/components/ContentTopBar.svelte:151-152`. Other `{#if isHydrated && ...}` blocks (mobile overlay at :334, desktop TOC aside at :551) continue to be gated and unaffected.

### User Experience Specification

- **Lekcje button (mobile/tablet)**: Visible from first paint; icon and label unchanged. Tap pre-hydration → nothing visible happens. Tap post-hydration → panel slides in as today.
- **Sekcze button (desktop variant, `.toc-toggle-desktop`)**: Visible from first paint on desktop; hidden on mobile via existing `md:inline-flex`. Pre-hydration click → no-op. Post-hydration click → desktop TOC widget toggles as today.
- **Sekcje button (mobile variant, `.toc-toggle-mobile`)**: Visible from first paint on mobile; hidden on desktop via existing `md:hidden`. Once the CSS rule is narrowed (see Phase 1), the button is no longer hidden by the `toc-not-hydrated` class.
- **Prev/Next buttons**: No visual change. After Phase 2, hovering them triggers a background `<link rel="prefetch">` for the destination. On click, the browser uses the cached response; network tab shows `(prefetch cache)` or `(disk cache)`. Paint-hold keeps the old page visible until the new page is ready, so the topbar never appears to "empty out".
- **Prefetch behavior**: The default `hover` strategy also covers mobile touchstart (per Astro's built-in heuristics), so mobile users get the same benefit on tap.

### Performance & Optimization Strategy

- **Bandwidth cost of prefetch**: Exactly two links per page hover at most. Users who never hover prev/next don't incur the cost; users who hover once, prefetch once. No meaningful bandwidth increase for typical usage.
- **Prefetch cache lifecycle**: Astro's prefetch uses the browser's HTTP cache via `<link rel="prefetch">`. A prefetched lesson is kept until the browser evicts it (typically 5+ minutes). Subsequent clicks within that window are instant even without a fresh hover.
- **No JS size increase**: Dropping `isHydrated` from two conditions does not change the Svelte component's output size. Adding `prefetch: { defaultStrategy: 'hover' }` to Astro config enables a small runtime (~1-2KB gzipped) that Astro ships on demand when any page has a prefetch-eligible link.

### State Management Sequencing

- **Before Phase 1**: SSR paint (no buttons) → Hydration (`isHydrated = true`) → Buttons appear.
- **After Phase 1**: SSR paint (buttons present, inert) → Hydration (buttons become interactive) → No visible change.
- **Pre-hydration Lekcje/Sekcze click handling**: The `onclick` directive (Svelte 5 syntax `onclick={() => togglePanel('lessons')}`) compiles to an event-listener attachment during hydration. Before hydration, no listener exists, so the click is a no-op with no visual feedback. Intentional; matches platform norms.

### Debug & Observability Plan

- **Unit-test verification**: Add assertions in `src/components/ContentTopBar.test.ts` that, immediately after `render(...)` without waiting for effects, the Lekcje and Sekcze buttons exist in the DOM. The existing test uses `@testing-library/svelte`'s `render` helper at `src/components/ContentTopBar.test.ts:49-55` — we build on that.
- **Manual verification method**: DevTools → Network → throttle to "Slow 3G" to visually confirm no pop-in; use Performance panel to confirm a single paint rather than two. Verify prefetch in the Network tab: hover prev → new request with `Priority: Lowest` and `Initiator: prefetch`, click → served from cache.
- **No logging/metrics added**: This is a pure UX fix with no server-side effects. Adding telemetry would be premature.

---

## Phase 1: SSR-render the gated Lekcje/Sekcze buttons

### Overview

Remove the `isHydrated` portion of the two `{#if}` guards on the Lekcje and Sekcze buttons, and narrow the `toc-not-hydrated` CSS rule so the SSR-rendered mobile Sekcze button is not hidden by the class that was installed to hide the (still-gated) TOC panels.

### Changes Required:

#### 1. Remove `isHydrated` from Lekcje and Sekcze button conditions

**File**: `src/components/ContentTopBar.svelte`
**Changes**:

- Line 207: change `{#if isHydrated && hasLessons}` to `{#if hasLessons}`.
- Line 297: change `{#if isHydrated && hasSections}` to `{#if hasSections}`.

Leave all other `{#if isHydrated && ...}` guards untouched — specifically `{#if isHydrated && activePanel !== null}` at line 334 (mobile overlay) and `{#if hasSections && showDesktopTocWidget && tocManager.isHydrated && tocManager.isDesktopOpen}` at line 551 (desktop TOC aside). Those render interactive content that genuinely needs hydrated state.

#### 2. Narrow the `toc-not-hydrated` CSS rule in `sidebar.css`

**File**: `src/styles/sidebar.css`
**Changes**: Remove `html.toc-not-hydrated .toc-toggle-mobile` and `html.toc-not-hydrated .toc-toggle-desktop` (if present) from the selector list in the `display: none !important` rule. Keep the rule applying to `.toc-desktop-widget`, `.toc-fab-button`, and `.toc-mobile-overlay`.

Before (illustrative — verify exact current state by reading the file):

```css
html.toc-not-hydrated .toc-desktop-widget,
html.toc-not-hydrated .toc-fab-button,
html.toc-not-hydrated .toc-toggle-mobile,
html.toc-not-hydrated .toc-mobile-overlay {
  display: none !important;
}
```

After:

```css
html.toc-not-hydrated .toc-desktop-widget,
html.toc-not-hydrated .toc-fab-button,
html.toc-not-hydrated .toc-mobile-overlay {
  display: none !important;
}
```

Add a short comment explaining that the `.toc-toggle-mobile` / `.toc-toggle-desktop` classes are intentionally **not** hidden — the buttons render in SSR and are interactive after hydration.

#### 3. Extend `ContentTopBar.test.ts` with SSR-render assertions

**File**: `src/components/ContentTopBar.test.ts`
**Changes**: Add a new `describe` block (or extend the existing one at line 65) with assertions:

- Render ContentTopBar with `lessons: [...]`, `activeLessonId`, `lessonUrlPrefix` set and assert the Lekcje toggle button is present in the DOM synchronously after `render(...)` (no `flushSync`/`tick` await) — i.e., the button is present in the first render output.
- Render ContentTopBar with `headings: [...]` (non-empty) and assert the Sekcze desktop button (`.toc-toggle-desktop`) and mobile button (`.toc-toggle-mobile`) are both present synchronously.
- Keep a regression assertion that clicking the Lekcze button post-mount still opens the panel (covered by existing tests — verify it still passes).

Wire into existing helper `renderTopBar(props)` at `src/components/ContentTopBar.test.ts:49-55`.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` — no new errors introduced by this phase (pre-existing errors in htmlToMarkdown / vitest.config.ts remain; ContentTopBar.test.ts has the same pre-existing `sticky`/`breadcrumb` type quirk as master)
- [x] No lint errors: `npm run lint` — no lint errors in ContentTopBar.svelte / ContentTopBar.test.ts / sidebar.css (179 repo-wide errors are all pre-existing in unrelated files)
- [x] Existing tests pass: `npm run test` — 323/323 passing
- [x] New SSR-render tests pass (assertions added in this phase) — 2 new tests in the `SSR-rendered toggle buttons (no hydration gate)` describe block
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [x] Open `/courses/opanuj-frontend/lesson/01` with DevTools → Network → "Slow 3G" throttling; click next. On the first paint of the new page, the Lekcze button is already visible with no staircase.
- [x] Same test on `/external/10xdevs-2/{firstLessonId}`: Lekcze and Sekcze buttons present from first paint.
- [x] Mobile viewport (or DevTools device mode): the mobile Sekcze (`.toc-toggle-mobile`) button is present from first paint and not hidden by leftover `toc-not-hydrated` styling.
- [x] No console errors or hydration mismatch warnings in DevTools.
- [x] Clicking the Lekcze/Sekcze buttons post-hydration still opens the respective panels (no regression).
- [x] Pre-hydration clicks silently no-op (not visible to users who only click after the page settles).

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Enable hover prefetch on prev/next links

### Overview

Activate Astro's built-in prefetch with the `hover` default strategy, and mark only the two prev/next `<a>` elements in `ContentTopBar.svelte` with `data-astro-prefetch`. This makes prev → next (and next → prev) navigation feel instantaneous after a brief hover or touchstart, eliminating the perceived whole-topbar rebuild flash during the HTML swap.

### Changes Required:

#### 1. Enable Astro prefetch with hover strategy

**File**: `astro.config.mjs`
**Changes**: Add a `prefetch` config block with `defaultStrategy: 'hover'`. Explicitly leave `prefetchAll` at its default (`false`) so only opt-in links prefetch.

```js
export default defineConfig({
  integrations: [tailwind(), svelte()],
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  server: {
    port: 3000,
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
  env: {
    schema: ASTRO_ENV_SCHEMA,
  },
  vite: {
    ssr: {
      external: ['fs', 'http', 'https', 'url', 'path', 'os'],
    },
  },
  devToolbar: {
    enabled: false,
  },
});
```

#### 2. Mark prev/next links with `data-astro-prefetch`

**File**: `src/components/ContentTopBar.svelte`
**Changes**:

- Line 247-253 (prev link): add `data-astro-prefetch` attribute to the `<a>` element.
- Line 275-281 (next link): add `data-astro-prefetch` attribute to the `<a>` element.

After (prev):

```svelte
{#if prevUrl}
  <a
    href={prevUrl}
    data-astro-prefetch
    class="inline-flex h-10 items-center justify-center rounded-lg border border-blue-700/70 bg-blue-900 px-3 text-sm font-medium leading-none text-white shadow-sm transition-colors hover:border-blue-600 hover:bg-blue-700"
  >
    <span class="hidden md:inline">← Poprzednia</span>
    <span class="md:hidden">←</span>
  </a>
{/if}
```

After (next):

```svelte
{#if nextUrl}
  <a
    href={nextUrl}
    data-astro-prefetch
    class="inline-flex h-10 items-center justify-center rounded-lg border border-blue-700/70 bg-blue-900 px-3 text-sm font-medium leading-none text-white shadow-sm transition-colors hover:border-blue-600 hover:bg-blue-700"
  >
    <span class="hidden md:inline">Następna →</span>
    <span class="md:hidden">→</span>
  </a>
{/if}
```

Do **not** add `data-astro-prefetch` to other links in the component (logo, home, sidebar lesson links inside the mobile overlay, checklist links). Prefetch scope is intentionally narrow.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` — no new errors from Phase 2 (same pre-existing errors as baseline)
- [x] No lint errors: `npm run lint` — zero lint errors in ContentTopBar.svelte / astro.config.mjs
- [x] All tests pass: `npm run test` — 323/323 passing
- [x] Build succeeds: `npm run build` — clean rebuild succeeds; Cloudflare worker output intact
- [x] Built HTML for a lesson page contains the `data-astro-prefetch` attribute on prev/next anchors — `data-astro-prefetch` confirmed in both `dist/_astro/ContentTopBar.D9P-wQfE.js` (client hydration bundle) and `dist/_worker.js/chunks/ContentTopBar_*.mjs` (SSR bundle). Astro prefetch runtime (`dist/_astro/page.*.js`) is shipped.

#### Manual Verification:

- [x] Open `/courses/opanuj-frontend/lesson/02` with DevTools → Network tab, filter to "Doc". Hover over the "Następna →" button for ~200ms. A new request for the next lesson's URL appears with `Priority: Lowest` and the initiator column showing `<link rel=prefetch>` (or similar).
- [x] Click the next button. The new page loads from the prefetch cache (`Size: (prefetch cache)` or similar); observable navigation is near-instant.
- [x] Same check on `/external/10xdevs-2/{lessonId}`.
- [x] Hovering prev works equivalently.
- [x] With a cold cache, clicking without hovering still works correctly (just not as fast) — no regressions for keyboard / tap-without-hold flows.
- [x] Combined with Phase 1: navigate a handful of lessons in succession with moderate network throttling — the topbar buttons are present from first paint every time, and the perceived navigation is near-instantaneous.
- [x] No console errors; no duplicate fetches; no broken images.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before marking the plan complete.

---

## Testing Strategy

### Unit Tests:

- Extend `src/components/ContentTopBar.test.ts`: assert Lekcze button and Sekcze desktop+mobile buttons render synchronously when the corresponding props (`lessons`/`headings`) are populated. This directly guards against regressions where someone re-introduces an `isHydrated` guard.
- Keep the existing click-to-toggle-panel assertions green; they already exercise the post-hydration interactive path.

### Integration Tests:

- `npm run build` succeeds end-to-end — confirms no Astro config typo and no invalid Svelte template change.

### Manual Testing Steps:

1. `npm run dev` → open `/courses/opanuj-frontend/lesson/01`.
2. DevTools → Network → throttle to "Slow 3G". Click "Następna →". Watch the first paint of the new page — Lekcze button must be visible immediately (no pop-in).
3. Repeat on mobile viewport: the mobile-only Sekcze (`.toc-toggle-mobile`) button must also be visible from first paint.
4. Remove throttle. Hover "Następna →" for ~200ms; verify the prefetch request in the Network tab.
5. Click it; verify the navigation is near-instant and uses the prefetch cache.
6. Navigate prev/next through 4-5 lessons in quick succession — no visible topbar rebuild flashing.
7. Repeat steps 1-6 on `/external/10xdevs-2/{firstLessonId}`.
8. Ebook page `/10xdevs-3/ebook/`: verify it still renders correctly (no prev/next, but the component should be unaffected).
9. Run full test suite: `npm run test`.
10. DevTools console: no hydration mismatch warnings or errors on either page type.

## Performance Considerations

- Dropping the `isHydrated` guard does **not** increase the bundle size or hydration cost — the Svelte island still hydrates exactly as before; only its rendered output during the SSR pass changes.
- Enabling Astro prefetch adds a small runtime (~1-2KB gzipped) to pages that contain any `data-astro-prefetch` link. Only lesson pages qualify, and only two links per page opt in. Negligible cost.
- Prefetched lesson responses are cacheable by the browser for a short window (browser-default heuristic, typically 5+ min). Subsequent prev/next clicks within that window are instant even without a fresh hover.
- On Cloudflare Pages, the prefetched request hits the same edge cache as a regular request — no additional worker invocation overhead relative to a normal navigation.

## Migration Notes

- No data model changes, no storage keys, no URL schema changes. This is a pure rendering and prefetch adjustment.
- No rollback dependencies: Phase 1 and Phase 2 can each be reverted independently by undoing the listed file edits.
- Existing user sessions are unaffected — a user who was on a lesson when the change ships will see the fix on their next navigation.

## References

- Related prior plan: `thoughts/shared/plans/2026-04-15-unify-lesson-sidebar-ui.md` — established the current ContentTopBar / sidebar / toggle architecture and introduced the `toc-not-hydrated` FOUC pattern this plan narrows.
- Related prior plan: `thoughts/shared/plans/2026-04-15-topbar-toc-alignment.md` — introduced `ContentTopBar.svelte` and `createTocManager` composable.
- Key source files: `src/components/ContentTopBar.svelte`, `src/components/Course.astro`, `src/layouts/ExternalLessonLayout.astro`, `src/pages/10xdevs-3/ebook/index.astro`, `src/styles/sidebar.css`, `src/components/ContentTopBar.test.ts`, `astro.config.mjs`.
- Astro prefetch documentation: Astro 5.x `prefetch` config and the `data-astro-prefetch` directive (no `<ClientRouter />` dependency).

<!-- PLAN COMPLETED: 2026-04-16 -->
