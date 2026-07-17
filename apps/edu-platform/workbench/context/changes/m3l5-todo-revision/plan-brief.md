# M3L5 Lesson Draft — Todo Revision — Plan Brief

> Full plan: `context/changes/m3l5-todo-revision/plan.md`
> Prep/grounding: `context/changes/m3l5-preps/research.md`

## What & Why

Resolve the six `[todo]` markers in `workbench/lessons/m3-l5/lesson-draft.md`
("Debugowanie z AI: od stack trace'a do gotowego fixa"). They expose four tensions in the
lesson's diagnostic spine: Sentry can't actually see the planted bug as written; the
soon-to-exist E2E suite threatens the "pipeline missed it" premise; the bug is so
code-local that the multi-source investigation looks contrived; and the reproduction test
has no prompt or skill pointer. Left unresolved, the lesson would teach a Sentry-first
workflow that wouldn't fire on the very bug it diagnoses.

## Starting Point

The draft is structurally complete and `grounded`. But the planted bug is `console.warn` +
HTTP 200, the `10xcards-m3l5-debug` worktree has **no Sentry wiring at all**, and Sentry's
console capture is opt-in — so the "agent finds the issue in Sentry" beat is currently
unsupported. M3L4's E2E covers generate→save, not rate/SRS; the rate path genuinely has
zero tests.

## Desired End State

Zero `[todo]` markers; the Sentry beat is true because the project enables
`captureConsoleIntegration` (the planted `console.warn` becomes the issue, bug unchanged);
E2E is framed as covering a different flow; a short passage answers "why not just read the
code"; the reproduction test has an inline prompt + `/10x-tdd`/`/10x-e2e` references; and
the `m3-l5` schema entry matches.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Sentry honesty | Wire Sentry + `captureConsoleIntegration` | Existing `console.warn` becomes the issue without changing the bug; free-plan compatible | Plan |
| E2E vs premise | E2E covers a different flow (generate→save) | Keeps "no standing gate touches the rate path" literally true | Plan |
| Code vs investigation | Add a "why not just read the code" beat | Honestly frames the bug as a teaching vehicle for a transferable method | Plan |
| Test-gen skill ref | `/10x-tdd` primary, `/10x-e2e` for e2e | Repro test is integration-level; `/10x-tdd` is layer-correct and already installed | Plan |
| Edit scope | Draft + `m3-l5` schema only | Workbench rule: don't edit other repos; touch only the target lesson | Plan |

## Scope

**In scope:** all six todos in the draft; reconciling the `m3-l5` schema entry
(`owns`/`requiredFragments`/`sideEffectLedger`); a Sentry-wiring handoff note in the Deep
Dive.

**Out of scope:** wiring Sentry into the `10xcards-m3l5-debug` worktree; re-cutting the
video scenario; any other lesson's schema; voice polish (deferred to `lesson-editor-pl`).

## Architecture / Approach

Edit the draft by decision area top-to-bottom (Phases 1-4), each removing its todo and
keeping surrounding prose consistent with `style.md` / `lesson-structure.md`. Phase 5
reconciles the schema after the draft is final, touching only the `m3-l5` object. Voice
polish and RC review follow separately (editor before review).

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Sentry honest | Console-capture bridges warn→issue; MCP/CLI tightened; Deep Dive setup | Misframing "swallowed" or implying default console capture |
| 2. E2E & zero-test framing | E2E = different flow; zero-test + deliberate-bug stated | Intro/section drift telling inconsistent E2E stories |
| 3. Why-investigate beat | Short passage answering code-vs-investigation | Tone undercutting the workflow being taught |
| 4. Repro prompt + skill refs | Inline prompt + `/10x-tdd`/`/10x-e2e` | Pointing at e2e reference files for an integration test (scope drift) |
| 5. Schema reconciliation | `m3-l5` entry matches draft; ledger resolved | Editing beyond the `m3-l5` object |

**Prerequisites:** none for the edits. For recording (separate): Sentry wired in the
worktree + video re-cut.
**Estimated effort:** ~1 focused session across 5 phases.

## Open Risks & Assumptions

- Assumes the author applies the planted 500→200 swallow and the Sentry wiring in the
  worktree before recording (out of scope here).
- Astro 6 + Cloudflare is **confirmed supported** (issue #19762 maintainer comment): use
  the custom entry-point wiring already shown in the draft. No longer an open risk.
- `captureConsoleIntegration` events count against the **same errors quota and Issues
  stream** as uncaught client-side exceptions (5000/month free) — surface this in the
  lesson as a cost + signal-hygiene decision, not buried.

## Success Criteria (Summary)

- `grep -c '\[todo' lesson-draft.md` → 0; `jq . lessons-schema.json` parses.
- A learner reading the lesson sees a Sentry-first investigation that would genuinely fire
  on this bug, an honest account of why the pipeline missed it, and a usable prompt + skill
  to reproduce it.
- The `m3-l5` schema entry and the draft tell the same story.
