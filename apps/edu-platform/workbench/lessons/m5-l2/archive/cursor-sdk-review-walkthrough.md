# Cursor SDK — Minimal Diff-Review Agent (single file)

A from-scratch walkthrough: empty repo → installed deps → one TypeScript file that
takes a **git diff** as input and returns a **validated JSON review** (5 scored
criteria + a free-form comment).

> Grounded against the official TypeScript SDK reference (`cursor.com/docs/sdk/typescript`).
> Two facts shape this design — verify them if the API has moved since beta:
>
> 1. **There is no system-prompt option.** Cursor staff confirmed you cannot replace
>    the built-in system prompt. We inject the reviewer role as a strong instruction
>    block in the prompt. (Native alternative: a named subagent's `prompt` — shown at the end.)
> 2. **There is no `outputSchema` / structured-output mode.** Output is plain text.
>    "Structured output" = instruct the JSON shape, then parse + validate it yourself.
>    We use `zod` as the enforcement layer.

---

## 1. Create the repo

```bash
mkdir cursor-review && cd cursor-review
npm init -y
npm pkg set type=module           # @cursor/sdk is ESM
```

## 2. Install dependencies

```bash
npm install @cursor/sdk zod
npm install -D typescript tsx @types/node
```

- `@cursor/sdk` — the agent runtime (public beta).
- `zod` — runtime validation of the model's JSON (our structured-output guarantee).
- `tsx` — run `.ts` directly, no build step.

## 3. Minimal `tsconfig.json`

Only needed for editor types — `tsx` runs without it.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 4. Set your API key

```bash
export CURSOR_API_KEY="key_..."   # from the Cursor Dashboard
```

## 5. The single file — `review.ts`

```typescript
/**
 * review.ts — one-shot AI code review over a git diff, via the Cursor SDK.
 *
 * Usage:
 *   git diff | npx tsx review.ts          # diff from stdin
 *   npx tsx review.ts change.diff         # diff from a file
 *
 * Requires CURSOR_API_KEY in the environment.
 */
import { readFileSync } from "node:fs";
import { Agent } from "@cursor/sdk";
import { z } from "zod";

// ── 1. Output contract ────────────────────────────────────────────────
// The SDK has no `outputSchema`, so we *declare* the shape, *ask* the model to
// honor it, then *validate* what comes back. zod is the enforcement layer:
// if the model drifts, .parse() throws instead of returning garbage.
const Criterion = z.object({
  score: z.number().int().min(1).max(5),
  note: z.string().min(1),
});

const ReviewSchema = z.object({
  correctness: Criterion,
  security: Criterion,
  performance: Criterion,
  readability: Criterion,
  testCoverage: Criterion,
  comment: z.string().min(1), // free-form overall verdict
});
type Review = z.infer<typeof ReviewSchema>;

// ── 2. "System prompt" (role injection) ───────────────────────────────
// The Cursor SDK does NOT expose a system-prompt field — Cursor staff confirmed
// the built-in system prompt can't be replaced. So we lead the send with a
// strong role + output contract. (Native alternative: a subagent `prompt`,
// shown at the bottom of the walkthrough.)
const SYSTEM_PROMPT = `
You are a senior code reviewer. You receive a unified git diff and return a
strict review. Score each of five criteria from 1 (poor) to 5 (excellent):
correctness, security, performance, readability, testCoverage. Every score needs
a one-sentence note grounded in the diff — not generic advice. Then write a
free-form "comment" with the overall verdict and the single highest-impact change.

Respond with exactly ONE JSON object and nothing else — no prose, no markdown
fences. Use this shape:
{
  "correctness":  { "score": <1-5>, "note": "<text>" },
  "security":     { "score": <1-5>, "note": "<text>" },
  "performance":  { "score": <1-5>, "note": "<text>" },
  "readability":  { "score": <1-5>, "note": "<text>" },
  "testCoverage": { "score": <1-5>, "note": "<text>" },
  "comment": "<free-form overall comment>"
}
`.trim();

// ── 3. Read the diff parameter ─────────────────────────────────────────
function readDiff(): string {
  const fileArg = process.argv[2];
  const diff = fileArg ? readFileSync(fileArg, "utf8") : readFileSync(0, "utf8"); // fd 0 = stdin
  if (!diff.trim()) {
    throw new Error("Empty diff — pipe `git diff` or pass a .diff file.");
  }
  return diff;
}

// ── 4. Optional custom tool (delete the whole block if unused) ─────────
// Local agents already have built-in file/grep/search tools over `cwd`, so the
// reviewer can open files the diff references. Custom tools are for reaching
// OUTSIDE the repo — e.g. serving the team rubric on demand instead of inlining it.
const customTools = {
  get_review_rubric: {
    description: "Return the team's review rubric and severity thresholds.",
    async execute() {
      return [
        "Block merge if security < 3 or correctness < 3.",
        "New branches without tests => testCoverage <= 2.",
      ].join("\n");
    },
  },
};

// ── 5. Run the agent ───────────────────────────────────────────────────
async function main(): Promise<void> {
  const diff = readDiff();

  const agent = await Agent.create({
    apiKey: process.env.CURSOR_API_KEY!,
    model: { id: "composer-2.5" }, // check `GET /v1/models` for current ids
    mode: "agent",
    local: { cwd: process.cwd(), customTools },
  });

  const run = await agent.send(`${SYSTEM_PROMPT}\n\n=== DIFF ===\n${diff}`);
  const { status, result } = await run.wait();
  if (status !== "finished" || !result) {
    throw new Error(`Agent ${status}: no result returned.`);
  }

  // Strip accidental ```json fences, then validate against the contract.
  const json = result.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  const review: Review = ReviewSchema.parse(JSON.parse(json));

  console.log(JSON.stringify(review, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
```

## 6. Run it

```bash
# Review the current uncommitted changes
git diff | npx tsx review.ts

# Or review a saved diff
git diff main...HEAD > change.diff
npx tsx review.ts change.diff
```

Example output:

```json
{
  "correctness":  { "score": 4, "note": "Null check added before token decode fixes the crash path." },
  "security":     { "score": 2, "note": "JWT secret is read from a hardcoded fallback string." },
  "performance":  { "score": 5, "note": "No hot-path changes; lookup stays O(1)." },
  "readability":  { "score": 4, "note": "Clear naming, but the nested ternary in verify() hurts." },
  "testCoverage": { "score": 1, "note": "New expiry branch has no accompanying test." },
  "comment": "Solid bug fix, but ship-blocked: remove the hardcoded secret fallback and add a test for the expiry branch before merge."
}
```

---

## Notes & honest caveats

- **System prompt:** there is no `systemPrompt`/`instructions`/`rules` field on
  `Agent.create`. We approximate it via prompt injection. The nearest *native*
  mechanism is a named subagent:

  ```typescript
  const agent = await Agent.create({
    apiKey: process.env.CURSOR_API_KEY!,
    model: { id: "composer-2.5" },
    local: { cwd: process.cwd() },
    agents: {
      "code-reviewer": {
        description: "Strict senior code reviewer",
        prompt: SYSTEM_PROMPT,   // a subagent's prompt acts like its system message
        model: "inherit",
      },
    },
  });
  // then delegate to it in your send, e.g. "Use the code-reviewer subagent to ..."
  ```

  You can also drop the same rubric into `.cursor/rules/` and the local agent picks it up.

- **Structured output is a contract you enforce, not a feature.** The SDK returns
  text. `zod.parse()` is what makes the JSON trustworthy — keep it. For higher
  reliability you can add a one-shot retry: on `ZodError`, re-`send` the parse
  error back to the same agent ("Your last reply failed validation: …; return
  valid JSON only").

- **Tools are optional here.** The diff is the whole input, so the built-in
  file/grep tools (and the optional `get_review_rubric`) are bonus context, not
  required. Delete the `customTools` block to go truly minimal.

- **Beta surface — pin versions.** Model ids (`composer-2.5`), option names, and
  event shapes can shift. Confirm current model ids via `GET /v1/models`.

- **Cloud variant:** swap `local: { cwd }` for `cloud: { repos: [...] }` to run
  the same review inside a sandboxed VM (and `autoCreatePR: true` to push fixes).

### Sources
- [Cursor TypeScript SDK reference](https://cursor.com/docs/sdk/typescript)
- [Cursor SDK announcement](https://cursor.com/blog/typescript-sdk)
- [Forum: SDK system prompt (Cursor staff: "you can't customize that system prompt today")](https://forum.cursor.com/t/cursor-sdk-system-prompt/159379)
```
