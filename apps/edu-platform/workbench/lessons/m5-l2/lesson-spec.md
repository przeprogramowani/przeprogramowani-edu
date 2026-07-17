# Lesson Spec: m5-l2 — Twój pierwszy Agent zespołowy: SDK, koszty, metryki

## Schema Context

- Course: 10xdevs-3
- Module: m5 — AI-Native Teamwork
- Position: moduleOrder 2 / globalOrder 22
- Depends on: m5-l1 — AI Internal Builders: wewnętrzne narzędzia, serwisy i automatyzacje
- Prepares for: m5-l3 — Code Review w erze AI: standardy, DoD i Agent w pipeline

## Prework Continuity

- Relevant prework lessons: [1.2] Chatbot vs Agent vs Harness; [2.2] Cursor / [2.3] Claude Code podstawy; [3.5] Rekomendowane modele i OpenRouter.
- Assumed from prework: agent = model + tool use; harness = środowisko, uprawnienia, pamięć robocza, kontrola; the learner has operated off-the-shelf harnesses (Cursor, Claude Code, Codex) across m1–m4.
- Deepened here: "harness" stops being a thing you *operate* and becomes a thing you *assemble* from SDK primitives. The category split is NOT harness-vs-loop (the agent loop lives inside both, and both produce a harness) — it is **how much of the agent ships assembled**: a *ready-made-agent SDK* hands you the whole agent (loop + tools + sandbox), an *assemble-it-yourself SDK* hands you the loop + mounting points and you build the harness around it. Tool use stops being built-in magic and becomes something you either get for free (ready-made-agent SDK) or wire yourself (assemble-it-yourself SDK).
- Avoid repeating: the chatbot/agent/harness definitions, tool-use theory, prompt patterns, context engineering. Recap only as a one-beat pivot.

## Lesson Job

Carry the learner across the line from *consuming* off-the-shelf agents to *building* one. After four modules of operating someone else's harness inside an IDE or terminal, this lesson hands them the SDK primitives to assemble their own agent — and frames the first real decision they now face: a ready-made-agent SDK that ships the whole coding agent, or an assemble-it-yourself SDK where they bring the tools. It grounds the abstraction in one concrete local artifact (a code-review agent), then makes that agent real-world-ready: who sees its data, what it costs, and how good it is.

## Thesis

Building your first team agent isn't about a smarter prompt — it's about dropping one level below the IDE to SDK primitives, and the first fork that decides everything downstream is ready-made-agent SDK vs assemble-it-yourself SDK.

## Learning Outcomes

- Explain the difference between a ready-made-agent SDK and an assemble-it-yourself SDK, and pick the right category for a given task.
- Build a minimal local agent (code review: diff → structured output) using an SDK instead of an off-the-shelf tool.
- Implement the same scenario on a ready-made-agent SDK (Claude Agent SDK) and an assemble-it-yourself SDK (AI SDK 6), and articulate what you get for free vs. what you wire yourself.
- Reason about a self-built agent's privacy and data exposure from the auth path it uses.
- Instrument a self-built agent for operational cost and metrics (tokens, cost ceilings, success/latency).
- Choose among Claude / Codex / Cursor / OpenRouter / Vercel SDKs using a category + ecosystem decision table.
- Recognize evals (e.g. promptfoo) as the systemic way to improve a self-built agent, distinct from operational metrics.

## Audience Starting Point

The learner is fluent at *driving* AI tools but has never written agent code. They likely think "building an agent" means a clever system prompt, conflate "agent SDK" with "another chatbot wrapper," and assume the SDK they pick is mostly a branding choice. They worry it's a big leap from using Cursor to writing TypeScript that calls a model in a loop. They underestimate that the moment their code holds the API key, the privacy and cost questions become *theirs*.

## Behavioral Change

When a repeatable task outgrows ad-hoc IDE prompting, the learner reaches for an SDK, deliberately picks ready-made vs assemble-it-yourself, and builds a small local agent they can reason about on cost, data, and quality — instead of forcing the work back into an off-the-shelf tool.

## Owned Concepts

- The ready-made-agent-SDK vs assemble-it-yourself-SDK distinction as the lesson's core mental model (both produce a harness; the split is how much ships pre-assembled, not loop-vs-no-loop).
- Assembling your own agent from SDK primitives vs operating an off-the-shelf harness.
- Building the same local code-review agent on a ready-made-agent SDK (Claude) and an assemble-it-yourself SDK (AI SDK 6).
- Operational cost & metrics for a self-built **local** agent (token usage, cost ceilings, run observability).
- The SDK privacy model: no SDK has its own data regime; the auth path you choose decides training/retention/residency.
- Choosing an SDK by category + ecosystem (decision table across the five SDKs).
- Evals (promptfoo) as systemic, quality-side improvement of a self-built agent (concept-level).

## References Only

- chatbot / agent / harness definitions, tool use — owned by prework [1.2].
- model selection, OpenRouter as a gateway — owned by prework [3.5].
- operating Cursor / Claude Code / Codex as off-the-shelf tools — owned by m1–m4 and prework 2.x.
- internal-tool & automation *use cases and motivation* — owned by m5-l1.

## Must Not Cover

- Running the agent in CI/CD or a review pipeline — owned by m5-l3.
- Code-review standards / Definition of Done — owned by m5-l3.
- Shared team registry of skills/commands/rules — owned by m5-l4.
- Async & remote agents — owned by m5-l5.
- Re-teaching prompt patterns / context engineering — owned by prework m3.

## Required Example Or Demo

The single-file **local code-review agent** from the lesson's research folder: takes a git diff, returns a structured JSON review (scored criteria + comment), run on the developer's machine (`git diff | npx tsx review.ts`). Built once on the **Claude Agent SDK** (ready-made: persona via systemPrompt, native structured output, tools available for free) and once on **AI SDK 6** (assemble-it-yourself: `ToolLoopAgent` + `Output.object` + `stopWhen`, you assemble what the ready-made agent gave you). The *same* scenario is the constant; the SDK category is the variable. Deliberately local — CI/pipeline is m5-l3's bridge-out.

## Structural Logic Map

1. **Beat: The wall you just hit.**
   - Question answered: "I can drive Cursor/Claude Code — why would I write agent code?"
   - Introduces: the gap between operating an off-the-shelf agent and needing one that runs your way (recap of m5-l1's "what to build", now asking "how").
   - Depends on: m5-l1 motivation; m1–m4 tool experience.
   - Sets up: the drop to SDK primitives.
   - Risk: re-motivating automations/CI use cases that belong to m5-l1 — keep to one callback.

2. **Beat: Operate → assemble (the pivot recap).**
   - Question answered: "Wait, isn't the harness the tool I already use?"
   - Introduces: harness as something you *assemble*, not just operate; one-line recap of [1.2], no re-definition.
   - Depends on: prework [1.2].
   - Sets up: the core distinction.
   - Risk: sliding into a full agent/harness re-teach.

3. **Beat: The one distinction — ready-made-agent SDK vs assemble-it-yourself SDK.**
   - Question answered: "Aren't all agent SDKs basically the same?"
   - Introduces: the two categories — ready-made-agent SDKs ship the whole coding agent (file/bash/sandbox/loop), assemble-it-yourself SDKs ship only the loop + a model-agnostic interface, you bring tools. Stress that the loop is common to both, so the axis is "how much ships assembled," not "loop vs no loop."
   - Depends on: beat 2.
   - Sets up: the two-SDK example.
   - Diagram opportunity: mermaid — two columns, "ready-made-agent SDK: goal in → built-in tools + loop + result" vs "assemble-it-yourself SDK: you supply tools → loop primitive → result"; the contrast is the teaching point.
   - Risk: abstract taxonomy before any code — keep short, promise the proof in the next beat.

4. **Beat: Same scenario, Claude Agent SDK (ready-made).**
   - Question answered: "What does building one actually look like?"
   - Introduces: the local code-review agent on Claude — systemPrompt as persona, native structured output, tools-for-free, `maxTurns`.
   - Depends on: beat 3.
   - Sets up: the assemble-it-yourself contrast.
   - Risk: becoming a syntax dump — each code element must map to "what the ready-made agent gave me."

5. **Beat: Same scenario, AI SDK 6 (assemble-it-yourself).**
   - Question answered: "And what changes if I pick the other category?"
   - Introduces: `ToolLoopAgent` + `Output.object` + Zod, `stopWhen`, you wire the loop/output yourself; TS/Next-native.
   - Depends on: beat 4 (same scenario as the constant).
   - Sets up: the "how much agent you get for free" payoff and the downstream concerns.
   - Diagram opportunity: optional — side-by-side "what's built-in vs what you write" for the two builds.
   - Risk: implying one is better; the point is *category fit*, not winner.

6. **Beat: Now the API key is in YOUR code — privacy.**
   - Question answered: "Who sees this diff now that it's not Cursor sending it?"
   - Introduces: no SDK has its own privacy regime; the **auth path** (first-party API vs cloud vs subscription/BYOK/gateway) decides training, retention, residency.
   - Depends on: beats 4–5 (your code now holds the credential).
   - Sets up: the cost section (same auth path also decides billing).
   - Risk: drifting into a full compliance matrix — give the rule + the few sharp examples, not the whole table.

7. **Beat: What did it cost? — operational costs & metrics.**
   - Question answered: "If this runs often, what does it cost and is it healthy?"
   - Introduces: token usage from the SDK, cost ceilings, run metrics (success/latency/tokens) — for the **local** path. **OpenRouter strength injected here:** its built-in `stopWhen: maxCost(amount)` is the sharpest single illustration of a hard dollar ceiling, contrasted with AI SDK 6 needing a custom `StopCondition` for the same — a natural "the assemble-it-yourself SDK you pick changes your cost-control story" aside without leaving the AI SDK build.
   - Depends on: beat 6 (auth path → pricing).
   - Sets up: deep dive (picking an SDK is partly a cost/control decision) and the eval distinction.
   - Diagram opportunity: none — a small table beats a diagram here.
   - Risk: drifting into CI/observability infra (that's m5-l3); keep it to instrumenting the local run.

8. **Beat: Deep dive — picking the SDK (decision table).**
   - Question answered: "These two aren't my only options — how do I choose?"
   - Introduces: tight table — Codex, Cursor, OpenRouter (+ the two already shown), each as category + 1–2 standout strengths + 1 weakness; "pick by ecosystem" shortcut. **OpenRouter's row carries its real differentiators** — 400+ models behind one `callModel`, fallback routing, and the `maxCost` ceiling already met in beat 7 — as the "provider-agnostic + hard cost cap" option, not a generic assemble-it-yourself SDK.
   - Depends on: beat 3 (category axis) and beat 7 (where `maxCost` was first shown).
   - Sets up: the quality/eval beat.
   - Diagram opportunity: none — the table *is* the artifact.
   - Risk: ballooning into the 20-criteria reference doc; cap at the decision-relevant rows.

9. **Beat: Is it any good? — evals as systemic tuning.**
   - Question answered: "I can build and run one — how do I make it measurably better, not just vibes?"
   - Introduces: evals (promptfoo) as the quality counterpart to operational metrics; systemic tweaks driven by an eval set, not one-off prompt nudges.
   - Depends on: beat 7 (distinguish operational vs quality metrics).
   - Sets up: bridge-out to m5-l3 (a measured agent is ready for a pipeline).
   - Risk: turning into a promptfoo tutorial — keep concept-level, one concrete picture.

10. **Beat: Bridge out.**
    - Question answered: "I have a working, measured local agent — what's next?"
    - Introduces: nothing new; hands off to m5-l3 (this agent in a review pipeline with standards/DoD).
    - Depends on: all prior.
    - Risk: pre-empting m5-l3's pipeline content.

## Failure Mode To Disarm

The learner picks an SDK by brand familiarity ("I use Claude, so Claude SDK") and treats the choice as cosmetic — then hits a wall when the task actually needed the other category (e.g. they wanted provider-swapping + a hard cost cap and reached for a ready-made-agent SDK). The lesson exposes this by making them build the *same* thing twice and feel where each category fits, so the decision becomes "ready-made or assemble-it-yourself?" before "which vendor?".

## Suggested Structure

1. **Hook — the wall** — why off-the-shelf isn't enough for a team agent; drop to SDKs.
   ```text
   (none) -> hook -> pivot recap:
   Re-uses m5-l1's "what to build" only as a one-line callback; must NOT re-argue use cases or introduce SDK syntax yet.
   ```
2. **Core distinction — ready-made vs assemble-it-yourself** — the two categories + diagram.
   ```text
   hook -> distinction -> two-SDK build:
   Establishes the axis everything hangs on; must NOT yet pick a winner or dive into per-SDK detail.
   ```
3. **Same scenario, two SDKs** — Claude (ready-made) then AI SDK 6 (assemble-it-yourself), one code-review agent.
   ```text
   distinction -> build -> privacy:
   Proves the axis with code; must NOT drift into CI execution or a third SDK.
   ```
4. **Privacy — the auth path decides** — your code holds the key now.
   ```text
   build -> privacy -> costs:
   Consequence of owning the credential; must NOT become a full compliance matrix.
   ```
5. **Costs & metrics (dedicated)** — operational cost/observability for the local agent.
   ```text
   privacy -> costs/metrics -> deep dive:
   Operational ("what did it cost / is it healthy"); must NOT cover CI pipelines (m5-l3) or eval quality yet.
   ```
6. **Deep dive — pick the SDK + make it better** — decision table; then promptfoo/evals.
   ```text
   costs/metrics -> deep dive -> bridge out:
   Selection + systemic quality improvement; must NOT become a reference doc or a promptfoo tutorial.
   ```

## Video Placeholders

- Screencast: build & run the local code-review agent on the Claude Agent SDK, then the same diff through the AI SDK 6 version — show the *same* JSON review out, and narrate "what was built-in vs what I wrote." Supports beats 4–5; must stay local (no CI).

## Bridge In

From m5-l1 (what internal tools/automations are worth building) and prework [1.2] (you've operated a harness): "You know what to build and you've driven these agents — now you assemble one yourself."

## Bridge Out

To m5-l3: "You have a working, measured local review agent. Next: give it team standards and a Definition of Done, and put it in the pipeline." The local→CI handoff is deliberate.

## Open Questions

- **Provisional schema enrichment for m5-l2 (recorded for a later `lessons-schema.json` update — not yet applied):**
  - `owns`: ready-made-agent-SDK vs assemble-it-yourself-SDK distinction; assembling an agent from SDK primitives; same local code-review agent on Claude SDK + AI SDK 6; operational cost & metrics for a local self-built agent; SDK privacy = auth-path-decided; SDK selection (category + ecosystem) decision table; evals (promptfoo) as systemic quality improvement.
  - `referencesOnly`: chatbot/agent/harness definitions & tool use (prework [1.2]); model selection / OpenRouter gateway (prework [3.5]); operating Cursor/Claude Code/Codex (m1–m4); internal-tool use cases & motivation (m5-l1).
  - `mustNotCover`: CI/CD & pipeline execution (m5-l3); code-review standards / DoD (m5-l3); shared team registry (m5-l4); async/remote agents (m5-l5); prompt patterns / context engineering (prework m3).
  - `learningOutcomes`: the seven outcomes listed above.
- Does the dedicated "koszty, metryki" section need its own grounding pass on the June-15-2026 Claude billing change and per-SDK cost-ceiling primitives? (Research already in `privacy/privacy-summary.md` + `sdk-comparison.md`.)
- **RESOLVED (per user, framing):** the core contrast is **"ready-made-agent SDK" vs "assemble-it-yourself SDK"** (PL: *„gotowy agent" kontra „agent do złożenia"*), NOT the earlier "harness SDK vs loop/loop-primitive SDK". Rationale: the agent loop is an implementation detail shared by both categories, and both ultimately produce a harness — so naming one side "loop" and the other "harness" was a false contrast. Keep "pętla/agent loop" only as the shared mechanism and "harness" only as the end-product (the prework [1.2] sense). Applies across spec, draft, and lessons-schema.json.
- **RESOLVED (per user):** the second build SDK is **AI SDK 6** (ready-made vs assemble-it-yourself is shown with Claude vs AI SDK 6). OpenRouter is **not** a third full build — instead its strengths (`maxCost` ceiling, 400+ models, fallback routing) are **injected "here and there"**: as the cost-ceiling contrast in beat 7 and as its own differentiated row in the beat-8 decision table.

## Side-Effect Ledger

New claims introduced: (none — spec only; all SDK claims trace to the lesson's research folder and remain to be re-verified at grounding/draft time)
Claims removed: the in-draft custom-tools demo was cut from lesson-draft.md (AI SDK `tool()`/`inputSchema`, Claude `createSdkMcpServer`/`mcpServers`/`allowedTools`/streaming-input, the `pruneDiff` example). Back-prop applied: Required Example/Demo + beat 5 no longer cite `tool()`; the AI SDK 6 groundingSource `relevance`/`claimsSupported` trimmed of the `tool() + inputSchema` / "tools is a record not an array" specifics. The category framing ("you wire tools yourself") stays — it is no longer proven with a hands-on custom-tool build.
Neighboring lesson references changed: (none — boundaries with m5-l1/m5-l3 documented, not edited)
Prework references used: [1.2] Chatbot vs Agent vs Harness; [2.2]/[2.3] tool basics; [3.5] models/OpenRouter
Prework concepts repeated intentionally: harness/agent definition — one-beat pivot recap only (beat 2), explicitly not a re-teach
Potential duplicates: m5-l1 (automation motivation — fenced to referencesOnly); m5-l3 (pipeline/CI + review standards — fenced to mustNotCover)
Unsupported facts: SDK API surfaces, pricing, and privacy terms are from 2026-06-08 research notes flagged "verify against live docs" — must be re-grounded before draft
Video/text mismatches: (n/a — video supports beats 4–5 only)
Needs human decision: schema enrichment values above; whether second SDK stays AI SDK 6 vs OpenRouter; whether costs/metrics needs a fresh grounding pass; the now-orphaned "Claude Agent SDK — Custom tools" link in the draft's *Materiały dodatkowe* (its section was removed) — keep as further reading or drop
