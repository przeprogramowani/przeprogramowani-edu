# Video Scenario: m4-l4 — Refaktoryzacja z Agentem: testy, zmiany, weryfikacja

**Slug**: `report-to-decision` · **Format**: conversation-review / artifact walkthrough (terminal tylko w handoffie) · **Cel czasowy**: 15–20 min · **Jedno nagranie** (zastępuje trzy placeholdery draftu — decyzja 2026-06-06)

## Cel wideo

Pokazać dwie czynności, których tekst nie umie zademonstrować: **lekturę raportu ④ okiem sceptyka** (audyt enumeracji, dowody przy werdyktach, czytanie śladów weryfikacji zostawionych przez prompt `m4l4-3`, głośne rozważenie rerankingu) oraz **bramkę decyzyjną** (ranking to propozycja; decyzja zapada w planie i jest widoczna w jego strukturze guard-first). Sam przebieg `/10x-research` zostaje w tekście — jego wynik jest w pełni zrelacjonowany w prozie lekcji. Weryfikacji nie powtarzamy ręcznie: w workflow lekcji robi ją jeden prompt, a wideo uczy audytować jego wynik.

## Założenia

- Widz przeczytał lekcję do sekcji "Przeczytaj, zanim zdecydujesz" — zna kontrakt eksploracji i wie, że raport już istnieje.
- Wszystkie artefakty istnieją na dysku (replay-grade, z dry-runu): `research.md` (wersja po weryfikacji, z korektami "(raport: …)"), `plan.md` (z adnotacjami "(plan: …)").
- Wideo NIE pokazuje: świeżego przebiegu `/10x-research` ani `/10x-plan`, wykonania faz planu, treści `refactor-planning-convo.md` (zapis sesji zawiera nieaktualną liczbę 57 w tabeli `:47` — nie pokazywać).
- Narracja po polsku; artefakty na ekranie są po angielsku — to naturalne (output agenta), nie wymaga komentarza.

## Materiały i setup nagrania

- **Repo/projekt**: `/Users/admin/code/mattermost`, detached HEAD na `29bab2184` (commit demo z M4L2/L3)
- **Narzędzie główne**: IDE z podglądem markdown (artefakty); terminal tylko w segmencie 7 (wpisane, niewykonane polecenie)
- **Pliki startowe**: `context/changes/refactor-opportunities/{change.md, research.md, plan.md}`
- **Pliki tworzone/edytowane**: żadne — wideo jest w całości read-only na gotowych artefaktach
- **Ryzyka live demo**: (brak — nic nie jest uruchamiane na żywo)

---

## Segment 1 — Gdzie jesteśmy: raport leży w folderze zmiany (~2 min)

**Format:** `conversation-review` (artifact walkthrough)

**Cel:** Ustawić kontekst bez powtarzania lekcji: eksploracja się skończyła, decyzji nie ma, raport czeka na lekturę.

**Na ekranie:**

- Drzewo `context/changes/refactor-opportunities/` w eksploratorze IDE
- `change.md` otwarty na bloku intencji

**Przebieg:**

1. Pokaż folder zmiany: `change.md`, `research.md`, `plan.md` ("plan już tu jest, ale udajemy, że go nie widzimy — dojdziemy do niego tą samą drogą co wy").
2. Otwórz `change.md`, podświetl dwie linie intencji: "Na etapie eksploracji nie dzieje się żaden refaktor…" i "decyzja… zapada na etapie planowania, a refaktor rusza dopiero według przyjętego planu".
3. Jedno zdanie: agent skończył pracę i nie zapytał o zgodę — bo kontrakt mu zabronił. Teraz nasza kolej.

**Rezultat:** Widz wie, że wideo zaczyna się dokładnie tam, gdzie tekst lekcji zostawił czytelnika: przed lekturą.

**Most do tekstu:** koniec sekcji "Element ④ (Refactor opportunities): eksploracja i ranking opcji".

---

## Segment 2 — Audyt enumeracji: czy niczego nie zgubił? (~2,5 min)

**Format:** `conversation-review`

**Cel:** Pokazać pierwszy ruch lektury: nie czytasz od rankingu, tylko od listy kandydatów — sprawdzasz kompletność wejścia.

**Na ekranie:**

- `research.md` w podglądzie markdown, sekcja "Enumeration & classification (audit this first)"

**Przebieg:**

1. Przewiń do tabeli P1–P7. Nazwij ruch: "raport sam prosi, żeby zacząć od audytu — *audit this first*".
2. Wskaż klasyfikację: P1–P4 to kandydaci C1–C4; P5 (braki testów) i P6 (brak guarda) to NIE kandydaci — wejście do wykonalności. P7 zatrzymane na granicy "business-behavior redesign".
3. Otwórz obok (split) `post-flow-analysis/research.md` na sekcji Technical debt i odhacz: TD-1→P1, TD-2→P2… "wszystko z ③ jest ujęte, plus dwa problemy zapisane tam tylko między wierszami".
4. Zamknij split.

**Rezultat:** Widz widzi mechaniczny, powtarzalny ruch audytu zamiast "przeczytaj uważnie".

**Most do tekstu:** sekcja "Przeczytaj, zanim zdecydujesz", punkt "lista kandydatów".

---

## Segment 3 — Werdykty i odwrócony faworyt (~3 min)

**Format:** `conversation-review`

**Cel:** Pokazać, że każdy werdykt intencjonalności wisi na dowodzie — i że to dowody odwróciły ranking.

**Na ekranie:**

- `research.md`: sekcja C2 (lane 2: Intentionality), potem "Refactor opportunities (ranked)"

**Przebieg:**

1. Przewiń do C2, lane 2. Podświetl: commit `27d536b212` (2020-03-11, "MM-21552: Adding SaveMultiple…"), uzasadnienie wydajnościowe, "No column-order… bug-fix commit exists". Nazwij wzorzec: werdykt = konkretny commit, nie przeczucie.
2. Krótko zestaw z C1/C3 (accidental cruft: merge monorepo 2023, 430 commitów akrecji) — "intencjonalność rozcięła kandydatów na pół".
3. Przewiń do rankingu: C4 → C1 → C3, C2 w "Considered and rejected". Podświetl uzasadnienie #1: "failure mode… already realized" — `Save` nadpisany, `SaveMultiple` nie.
4. Beat lekcji: "nasz faworyt z raportu ③ wypadł z refaktoru, a wygrał kandydat, o którym myśleliśmy najmniej — i zaraz zobaczymy, jak te twierdzenia strukturalne przeszły przez sito weryfikacji".

**Rezultat:** Odwrócenie rankingu pokazane na artefakcie, z dowodami w kadrze.

**Most do tekstu:** akapity "I najważniejsze: ranking odwrócił faworyta" oraz "werdykty intencjonalności".

---

## Segment 4 — Ślady weryfikacji: co zostawił prompt m4l4-3 (~3 min)

**Format:** `conversation-review`

**Cel:** Pokazać, że całą weryfikację twierdzeń strukturalnych wykonał jeden prompt z paczki — i nauczyć czytać ślady, które zostawił: frontmatter, korekty inline, tabelę z metodami.

**Na ekranie:**

- `research.md`: frontmatter, treść z korektami inline, sekcja "Weryfikacja twierdzeń (ast-grep)"

**Przebieg:**

1. Jedno zdanie ramujące: "Tę warstwę raportu wygenerował jeden prompt — `m4l4-3` z paczki, ten sam blok, który widzieliście w lekcji. Nie powtarzamy jego pracy; uczymy się ją audytować."
2. Frontmatter: tag `verified`, `last_updated_note`, `verification_commit` — raport sam mówi, czym i na jakim commicie był weryfikowany.
3. Pokaż 2–3 korekty inline w treści: "**150 (raport: 145)** webapp files import `Post`", "5 z 57 (raport: ~40)" — ślad korekty zostaje w tekście, stare liczby nie znikają po cichu. To jest format, którego prompt jawnie wymaga.
4. Przewiń do tabeli: twierdzenie → werdykt → dowód (plik:linia) → metoda. Zatrzymaj się na legendzie metod M1–M7: agent zapisał, JAK sprawdzał — w tym pułapkę fałszywego zera `run -p` i zasadę "każde zero ast-grep potwierdź klasycznym grepem".
5. Trzy wiersze warte zatrzymania:
   - klucz rankingu C4: pełna lista 13 metod searchlayer **bez** `SaveMultiple`, zero potwierdzone grepem,
   - obalona "korekta" `:113/:114` — pierwotna analiza miała rację, poprawka poprawki została cofnięta,
   - "8 z 54" — doprecyzowana liczba metod `PostStore` (wróci w segmencie 6 przy adnotacji w planie).

**Rezultat:** Widz wie, że weryfikację robi jeden prompt, a zaufanie do raportu odzyskuje się lekturą audytowalnych śladów, nie ponownym odpalaniem narzędzi.

**Most do tekstu:** blok promptu weryfikacyjnego (`m4l4-3`) i akapit "U nas to sito przeczesało raport liczba po liczbie".

---

## Segment 5 — Reranking na głos: C1 kontra C4 (~2 min)

**Format:** `conversation-review` (myślenie na głos, bez terminala)

**Cel:** Pokazać, że lektura uprawnia do niezgody: ranking można przesunąć, biorąc za to odpowiedzialność.

**Na ekranie:**

- `research.md`, pozycja #2 rankingu (C1)

**Przebieg:**

1. Podświetl skalę C1: 58 plików lustrzanych typów, 150 plików importujących `Post` — obie liczby z tabeli weryfikacji.
2. Rozważ na głos: "C4 naprawia jednego realnego buga; C1 to mechanizm, który skaluje się na dziesiątki typów. Gdybym ważył wartość skumulowaną wyżej, C1 idzie na szczyt."
3. Domknij: "Zostaję przy C4 — zrealizowany bug bije latentny dryf — ale to była moja decyzja po lekturze, nie klik w propozycję agenta." Prework [1.3] jednym zdaniem: wygeneruj, potem zrozum.

**Rezultat:** Widz widzi, jak wygląda "masz pełne prawo się nie zgodzić" w praktyce.

**Most do tekstu:** akapit "I masz pełne prawo się nie zgodzić…".

---

## Segment 6 — Decyzja zapisana w planie: spacer po plan.md (~4 min)

**Format:** `conversation-review`

**Cel:** Pokazać, że produkt bramki decyzyjnej to plan, w którego strukturze widać całą filozofię lekcji: guard-first, charakteryzacja przed dotknięciem, jawne "czego NIE robimy", mechanizm na zielono.

**Na ekranie:**

- `plan.md` w podglądzie markdown

**Przebieg:**

1. Overview: wybór = C4 + quick-win C2 ("test-wartownik"). Jedno zdanie o wywiadzie (bez pokazywania zapisu sesji): siedem pytań, pierwsze brzmiało "którą opcję realizujemy?", a dowód na żywego buga wymusił dodatkowe, siódme.
2. "Current State Analysis": podświetl twardy dowód buga — 3 produkcyjne wywołania `SaveMultiple`, wszystkie bulk import, indeksacja tylko ręczna ("Index Now"), "**Imported posts are unsearchable until manual reindex**".
3. **Beat adnotacji (scripted, jedno zdanie):** wskaż "54 (plan: 57) methods" — "nawet planer policzył raz źle; liczba została skorygowana po sesji do wartości zweryfikowanej ast-grepem. Dokładnie dlatego liczby się sprawdza, a korekty zostawiają ślad w artefakcie."
4. "What We're NOT Doing": bez C1, bez C3, bez migracji na `NamedExec` — wąski zakres jako kontrola pola rażenia.
5. Fazy 1–4 (przewiń nagłówki): Faza 1 test-wartownik (sentinel values — wskaż "Phase 1's test must compare serialized values, not kinds" w Critical Details: trzeci etap doszlifowania projektu testu), Faza 2 charakteryzacja `Save→indexPost` PRZED nadpisaniem `SaveMultiple`, Faza 3 mechanizm opt-in ląduje na zielono, Faza 4 triage wyjątków (~93 metody) i aktywacja pod istniejącą bramką CI.
6. Sekcja `## Progress`: każda faza ma kryteria automatyczne i ręczne — "bezpieczeństwo nie jest obietnicą, tylko własnością planu".

**Rezultat:** Widz umie odczytać z planu, że decyzja była broniona, a nie przyklepana.

**Most do tekstu:** sekcje "Bramka decyzyjna w /10x-plan" i diagram czterech faz.

---

## Segment 7 — Handoff i zamknięcie (~1 min)

**Format:** `conversation-review`

**Cel:** Domknąć pętlę: nowy pipeline wpina się w znany cykl.

**Na ekranie:**

- Terminal z wpisanym (niewykonanym) poleceniem

**Przebieg:**

1. Wpisz: `/10x-implement refactor-opportunities phase 1` — nie uruchamiaj. "Implementowanie planów już znacie — to ten sam cykl z modułu 2."
2. Zamknięcie: raport ②③ z poprzedniej lekcji + ranking ④ z decyzją = komplet. "W tekście lekcji czeka jeszcze jedna luka — domenowa. To temat następnej lekcji."

**Rezultat:** Wideo kończy się dokładnie tam, gdzie tekst: na przekazaniu planu, nie na egzekucji.

**Most do tekstu:** sekcja "Przekazanie planu: wpinamy się w znany cykl".

---

## Pre-production TODO

### For `conversation-review` segments:

- [ ] Mattermost na `29bab2184` (detached), `git status` bez śmieci poza nietrackowanym `context/`

- [ ] `research.md` i `plan.md` otwarte w zakładkach IDE przed startem; zoom podglądu markdown tak, żeby tabela weryfikacji mieściła kolumny bez przewijania poziomego
- [ ] Zakładki/foldy ustawione na sekcje: Enumeration, C2 lane 2, Ranked, Weryfikacja, plan Overview, NOT Doing, Progress
- [ ] Scripted line do adnotacji "54 (plan: 57)" (segment 6, krok 3) przeczytana raz na głos przed nagraniem
- [ ] `refactor-planning-convo.md` ZAMKNIĘTY (nie pokazywać — `:47` zawiera nieskorygowane 57)

### General:

- [ ] Timer/notatka z budżetami segmentów: 2 / 2,5 / 3 / 3 / 2 / 4 / 1 ≈ 17,5 min
- [ ] Terminal do segmentu 7: czcionka ≥ 16 pt, polecenie wpisane wcześniej w historii (strzałka w górę zamiast pisania na żywo)

## Video/text mismatches

- Placeholder segmentu 1 draftu (przebieg `/10x-research` na żywo) nie jest realizowany jako nagranie przebiegu — zastąpiony artifact walkthrough; draft zredagowany do jednego placeholdera 2026-06-06 (decyzja użytkownika).
- Spec (`lesson-spec.md` §Video Placeholders) przewidywał 4 segmenty + opcjonalny Deep Dive; zrealizowany kształt to 1 wideo hybrydowe. Opcjonalny segment Deep Dive (`/10x-test-plan` jako kampania) — ucięty zgodnie z klauzulą "cut if recording runs long".

## Claims introduced only in video

(none — wszystkie liczby i beaty pochodzą z research.md/plan.md po korekcie 54/93; wideo niczego nie uruchamia na żywo)

## Needs human decision

- Czy w segmencie 6 beat adnotacji "54 (plan: 57)" zostaje (rekomendacja: tak — wzmacnia tezę lekcji o weryfikacji liczb), czy plan pokazujemy bez zatrzymania na adnotacji.
