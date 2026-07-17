# Brownfield Support for M1 Lessons — Implementation Plan

## Overview

Extend M1 lessons (m1-l1 through m1-l3) and their underlying skills to support brownfield projects alongside greenfield. Currently, the greenfield assumption is pervasive: /10x-shape has 3 hard guards refusing brownfield use, /10x-tech-stack-selector assumes choosing-from-scratch, /10x-bootstrapper literally scaffolds new projects. However, ~40-65% of lesson content is universally applicable and needs reframing rather than rewriting. The prework [4.2] already promises brownfield support — the main course must follow through.

## Current State Analysis

The M1 module is a greenfield-only pipeline:

```
m1-l1 (idea → PRD) → m1-l2 (PRD → tech-stack.md) → m1-l3 (tech-stack.md → scaffolded repo) → m1-l4 (onboarding)
```

With brownfield support, it becomes a dual pipeline converging at m1-l4:

```
Greenfield: m1-l1 shape+prd → m1-l2 tech-stack-selector → m1-l3 bootstrapper ──┐
                                                                                 ├→ m1-l4 onboarding
Brownfield: m1-l1 shape+prd → m1-l2 stack-assess        → m1-l3 health-check ──┘
```

### Key Discoveries:

- `/10x-shape` already has a `context_type` field in its output schema — hardcoded to `greenfield`, but the plumbing exists (`workbench/context/changes/prd-for-brownfields/research.md:79`)
- `/10x-prd` has **no** greenfield guards — it's mode-agnostic in implementation, inherits the assumption transitionally via the chain
- The 4 agent-friendly quality gates from `/10x-tech-stack-selector` (typed, convention-based, popular in training data, well-documented) are reusable for brownfield assessment — they're MORE relevant for evaluating existing stacks than choosing new ones (`10x-tech-stack-selector/references/agent-friendly-criteria.md`)
- The verification.md pattern and per-language audit dispatch from `/10x-bootstrapper` are directly reusable for brownfield health checks (`10x-bootstrapper/references/verification-log-schema.md`, `bootstrapper-config.yaml`)
- Prework [4.2] explicitly supports brownfield: *"Akceptowane są różne ścieżki: własna aplikacja z logiką biznesową lub rozbudowanie istniejącego projektu o nowy moduł."* (`src/content-source/lessons10xDevs3Prework/pl/15-4x2_dobry_i_zly_projekt_kursowy.md:45-46`)
- m1-l2 schema entry has **empty** `owns`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders` — these need to be populated from scratch, not just amended

## Desired End State

Every M1 lesson (m1-l1 through m1-l3) supports both greenfield and brownfield learners with:

- **Skills** that auto-detect context type and adapt their behavior (brownfield mode for /10x-shape, separate brownfield PRD template for /10x-prd, new /10x-stack-assess and /10x-health-check skills)
- **Schema entries** with `owns`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders` that explicitly include brownfield concepts
- **Lesson drafts** with dedicated brownfield sections (not sidebars or callouts — full sections) alongside the greenfield primary narrative

Verification: a brownfield learner reading m1-l1 through m1-l3 has a complete, skill-backed workflow: shape their existing project's change → generate a brownfield PRD → assess their stack against quality gates → run a health check. They arrive at m1-l4 (agent onboarding) with the same quality of context artifacts as greenfield learners.

## What We're NOT Doing

- **No brownfield demo walkthrough in M1** — brownfield demo belongs to M4. M1 supports brownfield users with skills, sections, and adapted checklists.
- **No prework changes** — prework [4.2] already supports brownfield. The main course follows through on that promise.
- **No changes to m1-l4 or m1-l5** — agent onboarding (m1-l4) and deployment (m1-l5) are already path-agnostic. Both paths converge at m1-l4.
- **No forking of existing greenfield skills** — extend /10x-shape and /10x-prd in place with mode awareness. The new skills (/10x-stack-assess, /10x-health-check) are net-new because their jobs are fundamentally different from their greenfield counterparts.
- **No changes to /10x-tech-stack-selector or /10x-bootstrapper** — they remain greenfield-only. The brownfield chain uses different skills.

## Implementation Approach

9 phases organized as 3 vertical slices (one per lesson), each following Skills → Schema → Lesson order. This ensures skill contracts are testable before schema validates them, and schema validates before lesson prose references them.

All skill work happens in the `10x-toolkit` repo (`~/code/10x-toolkit/packages/ai-artifacts/skills/`). All schema and lesson work happens in this repo's workbench (`projects/edu-platform/workbench/`).

---

## Phase 1: m1-l1 Skills — Brownfield Mode for /10x-shape + Brownfield PRD Template

### Overview

Extend /10x-shape to support brownfield projects via auto-detection and reframed discovery phases. Create a separate brownfield PRD template in /10x-prd that auto-routes based on `context_type` from shape-notes.md.

### Changes Required:

#### 1. /10x-shape brownfield mode

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md`

**Intent**: Transform /10x-shape from greenfield-only to dual-mode. The skill auto-detects brownfield context (presence of project markers like `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`, `.git` in cwd), proposes the detected mode, and lets the user confirm or override. All six discovery phases get brownfield variants. The output schema's `context_type` field already exists — it just needs to accept `brownfield` as a value.

**Contract**:

Three guards to modify:
- Description frontmatter: change from `"turns a greenfield idea into shape-notes.md"` to support both modes
- "When to skip" section: remove `"This skill is greenfield-only"` guard, replace with mode detection logic
- Critical guardrail #6: remove `"Greenfield only"` guard, replace with mode-aware behavior

Auto-detection logic (new, before Phase 1 begins):
- Check cwd for project markers (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Gemfile`, `composer.json`)
- If markers found: propose `context_type: brownfield`, user confirms or overrides
- If no markers: propose `context_type: greenfield`, user confirms or overrides

Phase reframing (brownfield variants):
- Phase 1 (Vision & Problem): "What is the current system?" + "What's the pain point or missing capability?" + "What must be preserved?" (vs greenfield: "who has the pain")
- Phase 2 (Persona & Access Control): "Describe current auth and user roles" before asking what changes (vs greenfield: "how does this person get into the app")
- Phase 3 (MVP Discipline): "Smallest incremental change that proves the improvement" + "What's the blast radius of this change?" (vs greenfield: "MVP-in-a-week" and "greenfield trap")
- Phase 4 (FRs & User Stories): Add FR category `new | modified | preserved` (vs greenfield: all FRs are new)
- Phase 4.5 (Socratic Challenge): No change — already mode-agnostic
- Phase 5 (Business Logic & Data): "What is the existing domain rule?" before empty-CRUD check → "does this change add/modify a domain rule, or is it infrastructure-only?" (vs greenfield: empty-CRUD from scratch)
- Phase 6 (Product Framing): Product type/scale become "is this changing?" yes/no gates + "what constraints does the existing system impose?" (vs greenfield: determine type/scale from scratch)

Output schema update (shape-notes.md):
- `context_type` accepts `greenfield | brownfield`
- Brownfield adds `## Current System` section (before Vision & Problem) and `## Constraints & Preserved Behavior` section
- Closing 6-element soft gate adds a 7th element for brownfield: "preserved behavior explicitly named"

#### 2. /10x-prd brownfield template

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-prd/SKILL.md`

**Intent**: Add a separate brownfield PRD template that /10x-prd uses when shape-notes.md has `context_type: brownfield`. The brownfield template has different sections optimized for describing changes to an existing system, not building from scratch. When shape-notes.md is absent and /10x-prd is invoked directly, fall back to cwd auto-detection (same logic as /10x-shape).

**Contract**:

Auto-routing logic:
- If shape-notes.md exists and has `context_type: brownfield` → use brownfield template
- If shape-notes.md exists and has `context_type: greenfield` → use existing greenfield template
- If shape-notes.md absent → auto-detect from cwd markers, confirm with user

Brownfield PRD template sections (new, replaces the 11 greenfield sections):

Frontmatter: `project`, `version`, `status`, `created`, `context_type: brownfield`, `product_type`, `target_scale`, `timeline_budget` (with `delivery_weeks` instead of `mvp_weeks`)

Sections:
1. `## Current System Overview` — what exists now, key architecture, tech stack, user base
2. `## Problem Statement & Motivation` — what's wrong/missing, why now
3. `## User & Persona` — who is affected (existing users + new if any)
4. `## Success Criteria` — how we know the change worked (with `### Primary` / `### Secondary` / `### Guardrails`)
5. `## User Stories` — what changes for the user (delta-framed)
6. `## Scope of Change` — what's being modified/added/removed (explicit delta)
7. `## Constraints & Compatibility` — backward compat, data migration, existing integrations, preserved behavior
8. `## Business Logic Changes` — domain rule additions/modifications (not full domain model)
9. `## Data Model Changes` — schema deltas (not full schema)
10. `## Access Control Changes` — permission changes if any
11. `## Non-Goals` — what we're NOT changing
12. `## Open Questions`

Thin-input heuristic adaptation: same 4-signal check, but signal 1 checks for brownfield checkpoint in shape-notes.md.

#### 3. Brownfield PRD schema reference

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/references/prd-schema.md`

**Intent**: Add the brownfield PRD schema alongside the existing greenfield schema so both are documented in one reference. The greenfield schema remains unchanged.

**Contract**: Append a `## Brownfield PRD Schema` section documenting the 12 brownfield sections, their required/optional status, and the delta-framing convention. Existing greenfield schema section is untouched.

### Success Criteria:

#### Automated Verification:

- /10x-shape SKILL.md passes lint (if applicable to toolkit)
- /10x-prd SKILL.md passes lint
- No references to removed guards remain in SKILL.md files
- `context_type` field documented in prd-schema.md for both modes

#### Manual Verification:

- Run `/10x-shape` in an empty directory → proposes greenfield, proceeds with existing behavior
- Run `/10x-shape` in a directory with `package.json` → proposes brownfield, user confirms, phases ask brownfield questions
- Run `/10x-prd` with a brownfield shape-notes.md → generates brownfield PRD with the 12-section template
- Run `/10x-prd` with a greenfield shape-notes.md → generates greenfield PRD with existing 11-section template
- Brownfield shape-notes.md includes `## Current System` and `## Constraints & Preserved Behavior`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: m1-l1 Schema — Update lessons-schema.json

### Overview

Update the m1-l1 entry in `lessons-schema.json` to reflect brownfield ownership, learning outcomes, required fragments, and video placeholders.

### Changes Required:

#### 1. m1-l1 schema entry

**File**: `workbench/lessons-schema.json`

**Intent**: Extend m1-l1's `owns`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders` to include brownfield shaping and brownfield PRD. The lesson now owns dual-mode shaping, not just greenfield shaping.

**Contract**:

`owns` additions:
- `"dialog sokratejski z Agentem w trybie brownfield: odkrycie bólu istniejącego systemu, zachowanych zachowań i najmniejszej zmiany zamiast startu od zera (operacjonalizowany przez brownfield mode w /10x-shape)"`
- `"brownfield PRD jako kontrakt delta-zmiany (produkowany przez /10x-prd z osobnym szablonem brownfield: Current System, Scope of Change, Constraints & Compatibility zamiast greenfield Vision → FRs)"`

`learningOutcomes` additions:
- `"Kursant potrafi uruchomić /10x-shape w istniejącym projekcie — skill auto-wykrywa kontekst brownfield, a sesja sokratejska skupia się na bólu obecnego systemu, zachowanych zachowaniach i najmniejszej wartościowej zmianie zamiast budowania od zera."`
- `"Kursant potrafi wygenerować brownfield PRD przez /10x-prd — dokument opisuje obecny system, zakres zmiany i ograniczenia kompatybilności zamiast pełnej wizji produktowej od zera."`

`requiredFragments` additions:
- `"Sekcja brownfield: wyjaśnienie trybu brownfield w /10x-shape (auto-detekcja, zmienione fazy, shape-notes.md z ## Current System), kontrast z greenfield, brownfield PRD template."`
- `"Podwójne CTA: 'Uruchom /10x-shape na swoim pomyśle' (greenfield) ORAZ 'Uruchom /10x-shape w katalogu swojego istniejącego projektu' (brownfield)."`

`videoPlaceholders` addition:
- `"Opcjonalnie: krótki pokaz auto-detekcji brownfield w /10x-shape — terminal z istniejącym projektem, propozycja trybu, potwierdzenie."`

### Success Criteria:

#### Automated Verification:

- `lessons-schema.json` is valid JSON after edit
- m1-l1 entry contains all new `owns`, `learningOutcomes`, `requiredFragments` items
- No other lesson entries were modified

#### Manual Verification:

- Schema entries accurately describe the brownfield concepts introduced in Phase 1 skills
- `owns` items don't overlap with m1-l2 or m1-l3 brownfield concepts
- `learningOutcomes` are measurable and distinct from greenfield outcomes

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: m1-l1 Lesson — Revise Spec + Draft

### Overview

Revise m1-l1 lesson-spec.md and lesson-draft.md to include brownfield sections. The greenfield narrative remains primary; brownfield gets dedicated sections (not sidebars or callouts).

### Changes Required:

#### 1. m1-l1 lesson spec

**File**: `workbench/lessons/m1-l1/lesson-spec.md`

**Intent**: Update the spec to reflect brownfield as a first-class path. The thesis expands from "spend 30 minutes with the Agent before coding" to "spend 30 minutes whether you're starting fresh or changing an existing system." The sole parenthetical at line 35 becomes explicit brownfield coverage.

**Contract**: Update thesis, owned concepts, and failure modes to include brownfield. Remove the parenthetical `"(lub przynosi własny problem z pracy)"` and replace with explicit brownfield sections in the spec body.

#### 2. m1-l1 lesson draft

**File**: `workbench/lessons/m1-l1/lesson-draft.md`

**Intent**: Add brownfield sections to the draft. Three key changes: (1) expand the "Nie tylko na start projektu" paragraph (lines 208-213) into a full brownfield section explaining /10x-shape brownfield mode, brownfield PRD template, and how the workflow adapts; (2) add brownfield framing to the CTA (lines 224-233) so brownfield learners know what to run; (3) add a brief contrast in the Core section showing how greenfield vs brownfield sessions differ.

**Contract**:

New/expanded sections:
- In Core (~after line 62): brief paragraph explaining that /10x-shape auto-detects context type and adapts — "if you run it in an existing project directory, it switches to brownfield mode"
- Expand "Nie tylko na start projektu" (lines 208-213) into a full section: explain brownfield mode phases, the `## Current System` section in shape-notes.md, the brownfield PRD template with its 12 sections, and how the delta-framing works
- In Materiały dodatkowe / CTA (lines 224-233): add parallel brownfield CTA — "Uruchom /10x-shape w katalogu swojego istniejącego projektu" alongside the greenfield "Uruchom /10x-shape na swoim pomyśle"

NOT changing:
- The greenfield demo walkthrough (lines 111-164) stays as-is — no brownfield demo in M1 (that's M4)
- The section structure (Wstęp, Core, Deep Dive, Materiały dodatkowe) stays the same

### Success Criteria:

#### Automated Verification:

- lesson-spec.md and lesson-draft.md are valid markdown
- No greenfield content was removed (brownfield is additive)
- The parenthetical at spec line 35 is replaced with explicit brownfield coverage

#### Manual Verification:

- A brownfield learner reading the lesson knows: (1) /10x-shape works in brownfield mode, (2) how sessions differ, (3) what the brownfield PRD looks like, (4) what to run on their project
- Greenfield narrative flow is not disrupted by brownfield additions
- No concepts from m1-l2 (stack assessment) or m1-l3 (health check) are introduced prematurely

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: m1-l2 Skills — New /10x-stack-assess Skill

### Overview

Create a new /10x-stack-assess skill that evaluates an existing codebase against the 4 agent-friendly quality gates and produces a stack-assessment.md with gate scores, gap analysis, and compensation plan.

### Changes Required:

#### 1. New skill directory + SKILL.md

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-stack-assess/SKILL.md`

**Intent**: Create a standalone skill that assesses an existing project's stack for agent-friendliness. It reuses the same 4 quality gates from /10x-tech-stack-selector (typed, convention-based, popular in training data, well-documented) but applies them as an evaluation lens rather than a selection filter. The output is a structured assessment with per-component scores, identified gaps, and a concrete compensation plan (what to add to CLAUDE.md/AGENTS.md to compensate for failures).

**Contract**:

Input: existing codebase in cwd (reads `package.json`, `tsconfig.json`, framework configs, directory structure, `prd.md` if available)

Assessment flow:
1. Detect stack components (language, framework, build tool, test runner, package manager, deployment target)
2. Score each component against the 4 quality gates (pass/fail per gate, with brief reasoning)
3. Identify compensation strategies for failed gates (what instruction-file entries would bridge the gap)
4. Produce agent-readiness verdict: ready / ready-with-compensation / significant-friction
5. Generate recommended CLAUDE.md/AGENTS.md additions for compensation

Output: `context/foundation/stack-assessment.md`

Output schema:
- Frontmatter: `project`, `assessed_at`, `agent_readiness` (ready | ready-with-compensation | significant-friction), `stack_components` (list)
- `## Stack Components` — detected language, framework, build tool, test runner, etc.
- `## Quality Gate Assessment` — per-component 4-gate matrix (pass/fail + reasoning)
- `## Gaps & Compensation` — failed gates with concrete compensation strategies
- `## Recommended Instruction File Additions` — ready-to-paste CLAUDE.md/AGENTS.md entries
- `## Summary` — overall verdict and next steps

#### 2. Quality gates reference (symlink or copy)

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-stack-assess/references/agent-friendly-criteria.md`

**Intent**: The same 4 quality gates used by /10x-tech-stack-selector. Either symlink to the existing reference or copy with attribution to maintain consistency.

**Contract**: Content matches `10x-tech-stack-selector/references/agent-friendly-criteria.md`. The compensation path section is especially relevant — it's the core of brownfield value.

### Success Criteria:

#### Automated Verification:

- SKILL.md exists at the correct path
- References directory contains agent-friendly-criteria.md
- Skill is registered in the toolkit's skill registry (if one exists)

#### Manual Verification:

- Run `/10x-stack-assess` in a TypeScript/Next.js project → correctly identifies stack, passes most gates, produces clean assessment
- Run `/10x-stack-assess` in an untyped Express project → correctly identifies gate failures (typed, convention-based), proposes compensation
- Output `stack-assessment.md` follows the documented schema
- Compensation recommendations are concrete and actionable (not generic advice)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: m1-l2 Schema — Populate lessons-schema.json

### Overview

Populate the currently-empty m1-l2 schema entry with `owns`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders` covering both greenfield (tech-stack-selector) and brownfield (stack-assess) paths.

### Changes Required:

#### 1. m1-l2 schema entry

**File**: `workbench/lessons-schema.json`

**Intent**: m1-l2's schema entry has empty arrays for `owns`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders`. These need to be populated from the lesson-spec.md's 9 owned concepts + brownfield additions. The greenfield concepts come from the existing spec (line 46-53); brownfield concepts are new.

**Contract**:

`owns` — populate from lesson-spec.md owned concepts (9 items) plus brownfield additions:
- Existing 9 from spec: Agent Skills format (SKILL.md anatomy, security), progressive disclosure, skill-vs-prompt contrast + third-prompt heuristic, skill consumption from registries, worked example PRD→tech-stack-selector→tech-stack.md, the full chain as "from chatbot to Agent", metaprompting via skill-creator preview, skills as 10xWorkflow building block, learner's own toolkit as AI-native SE definition
- Brownfield addition: `"ocena istniejącego stacku pod kątem agent-friendliness przez /10x-stack-assess: 4 quality gates (typed, convention-based, popular in training data, well-documented) jako lens ewaluacyjny z planem kompensacji"`

`learningOutcomes` — populate including brownfield:
- Greenfield outcomes matching the 9 owned concepts
- Brownfield addition: `"Kursant potrafi uruchomić /10x-stack-assess na istniejącym projekcie i zinterpretować wynik: które quality gates jego stack spełnia, gdzie są luki, i jakie wpisy do CLAUDE.md/AGENTS.md skompensują braki."`

`requiredFragments` — populate including brownfield:
- Greenfield fragments matching lesson structure (Wstęp, Core, Deep Dive sections)
- Brownfield addition: `"Sekcja brownfield: worked example /10x-stack-assess na projekcie z lukami w quality gates, kontrastowo z tech-stack-selector, z wynikiem stack-assessment.md i planem kompensacji."`

`videoPlaceholders` — populate including brownfield:
- Greenfield: worked example of /10x-tech-stack-selector on 10xCards PRD
- Brownfield addition: `"Opcjonalnie: krótki pokaz /10x-stack-assess na istniejącym projekcie — widoczna detekcja stacku, scoring quality gates, wynik z kompensacją."`

### Success Criteria:

#### Automated Verification:

- `lessons-schema.json` is valid JSON after edit
- m1-l2 `owns`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders` are all non-empty arrays
- No other lesson entries were modified

#### Manual Verification:

- `owns` items cover all 9 concepts from lesson-spec.md + brownfield stack assessment
- `learningOutcomes` are measurable and don't overlap with m1-l1 or m1-l3 outcomes
- `requiredFragments` match the actual lesson structure

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: m1-l2 Lesson — Revise Spec + Draft

### Overview

Revise m1-l2 lesson-spec.md and lesson-draft.md to include a brownfield section for stack assessment alongside the greenfield tech-stack-selector worked example.

### Changes Required:

#### 1. m1-l2 lesson spec

**File**: `workbench/lessons/m1-l2/lesson-spec.md`

**Intent**: Add brownfield stack assessment as an owned concept. The spec already owns the tech-stack-selector worked example — brownfield adds a parallel: "if you already have a stack, assess it instead of choosing one."

**Contract**: Add brownfield-specific entries to the spec's concepts, failure modes, and examples. The `/10x-stack-assess` skill, its output (`stack-assessment.md`), and the quality-gate-as-evaluation-lens framing are new spec content.

#### 2. m1-l2 lesson draft

**File**: `workbench/lessons/m1-l2/lesson-draft.md`

**Intent**: Add a dedicated brownfield section after the tech-stack-selector worked example (lines 120-189). The section explains: (1) brownfield learners don't choose a stack — they assess theirs; (2) the same 4 quality gates apply as an evaluation lens; (3) the compensation path is the core value; (4) the output is `stack-assessment.md` not `tech-stack.md`. Also adapt the homework (line 225) and chain diagram (lines 208-217) to include the brownfield path.

**Contract**:

New/expanded sections:
- After the tech-stack-selector worked example (after ~line 189): new section "Ocena istniejącego stacku" explaining /10x-stack-assess, quality gates as evaluation, compensation plan, stack-assessment.md output
- Adapt chain diagram (lines 208-217): show dual pipeline (greenfield: tech-stack-selector → bootstrapper, brownfield: stack-assess → health-check)
- Adapt homework (line 225): add parallel homework — "run /10x-stack-assess on your existing project" alongside "run /10x-tech-stack-selector on your PRD"

Key brownfield content:
- The 4 quality gates reframed: "evaluate your existing stack" instead of "choose a new stack"
- The compensation path as THE core brownfield value — "if your stack fails gates, document conventions in CLAUDE.md"
- The bridge-out changes: brownfield → "you now know where your stack needs compensation" instead of greenfield → "bootstrapper reads your tech-stack.md"

### Success Criteria:

#### Automated Verification:

- lesson-spec.md and lesson-draft.md are valid markdown
- No greenfield content was removed
- Chain diagram shows both paths

#### Manual Verification:

- A brownfield learner reading the lesson knows: (1) /10x-stack-assess exists, (2) how it differs from tech-stack-selector, (3) what quality gates mean for their existing stack, (4) what to do with the assessment
- The reframed quality gates section doesn't duplicate agent-friendly-criteria.md verbatim — it explains the concept in lesson voice
- Homework has both greenfield and brownfield variants

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 7: m1-l3 Skills — New /10x-health-check Skill

### Overview

Create a new /10x-health-check skill that runs dependency audit, security scan, test runner check, and CI config evaluation on an existing codebase. This is the brownfield equivalent of /10x-bootstrapper — instead of scaffolding a new project, it verifies that an existing project is healthy and agent-ready.

### Changes Required:

#### 1. New skill directory + SKILL.md

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-health-check/SKILL.md`

**Intent**: Create a standalone skill that checks the health of an existing project from the agent's perspective. It reuses the verification.md structured-log pattern and per-language audit dispatch from /10x-bootstrapper, but applies them to an existing codebase instead of a freshly scaffolded one. The skill runs the same three execution gates (pre/in/post) that m1-l3 teaches — dogfooding the lesson's own framework.

**Contract**:

Input: existing codebase in cwd + optional `context/foundation/stack-assessment.md` from /10x-stack-assess (if available, focuses checks on identified gaps)

Health-check stages (mapped to three execution gates):
1. **Pre-check** (before any changes): dependency audit (`npm audit` / `pip-audit` / `cargo audit` / etc.), lockfile presence, security advisory scan
2. **In-check** (read-only analysis): test runner detection + test suite health (can tests run?), CI config evaluation (is there a pipeline? does it cover lint/test/build?), missing configuration files detection (`.editorconfig`, `.prettierrc`, `tsconfig.json` strict mode, etc.)
3. **Post-check** (assessment): agent-readiness evaluation based on results, recommended fixes prioritized by impact, CLAUDE.md/AGENTS.md gap recommendations (linking to stack-assessment.md compensation if available)

Output: `context/foundation/health-check.md`

Output schema:
- Frontmatter: `project`, `checked_at`, `health_status` (healthy | needs-attention | critical-issues), `checks_run` (list)
- `## Dependency Health` — audit results, outdated packages, known vulnerabilities
- `## Test Suite` — runner detected, tests runnable, coverage if available
- `## CI/CD` — pipeline detected, stages covered, gaps
- `## Configuration` — missing/incomplete config files
- `## Recommended Fixes` — prioritized list with effort estimates
- `## Agent Readiness` — combined verdict from health-check + stack-assessment (if available)

Per-language audit dispatch (reused from bootstrapper):
- Node.js: `npm audit`, `npx depcheck`
- Python: `pip-audit`, `safety check`
- Rust: `cargo audit`
- Go: `govulncheck`
- Ruby: `bundle audit`
- PHP: `composer audit`

#### 2. Verification log reference

**File**: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-health-check/references/health-check-schema.md`

**Intent**: Document the health-check.md output schema. Adapted from bootstrapper's `verification-log-schema.md` but focused on assessment rather than scaffold verification.

**Contract**: Schema documentation matching the output structure described above.

### Success Criteria:

#### Automated Verification:

- SKILL.md exists at the correct path
- References directory contains health-check-schema.md
- Skill is registered in the toolkit's skill registry (if one exists)

#### Manual Verification:

- Run `/10x-health-check` in a project with outdated deps → correctly identifies vulnerabilities and outdated packages
- Run `/10x-health-check` in a project with no tests → correctly flags missing test runner
- Run `/10x-health-check` in a project with stack-assessment.md present → links assessment gaps to health findings
- Output `health-check.md` follows the documented schema
- Recommended fixes are prioritized and actionable

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 8: m1-l3 Schema — Update lessons-schema.json

### Overview

Update the m1-l3 entry in `lessons-schema.json` to include brownfield health-check concepts in `owns`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders`.

### Changes Required:

#### 1. m1-l3 schema entry

**File**: `workbench/lessons-schema.json`

**Intent**: m1-l3's schema entry is fully populated with greenfield concepts. Add brownfield health-check alongside without removing greenfield content. The lesson now owns dual-mode execution: bootstrapper for greenfield, health-check for brownfield.

**Contract**:

`owns` additions:
- `"/10x-health-check jako brownfield odpowiednik bootstrappera: audyt zależności, skan bezpieczeństwa, ocena test runnera i CI/CD — z użyciem tych samych trzech bramek egzekucji (pre/in/post) jako framework oceny istniejącego projektu"`

`learningOutcomes` additions:
- `"Kursant potrafi uruchomić /10x-health-check na istniejącym projekcie i zinterpretować raport: stan zależności, pokrycie testami, konfiguracja CI/CD, i gotowość projektu do pracy z agentem."`

`requiredFragments` additions:
- `"Sekcja brownfield: /10x-health-check jako odpowiednik bootstrappera, mapowanie trzech bramek egzekucji na audyt istniejącego projektu (pre-check: dependency audit, in-check: test+CI analysis, post-check: agent-readiness verdict)."`

`videoPlaceholders` addition:
- `"Opcjonalnie: pokaz /10x-health-check na projekcie z problemami — widoczny audyt zależności, wykryte luki, raport z rekomendacjami."`

### Success Criteria:

#### Automated Verification:

- `lessons-schema.json` is valid JSON after edit
- m1-l3 entry contains all new items in `owns`, `learningOutcomes`, `requiredFragments`
- No other lesson entries were modified

#### Manual Verification:

- New `owns` items don't overlap with m1-l1 brownfield concepts (shaping) or m1-l2 (stack assessment)
- `learningOutcomes` are measurable and distinct from greenfield outcomes
- The three execution gates mapping (pre/in/post → health-check stages) is accurate

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 9: m1-l3 Lesson — Revise Spec + Draft

### Overview

Revise m1-l3 lesson-spec.md and lesson-draft.md to include a brownfield section for health-check alongside the greenfield bootstrapper narrative. The universal content (permissions, execution gates, defense-in-depth, tool taxonomy) stays as-is — it's the connective tissue between both paths.

### Changes Required:

#### 1. m1-l3 lesson spec

**File**: `workbench/lessons/m1-l3/lesson-spec.md`

**Intent**: Update the spec to include /10x-health-check as the brownfield path. The thesis expands: "bootstrap is the first real agent execution" becomes "bootstrap (greenfield) or health-check (brownfield) is the first real agent execution on your system." The permission policy and execution gates remain universal.

**Contract**: Update thesis (lines 30-31), owned concepts (lines 48-57), and add brownfield failure modes. The three execution gates (pre/in/post) get a brownfield mapping: pre-check (dependency audit), in-check (test+CI analysis), post-check (agent-readiness verdict).

#### 2. m1-l3 lesson draft

**File**: `workbench/lessons/m1-l3/lesson-draft.md`

**Intent**: Add brownfield sections alongside the greenfield bootstrapper narrative. The universal content (permissions at lines 121-200, execution gates at lines 91-119, defense-in-depth at lines 216-249, tool taxonomy at lines 269-305, delegate-to-CLI at lines 59-89) stays untouched — it applies to both paths. The brownfield section shows how /10x-health-check runs the same three execution gates on an existing project instead of scaffolding a new one.

**Contract**:

New/expanded sections:
- After the bootstrapper chain section (~after line 57): brief paragraph — "if you already have a project, you don't need a bootstrapper. /10x-health-check runs the same execution framework on your existing codebase"
- New section after verification.md (~after line 267): "Health-check: audyt istniejącego projektu" — explains /10x-health-check, maps three execution gates to health-check stages, shows how health-check.md complements stack-assessment.md
- In the dual-path framing: connect health-check output to m1-l4 bridge — "both paths (scaffolded repo and health-checked existing project) converge at agent onboarding"

The universal content is the lesson's backbone — it's what makes both paths coherent. The brownfield section adds a parallel narrative, not a replacement:
- "Co już masz na dysku" (lines 17-38): stays greenfield (file pipeline diagram), but brownfield section later shows the alternative pipeline
- Three execution gates (lines 91-119): universal — explicitly note they apply to health-check too
- Permission policy (lines 121-200): universal — no changes
- Defense-in-depth (lines 216-249): universal — no changes
- Tool surface (lines 269-305): universal — no changes

### Success Criteria:

#### Automated Verification:

- lesson-spec.md and lesson-draft.md are valid markdown
- No greenfield content was removed
- No universal content was duplicated or moved

#### Manual Verification:

- A brownfield learner reading the lesson knows: (1) /10x-health-check exists, (2) how it maps to the three execution gates, (3) what the output looks like, (4) how it connects to m1-l4
- The universal content (permissions, gates, defense-in-depth, tool taxonomy) reads naturally for both greenfield and brownfield learners
- The bridge to m1-l4 is explicit: both paths converge at agent onboarding with equivalent context artifacts

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Per-Skill Verification (Phases 1, 4, 7):

- Run each skill in both greenfield and brownfield contexts
- Verify output schemas match documented contracts
- Check that greenfield behavior is unchanged (no regressions)
- Test auto-detection edge cases: monorepo subdirs, empty dirs with stale files, nested projects

### Schema Validation (Phases 2, 5, 8):

- JSON validity check after each edit
- Cross-reference `owns` across m1-l1, m1-l2, m1-l3 — no concept should appear in multiple lessons' `owns`
- Verify `dependsOn` / `preparesFor` chains are consistent

### Lesson Review (Phases 3, 6, 9):

- Read brownfield sections in isolation — do they make sense without the greenfield context?
- Read the full lesson with brownfield sections — does the flow hold?
- Check that no m1-l4+ concepts leaked into m1-l1 through m1-l3

### End-to-End Brownfield Path:

- After all 9 phases: walk through the complete brownfield chain (shape → PRD → stack-assess → health-check) in a real existing project
- Verify that the output artifacts form a coherent set for m1-l4 agent onboarding

## Performance Considerations

- /10x-stack-assess and /10x-health-check run analysis on existing codebases — they should be designed to handle typical project sizes (1k-50k files) without excessive token consumption
- Per-language audit dispatch should use the project's existing package manager (detect from lockfile) rather than trying all audit tools

## References

- Research: `workbench/context/changes/prd-for-brownfields/research.md`
- /10x-shape skill: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md`
- /10x-prd skill: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-prd/SKILL.md`
- /10x-tech-stack-selector skill: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-tech-stack-selector/SKILL.md`
- /10x-bootstrapper skill: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-bootstrapper/SKILL.md`
- Agent-friendly quality gates: `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-tech-stack-selector/references/agent-friendly-criteria.md`
- m1-l1 lesson: `workbench/lessons/m1-l1/`
- m1-l2 lesson: `workbench/lessons/m1-l2/`
- m1-l3 lesson: `workbench/lessons/m1-l3/`
- Prework brownfield support: `src/content-source/lessons10xDevs3Prework/pl/15-4x2_dobry_i_zly_projekt_kursowy.md:45-46`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: m1-l1 Skills — Brownfield Mode for /10x-shape + Brownfield PRD Template

#### Automated

- [x] 1.1 /10x-shape SKILL.md passes lint — 94c3cef
- [x] 1.2 /10x-prd SKILL.md passes lint — 94c3cef
- [x] 1.3 No references to removed guards remain in SKILL.md files — 94c3cef
- [x] 1.4 context_type field documented in prd-schema.md for both modes — 94c3cef

#### Manual

- [ ] 1.5 /10x-shape proposes greenfield in empty directory
- [ ] 1.6 /10x-shape proposes brownfield in directory with package.json
- [ ] 1.7 /10x-prd generates brownfield PRD with 12-section template
- [ ] 1.8 /10x-prd generates greenfield PRD with existing 11-section template
- [ ] 1.9 Brownfield shape-notes.md includes ## Current System and ## Constraints

### Phase 2: m1-l1 Schema — Update lessons-schema.json

#### Automated

- [x] 2.1 lessons-schema.json is valid JSON — cb5f0cf8
- [x] 2.2 m1-l1 entry contains all new owns, learningOutcomes, requiredFragments items — cb5f0cf8
- [x] 2.3 No other lesson entries were modified — cb5f0cf8

#### Manual

- [ ] 2.4 Schema entries accurately describe brownfield concepts from Phase 1
- [ ] 2.5 owns items don't overlap with m1-l2 or m1-l3 brownfield concepts

### Phase 3: m1-l1 Lesson — Revise Spec + Draft

#### Automated

- [x] 3.1 lesson-spec.md and lesson-draft.md are valid markdown — 68a9cd3c
- [x] 3.2 No greenfield content was removed — 68a9cd3c
- [x] 3.3 Parenthetical at spec line 35 replaced with explicit brownfield coverage — 68a9cd3c

#### Manual

- [ ] 3.4 Brownfield learner knows what to run and how sessions differ
- [ ] 3.5 Greenfield narrative flow is not disrupted
- [ ] 3.6 No m1-l2 or m1-l3 concepts introduced prematurely

### Phase 4: m1-l2 Skills — New /10x-stack-assess Skill

#### Automated

- [x] 4.1 SKILL.md exists at correct path — bad0e1a3
- [x] 4.2 References directory contains agent-friendly-criteria.md — bad0e1a3
- [x] 4.3 Skill registered in toolkit skill registry — bad0e1a3

#### Manual

- [x] 4.4 Correct assessment of TypeScript/Next.js project — bad0e1a3
- [x] 4.5 Correct gate failures for untyped Express project — bad0e1a3
- [x] 4.6 stack-assessment.md follows documented schema — bad0e1a3
- [x] 4.7 Compensation recommendations are concrete and actionable — bad0e1a3

### Phase 5: m1-l2 Schema — Populate lessons-schema.json

#### Automated

- [x] 5.1 lessons-schema.json is valid JSON — a1ec6f83
- [x] 5.2 m1-l2 owns, learningOutcomes, requiredFragments, videoPlaceholders are non-empty — a1ec6f83
- [x] 5.3 No other lesson entries were modified — a1ec6f83

#### Manual

- [ ] 5.4 owns items cover all 9 spec concepts + brownfield stack assessment
- [ ] 5.5 learningOutcomes don't overlap with m1-l1 or m1-l3

### Phase 6: m1-l2 Lesson — Revise Spec + Draft

#### Automated

- [x] 6.1 lesson-spec.md and lesson-draft.md are valid markdown — 45b9d904
- [x] 6.2 No greenfield content was removed — 45b9d904
- [x] 6.3 Chain diagram shows both paths — 45b9d904

#### Manual

- [ ] 6.4 Brownfield learner knows about /10x-stack-assess and quality gates
- [ ] 6.5 Quality gates section doesn't duplicate agent-friendly-criteria.md verbatim
- [ ] 6.6 Homework has both greenfield and brownfield variants

### Phase 7: m1-l3 Skills — New /10x-health-check Skill

#### Automated

- [x] 7.1 SKILL.md exists at correct path — 966bcb0a
- [x] 7.2 References directory contains health-check-schema.md — 966bcb0a
- [x] 7.3 Skill registered in toolkit skill registry — 966bcb0a

#### Manual

- [x] 7.4 Correct detection of outdated deps — 966bcb0a
- [x] 7.5 Correct flagging of missing test runner — 966bcb0a
- [x] 7.6 Links stack-assessment.md gaps to health findings when present — 966bcb0a
- [x] 7.7 health-check.md follows documented schema — 966bcb0a

### Phase 8: m1-l3 Schema — Update lessons-schema.json

#### Automated

- [x] 8.1 lessons-schema.json is valid JSON
- [x] 8.2 m1-l3 entry contains all new owns, learningOutcomes, requiredFragments items
- [x] 8.3 No other lesson entries were modified

#### Manual

- [ ] 8.4 owns items don't overlap with m1-l1 or m1-l2 brownfield concepts
- [ ] 8.5 Three execution gates mapping is accurate

### Phase 9: m1-l3 Lesson — Revise Spec + Draft

#### Automated

- [x] 9.1 lesson-spec.md and lesson-draft.md are valid markdown — d889cd2d
- [x] 9.2 No greenfield content was removed — d889cd2d
- [x] 9.3 No universal content was duplicated or moved — d889cd2d

#### Manual

- [ ] 9.4 Brownfield learner knows about /10x-health-check and execution gate mapping
- [ ] 9.5 Universal content reads naturally for both paths
- [ ] 9.6 Bridge to m1-l4 is explicit for both paths
