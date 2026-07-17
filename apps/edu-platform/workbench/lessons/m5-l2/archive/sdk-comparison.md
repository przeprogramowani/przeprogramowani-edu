# Agent SDK Comparison — Claude · Codex · Cursor · OpenRouter · Vercel AI SDK

> Synthesized 2026-06-08 from the research notes in this folder
> (`claude-sdk.notes.md`, `codex-sdk.notes.md`, `cursor-sdk.notes.md`,
> `openrouter-agent-sdk.notes.md`, `vercel-ai-sdk.notes.md`). Each criterion
> below pairs a **theory** lens (the conceptual question it answers) with a
> **practical example** (what it looks like in code or config). Beta surfaces
> shift — verify exact syntax against live docs before quoting in lesson material.
>
> **Vercel AI SDK 6** was added after the original four. The 20 criteria below
> were written for the first four; Vercel is folded into the framing, the
> at-a-glance matrix, and a dedicated **addendum** at the end rather than threaded
> into every bullet — read those three places for the Vercel view.

## The one distinction that frames everything

Before the criteria: these SDKs split into **two categories** that are easy
to conflate but answer different problems.

- **Ready-made-agent SDKs** — *Claude Agent SDK, Codex SDK, Cursor SDK.* They ship a full
  coding agent assembled for you: file read/write/edit, bash, sandboxing, codebase indexing, the
  whole agent loop — all wired into a working harness. You hand them a *goal* ("fix the auth bug") and they do
  human-like work on a filesystem. **Vendor-locked** to that vendor's models and
  runtime.
- **Assemble-it-yourself SDKs** — *OpenRouter Agent SDK and Vercel AI SDK 6.* They give
  you the *mechanics* of an agent loop (call model → run tool → append result →
  repeat → stop) plus mounting points, but ship **no built-in coding harness** — you assemble
  it. You bring the tools;
  they bring the loop and a model-agnostic interface. **Provider-agnostic.**
  OpenRouter leads with its gateway (**400+ models**, fallback routing, cost
  ceilings); Vercel leads with the **de-facto TS standard** `ToolLoopAgent` +
  `tool()` surface and the broad provider-package ecosystem.

Almost every difference below is a consequence of which category an SDK sits in.
"Which is best?" is the wrong question; "do I want a coding agent or an agent
framework?" is the right one.

---

## Comparison criteria

### 1. Vendor positioning & lineage

- **Theory:** What product is this the programmatic face of? An SDK that
  externalizes an existing tool inherits that tool's strengths and lock-in.
- **Practical:**
  - Claude → the same harness that powers **Claude Code** (renamed Claude Code
    SDK → Claude Agent SDK, Sept 2025).
  - Codex → the same agent behind the **Codex CLI / IDE / Web**.
  - Cursor → the same runtime/harness/models behind the **Cursor IDE** (incl.
    Composer 2), released public beta Apr 28 2026.
  - OpenRouter → a layer on top of OpenRouter's **model gateway**; not tied to
    any one IDE/CLI.

### 2. Execution / transport architecture

- **Theory:** *Where does the agent loop actually run, and how does your code
  talk to it?* This drives latency, debuggability, and operational footprint.
- **Practical:**
  - **Claude** — library running the loop **in your own process**, on **your**
    filesystem; bundles a native Claude Code binary as an optional dep. Session
    state is JSONL on your disk.
  - **Codex** — **wraps the `codex` CLI as a subprocess** and exchanges **JSONL
    over stdin/stdout**. The CLI does the heavy lifting; the SDK is a typed
    control layer. *Requires the CLI runtime present.*
  - **Cursor** — TS SDK talks to the **Cloud Agents REST API** (`/v1/agents`);
    can run **local** (in-process on your machine) or **cloud** (sandboxed VM).
  - **OpenRouter** — plain HTTP calls to the OpenRouter gateway; the loop runs in
    your process, no subprocess or bundled binary.

### 3. Model coverage

- **Theory:** *Locked to one vendor's models, or swappable?* Determines vendor
  risk, A/B ability, and cost arbitrage.
- **Practical:**
  - Claude → Anthropic models (routable via Bedrock / Vertex / Azure Foundry).
  - Codex → OpenAI models, per thread (`model="gpt-5.4"`).
  - Cursor → every model available in Cursor (`model: { id: "composer-2" }`,
    `"gpt-5.5"`, …).
  - **OpenRouter → 400+ models across providers, same code:**
    `model: 'anthropic/claude-sonnet-4'` ↔ `'openai/gpt-5-nano'`, plus
    `models: [...]` fallback routing.

### 4. Languages

- **Theory:** Does it fit your stack?
- **Practical:** Claude → **TS + Python** (3.10+). Codex → **TS + Python**
  (Node 18+, Py 3.10+). Cursor → **TS only**. OpenRouter → **TS-first**, Python
  available (Go exists for the *Client* SDKs, not the agent layer).

### 5. Core API shape (the entry point you actually write)

- **Theory:** How is a "conversation" modeled — a stream, a thread, a durable
  object, or a single call?
- **Practical:**

  ```python
  # Claude — async generator of typed messages
  async for message in query(prompt="Find and fix the bug in auth.py",
      options=ClaudeAgentOptions(allowed_tools=["Read","Edit","Bash"])):
      print(message)
  ```
  ```typescript
  // Codex — explicit thread + run/turn objects
  const codex = new Codex();
  const thread = codex.startThread();
  const result = await thread.run("Diagnose and fix the CI failures");
  ```
  ```typescript
  // Cursor — durable Agent + per-prompt run handles
  const agent = await Agent.create({ apiKey, model: { id: "composer-2" },
                                     local: { cwd: process.cwd() } });
  const run = await agent.send("Summarize this repository");
  for await (const event of run.stream()) { console.log(event); }
  ```
  ```typescript
  // OpenRouter — one function, the loop is inside it
  const result = openrouter.callModel({ model: 'openai/gpt-5-nano',
                                        input: 'What is the capital of France?' });
  console.log(await result.getText());
  ```

  Mental shorthand: **Claude = message stream**, **Codex = thread+turn**,
  **Cursor = durable agent + runs**, **OpenRouter = `callModel` loop**.

### 6. State / session persistence

- **Theory:** Can you stop, lose the in-memory object, and resume a long job?
- **Practical:**
  - Claude → capture `session_id` from the `init` message; `resume=session_id`,
    or **fork** to branch. JSONL on disk.
  - Codex → threads persist to **`~/.codex/sessions`**; `resumeThread(threadId)`.
  - Cursor → **durable agents** have stable identity; re-attach with
    `Agent.getRun(runId, {...})`, `.wait()` or `.stream()`. Run state lives
    server-side.
  - OpenRouter → `sessionId` is a tracking field; **state is automatic within a
    `callModel` loop** but there's no built-in long-term thread store like the
    ready-made-agent SDKs (you own persistence across calls).

### 7. Built-in tools / out-of-the-box capability

- **Theory:** How much agent do you get for free vs. assemble yourself?
- **Practical:**
  - **Claude** — 14+ built-ins (Read, Write, Edit, Bash, Glob, Grep, WebSearch,
    WebFetch, Monitor, AskUserQuestion, …). Nothing to implement.
  - **Codex** — full coding agent (plan, edit, run commands) inside the CLI
    runtime; you drive it, you don't build the tools.
  - **Cursor** — full coding harness **plus codebase indexing, semantic search,
    instant grep** baked in — the differentiator vs a raw loop.
  - **OpenRouter** — **none** out of the box; you define every tool. This is the
    cost of being provider-agnostic.

### 8. Custom tool definition

- **Theory:** How do you extend the agent with your own capabilities?
- **Practical:**
  - OpenRouter has the richest **first-class** tool layer — `tool()` with **Zod**
    schemas, full type inference, and four modes:

    ```typescript
    const weatherTool = tool({
      name: 'get_weather',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temperature: 72, condition: 'sunny' }),
    });
    ```
    Modes: `ToolWithExecute`, `ToolWithGenerator` (`eventSchema`), `ManualTool`
    (`execute: false`), `HITLTool` (`onToolCalled` / `onResponseReceived`).
  - Claude / Cursor extend mainly via **MCP servers** and custom tool config.
  - Codex extends via CLI config; tooling is the CLI's, not a per-call schema API.

### 9. Sandboxing & permissions

- **Theory:** How is blast radius controlled — what can the agent touch?
- **Practical:**
  - **Codex** — explicit per-turn presets: `Sandbox.read_only`,
    `Sandbox.workspace_write`, `Sandbox.full_access`. A thread can **plan in
    read-only, then apply in workspace-write.**
  - **Claude** — `allowed_tools` pre-approves safe ops; `permission_mode` (e.g.
    `acceptEdits`) governs edit auto-approval; **hooks** can block/transform.
  - **Cursor** — runtime *is* the sandbox: **cloud** = strongly-sandboxed VM per
    agent; **self-hosted** = your network; **local** = your machine.
  - **OpenRouter** — no filesystem sandbox concept (no built-in FS tools); you
    sandbox your own tool `execute` functions.

### 10. Streaming model

- **Theory:** How do you observe intermediate progress for UIs and logs?
- **Practical:**
  - Claude → the `query()` generator *is* the stream (typed messages).
  - Codex → `runStreamed()` → events incl. `item.completed`, `turn.completed`
    (carries token **usage**). Buffered `run()` when you only need the final.
  - Cursor → `run.stream()` locally; **SSE** over REST (`status`, `assistant`,
    `thinking`, `tool_call`, `result`, `done`, `heartbeat`…), resumable via
    `Last-Event-ID`.
  - **OpenRouter** — richest read surface: one `ModelResult` you can **stream,
    extract, and process concurrently** — `getTextStream()`,
    `getReasoningStream()`, `getItemsStream()`, `getToolCallsStream()`,
    `getFullResponsesStream()`.

### 11. Structured output

- **Theory:** Can you force a typed/JSON result instead of free text?
- **Practical:**
  - **Codex** — first-class `outputSchema` (JSON Schema, or Zod via
    `zod-to-json-schema` `target: "openAi"`).
  - **OpenRouter** — `outputSchema` on tools; typed via Zod + `InferToolOutput`.
  - **Claude** — leans on tools/prompting (no single dedicated knob).
  - **Cursor** — not surfaced as a primary feature in the notes.

### 12. Subagents / delegation

- **Theory:** Can the agent spin up focused helpers for context isolation /
  parallelism?
- **Practical:** Claude → `agents` / `AgentDefinition`, invoked via the `Agent`
  tool, messages tagged with `parent_tool_use_id`. Cursor → `customSubagents`
  (named, own prompt + model) in the REST create call. Codex / OpenRouter → not a
  headline feature.

### 13. MCP (external tool/data connection)

- **Theory:** Standardized plug for DBs, browsers, APIs.
- **Practical:** Claude → `mcp_servers` / `mcpServers` (e.g. Playwright). Cursor →
  `mcpServers` over **stdio or HTTP**. Codex / OpenRouter → not emphasized
  (OpenRouter expects you to wire tools directly).

### 14. Hooks / lifecycle interception

- **Theory:** Inject policy, audit, or guardrails mid-loop.
- **Practical:** Claude → lifecycle hooks (`PreToolUse`, `PostToolUse`, `Stop`,
  `SessionStart/End`, `UserPromptSubmit`) with tool matchers (`Edit|Write`).
  Cursor → `.cursor/hooks.json`, works across cloud/self-hosted/local.
  OpenRouter → HITL hooks at the *tool* level. Codex → CLI config, not a hooks API.

### 15. Deployment runtime / topology

- **Theory:** Where does the work physically execute, and who manages it?
- **Practical:**
  - Claude → your process (local/CI). For hosted long-running async, Anthropic
    points to **Managed Agents** (separate hosted REST product).
  - Codex → wherever the CLI runs (your CI box / machine).
  - **Cursor → the standout: three runtimes —** Cloud (VM, auto-PR),
    Self-hosted (your workers), Local. You can start headless then **take over in
    the IDE**.
  - OpenRouter → your process; deployment is yours.

### 16. Human-in-the-loop / approval gates

- **Theory:** Pause for a human "approve before running" decision.
- **Practical:** **OpenRouter** is the most explicit: `HITLTool` (`onToolCalled` /
  `onResponseReceived`) or `ManualTool` (`execute: false`) to pause the loop.
  Claude → `AskUserQuestion` tool + permission prompts. Codex/Cursor → via
  sandbox/permission gating rather than a dedicated HITL primitive.

### 17. Loop control / cost & step ceilings

- **Theory:** How do you stop a runaway agent — by steps, tokens, or dollars?
- **Practical:** **OpenRouter** is unique here with composable `stopWhen`:
  `stepCountIs(n)`, `hasToolCall(name)`, `maxTokensUsed(n)`, **`maxCost(amount)`**,
  `finishReasonIs(reason)`, plus custom conditions over step history. The harness
  SDKs rely on automatic context management / compaction (Claude) rather than
  explicit dollar ceilings.

### 18. Authentication

- **Theory:** What credential, and can you resell access?
- **Practical:**
  - Claude → `ANTHROPIC_API_KEY` (+ Bedrock/Vertex/Azure routing). **Reselling
    claude.ai login/limits is restricted** without approval.
  - Codex → rides on the **local Codex install's auth** (injects a
    `CODEX_API_KEY`-style credential into the spawned CLI).
  - Cursor → `CURSOR_API_KEY` env (user or service-account key); REST accepts
    **Basic + Bearer**; `/v1/sub-tokens` for self-hosted worker tokens.
  - OpenRouter → OpenRouter API key (one key → all providers).

### 19. Maturity & versioning discipline

- **Theory:** How stable is the contract you're coding against?
- **Practical:**
  - Claude → established; **TypeScript V2 preview** drops async-generator
    coordination for `send()`/`stream()`. **Billing change 2026-06-15:** SDK
    usage on subscription plans draws a separate monthly Agent SDK credit.
  - Codex → SDK **pinned in lockstep** to the matching `@openai/codex` CLI
    version (`0.137.0` at writing); **upgrade both together** or the JSONL
    contract breaks.
  - Cursor → **public beta** (Apr 2026); pin versions, expect surface shift.
  - OpenRouter → newer; verify package split (`@openrouter/agent` vs
    `@openrouter/sdk`) and `input:` vs `messages:` form against live docs.

### 20. Best-fit use cases

- **Claude** — production agents needing a battle-tested coding harness in your
  own process; research/email/general agentic workflows; prototype local → scale
  to Managed Agents.
- **Codex** — CI/CD automation, internal tooling, embedding Codex in your app
  where you already live in the OpenAI/Codex ecosystem and want sandbox presets.
- **Cursor** — turning a coding agent into **deployable infrastructure**: CI
  auto-PR bots, parallel cloud agents, internal agent platforms, with IDE
  takeover.
- **OpenRouter** — provider-agnostic agents where **model choice, fallback
  routing, and hard cost/step ceilings** matter more than a built-in coding
  harness; A/B-ing models behind stable agent code.
- **Vercel AI SDK 6** — provider-agnostic agents in a **TS/Next.js** codebase
  where you want the ecosystem-standard `ToolLoopAgent` + `tool()` surface,
  first-class UI streaming, and optional one-line routing via the AI Gateway —
  again, you supply the tools (no coding harness).

---

## At-a-glance matrix

| Criterion | Claude Agent SDK | Codex SDK | Cursor SDK | OpenRouter Agent SDK | Vercel AI SDK 6 |
|---|---|---|---|---|---|
| Category | Ready-made | Ready-made | Ready-made | Assemble-it-yourself | Assemble-it-yourself |
| Vendor | Anthropic | OpenAI | Cursor | OpenRouter (multi) | Vercel (multi) |
| Architecture | In-process lib + bundled binary | Wraps `codex` CLI (JSONL/stdio) | TS SDK → Cloud REST; local/cloud | HTTP to gateway, in-process | In-process lib, direct-to-provider (opt. Gateway) |
| Models | Anthropic (+cloud routing) | OpenAI per-thread | All Cursor models | **400+, swappable** | Any via provider pkgs / Gateway |
| Languages | TS + Python | TS + Python | TS only | TS (+Python) | TS/JS only |
| Entry point | `query()` generator | `thread.run()` / `runStreamed()` | `Agent.create` + `agent.send` | `callModel()` | `new ToolLoopAgent().generate()/.stream()` |
| Sessions | `session_id` resume/fork | `~/.codex/sessions` resume | Durable agents + run handles | Manual across calls | Manual (you persist messages) |
| Built-in tools | 14+ (FS, bash, web…) | Full CLI agent | Full + codebase indexing | **None — you bring them** | **None — you bring them** |
| Custom tools | MCP / config | CLI config | MCP / config | **`tool()` + Zod, 4 modes** | **`tool()` + Zod, `needsApproval`** |
| Sandbox | allowed_tools / perms | **read_only/workspace/full per turn** | VM / self-host / local | Your own `execute` | Your own `execute` |
| Structured output | Tools/prompting | **`outputSchema`** | — | `outputSchema` + Zod | **`generateObject` / `Output`** |
| Subagents | ✅ AgentDefinition | — | ✅ customSubagents | — | Pattern (agent-in-a-`tool()`) |
| MCP | ✅ | — | ✅ (stdio/HTTP) | — | ✅ |
| Hooks | ✅ lifecycle | CLI config | ✅ `.cursor/hooks.json` | Tool-level HITL | `prepareStep` + `needsApproval` HITL |
| Runtimes | Your process (+Managed) | CLI host | **Cloud/Self-host/Local** | Your process | Your process / serverless |
| Cost/step ceilings | Auto compaction | — | — | **`maxCost`/`stepCountIs`/…** | `stepCountIs` (default 20); cost = custom |
| Maturity | Established (+V2 preview) | Lockstep w/ CLI | Public beta | Newer | **Stable (v6, Dec 2025)** |

---

## Reading the matrix: decision shortcuts

1. **Want a coding agent that edits a real filesystem?** → ready-made-agent SDK. Pick by
   ecosystem: Anthropic → Claude, OpenAI/Codex → Codex, Cursor stack or need
   cloud-VM/auto-PR fleets → Cursor.
2. **Want model choice open + hard cost ceilings?** → OpenRouter. It's the only
   one with built-in `maxCost`/fallback routing and 400+ models behind one call —
   but you supply the tools.
3. **Building in TypeScript/Next.js and want the standard agent framework?** → Vercel AI SDK
   6. The most idiomatic TS agent surface, best UI-streaming story, stable since
   Dec 2025 — but it lacks named cost-stop conditions (write a custom
   `StopCondition`) and persists nothing for you.
4. **Operational fit often decides over features:** Codex *requires the CLI
   present* and moves in lockstep versions; Cursor is *beta* and cloud-first;
   Claude runs *in your process* with a separate Managed Agents product for hosted
   scale; OpenRouter and Vercel both leave *persistence and tooling to you*.

---

## Addendum: Vercel AI SDK 6 across the criteria

Added 2026-06-08 from `vercel-ai-sdk.notes.md`. Vercel is an **assemble-it-yourself SDK**
in the same category as OpenRouter — the contrasts that matter are vs. OpenRouter
(its closest peer) and vs. the ready-made-agent SDKs.

- **Lineage & architecture (1–2):** open-source `ai` package (**Apache-2.0**,
  confirmed from repo LICENSE + npm), runs in **your process**, talks **directly
  to the provider** you import (`@ai-sdk/openai`, `@ai-sdk/anthropic`,
  `@ai-sdk/google`, …). No bundled binary, no subprocess. Passing a plain
  `creator/model-name` string instead routes through the optional **AI Gateway**
  (`@ai-sdk/gateway`) by default — the only path where Vercel sits in the data flow.
- **Models & languages (3–4):** provider-agnostic via a unified `LanguageModel`
  interface; **TS/JS only** (no Python, unlike Claude/Codex/OpenRouter).
- **Entry point (5):** `new ToolLoopAgent({ model, instructions, tools, stopWhen, … })`
  then `.generate()` (→ `text`, `steps`, `toolCalls`, `usage`) or `.stream()`
  (→ `textStream`, `fullStream`). `Agent` is the v6 *interface*; `ToolLoopAgent`
  is the official class. Tools are a **record**, not an array.
- **Tools (8):** `tool()` + **Zod** with v6's `inputSchema` (renamed from v5
  `parameters`), typed `execute` inference, optional `outputSchema`, and a native
  **`needsApproval`** flag for human-in-the-loop. Sub-agents are a *pattern*
  (wrap a `ToolLoopAgent` inside a `tool()`), not a first-class class.
- **Loop control (17):** built-ins are `stepCountIs(n)` (default cap **20**),
  `hasToolCall(name)`, `isLoopFinished()`; arrays OR together. **No named
  `maxCost`/`maxTokensUsed`/`finishReasonIs`** like OpenRouter — those require a
  custom `StopCondition`. This is the sharpest functional gap vs. OpenRouter.
- **Structured output (11):** strong — `generateObject` / `Output` are
  first-class, arguably cleaner than the others.
- **Streaming (10):** best-in-class **UI streaming** story (`streamText`,
  `fullStream`, framework helpers) — the reason most TS/Next.js teams already
  reach for it.
- **Sessions/runtimes (6, 15):** persists **nothing** for you (you store the
  message history); runs in your process or serverless. Same "you own
  persistence" posture as OpenRouter.
- **Maturity (19):** **v6 stable**, published 2025-12-22 (`ai@6.0.x`); minor
  breaking changes from v5 (codemod `npx @ai-sdk/codemod v6`). v7 already in
  canary, but v6 is current stable — the most production-settled of the
  assemble-it-yourself options.
- **Vercel vs OpenRouter in one line:** same category, different center of
  gravity — **OpenRouter** wins on gateway routing + built-in cost ceilings + 400+
  models + Python; **Vercel** wins on TS idiom, UI streaming, structured output,
  and being the ecosystem default.

---

### Side-effect ledger

```text
New claims introduced: Vercel AI SDK 6 added as a fifth SDK (assemble-it-yourself category) — folded into framing, matrix, decision shortcuts, and a dedicated addendum. All Vercel claims sourced from vercel-ai-sdk.notes.md.
Claims removed: (none)
Neighboring lesson references changed: (none)
Prework references used: (none)
Prework concepts repeated intentionally: (none)
Potential duplicates: (none)
Unsupported facts: Cursor structured-output support not covered in source notes (left blank, not inferred); OpenRouter Go support is for Client SDKs only. Vercel: license CONFIRMED Apache-2.0 (repo LICENSE + npm); helper-name casings (createAgentUIStreamResponse, Output.object) confirmed against docs — prior [unverified] flags cleared in the 2026-06-08 verification pass.
Video/text mismatches: (n/a)
Needs human decision: Whether this artifact should feed a specific 10xDevs lesson — currently a standalone 5x2 research synthesis, not wired to lessons-schema.json. The 20 numbered criteria still describe only the original four inline; revisit if a full 5-column rewrite is wanted instead of the addendum approach.
```
