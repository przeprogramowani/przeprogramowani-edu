# Research: Claude Code dla Product Builderów — od prototypu do produktu

**Data planowania:** 2026-05-07
**Data webinaru:** TBD
**Slug:** claude-code-od-prototypu-do-produktu

## Wejściowe materiały od autora

> Tytuł roboczy: "Claude Code dla Product Builderów"
> Audience: kursanci aiproductheroes.pl — PM-owie, designerzy, deweloperzy, osoby non-technical
> Wcześniej mieli sesje o Lovable i Replit → webinar CC ma pokazać kontrast: "produktyzacja"
>
> Notatki autora:
> - Czy budować od zera?
> - 10xCards — czym to się różni od NotebookLM?
> - Wspieranie procesów agile'owych (retro / planning poker)
> - Planner do prezentacji
> - Generowanie obrazków do prezentacji
> - 10x-Astro-Starter jako baza do budowania
> - Assumptions test — tworzymy landing page do smoke testów
> - Rough idea: budowanie na bazie Lovable
> - Zależności: wcześniej będzie Lovable i Replit → pokazanie kontrastu
> - Produktyzacja — daje przestrzeń do pełnoprawnej rozbudowy
>
> Proposal flow (Google Doc): 90 min content + 30 min Q&A. Trzy sekcje:
> 1. Foundations (0-15 min): agentic CLI vs IDE assistants, mental model, CLAUDE.md
> 2. Live Build (15-75 min): 60 min hands-on terminal (setup, scaffolding, skills, MCP, autonomous routines)
> 3. Reality & Closing (75-90 min): brownfield, anti-patterns, resources
> Signature elements: custom skills + autonomous routines

## Teza

Claude Code to narzędzie, które zamienia prototyp (zbudowany w Lovable/Replit) w prawdziwy produkt — dając ci pełną kontrolę nad kodem, architekturą i procesem rozbudowy. Lovable i Replit kończą się tam, gdzie zaczyna się produktyzacja; CC nie ma tego sufitu.

## Dla kogo

Product builderzy z różnym backgroundem technicznym (PM, design, dev, founder) z 3-8 lat doświadczenia — kursanci AI Product Heroes. Znają już Lovable i Replit z wcześniejszych sesji. Szukają odpowiedzi na pytanie: "OK, mam prototyp — co dalej?"

## Audience Profile

- **Technical level**: mixed technical / non-technical (PM-owie, designerzy, deweloperzy w jednej sali)
- **Primary takeaway type**: tool introduction + first steps + strategic decision framework (kiedy CC vs Lovable/Replit)
- **Demo approach**: guided walkthrough z narracją (host prowadzi terminal, narratorsko tłumaczy każdy krok)
- **Technical depth**: medium (outcome'y + mechanizmy, bez dokładnej składni)
- **Jargon budget**:
  - **Wyjaśnić przy pierwszym użyciu**: CLI (command line interface — "terminal, ta czarna konsola"), agent/agentic ("AI, który sam decyduje co zrobić dalej"), MCP (Model Context Protocol — "sposób na podłączanie narzędzi do AI"), token ("jednostka tekstu dla AI — jak słowo, ale krótsze"), CLAUDE.md ("instrukcja dla AI, jak pracować z twoim projektem")
  - **Założyć znajomość**: prototyp, MVP, deployment, API, frontend/backend (pojęcia z wcześniejszych sesji AIPH)
  - **Unikać lub zastąpić**: SSR, hydration, tree-shaking, bundler, LSP, AST

## Kontrargumenty / obawy publiczności

1. **"To wygląda jak terminal — nie jest dla mnie"** — Webinar pokazuje, że CC pracuje w naturalnym języku. Piszesz co chcesz, AI pisze kod. Terminal to tylko interfejs, nie bariera.
2. **"Lovable jest prostsze i szybsze na start"** — Tak, i to jest OK. CC nie zastępuje Lovable do prototypowania — wchodzi tam, gdzie Lovable się kończy (auth, testy, custom logic, CI/CD).
3. **"AI generuje dziurawy kod"** — Adresujemy wprost: 453 z 1764 vibe-coded apps miało krytyczne luki (dane z niezależnego audytu). CC pozwala na code review, testy, security checks — ale wymaga świadomego procesu.
4. **"Czy AI naprawdę przyspiesza pracę?"** — METR study: doświadczeni devowie byli 19% WOLNIEJSI z AI (ale myśleli, że szybsi). Uczciwa odpowiedź: AI przyspiesza rutynowe zadania, spowalnia przy nowym/kompleksowym. CC jest narzędziem, nie magią.

## Kluczowe twierdzenia z dowodami

1. **Claude Code obsługuje większość kodu w Anthropic** — "majority of code at Anthropic is now written by Claude Code" ([Anthropic: How Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code)). Zaskakuje: firma, która buduje AI, sama buduje się za pomocą AI — to nie marketing, to dogfooding na skali produkcyjnej.

2. **Agenty AI spędzają większość tokenów na czytaniu, nie pisaniu** — context engineering redukuje zużycie tokenów 5-6× ([Moderne: Context Engineering](https://www.moderne.ai/blog/context-engineering-why-ai-coding-agents-spend-most-of-their-tokens-reading-not-writing)). Zaskakuje: AI "programista" to głównie AI "czytelnik" — CLAUDE.md i kontekst projektu to nie nice-to-have, to rdzeń efektywności.

3. **Doświadczeni devowie z AI są 19% wolniejsi (ale myślą, że szybsi o 20%)** — randomizowane badanie, 16 devów OSS, 246 tasków ([METR, 2025-07-10](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), [arXiv:2507.09089](https://arxiv.org/abs/2507.09089)). Follow-up (2026-02-24): nadal −18% dla oryginalnej kohorty, −4% dla nowej ([METR update](https://metr.org/blog/2026-02-24-uplift-update/)). Zaskakuje PM-ów: AI ≠ automatyczna produktywność — wymaga nauki i procesu.

4. **453 z 1764 vibe-coded apps miało krytyczne luki bezpieczeństwa** — w tym CVE-2025-48757 (170+ aplikacji Lovable wystawiło dane użytkowników przez brak Supabase RLS) ([TheNextWeb](https://thenextweb.com/news/lovable-vibe-coding-security-crisis-exposed), [dev.to scan](https://dev.to/stefan_lederer_8b1bbcef01/we-scanned-1764-vibe-coded-apps-453-had-critical-vulnerabilities-heres-what-we-found-beyond-464e)). Zaskakuje: prototyp ≠ produkt, zwłaszcza w bezpieczeństwie.

5. **Skills to "programowalne AI" — Simon Willison prognozuje "eksplozję kambryjską"** — "I expect a Cambrian explosion in Skills which will make this year's MCP rush look pedestrian by comparison" ([simonwillison.net, 2025-10-16](https://simonwillison.net/2025/Oct/16/claude-skills/)). Zaskakuje: Skills > MCP w długoterminowym wpływie, bo dają AI pamięć proceduralną, nie tylko dostęp do danych.

6. **Limity CC podwojone (2026-05-06)** — 5-godzinne limity 2× dla Pro/Max/Team/Enterprise, usunięto redukcję w godzinach szczytu. Napęd: deal z SpaceX na 300+ MW, 220k+ GPU NVIDIA ([Anthropic, 2026-05-06](https://www.anthropic.com/news/higher-limits-spacex)). Kontekst: API volume up 17× rok do roku ([Simon Willison](https://simonwillison.net/2026/May/6/code-w-claude-2026/)).

## Non-obvious facts do rzucenia

- **Anthropic Product Design team** feeduje Figma mockupy do CC w autonomicznych pętlach — design-to-code w produkcji, nie w demie ([How Anthropic teams use CC](https://claude.com/blog/how-anthropic-teams-use-claude-code))
- **CC default effort podniesiony do `xhigh` w Opus 4.7** — model domyślnie "myśli głębiej" ([Anthropic, 2026-04-16](https://www.anthropic.com/news/claude-opus-4-7))
- **Opus 4.7 tokenizer produkuje 1.0-1.35× więcej tokenów** za ten sam input — realny koszt rośnie ~20% mimo identycznego cennika ([Anthropic, 2026-04-16](https://www.anthropic.com/news/claude-opus-4-7)). Practitioner consensus: Opus 4.6[1m] nadal opłacalny dla długich sesji kodowania. ⚠️ Brak first-party endorsement tego twierdzenia.
- **Agent SDK three-phase loop**: gather context → take action → verify work. CC to nie autocomplete — to pętla decyzyjna ([Anthropic, 2025-09-29](https://claude.com/blog/building-agents-with-the-claude-agent-sdk))
- **Claude Managed Agents** (ogłoszone 2026-05-06): explicite framowane jako "from prototype to launch in days rather than months" ([Anthropic](https://claude.com/blog/claude-managed-agents)) — idealny retorycznie hook dla naszej tezy
- **Plan Mode** to oddzielny tryb read-only: AI researchuje i planuje zanim napisze linijkę kodu. Shift+Tab toggle. Armin Ronacher (twórca Flask): "Plan mode is underrated" ([lucumr.pocoo.org, 2025-12-17](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/))

## Kandydaci na demo

Wszystkie demo: guided walkthrough z narracją. Host prowadzi terminal, wyjaśnia co się dzieje krok po kroku. Nic nie jest "freestyle".

1. **"Od zera do landing page" z 10x-astro-starter** — potwierdza: CC buduje prawdziwy kod, nie mockup. Repo: `/Users/admin/code/10x-astro-starter` (Astro 6 + React 19 + Tailwind + Supabase). Ryzyko: niskie (statyczny build, zero API keys do demo). Czas: ~10-12 min. Najsilniejszy kandydat na main demo.

2. **"Produktyzacja" — dodanie auth/API endpointu do landing page** — potwierdza: tu Lovable się kończy, CC dopiero zaczyna. Repo: ten sam starter + Supabase local. Ryzyko: wymaga Docker (Supabase) — przygotować z wyprzedzeniem. Czas: ~8-10 min.

3. **CLAUDE.md jako produkcyjny artefakt** — potwierdza: AI spędza 80% czasu na czytaniu → CLAUDE.md to nie gadżet, to rdzeń workflow. Repo: dowolne (pokazać prawdziwy CLAUDE.md z edu-platform). Ryzyko: zero. Czas: ~3-5 min (tell + show).

4. **Custom Skill w akcji** — potwierdza: CC jest programowalny, to platform, nie jednorazowe narzędzie. Repo: `.claude/skills/` w tym repo (real skills, nie toy example). Ryzyko: niskie. Czas: ~5-7 min. "Signature element" z Google Doc.

5. **Plan Mode: myślenie przed kodowaniem** — potwierdza: CC to pętla decyzyjna, nie autocomplete. Repo: dowolne. Ryzyko: zero. Czas: ~3 min. Krótki, ale mocny show moment.

6. **Autonomiczna rutyna (scheduled agent)** — potwierdza: CC wykracza poza interaktywne sesje. Hipotetyczne demo (competitive research). Ryzyko: wymaga remote agent setup, może nie zadziałać live. Czas: ~5 min. "Signature element" z Google Doc, ale ryzykowny.

7. **Assumptions test — smoke test landing page** — potwierdza: CC do szybkiej walidacji pomysłów produktowych. Repo: 10x-astro-starter. Ryzyko: niskie. Czas: ~5 min. Bardzo trafny dla PM audience.

## Źródła

- [Anthropic — Higher usage limits for Claude and a compute deal with SpaceX (2026-05-06)](https://www.anthropic.com/news/higher-limits-spacex) — anchor na "stan obecny CC"
- [Anthropic — How Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code) — najsilniejszy dowód na produktyzację
- [Anthropic — Building agents with the Claude Agent SDK (2025-09-29)](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) — architektura pętli agentowej
- [Anthropic — Introducing Claude Opus 4.7 (2026-04-16)](https://www.anthropic.com/news/claude-opus-4-7) — model + pricing
- [Anthropic — Claude Managed Agents (2026-05-06)](https://claude.com/blog/claude-managed-agents) — "from prototype to launch"
- [Simon Willison — Live blog: Code w/ Claude 2026 (2026-05-06)](https://simonwillison.net/2026/May/6/code-w-claude-2026/) — niezależna weryfikacja ogłoszeń, 17× YoY API volume
- [Simon Willison — Claude Skills are awesome (2025-10-16)](https://simonwillison.net/2025/Oct/16/claude-skills/) — "Cambrian explosion" quote
- [METR — AI experienced OS developer study (2025-07-10)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) — "19% slower" randomized trial
- [METR — Uplift update (2026-02-24)](https://metr.org/blog/2026-02-24-uplift-update/) — follow-up dane
- [TheNextWeb — Lovable vibe coding security crisis](https://thenextweb.com/news/lovable-vibe-coding-security-crisis-exposed) — CVE-2025-48757
- [dev.to — We scanned 1764 vibe-coded apps](https://dev.to/stefan_lederer_8b1bbcef01/we-scanned-1764-vibe-coded-apps-453-had-critical-vulnerabilities-heres-what-we-found-beyond-464e) — skala problemu security
- [Armin Ronacher — What is Plan Mode? (2025-12-17)](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/) — practitioner voice
- [Moderne — Context Engineering (2026)](https://www.moderne.ai/blog/context-engineering-why-ai-coding-agents-spend-most-of-their-tokens-reading-not-writing) — "agents spend most tokens reading"
- [code.claude.com/docs/best-practices](https://code.claude.com/docs/en/best-practices) — first-party docs
- [code.claude.com/docs/skills](https://code.claude.com/docs/en/skills) — first-party docs
