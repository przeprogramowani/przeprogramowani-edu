# Plan: swap m3-l5 example bug → `swallow-rate-update-200`

**Why:** the retired bug (`save-session.ts`, `review_states.flashcard_id` = draft UUID → FK violation → swallowed `orphan_review_state`) is now the canonical assertion of 10xCards test-plan **Phase 2** (`save-session.invariants.integration.test.ts`, "exactly one review_states row per promoted card"). It no longer credibly "escapes the pipeline."

**Replacement:** a swallowed-error in the SRS **rate** path (`src/pages/api/review/[flashcardId]/rate.ts`). The review/SRS tree (`src/pages/api/review/**`, `src/lib/srs.ts`, `src/lib/review-queries.ts`) has **zero** tests; SRS-transition correctness is test-plan **Risk #6 / Phase 4 — NOT STARTED**. Verified: full suite is 7 files, none touch the rate path; no Playwright installed.

Scope of this plan: `lessons/m3-l5/lesson-draft.md` + `lessons/m3-l5/videos/video-diagnostic-walkthrough.md`. Companion artifacts (spec, schema, grounding) listed in §6 as required-for-consistency.

---

## 0. DECISION TO LOCK FIRST — the bug mechanism (blocks everything)

The old bug had two parts: a deterministic **cause** (wrong ID → FK rejects every insert) + a **swallow** (try/catch → `console.warn` → 200). The replacement must keep both, because:

- **Determinism** is required so the bug reproduces live on camera and on the deployed app.
- **A monitoring signal is required** — the entire lesson thesis ("monitoring is the only standing signal") and Clip 2 (Sentry + wrangler) depend on a `console.warn`/Sentry issue firing. A variant where the DB write *succeeds* (e.g. silently dropping `due` from the payload) emits **nothing** → kills Clip 2. Rejected.
- **It must be type-valid TypeScript** so it escapes the m3-l3 hooks/typecheck gate (the lesson states "TypeScript jest poprawny"). A wrong/typo'd column name would fail `astro check` → rejected. The fault must be a *valid type, invalid value* (exactly the property the old FK bug had).

**Two-part plant (recommended shape):**

1. **Cause** — in the `.update({…})` payload (`rate.ts:83–103`), write a type-valid value the DB rejects at runtime, so every rate errors. Candidates, in order to try (spike against local Supabase first):
   - **(A, preferred) integer-column coercion** — feed a fractional `number` into an `integer` column (`elapsed_days`/`scheduled_days`/`learning_steps`/`reps`/`lapses` are `integer not null`; `stability`/`difficulty` are `double precision`). e.g. map a float source into `scheduled_days`. PG rejects non-integer for an integer column → deterministic `updateError`. Type-valid (`number`→`number`). Realistic as a field-mapping slip.
   - **(B, backup) NOT NULL via NaN** — a planted arithmetic slip yields `NaN` for a NOT NULL numeric; JSON serializes `NaN`→`null`; `null` violates NOT NULL → deterministic `updateError`. Type-valid (`number`).
   - Rejected: wrong column name (fails `astro check`); invalid date string into `timestamptz` (PG date parsing too lenient/version-dependent → not reliably deterministic).
2. **Swallow** — change the existing guards so the runtime failure returns success with the in-memory card instead of an error:
   ```ts
   // rate.ts — PLANTED (replaces the updateError / !saved guards)
   if (updateError) {
     console.warn(`review/rate: update_failed code=${updateError.code ?? "unknown"} (userId=${user.id} flashcardId=${flashcardId})`);
     return jsonResponse(200, { ok: true });   // was: 500 { error: "rate_failed" }
   }
   if (!saved) {
     return jsonResponse(200, { ok: true });   // was: 404 { error: "not_found" }
   }
   const response: RateResponse = saved;
   return jsonResponse(200, response);
   ```
   > Spike note: `updated as RateResponse` was the first idea but fails `TS2352` (`Card.due:Date` vs `RateResponse.due:string`). `{ ok: true }` is type-clean and matches the existing save-session swallow precedent.

**The fix the learner restores:** revert the `cause` write to the correct value AND restore `return jsonResponse(500, { error: "rate_failed" })`. (Still small; the "best-effort write treated as success" mistake.)

**Why this reproduces & stays stale:** the persisted row never advances, so its `due` stays in the past; `fetchDueCards` (`review-queries.ts`, `.lte("due", now)`) re-selects the same card on every `GET /api/review/due` → "the card I rated keeps coming back."

**Acceptance gate — VERIFIED by spike 2026-05-30** (running local Supabase; plant applied to `rate.ts`, then reverted; repo left clean). Findings, including corrections to earlier assumptions:

- [x] **Deterministic DB failure.** Fractional value into the `integer` column `scheduled_days` → PG **`22P02` invalid input syntax for type integer** on every UPDATE (PostgREST rejects, does not round). Comparing `due` as **timestamps** (not ISO strings — string form differs by `.000Z` vs microseconds, a red herring): after the errored UPDATE `due` is **exactly baseline and still in the past**; the UPDATE is atomic, nothing partially writes. Control: a valid integer write advances `due` into the future. Fallbacks measured, all deterministic + type-valid: `reps: NaN`→`null` `23502`; `state: 40000` `22003`. ✓
- [x] **Escapes the real pre-commit gate.** The Husky `pre-commit` hook is `npx lint-staged` → `eslint --fix` + `prettier` **only** (no typecheck, no tests). `eslint` on the planted `rate.ts`: **0 errors** (2 pre-existing `no-console` warnings, unrelated). ✓
- [x] **Escapes the typecheck gate.** Tool is `astro check` (`@astrojs/check` 4.1.0) via `pnpm exec astro check` — **0 errors, 0 warnings** with the plant applied. ✓
- [x] **Escapes the test suite.** `pnpm exec vitest run`: **50 tests pass**, identical to the clean repo (the lone "failed suite" `setup.ts` "No test suite found" is a pre-existing config artifact, present clean too, unrelated to the plant). No test touches the rate path. ✓
- [ ] Recording-prep only: ticket wording — `ReviewSession.tsx` `handleRate` advances on `res.ok` with **no re-fetch** (verified in source), so mid-session the next card just shows; the stale card reappears on **reload / next session**. Word the ticket around "wraca do powtórki / następnego dnia", not "natychmiast".

**CORRECTIONS to earlier plan assumptions (now fixed in artifacts):**
- 10xCards has **no `npm run check` script** and **no `npm test`-runnable vitest via npm** — it's a **pnpm** repo. Real commands: `pnpm exec astro check`, `pnpm exec vitest run`. (Workbench CLAUDE.md's `npm run check`/`npm test`/`npm run build` triad is the *edu-platform* convention, not 10xCards.)
- The draft's swallow form `return jsonResponse(200, updated as RateResponse)` **does NOT typecheck** — `TS2352`, because ts-fsrs `Card.due` is `Date` but `RateResponse.due` is `string`. **Switched to `return jsonResponse(200, { ok: true })`**, which is type-clean, one line, and mirrors the *existing* save-session swallow precedent in the same codebase (`src/lib/save-session.ts` returns `{ ok: true }` on a swallowed `orphan_review_state`). Stronger pedagogy: the planted bug copies the team's own established swallow pattern.

**Locked plant (both parts):**
1. Cause (realistic): in the `.update({...})` payload, `scheduled_days: (updated.due.getTime() - now.getTime()) / 86_400_000` — interval re-derived from timestamps, `Math.round` forgotten → fractional → `22P02`. Type-valid. (Bulletproof fallback if you want zero on-camera risk: an explicit non-integer.)
2. Swallow: the `updateError` and `!saved` guards `return jsonResponse(200, { ok: true })` instead of `500`/`404`.
   Fix the learner restores: revert the write to `updated.scheduled_days` **and** restore `return jsonResponse(500, { error: "rate_failed" })`.

**Recording-prep note (interval must be non-integer):** FSRS runs with `enable_fuzz: true` (`src/lib/srs.ts`), so a "Good" interval on a card with prior history is essentially always fractional-days → the plant fires reliably. Seed the demo/test card with review history (multi-day interval), not a brand-new card, or keep an explicit fraction. Decide at recording time.

**New canonical strings** (search-and-replace anchors for all prose):
- Sentry issue / log: `orphan_review_state` → `review/rate: update_failed`
- Bug file/loc: `save-session.ts:84/88` → `rate.ts` (swallow ~`:105–110`, write ~`:83–103`)
- Ticket: *"Wygenerowałem fiszki, widzę je w talii, ale powtórka jest pusta."* → *"Oceniam fiszkę jako »Dobre«, ale wciąż wraca do powtórki — ciągle widzę te same karty."*
- Symptom: "deck pełna, powtórka pusta" → "ocena zwraca sukces, ale karta nie znika z kolejki / wraca następnego dnia"

---

## 1. The one genuine narrative change (not a string swap)

The retired bug's escape story: *"an integration test for this invariant exists but its gate is ad-hoc, so the regression didn't run it."* The replacement's story: *"SRS-transition correctness (Risk #6) is a **named but not-yet-built** phase — the team shipped the wedge/atomic-save invariant first; this path has **no test at all**, so monitoring is the only standing signal."* This is a **stronger** "uncovered" position (no test even touches the code) and more realistic. Every place the draft/spec leans on "the ad-hoc integration test that could've caught it" must be rewritten to the not-started-phase framing.

Affected prose: draft `:11`, draft `:226–232` (Swallowed-errors per-layer bullets), spec "Required Example", schema `owns`/`requiredFragments`.

---

## 2. `lesson-draft.md` — change map (anchors from current file)

| Lines | Section | Change |
|---|---|---|
| `:7–8` | intro ticket | New rate ticket. |
| `:11` | "why the pipeline missed it" | Rewrite per §1: rate/SRS path has **zero** tests; Phase 4 not started. Keep the "hermetic stubs / hooks / E2E pass" structure but retarget — hermetic stubs cover the **save** path, not rate; the would-catch test **does not exist yet** (Phase 4). |
| `:19` | VIDEO PLACEHOLDER | Update bug + flow description to the rate-path walkthrough. |
| `:31–38` | structured debug input | New "Kroki reprodukcji" (otwórz powtórkę → oceń kartę »Dobre« → odśwież → ta sama karta); "Zakres" (ocena zwraca sukces, harmonogram się nie zmienia); "Obszar" trasa `rate` → `review_states` UPDATE. |
| `:40–57` | triage | Symptom still "200 OK, ale efekt boczny nie działa" → Monitoring → Sentry. Prose: "Zapis zwraca sukces" → "Ocena karty zwraca sukces". |
| `:48–55` | triage mermaid | **No structural change** — branch still valid. (Re-render only if labels touched.) |
| `:62–77` | Sentry MCP | Issue `orphan_review_state` → `review/rate: update_failed`; location `save-session.ts:88` → `rate.ts:~108`; "FK violation przy insercie" → "runtime error na UPDATE do `review_states`, połknięty przez handler". |
| `:79–94` | runtime logs | `--search "orphan_review_state"` → `--search "update_failed"`; "console.warn po każdym zapisie" → "po każdej ocenie karty". |
| `:96–110` | reprodukcja lokalna | Repro = rate a due card. `browser_console_messages`: clean. `browser_network_requests`: `POST /api/review/<id>/rate` → **200 z kartą wyglądającą na zaktualizowaną**; follow-up `GET /api/review/due` → **ta sama karta nadal obecna** (was: GET powtórki → 200 pusta tablica). |
| `:116–129` | synteza / code snippet | Replace the `acceptedDrafts.map(d=>d.id)` snippet with the rate.ts swallow + bad-write snippet. Explanation: UPDATE fails at runtime → `updateError` swallowed into 200 with in-memory `updated` → `due` never persists. |
| `:131–141` | root-cause mermaid (LR) | Rebuild: `scheduler.next → updated (in-memory)` → `UPDATE review_states (rejected)` → `catch: warn + return 200 updated` → `due niezmienione` → `fetchDueCards .lte(due,now) re-selects`. **Re-render.** |
| `:143–150` | "no single source" bullets | Retarget file/line names (Sentry → rate.ts; repro → rate→reload context). |
| `:152–182` | debug-as-test | New test: seed a due `review_states` row → `POST /rate` rating Good → re-query **persisted** row → assert `due > now` and `reps` incremented (assert DB, not response body). Keep the proactive-vs-reactive m3-l2 contrast. |
| `:184–212` | fix + verification | Fix snippet → restore correct write + 500. Verification mermaid labels: "Wrangler tail: brak orphan_review_state" → "brak update_failed"; "powtórka pokazuje fiszki" → "oceniona karta znika z kolejki due"; test label → "test transcji review-rate". **Re-render verification mermaid.** |
| `:214–234` | Swallowed errors | Keep OWASP A10 framing. Rewrite per-layer bullets `:226–230` per §1 (no test touches rate path; Phase 4 not started). |
| `:236–258` | four entry points | Generic — **no change** (convergence mermaid unchanged). |
| `:272–373` | Deep Dive | `:335` `search_issues(query="orphan_review_state")` → `"update_failed"`. Sentry/wrangler/Playwright setup prose otherwise generic — leave. |
| `:375–387` | Materiały dodatkowe | No bug-specific links — **no change**. |

---

## 3. `video-diagnostic-walkthrough.md` — change map (4 clips track the draft 1:1)

| Lines | Where | Change |
|---|---|---|
| `:15–16` | Założenia | Bug = rate-path swallow; Sentry issue `update_failed`. |
| `:29, :32` | Materiały | Bug file `rate.ts` + lines; fix = restore correct write + 500 (not `acceptedDrafts→upserted`). |
| `:34–37` | **Reset points** | Seed = **a due card that does not advance when rated** (not "deck populated, review_states empty"). Sentry `update_failed` unresolved for Clips 1–3. The deterministic cause (§0) must be confirmed live. |
| `:49, :58–63` | Clip 1 | Ticket; kroki reprodukcji; obszar (rate→review_states UPDATE). Triage decision unchanged. |
| `:81, :87–96` | Clip 2 | Stack/log location `rate.ts`; `search_issues` query `update_failed`; wrangler `--search "update_failed"`; trigger = **rate a card on camera** (not save); "console.warn po każdej ocenie". |
| `:114–134` | Clip 3 | Repro = rate due card → reload → same card. Network: `POST /rate` 200 + `GET /api/review/due` same card (not empty deck). Code snippet → rate.ts swallow. Synthesis + root-cause diagram retargeted. |
| `:153, :162–184` | Clip 4 | Test snippet → rate-transition test; fix diff → restore correct write + 500; verification labels (`update_failed` cleared, "card leaves due queue"). |
| `:199–207` | Pre-production TODO | Planted bug live + **deterministic cause confirmed**; Sentry `update_failed`; wrangler dry-run; Playwright repro = rate→reload; seed = due card that won't advance. |
| `:222–235` | mismatches / decisions | Refresh; carry forward open decisions (§5). |

**Diagrams to re-render** (the `mermaid` skill, per video TODO `:211`): root-cause data-flow, verification fan-out. Triage + four-entry-point convergence unchanged.

---

## 4. Reproduction realism — extra checks the old bug didn't need

The old FK bug was inherently deterministic; this one is not free. Before recording / finalizing prose:
- Mechanism passed the §0 acceptance gate (spike 2026-05-30): astro check clean, vitest 50/50, lint-staged/eslint clean, fires on local Supabase with PG 22P02, due stale-on-reload.
- Decide the on-camera trigger (rate a card) and confirm the **deployed** app shows `update_failed` in `wrangler tail` and Sentry.
- Confirm `ReviewSession.tsx` advance behavior → set ticket/symptom wording (mid-session vs next-session).

---

## 5. Open decisions (carry into RC review)

1. Confirm the narrative shift in §1 is acceptable (recommended: yes). 
2. Pick the §0 cause variant after the spike (recommended: A — integer coercion).
3. Does the debug-as-test ship as the real **first Phase-4 test** in 10xCards (advances the backlog) or stay lesson-only?
4. Pre-existing (unchanged by this swap): schema `requiredFragments` still says `search_issues → get_issue_details` (draft uses `get_sentry_resource`); `wrangler pages deployment tail` vs Workers `wrangler tail` form.

---

## 6. Companion artifacts (required for consistency — edit BEFORE the draft)

Per workbench discipline the spec/schema are source of truth, and per memory **run lesson-editor-pl before lesson-rc-review** (never parallel):

1. `lessons/m3-l5/lesson-spec.md` — "Required Example/Demo", thesis symptom, structural beats, owned-concept swallowed-error wording.
2. `lessons-schema.json` (m3-l5 object only) — `owns` + `requiredFragments` bug identity; `groundingSources` if any was save-session-specific; `sideEffectLedger` if it records the planted bug.
3. `lessons/m3-l5/lesson-grounding.md` — check for save-session/orphan_review_state specifics.
4. `lessons/m3-l5/rc-review.md` — regenerate after edits.

## 7. Sequence

1. Spike the §0 mechanism in 10xCards; pass the acceptance gate. **(blocks all prose)**
2. Update spec → schema (§6.1–6.2).
3. Update `lesson-draft.md` (§2).
4. Re-render the 2 changed mermaids; update `video-diagnostic-walkthrough.md` (§3).
5. `lesson-editor-pl` on draft, then `lesson-rc-review` (sequential).
6. Resolve §5 decisions; update side-effect ledger.

---

### Side-Effect Ledger (this plan)
```
New claims introduced:
  - m3-l5 planted bug moves to the SRS rate handler; detection signal `review/rate: update_failed`.
  - Bug is a two-part plant (deterministic type-valid runtime-failing UPDATE + swallow), required for live reproduction + a monitoring signal.
  - Escape framing shifts from "ad-hoc gate, test exists" to "Risk #6 / Phase 4 not started, no test touches the path."
Claims removed:
  - The save-session FK / orphan_review_state bug as the lesson's example.
Neighboring lesson references changed:
  - (none expected) — verify m3-l5 dependsOn/preparesFor don't assert the deck/generate symptom.
Prework references used / repeated: (none)
Potential duplicates: (none) — rate path untouched by other lessons/tests.
Unsupported facts:
  - The deterministic cause is VERIFIED (spike 2026-05-30): fractional → integer `scheduled_days` → PG 22P02; escapes astro check + vitest (50/50) + lint-staged/eslint; swallow is `{ ok: true }` (type-clean), not `updated as RateResponse` (TS2352).
Video/text mismatches:
  - Existing video (commit e9079655) demos the OLD bug end-to-end; must be re-cut per §3.
Needs human decision: see §5.
```
