# Improve Webinar Skills Implementation Plan

## Overview

Upgrade the 3-skill webinar pipeline (`10x-webinar-planner`, `10x-webinar-material`, `10x-webinar-writer`) with 4 independent quality improvements adapted from the lesson pipeline's process patterns. The lesson pipeline's quality comes from three levers — codified style rules, audience decision gates, and structural argument validation — none of which the webinar pipeline currently has. This plan imports those **process patterns** without importing the lesson pipeline's heavyweight data structures (schema JSON, ownership boundaries, side-effect ledgers).

Immediate use case: a webinar for non-technical people (designers, product managers) learning Claude Code — something the current pipeline literally cannot produce because the audience is hardcoded to mid-senior developers.

## Current State Analysis

The webinar pipeline has three skills and zero codified editorial guidance:

- **`10x-webinar-planner`** — produces `research.md` + high-level plan in chat. Hardcodes audience to "programmers, mostly mid-to-senior" at line 14 of SKILL.md. If input is only a title, asks one clarifying question and proceeds. No discovery flow, no audience profiling, no structured decision gates.
- **`10x-webinar-material`** — produces `talking-points.md` + `demo-ideas.md`. Has inline formatting rules (3-7 bullets, one cue per bullet) but reads no external style guide. No structural validation before writing. No post-draft review. Pipeline ends when files are written.
- **`10x-webinar-writer`** — orchestrator that chains planner → material with an approval gate between them. Needs no changes (child skills read files directly).

The lesson pipeline, by contrast, has 6 skills + a 520-line style guide refined over 3 iterations. Its quality comes from: (1) `workbench/style.md` constraining AI output, (2) `lesson-spec` decision gates forcing scope/audience decisions upfront, (3) structural logic maps catching argument flow problems before prose exists.

### Key Discoveries:

- The planner's design contract (lines 12-19 of SKILL.md) is the single source of audience assumptions — changing it with a discovery flow unlocks all non-default audience types
- The material skill already has a natural insertion point for the argument map (between "read research.md" at line 29 and writing at line 36) and for the post-draft review (after "After writing both files" at line 192)
- The existing webinar output (`thoughts/shared/webinars/2026-04-20-5-agent-skills-*`) shows the pipeline's strengths (excellent research, demo risk assessment) and gaps (manual `komentarze.md` and `todo.md` that the skills didn't generate)
- `bluf-input.md` provides 4 patterns (per-slide BLUF, demo framing, transition design, just-in-time context) that overlap with 2 of the research's 12 rules — after deduplication, the style guide lands at ~14 rules across 6 categories

## Desired End State

All three webinar skills remain as separate files with the same pipeline flow (planner → approval → material). But now:

1. The planner asks 4 structured audience/format questions before researching, adapting its design contract and research scope based on answers
2. A shared `webinar-style.md` with 14 rules governs talking-point quality, read by the material skill before every draft
3. The material skill maps argument beats before writing and runs a 5-dimension review after writing
4. The pipeline produces correct output for non-technical audiences (designers, PMs) — not just mid-senior developers

**Verification**: invoke the updated planner on "Claude Code for designers and product managers" and confirm the discovery flow triggers, audience profile appears in research.md, and the design contract adapts.

## What We're NOT Doing

- **No new skills** — improvements 3 and 4 are additions to the existing material skill, not a separate `10x-webinar-review` skill
- **No schema JSON** — webinars are standalone events, not part of a dependency graph
- **No side-effect ledger or ownership boundaries** — overkill for one-shot events
- **No iterative feedback loop (Improvement 5)** — deferred until 2+ webinars are completed and there's actual editorial feedback to codify
- **No changes to the orchestrator** — `10x-webinar-writer` chains child skills that handle their own internals
- **No changes to existing webinar output** — only the skill definitions and the new style guide

## Implementation Approach

Four independent phases, each touching one file (except Phase 1 which creates a new file). Independence means any phase can be implemented in isolation, but the recommended order is 1→2→3→4 because:
- Phase 3's post-draft review has a "style compliance" check that benefits from the style guide existing (Phase 1)
- Phase 4 (dry-run) tests the full pipeline, so all changes should be in place

---

## Phase 1: Create Webinar Style Guide

### Overview

Create `.claude/skills/webinar-style.md` with 14 rules across 6 categories, merging the research's 12 proposed rules with BLUF input's 4 patterns (deduplicating 2 overlaps). Each rule follows the `workbench/style.md` format: rule title, explanation, before/after examples, "How to apply" section.

### Changes Required:

#### 1. New style guide file

**File**: `.claude/skills/webinar-style.md` (new)

**Intent**: Create the single source of editorial guidance for webinar talking points and demo ideas. This file will be read by the material skill before every draft, analogous to how `workbench/style.md` governs lesson drafts. Start at iteration 1 with 14 rules; iterate after real webinar feedback.

**Contract**: Markdown file with YAML-less header (Meta section with iteration number, sources, last-updated date). Six categories, each containing 2-3 rules. Each rule has: title, 1-2 sentence explanation, before/after example pair, "How to apply" line.

Categories and rules:

**Communication Structure** (3 rules):
1. **Meta-rule: complete ≠ useful** — from BLUF input's core principle. Governs all other rules. "Wyjaśnienie kompletne rzadko jest tożsame z wyjaśnieniem użytecznym."
2. **BLUF per-slide** — lead with takeaway, bridge from known, layer details on demand. Merges BLUF input's per-slide structure. Before/after from bluf-input.md's anti-pattern vs. BLUF version.
3. **Just-in-time context** — filter every piece of information through "what does this audience need to DO with this?" Different audiences need different framings (VP → decision, designer → outcome, developer → Monday action). From BLUF input.

**Talking Point Craft** (3 rules):
4. **Talking point compression** — one cue per bullet, max 15 words. Split subordinate clauses.
5. **Non-obvious first** — surprising fact goes to top of bullet list as the anchor beat.
6. **No filler slides** — every slide must change what the audience understands. Cut if removing it loses nothing.

**Visual & Slide Design** (1 rule):
7. **Slide descriptions are visual** — describe what audience SEES (diagram type, screenshot shape), not what slide SAYS.

**Transitions & Arc** (3 rules):
8. **Transitions carry momentum** — carry the argument's weight forward, don't summarize. Merges research rule + BLUF transition design (dedup). Before/after from both sources.
9. **Opening hook within 30 seconds** — surface a tension the audience recognizes. Technical: a problem they've hit. Non-technical: a cost or risk they feel. Merges research rule + BLUF "thesis in first 2-3 minutes" (dedup).
10. **Closing = thesis restatement + one Monday action** — last slide repeats thesis differently + ONE action. Not three links, not a course promo.

**Demo Integration** (2 rules):
11. **Demo cue format** — use exactly: `**→ Demo [X]** — [one-line what audience will see]`. No re-describing demo in talking points.
12. **Demo framing with BLUF** — before a demo, state what it will prove (conclusion first), not build up to it. From BLUF input's demo framing section.

**Voice & Delivery** (2 rules):
13. **Audience-matched jargon** — non-technical: every technical term needs parenthetical or analogy on first use. Technical: don't expand CLI/API/LLM/CI.
14. **Source citation in speech** — use "(badania [Org], [rok])" for spoken citations, not academic format. Host doesn't read URLs aloud.

Optional 15th rule if space allows:
15. **Humor/aside budget** — 2-3 per webinar (not per slide). Short (5-10 words). Self-aware, not slapstick.

### Success Criteria:

#### Automated Verification:

- File exists at `.claude/skills/webinar-style.md`
- File has Meta section with iteration, sources, and last-updated fields
- File contains 14-15 rules across 6 categories
- Every rule has a before/after example pair

#### Manual Verification:

- Rules are clear and actionable — a human can judge whether a talking-point bullet complies
- Before/after examples demonstrate real quality differences (not trivial rewording)
- No rules conflict with each other
- The meta-rule ("complete ≠ useful") genuinely governs the other rules

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Add Audience-Adaptive Discovery to Planner

### Overview

Replace the hardcoded audience assumption in the planner with a structured 4-question discovery flow using `AskUserQuestion`. Each question has pre-selected defaults for the technical developer audience (zero friction for the 80% case) but enables full customization for non-default audiences.

### Changes Required:

#### 1. Add discovery flow section

**File**: `.claude/skills/10x-webinar-planner/SKILL.md`

**Intent**: Insert a `## Discovery Flow` section before `## Process` (between current line 20 and line 22) that runs 4 structured questions before any research begins. The answers shape the design contract, research scope, and output framing.

**Contract**: New section with 4 `AskUserQuestion` calls:

1. **Audience** (header: "Audience") — "Who is this webinar for?"
   - "⭐ Technical developers (mid-senior)" — current default
   - "Mixed technical / non-technical"
   - "Non-technical (designers, PMs, leaders)"
   - "Beginners learning to code with AI"

2. **Primary takeaway** (header: "Takeaway") — "What should they walk away with?"
   - "⭐ Practical skill they can use Monday"
   - "Mindset shift"
   - "Tool introduction + first steps"
   - "Strategic decision framework"

3. **Demo approach** (header: "Demos") — "How should demos work for this audience?"
   - "⭐ Live coding (technical audience)"
   - "Guided walkthrough with narration (mixed)"
   - "Pre-recorded clips with explanation (non-technical)"
   - "No demos — slides + narrative only"

4. **Technical depth** (header: "Depth") — "How deep on technical details?"
   - "⭐ Deep (show code, CLI, config files)"
   - "Medium (show outcomes, explain mechanisms)"
   - "Surface (focus on what, skip how)"

The discovery flow must run BEFORE the Process section's step 1 (scanning repos). Answers propagate into the design contract and research.

#### 2. Make design contract audience-adaptive

**File**: `.claude/skills/10x-webinar-planner/SKILL.md`

**Intent**: Transform the static design contract (lines 12-19) into a template that adapts based on discovery answers. The current contract is correct for technical audiences; non-default audiences need different rules.

**Contract**: Replace static bullets with conditional guidance:

- Non-technical audience: "Show > tell" becomes "Tell > show, with curated visual moments"
- Non-technical audience: "Non-obvious facts" should be non-obvious *to that audience* (e.g., "AI makes developers slower at first" surprises PMs who think they're buying pure productivity)
- Beginner audience: reduce demo count, increase context framing per demo
- Mixed audience: prepare jargon glossary, use analogies for technical concepts
- The contract section should note which audience profile is active and how it modifies behavior

#### 3. Add audience profile to research.md template

**File**: `.claude/skills/10x-webinar-planner/SKILL.md`

**Intent**: Add an `## Audience Profile` section to the research.md template (after `## Dla kogo`, around line 101) so the material skill can read audience parameters without a separate handoff mechanism.

**Contract**: New template section in research.md:

```markdown
## Audience Profile
- **Technical level**: [from discovery — e.g., "non-technical (designers, PMs)"]
- **Primary takeaway type**: [from discovery — e.g., "tool introduction + first steps"]
- **Demo approach**: [from discovery — e.g., "guided walkthrough with narration"]
- **Technical depth**: [from discovery — e.g., "surface (focus on what, skip how)"]
- **Jargon budget**: [derived — list terms to explain vs. assume vs. avoid]
```

### Success Criteria:

#### Automated Verification:

- SKILL.md contains a `## Discovery Flow` section with 4 `AskUserQuestion` specifications
- SKILL.md design contract section references audience profile
- SKILL.md research.md template contains `## Audience Profile` section
- Each discovery question has 3-4 options with one marked as recommended default

#### Manual Verification:

- Discovery flow appears naturally before research when the planner is invoked
- Selecting "non-technical" audience visibly changes the design contract (tell > show, jargon handling)
- Audience profile section appears in the generated research.md
- Default technical-developer selections require minimal friction (user can accept all defaults quickly)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Add Argument Flow Check and Post-Draft Review to Material Skill

### Overview

Add two additive sections to `10x-webinar-material/SKILL.md`: a pre-draft argument map that validates slide structure before writing, and a post-draft review checklist covering 5 dimensions. Both are inline steps, not separate skills.

### Changes Required:

#### 1. Add pre-draft argument map

**File**: `.claude/skills/10x-webinar-material/SKILL.md`

**Intent**: Insert a `## Pre-Draft: Argument Map` section between the input-reading instructions (line 32) and `## Deliverable 1` (line 36). This forces the skill to map argument beats before writing talking points, catching disconnected slides and structural problems early.

**Contract**: New section instructing the skill to produce a lightweight beat map in chat (not in any file) before writing:

For each planned slide:
- **Beat**: rough topic
- **Audience question**: what the viewer is implicitly asking at this point
- **Introduces**: new concept, fact, demo, or framing
- **Depends on**: what must already be established
- **Momentum to next**: why the next slide naturally follows

Four structural checks:
- Every demo appears AFTER the concept it proves
- Argument builds (each slide raises stakes or deepens understanding)
- No two consecutive "tell" slides without a visual break
- No slide answers a question nobody has asked yet

If the map reveals a structural problem, fix slide order BEFORE writing. Flag changes vs. the approved plan.

#### 2. Add post-draft review checklist

**File**: `.claude/skills/10x-webinar-material/SKILL.md`

**Intent**: Insert a `## Post-Draft Review` section after the "After writing both files" block (after line 203). This is a self-review that runs before reporting to chat, catching timing mismatches, audience drift, argument incoherence, and plan non-compliance.

**Contract**: New section with 5 review dimensions:

1. **Timing check** — sum slide durations (target 55-60 min), sum demo durations (match plan's budget ±2 min), flag any slide >8 min
2. **Audience fit** (if audience profile exists in research.md) — jargon level matches audience, demo complexity matches approach, "non-obvious facts" are non-obvious to THIS audience
3. **Argument coherence** — every "Przejście" carries argument weight (not just "teraz pokażemy..."), closing takeaways match thesis
4. **Plan compliance** — every plan section has a corresponding slide, no slide introduces topics not in the plan
5. **Style compliance** (if `webinar-style.md` exists) — spot-check 3 slides against style rules

Report issues in chat summary with severity: Blocker / Worth fixing / Note.

#### 3. Add style guide read instruction

**File**: `.claude/skills/10x-webinar-material/SKILL.md`

**Intent**: Add a Read instruction for `webinar-style.md` to the input-reading block (around line 29), so the material skill applies style rules while writing.

**Contract**: Add one line to the "Before drafting" block:

```
3. Read `.claude/skills/webinar-style.md` if it exists — apply its rules while writing talking-points.md.
```

### Success Criteria:

#### Automated Verification:

- SKILL.md contains `## Pre-Draft: Argument Map` section
- SKILL.md contains `## Post-Draft Review` section with 5 named dimensions
- SKILL.md "Before drafting" block references `webinar-style.md`
- Review section uses severity levels (Blocker / Worth fixing / Note)

#### Manual Verification:

- Argument map appears in chat before talking-points.md is written
- Post-draft review summary appears in chat after both files are written
- Style guide is read before drafting (visible in skill execution flow)
- Review catches at least one real issue in a test run (timing, audience fit, or plan compliance)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Dry-Run Verification

### Overview

Invoke the updated planner on "Claude Code for designers and product managers" to test the full pipeline end-to-end. This doubles as productive work — the output feeds the planned non-technical webinar.

### Changes Required:

#### 1. Invoke updated planner

**Intent**: Run `/10x-webinar-planner` with a non-technical audience topic to verify the discovery flow triggers, audience profile propagates, and the design contract adapts correctly.

**Contract**: Invoke with input resembling: "Webinar for designers and product managers learning Claude Code — how AI assistants change their daily workflow, what they can do without coding, and why they should care."

Verify during the run:
- Discovery flow asks 4 questions
- Non-technical defaults are selectable (not just technical defaults)
- Design contract adapts (tell > show, jargon handling, surface depth)
- Audience profile section appears in generated research.md
- Research scope shifts toward impact/cost/risk framing rather than technical architecture

#### 2. Verify style guide integration

**Intent**: After the planner finishes, check that the material skill would read the style guide. This can be a quick inspection rather than a full material generation.

**Contract**: Confirm that:
- `.claude/skills/webinar-style.md` is referenced in the material skill's "Before drafting" block
- The argument map step is present in the material skill
- The post-draft review step is present in the material skill

### Success Criteria:

#### Automated Verification:

- Planner invocation completes without errors
- Generated research.md contains `## Audience Profile` section
- Audience profile reflects non-technical selections (not hardcoded developer defaults)

#### Manual Verification:

- Discovery questions feel natural and non-redundant
- Design contract visibly adapts for non-technical audience (different from default developer framing)
- Research.md thesis and "Kluczowe twierdzenia" are framed for designers/PMs, not developers
- The generated plan could plausibly produce a good webinar for non-technical people

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Per-Phase Verification:

- **Phase 1**: Read the style guide, count rules, verify before/after pairs, check for internal contradictions
- **Phase 2**: Invoke the planner with a non-default audience topic, verify discovery flow and audience adaptation
- **Phase 3**: Inspect the material skill for both new sections (argument map + review), verify they're in the right positions
- **Phase 4**: End-to-end dry-run validates all changes together

### Integration Test:

- The dry-run in Phase 4 serves as the integration test — it exercises the full pipeline with a non-default audience, testing all 4 improvements in context

### Manual Testing Steps:

1. Open `.claude/skills/webinar-style.md` and verify each rule has a before/after example
2. Invoke `/10x-webinar-planner` with a non-technical topic — verify 4 discovery questions appear
3. Select non-technical audience — verify the design contract changes (tell > show)
4. Check the generated research.md for an `## Audience Profile` section with correct values
5. Inspect the material skill SKILL.md for argument map and review sections

## Performance Considerations

No performance concerns. All changes are to markdown skill definition files — no runtime code, no database queries, no API calls. The only "performance" factor is that the planner now asks 4 additional questions before researching, adding ~30 seconds of user interaction time to the planning phase.

## References

- Research: `context/changes/improve-webinar-skills/research.md`
- BLUF input: `context/changes/improve-webinar-skills/bluf-input.md`
- Lesson style guide (model): `workbench/style.md`
- Planner skill: `.claude/skills/10x-webinar-planner/SKILL.md`
- Material skill: `.claude/skills/10x-webinar-material/SKILL.md`
- Writer skill: `.claude/skills/10x-webinar-writer/SKILL.md`
- Existing webinar output: `thoughts/shared/webinars/2026-04-20-5-agent-skills-jakosciowe-programowanie-ai/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. See `references/progress-format.md`.

### Phase 1: Create Webinar Style Guide

#### Automated

- [x] 1.1 File exists at `.claude/skills/webinar-style.md` — e01a1d5f
- [x] 1.2 File has Meta section with iteration, sources, and last-updated fields — e01a1d5f
- [x] 1.3 File contains 14-15 rules across 6 categories — e01a1d5f
- [x] 1.4 Every rule has a before/after example pair — e01a1d5f

#### Manual

- [x] 1.5 Rules are clear, actionable, and non-conflicting
- [x] 1.6 Before/after examples demonstrate real quality differences

### Phase 2: Add Audience-Adaptive Discovery to Planner

#### Automated

- [x] 2.1 SKILL.md contains `## Discovery Flow` section with 4 AskUserQuestion specifications — 58757d54
- [x] 2.2 Design contract section references audience profile — 58757d54
- [x] 2.3 research.md template contains `## Audience Profile` section — 58757d54
- [x] 2.4 Each discovery question has 3-4 options with one marked as recommended default — 58757d54

#### Manual

- [x] 2.5 Discovery flow appears naturally before research when planner is invoked
- [x] 2.6 Non-technical audience selection visibly changes the design contract
- [x] 2.7 Default technical-developer selections require minimal friction

### Phase 3: Add Argument Flow Check and Post-Draft Review

#### Automated

- [x] 3.1 SKILL.md contains `## Pre-Draft: Argument Map` section — 017236ee
- [x] 3.2 SKILL.md contains `## Post-Draft Review` section with 5 named dimensions — 017236ee
- [x] 3.3 "Before drafting" block references `webinar-style.md` — 017236ee
- [x] 3.4 Review section uses severity levels (Blocker / Worth fixing / Note) — 017236ee

#### Manual

- [x] 3.5 Argument map appears in chat before talking-points.md is written
- [x] 3.6 Post-draft review summary appears in chat after both files are written
- [x] 3.7 Review catches at least one real issue in a test run

### Phase 4: Dry-Run Verification

#### Automated

- [x] 4.1 Planner invocation completes without errors
- [x] 4.2 Generated research.md contains `## Audience Profile` section
- [x] 4.3 Audience profile reflects non-technical selections

#### Manual

- [x] 4.4 Discovery questions feel natural and non-redundant
- [x] 4.5 Research.md is framed for designers/PMs, not developers
- [x] 4.6 Generated plan could plausibly produce a good non-technical webinar
