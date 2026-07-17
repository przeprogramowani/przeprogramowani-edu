# Legacy codebase + AI = chaos. Jak bezpiecznie wdrożyć AI?

**Target audience:** Tech leads, architects, engineering managers working with legacy systems
**Reading time:** 18-22 minutes
**Methodology:** Sense-Making (Brenda Dervin) - Legacy modernization perspective

---

## 🎯 Kiedy użyć tej checklisty?

**SYTUACJA - Legacy codebase context:**

Jesteś w jednej z tych sytuacji:

- Masz legacy codebase (5+ years old, 100k+ LOC), zespół chce używać AI ale obawiasz się konsekwencji
- AI struggle z legacy code: hallucin ates APIs, doesn't understand outdated patterns, suggests refactors że break everything
- Team velocity niska bo legacy code is complex → pytanie: "Czy AI może pomóc modernize legacy?"
- Risk concern: "Co jeśli AI refactor introduces subtle bugs in production code?"
- Planning: "Jak strategicznie introduce AI do legacy workflow bez big bang rewrite?"
- Question: "Czy nasz legacy code is AI-friendly w ogóle? Jak zmierzyć readiness?"

**Fundamental tension:**
- **Legacy code characteristics:** Monolithic, poorly documented, implicit knowledge, brittle tests, tech debt
- **AI preferences:** Modular, well-typed, explicit, clear patterns, good tests
- **Challenge:** Bridge the gap bez ryzyka breaking production

---

## 😤 Typowe wyzwania (Legacy system perspective)

### AI Readiness Gap
- **Problem:** Legacy code often hostile to AI
  - Lacks types (dynamic typing, `any` everywhere)
  - Poor naming (x, y, temp, data)
  - Implicit dependencies (global state, singletons)
  - Undocumented business logic ("magic numbers", tribal knowledge)
- **Consequence:** AI generates broken code lub hallucinates non-existent APIs

### Risk of Regression
- **Fear:** AI-assisted refactor breaks subtle edge cases
- **Reality:** Legacy systems often have:
  - Brittle tests (low coverage, flaky)
  - Hidden assumptions (documented nowhere)
  - Prod-only bugs (works in test, breaks in prod)
- **Question:** "Jak safely use AI when test coverage is 30%?"

### Tribal Knowledge Loss
- **Problem:** Senior devs understand legacy code (years of experience), AI doesn't
- **Risk:** Junior dev uses AI → generates code that "looks OK" but violates unwritten rules
- **Example:**
  ```typescript
  // AI suggests (plausible but wrong):
  function processOrder(order: Order) {
    return orderService.process(order); // Looks OK
  }

  // Reality (tribal knowledge):
  // In legacy system, must ALWAYS validate inventory BEFORE processing
  // or you get race condition. AI doesn't know this.
  function processOrder(order: Order) {
    inventory.lock(order.items); // REQUIRED (not obvious from code)
    const result = orderService.process(order);
    inventory.unlock(order.items);
    return result;
  }
  ```

### Modernization Strategy
- **Dilemma:** Big bang rewrite vs incremental migration
  - Big bang: High risk, long timeline, opportunity to make AI-friendly
  - Incremental: Lower risk, pragmatic, but piecemeal AI usage
- **Question:** "Jak balansować modernization z shipping features?"

### Test Coverage Bootstrap
- **Catch-22:** Need tests to safely use AI, but writing tests for legacy is hard
- **AI can help write tests** BUT need existing tests to verify AI-generated tests
- **Question:** "Gdzie zacząć?"

### Team Skill Mix
- **Challenge:** Team ma legacy expertise (Java 8, older patterns) ale nie modern AI-assisted development
- **Training:** Need to teach both AI tools AND how to apply to legacy (not greenfield)
- **Risk:** Juniors use AI na legacy bez understanding consequences

---

## 🧭 Decision Framework

### Legacy AI Readiness Assessment

```
READINESS SCORECARD: Is your legacy codebase AI-friendly?

Score each dimension 1-5, total /50:

┌─────────────────────────────────────────────────────────────┐
│ 1. Type Safety (1-10 points)                                │
├─────────────────────────────────────────────────────────────┤
│ 1-2:  Dynamic typing, no type hints, heavy use of any/var  │
│ 3-4:  Some types, but inconsistent                         │
│ 5-6:  Partially typed, modern files typed, legacy not      │
│ 7-8:  Mostly typed, strict mode on, few any escapes        │
│ 9-10: Fully typed, strict mode, explicit everything        │
│                                                             │
│ AI impact: Types are AI's roadmap. Without them, AI blind. │
│ YOUR SCORE: __/10                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. Code Modularity (1-10 points)                            │
├─────────────────────────────────────────────────────────────┤
│ 1-2:  Monolithic, god classes (>1000 LOC), tight coupling  │
│ 3-4:  Some modules, but high interdependency               │
│ 5-6:  Modular intent, but leaky abstractions               │
│ 7-8:  Clear modules, defined interfaces, loose coupling    │
│ 9-10: Domain-driven design, microservices-ready            │
│                                                             │
│ AI impact: AI struggles with sprawling code. Small focused │
│            modules = AI can generate/modify safely.        │
│ YOUR SCORE: __/10                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. Test Coverage (1-10 points)                              │
├─────────────────────────────────────────────────────────────┤
│ 1-2:  <10% coverage, no tests for critical paths           │
│ 3-4:  10-30% coverage, flaky tests, brittle                │
│ 5-6:  30-50% coverage, decent for new code, legacy untested│
│ 7-8:  50-70% coverage, integration tests present           │
│ 9-10: >70% coverage, comprehensive, fast, reliable         │
│                                                             │
│ AI impact: Tests = safety net for AI refactoring. No tests │
│            = can't verify AI output, high regression risk. │
│ YOUR SCORE: __/10                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. Documentation Quality (1-10 points)                      │
├─────────────────────────────────────────────────────────────┤
│ 1-2:  No docs, tribal knowledge only, code comments sparse │
│ 3-4:  Some READMEs, but outdated, code poorly commented    │
│ 5-6:  Decent READMEs, API docs, but business logic unclear │
│ 7-8:  Good docs, ADRs, comments explain WHY not WHAT       │
│ 9-10: Comprehensive docs, always up-to-date, self-service  │
│                                                             │
│ AI impact: AI uses docs + comments as context. Poor docs = │
│            AI makes wrong assumptions about business logic. │
│ YOUR SCORE: __/10                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 5. Code Naming & Clarity (1-10 points)                      │
├─────────────────────────────────────────────────────────────┤
│ 1-2:  Cryptic names (x, y, tmp), abbreviations everywhere  │
│ 3-4:  Mix of clear and unclear, inconsistent conventions   │
│ 5-6:  Mostly clear, but legacy sections cryptic            │
│ 7-8:  Semantic names, consistent, self-documenting         │
│ 9-10: Crystal clear, domain language, zero ambiguity       │
│                                                             │
│ AI impact: AI relies on names to understand intent. Poor   │
│            naming = AI guesses wrong, generates bad code.  │
│ YOUR SCORE: __/10                                           │
└─────────────────────────────────────────────────────────────┘

TOTAL READINESS SCORE: __/50

INTERPRETATION:
┌────────────┬──────────────────────────────────────────────┐
│ Score      │ AI Readiness Level & Recommendation          │
├────────────┼──────────────────────────────────────────────┤
│ 40-50      │ HIGH: AI will thrive. Use AI aggressively.   │
│            │ Focus: Productivity gains, architecture work │
├────────────┼──────────────────────────────────────────────┤
│ 25-39      │ MEDIUM: AI will help BUT needs preparation.  │
│            │ Focus: Bootstrap (add types, tests, docs)    │
│            │ Then gradually increase AI usage.            │
├────────────┼──────────────────────────────────────────────┤
│ 10-24      │ LOW: AI will struggle. High risk.            │
│            │ Focus: Modernize FIRST (refactor, add tests) │
│            │ Use AI sparingly (low-risk areas only).      │
├────────────┼──────────────────────────────────────────────┤
│ <10        │ VERY LOW: AI not recommended.                │
│            │ Focus: Major refactor or rewrite before AI.  │
│            │ Manual development until codebase healthier. │
└────────────┴──────────────────────────────────────────────┘
```

### Migration Strategy: Decision Tree

```
START: Legacy codebase + want to use AI
  │
  ├─ STEP 1: Assess readiness (use scorecard above)
  │   │
  │   ├─ Score ≥40 (HIGH) → OPTION A: Aggressive AI adoption
  │   ├─ Score 25-39 (MEDIUM) → OPTION B: Bootstrap then adopt
  │   └─ Score <25 (LOW) → OPTION C: Modernize first
  │
  ├─ STEP 2: Choose migration pattern
  │   │
  │   ├─ OPTION A: Aggressive AI adoption
  │   │   └─ Use AI for: Refactoring, new features, test writing
  │   │   └─ Pattern: Strangler Fig (AI-assisted code surrounds legacy)
  │   │   └─ Timeline: 3-6 months to significant AI usage
  │   │
  │   ├─ OPTION B: Bootstrap then adopt
  │   │   └─ Phase 1 (1-2 months): Add types, tests, docs
  │   │   └─ Phase 2 (2-4 months): Use AI in bootstrapped modules
  │   │   └─ Phase 3 (ongoing): Expand AI usage as readiness improves
  │   │
  │   └─ OPTION C: Modernize first
  │       └─ Phase 1 (3-6 months): Major refactor (modularize, add tests)
  │       └─ Phase 2 (1-2 months): Introduce AI gradually
  │       └─ Pattern: Big modules first, then AI-friendly rewrites
  │
  └─ STEP 3: Define AI usage rules for legacy
      │
      ├─ SAFE ZONES (green light for AI):
      │   - New features (greenfield within legacy)
      │   - Well-tested modules (>70% coverage)
      │   - Non-critical paths (edge features, tooling)
      │
      ├─ CAUTION ZONES (AI with oversight):
      │   - Refactoring existing code (review carefully)
      │   - Modules with some tests (30-70% coverage)
      │   - Medium-criticality code
      │
      └─ NO-GO ZONES (manual only):
          - Core business logic (untested, high-risk)
          - Payment/auth code (unless exceptional tests)
          - Modules with tribal knowledge (ask senior first)
```

---

## ✅ Checklist - Legacy AI Migration Implementation

### PHASE 1: Assessment & Planning (Week 1-2)

- [ ] **Conduct readiness assessment** [Owner: Tech Lead + Architect]
  ```
  Use scorecard above:

  Component/Module        | Type Safety | Modularity | Tests | Docs | Naming | TOTAL | Readiness
  ------------------------|-------------|------------|-------|------|--------|-------|----------
  Auth module             | 8           | 6          | 9     | 7    | 8      | 38/50 | MEDIUM
  Payment processing      | 3           | 4          | 5     | 4    | 5      | 21/50 | LOW
  User management         | 6           | 7          | 6     | 6    | 7      | 32/50 | MEDIUM
  Reporting (new)         | 9           | 9          | 8     | 8    | 9      | 43/50 | HIGH
  Legacy admin panel      | 2           | 2          | 1     | 2    | 3      | 10/50 | VERY LOW
  ------------------------|-------------|------------|-------|------|--------|-------|----------
  AVERAGE                 |             |            |       |      |        | 28.8  | MEDIUM

  Conclusion: Bootstrap approach (Option B)
  ```

- [ ] **Identify quick wins & no-go zones** [Owner: Tech Lead]
  ```
  SAFE ZONES (use AI aggressively):
  - Reporting module (score: 43) → AI for new features, refactoring
  - New features in auth module (score: 38) → AI-assisted development

  CAUTION ZONES (AI with review):
  - User management refactors (score: 32) → AI suggestions, manual review
  - Test writing for existing modules → AI generates, human verifies

  NO-GO ZONES (manual only):
  - Payment processing (score: 21) → Too risky, modernize first
  - Legacy admin panel (score: 10) → Don't touch with AI, rewrite later or manual only
  ```

- [ ] **Define migration strategy** [Owner: Architect + Engineering Manager]
  ```
  Chosen approach: Bootstrap then adopt (Option B)

  Phase 1: Bootstrap (Month 1-2)
  - Target: Auth, User Management modules
  - Actions: Add types, increase test coverage to 60%+, document edge cases
  - AI usage: Minimal (use AI to write tests, not prod code yet)

  Phase 2: Adopt (Month 3-4)
  - Target: Bootstrapped modules + new features
  - Actions: Use AI for feature development, refactoring in safe zones
  - AI usage: Medium (50% of work AI-assisted)

  Phase 3: Expand (Month 5+)
  - Target: Payment module (after modernization), expand coverage
  - Actions: Incremental AI adoption as readiness improves
  - AI usage: High (70-80% of new work AI-assisted)
  ```

### PHASE 2: Bootstrap (Prepare legacy for AI)

- [ ] **Add type safety** [Owner: Senior dev + AI assistance]
  ```typescript
  // Example: Legacy code (no types)
  function calculateDiscount(user, product, quantity) {
    if (user.tier === 'premium') {
      return product.price * quantity * 0.1;
    }
    return 0;
  }

  // Step 1: Add TypeScript (AI can help generate types from usage)
  interface User {
    id: string;
    tier: 'free' | 'premium' | 'enterprise';
  }

  interface Product {
    id: string;
    price: number;
    category: string;
  }

  function calculateDiscount(
    user: User,
    product: Product,
    quantity: number
  ): number {
    if (user.tier === 'premium') {
      return product.price * quantity * 0.1;
    }
    return 0;
  }

  // Now AI can understand types → better suggestions
  ```

  **Use AI for this task:**
  ```
  Prompt: "Add TypeScript types to this JavaScript function based on usage patterns.
  Infer types from all call sites. Be conservative (prefer stricter types)."

  [Paste function + sample call sites]

  Review AI output: Verify types match actual usage (AI may miss edge cases)
  ```

- [ ] **Increase test coverage** [Owner: Team, AI-assisted]
  ```typescript
  // Use AI to generate tests (faster than manual)
  // But ALWAYS review (AI may miss edge cases)

  // Prompt:
  "Generate comprehensive unit tests for this function. Include:
  - Happy path
  - Edge cases (null, empty, boundary values)
  - Error cases (invalid input)
  Use Jest framework."

  [Paste function]

  // AI generates:
  describe('calculateDiscount', () => {
    it('returns 10% discount for premium users', () => {
      const user: User = { id: '1', tier: 'premium' };
      const product: Product = { id: 'p1', price: 100, category: 'books' };
      expect(calculateDiscount(user, product, 2)).toBe(20);
    });

    it('returns 0 discount for free users', () => {
      const user: User = { id: '2', tier: 'free' };
      const product: Product = { id: 'p1', price: 100, category: 'books' };
      expect(calculateDiscount(user, product, 2)).toBe(0);
    });

    // AI may miss: What if quantity is negative? (edge case)
    // Manual add:
    it('handles negative quantity gracefully', () => {
      const user: User = { id: '1', tier: 'premium' };
      const product: Product = { id: 'p1', price: 100, category: 'books' };
      expect(calculateDiscount(user, product, -1)).toBe(0); // Business rule: no negative discounts
    });
  });
  ```

  **Target:** Increase coverage from 30% → 60%+ for modules you'll use AI on

- [ ] **Document tribal knowledge** [Owner: Senior devs, AI-assisted]
  ```markdown
  # Payment Processing Module - Tribal Knowledge

  ## Critical Invariants (AI doesn't know these!)

  1. **Inventory locking**: ALWAYS lock inventory before processing payment
     - Why: Race condition between payment and inventory update
     - Location: `processPayment()` function
     - Code pattern:
       ```typescript
       inventory.lock(order.items);
       try {
         const result = await paymentGateway.charge(order);
         await inventory.decrement(order.items);
       } finally {
         inventory.unlock(order.items);
       }
       ```

  2. **Idempotency keys**: MUST use idempotency key for payment retries
     - Why: Customer may retry on timeout, avoid double-charge
     - Pattern: `idempotencyKey = orderId + attemptNumber`

  ## AI Usage Guidelines for this module:
  - ❌ Don't use AI to refactor payment logic (too risky)
  - ✅ Use AI for: Test generation, documentation, utility functions
  - ⚠️  Always review AI suggestions with senior dev
  ```

  **Use AI to help document:**
  ```
  Prompt: "Analyze this code and identify:
  1. Non-obvious patterns (e.g., locks, idempotency)
  2. Implicit assumptions (e.g., order of operations)
  3. Edge cases not covered by tests

  [Paste legacy code]

  Then draft documentation explaining these to future developers."

  Review: Senior dev validates AI findings (AI may miss some tribal knowledge)
  ```

### PHASE 3: Gradual AI Adoption

- [ ] **Start with safe zones** [Owner: Team]
  ```
  Month 1-2: AI usage in SAFE ZONES only
  - New features in high-readiness modules (score >35)
  - Test generation for existing code
  - Documentation improvements
  - Refactoring well-tested code (>70% coverage)

  Success criteria:
  - Zero regression bugs from AI code (or <1% of bugs)
  - Team confidence grows
  - Processes refined (review checklist, prompts library)
  ```

- [ ] **Expand to caution zones (with safeguards)** [Owner: Team + Tech Lead oversight]
  ```
  Month 3-4: AI in CAUTION ZONES with extra review
  - Refactoring medium-readiness modules (score 25-35)
  - New features in critical paths (but well-tested)

  Safeguards:
  - [ ] Mandatory code review by senior dev
  - [ ] Regression test suite run (not just unit tests)
  - [ ] Pair programming (AI + junior dev + senior oversight)
  - [ ] Gradual rollout (canary deploy, feature flags)

  Success criteria:
  - Bug rate no higher than hand-written code
  - Team reports AI helpful (not hindrance)
  ```

- [ ] **Modernize no-go zones (then introduce AI)** [Owner: Senior devs]
  ```
  Month 5+: Bootstrap no-go zones (score <25)
  - Payment module: Add types, tests, docs (manual work first)
  - Then use AI for new features in modernized payment module

  Pattern: "Strangler Fig"
  - New payment features use modern, AI-friendly code
  - Old payment code gradually replaced
  - Eventually, entire module is AI-friendly

  Timeline: 6-12 months for critical modules (gradual, safe)
  ```

### PHASE 4: Risk Mitigation & Monitoring

- [ ] **Establish AI code review checklist** [Owner: Tech Lead]
  ```
  AI-generated code review (extra scrutiny for legacy):

  Business logic:
  - [ ] Preserves existing behavior (no unintended changes)
  - [ ] Respects documented invariants (tribal knowledge)
  - [ ] Handles edge cases from legacy (AI may miss)

  Integration:
  - [ ] APIs called correctly (AI may hallucinate old API signatures)
  - [ ] Database queries safe (no SQL injection, correct schema)
  - [ ] Error handling comprehensive (legacy often has poor error handling, AI may inherit)

  Testing:
  - [ ] Regression tests pass (all existing tests green)
  - [ ] New tests added (AI code has test coverage)
  - [ ] Manual QA for critical paths (don't rely on tests alone)

  Rollback plan:
  - [ ] Feature flag enabled (can disable if issues)
  - [ ] Rollback script ready (revert to previous version)
  ```

- [ ] **Implement canary deployments** [Owner: DevOps + Engineering]
  ```
  For AI-assisted refactors of legacy code:

  1. Deploy to 5% of traffic (canary)
  2. Monitor for 24-48 hours:
     - Error rate
     - Performance metrics
     - User-reported bugs
  3. If clean → Expand to 25%, then 50%, then 100%
  4. If issues → Rollback immediately, debug, fix, retry

  Tools: Feature flags (LaunchDarkly, Unleash), canary deployment (K8s, AWS)
  ```

- [ ] **Track AI code metrics** [Owner: Engineering Manager]
  ```
  Dashboard (monthly review):

  AI code quality:
  - Bug rate (AI code vs hand-written): __/1k LOC
  - Regression bugs (AI refactor introduced): __ incidents
  - Code review iterations (AI code): __ avg (vs __ hand-written)

  Productivity:
  - Feature delivery time (AI-assisted): __ days
  - Refactoring velocity (LOC refactored/month): __

  Risk:
  - Production incidents (AI-related): __
  - Rollbacks (AI code): __

  Target: AI code quality ≥ hand-written, productivity +20-40%
  ```

### PHASE 5: Continuous Improvement

- [ ] **Retrospectives: What worked, what didn't** [Owner: Team, quarterly]
  ```
  Questions:
  1. Which legacy modules were AI-friendly? Which weren't? (learn patterns)
  2. What mistakes did AI make repeatedly? (update review checklist)
  3. Did bootstrapping (types, tests, docs) pay off? (ROI)
  4. How's team confidence with AI in legacy? (sentiment)

  Action items:
  - Update AI usage guidelines based on learnings
  - Refine readiness assessment (were scores accurate predictors?)
  - Identify next modules to bootstrap
  ```

- [ ] **Expand AI-friendly coverage** [Owner: Architect]
  ```
  Goal: Increase % of codebase that's AI-friendly

  Strategy:
  - Prioritize high-traffic modules (biggest ROI)
  - Bootstrap 1-2 modules per quarter (sustainable pace)
  - Track readiness score over time (should increase)

  Target: 60%+ of codebase AI-friendly within 12-18 months
  ```

---

## 💡 Case Study: E-Commerce Platform - Legacy Migration

**Context:**
- **Company:** E-commerce platform (10 years old, 250k LOC PHP monolith)
- **Team:** 18 developers (12 familiar with legacy, 6 new hires)
- **Challenge:** Slow feature delivery (3 weeks avg), tech debt growing, team wants AI but legacy code hostile

### Initial Assessment (Month 1)

**Readiness score (overall): 18/50 (LOW)**

| Module | Type Safety | Modularity | Tests | Docs | Naming | TOTAL | Readiness |
|--------|-------------|------------|-------|------|--------|-------|-----------|
| Checkout | 2 | 3 | 4 | 3 | 4 | 16/50 | VERY LOW |
| Product catalog | 4 | 5 | 5 | 4 | 5 | 23/50 | LOW |
| User accounts | 3 | 4 | 6 | 5 | 5 | 23/50 | LOW |
| Admin panel (new) | 8 | 8 | 7 | 7 | 8 | 38/50 | MEDIUM |

**Challenges identified:**
- PHP 7.2 (weak typing), mostly dynamic
- Monolith (100k LOC single repo, high coupling)
- Test coverage: 12% (mostly admin panel, checkout untested)
- Documentation: Sparse, outdated READMEs
- Tribal knowledge: 3 senior devs know checkout logic, not documented

**Decision:** Modernize first (Option C), then introduce AI

### Migration Strategy (Months 2-6)

**Phase 1: Bootstrap critical module (Checkout) - Month 2-4**

```php
// Before (legacy PHP):
function calculate_total($cart, $user) {
  $total = 0;
  foreach ($cart as $item) {
    $total += $item['price'] * $item['qty'];
  }
  if ($user['premium']) {
    $total *= 0.9; // 10% discount
  }
  return $total;
}
// Issues: No types, magic number, no validation

// After (modernized, type-hinted PHP 8.1):
declare(strict_types=1);

/**
 * Calculate cart total with applicable discounts.
 *
 * Business rules:
 * - Premium users get 10% discount
 * - Discount applied AFTER tax calculation
 * - Minimum order: $10
 */
function calculateCartTotal(Cart $cart, User $user): Money {
  if ($cart->isEmpty()) {
    throw new EmptyCartException();
  }

  $subtotal = $cart->getSubtotal();

  if ($user->isPremium()) {
    $subtotal = $subtotal->applyDiscount(Percentage::fromInt(10));
  }

  $total = $subtotal->addTax($cart->getTaxRate());

  if ($total->lessThan(Money::fromCents(1000))) { // $10 minimum
    throw new MinimumOrderException();
  }

  return $total;
}

// Changes:
// 1. Added type hints (Cart, User, Money objects)
// 2. Extracted business logic to domain objects
// 3. Documented business rules (tribal knowledge → explicit)
// 4. Added validation (empty cart, minimum order)
// 5. Replaced magic numbers with constants

// Tests added (AI-assisted):
// - 15 test cases covering happy path + edge cases
// - Coverage: 0% → 85% for checkout module
```

**Effort:** 2 developers × 8 weeks = 16 dev-weeks
**Cost:** ~$60k (developer time)

**Phase 2: Introduce AI in modernized module - Month 5-6**

```
AI usage (Checkout module):
- New payment gateway integration → AI-generated (70% AI, 30% manual)
- Test cases for edge cases → AI-generated (90% AI, 10% review)
- Refactoring: Extract discount logic → AI-suggested, manually reviewed

Results:
- Feature delivery: 3 weeks → 1.5 weeks (-50%)
- Bug rate: No regression (tests caught all issues)
- Team confidence: "AI finally useful in this module"
```

### Outcome (Month 12)

| Metric | Before | After (12 months) | Delta |
|--------|--------|-------------------|-------|
| **Readiness score (overall)** | 18/50 | 32/50 | **+78%** |
| Checkout module readiness | 16/50 | 42/50 | **+163%** |
| Test coverage (overall) | 12% | 45% | **+275%** |
| Feature delivery time | 3 weeks | 1.2 weeks | **-60%** |
| AI adoption rate | 0% | 65% | **New capability** |
| Production bugs (AI-related) | N/A | 2 (minor) | Acceptable |
| Developer satisfaction (legacy work) | 4/10 | 7.5/10 | **+88%** |

**Investment:**
- Bootstrap effort: 40 dev-weeks (~$150k)
- Training: 2 weeks (~$15k)
- Tools (AI licenses): $12k/year
- **Total year 1:** ~$177k

**ROI:**
- Feature velocity +60% → Ship 8 extra features/year
- Revenue per feature: ~$50k avg
- Value: 8 × $50k = $400k
- ROI: ($400k - $177k) / $177k = **126%** ✅

**Lessons Learned:**

✅ **What worked:**
- **Bootstrap first, AI second** → Avoided chaos, built foundation
- **Focus on one module** → Deep improvement better than shallow widespread
- **Type safety = game changer** → AI went from useless to very helpful
- **Tests as safety net** → Confidence to use AI aggressively

⚠️ **Challenges:**
- **Upfront cost high** → $150k bootstrap investment (but paid off)
- **Team patience required** → 4 months before seeing AI benefits (delayed gratification)
- **Not all modules done** → After 12 months, still 60% of codebase legacy (ongoing journey)

**Recommendation:** For low-readiness legacy (score <25), invest in modernization before aggressive AI usage. ROI is positive medium-term (6-12 months).

---

## 🔍 Trade-offs & Alternatives

### Trade-off 1: Big Bang Rewrite vs Incremental Migration

| Approach | Pros | Cons | **Best for** |
|----------|------|------|--------------|
| **Big Bang Rewrite** | • Fresh start (no legacy baggage)<br>• AI-friendly from day 1<br>• Modern tech stack | • High risk (all-or-nothing)<br>• Long timeline (6-18 months no new features)<br>• Expensive ($500k-$2M+) | • Legacy beyond repair (score <10)<br>• Well-funded (Series B+)<br>• Can afford feature freeze |
| **Incremental (Strangler Fig)** | • Low risk (gradual)<br>• Ship features during migration<br>• Learn as you go | • Longer total timeline (12-36 months)<br>• Maintain dual systems (complexity)<br>• Inconsistent (old + new coexist) | • **Most teams (recommended)**<br>• Can't afford big bang risk<br>• Need to ship features |
| **Bootstrap then AI** | • Medium risk (targeted modernization)<br>• AI benefits sooner (3-6 months)<br>• ROI-driven (improve high-value modules first) | • Piecemeal (some modules modern, others legacy)<br>• Requires discipline (resist temptation to use AI everywhere) | • Medium readiness (score 15-30)<br>• ROI-focused<br>• Pragmatic teams |

**Recommendation:** Incremental or Bootstrap (avoid big bang unless legacy truly unsalvageable).

---

## ⚠️ Anti-patterns (Legacy migration scale)

### 🚨 Anti-pattern 1: "Use AI on legacy without preparation"

**Symptom:** Team starts using AI on low-readiness legacy code → AI generates broken code → bugs in production

**Why it fails:**
```
Legacy code (score <20) + AI = Disaster

AI hallucinates APIs (no types to guide)
AI misses edge cases (no tests to learn from)
AI violates invariants (no docs explaining tribal knowledge)

Result: More bugs than value
```

**Fix:**
```
Readiness-gated AI usage:

IF readiness score >35 → AI approved
IF readiness score 25-35 → Bootstrap first (types, tests) then AI
IF readiness score <25 → Modernize significantly before AI

Don't skip preparation!
```

### 🚨 Anti-pattern 2: "Big bang AI adoption"

**Symptom:** Mandate "everyone use AI on all work starting Monday" → Chaos

**Why it fails:**
```
Not all legacy modules equally AI-ready
Developers need learning curve (how to use AI with legacy)
High risk (many simultaneous changes)

Result: Overwhelming, bugs, rollback
```

**Fix:**
```
Gradual rollout:

Week 1-2: Safe zones only (new features, well-tested modules)
Week 3-4: Expand to caution zones (with review)
Week 5+: Expand further based on learnings

Continuous learning > big bang
```

### 🚨 Anti-pattern 3: "No rollback plan"

**Symptom:** AI-assisted refactor of critical legacy module → Bug discovered in production → No way to quickly revert

**Why it's dangerous:**
```
Legacy code often has subtle edge cases
AI may miss these (especially if poorly documented)
Without rollback plan → Extended downtime
```

**Fix:**
```
Rollback checklist:

- [ ] Feature flag (disable new code path instantly)
- [ ] Git tag before refactor (easy revert)
- [ ] Canary deployment (test on 5% traffic first)
- [ ] Monitoring alerts (detect issues fast)
- [ ] Runbook (step-by-step rollback procedure)

ALWAYS have rollback plan for legacy changes
```

### 🚨 Anti-pattern 4: "Ignore tribal knowledge"

**Symptom:** Junior dev uses AI to refactor legacy code, unaware of implicit rules → Violates invariant → Production bug

**Example:**
```typescript
// AI suggests (looks cleaner):
async function processPayment(order: Order) {
  return await paymentGateway.charge(order);
}

// Reality (tribal knowledge not captured):
// MUST lock inventory first (race condition prevention)
async function processPayment(order: Order) {
  await inventory.lock(order.items);
  try {
    return await paymentGateway.charge(order);
  } finally {
    await inventory.unlock(order.items);
  }
}
```

**Fix:**
```
Document tribal knowledge:

1. Identify critical invariants (ask senior devs)
2. Document in code comments (AI can read these)
3. Add to Architecture Decision Records (ADRs)
4. Create "legacy gotchas" doc (reference for team)

Make implicit explicit!
```

### 🚨 Anti-pattern 5: "Measure nothing, assume success"

**Symptom:** Team uses AI on legacy, assumes it's helping, but no data → May actually be hurting

**Fix:**
```
Track metrics (see Success Metrics section):

Before AI (baseline):
- Feature delivery: __ days
- Bug rate: __ per 1k LOC
- Developer satisfaction: __/10

After AI (measure):
- Feature delivery: __ days (faster or slower?)
- Bug rate: __ per 1k LOC (better or worse?)
- Developer satisfaction: __/10

Data-driven decisions > assumptions
```

---

## 📊 Success Metrics

### Readiness Improvement

**Track quarterly:**
```
Module readiness scores (from scorecard):
- Module A: __ → __ → __ (trend)
- Module B: __ → __ → __
- Average: __ (target: +5 points/quarter)

% of codebase AI-friendly (score >35):
- Q1: __%
- Q2: __%
- Target: 60%+ within 18 months
```

### Migration Progress

**Track monthly:**
```
Modules bootstrapped (types, tests, docs added):
- This month: __
- Total: __ / __ modules
- Target: 1-2 modules/quarter (sustainable)

Test coverage:
- Overall: __%
- Modules using AI: __% (should be >60%)
```

### AI Effectiveness in Legacy

**Track monthly:**
```
AI usage in legacy code:
- Features using AI: __%
- Lines of code AI-generated: __

Quality metrics:
- Bug rate (AI code in legacy): __ per 1k LOC
- Bug rate (hand-written legacy): __ per 1k LOC
- Target: AI ≤ hand-written

Productivity metrics:
- Feature delivery time (AI-assisted): __ days
- Feature delivery time (manual): __ days
- Target: 20-40% faster with AI
```

---

## 📚 Deep Dive Resources

### Legacy Modernization
- **"Working Effectively with Legacy Code"** → Michael Feathers (classic)
- **"Refactoring: Improving the Design of Existing Code"** → Martin Fowler
- **"Strangler Fig Pattern"** → Martin Fowler (incremental migration strategy)
- **"Modular Monoliths"** → Architecture pattern for legacy modernization

### Testing & Safety
- **"Testing Legacy Code"** → Strategies for adding tests to untested code
- **"Characterization Tests"** → Technique for capturing existing behavior
- **"Approval Testing"** → Snapshot testing for legacy refactors

### TypeScript Migration (if applicable)
- **"Migrating to TypeScript"** → Guide for adding types to JavaScript legacy
- **"TypeScript Deep Dive"** → Comprehensive TypeScript resource

### AI & Legacy Code
- **"AI-Assisted Refactoring Best Practices"** → Emerging patterns
- **"Prompt Engineering for Legacy Code"** → How to provide context to AI

---

**Last updated:** 2025-11-10
**Review cycle:** Quarterly (readiness assessment), Monthly (progress tracking)
**Maintainer:** Tech Lead + Architect
**Feedback:** Contact tech-lead@company.com

