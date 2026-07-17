# AI SDK 6 (Vercel) — Single-File Code Review Agent (TypeScript)

The **loop-primitive** counterpart to [`claude-sdk-walkthrough.md`](./claude-sdk-walkthrough.md).
Exact same scenario — empty repo → installed SDK → one file that takes a `diff` and returns
a structured JSON review (5 scored criteria + a free-form comment) — built on the
**Vercel AI SDK 6** (`ai` package) instead of a harness SDK.

Grounded against the AI SDK 6 agent docs (`ToolLoopAgent`, `Output.object`, `tool()`),
verified 2026-06-08 (see [`vercel-ai-sdk.notes.md`](./vercel-ai-sdk.notes.md)). The point
of pairing the two walkthroughs: **same review out, different amount of "agent" you get for
free.** Claude (harness) hands you the loop, tools, and structured output; here you import
the model provider yourself, compose the loop class, and declare the output shape — the
hallmarks of a loop-primitive SDK.

---

## 1. Empty repo → installed deps

```bash
mkdir review-agent-aisdk && cd review-agent-aisdk
npm init -y
npm install ai @ai-sdk/anthropic zod    # ai = the loop+tools; @ai-sdk/anthropic = the model; zod = the schema
npm install -D tsx typescript           # tsx = zero-config TS runner
export ANTHROPIC_API_KEY=sk-ant-...      # the @ai-sdk/anthropic provider reads this env var
```

> Note what you install vs. the Claude walkthrough: there `@anthropic-ai/claude-agent-sdk`
> bundled the model, the tools, and a native binary. Here the loop (`ai`), the model
> (`@ai-sdk/anthropic`), and the schema lib (`zod`) are **three separate, swappable pieces**.
> Want a different model? Swap `@ai-sdk/anthropic` for `@ai-sdk/openai` — the rest is unchanged.

That's the whole setup. One source file follows.

---

## 2. The single file — `review.ts`

```typescript
import { ToolLoopAgent, Output, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { readFileSync } from "node:fs";

// ── The review shape we want back (Zod = the source of truth for the type AND the schema) ──
const criterion = z.object({
  score: z.number().int().min(1).max(5),
  note: z.string().describe("One concise sentence justifying the score"),
});

const REVIEW_SCHEMA = z.object({
  correctness: criterion,
  security: criterion,
  performance: criterion,
  readability: criterion,
  testCoverage: criterion,
  comment: z.string().describe("Free-form overall verdict and top action items"),
});

type Review = z.infer<typeof REVIEW_SCHEMA>; // type is INFERRED from the schema — no duplicate type decl

// ── The system prompt: passed as `instructions` (this is what makes the agent a reviewer) ──
const INSTRUCTIONS = `You are a senior software engineer doing a focused pull-request review.
You will be given a unified git diff. Review ONLY what the diff changes — do not invent
context that isn't shown.

Score each of these five criteria from 1 (serious problems) to 5 (excellent), with a one-line
justification each:
- correctness:  logic, edge cases, error handling, API misuse
- security:     injection, authz/authn, secrets, unsafe input handling
- performance:  needless work, N+1, allocations, blocking calls
- readability:  naming, structure, comments, cohesion
- testCoverage: are the changes meaningfully tested?

Then write a short free-form "comment" with the overall verdict and the top 1-3 fixes.
Be specific and reference the diff. Do not pad.`;

// ── The agent: you compose the loop yourself (model + instructions + output + stop) ──────────
const reviewer = new ToolLoopAgent({
  model: anthropic("claude-sonnet-4-6"), // swap to anthropic("claude-opus-4-8") for harder reviews
  instructions: INSTRUCTIONS,
  tools: {}, // no tools — the diff is supplied inline, so there's no loop to run
  output: Output.object({ schema: REVIEW_SCHEMA }), // typed, validated final object
  // Structured output costs ONE extra step on top of the model turn; the default
  // stopWhen: stepCountIs(20) is plenty here. We set it tight to document the intent.
  stopWhen: stepCountIs(2),
});

// ── diff in, structured Review out ───────────────────────────────────────────────────────────
export async function reviewDiff(diff: string): Promise<Review> {
  const { output } = await reviewer.generate({
    prompt: `Review this diff:\n\n\`\`\`diff\n${diff}\n\`\`\``,
  });
  return output; // already validated against REVIEW_SCHEMA, typed as Review
}

// ── CLI wrapper: `git diff | npx tsx review.ts`  (or pass a .diff file path) ─────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2];
  const diff = readFileSync(path ?? 0, "utf8"); // fd 0 = stdin when no path given
  reviewDiff(diff)
    .then((review) => console.log(JSON.stringify(review, null, 2)))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
```

---

## 3. Run it

```bash
# review your currently staged changes
git diff --staged | npx tsx review.ts

# or review a saved patch
npx tsx review.ts changes.diff
```

The output is the **same shape** as the Claude version — that's the whole point:

```json
{
  "correctness": { "score": 4, "note": "Handles the happy path; the empty-array branch returns undefined." },
  "security":    { "score": 3, "note": "User input flows into the query string without escaping." },
  "performance": { "score": 5, "note": "No regressions; the added cache avoids the repeat fetch." },
  "readability": { "score": 4, "note": "Clear names, but `doIt()` should describe its intent." },
  "testCoverage":{ "score": 2, "note": "New branch in parseToken() has no accompanying test." },
  "comment": "Solid change overall. Before merge: escape the query input, cover parseToken()'s error branch, and rename doIt()."
}
```

---

## Why this shape (and where it differs from the harness build)

- **You import the model.** `anthropic("claude-sonnet-4-6")` is a `LanguageModel` you wired in.
  Swapping providers is a one-line change (`@ai-sdk/openai` → `openai("gpt-5.5")`); the loop,
  schema, and prompt are untouched. The harness SDK gave you Anthropic models implicitly — here
  model choice is an explicit, swappable input. That swappability **is** the loop-primitive value prop.
- **`instructions` = the agent.** Same role as Claude's `systemPrompt`: a plain string that turns
  a bare loop into a purpose-built reviewer.
- **`Output.object({ schema })` = native structured output.** The Zod schema is both the runtime
  validator and the TypeScript type (`z.infer`). The SDK validates the final object for you, so
  `output` is already typed as `Review`. This is the loop-SDK equivalent of Claude's `outputFormat`.
- **`tools: {}` because the diff is a parameter.** No Read/Bash/Grep needed — the agent reasons over
  inline text. **When you *would* add tools:** point it at a repo instead of a diff by giving it a
  `readFile` tool so it can open neighbouring files —

  ```typescript
  import { tool } from "ai";
  tools: {
    readFile: tool({
      description: "Read a file from the repo to gather review context",
      inputSchema: z.object({ path: z.string() }),
      execute: async ({ path }) => ({ content: readFileSync(path, "utf8") }),
    }),
  },
  ```

  …and **raise `stopWhen`** (e.g. `stepCountIs(10)`) so the agent can take several read→reason steps
  before emitting the review. This is exactly the moment the `ToolLoopAgent` class earns its keep:
  with no tools it's a single shot you could write as `generateText({ model, output, prompt })`; with
  tools, the loop is the thing you're buying.

## Gotchas

- **Structured output costs a step.** With `output` set, the final object generation is its own step
  on top of the model turn — when you also add tools, bump `stepCountIs` to leave room, or the loop
  can stop before it emits the object. (No tools here, so the default 20 is ample.)
- **`tools` is a record, not an array.** `{ readFile: tool({...}) }`, not `[tool({...})]` — OpenRouter
  and some other SDKs use arrays; easy to trip on when porting.
- **`inputSchema`, not `parameters`.** v6 renamed the tool input field; old v5 tutorials use `parameters`.
- **`Agent` is an interface; `ToolLoopAgent` is the class.** If you want a custom loop, implement the
  `Agent` interface yourself and it still plugs into the SDK's UI-stream helpers.
- **Gateway vs direct.** `anthropic("claude-sonnet-4-6")` (a provider instance) goes **direct** to
  Anthropic. A model **string** like `"anthropic/claude-sonnet-4-6"` routes through the optional
  **AI Gateway** instead. Decide deliberately which you teach — they have different data/billing paths.

---

## The one-paragraph takeaway for the lesson

Both files solve the identical problem and return the identical JSON. The Claude (harness) build
hands you the loop, the tools, and structured output as one bundled agent. The AI SDK 6 (loop) build
makes you assemble the same capability from named primitives — `ToolLoopAgent`, `tool()`, `Output.object`,
your own provider import. Neither is "better": the harness is less to wire when you want a coding agent
on your filesystem; the loop primitive is what you reach for when model choice, provider-swapping, or a
non-coding job matters more than built-in tools.
