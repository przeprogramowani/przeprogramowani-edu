# Slide plan v2 — Claude Code dla Product Builderów

**Źródło:** nowa agenda (3-częściowa) + talking-points.md (treści)
**Struktura:** Fundamenty (slajdy) → Live build (terminal + markery) → Realia + zamknięcie (slajdy)
**Bez MCP** — wycięty, skille ważniejsze
**Cel:** ~20 slajdów, z czego ~10 to markery/przejścia dla sekcji terminalowych

---

## Struktura dekku

| Część | Czas | Slajdy | Charakter |
|-------|------|--------|-----------|
| 1. Fundamenty | 0–20 min | 8–9 | Gęste, slajdowe (hook + porównanie + model mentalny) |
| 2. Live build | 20–75 min | 6–7 | Lekkie markery między demo |
| 3. Realia + zamknięcie | 75–90 min | 5–6 | Slajdowe, mocne zamknięcie |
| Q&A | 90–120 min | 1 | Terminal otwarty |
| **Razem** | | **~22** | |

---

## CZĘŚĆ 1 — Fundamenty (0–20 min)

### Slajd 1 · `title` · TitleSlide
- kicker: "Webinar · 7 maja 2026"
- title: "Claude Code dla Product Builderów — **od prototypu do produktu**"
- meta: teza webinaru
- **[EXISTING — bez zmian]**

### Slajd 2 · `hook` · StatementSlide
- §0 z talking-points — napięcie otwierające
- display: true
- title: "**Piękny ≠ gotowy**"
- subtitle: {"Masz prototyp, klient mówi „super" — a potem chcesz dodać auth, walidację, testy, CI/CD… i narzędzie się kończy."}
- **[EXISTING — bez zmian]**

### Slajd 3 · `comparison` · TableSlide
- §1 z talking-points — uczciwe porównanie
- title: "CC vs Lovable vs Replit — uczciwe porównanie"
- 6 wierszy: środowisko, stack, hosting, custom logic, sufit, próg wejścia
- footer: "Ścieżka: Lovable / Replit → przenieś do CC, gdy produkt rośnie."
- **[EXISTING — bez zmian]**

### Slajd 4 · `what-is-cc` · InsightSlide
- §Rozdz.1 — Czym jest Claude Code
- tag: "Model mentalny" / tone: accent
- title: "**Claude Code** — agentic CLI, nie IDE assistant"
- children:
  - "Czyta, planuje, działa, weryfikuje — sam. Nie chatbot, nie autocomplete."
  - "Terminal (CLI) + aplikacja desktopowa — ten sam silnik"
  - "Dla całej sali: PM, designer, founder, dev"
- image: TODO diagram "gdzie żyje narzędzie" (browser vs cloud vs twój system)
- **[EXISTING — przerobić: wyciąć szczegóły o Plan Mode, dodać framing "dla całej sali"]**

### Slajd 5 · `agent-loop` · StepsSlide · [NEW]
- §Rozdz.2 — Pętla agenta
- title: "Pętla: kontekst → plan → akcja → weryfikacja"
- items:
  - 📖 Kontekst — "Agent czyta 5–6× więcej niż pisze"
  - 📋 Plan — "Planuje zanim napisze (Plan Mode)"
  - ⚡ Akcja — "Pisze kod, odpala build, uruchamia testy"
  - ✓ Weryfikacja — "Sprawdza wynik, naprawia, powtarza"
- progressive reveal (step=1..4) → generuje 4 wpisy w tablicy slajdów
- **Pod spodem:** "powiedz co masz zrobić" nie działa — trzeba dać kontekst

### Slajd 6 · `where-you-end` · StatementSlide · [NEW]
- §Rozdz.2 — "gdzie kończy się model, zaczynasz ty"
- display: true
- title: "Model planuje. **Ty decydujesz.**"
- subtitle: "Akceptujesz plan, odrzucasz, korygujesz. To nie vibe coding."
- **Uzasadnienie:** kluczowy message dla product builderów — to nie jest "AI robi wszystko"

### Slajd 7 · `claude-md` · ImageSlide
- §Rozdz.3 — CLAUDE.md jako artefakt produktowy
- title: "**CLAUDE.md** — kontekst jest królem"
- subtitle: "Onboarding doc dla AI. Nie pusty template — realny plik z produkcji."
- image: TODO screenshot realnego CLAUDE.md
- caption: "→ Demo A: walkthrough na żywo — co wrzucać, czego nigdy"
- **[EXISTING — dodać caption o Demo A, zmienić subtitle na "nie pusty template"]**

### Slajd 8 · `live-build-intro` · SectionSlide · [NEW]
- Przejście do części 2
- label: "60 min · 100% terminal"
- title: "**Live build** od zera"
- **Uzasadnienie:** czytelne cięcie narracyjne — "teoria za nami, teraz budujemy"

---

## CZĘŚĆ 2 — Live build greenfield (20–75 min)

Slajdy tu pełnią rolę markerów między demo — host mówi z terminala, slajd wchodzi na chwilę żeby zasygnalizować nowy rozdział.

### Slajd 9 · `demo-setup` · SkillTheorySlide
- §Rozdz.4 — Setup projektu w 5 min
- demo: "Setup" / tone: accent
- command: "claude"
- title: "Pusty katalog → **działający projekt**"
- points:
  - "claude w pustym katalogu — pierwszy prompt"
  - "Plan Mode: co chcemy zbudować?"
  - "CLAUDE.md generujemy z modelem, tunujemy ręcznie"
- launch: "5 minut od zera do CLAUDE.md + scaffoldu"
- **[NEW — zastępuje stary demo-landing, inny framing]**

### Slajd 10 · `demo-feature` · SkillTheorySlide
- §Rozdz.5 — Pierwszy feature: scaffold + happy path
- demo: "Pierwszy feature" / tone: warm
- command: "dodaj formularz preorder"
- title: "Planowanie zanim kod"
- points:
  - "Referencje do plików, zakresy — nie 'zrób mi formularz'"
  - "Gdy model leci za szybko — jak go zatrzymać"
  - "To jest junior z dostępem do wszystkiego"
- launch: "Walidacja client + server, API endpoint, testy — z jednego promptu"
- **[EXISTING — przerobić: nowy framing "junior z dostępem", inne points]**

### Slajd 11 · `skills-intro` · InsightSlide
- §Rozdz.6 — Skille i /slash na żywo
- tone: accent2
- title: "**Skille** — programowalne AI"
- children:
  - "Twój proces → plik markdown → AI go wykonuje"
  - "Skill ≠ wpis w CLAUDE.md — to zmiana zachowania, nie kontekst"
- **[EXISTING — dodać linijkę o różnicy skill vs CLAUDE.md]**

### Slajd 12 · `demo-skill` · SkillTheorySlide · [NEW]
- §Rozdz.6 — piszemy własny skill na żywo
- demo: "Piszemy skill" / tone: accent2
- command: "/add-endpoint"
- title: "Skill pod nasz projekt — **na żywo**"
- points:
  - "Dodaj endpoint wg naszej konwencji"
  - "Skill definiuje: routing, walidację, error handling, testy"
  - "Agent czyta skilla i buduje spójnie z resztą"
- launch: "Moment 'zaskoczenia' — skill zmienia zachowanie agenta w locie"

### Slajd 13 · `routine-pivot` · StatementSlide · [NEW]
- §Rozdz.8 — Pivot narracji
- display: true
- title: "Agent, który pracuje **gdy ty śpisz**"
- subtitle: {"Hooki reagują na sesję. Routine odpala się sam — codziennie, co tydzień, co 15 min."}
- **Uzasadnienie:** to jest moment kiedy PM/founder widzi CC jako autonomicznego pracownika, nie asystenta

### Slajd 14 · `demo-routine` · SkillTheorySlide · [NEW]
- §Rozdz.8 — Cotygodniowy research konkurencji
- demo: "Routine" / tone: positive
- command: "cron: 0 8 * * 1"
- title: "Research konkurencji — **co poniedziałek o 8:00**"
- points:
  - "Web search: co nowego ogłosili konkurenci"
  - "1 zdanie co zrobili, 1 zdanie czemu to ważne dla nas"
  - "Raport do research/competitors/$(date +%Y-W%V).md"
- launch: "30 sekund konfiguracji. Działa bez MCP, bez deploya."

### Slajd 15 · `routine-usecases` · ListSlide · [NEW]
- §Rozdz.8 — "to samo można zrobić dla X, Y, Z"
- label: "Routine" / labelTone: positive
- title: "Co jeszcze automatyzujesz?"
- items:
  - "**Changelog** — co tydzień zbiera commity i pisze release notes" (tone: accent2)
  - "**Audit zależności** — codziennie sprawdza CVE w package.json" (tone: warm)
  - "**Raport metryczny** — co poniedziałek agreguje dane z dashboardu" (tone: positive)
- footer: "Każdy routine to 1 prompt + 1 cron. Zero infrastruktury."

---

## CZĘŚĆ 3 — Realia + zamknięcie (75–90 min)

### Slajd 16 · `brownfield` · ListSlide · [NEW]
- §Rozdz.9 — Brownfield w 5 min
- label: "Brownfield" / labelTone: accent
- title: {"To co widzieliście, ale w repo z 500k linii"}
- items:
  - "**/init** — Claude poznaje projekt w minuty" (tone: accent2)
  - "**Subagent Explore** — szuka po kodzie za ciebie" (tone: accent)
  - "**Małe PR-y** — nie 2000-liniowe diff, ale chirurgiczne zmiany" (tone: positive, check: true)
- footer: "Linki i materiały na slajdzie zamykającym"

### Slajd 17 · `antipatterns` · ListSlide · [NEW]
- §Rozdz.10 — Antywzorce + granice zaufania
- label: "Czego NIE robić" / labelTone: negative
- title: "Granice zaufania"
- items:
  - "**Vibe loop** — ślepe 'tak, ok, dalej' bez czytania planu" (tone: negative)
  - "**Ślepe zatwierdzanie** — permission mode w zespole ≠ solo" (tone: warm)
  - "**Sekrety w kontekscie** — .env, klucze API, tokeny" (tone: negative)
  - { content: "**Review > trust** — agent to junior, nie senior", check: true } (tone: positive)

### Slajd 18 · `pricing` · InsightSlide · [NEW]
- §8 z talking-points — cennik
- tag: "Cennik" / tone: accent
- title: "Ile to kosztuje?"
- children: Compare z dwoma kolumnami
  - Pro $20/mies. — start, limity na sesję
  - Max $100–200/mies. — podwojone limity V 2026
- **Uzasadnienie:** product builderzy chcą wiedzieć cenę — footer to za mało

### Slajd 19 · `closing` · StatementSlide
- §Wrap
- display: true
- title: "Zainstaluj CC. Stwórz **CLAUDE.md**. Napisz pierwszy **Skill**."
- subtitle: "Desktop app albo terminal. Zacznij od jednego projektu."
- **[EXISTING — zmienić subtitle: dodać desktop app, usunąć "Lovable buduje mockupy"]**

### Slajd 20 · `resources` · ListSlide · [NEW]
- §Wrap — linki i dalsze materiały
- label: "Co dalej" / labelTone: positive
- title: "Materiały i następne kroki"
- items:
  - "**claude.com/code** — instalacja + docs" (tone: accent2)
  - "**Capstone domowy** — zbuduj projekt z CLAUDE.md i 1 skillem" (tone: warm)
  - { content: "**Slajdy i linki** — udostępnimy po webinarze", check: true }

### Slajd 21 · `qa` · TitleSlide
- §Q&A
- kicker: "Q&A"
- title: "**Pytania?**"
- meta: "Terminal otwarty — pytanie zamienia się w mini-demo"
- **[EXISTING — zmienić meta na "terminal otwarty"]**

---

## Podsumowanie

| Typ | Liczba |
|-----|--------|
| [EXISTING — bez zmian] | 3 (title, hook, comparison) |
| [EXISTING — przerobić] | 5 (what-is-cc, claude-md, demo-feature, skills-intro, closing, qa) |
| [NEW] | 13 |
| **Razem** | **21 slajdów** (+ 3 dodatkowe z progressive reveal agent-loop) |

### Co weszło z nowej agendy
- Trójczęściowa struktura (fundamenty → live build → realia)
- Pętla agenta jako StepsSlide z progressive reveal
- "Model planuje. Ty decydujesz." — kluczowy framing
- Skills pisane na żywo (nie gotowe)
- Routines — autonomiczny agent (research konkurencji)
- Brownfield — 3 zasady
- Antywzorce — granice zaufania
- Zasoby i capstone domowy

### Co zostało z talking-points.md
- Hook "Piękny ≠ gotowy" — otwiera napięcie
- Tabela porównawcza Lovable/Replit/CC — uczciwy framework po hooku
- CLAUDE.md z Demo A
- Treść slajdów o skillach (zachowanie vs narzędzia)
- Cennik (teraz osobny slajd, nie footer)
- Struktura SkillTheorySlide dla demo markerów

### Co wypadło
- MCP — świadomie wycięty (skille ważniejsze)
- "Tu Lovable się kończy" jako osobny message — Lovable jest w tabeli i hooku, nie potrzebuje powtórzenia

### Decyzje do podjęcia

1. **Agent-loop progressive reveal** — 4 kroki × osobny slajd = razem 24 slajdy, czy statyczny = 21? Decyzja: Jeden slajd z animacją?
2. **Pricing** — InsightSlide z Compare (Pro vs Max) czy NumberSlide ($20)?  Decyzja: nie wiem, zadecyduj.
3. **Routine przykład** — research konkurencji (z agendy) czy autentyczny routine prelegentów? Decyzja: nie będziemy robili researchu konkurencji, bazujemy na 10xShoes.
4. **Resources slajd** — osobny slajd na linki czy wystarczy w closing? Decyzja: wystarczy closing / Q&A
