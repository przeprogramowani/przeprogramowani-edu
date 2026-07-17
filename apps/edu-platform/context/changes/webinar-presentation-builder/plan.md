# Webinar Presentation Builder — Implementation Plan

## Overview

Extend the webinar skills pipeline with a standalone presentation-building skill that converts talking-points.md into a React slide deck. The slides framework (React 19 + Tailwind 3 + Vite 8) moves from `10x-bench/slides/` into the monorepo as `projects/slides/`, a new workspace isolated from edu-platform's "No React" constraint. Per-webinar content and generated slide decks live in `projects/slides/webinars/<slug>/`, with a re-export file in `src/deck/slides.jsx` pointing at the active deck.

## Current State Analysis

The webinar pipeline has three skills forming a sequential chain:
- **10x-webinar-planner** → produces `research.md` + plan in chat
- **10x-webinar-material** → produces `talking-points.md` + `demo-ideas.md`
- **10x-webinar-writer** → orchestrates planner → material with approval gates

All three currently write to `thoughts/shared/webinars/<YYYY-MM-DD>-<slug>/`. The pipeline stops at conceptual slide descriptions — the material skill explicitly states it "does not design slides visually." The slides framework at `10x-bench/slides/` has 15 reusable components (`system.jsx`) and a proven dark editorial design system.

### Key Discoveries:

- `talking-points.md` has reliable structural signals: `**Slajd:**` visual descriptions, `**Talking points:**` bullet lists, `**Moment show:**` demo markers — all parseable via regex
- `system.jsx` exports 15 components covering common presentation patterns; the existing 10xBench deck (60+ slides) uses all of them plus 7 custom per-presentation components
- The component registration pattern is `{ id, render: (active) => <Component /> }` — straightforward to generate
- The `assets()` helper in slides.jsx resolves `/assets/<name>` paths for static images
- The monorepo currently has 7 workspaces; `projects/slides` will be the 8th

## Desired End State

After this plan is complete:
1. `projects/slides/` exists as a functioning monorepo workspace with the slide framework
2. Webinar content lives in `projects/slides/webinars/<slug>/` (existing content migrated)
3. All three existing skills write to the new path
4. A new skill (`10x-webinar-presentation`) can read pipeline output and generate a working slide deck
5. The generated deck is immediately previewable via `npm run dev` in `projects/slides/`

Verification: run the presentation builder against the existing `2026-05-07-claude-code-od-prototypu-do-produktu` webinar and confirm slides render in the browser.

## What We're NOT Doing

- Modifying the existing planner → material → writer pipeline logic (only output paths change)
- Adding the presentation builder to the writer orchestrator (it stays standalone)
- Automating image/asset creation (placeholder + TODO list approach)
- Building custom per-presentation components (skill flags when needed, maps to closest standard component)
- Adding TypeScript to the slides framework (stays plain JSX)
- Removing the original `10x-bench/slides/` (that repo is independent)

## Implementation Approach

Four phases, each independently testable:
1. Establish the slides workspace and migrate content (foundation)
2. Update existing skills to point at the new location (small, safe change)
3. Build the new presentation skill (the core deliverable)
4. Validate end-to-end with the existing example webinar

---

## Phase 1: Framework Setup & Content Migration

### Overview

Copy the slides framework into the monorepo as a new workspace, restructure for per-webinar isolation, and migrate existing webinar content.

### Changes Required:

#### 1. Copy Framework Files

**Source**: `/Users/admin/code/10x-bench/slides/`
**Target**: `projects/slides/`

**Intent**: Bring the complete slide framework into the monorepo. Framework files (system.jsx, App.jsx, styles, configs) are copied as-is. The example slides.jsx becomes a reference file.

**Contract**: Copy these files preserving structure:
- `index.html` → update `<title>` to a generic placeholder (e.g., "Prezentacja — Przeprogramowani")
- `src/main.jsx` → as-is
- `src/App.jsx` → as-is
- `src/deck/system.jsx` → as-is
- `styles.css` → as-is
- `tailwind.config.js` → as-is
- `postcss.config.js` → as-is
- `vite.config.js` → as-is
- `assets/background.png` → as-is (default background)

#### 2. Rename Example Slides

**File**: `projects/slides/src/deck/slides.example.jsx`

**Intent**: Preserve the 10xBench slide deck as a reference example showing how to compose slides from system.jsx components.

**Contract**: Copy `10x-bench/slides/src/deck/slides.jsx` → `projects/slides/src/deck/slides.example.jsx`. No content changes.

#### 3. Create Re-Export Stub

**File**: `projects/slides/src/deck/slides.jsx`

**Intent**: This file is the switching mechanism between per-webinar decks. It's a one-liner re-export that the presentation builder updates to point at the active webinar's slides.

**Contract**: Single re-export line:
```jsx
export { slides } from "../../webinars/2026-05-07-claude-code-od-prototypu-do-produktu/slides.jsx";
```
Initially points at the migrated example webinar (which won't have slides.jsx yet — that's Phase 4). During development, can temporarily re-export from `./slides.example.jsx` for testing.

#### 4. Adapt package.json

**File**: `projects/slides/package.json`

**Intent**: Register as a monorepo workspace with an appropriate name. Keep all existing dependencies.

**Contract**: Set `"name": "@przeprogramowani/slides"`. Keep `"type": "module"`, all existing deps, and scripts (`dev`, `build`, `preview`).

#### 5. Register Workspace

**File**: Root `package.json` (`/Users/admin/code/przeprogramowani-sites/package.json`)

**Intent**: Add `projects/slides` to the monorepo workspaces array so `npm install` manages its dependencies.

**Contract**: Add `"projects/slides"` to the `workspaces` array.

#### 6. Adapt CLAUDE.md

**File**: `projects/slides/CLAUDE.md`

**Intent**: Update the framework's development guide to reflect its new role as a reusable presentation system (not a single 10xBench talk), document the per-webinar structure and the re-export switching pattern.

**Contract**: Rewrite the "What This Is" section to describe a generic slide framework. Add sections covering:
- Per-webinar content structure (`webinars/<slug>/`)
- The `src/deck/slides.jsx` re-export switching pattern
- How the presentation builder skill generates content
- The `slides.example.jsx` reference
- Background override convention (`webinars/<slug>/background.png`)

Keep all existing Design System Rules, Styling Rules, Slide Content Rules, Navigation Behavior, and Verification sections.

#### 7. Migrate Existing Webinar Content

**Source**: `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/`
**Target**: `projects/slides/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/`

**Intent**: Move the existing webinar's pipeline output (research.md, talking-points.md, demo-ideas.md) to the new canonical location.

**Contract**: Move (not copy) the three markdown files. If git-move (`git mv`) is possible, prefer it for history preservation. Create the `webinars/` directory structure.

#### 8. Do NOT Copy Presentation-Specific Assets

**Intent**: The 10xBench-specific images (10x-*.jpg, filmstrips, screenshots of that specific talk) stay in `10x-bench/slides/assets/`. Only `background.png` comes over as the default.

### Success Criteria:

#### Automated Verification:

- `projects/slides/` directory exists with all framework files
- `npm install` from repo root succeeds with the new workspace
- `npm run dev --workspace=@przeprogramowani/slides` starts Vite dev server without errors (using slides.example.jsx re-export temporarily)
- `npm run build --workspace=@przeprogramowani/slides` produces `dist/` without errors
- `projects/slides/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/` contains research.md, talking-points.md, demo-ideas.md
- `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/` no longer exists

#### Manual Verification:

- Open dev server in browser — the example slide deck renders correctly with navigation working (arrows, click zones)
- CLAUDE.md accurately describes the new per-webinar structure

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Update Existing Skills

### Overview

Change the output directory in all three webinar skills from `thoughts/shared/webinars/` to `projects/slides/webinars/`. The directory structure per webinar is unchanged — only the base path moves.

### Changes Required:

#### 1. Update Planner Skill

**File**: `.claude/skills/10x-webinar-planner/SKILL.md`

**Intent**: Change the output path where research.md is written and the `mkdir -p` target directory.

**Contract**: Replace all occurrences of `thoughts/shared/webinars/` with `projects/slides/webinars/`. This affects the `mkdir -p` command and the `research.md` write path.

#### 2. Update Material Skill

**File**: `.claude/skills/10x-webinar-material/SKILL.md`

**Intent**: Change the path where talking-points.md and demo-ideas.md are written, and the path where research.md is read from.

**Contract**: Replace all occurrences of `thoughts/shared/webinars/` with `projects/slides/webinars/`.

#### 3. Update Writer Orchestrator

**File**: `.claude/skills/10x-webinar-writer/SKILL.md`

**Intent**: Change the directory references in the orchestrator and the final report template.

**Contract**: Replace all occurrences of `thoughts/shared/webinars/` with `projects/slides/webinars/`. This includes the report template that prints the directory path.

### Success Criteria:

#### Automated Verification:

- `grep -r "thoughts/shared/webinars" .claude/skills/10x-webinar-*` returns no matches
- `grep -r "projects/slides/webinars" .claude/skills/10x-webinar-*` returns matches in all three skills

#### Manual Verification:

- Read each updated skill file and confirm the path replacement is complete and no stale references remain
- Confirm no other logic was accidentally changed

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Create Presentation Builder Skill

### Overview

Create a new standalone skill (`10x-webinar-presentation`) that reads webinar pipeline output, maps slides to framework components, presents the mapping for approval, and generates a working slides.jsx file.

### Changes Required:

#### 1. Create Skill File

**File**: `.claude/skills/10x-webinar-presentation/SKILL.md`

**Intent**: Define the complete skill specification — input requirements, parsing logic, component mapping heuristics, approval gate, generation template, and output report. This is the core deliverable of the plan.

**Contract**: The skill must implement the following flow:

**Input**: Webinar slug (e.g., `2026-05-07-claude-code-od-prototypu-do-produktu`)
**Source directory**: `projects/slides/webinars/<slug>/`
**Required files**: `talking-points.md` (required), `research.md` (optional — for thesis/sources), `demo-ideas.md` (optional — for demo beat context)

**Step 1 — Read inputs**: Read talking-points.md fully, plus research.md and demo-ideas.md if present. Read `projects/slides/src/deck/system.jsx` to get available component inventory.

**Step 2 — Parse talking-points.md**: Split on `## ` headings. For each section, extract:
- Slide number and title from `## N. Title (time range)`
- Visual description from `**Slajd:**` line
- Section goal from `**Cel sekcji:**` line
- Talking points from `**Talking points:**` bullet list
- Demo marker from `**Moment show:**` line
- Transition from `**Przejście:**` line
- Global metadata from header: date, duration, thesis, takeaway

**Step 3 — Classify each slide → component**: Use heuristic matching on the `**Slajd:**` description:

| Signal in **Slajd:** | Component | Rationale |
|---|---|---|
| Big number, stat, percentage | `NumberSlide` | Large numeric callout |
| `diagram`, `porównanie`, comparison | `InsightSlide` + `Compare`/`CompareCol` | Structured comparison |
| `tabelka`, table | `ListSlide` or `InsightSlide` | Closest standard component + TODO |
| `screenshot`, `zrzut ekranu` | `ImageSlide` or `SplitShowcaseSlide` | Image-led layout |
| `code`, `terminal`, `snippet`, `prompt` | `CodeSlide` | Code/terminal block |
| `cytat`, quote | `QuoteSlide` | Blockquote layout |
| Act/section break, chapter header | `SectionSlide` | Chapter divider |
| List of 3-7 bullet points | `ListSlide` | Standard bullet list |
| Single big idea, short text | `StatementSlide` | Centered impact statement |
| Opening, CTA, title + meta | `TitleSlide` | First/last slide |
| Numbered insight with tag/label | `InsightSlide` | Numbered insight card |
| Demo reference with theory points | `SkillTheorySlide` | Skill demo card |
| Full-bleed image | `FullImageSlide` | Full-viewport image |

When the description is ambiguous or implies complex structured data not covered by standard components, map to the closest standard component and add a `// TODO: this slide may need a custom component or manual data enrichment` comment.

**Step 4 — Present mapping table** (approval gate): Display in chat:

```
| # | Title | Component | Rationale | Needs assets? |
|---|-------|-----------|-----------|---------------|
| 0 | Hook  | NumberSlide | "big number in Slajd:" | No |
| 1 | ...   | ...        | ...       | Yes: diagram  |
```

Wait for user approval or corrections. If the user corrects a mapping, update and re-display if needed.

**Step 5 — Generate slides.jsx**: Write to `projects/slides/webinars/<slug>/slides.jsx`:
- Import all used components from `../../src/deck/system.jsx` (relative path)
- Define `const assets = (name) => \`/assets/\${name}\``
- Export `slides` array as `{ id, render: (active) => <Component /> }` objects
- For each slide: map extracted props (title, items, label, footer, etc.) into component props
- Use `Em` wrappers for emphasis/source citations
- Assign `act` values based on section grouping (derive from slide numbering/narrative structure)
- For image-needing slides: use placeholder paths like `assets("slide-N-description.png")` with a TODO comment
- Content in Polish, code/comments in English

**Step 6 — Update re-export file**: Overwrite `projects/slides/src/deck/slides.jsx` with:
```jsx
export { slides } from "../../webinars/<slug>/slides.jsx";
```

**Step 7 — Handle background**: If `projects/slides/webinars/<slug>/background.png` exists, copy it to `projects/slides/assets/background.png`. Otherwise, the default background remains.

**Step 8 — Report**: Print:
- Files written (with paths)
- Slide count
- Asset checklist: list each slide that needs a manually sourced image, with suggested filename and description
- Command to preview: `cd projects/slides && npm run dev`

**Additional skill specification details:**
- Skill triggers on: "build slides", "create presentation", "zrób slajdy", "zbuduj prezentację", or direct invocation
- If invoked without a slug, the skill should list available webinars in `projects/slides/webinars/` and ask which one to use
- The skill reads `webinar-style.md` for editorial quality context but does not enforce it (that's the material skill's job)
- The skill does NOT modify any existing pipeline skills or the writer orchestrator

### Success Criteria:

#### Automated Verification:

- `.claude/skills/10x-webinar-presentation/SKILL.md` exists and is well-formed
- The skill specification covers all 8 steps (read, parse, classify, approve, generate, re-export, background, report)
- The component mapping heuristic table covers all 15 components from system.jsx
- The skill explicitly states it is standalone and does not modify existing skills

#### Manual Verification:

- Read the skill specification end-to-end and confirm the flow is clear and complete
- Verify the heuristic table makes reasonable component choices for the example webinar's slide descriptions
- Confirm the generated slides.jsx template would produce valid JSX that imports from the correct relative path

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: End-to-End Validation

### Overview

Run the presentation builder skill against the migrated example webinar to prove the full pipeline works — from talking-points.md to a rendered slide deck in the browser.

### Changes Required:

#### 1. Generate Slides for Example Webinar

**Intent**: Invoke the presentation builder skill with the existing `2026-05-07-claude-code-od-prototypu-do-produktu` webinar. Walk through the full flow: parse → classify → approve mapping → generate slides.jsx → update re-export → report assets.

**Contract**: The skill should produce:
- `projects/slides/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/slides.jsx` with ~10 slides matching the talking-points sections
- Updated `projects/slides/src/deck/slides.jsx` re-export pointing at this file
- An asset checklist in chat

#### 2. Verify Dev Server

**Intent**: Start the Vite dev server and confirm the generated slides render correctly.

**Contract**: `npm run dev --workspace=@przeprogramowani/slides` should start without errors, and navigating to `localhost:5173` should show the generated slide deck with navigation working.

#### 3. Verify Build

**Intent**: Ensure the generated code also builds for production.

**Contract**: `npm run build --workspace=@przeprogramowani/slides` should succeed without errors.

### Success Criteria:

#### Automated Verification:

- `projects/slides/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/slides.jsx` exists
- `npm run build --workspace=@przeprogramowani/slides` succeeds
- No import errors or missing component references in the generated file

#### Manual Verification:

- Open the dev server in a browser — slides render with the correct content from talking-points.md
- Navigation works (arrow keys, click zones)
- Placeholder image slides show gracefully (no broken layout)
- Slide count matches the number of `##` sections in talking-points.md
- The asset checklist accurately identifies which slides need images

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- No unit tests needed — the skill is a Claude Code skill (markdown specification), not executable code. The framework files are copied as-is from a working codebase.

### Integration Tests:

- Vite dev server starts and serves the deck
- Vite build produces dist/ without errors
- npm install works with the new workspace

### Manual Testing Steps:

1. Start dev server in `projects/slides/`, navigate through all generated slides
2. Verify each slide uses the expected component (check visual appearance against the mapping table)
3. Test keyboard navigation (arrows, space, F for fullscreen, Home/End)
4. Test click zone navigation (left/right thirds)
5. Invoke the presentation builder skill from a fresh Claude session and walk through the full approval flow
6. Verify that running the planner → material pipeline now writes to `projects/slides/webinars/`

## Performance Considerations

- The slides framework is lightweight (React 19 + Vite 8 + Tailwind 3) — no SSR, no server runtime
- Generated slides.jsx files should stay under 500 lines for typical 10-slide webinars
- Vite HMR makes iteration fast during content editing

## Migration Notes

- Existing content in `thoughts/shared/webinars/` moves to `projects/slides/webinars/` in Phase 1
- The `10x-bench/slides/` repository is NOT modified — the framework is copied, not moved
- After Phase 2, any new webinar created via the pipeline will automatically use the new path
- Old references in git history will point to `thoughts/shared/webinars/` — this is expected and harmless

## References

- Research: `context/changes/webinar-presentation-builder/research.md`
- Slides framework source: `/Users/admin/code/10x-bench/slides/`
- Example webinar output: `thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu/`
- Existing planner skill: `.claude/skills/10x-webinar-planner/SKILL.md`
- Existing material skill: `.claude/skills/10x-webinar-material/SKILL.md`
- Existing writer skill: `.claude/skills/10x-webinar-writer/SKILL.md`
- Webinar style guide: `.claude/skills/webinar-style.md`
- Component library: `10x-bench/slides/src/deck/system.jsx`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Framework Setup & Content Migration

#### Automated

- [x] 1.1 projects/slides/ directory exists with all framework files — b01eefd1
- [x] 1.2 npm install from repo root succeeds with new workspace — b01eefd1
- [x] 1.3 npm run dev starts Vite dev server without errors — b01eefd1
- [x] 1.4 npm run build produces dist/ without errors — b01eefd1
- [x] 1.5 Webinar content migrated to projects/slides/webinars/ — b01eefd1
- [x] 1.6 Old content location removed — b01eefd1

#### Manual

- [ ] 1.7 Example slide deck renders correctly in browser with navigation working
- [ ] 1.8 CLAUDE.md accurately describes the new per-webinar structure

### Phase 2: Update Existing Skills

#### Automated

- [x] 2.1 No references to thoughts/shared/webinars in webinar skills — fbe49ecd
- [x] 2.2 All three skills reference projects/slides/webinars — fbe49ecd

#### Manual

- [ ] 2.3 Each skill file reviewed — path replacement complete, no stale references, no accidental logic changes

### Phase 3: Create Presentation Builder Skill

#### Automated

- [x] 3.1 Skill file exists at .claude/skills/10x-webinar-presentation/SKILL.md — 75976ab0
- [x] 3.2 Specification covers all 8 steps — 75976ab0
- [x] 3.3 Component mapping heuristic table covers all system.jsx components — 75976ab0
- [x] 3.4 Skill explicitly declares standalone (no modifications to existing skills) — 75976ab0

#### Manual

- [ ] 3.5 Skill specification reviewed end-to-end
- [ ] 3.6 Heuristic table produces reasonable mappings for example webinar
- [ ] 3.7 Generated slides.jsx template would produce valid JSX

### Phase 4: End-to-End Validation

#### Automated

- [x] 4.1 Generated slides.jsx exists for example webinar — edfc0c57
- [x] 4.2 npm run build succeeds with generated content — edfc0c57
- [x] 4.3 No import errors or missing component references — edfc0c57

#### Manual

- [ ] 4.4 Slides render correctly in browser with content from talking-points.md
- [ ] 4.5 Navigation works (keyboard, click, touch)
- [ ] 4.6 Placeholder image slides display gracefully
- [ ] 4.7 Slide count matches talking-points sections
- [ ] 4.8 Asset checklist accurately identifies image-needing slides
