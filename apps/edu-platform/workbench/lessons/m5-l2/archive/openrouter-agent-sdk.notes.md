# OpenRouter Agent SDK — Research Notes

> Web research compiled 2026-06-08. Sources listed at the bottom.

## What it is

The **OpenRouter Agent SDK** (`@openrouter/agent`) is OpenRouter's toolkit for building
agentic applications on top of OpenRouter's unified model gateway. It provides the
primitives — multi-turn loops, tool execution, and conversation-state tracking — so you
don't have to hand-wire the agent loop, tool dispatch, and message bookkeeping yourself.

The headline pitch is **model-agnostic agents**: "one function to call any model," with
access to **400+ models** through a single interface. You can swap the underlying model
(OpenAI, Anthropic, Google, etc.) without changing your agent architecture.

- **Core entry point:** a single `callModel` function that runs an inference loop until a
  stop condition is met.
- **Languages:** TypeScript and Python are available today (Go appears for the *Client*
  SDKs / in the docs tabs, but the agent loop layer is TS-first).
- **Relationship to Client SDKs:** the Agent SDK is built to sit on top of the Client
  SDKs. Installing `@openrouter/agent` pulls in the Client SDKs automatically, but each
  package can also be used independently.

> Note: one fetched page described it as "Anthropic's official toolkit" — that appears to
> be a fetch-model misread. It is **OpenRouter's** SDK. OpenRouter separately offers a
> guide for using *Anthropic's* Agent SDK against OpenRouter, which is a different thing.

## Agent SDK vs Client SDKs

| Aspect            | Agent SDK (`@openrouter/agent`)          | Client SDKs (`@openrouter/sdk`)             |
|-------------------|------------------------------------------|---------------------------------------------|
| Focus             | Agentic primitives — loops, tools, stops | Lean API client mirroring the REST API      |
| State management  | Automatic                                | Manual                                      |
| Tool execution    | Automatic (SDK runs the loop)            | Manual dispatch                             |
| Best when         | You want built-in agent loops            | You want direct calls + own orchestration   |
| Languages         | TypeScript (Python available)            | TypeScript, Python, Go                       |

Rule of thumb: reach for the Client SDK when you want a thin, typed wrapper over the REST
API and will manage orchestration yourself; reach for the Agent SDK when you want the
loop, tool execution, and state handled for you.

## Installation

```bash
npm install @openrouter/agent
pnpm add @openrouter/agent
yarn add @openrouter/agent
```

Installing `@openrouter/agent` also brings in the Client SDKs.

## Core API: `callModel`

`callModel` is the main entry point. It runs an inference loop that:

1. Sends messages to the model.
2. Automatically executes any tool calls the model returns.
3. Appends tool results back into the conversation.
4. Repeats until the configured stop condition(s) are met.

**Signature:**

```typescript
function callModel(request: CallModelInput, options?: RequestOptions): ModelResult
```

### Key parameters

**Model selection (one required):**
- `model` — a model ID string (e.g. `'openai/gpt-5-nano'`, `'anthropic/claude-sonnet-4'`)
  or a function returning a model ID (so you can vary it per turn).
- `models` — an array of model IDs for fallback routing.

**Input:**
- `input` — a string or a message array (`[{ role, content }]`).
- `instructions` — optional system instructions (string or a context-dependent function).

**Generation controls:**
- `temperature` (0–2), `maxOutputTokens`, `topP`, `topK`.
- `reasoning` — reasoning-model configuration.
- `promptCacheKey` — prompt caching identifier.

**Tools:**
- `tools` — array of tool definitions (see `tool()` below).
- `toolChoice` — tool selection strategy.
- `parallelToolCalls` — boolean, run tool calls concurrently.
- `context` — tool-specific context data threaded into tool execution.

**Routing / tracking:**
- `provider` — routing preferences (fallbacks, data-collection policy, provider ordering).
- `metadata`, `user`, `sessionId` — request tracking.

**Control:**
- `stopWhen` — execution halt conditions (stop conditions, see below).

**`RequestOptions`:** `timeout` (ms) and `signal` (AbortSignal) for cancellation.

### Minimal example

```typescript
const result = openrouter.callModel({
  model: 'openai/gpt-5-nano',
  input: 'What is the capital of France?',
});

const text = await result.getText();
console.log(text);
```

## `ModelResult` — consumption patterns

`callModel` returns a `ModelResult` that supports multiple ways to read the same response.
A notable design point: you can **stream, extract, and process the same response
concurrently** from a single call.

**Text / response:**
- `getText()` — full response text (after any tool execution completes).
- `getResponse()` — full response with usage metrics (`inputTokens`, `outputTokens`,
  `cachedTokens`).

**Streaming:**
- `getTextStream()` — text deltas.
- `getReasoningStream()` — reasoning-model output deltas.
- `getItemsStream()` — complete structured items.
- `getNewMessagesStream()` — cumulative message snapshots.
- `getFullResponsesStream()` — all events, including tool results.

**Tools:**
- `getToolCalls()` — array of parsed tool calls.
- `getToolCallsStream()` — tool calls as they complete.
- `getToolStream()` — tool deltas and preliminary results.

**Context / control:**
- `getContextUpdates()` — context snapshots emitted on tool updates.
- `cancel()` — abort the stream and any consumers.

## Tools: the `tool()` helper

Tools are defined with the `tool()` helper using **Zod schemas**, with full TypeScript
inference for inputs, outputs, and events. A design goal called out in the docs: **tools
run separately from model calls** — clean boundaries, no tangled orchestration logic.

```typescript
import { callModel, tool } from '@openrouter/agent';
import { z } from 'zod';

const weatherTool = tool({
  name: 'get_weather',
  description: 'Get the current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  execute: async ({ location }) => {
    return { temperature: 72, condition: 'sunny', location };
  },
});

const result = await callModel({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    { role: 'user', content: 'What is the weather in San Francisco?' },
  ],
  tools: [weatherTool],
});

const text = await result.getText();
console.log(text);
```

### `tool()` config

**Required:**
- `name` — tool identifier.
- `inputSchema` — a Zod object for parameters.
- **Exactly one execution mode:**
  - `execute` — async function, or `false` for manual handling.
  - `onToolCalled` — human-in-the-loop hook.

**Optional:**
- `description` — tool documentation surfaced to the model.
- `outputSchema` — validates results.
- `eventSchema` — enables generator mode (emit events via AsyncGenerator).
- `contextSchema` — declares tool-specific context needs.
- `onResponseReceived` — HITL post-processing.
- `nextTurnParams` — modify subsequent requests from within a tool.

### Tool types

- **ToolWithExecute** — standard tool with an `execute` function.
- **ToolWithGenerator** — emits events via an AsyncGenerator (`eventSchema`).
- **ManualTool** — pauses execution, no automatic dispatch (`execute: false`).
- **HITLTool** — human-in-the-loop, with optional auto-response.

### Type utilities

- `InferToolInput<T>` — extract typed parameters.
- `InferToolOutput<T>` — extract typed results.
- `ToolExecuteContext<TName, TContext>` — flat context merging turn data + tool context.

## Stop conditions

Stop conditions control when the agent loop terminates (passed via `stopWhen`). Built-in
helpers:

- `stepCountIs(n)` — halt after `n` conversation steps.
- `hasToolCall(name)` — stop when a specific tool is invoked.
- `maxTokensUsed(n)` — stop after a token threshold.
- `maxCost(amount)` — stop at a cost limit (handy given OpenRouter's per-model pricing).
- `finishReasonIs(reason)` — stop on a specific finish reason.

Custom conditions receive a `StopConditionContext` with step history, so you can write
arbitrary termination logic.

## Streaming event types

- `EnhancedResponseStreamEvent` — OpenResponses events plus tool preliminary results.
- `ToolStreamEvent` — delta content or preliminary results.
- `ParsedToolCall` — structured tool-invocation data.

Streaming works out of the box within each agent step.

## Human-in-the-loop (HITL)

The SDK supports approval gates: a tool can be defined with `onToolCalled` /
`onResponseReceived` hooks (HITLTool) or set `execute: false` (ManualTool) to pause and
require an external decision before the loop continues. This is the mechanism for
"approve before this action runs" flows.

## Other notable capabilities

- **Dynamic parameters** — model, temperature, and tools can change between turns
  (`model` can be a function; `nextTurnParams` can rewrite the next request).
- **Format conversion** — OpenAI/Claude message-format compatibility through linked
  guides, so existing prompts/messages port over.
- **DevTools** — telemetry capture and visualization for local development.
- **Fallback routing** — `models: [...]` plus `provider` ordering uses OpenRouter's
  native multi-provider fallback.

## Documentation map (sidebar sections)

1. **Call Model** — full `callModel` API reference.
2. **Tools** — defining and using tools.
3. **Stop Conditions** — controlling agent-loop termination.
4. **Streaming** — real-time token output.
5. **DevTools** — telemetry capture and visualization.
6. **Migration** — moving agent imports to the standalone package (from `@openrouter/sdk`).

## Quick take (for course/lesson framing)

- The pitch that lands for a 10xDevs audience: **provider-agnostic agent loop** — the same
  tool-calling agent code runs against 400+ models, and you can A/B models or set hard
  `maxCost`/`stepCountIs` ceilings per run.
- Conceptually it mirrors other agent SDKs (Vercel AI SDK's `generateText` + `tools` +
  `stopWhen`, Anthropic's Agent SDK loop): `callModel` ≈ the agent loop, `tool()` ≈ Zod
  tool definitions, stop conditions ≈ loop guards. The differentiator is OpenRouter's
  routing/fallback and cost-based stopping baked into the same surface.
- Caveat to verify before quoting in a lesson: exact package names (`@openrouter/agent`
  vs `@openrouter/sdk`), whether the example uses `input:` or `messages:` (the docs show
  both forms across pages), and current Python parity. Confirm against live docs before
  putting syntax in front of learners.

## Sources

- [Agent SDK Overview](https://openrouter.ai/docs/agent-sdk/overview)
- [Call Model Overview (TypeScript)](https://openrouter.ai/docs/agent-sdk/call-model/overview)
- [Call Model API Reference](https://openrouter.ai/docs/agent-sdk/call-model/api-reference)
- [The Model-Agnostic Agent SDK (landing)](https://openrouter.ai/sdk)
- [Client SDKs Overview](https://openrouter.ai/docs/client-sdks/overview)
- [Anthropic Agent SDK Integration guide](https://openrouter.ai/docs/guides/community/anthropic-agent-sdk)
- [OpenRouter Quickstart](https://openrouter.ai/docs/quickstart)
