# Video Scenario: m2-l5 — Multi-session tools overview (p2)

## Cel wideo

Pokazać uczestnikowi, że narzędzia do orkiestracji wielu sesji agentów istnieją i dzielą wspólny wzorzec: izoluj kontekst per zadanie, deleguj cel agentowi, reviewuj wynik w jednym miejscu. Krótki przegląd (3-5 minut), nie tutorial, nie recenzja produktu, nie rekomendacja.

Uczestnik po tym wideo powinien wiedzieć, że kategoria narzędzi istnieje, rozpoznawać wspólny pattern i móc samodzielnie sprawdzić linki z materiałów dodatkowych.

## Założenia

- Stan po p1: dwa worktrees z implementacjami S-05 i S-06 na osobnych branchach, commity per faza.
- Prowadzący NIE instaluje ani nie konfiguruje żadnego z pokazywanych narzędzi na żywo.
- Format: conversation-review z krótkimi screenami / screenshotami interfejsów.
- Wideo NIE jest tutorialem setup — uczestnik nie ma odtwarzać kroków.
- Wideo NIE rekomenduje jednego narzędzia nad inne — wzorzec jest ważniejszy od produktu.
- Wideo NIE wchodzi w PR review, merge, archive ani quality pain — to tematy p3.
- Wideo NIE powtarza worktree setup ani `/goal` — te koncepty są z p1.

## Materiały i setup nagrania

- Repo/projekt: 10xCards — po p1, z dwoma worktrees i feature branchami.
- Narzędzie główne: Claude Code (terminal) — widoczne jako punkt odniesienia (tak prowadzisz dwa agenty ręcznie).
- Materiały wizualne (przygotowane przed nagraniem):
  - Screenshot lub krótki screen recording: **Superset** — widok terminala z wieloma agentami w osobnych worktrees.
  - Screenshot lub krótki screen recording: **Conductor.build** — unified review z diffami i checkpointami wielu sesji.
  - Screenshot lub krótki screen recording: **Antigravity** — Manager view z wieloma agentami w IDE.
  - Screenshot lub krótki screen recording: **VS Code Agent View** — panel z sesjami agentów (Copilot, Claude, Codex).
- Pliki tworzone/edytowane: brak — wideo jest read-only.
- Ryzyka:
  - UI narzędzi może się zmienić między przygotowaniem materiałów a publikacją lekcji.
  - Uczestnik może potraktować przegląd jako rekomendację zakupu.

## Segment 1 — Punkt startu: ręczna orkiestracja

**Format:** `conversation-review`

**Cel:** Ustawić kontekst: po p1 prowadzisz dwa agenty w dwóch terminalach. Działa, ale wymaga ręcznego przełączania. Naturalnie szukasz narzędzia, które pokaże wszystkie sesje w jednym widoku.

**Na ekranie:**

- Dwa okna terminala obok siebie (z p1): worktree S-05 i worktree S-06, każdy z własną sesją Claude Code.

**Przebieg:**

1. Prowadzący pokazuje dwa terminale: "Po wideo o parallel run mamy dwa agenty, każdy w swoim worktree. Działają niezależnie. Przełączam się ręcznie."
2. Komentarz: "Przy dwóch sesjach to wystarczy. Ale rynek już odpowiedział na pytanie: co, jeśli chcę widzieć wszystkie sesje w jednym miejscu?"
3. Komentarz: "Pokażę cztery narzędzia. Nie po to, żebyś któreś zainstalował teraz. Po to, żebyś zobaczył, że wszystkie robią to samo — tylko w różnych opakowaniach."

**Rezultat:** Uczestnik rozumie, skąd bierze się potrzeba orkiestracji i czego szukać.

**Most do tekstu:** odpowiada otwarciu sekcji "Wiele sesji, jedno biurko."

## Segment 2 — Cztery narzędzia, jeden wzorzec

**Format:** `conversation-review`

**Cel:** Przejść przez Superset, Conductor, Antigravity i VS Code Agent View. Każde narzędzie dostaje 30-45 sekund: jeden screenshot/screen, jedno zdanie o tym, co robi, i wskazanie tego samego wzorca.

**Na ekranie:**

- Kolejno: screenshot/screen każdego narzędzia. Prowadzący komentuje voice-over.

**Przebieg:**

1. **Superset** — screenshot terminala z wieloma agentami:
   - "Superset uruchamia wielu agentów CLI z jednego terminala. Każdy w osobnym worktree. Widać status, logi, postęp."
   - Wskazuje: "Izolacja kontekstu — worktrees. Delegowanie — agent per worktree. Review — widok postępu."

2. **Conductor.build** — screenshot unified review:
   - "Conductor zbiera sesje Claude Code i Codex w jeden interfejs. Diffy, checkpointy, status sesji."
   - Wskazuje: "Ten sam wzorzec: wiele sesji, jedno miejsce do przeglądu wyników."

3. **Antigravity** — screenshot Manager view:
   - "Antigravity od Google. Manager view: jeden interfejs, wielu agentów w IDE."
   - Wskazuje: "Izoluj, deleguj, reviewuj — to samo w opakowaniu IDE."

4. **VS Code Agent View** — screenshot panelu agentów:
   - "VS Code ma wbudowany panel Agent View. Sesje Copilot, Claude i Codex obok siebie."
   - Wskazuje: "Nawet edytor kodu poszedł w tym kierunku. Pattern jest ten sam."

5. Podsumowanie: "Cztery narzędzia, cztery interfejsy, jeden wzorzec: izoluj kontekst per zadanie, deleguj cel agentowi, reviewuj wynik w jednym miejscu. Produkty będą rotować co kwartał. Wzorzec zostanie."

**Rezultat:** Uczestnik widzi kategorię narzędzi i rozpoznaje wspólny pattern. Nie czuje presji, żeby wybrać jedno narzędzie teraz.

**Most do tekstu:** odpowiada liście narzędzi i konkluzji o wzorcu w sekcji "Wiele sesji, jedno biurko."

## Pre-production TODO

### For `conversation-review` segments:

- [ ] Screenshot lub screen recording Superset — aktualny UI z widokiem wielu agentów.
- [ ] Screenshot lub screen recording Conductor.build — unified review z diffami i sesjami.
- [ ] Screenshot lub screen recording Antigravity — Manager view z wieloma agentami.
- [ ] Screenshot lub screen recording VS Code Agent View — panel z sesjami agentów.
- [ ] Wszystkie screeny przygotowane w czytelnej rozdzielczości, ciemny motyw, bez danych personalnych.
- [ ] Dwa terminale z p1 nadal widoczne jako punkt startu segmentu 1.
- [ ] Talking points przygotowane: prowadzący wie, co powiedzieć o każdym narzędziu w 30-45 sekund.

### General:

- [ ] Czas trwania docelowy: 3-5 minut.
- [ ] Kolejność nagrania: po p1, przed p3. Stan worktrees z p1 widoczny na ekranie.
- [ ] Screeny narzędzi sprawdzone pod kątem aktualności — UI może się zmienić między przygotowaniem a publikacją.
- [ ] Prowadzący przećwiczył neutralny ton: żadnej rekomendacji, żadnego "najlepsze narzędzie", żadnego "musisz to zainstalować".

## Video/text mismatches

(none)

## Claims introduced only in video

(none)

## Needs human decision

- Czy screeny narzędzi powinny być statyczne (screenshot) czy krótkie nagrania (5-10 sekund screen recording per narzędzie).
- Czy prowadzący powinien mieć którekolwiek z narzędzi zainstalowane i pokazać live UI, czy wystarczą przygotowane materiały wizualne.
- Czy Antigravity jest dostępny publicznie w momencie nagrania (Google może ograniczyć dostęp) — jeśli nie, zastąpić screenshotem z oficjalnego bloga.
