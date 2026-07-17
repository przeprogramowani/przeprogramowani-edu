---
change_id: m4-l1-bootstrap
title: Bootstrap M4-L1 — draft the context-scaling lesson from the research bundle
status: implementing
created: 2026-06-02
updated: 2026-06-02
archived_at: null
---

## Notes

Produce the first `lesson-draft` for the new **M4-L1** (context scaling — the Module 4 foundation), using the existing research properly so the work isn't wasted.

Inputs (source of truth):
- `lesson-spec.md` (M4-L1 foundation altitude, 9-beat logic map)
- `positioning-and-certification.md` (module vision + certification framing)
- `research/` bundle: context-engineering-multi-module, codex-cli-agents-md, instruction-file-maintenance, repo-case-studies, progressive-adoption, multi-repo-context
(these live in the m4-l5 folder until the `m4-reorder` change moves them to m4-l1/)

Must-haves for the draft:
- A strong **intro that frames the Module 4 vision** — "start with context scaling (the foundation), then tackle the tasks (the challenges)."
- The **end goal**: the architectural report assembled from the NON-OPTIONAL (mandatory) lesson tasks → Architect badge; Builder cert min reqs (CRUD + one business logic + risk-based tests); single app ⇒ architecture decided at end of module.
- Spine: WHY (attention budget → context rot at scale) + the progressive hybrid ladder (lean root + context/, escalate per-module on observable signals); demo anchored on the 10x-workflow context/ on a course-style project; universal mental model + multi-tool illustrations; multi-repo as awareness → M5-L3.
- Respect the m1-l4 boundary (do NOT re-teach single-project AGENTS.md authoring) and do NOT pre-empt the legacy lessons that now follow.

**Decoupled from `m4-reorder` (2026-06-02):** the reorder is parked for a cofounder sync; drafting proceeds NOW in the current `lessons/m4-l5/` folder (spec + research already there). The `m4-reorder` change will relocate the finished artifacts into `lessons/m4-l1/` later — no need to wait. Drafting tool: `/lesson-draft`.
