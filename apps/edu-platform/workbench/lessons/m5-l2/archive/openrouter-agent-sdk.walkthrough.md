# OpenRouter Agent SDK — Single-File Walkthrough: a Diff Reviewer

> Goal: from an empty repo to one TypeScript file that instantiates an agent with a system
> prompt, takes a `diff` as input, and returns a **structured JSON code review** —
> 5 scored criteria + a free-form comment.
>
> Companion notes: [`openrouter-agent-sdk.notes.md`](./openrouter-agent-sdk.notes.md).
> Compiled 2026-06-08. **Verify exact param names against live docs before shipping** —
> see "Caveats" at the bottom; the SDK is young and a couple of field names shift between
> doc pages.

---

## The idea (why a "tool" gives us structured output)

This SDK is a **tool-calling agent loop**, not a JSON-mode wrapper. The clean way to get
guaranteed-shape JSON out of it is to define **one tool** — `submit_review` — whose Zod
`inputSchema` *is* the review schema, and force the model to call it. The SDK validates the
model's arguments against Zod and hands you a typed object. No string parsing, no "did the
model wrap it in ```json fences" guesswork.

So: "few tools" = one structured-output sink tool. For a single diff passed in as a
parameter, the agent needs no other tools (it isn't fetching anything). If you later want
the agent to pull more context (read a file, run a linter), you add real tools the same way.

---

## Step 0 — Prerequisites

- Node 18+ (for global `fetch` / modern ESM).
- An OpenRouter API key → https://openrouter.ai/keys
  ```bash
  export OPENROUTER_API_KEY="sk-or-..."
  ```

## Step 1 — Empty repo

```bash
mkdir diff-reviewer && cd diff-reviewer
npm init -y
```

## Step 2 — Install dependencies

```bash
# the agent toolkit (pulls in the OpenRouter client SDK too) + zod for schemas
npm install @openrouter/agent zod

# run TypeScript with no build step
npm install -D tsx typescript
```

## Step 3 — Make it ESM + add a run script

Edit `package.json` so the SDK's ESM imports work and you get a one-word run command:

```jsonc
{
  "type": "module",
  "scripts": {
    "review": "tsx review.ts"
  }
}
```

## Step 4 — The single file: `review.ts`

```typescript
/**
 * Single-file code reviewer built on the OpenRouter Agent SDK.
 *
 * Usage:
 *   git diff | npm run review
 *   npm run review -- path/to/changes.diff
 *
 * Output: a structured JSON review on stdout (5 scored criteria + a free-form comment).
 */
import { readFileSync } from 'node:fs';
import { callModel, tool, hasToolCall } from '@openrouter/agent';
import { z } from 'zod';

// --- 1. The review contract (this Zod schema IS the structured output) -------

const Score = z.number().int().min(1).max(5);

const ReviewSchema = z.object({
  // 5 scored criteria, each 1 (poor) .. 5 (excellent), with a one-line justification.
  correctness:     z.object({ score: Score, note: z.string() }),
  readability:     z.object({ score: Score, note: z.string() }),
  maintainability: z.object({ score: Score, note: z.string() }),
  testCoverage:    z.object({ score: Score, note: z.string() }),
  security:        z.object({ score: Score, note: z.string() }),
  // free-form overall comment
  comment: z.string().describe('Overall free-form review: the verdict and the why.'),
});

type Review = z.infer<typeof ReviewSchema>;

// --- 2. The structured-output tool -------------------------------------------
// Forcing the model to call this is how we guarantee the shape. The SDK validates
// the model's arguments against ReviewSchema, then hands us the typed object here.

let captured: Review | undefined;

const submitReview = tool({
  name: 'submit_review',
  description: 'Submit the final structured code review. Call this exactly once.',
  inputSchema: ReviewSchema,
  execute: async (review) => {
    captured = review;        // capture the validated, typed result
    return { ok: true };      // returned to the model; we just need it to stop here
  },
});

// --- 3. System prompt --------------------------------------------------------

const SYSTEM_PROMPT = `
You are a senior software engineer doing a focused pull-request review.
You are given a unified diff. Review ONLY what the diff changes.

Score each of the five criteria from 1 (poor) to 5 (excellent) and justify each
score in one concrete sentence that references the diff:
  - correctness:     does the change do what it intends, edge cases included?
  - readability:     naming, clarity, comments where they earn their place.
  - maintainability: structure, coupling, duplication, future-proofing.
  - testCoverage:    are the changes tested, or do they need tests?
  - security:        injection, secrets, authz, unsafe input handling.

Then write a free-form "comment" with the overall verdict and the single most
important thing to fix. Be specific and avoid generic praise.

Deliver the result by calling the submit_review tool. Do not reply in plain text.
`.trim();

// --- 4. Read the diff (the "parameter") --------------------------------------

function readDiff(): string {
  const fileArg = process.argv[2];
  const raw = fileArg ? readFileSync(fileArg, 'utf8') : readFileSync(0, 'utf8'); // 0 = stdin
  if (!raw.trim()) {
    console.error('No diff provided. Pipe `git diff` in, or pass a file path.');
    process.exit(1);
  }
  return raw;
}

// --- 5. Run the agent --------------------------------------------------------

async function main() {
  const diff = readDiff();

  const result = callModel({
    model: 'anthropic/claude-sonnet-4',   // any of OpenRouter's 400+ models
    instructions: SYSTEM_PROMPT,          // the system prompt
    input: `Review this diff:\n\n${diff}`,
    tools: [submitReview],
    toolChoice: 'required',               // force a tool call -> guaranteed structured output
    stopWhen: hasToolCall('submit_review'), // end the loop as soon as the review is submitted
  });

  // Drive the loop to completion (execute() captures the validated object).
  await result.getText();

  if (!captured) {
    console.error('Model did not submit a review.');
    process.exit(1);
  }

  console.log(JSON.stringify(captured, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

## Step 5 — Run it

```bash
# review your current working changes
git diff | npm run review

# or review a saved diff
npm run review -- changes.diff
```

Example output:

```json
{
  "correctness":     { "score": 4, "note": "Handles the happy path; the empty-array case in parseRows() is unguarded." },
  "readability":     { "score": 5, "note": "Clear names and small functions; no comments needed." },
  "maintainability": { "score": 3, "note": "fetchUser() duplicates the retry logic already in httpClient.ts." },
  "testCoverage":    { "score": 2, "note": "New parseRows() branch has no test; add one for the empty input." },
  "security":        { "score": 4, "note": "Input is validated, but the SQL string is concatenated rather than parameterized." },
  "comment": "Solid, readable change. Ship-blocker: parameterize the SQL in line 42 before merge, then add the empty-input test."
}
```

---

## Why this shape

- **`callModel`** is the whole agent loop — it calls the model, runs tool calls, and
  repeats until `stopWhen` fires. You write zero loop code.
- **`tool({ inputSchema })`** + **`toolChoice: 'required'`** turns "give me JSON" into
  "call this typed function," and the SDK validates the args against Zod for you — so the
  output is structurally guaranteed *and* type-safe (`z.infer`).
- **`hasToolCall('submit_review')`** stops the loop the instant the review lands, so you
  don't pay for an extra model turn.
- Capturing the result inside **`execute`** (rather than digging into `getToolCalls()`)
  is robust to field-name differences in the parsed-tool-call object.

## Adding a real tool (optional)

If you want the agent to gather context instead of being handed everything, add tools the
same way and drop `toolChoice: 'required'` (let the model choose), raising the stop limit:

```typescript
const readFile = tool({
  name: 'read_file',
  description: 'Read a repo file to get more context around the diff.',
  inputSchema: z.object({ path: z.string() }),
  execute: async ({ path }) => ({ contents: readFileSync(path, 'utf8') }),
});

// ...
tools: [readFile, submitReview],
toolChoice: 'auto',
stopWhen: hasToolCall('submit_review'),  // still end when the review is submitted
// optionally also: maxCost(0.25) or stepCountIs(8) as a safety cap
```

## Alternative: native `response_format`

OpenRouter also supports JSON-schema-constrained output at the API level
(`response_format: { type: 'json_schema', json_schema: { strict: true, schema } }`) and you
could read `await result.getText()` and `JSON.parse` it. The forced-tool approach above is
preferred with the Agent SDK because it keeps Zod validation in the loop and avoids parsing
free text. See the structured-outputs guide linked below.

---

## Caveats — verify before shipping

The SDK is new and a few names differ across doc pages. Confirm against the live docs:

- **Input field:** examples show both `input:` and `messages:` — use whichever the current
  `callModel` reference lists.
- **`toolChoice` forcing:** `'required'` is used here; some docs show targeting a specific
  tool (e.g. `{ type: 'tool', toolName: 'submit_review' }`). With a single tool, `'required'`
  is enough.
- **Freestanding vs client form:** here we import `callModel`/`tool` directly from
  `@openrouter/agent`; other pages show a client-instance form (`openrouter.callModel(...)`
  via a `createOpenRouter`/`new OpenRouter` instance). Both appear in the docs.
- **API key:** the SDK reads `OPENROUTER_API_KEY` from the environment by default; pass it
  explicitly if you instantiate a client.

## Sources

- [Agent SDK Overview](https://openrouter.ai/docs/agent-sdk/overview)
- [Call Model API Reference](https://openrouter.ai/docs/agent-sdk/call-model/api-reference)
- [Call Model Overview](https://openrouter.ai/docs/agent-sdk/call-model/overview)
- [Structured Outputs guide](https://openrouter.ai/docs/guides/features/structured-outputs)
- [Build Your Own Harness with the Agent SDK](https://openrouter.ai/announcements/create-agent-harness-with-agent-sdk)
- [Agent SDK: Building Multi-turn Agent Workflows](https://openrouter.ai/announcements/agent-sdk-with-callmodel)
