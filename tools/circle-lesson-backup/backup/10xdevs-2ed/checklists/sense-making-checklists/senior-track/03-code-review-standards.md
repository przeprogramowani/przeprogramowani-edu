# Jak review AI-generated code gdy sam używasz AI do review?

**Target audience:** Tech leads, senior developers, code reviewers
**Reading time:** 15-20 minutes
**Methodology:** Sense-Making (Brenda Dervin) - Code review perspective

---

## 🎯 Kiedy użyć tej checklisty?

**SYTUACJA - Code review context:**

Jesteś w jednej z tych sytuacji:

- Review'ujesz pull request - nie wiesz który kod napisał dev, a który AI
- Sam używasz AI do review (Claude/ChatGPT sprawdza kod) - circular dependency: AI reviews AI?
- Team velocity rośnie (AI pomaga pisać kod szybciej), ale code review stał się bottleneckiem
- Zauważasz pattern: AI-generated code często ma similar issues (verbose, defensive, generic naming)
- Junior dev submit'uje 500-line PR - suspiciously polished - jak verify że rozumie co napisał?
- Question: Czy AI code powinien mieć **the same bar** co hand-written? **Higher?** **Lower?**

**Fundamental challenge:** Traditional code review assumes human author. AI introduces new dynamics:
- **Attribution unclear:** Which parts are AI-generated?
- **Understanding gap:** Author may not fully understand AI-generated code
- **Review automation:** AI can review AI code (but should it?)
- **Quality bar:** What's acceptable for AI code?

---

## 😤 Typowe wyzwania (Reviewer perspective)

### Attribution & Accountability
- **Problem:** "Nie wiem który fragment napisał AI - jak to wpływa na review standard?"
- **Accountability:** Jeśli AI code introduces bug - kto odpowiada? Author? Reviewer? Both?
- **Documentation:** Czy wymagać labeling "AI-assisted" w PR description?

### Circular Dependency
- **Paradox:** AI code reviewed by AI-assisted reviewer
  - Example: Author uses Copilot → Reviewer uses Claude to check → Obie AI mogą mieć te same blind spots
- **Question:** Czy AI review tools są reliable? Jak verify AI reviewer output?

### Understanding Verification
- **Critical:** Czy author rozumie kod który submit'uje?
  - Jak to sprawdzić bez bycia patronizing?
  - Red flags: Nie potrafi wytłumaczyć decyzji, copy-paste z AI bez modyfikacji
- **Balance:** Trust vs verification (nie chcemy code review jako interrogation)

### Quality Bar
- **Inconsistency:** Niektórzy reviewers akceptują AI code łatwiej ("AI wygenerował więc pewnie OK")
- **Others:** Over-scrutinize AI code (distrust)
- **Need:** Consistent standards regardless of code origin

### Volume vs Depth Trade-off
- **Reality:** AI enables developers write more code faster
- **Consequence:** Review queue grows
- **Temptation:** Shallow review (just check tests pass)
- **Risk:** Accumulate tech debt, miss subtle bugs, security vulnerabilities

### Tool Sprawl
- **Challenge:** Team uses different AI review tools (CodeRabbit, GitHub Copilot Review, Claude, ChatGPT)
- **Inconsistency:** Different tools catch different issues
- **Question:** Standardize na 1 tool czy allow flexibility?

---

## 🧭 Decision Framework

### Hybrid Review Model: Human + AI Strengths

```
CODE REVIEW LAYERS: Multi-level approach

┌─────────────────────────────────────────────────────────────┐
│ LEVEL 0: Automated Checks (CI/CD)                           │
│ - Linting, formatting, type checking                        │
│ - Unit tests, integration tests pass                        │
│ - Security scans (secrets, vulnerabilities)                 │
│ - Code coverage thresholds                                  │
│ Owner: CI/CD system                                         │
│ AI role: None (pure automation)                             │
└─────────────────────────────────────────────────────────────┘
                         ↓ (Pass → Continue)
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: AI-Assisted Review (Syntax & Style)                │
│ - Code style consistency                                    │
│ - Obvious bugs (null checks, type errors)                   │
│ - Performance anti-patterns (N+1 queries, etc.)             │
│ - Documentation completeness                                │
│ Owner: AI tools (CodeRabbit, Claude, etc.)                  │
│ Human role: Triage AI findings (accept/reject)              │
└─────────────────────────────────────────────────────────────┘
                         ↓ (Major issues → Fix & resubmit)
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 2: Human Peer Review (Logic & Design)                 │
│ - Business logic correctness                                │
│ - Edge cases handled?                                       │
│ - API design (naming, interfaces)                           │
│ - Test coverage adequate?                                   │
│ - Code understandability                                    │
│ Owner: Peer reviewer (senior dev)                           │
│ AI role: Reference (ask AI for second opinion if unsure)    │
└─────────────────────────────────────────────────────────────┘
                         ↓ (Complex or critical → Escalate)
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 3: Architect Review (Architecture & Security)         │
│ - Architecture compliance (follows patterns?)               │
│ - Security implications (auth, data handling)               │
│ - Scalability concerns                                      │
│ - Long-term maintainability                                 │
│ Owner: Architect or Tech Lead                               │
│ AI role: None (human judgment critical)                     │
└─────────────────────────────────────────────────────────────┘
                         ↓ (Approved → Merge)
```

### When to escalate to higher level?

| Trigger | Escalate to |
|---------|-------------|
| PR touches authentication, authorization, or payment logic | **Level 3** (Architect) |
| PR size >500 lines or touches >10 files | **Level 3** (complexity) |
| AI review flags security concern | **Level 3** (security) |
| Introduces new architecture pattern | **Level 3** (architecture) |
| PR from junior dev (first 3 months) | **Level 2** (peer review) |
| AI review flags >5 issues | **Fix & resubmit** → Level 1 again |
| Standard feature PR (<200 lines, tests pass) | **Level 2** (peer review) |

### Review Depth: Risk-based Approach

```
DECISION TREE: How much review depth?

START: New PR submitted
  │
  ├─ Is this core business logic? (payments, auth, data processing)
  │   └─ YES → DEEP review (Level 2 + Level 3)
  │   └─ NO → Continue
  │
  ├─ Is this customer-facing? (UI, API, user data)
  │   └─ YES → MEDIUM review (Level 2)
  │   └─ NO → Continue
  │
  ├─ Is this internal tooling / scripts?
  │   └─ YES → LIGHT review (Level 1 + spot-check Level 2)
  │   └─ NO → Continue
  │
  └─ Default: MEDIUM review (Level 2)
```

### AI Code Quality Bar

**Question:** Should AI-generated code have different standards?

**Answer:** **No** - same quality bar, but **adjusted verification process**

| Aspect | Hand-written code | AI-generated code | **Key difference** |
|--------|------------------|-------------------|-------------------|
| **Correctness** | Must be correct | Must be correct | **+** Verify author understands logic |
| **Tests** | Required | Required | **+** Tests should be written by human (verify edge cases) |
| **Naming** | Semantic, clear | Semantic, clear | **Watch for:** Generic names (data, result, temp) |
| **Performance** | Reasonable | Reasonable | **Watch for:** Over-defensive code (unnecessary checks) |
| **Security** | Secure by default | Secure by default | **+** Extra scrutiny (AI may miss context) |
| **Documentation** | When complex | When complex | **+** Explain non-obvious AI choices |

---

## ✅ Checklist - Code Review Process for AI Era

### PRE-REVIEW: Author Preparation

- [ ] **PR description includes AI usage disclosure** [Owner: PR Author]
  ```
  Template (add to PR template):

  ## AI Assistance
  - [ ] No AI used
  - [ ] AI used for boilerplate/scaffolding (specify: Copilot/Claude/etc.)
  - [ ] AI used for logic implementation (specify sections)
  - [ ] AI used for refactoring existing code

  If AI used:
  - Which tool(s): _______________
  - For which parts: _______________
  - Manual modifications made: _______________
  - I understand all code changes: [ ] Yes [ ] Partially [ ] No (be honest!)
  ```

- [ ] **Self-review checklist** [Owner: PR Author]
  ```
  Before submitting PR, author checks:
  - [ ] All tests pass (added new tests for new logic)
  - [ ] No obvious AI artifacts (generic variable names, verbose comments)
  - [ ] Code follows team conventions (not AI's generic style)
  - [ ] I can explain every line of code (no "magic" sections)
  - [ ] Security-sensitive code double-checked (auth, secrets, PII)
  - [ ] AI-generated code adapted to our context (not copy-paste)
  ```

### LEVEL 0: Automated Checks (Required for all PRs)

- [ ] **CI/CD passes** [Owner: Automation]
  ```bash
  # Example GitHub Actions checks:
  - Linting (ESLint, Pylint, etc.)
  - Type checking (TypeScript strict, mypy, etc.)
  - Unit tests (100% of new code covered)
  - Integration tests (critical paths)
  - Security scan (Snyk, GitGuardian for secrets)
  - Code coverage >80% (or team threshold)
  ```

- [ ] **No blocking findings** [Owner: Automation]
  - Security vulnerabilities: 0 critical, 0 high
  - Secrets detected: 0
  - Linting errors: 0
  - Type errors: 0

**If Level 0 fails:** PR blocked until fixed (no human review needed yet).

### LEVEL 1: AI-Assisted Review (Optional but Recommended)

- [ ] **Run AI review tool** [Owner: PR Author or Reviewer]

  **Tool options:**
  - CodeRabbit (GitHub app, automated)
  - Claude Code (manual: paste diff, ask for review)
  - ChatGPT Code Review (manual)

  **Example prompt for manual AI review:**
  ```
  Review this code change for:
  1. Obvious bugs (null pointer, type errors, logic flaws)
  2. Performance issues (N+1 queries, unnecessary loops)
  3. Code style violations (naming, structure)
  4. Security concerns (SQL injection, XSS, secrets in code)
  5. Test coverage gaps

  [Paste git diff]

  Focus on concrete issues, not subjective style preferences.
  ```

- [ ] **Triage AI findings** [Owner: Reviewer or Author]
  ```
  For each AI finding:
  - [ ] Valid issue → Fix before merge
  - [ ] False positive → Dismiss (document why)
  - [ ] Subjective preference → Discuss with team (update style guide if recurring)

  Track false positive rate:
  - If >50% false positives → AI tool may not be good fit for your codebase
  ```

- [ ] **Document AI review outcome** [Owner: Reviewer]
  ```
  Comment in PR:
  "AI review (Claude): 3 issues found
  - Issue 1: Potential null pointer at line 45 → Fixed
  - Issue 2: Missing error handling → Added try/catch
  - Issue 3: Variable naming 'data' too generic → False positive (contextually clear)"
  ```

### LEVEL 2: Human Peer Review (Required for most PRs)

- [ ] **Business logic correctness** [Owner: Peer Reviewer]
  ```
  Questions to ask:
  - Does this implement the feature requirement correctly?
  - Are edge cases handled? (null/empty inputs, boundary conditions)
  - Error handling appropriate? (fail fast vs graceful degradation)

  For AI-generated code, EXTRA question:
  - "Can you walk me through the logic here?" (verify author understands)
  ```

- [ ] **API design review** [Owner: Peer Reviewer]
  ```
  Check:
  - Function/method naming: Clear, consistent with codebase?
  - Parameters: Reasonable number (<5), well-named?
  - Return types: Explicit, handle errors properly?
  - Backward compatibility: Breaking changes flagged?

  Watch for AI patterns:
  - Generic names (getData, processData, handleRequest) → Ask for specificity
  - Over-parameterization (AI tends to add "future-proof" params) → YAGNI check
  ```

- [ ] **Test coverage & quality** [Owner: Peer Reviewer]
  ```
  Verify:
  - Happy path tested: [ ]
  - Edge cases tested: [ ] (null, empty, boundary values)
  - Error cases tested: [ ] (invalid input, downstream failures)
  - Integration tested: [ ] (if touches multiple modules)

  Red flag (AI-generated tests):
  - Tests only check "function doesn't crash" (not actual behavior)
  - Tests hardcode expected values without logic (brittle)
  → Request: Rewrite tests to verify business logic
  ```

- [ ] **Code understandability** [Owner: Peer Reviewer]
  ```
  Ask yourself:
  - Can I understand this code in 5 minutes?
  - Are variable/function names semantic?
  - Is code structure logical (not convoluted)?

  AI code red flags:
  - Overly verbose (AI explains obvious things in comments)
  - Overly defensive (unnecessary null checks everywhere)
  - Generic abstractions (premature generalization)
  → Request: Simplify
  ```

- [ ] **Author understanding verification** [Owner: Peer Reviewer]
  ```
  For AI-heavy PRs, ask (respectfully):
  "Can you explain why you chose approach X over Y here?" (line: ___)
  "What happens if [edge case]?" (verify author thought through)

  Good sign: Author explains clearly, discusses trade-offs
  Red flag: "AI suggested this, not sure why" → Request: Understand or rewrite
  ```

### LEVEL 3: Architect Review (For critical/complex PRs)

**Trigger conditions:**
- Core business logic (payments, auth, data processing)
- Architecture changes (new patterns, new dependencies)
- Security-sensitive (handles PII, secrets, authentication)
- Large PR (>500 lines, >10 files)

- [ ] **Architecture compliance** [Owner: Architect/Tech Lead]
  ```
  Check:
  - Follows team architecture patterns?
  - Doesn't introduce new pattern without ADR (Architecture Decision Record)?
  - Dependencies justified? (not pulling in heavy library for trivial task)
  - Modularity preserved? (no tight coupling introduced)

  AI code watch for:
  - AI may suggest "standard" solutions that don't fit your context
  - Example: AI suggests Redux for simple state → Overkill
  ```

- [ ] **Security deep dive** [Owner: Security Champion or Architect]
  ```
  Audit:
  - Authentication/authorization logic correct?
  - Input validation comprehensive? (SQL injection, XSS, etc.)
  - Secrets handling safe? (no hardcoded keys, proper secret manager)
  - Data privacy compliant? (GDPR, PII handling)
  - Audit trail present? (for compliance, if needed)

  AI-generated code risks:
  - AI may not know your security requirements (context gap)
  - AI may use deprecated security practices (trained on old code)
  → Manual security review critical for sensitive code
  ```

- [ ] **Scalability & performance** [Owner: Architect/Tech Lead]
  ```
  Evaluate:
  - Database queries optimized? (no N+1, proper indexing)
  - Caching strategy appropriate?
  - API design scales? (pagination for large datasets, rate limiting)
  - Resource usage reasonable? (memory leaks, connection pooling)

  AI code watch for:
  - AI often optimizes for correctness, not performance
  - Example: AI may fetch all records then filter in-memory → Fix: Filter in SQL
  ```

- [ ] **Long-term maintainability** [Owner: Architect/Tech Lead]
  ```
  Questions:
  - Will this code be understandable in 6 months?
  - Is abstraction level appropriate? (not over-engineered, not too flat)
  - Does this create tech debt? (shortcuts, TODOs, workarounds)
  - Migration path if requirements change?

  Document decision:
  - If accepting tech debt: Create follow-up ticket, explain trade-off
  ```

### POST-REVIEW: Continuous Learning

- [ ] **Track review metrics** [Owner: Tech Lead, monthly]
  ```
  Metrics to track:
  - AI-assisted PRs: __% of total PRs
  - Average review time: AI-assisted vs hand-written
  - Bug escape rate: AI code vs hand-written
  - Review iterations: AI code vs hand-written (how many back-and-forth rounds?)

  Insight: Are AI PRs faster to merge or slower? Better quality or worse?
  ```

- [ ] **Update review guidelines based on learnings** [Owner: Team retrospective, quarterly]
  ```
  Retrospective questions:
  - What AI code patterns caused issues? (add to review checklist)
  - What AI code patterns worked great? (document best practices)
  - Are AI review tools helpful or noisy? (adjust or replace)
  - Is review process bottleneck? (adjust levels, add reviewers, automate more)
  ```

---

## 💡 Case Study: E-Commerce Platform Review Process Evolution

**Context:**
- **Company:** E-commerce SaaS (Series B, 40 developers across 4 teams)
- **Stack:** TypeScript/React frontend, Node.js backend, PostgreSQL
- **AI adoption:** 90% of developers using GitHub Copilot, 60% using Claude/ChatGPT
- **Problem:** Code review bottleneck (PRs taking 3-5 days to merge, frustration growing)

### Before AI Era (Baseline)

**Review process:**
- All PRs require 2 approvals (senior + peer)
- Manual review (no AI tools)
- Average review time: 2 days
- Review checklist: 15 items (correctness, style, tests, security)

**Pain points:**
- Consistent but slow
- High review quality
- Bottleneck on seniors (only 8 seniors for 40 devs)

### After AI Adoption (Chaos Period - Month 1-3)

**What changed:**
- Devs started using Copilot → PR volume increased 40% (devs write code faster)
- No change to review process → Bottleneck worsened
- Review time: 3-5 days (queue grew)
- Frustration: Devs felt slowed down by reviews

**Incident (Month 2):**
```typescript
// Junior dev submitted AI-generated authentication code:
function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded as User; // AI generated - looks OK
  } catch {
    return null;
  }
}

// Reviewer (also using AI) asked AI to review → AI said "looks good"
// Both missed: JWT_SECRET not validated (could be undefined → security hole)
// Bug deployed to production → Caught in penetration test (thankfully)
```

**Wake-up call:** AI reviewing AI code created blind spots.

### Solution Implemented (Month 4-6)

**New hybrid review process:**

**Level 0: Automation (new)**
```yaml
# Added CI checks:
- ESLint strict mode
- TypeScript strict: true
- Security scan (Snyk)
- Test coverage >85%
- Secret detection (GitGuardian)
```

**Level 1: AI-assisted review (new)**
```
- CodeRabbit auto-reviews all PRs
- Flags: style issues, obvious bugs, security patterns
- Author must respond to all CodeRabbit comments (accept/reject/fix)
```

**Level 2: Human peer review (refined)**
```
- Required: 1 peer approval
- Focus: Business logic, understanding verification
- Checklist reduced to 8 items (Level 0 & 1 handle rest)
- For AI-heavy PRs: Author must explain logic (async video or PR comment)
```

**Level 3: Architect review (new)**
```
- Triggered by:
  - Core business logic (payments, auth, inventory)
  - PR >300 lines
  - New architecture pattern
  - Security-sensitive code
- Focus: Architecture, security, scalability
```

### Outcome (Month 6 post-implementation)

| Metric | Before AI | Chaos Period | **New Process** | Delta |
|--------|-----------|--------------|-----------------|-------|
| Average review time | 2 days | 4 days | **1.5 days** | **-25%** |
| PR merge rate | 20/week | 28/week | **35/week** | **+75%** |
| Bug escape rate (prod) | 2/month | 5/month | **1.5/month** | **-25%** |
| Reviewer satisfaction | 7/10 | 4/10 | **8/10** | **+14%** |
| Author satisfaction | 6/10 | 3/10 | **7.5/10** | **+25%** |
| Level 3 escalation rate | N/A | N/A | 12% of PRs | (new metric) |

**Lessons Learned:**

✅ **What worked:**
- **Automation (Level 0) removed drudgery** → Freed reviewer time for high-value review
- **AI tools (Level 1) caught 60% of issues early** → Faster feedback loop
- **Tiered review** → Right level of scrutiny for each PR (not one-size-fits-all)
- **Understanding verification** → Prevented "copy-paste without understanding"

⚠️ **What was challenging:**
- **Initial resistance** → Seniors felt "AI is doing my job" (mitigated: emphasize AI handles boring stuff, you focus on interesting stuff)
- **CodeRabbit noise** → 30% false positive rate initially (tuned config, now ~15%)
- **Cultural shift** → Teaching team when to escalate to Level 3 (created decision tree)

**Recommendation:** Hybrid model (automation + AI + human) is optimal. Pure human or pure AI both have blind spots.

---

## 🔍 Trade-offs & Alternatives

### Trade-off 1: AI Review Tools - Automated vs Manual

| Approach | Pros | Cons | **Best for** |
|----------|------|------|--------------|
| **Automated AI review** (CodeRabbit, GitHub Copilot Review) | • Instant feedback<br>• Consistent<br>• Scales to high PR volume<br>• Low effort | • False positives (~15-30%)<br>• May miss context-specific issues<br>• Cost ($$$)<br>• Integration overhead | High-volume teams (>50 PRs/week)<br>Budget for tooling<br>Value consistency |
| **Manual AI review** (Claude, ChatGPT) | • Flexible (custom prompts)<br>• Cheaper (pay-per-use)<br>• No integration needed<br>• Good for one-off deep dives | • Manual effort required<br>• Inconsistent (depends on prompt)<br>• Slower<br>• No persistent history | Low-volume teams (<20 PRs/week)<br>Budget-conscious<br>Custom review needs |
| **No AI review** (pure human) | • No false positives<br>• Full context understanding<br>• Builds reviewer expertise | • Slow<br>• Doesn't scale<br>• Boring work for humans<br>• Inconsistent (human fatigue) | Small teams (<5 devs)<br>No budget<br>High-touch code (security critical) |
| **Hybrid** (automated AI + human triage) | • Best of both worlds<br>• Human validates AI findings<br>• Scales moderately | • Requires triage process<br>• Some false positive burden | **Most teams (recommended)** |

**Recommendation:** Start with manual AI review (cheap experiment), upgrade to automated if ROI proven.

### Trade-off 2: Review Depth - Risk-based vs Uniform

| Approach | Pros | Cons | **Best for** |
|----------|------|------|--------------|
| **Uniform deep review** (all PRs get Level 2 + Level 3) | • Highest quality bar<br>• Catches all issues<br>• Trains junior reviewers | • Bottleneck at scale<br>• Overkill for low-risk code<br>• Reviewer burnout | Small teams<br>Critical systems (healthcare, finance)<br>Low PR volume |
| **Risk-based tiered** (adjust depth by risk) | • Efficient (focus on high-risk)<br>• Scales better<br>• Faster for low-risk PRs | • Requires judgment (what's risky?)<br>• May miss issues in "low-risk" code | **Most teams (recommended)**<br>High PR volume<br>Mixed criticality |
| **Light review only** (trust + automate) | • Fast<br>• Maximum autonomy<br>• Low overhead | • High bug risk<br>• Tech debt accumulates<br>• No learning for juniors | Senior-only teams<br>Experimental projects<br>High risk tolerance |

**Recommendation:** Risk-based tiered (use decision tree from framework section).

---

## ⚠️ Anti-patterns (Code Review scale)

### 🚨 Anti-pattern 1: "Blind trust in AI code"

**Symptom:** Reviewer sees "AI-generated" → assumes it's correct → rubber-stamp approval

**Why it's dangerous:**
```typescript
// AI-generated code that looks correct:
async function getUserOrders(userId: string) {
  const orders = await db.query(
    `SELECT * FROM orders WHERE user_id = '${userId}'` // SQL injection!
  );
  return orders;
}

// Reviewer using AI to check → AI may miss context (assumes DB is sanitized)
// Result: Security vulnerability merged
```

**Fix:**
```
AI code requires SAME scrutiny as human code.
In fact, EXTRA scrutiny for security-sensitive code (AI lacks context).

Checklist:
- [ ] Don't assume AI = correct
- [ ] Verify security-sensitive code manually (auth, SQL, user input)
- [ ] Ask: "Would I approve this if human wrote it?"
```

### 🚨 Anti-pattern 2: "AI review without human validation"

**Symptom:** Fully automate review (CodeRabbit auto-approves if no issues found)

**Why it's dangerous:**
- AI tools have false negatives (miss issues)
- AI doesn't understand business logic
- AI can't verify author understanding

**Fix:**
```
AI review = ASSISTANT, not REPLACEMENT

Process:
1. AI reviews code (flags issues)
2. Human triages AI findings (validate)
3. Human reviews business logic (AI can't do this)
4. Human approves (takes responsibility)

AI augments human, doesn't replace.
```

### 🚨 Anti-pattern 3: "No attribution requirement"

**Symptom:** Reviewers don't know which code is AI-generated → can't adjust review accordingly

**Example:**
```
PR #1234: 500 lines of code, tests pass, looks good
Reviewer: "LGTM 👍" (2 min review)
Reality: 480 lines were Copilot-generated, author didn't understand 30%
Result: Merged code that's a black box
```

**Fix:**
```
Require AI usage disclosure in PR template:

## AI Assistance
- [x] AI used for [sections X, Y, Z]
- Tool: GitHub Copilot
- I understand all changes: [x] Yes

Reviewer adjusts depth based on disclosure:
- High AI usage + junior author → Extra verification
- Low AI usage → Standard review
```

### 🚨 Anti-pattern 4: "One-size-fits-all review process"

**Symptom:** All PRs go through same review (deep, slow) regardless of risk level

**Why it's inefficient:**
```
Low-risk PR (fixing typo in comment): Waits 2 days for 2 approvals
High-risk PR (new payment logic): Gets 1 quick approval, not enough

Result: Frustration + mis-allocated review effort
```

**Fix:**
```
Risk-based tiered review (see framework):

Low-risk: Level 0 + Level 1 (fast)
Medium-risk: Level 0 + Level 1 + Level 2 (standard)
High-risk: All levels (deep)

Adjust dynamically based on PR content.
```

### 🚨 Anti-pattern 5: "No feedback loop"

**Symptom:** Track no metrics, never improve review process

**Why it's a problem:**
- Don't know if AI review tools are helping or noisy
- Don't know if AI code quality is better or worse
- Review process stagnates

**Fix:**
```
Monthly review metrics dashboard:

Metric                                  | This Month | Last Month | Trend
----------------------------------------|------------|------------|-------
Average review time (AI code)           | 1.8 days   | 2.1 days   | ↓
Average review time (human code)        | 2.0 days   | 2.0 days   | →
Bug escape rate (AI code)               | 2/month    | 3/month    | ↓
AI review false positive rate           | 18%        | 25%        | ↓
Reviewer satisfaction                   | 7.5/10     | 7.2/10     | ↑

Action items:
- False positive rate still high → Tune CodeRabbit config
- AI code review time improving → Keep doing what works
```

---

## 📊 Success Metrics

### Review Efficiency

**Track weekly:**
```
Average review cycle time:
- AI-assisted PRs: ___ hours
- Hand-written PRs: ___ hours
- Target: <24 hours for standard PRs

Review iterations (back-and-forth rounds):
- AI-assisted PRs: ___ avg
- Hand-written PRs: ___ avg
- Target: <2 iterations

Review bottleneck:
- PRs waiting for review: ___
- Target: <10 in queue
```

### Review Quality

**Track monthly:**
```
Bug escape rate:
- Bugs found in production per 1000 LOC
- Segment: AI code vs hand-written
- Target: No regression (AI code ≤ hand-written)

Security incidents:
- Security issues merged to production
- Segment: AI code vs hand-written
- Target: 0 critical incidents

Test coverage:
- % of new code covered by tests
- Target: >85%
```

### AI Review Tool Effectiveness

**Track monthly:**
```
AI review findings:
- Total issues flagged by AI: ___
- Valid issues (accepted by author): ___
- False positives (rejected): ___
- False positive rate: ___% (Target: <20%)

AI review value:
- Issues caught by AI that human missed: ___
- Issues caught by human that AI missed: ___
- Conclusion: AI + human > either alone?
```

### Team Satisfaction

**Track monthly (pulse survey):**
```
Questions (1-10 scale):
1. "Code review process is efficient" → ___/10
2. "I receive helpful feedback in reviews" → ___/10
3. "Review doesn't block my productivity" → ___/10
4. "AI review tools are helpful" → ___/10

Target: 7+/10 across all questions
```

---

## 📚 Deep Dive Resources

### Code Review Best Practices
- **"Code Review Best Practices" (Google Engineering)** → Industry standard guidelines
- **"The Science of Code Reviews" (Microsoft Research)** → Data-driven insights
- **"Effective Code Reviews Without the Pain"** → SmartBear white paper

### AI-Assisted Review
- **"AI Code Review Tools Comparison 2025"** → CodeRabbit vs alternatives
- **"Prompt Engineering for Code Review"** → How to ask AI to review effectively
- **"False Positives in AI Code Analysis"** → Research on AI tool accuracy

### Security Review
- **OWASP Code Review Guide** → Security-focused review checklist
- **"Reviewing AI-Generated Code for Security"** → New attack vectors
- **"Secret Scanning Tools Comparison"** → GitGuardian, TruffleHog, etc.

### Process & Culture
- **"Pull Request Guidelines" (GitHub)** → Effective PR practices
- **"Code Review Etiquette"** → Giving feedback without being a jerk
- **"Building a Code Review Culture"** → Thoughtworks insights

---

**Last updated:** 2025-11-10
**Review cycle:** Every 6 months (next review: 2025-05-10)
**Maintainer:** Engineering Excellence Team
**Feedback:** Open issue in team-docs repo or contact code review champions

