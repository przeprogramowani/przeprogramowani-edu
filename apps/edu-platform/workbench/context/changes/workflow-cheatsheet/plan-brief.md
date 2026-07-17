# 10x Workflow Skills Cheatsheet — Plan Brief

> Full plan: `context/changes/workflow-cheatsheet/plan.md`
> Frame brief: `context/changes/workflow-cheatsheet/frame.md`
> Research: `context/changes/workflow-cheatsheet/research.md`

## What & Why

Students asked for a 10x-workflow summary covering, per skill, *what it does · when to use it · how to chain it*. We're building a **module-organized reference card** for the **23 M1–M3 workflow skills** (+7 prompts), where each cell answers *what it does · when to use it · its input→output artifact*, and a compact chain strip preserves the "how to chain" half of the ask without becoming the primary structure.

## Starting Point

No cheatsheet exists. The change folder already holds a complete `research.md` that maps the entire content surface — the net-new-skills-per-lesson table (§2), the chain topology (§3), per-skill capsules (§5), the prompts (§6), and the house-voice quotes (§7) — plus a HIGH-confidence frame that locked the three load-bearing axes.

## Desired End State

A single self-contained `workflow-cheatsheet.html` (Tailwind via CDN, zero build) that opens in any browser: M0→M3 module lanes, each skill rendered as a color-coded cell (by skill "shape") with command · PL purpose · PL when-to-use · input→output file · first-taught lesson, a compact chain strip with branch forks, and a "supporting cast" box. A screenshot script exports a high-res shareable PNG.

## Key Decisions Made

| Decision            | Choice                                              | Why (1 sentence)                                                              | Source   |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| Artifact JOB        | Reference card (what each skill does)               | Student ask + user pinned "what does each do" as the lead                     | Frame    |
| Organizing lens     | By module (M0→M3)                                   | User confirmed; module-axis ≈ chain-axis because course teaches in order      | Frame    |
| Coverage            | 23 M1–M3 skills only (+7 prompts)                   | Locked scope; 6 registry skills are out of M1–M3 scope                        | Frame    |
| "How to chain"      | Required content layer (cell field + flow strip)    | Student ask explicitly says "how to chain it" — can't be dropped              | Frame    |
| Medium              | HTML+Tailwind now, image export later               | HTML is the iterable, diffable, legible source of truth                       | Plan     |
| Peripheral tiers    | "Supporting cast" box only (no bonus/M4-M5 lanes)   | Answers "what about these?" without diluting the locked 23-skill core         | Plan     |
| Visual encoding     | Color-code 3 skill shapes + chain strip             | Makes the "chain is the product" insight visible at a glance                  | Plan     |
| Export method       | Screenshot the HTML (Playwright/Puppeteer)          | Pixel-perfect fidelity vs. generative models' legibility risk over 23 cells   | Plan     |

## Scope

**In scope:** 23 M1–M3 skills, 7 prompts (as footnotes), module lanes, shape color-coding, chain strip with branch forks, supporting-cast box, PL learner copy / EN commands+filenames, screenshot export.

**Out of scope:** platform publishing (`src/content*`, Circle, deploy); 6 out-of-scope registry skills; M4–M5 placeholder lane; generative image export; build pipeline/framework; prompts as first-class cells.

## Architecture / Approach

A single HTML file with an embedded structured dataset (skills, prompts, lanes, chain nodes) that the layout iterates over. Content is drafted/reviewed first (Phase 1), then rendered into Tailwind lanes + a hand-authored CSS flow strip (Phase 2), then screenshotted to PNG (Phase 3). The dataset is the source of truth, so fixing a cell is a one-line data edit. Lives in `workbench/artifacts/workflow-cheatsheet/` — editorial, platform-agnostic.

## Phases at a Glance

| Phase                 | What it delivers                                    | Key risk                                                        |
| --------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| 1. Content dataset    | All 23 skills + 7 prompts as PL-voiced structured data | Using cumulative course-content arrays instead of net-new per lesson |
| 2. HTML+Tailwind page | Rendered lanes, color-coded cells, chain strip      | Keeping 23 cells + arrows legible and responsive               |
| 3. Image export       | High-res shareable PNG via headless screenshot      | Unstyled-flash capture / cut-off lanes                         |

**Prerequisites:** `research.md` (present); access to `10x-toolkit/.../SKILL.md` for capsule verification; a headless browser package (Playwright/Puppeteer) for Phase 3.
**Estimated effort:** ~1–2 sessions across 3 phases (most effort in Phase 1 copy + Phase 2 layout).

## Open Risks & Assumptions

- Net-new-per-lesson grouping must key off `research.md` §2, not the cumulative `course-content` arrays — easy to get wrong.
- Tailwind Play CDN requires network at page-open time; acceptable for an editorial artifact.
- PL copy quality depends on faithful reuse of the §7 voice register; needs human spot-check in Phase 1.

## Success Criteria (Summary)

- A student opens one HTML page and finds every M1–M3 skill grouped by module, knowing at a glance what it does, when to reach for it, and what file it reads/writes.
- The chain strip answers "how do these connect" (greenfield/brownfield fork → per-change loop → execution siblings) without burying the per-skill reference.
- A legible PNG export exists for sharing, faithful to the HTML.
