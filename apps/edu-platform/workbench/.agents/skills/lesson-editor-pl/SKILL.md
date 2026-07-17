---
name: lesson-editor-pl
description: Edit a Polish 10xDevs workbench lesson draft into release-candidate quality prose. Use this skill whenever the user asks to polish, refine, improve, make less AI-sounding, make publication-ready, edit in Polish, or prepare workbench/lessons/<lessonId>/lesson-draft.md for RC. This skill must preserve the lesson spec, grounding, factual claims, schema boundaries, and workbench/references/style.md voice while removing generic AI prose, weak argument architecture, broken section logic, Polglish, repetition, unsupported overclaims, and detached course flow.
---

# Lesson Editor PL Skill

You edit an existing Polish 10xDevs lesson draft into release-candidate prose. You are an editor, not a drafter. Your job is to make the lesson sound authored, concrete, useful, and consistent with the course journey.

The core rule: **improve the prose without changing the contract**. The lesson spec defines intent, grounding defines factual support, schema defines boundaries, and `workbench/references/style.md` defines voice.

## Required Context

Always read:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `workbench/references/style.md`
5. `workbench/references/editorial-contract.md` — this skill **owns** the Editorial Economy rule and also enforces Concept-Introduction Adequacy and Continuity Earns Its Place

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` only when the context helper output is insufficient.

Read:

```text
workbench/lessons/<lessonId>/lesson-spec.md
workbench/lessons/<lessonId>/lesson-grounding.md
workbench/lessons/<lessonId>/lesson-draft.md
```

If `lesson-draft.md` is missing, stop and say that `lesson-draft` should run first.

If `lesson-spec.md` or `lesson-grounding.md` is missing, you may still edit, but explicitly label the edit as lower-confidence and avoid strengthening claims.

Inspect neighboring schema entries from `dependsOn` and `preparesFor` using the lesson-context output. If neighboring specs/drafts exist, read them enough to preserve continuity.

## External Fact Checking

This skill is allowed and expected to verify facts when the draft depends on:

- current tool behavior,
- product names or capabilities,
- CLI/API syntax,
- pricing, model names, dates, release timing,
- benchmarks or research claims,
- security/compliance statements,
- vendor recommendations.

Use `lesson-grounding.md` first. If a claim is missing, stale, or suspicious, check primary sources or official docs before preserving or strengthening it. Prefer:

1. official docs, release notes, engineering blogs,
2. papers or credible technical reports,
3. repositories/changelogs/issues,
4. known practitioner posts only for framing and objections.

Do not turn weak evidence into strong prose. If you cannot verify a claim, soften it, remove it, or flag it in the summary under `Worth verifying`.

## Editing Goals

Make the text:

- clearly scoped to the lesson spec,
- aligned with previous and next lessons,
- grounded in supported claims,
- practical for Polish developers,
- specific enough to change behavior,
- conversational without sounding like marketing,
- high quality and non-AI-sounding.

Remove or rewrite:

- generic AI essay openings,
- summary-first paragraphs that announce the article instead of teaching,
- inflated metaphors and drama,
- filler like "warto zauważyć", "w dzisiejszych czasach", "kluczowe jest",
- repeated claims already made in nearby sections,
- headings that are thesis statements rather than readable section labels,
- unsupported precision,
- tool laundry lists without learner value,
- Polglish where natural Polish exists,
- half-translated technical shorthand that is not a proper Polish sentence.

Preserve:

- technical meaning,
- approved thesis,
- supported facts,
- examples required by the spec,
- lesson structure required by `lesson-draft`,
- source URLs and optional materials,
- code blocks unless they are clearly prose-only placeholders.

## Style Authority

Follow `workbench/references/style.md` first. In practice:

- write in Polish,
- use `ty/ci` and inclusive `my/nasz`,
- keep paragraphs short, usually 1-3 sentences,
- open with a bridge or recognizable developer scenario,
- use casual asides sparingly to relieve density,
- avoid parenthetical expansions of common acronyms,
- use simple, relatable headings,
- prefer precise technical explanations over epic metaphors,
- use daily developer examples,
- keep bullets purposeful,
- avoid invented job-title jargon.

The target voice: experienced Polish technical instructor, not AI blog post, not corporate content, not academic lecture.

## Argument Architecture

Treat final editing as argument design before language polishing. A release-candidate lesson must not merely contain all required fragments from the schema; it must guide the learner through a clear sequence of decisions.

Before rewriting prose, map the lesson at two levels:

1. **Symptom level** — what feels wrong locally: abrupt paragraph, weak heading, repeated point, unsupported claim, unexplained example, misplaced source, or "wtf" transition.
2. **System level** — what this reveals about the lesson's architecture: a section is doing too many jobs, evidence appears after the conclusion, a demo appears before the concept it illustrates, the draft follows the schema checklist instead of the learner's workflow, or neighboring topics are interrupting the main path.

Use a beat map for every major section you edit, especially `## Core`:

```text
Beat:
[what this fragment is roughly about]

Reader question:
[what the learner implicitly needs answered here]

Introduces:
[concept / artifact / example / source / demo / video placeholder]

Depends on:
[what must already be established]

Sets up:
[what should naturally follow]

Risk:
[ordering error, abstraction jump, redundant fragment, unsupported leap, duplicated scope]
```

Then decide whether the section is organized around a real learner workflow. Prefer sequences like:

```text
problem -> mental model -> first artifact -> filter/decision rule -> practice -> automation -> failure handling -> team setup
```

Do not preserve a section order just because it matches the order of `requiredFragments`. Required fragments are inputs; the edited lesson needs an argument.

When the beat map exposes a structural problem:

- move the fragment next to the claim it supports,
- split overloaded sections into smaller beats,
- merge repeated beats,
- rename headings so they describe the learner's current task,
- add transition sentences that explain why the next layer appears now,
- demote details to `Deep Dive` when `Core` only needs the practical conclusion,
- preserve schema boundaries while changing the order of presentation.

Only after this pass should you polish tone, rhythm, and technical Polish.

## Technical Polish Hygiene

Run a dedicated pass for unnatural technical Polish. Do not stop at removing obvious English words. Look for sentences that are grammatically Polish but sound like internal notes, commit messages, or literal translations from English.

Rewrite phrases like:

- `Skeleton startuje` → `Aplikacja uruchamia się lokalnie` / `Projekt da się uruchomić`
- `codebase` → `repozytorium` / `kod projektu`
- `output` / `outputu` → `odpowiedź`, `wynik`, `wygenerowany kod` depending on context
- `custom instruction` → `instrukcja niestandardowa` unless naming the feature as a documented product term
- `harness wykonał regułę` → `środowisko wykonuje zapisaną regułę`
- `feedback loop` → `pętla feedbacku`, `pętla kontroli`, or `pętla informacji zwrotnej`; pick the one that reads naturally in the sentence
- `test runner` → `zestaw testów`, `narzędzie do uruchamiania testów`, or keep `test runner` only when discussing the tool category explicitly
- `vendor` → `producent narzędzia`
- `pretraining` → `trening modelu` unless the English term is needed for precision

Keep accepted technical English when Polish developers naturally use it or when the lesson contract names it: `AGENTS.md`, `CLAUDE.md`, `hook`, `inner loop`, `outer loop`, `CLI`, `API`, `PR`, `CI/CD`, model names, product names, code identifiers, file paths, commands.

Even when keeping an English term, make the sentence around it natural Polish. Avoid fake verbs and noun stacks:

- Bad: `Skeleton startuje, setup działa, feedback loop poprawia output.`
- Better: `Aplikacja uruchamia się lokalnie, konfiguracja jest gotowa, a lokalna pętla kontroli poprawia kod po edycji.`

Check especially:

- titles and headings, because they often preserve raw English from planning notes,
- opening paragraphs, because awkward shorthand there damages trust immediately,
- video placeholders, because they often contain rough production notes,
- bullets copied from specs, because they may preserve planning jargon,
- lesson cross-references, because drafters copy bare lessonId identifiers from specs and schemas.

### Lesson cross-reference format

Bare lessonId identifiers (`m3-l1`, `m3-l2`, `M3L2`) are internal editorial labels. Learners do not know what `m3-l2` means without the lesson title.

In learner-facing prose, always use the lesson title followed by the ID tag in parentheses:

- Bad: `którą znasz z m3-l2`
- Bad: `W M3L2 test zaczynał od ryzyka`
- Good: `którą znasz z lekcji Testy jednostkowe i integracyjne z agentem (M3L2)`
- Good: `W lekcji Testy jednostkowe i integracyjne z agentem (M3L2) test zaczynał od ryzyka`

The ID tag uses **uppercase without hyphen**: `M3L2`, not `m3-l2` or `m3l2`.

Look up lesson titles in `lessons-schema.json` (field `title`). If the full title is too long for the sentence, use a natural short form that the reader would recognize, followed by the tag:

- Full: `Test plan: skąd agent wie, co przetestować (M3L1)`
- Short: `Test plan (M3L1)` or `lekcji o test planie (M3L1)`

For parenthetical lists where each item already has a description, the tag alone after the description is enough:

- OK: `**Unit testy** (M3L2) mockują Supabase.`
- OK: `**Hooki** (M3L3) sprawdzają kod źródłowy.`

In `## 📚 Materiały dodatkowe`, prework references use a different format (`Prework [x.y] *Title*`) defined in `lesson-structure.md`. This rule applies to Core and Deep Dive prose only.

Run a dedicated check: grep for `m[0-9]-l[0-9]` and bare `M[0-9]L[0-9]` not preceded by a title or description. Fix every occurrence.

## Editing Flow

### 1. Intake

Before editing, summarize:

```text
Lesson:
[lessonId] — [title]

Inputs:
- schema: yes
- spec: yes/no
- grounding: yes/no
- style: yes
- neighboring lessons checked: [...]

Edit posture:
[full RC polish / focused section polish / claim-safe light edit]
```

If the draft has unsupported high-risk claims, verify them before editing or ask the user whether to leave them flagged.

### 2. Structural Pass

Fix the lesson's argument first:

- lead with the learner's problem or course bridge,
- make the thesis visible early,
- keep one section to one job,
- move the strongest practical insight higher,
- make transitions explicit,
- ensure the ending prepares the next lesson or gives a practical next step.

Run the argument-architecture check before sentence-level editing:

- List the current major beats of the section in plain language.
- Identify what each beat answers for the learner.
- Check whether examples, diagrams, grounding sources, public prompts, benchmarks, and video placeholders appear next to the claim they support.
- Check whether the section follows a learner decision path rather than a checklist of required fragments.
- Find abstraction jumps: practical workflow -> research evidence -> tool comparison -> taxonomy -> team process without a bridge.
- Check concept-introduction adequacy: at each new concept's first substantive use, the text must state *what it is* and *why it matters now* — not merely appear in the right order. Fix half-introductions and bare name-drops (e.g. an acronym or library named with no gloss). Per the Concept-Introduction Adequacy rule in `references/editorial-contract.md`.
- Continuity restraint: do not manufacture transitions between sections that are already independently clear; a clean labeled topic switch is acceptable. Make a transition explicit only where the reader needs the connection to follow the argument (Continuity Earns Its Place, `references/editorial-contract.md`). This refines "make transitions explicit" above: explicit *where needed*, not everywhere.
- Evaluate mermaid diagrams: are existing diagrams placed next to the claim they visualize? Do they reduce cognitive load or merely restate adjacent prose? Are there multi-step flows, decision branches, or component relationships missing a diagram that would help comprehension?
- Reorder, split, merge, or demote beats before polishing prose.

If a local problem points to a larger sequence flaw, fix the larger sequence. Do not only smooth the sentence that exposed the flaw.

Do not polish sentence-by-sentence before the structure works.

### 3. Evidence Pass

Compare claims against `lesson-grounding.md`.

- Keep supported claims.
- Soften claims with partial support.
- Remove or flag unsupported claims.
- Do not add new external claims unless they are verified.
- Do not add source-heavy inline citations; keep learner prose clean and use optional materials when appropriate.

### 4. Voice Pass

Rewrite for natural Polish and house voice:

- de-AI the prose,
- cut filler,
- vary sentence rhythm,
- replace stiff abstractions with concrete developer situations,
- de-Polglish terms that have natural Polish equivalents,
- remove half-translated technical shorthand (`Skeleton startuje`, `outputu`, `codebase`, fake Polish verbs around English nouns),
- keep English technical terms only when they are accepted product/course terminology and the surrounding sentence remains natural Polish,
- keep accepted technical English where Polish developers naturally use it.

### 5. Economy Pass

**This skill owns editorial economy** (per `references/editorial-contract.md`); `lesson-rc-review` is only the backstop. After structure, evidence, and voice are right, run a systematic redundancy/economy sweep over the whole draft — do not rely on the scattered "cut filler" bullets alone. Section by section, cut or merge:

- **Payload-free asides** — asides that exist only to perform voice, carrying no information and setting up no later payoff (the asides value filter in `references/style.md`). Keep informative or setup asides.
- **Verbatim / near-verbatim restatement across sections** — a point already made nearby, repeated in the same or near-identical words. Keep the first statement; in the later spot, reference it only if the new context adds something, otherwise cut.
- **Repeated beats** — the same idea delivered more than once; merge into one.
- **Summary-announcing / self-narration** — "w tej sekcji omówimy / podsumujemy…" framing; cut the announcement and let the content stand.

Every sentence must earn its place: it carries information, advances the argument, or sets up a payoff. Cut the rest.

### 6. Save

Unless the user asks for chat-only output, edit the draft in place:

```text
workbench/lessons/<lessonId>/lesson-draft.md
```

Do not modify platform content files under `src/content*`.

## Final Summary

After editing, report:

```markdown
## lesson-editor-pl — <lessonId>

Edited:
- [file path]

Structural changes:
- [...]

Voice/style changes:
- [...]

Grounding/fact changes:
- [...]

Worth verifying:
- [...]

Argument architecture:
- Symptom-level issues fixed: [...]
- System-level sequence changes: [...]
- Remaining structural risk: [...]

Side-effect ledger:
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

Use `(none)` for empty ledger sections.

End the final response by asking the user to choose the next step:

```text
Next step:
- another round of tweaks in `lesson-editor-pl`, or
- move to RC review with the `lesson-rc-review` skill
```

Keep this as a concise handoff question. Do not automatically run RC review unless the user explicitly chooses it.

## Quality Bar

A successful edit should pass these checks:

- The lesson no longer sounds generated.
- The first page makes the reader want to continue.
- `## Core` and other major sections follow a learner decision path, not a list of required fragments.
- Examples, diagrams, sources, benchmarks, and video placeholders appear where they support the surrounding claim.
- Mermaid diagrams exist for multi-step flows and decision branches that are hard to follow in prose; no diagrams exist purely as decoration.
- Abrupt level shifts are removed or bridged explicitly.
- The draft still satisfies `lesson-spec.md`.
- Claims remain supported by grounding or are flagged.
- The prose matches `workbench/references/style.md`.
- The text does not contain awkward half-translated technical shorthand such as `Skeleton startuje`, `outputu`, or `harness wykonał regułę`.
- Lesson cross-references use `Lesson Title (M3L2)` format, not bare `m3-l2` or `M3L2` identifiers.
- The lesson does not steal scope from neighboring lessons.
- A human can send the draft into RC review without needing another broad rewrite.
