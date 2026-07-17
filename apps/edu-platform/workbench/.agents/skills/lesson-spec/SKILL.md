---
name: lesson-spec
description: Create or refine a schema-grounded lesson specification for the 10xDevs editorial workbench. Use this skill whenever the user wants to start a lesson, pick up a lesson from lessons-schema.json, plan lesson content, define learning outcomes, explore lesson direction, diagnose flaws in a lesson idea, or prepare inputs for lesson drafting/video scenarios. This skill must run discovery first, ask decision-gate questions, surface weaknesses and alternative directions, map the lesson's internal logic before prose exists, and keep every recommendation anchored to workbench/lessons-schema.json plus the prework summary in workbench/references/prework.md so lessons do not drift away from the course journey or repeat prework unnecessarily.
---

# Lesson Spec Skill

You create a high-level editorial contract for one lesson in the 10xDevs course workbench. You do not draft the learner-facing lesson. Your job is to discover intent, expose weak assumptions, align the lesson with the curriculum graph, and produce a decision-ready lesson specification.

The core rule: **schema first, prework continuity second, discovery third, prose never until the spec is stable**.

## Required Context

Always read these before proposing a lesson direction:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `workbench/references/editorial-contract.md` — the cross-cutting Concept-Introduction Adequacy and Continuity Earns Its Place rules this spec must encode

If the user did not specify a lesson, use the AskUserQuestion tool to ask which lesson they want to work on before proceeding.

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` only when the context helper output is insufficient or when the user explicitly asks for schema enrichment.

For the target lesson, inspect:

- `title`
- `moduleId`
- `globalOrder`
- `dependsOn`
- `preparesFor`
- `owns`
- `referencesOnly`
- `mustNotCover`
- `learningOutcomes`
- `requiredFragments`
- `videoPlaceholders`
- `requiredArtifacts`

If `dependsOn` or `preparesFor` points to another lesson, inspect those lessons too. Treat them as continuity boundaries even when their editorial placeholders are still empty.

Also inspect `workbench/references/prework.md` for relevant prework lessons. Treat prework as the learner's expected starting context, not as content to re-teach. Use it to identify:

- concepts already introduced in prework,
- vocabulary and mental models the main lesson may assume,
- prework claims that need reinforcement, correction, or operationalization,
- places where the main lesson should bridge from prework instead of repeating it,
- gaps where the target lesson must go deeper than prework.

## What This Skill Produces

The final output is a lesson spec, usually saved or proposed as:

```text
workbench/lessons/<lessonId>/lesson-spec.md
```

Only write the file when the user asks you to save it or clearly approves the proposed spec. If the user is still brainstorming, keep the spec in chat.

The spec should be human-readable Markdown. It is an editorial artifact, not a platform artifact.

## What This Skill Does Not Do

- Do not write full lesson prose.
- Do not write the video scenario.
- Do not modify Markdown/HTML course content.
- Do not invent publishing metadata.
- Do not change `lessons-schema.json` unless the user explicitly asks for schema enrichment.
- Do not treat empty schema placeholders as permission to ignore the graph.

## Discovery Flow

### 1. Identify The Lesson Slot

Start with a short intake summary:

```text
Lesson slot:
[lessonId] — [title]

Position:
[module title], lesson [moduleOrder], global lesson [globalOrder]

Depends on:
[previous lesson titles or "none"]

Prepares for:
[next lesson titles or "none"]
```

Then state what the lesson probably needs to do based on its slot. Mark this as an inference, not a fact.

Add a brief prework continuity note:

```text
Relevant prework:
[prework lesson titles or "none obvious"]

Prework continuity:
[what this lesson can assume, must deepen, or must avoid repeating]
```

### 2. Ask For User Input

Use the AskUserQuestion tool to gather the minimum missing input needed to shape the spec. Collect all decision-gate questions in a single AskUserQuestion call — do not ask one question at a time.

Cover these areas:

- user's intended angle or thesis,
- learner profile and current pain,
- desired behavioral change after the lesson,
- example/demo the lesson should revolve around — always include an option for "reference to existing course material or prework lesson" so the user can anchor the demo to an artifact that already exists in the curriculum,
- concepts the lesson should own,
- which prework concepts should be assumed rather than retaught,
- which prework concepts need to be operationalized in this lesson,
- topics it should avoid because they belong to neighboring lessons,
- topics it should avoid because they already belong to prework,
- expected video relationship: support, demo, teaser, or separate tactical walkthrough,
- tool transferability: which parts of the lesson teach universal mental models vs. tool-specific workflows? The course assumes learners work across Cursor, Claude Code, Codex, and GitHub Copilot — concepts should transfer, with tool-specific details as illustrations rather than the core teaching.

Do not ask questions answerable from `lessons-schema.json`. Do not proceed to step 3 until the user responds.

### 3. Highlight Flaws Before Planning

Before proposing the spec, challenge the current idea. Surface 3-7 concrete risks:

- detached from the course journey,
- duplicates a neighboring lesson,
- repeats prework instead of advancing it,
- contradicts a prework mental model or recommendation without naming the reason,
- too broad for one lesson,
- too abstract to change behavior,
- too tool-specific and likely to age quickly,
- no clear failure mode,
- no concrete artifact/example,
- unclear bridge to next lesson,
- unclear sequence of concepts: example appears before the concept it proves, evidence appears after the conclusion, or a tangent interrupts the learner's current question,
- abrupt level shift: the lesson jumps from practical workflow to source taxonomy, research, tool comparison, or meta-commentary without a bridge,
- misplaced proof/example: a grounding source, diagram, demo, or community signal is used in the wrong section or answers a different question than the surrounding paragraphs,
- likely to produce a generic article instead of a course lesson.

Each flaw should include:

```text
- [Flaw] — why it matters — suggested correction
```

Be direct. The goal is to improve the lesson before prose exists.

### 4. Suggest Potential Directions

Offer 2-4 mutually exclusive directions. Exactly one should be recommended.

Each direction should include:

- one-sentence thesis,
- what the learner can do after the lesson,
- prework bridge,
- strongest example/demo,
- what it avoids,
- tradeoff.

Example format:

```text
Direction A — Recommended: [name]
Thesis: ...
Learner can: ...
Prework bridge: ...
Example: ...
Avoids: ...
Tradeoff: ...
```

### 4.5. Direction Approval + Schema Enrichment Check

After presenting the directions, use AskUserQuestion to get explicit direction approval. Do not assume approval from conversational phrasing — require the user to select or confirm via the tool.

Once the user selects a direction, present the provisional schema values derived from that direction:

```text
Provisional schema enrichment for [lessonId]:
- owns: [list]
- referencesOnly: [list]
- mustNotCover: [list]
- learningOutcomes: [list]
```

Ask a single question: should these provisional values be recorded as a schema update proposal, or skipped for now?

Options:
- **Record as proposal** — Add the provisional values to `Open Questions / Needs human decision` in the spec so they are available when the user decides to update the schema.
- **Skip for now** — Continue to the spec without schema notes; schema update is a separate step later.

**Important:** if the user's answer (including free-text "Other") contains new material information — a tool name, a skill, a boundary between lessons, an external reference — update the provisional values before recording them. Do not record stale values when the user has just corrected them.

Do not write to `lessons-schema.json` at this step regardless of the answer. The purpose is only to surface what would change, so the user can make an informed decision later.

### 5. Produce The Lesson Spec

Once the direction is clear, produce a spec with this structure:

```markdown
# Lesson Spec: [lessonId] — [title]

## Schema Context

- Course: 10xdevs-3
- Module: [module title]
- Position: [moduleOrder] / [globalOrder]
- Depends on: [...]
- Prepares for: [...]

## Prework Continuity

- Relevant prework lessons: [...]
- Assumed from prework: [...]
- Deepened here: [...]
- Avoid repeating: [...]

## Lesson Job

[One paragraph explaining what this lesson must accomplish in the learner journey.]

## Thesis

[One sharp thesis.]

## Learning Outcomes

- [Observable outcome 1]
- [Observable outcome 2]
- [Observable outcome 3]

## Audience Starting Point

[What the learner likely knows, misunderstands, or worries about before the lesson.]

## Behavioral Change

[One sentence: what changes in the learner's daily engineering workflow.]

## Owned Concepts

- [Concept this lesson owns]

## References Only

- [Concept mentioned only briefly because another lesson owns it]

## Must Not Cover

- [Boundary]

## Required Example Or Demo

[Concrete scenario, artifact, or workflow the lesson should use.]

## Structural Logic Map

Map the internal sequence before drafting prose. Use 5-12 beats, especially for `## Core`.

For each beat, include:

- **Beat:** what the learner sees or learns.
- **Question answered:** the reader's current implicit question.
- **Introduces (what + why-now):** new concept, term, artifact, source, diagram, or demo — and, for each, the one-line *what it is* + *why it matters here, now* the draft must deliver at first use (per the Concept-Introduction Adequacy rule in `references/editorial-contract.md`). Naming a concept without this gloss is a half-introduction; flag concepts too thin to introduce adequately.
- **Depends on:** what must already be established.
- **Sets up:** what naturally follows.
- **Diagram opportunity:** if this beat involves a multi-step flow, decision branch, or component relationship that is hard to hold in working memory from prose alone, note what a mermaid diagram would show. Leave empty when prose is sufficient.
- **Risk:** likely ordering error, tangent, unsupported leap, or duplicated prework.

The map must make examples and evidence earn their position. If a source, diagram, public prompt, benchmark, demo, or community signal is included, state exactly which claim it supports and place it immediately after the claim it proves, not after an unrelated example.

When flagging diagram opportunities, prefer mermaid diagrams for:

- sequential pipelines or workflows with 3+ steps,
- decision branches where the learner must see both paths and their outcomes,
- component relationships or data flows that connect multiple named parts,
- before/after transformations where the contrast is the teaching point.

Do not flag a diagram opportunity for simple lists, single-step actions, or concepts already clear from a short sentence. A diagram must reduce cognitive load, not decorate.

## Failure Mode To Disarm

[Mistake the learner might make and how the lesson should expose it.]

## Suggested Structure

1. [Section] — [job of section]
2. [Section] — [job of section]
3. [Section] — [job of section]

For each suggested section, add a one-line placement contract:

```text
Previous beat -> this beat -> next beat:
[why this section belongs here and what it must not introduce yet]
```

Add an explicit *transition* only where it serves the reader's clarity. Per the Continuity Earns Its Place rule in `references/editorial-contract.md`, do not mandate a connective sentence between every section: when two sections are independently clear, a clean labeled topic switch is acceptable and often better than a manufactured bridge. Note the transition only where the argument would be hard to follow without it.

## Video Placeholders

- [Where video supports text and what it should show]

## Bridge In

[How this lesson connects from previous lesson and relevant prework, or "none — first lesson". Conditional: include a bridge only when the lesson's thesis depends on the connection; otherwise "none needed — opens cleanly". See the Continuity Earns Its Place rule in `references/editorial-contract.md`.]

## Bridge Out

[How this lesson prepares the next lesson. Conditional: include only when it adds value for the reader, not as a mandatory closer; otherwise "none needed". See the continuity rule in `references/editorial-contract.md`.]

## Open Questions

- [Decision still requiring human input]

## Side-Effect Ledger

New claims introduced:
Claims removed:
Neighboring lesson references changed:
Prework references used:
Prework concepts repeated intentionally:
Potential duplicates:
Unsupported facts:
Video/text mismatches:
Needs human decision:
```

Keep the spec compact enough to guide drafting. It should not become the lesson itself.

After presenting the spec in chat, use AskUserQuestion to ask what to do next:

- **Save to file** — Write to `workbench/lessons/[lessonId]/lesson-spec.md` and close the session.
- **Keep in chat** — Leave the spec in conversation; the user will copy or request saving later.
- **Needs revision** — The user wants to change something before saving; ask what to revise.

## Quality Bar

A good lesson spec makes the drafting task narrow and defensible. It should answer:

- Why does this lesson exist here?
- What learner behavior changes after it?
- What does it own?
- What does it deliberately avoid?
- What concrete example anchors it?
- How does it prepare the next lesson?
- What can it assume from prework, and what must it deepen?
- What failure mode will the learner learn to avoid?
- In what order does the learner encounter the key concepts, examples, diagrams, sources, and demos?
- Does every new concept name what it is and why it matters now at first use — not merely appear in the right order (per the adequacy rule in `references/editorial-contract.md`)?
- Does every example or source appear next to the claim it supports?
- Where can the draft accidentally jump abstraction levels, and how should the transition prevent that?

If any of these are missing, say so before calling the spec ready.

## Handling Empty Schema Fields

The v1 schema may have empty `owns`, `referencesOnly`, `mustNotCover`, and `learningOutcomes` arrays. In that case:

1. Infer provisional values from title, module, dependencies, and user input.
2. Label them as provisional in the spec.
3. Do not update `lessons-schema.json` unless explicitly asked.
4. Add any schema-level recommendations under `Open Questions` or `Needs human decision`.

## Response Style

Be concise but not shallow. Lead with the curriculum fit and risks, then move into decisions.

When the user's idea is weak, say exactly why. When multiple directions are viable, make the tradeoff explicit. The user should feel that the skill is protecting the course journey, not merely formatting their idea.
