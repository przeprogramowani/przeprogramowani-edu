# Lesson Grounding: m5-l2 — Twój pierwszy Agent zespołowy: SDK, koszty, metryki

## Scope

- Lesson source: `lesson-spec.md` (Direction A — "operate a harness → assemble one"); schema slot m5-l2.
- Neighbor boundaries: m5-l1 (AI Internal Builders — owns the *why/what* of internal automations) and m5-l3 (Code Review w pipeline — owns CI/CD execution + review standards/DoD). Both are still empty schema placeholders; no neighbor spec/draft exists yet, so this brief avoids sourcing pipeline/CI and review-standards material that belongs to m5-l3.
- Relevant prework: [1.2] Chatbot vs Agent vs Harness; [2.2]/[2.3] Cursor & Claude Code basics; [3.5] models / OpenRouter gateway.
- Research posture: **light + targeted top-up** — mostly synthesized from the existing research already in this folder (all checked 2026-06-08). Two follow-up passes were run on 2026-06-08 via Context7 + official docs: (1) **promptfoo evals** coverage for the Claude Agent SDK and AI SDK 6, and (2) confirming the **AI SDK 6 structured-output API** for the now-written loop-side walkthrough. Remaining flag-and-verify items are under "Open Verification Questions."

> Source-of-truth note: this brief is a synthesis layer over five per-SDK research notes, two cross-SDK synthesis docs (`sdk-comparison.md`, `privacy/privacy-summary.md`), and three runnable walkthroughs already in `workbench/lessons/m5-l2/`. Those files carry the full citation lists; this brief curates what the **draft** needs and what must be re-verified before publication.

## Claims To Support

- **The core distinction is real, not cosmetic** — agent SDKs split into *ready-made-agent SDKs* (ship the whole coding agent: file/bash/sandbox/loop, assembled into a harness) and *assemble-it-yourself SDKs* (ship the loop + mounting points + a model-agnostic interface; you bring the tools and build the harness). The agent loop lives inside both and both produce a harness — the axis is how much ships pre-assembled, not loop-vs-no-loop. — frames the whole lesson — needs: cross-SDK synthesis + per-SDK docs.
- **Claude Agent SDK is a ready-made-agent SDK** — runs the loop in your process on your filesystem, ships 14+ built-in tools, `query()` entry point, `systemPrompt` defines the agent's persona, native structured output via `outputFormat: { type: "json_schema" }`, `maxTurns` bounds the loop; renamed from Claude Code SDK in Sept 2025; TS package bundles a native binary. — anchors beat 4 — needs: official docs + the walkthrough.
- **AI SDK 6 is an assemble-it-yourself SDK** — `ToolLoopAgent` + `tool()` + Zod, `stopWhen` (default `stepCountIs(20)`), `inputSchema` (not `parameters`), Apache-2.0, stable since 2025-12-22, talks direct-to-provider with the AI Gateway optional. — anchors beat 5 — needs: official docs + announcement.
- **The same scenario builds on both** — a single-file local code-review agent: git diff in → structured JSON review (scored criteria + comment), run on the dev's machine. — the lesson's spine artifact — needs: the walkthrough (already written for Claude).
- **No SDK has its own privacy/billing regime** — data/training/retention/residency are inherited from the backend and, critically, from the **auth path** you choose. — anchors beat 6 (privacy) — needs: privacy synthesis.
- **Costs & metrics are operational and auth-path-driven** — token usage comes off the step/usage objects; cost ceilings exist as primitives (OpenRouter `maxCost`, AI SDK `stepCountIs`); the June 15 2026 Claude billing change splits programmatic usage onto a separate credit. — anchors beat 7 — needs: privacy/cost synthesis + Anthropic Help Center.
- **The other three SDKs have distinct centers of gravity** — Codex (wraps the `codex` CLI over JSONL, per-turn sandbox presets, lockstep versioning), Cursor (durable agents, cloud/self-host/local runtimes, codebase indexing, public beta Apr 28 2026), OpenRouter (400+ models, fallback routing, `maxCost`). — anchors beat 8 (decision table) — needs: per-SDK docs.
- **Evals are the systemic way to improve a self-built agent** — distinct from operational metrics; promptfoo is the named tool, with a first-class `anthropic:claude-agent-sdk` provider and a `file://` custom-provider path for the AI SDK build. — anchors beat 9 — needs: promptfoo docs (**now verified 2026-06-08**).

## Strong Sources

### Claude Agent SDK — official documentation

- URL: https://code.claude.com/docs/en/agent-sdk/overview · https://platform.claude.com/docs/en/agent-sdk/typescript
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-08
- Supports:
  - Harness category: built-in tools (Read/Write/Edit/Bash/Glob/Grep/WebSearch/WebFetch/…), `query()` async-generator entry point, loop runs in your process on your filesystem, session state as JSONL.
  - `systemPrompt` = the agent's persona; `outputFormat: { type: "json_schema" }` native structured output (read from `message.structured_output`); `tools: []` removes built-ins; `maxTurns` bounds the loop.
  - Rename Claude Code SDK → Claude Agent SDK (Sept 2025); TS package bundles a native binary; auth via `ANTHROPIC_API_KEY` (+ Bedrock/Vertex/Foundry routing).
- Use in lesson: the harness half of the two-SDK build; the "how much agent you get for free" point.
- Confidence: high
- Notes: TS **V2 preview** drops async-generator coordination for `send()`/`stream()` — preview, do not teach as the stable surface. Full detail in `claude-sdk.notes.md` + `claude-sdk-walkthrough.md`.

### AI SDK 6 (`ai` package) — official documentation

- URL: https://vercel.com/blog/ai-sdk-6 · https://ai-sdk.dev/docs/agents/building-agents · https://ai-sdk.dev/docs/agents/loop-control
- Type: official-docs
- Author/publisher: Vercel
- Checked: 2026-06-08
- Supports:
  - Assemble-it-yourself category: `ToolLoopAgent` implements the `Agent` interface; `tool()` + Zod `inputSchema`; `stopWhen` with `stepCountIs(n)` (default 20), `hasToolCall(name)`, `isLoopFinished()`; arrays = OR; custom `StopCondition` for token/cost ceilings.
  - Direct-to-provider by default (`@ai-sdk/anthropic`, …); AI Gateway optional via model strings; structured final output `Output.object({ schema })` (counts as an extra step); `needsApproval` HITL; MCP via `@ai-sdk/mcp`.
  - License Apache-2.0 (confirmed three primary sources); stable since 2025-12-22; `latest` 6.0.197; v7 already in canary.
- Use in lesson: the loop half of the two-SDK build; the "you assemble what the harness gave you" contrast.
- Confidence: high
- Notes: `inputSchema` not `parameters` (v6); `tools` is a record, not an array; default step cap 20. Full detail in `vercel-ai-sdk.notes.md`.

### Codex SDK — official documentation

- URL: https://developers.openai.com/codex/sdk · https://github.com/openai/codex/blob/main/sdk/typescript/README.md
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-06-08
- Supports:
  - Harness category with a distinct transport: **wraps the `codex` CLI as a subprocess, JSONL over stdio**; `Codex` client → `startThread()` → `run()`/`runStreamed()`; threads persist to `~/.codex/sessions`.
  - Per-turn sandbox presets (`read_only` / `workspace_write` / `full_access` — plan read-only then apply); first-class `outputSchema`; lockstep version pin to `@openai/codex` CLI; needs the CLI runtime present; `workingDirectory` must be a Git repo unless `skipGitRepoCheck`.
- Use in lesson: decision-table row — "you already live in the OpenAI/Codex ecosystem and want sandbox presets."
- Confidence: high
- Notes: Full detail in `codex-sdk.notes.md`.

### Cursor SDK — official blog, changelog, docs

- URL: https://cursor.com/blog/typescript-sdk · https://cursor.com/docs/cloud-agent/api/endpoints
- Type: official-docs / technical-post
- Author/publisher: Cursor
- Checked: 2026-06-08
- Supports:
  - Harness-as-infrastructure: `@cursor/sdk`, durable `Agent.create` + per-prompt runs; three runtimes (Cloud sandboxed VM / Self-hosted / Local); codebase indexing + semantic search baked in; `customSubagents`, MCP, hooks; **public beta, released Apr 28 2026**.
- Use in lesson: decision-table row — "turn a coding agent into deployable infrastructure (CI auto-PR fleets), IDE takeover."
- Confidence: medium-high
- Notes: **Public beta — pin versions; exact event payloads, `Agent.create` option types, `mode` enum, model IDs may shift.** Structured output is NOT surfaced as a primary feature — do not claim it. Secondary writeups (MarkTechPost/DevOps.com/Composio/Kingy) are framing-only. Full detail in `cursor-sdk.notes.md` + `cursor-sdk-review-walkthrough.md`.

### OpenRouter Agent SDK — official documentation

- URL: https://openrouter.ai/docs/agent-sdk/overview · https://openrouter.ai/docs/agent-sdk/call-model/api-reference
- Type: official-docs
- Author/publisher: OpenRouter
- Checked: 2026-06-08
- Supports:
  - Assemble-it-yourself category, gateway-first: `@openrouter/agent`, single `callModel` loop; **400+ models** behind one interface; `models: [...]` fallback routing; richest stop conditions including **`maxCost(amount)`**, `maxTokensUsed(n)`, `finishReasonIs(reason)`; `tool()` + Zod with four modes (execute / generator / manual / HITL).
- Use in lesson: decision-table row — "provider choice + hard cost ceilings matter more than a built-in harness"; the strongest *cost-ceiling* primitive for beat 7.
- Confidence: high
- Notes: One fetched page misread it as "Anthropic's official toolkit" — it is **OpenRouter's**; do not repeat the misread. Verify `@openrouter/agent` vs `@openrouter/sdk` package split and `input:` vs `messages:` form before quoting syntax. Full detail in `openrouter-agent-sdk.notes.md`.

### Cross-SDK synthesis — feature/architecture (internal)

- URL: workbench/lessons/m5-l2/sdk-comparison.md
- Type: internal-course-material
- Author/publisher: 10xDevs workbench (synthesized 2026-06-08)
- Checked: 2026-06-08
- Supports: the harness-vs-loop framing, the 20-criteria detail, and the at-a-glance 5-SDK matrix that the deep-dive decision table compresses.
- Use in lesson: source for beats 3 and 8; the matrix is the skeleton for the lesson's tight decision table.
- Confidence: high (as a synthesis of the per-SDK notes)
- Notes: Beta surfaces flagged inside; the 20 numbered criteria describe the original four inline with Vercel in an addendum.

### Cross-SDK synthesis — privacy, data & pricing (internal)

- URL: workbench/lessons/m5-l2/privacy/privacy-summary.md
- Type: internal-course-material
- Author/publisher: 10xDevs workbench (compiled 2026-06-08, verification pass same day)
- Checked: 2026-06-08
- Supports:
  - The headline privacy rule (no SDK owns its data regime; the **auth path** decides) and the per-SDK training/retention/residency table.
  - Cost section: Claude Opus 4.x $5/$25, Sonnet 4.x $3/$15, Haiku 4.5 $1/$5 per MTok; **June 15 2026** programmatic-usage credit split (Help Center #15036540); Codex 1 credit = $0.04; Cursor Composer 2.5 rates; OpenRouter `maxCost` + platform fees; Vercel SDK free (Apache-2.0).
- Use in lesson: source for beats 6 and 7. **Operational** cost/metrics only — keep CI/observability infra out (m5-l3).
- Confidence: medium-high — most prior `[unverified]` items resolved against primary sources; a few minor items remain (see that file's ledger).
- Notes: Pricing is fast-moving — frame numbers as "as of mid-2026," not perennial truth.

### Local code-review agent — runnable walkthrough (internal)

- URL: workbench/lessons/m5-l2/claude-sdk-walkthrough.md
- Type: internal-course-material
- Author/publisher: 10xDevs workbench
- Checked: 2026-06-08
- Supports: the concrete spine artifact — empty repo → installed dep → one `review.ts` that takes a diff and returns a 5-criteria scored JSON review; `git diff --staged | npx tsx review.ts`. Explains *why* each knob (`systemPrompt`, `outputFormat`, `tools: []`, `maxTurns`) maps to "what the harness gave me."
- Use in lesson: the Claude (harness) build in beat 4 and the video. The AI SDK 6 (loop) counterpart is not yet written as a walkthrough — see Open Questions.
- Confidence: high
- Notes: Sibling walkthroughs exist for Cursor (`cursor-sdk-review-walkthrough.md`) and OpenRouter (`openrouter-agent-sdk.walkthrough.md`) if the draft wants a third illustration.

### Promptfoo — evals for the self-built agent (systemic-improvement beat) — VERIFIED 2026-06-08

- URL: https://www.promptfoo.dev/docs/providers/claude-agent-sdk/ · https://www.promptfoo.dev/docs/providers/python/ (custom-provider pattern) · https://www.promptfoo.dev/docs/providers/openai-codex-sdk/
- Type: official-docs (vendor)
- Author/publisher: promptfoo
- Checked: 2026-06-08 (Context7 `/websites/promptfoo_dev` + official docs)
- Supports:
  - **The same code-review agent can be wrapped in a promptfoo eval** — turning "is it good?" into a repeatable test set, the quality counterpart to operational metrics.
  - **Claude Agent SDK has a first-class provider:** id `anthropic:claude-agent-sdk` (alias `anthropic:claude-code`), config keys `working_dir`, `model`, `permission_mode`, `append_allowed_tools`, `max_turns`, `output_format` (JSON schema for structured output). Needs `@anthropic-ai/claude-agent-sdk` installed.
  - **Codex SDK has a first-class provider:** id `openai:codex-sdk`.
  - **AI SDK 6 has NO dedicated provider** — you wrap it with the **custom JavaScript provider** (`id: file://review-provider.ts` exporting an `ApiProvider` with an async `callApi(prompt, context)` that calls your agent and returns `{ output }`). This is the standard escape hatch and is fully supported (typed `ApiProvider`/`ProviderResponse` from the `promptfoo` package).
  - **Assertions** that fit the review agent: `is-json` (validate against the review schema), `javascript`/`python` (assert score bounds / required keys), `llm-rubric` (judge the free-form comment). A `defaultTest.assert` block applies checks to every case.
- Use in lesson: ground the evals beat concretely — Claude side gets a one-line `anthropic:claude-agent-sdk` provider; AI SDK side gets a tiny `file://` wrapper; both share one eval set + `is-json` assertion. Keep it concept-level in prose (don't turn the lesson into a promptfoo tutorial), but the config is now real, not hand-waved.
- Confidence: high (providers + custom-provider pattern + assertions all confirmed on official docs).
- Notes: **The `promptfoo eval` run is LOCAL** — exactly the lesson's scope. The `promptfoo-action` GitHub Action (before/after on PRs) is the CI path and belongs to m5-l3 — name it only as a forward reference, do not teach it here.

## Practitioner Signals

### "AI IDE → programmable / deployable infrastructure" framing (Cursor SDK)

- URL: marktechpost.com (2026-04-29) · devops.com · composio.dev · kingy.ai (all in `cursor-sdk.notes.md`)
- Type: technical-post / practitioner-signal
- Signal: the recurring industry framing that an SDK turns an interactive coding agent into headless, deployable infrastructure — the exact "operate → assemble" pivot the lesson opens on.
- Useful language: "programmable coding agents," "deployable infrastructure," "headless agents."
- Risk: secondary vendor-adjacent writeups; weak for facts. Use only for framing the hook, never for a technical claim.
- Confidence: low (as evidence); medium (as language)

## Examples Worth Using

- **The spine:** the single-file `review.ts` code-review agent (diff → structured JSON review) — built on Claude (harness) and AI SDK 6 (loop). The *constant* scenario is the teaching device; the SDK category is the variable.
- **Built-in vs you-wire-it contrast:** Claude's `tools: []` + `outputFormat` (the harness hands you structured output and tools) vs AI SDK 6's `tool()` record + `Output.object` + explicit `stopWhen` (you assemble it). Same JSON out; different amount of "agent" for free.
- **Cost-ceiling primitive made concrete:** OpenRouter `stopWhen: maxCost(0.50)` vs AI SDK 6 needing a custom `StopCondition` for the same — the sharpest single illustration of "the assemble-it-yourself SDK you pick changes your cost-control story."
- **Sandbox-as-a-knob (Codex):** plan in `read_only`, apply in `workspace_write` within one thread — a vivid harness-SDK capability for the deep-dive row.
- **One eval set, two providers (beat 9):** the same review test set runs against the Claude build via `providers: [anthropic:claude-agent-sdk]` and against the AI SDK build via `providers: [{ id: file://review-provider.ts }]`, sharing one `is-json` + score-bounds assertion — "is it good?" made repeatable and local. Reinforces that the *agent* changed but the *eval* didn't, exactly like the spine's "same scenario, different SDK."
- **Failure mode:** picking by brand ("I use Claude → Claude SDK") then needing provider-swap + a hard cost cap (an OpenRouter/loop job) — the lesson's disarmed mistake.

## Claims To Avoid Or Soften

- **No "winner" SDK.** The point is category fit (ready-made vs assemble-it-yourself) and ecosystem, not a ranking. Avoid "best SDK."
- **Pricing numbers are dated.** Frame Opus/Sonnet/Haiku and per-SDK rates as "as of mid-2026"; they move. Don't present a price as a stable fact.
- **June 15 2026 billing credit** — real and primary-sourced (Help Center #15036540), but mechanics (amounts, no rollover/pooling) should be stated as "on subscription plans, programmatic usage draws a separate monthly credit" and verified against the live article before publishing; don't hard-code dollar amounts without the recheck.
- **Beta / preview surfaces** — Cursor SDK (public beta), Claude TS **V2 preview**, AI SDK **v7 canary**: teach the stable surface, mark anything beta as "may shift," pin versions in any code.
- **Cursor structured output** — not surfaced as a primary feature; don't claim Cursor has first-class structured output like Codex/AI SDK.
- **OpenRouter ≠ "Anthropic's toolkit"** — a fetch misread; it's OpenRouter's gateway SDK.
- **EU data residency** — Cursor has no self-serve EU residency; the Vercel Gateway is US-only. State these as the documented caveats, not as absolute/permanent.
- **Evals/promptfoo** — the providers and config are now verified, but keep the *prose* concept-level so the lesson doesn't turn into a promptfoo tutorial. The `promptfoo-action` (PR before/after in CI) is m5-l3 territory — forward-reference only, don't teach it here.
- **CI/CD execution** — belongs to m5-l3. The costs/metrics section instruments the **local** run; the eval is `promptfoo eval` run **locally**; do not drift into pipelines, runners, or observability infra.

## Resolved This Pass (2026-06-08)

- **Second build SDK = AI SDK 6 (decided by user).** Ready-made vs assemble-it-yourself is shown with **Claude vs AI SDK 6**. OpenRouter is **not** a third full build; its strengths are **injected "here and there"** — `maxCost` as the cost-ceiling contrast in beat 7, and a differentiated "provider-agnostic + hard cost cap" row in the beat-8 decision table. The OpenRouter walkthrough (`openrouter-agent-sdk.walkthrough.md`) stays available as optional illustration, not a required second build.
- **AI SDK 6 code-review walkthrough** — WRITTEN: [`vercel-ai-sdk-review-walkthrough.md`](./vercel-ai-sdk-review-walkthrough.md). Mirrors the Claude walkthrough beat-for-beat (same diff→JSON review), built on `ToolLoopAgent` + `Output.object` + `tool()`. API confirmed via Context7 + ai-sdk.dev: `new ToolLoopAgent({ model, instructions, tools, output: Output.object({ schema }), stopWhen })` → `const { output } = await agent.generate({ prompt })`; structured output costs an extra step; `tools` is a record; `inputSchema` not `parameters`.
- **promptfoo coverage** — VERIFIED: first-class `anthropic:claude-agent-sdk` provider, `openai:codex-sdk` provider, and the `file://` custom-JS provider path for the AI SDK build; `is-json` / `javascript` / `llm-rubric` assertions. See the promptfoo source entry above.

## Open Verification Questions

- **June 15 2026 Claude credit** — confirm current amounts + mechanics against Anthropic Help Center #15036540 at publish time (pricing is fast-moving).
- **Minor privacy items still `[unverified]`** in `privacy/privacy-summary.md` (attestation currency, beta-stage disclosures, enterprise-negotiated EU terms) — only matters if the draft quotes those specifics.

## Schema Source Update

Updated the m5-l2 entry in `workbench/lessons-schema.json`:

- Added 10 curated `groundingSources` (the five per-SDK official docs, the two internal synthesis docs, the Claude code-review walkthrough, the **AI SDK 6 code-review walkthrough**, and the **upgraded promptfoo evals** source), each with `claimsSupported`, `confidence`, `checkedAt: 2026-06-08`, and notes flagging beta/fast-moving items.
- Set `status` to `grounded`.
- `sideEffectLedger.unsupportedFacts` trimmed to the genuinely-open items (dated pricing; beta surfaces) — the "promptfoo coverage" and "AI SDK 6 walkthrough not written" items were **resolved this pass** and removed.
- `sideEffectLedger.needsHumanDecision` keeps the two real decisions (AI SDK 6 vs OpenRouter as the second build SDK; June 15 billing recheck).
- Did **not** touch `owns` / `referencesOnly` / `mustNotCover` / `learningOutcomes` — those remain the spec's recorded proposal pending the separate schema-enrichment decision.
