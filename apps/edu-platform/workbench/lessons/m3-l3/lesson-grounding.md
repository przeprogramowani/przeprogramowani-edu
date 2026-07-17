# Lesson Grounding: m3-l3 — Hooki i triggery: Agent, który sam reaguje na błędy

## Scope

- Lesson source: spec + hooks-research.md
- Neighbor boundaries: m3-l1 owns strategic hook framing, m3-l2 owns unit test authoring, m3-l4 owns E2E/Playwright, m3-l5 owns debug strategy
- Relevant prework: 2.4 (safety discipline), 1.3 (tutor mode), 2.2/2.3 (tool basics)
- Research posture: standard — verify spec claims, fill unsupported facts, collect practitioner signals

## Claims To Support

1. **All major AI coding tools support hooks with a shared architecture** — central convergence claim — needs per-tool official docs
2. **Claude Code has 25+ events and 5 handler types** — specific count claim — needs official docs
3. **Cursor has ~18 events including afterFileEdit** — specific feature claim — needs Cursor docs
4. **Codex has 10 events with command-only handlers** — limitation claim — needs OpenAI docs
5. **Windsurf lacks context injection** — critical differentiator claim — needs Windsurf docs
6. **Copilot hooks in public preview, reads .claude/settings.json** — compatibility claim — needs GitHub docs
7. **Vitest supports scoped test runs via --related/--changed** — practical hook command — needs Vitest docs
8. **Lefthook is agent-friendly: single YAML, parallel, no Node dep** — recommendation basis — needs Lefthook docs
9. **Hook performance: lint <100ms per-edit, typecheck slower** — performance claim — needs practical evidence
10. **Context injection lets agent self-correct trivially** — behavioral claim — needs official mechanism docs

## Strong Sources

### Claude Code Hooks Documentation

- URL: https://docs.anthropic.com/en/docs/claude-code/hooks
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-26
- Supports:
  - 29 lifecycle events across three cadences (session, turn, tool-call) plus watchers (spec said "25+" — actual count is 29 including Setup, TeammateIdle)
  - Five handler types: `command`, `http`, `mcp_tool`, `prompt`, `agent`
  - Exit code semantics: 0 = success, 2 = blocking error, other = non-blocking
  - PostToolUse matched on `Write|Edit` receives `tool_input.file_path` in JSON stdin
  - PostToolUse hooks inject feedback via `additionalContext` in `hookSpecificOutput` JSON — agent sees it as a system reminder on next model request. Capped at 10,000 characters.
  - PreToolUse hooks can modify tool input via `updatedInput` and make permission decisions (`allow`, `deny`, `ask`)
  - Matchers support exact strings, pipe-separated lists (`Write|Edit`), and JS regex (`/mcp__.*$/`)
  - Config lives in `settings.json` at user (`~/.claude/`), project (`.claude/`), local (`.claude/settings.local.json`), and managed policy levels
  - Default timeout: 600 seconds for command/http/mcp_tool handlers; 30 seconds for prompt handlers; 60 seconds for agent handlers (configurable per hook)
  - `async: true` supported for non-blocking hooks
  - `FileChanged` watchers for file-level triggers
- Use in lesson:
  - Primary deep example for hook configuration (Beat 3-6)
  - JSON config snippets for PostToolUse lint, typecheck, and scoped test hooks
  - Exit code 2 as the blocking signal mechanism
  - Context injection via stdout as the differentiator vs. git hooks
- Confidence: high
- Notes:
  - The hooks system is GA since late 2025 with HTTP hooks added February 2026
  - `agent` handler type is experimental
  - PostToolUse cannot undo a tool execution — only injects feedback forward
  - No built-in aggregated changed-file list across a turn — each PostToolUse fires independently

### Cursor Hooks Documentation

- URL: https://docs.cursor.com/configuration/hooks
- Type: official-docs
- Author/publisher: Cursor / Anysphere
- Checked: 2026-05-26
- Supports:
  - ~18 events including `afterFileEdit` (dedicated file-edit event with edit diffs), `afterAgentThought`, Tab completion hooks
  - Two handler types: `command` (shell scripts via JSON stdio) and `prompt` (LLM-evaluated conditions)
  - Exit code 2 blocks action; default is fail-open (configurable via `failClosed: true`)
  - `afterFileEdit` receives `file_path` and `edits` array (old_string/new_string pairs)
  - Post-hooks inject `additional_context` into conversation
  - `stop` hook can auto-submit follow-up message (subject to `loop_limit`, default 5)
  - Config in `.cursor/hooks.json` at project level, `~/.cursor/hooks.json` at user level
- Use in lesson:
  - Cross-tool transfer: same lifecycle pattern, different event names and config location
  - `afterFileEdit` as Cursor's more specific alternative to PostToolUse+Write|Edit matcher
  - `failClosed: true` as a safety feature worth knowing
- Confidence: high
- Notes:
  - Available since Cursor 1.7 (October 2025)
  - No HTTP hook type (unlike Claude Code)
  - Tab hooks are separate from agent hooks

### Codex Hooks Documentation

- URL: https://openai.com/codex/docs/hooks
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-05-26
- Supports:
  - 10 events: SessionStart, SubagentStart, PreToolUse, PermissionRequest, PostToolUse, PreCompact, PostCompact, UserPromptSubmit, SubagentStop, Stop
  - Only `type: "command"` handlers execute; `prompt` and `agent` types are parsed but skipped
  - Exit code semantics match Claude Code (0/2/other)
  - Hash-based trust model: project hooks require explicit user review, trust recorded against hook hash
  - Config in `.codex/hooks.json` or inline in `config.toml`
- Use in lesson:
  - Cross-tool transfer: fewer events, command-only, but same JSON stdin/stdout pattern
  - Trust model as a unique safety feature (hash-based review)
  - Limitation: incomplete PreToolUse interception for some tool types
- Confidence: high
- Notes:
  - GA since early 2026 but less mature than Claude Code
  - `async: true` is parsed but skipped
  - Sandbox mode may restrict hook network access

### Windsurf Cascade Hooks Documentation

- URL: https://docs.windsurf.com/windsurf/cascade/hooks
- Type: official-docs
- Author/publisher: Codeium / Windsurf
- Checked: 2026-05-26
- Supports:
  - 12 events using snake_case naming (`pre_write_code`, `post_write_code`, etc.)
  - Shell commands only — no HTTP, prompt, or MCP tool handlers
  - `post_write_code` receives `file_path` and `edits` array
  - Pre-hooks can block with exit code 2; post-hooks cannot block
  - Cross-platform support via separate `command` and `powershell` fields
- Use in lesson:
  - Cross-tool transfer: same trigger/check pattern, different naming convention
  - **Critical limitation: no context injection** — hooks cannot send feedback to the model
  - This is the key differentiator: Windsurf hooks can block but can't teach the agent
- Confidence: high
- Notes:
  - No session lifecycle events, no sub-agent events, no compaction events
  - No input modification on pre-hooks (can only block or allow)
  - Target sub-100ms execution per official docs
  - `post_cascade_response_with_transcript` data structure may change

### GitHub Copilot Hooks Documentation

- URL: https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-coding-agent/configuring-coding-agent-hooks
- Type: official-docs
- Author/publisher: GitHub / Microsoft
- Checked: 2026-05-26
- Supports:
  - ~13 events across three runtimes (cloud agent, VS Code, CLI)
  - Three handler types: `command`, `http`, `prompt` (CLI-only for prompt)
  - VS Code reads `.claude/settings.json` as a hook source — cross-tool compatibility
  - Config in `.github/hooks/*.json` (cloud agent), plus additional locations for VS Code and CLI
  - PostToolUse `additionalContext` capped at 10 KB
  - Two payload formats: camelCase and PascalCase with different field names
- Use in lesson:
  - Cross-tool transfer: broadest deployment (cloud + local) but most variable capabilities
  - `.claude/settings.json` compatibility is a practical convergence signal
  - Cloud agent limitations: ephemeral sandbox, no user interaction, `ask` treated as `deny`
- Confidence: high
- Notes:
  - Public preview as of March 2026
  - Cloud agent has the fewest capabilities (no permissionRequest, no notification)
  - The dual payload format adds unnecessary complexity

### Vitest `related` Subcommand and `--changed` Flag

- URL: https://vitest.dev/guide/cli.html
- Type: official-docs
- Author/publisher: Vitest / VoidZero
- Checked: 2026-05-26
- Supports:
  - `vitest related <path> [--run]` runs only tests that import the specified source file(s) — this is a **subcommand**, not a `--related` flag
  - `vitest --changed [base]` runs tests related to git-changed files (staged + unstaged by default, or vs. a specific base like `HEAD~1` or `origin/main`)
  - Related-test detection uses Vite's **static import graph** — traces `import` and `import()` but not fully dynamic `import(variable)`
  - Available since early Vitest versions (not new in v4)
  - `--run` flag prevents watch mode (essential for hook use)
- Use in lesson:
  - **Correct syntax for hooks:** `vitest related $EDITED_FILE --run` (not `vitest --related`)
  - The spec incorrectly used `--related` / `--changed` as flags — the draft must use the correct subcommand syntax
  - `--changed` is useful for pre-commit/pre-push hooks (git-aware scoping)
  - `vitest related` is useful for per-edit agent hooks (single-file scoping)
- Confidence: high
- Notes:
  - If `vitest.config.ts` or `package.json` changes, the entire suite runs (controlled by `forceRerunTriggers`)
  - Paths must be relative to Vitest project root
  - No glob support — each file listed explicitly (space-separated for multiple)

### Vitest 4.1 Agent Reporter

- URL: https://vitest.dev/blog/vitest-4-1.html
- Type: official-docs
- Author/publisher: Vitest / VoidZero
- Checked: 2026-05-26
- Supports:
  - `agent` reporter auto-activates when running inside AI coding agents (detected via `std-env`)
  - Outputs only failures, reducing token usage
  - Can be forced with `AI_AGENT=1` or `AI_AGENT=copilot` environment variable
  - "Run Related Tests" feature added as a VS Code extension command (not a new CLI flag)
- Use in lesson:
  - Highly relevant for hook performance: agent reporter reduces output noise for PostToolUse test hooks
  - Shows that test runners are adapting to AI agent workflows
  - Recommend setting `AI_AGENT=1` in hook environment for minimal output
- Confidence: high
- Notes:
  - The VS Code "Run Related Tests" command is separate from the CLI `vitest related` subcommand
  - Agent reporter is a Vitest 4.1+ feature specifically

### Lefthook

- URL: https://github.com/evilmartians/lefthook
- Type: repo
- Author/publisher: Evil Martians / evilmartians
- Checked: 2026-05-26
- Supports:
  - Single `lefthook.yml` config file for all hook types
  - Parallel command execution supported via `parallel: true` (opt-in, NOT default — the hooks-research.md incorrectly claimed "parallel by default")
  - `{staged_files}` interpolation for scoped checks (also `{push_files}`, `{all_files}`, `{files}`, `{cmd}`)
  - Go binary — no Node.js runtime dependency
  - CI-compatible: `lefthook run pre-commit` works outside git hooks context
  - `glob` and `exclude` filters for file matching
  - Docker integration for containerized checks
  - Current version: v2.1.8 (released 2026-05-19). Active development with 8 releases in the v2.1.x line since February 2026.
  - Installation: `brew install lefthook`, `npm install lefthook`, `go install`
- Use in lesson:
  - Recommended pre-commit tool: agent-friendly single-file config, supports parallel execution (`parallel: true`), no Node dep
  - Concrete `lefthook.yml` example for lint + typecheck + test on staged files
  - Brief comparison with Husky+lint-staged (acknowledge existing setups)
  - `{staged_files}` interpolation as the scoping mechanism at commit time
- Confidence: high
- Notes:
  - Lefthook auto-creates git hooks on `lefthook install`
  - Supports `pre-commit`, `commit-msg`, `pre-push`, and other git hook types
  - `parallel: true` is the default — no config needed
  - `piped: true` option available for sequential execution when needed

### Steve Kinney — Self-Testing AI Agents / Git Hooks with Lefthook

- URL: https://stevekinney.com/courses/self-testing-ai-agents/git-hooks-with-lefthook
- Type: technical-post
- Author/publisher: Steve Kinney
- Checked: 2026-05-26
- Supports:
  - Practical Lefthook setup for AI agent workflows
  - Rationale for Lefthook over Husky in agent-friendly contexts
  - Concrete config examples for TypeScript projects
- Use in lesson:
  - Useful as Materiały dodatkowe link
  - Confirms Lefthook recommendation is shared by practitioners in the AI coding space
- Confidence: high
- Notes:
  - Part of a larger course on self-testing AI agents — relevant framing overlap

## Practitioner Signals

### Hook adoption sentiment (aggregated from HN, Reddit, dev blogs)

- Type: practitioner-signal
- Signal:
  - Strong positive sentiment toward PostToolUse hooks for auto-format and lint
  - Most common first hook: Prettier/ESLint --fix on file edit
  - Recurring pain: "hooks slow down the agent when running full test suites" — confirms the lesson's "hook everything always" failure mode. Recommended fix: `async: true` or moving heavy checks to Stop hooks
  - Community-shared hooks collections emerging (claude-hooks repos, 1Password/agent-hooks)
  - Practitioners notice the convergence: "Cursor hooks look like Claude Code hooks"
  - Some report that adding hooks to their workflow "was the single biggest productivity improvement" in AI-assisted development
  - Key insight: "hooks survive context compression" — hooks are deterministic (shell-level) while prompt-based instructions can be compressed or ignored
- Useful language:
  - "instant feedback loop" — describes the per-edit hook experience
  - "the agent fixes its own lint errors" — describes context injection behavior
  - "I stopped running lint manually after setting up hooks" — describes behavioral change
  - "hooks are the new lint-staged" — names the generational shift
  - "deterministic control layer" — Speakeasy framing
  - "middleware for your AI session" — useful mental model
  - "the agent will happily commit broken code without them" — Egghead.io framing
- Risk:
  - Enthusiasm can overclaim: hooks don't replace CI, don't catch architectural issues, and don't work well for slow checks
  - Some practitioners wire too many hooks and complain about latency — exactly the failure mode the lesson must disarm
  - Runtime reliability concern: a HN "Tell" thread reported Claude 4.7 ignoring Stop hooks after a model update. Hooks are only as reliable as the runtime honoring them.
- Confidence: medium (sentiment is directional, not statistical)

### 1Password agent-hooks — cross-tool convergence proof

- URL: https://github.com/1Password/agent-hooks
- Type: repo
- Signal:
  - 1Password published an open-source repo with an install script that copies the same hook set into `.cursor/hooks.json`, `.claude/settings.json`, and `.windsurf/hooks.json`
  - This is the strongest concrete signal that hook architecture is converging toward a de facto standard
  - A single hook definition → multiple tool configs
- Useful language:
  - "one hook definition, multiple tools" — practitioner proof of convergence
- Risk:
  - 1Password is an enterprise context; not every learner needs cross-tool hooks
- Confidence: high (concrete artifact, not opinion)

### "Hooks are the harness" framing (Blake Crosley / Codex hooks post)

- URL: https://blakecrosley.com/blog/codex-hooks-make-the-harness-real
- Type: technical-post
- Signal:
  - Frames hooks as the mechanism that makes the "harness" concept from prework 1.2 real and operational
  - "The harness isn't just permissions and sandboxing — hooks are what make it a quality system"
  - Connects hooks to the broader agent autonomy story
- Useful language:
  - "hooks make the harness real" — strong framing for bridge from prework
- Risk:
  - Codex-specific context; some claims about Codex hook capabilities may not match current reality (Codex has gaps)
- Confidence: medium

### "6 hooks to make Claude Code cleaner, safer, and saner" (HN front page)

- URL: https://news.ycombinator.com/item?id=44477756
- Type: practitioner-signal
- Signal:
  - 100+ points on HN front page
  - Shared hooks: check-package-age.sh (block outdated deps), code-quality-validator.sh (PostToolUse lint), code-similarity-check.sh (duplicate detection), pre-commit-check.sh (lint+test gate), claude-context-updater.sh (auto-update CLAUDE.md)
  - Shows the breadth of hook use cases beyond lint/format
- Useful language:
  - Concrete hook names that learners can adapt
- Risk:
  - Some hooks are Claude Code-specific; transferability to other tools varies
- Confidence: medium

### Egghead.io — "Commit Hooks are Critical with AI Agents in Cursor"

- URL: https://egghead.io/commit-hooks-are-critical-with-ai-agents-in-cursor~jhoer
- Type: technical-post
- Signal:
  - Premise: without pre-commit hooks, agents will happily commit broken code
  - Supports the three-layer model: agent hooks catch during edit, git hooks catch at commit
- Useful language:
  - "the agent will happily commit broken code without them"
- Risk:
  - Cursor-specific focus
- Confidence: high

### "Almost nobody uses them" (Medium practitioner post)

- URL: https://engineeratheart.medium.com/agent-hooks-are-claude-codes-most-powerful-feature-and-almost-nobody-uses-them-d88d64f6172d
- Type: practitioner-signal
- Signal:
  - Practitioner frustration that hooks are powerful but underused
  - Confirms the lesson has a real gap to fill — most learners haven't set up hooks yet
- Useful language:
  - "most powerful feature almost nobody uses" — frames hooks as hidden value
- Risk:
  - Medium post; claims may not reflect broader adoption data
- Confidence: low-medium

## Examples Worth Using

1. **edu-platform as a "before" example**: The monorepo has Husky installed with lint-staged configured but **no actual hook scripts in `.husky/`** — pre-commit gate is declared but not wired. This is a realistic failure mode: teams set up Husky but don't maintain the hooks. The lesson can use this as motivation for the three-layer model.

2. **Same-file before/after with Prettier hook**: Agent edits `src/utils/auth.ts` in 10xcards. Without hook: file has formatting issues, caught 10 minutes later by lint-staged at commit. With PostToolUse hook: Prettier runs immediately, file is clean, agent sees no errors.

3. **Vitest related in a hook**: `vitest related src/server/auth.ts --run` in a PostToolUse hook — runs only auth-related tests after the agent edits the auth module. Combined with `AI_AGENT=1` environment variable for minimal output.

4. **Lefthook.yml for TypeScript project**: Concrete config with `pre-commit` (lint + format on staged files), `pre-push` (typecheck + test on pushed files). Shows `{staged_files}` and `{push_files}` interpolation.

5. **Cross-tool comparison moment**: The same lint hook objective expressed in Claude Code (`settings.json` with `PostToolUse` + `Write|Edit` matcher), Cursor (`.cursor/hooks.json` with `afterFileEdit`), and Codex (`.codex/hooks.json` with `PostToolUse` + `Write` matcher). The pattern is recognizable across all three.

## Claims To Avoid Or Soften

1. **"Hooks replace CI"** — They don't. Hooks are a local feedback layer that reduces the number of issues reaching CI, but CI remains the canonical verification for shared state, integration, and environments the developer doesn't control. Frame as complementary.

2. **"<100ms for lint per-edit"** — Specific latency numbers depend on project size, tool version, and machine. The Windsurf docs mention targeting sub-100ms, but this is a guideline not a guarantee. Soften to: "lint and format hooks are typically fast enough to run per-edit without noticeable delay; typecheck and test hooks may need to move to commit/push time depending on project size."

3. **"All tools converged on the same architecture"** — The convergence is real (JSON config, PreToolUse/PostToolUse events, exit codes, stdin/stdout) but not complete. Windsurf lacks context injection, Codex has incomplete interception, Copilot is in preview. Soften to: "all major tools now support a shared hook lifecycle pattern, though depth and capabilities vary."

4. **"25+ events in Claude Code"** — Actual count is 29 per official docs. Use "~30" or "nearly 30" in lesson prose. The exact count changes as the hooks system evolves; don't put exact numbers in the lesson title or thesis.

5. **"Copilot reads .claude/settings.json"** — Confirmed for the VS Code extension, not for the cloud agent or CLI. Scope the claim precisely.

6. **"Vitest --related flag"** — The spec used `--related` as a flag; the actual syntax is `vitest related <path>` (a subcommand). The draft must use the correct syntax to avoid misleading learners who copy-paste commands.

## Resolved Verification Questions

1. **edu-platform for video** — RESOLVED. Focus on 10xCards for the lesson narrative. edu-platform is a testing ground for content prep, not a demo project (not yet introduced in the course).

2. **Vitest `forceRerunTriggers`** — RESOLVED via research. Default triggers: `['**/package.json', '**/vitest.config.*', '**/vite.config.*']`. Configurable per-project in `vitest.config.ts` — set `forceRerunTriggers: []` to prevent full-suite reruns when config files are staged. Trade-off: loses config-regression safety net. **Editorial note:** this is a Vitest-specific detail; per decision #7, keep it out of lesson prose. Useful only if someone asks or for Materiały dodatkowe.

3. **Claude Code `agent` handler type** — RESOLVED. Mention in Deep Dive as experimental — approved by author.

4. **Lefthook + npm workspaces** — RESOLVED via research. `{staged_files}` returns paths relative to repo root, which works correctly in monorepos. Use glob patterns like `glob: "projects/edu-platform/**/*.{ts,tsx}"` to scope to specific workspaces. Supports `source_dir` and `root` config options. No known issues. **Editorial note:** per decision #7, keep monorepo-specific Lefthook details out of lesson prose unless generalizable.

5. **Hook performance heuristic** — RESOLVED. Lesson should provide a generalizable heuristic for when a check is too slow for per-edit hooks: "if a check takes longer than a few seconds, move it to commit or push time." Use typecheck as the canonical example of a check that may be too slow for per-edit on larger projects.

6. **Runtime reliability** — RESOLVED via research. The Stop hook issue is **partially confirmed**: GitHub issues #19225 and #29767 report Stop hooks not firing in Skills and Plugins contexts (open as of 2026-05-26). However, this is scoped to Stop hooks in specific contexts — PostToolUse hooks (the primary mechanism this lesson teaches) are not reported as affected. The CHANGELOG shows incremental hook fixes throughout 2026. **Decision:** mention "runtime reliability" briefly in Deep Dive as a general category — hooks are shell-level deterministic, but the runtime must trigger them. Note that PostToolUse hooks are the most reliable event; Stop hooks in Skills/Plugins have known open issues. Don't scare learners away from hooks — frame as: "test your hooks, and if a hook doesn't fire as expected, check GitHub issues for your tool."

7. **Framework specificity** — RESOLVED by editorial decision. **Keep the lesson generalizable.** Don't go deep on features specific to one test runner (Vitest), one pre-commit tool (Lefthook), or one framework. If a concept transfers across tools (e.g., "run related tests for the edited file"), teach the universal pattern with one concrete example. If a feature is tool-specific (e.g., Vitest `forceRerunTriggers`, Lefthook `parallel: true`), keep it out of lesson prose — it belongs in Materiały dodatkowe or as a footnote at most. This applies to the draft: don't write a Vitest tutorial or a Lefthook tutorial.

## Schema Source Update

Added `groundingSources` to m3-l3 in `lessons-schema.json` with:

1. Claude Code Hooks Documentation (official-docs, high confidence) — 29 events verified
2. Cursor Hooks Documentation (official-docs, high confidence) — ~18 events verified
3. Codex Hooks Documentation (official-docs, high confidence) — 10 events, command-only confirmed
4. Windsurf Cascade Hooks Documentation (official-docs, high confidence) — no context injection confirmed
5. GitHub Copilot Hooks Documentation (official-docs, high confidence) — public preview, .claude/settings.json compat confirmed
6. Vitest CLI documentation — `vitest related` subcommand and `--changed` flag (official-docs, high confidence)
7. Vitest 4.1 release notes — agent reporter (official-docs, high confidence)
8. Lefthook repository and documentation (repo, high confidence) — v2.1.8, parallel is opt-in
9. 1Password agent-hooks repo (repo, high confidence) — cross-tool convergence proof
10. Steve Kinney — Self-Testing AI Agents / Git Hooks with Lefthook (technical-post, high confidence)
11. Speakeasy — AI agent hooks: the interface for governing AI agents (technical-post, medium confidence)

Updated `sideEffectLedger.unsupportedFacts`:
- Removed "Exact Vitest flags for scoped test runs" — now grounded (it's `vitest related <path>`, a subcommand)
- Removed "Lefthook {staged_files} compatibility with npm workspaces" — now grounded (returns repo-root-relative paths, works in monorepos)
- Remaining: "Claude Code `agent` handler type stability status" (experimental, mentioned in Deep Dive)
- Remaining: "Stop hooks in Skills/Plugins contexts have open GitHub issues (#19225, #29767)"

Updated `sideEffectLedger.needsHumanDecision` — all resolved:
- ~~edu-platform for video~~ → focus on 10xCards
- ~~Vitest syntax~~ → draft uses correct `vitest related` subcommand syntax
- ~~Lefthook parallel~~ → draft says "supports parallel" with explicit `parallel: true` in examples
- ~~Framework specificity~~ → keep lesson generalizable; tool-specific details in Materiały dodatkowe only
