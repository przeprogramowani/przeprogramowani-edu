# Wsad do m3-l5: Struktura lekcji — ticket-driven debugging workflow

## Źródło

Dyskusja autorska (2026-05-28): struktura lekcji o debugowaniu z AI agentem. Decyzja: ticket od użytkownika jako scenariusz ramowy (Opcja A).

## Zatwierdzona struktura: ticket jako rama

Ticket od użytkownika jest scenariuszem ramowym lekcji (patrz `ticket-scenario-input.md`). Learner dostaje ticket na starcie i po kolei sięga po narzędzia. Narzędzia wchodzą w kontekście rozwiązywania problemu, nie jako oddzielne sekcje.

Kolejność sekcji wynika z naturalnego debugging workflow:

1. **Opening:** ticket przychodzi — "co robisz?"
2. **Parsowanie z agentem:** structured debug input z vague opisu
3. **Triage:** Sentry → Wrangler → reprodukcja lokalna (tu wchodzą narzędzia diagnostyczne)
4. **Debug-as-test:** test reprodukujący buga (integration test)
5. **Fix → verify → close**
6. **Generalizacja:** ten sam workflow dla każdego źródła (test fail, Sentry, logi, ticket)
7. **Zadania praktyczne**

## Dlaczego ticket, nie progresja złożoności

Wcześniejszy pomysł (Opcja B) zakładał progresję unit → E2E → produkcja z proporcjami narzędziowymi. Odrzucony, bo:

1. **Lekcja nie uczy narzędzi po kolei** — uczy workflow debugowania. Narzędzia pojawiają się, gdy są potrzebne do rozwiązania konkretnego problemu.
2. **Ticket jest realistycznym punktem wejścia** — developer w pracy nie wybiera warstwy debugowania. Dostaje ticket i musi sam zdecydować, gdzie szukać.
3. **Proporcje narzędziowe wynikają z narracji**, nie z odgórnego podziału. Bug w save-session.ts wymaga: Sentry (skąd wiem, że jest problem?), Wrangler (co widzę w logach?), reprodukcji lokalnej (deck OK, review pusty), debug-as-test (test na review_states), fix.

## Konkretny bug jako oś lekcji

Bug zaprojektowany w `bug-sentry-wrangler-research.md`: FK violation w `save-session.ts` — review_states używają draft IDs zamiast flashcard IDs. Efekt:

- Save zwraca 200 ✅
- Deck pokazuje fiszki ✅
- Review jest pusta ❌
- Sentry łapie `orphan_review_state` error
- Wrangler tail pokazuje `console.warn`/`console.error` z severity i sesją
- Bug przechodzi przez testy z m3-l2/l3/l4 (mocked Supabase, typy OK, E2E sprawdza deck nie review)

Ten bug wymusza przejście przez cały workflow: ticket → monitoring → reprodukcja → diagnoza → test → fix → weryfikacja.

## Granica z m3-l2 i m3-l4

| Pytanie | Odpowiada | Lekcja |
|---------|-----------|--------|
| Jak napisać dobry test? | Prompt-template, seed test, rules | m3-l2, m3-l4 |
| Jak rozpoznać zły test? | Anti-wzorce, review checklist | m3-l2, m3-l4 |
| Jak naprawić zły test? | Re-prompting | m3-l2, m3-l4 |
| Test spadł — co dalej? | Debugging workflow | **m3-l5** |
| Skąd wziąć dane diagnostyczne? | Sentry, Wrangler, BrowserTools, trace viewer | **m3-l5** |
| Jak zreprodukować production error? | Debug-as-test workflow | **m3-l5** |

m3-l5 NIE re-teachuje pisania testów, anti-wzorców, ani re-promptowania. Zakłada, że learner to umie z m3-l2 i m3-l4. Uczy: co robisz, kiedy test (lub produkcja) mówi ci, że coś jest nie tak.

## Bridge z m3-l4

m3-l4 kończy się na (draft linia 461):
> "te trudniejsze przypadki, kiedy test E2E spada z nieoczywistego powodu i trzeba dojść od stack trace'a do fixa, to temat następnej lekcji."

m3-l5 otwiera się od ticketa — realnego problemu, nie od "test spadł." Bridge: "testy łapią znane problemy. A co z nieznanymi? Ticket od użytkownika to punkt wejścia, w którym masz najmniej informacji."

## Implikacje dla video

Primary video powinno być na pełnym workflow: ticket → Sentry → wrangler → reprodukcja → diagnoza → test → fix. Ten sam bug (review_states FK violation) przez cały flow, czytelny na nagraniu. Sentry UI i wrangler output są dobrze czytelne statycznie (screenshoty/nagranie terminala).
