# 01. Jak napisać pierwszy dobry prompt do AI?

**Problem:** "Nie wiem jak napisać prompt. Piszę 'fix this' albo 'add feature' i AI zwraca coś dziwnego albo nie to co chciałem."

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ Zaczynasz pracę z AI (ChatGPT, Copilot, Claude) i nie wiesz od czego zacząć
- ✅ Twoje prompty są zbyt ogólne ("fix this", "make it better")
- ✅ AI zwraca coś, ale nie to co chciałeś
- ✅ Spędzasz 10+ minut na "doprecyzowaniu" tego samego prompta
- ✅ Chcesz nauczyć się systematycznego podejścia do promptowania

**Ile czasu to zajmie:** 30-45 min (czytanie + ćwiczenia)

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"Piszę 'fix this' do AI i dostaję coś kompletnie innego niż chciałem..."**

> **"Nie wiem jak opisać co chcę żeby AI zrobiło..."**

> **"AI zwraca 200 linii kodu a ja chciałem tylko małą poprawkę..."**

> **"Widzę że inni dostają lepsze rezultaty z AI, ale nie wiem jak oni to robią..."**

> **"Czy AI mnie rozumie w ogóle? Czuję się jakbym mówił do ściany..."**

**Normalne że się tak czujesz!** Wszyscy na początku mieli problem z promptowaniem. To umiejętność którą można się nauczyć.

---

## ✅ Checklist: Jak napisać dobry prompt (wzór 3C)

Dobry prompt składa się z **3C**: **Command** + **Context** + **Constraints**

### 📍 Krok 1: Command (Polecenie) - CO chcę żeby AI zrobił?

**Zasada:** Zacznij od **czasownika** (action verb). Bądź precyzyjny.

**Złe przykłady (unikaj!):**
```
❌ "calculateDiscount"                    → Co z tym mam zrobić?
❌ "Coś jest nie tak z dyskontem"         → Co dokładnie?
❌ "Pomyśl o testach"                     → Za ogólne
❌ "Ten kod jest dziwny"                  → Dziwny jak? Co poprawić?
❌ "fix this"                             → Fix WHAT? HOW?
```

**Dobre przykłady (rób tak!):**
```
✅ "Refactor the calculateDiscount function to use pattern matching"
✅ "Generate unit tests for the UserService class"
✅ "Debug why the database query takes longer than 500ms"
✅ "Add error handling to the login endpoint"
✅ "Explain what this regular expression does: /^[a-z0-9]+$/"
```

**Action verbs do użycia:**
- **Modyfikacja kodu:** Refactor, Optimize, Simplify, Extract, Rename
- **Tworzenie:** Generate, Create, Add, Implement, Write
- **Debug:** Debug, Diagnose, Find, Identify, Fix
- **Analiza:** Explain, Review, Analyze, Compare, Evaluate
- **Testy:** Test, Validate, Verify, Check

---

### 📍 Krok 2: Context (Kontekst) - GDZIE i DLACZEGO?

**Zasada:** AI nie zna Twojego projektu. Musisz mu powiedzieć co jest istotne.

**Co zawrzeć w kontekście (wybierz co pasuje):**

#### A) Tech Stack
```
Tech: TypeScript 5.0, React 18, Node.js 20, PostgreSQL 15
Framework: Next.js 14 (App Router)
Styling: Tailwind CSS 3.x
State: Zustand
Testing: Vitest + Testing Library
```

**Dlaczego to ważne:**
AI może zaproponować rozwiązanie w złym frameworku albo outdated syntax.

#### B) File & Current State
```
File: src/components/ProductCard.tsx (attached)
Current state:
  - Component renders product info
  - Uses useState for discount calculation
  - Re-renders on every filter change (performance issue!)
```

**Dlaczego to ważne:**
AI widzi co już masz i może budować na tym zamiast pisać od zera.

#### C) Problem Description
```
Problem:
  When user changes filter (price, category), ALL ProductCards re-render
  even if the filter doesn't affect them. This causes lag with 100+ products.

Expected:
  Only affected ProductCards should re-render.
```

**Dlaczego to ważne:**
AI rozumie DLACZEGO chcesz coś zmienić, nie tylko CO.

#### D) Constraints & Requirements
```
Constraints:
  - Must support IE11 (no modern JS features without polyfills)
  - Keep existing prop interface (don't break parent components)
  - Max bundle size increase: 10KB

Requirements:
  - Solution must be testable (provide test examples)
  - Follow team code style (ESLint strict mode)
```

**Dlaczego to ważne:**
AI nie wymyśli rozwiązania które łamie Twoje ograniczenia.

#### E) Business Domain (opcjonalnie)
```
Domain: E-commerce platform (B2C)
Users: 100k+ monthly active users
Critical: This component is on the main product listing page (high traffic)
```

**Dlaczego to ważne:**
AI rozumie że to nie jest "toy project" tylko production code.

---

### 📍 Krok 3: Constraints (Format & Ograniczenia) - JAK ma wyglądać rezultat?

**Zasada:** Określ **format wyjścia** i **style** odpowiedzi.

**Przykłady formatów:**

#### A) Format kodu
```
Format:
  - Return only the refactored function (not the entire file)
  - Include JSDoc comments
  - Use TypeScript strict mode types
  - Add inline comments for complex logic
```

#### B) Format odpowiedzi tekstowej
```
Format:
  - Step-by-step numbered list (1-10 steps max)
  - Include code snippets for each step
  - Highlight potential gotchas with ⚠️
```

#### C) Format strukturalny
```
Format: JSON with this structure:
{
  "issue": "description of the bug",
  "rootCause": "why it happens",
  "fix": "code to fix it",
  "test": "unit test to verify fix"
}
```

#### D) Format porównania
```
Format: Markdown table
| Approach | Pros | Cons | Performance | Difficulty |
|----------|------|------|-------------|-----------|
```

---

## 💡 Przykład: Bad vs Good Prompt (Before/After)

### ❌ BEFORE: Weak Prompt

```
"fix this code

[wkleja 50 linii kodu bez opisu]"
```

**Dlaczego to słaby prompt:**
- Brak precyzyjnego polecenia ("fix" - fix WHAT?)
- Brak kontekstu (tech stack? co jest broken?)
- Brak ograniczeń (jak ma wyglądać fix?)
- AI musi **zgadywać** co chcesz

**Rezultat:** AI zwróci coś randomowego, pewnie nie to co chciałeś. Stracisz 10 min na iteracje.

---

### ✅ AFTER: Strong Prompt (3C)

```
**Command:**
Refactor the `calculateDiscount` function to handle edge cases and improve readability.

**Context:**
Tech: TypeScript 5.0, Node.js 20
File: src/utils/pricing.ts
Domain: E-commerce platform (B2C)

Current code:
```typescript
function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent);
}
```

Problems:
1. Doesn't handle edge cases (negative prices, > 100% discount)
2. No input validation
3. No error handling

**Constraints:**
- Keep the same function signature (don't break callers)
- Add JSDoc comments
- Handle these edge cases:
  - price = 0 → return 0
  - price < 0 → throw Error
  - discountPercent < 0 or > 1 → throw Error
- Return type: number (no nulls)
- Add inline comments for edge case handling

Format: Return the complete refactored function with tests.
```

**Dlaczego to mocny prompt:**
- ✅ Jasne polecenie: "Refactor... to handle edge cases"
- ✅ Pełen kontekst: tech stack, file, domain, current code, problems
- ✅ Konkretne constraints: edge cases, format, requirements
- ✅ AI ma wszystko czego potrzebuje aby wykonać task

**Rezultat:** AI zwróci dokładnie to czego potrzebowałeś, za pierwszym razem. Oszczędzisz 10 min.

---

## 🛠️ Warsztat: Przepisz swój prompt na 3C

**Ćwiczenie praktyczne (5 min):**

### Your Weak Prompt (przykład z życia):
```
"Ten komponent jest wolny, napraw to"
```

### Przepisz używając 3C:

**1. Command (Co?):**
```
Optimize the [ComponentName] component to reduce render time
```

**2. Context (Gdzie? Dlaczego?):**
```
Tech: React 18 + TypeScript
File: src/components/[ComponentName].tsx
Problem: Renders in 500ms, should be < 100ms
Current implementation: Uses inline functions in JSX (causes re-renders)
```

**3. Constraints (Jak?):**
```
- Use React.memo and useCallback
- Don't change props interface
- Provide before/after performance measurements
- Add comments explaining optimization
```

### Final Prompt:
```
Command: Optimize the ProductList component to reduce render time from 500ms to < 100ms

Context:
Tech: React 18 + TypeScript 5
File: src/components/ProductList.tsx
Problem: Component re-renders unnecessarily when parent state changes
Current: Uses inline arrow functions in map() and onClick handlers

Constraints:
- Use React.memo and useCallback for optimization
- Keep existing props interface
- Add performance comments (/* Optimized: ... */)
- Provide before/after benchmark

Format: Return refactored component with explanation of changes.
```

**Try it yourself!** Weź swój ostatni weak prompt i przepisz go używając tej struktury.

---

## 🎨 Template do skopiowania

**Skopiuj ten szablon do swojego IDE/notatnika:**

```markdown
## Prompt Template (3C)

**Command:** [Action verb] the [what] to [goal]

**Context:**
Tech: [Your stack]
File: [Path to file]
Problem: [What's wrong / what needs to be done]
Current state: [How it works now]

**Constraints:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Format:** [How should the output look]

---

[Insert code / additional info here]
```

**Użyj tego template przy następnym promptowaniu!**

Możesz też zapisać ten template w:
- IDE snippet (VS Code: User Snippets)
- Clipboard manager (paste repeatedly)
- `templates/prompt-template.md` w tym repo

---

## 🧪 Mini-case study: Junior Kasia pisze prompt

**Sytuacja:**
Junior Kasia dostała task: "Add validation to the registration form".

### Iteracja 1: Weak Prompt
```
Kasia: "Add validation to registration form"
```

**AI response:**
```typescript
// AI returns generic form validation
// but doesn't match Kasia's framework (she uses React Hook Form)
// and validation rules are wrong (email regex is too strict)
```

**Rezultat:** Kasia musi przepisać wszystko. Strata 20 min.

---

### Iteracja 2: Stronger Prompt (po przeczytaniu tej checklisty)
```
Kasia: "Add client-side validation to the user registration form

Context:
Tech: React 18, TypeScript 5, React Hook Form 7.x, Zod for schemas
File: src/components/auth/RegisterForm.tsx
Current state: Form has 4 fields (email, password, confirmPassword, terms)
              Currently no validation (submits even with empty fields)

Requirements:
- Email: valid email format
- Password: min 8 chars, must include: uppercase, lowercase, number
- ConfirmPassword: must match password
- Terms: must be checked (required)

Constraints:
- Use Zod schema (integrate with React Hook Form)
- Show validation errors inline (below each field)
- Disable submit button until all valid
- Keep existing Tailwind styling

Format: Return complete component with Zod schema definition."
```

**AI response:**
```typescript
// AI returns EXACTLY what Kasia needs:
// - Zod schema with correct rules
// - React Hook Form integration
// - Inline error display
// - Matching her tech stack
```

**Rezultat:** Kasia copy-paste, minor tweaks, działa. Oszczędność 20 min.

---

**Lekcja:**
**2 minuty** na napisanie dobrego prompta oszczędza **20 minut** na poprawkach.

---

## ⚠️ Red Flags: Kiedy STOP i przemyśl prompt

Jeśli widzisz te sygnały, STOP i przepisz prompt:

### 🚨 Signal 1: AI zwraca ogólną odpowiedź
```
AI: "You can use a library like validator.js or write custom validation..."
```
**Co to znaczy:** Prompt był za ogólny. AI nie wie CO dokładnie chcesz.

**Fix:** Dodaj więcej Context i Constraints (tech stack, concrete requirements).

---

### 🚨 Signal 2: AI generuje w złym języku/frameworku
```
// Ty używasz TypeScript + React
// AI zwraca vanilla JavaScript + jQuery
```
**Co to znaczy:** Nie podałeś tech stack w kontekście.

**Fix:** Dodaj Context: Tech stack i wersje.

---

### 🚨 Signal 3: AI zwraca za dużo / za mało kodu
```
// Chciałeś refactor 1 funkcji
// AI zwrócił cały plik (500 linii)
```
**Co to znaczy:** Nie określiłeś formatu wyjścia.

**Fix:** Dodaj Constraints: Format ("return only the refactored function").

---

### 🚨 Signal 4: Iterujesz 3+ razy i dalej nie to
```
Próba 1: "Fix this"           → za ogólne
Próba 2: "Fix the bug"        → trochę lepiej ale AI confused
Próba 3: "Fix validation bug" → AI zwraca randomowe zmiany
```
**Co to znaczy:** Incremental fixes nie działają. Czas zacząć od zera.

**Fix:** Przepisz prompt using 3C template (clean slate).

---

### 🚨 Signal 5: AI zaczyna halucynować
```
AI: "Use the super-validator-pro library for validation..."
// Biblioteka nie istnieje!
```
**Co to znaczy:** AI nie ma kontekstu więc wymyśla.

**Fix:** Dodaj Context (konkretne biblioteki które używasz: "Use Zod library").

---

## 🎯 Progression: Od podstaw do zaawansowanego

### Level 1: Absolute Beginner (Ty jesteś tutaj!)
**Goal:** Nauczyć się wzoru 3C (Command + Context + Constraints)

**Checklist:**
- [ ] Rozumiem czym jest Command (action verb)
- [ ] Potrafię opisać Context (tech stack, problem)
- [ ] Umiem określić Constraints (format, requirements)
- [ ] Używam template przy każdym promptowaniu

**When ready:** Przejdź do Level 2 (po ~1 tygodniu praktyki)

---

### Level 2: Praktyk (za 1-2 tygodnie)
**Goal:** Opanować advanced Context i iterację

**Skills:**
- Dodawanie git log do kontekstu ("previous attempt failed because...")
- Opisywanie business domain w promptach
- Szybkie iterowanie gdy pierwszy prompt nie zadziałał
- Meta-prompting (używanie AI do poprawy promptów)

**Resources:**
- `02-ai-nie-rozumie-wymagan.md` - gdy AI nie łapie co chcesz
- Advanced material: `01-core-principles.md` § Meta-Promptowanie

---

### Level 3: Ekspert (za 1-2 miesiące)
**Goal:** Advanced techniques (Socratic Method, Multi-Model Strategy)

**Skills:**
- Metoda sokratejska (AI zadaje TOBIE pytania)
- Multiple perspectives (AI pokazuje 3 rozwiązania, Ty wybierasz)
- Używanie różnych modeli do różnych tasków
- Chain-of-thought prompting dla complex problems

**Resources:**
- Advanced material: `01-core-principles.md` (full doc)

---

## 🧰 Narzędzia i zasoby

### Narzędzia do promptowania

**1. IDE Extensions (autocomplete promptów):**
- VS Code: "Prompt Snippets" extension
- Save 3C template as User Snippet w VS Code

**2. Clipboard Managers:**
- macOS: Alfred / Raycast (snippets)
- Windows: Ditto Clipboard Manager
- Linux: CopyQ

**3. Dedicated Prompt Tools:**
- PromptPerfect (online tool to improve prompts)
- ChatGPT Prompt Generator (meta-prompting tool)

---

### Quick Reference: Wzór 3C (wydrukuj to!)

```
┌─────────────────────────────────────────────────┐
│  FORMULA: 3C = Command + Context + Constraints │
└─────────────────────────────────────────────────┘

1️⃣  COMMAND (CO?)
   → Action verb + what + goal
   → "Refactor the X to do Y"

2️⃣  CONTEXT (GDZIE? DLACZEGO?)
   → Tech stack (TypeScript, React, etc.)
   → File path + current state
   → Problem description
   → Business domain (optional)

3️⃣  CONSTRAINTS (JAK?)
   → Requirements (must have X, Y)
   → Limitations (no library Z, max size W)
   → Format (return JSON, markdown, code only)

📌 REMEMBER:
   - 2 min na prompt > 20 min na fixes
   - Be specific, not vague
   - Give AI what it needs to succeed
```

---

## 🔗 Powiązane checklisty

**Następny krok:**
- [ ] `02-ai-nie-rozumie-wymagan.md` - gdy AI źle interpretuje wymagania
- [ ] `03-gdy-ai-gada-glupoty.md` - weryfikacja outputu (hallucinations)

**Zobacz też:**
- [ ] `templates/prompt-template.md` - gotowy template do skopiowania
- [ ] `00-GLOSSARY.md` - jeśli jakiś termin jest niejasny

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading** (gdy opanujesz podstawy):
- `backup/10xdevs-2ed/.../01-core-principles.md` § Mistrzostwo w promptowaniu (linie 101-453)
  - Meta-promptowanie (use AI to improve prompts)
  - Metoda sokratejska (AI asks YOU questions)
  - Multiple perspectives (AI shows 3 solutions)
  - 5-element anatomy (Command, Context, Format, Role, Examples)

**External resources:**
- OpenAI: "Best practices for prompting" (official docs)
- Anthropic: "Prompt engineering guide" (Claude-specific)
- Learn Prompting (learnprompting.org) - comprehensive course

---

## ✅ Self-assessment: Czy opanowałem tę checklistę?

Odznacz gdy poczujesz się komfortowo:

- [ ] Potrafię zdefiniować Command (action verb + what + goal)
- [ ] Umiem opisać Context (tech stack, problem, current state)
- [ ] Określam Constraints (requirements, format, limitations)
- [ ] Używam 3C template przy każdym promptowaniu
- [ ] Rozpoznaję red flags (AI zwraca coś dziwnego → przepisuję prompt)
- [ ] Przepisałem conajmniej **3 real prompty** używając 3C
- [ ] Zauważyłem **poprawę jakości** odpowiedzi od AI

**Jeśli odznaczone:** Congratulations! 🎉 Przejdź do `02-ai-nie-rozumie-wymagan.md`

**Jeśli nie:** Spróbuj przepisać kolejne 3 prompty używając 3C template. Praktyka makes perfect!

---

## 💬 Troubleshooting: Common Questions

**Q: Czy muszę używać angielskiego w promptach?**
A: Zalecane, ale nie wymagane. AI działa lepiej po angielsku (więcej danych treningowych). Jeśli Twój angielski jest słaby - użyj polskiego, ale kod i komentarze pisz po angielsku.

**Q: Jak długi powinien być dobry prompt?**
A: 5-15 linii dla typowego taska. Jeśli > 20 linii, prawdopodobnie task jest za duży (podziel na mniejsze).

**Q: Co jeśli nie znam wszystkich elementów kontekstu?**
A: Podaj to co wiesz. Jeśli nie znasz tech stack - poproś AI: "Check the attached file and identify the tech stack used".

**Q: Czy powinienem zawsze używać pełnego 3C template?**
A: Dla simple tasks (typo fix, rename) możesz skrócić. Dla medium/complex tasks - użyj pełnego 3C.

**Q: Co jeśli AI zwraca coś ale nie to co chciałem?**
A: NIE iteruj dodając "but also X". Przepisz prompt od zera używając 3C. Clean slate > incremental fixes.

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 101-213)
- Długość: ~550 linii
- Czas przeczytania: 30-45 min
- Target audience: Junior developers (0-2 lata doświadczenia)
- Metodologia: Sense-Making (Situation → Gap → Help)
