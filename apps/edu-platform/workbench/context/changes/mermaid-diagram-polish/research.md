---
date: 2026-05-09T19:00:00+02:00
researcher: Claude (Opus 4.6)
git_commit: a300f1fc
branch: master
repository: przeprogramowani-sites
topic: "How to improve the visual design of mermaid diagrams"
tags: [research, diagrams, mermaid, visual-design, svg-post-processing]
status: complete
last_updated: 2026-05-09
last_updated_by: Claude (Opus 4.6)
---

# Research: Improving Mermaid Diagram Visual Design

**Date**: 2026-05-09
**Git Commit**: a300f1fc
**Branch**: master

## Research Question

How can we improve the visual design of our dark-mode mermaid diagrams to make them look more polished and "designed" rather than default/generic?

## Summary

Three complementary improvement tiers, from lowest to highest effort:

1. **Tier 1 — Config-only** (~5 min): Switch to `look: neo` + better spacing + Inter font. Zero code changes to the render script. Adds built-in drop shadows, softer padding, modern typography.

2. **Tier 2 — CSS injection** (~30 min): Add a CSS file for rounded corners, thicker edges, improved edge contrast, font loading. One new file + one flag added to mmdc calls.

3. **Tier 3 — SVG post-processing** (~2-3 hrs): Add a cheerio-based post-processing step for colored stroke glow, gradient fills, dot-grid backgrounds, custom arrow markers. Most visual impact but most engineering effort.

Recommended approach: **Start with Tier 1 + Tier 2 (combined)**, then evaluate if Tier 3 is needed. The biggest issues are all addressable without post-processing.

## Top 5 Visual Issues (from analyzing rendered diagrams)

| # | Issue | Severity | Current | Fix tier |
|---|-------|----------|---------|----------|
| 1 | Edge/arrow lines nearly invisible | High | 1px `#64748b` on `#0f172a` (~2:1 contrast) | Tier 2 (CSS) |
| 2 | Node padding too tight | Medium | `padding: 15` (default) | Tier 1 (config) |
| 3 | No depth — flat appearance, no shadows | Medium | No shadows, no rounded corners | Tier 1 (`neo` look) |
| 4 | Subgraph borders same as node borders | Medium | Both 1px same treatment | Tier 2 (CSS) |
| 5 | Generic font (Trebuchet MS) | Medium | Default mermaid font stack | Tier 1 (config) + Tier 2 (CSS) |

## Tier 1: Config-Only Changes

### Switch to `look: neo`

Mermaid v11.14.0 introduced `look: neo` — a modern visual treatment with **built-in drop shadows** and **softer node padding**. Supported for flowcharts, sequence, class, ER, state, mindmap, timeline, gitGraph.

The neo look + `theme: base` + custom `themeVariables` gives maximum control with modern visual treatment.

### Better spacing

```json
"flowchart": {
  "padding": 20,
  "nodeSpacing": 60,
  "rankSpacing": 60,
  "diagramPadding": 30,
  "curve": "basis"
}
```

Current defaults: `padding: 15`, `nodeSpacing: 50`, `rankSpacing: 50`. Bumping these reduces the cramped feel.

### Modern font

```json
"themeVariables": {
  "fontFamily": "\"Inter\", system-ui, sans-serif",
  "fontSize": "14px"
}
```

Inter is available as a system font (install via `brew install --cask font-inter`) or loaded via Google Fonts in CSS.

### Implementation

Change `MMDC_CONFIG` in `render-mermaid.mjs`:

```javascript
const MMDC_CONFIG = {
  theme: 'base',
  look: 'neo',
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 60,
    rankSpacing: 60,
    diagramPadding: 30,
    htmlLabels: true,
  },
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '14px',
    // ... rest of existing themeVariables
  },
};
```

## Tier 2: CSS Injection

Create `workbench/scripts/mermaid-custom.css` and pass it via `mmdc -C`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* Modern font */
.nodeLabel, .edgeLabel, .flowchartTitleText, .cluster-label, .label {
  font-family: 'Inter', system-ui, sans-serif !important;
  font-weight: 500;
}

/* Rounded corners — removes the "auto-generated" feel */
.node rect, .node .label-container {
  rx: 6;
  ry: 6;
}
.cluster rect {
  rx: 8;
  ry: 8;
  stroke-width: 2px;
}

/* Thicker, more visible edges */
.flowchart-link {
  stroke-width: 1.5px;
}

/* Bigger arrowheads */
.marker path {
  transform: scale(1.3);
}

/* Edge label pills */
.edgeLabel rect {
  rx: 6;
  ry: 6;
}
```

Then add `-C` flag to mmdc calls in `render-mermaid.mjs`:

```javascript
['-i', mmdPath, '-o', svgOut, '-c', configPath, '-C', cssPath, '-p', puppeteerPath, '-b', '#0f172a']
```

### Edge contrast improvement

The biggest visual fix. Change `lineColor` in themeVariables from `#64748b` (slate-500) to `#94a3b8` (slate-400):

```json
"lineColor": "#94a3b8"
```

This raises contrast from ~2:1 to ~4:1 against the `#0f172a` background.

## Tier 3: SVG Post-Processing (cheerio)

For maximum visual polish, add a post-processing step after SVG generation using cheerio (already installed in the project).

### Colored stroke glow

The highest-impact visual upgrade for dark backgrounds. Per-color SVG filters create a subtle neon glow matching each node's semantic stroke color:

```xml
<filter id="glow-shadow-blue" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="shadowBlur"/>
  <feOffset in="shadowBlur" dx="0" dy="2" result="shadowOffset"/>
  <feFlood flood-color="#000000" flood-opacity="0.4" result="shadowColor"/>
  <feComposite in="shadowColor" in2="shadowOffset" operator="in" result="shadow"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="glowBlur"/>
  <feFlood flood-color="#3b82f6" flood-opacity="0.25" result="glowColor"/>
  <feComposite in="glowColor" in2="glowBlur" operator="in" result="glow"/>
  <feMerge>
    <feMergeNode in="shadow"/>
    <feMergeNode in="glow"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

One filter per stroke color (blue, green, amber, red, purple, gray). Applied by parsing each node's `style` attribute and mapping stroke color to the correct filter.

### Subtle gradient fills

Replace flat `fill:#1e293b` with a barely-perceptible vertical gradient (`#243147` → `#1a2536`). Adds depth without flashiness.

### Dot-grid background

```xml
<pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
  <circle cx="10" cy="10" r="0.5" fill="#1e293b"/>
</pattern>
```

Adds subtle spatial reference behind the diagram.

### Implementation approach

~100-line `postProcessSvg()` function using cheerio with `{ xmlMode: true }`. Runs after mmdc generates SVG, before PNG rasterization. The render script would need restructuring: generate SVG → post-process → rasterize PNG from post-processed SVG (using Puppeteer directly or `@resvg/resvg-js`).

### Performance impact

- Cheerio SVG parsing: <5ms per file (largest SVG is ~28KB)
- SVG filters with 15 nodes: negligible render overhead
- Dot-grid pattern: zero overhead
- Total added time per diagram: ~10-20ms for post-processing

## Mermaid v11 Features We're Not Using

| Feature | What it does | Potential |
|---------|-------------|-----------|
| `look: neo` | Drop shadows, softer padding | High — biggest single upgrade |
| `layout: elk` | Better layout for complex diagrams | Medium — requires `@mermaid-js/layout-elk` |
| `curve: basis` | Smooth B-spline edges | Medium — already likely the default |
| Per-edge styling via `linkStyle` | Color/thickness per edge | Low — verbose, per-diagram |
| `handDrawnSeed` | Deterministic hand-drawn rendering | N/A — hand-drawn look rejected |

## Puppeteer/Node Architecture Fix

Separate issue discovered during testing: the build machine runs x64 Node via Rosetta on Apple M1 Max. This causes a Puppeteer performance warning and ~2x slower rendering.

**Root cause**: Ghostty terminal has "Open using Rosetta" enabled, forcing all child processes to x86_64.

**Fix**: In Finder → `/Applications/Ghostty.app` → Get Info → uncheck "Open using Rosetta" → restart Ghostty → `nvm install 22.14.0` (will install arm64 binary) → `npm install` (rebuild native modules).

## Recommended Next Steps

1. **Test `look: neo`** on the same comparison diagram (HARD-STOP flowchart) — this is the lowest-effort, highest-impact change.
2. **If neo looks good**: implement Tier 1 + Tier 2 together (config changes + CSS file).
3. **Re-render all 23 diagrams** and compare with current output.
4. **Evaluate** whether Tier 3 (stroke glow, gradients) is worth the engineering effort.

## Code References

- `workbench/scripts/render-mermaid.mjs:42-96` — current `MMDC_CONFIG` (where config changes go)
- `workbench/scripts/render-mermaid.mjs:236-267` — `renderBlock()` function (where CSS flag and post-processing would be added)
- `workbench/mermaid-style-guide.md` — current 13 style rules (would need updating if visual treatment changes)
- `workbench/assets/diagrams/` — 23 rendered diagrams + cache

## Open Questions

1. Should `look: neo` be applied globally, or only to styled diagrams (keeping bare diagrams in classic)?
2. Does `neo` interact well with our inline `style` directives on each node?
3. Will the neo look's built-in shadows conflict with our dark background (`#0f172a`)?
4. Does Inter font need to be installed system-wide, or can we rely on Google Fonts via CSS?
