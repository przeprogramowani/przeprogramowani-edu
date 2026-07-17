# M4 Reorder + Certification Framing (decision capture)

> Captured 2026-06-02. This records a curriculum decision and the certification context the lesson must teach. **EXECUTED 2026-06-02 via the `m4-reorder` change** — the lesson now occupies slot `m4-l1` (was `m4-l5`); the schema renumber, dependency rewiring, folder move, and research-folder relocation are done. The "Pending" section below is retained for provenance.

## Decision: context-scaling becomes the FIRST lesson of Module 4

The context-scaling lesson (currently **`m4-l5` — "Skalowanie kontekstu dla AI w dużych projektach"**) **moves to `m4-l1`**. Rationale: it gives a **solid foundation** for the later Module-4 lessons and **prevents the questions learners would otherwise start asking before completing it**.

Framing line: **"We start with a lesson on context scaling (the foundation), then tackle the tasks (the challenges)."**

### What this implies for Module 4 order

Current linear chain:
`m3-l5 → m4-l1 (project map) → m4-l2 (feature analysis) → m4-l3 (refactor) → m4-l4 (DDD legacy) → m4-l5 (context scaling) → m5-l1`

Intended new order (context scaling first, legacy lessons cascade down one slot):

| New slot | Lesson (content) | Was |
|---|---|---|
| **m4-l1** | **Context scaling for AI (foundation)** | m4-l5 |
| m4-l2 | Nowy-stary projekt? Agent zbuduje mapę… | m4-l1 |
| m4-l3 | Analiza feature z AI… | m4-l2 |
| m4-l4 | Refaktoryzacja z Agentem… | m4-l3 |
| m4-l5 | Modernizacja legacy z DDD… | m4-l4 |

### Content implication (important for the spec)
As the new **foundational `m4-l1`**, the context lesson **can no longer depend on the legacy lessons that now follow it** (today it `dependsOn: ["m4-l4"]`). It must be reframed as:
- `dependsOn`: the Module-3 boundary (`m3-l5`) — i.e. it becomes Module 4's entry point,
- `preparesFor`: the now-following legacy lessons (new m4-l2…m4-l5),
- and the prose must **not assume** DDD/refactoring/feature-analysis content (those now come after). The research bundle currently treats it as an advanced/late lesson — that altitude must be lowered to "foundation."

### Pending (do NOT do without explicit confirmation)
> ✅ RESOLVED 2026-06-02 by the `m4-reorder` change. All four items below are executed (schema renumber, dependency rewiring incl. boundaries, folder move m4-l5→m4-l1, research folder now at `lessons/m4-l1/research/`). Kept verbatim for provenance.

- Renumber 5 `lessonId`s in `lessons-schema.json` (schema-wide).
Decision: it will be managed by a dedicated change m4-reorder that we will do tomorrow (while contuing working on the lesson in lessons/m4-l5/)
- Rewire all `dependsOn`/`preparesFor` across Module 4 + the `m3-l5`/`m5-l1` boundary links.
Decision: same as above
- Rename 5 lesson folders under `workbench/lessons/` (note: `lessons/m4-l1/` already holds the "project map" lesson — collision; needs an ordered move).
Decision: same as above
- Decide where this lesson's research folder lives (currently `lessons/m4-l5/research/`).
Decision: same as above

---

## Certification framing the lesson must teach

The lesson should explain to participants the path from learning to certification:

1. **In this lesson** they learn the **fundamentals of context management / context scaling.**
2. **Then they put it into practice** by continuing developing their **own projects** that they started in modul 1 and completing the **specific mandatory tasks outlined in the lessons.**
3. From that, they produce an **architectural report** for their project, which they add to the **form for the Architect badge.** - all lessons in module 4 and 5 are not required to get the base certificate with builder badge

### Two certification forms
- **Builder certificate** (MVP application) — minimum requirements:
  - **CRUD** functions,
  - **one business-logic** feature,
  - **risk-based tests** taken from the test plan.
- **Architect & Champion** — the form for this is **sent at the start of week 5.**

### Key constraint to state in the lesson
- **It is a single application.** Therefore: **make your architecture decision at the END of the lesson or postpone it after you finish the module**

> Pedagogical consequence: this foundational lesson sets up the *criteria and vocabulary* learners will use across Module 4 to make and later justify their architecture decision in the Architect-badge report. The mandatory tasks and the architectural report are the throughline from here to the badge.
