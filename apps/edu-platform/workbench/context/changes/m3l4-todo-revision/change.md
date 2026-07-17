---
change-id: m3l4-todo-revision
title: M3L4 E2E lesson — resolve [todo] comments (skill /10x-e2e, vision boundary)
status: implemented
created: 2026-05-31
updated: 2026-05-31
---

# M3L4 [todo] Revision

Resolve the 10 `[todo]` comments the author left in `lessons/m3-l4/lesson-draft.md`.

Three areas:
1. **Delivery (Group A, todos #1-4):** Move E2E rules + 5 anti-patterns + seed pattern + prompt-template out of inline lesson prose / the `CLAUDE-m3l4` sentinel block into a new `/10x-e2e` skill (toolkit). `CLAUDE-m3l4` shrinks to a thin pointer. Lesson references the skill; the optional "build your own" exercise targets learners on non-Playwright stacks.
2. **Vision boundary (Group B, todos #5-7):** M3L4 keeps vision only as a light supplement; the VLM model categories / cost / model-selection material (which already violates M3L4 `mustNotCover`) moves to M3L5 (debugging) as a new vision-as-diagnostic section. Schema updated for both lessons.
3. **Mechanical (Group C, todos #8-10):** Stagehand link, Page Object Model link, fixture caption fix.

See `plan.md` for the full plan and `plan-brief.md` for the two-pager.

## Editor → RC handoff (Phase 5)

Both M3L4 and M3L5 drafts changed materially, so both need the editorial
pipeline, run **sequentially** (editor first, then RC — never parallel):

1. `lesson-editor-pl` on `m3-l4`, then `lesson-rc-review` on `m3-l4`.
2. `lesson-editor-pl` on `m3-l5`, then `lesson-rc-review` on `m3-l5`.

Notes for the handoff:

- **M3L5 had a prior `rc-review.md`** — the new vision-as-diagnostic section
  invalidates it; a fresh RC review is required.
- **M3L5 still carries 6 author `[todo]` markers** (lines 12, 69, 78, 122, 216,
  274), intentionally deferred to a separate session. Resolve those before M3L5
  RC. M3L4 is fully `[todo]`-free.
- See `side-effect-ledger.md` for the full content-level effects (M3L4→M3L5
  vision move, `/10x-e2e` delivery change, video/text mismatches to confirm).
- Toolkit work (the `/10x-e2e` skill, thin `CLAUDE-m3l4`, `lesson-04.ts` rewire)
  landed in the `10x-toolkit` repo, commit `56e774b`.
