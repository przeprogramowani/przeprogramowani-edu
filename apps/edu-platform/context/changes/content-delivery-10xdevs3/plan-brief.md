# 10xDevs3 Content Delivery Pipeline Fixes — Plan Brief

> Full plan: `context/changes/content-delivery-10xdevs3/plan.md`
> Research: `context/changes/content-delivery-10xdevs3/research.md`

## What & Why

Three issues degrade the 10xDevs3 lesson content: mermaid diagrams render as raw DSL text instead of images, prework references like `[3.2]` are plain text instead of clickable links, and Circle strips inline `<code>` tags. Fixing these ensures lessons display correctly both on the platform and in Circle.

## Starting Point

The HTML generation pipeline (`lessonHtmlGenerator.ts`) converts markdown to HTML with a single post-processing hook (asset path rewriting). Mermaid blocks are converted to `<pre class="mermaid">` containers, and CDN URLs for rendered diagrams already exist as HTML comments alongside each block. Circle push reads from a separate backup directory and does its own markdown → HTML conversion. Lesson 01 has broken mermaid delimiters (`******mermaid`) that prevent parsing.

## Desired End State

Generated platform HTML shows CDN-hosted diagram images (not raw mermaid DSL), prework bracket references are clickable links to the corresponding prework lesson, and a dedicated Circle export step produces content where inline code is preserved as bold text and images are converted to blockquote placeholders with source links.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|----------|--------|-------------------|--------|
| Inline code scope | Circle-only transform | Platform renders `<code>` correctly; only Circle strips it | Research |
| CDN URL variant | `cdn-10x` (styled) | Branding — 10x-styled diagrams match course identity | Research |
| Prework lookup | Static map in code | All 15 prework lessons are known upfront and change ~never | Plan |
| Generic prework refs | Leave as plain text | Only explicit `[X.Y]` IDs are unambiguous enough to auto-link | Plan |
| Link format | Absolute URLs (`https://przeprogramowani-edu.pages.dev/...`) | Works on platform and in Circle (where content lives on a different domain) | Plan |
| Image alt text | Generic "Diagram" | Simple and consistent; mermaid DSL isn't parseable for meaningful alt | Plan |
| Circle prepare | New `prepare.ts` file | Clean separation — prepare and push are independent atomic steps | Plan |
| Lesson 01 fix | Upstream in workbench source | Fix the delimiter at the root; the generator shouldn't handle non-standard fences | Research |
| Testing | Unit tests per transform function | Fast, precise, catches regressions in transform logic | Plan |

## Scope

**In scope:**
- Mermaid `<pre>` → `<img>` post-processing in HTML generation
- Prework `[X.Y]` → `<a>` link injection with static lookup table (PL, EN-ready)
- Broken mermaid delimiter fix in lesson 01 upstream source
- New `prepare.ts` for Circle export (`<code>` → `<strong>`, `<img>` → placeholder)
- Unit tests for all new transform functions

**Out of scope:**
- English lesson/prework content (table supports EN, but no files exist)
- Pipeline orchestration scripts (`pipeline:full`, `pipeline:10xdevs3`)
- Modifying `renderMarkdown()` or the rehype AST pipeline
- Automating the workbench render/upload for lesson 01 diagrams

## Architecture / Approach

New post-processing functions (`replaceMermaidWithCdnImages`, `injectPreworkLinks`) are pure string transforms in a dedicated `lessonHtmlPostProcessing.ts`, called from `generateLessonHtmlForSource()` after the existing asset path rewrite. Circle-specific transforms live in a separate `prepare.ts` in the circle-lesson-backup workspace, reading the platform's generated HTML as input.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Platform HTML transforms | Mermaid → CDN images + prework bracket links in generated HTML | Regex for multi-line mermaid blocks must handle all 16 variations |
| 2. Upstream mermaid fix (lesson 01) | Standard fences in lesson 01 source; requires manual workbench pipeline run | Depends on user running render/upload before diagrams appear |
| 3. Circle prepare pipeline | `prepare.ts` with `<code>` → `<strong>` + `<img>` → placeholder; inspectable output | Mapping platform filenames to Circle lesson IDs requires one-time extraction |

**Prerequisites:** CDN images already uploaded for lessons 03-05 (already true). Lesson 01 diagrams need workbench pipeline run (Phase 2).
**Estimated effort:** ~2 sessions across 3 phases. Phase 1 is the largest; Phase 2 is mostly a manual step; Phase 3 is isolated to the circle-lesson-backup workspace.

## Open Risks & Assumptions

- Lesson 01's mermaid diagrams don't exist on CDN yet — Phase 2 depends on a manual workbench pipeline run (render → transform → upload → transport)
- The Circle lesson ID mapping for Phase 3 must be extracted from existing `backup/10xdevs-3ed/*.md` frontmatter — if backup files are out of date, the mapping may be stale
- If new prework lessons are added beyond `[4.3]`, the static lookup table needs a manual update

## Success Criteria (Summary)

- Lessons with mermaid diagrams show CDN images on the platform (not raw DSL text)
- Prework bracket references are clickable links navigating to the correct prework lesson
- `npm run circle:prepare` produces Circle-compatible HTML with no inline `<code>` and images as placeholders
