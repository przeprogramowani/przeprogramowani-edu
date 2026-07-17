---
name: lesson-draft
description: Write or revise a Polish learner-facing 10xDevs lesson draft from the workbench lesson schema, approved lesson spec, and optional grounding brief. Use this skill whenever the user asks to draft, write, expand, continue, or reshape a main-course lesson, especially from workbench/lessons-schema.json, workbench/lessons/<lessonId>/lesson-spec.md, workbench/lessons/<lessonId>/lesson-grounding.md, or a lesson schema slot. This skill must anchor the draft in the schema, neighboring lessons, prework continuity, grounding sources, structural logic map, and workbench/references/style.md so the prose follows the 10xDevs house style without duplicating prework, stealing scope from adjacent lessons, or jumping between ideas without a clear transition.
---

# Lesson Draft Skill

You write the first learner-facing draft of a 10xDevs 3.0 main-course lesson in Polish. Your job is to turn the curriculum contract into useful course prose: concrete, scoped, connected to the surrounding course, and written in the house style.

The core rule: **schema + approved spec define scope, grounding defines supported claims, prework defines assumed context, style guide defines voice, and the draft must not drift into neighboring lessons**.

## Required Context

Always read these files before drafting:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `workbench/references/style.md`
5. `workbench/references/lesson-structure.md` — the canonical learner-facing section order, heading rules, badge section, Deep Dive intro convention, and link format
6. `workbench/references/editorial-contract.md` — the Editorial Economy, Concept-Introduction Adequacy, and Continuity Earns Its Place rules the draft must already satisfy

If the user did not specify a lesson, ask which lesson they want to draft before proceeding.

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` before updating schema fields or when the context helper output is insufficient.

For the target lesson, inspect the schema fields:

- `title`
- `moduleId`
- `globalOrder`
- `moduleOrder`
- `dependsOn`
- `preparesFor`
- `owns`
- `referencesOnly`
- `mustNotCover`
- `learningOutcomes`
- `requiredFragments`
- `videoPlaceholders`
- `requiredArtifacts`
- `groundingSources`
- `sideEffectLedger`

Also read the approved spec when it exists:

```text
workbench/lessons/<lessonId>/lesson-spec.md
```

Also read the grounding brief when it exists:

```text
workbench/lessons/<lessonId>/lesson-grounding.md
```

If the lesson has `groundingSources` in `lessons-schema.json`, treat them as source metadata for the draft. If the lesson has time-sensitive claims, current tool behavior, benchmark claims, pricing, model recommendations, or exact syntax but no grounding brief/source metadata, pause before drafting those parts and either:

- ask whether to run `lesson-grounding`, or
- write around the unsupported detail and record it under `Unsupported facts`.

If the spec is missing, empty, or still full of unresolved decisions, do not pretend it is ready. Say what is missing and either:

- ask the user to approve assumptions for a draft, or
- suggest running `lesson-spec` first.

Do not block when the user explicitly wants a rough draft without a spec, but label the result as assumption-based and record the assumptions in the side-effect ledger.

## Neighbor And Prework Reading

Before drafting, inspect continuity boundaries:

- Read the dependency and forward-neighbor entries from `node workbench/scripts/lesson-context.mjs <lessonId-or-title>`.
- Read the full schema entries for lessons in `dependsOn` and `preparesFor` only when the context helper output is insufficient.
- If neighboring lesson drafts/specs exist under `workbench/lessons/<lessonId>/`, read them.
- Read `workbench/references/prework.md` and identify relevant prework lessons.
- When useful for voice and concrete examples, read 1-3 source lessons from:

```text
src/content-source/lessons10xDevs3Prework/pl/
```

Prefer source Markdown over generated HTML. Read only the prework lessons relevant to this draft or to the style pattern you need.

Treat prework as known starting context, not as content to re-teach. Main-course lessons should operationalize, deepen, or challenge prework concepts.

## Output Location

By default, save the draft to:

```text
workbench/lessons/<lessonId>/lesson-draft.md
```

If the user asks for chat-only output, do not write the file.

If the user asks for a section draft, save only when the target file and insertion point are clear. Otherwise provide the section in chat and ask where it should go.

This workbench is editorial. Do not modify platform content files under `src/content*` unless the user explicitly asks to publish or integrate the draft.

## Schema Updates During Drafting

Keep `workbench/lessons-schema.json` current while drafting. If the draft introduces, settles, removes, or materially changes lesson ownership, learning outcomes, required fragments, video placeholders, grounding-source usage, unsupported facts, neighboring references, or human decisions, update only the target lesson object in `lessons-schema.json`.

Do not mass-edit other lessons. Do not change lesson order or course structure unless explicitly requested.

Prefer enriching existing schema fields over adding new schema concepts. If a draft introduces a claim or dependency that belongs in a neighboring lesson instead, either revise the draft to stay in scope or record the risk in the target lesson's `sideEffectLedger`.

## Draft Structure

Use Markdown. The canonical learner-facing structure is delegated to `workbench/references/lesson-structure.md`.

Before drafting, read that file and follow it exactly for:

- top-level section order,
- forbidden headings,
- emoji prefixes,
- `## Odbierz swoją odznakę`,
- `## 🔎 Deep Dive` intro convention,
- `## 📚 Materiały dodatkowe` heading and link format.

If this skill and `lesson-structure.md` disagree about structure or formatting, `lesson-structure.md` wins. Do not ask the user to choose between them; treat this skill as the drafting workflow and `lesson-structure.md` as the structural contract.

In practice, every full lesson draft starts with exactly one H1, then intro prose directly under the title with no `## Wstęp` heading. The main lesson content follows without a `## Core` wrapper; "Core" is only an internal planning label for the main content before `## 🧑🏻‍💻 Zadania praktyczne`.

Use lower-level headings inside the main content and Deep Dive when the lesson needs structure, but keep them simple, descriptive, and readable. Do not use headings as academic thesis statements.

If a lesson needs video references, include placeholders only, for example `[VIDEO PLACEHOLDER: ...]`, unless the user explicitly asks for a video scenario. Do not write exact video scripts, shot lists, or detailed scenarios during lesson drafting.

## Mermaid Diagrams

Use mermaid code blocks to visualize flows, decisions, and relationships that are hard to hold in working memory from prose alone.

### When to add a diagram

Add a mermaid diagram when the lesson contains:

- a sequential pipeline or workflow with 3+ named steps,
- a decision branch where the learner must see both paths and their consequences,
- a component relationship or data flow connecting multiple named parts,
- a before/after transformation where visual contrast is the teaching point,
- a phase progression where order matters and context accumulates.

### When NOT to add a diagram

Do not add a diagram for:

- a simple list that is already clear in a short sentence or bullet list,
- a single-step action,
- decoration or visual padding,
- content that would merely restate an adjacent bullet list in box form.

A diagram must reduce cognitive load. If removing it would not make the lesson harder to follow, it should not exist.

### Diagram style rules

- Use `flowchart LR` for linear pipelines, `flowchart TD` for vertical progressions or phase sequences, and decision-style charts for branching paths.
- Keep node labels short — 3-8 words. Use `\n` for a second line only when needed.
- Prefer 4-8 nodes. If a diagram needs more than 10 nodes, split it or simplify.
- Use quoted labels (`["label"]`) for nodes with special characters.
- Do not use colors, styles, or advanced mermaid features that may not render on all platforms.
- Place the diagram immediately after the prose that introduces the concept it visualizes — not before the concept, not in a separate section.

### Diagram placement in structure

Treat diagrams like examples and evidence: they must appear next to the claim they support. The structural logic map (from `lesson-spec.md`) may flag specific beats with `Diagram opportunity` — use those as primary candidates.

If the spec does not flag diagram opportunities, identify them yourself during drafting by looking for the patterns listed above.

The draft should normally include:

- an opening bridge from the previous lesson or a short universal scenario,
- a clear thesis early in the text,
- one concrete workflow, artifact, example, or decision path,
- 2-3 references to later course work,
- direct references to relevant prework only where they help continuity,
- grounded claims and examples from `lesson-grounding.md` when available,
- one failure mode the learner may recognize,
- the canonical `## 📚 Materiały dodatkowe` section even when there are no external sources; in that case include a short practical close and clearly mark that there are no required extra materials.

## Section Logic Discipline

Before drafting any full lesson or major section, create a short structural logic map. If `lesson-spec.md` already contains `## Structural Logic Map`, use it as the source of truth. If it does not, infer one from the schema, spec, grounding, and neighboring lessons before writing prose.

The map is an editorial planning artifact, not learner-facing prose. It should list the beats of the target section, especially the main content before `## 🧑🏻‍💻 Zadania praktyczne`, in the order the learner will encounter them. For each beat, identify:

- what the beat is roughly about,
- which reader question it answers now,
- which new concept, artifact, diagram, source, or demo it introduces,
- what must already be established for it to make sense,
- what it sets up next,
- where the draft could accidentally jump abstraction levels or introduce evidence too late.

Use this map to prevent these specific failures:

- A practical example appears before the concept it is meant to illustrate.
- A source, public prompt, benchmark, community signal, or diagram appears after an unrelated example instead of next to the claim it supports.
- The draft jumps from a learner workflow to meta-analysis, research, taxonomy, or tool comparison without an explicit bridge.
- A paragraph answers a different implicit question than the paragraphs around it.
- A section introduces a new layer of abstraction and then immediately switches back without telling the reader why.
- A required fragment from the schema is included only because it is required, not because the local argument needs it there.

If the map reveals a bad sequence, fix the sequence before writing. Do not rely on smooth prose to hide a broken argument.

## Writing Style

Follow `workbench/references/style.md` as the house style. In practice:

- write in Polish,
- address the reader directly with `ty/ci` and use inclusive `my/nasz`,
- keep paragraphs short, usually 1-3 sentences,
- use casual asides and rhetorical questions to break density,
- use precise technical language without dramatic metaphors,
- do not expand common acronyms like CLI, JSON, API, HTTP, SDK, IDE, CI/CD, LLM,
- explain concepts through daily developer examples, not abstract taxonomy,
- avoid academic inline citations; put optional references at the end,
- use `Materiały dodatkowe`, not `Źródła`,
- prefer action-level tool descriptions over implementation-detail lists,
- avoid inventing new job-title jargon.

The style guide was written for prework, so adapt it to the main course: the main lesson can go deeper and be more operational, but it should still sound like the same course.

## Scope Rules

Honor the lesson boundaries:

- `owns` are the concepts this lesson may teach deeply.
- `referencesOnly` are allowed as brief bridges or reminders, not full sections.
- `mustNotCover` are hard boundaries unless the user explicitly changes the schema/spec.
- `dependsOn` tells you what the learner may already know.
- `preparesFor` tells you what the ending should set up.

If schema fields are empty but the lesson spec contains provisional values, use the spec and label any uncertainty in the side-effect ledger.

If both schema and spec are ambiguous, draft conservatively. Do not fill half the course into one lesson because the slot is empty.

## Handling Facts And Current Tools

When a lesson depends on modern tool behavior, product names, model recommendations, pricing, dates, or APIs, verify current facts before presenting them as stable. Prefer official documentation or repository-local source material.

If you cannot verify a detail, write around it or mark it as an open question. Do not invent exact CLI syntax, pricing, version numbers, dates, or product capabilities.

When `lesson-grounding.md` exists, use it as the first place to decide:

- which claims are safe to state directly,
- which claims should be softened,
- which examples are worth using,
- which sources belong in optional `Materiały dodatkowe`,
- which open verification questions must remain out of prose.

Do not cite every source inline. Follow the style guide: weave supported knowledge into the lesson naturally and put optional sources at the end.

## Drafting Flow

### 1. Intake Summary

Before writing, briefly state:

```text
Lesson:
[lessonId] — [title]

Inputs used:
- schema: yes
- spec: yes/no
- grounding: yes/no
- relevant prework: [...]
- neighbor lessons: [...]

Draft posture:
[full lesson / section / rough assumption-based draft]

Logic map:
[from spec / inferred before drafting / not needed because the user requested a narrow copy edit]
```

If there are unresolved decisions that materially change the draft, ask the user before writing. Collect them in one question when possible.

Do not ask about anything already answered by schema, spec, or prework.

### 2. Draft

Write the lesson as learner-facing prose, not as an outline.

Make every section earn its place:

- explain what the learner should understand or do,
- show the mistake they are likely to make,
- connect to an artifact or workflow,
- keep the example concrete enough to guide behavior,
- leave neighboring lessons with something meaningful to own.

While drafting, keep examples, diagrams, grounding sources, and video placeholders adjacent to the claims they support. If a required source or demo would interrupt the current logic, move it to the earlier/later beat where it actually functions as proof, illustration, or transition.

### 3. Self-Review

After drafting, review the file against:

- `lesson-spec.md`,
- `lessons-schema.json`,
- `workbench/references/prework.md`,
- `workbench/references/style.md`,
- `workbench/references/lesson-structure.md`.

Then run a section logic review:

1. Break each major section into fragment-level beats: "this paragraph cluster is about X".
2. Check whether each beat answers the question raised by the previous beat.
3. Verify that every new concept is introduced before it is used **and** that at first use the text states *what it is* and *why it matters now* — ordering alone is not enough (Concept-Introduction Adequacy, `references/editorial-contract.md`). Fix half-introductions and bare name-drops.
4. Verify that every example, diagram, public prompt, benchmark, grounding source, and video placeholder is placed next to the claim it supports.
5. Flag abrupt moves between practical workflow, conceptual hierarchy, research evidence, tool behavior, community signal, and team-process advice.
6. Move, merge, or delete beats that are only present because they were required fragments but do not serve the local argument.
7. Write lean (Editorial Economy, `references/editorial-contract.md`): cut payload-free asides, cut verbatim/near-verbatim restatement of a point made nearby, and merge repeated beats. A clean labeled topic switch is acceptable where it reads clearly — do not manufacture a transition between independently-clear sections.

Fix obvious drift before reporting completion.

### 4. Side-Effect Ledger

End every saved draft with a concise side-effect ledger in chat. Use this shape:

```text
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

Use `(none)` where appropriate.

Do not include the side-effect ledger inside `lesson-draft.md`. The saved draft is learner-facing content only; editorial metadata belongs in the chat report or in a separate review artifact when explicitly requested.

## What This Skill Does Not Do

- Do not create the lesson spec unless explicitly asked; use `lesson-spec` for that.
- Do not write the video scenario unless explicitly asked.
- Do not perform release-candidate review; this is a later artifact.
- Do not update unrelated lesson objects in `lessons-schema.json` unless explicitly asked.
- Do not publish the lesson into `src/content*` unless explicitly asked.
- Do not turn unresolved open questions into confident prose.

## Quality Bar

A good lesson draft:

- reads like a real course lesson, not a plan,
- makes the learner's next behavior obvious,
- uses the approved example or artifact,
- bridges from previous lessons and prework without repeating them,
- sets up the next lesson without teaching it,
- has no unsupported facts masquerading as certainty,
- has a visible progression of ideas in the main content before `## 🧑🏻‍💻 Zadania praktyczne`, not just a collection of required fragments,
- introduces concepts before examples depend on them,
- places sources, diagrams, demos, and community observations where they support the surrounding claim,
- uses mermaid diagrams for multi-step flows, decision branches, and component relationships that are hard to follow in prose alone,
- does not use diagrams as decoration or redundant restatement of adjacent bullet lists,
- uses transitions when moving between practical workflow, conceptual model, evidence, and tool-specific behavior,
- follows the house voice closely enough that it can be polished instead of rewritten.

If the draft fails any of these, revise it before calling the work done.
