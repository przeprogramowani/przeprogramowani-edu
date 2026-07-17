# Vercel AI SDK 6 (Agent / `ToolLoopAgent`) — Research Notes

> Web research compiled 2026-06-08. Sources listed at the bottom.
> Focus: the `ai` package's v6 native **agent** abstraction (`ToolLoopAgent`),
> framed alongside the other agent-SDK notes in this workbench.

## What it is

The **AI SDK** is Vercel's `ai` package: a **provider-agnostic TypeScript toolkit**
for building AI-powered applications and agents. It is an open-source library that
runs **in your own process** — it is not a hosted service, a bundled binary, or a
coding harness. You import functions, call models, and run loops inside whatever
runtime you already have.

- **Package:** `ai` on npm. Latest published: **6.0.197** (npm `latest` tag at time
  of writing). **AI SDK 6 was published 2025-12-22** as a **stable** release.
- **License: Apache-2.0** — confirmed (checked 2026-06-08) across all three primary
  sources: the repo LICENSE file opens *"Copyright 2023 Vercel, Inc. Licensed under the
  Apache License, Version 2.0"* (https://raw.githubusercontent.com/vercel/ai/main/LICENSE),
  the `ai` package.json `license` field is `"Apache-2.0"`, and the npm registry `latest`
  metadata reports `Apache-2.0`. *(Not MIT — an earlier assumption; quote Apache-2.0 in
  the lesson.)*
- **Languages / frameworks:** TypeScript/JavaScript, framework-agnostic at the core.
  Officially supports Node.js, Next.js (App + Pages Router), React, Svelte, Vue (via
  Nuxt), and Expo. The README also lists Angular; the docs introduction page did not.
  **[minor source disagreement — Angular]**
- **Two layers:**
  - **AI SDK Core** — unified API for generating text, structured objects, tool calls,
    and **building agents** (`generateText`, `streamText`, `generateObject`,
    `ToolLoopAgent`, `tool`, …).
  - **AI SDK UI** — framework-agnostic hooks for chat / generative UI (the streaming
    front-end layer; out of scope for these agent notes).
- **v6 headline:** native agent support. The version bump primarily reflects adopting
  the **v3 Language Model Specification**; the announcement explicitly says it is
  "not expected to have major breaking changes for most users," with an automated
  codemod (`npx @ai-sdk/codemod v6`) for migration. **[verified]**

This is the same **category** as the OpenRouter Agent SDK: a **loop-primitive SDK**,
not a harness SDK. You bring the tools; the SDK runs the model→tool→model loop.

## `ToolLoopAgent` — the core focus

### Mental model

> "Agents are large language models (LLMs) that use **tools in a loop** to accomplish
> tasks." — AI SDK Agents docs

`ToolLoopAgent` is the **official, production-ready implementation** of that loop. It
"handles the complete tool execution loop: it calls the LLM with your prompt, executes
any requested tool calls, adds results back to the conversation, and repeats until
complete." The default safety ceiling is **20 steps** (`stopWhen: stepCountIs(20)`).

In v6, **`Agent` is an *interface*** (a contract with `generate()` and `stream()`),
and **`ToolLoopAgent` is the class that implements it.** You can write your own class
satisfying the `Agent` interface and it will integrate with every SDK utility that
expects an agent (e.g. the UI-stream helpers).

### Constructor / config shape

```typescript
import { ToolLoopAgent, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const agent = new ToolLoopAgent({
  // Core
  model: anthropic('claude-sonnet-4.5'),     // LanguageModel (required)
  instructions: 'You are a helpful research assistant.', // system prompt
  tools: { /* name -> tool() */ },           // Record<string, Tool>

  // Agent behavior
  toolChoice: 'auto',                        // 'auto' | 'required' | 'none' | specific tool
  stopWhen: stepCountIs(20),                 // StopCondition | StopCondition[]
  activeTools: undefined,                    // Array<string> — restrict tools per run
  // output: Output.object({ schema }),      // structured final output (see below)

  // Model params (all optional)
  maxOutputTokens: 4096,
  temperature: 0.7,
  topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed,

  // Hooks / advanced
  prepareStep: undefined,                    // PrepareStepFunction — per-step control
  onStepFinish: undefined,                   // called after each step
  onFinish: undefined,                       // called when the loop ends
  maxRetries: 2,
  providerOptions: undefined,                // provider-specific knobs
  headers: undefined,
  experimental_context: undefined,           // threaded into tool execute()
  experimental_telemetry: undefined,
  experimental_repairToolCall: undefined,    // ToolCallRepairFunction
});
```

Key options worth calling out:

- **`model`** — a `LanguageModel` (a provider instance like `anthropic('claude-sonnet-4.5')`,
  or a Gateway string like `'anthropic/claude-sonnet-4.5'`). Required.
- **`instructions`** — system prompt: `string | SystemModelMessage | SystemModelMessage[]`.
- **`tools`** — a **record** (object keyed by tool name), not an array. (Contrast with
  OpenRouter's `tools: [...]` array.)
- **`stopWhen`** — loop termination conditions (see below).
- **`prepareStep`** — a callback that runs **before each step** and can swap the model,
  rewrite messages, or change `activeTools` / `toolChoice` mid-loop (e.g. drop tools
  after the first step, or compact history to control context growth).
- **`output`** — declares a structured final result (see "Structured output").

### `.generate()` and `.stream()`

Both take `{ prompt }` *or* `{ messages }`, plus `abortSignal`, an optional `timeout`
(`number` or `{ totalMs?, stepMs?, chunkMs? }`), and `onStepFinish`.

**One-shot:**

```typescript
const result = await agent.generate({
  prompt: 'Summarize the latest changes in the repo and list open risks.',
});

console.log(result.text);   // final assistant text
console.log(result.steps);  // per-step history (each step: text, toolCalls, toolResults, usage, finishReason)
console.log(result.usage);  // aggregate token usage
```

`generate()` returns a **`GenerateTextResult`** — same shape `generateText()` returns:
`text`, `steps`, `toolCalls`, `toolResults`, `usage`, `finishReason`, `response`, etc.

**Streaming:**

```typescript
const result = await agent.stream({ prompt: 'Tell me a story about a debugger.' });

for await (const delta of result.textStream) {
  process.stdout.write(delta);
}
// result also exposes: steps, usage, fullStream, etc.
```

`stream()` returns a **`StreamTextResult`** (`textStream`, `fullStream`, `steps`,
`usage`, …). For UI, the docs show a `createAgentUIStreamResponse({ agent, uiMessages })`
helper to wire an agent straight into an AI SDK UI chat endpoint. **[verified — casing
`createAgentUIStreamResponse` confirmed on the Building Agents docs, checked 2026-06-08]**

**Step tracking:**

```typescript
await agent.generate({
  prompt: 'Research current trends.',
  onStepFinish: async ({ stepNumber, usage, finishReason, toolCalls }) => {
    console.log(`step ${stepNumber}`, {
      inputTokens: usage.inputTokens,
      finishReason,
      tools: toolCalls?.map((tc) => tc.toolName),
    });
  },
});
```

### How the tool loop terminates

Per the docs, the loop continues until **any** of:

1. the model returns a finish reason **other than tool-calls** (i.e. it answered),
2. a tool that was invoked **has no `execute` function** (manual/HITL handoff),
3. a tool call **needs approval** (`needsApproval`),
4. a **`stopWhen` condition** is met.

### `stopWhen` stop conditions

Imported from `ai`. Built-ins:

- **`stepCountIs(n)`** — stop after `n` steps (the default is `stepCountIs(20)`).
- **`hasToolCall(toolName)`** — stop once a specific tool is called.
- **`isLoopFinished()`** — "never triggers," letting the loop run until the model is
  naturally done (no artificial step cap).

Pass an **array** for OR semantics — execution stops when **any** condition is met:

```typescript
import { stepCountIs, hasToolCall } from 'ai';

stopWhen: [stepCountIs(20), hasToolCall('finalize')]
```

Custom `StopCondition` functions receive step history, so you can write arbitrary
termination logic.

> **Comparison to OpenRouter's `stopWhen`:** conceptually identical — both have
> `stepCountIs(n)` and `hasToolCall(name)` and accept arrays/custom predicates.
> OpenRouter additionally ships **`maxTokensUsed(n)`, `maxCost(amount)`, and
> `finishReasonIs(reason)`** out of the box (cost-based stopping fits OpenRouter's
> per-model pricing model). The AI SDK's documented built-ins are the three above;
> token/cost ceilings are achievable via a custom `StopCondition` rather than a named
> helper. **[built-in list verified against loop-control docs]**

### Agent vs raw `generateText` / `streamText`

`ToolLoopAgent` is **sugar over the same primitives**. You can run the identical loop
with `generateText`/`streamText` by passing `tools` and a `stopWhen` (in older v5 code
this knob was `maxSteps`; v6 standardizes on `stopWhen`). The agent class just
encapsulates config so it is reusable and consistent.

- **Use `ToolLoopAgent`** for: reusable agents shared across endpoints, consistent
  config/behavior, cleaner API routes, type-safe tool inference.
- **Use raw `generateText` / `streamText` + `tools` + `stopWhen`** for: one-off calls,
  bespoke loop logic, or when you don't want the abstraction.

## Tools: the `tool()` helper

Tools are defined with **`tool()`** from `ai`, using **Zod** (or JSON Schema) for the
input shape. The helper's whole job is to **infer the `execute` argument types from
`inputSchema`** — no manual typing.

```typescript
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

`tool()` config fields (selected):

- **`inputSchema`** — Zod or JSON Schema (required).
- **`execute`** — async fn receiving typed input; return value becomes the tool result.
- **`description`** — surfaced to the model.
- **`outputSchema`** — optional validation of the result.
- **`needsApproval`** — `boolean` or a function → **human-in-the-loop approval gate**.
- **`type`** — `'function'` (default) or `'provider-defined'` (provider-native tools).
- **`toModelOutput`**, `inputExamples`, `strict`, `onInputStart` / `onInputDelta` /
  `onInputAvailable` (streaming-input callbacks), `metadata`, `title`.

Tools attach to an agent as a **record**: `tools: { getWeather: weatherTool }`. Multi-step
tool calling is automatic — the model can call tools repeatedly across steps until a
`stopWhen` condition or a natural finish.

> **Naming note:** the field is **`inputSchema`** (same word OpenRouter's `tool()` uses).
> v5/older AI SDK code used `parameters`; v6 uses `inputSchema`. Don't mix them up in
> lesson code.

## Provider / model-agnostic design

The core value prop is a **unified `LanguageModel` interface**: write the agent once,
swap the model freely. Two ways to get a model:

1. **Direct provider packages** (talk straight to the provider):
   - `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google` (Google Generative AI),
     plus xAI Grok, Azure, Amazon Bedrock, Groq, and more.
   - `import { anthropic } from '@ai-sdk/anthropic'; const model = anthropic('claude-sonnet-4.5');`

2. **AI Gateway (optional routing layer):** the `@ai-sdk/gateway` provider (implements
   the `ProviderV4` interface) proxies to **Vercel AI Gateway**, giving access to
   OpenAI / Anthropic / Google / Meta / xAI / etc. through **one** interface with model
   strings like `'anthropic/claude-sonnet-4.5'` — no per-provider package installs.
   The npm description says you can "use the Vercel AI Gateway **or** go direct to…
   any other model provider," i.e. **the Gateway is optional**; without it the SDK
   talks directly to providers via their `@ai-sdk/*` packages.

Swapping models is just swapping the `model` value passed to the agent/function — the
tool definitions, loop, and `stopWhen` are unchanged.

## Capabilities

- **Streaming.** `streamText` / `agent.stream()` give token deltas (`textStream`) and a
  `fullStream` of step/tool/finish events; AI SDK UI adds framework hooks for chat UIs
  and a `createAgentUIStreamResponse` path for agents.
- **Structured output.** `generateObject` / `streamObject` for object generation, and
  for agents an **`output: Output.object({ schema })`** option that produces a
  type-validated final object **after** the tool loop. v6 unified `generateObject` and
  `generateText` so you can have a multi-step tool loop that ends in a structured
  result. **Gotcha:** the structured-output generation **counts as an extra step**, so
  bump your `stopWhen` accordingly. **[verified via docs/search]**
- **MCP.** v6 ships **full MCP support** in a stable **`@ai-sdk/mcp`** package — OAuth
  auth, resources, prompts, and elicitation — so MCP servers become tool sources.
- **Human-in-the-loop / tool approval.** Native via the **`needsApproval`** flag on a
  tool — "human-in-the-loop control with a single `needsApproval` flag, no custom code
  required." The loop pauses when a flagged tool is invoked; a tool defined without an
  `execute` also hands control back to your code.
- **Sub-agents / multi-agent.** Pattern, not a separate class: **a sub-agent is a
  `ToolLoopAgent` wrapped in a `tool()`** — the parent calls it like any other tool,
  the tool's `execute` runs the child agent and returns its final text. Pass
  `abortSignal` through so cancellation reaches the child. Useful to isolate
  context-heavy work (search, file reading) from the main agent's context.
- **DevTools.** v6 adds a debugging UI showing agent steps, inputs/outputs, token usage,
  and raw provider requests.
- **Per-step control.** `prepareStep` lets you change model / messages / active tools
  before each step; `onStepFinish` / `onFinish` for observability.

## What it does NOT include (vs the harness SDKs)

Like the OpenRouter Agent SDK, the AI SDK is a **loop-primitive SDK**, not a harness:

- **No built-in coding harness** — no bundled filesystem, bash, or editor tools. You
  define every tool yourself (or wire MCP servers).
- **No bundled binary / no sandbox** — nothing executes shell commands or isolates
  runs for you. There is no managed sandbox like Claude/Codex provide.
- **No opinion on the agent's "job"** — it doesn't ship a coding agent, a file-editing
  agent, or a project model. It gives you the loop, tools, and stop conditions.

Contrast:

- **Claude Agent SDK / OpenAI Codex SDK / Cursor SDK** are **harness** SDKs — they ship
  (or drive) a real coding agent with built-in filesystem/bash/edit tooling, a
  binary/process, and a managed execution environment.
- **OpenRouter Agent SDK and Vercel AI SDK** are **loop-primitive** SDKs — bring your
  own tools, the SDK runs the model→tool loop in your process. AI SDK differs from
  OpenRouter mainly in breadth (full UI layer, structured output, MCP, multi-framework)
  and in routing philosophy (direct providers by default, Gateway optional) vs
  OpenRouter's gateway-first, cost-aware stance.

## Maturity / versioning

- **v6 is stable**, published **2025-12-22**. `latest` on npm is **6.0.197**; v6 line
  began at `6.0.0-beta.29` and there are 300+ published v6 builds.
- **Breaking changes from v5:** described as minor for most users; the major bump
  tracks the **v3 Language Model Specification**. Automated migration via
  **`npx @ai-sdk/codemod v6`**. Notable rename to remember in code: tool input schema
  is **`inputSchema`** (v6), and multi-step control standardizes on **`stopWhen`**
  (older `maxSteps` phrasing). **[verified from the v6 announcement]**
- npm also exposes a **`beta` tag at 7.0.0-beta.x** and a `canary` 7.0.0 line — i.e. v7
  is already in pre-release, but **v6 is the current stable** target. **[verified via
  npm dist-tags]**

## Practical notes & gotchas (for lesson framing)

- **License:** npm says **Apache-2.0**, not MIT. Use Apache-2.0 in materials unless the
  repo LICENSE contradicts it.
- **`tools` is a record, not an array.** `{ getWeather: tool({...}) }`. OpenRouter and
  some other SDKs use arrays — easy to trip up when porting examples.
- **`inputSchema`, not `parameters`.** v6 naming. Old tutorials using `parameters` are v5.
- **Structured output costs a step.** When you set `output` on an agent that also calls
  tools, raise your `stepCountIs` to leave room for the final object generation.
- **Gateway is optional.** Model strings like `'anthropic/claude-sonnet-4.5'` route via
  AI Gateway; provider instances like `anthropic('claude-sonnet-4.5')` go direct.
  Decide deliberately which you teach.
- **Agent is an interface; `ToolLoopAgent` is the class.** If a learner asks "where's
  the Agent class," clarify the contract-vs-implementation split.
- **Default step cap is 20.** Long autonomous runs need an explicit higher `stopWhen`.
- **Helper names confirmed (checked 2026-06-08).** The Building Agents docs show exactly
  **`createAgentUIStreamResponse({ agent, uiMessages })`** and structured final output as
  **`Output.object({ schema })`** — both imported from `'ai'`, casing as written here.
  Source: https://ai-sdk.dev/docs/agents/building-agents

## Sources

- [AI SDK 6 announcement (Vercel blog)](https://vercel.com/blog/ai-sdk-6)
- [AI SDK Core: ToolLoopAgent (API reference)](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent)
- [Agents: Building Agents](https://ai-sdk.dev/docs/agents/building-agents)
- [Agents: Overview](https://ai-sdk.dev/docs/agents/overview)
- [Agents: Loop Control (stopWhen / prepareStep)](https://ai-sdk.dev/docs/agents/loop-control)
- [Agents: Subagents](https://ai-sdk.dev/docs/agents/subagents)
- [AI SDK Core: Agent (interface) reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/agent)
- [AI SDK Core: tool() reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool)
- [AI SDK introduction](https://ai-sdk.dev/docs/introduction)
- [AI SDK Providers: AI Gateway](https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway)
- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
- [vercel/ai GitHub repo](https://github.com/vercel/ai)
- [npm: `ai` package](https://www.npmjs.com/package/ai) (registry metadata: v6.0.197, Apache-2.0)
- [npm dist-tags: `ai`](https://registry.npmjs.org/-/package/ai/dist-tags) (latest 6.0.197 / beta 7.0.0-beta.116 / canary 7.0.0-canary.165, checked 2026-06-08)
- [vercel/ai LICENSE (Apache-2.0)](https://raw.githubusercontent.com/vercel/ai/main/LICENSE)
