# Light Theme - Plan Brief

> Full plan: `context/changes/light-theme/plan.md`

## What & Why

Add a selectable light theme to the lesson reading shell while keeping dark mode as the default. The goal is not to reskin the whole platform at once; it is to make regular and external lesson reading comfortable in light mode, with a per-device preference that survives reloads.

## Starting Point

The lesson shell currently hard-codes dark Tailwind classes across Astro layouts, Svelte topbar/sidebar components, prose containers, TOC widgets, progress controls, and markdown download buttons. The same shell components serve both regular course lessons and external lessons, but there is no shared theme contract or light-compatible syntax highlighting.

## Desired End State

Regular and external lessons open in dark mode by default. A topbar icon button switches the shell to light mode and stores that choice in `localStorage`; the stored theme is applied before page paint on future loads. The shell, sidebar, TOC, prose, code blocks, progress controls, markdown button, and logo variant all read as one coherent theme.

## Key Decisions Made

| Decision | Choice | Why |
| --- | --- | --- |
| Scope | Regular and external lesson reading shell only | Delivers the learner-facing value without dragging in games, auth, course list, ebook, or checklist surfaces. |
| Default mode | Dark remains default | Preserves current behavior for every existing user until they explicitly choose light. |
| Persistence | Per-device `localStorage` | Matches existing sidebar/TOC preference patterns and avoids server-side profile work. |
| Toggle placement | Topbar icon button | The topbar is shared by regular and external lesson shells and remains reachable on mobile. |
| Theme implementation | Semantic CSS variables/classes first | Avoids one-off color replacements and keeps a future full theme system realistic. |
| First paint | Inline pre-paint script in lesson layouts | Prevents a dark/light flash for users with a stored light preference. |
| Code blocks | Light-compatible code styling in phase 1 | Code-heavy lessons must feel finished in light mode, not half-themed. |
| Logo assets | Stable dark-logo placeholders | The implementation can wire paths now; final image contents can be recreated under the same filenames. |

## Scope

**In scope:**

- Regular lesson shell under `Course.astro` / `CourseLayout.astro`
- External lesson shell under `ExternalLessonLayout.astro`
- External lesson route wrappers for `/external/[courseId]/[lessonId]` and `/external/[courseId]/[lang]/[lessonId]`
- Shared topbar, sidebar, TOC, progress toggle, markdown download button, prose, and code block styling
- `localStorage`-based theme persistence and pre-paint application
- `logo-dark.png` and `logo-dark-mobile.png` placeholders

**Out of scope:**

- Login/signup, course list, profile, shared lessons, checklists, ebook, Space Explorers, Mission Log, badges, and error pages
- System preference mode
- Server-side theme persistence
- Rewriting generated lesson HTML
- Final dark-logo artwork

## Architecture / Approach

Add a lesson-scoped theme layer: `src/lib/lessonTheme.ts` owns the storage/attribute contract, `src/styles/lesson-theme.css` owns CSS variables and semantic classes, `CourseLayout` and `ExternalLessonLayout` apply the stored theme before paint, and `LessonThemeToggle.svelte` lets the user switch themes from `ContentTopBar`. Then migrate only the lesson-shell components from hard-coded dark classes to semantic theme classes.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Theme Foundation | Theme helper, CSS variables/classes, light code styling, stylesheet imports, logo placeholders | Under-specified semantic classes could cause churn during component migration. |
| 2. Top-Bar Toggle and Persistence | Toggle component, topbar opt-in, regular/external shell wiring, pre-paint scripts | FOUC or storage mismatch if layout script and toggle do not share one contract. |
| 3. Migrate Lesson-Shell Components | Topbar, sidebar, TOC, prose, progress, markdown button, and logo variants use semantic classes | Missed hard-coded dark classes could make light mode look unfinished. |
| 4. Verification and Cleanup | Scoped color audit, browser checks, final build/check/test pass | Visual regressions are more likely on mobile panels and code-heavy lessons. |

**Prerequisites:** The user should replace or approve `logo-dark.png` and `logo-dark-mobile.png` before final visual acceptance.

**Estimated effort:** Two to three focused implementation sessions across four phases, plus browser QA on regular and external lesson routes.

## Open Risks & Assumptions

- The plan assumes `ContentTopBar` remains the shared control surface for all scoped lesson routes.
- The existing dark Highlight.js stylesheet can stay loaded if light-mode CSS overrides are sufficient; if not, implementation may swap to a dual-theme stylesheet while preserving the same visual contract.
- Placeholder dark-logo assets must be valid image files for the Astro asset pipeline, even if their contents are temporary.
- Shared lesson and checklist pages remain dark by design; they may look inconsistent if users move directly between them and a light lesson shell.

## Success Criteria (Summary)

- A clean browser opens regular and external lessons in dark mode.
- Switching to light mode updates the shell immediately, persists per device, and survives reload without a visible theme flash.
- Topbar, sidebar, TOC, prose, code blocks, progress controls, markdown button, and logo variant are readable and coherent in both themes.
