---
change_id: refactor-opportunities
title: Rank recorded tech debt into refactor opportunities and pick what to fix first
status: planned
created: 2026-06-05
updated: 2026-06-05
archived_at: null
---

## Notes

Intent: we have an analysis of this codebase that records technical debt and
structural risks: context/changes/post-flow-analysis/research.md. This change answers the question that
analysis deliberately left open: WHICH of those problems are worth fixing,
in what target shape, and in what order. We explore each recorded problem in
code and history, then rank them as refactor opportunities. Exploring and
deciding only — no refactoring happens in this change. Output: this change's
research.md, ending with a ranked shortlist and my explicit decision on what
to pursue first.
