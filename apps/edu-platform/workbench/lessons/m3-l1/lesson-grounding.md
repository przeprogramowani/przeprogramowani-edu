# Lesson Grounding: m3-l1 — Plan testów z AI: quality gates, testing guide i priorytety

## Scope

- Lesson source: `workbench/lessons/m3-l1/lesson-spec.md` (no draft yet)
- Neighbor boundaries:
  - `m2-l5` (bridge-in: parallel slices, `/10x-status`, no tests yet) — owns archive/parallel agents
  - `m3-l2` (forward: unit tests with agent) — owns Vitest config, unit test authoring
  - `m3-l3` (forward: hooks reacting to errors) — owns hook lifecycle and configuration
  - `m3-l4` (forward: E2E with Playwright + MCP + multimodal scenarios) — owns MCP/Playwright config, multimodal E2E scenarios
  - `m3-l5` (forward: debug → fix → regression test) — owns debug-as-test workflow
- Relevant prework:
  - 3.2 — prompt as contract (basis for testing-guide as rules-file)
  - 3.3 — context engineering Write/Select/Compress/Isolate (basis for keeping the guide in repo)
  - 3.5 — model-check criteria (basis for choosing multimodal models)
  - 4.1 — agent-friendly tech stack (basis for choosing a default test stack)
  - 4.2 — CI/CD as project minimum (basis for quality gates)
  - 1.3 — tutor mode (basis for "edit risk map, don't auto-approve")
- Research posture: **standard, broad on Axis 1 (QA-oriented MCPs/CLI extensions)** — spec explicitly flags that ecosystem moves faster than the rest

## Claims To Support

- `testing-guide.md` as a durable, domain-specific rules-file (analog to AGENTS.md but narrower) — needs evidence that rules-files / AGENTS.md / Cursor rules are the current cross-tool convention.
- Risk-first prioritization (impact × likelihood) before listing test types — needs textbook reference (ISTQB) and applicability to solo dev.
- Classic stack default: **Vitest + Testing Library + MSW + Playwright + axe-core** — needs current versions, agent-friendliness, breaking changes.
- AI-native form (a): **hooks triggering tests after file edits** — needs evidence that current agent CLIs (Claude Code, Cursor, Codex) actually support this in 2026-05-21.
- AI-native form (b): **multimodal E2E (model "looks at" screenshot/video)** — needs evidence the technique works in practice, with realistic limitations.
- AI-native form (c): **QA-oriented MCPs / CLI agent extensions** — needs at least one stable, named MCP server (Playwright MCP) and 2–3 alternatives so the lesson can stay category-level, not tool-level.
- AI-native form (d): **agent-driven exploratory** — needs at least practitioner-signal evidence.
- AI-native form (e): **debug-as-test** — needs Claude Code/practitioner evidence of "fix bug → leave a regression test" as an explicit workflow.
- "AI generates 200 tests on helpers while auth/payments stay unprotected" failure mode — needs practitioner signal that coverage-without-risk-map is a recognized anti-pattern.
- GitIngest / Repomix as brief-from-outside alternative — needs current status and at least one practitioner reference.

## Strong Sources

### microsoft/playwright-mcp (Playwright MCP server)

- URL: https://github.com/microsoft/playwright-mcp
- Type: official-docs / repo
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-21
- Supports:
  - Playwright MCP is a real, actively maintained MCP server (v0.0.70 as of search, 30,900+ GitHub stars, 15+ MCP clients).
  - Uses **structured accessibility snapshots** instead of raw screenshots, which makes it more deterministic for agents than vision-only approaches.
- Use in lesson:
  - Cite as the **canonical example** of a QA-oriented MCP for browser control, with explicit "category, not commitment" framing.
  - Pin in Materiały dodatkowe and as a reference for m3-l4.
- Confidence: high
- Notes:
  - Spec correctly treats Playwright MCP as an example, not "the" MCP — wording should match.

### Playwright 1.59 release (April 2026)

- URL: https://github.com/microsoft/playwright/releases (release notes) + https://playwright.dev/docs/release-notes
- Type: official-docs
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-21
- Supports:
  - `page.screencast` produces annotated video receipts (useful evidence for multimodal review on visual diff).
  - `browser.bind()` lets MCP, CLI, and `@playwright/test` share one browser session — material for "AI-native stack is converging with classic stack."
  - `npx playwright trace` CLI (analyze traces in headless CI without a GUI) — material for agent-friendly debugging in m3-l5 (forward ref).
  - `@playwright/cli` reduces tokens ~4× vs MCP for the same automation — relevant when grounding the AI-native stack choice; the lesson should note that MCP is not always the cheapest path.
- Use in lesson:
  - Use as evidence that the classic stack (Playwright) is itself becoming agent-native, blurring the "classic vs AI-native" line in a healthy way.
- Confidence: high
- Notes:
  - Avoid getting deep into Playwright 1.59 specifics (that is m3-l4 territory). m3-l1 just needs the existence of agent-aware test infrastructure.

### Claude Code hooks documentation

- URL: https://code.claude.com/docs/en/hooks-guide
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-21
- Supports:
  - PostToolUse hooks with the `Edit|Write` matcher are a documented, stable mechanism to run tests/lint immediately after the agent edits a file.
  - Official guidance to keep hooks fast, use `--findRelatedTests`, and end commands with `; exit 0` so a hook failure does not block flow.
- Use in lesson:
  - Cite as the **strategic evidence** that AI-native gate "test on edit" is real today, not a 2027 promise.
  - Lesson does not show configuration (that belongs to m3-l3) but can confidently say "this is implemented and used."
- Confidence: high
- Notes:
  - Cursor and Codex have their own equivalents; the testing-guide should describe the category ("post-edit test trigger") and let the project map it to its current agent.

### ISTQB risk-based testing (foundation material)

- URL: https://glossary.istqb.org/en_US/term/risk-based-testing
- Type: official-docs (industry-standard glossary)
- Author/publisher: ISTQB
- Checked: 2026-05-21
- Supports:
  - Risk-based testing is an established discipline, not an AI-era invention; impact × likelihood and "highest risk first" are core.
  - Directly relevant to solo developers: it is a triage method when you cannot test everything.
- Use in lesson:
  - Anchor the "risk-first" beat in something older than the AI cycle, so the lesson does not read like AI hype.
  - Use as one entry in Materiały dodatkowe ("classic discipline; we just operationalize it with an agent").
- Confidence: high
- Notes:
  - Do not turn the lesson into an ISTQB summary. The point is that the discipline is old; the agent-driven workflow that produces a risk map from PRD+roadmap+archive is new.

### Anthropic — Introducing the Model Context Protocol

- URL: https://www.anthropic.com/news/model-context-protocol
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-21
- Supports:
  - MCP is now an open standard supported across Anthropic, OpenAI, Google, Microsoft, AWS (per public coverage in 2026).
  - Justifies treating "QA-oriented MCP" as a stable category, even if specific servers move fast.
- Use in lesson:
  - One link in Materiały dodatkowe so the learner can verify MCP itself is not a fad.
- Confidence: high
- Notes:
  - Lesson should not teach MCP itself (covered earlier in the program). It only needs to anchor the category.

### Stagehand v3 / Browserbase

- URL: https://github.com/browserbase/stagehand + https://www.browserbase.com/stagehand
- Type: repo / technical-post
- Author/publisher: Browserbase
- Checked: 2026-05-21
- Supports:
  - Stagehand v3 dropped Playwright underneath and went straight to CDP, ~44% faster on shadow DOM / iframe interactions.
  - Stagehand exposes `act / extract / observe / agent` primitives — alternative AI-native automation stack to Playwright MCP.
  - DOM-driven agents (Playwright+Claude, Stagehand, Browserbase) outperform vision-driven (Anthropic Computer Use, OpenAI CUA) by 12–17 pp on common tasks (community benchmark, not paper).
- Use in lesson:
  - Use as evidence for the **second concrete example** of an AI-native browser-control option, so Playwright MCP is not the only named tool.
  - Implicit strategic insight: "vision-driven is more flexible, DOM-driven is more reliable" — fits naturally into the "when NOT to use" column for multimodal E2E.
- Confidence: medium-high
- Notes:
  - Benchmark numbers are a moving target. Quote the direction ("DOM-driven currently more reliable on common tasks"), not the percentage, in lesson prose.

### Vitest 4.1 release (March 2026)

- URL: https://vitest.dev/blog/vitest-4-1.html (release post) + https://github.com/vitest-dev/vitest/releases
- Type: official-docs
- Author/publisher: Vitest team / VoidZero
- Checked: 2026-05-21
- Supports:
  - Vitest is on 4.1 — `Run Related Tests` command (relevant for hook-after-edit), GitHub Actions reporter, Deno runtime support.
  - Vitest remains the agent-friendly default for JS/TS in 2026.
- Use in lesson:
  - Cite as default for the "classic base" layer of the recommended stack.
  - "Run Related Tests" is also a clean way to justify the post-edit hook trigger story without needing custom scripts.
- Confidence: high

### MSW (Mock Service Worker) 2.0

- URL: https://mswjs.io/ + https://github.com/mswjs/msw
- Type: official-docs
- Author/publisher: MSW team
- Checked: 2026-05-21
- Supports:
  - MSW 2.0 with native fetch and URL Pattern API for handler matching is the current stable line; reusable across Jest, Storybook, browser.
- Use in lesson:
  - Default network-mock layer for the classic stack; no risk of obsolescence in 2026.
- Confidence: high

### axe-core / @axe-core/cli

- URL: https://github.com/dequelabs/axe-core + https://www.npmjs.com/package/@axe-core/cli
- Type: official-docs
- Author/publisher: Deque
- Checked: 2026-05-21
- Supports:
  - axe-core is the current accessibility engine; `@axe-core/cli` 4.x is current.
  - The accessibility tree axe inspects is the same tree Playwright MCP and other agent tools use — accessibility testing and AI agent testing share infrastructure.
- Use in lesson:
  - Default a11y layer; also a chance to point out that accessibility hygiene is now a load-bearing input to agent reliability — not just a compliance checkbox.
- Confidence: high

### Repomix

- URL: https://repomix.com/ + https://github.com/yamadashy/repomix
- Type: official-docs / repo
- Author/publisher: Yamada Shy
- Checked: 2026-05-21
- Supports:
  - Repomix packs a repo into Markdown/XML/JSON/plain text for LLM consumption; has built-in security check, token counting, MCP server integration.
  - Active, well-documented, well-known in the JS/TS ecosystem.
- Use in lesson:
  - Primary "brief-from-outside" tool in the Deep Dive; lighter mention of GitIngest as alternative.
- Confidence: high

### GitIngest

- URL: https://gitingest.com/ (referenced via openreplay overview)
- Type: technical-post / community tool
- Author/publisher: GitIngest authors
- Checked: 2026-05-21
- Supports:
  - "Replace `github` with `gitingest` in any URL" zero-setup brief tool — still alive in 2026; works well for public repos; supports private with PAT.
- Use in lesson:
  - Mention once in Deep Dive as the lightest-weight alternative to Repomix; do not equate the two.
- Confidence: medium
- Notes:
  - Project is single-purpose and skinny; mention but do not anchor on it. Repomix is the safer recommendation.

### AGENTS.md / cross-tool agent rules convention (2026)

- URL: https://www.augmentcode.com/guides/how-to-build-agents-md + https://cursor.com/docs/rules
- Type: technical-post + official-docs
- Author/publisher: Augment Code / Cursor
- Checked: 2026-05-21
- Supports:
  - AGENTS.md has become a cross-tool convention readable by multiple agents.
  - Cursor rules use globbed `.mdc` files; pattern of "rules-file with scope" is now standard.
- Use in lesson:
  - Justifies `testing-guide.md` as a real, current category — not a workbench invention.
  - Supports the m1-l4 → m3-l1 link: rules hierarchy exists; we are adding a domain-specific entry.
- Confidence: high

## Practitioner Signals

### HackerNoon — "Your AI-Generated Code Tests Might Be Lying to You"

- URL: https://hackernoon.com/your-ai-generated-code-tests-might-be-lying-to-you
- Type: technical-post / practitioner-signal
- Signal:
  - High coverage from AI-generated tests does not imply correctness; mutation testing can expose blind spots.
  - When an AI updates implementation and then updates hundreds of tests to match, the question shifts from "is the code correct" to "did the tests just track the regression."
- Useful language:
  - "Tests that lie" / "false coverage" / "tests tracking behavior, not validating it."
- Risk:
  - HackerNoon is a low-bar publisher; do not use as proof of a numeric claim. Use only for naming the pain.
- Confidence: medium

### O'Reilly Radar — "Comprehension Debt: The Hidden Cost of AI-Generated Code"

- URL: https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/
- Type: technical-post / practitioner-signal
- Signal:
  - "Comprehension debt" — the gap between code an AI produced and what a human can verify and maintain — is the real bottleneck.
  - Translates 1:1 to tests: 200 AI-generated tests can mask the fact that the human reviewer cannot tell which tests are load-bearing.
- Useful language:
  - "Comprehension debt," "verification at scale."
- Risk:
  - Useful framing, not numeric evidence.
- Confidence: medium-high

### Playwright Test Agents (Planner / Generator / Healer) — practitioner posts

- URL: https://testdino.com/blog/playwright-test-agents + https://www.testmuai.com/blog/playwright-agents/
- Type: technical-post / practitioner-signal
- Signal:
  - The "test agent" pattern (planner → generator → healer) is the de-facto 2026 shape for AI-assisted E2E.
  - Useful as a strategic mental model for the AI-native gates section: agent plans, agent writes, agent maintains.
- Useful language:
  - "Self-healing tests," "agent-as-debugger," "test agents."
- Risk:
  - Vendor-adjacent posts. Use for naming the shape, not as evidence that any specific product is the best.
- Confidence: medium

### Multimodal UI evaluation (Ionio + arXiv 2604.25420 + bentoml VLM guide)

- URLs:
  - https://www.ionio.ai/blog/how-we-automate-ui-testing-with-multimodal-llms-llama-3-2-and-gemini-api
  - https://arxiv.org/html/2604.25420 ("Recommending Usability Improvements with Multimodal LLMs")
  - https://www.bentoml.com/blog/multimodal-ai-a-guide-to-open-source-vision-language-models
- Type: technical-post / paper / practitioner-signal
- Signal:
  - LLM visual evaluation aligns with expert assessment often enough to be a useful supplement, not a replacement.
  - Guiding the model with both visual cues (bounding boxes) and text increases evaluation accuracy meaningfully.
  - GPT-4o, Claude 3 Sonnet, Gemini 2.5 are the common 2026 reference points; choice depends on cost, vision tokens, and policy on screenshot data.
- Useful language:
  - "Multimodal as supplement, not oracle," "vision tokens are expensive," "false-positive rate on layout drift."
- Risk:
  - Easy to overclaim. Lesson must keep "kiedy NIE używać" tight: cost iteration, false positives, flaky vision output.
- Confidence: medium-high (for the qualitative direction); low for any specific tool ranking

### Anthropic Computer Use + OpenAI CUA — vision-driven fallback (with cheaper-model angle)

- URLs:
  - https://workos.com/blog/anthropics-computer-use-versus-openais-computer-using-agent-cua
  - https://makerstack.co/reviews/anthropic-api-review/
- Type: technical-post / practitioner-signal
- Signal:
  - Anthropic Computer Use treats the whole OS as the canvas; OpenAI CUA is browser-only in a cloud sandbox.
  - Both moved toward production in 2026, but remain slower and more expensive per action than DOM-driven (Playwright MCP, Stagehand).
  - Useful where DOM-driven approaches cannot reach: canvas-only UIs, image-driven UIs, anti-bot screens, native desktop flows.
  - **Cheaper-model angle worth covering in the lesson:** pair vision-driven runs with the smaller vision models in the Haiku / GPT-4o-mini / Gemini Flash tier rather than the top-end models. Cost per action drops meaningfully; reliability drops less than naïve intuition suggests for the well-bounded UI flows you'd ever use vision for in the first place (login → critical-screen render → confirmation). The pattern: top-tier model authors the test plan, cheaper vision model executes the rerun.
- Useful language:
  - "Vision-driven fallback," "DOM-unreachable surfaces," "expensive per action," "author with the big model, rerun with the small one."
- Risk:
  - Easy to over-recommend because the demo videos look magical. Lesson must keep this as fallback, not default — and explicitly call out the cost/latency tradeoff. The cheaper-model angle is a "make it workable" footnote, not a green light to default to vision-driven.
- Confidence: medium-high (for the qualitative direction); low for any specific cost figure

### Visual regression in 2026 — Argos / Lost Pixel / Chromatic

- URLs: https://argos-ci.com/ + https://www.lost-pixel.com/ + https://percy.io/blog/screenshot-testing-tools
- Type: technical-post / official-docs
- Signal:
  - Mature visual-diff space already exists with pixel/odiff-based tools (Argos, Lost Pixel) and AI-enhanced tools (Percy).
  - Argos explicitly **does not** use AI for diffing — practitioner counter-evidence against "multimodal beats everything."
- Useful language:
  - "Deterministic diff vs model-judged diff" — useful contrast for the AI-native section.
- Risk:
  - Lesson should not make it sound like multimodal is the only option for visual regression. The existence of mature deterministic tooling is itself a "when NOT to use" signal.
- Confidence: high

### Claude Code debug → regression test workflow (community)

- URL: https://dev.to/nextools/claude-code-debugging-workflow-how-i-diagnose-and-fix-production-issues-3x-faster-2l11 + https://developertoolkit.ai/en/claude-code/productivity-patterns/debugging-workflows/
- Type: technical-post / practitioner-signal
- Signal:
  - "Fix bug → leave a regression test" is an explicit, named workflow practitioners apply with Claude Code today.
  - Supports m3-l5 forward reference: the workflow exists; m3-l1 only needs to point at it.
- Useful language:
  - "Lock the fix in with a test," "test as bug receipt."
- Risk:
  - Individual blog posts, not benchmarked. Use only to confirm that the workflow has practitioner mass.
- Confidence: medium-high

## Examples Worth Using

- **Risk map demo on the 10xcards (flashcards) scenario** — agent reads the learner's `prd.md`, `tech-stack.md`, `roadmap.md`, `context/archive/`, produces a top-5–7 risk list with impact × likelihood for a flashcards-with-AI app (auth, spaced-repetition correctness, AI-generation quality, payments if present, lesson share links); learner edits 2–3 priorities live. The 10xcards scenario is the running example through the whole lesson — keeps it concrete and matches the prework universe.
- **AI-native section template row** — each pattern in the testing-guide carries four fields: `risk it covers`, `M3 lesson that implements it`, `when NOT to use`, `example tool/MCP/CLI extension + freshness note`. Concrete enough to draft against; tool-agnostic enough not to age out.
- **"AI updated 217 tests when I changed one helper"** — concrete failure scenario worth narrating, sourced from O'Reilly comprehension-debt + HackerNoon "tests that lie."
- **Post-edit hook narrative** — agent saves `auth.ts`, PostToolUse hook runs `vitest --findRelatedTests auth.ts`, fails, agent self-corrects. Pure 2026 mechanic, sourceable to the Claude Code hooks doc.
- **Stack-mix narrative** — Vitest + Testing Library + MSW for unit/integration, Playwright (+ optional Playwright MCP) for E2E, axe-core for a11y, optional multimodal pass on critical screens. Five-tool stack the learner can name and defend.
- **Brief-from-outside scenario** — Repomix packs the repo, learner pastes brief into Claude.ai or AI Studio, gets a second-opinion testing-guide; learner compares and reconciles. Useful for the Deep Dive without dragging the lesson into a benchmark.

## Claims To Avoid Or Soften

- **"Playwright MCP is *the* MCP for QA."** Soften to "the most prominent current example; verify alternatives like Stagehand, Browserbase, and any newer 2026 entrant before committing."
- **"Multimodal models replace expert UI review."** Avoid. Frame as supplement; cite the limit explicitly.
- **"AI-generated tests improve coverage X%."** Avoid any numeric productivity claim — the existing 2026 literature is fragmented and easy to overclaim.
- **"Visual diff must use a multimodal model."** Avoid. Argos / Lost Pixel deliberately do not, and they are dominant in production today.
- **"DOM-driven beats vision-driven by 12–17 pp."** Soften to qualitative direction; the benchmark is a moving target.
- **"Hooks reliably catch every regression."** Soften to "they catch immediate breakage at edit time; they do not replace CI gates."
- **"@playwright/cli replaces MCP."** Avoid. The two coexist; CLI is cheaper, MCP is more conversational. Lesson should note both exist.
- **"Cursor / Codex / Copilot all support hooks the same way as Claude Code."** Avoid. State only what is documented for Claude Code; describe the category and let the learner map to their tool.

## Open Verification Questions

- Does any 2026-current MCP server explicitly target **visual regression / screenshot review** as a primary workload (beyond Playwright MCP exposing screenshots as a side effect)? Worth a targeted check before draft, since it would let m3-l1 name a second QA-oriented MCP cleanly.
- What is the **current price/token cost** of a single Claude / GPT-4o vision call on a typical UI screenshot in 2026-05? Lesson does not need the number, but the drafter should verify the order of magnitude before claiming "multimodal pass on critical screens is affordable."
- Are there **stable** "lint-as-agent" or "test-as-agent" CLI extensions in the Claude Code / Cursor / Codex ecosystems in 2026-05 that go beyond plain hooks? Spec mentions them; if none are clearly current, the lesson should describe the *category* and skip naming.
- ~~Is **Anthropic Computer Use** (or OpenAI CUA) production-stable enough to mention as a fallback for canvas-only / image-only UIs?~~ **Decided 2026-05-21: yes, include as vision-driven fallback with explicit "expensive, slower, last resort" framing.** See WorkOS comparison source in Practitioner Signals.
- Does the **`/10x-toolkit`** ship any skill that already produces a testing-guide (e.g., `/10x-testing-guide` or similar)? If yes, that skill is the canonical learner-facing entry point and the lesson voice should align. (Spec assumes generic agent prompting; toolkit may already have a named skill.) **Needs human check on the toolkit course content.**

## Schema Source Update

Updated the `m3-l1` entry in `workbench/lessons-schema.json` with:

- `groundingSources`: 12 sources covering the four research axes from the spec — official docs for Playwright/Playwright MCP/Claude Code hooks/Vitest/MSW/axe-core/Repomix/MCP itself; ISTQB foundation for risk-based testing; Stagehand as second AI-native browser-control example; AGENTS.md/Cursor rules convention; multimodal UI eval practitioner/paper triad; visual regression deterministic baseline (Argos / Lost Pixel / Percy).
- `sideEffectLedger.unsupportedFacts`: claims the grounding still flagged as needing care (specific token-cost claims for multimodal calls, "lint-as-agent" CLI extensions, hooks parity across non-Claude agents, any benchmark percentages).
- `sideEffectLedger.needsHumanDecision`: whether the `/10x-toolkit` already exposes a `/10x-testing-guide`-style skill that should be the canonical learner entry point; if yes, the draft needs to align to that skill instead of generic agent prompting.

Other `m3-l1` fields (`owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders`) remain untouched here — those belong to the spec-acceptance step the user/owner controls. Grounding pass only writes source metadata + side-effect ledger entries.
