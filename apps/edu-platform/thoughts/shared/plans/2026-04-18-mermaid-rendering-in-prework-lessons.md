# Mermaid Diagram Rendering in 10xDevs 3.0 Prework Lessons — Implementation Plan

## Overview

Render Mermaid diagrams inside the 10xDevs 3.0 prework lessons (the only Markdown-based course in the platform). Today, 7 lesson files contain ` ```mermaid ` fences that serialize to inert highlighted code blocks; after this plan, they render as proper diagrams. Strategy is **server-tagged container + client-side rendering** (research Option A): the markdown loader rewrites the code block into a Mermaid-recognizable container, `LayoutScripts.astro` dynamically imports `mermaid` only when a `.mermaid` node exists in the DOM, and renders with the built-in dark theme.

## Current State Analysis

- **Prework pipeline is unique.** `src/content.config.ts:81-84` defines `lessons10xDevs3Prework` with a custom `markdownLessonLoader` — every other course uses pre-rendered HTML from Circle.so. All markdown → HTML conversion happens in `src/server/content/markdownLessonLoader.ts:55-65` via a plain `unified → remark-parse → remark-gfm → remark-rehype → rehype-raw → rehype-stringify` chain. Result is stored as an HTML string in the content collection and injected via `set:html` in `src/components/Lesson.astro:13`.
- **Client-side post-processing.** `src/layouts/LayoutScripts.astro:1-168` walks every `<pre><code>` pair, applies a hand-rolled heuristic to assign an hljs language class, then calls `hljs.highlightAll()` and bolts a copy-to-clipboard button onto every `<pre>`. There is no awareness of Mermaid.
- **Existing fences render wrong.** 7 prework files already use ` ```mermaid `. Today the heuristic at `src/layouts/LayoutScripts.astro:22-37` respects `language-mermaid`, so hljs does not misdetect it as JS — but it's still treated as a language name, highlighted (no mermaid grammar loaded → falls back to default token coloring) and decorated with a copy button. Output is visually noisy and not a diagram.
- **Runtime headless rendering is not viable.** edu-platform runs on Cloudflare Workers (`astro.config.mjs` `output: 'server'`). However, content loaders run at build time, so Option B (rehype-mermaid SSR) is technically possible but rejected as overkill.
- **Dependencies are split.** `mermaid` is not installed anywhere. `unified`/`remark-*`/`rehype-*`/`unist-util-visit` are present in the root `node_modules` (resolvable from edu-platform via node resolution) but not declared in any `package.json` — the loader already imports them this way and it works.
- **Export strips language tags.** `src/utils/htmlToMarkdown.ts:27` runs `.replace(/class="[^"]*"\s*/gi, '')` before handing HTML to `NodeHtmlMarkdown`. This means no code-block language tag survives `/markdown` export today — not just mermaid. Preserving the fence requires narrowing that regex.

## Desired End State

- All 7 existing ` ```mermaid ` fences in `src/content/lessons10xDevs3Prework/*.md` render as interactive SVG diagrams in the browser on `/courses/10xdevs-3-prework/lesson/<id>`.
- New mermaid fences added later render automatically with no frontmatter flag or author configuration.
- Mermaid's ~500 KB bundle is only loaded on pages that actually contain a diagram (dynamic import gated on DOM presence).
- If a diagram fails to parse or Mermaid fails to load, the page shows the raw DSL in a plain preformatted block with a subtle error note — the lesson remains fully readable.
- `/markdown` export (`/shared/[guid]/markdown`, `/external/.../markdown`) preserves the ` ```mermaid ` fence so downloaded lessons re-import correctly.
- hljs and the copy-button do not touch `pre.mermaid` elements.

### Verification
- Open `/courses/10xdevs-3-prework/lesson/02` (and 09, 11) in a logged-in session → see rendered flowchart, not highlighted text.
- `before.md`, `after.md`, `before2.md`, `after2.md` pages also render their diagrams.
- Unit test `markdownLessonLoader.test.ts` asserts the transformer output shape for a mermaid fence.
- A deliberately broken `graph TD` fence falls back to visible raw text with an error note — no red Mermaid library widget.
- Downloading any lesson via `/markdown` preserves the ` ```mermaid ` fence verbatim.

### Key Discoveries
- Loader integration point: `src/server/content/markdownLessonLoader.ts:55-65` — insert a rehype transformer between `rehypeRaw` and `rehypeStringify`.
- hast shape for a fenced code block after `remark-rehype`: `element[tagName=pre] > element[tagName=code, properties.className=['language-mermaid']]`.
- `unist-util-visit` is already resolvable from edu-platform via root `node_modules` — same mechanism the loader uses for `unified` / `remark-*` imports.
- hljs guard placement: `src/layouts/LayoutScripts.astro:6-7` (the `pre > code` querySelector) and `src/layouts/LayoutScripts.astro:99-100` (the copy-button pass).
- Export regex to adjust: `src/utils/htmlToMarkdown.ts:27`.
- Test fixture pattern: `src/server/content/markdownLessonLoader.test.ts:1-50` uses `/* @vitest-environment jsdom */` and exercises `__testUtils` exports — we'll need to expose the transformer (or a thin wrapper that runs the full pipeline) the same way.
- Existing tailwind theme — `prose prose-invert` on `bg-gray-900` — matches Mermaid's built-in `dark` theme closely enough that no custom `themeVariables` is needed.

## What We're NOT Doing

- **Build-time SVG rendering** (rehype-mermaid / mermaid-isomorphic). Rejected: adds Playwright + Chromium to dev/CI for ~10 diagrams.
- **Hybrid (SSR in prod, client in dev).** Rejected: two pipelines for modest gain.
- **Custom Mermaid theme variables** matching the violet/emerald brand accents. Using built-in `dark`; revisit only if designer pushback.
- **Frontmatter `mermaid: true` opt-in.** Auto-detect every `language-mermaid` fence.
- **Playwright E2E test** that loads a lesson and asserts an SVG renders. Deferred — unit test on the transformer + manual browser verification is sufficient per the decisions captured.
- **Retrofitting other courses.** Only `lessons10xDevs3Prework` goes through the markdown loader; the legacy HTML courses already have pre-rendered Mermaid SVGs from Circle exports.
- **Exposing a "copy Mermaid source" button on the rendered diagram.** Users who want the DSL can use `/markdown` export.

## Implementation Approach

Four small phases, each independently mergeable:

1. **Loader transformer** — pure function, unit-tested. No runtime behavior change yet (the new HTML is still inert until the client script ships).
2. **Client runtime** — install `mermaid`, teach `LayoutScripts.astro` to skip diagram containers and dynamically import + run Mermaid when one is present. After this phase, diagrams render.
3. **Export round-trip** — narrow the class-stripping regex in `htmlToMarkdown.ts` so `language-*` survives; verify `node-html-markdown` emits the fence correctly.
4. **Manual verification & cleanup** — walk through all 7 diagrams in dev and a production build; confirm bundle gating, error fallback, and export round-trip.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **DOMContentLoaded ordering:** The existing `LayoutScripts.astro` handler runs on `DOMContentLoaded`. The Mermaid pass must run **after** the hljs pass (so hljs doesn't process `pre.mermaid`), but the guard at the top of the existing loop is how we achieve this — Mermaid is invoked after `hljs.highlightAll()` completes. The dynamic import is awaited inside an `async` IIFE so the copy-button pass on non-mermaid `<pre>` blocks isn't delayed waiting on Mermaid.
- **Idempotency:** If `mermaid.run()` is invoked twice on the same container it will throw "Already processed". Guard by checking `data-processed` attribute before calling run, or rely on the querySelector excluding `[data-processed]`. Mermaid v11 handles this internally via its `run()` options — we set `suppressErrors: true` for the library-level errors, but wrap in our own try/catch per container for the fallback UI.
- **No race with Astro view transitions:** edu-platform does not use Astro view transitions on lesson routes (`CourseLayout.astro` is static). A single `DOMContentLoaded` run is sufficient.

**Derived from:** Reading of `LayoutScripts.astro:4-97` and confirming no view-transition-related patterns in `CourseLayout.astro`.

### User Experience Specification

- **Rendered diagram:** SVG drawn by Mermaid v11 with `theme: 'dark'`. `.mermaid svg { max-width: 100%; height: auto; }` inside the existing `prose prose-invert` container. No copy button, no hljs coloring.
- **Loading state:** None — Mermaid render is synchronous once the library loads. On slow networks users see the raw DSL briefly (FOUC). No explicit loader is added; if the DSL is briefly visible, that's acceptable and matches how code blocks behave today.
- **Error state:** On per-container render failure, swap the container for `<pre class="mermaid-error"><code>…raw source…</code><div class="text-xs opacity-60 mt-2">Nie udało się wyrenderować diagramu.</div></pre>`. Polish copy per CLAUDE.md "in-game/learner-facing text in Polish" norm.
- **No JS / JS disabled:** Raw Mermaid DSL remains in the DOM (inside the `<code>` child); shown verbatim as preformatted text. The lesson remains readable.

**Derived from:** User requirements in Step 1 (error fallback = raw source + error note) and the existing `prose prose-invert` styling context in `Lesson.astro:10-13`.

### Performance & Optimization Strategy

- **Dynamic import:** `const mermaid = (await import('mermaid')).default;` — only executed when `document.querySelector('.mermaid')` is non-null. Non-prework pages and prework pages without diagrams pay zero cost.
- **Bundle expectations:** Mermaid v11 is ~450-550 KB gzipped after tree-shake. Vite/Rollup will produce a separate chunk. Acceptable for prework routes.
- **No memoization needed:** One render pass per page load; diagrams are static.

**Derived from:** User requirements (bundle gating = DOM-presence dynamic import) + standard Vite dynamic-import chunking.

### State Management Sequencing

N/A — this feature is pure DOM manipulation with no application state, no Redux/Svelte store, no cross-component coordination.

### Debug & Observability Plan

- **Verification method:** Visit the 7 prework lesson URLs in a local dev server, then in `npm run preview` after `npm run build`. Inspect DOM: `pre.mermaid` should contain an `svg` child after the script runs.
- **Logging strategy:** On render failure, `console.warn('[mermaid] render failed for diagram', { error, source })`. No remote telemetry — lesson content authoring is a small team and browser console is sufficient.
- **Debug instrumentation:** None beyond console.warn. If a diagram breaks silently, the fallback UI makes it visually obvious.
- **Metrics:** None. Bundle-size impact verified once at implementation time via `npm run build` output.

**Derived from:** Codebase has no Sentry/APM integration; existing code uses `console.error`/`console.warn` for client-side errors (see `src/utils/htmlToMarkdown.ts` area, `LayoutScripts.astro:160`).

---

## Phase 1: Loader Transformer

### Overview
Add a tiny rehype transformer that rewrites mermaid code blocks into Mermaid-recognizable containers while preserving the language hint on the inner `<code>` child.

### Changes Required:

#### 1. Transformer implementation

**File:** `src/server/content/markdownLessonLoader.ts`
**Changes:** Add a local rehype plugin that walks the hast tree, finds `element[tagName=pre] > element[tagName=code]` with `className` containing `language-mermaid`, and rewrites the parent `<pre>` to carry `class="mermaid"`. Keep the `<code class="language-mermaid">` child intact so `node-html-markdown` can later re-emit the fence.

```ts
// New imports
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

// New plugin factory (private to this module)
function rehypeMermaidContainer() {
  return (tree: Root) => {
    visit(tree, 'element', (preNode) => {
      if (preNode.tagName !== 'pre') return;

      const codeNode = preNode.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      );
      if (!codeNode) return;

      const classNames = Array.isArray(codeNode.properties?.className)
        ? (codeNode.properties!.className as string[])
        : [];
      if (!classNames.includes('language-mermaid')) return;

      // Tag the <pre> so Mermaid targets it and LayoutScripts skips it.
      const preClasses = Array.isArray(preNode.properties?.className)
        ? [...(preNode.properties!.className as string[])]
        : [];
      preNode.properties = {
        ...preNode.properties,
        className: [...preClasses, 'mermaid'],
      };
    });
  };
}

// Updated pipeline in renderMarkdown()
const rendered = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeMermaidContainer)
  .use(rehypeStringify, { allowDangerousHtml: true })
  .process(markdown);
```

#### 2. Test-utils export

**File:** `src/server/content/markdownLessonLoader.ts`
**Changes:** Export the `renderMarkdown` function (or wrap it in `__testUtils`) so the test file can call the full pipeline end-to-end and assert the HTML output.

```ts
export const __testUtils = {
  parseFrontmatter,
  extractLeadingHeading,
  stripLeadingH1,
  renderMarkdown, // ← added
};
```

#### 3. Unit tests

**File:** `src/server/content/markdownLessonLoader.test.ts`
**Changes:** Add a new `describe('mermaid transformer', ...)` block.

```ts
describe('mermaid transformer', () => {
  it('adds the "mermaid" class to <pre> wrapping a language-mermaid code block', async () => {
    const html = await __testUtils.renderMarkdown(
      '```mermaid\ngraph TD;\n  A-->B;\n```\n'
    );

    expect(html).toContain('class="mermaid"');
    // The inner <code class="language-mermaid"> must be preserved for export round-trip.
    expect(html).toMatch(/<pre class="mermaid"><code class="language-mermaid">/);
  });

  it('leaves non-mermaid code blocks untouched', async () => {
    const html = await __testUtils.renderMarkdown(
      '```ts\nconst x = 1;\n```\n'
    );

    expect(html).not.toContain('class="mermaid"');
    expect(html).toContain('class="language-ts"');
  });

  it('handles multiple mermaid fences in one document', async () => {
    const html = await __testUtils.renderMarkdown(
      '```mermaid\ngraph TD;\n  A-->B;\n```\n\n# Heading\n\n```mermaid\nsequenceDiagram\n  A->>B: hi\n```\n'
    );

    const matches = html.match(/<pre class="mermaid">/g) ?? [];
    expect(matches.length).toBe(2);
  });
});
```

### Success Criteria:

#### Automated Verification:
- [x] `npx vitest run src/server/content/markdownLessonLoader.test.ts` passes with 3 new tests green.
- [x] `npm run build --workspace=projects/edu-platform` completes without errors (confirms the content collection re-renders).
- [x] `npm run lint` passes for the modified files.

#### Manual Verification:
- [x] Build output contains the new `<pre class="mermaid">` wrapper. Quick spot check: after `npm run build`, grep a rendered prework entry for `class="mermaid"`.
- [x] In dev server, inspect `/courses/10xdevs-3-prework/lesson/02` DOM — `<pre class="mermaid">` node exists (even though it won't render yet — that's Phase 2).

**Implementation Note:** After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Client Runtime Integration

### Overview
Install `mermaid`, teach `LayoutScripts.astro` to skip `pre.mermaid` for hljs + copy-button, and dynamically import + initialize Mermaid only when a diagram is present on the page.

### Changes Required:

#### 1. Install Mermaid

**File:** `projects/edu-platform/package.json`
**Changes:** Add `"mermaid": "^11.4.0"` (or current stable) to `dependencies`. Run `npm install` at the repo root so the workspace picks it up.

```json
"dependencies": {
  "@supabase/supabase-js": "^2.98.0",
  ...
  "mermaid": "^11.4.0",
  ...
}
```

#### 2. Skip guards in LayoutScripts

**File:** `src/layouts/LayoutScripts.astro`
**Changes:** Two guards — one in the hljs/heuristic pass (`:7`), one in the copy-button pass (`:99`). Both skip any `<pre>` that has the `mermaid` class.

```ts
// Around line 8 — inside the first forEach over codeBlocks:
codeBlocks.forEach(function (codeBlock) {
  const pre = codeBlock.parentElement;
  if (pre && pre.classList.contains('mermaid')) {
    return; // Skip Mermaid containers entirely — no hljs, no language heuristics.
  }
  // ... existing heuristic code ...
});

// Around line 99 — before adding a copy button:
codeBlocks.forEach(function (codeBlock) {
  const pre = codeBlock.parentElement!;
  if (pre.classList.contains('mermaid')) {
    return; // Don't bolt a copy button onto a rendered diagram.
  }
  // ... existing copy-button code ...
});
```

#### 3. Mermaid render pass

**File:** `src/layouts/LayoutScripts.astro`
**Changes:** After `hljs.highlightAll()` and the copy-button pass, add a new `async` IIFE that dynamically imports Mermaid only if a `.mermaid` element exists.

```ts
// After the existing copy-button forEach (~line 166):
(async function renderMermaidDiagrams() {
  const containers = document.querySelectorAll<HTMLElement>('pre.mermaid');
  if (containers.length === 0) return;

  try {
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose', // prework lessons are trusted content
    });

    // Render one by one so we can fall back per-diagram on parse errors.
    for (const container of Array.from(containers)) {
      const codeChild = container.querySelector('code');
      const source = (codeChild?.textContent ?? container.textContent ?? '').trim();
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, source);
        container.innerHTML = svg;
        container.setAttribute('data-processed', 'true');
      } catch (renderError) {
        console.warn('[mermaid] render failed for diagram', renderError);
        container.classList.remove('mermaid');
        container.classList.add('mermaid-error');
        container.innerHTML = `<code>${escapeHtml(source)}</code><div class="text-xs opacity-60 mt-2">Nie udało się wyrenderować diagramu.</div>`;
      }
    }
  } catch (loadError) {
    console.warn('[mermaid] library failed to load', loadError);
    // Raw DSL is already visible in the <code> child — degrade gracefully.
  }
})();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

#### 4. Styling

**File:** `src/layouts/LayoutScripts.astro` (append a `<style>` block) or `src/styles/` if one exists
**Changes:** Ensure SVG fills the content width inside `prose prose-invert`. Mermaid emits inline `width`/`height` that can overflow.

```astro
<style is:global>
  .lesson-content pre.mermaid {
    background: transparent;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  .lesson-content pre.mermaid svg {
    max-width: 100%;
    height: auto;
  }
  .lesson-content pre.mermaid-error {
    border: 1px solid rgb(127 29 29 / 0.6); /* red-900/60 */
    padding: 0.75rem;
    border-radius: 0.5rem;
  }
</style>
```

### Success Criteria:

#### Automated Verification:
- [x] `npm install` completes; `mermaid` appears in `projects/edu-platform/package.json` and `node_modules`.
- [x] `npm run build --workspace=projects/edu-platform` produces a chunk containing mermaid (confirms dynamic import chunk split).
- [x] `npm run lint` passes.
- [x] Existing `markdownLessonLoader.test.ts` still passes.

#### Manual Verification:
- [ ] In `npm run dev`, visit `/courses/10xdevs-3-prework/lesson/02` — flowchart renders as SVG.
- [ ] DOM inspector shows `<pre class="mermaid" data-processed="true">` containing an `<svg>` child; no copy button on it.
- [ ] Regular ```ts / ```bash code blocks on the same page still have syntax highlighting and a copy button.
- [ ] Open a non-prework page (e.g., `/courses/10xdevs-3/lesson/01`) and confirm Network tab does **not** load the mermaid chunk.
- [ ] Deliberately break one fence (e.g., `graph TD\n  A---Z(` with no closing paren), refresh — page shows the raw DSL inside a `.mermaid-error` box with the Polish error note.
- [ ] Visual spot check across all 7 prework diagrams (lessons 02, 09, 11, before, before2, after, after2).

**Implementation Note:** After completing this phase, pause for manual confirmation before proceeding to Phase 3.

---

## Phase 3: /markdown Export Round-Trip

### Overview
`htmlToMarkdown.ts` strips all `class="..."` attributes before conversion, which discards `language-*` hints. Narrow the regex so `language-*` classes survive and verify `node-html-markdown` re-emits the ` ```mermaid ` fence.

### Changes Required:

#### 1. Narrow the class-stripping regex

**File:** `src/utils/htmlToMarkdown.ts`
**Changes:** Replace the blanket `class="[^"]*"` strip with a version that preserves `language-*` classes on `code` elements.

```ts
// Before (line 27):
.replace(/class="[^"]*"\s*/gi, '') // Strip classes (optional)

// After:
.replace(/class="([^"]*)"\s*/gi, (_match, classes: string) => {
  // Preserve language-* classes so ```<lang> fences round-trip through NodeHtmlMarkdown.
  const preserved = classes
    .split(/\s+/)
    .filter((c) => c.startsWith('language-'))
    .join(' ');
  return preserved ? `class="${preserved}" ` : '';
})
```

#### 2. Test (optional but recommended)

**File:** `src/utils/htmlToMarkdown.test.ts` (if exists — otherwise skip)
**Changes:** If a test file for this util exists, add a case asserting `<pre class="mermaid"><code class="language-mermaid">graph TD...</code></pre>` round-trips to ` ```mermaid\ngraph TD...\n``` `.

### Success Criteria:

#### Automated Verification:
- [x] Full test suite passes: `npm run test --workspace=projects/edu-platform`.
- [x] `npm run lint` passes (pre-existing warnings only, no new issues).

#### Manual Verification:
- [ ] Hit `/shared/<guid>/markdown` for a prework lesson that contains a mermaid diagram — downloaded `.md` includes a verbatim ` ```mermaid ` fence.
- [ ] Feed the downloaded markdown back through the loader (e.g., drop it into a test prework file) — the diagram renders the same way.
- [ ] Regression check: download a lesson with regular code blocks, confirm their ```ts / ```bash fences are still correct (they may have been missing before; this change actually improves that path too).

---

## Phase 4: Manual Verification & Cleanup

### Overview
End-to-end walkthrough of all existing diagrams in dev + production preview. No code changes unless regressions are found.

### Changes Required:

None unless verification reveals issues.

### Success Criteria:

#### Automated Verification:
- [x] `npm run build --workspace=projects/edu-platform && npm run preview --workspace=projects/edu-platform` boots without errors.
- [x] `npm run lint` and `npm run test --workspace=projects/edu-platform` are clean (334/334 tests pass).

#### Manual Verification:
- [ ] All 7 diagrams render correctly in `npm run preview`:
  - [ ] `02-1x2_chatbot_vs_agent_vs_harness.md`
  - [ ] `09-3x1_llmy_i_ich_wplyw_na_codzienna_prace.md`
  - [ ] `11-3x3_cykl_zycia_watku_i_zarzadzanie_kontekstem.md`
  - [ ] `before.md`
  - [ ] `before2.md`
  - [ ] `after.md`
  - [ ] `after2.md`
- [ ] No regressions on non-mermaid code blocks in those same lessons (TS/JS/bash highlighting + copy button still work).
- [ ] Mermaid chunk only loads on pages that need it (DevTools Network tab, filter "mermaid").
- [ ] Diagrams are legible against `bg-gray-900` (dark theme readability check).
- [ ] `/markdown` export of one prework lesson preserves the ```mermaid fence.

---

## Testing Strategy

### Unit Tests
- `markdownLessonLoader.test.ts`: three new cases covering the transformer (single fence, non-mermaid unchanged, multiple fences). Runs in jsdom environment already configured for the file.

### Integration Tests
- None. Client rendering is verified manually (decision captured in questioning).

### Manual Testing Steps
1. `npm run dev --workspace=projects/edu-platform`, log in, visit each of the 7 prework lesson URLs, confirm diagrams render as SVG.
2. Break one fence locally (missing paren / invalid syntax), reload, confirm fallback error UI shows the raw DSL + Polish error note.
3. Visit a non-prework lesson, confirm no Mermaid chunk in the Network tab.
4. `npm run build && npm run preview`, repeat the same spot checks on the production bundle.
5. Hit `/shared/<guid>/markdown` for a prework lesson with a diagram, confirm the downloaded file contains a ` ```mermaid ` fence verbatim.

## Performance Considerations

- Dynamic import gated on `.mermaid` presence: non-prework routes and prework routes without diagrams pay zero JS cost.
- Mermaid ~500 KB gzipped adds a distinct chunk; one-time cost per session (HTTP cache will satisfy subsequent lessons).
- Rendering is synchronous once the library loads; no layout thrash because containers already reserve space (content height preserved by the raw DSL text during the FOUC window).
- No server cost — Cloudflare Worker response is unchanged beyond the tiny class rewrite done at build time.

## Migration Notes

- Existing 7 prework lessons require **no content changes** — fences render after the new pipeline ships.
- No data migration; content lives in the repo.
- Rollback: revert Phase 1 + Phase 2 commits; `mermaid` dependency can be left in `package.json` or removed. Phase 3 (class regex narrowing) is safe to keep.

## References

- Research: `thoughts/shared/research/2026-04-18-mermaid-rendering-in-prework-lessons.md`
- Loader integration point: `src/server/content/markdownLessonLoader.ts:55-65`
- Collection definition: `src/content.config.ts:81-84`
- Lesson render component: `src/components/Lesson.astro:10-15`
- Client post-processing: `src/layouts/LayoutScripts.astro:1-168`
- Export pipeline: `src/utils/htmlToMarkdown.ts:27`
- Existing test pattern: `src/server/content/markdownLessonLoader.test.ts:1-50`
- Content files with mermaid fences: `src/content/lessons10xDevs3Prework/{02,09,11,before,before2,after,after2}*.md`

<!-- PLAN COMPLETED: 2026-04-20 -->
