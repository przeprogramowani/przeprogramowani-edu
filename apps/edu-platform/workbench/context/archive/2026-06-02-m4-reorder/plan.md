# Module 4 Reorder — context-scaling becomes m4-l1 Implementation Plan

## Overview

Promote the context-scaling lesson (currently schema slot `m4-l5`, "Skalowanie kontekstu dla AI w dużych projektach") to the FIRST lesson of Module 4 (`m4-l1`) so it acts as the foundation for the rest of the module, and cascade the four legacy lessons down one slot. This is a coordinated change across three artifacts: the curriculum contract (`lessons-schema.json`), the on-disk lesson folders under `lessons/`, and an author handoff note. Editorial workbench only — no `src/content*`, no platform/deployment touch.

## Current State Analysis

Module 4 lives in `lessons-schema.json` at lines 4247–4728 (module `m4`, `order: 4`). The five lessons today:

| Slot (lessonId) | Content | globalOrder / moduleOrder | dependsOn | preparesFor |
|---|---|---|---|---|
| m4-l1 | project-map ("Nowy-stary projekt? Agent zbuduje Ci mapę…") | 16 / 1 | `[m3-l5]` | `[m4-l2]` |
| m4-l2 | feature-analysis ("Analiza feature z AI…") | 17 / 2 | `[m4-l1]` | `[m4-l3]` |
| m4-l3 | refactoring ("Refaktoryzacja z Agentem…") | 18 / 3 | `[m4-l2]` | `[m4-l4]` |
| m4-l4 | DDD-legacy ("Modernizacja legacy z DDD…") | 19 / 4 | `[m4-l3]` | `[m4-l5]` |
| m4-l5 | **context-scaling** (fully enriched: owns/referencesOnly/mustNotCover/learningOutcomes/requiredFragments/videoPlaceholders/groundingSources/sideEffectLedger all populated) | 20 / 5 | `[m4-l4]` | `[m5-l1]` |

Boundaries: `m3-l5.preparesFor = [m4-l1]` (schema line 4008–4010); `m5-l1.dependsOn = [m4-l5]` (line 4742–4744).

On disk, only two folders exist (verified): `lessons/m4-l5/` (the rich context-scaling bundle — `lesson-draft.md`, `lesson-grounding.md`, `lesson-spec.md`, `positioning-and-certification.md`, `rc-review.md`, `research/`) and `lessons/m4-l4/` (the DDD/legacy lesson — `lesson-2ed-draft.md`, `notes.md`). Folders `m4-l1/`, `m4-l2/`, `m4-l3/` do NOT exist — so the collision change.md worried about is stale. All files in both folders are git-tracked (no untracked stragglers).

### Key Discoveries

- **The schema file is canonically formatted** — `JSON.stringify(JSON.parse(content), null, 2) + "\n"` round-trips byte-identical (verified). A deterministic Node transform that re-serializes the whole file therefore produces a diff scoped to only the bytes that actually changed, and guarantees a parse-valid result.
- **Boundary links are slot-stable** — `m3-l5.preparesFor` already points at slot `m4-l1` and `m5-l1.dependsOn` already points at slot `m4-l5`. These slots stay the first/last of Module 4, so the boundary fields need NO edit; only their *meaning* shifts (m3-l5 now prepares for context-scaling; m5-l1 now depends on DDD). The DDD object acquiring `preparesFor: [m5-l1]` is handled inside its own renumber, not as a separate boundary edit.
- **One stale internal path lives inside the context lesson's `groundingSources`** (schema line 4688): `"url": "workbench/lessons/m4-l5/research/repo-case-studies.md"`. The folder move breaks it. Decision (this session): fix it mechanically to `workbench/lessons/m4-l1/research/repo-case-studies.md` — a path consequence of the move, not a prose reword.
- **The context-scaling content arrays are already reorder-aware** (`change.md:23`): they reference "m4-l2…m4-l5 po renumber", "fundament", "foundation altitude". They must NOT be reworded — the transform touches only the 5 structural fields on that object plus the single groundingSources URL.
- **Folder moves are collision-free in a fixed order**: `m4-l5 → m4-l1` (target free), then `m4-l4 → m4-l5` (now free). `git mv` preserves history.

## Desired End State

Module 4 in `lessons-schema.json` reads, top-to-bottom, m4-l1 → m4-l5 with this ladder:

| Slot | Content | global / module | dependsOn | preparesFor |
|---|---|---|---|---|
| m4-l1 | context-scaling | 16 / 1 | `[m3-l5]` | `[m4-l2]` |
| m4-l2 | project-map | 17 / 2 | `[m4-l1]` | `[m4-l3]` |
| m4-l3 | feature-analysis | 18 / 3 | `[m4-l2]` | `[m4-l4]` |
| m4-l4 | refactoring | 19 / 4 | `[m4-l3]` | `[m4-l5]` |
| m4-l5 | DDD-legacy | 20 / 5 | `[m4-l4]` | `[m5-l1]` |

The context-scaling object retains every content array verbatim (only `lessonId/globalOrder/moduleOrder/dependsOn/preparesFor` changed + the one groundingSources URL). `lessons/m4-l1/` holds the context-scaling bundle; `lessons/m4-l5/` holds the DDD bundle. A `review-notes.md` in the change folder records the author handoff. `change.md` status is `implemented`.

Verify: `node -e "JSON.parse(...)"` succeeds; the ladder table above holds when queried programmatically; boundaries unchanged; `lessons/m4-l1/research/repo-case-studies.md` exists and the groundingSources URL matches it.

## What We're NOT Doing

- NOT rewording any content array on the context-scaling lesson (owns, referencesOnly, mustNotCover, learningOutcomes, requiredFragments, videoPlaceholders, groundingSources prose, sideEffectLedger) — only the 5 structural fields + the single research path.
- NOT changing `status` fields on any lesson (not in scope; `status` is not a structural-order field).
- NOT touching `src/content*`, Circle IDs, frontmatter, generated HTML, or any deployment config.
- NOT editing lessons outside Module 4 (except the two slot-stable boundary fields, which are verified to need no change).
- NOT resolving the context lesson's open `needsHumanDecision` (certification-form wording) — that stays as-is.
- NOT drafting or restructuring any legacy lesson content — review-notes are advisory only.
- NOT auditing the four cascaded lessons exhaustively — per decision, the review focuses on the m4-l1 → m4-l2 flow; the rest get a brief spot-check.

## Implementation Approach

Phase 1 mutates the contract deterministically via an inline Node transform (no committed script): parse → remap by *original* lessonId → re-sort `lessons` by `moduleOrder` → fix the one groundingSources URL → re-serialize canonically → verify. Phase 2 relocates the two real folders with ordered `git mv` and stamps the positioning doc. Phase 3 writes the author handoff note. The phases are independently committable; schema-before-folders keeps the groundingSources URL fix in the same commit as the rest of the schema work even though the path only becomes physically correct after Phase 2.

## Critical Implementation Details

- **Remap by original id, not in place.** The transform must read all five objects' original `lessonId` first, then assign new structural fields from a fixed table — otherwise a naive in-loop rename double-maps (e.g. m4-l1→m4-l2 then m4-l2→m4-l3 collides). Build the new-values table keyed by *original* lessonId, apply in one pass, then sort.
- **Re-serialize must match canonical form exactly:** `JSON.stringify(data, null, 2) + "\n"`. Anything else (missing trailing newline, 4-space indent) churns the whole file.

## Phase 1: Schema renumber + dependency rewiring

### Overview

Apply the reorder to `lessons-schema.json`: renumber the five Module-4 objects' structural fields, re-sort the array so it reads m4-l1→m4-l5, and fix the one stale groundingSources path. Content arrays stay verbatim.

### Changes Required

#### 1. Module-4 structural fields + array order

**File**: `lessons-schema.json` (module `m4`, lines ~4247–4728)

**Intent**: Move the context-scaling object to the front of the module and cascade the four legacy objects down, renumbering each object's order/identity/dependency fields so the linear chain m3-l5 → m4-l1(context) → m4-l2(project-map) → m4-l3(feature) → m4-l4(refactor) → m4-l5(DDD) → m5-l1 holds. Re-sort the `lessons` array by `moduleOrder` so array order matches lesson order.

**Contract**: The remap table, keyed by *original* `lessonId`:

| Original id | → lessonId | globalOrder | moduleOrder | dependsOn | preparesFor |
|---|---|---|---|---|---|
| m4-l5 (context) | m4-l1 | 16 | 1 | `[m3-l5]` | `[m4-l2]` |
| m4-l1 (project-map) | m4-l2 | 17 | 2 | `[m4-l1]` | `[m4-l3]` |
| m4-l2 (feature) | m4-l3 | 18 | 3 | `[m4-l2]` | `[m4-l4]` |
| m4-l3 (refactor) | m4-l4 | 19 | 4 | `[m4-l3]` | `[m4-l5]` |
| m4-l4 (DDD) | m4-l5 | 20 | 5 | `[m4-l4]` | `[m5-l1]` |

All other fields on each object (title, status, owns, referencesOnly, mustNotCover, learningOutcomes, requiredFragments, videoPlaceholders, groundingSources prose, sideEffectLedger, requiredArtifacts) are carried verbatim. Applied via an inline Node transform that reads originals, applies the table in one pass, sorts `lessons` by `moduleOrder`, and writes `JSON.stringify(data, null, 2) + "\n"`.

#### 2. Stale groundingSources research path

**File**: `lessons-schema.json` (context lesson, original line 4688)

**Intent**: Repoint the internal-course-material URL to the lesson's new folder so it stays valid after the Phase-2 move.

**Contract**: `"url": "workbench/lessons/m4-l5/research/repo-case-studies.md"` → `"workbench/lessons/m4-l1/research/repo-case-studies.md"`. The transform performs this string replacement on the context object (now at m4-l1). No other groundingSources field changes.

### Success Criteria

#### Automated Verification:

- JSON parses cleanly: `node -e "JSON.parse(require('fs').readFileSync('lessons-schema.json','utf8'))"`
- Ladder holds: a verification script confirms each Module-4 slot's `lessonId/globalOrder/moduleOrder/dependsOn/preparesFor` exactly match the Desired End State table, and that the `lessons` array is sorted by `moduleOrder`.
- Boundaries intact: `m3-l5.preparesFor === ["m4-l1"]` and `m5-l1.dependsOn === ["m4-l5"]`.
- groundingSources URL on m4-l1 reads `workbench/lessons/m4-l1/research/repo-case-studies.md`; no remaining `lessons/m4-l5/research` references inside the m4-l1 object.
- Content untouched: the context object's `owns`/`learningOutcomes`/`mustNotCover` arrays are byte-identical to their pre-change values (diff shows only structural-field + URL + array-position changes).
- `git diff --stat` shows `lessons-schema.json` as the only modified file in this phase.

#### Manual Verification:

- Spot-read the reordered module top-to-bottom in the schema; the five titles appear in the new order with sensible dependsOn/preparesFor.
- The context-scaling lesson's prose arrays still read as written (no accidental truncation from the re-serialize).

**Implementation Note**: After automated verification passes, pause for manual confirmation before the phase commit (deferred per this run's instruction — see Progress).

---

## Phase 2: Folder relocation

### Overview

Relocate the two real lesson folders to their new slots and stamp the decision doc as executed.

### Changes Required

#### 1. Ordered folder moves

**Files**: `lessons/m4-l5/` → `lessons/m4-l1/`, then `lessons/m4-l4/` → `lessons/m4-l5/`

**Intent**: Put the context-scaling bundle in `m4-l1/` (its new slot) and the DDD bundle in `m4-l5/` (its new slot), preserving git history. Order matters: move context out of `m4-l5` first so `m4-l4`→`m4-l5` has a free target.

**Contract**: `git mv lessons/m4-l5 lessons/m4-l1` then `git mv lessons/m4-l4 lessons/m4-l5`. No file contents change in this step (rename only). The `m4-l1/research/repo-case-studies.md` path now exists, matching the URL set in Phase 1.

#### 2. Stamp positioning doc as executed

**File**: `lessons/m4-l1/positioning-and-certification.md` (moved from `m4-l5/`)

**Intent**: Resolve the doc's own "Pending (do NOT do without explicit confirmation)" section by noting the reorder was executed, so the doc no longer reads as a still-pending decision. Light touch — a dated one-line execution banner near the Pending block; do not rewrite the historical decision capture.

**Contract**: Add a short note (e.g. under or replacing the "Pending" heading) stating the schema/folder renumber was executed on 2026-06-02 via the `m4-reorder` change, with the lesson now at slot `m4-l1`. Prose otherwise unchanged.

### Success Criteria

#### Automated Verification:

- `lessons/m4-l1/` exists and contains `lesson-draft.md`, `lesson-grounding.md`, `lesson-spec.md`, `positioning-and-certification.md`, `rc-review.md`, `research/repo-case-studies.md`.
- `lessons/m4-l5/` exists and contains `lesson-2ed-draft.md`, `notes.md` (the DDD bundle).
- `lessons/m4-l4/` no longer exists.
- `git status` shows the moves as renames (`git diff --cached -M --stat` after staging shows R entries), confirming history preservation.
- The Phase-1 groundingSources URL now resolves to an existing file (`test -f lessons/m4-l1/research/repo-case-studies.md`).

#### Manual Verification:

- Open `lessons/m4-l1/positioning-and-certification.md`; the execution stamp reads correctly and the decision capture is intact.

**Implementation Note**: After automated verification passes, pause for manual confirmation before the phase commit (deferred per this run's instruction).

---

## Phase 3: Author review-notes

### Overview

Write an advisory handoff note for the author, focused on whether the new m4-l1 (foundation) → m4-l2 (project-map) flow reads correctly now that context-scaling comes first, with a brief spot-check of the other three cascaded lessons.

### Changes Required

#### 1. Review-notes document

**File**: `context/changes/m4-reorder/review-notes.md` (new)

**Intent**: Give the author a concise, actionable read on the reorder's editorial consequences — primarily the foundation→project-map handoff, secondarily a no-blocker spot-check of feature-analysis/refactoring/DDD in their new slots.

**Contract**: A short markdown doc with: (a) a one-paragraph summary of the executed reorder; (b) a focused section on the m4-l1 → m4-l2 transition — does the context-scaling foundation set up the project-map lesson, does project-map's framing/altitude still read right as the second (not first) lesson of the module, any forward-reference that now reads oddly; (c) a brief per-lesson spot-check verdict for m4-l3/m4-l4/m4-l5 (expected: "fits, no blocker"), flagging only anything that genuinely reads wrong; (d) explicit callouts of open items deliberately not resolved here (the context lesson's certification-form `needsHumanDecision`; the four legacy lessons still being unwritten stubs). Editorial judgement only — no schema or lesson-content edits.

### Success Criteria

#### Automated Verification:

- `context/changes/m4-reorder/review-notes.md` exists and is non-empty.
- It contains a dedicated m4-l1 → m4-l2 flow section and a spot-check for each of m4-l3/m4-l4/m4-l5.

#### Manual Verification:

- The author reads the notes and agrees the m4-l1 → m4-l2 flow assessment is sound and the spot-check verdicts are reasonable.

**Implementation Note**: After automated verification passes, pause for manual confirmation before the phase commit (deferred per this run's instruction).

---

## Testing Strategy

### Automated checks:

- JSON validity + ladder assertion script (Phase 1).
- Filesystem assertions on folder contents and rename detection (Phase 2).
- File-existence/section grep on review-notes (Phase 3).

There is no application build/test surface here — this is workbench editorial data, not platform code. `npm run check / vitest / build` are NOT relevant and are intentionally omitted.

### Manual Testing Steps:

1. Read Module 4 in `lessons-schema.json` top-to-bottom; confirm the five titles and dependency links match the Desired End State table.
2. Confirm the context-scaling lesson's content arrays are unchanged (skim owns/learningOutcomes).
3. Confirm `lessons/m4-l1/` (context) and `lessons/m4-l5/` (DDD) hold the right bundles.
4. Read `review-notes.md` and sanity-check the m4-l1 → m4-l2 flow assessment.

## Migration Notes

No data migration. Folder moves use `git mv` to preserve history. The reorder is reversible by inverting the remap table and the folder moves.

## References

- Change identity & scope: `context/changes/m4-reorder/change.md`
- Decision source: `lessons/m4-l5/positioning-and-certification.md` (moves to `lessons/m4-l1/` in Phase 2)
- Paired change: `context/changes/m4-l1-bootstrap` (drafts the new M4-L1 from research)
- Schema region: `lessons-schema.json:4247-4728` (module m4), boundaries at `:4008-4010` (m3-l5) and `:4742-4744` (m5-l1)

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Schema renumber + dependency rewiring

#### Automated

- [x] 1.1 JSON parses cleanly — a3c7c32d
- [x] 1.2 Ladder holds: each Module-4 slot matches the Desired End State table and array is sorted by moduleOrder — a3c7c32d
- [x] 1.3 Boundaries intact: m3-l5.preparesFor === ["m4-l1"], m5-l1.dependsOn === ["m4-l5"] — a3c7c32d
- [x] 1.4 groundingSources URL on m4-l1 repointed to lessons/m4-l1/research/repo-case-studies.md; no m4-l5/research refs remain in that object — a3c7c32d
- [x] 1.5 Context object content arrays unchanged (diff scoped to structural fields + URL + array position) — a3c7c32d
- [x] 1.6 git diff --stat shows lessons-schema.json as the only modified file — a3c7c32d

#### Manual

- [x] 1.7 Spot-read reordered module: five titles in new order, sensible deps — a3c7c32d
- [x] 1.8 Context-scaling prose arrays read intact (no re-serialize truncation) — a3c7c32d

### Phase 2: Folder relocation

#### Automated

- [x] 2.1 lessons/m4-l1/ exists with the context bundle (incl. research/repo-case-studies.md) — 4ef4c912
- [x] 2.2 lessons/m4-l5/ exists with the DDD bundle (lesson-2ed-draft.md, notes.md) — 4ef4c912
- [x] 2.3 lessons/m4-l4/ no longer exists — 4ef4c912
- [x] 2.4 Moves recorded as git renames (history preserved) — 4ef4c912
- [x] 2.5 Phase-1 groundingSources URL resolves to an existing file — 4ef4c912
- [x] 2.6 positioning-and-certification.md stamped as executed, decision capture intact — 4ef4c912

#### Manual

- [x] 2.7 Open positioning doc: execution stamp correct, capture intact — 4ef4c912

### Phase 3: Author review-notes

#### Automated

- [x] 3.1 context/changes/m4-reorder/review-notes.md exists and is non-empty — 7040c311
- [x] 3.2 Contains m4-l1 → m4-l2 flow section and spot-check for m4-l3/m4-l4/m4-l5 — 7040c311

#### Manual

- [x] 3.3 Author agrees the m4-l1 → m4-l2 flow assessment and spot-check verdicts are sound — 7040c311
