---
date: 2026-04-18
researcher: psmyrdek
git_commit: aabcd36096bba050de40b28df9e97c8a4e9a704c
branch: master
repository: przeprogramowani-sites
topic: "Render Mermaid diagrams within 10xDevs 3.0 prework lessons"
tags: [research, edu-platform, mermaid, markdown, remark, rehype, 10xdevs-3-prework]
status: complete
last_updated: 2026-04-18
last_updated_by: psmyrdek
---

# Research: Render Mermaid diagrams within 10xDevs 3.0 prework lessons

**Date**: 2026-04-18
**Researcher**: psmyrdek
**Git Commit**: aabcd36096bba050de40b28df9e97c8a4e9a704c
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

What is needed to render Mermaid diagrams within a 10xDevs 3.0 prework lesson? Analyze the existing lesson-rendering pipeline, existing dependencies, and identify what is missing.

## Summary

The 10xDevs 3.0 prework is the **only** course using a Markdown-based pipeline. It is rendered through a custom Astro content loader at `src/server/content/markdownLessonLoader.ts` that runs a plain `unified` → `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-stringify` pipeline. The result is stored as an HTML string inside the content collection, then injected via `set:html` in `Lesson.astro`. On the client, `LayoutScripts.astro` adds syntax highlighting (highlight.js) and copy-to-clipboard buttons.

**Mermaid is not supported today**, but the content already contains ` ```mermaid ` fences in **7 prework files**. They currently serialize to inert `<pre><code class="language-mermaid">…</code></pre>` blocks (and also get picked up by highlight.js as if they were code, which produces a noisy result).

**What's missing**, specifically:
1. A transformer that converts ` ```mermaid ` code nodes into a container Mermaid's client runtime can pick up (e.g. `<div class="mermaid">…</div>` or `<pre class="mermaid">…</pre>`).
2. An exclusion rule so `LayoutScripts.astro` does not run highlight.js on those containers (the "Smart Language Detection" heuristics currently have no awareness of `mermaid`).
3. A client-side Mermaid runtime loaded only on lesson pages (preferably as a dynamic ESM import so it does not bloat every page).
4. Dark-theme configuration to match the `prose prose-invert` styling used in `Lesson.astro`.

Because `edu-platform` is deployed to **Cloudflare Workers** (`output: 'server'` in `astro.config.mjs`) and Cloudflare Workers cannot run headless Chromium, SSR rendering of Mermaid → SVG via `rehype-mermaid` / `mermaid-isomorphic` at **request time** is not viable. However, Astro content loaders run at **build time**, so SSR-to-SVG is technically possible for the prework collection. Client-side rendering is simpler and keeps the loader pure — recommended as the primary path.

## Detailed Findings

### 1. Rendering Pipeline (prework-specific)

The prework course is routed through the generic static-collection page and resolved by a custom markdown loader:

- Collection: `lessons10xDevs3Prework` defined in `src/content.config.ts:81-84`
  - Loader: `markdownLessonLoader('./src/content/lessons10xDevs3Prework/*.md')`
  - Schema: `{ id: string, name: string, content: string }` — `content` is **pre-rendered HTML**, not raw markdown.
- Route: `src/pages/courses/[...courseSlug]/lesson/[...id].astro:1-27`
  - URL pattern: `/courses/10xdevs-3-prework/lesson/<id>`
  - Uses `COLLECTION_MAPPINGS` in `src/models/CollectionMappings.ts:39` to map the slug `10xdevs-3-prework` → `lessons10xDevs3Prework`.
- Loader implementation: `src/server/content/markdownLessonLoader.ts:55-65`

```ts
await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify, { allowDangerousHtml: true })
  .process(markdown);
```

- Rendering component: `src/components/Lesson.astro:1-15` — uses `<div set:html={content} />` inside a `prose prose-invert` wrapper.
- Layout wrapper: `src/layouts/CourseLayout.astro:1-73` — loads `public/styles/highlight-github-dark.min.css`.
- Client behavior: `src/layouts/LayoutScripts.astro:1-168` — runs highlight.js on all `<code>` elements on `DOMContentLoaded`, with heuristic auto-detection and a copy-to-clipboard button added to every `<pre>`.

### 2. Current Markdown Dependencies (edu-platform)

All installed at the **monorepo root** (`/Users/psmyrdek/dev/przeprogramowani-sites/package.json`) and consumed transitively:

| Purpose | Package | Version | Status |
|---|---|---|---|
| AST processor | `unified` | 11.0.5 | Active |
| Parse MD → mdast | `remark-parse` | 11.0.0 | Active |
| GFM | `remark-gfm` | 4.0.1 | Active |
| mdast → hast | `remark-rehype` | 11.1.2 | Active |
| Raw HTML passthrough | `rehype-raw` | 7.0.0 | Active |
| hast → HTML string | `rehype-stringify` | 10.0.1 | Active |
| Frontmatter parsing | `yaml` (via loader) | — | Active |
| Client highlighter | `highlight.js` | ^11.11.1 | Active |
| HTML DOM (post-proc) | `cheerio` | 1.1.2 | Active (for Circle HTML, not prework) |
| Installed but unused | `shiki`, `marked`, `remark-smartypants` | — | — |

`edu-platform/astro.config.mjs:1-32` contains **no markdown/remark/rehype/mdx integration**. The default Astro markdown pipeline is bypassed entirely for the prework — only the custom loader runs.

### 3. Existing Code-Fence Handling

- **Server side (loader):** `remarkGfm` produces `<pre><code class="language-mermaid">…</code></pre>` and `rehypeRaw`/`rehypeStringify` pass it through verbatim. No transformer inspects the code language.
- **Client side (`LayoutScripts.astro`):**
  - `src/layouts/LayoutScripts.astro:7-94` contains hand-rolled heuristics to detect TypeScript/JavaScript/JSON/Markdown/ASCII-art fences and assign an hljs class.
  - `src/layouts/LayoutScripts.astro:21-37` respects an explicit language class if present (e.g. `language-plaintext`, `language-json`).
  - There is **no special case for `language-mermaid`** — it is fed to hljs as if it were code, so the "diagram DSL" gets colored as if it were JavaScript-ish.
  - `src/layouts/LayoutScripts.astro:99-166` adds a copy button to every `<pre>` element, which is undesirable on a rendered diagram.

### 4. Existing Mermaid Usages (content)

Mermaid fences already exist in the prework content, rendered today as inert code blocks:

- `src/content/lessons10xDevs3Prework/02-1x2_chatbot_vs_agent_vs_harness.md:73`
- `src/content/lessons10xDevs3Prework/09-3x1_llmy_i_ich_wplyw_na_codzienna_prace.md:57`
- `src/content/lessons10xDevs3Prework/11-3x3_cykl_zycia_watku_i_zarzadzanie_kontekstem.md:47`
- `src/content/lessons10xDevs3Prework/before.md:52`, `before2.md:25`
- `src/content/lessons10xDevs3Prework/after.md:73`, `after2.md:53`

References to Mermaid appear inside legacy HTML lessons (`lessons10xDevs1/*.html`, `lessons10xDevs2/*.html`, `lessons10xDevs2EN/*.html`) but those are **pre-rendered SVGs** from Circle.so exports — they do not need the new pipeline.

### 5. What's Missing — Component Inventory

To render Mermaid inside prework lessons, the following pieces do not exist yet:

1. **Loader-side transformer** — a rehype plugin (or a small inline `unist-util-visit` pass) that finds `element[tagName=code][properties.className*='language-mermaid']` nodes, extracts the inner text, and replaces the enclosing `<pre><code>` with a `<pre class="mermaid">…</pre>` (or `<div class="mermaid">`). Added between `remark-rehype` and `rehype-stringify` in `src/server/content/markdownLessonLoader.ts:55-65`. No new dependency required for this step — it can be ~20 lines using `unist-util-visit` (already in tree).
2. **Client runtime** — `mermaid` (current stable is v11.x) not yet installed. Needs to be added to `projects/edu-platform/package.json` and dynamically imported only on routes that render lesson content.
3. **Initialization script** — either (a) a new `<script>` block in `LayoutScripts.astro` that calls `mermaid.initialize({ startOnLoad: false, theme: 'dark' })` and `mermaid.run({ querySelector: '.mermaid' })` after the highlight.js step, or (b) a dedicated `MermaidRenderer.astro` component included only in lesson layouts.
4. **Highlight.js / copy-button exclusion** — update `src/layouts/LayoutScripts.astro:7-94` and `99-166` to skip `<pre class="mermaid">` / elements that contain `.mermaid`. Today it would apply `language-javascript` auto-detection and a copy button to the container, which fights Mermaid.
5. **Styling** — `.mermaid svg` should use `max-width: 100%; height: auto;` inside `prose prose-invert`. Mermaid v11 theme `dark` or a custom `themeVariables` object matching the Tailwind `gray-900` background is needed. `tailwind.config.mjs` has no relevant overrides today.
6. **Optional: download/export** — `src/utils/htmlToMarkdown.ts` converts lesson HTML back to markdown for the `/markdown` export routes. If the loader swaps code → `<pre class="mermaid">`, `node-html-markdown` will emit the Mermaid source as a plain preformatted block without the language tag. If round-tripping matters, the loader should wrap so the language hint survives (e.g. keep `<code class="language-mermaid">` inside the new container, or re-emit fences on export).

### 6. Integration Strategy — Options

#### Option A (recommended): Server-tagged container + client-side render

- Add a tiny rehype step in `markdownLessonLoader.ts:55-65` that rewrites `code.language-mermaid` blocks to `<pre class="mermaid"><code class="language-mermaid">…</code></pre>` (keeping the `<code>` child preserves raw text for copy/export; the outer `pre.mermaid` is what Mermaid targets).
- Install `mermaid` in `projects/edu-platform`.
- In `LayoutScripts.astro`:
  - Skip hljs / copy-button for any `<pre class="mermaid">` (add a guard at the top of both DOM passes).
  - After hljs runs, dynamically `import('mermaid')`, call `initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' })`, then `run({ querySelector: 'pre.mermaid' })`.
- Pros: zero build-time cost, works with Cloudflare SSR, degrades to readable text if JS fails.
- Cons: ~400–600 KB of JS on lesson pages (mermaid ships its own parser + dagre). Mitigate with dynamic import gated on "a `.mermaid` node exists in the DOM".

#### Option B: Build-time SSR to SVG

- Replace the stringify step with `rehype-mermaid` (`mode: 'img-svg'` or `'inline-svg'`) so the loader emits the final SVG.
- Loader runs at build/dev only, so headless Chromium (`playwright`) is acceptable there and never ships to Workers.
- Pros: no client runtime, no JS payload, no FOUC.
- Cons: adds Playwright + Chromium to the dev/CI toolchain (~300 MB install), slows down content-collection rebuilds, and every content edit re-runs the renderer. Overkill for ~10 diagrams.

#### Option C: Hybrid

- Build-time render for production (Option B behind a flag), client-side for `astro dev` (Option A) to keep the edit loop fast.
- Adds meaningful complexity for small gain; not recommended unless the bundle size in Option A proves unacceptable.

## Code References

- `projects/edu-platform/src/content.config.ts:81-84` — prework collection definition
- `projects/edu-platform/src/server/content/markdownLessonLoader.ts:55-65` — unified pipeline (the integration point for the rehype transformer)
- `projects/edu-platform/src/server/content/markdownLessonLoader.ts:27-44` — frontmatter parsing (can opt-in via a `mermaid: true` field if desired)
- `projects/edu-platform/src/pages/courses/[...courseSlug]/lesson/[...id].astro:1-27` — static route
- `projects/edu-platform/src/components/Course.astro:1-83` — layout hosting the lesson
- `projects/edu-platform/src/components/Lesson.astro:1-15` — `set:html` injection point
- `projects/edu-platform/src/layouts/CourseLayout.astro:1-73` — loads highlight.js CSS
- `projects/edu-platform/src/layouts/LayoutScripts.astro:1-168` — client-side hljs + copy button; **must learn about `pre.mermaid`**
- `projects/edu-platform/src/models/CollectionMappings.ts:14,26,39,52` — prework slug mappings
- `projects/edu-platform/astro.config.mjs:1-32` — no markdown integration; default pipeline unused for prework
- `projects/edu-platform/src/utils/htmlToMarkdown.ts` — affects the `/markdown` export round-trip

## Architecture Insights

- The prework is a **pre-rendered HTML** string stored in the content collection (`content: string`). Any transformation must happen inside the loader; downstream code (`Lesson.astro`, `Course.astro`) treats it as opaque HTML.
- `highlight.js` is applied **at runtime in the browser** with hand-written heuristics (no Shiki, no rehype-pretty-code, no Expressive Code). Any code-fence feature (Mermaid, KaTeX, callouts) must be negotiated there, not via Astro's markdown config.
- Cloudflare Workers SSR rules out runtime headless-browser rendering; however, Astro content loaders run at build time, so SSR-to-SVG is still technically available.
- The codebase has **two distinct content paths** that must not diverge further — the HTML path (Circle.so exports for legacy courses) is post-processed with Cheerio in `src/server/circle/process-for-display.ts`. Mermaid support only needs to land on the Markdown path.
- Copy-button and hljs passes in `LayoutScripts.astro` are applied **indiscriminately** to every `<pre>` — they need a small "skip if class contains `mermaid`" guard to avoid regressions.

## Historical Context (from thoughts/)

No prior plans or research in `projects/edu-platform/thoughts/shared/` reference Mermaid or diagram rendering. The closest neighbors (unrelated) are the game-framework and sprite-migration research docs. This is greenfield for the repo.

## Related Research

None directly related. The `markdownLessonLoader` was introduced with the prework course and has not been extended since.

## Open Questions

1. **Diagram theming** — should diagrams use Mermaid's built-in `dark`, or a custom themeVariables matching `prose prose-invert` (gray-900 bg, violet accents)?
2. **Opt-in vs. always-on** — worth a `mermaid: true` frontmatter flag, or just detect any `language-mermaid` fence and render it? Current prework would make the auto-detect path simpler and adequate.
3. **`/markdown` export round-trip** — if a user downloads the lesson as Markdown, should the ` ```mermaid ` fence be preserved? Today the loader discards the language tag after the rehype step; a small adjustment in the transformer (keep `<code class="language-mermaid">` child) lets `node-html-markdown` re-emit the fence.
4. **Bundle budget** — does shipping Mermaid (~500 KB gz'd) on prework routes cross an acceptable threshold? If yes, Option B at build time is the alternative.
5. **Server vs. client render for SEO** — the prework is gated behind auth, so SEO is irrelevant; client-side is fine.
