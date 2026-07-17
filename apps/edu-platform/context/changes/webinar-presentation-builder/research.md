---
date: 2026-05-07T14:30:00+02:00
researcher: Claude Opus 4.6
git_commit: 3bbf239fe8734cb320993f2f72dad90474bc9718
branch: master
repository: przeprogramowani-sites
topic: "Add presentation-building skill to the webinar pipeline"
tags: [research, codebase, webinar-skills, slides-framework, presentation-builder]
status: complete
last_updated: 2026-05-07
last_updated_by: Claude Opus 4.6
---

# Research: Add presentation-building skill to the webinar pipeline

**Date**: 2026-05-07T14:30:00+02:00
**Researcher**: Claude Opus 4.6
**Git Commit**: 3bbf239fe8734cb320993f2f72dad90474bc9718
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How to extend the webinar skills pipeline with a new skill that builds a React+Vite slide deck from the materials (talking-points.md, demo-ideas.md, research.md) produced by the existing pipeline, using the slide framework bootstrapped in `/Users/admin/code/10x-bench/slides/`.

## Summary

The existing webinar pipeline (planner → material → writer) produces structured markdown output with a well-defined format per slide. The slides framework at `10x-bench/slides/` is a self-contained React 19 + Tailwind 3 + Vite 8 app with 15 reusable slide components and a dark editorial design system. The two can be connected by a new skill that (1) parses talking-points.md to extract slide structure, (2) maps each slide to the best component from `system.jsx`, (3) presents the mapping for user approval, then (4) generates `slides.jsx` + updates `index.html`. The framework should be moved to `projects/slides/` as a new monorepo workspace, keeping React isolated from the "No React" constraint in edu-platform.

## Detailed Findings

### 1. Existing Webinar Pipeline Architecture

Three skills form a sequential pipeline, orchestrated by `10x-webinar-writer`:

```
Phase 1: 10x-webinar-planner  →  research.md + plan (in chat) + approval gate
Phase 2: 10x-webinar-material →  talking-points.md + demo-ideas.md
Phase 3: NEW SKILL            →  slides.jsx + index.html (slide deck)
```

**Key files:**
- `.claude/skills/10x-webinar-planner/SKILL.md` — research + plan + approval gate
- `.claude/skills/10x-webinar-material/SKILL.md` — talking points + demo ideas from approved plan
- `.claude/skills/10x-webinar-writer/SKILL.md` — orchestrator (Phase 1 → Phase 2)
- `.claude/skills/webinar-style.md` — 14 editorial rules for talking-points quality

**Pipeline output location:** `thoughts/shared/webinars/<YYYY-MM-DD>-<slug>/`

**Current limitations:** The pipeline stops at conceptual slide descriptions. The `10x-webinar-material` SKILL.md explicitly states: "Does not design slides visually (color, layout, fonts) — it describes what's on each slide conceptually." The new skill fills this gap.

### 2. Talking-Points Format (Pipeline Output)

Each `##` heading in `talking-points.md` represents one slide. The structure per slide is:

```markdown
## N. <Title> (time range)
**Slajd:** <visual description of what's on screen>
**Cel sekcji:** <one-line section goal>

**Talking points:**
- <cue 1>
- <cue 2>
- ...

**Moment show:** <demo reference or "tylko tell">
**Przejście:** <transition to next slide>
```

**Metadata at the top:**
```markdown
**Data:** <date> · **Czas:** ~60 min · **Format:** live + Q&A
**Teza:** <thesis>
**Takeaway:** <one-liner>
```

**Structural signals for component mapping:**
| Signal in talking-points.md | Best slide component |
|---|---|
| Slide 0 (Hook) with a big number/stat | `NumberSlide` or `TitleSlide` |
| `**Slajd:** diagram —` or comparison | `InsightSlide` with `Compare`/`CompareCol` |
| `**Slajd:** tabelka` | Custom table slide or `ListSlide` |
| `**Slajd:** screenshot` / `zrzut ekranu` | `ImageSlide` or `FullImageSlide` |
| `**Slajd:** code snippet` / `terminal` | `CodeSlide` |
| `**Slajd:** cytat` / quote | `QuoteSlide` |
| Section breaks / act transitions | `SectionSlide` |
| Lists of bullet points (3-7 items) | `ListSlide` |
| Single big idea, centered | `StatementSlide` |
| Opening/CTA with title + meta | `TitleSlide` |
| Numbered insight with tag | `InsightSlide` |
| Skill demo reference | `SkillTheorySlide` |

**Observed in the example webinar (claude-code-od-prototypu-do-produktu):**
- 10 slides (## 0 through ## 9) + appendix + sources
- Mix of conceptual visual descriptions (`**Slajd:** diagram — three columns...`)
- `**Moment show:** **→ Demo X**` references pointing to demo-ideas.md
- Transitions as forward-looking questions/tensions (per style guide)

### 3. Slides Framework Architecture

**Location:** `/Users/admin/code/10x-bench/slides/`
**Stack:** React 19 + Tailwind 3 + Vite 8 (no TypeScript)
**Target location:** `projects/slides/` (new monorepo workspace)

#### File structure:
```
slides/
├── index.html          — Vite host (title, fonts, #root)
├── src/
│   ├── main.jsx        — React entrypoint
│   ├── App.jsx         — Deck runtime (navigation, fullscreen, hash tracking, progress bar, cursor visibility)
│   └── deck/
│       ├── system.jsx  — 15 reusable slide components + primitives
│       └── slides.jsx  — Presentation content (data + composition)
├── styles.css          — Tailwind + component layer (~750 lines)
├── tailwind.config.js  — Design tokens (colors via CSS vars, fonts, responsive type scale)
├── postcss.config.js   — PostCSS config
├── vite.config.js      — Vite + React plugin
├── assets/             — Static images
└── dist/               — Vite build output
```

#### Component inventory (`system.jsx`):

| Component | Props | Purpose |
|---|---|---|
| `SlideShell` | active, act, step, variant | Base wrapper for all slides |
| `TitleSlide` | kicker, title, meta | Opening/CTA slides |
| `StatementSlide` | title, subtitle, display | One big idea, centered |
| `SectionSlide` | title, label | Act/chapter break |
| `SplitShowcaseSlide` | badge, badgeVariant, title, chips, tags, note, image, alt | Two-column text + screenshot |
| `ImageSlide` | title, subtitle, image, alt, imageSize, caption, titleDisplay | Image-led slide |
| `FullImageSlide` | image, alt | Full-viewport image |
| `CodeSlide` | label, children (JSX), footer, width | Code/prompt/terminal block |
| `ListSlide` | label, labelTone, title, items, footer | Bullet list (supports check items) |
| `QuoteSlide` | quote, cite | Large blockquote |
| `NumberSlide` | value, label, note, tone | Large numeric callout |
| `InsightSlide` | number, tone, tag, title, children, centered, image, alt, imageSize | Numbered insight |
| `SkillTheorySlide` | demo, command, title, points, launch, tone | Skill demo card |
| `Compare` / `CompareCol` | vs, centered / title | Comparison grid |
| `Stat` | value, label, tone | Stat primitive |
| `Em` | tone, gradient, children | Inline emphasis (color/gradient) |

All components accept `active` (visibility) and `act` (narrative grouping) props via `SlideShell`.

#### Design system:
- **Colors:** CSS custom properties — `--bg: #0a0a0f`, `--surface: #16162a`, `--accent: #a78bfa` (purple), `--accent2: #38bdf8` (blue), `--warm: #fb923c`, `--positive: #4ade80`, `--negative: #f87171`
- **Typography:** Space Grotesk (display) + JetBrains Mono (code), fully responsive via `clamp()` type scale
- **Background:** Dark editorial style with background image + radial gradient vignette
- **Animations:** `pop-in` for numbers/stats, `list-fade-in` for bullet items, smooth slide transitions
- **Navigation:** Keyboard (arrows, space, enter, F for fullscreen), click zones (left/right thirds), touch swipe, URL hash tracking

#### Slide registration pattern:
Slides are exported as an array of `{ id, render }` objects in `slides.jsx`:
```jsx
export const slides = [
  { id: "title", render: (active) => <TitleSlide active={active} act="1" title={...} /> },
  { id: "slide-2", render: (active) => <ListSlide active={active} act="1" items={...} /> },
  // ...
];
```

The `render` function receives `active: boolean` and returns JSX. `App.jsx` iterates over this array and toggles visibility.

#### Content authoring pattern (from the 10xBench example):
The existing `slides.jsx` (1553 lines) mixes data and composition. Some slides have inline data (arrays of models, criteria), others use dedicated sub-components (`StepsSlide`, `ScorecardSlide`, `LeaderboardSlide`, `PlanComparisonSlide`). These custom per-presentation components live in `slides.jsx` alongside the standard composition.

### 4. Mapping Pipeline Output → Slide Components

The core challenge: talking-points.md describes slides **conceptually** (what the audience sees described in text), while `system.jsx` components need **structured props** (title strings, item arrays, image paths, tone values).

**Parsing strategy:**

1. **Split on `##`** — each `## N. Title (time)` becomes a slide entry
2. **Extract metadata** — parse `**Slajd:**`, `**Cel sekcji:**`, `**Talking points:**`, `**Moment show:**`, `**Przejście:**`
3. **Classify component** — use the `**Slajd:**` visual description + bullet count + structural signals (see table above) to pick the best component
4. **Extract props** — map bullet text → `items[]`, title → `title`, sources → `Em` wrappers, etc.
5. **Handle images** — `**Slajd:** screenshot...` or `**Slajd:** diagram...` signals need placeholder `image` props; the skill should note which slides need manually sourced assets

**What the skill CAN automate:**
- Component selection based on slide description patterns
- Title, subtitle, label, items, footer text extraction
- Source citation formatting (`Em` tone wrappers for quoted sources)
- `act` grouping based on section numbering
- Slide ordering and `id` generation
- `index.html` title update
- Appendix/bonus slides

**What the skill CANNOT automate (requires human input):**
- Image assets (screenshots, diagrams, photos) — these need to be created/sourced separately
- Precise data for table/leaderboard slides (numbers, scores, names)
- Custom per-presentation components (like the `LeaderboardSlide` or `ScorecardSlide` in the 10xBench example)
- Color/tone choices beyond defaults
- The `background.png` image (presentation-specific)

### 5. Integration Design Decisions

**Decision 1: Workspace placement** — `projects/slides/` as new monorepo workspace.
- Add to root `package.json` workspaces array
- Self-contained Vite build, no dependency on edu-platform
- Webinar skill references by path: `projects/slides/`
- The `system.jsx` + `styles.css` + `tailwind.config.js` + `App.jsx` form the reusable "framework"
- Per-presentation content lives in `src/deck/slides.jsx` (overwritten per webinar)

**Decision 2: Interactive skill with approval gates.**
- Step 1: Skill reads talking-points.md, research.md, demo-ideas.md
- Step 2: Proposes a slide-by-component mapping in chat (table format)
- Step 3: User approves or corrects the mapping
- Step 4: Skill generates `slides.jsx` + updates `index.html`
- Step 5: Skill lists which slides need manual assets
- This mirrors the planner → material approval flow the user already uses

**Decision 3: Framework vs content separation.**
The reusable framework files that stay constant across presentations:
- `src/App.jsx` — navigation runtime
- `src/main.jsx` — React entrypoint
- `src/deck/system.jsx` — component library
- `styles.css` — design system CSS
- `tailwind.config.js` — design tokens
- `postcss.config.js`, `vite.config.js` — build config
- `index.html` — host (only `<title>` changes per presentation)

The per-presentation files that the skill generates:
- `src/deck/slides.jsx` — slide content + custom sub-components
- `assets/` — presentation-specific images (skill lists needed assets, user provides them)

**Decision 4: Standalone skill — does NOT modify the existing pipeline.**
The new skill is completely separate from the planner → material → writer pipeline. It does not extend the orchestrator, does not add a Phase 3, and does not touch any existing skill files. The user runs the full pipeline first, then invokes the presentation builder as an independent follow-up step when they want a slide deck. Not every webinar needs rendered slides — some only need talking points.

The existing pipeline remains unchanged:
```
planner → material → writer   (existing, untouched)
                                    ↓ user decides to build slides
                            presentation-builder   (new, standalone)
```

### 6. Skill Design Sketch

**Name:** `10x-webinar-presentation` (or `10x-webinar-slides`)
**Trigger:** User asks to build slides / create a presentation / zrób slajdy / zbuduj prezentację from existing webinar materials
**Input:** Path to webinar materials directory (`projects/slides/webinars/<YYYY-MM-DD>-<slug>/`)
**Output:** Updated `projects/slides/src/deck/slides.jsx` + `projects/slides/index.html` title

**Proposed flow:**

```
1. READ inputs
   ├── talking-points.md (required)
   ├── research.md (for sources, thesis, audience profile)
   └── demo-ideas.md (for demo beat placement)

2. READ framework
   └── projects/slides/src/deck/system.jsx (available components)

3. PARSE talking-points.md
   ├── Extract slide entries (## headings)
   ├── Extract metadata per slide (**Slajd:**, **Talking points:**, etc.)
   └── Extract global metadata (title, date, thesis, takeaway)

4. CLASSIFY each slide → component
   ├── Pattern match **Slajd:** description against component heuristics
   ├── Consider bullet count, presence of images/code/quotes
   └── Assign act grouping from section numbering

5. PRESENT mapping in chat (approval gate)
   | # | Title | Component | Rationale | Needs assets? |
   |---|-------|-----------|-----------|---------------|
   | 0 | Hook  | NumberSlide | "big number in Slajd:" | No |
   | 1 | Czym jest CC | InsightSlide + Compare | "diagram — three columns" | Yes: diagram asset |
   | ... | ... | ... | ... | ... |

6. WAIT for user approval / corrections

7. GENERATE slides.jsx
   ├── Import statements from system.jsx
   ├── Slide entries as { id, render } objects
   ├── Inline data arrays where needed
   ├── Em wrappers for emphasis/sources
   └── Placeholder image paths for missing assets (with TODO comments)

8. UPDATE index.html <title>

9. REPORT
   ├── File paths written
   ├── Slide count
   ├── List of assets needed (with suggested filenames)
   └── "Run `npm run dev` in projects/slides/ to preview"
```

### 7. Moving the Framework — What to Bring

From `10x-bench/slides/`, copy to `projects/slides/`:

**Bring (framework):**
- `index.html` — update `<title>` to be generic
- `src/main.jsx` — as-is
- `src/App.jsx` — as-is
- `src/deck/system.jsx` — as-is (the reusable component library)
- `styles.css` — as-is (the design system)
- `tailwind.config.js` — as-is (design tokens)
- `postcss.config.js` — as-is
- `vite.config.js` — as-is
- `package.json` — as-is (dependencies)
- `CLAUDE.md` — adapt to reference the new skill and generic presentation workflow

**Bring (as example/template):**
- `src/deck/slides.jsx` — rename to `src/deck/slides.example.jsx` for reference
- `assets/background.png` — keep as default background

**Do NOT bring:**
- `node_modules/`, `dist/` — regenerated
- `package-lock.json` — regenerated by workspace install
- Presentation-specific assets (10x-*.jpg, filmstrips, etc.) — stay in 10x-bench

**Workspace registration:**
Add `"projects/slides"` to root `package.json` `workspaces` array.

## Code References

- `.claude/skills/10x-webinar-planner/SKILL.md` — planner skill (Phase 1)
- `.claude/skills/10x-webinar-material/SKILL.md` — material skill (Phase 2)
- `.claude/skills/10x-webinar-writer/SKILL.md` — orchestrator
- `.claude/skills/webinar-style.md` — editorial rules for talking-points quality
- `10x-bench/slides/src/deck/system.jsx` — 15 reusable slide components
- `10x-bench/slides/src/deck/slides.jsx` — example presentation content (1553 lines, ~60 slides)
- `10x-bench/slides/src/App.jsx` — deck navigation runtime
- `10x-bench/slides/styles.css` — design system CSS (750 lines)
- `10x-bench/slides/tailwind.config.js` — design tokens
- `10x-bench/slides/CLAUDE.md` — framework development guidelines
- `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/talking-points.md` — example pipeline output
- `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/demo-ideas.md` — example demo ideas
- `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/research.md` — example research

## Architecture Insights

### The pipeline is designed for composition, not coupling

Each skill in the webinar pipeline is self-contained with clear inputs/outputs and approval gates. The new presentation builder follows the same pattern — it reads files produced by earlier phases and produces its own artifact. The `10x-webinar-writer` orchestrator doesn't need to change; the presentation skill is invoked separately by the user.

### The component system is a closed vocabulary

`system.jsx` provides 15 components that cover the common presentation patterns. The existing 10xBench deck (60+ slides) uses all of them plus 7 custom per-presentation components for data-heavy slides (leaderboards, scorecards, step grids). The skill should handle the standard components automatically and flag when a slide needs a custom component.

### The talking-points format has reliable structural signals

The `**Slajd:**` line consistently describes the visual layout, making component classification feasible via pattern matching. The style guide's "Slide descriptions are visual" rule ensures this signal stays high-quality across webinars.

### Content is Polish, code comments are English

Both the slides framework CLAUDE.md and the monorepo CLAUDE.md agree: slide content in Polish, code in English. The skill must preserve this convention.

## Historical Context

- `context/changes/improve-webinar-skills/` (status: implemented) — Added audience-adaptive discovery flow to planner, argument map + post-draft review to material skill, and created the webinar style guide. This recent work establishes the quality floor the presentation builder should maintain.
- The webinar pipeline was built incrementally: planner first, then material, then orchestrator, then style guide improvements. Adding the presentation builder continues this pattern.

## Follow-up: Refined Scope Decisions (2026-05-07)

User clarified the broader scope during research:

### What moves to `projects/slides/`

| Artifact | Current location | New location | Notes |
|---|---|---|---|
| Slide framework (system.jsx, App.jsx, styles, config) | `10x-bench/slides/` | `projects/slides/` | Core framework files |
| Webinar content (research.md, talking-points.md, demo-ideas.md) | `thoughts/shared/webinars/<slug>/` | `projects/slides/webinars/<slug>/` | Per-webinar subfolders |
| Generated slide deck (slides.jsx, assets/) | N/A (new) | `projects/slides/src/deck/slides.jsx` | Generated per webinar |

### What stays where it is

| Artifact | Location | Reason |
|---|---|---|
| Webinar skills (planner, material, writer, presentation-builder) | `.claude/skills/` (repo root) | Must be available from any CWD |
| Webinar style guide | `.claude/skills/webinar-style.md` | Referenced by material skill, repo-wide |

### Impact on existing skills

The three existing webinar skills currently write to `thoughts/shared/webinars/<slug>/`. They must be updated to write to `projects/slides/webinars/<slug>/` instead. The directory structure per webinar stays identical:

```
projects/slides/webinars/<YYYY-MM-DD>-<slug>/
├── research.md          ← written by planner
├── talking-points.md    ← written by material skill
├── demo-ideas.md        ← written by material skill
└── (slides generated by presentation-builder into src/deck/)
```

The presentation builder reads from a webinar subfolder and writes to `projects/slides/src/deck/slides.jsx`.

### Full workspace structure

```
projects/slides/
├── CLAUDE.md              ← adapted from 10x-bench/slides/CLAUDE.md
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── styles.css
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── deck/
│       ├── system.jsx         ← reusable component library
│       ├── slides.jsx         ← generated per webinar (overwritten)
│       └── slides.example.jsx ← reference example from 10xBench
├── assets/
│   └── background.png         ← default background
└── webinars/                   ← webinar content library
    ├── 2026-05-07-claude-code-od-prototypu-do-produktu/
    │   ├── research.md
    │   ├── talking-points.md
    │   └── demo-ideas.md
    └── <future-webinars>/
```

## Open Questions

1. **Background image per presentation** — Should each webinar have a custom `background.png`, or reuse the default dark one? The 10xBench example uses a space-themed image that's presentation-specific.

2. **Custom data-heavy slides** — When talking-points reference complex data (leaderboards, comparison tables), should the skill generate custom sub-components or ask for structured data input?

3. **Assets pipeline** — The skill can identify which slides need images. Options: (a) user provides manually, (b) skill generates prompts for image generation tools, (c) placeholder images with TODO markers.

4. **Live preview integration** — Should the skill auto-run `npm run dev` and open a browser, or instruct the user?

5. **Existing content migration** — The current webinar (`thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/`) needs to move to `projects/slides/webinars/`. Should this happen as part of the framework move, or separately?

6. ~~**Webinar-writer orchestrator update**~~ — **Settled:** standalone skill, no changes to the writer orchestrator. The user invokes the presentation builder separately after the pipeline finishes.
