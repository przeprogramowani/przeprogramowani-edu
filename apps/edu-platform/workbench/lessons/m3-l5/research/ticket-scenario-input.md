# Wsad do m3-l5: Ticket od użytkownika jako scenariusz ramowy

## Źródło

Dyskusja autorska (2026-05-28): czy m3-l5 powinien symulować pracę z ticketem od użytkownika? Decyzja: tak — ticket to scenariusz ramowy łączący wszystkie narzędzia diagnostyczne.

## Dlaczego ticket, nie kolejne narzędzie

Ticket od użytkownika to najtrudniejszy punkt wejścia do debugowania. Nie dlatego, że problem jest trudniejszy technicznie — ale dlatego, że masz najmniej informacji na starcie:

| Źródło | Co dostajesz | Pierwszy krok |
|--------|-------------|---------------|
| Unit test fail | Exact error + exact line | Czytaj stack trace |
| E2E test fail | Failing assertion + trace | Czytaj trace viewer |
| Sentry error | Stack trace + user context | Czytaj event |
| **User ticket** | "Powtórka jest pusta" | ??? |

Ten `???` to jest skill, którego lekcja uczy. Juniorzy i midzi wiedzą jak debugować, kiedy test im powie co się zepsuło. Kiedy dostają "coś nie działa" — zamarzają.

## Ticket jako spoiwo lekcji

Ticket nie jest osobną sekcją. Jest **scenariuszem ramowym**, który prowadzi learnera przez wszystkie narzędzia:

```
Ticket: "Fiszki są w talii, ale powtórka jest pusta"
  │
  ├─ 1. Parsowanie ticketa z agentem
  │     Agent: "Potrzebuję: kroki reprodukcji, co dokładnie jest puste, przeglądarka"
  │     → Learner uczy się: co wyciągnąć z ticketa zanim zaczniesz debugować
  │
  ├─ 2. Sprawdź Sentry (produkcja)
  │     Agent czyta Sentry MCP → jest orphan_review_state error, FK violation
  │     → Stack trace wskazuje na save-session.ts:88, po każdym save
  │     → Learner uczy się: Sentry daje context, którego ticket nie ma
  │
  ├─ 3. Sprawdź Wrangler logs (produkcja)
  │     Agent: wrangler pages deployment tail --format json --search "orphan_review_state"
  │     → Widać: POST /api/sessions/.../save → 200, ale console.error z FK violation
  │     → Learner uczy się: logi runtime uzupełniają Sentry o request-level detail
  │
  ├─ 4. Reprodukuj lokalnie
  │     Agent generuje fiszki → zapisuje → deck OK → review pusta
  │     BrowserTools MCP: Network tab potwierdza review SSR z pustą tablicą cards
  │     → Problem potwierdzony: save succeeds, review_states nie istnieją
  │     → Learner uczy się: reprodukcja lokalna z narzędziami przeglądarki
  │
  ├─ 5. Debug-as-test (integration)
  │     Agent pisze test reprodukujący buga:
  │     "po save session, review_states mają poprawne flashcard_id (nie draft_id)"
  │     Test pada → potwierdza buga
  │     → Learner uczy się: test jako reprodukcja, nie jako afterthought
  │
  ├─ 6. Fix
  │     Agent zmienia acceptedDrafts.map(d => d.id) na upserted.map(row => row.id)
  │     Test przechodzi
  │
  └─ 7. Weryfikacja
        Lokalnie: review pokazuje fiszki
        Deploy → Sentry clears → Wrangler shows no more orphan warnings
        → Ticket closed
```

## Co agent robi na każdym etapie

### Parsowanie ticketa

Agent pomaga wyciągnąć z vague opisu structured debug input:

```text
User ticket: "Wygenerowałem fiszki, widzę je w talii, ale powtórka jest pusta.
Próbowałem dwa razy, za każdym razem to samo."

Agent should extract:
- Steps to reproduce: generate flashcards → accept → save → go to review → empty
- Frequency: every time (not intermittent)
- Scope: affects review, NOT deck (deck works)
- Key observation: save reports success, cards visible in deck
- Possible causes: review_states not created, FK issue, join failure
```

To jest analogia do prompt-template z m3-l2 — structured input daje lepsze wyniki. Tylko zamiast "ryzyko → test" mamy "ticket → debug plan."

### Triage: gdzie szukać

Agent decyduje, które narzędzie użyć na podstawie symptomów:

| Symptom w tickecie | Pierwsze narzędzie |
|--------------------|--------------------|
| "Strona się nie ładuje" | Sentry (500? crash?) |
| "Dane znikają po odświeżeniu" | Wrangler logs (DB? API?) → reprodukcja lokalna |
| "Zapisałem, ale nie widzę w innym widoku" | Sentry (silent error?) → reprodukcja lokalna |
| "Przycisk nie reaguje" | BrowserTools (JS error w konsoli?) |
| "Wolno działa" | Wrangler tail (response times) → profiling |

### Reprodukcja

Agent reprodukuje problem lokalnie — to jest moment, w którym BrowserTools MCP i Playwright CLI z m3-l4 wracają, ale w kontekście debugowania, nie testowania.

### Debug-as-test

Agent pisze test, który PADA — potwierdzając buga. Potem fixuje kod. Test przechodzi. Ten test zostaje w suite jako regression guard.

To zamyka pętlę z m3-l2: test powstaje z ryzyka (m3-l2), ale test może też powstać z buga (m3-l5). W obu przypadkach — test chroni przed powtórzeniem.

## Konkretny ticket do symulacji

Bazując na zaprojektowanym bugu (patrz `bug-sentry-wrangler-research.md`, sekcja 3):

**Ticket:**
> Tytuł: Powtórka jest pusta mimo zapisanych fiszek
>
> Opis: Wygenerowałem fiszki z tekstu o TypeScript type guards. Fiszki pojawiły się
> na ekranie, zaakceptowałem 5 z nich i zapisałem — widzę komunikat "Zapisano 5 fiszek."
> Fiszki są w mojej talii, mogę je przeglądać i edytować.
>
> Ale kiedy klikam "Powtórka" — strona pokazuje "Brak fiszek do powtórki."
> Próbowałem wygenerować nowe i zapisać ponownie — to samo.
> Talia ma fiszki, powtórka jest pusta.
>
> Przeglądarka: Chrome 130
> Konto: user@example.com

Ten ticket jest:
- Wystarczająco precyzyjny, żeby zacząć triage (deck OK, review pusta)
- Wystarczająco vague, żeby wymagać parsowania (brak stack trace'a, brak technicznego opisu)
- Debugowalny przez cały stack narzędzi (Sentry, Wrangler, reprodukcja lokalna, integration test)
- Oparty na realnym bugu w `save-session.ts` (FK violation w review_states)
- Deterministyczny — bug jest powtarzalny (nie intermittent), co ułatwia nagranie video

## Granica

m3-l5 NIE uczy:
- Jak pisać dobre tickety (to jest temat PM/QA)
- Jak zarządzać backlogiem bugów
- Jak priorytetyzować bugi vs features
- Jak komunikować fix do użytkownika

Uczy: dostałeś ticket, jak z agentem dojść do fixa.
