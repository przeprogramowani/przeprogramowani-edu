---
id: m3l5-todo-revision
status: implemented
created: 2026-05-31
updated: 2026-06-01
---

# m3l5-todo-revision

Resolve the six `[todo]` markers the author left in
`workbench/lessons/m3-l5/lesson-draft.md` (Debugowanie z AI: od stack trace'a do
gotowego fixa), then reconcile the `m3-l5` entry in `lessons-schema.json`.

Anchored decisions (from the planning interview, 2026-05-31):

- **Sentry honest via console capture** — wire `@sentry/astro` + `@sentry/cloudflare`
  in the debug worktree and enable `captureConsoleIntegration({ levels: ['warn','error'] })`
  so the planted `console.warn('review/rate: update_failed …')` surfaces as the Sentry
  issue. Planted bug stays unchanged (still returns 200). Free-plan compatible.
- **E2E covers a different flow** — the pre-recording E2E exercises generate→save (as
  M3L4 already does) and does not touch rate/SRS, so "no standing gate touches this path"
  stays literally true.
- **Add a "why not just read the code" beat** — acknowledge code-reading is fast here;
  frame multi-source diagnosis as the method for prod-only / non-reproducible / unfamiliar
  / intermittent bugs.
- **Reproduction-test prompt + skill refs** — inline prompt + `/10x-tdd` primary
  (unit/integration), `/10x-e2e` for the e2e layer.
- **Edit scope** — draft + `m3-l5` schema entry only. Worktree Sentry wiring and video
  re-cut are out-of-scope follow-ups.
