---
date: 2026-05-16T12:00:00+02:00
researcher: Claude
git_commit: c8012a806e76c2407a5f56e67ad6cb96a746b285
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "10xDevs3 content delivery pipeline — inline code, prework links, mermaid diagrams"
tags: [research, codebase, content-pipeline, lessons10xDevs3, circle-sync, mermaid]
status: complete
last_updated: 2026-05-16
last_updated_by: Claude
---

# Research: 10xDevs3 Content Delivery Pipeline Fixes

**Date**: 2026-05-16T12:00:00+02:00
**Researcher**: Claude
**Git Commit**: c8012a80
**Branch**: master
**Repository**: przeprogramowani/przeprogramowani-sites

## Research Question

Three issues in the 10xDevs3 content delivery pipeline:
1. Inline `<code>` tags (backtick text) are stripped by Circle — need replacement with bold/italic
2. Missing hyperlinks to prework lessons that are mentioned but not linked
3. Mermaid diagrams rendered as raw DSL — need `<img>` tags with CloudFront CDN URLs

## Summary

The pipeline flows: `workbench/lessons/` → (transport) → `src/content-source/lessons10xDevs3/pl/` → (generate:lesson-html) → `src/content/lessons10xDevs3/pl/` → platform + Circle sync.

All three issues can be solved by adding post-processing steps in `markdownLessonTransforms.ts` or `lessonHtmlGenerator.ts`. The CDN infrastructure and URL comments already exist in source markdown. Prework routing is already functional at `/external/10xdevs-3-prework/pl/{lessonId}`. Circle's sanitizer strips both inline `<code>` and `<img>`, but `<strong>` survives and images can use the existing placeholder system during Circle push.

## Detailed Findings

### Issue 1: Inline Code (`<code>`) Stripped by Circle

**Root cause**: Circle's HTML sanitizer strips inline `<code>` tags completely. Block-level `<pre><code>` is preserved, but standalone inline code disappears.

**Current state in generated HTML** (`src/content/lessons10xDevs3/pl/04-m1l4-agent-onboarding.html`):
```html
<p>...polecenie <code>/context</code> w Claude Code...</p>
<p>...na przykład <code>/init</code>, <code>/commit</code>, <code>/review</code>...</p>
```

**Scale**: 100+ inline `<code>` instances across the 5 generated lesson files.

**Circle behavior** (documented in `utils/circle-lesson-backup/CLAUDE.md`):
- `<code>` inline → **stripped completely** (tag and content removed)
- `<pre><code>` block → **preserved** (block-level code survives)
- `<strong>` → preserved
- `<em>` → preserved

**Solution options**:
- Replace `<code>text</code>` with `<strong>text</strong>` during HTML generation (Circle preserves `<strong>`)
- Alternative: use `<em>text</em>` for less visual weight
- Must only target inline code (not code inside `<pre>` blocks)

**Key file to modify**: `src/server/content/markdownLessonTransforms.ts` or add a post-processing step in `lessonHtmlGenerator.ts:183-186`

---

### Issue 2: Missing Prework Links

**Current state**: Main course content references prework textually without hyperlinks.

**Examples from source** (`src/content-source/lessons10xDevs3/pl/02-m1l2-od-chatbota-do-agenta.md`):
```markdown
W preworku [3.2] *Wzorce i antywzorce promptowania*...
Okno kontekstowe to budżet (wiesz to z preworku [3.1] i [3.3])...
```

**Generated HTML output** — plain text, no links:
```html
<p>W preworku [3.2] <em>Wzorce i antywzorce promptowania</em>...</p>
```

**Prework routing**: Already functional at `/external/10xdevs-3-prework/pl/{lessonId}`

**Prework lesson ID mapping** (from `src/content-source/lessons10xDevs3Prework/pl/` frontmatter):

| Title pattern | File | lessonId |
|---|---|---|
| [1.1] Co potrafi AI w 2026 r. | 01-1x1_*.md | 01 |
| [1.2] Chatbot vs Agent vs Harness | 02-1x2_*.md | 02 |
| [1.3] Jak uczyć się z AI | 03-1x3_*.md | 03 |
| [2.1] Agent w IDE | 04-2x1_*.md | 04 |
| [2.2] Cursor | 05-2x2_*.md | 05 |
| [2.3] Claude Code | 06-2x3_*.md | 06 |
| [2.4] Agent native IDE | 07-2x4_*.md | 07 |
| [3.1] LLMy i ich wpływ | 09-3x1_*.md | 09 |
| [3.2] Wzorce i antywzorce | 10-3x2_*.md | 10 |
| [3.3] Cykl życia wątku | 11-3x3_*.md | 11 |
| [3.4] Język pracy z AI | 12-3x4_*.md | 12 |
| [3.5] Rekomendowane modele | 13-3x5_*.md | 13 |
| [4.1] Tech stack overview | 14-4x1_*.md | 14 |
| [4.2] Dobry i zły projekt | 15-4x2_*.md | 15 |
| [4.3] Checklista uczestnika | 16-4x3_*.md | 16 |

**Note**: The bracket numbers (e.g., [3.2]) map to module.lesson (3.2 = module 3, lesson 2 within that module). The actual `lessonId` in the file is sequential (3.2 → `10`).

**Solution approaches**:
1. **Manual fix in source markdown**: Convert `preworku [3.2] *Wzorce...*` → `preworku [3.2] [*Wzorce...*](/external/10xdevs-3-prework/pl/10)` in the content-source files
2. **Automated transform**: Add a rehype plugin or post-processing step that detects patterns like `preworku [X.Y]` and generates links from the mapping
3. **Hybrid**: Fix existing references manually, add a CI check that warns on unlinked prework references in new content

**Recommendation**: Option 1 (manual fix) for existing content since there are relatively few references (~10 total), plus option 2 for future content via a linter/checker.

---

### Issue 3: Mermaid Diagrams → CDN `<img>` Tags

**Current state in source markdown** (`src/content-source/lessons10xDevs3/pl/04-m1l4-agent-onboarding.md:39-55`):
```markdown
```mermaid
flowchart TD
    SP["System prompt agenta<br/><small>...</small>"]
    ...
` ` `
<!-- rendered: ../../assets/diagrams/lessons-m1-l4-lesson-draft-1.png | cdn: https://images.przeprogramowani.pl/diagrams/lessons-m1-l4-lesson-draft-1.png -->
<!-- cdn-10x: https://images.przeprogramowani.pl/diagrams/lessons-m1-l4-lesson-draft-1-10x.png -->
```

**Current state in generated HTML** (`src/content/lessons10xDevs3/pl/04-m1l4-agent-onboarding.html:26,40`):
```html
<pre class="mermaid" data-language="mermaid">flowchart TD
    SP["System prompt agenta&#x3C;br/>&#x3C;small>...</small>"]
    ...
</pre>
<!-- rendered: ../../assets/diagrams/lessons-m1-l4-lesson-draft-1.png | cdn: https://images.przeprogramowani.pl/diagrams/lessons-m1-l4-lesson-draft-1.png -->
<!-- cdn-10x: https://images.przeprogramowani.pl/diagrams/lessons-m1-l4-lesson-draft-1-10x.png -->
```

**Key insight**: CDN comments are already present in both source markdown AND generated HTML. The URLs are real and the assets are uploaded to S3 via `workbench/scripts/upload-assets.mjs`.

**CDN infrastructure** (from `upload-assets.mjs`):
- S3 bucket: `10xdevs-images`
- CDN base: `https://images.przeprogramowani.pl`
- Diagram prefix: `diagrams/`
- CloudFront distribution: `E3GAMSDNKN6396`

**Diagram count**: ~22 mermaid blocks across 5 lessons (all have CDN comments)

**Solution**: Add a post-processing step in the HTML generation that:
1. Detects `<pre class="mermaid" ...>...</pre>` followed by `<!-- rendered: ... | cdn: URL -->` (and optional `<!-- cdn-10x: URL -->`)
2. Replaces the `<pre>` + comments with `<img src="CDN_URL" alt="diagram">`
3. Optionally uses the `cdn-10x` URL for the stylized version

**Implementation location**: Best as a rehype plugin in `markdownLessonTransforms.ts` or as a string transform in `lessonHtmlGenerator.ts` after `renderMarkdown()` returns.

**Circle implications**: Circle strips `<img>` tags too, but the existing `tagsToPlaceholders()` in `utils/circle-lesson-backup/utils/tag-placeholders.ts` already converts `<img>` to blockquote placeholders with links. So `<img>` in the platform HTML will naturally flow through the Circle push pipeline.

**Also found**: Lesson `01-m1l1-od-pomyslu-do-prd.md` uses non-standard `******mermaid` delimiters instead of triple backticks — these are NOT parsed as mermaid and render as broken `<p>` text. This is a separate source-markdown bug that needs fixing in the content-source file.

---

## Code References

- `src/server/content/markdownLessonTransforms.ts:62-89` — `rehypeMermaidContainer()` plugin (converts code fences to `<pre class="mermaid">`)
- `src/server/content/markdownLessonTransforms.ts:91-102` — `renderMarkdown()` (the unified pipeline)
- `src/server/content/lessonHtmlGenerator.ts:167-208` — `generateLessonHtmlForSource()` (where post-processing hooks go)
- `src/server/content/lessonHtmlGenerator.ts:183-186` — existing asset path rewrite (pattern for adding more transforms)
- `workbench/scripts/render-mermaid.mjs:227-266` — `injectDiagramLinks()` (creates `<!-- rendered: ... | cdn: ... -->` comments)
- `workbench/scripts/upload-assets.mjs:35-38` — CDN constants (S3 bucket, base URL, CloudFront ID)
- `workbench/scripts/transport-lesson.mjs:70-104` — `transportLesson()` (copies draft → content-source with frontmatter)
- `utils/circle-lesson-backup/push.ts` — Circle push mechanism (markdown → HTML → `tagsToPlaceholders` → PATCH API)
- `utils/circle-lesson-backup/utils/tag-placeholders.ts` — `<img>` → blockquote placeholder conversion
- `src/content-source/lessons10xDevs3Prework/pl/` — prework source files with `lessonId` frontmatter

## Architecture Insights

### Content Pipeline (complete flow)

```
workbench/lessons/<id>/lesson-draft.md
  │
  ├─ render-mermaid.mjs → assets/diagrams/*.png (+ CDN comments injected into markdown)
  ├─ upload-assets.mjs  → S3 → https://images.przeprogramowani.pl/diagrams/*.png
  │
  ▼ transport-lesson.mjs
src/content-source/lessons10xDevs3/pl/*.md   (staging: markdown + CDN comments)
  │
  ▼ generate:lesson-html (tsx scripts/generate-lesson-html.ts)
  │   └─ markdownLessonTransforms.ts::renderMarkdown()
  │       ├─ remarkParse → remarkGfm → remarkRehype → rehypeRaw
  │       ├─ rehypeMermaidContainer (code → <pre class="mermaid">)
  │       └─ rehypeStringify
  │
src/content/lessons10xDevs3/pl/*.html   (platform HTML)
  │
  ├─ platform: served at /courses/10xdevs-3/lesson/<id>
  │
  └─ circle-lesson-backup/push.ts → Circle API (body_html)
       └─ tagsToPlaceholders() → converts <img> to blockquote links
```

### Circle HTML Allowlist (critical constraints)

| Preserved | Modified | Stripped |
|---|---|---|
| strong, em, u, s | h1→h2, h4→h3, del→s | iframe, img, video, audio |
| h2, h3, a, ul, ol, li | links get target=_blank | figure, details, mark, sup, sub |
| pre>code (block), blockquote | li content → wrapped in p | **inline code**, span, div, style attr |
| hr, p, br, table/tr/th/td | thead/tbody stripped | all data-* attrs, comments |

### Transformation Points (where to add fixes)

The optimal place for all three fixes is in `lessonHtmlGenerator.ts:generateLessonHtmlForSource()`, after `parseMarkdownLesson()` returns `bodyHtml`:

```typescript
// Current (line 183-186):
let bodyHtml = parsedLesson.bodyHtml;
if (target.assetsPublicPath) {
  bodyHtml = bodyHtml.replace(/src="\.\/assets\//g, `src="${target.assetsPublicPath}/`);
}

// Proposed additions:
// 1. Replace mermaid <pre> + CDN comment → <img src="cdn-url">
// 2. Replace inline <code> → <strong> (for Circle compatibility)
// 3. (Prework links handled in source markdown, not here)
```

## Script Architecture

### Full Pipeline Flow

```
workbench/lessons/<id>/lesson-draft.md
  │
  ├── npm run render          ← atomic: mermaid → PNG/SVG
  ├── npm run transform       ← atomic: PNG → 10x styled PNG
  ├── npm run upload          ← atomic: → S3/CloudFront
  │
  ▼ npm run transport         ← atomic: draft → content-source
src/content-source/lessons10xDevs3/pl/*.md
  │
  ▼ npm run generate:lesson-html  ← atomic (modified): markdown → HTML
  │   ├─ mermaid <pre> + cdn-10x comment → <img>
  │   └─ prework [X.Y] → <a href="/external/...">
  │
src/content/lessons10xDevs3/pl/*.html  (platform HTML)
  │
  ▼ npm run circle:prepare    ← atomic: platform → Circle-ready HTML
  │   ├─ <code> → <strong>
  │   └─ <img> → blockquote placeholder
  │
utils/circle-lesson-backup/content/10xDevs3/pl/*.html
  │
  ▼ npm run circle:push       ← atomic: → Circle API
```

### Existing Scripts (no changes needed)

| Script | Location | Purpose |
|--------|----------|---------|
| `render` | workbench | Mermaid markdown → SVG + PNG |
| `transform` | workbench | PNG → 10x styled PNG (OpenRouter) |
| `upload` | workbench | Assets → S3 + CloudFront invalidation |
| `transport` | workbench | Draft → content-source with frontmatter |

### Scripts to Modify

| Script | Location | Modification |
|--------|----------|--------------|
| `generate:lesson-html` | edu-platform | Add mermaid→`<img cdn-10x>` replacement + prework link injection via lookup table |

### New Atomic Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `circle:prepare` | circle-lesson-backup | Read platform HTML from `src/content/lessons10xDevs3/pl/`, apply Circle transforms (`<code>`→`<strong>`, `<img>`→placeholder), write to `content/10xDevs3/[pl,en]/` |
| `circle:push` | circle-lesson-backup | Push from local `content/10xDevs3/[pl,en]/` to Circle API |
| `circle:diff` | circle-lesson-backup | Show what changed vs last push (review before pushing) |

### New Chained Scripts

| Script | Location | Steps | Use case |
|--------|----------|-------|----------|
| `pipeline:assets` | workbench | render → transform → upload | "Diagrams changed, update CDN" |
| `pipeline:publish` | workbench | transport → generate:lesson-html | "Drafts ready, push to platform" |
| `pipeline:circle` | circle-lesson-backup | prepare → push | "Platform HTML ready, sync to Circle" |
| `pipeline:full` | workbench (conductor) | transport → generate → circle:prepare → circle:push | "Full end-to-end from workbench to Circle" |
| `pipeline:10xdevs3` | monorepo root | Same as pipeline:full via workspace calls | "Full end-to-end from monorepo root" |

### Chaining Strategy

Two entry points for the full chain:

1. **Root-level npm script** (`package.json` at monorepo root):
   ```json
   "pipeline:10xdevs3": "npm run transport --workspace=projects/edu-platform/workbench && npm run generate:lesson-html --workspace=projects/edu-platform && npm run circle:prepare --workspace=utils/circle-lesson-backup && npm run circle:push --workspace=utils/circle-lesson-backup"
   ```

2. **Conductor script** (`workbench/scripts/pipeline-full.mjs`):
   - Single Node.js script that orchestrates all steps with proper error handling
   - Supports `--dry-run`, `--from=<step>`, `--to=<step>` flags for partial runs
   - Prints progress and timing per step
   - Invoked via `npm run pipeline:full` from workbench

Both options available — root script for CI/simple invocation, conductor for interactive use with flags.

## Open Questions

1. **Inline code replacement scope**: Should ALL inline `<code>` become `<strong>`, or only for the Circle-destined copy? The platform renders `<code>` correctly with styling. Consider: separate "Circle export" transform vs modifying the canonical HTML.
Decision: only for Circle

2. **Which CDN URL for diagrams**: Use `cdn:` (standard PNG) or `cdn-10x:` (sci-fi styled)? The standard version matches the mermaid source; the 10x version is visually distinct.
Decision: use cdn-10x for branding purposes

3. **Prework link automation**: Should we build a lookup table from prework frontmatter and auto-link `[X.Y]` patterns, or is a manual fix sufficient given the small number of references?

Decision: lets build a lookup table for both language versions pl and en

4. **Lesson 01 broken mermaid**: The `******mermaid` delimiter issue in `01-m1l1` — is this a source-markdown bug to fix upstream in `workbench/lessons/m1-l1/lesson-draft.md`, or should the transport/generator handle non-standard delimiters?

Decision: we should fix this upstream in `workbench/lessons/m1-l1/lesson-draft.md`

5. **Circle push source**: Currently `circle-lesson-backup` reads from its own `backup/` directory. Should it instead read the generated HTML from `src/content/lessons10xDevs3/pl/` to benefit from the new transforms?

Decision: circle should read from `src/content/lessons10xDevs3/pl/`, apply Circle-only transformations, store results in its own `content/10xDevs3/[pl,en]/` directory, and push from there. This keeps transformed copies persistent and inspectable.
