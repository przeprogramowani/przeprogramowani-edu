<!-- IMPL-REVIEW-REPORT -->

# Implementation Review: Mermaid Diagram Rendering in 10xDevs 3.0 Prework Lessons

- **Plan**: thoughts/shared/plans/2026-04-18-mermaid-rendering-in-prework-lessons.md
- **Scope**: All 4 phases
- **Date**: 2026-04-20
- **Verdict**: NEEDS ATTENTION
- **Findings**: 0 critical, 2 warnings, 3 observations

## Verdicts

| Dimension            | Verdict |
| -------------------- | ------- |
| Plan Adherence       | PASS    |
| Scope Discipline     | PASS    |
| Safety & Quality     | WARNING |
| Architecture         | PASS    |
| Pattern Consistency  | WARNING |
| Success Criteria     | PASS    |

## Findings

### F1 — WARNING — [Safety & Quality] securityLevel: 'loose' in Mermaid init

- **Location**: src/layouts/LayoutScripts.astro:~186
- **Detail**: `securityLevel: 'loose'` disables Mermaid's internal sanitization, allowing click callbacks and `javascript:` hrefs in diagram SVGs. Content is trusted (repo-owned markdown), but `'strict'` renders all standard diagrams identically and only blocks interactive click handlers — which these diagrams don't use.
- **Fix**: Change `securityLevel` from `'loose'` to `'strict'`.
- **Decision**: PENDING

### F2 — WARNING — [Pattern Consistency] `<style is:global>` in LayoutScripts

- **Location**: src/layouts/LayoutScripts.astro:~220
- **Detail**: Other layout files (BaseLayout, CourseLayout, SharedLessonLayout) use scoped `<style>` only. LayoutScripts uses `is:global` which breaks the established pattern. However, LayoutScripts needs global reach because it targets dynamically-generated DOM content injected via `set:html`. Scoped styles wouldn't match these elements. This is a justified exception.
- **Fix**: No change needed — justified use of `is:global` for targeting `set:html` content. Document as intentional if needed.
- **Decision**: PENDING

### F3 — OBSERVATION — [Safety & Quality] escapeHtml missing single-quote escape

- **Location**: src/layouts/LayoutScripts.astro:~210-216
- **Detail**: `escapeHtml` escapes `&`, `<`, `>`, `"` but not single quotes (`'`). Currently safe because output is used as text content inside `<code>`, not inside HTML attributes. Adding `&#39;` would be defense-in-depth.
- **Fix**: Add `.replace(/'/g, '&#39;')` as the final step in `escapeHtml`.
- **Decision**: PENDING

### F4 — OBSERVATION — [Safety & Quality] innerHTML = svg from mermaid.render()

- **Location**: src/layouts/LayoutScripts.astro:~195
- **Detail**: SVG string from `mermaid.render()` is set via `innerHTML`. With `securityLevel: 'strict'`, Mermaid sanitizes SVG output internally, making this acceptable. Risk is only elevated when combined with `securityLevel: 'loose'` (F1).
- **Fix**: No action needed if F1 is resolved (change to `'strict'`).
- **Decision**: PENDING

### F5 — OBSERVATION — [Safety & Quality] htmlToMarkdown regex only handles double-quoted class attributes

- **Location**: src/utils/htmlToMarkdown.ts:~27
- **Detail**: The class-preserving regex matches `class="..."` but not `class='...'` (single-quoted). All current input sources (Circle.so HTML, local markdown) use double quotes, so this is fine in practice.
- **Fix**: No action needed unless input sources change. If needed, add a parallel regex for single-quoted attributes.
- **Decision**: PENDING
