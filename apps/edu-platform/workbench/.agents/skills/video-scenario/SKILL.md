---
name: video-scenario
description: Create an interactive, recording-ready video scenario for a 10xDevs workbench lesson from lessons-schema.json, lesson-spec.md, lesson-grounding.md, lesson-draft.md, and videoPlaceholders. Use this skill whenever the user asks to prepare, write, plan, build, or refine a screencast scenario, video plan, recording outline, demo run of show, or replace video placeholders for a main-course lesson. The skill must ask recording-specific decision-gate questions before writing, keep the video aligned with the lesson contract, and produce workbench/lessons/<lessonId>/videos/video-{video-slug}.md as an easy-to-record but detailed programmer screencast plan.
---

# Video Scenario Skill

You create a recording scenario for a 10xDevs 3.0 main-course lesson. The output is not learner-facing article prose and not a full teleprompter script. It is a practical production artifact for a programmer-instructor: what the video must prove, what appears on screen, what the presenter does, which demo state is needed, and how each segment supports the written lesson.

The core rule: **same lesson contract, different medium**. The scenario may make the lesson more concrete, but it must not silently change the thesis, introduce unsupported claims, steal scope from neighboring lessons, or turn placeholders into a different lesson.

## Required Context

Always read these files before planning the scenario:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `workbench/references/style.md`

If the user did not specify a lesson, ask which lesson they want to prepare before proceeding.

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` only when the context helper output is insufficient.

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

Also read target artifacts when they exist:

```text
workbench/lessons/<lessonId>/lesson-spec.md
workbench/lessons/<lessonId>/lesson-grounding.md
workbench/lessons/<lessonId>/lesson-draft.md
```

Read neighboring schema entries from `dependsOn` and `preparesFor` using the lesson-context output. If neighboring specs, drafts, or scenarios exist, read them enough to avoid duplicated demos and bad handoffs.

## Output Location

By default, save the scenario to:

```text
workbench/lessons/<lessonId>/videos/video-{video-slug}.md
```

Video scenarios live in a dedicated `videos/` subdirectory inside each lesson folder. This keeps lesson-level artifacts (spec, grounding, draft) separate from video production artifacts.

`video-slug` should be a short kebab-case identifier for the specific video, for example `agent-onboarding`, `inner-loop`, or `deployment-research`. If the lesson has one video and the user did not provide a slug, infer one from the scenario spine and confirm it during the recording decision gate.

If the user explicitly asks for chat-only output, do not write the file.

Do not modify learner-facing platform content under `src/content*`. This workbench is editorial and platform-agnostic.

## What This Skill Produces

The scenario should be detailed enough that the presenter can record from it with light preparation:

- lesson-level video goal,
- setup assumptions,
- 6-10 segments for a normal lesson,
- for each segment: goal, screen state, presenter actions, outcome, and bridge to the written lesson,
- concrete demo artifacts, commands, files, UI states, or before/after states,
- caveats for tool-specific behavior,
- mismatch and decision ledger.

The reverse-engineering model artifact is `workbench/lessons/m1-l4/videos/video-scenario.md`: it uses segment goals and run-of-show bullets, not a full spoken script. New scenarios should use the slugged `video-{video-slug}.md` naming convention inside the `videos/` subdirectory.

## What This Skill Does Not Do

- Do not write a word-for-word narration script unless the user explicitly asks for one.
- Do not write or edit `lesson-draft.md` unless the user explicitly asks.
- Do not create production video assets, slides, thumbnails, or platform metadata.
- Do not invent external claims, tool behavior, CLI syntax, pricing, dates, or product capabilities.
- Do not make the video the place where unresolved lesson scope decisions are settled silently.
- Do not deepen `referencesOnly` or `mustNotCover` topics just because they would make a flashy demo.

## Interactive Discovery Flow

### 1. Intake Summary

Start with a concise summary:

```text
Lesson:
[lessonId] — [title]

Inputs used:
- schema: yes
- spec: yes/no
- grounding: yes/no
- draft: yes/no
- video placeholders: [count]
- neighbor lessons checked: [...]
- video slug: [provided/inferred/needs decision]

Scenario posture:
[placeholder expansion / full recording scenario / focused demo scenario / assumption-based scenario]
```

If the draft is missing, the scenario can still be produced from the spec and placeholders, but label it as lower-confidence and treat the final alignment ledger seriously.

If the spec is missing or unresolved, ask whether to run `lesson-spec` first or proceed assumption-based. Do not pretend a missing spec is stable.

### 2. Reverse-Engineer The Video Job

Before asking questions, infer the likely video job from the schema, spec, draft, and placeholders. State it as an inference:

```text
Likely video job:
[what the screencast must make observable that the text cannot fully demonstrate]

Likely recording spine:
[the main demo or artifact sequence]

Text relationship:
[support / separate tactical walkthrough / interactive exercise / visual recap / teaser]
```

Use this analysis to avoid turning the scenario into a generic outline of the article.

### 2.5. Recommend Recording Format

For each video placeholder (or the video as a whole if it's a single-video lesson), recommend one of three recording formats. State the recommendation with a one-line rationale, then let the user confirm or override in step 3.

**Format A — Live demo (`live-demo`)**

Interactive screen recording of actually working with AI. The presenter runs commands, invokes skills, and reacts to agent output in real time.

Best when:
- the video must show tool behavior, terminal output, or agent interaction,
- the before/after contrast lives on disk (files created, edited, scaffolded),
- the learner needs to see the *sequence* of steps, not just the result,
- the skill/tool has deterministic enough behavior to be recordable (or a fallback is available).

Examples: running `/10x-shape` session, bootstrapping a project, showing permission prompts.

**Format B — Conversation review (`conversation-review`)**

Analysis of a past AI conversation, optionally loaded via `/resume`. The presenter walks through decisions, pivots, and failure modes that occurred during a real session. Can include before/after diffs.

Best when:
- the teaching point is *how to think during* the interaction, not the tool output itself,
- you want to show a failure mode and how to recover from it,
- the live demo would be too long, nondeterministic, or boring to watch in real time,
- the interesting part is the reasoning, not the typing.

Examples: reviewing a hollow-PRD situation, walking through a failed bootstrap and the recovery, showing how a brownfield session differs from greenfield by comparing two saved conversations.

**Format C — Presentation (`presentation`)**

Slides, mermaid diagrams, architecture drawings, comparison tables, or whiteboard-style explanation. No terminal, no live agent interaction.

Best when:
- the concept is abstract (mental models, architecture, evaluation frameworks),
- a mermaid diagram or comparison table explains it better than a screen recording,
- the video needs to cover multiple scenarios side by side,
- the lesson already has good diagrams in the draft that deserve visual walkthrough.

Examples: explaining the three execution gates, defense-in-depth layers, skill vs prompt comparison table, dual-pipeline diagram.

**Format D — Hybrid (`hybrid`)**

Mix of formats within one video. Typically opens with a brief presentation segment to set up the concept, then transitions to a live demo or conversation review.

When recommending, present the format per placeholder or per video:

```text
Recording format recommendation:

Placeholder 1: "[placeholder text]"
  → live-demo — [rationale]

Placeholder 2: "[placeholder text]"
  → presentation — [rationale]
  
Placeholder 3: "[placeholder text]"
  → conversation-review — [rationale]
```

### 3. Ask Recording Decision-Gate Questions

Use the AskUserQuestion tool when available. If it is not available in the current environment, ask the same questions in chat and wait for the answer before writing the scenario.

Ask all missing recording decisions in one batch. Cover only decisions not already answered by schema/spec/draft:

- **Recording format:** confirm or override the format recommendation from step 2.5 (`live-demo`, `conversation-review`, `presentation`, or `hybrid`). Per-placeholder if the video covers multiple placeholders.
- **Demo substrate:** existing course project, throwaway repo, prepared fixture, current learner project, slides only, or mixed.
- **Primary tool:** Claude Code, Codex, Cursor, GitHub Copilot, browser UI, terminal-only, or tool-agnostic with one anchored example.
- **Recording mode:** polished deterministic run, live-ish run with prepared fallback, or intentionally showing one failure + recovery.
- **Failure mode to show:** (if applicable) a specific failure mode from the lesson or a past session that the presenter encountered and wants to walk through. Describe what went wrong and what the recovery looked like.
- **Conversation source:** (for `conversation-review` format) path to a saved conversation, `/resume` session, or "will record fresh and annotate."
- **Interactivity:** passive watch, viewer repeats later, or explicit pause-and-do exercise.
- **Depth:** quick placeholder replacement, standard lesson scenario, or detailed recording checklist.
- **Video slug:** kebab-case filename suffix for `videos/video-{video-slug}.md`.
- **Evidence posture:** whether to mention papers/docs in video, keep them in text, or show only practical implication.
- **Risk tolerance:** whether the video may depend on live network/API/tool behavior or must be fully local and reproducible.
- **Artifacts to leave behind:** files the demo creates, edits, or should reset afterward.

Do not ask questions answerable from existing artifacts. Do not proceed to the final scenario until the user responds or explicitly authorizes assumptions.

### 4. Challenge The Video Shape

Before writing, surface 3-7 concrete risks in the proposed video:

```text
- [Risk] — why it matters for recording/learning — suggested correction
```

Common risks:

- demo duplicates the article instead of showing behavior,
- demo requires too much setup for a short video,
- live tool behavior is nondeterministic,
- presenter has to type too much on camera,
- result depends on external services, current model behavior, or paid accounts,
- segment steals scope from the next lesson,
- video introduces a fact not grounded in `lesson-grounding.md`,
- screen will be visually noisy or unreadable,
- the scenario has no before/after contrast,
- the video proves a tool-specific trick but not the transferable lesson concept,
- the video leaves no artifact the learner can inspect or reproduce.

### 5. Produce The Scenario

Use this exact structure:

```markdown
# Video Scenario: [lessonId] — [title]

## Cel wideo

[One paragraph explaining what the video must make observable.]

## Założenia

- [Setup assumption]
- [Learner starting state]
- [Tool/version/account assumption, when relevant]
- [What the video explicitly does not cover]

## Materiały i setup nagrania

- Repo/projekt: [...]
- Narzędzie główne: [...]
- Pliki startowe: [...]
- Pliki tworzone/edytowane: [...]
- Stan fallback: [...]
- Ryzyka live demo: [...]

## Segment 1 — [Short segment name]

**Format:** `live-demo` | `conversation-review` | `presentation`

**Cel:** [What this segment accomplishes.]

**Na ekranie:**

- [Visible file/app/terminal/browser/slides state]

**Przebieg:**

1. [Presenter action]
2. [Presenter action]
3. [Expected visible result]

**Rezultat:** [What should be true at the end of the segment.]

**Most do tekstu:** [Which draft/spec section this supports.]
```

Repeat segments until the video is complete. Normal lessons should usually have 6-10 segments. A short tactical demo may have 3-5.

Close with:

```markdown
## Pre-production TODO

Format-specific preparation steps. Complete these before opening the recording software.

### For `live-demo` segments:

- [ ] [Repo/project cloned and at correct git state]
- [ ] [Dependencies installed, build verified]
- [ ] [Required input files in place (prd.md, tech-stack.md, etc.)]
- [ ] [Skill(s) installed and tested in a dry run]
- [ ] [Fallback output prepared for nondeterministic agent behavior]
- [ ] [Terminal font size and window layout configured for readability]
- [ ] [Environment variables set (API keys, tokens)]
- [ ] [Git clean state — easy reset point if demo goes sideways]

### For `conversation-review` segments:

- [ ] [Source conversation identified and accessible]
- [ ] [Key moments bookmarked (decision points, failures, pivots)]
- [ ] [/resume tested — conversation loads correctly]
- [ ] [Failure mode to walk through identified and reproducible]
- [ ] [Before/after diffs prepared (if showing code changes)]
- [ ] [Annotations or talking points written for each key moment]

### For `presentation` segments:

- [ ] [Mermaid diagrams rendered and visually verified]
- [ ] [Slides or visual assets created]
- [ ] [Comparison tables prepared]
- [ ] [Diagram walkthrough order planned (what to highlight when)]
- [ ] [Transitions to/from other formats scripted]

### General:

- [ ] [Deterministic setup step]
- [ ] [Files prepared]
- [ ] [Fallback ready]

## Video/text mismatches

[list or `(none)`]

## Claims introduced only in video

[list or `(none)`]

## Needs human decision

[list or `(none)`]
```

Use Polish for scenario content unless the user asks otherwise. Keep file paths, commands, product names, and code identifiers exact.

## Segment Design Rules

A good segment has one teaching job and one visible screen state. Avoid segments that are just "talk about the concept."

### Format-specific segment patterns

**`live-demo` segments** should show, not tell:
- open with the problem state visible on screen,
- run the command or skill,
- react to the output — name what happened and why it matters,
- show the artifact on disk.

**`conversation-review` segments** should walk through decisions:
- show the conversation at the decision point,
- explain what you were thinking and why,
- if a failure occurred, show the failure and then the recovery,
- contrast "what I did" with "what I could have done" when the alternative is instructive.

**`presentation` segments** should build incrementally:
- start with the simplest version of the diagram/concept,
- add complexity one element at a time,
- connect each element to something the learner already knows,
- end with the full picture and a bridge to the next segment or the written lesson.

### General segment moves

Prefer these video-native moves:

- show a broken or incomplete state before the fix,
- make the agent's wrong/default behavior visible,
- edit one small file and show the result,
- compare two runs with a small observation table,
- use prepared files instead of typing long snippets live,
- show a real artifact the learner can inspect after the video,
- name the transferable principle after the concrete example,
- bridge to the article when the text carries nuance better than screen recording.

Keep demos easy to record:

- use local fixtures over live services when possible,
- avoid long dependency installs on camera,
- avoid hidden environment assumptions,
- keep commands short and copy-pasteable,
- prepare fallback output for nondeterministic agent behavior,
- include a reset point after risky edits,
- keep code font and terminal output readable.

## Relationship To Lesson Draft

The scenario should not mirror the draft section-by-section. The draft explains; the video demonstrates.

Use the draft to decide:

- what the learner already reads in prose,
- which placeholders require a demo,
- where the video should replace a placeholder with a concrete recording plan,
- which claims are better left to `Deep Dive` and `Materiały Dodatkowe`,
- which transitions need a quick visual bridge.

Record mismatches when:

- video teaches a concept absent from the draft,
- draft promises a placeholder the video does not cover,
- video uses a different example than the required example/demo,
- video introduces a current tool claim not in grounding,
- video defers something the draft treats as required.

Do not automatically edit the draft to fix mismatches. Report them unless the user asks for integration.

## Handling Facts And Tool Behavior

When the scenario depends on current tool behavior, official command syntax, UI labels, model behavior, pricing, release dates, docs, or platform capabilities, verify against `lesson-grounding.md` first.

If the grounding is missing or stale:

- ask whether to run `lesson-grounding`,
- or make the scenario tool-agnostic and mark exact behavior under `Needs human decision`,
- or require prepared/fallback footage instead of live claims.

Never state that an agent "will" produce a specific mistake unless the demo has a prepared fixture, deterministic prompt, or fallback plan. Use "expected visible failure" only when the recording plan includes a way to handle a non-failing run.

## Schema Updates

Normally this skill does not edit `lessons-schema.json`.

Update only the target lesson object when the user explicitly asks or when the scenario materially changes fields that already exist:

- `videoPlaceholders`,
- `requiredArtifacts`,
- `sideEffectLedger.videoTextMismatches`,
- `sideEffectLedger.unsupportedFacts`,
- `sideEffectLedger.needsHumanDecision`.

Do not add new schema concepts. Do not mass-edit lessons.

## Final Summary

After saving the scenario, report:

```markdown
## video-scenario — <lessonId>

Created/updated:
- workbench/lessons/<lessonId>/videos/video-{video-slug}.md

Recording spine:
- [...]

Key setup assumptions:
- [...]

Mismatches/decisions:
- [...]
```

Keep the summary short. The saved scenario is the source of detail.

## Quality Bar

A good video scenario:

- is easy for a programmer to record without improvising the structure,
- turns placeholders into concrete screen actions,
- has clear before/after moments,
- uses the same thesis and boundaries as the lesson,
- stays reproducible and local unless live behavior is necessary,
- names fallback plans for nondeterministic agent/tool behavior,
- makes the transferable concept visible through a concrete demo,
- records mismatches instead of hiding them.
