# Cursor SDK — Research Notes

> Web research compiled 2026-06-08. Primary sources: Cursor official blog, changelog, and docs. Secondary: vendor-neutral writeups (MarkTechPost, DevOps.com, Composio, Kingy AI). Verify exact syntax against `cursor.com/docs` before quoting in lesson material — the SDK is in public beta and surfaces may still shift.

## TL;DR

- **What it is:** A TypeScript SDK (`@cursor/sdk`) that lets you create, run, and manage Cursor's coding agents from your own code, scripts, CI/CD, or products — without the IDE. It turns Cursor's interactive agent into headless, deployable infrastructure.
- **Released:** April 28, 2026, in **public beta** for all users.
- **Same stack as the IDE:** Agents run on the same runtime, harness, and models that power Cursor (incl. Composer 2). Not a raw LLM wrapper — it ships the full supporting infrastructure (codebase indexing, semantic search, MCP, skills, hooks).
- **Two surfaces:** (1) the **TypeScript SDK** for in-process use; (2) the **Cloud Agents REST API** (`/v1/agents`) the SDK talks to, also usable directly.
- **Pricing:** Standard token-based consumption pricing (same as Cursor usage). No separate SDK fee.

## Installation & auth

```bash
npm install @cursor/sdk
```

- Auth via `CURSOR_API_KEY` environment variable (user API key or service account key from the Cursor Dashboard).
- REST API accepts **Basic and Bearer** authentication.
- Cursor exposes a native `/sdk` skill inside Cursor for in-editor guidance while building.

## Core TypeScript API

### Local agent

```typescript
import { Agent } from "@cursor/sdk";

const agent = await Agent.create({
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: "composer-2" },
  local: { cwd: process.cwd() },
});

const run = await agent.send("Summarize what this repository does");

for await (const event of run.stream()) {
  console.log(event);
}
```

### Cloud agent (sandboxed VM, auto-PR)

```typescript
const agent = await Agent.create({
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: "gpt-5.5" },
  cloud: {
    repos: [{ url: "https://github.com/cursor/cookbook", startingRef: "main" }],
    autoCreatePR: true,
  },
});

const run = await agent.send("Fix the auth token expiry bug");
console.log(`Started ${run.id}`);

const result = await (
  await Agent.getRun(run.id, { runtime: "cloud", agentId: run.agentId })
).wait();
console.log(result.git?.branches[0]?.prUrl);
```

### Key API shapes (from examples)

- `Agent.create({ apiKey, model, local | cloud })` → durable agent.
- `agent.send(prompt)` → starts a **run** (per-prompt execution unit); returns a run handle with `.id` and `.agentId`.
- `run.stream()` → async iterable of events.
- `Agent.getRun(runId, { runtime, agentId })` → re-attach to a run; `.wait()` blocks to terminal state, `.stream()` to follow live.
- `model: { id: "..." }` — every model supported in Cursor is available (Composer 2, GPT-5.5, etc.). `model.params` shape is shared between SDK and REST API.

## Deployment runtimes

| Runtime | Where it runs | Use case |
|---|---|---|
| **Cloud** | Dedicated, strongly-sandboxed VM per agent | CI/CD, untrusted/parallel work, auto-PR flows |
| **Self-hosted** | Your own workers, inside your network | Keep code + tool execution private |
| **Local** | Your machine (`local: { cwd }`) | Fast iteration, dev loop |

You can start a task programmatically and then jump into the Cursor IDE to inspect progress or take over — durable agents bridge headless and interactive.

## Built-in capabilities (beyond a raw LLM call)

- **Context management:** codebase indexing, semantic search, instant grep — agent retrieves relevant context before generating code.
- **Subagents:** delegate subtasks to named subagents, each with its own prompt and model. Configured via `customSubagents` in the REST create call.
- **MCP servers:** connect external tools/data over **stdio or HTTP** (`mcpServers`).
- **Skills:** agent auto-picks up reusable skill definitions from the repo's `.cursor/skills/` directory.
- **Hooks:** observe, control, and extend the agent loop via `.cursor/hooks.json` — works across cloud, self-hosted, and local.

## Cloud Agents REST API (`/v1` unless noted)

The SDK was reworked around **durable agents** (stable identity) and **per-prompt runs** (execution). Follow-ups, status, streaming, and cancellation are all **run-scoped**.

### Agents

- `POST /v1/agents` — create agent. Body: `prompt` (text + optional images), optional `model`, `repos`, `env`, `mcpServers`, `customSubagents`, `autoCreatePR`, `mode`. Returns both the durable `agent` and the initial `run`.
- `GET /v1/agents` — list. Query: `limit` (default 20, max 100), `cursor`, `prUrl` filter, `includeArchived`. List items include only durable identity fields.
- `GET /v1/agents/{id}` — get agent metadata (execution status lives on runs, not here).

### Runs

- `POST /v1/agents/{id}/runs` — follow-up prompt. **Only one active run per agent** — calling while another is `CREATING`/`RUNNING` returns `409 agent_busy`.
- `GET /v1/agents/{id}/runs` — list runs (`limit`, `cursor`).
- `GET /v1/agents/{id}/runs/{runId}` — status, timestamps, `durationMs`, `result` text, pushed `git` branches/PRs for terminal runs.
- `GET /v1/agents/{id}/runs/{runId}/stream` — **SSE stream**. Event types: `status`, `assistant`, `thinking`, `tool_call`, `interaction_update`, `heartbeat`, `result`, `error`, `done`. Most events carry an opaque `id` line (don't parse it). Resume via `Last-Event-ID` header; retention window in the response header.
- `POST /v1/agents/{id}/runs/{runId}/cancel` — terminal; transitions to `CANCELLED`, not resumable.

### Artifacts

- `GET /v1/agents/{id}/artifacts` — paths relative to `artifacts/`.
- `GET /v1/agents/{id}/artifacts/download?path=...` — returns a temporary 15-minute presigned S3 URL.

### Lifecycle

- `POST /v1/agents/{id}/archive` — readable but rejects new runs; idempotent.
- `POST /v1/agents/{id}/unarchive` — idempotent.
- `DELETE /v1/agents/{id}` — **irreversible**; use archive for reversible removal.

### Workers / fleet (self-hosted)

- `POST /v1/sub-tokens` — create user-scoped worker token (needs service account key; valid 1 hour).
- `GET /v0/private-workers` — list workers (`status`: all/in_use/idle, `limit`, pagination).
- `GET /v0/private-workers/summary` — connected/in-use counts.
- `GET /v0/private-workers/pending-requests` — unassigned requests (repo-filtered for scoped keys).

### Metadata

- `GET /v1/me` — API key info.
- `GET /v1/models` — available model IDs/params/variants (`model.params` matches SDK shape).
- `GET /v1/repositories` — **very strict rate limits** (1/user/min, 30/user/hour).

## Run lifecycle states

Observed terminal/transitional states: `CREATING` → `RUNNING` → `result`/`done` (success), or `CANCELLED` (after cancel). `409 agent_busy` enforces single-active-run-per-agent serialization.

## Cookbook & starter projects

Cursor published a public **cookbook repo** on GitHub with four starters:

1. Minimal quickstart for local agents.
2. Web-based scaffolding tool.
3. Agent-powered kanban board that auto-opens PRs when cards move.
4. Terminal CLI for spawning agents from the command line.

## Real-world use cases (from announcements)

- CI/CD-triggered agents that summarize changes, root-cause CI failures, and push PR fixes.
- Internal/custom agent platforms (e.g. GTM teams querying product data without writing code).
- Parallel/background coding agents fanned out across sandboxed cloud VMs.

## Editorial angle for 10xDevs (notes-to-self)

- The hook for learners: Cursor crossed from "AI IDE" to "programmable agent infrastructure" — same mental model as Claude Agent SDK / OpenAI Agents, but with Cursor's indexing + harness baked in. Good comparison point against the Claude Code SDK already covered elsewhere.
- Strong demo candidates: local-agent quickstart (`Agent.create` + `agent.send` + `run.stream`), and the CI auto-PR cloud flow.
- **Unverified / needs a fresh docs check before teaching:** exact event payload schemas, full `Agent.create` option types, `mode` enum values, self-hosted worker setup steps, and current model ID list. The SDK is beta — pin versions in any example.

## Sources

- [Build programmatic agents with the Cursor SDK (official blog)](https://cursor.com/blog/typescript-sdk)
- [Cursor SDK release (changelog)](https://cursor.com/changelog/sdk-release)
- [Cloud Agents API — Endpoints (official docs)](https://cursor.com/docs/cloud-agent/api/endpoints)
- [Cursor SDK & Cloud Agents API updates (Cursor forum announcement)](https://forum.cursor.com/t/cursor-sdk-cloud-agents-api-updates/159284)
- [Cursor Introduces a TypeScript SDK… (MarkTechPost)](https://www.marktechpost.com/2026/04/29/cursor-introduces-a-typescript-sdk-for-building-programmatic-coding-agents-with-sandboxed-cloud-vms-subagents-hooks-and-token-based-pricing/)
- [Cursor's New SDK Turns AI Coding Agents Into Deployable Infrastructure (DevOps.com)](https://devops.com/cursors-new-sdk-turns-ai-coding-agents-into-deployable-infrastructure/)
- [How to build Agents with Cursor Agents SDK (Composio)](https://composio.dev/content/how-to-build-agents-with-cursor-agents-sdk)
- [Cursor SDK Review (Kingy AI)](https://kingy.ai/ai/cursor-sdk-review-cursors-coding-agent-becomes-programmable-infrastructure/)
