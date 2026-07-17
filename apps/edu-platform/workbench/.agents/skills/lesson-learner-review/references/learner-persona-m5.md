# Learner Persona Cache — Module 5 (AI-Native Teamwork)

Stable persona base for `lesson-learner-review` runs on any **m5** lesson. Ships with the
skill at `skills/lesson-learner-review/references/learner-persona-m5.md` (mirrored in the
`.claude` and `.agents` copies). Load this instead of re-deriving the learner's *prior*
knowledge from scratch each run.

> **Still run `node workbench/scripts/lesson-context.mjs <lessonId>` every time.**
> This file caches the *stable* base (fixed traits + module-entry knowledge). The
> per-lesson delta — this lesson's `owns` (= "new here") and its `dependsOn` /
> `preparesFor` boundaries — must still come from the context helper, because that
> is exactly what changes lesson to lesson and decides the two-sided calibration.

---

## Fixed traits (always true, all modules)

- Working programmer. Comfortable with code, terminal, JSON, APIs, git, day-to-day dev.
  Does **not** need CLI / JSON / API / HTTP / SDK / IDE / CI/CD / PoC / LLM expanded —
  doing so reads as condescending.
- New-ish to *AI-assisted development as a discipline*. Has used a chatbot and maybe an
  agent; the engineering practice around it is what they came to learn.
- Slop-sensitive. Has read a lot of AI prose; emdash overuse, payload-free voice asides,
  "X, not Y" thesis headings, dramatic metaphors, and summary-announcing all cost the
  author credibility fast.
- Motivated but busy. Keeps reading only while the text earns it; skims when bored,
  bails when lost.

## Module-entry knowledge (already known by the time they reach ANY m5 lesson)

By module 5 the learner has completed **prework + main course m1–m4**. Treat all of the
following as *theirs* — re-teaching it from zero is a miscalibration (over) defect.

**From prework** (`workbench/references/prework.md`):
- model / agent / harness layers and tool use [1.2]
- IDE vs terminal vs cloud agent tradeoffs [2.x]
- prompt-as-contract, context engineering, LLM token mechanics, model selection [3.x]
- agent-friendly stack criteria; good-vs-bad course project; **CI/CD baseline** and the
  "smallest useful flow before a big product" intuition [4.x]

**From the main course m1–m4:**
- the full solo 10x loop and its commands: `/10x-shape` → `/10x-prd` → `/10x-roadmap`
  → `/10x-research` → `/10x-plan` → `/10x-implement` (PRD via Socratic method, roadmap,
  plan/review/implement, bootstrap, onboarding, localhost→prod) — m1, m2
- AI quality & maintenance: test plans, unit/E2E with the agent, hooks/triggers,
  AI-assisted debugging — m3
- large-scale & legacy: context scaling, project mapping, feature analysis, refactor
  with the agent, **DDD distillation at prompt/plan level** (ubiquitous language,
  invariant→aggregate, ACL, Event Storming) — m4

**Half-familiar callback (do NOT assume owned):** *The Mom Test* / behavior-based feedback
is `referencesOnly` from **10xDevs 2 / Opanuj Frontend AI Edition**. A 10xDevs-3-only
learner may never have met it — a lesson reintroducing it must teach the core inline and
treat it as a validation checkpoint, not assume prior ownership.

## Intra-module knowledge (what earlier m5 lessons make "already known")

When reviewing a later m5 lesson, the learner owns the `owns` of every prior m5 lesson it
`dependsOn`. Pull the exact `owns` per review, but the module spine is:

- **m5-l1** — build-vs-buy-vs-complement frame; SaaS as platform *responsibility* (not a
  feature list); team friction as the internal-builder signal; the **opportunity-map**
  artifact (friction → SaaS/default → thin helper → first useful version → later M5 path);
  the "first useful version = narrow read-only helper" rule; internal-builder leverage
  (trust, not promotion); the 10xChampion **screenshot-evidence** package.
- **m5-l2** — Twój pierwszy Agent zespołowy: SDK, koszty, integracja *(owns TBD — pull live)*
- **m5-l3** — Code Review w erze AI: standardy, DoD, Agent w pipeline *(owns TBD — pull live)*
- **m5-l4** — Shared AI Registry: skille, komendy i reguły dla zespołu *(owns TBD — pull live)*
- **m5-l5** — Innovate: Async & Remote Agents *(owns TBD — pull live; see memory note
  m5l5-vs-m2l5-boundary)*

So e.g. when reviewing m5-l2+, the learner already classifies friction with an opportunity
map and knows the complement-not-replace discipline — re-deriving m5-l1's frame would be a
miscalibration (over) finding.

## How to use this cache in a run

1. Load this file for fixed traits + module-entry knowledge (above).
2. Run `lesson-context.mjs <lessonId>` for the target's `owns` (= **new here**),
   `dependsOn` (intra-module already-known), `preparesFor` (expected-later-not-now).
3. Compose the per-lesson persona = (this base) + (prior m5 `owns` it depends on)
   as *already known*, and (target `owns`) as *new here*.
4. Cold-read as usual. The signature lens is unchanged: over-explaining the base above is
   as much a defect as under-explaining the target `owns`.

---

*Maintenance: when an m5 lesson's `owns` finalizes (status → drafted/grounded), replace its
"owns TBD — pull live" line above with the actual owned concepts so the intra-module
already-known set stays accurate. Keep this file in sync with `lessons-schema.json`.*
