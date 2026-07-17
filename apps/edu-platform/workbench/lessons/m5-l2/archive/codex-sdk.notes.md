# Codex SDK — Research Notes

> Web research compiled 2026-06-08. Sources listed at the bottom.

## What it is

The **Codex SDK** is OpenAI's library for controlling **Codex agents programmatically** —
the same agent that powers the Codex CLI, the IDE extension, and Codex Web. You hand it a
prompt and it autonomously plans, reads/edits files, runs commands in a sandbox, and
reports back. It is aimed at CI/CD automation, building custom agents on top of Codex, and
embedding Codex inside internal tools or your own application.

- **Languages:** **TypeScript/JavaScript** and **Python**.
- **Packages:**
  - TypeScript — `@openai/codex-sdk` (`npm install @openai/codex-sdk`), requires **Node.js 18+**.
  - Python — `openai-codex` (`pip install openai-codex`), requires **Python 3.10+**.
- **Version at time of writing:** `@openai/codex-sdk` **0.137.0** (published 2026-06-06).
  It declares a peer dependency on `@openai/codex` pinned to the **same version** —
  the SDK versions move in lockstep with the CLI.

## How it works (architecture)

This is the key mental model and the main difference vs the Claude Agent SDK:

> The TypeScript SDK **wraps the `codex` CLI**. It spawns the CLI as a subprocess and
> exchanges **JSONL events over stdin/stdout**.

So the SDK is a thin, typed control layer over the same binary you'd run interactively.
The Python SDK similarly drives the pinned Codex runtime. This means:

- Codex itself (the CLI/runtime) does the heavy lifting — agent loop, tool execution, sandbox.
- The SDK gives you typed thread/turn objects, streaming events, and structured output.
- Behavior matches what you'd get from `codex` in non-interactive mode, but more
  comprehensive and flexible.

## Core API shape

The primary objects are the **`Codex` client**, **threads** (conversations), and **runs**
(turns within a thread).

```typescript
// TypeScript — basic buffered run
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(
  "Make a plan to diagnose and fix the CI failures"
);
console.log(result.finalResponse, result.items);
```

```python
# Python — basic buffered run
from openai_codex import Codex, Sandbox

with Codex() as codex:
    thread = codex.thread_start(model="gpt-5.4")
    result = thread.run("Make a plan to diagnose and fix failures")
    print(result.final_response)
```

### Client construction

```typescript
const codex = new Codex({
  env: { PATH: "/usr/local/bin" },          // base env for the spawned CLI
  config: { show_raw_agent_reasoning: true } // CLI config overrides
});
```

- `config` overrides flatten to dotted paths, serialize as TOML, and are passed as
  repeated `--config` flags to the CLI.
- The SDK injects required variables (e.g. `CODEX_API_KEY`) on top of the user-provided env.

### Threads & sessions

- `startThread(options?)` — create a new conversation thread.
- `resumeThread(threadId)` — reconstruct a thread from its persisted session.
- **Threads persist to `~/.codex/sessions`.** If you lose the in-memory `Thread` object,
  resume it by id and keep going — useful for long-running / multi-step CI jobs.

Thread options:
- `workingDirectory` — project path (must be a Git repo by default).
- `skipGitRepoCheck` — boolean to bypass the Git-repo validation.
- `model`, `sandbox` — set per thread (Python `thread_start(model=..., sandbox=...)`).

### Runs / turns

- `thread.run(prompt, options?)` — execute a prompt, return when the turn completes.
- `thread.runStreamed(prompt, options?)` — return an **async generator of structured events**
  so you can react to intermediate progress (tool calls, streaming responses, file-change
  notifications). Python also exposes `thread.turn()`.

Each turn can use **different sandbox settings**, and thread-level options take precedence
over global client overrides.

## Streaming events

```typescript
const { events } = await thread.runStreamed("Refactor the parser");
for await (const event of events) {
  if (event.type === "item.completed") { /* a tool call / message finished */ }
  if (event.type === "turn.completed") { /* includes usage data */ }
}
```

Event types observed include `item.completed` and `turn.completed` (the latter carries
token **usage** data). Use streaming for progress UIs, logs, and per-tool reactions; use
buffered `run()` when you only need the final result.

## Structured output

Provide a JSON Schema via the `outputSchema` option to force a structured result:

```typescript
const turn = await thread.run("Summarize the repo status", {
  outputSchema: {
    type: "object",
    properties: { summary: { type: "string" } }
  }
});
```

- Zod schemas are supported by converting with `zod-to-json-schema` (use `target: "openAi"`).

## Image / multimodal input

Prompts can be an array of content parts, mixing text and local images:

```typescript
const turn = await thread.run([
  { type: "text", text: "Describe what's wrong in these screenshots" },
  { type: "local_image", path: "./ui.png" }
]);
```

## Sandbox / permissions

Sandbox presets control filesystem access and are passed to `thread_start()` or individual
`run()` calls:

| Preset | Meaning |
|--------|---------|
| `Sandbox.read_only` | Read files, no writes |
| `Sandbox.workspace_write` | Read files and write inside the workspace |
| `Sandbox.full_access` | No filesystem restrictions |

Because sandbox can be set per turn, a single thread can plan in `read_only` and then
apply changes in `workspace_write`.

## Authentication

- The SDK relies on the local Codex installation's auth (the same login used by the Codex
  CLI / IDE / Web). In practice it injects a `CODEX_API_KEY`-style credential into the
  spawned CLI's environment on top of your provided `env`.
- The public SDK pages don't enumerate a separate auth flow — authenticate Codex itself
  (e.g. `codex login` / API key) and the SDK rides on that.
- **Models:** selectable per thread (docs example uses `model="gpt-5.4"`); no exhaustive
  list is published in the SDK overview.

## How it compares to the Claude Agent SDK

- **Transport:** Codex SDK **spawns the CLI and talks JSONL over stdio** — it's a wrapper
  around the `codex` binary. The Claude Agent SDK also bundles a binary but exposes a single
  `query()` async-generator entry point. Codex models the conversation as explicit
  **thread + run/turn** objects.
- **Session persistence:** Codex → `~/.codex/sessions`; Claude → JSONL session files,
  resumed by `session_id`. Both let you resume/reconstruct.
- **Streaming:** Codex `runStreamed()` (events generator) ≈ Claude's `query()` message
  stream. Codex separates buffered `run()` from streamed `runStreamed()`.
- **Structured output:** Codex has first-class `outputSchema` (JSON Schema / Zod). Claude
  leans on tools/prompting.
- **Versioning:** Codex SDK is pinned to the matching `@openai/codex` CLI version
  (lockstep). Claude Agent SDK ships its own bundled Claude Code binary.

## Practical notes & gotchas

- **Git-repo requirement:** `workingDirectory` must be a Git repo unless you pass
  `skipGitRepoCheck`. Easy to trip over in fresh CI checkouts or scratch dirs.
- **Lockstep versions:** because the SDK peer-depends on the exact CLI version, upgrade
  both together; mismatches can break the JSONL contract.
- **It needs the CLI runtime present** — the SDK is a control layer, not a standalone agent.
- **Use cases (per OpenAI):** CI/CD pipelines, building agents that engage with Codex,
  internal tooling, and embedding Codex in your own application.

## Sources

- [Codex SDK overview — OpenAI Developers](https://developers.openai.com/codex/sdk)
- [Codex TypeScript SDK README (GitHub)](https://github.com/openai/codex/blob/main/sdk/typescript/README.md)
- [Codex TypeScript SDK source (GitHub)](https://github.com/openai/codex/tree/main/sdk/typescript)
- [@openai/codex-sdk (npm)](https://www.npmjs.com/package/@openai/codex-sdk)
- [OpenAI Codex SDK provider — Promptfoo docs](https://www.promptfoo.dev/docs/providers/openai-codex-sdk/)
- [OpenAI Codex as a native agent in your TypeScript app — DEV Community](https://dev.to/kachurun/openai-codex-as-a-native-agent-in-your-typescript-nodejs-app-kii)
