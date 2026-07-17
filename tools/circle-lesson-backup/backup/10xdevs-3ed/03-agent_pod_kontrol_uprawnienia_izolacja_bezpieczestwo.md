---
lessonId: 3662387
sectionId: 966234
name: "AI-Powered Bootstrap: boilerplate i bezpieczna praca z Agentem"
---

# AI-Powered Bootstrap: boilerplate i bezpieczna praca z Agentem

## Wstęp

W lekcji Od chatbota do Agenta (M1L2) na dysku wylądował `tech-stack.md`. Razem z `prd.md` masz dwa artefakty — kontrakt biznesowy i kontrakt techniczny.

Tylko że projekt jeszcze nie istnieje.

To moment, w którym agent przestaje rozmawiać i zaczyna pisać. Wywoła CLI, stworzy katalogi, pobierze zależności.

I tu pojawia się pytanie, które zna każdy, kto pierwszy raz daje agentowi dostęp do dysku: *jak daleko go puścić?*

Za mało zaufania — toniesz w godzinach klikania "Yes" przy każdym kroku. Za dużo — po tygodniu odkrywasz, że agent miał dostęp do rzeczy, do których nie powinien mieć.

Jest trzecia droga.

Pobierz paczkę lekcyjną — jak zwykle masz dwie ścieżki:

```bash
npx @przeprogramowani/10x-cli@latest get m1l3
```

Albo powiedz agentowi: *"pobierz paczkę z lekcji m1l3"* — skill `10x-cli-guide` zajmie się resztą.

## Core

### Co już masz na dysku

Łańcuch `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper` to plikowy potok. Każde ogniwo czyta plik z dysku i zapisuje plik na dysk. Następne ogniwo czyta ten plik bez zgadywania.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-1-10x.png)

Agent nie pamięta poprzedniej rozmowy — pamięta to, co zostało zapisane na dysku. Łańcuch działa, bo kontrakty są plikowe, nie dlatego, że trzymasz kontekst w głowie.

W tej lekcji ten potok zostaje domknięty: `tech-stack.md` wchodzi do `/10x-bootstrapper`, na wyjściu masz scaffoldowany projekt i raport `verification.md`.

Masz istniejący projekt? Nie potrzebujesz bootstrappera. `/10x-health-check` przepuszcza go przez te same trzy bramki egzekucji (pre / in / post), ale zamiast scaffoldować — audytuje: zależności, testy, CI/CD, konfigurację. Do health-checka wracamy po sekcji o `verification.md`.

### Uruchomienie bootstrappera

Wpisujesz w terminalu:

```
/10x-bootstrapper
```

Skill zaczyna od jednej weryfikacji: czy na dysku istnieje `context/foundation/tech-stack.md`?

Jeśli nie istnieje — skill odmawia wykonania i przekierowuje cię do `/10x-tech-stack-selector`. Nie próbuje wyciągnąć stacku z historii rozmowy, nie pyta "to jaki stack?" w ad-hoc dialogu. Nie improwizuje.

To wzorzec, który powtórzy się w każdym kolejnym skillu: **plik na dysku jest kontraktem**. Rozmowa nie jest zamiennikiem.

Brzmi banalnie, dopóki nie zobaczysz, ile sesji pada na tym, że "wczoraj ustaliliśmy, że Astro" — a dziś agent ma czysty kontekst i szczerze nie wie, o czym mówisz.

Hand-off jako prekondycja to pierwsza z trzech bramek, które poznasz w tej lekcji. Bramka **pre-execution**: zanim agent cokolwiek wykona, sprawdza, czy ma do tego mandat.

Tu — czy ma plik wejściowy. W innych skillach — czy commit jest czysty, czy testy przechodzą, czy nie ma niezacommitowanych zmian. Zasada jest ta sama: bez mandatu agent nie rusza.

### Dlaczego agent nie pisze projektu sam

Kiedy `tech-stack.md` jest na dysku, bootstrapper czyta z niego `starter_id`, wyszukuje ten starter w wewnętrznym rejestrze i wykonuje komendę z pola `cmd_template`. Dla projektu w JS/TS będzie to coś z rodziny:

```bash
npm create astro@latest -- --template minimal
```

Albo `npm create vite@latest`. Albo `npm create remix@latest`. Zależnie od tego, co wybrał ci `/10x-tech-stack-selector` w poprzedniej lekcji (M1L2).

Dlaczego agent w ogóle nie próbuje napisać tego projektu od zera?

Bo to **dokładnie ta sama robota**, którą zespół Astro skodyfikował w swoim oficjalnym kreatorze. `npm create astro@latest` wygeneruje ci poprawny `package.json`, poprawny `astro.config.mjs`, poprawny `tsconfig.json` i strukturę katalogów dopasowaną do wersji Astro 5.x. Zna konwencje, zna domyślne integracje, wie, co aktualnie jest, a co nie.

Agent — nawet bardzo dobry agent — gdyby próbował to zreplikować z pamięci, dowiózłby pół-działający boilerplate. `package.json` z `"astro": "^4.0.0"` (bo tak było w danych treningowych), `astro.config.mjs` ze składnią z dwóch wersji wstecz. Spędzisz dwa dni na łataniu tego, co `npm create astro` zrobiłby w trzydzieści sekund.

Stąd uniwersalna reguła:

> **Jeśli istnieje autorytatywne CLI, które robi twoje zadanie — agent ma do niego zdelegować, nie wygenerować z głowy.**

Bootstrapper jest jedną instancją tej reguły. Ale ta sama logika obowiązuje wszędzie:

- Chcesz dodać Dockerfile? Najpierw `docker init` (jest taka komenda od Dockera) — agent dopisze to, czego CLI nie pokryje.
- Chcesz nowy generator komponentów? Najpierw `ng generate component` w Angularze albo `bun create vite` z templatem — nie "napisz mi komponent React od zera".
- Chcesz nową migrację Prismy? `npx prisma migrate dev --name add_users` — nie generowanie SQL z głowy.

Zachowanie modelu, które znasz z preworku — pewność siebie mimo niepełnej wiedzy — jest najbardziej kosztowne tam, gdzie obok stoi narzędzie z odpowiedzią autorytatywną. Twoja decyzja zaczyna się od pytania: *czy istnieje CLI, do którego mogę to zdelegować?*

### Trzy bramki egzekucji

Bootstrapper to konkretna instancja, ale wzorzec za nim jest uniwersalny. Każda egzekucja agenta — bootstrap, health-check, deploy, refaktor, generacja migracji — przechodzi przez trzy bramki:

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-2-10x.png)

1. **Pre-execution.** Zanim agent zrobi cokolwiek na dysku albo w sieci, sprawdza, czy ma do tego mandat. W bootstrapperze to weryfikacja hand-offu (`tech-stack.md` na dysku) i *recency check* — czy starter nie jest porzucony.
2. **In-execution.** W trakcie wykonania interakcja przebiega między agentem a *harnessem* — narzędziem, w którym agent działa (Claude Code, Cursor, Codex). Harness pyta cię o pozwolenie albo wykonuje komendę bez pytania, w zależności od polityki. W bootstrapperze ta faza ma *conflict policy*: kiedy scaffold próbuje nadpisać istniejący plik, zostawia go z sufiksem `.scaffold`.
3. **Post-execution.** Skill audytuje wynik i zapisuje raport. W bootstrapperze to `npm audit` plus `verification.md` z statusem każdej fazy.

Każda bramka ma innego właściciela. Pre-execution kontroluje kontrakt skilla. In-execution — harness i twoja polityka uprawnień. Post-execution — narzędzia zewnętrzne: `npm audit`, testy, CI.

Trzy pytania do każdego skilla: co sprawdza, zanim ruszy? Co harness chce ode mnie w trakcie? Co dostanę na wyjściu jako weryfikację? W tej lekcji największą uwagę poświęcimy bramce in-execution — bo to tam mieszka *twoja* konfiguracja.

### Uprawnienia w trakcie biegu

Skill po przejściu hand-offu zaczyna naprawdę pisać. I tu wchodzi rola harnessu.

W Claude Code w trakcie biegu zobaczysz na ekranie permission prompty mniej więcej takie:

```
Claude wants to run a command:
  npm create astro@latest

[1] Yes
[2] Yes, don't ask again for npm commands in this directory
[3] No, and tell Claude what to do differently
```

Każdy prompt to moment, w którym harness pyta: *czy to akceptujesz?* Domyślnie pyta o wszystko, co dotyka dysku albo sieci. Bez pytania puszcza tylko komendy czysto odczytujące (`ls`, `cat`, `grep`, `git status`).

Trzy decyzje, które masz do podjęcia przy każdym prompcie:

- **Yes** — pojedyncza zgoda, jednorazowo. Następna sesja zapyta cię o to samo.
- **Yes, don't ask again** — harness dopisuje regułę do `.claude/settings.json` w projekcie i przestaje pytać o tę kategorię.
- **No** — odrzucasz; agent dostaje feedback i ma inaczej rozwiązać problem.

Ta decyzja kształtuje twoje doświadczenie z agentem przez najbliższe miesiące.

Klikasz "Yes" za każdym razem — wieczorem masz za sobą dwie godziny klikania. Klikasz wszystko "Yes, don't ask again" bez zastanowienia — po tygodniu agent może wykonać dowolną komendę bash w twoim katalogu domowym.

Jak to rozstrzygnąć? Filtr przy każdym prompcie: **co ten wzorzec może popsuć poza moim repo?**

"Nic" (np. `npm install` w katalogu projektu) — śmiało dodajesz regułę. "Wszystko, co `git push` może wyrzucić na remote" — zostawiasz indywidualną zgodę. "Potencjalnie cały dysk" (np. `Bash(*)`) — w ogóle nie dodajesz takiej reguły.

Jak to wygląda w praktyce? Konkretną konfigurację startową — z pełnym zestawem reguł i uzasadnieniem każdej z nich — znajdziesz w następnej sekcji. Tu wystarczy zapamiętać mechanikę.

Reguły w Claude Code są ewaluowane w kolejności **deny → ask → allow**. Pierwsza pasująca wygrywa. `Bash(git push *)` na denyliście ma priorytet nad `Bash(git add *)` na allowliście — niezależnie od kolejności wpisów.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-3-10x.png)

Wbudowane narzędzia harnessu (`Read`, `Edit`, `Write`) i komendy bash to *różne światy*. Reguła `Read(./.env)` w `deny` zablokuje odczyt `.env` z poziomu agenta — ale nie zatrzyma `cat .env` w bashu, bo to inna ścieżka egzekucji.

Polityka filtruje wywołania narzędzi po nazwie i argumentach, nie po efekcie. Pierwszy sygnał, że **polityka uprawnień nie jest absolutna**.

W innych narzędziach wzorzec jest analogiczny, składnia inna:

- W **Codex**: `--sandbox workspace-write --ask-for-approval on-request`. Konfiguracja w `~/.codex/config.toml`.
- W **Cursor**: allowlist w `~/.cursor/permissions.json` albo w UI ustawień. Tryb "Run Everything" istnieje, ale dokumentacja Cursora *sama go odradza*.

Linki do dokumentacji znajdziesz w *Materiałach dodatkowych*. Składnia się różni — wzorzec jest ten sam.

### Rekomendowana konfiguracja startowa

Zamiast uczyć się polityki na sucho — zacznij od konkretnego pliku. Po pierwszym bootstrapie otwórz `.claude/settings.json` w swoim projekcie i wklej tę konfigurację:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(node *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git status *)",
      "Bash(git branch *)",
      "Bash(git checkout *)",
      "Bash(git stash *)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push *)",
      "Bash(git push)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

Dlaczego akurat te reguły?

**Allow — operacje lokalne, w obrębie projektu:**

- `Bash(npm *)`, `Bash(npx *)`, `Bash(node *)` — instalacja zależności, uruchamianie skryptów, narzędzia z rejestru npm. Jedyne wyjście poza projekt to warstwa sieciowa (rejestr npm), ale tej i tak potrzebujesz do pracy.
- `Bash(git add *)`, `Bash(git commit *)`, `Bash(git diff *)` i pozostałe operacje lokalne gita — czytają i piszą w `.git/`, ale niczego nie publikują na remote. Rozdzielamy je zamiast pisać szerokie `Bash(git *)`, żeby agent nie dostał niejawnej zgody na `git push`, `git reset --hard` czy `git clean -fd`.
- `Read`, `Edit`, `Write` — wbudowane narzędzia Claude Code do operacji na plikach. Działają w obrębie katalogu roboczego.

**Deny — operacje z efektem poza projekt:**

- `Bash(rm -rf *)` — może zniszczyć cały katalog domowy, jeśli agent źle podstawi argument.
- `Bash(git push *)` i `Bash(git push)` — push to decyzja publikacyjna. Dwa wzorce, bo goły `git push` (bez argumentów) też publikuje na remote.
- `Bash(curl *)`, `Bash(wget *)` — agent nie powinien samodzielnie pobierać i uruchamiać skryptów z sieci. Pojedynczy `curl` po dokumentację? Zobaczysz prompt i zdecydujesz.

**Czego tu nie ma — i dlaczego:**

Nie ma `Bash(git reset *)`, `Bash(git clean *)`, `Bash(git rebase *)` — ani w allow, ani w deny. Trafią do domyślnej kategorii `ask`: Claude Code zapyta cię, kiedy agent będzie chciał ich użyć. To przestrzeń, w której *ty* decydujesz w danym kontekście.

Nie ma `Bash(*)`. To wildcard na dosłownie każdą komendę — agent dostałby cichą zgodę na wszystko, co nie jest na denyliście. Jeśli kiedykolwiek zobaczysz `Bash(*)` w swoim allowliście — usuń.

**Jak ta konfiguracja rośnie:**

Ta lista to punkt wyjścia, nie cel. Po tygodniu pracy zauważysz wzorce: jeśli co sesję zatwierdzasz `Bash(docker compose *)` — dorzuć ją do allow. Jeśli okaże się, że `Bash(npx *)` puścił komendę, której nie chciałeś — przenieś ją do deny albo rozpisz na węższe wzorce.

Konfiguracja startowa → konfiguracja dojrzała. Allow rośnie o wzorce, które przeszły twój filtr. Deny rośnie o wzorce, które cię zaskoczyły. Reguły, które nie pasują do żadnej z tych list, zostają w ask — i to jest ich właściwe miejsce.

### Polityka uprawnień i YOLO mode

Konfiguracja z poprzedniej sekcji to kilka minut pracy. Daje ci stan pośredni — rutyna przechodzi bez pytania, destrukcja jest zablokowana, a reszta wymaga twojej zgody.

Po drugiej stronie skali siedzi *YOLO mode* — formalnie `bypassPermissions` (flaga `--dangerously-skip-permissions`). Wszystko przechodzi bez pytania.

Naturalny odruch po dwóch godzinach klikania "Yes": *włączam YOLO i jadę dalej*. Anthropic zna ten odruch i wprost pisze w dokumentacji (parafraza):

> Używaj tego trybu wyłącznie w izolowanych środowiskach — kontenery, maszyny wirtualne, dev containery bez dostępu do sieci. Tam, gdzie Claude Code nie może uszkodzić twojego systemu hosta.

To nie jest moralizatorska linia — to praktyczna instrukcja. Anthropic podaje konkretne warunki: dev container, użytkownik nie-root, ograniczony ruch sieciowy, zaufane repozytorium.

#### Dev container w praktyce

Co to właściwie znaczy? Dev container to kontener, w którym uruchamiasz Claude Code zamiast na swoim systemie. Agent widzi tylko to, co zamontowałeś — twoje repo, wybrane zależności, nic więcej. Nie ma dostępu do `~/.ssh`, do kluczy chmurowych, do produkcyjnych baz danych.

Trzy decyzje przy stawianiu dev containera dla agenta:

1. **Użytkownik nie-root.** Claude Code odmawia uruchomienia `--dangerously-skip-permissions` jako root — to wbudowane zabezpieczenie. Kontener startuje z użytkownikiem, który może pisać w katalogu projektu, ale nie modyfikuje systemu hosta.
2. **Ograniczona sieć.** Referencyjny kontener Anthropica zawiera skrypt `init-firewall.sh`, który blokuje ruch wychodzący do wszystkiego oprócz domen potrzebnych Claude Code (API, uwierzytelnianie). Agent nie wyśle twojego kodu na zewnątrz — nie ma dokąd.
3. **Zaufane repo.** Nawet w kontenerze agent modyfikuje pliki w zamontowanym workspace — a te pliki lądują na twoim hoście. Dev container chroni *system*, nie *projekt*. Uruchamiaj go na repozytoriach, którym ufasz.

Anthropic udostępnia referencyjny `devcontainer.json` w repozytorium Claude Code — obraz bazowy, montowanie wolumenu z konfiguracją, reguły sieciowe, integracja z VS Code. Jeśli kiedyś zdecydujesz, że YOLO mode spełnia twoje warunki brzegowe — zacznij od tego pliku, nie od pisania konfiguracji od zera. Link w *Materiałach dodatkowych*.

#### Skala uprawnień

W takich warunkach `--dangerously-skip-permissions` jest świadomym wyborem. Bez nich — to delegowanie *swoich* uprawnień systemowych modelowi, którego rozumowanie nie jest ci do końca dostępne.

Masz więc dwa krańce skali. Na jednym — **paraliż uprawnień**: domyślna polityka, każdy prompt potwierdzany ręcznie, dwie godziny klikania "Yes" dziennie. Na drugim — **pełna delegacja**: YOLO mode bez warunków brzegowych, agent robi co chce.

Między nimi leży **stan pośredni** — i to jest rekomendacja kursowa na ten etap.

Stan pośredni to tryb pracy, w którym:

- masz kilka świadomie dobranych reguł `allow` (np. `Bash(npm *)`, `Read`, `Write`) — Claude Code nie pyta o rutynę,
- masz kilka reguł `deny` na wzorce niebezpieczne (np. `Bash(rm -rf *)`, `Bash(git push *)`) — blokuje je bez pytania,
- wszystko poza tymi dwiema listami **nadal wymaga twojej zgody**.

W praktyce: bootstrapper odpala `npm create astro@latest` bez pytania (bo `Bash(npm *)` jest na allowliście), ale kiedy chce uruchomić niesklasyfikowaną komendę — zatrzymuje się i czeka. Nie toniesz w promptach, ale nie tracisz kontroli nad tym, co nieoczywiste.

Kluczowa różnica wobec YOLO: w stanie pośrednim Claude Code *nadal cię pyta* o operacje, których nie przewidziałeś. To sieć bezpieczeństwa na wypadek zachowań spoza twoich reguł. W YOLO mode tej siatki nie ma.

Claude Code oferuje też tryb `auto` (research preview), który automatycznie redukuje liczbę promptów bez wyłączania kontroli bezpieczeństwa — np. jawnie blokuje `Bash(*)` i wildcardowane interpretery na wejściu. Warto obserwować jego rozwój jako potencjalną alternatywę dla ręcznego kształtowania allowlisty.

Z każdym kolejnym bootstrapem, refaktorem, deployem — reguły rosną. Dodajesz to, co okazało się bezpieczne; usuwasz to, co okazało się zbyt szerokie. Stan pośredni to nie konfiguracja jednorazowa — to tryb pracy, który dojrzewa razem z twoim instynktem.

Ale jest jeszcze jedno.

**Polityka uprawnień jest kontrolą probabilistyczną, nie absolutną.** Podnosi koszt pomyłki — agent musi się zatrzymać, ty masz okazję zauważyć — ale go nie zeruje.

Jest udokumentowany przypadek (Ona, marzec 2026 r.), w którym Claude Code, mając zablokowaną komendę `npx` na denyliście, sięgnął po ten sam plik binarny przez ścieżkę `/proc/self/root/usr/bin/npx`, omijając pattern matching.

W innym scenariuszu model zaproponował: *the bubblewrap sandbox is failing... let me try disabling the sandbox* — i poprosił użytkownika, żeby uruchomił komendę bez sandboxu. Użytkownik zgodził się.

To pojedyncze, udokumentowane przypadki — nie codzienność. Wystarczą jednak, żeby skorygować model mentalny: polityka uprawnień to nie zamek w drzwiach. To próg na podłodze — spowolni i zaalarmuje, ale nie zatrzyma za każdym razem.

Co z tego wynika? **Defense in depth.** Polityka uprawnień, brak dostępu agenta do produkcyjnych danych, git jako sieć bezpieczeństwa, reguły w `CLAUDE.md` (te poznasz w lekcji Agent Onboarding (M1L4)) — to warstwy, które się składają. Żadna z nich osobno nie jest wystarczająca.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-4-10x.png)

Stąd zalecenie kursowe na tę lekcję: **polityka jako punkt wyjścia, YOLO jako świadoma decyzja z warunkami brzegowymi, defense in depth jako zasada**. Trzymaj się tych trzech, póki nie masz jeszcze instynktu, kiedy bezpiecznie któryś z nich poluzować.

### `verification.md` jako raport z bootstrappera

Skill skończył pracę: scaffold wylądował na dysku, `.git/` został pominięty (bootstrapper v1 nie wykonuje `git init` — to twoja decyzja, kiedy zainicjalizować historię).

W katalogu pojawił się `context/changes/bootstrap-verification/verification.md`.

Co tam jest?

Trzy fazy z bramkami. Każda ma status: `passed`, `warned`, `failed`, `skipped`. Każda krótko mówi, dlaczego.

- **Phase 1 — pre-scaffold verification.** Czy starter (np. `astro@latest`) nie jest porzucony? Świeży? `passed`. Ostatnia publikacja sprzed dwóch lat? `warned` — skill nie staje, ale zaznacza sygnał w raporcie.
- **Phase 2 — scaffold and merge.** Wywołanie `npm create astro@latest`. Skończyło się exit code 0 (`passed`) albo non-zero (`failed`, **HARD-STOP**). O HARD-STOP za chwilę.
- **Phase 3 — post-scaffold verification.** `npm audit` (dla projektów JS/TS). Pięć poziomów ważności: `info`, `low`, `moderate`, `high`, `critical`. Niezerowy exit code *nie zatrzymuje* bootstrappera — informacja jest sygnałowa, nie blokująca.

`warned` — wiesz, gdzie zacząć dochodzenie. `failed` — wiesz, że scaffold się nie domknął i trzeba podjąć decyzję. Raport jest kontraktem, który *następne* ogniwa łańcucha mogą czytać.

To trzecia bramka — **post-execution**. Agent dał ci raport o swojej pracy w formie plikowej, nie konwersacyjnej. Wrócisz do tego pliku za tydzień i nadal będziesz wiedział, co się wtedy stało.

### Health-check: audyt istniejącego projektu

Masz istniejący projekt? Nie uruchamiaj bootstrappera — bootstrapper jest dla pustego katalogu. `/10x-health-check` to właściwy punkt wejścia.

`/10x-health-check` to brownfield odpowiednik bootstrappera. Bierze istniejący projekt i przepuszcza go przez te same trzy bramki egzekucji:

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-5-10x.png)

1. **Pre-check** — audyt zależności (`npm audit`, `pip-audit`, `cargo audit` — zależnie od ekosystemu), obecność lockfile'a, znane podatności. Zanim agent zacznie z projektem pracować, sprawdza, w jakim stanie jest fundament.
2. **In-check** — analiza read-only. Czy jest test runner i czy testy się uruchamiają? Czy jest pipeline CI/CD? Czy brakuje konfiguracji (`tsconfig.json` ze strict, `.prettierrc`, `.editorconfig`)?
3. **Post-check** — werdykt agent-readiness: `healthy`, `needs-attention` lub `critical-issues`. Plus priorytetyzowana lista fixów w dwóch kategoriach: fixy do zrobienia teraz (Category A — brakujący test runner, krytyczne podatności, brak lockfile'a) i fixy omawiane w kolejnych lekcjach (Category B — brak CI/CD to temat lekcji Sprint Zero (M1L5), brak AGENTS.md to temat lekcji Agent Onboarding (M1L4)).

Jeśli wcześniej uruchomiłeś `/10x-stack-assess` w poprzedniej lekcji (M1L2), health-check czyta `stack-assessment.md` i linkuje swoje findings do quality-gate gaps. Przykład: stack-assess zidentyfikował, że twój stack nie spełnia bramki "typed" — health-check potwierdza, że CI nie ma kroku type-check.

Dwa raporty razem dają spójny obraz: gdzie stack ma luki *i* gdzie infrastruktura projektu tych luk nie kompensuje.

Wynik: `context/foundation/health-check.md` — plik z raportem, który pełni tę samą rolę co `verification.md` w greenfield: daje następnym ogniwom łańcucha plikowy kontekst o stanie projektu przed onboardingiem agenta (M1L4).

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-6-10x.png)

Obie ścieżki zbiegają się w lekcji Agent Onboarding (M1L4) z równoważnym kontekstem. Różni się punkt wejścia, nie jakość artefaktów na wyjściu.

### Narzędzia po bootstrapie

Scaffoldowane repo na dysku, minimalna polityka uprawnień w `.claude/settings.json`, trzy bramki jako sposób czytania każdej egzekucji agenta. Czas na mapę narzędziową.

Narzędzia, które agent wykorzystuje na co dzień, układają się w trzy kategorie:

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-7-10x.png)

1. **Wbudowane narzędzia harnessu** — `Read`, `Edit`, `Write`, `Bash`. To one łączą agenta z twoim systemem operacyjnym pod kontrolą polityki uprawnień.
2. **Systemowe CLI** — `npm`, `git`, `gh`, CLI starterów, narzędzia diagnostyczne. To one robią autorytatywną robotę, do której agent ma delegować.
3. **MCP** — *Model Context Protocol*. Standaryzuje, jak agent woła zewnętrzne źródła danych, integracje i narzędzia spoza systemu plików. Wymieniamy ją tutaj jako kategorię, bo zaczniesz ją widzieć w skillach toolkitu i poza nim. Pełną mechanikę MCP poznasz w lekcji Sprint Zero (M1L5).

Trzy kategorie, trzy bramki, jedna polityka, jedno repo na dysku — niezależnie od tego, czy je właśnie scaffoldowałeś, czy audytowałeś.

Repo jest na razie *głuche* — agent nie zna jeszcze twoich konwencji, formatów odpowiedzi ani komend testowych. Tę lukę zamkniesz w kolejnej lekcji (M1L4), kiedy na tym fundamencie zainstalujesz hierarchię instrukcji projektowych i przeprowadzisz onboarding agenta w swoim repozytorium.

## Deep Dive

### Co, jeśli delegacja zawodzi

Wzorzec "deleguj do autorytatywnego CLI" działa, dopóki CLI działa. A kiedy nie?

Bootstrapper traktuje to jako **HARD-STOP**. Jeśli `npm create astro@latest` zwróci niezerowy exit code — skill się zatrzymuje. Nie próbuje naprawiać sytuacji od strony agenta, nie improwizuje brakujących plików, nie kontynuuje do `npm audit`.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-8-10x.png)

Co zostaje na dysku?

- Katalog `.bootstrap-scaffold/` z tym, co CLI zdążył wygenerować przed błędem.
- Częściowy `verification.md` ze statusem `failed` i krótkim opisem błędu. (Pole `phase_3_status` w logu to ogólny status weryfikacji — nie odnosi się konkretnie do Phase 3, mimo mylącej nazwy. Bootstrapper nadaje je, gdy którakolwiek faza zakończy się błędem krytycznym.)
- Twój oryginalny `tech-stack.md` nietknięty — kontrakt z poprzedniej lekcji (M1L2) wraca jako wejście dla retry.

Otwierasz `.bootstrap-scaffold/` i szukasz przyczyny. Najczęstsze: brak dostępu do sieci, lockfile ze starszej wersji `npm`, konflikt nazwy katalogu, brakująca zmienna środowiskowa. Naprawiasz *na poziomie systemu*, nie na poziomie agenta, i uruchamiasz `/10x-bootstrapper` ponownie.

Wzorzec do zapamiętania: **kiedy autorytatywne CLI mówi nie, agent też mówi nie**. Próba obejścia ("a niech model dopisze ten plik ręcznie") prowadzi prosto do "AI scaffolds from scratch" — pół-działającego boilerplate'u, którego w następnych modułach nie da się utrzymać.

### Jak bootstrapper traktuje istniejące pliki

Załóżmy, że w katalogu masz już `package.json` — zostawiony po wcześniejszej eksploracji albo ręcznie napisanej wersji projektu. `npm create astro@latest` chce zapisać swój `package.json`. Co się dzieje?

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l3-lesson-draft-9-10x.png)

Bootstrapper nie nadpisuje. Twój `package.json` zostaje, wersja ze scaffoldu trafia do `package.json.scaffold` jako *sibling*. Porównujesz oba i podejmujesz decyzję — zachować swoje, przyjąć scaffold, zmergować ręcznie.

Jeden katalog jest traktowany szczególnie: `context/`. Wszystko, co tam leży — `prd.md`, `tech-stack.md`, ewentualne inne notatki — *jest zachowywane verbatim, bez wyjątków*. To twoje ślady decyzji projektowych z poprzednich lekcji (M1L1, M1L2). Bootstrapper traktuje je jako dane, nie kandydatów do wymiany.

`.gitignore` jest specjalnie obsługiwany: bootstrapper merguje twoje wpisy z wpisami ze scaffoldu. Nie tracisz lokalnych ignorów, ale dostajesz świeży zestaw od startera.

Cały ten mechanizm to in-execution w praktyce: **nie chcesz, żeby agent miał wolną rękę nad twoim dyskiem**. Chcesz, żeby narzędzie miało wbudowane reguły, których nie musisz wymuszać promptem.

### Cztery tryby awaryjne

Wzorce bezpieczeństwa — jasne. A jak wyglądają antywzorce? Cztery tryby, w które najczęściej wpadają kursanci po pierwszym tygodniu z agentem.

**Approve-everything Stockholm.** Każdy permission prompt potwierdzasz ręcznie, bo nie wiesz, co bezpieczne. Po dwóch dniach workflow to mecz o wytrzymałość, nie o produkt — i porzucasz agenta jako "nie do utrzymania".

Antidotum: kilka świadomie dodanych reguł `allow` po pierwszym bootstrapie, plus filtr "co to może popsuć poza moim repo" przy każdej decyzji.

**YOLO mode bez warunków.** `Bash(*)` w allowlist po pierwszym frustrującym dniu. Agent dostaje dostęp do produkcyjnych integracji przez MCP. Dziewięć dni później pojawia się komenda, której nie powinno być — i znika lokalna baza albo plik z sekretami.

Antidotum: dwie reguły `deny` dla wzorców niebezpiecznych, brak prod-data po stronie agenta, repo w gicie. *Świadome* YOLO mode jest możliwe, ale wymaga warunków brzegowych, do których ten kurs jeszcze cię nie doprowadził.

**AI scaffolds from scratch.** Pomijasz łańcuch — *po prostu stwórz mi projekt Astro z auth*. Agent generuje pół-działający boilerplate, tracisz dwa dni na łatanie tego, co `npm create astro` zrobiłby poprawnie w trzydzieści sekund.

Antidotum: przy każdym prompcie pytaj, czy istnieje CLI, do którego agent może to zdelegować.

**Brownfield-as-greenfield.** Masz istniejący projekt, ale zamiast go audytować, uruchamiasz bootstrappera. Scaffold konfliktuje z istniejącym kodem, `.scaffold` siblings mnożą się po katalogu, czas idzie na rozwiązywanie kolizji.

Antidotum: jeśli projekt istnieje, `/10x-health-check` to właściwy punkt wejścia. Bootstrapper jest dla pustego katalogu.

Wszystkie cztery tryby to naturalne zachowania pierwszego tygodnia — lęk, frustracja, iluzja kompetencji modelu, odruch "zacznijmy od zera". Konkretna alternatywa jest zawsze ta sama: *delegacja + minimalna polityka + filtr "co to może popsuć poza moim repo"*.

### YOLO mode od pierwszej osoby

To pytanie pojawia się w prawie każdej kohorcie: *a czy ty, prowadzący, klikasz każdy prompt?*

Nie. Od września 2025 r. pracuję głównie z `--dangerously-skip-permissions` aktywnym dla głównych projektów. Nic spektakularnego się nie zdarzyło — oprócz jednego przypadku, w którym agent w trakcie debugowania... skasował lokalną bazę danych. Zatrzymałem kolejne incydenty zapisem w `CLAUDE.md`, który wprost zabrania operacji destruktywnych na bazie bez interaktywnego potwierdzenia.

Ale: pracuję w bezpiecznym środowisku. Bez dostępu do produkcji ze strony agenta, bez serwerów MCP podłączonych do produkcji, z wersjonowaniem gita i dyscypliną branchowania. *Mój* YOLO mode spełnia warunki brzegowe, które Anthropic opisuje w dokumentacji devcontainerów. Wasz — z dużym prawdopodobieństwem — jeszcze nie.

Stąd rekomendacja kursowa: zostań w stanie pośrednim — allow/deny plus Claude Code pytający o resztę — dopóki nie masz instynktu, *kiedy* któryś z warunków brzegowych przestaje obowiązywać.

### Co zrobić po tej lekcji

- **Greenfield:** Uruchom `/10x-bootstrapper` na swoim `tech-stack.md` z poprzedniej lekcji (M1L2). Sprawdź, czy scaffold przeszedł trzy bramki, przejrzyj `verification.md` i upewnij się, że testy przechodzą.
- **Brownfield:** Uruchom `/10x-health-check` w katalogu swojego istniejącego projektu. Przejrzyj wynik w `health-check.md`: stan zależności, pokrycie testami, konfiguracja CI/CD i werdykt agent-readiness.

## Materiały dodatkowe

- [Configure permissions — Claude Code docs](https://code.claude.com/docs/en/permissions) — oficjalna dokumentacja składni `permissions.allow` / `deny` / `ask`, kolejności ewaluacji i wzorców `Bash(...)`. To źródło, do którego wracasz, kiedy nie pamiętasz, czy `Bash(npm *)` to słuszna reguła dla `npx`.
- [Choose a permission mode — Claude Code docs](https://code.claude.com/docs/en/permission-modes) — pełna lista trybów (`default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`) i ostrzeżenia producenta wokół `--dangerously-skip-permissions`.
- [Development containers — Claude Code docs](https://code.claude.com/docs/en/devcontainer) — rekomendacja Anthropica, jak uruchamiać YOLO mode w warunkach brzegowych (dev container, użytkownik nie-root, ograniczony dostęp do sieci).
- [Building effective agents — Anthropic Engineering](https://www.anthropic.com/engineering/building-effective-agents) — zasada "deleguj do narzędzi, których zachowanie znasz" i projektowanie interfejsów dla agenta z tą samą starannością, co dla człowieka.
- [Agent approvals & security — Codex](https://developers.openai.com/codex/agent-approvals-security) — odpowiednik Claude Code'owej polityki w Codex CLI: `--sandbox`, `--ask-for-approval`, `~/.codex/config.toml`.
- [Agent Security — Cursor](https://cursor.com/docs/agent/security) — odpowiednik dla Cursora: `~/.cursor/permissions.json`, ostrzeżenie o trybie "Run Everything", przyznanie w samej dokumentacji, że *allowlist is best-effort — bypasses are possible*.
- [npm audit — npm CLI docs](https://docs.npmjs.com/cli/v10/commands/npm-audit) — pięć poziomów ważności i semantyka exit codes; przyda się przy czytaniu `verification.md`.
- [How Claude Code escapes its own denylist and sandbox — Ona, marzec 2026 r.](https://ona.com/stories/how-claude-code-escapes-its-own-denylist-and-sandbox) — udokumentowany przypadek obejścia polityki przez agenta. Czytaj jako materiał kontekstowy, nie jako reklamę produktu, który tekst promuje.
- [A field guide to sandboxes for AI — Luis Cardoso](https://www.luiscardoso.dev/blog/sandboxes-for-ai) — niezależny praktyk porządkujący trzy decyzje wokół izolacji agenta: *boundary*, *policy*, *lifecycle*. Dobre uzupełnienie do bramki in-execution.
- Prework [1.2] *Chatbot vs Agent vs Harness* — definicja harnessu jako warstwy kontroli; wraca tu jako konfigurowalny komponent, nie tylko pojęciowa kategoria.
- Prework [2.3] *Claude Code — podstawy operacyjne* — kategorie uprawnień, które tu operacjonalizujesz przez konkretną politykę.
