# Module 4 Reorder — context-scaling becomes m4-l1 — Plan Brief

> Full plan: `context/changes/m4-reorder/plan.md`

## What & Why

Promote the context-scaling lesson from the last slot of Module 4 (`m4-l5`) to the first (`m4-l1`) so it acts as the *foundation* for the rest of the module, and cascade the four legacy lessons down one slot. Framing from the decision capture: "We start with a lesson on context scaling (the foundation), then tackle the tasks (the challenges)."

## Starting Point

Module 4 in `lessons-schema.json` has context-scaling at `m4-l5` (fully enriched, reorder-aware content) and four legacy lessons (project-map, feature-analysis, refactoring, DDD-legacy) at `m4-l1`…`m4-l4`. On disk only `lessons/m4-l5/` (context bundle) and `lessons/m4-l4/` (DDD bundle) exist; the other three folders are not yet created.

## Desired End State

Module 4 reads m4-l1(context) → m4-l2(project-map) → m4-l3(feature) → m4-l4(refactor) → m4-l5(DDD), with a clean dependency ladder from `m3-l5` to `m5-l1`. `lessons/m4-l1/` holds the context bundle; `lessons/m4-l5/` holds the DDD bundle. An author handoff note records whether the new foundation→project-map flow reads correctly.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Edit mechanism | Deterministic inline Node transform + re-serialize | Schema is canonical JSON (round-trips byte-identical); guarantees valid, scoped diff | Plan |
| Array ordering | Re-sort `lessons` by `moduleOrder` | Array reads l1→l5 for future editors; safe given canonical file | Plan |
| Stale groundingSources path | Fix mechanically to `m4-l1/research/...` | Folder move breaks the URL; repointing is a path consequence, not a prose reword | Plan |
| Content arrays | Untouched (only 5 structural fields + 1 URL) | They're already reorder-aware; change.md forbids rewording | change.md |
| Boundary links | No edit needed | `m3-l5.preparesFor=[m4-l1]` / `m5-l1.dependsOn=[m4-l5]` are slot-stable | Plan (discovered) |
| Folder moves | `git mv` in order m4-l5→m4-l1 then m4-l4→m4-l5 | Preserves history; collision-free | Plan |
| Review-notes | Light note in change folder, focused on m4-l1→m4-l2 flow | Author: "it will fit, focus mainly on new m4-l1 and m4-l2 flow" | User |

## Scope

**In scope:** Renumber 5 Module-4 objects (id/global/module order + deps); re-sort array; fix 1 groundingSources URL; move 2 folders; stamp positioning doc; write review-notes.

**Out of scope:** `src/content*`, deployment, Circle IDs; rewording any content array; `status` fields; the context lesson's open certification `needsHumanDecision`; drafting legacy lesson content; exhaustive audit of cascaded lessons.

## Architecture / Approach

Three independently-committable phases: (1) schema transform + verify, (2) ordered `git mv` + positioning-doc stamp, (3) author review-notes. Schema-before-folders so the groundingSources URL fix rides in the schema commit.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Schema renumber + rewiring | Reordered, re-sorted, parse-valid Module 4 contract | Double-remap if not keyed by original id; whole-file churn if re-serialize isn't canonical |
| 2. Folder relocation | Context bundle at m4-l1/, DDD at m4-l5/, doc stamped | Move order (must free m4-l5 before m4-l4→m4-l5) |
| 3. Author review-notes | Foundation→project-map flow assessment | None (advisory only) |

**Prerequisites:** None beyond the (now-lifted) park. The paired `m4-l1-bootstrap` drafting continues independently.
**Estimated effort:** ~1 session, 3 phases.

## Open Risks & Assumptions

- change.md was PARKED pending a cofounder sync; user chose to plan-then-implement now. The vision was already agreed.
- The four cascaded lessons are still unwritten stubs in the schema (empty content arrays) — review is necessarily forward-looking, not a content audit.

## Success Criteria (Summary)

- Module 4 reads m4-l1…m4-l5 in the new order with an intact dependency ladder and unchanged context-scaling content.
- `lessons/m4-l1/` and `lessons/m4-l5/` hold the correct bundles; the groundingSources URL resolves to a real file.
- The author has a clear read on the new foundation→project-map flow.
