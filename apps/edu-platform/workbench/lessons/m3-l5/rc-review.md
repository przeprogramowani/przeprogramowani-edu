# RC Review: m3-l5 — Debugowanie z AI: od stack trace'a do gotowego fixa

> Regenerated after the planted-bug swap (save-session FK / `orphan_review_state` → swallow-rate-update-200 in `rate.ts`). The retired bug is now covered by 10xCards test-plan Phase 2; this review covers the rate-path replacement.

## Verdict

**Not ready — Majors only; the Blocker is now resolved.** The editorial swap is complete and internally consistent across schema, spec, grounding, draft, and video, and the bug mechanism is **verified by spike (2026-05-30)**: fractional → integer `scheduled_days` fails every UPDATE with PG `22P02` (due unchanged), the plant passes `pnpm exec astro check` (0 errors) + `pnpm exec vitest run` (50/50, == clean) + the real pre-commit hook (lint-staged → eslint, 0 errors), and the swallow form was corrected to `{ ok: true }` (type-clean; `updated as RateResponse` fails TS2352). Remaining work is recording-time, deferred by the author until after m3-l3/m3-l4: re-record the video and resolve the `[TODO-LINK]` certification URL. No editorial blockers remain.

## Findings

### Resolved (was Blocker): Deterministic-failure mechanism — VERIFIED by spike

- Evidence: spike run 2026-05-30 against running local Supabase (PostgREST, the app's exact `supabase-js` path), plant applied to `rate.ts` then reverted clean. A fractional value into the `integer` column `scheduled_days` fails **every** UPDATE with PG `22P02 invalid input syntax for type integer` (PostgREST rejects, does not round); comparing `due` as timestamps, the errored UPDATE leaves it **exactly at baseline, still in the past**; a valid integer write advances `due`. With the full plant applied: `pnpm exec astro check` = **0 errors**, `pnpm exec vitest run` = **50/50** (identical to clean — no test touches the rate path), and the real pre-commit hook (lint-staged → eslint) = **0 errors**. So the bug escapes the typecheck gate, the test suite, and the commit hook.
- Correction surfaced by the spike (now applied to all artifacts): the swallow is `jsonResponse(200, { ok: true })`, NOT `updated as RateResponse` — the latter fails `TS2352` (`Card.due:Date` vs `RateResponse.due:string`). The `{ ok: true }` form mirrors the existing save-session swallow precedent in the same codebase. Toolchain note: 10xCards is a **pnpm** repo (no `npm run check`/`npm test`).
- Remaining (recording-prep, not a blocker): seed the demo/test card with a non-integer interval so the plant fires (FSRS fuzz makes this reliable on cards with history); confirm on the Workers deploy that Sentry/wrangler capture `update_failed`.
- Source check: verified directly against 10xCards source + running local Supabase.

### Major: `[TODO-LINK]` certification link unresolved (pre-existing)

- Evidence: `lesson-draft.md` Wstęp-close paragraph: "Szczegółowe warunki zgłoszenia znajdziesz w [poście o certyfikacji]([TODO-LINK])."
- Why it matters: a dead link in learner-facing prose blocks production handoff.
- Required fix: replace `[TODO-LINK]` with the real certification post URL (carried over from the previous draft; not introduced by the swap).
- Source check: n/a.

### Major: Video must be re-recorded against the rate-path bug

- Evidence: `videos/video-diagnostic-walkthrough.md` is fully rewritten for the rate-path bug (4 clips, reset points, TODO), but the previously recorded V1 (commit e9079655) demos the retired save-session bug.
- Why it matters: the lesson ships with a video; the existing footage contradicts the text.
- Required fix: re-cut V1 per the updated scenario after the §0 spike lands. The scenario's Pre-production TODO now leads with the spike.
- Source check: n/a.

### Minor: `wrangler pages deployment tail` vs Workers form

- Evidence: draft + video use `wrangler pages deployment tail`; CLAUDE.md/grounding note 10xCards deploys via Workers. Carried over verbatim from the previous draft for text alignment.
- Why it matters: on-camera command may need the Workers `wrangler tail` form.
- Required fix: align draft + video together at record time if the deployed project needs the Workers form; do not diverge silently. (Pre-existing; tracked in spec/video Needs-human-decision.)

### Note: schema `requiredFragments` Sentry flow

- The schema/draft/grounding consistently use `search_issues → get_sentry_resource` (the earlier `get_issue_details` drift is already resolved). No action.

## Spec Compliance

- Thesis: pass — multi-source synthesis thesis intact; bug swap preserves it.
- Learning outcomes: pass — all six outcomes still satisfied (ticket parse, Sentry/wrangler evidence, local repro, debug-as-test, multi-layer verify, swallowed-error class).
- Behavioral change: pass.
- Required example/demo: pass — rate-path swallowed-error fully specified; runtime determinism **verified by spike (2026-05-30)**.
- Failure mode: pass — single-source debugging + optional-test failure modes retargeted to rate.ts.
- Bridge in/out: pass — bridge-out updated to "rate.ts, SRS state, review_states" for m4-l1.

## Grounding And External Checks

- Verified claims: rate.ts returns 500/404 today (swallow is introduced by the plant); `console.warn("review/rate: update_failed ...")` pre-exists; `review_states` has no CHECK constraints; `fetchDueCards` selects `.lte("due", now)`; review API + `src/lib/srs.ts` have zero tests; full 10xCards suite is 7 files, none touching the rate path; no Playwright/e2e installed.
- Unsupported or softened claims: exact deterministic UPDATE-failure variant (flagged in spec + grounding + video as needs-verification).
- Open verification: §0 spike (above). Sentry MCP `search_issues`/`get_sentry_resource` and wrangler/Playwright facts unchanged and previously verified.

## Curriculum Continuity

- Previous lesson fit (m3-l4): pass — Playwright reused diagnostically; bridge intact.
- Next lesson setup (m4-l1): pass — bridge-out retargeted.
- Potential duplicates: none new — structured-input/debug-as-test boundaries with M3L2 unchanged.
- Scope theft risk: none — rate/SRS path is untouched by other lessons; the debug-as-test doubles as the first Phase-4 SRS test (noted as a human decision).

## Editorial Quality

- Style guide fit: pass — house voice, short paragraphs, `ty`/`my`, lesson cross-refs use `Title (M3Lx)`.
- AI-sounding patterns: none flagged.
- Polish/prose issues: the one Polglish phrase (`fix swallowania`) was fixed in the editor pass.

## Diagram Quality

- Diagrams present: 4 (triage TD, root-cause LR, verification LR, four-entry-point TD).
- Placement: each next to the claim it supports.
- Changed by swap: root-cause LR (swallow-and-restale loop) and verification LR (labels) — **must be re-rendered** for slides. Triage + convergence unchanged.
- Syntax: valid mermaid.

## Video Alignment

- Issue — scenario text is aligned to the new bug, but recorded footage is not (Major, above). No narrative contradiction within the updated scenario itself.

## Side-Effect Ledger

New claims introduced:
- Planted bug now in `rate.ts` (SRS rate handler); detection signal `review/rate: update_failed`; two-part plant (deterministic runtime-invalid UPDATE + swallow).
- Escape framing shifted to "Risk #6 / Phase 4 not started; rate path has no test at all."

Claims removed:
- Retired save-session FK / `orphan_review_state` bug as the planted example.

Neighboring lesson references changed:
- m3-l1 referencesOnly retargeted from "review_states gap" to "SRS Risk #6, phase not built."

Prework references used: (none new)

Prework concepts repeated intentionally: (none)

Potential duplicates: (none)

Unsupported facts:
- (none) — deterministic UPDATE-failure variant verified by spike (2026-05-30); only the demo-card seed remains a recording-time choice.

Video/text mismatches:
- Recorded V1 footage demos the retired bug; scenario re-written, re-cut pending.

Needs human decision:
- Confirm narrative shift (ad-hoc gate → Phase 4 not started) — recommended: yes.
- ~~Pick deterministic-cause variant~~ RESOLVED by spike: fractional→integer `scheduled_days` (PG 22P02), `{ ok: true }` swallow.
- Decide whether the debug-as-test ships as the real first Phase-4 test in 10xCards.
- Resolve `[TODO-LINK]` certification URL.
- Resolve `wrangler pages` vs Workers `tail` form for on-camera use.

## Acceptance Checklist

- [x] §0 deterministic-failure mechanism verified against local Supabase (spike 2026-05-30): PG 22P02, `pnpm exec astro check` clean, `pnpm exec vitest run` 50/50, lint-staged/eslint clean, swallow corrected to `{ ok: true }`. Deploy-side Sentry/wrangler capture still to confirm at recording time.
- [ ] `[TODO-LINK]` certification URL filled in
- [ ] Root-cause + verification mermaids re-rendered for slides
- [ ] Video V1 re-recorded against the rate-path scenario
- [ ] `wrangler pages` vs Workers `tail` form reconciled across draft + video
- [ ] Narrative shift + debug-as-test-as-Phase-4 decisions confirmed by author
