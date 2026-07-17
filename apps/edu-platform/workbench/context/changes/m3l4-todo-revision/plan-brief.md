# M3L4 [todo] Revision — Plan Brief

> Full plan: `context/changes/m3l4-todo-revision/plan.md`

## What & Why

The author left 10 `[todo]` comments in `lessons/m3-l4/lesson-draft.md` (E2E testing lesson). They cluster into: (A) E2E rules/anti-patterns shouldn't be dumped inline / appended to `CLAUDE.md` — they should live in one reusable artifact; (B) the vision/VLM material is mis-placed — it belongs in the next lesson (M3L5, debugging), and partly already breaks M3L4's own boundaries; (C) two missing links and a fixture to verify. This plan resolves all 10 end-to-end.

## Starting Point

M3L4 ships two delivery artifacts today: a prompt (`m3l4-e2e-prompt`) and a rule (`CLAUDE-m3l4`) that lands as a full block inside `CLAUDE.md`. The draft inlines the entire rules block, three verbatim re-prompt blocks, and a vision section with VLM model categories + per-screenshot cost — content the M3L4 schema's own `mustNotCover` already forbids. M3L5 (debugging) has no vision coverage at all.

## Desired End State

E2E rules + the five anti-patterns + seed pattern + prompt-template live in a single new `/10x-e2e` skill; `CLAUDE-m3l4` is a thin pointer; the lesson references the skill instead of inlining. M3L4 keeps vision only as a light supplement with a handoff to M3L5; the model-category/cost/selection material moves to a new vision-as-diagnostic section in M3L5. Schema, prose, and delivery are all aligned.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| Where E2E rules/anti-patterns live | New `/10x-e2e` skill | Single source of truth; powers the optional "build your own (non-Playwright)" exercise; progressive disclosure | Plan (author) |
| Old artifacts (`CLAUDE-m3l4`, `m3l4-e2e-prompt`) | Skill + thin `CLAUDE.md` pointer; prompt absorbed | Agent still gets an auto-read signal; full content on-demand in the skill | Plan (author) |
| Vision split M3L4 vs M3L5 | M3L4 light supplement; model material → M3L5 | Aligns with schema (`mustNotCover` already forbids VLM comparison in M3L4); vision adds more value in debugging | Plan (author) |
| Plan scope | Full: prose + schema + toolkit | One coherent plan closes all 10 todos | Plan (author) |
| M3L5 vision section depth | Full draft now | Leave no debt; M3L5 then needs re-RC | Plan (author) |

## Scope

**In scope:** M3L4 prose edits (all 10 todos' prose side); `lessons-schema.json` m3-l4 + m3-l5; new `/10x-e2e` toolkit skill; thin `CLAUDE-m3l4`; absorbed prompt; `lesson-04.ts` rewiring; new M3L5 vision-as-diagnostic section; side-effect ledger.

**Out of scope:** building the learner's own skill (stays an exercise); re-teaching m3-l1/l2/l3 topics; POM beyond a mention; running `lesson-editor-pl`/`lesson-rc-review` (flagged as handoff); re-recording videos.

## Architecture / Approach

Contract-first: schema sets the M3L4/M3L5 vision boundary and rules→skill ownership → toolkit builds the skill the prose will reference → M3L4 prose slims and points at the skill → M3L5 receives the vision section → editorial/RC handoff. Spans three repos/areas: workbench (drafts + schema), toolkit (skill + artifacts).

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Schema | m3-l4 + m3-l5 slots realigned | Two-lesson edit overrides "touch only target lesson" — intentional |
| 2. Toolkit skill | `/10x-e2e` + thin `CLAUDE-m3l4` + rewired `lesson-04.ts` | Build break / orphaned prompt reference |
| 3. M3L4 prose | All 10 todos' prose resolved | Dangling cross-refs to removed blocks |
| 4. M3L5 prose | Vision-as-diagnostic section | M3L5 was post-RC → needs re-review |
| 5. Editorial/RC | Side-effect ledger + handoff | Video/text mismatch after slimming |

**Prerequisites:** write access to both `przeprogramowani-sites/.../workbench` and `10x-toolkit`; toolkit build toolchain (`pnpm`).
**Estimated effort:** ~2-3 sessions across 5 phases (Phase 2 toolkit + Phase 4 M3L5 section are the heaviest).

## Open Risks & Assumptions

- The skill absorbs the standalone prompt — assumes no other lesson depends on `m3l4-e2e-prompt` (Phase 2 grep guards this).
- M3L5's new section reopens its RC status; the editor→RC pass is deferred to a separate run (memory: editor before RC, never parallel).
- Vision flowchart diagram in M3L4 may need re-render or removal after slimming (note for the `mermaid` skill).

## Success Criteria (Summary)

- Zero `[todo]` left in M3L4 (and none introduced in M3L5).
- M3L4 ↔ M3L5 vision boundary clean: no duplication, schema and prose agree.
- Toolkit builds; `/10x-e2e` skill delivered; `CLAUDE-m3l4` thin; no orphaned prompt.
