---
change_id: m4-reorder
title: Reorder Module 4 — context-scaling becomes M4-L1, cascade legacy lessons down
status: archived
created: 2026-06-02
updated: 2026-06-02
archived_at: 2026-06-02T15:25:39Z
---

## Notes

Promote the context-scaling lesson (currently schema id `m4-l5`, "Skalowanie kontekstu dla AI w dużych projektach") to the FIRST lesson of Module 4 (m4-l1); cascade the four legacy lessons down one slot. Source of truth for the decision: `lessons/m4-l5/positioning-and-certification.md`. Editorial workbench change only — do NOT touch `src/content*` or platform deployment.

Target new order:
- m4-l1 = context-scaling (was m4-l5)
- m4-l2 = project-map (was m4-l1)
- m4-l3 = feature-analysis (was m4-l2)
- m4-l4 = refactoring (was m4-l3)
- m4-l5 = DDD-modernization (was m4-l4)

Scope:
1. **lessons-schema.json** — renumber the 5 Module-4 `lessonId` + `moduleOrder` + `globalOrder`; rewire all `dependsOn`/`preparesFor` inside Module 4 and the boundary links (m3-l5 → preparesFor new m4-l1; new m4-l5 → preparesFor m5-l1).
   - ⚠️ **The context-scaling lesson's CONTENT fields are already reorder-aware** (enriched 2026-06-02 at the current `m4-l5` slot): `owns` / `referencesOnly` / `mustNotCover` / `learningOutcomes` are populated and written forward-looking — they already say "m4-l2…m4-l5 po renumber", "fundament", "foundation altitude", etc. **This change must only touch the STRUCTURAL fields** of that lesson — `lessonId`, `moduleOrder`, `globalOrder`, `dependsOn`, `preparesFor` — and must **not** reword the prose in those four arrays (and not the `groundingSources` / `sideEffectLedger`, which are also current). The only open content item on that lesson is the certification-form confirmation tracked in its `needsHumanDecision`.
2. **Folder renames** under `lessons/` — ordered to avoid collisions (current m4-l1 folder already exists); move the context-scaling lesson's artifacts (research/ bundle, positioning-and-certification.md, lesson-spec.md, lesson-grounding.md, and any drafted lesson-draft/videos) into the new m4-l1 folder.
3. **Review-notes for the author** — for each cascaded legacy lesson, check whether it still fits its new slot (title, deps, scope vs the new foundation) or needs updates; flag anything that reads oddly now that context-scaling comes first.

Paired with: `m4-l1-bootstrap` change (drafts the new M4-L1 from the research).

**Status — PARKED (2026-06-02):** the technical reorder is a shared structural decision; holding execution until the cofounder sync (planned tomorrow). The vision is already agreed. Drafting is **decoupled** and proceeds independently in `lessons/m4-l5/` meanwhile; this change will relocate those artifacts into `lessons/m4-l1/` when executed.

## Implementation note (2026-06-02)

Executed plan-first via `/10x-plan` → `/10x-implement` (see `plan.md`). Reorder mechanics verified clean (ladder, slot-stable boundaries, git-rename folder moves, stale groundingSources URL fixed, non-m4 modules byte-identical).

**Impl-review finding F1 (accepted & documented):** `lessons-schema.json` was already dirty at session start. The Phase-1 commit `a3c7c32d` therefore also landed pre-existing uncommitted enrichment of the context lesson — `requiredFragments` (0→13 items) and `videoPlaceholders` (0→3 items) — which was outside this change's declared structural-only scope but is the lesson's own legitimate content (empty at `0d9ebe6f`, populated at `a3c7c32d`; the reorder transform itself never touches those fields). Accepted as-is; recorded here so the "renumber" commit's broader contents are not lost. Review report: `reviews/impl-review.md`.
