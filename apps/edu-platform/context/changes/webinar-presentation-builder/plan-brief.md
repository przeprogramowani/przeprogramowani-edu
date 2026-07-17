# Webinar Presentation Builder — Plan Brief

> Full plan: `context/changes/webinar-presentation-builder/plan.md`
> Research: `context/changes/webinar-presentation-builder/research.md`

## What & Why

The webinar pipeline (planner → material → writer) stops at conceptual slide descriptions. This plan adds a standalone skill that converts talking-points.md into a working React slide deck using the framework from `10x-bench/slides/`. The framework moves into the monorepo as `projects/slides/`, keeping React isolated from edu-platform.

## Starting Point

Three webinar skills exist and produce structured markdown (research.md, talking-points.md, demo-ideas.md) in `thoughts/shared/webinars/<slug>/`. The slides framework at `10x-bench/slides/` has 15 reusable components, a dark editorial design system, and a proven `{ id, render }` slide registration pattern. The two systems aren't connected — the gap between "conceptual slide description" and "rendered slide deck" is entirely manual.

## Desired End State

A speaker runs the existing pipeline, then invokes `/10x-webinar-presentation <slug>`. The skill reads the talking-points, proposes a component mapping table, and — after approval — generates a complete `slides.jsx` file. The speaker runs `npm run dev` in `projects/slides/` and sees their slide deck in the browser, ready for rehearsal and refinement.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|---|---|---|---|
| Workspace placement | `projects/slides/` in monorepo | Isolates React from edu-platform's "No React" rule while keeping it in the same repo | Research |
| Skill independence | Standalone, not added to writer orchestrator | Not every webinar needs rendered slides — the speaker decides when to build a deck | Research |
| Slide storage | Per-webinar (`webinars/<slug>/slides.jsx`) | Clean isolation — multiple decks coexist without overwriting each other | Plan |
| Switching mechanism | Re-export file in `src/deck/slides.jsx` | No build config changes needed; Vite HMR works naturally; git diff shows active deck | Plan |
| Asset handling | Placeholder paths + TODO checklist | Non-blocking — deck is immediately previewable; images sourced manually | Plan |
| Complex data slides | Flag + scaffold with closest standard component | Keeps generation non-blocking; speaker refines during rehearsal | Plan |
| Background image | Default with optional per-webinar override | Zero friction by default, customizable when needed | Plan |
| Content migration | Migrate existing webinar in Phase 1 | Validates the new path structure immediately | Plan |

## Scope

**In scope:**
- Copy slides framework to `projects/slides/` as new monorepo workspace
- Migrate webinar content from `thoughts/shared/webinars/` to `projects/slides/webinars/`
- Update three existing skills' output paths
- Create new presentation builder skill with approval gate
- End-to-end validation with existing example webinar

**Out of scope:**
- Modifying pipeline logic (only paths change)
- Automating image/asset creation
- Building custom per-presentation components
- Adding TypeScript to the slides framework
- Removing the original `10x-bench/slides/`

## Architecture / Approach

The presentation builder is a new Claude Code skill (`.claude/skills/10x-webinar-presentation/SKILL.md`) that parses the structured `**Slajd:**` descriptions in talking-points.md, maps each slide to one of 15 system.jsx components using pattern-matching heuristics, and generates JSX. Per-webinar decks live in `projects/slides/webinars/<slug>/slides.jsx`; a thin re-export in `src/deck/slides.jsx` points Vite at the active deck.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Framework Setup & Content Migration | Working `projects/slides/` workspace with migrated content | Dependency conflicts with existing monorepo workspaces |
| 2. Update Existing Skills | All three skills write to new path | Missed path reference in a skill file |
| 3. Create Presentation Builder Skill | Complete skill specification with parsing, mapping, approval, generation | Heuristic table may not cover all slide description patterns |
| 4. End-to-End Validation | Generated slide deck from example webinar | Generated JSX may have import/rendering errors |

**Prerequisites:** Access to `10x-bench/slides/` filesystem, existing webinar content in `thoughts/shared/webinars/`
**Estimated effort:** ~2 sessions across 4 phases

## Open Risks & Assumptions

- The heuristic mapping table is based on one example webinar — may need tuning as more webinars are processed
- Generated slides.jsx will likely need manual polish (tone adjustments, data enrichment for complex slides, image sourcing)
- The `10x-bench/slides/` framework is assumed stable — any upstream changes won't automatically propagate

## Success Criteria (Summary)

- A speaker can run `/10x-webinar-presentation <slug>` and get a working slide deck in the browser within minutes
- The generated deck uses appropriate components for each slide's content type
- The existing pipeline continues to work with the new output path
