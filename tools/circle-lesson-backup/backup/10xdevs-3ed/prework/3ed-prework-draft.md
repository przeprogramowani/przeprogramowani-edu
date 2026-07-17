# Prework 3ed — struktura modułowa

## End-goal preworku: lista kontrolna na start Modułu 1

Przed Modułem 1 uczestnik powinien mieć:

- działające narzędzie Agentowe - `Cursor`, `Claude Code` lub alternatywy,
- konto w danej usłudze i podstawową konfigurację narzędzi,
- znajomość podstawowych konceptów dotyczących `LLMów` i konsekwencji ich architektury,
- świadomość ustawień prywatności,
- minimalną orientację w kursowym stacku.

Każda lekcja preworku istnieje po to, żeby odhaczyć konkretne punkty z tej listy. Jeśli lekcja nie przybliża uczestnika do gotowości startowej — nie powinna tu być.

---

## Założenia

- Prework to **onboarding**, nie kurs o AI od zera. Jego jedyny cel: M1 startuje od pracy z agentem, nie od instalacji narzędzi i tłumaczenia pojęć.
- Uczestnik 2026 zna już ChatGPT/Cursora/Copilota i słyszał o agentach, ale **nie ma operacyjnej dyscypliny** pracy z AI w IDE i CLI.
- Format: **4 moduły, każdy z niezależnymi blokami** — chunk to atomowa jednostka z własnym celem i efektem końcowym.
- `Cursor` i `Claude Code` to osobne bloki — dwa różne tryby pracy (IDE agent vs CLI agent).
- Cała teoria (LLM-y, prompting, kontekst, drift) scalona w jeden moduł: **Jak to działa pod maską**.
- Prework narzuca konkretną ścieżkę (`Cursor + Claude Code`), ale nie udaje, że nic innego nie istnieje — `Copilot` obecny jako krótkie mapowanie, nie równorzędna ścieżka.
- Bezpieczeństwo, koszty i review: lekki sygnał wstępny, nie osobne rozbudowane lekcje. Minimum operacyjne na dzień 0.
- To, co jest rdzeniem wartości płatnego M1 (skills, MCP, feedback loops, permissions, pliki kontekstowe jako system), **zostaje w M1** — prework nie konsumuje szkolenia.

---

## Struktura preworku

### Moduł 1. Więcej niż ChatGPT

| Blok | Format | Priorytet |
|------|--------|-----------|
| 1.1 Chatbot vs Agent vs Harness — definicje | text | core |
| 1.2 Demo bug fix na Mattermost — nagranie | video | core |

### Moduł 2. Tooling do programowania z AI

| Blok | Format | Priorytet |
|------|--------|-----------|
| 2.1 Agent w IDE vs Agent w Terminalu | text | core |
| 2.2 Cursor — Podstawy operacyjne | video + text | core |
| 2.3 Claude Code — Podstawy operacyjne | video + text | core |
| 2.4 Agent-Native IDE — nowa generacja narzędzi | text | optional |
| 2.5 Mini-Task Rozgrzewkowy | exercise | recommended |

### Moduł 3. Jak to działa pod maską

| Blok | Format | Priorytet |
|------|--------|-----------|
| 3.1 LLMy i ich wpływ na codzienną pracę | text | core |
| 3.2 Wzorce i antywzorce promptowania | text | core |
| 3.3 Cykl życia wątku i zarządzanie kontekstem | text | core |
| 3.4 Język pracy z AI | text | optional |
| 3.5 Rekomendowane modele i jak być na bieżąco | text | recommended |

### Moduł 4. Przygotowania do projektu

| Blok | Format | Priorytet |
|------|--------|-----------|
| 4.1 Tech Stack Overview | text | core |
| 4.2 Dobry i zły projekt kursowy | text | core |
| 4.3 Checklista uczestnika i support (Circle) | checklist | core |

---

## Moduł 1. Więcej niż ChatGPT

**Cel modułu:** od pierwszych minut ustawić, czym jest praca z agentem i dlaczego to nie jest kolejny chatbot.

---

### 1.1 Chatbot vs Agent vs Harness — definicje

**Cel bloku:** uczestnik zna trzy kluczowe pojęcia i rozumie swoją rolę jako operatora agenta.

**Format:** text

**Treść:**

Ustawienie pojęć od pierwszych zasad:

- **Chatbot:** człowiek pyta, model odpowiada, człowiek pyta ponownie. Każdy krok wymaga interwencji. Model generuje tekst, ale nie działa na środowisku.
- **Agent:** dostaje cel, nie pytanie. Planuje, działa, obserwuje wynik, koryguje, powtarza. Autonomiczna pętla `think → act → observe → repeat`. Ma narzędzia — czyta pliki, uruchamia komendy, edytuje kod.
- **Harness:** warstwa uruchomieniowa, która zamienia LLM w agenta. Dostarcza narzędzia, zarządza pętlą agenta, kontroluje uprawnienia, zarządza kontekstem i daje operatorowi punkty kontrolne. Ten sam model w trybie czatu jest chatbotem, w harnessie — agentem.

Rola uczestnika: **nie jesteś użytkownikiem chatbota. Jesteś operatorem agenta — delegujesz zadanie, dostarczasz kontekst, kontrolujesz przebieg i weryfikujesz wynik.**

**Efekt końcowy:** uczestnik rozróżnia chatbot / agent / harness i rozumie, dlaczego reszta preworku uczy dwóch konkretnych harnessów.

---

### 1.2 Demo bug fix na Mattermost — nagranie

**Cel bloku:** pokazać ciągłą sesję realnej pracy z agentem na produkcyjnym repo.

**Format:** video

**Treść:**

Demo nagrywamy na otwartym repozytorium `mattermost/mattermost` — duży, produkcyjny projekt, którego agent nigdy wcześniej nie widział. Uczestnik widzi jedną ciągłą sesję pracy.

**Przebieg:**

1. **Pobranie zgłoszenia z GitHub** — agent używa `gh` CLI, żeby pobrać konkretne zgłoszenie błędu z repozytorium. Zgłoszenie trafia do kontekstu agenta jako punkt startu.
2. **Analiza** — agent eksploruje repozytorium: przeszukuje pliki, czyta kod, buduje zrozumienie architektury i lokalizuje źródło problemu. Nie zgaduje — czyta.
3. **Plan** — agent proponuje plan naprawy. Operator widzi, co agent zamierza zrobić, i może skorygować kierunek.
4. **Implementacja** — agent wdraża zmianę: edytuje pliki, dostosowuje się do konwencji projektu, iteruje jeśli trzeba.
5. **Testy** — agent uruchamia testy, weryfikuje, że poprawka działa i nie wprowadza regresji.

**Dlaczego Mattermost:**

- duże, produkcyjne repo — agent musi się najpierw zorientować, nie może polegać na „znajomości" projektu,
- open source — uczestnik może sam otworzyć to repo i spróbować,
- wiarygodny kontekst — to nie jest zabawkowy przykład, tylko realna praca na realnym kodzie.

**Co pokazać:**

- agent czyta pliki i uruchamia komendy — nie tylko generuje tekst,
- agent korzysta z zewnętrznych narzędzi (`gh` CLI) — nie jest zamknięty w edytorze,
- operator nadal zatwierdza i ocenia wynik — agent nie działa bez nadzoru,
- jedna krótka wzmianka: to jest pętla agenta, pełna praktyka przyjdzie w M1.

**Czego tu nie tłumaczyć głęboko:**

- MCP,
- Skills,
- sandboxing,
- zaawansowane techniki promptowania,
- rozbudowane porównania narzędzi.

**Efekt końcowy:** uczestnik widział realną sesję pracy z agentem od początku do końca i wie, po co uczy się dalej toolingu i teorii.

---

## Moduł 2. Tooling do programowania z AI

**Cel modułu:** uczestnik ma zainstalowane i skonfigurowane dwa kluczowe narzędzia, rozumie kiedy użyć którego, i wykonał pierwsze zadanie z agentem.

---

### 2.1 Agent w IDE vs Agent w Terminalu

**Cel bloku:** uczestnik rozumie, że to dwa komplementarne tryby pracy, nie konkurencja.

**Format:** text

**Treść:**

Dwa modele pracy z agentem:

- **Agent w IDE (Cursor):** wizualny, zintegrowany z edytorem, diffy inline, kontekst z otwartych plików. Najlepszy do pracy na konkretnych plikach, refaktoringu w kontekście, szybkich edycji.
- **Agent w Terminalu (Claude Code):** CLI-first, pełna autonomia, dostęp do systemu plików i narzędzi terminalowych. Najlepszy do eksploracji dużych repo, zadań wieloplikowych, automatyzacji, pracy na diffach.

To nie jest wybór „albo/albo" — to jest pytanie „kiedy co". Kurs uczy obu ścieżek, bo w praktyce się uzupełniają.

**Miejsce dla Copilota i innych:**

- jedno zdanie: rynek ma też inne agentowe IDE i CLI (Copilot, Windsurf, Aider, etc.),
- kursowa ścieżka referencyjna idzie przez `Cursor + Claude Code`,
- nie rozszerzać do przeglądu rynku.

**Efekt końcowy:** uczestnik wie, dlaczego uczy się dwóch narzędzi i kiedy sięgnie po które.

---

### 2.2 Cursor — Podstawy operacyjne

**Cel bloku:** uczestnik ma zainstalowanego Cursora, zna tryby pracy i kontroluje prywatność.

**Format:** video (walkthrough UI) + text (referencja)

**Treść:**

**Zakres obowiązkowy:**

- instalacja i podstawowe ustawienia AI,
- `Privacy Mode` i kontrola danych,
- tryby pracy: inline edit, chat, agent,
- jak dodawać kontekst i kiedy NIE dodawać całego repo,
- zmiana modelu pod typ zadania,
- podstawowa orientacja w tym, co IDE wysyła do modelu.

**Minimalne mapowanie dla użytkowników Copilota:**

- Cursor `Chat` ↔ Copilot `Chat`,
- Cursor `Agent` ↔ Copilot `Agent Mode`,
- Cursor `Rules` ↔ Copilot `Instructions`.

**Czego świadomie NIE robić:**

- nie robić szerokiego porównania rynku,
- nie uczyć jeszcze rules, commands, hooks i rozszerzeń,
- nie wchodzić w budowanie własnych przepływów pracy.

**Efekt końcowy:** uczestnik potrafi wykonać 3 typy zadań w Cursorze i ma ustawiony Privacy Mode.

---

### 2.3 Claude Code — Podstawy operacyjne

**Cel bloku:** uczestnik ma działającego Claude Code, umie czytać wyjście agenta i zna podstawowe komendy.

**Format:** video (sesja w terminalu) + text (ściągawka komend)

**Treść:**

**Zakres obowiązkowy:**

- instalacja i pierwsze uruchomienie,
- `/help`, `/clear`, `/compact`, `/context`,
- czytanie wyjścia agenta: kiedy analizuje, kiedy edytuje, kiedy odpala komendę,
- praca na diffach i zatwierdzanie zmian,
- podstawowe koszty i limity,
- kiedy `Claude Code` jest lepszym wyborem niż czat w IDE.

**Kluczowy model mentalny:**

- to nie jest „ChatGPT w terminalu",
- to jest agent, który działa na repo, iteruje i korzysta z narzędzi,
- Twoja rola to delegować, kontrolować i weryfikować.

**Czego tu nie tłumaczyć jeszcze:**

- permissions i sandbox mode w szczegółach,
- subagents,
- hooks,
- MCP,
- tworzenie własnych skilli.

**Efekt końcowy:** uczestnik ma działającego `Claude Code` i umie nim wykonać proste zadanie.

---

### 2.4 Agent-Native IDE — nowa generacja narzędzi

**Cel bloku:** uczestnik wie, że oprócz Cursora i Claude Code rynek idzie w kierunku IDE budowanych od zera wokół agentów, i zna trzy flagowe przykłady.

**Format:** text

**Priorytet:** optional

**Treść:**

Cursor i Claude Code to narzędzia, które **dodają** agenta do istniejącego przepływu pracy (fork VS Code, CLI). Nowa fala narzędzi idzie dalej — buduje IDE od podstaw z agentem jako centralnym elementem:

**Codex Desktop (OpenAI)**

- desktopowa aplikacja do zarządzania wieloma agentami kodującymi równolegle,
- każdy agent działa w izolowanym środowisku z własną kopią repo,
- model pracy: delegujesz zadania, agenty pracują asynchronicznie w tle, dostajesz gotowe PR-y,
- napędzany modelami GPT-5.x Codex, zoptymalizowanymi pod generowanie kodu.

**Antigravity (Google)**

- agent-first IDE zbudowane jako zmodyfikowany fork VS Code, z Gemini 3 zintegrowanym w rdzeń,
- agent ma bezpośredni dostęp do systemu plików, terminala i instancji przeglądarki,
- Manager View — centrum kontroli do orkiestracji wielu agentów pracujących równolegle na różnych workspace'ach,
- agenty generują „Artifacts" (plany, screenshoty, nagrania przeglądarki) zamiast surowych wywołań narzędzi — buduje to zaufanie do wyniku,
- dostępne w publicznym preview za darmo dla użytkowników indywidualnych.

**Conductor**

- narzędzie do uruchamiania zespołu agentów kodujących na jednej maszynie,
- każdy agent dostaje izolowany Git worktree — bez konfliktów między równoległymi zadaniami,
- dashboard pokazuje, kto nad czym pracuje, z możliwością review kodu w trakcie,
- model mentalny: „orkiestrator wielu Claude Code działających równolegle".

**Dlaczego to jest opcjonalne:**

- kurs uczy Cursora i Claude Code, bo są dojrzałe i stabilne,
- Agent-Native IDE to kierunek, w który zmierza rynek — warto wiedzieć, że istnieją,
- uczestnik, który chce eksperymentować, ma punkt startu.

**Czego NIE robić:**

- nie robić tutoriala z żadnego z tych narzędzi,
- nie sugerować, że zastępują kursową ścieżkę,
- nie wchodzić w pricing i szczegółowe porównania.

**Efekt końcowy:** uczestnik wie, że Cursor i Claude Code to nie koniec świata — agent-native IDE to następna fala, i zna trzy flagowe przykłady.

---

### 2.5 Mini-Task Rozgrzewkowy

**Cel bloku:** uczestnik stosuje Cursora lub Claude Code do wykonania pierwszego zadania samodzielnie.

**Format:** exercise

**Treść:**

Proste, zamknięte zadanie, które uczestnik wykonuje wybranym narzędziem (Cursor lub Claude Code). Zadanie powinno:

- wymagać od agenta przeczytania istniejącego kodu,
- wymagać edycji minimum jednego pliku,
- mieć weryfikowalny wynik (np. test przechodzi, strona się renderuje),
- nie wymagać wiedzy domenowej wykraczającej poza prework.

**Czego tu NIE robić:**

- nie narzucać jednego narzędzia — uczestnik wybiera,
- nie robić z tego ocenianego zadania,
- nie wymagać zaawansowanych technik promptowania.

**Efekt końcowy:** uczestnik przeszedł pełny cykl: zadanie → agent → wynik → weryfikacja. Tarcie mentalne zdjęte przed M1.

---

## Moduł 3. Jak to działa pod maską

**Cel modułu:** zbudować jeden spójny model mentalny dla pracy z modelami i agentami. To jest flagowy moduł konceptualny preworku.

---

### 3.1 LLMy i ich wpływ na codzienną pracę

**Cel bloku:** uczestnik rozumie praktyczne konsekwencje architektury LLM-ów dla swojej pracy.

**Format:** text

**Treść:**

Minimum, które musi wyjść z tego bloku:

- tokeny mają koszt i wpływają na jakość,
- deklarowane okno kontekstowe nie oznacza, że warto je zapełniać,
- model przewiduje kolejne tokeny, nie „wie",
- halucynacje są cechą systemu, nie wypadkiem przy pracy,
- dlatego review, testy i zewnętrzna weryfikacja są konieczne.

**Czego NIE robić:**

- nie zamieniać w akademicki kurs o architekturze transformerów,
- nie wchodzić w szczegóły treningu i fine-tuningu,
- skupić się na „co to dla mnie znaczy w praktyce".

**Efekt końcowy:** uczestnik wie, dlaczego model się myli, dlaczego to nie jest bug, i dlaczego review jest obowiązkowe.

---

### 3.2 Wzorce i antywzorce promptowania

**Cel bloku:** uczestnik zna anatomię dobrego prompta i rozpoznaje typowe błędy.

**Format:** text

**Treść:**

**Anatomia prompta — praktyczne minimum:**

- rola,
- kontekst,
- instrukcja,
- ograniczenia,
- oczekiwane wyjście.

**Typowe antywzorce:**

- zbyt ogólne instrukcje bez kontekstu,
- przekładanie odpowiedzialności na model („zrób dobrze"),
- brak ograniczeń → model zgaduje format i zakres,
- ładowanie całego repo zamiast precyzyjnego kontekstu.

To wystarczy, żeby M1 mogło uczyć już lepszych technik, a nie podstaw higieny prompta.

**Efekt końcowy:** uczestnik potrafi napisać strukturalnie poprawny prompt i wie, czego unikać.

---

### 3.3 Cykl życia wątku i zarządzanie kontekstem

**Cel bloku:** uczestnik rozumie, że kontekst się zużywa i wie, kiedy restartować.

**Format:** text

**Treść:**

To jest nowy, wyróżniający temat 3. edycji:

- po długiej rozmowie jakość odpowiedzi spada (dryf kontekstu),
- więcej kontekstu nie zawsze pomaga — model gubi się w szumie,
- trzeba umieć rozpoznać moment restartu,
- `compact`, `clear`, nowy wątek to różne decyzje, nie magiczne przyciski:
  - `compact` — skraca kontekst, zachowuje sens,
  - `clear` — czyści kontekst, zachowuje sesję,
  - nowy wątek — pełny reset.

**Efekt końcowy:** uczestnik wie, kiedy kontekst pracuje na jego korzyść, a kiedy przeciwko niemu.

---

### 3.4 Język pracy z AI

**Cel bloku:** ustawić praktyczne podejście do języka, bez debaty.

**Format:** text

**Priorytet:** optional

**Treść:**

- promptuj w języku, który najlepiej wspiera zadanie i zespół,
- kod, nazwy i wyjścia techniczne zwykle po angielsku,
- polski bywa wygodny, ale jest droższy tokenowo,
- nie robić z tego osobnej debaty — język to narzędzie, nie ideologia.

**Efekt końcowy:** uczestnik ma praktyczną regułę kciuka zamiast niepewności.

---

### 3.5 Rekomendowane modele i jak być na bieżąco

**Cel bloku:** uczestnik wie, które modele wybrać na start i gdzie śledzić zmiany.

**Format:** text

**Priorytet:** recommended

**Treść:**

- rekomendacje modeli na start kursu (stan na dzień publikacji preworku),
- krótka charakterystyka: który model do jakiego typu zadań (szybkie pytania vs złożone zadania agentowe),
- gdzie śledzić zmiany: oficjalne blogi, changelogi, benchmarki,
- dlaczego ta wiedza szybko się dezaktualizuje i jak się z tym obchodzić,
- kursowe kanały na Circle jako źródło bieżących aktualizacji.

**Czego NIE robić:**

- nie robić rozbudowanego porównania wszystkich dostawców,
- nie obiecywać, że rekomendacje przetrwają dłużej niż kilka tygodni,
- nie wchodzić w pricing — to zmienia się szybciej niż treść kursu.

**Efekt końcowy:** uczestnik wie, jaki model ustawić w Cursorze i Claude Code na start, i wie gdzie szukać aktualizacji.

---

## Moduł 4. Przygotowania do projektu

**Cel modułu:** uczestnik orientuje się w kursowym stacku, ma pomysł na projekt i jest gotowy do startu M1.

---

### 4.1 Tech Stack Overview

**Cel bloku:** zminimalizować poznawcze tarcie przy bootstrapie w M1.

**Format:** text

**Treść:**

To nie ma być tutorial frameworkowy. To ma być **orientacja**.

- czym jest kursowy stack: `Astro`, `React`, `TypeScript`, `Tailwind`, `Supabase`,
- dlaczego ten stack jest dobry do pracy z AI:
  - typowany,
  - popularny,
  - konwencyjny,
  - dobrze wspierany przez modele,
- jak ten stack układa się w głowie uczestnika,
- czego nie trzeba jeszcze umieć perfekcyjnie przed M1.

**Czego NIE robić:**

- nie robić tutoriala z Astro/React/Supabase,
- nie uczyć TypeScripta od zera,
- nie sugerować, że trzeba znać stack przed startem.

**Efekt końcowy:** M1 nie zamienia się w onboarding do Astro ani wsparcie instalacyjne.

---

### 4.2 Dobry i zły projekt kursowy

**Cel bloku:** uczestnik ma realistyczne oczekiwania wobec projektu kursowego i wie, jaki zakres wybrać.

**Format:** text

**Treść:**

- co to jest projekt kursowy i jaką rolę pełni w szkoleniu,
- cechy dobrego projektu kursowego:
  - jasno zdefiniowany scope,
  - wykonalny w czasie kursu przy wsparciu agentów AI,
  - pozwala przećwiczyć kluczowe umiejętności z modułów,
  - nie wymaga specjalistycznej wiedzy domenowej,
- cechy złego projektu kursowego:
  - zbyt ambitny zakres („zbuduję drugi Figma"),
  - zbyt zależny od integracji, na które kurs nie daje czasu,
  - zbyt trywialny — nie ćwiczy realnych umiejętności,
- przykłady dobrych i złych wyborów (bez narzucania konkretnego pomysłu),
- zachęta do przygotowania pomysłu przed M1.

**Efekt końcowy:** uczestnik przychodzi na M1 z realistycznym pomysłem na projekt, nie z „jeszcze nie wiem co".

---

### 4.3 Checklista uczestnika i support (Circle)

**Cel bloku:** weryfikacja gotowości + orientacja w platformie kursowej.

**Format:** checklist

**Treść:**

**Lista kontrolna na start M1:**

- [ ] Mam działające narzędzie agentowe — `Cursor`, `Claude Code` lub alternatywę umożliwiającą pracę z Agentem AI (nie chatbot w przeglądarce)
- [ ] Mam konto w usłudze i podstawową konfigurację narzędzia
- [ ] Rozumiem, czym jest agent i jaka jest moja rola jako operatora
- [ ] Wiem, czym jest dryf kontekstu i kiedy restartować wątek
- [ ] Orientuję się w kursowym stacku
- [ ] Mam pomysł na projekt kursowy

**Orientacja w Circle:**

- jak poruszać się po platformie kursowej,
- gdzie zadawać pytania i szukać pomocy,
- jak korzystać z kanałów wsparcia,
- czego spodziewać się w M1.

**Efekt końcowy:** uczestnik wie, czy jest gotowy, i wie, gdzie szukać pomocy, jeśli nie jest.
