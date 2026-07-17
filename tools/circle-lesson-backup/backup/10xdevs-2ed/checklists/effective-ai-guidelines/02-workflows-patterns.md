---
title: "Wzorce i Przepływy Pracy z AI"
version: "2.0.0"
last_updated: "2025-11-08"
maintenance_schedule: "Semi-annual (every 6 months)"
target_audience: "Software developers working with AI assistance"
document_type: "Workflows & Patterns (Universal)"
parent_document: "01-core-principles.md"
---

# AI Development Workflows & Patterns

Ten dokument zawiera uniwersalne wzorce pracy z narzędziami AI - bez względu na konkretny stack technologiczny czy wybrane narzędzie. Skupiamy się na **JAK pracować**, nie **KTÓRYM narzędziem**.

> **Uwaga:** Dla konkretnych rekomendacji narzędzi, zobacz `03-tools-landscape-[version].md` (osobny dokument z informacjami aktualnymi na dany kwartał).

---

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Konfiguracja podstawowa](#konfiguracja-podstawowa)
3. [Strategie zarządzania kontekstem](#strategie-zarządzania-kontekstem)
4. [Wzorce strukturyzowanych promptów](#wzorce-strukturyzowanych-promptów)
5. [Przepływy pracy w IDE](#przepływy-pracy-w-ide)
6. [Przepływy pracy CLI](#przepływy-pracy-cli)
7. [Przepływy pracy z agentami asynchronicznymi](#przepływy-pracy-z-agentami-asynchronicznymi)
8. [Matryca decyzyjna: Wybór podejścia](#matryca-decyzyjna-wybór-podejścia)
9. [Odniesienia krzyżowe](#odniesienia-krzyżowe)

---

## Wprowadzenie

Praca z AI w rozwoju oprogramowania wymaga specyficznych przepływów pracy i wzorców, które maksymalizują efektywność przy minimalizacji ryzyka. Ten dokument opisuje uniwersalne wzorce, które działają niezależnie od:

- **Języka programowania** (TypeScript, Python, Go, Java, Rust, etc.)
- **Domeny projektu** (web, mobile, backend, data science, DevOps)
- **Konkretnego narzędzia AI** (IDE, CLI, agent)

### Trzy główne kategorie narzędzi

Współczesne narzędzia AI dzielą się na trzy kategorie, każda z unikalnym przepływem pracy:

| Kategoria | Charakterystyka | Typowy Use Case |
|-----------|-----------------|-----------------|
| **IDE z AI** | Zintegrowane z editorem, inline suggestions | Szybkie edycje, prototypowanie |
| **CLI AI** | Terminal-based, szerszy kontekst, ReAct mode | Refactoring, exploration, debugging |
| **Agenci asynchroniczni** | Autonomiczna praca, pełny cykl development | Features, bug fixes, maintenance |

> **Crossref:** Szczegóły o fundamentach pracy z AI → `01-core-principles.md`

---

## Konfiguracja podstawowa

### 1. Privacy Mode - Ochrona wrażliwych danych

**Dlaczego to ważne:**
- Domyślnie narzędzia AI mogą wysyłać kod do zewnętrznych serwerów
- Ryzyko wycieku sekretów, kluczy API, danych biznesowych
- Potencjalne naruszenie NDA lub GDPR

**Co skonfigurować:**

Większość narzędzi oferuje "Privacy Mode" lub podobne ustawienia:

```
Settings → Privacy:
☑ Enable Privacy Mode (blokuje wysyłanie kodu do zewnętrznych serwerów)
☑ Disable Telemetry
☑ Enable Local-Only Processing (jeśli dostępne)
```

**Pliki ignorujące:**

Każde narzędzie AI obsługuje plik ignorowania (analogiczny do `.gitignore`). Nazwa pliku jest specyficzna dla narzędzia - sprawdź dokumentację swojego narzędzia. Typowe wzorce:
- Pliki zaczynające się kropką z sufixem `ignore` (np. `.aiignore`)
- Narzędzia często używają własnych konwencji nazewnictwa

**Przykładowa zawartość:**
```
.env*
.secrets/
credentials/
*.key
*.pem
*.crt
config/production.yml
config/production.json
db/seeds/
.aws/
.gcp/
private/
```

**Trade-off:** Privacy mode może ograniczać niektóre funkcje (np. cloud-based code indexing). Zbalansuj bezpieczeństwo z potrzebami zespołu.

### 2. Keyboard Shortcuts - Efektywność

Naucz się na pamięć podstawowych skrótów klawiszowych swojego narzędzia. Typowe funkcje:

| Funkcja | Typowe skróty | Kiedy używać |
|---------|---------------|--------------|
| Otwórz chat | `Cmd/Ctrl + L` lub `Cmd/Ctrl + K` | Ogólne pytania, planning |
| Inline edit | `Cmd/Ctrl + K` lub `Cmd/Ctrl + I` | Quick edits w konkretnej linii |
| Multi-file agent | `Cmd/Ctrl + Shift + I` | Cross-file refactoring |
| Chat z zaznaczeniem | `Cmd/Ctrl + Shift + L` | Pytania o konkretny fragment kodu |

> **Tip:** Ćwicz przez tydzień - shortcuts drastycznie przyspieszają workflow.

### 3. Mechanizmy referencji do plików

**Koncepcja:** Precyzyjne wskazywanie kontekstu dla AI poprzez referencję do konkretnych plików, folderów czy źródeł.

**Różne składnie (zależnie od narzędzia):**

| Symbol/Składnia | Znaczenie | Przykład użycia |
|-----------------|-----------|-----------------|
| `@File` / `/file` / ścieżka | Konkretny plik | `@src/api/users.ts` |
| `@Folder` / ścieżka do folderu | Cały folder | `@src/components/` |
| `@Git` / git commands | Git context | `@Git ostatnie 3 commity` |
| `@Docs` / dokumentacja | Dokumentacja frameworka | `@Docs [framework] [feature]` |
| `@Web` / web search | Wyszukiwanie web | `@Web framework authentication patterns` |
| `@Code` / code search | Wyszukiwanie w kodzie | `@Code getUserProfile` |
| `@Codebase` / repo | Całe repozytorium | `@Codebase jak działa auth?` |

**Best Practices:**
- ✅ Bądź specific: `@src/utils/validation.ts` lepsze niż `@Codebase`
- ✅ Używaj Git dla kontekstu zmian: `@Git diff HEAD~5..HEAD`
- ✅ Dokumentacja dla frameworków: szybsze niż manual search
- ⚠️ Unikaj `@Codebase` dla dużych repo - zjada context window

**Przykład dobrej kombinacji:**
```
Zrefaktoruj auth logic aby używała nowego token validation.

Context:
@src/auth/token.ts (obecna implementacja)
@src/types/Auth.ts (typy)
@Git ostatnie zmiany w auth/ (kierunek zmian)
@Docs JWT best practices (świeża wiedza o security)
```

### 4. Project Instructions - Naucz AI jak pracować w Twoim projekcie

**Koncepcja:** Plik konfiguracyjny w root projektu, który definiuje zasady, konwencje i preferencje dla AI.

**Różne nazwy plików (zależne od narzędzia):**
- Każde narzędzie AI używa własnej konwencji nazewnictwa
- Często pliki zaczynają się kropką (dotfile) lub mają rozszerzenie `.md`
- Sprawdź dokumentację swojego narzędzia dla poprawnej nazwy

**Co zawrzeć w pliku:**

```markdown
# Project: [Nazwa Projektu] - [Krótki Opis]

## Tech Stack
- [Framework/język + wersja]
- [Główne biblioteki]
- [Baza danych]
- [Narzędzia]

WAŻNE: Wskaż czego NIE używać:
- DO NOT suggest [nieużywana technologia]
- AVOID [pattern którego unikamy]

## Architecture Rules
- Struktura folderów i odpowiedzialności
- Konwencje nazewnictwa
- Wzorce architektoniczne
- Zasady organizacji kodu

## Styling Conventions
- Podejście do stylowania
- Naming conventions dla CSS/styles
- Responsive design approach
- Accessibility requirements

## Testing Requirements
- Framework testowy
- Wymagania coverage
- Rodzaje testów (unit, integration, E2E)
- ZASADA: Zawsze generuj testy wraz z kodem

## DO NOT (Explicit Anti-patterns)
❌ Lista rzeczy których AI NIE powinno robić
❌ Deprecated patterns w projekcie
❌ Zabronione dependencies
❌ Code smells specyficzne dla projektu

## Preferred Patterns
✅ Wzorce które preferujemy
✅ Best practices specyficzne dla projektu
✅ Code style preferences

## Code Style
- Linter/formatter config
- Quote style (single/double)
- Indentation (tabs/spaces, ile)
- Max line length
- Import ordering
```

**Efekt:**
- AI generuje kod zgodny z Twoimi konwencjami od razu
- Mniej czasu na code review i fixing
- Spójny styl w całym projekcie

**Przykład multi-language:**

```markdown
# Project Instructions

## Language-Specific Rules

### TypeScript
- Strict mode enabled (no `any` types)
- Prefer interfaces over types
- Use explicit return types

### Python
- Type hints mandatory (PEP 484)
- Use dataclasses for data structures
- Prefer pathlib over os.path

### Go
- Follow effective Go guidelines
- Use context.Context for cancellation
- Error handling: explicit checks, no panic in production

### Java
- Use Java 17+ features
- Prefer records for data classes
- Stream API over traditional loops
```

### 5. Reusable Prompts - Biblioteka często używanych promptów

**Koncepcja:** Zapisane, reużywalne szablony promptów dla powtarzalnych zadań.

**Implementacja zależy od narzędzia:**
- **IDE:** Custom Commands, Snippets, Templates
- **CLI:** Shell aliases, skrypty
- **Agenci:** Saved templates w issue tracker

**Przykładowe szablony:**

#### Template: Generowanie testów
```markdown
Wygeneruj testy dla @[file_path]

Framework: [test framework]
Coverage: functions, branches, edge cases
Include: happy path, error states, boundary conditions
Mock: external dependencies

Follow testing patterns from @tests/examples/
```

#### Template: Code Review
```markdown
Przeprowadź code review dla @[file_or_diff]

Check:
- [ ] Code quality & maintainability
- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Test coverage
- [ ] Edge cases handling
- [ ] Accessibility (if UI)

Format: Structured comments z severity (critical/major/minor)
```

#### Template: Refactoring
```markdown
Zrefaktoruj @[target]

Goals:
- [cel 1]
- [cel 2]

Constraints:
- Zachowaj backwards compatibility
- Nie łam istniejących testów
- Follow project patterns

Deliverables:
1. Refactored code
2. Updated tests
3. Migration guide (if breaking)
```

#### Template: Documentation
```markdown
Dodaj dokumentację dla @[file_or_function]

Include:
- JSDoc/docstring z examples
- Parametry i return types
- Usage examples
- Edge cases i gotchas
- Links do related code

Format: [Markdown/JSDoc/reStructuredText/Javadoc]
```

---

## Strategie zarządzania kontekstem

**Kontekst = wszystko co AI "widzi" przy generowaniu odpowiedzi**

### Źródła kontekstu

1. **Files & Folders** - kod referowany przez mechanizmy @/file
2. **Git History** - commity, branches, diffs
3. **Web Content** - dokumentacja, Stack Overflow (jeśli dostępne)
4. **User Instructions** - project rules, custom prompts
5. **Conversation History** - poprzednie wiadomości w sesji

### Best Practices

#### ✅ Minimalizuj zbędny kontekst

```
❌ Źle: @src/ (cały folder, może być 100+ plików)
✅ Dobrze: @src/components/Button.tsx @src/types/Button.ts (2 relevantne)
```

**Dlaczego:** Context window to ograniczony zasób. Zbędne pliki:
- Zjadają tokeny (= koszt)
- Rozmywają focus AI
- Zwiększają szansę na halucynacje

#### ✅ Odświeżaj kontekst przy zmianie tematu

```
Po zrobieniu feature A i przejściu do feature B:

"Poprzedni kontekst już nieważny. Nowy kontekst:
@src/features/B/
@docs/feature-b-spec.md

Focus: Implementacja feature B według spec."
```

**Pattern:** Explicit context reset zapobiega "context bleeding" między zadaniami.

#### ✅ Używaj Git kontekstu dla zmian

```
"Jak się zmieniła warstwa auth od ostatniego release?"
@Git diff v2.0..HEAD -- src/auth/

"Co naprawiał ostatni hotfix?"
@Git log --grep="hotfix" -n 5
```

**Korzyść:** Git history dostarcza temporal context - jak kod ewoluował.

#### ✅ Dokumentacja > Web search

```
✅ @Docs [framework] [feature name]
   (świeża, oficjalna dokumentacja frameworka)

❌ @Web "[framework] [feature] tutorial"
   (może być outdated, nieoficjalna)
```

**Wyjątek:** Web search dobry dla:
- Nowych technologii bez dokumentacji
- Community patterns
- Troubleshooting błędów

#### ⚠️ Limituj @Codebase dla dużych projektów

- `@Codebase` może zjeść 50-80% twojego context window
- Użyj tylko dla high-level questions: "Jak działa auth flow?"
- Dla specific questions użyj specific files

### Strategie dla różnych wielkości kontekstu

#### Small Context (< 10 plików)
```
Direct file references:
@src/feature/module.ts
@src/feature/types.ts
@tests/feature.test.ts
```

#### Medium Context (10-50 plików)
```
Folder + specific files:
@src/feature/ (overview)
@src/feature/critical-module.ts (szczegóły)
@docs/feature-architecture.md (big picture)
```

#### Large Context (50+ plików)
```
Hierarchical approach:
1. Start with documentation: @docs/architecture.md
2. Drill down: @src/feature-x/
3. Specific files as needed

Or use CLI tool with larger context window
```

---

## Wzorce strukturyzowanych promptów

### Dlaczego struktura ma znaczenie?

- **Jasność:** AI lepiej parsuje ustrukturyzowane dane
- **Separation of concerns:** Context oddzielony od wymagań
- **Reproducible:** Łatwe do templateowania i reużywania
- **Czytelność:** Dla ludzi i AI

### Pattern 1: XML-tagged prompts

**Najlepszy dla:** Complex, multi-faceted tasks z wieloma deliverables.

**Szablon:**

```xml
<task>
  [Krótki opis zadania - co ma zostać zrobione]
</task>

<context>
  <stack>
    <backend>[Backend stack]</backend>
    <frontend>[Frontend stack]</frontend>
    <database>[Database system]</database>
    <other>[Inne relevantne technologie]</other>
  </stack>

  <files>
    @[path/to/file1.ext] (opis roli pliku)
    @[path/to/file2.ext] (opis roli pliku)
  </files>

  <constraints>
    - [Constraint 1]
    - [Constraint 2]
    - [Constraint N]
  </constraints>
</context>

<requirements>
  <functional>
    - [Requirement 1]
    - [Requirement 2]
  </functional>

  <non-functional>
    - [Performance requirement]
    - [Security requirement]
    - [Maintainability requirement]
  </non-functional>

  <testing>
    - [Test requirement 1]
    - [Test requirement 2]
  </testing>
</requirements>

<output_format>
  1. [Deliverable 1]
  2. [Deliverable 2]
  3. [Deliverable N]
</output_format>
```

**Przykład użycia:**

```xml
<task>
  Zaimplementuj endpoint do tworzenia nowego użytkownika
</task>

<context>
  <stack>
    <backend>Node.js 20, Express 4, TypeScript 5</backend>
    <database>PostgreSQL 15, Prisma ORM</database>
    <auth>JWT tokens, bcrypt dla haseł</auth>
  </stack>

  <files>
    @src/routes/users.ts (istniejące endpointy)
    @src/models/User.ts (model użytkownika)
    @src/middleware/auth.ts (auth middleware)
    @prisma/schema.prisma (database schema)
  </files>

  <constraints>
    - API musi być RESTful
    - Rate limiting: 5 requests/minute per IP
    - Walidacja email i strong password
    - GDPR compliant (opt-in dla newsletter)
  </constraints>
</context>

<requirements>
  <functional>
    - POST /api/users endpoint
    - Walidacja: email (format), password (min 8 znaków, 1 cyfra, 1 special char)
    - Hash password przed zapisem (bcrypt, 12 rounds)
    - Sprawdź czy email już istnieje (409 Conflict jeśli tak)
    - Wyślij welcome email (background job)
    - Return JWT token w response
  </functional>

  <non-functional>
    - Response time <200ms (bez email sending)
    - Proper HTTP status codes
    - Error messages: user-friendly (client) + detailed (logs)
    - TypeScript strict mode (no any)
  </non-functional>

  <testing>
    - Unit tests dla validation logic
    - Integration test dla całego flow
    - Test edge cases: duplicate email, weak password, invalid format
  </testing>
</requirements>

<output_format>
  1. Endpoint implementation (src/routes/users.ts)
  2. Validation schemas (Zod)
  3. Tests (Vitest)
  4. OpenAPI documentation snippet
</output_format>
```

**Korzyści:**
- AI dostaje perfectly structured input
- Wszystkie wymagania jawne (mniej halucynacji)
- Łatwo reużyć jako template
- Możesz mieć XML prompt library w projekcie

### Pattern 2: JSON-structured prompts

**Najlepszy dla:** Automated workflows, API-driven AI interactions.

**Szablon:**

```json
{
  "task": "Description of the task",
  "context": {
    "files": ["path/to/file1", "path/to/file2"],
    "stack": {
      "language": "[your language]",
      "framework": "[your framework]",
      "database": "[your database]"
    }
  },
  "requirements": {
    "functional": ["req1", "req2"],
    "technical": ["tech1", "tech2"]
  },
  "output": {
    "format": "code",
    "files": ["output/file1.ts", "output/file2.ts"]
  }
}
```

**Przykład użycia:**

```json
{
  "task": "Generate CRUD API for Product entity",
  "context": {
    "files": [
      "src/models/Product.ts",
      "src/routes/index.ts"
    ],
    "stack": {
      "language": "TypeScript",
      "framework": "Express",
      "orm": "Prisma",
      "validation": "Zod"
    },
    "patterns": {
      "reference": "src/routes/users.ts",
      "description": "Follow patterns from users routes"
    }
  },
  "requirements": {
    "endpoints": ["GET /products", "POST /products", "GET /products/:id", "PUT /products/:id", "DELETE /products/:id"],
    "features": ["pagination", "filtering", "sorting"],
    "validation": "Zod schemas for all inputs",
    "errors": "Proper HTTP status codes and error messages",
    "auth": "Require authentication for POST/PUT/DELETE"
  },
  "testing": {
    "framework": "[your test framework]",
    "coverage": ["unit tests for validation", "integration tests for endpoints"]
  },
  "output": {
    "files": [
      "src/routes/products.ts",
      "src/validation/product.schemas.ts",
      "tests/routes/products.test.ts"
    ]
  }
}
```

### Pattern 3: Markdown-structured prompts

**Najlepszy dla:** Dokumentacja, human-readable specifications.

**Szablon:**

```markdown
# Task: [Nazwa zadania]

## Context
- **Tech Stack:** [lista technologii]
- **Files:** [lista plików]
- **Dependencies:** [lista dependencies]

## Requirements

### Functional
1. [Requirement 1]
2. [Requirement 2]

### Non-Functional
1. [Requirement 1]
2. [Requirement 2]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests passing

## Output
- [ ] File 1: [path]
- [ ] File 2: [path]
- [ ] Documentation updated
```

### Pattern 4: Template patterns dla specyficznych zadań

#### Debug Pattern
```markdown
# Bug Report

## Symptoms
[Co się dzieje / error message]

## Expected Behavior
[Co powinno się dziać]

## Context
- Files: @[relevant files]
- Stack trace: [paste stack trace]
- Environment: [dev/staging/prod, OS, versions]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. Error occurs

## Analysis Request
1. Identify root cause
2. Propose fix
3. Suggest prevention strategies
```

#### Refactoring Pattern
```markdown
# Refactoring Task

## Target
@[files or modules to refactor]

## Current Problems
- [Problem 1: code smell / tech debt]
- [Problem 2]

## Goals
- [Goal 1: improve maintainability]
- [Goal 2: reduce complexity]

## Constraints
- Maintain backwards compatibility
- Don't break existing tests
- Follow project patterns @[reference files]

## Deliverables
1. Refactored code
2. Updated tests (if needed)
3. Migration guide (if breaking changes)
```

#### Feature Implementation Pattern
```markdown
# Feature: [Feature Name]

## User Story
As a [role], I want [feature], so that [benefit].

## Acceptance Criteria
- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

## Technical Approach
- [ ] [Technical step 1]
- [ ] [Technical step 2]

## Files to Create/Modify
- [ ] @[path/file1] - [purpose]
- [ ] @[path/file2] - [purpose]

## Testing Strategy
- [ ] Unit tests for [component]
- [ ] Integration tests for [flow]
- [ ] E2E test for [user journey]

## Documentation
- [ ] Update README
- [ ] Add inline comments
- [ ] Update API docs
```

---

## Przepływy pracy w IDE

### Kiedy używać IDE z AI?

✅ **Użyj IDE gdy:**
- Prototypujesz nową feature
- Robisz quick edits (1-3 pliki)
- Potrzebujesz instant inline suggestions
- Chcesz interactive development z natychmiastowym feedbackiem
- Debugging z visual tools

❌ **NIE używaj IDE gdy:**
- Robisz large-scale refactoring (50+ plików)
- Potrzebujesz szerokiego repo context (użyj CLI)
- Pracujesz na zdalnej maszynie bez GUI (użyj CLI)
- Chcesz autonomous work (użyj agenta)

### Workflow dla nowej feature

#### 1. Planning (w Chat Mode)

```
Zaplanuj implementację [feature name]

Context:
@Codebase (zrozum istniejącą architekturę)
@[relevantne pliki]

Potrzebuję:
- Architecture overview
- Lista plików do create/modify
- Potencjalne breaking changes
- Testing strategy
- Estimated complexity
```

**Output:** Structured plan od AI.

#### 2. Review planu (Human-in-the-Loop)

**KRYTYCZNE:** Zawsze review plan przed implementacją.

Pytania do zadania:
- ✅ Czy plan ma sens architektonicznie?
- ✅ Czy AI nie pominął edge cases?
- ✅ Czy approach jest optymalny?
- ✅ Czy są breaking changes? Jak je zmitigować?

#### 3. Implementation (Multi-file Agent Mode)

```
Zaimplementuj według planu z poprzedniej konwersacji.

Context:
@src/components/ (gdzie changes)
@src/types/ (typy do update)
@src/api/ (API calls)

Zasady:
- Pamiętaj o testach
- Error handling dla wszystkich edge cases
- Accessibility (jeśli UI)
- Performance considerations

Step-by-step: Zacznij od [file], potem [file], etc.
```

**Dlaczego step-by-step:** AI lepiej radzi sobie z sekwencyjną implementacją niż "zrób wszystko naraz".

#### 4. Iterative Refinement (Inline Edit Mode)

Po podstawowej implementacji, użyj Inline Edit dla:
- Poprawki stylistyczne
- Drobne bugi
- Dodatkowe edge cases
- Performance tweaks

**Pattern:** Zaznacz fragment kodu → Inline Edit → "Zmień X na Y" lub "Zoptymalizuj to".

#### 5. Testing (Chat Mode)

```
Wygeneruj testy dla @src/features/NewFeature.tsx

Coverage:
- Happy path (główny flow)
- Edge cases ([wymień konkretne])
- Error states (network errors, validation errors)

Framework: [Vitest/Jest/Playwright]
Patterns: Follow @tests/examples/feature.test.tsx
```

#### 6. Documentation (Custom Command or Chat)

```
Dodaj dokumentację dla @src/features/NewFeature.tsx

Include:
- JSDoc/docstring z przykładami
- Parametry i return types
- Usage examples
- Known limitations
- Links do related code
```

### Tips & Tricks dla IDE

#### 💡 Rozpoczynaj prompt od symbolu @

```
✅ @src/api/users.ts jak mogę zoptymalizować to query?

❌ Jak mogę zoptymalizować query w users API?
   (AI musi najpierw znaleźć plik, potem analizować)
```

**Korzyść:** AI od razu dostaje context, mniej token waste.

#### 💡 Używaj Selection Context

```
1. Zaznacz fragment kodu (np. funkcję)
2. Użyj "Chat with selection" shortcut
3. Pytaj specyficznie o zaznaczenie
```

**Korzyść:** Oszczędza tokeny vs wklejanie całego pliku.

#### 💡 Chain of Thought w złożonych zadaniach

```
Pomyśl krok po kroku jak rozwiązać [problem].

1. Najpierw wyjaśnij approach (nie kod)
2. Rozważ alternatywne solutions
3. Wybierz najlepszy i wyjaśnij dlaczego
4. Dopiero wtedy implementuj
```

**Dlaczego:** "Thinking aloud" poprawia jakość rozwiązań AI.

#### 💡 Explicit Output Format

```
Odpowiedź w formacie:

## Problem Analysis
[analiza]

## Proposed Solution
[solution bez kodu]

## Implementation
```code```

## Trade-offs
[trade-offs tego rozwiązania]

## Testing Strategy
[jak to testować]
```

**Korzyść:** Structured output łatwiejszy do review i zrozumienia.

#### 💡 Incremental Changes

```
❌ "Zrefaktoruj cały moduł auth"
   (duże zmiany, trudne do review)

✅ "Zrefaktoruj auth - krok 1: extract validation logic"
✅ "Zrefaktoruj auth - krok 2: add token refresh"
✅ "Zrefaktoruj auth - krok 3: update tests"
```

**Korzyść:** Małe, manageable changes, łatwiejsze do review i rollback.

---

## Przepływy pracy CLI

### Kiedy używać AI CLI zamiast IDE?

CLI AI tools mają unikalne zalety w określonych scenariuszach:

#### ✅ Używaj CLI gdy:

**1. Praca na zdalnych maszynach**
- SSH do produkcji/staging
- Development na zdalnym serwerze
- Brak możliwości GUI

**2. Multi-file refactoring na dużą skalę**
- Renaming abstrakcji przez cały codebase (50+ plików)
- Migracje frameworków do nowszych wersji (z breaking changes)
- Update dependencies i fixing breaking changes
- Większy context window niż typowe IDE solutions

**3. Headless operations**
- Skrypty CI/CD
- Automated code generation pipelines
- Git hooks z AI assistance

**4. Exploration i onboarding**
- Zrozumienie unfamiliar codebase
- "Jak działa feature X w tym projekcie?"
- Generate architectural diagrams

**5. Gdy potrzebujesz ReAct mode (Reason + Act)**
- AI uruchamia komendy (npm test, curl, git blame)
- Czyta logi i stack traces
- Iteruje na podstawie rezultatów
- Autonomiczne debugging

**6. Flexibility & no vendor lock-in**
- Możesz zmieniać modele (różne API keys)
- On-prem / offline capabilities (niektóre tools)
- Działa z każdym editorem (vim, emacs, IntelliJ, VS Code)

#### ❌ NIE używaj CLI gdy:

- Potrzebujesz instant inline suggestions (IDE lepsze)
- Quick one-line edits (IDE Inline Edit szybsze)
- Visual debugging (IDE oferuje breakpoints, inspect variables)
- Autocomplete as-you-type (IDE specialized)

### Kluczowe możliwości CLI

#### 1. Broad Repository Context

CLI tools zazwyczaj mają szersze context window i lepiej rozumieją całe repo:

```bash
# Przykładowa komenda (składnia zależy od narzędzia)
ai-cli "Wyjaśnij mi jak działa cały auth flow w tym projekcie"

# AI przejrzy: routes, middleware, models, config, tests
# Wygeneruje: comprehensive explanation + diagram
```

#### 2. ReAct Mode (Reason + Act)

AI może:
- Uruchamiać komendy shell
- Czytać outputy i logi
- Iterować na podstawie rezultatów

**Przykład - Debugging z logs:**

```bash
ai-cli "Dlaczego API zwraca 500? Przeanalizuj logi i napraw."

# AI automatycznie zrobi:
# 1. tail -n 100 logs/error.log  (przeczyta logi)
# 2. Zidentyfikuje: NullPointerException in UserService:42
# 3. Otworzy src/services/UserService.ts
# 4. Znajdzie null pointer
# 5. Zaproponuje fix
# 6. Uruchomi testy
# 7. Jeśli fail → iterate
```

#### 3. Change Control

Przed zastosowaniem zmian, AI pokazuje diff:

```diff
# Przykładowy output narzędzia CLI:
--- src/api/users.ts
+++ src/api/users.ts
@@ -15,7 +15,10 @@
 export async function createUser(data: CreateUserDTO) {
-  const user = await db.user.create({ data });
+  const existingUser = await db.user.findUnique({
+    where: { email: data.email }
+  });
+  if (existingUser) throw new ConflictError('Email already exists');
+  const user = await db.user.create({ data });
   return user;
 }

Apply these changes? [y/n/e/q]
y = yes, n = no, e = edit, q = quit
```

**Kontrola:**
- Zobacz dokładnie co się zmieni
- Odrzuć niepotrzebne zmiany
- Edit przed apply
- Optional auto-commit po sukcesie

#### 4. Tool Integrations

**Git integration:**
```bash
ai-cli "Co zmieniło się w auth od v2.0?"
# AI uruchomi: git diff v2.0..HEAD -- src/auth/
# Przeanalizuje i wytłumaczy w języku ludzkim
```

**MCP (Model Context Protocol):**
- Integracja z external tools: Jira, Slack, Notion
- Access do databases (read-only dla bezpieczeństwa)
- Custom tooling (internal APIs)

**IDE plugins:**
- Extensions dla popularnych editorów
- Możesz zacząć w IDE, kontynuować w CLI

#### 5. Local i remote work

```bash
# Lokalne repo
cd ~/projects/myapp
ai-cli "Add user authentication"

# Zdalny server przez SSH
ssh deploy@prod-server
cd /var/www/myapp
ai-cli "Analyze why memory usage spiked at 2AM"
```

### Best Use Cases dla CLI

#### 1. Onboarding do unfamiliar repo

```bash
ai-cli "
Jestem nowy w tym projekcie. Stwórz mi onboarding guide:

Include:
- Główne komponenty i ich odpowiedzialności
- Flow danych (request → response)
- Najważniejsze abstrakcje i wzorce
- Jak setup dev environment
- Jak uruchomić testy
- Architectural diagram (Mermaid lub ASCII)

Output: Zapisz jako ONBOARDING.md
"
```

**Efekt:** Zamiast godzin czytania kodu, masz structured overview w kilka minut.

#### 2. Cross-file refactoring

```bash
ai-cli "
Zrefaktoruj 'UserProfile' na 'UserAccount' we wszystkich plikach.

Rules:
- Update imports
- Update type definitions
- Update JSDoc comments
- Update test descriptions
- Zachowaj backwards compatibility (dodaj deprecated alias)
- Generate migration guide

Show diff before applying.
"
```

**AI:**
- Znajdzie wszystkie wystąpienia
- Zrobi intelligent rename (nie słupie find-replace)
- Zachowa context w każdym pliku
- Pokaże diff przed apply

#### 3. Implementing complete CRUD module

```bash
ai-cli "
Zaimplementuj complete CRUD dla 'Product' entity.

Stack: [Twój stack]
Include:
- Database schema/migrations
- API routes/endpoints
- Business logic layer
- Validation schemas
- Error handling
- Unit + Integration tests

Follow patterns z istniejącej 'User' CRUD w projekcie.
Reference: @src/modules/user/
"
```

**AI przejrzy istniejące patterns i wygeneruje spójny kod.**

#### 4. Test generation

```bash
ai-cli "
Wygeneruj testy dla wszystkich plików w src/api/ które nie mają testów.

Framework: [Vitest/Jest/pytest/etc.]
Coverage: functions, branches, edge cases
Mock: database, external APIs
Output: [tests directory structure]

Generate summary report of coverage added.
"
```

#### 5. Debugging z logs/stack traces

```bash
# Skopiuj stack trace do pliku lub przekaż jako input
ai-cli "
Przeanalizuj error.log i napraw bug.

Steps:
1. Analyze stack trace
2. Identify root cause
3. Propose fix
4. Implement fix
5. Run tests
6. Iterate if needed (max 3 iterations)

Error log:
@logs/error.log
"
```

#### 6. Dependency migrations

```bash
ai-cli "
Migruj z [Old Library] na [New Library] w całym projekcie.

Steps:
1. Update package.json / requirements.txt / go.mod
2. Find all imports
3. Replace with equivalents (show mapping)
4. Update usage patterns
5. Update tests
6. Run tests po każdej zmianie
7. Generate migration checklist

Show detailed migration guide at the end.
"
```

#### 7. Code review assistance

```bash
# Po otrzymaniu PR do review
ai-cli "
Review PR #234 (użyj git diff main...feature-branch)

Check:
- Code quality & maintainability
- Security vulnerabilities (SQL injection, XSS, etc.)
- Performance issues
- Test coverage
- Breaking changes
- Edge cases handling
- Documentation completeness

Generate review comments in GitHub-compatible format.
"
```

#### 8. Documentation generation

```bash
ai-cli "
Wygeneruj API documentation dla wszystkich endpointów.

Source: src/api/
Format: OpenAPI spec (YAML/JSON)
Include:
- Parameters & types
- Response schemas
- Examples
- Error codes & messages
- Authentication requirements

Output: docs/api-spec.yaml

Also generate human-readable docs/API.md
"
```

### CLI Best Practices

#### 1. Start z exploration

Przed dużymi zmianami, zrozum codebase:

```bash
ai-cli "Wyjaśnij mi strukturę tego projektu, główne komponenty i ich relacje"
```

#### 2. Używaj Plan Mode dla destructive changes

Większość CLI tools oferuje plan approval:

```bash
# ✅ Z planem (safe)
ai-cli --plan "Refactor auth system to use OAuth"
# [review plan przed execution]
# [approve or modify]

# ⚠️ Bez planu (risky)
ai-cli --no-plan "Refactor auth system"
```

#### 3. Commit frequently

```bash
# Git status przed
git status

# AI changes
ai-cli "Implement feature X"

# Review diff
git diff

# Commit jeśli OK
git add .
git commit -m "feat: implement X (AI-assisted)"

# Easy rollback jeśli coś pójdzie źle
git reset --hard HEAD~1
```

#### 4. Combine z traditional tools

AI nie zawsze jest best tool dla zadania:

```bash
# ✅ Structural changes - use AST tools
jscodeshift -t transform.js src/

# ✅ Simple find-replace - use sed/rg
rg "oldName" --files-with-matches | xargs sed -i 's/oldName/newName/g'

# ✅ Complex logic changes - use AI
ai-cli "Refactor user auth to support multiple OAuth providers"
```

**Zasada:** Wybierz najmocniejsze narzędzie do zadania.

#### 5. Iterative refinement

```bash
# Session 1: High-level implementation
ai-cli "Implement user dashboard with basic widgets"

# Session 2: Tests
ai-cli "Add comprehensive tests for dashboard"

# Session 3: Polish
ai-cli "Improve accessibility and error handling in dashboard"
```

**Dlaczego:** Smaller, focused sessions dają lepsze rezultaty niż jeden gigantyczny prompt.

#### 6. Session management

CLI tools często mają session state:

```bash
# Start new session dla nowego task
ai-cli --new-session "Implement feature Y"

# Continue previous session
ai-cli --continue "Add tests for the changes we just made"

# List sessions
ai-cli --list-sessions
```

---

## Przepływy pracy z agentami asynchronicznymi

Async agents wykonują pełny cykl development bez ciągłego nadzoru, ale z checkpoints do approval.

### Kluczowe funkcje

#### Full Development Cycle

```
Issue → Planning → Implementation → Tests → PR → Review
```

Agent autonomicznie:
1. Czyta issue/ticket
2. Analizuje wymagania
3. Tworzy plan implementacji
4. Tworzy branch
5. Implementuje changes
6. Pisze testy
7. Uruchamia testy i fixuje jeśli fail
8. Commit + push
9. Otwiera PR
10. Czeka na human review

#### HITL (Human-in-the-Loop) Approval

**Plan Approval:**

Przed rozpoczęciem kodu, agent przedstawia plan:

```markdown
## Implementation Plan for Issue #234: Add dark mode

### Analysis
- User wants dark mode toggle in settings
- Should persist preference (localStorage + database)
- Needs to apply globally across all pages

### Changes Required
1. Add theme context (src/contexts/ThemeContext.[ext])
2. Create toggle component (src/components/ThemeToggle.[ext])
3. Update Layout to use theme
4. Add dark mode variants to existing components
5. Tests for theme switching

### Files to Create
- src/contexts/ThemeContext.[ext] (NEW)
- src/components/ThemeToggle.[ext] (NEW)

### Files to Modify
- src/components/Layout.[ext]
- src/components/Header.[ext]
- [config file for styling system]
- [8 other component files]

### Testing Strategy
- Unit: ThemeContext logic
- Integration: Toggle switches theme correctly
- E2E: Theme persists across pages and sessions

### Estimated Complexity
Medium (2-3 hours of agent work)

Approve to proceed? [Yes/No/Edit Plan]
```

**Twoja reakcja:**
- ✅ **Approve** → agent starts implementation
- ❌ **Reject** → agent stops, możesz wyjaśnić dlaczego
- ✏️ **Edit Plan** → poprawiasz plan, agent uses updated version

#### Sandbox Execution

Agent może uruchamiać:
- Tests (`npm test`, `pytest`, `go test`, etc.)
- Linter (`npm run lint`, `eslint`, `ruff`, etc.)
- Build (`npm run build`, `go build`, `cargo build`, etc.)
- Type checker (`tsc --noEmit`, `mypy`, etc.)

**Automatic iteration:**
```
1. Agent implementuje changes
2. Runs tests
3. Tests fail ❌
4. Agent analizuje failures
5. Fixes code based on error messages
6. Runs tests again
7. Tests pass ✅
8. Proceeds to next step
```

**Limit iteracji:** Zazwyczaj 3-5 tries. Jeśli nie uda się po N próbach → flaguje do human review.

**Przykład:**
```
Iteration 1: Tests fail (TypeError: undefined)
→ Agent fixes null check

Iteration 2: Tests fail (Validation error)
→ Agent updates validation schema

Iteration 3: Tests pass ✅
→ Agent proceeds to next file
```

#### Auto PR + Review Request

Po zakończeniu implementacji:

```markdown
✅ Implementation complete
✅ Tests passing (24/24)
✅ Lint passing
✅ Build successful
✅ Type check passing

Created PR #245: "feat: add dark mode toggle"
Branch: feature/dark-mode
Base: main

Requested review from: @you, @team-lead

## Summary
- Added ThemeContext with localStorage and database persistence
- Created ThemeToggle component in Header
- Updated 8 components with dark mode styles
- Added 12 unit tests, 3 integration tests, 2 E2E tests
- All checks passing ✅

## Testing
- Manually tested: theme switching, persistence, all pages
- Edge cases covered: missing localStorage, DB sync failure

## Screenshots
[Agent może załączyć screenshots jeśli ma browser access]
```

**Następny krok:** Ty robisz final review i merge (lub request changes).

### Kiedy używać agentów?

#### ✅ Perfect Use Cases:

**1. Bug Fixes z automated tests**
```
Issue: "User can submit form without email validation"

Agent:
- Przeczyta issue i zrozumie problem
- Znajdzie validation logic
- Naprawi bug (add email validation)
- Uruchomi testy
- Sprawdzi czy fix działa
- Utworzy PR z fix
```

**2. Implementing features z clear requirements**
```
User Story: "As a user, I want to filter products by category,
            so that I can find relevant items faster"

Agent:
- Przeanalizuje requirements
- Zaprojektuje solution (filter UI + backend logic)
- Zaimplementuje filter UI + API
- Napisze testy
- PR ready for review
```

**3. Dependency updates**
```
Task: "Update [Framework] vX → vY"

Agent:
- Update package.json / requirements.txt / go.mod
- Znajdzie breaking changes (przez docs lub changelog)
- Naprawi incompatibilities
- Uruchomi test suite
- Fix failing tests
- PR z migration notes
```

**4. Test coverage improvements**
```
Task: "Increase test coverage to 80% for src/api/"

Agent:
- Run coverage report
- Zidentyfikuje uncovered code
- Wygeneruje missing tests
- Run coverage again
- Iterate until target reached
- PR z new tests
```

**5. Documentation gaps**
```
Task: "Document all API endpoints w OpenAPI format"

Agent:
- Przejrzy kod endpointów
- Wyekstrahuje endpoint definitions
- Wygeneruje OpenAPI spec
- Add inline JSDoc/docstrings
- Update README z links
- PR z documentation
```

**6. Recurring repo hygiene**
```
Weekly task: "Update dependencies, fix lint warnings, update docs"

Agent:
- npm update / pip install --upgrade / go get -u
- npm audit fix / safety check --fix
- eslint --fix / ruff --fix
- Run tests
- Auto-PR jeśli wszystko green
- Weekly automation
```

**7. Code review automation**
```
On PR creation (GitHub Action trigger):

Agent:
- Analyze code changes
- Check style compliance
- Run security scan
- Detect code smells
- Suggest improvements
- Comment on PR with findings
```

#### ❌ Unikaj agentów dla:

- **Architectural decisions** - wymaga human judgment i business context
- **Sensitive security changes** - wymaga expert review (auth, crypto, permissions)
- **Breaking changes bez testów** - za duże ryzyko regression
- **Ambiguous requirements** - agent może źle zinterpretować intencję
- **Creative/design tasks** - AI nie zastąpi designera ani product ownera
- **First implementation of critical features** - lepiej human-led z AI assistance

### Async Agents Best Practices

#### 1. Write clear, structured issues

❌ **Źle:**
```
Dark mode doesn't work
```

✅ **Dobrze:**
```markdown
## Problem
Dark mode toggle in settings doesn't persist user preference.

## Expected Behavior
- User toggles dark mode → preference saved
- Preference persists across sessions (localStorage + DB sync)
- All pages reflect chosen theme immediately
- Works without JavaScript (progressive enhancement)

## Current Behavior
- Toggle works visually but resets on page refresh
- No persistence mechanism implemented

## Acceptance Criteria
- [ ] Preference saved to localStorage (immediate)
- [ ] Preference synced to user profile in DB (background)
- [ ] Theme applies globally across all pages
- [ ] Handles offline scenario (localStorage only)
- [ ] Tests for persistence logic
- [ ] E2E test for user journey

## Technical Context
- Theme system: [CSS variables / Tailwind classes / styled-components]
- State management: [Context API / Redux / Zustand]
- Backend: [API endpoint for user preferences]

## Related Files
- src/components/ThemeToggle.[ext]
- src/contexts/ThemeContext.[ext] (to be created)
- src/api/user-preferences.[ext]
```

**Dlaczego to działa:**
- Clear problem statement
- Expected behavior explicitly defined
- Acceptance criteria measurable
- Technical context provided
- Agent ma wszystkie informacje do zaplanowania

#### 2. Provide test infrastructure

Agent może napisać testy, ale potrzebuje:
- ✅ Test framework setup (Vitest, Jest, Playwright, pytest, RSpec)
- ✅ Example tests do naśladowania (patterns, utilities)
- ✅ Test utils, mocks, fixtures

**Setup checklist:**
```markdown
## Test Infrastructure Checklist
- [x] Unit test framework configured
- [x] Integration test setup ready
- [x] E2E test framework installed
- [x] Example tests in tests/examples/
- [x] Test utilities in tests/utils/
- [x] Mocks/fixtures in tests/fixtures/
- [x] CI runs tests automatically
```

❌ **Bez testów:** Agent może wygenerować kod bez weryfikacji → quality risk

#### 3. Set iteration limits

```markdown
Task: Implement feature X

Constraints:
- Max 3 iterations per file
- If tests don't pass after 3 tries, flag for human review
- Stop if build fails after 2 fix attempts
- Total time budget: 2 hours
```

**Korzyść:** Unikasz infinite loops i runaway costs.

#### 4. Review all PRs (HITL mandatory)

**NIGDY nie auto-merge AI PRs bez human review.**

Nawet jeśli wszystkie testy pass, human musi sprawdzić:
- ✅ Code quality & maintainability
- ✅ Logic correctness (testy mogą być incomplete)
- ✅ Edge cases coverage
- ✅ Security implications
- ✅ Performance considerations
- ✅ Alignment z długoterminową architekturą

**Review checklist:**
```markdown
## AI PR Review Checklist
- [ ] Code quality acceptable
- [ ] Logic correct (not just "works")
- [ ] Security: no vulnerabilities introduced
- [ ] Performance: no obvious bottlenecks
- [ ] Tests: comprehensive coverage
- [ ] Documentation: updated if needed
- [ ] Breaking changes: documented with migration path
- [ ] Aligns with project architecture
```

#### 5. Start small, scale gradually

**Progression plan:**

```
Week 1: Simple bugs in well-tested areas
        (agent builds trust, learns your codebase)

Week 2: Small features with clear requirements
        (agent proves capability)

Week 3: Refactorings with good test coverage
        (agent handles more complexity)

Month 2: Medium features
         (agent becomes reliable)

Month 3+: Complex features & autonomous maintenance
          (agent is trusted team member)
```

**Red flags na early stages:**
- Agent consistently needs >3 iterations
- Tests pass but logic is wrong
- Agent ignores project conventions
- Security issues in generated code

→ Scale back autonomy, provide more guidance.

#### 6. Monitor costs

Async agents mogą być expensive:
- Long sessions = wiele tokenów
- Multiple iterations = multiplied costs
- Failed attempts = wasted compute

**Cost management strategies:**

```markdown
## Budget Constraints
- Budget per task: $5 max
- Budget per week: $100 max
- If task exceeds budget → stop and flag for human

## Cost optimization
- Use cheaper model for simple tasks
- Use expensive model only for complex reasoning
- Cache common patterns (if tool supports)
- Reuse successful prompts/templates
```

**Monitor:**
- Cost per PR
- Cost per issue type
- ROI: cost vs time saved

**Alert thresholds:**
```
- Single task > $10 → investigate why
- Weekly spend > $150 → review efficiency
- Failed tasks costing >$5 → improve issue quality
```

#### 7. Provide architectural context

```markdown
## Architecture Context for Agents

### Project Structure
- src/features/[feature]/ - Feature modules (colocation pattern)
- src/shared/ - Shared utilities & components
- src/api/ - API client layer
- tests/ - Test files mirror src/ structure

### Design Patterns
- Feature folders (all related code together)
- Dependency injection for services
- Repository pattern for data access
- Factory pattern for complex object creation

### Data Flow
Request → Route → Controller → Service → Repository → Database
                                     ↓
                               Response ← DTO ← Entity

### Conventions
- File naming: kebab-case.ts
- Component naming: PascalCase
- Function naming: camelCase
- Test naming: [unit].test.ts, [unit].spec.ts

### Forbidden Patterns
❌ Direct DB access from controllers
❌ Business logic in routes
❌ Global state (use DI instead)
❌ any types (strict mode)
```

**Efekt:** Agent generuje kod consistent z architekturą.

---

## Matryca decyzyjna: Wybór podejścia

Jak wybrać między IDE, CLI, a agentem?

### Decision Matrix

| Kryteria | IDE AI | CLI AI | Async Agent |
|----------|--------|--------|-------------|
| **Szybkość response** | ⚡⚡⚡ Instant | ⚡⚡ Fast | ⚡ Slow (autonomous) |
| **Context window** | 🔵 Small-Medium | 🔵🔵 Large | 🔵🔵🔵 Very Large |
| **Files affected** | 1-10 | 10-100+ | 1-50 |
| **Human supervision** | 🔍🔍🔍 Continuous | 🔍🔍 Intermittent | 🔍 Checkpoints only |
| **Learning curve** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Advanced |
| **Autonomy level** | Low | Medium | High |
| **Best for** | Prototyping, quick edits | Refactoring, exploration | Features, maintenance |
| **Cost per task** | $ Low | $$ Medium | $$$ High |

### Decision Tree

```
START: Masz zadanie do wykonania z AI

│
├─ Czy to quick edit (1-3 pliki, <30 min)?
│  └─ YES → **Use IDE AI**
│     └─ Inline edit or Chat mode
│
├─ Czy to exploration/onboarding (zrozumienie codebase)?
│  └─ YES → **Use CLI AI**
│     └─ CLI ma większy context window
│
├─ Czy to large-scale refactoring (50+ plików)?
│  └─ YES → **Use CLI AI**
│     └─ CLI radzi sobie lepiej z multi-file changes
│
├─ Czy pracujesz na zdalnej maszynie bez GUI?
│  └─ YES → **Use CLI AI**
│     └─ CLI działa przez SSH
│
├─ Czy zadanie może być wykonane autonomicznie?
│  ├─ Are requirements clear and well-defined?
│  ├─ Is there good test coverage?
│  └─ All YES → **Consider Async Agent**
│     └─ Agent zrobi to sam z checkpoints
│
├─ Czy potrzebujesz ReAct mode (run commands, read output, iterate)?
│  └─ YES → **Use CLI AI**
│     └─ CLI może uruchamiać shell commands
│
└─ Default → **Use IDE AI**
   └─ Najłatwiejszy starting point
```

### Use Case Examples

#### Example 1: "Dodaj nowe pole do User modelu"

**Analysis:**
- Scope: 5-8 plików (model, migration, API, tests)
- Interactivity: Potrzebna natychmiastowa feedback
- Complexity: Medium

**Decision:** **IDE AI** (Multi-file agent mode)

**Workflow:**
1. Chat: "Zaplanuj dodanie pola 'phoneNumber' do User"
2. Review plan
3. Agent mode: Implementuj według planu
4. Review changes
5. Run tests
6. Commit

---

#### Example 2: "Zmień nazwę 'UserProfile' na 'UserAccount' w całym repo"

**Analysis:**
- Scope: 50+ plików
- Task type: Mechanical refactoring
- Context needed: Entire repository

**Decision:** **CLI AI**

**Workflow:**
```bash
ai-cli "Rename UserProfile to UserAccount across entire codebase.
Include: imports, types, comments, tests.
Show diff before applying."
```

---

#### Example 3: "Fix bug: email validation nie działa"

**Analysis:**
- Clear issue description
- Good test coverage exists
- Can be verified automatically

**Decision:** **Async Agent**

**Workflow:**
1. Create issue z repro steps
2. Agent reads issue
3. Agent creates plan (Human approves)
4. Agent implements fix
5. Agent runs tests (iterates if needed)
6. Agent creates PR
7. Human reviews & merges

---

#### Example 4: "Jak działa auth system w tym projekcie?"

**Analysis:**
- Exploration task
- Need broad understanding
- No code changes

**Decision:** **CLI AI**

**Workflow:**
```bash
ai-cli "Explain how authentication works in this project.
Include: flow diagram, key files, security measures.
Output: docs/AUTHENTICATION.md"
```

---

#### Example 5: "Update Framework vX → vY"

**Analysis:**
- Large scope (many files)
- Breaking changes possible
- Needs testing after each change

**Decision:** **CLI AI** or **Async Agent**

**CLI approach:**
```bash
ai-cli "Migrate framework from version X to Y.
Step by step:
1. Update dependency file (package.json/requirements.txt/go.mod)
2. Find breaking changes in changelog/docs
3. Fix incompatibilities
4. Run tests after each fix
Show progress and stop on errors."
```

**Agent approach:**
```markdown
Issue: Migrate [Framework] vX → vY

Steps:
1. Research breaking changes
2. Update dependencies
3. Fix code incompatibilities
4. Update tests
5. Verify build passes

Max iterations: 5 per file
Budget: $20
```

---

#### Example 6: "Prototyp nowego UI komponentu"

**Analysis:**
- Creative task
- Needs immediate visual feedback
- Iterative development

**Decision:** **IDE AI**

**Workflow:**
1. Chat: "Create Button component with variants"
2. Review generated code
3. Inline edit: "Make it more rounded"
4. Visual check in browser
5. Inline edit: "Add loading state"
6. Iterate until satisfied

---

### Quick Reference Table

| Task Type | Tool | Why |
|-----------|------|-----|
| Quick fixes (<3 files) | IDE | Speed & immediacy |
| Prototyping UI | IDE | Visual feedback |
| Large refactoring (50+ files) | CLI | Context window |
| Codebase exploration | CLI | Broad context |
| Remote server work | CLI | No GUI needed |
| Bug fixes (clear repro) | Agent | Autonomous + tests |
| Feature implementation | Agent | Full cycle automation |
| Recurring maintenance | Agent | Scheduled automation |
| Code review | CLI/Agent | Automated analysis |
| Documentation generation | CLI/Agent | Batch processing |

---

## Odniesienia krzyżowe

### Dokumenty powiązane

- **`01-core-principles.md`** - Fundamenty pracy z AI, prompt engineering, project characteristics
- **`03-tools-landscape-[version].md`** - Konkretne rekomendacje narzędzi (versioned, quarterly updates)

### Powiązane sekcje

#### Z tego dokumentu:
- [Konfiguracja podstawowa](#konfiguracja-podstawowa) ← Zacznij tutaj jeśli nowy projekt
- [Matryca decyzyjna](#matryca-decyzyjna-wybór-podejścia) ← Nie wiesz którego narzędzia użyć?
- [Wzorce strukturyzowanych promptów](#wzorce-strukturyzowanych-promptów) ← Chcesz lepszych rezultatów?

#### Z Document 1 (Core Principles):
- **Philosophy & HITL** → Dlaczego human oversight jest krytyczny
- **Prompt Engineering** → Jak pisać efektywne prompty (5-element anatomy)
- **AI-Friendly Projects** → Jak strukturyzować projekt dla lepszej współpracy z AI
- **Best Practices** → DO and DON'T patterns

### Gdy potrzebujesz pomocy

**Problem:** "Nie wiem którego narzędzia użyć"
→ Zobacz: [Matryca decyzyjna](#matryca-decyzyjna-wybór-podejścia)

**Problem:** "AI generuje niskiej jakości kod"
→ Zobacz: `01-core-principles.md` - Prompt Engineering + Project Characteristics

**Problem:** "AI nie rozumie mojego projektu"
→ Zobacz: [Project Instructions](#4-project-instructions---naucz-ai-jak-pracować-w-twoim-projekcie)

**Problem:** "Chcę wiedzieć które konkretne narzędzie wybrać"
→ Zobacz: `03-tools-landscape-[version].md` (time-bound recommendations)

**Problem:** "AI robi za dużo zmian na raz"
→ Zobacz: [IDE Tips & Tricks](#tips--tricks-dla-ide) - Incremental Changes pattern

**Problem:** "Agent zrobił złe zmiany"
→ Zobacz: [Async Best Practices](#async-agents-best-practices) - Clear issues + Review mandatory

---

## Podsumowanie

**Key Takeaways:**

1. **Wybierz właściwe narzędzie do zadania**
   - IDE: Quick edits, prototyping, visual feedback
   - CLI: Large refactoring, exploration, remote work
   - Agent: Autonomous features, maintenance, clear requirements

2. **Zawsze strukturyzuj prompty**
   - XML/JSON/Markdown patterns
   - Clear context + requirements + output format
   - Reusable templates dla recurring tasks

3. **Context management is critical**
   - Minimalizuj zbędny kontekst
   - Używaj specific file references
   - Odświeżaj kontekst przy zmianie tematu

4. **Human-in-the-Loop zawsze**
   - Review AI plans przed implementacją
   - Review AI code przed merge
   - Never auto-merge bez oversight

5. **Iterative > Big Bang**
   - Małe, focused tasks
   - Incremental changes
   - Easy to review, easy to rollback

6. **Project setup matters**
   - Project instructions file (nazwa zależna od narzędzia)
   - Good test infrastructure
   - Clear conventions w dokumentacji

7. **Monitor & optimize**
   - Track costs (especially agents)
   - Measure time saved vs manual work
   - Iterate on your prompts & workflows

---

**Next Steps:**

- ✅ Skonfiguruj privacy mode w swoim narzędziu
- ✅ Stwórz project instructions file
- ✅ Zapisz reusable prompt templates
- ✅ Ćwicz keyboard shortcuts (tydzień)
- ✅ Przeczytaj `01-core-principles.md` dla głębszego zrozumienia
- ✅ Zobacz `03-tools-landscape-[version].md` dla konkretnych rekomendacji

---

**Koniec dokumentu**
