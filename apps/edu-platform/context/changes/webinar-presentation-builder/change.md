---
change_id: webinar-presentation-builder
title: Add presentation-building skill to the webinar pipeline
status: implemented
created: 2026-05-07
updated: 2026-05-07
archived_at: null
---

## Notes

I would like to extend @/Users/admin/code/przeprogramowani-sites/.claude/skills/ webinar skills pipeline with building a presentation based on materials prepared by the pipeline, example here: /Users/admin/code/przeprogramowani-sites/thoughts/shared/webinars/2026-05-07-claude-code-od-prototypu-do-produktu - for building the presentation it should use the framework bootstrapped in /Users/admin/code/10x-bench/slides which we should move here to /Users/admin/code/przeprogramowani-sites/projects/edu-platform/ so we can reuse it when creating webinars

## Refined Requirements

1. **Standalone skill** — a separate skill (`10x-webinar-presentation`) that runs independently *after* the existing planner → material → writer pipeline. Does NOT modify any existing skills or the orchestrator.
2. **Slide framework** moves to `projects/slides/` as a new monorepo workspace (React isolated from edu-platform's "No React" rule).
3. **Webinar content** (research.md, talking-points.md, demo-ideas.md) moves to `projects/slides/webinars/<slug>/`.
4. **Skills stay repo-wide** in `.claude/skills/` — available from any CWD. Existing skills updated to write to the new content path.
5. **Interactive with approval gate** — skill proposes a component mapping table, user approves, then it generates `slides.jsx`.
