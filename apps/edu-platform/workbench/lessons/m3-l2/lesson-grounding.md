# Lesson Grounding: m3-l2 — Od planu do testów: implementacja unitów z Agentem

## Scope

- Lesson source: `workbench/lessons/m3-l2/lesson-spec.md` plus target entry in `workbench/lessons-schema.json`
- Neighbor boundaries:
  - `m3-l1` owns `testing-guide.md` as the strategic quality contract, risk map, recommended stack, and AI-native testing forms. m3-l2 consumes the guide and turns selected risks into tests.
  - `m3-l3` owns hooks and triggers that run tests after edits. m3-l2 keeps test execution manual and only bridges forward.
  - `m3-l4` owns Playwright, MCP browser automation, multimodal E2E, and visual quality workflows. m3-l2 can mention these as later layers but must stay with unit/integration.
  - `m3-l5` owns debug-as-test. m3-l2 creates tests from planned risk or planned behavior, not from production debugging.
- Relevant prework:
  - 3.2 — prompt as contract; here it becomes a test-generation prompt template.
  - 3.1 — LLMs can preserve wrong assumptions; here this becomes review of AI-generated tests for implementation mirror and missing edges.
  - 1.3 — tutor mode; here this becomes the ritual of defending the test before commit.
  - 3.3 — context engineering; here this becomes picking only `testing-guide.md`, source, business scenario, and plan fragment for the agent.
  - 4.1/4.2 — agent-friendly stack and project with tests/CI; here this becomes concrete Vitest + Testing Library + MSW usage.
- Research posture: standard. The lesson mixes current tool facts, local 10x skill wiring, and research/practitioner evidence about AI-generated test quality.

## Claims To Support

- `testing-guide.md` can be the input for risk-driven test generation in existing code — needs internal confirmation from `/10x-testing-guide` and m3-l1 grounding.
- `/10x-plan` can carry test-shaped acceptance and verification content, but the explicit plan-to-tests workflow is `/10x-tdd` — needs local toolkit verification.
- Prompting must force behavior-level assertions rather than implementation mirrors — needs Testing Library principles, local `/10x-tdd` rules, and LLM-unit-test research.
- Human review remains required for LLM-generated tests — needs research support and prework continuity.
- Vitest + Testing Library + MSW is a credible JS/TS unit/integration stack in 2026 — needs official docs and current release notes.
- Mutation testing is a useful fourth verification layer because coverage does not prove assertion strength — needs Stryker docs and recent mutation/LLM testing research.
- Stryker is the canonical JS/TS mutation testing example, but the concept transfers to Stryker.NET, Stryker4s, PIT, mutmut, and equivalent tools — needs official Stryker docs and careful wording.
- The lesson should avoid benchmark-style claims about LLM-generated tests unless sourced and dated — needs softening.

## Strong Sources

### 10x TDD skill

- URL: `file:///Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-tdd/SKILL.md`
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-25
- Supports:
  - `/10x-tdd` is the explicit plan-to-tests pipeline: it reads an implementation plan, extracts testable scenarios, analyzes the stack, proposes a focused test plan, persists `test-plan.md`, and writes tests after approval.
  - The skill already encodes the lesson's desired quality bar: tests describe observable behavior, avoid implementation details, minimize mocks, group by behavior, and keep a 15-20 test budget.
  - It reads desired end state, phase acceptance criteria, automated/manual success criteria, edge cases, non-goals, and critical implementation details from a plan.
- Use in lesson:
  - Treat `/10x-plan` as the place where test-shaped requirements and success criteria live, and `/10x-tdd` as the first-class path for writing tests from that plan.
  - Use `/10x-tdd` language to make the prompt template course-native instead of generic.
- Confidence: high
- Notes:
  - This source partially resolves an open question in the spec: the plan can contain `Testing Strategy`, but plan-to-tests execution is handled by `/10x-tdd`, not by `/10x-plan` alone.

### 10x Plan skill

- URL: `file:///Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-plan/SKILL.md`
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-25
- Supports:
  - `/10x-plan` output includes phase-level automated/manual success criteria and a `Testing Strategy` section with Unit Tests, Integration Tests, and Manual Testing Steps.
  - The current plan template does not expose a named `Test Scenarios` section as a special first-class artifact.
- Use in lesson:
  - Say "dopisz test-shaped success criteria / Testing Strategy to the plan" or "use `/10x-tdd` on a plan with concrete test scenarios", not "the plan skill writes tests".
  - If the lesson wants the exact phrase `Test Scenarios`, frame it as a recommended subsection inside Testing Strategy or as a patch recommendation, not as a confirmed current command contract.
- Confidence: high
- Notes:
  - This should update the spec's open question from "unknown" to "resolved with nuance".

### 10x Testing Guide skill

- URL: `file:///Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-testing-guide/SKILL.md`
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-25
- Supports:
  - `testing-guide.md` is a durable rules-file, referenced from `AGENTS.md`, read before generating tests, planning slices, or wiring quality gates.
  - It replaces "write tests for this file" with risk-first selection of what to test and which testing form fits the risk.
  - `/10x-tdd` is explicitly listed as a downstream consumer of `testing-guide.md`.
- Use in lesson:
  - Make Workflow A start from the highest untreated risk in `testing-guide.md`, not from a file list.
  - Use the guide's "Generating tests without consulting Risk Map is a defect" framing as the lesson's discipline, not as a slogan.
- Confidence: high
- Notes:
  - m3-l2 should not re-teach how to generate the guide; it only consumes it.

### Vitest 4.1 release notes

- URL: https://vitest.dev/blog/vitest-4-1.html
- Type: official-docs
- Author/publisher: Vitest / VoidZero
- Checked: 2026-05-25
- Supports:
  - Vitest 4.1 includes `Run Related Tests`, GitHub Actions job summaries, and an `agent` reporter that reduces token-heavy output for AI coding agents.
  - Vitest remains a current JS/TS test runner choice and is explicitly adapting to agent workflows.
- Use in lesson:
  - Use as the current evidence behind "Vitest is an agent-friendly default" without going into configuration.
  - Mention `Run Related Tests` only as a forward bridge to m3-l3 hooks or local manual reruns.
- Confidence: high
- Notes:
  - Keep version details out of learner prose unless useful; source freshness is more important than naming every feature.

### Testing Library guiding principles

- URL: https://testing-library.com/docs/guiding-principles/
- Type: official-docs
- Author/publisher: Testing Library contributors
- Checked: 2026-05-25
- Supports:
  - Testing Library explicitly encourages tests that exercise components the way users use them and discourages reliance on component instances.
  - This supports the lesson's "behavioral assertion, not implementation mirror" rule.
- Use in lesson:
  - Use as a simple anchor for the review checklist: if a test only proves an internal call or implementation shape, it is not protecting behavior.
  - Useful for `Materiały dodatkowe`.
- Confidence: high
- Notes:
  - This is old but stable guidance. It is not an AI-specific source, which is a feature here.

### Mock Service Worker and Vitest request mocking guide

- URL: https://mswjs.io/ and https://vitest.dev/guide/mocking/requests.html
- Type: official-docs
- Author/publisher: MSW team / Vitest team
- Checked: 2026-05-25
- Supports:
  - MSW lets teams define client-agnostic mocks and reuse handlers across frameworks, tools, and environments.
  - Vitest recommends MSW for mocking HTTP, GraphQL, and WebSocket requests; Vitest's guide shows `setupServer`, `server.listen({ onUnhandledRequest: 'error' })`, handler reset, and Node/browser split.
- Use in lesson:
  - Use MSW for the integration-test path when the business behavior crosses a network boundary.
  - Warn against over-mocking: mock network boundaries, not the behavior under test.
- Confidence: high
- Notes:
  - m3-l2 should show a tiny integration shape if needed, but avoid full MSW setup tutorial.

### Stryker Mutator docs

- URL: https://stryker-mutator.io/ and https://stryker-mutator.io/docs/
- Type: official-docs
- Author/publisher: Stryker Mutator team
- Checked: 2026-05-25
- Supports:
  - Mutation testing changes production code and runs tests against those changes; surviving mutants suggest tests are not strong enough.
  - Coverage alone does not prove test effectiveness.
  - Stryker supports JavaScript/TypeScript, C#, and Scala; StrykerJS supports TypeScript, React, Angular, Vue, Svelte, and Node.
  - StrykerJS incremental mode can reuse prior mutant results and target a `--mutate` scope, which supports the lesson's recommendation not to run mutation testing on every commit.
- Use in lesson:
  - Deep Dive: show mutation score as a different signal from line/branch coverage.
  - Keep the operational recommendation narrow: run on critical modules, changed high-risk logic, or review moments; not every file on every commit.
- Confidence: high
- Notes:
  - Avoid full setup. Use Stryker as the canonical JS/TS example, not the only mutation testing tool.

### Large Language Models for Unit Testing: A Systematic Literature Review

- URL: https://arxiv.org/abs/2506.15227
- Type: paper
- Author/publisher: Quanjun Zhang, Chunrong Fang, Siqi Gu, Ye Shang, Zhenyu Chen, Liang Xiao
- Checked: 2026-05-25
- Supports:
  - LLMs are actively used across unit-testing tasks, including test generation and oracle generation.
  - The field still has unresolved challenges and relies on hybrid approaches rather than one-shot generation.
- Use in lesson:
  - Use as the research-level basis for "LLM tests can help, but the review loop is not optional".
  - Avoid treating LLM unit-test generation as solved.
- Confidence: medium-high
- Notes:
  - Good research overview, not a practical workflow recipe.

### TestForge: Feedback-Driven, Agentic Test Suite Generation

- URL: https://arxiv.org/abs/2503.14713
- Type: paper
- Author/publisher: Kush Jain, Claire Le Goues
- Checked: 2026-05-25
- Supports:
  - Agentic test generation improves by iterative feedback from test execution and coverage reports rather than one-shot prompting.
  - Reported line coverage and mutation score are separate evaluation dimensions.
- Use in lesson:
  - Evidence for the lesson's pętla: prompt -> output -> review/run -> refine.
  - Supports the claim that mutation score is a useful evaluation signal for generated tests.
- Confidence: medium-high
- Notes:
  - Do not import paper metrics into lesson prose unless needed. The lesson needs the pattern, not the exact benchmark.

### Test vs Mutant: Adversarial LLM Agents for Robust Unit Test Generation

- URL: https://arxiv.org/abs/2602.08146
- Type: paper
- Author/publisher: Pengyu Chang, Yixiong Fang, Silin Chen, Yuling Shi, Beijun Shen, Xiaodong Gu
- Checked: 2026-05-25
- Supports:
  - Recent research explicitly combines LLM test generation with mutant generation and uses both coverage and mutation scores to improve bug-detection robustness.
  - The research focus has moved beyond line coverage/readability toward corner cases and vulnerable execution paths.
- Use in lesson:
  - Strong backing for Deep Dive: mutation is not old-school trivia; it is now a live technique in agentic test-generation research.
  - Use as optional additional material for ambitious learners, not core required reading.
- Confidence: medium
- Notes:
  - arXiv preprint. Treat as current research signal, not industry-standard practice.

### Benchmarking LLMs for Unit Test Generation from Real-World Functions (ULT / UnLeakedTestbench)

- URL: https://arxiv.org/abs/2508.00408 (peer-reviewed version: ACM TOSEM, https://dl.acm.org/doi/10.1145/3805043)
- Type: paper
- Author/publisher: Dong Huang, Jie M. Zhang (King's College London), Mark Harman (Meta/UCL), Qianru Zhang, Mingzhe Du, See-Kiong Ng (NUS). Accepted to ACM Transactions on Software Engineering and Methodology (TOSEM); arXiv v1 still labels it "Under Review".
- Checked: 2026-05-28 (provenance verified)
- Supports:
  - Prior LLM test-generation benchmarks overstate ability because of two flaws: data contamination (the tests were in training data) and structurally trivial "toy" functions.
  - On a clean benchmark of 3,909 real-world Python functions with high cyclomatic complexity, LLM performance collapses vs. simplified benchmarks: accuracy 41.32% (vs 91.79% on TestEval), statement coverage 45.10% (vs 92.18%), branch coverage 30.22% (vs 82.04%), mutation score 40.21% (vs 49.69%).
  - A paired leaked-test benchmark (PLT) shows leaked-test accuracy (47.07%) barely beats clean (41.32%), evidence that part of apparent skill is memorization, not reasoning.
  - Test quality degrades as cyclomatic complexity rises.
- Use in lesson:
  - This is the single strongest backing for the spec belief-buster "Agent może wygenerować testy do każdego pliku" and "skoro test przechodzi, to jest dobry".
  - Author decision 2026-05-28: house "don't import metrics" rule deliberately overridden for this lesson. The opener now quotes the VERIFIED coverage gap (line ~92%→45%, branch ~82%→30%) framed as a relative benchmark-vs-benchmark drop, with a scope caveat in the failure-mode beat.
- Confidence: high
- Notes:
  - VERIFICATION CAVEAT (2026-05-28): the accuracy/Pass@5 figures are NOT reliable — two fetches of the paper disagreed (41.32%/91.79% vs 12.57%/51.93%). DO NOT cite an accuracy percentage. Only line coverage (45.10% vs 92.18%), branch coverage (30.22% vs 82.04%), and mutation score (40.21% vs 49.69%) were consistent across reads and are safe to quote.
  - Scope: 12 open/smaller code models (CodeLlama, DeepSeek-Coder, Qwen2.5-Coder, Gemma-3, Phi-4-mini, Seed-Coder), Python, 3,909 functions (cyclomatic complexity ≥10). NOT frontier agents — the lesson states this caveat explicitly.

### LLMs for Unit Test Generation: Achievements, Challenges, and Opportunities (survey)

- URL: https://arxiv.org/html/2511.21382v2
- Type: paper
- Author/publisher: Bei Chu, Yang Feng, Kui Liu (Huawei), Zhaoqiang Guo, Yichi Zhang, Hange Shi, Zifan Nan, Baowen Xu — Nanjing University, State Key Lab for Novel Software Technology. arXiv preprint, v2 (2025-12-30), 27 pages; not yet peer-reviewed.
- Checked: 2026-05-28 (provenance verified)
- Supports:
  - The oracle problem is the core limitation: deciding *what to assert* is the hard part; incorrect assertions cause >85% of failures in some benchmarks.
  - Coverage does not correlate with fault detection — a high-coverage suite can have weak bug-catching power. Mutation score is the more honest signal.
  - Pass rates often below 50%; compilation success as low as ~10% in complex (e.g. C++) projects.
  - The reliable pattern is symbiosis of LLMs with deterministic tools (compilers, symbolic executors, mutation frameworks) and iterative repair loops (>70% pass rates), not one-shot generation. Mutation-guided refinement reaches ~93% mutation score with ~28% more real bugs than a classical generator.
- Use in lesson:
  - Backbone evidence for two lesson pillars: (1) coverage ≠ assertion strength (Deep Dive justification), (2) the prompt → output → review/run → re-prompt loop is not optional.
  - Use to frame the oracle problem in plain terms: the agent can run the code, but can't reliably decide what "correct" is — that is the human's job in review.
- Confidence: medium-high
- Notes:
  - Survey-level synthesis across many studies, but an unreviewed preprint. Good for framing claims; not a single-experiment metric to quote.

### An Empirical Study of Unit Test Generation with LLMs

- URL: https://arxiv.org/html/2406.18181v1
- Type: paper
- Author/publisher: arXiv preprint
- Checked: 2026-05-28
- Supports:
  - 34–62% of generated tests fail to compile; dominant causes are hallucinated/unresolved symbols (30.7%), parameter mismatches (17.3%), and instantiating abstract classes (10.4%).
  - Because so few valid tests exist, 87% of defects were undetectable; of detectable defects only ~47% were caught, mostly (75%) because the test never produced the input that triggers the bug.
  - Adding sibling-class context improved compile rate but lowered coverage (token-budget trade-off).
- Use in lesson:
  - Evidence that the failure is not only weak assertions but also "the test never reaches the buggy path" — strengthens the prompt-template requirement to include a concrete edge case from the named risk.
  - Reinforces "review the generated test, don't trust the green check".
- Confidence: high
- Notes:
  - Java/compiled-language emphasis; the input-reachability and assertion-quality lessons transfer to JS/TS.

### On the Flakiness of LLM-Generated Tests for DBMS

- URL: https://arxiv.org/html/2601.08998v1
- Type: paper
- Author/publisher: arXiv preprint
- Checked: 2026-05-28
- Supports:
  - Of 115 flaky LLM-generated tests, 63% were "unordered collection" flakiness — asserting an order the contract never guaranteed (e.g. expecting a sorted result without ORDER BY). Remaining: non-idempotent outcome 10%, concurrency 8%, I/O/randomness ~7%.
  - LLMs transfer flaky assertions from example tests they are shown; clean your existing flaky tests before using LLMs to generate more.
  - Filtering by repeated execution (e.g. 30× in isolation) catches flakiness before human review.
- Use in lesson:
  - Concrete, measured form of "implementation mirror / assert what the contract doesn't promise" — useful as a named anti-pattern beyond the existing three.
  - Optional: a one-line mention that order-dependent assertions are a top flakiness source.
- Confidence: medium-high
- Notes:
  - DBMS/SQL + C++ context. Use the root-cause shape, not the absolute flakiness rates.

### Quality Assessment of Python Tests Generated by LLMs

- URL: https://arxiv.org/abs/2506.14297
- Type: paper
- Author/publisher: arXiv preprint (Alves, Bezerra, Machado, Rocha, Virgínio, Silva)
- Checked: 2026-05-28
- Supports:
  - Across GPT-4o, Amazon Q, and Llama 3.3: assertion errors were 64% of all errors; "Lack of Cohesion of Test Cases" was the most common smell (41%). Most generated suites contained at least one error or smell.
  - Prompt context trades off defect classes: detailed textual prompts produced fewer errors but more smells.
- Use in lesson:
  - Backs the review checklist's focus on assertions specifically, and the idea that the prompt-template wording materially changes test quality.
- Confidence: medium-high
- Notes:
  - Python-specific; small per-model samples. Treat as supporting signal for the assertion-quality emphasis, not a headline statistic.

## Practitioner Signals

### Reddit / practitioner testing discussions about AI-generated tests

- URL: https://www.reddit.com/r/AI_Coders/comments/1s4d7s0/the_problem_with_aigenerated_tests_theyre_written/ and related practical-testing threads
- Type: community-discussion
- Signal:
  - Practitioners repeatedly describe the same pain: AI-generated tests pass, raise coverage, and still encode the current implementation rather than the intended behavior.
  - Common language: false confidence, tests written after seeing the answer, tests that survive only until a refactor.
- Useful language:
  - "false coverage"
  - "the test saw the answer"
  - "behavior, not implementation"
- Risk:
  - Community threads are weak evidence and often anecdotal. Use only to name the pain; facts should come from docs, local skill contracts, or papers.
- Confidence: medium

### m3-l1 grounding as local continuity signal

- URL: `file:///Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/workbench/lessons/m3-l1/lesson-grounding.md`
- Type: internal-course-material
- Signal:
  - m3-l1 already grounded Vitest, MSW, Testing Library-adjacent stack, Playwright MCP, hooks, and testing-guide positioning.
  - m3-l2 should reuse this continuity instead of re-litigating why the stack exists.
- Useful language:
  - "classic base + AI-native layer"
  - "testing-guide as contract"
- Risk:
  - m3-l2 still must recheck any current tool detail it plans to state precisely.
- Confidence: high

## Examples Worth Using

- Workflow A prompt template:

```text
We are adding a test for risk: [risk id/title from testing-guide].
Business scenario: [one user-visible behavior].
Source under test: [file/function/module].
Write a Vitest test that asserts the observable behavior.
Do not assert internal calls or mirror the implementation.
Include at least one edge case from the risk.
Explain in one sentence which regression this test would catch.
```

- Workflow B plan add-on:

```markdown
### Testing Strategy

#### Unit Tests
- Behavior: [what must hold]
- Edge: [boundary / empty / null / invalid input]

#### Integration Tests
- Scenario: [API/component/network behavior]
- Mock boundary: [network/API only; do not mock the domain logic]

#### Manual Testing Steps
- [only what cannot yet be automated cheaply]
```

- Review checklist:
  - Does the test assert behavior, or does it just repeat the implementation?
  - Does it include at least one edge case that could actually break in production?
  - Would this test fail if the named business risk regressed?
  - Can the learner explain the regression this test catches in one sentence?

- Mutation Deep Dive flow:
  - Run tests and note coverage.
  - Run Stryker on a small critical module or changed source scope.
  - Inspect surviving mutant.
  - Ask the agent for a new test that kills that mutant while staying behavioral.
  - Re-run mutation testing and compare mutation score, not just line coverage.

## Claims To Avoid Or Soften

- "AI can generate good tests automatically" — too broad. Safer: AI can accelerate test creation when it receives risk, behavior, source context, and a review loop.
- "`/10x-plan` owns test scenarios as a first-class command feature" — current toolkit has `Testing Strategy` and success criteria; `/10x-tdd` is the dedicated plan-to-tests skill.
- "Coverage 80% means enough safety" — false. Coverage is a visibility metric, not assertion strength.
- "Mutation score is better than coverage" — too simplistic. Safer: they answer different questions.
- "Run Stryker on every commit" — too expensive for many projects. Safer: use it on critical modules, high-risk changes, review moments, or scheduled checks.
- "Stryker is the only mutation testing option" — false. Stryker is the canonical JS/TS example here; the concept transfers.
- "LLM-generated tests are bad" — too broad. Safer: one-shot LLM tests often need review and feedback loops to become trustworthy.
- "LLMs are good at writing tests (per benchmarks)" — most public benchmarks are contaminated and use toy functions; on clean real-world code, accuracy and coverage roughly halve (ULT, 2026). Safer: cite the real-world-vs-toy gap as the reason review and feedback loops matter, and avoid quoting any single percentage as settled fact.

## Metrics In Learner Prose (rule override 2026-05-28)

The author explicitly asked to break the house "don't import metrics" rule. Every figure below was verified verbatim against the primary source on 2026-05-28. Audit list for RC review:

| Figure in draft | Source | Verified value | Location in draft |
|---|---|---|---|
| Pokrycie ~92%→45% linii, ~82%→30% gałęzi (toy vs real) | Huang i in., ULT, ACM TOSEM 2026 (2508.00408) | LCov 92.18%→45.10%, BCov 82.04%→30.22% (avg across 12 models) | Opener |
| ~47% (GPT-4) do >60% testów nie kompiluje się | Yang i in., 2024 (2406.18181) | GPT-4 CSR 52.96% (47% invalid); open models 38–49% CSR | Failure-mode beat |
| Powody: nieistniejące symbole ≈31%, złe argumenty ≈17% | Yang i in., 2024 | 30.68% / 17.25% of invalid tests | Failure-mode beat |
| ~75% przeoczeń = brak właściwego wejścia; asercje <2% | Yang i in., 2024 | missing inputs 74.99%; improper assertions <1.20% | Failure-mode beat |
| 64% błędów to asercje; smell braku spójności 41% | Alves i in., 2025 (2506.14297) | 64% / 41% | Failure-mode beat |
| GPT-4 ~40%/~32% vs EvoSuite ~79%/~77% pokrycia | Yang i in., 2024 | GPT-4 40.43%/31.78%; EvoSuite 78.91%/76.59% | Deep Dive |
| 63% niestabilnych testów (72/115) = nieokreślona kolejność | Berndt i in., 2026 (2601.08998) | 72/115 = 62.6% | Deep Dive |
| Modele "przenoszą" flaky assertions z kontekstu | Berndt i in., 2026 | "Both LLMs were susceptible to transferring the flakiness present in the provided context" | Deep Dive |
| Konsensus: LLM + narzędzie deterministyczne, nie sam prompt | Chu i in., 2025 (2511.21382) | survey framing | Deep Dive |

Deliberately NOT quoted: ULT accuracy/Pass@5 (conflicting reads), survey's ">85% assertion failures" and "~10% C++ compile" (only single-fetch summary, not verified verbatim). A scope caveat sits in the failure-mode beat: numbers come from Java/Python studies on older/smaller models, the *pattern* transfers, the exact percent does not.

## Open Verification Questions

- Does the final m3-l2 draft want to explicitly teach `/10x-tdd`, or keep the learner-facing wording as "dopisz test scenarios do planu" to avoid introducing one more skill name in the core path?
- Should the exact `Test Scenarios` subsection be added to the `/10x-plan` skill/template, or should m3-l2 present it as a local convention inside `Testing Strategy`?
- Which demo module in 10xcards is stable enough for a mutation demo without spending the lesson on setup?
- Should the course provide a ready Stryker config for the demo repo, or should the Deep Dive only show the report conceptually?

## Schema Source Update

Added `groundingSources` to `m3-l2` with the strongest source metadata:

- internal `/10x-tdd` skill for the plan-to-tests contract,
- internal `/10x-plan` skill for current plan template boundaries,
- internal `/10x-testing-guide` skill for risk-first guide consumption,
- Vitest 4.1 release notes for agent-friendly runner details,
- Testing Library guiding principles for behavior-level assertions,
- MSW + Vitest request mocking docs for integration-test network boundaries,
- Stryker docs for mutation testing and mutation score,
- LLM unit-testing literature review for current research state,
- TestForge and Test vs Mutant for feedback/mutation-driven generated test loops.

Also updated `sideEffectLedger.unsupportedFacts` and `sideEffectLedger.needsHumanDecision` for the `/10x-plan` vs `/10x-tdd` distinction and Stryker demo decisions.
