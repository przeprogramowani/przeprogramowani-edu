# 04. Jak sprawdzić czy kod od AI jest dobry?

**Problem:** "AI wygenerował kod, działa, testy są zielone... ale nie wiem czy to DOBRY kod. Czy mogę to commitnąć?"

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ Kod od AI **kompiluje się i działa** ale nie jesteś pewny **jakości**
- ✅ Masz przed **commitem** i chcesz zrobić **self-review**
- ✅ Senior poprosił Cię o **code review** AI-generated kodu
- ✅ Czujesz że kod "działa ale brzmi suspicious"
- ✅ Chcesz nauczyć się **co to znaczy "dobry kod"**

**Ile czasu to zajmie:** 5-15 min per code review (zależnie od rozmiarukodu)

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"Kod działa, więc jest OK... prawda?"**

> **"Nie wiem co sprawdzać podczas code review..."**

> **"Senior powiedział 'to nie jest clean code' ale nie wiem co to znaczy..."**

> **"AI użył pattern którego nie znam - czy to dobra praktyka czy over-engineering?"**

> **"Jak mam wiedzieć czy kod jest maintainable skoro nie robiłem maintenance?"**

> **"Impostor syndrome: wszyscy wiedzą co to dobry kod poza mną..."**

**STOP worrying!** "Dobry kod" to nie magia. To **konkretne, mierzalne cechy** których możesz się nauczyć.

**Ta checklist da Ci framework do oceny jakości kodu.**

---

## ✅ 5-Minute Code Quality Checklist

**Minimum viable review** - użyj tego przed każdym commitem.

### 📍 Level 1: Does It Work? (2 min)

- [ ] **Kod kompiluje się** (no syntax errors)
  ```bash
  npm run build  # or tsc --noEmit
  ```

- [ ] **Testy przechodzą** (all green)
  ```bash
  npm test
  ```

- [ ] **No runtime errors** (check browser console, terminal)
  ```bash
  npm run dev
  # Open browser, check console
  # Click around, try different flows
  ```

- [ ] **Edge cases work** (test boundaries)
  ```typescript
  // Test: null, undefined, empty string, 0, negative numbers
  // Test: very large numbers, very long strings
  // Test: special characters, Unicode
  ```

**Jeśli ANY z powyższych fails → DON'T commit. Fix first.**

---

### 📍 Level 2: Is It Safe? (2 min)

- [ ] **No obvious security issues**
  - SQL injection? (using parameterized queries?)
  - XSS? (sanitizing user input?)
  - Hardcoded secrets? (API keys, passwords)
  - Unsafe eval()? (never use eval!)

  **Red flags:**
  ```typescript
  ❌ const query = `SELECT * FROM users WHERE id = '${userId}'`;  // SQL injection!
  ❌ div.innerHTML = userInput;  // XSS!
  ❌ const apiKey = "sk-1234...";  // Hardcoded secret!
  ❌ eval(userCode);  // NEVER!
  ```

  **Green flags:**
  ```typescript
  ✅ const query = 'SELECT * FROM users WHERE id = ?';
     db.execute(query, [userId]);
  ✅ div.textContent = userInput;  // or use sanitizer
  ✅ const apiKey = process.env.API_KEY;
  ```

- [ ] **Error handling exists** (try-catch, error boundaries)
  ```typescript
  // ❌ No error handling
  const data = await fetch('/api/users');

  // ✅ With error handling
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    // Show user-friendly error message
  }
  ```

**Jeśli security issues → STOP. Fix before committing.**

---

### 📍 Level 3: Is It Readable? (1 min)

- [ ] **Variable names are descriptive** (not `d`, `x`, `tmp`)
  ```typescript
  // ❌ Bad names
  const d = new Date();
  const x = users.filter(u => u.a);
  const tmp = calculateTotal();

  // ✅ Good names
  const currentDate = new Date();
  const activeUsers = users.filter(user => user.isActive);
  const orderTotal = calculateTotal();
  ```

- [ ] **Functions do ONE thing** (Single Responsibility)
  ```typescript
  // ❌ Function does 3 things
  function processUser(email: string) {
    if (!email.includes('@')) throw new Error('Invalid');  // 1. Validate
    db.users.create({ email });  // 2. Save to DB
    sendEmail(email, 'Welcome!');  // 3. Send email
  }

  // ✅ Each function does one thing
  function validateEmail(email: string): boolean { ... }
  function createUser(email: string): User { ... }
  function sendWelcomeEmail(email: string): void { ... }
  ```

- [ ] **No obvious code smell**
  - Deeply nested if-else (> 3 levels)?
  - Repeated code (copy-paste)?
  - Very long function (> 50 lines)?
  - Magic numbers without explanation?

**Jeśli code smells → Consider refactoring (ale nie blocker do commit).**

---

## 💡 15-Minute Deep Code Review Checklist

**Use this for important features przed merge do main.**

### 📍 Section A: Correctness & Completeness

- [ ] **Business logic is correct**
  - Does it implement requirements accurately?
  - Edge cases covered?
  - Matches acceptance criteria?

  **How to verify:**
  ```
  1. Re-read original task/ticket
  2. Check each requirement against code
  3. Test manually (happy path + edge cases)
  4. Ask: "What could go wrong?" and test that
  ```

- [ ] **All requirements fulfilled**
  - Must-haves: ✅ implemented
  - Nice-to-haves: document if skipped
  - Out-of-scope: not accidentally included

- [ ] **No regressions** (old features still work)
  ```bash
  # Run full test suite
  npm test

  # Manual smoke test
  # - Old flows that might be affected
  # - Click around existing UI
  ```

---

### 📍 Section B: Code Quality & Maintainability

#### B1: Naming & Readability

- [ ] **Names reveal intent**
  ```typescript
  // ❌ What does this do?
  function calc(a: number, b: number): number {
    return a - (a * b);
  }

  // ✅ Clear intent
  function calculateDiscountedPrice(
    originalPrice: number,
    discountRate: number
  ): number {
    return originalPrice - (originalPrice * discountRate);
  }
  ```

- [ ] **Comments explain WHY, not WHAT**
  ```typescript
  // ❌ Comment repeats code
  // Set user age to 25
  user.age = 25;

  // ✅ Comment explains reasoning
  // Default to 25 for legacy users without birth date (< 2020)
  user.age = user.birthDate ? calculateAge(user.birthDate) : 25;
  ```

- [ ] **Code is self-documenting** (readable without comments)
  ```typescript
  // ❌ Needs comment to understand
  if (u.s === 1 && u.t < Date.now()) { ... }

  // ✅ Self-explanatory
  const isActiveUser = user.status === UserStatus.Active;
  const hasExpiredTrial = user.trialEndDate < Date.now();
  if (isActiveUser && hasExpiredTrial) { ... }
  ```

---

#### B2: Structure & Organization

- [ ] **Functions are small** (< 20-30 lines ideally)
  - If > 50 lines → consider breaking down
  - Each function does ONE thing

- [ ] **Single Responsibility Principle** (SRP)
  ```typescript
  // ❌ Class does too many things
  class UserService {
    createUser() { ... }      // User management
    sendEmail() { ... }        // Email sending
    calculateDiscount() { ... }  // Business logic
    logActivity() { ... }      // Logging
  }

  // ✅ Separate responsibilities
  class UserRepository { createUser, findUser, ... }
  class EmailService { sendEmail, ... }
  class DiscountCalculator { calculate, ... }
  class ActivityLogger { log, ... }
  ```

- [ ] **DRY principle** (Don't Repeat Yourself)
  ```typescript
  // ❌ Repetition
  const price1 = product1.price * 0.9;
  const price2 = product2.price * 0.9;
  const price3 = product3.price * 0.9;

  // ✅ Extract to function
  function applyDiscount(price: number): number {
    return price * 0.9;
  }

  const price1 = applyDiscount(product1.price);
  const price2 = applyDiscount(product2.price);
  const price3 = applyDiscount(product3.price);
  ```

---

#### B3: Error Handling & Edge Cases

- [ ] **Comprehensive error handling**
  - API calls wrapped in try-catch?
  - User-friendly error messages?
  - Errors logged for debugging?

  ```typescript
  // ✅ Good error handling
  try {
    const response = await fetch('/api/users');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // Log for developers
    console.error('Failed to fetch users:', error);

    // Show user-friendly message
    showToast('Unable to load users. Please try again.');

    // Return safe default or rethrow
    return [];
  }
  ```

- [ ] **Null/undefined checks** (defensive programming)
  ```typescript
  // ❌ Assumes user exists
  function getUserName(user) {
    return user.firstName + ' ' + user.lastName;
  }

  // ✅ Handles missing user
  function getUserName(user: User | null): string {
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  }

  // ✅ Or use optional chaining (modern)
  const name = user?.firstName ?? 'Guest';
  ```

- [ ] **Edge cases tested**
  - Empty arrays/strings?
  - Zero/negative numbers?
  - Very large values?
  - Special characters?

---

#### B4: Performance & Efficiency

- [ ] **No obvious performance issues**
  - Loops inside loops (O(n²))? → Consider optimization
  - Unnecessary re-renders (React)?
  - Large data fetched but not used?

  ```typescript
  // ❌ O(n²) - slow for large arrays
  const duplicates = arr1.filter(item1 =>
    arr2.some(item2 => item2.id === item1.id)
  );

  // ✅ O(n) - use Set for lookup
  const arr2Ids = new Set(arr2.map(item => item.id));
  const duplicates = arr1.filter(item => arr2Ids.has(item.id));
  ```

  ```typescript
  // ❌ Re-renders on every parent render (React)
  function ParentComponent() {
    const handleClick = () => { ... };  // New function every render!

    return <ChildComponent onClick={handleClick} />;
  }

  // ✅ Memoize callback
  import { useCallback } from 'react';

  function ParentComponent() {
    const handleClick = useCallback(() => { ... }, []);

    return <ChildComponent onClick={handleClick} />;
  }
  ```

- [ ] **Resources cleaned up** (no memory leaks)
  ```typescript
  // ✅ Cleanup in React useEffect
  useEffect(() => {
    const interval = setInterval(() => { ... }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);
  ```

---

### 📍 Section C: Type Safety & Testing

- [ ] **TypeScript types are strict** (no `any` without reason)
  ```typescript
  // ❌ Loses type safety
  function processData(data: any) { ... }

  // ✅ Specific types
  interface UserData {
    id: string;
    email: string;
    role: 'admin' | 'user';
  }

  function processData(data: UserData) { ... }
  ```

- [ ] **Tests are comprehensive** (not just happy path)
  ```typescript
  describe('calculateDiscount', () => {
    it('should apply 10% discount', () => {
      expect(calculateDiscount(100, 0.1)).toBe(90);
    });

    // ✅ Edge cases
    it('should handle zero price', () => {
      expect(calculateDiscount(0, 0.1)).toBe(0);
    });

    it('should throw on negative price', () => {
      expect(() => calculateDiscount(-10, 0.1)).toThrow();
    });

    it('should throw on invalid discount rate', () => {
      expect(() => calculateDiscount(100, 1.5)).toThrow();
    });
  });
  ```

- [ ] **Test coverage is reasonable** (aim for 70-80% for critical code)
  ```bash
  npm test -- --coverage
  # Check coverage report
  ```

---

## ⚠️ Red Flags: Code Smells to Watch For

### 🚨 Smell 1: God Objects / Functions

```typescript
// ❌ Function that does EVERYTHING (200+ lines)
function handleUserRegistration(data) {
  // Validate email
  // Validate password
  // Check if user exists
  // Hash password
  // Save to database
  // Generate JWT token
  // Send welcome email
  // Log activity
  // Update analytics
  // ... 150 more lines
}
```

**Fix:** Break down into smaller, focused functions.

---

### 🚨 Smell 2: Magic Numbers

```typescript
// ❌ What do these numbers mean?
if (user.age > 18 && user.score > 75) {
  applyDiscount(price * 0.15);
}

// ✅ Named constants
const LEGAL_AGE = 18;
const PREMIUM_SCORE_THRESHOLD = 75;
const PREMIUM_DISCOUNT_RATE = 0.15;

if (user.age > LEGAL_AGE && user.score > PREMIUM_SCORE_THRESHOLD) {
  applyDiscount(price * PREMIUM_DISCOUNT_RATE);
}
```

---

### 🚨 Smell 3: Deep Nesting (> 3 levels)

```typescript
// ❌ Nested if hell
if (user) {
  if (user.isPremium) {
    if (user.hasActiveSubscription) {
      if (user.paymentMethod) {
        // ... finally do something
      }
    }
  }
}

// ✅ Early returns (guard clauses)
if (!user) return;
if (!user.isPremium) return;
if (!user.hasActiveSubscription) return;
if (!user.paymentMethod) return;

// Do something
```

---

### 🚨 Smell 4: Commented-out Code

```typescript
// ❌ Zombie code
function calculateTotal() {
  // const tax = price * 0.2;
  // const shipping = 10;
  // return price + tax + shipping;

  return price * 1.2 + 10;
}
```

**Fix:** Delete commented code. Git history preserves it if needed.

---

### 🚨 Smell 5: Inconsistent Naming

```typescript
// ❌ Mixed conventions
const user_name = 'John';      // snake_case
const UserAge = 25;            // PascalCase
const useremail = 'a@b.com';   // lowercase

// ✅ Consistent convention
const userName = 'John';       // camelCase
const userAge = 25;            // camelCase
const userEmail = 'a@b.com';   // camelCase
```

---

## 🎯 Quick Decision Tree: "Is this code good enough?"

```
Code review checklist:
│
├─ Does it work?
│  ├─ NO → FIX (not ready to commit)
│  └─ YES → Continue
│
├─ Is it safe? (no security issues)
│  ├─ NO → FIX (critical!)
│  └─ YES → Continue
│
├─ Is it readable? (clear names, simple logic)
│  ├─ NO → REFACTOR (but can commit if urgent)
│  └─ YES → Continue
│
├─ Is it tested? (tests pass, edge cases covered)
│  ├─ NO → ADD TESTS (or document why skipped)
│  └─ YES → Continue
│
└─ Is it maintainable? (DRY, SRP, no code smells)
   ├─ NO → REFACTOR (create tech debt ticket if no time)
   └─ YES → READY TO COMMIT! 🎉
```

---

## 🛠️ Tools to Help Code Review

### Automated Tools (run before manual review)

```bash
# 1. Linter (catches style issues)
npm run lint

# 2. Type checker (catches type errors)
npm run type-check  # or tsc --noEmit

# 3. Tests (catches logic errors)
npm test

# 4. Code coverage (checks test completeness)
npm test -- --coverage

# 5. Security audit (checks vulnerabilities)
npm audit
```

### Manual Review Aids

**Use AI to review AI code:**
```
Prompt: "Review this code for:
- Security issues (SQL injection, XSS, etc.)
- Performance bottlenecks
- Code smells (god functions, deep nesting, etc.)
- Best practices violations

[Paste code]

Provide specific line-by-line feedback."
```

**Print this checklist** and tick off items as you review.

**Pair review** with senior (if available) - ask for feedback.

---

## 📚 Template do skopiowania

**Save this as IDE snippet or `templates/code-review-checklist.md`:**

```markdown
## Code Review Checklist

**File:** [path/to/file]
**Author:** [your-name]
**Date:** [YYYY-MM-DD]

### ✅ Level 1: Works?
- [ ] Compiles (no syntax errors)
- [ ] Tests pass (all green)
- [ ] No runtime errors
- [ ] Edge cases work

### ✅ Level 2: Safe?
- [ ] No SQL injection
- [ ] No XSS
- [ ] No hardcoded secrets
- [ ] Error handling exists

### ✅ Level 3: Readable?
- [ ] Descriptive names
- [ ] Functions do ONE thing
- [ ] No deep nesting (< 3 levels)
- [ ] No magic numbers

### ✅ Level 4: Quality?
- [ ] DRY (no repetition)
- [ ] SRP (single responsibility)
- [ ] Types are strict (no unnecessary `any`)
- [ ] Comments explain WHY

### 📝 Notes:
[Any concerns, questions, or trade-offs to discuss]

**Ready to commit:** [ ] YES / [ ] NO (why not?)
```

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading:**
- `backup/.../01-core-principles.md` § Pre-commit Checklist (linie 1513-1525)
- `backup/.../01-core-principles.md` § Single Responsibility (linie 551-598)
- `backup/.../01-core-principles.md` § Best Practices (linie 1227-1342)

**External resources:**
- "Clean Code" by Robert C. Martin (książka - klasyk!)
- "Code smells" - refactoring.guru/refactoring/smells
- "TypeScript best practices" - typescript.tv/best-practices

**Powiązane checklisty:**
- `03-gdy-ai-gada-glupoty.md` - weryfikacja czy kod jest correct (przed quality review)
- `06-jak-zapisac-prace.md` - co robić po code review (commit strategy)
- `templates/code-review-checklist.md` - template do użycia

---

## ✅ Self-assessment

Odznacz gdy poczujesz się komfortowo:

- [ ] Znam 5-Minute Checklist (works + safe + readable)
- [ ] Rozumiem code smells (God objects, magic numbers, deep nesting)
- [ ] Potrafię ocenić czy kod spełnia SRP (Single Responsibility)
- [ ] Umiem użyć automated tools (lint, type-check, test)
- [ ] Przeprowadziłem conajmniej **3 code reviews** używając tej checklisty
- [ ] Znam różnicę między "working code" a "good code"

**Jeśli wszystko odznaczone:** 🎉 Przejdź do `05-ai-zepsul-testy.md`

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 551-598, 1227-1342, 1513-1525)
- Długość: ~550 linii
- Czas przeczytania: 30-40 min
- Metodologia: Sense-Making (Situation → Gap → Help)
