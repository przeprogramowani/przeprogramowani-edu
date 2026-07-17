# M4L1 Multi-repo Deep Dive Guardrails — Implementation Plan

## Overview

Add four awareness-altitude guardrails to the existing "Multi-repo: świadomość" Deep Dive in M4L1 (`lessons/m4-l1/lesson-draft.md:367-400`), seed a back-reference in the empty `m5-l3` schema entry so M5L3 stays pure-practice, then route the edits through `lesson-editor-pl` and `lesson-rc-review` per house workflow.

This implements the frame's sorting rule (`context/changes/multirepo-m4l1/frame.md`): add only **orientation-guardrails** (cheap, universal, low-rot, prevent wrong turns); leave **operational depth** (repo-specific, M5L3-bound) to practice and M5L3.

## Current State Analysis

- Multi-repo lives exclusively in an optional Deep Dive (`lesson-draft.md:367-400`): three layers (universal rules → distribution → cross-repo contract queried at runtime) + a hard boundary at `lesson-draft.md:400` deferring build-out to M5L3.
- The frame's Hypothesis Investigation (three independent passes, HIGH confidence) sorted the impact analysis' three proposed insertions:
  - **A** (refute static meta-context, argue dynamic) — STRONG, add full (~100w). Machinery already exists at `lesson-draft.md:77` (JIT) and `:377` (Layer 3 runtime query); just needs naming. Refutes the forum OP's actual misconception.
  - **C** (coupling smell → DDD signal) — STRONG, cheap (~60w, one sentence). M4L1 owns the *signal*, m4-l5 owns the *analysis* (Bounded Contexts / Context Mapping); zero overlap.
  - **B** (cross-service feature workflow) — highest demand but steals M5L3 scope (`m4-l1 mustNotCover`: "budowa… dystrybucji paczek (M5-L3)") and is the most repo-variable content. Frame verdict: named pointer, not walkthrough.
- The impact analysis (`context/changes/multirepo-m4l1/multirepo-forum-m4l1-impact.md` §3) additionally flagged an unresolved reader-facing tension: "don't worry about context duplication" (practitioner) vs "copy-paste guarantees drift" (Layer 2, `lesson-draft.md:375`). The frame did not rule on it; planning session decided to resolve it.
- `m5-l3` schema entry is empty (`owns/referencesOnly/mustNotCover/learningOutcomes = []`), `dependsOn: ["m5-l2"]`. No `lessons/m5-l3/` folder exists yet.
- Schema boundaries confirmed: `m4-l1 owns` includes "świadomość multi-repo… build-out odłożony do M5-L3" (`lessons-schema.json:4270`); `m4-l1 mustNotCover` includes Shared AI Registry build-out (`lessons-schema.json:4283`).

## Desired End State

The Deep Dive carries four new awareness-level guardrails in lesson voice, the M5L3 boundary paragraph at `lesson-draft.md:400` remains intact, the `m5-l3` schema entry explicitly delegates conceptual multi-repo framing back to m4-l1, and the modified section has passed `lesson-editor-pl` polish and `lesson-rc-review`.

Verify by: reading the Deep Dive end-to-end (altitude unbroken, no operational walkthrough), `lessons-schema.json` parses, RC review verdict is pass (or its findings are resolved).

### Key Discoveries:

- Insertion A's target sentence "Gdy te same konwencje…" is the *final sentence* of the paragraph at `lesson-draft.md:371` — A must be placed before that sentence, which means splitting the paragraph or inserting a new paragraph boundary there.
- The duplication-distinction belongs inside Layer 2 (`lesson-draft.md:375`), where the "kopiuj-wklej… gwarantuje drift" claim lives.
- B's pointer is conceptually an *instance of Layer 3* ("kontrakt zamiast kopiowanego kontekstu"), so it lands after the OpenAPI/tests paragraph (`lesson-draft.md:398`), not inside the `:400` boundary paragraph.
- Proposed prose for A/B/C already exists in the impact analysis §6 — use it as the base text, but B must be compressed from the full walkthrough to two sentences.
- The draft is already past a comments-review pass (commit `a6cd331f`) — editor churn outside the Deep Dive is unwanted.

## What We're NOT Doing

- **No operational cross-service walkthrough** for B (sequence steps, artifact locations, per-repo PRD layout). That is M5L3's scope and the learner's practice — the frame's central call.
- **No changes to the main MVP thread** of M4L1 — all edits stay inside the optional Deep Dive.
- **No `dependsOn` change** on `m5-l3` — adding `m4-l1` would alter curriculum dependency links, which requires an explicit curriculum decision.
- **No forum reply to Tomasz** in this change — tracked as a separate open loop (user decision).
- **No edits to other lessons' schema entries** beyond the single sanctioned `m5-l3` `referencesOnly` seed.
- **No M5L3 spec/draft authoring** — only the schema back-ref.

## Implementation Approach

Apply the four insertions directly to the draft (Phase 1) using the impact analysis §6 prose as base text, adjusted to the decided altitudes. Make the minimal schema edit (Phase 2). Then run the two house skills sequentially — editor first, RC second, never parallel (Phases 3–4). Each phase ends with a human pause; content phases are judged manually, automated checks are limited to JSON validity and presence greps.

## Critical Implementation Details

**Altitude guard on B.** The user deliberately chose two sentences (name + minimal FE→BE md-handoff shape) — one notch past the frame's one-sentence call. The hard ceiling: no numbered steps, no artifact paths, no tool-specific mechanics. If a draft of B needs a third sentence, it has crossed into M5L3 scope — cut instead.

**Insertion A splits a paragraph.** A goes *before* the sentence "Gdy te same konwencje mają obowiązywać w kilku repo naraz…" at the end of `lesson-draft.md:371`. Keep that sentence as the lead-in to the three-layers list (it sets up the structure that follows); A becomes its own paragraph before it.

**Editor scope must be constrained.** `lesson-editor-pl` should be explicitly scoped to the "Multi-repo: świadomość" section. The rest of the draft already went through comments review (`a6cd331f`) — a whole-file editorial pass would churn settled prose.

**Mermaid block is load-bearing.** The diagram at `lesson-draft.md:381-392` and its `<!-- rendered: … -->` comment must not be moved or re-indented by the insertions — the CDN link is wired to the rendered asset.

## Phase 1: Deep Dive insertions

### Overview

Write the four guardrails into `lessons/m4-l1/lesson-draft.md`, in lesson voice, at awareness altitude, with forward-refs (m4-l5 for C, M5L3 for B).

### Changes Required:

#### 1. Insertion A — refute the static meta-context instinct

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Name and refute the "central meta-context / agentic repo" instinct head-on, arguing the dynamic alternative (distribution + runtime querying) the lesson already teaches. This is the highest-leverage guardrail — it addresses the forum OP's actual misconception.

**Contract**: New paragraph (~100w) inserted before the final sentence of the paragraph at `lesson-draft.md:371` ("Gdy te same konwencje…"), which stays as lead-in to the three layers. Base text: impact analysis §6A (`multirepo-forum-m4l1-impact.md:82`). Must connect to the lesson's existing "gruby monolit" framing ("ta sama pułapka… piętro wyżej") and to JIT/runtime-query machinery already in the draft.

#### 2. Duplication-distinction line — Layer 2

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Resolve the reader-facing tension between practitioner advice ("duplication is fine in distributed systems") and the lesson's drift warning, by distinguishing *a handful of duplicated facts* (fine) from *systematically copying the rules layer* (the drift trap).

**Contract**: One sentence/clause added inside the Layer 2 paragraph (`lesson-draft.md:375`), adjacent to the "Kopiuj-wklej do dwudziestu repo gwarantuje drift" claim. No new paragraph.

#### 3. Insertion B — named pointer (two sentences)

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Acknowledge the #1 pressed pain from the forum (feature spanning multiple services) by *naming* the "kontrakt jako artefakt przekazywany między agentami" pattern and its minimal shape, then deferring build-out to M5L3.

**Contract**: Exactly two sentences after the paragraph at `lesson-draft.md:398`, framed as an instance of Layer 3: (1) name the pattern as the same "kontrakt zamiast kopiowanego kontekstu" principle applied inside a single feature split across services; (2) the minimal shape — the agent finishing on one side (e.g. frontend) generates a short contract artifact you hand to the agent in the second repo — plus a forward-ref that the workflow's build-out lands in M5L3. Compressed from impact §6B (`multirepo-forum-m4l1-impact.md:86`); no numbered steps, no artifact paths.

#### 4. Insertion C — coupling smell

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: One architectural warning: *regularly* needing full context from more than one repo is a coupling smell, not a missing-context-tool problem — bridging forward to DDD/bounded-context analysis.

**Contract**: One sentence (standalone mini-paragraph acceptable) immediately before the boundary paragraph at `lesson-draft.md:400`, with forward-ref to m4-l5. Base text: impact §6C (`multirepo-forum-m4l1-impact.md:90`). The `:400` boundary paragraph itself stays untouched.

#### 5. Side-effect ledger

**Intent**: Report the standard workbench ledger for the content change (new claims: A's "central meta-context rots fastest" argument, the duplication distinction, B's named pattern, C's coupling signal; neighboring refs changed: +m4-l5, +M5L3; potential duplicates: B vs Layer 3 — deliberate, as its instance).

**Contract**: Ledger reported in the implementing session's response (workbench convention), not written into the draft.

### Success Criteria:

#### Automated Verification:

- Deep Dive contains both forward-refs: `grep -n "m4-l5" lessons/m4-l1/lesson-draft.md` matches inside the Deep Dive section, and `grep -n "M5L3" lessons/m4-l1/lesson-draft.md` still matches at the boundary paragraph and the B pointer
- Mermaid block and its `<!-- rendered: -->` comment unchanged: `git diff` for `lesson-draft.md` shows no hunks touching lines 381–392 content

#### Manual Verification:

- All four insertions read in lesson voice and at awareness altitude (no operational steps, no tool mechanics)
- B is exactly two sentences; the boundary paragraph at the section end is intact and still reads as the section's closing
- The Layer 2 duplication distinction resolves the tension without weakening the drift warning
- Insertion A's paragraph split preserves the flow into the three-layers list

**Implementation Note**: After completing this phase and automated checks pass, pause for manual confirmation before proceeding.

---

## Phase 2: M5L3 schema back-ref

### Overview

Seed the empty `m5-l3` schema entry with a single `referencesOnly` item delegating conceptual multi-repo framing to m4-l1, so a future M5L3 spec inherits the division of labor (M4L1 = concepts, M5L3 = build practice).

### Changes Required:

#### 1. `referencesOnly` seed

**File**: `lessons-schema.json`

**Intent**: Make the m4-l1 ↔ m5-l3 division of labor explicit in the schema before M5L3 spec work starts, per the impact analysis recommendation ("M5L3 spec: jawnie zdelegować framing konceptualny do M4L1").

**Contract**: Append one string to `m5-l3.referencesOnly` (currently `[]`), e.g. covering: conceptual multi-repo framing — three layers, contract-as-tool, contract-as-artifact pattern — owned by m4-l1 Deep Dive; assumed and referenced back, not re-taught. Touch only the `m5-l3` object; no `dependsOn` change; no other fields.

### Success Criteria:

#### Automated Verification:

- Schema parses: `python3 -c "import json; json.load(open('lessons-schema.json'))"`
- Diff confined to the `m5-l3` object: `git diff lessons-schema.json` shows a single-array addition

#### Manual Verification:

- The entry's wording matches the actual M4L1 Deep Dive content after Phase 1 (names the same concepts)

---

## Phase 3: Editorial polish (lesson-editor-pl)

### Overview

Run `lesson-editor-pl` scoped to the modified "Multi-repo: świadomość" section to bring the insertions to release-candidate prose quality without churning the rest of the already-reviewed draft.

### Changes Required:

#### 1. Scoped editor pass

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Stylistic integration of the four insertions — remove seams between new and existing prose, enforce house voice.

**Contract**: Invoke the `lesson-editor-pl` skill with explicit instruction to edit only the "Multi-repo: świadomość" section (`### Multi-repo: świadomość` through the boundary paragraph). The editor must not alter factual claims, the B two-sentence ceiling, forward-refs, or the mermaid block.

### Success Criteria:

#### Automated Verification:

- `git diff` for the editor commit touches only the Deep Dive section of `lesson-draft.md`

#### Manual Verification:

- Insertions are indistinguishable in voice from surrounding section prose
- No factual drift introduced by the editor (A's argument, B's pattern name, C's signal preserved)

**Implementation Note**: Pause after the editor pass for author read-through before RC.

---

## Phase 4: RC verification (lesson-rc-review)

### Overview

Run `lesson-rc-review` on the updated draft against schema, spec, grounding, and the impact analysis. Editor must have completed first (house rule: editor before review, never parallel).

### Changes Required:

#### 1. RC review run

**File**: `lessons/m4-l1/rc-review.md` (review output; existing file gets superseded/updated per skill convention)

**Intent**: Verify the Deep Dive additions don't introduce drift, duplication, unsupported claims, or boundary violations — particularly that B stayed at pointer altitude and C doesn't pre-empt m4-l5's DDD analysis.

**Contract**: Invoke `lesson-rc-review` for m4-l1. Findings ordered by severity; any blocking finding loops back to a targeted fix (and re-edit via editor if prose changes), then re-verify.

### Success Criteria:

#### Automated Verification:

- Review artifact exists/updated: `ls lessons/m4-l1/rc-review.md`

#### Manual Verification:

- RC review raises no blocking findings on the Deep Dive additions (or all blocking findings resolved)
- Boundary check passes: no `mustNotCover` violation (Shared AI Registry build-out), no m4-l5 scope theft

---

## Testing Strategy

### Manual Testing Steps:

1. Read the full Deep Dive section start-to-finish — verify a single coherent arc: limits of in-tree nesting → A (anti-pattern named and refuted) → three layers (with duplication distinction in Layer 2) → proven contract sources → B pointer → C coupling warning → M5L3 boundary.
2. Read as the 50/50 audience: does a single-repo MVP builder pass through without drowning? Does a multi-repo practitioner leave with named patterns and forward addresses (M5L3, m4-l5)?
3. Confirm the section still honors `m4-l1 mustNotCover` (`lessons-schema.json:4280-4286`).

## Migration Notes

Not applicable — editorial content change. Rollback = `git revert` of the content commits.

## References

- Frame brief: `context/changes/multirepo-m4l1/frame.md`
- Source analysis: `context/changes/multirepo-m4l1/multirepo-forum-m4l1-impact.md` (§6 base prose, §3 tension, §5 placement)
- Target section: `lessons/m4-l1/lesson-draft.md:367-400`
- Schema boundaries: `lessons-schema.json:4252-4309` (m4-l1), m5-l3 entry (empty, to be seeded)

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Deep Dive insertions

> Amendment (2026-06-04): author rewrote the section ("Multi-repo: wyzwania", commit `629a877e`) and decided to **drop insertions B and C**. A (compressed) and the duplication distinction (managed-vs-unmanaged sync framing) survive in the author's wording. Consequently: 1.1 holds for M5L3 only (the m4-l5 ref left with C); 1.4 and 1.6 are void in their original form and closed as superseded. Phase 2 seed wording and Phase 4 RC expectations follow the rewritten section.

#### Automated

- [x] 1.1 Deep Dive contains both forward-refs (m4-l5, M5L3) via grep — 20e9670d
- [x] 1.2 Mermaid block and rendered comment unchanged in git diff — 20e9670d

#### Manual

- [x] 1.3 All four insertions in lesson voice at awareness altitude — 20e9670d
- [x] 1.4 B is exactly two sentences; boundary paragraph intact — 20e9670d
- [x] 1.5 Layer 2 duplication distinction resolves tension without weakening drift warning — 20e9670d
- [x] 1.6 Insertion A paragraph split preserves flow into three-layers list — 20e9670d

### Phase 2: M5L3 schema back-ref

#### Automated

- [x] 2.1 Schema parses via python json.load — ef0b5ad2
- [x] 2.2 Diff confined to m5-l3 object, single-array addition — ef0b5ad2

#### Manual

- [x] 2.3 Entry wording matches actual M4L1 Deep Dive content — ef0b5ad2

### Phase 3: Editorial polish (lesson-editor-pl)

#### Automated

- [x] 3.1 Editor diff touches only the Deep Dive section

#### Manual

- [x] 3.2 Insertions indistinguishable in voice from surrounding prose
- [x] 3.3 No factual drift introduced by editor

### Phase 4: RC verification (lesson-rc-review)

#### Automated

- [ ] 4.1 Review artifact exists/updated at lessons/m4-l1/rc-review.md

#### Manual

- [ ] 4.2 No blocking RC findings on Deep Dive additions (or all resolved)
- [ ] 4.3 Boundary check passes (no mustNotCover violation, no m4-l5 scope theft)
