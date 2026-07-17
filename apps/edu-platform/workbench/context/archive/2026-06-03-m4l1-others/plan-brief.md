# Sharpen m4-l1 into a strong Module-4 opener — Plan Brief

> Full plan: `context/changes/m4l1-others/plan.md`
> Research: `context/changes/m4l1-others/research.md`

## What & Why

This is the editorial pass that `m4-l1/m1-to-others.md` deliberately deferred. We edit `lessons/m4-l1/lesson-draft.md` so it is both a strong Module-4 opener *and* fulfills its handoff contract to L2–L5 — closing three framing gaps (G1/G2/G4) and the L1→L2 seam that the downstream lessons already assume exist. The single live cross-lesson dependency in prose today (`m4-l2/notes.md:63` cites "context economics z L1") is currently aspirational; this pass makes it true.

## Starting Point

The schema reorder is done — L1 is correctly wired as the M4 entry point. The draft is already RC-quality as an opener (hook, economics, architecture, demo, maturity ladder, calibration all land; four valid diagrams; on-voice). What's missing is purely *framing*: the collaboration contract, the files→repo attention-budget bridge, the report-shape preview, and a deliberate bridge to L2 — plus a few RC-blocking markers and typos.

## Desired End State

The draft states "AI is your analyst; you own & defend the report" (G1), bridges the attention budget from instruction-files to reading the repo (G2 + L1→L2 bridge-out), previews the ⓪→⑤ report shape without hardening unconfirmed certification numbers (G4), names the module's three organizing foundations, and carries no `[todo]`/broken-markup/typo. `lesson-rc-review` returns no new blockers; the only open items are two explicitly out-of-scope blockers (video scenario; cert-copy confirmation).

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Edit scope | Full pass (P1+P2+P3) | Leave the draft RC-ready in one pass, no loose threads. | Plan |
| arXiv IDs / cert copy | Verify IDs now; flag cert copy | IDs are the one item verifiable without official forms. | Plan |
| arXiv verification result | Both genuine; titles/numbers match | `2601.20404` & `2602.11988` resolve; collapses the l.328 todo to a delete + pointer. | Plan |
| Implicit foundations (#5) | Name all three | Give the module its organizing thread explicitly in L1. | Plan |
| Tighten vs name tension | Full naming, accept added length | Spend length on the namings; relax tier-2 tightening to a light touch. | Plan |
| Workflow | Direct edits, then `lesson-rc-review` | Snippets are pre-approved on-voice in research; review never runs parallel. | Plan |
| Video scenario | Out of scope | Distinct artifact + skill; flag as RC blocker. | Plan |

## Scope

**In scope:** G1/G2/G4 inserts + L1→L2 bridge-out; fix `[todo]` (l.156, l.328) and malformed heading (l.191); sharpen the l.327 cost claim; name the three foundations; restore the GitHub-search counting trap; trim the duplicate forward-ref (l.251); light tier-2 structural touch; 7 typos; RC review + ledger.

**Out of scope:** teaching any downstream technique; the G3 data-source inventory; hardening cert numbers/timing; the video scenario; editing the schema, `m4-shape.md`, or downstream lessons; moving Deep Dive beats 7 & 8.

## Architecture / Approach

Single-file prose edit applied directly with the Edit tool, reusing `research.md`'s pre-approved on-voice Polish snippets. Contract-first ordering: the G2 seed is planted before the bridge-out that pays it off, so the four inserts form one throughline rather than four bolted-on paragraphs. A deliberate reconciliation governs Phase 2 — because the owner chose to name all three foundations and accept added length, the tier-2 tightening is relaxed to a light structural touch (no aggressive cuts). Review runs *after* edits, never in parallel.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Contract gaps + RC markers | G1/G2/G4 + bridge-out; todos/heading fixed; l.327 sharpened | Inserts reading as bolted-on rather than one throughline |
| 2. Opener + foundation namings | Three foundations named; counting-trap restored; dup-ref trimmed; light tier-2 touch | Namings adding altitude / pre-empting L2–L5 notes |
| 3. Polish sweep | 7 typos + full coherence read | Line numbers shifted — match on text, not line |
| 4. RC review + handoff | `lesson-rc-review`, side-effect ledger, flagged blockers | Surfacing a new contract issue late |

**Prerequisites:** none — all source artifacts (research, shape, continuity notes, draft) exist and were read during planning; arXiv IDs already verified.
**Estimated effort:** ~1 session across 4 phases (mostly insertions of pre-written snippets + one review run).

## Open Risks & Assumptions

- **Downstream firmness:** L2–L4 are `notes.md` only; L5 is a draft. Every edit is framing/bridge that pre-empts no technique, so it's safe now — but once L2–L4 are drafted, re-check they open with / cite the foundations L1 now hands forward (esp. G1 and the G2 bridge).
- **Certification copy** (Builder min-reqs, week-5 timing, report template) remains unconfirmed against official forms — G4 is written to avoid hardening it; owner confirmation still needed before RC sign-off.
- **Video scenario** is still missing and blocks RC — handled separately after this pass.
- **Naming-vs-length tension:** naming all three foundations could tip the already tier-2-heavy lesson; mitigated by keeping the taxonomy a pointer and relaxing (not abandoning) the tier-2 touch.

## Success Criteria (Summary)

- The learner reads a lesson that names the collaboration contract, bridges the attention budget to reading the repo, and previews the whole report's shape — so L2–L5 land on prepared ground.
- No `[todo]`, broken markup, or typo survives; the GitHub-search counting trap is back.
- `lesson-rc-review` reports no new contract/markup blockers — only the two known, flagged, out-of-scope items remain.
