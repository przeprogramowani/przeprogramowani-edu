# External Prework Lesson Shell Localization — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-27-external-prework-lesson-shell-localization.md`

## What & Why

Localize the visible shell around external prework lessons so `/pl` stays Polish and `/en` becomes English. The lesson content is already selected by language; this plan fixes the topbar, sidebar, Markdown button, and document language around that content.

## Starting Point

`src/pages/external/[courseId]/[lang]/[lessonId].astro` already validates `lang` and loads the correct prework lesson collection. The shell around the lesson is shared through `ExternalLessonLayout.astro`, `ContentTopBar.svelte`, `LessonSidebar.svelte`, and `SidebarToggle.svelte`, where many visible labels are currently hard-coded in Polish.

## Desired End State

`/external/10xdevs-3-prework/pl/[lessonId]` renders Polish shell labels and `<html lang="pl">`. `/external/10xdevs-3-prework/en/[lessonId]` renders standard English product labels such as `Download Markdown`, `Previous`, `Next`, `Lessons`, `Sections`, and `Table of contents`, with `<html lang="en">`. Existing non-language external routes keep Polish defaults.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Shell scope | Visible labels only | This matches the request and avoids broad accessibility/copy churn. |
| Existing external routes | Keep Polish defaults | Current non-language external courses are Polish-first and should not regress. |
| English wording | Standard product English | Labels are conventional and clear without extra editorial work. |
| Count labels | Basic singular/plural | Good enough for this route without introducing a full pluralization system. |
| Document language | Set `<html lang>` from route language | Small correctness win explicitly selected during planning. |
| Copy location | Shared typed helper | Keeps the route clean and creates a reusable source of truth. |
| Reuse boundary | Optional layout-level shell copy | Makes the layout the single shell boundary while preserving existing callers. |
| Tests | Component tests + build confidence | Covers the risky shared components without heavy authenticated e2e setup. |

## Scope

**In scope:**

- Add a typed `pl | en` external lesson shell copy helper.
- Pass optional shell copy through `ExternalLessonLayout`.
- Localize visible labels in `ContentTopBar`, `LessonSidebar`, `SidebarToggle`, and the Markdown download button for the localized prework lesson route.
- Set `<html lang="pl">` or `<html lang="en">` for that route.
- Add/update focused Vitest tests and run build verification.

**Out of scope:**

- Full i18n framework.
- Localizing lesson content, lesson titles, or section names.
- Changing existing `/external/[courseId]/[lessonId]` Polish defaults.
- Playwright/e2e tests behind external auth.
- Markdown export content changes.

## Architecture / Approach

Use a small static copy helper as the source of truth. The localized route selects copy by `lang`, passes it to `ExternalLessonLayout`, and the layout forwards JSON-serializable label props to the Svelte shell islands. All new props are optional and default to Polish, so existing external pages keep their current behavior.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Define Shell Copy Contract | Typed Polish/English copy and basic count strings | Accidentally passing non-serializable functions into Svelte islands |
| 2. Wire Copy Through Layout And Components | Localized topbar, sidebar, toggle, Markdown button, and `<html lang>` | Missing a hard-coded visible label in shared components |
| 3. Verify With Focused Tests | Vitest coverage for English labels and Polish defaults | Tests becoming too coupled to component internals |

**Prerequisites:** Access to run `npm run test` and `npm run build`; authenticated manual access for checking external lesson pages.

**Estimated effort:** ~1 focused implementation session across 3 phases.

## Open Risks & Assumptions

- The plan assumes “visible labels only” still permits localizing the control text that appears as desktop labels and titles, while not expanding into every aria-only string.
- Astro/Svelte island props must remain JSON-serializable; copy functions should not be passed directly to hydrated Svelte components.
- Existing Polish defaults are intentional for all non-language external routes.

## Success Criteria (Summary)

- `/pl` prework lesson shell remains Polish and `/en` prework lesson shell is English.
- Existing non-language external lessons still render Polish shell labels by default.
- `npm run test` and `npm run build` pass after the implementation.
