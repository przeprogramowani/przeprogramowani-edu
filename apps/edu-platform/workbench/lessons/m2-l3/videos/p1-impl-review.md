# Video Scenario: m2-l3 — Solo Code Review (p1: impl-review)

## Cel wideo

Pokazać pełny przebieg `/10x-impl-review` na implementacji z poprzedniej lekcji: od uruchomienia, przez odczytanie 6-wymiarowego scorecarda, po przegląd findings posortowanych wg severity. Uczestnik widzi, jak wygląda raport, co każdy wymiar mierzy i dlaczego findings wymagają ludzkiej decyzji, a nie automatycznego fixa.

## Założenia

- Projekt 10xCards po implementacji slice'a S-04 (srs-review-session) z poprzedniej lekcji. S-04 jest rekomendowany ze względu na bogaty profil findings: auth, integracja biblioteki (ts-fsrs), React island, schema design, kontrakt API. Fallback: S-01 (prostsza, ale mniej różnorodne findings).
- `plan.md` dla S-04 istnieje w `context/changes/srs-review-session/plan.md` i jest zatwierdzony.
- `## Progress` w planie ma wszystkie fazy oznaczone `[x]` z SHA per step.
- Prowadzący używa Claude Code jako narzędzia przykładowego, ale komentuje zasady jako przenoszalne.
- Wideo NIE wchodzi w interactive triage — to jest temat p2.
- Wideo NIE omawia CI/CD review ani `/10x-impl-review-ci` (temat M3).
- Wideo NIE porusza badań naukowych ani evidence — to zostaje w tekście lekcji.

## Materiały i setup nagrania

- Repo/projekt: 10xCards — projekt kursowy, po bootstrapie z m1-l3 i implementacji S-04 (srs-review-session) z poprzedniej lekcji.
- Narzędzie główne: Claude Code (terminal), z komentarzem tool-agnostic.
- Pliki startowe:
  - `context/changes/srs-review-session/plan.md` — zatwierdzony plan z m2-l2.
  - Zaimplementowany kod z commitami per faza.
  - `context/foundation/lessons.md` — istniejące reguły projektu (z m1-l4).
  - `CLAUDE.md` / `AGENTS.md` — instrukcje agenta.
- Pliki tworzone/edytowane:
  - `context/changes/srs-review-session/reviews/impl-review.md` — raport review (generowany przez skill).
- Stan fallback: przygotowany reference review report z 5-6 findings o zróżnicowanej severity i impact, gotowy do wklejenia jeśli agent wygeneruje raport nienadający się do demo.
- Ryzyka live demo:
  - Agent może wygenerować raport z innym rozkładem findings niż planowany.
  - Scorecard output może mieć inną wizualną formę niż oczekiwana.
  - Review może trwać 1-3 minuty — potencjalny dead time na ekranie.

## Segment 1 — Stan po implementacji

**Format:** `live-demo`

**Cel:** Ustawić punkt startu: implementacja jest skończona, wszystko wygląda gotowe. Pytanie: czy mogę merge'ować?

**Na ekranie:**

- Terminal z repozytorium 10xCards.
- `git log --oneline` pokazujący commity per faza z poprzedniej lekcji.
- `plan.md` z `## Progress` — wszystkie fazy `[x]`.

**Przebieg:**

1. Prowadzący otwiera terminal w katalogu 10xCards.
2. Pokazuje `git log --oneline` — widać commity per faza (3-5 commitów).
3. Otwiera `plan.md`, przewija do `## Progress` — wszystko oznaczone `[x]` z SHA.
4. Komentarz: "Kod działa, testy przechodzą, commity są czyste. Ale to nie jest moment na merge. To jest moment na review."

**Rezultat:** Uczestnik widzi, że implementacja jest ukończona, ale review jeszcze nie nastąpił.

**Most do tekstu:** odpowiada sekcji "Kod działa, ale czy jest ready?"

## Segment 2 — Uruchomienie /10x-impl-review

**Format:** `live-demo`

**Cel:** Pokazać, jak uruchomić review i co agent robi w trakcie analizy.

**Na ekranie:**

- Terminal z promptem agenta.
- Widoczna komenda `/10x-impl-review`.

**Przebieg:**

1. Prowadzący wpisuje `/10x-impl-review` (lub opisuje komendę w tool-agnostic framing: "uruchamiam skill review implementacji").
2. Agent rozpoczyna analizę: widać jak czyta plan, porównuje z diffem, sprawdza reguły projektu.
3. Prowadzący krótko komentuje, co agent robi: "Porównuje implementację z planem, sprawdza zakres, bezpieczeństwo, architekturę, wzorce i kryteria sukcesu."
4. Jeśli analiza trwa dłużej niż 30 sekund, prowadzący może przyspieszyć nagranie w post-produkcji (oznaczyć w scenariuszu).

**Rezultat:** Agent generuje raport review.

**Most do tekstu:** odpowiada otwarciu sekcji "Scorecard zamiast przeczucia."

## Segment 3 — Odczytanie scorecarda

**Format:** `live-demo`

**Cel:** Przejść przez 6-wymiarowy scorecard i pokazać, co każdy wymiar mierzy. Nie deep dive — overview.

**Na ekranie:**

- Raport review z tabelą scorecarda (6 wymiarów z verdictami PASS / WARNING / FAIL).
- Overall verdict (APPROVED / NEEDS ATTENTION / REJECTED).

**Przebieg:**

1. Prowadzący scrolluje do scorecarda w raporcie.
2. Czyta każdy wymiar i jego verdict, krótko komentując:
   - Plan Adherence: "Czy implementacja realizuje plan."
   - Scope Discipline: "Czy agent nie dodał czegoś spoza zakresu."
   - Safety & Quality: "Czy nie otwiera ryzyk bezpieczeństwa albo stabilności."
   - Architecture: "Czy pasuje do architektury projektu."
   - Pattern Consistency: "Czy używa lokalnych wzorców."
   - Success Criteria: "Czy kryteria sukcesu z planu są spełnione."
3. Prowadzący wskazuje overall verdict.
4. Komentarz: "To jest rama, nie lista rozkazów. Wymiary pomagają ci patrzeć na właściwe rzeczy zamiast zaczynać od formatowania."

**Rezultat:** Uczestnik rozumie, co scorecard mierzy i jak odczytywać verdicts.

**Most do tekstu:** odpowiada tabeli 6 wymiarów w sekcji "Scorecard zamiast przeczucia."

## Segment 4 — Przegląd findings

**Format:** `live-demo`

**Cel:** Pokazać listę findings posortowaną wg severity i wyjaśnić, dlaczego severity ≠ impact.

**Na ekranie:**

- Lista findings z raportu — każdy z severity, impact, dimension, location i opisem.

**Przebieg:**

1. Prowadzący scrolluje do sekcji findings.
2. Wskazuje, że findings są posortowane wg severity (CRITICAL → WARNING → OBSERVATION).
3. Wybiera jeden finding i czyta jego pola: severity, impact, wymiar, lokalizacja.
4. Pokazuje kontrast: "Ten finding ma severity WARNING, ale impact LOW — to znaczy, że problem istnieje, ale poprawka jest lokalna i prosta. A ten ma severity OBSERVATION, ale impact HIGH — wygląda na drobiazg, ale dotyka kontraktu używanego w trzech miejscach."
5. Komentarz: "Dlatego nie naprawiasz od góry do dołu. Severity mówi, jak zły jest problem. Impact mówi, ile wysiłku kosztuje decyzja."

**Rezultat:** Uczestnik rozumie dwie osie oceny findings i wie, że lista findings nie jest automatyczną kolejką fixów.

**Most do tekstu:** odpowiada sekcji "Findings to nie lista rozkazów" i macierzy severity × impact.

## Segment 5 — Zapis raportu i podsumowanie

**Format:** `live-demo`

**Cel:** Pokazać, gdzie raport review trafia i co prowadzący ma po video 1 przed przejściem do triage.

**Na ekranie:**

- Zapisany plik `context/changes/srs-review-session/reviews/impl-review.md`.
- Krótki widok na strukturę folderów.

**Przebieg:**

1. Prowadzący pokazuje zapisany raport review w `context/changes/srs-review-session/reviews/`.
2. Komentarz: "Raport jest na dysku. Mogę do niego wrócić, mogę go wznowić, mogę go porównać z kolejnymi review."
3. Podsumowanie: "Wiem, co scorecard pokazuje. Wiem, jakie findings mam na liście. Teraz muszę zdecydować, co z nimi zrobić. To jest triage — i to jest osobny krok."

**Rezultat:** Uczestnik widzi, że review i triage to dwa odrębne etapy. Raport jest artefaktem, nie końcową decyzją.

**Most do tekstu:** odpowiada przejściu między sekcjami "Findings to nie lista rozkazów" a "Interactive triage."

## Pre-production TODO

### For `live-demo` segments:

- [ ] 10xCards repo z implementacją S-04 gotowe (zależność od demo materiałów z poprzedniej lekcji)
- [ ] `plan.md` z `## Progress` complete — wszystkie fazy `[x]` z SHA
- [ ] `context/foundation/lessons.md` z istniejącymi regułami z m1-l4
- [ ] `/10x-impl-review` skill zainstalowany i przetestowany w dry run
- [ ] Reference review report przygotowany jako fallback (5-6 findings, mix severity/impact)
- [ ] Fallback obejmuje: minimum 1 CRITICAL, 2 WARNING, 2 OBSERVATION o zróżnicowanym impact
- [ ] Terminal font size i window layout skonfigurowane do czytelności (raport ma tabelę i listy)
- [ ] Git clean state — łatwy reset point
- [ ] Post-produkcja: oznaczyć miejsca na przyspieszenie, jeśli analiza agenta trwa >30s

### General:

- [ ] Dry run nagrania: sprawdzić, czy raport mieści się na ekranie bez nadmiernego scrollowania
- [ ] Przygotować krótki komentarz tool-agnostic do segmentu 2 ("w twoim narzędziu to może wyglądać inaczej, ale zasady są te same")

## Video/text mismatches

(none)

## Claims introduced only in video

(none)

## Needs human decision

- 10xCards S-04 implementation fixture — wymaga stworzenia lub potwierdzenia, że materiały z poprzedniej lekcji są gotowe przed nagraniem tego wideo.
- Fallback review report — kto przygotowuje reference output? Prowadzący sam robi dry run i zapisuje najlepszy raport, czy edytor przygotowuje fixture?
