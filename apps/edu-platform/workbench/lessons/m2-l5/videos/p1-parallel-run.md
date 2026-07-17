# Video Scenario: m2-l5 — Parallel Run (p1)

## Cel wideo

Pokazać operacyjną stronę parallel workflow: od wyboru dwóch niezależnych slice'ów, przez utworzenie worktrees, po uruchomienie goal-directed agentów. Uczestnik widzi sekwencję poleceń, izolację katalogów, różnicę między interactive implementation (m2-l4) a goal-directed execution, i rozumie, że równoległość zaczyna się od niezależności zakresów, nie od liczby terminali.

Narzędzie główne: Claude Code `/goal`.

## Założenia

- Projekt 10xCards po ukończeniu S-01 → S-04 (m2-l1 → m2-l3).
- `context/changes/account-deletion/plan.md` i `context/changes/ux-improvements/plan.md` istnieją i są zatwierdzone.
- Oba plany przeszły etap m2-l2 (frame/research/plan) i są gotowe do execution.
- Prowadzący używa Claude Code jako narzędzia głównego.
- Claude Code auto mode jest włączony (uzupełnia `/goal` — auto mode zdejmuje prompty o tool calls, `/goal` zdejmuje prompty o kolejne tury).
- Wideo NIE wchodzi w CI review, archive ani status — to tematy p2 i p3.
- Wideo NIE pokazuje tworzenia planów ani roadmapy — kursant zna to z m2-l1/m2-l2.
- Wideo NIE pokazuje failure mode ani recovery — clean polished run.

## Materiały i setup nagrania

- Repo/projekt: 10xCards — po S-01 → S-04 shipped, z gotowymi planami account-deletion i ux-improvements.
- Narzędzie główne: Claude Code (terminal) z `/goal`.
- Pliki startowe:
  - `context/changes/account-deletion/plan.md` — zatwierdzony plan.
  - `context/changes/ux-improvements/plan.md` — zatwierdzony plan.
  - Roadmapa i `context/changes/` z widocznymi folderami zmian i ich statusami w `change.md`.
- Pliki tworzone/edytowane:
  - Worktree katalogi: `../10xcards-account-deletion/`, `../10xcards-ux-improvements/`.
  - Implementacja kodu w obu worktrees (generowana przez agenta).
- Stan fallback: oba feature branche z gotową implementacją (commity per faza), do przełączenia jeśli `/goal` nie zakończy się w rozsądnym czasie.
- Ryzyka live demo:
  - `/goal` execution może trwać kilka minut per worktree — potencjalny dead time.
  - Agent może wygenerować kod o innej jakości niż planowana.
  - Worktree setup może napotkać problemy z istniejącymi branchami lub dirty state.
  - `/goal` evaluator (Haiku) może uznać warunek za spełniony zbyt wcześnie.

## Segment 1 — Punkt startu: roadmap i niezależność

**Format:** `live-demo`

**Cel:** Ustawić kontekst: S-01 → S-04 shipped, roadmap ma więcej slice'ów, S-05 i S-06 nadają się do równoległej pracy.

**Na ekranie:**

- Terminal w głównym katalogu 10xCards.
- Roadmapa lub `context/changes/` z widocznymi statusami zmian.

**Przebieg:**

1. Prowadzący otwiera terminal w katalogu 10xCards.
2. Przegląda roadmapę i foldery w `context/changes/` — widać S-01 → S-04 jako completed/archived, S-05 jako planned.
3. Komentarz: "Cztery slice'y gotowe. Roadmap ma jeszcze kilka do zrobienia."
4. Opcjonalnie: prowadzący wspomina, że podczas pracy nad wcześniejszymi slice'ami zauważył drobne problemy z UI — brakujące bulk actions, brak resetu sesji. Zamiast dopisywać je do istniejącego slice'a, prosi agenta o dodanie nowego wpisu do roadmapy:
   ```text
   During work on S-01 through S-04 I noticed missing bulk actions on candidate review, no way to reset a review session, and poor loading states. Add a new slice S-06 "UX improvements" to the roadmap — status planned, prerequisites F-01, parallel with S-05. Keep it concise and consistent with existing slice format.
   ```
   Agent dopisuje S-06 do `roadmap.md`, commit. Roadmapa rośnie organicznie — nie jest zamrożona od momentu PRD.
5. Komentarz: "S-05 i S-06 nie zależą od siebie — mogą biec równolegle."
6. Opcjonalnie: krótkie pytanie do agenta "czy S-05 i S-06 mogą być implementowane równolegle?" — agent odpowiada z oceną shared files/contracts.

**Rezultat:** Uczestnik widzi punkt startu, organiczny wzrost roadmapy i uzasadnienie wyboru dwóch niezależnych slice'ów.

**Most do tekstu:** odpowiada sekcji "Zacznij od niezależnych slice'ów" i diagramowi roadmapy.

## Segment 2 — Tworzenie worktrees

**Format:** `live-demo`

**Cel:** Pokazać `git worktree add` jako operacyjny krok izolacji. Nie git tutorial — jedno polecenie, widoczny efekt.

**Na ekranie:**

- Terminal z poleceniami git.
- Wynik `ls` pokazujący strukturę katalogów.

**Przebieg:**

1. Prowadzący uruchamia:
   ```bash
   git worktree add ../10xcards-account-deletion -b feature/account-deletion
   ```
2. Potem analogicznie:
   ```bash
   git worktree add ../10xcards-ux-improvements -b feature/ux-improvements
   ```
3. Sprawdza efekt: `git worktree list` — widać trzy worktrees.
4. Krótki `ls ..` pokazujący trzy katalogi obok siebie.
5. Komentarz: "Trzy foldery, współdzielona historia, osobne branche, osobny stan plików. Każdy worktree to osobny pas ruchu."

**Rezultat:** Dwa worktrees istnieją, gotowe do osobnych sesji agenta.

**Most do tekstu:** odpowiada sekcji "Worktree to osobny pas ruchu" i diagramowi izolacji.

## Segment 3 — Goal-directed agent: pierwszy worktree

**Format:** `live-demo`

**Cel:** Pokazać `/goal` w akcji na pierwszym worktree. Uczestnik widzi, jak jedno polecenie deleguje pełną implementację planu z warunkiem zakończenia — bez manualnych pauz, z osobnym ewaluatorem sprawdzającym postęp po każdej turze.

**Na ekranie:**

- Terminal w katalogu worktree account-deletion.
- Claude Code z aktywnym `/goal`.

**Przebieg:**

1. Prowadzący wchodzi do worktree:
   ```bash
   cd ../10xcards-account-deletion
   ```
2. Otwiera Claude Code i ustawia goal:
   ```text
   /goal Use 10x-implement skill to implement all phases of context/changes/account-deletion/plan.md. Each phase is committed separately. All phases marked done in plan progress. Stop after 20 turns if not complete.
   ```
3. Agent zaczyna pracę natychmiast — `/goal` traktuje warunek jako dyrektywę i startuje pierwszą turę.
4. Widoczny indicator `◎ /goal active` w sesji.
5. Komentarz w trakcie: "Jedno polecenie i warunek zakończenia. Agent pracuje tura po turze. Po każdej turze osobny mały model sprawdza, czy warunek jest spełniony. Jeśli nie — następna tura. Jeśli tak — goal się zamyka."
6. Opcjonalnie: `/goal` bez argumentów w trakcie pracy — widać ile tur, ile tokenów, jaki jest ostatni powód kontynuacji.
7. Jeśli execution trwa dłużej niż 60 sekund, timelapse w post-produkcji.

**Rezultat:** Agent implementuje account-deletion goal-directed. Widoczne commity per faza w git log. Goal osiągnięty.

**Most do tekstu:** odpowiada sekcji "Dwa tryby: rozmowa albo delegowanie" i porównaniu z interactive `/10x-implement`.

## Segment 4 — Drugi worktree: ten sam wzorzec

**Format:** `live-demo`

**Cel:** Pokazać, że w drugim worktree stosujemy ten sam wzorzec — `/goal` w osobnej sesji Claude Code. Uczestnik widzi równoległość: dwa terminale, dwa agenty, dwa osobne konteksty.

**Na ekranie:**

- Drugi terminal obok pierwszego.
- Claude Code z `/goal` w worktree ux-improvements.

**Przebieg:**

1. Prowadzący otwiera drugi terminal.
2. Wchodzi do worktree ux-improvements:
   ```bash
   cd ../10xcards-ux-improvements
   ```
3. Otwiera Claude Code i ustawia goal:
   ```text
   /goal Use 10x-implement skill to implement all phases of context/changes/ux-improvements/plan.md. Each phase is committed separately. All phases marked done in plan progress. Stop after 20 turns if not complete.
   ```
4. Komentarz: "Ten sam wzorzec: osobny worktree, osobna sesja agenta, osobny `/goal`. Dwa agenty pracują równolegle, każdy w swoim katalogu, na swoim branchu."
5. Komentarz: "W drugim worktree możesz też pracować interaktywnie — z `/10x-implement` i ręcznym sterowaniem, jak w poprzednich lekcjach. `/goal` nie jest jedyną opcją. Ale kiedy plan jest konkretny i warunki zakończenia mierzalne, delegowanie bez rozmowy ma sens."
6. Timelapse lub cut do stanu po implementacji: `git log --oneline` w worktree ux-improvements pokazujący commity per faza.

**Rezultat:** Uczestnik widzi dwa równoległe agenty pracujące w izolowanych worktrees. Rozumie, że wzorzec jest ten sam niezależnie od trybu (interactive vs goal-directed).

**Most do tekstu:** odpowiada regule "jeden worktree = jeden slice = jeden agent = jeden PR" i konceptowi izolacji kontekstu.

## Segment 5 — Stan po implementacji: dwa branche, dwie zmiany

**Format:** `live-demo`

**Cel:** Zamknąć wideo podsumowaniem stanu: dwa niezależne branche z implementacjami, gotowe do PR i review.

**Na ekranie:**

- Terminal w głównym katalogu.
- `git worktree list` + krótki przegląd commitów.

**Przebieg:**

1. Prowadzący wraca do głównego katalogu:
   ```bash
   cd <main-repo-path>
   ```
2. `git worktree list` — trzy worktrees, każdy na swoim branchu.
3. Krótki `git log --oneline feature/account-deletion` i `git log --oneline feature/ux-improvements` — widać commity per faza w obu branchach.
4. Komentarz: "Dwa slice'y zaimplementowane równolegle. Każdy na swoim branchu, z commitami per faza. Agent dostarczył implementację. Ale to nie jest moment na merge — to jest moment na review."

**Rezultat:** Uczestnik ma jasny obraz: dwa gotowe branche, zero konfliktów między nimi, gotowe do PR.

**Most do tekstu:** stanowi bridge do sekcji "PR jest punktem spotkania" i do wideo p2.

## Pre-production TODO

### For `live-demo` segments:

- [ ] Plany account-deletion i ux-improvements istnieją w `context/changes/` i są zatwierdzone.
- [ ] `context/changes/` i `context/archive/` poprawnie odzwierciedlają S-01 → S-04 jako archived i account-deletion/ux-improvements jako planned.
- [ ] Nie ma istniejących branchy `feature/account-deletion` ani `feature/ux-improvements` (czysty start).
- [ ] Nie ma istniejących worktree katalogów `../10xcards-account-deletion` i `../10xcards-ux-improvements`.
- [ ] Claude Code `/goal` przetestowany na dry-run — warunek ewaluatora poprawnie rozpoznaje ukończone fazy.
- [ ] Auto mode włączony w Claude Code (uzupełnia `/goal`).
- [ ] Fallback: oba feature branche z gotowymi commitami per faza, do `git checkout` jeśli `/goal` się zawiesi.
- [ ] Terminal font czytelny (min 14pt), dwa okna terminala obok siebie od segmentu 4.
- [ ] Git w czystym stanie: `git status` = clean.
- [ ] Zmienne środowiskowe ustawione (API keys, Anthropic token).
- [ ] `/goal` turn limit (20 turns) przetestowany — agent powinien ukończyć plan w mniej niż 20 turach dla tych slice'ów.

### General:

- [ ] Czas trwania docelowy: 8-12 minut.
- [ ] Timelapse przygotowany do przyspieszenia `/goal` execution w post-produkcji.
- [ ] Kolejność nagrania: segmenty 1-5 w jednej ciągłej sesji (stan przenosi się między segmentami).
- [ ] Stan po nagraniu: nie usuwać worktrees ani branchy — p2 startuje od tego stanu.

## Video/text mismatches

(none)

## Claims introduced only in video

- `/goal` jako wbudowane polecenie Claude Code z osobnym ewaluatorem (Haiku) sprawdzającym warunek po każdej turze.

## Needs human decision

- Czy plany account-deletion i ux-improvements są wystarczająco gotowe do goal-directed demo (wymagają testowego dry-run z `/goal` przed nagraniem).
- Czas trwania `/goal` execution na kamerze: ile sekund pokazywać live vs timelapse.
- Turn limit w warunku `/goal`: 20 turns wystarczające? Za dużo/za mało?
