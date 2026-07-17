# Wire m3-l3/l4/l5 Toolkit Artifacts — Plan Brief

> Full plan: `context/changes/l3l4l5-toolkit/plan.md`

## What & Why

Module 3 lessons m3-l3 (Hooks), m3-l4 (E2E), m3-l5 (Debug) are empty `"TBD"` stubs in the toolkit — `10x get m3l3/m3l4/m3l5` deliver nothing. This wires them so learners get the right artifacts for tomorrow's release: a hooks rule, an E2E prompt + rule, and corrected lesson wiring.

## Starting Point

m3-l1 and m3-l2 are wired and delivering (spread chain m2l5 → m3l1 → m3l2). m3-l3/l4/l5 `.ts` defs are stubs with empty artifact arrays and no import of the previous lesson. No E2E/hooks/debug artifact exists anywhere in `ai-artifacts/`.

## Desired End State

`10x get m3l3` delivers the hooks rule (merged into `CLAUDE.md`); `10x get m3l4` delivers the E2E prompt + rule; m3l5 inherits the chain with no new artifact. The toolkit `build:lessons` passes, proving every reference resolves. m3-l3/m3-l4 drafts gain a `get` block at first point of use.

## Key Decisions Made

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| How m3-l3 ships hooks | Rule only; hooks stay inline in draft | `configs` delivery is reference-only (`.claude/config-templates/`, no merge into active `settings.json`) — would mislead learners | Research + Plan |
| m3-l5 artifact | None (no rule, no `get` block); wiring + summary only | Lesson adds no installable artifact; avoids a near-empty package | Plan |
| m3-l4 seed test | Not delivered; stays inline example | No delivery slot exists for raw test files | Plan |
| m3-l4 prompt content | Generic template + 10xCards example | Mirrors m3l2's concrete style | Plan |
| `configs` array usage | None on any lesson | Reference-only delivery is the wrong vehicle for active config | Research |
| Phase order | l3 → l4 → l5 → build | Import chain: l4 imports l3, l5 imports l4 | Plan |

## Scope

**In scope:** `CLAUDE-m3l3.md`, `m3l4-e2e-prompt.md`, `CLAUDE-m3l4.md`; wiring `lesson-03/04/05.ts` (imports, spread, summaries); `get` blocks in m3-l3/m3-l4 drafts; toolkit build validation.

**Out of scope:** new skills; `configs` arrays; any m3-l5 artifact or draft change; seed/lefthook as delivered artifacts; m3-l2 typo/title fixes (flagged only); Track A 10xCards demo code; `src/content*` / publishing.

## Architecture / Approach

Two repos: artifacts + wiring land in `10x-toolkit/`; only the Polish `get` blocks change in this workbench's drafts. Per lesson: author artifact files → wire the `.ts` def → add draft `get` block, in import-chain order. Rules are English (per exemplars); the e2e prompt copies the draft's English template 1:1. `build:lessons` throws on any missing-file reference — the validation backstop.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. m3-l3 | Hooks rule + wiring + draft get block | Rule must not steal E2E/debug scope |
| 2. m3-l4 | E2E prompt + rule + wiring + draft get block | Prompt must be byte-faithful to draft |
| 3. m3-l5 | Wiring + summary only (no artifact) | Keep spread chain intact for module-04 |
| 4. Build & validate | `build:lessons` green; smoke `get` | Build env / CLI availability locally |

**Prerequisites:** Write access to `/Users/admin/code/10x-toolkit/`; toolkit build runnable locally.
**Estimated effort:** ~1 session; bulk is the two rules (editorial) + build validation.

## Open Risks & Assumptions

- `configs`-based hooks delivery is intentionally avoided; if a future merge feature lands, m3-l3 could revisit.
- Smoke-testing real `10x get` requires a locally built/published CLI; if unavailable, build + bundle inspection is the fallback gate.
- Toolkit build script name assumed `build:lessons` — confirm at run time.

## Success Criteria (Summary)

- `npm run build:lessons` passes with no missing-artifact errors.
- `10x get m3l3` and `get m3l4` deliver the expected rule/prompt; m3l5 inherits the chain.
- m3-l3/m3-l4 drafts read naturally with `get` blocks at first point of use; m3-l5 draft untouched.
