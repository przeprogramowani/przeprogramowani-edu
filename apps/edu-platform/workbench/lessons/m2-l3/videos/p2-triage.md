# Video Scenario: m2-l3 — Solo Code Review (p2: triage)

## Cel wideo

Pokazać interactive triage loop: finding-by-finding decyzję na żywo. Prowadzący przechodzi przez findings z raportu review (p1) i modeluje cztery różne typy decyzji: fix, accept-as-rule (→ `/10x-lesson`), skip, disagree. Uczestnik widzi, że triage to skill — nie formularz do wypełnienia — i że odpuszczenie trivialnego finding jest tak samo valid jak naprawienie krytycznego.

## Założenia

- Raport review z p1 jest zapisany na dysku (`context/changes/srs-review-session/reviews/impl-review.md`).
- Prowadzący wznawia triage z tego raportu (skill wspiera save/resume).
- 10xCards S-04 (srs-review-session) implementation jest taka sama jak w p1 — ten sam stan repo.
- Findings z raportu zawierają minimum 4 pozycje o zróżnicowanej severity i impact.
- Prowadzący używa Claude Code jako narzędzia przykładowego, z komentarzem tool-agnostic.
- Wideo NIE wraca do wyjaśniania scorecarda (to było w p1).
- Wideo NIE wchodzi w CI/CD review, team review ani testowanie (M3, M5).

## Materiały i setup nagrania

- Repo/projekt: 10xCards — ten sam stan co w p1 (po implementacji S-04 srs-review-session, raport review na dysku).
- Narzędzie główne: Claude Code (terminal), z komentarzem tool-agnostic.
- Pliki startowe:
  - `context/changes/srs-review-session/reviews/impl-review.md` — raport z p1.
  - `context/changes/srs-review-session/plan.md` — plan z m2-l2.
  - `context/foundation/lessons.md` — istniejące reguły projektu.
- Pliki tworzone/edytowane:
  - Zmodyfikowany kod źródłowy (wynik fixa).
  - `context/foundation/lessons.md` — nowy wpis z `/10x-lesson`.
- Stan fallback:
  - Przygotowane 4 findings z p1 fallback raportu, każdy z zaplanowaną decyzją triage.
  - Przygotowane oczekiwane wyjście `/10x-lesson`.
- Ryzyka live demo:
  - Fix może nie zadziałać za pierwszym razem (agent musi edytować kod).
  - `/10x-lesson` może wygenerować wpis o innym kształcie niż oczekiwany.
  - Triage wszystkich 4 findings może trwać 10-15 minut — trzeba utrzymać tempo.

## Segment 1 — Wznowienie triage

**Format:** `live-demo`

**Cel:** Wrócić do raportu review z p1 i ustawić kontekst: "mam findings, teraz muszę zdecydować, co z każdym zrobić."

**Na ekranie:**

- Terminal z otwartym raportem review lub wznowionym triage.
- Lista findings widoczna na ekranie.

**Przebieg:**

1. Prowadzący otwiera terminal, wznawia triage z zapisanego raportu.
2. Pokazuje listę findings z severity i impact.
3. Komentarz: "Mam raport. Mam findings. Teraz przechodzę finding po findingu. Nie grupowo, nie 'napraw wszystko'. Każdy finding dostaje osobną decyzję."

**Rezultat:** Uczestnik widzi punkt startu triage i rozumie, że to jest sekwencyjna praca finding-by-finding.

**Most do tekstu:** odpowiada otwarciu sekcji "Interactive triage."

## Segment 2 — Fix: finding CRITICAL

**Format:** `live-demo`

**Cel:** Pokazać najprostszy triage outcome: finding jest prawdziwy, istotny, poprawka jest lokalna. Fix.

**Na ekranie:**

- Finding z severity CRITICAL i impact LOW/MEDIUM.
- Kod źródłowy, którego finding dotyczy.
- Wynik poprawki.

**Przebieg:**

1. Prowadzący czyta finding: np. "endpoint zapisujący fiszkę omija istniejący guard autoryzacji" (lub analogiczny CRITICAL finding z raportu).
2. Komentarz: "Severity CRITICAL, impact LOW. Problem jest poważny, ale poprawka jest lokalna — dodaję guard w jednym miejscu."
3. Prowadzący wybiera "fix" w triage.
4. Agent naprawia problem w miejscu — widać edycję pliku.
5. Prowadzący krótko weryfikuje poprawkę: "Guard jest na miejscu, nie zmieniło się nic poza tym handlerem."

**Rezultat:** Uczestnik widzi pełny cykl: finding → ocena → fix → krótka weryfikacja.

**Most do tekstu:** odpowiada grupie "Napraw teraz" w sekcji "Interactive triage."

## Segment 3 — Accept-as-rule: finding WARNING → /10x-lesson

**Format:** `live-demo`

**Cel:** Pokazać, że nie każdy finding jest jednorazowym bugiem. Niektóre sygnalizują brak trwałej reguły w kontekście projektu.

**Na ekranie:**

- Finding z severity WARNING i powtarzalnym wzorcem (np. "nowe server actions nie używają istniejącego auth guard pattern").
- Terminal z `/10x-lesson` i wynikowy wpis w `lessons.md`.

**Przebieg:**

1. Prowadzący czyta finding: np. "nowy handler sprawdza userId ręcznie zamiast używać istniejącego auth guard pattern."
2. Komentarz: "To nie jest jednorazowy bug. To jest sygnał, że agent nie zna lokalnej reguły projektu. Jeśli to naprawię tylko tu, to w następnym slice'u zrobi to samo."
3. Prowadzący wybiera "accept as recurring rule" w triage.
4. Agent uruchamia `/10x-lesson` — widać jak reguła trafia do `context/foundation/lessons.md`.
5. Prowadzący otwiera `lessons.md` i pokazuje nowy wpis.
6. Komentarz: "Kolejne uruchomienia workflow — planowanie, implementacja, review — wczytają tę regułę jako prior. Agent będzie miał mniej okazji do powtórzenia tego samego błędu."

**Rezultat:** Uczestnik widzi, jak review buduje project memory. Finding nie znika — zamienia się w trwałą regułę.

**Most do tekstu:** odpowiada grupie "Buduj project memory" i sekcji "Project memory powstaje w review."

## Segment 4 — Skip: finding OBSERVATION + LOW impact

**Format:** `live-demo`

**Cel:** Pokazać, że skip jest valid triage outcome. Anty-overcorrection: nie wszystko trzeba naprawiać.

**Na ekranie:**

- Finding z severity OBSERVATION i impact LOW.
- Prowadzący decyduje "skip" z krótkim uzasadnieniem.

**Przebieg:**

1. Prowadzący czyta finding: np. "nazwa zmiennej mogłaby być bardziej deskryptywna" lub "brakujący komentarz w helperze."
2. Komentarz: "Severity OBSERVATION, impact LOW. Nazwa jest zrozumiała, nie narusza konwencji, nie zwiększa ryzyka. Mogę to naprawić, ale to nie zmieni jakości merge'a."
3. Prowadzący wybiera "skip" z jednozdaniowym uzasadnieniem.
4. Komentarz: "Skip nie jest ignorowaniem problemu. To świadoma decyzja, że ten finding nie jest wart czasu w tym review. Gdybym naprawiał każde OBSERVATION, spędziłbym dwie godziny na drobiazgach zamiast merge'ować zmianę, która jest gotowa."

**Rezultat:** Uczestnik widzi modelowane zachowanie: prowadzący świadomie odpuszcza trivialny finding.

**Most do tekstu:** odpowiada grupie "Nie naprawiaj teraz" i failure mode "fix all overcorrection."

## Segment 5 — Disagree: odrzucenie finding

**Format:** `live-demo`

**Cel:** Pokazać, że disagree jest pełnoprawną decyzją. Agent może się mylić.

**Na ekranie:**

- Finding, z którym prowadzący się nie zgadza.
- Prowadzący odrzuca finding z uzasadnieniem.

**Przebieg:**

1. Prowadzący czyta finding: np. "sugestia wyodrębnienia wspólnej abstrakcji dla dwóch handlerów" lub "propozycja zmiany architektonicznej, która łamie lokalny wzorzec."
2. Komentarz: "Agent widzi dwa handlery z podobnym kodem i sugeruje abstrakcję. Ale w tym projekcie te dwa handlery celowo są oddzielne — mają różne ścieżki rozwoju w roadmapie. Abstrakcja teraz to premature generalization."
3. Prowadzący wybiera "disagree" z uzasadnieniem.
4. Komentarz: "Disagree nie jest lekceważeniem agenta. To jest moment, w którym twój judgment mówi: ten finding jest błędny. Review z AI nie zwalnia cię z myślenia. Ono lepiej ustawia miejsce, w którym masz pomyśleć."

**Rezultat:** Uczestnik widzi, że human judgment jest ostatnią instancją. Agent dostarcza sygnały, człowiek decyduje.

**Most do tekstu:** odpowiada grupie "Odrzuć finding" w sekcji "Interactive triage."

## Segment 6 — Podsumowanie triage i verdict

**Format:** `live-demo`

**Cel:** Zamknąć triage, pokazać finalny verdict i zbiorcze wyniki: co naprawiono, co zarejestrowano, co odpuszczono.

**Na ekranie:**

- Podsumowanie triage (jeśli skill je generuje) lub ręczne zestawienie przez prowadzącego.
- Artefakty: raport review, `lessons.md`.

**Przebieg:**

1. Prowadzący podsumowuje findings i ich outcomes:
   - Fix: guard autoryzacji dodany.
   - Accept-as-rule: reguła auth guard pattern w `lessons.md`.
   - Skip: nazwa zmiennej — świadomie odpuszczona.
   - Disagree: abstrakcja handlerów — odrzucona z uzasadnieniem.
2. Prowadzący wskazuje verdict: "APPROVED" albo "NEEDS ATTENTION, teraz APPROVED po fixach."
3. Komentarz: "Triage to nie formularz. To judgment. Severity mówi, jak zły jest problem. Impact mówi, ile wysiłku kosztuje decyzja. Twoja praca to odróżnić signal od noise."
4. Zamknięcie: "Ten cykl — plan, implementacja, review, triage — zamyka single-change workflow. W następnej lekcji zaczniemy go skalować."

**Rezultat:** Uczestnik widzi zamknięty cykl review z konkretnymi artefaktami na dysku.

**Most do tekstu:** odpowiada sekcji "Verdict przed merge" i bridge out do m2-l4.

## Pre-production TODO

### For `live-demo` segments:

- [ ] Stan repo identyczny z końcem p1 (raport review na dysku, kod po implementacji S-04)
- [ ] Raport review z p1 zapisany i gotowy do wznowienia triage
- [ ] Fallback: 4 findings z zaplanowanymi decyzjami triage, gotowe do użycia jeśli live findings nie pasują
- [ ] `/10x-lesson` przetestowany w dry run — sprawdzić format wpisu w `lessons.md`
- [ ] Przygotowane uzasadnienia dla skip i disagree (prowadzący musi mieć gotowe argumenty, nie improwizować)
- [ ] Terminal font size i window layout skonfigurowane do czytelności
- [ ] Git clean state — łatwy reset point po fixie w segmencie 2
- [ ] Przygotowany finding do disagree: musi być na tyle wiarygodny, żeby odrzucenie wymagało argumentu, ale na tyle błędny, żeby disagree było uzasadnione

### General:

- [ ] Dry run pełnego triage: sprawdzić timing (cel: 8-12 minut na cały triage, nie dłużej)
- [ ] Przygotować skrót do `lessons.md` w edytorze — szybkie przeskoczenie po `/10x-lesson`
- [ ] Komentarz tool-agnostic: "W twoim narzędziu triage może wyglądać inaczej, ale te same cztery grupy decyzji mają zastosowanie niezależnie od narzędzia."
- [ ] Jeśli live run nie produkuje finding nadającego się do disagree, zamienić disagree na drugie skip z innym uzasadnieniem

## Video/text mismatches

(none)

## Claims introduced only in video

(none)

## Needs human decision

- Disagree finding: prowadzący musi wybrać finding, z którym ma autentyczny kontrargument. Jeśli live run nie dostarczy takiego finding, alternatywa: (a) użyć przygotowanego finding z fallback raportu, (b) zamienić disagree na skip z komentarzem "gdybym widział finding, z którym się nie zgadzam, użyłbym disagree."
- Timing p2: 4 findings w jednym wideo. Segmenty 2 i 4 (fix i skip) powinny być szybkie (1-2 minuty każdy), segment 3 (lesson) dłuższy (2-3 minuty), segment 5 (disagree) krótki (1-2 minuty).
- Kolejność triage w nagraniu nie musi odpowiadać kolejności severity w raporcie. Rekomendacja: fix → accept-as-rule → skip → disagree, bo to buduje narrację od "naprawiamy" przez "budujemy pamięć" do "odpuszczamy i odrzucamy."
