# Claude Agent SDK — Single-File Code Review Agent (TypeScript)

A minimal, end-to-end walkthrough: empty repo → installed SDK → one file that takes a
`diff` and returns a structured JSON review (5 scored criteria + a free-form comment).

Grounded against the official TypeScript SDK reference and the custom-tools / structured-output
docs (see [`claude-sdk.notes.md`](./claude-sdk.notes.md) for the API overview).

---

## 1. Empty repo → installed dep

```bash
mkdir review-agent && cd review-agent
npm init -y
npm install @anthropic-ai/claude-agent-sdk
npm install -D tsx typescript          # tsx = zero-config TS runner
export ANTHROPIC_API_KEY=sk-ant-...     # the SDK reads this env var
```

> The TypeScript package bundles a native Claude Code binary per platform, so there's
> nothing else to install.

That's the whole setup. One source file follows.

---

## 2. The single file — `review.ts`

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "node:fs";

// ── The review shape we want back ──────────────────────────────────────────────
type CriterionScore = { score: number; note: string }; // score: 1 (poor) … 5 (great)

type Review = {
  correctness: CriterionScore;
  security: CriterionScore;
  performance: CriterionScore;
  readability: CriterionScore;
  testCoverage: CriterionScore;
  comment: string; // free-form overall summary
};

// ── JSON Schema the model is forced to fill (one entry per criterion) ───────────
const criterion = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer", minimum: 1, maximum: 5 },
    note: { type: "string", description: "One concise sentence justifying the score" },
  },
  required: ["score", "note"],
} as const;

const REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctness: criterion,
    security: criterion,
    performance: criterion,
    readability: criterion,
    testCoverage: criterion,
    comment: { type: "string", description: "Free-form overall verdict and top action items" },
  },
  required: ["correctness", "security", "performance", "readability", "testCoverage", "comment"],
} as const;

// ── The system prompt: this is what "instantiates" the agent's persona ──────────
const SYSTEM_PROMPT = `You are a senior software engineer doing a focused pull-request review.
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
Be specific and reference the diff. Do not pad. Return only the structured result.`;

// ── The agent call: diff in, structured Review out ─────────────────────────────
export async function reviewDiff(diff: string): Promise<Review> {
  const run = query({
    prompt: `Review this diff:\n\n\`\`\`diff\n${diff}\n\`\`\``,
    options: {
      systemPrompt: SYSTEM_PROMPT,
      model: "claude-sonnet-4-6", // bump to claude-opus-4-8 for harder reviews
      tools: [], // no file/bash tools needed — the diff is supplied inline
      maxTurns: 1, // single shot: read diff → emit JSON
      outputFormat: { type: "json_schema", schema: REVIEW_SCHEMA }, // native structured output
    },
  });

  for await (const message of run) {
    if (message.type === "result") {
      if (message.subtype === "success") {
        return message.structured_output as Review; // validated against REVIEW_SCHEMA
      }
      throw new Error(`Review failed: ${message.subtype}`);
    }
  }
  throw new Error("No result message received");
}

// ── CLI wrapper: `git diff | npx tsx review.ts`  (or pass a .diff file path) ─────
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

Example output:

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

## Why this shape

- **System prompt = the agent.** Passing `systemPrompt` (a plain string) gives a clean,
  purpose-built reviewer. Omit it and you get a bare assistant; pass
  `{ type: "preset", preset: "claude_code" }` only if you actually want Claude Code's
  full coding persona.
- **`outputFormat` over a custom tool.** The native JSON-Schema output format is the
  simplest reliable way to get structured data — the SDK validates and retries on
  mismatch, and you read it from `message.structured_output`. (The alternative is a
  custom `tool()` whose handler captures the args, but that's more wiring for the same
  result here.)
- **`tools: []` because the diff is a parameter.** The agent reasons over inline text, so
  it needs no Read/Bash/Grep. **When you *would* add tools:** point it at a repo instead
  of a diff (`tools: ["Read", "Grep", "Glob"]` so it can open neighboring files), or give
  it a custom `tool()` to post the review to GitHub. Register custom tools via
  `createSdkMcpServer({ name, version, tools })` → `mcpServers` and allow them with the
  `mcp__<server>__<tool>` name.
- **`maxTurns: 1`** keeps it a single read→emit pass. Raise it once you add tools so the
  agent can take several action/verify steps.

## Gotchas

- Result message can be an error subtype — handle `error_max_turns`,
  `error_during_execution`, and `error_max_structured_output_retries`, not just `success`.
- `allowedTools` only *auto-approves* tools; it does not restrict the toolset. Use `tools`
  (availability) to control which tools exist in context — `tools: []` removes all built-ins.
- Structured output (`outputFormat`) is a TypeScript SDK feature; the field on the result
  is `structured_output`.
```
