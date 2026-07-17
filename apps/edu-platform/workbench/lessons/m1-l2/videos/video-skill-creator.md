# Video Scenario: m1-l2 — Tworzenie własnych skilli (dwie ścieżki)

## Cel wideo

Pokazać, że tworzenie własnego skilla jest proste — wystarczy otworzyć sesję z modelem frontier i opisać kontrakt. Następnie pokazać, że `skill-creator` z evalami to upgrade dla skilli współdzielonych lub łańcuchowych, ale z jawnym tradeoffem: domyślne evale są zwykle zbyt korzystne dla nowej wersji, a zaprojektowanie dobrego evalu wymaga zrozumienia, co weryfikujesz.

Wideo ma dwa akty: (1) ścieżka rozmowy jako punkt wejścia, (2) ścieżka `skill-creator` z evalami jako upgrade. Kursant wychodzi z wiedzą, że obie drogi istnieją i kiedy po którą sięgnąć.

## Założenia

- Kursant widział już `video-skill-vs-prompt` — zna anatomię SKILL.md, rozumie różnicę między skillem a promptem, widział `/10x-tech-stack-selector` w działaniu.
- `skill-creator` jest zainstalowany lokalnie (`~/.claude/skills/skill-creator/`).
- Demo używa `/10x-bootstrapper` jako target — kontrakt wejściowy (`tech-stack.md`) i kontrakt wyjściowy (scaffolded project + `verification.md`) są znane z kontekstu lekcji.
- Narzędzie główne: Claude Code.

## Materiały i setup nagrania

- Repo/projekt: dowolny katalog roboczy (może być `10xCards` lub tymczasowy folder).
- Narzędzie główne: Claude Code w terminalu + VS Code do przejrzenia wygenerowanych plików.
- Pliki startowe: brak (oba ścieżki tworzą nowy SKILL.md).
- Pliki tworzone/edytowane: wygenerowany SKILL.md (np. `.claude/skills/bootstrapper-demo/SKILL.md`).
- Fallback: przygotowany SKILL.md wygenerowany wcześniej — zarówno przez rozmowę (ścieżka 1), jak i przez `skill-creator` (ścieżka 2). Jeśli live demo ciągnie się za długo, prowadzący podmienia na fallback.
- Ryzyka live demo:
  - Agent może wygenerować SKILL.md o innej strukturze niż oczekiwana — prowadzący komentuje "as is".
  - `skill-creator` może zadać wiele pytań interaktywnych — prowadzący ma przygotowane odpowiedzi.
  - Czas trwania niedeterministyczny — limity: ~3 minuty na ścieżkę 1, ~4 minuty na ścieżkę 2.

## Segment 1 — Ścieżka rozmowy: opisz kontrakt, dostaniesz SKILL.md

**Format:** `live-demo`
**Czas:** 3-4 minuty raw → 2-3 minuty po montażu

**Cel:** Pokazać, że do stworzenia skilla wystarczy sesja z agentem i opis kontraktu. Żadna specjalna infrastruktura.

**Na ekranie:**

- Claude Code w terminalu.

**Przebieg:**

1. Prowadzący otwiera nową sesję Claude Code i mówi: "Chcę pokazać wam, jak prosto jest stworzyć własnego skilla. Nie potrzebuję do tego żadnego specjalnego narzędzia — wystarczy rozmowa z agentem."
2. Wpisuje prompt w stylu:

   ```
   Napisz mi SKILL.md dla skilla /10x-bootstrapper.

   Kontrakt wejścia: czyta context/foundation/tech-stack.md
   z frontmatter (starter_id, bootstrapper_confidence, flagi has_auth/has_ai).

   Kontrakt wyjścia: scaffolded project w cwd + verification.md
   w context/changes/bootstrap-verification/.

   Workflow: sprawdź czy tech-stack.md istnieje, wyciągnij starter_id,
   uruchom CLI startera, zweryfikuj wynik przez npm audit.
   ```

3. Agent generuje SKILL.md. Prowadzący czeka na wynik (~30-60 sekund).
4. Prowadzący otwiera wygenerowany plik w VS Code. Krótki przegląd:
   - "Jest `description` — agent wie, kiedy po to sięgnąć."
   - "Jest workflow z trzema krokami — mniej więcej to, co opisałem."
   - "Ale brakuje szczegółów weryfikacji i nie ma referencji do rejestru starterów. To muszę dopowiedzieć."
5. Prowadzący wraca do Claude Code: "Dodaj do SKILL.md referencję na `references/starter-registry.yaml` i rozbuduj krok weryfikacji o sprawdzenie exit code CLI."
6. Agent aktualizuje plik. Prowadzący pokazuje diff.
7. Podsumowanie: "Dwie iteracje i mam działający szkielet. Dla skilla pod siebie — to wystarczy. Czytam, testuję, poprawiam."

**Rezultat:** Widz widzi, że próg wejścia to dosłownie "opisz co wchodzi, co wychodzi" — i agent pisze SKILL.md.

**Most do tekstu:** Odpowiada sekcji "Ścieżka 1: rozmowa z modelem" w Deep Dive.

## Segment 2 — Ścieżka skill-creator: strukturalne podejście z evalami

**Format:** `live-demo`
**Czas:** 4-5 minut raw → 3-4 minuty po montażu

**Cel:** Pokazać, że `skill-creator` daje więcej struktury i opcjonalnie evale, ale kosztem czasu i z tradeoffem jakości domyślnych ewalów.

**Na ekranie:**

- Claude Code w terminalu.

**Przebieg:**

1. Prowadzący: "A co, jeśli ten skill ma być częścią dłuższego łańcucha albo używa go ktoś poza mną? Wtedy chcę bardziej systematyczne podejście. Anthropic publikuje meta-skill `skill-creator`."
2. Prowadzący uruchamia `skill-creator` z promptem opisującym kontrakt `/10x-bootstrapper` (ten sam co w segmencie 1, ale przez skill-creator).
3. `skill-creator` generuje SKILL.md — prowadzący porównuje z wynikiem z rozmowy: "Struktura jest bardziej formalna — jest frontmatter z `allowed-tools`, są placeholdery na referencje."
4. Kluczowy moment — evale: "Skill-creator może wygenerować też zestaw ewalów — automatycznych testów, które sprawdzają, czy skill produkuje poprawne wyniki."
5. Prowadzący pokazuje wygenerowane evale (jeśli skill-creator je produkuje) lub opisuje koncept: "Eval uruchamia skilla na przykładowym wejściu i sprawdza, czy wyjście spełnia kryteria."
6. **Tradeoff — prowadzący mówi wprost:** "Evale dają powtarzalność. Ale mają cenę. Każdy eval to wywołanie modelu — kosztuje czas i pieniądze. I jest pułapka: domyślne evale generowane przez skill-creator są zwykle *zbyt korzystne dla nowej wersji*. Testują to, co nowa wersja robi dobrze — nie to, co *powinna* robić dobrze. Żeby eval naprawdę chronił jakość, musisz go zaprojektować pod granice i edge case'y kontraktu, nie pod happy path. To trudniejsze niż napisanie samego skilla."
7. Podsumowanie: "Skill-creator to upgrade, nie punkt wejścia. Zaczynasz od rozmowy. Kiedy skill dojrzewa albo dzielisz go z innymi — dorzucasz evale."

**Rezultat:** Widz rozumie tradeoff: evale dają powtarzalność, ale wymagają inwestycji i świadomego projektowania.

**Most do tekstu:** Odpowiada sekcji "Ścieżka 2: `skill-creator` z evalami" w Deep Dive.

## Segment 3 — Porównanie i zamknięcie

**Format:** `conversation-review`
**Czas:** 2 minuty raw → 1-2 minuty po montażu

**Cel:** Postawić obok siebie obie ścieżki, dać kursantowi jasną regułę decyzyjną i zamknąć z heurystyką trzeciego promptu.

**Na ekranie:**

- VS Code z oboma SKILL.md obok siebie (split view) lub terminal z podsumowaniem.

**Przebieg:**

1. Prowadzący pokazuje oba pliki obok siebie: "Lewy — z rozmowy. Prawy — ze skill-creatora. Oba robią to samo. Różni się formalność i czy mam evale."
2. Reguła decyzyjna:
   - "Skill pod siebie → rozmowa. Szybko, tanio, wystarczająco dobrze."
   - "Skill dla zespołu lub jako ogniwo łańcucha → skill-creator z evalami. Więcej pracy, ale przewidywalność przy zmianach."
   - "Naturalna progresja: zaczynasz od rozmowy, kiedy skill dojrzewa — dorzucasz evale."
3. Heurystyka trzeciego promptu: "Łapiecie się na pisaniu trzeciego promptu robiącego to samo? Otwórzcie sesję z agentem i powiedzcie mu, co wchodzi i co wychodzi. Nie potrzebujecie niczego więcej na start."
4. Bridge: "A teraz — co jeśli nie startujecie z czystą kartą? Brownfield. `/10x-stack-assess`."

**Rezultat:** Widz ma jasny model: rozmowa → skill-creator → evale to progresja, nie wybór binarny.

**Most do tekstu:** Odpowiada sekcji "Którą ścieżkę wybrać?" w Deep Dive i heurystyce trzeciego promptu.

## Pre-production TODO

### For `live-demo` segments (1, 2):

- [ ] `skill-creator` zainstalowany: `ls ~/.claude/skills/skill-creator/SKILL.md`.
- [ ] Dry run ścieżki 1: rozmowa z agentem → SKILL.md → jedna iteracja. Zmierzyć czas.
- [ ] Dry run ścieżki 2: `skill-creator` z tym samym kontraktem. Zmierzyć czas. Sprawdzić, czy generuje evale.
- [ ] Fallback SKILL.md przygotowany dla obu ścieżek (wygenerowany wcześniej).
- [ ] Przygotowane odpowiedzi na pytania interaktywne skill-creatora.
- [ ] Katalog roboczy czysty.
- [ ] Terminal font size >= 16pt.
- [ ] Timing: ścieżka 1 max ~3 min, ścieżka 2 max ~4 min. Po przekroczeniu → fallback.
- [ ] Klucze API ustawione.

### For `conversation-review` segment (3):

- [ ] Oba SKILL.md otwarte w VS Code split view.
- [ ] Talking points do porównania przygotowane.
- [ ] Heurystyka trzeciego promptu jako zamknięcie.

### General:

- [ ] Cały scenariusz przetestowany w dry run — prowadzący nagrywa próbę od segmentu 1 do 3.
- [ ] Zaplanowane okno edycji: 10-14 min raw → 7-9 min edited.
- [ ] Jasny frame: ścieżka 1 to punkt wejścia, ścieżka 2 to upgrade.

## Video/text mismatches

- Draft mówi "Trzy-cztery iteracje" w ścieżce rozmowy — wideo pokazuje jedną iterację z dopisaną referencją. Prowadzący powinien zaznaczyć: "Tu robimy jedną iterację, w praktyce będzie ich kilka."
- Tradeoff ewalowy w tekście jest bardziej rozbudowany niż w wideo — tekst omawia "fundamentalną trudność automatycznej weryfikacji", wideo upraszcza do "domyślne evale są zbyt korzystne". Spójność zachowana — wideo jest skrótem, nie sprzecznością.

## Claims introduced only in video

(none) — wszystkie twierdzenia pokrywają się z tekstem Deep Dive. Wideo operacjonalizuje obie ścieżki.

## Needs human decision

- Czy w segmencie 2 prowadzący powinien pokazać *faktyczne uruchomienie evalu* (eval run z wynikiem pass/fail), czy tylko opisać koncept? Rekomendacja: opisać koncept z pokazaniem wygenerowanego pliku evalu — pełny eval run ciągnie czas i wymaga przygotowanego fixture'a.
- Czy w segmencie 3 split view jest wystarczający, czy prowadzący powinien pokazać diff? Rekomendacja: split view wystarczy — diff między dwoma SKILL.md z różnych ścieżek nie jest informatywny.
- Czy usunąć wygenerowane pliki po nagraniu? Rekomendacja: tak — jasny sygnał, że to demo, nie produkcja.
