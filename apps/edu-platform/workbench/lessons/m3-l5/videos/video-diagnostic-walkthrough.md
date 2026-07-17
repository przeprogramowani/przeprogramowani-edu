# Video Scenario: m3-l5 — Full diagnostic walkthrough (V1)

> **STATUS: SUPERSEDED BY TEXT (3. edycja).** Nie nagrywany w 10xDevs 3.0 — treść zastąpiona pełnym tekstem (ticket → triage → dowody → synteza → test → fix) i 5 mermaidami w `lesson-draft.md`. Zachowany jako materiał referencyjny; kandydat do nagrania w 4. edycji.

## Purpose

Make observable the one thing the written lesson can only narrate: a production diagnosis is built by **synthesizing evidence from multiple independent sources**, none of which is sufficient on its own. The learner watches the presenter drive an agent across four sources — Sentry (location), wrangler tail (scale), Playwright (client-side context), the codebase (root cause) — and sees the moment they converge into a single diagnosis. Then: a failing test that proves the root cause, a small fix, and verification that mirrors the investigation in reverse.

The transferable skill the video proves is **driving a multi-source investigation**, not operating any single tool. Each clip should end with the learner thinking "I see what each source added that the others couldn't."

This video is recorded as **4 standalone clips** (not one 10–15 min take). Each clip has a clean entry and exit state so any clip can be re-recorded without redoing the others. Stitched together they run ~10–13 minutes.

This video does NOT cover: Sentry SDK setup (Deep Dive / text), wrangler/Cloudflare configuration, E2E test generation or Playwright setup (m3-l4), the triage *taxonomy* beyond the one decision this bug needs (the draft's triage diagram carries that). V2 (standalone triage demo) is deferred post-premiere.

## Założenia

- 10xCards is deployed on Cloudflare **Workers** with the planted swallowed-error bug live (`src/pages/api/review/[flashcardId]/rate.ts`: the `review_states` UPDATE fails at runtime and the handler swallows it, returning 200 with the in-memory FSRS card; the schedule never persists, so the rated card keeps coming back to review).
- Sentry is configured on the deployed app and is **actively capturing** the `review/rate: update_failed` issue (the issue is `unresolved` and visible for clips 1–3).
- Sentry MCP server is wired into Claude Code and authenticated.
- `wrangler` is authenticated against the `10xcards-30` project; `wrangler ... tail` streams live.
- Playwright MCP is wired into the agent for local reproduction.
- The failing integration test and the fix are written and staged off-camera, so they can be produced cleanly on demand (the presenter is *demonstrating* a known result, not improvising the fix live).
- The learner has completed m3-l1 → m3-l4 and read (or is reading) the m3-l5 draft. They know what MCP, Sentry-as-monitoring, and Playwright-as-browser-tool are — the video does not re-teach these.

## Materiały i setup nagrania

- **Repo:** 10xCards (`/Users/admin/code/10xCards`)
- **Deployed env:** Cloudflare Workers, project `10xcards-30`, with the planted bug live and Sentry capturing
- **Narzędzie główne:** Claude Code (terminal), with Sentry MCP + Playwright MCP available
- **Local app:** `npm run dev` → `http://localhost:3000`
- **Bug file:** `src/pages/api/review/[flashcardId]/rate.ts` (the `updateError`/`!saved` guards swallow the failure and return 200 with the in-memory `updated` card; the `.update({...})` payload writes a value the DB rejects every time)
- **Pliki tworzone/edytowane on camera:**
  - failing integration test (staged, pasted/applied on camera): seed a due `review_states` row → rate "Good" → assert the *persisted* `due` advanced
  - fix in `rate.ts`: restore the correct UPDATE write AND restore `return jsonResponse(500, { error: "rate_failed" })` instead of the swallowed 200
- **Stan fallback:** none planned — user chose full-live setup. The only non-negotiable is the **reset points** below.
- **Reset points (critical):**
  - Git: clean working tree before each clip; the fix from Clip 4 must be reverted (and not deployed) before re-recording Clips 1–3.
  - Local DB: a seed/reset that reproduces the bug — at least one `review_states` row that is **due** (`due <= now`) and that does **not** advance when rated — for Clips 1–3.
  - Deterministic cause confirmed: before recording, verify the planted UPDATE fails on every rating against local Supabase + the deploy (so `update_failed` actually fires). See `lessons/m3-l5/bug-swap-plan.md` §0.
  - Sentry: issue `review/rate: update_failed` must be **unresolved** during Clips 1–3 and only shown **resolved/decaying** in Clip 4 (record Clip 4 last, after the fix is deployed).

---

## Clip 1 — Od ticketa do planu dochodzenia

**Format:** `hybrid` (brief presentation of the triage diagram + live agent interaction)

**Cel:** Show the hardest starting point (a one-sentence ticket) becoming an actionable plan, and the single triage decision this symptom forces: start with monitoring.

**Na ekranie:**

- The ticket text as a card/overlay: *"Oceniam fiszkę jako »Dobre«, ale wciąż wraca do powtórki — ciągle widzę te same karty."*
- Claude Code terminal in the 10xCards repo
- The triage decision diagram from the draft (`flowchart TD`, symptom → first source) shown as a slide/overlay at the decision moment

**Przebieg:**

1. Prowadzący (recognition-level, no code yet): "Zbudowaliśmy w tym module proaktywny pipeline. A teraz przychodzi ticket. Żadnego stack trace'a, żadnego kodu błędu. Jedno zdanie."
2. Paste the ticket into the agent and ask it to turn the report into structured debug input — kroki reprodukcji, zakres, częstotliwość, możliwy obszar.
3. Agent returns the structured breakdown. Presenter reads the key lines on screen:
   - Kroki: otwórz powtórkę → oceń kartę „Dobre" → odśwież → ta sama karta nadal czeka
   - Zakres: ocena zwraca sukces, harmonogram się nie zmienia
   - Częstotliwość: za każdym razem
   - Obszar: trasa oceniania → UPDATE na `review_states`
4. Prowadzący: "Agent nie zna jeszcze odpowiedzi. Ale zna pytania. Teraz decyzja: gdzie szukać najpierw?"
5. Show the triage diagram. Prowadzący points to the "200 OK, ale efekt boczny nie działa" branch → Monitoring: "Ocena zwraca sukces, a harmonogram po cichu się nie zapisuje. To sygnał na monitoring. Zaczynamy od Sentry."

**Rezultat:** Structured debug input is on screen; the triage decision (start with Sentry) is made and justified by the symptom shape.

**Most do tekstu:** Draft `## Od ticketa do planu dochodzenia`, including the triage `flowchart TD`. Covers learning outcome 1.

---

## Clip 2 — Dowody z produkcji: Sentry i wrangler

**Format:** `live-demo`

**Cel:** Show monitoring giving what the ticket couldn't — exact location — and runtime logs giving scale. Two sources, two distinct pieces of information.

**Na ekranie:**

- Claude Code terminal with Sentry MCP active
- Second terminal pane (or split) for `wrangler ... tail`
- Browser/terminal showing the resulting stack trace pointing at `rate.ts` (the swallowed UPDATE guard)

**Przebieg:**

1. Prowadzący: "Mam skonfigurowane Sentry. Agent odpyta je przez MCP, bez wychodzenia z terminala." (One line on *why MCP, not `sentry-cli`*: CLI is for release/source-map tasks; MCP exposes issues as structured data the agent synthesizes in its loop.)
2. Agent runs the Sentry MCP flow:
   - `search_issues` (pass-through, no LLM key needed) with a query like `message:update_failed is:unresolved`
   - finds the issue, then `get_sentry_resource(resourceType="issue", resourceId="...", organizationSlug="...")` for the full detail
3. On screen: stack trace → `rate.ts`, the `review_states` UPDATE that errors and is caught; breadcrumbs show the rating context just before the error.
4. Prowadzący names the first layer: "Błąd istnieje — nieudany UPDATE do `review_states`. Lokalizacja — `rate.ts`, obsługa wyniku zapisu. Kontekst — przy ocenie karty. Bez monitoringu ta informacja byłaby zakopana w logach albo nigdzie."
5. Switch to the wrangler pane. Run:
   ```bash
   npx wrangler pages deployment tail --project-name 10xcards-30 \
     --format json --search "update_failed"
   ```
6. **On camera, rate one card** in the deployed app (or have a second device do it) so a fresh `console.warn "review/rate: update_failed"` line appears in the live tail.
7. Prowadzący: "`console.warn` po każdej ocenie. To nie problem sporadyczny — to każdy użytkownik, za każdym razem. Sentry dał lokalizację, logi dają skalę."
8. One line on transferability: "Wrangler to przykład dla Cloudflare. Fly ma `flyctl logs`, Vercel `vercel logs`. Wzorzec ten sam: odpytaj strumień logów platformy, filtruj po komunikacie."

**Rezultat:** Two evidence layers on screen — location (Sentry) + scale (wrangler). Enough to justify moving to local reproduction.

**Most do tekstu:** Draft `### Sentry MCP — dane z produkcji` and `### Runtime logs jako uzupełniający sygnał`. Covers learning outcome 2. Deep Dive carries the exact MCP setup.

---

## Clip 3 — Reprodukcja lokalna i synteza

**Format:** `live-demo`

**Cel:** Confirm the bug reproduces locally, use Playwright to *rule out* a frontend cause (diagnosis includes proving what it ISN'T), then read the code and watch all four sources converge into the root cause.

**Na ekranie:**

- Local 10xCards (`http://localhost:3000`) in the browser, driven by Playwright MCP
- Terminal showing `browser_console_messages` and `browser_network_requests` output
- `rate.ts` open at the swallowed UPDATE guard
- The root-cause data-flow diagram (draft `flowchart LR`, swallow-and-restale loop) shown at the synthesis moment

**Przebieg:**

1. Prowadzący: "Zanim agent zacznie czytać kod, potwierdzamy, że bug reprodukuje się lokalnie." Agent drives Playwright: open review → rate a due card "Good" → reload review. **Ta sama karta nadal czeka.** Symptom confirmed.
2. Rule out the frontend with two Playwright MCP tools:
   - `browser_console_messages` → no JS errors → "To wyklucza frontend."
   - `browser_network_requests` → `POST /api/review/<id>/rate` returns **200 with a card that looks advanced**, but the follow-up `GET /api/review/due` returns **200 with the same card still in the queue** → "Serwer zgłasza sukces, ale nowy termin nigdy się nie zapisuje. To problem po stronie serwera, w danych."
3. Prowadzący: "Trzy źródła, trzy warstwy. Teraz agent czyta kod z celem, nie na ślepo."
4. Agent opens `rate.ts` and finds the swallowed guard:
   ```typescript
   if (updateError) {
     console.warn(`review/rate: update_failed ...`);
     return jsonResponse(200, { ok: true }); // ← błąd połknięty, zwracamy „sukces"
   }
   ```
5. **The synthesis moment.** Presenter cross-references on screen: Sentry said the `review_states` UPDATE errors; the handler catches it, logs `console.warn`, and returns `200 { ok: true }` instead of propagating a 500; the new schedule never persists; `fetchDueCards` re-selects the card on `.lte("due", now)` → hence 200 OK + card keeps coming back.
6. Show the root-cause data-flow diagram. Prowadzący lands the thesis explicitly: "Zwróć uwagę — żadne pojedyncze źródło nie wystarczyło. Sentry dał lokalizację, logi skalę, reprodukcja kontekst, kod root cause. To jest ta umiejętność: prowadzenie dochodzenia, w którym każde źródło dodaje coś, czego inne nie miały."

**Rezultat:** Root cause is established and visibly *earned* from four converging sources, not from staring at code.

**Most do tekstu:** Draft `### Reprodukcja lokalna` and `### Synteza — dowody się zbiegają`, including the root-cause `flowchart LR`. Covers learning outcome 3 and the primary failure mode (single-source debugging).

---

## Clip 4 — Test, fix i weryfikacja wielowarstwowa

**Format:** `live-demo`

**Cel:** Prove the root cause with a failing test *before* fixing (test-driven bugfixing), apply the fix, and verify across every layer that diagnosed the problem. Close with the swallowed-error pattern and the four-entry-point generalization.

> **Record this clip LAST.** It deploys/shows the fix. Sentry must show the issue resolving here, which means the bug can no longer be live for Clips 1–3 after this point.

**Na ekranie:**

- Test file + test runner output (red, then green)
- `rate.ts` diff (before/after)
- The verification fan-out diagram + the four-entry-point convergence diagram from the draft
- Quick return to Sentry/wrangler/local review to show each layer clean

**Przebieg:**

1. Prowadzący: "Zanim naprawimy — piszemy test." One sentence on the reasoning direction vs m3-l2: "W testach jednostkowych szliśmy od ryzyka do przodu. Tu idziemy odwrotnie: od symptomu wstecz." Name it: **test-driven bugfixing** (ustalona praktyka TDD, Kent Beck) — "nowe jest to, że agent prowadzi ten proces od symptomu do gotowej asercji."
2. Apply the staged integration test and run it — note it asserts the **persisted** row, not the API response:
   ```typescript
   test('rating a due card advances its persisted schedule', async () => {
     const { flashcardId } = await seedDueCard(accountId);
     await rateCard(flashcardId, 'Good');
     const row = await getReviewState(flashcardId);
     expect(new Date(row.due).getTime()).toBeGreaterThan(Date.now());
     expect(row.reps).toBe(1);
   });
   ```
   Test **fails** — the persisted `due` never moved. "Root cause potwierdzony kodem, nie domysłem. Ten test zostaje jako zabezpieczenie przed regresją — i jest pierwszym testem przejść harmonogramu SRS." Half-sentence on the secondary failure mode: "I nie, test nie jest opcjonalny — bez niego fix opiera się na tym samym czytaniu kodu, które stworzyło buga."
3. Apply the fix — two parts: stop swallowing, and fix the write:
   ```typescript
   // przed:
   if (updateError) {
     console.warn(`review/rate: update_failed ...`);
     return jsonResponse(200, { ok: true });
   }
   // po:
   if (updateError) {
     console.warn(`review/rate: update_failed ...`);
     return jsonResponse(500, { error: "rate_failed" });
   }
   ```
   …plus restoring the correct UPDATE payload so the write actually succeeds. Re-run the test → **green**. One line: "Najpierw przestajemy ukrywać błąd, dopiero potem możemy go zobaczyć i naprawić."
4. Show the verification fan-out diagram, then verify each layer on screen:
   - integration test passes ✓
   - local review: the rated card now leaves the due queue ✓
   - wrangler tail: no more `update_failed` ✓
   - Sentry: issue stops recurring / marked resolved ✓
   Prowadzący: "Weryfikacja to lustrzane odbicie dochodzenia. Diagnozowałeś czterema kanałami — weryfikujesz czterema."
5. Step back to the pattern: "To był swallowed error. API zwróciło 200, efekt boczny padł po cichu. OWASP w 2025 dodał tę klasę do Top 10. Jedynym sygnałem był monitoring — dlatego diagnostyka to siatka bezpieczeństwa pod proaktywnymi testami."
6. Close with the four-entry-point convergence diagram: "Ten sam proces — dowody → hipoteza → reprodukcja → test → fix → weryfikacja — działa niezależnie od punktu wejścia: unit fail, E2E fail, alert Sentry czy ticket. Zmienia się źródło danych, nie struktura dochodzenia." Brief bridge to module 4 (kod, którego jeszcze nie znasz).

**Rezultat:** Verified fix across all four layers; the bug class is named; the workflow is generalized. Module 3 arc closed.

**Most do tekstu:** Draft `### Najpierw test, który reprodukuje buga`, `### Fix i weryfikacja wielowarstwowa` (verification `flowchart LR`), `## Swallowed errors`, `## Jeden workflow, cztery punkty wejścia` (convergence `flowchart TD`). Covers learning outcomes 4, 5, 6 and the secondary failure mode.

---

## Pre-production TODO

### For `live-demo` segments (Clips 2–4):

- [ ] **Lock the deterministic-failure mechanism first** (bug-swap-plan.md §0): confirm the planted UPDATE fails on every rating against local Supabase, passes `npm run check` + `npm test`, and reproduces on the deploy
- [ ] 10xCards deployed on Workers (`10xcards-30`) with the planted bug **live and reproducing**
- [ ] Sentry `review/rate: update_failed` issue exists and is **unresolved** (Clips 1–3); plan to mark/show it resolved only in Clip 4
- [ ] Sentry MCP server authenticated in Claude Code; dry-run `search_issues` + `get_sentry_resource` once before recording
- [ ] `wrangler` authenticated; dry-run `wrangler pages deployment tail --project-name 10xcards-30 --format json --search "update_failed"`
- [ ] A way to **rate a card on camera** for the live wrangler line (second device/browser, or a prepared request)
- [ ] Playwright MCP wired; dry-run the local repro flow (open review → rate "Good" → reload → same card still due)
- [ ] Local DB seeded so the bug reproduces (at least one due `review_states` row that does not advance when rated)
- [ ] Failing integration test staged; fix staged as a diff ready to apply
- [ ] `npm run dev` running, `localhost:3000` reachable

### For `hybrid`/`presentation` bits (Clip 1 + diagrams):

- [ ] Render the 4 draft mermaid diagrams to images (triage, root-cause data flow, verification fan-out, four-entry-point convergence) via the `mermaid` skill — ready as overlays/slides. **Re-render the root-cause and verification diagrams** — they changed with the bug swap.
- [ ] Ticket text prepared as a clean on-screen card

### General:

- [ ] Terminal font large enough to read stack traces, JSON, and YAML snippets on camera
- [ ] Split layout planned: terminal + browser, and terminal + wrangler pane
- [ ] **Reset points per clip:** git clean tree + DB reseed before each take; ensure Clip 4's fix is reverted and NOT deployed before re-recording Clips 1–3
- [ ] Record **Clip 4 last** (it resolves the Sentry issue and fixes local state)
- [ ] Per-clip length target ~2–3.5 min; total ~10–13 min after editing

## Video/text mismatches

- (none in narrative) — all four clips track the draft section-by-section and use the same planted bug, same code, same fix, same diagrams.
- Terminology note (not a learner-facing mismatch): the draft's learner prose uses **"test-driven bugfixing" / "test reprodukujący buga"**; the inline `[VIDEO PLACEHOLDER]` in the draft and the schema `owns` use the internal shorthand "debug-as-test". Presenter dialogue here uses the learner-facing term. Keep consistent.

## Claims introduced only in video

- (none) — every on-screen claim (Sentry location, wrangler scale, Playwright console/network findings, root cause, fix, OWASP A10:2025, test-driven bugfixing) is already in the draft and grounding.

## Needs human decision

- **Deterministic-failure variant:** the exact planted cause (integer coercion vs NOT-NULL-via-NaN, bug-swap-plan.md §0) must be chosen and confirmed before recording — otherwise the bug may not reproduce on camera and `update_failed` may not fire. Recommend: integer coercion, verified against local Supabase.
- **Sentry resolution display in Clip 4:** decide whether to show the issue auto-decaying after the fix deploy, or to manually mark it resolved on camera. Auto-decay is more authentic but slower; manual resolve is faster and clearer. Recommend: manual resolve with one line acknowledging it ("normalnie Sentry sam przestanie to łapać po wdrożeniu").
- **`wrangler pages deployment tail` vs Workers:** the draft uses the `pages deployment tail` form while CLAUDE.md/grounding note 10xCards deploys via Workers. The scenario mirrors the draft verbatim for text alignment. If the deployed project actually needs `wrangler tail` (Workers form) at record time, align the draft and this scenario together — do not silently diverge on camera.
