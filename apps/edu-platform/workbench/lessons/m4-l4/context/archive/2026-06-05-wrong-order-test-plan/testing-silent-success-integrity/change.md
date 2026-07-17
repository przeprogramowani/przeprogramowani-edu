---
change_id: testing-silent-success-integrity
title: Test rollout Phase 1 — silent-success integrity of the post-save flow
status: new
created: 2026-06-05
updated: 2026-06-05
archived_at: null
---

## Notes

Open a change folder for rollout Phase 1 of context/foundation/test-plan.md: "Silent-success integrity".
Risks covered: Risk #1 — silent message loss (post accepted via optimistic UI / HTTP 201 but a persistence side-effect, retry-under-contention, or broadcast step silently fails; sender believes it sent); Risk #2 — silent search staleness (save→index hook regresses; new posts persist and display but stop being searchable, discovered days later).
Test types planned: server integration (DB-backed) + targeted unit tests on the store wrapper layers.
Risk response intent: Risk #1 — prove that a post reported as created is durably persisted AND the posted broadcast fires, including under retry/contention and when post-commit side-effects fail; challenge "a 201 implies everything after the commit also happened". Risk #2 — prove that saving a post triggers exactly one index call so losing the indexing hook turns a test red; challenge "persisted implies searchable".
After creating the folder, follow the downstream continuation rule.
