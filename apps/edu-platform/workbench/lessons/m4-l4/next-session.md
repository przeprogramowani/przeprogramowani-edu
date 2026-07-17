# Next-Session Prompt: m4-l4 (spec rework → grounding delta → draft)

> Copy-paste the block below into a fresh Claude Code session started in
> `projects/edu-platform/workbench/`. It resumes the m4-l4 lesson prep from
> where the 2026-06-05 dry-run sessions ended. All decisions are documented
> on disk; this prompt only orients and sequences.

```text
We are preparing lesson m4-l4 ("Refaktoryzacja z Agentem") in the 10xDevs
workbench. All prior work and decisions are documented on disk. Read in this
order before doing anything:

1. lessons/m4-l4/dry-run.md — the demo rehearsal ledger and SOURCE OF TRUTH
   for the lesson's final shape: §1 reusable prompts (Step A contracts),
   Step A/B/C results, §3 verdict (test-plan → Deep Dive, with reasoning),
   §4 (implementation OUT of lesson scope, with reasoning), §5 spec-rework
   scope, artifacts ledger.
2. lessons/m4-l4/lesson-spec.md — the current spec. PARTIALLY STALE: beats
   7–10, Required Example Or Demo, and learning outcomes still describe an
   older shape (TD-2 as executed slice, test-plan in core, execution on
   screen). The Schema Context / Prework Continuity / boundaries sections
   remain valid.
3. node scripts/lesson-context.mjs m4-l4 — schema contract + neighbors.
4. lessons/m4-l4/lesson-grounding.md — existing grounding brief (REUSE as-is;
   honor its precision caveats: Brooks "essence/accidents", Branch by
   Abstraction = 2007, ADR "non-goals" is our extension, Mikado loop not a
   verbatim quote, Feathers wording = medium confidence).
5. context/changes/m4l4-prep/research.md — original lesson-prep research
   (neighbor boundaries, prework continuity, style contract, tooling spine).
6. Demo evidence (Mattermost checkout, commit 29bab2184):
   /Users/admin/code/mattermost/context/changes/refactor-opportunities/
     {research,plan,plan-brief,refactor-planning-convo}.md
   /Users/admin/code/mattermost/context/foundation/{test-plan,test-plan-convo}.md
   /Users/admin/code/mattermost/context/archive/2026-06-05-wrong-order-test-plan/

Then execute these tasks IN ORDER, pausing for my approval between tasks:

TASK 1 — Copy the demo artifacts into lessons/m4-l4/context/ as the canonical
demo state (per the dry-run artifacts ledger): the refactor-opportunities
change folder (incl. both convo logs), foundation/test-plan.md +
test-plan-convo.md, and the archived wrong-order run. Do not overwrite the
existing post-flow-analysis/ and map/ artifacts.

TASK 2 — Rework lessons/m4-l4/lesson-spec.md to the evidenced final shape.
Present the revised spec in chat for my approval BEFORE writing the file.
The changes, all grounded in dry-run.md:

- Core demo flow (beats 7–10 rework): /10x-research with the reusable
  exploration contract (dry-run §1) producing ranked OPTIONS (no decision) →
  the human READS the report (prework [1.3] beat, named explicitly) →
  /10x-plan as the DECISION GATE (interview Q1 = which opportunity;
  trade-offs challenged) producing a guard-first plan.md → HANDOFF to
  /10x-implement (clipboard command; NOT executed on screen — see dry-run §4
  for the four reasons; the plan itself demonstrates "testy, zmiany,
  weryfikacja" as designed properties).
- Required Example Or Demo: the chosen slice is C4 (manual-layer completeness
  guard + SaveMultiple fix, + C2 sentinel test as a planned quick-win phase).
  TD-2/C2 becomes the INTENTIONALITY/RIGHT-SIZING beat: "guard, don't
  reshape" — rejected as a refactor on commit evidence (27d536b212, 2020
  bulk-insert decision, zero bugs). The ranking-overturn (C2 rejected, C4
  promoted on a REALIZED bug: batch saves silently unindexed) is the lesson's
  strongest proof that history grounding changes decisions.
- Recurring motif across beats: the test-design sharpening thread
  (round-trip → reflect.Kind → sentinel-value identity — each pipeline stage
  caught what the previous missed).
- Beat 8 rewrite: the wrong-order test-plan run stays in CORE as the
  anti-pattern ("tooling without a decision" — generic QA out). /10x-test-plan
  itself moves to a Deep Dive subsection ("Od jednego kroku do kampanii"):
  the campaign extension that ADOPTS the existing plan as rollout Phase 1 and
  orchestrates the ④ backlog (C1 drift gate etc.) — shown as evidence (A/B
  contrast of the two runs), m3-l1 referenced, no interview re-run.
- Learning outcomes: drop "scopes /10x-test-plan to the corridor" and
  "executes one Mikado-leaf slice"; replace with: produces ranked options via
  the reusable exploration contract; reads before deciding; defends the
  decision in the plan interview; produces the guard-first phased plan +
  handoff; knows when to escalate to the test-plan campaign (Deep Dive).
- References Only: /10x-implement mechanics (m2-l2 — handoff only);
  /10x-test-plan (m3-l1 + Deep Dive); keep the rest.
- Video placeholders: segments = Step A exploration run, the reading beat,
  the plan-interview decision gate, the handoff; optional Deep Dive segment =
  the test-plan A/B contrast. Three replay-grade convo logs exist (see
  dry-run ledger).
- Keep: P7 scheduled-posts as the natural DDD bridge-out (the
  business-concepts boundary fired there); all grounding precision caveats;
  the structural-vs-domain boundary with m4-l5.
- Update the schema-enrichment proposal in Open Questions to match this
  shape; leave the two external decisions open (toolkit ID offset: workbench
  m4-l4 = toolkit m4l3; module-04 wiring is empty).

TASK 3 — Grounding delta check (no full re-grounding): the existing
lesson-grounding.md stays authoritative. Verify only: (a) if the reworked
spec quotes Feathers seam/characterization definitions verbatim, re-confirm
wording against the sample PDF first; (b) confirm the spec makes NO hard
AI-refactoring efficacy claim (that dimension is ungrounded — directional
framing only: "AI operationalizes the lens; the human owns the decision").
If a new hard claim crept in, run a targeted /lesson-grounding round for that
claim only.

TASK 4 — Run /lesson-draft m4-l4 using the reworked spec, the grounding
brief, and the demo artifacts as the evidence base. House rules that bit us
before: no inline author citations in Core (names/years → Deep Dive +
Materiały dodatkowe); ≤1 em-dash per 10 lines; section order and Deep Dive
intro per references/lesson-structure.md; lesson refs in diagrams as M4L4
form; Polish prose, English code/skill names.

After the draft: /mermaid render for any diagrams, then the usual chain
(lesson-editor-pl BEFORE lesson-rc-review — never parallel), then
/video-scenario consuming the videoPlaceholders + the three convo logs.
```

## Why this file exists

The 2026-06-05 sessions ran out of context after the dry-run loop (Steps A–C
executed, two verdicts user-confirmed, implementation descoped). Everything
decision-shaped lives in `dry-run.md`; this file only sequences the follow-up
so a fresh session doesn't re-derive or re-litigate settled calls.
