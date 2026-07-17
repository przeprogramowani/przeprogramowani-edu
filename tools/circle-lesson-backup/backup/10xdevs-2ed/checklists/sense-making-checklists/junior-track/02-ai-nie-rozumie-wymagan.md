# 02. Co robić gdy AI nie rozumie moich wymagań?

**Problem:** "Napisałem prompt ale AI zwraca coś kompletnie innego niż to czego potrzebowałem. Wydaje się że AI mnie nie rozumie."

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ AI zwrócił rozwiązanie ale to nie to co chciałeś (problem z komunikacją wymagań)
- ✅ Dostałeś task od PM/seniora i nie wiesz jak przetłumaczyć to na prompt
- ✅ Wiesz co chcesz osiągnąć (business goal) ale nie wiesz jak to wyrazić technicznie
- ✅ AI rozwiązuje inny problem niż ten który masz
- ✅ Czujesz że "coś jest nie tak" z odpowiedzią AI ale nie wiesz co

**Ile czasu to zajmie:** 30-45 min (czytanie) + praktyka

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"Dostałem task 'add validation to form' ale nie wiem jakie validation rules..."**

> **"AI wygenerował kod ale rozwiązuje inny problem niż ten który mam..."**

> **"PM powiedział 'make it faster' ale jak mam to przetłumaczyć na prompt?"**

> **"Napisałem co chcę i AI pyta mnie o 100 rzeczy których nie wiem..."**

> **"Czuję że AI nie łapie sensu tego co próbuję osiągnąć..."**

> **"Może po prostu jestem za głupi aby używać AI?"**

**STOP! To nie Twoja wina!** Problem nie jest w tym że jesteś "za głupi". Problem jest w tym że:
1. Wymagania które dostałeś są niejasne (common!)
2. Nie wiesz jeszcze jak "tłumaczyć" business language na technical prompts (nauczysz się!)
3. AI potrzebuje więcej kontekstu niż myślałeś (to jest OK)

**Ta checklist nauczy Cię jak wypełnić tę lukę.**

---

## ✅ Checklist: Jak komunikować wymagania do AI

### 📍 Krok 1: Zidentyfikuj "typ niejasności" w wymaganiach

Zanim zaczniesz promptować, odpowiedz sobie na pytanie: **Czego nie wiem?**

#### Typ A: "Wiem CO chcę, ale nie wiem JAK to opisać technicznie"

**Przykład:**
```
Task from PM: "Users complain that checkout is slow. Make it faster."

Twoje myśli:
- ✅ Wiem CO: make checkout faster
- ❌ Nie wiem JAK: co konkretnie jest wolne? Database? Frontend? API?
- ❌ Nie wiem ILE: jak szybko powinno być? 1s? 100ms?
```

**Action:** Przejdź do Krok 2A (Socratic Method - niech AI Ci pomoże sprecyzować).

---

#### Typ B: "Znam wymagania biznesowe, ale nie wiem jak to zaimplementować"

**Przykład:**
```
Task: "Add discount system for VIP users (10% off all products)"

Twoje myśli:
- ✅ Wiem CO: VIP users get 10% discount
- ❌ Nie wiem JAK: gdzie to liczyć? Frontend czy backend?
- ❌ Nie wiem WHERE: do jakiego pliku to dodać?
- ❌ Nie wiem EDGE CASES: co jeśli produkt już ma discount?
```

**Action:** Przejdź do Krok 2B (Exploratory Prompting - niech AI pokaże opcje).

---

#### Typ C: "Dostałem vague task i nie wiem co konkretnie zrobić"

**Przykład:**
```
Task from senior: "Improve the user profile page"

Twoje myśli:
- ❌ Nie wiem CO: improve w jakim sensie? Performance? UX? Design?
- ❌ Nie wiem DLACZEGO: jaki jest problem z current implementation?
- ❌ Nie wiem SCOPE: całkowity redesign czy małe tweaks?
```

**Action:** STOP! Najpierw zapytaj seniora/PM o clarification. Potem przejdź do Krok 3.

---

### 📍 Krok 2A: Socratic Method - Niech AI zada TOBIE pytania

**Kiedy użyć:** Gdy masz vague requirements i potrzebujesz pomocy w sprecyzowaniu.

**Magiczna fraza (skopiuj to!):**
```
Before you start working on this task, ask me 5-10 clarifying questions to better understand:
- Technical context (what tech we use, current implementation)
- My goals (what I'm trying to achieve, why)
- What I might have missed or forgotten
- Assumptions to verify (what might be unclear or ambiguous)

After I answer, propose a solution.

Task: [Twoje vague requirements]
```

---

**Przykład real-world:**

```
Junior Tomek's task:
"Add search functionality to the product listing page"

Tomek's prompt:
---
Before you start, ask me 5-10 clarifying questions to understand:
- Technical context
- My goals
- What I might have missed
- Assumptions to verify

Task: Add search functionality to the product listing page.

Tech: React 18 + TypeScript, currently using static product list.
---

AI response:
"Great! Before I design the solution, let me ask:

1. **Search scope:** Search by product name only, or also description, SKU, category?
2. **Search type:** Real-time (as-you-type) or button-based search?
3. **Backend:** Do you have a search API endpoint, or should we search client-side?
4. **Performance:** How many products? (10? 100? 10,000?) - affects approach
5. **UX:** Where should the search box be placed? (top bar, sidebar, inline?)
6. **Filtering:** Should search work WITH existing filters (price, category) or replace them?
7. **Results:** Show all results on same page or paginate?
8. **Debouncing:** Should we debounce input to avoid too many requests?
9. **Empty state:** What to show when no results found?
10. **Highlighting:** Highlight matched terms in results?"

Tomek's aha moment:
"Wow! Nie pomyślałem o połowie tych rzeczy! Teraz wiem o co zapytać PM!"
```

**Korzyści:**
- ✅ AI ujawnia "unknown unknowns" - rzeczy o których zapomniałeś
- ✅ Dostajesz listę pytań do zadania PM/seniorowi
- ✅ Lepiej rozumiesz scope taska
- ✅ Unikasz implementacji która nie spełnia wymagań

---

### 📍 Krok 2B: Exploratory Prompting - Niech AI pokaże opcje

**Kiedy użyć:** Gdy znasz CO chcesz osiągnąć, ale nie wiesz KTÓRY approach wybrać.

**Template (skopiuj to!):**
```
Show me 3-5 different approaches to [task], each with:
- Brief description (1-2 sentences)
- Pros & cons
- Estimated complexity (Simple / Medium / Complex)
- When to use this approach
- Code example (if applicable)

Then recommend the best 1-2 approaches for my context.

Task: [Twój task]
Context: [Tech stack, constraints, current state]
```

---

**Przykład real-world:**

```
Junior Ania's task:
"Store user preferences (theme, language, notification settings)"

Ania's prompt:
---
Show me 3-5 different approaches to storing user preferences (theme, language, notifications), each with:
- Description
- Pros & cons
- Complexity
- When to use
- Code example

Then recommend best approach.

Context:
- Tech: React 18 + TypeScript, Next.js 14
- Users: ~10k active users
- Auth: Using NextAuth (session-based)
- Current: No preference storage yet
- Constraint: Must persist across devices (user has phone + laptop)
---

AI response:
"Here are 5 approaches:

**Approach 1: LocalStorage (Client-side only)**
Pros: Simple, fast, no backend needed
Cons: Doesn't sync across devices, lost if user clears browser
Complexity: Simple
When: Single-device apps, no backend available
Example: `localStorage.setItem('theme', 'dark')`

**Approach 2: Cookies**
Pros: Auto-sent to server, works SSR, simple
Cons: Size limit (4KB), doesn't sync across devices
Complexity: Simple
When: SSR apps, small preferences
Example: `document.cookie = 'theme=dark; path=/; max-age=31536000'`

**Approach 3: Database (User table column)**
Pros: Syncs across devices, backend control, persistent
Cons: Requires backend, DB queries on each load
Complexity: Medium
When: Multi-device apps, need persistence
Example: `UPDATE users SET preferences = '{"theme":"dark"}' WHERE id = ?`

**Approach 4: Separate UserPreferences table**
Pros: Flexible, versioned, can store history
Cons: More complex schema, extra JOIN queries
Complexity: Complex
When: Many preferences, need audit trail
Example: [SQL schema]

**Approach 5: Hybrid (Cookie for fast load + DB sync)**
Pros: Fast initial load, syncs across devices, best UX
Cons: Complex implementation, data can drift
Complexity: Complex
When: High-traffic apps, UX-critical preferences

**RECOMMENDATION for your context:**
Use **Approach 3** (Database column) because:
- You need cross-device sync (user has phone + laptop)
- You have auth system (easy to link to user)
- ~10k users (DB queries not a bottleneck)
- Simple to implement with NextAuth

**Implementation plan:**
1. Add `preferences JSONB` column to users table
2. Create API route `/api/user/preferences` (GET/PUT)
3. Load preferences on session load
4. Update on settings change (debounced)

Want me to show the code?"

Ania's aha moment:
"Teraz wiem KTÓRY approach wybrać! Pójdę z #3 bo mam multi-device requirement."
```

**Korzyści:**
- ✅ Widzisz different approaches side-by-side
- ✅ Rozumiesz trade-offs (pros vs cons)
- ✅ Możesz świadomie wybrać approach który pasuje do kontekstu
- ✅ Masz concrete plan implementacji

---

### 📍 Krok 3: Przekształć vague requirements na concrete spec

**Proces 3-krokowy:**

#### 3.1. Extract facts (co WIEM na pewno)

```
Vague task: "Improve checkout performance"

Facts I know:
✅ Current: Checkout takes ~5 seconds
✅ Tech: React frontend, Node.js backend, PostgreSQL
✅ Problem reported: Users complain about slowness
✅ Critical: This is conversion-critical page (revenue impact)
```

#### 3.2. Identify unknowns (czego NIE WIEM)

```
Unknowns:
❓ Where is the bottleneck? (Frontend render? API calls? Database?)
❓ Target performance? (1s? 500ms? 100ms?)
❓ Scope? (Quick fix or full rewrite?)
❓ Priority? (Ship today or ship right?)
```

#### 3.3. Ask or research unknowns

**Option A: Ask PM/Senior**
```
Email to PM:
"Hi! You asked me to improve checkout performance.
Before I start, I need to clarify:

1. Target load time? (currently ~5s, how fast should it be?)
2. Scope? (quick wins or comprehensive optimization?)
3. Priority? (deadline or quality focus?)
4. Success metric? (how will we measure improvement?)

I'll start investigating bottlenecks while waiting for your input."
```

**Option B: Use AI to help research**
```
Prompt to AI:
"I need to improve checkout performance but don't know where the bottleneck is.

Help me create a diagnostic plan to identify:
- If it's frontend (rendering, bundle size)
- If it's backend (API response time, database queries)
- If it's network (payload size, # of requests)

Tech: React + Node.js + PostgreSQL
Current: Checkout page loads in ~5s

Provide step-by-step diagnostic steps with tools to use."
```

---

### 📍 Krok 4: Napisz concrete spec przed promptowaniem

**Template spec (fill in the blanks):**

```markdown
## Feature Spec: [Feature Name]

### Business Goal
[Why are we building this? What problem does it solve?]

### Technical Requirements
- **Must have:**
  - [Requirement 1]
  - [Requirement 2]
- **Nice to have:**
  - [Requirement 3]
- **Out of scope:**
  - [What we're NOT doing]

### Acceptance Criteria
User can:
- [ ] [Action 1]
- [ ] [Action 2]
System should:
- [ ] [Behavior 1]
- [ ] [Behavior 2]

### Edge Cases
- Case 1: [What if X?] → [Expected behavior]
- Case 2: [What if Y?] → [Expected behavior]

### Constraints
- Performance: [e.g., < 100ms response time]
- Compatibility: [e.g., must work in IE11]
- Accessibility: [e.g., WCAG 2.1 AA]

### Tech Stack
- Frontend: [Framework, version]
- Backend: [Language, framework]
- Database: [Type, version]
```

**Przykład wypełniony:**

```markdown
## Feature Spec: Product Search

### Business Goal
Users can quickly find products without scrolling through full catalog.
Success metric: Reduce time-to-product-page by 50%.

### Technical Requirements
- Must have:
  - Search by product name (case-insensitive)
  - Real-time results (as-you-type)
  - Debounced input (300ms delay)
  - Highlight matched terms in results
- Nice to have:
  - Search by SKU, description
  - Search suggestions (autocomplete)
- Out of scope:
  - Fuzzy search (typo tolerance) - future iteration
  - Advanced filters in search bar

### Acceptance Criteria
User can:
- [ ] Type in search box and see results update in real-time
- [ ] See matched terms highlighted
- [ ] Clear search and return to full catalog
System should:
- [ ] Debounce input to avoid excessive API calls
- [ ] Show "No results" message when no matches
- [ ] Maintain existing filters when searching

### Edge Cases
- Empty search: Show all products (default state)
- No results: Show "No results for 'X'. Try different keywords."
- Special characters: Strip/escape before searching
- Very long search: Limit to 100 chars

### Constraints
- Performance: Results in < 200ms (perceived real-time)
- Compatibility: Works in Chrome, Firefox, Safari (last 2 versions)
- Accessibility: Keyboard navigable, screen reader friendly

### Tech Stack
- Frontend: React 18 + TypeScript 5
- Backend: Node.js 20 + Express
- Database: PostgreSQL 15 (full-text search)
```

**Teraz to przekształć w prompt:**

```
Command: Implement real-time product search functionality

Context:
[Paste the entire spec above]

Constraints:
- Follow spec exactly
- Provide implementation plan before code
- Ask clarifying questions if anything is unclear

Format:
1. Implementation plan (numbered steps)
2. Code (component + API + tests)
3. Migration notes (DB schema changes if needed)
```

---

## 💡 Mini-case study: Junior Marek dostaje vague task

**Sytuacja:**
Senior mówi: *"Add caching to improve performance"*

### ❌ WRONG Approach: Immediate prompting without clarification

```
Marek (do AI): "Add caching to the app"

AI: [Returns generic Redis caching example that doesn't match Marek's stack]

Marek: "Hmm, nie używamy Redis... Spróbuję inaczej"
Marek (do AI): "Add caching using localStorage"

AI: [Returns client-side caching but Marek needs server-side]

Marek: *30 minut stracone, frustracja level 100*
```

**Problem:** Marek nie sprecyzował wymagań. AI zgadywał.

---

### ✅ RIGHT Approach: Clarify first, then prompt

```
Marek: "Hmm, 'add caching' to zbyt vague. Let me use Socratic Method."

Marek (do AI):
---
Before implementing caching, ask me 5-10 questions to understand:
- What to cache (data, pages, API responses?)
- Where to cache (client, server, database?)
- Tech stack and current performance issues
- Requirements and constraints

Task: Add caching to improve app performance.
Current: Next.js 14 app with PostgreSQL, slow API responses (~2s).
---

AI asks:
1. What type of data is slow? (user profiles, product catalog, analytics?)
2. How often does data change? (real-time, hourly, daily?)
3. What's your caching budget? (can you add Redis/Memcached?)
4. Client-side vs server-side caching priority?
5. Do you have CDN? (for static asset caching)
6. Stale data tolerance? (can users see 5-min old data?)
7. Cache invalidation strategy? (time-based, event-based?)

Marek: "Ohh! Teraz wiem że muszę zapytać seniora o #2, #6, #7!"

Marek (do seniora):
"Hey! You asked me to add caching. Before I start:
- What data should I cache? (API responses? Database queries?)
- How often does it change? (affects cache TTL)
- Can I use Redis or stick to in-memory?
- Can users see slightly stale data? (affects strategy)"

Senior: "Good questions! Cache product catalog (changes daily),
         use in-memory (no Redis budget), 5-min stale is OK."

Marek (do AI):
---
Implement server-side in-memory caching for product catalog API.

Requirements:
- Cache product catalog data (array of ~500 products)
- TTL: 5 minutes (data changes daily, so 5min is safe)
- In-memory (no Redis, use Node.js Map or similar)
- Invalidate on product update webhook (bonus)

Tech: Next.js 14 API routes, TypeScript
Current: /api/products endpoint hits DB every request (~2s)
Goal: First request hits DB, subsequent = cached (< 50ms)

Provide implementation with cache invalidation logic.
---

AI: [Returns perfect implementation matching exact requirements]

Marek: *10 minut total time, sukces!*
```

**Lekcja:**
- **5 minut** na clarification saves **30 minut** na fixing wrong implementation
- **Pytaj AI o pytania** zanim zaczniesz implementować
- **Pytaj ludzi** o domain knowledge czego AI nie ma

---

## ⚠️ Red Flags: Kiedy STOP i wyjaśnij wymagania

### 🚨 Signal 1: AI pyta Cię o 20+ rzeczy

```
AI: "Before I start, I need to know:
1. [question]
2. [question]
...
20. [question]"
```

**Co to znaczy:** Twoje requirements są **severely underspecified**. AI nie ma co robić.

**Fix:**
1. STOP. Nie próbuj odpowiedzieć na 20 pytań.
2. Wróć do PM/seniora i zapytaj o clarification
3. Albo użyj Exploratory Prompting (Show me 3 approaches...)

---

### 🚨 Signal 2: AI zwraca coś ale to "feels wrong"

```
AI: [Zwraca implementację X]
Ty: "Hmm... to działa ale to nie to o co mi chodziło..."
```

**Co to znaczy:** Requirements były niejasne, AI zgadywał intencję (i zgadł źle).

**Fix:**
1. NIE iteruj dodając "but also Y". To prowadzi do franken-code.
2. Przepisz prompt z **concrete spec** (użyj template z Krok 4)
3. Albo użyj Socratic Method aby AI pomógł sprecyzować

---

### 🚨 Signal 3: Każdy approach AI proponuje ma "ale..."

```
AI: "You could use approach A, but it has limitation X"
     "Or approach B, but it requires Y"
     "Or approach C, but it's complex"

Ty: "Wszystko ma jakieś 'but'! Co wybrać?!"
```

**Co to znaczy:** Brakuje Ci **decision criteria**. Nie wiesz CZYM się kierować przy wyborze.

**Fix:**
Określ priorities:
```
Prompt: "Given these trade-offs, which approach should I choose?

My priorities (in order):
1. Simplicity (I'm junior, avoid complex patterns)
2. Maintainability (code will be reviewed by team)
3. Performance (nice to have, not critical)
4. Time to implement (need to ship this week)

[Paste AI's previous response with approaches]"
```

---

### 🚨 Signal 4: Implementujesz ale czujesz się "lost"

```
Ty: [Piszesz kod based on AI suggestion]
Ty: "Ale... dlaczego robię to w ten sposób? Nie rozumiem..."
```

**Co to znaczy:** Nie rozumiesz **business logic** albo **architectural decision**.

**Fix:**
```
Prompt: "Explain the reasoning behind this implementation:
- Why this approach over alternatives?
- What problem does each part solve?
- What would break if I skip step X?
- Explain like I'm a junior (simple terms, no assumptions)

[Paste code you don't understand]"
```

---

## 🎯 Cheatsheet: Decision Tree "Co robić gdy AI nie rozumie?"

```
AI zwrócił coś ale to nie to co chciałem
│
├─ Czy rozumiem CO chcę osiągnąć (business goal)?
│  ├─ TAK → Use Socratic Method (AI zada pytania)
│  └─ NIE → STOP. Zapytaj PM/seniora o clarification.
│
├─ Czy wiem KTÓRY approach wybrać?
│  ├─ TAK → Write concrete spec (template z Krok 4)
│  └─ NIE → Use Exploratory Prompting (show me 3 approaches)
│
├─ Czy AI pyta o 10+ rzeczy których nie wiem?
│  ├─ TAK → Requirements są vague. Wróć do PM.
│  └─ NIE → Odpowiedz na pytania AI, potem prompt again.
│
└─ Czy rozumiem implementation którą AI zaproponował?
   ├─ TAK → Implement!
   └─ NIE → Ask AI to explain reasoning (ELI5 style)
```

---

## 🧰 Templates do skopiowania

### Template 1: Socratic Method

```
Before you start working on this task, ask me 5-10 clarifying questions to better understand:
- Technical context (tech stack, current implementation, constraints)
- My goals (what I'm trying to achieve, success criteria)
- What I might have missed or forgotten (edge cases, requirements)
- Assumptions to verify (what's unclear or ambiguous)

After I answer your questions, propose a solution.

Task: [Your vague task here]
Context: [Any context you DO know]
```

---

### Template 2: Exploratory Prompting

```
Show me 3-5 different approaches to [task], each with:
- Brief description (1-2 sentences)
- Pros & cons
- Estimated complexity (Simple / Medium / Complex)
- When to use this approach
- Code example or pseudocode

Then recommend the best 1-2 approaches for my specific context.

Task: [Your task]
Context:
- Tech stack: [Your stack]
- Constraints: [Your constraints]
- Current state: [What you have now]
- Goal: [What you want to achieve]
```

---

### Template 3: Requirement Clarification (for PM/Senior)

```
Subject: Clarification needed: [Task Name]

Hi [PM/Senior],

You asked me to [task]. Before I start implementation, I need to clarify a few things:

1. **Scope:** [What's included / excluded?]
2. **Success criteria:** [How will we measure success?]
3. **Priority:** [Must-have vs nice-to-have?]
4. **Constraints:** [Technical limitations, deadlines?]
5. **Edge cases:** [Specific scenarios to handle?]

I've started researching [X] in the meantime. I'll wait for your input before implementing.

Thanks!
```

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading:**
- `backup/.../01-core-principles.md` § Metoda sokratejska (linie 216-250)
- `backup/.../01-core-principles.md` § Brainstorming i eksploracja (linie 253-300)

**Powiązane checklisty:**
- `01-pierwszy-prompt.md` - jeśli problem jest w promptowaniu (nie w requirements)
- `03-gdy-ai-gada-glupoty.md` - jeśli AI rozumie requirements ale output jest zły

---

## ✅ Self-assessment

Odznacz gdy poczujesz się komfortowo:

- [ ] Rozpoznaję "typ niejasności" w wymaganiach (A, B, C)
- [ ] Potrafię użyć Socratic Method (AI zadaje mi pytania)
- [ ] Potrafię użyć Exploratory Prompting (AI pokazuje approaches)
- [ ] Umiem napisać concrete spec przed promptowaniem
- [ ] Wiem kiedy zapytać PM/seniora vs kiedy użyć AI
- [ ] Rozpoznaję red flags (AI pyta o 20 rzeczy → requirements vague)
- [ ] Przepisałem conajmniej **2 vague tasks** na concrete specs

**Jeśli wszystko odznaczone:** 🎉 Przejdź do `03-gdy-ai-gada-glupoty.md`

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 216-300)
- Długość: ~580 linii
- Czas przeczytania: 30-45 min
- Metodologia: Sense-Making (Situation → Gap → Help)
