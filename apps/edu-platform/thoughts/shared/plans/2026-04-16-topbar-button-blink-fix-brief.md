# ContentTopBar Prev/Next Blink Fix — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-16-topbar-button-blink-fix.md`

## What & Why

Prev/next navigation in lesson pages makes the topbar buttons visibly blink and "get recreated" every time. Two minimal changes remove both causes: the Lekcze/Sekcze buttons pop in because they are hydration-gated (fix: render them in SSR) and the whole topbar momentarily teardown/rebuild on each HTML swap (fix: hover-prefetch prev/next so the next page is already cached on click).

## Starting Point

`ContentTopBar.svelte` is rendered with `client:load` in regular courses (`Course.astro:44`), external courses (`ExternalLessonLayout.astro:185`), and the ebook page (`10xdevs-3/ebook/index.astro:31`). The Lekcze button at `ContentTopBar.svelte:207` and the Sekcze buttons at `:297` are wrapped in `{#if isHydrated && ...}`; `isHydrated` flips to `true` only in `onMount`. The project does **not** use Astro view transitions, and prev/next are plain `<a href>` full-page navigations.

## Desired End State

Navigating prev/next in any lesson page shows all topbar buttons (Lekcze, Sekcze, prev/next) from the very first paint of the new page — no visible pop-in. With hover prefetch on prev/next, the whole navigation feels effectively instantaneous, so the HTML swap itself is imperceptible.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| --- | --- | --- |
| Mitigation strategy | SSR-render gated buttons + hover prefetch | Avoids the complexity of Astro View Transitions (client router, persist-props semantics, Svelte 5 island reactivity caveats) while still fully addressing the observed blink. |
| SSR-render scope | Only the topbar Lekcze + Sekcze buttons | Directly targets the most visible pop-in; SidebarToggle and the desktop TOC widget were considered and explicitly left as-is. |
| Prefetch strategy | `defaultStrategy: 'hover'` + `data-astro-prefetch` on prev/next only | Instant feel on the common nav path with negligible bandwidth; avoids prefetching every sidebar link. |
| FOUC CSS handling | Remove `.toc-toggle-mobile` / `.toc-toggle-desktop` from the `html.toc-not-hydrated` display-none rule | Prevents the CSS rule from hiding the now-SSR-rendered mobile Sekcze button; keeps the rule covering the genuinely-dynamic desktop widget and mobile overlay. |
| Testing rigor | Extend `ContentTopBar.test.ts` + manual device check (no Playwright) | Vitest can assert SSR render deterministically; visual regression infra doesn't exist in the project and isn't worth adding for this scope. |

## Scope

**In scope:**
- `src/components/ContentTopBar.svelte`: drop `isHydrated &&` from two `{#if}` guards (lines 207 and 297); add `data-astro-prefetch` to the two prev/next `<a>` tags.
- `src/styles/sidebar.css`: narrow the `toc-not-hydrated` rule.
- `astro.config.mjs`: add `prefetch: { defaultStrategy: 'hover' }`.
- `src/components/ContentTopBar.test.ts`: new SSR-render assertions for Lekcze and Sekcze buttons.

**Out of scope:**
- Enabling Astro View Transitions / `<ClientRouter />` / `transition:persist`.
- Changes to `SidebarToggle.svelte` (pop-in acceptable; explicitly rejected).
- SSR rendering the desktop TOC widget or its mobile overlay.
- Prefetch on sidebar lesson links, logo/home, or checklist links.
- Playwright / visual regression testing.

## Architecture / Approach

Two small, independent edits on the existing stack — no new dependencies, no new components, no routing changes. Phase 1 is a 3-file structural change (Svelte template, CSS, test). Phase 2 is a 2-file perf optimization (Astro config + two attribute additions). Each phase is independently verifiable and rollback-safe.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. SSR-render gated buttons | Lekcze/Sekcze buttons present from first paint on every navigation; extended test coverage | Pre-hydration click on these buttons is a dead click (~100–300ms on client:load); documented as intentional. |
| 2. Hover prefetch on prev/next | Prev/next navigation feels instantaneous; topbar rebuild flash disappears in practice | Minor bandwidth cost (2 fetches per hover); mitigated by hover strategy, not viewport/load. |

**Prerequisites:** None beyond the current codebase — Astro 5.1.8 has built-in prefetch without needing `<ClientRouter />`.

**Estimated effort:** ~1 focused session for both phases including tests and manual device verification.

## Open Risks & Assumptions

- Assumption: Svelte `onclick` handlers on SSR-rendered elements attach cleanly during `client:load` hydration without duplication or mismatch warnings. Verified against existing SSR-rendered prev/next handlers in the same component.
- Risk (low): a future contributor adds a new topbar button and reinstates the `isHydrated` guard — mitigated by the new Vitest regression assertions.
- Risk (low): Astro's hover prefetch interacting with Cloudflare cache rules on lesson content — no specific headers touch lesson pages today, so default behavior should be fine; verify in the manual prefetch check.

## Success Criteria (Summary)

- Lekcze and Sekcze buttons visible from first paint on every prev/next navigation (regular + external courses, mobile + desktop).
- Hovering prev/next for ~200ms followed by a click produces a near-instant navigation served from the prefetch cache.
- Existing tests and build continue to pass; new Vitest assertions lock in the SSR-render behavior.
