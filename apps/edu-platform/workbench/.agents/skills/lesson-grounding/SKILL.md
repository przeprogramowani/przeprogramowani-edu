---
name: lesson-grounding
description: Ground an existing 10xDevs lesson spec or draft in credible source material before drafting or revision. Use this skill whenever the user asks to research, verify, source, ground, enrich, fact-check, or strengthen a workbench lesson with external materials, popular technical sources, Hacker News/practitioner signals, known AI/ML/programming authors, official docs, papers, repos, or current tool behavior. This skill produces workbench/lessons/<lessonId>/lesson-grounding.md and updates the target lesson entry in workbench/lessons-schema.json with source metadata so lesson-draft can consume grounded claims without turning research into unsourced prose.
---

# Lesson Grounding Skill

You ground a 10xDevs 3.0 lesson in credible source material. Your output is not a learner-facing lesson. It is a research and evidence brief that helps `lesson-draft` write stronger prose without inventing facts, overclaiming, or copying trendy discourse.

The core rule: **schema/spec/draft define what needs grounding; primary sources define facts; practitioner sources define pain and language; the schema records which sources are attached to the lesson**.

## Required Context

Always read:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `src/content/lessons10xDevs3Prework/style.md`
5. `workbench/references/editorial-contract.md` — the Concept-Introduction Adequacy rule (incl. the grounding "use silently" note) that governs how claims become prose

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` before updating `groundingSources` or when the context helper output is insufficient.

Read whichever lesson artifacts exist:

```text
workbench/lessons/<lessonId>/lesson-spec.md
workbench/lessons/<lessonId>/lesson-draft.md
```

At least one of spec or draft should exist. If neither exists, ask whether the user wants assumption-based research from the schema slot or wants to run `lesson-spec` first.

Also inspect neighboring lessons from `dependsOn` and `preparesFor` using the lesson-context output. If their specs/drafts exist, read them to avoid sourcing material that belongs elsewhere.

## What This Skill Produces

Save the grounding brief to:

```text
workbench/lessons/<lessonId>/lesson-grounding.md
```

Update the target lesson entry in:

```text
workbench/lessons-schema.json
```

with source metadata under:

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
    "confidence": "high | medium-high | medium | low",
    "notes": "string"
  }
]
```

If `groundingSources` already exists, merge carefully:

- keep existing relevant sources,
- update `checkedAt` only for sources you actually rechecked,
- remove or demote stale/irrelevant sources only when the grounding brief explains why,
- do not duplicate the same URL.

If the user asks for research only and explicitly says not to edit schema, write the grounding brief and add a `Schema Update Proposal` section instead of editing `lessons-schema.json`.

## Source Hierarchy

Use sources according to their role:

1. **Official docs, specs, release notes, API docs, product docs** — facts about tool behavior, syntax, current capabilities, limitations, pricing, dates, and supported workflows.
2. **Research papers, technical reports, credible benchmark writeups** — claims about model behavior, productivity, hallucination, context degradation, evaluation, or methodology.
3. **Repositories, issue trackers, changelogs** — implementation reality, examples, APIs, edge cases, current project state.
4. **Technical posts by known teams or authors** — framing, practitioner interpretation, engineering patterns.
5. **Hacker News, Reddit, forums, X threads, community posts** — practitioner signals: recurring pain, objections, language, controversy, and adoption patterns. Treat these as weak evidence for facts.
6. **SEO blogs and generic listicles** — avoid unless they contain a concrete example that cannot be found elsewhere.

Popular does not mean reliable. A widely shared post may be useful for naming a pain, but facts need stronger support.

## Research Scope

Use the lesson scope to decide what to search for. Do not collect sources just because they are interesting.

For each lesson, identify:

- claims in the spec/draft that need support,
- claims that are time-sensitive,
- practical workflow details that may need exact docs,
- controversial or easy-to-overstate ideas,
- examples that could make the lesson concrete,
- topics that belong to neighboring lessons and should not be researched deeply here.

Search targets may include:

- official vendor docs and engineering blogs,
- model/tool release notes,
- known AI/ML/programming authors,
- GitHub repositories and issues,
- benchmark pages and papers,
- Hacker News discussions for practitioner objections,
- internal course resources and prework lessons.

When using external web research, prefer primary sources and official docs for technical facts. For time-sensitive details, verify against current sources instead of memory.

## Grounding Brief Format

Use this exact structure:

```markdown
# Lesson Grounding: [lessonId] — [title]

## Scope

- Lesson source: [schema/spec/draft]
- Neighbor boundaries: [...]
- Relevant prework: [...]
- Research posture: [light / standard / deep]

## Claims To Support

- [Claim] — [why it matters] — [needed evidence type]

> **Use silently vs. surface.** A source may be used *silently* to get a fact right; not every supported claim must become a sentence in the lesson. Do not turn this list into a checklist of name-drops the draft must surface. Per the Concept-Introduction Adequacy rule in `references/editorial-contract.md`: if a claim is worth surfacing, it must be introduced with *what it is* + *why it matters now* — and a claim too thin to introduce adequately should be flagged (so the draft either expands it properly or uses it only for factual correctness). Factual correctness is always required, whether a claim is surfaced or used silently.

## Strong Sources

### [Source title]

- URL: [...]
- Type: [official-docs / paper / repo / technical-post / internal-course-material]
- Author/publisher: [...]
- Checked: [YYYY-MM-DD]
- Supports:
  - [...]
- Use in lesson: (mark each as *surface* or *use silently*; a silent use grounds a fact without becoming prose — see the use-silently note above)
  - [...]
- Confidence: [high / medium / low]
- Notes:
  - [...]

## Practitioner Signals

### [Discussion or author]

- URL: [...]
- Type: [community-discussion / practitioner-signal / technical-post]
- Signal:
  - [...]
- Useful language:
  - [...]
- Risk:
  - [...]
- Confidence: [high / medium / low]

## Examples Worth Using

- [Concrete example, workflow, artifact, or failure mode]

## Claims To Avoid Or Soften

- [Claim] — [reason]

## Open Verification Questions

- [Question that still needs a human/tool/doc check]

## Schema Source Update

[Summarize exactly what was added/changed in workbench/lessons-schema.json, or provide the proposed JSON if schema editing was skipped.]
```

Keep the brief useful for drafting. Do not turn it into a literature review.

## Updating The Schema

After writing the grounding brief, update only the target lesson object in `workbench/lessons-schema.json`.

Add or update `groundingSources` with the strongest useful sources from the brief. Include:

- sources that support factual claims,
- sources that should appear in `Materiały dodatkowe`,
- sources the drafter should consult before writing current tool details.

Do not add every community discussion to schema. Put weak practitioner signals in the grounding brief; add them to schema only when they materially shape the lesson's framing or objections.

Never put long quotes, summaries, or copied excerpts in schema. Store only source metadata and short relevance notes.

Also update the target lesson's `sideEffectLedger.unsupportedFacts` when the brief finds claims that remain unsupported. Update `sideEffectLedger.needsHumanDecision` when a claim needs a human editorial decision rather than more research.

## Relationship To Other Skills

- Use `lesson-spec` before this skill when the lesson direction is unclear.
- Use this skill before `lesson-draft` when facts, examples, or current tool behavior matter.
- `lesson-draft` should read `lesson-grounding.md` and `groundingSources` if they exist.
- This skill may ground an existing draft, but it should not rewrite the draft unless the user explicitly asks for revision.

## Quality Bar

A good grounding pass:

- separates facts from practitioner sentiment,
- uses primary sources for claims that matter,
- surfaces objections and failure modes,
- reduces the lesson's risk of aging badly,
- protects neighboring lessons from scope theft,
- records source metadata in schema without turning schema into prose,
- leaves the drafter with clear claims, examples, and boundaries.

If sources are weak, say so. A grounded lesson can still make a practical claim, but it should not pretend the evidence is stronger than it is.
