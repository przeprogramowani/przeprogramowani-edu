# 03. Co robić gdy AI zwraca dziwne rzeczy (hallucinations)?

**Problem:** "AI zwrócił mi kod ale używa biblioteki o której nigdy nie słyszałem, albo kod wygląda podejrzanie, albo 'brzmi dobrze' ale czuję że coś jest nie tak."

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ AI zwrócił kod który używa **nieznanych Ci bibliotek/API**
- ✅ Kod "kompiluje się" ale **nie działa** albo działa **dziwnie**
- ✅ AI twierdzi że "to jest best practice" ale Ty masz **wątpliwości**
- ✅ Widzisz nazwę funkcji/metody która wygląda "**za dobrze aby była prawdziwa**"
- ✅ AI cytuje "dokumentację" której **nie możesz znaleźć**
- ✅ Masz uczucie "**WTF?**" patrząc na output

**Ile czasu to zajmie:** 20-30 min (czytanie) + 5-10 min per verification

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"AI polecił mi bibliotekę 'super-validator-pro' ale nie mogę jej znaleźć na npm..."**

> **"Kod wygląda profesjonalnie ale gdy uruchamiam - ERROR..."**

> **"AI napisał 'this is the recommended approach' ale brzmi to zbyt skomplikowanie..."**

> **"Spędziłem 2 godziny debugując kod od AI zanim odkryłem że funkcja którą AI użył NIE ISTNIEJE..."**

> **"Jak mam wiedzieć czy AI mówi prawdę czy wymyśla?"**

> **"Czy mogę w ogóle ufać AI?!"**

**To jest NORMAL!** AI czasem halucynuje (invents rzeczy które brzmią prawdopodobnie ale są fałszywe). To nie Twoja wina. To fundamentalne ograniczenie LLM.

**Ta checklist nauczy Cię jak WERYFIKOWAĆ output zanim zainwestujesz czas.**

---

## 🧠 Co to jest "hallucination" (halucynacja AI)?

### Definicja
**Hallucination** = AI "wymyśla" rzeczy które brzmią prawdopodobnie, ale są **nieprawdziwe**.

### Dlaczego to się dzieje?
AI działa na **prawdopodobieństwie statystycznym**, nie na faktach:
- AI myśli: "Statystycznie, po tekście X często pojawia się Y"
- AI nie sprawdza: "Czy Y faktycznie istnieje?"

**Analogia:**
Wyobraź sobie że opisujesz film który widziałeś 5 lat temu. Pamiętasz ogólną fabułę, ale detale (imiona, daty) "uzupełniasz" tym co brzmi prawdopodobnie. AI robi to samo.

---

### Najczęstsze typy hallucinations w kodzie

#### Type 1: Nieistniejące biblioteki
```typescript
// AI sugeruje:
import { validateEmail } from 'super-validator-pro';

// Problem: Biblioteka 'super-validator-pro' NIE ISTNIEJE
// AI "wymyślił" nazwę która brzmi prawdopodobnie
```

**Jak sprawdzić:**
```bash
npm search super-validator-pro  # → No results found
```

---

#### Type 2: Nieistniejące funkcje/metody
```typescript
// AI sugeruje:
const filtered = array.filterUnique();

// Problem: JavaScript Array NIE MA metody .filterUnique()
// AI "wymyślił" API które brzmi sensownie
```

**Jak sprawdzić:**
```typescript
console.log(typeof [].filterUnique);  // → undefined
```
Sprawdź MDN docs: Array methods.

---

#### Type 3: Outdated API (było kiedyś, teraz nie)
```javascript
// AI sugeruje (React):
componentWillMount() { ... }

// Problem: componentWillMount jest DEPRECATED w React 18
// AI "pamięta" stary API z danych treningowych
```

**Jak sprawdzić:**
Check official docs (React docs) for current version.

---

#### Type 4: Zmiksowane API z różnych bibliotek
```typescript
// AI sugeruje:
import { useQuery } from 'react-query';

const { data } = useQuery({
  queryKey: ['users'],
  fetcher: fetchUsers,  // ← WRONG! To jest API z SWR, nie React Query
});

// Problem: AI zmiksował API z React Query + SWR
```

**Jak sprawdzić:**
Read official docs for the specific library version.

---

#### Type 5: "Cytowanie" nieistniejącej dokumentacji
```
AI: "According to the TypeScript 5.0 documentation, you should use..."

Ty: [Szukasz w docs] → NIE MA tego w dokumentacji

// Problem: AI "cytuje" docs które nie istnieją
```

**Jak sprawdzić:**
Always verify claims with official docs.

---

## ✅ Checklist: 3-krokowa weryfikacja outputu AI

### 📍 Krok 1: Quick Sanity Check (30 seconds)

**Przed copy-paste kodu, ZAWSZE przeczytaj i sprawdź:**

- [ ] **Czy nazwy bibliotek wyglądają znajomo?**
  - ✅ `react`, `express`, `zod` → znane biblioteki
  - ⚠️ `super-helper-lib`, `magic-validator` → suspicious names

- [ ] **Czy API methods brzmią prawdziwe?**
  - ✅ `array.filter()`, `string.toLowerCase()` → standard JS
  - ⚠️ `array.filterUnique()`, `string.toCapitalCase()` → nie standard

- [ ] **Czy import paths są poprawne?**
  - ✅ `import { useState } from 'react'` → official package
  - ⚠️ `import { magic } from 'react/utils/helpers'` → suspicious path

- [ ] **Czy AI używa deprecated patterns?**
  - ⚠️ `var` instead of `const/let`
  - ⚠️ Callback hell instead of async/await
  - ⚠️ Class components instead of hooks (in modern React)

**Jeśli cokolwiek jest ⚠️ suspicious → przejdź do Krok 2.**

---

### 📍 Krok 2: Verify Dependencies (2-3 minutes)

#### A) Sprawdź czy biblioteka istnieje

**npm/yarn:**
```bash
# Check if package exists
npm search [package-name]

# Check package details
npm view [package-name]

# Check latest version
npm view [package-name] version
```

**Przykład:**
```bash
npm search super-validator-pro
# → No results found ← HALLUCINATION!

npm search validator
# → validator - String validation library
#   10M downloads/week, v13.11.0 ← REAL!
```

---

#### B) Sprawdź popularity i maintainability

**Red flags (unikaj!):**
- 🚨 Ostatni commit > 2 lata temu (abandoned)
- 🚨 < 100 downloads/week (unpopular, może być buggy)
- 🚨 No GitHub stars (< 10 stars)
- 🚨 Znane security vulnerabilities (CVE warnings)

**Green flags (safe to use):**
- ✅ Ostatni commit < 6 miesięcy (actively maintained)
- ✅ > 10k downloads/week (widely used)
- ✅ > 1k GitHub stars (community trust)
- ✅ Clear documentation

**Tools:**
- npmjs.com - check package page
- bundlephobia.com - check size & dependencies
- snyk.io/advisor - security & quality score

---

#### C) Sprawdź czy wersja jest compatible

```bash
# Check your project's versions
cat package.json | grep "react"
# → "react": "^18.2.0"

# Check if AI suggested code works with v18
# Read React 18 migration guide / changelog
```

**Common gotcha:**
AI może sugerować kod dla **React 17** gdy Ty używasz **React 18** (breaking changes!).

---

### 📍 Krok 3: Verify API correctness (5 minutes)

#### A) Check official documentation

**NEVER trust AI citations. Always check source.**

```
AI says: "According to MDN, Array has .unique() method"

You: [Go to MDN docs for Array]
MDN: "Array methods: filter, map, reduce..." ← NO .unique()!

Conclusion: AI hallucinated.
```

**Sources of truth (bookmark these!):**
- **JavaScript:** developer.mozilla.org/en-US/docs/Web/JavaScript
- **TypeScript:** typescriptlang.org/docs
- **React:** react.dev
- **Node.js:** nodejs.org/docs
- **Specific libraries:** Check official docs (usually library-name.com or GitHub README)

---

#### B) Test in isolation przed użyciem w projekcie

**DON'T:**
```typescript
// ❌ DON'T copy-paste directly into your project
// [AI generated 200 lines of code]
// [You paste into src/components/MyComponent.tsx]
// [Everything breaks, 30 min debugging]
```

**DO:**
```typescript
// ✅ DO test in isolated playground first

// Create test file: test-ai-code.ts
console.log('Testing AI suggestion...');

// [Paste AI code here]

// Run:
// node test-ai-code.ts
// or use online playground (TS Playground, CodeSandbox)

// If works → integrate into project
// If breaks → ask AI to fix OR find alternative
```

---

#### C) Run code i sprawdź czy faktycznie działa

**Verification steps:**
```typescript
// 1. Does it compile/parse? (syntax OK)
npm run build
// or
tsc --noEmit

// 2. Does it run? (no runtime errors)
npm run dev
// Check browser console for errors

// 3. Does it do what you expect? (behavior OK)
// Manual testing:
// - Click buttons
// - Submit forms
// - Check output

// 4. Are there edge cases?
// Test: null, undefined, empty string, large numbers, etc.
```

---

## 💡 Real-world examples: Hallucinations caught early

### Example 1: Nieistniejąca biblioteka

**Sytuacja:**
Junior Ania dostała task: "Add email validation to registration form"

```typescript
// AI sugeruje:
import { validateEmail } from 'email-validator-pro';

export function RegisterForm() {
  const handleSubmit = (email: string) => {
    if (validateEmail(email)) {
      // ...
    }
  };
}
```

**Ania's verification (Krok 1):**
```
🤔 "email-validator-pro"? Never heard of it... Let me check.
```

**Ania's verification (Krok 2):**
```bash
npm search email-validator-pro
# → No results found

npm search email-validator
# → email-validator (10M downloads/week) ← This exists!
# → validator (50M downloads/week) ← This is even more popular!
```

**Ania's fix:**
```typescript
// Use REAL library
import validator from 'validator';

export function RegisterForm() {
  const handleSubmit = (email: string) => {
    if (validator.isEmail(email)) {
      // ...
    }
  };
}
```

**Time saved:** 20 minutes of debugging "why can't npm install this package?"

---

### Example 2: Outdated API

**Sytuacja:**
Junior Tomek dostał: "Fetch user data from API"

```typescript
// AI sugeruje (React):
import React from 'react';

class UserProfile extends React.Component {
  componentWillMount() {  // ← DEPRECATED!
    fetch('/api/user')
      .then(res => res.json())
      .then(data => this.setState({ user: data }));
  }

  render() {
    return <div>{this.state.user?.name}</div>;
  }
}
```

**Tomek's verification (Krok 1):**
```
🤔 componentWillMount? Senior told me to use hooks...
   Let me check React docs.
```

**Tomek's verification (Krok 3A):**
```
[Checks react.dev docs]
React docs: "componentWillMount is DEPRECATED. Use useEffect instead."
```

**Tomek's fix:**
```typescript
// Modern React (hooks)
import { useEffect, useState } from 'react';

export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return <div>{user?.name}</div>;
}
```

**Time saved:** Avoided using deprecated API that would fail code review.

---

### Example 3: Mixed-up API

**Sytuacja:**
Junior Kasia używa React Query do fetch data.

```typescript
// AI sugeruje:
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['products'],
  fetcher: fetchProducts,  // ← WRONG! This is SWR API
});
```

**Kasia's verification (Krok 3A):**
```
🤔 "fetcher"? Let me check React Query docs...

[Checks tanstack.com/query docs]
Docs say: "Use 'queryFn', not 'fetcher'"

Oh! AI mixed up React Query with SWR (which uses 'fetcher').
```

**Kasia's fix:**
```typescript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,  // ← CORRECT (queryFn, not fetcher)
});
```

**Time saved:** 10 minutes of "why is this not working?"

---

## ⚠️ Red Flags: Signs of hallucination

### 🚨 Signal 1: "Too good to be true" API names

```typescript
// AI sugeruje:
array.filterUnique();
string.toProperCase();
number.isPrime();

// 🤔 These sound PERFECT... but do they exist?
```

**Rule of thumb:**
If it sounds "magically convenient", **verify in docs**.

JavaScript built-ins are intentionally verbose (`Array.prototype.filter` not `.filterUnique`).

---

### 🚨 Signal 2: AI "cites" documentation you can't find

```
AI: "According to the Express.js v5 documentation, you should use..."

You: [Search express docs] → Can't find this anywhere

// Possible reasons:
// - AI hallucinated the doc
// - Doc is outdated/removed
// - AI misremembered
```

**Fix:** Always check official docs yourself. Don't trust AI citations blindly.

---

### 🚨 Signal 3: Package name sounds "generic"

```typescript
// Suspicious package names:
import { helper } from 'super-helper';
import { util } from 'magic-utils';
import { validator } from 'awesome-validator';

// Real packages have SPECIFIC names:
import { z } from 'zod';  // ← short, memorable
import validator from 'validator';  // ← established name
import { parse } from 'date-fns';  // ← descriptive
```

**Rule:** Generic names like "super-X", "magic-Y", "awesome-Z" are often hallucinations.

---

### 🚨 Signal 4: Import from deep path that doesn't make sense

```typescript
// Suspicious:
import { magic } from 'react/utils/helpers/magic';
import { secret } from '@company/lib/internal/secret';

// Normal:
import { useState } from 'react';
import { Button } from '@company/ui';
```

**Rule:** Most libraries expose clean top-level exports. Deep paths are rare.

---

### 🚨 Signal 5: Code compiles but doesn't run

```typescript
// Code:
const result = await fetch('/api/data').json();

// TypeScript: ✅ No errors
// Runtime: ❌ Error: "fetch(...).json is not a function"

// Correct:
const response = await fetch('/api/data');
const result = await response.json();
```

**Rule:** Compilation ≠ correctness. Always test runtime behavior.

---

## 🛠️ Verification Checklist (print & use!)

**Before integrating AI code into your project:**

### ✅ Step 1: Visual Inspection (30 sec)
- [ ] Library names look familiar?
- [ ] No "super-", "magic-", "awesome-" prefixes?
- [ ] Import paths look standard?
- [ ] No deprecated patterns? (var, componentWillMount, etc.)

### ✅ Step 2: Dependency Check (2 min)
- [ ] Package exists? (`npm search [package]`)
- [ ] Package is maintained? (recent commits, downloads)
- [ ] No security warnings? (check npm audit, Snyk)
- [ ] Version compatible with my project?

### ✅ Step 3: API Verification (5 min)
- [ ] Check official docs (MDN, library docs)
- [ ] Test in isolation (playground, test file)
- [ ] Code compiles? (`tsc --noEmit`)
- [ ] Code runs? (manual test in browser/node)
- [ ] Edge cases work? (null, empty, large values)

### ✅ Step 4: Integration (10 min)
- [ ] Copy into project
- [ ] Run tests (`npm test`)
- [ ] Manual test in UI
- [ ] Check browser console (no warnings/errors)
- [ ] Code review self (`git diff`)

**Total time:** ~20 min per AI-generated code block.

**Payoff:** Saves hours of debugging mysterious errors later.

---

## 🎯 Decision Tree: "Is this hallucination?"

```
AI returned code with library X
│
├─ Have I heard of library X?
│  ├─ YES → Probably safe, but still verify version
│  └─ NO → Check if exists (npm search)
│           │
│           ├─ Exists → Check popularity & maintenance
│           │          │
│           │          ├─ Popular (> 10k/week) → Probably safe
│           │          └─ Unpopular (< 100/week) → Ask AI for alternative
│           │
│           └─ Doesn't exist → HALLUCINATION!
│                              Ask AI: "Can you use a real package?"
│
├─ Does API method look standard?
│  ├─ YES (e.g., array.filter) → OK
│  └─ NO (e.g., array.filterUnique) → Check MDN docs
│                                     │
│                                     ├─ Exists in docs → OK
│                                     └─ Not in docs → HALLUCINATION!
│
└─ Does code compile AND run?
   ├─ YES → Probably OK (but test edge cases)
   └─ NO → Fix error OR ask AI to revise
```

---

## 🔧 How to handle confirmed hallucinations

### Strategy 1: Ask AI to fix (use real package)

```
Prompt to AI:
"The package 'super-validator-pro' doesn't exist on npm.

Please revise the code to use a REAL email validation library.

Constraints:
- Must be a package available on npm
- Preferably with > 1M downloads/week
- Latest version compatible with Node.js 20

Show me the corrected code."
```

**AI will likely suggest:** `validator` or `email-validator` (real packages).

---

### Strategy 2: Ask for implementation without dependency

```
Prompt to AI:
"Instead of using an external library, implement email validation using regex.

Requirements:
- Basic email format: [text]@[domain].[tld]
- No need for complex RFC compliance
- Return boolean (valid/invalid)

Provide the implementation with tests."
```

---

### Strategy 3: Research alternatives yourself

```
1. Google: "best email validation library npm"
2. Check npm trending: npmtrends.com
3. Compare options:
   - validator (50M/week, 20k stars)
   - email-validator (1M/week, 400 stars)
   - joi (3M/week, 20k stars - full schema validation)
4. Pick based on needs
5. Ask AI to use YOUR chosen library
```

---

## 📚 Resources: Verification Tools

### Check if package exists:
- npmjs.com - official npm registry
- npms.io - package search with scores
- npmtrends.com - compare package popularity

### Check package quality:
- bundlephobia.com - package size & tree-shaking
- snyk.io/advisor - security & quality scores
- github.com/[package-name] - check issues, PRs, last commit

### Check API correctness:
- MDN (developer.mozilla.org) - JavaScript/Web APIs
- Official docs for your framework/library
- TypeScript Playground (typescriptlang.org/play) - test code
- StackBlitz / CodeSandbox - online IDE

### Check security:
```bash
npm audit  # Check for known vulnerabilities
```

---

## 🔗 Powiązane checklisty

**Następny krok:**
- [ ] `04-czy-ten-kod-jest-ok.md` - code quality review (po verification)

**Zobacz też:**
- [ ] `01-pierwszy-prompt.md` - jak napisać lepszy prompt (żeby AI mniej halucynował)
- [ ] `02-ai-nie-rozumie-wymagan.md` - jak sprecyzować co chcesz

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading:**
- `backup/.../01-core-principles.md` § Fundamentalne ograniczenia LLM-ów (linie 49-72)
- `backup/.../01-core-principles.md` § Verify AI outputs (linie 1299-1316)

**External resources:**
- "Understanding AI Hallucinations" (Anthropic blog)
- "How to verify AI-generated code" (GitHub blog)

---

## ✅ Self-assessment

Odznacz gdy poczujesz się komfortowo:

- [ ] Rozumiem czym jest hallucination i dlaczego się dzieje
- [ ] Potrafię rozpoznać 5 typów hallucinations
- [ ] Używam 3-krokowej weryfikacji przed copy-paste kodu
- [ ] Umiem sprawdzić czy package istnieje (npm search)
- [ ] Umiem sprawdzić API w official docs
- [ ] Testuję kod w izolacji przed integracją do projektu
- [ ] Rozpoznaję red flags (suspicious names, "too good to be true" APIs)
- [ ] Złapałem conajmniej **1 hallucination** w praktyce

**Jeśli wszystko odznaczone:** 🎉 Przejdź do `04-czy-ten-kod-jest-ok.md`

---

## 💬 FAQ: Common Questions

**Q: Jak często AI halucynuje?**
A: Zależy od promptu i modelu. Generalnie: ~5-20% responses mają jakąś formę hallucination (od małej do dużej). Dlatego weryfikacja jest krytyczna.

**Q: Który AI halucynuje najmniej?**
A: Wszystkie modele halucynują. Nowsze (GPT-4, Claude Sonnet) halucynują MNIEJ niż starsze, ale nadal się zdarza. Don't assume any AI is 100% accurate.

**Q: Czy mogę poprosić AI żeby NIE halucynował?**
A: Możesz dodać do prompta: "Only use real packages that exist on npm. If unsure, say 'I don't know'." - pomaga trochę, ale nie eliminuje hallucinations.

**Q: Co jeśli nie mam czasu na 20-min verification?**
A: Minimum: Steps 1 + 3C (quick visual + run code). Ale pamiętaj: 5 min verification now > 2h debugging later.

**Q: Jak sprawdzić czy business logic jest correct (nie tylko czy kod działa)?**
A: To wymaga domain knowledge. Zapytaj seniora/domain expert: "Czy ta implementacja ma sens biznesowo?" AI nie zna Twojego biznesu.

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 49-72, 1299-1316, 1349-1366)
- Długość: ~600 linii
- Czas przeczytania: 30-40 min
- Metodologia: Sense-Making (Situation → Gap → Help)
