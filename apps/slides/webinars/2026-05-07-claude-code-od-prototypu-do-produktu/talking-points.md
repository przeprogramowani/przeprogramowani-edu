# Claude Code dla Product Builderów — od prototypu do produktu

**Data:** TBD · **Czas:** ~90 min + Q&A · **Format:** guided walkthrough + live demo
**Teza:** Lovable i Replit kończą się tam, gdzie zaczyna się produkt. Claude Code zamienia prototyp w software — bo działa na twoim systemie, daje kontrolę nad stackiem i jest programowalny.
**Takeaway:** Zainstaluj CC, stwórz CLAUDE.md, napisz swój pierwszy Skill.

---

## 0. Hook: "Masz prototyp — i co teraz?" (0–5 min)

**Slajd:** split screen — Lovable preview vs terminal z CC. Podpis: "Piękny ≠ gotowy"

**Cel sekcji:** zbudować napięcie — prototyp wygląda gotowo, ale nim nie jest

**Talking points:**
- zbudowałeś stronę w Lovable albo Replit — wygląda świetnie, klient mówi "super"
- potem chcesz dodać auth, formularz z walidacją serwerową, testy, CI/CD — i narzędzie się kończy
- to nie wada Lovable — to granica prototypu; każde narzędzie ma swój sufit
- pytanie na dziś: jak przejść z "działa na demie" na "można na tym zarabiać"?

**Przejście:** Jest narzędzie, które zaczyna tam, gdzie Lovable się kończy. Poznajcie Claude Code.

---

## 1. CC vs Lovable vs Replit — jasne porównanie (5–15 min)

**Slajd:** tabela 3 kolumny: Lovable / Replit / Claude Code — wiersze: środowisko, stack, hosting, custom logic, sufit, próg wejścia

**Cel sekcji:** dać uczciwy framework — kiedy co wybrać, bez "CC jest najlepszy"

**Talking points:**

### Lovable
- przeglądarka, visual builder, natychmiastowy hosting
- świetny do mockupów i demo klienckich
- sufit: auth, custom API, CI/CD, wybór stacku

### Replit
- przeglądarka + agent, hosting wbudowany
- lepszy od Lovable do prototypów z backendem
- sufit: DevOps, enterprise, własne środowisko

### Claude Code
- twój komputer, twój stack, twoje repo — pełna kontrola
- sufit: wymaga terminala lub desktop app; wymaga wiedzy, co chcesz zbudować

### Przewagi CC
- dowolny stack technologiczny (Astro, Next, Svelte, Django — cokolwiek)
- pełna kontrola nad kodem — nie jesteś zamknięty w platformie
- production-ready: testy, CI/CD, review, deploy — cały pipeline
- programowalny przez Skille (o tym za chwilę)

### Koszt CC
- musisz wiedzieć, czego chcesz — CC nie zgadnie za ciebie
- nie ma visual buildera — opisujesz słowami
- krzywa wejścia stroma bez doświadczenia z terminalem (desktop app ją spłaszcza)

### Realna perspektywa
- devowie z AI byli 19% wolniejsi niż myśleli (METR, 2025) — narzędzie nie zastąpi myślenia
- ścieżka: Lovable/Replit → przenieś do CC, gdy produkt rośnie

**Przejście:** Widzicie różnice w tabeli. Teraz wejdźmy głębiej — czym dokładnie jest Claude Code?

---

## 2. Czym jest Claude Code (15–22 min)

**Slajd:** diagram — "Gdzie żyje twoje narzędzie?" — Lovable (przeglądarka) / Replit (przeglądarka + hosting) / Claude Code (twój system operacyjny)

**Cel sekcji:** zrozumieć, czym CC jest, gdzie działa i dlaczego to zmienia zasady gry

**Talking points:**
- CC to agent AI — nie chatbot, nie autocomplete; sam czyta, planuje, działa, weryfikuje
- dostępny w dwóch formach:
  - **terminal (CLI)** — pełna moc, integracja z git, skryptami, CI
  - **aplikacja desktopowa** (Mac/Windows) — ten sam silnik, łatwiejszy start
- CC działa **na twoim systemie operacyjnym** — nie w sandboxie przeglądarki
  - ma dostęp do twojego kodu, plików, terminala, gita
  - może uruchamiać build, testy, linter — cokolwiek, co ty byś uruchomił
- kluczowa różnica: Lovable i Replit działają w izolowanym środowisku w chmurze; CC działa tam, gdzie ty
- CC planuje zanim napisze — Plan Mode to wbudowany tryb (agent wypisuje plan, czeka na akceptację)

**Przejście:** Teoria za nami. Zobaczmy, jak to wygląda w praktyce — zaczynamy od zera.

---

## 3. CLAUDE.md — kontekst jest królem (22–30 min)

**Slajd:** screenshot realnego CLAUDE.md — widoczna struktura sekcji

**Cel sekcji:** zrozumieć, że CC jest tak dobry, jak kontekst, który mu dasz

**Talking points:**
- zanim napiszemy linijkę kodu — CC musi wiedzieć, z czym pracuje
- CLAUDE.md = instrukcja dla AI: jak działa projekt, jaki stack, jakie konwencje
- analogia: onboarding doc dla nowego pracownika — bez niego losowe wyniki
- agenty AI czytają 5–6× więcej niż piszą (Moderne, 2026) — kontekst > prompt
- produkcyjny CLAUDE.md ma kilkaset linii i żyje w repo razem z kodem
- to nie README — to dokument operacyjny

**Moment show:** **→ Demo A** — walkthrough prawdziwego CLAUDE.md: struktura, co każda sekcja robi

**Przejście:** Kontekst gotowy. Teraz budujemy.

---

## 4. Demo: od Astro startera do 10xShoes landing page (30–42 min)

**Slajd:** split screen — terminal po lewej, browser preview po prawej

**Cel sekcji:** zobaczyć, że CC buduje realny kod z realnym stackiem — na jednym przykładzie, który przeprowadzimy przez resztę webinaru

**Talking points:**
- startujemy z 10x-astro-starter — nowoczesny szablon z Astro, Tailwind, TypeScript
- scenariusz: budujemy landing page dla **10xShoes** — fikcyjna marka butów, nowa linia, strona do walidacji zainteresowania
- jedno zdanie do CC → hero section, prezentacja produktu, sekcje z cechami linii
- CC planuje zanim napisze — pokazujemy Plan Mode:
  - agent wypisuje plan, czeka na akceptację, dopiero potem pisze kod
- to nie mockup — masz pełny kod, wersjonowany w git, gotowy do deploy
- różnica vs Lovable: tam edytujesz wizualnie, tu opisujesz co chcesz — za to masz pełną kontrolę
- ten landing page będzie naszym poligonem przez resztę webinaru

**Moment show:** **→ Demo B** — od promptu do działającego landing page'a 10xShoes z Plan Mode

**Przejście:** Mamy stronę 10xShoes. Teraz pokażę wam coś, co zmienia sposób pracy z AI — Skille.

---

## 5. Skille — programowalne AI (42–52 min)

**Slajd:** diagram — plik skill.md → agent czyta → zmienia zachowanie. Podpis: "Twój proces → plik markdown → AI go wykonuje"

**Cel sekcji:** zrozumieć, że Skille to główna przewaga CC nad innymi narzędziami

**Talking points:**
- Skille to pliki markdown, które zmieniają zachowanie agenta
- nie chodzi o dostęp do narzędzi (to MCP) — chodzi o **zmianę procesu pracy**
- „eksplozja kambryjska Skills > MCP" (Willison, 2025)
- analogia: lista kontrolna dla chirurga — AI ją czyta i wykonuje automatycznie
- twój powtarzalny proces → plik markdown → AI go wykonuje za ciebie
- Skille są reużywalne — raz napisany, działa w każdym projekcie
- dwa rodzaje, które pokażemy:
  1. **Skill jakościowy** — pilnuje standardów (build, lint, testy, review)
  2. **Skill ficzerowy** — buduje funkcjonalność według twoich reguł

**Przejście:** Zobaczmy to w akcji. Zaczynamy od skilla ficzerowego.

---

## 6. Demo: Skill ficzerowy — formularz preorder 10xShoes (52–65 min)

**Slajd:** split screen — terminal z CC + preview formularza preorder w przeglądarce

**Cel sekcji:** zobaczyć, jak Skill prowadzi agenta przez złożoną funkcjonalność

**Talking points:**
- 10xShoes ma landing page — ale brakuje kluczowej rzeczy: sposobu na zebranie zainteresowania
- chcemy formularz preorder — "Zostaw e-mail, damy znać o premierze":
  - walidacja po stronie klienta (UX — natychmiastowy feedback)
  - walidacja po stronie serwera (bezpieczeństwo — nie ufaj przeglądarce)
  - obsługa błędów, komunikat sukcesu
  - zgodny ze stackiem projektu (Astro + Svelte)
- Skill ficzerowy definiuje: jak budować formularze w tym projekcie
  - jaką bibliotekę do walidacji
  - jak strukturyzować API endpoint
  - jak obsługiwać błędy
  - jak testować
- agent czyta skilla i buduje formularz krok po kroku — spójnie z resztą projektu
- efekt: 10xShoes ma stronę + formularz preorder — gotowe do zbierania leadów

**Moment show:** **→ Demo D** — agent buduje formularz preorder 10xShoes, prowadzony przez skill ficzerowy

**Przejście:** Mamy działającą funkcjonalność. Ale czy ten kod jest dobry? Tu Lovable się kończy.

---

## 7. Demo: Skill jakościowy na kodzie 10xShoes (65–75 min)

**Slajd:** terminal — output z builda, linta, testów, astro check, code review

**Cel sekcji:** zobaczyć, jak jeden Skill zastępuje manualny pipeline QA — tu Lovable się kończy, bo nie pozwala precyzyjnie kontrolować jakości

**Talking points:**
- wracamy do kodu 10xShoes — CC właśnie wygenerował landing page i formularz, ale czy ten kod jest dobry?
- piszemy skilla, który po każdej zmianie uruchamia pipeline:
  1. `npm run build` — czy się kompiluje?
  2. linter — czy kod jest spójny?
  3. testy — czy nic nie zepsuliśmy?
  4. `astro check` — czy typy się zgadzają?
  5. szybkie code review — czy kod ma sens?
- to nie jest CI/CD — to dzieje się lokalnie, przed commitem
- agent czyta wynik każdego kroku i decyduje, co dalej:
  - build się wysypał → agent czyta błąd i naprawia
  - test nie przechodzi → agent analizuje i fixuje
- jeden plik markdown — cały pipeline jakościowy
- tu Lovable się kończy — nie daje ci narzędzi do precyzyjnej kontroli jakości kodu
- efekt: kod 10xShoes przechodzi przez ten sam proces, co kod produkcyjny

**Moment show:** **→ Demo C** — agent uruchamia skill jakościowy na kodzie 10xShoes, napotyka problem, naprawia, puszcza ponownie

**Przejście:** Widzieliście dwa Skille na jednym projekcie. Wyobraźcie sobie: skill do code review, do migracji, do testów, do deploymentu. Każdy proces, który powtarzacie — zamieniacie w plik markdown.

---

## 8. Higiena pracy z CC (75–80 min)

**Slajd:** diagram — okno kontekstowe jako pojemnik zapełniający się tokenami, znaczniki na 150k i 200k

**Cel sekcji:** praktyczne nawyki — bez nich efektywność i budżet spadają

**Talking points:**
- CC działa najlepiej ze świeżym kontekstem — pełne okno = wolniej, drożej
- `/context` — ile okno jest zapełnione; `/usage` — zużycie w 5-godzinnym oknie
- reguła: nowy wątek po każdym zadaniu lub przy 150–200k tokenów
- eksternalizacja pamięci: przed zamknięciem → zrzuć wiedzę do pliku
- nowy wątek + plik = świeży kontekst z wiedzą z poprzedniej sesji
- cennik: Pro $20/mies., Max $100–200/mies. — limity podwojone V 2026

**Przejście:** Czas zamknąć. Co zabieracie do domu?

---

## 9. Zamknięcie (80–84 min)

**Slajd:** ciemne tło, jeden CTA: "Zainstaluj CC. Stwórz CLAUDE.md. Napisz swój pierwszy Skill."

**Cel sekcji:** jedna akcja na poniedziałek

**Talking points:**
- Lovable buduje mockupy. CC buduje software.
- CC to nie tylko terminal — desktop app obniża próg wejścia
- największa moc CC: Skille — twój proces zamieniony w plik markdown, który AI wykonuje
- poniedziałkowa akcja: zainstaluj CC, stwórz CLAUDE.md, napisz skill jakościowy z 3 krokami
- pytania?

---

## 10. Q&A (84–90+ min)

**Slajd:** kontaktowe info + link do CC docs

**Talking points:**
- otwarta runda — pytania z czatu i na żywo
- jeśli pytanie wymaga demo: host odpala terminal ad hoc
- FAQ: cennik, limity, Plan vs Max, desktop vs terminal

---

## Źródła wspomniane w webinarze

- [Moderne — Context Engineering](https://www.moderne.ai/blog/context-engineering-why-ai-coding-agents-spend-most-of-their-tokens-reading-not-writing) — sekcja 3, "5–6× więcej czytania"
- [Simon Willison — Claude Skills (2025-10-16)](https://simonwillison.net/2025/Oct/16/claude-skills/) — sekcja 5, "Cambrian explosion"
- [METR — AI developer study (2025-07-10)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) — sekcja 2, "19% slower"
- [Anthropic — How Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code) — kontekst
- [Anthropic — Higher limits + SpaceX (2026-05-06)](https://www.anthropic.com/news/higher-limits-spacex) — sekcja 8, cennik
