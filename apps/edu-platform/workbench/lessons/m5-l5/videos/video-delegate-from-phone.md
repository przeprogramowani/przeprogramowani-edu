# Video Scenario: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym

## Cel wideo

Wideo ma pokazać jeden kompletny przebieg: wybieramy zadanie o jasnych granicach, zapisujemy runbook środowiska, uruchamiamy pracę w zdalnym trybie, monitorujemy ją z telefonu tylko na poziomie kontroli przebiegu, a końcową ocenę robimy później przez diff, logi i kryteria sukcesu. Teza do udowodnienia: kontrola nie znika, tylko przenosi się do setupu, monitoringu i review.

## Założenia

- Nagranie używa krótkiego, niskiego ryzyka zadania: aktualizacja test planu dla jednego modułu po zmianie wymagań.
- Repo startowe ma istniejący plik `docs/test-plans/payments.md` albo równoważny plik dokumentacyjny przygotowany jako fixture nagraniowy.
- Narzędzie główne to zarządzany sandbox chmurowy z możliwością sprawdzenia statusu z telefonu. Konkretne narzędzie nagraniowe należy potwierdzić przed produkcją, żeby nie opierać filmu na niedostępnej funkcji preview.
- Wideo nie pokazuje dokładnych tierów, cen, limitów zasobów, list preinstalowanych narzędzi ani trwałości cache'u.
- Wideo nie uczy `/goal`, Ralph, mechaniki worktree, budowania agentów SDK ani implementowania Cloudflare Agents.

## Materiały i setup nagrania

- Repo/projekt: przygotowany mały fixture projektu z modułem `payments` i plikiem test planu.
- Narzędzie główne: Claude Code on the web albo równoważny zarządzany sandbox w chmurze, jeśli konto nagrywającego ma dostęp; fallback to nagrany wcześniej przebieg i pokazanie artefaktów.
- Pliki startowe: `docs/test-plans/payments.md`, fragment diffu lub notatka `docs/changes/subscription-limits.md`, opcjonalnie `.mcp.json` jako widoczna konfiguracja repo.
- Pliki tworzone/edytowane: `docs/async-agent-runbook.yaml`, `docs/test-plans/payments.md`, opcjonalny `reports/async-agent-review.md`.
- Stan fallbackowy: gotowy branch z runbookiem, wynikowym diffem, logiem setupu i raportem review.
- Ryzyka live demo: dostęp do funkcji preview, niedeterministyczne zachowanie agenta, inne etykiety UI na telefonie, blokada sieci, długi setup, brak MCP w sandboxie.

## Segment 1 — Zadanie, które można zostawić

**Format:** `presentation`

**Cel:** Ustawić granice zadania i pokazać, że nie delegujemy niczego wymagającego sekretów ani decyzji produktowej na żywo.

**Na ekranie:**

- Repo w edytorze.
- Plik `docs/test-plans/payments.md`.
- Krótka notatka o zmianie limitów subskrypcji.

**Przebieg:**

1. Pokaż plik test planu i jedno miejsce, w którym brakuje scenariuszy.
2. Nazwij zakres: dokumentacja/test plan, bez edycji kodu produkcyjnego.
3. Nazwij zakazy: brak sekretów produkcyjnych, brak szerokiego internetu, brak zmian poza wskazanymi plikami.

**Rezultat:** Widz ma jasny przykład zadania o ograniczonym zakresie, które można ocenić później.

**Most do tekstu:** Sekcja "Dlaczego ograniczenia pozwalają odejść od biurka" i przykład runbooka w tekście lekcji.

## Segment 2 — Runbook przed startem

**Format:** `live-demo`

**Cel:** Pokazać setup, sieć, MCP, sekrety i review jako pola kontraktu przed uruchomieniem agenta.

**Na ekranie:**

- Nowy plik `docs/async-agent-runbook.yaml`.
- Obok otwarty tekst lekcji albo notatka z polami runbooka.

**Przebieg:**

1. Wklej przygotowany runbook z polami: `cel`, `zakres`, `setup`, `sieć`, `mcp`, `sekrety`, `warunek_stopu`, `review`.
2. Podkreśl, że setup pobiera zależności przed pracą agenta, a nie w trakcie improwizacji.
3. Pokaż `.mcp.json`, jeśli fixture go zawiera, i powiedz, że zdalne środowisko widzi tylko konfigurację dostarczoną w sposób obsługiwany przez narzędzie.
4. Zaznacz, że w tym zadaniu sekrety są zbędne albo ograniczone do odczytu.

**Rezultat:** Przed startem istnieje artefakt, który ogranicza pracę i późniejsze review.

**Most do tekstu:** Sekcja "Tryb 2: sandbox w chmurze" oraz pierwsze wyjaśnienie MCP.

## Segment 3 — Start zdalnego przebiegu

**Format:** `live-demo`

**Cel:** Uruchomić pracę tak, żeby ekran pokazał różnicę między lokalnym promptem a zdalnym środowiskiem z ustawionymi granicami.

**Na ekranie:**

- Widok narzędzia zdalnego albo terminal uruchamiający zdalną sesję.
- Runbook jako kontekst zadania.
- Krótki status setupu.

**Przebieg:**

1. Utwórz nowe zadanie w sandboxie albo uruchom przygotowaną zdalną sesję.
2. Przekaż agentowi cel i odwołaj się do `docs/async-agent-runbook.yaml`.
3. Pokaż, że sesja przechodzi przez setup lub sprawdza wymagania środowiska.
4. Nie pokazuj dokładnych limitów ani tierów. Jeśli UI je pokazuje, potraktuj je jako bieżący stan narzędzia, nie jako stałą lekcji.

**Rezultat:** Przebieg jest uruchomiony z jasnym zakresem i bez polegania na ukrytej lokalnej konfiguracji.

**Most do tekstu:** Sekcje "Co przygotowujesz przed startem?", "Kiedy sandbox ma dostęp do internetu?" i "Jak przenosisz MCP i konfigurację narzędzi?".

## Segment 4 — Telefon jako kontrolka

**Format:** `live-demo`

**Cel:** Pokazać, że telefon służy do monitoringu i decyzji operacyjnych, nie do pełnego code review.

**Na ekranie:**

- Telefon albo nagrany ekran telefonu z widokiem statusu zadania.
- Lista kontrolna z runbooka widoczna obok lub po chwili na desktopie.

**Przebieg:**

1. Pokaż status przebiegu na telefonie bez obiecywania konkretnych etykiet UI.
2. Sprawdź cztery rzeczy: setup się zakończył, agent nie utknął na sieci/MCP, zakres nie rozszerzył się na kod produkcyjny, nie ma prośby o szerszy sekret.
3. Jeśli przebieg sygnalizuje blokadę, pokaż decyzję: doprecyzować, zatrzymać albo zostawić do review.
4. Powiedz wprost, że na telefonie nie akceptujemy dużego diffu "na oko".

**Rezultat:** Widz widzi praktyczny sens telefonu: szybkie sterowanie ryzykiem w trakcie, nie zastępstwo dla review.

**Most do tekstu:** Akapit "Telefon nie jest tu symbolem..." oraz lista kontroli telefonicznych w tekście lekcji.

## Segment 5 — Review po powrocie

**Format:** `live-demo`

**Cel:** Zamknąć pętlę odpowiedzialności: zielony status nie wystarcza, liczy się wynik względem kryteriów.

**Na ekranie:**

- Diff w repo.
- Log setupu albo raport agenta.
- `docs/async-agent-runbook.yaml` z checklistą review.

**Przebieg:**

1. Pokaż diff w `docs/test-plans/payments.md`.
2. Przejdź po kryteriach review: zakres plików, założenia, test lub kontrola dokumentacji, brak sekretów, brak wyjścia poza zakres.
3. Pokaż krótką decyzję końcową w `reports/async-agent-review.md`: zaakceptować, poprawić ręcznie, wrócić z doprecyzowaniem albo odrzucić.
4. Zakończ zdaniem: agent pracował bez ciągłej obecności, ale odpowiedzialność wróciła w review.

**Rezultat:** Wideo dowodzi tezy lekcji bez dokładania nowych claims produktowych.

**Most do tekstu:** Sekcje "Kontrola nie zniknęła" i "Zadania praktyczne".

## Pre-production TODO

### For `live-demo` segments:

- [ ] Repo/fixture sklonowane i ustawione na czysty commit startowy.
- [ ] Pliki `docs/test-plans/payments.md` i `docs/changes/subscription-limits.md` przygotowane.
- [ ] `docs/async-agent-runbook.yaml` przygotowany jako wklejka, żeby nie pisać długiego YAML na kamerze.
- [ ] Wybrane narzędzie sandboxowe sprawdzone w dry runie na koncie nagrywającego.
- [ ] Telefon sparowany lub przygotowany nagrany ekran telefonu.
- [ ] Materiały fallbackowe przygotowane: branch z wynikowym diffem, logiem i raportem review.
- [ ] Terminal i edytor ustawione na czytelny rozmiar fontu.
- [ ] Sekrety produkcyjne nieobecne w fixture.
- [ ] Git clean state i tag/reset point gotowy przed nagraniem.

### For `conversation-review` segments:

- [ ] Nie dotyczy w podstawowej wersji scenariusza.

### For `presentation` segments:

- [ ] Krótka plansza lub notatka "zadanie o jasnych granicach vs ryzykowne zadanie" przygotowana do Segmentu 1.
- [ ] Przejście z planszy do repo przećwiczone.

### General:

- [ ] Dokładny produkt do nagrania wybrany po sprawdzeniu aktualnego dostępu.
- [ ] UI labels i statusy narzędzia sprawdzone tuż przed nagraniem.
- [ ] Nagranie nie pokazuje tierów, cen, limitów ani innych wartości, które mogą szybko się zmienić.
- [ ] Fallback branch działa bez sieci i bez konta preview.

## Video/text mismatches

(none)

## Claims introduced only in video

(none)

## Needs human decision

- Wybrać konkretne narzędzie do nagrania: Claude Code on the web, Codex Cloud albo równoważny sandbox z dostępem nagrywającego.
- Zdecydować, czy telefon ma być pokazany jako live capture, nagrany ekran telefonu, czy krótki cutaway z przygotowanym stanem.
