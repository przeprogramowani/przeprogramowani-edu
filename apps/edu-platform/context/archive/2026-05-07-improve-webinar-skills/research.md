---
date: 2026-05-07T12:00:00+02:00
researcher: Claude
git_commit: 147cab791b3eb17a8a81bceab1d04c7cfc804eb6
branch: master
repository: przeprogramowani-sites
topic: "How to improve webinar skills by adapting high-return patterns from the lesson pipeline"
tags: [research, skills, webinar, lesson-pipeline, style-guide, audience-adaptation]
status: complete
last_updated: 2026-05-07
last_updated_by: Claude
---

# Research: Improving Webinar Skills with Lesson Pipeline Patterns

**Date**: 2026-05-07
**Researcher**: Claude
**Git Commit**: 147cab791b3eb17a8a81bceab1d04c7cfc804eb6
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How can we improve the webinar skill pipeline (`.claude/skills/10x-webinar-{planner,material,writer}`) by adapting patterns from the lesson pipeline (`workbench/.claude/skills/lesson-{spec,grounding,draft,rc-review,editor-pl}` + `workbench/style.md`), without overcomplicating with heavy infrastructure like `lessons-schema.json`? Identify 3-5 highest-return, mostly independent improvements. Immediate use case: a webinar for non-technical people (designers, product managers) learning Claude Code.

## Summary

The lesson pipeline has six skills and a 520-line style guide refined over 3 iterations. The webinar pipeline has three skills and zero codified voice/style guidance. The lesson pipeline's highest-value patterns are: (1) audience-aware decision gates before planning, (2) codified style rules that constrain AI output quality, (3) structural argument validation before prose exists, and (4) a quality-gate review step.

The webinar pipeline already does some things very well — the research output is excellent, demo-ideas.md is well-structured with Plan B/risk/timing — but it has three critical gaps that directly hurt output quality and prevent audience adaptation.

## Detailed Findings

### Gap Analysis: What the Lesson Pipeline Has That Webinar Skills Lack

#### 1. Audience Profiling & Decision Gates

**Lesson pipeline (`lesson-spec`)** has a structured discovery flow with 10+ decision areas collected via `AskUserQuestion` before any planning begins:
- user's intended angle or thesis
- learner profile and current pain
- desired behavioral change
- example/demo anchor
- concepts owned vs. referenced-only
- prework continuity
- tool transferability

The skill explicitly says: "Do not proceed to step 3 until the user responds."

**Webinar pipeline (`10x-webinar-planner`)** has essentially no discovery. The design contract is hardcoded:

```
Audience: programmers, mostly mid-to-senior, comfortable with modern tooling
```

If the input is only a title, the planner asks "one clarifying question" and proceeds. There is no audience profiling, no structured options, no decision gates.

**Impact**: The planner literally cannot produce a good plan for non-technical audiences. The thesis framing, demo complexity, jargon level, tell/show ratio, and "non-obvious facts" selection all depend on who's in the room, and right now the skill assumes the answer.

**Evidence from existing output**: The `5-agent-skills` research.md's "Dla kogo" section says "Mid-to-senior developer, który używa już Cursora / Claude Code / Copilota na co dzień" — this is the only audience the current skill can produce for.

#### 2. Codified Voice/Style Rules

**Lesson pipeline** has `workbench/style.md` — 520 lines, 29 rules, 10 categories, built from 3 iterations of comparing AI output vs. human edits. Rules include concrete before/after examples. Both `lesson-draft` and `lesson-editor-pl` read this file and apply it.

**Webinar pipeline** has zero style guidance. The material skill has inline rules ("3-7 bullets per slide", "one cue per bullet", "no paragraphs") but no external style file that can be iterated independently. There are no before/after examples of good vs. bad talking points.

**Impact**: Every webinar draft starts from scratch. Quality depends on whatever the model defaults to, not on accumulated editorial learning. The `komentarze.md` file in the existing webinar (`thoughts/shared/webinars/2026-04-20-*/komentarze.md`) captures post-hoc feedback but there's no mechanism to feed it back into future webinars.

#### 3. Structural Argument Validation

**Lesson pipeline** has two mechanisms:
- `lesson-spec` produces a "Structural Logic Map" with 5-12 beats, each specifying: what the learner sees, question answered, introduces, depends on, sets up, risk.
- `lesson-editor-pl` runs an "Argument Architecture" pass: beat map → system-level diagnosis → reorder before polish.

**Webinar pipeline** has no structural validation. The planner produces a time-boxed table (`Struktura 60 minut`) and a `Logika narracji` section, but these are high-level descriptions, not beat-by-beat dependency checks. The material skill then writes talking points slide-by-slide without checking if the argument builds momentum.

**Impact**: Slides can feel disconnected. The "Przejście do następnej sekcji" field exists in the template but there's no validation that the transition actually carries weight from the previous slide's argument.

#### 4. Quality Gate / Review Step

**Lesson pipeline** has `lesson-rc-review` — a dedicated review skill that checks 10 dimensions (spec compliance, grounding, scope control, pedagogical value, tool transferability, editorial quality, diagram quality, video alignment, etc.) with severity levels (Blocker/Major/Minor/Note).

**Webinar pipeline** has no review step at all. The pipeline ends when `10x-webinar-material` writes talking-points.md and demo-ideas.md. There's no structured check against the plan, no audience-fit verification, no timing validation.

**Impact**: The user manually reviews everything. The `komentarze.md` and `todo.md` in the existing webinar were created manually by the user — the skill pipeline didn't produce them.

### What the Webinar Pipeline Already Does Well

These should NOT be changed:

- **Research quality**: The existing `research.md` is excellent — 12 grounded claims with sources, counter-arguments with rebuttals, non-obvious facts, and demo candidates with risk assessment.
- **Demo ideas structure**: Plan B for every demo, timing, ryzyka live, setup requirements. This is better than the lesson pipeline's video-scenario in some ways (more production-realistic).
- **Planner's "Kontrargumenty / obawy publiczności"**: Great pattern that the lesson pipeline doesn't have.
- **"Demos we're NOT doing" section**: Prevents scope creep during live recording. Smart.
- **Approval gate between plan and material**: Clean hand-off.
- **Talk-heavy framing**: The "show > tell, but non-obvious telling wins" contract is well-articulated.

### What lessons-schema.json Adds (And Why It's Too Much for Webinars)

The schema provides: dependency graph between lessons, ownership boundaries (`owns`, `referencesOnly`, `mustNotCover`), required fragments, video placeholders, grounding source metadata with confidence levels, and side-effect ledgers.

For webinars this is overkill because:
- Webinars are standalone, not part of a dependency graph
- There's no multi-author scope conflict to manage
- The side-effect ledger tracks curriculum drift, which doesn't apply to one-shot events
- Grounding source metadata in JSON is useful for the lesson pipeline's multi-skill handoff, but webinar research.md already captures sources in prose

The lesson pipeline patterns worth importing are the **process patterns** (decision gates, style rules, argument validation, review), not the **data structures** (schema JSON, ownership boundaries, ledgers).

## The 5 Highest-Return Improvements

Ordered by immediate impact. Improvements 1-4 are independent of each other. Improvement 5 depends on having at least 2 webinars completed.

### Improvement 1: Audience-Adaptive Design Contract (change: `10x-webinar-planner`)

**What**: Replace the hardcoded audience assumption with a structured decision-gate interview at the start of the planner. Add an audience profile that shapes research scope, demo complexity, jargon handling, and tell/show ratio.

**Inspired by**: `lesson-spec` steps 2-3 (AskUserQuestion with structured options + flaw highlighting before planning).

**Concrete changes to `10x-webinar-planner/SKILL.md`**:

1. Add a `## Discovery Flow` section before `## Process` with 3-4 `AskUserQuestion` calls:
   - **Audience**: "Who is this webinar for?" — options like "Technical developers (mid-senior)", "Mixed technical/non-technical", "Non-technical (designers, PMs, leaders)", "Beginners learning to code with AI"
   - **Primary takeaway**: "What should they walk away with?" — "Mindset shift", "Practical skill they can use Monday", "Tool introduction + first steps", "Strategic decision framework"
   - **Demo approach**: "How should demos work for this audience?" — "Live coding (technical audience)", "Guided walkthrough with narration (mixed)", "Pre-recorded clips with explanation (non-technical)", "No demos, slides + narrative only"
   - **Depth**: "How deep on technical details?" — "Deep (show code, CLI, config files)", "Medium (show outcomes, explain mechanisms)", "Surface (focus on what, skip how)"

2. Modify the "design contract" section to be a template that adapts based on answers:
   - Non-technical audience: shift "Show > tell" to "Tell > show, with curated visual moments"
   - Non-technical audience: "Non-obvious facts" should be non-obvious *to that audience* (e.g., "AI makes developers slower" is surprising to PMs who think they're buying productivity)
   - Beginner audience: reduce demo count, increase context framing per demo

3. Add an audience-aware section to `research.md` template:
   ```markdown
   ## Audience Profile
   - Technical level: [from discovery]
   - Primary takeaway type: [from discovery]
   - Demo approach: [from discovery]
   - Jargon budget: [derived — list of technical terms to explain vs. assume vs. avoid]
   ```

**ROI**: Unlocks an entire category of webinars (non-technical audiences) that the current pipeline cannot produce. Directly addresses the Claude Code for designers/PMs use case.

**Independence**: Fully independent. Only touches `10x-webinar-planner/SKILL.md`.

### Improvement 2: Webinar Style Guide (`webinar-style.md`)

**What**: Create a codified style guide for webinar talking points and demo ideas, analogous to `workbench/style.md` but for spoken/presentation content. Start with ~12-15 rules, iterate after 2-3 webinars.

**Inspired by**: `workbench/style.md` (29 rules with before/after examples, iterated over 3 cycles).

**Location**: `thoughts/shared/webinars/webinar-style.md`

**Concrete rules to seed (derived from patterns in existing webinar output + lesson style guide adaptations)**:

1. **Talking point compression**: One cue per bullet, max 15 words. If a bullet has a subordinate clause, split it. (Analogous to style.md's "max 3 sentences per paragraph")
2. **Non-obvious first**: When a slide has 5+ bullets, the surprising fact goes to the top. The anchor beat the host should land first.
3. **Slide descriptions are visual**: "Slajd:" should describe what the audience SEES (diagram type, screenshot, code snippet shape), not what the slide SAYS. Bad: "Slajd: definicja agenta". Good: "Slajd: diagram — chatbot (prosta strzałka) vs agent (pętla ze strzałkami do narzędzi)".
4. **Transitions are momentum, not labels**: "Przejście:" should carry the argument's weight forward, not summarize. Bad: "Przejście: przechodzimy do demo." Good: "Przejście: wiemy już, że agent potrzebuje reguł — pytanie brzmi: jak je zakodować?"
5. **Audience-matched jargon**: For non-technical audiences, every technical term needs a parenthetical or analogy on first use. For technical audiences, don't expand CLI/API/LLM/CI. (From style.md's acronym handling rules)
6. **Demo cue format**: When talking-points.md references a demo, use exactly: "**→ Demo [X]** — [one-line what audience will see]". No re-describing the demo.
7. **Source citation in speech**: Use "(badania [Org], [rok])" for spoken citations, not academic format. Host doesn't read URLs aloud.
8. **Humor/aside budget**: 2-3 per webinar, not per slide. Short (5-10 words). Self-aware, not slapstick. (From style.md's humor rule, adapted for spoken delivery)
9. **No filler slides**: Every slide has a talking-point beat that changes what the audience understands. If removing a slide wouldn't lose anything, cut it.
10. **"Moment show" must have a culmination line**: Every demo reference in talking-points must include what the audience will SEE at the climax. Not "host shows code review" but "agent stops, asks 3 questions instead of generating code." (From demo-ideas.md's "Co publiczność ma zobaczyć w kulminacji")
11. **Opening hook**: First slide within 30 seconds must surface a tension the audience recognizes. For technical: a problem they've hit. For non-technical: a cost or risk they feel. (Adapted from style.md's bridge/universal-scenario rule)
12. **Closing = thesis restatement + one Monday action**: Last slide repeats the thesis in different words and gives ONE thing to do on Monday. Not three links. Not "check out our course." (Adapted from style.md's "replace prescriptive labels with questions + next steps")

**How the pipeline uses it**:
- `10x-webinar-material` reads `webinar-style.md` before writing talking-points.md
- `10x-webinar-planner` references it in the plan template (optional — planner doesn't write prose)
- A future review skill checks against it

**ROI**: Every webinar benefits from accumulated editorial learning instead of starting from zero. The guide compounds in value as it's iterated (like style.md went from iter 1 to iter 3).

**Independence**: Fully independent. New file + one `Read` instruction added to `10x-webinar-material/SKILL.md`.

### Improvement 3: Lightweight Argument Flow Check in Material Skill

**What**: Add a structural validation step to `10x-webinar-material` that maps the argument beat-by-beat before writing talking points. Catch disconnected slides, missing transitions, and argument gaps.

**Inspired by**: `lesson-spec`'s "Structural Logic Map" and `lesson-editor-pl`'s "Argument Architecture" pass.

**Concrete changes to `10x-webinar-material/SKILL.md`**:

Add a `## Pre-Draft Argument Map` step between reading the plan/research and writing talking-points.md:

```markdown
## Pre-Draft: Argument Map

Before writing talking-points.md, produce a lightweight beat map in chat (not in any file):

For each planned slide:
- **Beat**: what this slide is roughly about
- **Audience question**: what the viewer is implicitly asking at this point
- **Introduces**: new concept, fact, demo, or framing
- **Depends on**: what must already be established
- **Momentum to next**: why the next slide naturally follows

Check:
- Does every demo appear AFTER the concept it proves?
- Does the argument build (each slide raises the stakes or deepens understanding)?
- Are there two consecutive "tell" slides without a demo or visual break?
- Is there a slide that answers a question nobody has asked yet?

If the map reveals a structural problem, fix the slide order BEFORE writing talking points. Flag changes vs. the approved plan.
```

This is ~20 lines added to the skill. No new files, no new skills.

**ROI**: Catches the most common structural problem in AI-generated slide decks: slides that are individually fine but don't build an argument. The existing planner's `Logika narracji` is a high-level sketch; this makes it concrete per slide.

**Independence**: Fully independent. Only touches `10x-webinar-material/SKILL.md`.

### Improvement 4: Post-Draft Webinar Review Checklist

**What**: Add a self-review checklist to `10x-webinar-material` that runs after writing both files. Not a separate skill (that would be overcomplicating), but a structured validation step within the existing material skill.

**Inspired by**: `lesson-rc-review`'s 10-dimension review and `lesson-draft`'s self-review step.

**Concrete changes to `10x-webinar-material/SKILL.md`**:

Add a `## Post-Draft Review` section after "After writing both files":

```markdown
## Post-Draft Review

After writing both files, run this review before reporting to chat:

### Timing check
- Sum all slide durations. Total should be 55-60 min (leaving buffer).
- Sum all demo durations from demo-ideas.md. Should match plan's demo budget (±2 min).
- Flag any slide with >8 min allocation — likely needs splitting.

### Audience fit (if audience profile exists in research.md)
- Jargon level matches audience: non-technical → no unexplained acronyms.
- Demo complexity matches approach: non-technical → narrated walkthrough, not live coding.
- "Non-obvious facts" are non-obvious to THIS audience, not to a generic developer.

### Argument coherence
- Verify each "Przejście" carries argument weight (not just "teraz pokażemy...").
- Verify the closing takeaways match the thesis, not a random subset of slides.

### Plan compliance
- Every section from the approved plan has a corresponding slide.
- No slide introduces a topic not in the plan (flag if so).

### Style compliance (if webinar-style.md exists)
- Spot-check 3 slides against style rules.

Report issues in the chat summary. Use severity: Blocker / Worth fixing / Note.
```

**ROI**: Catches timing mismatches, audience drift, and plan non-compliance before the user reviews manually. The existing pipeline has zero post-draft validation.

**Independence**: Fully independent. Only touches `10x-webinar-material/SKILL.md`.

### Improvement 5: Iterative Style Feedback Loop

**What**: After each webinar, capture what worked and what didn't into `webinar-style.md` as new rules or refined existing rules. Formalize the manual `komentarze.md` pattern into the pipeline.

**Inspired by**: `workbench/style.md`'s iteration model (3 iterations, each comparing AI output vs. human edits, extracting new rules).

**Concrete mechanism**:
- Add a `## Post-Webinar` section to `10x-webinar-writer/SKILL.md` (the orchestrator) that suggests running a debrief after the webinar
- The debrief reads `talking-points.md` + any user notes (like `komentarze.md`) and proposes 2-3 style rule additions/updates to `webinar-style.md`
- User approves or rejects each rule change

**ROI**: Compounds quality over time. Low immediate value (needs 2+ webinars), high long-term value.

**Independence**: Depends on Improvement 2 (webinar-style.md) existing first.

## Prioritization for the Claude Code for Non-Technical People Webinar

For the immediate use case:

| # | Improvement | Urgency | Effort |
|---|-------------|---------|--------|
| 1 | Audience-Adaptive Design Contract | **Must-have** — without this, the planner will produce developer-focused output for a non-technical audience | ~30 min to edit SKILL.md |
| 2 | Webinar Style Guide | **High** — directly improves talking-points quality | ~45 min to create + ~5 min to wire into material skill |
| 3 | Argument Flow Check | **Medium** — helps but the user can do this manually | ~15 min to add to material skill |
| 4 | Post-Draft Review | **Medium** — especially the audience-fit check matters for non-tech | ~20 min to add to material skill |
| 5 | Iterative Feedback Loop | **Skip for now** — only useful after 2+ webinars | Deferred |

Recommended order: 1 → 2 → 3 → 4. Each is a separate, independent change to one file (except #2 which creates a new file).

## Code References

- `/.claude/skills/10x-webinar-planner/SKILL.md` — planner skill, hardcoded audience at line 15
- `/.claude/skills/10x-webinar-material/SKILL.md` — material skill, no style guide read, no structural validation
- `/.claude/skills/10x-webinar-writer/SKILL.md` — orchestrator, no post-pipeline review or feedback loop
- `workbench/.claude/skills/lesson-spec/SKILL.md:102-118` — decision gate interview pattern to adapt
- `workbench/.claude/skills/lesson-spec/SKILL.md:258-279` — structural logic map pattern to adapt
- `workbench/.claude/skills/lesson-draft/SKILL.md:188-209` — section logic discipline to adapt
- `workbench/.claude/skills/lesson-editor-pl/SKILL.md:113-158` — argument architecture pattern to adapt
- `workbench/.claude/skills/lesson-rc-review/SKILL.md:66-79` — review dimensions to adapt
- `workbench/style.md` — 29 rules across 10 categories, the model for webinar-style.md
- `thoughts/shared/webinars/2026-04-20-*/komentarze.md` — manual post-webinar feedback (3 lines)
- `thoughts/shared/webinars/2026-04-20-*/todo.md` — manual pre-webinar checklist (not generated by skills)
- `thoughts/shared/webinars/2026-04-20-*/research.md` — example of high-quality planner output

## Architecture Insights

The lesson pipeline is a 6-skill sequence with heavy handoff contracts (schema JSON, side-effect ledger, grounding metadata). The webinar pipeline is a 3-skill sequence with lightweight handoffs (directory + files on disk).

The right adaptation strategy is to import **process patterns** (decision gates, style rules, structural validation, self-review) without importing **data structures** (schema JSON, ownership boundaries, ledgers). The webinar pipeline should stay lean — 3 skills, no schema, no side-effect tracking — but each skill should be smarter about what it checks before and after writing.

The key insight from comparing both pipelines: the lesson pipeline's quality comes from three places, in order of impact:
1. **style.md** — constrains AI output to sound human (biggest single quality lever)
2. **decision gates** — forces the user to make scope/audience/angle decisions before AI runs (prevents misaligned output)
3. **structural validation** — catches argument flow problems before they're baked into prose (prevents "individually fine, collectively incoherent" output)

The schema, grounding, RC review, and editor skills are important for the lesson pipeline's multi-author, multi-lesson context, but they're overhead for one-shot webinars.

## Historical Context

No prior changes in `context/changes/` or `context/archive/` relate to webinar skill improvements.

The existing webinar (`thoughts/shared/webinars/2026-04-20-5-agent-skills-jakosciowe-programowanie-ai/`) was produced with the current skills and shows both their strengths (excellent research) and gaps (no audience adaptation, no structural review, manual todo/komentarze files).

## Open Questions

1. **Where should `webinar-style.md` live?** Options: `thoughts/shared/webinars/webinar-style.md` (co-located with output), `.claude/skills/10x-webinar-material/webinar-style.md` (co-located with skill), or `workbench/webinar-style.md` (parallel to lesson style.md). Recommendation: `.claude/skills/webinar-style.md` at the skills root, so both planner and material skills can reference it without relative path gymnastics.
2. **Should improvements 3 and 4 be added to `10x-webinar-material` or become a separate `10x-webinar-review` skill?** Recommendation: keep them in the material skill as post-draft steps. A separate review skill adds pipeline complexity without proportional value for one-shot webinars.
3. **How should the audience profile propagate from planner to material?** The planner writes `research.md` — adding the audience profile there (as proposed) means the material skill reads it naturally. No new handoff mechanism needed.
4. **For the Claude Code non-technical webinar specifically**: should the planner's research prioritize business/productivity framing over technical architecture? Yes — the audience-adaptive design contract (Improvement 1) should shift "Kluczowe twierdzenia" toward impact/cost/risk framing rather than technical mechanism.
