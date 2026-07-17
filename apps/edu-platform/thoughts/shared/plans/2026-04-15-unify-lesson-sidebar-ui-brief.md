# Unify Lesson Sidebar UI/UX — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-15-unify-lesson-sidebar-ui.md`

## What & Why

Two desktop lesson sidebars (`Sidebar.astro` for regular courses, `ExternalSidebar.astro` for external courses) have diverged visually and structurally. Users navigating both course types see different background colors, active states, and features (collapse toggle only in external). We're unifying them into one shared Svelte component to make both look and behave identically — without changing the underlying data model.

## Starting Point

The mobile/topbar experience is already unified via `ContentTopBar.svelte`. The desktop sidebars are the remaining split: two separate Astro components with different styling (`bg-gray-800/95` vs `bg-gray-900`, blue ring vs blue left-border), different features (no collapse vs collapse), and different data contracts (flat `LessonEntry[]` vs grouped `LessonListItem[]` + `CourseSection[]`). Width is expressed three ways across files.

## Desired End State

Both regular and external course lessons show visually identical desktop sidebars with the same background, active state styling, and a functional collapse/expand toggle. A single `LessonSidebar.svelte` component handles both flat (regular courses) and grouped (external courses) modes. Sidebar width is controlled by one CSS custom property.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
|---|---|---|
| Visual base | ExternalSidebar style | More polished, extensible design that already handles complex cases |
| Component strategy | One shared Svelte component | Single source of truth prevents future style drift — mirrors ContentTopBar pattern |
| Collapse for regular courses | Yes, add it | Consistent UX across all course types |
| Implementation tech | Svelte 5 (not Astro) | Absorbs toggle interactivity; user preference over pure server-render |
| Toggle location | Absorbed into sidebar | Encapsulates all sidebar behavior; no sibling coordination needed |
| Sidebar width | CSS custom property `--sidebar-width` | Single source of truth; fixes the 3-representation problem |
| Nav item data | Lightweight `{id, name}` | Regular courses stop passing full HTML content to sidebar |
| Cleanup scope | TOC CSS dedup (R10) | R1-R3 already resolved; R15 fixed separately |

## Scope

**In scope:**
- New shared `LessonSidebar.svelte` with flat + grouped modes
- Shared sidebar types (`src/components/sidebar/types.ts`)
- CSS custom property for sidebar width (`src/styles/sidebar.css`)
- Integration into both `Course.astro` and `ExternalLessonLayout.astro`
- Collapse toggle for regular courses (with FOUC prevention)
- localStorage key migration (`external-sidebar-collapsed` → `sidebar-collapsed`)
- Low-risk cleanups: TOC CSS dedup (R10). R1-R3 resolved in prior work, R15 fixed separately
- Deletion of old components: `Sidebar.astro`, `ExternalSidebar.astro`, `ExternalSidebarToggle.svelte`

**Out of scope:**
- Data model changes (no section/module metadata for regular courses)
- Section grouping for regular courses (stay flat)
- Checklists for regular courses
- ContentTopBar.svelte changes (already unified)
- Auth flow or content delivery changes

## Architecture / Approach

One new `LessonSidebar.svelte` component with `mode: 'flat' | 'grouped'` prop drives both sidebar experiences. It owns its collapse state (localStorage + body class), renders the toggle button, and builds lesson/checklist URLs internally based on mode. A shared `sidebar.css` defines `--sidebar-width` and collapse transition styles. FOUC prevention stays as inline scripts in each layout (must run before hydration). The component is integrated via Astro Islands (`client:load`).

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Shared types + CSS property | Foundation: types, `sidebar.css`, storage key | None — no user-facing change |
| 2. Create `LessonSidebar.svelte` | Core component with both modes + toggle | Component correctness — template branching |
| 3. Integrate into external lessons | External courses use new sidebar | Regression in grouped navigation or collapse |
| 4. Integrate into regular courses | Regular courses get new sidebar + collapse | FOUC on regular courses (new inline script) |
| 5. Low-risk cleanups | TOC CSS dedup (R10) | Moving critical CSS to external file |
| 6. Remove old components | Clean codebase, no dead code | Missed reference to deleted file |

**Prerequisites:** None — all dependencies are within the edu-platform project.
**Estimated effort:** ~2-3 sessions across 6 phases.

## Open Risks & Assumptions

- Svelte component hydration adds a small perf cost to regular course pages (currently zero client JS for sidebar) — expected to be negligible
- localStorage key migration assumes users don't have conflicting values in both old and new keys — handled by checking new key first
- The FOUC prevention pattern is proven in ExternalLessonLayout; porting to CourseLayout follows the same pattern

## Success Criteria (Summary)

- Both `/courses/*/lesson/*` and `/external/*/` show visually identical sidebar styling
- Collapse toggle works on both course types with persisted state and no FOUC
- Old sidebar components are deleted with no remaining references
