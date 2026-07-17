# Lesson Spec: m3-l2 — Od planu do testów: implementacja unitów z Agentem

## Schema Context

- Course: 10xdevs-3
- Module: m3 — AI Development Quality & Maintenance
- Position: moduleOrder 2 / globalOrder 12
- Depends on: m3-l1 (`context/foundation/test-plan.md`, phased rollout, risk map, first quality handoff)
- Prepares for: m3-l3 (Hooki i triggery: Agent reagujący na błędy)

## Lesson Job

Wziąć decyzje jakościowe z m3-l1 i zamienić je w realne unit/integration testy istniejącego kodu, prowadząc kursanta przez jeden cykl: ryzyko z `context/foundation/test-plan.md` → `/10x-research` (knowledge extraction + wyrocznia) → `/10x-plan` (rozbicie na fazy) → `/10x-implement` (wygenerowanie testów). `/10x-test-plan` utrzymuje kursanta w obrębie fazy, a `/10x-impl-review` jest pierwszym sitem oceny jakości wygenerowanych testów.

Lekcja operacjonalizuje pętlę: ryzyko → research → plan → implement → review przeciw checkliście anti-wzorców → weryfikacja asercji przez celowe psucie. Deep Dive otwiera mutation testing (Stryker) jako selektywną, czwartą warstwę weryfikacji jakości testów.

## Thesis

Testy z agentem nie zaczynają się od pliku ani od coverage targetu. Zaczynają się od ryzyka, researchu i scenariusza biznesowego. `context/foundation/test-plan.md` mówi, co chronimy; `/10x-research` mówi, gdzie ryzyko przechodzi przez kod i dostarcza wyrocznię (oracle); checklist anti-wzorców i weryfikacja asercji przez celowe psucie pilnują, żeby agent nie mirrorował implementacji.

## Prework Continuity

- Relevant prework: 3.1 (testy utrwalające błędne założenia), 3.2 (prompt jako kontrakt), 3.3 (dobór kontekstu), 1.3 (nie approve bez obrony), 4.1/4.2 (agent-friendly stack, testy i CI/CD).
- Assumed: kursant rozumie m3-l1, `context/foundation/test-plan.md`, handoffy, `/10x-research` jako knowledge extraction i `/10x-plan` jako planowanie slice'a.
- Deepened here: prompt jako kontrakt staje się konkretnym template'em do generacji testów; tryb korepetytora staje się obroną testu przed commit.

## Audience Starting Point

Kursant po m3-l1 ma `context/foundation/test-plan.md`, risk map, phased rollout i może mieć pierwszy `context/changes/<change-id>/research.md`. Nie ma jeszcze realnego testu albo ma tylko przypadkowe testy. Najczęstsze przekonania:

- "Agent może wygenerować testy do każdego pliku."
- "Coverage 80% wystarczy."
- "Skoro test przechodzi, to jest dobry."
- "Testy do nowego kodu dopiszę po implementacji."

## Behavioral Change

Kursant przed wysłaniem promptu do agenta wybiera ryzyko z `test-plan.md`, bierze finding z `research.md` jeśli istnieje, opisuje scenariusz biznesowy i wymaga asercji behawioralnej. Po wygenerowaniu testu przechodzi checklistę trzech anti-wzorców i broni testu jednym zdaniem przed commitem.

## Owned Concepts

- Risk-driven test generation przez cykl `/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement`: punktem wyjścia jest ryzyko z `context/foundation/test-plan.md`, nie plik ani coverage target.
- Operacjonalizacja problemu wyroczni (oracle problem) wprowadzonego w m3-l1: research dostarcza opis oczekiwanego zachowania, którego nie da się wyczytać z samej implementacji; to on, nie składnia, jest sednem testu. m3-l2 nie wprowadza pojęcia od nowa — odwołuje się do m3-l1 (przykład `calculateDiscount`) i pogłębia je przykładem `getNextInterval`.
- Checklist trzech anti-wzorców LLM-test:
  - implementation mirror,
  - happy-path-only,
  - missing edge cases.
- Weryfikacja asercji przez celowe psucie (ręczna, uproszczona forma testów mutacji): poluzuj walidację / zmień operator / dodaj `console.warn` z wrażliwymi danymi i sprawdź, czy test spada na czerwono.
- Review ritual: `/10x-impl-review` jako pierwsze sito + bezpośrednie pytanie do agenta o zgodność z praktykami lekcji ("który test mirroruje implementację, czy każdy ma edge case z ryzyka, czego brakuje").
- `/10x-tdd` jako opcjonalny tryb test-first (RED → GREEN → REFACTOR) dla faz z nowym kodem: ten sam `plan.md`, ta sama sekcja `## Progress` i te same fazy co `/10x-implement` — zmienia tylko kolejność i zmusza agenta do ujawnienia asercji zanim napisze kod. Heurystyka: "jeśli umiesz nazwać pierwszy czerwony test jednym zdaniem, rozważ `/10x-tdd`". Zakłada istniejące środowisko testowe (nie bootstrapuje); oba tryby można mieszać w obrębie jednego planu.
- Vitest jako agent-friendly default dla unit/integration w JS/TS; `vi.spyOn(global, 'fetch')` zamiast MSW i środowisko `node` zamiast happy-dom jako tańszy domyślny wybór według reguły cost × signal (MSW / Testing Library / happy-dom jako opcja, nie default; bez głębi konfiguracji).
- Mutation testing as Deep Dive only: coverage vs mutation score jako dwie różne miary, Stryker as JS/TS example, transferable to other ecosystems (mutmut, Stryker.NET, PIT, cargo-mutants, mull).

## References Only

- `context/foundation/test-plan.md` as strategy/risk/rollout source (m3-l1).
- `context/changes/<change-id>/research.md` as code-grounding source from `/10x-research`.
- `/10x-new` as change-bootstrap step opening the cycle.
- `/10x-research` as knowledge-extraction workflow producing code anchors + oracle (m2).
- `/10x-plan` as slice-planning workflow that breaks work into phases (m2).
- `/10x-implement` as the step that generates the actual tests.
- `/10x-test-plan` as the skill that keeps the learner inside the current rollout phase from m3-l1.
- `/10x-impl-review` as first-pass quality review of generated changes.
- Hooks after edit (m3-l3).
- E2E/MCP/multimodal scenarios (m3-l4).
- Debug-as-test (m3-l5).
- Prompt as contract (prework 3.2).
- LLM tests that preserve wrong assumptions (prework 3.1).
- Tutor mode / no blind approve (prework 1.3).

## Must Not Cover

- Creating or refreshing `context/foundation/test-plan.md` (m3-l1).
- Full `/10x-research` methodology or call-graph tracing (m3-l1/m2 skill chain; this lesson consumes research).
- Full `/10x-plan` workflow (m2).
- Hook configuration and scripts (m3-l3).
- E2E, Playwright MCP setup, browser automation code, multimodal E2E (m3-l4).
- Debug-as-test workflow in detail (m3-l5).
- Vitest/MSW/Testing Library deep setup.
- Stryker full configuration tutorial.
- Property-based testing, fuzzing, or broad test-design theory.

## Learning Outcomes

- Kursant generuje unit/integration test dla ryzyka z `context/foundation/test-plan.md`, przepuszczając je przez cykl `/10x-research` → `/10x-plan` → `/10x-implement` i używając research anchor + wyroczni z `research.md`.
- Kursant uruchamia `/10x-research` zanim poprosi o jakikolwiek test i wyławia z niego trzy rzeczy: gdzie ryzyko przechodzi przez kod, jakie zachowanie udowodniłoby ochronę, i jaki jest najtańszy test łapiący to ryzyko.
- Kursant rozpoznaje implementation mirror, happy-path-only i missing edge cases w testach wygenerowanych przez agenta.
- Kursant ocenia jakość testów we współpracy z agentem (`/10x-impl-review` + bezpośrednie pytanie o anti-wzorce) i re-promptuje konkretną wadę zamiast akceptować pierwszy output.
- Kursant weryfikuje asercję przez celowe psucie kodu produkcyjnego i wie, że zielony test po zepsuciu kodu niczego nie chroni.
- Kursant rozumie, że coverage i mutation score odpowiadają na różne pytania i kiedy warto uruchomić mutation testing.
- Kursant wie, kiedy użyć opcjonalnego `/10x-tdd` (faza z nowym kodem, pierwszy czerwony test daje się nazwać jednym zdaniem) zamiast `/10x-implement`, rozumie cykl RED → GREEN → REFACTOR jako sposób na wymuszenie asercji przed implementacją i może mieszać oba tryby w obrębie jednego `plan.md`.

## Required Example Or Demo

Projekt 10xcards — aplikacja do fiszek generująca karty z wklejonego tekstu przez OpenRouter.

- **Case study (jedno przejście cyklu):** prowadzący bierze Fazę 1 z `context/foundation/test-plan.md` z dwoma ryzykami — Ryzyko #1 (OpenRouter zwraca zepsutą/niezgodną ze schematem odpowiedź → rozbity UI / częściowa talia / crash) i Ryzyko #7 (wklejony tekst źródłowy wycieka do bazy lub logów — blokujące wydanie ze względów prywatności). Start: zero infrastruktury testowej.
- **Research zmienia cel:** `/10x-research` pokazuje, że oba ryzyka są już strukturalnie zabezpieczone w kodzie, więc zadaniem jest regression guard, nie naprawa buga. Research dostarcza wyrocznię ("pełna zwalidowana tablica albo wyjątek, nigdy częściowa lista") i dobiera stack: `vi.spyOn(global, 'fetch')` zamiast MSW, runner `vitest` w środowisku `node`.
- **Plan rozbija na 5 faz:** 1.1 Bootstrap (vitest, config, symulacja API, 2 smoke testy) → 1.2 Kontrakt wrappera (Ryzyko #1, unit) → 1.3 Mapowanie błąd→HTTP (Ryzyko #1, integracja) → 1.4 Strażnik prywatności (Ryzyko #7, 6 asercji) → 1.5 Cookbook + sync planu.
- **Deep Dive:** Stryker na module z case study pokazuje różnicę między coverage i mutation score, przeżytego mutanta i re-prompt o test, który go zabija.

## Structural Logic Map

```text
Beat 1 — Otwarcie: pisanie testów to obszar, w którym najłatwiej dać się oszukać
  Question answered: dlaczego zielony raport + rosnący coverage to za mało?
  Recalls (z m3-l1): oracle problem; pogłębia go przykładem getNextInterval, dwa wnioski (coverage ≠ ochrona, naiwny prompt to za mało).
  Depends on: m3-l1 test-plan.md, problem wyroczni z m3-l1, i cykl /10x-new → research → plan → implement.

Beat 2 — Vibe Testing: jak NIE wprowadzać testów
  Question answered: dlaczego "read plan and write tests" nie wystarczy?
  Introduces: implementation mirror, happy-path-only, missing edge cases.

Beat 3 — Jak Test Plan rozbraja te pułapki
  Question answered: jak ryzyko + research + handoff rozbijają każdy anti-wzorzec?
  Introduces: ryzyko zamiast pliku, research jako wyrocznia, cost × signal, handoff do /10x-plan.

Beat 4 — Case study: od ryzyka do użytecznych testów (10xcards)
  Question answered: jak wygląda jeden realny przebieg cyklu?
  Introduces: dwa ryzyka, research zmienia cel, 5 faz planu, zgodność z dobrymi praktykami.

Beat 5 — Zadania praktyczne
  Question answered: jak powtórzyć tę pętlę na własnym projekcie?
  Introduces: postaw środowisko, przepuść ryzyko przez cykl, oceń jakość z agentem.

Deep Dive — Mutation testing / Stryker
  Question answered: skąd wiem, że asercje są mocne?
  Introduces: coverage vs mutation score, stany mutantów, Stryker krok po kroku, żywe mutanty jako produkt.
```

## Video Placeholders

- V1 — Deep Dive: Stryker na żywo — uruchomienie `npx stryker run` na module zabezpieczonym testem dla ryzyka z `test-plan.md`, raport HTML i mutation score, przeżyty mutant z diffem, re-prompt o test zabijający mutację, ponowny run i wzrost score. (Jedyny placeholder obecny w draycie.)

## Side-Effect Ledger

New claims introduced:
- m3-l2 stoi na jednym cyklu `/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement`, z `/10x-test-plan` (utrzymanie fazy) i `/10x-impl-review` (pierwsze sito jakości) jako skillami wspierającymi.
- Stack default to Vitest + `vi.spyOn(global, 'fetch')` + środowisko `node`; MSW / Testing Library / happy-dom zdegradowane do opcji według reguły cost × signal.
- Case study 10xcards prowadzi przez Fazę 1 z dwoma ryzykami (#1 zepsuta odpowiedź OpenRoutera, #7 wyciek wklejonego tekstu) i 5 podfaz, gdzie research zmienia cel z naprawy buga na regression guard.
- `/10x-tdd` jako opcjonalny tryb test-first (RED → GREEN → REFACTOR) dla faz z nowym kodem — reintrodukowany do kontraktu 2026-05-30, bo draft (source of truth) wciąż go uczy.

Claims removed:
- Sekcja `Testing Strategy` w `/10x-plan` jako osobny nośnik testów dla nowego slice'a pozostaje poza zakresem — draft prowadzi testy przez cykl `/10x-research` → `/10x-plan` → `/10x-implement` (opcjonalnie `/10x-tdd`), nie przez dedykowaną sekcję w planie.
- Prompt-template jako osobny owned concept — draft nie podaje sformalizowanego template'a, tylko ryzyko/scenariusz/wyrocznię przez cykl skilli.
- `testing-guide.md` as the m3-l2 input artifact (już wcześniej zastąpione przez `test-plan.md`).

Neighboring lesson references changed:
- m3-l1 provides `test-plan.md`, phased rollout i cykl skilli.
- m3-l3 still automates tests via hooks.
- m3-l4 and m3-l5 unchanged in scope.

Potential duplicates:
- m3-l1 owns strategy and rollout orchestration.
- m3-l2 owns generating/reviewing unit/integration tests przez cykl skilli.
- m3-l3 owns hook wiring.

Unsupported facts:
- Exact 10xcards demo module still needs confirmation before recording the Stryker Deep Dive.
- Whether the course repo ships a ready Stryker config for the demo or only shows report interpretation conceptually.

Video/text mismatches:
- (none)

Needs human decision:
- Resolved 2026-05-30: `/10x-tdd` is back in the contract (owns + learningOutcomes) because the draft is the source of truth and still teaches it as an optional test-first mode. The 2026-05-28 removal is superseded. (Earlier note: removed as Workflow B / plan-first per author decision; reintroduce only if a future draft teaches it — which it now does.)
- Whether metrics-in-prose stays limited to the single ULT toy-vs-real coverage gap (~92%→~45% lines, ~82%→~30% branches) cited in the current draft, or expands to the other figures listed in the prior override.
