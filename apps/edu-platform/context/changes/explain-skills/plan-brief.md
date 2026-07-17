# Skill Explainer Prompt — Plan Brief

> Full plan: `context/changes/explain-skills/plan.md`
> Frame brief: `context/changes/explain-skills/frame.md`
> Research: `context/changes/explain-skills/research.md`

## What & Why

Learners report being "flooded with thousands of lines of skills" without understanding why they're built that way or how to build their own. The explainer is delivered as a **prompt** (not a skill) to avoid the "skill-on-a-skill" perception that deepens complexity instead of reducing it. It lets learners paste/invoke it in any Claude session to get a structured breakdown of any skill's mechanics.

## Starting Point

19 skills are introduced across M1/M2. Only 1 (`/10x-tech-stack-selector`) is ever explained at the SKILL.md level. The prompt delivery pipeline is fully built but ships zero prompts. All M1/M2 exercises are "run existing skill" — none teaches building.

## Desired End State

Learner at M1-L2+ invokes the skill-explainer prompt on any skill and gets a 7-section report: Purpose & Problem, Chain Position, Anatomy Walkthrough, Most Important Parts, Key Mechanics, Adaptation Guide (easy/medium/hard), and Building Something Similar. The report is specific to the skill analyzed, scales depth to complexity, and gives actionable building advice.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|----------|--------|-------------------|--------|
| Format | Prompt, not skill | "Skill na skilla" would be perceived as deepening the problem | Frame |
| Placement | M1-L2 only | Natural home — skill anatomy is taught here | Plan |
| Lesson edits | None | Prompt is self-discoverable via CLI; video covers progressive path separately | Plan |
| Output structure | 7-section structured report | Covers exactly what feedback requested: why, mechanics, adapt, build | Plan |
| Progressive path | Handled separately (trainer video) | Cofounder already recorded it; will link in post | Frame |

## Scope

**In scope:**
- Write `ai-artifacts/prompts/skill-explainer.md` (the prompt content)
- Wire into M1-L2 lesson definition (`prompts: ["skill-explainer"]`)

**Out of scope:**
- Lesson-draft edits, callouts, Deep Dive changes
- Video content (handled by trainer)
- Glossary lessons
- Pipeline changes (pipeline is ready)
- Shipping with every lesson (M1-L2 only)

## Architecture / Approach

Single prompt file → existing build pipeline → CLI delivery. The prompt instructs Claude to: find the SKILL.md, read it + references/, and produce a structured 7-section report. Complexity adaptation built into the prompt (shorter reports for simple skills, deeper for orchestrators).

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Write the prompt | `skill-explainer.md` with 7-section report structure | Prompt quality — too generic = useless, too specific = breaks on unfamiliar skills |
| 2. Wire into M1-L2 | Lesson definition updated, prompt deliverable via CLI | Mechanical — low risk |

**Prerequisites:** Access to `10x-toolkit` repo
**Estimated effort:** ~1 session for prompt writing + testing, <30 min for wiring

## Open Risks & Assumptions

- Prompt performance on very large skills (831-line `10x-plan`) may hit context limits — test required
- Learners on non-Claude-Code tools (Cursor, Copilot) get the file but invoke it differently — prompt should work as paste-in content too
- "Building Something Similar" quality depends on the skill being analyzed — may be thin for trivial skills like `10x-init`

## Success Criteria (Summary)

- Explainer produces accurate, specific reports on skills of all complexity levels (simple through orchestrator)
- "Building Something Similar" section gives steps a learner could actually follow
- Prompt arrives on learner's machine via existing CLI pipeline without any infrastructure changes
