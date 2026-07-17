# Jak AI wpływa na architecture decisions - i czy to dobrze czy źle?

**Target audience:** Software architects, tech leads, senior developers
**Reading time:** 15-20 minutes
**Methodology:** Sense-Making (Brenda Dervin) - Architecture perspective

---

## 🎯 Kiedy użyć tej checklisty?

**SYTUACJA - Architecture decision context:**

Jesteś w jednej z tych sytuacji:

- Projektujesz nowy microservice, moduł lub system - rozważasz architecture patterns
- Team używa AI do code generation → pytanie: czy architecture powinna odzwierciedlać AI capabilities?
- AI sugeruje rozwiązania które "wyglądają OK" ale nie masz pewności czy są skalowalne long-term
- Zastanawiasz się: "Czy wybrać tech stack który AI zna lepiej vs stack optymalny dla problemu?"
- Refactoring legacy code → AI struggle z complex abstractions → pytanie: uprościć czy zachować?
- Code reviews pokazują pattern: AI-generated code często łamie architecture conventions

**Fundamental tension:** AI prefers certain patterns (flat code, explicit types, mainstream tech). Your system may benefit from different patterns (abstractions, DSLs, cutting-edge tech). How to balance?

---

## 😤 Typowe wyzwania (Architect perspective)

### AI-Friendly vs Good Architecture
- **Core question:** "Czy powinienem projektować architecture dla AI convenience czy dla long-term maintainability?"
- **Conflict:** AI struggles z heavy abstractions (complex inheritance, meta-programming) → ale te abstractions mogą być właściwe dla domeny
- **Risk:** Over-simplifying architecture dla AI → technical debt

### Pattern Consistency
- **Challenge:** "AI używa patterns których nie używaliśmy dotąd - migrować całą codebase czy refactorować AI output?"
- **Example:** AI prefers functional patterns, codebase is OOP → inconsistency accumulates
- **Decision:** Define authoritative style guide czy adapt organically?

### Tech Stack Influence
- **Question:** "Czy wybrać tech stack który AI zna lepiej (TypeScript, React, Python) vs stack optymalny (Rust, Svelte, Elixir)?"
- **Trade-off:** Developer productivity (AI help) vs system properties (performance, correctness)
- **Long-term:** AI będzie doganiać niche stacks czy mainstream gap rośnie?

### Abstraction Level
- **Observation:** "AI lepiej radzi sobie z flat code niż wysokopoziomowymi abstrakcjami - czy to znak że abstractions są złe?"
- **Counter:** Abstractions istnieją for a reason (DRY, encapsulation, domain modeling)
- **Balance:** Where to draw the line?

### Over-Engineering Risk
- **Problem:** "AI generuje verbose, defensive code - czy architecture powinna być bardziej explicit dla AI?"
- **Example:** AI tworzy 10 plików zamiast 1 cohesive module → czy to better separation of concerns czy over-fragmentation?

---

## 🧭 Decision Framework

### AI-Influenced Architecture: Decision Tree

```
START: Architecture decision needed
      (e.g., pattern, tech stack, abstraction level)
  │
  ├─ STEP 1: Baseline Analysis (AI-agnostic)
  │   │
  │   ├─ Business requirements
  │   │   └─ What problem are we solving?
  │   │   └─ What are non-functional requirements (scale, performance, security)?
  │   │
  │   ├─ Technical constraints
  │   │   └─ Existing tech stack, infrastructure, integrations?
  │   │   └─ Team skills and expertise?
  │   │
  │   └─ Best practices for domain
  │       └─ What does industry use for similar problems?
  │       └─ What are proven patterns?
  │   │
  │   └─ OUTPUT: Baseline architecture recommendation
  │
  ├─ STEP 2: AI Lens Analysis
  │   │
  │   ├─ AI-friendliness assessment (see scoring rubric below)
  │   │   └─ Type explicitness: 1-5
  │   │   └─ Component granularity: 1-5
  │   │   └─ Naming clarity: 1-5
  │   │   └─ Pattern mainstream-ness: 1-5
  │   │   └─ TOTAL: __/20
  │   │
  │   ├─ Identify AI friction points
  │   │   └─ Where will AI struggle? (abstractions, DSLs, exotic patterns)
  │   │   └─ Is this friction a bug or feature? (complexity may be necessary)
  │   │
  │   └─ OUTPUT: AI-adjusted recommendation
  │
  └─ STEP 3: Reconciliation & Decision
      │
      ├─ IF: AI lens agrees with baseline
      │   └─ ✅ DECISION: Proceed with baseline (win-win)
      │
      ├─ IF: AI lens conflicts with baseline
      │   └─ ⚖️  ANALYZE TRADE-OFFS (use matrix below)
      │   └─ Weight factors:
      │       • Team AI reliance (how much do we depend on AI?)
      │       • Long-term vs short-term (quick delivery vs maintainability?)
      │       • System criticality (core domain vs peripheral feature?)
      │   └─ DECISION: Choose option with best risk-adjusted outcome
      │
      └─ IF: Uncertain
          └─ 🧪 PROTOTYPE both approaches (time-box: 1-2 days)
          └─ Measure: Dev velocity, code quality, AI effectiveness
          └─ DECISION: Pick winner based on data
```

### AI-Friendliness Scoring Rubric

**Score each dimension 1-5, total /20:**

| Dimension | 1 (AI-hostile) | 3 (Neutral) | 5 (AI-friendly) |
|-----------|----------------|-------------|-----------------|
| **Type explicitness** | Dynamic typing, implicit types, any/unknown everywhere | Mix of typed and untyped, some inference | Fully typed, explicit interfaces, strict mode |
| **Component size** | God classes (>500 LOC), monolithic modules | Mixed sizes, some cohesion | Small focused components (<200 LOC), SRP |
| **Naming clarity** | Abbreviations, domain jargon, x/y/z variables | Descriptive but inconsistent | Crystal clear, semantic, consistent conventions |
| **Pattern mainstream** | Exotic framework, custom DSL, meta-programming | Standard patterns but niche tech | REST/GraphQL, React/Vue/Svelte, common patterns |

**Interpretation:**
- **16-20:** Highly AI-friendly → AI will be very effective
- **12-15:** Moderately AI-friendly → AI will help but need guidance
- **8-11:** Low AI-friendliness → AI will struggle, expect friction
- **<8:** AI-hostile → Consider if complexity is justified

**Decision matrix:**

| Score | Team AI reliance | Recommendation |
|-------|------------------|----------------|
| 16-20 | Any | Proceed - AI will thrive |
| 12-15 | High | Proceed - monitor AI effectiveness |
| 12-15 | Low | Proceed - AI is bonus not requirement |
| 8-11 | High | 🔴 Red flag - redesign for AI or reduce AI reliance |
| 8-11 | Low | Proceed - document AI limitations |
| <8 | High | 🔴 Major conflict - choose: redesign or abandon AI for this module |
| <8 | Low | Proceed - complexity may be necessary |

---

## ✅ Checklist - Architecture Review Process

### PRE-DECISION: Architecture Proposal

- [ ] **Document architecture decision (AI-agnostic)** [Owner: Architect]
  ```
  Template:

  # Architecture Decision: [Brief Title]

  ## Context
  - Business requirement: [What are we building?]
  - Technical constraints: [Existing systems, integrations, infrastructure]
  - Team context: [Size, skills, timeline]

  ## Options Considered
  1. Option A: [Description]
     - Pros: ...
     - Cons: ...
  2. Option B: [Description]
     - Pros: ...
     - Cons: ...

  ## Baseline Recommendation
  - Chosen option: [A or B]
  - Rationale: [Why, based on requirements]
  - Trade-offs accepted: [What we're giving up]
  ```

- [ ] **Assess AI-friendliness** [Owner: Senior dev with AI experience]
  ```
  AI-Friendliness Scorecard:

  Dimension                    | Score (1-5) | Notes
  -----------------------------|-------------|------------------------
  Type explicitness            | __/5        | [e.g., "Fully TypeScript"]
  Component size & granularity | __/5        | [e.g., "Small modules planned"]
  Naming clarity               | __/5        | [e.g., "Clear domain terms"]
  Pattern mainstream-ness      | __/5        | [e.g., "REST API, React"]
  -----------------------------|-------------|------------------------
  TOTAL                        | __/20       |

  Interpretation: [Highly/Moderately/Low AI-friendly]
  ```

- [ ] **Identify AI friction points** [Owner: Team discussion]
  - List specific areas where AI will struggle:
    - Example: "Complex state management pattern (custom Redux middleware)"
    - Example: "Domain-specific abstractions (custom query language)"
  - For each friction point, ask:
    - **Is this necessary complexity?** (required by domain) → Accept friction
    - **Is this accidental complexity?** (historical baggage) → Consider simplification

### DECISION CHECKPOINT

- [ ] **Reconcile baseline vs AI-adjusted recommendation** [Owner: Architect + Tech Lead]

  **Scenario A: Agreement** (AI lens aligns with baseline)
  - ✅ Proceed with baseline architecture
  - Document: "Architecture is AI-friendly (score: __/20)"
  - No further AI-specific considerations needed

  **Scenario B: Conflict** (AI lens suggests different approach)
  - ⚖️  Facilitate trade-off discussion (see matrix below)
  - Weight factors:
    ```
    Factor                          | Weight | Score | Weighted
    --------------------------------|--------|-------|----------
    Team AI reliance (1-5)          | 3x     | __    | __
    Long-term maintainability (1-5) | 5x     | __    | __
    Time-to-market pressure (1-5)   | 2x     | __    | __
    System criticality (1-5)        | 4x     | __    | __
    --------------------------------|--------|-------|----------
    TOTAL                           |        |       | __
    ```
  - Decision rule:
    - If AI-friendly option scores higher → Choose AI-friendly
    - If baseline scores higher → Choose baseline, document AI limitations
    - If tie → Prototype both (next step)

  **Scenario C: Uncertainty**
  - 🧪 **Prototype both approaches** (time-box: 1-2 days max)
  - Build small spike for each option:
    ```typescript
    // Example: Comparing flat vs abstracted approach
    // Spike A: Flat structure (AI-friendly)
    // Spike B: Abstracted structure (domain-optimal)

    // Measure for each:
    // - Time to implement feature with AI
    // - Code quality (review subjectively)
    // - Maintainability (how easy to modify?)
    ```
  - Evaluate:
    - Which was faster to build with AI?
    - Which is clearer to understand?
    - Which will be easier to maintain long-term?
  - Decision: Pick winner, document rationale

### POST-DECISION: Documentation & Validation

- [ ] **Document final architecture decision** [Owner: Architect]
  ```
  # Architecture Decision Record (ADR)

  ## Decision
  [Chosen architecture]

  ## Rationale
  - Business/technical reasons: ...
  - AI considerations: [AI-friendliness score, friction points accepted]
  - Trade-offs: [What we optimized for, what we sacrificed]

  ## AI Guidance for Developers
  - This architecture is [highly/moderately/low] AI-friendly
  - AI will be effective for: [List tasks]
  - AI will struggle with: [List areas + workarounds]
  - Recommended AI workflow: [E.g., "Use AI for boilerplate, manual for core abstractions"]
  ```

- [ ] **Share with team** [Owner: Tech Lead]
  - Present in architecture review meeting or team sync
  - Collect feedback: "Does this make sense? Concerns?"
  - Update based on feedback

### POST-IMPLEMENTATION: Retrospective (1-2 sprints later)

- [ ] **Measure AI effectiveness in practice** [Owner: Team retrospective]
  ```
  Retrospective questions:

  1. Did AI help or hinder in this architecture?
     - Where did AI excel? [Gather examples]
     - Where did AI struggle? [Gather examples]

  2. Code quality check:
     - AI-generated code review iterations: __ avg (compare to hand-written)
     - Bugs introduced by AI: __ (compare to baseline)

  3. Developer experience:
     - "AI was helpful in this architecture" (1-10 scale): __/10
     - "I would choose this architecture again" (1-10): __/10

  4. Lessons learned:
     - What would we change next time?
     - Update architecture guidelines based on learnings
  ```

- [ ] **Update architecture playbook** [Owner: Architect]
  - Add to team knowledge base:
    - "Pattern X worked well with AI because..."
    - "Pattern Y struggled with AI because..."
  - Inform future architecture decisions

---

## 💡 Case Study: Fintech Startup - Microservices vs Modular Monolith

**Context:**
- **Company:** Fintech startup (Series A, 12 developers)
- **Product:** Payment processing platform
- **Stack:** Python (Flask), PostgreSQL, Redis
- **Decision point:** Refactor growing monolith → microservices or modular monolith?

### Traditional Analysis (AI-agnostic)

**Option A: Microservices**
- ✅ Pros: Better scalability, team autonomy, independent deployment
- ❌ Cons: Complexity overhead, distributed debugging harder, operational burden
- **Team assessment:** Too small (12 devs) for microservices overhead

**Option B: Stay monolith**
- ✅ Pros: Simplicity, easier debugging, single deployment
- ❌ Cons: Growing codebase (50k LOC), deployment coupling, scaling limitations
- **Team assessment:** Technical debt growing, need better structure

**Baseline recommendation:** Neither - explore Option C (Modular Monolith)

### AI Lens Analysis

Team started using Claude Code & GitHub Copilot heavily (85% adoption). Architect observed:

**AI observation 1:** AI struggles with cross-service context
```python
# Microservices challenge for AI:
# AI can't "see" Service B when generating code for Service A
# Result: Frequent issues with API contracts, data consistency

# Example: AI hallucinates endpoint that doesn't exist in Service B
async def get_user_balance(user_id: str):
    # AI suggests (incorrectly):
    response = await service_b_client.get("/user/balance/{user_id}")
    # Actual endpoint in Service B:
    # POST /internal/v2/balance/query
```

**AI observation 2:** AI excellent at bounded contexts
```python
# AI excels when module has clear boundaries:
# modules/payments/
#   ├── models.py       (clear types)
#   ├── service.py      (single responsibility)
#   ├── api.py          (REST endpoints)
#   └── tests.py
# AI can generate high-quality code within module boundaries
```

**AI-friendliness scores:**

| Architecture | Type explicitness | Component size | Naming | Pattern | TOTAL |
|--------------|------------------|----------------|---------|---------|-------|
| Microservices | 5 | 4 | 5 | 5 | **19/20** (per service) |
| Monolith (current) | 3 | 2 | 3 | 4 | **12/20** |
| Modular Monolith | 5 | 5 | 5 | 4 | **19/20** |

**Trade-off analysis:**
- Microservices = AI-friendly **but** too complex for team size
- Modular Monolith = AI-friendly **and** right complexity level

### Final Decision: Modular Monolith

**Architecture chosen:**
```
monolith-app/
├── modules/
│   ├── auth/           (bounded context)
│   ├── payments/       (bounded context)
│   ├── accounts/       (bounded context)
│   └── reporting/      (bounded context)
├── shared/
│   ├── db.py
│   └── utils.py
└── main.py             (single deployment)
```

**Key properties:**
- ✅ Single deployment unit (monolith benefits)
- ✅ Strict module boundaries (microservices-like structure = AI-friendly)
- ✅ Clear interfaces between modules (AI can generate module code independently)
- ✅ Migration path to microservices still open (if team grows to 50+)

### Outcome (6 months post-implementation)

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Time to implement feature (with AI) | 5 days avg | 3.5 days avg | **-30%** |
| AI code review iterations | 3.2 avg | 2.1 avg | **-34%** |
| Production bugs (AI code) | 4/month | 3/month | **-25%** |
| Developer satisfaction (AI helpfulness) | 6.8/10 | 8.2/10 | **+21%** |
| Deployment complexity | 2/10 | 2/10 | No change (monolith) |

**Lessons Learned:**

✅ **What worked:**
- **Bounded contexts = AI sweet spot** → AI generates high-quality module code
- **Single codebase = easier debugging** → AI can reference entire context when needed
- **Clear interfaces = AI understands boundaries** → Fewer hallucinated APIs
- **Migration path preserved** → Can split to microservices later if justified

⚠️ **What was challenging:**
- **Initial refactor costly** → Took 3 weeks to modularize (but worth it)
- **Discipline required** → Module boundaries must be enforced (code review checklist)
- **Not perfect for AI** → AI still struggles with cross-module transactions (acceptable trade-off)

**Recommendation:** Don't let AI dictate architecture, but consider AI as a factor in trade-off analysis (~20-30% weight).

---

## 🔍 Trade-offs & Alternatives

### Trade-off 1: Mainstream Tech Stack vs Optimal Tech Stack

**Scenario:** Choosing tech stack for new service. Team has Elixir experience (excellent concurrency model for use case), but AI knows Python/Node much better.

| Choice | Pros | Cons | **When to choose** |
|--------|------|------|-------------------|
| **Elixir** (optimal for use case) | • Perfect concurrency model<br>• Team passion & expertise<br>• Performance benefits<br>• Long-term correctness | • AI weak at Elixir (less training data)<br>• Harder to recruit<br>• Smaller ecosystem | • Performance is critical requirement<br>• Team expertise already exists<br>• Long-term project (ROI on learning curve)<br>• AI is bonus, not requirement |
| **Python/Node** (AI-friendly) | • AI knows very well<br>• Fast development with AI<br>• Large ecosystem<br>• Easy recruiting | • May not be optimal for use case<br>• Concurrency model weaker<br>• Performance trade-offs | • Time-to-market critical<br>• Team is learning (AI compensates)<br>• Use case not performance-critical<br>• Greenfield project |

**Recommendation:**

Weight AI benefit as **20-30% factor**, not primary driver:

```
Decision matrix:

Factor                          | Weight | Elixir | Python | Winner
--------------------------------|--------|--------|--------|--------
Technical fit for use case      | 40%    | 9/10   | 6/10   | Elixir
Team expertise                  | 25%    | 8/10   | 5/10   | Elixir
AI assistance quality           | 20%    | 3/10   | 9/10   | Python
Ecosystem & recruiting          | 15%    | 5/10   | 9/10   | Python
--------------------------------|--------|--------|--------|--------
WEIGHTED TOTAL                  |        | 6.7    | 6.9    | Python (barely)
```

In this example: Python wins narrowly. But if "technical fit" weight increases (e.g., performance becomes critical), Elixir wins.

**Key insight:** AI benefit is real but should not override fundamental technical fit.

### Trade-off 2: Abstractions vs Flat Code

**Scenario:** Building domain model. AI prefers flat, explicit code. Domain suggests rich abstractions (Value Objects, Entities, Aggregates in DDD).

| Approach | Pros | Cons | **Best for** |
|----------|------|------|--------------|
| **Rich domain model** (DDD-style) | • Encapsulates business logic<br>• Type safety (impossible states impossible)<br>• Long-term maintainability | • AI struggles with abstractions<br>• Harder to generate<br>• Steeper learning curve | • Core domain (high complexity)<br>• Long-lived system<br>• Team has DDD experience |
| **Flat, explicit code** (AI-friendly) | • AI generates easily<br>• Obvious what code does<br>• Fast to write | • Business logic scattered<br>• Easy to create invalid states<br>• Tech debt accumulates | • Peripheral features (CRUD)<br>• Throwaway prototypes<br>• Simple domains |
| **Hybrid** (strategic design) | • Best of both<br>• DDD for core, flat for periphery | • Complexity: two styles in codebase | • Most real-world systems |

**Recommendation: Strategic Design**

```
Core Domain (complex business logic)
  └─ Rich abstractions (DDD)
  └─ AI struggles → Accept this (manual coding for critical logic is OK)
  └─ Example: Payment processing, fraud detection, pricing engine

Supporting Subdomains (important but not differentiating)
  └─ Moderate abstractions
  └─ AI helps with boilerplate, manual for edge cases
  └─ Example: User management, reporting

Generic Subdomains (undifferentiated)
  └─ Flat, AI-friendly code
  └─ AI generates most of it
  └─ Example: Email sending, file uploads, logging
```

TypeScript example:

```typescript
// Core Domain: Rich abstractions (AI struggles, but that's OK)
class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: Currency
  ) {}

  static create(amount: number, currency: Currency): Result<Money> {
    if (amount < 0) return Err("Amount cannot be negative");
    return Ok(new Money(amount, currency));
  }

  add(other: Money): Result<Money> {
    if (!this.currency.equals(other.currency)) {
      return Err("Cannot add different currencies");
    }
    return Money.create(this.amount + other.amount, this.currency);
  }
}

// Generic Subdomain: Flat code (AI-friendly)
interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

async function sendEmail(request: EmailRequest): Promise<void> {
  // AI can generate this easily
  await emailClient.send(request);
}
```

---

## ⚠️ Anti-patterns (Architecture scale)

### 🚨 Anti-pattern 1: "Over-engineering for AI"

**Symptom:** Breaking perfectly cohesive module into 10 tiny files "because AI handles small files better"

**Example:**
```
Before (cohesive):
user-service.ts (150 lines, clear structure)

After (over-fragmented):
user/
├── types.ts           (10 lines)
├── validation.ts      (15 lines)
├── repository.ts      (20 lines)
├── service.ts         (30 lines)
├── controller.ts      (25 lines)
├── dto.ts            (20 lines)
├── mapper.ts         (15 lines)
├── errors.ts         (10 lines)
└── constants.ts      (5 lines)
```

**Why it's bad:**
- Cognitive overhead (10 files to understand 1 feature)
- Harder to navigate (jump between files)
- Over-abstraction (premature separation)

**Fix:**
```
Optimize for humans first, AI second.

Cohesion > File size
  └─ Keep related code together
  └─ Split only when cohesion breaks (SRP violation)

AI adapts better than you think.
  └─ Modern AI can handle 200-300 line files fine
  └─ Context windows are large (200k+ tokens)
```

### 🚨 Anti-pattern 2: "Following AI suggestions blindly"

**Symptom:** AI suggests microservices → you implement without questioning

**Why it happens:**
- AI trained on "best practices" articles (often advocate microservices)
- AI doesn't know your team size, constraints, timeline
- Confirmation bias (you wanted microservices anyway)

**Fix:**
```
AI is advisor, not architect.

Process:
1. AI suggests option
2. YOU evaluate:
   - Does this fit our context? (team size, timeline, complexity)
   - What are trade-offs? (AI may not mention downsides)
   - What do industry peers do? (similar company size/stage)
3. Make informed decision
4. Use AI to implement (not to decide)
```

### 🚨 Anti-pattern 3: "Ignoring AI implications entirely"

**Symptom:** Design complex abstract architecture, team struggles because AI can't help effectively

**Example:**
```typescript
// Highly abstract (AI struggles):
class GenericRepository<T extends Entity<K>, K extends Identifier> {
  async findByCriteria<C extends Criteria<T>>(
    criteria: C
  ): Promise<Result<T[], RepositoryError>> {
    // Complex generic logic...
  }
}

// Team tries to use AI to extend this → AI hallucinates, generates broken code
// Result: Productivity drops despite "good architecture"
```

**Why it's bad:**
- Team velocity suffers (AI is part of workflow now)
- Junior devs can't use AI to learn (AI confused by complexity)
- Abstractions may not be justified (accidental complexity)

**Fix:**
```
Consider AI in trade-off analysis (not zero, not primary):

Questions to ask:
1. Is this complexity necessary? (domain demands it)
   └─ YES → Accept AI friction (document workarounds)
   └─ NO → Simplify (YAGNI principle)

2. What's team AI reliance?
   └─ High (80%+ use AI daily) → Weight AI-friendliness higher
   └─ Low (AI is optional) → Weight other factors higher

3. Can we balance both?
   └─ Strategic design: Complex core + Simple periphery
```

### 🚨 Anti-pattern 4: "Mainstream cargo cult"

**Symptom:** Use React/TypeScript/REST for everything because "AI knows it well" - even when other tech is better fit

**Why it's bad:**
- Misses opportunities (e.g., GraphQL may be better for your use case)
- Stifles innovation (team doesn't learn new tech)
- AI training data will improve for niche tech over time

**Fix:**
```
Use mainstream as default, deviate when justified:

Decision framework:
├─ Is mainstream tech good enough? (80% solution)
│   └─ YES → Use mainstream (fast, AI-friendly)
│   └─ NO → Continue evaluation
│
├─ Is alternative significantly better? (95% solution)
│   └─ YES → Evaluate ROI (learning curve vs benefit)
│   └─ NO → Stick with mainstream
│
└─ ROI analysis:
    ├─ Short project (<6 months) → Prefer mainstream (time-to-value)
    └─ Long project (>1 year) → Justify alternative (amortize learning)
```

---

## 📊 Success Metrics

### Architecture AI-Friendliness Score (per module/service)

**Track quarterly:**

```
Module: _______________
AI-Friendliness Score: __/20

Breakdown:
- Type explicitness:     __/5
- Component granularity: __/5
- Naming clarity:        __/5
- Pattern mainstream:    __/5

Effectiveness metrics (from dev team):
- Time to implement feature with AI: __ hours avg
- AI code review iterations:          __ avg
- Developer satisfaction (AI help):   __/10
```

**Aggregate across modules:**
- Average AI-friendliness: __/20
- Modules with score <12: __ (investigate: necessary complexity or over-engineering?)

### Development Velocity with AI

**Measure before/after architecture change:**

| Metric | Baseline (old arch) | New architecture | Delta |
|--------|-------------------|------------------|-------|
| Feature implementation time | __ days | __ days | __% |
| Code review cycle time | __ days | __ days | __% |
| Bug rate (bugs per 1k LOC) | __ | __ | __% |
| Developer satisfaction (architecture) | __/10 | __/10 | __ |

**Target:**
- 20-40% faster implementation (with AI assistance)
- Bug rate unchanged or better (AI should not introduce more bugs)
- Satisfaction 7+/10

### Long-Term Maintainability

**Track annually:**

```
Technical Debt Metrics:
- Code churn rate (% of code changed per quarter): __%
- Refactoring PRs (how often do we need to fix architecture): __/quarter
- Onboarding time (new dev to productive): __ weeks

Correlation with AI-friendliness:
- Do highly AI-friendly modules have lower tech debt? (hypothesis)
- Do complex modules (low AI-friendliness) have higher quality? (counter-hypothesis)
```

**Key insight:** AI-friendly architecture should **not** come at cost of long-term quality.

---

## 📚 Deep Dive Resources

### Architecture Patterns & AI
- **"Building AI-Friendly Software Architectures"** → Research paper (arxiv.org)
- **"Domain-Driven Design & AI Code Generation"** → How bounded contexts help AI
- **"Microservices vs Modular Monolith in the AI Era"** → Case studies comparison

### Strategic Design
- **Domain-Driven Design (Eric Evans)** → Core concepts: bounded contexts, strategic design
- **"Fundamentals of Software Architecture"** → Trade-off analysis framework
- **"Clean Architecture (Robert C. Martin)"** → Principles that align with AI-friendliness (SRP, dependency inversion)

### Tech Stack Decisions
- **"Choosing a Tech Stack in 2025"** → Thoughtworks Technology Radar
- **Stack Overflow Developer Survey** → What's mainstream? What's trending?
- **"The Boring Technology Club"** → Case for choosing proven tech (aligns with AI-friendliness)

### Abstraction & Complexity
- **"A Philosophy of Software Design" (John Ousterhout)** → When to abstract, when to keep simple
- **"The Grug Brained Developer"** → Humorous but insightful take on complexity
- **"Accidental Complexity vs Essential Complexity"** → Fred Brooks, "No Silver Bullet"

---

**Last updated:** 2025-11-10
**Review cycle:** Every 6 months (next review: 2025-05-10)
**Maintainer:** Architecture Guild
**Feedback:** Open ADR discussion or contact Architect

