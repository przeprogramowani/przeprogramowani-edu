# M4L1 Multi-repo Deep Dive Guardrails — Plan Brief

> Full plan: `context/changes/multirepo-m4l1/plan.md`
> Frame brief: `context/changes/multirepo-m4l1/frame.md`

## What & Why

> **The actual problem to plan around is**: not *how much* multi-repo (a volume knob), but *which additions are orientation-guardrails (cheap, universal, low-rot, prevent wrong turns = the 20% that unlocks) versus operational depth (repo-specific, scope-expanding, M5L3-bound = the 80% to leave to practice)* — and to add only the former.

A forum thread surfaced three proposed insertions for M4L1's multi-repo Deep Dive. The frame sorted them; this plan applies the sort: two guardrails in full, one as a compressed pointer, plus one tension-resolving line the frame left open.

## Starting Point

Multi-repo lives in an optional Deep Dive (`lesson-draft.md:367-400`) with three layers and a hard boundary deferring build-out to M5L3. The `m5-l3` schema entry is still empty. The draft is past comments review — only the Deep Dive should change.

## Desired End State

The Deep Dive carries four awareness-level guardrails: the static-meta-context instinct is named and refuted (A), Layer 2 distinguishes harmless fact duplication from rules-layer copy-paste, the contract-as-artifact pattern is named in two sentences with an M5L3 address (B), and the coupling smell bridges to m4-l5 (C). The m5-l3 schema entry delegates conceptual framing back to m4-l1. Edits are editor-polished and RC-verified.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Sorting rule | Guardrails in, operational depth out | Maintenance burden under tight effort budget is the governing axis, not learner demand | Frame |
| Insertion A | Add in full (~100w) | Refutes the OP's actual misconception; machinery already in the draft | Frame |
| Insertion C | Add as one sentence | M4L1 owns the signal, m4-l5 owns the analysis; zero overlap | Frame |
| Insertion B | **Two sentences** (name + minimal shape), not one | Slightly more actionable for the learner who needs it now — deliberate override of the frame's stricter one-sentence call | Plan |
| Duplication tension | Add one-line distinction in Layer 2 | Cheap guardrail in the same spirit as A/C; removes real reader-facing friction | Plan |
| Plan scope | Draft edits + m5-l3 schema back-ref; **no forum reply** | Closes the schema-coupling loop; the reply is a different medium tracked separately | Plan |
| m5-l3 edit shape | `referencesOnly` seed only, no `dependsOn` change | Dependency links are curriculum decisions; not sanctioned here | Plan |
| Terminus | Edits → lesson-editor-pl → lesson-rc-review | Frame mandate + house rule (editor before review, never parallel) | Frame |

## Scope

**In scope:** four Deep Dive insertions, m5-l3 `referencesOnly` seed, scoped editor pass, RC review.

**Out of scope:** operational cross-service walkthrough (M5L3), forum reply to Tomasz, M5L3 spec/draft authoring, any main-thread M4L1 changes, `dependsOn` changes.

## Architecture / Approach

All content lands inside the existing Deep Dive arc: nesting limit → **A** (anti-pattern refuted) → three layers (**dup-distinction** in Layer 2) → contract sources → **B pointer** → **C warning** → M5L3 boundary (untouched). Base prose exists in the impact analysis §6; B gets compressed. Then two sequential skill runs (editor, RC).

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Deep Dive insertions | Four guardrails in the draft | B creeping past two sentences into M5L3 scope |
| 2. M5L3 schema back-ref | One `referencesOnly` seed in m5-l3 | Wording drifting from actual Deep Dive content |
| 3. Editorial polish | Seamless house-voice prose | Editor churning settled prose outside the section |
| 4. RC verification | Pass verdict / resolved findings | RC flagging boundary issues → loop back |

**Prerequisites:** none — all inputs exist (frame, impact analysis, draft, schema).
**Estimated effort:** 1–2 sessions; net content ≈ one short paragraph + three sentences.

## Open Risks & Assumptions

- The B two-sentence choice is a deliberate notch past the frame's recommendation — RC review should explicitly check it didn't drift into operational territory.
- Demand evidence for B rests on an editorial paraphrase of the forum thread, not the raw thread — irrelevant to this plan since B is pointed, not built (frame's noted soft spot).
- The forum reply to Tomasz remains an open loop outside this change.

## Success Criteria (Summary)

- A multi-repo practitioner leaves the Deep Dive with named patterns and forward addresses (M5L3, m4-l5) instead of abstractions; an MVP builder passes through without drowning.
- The M5L3 boundary paragraph and `m4-l1 mustNotCover` are intact; m5-l3 schema explicitly inherits the division of labor.
- RC review passes with no blocking findings on the additions.
