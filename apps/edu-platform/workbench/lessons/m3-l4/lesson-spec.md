# Lesson Spec: m3-l4 — Testy E2E: Playwright, MCP i multimodalne scenariusze

## Schema Context

- Course: 10xdevs-3
- Module: M3 — AI Development Quality & Maintenance
- Position: 4/5 (global 14)
- Depends on: m3-l3 (Hooki i triggery: Agent, który sam reaguje na błędy)
- Prepares for: m3-l5 (Debugowanie z AI: od stack trace'a do gotowego fixa)

## Prework Continuity

- Relevant prework lessons: 3.1 (LLMs — token budgets, degradation), 3.3 (context management), 3.5 (model tiers), 4.1 (tech stack — Playwright named), 4.2 (project with tests + CI/CD)
- Assumed from prework: Learner understands token budgets and context degradation (3.1, 3.3). Learner knows the recommended stack includes Playwright (4.1). Learner has a working project with basic CI/CD and tests (4.2).
- Deepened here: Token budgets become a concrete engineering tradeoff (CLI ~27K vs MCP ~114K tokens). Playwright moves from "named tool in stack" to "agent-operated browser." Multimodal capabilities from prework 3.5's model tier discussion become a practical E2E verification technique.
- Avoid repeating: Tool installation basics, what CI/CD is, what Playwright is at the overview level, model selection frameworks.

## m3-l1 / m3-l2 Continuity

m3-l1 established:
- testing-guide.md as quality contract with risk map (impact × likelihood)
- Risk-to-layer mapping: which risks need unit vs integration vs e2e vs visual
- AI-native testing patterns at strategic level (MCP, multimodal E2E, vision — named but deferred to m3-l4)
- Quality gates pipeline: per-edit → pre-commit → CI → deploy

m3-l2 established:
- Risk-driven test generation discipline: concrete, risk-tied input (risk + source + business scenario) → separately verified behavioral assertion
- 3 LLM unit-test anti-patterns: implementation mirror, happy-path-only, missing edge cases
- Review ritual before commit: "can you explain what regression this catches?"
- Re-prompting on specific flaws rather than starting over

m3-l4 bridges from these by:
- Operationalizing the "multimodal E2E" and "QA-oriented MCP" categories from m3-l1's testing-guide
- Introducing the **E2E-level quality lever** (counterpart to m3-l2's risk-tied-input + behavioral-assertion discipline) → the **seed test** as quality template for Generator output
- Introducing E2E-specific anti-patterns that differ from m3-l2's unit anti-patterns (hallucinated assertions, flaky selectors, state coupling, waitForTimeout, missing cleanup)
- Extending the quality pipeline from m3-l3 with E2E as CI-time gate
- NOT re-teaching: risk mapping (m3-l1), unit test authoring discipline (m3-l2), hook configuration (m3-l3)

## Lesson Job

m3-l3 left the learner with automated code-level quality checks: hooks trigger lint, typecheck, and unit tests per-edit. But hooks operate on source code — they can't catch visual regressions, broken user flows, or accessibility failures. m3-l1 named "multimodal E2E" and "QA-oriented MCP" as strategic categories in testing-guide.md and explicitly deferred configuration to m3-l4. This lesson closes that gap: it teaches the learner to make their AI coding agent operate a browser directly — exploring the app through accessibility snapshots, generating E2E tests from what it sees, and using vision-based verification when the DOM falls short.

But the lesson must go beyond tooling. The 2nd edition and OFE courses taught foundational E2E practices (selector strategies, test independence, data isolation, storageState optimization) that remain essential in 2026. The difference: those practices now serve as **quality constraints on agent output** rather than manual coding guidelines. The seed test templates the Generator's style. E2E rules constrain what the agent produces. The review ritual catches what slips through. Without these foundations, the agentic tooling produces tests that pass today but break tomorrow.

The lesson must stay operational (how to set up, when to use which approach, how to review) and must not drift into debugging failed E2E tests (m3-l5) or test strategy creation (m3-l1).

## Thesis

Your AI coding agent can explore your app through a browser, generate E2E tests from what it sees, and verify results through both DOM and vision — but the quality of those tests depends on three things you control: the seed test that templates the agent's output, the E2E rules that constrain it, and the review ritual that catches what it misses.

## Learning Outcomes

- Learner sets up Playwright CLI for their coding agent and navigates 10xcards through accessibility snapshots, using element refs instead of hand-written selectors.
- Learner writes a seed test (`seed.spec.ts`) that demonstrates quality patterns: `getByRole` as default locator, test independence, waiting on state not time, assertion tied to risk, and test data cleanup.
- Learner adds E2E testing rules to their project rules file (CLAUDE.md / .cursor/rules/) that constrain agent output: locator hierarchy, test independence, no waitForTimeout, business-outcome assertions, data cleanup, storageState for auth.
- Learner selects 2-3 highest risks from testing-guide.md and generates E2E scenarios using the planner→generator workflow, then reviews generated assertions against both the risk map and the E2E anti-pattern checklist.
- Learner identifies and fixes E2E-specific agent anti-patterns in generated tests: hallucinated assertions, flaky CSS selectors, state coupling between tests, hardcoded waits, and missing cleanup.
- Learner configures `storageState` for authenticated E2E tests, eliminating the login loop from agent-driven test sessions.
- Learner sets up basic test data isolation (unique identifiers or cleanup-per-test) so E2E tests don't conflict across runs.
- Learner configures vision mode (`--caps=vision`) and uses screenshot + VLM to verify a UI element the accessibility tree doesn't adequately represent, and names the limitations of this approach.
- Learner explains the CLI vs MCP tradeoff (~4x token difference) and decides when to use which in their project.

## Audience Starting Point

The learner has unit/integration tests from m3-l2, automated hooks from m3-l3, and a testing-guide.md with risk areas from m3-l1. They've seen their agent edit code and self-correct via hook feedback. But they haven't had the agent operate a browser. They may have written Playwright tests manually or with basic AI prompting (2nd edition approach), but they don't know about Playwright CLI, MCP modes, Test Agents, or vision-based verification.

Key assumptions to disarm:
- "E2E test generation means prompt the agent with a description and get a test file back" — no, the agent explores the live app
- "If the test passes, it works" — no, hallucinated assertions and flaky patterns create false confidence
- "The agent knows how to write stable E2E tests" — no, without seed test and rules, agent produces brittle, state-coupled tests with CSS selectors and hardcoded waits
- "Vision mode is the future of all testing" — no, it's a supplement with real cost/reliability tradeoffs

## Behavioral Change

After this lesson, the learner's agent explores their app in a browser and generates E2E tests from what it sees. Before the tests enter the suite, the learner reviews them against the seed test patterns and E2E anti-pattern checklist — catching not just wrong assertions but also flaky selectors, shared state, and missing cleanup.

## Owned Concepts

- Playwright CLI (`@playwright/cli`) as the primary agent-browser interface for coding agents: setup, snapshot-based navigation, element refs, session management, and the token-efficiency rationale vs MCP
- Playwright MCP as the richer but more expensive alternative for dedicated agentic loops: snapshot mode vs vision mode, `--caps` flag system, when MCP is the better choice
- Playwright Test Agents (planner/generator/healer) as a structured workflow for E2E test creation: init, seed test, planner→generator→healer cycle
- Accessibility-tree-based browser interaction as the default E2E paradigm for agents: snapshot YAML, element refs, role-based targeting vs CSS vs data-testid
- **Seed test (`seed.spec.ts`) as the primary E2E quality lever** — templates Generator output with: getByRole locators, test independence, state-based waits, risk-tied assertions, data cleanup. The E2E-level quality lever, counterpart to m3-l2's discipline of risk-tied input + a separately verified behavioral assertion.
- **E2E testing rules as project rules** — concrete rules block for CLAUDE.md / .cursor/rules/ that constrains agent E2E output: locator hierarchy (getByRole > getByTestId > never CSS), test independence, no waitForTimeout, assert business outcome, cleanup strategy, use storageState
- **E2E-specific agent anti-patterns** beyond hallucinated assertions: flaky CSS selectors, state coupling between tests, hardcoded waits (waitForTimeout), missing test data cleanup. Extension of m3-l2's unit-level anti-pattern checklist to the E2E layer.
- **Test data isolation for E2E** — unique identifiers or cleanup-per-test pattern so tests don't conflict across parallel/sequential runs. Teardown project pattern for Supabase/RLS in Deep Dive.
- Vision-based multimodal verification as a practical supplement: Playwright vision mode, screenshot + VLM evaluation, when DOM-based fails, cost/reliability tradeoffs, "when NOT to use"
- Risk-driven E2E scenario selection: mapping testing-guide.md risk areas to E2E test scenarios, prioritizing critical user flows over broad coverage
- `storageState` for authenticated E2E: pre-authenticated state injection to avoid login loops in agent-driven test runs

## References Only

- testing-guide.md as strategy + risk source (m3-l1)
- AI-native testing patterns at strategic level: multimodal E2E, QA-oriented MCP (m3-l1 — strategic framing only)
- Unit/integration test authoring with agent, risk-tied input + behavioral-assertion discipline, 3 unit anti-patterns (m3-l2 — E2E builds on that discipline)
- PostToolUse hooks and three-layer quality pipeline (m3-l3 — E2E extends the pipeline)
- Debug-as-test workflow and failure diagnosis (m3-l5)
- Rules-file hierarchy: AGENTS.md/CLAUDE.md (m1-l4)
- CI/CD pipeline as E2E execution environment (m1-l5, m2-l5)
- Prompt as contract (prework 3.2) — shapes how learner formulates E2E scenario descriptions
- Token budgets and context management (prework 3.1, 3.3) — grounds CLI vs MCP decision
- Recommended stack includes Playwright (prework 4.1)
- Stagehand (browserbase/stagehand) as an alternative AI-native browser automation tool — Deep Dive category example, not taught
- OFE/19 best practices (selector hierarchy, test independence, scenario selection) — operationalized as agent output constraints, not re-taught as Playwright tutorial

## Must Not Cover

- testing-guide.md creation or risk prioritization (m3-l1)
- Unit/integration test authoring, Vitest config, Testing Library, MSW (m3-l2)
- Hook configuration, PostToolUse wiring, three-layer pipeline setup (m3-l3)
- Debug strategy from stack trace to fix, complex failure diagnosis (m3-l5)
- Code review methodology and triage (m2-l3)
- CI/CD pipeline creation, GitHub Actions YAML, deployment config (m1-l5, m2-l5)
- AGENTS.md/CLAUDE.md authoring from scratch (m1-l4)
- Playwright installation tutorial or project bootstrap (prework 4.1, m1-l2/m1-l3)
- Visual regression tool comparison (Argos, Lost Pixel, Percy) beyond brief mention as alternatives
- Stagehand configuration or API deep dive (Deep Dive category mention only)
- VLM model comparison, benchmarking, or cost optimization (vision is a practical technique, not a model selection lesson)
- Page Object Model pattern tutorial (2nd edition content; 3rd edition favors composable fixtures)
- Selector strategy as a standalone Playwright tutorial (teach it as "what to put in your seed test and rules to constrain agent output," not as "how to manually write selectors")

## Required Example Or Demo

**Narrative project:** 10xcards (learner's running project from M2/M3). The agent explores 10xcards in a browser via Playwright CLI, generates E2E tests for the highest-risk flow from testing-guide.md (e.g., creating a flashcard deck, reviewing flashcards in spaced repetition mode), then adds a vision-based check for a visual element the accessibility tree doesn't represent well.

**Seed test moment:** Before running planner→generator, the learner writes a seed.spec.ts that demonstrates the quality patterns. Generator output is shaped by this seed — lesson shows the causal link.

**Anti-pattern review moment:** Agent generates a test with (a) a hallucinated assertion, (b) a CSS selector instead of getByRole, and (c) a waitForTimeout. Learner catches all three using the E2E anti-pattern checklist, fixes them.

**Vision supplement moment:** Agent runs the DOM-based test successfully, but a visual regression (overlapping elements, broken layout on mobile) is only caught when the learner adds a vision-mode screenshot check.

## Structural Logic Map

### Beat 1 — Opening: beyond source code
- **Beat:** m3-l3 ended with hooks catching code-level problems. The lesson opens with what hooks can't catch: "your agent fixed the type error in 2 seconds, but the flashcard deck now renders with overlapping cards on mobile. No hook saw that."
- **Question answered:** "I have hooks and unit tests — what's still missing?"
- **Introduces:** The browser gap — quality problems that exist only in the rendered UI.
- **Depends on:** m3-l3 (hooks work for code, not for UI)
- **Sets up:** Agent-as-browser-operator as the solution
- **Diagram opportunity:** —
- **Risk:** Could re-teach m3-l1's quality strategy framing. Stay concrete: "hooks can't see your app in a browser."

### Beat 2 — Agent meets the browser: accessibility snapshots
- **Beat:** Introduce the core paradigm shift: the agent interacts with your app through the browser's accessibility tree — structured, semantic, deterministic. Not by reading screenshots, not by guessing CSS selectors. The accessibility tree gives the agent a map of every element with roles, names, states, and reference IDs.
- **Question answered:** "How does an AI agent 'see' a web app?"
- **Introduces:** Accessibility tree as the agent's primary interface to the browser, element refs (e.g., `e5`, `e15`), YAML snapshots
- **Depends on:** Beat 1 (the problem)
- **Sets up:** Playwright CLI as the concrete tool (Beat 3)
- **Diagram opportunity:** Mermaid: Agent → accessibility snapshot (YAML) → element refs → action command → updated snapshot. The loop that makes agent-browser interaction deterministic.
- **Risk:** Could become abstract. Ground immediately with a real snapshot.

### Beat 3 — Playwright CLI: the token-efficient path
- **Beat:** Practical setup: install `@playwright/cli`, open 10xcards, issue commands, receive snapshot file paths. Show the agent's actual interaction: shell commands in, structured state out. Contrast with MCP's ~114K token cost — CLI saves snapshots to disk (~27K tokens per task).
- **Question answered:** "How do I give my agent browser access without burning my token budget?"
- **Introduces:** Playwright CLI installation, core commands, snapshot files on disk, element ref targeting, session management. The ~4x token efficiency claim.
- **Depends on:** Beat 2 (accessibility tree concept)
- **Sets up:** storageState (Beat 4), risk-driven test generation (Beat 5)
- **Diagram opportunity:** —
- **Risk:** Could become a CLI reference manual. Keep it to: install, open, 3-4 commands, show the snapshot.

### Beat 4 — storageState: skip the login loop
- **Beat:** Before generating tests, the agent needs to be authenticated. Without storageState, every test run starts with a login flow. Show how to save auth state once and inject it into every agent session.
- **Question answered:** "How do I test authenticated flows without logging in every time?"
- **Introduces:** `storageState` save/load pattern, CLI state-save, Playwright config option
- **Depends on:** Beat 3 (CLI is set up)
- **Sets up:** E2E test generation (Beat 5)
- **Diagram opportunity:** —
- **Risk:** Could become a Playwright auth tutorial. One pattern, one example, move on.

### Beat 5 — From risk map to E2E scenario
- **Beat:** The learner opens testing-guide.md, identifies the top 2-3 risks that require E2E coverage, and uses the planner→generator workflow. Show `npx playwright init-agents --loop=claude`, seed test requirement, Markdown test plan → TypeScript test file workflow.
- **Question answered:** "How do I go from testing-guide.md risks to actual E2E tests?"
- **Introduces:** Playwright Test Agents (planner, generator), `init-agents`, seed test, Markdown plan → TypeScript workflow, risk-to-E2E mapping. Brief heuristic: "if the risk crosses multiple system boundaries or exists only in the rendered UI, it's an E2E risk."
- **Depends on:** Beat 3 (CLI works), Beat 4 (auth is handled), m3-l1 (testing-guide.md exists)
- **Sets up:** Seed test quality (Beat 6), assertion review (Beat 7)
- **Diagram opportunity:** Mermaid: testing-guide.md risk → planner explores app → Markdown plan → generator writes TypeScript → test runs → review. Human review gate before suite entry.
- **Risk:** Could oversell the pipeline as autonomous. Be honest: ~30% F1 without checklist, ~2x with. The risk map is the learner's "checklist."

### Beat 6 — Seed test and E2E rules: quality levers for agent output (NEW)
- **Beat:** The central new beat. m3-l2 shaped unit test generation through risk-tied input and a separately verified behavioral assertion. The E2E-level quality lever is the **seed test**: a hand-written exemplar that templates Generator output. Plus **E2E rules** in the project rules file that constrain what the agent produces.
  - Seed test demonstrates: `getByRole` as default locator (connects to accessibility tree from Beat 2), test independence (no shared state), state-based waits (`toBeVisible`, `waitForURL`, `waitForResponse` — never `waitForTimeout`), assertion tied to risk name, data cleanup (unique ID or afterEach).
  - E2E rules block: 6-8 concrete rules for CLAUDE.md / .cursor/rules/, covering the same patterns as the seed test but as explicit constraints the agent reads before generating.
  - Show concrete code: a complete seed.spec.ts (8-15 lines) and a complete rules block (6-8 rules).
  - Connect selector hierarchy to OFE/19's reasoning: getByRole maps to accessibility tree (what the agent sees), data-testid for ambiguous elements, CSS selectors never (brittle, breaks on refactor, irrelevant to user behavior).
- **Question answered:** "How do I make the agent produce stable, high-quality E2E tests instead of brittle ones?"
- **Introduces:** Seed test as quality template, E2E rules for agent, locator hierarchy (getByRole > getByTestId > never CSS), test independence, proper waits, data cleanup strategy, assertion-to-risk binding
- **Depends on:** Beat 5 (planner/generator workflow exists), Beat 2 (accessibility tree → getByRole connection), m3-l2 (risk-tied-input discipline as precedent for quality levers)
- **Sets up:** Anti-pattern review (Beat 7)
- **Diagram opportunity:** —
- **Risk:** Could become a Playwright best-practices tutorial disconnected from agents. Keep every point framed as "this shapes what the agent produces" or "this is what you check in agent output." Reference m3-l2's risk-tied-input discipline as the unit-level precedent so learner sees continuity.

### Beat 7 — E2E anti-patterns and assertion review (EXPANDED)
- **Beat:** The review ritual adapted from m3-l2 to E2E. Show a real example of agent output with MULTIPLE problems: (a) a hallucinated assertion (checks page title instead of data persistence), (b) a CSS selector instead of getByRole, (c) a `waitForTimeout(3000)` instead of state-based wait, (d) state coupling (test 2 assumes test 1's side effect). Learner catches all four using the E2E anti-pattern checklist.
- **Question answered:** "How do I know the agent's E2E test actually tests the right thing AND won't break tomorrow?"
- **Introduces:** E2E anti-pattern checklist (5 items: hallucinated assertion, flaky selector, state coupling, hardcoded wait, missing cleanup), assertion-to-risk review question, the difference between "test passes" and "risk is covered AND test is stable"
- **Depends on:** Beat 5 (agent generated tests), Beat 6 (seed test defines what "good" looks like), m3-l2 (review ritual for unit tests — this is the E2E equivalent)
- **Sets up:** Data isolation (Beat 8), vision (Beat 9)
- **Diagram opportunity:** —
- **Risk:** Could moralize. Stay operational: show the bad output, show each anti-pattern, show the fix. Learner should feel the practical cost.

### Beat 8 — Test data isolation (NEW — promoted to core)
- **Beat:** Short focused beat. Agent generates tests that create data (decks, flashcards). Without a cleanup strategy, the next run hits conflicts. Two practical approaches: (a) unique identifiers per run (agent-friendly, works with parallelism), (b) cleanup in afterEach + afterAll as safety net. Teardown project pattern mentioned briefly, detailed in Deep Dive. Supabase RLS note for the course stack.
- **Question answered:** "My E2E tests pass once and fail on the second run. Why?"
- **Introduces:** Test data isolation as a stability requirement, unique identifier pattern, cleanup pattern, brief RLS note
- **Depends on:** Beat 7 (missing cleanup as anti-pattern), Beat 6 (cleanup rule in seed test)
- **Sets up:** Pipeline position (Beat 11)
- **Diagram opportunity:** —
- **Risk:** Could become a Supabase tutorial. Keep it to two patterns + one RLS sentence. Deep Dive handles teardown project.

### Beat 9 — CLI vs MCP: when to use which
- **Beat:** Now that the learner has used CLI, compare with MCP. MCP gives richer real-time control (30+ tools, network mocking, storage management) but costs ~114K tokens. CLI saves to disk (~27K tokens). Decision heuristic + comparison table. No video — text and table are sufficient.
- **Question answered:** "When should I use MCP instead of CLI?"
- **Introduces:** Playwright MCP modes (snapshot + vision via `--caps`), the tradeoff table, decision heuristic
- **Depends on:** Beat 3 (CLI experience), Beat 5 (test generation)
- **Sets up:** Vision mode (Beat 10)
- **Diagram opportunity:** Simple comparison table, not mermaid.
- **Risk:** Could become a product comparison. One table + one heuristic.

### Beat 10 — Vision mode: when DOM falls short + when NOT to use
- **Beat:** Compressed beat covering both vision capability and its limits. Some quality problems are invisible to the accessibility tree: overlapping elements, broken layouts. Playwright's vision mode (`--caps=vision`): screenshot + coordinate interaction + VLM evaluation. Then immediately ground with limits: cost (~$0.01/run), spatial bias, hallucinations, latency. Decision heuristic: DOM default, vision supplement, deterministic tools for pixel-level.
- **Question answered:** "What about quality problems I can't see in the accessibility tree? And should I use vision for everything?"
- **Introduces:** Vision mode configuration, screenshot + VLM evaluation, practical example of visual regression caught by vision, vision limitations, decision heuristic (DOM / vision / deterministic tools)
- **Depends on:** Beat 9 (MCP modes), Beat 7 (some problems escape DOM-based tests)
- **Sets up:** Pipeline position (Beat 11)
- **Diagram opportunity:** Mermaid: DOM test passes → visual check via screenshot → VLM evaluates → caught. Two paths.
- **Risk:** Could oversell vision. Ground immediately with cost/reliability limits in the same beat.

### Beat 11 — E2E in the quality pipeline
- **Beat:** Circle back to M3's arc. E2E tests run at a different cadence than hooks — typically in CI, not per-edit. The healer can run locally to auto-repair broken locators, but when a test fails because of a logic change, auto-healing makes it worse. Brief bridge to m3-l5. No video — one diagram extension + one paragraph.
- **Question answered:** "Where does E2E fit in the quality pipeline I already have?"
- **Introduces:** E2E's position in pipeline (CI-time, not per-edit), healer as local maintenance tool with limits
- **Depends on:** Beats 5-10 (E2E is configured and working), m3-l3 (three-layer model)
- **Sets up:** Bridge to m3-l5
- **Diagram opportunity:** Mermaid extending m3-l3's pipeline: per-edit hooks → pre-commit → E2E in CI → deploy.
- **Risk:** Could re-teach m3-l3's pipeline. One diagram, one paragraph. Adds one layer.

## Failure Mode To Disarm

**"The agent generates tests that pass but don't verify the risk AND won't survive the next refactor."** Two failures in one: (1) hallucinated assertions that don't cover the actual risk (the m3-l2 equivalent: agent mirrors implementation), and (2) brittle test mechanics (CSS selectors, shared state, hardcoded waits, no cleanup) that break on the next run. The lesson disarms both by teaching the seed test + rules as preventive quality levers and the E2E anti-pattern checklist as the review gate.

## Suggested Structure

1. **Intro (no heading)** — The browser gap: hooks catch code problems, not UI problems
   ```
   m3-l3 hooks -> this beat -> accessibility snapshots
   Must not re-teach m3-l1's quality strategy. Start from: "hooks can't see your app in a browser."
   ```

2. **Core content** — Beats 2-11: accessibility snapshots → CLI setup → storageState → risk-to-E2E workflow → seed test & E2E rules → anti-pattern review → data isolation → CLI vs MCP → vision mode + limits → pipeline position
   ```
   intro browser gap -> this content block -> practical tasks
   Major change from v1 spec: Beat 6 (seed test + rules) and Beat 7 (expanded anti-patterns) and Beat 8 (data isolation) are new core content.
   Beat 9 (CLI vs MCP) is text-only, no video.
   Beat 10 (vision) combines capability + limits into one beat.
   ```

3. **Zadania praktyczne** — Wire the full E2E workflow on their 10xcards project
   ```
   core content -> this beat -> badge
   Tasks:
   (1) Write a seed test + add E2E rules to project rules file
   (2) Install Playwright CLI, explore 10xcards via snapshots
   (3) Configure storageState for authenticated flows
   (4) Pick top 2 risks from testing-guide.md and generate E2E scenarios via planner→generator
   (5) Review all generated tests against E2E anti-pattern checklist, fix issues
   (6) Add one vision-based check for a UI element the accessibility tree doesn't cover well
   (7) Set up test data isolation (unique identifiers or cleanup)
   ```

4. **Odbierz swoją odznakę** — Verify the E2E workflow end-to-end
   ```
   tasks -> this beat -> Deep Dive
   Badge requires: seed test with quality patterns, E2E rules in project config, working E2E test driven by risk map, at least one reviewed and corrected anti-pattern, storageState configured, at least one vision-based check, test data isolation in place
   ```

5. **Deep Dive** — Advanced topics: browser.bind() for shared instances, healer in practice, Stagehand as alternative, composable fixtures vs POM, teardown project pattern (Supabase RLS detail)
   ```
   badge -> this beat -> Materialy dodatkowe
   Advanced patterns for learners who want to go deeper. No new required concepts.
   ```

6. **Materialy dodatkowe** — Links to Playwright CLI docs, MCP docs, Test Agents docs, Best Practices, auth docs, VLM visual testing post, Stagehand repo, Currents ecosystem overview, WebTestBench paper
   ```
   Deep Dive -> this beat -> bridge out
   Links only, no new concepts introduced.
   ```

## Video Placeholders

- **V1** — Opening: show m3-l3's hook catching a type error instantly, then show the same project with a visual regression (overlapping elements) that no hook caught. "Your hooks are blind to the browser."
- **V2** — Playwright CLI exploration: live walkthrough — install CLI, open 10xcards, navigate via snapshots, show the YAML snapshot output, use element refs to interact. Contrast with the 2nd edition approach of writing selectors by hand.
- **V3** — Risk-to-E2E pipeline + seed test + review: open testing-guide.md, pick a top risk, show the seed test, run `npx playwright init-agents --loop=claude`, show the planner exploring the app, producing a Markdown plan, generator converting to TypeScript. Review the generated tests — find a hallucinated assertion, a CSS selector, and a waitForTimeout. Fix them. This is the densest video and covers Beats 5-7 in one demo.
- **V4** — Vision supplement: run the DOM-based test (passes), then show a visual regression the test missed. Add a vision-mode check that catches it. Show the screenshot → VLM evaluation → structured result. Then name the limits: cost, latency, when NOT to use.

Cut from v1 spec:
- ~~V5 (CLI vs MCP comparison)~~ — the comparison table in text is sufficient
- ~~V6 (healer bridge to m3-l5)~~ — one paragraph of text + the pipeline diagram is sufficient

## Bridge In

From m3-l3: the lesson ended with the three-layer local quality pipeline (per-edit hooks → pre-commit → pre-push). The explicit bridge was: "lokalne hooki łapią błędy kodu, ale nie regresję wizualną, UX i dostępność. Następna lekcja: przeglądarka i E2E." m3-l4 picks up exactly there — the first lesson where the agent uses a browser.

From m3-l1: testing-guide.md named "multimodal E2E" and "QA-oriented MCP" as strategic quality patterns with explicit deferral to m3-l4 for configuration and operationalization.

From m3-l2: the anti-pattern checklist (mirror, happy-path, missing edges) and review ritual. m3-l4 extends both to the E2E layer with its own anti-pattern set and the seed test as the quality template (parallel to m3-l2's risk-tied-input discipline).

From prework 4.1: Playwright was named in the recommended stack. From prework 3.1/3.3: token budgets and context management were introduced — now applied to the CLI vs MCP decision.

## Bridge Out

To m3-l5: E2E tests create a new class of failures — backend-driven failures that look like UI bugs, flaky tests caused by race conditions, assertion failures where the test is right and the code is wrong. The healer can auto-repair broken locators, but when a test fails because of a logic change or a backend error, auto-healing makes it worse. m3-l5 teaches the debugging workflow: from a failed E2E test's trace to root cause to fix.

## Open Questions

### Schema update proposal

Provisional `owns`, `referencesOnly`, `mustNotCover`, and `learningOutcomes` values are listed in respective sections above. Record to `lessons-schema.json` when approved. Key additions vs v1 spec:

**New owns:**
- Seed test as E2E quality template (distinct from m3-l2's unit-level risk-tied-input discipline)
- E2E testing rules as project rules (distinct from m3-l1's testing-guide.md strategy)
- E2E-specific agent anti-patterns (hallucinated assertions, flaky selectors, state coupling, waitForTimeout, missing cleanup)
- Test data isolation for E2E (core: unique identifiers + cleanup; Deep Dive: teardown project + RLS)

**New learningOutcomes:**
- Writes seed test with quality patterns
- Adds E2E rules to project rules file
- Identifies and fixes E2E-specific anti-patterns (expanded from just hallucinated assertions)
- Sets up test data isolation

### Other open questions

- Whether the video V3 should show all three anti-patterns (hallucinated assertion + CSS selector + waitForTimeout) or focus on just the hallucinated assertion and leave the others to text. Recommendation: show all three — it's the core teaching demo.
- Whether to include a brief "what makes a risk an E2E risk vs a unit risk" heuristic in Beat 5 or assume m3-l1's risk-to-layer table is sufficient. Recommendation: 2-sentence heuristic in Beat 5 ("if the risk crosses multiple boundaries or exists only in rendered UI, it needs E2E").
- Whether `browser.bind()` should appear in Core or Deep Dive. Recommendation: Deep Dive — powerful but not required for core workflow.
- Whether composable fixtures vs POM deserves mention in Core. Recommendation: Deep Dive only — the learner isn't manually writing page objects; the agent uses seed test patterns.

## Side-Effect Ledger

New claims introduced:
- Seed test is the primary quality lever for E2E test generation (parallel to m3-l2's risk-tied-input discipline)
- E2E testing rules as project rules constrain agent output quality
- E2E has 5 specific agent anti-patterns distinct from m3-l2's 3 unit anti-patterns
- Test data isolation (unique identifiers, cleanup) is required for stable E2E suites
- Playwright CLI is the recommended agent-browser interface (~4x more token-efficient than MCP)
- Accessibility-tree-based interaction is the default E2E paradigm for agents
- Playwright Test Agents (planner/generator/healer) are the structured E2E creation workflow
- Vision-based verification supplements DOM-based testing for layout and visual state
- `storageState` is the standard pattern for authenticated agent-driven E2E

Claims removed:
- (none — this is an additive revision)

Neighboring lesson references changed:
- m3-l2's risk-tied-input discipline and anti-pattern checklist are now explicitly bridged as precedents for m3-l4's seed test and E2E anti-pattern checklist
- m3-l1's "multimodal E2E" and "QA-oriented MCP" are operationalized
- m3-l3's pipeline is extended with E2E in CI

Prework references used:
- Prework 3.1/3.3 (token budgets, context management) — grounds CLI vs MCP decision
- Prework 4.1 (recommended stack includes Playwright)
- Prework 3.5 (model tiers) — vision models as one tier
- OFE/19 best practices (selector hierarchy, test independence) — operationalized as agent output constraints

Prework concepts repeated intentionally: (none — concepts are operationalized, not repeated)

Potential duplicates:
- m3-l2 review ritual vs m3-l4 E2E anti-pattern review — boundary clear: same review principle, different anti-pattern set specific to E2E
- m3-l1 risk-to-layer mapping vs m3-l4 "pick E2E risks" — boundary clear: m3-l1 is strategic, m3-l4 operationalizes the E2E slice

Unsupported facts:
- Exact Playwright CLI command syntax may change — verify at draft time
- Token cost numbers (27K vs 114K) are approximate benchmarks from secondary sources
- VLM spatial bias is from one practitioner report — stay directional, not precise
- Healer ~75% success rate attributed to "Microsoft benchmarks" without primary source

Video/text mismatches: (none — spec only)

Needs human decision:
- Which 10xcards risk scenario to use as the primary E2E demo
- Whether to commit to a specific VLM model recommendation or stay model-agnostic
- Whether Deep Dive should include browser.bind() + page.screencast
- Exact rules in the E2E rules template (the 6-8 rules listed in Beat 6 are provisional)
