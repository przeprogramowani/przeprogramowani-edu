---
date: "2026-05-26T14:59:22Z"
researcher: Claude (10x-research)
git_commit: ffde1ce7424162c6b4a376956905763f0a0d634f
branch: master
repository: przeprogramowani-sites
topic: "How to teach the 'why' and mechanics behind skills introduced in M1/M2 lessons"
tags: [research, skills, course-content, lesson-design, 10xdevs3]
status: complete
last_updated: "2026-05-26"
last_updated_by: Claude (10x-research)
---

# Research: Teaching Skill Mechanics in M1/M2

**Date**: 2026-05-26T14:59:22Z
**Researcher**: Claude (10x-research)
**Git Commit**: ffde1ce7424162c6b4a376956905763f0a0d634f
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Learners complain that M1/M2 lessons focus on how to *use* skills in action but don't explain step by step *why* they work, what their most important parts are, and how to tweak or create their own. Three approaches were proposed: (1) add "why/mechanics" sections to Deep Dives, (2) create a glossary lesson per module, (3) build a `/10x-skill-explainer` skill. Which approach — or combination — best addresses the gap?

## Summary

**19 unique skills** are introduced across M1 (11 skills) and M2 (8 skills, plus `10x-lesson` re-surfaced). Of these, **only 1** (`/10x-tech-stack-selector` in M1-L2) receives a full "explained" treatment where the SKILL.md is opened and walked through. **15** get "contextual" treatment (workflow context + inputs/outputs, but no internals). **3** are "action-only" (bare invocation, minimal explanation). The gap is real and systematic.

The recommended approach is a **hybrid**: build `/10x-skill-explainer` as the primary on-demand mechanism (always current, works for all skills including future ones, zero lesson-length impact), then add a lightweight "Skill Mechanics" callout in 5-6 existing Deep Dives pointing learners to the explainer, and demonstrate the explainer in action once per module.

## Detailed Findings

### 1. Skill Inventory — What's Introduced Where

| # | Skill | Lesson | New in that lesson | Presentation |
|---|-------|--------|-------------------|--------------|
| 1 | `/10x-init` | M1-L1 | Yes | action-only |
| 2 | `/10x-shape` | M1-L1 | Yes | contextual |
| 3 | `/10x-prd` | M1-L1 | Yes | contextual |
| 4 | `/10x-tech-stack-selector` | M1-L2 | Yes | **explained** |
| 5 | `/10x-stack-assess` | M1-L2 | Yes | contextual |
| 6 | `/10x-bootstrapper` | M1-L3 | Yes | contextual |
| 7 | `/10x-health-check` | M1-L3 | Yes | contextual |
| 8 | `/10x-rule-review` | M1-L4 | Yes | contextual |
| 9 | `/10x-lesson` | M1-L4 | Yes | contextual |
| 10 | `/10x-agents-md` | M1-L4 | Yes | action-only |
| 11 | `/10x-infra-research` | M1-L5 | Yes | contextual |
| 12 | `/10x-roadmap` | M2-L1 | Yes | contextual |
| 13 | `/10x-new` | M2-L2 | Yes | action-only |
| 14 | `/10x-plan` | M2-L2 | Yes | contextual |
| 15 | `/10x-plan-review` | M2-L2 | Yes | contextual |
| 16 | `/10x-implement` | M2-L2 | Yes | contextual |
| 17 | `/10x-archive` | M2-L2 | Yes | (not shown in draft) |
| 18 | `/10x-impl-review` | M2-L3 | Yes | contextual |
| 19 | `/10x-research` | M2-L4 | Yes | contextual |
| 20 | `/10x-frame` | M2-L4 | Yes | contextual |

**Presentation classification**:
- **action-only** (3): Invocation shown, maybe a screenshot. No explanation of why it works or what it produces.
- **contextual** (16): Explained in workflow context — inputs, outputs, when to use it. But SKILL.md is never opened, no discussion of internals, customization, or design rationale.
- **explained** (1): The SKILL.md is opened, key files walked through, design rationale discussed. Only `/10x-tech-stack-selector` in M1-L2.

### 2. Current Deep Dive Coverage

| Lesson | Deep Dive topics | Covers skill mechanics? |
|--------|-----------------|------------------------|
| M1-L1 | Model/tool recommendations (Architects vs Implementers) | No |
| M1-L2 | Creating own skills + Activation problems | **Yes — the only one** |
| M1-L3 | Failure modes, YOLO, Privacy, HARD-STOP, File conflicts | No (harness/permissions) |
| M1-L4 | System prompts of popular tools, Auto-memory | No (harness internals) |
| M1-L5 | CLI vs MCP, Cloudflare MCP, Production access | No (infrastructure) |
| M2-L1 | Why vertical-first, When horizontal-first | No (methodology) |
| M2-L2 | Why plan matters, Plan Mode vs /10x-plan, Architect/coder model | Partially (comparison table) |
| M2-L3 | (no labeled Deep Dive) | N/A |
| M2-L4 | Agent-friendly docs, Visibility in agent internet | No (ecosystem) |
| M2-L5 | (no Deep Dive) | N/A |

**Key insight**: M1-L2 is the only lesson where skill anatomy is taught (generic structure at lines 15-50 + `/10x-tech-stack-selector` walkthrough + "Creating your own skills" Deep Dive). This single lesson carries the entire weight of "how skills work."

### 3. Skill Source Anatomy — What "Mechanics" Would Cover

All skills live at: `10x-toolkit/packages/ai-artifacts/skills/<skill-name>/SKILL.md`

**Universal anatomy** (every skill has these sections):

| Section | Purpose | Why learners should know |
|---------|---------|------------------------|
| YAML frontmatter | `name`, `description` (trigger phrases), `allowed-tools` (security boundary) | `description` controls when Claude activates the skill; `allowed-tools` is a hard security constraint |
| Role statement | One-sentence philosophy | Sets the skill's "personality" — changing this changes behavior significantly |
| When to use / when to skip | Routing logic | Understanding this prevents misuse and enables learners to build their own routing |
| Relationship to other skills | Chain position | Shows the file-on-disk handoff model — key architectural insight |
| Initial Response | Argument parsing, missing-input handling | All skills share the same `@`-strip, `/`-strip, segment-extract pattern |
| Process Steps | The core numbered workflow | The actual mechanics — what the skill does step by step |
| Critical guardrails | Hard rules that must never be violated | The highest-leverage lines — changing these changes outcomes dramatically |
| What it does NOT do | Explicit scope boundaries | Prevents scope creep, teaches boundary-setting for custom skills |

**Complexity spectrum** (line counts of SKILL.md):

| Tier | Skills | Lines | Key patterns |
|------|--------|-------|-------------|
| Simple | `10x-init`, `10x-lesson`, `10x-new` | 95-143 | Single artifact, one-shot execution |
| Medium | `10x-research`, `10x-frame`, `10x-implement`, `10x-archive` | 223-363 | Interactive decisions, state tracking |
| Complex | `10x-plan-review`, `10x-impl-review`, `10x-prd` | 384-447 | Sub-agents, structured reports, save/resume |
| Orchestrator | `10x-shape`, `10x-roadmap`, `10x-plan` | 732-831 | Multi-round interviews, complexity scaling, self-review gates |

**Load-bearing mechanics worth explaining**:

1. **Chain dependencies via files on disk**: Skills communicate through `shape-notes.md → prd.md → tech-stack.md → ...` and `change.md → research.md → frame.md → plan.md → ...`. No in-memory state. This is a deliberate design decision (human intervention between steps, human-readable artifacts).

2. **Complexity-scaled questioning**: `/10x-plan` assesses task as LOW/MEDIUM/HIGH, scales question count (4-6 / 7-10 / 11-15), and skips diagnostic questions when upstream artifacts exist. Each question option includes a recommended pick.

3. **Self-review gates**: `/10x-prd` and `/10x-roadmap` run automated self-checks before writing output. These are essentially embedded tests — the skill verifies its own output before committing it.

4. **Anti-bias mechanisms**: `/10x-infra-research` runs devil's advocate + pre-mortem + unknown-unknowns. `/10x-shape` has a Socrates challenge round. `/10x-prd` lints for technical vocabulary leaking into product docs.

5. **State management**: Two patterns — checkpoint-based resume (`10x-shape`) with YAML frontmatter tracking phase progress, and progress-section-based (`10x-implement`) using markdown checkboxes in `plan.md`.

6. **"STOP, do not chain"**: Every skill explicitly halts and copies the next command to clipboard instead of auto-chaining. Design rationale: prevents compound errors from propagating across the chain.

**Customization surface**:

| Difficulty | What to tweak | Example |
|-----------|---------------|---------|
| Easy | `description` (trigger phrases), template sections, question options, report format | Add a Polish trigger phrase; add a "Performance" section to plan template |
| Medium | Self-review gates, scoring criteria, question categories | Add a "Security" check to plan-review's 6-question gate |
| Hard | `allowed-tools`, checkpoint format, change.md status lifecycle | These are shared contracts — changing them affects multiple skills |

### 4. Comparative Evaluation of Three Approaches

#### Approach A: Deep Dive sections in existing lessons

**Strengths**:
- Low disruption to course structure
- Content appears where the skill is introduced — natural discovery
- Builds on an existing pattern (M1-L2 already does this well)
- Learners encounter it in flow without extra steps

**Weaknesses**:
- **Lesson length problem is real**: M1-L3 is already 582 lines. M2-L2 introduces 5 skills — adding mechanics for all would double the Deep Dive.
- **Uneven fit**: Some lessons (M2-L3, M2-L5) have no Deep Dive section at all. Others already have 4-5 Deep Dive topics.
- **Static content goes stale**: When a skill's SKILL.md changes, every lesson mentioning it needs updating. This already isn't happening (skills evolve between course editions).
- **Doesn't scale**: M3-M5 will introduce more skills. Each new module would need the same treatment.

**Verdict**: Good for 2-3 "hero" skills per module, not viable as the sole mechanism for all 19+.

#### Approach B: Glossary lesson at end of each module

**Strengths**:
- Dedicated space — no lesson-length pressure
- Structured, scannable reference
- Could serve as a "landing pad" for learners who want to go deeper
- Clear editorial boundary (one place to update per module)

**Weaknesses**:
- **Disconnected from context**: Learners meet the skill in L2 but the mechanics are in L5. The connection is weaker.
- **Still static**: Goes stale when skills evolve. Two places to maintain (the lesson that uses the skill + the glossary).
- **May not be read**: End-of-module lessons are often skipped by learners who feel they "got it" from earlier lessons.
- **Doesn't scale to custom skills**: Glossary only covers course-shipped skills, not learner-created ones.

**Verdict**: Useful as a structured reference, but too static and disconnected to be the primary mechanism.

#### Approach C: `/10x-skill-explainer` skill

**Strengths**:
- **Always current**: Reads the actual SKILL.md at invocation time. When a skill changes, the explainer's output changes automatically. Zero maintenance.
- **Works for ALL skills**: Course skills, custom skills, future skills, third-party skills. No per-module editorial work.
- **On-demand depth**: The learner pulls exactly the skill they're curious about, at the depth they want.
- **Teaches skill literacy**: Using the explainer IS the act of learning how skills work. Meta-skill.
- **Zero lesson-length impact**: No words added to any lesson draft.
- **Composable**: Could be invoked from lesson callouts, Deep Dives, glossary lessons, or standalone.

**Weaknesses**:
- **Discoverability**: Learners who don't know it exists won't use it. Requires at least a mention in lessons.
- **No curated narrative**: The explainer analyzes structure; it doesn't tell the STORY of why the skill was designed this way in the context of the course progression. Raw mechanics ≠ pedagogical explanation.
- **Requires building**: Net new skill to develop, test, and maintain (though the maintenance burden is far lower than static content).

**Verdict**: The strongest standalone mechanism. Its weaknesses (discoverability, narrative) are exactly what the other approaches can supplement.

### 5. Recommended Hybrid Approach

**Primary**: Build `/10x-skill-explainer` — an on-demand skill that reads any SKILL.md and produces a structured explanation covering anatomy, key mechanics, customization surface, chain position, and design rationale.

**Secondary**: Add a lightweight "Skill Mechanics" callout in 5-6 existing Deep Dives (or lesson bodies) — not full explanations, but 2-3 paragraph teasers that point to the explainer. One per module demonstrates the explainer in action on a "hero" skill.

**Optional tertiary**: A short "Skills Reference" appendix section at the end of each module's last lesson (not a full glossary lesson) listing all skills introduced in that module with one-liner descriptions and an explainer invocation for each.

#### Suggested hero skills for Deep Dive demos

| Module | Hero skill | Why this one |
|--------|-----------|--------------|
| M1 | `/10x-shape` | Most complex discovery skill. Six phases, Socratic method, brownfield adaptation, anti-CRUD detection. Rich mechanics. |
| M2 | `/10x-plan` | The orchestrator. Complexity scaling, question calibration, phase structure, progress tracking. The most "engine-like" skill. |

#### What `/10x-skill-explainer` should produce

Given a skill name, the explainer would:

1. **Read the SKILL.md** and any `references/` files
2. **Produce a structured report** covering:
   - **Purpose**: What this skill does and when to use it (from the role statement + when-to-use section)
   - **Chain position**: What comes before and after (from relationship section)
   - **Anatomy**: Section-by-section breakdown of the SKILL.md structure
   - **Key mechanics**: The 3-5 most important behavioral drivers (complexity scaling, self-review gates, anti-bias mechanisms, etc.)
   - **Customization guide**: What you can tweak (easy/medium/hard) with concrete examples
   - **Design rationale**: Why it's built this way (extracted from guardrails, "does NOT do", and structural choices)
   - **Creating something similar**: What you'd need to build a skill with similar capabilities
3. **Optionally compare** two skills side-by-side (useful for understanding the spectrum)

#### Implementation effort estimate

- `/10x-skill-explainer` skill: ~200-300 lines of SKILL.md. Medium complexity. 1-2 sessions to build and test.
- Deep Dive callouts: ~50-100 words each, 5-6 callouts across M1/M2. Could be added to existing lesson drafts in one session.
- Appendix sections: ~20-30 words per skill × 10 skills per module. Lightweight.

## Code References

- `10x-toolkit/packages/course-content/src/schemas/lesson.ts:1-25` — Lesson schema with `artifacts.skills` array
- `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-01/lesson-01.ts` — M1-L1 skill declarations
- `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-02/lesson-05.ts` — M2-L5 (no new skills)
- `10x-toolkit/packages/ai-artifacts/skills/*/SKILL.md` — All skill source files
- `workbench/lessons/m1-l2/lesson-draft.md:15-50` — Generic skill anatomy (the only such section)
- `workbench/lessons/m1-l2/lesson-draft.md:218-226` — `/10x-tech-stack-selector` walkthrough (only "explained" example)
- `workbench/lessons/m1-l2/lesson-draft.md:362-401` — "Creating your own skills" Deep Dive (only skill-creation content)

## Architecture Insights

1. **Skills communicate through files, not memory**: The chain model (`shape-notes.md → prd.md → tech-stack.md`) is the deepest architectural insight learners are missing. Understanding this unlocks the ability to intervene, customize, and build new chains.

2. **The `description` field is the skill's entry point**: It controls when Claude activates the skill. This is the single most important customization lever, yet no lesson discusses it.

3. **`allowed-tools` is a security boundary**: A skill with `Agent` in its tools list can spawn sub-agents; one without it cannot. This is power vs. safety — a key design decision learners could make for their own skills.

4. **Self-review gates are embedded tests**: The most sophisticated skills (prd, roadmap, plan) run automated checks on their own output before committing. This pattern is transferable to any custom skill.

5. **"STOP, do not chain" is a design choice, not a limitation**: Every skill explicitly halts and defers to the human. This prevents compound errors. Learners who build their own skills should understand this choice.

## Open Questions

1. **Should `/10x-skill-explainer` support Cursor/Codex skills too?** The skill anatomy differs slightly across runtimes. The explainer could be host-agnostic if it reads the file structure rather than assuming a specific format.

2. **Should the explainer produce output in Polish or English?** The skills themselves are in English. The lessons are in Polish. The explainer's audience determines the language.

3. **Depth levels**: Should the explainer support `--quick` (one-paragraph summary) vs `--deep` (full anatomy walkthrough) vs `--create` (template for building a similar skill)?

4. **Integration with lesson-draft skill**: Should `/lesson-draft` auto-generate a "Skill Mechanics" callout when writing a lesson that introduces new skills? This would prevent the gap from recurring in M3-M5.

5. **Versioning**: When a skill changes between course editions, should the explainer note the version/commit it's reading from? This would help learners understand why their output might differ from lesson screenshots.
