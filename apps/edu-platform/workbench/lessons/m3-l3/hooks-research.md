# Hooks / Triggers / Automated Actions in AI Coding Tools (mid-2026)

Research date: 2026-05-26

Goal: understand what each tool offers for automatically running checks (lint, typecheck, tests) in response to agent actions (file edits, tool calls, etc.).

---

## 1. Claude Code

### Hook mechanisms

Claude Code has the most mature and comprehensive hooks system among AI coding tools. Hooks are user-defined shell commands, HTTP endpoints, LLM prompts, MCP tools, or even sub-agents that execute automatically at specific lifecycle points.

### Supported events

Hooks fire at three cadences:

**Once per session:** `SessionStart`, `SessionEnd`

**Once per turn:** `UserPromptSubmit`, `Stop`, `StopFailure`

**On every tool call:** `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, `PostToolBatch`

**Additional events:** `WorktreeCreate`, `WorktreeRemove`, `Notification`, `ConfigChange`, `InstructionsLoaded`, `CwdChanged`, `FileChanged`, `Elicitation`, `ElicitationResult`, `PreCompact`, `PostCompact`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `UserPromptExpansion`

Total: 25+ distinct lifecycle events.

### Configuration

Hooks are defined in JSON inside `settings.json` at multiple levels:

| Location | Scope | Shareable |
|----------|-------|-----------|
| `~/.claude/settings.json` | All projects (user) | No |
| `.claude/settings.json` | Single project | Yes (git) |
| `.claude/settings.local.json` | Single project | No |
| Managed policy settings | Organization-wide | Yes |
| Plugin `hooks/hooks.json` | Plugin scope | Yes |

Three-level nesting: `hooks -> [event] -> [matcher group] -> [handlers]`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Can run arbitrary shell commands?

Yes. Five handler types:
1. **Command** (`type: "command"`) — spawns shell commands, receives JSON on stdin
2. **HTTP** (`type: "http"`) — POST to endpoint, receives JSON back
3. **MCP Tool** (`type: "mcp_tool"`) — calls tools on connected MCP servers
4. **Prompt** (`type: "prompt"`) — single-turn LLM prompt for yes/no decisions
5. **Agent** (`type: "agent"`) — spawns sub-agents for complex verification (experimental)

### Can scope to changed files?

Yes. `PostToolUse` matched on `Write|Edit` receives `tool_input.file_path` in JSON stdin. A hook script can extract the path with `jq -r '.tool_input.file_path'` and run lint/format only on that file. This is effectively a per-file-edit lint-staged equivalent.

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success; JSON on stdout is processed |
| 2 | Blocking error; action is blocked (PreToolUse) or agent is told to fix (PostToolUse/Stop) |
| Other | Non-blocking error; execution continues |

PreToolUse hooks can: allow, deny, ask the user, or defer a tool call. They can also modify tool input before execution.

PostToolUse hooks can: add context/feedback to the agent (the agent sees it and can react), but cannot undo the tool execution.

Stop hooks can: force the agent to continue by returning exit code 2 or `decision: "block"` with a reason that becomes the next prompt.

### Matchers

Matchers filter when hooks fire. Support exact strings, pipe-separated lists (`Write|Edit`), and JavaScript regex (`mcp__.*`). Different events match against different fields (tool name, session source, notification type, etc.).

### Maturity

Stable and production-ready. The hooks system has been available since late 2025, with HTTP hooks added in February 2026. The 25+ events cover virtually every lifecycle point. Widely documented with community examples. Enterprise managed hooks are supported.

### Limitations / gotchas

- PostToolUse cannot undo a tool execution; it can only provide feedback.
- Command hooks execute with the session's cwd. Shell form (no `args`) gets full shell processing; exec form (with `args`) does not.
- Hook timeout defaults to 600 seconds. Slow hooks block the agent loop (unless `async: true`).
- `FileChanged` matchers are literal filenames only (no regex).
- No built-in "changed files list" aggregation across a turn; each PostToolUse fires per tool call.

### Sources

- https://code.claude.com/docs/en/hooks
- https://claudefa.st/blog/tools/hooks/hooks-guide
- https://smartscope.blog/en/generative-ai/claude/claude-code-hooks-guide/

---

## 2. Cursor

### Hook mechanisms

Cursor added hooks in version 1.7 (late 2025), supporting spawned processes communicating via JSON over stdio. The system mirrors Claude Code's architecture closely and has expanded in 2026.

### Supported events

**Agent hooks (Cmd+K/Agent Chat):**
- `sessionStart`, `sessionEnd`
- `preToolUse`, `postToolUse`, `postToolUseFailure`
- `subagentStart`, `subagentStop`
- `beforeShellExecution`, `afterShellExecution`
- `beforeMCPExecution`, `afterMCPExecution`
- `beforeReadFile`, `afterFileEdit`
- `beforeSubmitPrompt`, `preCompact`, `stop`
- `afterAgentResponse`, `afterAgentThought`

**Tab hooks (Inline completions):**
- `beforeTabFileRead` — control file access for Tab
- `afterTabFileEdit` — post-process Tab edits

**App lifecycle:**
- `workspaceOpen` — fires on workspace open/folder change

Total: ~18 distinct events.

### Configuration

JSON files at multiple levels (priority: Enterprise > Team > Project > User):

| Location | Scope |
|----------|-------|
| System-level (MDM-deployed) | Organization-wide |
| Web dashboard (Enterprise) | Team |
| `<project>/.cursor/hooks.json` | Project |
| `~/.cursor/hooks.json` | User |

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": ".cursor/hooks/format.sh",
        "timeout": 30,
        "matcher": "Write"
      }
    ]
  }
}
```

### Can run arbitrary shell commands?

Yes. Two handler types:
1. **Command-based** (default) — shell scripts receive JSON via stdin, return JSON via stdout
2. **Prompt-based** — LLM evaluates natural language condition, returns `{ ok, reason }`

### Can scope to changed files?

Yes. The `afterFileEdit` event receives `file_path` and an `edits` array (old_string/new_string pairs). Scripts can run linters/formatters on the specific file. The `beforeShellExecution` event receives the command and cwd.

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success; use JSON output |
| 2 | Block action (deny permission) |
| Other | Failure; action proceeds (fail-open default) |

### Key output capabilities

- `preToolUse`: can allow/deny, modify tool input via `updated_input`
- `postToolUse`: can inject `additional_context` into conversation
- `afterFileEdit`: useful for formatters
- `stop`: can auto-submit follow-up message (subject to `loop_limit`, default 5)
- `subagentStop`: can trigger follow-up actions

### Maturity

Available since Cursor 1.7 (October 2025). Actively developed through 2026. The hooks.json format auto-reloads on change. Enterprise distribution via system-level config and web dashboard is supported.

### Limitations / gotchas

- **Fail-open default**: hook crashes/timeouts allow the action to proceed. Must explicitly set `failClosed: true` to block on failure.
- `loop_limit` on `stop` and `subagentStop` caps auto-continuation at 5 iterations by default.
- Tab hooks (`beforeTabFileRead`, `afterTabFileEdit`) are separate from agent hooks.
- Prompt-based hooks rely on LLM evaluation, which adds latency.
- No HTTP hook type (unlike Claude Code).

### Sources

- https://cursor.com/docs/hooks
- https://www.infoq.com/news/2025/10/cursor-hooks/
- https://skywork.ai/blog/how-to-cursor-1-7-hooks-guide/
- https://blog.gitbutler.com/cursor-hooks-integration/

---

## 3. Codex (OpenAI)

### Hook mechanisms

Codex (the OpenAI CLI agent, formerly Codex CLI) adopted a hooks system modeled after Claude Code's architecture. Hooks inject scripts into the agentic loop, enabling logging, prompt scanning, validation, and custom checks.

### Supported events

| Event | Scope | Purpose |
|-------|-------|---------|
| `SessionStart` | Session | Runs when session begins |
| `SubagentStart` | Session | Before sub-agent initialization |
| `PreToolUse` | Turn | Intercepts tool calls before execution |
| `PermissionRequest` | Turn | Before approval prompts |
| `PostToolUse` | Turn | After tool completion |
| `PreCompact` | Turn | Before context compaction |
| `PostCompact` | Turn | After context compaction |
| `UserPromptSubmit` | Turn | Intercepts user prompts |
| `SubagentStop` | Turn | When sub-agent completes |
| `Stop` | Turn | When conversation turn stops |

Total: 10 events.

### Configuration

Hooks defined in `hooks.json` or inline `[hooks]` in `config.toml`:

| Location | Scope |
|----------|-------|
| System/MDM managed | Organization-wide |
| `~/.codex/hooks.json` or `config.toml` | User |
| `<repo>/.codex/hooks.json` or `config.toml` | Project |
| Plugin-bundled `hooks/hooks.json` | Plugin |

Three-level nesting identical to Claude Code: `hooks -> [event] -> [matcher group] -> [handlers]`

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = '.codex/hooks/validate.py'
timeout = 30
statusMessage = "Checking Bash command"
```

### Can run arbitrary shell commands?

Yes, but only `type: "command"` is functional. The `prompt` and `agent` handler types are parsed but skipped in execution. No HTTP hook type.

### Can scope to changed files?

Yes. `PreToolUse` and `PostToolUse` receive `tool_input` which includes file paths for file operations. For Bash tools, `tool_input.command` contains the shell command. Scripts can extract paths and run targeted checks.

### Exit codes

Same as Claude Code: 0 = success, 2 = blocking error, other = non-blocking error.

### Key output capabilities

- `PreToolUse`: can deny execution (`permissionDecision: "deny"`), rewrite tool input (`updatedInput`), add context
- `PostToolUse`: hook feedback replaces the tool result; model continues from hook message. Can stop processing with `continue: false`.
- `Stop`: exit code 2 or `decision: "block"` forces another turn

### Hook trust mechanism

Project-local hooks only load when the project's `.codex/` directory is trusted. Non-managed command hooks require explicit user review before execution. Trust is recorded against the hook's current hash; changed hooks are marked for re-review. Pass `--dangerously-bypass-hook-trust` for automation that already vets hook sources.

### Maturity

Hooks achieved GA alongside Codex access tokens (early 2026). The system is functional but less mature than Claude Code's. Only `type: "command"` works; `prompt` and `agent` handlers are parsed but not executed. Some events have incomplete interception (shell calls and WebSearch may not be intercepted by PreToolUse).

### Limitations / gotchas

- **Incomplete interception**: PreToolUse and PostToolUse do not intercept all tool calls (shell calls and WebSearch noted as gaps).
- Only `type: "command"` handlers run; `prompt` and `agent` are parsed but skipped.
- `async: true` is parsed but skipped.
- `PreToolUse` does not support `permissionDecision: "ask"` or `continue: false`.
- No `afterFileEdit`-style event; must use PostToolUse matched on tool name.
- Sandbox mode interacts with hooks: sandboxed commands may not have network access even if a hook expects it.

### Sources

- https://developers.openai.com/codex/hooks
- https://developers.openai.com/codex/config-advanced
- https://developers.openai.com/codex/concepts/sandboxing
- https://blakecrosley.com/blog/codex-hooks-make-the-harness-real

---

## 4. Windsurf (Codeium)

### Hook mechanisms

Windsurf's Cascade Hooks enable execution of custom shell commands at key workflow points. The system supports 12 hook events.

### Supported events

**Pre-hooks (can block with exit code 2):**
- `pre_read_code` — before file/directory reads
- `pre_write_code` — before code modifications
- `pre_run_command` — before terminal command execution
- `pre_mcp_tool_use` — before MCP tool invocation
- `pre_user_prompt` — before user prompt processing

**Post-hooks (cannot block):**
- `post_read_code` — after file reads
- `post_write_code` — after code modifications
- `post_run_command` — after command execution
- `post_mcp_tool_use` — after MCP invocation
- `post_cascade_response` — after agent response (async)
- `post_cascade_response_with_transcript` — after agent response with full transcript (async)
- `post_setup_worktree` — after git worktree creation

Total: 12 events.

### Configuration

JSON files at multiple levels:

| Location | Scope |
|----------|-------|
| System-level (MDM) | Organization-wide |
| Cloud dashboard (Enterprise) | Team |
| `~/.codeium/windsurf/hooks.json` | User |
| `<project>/.windsurf/hooks.json` | Project |

```json
{
  "hooks": {
    "post_write_code": [
      {
        "command": "npx eslint --fix \"$FILE_PATH\"",
        "show_output": true,
        "working_directory": "."
      }
    ]
  }
}
```

### Can run arbitrary shell commands?

Yes. Commands execute via `bash -c` on macOS/Linux and `powershell -Command` on Windows. Cross-platform support via separate `command` and `powershell` fields.

### Can scope to changed files?

Yes. `post_write_code` receives `file_path` and `edits` (old_string/new_string pairs). Scripts can target the specific file that was just modified.

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 2 | Blocking error (pre-hooks only) |
| Other | Error; action proceeds |

Only pre-hooks can block actions. Post-hooks fire after the action has already occurred.

### Maturity

The hooks system is functional and documented but simpler than Claude Code or Cursor. Only shell command handlers are supported (no HTTP, prompt, or MCP tool handlers). The event naming uses snake_case (`post_write_code`) rather than PascalCase. Enterprise distribution via cloud dashboard is supported.

### Limitations / gotchas

- **Read-only data**: hooks receive copies and cannot modify code directly or alter command outputs.
- **No input modification**: pre-hooks can only block (exit 2) or allow (exit 0); they cannot rewrite tool input.
- **No context injection**: hooks cannot send feedback to the model the way Claude Code or Cursor can (`additionalContext` / `systemMessage`).
- **Performance sensitive**: slow hooks impact Cascade responsiveness; target sub-100ms execution.
- **Simpler event model**: no session lifecycle events, no sub-agent events, no compaction events.
- **Security**: hooks execute with full user permissions. No trust/review mechanism like Codex.
- `post_cascade_response_with_transcript` data structure may change in future versions.

### Sources

- https://docs.windsurf.com/windsurf/cascade/hooks
- https://myengineeringpath.dev/tools/windsurf-ai/

---

## 5. GitHub Copilot (Coding Agent / Workspace)

### Hook mechanisms

GitHub Copilot supports hooks in three contexts: the cloud agent (runs on GitHub infrastructure), the VS Code extension (agent mode), and the Copilot CLI. All three share a similar JSON configuration format but differ in what events are available and where configs are loaded from.

### Supported events

| Event | Cloud Agent | VS Code | CLI |
|-------|-------------|---------|-----|
| `sessionStart` / `SessionStart` | Yes | Yes | Yes |
| `sessionEnd` / `SessionEnd` | Yes | Yes | Yes |
| `userPromptSubmitted` / `UserPromptSubmit` | Yes (at most once) | Yes | Yes |
| `preToolUse` / `PreToolUse` | Yes | Yes | Yes |
| `postToolUse` / `PostToolUse` | Yes | Yes | Yes |
| `postToolUseFailure` / `PostToolUseFailure` | Yes | — | — |
| `preCompact` / `PreCompact` | Yes (auto only) | Yes | Yes |
| `agentStop` / `Stop` | Yes | Yes | Yes |
| `subagentStart` | Yes | Yes | — |
| `subagentStop` / `SubagentStop` | Yes | Yes | — |
| `errorOccurred` / `ErrorOccurred` | Yes | — | — |
| `permissionRequest` | No | — | Yes (CLI only) |
| `notification` | No | — | Yes (CLI only) |

Total: ~13 events (varies by runtime).

Two naming conventions are supported: camelCase (e.g. `sessionStart`) and PascalCase (e.g. `SessionStart` with snake_case fields in payload).

### Configuration

**Cloud agent:** only `.github/hooks/*.json` files in the repository (no user-level config).

**VS Code:** `.github/hooks/*.json`, `.claude/settings.json`, `~/.copilot/hooks/`, `~/.claude/settings.json`, plugin hooks.

**CLI:** `.github/hooks/*.json`, `~/.copilot/hooks/`, inline in settings.json.

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/validate.sh",
        "powershell": "powershell -File scripts/validate.ps1",
        "timeoutSec": 30,
        "env": { "STRICT": "true" }
      }
    ]
  }
}
```

### Handler types

1. **Command** (`type: "command"`) — shell scripts with `bash`, `powershell`, and generic `command` fields
2. **HTTP** (`type: "http"`) — POST JSON to URL (HTTPS required for preToolUse/permissionRequest)
3. **Prompt** (`type: "prompt"`) — auto-submit text (CLI only, new sessions only)

### Can run arbitrary shell commands?

Yes. Cross-platform support via `bash`/`powershell`/`command` fields. Cloud agent only honors `bash`.

### Can scope to changed files?

Yes. `preToolUse` receives `toolArgs` / `tool_input` with file paths. `postToolUse` receives `toolResult` / `tool_result`. Scripts can extract paths and run targeted checks. PostToolUse output is capped at 10 KB for `additionalContext`.

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 2 | Warning/block; for permissionRequest treated as deny |
| Other | Logged as failure; run continues (fail-open) |

### Key output capabilities

- `preToolUse`: allow/deny/ask, modify args via `modifiedArgs`
- `postToolUse`: modify result via `modifiedResult`, inject `additionalContext` (10 KB cap)
- `agentStop`: `decision: "block"` forces another turn
- `sessionStart`: inject `additionalContext`

### Cloud agent specifics

The cloud agent runs in an ephemeral Linux sandbox. All tool permissions are pre-granted (no `permissionRequest` event). `notification` does not fire. Outbound network is restricted to allow-listed hosts. Only `.github/hooks/*.json` from the repo is loaded.

### Maturity

Agent hooks are in **public preview** as of March 2026. The VS Code integration reads hooks from multiple locations including `.claude/settings.json` (compatibility with Claude Code configs). The cloud agent hooks are functional but limited by the sandbox environment. Two payload formats (camelCase and PascalCase) add complexity.

### Limitations / gotchas

- **Cloud agent sandbox**: ephemeral filesystem, restricted outbound network, no user-level config, no `permissionRequest` or `notification` events.
- **`ask` treated as `deny`** on cloud agent (no user to ask).
- **Two payload formats**: camelCase and PascalCase use different field names and timestamp formats (milliseconds vs ISO 8601).
- **Prompt hooks**: CLI-only, fire only for new sessions (not resume or non-interactive mode).
- **PostToolUse additionalContext capped at 10 KB**.
- **Built-in general-purpose agent does not emit `subagentStart`/`subagentStop`**.

### Sources

- https://docs.github.com/en/copilot/reference/hooks-configuration
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/use-hooks
- https://code.visualstudio.com/docs/copilot/customization/hooks
- https://code.visualstudio.com/blogs/2026/05/15/agent-harnesses-github-copilot-vscode

---

## 6. Traditional Git Hooks (Baseline Comparison)

### Tools

- **Husky** — the most popular Git hooks manager for the JavaScript ecosystem. Puts hook logic in shell scripts inside `.husky/`. Version 8+ simplified setup.
- **lint-staged** — not a hook runner itself; pairs with Husky to run commands only on staged files. Rules in `package.json` or `.lintstagedrc`.
- **Lefthook** — a Go binary that replaces both Husky and lint-staged. Single `lefthook.yml` config. Parallel execution by default.

### What events can trigger them?

Git lifecycle events only:
- `pre-commit` — before commit is created
- `commit-msg` — after message is written, before commit finishes
- `pre-push` — before push to remote
- `post-commit`, `post-merge`, `post-checkout` — after the respective operations

### Can they run arbitrary shell commands?

Yes. All three tools execute shell commands. Lefthook and Husky run scripts directly; lint-staged runs commands with staged file paths as arguments.

### Can they scope to changed files?

- **lint-staged**: yes, this is its core purpose. Runs commands only on staged files matching glob patterns.
- **Lefthook**: yes, via `glob` and `exclude` filters plus `{staged_files}` and `{push_files}` interpolation.
- **Husky**: no built-in file scoping; delegates to lint-staged or manual `git diff` parsing.

### Comparison table

| Feature | Husky + lint-staged | Lefthook |
|---------|---------------------|----------|
| Language | Node.js | Go binary |
| Config | `.husky/` + `.lintstagedrc` | Single `lefthook.yml` |
| Parallel execution | No (sequential) | Yes (default) |
| Auto-install | `prepare` script | Manual or `prepare` script |
| Changed-file scoping | lint-staged | Built-in `{staged_files}` |
| Docker integration | No | Yes |
| CI reuse | Not designed for it | `lefthook run pre-commit` |
| Runtime dependency | Node.js | None |

### Relevance to AI agents

Traditional git hooks fire at commit/push time, not during agent editing. They are the **last gate** before code leaves the developer's machine. AI agent hooks fire **during** the editing session, catching issues before they accumulate.

However, git hooks and AI agent hooks are complementary:
- AI agent hooks (PostToolUse) catch issues per-edit in real time.
- Git pre-commit hooks (lint-staged/Lefthook) catch issues on the final commit, including manual edits.
- Git pre-push hooks run heavier checks (typecheck, full test suite).

Lefthook's single-file config (`lefthook.yml`) is particularly agent-friendly: when AI agents need to understand what quality gates exist, they can read one file instead of navigating `.husky/` + `.lintstagedrc` + `package.json`.

### Sources

- https://www.pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026
- https://stevekinney.com/courses/self-testing-ai-agents/git-hooks-with-lefthook
- https://www.andymadge.com/2026/03/10/git-hooks-comparison/
- https://recca0120.github.io/en/2026/03/08/lefthook-git-hooks/

---

## Comparison Matrix

| Feature | Claude Code | Cursor | Codex (OpenAI) | Windsurf | GitHub Copilot | Git Hooks |
|---------|-------------|--------|----------------|----------|----------------|-----------|
| **Total events** | 25+ | ~18 | 10 | 12 | ~13 | ~6 |
| **Pre-edit blocking** | PreToolUse | preToolUse | PreToolUse | pre_write_code | preToolUse | pre-commit |
| **Post-edit feedback** | PostToolUse | postToolUse + afterFileEdit | PostToolUse | post_write_code | postToolUse | N/A |
| **Context injection** | Yes (additionalContext, systemMessage) | Yes (additional_context, user_message) | Yes (additionalContext, systemMessage) | No | Yes (additionalContext, 10KB cap) | N/A |
| **Input modification** | Yes (updatedInput) | Yes (updated_input) | Yes (updatedInput) | No | Yes (modifiedArgs) | N/A |
| **Handler types** | command, http, mcp_tool, prompt, agent | command, prompt | command only | command only | command, http, prompt | command |
| **Arbitrary shell** | Yes | Yes | Yes | Yes | Yes | Yes |
| **Changed-file scope** | Via tool_input.file_path | Via file_path in afterFileEdit | Via tool_input | Via file_path in post_write_code | Via toolArgs | lint-staged / Lefthook |
| **Session events** | SessionStart, SessionEnd | sessionStart, sessionEnd | SessionStart | None | sessionStart, sessionEnd | N/A |
| **Sub-agent events** | SubagentStart, SubagentStop | subagentStart, subagentStop | SubagentStart, SubagentStop | None | subagentStart, subagentStop | N/A |
| **File-watch events** | FileChanged | None | None | None | None | N/A |
| **Stop continuation** | Exit 2 forces new turn | followup_message | Exit 2 / decision: block | No | decision: block | N/A |
| **Enterprise/MDM** | Managed policy settings | System-level + web dashboard | requirements.toml + MDM dir | System-level + cloud dashboard | Cloud agent + system-level | N/A |
| **Trust/review** | Managed hooks trusted; others need review | No explicit trust model | Hash-based trust + review UI | No trust model | No explicit trust model | N/A |
| **Fail behavior** | Success unless exit 2 | Fail-open (configurable) | Success unless exit 2 | Success unless exit 2 | Fail-open | Blocks commit |
| **Maturity** | Stable (GA since late 2025) | Stable (since v1.7, Oct 2025) | GA (early 2026, gaps remain) | Functional | Public preview (Mar 2026) | Mature (10+ years) |

---

## Key Observations

### 1. Convergence on a shared architecture

All five AI coding tools have converged on a nearly identical hooks architecture: JSON config, PreToolUse/PostToolUse events, exit code 2 for blocking, JSON stdin/stdout communication. Claude Code established the pattern; Cursor, Codex, and GitHub Copilot explicitly adopted compatible event names and schemas. GitHub Copilot VS Code even reads `.claude/settings.json` as a hook source.

### 2. Claude Code leads in depth

Claude Code has the most events (25+), the most handler types (5), and the most flexible output control (context injection, input modification, permission decisions). It is the only tool with FileChanged watchers, MCP tool hooks, and agent-type handlers.

### 3. Cursor is the closest competitor

Cursor matches Claude Code closely with ~18 events and unique additions like `afterFileEdit` (dedicated file-edit event), `afterAgentThought` (observe reasoning), and Tab completion hooks. Its `failClosed` option is a useful safety feature.

### 4. Codex has gaps

Codex has the fewest events (10) and only command handlers work. PreToolUse interception is incomplete (some tool types are not intercepted). The trust/review model is the most explicit but adds friction.

### 5. Windsurf is simple but limited

Windsurf's 12 events cover the basics but lack context injection (no way to send feedback to the model), input modification, session lifecycle events, and sub-agent events. The inability to feed hook output back to the model is the biggest gap for automated quality enforcement.

### 6. GitHub Copilot spans three runtimes

Copilot hooks work across cloud agent, VS Code, and CLI, but capabilities differ by runtime. The cloud agent is the most limited (ephemeral sandbox, no user interaction, no permission events). The dual payload format (camelCase vs PascalCase) adds unnecessary complexity.

### 7. Git hooks remain complementary

Traditional git hooks are not replaced by AI agent hooks. They serve as the final quality gate at commit/push time. The recommended stack for a team using AI coding agents is:

1. **AI agent hooks** (PostToolUse/afterFileEdit) — per-edit lint/format during the session
2. **Git pre-commit** (lint-staged or Lefthook) — lint/format on staged files at commit time
3. **Git pre-push** (Lefthook) — typecheck + test suite before push
4. **CI** — full verification on PR

### 8. The "lint on every edit" pattern

The most common hook pattern across all tools is: match file-edit events, extract the file path, run a formatter (Prettier, ESLint --fix, ruff). This gives agents instant feedback when their edits break style rules. Example for Claude Code:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "file=$(echo $ARGUMENTS | jq -r '.tool_input.file_path'); npx prettier --write \"$file\" 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}
```

### 9. What's missing everywhere

No tool currently offers:
- **Aggregated changed-file lists** across a full turn (each PostToolUse fires independently per tool call).
- **Semantic diff analysis** in hooks (hooks see raw file paths and edit strings, not AST-level changes).
- **Built-in test-runner integration** (teams must write their own hook scripts to run tests).
- **Hook result caching** (running ESLint on the same file multiple times in one turn is wasteful).
