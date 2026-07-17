---
title: "AI Tools Landscape (Q4 2025)"
version: "2025-Q4"
last_updated: "2025-11-08"
maintenance_schedule: "Quarterly (Q1, Q2, Q3, Q4)"
target_audience: "Developers evaluating AI coding tools"
document_type: "Living Document - Time-Bound Recommendations"
warning: "⚠️ This document contains time-sensitive information (pricing, versions, tool availability) current as of Q4 2025. Check vendor websites for latest updates."
related_docs:
  - "01-core-principles.md (timeless fundamentals)"
  - "02-workflows-patterns.md (universal patterns)"
---

# AI Tools Landscape (Q4 2025)

> **⚠️ DISCLAIMER:** This is a living document with time-bound recommendations. Pricing, features, and tool availability are current as of **November 2025 (Q4 2025)**. Always verify current information on vendor websites before making decisions.

**Related documents:**
- **[Core Principles](01-core-principles.md)** - Timeless AI development fundamentals
- **[Workflows & Patterns](02-workflows-patterns.md)** - Universal workflow strategies

---

## Spis treści

1. [Strategia wyboru modelu (Q4 2025)](#strategia-wyboru-modelu-q4-2025)
   - Model Asystent (Koder)
   - Model Rozumujący (Architekt)
   - Strategia kosztowa
   - Wybór języka: Polski vs Angielski
   - Monitorowanie modeli

2. [Narzędzia IDE](#narzędzia-ide)
   - Cursor
   - Windsurf
   - Cline/Junie
   - Essential Setup
   - Privacy Mode
   - Keyboard Shortcuts
   - Context Symbols
   - Project Instructions

3. [Narzędzia CLI](#narzędzia-cli)
   - Claude Code
   - Codex CLI (OpenAI)
   - Gemini CLI (Google)
   - aider
   - OpenCode

4. [Asynchroniczne Agenty](#asynchroniczne-agenty)
   - OpenAI Codex (ChatGPT Enterprise)
   - Google Jules
   - GitHub Copilot Agent
   - Devin (Cognition AI)

5. [Przewodnik wyboru narzędzi](#przewodnik-wyboru-narzędzi)

---

## Strategia wyboru modelu (Q4 2025)

### Dlaczego potrzebujesz dwóch typów modeli?

Do efektywnej pracy potrzebujesz **dwóch typów modeli**:

#### 1. Model Asystent (Koder)

**Przeznaczenie:** Codzienne zadania programistyczne wymagające szybkiej odpowiedzi

**Cechy:**
- Wyspecjalizowany w domenie programowania
- Szybki czas odpowiedzi (1-5 sekund)
- Dobra znajomość popularnych frameworków i bibliotek
- Efektywny w generowaniu kodu, testów, dokumentacji

**Rekomendowane modele (Q4 2025):**
- **Claude Sonnet 4.5** - doskonała równowaga jakości i szybkości
- **GPT-5-Codex** - jeśli niedostępny, użyj GPT-5
- **Gemini 2.5 Pro** - dobra alternatywa
- **Wariant ekonomiczny:** grok-code-fast-1 lub Claude Haiku 4.5

**Typowe zastosowania:**
- Generowanie komponentów UI
- Pisanie testów jednostkowych
- Refactoring istniejącego kodu
- Dokumentacja kodu
- Debugging prostych błędów

#### 2. Model Rozumujący (Architekt)

**Przeznaczenie:** Złożone zadania wymagające głębokiej analizy i planowania

**Cechy:**
- Zdolność do wieloetapowego rozumowania
- Analiza wymagań i konsekwencji
- Planowanie architektury
- Wolniejszy, ale dokładniejszy (może działać 30-120 sekund)
- Wyższe koszty zapytań

**Rekomendowane modele (Q4 2025):**
- **GPT-5-Codex / GPT-5** (Medium / High Reasoning Effort)
- **Gemini 2.5 Pro**
- **Wariant ekonomiczny:** grok-4-fast

**Typowe zastosowania:**
- Projektowanie architektury systemu
- Analiza złożonych problemów
- Optymalizacja wydajności
- Security review
- Migracje i modernizacje legacy code

---

### Strategia kosztowa

#### Flat Rate (Abonament z limitami)

**Charakterystyka:**
- Stała miesięczna opłata
- Limity zapytań lub sesji
- Przewidywalne koszty

**Przykłady (Q4 2025):**
- **GitHub Copilot** - ~$10-20/mies.
- **Windsurf Professional** - flat rate pricing

**Kiedy wybrać:**
- ✅ Intensywne codzienne użycie
- ✅ Potrzebujesz przewidywalnych kosztów
- ✅ Pracujesz w firmie z budżetem na narzędzia

#### Usage-Based (Płatność za tokeny)

**Charakterystyka:**
- Płacisz za faktyczne użycie (tokeny wejściowe + wyjściowe)
- Koszty mogą być zmienne
- Większa elastyczność

**Przykłady (Q4 2025):**
- **Cursor** - credits system
- **Bezpośredni dostęp API** - OpenAI, Anthropic, Google

**Kiedy wybrać:**
- ✅ Nieregularne użycie
- ✅ Chcesz płacić tylko za to, czego używasz
- ✅ Potrzebujesz dostępu do najnowszych modeli

**⚠️ Uwaga o kosztach i języku:**
Polski język używa **~50-67% więcej tokenów** niż angielski, co bezpośrednio przekłada się na wyższe koszty w modelach usage-based.

---

### Wybór języka: Polski vs Angielski

#### Używaj **polskiego** gdy:

- ✅ Myślisz precyzyjniej w języku polskim
- ✅ Opisujesz złożoną domenę biznesową ze specjalistycznym słownictwem
- ✅ Pracujesz z długim kontekstem (badania OneRuler pokazują lepsze wyniki dla polskiego w long-context tasks)
- ✅ Koszt tokenów nie jest głównym problemem (flat rate)

#### Używaj **angielskiego** gdy:

- ✅ Chcesz zoptymalizować koszty tokenów (30-50% oszczędności)
- ✅ Pracujesz z międzynarodowym kodem/dokumentacją
- ✅ Szukasz przykładów kodu z popularnych bibliotek (więcej anglojęzycznych przykładów w danych treningowych)
- ✅ Współpracujesz z międzynarodowym zespołem

**Złota zasada:** Używaj języka, w którym **myślisz najbardziej precyzyjnie**, ale miej świadomość konsekwencji kosztowych.

---

### Monitorowanie modeli

**Nie polegaj ślepo na benchmarkach:**
- ❌ Syntetyczne benchmarki mogą być "zagrane" przez producentów
- ❌ Nie odzwierciedlają rzeczywistego użycia
- ❌ Scoring models na benchmarkach ≠ przydatność w codziennej pracy

**Lepsze źródła informacji (Q4 2025):**
- **OpenRouter Rankings** - ranking oparty na rzeczywistym użyciu community
- **LM Arena** - ślepe porównania modeli przez użytkowników
- **Własne doświadczenie** - testuj modele na typowych dla siebie zadaniach

**Pamiętaj:** Praktyka znaczy więcej niż wyniki benchmarków. Model z niższym wynikiem może być lepszy dla Twojego konkretnego use case.

---

## Narzędzia IDE

### Wybór narzędzia IDE (Q4 2025)

#### Cursor

**Najlepsze dla:** Użytkowników VS Code

**Kluczowe cechy:**
- ✅ Doskonała integracja z edytorem
- ✅ Composer mode dla multi-file edits
- ✅ Elastyczny system kredytów (usage-based)
- ⚠️ Wymaga adaptacji od "czystego" VS Code

**Model cenowy:** Usage-based (credits system)

#### Windsurf

**Najlepsze dla:** Użytkowników szukających prostoty

**Kluczowe cechy:**
- ✅ Cascade mode - świetny do dużych refaktorów
- ✅ Flat rate pricing (przewidywalne koszty)
- ⚠️ Młodsze narzędzie, mniej plugins

**Model cenowy:** Flat rate (Professional subscription)

#### Cline/Junie

**Najlepsze dla:** Użytkowników JetBrains IDE

**Kluczowe cechy:**
- ✅ Native integration z IntelliJ, WebStorm, PyCharm
- ⚠️ Mniej dojrzałe niż Cursor

**Model cenowy:** Varies by IDE integration

---

### Essential Setup (Cursor/Windsurf/Cline)

#### 1. Privacy Mode - Ochrona wrażliwych danych

**Dlaczego to ważne:**
- Domyślnie IDE AI może wysyłać kod do zewnętrznych serwerów
- Ryzyko wycieku sekretów, kluczy API, danych biznesowych
- Potencjalne naruszenie NDA lub GDPR

**Co skonfigurować:**

**Cursor:**
```
Settings → Privacy:
☑ Enable Privacy Mode (blokuje wysyłanie kodu do serwerów Cursor)
☑ Disable Telemetry
```

**Pliki ignorujące:**
Stwórz `.cursorignore` w root projektu:
```
.env*
.secrets/
credentials/
*.key
*.pem
config/production.yml
db/seeds/
```

**Windsurf/Cline:**
Analogiczne ustawienia + `.aiignore` lub `.clineignore`

**⚠️ Uwaga:** Privacy mode może ograniczać features (np. code indexing w chmurze). Zbalansuj potrzeby vs security.

#### 2. Keyboard Shortcuts - Efektywność

Naucz się na pamięć (przykład dla **Cursor**):

| Shortcut | Funkcja | Kiedy używać |
|----------|---------|--------------|
| `Cmd/Ctrl + L` | Open Chat | Ogólne pytania, planning |
| `Cmd/Ctrl + K` | Inline Edit | Quick edits w konkretnej linii |
| `Cmd/Ctrl + I` | Composer/Agent | Multi-file refactoring |
| `Cmd/Ctrl + Shift + L` | Chat with selection | Pytania o zaznaczony kod |

**Ćwicz przez tydzień** - shortcuts drastycznie przyspieszają workflow.

#### 3. Context Symbols - Precyzyjne wskazywanie kontekstu

**Podstawowe symbole (Cursor):**

| Symbol | Znaczenie | Przykład użycia |
|--------|-----------|-----------------|
| `@File` | Konkretny plik | `@src/api/users.ts` |
| `@Folder` | Cały folder | `@src/components/` |
| `@Git` | Git context | `@Git ostatnie 3 commity` |
| `@Docs` | Dokumentacja | `@Docs React useEffect` |
| `@Web` | Wyszukiwanie web | `@Web latest Next.js 15 routing` |
| `@Code` | Code search | `@Code getUserProfile` |
| `@Codebase` | Całe repo | `@Codebase jak działa auth?` |

**Best Practices:**
- ✅ Bądź specific: `@src/utils/validation.ts` lepsze niż `@Codebase`
- ✅ Używaj Git dla kontekstu zmian: `@Git diff HEAD~5..HEAD`
- ✅ @Docs dla frameworków: szybsze niż manual search
- ⚠️ Unikaj @Codebase dla dużych repo - zjada context window

**Przykład dobrej kombinacji:**
```
Zrefaktoruj auth logic aby używała nowego token validation.

Context:
@src/auth/token.ts (obecna implementacja)
@src/types/Auth.ts (typy)
@Git ostatnie zmiany w auth/ (żeby zrozumieć kierunek zmian)
@Docs JWT best practices (świeża wiedza o security)
```

#### 4. Project Instructions - Naucz AI jak pracować w Twoim projekcie

**Cursor:**
- `.cursorrules` w root projektu
- `.cursor/rules/*.md` dla per-domain rules

**Windsurf:**
- `.windsurfrules`

**Przykład zawartości:**

```markdown
# Project: MyApp - E-commerce Platform

## Tech Stack
- React 19, TypeScript 5.2
- TanStack Query (dawniej React Query) - DO NOT suggest Redux
- Supabase (auth + db)
- Tailwind CSS (NO styled-components)

## Architecture Rules
- Components w src/components/, jeden komponent = jeden plik
- Custom hooks w src/hooks/, prefix use*
- API calls TYLKO przez TanStack Query w src/api/
- Typy zawsze explicit, NO type any (strict mode)

## Styling Conventions
- Tailwind utility-first
- Dark mode przez class strategy (NOT media query)
- Responsive: mobile-first, breakpoints: sm: 640px, md: 768px, lg: 1024px

## Testing Requirements
- Vitest dla unit
- Playwright dla E2E
- ZAWSZE generuj testy wraz z kodem
- Coverage minimum 80%

## DO NOT
- ❌ Nie używaj class components (tylko functional)
- ❌ Nie proponuj Redux (mamy TanStack Query + Zustand)
- ❌ Nie dodawaj dependencies bez pytania
- ❌ Nie commit bez testów

## Preferred Patterns
✅ Server components gdzie możliwe (Next.js App Router)
✅ Atomic design (atoms → molecules → organisms)
✅ Container/Presenter pattern dla complex logic

## Code Style
- ESLint + Prettier (konfiguracja w repo)
- Single quotes dla strings
- 2 spaces indent
- Max line length: 100
```

**Efekt:**
- AI generuje kod zgodny z Twoimi conventions od razu
- Mniej czasu na code review i fixing
- Spójny styl w całym projekcie

---

## Narzędzia CLI

### Porównanie narzędzi CLI (Q4 2025)

#### Claude Code (Anthropic)

**Najlepsze dla:**
- ✅ Duże repozytoria (świetny large context handling)
- ✅ Enterprise features (MCP, hooks, compliance)
- ✅ Onboarding i exploration
- ✅ Complex multi-file refactorings

**Kluczowe cechy:**
- Bardzo szeroki context window (effectively uses 200k+ tokens)
- Plan mode (HITL approval przed changes)
- MCP integration (extensibility)
- Hooks system (customize behavior)

**Instalacja:**
```bash
npm install -g @anthropic-ai/claude-code
claude-code auth
```

**Przykład użycia:**
```bash
# Plan mode (default) - shows plan before executing
claude-code "Add user authentication with JWT"

# Approve plan → wykonanie

# Direct mode (bez planu)
claude-code --no-plan "Fix typo w README"
```

**Model cenowy:** Usage-based (Anthropic API pricing)

---

#### Codex CLI (OpenAI)

**Najlepsze dla:**
- ✅ Integracja z ekosystemem OpenAI
- ✅ Dostęp do najnowszych GPT-5 models
- ✅ Szybkie iteracje (fast response times)

**Kluczowe cechy:**
- GPT-5-Codex (specialized code model)
- Reasoning modes (Low/Medium/High effort)
- Good balance speed/quality

**Instalacja:**
```bash
pip install openai-codex-cli
codex auth
```

**Przykład użycia:**
```bash
codex "Implement binary search in Python with type hints"

# Z reasoning mode
codex --reasoning high "Optimize this algorithm for large datasets"
```

**Model cenowy:** Usage-based (OpenAI API)

---

#### Gemini CLI (Google)

**Najlepsze dla:**
- ✅ Zadania multimodalne (images, PDFs w repo)
- ✅ Integracja z Google Cloud
- ✅ Bardzo długie context (1M+ tokens)

**Kluczowe cechy:**
- Gemini 2.5 Pro (long context specialist)
- Multimodal (analyze screenshots, diagrams)
- Google Cloud integration (GCP services)

**Instalacja:**
```bash
npm install -g @google/gemini-cli
gemini auth
```

**Przykład użycia:**
```bash
# Analyze image w projekcie
gemini "Compare design mockup (design.png) with current implementation"

# Long context
gemini "Summarize all changes in this repo from last 6 months"
```

**Model cenowy:** Usage-based (Google AI pricing)

---

#### aider

**Najlepsze dla:**
- ✅ Precyzyjne, controlled changes
- ✅ Devs którzy chcą widzieć dokładnie co się zmienia
- ✅ Surgical refactorings (minimal diff)

**Kluczowe cechy:**
- Excellent diff preview przed apply
- Git integration (auto-commit opcjonalne)
- Multiple modes: ask, code, architect
- Works with any model (OpenAI, Anthropic, local)

**Instalacja:**
```bash
pip install aider-chat
```

**Przykład użycia:**
```bash
# Interactive mode
aider src/app.ts src/types.ts
> Add error handling to fetchUser function

# AI generuje changes, pokazuje diff
# Ty approujesz lub rejectujesz

# One-shot mode
aider --message "Fix all ESLint errors" --yes-always
```

**Model cenowy:** Free tool, płacisz za API (OpenAI/Anthropic)

---

#### OpenCode

**Najlepsze dla:**
- ✅ No vendor lock-in (bring your own model)
- ✅ On-prem / offline support
- ✅ Open source customization

**Kluczowe cechy:**
- Works with any LLM API
- Local model support (Ollama, LM Studio)
- Full control nad data (never leaves your infra)
- OSS (możesz modyfikować)

**Instalacja:**
```bash
npm install -g @open-code/cli
```

**Przykład użycia:**
```bash
# Z OpenAI
opencode --model gpt-4 "Add logging"

# Z local model
opencode --model ollama/codellama "Explain this function"

# Z custom endpoint
opencode --api-url http://internal-llm.company.com "Generate tests"
```

**Model cenowy:** Free tool, koszty zależą od modelu

---

## Asynchroniczne Agenty

### Porównanie Async Agents (Q4 2025)

#### OpenAI Codex (ChatGPT Enterprise)

**Model:** GPT-5-Codex + GPT-5 Reasoning

**Charakterystyka:**
- Ad-hoc tasks w chat interface
- Brak native GitHub integration (manual triggers)
- Bardzo szybkie iteracje
- Świetna jakość kodu

**Workflow:**
```
1. Opisujesz zadanie w ChatGPT
2. Agent generuje plan
3. Approve → implementuje
4. Agent pokazuje code
5. Ty kopiujesz do IDE i commituje
```

**Pros:**
- ✅ Najnowsze modele (GPT-5 first)
- ✅ Reasoning mode dla complex tasks
- ✅ Bardzo dobra jakość
- ✅ Fast iterations

**Cons:**
- ❌ Brak GitHub automation
- ❌ Manual copy-paste kodu
- ❌ Nie tworzy PR automatycznie

**Kiedy używać:**
- Quick ad-hoc tasks
- Gdy pracujesz w ChatGPT i chcesz szybko coś zakodować
- Exploration i prototyping

---

#### Google Jules

**Model:** Gemini 2.5 Pro

**Charakterystyka:**
- GitHub-first (deeply integrated)
- Trigger przez labels lub comments
- Clear audit logs
- Multi-repo support

**Workflow:**
```
1. Create issue: "Add dark mode"
2. Add label: "jules" (lub comment "@jules please implement")
3. Jules analyze issue
4. Jules creates branch
5. Jules implements + tests
6. Jules opens PR
7. You review & merge
```

**Pros:**
- ✅ Deep GitHub integration (native triggers)
- ✅ Excellent audit trail (każdy krok logged)
- ✅ Multi-repo workflows
- ✅ Comment-based interaction (natural)

**Cons:**
- ❌ Wymaga Google AI subscription
- ❌ Młodsze narzędzie (fewer integrations)

**Kiedy używać:**
- Projekty z heavy GitHub workflow
- Potrzebujesz audit logs (enterprise)
- Multi-repo monorepo scenarios

---

#### GitHub Copilot Agent

**Model:** GPT-4 based (proprietary tune)

**Charakterystyka:**
- Native GitHub ecosystem
- Respects branch protection
- Full audit trail w GitHub UI
- Integracja z Actions, Projects, Issues

**Workflow:**
```
1. Issue creation (manual or automated)
2. Copilot analyze
3. Proposes plan (w issue comments)
4. Po approval → creates PR
5. Respects all GitHub rules (branch protection, required reviews)
6. Full history w GitHub
```

**Pros:**
- ✅ Native ecosystem (no third-party)
- ✅ Respects wszystkie GitHub policies
- ✅ Full audit w UI
- ✅ Integracja z Copilot w IDE

**Cons:**
- ❌ Wymaga GitHub Enterprise lub Copilot Business
- ❌ Vendor lock-in

**Kiedy używać:**
- Heavy GitHub users
- Enterprise z GitHub policies
- Potrzebujesz seamless IDE + Agent integration

---

#### Devin (Cognition AI)

**Model:** Proprietary (multi-model system)

**Charakterystyka:**
- Heavy lifting (multi-hour sessions)
- Long-running autonomous work
- Slack/Linear/Jira integrations
- Pełen development environment (browser, terminal, editor)

**Workflow:**
```
1. Assign ticket w Jira
2. Devin picked up automatically
3. Devin works autonomously (godziny)
4. Regularnie updatuje progress (Slack notifications)
5. Gdy stuck → asks questions
6. Finalnie → PR ready
```

**Pros:**
- ✅ Bardzo długie sesje (8+ godzin)
- ✅ Complex multi-step projects
- ✅ Real browser testing (Playwright integration)
- ✅ Integrations z PM tools

**Cons:**
- ❌ Najdroższy (usage-based, can be $$$)
- ❌ Czasem over-engineers solutions
- ❌ Requires good issue specs

**Kiedy używać:**
- Complex features (multi-day work)
- Potrzebujesz full autonomy
- Integracja z PM tools (Jira, Linear)

---

## Przewodnik wyboru narzędzi

### Quick Decision Matrix

| Scenariusz | Rekomendowane narzędzie | Model |
|------------|-------------------------|-------|
| Quick code edit | IDE (Cursor/Windsurf) | Claude Sonnet 4.5 |
| Multi-file refactoring | CLI (Claude Code) | Claude Sonnet 4.5 |
| Complex architecture | IDE + Reasoning | GPT-5 (High Reasoning) |
| Large codebase exploration | CLI (Claude Code) | Claude Sonnet 4.5 |
| Autonomous feature development | Agent (Devin/Jules) | Gemini 2.5 Pro / Proprietary |
| Enterprise compliance | CLI (Claude Code) + MCP | Claude Sonnet 4.5 |
| Cost optimization | IDE (flat rate) + aider | Various |

### Wybór według budżetu (Q4 2025)

**Budżet < $50/mies:**
- GitHub Copilot ($10-20/mies.)
- aider (free) + OpenAI API (pay per use)
- OpenCode + local models (Ollama)

**Budżet $50-150/mies:**
- Cursor Pro ($20/mies.) + API credits
- Windsurf Professional
- Claude Code + Anthropic API

**Budżet > $150/mies:**
- Cursor + Claude Code + async agent
- Devin subscription
- GitHub Copilot Enterprise

---

## Podsumowanie rekomendacji (Q4 2025)

### Startujący developer
- **IDE:** Cursor (łatwy start)
- **Model:** Claude Sonnet 4.5
- **Budget:** ~$30-50/mies.

### Doświadczony developer
- **IDE:** Cursor lub Windsurf
- **CLI:** Claude Code lub aider
- **Models:** Claude Sonnet 4.5 + GPT-5 (reasoning)
- **Budget:** ~$80-150/mies.

### Enterprise team
- **IDE:** Cursor lub Windsurf (team license)
- **CLI:** Claude Code (MCP + hooks)
- **Agent:** GitHub Copilot Agent lub Devin
- **Models:** Full access to Claude/GPT/Gemini
- **Budget:** $200-500/developer/mies.

---

## Następne kroki

1. **Przeczytaj fundamenty:** [Core Principles](01-core-principles.md)
2. **Poznaj wzorce pracy:** [Workflows & Patterns](02-workflows-patterns.md)
3. **Wybierz narzędzia** na podstawie tego dokumentu
4. **Testuj na własnych projektach** - nie ufaj ślepo benchmarkom
5. **Monitoruj koszty** i dostosowuj strategię co miesiąc

---

**Data utworzenia:** 2025-11-08
**Następna aktualizacja:** 2026-Q1 (Marzec 2026)
**Wersja:** 2025-Q4

> ⚠️ **Reminder:** Ceny, funkcje i dostępność narzędzi mogą się zmienić. Zawsze weryfikuj aktualne informacje na stronach vendorów przed podjęciem decyzji.
