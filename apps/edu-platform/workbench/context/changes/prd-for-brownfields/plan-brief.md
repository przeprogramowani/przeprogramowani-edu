# Brownfield Support for M1 Lessons — Plan Brief

> Full plan: `workbench/context/changes/prd-for-brownfields/plan.md`
> Research: `workbench/context/changes/prd-for-brownfields/research.md`

## What & Why

Extend M1 lessons (m1-l1 through m1-l3) and their underlying skills to support brownfield projects alongside greenfield. Currently the greenfield assumption is pervasive — /10x-shape has 3 hard guards refusing brownfield, /10x-tech-stack-selector assumes choosing-from-scratch, /10x-bootstrapper literally scaffolds new projects. But prework [4.2] already promises brownfield support, and ~40% of coursants will work on existing projects, not greenfield ideas.

## Starting Point

The M1 module is a linear greenfield pipeline: idea → PRD → tech-stack.md → scaffolded repo → agent onboarding. ~40-65% of lesson content is universally applicable (permission policies, execution gates, defense-in-depth, quality gates, tool taxonomy) and needs reframing, not rewriting. The /10x-shape skill already has a `context_type` field (hardcoded to `greenfield`), and /10x-prd has no greenfield guards at all.

## Desired End State

Both greenfield and brownfield learners have a complete, skill-backed M1 workflow. The greenfield pipeline stays as-is. The brownfield pipeline runs in parallel: brownfield shape → brownfield PRD → stack assessment → health check. Both converge at m1-l4 (agent onboarding) with equivalent-quality context artifacts. Each lesson has dedicated brownfield sections (not sidebars — full sections).

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|---|---|---|---|
| Mode detection | Auto-detect from cwd + user confirms | Reduces friction — brownfield users don't need to know there's a mode flag | Plan |
| Stack assessment | New /10x-stack-assess skill (standalone) | Choosing a stack vs assessing one are fundamentally different jobs | Plan |
| PRD template | Separate brownfield template (12 sections) | Each template is optimized for its mode — delta-framing can't be bolted onto greenfield sections | Plan |
| m1-l3 brownfield | New /10x-health-check skill | Parity with greenfield chain — each lesson step has a skill | Plan |
| Phasing | 9 phases — 3 per lesson (Skills → Schema → Lesson) | Each lesson gets a complete vertical slice; skills testable before schema validates | Plan |
| PRD routing | Auto-route from shape-notes.md context_type | Mode decision propagates seamlessly through the chain | Plan |
| Demo strategy | No brownfield demo in M1 | Brownfield demo is M4 territory; M1 supports with skills and sections | Research |
| PRD versioning | No version bump — break freely | No existing users of the schema | Research |
| Prework | No changes needed | Prework [4.2] already explicitly supports brownfield | Research |

## Scope

**In scope:**
- Extend /10x-shape with brownfield mode (auto-detect, reframed phases, brownfield output)
- Create separate brownfield PRD template for /10x-prd (12 sections, auto-routed)
- Create new /10x-stack-assess skill (4 quality gates as evaluation lens)
- Create new /10x-health-check skill (dependency audit, test/CI analysis, agent-readiness)
- Update lessons-schema.json for m1-l1, m1-l2, m1-l3 (owns, outcomes, fragments, video placeholders)
- Revise lesson specs and drafts for m1-l1, m1-l2, m1-l3 (dedicated brownfield sections)

**Out of scope:**
- Brownfield demo walkthrough (M4 territory)
- Changes to m1-l4 or m1-l5 (already path-agnostic)
- Changes to /10x-tech-stack-selector or /10x-bootstrapper (remain greenfield-only)
- Prework changes
- Forking existing skills

## Architecture / Approach

The greenfield pipeline stays untouched. A parallel brownfield pipeline runs alongside it, sharing universal content (permissions, gates, defense-in-depth) and diverging at skill-specific points. Mode detection happens once at /10x-shape (auto-detect from cwd) and propagates via `context_type` in shape-notes.md through the chain. Two new skills (/10x-stack-assess, /10x-health-check) replace /10x-tech-stack-selector and /10x-bootstrapper for brownfield. Both pipelines converge at m1-l4.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. m1-l1 Skills | /10x-shape brownfield mode + brownfield PRD template | Auto-detection heuristic edge cases (monorepos, stale files) |
| 2. m1-l1 Schema | lessons-schema.json m1-l1 brownfield entries | Overlap with m1-l2/l3 brownfield concepts |
| 3. m1-l1 Lesson | Revised spec + draft with brownfield sections | Disrupting greenfield narrative flow |
| 4. m1-l2 Skills | New /10x-stack-assess skill | Assessment quality depends on codebase analysis depth |
| 5. m1-l2 Schema | lessons-schema.json m1-l2 populated (was empty) | Populating from scratch — must match existing spec |
| 6. m1-l2 Lesson | Revised spec + draft with brownfield sections | Reframing quality gates without duplicating reference doc |
| 7. m1-l3 Skills | New /10x-health-check skill | Scope creep — health-check vs generic CI tools |
| 8. m1-l3 Schema | lessons-schema.json m1-l3 brownfield entries | Three execution gates mapping accuracy |
| 9. m1-l3 Lesson | Revised spec + draft with brownfield sections | Universal content must read naturally for both paths |

**Prerequisites:** Access to 10x-toolkit repo for skill changes. Existing lesson specs/drafts/grounding in workbench.
**Estimated effort:** ~9 sessions across 9 phases (one session per phase)

## Open Risks & Assumptions

- Auto-detection heuristic may misfire in monorepo subdirs or dirs with stale project files — mitigation: user confirmation step
- Separate brownfield PRD template means 2 templates to maintain — accepted tradeoff for cleaner separation
- /10x-stack-assess and /10x-health-check quality depends on codebase analysis depth — shallow scans may produce generic results
- m1-l2 schema is currently empty — populating it from scratch introduces risk of inconsistency with the existing spec

## Success Criteria (Summary)

- A brownfield learner completes the full M1 brownfield chain (shape → PRD → stack-assess → health-check) and arrives at m1-l4 with agent-ready context artifacts
- Greenfield path is completely unchanged — no regressions
- Each lesson's brownfield sections are self-contained and don't duplicate or conflict with other lessons' brownfield content
