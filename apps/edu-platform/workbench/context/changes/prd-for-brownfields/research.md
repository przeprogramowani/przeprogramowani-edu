---
date: 2026-05-08T08:48:59+02:00
researcher: Claude (10x-research)
git_commit: b4654ef4fea000ac8cd055dc68692f4c235ca921
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "Brownfield support gap in M1 lessons and skills"
tags: [research, codebase, brownfield, m1-l1, m1-l3, 10x-shape, 10x-prd, 10x-tech-stack-selector, 10x-bootstrapper]
status: complete
last_updated: 2026-05-08
last_updated_by: Claude (10x-research)
---

# Research: Brownfield Support Gap in M1 Lessons and Skills

**Date**: 2026-05-08T08:48:59+02:00
**Researcher**: Claude (10x-research)
**Git Commit**: b4654ef4fea000ac8cd055dc68692f4c235ca921
**Branch**: master
**Repository**: przeprogramowani/przeprogramowani-sites

## Research Question

What is the current greenfield-only framing across m1-l1 through m1-l3, the underlying skills (/10x-shape, /10x-prd, /10x-tech-stack-selector, /10x-bootstrapper), and what needs to change so brownfield learners can build crucial project context and get maximum value from M1 before entering M2's reusable workflow?

## Summary

The greenfield assumption is **pervasive and structural** — it exists in the skills themselves (hard refusals), in the lesson artifacts (every demo, gate, checklist, and call to action), and in the schema contracts (PRD schema, hand-off files). However, roughly **40% of the lesson content is universally applicable** (permission policies, execution gates, defense-in-depth, tool taxonomy) and needs reframing rather than rewriting. The skills can be extended with a mode flag without forking. The biggest gap is not in the existing material but in what's **missing entirely**: brownfield users need a stack assessment → agent context generation → health check chain that replaces the tech-stack-selector → bootstrapper chain.

## Detailed Findings

### 1. m1-l1: "Od pomysłu do PRD" — Greenfield Saturation

The greenfield assumption saturates all three artifacts (spec, grounding, draft):

**Skill-level block:** The grounding document explicitly states `/10x-shape is greenfield-only` (lesson-grounding.md). The skill's SKILL.md has three hard guards: the description frontmatter says `"turns a greenfield idea into shape-notes.md"`, a "When to skip" section says `"This skill is greenfield-only. Brownfield mode is out of scope; if asked to shape against an existing codebase, decline politely and point at /10x-frame."`, and Critical guardrail #6 says `"Greenfield only. If the user invokes this skill against an existing codebase, decline politely and point at /10x-frame."`.

**All six discovery phases assume a blank slate:** Vision & problem asks "who has the pain" (not "what does the system do today"); Persona & access control asks "how does this person get into the app" (not "how does auth work now"); MVP discipline uses "MVP-in-a-week" and "greenfield trap" language; FRs & user stories captures capabilities from zero; Business logic & data runs empty-CRUD detection (nonsensical for production systems); Product framing asks "what kind of thing are you building" (not "what's changing").

**One exception:** Phase 4.5 (Socratic challenge) is mode-agnostic — challenging FRs works for both modes.

**One acknowledgment, no follow-through:** The draft contains a single paragraph "Nie tylko na start projektu" (lesson-draft.md:208-213) that says the workflow applies to features too, but provides no brownfield example, adapted checklist, or mention of existing-system constraints. The spec's parenthetical "(lub przynosi własny problem z pracy)" at line 35 is the only other nod.

**Sole demo is greenfield:** The walkthrough uses a habit tracker app from scratch. Before/after shows going from a vague idea to a first product definition. The call to action says "run the cycle on your idea."

**Missing brownfield concerns:** No mention of existing codebase audit, existing users/data as constraints, backward compatibility, technical debt as shaping input, integration constraints, or "delta PRD" concept (PRD for a feature within an existing product vs. PRD for a whole product).

### 2. m1-l2: "Od chatbota do Agenta" — 65/30 Split

m1-l2 has two halves: skills/metaprompting (universal) and tech-stack selection (greenfield-only). It is the cleanest of the three lessons for brownfield adaptation.

**Universally applicable (~65%):** The entire skills half is mode-agnostic — skill anatomy, progressive disclosure, token budgets, skill-vs-prompt contrast, decision heuristic, registry consumption (`skills.sh`, `npx skills add`), vendor skills (Vercel react-best-practices, Supabase postgres), security audit model, 10xWorkflow forward-looking map, and metaprompting preview via skill-creator. No changes needed.

**Greenfield-only (~30%):** Concentrated in the `/10x-tech-stack-selector` worked example (lesson-draft.md:121-189), the chain diagram showing bootstrapper (lesson-draft.md:208-217), the homework assignment "run /10x-tech-stack-selector on your PRD" (lesson-draft.md:225), and all bridge-out framing to m1-l3 bootstrapper (lesson-draft.md:13, 176, 225). The before/after comparison contrasts "bad way to choose a stack" vs "good way to choose a stack" — for brownfield the question is not choosing but assessing.

**Key brownfield-adaptable concept:** The agent-friendly quality gates (typed, convention-based, popular in training data, well-documented) are framed as starter selection criteria but are MORE relevant for brownfield assessment. The compensation path ("if your stack fails gates, document conventions in CLAUDE.md") is exactly what brownfield users need. A brownfield section could reuse the same gates with different framing: "evaluate your existing stack" instead of "choose a new stack."

**What brownfield users need at this lesson stage:**
1. A `/10x-stack-assess` skill (or assessment mode) that evaluates an existing codebase against agent-friendly quality gates
2. An output artifact (e.g., `stack-assessment.md`) documenting: gates passed/failed, compensation strategies, gaps
3. A different bridge-out: "you now know where your stack needs compensation" instead of "bootstrapper reads your tech-stack.md"
4. A homework variant: "run assessment on your existing project" alongside "run selector on your PRD"

### 3. m1-l3: "AI-Powered Bootstrap" — 60/40 Split

m1-l3 is the most greenfield-dependent lesson because it literally bootstraps a new project. However, analysis shows a 60/40 split:

**Greenfield-only (~60%):** The entire bootstrapper chain (trigger, starter CLI, scaffold, verification.md), the mismatch demo ("stwórz mi projekt Astro" vs. bootstrapper), the "Dlaczego agent nie pisze projektu sam" section, the HARD-STOP mechanics, the conflict matrix (.scaffold siblings), and the bridge-out ("scaffolded repo on disk").

**Universally applicable (~40%):** Permission prompt configuration (settings.json, deny→ask→allow), three execution gates (pre/in/post — framework-agnostic), YOLO mode analysis with Anthropic devcontainer guidance, probabilistic control & defense-in-depth framing, Read/Edit-vs-Bash gap, cross-tool portability (Codex/Cursor), tool surface taxonomy (built-in / CLI / MCP), and the "delegate to authoritative CLI" principle (works for brownfield: `prisma migrate dev`, `docker init`, `ng generate`).

**Key salvageable patterns:** The verification.md structured log pattern, per-language audit dispatch (npm audit, pip-audit, cargo audit, etc.), and the pre-check → execute → audit three-gate frame are all reusable for brownfield health checks.

### 3. /10x-shape Skill — Extensible Without Forking

The skill has three explicit greenfield-only guards (description, "when to skip", guardrail #6). All six phases assume no existing system. But the core architecture — phased discovery, checkpoint-resumable sessions, schema-validated output, facilitator-not-generator stance — is sound for both modes.

**Extension approach (mode flag):**
- Add `context_type: greenfield | brownfield` detection (e.g., presence of `src/`, `package.json` in cwd)
- Phase 1 reframe: "What is the current system's pain?" + "What must be preserved?"
- Phase 2 reframe: "Describe current auth" before asking what changes
- Phase 3 replace: Drop "MVP-in-a-week" and "greenfield trap" → "smallest incremental change that proves the improvement"
- Phase 4 reframe: Add FR category `new | modified | preserved`
- Phase 5 reframe: "What is the existing domain rule?" before empty-CRUD check → "does this change add/modify a domain rule, or is it infrastructure-only?"
- Phase 6 reframe: Product-type/scale become "is this changing?" yes/no gates
- Step 7 gate: Add "existing system impact" check

**Risk:** Question-phrasing bloat. One `if brownfield:` block per phase is manageable; sub-modes (refactor vs. new feature vs. migration) would be unwieldy.

### 4. /10x-prd Skill — Schema Extension Needed

Unlike /10x-shape, /10x-prd has **no explicit greenfield guard** — it's technically input-agnostic and transforms whatever notes it receives. It inherits the greenfield assumption transitionally via the chain.

**PRD schema gaps for brownfield:**
- No `context_type` field to signal mode
- No `## Current System` / `## As-Is` section before Vision
- `product_type` forces re-categorization (should allow `existing_product: true`)
- `timeline_budget.mvp_weeks` uses greenfield language (brownfield: `delivery_weeks`)
- All 11 sections ask "what will the product do?" not "what exists now and what changes?"
- `## Open Questions` works universally

**Extension approach:** Add optional fields (`context_type`, `## Current System` section), alias `mvp_weeks` to `delivery_weeks`, add per-section conditional: if brownfield, emit "existing" vs. "changing" subsections. Existing greenfield PRDs remain valid because all additions are optional.

### 5. /10x-tech-stack-selector and /10x-bootstrapper — Not Applicable to Brownfield

**Tech-stack-selector:** Explicitly says "skip when the user is mid-implementation on an existing codebase." Its Q0-Q8 interview is about *choosing* a stack, not assessing one. The output contract (tech-stack.md with `starter_id`) has no meaning for an existing project.

**Salvageable:** The four agent-friendly quality gates (typed, convention-based, popular in training data, well-documented) are a useful lens for evaluating any existing stack. The compensation path ("if your stack fails gates, document conventions in CLAUDE.md") is directly applicable — in fact, it's *more* relevant for brownfield.

**Bootstrapper:** Runs `npm create <starter>@latest` — literally creates a new project. The populated-cwd guard treats existing `package.json` as an abnormal condition. Zero direct value for brownfield.

**Salvageable:** The verification.md pattern, per-language audit dispatch (`bootstrapper-config.yaml`), and the permission/refusal pattern are all reusable templates.

### 7. What Brownfield Users Actually Need (The Missing Chain)

Greenfield chain: `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper`

Brownfield replacement:

| Stage | Lesson | Greenfield skill | Brownfield equivalent | Output |
|-------|--------|-----------------|----------------------|--------|
| Shape the work | m1-l1 | /10x-shape (greenfield mode) | /10x-shape (brownfield mode) | shape-notes.md with existing-system context |
| Document intent | m1-l1 | /10x-prd | /10x-prd (brownfield-aware) | prd.md with `## Current System` section |
| Assess stack | m1-l2 | /10x-tech-stack-selector | **/10x-stack-assess** (new) | stack-assessment.md: quality gates, gaps, compensation needed |
| Prepare codebase | m1-l3 | /10x-bootstrapper | health check + permissions (universal content) | health-check.md |
| Onboard agent | m1-l4 | agent onboarding | agent onboarding (same for both) | CLAUDE.md / AGENTS.md |

The brownfield chain's deliverable is not a scaffolded repo — it's **agent-ready context files for an existing codebase**: stack assessment, dependency health report, and a gap analysis of what the agent can and can't do confidently. Agent onboarding (CLAUDE.md generation) stays in m1-l4 for both paths — no collision.

## Architecture Insights

### The M1 Module Structure — Dual Pipeline

The current M1 flow is a greenfield-only pipeline:
```
m1-l1 (idea → PRD) → m1-l2 (PRD → tech-stack.md) → m1-l3 (tech-stack.md → scaffolded repo) → m1-l4 (onboarding) → m1-l5 (deployment)
```

With brownfield support, it becomes a dual pipeline that converges at m1-l4:
```
Greenfield: m1-l1 shape+prd → m1-l2 tech-stack-selector → m1-l3 bootstrapper ──┐
                                                                                 ├→ m1-l4 onboarding → m1-l5 deployment
Brownfield: m1-l1 shape+prd → m1-l2 stack-assess        → m1-l3 health-check ──┘
```

**m1-l1 is the fork point.** Both paths produce a PRD; the brownfield PRD adds `## Current System` context. Each subsequent lesson has a greenfield primary track and a dedicated brownfield section.

### Per-Lesson Greenfield/Universal Split

| Lesson | Greenfield-only | Universal | Brownfield adaptation needed |
|--------|----------------|-----------|------------------------------|
| m1-l1 | ~85% (all phases, demo, gates, CTA) | ~15% (Socratic challenge, PRD-as-contract concept) | Heaviest rewrite — phases, demo seed, gates, CTA |
| m1-l2 | ~30% (tech-stack-selector worked example, chain diagram, homework) | ~65% (skills anatomy, metaprompting, registries, audit) | Moderate — add brownfield section to tech-stack chapter |
| m1-l3 | ~60% (bootstrapper chain, starter CLI, verification.md, conflict matrix) | ~40% (permissions, execution gates, defense-in-depth, tool taxonomy) | Moderate — brownfield section replaces bootstrapper with health-check |

### The "Bigger Feature" Escape Hatch

Both the m1-l1 spec and draft already acknowledge that the shape→prd workflow applies to "bigger features and modules," not just new projects. This is the natural bridge to brownfield: a brownfield user shaping a new module within an existing system is structurally similar to a greenfield user shaping a new product — the difference is that the brownfield user has more constraints and more existing context to account for.

### M2 Forward Compatibility

M2 presents a reusable workflow applicable to any context. This means M1's job is to give **every learner** (greenfield and brownfield) the foundational context artifacts that M2's workflow consumes. For greenfield: PRD + tech-stack.md + scaffolded repo. For brownfield: PRD-with-existing-context + stack-assessment + health-check. Both paths converge at m1-l4 (agent onboarding) where the agent gets its instruction files.

### Prework Continuity

Prework [4.2] explicitly supports brownfield: *"Akceptowane są różne ścieżki: własna aplikacja z logiką biznesową lub rozbudowanie istniejącego projektu o nowy moduł."* (source: `src/content-source/lessons10xDevs3Prework/pl/15-4x2_dobry_i_zly_projekt_kursowy.md:45-46`). The main course must follow through on this prework promise.

## Code References

- `workbench/lessons/m1-l1/lesson-spec.md:35` — sole parenthetical acknowledgment of brownfield ("lub przynosi własny problem z pracy")
- `workbench/lessons/m1-l1/lesson-draft.md:208-213` — "Nie tylko na start projektu" paragraph, sole brownfield-aware content
- `workbench/lessons/m1-l1/lesson-grounding.md:31` — explicit statement "/10x-shape is greenfield-only"
- `workbench/lessons/m1-l2/lesson-draft.md:121-189` — greenfield-only tech-stack-selector worked example
- `workbench/lessons/m1-l2/lesson-draft.md:208-217` — chain diagram ending in bootstrapper
- `workbench/lessons/m1-l2/lesson-draft.md:225` — greenfield-only homework ("run /10x-tech-stack-selector on your PRD")
- `workbench/lessons/m1-l2/lesson-draft.md:19-118` — universally applicable skills/metaprompting content
- `workbench/lessons/m1-l3/lesson-spec.md:20` — "projekt jeszcze nie istnieje" as the lesson job
- `workbench/lessons/m1-l3/lesson-draft.md:120-198` — universally applicable permission policy content
- `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md:34` — "When to skip: this skill is greenfield-only"
- `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md:501` — Critical guardrail #6: greenfield-only
- `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-prd/SKILL.md` — no explicit greenfield guard, inherits transitionally
- `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-tech-stack-selector/SKILL.md` — "skip when mid-implementation on existing codebase"
- `~/code/10x-toolkit/packages/ai-artifacts/skills/10x-bootstrapper/SKILL.md` — chain-mode only, populated-cwd guard

## Decisions (resolved 2026-05-08)

1. **Scope of skill changes:** Extend /10x-shape and /10x-prd in 10x-toolkit first. Revise lessons in subsequent phases.

2. **New skills or lesson content?** Implement brownfield chain as real skills delivered via 10x-cli. **Collision resolved:** agent-onboard would collide with m1-l4's scope ("Agent Onboarding: Agents.md, AI Rules i feedback loops"). Resolution: m1-l3 brownfield does stack assessment + health check only (no CLAUDE.md generation). m1-l4 handles agent onboarding for BOTH paths. Both converge:
   - Greenfield m1-l3: bootstrapper → scaffolded repo (no CLAUDE.md, v1 doesn't generate it)
   - Brownfield m1-l3: stack-assess → assessment report (no CLAUDE.md either)
   - m1-l4: both paths → agent onboarding with instruction files

3. **m1-l2 and m1-l3 restructuring depth:** Parallel tracks — greenfield remains primary narrative, brownfield gets dedicated sections. No brownfield sidebar/callout pattern; full sections.

4. **Demo strategy:** No brownfield demo in M1. Brownfield demo is M4 territory. M1 supports brownfield users with skills, sections, and adapted checklists — not with a parallel walkthrough.

5. **Schema impact:** Unrestricted. Revise `owns`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders`, `sideEffectLedger` as needed.

6. **PRD schema versioning:** No version bump needed. No existing users — break the contract freely. Add `context_type`, `## Current System`, alias `mvp_weeks` to `delivery_weeks`.

7. **Prework alignment:** No prework update needed. Prework [4.2] already explicitly supports brownfield: *"Akceptowane są różne ścieżki: własna aplikacja z logiką biznesową lub rozbudowanie istniejącego projektu o nowy moduł."* (source: `src/content-source/lessons10xDevs3Prework/pl/15-4x2_dobry_i_zly_projekt_kursowy.md:45-46`). The main course needs to follow through on this prework promise, not change the prework.
