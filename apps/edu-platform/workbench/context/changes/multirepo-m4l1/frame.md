# Frame Brief: How much multi-repo should M4L1 deliver?

> Framing step before /10x-plan. Captures what is *actually* at issue —
> separated from what was initially assumed.

## Reported Observation

M4L1's multi-repo treatment already lives in an **optional Deep Dive**
(`lessons/m4-l1/lesson-draft.md:367-400`): three layers (universal org/user
rules → distribution via shared package/CLI → cross-repo contract queried at
runtime) + a hard boundary deferring build-out to M5L3. An impact analysis of a
forum thread (`context/changes/multirepo-m4l1/multirepo-forum-m4l1-impact.md`) flags three
"material gaps" and recommends adding insertions A/B/C to that Deep Dive. The
author must decide how much multi-repo M4L1 should carry.

## Initial Framing (preserved)

- **User's stated cause or approach**: Multi-repo is a rabbit hole. Deliver the
  "20% that unlocks," let 3k students — each in a different repo reality
  (company / domain / tech) — discover the 80% in their own practice.
- **User's proposed direction**: Keep multi-repo minimal / orientation-level,
  not exhaustive coverage.
- **Pre-dispatch narrowing**: Scope question answered in the user's own words —
  *"how much MORE scope do we want to be responsible for; everything takes time
  and I don't have much to prepare this lesson, at the same time I want it good,
  practical, and answering the most important student questions."* Audience =
  **50/50** single-repo MVP builder ↔ multi-repo practitioner. Failure worry =
  **both equally** (over-delivering drowns the MVP thread; under-delivering
  leaves the multi-repo learner with abstractions). → The real axis is
  **scope-responsibility / maintenance burden under a tight effort budget**,
  not raw pedagogical depth.

## Dimension Map

The "how much" decision originates at five dimensions:

1. **Maintenance surface** — does the addition expand what M4L1 must keep true
   over time (tool-specific mechanics that rot; scope M5L3 should own)? ←
   *user's stated constraint lands here*
2. **Unlock-per-sentence** — does it cheaply prevent a wrong turn / answer a top
   student question?
3. **Schema ownership** — stays in M4L1 `owns` (awareness) or steals M5L3
   (build-out) / M4L5 (DDD)?
4. **Audience coverage (50/50)** — serves both halves, or only one?
5. **Already-covered** — real gap, or implicitly answered already?  ← *initial
   framing's blind spot: assumed "add the gaps"; reality is mixed.*

## Hypothesis Investigation

| Hypothesis (per insertion) | Evidence | Verdict |
| --- | --- | --- |
| **A** (refute static meta-context, argue dynamic) is a cheap universal guardrail | Coverage: PARTIAL/implicit, just needs *naming* — `draft:77` (JIT), `draft:368-379` (Layer 3 runtime query); ~100w; LOW-rot. Demand: strong runner-up, refutes OP's *actual* misconception (`impact:11,21,60`), "free strong teaching moment". Boundary: safely M4L1 `owns` "świadomość multi-repo". | **STRONG — add** |
| **C** (coupling smell → DDD signal) is a cheap universal guardrail | Coverage: ABSENT but ~60w, LOW-rot (`draft:143-149` has escalation signals but not the cross-repo→coupling leap). Boundary: M4L1 owns the *signal*, M4L5 owns the *analysis* (`schema m4-l5 owns`: Bounded Contexts / Context Mapping); zero overlap, bridges forward. Demand: thinnest (single commenter, not echoed). | **STRONG (cheap) — add** |
| **B** (cross-service feature workflow, contract-as-artifact handoff) should be fully built in M4L1 | Demand: **#1 pressed pain**, OP's "sedno" (`impact:30`), echoed by 2nd person w/ concrete recipe (`impact:44`), "najczęstszy realny ból" (`impact:58`). BUT Coverage: ABSENT, operational. Boundary: **steals downstream** — pre-empts M5L3 build-out (`schema m4-l1 mustNotCover`: "budowa… dystrybucji paczek (M5-L3)") and/or M4L5 coupling. It is the most repo-variable content = the user's "80%". | **WEAK as full build / STRONG as a named pointer** |

## Narrowing Signals

- The user reframed the question from "depth" to **"scope I'm responsible for,
  under a time budget"** — this makes maintenance-rot and downstream-overlap the
  governing axes, not raw learner demand.
- 50/50 audience + both-failures-equal → the answer must be *universal
  guardrails* (serve everyone cheaply), not *operational depth* (serves only the
  multi-repo minority, and only those shipping cross-service features now).
- Independent demand pass and independent boundary pass **disagreed on B**
  (highest demand ↔ steals scope / most repo-specific). That disagreement is the
  reframe: B is precisely the 80%-to-leave-to-practice.

## Cross-System Convention

The draft already enforces this exact altitude convention at `draft:400`: it
gives the *shape* of the multi-repo solution and explicitly hands *build-out* to
M5L3 ("To realny problem tylko dla firm pracujących na wielu repozytoriach"). A
and C extend that established awareness-altitude; a full B walkthrough would
break it by importing operational, repo-specific build content one lesson early.

## Reframed (or Confirmed) Problem Statement

> **The actual problem to plan around is**: not *how much* multi-repo (a volume
> knob), but *which additions are orientation-guardrails (cheap, universal,
> low-rot, prevent wrong turns = the 20% that unlocks) versus operational depth
> (repo-specific, scope-expanding, M5L3-bound = the 80% to leave to practice)* —
> and to add only the former.

The initial framing held up and the evidence sharpens it into a sorting rule.
Applying it: **add A** (name + refute the static-meta-context instinct — highest
leverage, the OP's real misconception, near-free because the machinery already
exists), **add C** (one-sentence coupling-smell signal bridging to M4L5), and
for **B**, give a **named pointer only** — one sentence naming the
"contract-as-an-artifact-passed-between-agents" pattern with a forward-ref to
M5L3, *not* an operational walkthrough. The pointer captures most of B's unlock
value (the learner now knows the pattern and its name and can pursue it) at ~1
sentence and zero added maintenance surface, while the repo-specific sequence
stays where it belongs: the learner's practice and M5L3.

This threads the 50/50 / both-failures-equal needle: A+C cure under-delivery
cheaply for *everyone*; the B-pointer acknowledges the multi-repo minority's #1
question without over-delivering or expanding what M4L1 must maintain.

Honest tension surfaced (not buried): the **highest-demand** item is the one
recommended *not* to fully build. That is a deliberate altitude call —
demand says "give them B"; the user's stated philosophy, the effort/scope
constraint, and the schema boundary all say "B is the 80%, point don't build."
If the author later decides B's full operational pattern is worth the scope, the
correct home is M5L3, not M4L1.

## Confidence

**HIGH** — three independent passes converged; the one disagreement (demand vs
scope on B) is itself the reframe and resolves cleanly toward the user's stated
altitude; all recommendations are schema-backed (`m4-l1 owns` / `mustNotCover`,
`m4-l5 owns`) and LOW-rot. The only soft spot: demand evidence rests on a
second-hand editorial paraphrase of the forum thread, not the raw thread
(no raw thread exists in-repo) — but this only affects B's demand ranking, and
B is being deferred regardless.

## What Changes for /10x-plan

The plan is **not** "add the three gaps from the impact analysis." It is: add
two cheap universal guardrails (A full, C one sentence) into the existing
Deep Dive, and replace B's proposed operational walkthrough with a one-sentence
named pointer + M5L3 forward-ref. Net scope added to M4L1 ≈ one short paragraph,
not a new subsection. Route the actual edits through `lesson-editor-pl` before
RC (per house workflow), not a raw diff.

## References

- Source files: `lessons/m4-l1/lesson-draft.md:77,143-149,367-400`,
  `context/changes/multirepo-m4l1/multirepo-forum-m4l1-impact.md:11,21,30,44,58,60,89-90`,
  `lessons-schema.json` (m4-l1 `owns`/`mustNotCover`, m4-l5 `owns`, m5-l3 empty)
- Related research: none (impact analysis served as the research input)
- Investigation: 3 parallel read-only agents (draft coverage + rot; forum
  demand ranking; downstream M5L3/M4L5 boundary)
