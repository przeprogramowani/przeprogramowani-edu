# 05. Co robić gdy AI zepsuł testy?

**Problem:** "AI zmienił kod i teraz testy są czerwone. Nie wiem czy problem jest w kodzie czy w testach. Co mam zrobić?"

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ AI zrefaktorował kod i **testy nagle są czerwone** ❌
- ✅ Dodałeś nową feature i **istniejące testy failują**
- ✅ Nie wiesz czy **fix code** czy **update tests**
- ✅ Senior powiedział "don't break the tests" ale za późno - już są broken
- ✅ Widzisz error message w testach ale **nie rozumiesz dlaczego**

**Ile czasu to zajmie:** 10-20 min (debug + fix)

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"Testy były zielone, AI zmienił kod, teraz czerwone... WTF?!"**

> **"Nie wiem czy kod jest broken czy testy są outdated..."**

> **"Senior mówi 'never break the tests' ale ja nie wiem jak tego uniknąć..."**

> **"Czy mogę po prostu usunąć failing test? (please say yes...)"**

> **"AI zmienił implementation i test fail - czy mam update test?"**

> **"Spędziłem 2 godziny debugując test i dalej nie wiem co jest nie tak..."**

**Don't panic!** Failing tests to **GOOD thing** - to znaczy że tests robią swoją robotę (catching problems).

**Ta checklist nauczy Cię systematycznego podejścia do debugowania failed tests.**

---

## 🧠 Podstawy: Dlaczego testy są ważne?

### Testy = Safety Net

**Without tests:**
```
You: [Zmieniam kod]
User: "Hey, login nie działa!"
You: "Oops... nie sprawdziłem tego przed deploy..."
```

**With tests:**
```
You: [Zmieniam kod]
Tests: ❌ FAIL - login is broken!
You: [Fixuję przed deploy]
User: [Happy, wszystko działa]
```

---

### Golden Rule: Green → Refactor → Green

**The ONLY safe refactoring workflow:**

```
Step 1: Testy są ZIELONE ✅
        (confirmujesz że current code działa)

Step 2: Refactor kod
        (AI pomaga zmienić implementation)

Step 3: Testy DALEJ są ZIELONE ✅
        (potwierdzasz że refactor nie zepsuł behavior)
```

**Jeśli Step 3 fails (testy czerwone ❌):**
- Either: Kod jest broken (wprowadzono bug) → FIX CODE
- Or: Test sprawdza implementation detail → UPDATE TEST

---

## ✅ Decision Tree: Fix Code vs Update Test

**Najpierw odpowiedz na to pytanie:**

### Pytanie 1: Czy zmieniłem BEHAVIOR czy tylko IMPLEMENTATION?

#### Scenario A: Zmieniłem tylko IMPLEMENTATION (refactoring)

**Przykład:**
```typescript
// BEFORE refactor
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// AFTER refactor (same behavior, different implementation)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Behavior:** ✅ Nie zmienił się (input X → output Y dalej taki sam)
**Implementation:** ✅ Zmienił się (for loop → reduce)

**Action:**
- Jeśli test FAILS: Prawdopodobnie test sprawdzał **implementation detail** → UPDATE TEST
- Jeśli test PASSES: Great! Refactoring successful ✅

---

#### Scenario B: Zmieniłem BEHAVIOR (new feature or bug fix)

**Przykład:**
```typescript
// BEFORE
function calculateDiscount(price) {
  return price * 0.9;  // 10% discount for everyone
}

// AFTER (changed behavior)
function calculateDiscount(price, userTier) {
  if (userTier === 'premium') return price * 0.8;  // 20% for premium
  return price * 0.9;  // 10% for regular
}
```

**Behavior:** ✅ Zmienił się (added new business logic)
**Implementation:** ✅ Też się zmienił

**Action:**
- Jeśli test FAILS: Expected! → UPDATE TEST (aby reflect new behavior)
- Dodaj NEW TESTS dla nowego behavior

---

### Pytanie 2: Co sprawdza failing test?

#### Type A: Test sprawdza BEHAVIOR (output for given input)

```typescript
// ✅ Good test - sprawdza behavior
test('calculates total price', () => {
  const items = [{ price: 10 }, { price: 20 }];
  expect(calculateTotal(items)).toBe(30);
});
```

**If this fails:** Kod jest broken! Behavior się zmienił (bad). FIX CODE.

---

#### Type B: Test sprawdza IMPLEMENTATION DETAIL

```typescript
// ❌ Bad test - sprawdza implementation
test('uses reduce to calculate total', () => {
  const spy = jest.spyOn(Array.prototype, 'reduce');
  calculateTotal([{ price: 10 }]);
  expect(spy).toHaveBeenCalled();  // ← Checks HOW, not WHAT
});
```

**If this fails after refactor:** Test jest zbyt coupled do implementation. UPDATE TEST.

---

## 📍 Step-by-Step: Debugowanie Failed Tests

### Krok 1: Przeczytaj error message (30 sec)

```bash
npm test
```

**Output:**
```
FAIL  src/utils/pricing.test.ts
  ● calculateDiscount › applies 20% discount for premium users

    expect(received).toBe(expected)

    Expected: 80
    Received: 90

      12 |   const result = calculateDiscount(100, 'premium');
      13 |   expect(result).toBe(80);
         |          ^
```

**Co mówi error:**
- Test: `applies 20% discount for premium users`
- Expected: `80` (20% discount: 100 - 20 = 80)
- Received: `90` (10% discount: 100 - 10 = 90)

**Quick analysis:**
- Funkcja zwraca 90 zamiast 80
- Wygląda że premium discount nie działa (applies regular 10% instead)

---

### Krok 2: Reproduce locally (2 min)

**Run tylko failing test:**
```bash
# Vitest/Jest
npm test -- calculateDiscount

# Or run in watch mode
npm test -- --watch
```

**Add console.log to debug:**
```typescript
function calculateDiscount(price, userTier) {
  console.log('DEBUG:', { price, userTier });  // ← Add this

  if (userTier === 'premium') return price * 0.8;
  return price * 0.9;
}
```

**Run again:**
```
DEBUG: { price: 100, userTier: 'premium' }
```

**Aha!** Function receives correct input but returns wrong output.

---

### Krok 3: Identify root cause (5 min)

**Check implementation:**
```typescript
function calculateDiscount(price, userTier) {
  if (userTier === 'premium') return price * 0.8;  // ← This looks correct
  return price * 0.9;
}
```

**Wait... why does test fail if code looks correct?**

**Check test again:**
```typescript
test('applies 20% discount for premium users', () => {
  const result = calculateDiscount(100, 'premium');
  //                                     ^^^^^^^^
  expect(result).toBe(80);
});
```

**Run function manually:**
```typescript
console.log(calculateDiscount(100, 'premium'));
// Output: 80 ← CORRECT!
```

**Hmm... test should pass but fails?**

**Check if there are multiple versions of function:**
```bash
# Search for calculateDiscount in codebase
grep -r "calculateDiscount" src/
```

**Aha! Found the problem:**
- Old version in `src/utils/pricing-old.ts` (not updated)
- New version in `src/utils/pricing.ts` (updated by AI)
- Test imports from WRONG file!

---

### Krok 4: Fix the root cause (2-5 min)

**Option A: Code is broken → Fix code**

```typescript
// ❌ Broken code (AI mistake)
function calculateDiscount(price, userTier) {
  if (userTier = 'premium') return price * 0.8;  // ← BUG! = instead of ===
  return price * 0.9;
}

// ✅ Fixed
function calculateDiscount(price, userTier) {
  if (userTier === 'premium') return price * 0.8;  // ← Fixed
  return price * 0.9;
}
```

---

**Option B: Test is outdated → Update test**

```typescript
// OLD behavior: 10% discount for everyone
test('applies 10% discount', () => {
  expect(calculateDiscount(100)).toBe(90);
});

// NEW behavior: tiered discounts
test('applies 10% discount for regular users', () => {
  expect(calculateDiscount(100, 'regular')).toBe(90);
});

test('applies 20% discount for premium users', () => {
  expect(calculateDiscount(100, 'premium')).toBe(80);
});
```

---

**Option C: Test is too coupled to implementation → Rewrite test**

```typescript
// ❌ Bad test (checks implementation)
test('uses Array.reduce', () => {
  const spy = jest.spyOn(Array.prototype, 'reduce');
  calculateTotal(items);
  expect(spy).toHaveBeenCalled();
});

// ✅ Good test (checks behavior)
test('calculates total of all item prices', () => {
  const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
  expect(calculateTotal(items)).toBe(60);
});
```

---

### Krok 5: Verify fix (1 min)

```bash
# Run tests again
npm test

# Should see:
# ✅ PASS  src/utils/pricing.test.ts
```

**If still failing:**
- Go back to Krok 2 (reproduce)
- Add more console.logs
- Check if there are other instances of bug

---

## 💡 Real-World Example: Junior Tomek debugs failed tests

**Sytuacja:**
Tomek asked AI to refactor `UserProfile` component. Tests are now red.

**Error:**
```
FAIL  src/components/UserProfile.test.tsx
  ● UserProfile › displays user name

    TestingLibrary: Unable to find element with text: "John Doe"

      15 |   render(<UserProfile user={mockUser} />);
      16 |   expect(screen.getByText('John Doe')).toBeInTheDocument();
         |          ^
```

**Tomek's debug process:**

### Step 1: Read error
```
Error: Can't find text "John Doe"
Test expects component to display user name
But component doesn't render it (or renders differently)
```

### Step 2: Check implementation (before vs after)

```typescript
// BEFORE AI refactor
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
    </div>
  );
}

// AFTER AI refactor
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>  {/* ← CHANGED! */}
    </div>
  );
}
```

**Aha!** AI changed implementation:
- BEFORE: `user.firstName + user.lastName`
- AFTER: `user.name`

**Question:** Is `user.name` correct? Let's check mock data.

---

### Step 3: Check mock data

```typescript
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  // No 'name' property!
};
```

**Root cause found:**
- AI changed component to use `user.name`
- But mock data doesn't have `name` property
- Component renders `undefined` instead of "John Doe"

---

### Step 4: Decide fix

**Option A: Fix code (revert AI change)**
```typescript
// Revert to original
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
    </div>
  );
}
```

**Option B: Update mock data (if `name` is correct new API)**
```typescript
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  name: 'John Doe',  // ← Add this
};
```

**Tomek checks:** Which property does real API return?

```bash
# Check API response
curl /api/user/123

# Response:
{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe"
  // No "name" property
}
```

**Decision:** API doesn't have `name`. AI made a mistake. REVERT CODE (Option A).

---

### Step 5: Fix & verify

```typescript
// Fixed: Reverted to original implementation
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
    </div>
  );
}
```

```bash
npm test
# ✅ PASS
```

**Lesson:** Always verify that AI's refactor matches actual data structure!

---

## ⚠️ Red Flags: When to STOP and ask for help

### 🚨 Signal 1: Many tests failing (10+)

```bash
npm test
# FAIL  src/... (15 failing tests)
```

**What this means:** Likely broke something fundamental (not just one function).

**Action:**
- DON'T try to fix all 15 tests individually
- Revert the changes (`git reset --hard HEAD`)
- Ask AI to make smaller, incremental changes
- Or ask senior for help

---

### 🚨 Signal 2: Tests pass locally but fail in CI

```
Local: ✅ All tests pass
CI:    ❌ 5 tests fail
```

**Possible causes:**
- Environment differences (Node version, env variables)
- Timing issues (tests depend on execution order)
- Flaky tests (non-deterministic)

**Action:**
- Check CI logs for error details
- Run tests in CI environment locally (Docker)
- Ask senior about CI setup

---

### 🚨 Signal 3: Test fails intermittently (flaky test)

```
Run 1: ✅ Pass
Run 2: ❌ Fail
Run 3: ✅ Pass
Run 4: ❌ Fail
```

**Possible causes:**
- Race conditions (async code)
- Global state pollution
- Time-dependent tests (using Date.now())

**Action:**
- NOT a problem with your code - problem with test
- Mark test as flaky (skip for now)
- Create ticket for senior to fix test

---

## 🛠️ Tools & Commands

### Run specific test
```bash
# Run single test file
npm test src/utils/pricing.test.ts

# Run tests matching pattern
npm test -- --grep "calculateDiscount"

# Run in watch mode (auto-rerun on changes)
npm test -- --watch
```

### Debug tests
```typescript
// Add breakpoint in test
test('my test', () => {
  debugger;  // ← Pauses execution
  expect(foo()).toBe('bar');
});
```

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
# Then open chrome://inspect in Chrome
```

### Check test coverage
```bash
npm test -- --coverage

# Open coverage report
open coverage/lcov-report/index.html
```

---

## 📚 Cheatsheet: Common Test Failures & Fixes

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Expected X, received Y` | Logic error in code | Fix code logic |
| `Cannot find element` | Component not rendering | Check component + mock data |
| `Timeout exceeded` | Async operation not resolved | Add await, increase timeout |
| `TypeError: X is not a function` | Mock not set up | Add mock for function X |
| `ReferenceError: X is not defined` | Import missing | Add import for X |
| `Received: undefined` | Property doesn't exist | Check object structure |

---

## 🔗 Powiązane checklisty

**Następny krok:**
- [ ] `06-jak-zapisac-prace.md` - jak commitnąć po fixing tests

**Zobacz też:**
- [ ] `04-czy-ten-kod-jest-ok.md` - code quality (przed running tests)

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading:**
- `backup/.../01-core-principles.md` § Testy automatyczne (linie 735-862)
- `backup/.../01-core-principles.md` § Regression tests (linie 1333-1342)

**External resources:**
- Testing Library docs: testing-library.com
- Jest docs: jestjs.io
- Vitest docs: vitest.dev

---

## ✅ Self-assessment

Odznacz gdy poczujesz się komfortowo:

- [ ] Rozumiem Golden Rule (Green → Refactor → Green)
- [ ] Potrafię rozróżnić "behavior test" vs "implementation test"
- [ ] Umiem zdecydować czy fix code czy update test
- [ ] Potrafię debugować failing test (read error, reproduce, identify root cause)
- [ ] Znam red flags (many tests failing, flaky tests)
- [ ] Przeprowadziłem conajmniej **3 test debugging sessions** używając tej checklisty

**Jeśli wszystko odznaczone:** 🎉 Przejdź do `06-jak-zapisac-prace.md`

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 735-862, 820-828, 1333-1342)
- Długość: ~500 linii
- Czas przeczytania: 30-35 min
- Metodologia: Sense-Making (Situation → Gap → Help)
