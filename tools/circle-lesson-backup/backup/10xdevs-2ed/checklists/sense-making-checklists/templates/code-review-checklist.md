# Code Review Checklist

**Use this for self-review przed commitem lub reviewing others' PRs.**

Print this out or save as reference.

---

## 📋 Quick Review (5 min - minimum)

**File:** [path/to/file]
**Author:** [your-name]
**Date:** [YYYY-MM-DD]

### ✅ Does it work?

- [ ] Code compiles (no syntax errors)
- [ ] Tests pass (all green)
- [ ] No runtime errors (checked in browser/terminal)
- [ ] Manual testing done (happy path works)

### ✅ Is it safe?

- [ ] No SQL injection (using parameterized queries?)
- [ ] No XSS (user input sanitized?)
- [ ] No hardcoded secrets (API keys, passwords)
- [ ] Error handling exists (try-catch for async operations)

### ✅ Is it readable?

- [ ] Variable names are descriptive (not `x`, `tmp`, `d`)
- [ ] Functions do ONE thing (Single Responsibility)
- [ ] No magic numbers (use named constants)
- [ ] Comments explain WHY (not what)

**If ANY fails → Request changes / Fix before merge**

---

## 📋 Deep Review (15-20 min - for important PRs)

**File:** [path/to/file]
**Author:** [author-name]
**Reviewer:** [your-name]
**Date:** [YYYY-MM-DD]
**PR/Issue:** #[number]

---

### Section A: Correctness & Completeness

- [ ] **Business logic is correct**
  - Implements requirements accurately
  - Edge cases covered
  - Matches acceptance criteria

- [ ] **All requirements fulfilled**
  - Must-haves: ✅ implemented
  - Nice-to-haves: documented if skipped
  - Out-of-scope: not accidentally included

- [ ] **No regressions**
  - Old features still work
  - Existing tests still pass
  - No broken functionality

---

### Section B: Code Quality

#### B1: Readability

- [ ] **Names reveal intent**
  ```typescript
  // ❌ Bad
  function calc(a, b) { ... }

  // ✅ Good
  function calculateDiscountedPrice(price, discountRate) { ... }
  ```

- [ ] **Functions are small** (< 30 lines ideally)
  - Each function does ONE thing
  - Easy to understand at a glance

- [ ] **Code is self-documenting**
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

- [ ] **Single Responsibility Principle (SRP)**
  - One class/function = one responsibility
  - Easy to change without affecting other parts

- [ ] **DRY (Don't Repeat Yourself)**
  - No copy-pasted code
  - Common logic extracted to functions/utils

- [ ] **Proper abstraction levels**
  - High-level functions call low-level functions
  - No mixing business logic with UI code

---

#### B3: Error Handling & Edge Cases

- [ ] **Comprehensive error handling**
  ```typescript
  // ✅ Good
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    showToast('Unable to load users. Please try again.');
    return [];
  }
  ```

- [ ] **Null/undefined checks** (defensive programming)
  ```typescript
  // ✅ Good
  function getUserName(user: User | null): string {
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  }

  // Or use optional chaining
  const name = user?.firstName ?? 'Guest';
  ```

- [ ] **Edge cases tested**
  - Empty arrays/strings
  - Zero/negative numbers
  - Very large values
  - Special characters
  - Null/undefined

---

#### B4: Performance & Efficiency

- [ ] **No obvious performance issues**
  - No O(n²) loops (unless n is small)
  - No unnecessary re-renders (React)
  - Large data not fetched unnecessarily

- [ ] **Resources cleaned up** (no memory leaks)
  ```typescript
  // ✅ Good
  useEffect(() => {
    const interval = setInterval(() => { ... }, 1000);
    return () => clearInterval(interval);  // Cleanup!
  }, []);
  ```

---

### Section C: Security

- [ ] **No SQL injection**
  ```typescript
  // ❌ Vulnerable
  db.query(`SELECT * FROM users WHERE id = '${userId}'`);

  // ✅ Safe
  db.query('SELECT * FROM users WHERE id = ?', [userId]);
  ```

- [ ] **No XSS (Cross-Site Scripting)**
  ```typescript
  // ❌ Vulnerable
  div.innerHTML = userInput;

  // ✅ Safe
  div.textContent = userInput;  // or use sanitizer library
  ```

- [ ] **No hardcoded secrets**
  ```typescript
  // ❌ Bad
  const API_KEY = "sk-1234567890...";

  // ✅ Good
  const API_KEY = process.env.API_KEY;
  ```

- [ ] **Input validation** (sanitize user input)
  ```typescript
  // ✅ Good
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  ```

---

### Section D: Testing

- [ ] **Tests are comprehensive**
  - Happy path tested
  - Edge cases tested
  - Error cases tested

- [ ] **Tests are maintainable**
  - Test behavior, not implementation
  - Clear test names (`it('should...')`)
  - No flaky tests (deterministic)

- [ ] **Test coverage is reasonable** (70-80% for critical code)
  ```bash
  npm test -- --coverage
  ```

---

### Section E: Type Safety (TypeScript)

- [ ] **Types are strict** (no `any` without reason)
  ```typescript
  // ❌ Bad
  function processData(data: any) { ... }

  // ✅ Good
  interface UserData {
    id: string;
    email: string;
    role: 'admin' | 'user';
  }
  function processData(data: UserData) { ... }
  ```

- [ ] **Return types are explicit**
  ```typescript
  // ✅ Good
  function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
  ```

- [ ] **No type assertions unless necessary**
  ```typescript
  // ❌ Avoid if possible
  const user = data as User;

  // ✅ Better - proper type guard
  function isUser(data: unknown): data is User {
    return typeof data === 'object' && data !== null && 'id' in data;
  }
  ```

---

### Section F: Documentation

- [ ] **Public APIs have JSDoc**
  ```typescript
  /**
   * Calculates discounted price based on user tier.
   * @param price - Original price in cents
   * @param tier - User tier ('regular' | 'premium' | 'vip')
   * @returns Discounted price in cents
   * @throws {Error} If price is negative or tier is invalid
   */
  function calculateDiscount(price: number, tier: string): number { ... }
  ```

- [ ] **Complex logic has inline comments**
  ```typescript
  // Calculate tax based on user's country (VAT rules vary)
  const tax = country === 'US' ? price * 0.08 : price * 0.20;
  ```

- [ ] **README updated** (if public API changed)

---

## 🚨 Code Smells (red flags to watch for)

### ❌ Smell 1: God Objects/Functions
- Function > 50 lines
- Class with > 10 methods
- File > 300 lines

**Action:** Suggest breaking down into smaller units.

---

### ❌ Smell 2: Magic Numbers
```typescript
// ❌ Bad
if (user.age > 18 && score > 75) {
  applyDiscount(price * 0.15);
}

// ✅ Good
const LEGAL_AGE = 18;
const PREMIUM_THRESHOLD = 75;
const PREMIUM_DISCOUNT = 0.15;

if (user.age > LEGAL_AGE && score > PREMIUM_THRESHOLD) {
  applyDiscount(price * PREMIUM_DISCOUNT);
}
```

---

### ❌ Smell 3: Deep Nesting (> 3 levels)
```typescript
// ❌ Bad
if (user) {
  if (user.isPremium) {
    if (user.hasSubscription) {
      if (user.paymentMethod) {
        // do something
      }
    }
  }
}

// ✅ Good - early returns
if (!user) return;
if (!user.isPremium) return;
if (!user.hasSubscription) return;
if (!user.paymentMethod) return;

// do something
```

---

### ❌ Smell 4: Commented-Out Code
```typescript
// ❌ Bad - zombie code
function calculate() {
  // const tax = price * 0.2;
  // return price + tax;

  return price * 1.2;
}
```

**Action:** Delete commented code (git history preserves it).

---

### ❌ Smell 5: Inconsistent Naming
```typescript
// ❌ Mixed conventions
const user_name = 'John';      // snake_case
const UserAge = 25;            // PascalCase
const useremail = 'a@b.com';   // lowercase

// ✅ Consistent
const userName = 'John';       // camelCase
const userAge = 25;
const userEmail = 'a@b.com';
```

---

## 📝 Review Template (copy-paste this)

```markdown
## Code Review

**File:** [path/to/file]
**Author:** [@author]
**Reviewer:** [@your-name]
**Date:** [YYYY-MM-DD]
**PR:** #[number]

---

### ✅ What's Good
- [Something done well]
- [Another good thing]

### 🤔 Suggestions
- [ ] **[File:Line]** [Suggestion with reasoning]
  ```suggestion
  [Proposed code change]
  ```

- [ ] **[File:Line]** [Another suggestion]

### ❌ Issues (must fix before merge)
- [ ] **[File:Line]** [Critical issue - security, bug, etc.]

### 💭 Questions
- [Question about implementation choice]
- [Clarification needed]

---

### Decision
- [ ] ✅ **Approve** (ready to merge)
- [ ] 🔄 **Request Changes** (see issues above)
- [ ] 💬 **Comment** (no blocking issues, just suggestions)

**Overall:** [Brief summary of review]
```

---

## How to Give Constructive Feedback

### ✅ DO:
- Be specific: "Line 42: This function could be extracted..."
- Explain WHY: "...because it's reused in 3 places"
- Suggest solution: "Consider creating `utils/validation.ts`"
- Praise good code: "Nice use of pattern matching here!"
- Ask questions: "Could we use a more descriptive name here?"

### ❌ DON'T:
- Be vague: "This code is bad"
- Be personal: "You always write messy code"
- Criticize without helping: "Wrong approach" (without suggesting alternative)
- Bike-shed: Don't argue about trivial things (spacing, naming style if it's consistent)

---

## Quick Decision Tree

```
Code review checklist:
│
├─ Does it work?
│  ├─ NO → Request changes (critical!)
│  └─ YES → Continue
│
├─ Is it safe? (security)
│  ├─ NO → Request changes (critical!)
│  └─ YES → Continue
│
├─ Is it maintainable? (quality)
│  ├─ NO → Suggest refactoring (optional)
│  └─ YES → Continue
│
└─ Is it tested?
   ├─ NO → Request tests (if critical code)
   └─ YES → APPROVE ✅
```

---

## Related Resources

- `04-czy-ten-kod-jest-ok.md` - Self-review before requesting review
- `05-ai-zepsul-testy.md` - If tests are failing
- `06-jak-zapisac-prace.md` - Commit guidelines

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Use: Before commit (self) or PR review (others)
- Time: 5 min (quick) / 15-20 min (deep)
- Copy-paste ready: YES
