# 10x Workflow Skills Cheatsheet Implementation Plan

## Overview

Build a self-contained HTML + Tailwind reference card for the **23 M1–M3 workflow skills** (plus their 7 prompts) that students requested. The page is organized into module lanes (M0→M3); each skill cell answers *what it does · when to use it · its input→output artifact · where it's first taught*, color-coded by skill "shape" (document-generator / execution-driver / read-only register). A compact end-to-end chain strip preserves the "how to chain" half of the student ask (greenfield/brownfield fork, per-change loop, execution siblings). A small "supporting cast" box covers advisory skills mentioned in drafts. A final phase produces a high-res shareable PNG by screenshotting the finished page.

This is an **editorial workbench artifact**, not platform content. It must not touch `src/content*` or any deployment surface.

## Current State Analysis

- No cheatsheet artifact exists yet. The change folder holds `change.md`, `frame.md`, and a complete `research.md`.
- The canonical content is already mapped in `research.md`:
  - §2 — net-new-skills-per-lesson table (the grouping backbone; cumulative `course-content` arrays must NOT be used).
  - §3 — chain topology (foundation bootstrap + per-change loop + status lifecycle).
  - §5 — per-skill capsule data (purpose · when · in→out artifact · complexity) with refs into `ai-artifacts/skills/<name>/SKILL.md`.
  - §7 — house voice quotes for the "when to use" / "how to chain" copy register.
- The frame brief (`frame.md`) settled the three load-bearing axes — JOB = reference, lens = by module, coverage = 23 only — and elevated "how to chain" from afterthought to a **required content layer**.
- The workbench is platform-agnostic and editorial; `workbench/CLAUDE.md` forbids modifying `src/content*` without explicit publishing intent.

## Desired End State

A single file `workbench/artifacts/workflow-cheatsheet/workflow-cheatsheet.html` that:

- Opens directly in any browser with **no build step** (Tailwind via Play CDN), is responsive, and is diffable as source.
- Shows M0→M3 module lanes; within each lane, the **net-new** skills/prompts for each lesson (keyed off `research.md` §2).
- Renders each skill as a cell with: command (e.g. `/10x-plan`), one-line PL purpose, PL when-to-use trigger, **input file → output file**, and "first taught in mNlN".
- Tints each cell by one of three shapes with a visible legend: document-generator (writes an artifact and STOPs), execution-driver (mutates `## Progress`), read-only register (scores/appends, doesn't drive).
- Includes one compact chain strip showing the foundation branch (greenfield vs brownfield), the per-change loop (`new → [frame/research] → plan → [plan-review] → implement/tdd/e2e → impl-review → archive`), and the three interleavable execution siblings sharing one `plan.md` + `## Progress`.
- Includes a labelled "supporting cast" box for `10x-cli-setup`, `10x-cli-guide`, `skill-creator` (advisory, not part of the workflow chain).
- Carries the required annotations: `/10x-frame` = situational lifeline (koło ratunkowe), implement/tdd/e2e share one plan + `## Progress`, `10x-archive` is wired-but-draft-silent.
- Learner-facing copy in **Polish**; skill names, commands, and artifact filenames in **English**.

Plus a sibling Node script `screenshot.mjs` that headlessly renders the page and writes a high-res `workflow-cheatsheet.png` next to it.

### Verification

- The HTML file opens standalone and displays all 23 skills + 7 prompts across 4 module lanes with no missing cells.
- The screenshot script produces a legible PNG where every command, arrow, and artifact filename is readable.

### Key Discoveries:

- **Use net-new per lesson, not cumulative arrays** — `course-content` lessons spread prior skills, so each lesson array contains all earlier skills (`research.md` §2, Architecture Insights).
- **Three skill shapes to color-code** — generators / drivers / registers (`research.md` Architecture Insights).
- **Chain is the product** — the input→output artifact pairing is the highest-value field, not prose (`research.md` §3, Architecture Insights).
- **Edge cases** — `10x-archive` wired but draft-silent; `10x-frame` situational lifeline (`m2-l4/lesson-draft.md:376-379`); `10x-tdd`/`10x-e2e` first-taught = m3-l2 / m3-l4 despite forward references (`research.md` §1).
- **House voice quotes** ready to reuse (`research.md` §7), e.g. the TDD gate one-liner and "powtarzalny proces → skill".

## What We're NOT Doing

- Not publishing into the platform: no edits to `src/content*`, Circle, Astro collections, or deployment config.
- Not including the 6 out-of-scope registry skills (`10x-deployment`, `10x-auto-implement`, `10x-contract`, `10x-status`, `10x-impl-review-ci`, `autoresearch`) — locked out by the frame.
- Not adding a "coming in M4–M5" placeholder lane.
- Not using generative image models (nano-banana / GPT-image) for the export — research flags legibility/correctness risk across 23 cells; export is a faithful screenshot of the HTML.
- Not promoting the 7 prompts to first-class cells — they are secondary per-lesson footnotes (the four `m1l5-*` grouped as one deploy sub-sequence).
- Not introducing a build pipeline, bundler, or framework — single self-contained HTML file.

## Implementation Approach

Separate **content** from **layout** so the PL copy can be reviewed before it's wrapped in markup. Phase 1 produces a single structured dataset (embedded JS object inside the eventual HTML, drafted/reviewed first) capturing every skill, prompt, lane, shape, and chain node. Phase 2 renders that dataset into the Tailwind page with the color legend and chain strip. Phase 3 adds a headless screenshot script for the shareable image. The dataset is the source of truth; the layout iterates over it so adding/fixing a cell is a one-line data edit.

## Phase 1: Content Dataset (PL)

### Overview

Assemble the canonical, review-ready content for every cell and chain node, drafted in Polish house voice, sourced entirely from `research.md`. No layout yet — this is the data contract the page renders.

### Changes Required:

#### 1. Skill dataset

**File**: `workbench/artifacts/workflow-cheatsheet/workflow-cheatsheet.html` (the `<script>` data block — created here, rendered in Phase 2)

**Intent**: Capture the 23 in-scope skills as structured records so the layout can iterate over them without hardcoding cells. Draft the PL `purpose` and `whenToUse` copy in house voice now, while the research is fresh.

**Contract**: One record per skill with fields: `command` (EN, e.g. `/10x-plan`), `purpose` (PL, ≤1 line), `whenToUse` (PL trigger), `inputArtifact` / `outputArtifact` (EN filenames, e.g. `prd.md → tech-stack.md`; `—` for none), `firstTaught` (`mNlN`), `shape` (`generator` | `driver` | `register`), `module` (`M0`–`M3`), `lesson` (`m1l1`…), and optional `note` (e.g. frame=lifeline, archive=wired-but-draft-silent). Populate from `research.md` §5 (capsules), §2 (lesson/module + first-taught), and Architecture Insights (shape). Use the m3-l2 / m3-l4 first-taught values for tdd/e2e, not the forward references.

#### 2. Prompt entries

**File**: same data block

**Intent**: Capture the 7 prompts as secondary per-lesson footnote entries, with the four `m1l5-*` grouped as one deploy sub-sequence.

**Contract**: Records with `name`, `lesson`, one-line PL description; a `group` key joining the four `m1l5-*` prompts. Sourced from `research.md` §6.

#### 3. Chain-strip topology + supporting cast

**File**: same data block

**Intent**: Encode the chain nodes/edges the strip will draw, plus the supporting-cast advisory skills.

**Contract**: A chain structure expressing: foundation branch (`init → shape → prd` then greenfield `tech-stack-selector → bootstrapper` vs brownfield `stack-assess → health-check`, converging at `agents-md`); per-change loop (`new → [frame/research] → plan → [plan-review] → implement/tdd/e2e → impl-review → archive`); the three execution siblings marked as sharing one `plan.md` + `## Progress`. Supporting cast: `10x-cli-setup`, `10x-cli-guide`, `skill-creator` with one-line PL descriptions. Sourced from `research.md` §3, §1.

### Success Criteria:

#### Automated Verification:

- The HTML file parses as valid HTML and the embedded data block is syntactically valid JS (opens in a browser with no console error).
- All 23 skills and 7 prompts are present in the dataset (count check).

#### Manual Verification:

- PL copy reads in house voice (spot-check against `research.md` §7 quotes); EN preserved for commands/filenames.
- Each skill's input→output artifact matches `research.md` §5.
- Shape assignment (generator/driver/register) is correct for the three execution drivers and the registers.

**Implementation Note**: After Phase 1 automated checks pass, pause for human confirmation that the PL copy and artifact mappings are accurate before building the layout.

---

## Phase 2: HTML + Tailwind Page

### Overview

Render the Phase 1 dataset into the responsive reference card: module lanes, color-coded cells with legend, the chain strip, and the supporting-cast box.

### Changes Required:

#### 1. Page scaffold + Tailwind

**File**: `workbench/artifacts/workflow-cheatsheet/workflow-cheatsheet.html`

**Intent**: Provide a zero-build, responsive shell with the Tailwind Play CDN and a header explaining the card and the shape legend.

**Contract**: Standard HTML5 doc, Tailwind Play CDN `<script>`, `lang="pl"`, a title/intro, and a shape legend (three tinted swatches: generator / driver / register). No external assets beyond the CDN.

#### 2. Module lanes + skill cells

**File**: same file

**Intent**: Lay out M0→M3 lanes; within each lane group skills by lesson (net-new only) and render each as a cell with the five fields, tinted by shape.

**Contract**: Iterate the dataset grouped by `module` then `lesson`. Each cell shows command (prominent), PL purpose, PL when-to-use, `input → output` artifact line, and "first taught mNlN". Background tint keyed to `shape` matching the legend. Notes (frame=lifeline, archive=wired-but-draft-silent) rendered as a small badge/caption. Responsive: lanes stack on narrow widths.

#### 3. Chain strip + prompts footnotes + supporting cast

**File**: same file

**Intent**: Draw the compact end-to-end flow with branch forks, attach prompt footnotes per lesson, and add the supporting-cast box.

**Contract**: Hand-authored HTML/CSS flow strip (flexbox + arrow glyphs `→`, no mermaid) showing the foundation fork (greenfield/brownfield), the per-change loop, and the three execution siblings annotated as sharing `plan.md` + `## Progress`. Prompts rendered as small per-lesson footnotes (the `m1l5-*` group shown as one 4-step sub-sequence). A labelled "supporting cast" box lists the three advisory skills.

### Success Criteria:

#### Automated Verification:

- File opens in a headless browser with no console errors (validated by the Phase 3 script's page load).

#### Manual Verification:

- All 4 module lanes render with the correct net-new skills per lesson (no duplicated/cumulative skills).
- Shape color-coding matches the legend; the three execution drivers and registers are visually distinct from generators.
- Chain strip reads correctly: greenfield/brownfield fork, per-change loop order, execution siblings sharing one plan.
- Renders legibly at desktop and narrow/mobile widths.
- PL learner copy with EN commands/filenames throughout; required annotations present.

**Implementation Note**: After Phase 2, pause for human visual confirmation in a real browser (desktop + narrow width) before building the export.

---

## Phase 3: Image Export

### Overview

Add a headless screenshot script that renders the finished HTML and writes a high-resolution shareable PNG — a faithful capture of the source of truth, not a generative image.

### Changes Required:

#### 1. Screenshot script

**File**: `workbench/artifacts/workflow-cheatsheet/screenshot.mjs`

**Intent**: Produce `workflow-cheatsheet.png` from the local HTML file at high resolution so every command, arrow, and filename is readable.

**Contract**: A Node script using Playwright (or Puppeteer) that loads the local `workflow-cheatsheet.html` via `file://`, sets a wide viewport + `deviceScaleFactor` ≥ 2, waits for the Tailwind CDN to finish styling (network idle), and captures a full-page screenshot to `workflow-cheatsheet.png`. A short `README.md` in the folder documents the run command and which package provides the headless browser.

### Success Criteria:

#### Automated Verification:

- `node workbench/artifacts/workflow-cheatsheet/screenshot.mjs` exits 0 and writes `workflow-cheatsheet.png`.

#### Manual Verification:

- The PNG is legible at full zoom: all 23 skill cells, the chain strip arrows, and artifact filenames are readable.
- The image matches the browser rendering (no cut-off lanes, no unstyled flash captured).

**Implementation Note**: After Phase 3, pause for human confirmation that the exported PNG is share-quality.

---

## Testing Strategy

### Manual Testing Steps:

1. Open `workflow-cheatsheet.html` in a browser; confirm all 4 lanes and 23 skills + 7 prompts render.
2. Cross-check 3–4 random skills' input→output artifacts against `research.md` §5.
3. Verify the chain strip branch forks and the execution-sibling annotation.
4. Resize to mobile width; confirm lanes stack and remain readable.
5. Run the screenshot script; open the PNG and confirm legibility at full zoom.

### Automated Checks:

- Dataset count assertion (23 skills, 7 prompts) — a quick inline check or a one-off node assertion.
- Headless page load with zero console errors (covered by the screenshot script run).

## References

- Frame brief: `context/changes/workflow-cheatsheet/frame.md`
- Research: `context/changes/workflow-cheatsheet/research.md` (§2 net-new table, §3 chain topology, §5 capsules, §6 prompts, §7 voice)
- Skill sources: `10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md`
- Skill→lesson wiring: `10x-toolkit/packages/course-content/src/courses/10xdevs3/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Content Dataset (PL)

#### Automated

- [x] 1.1 HTML file parses; embedded data block is valid JS (no console error) — e9cf2221
- [x] 1.2 All 23 skills and 7 prompts present in dataset (count check) — e9cf2221

#### Manual

- [x] 1.3 PL copy reads in house voice; EN preserved for commands/filenames — e9cf2221
- [x] 1.4 Each skill's input→output artifact matches research §5 — e9cf2221
- [x] 1.5 Shape assignment correct for execution drivers and registers — e9cf2221

### Phase 2: HTML + Tailwind Page

#### Automated

- [x] 2.1 File opens headless with no console errors — ecf3fd2b

#### Manual

- [x] 2.2 All 4 module lanes render with correct net-new skills per lesson — ecf3fd2b
- [x] 2.3 Shape color-coding matches legend; drivers/registers distinct from generators — ecf3fd2b
- [x] 2.4 Chain strip reads correctly (forks, loop order, shared-plan siblings) — ecf3fd2b
- [x] 2.5 Legible at desktop and narrow widths — ecf3fd2b
- [x] 2.6 PL learner copy with EN commands/filenames; required annotations present — ecf3fd2b

### Phase 3: Image Export

#### Automated

- [x] 3.1 `node screenshot.mjs` exits 0 and writes `workflow-cheatsheet.png`

#### Manual

- [x] 3.2 PNG legible at full zoom (cells, arrows, filenames readable)
- [x] 3.3 Image matches browser rendering (no cut-off, no unstyled flash)
