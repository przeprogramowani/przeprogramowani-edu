# M3L4 /10x-e2e Reframe — Plan Brief

> Full plan: `context/changes/m3l4-e2e-skill-reframe/plan.md`

## What & Why

The `/10x-e2e` skill was significantly rewritten in the toolkit: it is no longer a *generator wrapper* (run planner→generator or fill a prompt template) but a **plan-execution skill — the E2E sibling of `/10x-implement` and `/10x-tdd`**. It reads the same `plan.md`, mutates the same `## Progress`, and swaps the inner loop for browser-level **PLAN → GENERATE → REVIEW → VERIFY**, gated by an eligibility check. The m3-l4 lesson still teaches the old "skill that generates tests" model and reproduces the now-skill-owned prompt template inline. This change makes the lesson match the skill, **mirroring the way m3-l2 explains `/10x-tdd`**.

## Starting Point

`lessons/m3-l4/lesson-draft.md` is a complete, `[todo]`-free draft (post `m3l4-todo-revision`). Its CLI / accessibility-tree / `storageState` / vision / pipeline sections are accurate. The middle ("Planner, generator, healer" → "Izolacja danych testowych") describes `/10x-e2e` as a generator and inlines the full prompt template + worked example (~lines 214-288). The `m3-l4` schema slot still says "planner→generator workflow". The skill, its references, and the thin `CLAUDE-m3l4` are already shipped in the toolkit — no toolkit work here.

## Desired End State

M3L4 introduces `/10x-e2e` as the E2E sibling of `/10x-implement`/`/10x-tdd` — shared `plan.md`/`## Progress`, the PLAN→GENERATE→REVIEW→VERIFY loop, the eligibility gate, deliberate-break verification, interleaving modes — explained with the same structure m3-l2 uses for `/10x-tdd`. The inline prompt template is gone (thin pointer to the skill). Seed/rules read as GENERATE levers, the five anti-patterns as the REVIEW checklist, deliberate-break as VERIFY. The schema's `m3-l4` slot matches. The lesson is staged for `mermaid` → `lesson-editor-pl` → `lesson-rc-review`.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Inline prompt template + worked example | Remove, thin pointer | Skill's `references/e2e-prompt-template.md` is the single source; avoids drift | Plan |
| Depth of `/10x-tdd`-style framing | Full parallel | `/10x-e2e` *is* the sibling of `/10x-tdd`; the request asked for the m3-l2 pattern | Plan |
| Schema update | Light, target slot only | Keep contract honest with the lesson; workbench "touch only target lesson" rule | Plan |
| Toolkit changes | None | Skill already shipped (prior revision, commit `56e774b`) | Plan |
| Decision diagram | Add one mermaid, render later | Full parallel to m3-l2; rendering/renumber owned by the `mermaid` skill | Plan |

## Scope

**In scope:** `lessons/m3-l4/lesson-draft.md` reframe; light `lessons-schema.json` `m3-l4` edit; side-effect ledger; editor/RC handoff staging.

**Out of scope:** toolkit (skill/references/`CLAUDE-m3l4`/`lesson-04.ts`); any other lesson; the vision boundary (settled prior); lesson order; running the editor/RC passes; re-recording video.

## Architecture / Approach

Contract-first, then prose, then handoff. **Phase 1** aligns the schema. **Phase 2** lays the new conceptual spine (sibling framing + loop + gate + decision diagram + interleaving), reframing the "Planner, generator, healer" section. **Phase 3** maps the existing teaching sections onto the loop (seed/rules → GENERATE, anti-patterns/re-prompt → REVIEW, deliberate-break → VERIFY) and removes the inline template. **Phase 4** sweeps downstream sections (pipeline, tasks, Deep Dive) for consistency. **Phase 5** produces the ledger and stages the editorial pipeline. It is structural editing of existing good prose, not a rewrite.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Schema | `m3-l4` owns/outcomes match the plan-executor framing | Accidentally editing another slot |
| 2. Spine | Sibling framing, loop, gate, decision diagram, interleaving | Re-teaching `/10x-tdd`; diagram renumber churn |
| 3. Levers + template removal | GENERATE/REVIEW/VERIFY mapping; inline template gone | Dangling cross-references to deleted prose |
| 4. Downstream | Pipeline, tasks, Deep Dive consistent | Tasks still implying "two variants" of the skill |
| 5. Ledger + handoff | Side-effect ledger; staged for mermaid→editor→RC | Forgetting the mermaid render follow-up |

**Prerequisites:** shipped `/10x-e2e` skill (done); read `references/lesson-structure.md`, `style.md`, and `lessons/m3-l2/lesson-draft.md:152-268` before editing.
**Estimated effort:** ~1-2 sessions across 5 phases; Phases 2-3 are the bulk.

## Open Risks & Assumptions

- Adding a mermaid shifts the rendered-PNG numbering; deferred to the `mermaid` skill — until then the lesson is editorially complete but not render-complete.
- The reframe strengthens the M3L2↔M3L4 bridge; the ledger must call out the `/10x-tdd` vs `/10x-e2e` parallel as intentional (same pattern, different layer), not duplication.
- Working copy is mid-editorial-polish; the structural edits sit on top of cosmetic tweaks without collision.

## Success Criteria (Summary)

- A reader who knows `/10x-tdd` recognizes `/10x-e2e` as its E2E sibling, with all four loop steps and the gate visible and labeled.
- The inline prompt template is gone and the pointer stands alone; no dangling cross-references.
- The `m3-l4` schema slot matches the lesson; the draft is `[todo]`-free and staged for the editorial pipeline.
