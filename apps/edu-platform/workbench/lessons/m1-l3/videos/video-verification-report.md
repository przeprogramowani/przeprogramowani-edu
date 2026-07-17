# Video Scenario: m1-l3 — Czytanie verification.md

## Cel wideo

Przeprowadzić kursanta przez `verification.md` — raport, który bootstrapper zostawia na dysku po zakończeniu pracy. Wideo musi nauczyć czytania raportu: rozpoznawania trzech faz, interpretacji statusów (passed / warned / failed / skipped) i podejmowania decyzji "czy kontynuować, czy zatrzymać się i zbadać". Kluczowe rozróżnienie dydaktyczne: `warned` w Phase 1 (stale starter) = pauza i dochodzenie; `warned` w Phase 3 (npm audit z moderate findings) = zanotuj, zdecyduj później. Wideo używa realnego `verification.md` wygenerowanego w biegu z video-permission-prompts.md — nie jest to osobne nagranie bootstrappera, tylko kontynuacja tego samego artefaktu.

## Założenia

- `verification.md` istnieje na dysku w `context/changes/bootstrap-verification/` — wygenerowany w biegu bootstrappera nagranym dla video-permission-prompts.md.
- Kursant widział już w tekście lekcji sekcje "verification.md jako raport z bootstrappera" i "Trzy bramki egzekucji" — zna ramkę, ale nie widział jeszcze realnego pliku.
- Wideo nie edytuje verification.md, nie uruchamia bootstrappera ponownie i nie konfiguruje settings.json.
- Wideo nie wchodzi w `npm audit fix` ani w naprawę konkretnych podatności — to poza zakresem lekcji (mustNotCover: "pogłębione audyty bezpieczeństwa kodu").
- Raport może mieć różne statusy zależnie od biegu — prowadzący komentuje to, co widzi, nie to, co "powinno być".

## Materiały i setup nagrania

- Repo/projekt: 10xCards po bootstrapie (ten sam stan co na końcu video-permission-prompts.md).
- Narzędzie główne: edytor kodu (VS Code lub inny) z otwartym `verification.md`.
- Pliki startowe: `context/changes/bootstrap-verification/verification.md` — wygenerowany w biegu bootstrappera.
- Pliki tworzone/edytowane: brak — wideo jest review-only.
- Stan fallback: jeśli `verification.md` z biegu ma same `passed` (brak warned/failed), przygotować drugi przykładowy `verification.md` z `warned` w Phase 1 i `warned` w Phase 3 jako materiał do pokazania w post-produkcji (split-screen lub wstawka).
- Ryzyka live demo: (1) raport może być bardzo krótki jeśli wszystko przeszło — braknie materiału do omówienia; stąd fallback z przygotowanym raportem; (2) raport może zawierać nieoczekiwane statusy — prowadzący komentuje to, co widzi, nie skrypt.

## Segment 1 — Otwarcie raportu: trzy fazy

**Format:** `conversation-review`

**Cel:** Pokazać strukturę verification.md — trzy fazy odpowiadające trzem bramkom egzekucji.

**Na ekranie:**

- Edytor z otwartym `verification.md`.
- Widoczna cała struktura pliku: nagłówki trzech faz, statusy, opisy.

**Przebieg:**

1. Prowadzący otwiera `verification.md` w edytorze.
2. Scrolluje wolno przez plik, pokazując strukturę: "Trzy fazy. Każda ma status i krótkie wyjaśnienie."
3. Nazywa fazy:
   - "Phase 1 — pre-scaffold verification. Czy starter jest aktualny?"
   - "Phase 2 — scaffold and merge. Czy CLI się powiodło?"
   - "Phase 3 — post-scaffold verification. Czy npm audit coś znalazł?"
4. Komentarz: "Widzisz ramkę trzech bramek, którą znasz z tekstu lekcji — ale teraz to plik na dysku, nie diagram. Ten plik możesz otworzyć za tydzień i nadal wiedzieć, co się wtedy stało."

**Rezultat:** Kursant widzi realny `verification.md` i rozpoznaje w nim strukturę trzech bramek.

**Most do tekstu:** Odpowiada sekcji "`verification.md` jako raport z bootstrappera" w Core.

## Segment 2 — Interpretacja statusów: passed vs warned vs failed

**Format:** `conversation-review`

**Cel:** Nauczyć kursanta, co oznacza każdy status i jak różni się reakcja na `warned` w różnych fazach.

**Na ekranie:**

- Edytor z `verification.md` — fokus na statusach poszczególnych faz.
- Opcjonalnie: side-by-side z drugim raportem (fallback z warned/failed), jeśli główny raport ma same passed.

**Przebieg:**

1. Prowadzący przechodzi przez każdy status widoczny w raporcie:
   - **passed** — "Bootstrapper zweryfikował i nie znalazł problemu. Kontynuujesz."
   - **warned** — "Bootstrapper znalazł coś, co nie blokuje, ale wymaga twojej uwagi."
   - **failed** — "Błąd krytyczny. Bootstrapper zatrzymał się (HARD-STOP). Jeśli to widzisz w Phase 2, to znaczy, że scaffold się nie dokonał."
   - **skipped** — "Faza nie została uruchomiona — np. brak narzędzia audytowego dla danego ekosystemu."
2. Kluczowe rozróżnienie: "warned w Phase 1 i warned w Phase 3 to dwa różne sygnały."
   - "Phase 1 warned — starter nie był publikowany od dłuższego czasu. To może znaczyć, że generujesz projekt na porzuconym frameworku. **Zatrzymaj się i zbadaj**, zanim przejdziesz dalej."
   - "Phase 3 warned — npm audit znalazł podatności na poziomie moderate. To jest informacyjne, nie blokujące. **Zanotuj, zdecyduj później** — może w Phase 1 projektu, może w m1-l5 przy CI/CD."
3. Prowadzący podkreśla: "Bootstrapper nie podejmuje tych decyzji za ciebie. Daje ci raport — ty decydujesz."

**Rezultat:** Kursant rozumie semantykę statusów i wie, że `warned` w różnych fazach wymaga różnej reakcji.

**Most do tekstu:** Odpowiada akapitom o Phase 1/2/3 w sekcji "verification.md jako raport z bootstrappera" i sekcji Deep Dive o HARD-STOP.

## Segment 3 — npm audit: co znaczą severity tiers

**Format:** `conversation-review`

**Cel:** Pokazać, jak czytać fragment raportu dotyczący npm audit — severity tiers i co z nimi robić na tym etapie.

**Na ekranie:**

- Edytor z `verification.md` — sekcja Phase 3 z wynikami npm audit.
- Widoczne severity tiers: info, low, moderate, high, critical (lub ich podzbiór, zależnie od biegu).

**Przebieg:**

1. Prowadzący fokusuje na sekcji npm audit w raporcie.
2. Nazywa piramidę ważności: "npm audit ma pięć poziomów: info, low, moderate, high, critical."
3. Komentuje to, co widzi w raporcie:
   - Jeśli są findings: "Widzimy [N] findings na poziomie [moderate/high]. Bootstrapper tego nie naprawi za ciebie — informuje."
   - Jeśli brak findings: "Zero findings. Ale to nie znaczy, że projekt jest bezpieczny — to znaczy, że npm audit w tej chwili nie znalazł znanych podatności w twoich direct dependencies."
4. Zamknięcie: "Na tym etapie kursu nie wchodzisz w naprawę każdego finding. Notujesz, że raport istnieje, i wracasz do niego, kiedy projekt dojrzeje do CI/CD — to m1-l5."
5. Opcjonalnie: "Jeśli widzisz `critical` — to jedyny poziom, na którym warto się zatrzymać teraz. Reszta to informacja do późniejszej decyzji."

**Rezultat:** Kursant wie, że npm audit jest częścią raportu, zna poziomy ważności i ma regułę: critical = pauza, reszta = zanotuj.

**Most do tekstu:** Odpowiada akapitowi o npm audit w sekcji "verification.md" i linkowi do npm audit docs w Materiałach Dodatkowych.

## Segment 4 — Zamknięcie: raport jako kontrakt dla następnych kroków

**Format:** `conversation-review`

**Cel:** Zamknąć wideo nazwaniem roli verification.md w łańcuchu — to nie szum, to plikowy input dla następnych ogniw.

**Na ekranie:**

- Edytor z `verification.md` — widok całego pliku.
- Opcjonalnie: krótki `ls context/` pokazujący, gdzie raport leży w strukturze projektu.

**Przebieg:**

1. Prowadzący pokazuje lokalizację pliku: `context/changes/bootstrap-verification/verification.md`.
2. Komentarz: "Ten plik leży w `context/` — tam, gdzie wszystkie artefakty decyzyjne: PRD, tech-stack, i teraz verification. Następne ogniwa łańcucha — m1-l4, m1-l5 — mogą go przeczytać. Nie musisz pamiętać, co się stało — plik pamięta za ciebie."
3. Zamknięcie: "To trzecia bramka — post-execution. Agent dał ci raport o swojej własnej pracy w formie plikowej, nie konwersacyjnej. Wrócisz do tego pliku za tydzień i nadal będziesz wiedział, co się wtedy stało."
4. Bridge do m1-l4: "Teraz masz scaffoldowane repo, politykę uprawnień i raport z biegu. Brakuje jednego — agent nie zna jeszcze twoich konwencji. To temat następnej lekcji."

**Rezultat:** Kursant rozumie verification.md jako plikowy kontrakt post-exec gate, nie jako jednorazowy log. Wie, że bridge do m1-l4 to agent onboarding.

**Most do tekstu:** Odpowiada zamknięciu sekcji "verification.md" i bridge out do m1-l4 ("projekt na dysku, agent głuchy").

## Pre-production TODO

### For `conversation-review` segments:

- [ ] Potwierdzić, że `verification.md` z biegu nagranego dla video-permission-prompts.md istnieje w `context/changes/bootstrap-verification/verification.md`.
- [ ] Przejrzeć treść raportu — zanotować, które fazy mają jakie statusy. Jeśli wszystko `passed`, przygotować fallback z `warned`.
- [ ] Przygotować fallbackowy `verification.md` z następującymi statusami:
  - Phase 1: `warned` (starter ostatnio publikowany > 6 miesięcy temu)
  - Phase 2: `passed`
  - Phase 3: `warned` (npm audit z 2 moderate findings)
  - Ten fallback służy do demonstracji różnic między fazami — użyć jako wstawkę, jeśli główny raport ma same `passed`.
- [ ] Zaplanować, które fragmenty raportu podświetlić w edytorze (statusy, severity tiers, opisy faz).
- [ ] Przygotować notatki z kluczowymi komentarzami do każdego segmentu — wideo jest conversation-review, ale prowadzący musi mieć czytelny plan, co powiedzieć przy każdym statusie.

### General:

- [ ] Czcionka edytora na czytelną wielkość — `verification.md` ma dużo tekstu, musi być czytelny na nagraniu.
- [ ] Jeśli raport jest bardzo długi — przygotować code folding, żeby pokazywać po jednej fazie naraz.
- [ ] Wideo po montażu: ~3 minuty. Nie rozciągać — to review, nie demo.
- [ ] Nagrywać PO video-permission-prompts.md — potrzebujemy realnego `verification.md` z tego biegu.

## Video/text mismatches

- Draft nie opisuje dokładnego wyglądu `verification.md` (nie ma full-text przykładu) — wideo pokaże realny plik, który może różnić się formatowaniem od opisu w tekście. To oczekiwana różnica medium, nie mismatch merytoryczny.
- Draft mówi o `phase_3_status: failed` w kontekście HARD-STOP — wideo prawdopodobnie nie pokaże `failed` (jeśli bieg się udał). Różnica pokryta przez tekst Deep Dive (HARD-STOP semantics), nie przez wideo.

## Claims introduced only in video

- Heurystyka "critical = pauza teraz, reszta = zanotuj" — draft mówi ogólniej ("warned w Phase 1 to powód do pauzy, warned w Phase 3 to późniejsza decyzja"). Wideo doprecyzowuje regułę o `critical` severity tier. To operacjonalizacja, nie nowy claim.

## Needs human decision

- **Zawartość realnego verification.md:** Jeśli bieg bootstrappera z video-permission-prompts.md da same `passed` — czy używamy fallbackowego raportu z `warned`, czy komentujemy "wszystko przeszło, ale pokażę ci, jak wygląda warned"? Rekomendacja: użyć split-screena z fallbackiem w Segmencie 2.
- **Głębokość omówienia npm audit:** Czy prowadzący powinien nazwać konkretne CVE/pakiety widoczne w raporcie, czy zostać na poziomie severity tiers? Rekomendacja: severity tiers only — konkretne CVE są nietrwałe i odciągają od wzorca.
- **Format verification.md w 10x-toolkit:** Dokładna struktura faz i statusów zależy od aktualnej wersji bootstrappera — zweryfikować wobec `references/verification-log-schema.md` w 10x-toolkit przed nagraniem.
