# Frame Brief: 10x-workflow Skills Cheatsheet

> Framing step before /10x-plan. This document captures what is *actually*
> at issue, separated from what was initially assumed.

## Reported Observation

Students asked for a 10x-workflow summary (infographic or cheatsheet) covering
the most important information about each skill — **when to use it, how to chain
it**. "We have a lot of skills (and prompts), so we need to group them properly
(we can start with grouping by module)."

## Initial Framing (preserved)

- **User's stated cause or approach**: Organize **by module**; understand each
  skill via the `skill-explainer` prompt; pull the "how to use" voice from the
  m1–m3 `lesson-draft.md` files.
- **User's proposed direction**: Build a cheatsheet — either a generated
  infographic (nano-banana-pro / GPT-image-2 via OpenRouter) **or** an
  HTML+Tailwind page (user leans HTML: easier to iterate on content + style).
- **Pre-dispatch narrowing** (Step 1.5 answers):
  - Leading student pain = **"What does each skill do?"** (reference/recall gap),
    not primarily "which one, when" or "how does it all connect".
  - Primary organizing lens = **by module (M1→M3)** — initial framing confirmed.
  - Coverage = **23 in-scope skills only** (no bonus/helper tiers).

## Dimension Map

The "summary students need" could originate at any of these design dimensions:

1. **Artifact JOB** — reference (cover all skills evenly: what each does) vs
   decision aid (which to reach for, when) vs mental-model map (how they chain).
   ← the load-bearing fork. **User pinned: reference.**
2. **Organizing lens** — by module (teaching order) ← initial framing & confirmed,
   vs by workflow phase/chain (decision order). Research: the two axes nearly
   coincide, so the unused one can be overlaid cheaply.
3. **Coverage scope** — 23 wired/taught (M1–M3) ← confirmed, vs +6 bonus registry
   skills, vs +helper tier.
4. **Production medium** — generated image vs HTML+Tailwind. Least load-bearing;
   medium follows from JOB. User leans HTML; left as a planning detail.

## Hypothesis Investigation

Evidence is the completed research (`research.md`) plus the user's Step 1.5
answers — no new sub-agents (the codebase surface was already mapped; further
agents would be padding).

| Hypothesis | Evidence | Verdict |
| --- | --- | --- |
| JOB = reference table (what each does) | User picked "What does each do"; student ask names "info about each skill" | STRONG |
| JOB = decision aid (which/when) | Student ask also says "when to use it"; but user de-prioritised it as the *lead* | WEAK (secondary, not primary) |
| Lens = by module | User confirmed; research: module-axis ≈ phase-axis because course teaches in chain order (`research.md` §3–4) | STRONG |
| "How to chain" can be dropped | Student ask explicitly says "**how to chain it**" — dropping it under-serves the request | NONE (must be preserved) |
| Coverage beyond 23 | User picked "23 only"; 6 registry skills are real but out of M1–M3 scope | NONE (out of scope by decision) |

## Narrowing Signals

- "What does each do" + "by module" + "23 only" → the initial framing held on all
  three axes. This is a **confirmed framing**, not a reframe.
- The single decisive catch: the student request contains **two** asks
  ("when to use" *and* "how to chain"). The user's lens choice optimises for
  "what/when" per skill; "how to chain" must therefore be carried as **cell
  content and a compact flow strip**, not as the organizing structure — otherwise
  a flat glossary silently answers only half the ask.

## Cross-System Convention

Standard cheatsheet convention for a tool suite: lanes/sections by category, each
cell = name + one-line purpose + key usage. Here the chain is a first-class
property of the suite (every skill is `read file → write file → STOP`), so the
convention is extended with an **input→output artifact** field per cell and a
small end-to-end flow diagram — matching how the lesson-drafts already narrate
skills ("czyta plik → produkuje plik", arrows `→`).

## Reframed (or Confirmed) Problem Statement

> **The actual problem to plan around is**: a **module-organized reference card**
> for the **23 M1–M3 skills** (+ their prompts), where each skill cell answers
> *what it does · when to use it · its input→output artifact*, and a compact
> chain strip preserves the "how to chain" half of the student ask without
> becoming the primary structure.

The initial framing was **correct on all three axes it touched** (reference, by
module, 23 only) — proceed with the originally proposed direction. The only thing
the frame changes: "how to chain" is a **required content layer**, not an
afterthought, because the student request explicitly asked for it even though the
artifact is organized by module rather than by chain.

## Confidence

- **HIGH** — framing confirmed by completed research + decisive user answers on
  all three open axes; the one refinement (preserve chaining as content) is
  directly grounded in the literal student request.

## What Changes for /10x-plan

- **Structure**: module lanes M1→M3 (+ M0 prework prompt). Within each lane, list
  **net-new skills per lesson** — key off the net-new-per-lesson table in
  `research.md` §2, NOT the cumulative `course-content` arrays (the wiring spreads
  cumulatively, so every lesson's array contains all prior skills).
- **Cell schema** (per skill): command (e.g. `/10x-plan`) · 1-line purpose ·
  when-to-use trigger · **input file → output file** · "first taught in mNlN".
  Capsule data already drafted in `research.md` §5.
- **Chain layer**: add one compact end-to-end flow strip (foundation branch:
  greenfield/brownfield; per-change loop: new→[frame/research]→plan→[review]→
  implement/tdd/e2e→impl-review→archive) so "how to chain" is answered. Secondary
  to the module lanes, not the spine.
- **Prompts**: 7 prompts as secondary per-lesson footnotes (the four `m1l5-*` are
  one deploy sub-sequence — group them).
- **Annotations**: mark `/10x-frame` as a situational lifeline (not a linear
  step); note `/10x-implement`·`/10x-tdd`·`/10x-e2e` share one `plan.md` + `##
  Progress`; `10x-archive` is wired but draft-silent (include from wiring).
- **Medium**: HTML+Tailwind recommended (user lean + iteration argument in
  `research.md`); optional static-image export for sharing. Confirm in plan; not a
  framing blocker.
- **Language**: PL learner-facing copy (voice/quotes in `research.md` §7); EN for
  skill names/commands/artifact filenames.

## References

- Source research: `context/changes/workflow-cheatsheet/research.md` (§2 net-new
  table, §3 chain topology, §5 per-skill capsules, §7 voice)
- Skill→lesson wiring: `10x-toolkit/packages/course-content/src/courses/10xdevs3/`
- Skill sources: `10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md`
- Change notes: `context/changes/workflow-cheatsheet/change.md`
- Investigation tasks: none spawned (evidence reused from research phase)
