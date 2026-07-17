# Skill Explainer Prompt Implementation Plan

## Overview

Create a `skill-explainer` prompt that learners receive via CLI with M1-L2 and use to understand any skill's mechanics — what it does, why it's built that way, what the most important parts are, and how to build or adapt something similar. Delivered as a prompt (not a skill) to avoid the "skill-on-a-skill" perception problem.

## Current State Analysis

- **19 unique skills** introduced across M1 (11) and M2 (8). Only `/10x-tech-stack-selector` in M1-L2 is ever "explained" (SKILL.md opened and walked through). The rest are shown in workflow context but internals are opaque.
- **Prompt delivery pipeline is fully built and unused**: `ai-artifacts/prompts/<name>.md` → build → R2 → CLI → `.claude/prompts/<name>.md`. Zero prompts currently ship in M1/M2.
- **All exercises in M1/M2 are "run existing skill"** — no exercise asks learners to BUILD anything. Progressive skill-building is handled separately by a trainer video (linked in a post).
- **Skill anatomy is consistent**: every skill has frontmatter, role statement, when-to-use/skip, relationship section, initial response, process steps, critical guardrails, scope boundaries. The prompt needs to extract and explain each of these.

### Key Discoveries:

- Prompt files resolve via `core.ts:38-51` to `ai-artifacts/prompts/<name>.md`
- CLI writer (`10x-cli/src/lib/writer.ts:146-154`) delivers to `.claude/prompts/`, `.cursor/prompts/`, etc.
- M1-L2 lesson definition (`course-content/src/courses/10xdevs3/module-01/lesson-02.ts`) has `prompts: []` — ready to wire
- Skills live at `~/.claude/skills/<name>/SKILL.md` on learner machines (symlinked from toolkit)
- Complexity spectrum: Simple (95-143 lines) → Medium (223-363) → Complex (384-447) → Orchestrator (732-831)

## Desired End State

Learner at M1-L2+ can run the `skill-explainer` prompt on any skill and get a structured, practical report covering:
1. What problem the skill solves and when to use it
2. How it fits in the skill chain (what feeds in, what comes after)
3. Section-by-section anatomy of the SKILL.md
4. The 3-5 most important behavioral drivers (the lines that matter most)
5. How to adapt or improve the skill (easy/medium/hard tweaks with examples)
6. Practical advice for building a similar skill from scratch

Verification: run the prompt on skills of varying complexity (`10x-new`, `10x-implement`, `10x-plan`) and confirm the output covers all 6 areas with accurate, specific content.

## What We're NOT Doing

- No lesson-draft edits, callouts, or Deep Dive changes
- No video content (handled separately by trainer)
- No glossary lesson
- No changes to the prompt delivery pipeline (it's ready)
- No skill (SKILL.md with frontmatter/allowed-tools) — this is a prompt file only
- Not shipping with every lesson — M1-L2 only

## Implementation Approach

Two-phase approach: (1) write the prompt content designed to handle the full M1/M2 skill spectrum, then (2) wire it into the lesson definition. The prompt is the creative work; the wiring is mechanical.

## Phase 1: Write the Skill Explainer Prompt

### Overview

Design and write `skill-explainer.md` — the prompt file that instructs Claude how to analyze any skill and produce a structured explanation. The prompt must handle skills from 95-line simple utilities to 831-line orchestrators.

### Changes Required:

#### 1. Skill Explainer Prompt

**File**: `10x-toolkit/packages/ai-artifacts/prompts/skill-explainer.md`

**Intent**: Create a prompt that, when loaded by Claude Code, instructs it to find a given skill's SKILL.md (and any `references/` files), read them fully, and produce a structured report. The report format must cover exactly what learners are missing according to feedback: why it works, most important parts, how to tweak it, how to build one like it.

**Contract**: The prompt must produce a report with these sections (in this order):

1. **Problem & Purpose** — What problem this skill solves, when to use it, when to skip it. Extracted from the role statement and when-to-use/skip sections. Must answer "why does this exist?" not just "what does it do."

2. **Chain Position** — Where this skill sits in the workflow chain. What comes before it (upstream inputs: files it reads, artifacts from other skills). What comes after (downstream: what the next skill expects, what file it writes). Extracted from the "Relationship to other skills" section. Must show the file-on-disk handoff model.

3. **Anatomy Walkthrough** — Section-by-section breakdown of the SKILL.md structure. For each section: what it does, why it's there, how many lines it takes. The goal is to demystify the "thousands of lines" — show the learner that a 500-line skill is really 8 sections, each with a clear job.

4. **Key Mechanics** — The 3-5 most important behavioral drivers specific to THIS skill, with high-leverage parts flagged. Merges "what drives behavior" with "where small changes have big impact." For an orchestrator: complexity scaling, question calibration. For a research skill: sub-agent spawning, scope check. Each mechanic gets a leverage flag when applicable.

5. **Design Decisions** — Why the skill is built THIS way and not another. For each major structural choice: the choice made, the alternative rejected, and why this way wins. This is the "czemu tak a nie inaczej" section — answers the core learner complaint.

6. **Adaptation Guide** — Concrete examples of what the learner can tweak, organized by difficulty:
   - Easy (low risk): trigger phrases in `description`, template sections, question options, report format
   - Medium (requires understanding the chain): self-review gates, scoring criteria, question categories
   - Hard (structural, risk of breaking chain contracts): `allowed-tools`, checkpoint format, status lifecycle
   Each tier gets 1-2 concrete examples specific to the skill being analyzed.

7. **Building Something Similar** — Practical step-by-step advice for creating a skill with similar capabilities. Starting from: "If you wanted to build your own version of this skill, here's what you'd need." Covers: file placement, frontmatter fields, which sections to write first, what to test, common mistakes to avoid. This section directly addresses the "progressive path" — showing the learner the construction route from blank file to working skill.

The prompt must also handle:
- **Skill discovery**: try `~/.claude/skills/<name>/SKILL.md` first, then ask the learner to provide a path if not found
- **References directory**: if `references/` exists next to the SKILL.md, read all files in it and explain what each reference file does and why it's separate from the main SKILL.md
- **Complexity adaptation**: scale the depth of analysis to the skill's size. A 95-line skill gets a tighter report than an 831-line orchestrator. Don't pad simple skills with generic filler.
- **Language**: respond in the language the learner uses (the prompt itself is in English, but output follows the conversation language)

### Success Criteria:

#### Automated Verification:

- File exists at `10x-toolkit/packages/ai-artifacts/prompts/skill-explainer.md`
- File is valid markdown with no broken formatting
- File size is 150-400 lines (enough to be thorough, not so long it degrades prompt performance)

#### Manual Verification:

- Run the prompt on `10x-new` (simple, 143 lines) — output covers all 7 sections, is concise, doesn't pad
- Run the prompt on `10x-implement` (medium, 363 lines) — output correctly identifies progress-section state management and phase-based execution as key mechanics
- Run the prompt on `10x-plan` (orchestrator, 831 lines) — output correctly identifies complexity-scaled questioning, upstream-artifact scaling, and self-review gates as key mechanics
- "Building Something Similar" section gives actionable steps a learner could follow, not generic advice
- "Most Important Parts" correctly identifies the highest-leverage lines (not just the longest sections)
- Skill with `references/` directory (e.g., `10x-plan` with `references/progress-format.md`) — references are discovered, read, and explained

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Wire Into M1-L2 Lesson Definition

### Overview

Add the `skill-explainer` prompt to M1-L2's artifact list so it gets delivered to learners via CLI when they fetch that lesson.

### Changes Required:

#### 1. M1-L2 Lesson Definition

**File**: `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-01/lesson-02.ts`

**Intent**: Add `"skill-explainer"` to the `artifacts.root.prompts` array so the prompt is bundled and delivered with this lesson. M1-L2 is the natural home because it teaches skill anatomy and "creating your own skills."

**Contract**: Change `prompts: []` to `prompts: ["skill-explainer"]` in the `root` artifacts object.

### Success Criteria:

#### Automated Verification:

- Build passes: `cd packages/course-content && npm run build` (confirms prompt file resolves correctly)
- TypeScript compiles: `npx tsc --noEmit` in course-content package

#### Manual Verification:

- `npx 10x-cli get m1l2 --type prompts` delivers the skill-explainer prompt to `.claude/prompts/skill-explainer.md`
- Prompt file content matches the source at `ai-artifacts/prompts/skill-explainer.md`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

---

## Testing Strategy

### Manual Testing Steps:

1. Run explainer on a simple skill (`10x-new` or `10x-init`) — verify concise, accurate output
2. Run explainer on a medium skill (`10x-implement` or `10x-frame`) — verify key mechanics are specific, not generic
3. Run explainer on an orchestrator (`10x-plan` or `10x-shape`) — verify it handles 800+ lines, references/ directory, and complexity scaling
4. Run explainer on a skill with no references/ directory — verify it doesn't hallucinate references
5. Run explainer on a skill the learner doesn't have installed — verify it asks for a path gracefully
6. Verify the "Building Something Similar" section — could a learner actually follow these steps to create a basic skill?
7. Fetch M1-L2 via CLI and confirm prompt arrives at `.claude/prompts/skill-explainer.md`

## References

- Research: `context/changes/explain-skills/research.md`
- Frame: `context/changes/explain-skills/frame.md`
- Lesson schema: `10x-toolkit/packages/course-content/src/schemas/lesson.ts`
- Prompt build logic: `10x-toolkit/packages/course-content/src/build/core.ts:38-51`
- CLI writer: `10x-cli/src/lib/writer.ts:146-154`
- M1-L2 lesson def: `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-01/lesson-02.ts`
- Skill sources: `10x-toolkit/packages/ai-artifacts/skills/*/SKILL.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Write the Skill Explainer Prompt

#### Automated

- [x] 1.1 File exists at `ai-artifacts/prompts/skill-explainer.md` — be53924
- [x] 1.2 Valid markdown, 150-400 lines — be53924

#### Manual

- [x] 1.3 Tested on simple skill (10x-new) — all 7 sections, concise — b4339441
- [x] 1.4 Tested on medium skill (10x-implement) — specific key mechanics — b4339441
- [x] 1.5 Tested on orchestrator (10x-plan) — handles 800+ lines, references/ — b4339441
- [x] 1.6 "Building Something Similar" gives actionable steps — b4339441
- [x] 1.7 "Most Important Parts" identifies highest-leverage lines — b4339441
- [x] 1.8 References directory discovered and explained — b4339441

### Phase 2: Wire Into M1-L2 Lesson Definition

#### Automated

- [x] 2.1 Build passes in course-content package — fdebedb
- [x] 2.2 TypeScript compiles — fdebedb

#### Manual

- [x] 2.3 CLI delivers prompt to `.claude/prompts/skill-explainer.md` — fdebedb
- [x] 2.4 Prompt content matches source — fdebedb
