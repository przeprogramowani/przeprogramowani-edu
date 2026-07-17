# HTML Support and Shared External Rendering Shell — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-27-html-and-shared-external-rendering-shell.md`

## What & Why

We are extending the external lesson rendering model without rebuilding Markdown support that already exists. Commit `875999e1` added the local Markdown loader/resolver for bilingual prework and `10xdevs-3`; this plan preserves that baseline, adds `10xdevs-3` local HTML support, and moves localized prework lessons onto the shared external shell.

## Starting Point

`10xdevs-3` already resolves local Markdown before Circle through `src/server/content/externalMarkdownContent.ts`, but `src/content/lessons10xDevs3/` currently has no real local lesson files and the loader scans only `*.md`. Localized prework lessons render from Markdown, but `/external/10xdevs-3-prework/{pl|en}/{lessonId}` uses a custom lightweight layout instead of `ExternalLessonLayout`.

## Desired End State

`10xdevs-3` can render local `.md` and `.html` lessons through the existing external route, with Circle fallback preserved. Localized prework lesson pages use the same sidebar, topbar, TOC, and `Pobierz Markdown` action as 10xDevs 2 external lessons, while `/pl` and `/en` language indexes remain available.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Markdown baseline | Preserve `875999e1` behavior | The renderer/resolver support already exists and focused tests pass today. |
| Localized prework shell | Use full `ExternalLessonLayout` | This directly fixes the route-level shell mismatch. |
| Localized links | Pass serializable lesson URL prefixes | This matches existing Svelte island constraints and avoids scattered route exceptions. |
| Duplicate local IDs | Fail loudly | Duplicate `.md`/`.html` lesson IDs should not silently pick a source. |
| HTML export | Convert via `htmlToMarkdown()` | This matches current external Markdown export behavior. |
| Missing `10xdevs-3` local content | Local first, Circle fallback | This preserves current resolver semantics. |
| Prework export auth | Same auth as lesson pages | Prework lessons are protected content. |
| Prework indexes | Preserve `/pl` and `/en`, lightly improve root | Current language indexes already work and should not be replaced. |
| HTML metadata | Legacy filename/meta parsing | Existing HTML collections use first two filename chars and `<meta name="lesson-id">`. |
| Verification | Focused tests plus manual browser smoke | The repo has no Astro e2e harness, so build plus targeted tests is the practical path. |

## Scope

**In scope:**

- Preserve existing local Markdown resolver behavior from `875999e1`.
- Add mixed `.md`/`.html` local loading for `10xdevs-3`.
- Reject duplicate local lesson IDs across Markdown and HTML.
- Add route-prefix support to the shared external shell, topbar, and sidebar.
- Move localized prework lesson pages onto `ExternalLessonLayout`.
- Add authenticated localized prework Markdown export routes.
- Preserve 10xDevs 2 and Circle fallback behavior.

**Out of scope:**

- Rebuilding Markdown rendering from scratch.
- Slug URLs.
- New HTML metadata manifests.
- New e2e test framework.
- Public prework exports.
- Full external index redesign.

## Architecture / Approach

Keep `getExternalCourseLessonContent()` as the route-facing content boundary. Behind it, extend the local `10xdevs-3` source from Markdown-only to mixed Markdown/HTML, then let routes render the same normalized lesson shape through `ExternalLessonLayout`. For localized prework, pass `/external/10xdevs-3-prework/{lang}` as the lesson URL prefix so hydrated navigation links stay in the active language.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|------------------|----------|
| 1. Preserve Baseline | Locks in existing Markdown resolver behavior from `875999e1` | Accidentally reframing existing support as new work. |
| 2. Mixed Local HTML | Adds `.html` support for `10xdevs-3` with duplicate rejection | Loader/source typing churn. |
| 3. Route-Aware Shell Links | Lets shared shell build localized lesson links | Breaking 10xDevs 2 links if defaults are wrong. |
| 4. Prework Shared Shell | Renders PL/EN prework lessons in `ExternalLessonLayout` | Sidebar/topbar links leaving the active language. |
| 5. Localized Export | Adds protected `/pl/{id}/markdown` and `/en/{id}/markdown` | Auth redirect or filename/header mistakes. |
| 6. Regression Verification | Preserves indexes and verifies 10xDevs 2, 3, and prework flows | Missing a manual shell regression. |

**Prerequisites:** Existing `875999e1` implementation is present; current focused content/url tests pass.
**Estimated effort:** ~2-3 implementation sessions across 6 phases.

## Open Risks & Assumptions

- `src/content/lessons10xDevs3/` currently has no real `.md` or `.html` lesson files, so local HTML rendering may need a temporary fixture for manual verification.
- Astro route behavior is mostly verified through `npm run build` and manual smoke testing, not a dedicated e2e harness.
- Localized prework exports should convert rendered HTML back to Markdown, not read raw Markdown files directly.

## Success Criteria (Summary)

- `10xdevs-3` renders local Markdown and HTML before falling back to Circle.
- `10xdevs-3-prework` PL/EN lessons use the full external shell with language-correct navigation and Markdown download.
- Existing 10xDevs 2 lesson rendering and Markdown export remain unchanged.
