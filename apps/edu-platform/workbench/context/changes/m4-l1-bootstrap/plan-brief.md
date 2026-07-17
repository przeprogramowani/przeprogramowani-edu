# M4-L1 Bootstrap — Plan Brief

> Full plan: `context/changes/m4-l1-bootstrap/plan.md`
> Spec: `lessons/m4-l5/lesson-spec.md` · Grounding: `lessons/m4-l5/lesson-grounding.md` · Positioning: `lessons/m4-l5/positioning-and-certification.md`

## What & Why

Draft **M4-L1 — "Skalowanie kontekstu dla AI w dużych projektach"**, the foundation lesson of Module 4 (schema id still `m4-l5` until the parked `m4-reorder`). The lesson is already fully specified; this plan is a **drafting brief** that binds each of the 9 beats to its house section, source(s), concrete example, claims-to-soften, and editorial boundary — so `/lesson-draft` produces the *intended* foundation lesson, not a broad, source-detached one.

## Starting Point

The `m4-l5` schema slot already has `owns`/`referencesOnly`/`mustNotCover`/`learningOutcomes` + 17 beat-mapped `groundingSources`; `videoPlaceholders`/`requiredFragments` are empty (filled at draft time). The spec carries a 9-beat logic map and two failure modes to disarm; the grounding maps every source to a beat and lists exactly what must not be overclaimed. No prose exists yet.

## Desired End State

`lessons/m4-l5/lesson-draft.md`: a Polish, house-style foundation lesson that opens with the Module 4 vision, walks the 9-beat spine with **10xCards as the worked example** and **the learner's own MVP as the application target**, carries three inline mermaid diagrams, pushes heavy tool mechanics + multi-repo into Deep Dive, and closes with the mandatory task + certification throughline (firm prose, flagged TODOs). Schema slot gets `videoPlaceholders`/`requiredFragments`; a side-effect ledger is reported.

## Key Decisions Made

| Decision | Choice | Why | Source |
|---|---|---|---|
| Tool routing | `/10x-plan` produces a binding drafting brief; `/lesson-draft` executes it | Bare `/lesson-draft` goes broad/random; the plan makes the draft deterministic | Plan |
| Demo anchor | **10xCards** (our reference MVP) + cloned case-study repos for at-scale contrast | 10xCards already embodies the taught architecture (82-line root, `context/`, skills) | Plan |
| Narration | Dual-MVP: 10xCards = worked example; *your MVP* = where you apply each move | Matches "single app ⇒ decide architecture at module end" + cert throughline | Plan |
| Certification copy | Write firmly + 3 flagged `TODO(cert)` comments | Form specifics are the one unconfirmed item; ship complete-feeling, surface unknowns | Grounding |
| Diagrams | Inline mermaid only (beats 2/3/5), no SVG/PNG render | Lighter; keeps everything in the draft | Plan |
| Beat 7–8 placement | Tool load/merge mechanics + multi-repo go in **Deep Dive** | Keeps the core spine clean for the MVP audience | Plan |

## Scope

**In scope:** the full Polish draft (intro + 9 beats), 3 inline diagrams, mandatory task + cert section, Deep Dive + Materiały dodatkowe, and `videoPlaceholders`/`requiredFragments` for the `m4-l5` slot.

**Out of scope:** m1-l4 authoring re-teach; legacy-lesson (m4-l2…l5) content; M5-L3 registry build; the `m4-reorder` renumber/folder-move/dep-rewire; diagram rendering; locking cert specifics; the editorial/RC passes.

## Architecture / Approach

Top-down draft in document order across three phases mapping to the canonical structure's three zones: **(1) core spine** (intro + beats 1–6, anchored on 10xCards, diagrams at 2/3/5), **(2) tasks + certification** (beat 9), **(3) Deep Dive + Materiały dodatkowe + schema wiring** (beats 7–8). The plan's beat→source binding table is the contract each phase satisfies.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Core spine (beats 1–6) | Intro + economics + architecture + 10xCards demo + ladder + calibration; 3 diagrams | Drifting into prework theory / a /10x-workflow tutorial; over-weighting big repos |
| 2. Tasks + certification (beat 9) | Mandatory task on learner's MVP + badge one-liner + cert throughline w/ TODOs | Shipping unconfirmed cert details as final; feeling like admin |
| 3. Deep Dive + refs + schema (beats 7–8) | Tool mechanics + multi-repo in Deep Dive; curated links; schema wiring; ledger | Tool-by-tool dump; reviving the two refuted Codex claims |

**Prerequisites:** spec + grounding + positioning (present); `~/code/10xCards` (present); house structure refs (present).
**Estimated effort:** ~1 drafting session across 3 phases, then `/lesson-editor-pl` → `/lesson-rc-review`.

## Open Risks & Assumptions

- Certification form specifics (Builder wording, week-5 timing, report template) are unconfirmed — carried as 3 flagged TODOs; must be resolved before publish.
- Grounding's beat→source map and "soften" list are assumed accurate and complete.
- Case-study repo counts are a single HEAD snapshot (2026-06-02) and will drift — taught as strategy-dependent, never as targets.
- `m4-reorder` runs separately (tomorrow); this draft stays at foundation altitude so relocation is not a rewrite.

## Success Criteria (Summary)

- The draft walks all 9 beats in house structure, with 10xCards as worked example and the learner's MVP as application target, and three correct inline diagrams.
- Every factual claim traces to a `groundingSources` entry and every "soften" item is respected (no hard token number, heuristic thresholds flagged, "88" not observable, refuted Codex claims absent).
- All `mustNotCover` boundaries hold; cert section is firm with three flagged TODOs; schema diff touches only the `m4-l5` slot.
