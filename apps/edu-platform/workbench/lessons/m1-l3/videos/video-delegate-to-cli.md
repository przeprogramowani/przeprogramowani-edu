# Video Scenario: m1-l3 — Dlaczego agent nie pisze projektu sam

## Cel wideo

Pokazać kontrast między agentem generującym projekt z pamięci a agentem delegującym do autorytatywnego CLI. Wideo musi dostarczyć wizualny dowód, że ta sama robota wykonana dwoma sposobami daje jakościowo różny wynik — i że różnica jest widoczna w pierwszych 30 sekundach. Lewy panel: agent improwizuje boilerplate ze stałymi zależnościami. Prawy panel: `/10x-bootstrapper` deleguje do `npm create astro@latest` i dostaje bieżącą wersję w pół minuty. Zamknięcie: "To samo zadanie, inny wynik. Jeden zdelegował, drugi improwizował."

## Założenia

- Kursant przeczytał sekcję "Dlaczego agent nie pisze projektu sam" w drafcie — wie, że istnieje reguła delegacji. Wideo daje mu dowód wizualny.
- Lewy panel (agent improwizuje) jest **pre-recorded** — nie nagrywamy tego live, bo zachowanie modelu jest niedeterministyczne. Potrzebujemy pewności, że `package.json` będzie miał stałe dependencies.
- Prawy panel (bootstrapper) może być live lub pre-recorded. Jeśli pre-recorded — użyć output z biegu nagrywanego dla video-permission-prompts.md.
- Wideo jest krótkie: 90-120 sekund po montażu. Nie ma miejsca na wyjaśnienia — kontrast mówi sam za siebie.
- Wideo nie konfiguruje uprawnień, nie edytuje settings.json, nie pokazuje verification.md — to inne wideo.

## Materiały i setup nagrania

- Repo/projekt: czysty katalog dla lewego panelu (agent improwizuje), 10xCards z `tech-stack.md` dla prawego panelu (bootstrapper).
- Narzędzie główne: Claude Code w terminalu.
- Pliki startowe: lewy panel — pusty katalog; prawy panel — `prd.md` i `tech-stack.md` w `context/foundation/`.
- Pliki tworzone/edytowane: lewy panel — wygenerowane pliki projektu ze stałymi dependencies; prawy panel — scaffoldowane repo z bieżącymi dependencies.
- Stan fallback: lewy panel musi być pre-recorded. Jeśli agent nie wygeneruje stałe dependencies w pierwszym podejściu, powtórzyć z promptem ogólnym ("Stwórz mi projekt Astro z auth") do momentu, aż output jest przekonujący. Alternatywnie: przygotować sfabrykowany `package.json` z `"astro": "^4.0.0"` jako worst-case insert dla post-produkcji.
- Ryzyka live demo: (1) agent może wygenerować poprawne dependencies — dlatego lewy panel MUSI być pre-recorded i wybrany z najgorszego outputu; (2) prawy panel — sieć wymagana dla `npm create`; (3) jeśli oba panele wyświetlają się jednocześnie, rozdzielczość może być zbyt mała — rozważyć sekwencyjne wyświetlanie z "split-screen" w montażu.

## Segment 1 — Lewy panel: agent improwizuje

**Format:** `conversation-review`

**Cel:** Pokazać, co dostaje kursant, gdy poprosi agenta o stworzenie projektu z głowy — bez delegacji do CLI.

**Na ekranie:**

- Terminal Claude Code.
- Prompt użytkownika: "Stwórz mi projekt Astro z podstawową konfiguracją".
- Agent generuje pliki — widoczny `package.json` z `"astro": "^4.0.0"` lub inną stałą wersją.

**Przebieg:**

1. Prowadzący wpisuje (lub pokazuje wpisany) prompt: "Stwórz mi projekt Astro z podstawową konfiguracją."
2. Agent odpowiada — generuje `package.json`, `astro.config.mjs`, strukturę katalogów.
3. Prowadzący otwiera wygenerowany `package.json` i podkreślona zostaje wersja Astro: `"astro": "^4.0.0"` (lub inna stała wersja z danych treningowych).
4. Krótki komentarz: "Wersja sprzed roku. Agent napisał to z pamięci — a pamięć ma datę ważności."

**Rezultat:** Na ekranie widać konkretny `package.json` ze stałym dependency — dowód, że generowanie z głowy daje przestarzały wynik.

**Most do tekstu:** Odpowiada sekcji "Dlaczego agent nie pisze projektu sam" — konkretnie akapitowi o `"astro": "^4.0.0"` w `package.json`.

## Segment 2 — Prawy panel: bootstrapper deleguje

**Format:** `live-demo`

**Cel:** Pokazać ten sam wynik (projekt Astro) osiągnięty przez delegację do `npm create astro@latest` — z bieżącymi dependencies.

**Na ekranie:**

- Terminal Claude Code z katalogiem 10xCards.
- `/10x-bootstrapper` — bootstrapper wołał `npm create astro@latest`.
- Widoczny output: scaffold ukończony, `package.json` z bieżącą wersją Astro.

**Przebieg:**

1. Prowadzący pokazuje (lub wpisuje) `/10x-bootstrapper` w katalogu z `tech-stack.md`.
2. Bootstrapper czyta `tech-stack.md`, wywołuje `npm create astro@latest`.
3. Scaffold kończy się w ~30 sekund.
4. Prowadzący otwiera wygenerowany `package.json` — podkreślona wersja Astro: `"astro": "^5.x.x"` (bieżąca).
5. Krótki komentarz: "Ta sama robota. Trzydzieści sekund. Bieżąca wersja."

**Rezultat:** Na ekranie widać `package.json` z aktualną wersją — kontrast z lewym panelem jest oczywisty.

**Most do tekstu:** Odpowiada sekcji "Dlaczego agent nie pisze projektu sam" — drugiemu terminalu z VIDEO PLACEHOLDER w drafcie.

## Segment 3 — Kontrast i zamknięcie

**Format:** `hybrid` (split-screen obu wyników + prowadzący komentuje)

**Cel:** Zestawić oba wyniki obok siebie i nazwać regułę.

**Na ekranie:**

- Split-screen: lewy panel (`package.json` ze stałymi deps) vs. prawy panel (`package.json` z bieżącymi deps).
- Opcjonalnie: podświetlone różnice w wersjach.

**Przebieg:**

1. Na ekranie oba `package.json` obok siebie. Wersje Astro podświetlone.
2. Prowadzący: "To samo zadanie, inny wynik. Jeden zdelegował do autorytatywnego CLI, drugi improwizował z pamięci."
3. Zamknięcie jednym zdaniem: "Zanim każesz agentowi pisać boilerplate — zapytaj, czy istnieje CLI, które to zrobi za niego."
4. Koniec wideo. Brak przejścia do innych tematów.

**Rezultat:** Kursant ma wizualny dowód reguły delegacji i jedno zdanie do zapamiętania.

**Most do tekstu:** Odpowiada blockquote'owi reguły w drafcie: "Jeśli istnieje autorytatywne CLI, które robi twoje zadanie — agent ma do niego zdelegować, nie wygenerować z głowy."

## Pre-production TODO

### For `conversation-review` segments (lewy panel):

- [ ] Pre-recorded sesja: wpisać "Stwórz mi projekt Astro z podstawową konfiguracją" w Claude Code z czystym kontekstem (brak CLAUDE.md, brak settings.json z regułami).
- [ ] Zweryfikować, że wygenerowany `package.json` zawiera **stałą wersję** Astro (np. `^4.0.0` lub `^4.x`). Jeśli agent wygeneruje bieżącą wersję — powtórzyć z innym promptem lub innym modelem. Alternatywnie: użyć starszego snapshottu danych treningowych.
- [ ] Jeśli nie uda się uzyskać stałej wersji organicznie — przygotować sfabrykowany `package.json` z `"astro": "^4.0.0"` jako fallback do wstawienia w post-produkcji z adnotacją "symulowany wynik typowy dla generowania z pamięci".
- [ ] Nagranie lewego panelu musi być krótkie — max 20 sekund ekranowych po montażu.
- [ ] Bookmarkuj moment, w którym `package.json` jest widoczny — to kluczowy frame do split-screena.

### For `live-demo` segments (prawy panel):

- [ ] Użyć output z biegu bootstrappera nagranego dla video-permission-prompts.md — jeśli wideo zostało nagrane wcześniej, wyciągnąć fragment z widocznym `package.json`.
- [ ] Alternatywnie: nagrać osobny, krótki bieg bootstrappera wyłącznie na potrzeby tego wideo.
- [ ] Zweryfikować, że `npm create astro@latest` generuje wersję Astro 5.x w dniu nagrania.
- [ ] Bookmarkuj moment, w którym `package.json` jest widoczny — do split-screena.

### General:

- [ ] Split-screen może być zmontowany w post-produkcji — nie wymaga jednoczesnego nagrywania obu paneli.
- [ ] Rozważyć dodanie prostej animacji podświetlającej różnice w wersji Astro (np. czerwony highlight na `^4.0.0`, zielony na `^5.x.x`).
- [ ] Całe wideo po montażu: 90-120 sekund. Nie rozciągać.
- [ ] Tekst zamknięcia ("To samo zadanie, inny wynik...") może być nagrany jako voiceover bez dodatkowego ekranu — lub prowadzący na kamerze.

## Video/text mismatches

- Draft używa `"astro": "^4.x"` jako przykładu stałej wersji — wideo powinno użyć konkretnej wersji widocznej w pre-recorded outputcie (np. `"^4.0.0"` lub `"^4.16.3"`). Różnica kosmetyczna, ale wersja w wideo musi być *realna*, nie sformatowana jako wzorzec.
- Draft mówi "30-sekundowa wstawka" — wideo jest dłuższe (90-120s po montażu) ze względu na konieczność pokazania obu paneli. To rozszerzenie, nie zmiana meritum.

## Claims introduced only in video

- (none) — wideo wizualizuje claim już obecny w drafcie (stałe dependencies z generowania vs. bieżące z CLI).

## Needs human decision

- **Fallback na sfabrykowany package.json:** Jeśli model w dniu nagrania wygeneruje poprawną wersję Astro 5.x — lewy panel traci kontrast. Decyzja: czy sfabrykowany output jest akceptowalny, czy szukamy innego przykładu stałego dependency (np. React, Tailwind)?
- **Kolejność nagrywania:** Prawy panel może być reusem z video-permission-prompts.md. Potwierdzić, czy materiał z tamtego nagrania jest wystarczająco krótki i czytelny do wycięcia fragmentu.
- **Wersja Astro w dniu nagrania:** Jeśli Astro 6.x wyjdzie przed nagraniem, `^5.x.x` na prawym panelu nadal będzie "stary vs nowy" względem lewego panelu z `^4.0.0`. Ale jeśli lewy panel też da `^5.x`, kontrast znika — dlatego pre-recording lewego panelu jest krytyczny.
