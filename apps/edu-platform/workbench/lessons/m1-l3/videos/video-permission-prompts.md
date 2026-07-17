# Video Scenario: m1-l3 — Permission prompts: trzy decyzje w trakcie biegu

## Cel wideo

Pokazać kursantowi, jak wyglądają permission prompty harnessu w trakcie realnej egzekucji agenta — co dokładnie pojawia się na ekranie, jakie ma trzy opcje do wyboru i jak każda z nich zmienia jego `.claude/settings.json`. To jedyne wideo w lekcji, które jest niezastępowalne tekstem: permission prompty są efemerycznym UI, który znika po kliknięciu. Tekst może je opisać, ale nie może ich *pokazać*. Wideo zaczyna od pustego `settings.json`, przeprowadza bootstrappera na 10xCards, reaguje na każdy prompt filtrem "co ten wzorzec może popsuć poza moim repo", a kończy edycją polityki uprawnień z deny rules — naturalnie wchodząc w territory placeholdera #5 ze schematu (edycja settings.json po biegu).

## Założenia

- Projekt 10xCards ma `context/foundation/prd.md` i `context/foundation/tech-stack.md` na dysku (artefakty z m1-l1 i m1-l2).
- `.claude/settings.json` jest **pusty** lub nie istnieje — reset przed nagraniem jest krytyczny.
- Claude Code jest zainstalowany i działa; wersja z aktualnymi permission prompts (trzyopcyjny dialog).
- Bootstrapper jest zainstalowany i przetestowany w dry run.
- Kursant widział już w tekście lekcji sekcje "Uruchomienie bootstrappera" i "Dlaczego agent nie pisze projektu sam" — wideo nie powtarza tych wyjaśnień; skupia się na in-execution gate.
- Wideo **nie** konfiguruje AGENTS.md, hooków, inner loop ani MCP — to m1-l4 i m1-l5.
- Bootstrapper v1 **nie** wykonuje `git init` — wideo nie symuluje tego promptu.

## Materiały i setup nagrania

- Repo/projekt: 10xCards — katalog z `context/foundation/prd.md` i `context/foundation/tech-stack.md`, bez istniejącego scaffoldu.
- Narzędzie główne: Claude Code w terminalu (VS Code lub standalone terminal).
- Pliki startowe: `prd.md`, `tech-stack.md`, pusty (lub brak) `.claude/settings.json`.
- Pliki tworzone/edytowane: scaffoldowane repo, `context/changes/bootstrap-verification/verification.md`, `.claude/settings.json` (po biegu).
- Stan fallback: jeśli bootstrapper zachowa się inaczej niż oczekiwano (np. pominie prompt, doda nieoczekiwany), prowadzący komentuje różnice i kontynuuje — nie restartuje nagrania. Przygotować screenshot oczekiwanych promptów jako backup do wstawienia w post-produkcji.
- Ryzyka live demo: (1) permission prompty mogą mieć inną treść niż oczekiwana, jeśli wersja Claude Code się zmieniła — dry run tuż przed nagraniem; (2) `npm create astro@latest` wymaga dostępu do sieci — zweryfikować połączenie; (3) czas scaffoldu może być długi — przygotować cut point w montażu.

## Segment 1 — Stan wyjściowy: pusty settings.json

**Format:** `live-demo`

**Cel:** Pokazać kursantowi, że zaczynamy z czystym kontem — żadnych reguł allow/deny. Każdy prompt harnessu będzie świeży.

**Na ekranie:**

- Terminal z otwartym katalogiem 10xCards.
- `ls context/foundation/` — widoczne `prd.md` i `tech-stack.md`.
- `cat .claude/settings.json` (lub `ls .claude/`) — pusty plik lub brak pliku.

**Przebieg:**

1. Prowadzący pokazuje zawartość katalogu: "Mamy dwa pliki z poprzednich lekcji — PRD i tech-stack. Projektu jeszcze nie ma."
2. Otwiera (lub próbuje otworzyć) `.claude/settings.json` — jest pusty albo nie istnieje.
3. Komentarz: "Zaczynamy z czystym settings.json. Harness będzie pytał o wszystko — i to jest dokładnie to, czego chcemy, żeby zobaczyć, jak wygląda każdy prompt."

**Rezultat:** Kursant widzi punkt startowy: brak reguł, brak scaffoldu, dwa pliki kontraktowe na dysku.

**Most do tekstu:** Odpowiada sekcji "Co już masz na dysku" w Core.

## Segment 2 — Trigger bootstrappera i pierwszy permission prompt

**Format:** `live-demo`

**Cel:** Pokazać, jak wygląda pierwsze pytanie harnessu w trakcie biegu bootstrappera — i jak prowadzący podejmuje decyzję.

**Na ekranie:**

- Terminal z Claude Code.
- Wpisany `/10x-bootstrapper`.
- Bootstrapper czyta `tech-stack.md`, przechodzi hand-off precondition.
- Pojawia się pierwszy permission prompt: `npm create astro@latest` (lub analogiczna komenda ze startera).

**Przebieg:**

1. Prowadzący wpisuje `/10x-bootstrapper`.
2. Bootstrapper zaczyna — sprawdza `tech-stack.md` na dysku, przechodzi precondition. Prowadzący krótko komentuje: "Pierwsza bramka — pre-execution — przeszła. Agent ma mandat."
3. Na ekranie pojawia się prompt:
   ```
   Claude wants to run a command:
     npm create astro@latest -- --template minimal

   [1] Yes
   [2] Yes, don't ask again for npm commands in this directory
   [3] No, and tell Claude what to do differently
   ```
4. Prowadzący zatrzymuje się i komentuje: "To jest oficjalny kreator Astro. Pytanie: co ten wzorzec może popsuć poza moim repo? Odpowiedź: nic poza połączeniem z rejestrem npm, czego i tak potrzebuję. Wybieram opcję 2 — 'Yes, don't ask again'."
5. Wybiera opcję 2.
6. Komentarz: "Harness właśnie dopisał regułę do `.claude/settings.json`. Od teraz `npm` komendy w tym katalogu nie będą pytać."

**Rezultat:** Scaffold zaczyna się wykonywać. Kursant widział pierwszy prompt, trzy opcje, rozumowanie filtrem i świadomy wybór "don't ask again".

**Most do tekstu:** Odpowiada sekcji "Uprawnienia w trakcie biegu" — pierwszy z trzech promptów opisanych w drafcie.

## Segment 3 — Kolejne prompty: Write/Edit i brak git init

**Format:** `live-demo`

**Cel:** Pokazać, że wbudowane narzędzia harnessu (Write, Edit) podlegają innym regułom niż Bash, i że bootstrapper v1 nie robi `git init`.

**Na ekranie:**

- Terminal — bootstrapper kontynuuje pracę.
- Pojawiają się kolejne prompty (Write/Edit na plikach projektu) lub brak promptów (jeśli narzędzia built-in są domyślnie allowed).

**Przebieg:**

1. Bootstrapper tworzy pliki projektu. Jeśli pojawia się prompt na `Write` lub `Edit`:
   - Prowadzący komentuje: "Write i Edit to wbudowane narzędzia harnessu — działają w katalogu roboczym projektu. Filtr: co może popsuć poza repo? Nic. Dodaję do allow."
   - Wybiera "Yes, don't ask again".
2. Jeśli Write/Edit nie generują promptów (bo są domyślnie dozwolone w trybie default):
   - Prowadzący komentuje: "Zauważ, że harness nie pytał o Write ani Edit — te narzędzia są w trybie default dozwolone dla plików w katalogu roboczym. Bash komendy — nie."
3. Prowadzący obserwuje, że bootstrapper kończy scaffold bez pytania o `git init`: "Bootstrapper v1 nie inicjalizuje gita — to twoja decyzja, kiedy zacząć wersjonować. Zobaczysz to za chwilę w `verification.md`."

**Rezultat:** Kursant rozumie różnicę między Bash commands (pytają) a built-in tools (mogą nie pytać w trybie default). Wie, że `git init` nie jest częścią bootstrappera.

**Most do tekstu:** Odpowiada informacji w drafcie o różnicach między wbudowanymi narzędziami a Bash, oraz o braku `git init` w bootstrapperze v1.

## Segment 4 — Scaffold zakończony: co harness dopisał do settings.json

**Format:** `live-demo`

**Cel:** Otworzyć `.claude/settings.json` i pokazać, co harness automatycznie dopisał w trakcie biegu na podstawie "Yes, don't ask again".

**Na ekranie:**

- Edytor z otwartym `.claude/settings.json`.
- Widoczne reguły `allow` dopisane przez harness.

**Przebieg:**

1. Prowadzący otwiera `.claude/settings.json` w edytorze.
2. Pokazuje reguły, które harness dopisał automatycznie — np. `"Bash(npm *)"` lub podobne.
3. Komentarz: "To są reguły, które powstały z moich kliknięć 'Yes, don't ask again'. Każda odpowiada jednemu promptowi. Ale brakuje tu czegoś — reguł *deny*."
4. Prowadzący zwraca uwagę: "Harness dopisuje tylko to, co zatwierdziłeś. Nie dodaje za ciebie reguł ochronnych. Te musisz dodać sam."

**Rezultat:** Kursant widzi, jak "Yes, don't ask again" materialnie zmienia plik konfiguracyjny. Rozumie, że deny rules nie powstają automatycznie.

**Most do tekstu:** Odpowiada przejściu między sekcjami "Uprawnienia w trakcie biegu" i "Polityka uprawnień i YOLO mode" w Core.

## Segment 5 — Ręczna edycja: dodanie deny rules i dopełnienie polityki

**Format:** `live-demo`

**Cel:** Pokazać, jak prowadzący ręcznie edytuje `settings.json` — dodaje deny rules i uzupełnia allowlist o brakujące wzorce. Każdy wpis komentowany filtrem.

**Na ekranie:**

- Edytor z `.claude/settings.json` — plik z auto-dodanymi regułami z poprzedniego segmentu.
- Prowadzący edytuje plik w czasie rzeczywistym.

**Przebieg:**

1. Prowadzący dodaje do `allow` brakujące wzorce (jeśli nie zostały dodane przez prompty):
   - `"Bash(git *)"` — "Git operacje w katalogu projektu. Nie wychodzi poza repo."
   - `"Read"`, `"Edit"`, `"Write"` — "Wbudowane narzędzia plikowe. Działają w obrębie katalogu roboczego projektu."
2. Prowadzący dodaje sekcję `deny`:
   - `"Bash(rm -rf *)"` — "Ten wzorzec może zniszczyć cały katalog domowy, jeśli ktoś źle podstawi argument. Zatrzymujemy go zawsze."
   - `"Bash(git push *)"` — "Push jest decyzją publikacyjną. Nie chcę jej delegować bez świadomego potwierdzenia."
3. Pokazuje wynikowy plik:
   ```json
   {
     "permissions": {
       "allow": ["Bash(npm *)", "Bash(git *)", "Read", "Edit", "Write"],
       "deny": ["Bash(rm -rf *)", "Bash(git push *)"]
     }
   }
   ```
4. Komentarz: "Pięć minut. Każdy wpis przeszedł przez jeden filtr: co ten wzorzec może popsuć poza moim repo. Jeśli odpowiedź brzmi 'nic' — allow. Jeśli 'potencjalnie wszystko' — deny. Jeśli 'nie wiem' — zostaw, harness zapyta."
5. Krótkie zamknięcie: "To nie jest finalna polityka na całe życie. To punkt startu, który jutro pozwoli temu samemu łańcuchowi przejść bez nadmiaru promptów."

**Rezultat:** Na ekranie widoczny kompletny, minimalny `settings.json` z allow i deny. Kursant rozumie logikę każdego wpisu i wie, że to punkt startu, nie dogmat.

**Most do tekstu:** Odpowiada sekcji "Uprawnienia w trakcie biegu" (przykład polityki w settings.json) oraz placeholderowi #5 ze schematu (edycja settings.json po biegu).

## Segment 6 — Zamknięcie: co mamy, czego brakuje

**Format:** `live-demo`

**Cel:** Podsumować stan po wideo: scaffoldowane repo, polityka uprawnień, i czego jeszcze brakuje (bridge do verification.md i m1-l4).

**Na ekranie:**

- Terminal — `ls` scaffoldowanego projektu.
- `.claude/settings.json` z gotową polityką (z poprzedniego segmentu).

**Przebieg:**

1. Prowadzący pokazuje strukturę scaffoldowanego projektu: "Projekt jest na dysku. Bootstrapper użył autorytatywnego CLI zamiast generować z głowy."
2. Pokazuje `.claude/settings.json`: "Polityka uprawnień jest na miejscu. Harness wie, co może bez pytania, a co ma ci zgłaszać."
3. Zamknięcie: "Ale repo jest na razie *głuche* — agent nie zna twoich konwencji, formatów, komend testowych. Tego nie skonfigurujemy dzisiaj — to temat m1-l4. Dziś mamy fundament: scaffoldowane repo i politykę, na której m1-l4 zbuduje onboarding agenta."
4. Krótka wzmianka: "Za chwilę w tekście lekcji zobaczysz verification.md — raport, który bootstrapper zostawił obok scaffoldu. To trzecia bramka — post-execution."

**Rezultat:** Kursant rozumie, że wideo pokryło in-execution gate (prompty + polityka), a verification.md (post-execution) i agent onboarding (m1-l4) to następne kroki.

**Most do tekstu:** Odpowiada bridge out do m1-l4 ("projekt na dysku, agent jeszcze głuchy") i otwiera czytanie verification.md w następnym wideo.

## Pre-production TODO

### For `live-demo` segments:

- [ ] Sklonować/przygotować katalog 10xCards z `context/foundation/prd.md` i `context/foundation/tech-stack.md` — potwierdzić, że `tech-stack.md` ma poprawny `starter_id` rozpoznawany przez bootstrappera.
- [ ] **KRYTYCZNE:** Usunąć lub wyzerować `.claude/settings.json` tuż przed nagraniem (`echo '{}' > .claude/settings.json` lub `rm .claude/settings.json`). Jakiekolwiek pozostałości z poprzednich sesji zepsują demonstrację.
- [ ] Uruchomić `/10x-bootstrapper` w dry run i zanotować dokładną treść permission promptów — porównać z oczekiwaniami w segmentach 2-3.
- [ ] Przygotować screenshoty oczekiwanych permission promptów jako fallback do post-produkcji (gdyby live run dał inne prompty).
- [ ] Zweryfikować dostęp do sieci (npm registry) — `npm create astro@latest` wymaga pobrania pakietu.
- [ ] Ustawić czcionkę terminala na czytelną wielkość (min. 16px) i usunąć zbędne panele z edytora.
- [ ] Przygotować punkt resetu git (lub snapshot katalogu) na wypadek konieczności ponownego nagrania.
- [ ] Zmierzyć czas scaffoldu w dry run — jeśli >60s, zaplanować cut point w montażu.
- [ ] Zanotować dokładną wartość `starter_id` z `tech-stack.md`, żeby wiedzieć, jaką komendę bootstrapper wywoła (np. `npm create astro@latest -- --template minimal`).

### General:

- [ ] Cały bieg bootstrappera nagrany jednym ciągiem (segmenty 2-4 to naturalny flow, nie oddzielne nagrania).
- [ ] Segment 5 (edycja settings.json) może być nagrany osobno — edytor, nie terminal.
- [ ] Przygotować `verification.md` z tego biegu do użycia w video-verification-report.md.
- [ ] Zaplanować kolejność nagrywania: to wideo MUSI być nagrane PRZED video-verification-report (bo reużywamy output).

## Video/text mismatches

- Draft w sekcji "Uprawnienia w trakcie biegu" wymienia trzy prompty, w tym "prompt na `git init` od bootstrappera" — ale bootstrapper v1 **nie** robi `git init`. Wideo nie symuluje tego promptu. Draft traktuje to jako placeholder — do wycięcia z draftu lub oznaczenia jako warunkowy.
- Draft pokazuje `"defaultMode": "default"` w przykładowym settings.json — wideo go nie ustawia, bo to wartość domyślna. Różnica kosmetyczna, nie merytoryczna.

## Claims introduced only in video

- (none) — wideo operacjonalizuje to, co draft opisuje; nie wprowadza nowych claimów.

## Needs human decision

- Dokładna treść permission promptów zależy od wersji Claude Code w dniu nagrania — dry run tuż przed nagraniem jest obowiązkowy.
- Czy bootstrapper w aktualnej wersji wyświetli prompt na `Write`/`Edit`, czy te narzędzia będą auto-allowed w trybie default — do weryfikacji w dry run. Segment 3 ma fallback na oba warianty.
- Czy wideo powinno pokazywać `Bash(npm:*)` (colon shorthand) czy `Bash(npm *)` (space form) — draft i docs Anthropica używają space form; wideo powinno być konsystentne z draftem.
