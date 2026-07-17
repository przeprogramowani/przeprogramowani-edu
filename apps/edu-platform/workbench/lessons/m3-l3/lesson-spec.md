# Lesson Spec: m3-l3 — Hooki i triggery: Agent, który sam reaguje na błędy

## Schema Context

- Course: 10xdevs-3
- Module: M3 — AI Development Quality & Maintenance
- Position: 3/5 (global 13)
- Depends on: m3-l2 (Od planu do testów: implementacja unitów z Agentem)
- Prepares for: m3-l4 (Testy E2E: Playwright, MCP i multimodalne scenariusze)

## Prework Continuity

- Relevant prework lessons: 2.4 (Agent-Native IDE — safety discipline), 1.3 (Jak uczyć się z AI — tutor mode), 2.2/2.3 (Cursor/Claude Code basics)
- Assumed from prework: Learner knows what AGENTS.md/CLAUDE.md are, has operational basics of at least one AI coding tool, understands "clean repo, tests, review, diffs" as safety practice
- Deepened here: Safety discipline moves from manual checklist to automated enforcement. The "tutor" model from prework 1.3 becomes a hook that tutors the agent itself — catching errors before the developer notices.
- Avoid repeating: Tool setup basics, rules-file hierarchy explanation, what CI/CD is

## Lesson Job

m3-l2 left the learner running tests by hand after agent edits. m3-l1 named "post-edit hooks" as a strategic quality gate in testing-guide.md but explicitly deferred configuration to m3-l3. This lesson closes that gap: it teaches the learner to wire automated quality checks that fire during the agent's edit loop, at commit time, and before push — a three-layer local pipeline that catches problems in seconds instead of minutes. The lesson must stay operational (how to configure, what to check, how to scope) and must not drift into debugging strategy (m3-l5) or E2E testing (m3-l4).

## Thesis

Hooks turn the agent's edit loop into a self-checking pipeline that catches problems in seconds — before code leaves your machine and long before CI reports back.

## Learning Outcomes

- Learner configures PostToolUse hooks (Claude Code) for auto-lint and typecheck after file edits, and verifies the agent receives and reacts to the feedback via context injection.
- Learner wires a scoped test trigger that runs only tests related to edited files, using testing-guide.md risk areas to decide what qualifies as a triggered check.
- Learner explains the three-layer local quality model (per-edit agent hooks → pre-commit git hooks → pre-push heavier checks) and states which check belongs at which layer.
- Learner sets up a git pre-commit gate (e.g., Lefthook or existing Husky+lint-staged) with staged-file scoping for lint, typecheck, and tests.
- Learner translates a Claude Code hook config to at least one other tool (Cursor, Codex, or Copilot) using the cross-tool mental model, demonstrating that the hook lifecycle is transferable.

## Audience Starting Point

The learner has written tests with the agent (m3-l2) and has a testing-guide.md with quality gates (m3-l1). They run tests manually and rely on CI for feedback. They may have used Husky/lint-staged before but likely haven't seen agent-native hooks. They don't know that every major AI coding tool now supports hooks with a shared architecture. They may assume CI is the only automated quality gate.

## Behavioral Change

After this lesson, the learner's agent sessions include automated quality checks that fire on every edit — they stop tolerating manual lint/test cycles and expect their tooling to self-check.

## Owned Concepts

- Three-layer local quality pipeline: per-edit agent hooks → pre-commit git hooks → pre-push checks as complementary gates with distinct trigger cadences
- PostToolUse hook configuration for lint, typecheck, and scoped test triggers — practical wiring, not strategic framing (that's m3-l1)
- Scope-aware check matching: per-file matching via `tool_input.file_path`, glob-based filters, and practical patterns for targeting checks to change scope
- Hook lifecycle as transferable mental model: trigger → match → check → signal, with Claude Code as primary deep example and cross-tool transfer table
- Context injection as the feedback mechanism: hook stdout → agent sees lint/type errors → agent self-corrects trivial issues in its existing edit loop
- Git pre-commit layer as a complementary commit-time gate (staged-file scoping, lint + typecheck + test on commit). Lefthook recommended as agent-friendly option, but the concept is tool-agnostic.
- Testing-guide.md quality gates as the source of what checks to wire — hooks operationalize gates declared in m3-l1
- Hook performance awareness: fast hooks for per-edit (lint/format), heavier checks at commit/push time, and the cost of slow hooks blocking the agent loop. Provide a generalizable heuristic: "if a check takes longer than a few seconds, move it to commit or push time."

## References Only

- testing-guide.md as strategy + risk source (m3-l1)
- AI-native testing patterns at strategic level including post-edit hooks (m3-l1 — strategic framing only)
- Unit test authoring with agent (m3-l2 — hooks trigger tests that m3-l2 taught to write)
- `/10x-plan` workflow and implementation cycle (m2)
- E2E Playwright + MCP browser automation (m3-l4)
- Debug-as-test workflow and stack trace diagnosis (m3-l5)
- Rules-file hierarchy: AGENTS.md/CLAUDE.md (m1-l4)
- Parallel agent sessions and worktrees (m2-l5)
- Prework safety discipline: clean repo, tests, review, diffs (prework 2.4)
- Prework tutor mode as model for hook feedback (prework 1.3)

## Must Not Cover

- testing-guide.md creation or risk prioritization (m3-l1)
- Unit/integration test authoring, Vitest config, Testing Library, MSW (m3-l2)
- E2E tests, Playwright config, MCP browser automation, multimodal scenarios (m3-l4)
- Debug strategy from stack trace to fix, complex failure diagnosis (m3-l5)
- Code review methodology and triage (m2-l3)
- CI/CD pipeline creation, GitHub Actions YAML, deployment config (m1-l5, m2-l5)
- AGENTS.md/CLAUDE.md authoring from scratch (m1-l4)
- Husky deep configuration or migration (reference Lefthook as the recommended path)
- Cursor/Windsurf/Codex full setup tutorial (map the transfer pattern, don't teach each tool's setup)

## Required Example Or Demo

**Narrative project:** 10xcards (learner's running project from M2/M3). Wire hooks incrementally: start with a PostToolUse lint hook, add typecheck, add a scoped test trigger matching testing-guide.md risk areas. Show the before/after: manual check cycle vs. hooks catching the same error in seconds.

**Content preparation ground:** edu-platform used internally to test hook configurations on a larger codebase before recording. Not demoed in the lesson — the course hasn't introduced it yet.

**Comparison moment:** Same agent task (e.g., editing an auth-related file in 10xcards) run twice — once without hooks (error caught minutes later or in CI), once with hooks (caught immediately, agent self-corrects).

## Structural Logic Map

### Beat 1 — Opening: the manual feedback tax
- **Beat:** Learner recalls m3-l2's ending — tests work, but they ran them by hand. The lesson opens with the time cost: how much of a session is spent on manual lint/test cycles?
- **Question answered:** "I have tests now — isn't that enough?"
- **Introduces:** The local feedback gap as a time and quality cost (not monetary)
- **Depends on:** m3-l2 (tests exist, were run manually)
- **Sets up:** The hook as the solution to the feedback gap
- **Diagram opportunity:** —
- **Risk:** Could repeat m3-l1's "why quality matters" framing. Stay operational: "you have the tools, now automate them."

### Beat 2 — The hook lifecycle: a transferable mental model
- **Beat:** Introduce the universal pattern: trigger → match → check → signal. Every major AI coding tool supports this. Claude Code, Cursor, Codex, Windsurf, Copilot — all converged on nearly identical architecture.
- **Question answered:** "What is a hook and does my tool support it?"
- **Introduces:** Hook lifecycle as a four-step pattern; the convergence claim
- **Depends on:** Beat 1 (the problem hooks solve)
- **Sets up:** Claude Code deep dive as the primary example
- **Diagram opportunity:** Mermaid flowchart: trigger (PostToolUse) → matcher (Write|Edit) → handler (lint command) → signal (exit code + stdout → agent context). Show the data flow including JSON stdin/stdout.
- **Risk:** Could become abstract. Ground immediately with: "here's what it looks like in Claude Code."

### Beat 3 — First hook: auto-lint on every edit
- **Beat:** Practical configuration: PostToolUse matched on Write|Edit, running a formatter on the edited file. Show the JSON config, explain the matcher, show what the agent sees.
- **Question answered:** "How do I wire my first hook?"
- **Introduces:** PostToolUse event, matcher syntax, `tool_input.file_path` extraction, exit codes (0 = ok, 2 = blocking)
- **Depends on:** Beat 2 (lifecycle model)
- **Sets up:** Typecheck hook (Beat 4), the pattern of layering checks
- **Diagram opportunity:** —
- **Risk:** Could stay at "hello world" level. Show a real formatter (Prettier or ESLint --fix) on a real file from 10xcards.

### Beat 4 — Typecheck hook and the speed question
- **Beat:** Add a second hook: typecheck after edit. But typecheck is slower than lint. Introduce the performance awareness: hooks block the agent loop. Fast hooks (<100ms) fire per-edit; slow hooks belong at commit or push time.
- **Question answered:** "What else can I check, and how fast does it need to be?"
- **Introduces:** Performance tuning, the tradeoff between check thoroughness and agent speed, timeout configuration
- **Depends on:** Beat 3 (first hook wired)
- **Sets up:** Scoped test triggers (Beat 5), the three-layer model (Beat 7)
- **Diagram opportunity:** —
- **Risk:** Could become a benchmarking exercise. Keep it to: "lint = per-edit, typecheck = per-edit or commit-time depending on project size, full tests = commit/push time."

### Beat 5 — Scoped test triggers: match checks to changes
- **Beat:** The most valuable hook: running only related tests after an edit, not the whole suite. Use testing-guide.md risk areas to decide what files warrant test triggers. Show per-file matching and practical patterns.
- **Question answered:** "How do I run the right tests for what just changed?"
- **Introduces:** Scoped test triggering as a universal pattern (most test runners support "run tests related to file X"), mapping testing-guide.md risk areas to hook matchers. Use one concrete example (e.g., `vitest related <path> --run`) but frame as transferable — the concept is "run related tests for the edited file", not a Vitest tutorial.
- **Depends on:** Beat 4 (layering checks), m3-l1 (testing-guide.md exists), m3-l2 (tests exist)
- **Sets up:** Context injection (Beat 6)
- **Diagram opportunity:** Mermaid flowchart showing the decision: file edited → match against risk areas from testing-guide.md → run related tests OR skip (low-risk utility file). Two paths with different outcomes.
- **Risk:** No tool natively tracks all changed files across a turn. Be honest: per-file matching works, cross-turn aggregation is a workaround.

### Beat 6 — Context injection: the agent sees and reacts
- **Beat:** The key differentiator of agent hooks vs. git hooks: PostToolUse can inject feedback into the agent's context. When lint/tests fail, the agent sees the error and can self-correct trivially. Show `additionalContext` / exit code 2 and the agent's reaction.
- **Question answered:** "What happens when a hook catches an error — does the agent know?"
- **Introduces:** Context injection (stdout → agent context), exit code 2 as blocking signal, the boundary: trivial self-correction (lint fix) vs. diagnosis (m3-l5 territory)
- **Depends on:** Beat 5 (hooks are firing, something fails)
- **Sets up:** The three-layer model (Beat 7) — this layer can inject feedback; git hooks can't
- **Diagram opportunity:** —
- **Risk:** Could drift into "the agent debugs and fixes complex failures." Draw the line clearly: hooks surface, agent retries trivially, complex failures go to m3-l5.

### Beat 7 — The three-layer model
- **Beat:** Zoom out: per-edit agent hooks are one layer. Pre-commit (Lefthook/lint-staged) catches what you missed during edits. Pre-push runs heavier checks. CI is the final gate. Each layer has a different cadence, cost, and catch radius.
- **Question answered:** "Where do hooks fit in the bigger picture of quality gates?"
- **Introduces:** Three-layer local pipeline + CI as the full model. Agent hooks catch per-edit; git hooks catch at commit; pre-push catches before push; CI catches everything.
- **Depends on:** Beats 3-6 (per-edit hooks understood)
- **Sets up:** Lefthook setup (Beat 8)
- **Diagram opportunity:** Mermaid diagram showing the four layers as a pipeline: per-edit (agent hooks, ms) → pre-commit (Lefthook, seconds) → pre-push (typecheck + tests, seconds-minutes) → CI (full suite, minutes). Show what each layer catches and its feedback speed.
- **Risk:** Could become a theory slide. Keep it grounded: "here's what each layer catches that the previous one misses."

### Beat 8 — The commit-time gate (git hooks layer)
- **Beat:** The pre-commit layer catches what slipped past per-edit hooks and what manual edits introduced. Teach the universal pattern: "run lint, typecheck, and tests on staged files before commit." Show one concrete tool (Lefthook recommended for agent-friendliness: single config file, staged-file scoping), but frame the concept as transferable — Husky+lint-staged, pre-commit (Python), or any git hook manager does the same job.
- **Question answered:** "How do I set up the pre-commit layer?"
- **Introduces:** Git pre-commit hooks as a complementary layer, staged-file scoping as the universal mechanism. One concrete config example, not a tool tutorial.
- **Depends on:** Beat 7 (three-layer model)
- **Sets up:** Cross-tool transfer (Beat 9)
- **Diagram opportunity:** —
- **Risk:** Could become a Lefthook tutorial. Keep it to: one config example, then move on. The lesson teaches the layer, not the tool.

### Beat 9 — Cross-tool transfer: the pattern works everywhere
- **Beat:** Show the cross-tool comparison table: Claude Code (~30 events, 5 handler types) → Cursor (~18 events, afterFileEdit) → Codex (10 events, command only) → Windsurf (12 events, no context injection) → Copilot (~13 events, public preview). The pattern is the same; the depth varies.
- **Question answered:** "Does this work in my tool?"
- **Introduces:** Cross-tool transfer table, key differences (context injection support, handler types), the convergence claim
- **Depends on:** Beats 3-6 (Claude Code hooks understood in depth)
- **Sets up:** Practical tasks
- **Diagram opportunity:** —
- **Risk:** Could become a product review. Keep the table tight: 5 rows, 4-5 columns. The point is transferability, not ranking.

### Beat 10 — Connecting hooks to testing-guide.md
- **Beat:** Circle back to m3-l1: the quality gates in testing-guide.md are the source for what hooks check. Required gates become per-edit hooks. Recommended gates become pre-commit. Optional gates stay in CI. The hook pipeline operationalizes the strategy.
- **Question answered:** "How do I decide what to hook?"
- **Introduces:** testing-guide.md gates → hook layer mapping as a decision framework
- **Depends on:** Beat 7 (three-layer model), m3-l1 (testing-guide.md exists with gates)
- **Sets up:** Bridge to m3-l4
- **Diagram opportunity:** —
- **Risk:** Could re-teach testing-guide.md. One paragraph: "your guide already has the gates; hooks are where they run."

## Failure Mode To Disarm

**"Hook everything, always"** — The learner wires a full test suite as a PostToolUse hook and wonders why the agent is painfully slow. The lesson must teach that hooks have a speed budget: lint is per-edit, typecheck is per-edit or commit-time, full tests are commit/push time. The three-layer model exists because not everything should run on every edit.

## Suggested Structure

1. **Intro (no heading)** — The feedback gap after m3-l2's manual test runs
   ```
   m3-l2 manual tests -> this beat -> the hook lifecycle
   This section must not re-teach why quality matters (m3-l1). Start from: "you have tests, now automate them."
   ```

2. **Core content (no heading)** — Beats 2-10: lifecycle model → first hook → typecheck → scoped tests → context injection → three-layer model → Lefthook → cross-tool → testing-guide.md mapping
   ```
   intro feedback gap -> this beat -> practical tasks
   This section must not introduce debugging strategy (m3-l5) or E2E testing (m3-l4). Self-correction boundary: trivial auto-fixes only.
   ```

3. **Zadania praktyczne** — Wire the full pipeline on their 10xcards project
   ```
   core content -> this beat -> badge
   Tasks: (1) configure PostToolUse lint+typecheck hook, (2) add scoped test trigger for highest-risk area from testing-guide.md, (3) set up Lefthook with staged-file lint + typecheck + test, (4) translate one hook config to a second tool
   ```

4. **Odbierz swoją odznakę** — Verify the pipeline works end-to-end
   ```
   tasks -> this beat -> Deep Dive
   Badge requires: working per-edit hook, working pre-commit gate, agent demonstrably reacts to hook feedback
   ```

5. **Deep Dive** — Hook performance, advanced patterns, and what's missing across tools
   ```
   badge -> this beat -> Materiały dodatkowe
   Advanced: async hooks, hook result caching workaround, aggregated changed-file patterns, the "missing everywhere" gaps
   ```

6. **Materiały dodatkowe** — Links to official hook docs for all tools, Lefthook repo, research on hooks architecture convergence
   ```
   Deep Dive -> this beat -> bridge out
   Links only, no new concepts introduced
   ```

## Video Placeholders

- V1 — Opening: show m3-l2's ending (manual test run), then the same task with a PostToolUse hook catching the error instantly. The contrast sets up the lesson thesis.
- V2 — First hook setup: live configuration of PostToolUse lint hook in Claude Code on 10xcards project. JSON config → agent edit → hook fires → formatter runs → agent sees feedback.
- V3 — Scoped test trigger: wire a test hook that targets high-risk files from testing-guide.md. Show what happens when the agent edits a risk-area file (tests run) vs. a utility file (tests skip).
- V4 — Context injection: show the agent's conversation with injected hook feedback. The agent sees a type error from the hook and self-corrects on the next iteration. Draw the boundary: "this is trivial self-correction, not debugging."
- V5 — Three-layer model in practice: show the full pipeline on 10xcards — PostToolUse hooks firing per-edit, pre-commit gate catching staged-file issues, and the complete local quality loop. Focus on the learner's own project, not a separate production repo.
- V6 — Bridge to m3-l4: local hooks catch code errors; but what about visual regressions, broken user flows, accessibility? Those need E2E and browser automation — next lesson.

## Bridge In

From m3-l2: the lesson ended with manual test runs and an explicit bridge — "ręczne uruchomienie testów dzisiaj i zapowiedź hooka po edycji w następnej lekcji." m3-l3 picks up exactly where that bridge pointed. The learner has tests (m3-l2) and a testing strategy with quality gates (m3-l1). What's missing is automation of those checks during the agent's edit loop.

From prework 2.4: safety discipline was taught as a manual practice (clean repo, tests, review, diffs). This lesson automates that discipline — the tooling enforces the rules the learner already agreed to follow.

## Bridge Out

To m3-l4: hooks catch code-level problems (lint, types, unit/integration tests). They don't catch visual regressions, broken user flows, or accessibility failures. Those require a browser. m3-l4 introduces Playwright, MCP browser automation, and multimodal E2E scenarios — the next layer of quality that operates beyond source code.

## Open Questions

All previously open questions have been resolved during grounding (see `lesson-grounding.md` § Resolved Verification Questions). Key decisions:

- **Schema update proposal:** Provisional values ready for application when approved.
- **Generalizability:** Keep lesson tool-agnostic. Teach universal patterns with one concrete example each. Tool-specific details (Vitest `forceRerunTriggers`, Lefthook `parallel: true`, Cursor `failClosed`) go in Materiały dodatkowe, not lesson prose.
- **Demo project:** Focus on 10xCards. edu-platform is a prep/testing ground, not demoed.
- **Pre-commit tools:** Recommend Lefthook, acknowledge Husky+lint-staged, don't force migration.
- **Cross-tool limitations:** Name briefly — context injection support is the key differentiator.
- **Vitest syntax:** `vitest related <path> --run` (subcommand, not `--related` flag).
- **Performance heuristic:** Provide generalizable rule: "if a check takes more than a few seconds, move it to commit or push time."
- **Runtime reliability:** Mention in Deep Dive as general category. Stop hooks have known issues in Skills/Plugins contexts; PostToolUse hooks are reliable.
- **Claude Code `agent` handler:** Mention in Deep Dive as experimental.

## Side-Effect Ledger

New claims introduced:
- Every major AI coding tool (Claude Code, Cursor, Codex, Windsurf, Copilot) supports hooks with a shared architecture in mid-2026
- Claude Code leads with 25+ events and 5 handler types; Cursor is close with ~18 events
- Windsurf lacks context injection, which limits automated quality enforcement
- Lefthook is more agent-friendly than Husky+lint-staged for the pre-commit layer
- The three-layer local quality pipeline (per-edit → pre-commit → pre-push) is the recommended model

Claims removed: (none)

Neighboring lesson references changed:
- m3-l1's strategic "post-edit hooks" recommendation is now operationalized in m3-l3
- m3-l2's "bridge to m3-l3: ręczne uruchomienie testów dzisiaj" is the direct bridge-in

Prework references used:
- Prework 2.4 (safety discipline) — automated by hooks
- Prework 1.3 (tutor mode) — hooks as the tutor for the agent itself

Prework concepts repeated intentionally: (none — prework safety discipline is operationalized, not repeated)

Potential duplicates:
- m3-l1 strategic hook framing vs. m3-l3 operational hook configuration — boundary clear: m3-l1 names the pattern, m3-l3 configures it
- m1-l4 rules-file hierarchy vs. m3-l3 hook config in settings.json — boundary clear: m1-l4 teaches rules files, m3-l3 teaches hooks as a separate mechanism

Unsupported facts:
- Exact Vitest flags for scoped test runs need grounding before draft
- Whether edu-platform has existing hook configurations to reference in video
- Specific performance numbers for lint/typecheck hook execution times

Video/text mismatches: (none — spec only)

Needs human decision:
- Lefthook vs. Husky+lint-staged recommendation posture
- Cross-tool limitation naming depth
- edu-platform hook examples for video content
