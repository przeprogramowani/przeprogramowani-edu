# Claude Agent SDK — Research Notes

> Web research compiled 2026-06-08. Sources listed at the bottom.

## What it is

The **Claude Agent SDK** is Anthropic's library for building production AI agents — it
exposes "the same tools, agent loop, and context management that power Claude Code,"
programmable in **Python** and **TypeScript**. Instead of implementing your own tool
loop against the raw API, you hand Claude a goal and it autonomously reads files, runs
commands, searches the web, edits code, and verifies its own work.

- **Rename:** Formerly the *Claude Code SDK*; renamed to *Claude Agent SDK* in
  **September 2025**. The rename signals that the harness built for a coding tool is
  general enough to power any agentic workflow (research, email, note-taking, video, etc.).
- **Packages:**
  - TypeScript — `@anthropic-ai/claude-agent-sdk` (`npm install @anthropic-ai/claude-agent-sdk`)
  - Python — `claude-agent-sdk` (`pip install claude-agent-sdk`, requires Python **3.10+**)
- The TypeScript package **bundles a native Claude Code binary** as an optional
  dependency, so Claude Code does not need to be installed separately.

## Design philosophy

Core principle: **give the agent a computer** so it can work the way a human does. This
produces a three-stage feedback loop the SDK is built around:

1. **Gather context** — agentic search (grep/tail via bash), optional semantic/vector
   search, subagents for context isolation, automatic compaction near token limits.
2. **Take action** — built-in + custom tools, bash, code generation, MCP integrations.
3. **Verify work** — rule-based checks (lint/validation), visual feedback for UI,
   LLM-as-judge for fuzzy criteria.

Anthropic's production guidance: evaluate agents by asking whether they're *missing
information*, *lacking tools*, or *unable to self-correct*; build a representative test
set and iterate.

## Core API shape

The primary entry point is a **`query()`** function returning an **async generator** that
yields typed messages as the agent works.

```python
# Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        print(message)

asyncio.run(main())
```

```typescript
// TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

> **TypeScript V2 (preview):** removes the need for async generators / `yield`
> coordination. Multi-turn conversations become a sequence of `send()`/`stream()`
> cycles instead of managing generator state across turns.

## Built-in tools (14+)

Available out of the box — no tool execution to implement yourself:

| Tool | Purpose |
|------|---------|
| **Read** | Read any file in the working directory |
| **Write** | Create new files |
| **Edit** | Precise edits to existing files |
| **Bash** | Run terminal commands, scripts, git |
| **Monitor** | Watch a background script, react to each output line as an event |
| **Glob** | Find files by pattern (`**/*.ts`) |
| **Grep** | Regex search of file contents |
| **WebSearch** | Search the web for current info |
| **WebFetch** | Fetch + parse a web page |
| **AskUserQuestion** | Ask the user a multiple-choice clarifying question |

## Key capabilities

- **Hooks** — run custom callbacks at lifecycle points to validate/log/block/transform
  behavior. Events include `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`,
  `SessionEnd`, `UserPromptSubmit`, and more. Matchers (e.g. `Edit|Write`) scope hooks to
  specific tools. Useful for audit logging, guardrails, and policy enforcement.
- **Subagents** — spawn specialized agents for focused subtasks; the main agent delegates
  and they report back. Defined via `agents` / `AgentDefinition` (description, prompt,
  scoped tools). Invoked through the `Agent` tool (include `Agent` in allowed tools to
  auto-approve). Messages carry `parent_tool_use_id` to track which subagent produced them.
  Good for parallelization and context isolation.
- **MCP (Model Context Protocol)** — connect external systems (databases, browsers, APIs,
  hundreds of community servers). Configured via `mcp_servers` / `mcpServers` (e.g. the
  Playwright MCP server for browser automation).
- **Permissions** — control which tools the agent can use. `allowed_tools`/`allowedTools`
  pre-approves safe operations (e.g. read-only `Read`/`Glob`/`Grep`); sensitive actions can
  require approval. `permission_mode` (e.g. `acceptEdits`) controls edit auto-approval.
- **Sessions** — context persists across exchanges (files read, analysis done, history).
  Capture the `session_id` from the `init` system message, then **resume** with
  `resume=session_id`, or **fork** a session to explore alternatives.
- **Context management** — automatic compaction when the conversation nears its limit,
  and re-reading of `CLAUDE.md` instruction files after compaction.

## Claude Code filesystem config (also honored by the SDK)

Loaded by default from `.claude/` in the working dir and `~/.claude/`; restrict with
`setting_sources` / `settingSources`.

| Feature | Location |
|---------|----------|
| **Skills** (auto or `/name`) | `.claude/skills/*/SKILL.md` |
| **Commands** (legacy; prefer skills) | `.claude/commands/*.md` |
| **Memory** | `CLAUDE.md` or `.claude/CLAUDE.md` |
| **Plugins** (skills/agents/hooks/MCP) | programmatic via `plugins` option |

## Authentication

- Default: `ANTHROPIC_API_KEY` env var (key from the Console).
- Cloud routing also supported:
  - Amazon Bedrock — `CLAUDE_CODE_USE_BEDROCK=1`
  - Claude Platform on AWS — `CLAUDE_CODE_USE_ANTHROPIC_AWS=1` + `ANTHROPIC_AWS_WORKSPACE_ID`
  - Google Vertex AI — `CLAUDE_CODE_USE_VERTEX=1`
  - Microsoft Azure AI Foundry — `CLAUDE_CODE_USE_FOUNDRY=1`
- **Restriction:** third-party developers are *not* allowed (unless approved) to offer
  claude.ai login/rate limits for products built on the SDK — use API-key auth methods.

## How it compares to other Claude tools

- **vs. Anthropic Client SDK** — the Client SDK gives raw API access where *you* implement
  the tool loop (`while stop_reason == "tool_use": …`). The Agent SDK runs that loop for
  you with built-in tool execution.
- **vs. Claude Code CLI** — same capabilities, different interface. CLI for interactive /
  one-off dev; SDK for CI/CD, custom apps, production automation. Workflows translate
  directly; many teams use both.
- **vs. Managed Agents** — Managed Agents is a *hosted REST API*: Anthropic runs the agent
  and a per-session sandbox, you send events and stream results. The Agent SDK is a
  *library* running the loop **in your own process**, working on **your** filesystem, with
  session state as **JSONL on your filesystem**. Common path: prototype locally with the
  Agent SDK, then move to Managed Agents for production / long-running async sessions.

## Practical notes & gotchas

- **Billing change:** Starting **June 15, 2026**, Agent SDK and `claude -p` usage on
  *subscription plans* draws from a **new monthly Agent SDK credit**, separate from
  interactive usage limits.
- **Branding:** Partners may say "Claude Agent", "Claude", or "{YourName} Powered by
  Claude". *Not* permitted: "Claude Code" / "Claude Code Agent" or Claude Code-mimicking
  visuals. Your product should keep its own branding.
- **License:** governed by Anthropic's Commercial Terms of Service.
- **Example agents:** `anthropics/claude-agent-sdk-demos` (email assistant, research agent, …).

## Sources

- [Agent SDK overview — Claude docs](https://code.claude.com/docs/en/agent-sdk/overview)
- [Quickstart — Claude docs](https://platform.claude.com/docs/en/agent-sdk/quickstart)
- [TypeScript SDK reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [TypeScript SDK V2 preview](https://platform.claude.com/docs/en/agent-sdk/typescript-v2-preview)
- [Building agents with the Claude Agent SDK — Anthropic engineering blog](https://claude.com/blog/building-agents-with-the-claude-agent-sdk)
- [claude-agent-sdk-python (GitHub)](https://github.com/anthropics/claude-agent-sdk-python)
- [claude-agent-sdk-typescript (GitHub)](https://github.com/anthropics/claude-agent-sdk-typescript)
- [@anthropic-ai/claude-agent-sdk (npm)](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
