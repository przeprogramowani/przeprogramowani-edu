# Workbench Agent Instructions

This directory is an editorial workbench for creating 10xDevs 3.0 main-course lesson materials with Codex and Claude Code.

It is not the learner-facing platform content pipeline. Do not treat workbench files as Astro content, Circle content, generated HTML, or deployment configuration.

## Source Of Truth

`lessons-schema.json` is the central curriculum contract.
`schemas/lessons-schema.schema.json` is the structural contract for that JSON file. Use it to understand field shape, allowed enum values, and optional vs required fields; do not treat it as a replacement for reading the target lesson entry.
`scripts/lesson-context.mjs <lessonId-or-title>` is the fast orientation helper. It prints the target lesson contract, dependency/forward-neighbor boundaries, and compact course map without forcing agents to reread the entire schema for every lookup.

Before planning, grounding, drafting, editing, or reviewing any lesson artifact:

1. Read `schemas/lessons-schema.schema.json` if you need to understand the schema shape or allowed values.
2. Run or read the output of `node scripts/lesson-context.mjs <lessonId-or-title>` for the target lesson.
3. Read `lessons-schema.json` before making schema edits or when the context helper output is insufficient.
4. Locate the target lesson by `lessonId` or title.
5. Inspect `dependsOn` and `preparesFor`.
6. Respect `owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders`, `groundingSources`, and `sideEffectLedger` when present.

The schema defines:

- module and lesson order,
- dependency and forward-continuity links,
- editorial ownership boundaries,
- expected artifacts,
- source metadata for grounded claims,
- side-effect tracking.

The schema does not define publishing paths, Circle lesson IDs, frontmatter, generated HTML metadata, or deployment behavior.

## Lesson Workflow

Use this flow unless the user explicitly asks for a narrower task.

### 1. Lesson Spec

Use `lesson-spec` to create or refine:

```text
workbench/lessons/<lessonId>/lesson-spec.md
```

The spec defines the lesson job, thesis, learning outcomes, owned concepts, references-only concepts, forbidden overlap, examples, failure modes, bridge in, bridge out, and open questions.

Do not draft learner-facing prose while the spec is still unsettled.

### 2. Lesson Grounding

Use `lesson-grounding` when the lesson needs research, fact-checking, current tool behavior, source material, practitioner signals, or support for claims.

It produces:

```text
workbench/lessons/<lessonId>/lesson-grounding.md
```

It may update only the target lesson object in `lessons-schema.json` with:

```json
"groundingSources": [
  {
    "title": "string",
    "url": "string",
    "sourceType": "official-docs | paper | repo | technical-post | practitioner-signal | community-discussion | internal-course-material",
    "publisherOrAuthor": "string",
    "checkedAt": "YYYY-MM-DD",
    "relevance": "string",
    "claimsSupported": ["string"],
    "confidence": "high | medium | low",
    "notes": "string"
  }
]
```

Do not add every found link to schema. Add the strongest sources that support factual claims, should appear in `Materiały dodatkowe`, or should be consulted before drafting current tool details.

Community sources such as Hacker News, Reddit, forums, or X threads are practitioner signals. They can show recurring pain, objections, and language, but they are weak evidence for factual claims.

### 3. Lesson Draft

Use `lesson-draft` to write:

```text
workbench/lessons/<lessonId>/lesson-draft.md
```

The draft must use:

- `lessons-schema.json`,
- `lesson-spec.md` when available,
- `lesson-grounding.md` and `groundingSources` when available,
- `workbench/references/prework.md`,
- `src/content/lessons10xDevs3Prework/style.md`,
- neighboring lesson context from `dependsOn` and `preparesFor`.

If a draft would need exact syntax, current product behavior, pricing, model recommendations, dates, or benchmark claims and there is no grounding, either run `lesson-grounding`, ask the user, or write around the detail and report it as unsupported.

### 4. Video Scenario

Video scenarios live in a dedicated `videos/` subdirectory inside each lesson folder:

```text
workbench/lessons/<lessonId>/videos/video-{video-slug}.md
```

The video scenario is a separate artifact. It should use the same schema/spec/grounding context as the draft, but it should not silently change the lesson's thesis or boundaries.

If the video introduces a claim or demo that the draft does not support, report it under `Video/text mismatches`.

### 5. RC Review

Release-candidate review should compare all available artifacts:

- schema,
- spec,
- grounding,
- draft,
- video scenario,
- prework continuity,
- neighboring lesson boundaries.

Prioritize drift, duplication, unsupported claims, mismatched video/text content, and missing human decisions.

## 10x Content Delivery (Toolkit → CLI)

Lessons reference AI skills delivered to learners via the public CLI (`@przeprogramowani/10x-cli`). The content originates in the private toolkit monorepo (`@przeprogramowani/10x-toolkit`).

Before writing CLI setup instructions, skill invocation examples, or verifying skill source material, read:

```text
workbench/references/10x-content-delivery.md
```

Key rules:

- Learner-facing prose must use CLI commands (`10x auth`, `10x get m1l1`), not internal toolkit commands (`npx @przeprogramowani/10x-toolkit install`).
- Canonical skill sources for grounding live at `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md`.
- Lesson wiring (which skills belong to which lesson) lives at `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/`.

## Prework Continuity

`workbench/references/prework.md` summarizes the prework lessons.

Treat prework as the learner's starting context:

- assume concepts already introduced there,
- deepen or operationalize them in the main course,
- avoid repeating prework as filler,
- reference prework only when it helps continuity.

For house voice, read:

```text
src/content/lessons10xDevs3Prework/style.md
```

For concrete examples of the voice, prefer source Markdown:

```text
src/content-source/lessons10xDevs3Prework/pl/
```

Read only the relevant lessons. Do not bulk-load the whole prework corpus unless the user asks for a broad review.

## Editing Discipline

- Follow `workbench/references/lesson-structure.md` for canonical section order, emoji prefixes, heading rules, Deep Dive intro convention, and link format in Materialy dodatkowe. Read it before drafting, editing, or reviewing any lesson.
- Keep generated prose in Polish unless the user asks otherwise.
- Keep workbench artifacts editorial and platform-agnostic.
- Do not modify `src/content*` from this workbench unless the user explicitly asks for publishing integration.
- Do not change lesson order unless the user explicitly asks to change curriculum sequence.
- Do not invent learning outcomes, ownership boundaries, or forbidden overlaps when a spec/schema decision is missing.
- Prefer enriching existing schema fields over adding new schema concepts.
- Do not mass-add empty `groundingSources` or other fields across every lesson unless the user explicitly asks for a schema migration.
- When updating `lessons-schema.json`, touch only the target lesson unless the task is explicitly schema-wide.

## Side-Effect Ledger

When a change materially affects lesson content, report:

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

This protects the curriculum from scope drift, duplicated concepts, unsupported claims, and mismatch between lesson text and video scenario.

## Grounding Rules

Use source hierarchy deliberately:

1. Official docs, specs, release notes, API docs, product docs for current facts.
2. Research papers, technical reports, and credible benchmark writeups for model behavior and methodology.
3. Repositories, issues, and changelogs for implementation reality.
4. Technical posts from known teams or authors for framing and engineering patterns.
5. Hacker News, Reddit, forums, X threads, and community posts for practitioner signals.
6. SEO blogs only when they contain a concrete useful example unavailable elsewhere.

Popular sources are not automatically reliable. Do not use community sentiment as proof of a factual claim.

If a source is weak, say so.
