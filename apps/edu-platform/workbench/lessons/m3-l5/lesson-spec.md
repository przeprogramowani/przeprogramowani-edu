# Lesson Spec: m3-l5 — Debugowanie z AI: od stack trace'a do gotowego fixa

## Schema Context

- Course: 10xdevs-3
- Module: AI Development Quality & Maintenance (m3, lesson 5/5)
- Position: moduleOrder 5 / globalOrder 15
- Depends on: m3-l4 (Testy E2E: Playwright, MCP i multimodalne scenariusze)
- Prepares for: m4-l1 (Nowy-stary projekt? Agent zbuduje Ci mapę i wyjaśni architekturę)

## Prework Continuity

- Relevant prework lessons: 1.2 (Chatbot vs Agent vs Harness), 2.3 (Claude Code basics), 3.2 (Wzorce promptowania), 3.3 (Cykl życia wątku)
- Assumed from prework: MCP servers as agent tools, prompt-as-contract, session lifecycle management, tool use as source of agent agency
- Deepened here: MCP servers (Sentry) as diagnostic data sources — the same concept from prework 2.3, but applied to evidence collection rather than code editing. Playwright CLI/MCP diagnostic capabilities (console logs, network inspection) for local reproduction. Structured input (prework 3.2) applied to bug triage rather than task delegation.
- Avoid repeating: What an MCP server is, how to configure Claude Code basics, prompt hierarchy (system prompt vs CLAUDE.md vs task prompt)

## Lesson Job

This is the final lesson in module 3. The learner has built a proactive quality pipeline — test plan (m3-l1), unit tests (m3-l2), hooks (m3-l3), E2E tests (m3-l4). This lesson teaches the reactive counterpart: what to do when production reveals something the pipeline missed. The lesson closes the quality arc by showing that the pipeline isn't enough — a diagnostic workflow using the agent as a multi-source data synthesizer is the safety net beneath the proactive layers.

The lesson uses an intentionally planted bug in 10xCards as the exercise. The learner is told upfront that the bug was introduced to create a realistic diagnostic scenario.

## Thesis

The agent's value in debugging isn't reading one stack trace — it's synthesizing evidence from monitoring (Sentry), runtime logs (wrangler), browser diagnostics (Playwright CLI/MCP console and network inspection), and the codebase to form a diagnosis that no single source could provide alone. The skill the learner acquires is driving this multi-source investigation, not mastering any single tool.

## Learning Outcomes

1. Kursant parsuje vague ticket od użytkownika w structured debug input (kroki reprodukcji, zakres, częstotliwość, możliwe przyczyny) z pomocą agenta.
2. Kursant kieruje agenta do zebrania danych diagnostycznych z Sentry MCP (issues, stack traces, breadcrumbs) i/lub wrangler tail (logi runtime, request patterns).
3. Kursant reprodukuje production buga lokalnie, potwierdzając symptom w kontrolowanym środowisku.
4. Kursant pisze debug-as-test: integration test, który pada z powodu buga, potwierdza root cause i zostaje jako regression guard po fixie.
5. Kursant weryfikuje fix across all diagnostic layers: test przechodzi, lokalna reprodukcja działa, monitoring się czyści.
6. Kursant rozpoznaje swallowed errors (API zwraca 200, ale side effects failują cicho) jako klasę bugów, którą automatyczne bramki przepuszczają, a stałym sygnałem detekcji jest monitoring.

## Audience Starting Point

The learner has completed m3-l1 through m3-l4 and has a working quality pipeline on their project (or at least understands the concepts). They know how to write tests, set up hooks, and generate E2E scenarios. But they've never dealt with a production issue that their pipeline didn't catch. They may assume that good tests = no production bugs. Their debugging instinct is still "read the error message → grep for the relevant code → fix" — a single-source approach that works for simple bugs but fails for silent failures, cross-layer issues, and vague user reports.

## Behavioral Change

After this lesson, the learner's first reaction to a bug report is "what diagnostic sources can I give the agent?" instead of "let me stare at the code." They treat debugging as a data synthesis problem, not a code reading problem.

## Owned Concepts

- Agent-driven diagnostic workflow: ticket → triage → multi-source evidence collection → hypothesis → debug-as-test → verified fix
- Structured debug input: parsing a vague user report into actionable diagnostic data with the agent (steps to reproduce, scope, frequency, possible causes)
- Debug-as-test as reactive pattern: writing a failing test to confirm a bug, as the reactive counterpart to m3-l2's proactive test-from-risk. The test starts from the symptom and works backward to the assertion; m3-l2's test starts from the risk and works forward.
- Agent as multi-source diagnostician: combining Sentry MCP (monitoring errors) as the primary production source with runtime logs (wrangler tail as platform-specific example) and local reproduction (Playwright CLI/MCP with console and network inspection) to synthesize a diagnosis
- Triage heuristic: deciding which diagnostic source to tap first based on symptom type
- Playwright CLI/MCP diagnostic capabilities in debugging context: `browser_console_messages` for console output, `browser_network_requests`/`browser_network_request` for network inspection — these are core Playwright tools (no --caps flag needed), reused from m3-l4 in a diagnostic rather than testing role
- Swallowed-error anti-pattern: API returns 200 but a side effect fails silently — automated gates miss it (the rate/SRS path has no per-commit test at all; SRS-transition correctness is named as test-plan Risk #6 / Phase 4, which is not started), so monitoring is the only standing detection signal

## References Only

- Unit/integration test authoring, risk-tied input + behavioral assertion, anti-patterns (m3-l2 — uses test mechanics for debug-as-test but doesn't re-teach them)
- PostToolUse hooks and three-layer quality pipeline (m3-l3 — the pipeline that didn't catch this bug)
- E2E test generation, Playwright CLI, seed test (m3-l4 — uses Playwright for reproduction context, doesn't re-teach E2E)
- Test plan and risk prioritization (m3-l1 — strategic layer; SRS-transition correctness is named as Risk #6 but its rollout phase is not yet built, so the rate path has no standing gate)
- MCP servers as agent tools (prework 2.3 — assumes learner knows MCP concept)
- Prompt-as-contract patterns (prework 3.2 — structured debug input is analogous)
- Context engineering and session lifecycle (prework 3.3 — long debugging sessions)
- /10x-new → /10x-plan → /10x-implement as self-setup flow for optional monitoring setup (m2)

## Must Not Cover

- Sentry SDK installation/configuration tutorial (optional in Deep Dive, or self-setup via m2 flow)
- Wrangler configuration, deployment, Cloudflare infrastructure (m1-l5, m2-l5)
- Unit/integration test authoring from scratch (m3-l2)
- Hook configuration or PostToolUse wiring (m3-l3)
- E2E test generation or Playwright setup (m3-l4)
- Test plan creation or risk prioritization (m3-l1)
- Ticket management, backlog triage, PM/QA workflow
- Sentry alert rules, source map pipelines, Sentry SDK deep dive
- BrowserTools MCP (abandoned project, CVSS 9.8 vulnerability, no unique value over Playwright CLI/MCP — do not mention or recommend)

## Required Example Or Demo

Intentionally planted swallowed-error in 10xCards `src/pages/api/review/[flashcardId]/rate.ts` (the SRS rating endpoint). The bug has **two coordinated parts**, mirroring the structure of a real production incident:

1. **Cause** — the `review_states` UPDATE that persists the new schedule is given a type-valid but runtime-invalid value (recommended: a fractional number written into one of the `integer` columns such as `scheduled_days`), so Postgres rejects every UPDATE. This is type-correct TypeScript (so it passes the typecheck/hooks gate) but fails at runtime — the same "valid type, invalid value" property the retired FK bug had.
2. **Swallow** — the handler's `updateError`/`!saved` guards are changed to `return jsonResponse(200, { ok: true })` instead of the real `500 rate_failed` / `404`. A `console.warn("review/rate: update_failed ...")` still fires. (Verified: the tempting `updated as RateResponse` form does NOT compile — `Card.due` is `Date`, `RateResponse.due` is `string` → `TS2352`; the `{ ok: true }` form is type-clean and mirrors the existing save-session swallow in the same codebase.)

Effect: rating a card returns 200 with an advanced-looking card, but the persisted row never advances. Because `fetchDueCards` selects on `.lte("due", now)` (`review-queries.ts`), the same card is re-served on every later `GET /api/review/due` — the rated card keeps coming back.

The bug escapes every per-commit gate: the entire `src/pages/api/review/**` tree and `src/lib/srs.ts` have **zero** tests (verified), so neither hermetic unit/integration tests nor hooks (valid TypeScript) nor the not-yet-built Phase 6 e2e touch it. SRS-transition correctness is test-plan Risk #6 / Phase 4 — **not started**. Monitoring is the only standing signal.

User ticket: "Oceniam fiszkę jako »Dobre«, ale wciąż wraca do powtórki — ciągle widzę te same karty."

The fix the learner restores: revert the bad write AND restore the hard `500` (stop swallowing). Two small changes; the lesson's point is that the headline root cause is the swallow itself.

This bug requires the full diagnostic workflow: ticket parsing → Sentry (`review/rate: update_failed` error with stack trace at `rate.ts`) → wrangler (console.warn after every rating) → local reproduction (rate a card → 200, but on reload the same card is still due) → code reading (the `updateError` guard returns 200 instead of propagating; the UPDATE write is malformed) → debug-as-test (seed a due row → rate → assert the *persisted* `due` advanced) → small fix → multi-layer verification.

> Mechanism: VERIFIED 2026-05-30 against running local Supabase. A fractional value in the `integer` column `scheduled_days` fails every UPDATE with PG `22P02` (PostgREST rejects, does not round); `due` stays at baseline. With the plant applied `pnpm exec astro check` = 0 errors and `pnpm exec vitest run` = 50/50 (identical to clean), and the real pre-commit gate (lint-staged → eslint) = 0 errors — so the bug escapes typecheck, tests, and the hook. Note: the swallow must be type-clean — `updated as RateResponse` does NOT compile (`Card.due:Date` vs `RateResponse.due:string`), so the lesson uses `return jsonResponse(200, { ok: true })`, mirroring the existing save-session swallow. See `lessons/m3-l5/bug-swap-plan.md` §0.

## Structural Logic Map

### Beat 1: Opening — the quality pipeline has a blind spot

- **Beat:** The learner is reminded of what they built in m3-l1→l4 (test plan, unit tests, hooks, E2E). Then: a ticket arrives. The pipeline didn't catch this.
- **Question answered:** Is the proactive quality pipeline sufficient?
- **Introduces:** The concept that proactive testing catches known risks but production reveals unknown ones. Bug was intentionally planted for this exercise.
- **Depends on:** m3-l4's bridge ("harder cases are next lesson's topic")
- **Sets up:** Why we need a reactive diagnostic workflow
- **Diagram opportunity:** —
- **Risk:** Opening could feel like "you failed" — must frame as "the pipeline works, but every pipeline has blind spots. The diagnostic workflow is the safety net."

### Beat 2: The ticket — lowest-information entry point

- **Beat:** The learner reads the ticket: "Oceniam fiszkę jako »Dobre«, ale wciąż wraca do powtórki." No stack trace, no error code.
- **Question answered:** What do you do when you get a bug report with no technical detail?
- **Introduces:** The ticket as the hardest diagnostic starting point (contrasted with unit fail, E2E fail, Sentry alert which give more data upfront)
- **Depends on:** Beat 1 (motivation for diagnostic workflow)
- **Sets up:** Why parsing the ticket is the critical first step (beat 3)
- **Diagram opportunity:** —
- **Risk:** Must not over-dramatize "tickets are hard" — the learner likely already knows this from experience

### Beat 3: Structured debug input — parsing with the agent

- **Beat:** The agent extracts structured data from the vague ticket: steps to reproduce (open review → rate a card "Good" → reload → same card still due), scope (rating returns success, the schedule never advances), frequency (every time), possible cause area (rate → review_states UPDATE).
- **Question answered:** How do you turn a vague report into something the agent can investigate?
- **Introduces:** Structured debug input as the debugging equivalent of m3-l2's structured, risk-tied input discipline
- **Depends on:** The ticket (beat 2)
- **Sets up:** Triage (beat 4) — the parsed symptoms drive the diagnostic decision
- **Diagram opportunity:** —
- **Risk:** Could feel like m3-l2's structured input rehashed. Must emphasize: same principle (structured input → better output), different domain (testing → debugging). Keep brief.

### Beat 4: Triage — which source to check first

- **Beat:** Based on parsed symptoms ("rating succeeds, schedule doesn't advance"), the agent decides: check monitoring first (is there an error the API swallowed?).
- **Question answered:** Given the symptoms, where should the agent look first?
- **Introduces:** Triage heuristic: symptom type → first diagnostic source. Quick reference showing 4-5 symptom→source mappings.
- **Depends on:** Structured debug input (beat 3)
- **Sets up:** Sentry investigation (beat 5)
- **Diagram opportunity:** Decision branch: symptom type → first source (monitoring / runtime logs / browser / codebase). Branching decision the learner needs to internalize.
- **Risk:** Could become a generic "debugging approaches" list. Must tie each symptom→source mapping to concrete observable signals, not abstract categories.

### Beat 5: Production evidence — Sentry

- **Beat:** The agent queries Sentry MCP: `search_issues` finds `review/rate: update_failed`. `get_sentry_resource` shows stack trace → `rate.ts` at the swallowed UPDATE guard, a runtime error on the review_states UPDATE. Breadcrumbs show the rating context.
- **Question answered:** What does monitoring tell us that the ticket didn't?
- **Introduces:** Sentry MCP as diagnostic data source (search_issues, get_sentry_resource), how to interpret stack traces with context and breadcrumbs
- **Depends on:** Triage pointing to monitoring (beat 4)
- **Sets up:** Wrangler for complementary data (beat 6)
- **Diagram opportunity:** —
- **Risk:** Could become Sentry documentation. Must stay anchored to THIS bug — what the Sentry data tells the agent about the review_states problem, not how Sentry works in general.

### Beat 6: Runtime logs as supplementary signal

- **Beat:** After Sentry gives the stack trace, the agent checks runtime logs (`wrangler pages deployment tail --format json --search "update_failed"`). Sees console.warn after every rating — confirms this is every-request, not intermittent, and gives a real-time verification channel for post-fix monitoring. Brief beat: 1-2 paragraphs + note that the specific tool varies by platform (wrangler for Cloudflare, `flyctl logs` for Fly, `vercel logs` for Vercel, etc.) — the pattern is "tap the platform's log stream."
- **Question answered:** Can runtime logs add signal beyond what monitoring gave us?
- **Introduces:** Runtime log inspection as supplementary diagnostic step. Wrangler as the concrete Cloudflare example, with explicit note on transferability.
- **Depends on:** Sentry data (beat 5)
- **Sets up:** Local reproduction (beat 7)
- **Diagram opportunity:** —
- **Risk:** Wrangler adds frequency confirmation but not fundamentally new diagnostic info for this bug. Keep brief — its main value is post-fix verification (beat 10) and the transferable pattern.

### Beat 7: Local reproduction

- **Beat:** The agent reproduces locally: open review → rate a due card "Good" → reload → the same card is still due. Playwright CLI/MCP diagnostic tools confirm: `browser_console_messages` shows no JS errors (ruling out frontend crash), `browser_network_requests` shows `POST /api/review/<id>/rate` returns 200 with an advanced-looking card, yet a follow-up `GET /api/review/due` returns 200 with the same card still present (confirming the server reports success but never persists the schedule change). This is a server-side data issue, not a frontend bug.
- **Question answered:** Does the production bug reproduce locally?
- **Introduces:** Local reproduction as confirmation step. Playwright CLI/MCP diagnostic tools (`browser_console_messages`, `browser_network_requests`) for ruling out frontend causes — same tools from m3-l4 reused in diagnostic context.
- **Depends on:** Production evidence (beats 5-6)
- **Sets up:** Code diagnosis (beat 8) and debug-as-test (beat 9)
- **Diagram opportunity:** —
- **Risk:** The Playwright diagnostic contribution is modest here (ruling out frontend cause) but pedagogically honest — "confirming what IS NOT the problem is part of diagnosis." Also reinforces that m3-l4's tools have diagnostic uses beyond test generation.

### Beat 8: Diagnosis — the synthesis moment

- **Beat:** The agent reads rate.ts. Cross-references Sentry stack trace (`update_failed` at the UPDATE guard) with code: the `updateError` guard returns `jsonResponse(200, updated)` instead of propagating the failure, and the UPDATE payload writes a value Postgres rejects every time. The agent explains: the handler treats the in-memory FSRS-computed card as the success signal and the DB write as best-effort; the swallowed error means the schedule never persists, so the card stays due.
- **Question answered:** What exactly is broken, and why?
- **Introduces:** The synthesis: Sentry stack trace + code reading + understanding of data model = root cause. No single source was sufficient.
- **Depends on:** All previous evidence (beats 5-7)
- **Sets up:** Debug-as-test (beat 9)
- **Diagram opportunity:** Data flow diagram showing `scheduler.next → updated (in memory)` → `UPDATE review_states (rejected)` → `catch: warn + return 200 updated` → `due unchanged` → `fetchDueCards .lte(due, now) re-selects the card`. This is the core insight and a diagram would make the swallow-and-restale loop concrete.
- **Risk:** The synthesis must feel earned — the learner should see that the agent combined evidence from monitoring (what error), logs (how often), local reproduction (confirms symptom), and code reading (why) to reach a conclusion.

### Beat 9: Debug-as-test

- **Beat:** The agent writes an integration test: seed a due `review_states` row → `POST /api/review/<id>/rate` rating Good → re-query the *persisted* row → assert `due > now` and `reps` incremented. Test fails (the row never advances). This confirms the root cause with executable evidence. The test becomes the regression guard — and is the natural first Phase-4 SRS-transition test.
- **Question answered:** How do we prove the root cause and prevent regression?
- **Introduces:** Debug-as-test as reactive pattern. Explicit contrast with m3-l2: "In m3-l2, test starts from risk and works forward. Here, test starts from symptom and works backward."
- **Depends on:** Root cause diagnosis (beat 8)
- **Sets up:** Fix (beat 10)
- **Diagram opportunity:** —
- **Risk:** Boundary with m3-l2. The distinction (proactive vs reactive) must be stated explicitly in 1-2 sentences. The test mechanics are the same — what changes is the reasoning direction.

### Beat 10: Fix + multi-layer verification

- **Beat:** Small fix: restore the correct UPDATE write AND restore `return jsonResponse(500, { error: "rate_failed" })` (stop swallowing). Then verify across all layers: integration test passes, local rating advances the card out of the due queue, wrangler tail is clean, Sentry error stops recurring.
- **Question answered:** How do we confirm the fix works everywhere, not just locally?
- **Introduces:** Multi-layer verification as the close of the diagnostic loop. Each diagnostic source that showed the problem must now show it's resolved.
- **Depends on:** Debug-as-test (beat 9)
- **Sets up:** Swallowed errors as a class (beat 11)
- **Diagram opportunity:** Simple verification checklist flow (test → local → wrangler → Sentry), showing that verification mirrors investigation in reverse.
- **Risk:** Could feel like a checklist recital. Keep it 2-3 paragraphs — the point is the principle (verify at every layer you diagnosed), not the steps.

### Beat 11: Swallowed errors as a class

- **Beat:** Step back from the specific bug. This was a swallowed error: API returned 200, the side effect failed silently. Without monitoring, the only signal was the user ticket. The lesson names this as a class of bug and explains why the m3-l1→l4 automated gates didn't catch it (the rate/SRS path has no per-commit test at all; hooks see valid TypeScript; the not-yet-built Phase 6 e2e doesn't touch it) — SRS-transition correctness is named as Risk #6 / Phase 4 but that phase is not started, so nothing standing guards it.
- **Question answered:** Why did the quality pipeline miss this? Is this a one-off or a pattern?
- **Introduces:** Swallowed-error anti-pattern as a named failure class. Monitoring as the detection mechanism for silent failures.
- **Depends on:** Complete diagnostic journey (beats 1-10)
- **Sets up:** Generalization (beat 12)
- **Diagram opportunity:** 2-column comparison: "what the client saw" (200 OK, card advanced) vs "what actually happened" (UPDATE rejected, due unchanged, card stays due).
- **Risk:** Could become moralizing ("you should have tested review_states!"). Must stay diagnostic: this class of bug exists, here's how to detect and fix it.

### Beat 12: Generalization — the universal diagnostic workflow

- **Beat:** The same workflow (evidence → hypothesis → reproduce → test → fix → verify) applies to any entry point: unit test failure, E2E failure, Sentry alert, or user ticket. What changes is the starting data and the triage step. The agent's value is consistent: it synthesizes from multiple sources regardless of how you enter the investigation.
- **Question answered:** Does this workflow only work for user tickets?
- **Introduces:** Four entry points converging on the same diagnostic process. Brief note: "if your stack uses different tools, the workflow is the same — change the data source, keep the process."
- **Depends on:** Beat 11 (the specific case is understood)
- **Sets up:** Bridge to m4-l1
- **Diagram opportunity:** 4 entry points (unit fail, E2E fail, Sentry alert, user ticket) converging into a single diagnostic workflow. Summary diagram.
- **Risk:** Must be brief (1-2 paragraphs + diagram). Not a new section — a closing observation.

## Failure Mode To Disarm

**Single-source debugging:** The learner points the agent at one data source (e.g., "read rate.ts and find the bug") and expects a diagnosis from code reading alone. The lesson must show that code reading without monitoring data would produce a weaker, slower diagnosis — the agent wouldn't know about the swallowed `update_failed` without Sentry, and wouldn't know the blast radius (every rating, every user) without wrangler. The diagnostic synthesis is the skill, not code reading.

**Secondary failure mode:** The learner treats debug-as-test as optional. The lesson must show that without the test, the fix is unverified — the learner is trusting their reading of the code, which is exactly what created the bug in the first place. The test is the proof.

## Suggested Structure

1. **Wstęp** — The quality pipeline has a blind spot; the ticket arrives
   Previous beat → this beat → next beat:
   m3-l4's bridge ("harder cases next") → ticket as diagnostic starting point → why we need a structured approach (Core)

2. **Core: Ticket parsing and triage** (beats 2-4) — From vague report to actionable investigation
   Previous beat → this beat → next beat:
   Wstęp (motivation) → structured debug input + triage → production evidence collection. Must not introduce tools yet — only the diagnostic question.

3. **Core: Multi-source evidence** (beats 5-7) — Sentry, wrangler, local reproduction
   Previous beat → this beat → next beat:
   Triage decision → evidence from each source → synthesis. Must show what each source adds, not just how each tool works.

4. **Core: Diagnosis and debug-as-test** (beats 8-9) — Synthesis + reactive testing
   Previous beat → this beat → next beat:
   Evidence collected → root cause synthesis → failing test confirms it. Must not re-teach test writing (m3-l2); focus on the reactive reasoning direction.

5. **Core: Fix, verify, generalize** (beats 10-12) — Multi-layer verification + swallowed errors + universal workflow
   Previous beat → this beat → next beat:
   Confirmed root cause → fix + verification at every layer → name the pattern class → generalize the workflow. Must not expand into a new lesson; close the arc.

6. **Deep Dive** — Optional Sentry setup (free tier, @sentry/astro, MCP server auth), wrangler Workers Logs ([observability]), Playwright CLI/MCP diagnostic tools reference (console + network), debug-as-test in other testing frameworks. Note: learners can use /10x-new → /10x-plan → /10x-implement from m2 to implement monitoring setup on their projects.

7. **Materiały dodatkowe** — Sentry docs, wrangler tail docs, Playwright CLI/MCP docs, Playwright trace viewer docs

## Video Placeholders

1. **V1 — Full diagnostic walkthrough:** The complete workflow from ticket to fix on the planted 10xCards bug. Shows: ticket text → agent parses → Sentry MCP query in terminal → wrangler tail output → local reproduction → code reading → debug-as-test (test fails, then passes after fix) → verification across layers. Single coherent narrative, ~10-15 minutes.
2. **V2 — (Optional) Triage decision demo:** Short screencast showing 2-3 different symptom types and the agent choosing different diagnostic sources for each. Demonstrates that the triage step is a decision, not a fixed sequence. ~3-5 minutes.

## Bridge In

m3-l4 closes with: "te trudniejsze przypadki, kiedy test E2E spada z nieoczywistego powodu i trzeba dojść od stack trace'a do fixa, to temat następnej lekcji."

m3-l5 opens: the quality pipeline you built in m3-l1 through m3-l4 catches known risks proactively. But production sometimes reveals what the pipeline missed — a user ticket arrives with no stack trace, no error code, just "it doesn't work." This lesson teaches the reactive diagnostic workflow that completes the quality picture.

## Bridge Out

m3-l5's diagnostic workflow assumes the learner knows the codebase — they understand rate.ts, the SRS scheduling state, the review_states table. In m4-l1, the learner faces a new or legacy codebase where that understanding doesn't exist yet. The same diagnostic skills apply, but first the agent needs to map the architecture so the learner can navigate it. From "you know the code, agent helps you diagnose" to "you DON'T know the code, agent helps you map it."

## Open Questions

- **Agent misdiagnosis beat:** ~~Should the lesson include a moment where the agent forms a plausible-but-wrong hypothesis?~~ **Resolved: No.** Keep the narrative linear — don't complicate.
- **BrowserTools MCP depth:** ~~Should BrowserTools get a separate example or stay as confirmation?~~ **Resolved: Dropped entirely.** Research (2026-05-28) confirmed that Playwright CLI has `console` and `requests` commands, and Playwright MCP has `browser_console_messages`, `browser_network_requests`, `browser_network_request` as **core** tools (no --caps flag needed). BrowserTools MCP adds zero unique value. Additionally, the project is abandoned (README: "THIS PROJECT IS NO LONGER ACTIVE"), last release March 2025, unpatched CVSS 9.8 command injection vulnerability. Beat 7 now uses Playwright CLI/MCP diagnostic tools instead.
- **Sentry account requirement:** ~~Is Sentry truly optional?~~ **Resolved: Sentry is primary, wrangler is secondary.** Sentry is more universal than wrangler (Cloudflare-specific). If something gets lighter treatment, it's wrangler — beat 6 compressed to a brief "runtime logs supplement monitoring" note. Sentry stays as the primary production diagnostic tool.
- **Provisional schema enrichment proposal:** **Resolved: Applied to lessons-schema.json** — values reflect decisions above (BrowserTools as confirmation tool in owns, wrangler as platform-specific example).

## Side-Effect Ledger

New claims introduced:
- Debug-as-test as reactive pattern (counterpart to m3-l2's proactive test-from-risk)
- Swallowed-error anti-pattern as a named failure class requiring monitoring for detection
- Agent as multi-source diagnostician: Sentry MCP as primary production source, runtime logs (wrangler) as secondary platform-specific supplement, Playwright CLI/MCP diagnostic tools for local reproduction
- Triage heuristic: symptom type → first diagnostic source
- Structured debug input as debugging-domain application of structured input principle (from m3-l2/prework 3.2)

Claims removed:
- The retired save-session FK / orphan_review_state bug as the planted example (now covered by 10xCards test-plan Phase 2 `save-session.invariants.integration.test.ts`).

Neighboring lesson references changed:
- m3-l2's risk-tied input discipline and test-from-risk now explicitly bridged as proactive counterparts to m3-l5's debug-as-test
- m3-l4's Playwright CLI now referenced as reproduction tool in debugging context (not E2E generation)
- m3-l1 through m3-l4 collectively referenced as "the proactive pipeline with blind spots"

Prework references used:
- Prework 2.3 (MCP servers) — assumed, not retaught
- Prework 3.2 (prompt-as-contract) — analogized to structured debug input
- Prework 3.3 (context lifecycle) — applied to long debugging sessions

Prework concepts repeated intentionally:
(none — all prework concepts are deepened or analogized, not repeated)

Potential duplicates:
- Structured debug input (beat 3) echoes m3-l2's structured, risk-tied input principle. Boundary clear: same principle, different domain (testing → debugging). Must be acknowledged in 1 sentence.
- Test writing in debug-as-test (beat 9) uses m3-l2's mechanics. Boundary clear: same tool, different reasoning direction (forward from risk vs backward from symptom).

Unsupported facts (updated after grounding 2026-05-29):
- Sentry MCP: `get_issue_details` is now INTERNAL (behind `get_sentry_resource`). `search_issues` LLM provider is OPTIONAL — gracefully degrades to direct query pass-through (verified from source). Setup flag is `--access-token`. Practical workflow: `search_issues` → `get_sentry_resource(resourceType="issue")`.
- @sentry/astro Astro 6 compatibility UNCONFIRMED (open issue #19753). 10xCards uses Astro 6.3.1. Deep Dive must note this limitation.
- Workers Logs ([observability]) works for Workers only, not Pages. 10xCards deploys via Workers — OK.
- Wrangler tail syntax and JSON structure VERIFIED — correct as written.
- Playwright CLI/MCP diagnostic tools VERIFIED (2026-05-28) — core tools, no --caps needed.
- Planted bug now lives in `rate.ts` (SRS rate handler), detection signal `review/rate: update_failed`. VERIFIED against current 10xCards source: `rate.ts` returns 500 on `updateError` / 404 on `!saved` today (swallow is introduced by the plant); the `console.warn("review/rate: update_failed ...")` string already exists; `review_states` has no CHECK constraints; `fetchDueCards` selects `.lte("due", now)`; the `src/pages/api/review/**` + `src/lib/srs.ts` tree has zero tests.
- VERIFIED 2026-05-30 (spike): fractional → `integer` column `scheduled_days` fails every UPDATE with PG 22P02; `due` unchanged; valid write advances it. Escapes all gates: `pnpm exec astro check` 0 errors, `pnpm exec vitest run` 50/50 (== clean), lint-staged/eslint 0 errors. Correction: swallow is `jsonResponse(200, { ok: true })` (type-clean, matches save-session precedent), NOT `updated as RateResponse` (which fails TS2352). Only recording-prep detail left: seed a card whose interval is non-integer (bug-swap-plan.md §0).

Video/text mismatches:
- The existing video scenario (`videos/video-diagnostic-walkthrough.md`, commit e9079655) demos the retired save-session bug and must be re-cut for the rate-path bug.

Needs human decision:
- Confirm the narrative shift from "ad-hoc gate, test exists" → "Risk #6 / Phase 4 not started, no test touches the path" (recommended: yes).
- ~~Pick the deterministic-cause variant~~ RESOLVED by spike (2026-05-30): fractional→`integer` `scheduled_days` (PG 22P02), type-clean `{ ok: true }` swallow. Only the demo-card seed (non-integer interval) is a recording-time choice.
- Decide whether the debug-as-test ships as the real first Phase-4 test in 10xCards.
