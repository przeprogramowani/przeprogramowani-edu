# Lesson Grounding: m3-l4 — Testy E2E: Playwright, MCP i multimodalne scenariusze

## Scope

- Lesson source: revised spec (v2) + existing draft + autoresearch findings
- Neighbor boundaries: m3-l1 owns strategy/testing-guide.md, m3-l2 owns unit test authoring + prompt-template + 3 unit anti-patterns, m3-l3 owns hook configuration, m3-l5 owns debugging from stack trace to fix
- Relevant prework: 3.1 (token budgets), 3.3 (context management), 4.1 (Playwright in recommended stack), 4.2 (project with tests + CI/CD)
- Research posture: standard — v1 grounding covers agentic tooling; this v2 pass adds sources for new spec claims: seed test quality, E2E rules, E2E anti-patterns, selector strategy, data isolation, test independence

## Claims To Support

### Carried from v1 (already grounded — retained)
1. Playwright CLI is ~4x more token-efficient than MCP — TestCollab, Currents.dev ✓
2. Test Agents achieve ~30% F1 autonomous, ~49% with human checklist — WebTestBench ✓
3. Healer auto-repairs ~75% of selector-related failures — TestQuality ✓
4. Accessibility tree is the default agent-browser paradigm — Playwright docs ✓
5. Vision-based testing has spatial bias, cost/latency tradeoffs — Zak El Fassi ✓
6. storageState is the standard auth pattern — Playwright auth docs ✓
7. Composable fixtures preferred over POM — Autonoma AI ✓

### New in v2 spec
8. **Seed test shapes Generator output quality** — need Playwright Test Agents docs on how seed test serves as template
9. **getByRole is the recommended locator hierarchy** — need Playwright best practices docs
10. **E2E-specific anti-patterns: flaky selectors, state coupling, waitForTimeout, missing cleanup** — need multiple sources
11. **Test data isolation via unique identifiers or cleanup** — need parallelism docs + practitioner evidence
12. **E2E rules file as agent quality constraint** — need practitioner evidence on rules files for AI agents
13. **waitForTimeout as named anti-pattern** — need Playwright docs + practitioner sources

## Strong Sources

### Playwright Best Practices (Official)

- URL: https://playwright.dev/docs/best-practices
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-27
- Supports:
  - **"Prefer user-facing attributes to XPath or CSS selectors"** — getByRole as default
  - **"Each test should be completely isolated from another test and should run independently with its own local storage, session storage, data, cookies etc."** — test independence as official requirement
  - **"By using web first assertions Playwright will wait until the expected condition is met"** — web-first assertions over manual waits
  - Locators come with auto-waiting and retry-ability
  - Never use manual assertions that don't await the expect
- Use in lesson:
  - Beat 6: anchor the seed test's locator hierarchy and independence requirement in official docs
  - Beat 7: anti-patterns (CSS selectors, manual waits) are officially named
  - E2E rules block: rules derive from official best practices, not course opinion
- Confidence: high
- Notes: This is the canonical source for the lesson's quality foundations. Every rule in the E2E rules template can be traced here.

### Playwright Test Agents Documentation

- URL: https://playwright.dev/docs/test-agents
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-27
- Supports:
  - Seed test serves three roles: environment setup, context provider for planner, and bootstrap for generator
  - **"Planner will also use this seed test as an example of all the generated tests"** — seed test as quality template confirmed
  - Generated tests include metadata `// seed: tests/seed.spec.ts` referencing the seed
  - Three agent types: planner (Markdown plans), generator (TypeScript from plans), healer (auto-repair)
  - Init via `npx playwright init-agents --loop=claude`
- Use in lesson:
  - Beat 5: planner→generator workflow
  - Beat 6: the causal link between seed test quality and generated test quality is grounded here
- Confidence: high
- Notes: The key quote "Planner will also use this seed test as an example of all the generated tests" directly supports the lesson's central new claim that seed test quality shapes Generator output.

### Playwright Assertions Documentation

- URL: https://playwright.dev/docs/test-assertions
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-27
- Supports:
  - Web-first assertions automatically retry until condition is met
  - `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()` as proper replacements for waitForTimeout
  - **"Never wait for timeout in production. Tests that wait for time are inherently flaky. Use Locator actions and web assertions that wait automatically."** — official anti-pattern designation
- Use in lesson:
  - Beat 6: seed test patterns (state-based waits)
  - Beat 7: waitForTimeout as named anti-pattern with official condemnation
  - E2E rules: "Never use page.waitForTimeout()"
- Confidence: high
- Notes: The official "Never wait for timeout" quote is the strongest grounding for the waitForTimeout anti-pattern rule.

### Playwright Test Global Setup and Teardown

- URL: https://playwright.dev/docs/test-global-setup-teardown
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-27
- Supports:
  - Teardown projects via `testProject.teardown` property
  - Setup → teardown dependency: teardown runs after all dependent projects complete
  - Concrete config pattern: setup project declares teardown, teardown project has its own test match
- Use in lesson:
  - Beat 8: data isolation fundamentals
  - Deep Dive: teardown project pattern detail
- Confidence: high
- Notes: Official pattern. Lesson uses this in Deep Dive for the full teardown project approach.

### Playwright Parallelism Documentation

- URL: https://playwright.dev/docs/test-parallel
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-27
- Supports:
  - Each worker is an independent process with its own browser instance
  - Tests must be fully isolated: no shared browser state, no shared database rows, no implicit ordering
  - `test.info().workerIndex` as unique identifier per worker
  - Two parallelism axes: workers (within machine) and sharding (across CI machines)
- Use in lesson:
  - Beat 8: why tests must be independent (official constraint, not just best practice)
  - Beat 6: test independence rule in seed test
- Confidence: high
- Notes: Parallelism docs make test independence a structural requirement, not just a preference.

### Playwright CLI Documentation (v1 — retained)

- URL: https://playwright.dev/agent-cli/introduction
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-26
- Supports: CLI daemon architecture, snapshot-based interaction, element refs, session management, skills system
- Confidence: high

### Playwright for Coding Agents (v1 — retained)

- URL: https://playwright.dev/docs/getting-started-cli
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-26
- Supports: `PLAYWRIGHT_CLI_SESSION` env var pattern, CLI vs MCP positioning
- Confidence: high

### Playwright MCP Server (v1 — retained)

- URL: https://github.com/microsoft/playwright-mcp
- Type: repo
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-26
- Supports: Snapshot vs vision mode, --caps flag, 30+ tools
- Confidence: high

### Playwright Authentication Documentation (v1 — retained)

- URL: https://playwright.dev/docs/auth
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-26
- Supports: storageState pattern, global setup, .gitignore security warning
- Confidence: high

### Playwright Release Notes v1.56-v1.60 (v1 — retained)

- URL: https://playwright.dev/docs/release-notes
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-26
- Supports: Test Agents (v1.56), browser.bind() + screencast (v1.59), boxes on aria snapshots (v1.60)
- Confidence: high

### WebTestBench Paper (v1 — retained)

- URL: https://arxiv.org/html/2603.25226
- Type: paper
- Author/publisher: Academic research
- Checked: 2026-05-26
- Supports: Autonomous F1 <30%, oracle checklist ~49% F1, "incomplete checklists are the major bottleneck"
- Confidence: high

### How I Used AI to Fix Our E2E Test Architecture (Debbie O'Brien) — NEW

- URL: https://dev.to/debs_obrien/how-i-used-ai-to-fix-our-e2e-test-architecture-444a
- Type: practitioner-signal
- Author/publisher: Debbie O'Brien (Playwright team / Microsoft)
- Checked: 2026-05-27
- Supports:
  - **Rules file for AI agent**: built `pw-test-improvement` skill with strict 7-step process embedding Playwright best practices — exact parallel to the lesson's "E2E rules for your agent" concept
  - **Locator priority embedded in rules**: `getByRole > getByLabel > getByText > ...`
  - **Anti-patterns detected by AI**: waitForTimeout calls, no-op assertions, CSS class selectors, forced clicks without justification
  - **Fixture scoping strategy**: worker-scoped for expensive setup, test-scoped for mutable data
  - **Measurement outcomes**: 62% setup reduction, 80% API cleanup reduction, ~1000 lines of boilerplate removed, 15→0 manual try/finally blocks
  - **Meta-lesson**: "AI is better at applying known patterns than inventing new ones" — supports the lesson's thesis that seed test + rules are the quality levers
  - **Process over capability**: "structured process beats raw capability. The skill made refactoring repeatable" — supports the lesson's rules-file approach
- Use in lesson:
  - Beat 6: strongest practitioner evidence that E2E rules files for agents work and produce measurable improvements
  - Beat 7: concrete anti-pattern examples from real production codebase
  - Materiały dodatkowe: highly relevant link
- Confidence: high
- Notes: Debbie O'Brien is a Playwright Developer Experience team member at Microsoft. This is not a random practitioner — it's someone who works on Playwright itself using AI to improve E2E tests with a rules-based approach. Strongest single source for the lesson's new Beat 6 thesis.

### Why You Shouldn't Use page.waitForTimeout() (BrowserStack) — NEW

- URL: https://www.browserstack.com/guide/playwright-waitfortimeout
- Type: technical-post
- Author/publisher: BrowserStack
- Checked: 2026-05-27
- Supports:
  - waitForTimeout creates flakiness across environments: "calibrated on a fast machine, fails on slower devices"
  - "Hard waits do not wait for the application to be ready. They slow tests down and still break in real device environments"
  - Concrete before/after examples: `waitForTimeout(2000)` → `getByRole('button').click()` with auto-wait
  - Network alternative: `page.waitForResponse(res => res.url().includes('/checkout') && res.status() === 200)`
  - "Hard waits mask genuine performance or state problems"
- Use in lesson:
  - Beat 7: waitForTimeout anti-pattern with concrete impact description
  - E2E rules: the "never use waitForTimeout" rule is well-sourced
- Confidence: high
- Notes: Good practical source. BrowserStack is an established testing platform. Before/after code examples are usable in the lesson.

### How to Write E2E Tests for Full Parallelization (QA Wolf) — NEW

- URL: https://www.qawolf.com/blog/how-to-write-tests-for-full-parallelization
- Type: technical-post
- Author/publisher: QA Wolf
- Checked: 2026-05-27
- Supports:
  - **"Each test should create its own account or record with a unique identifier — often a randomized email or UUID — so it doesn't collide with anything else"**
  - **"Tests should never share users, sessions, or pre-seeded records"**
  - **Teardown-before-setup pattern**: "Every test should begin by deleting any artifact it may have created in a prior execution"
  - Risk of shared accounts: "When two tests try to use the same account simultaneously, there's a risk that one will lock the other out, modify shared data, or trigger rate limits"
  - Unique identifiers eliminate conflicts entirely
- Use in lesson:
  - Beat 8: test data isolation patterns (unique IDs, no shared state)
  - Beat 6: test independence rule in seed test
- Confidence: medium-high
- Notes: QA Wolf has product interest in parallel testing. Patterns are solid and widely shared. The "teardown-before-setup" pattern is an interesting alternative to the lesson's current cleanup-after approach.

## Practitioner Signals

### Playwright Best Practices 2026 (Autonoma AI) — UPDATED

- URL: https://getautonoma.com/blog/playwright-best-practices-2026
- Type: technical-post
- Signal:
  - **Locator hierarchy explicitly ranked**: getByRole (highest stability) → getByLabel/getByPlaceholder → getByText/getByAltText → getByTestId → CSS/XPath (lowest stability)
  - **"getByRole first — it doubles as an accessibility check"** — links accessibility to test stability
  - **waitForTimeout explicitly condemned**: "page.waitForTimeout(2000) is a sleep. It adds two seconds to every test run unconditionally."
  - **CSS selectors condemned**: "couple your tests to implementation details: class names, DOM structure, nesting depth"
  - **Composable fixtures**: "30% fewer lines and require no class instantiation"
  - **"Start with composable fixtures. If you later find yourself duplicating interaction logic across 20 fixtures, that is the natural signal to extract a page object."**
- Useful language:
  - "Reach for getByRole first" — good for lesson prose
  - "Expresses intent rather than implementation" — frames getByRole well
- Risk: Autonoma AI has product interest. Locator hierarchy matches official Playwright docs.
- Confidence: medium-high

### Playwright Test Agents Guide (TestDino) — NEW

- URL: https://testdino.com/blog/playwright-test-agents
- Type: technical-post
- Signal:
  - **"The seed test is the starting point for all agent activity"** and **"Everything the agents do builds on this starting point"**
  - Anti-patterns in AI-generated tests found in practice: selector brittleness (`page.locator('header img').last().click()` timing out), unstable wait strategies (`waitForURL` timing out on unexpected redirects), selector ambiguity (both header and footer have same link text)
  - **"Always review generated code before merging"** — human oversight emphasis
  - "Model variance" creates inconsistency across identical requests
- Useful language:
  - "Starting point for all agent activity" — frames seed test importance
  - Concrete anti-pattern examples from real AI-generated tests
- Risk: TestDino has product interest. Examples are real and illustrative.
- Confidence: medium-high

### State of Playwright AI Ecosystem 2026 (Currents.dev) — v1 retained

- URL: https://currents.dev/posts/state-of-playwright-ai-ecosystem-in-2026
- Type: technical-post
- Signal: "AI can describe what happened...but it cannot determine whether the outcome is correct", test governance problems, "introduce MCP integration incrementally"
- Confidence: medium-high

### VLM Visual Testing (Zak El Fassi) — v1 retained

- URL: https://zakelfassi.com/vlm-visual-testing-chrome-extension
- Type: practitioner-signal
- Signal: VLM spatial bias, cost analysis, YAML DSL for visual tests
- Confidence: medium

### Playwright Test Agents Architecture (TestQuality) — v1 retained

- URL: https://testquality.com/playwright-test-agents-mcp-architecture-2026/
- Type: technical-post
- Signal: Healer ~75%, hallucinated assertions, token caps, storageState injection
- Confidence: medium-high

## Examples Worth Using

1. **Seed test → Generator output causation** (Beats 5-6): Show a minimal seed.spec.ts using getByRole, proper waits, cleanup. Then show the Generator's output mirroring those patterns. The Playwright docs confirm: "Planner will also use this seed test as an example of all the generated tests."

2. **Debbie O'Brien's rules file approach** (Beat 6): Her `pw-test-improvement` skill with embedded locator priority, anti-pattern detection, and measurable outcomes (62% setup reduction, 1000 lines removed) is the strongest evidence that E2E rules for agents work. Don't reproduce her full skill — cite the approach and outcomes.

3. **Multi-anti-pattern review** (Beat 7): Show one agent-generated test with 3-4 problems: hallucinated assertion (checks page title), CSS selector (`div.card > button`), `waitForTimeout(3000)`, and state coupling (assumes previous test created data). Fix each. TestDino provides real examples: `page.locator('header img').last().click()` failing because site uses SVG icons.

4. **Unique identifier pattern** (Beat 8): `test-${Date.now()}-deck` as prefix for all test-created data. QA Wolf: "Each test should create its own record with a unique identifier." Show in seed test cleanup section.

5. **Comparison moment** (Beats 5-7): Same E2E scenario generated (a) without seed test/rules — produces CSS selectors, waitForTimeout, hallucinated assertion; (b) with seed test + rules — produces getByRole, proper waits, risk-tied assertion.

## Claims To Avoid Or Soften

### Carried from v1
- **"4x token reduction" as exact** — use "roughly 4x" or "up to 4x"
- **"75% healer success rate" as precise** — use "most selector-related failures"
- **F1 scores as fixed facts** — use the ~2x ratio, not exact percentages
- **VLM spatial bias numbers** — stay directional, not exact pixels
- **"CLI launched early 2026"** — avoid dating

### New in v2
- **"Seed test guarantees quality"** — soften to "seed test shapes quality." The causal link is real (Playwright docs confirm generator uses seed as example) but the Generator can still produce problems. Seed test raises the floor, doesn't eliminate the need for review.
- **"E2E rules prevent all anti-patterns"** — soften to "E2E rules reduce anti-patterns." Rules are constraints, not guarantees. The review ritual is still needed. Debbie O'Brien's results show measurable improvement, not elimination.
- **"Unique identifiers solve all data isolation"** — soften. They prevent collision but don't handle cleanup of accumulated data over time. Mention periodic cleanup need.

## Open Verification Questions

### Carried from v1
1. Primary Microsoft source for CLI token benchmarks — widely cited, no direct Microsoft blog post found
2. Primary Microsoft source for healer ~75% — GitHub source shows no success percentages
3. ~~Exact `playwright-cli` command syntax at draft time — CLI is actively developed~~ **RESOLVED 2026-06-01**: verified all draft commands against current official docs (`playwright.dev/agent-cli/introduction`, `playwright.dev/docs/getting-started-cli`, `playwright.dev/agent-cli/commands/interaction`). Package `@playwright/cli`, binary `playwright-cli`, and `open --headed` / `click <ref>` / `fill <ref> <text>` / `press <key>` / `screenshot` / `state-save <file>` / `show` all match documented syntax. No draft changes needed.
4. 10xcards visual element for vision demo — needs human decision
5. `browser.bind()` API stability — no stability warning found

### New in v2
6. **Seed test syntax at draft time** — the exact seed.spec.ts example structure may differ from current Playwright version. Verify `import { test, expect } from './fixtures'` vs `from '@playwright/test'` convention.
7. **E2E rules template — final wording** — the 6-8 rules are drafted from Playwright best practices + Debbie O'Brien's approach. Final wording should match the course's existing rules-file conventions (check m1-l4's AGENTS.md examples for format consistency).
8. **Whether to cite Debbie O'Brien by name** — she's a Microsoft/Playwright team member, not a random practitioner. Her approach directly validates the lesson's thesis. Recommendation: cite as "Materiały dodatkowe" link, reference approach in prose without name-dropping.

## Schema Source Update

Adding 5 new sources to `groundingSources`, updating `sideEffectLedger.unsupportedFacts` and `sideEffectLedger.needsHumanDecision`. Retaining all 10 existing sources from v1.
