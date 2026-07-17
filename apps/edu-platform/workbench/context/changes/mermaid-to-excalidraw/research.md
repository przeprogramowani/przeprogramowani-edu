---
date: 2026-05-09T18:00:00+02:00
researcher: Claude (Opus 4.6)
git_commit: a300f1fc
branch: master
repository: przeprogramowani-sites
topic: "Can we render mermaid diagrams as Excalidraw visuals?"
tags: [research, diagrams, mermaid, excalidraw, rendering-pipeline]
status: complete
last_updated: 2026-05-09
last_updated_by: Claude (Opus 4.6)
---

# Research: Mermaid → Excalidraw Rendering

**Date**: 2026-05-09
**Git Commit**: a300f1fc
**Branch**: master

## Research Question

Can we render mermaid diagrams from lesson content as Excalidraw-style visuals instead of standard mermaid SVG/PNG? Would this look better?

## Summary

**Not recommended right now.** The conversion is technically possible — `@excalidraw/mermaid-to-excalidraw` v2.2.2 is maintained by the Excalidraw team and handles flowcharts natively — but three hard blockers make it impractical for our styled diagrams:

1. **`<br/>` tags render as literal text** (open bugs #89, #91, #98) — our styled diagrams use `<br/>` for multi-line labels in every node.
2. **`<small>` HTML is not supported** — stripped to plain text, destroying the two-tier label hierarchy (primary + secondary text) we use throughout.
3. **Dark-mode theming conflicts** — Excalidraw's dark mode uses CSS `filter: invert()` which mangles custom hex colors. Our Tailwind-based palette (`#1e293b`, `#3b82f6`, etc.) would not survive the dark-mode toggle.

If the Excalidraw team resolves the HTML label issues, this could be revisited. Even then, the aesthetic tradeoff — from precise/designed to hand-drawn/sketchy — is a conscious choice that may or may not suit polished course materials.

## Detailed Findings

### 1. Current Mermaid Pipeline

Our existing pipeline in `workbench/scripts/render-mermaid.mjs`:

- Scans lesson markdown for ` ```mermaid ` code blocks
- Calls `mmdc` (`@mermaid-js/mermaid-cli`) via Puppeteer
- Outputs SVG + PNG (@2x) to `workbench/assets/diagrams/`
- Content-hash cache (`.render-cache.json`) skips unchanged diagrams
- Dark theme configured via `MMDC_CONFIG` with Tailwind slate palette
- Parallel rendering with configurable concurrency
- **23 diagrams** across 5+ lessons currently rendered

Key features we rely on in mermaid labels:
- `<br/>` for line breaks in styled diagrams
- `<small>` for secondary/annotation text
- Emoji at start of labels (semantic anchoring)
- Polish text with diacritics (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- Inline `style` directives mapping to semantic colors (blue/green/amber/red/purple strokes)

### 2. @excalidraw/mermaid-to-excalidraw Package

**Version:** 2.2.2 · **Downloads:** ~208K/week · **Repo:** [excalidraw/mermaid-to-excalidraw](https://github.com/excalidraw/mermaid-to-excalidraw) (803 stars)

**Natively supported diagram types:**

| Type | Status |
|------|--------|
| Flowchart (`flowchart-v2`, `graph`) | Native conversion |
| Sequence diagram | Native conversion |
| Class diagram | Native conversion |
| ER diagram | Native conversion |
| State diagram | Native conversion |
| Everything else | SVG image fallback (non-editable) |

**API:**

```typescript
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
const { elements, files } = await parseMermaidToExcalidraw(mermaidCode, config);
```

Returns Excalidraw "skeleton" elements that need a second pass through `convertToExcalidrawElements()` from `@excalidraw/excalidraw`.

**What it handles well:**
- Node labels (plain text) ✓
- Edge labels ✓
- Subgraphs (with caveats — cross-group edge bug #83)
- Inline `style` directives: `fill` → `backgroundColor`, `stroke` → `strokeColor` ✓
- `classDef` class definitions ✓
- Layout positions (extracted from mermaid's dagre layout via SVG DOM) ✓

**What it does NOT handle:**

| Feature | Status | Impact on us |
|---------|--------|-------------|
| `<br/>` in labels | Renders as literal text (bugs #89, #91, #98) | **Blocker** — every styled diagram uses `<br/>` |
| `<small>` HTML | Stripped — no rich text support (issue #78) | **Blocker** — secondary text lost |
| Arbitrary HTML in labels | Not supported | **Blocker** |
| Emoji in labels | Likely works (Unicode passthrough) but untested | Low risk |

**Runtime requirement:** Requires a browser DOM (`document.createElement`, `getBBox`). Does NOT run in plain Node.js — needs Puppeteer/Playwright or jsdom.

### 3. Excalidraw → SVG/PNG Export Pipeline

Since the mermaid-to-excalidraw conversion produces `.excalidraw` JSON, we need a second step to get SVG/PNG for lesson content.

**Options ranked by fit:**

| Tool | Approach | SVG | PNG | Dark mode | Node.js | Stability |
|------|----------|-----|-----|-----------|---------|-----------|
| `@swiftlysingh/excalidraw-cli` v1.2.0 | jsdom + resvg-js | ✓ | ✓ | ✓ (`--dark`) | ✓ | Depends on `@excalidraw/utils` 0.1.3-test32 (prerelease) |
| Puppeteer (Kroki-style) | Bundle excalidraw + React, headless Chrome | ✓ | ✓ | ✓ | ✓ (via Puppeteer) | Highest fidelity, most complex setup |
| `excalirender` v1.10.5 | node-canvas + roughjs (standalone binary) | ✓ | ✓ | ✓ | Binary (not npm) | No macOS binary confirmed |
| `excalidraw-brute-export-cli` v0.4.0 | Playwright + Firefox | ✓ | ✓ | ✓ | ✓ | Slow, downloads Firefox (~200MB) |
| `excalidraw-to-svg` v3.1.0 | jsdom + @excalidraw/utils | ✓ | ✗ | ✗ | ✓ | SVG only, no dark mode |

**Best fit for our pipeline:** `@swiftlysingh/excalidraw-cli` (pure Node, SVG+PNG, dark mode) or Puppeteer approach (highest fidelity, we already use Puppeteer for mermaid). Both are viable but add significant complexity vs the current single-step `mmdc` call.

### 4. Dark-Mode and Visual Quality

**The dark-mode problem is architectural.** Excalidraw's dark mode applies `CSS filter: invert() hue-rotate()` to the entire canvas. This:
- Mangles custom hex colors (our `#1e293b` becomes unpredictable)
- Is designed for the default light-theme palette, not custom dark palettes
- Has known export bugs (issue #8944 — PNG exports don't preserve dark theme)

**Workaround:** Set `viewBackgroundColor: "#0f172a"` and set all element colors explicitly, never using Excalidraw's dark-mode toggle. This works but means fighting the tool rather than using it.

**Hand-drawn aesthetic:**
- `roughness: 0` = clean/architect style, `roughness: 1` = hand-drawn (default), `roughness: 2` = very sketchy
- Controlled per-element in JSON, not at export time
- Default `hachure` fill style makes text hard to read inside nodes (D2 team criticism)
- `solid` fill is more readable and is auto-selected when mermaid `fill` colors are present

**Font rendering:**
- Excalifont (hand-drawn) covers Latin including Polish diacritics
- Emoji renders in system emoji font (visual mismatch with hand-drawn text)
- No support for rich text / HTML formatting within elements (issue #8400 — closed as "not planned")

**Layout quality:** Positions are extracted from mermaid's own dagre layout, so spatial arrangement should be similar. LR/TD directions are preserved.

### 5. Aesthetic Tradeoff

| Dimension | Current Mermaid SVG/PNG | Excalidraw Conversion |
|-----------|----------------------|----------------------|
| Visual style | Clean, precise, "designed" | Hand-drawn, sketchy, "informal" |
| Custom dark palette | Full control | Colors survive but dark-mode toggle mangles them |
| `<small>` secondary text | Supported | **Lost** — plain text only |
| `<br/>` line breaks | Supported | **Broken** — literal text |
| Emoji | SVG rendering | System emoji font (style mismatch) |
| Polish diacritics | Full support | Likely works in Excalifont |
| Editability | Edit mermaid source text | Edit mermaid source OR edit in Excalidraw UI |
| Pipeline complexity | Single step (mmdc) | Two steps (convert + export) |

## Code References

- `workbench/scripts/render-mermaid.mjs` — current rendering pipeline
- `workbench/mermaid-style-guide.md` — 13 rules governing diagram style
- `workbench/assets/diagrams/` — 23 rendered diagrams (SVG + PNG)
- `workbench/assets/diagrams/.render-cache.json` — content-hash cache
- `workbench/.claude/skills/mermaid/SKILL.md` — mermaid skill (render/audit/generate modes)

## Architecture Insights

The current pipeline is cleanly designed: mermaid source of truth lives in markdown, rendering is deterministic and cacheable, output is static SVG/PNG. Switching to Excalidraw would either:

1. **Keep mermaid as source → convert → export** (two-step pipeline, mermaid still the source of truth, but with HTML label degradation), or
2. **Switch to `.excalidraw` JSON as source** (lose text-based diffability, gain Excalidraw UI editing, need new authoring workflow)

Option 1 is blocked by the label bugs. Option 2 is a fundamental workflow change that trades Git-diffable text diagrams for binary-ish JSON files edited in a visual tool.

## Open Questions

1. **Would fixing the `<br/>` bug upstream unblock this?** Partially — `<small>` would still be unsupported, and the dark-mode inversion problem remains. We would need to use `roughness: 0` (architect style) with explicit colors and skip Excalidraw's dark-mode toggle entirely.

2. **Is there a middle ground?** Possible alternatives that preserve the current pipeline:
   - **Mermaid with `handDrawn` look** — Mermaid v11+ has a `look: handDrawn` option that uses rough.js within mermaid itself, giving a hand-drawn aesthetic without leaving the mermaid ecosystem. This would be a single config change, no pipeline changes needed.
   - **Custom CSS on mermaid SVGs** — additional styling (rounded corners, shadows, gradients) applied post-render.

3. **Is the Excalidraw team likely to fix the label issues?** PR #91 has been open since late 2024. Issue #98 from April 2026 is recent. The merge cadence is slow (PRs sit for months).

## Recommendation

**Short term:** Investigate Mermaid's built-in `look: handDrawn` option (available since Mermaid v11). This gives the hand-drawn aesthetic without any pipeline changes, preserves all HTML label features, and works with the existing dark-mode theme. This is the lowest-risk path to "looking better."

**Long term:** Monitor `@excalidraw/mermaid-to-excalidraw` issues #89, #91, #98. If `<br/>` support lands and `<small>` gets at least basic handling, revisit. The package is actively maintained and the conversion quality for plain-text flowcharts is good.

**Not recommended:** Switching to `.excalidraw` JSON as the source format. This abandons the text-based, Git-diffable, AI-authorable workflow that the workbench is built around.
