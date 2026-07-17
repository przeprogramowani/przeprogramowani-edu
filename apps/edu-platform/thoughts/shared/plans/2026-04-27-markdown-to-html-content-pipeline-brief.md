# Markdown-to-HTML Content Pipeline - Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-27-markdown-to-html-content-pipeline.md`

## What & Why

We are changing `10xdevs-3` and `10xdevs-3-prework` content so Astro collections consume `.html` as the source of truth. Polish lessons remain Markdown-authored, while English `/en` lessons are produced as HTML by the translation pipeline.

## Starting Point

Today, prework collections read Markdown directly from `src/content/lessons10xDevs3Prework/{pl,en}`, and `10xdevs-3` supports mixed Markdown/HTML collection inputs. Existing Markdown rendering already works, but it happens inside collection loading rather than as a deterministic build-time generation step.

## Desired End State

Authors edit Polish Markdown in `src/content-source/...`. A generator writes committed, legacy-compatible PL/main-course `.html` into the current `src/content/...` directories, while translation-owned EN HTML is committed directly under `src/content/lessons10xDevs3Prework/en`. Astro collections load HTML only, and CI/build fails if generator-owned HTML is stale.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Markdown location | Dedicated `src/content-source/...` tree for Polish/main-course source | Separates editable source from collection-facing generated HTML. |
| English content | Translation pipeline produces `/en` HTML directly | Avoids maintaining English Markdown that the workflow will not use. |
| Generated HTML | Commit generated/translation-owned files | Translation and Astro can consume stable HTML without implicit generation. |
| Collection input | HTML only for these courses | Enforces the new source-of-truth rule. |
| Markdown renderer | Reuse existing loader rendering as generator utilities | Preserves Mermaid/raw HTML behavior already tested in the repo. |
| Metadata | Frontmatter drives generated HTML meta | Builds on current prework `lessonId`, `language`, and `order` fields. |
| Drift handling | Fail check/build on stale output | Prevents Markdown/HTML mismatch from reaching CI or production. |
| HTML shape | Legacy-compatible HTML document | Aligns with existing `htmlLessonLoader()` and historical course files. |
| Traceability | Stable generator metadata, no timestamps | Helps debug output without noisy diffs. |
| Markdown downloads | Keep HTML-to-Markdown export | Preserves current user-facing behavior with less scope. |
| Course coverage | Apply to both `10xdevs-3` and prework | Avoids another split content workflow. |
| Generated path | Current collection directories | Minimizes route and collection mapping churn. |
| Docs | Add short authoring README | Makes the new workflow discoverable for contributors. |

## Scope

**In scope:**

- Extract shared Markdown transform utilities.
- Add deterministic generate/check scripts.
- Move editable Polish lesson Markdown to `src/content-source`.
- Generate committed PL/main-course HTML into current `src/content` directories.
- Keep English prework HTML as translation-pipeline-owned content.
- Switch `10xdevs-3` and prework collections to HTML globs.
- Move prework pair validation to the authoring tree.
- Add focused tests and authoring docs.

**Out of scope:**

- Serving original authoring Markdown from download routes.
- Slug URLs.
- Translation pipeline changes beyond providing HTML files.
- Auth/access changes.
- A full lesson scaffold command.
- A separate metadata manifest.

## Architecture / Approach

The generator becomes the boundary between Polish Markdown authoring and runtime content. Markdown source files in `src/content-source` are parsed, validated, rendered with the existing Markdown pipeline, wrapped in legacy-compatible HTML, and written into `src/content`. English HTML bypasses the generator and arrives from the translation pipeline, but Astro still sees only `.html`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|------------------|----------|
| 1. Extract Markdown Rendering Utilities | Shared parser/renderer used by loader and generator | Accidental rendering behavior change |
| 2. Build Generator And Check Mode | `generate:lesson-html` and `check:lesson-html` | Stale detection or metadata contract bugs |
| 3. Migrate Authoring Content And Generate HTML | PL Markdown moved to `src/content-source`, PL HTML generated, EN HTML retained as pipeline output | Large diff and generated/translation output review |
| 4. Switch Collections To HTML Source | Astro collections consume `.html` only | Route/resolver assumptions around metadata |
| 5. Validation, Tests, And Authoring Docs | Hardened checks and README workflow | Missing contributor guidance or edge validation |

**Prerequisites:** Existing content tests should be passing before implementation starts.

**Estimated effort:** About 2-3 implementation sessions across 5 phases, with manual review after the migration and collection switch phases.

## Open Risks & Assumptions

- Translation tooling is assumed to accept legacy-compatible PL generated HTML and produce EN HTML with matching metadata.
- Generated metadata must not leak into Markdown downloads.
- Some prior tests and file names still use "Markdown" terminology; they may need renaming or comment updates.
- `10xdevs-3` currently has no real local lesson files, so the main-course path may be verified mostly through fixtures until content appears.

## Success Criteria (Summary)

- `npm run check:lesson-html` fails on stale generator-owned HTML and passes after regeneration.
- `npm run build` consumes generated HTML only for `10xdevs-3` and prework.
- Existing localized prework routes and Markdown downloads still work from the learner perspective.
