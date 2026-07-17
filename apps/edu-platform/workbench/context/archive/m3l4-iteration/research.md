---
date: 2026-05-28T12:00:00+02:00
researcher: Claude Opus 4.6
git_commit: dc2dcbd0a3757cc00a0e59021e643fecc2c2997b
branch: master
repository: przeprogramowani-sites
topic: "Revise m3-l4 [todo] comments and verify cross-lesson coherence with M3-L1–L3 against 10xCards test-plan.md"
tags: [research, m3-l4, e2e-testing, lesson-iteration, cross-lesson-coherence]
status: complete
last_updated: 2026-05-28
last_updated_by: Claude Opus 4.6
---

# Research: M3-L4 [TODO] Revision and Cross-Lesson Coherence

**Date**: 2026-05-28T12:00:00+02:00
**Researcher**: Claude Opus 4.6
**Git Commit**: dc2dcbd0a3757cc00a0e59021e643fecc2c2997b
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Revise all [todo] comments in `lessons/m3-l4/lesson-draft.md`, categorize their severity, and verify cross-lesson coherence with the latest m3-l1, m3-l2, and m3-l3 drafts — using the concrete 10xCards `test-plan.md` as a real-world reference for how the lesson's guidance holds up.

## Summary

Found **8 [todo] comments** in the draft. The dominant issue is a **framing problem**: the lesson positions E2E testing primarily as "what hooks can't see in the browser" (visual regression), but E2E's core value is testing the full system integrated (auth → API → DB → UI without mocking). The 10xCards `test-plan.md` Phase 6 confirms this — its two E2E scenarios test full user flows, not visual layout. This framing gap propagates from m3-l3's bridge and affects the lesson's opening, thesis, and connection to the concrete example.

Cross-lesson bridges to m3-l1, m3-l2, and m3-l3 are structurally sound. The prompt-template → seed test continuity and anti-pattern checklist extension are clean. The RC review has 4 open minor items that need fixing.

## Detailed Findings

### A. [TODO] Catalog — Ordered by Impact

#### TODO-1 (line 12) — HIGH: E2E framing is too narrow (visual UI only)

```
[todo: mamy tutaj mocny nacisk koncepcyjny na testowanie UI, w e2e chodzi
o coś więcej - testowanie aplikacji w środowisku produkcyjnym lub bliskim
produkcji gdzie nie ma mockowania, tylko prawdziwy backend, baza danych etc.
w kontekście 10xcards to oznacza api z openrouter, bazę danych, serwer auth
- cały system end to end]
```

**Category**: Conceptual concern
**Impact**: HIGH — affects the lesson's entire opening and thesis framing

The draft's intro (lines 1–11) uses visual regression (overlapping cards on mobile) as the sole hook for why the learner needs E2E. This frames E2E testing as "seeing rendered UI," but E2E's primary value is testing the full integrated system without mocking boundaries.

**Evidence from 10xCards test-plan.md**: Phase 6 defines two E2E scenarios:
- (a) generate → review → save with OpenRouter mocked at network layer, asserting atomic save and deck state across SSR↔island handoff
- (b) auth-gate redirect roundtrip — unauthenticated `/home` → signin → back to `/home`

Neither scenario is visual. Both are full-stack user flow tests. The lesson's narrative project (10xcards) contradicts the lesson's own framing.

**Cross-lesson impact**: m3-l3's bridge out (line 286) also frames m3-l4 narrowly: "przesuwający się layout, zepsuta nawigacja, niedostępny formularz." This sets up the visual-only framing that m3-l4 inherits.

**Recommendation**: Widen the intro to name **two** classes of problems hooks can't catch:
1. **Full-stack user flows** that cross auth → routing → API → database boundaries (the 10xCards Phase 6 scenarios)
2. **Visual/layout regressions** that exist only in rendered pixels (the overlapping cards example)

Use both as the hook. The visual example is vivid and great for the opening — keep it. But immediately follow with: "A jeśli fiszki wyglądają pięknie, ale po odświeżeniu dane nie przetrwały, bo auth → API → baza po drodze coś zgubiły? Tego też żaden hook nie złapie."

This dual framing also sets up the lesson's own structure: core accessibility-tree-based E2E (Beats 2–8) covers full-stack flows, vision mode (Beat 10) covers the visual gap.

#### TODO-6 (line 125) — MEDIUM: What about frontendless apps?

```
[todo: a co z aplikacjami bez frontendu, są takie? czy tutaj api testy?]
```

**Category**: Scope question
**Impact**: MEDIUM — a legitimate question that readers will have

This follows the "Kluczowa zasada: nie generujesz testów E2E od zera" paragraph. The concern: not all apps have a browser UI. API-only E2E tests (hitting real endpoints with real DB, no browser) are equally valid.

**Recommendation**: Add 1–2 sentences acknowledging this directly. The lesson's scope is "agent with browser access" — that's the Playwright focus and it's fine. But a note like:

> "Jeśli twoja aplikacja nie ma frontendu, E2E może oznaczać scenariusze API: request → routing → logika → baza, bez przeglądarki. Mechanizmy kontroli jakości (seed test, reguły, review anti-wzorców) działają tak samo — zmienia się tylko warstwa interakcji."

This connects to the heuristic at line 122 which already says "jeśli ryzyko przechodzi przez wiele granic systemu" — that correctly covers both browser and API E2E.

#### TODO-5 (line 84) — MEDIUM: storageState scope and docs link

```
[todo: nie wiem czy to nie jest temat na deep dive - chcemy w core zachować
kluczowe mechanizmy, niezależne od tego czy ktoś korzysta z playwright czy
testuje stricte frontend z authem - warto również od razu dać link do
dokumentacji i zachęcić do korzystania z Context7 rekomendowanego wcześniej
w kursie]
```

**Category**: Scope/editorial
**Impact**: MEDIUM — affects core vs Deep Dive boundary

**Resolution**: storageState **stays in core** — the spec (line 58) and structural logic map (Beat 4) explicitly place it there. But the concern about making the pattern generic is valid.

**Recommendation**:
1. Frame the underlying principle first: "Większość frameworków E2E pozwala zapisać stan sesji (ciasteczka, tokeny) i wstrzyknąć go do kolejnych uruchomień." Then show the Playwright implementation.
2. Add a direct link to Playwright auth docs: `[Playwright Authentication](https://playwright.dev/docs/auth)` inline (already in Materiały dodatkowe, but an inline pointer helps).
3. Add a note encouraging Context7: "Jeśli korzystasz z innego frameworka, sprawdź aktualną dokumentację przez Context7 — wzorzec session state injection jest standardem."

#### TODO-7 (line 331) — MEDIUM: How to connect VLM models

```
[todo: brak nam info jak się podpiąć pod modele: czy jest możliwe korzystanie
z subskrypcji, czy potrzebujemy openroutera czy coś jeszcze innego]
```

**Category**: Content gap
**Impact**: MEDIUM — reader will hit a dead end after reading about model categories

The draft lists three model tiers (Frontier, Budget, Open-weight) but gives no guidance on how to actually use them with Playwright vision mode. There's a gap between "you need a VLM" and "here's where the model gets called."

**Recommendation**: Add a brief operational note (2–3 sentences, not a tutorial):

> "Playwright MCP w trybie wizyjnym korzysta z modelu skonfigurowanego w twoim narzędziu agentowym. Jeśli korzystasz z Claude Code, model wizyjny to ten sam Claude, którego używasz do kodowania. Jeśli chcesz użyć innego modelu (np. tańszego Gemini Flash do weryfikacji wizualnej w CI), skonfiguruj go przez API providera (OpenRouter, bezpośrednie API dostawcy) lub uruchom lokalnie."

This stays within mustNotCover boundaries (no model comparison or cost optimization) while filling the operational gap.

#### TODO-2 (line 19) — LOW: Simplification about agent not seeing pixels

```
[todo: to jest uproszczenie, agent może widzieć UI za pomocą multimodalności]
```

**Category**: Factual nuance
**Impact**: LOW — already resolved structurally by the lesson's progression

The draft teaches accessibility tree first (default), vision mode later (supplement). The current text "Agent nie patrzy na piksele. Patrzy na drzewo dostępności" is accurate for the default mode.

**Recommendation**: Add one word — "Domyślnie patrzy na drzewo dostępności" — and optionally a forward reference: "za chwilę zobaczysz, kiedy piksele stają się potrzebne."

#### TODO-3 (line 42) — LOW: Was Playwright CLI "designed for" AI agents?

```
[todo: czy faktycznie tak jest że playwright/cli zostało stworzone z myślą
o agentach AI?]
```

**Category**: Factual verification
**Impact**: LOW — claim is supportable from grounding

The Playwright docs (getting-started-cli) position the CLI explicitly for AI coding agents. The grounding confirms this. The draft says "narzędzie zaprojektowane specjalnie dla agentów kodujących."

**Recommendation**: Soften slightly to "narzędzie zoptymalizowane pod kątem agentów kodujących" or add attribution: "Playwright CLI — jak opisuje oficjalna dokumentacja — zostało zaprojektowane z myślą o agentach kodujących."

#### TODO-4 (line 67) — LOW: Token numbers (27K vs 114K) confirmation

```
[todo: czy mamy potwierdzenie tych danych 114 vs 27k]
```

**Category**: Factual verification
**Impact**: LOW — already handled with appropriate hedging

The grounding (line 299) recommends "roughly 4x" and the schema lists this as an unsupported fact (no primary Microsoft source). The draft already uses "około" and "mniej więcej czterokrotna" — appropriate hedging.

**Recommendation**: Remove the [todo]. The current softening is sufficient. Optionally add "(na podstawie benchmarków społeczności)" for transparency.

#### TODO-8 (line 474) — LOW: Composable fixtures examples needed (Deep Dive)

```
[todo: potrzebujemy tutaj przykładów i jak promptować agenta, aby osiągnąć
top rezultaty]
```

**Category**: Content completeness (Deep Dive)
**Impact**: LOW — Deep Dive is optional, and POM is explicitly out of core scope

The spec says POM is Deep Dive only and "the learner isn't manually writing page objects."

**Recommendation**: Add a minimal before/after example (POM class vs fixture function, 5–8 lines each) and a note that the seed test pattern from core already pushes the agent toward fixtures naturally. Can be deferred to video scenario or follow-up iteration.

### B. Cross-Lesson Coherence

#### m3-l1 → m3-l4: test-plan.md connection ✓

- m3-l1 introduces `context/foundation/test-plan.md` as the quality contract
- m3-l4 consistently references `context/foundation/test-plan.md` (lines 120, 124, 126, 169, 233, 393, 396)
- Terminology is consistent: both drafts use `test-plan.md` (not the older "testing-guide.md" from the spec)
- m3-l4's "wybierasz 2-3 najwyższe ryzyka" maps correctly to the test-plan.md's risk map structure
- **No issues found**

#### m3-l2 → m3-l4: prompt-template → seed test bridge ✓

- m3-l2 introduces: prompt-template, 3 unit anti-patterns (mirror, happy-path, missing edges), review ritual
- m3-l4 explicitly bridges at line 150: "W lekcji o testach jednostkowych nauczyłeś się prompt-template'a"
- m3-l4 extends the pattern: seed test is "the E2E equivalent of m3-l2's prompt-template"
- m3-l4 extends 3 → 5 anti-patterns with E2E-specific additions (flaky selectors, state coupling, waitForTimeout, missing cleanup)
- m3-l4 line 222 directly references: "W lekcji o unitach nauczyłeś się rozpoznawać trzy anti-wzorce"
- **No issues found** — the bridge is clean and well-executed

#### m3-l3 → m3-l4: hooks → browser gap bridge ⚠️

- m3-l3 ends (line 286): "Hooki łapią błędy na poziomie kodu: format, typy, unit testy. Nie łapią tego, co widzi użytkownik: przesuwający się layout, zepsuta nawigacja, niedostępny formularz."
- m3-l4 opens (line 8): "Żaden hook tego nie widział, bo hooki operują na kodzie źródłowym."
- **The bridge itself works mechanically** — the handoff is direct and clear
- **The framing concern**: m3-l3's bridge says "przesuwający się layout, zepsuta nawigacja, niedostępny formularz" — all visual/UI concerns. m3-l4 inherits this narrow framing. This is the same root issue as TODO-1.

**Recommendation**: m3-l3's bridge text could stay as-is (it IS true that hooks can't see these things), but m3-l4's opening should widen the scope immediately. The bridge needn't be perfect — the receiving lesson should land the full picture.

#### m3-l4 → m3-l5: bridge out ✓

- m3-l4 lines 345–355: healer masks logic bugs → sets up debugging lesson
- "te trudniejsze przypadki, kiedy test E2E spada z nieoczywistego powodu i trzeba dojść od stack trace'a do fixa, to temat następnej lekcji"
- **Clean bridge** — no issues

#### Pipeline diagram consistency ✓

- m3-l3 diagram (line 181): 4 layers (per-edit → pre-commit → pre-push → CI)
- m3-l4 diagram (line 339): extends to show E2E in CI layer
- Both are consistent; m3-l4 correctly shows E2E as a CI-time concern

### C. 10xCards test-plan.md Alignment

The 10xCards `test-plan.md` is a mature, well-structured artifact with 7 risks and 6 rollout phases. Here's how it maps to m3-l4:

#### What aligns well

1. **Risk map structure** — m3-l4's "open test-plan.md, pick top 2–3 risks for E2E" matches the actual artifact's format perfectly. The impact × likelihood table is exactly what m3-l4 describes.

2. **Phased rollout** — test-plan.md's 6 phases (unit/integration first → pre-commit hooks → E2E last) perfectly validates m3-l4's pipeline positioning: "E2E uruchamiasz w CI, bo jeden pełny przebieg to minuty."

3. **The risk-to-layer heuristic** — m3-l4 line 122 says "jeśli ryzyko przechodzi przez wiele granic systemu… albo istnieje tylko w wyrenderowanym UI, potrzebuje E2E." The test-plan.md Phase 6 scenarios demonstrate exactly this: generate→save crosses OpenRouter→API→DB→SSR, and auth-gate crosses middleware→cookie bridge→redirect.

4. **Strategy principles** — test-plan.md §1 principle #1 ("cheapest test that gives a real signal for the risk wins") directly supports m3-l4's emphasis on not promoting everything to E2E.

#### What creates friction

1. **Visual framing vs. actual scenarios** — m3-l4 opens with visual regression (overlapping cards). test-plan.md Phase 6 has zero visual scenarios; both are full-stack flow tests. The lesson's primary motivating example doesn't match the concrete artifact it tells learners to use.

2. **The test-plan.md explicitly excludes visual testing** — §7 "What We Deliberately Don't Test" says: "UI look-and-feel — visual diff, snapshot tests on rendered markup, styling/CSS regressions. Reason: low blast radius for a 1-week solo MVP." This means the 10xCards example actively chose NOT to do the type of testing m3-l4 leads with.

3. **E2E uses mocked OpenRouter, not "no mocking"** — test-plan.md Phase 6 says "OpenRouter mocked at network layer." This is a pragmatic choice (you can't run real LLM calls in CI), but it contradicts TODO-1's "środowisko produkcyjnym lub bliskim produkcji gdzie nie ma mockowania." The lesson should acknowledge that even E2E sometimes mocks expensive external boundaries (LLM APIs, payment providers) while keeping internal boundaries real.

**Recommendation**: Use the 10xCards test-plan.md Phase 6 scenarios explicitly in the lesson. They're more instructive than the overlapping-cards example for core E2E teaching:
- Show the generate→save scenario as a full-stack E2E that crosses auth→API→DB
- Show the auth-gate roundtrip as an integration E2E
- Keep the overlapping-cards example for the vision mode section (where it naturally belongs)
- Acknowledge the "mock expensive externals" pattern (OpenRouter mocked at network level) as a valid E2E strategy

### D. RC Review — Open Items

Four findings from `rc-review.md` remain unchecked:

1. **Ambiguous lesson count** (line 331 of draft): "Przez ostatnie cztery lekcje tego modułu" — ambiguous whether it includes the current lesson. **Fix**: → "W tym module zbudowaliśmy warstwowy system jakości:"

2. **"risk map" heading not Polonized** (line 382 of draft): `### Scenariusze E2E z risk map` while H2 uses Polish. **Fix**: → `### Scenariusze E2E z mapy ryzyk`

3. **Missing grounding sources in Materiały dodatkowe**: BrowserStack waitForTimeout article and QA Wolf parallelization article are used in claims but not linked.

4. **Video scenarios not created**: No `videos/` directory exists.

## Code References

- `lessons/m3-l4/lesson-draft.md:1-528` — Full draft with 8 [todo] markers
- `lessons/m3-l4/lesson-spec.md:1-384` — Approved v2 spec
- `lessons/m3-l4/lesson-grounding.md:1-327` — Grounding v2 with 15 sources
- `lessons/m3-l4/rc-review.md:1-147` — RC review with 4 open minors
- `lessons/m3-l1/lesson-draft.md:1-284` — m3-l1 draft (test plan strategy)
- `lessons/m3-l2/lesson-draft.md:1-422` — m3-l2 draft (unit test implementation)
- `lessons/m3-l3/lesson-draft.md:1-410` — m3-l3 draft (hooks and triggers)
- `/Users/admin/code/10xCards/context/foundation/test-plan.md:1-178` — Real test-plan.md artifact

## Architecture Insights

The M3 module has a clean dependency chain: strategy (l1) → unit tests (l2) → hooks (l3) → E2E (l4) → debugging (l5). Each lesson correctly builds on the previous one's artifacts and introduces its own layer.

The test-plan.md artifact from 10xCards validates the entire module's structure: it has risk map (l1), phased rollout with unit/integration first (l2), pre-commit hooks as quality gates (l3), and E2E as the final phase (l4). This is a strong real-world confirmation.

The single systemic issue is the **visual-UI-only framing of E2E** that starts in m3-l3's bridge and carries through m3-l4's opening. E2E testing in the real 10xCards project tests full-stack flows (auth, API, database), not visual layout. The lesson should reflect this reality.

## Prioritized Action Items

### Must fix before publish

| # | Item | Draft line(s) | Type |
|---|---|---|---|
| 1 | Widen E2E framing: full-stack flows + visual regression, not just visual | 1–12 | TODO-1 + cross-lesson |
| 2 | Fix "cztery lekcje" ambiguity | 331 | RC review open |
| 3 | Polonize "risk map" heading | 382 | RC review open |
| 4 | Remove resolved [todo] markers after addressing | all 8 lines | Editorial cleanup |

### Should fix (content quality)

| # | Item | Draft line(s) | Type |
|---|---|---|---|
| 5 | Acknowledge frontendless E2E (API tests) | near 125 | TODO-6 |
| 6 | Add VLM connection guidance (2–3 sentences) | near 331 | TODO-7 |
| 7 | Frame storageState generically, add inline doc link + Context7 note | 84–114 | TODO-5 |
| 8 | Add BrowserStack + QA Wolf links to Materiały dodatkowe | 511–528 | RC review open |
| 9 | Use 10xCards Phase 6 scenarios as concrete E2E examples in core | 116–153 | test-plan alignment |
| 10 | Acknowledge "mock expensive externals" as valid E2E pattern | near 120 | test-plan alignment |

### Nice to have (can defer)

| # | Item | Draft line(s) | Type |
|---|---|---|---|
| 11 | Soften "zaprojektowane specjalnie" for CLI | 42 | TODO-3 |
| 12 | Add "Domyślnie" to accessibility tree statement | 19 | TODO-2 |
| 13 | Remove token numbers [todo] (already hedged) | 67 | TODO-4 |
| 14 | Add fixture vs POM minimal example in Deep Dive | 474 | TODO-8 |
| 15 | Create video scenarios (`videos/` directory) | — | RC review open |

## Open Questions

1. **m3-l3 bridge text**: Should m3-l3's bridge out (line 286) be widened to mention full-stack flows alongside visual concerns? Or is it sufficient for m3-l4 to widen the scope in its own opening? (Recommendation: fix only in m3-l4; m3-l3's bridge isn't wrong, just incomplete.)

2. **10xCards Phase 6 as lesson example**: The test-plan.md has two concrete E2E scenarios ready. Should the lesson use them directly (with brief setup context) or keep the overlapping-cards narrative as the primary thread? (Recommendation: use Phase 6 scenarios for core E2E, keep overlapping cards for vision mode section.)

3. **"Mock expensive externals" pattern**: The test-plan.md mocks OpenRouter at the network layer for E2E. This is a common pattern (mock LLM APIs, payment providers) but contradicts the "no mocking in E2E" ideal. Should the lesson address this nuance? (Recommendation: yes, 2–3 sentences — it's honest and practically useful.)
