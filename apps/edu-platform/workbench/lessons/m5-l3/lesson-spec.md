# Lesson Spec: m5-l3 — Code Review w erze AI: standardy, kryteria i Agent w pipeline

> **Backpropagated from the shipped draft on 2026-06-14.** The lesson diverged from the original plan during drafting; this spec now reflects `lesson-draft.md` as the source of truth, not the pre-draft intent. Where the draft dropped a planned beat (a dedicated "DoD as a Zod schema" section; the explicit "required status check vs label" merge-gate teaching), this spec records that.

## Schema Context

- Course: 10xdevs-3
- Module: m5 — AI-Native Teamwork
- Position: moduleOrder 3 / globalOrder 23
- Depends on: m5-l2 — Twój pierwszy Agent zespołowy: SDK, koszty, metryki
- Prepares for: m5-l4 — Shared AI Registry (separate topic — light, implicit pivot, **not** a setup)

## Prework Continuity

- Relevant prework: [1.2] Chatbot/Agent/Harness; [4.2] "a good project has CI/CD"; [3.5] models.
- Assumed from prework: the agent/harness model; that mature projects have CI/CD as a baseline ([4.2]).
- Deepened here: from "CI/CD exists" → "an AI agent *lives inside* CI as a step in the team process." GitHub Actions mechanics are **new** here — prework never teaches them.
- Avoid repeating: harness/agent theory, the project-quality checklist from [4.2].

## Prework + Neighbor Continuity (the mission)

m5-l2 and m5-l3 are **one mission, one artifact**: the team's code-review agent. l2 built it on localhost (diff → scored structured output, on Claude SDK + AI SDK 6) and measured it for cost/privacy, introducing promptfoo as the "is it good?" concept. l3 takes that *same* agent off localhost and onto the "autostrada na produkcję" — a GitHub Actions pipeline that runs it on every PR, packages it as a reusable Composite Action, tests it with promptfoo, and grows it from a one-shot scorer into a tool-using actor. m5-l4 is a **different** problem (sharing AI artifacts across a team) — this lesson closes the review-agent arc and pivots out lightly.

## Lesson Job

Carry the learner from *a review agent on my laptop* to *a review agent that runs on every team PR without me*. Teach the minimum GitHub Actions needed to run the l2 agent on a `pull_request`, pass the provider key from repository secrets, package the agent as a reusable Composite Action (and pin third-party actions to a SHA), build the whole thing as a normal feature via the 10x research→plan→implement flow seeded by a `requirements.md` brainstorm, protect the agent from its own regressions with a promptfoo eval matrix (model comparison via OpenRouter), and show how the *same* `ToolLoopAgent` climbs the "ladder of agency" from scorer to actor by adding tools. Then, in Deep Dive, dissect the production reference `10x-impl-review-ci` as a two-layer skill, and give a framework for scaling AI review across a team without pretending humans disappear.

## Thesis

A review agent only earns its keep when it runs *without you* — as a step in the pipeline, where all changes to production cross — and it gets there by being built and grown like any other part of the system, not configured once and forgotten.

## Learning Outcomes

- Wire a self-built code-review agent into a GitHub Actions workflow triggered on a pull request (plus manual `workflow_dispatch`), passing the provider key from repository secrets into the step.
- Map the core GHA vocabulary (workflow, trigger, job, step, action, runner) onto a real review workflow file.
- Package the agent as a reusable Composite Action and consume it from a one-step workflow, pinning third-party actions to a commit SHA.
- Drive the CI/CD build with the 10x research → plan → implement flow seeded by a `requirements.md` brainstorm, scoping an MVP review contract (criteria, labels, retry).
- Use promptfoo as a CI gate to compare models across vendors via OpenRouter and catch silent prompt regressions, instead of judging a change on a single PR.
- Extend the agent from a one-shot scorer to a tool-using actor by adding `tools` to the same `ToolLoopAgent`, keeping the loop safe with a hard step limit and reading token cost from `onStepFinish`.
- Place a new tool on the read → write → whole-GitHub → external "ladder of agency" and choose read-only first.
- Read `10x-impl-review-ci` as a production reference, explaining its two-layer split and why an auto-loaded skill self-structures a prose verdict while a self-built agent enforces a schema.
- Design a risk-based triage + metrics + learning-loop scheme for scaling AI review across a team without removing humans from critical paths.

## Audience Starting Point

The learner just built and measured a local review agent (l2) and feels productive with it — but it only helps the person who runs it. They likely think "putting it in CI" means a wall of scary YAML, assume CI/CD config is something you copy from Stack Overflow rather than build, and assume a turnkey tool (`10x-impl-review-ci`) is strictly better than their own. They also underestimate how little separates their current "agent" from a chatbot — one prompt, one model call, one structured output — and have not yet seen the move from scorer to tool-using actor.

## Behavioral Change

When a review task is worth doing on every PR, the learner ships their agent into CI as a reusable action, builds it with the same research→plan→implement discipline as application code, guards it with a promptfoo eval matrix before it judges other people's PRs, and grows it by adding tools to the same loop — instead of running review by hand on their own machine.

## Owned Concepts

- Shipping a self-built code-review agent from localhost into a GitHub Actions PR pipeline: the minimum GHA vocabulary (workflow, trigger, job, step, action, runner) and a minimal `pull_request` + `workflow_dispatch` review workflow.
- Passing the LLM provider key from GitHub repository secrets into the review step (the ephemeral-runner model; the key is not on the runner).
- Packaging the agent as a reusable **Composite Action**: `action.yml` with `using: composite`, inputs/outputs, `github.action_path`, per-step `shell`; local-subfolder vs separate-repo hosting; pinning third-party actions to a commit SHA.
- Treating the CI/CD workflow as a normal feature built with the **10x research → plan → implement** flow, seeded by a `requirements.md` brainstorm that scopes an MVP review contract (input params, 1–10 review criteria, side-effect labels `ai-cr:passed`/`ai-cr:failed`, on-demand retry label).
- Operationalizing **promptfoo** as a model-comparison + regression gate in CI: `promptfooconfig.yaml` (prompts/providers/tests), **OpenRouter** as a single-key multi-vendor provider, `is-json`/`llm-rubric`/`javascript` assertions, the result matrix, and `PROMPTFOO_PASS_RATE_THRESHOLD`.
- The **tool loop** as the path from scorer to agent: `ToolLoopAgent` + `Output.object` vs adding `tools` (`tool()` = description/inputSchema/execute), the validate → execute → continue loop, step-limit safety (`stopWhen: stepCountIs`, the runaway-loop / `isLoopFinished` cost risk, `onStepFinish` token telemetry), and the read → write → whole-GitHub → external **ladder of agency**.
- `10x-impl-review-ci` as the production reference, read through its **two-layer split** (`SKILL.md` run-mechanics vs `references/impl-review-instructions.md` portable criteria) and why an auto-loaded skill self-structures a prose verdict while a self-built SDK agent enforces a schema.
- Deep Dive: **scaling AI review across a team** — throughput-not-replacement, risk-based triage, cost/time as a metric via `onStepFinish`, the human-override / bug-on-green learning loop feeding the review criteria and the promptfoo set.

## References Only

- Building the local agent from SDK primitives (Claude SDK / AI SDK 6) — owned by m5-l2; here it is the artifact the CI calls and the class the tools attach to.
- promptfoo *as a concept* — introduced in m5-l2 (here: operationalized, not re-introduced).
- Cost/privacy of the self-built agent — owned by m5-l2 (one callback: the auth path is now the CI's secret).
- Authoring & distributing team standards / shared registry — owned by m5-l4 (standards appear here only as the **input** the agent enforces via review criteria).
- harness/agent model — prework [1.2]; CI/CD as a project requirement — prework [4.2]; model tiers — prework [3.5].

## Must Not Cover

- Authoring or distributing the team's shared standards/skills/rules (m5-l4).
- Building the local agent from SDK primitives (m5-l2).
- Async & remote agents (m5-l5).
- A general GitHub Actions / CI-CD course beyond what's needed to run the agent (incl. OIDC, the full ruleset / branch-protection UI).
- Re-introducing promptfoo from scratch (m5-l2).
- A `claude-code-action` / Claude Code Skills tutorial — the Deep Dive uses the production skill as contrast + adoption, not a feature tour.

## Required Example Or Demo

The **same l2 code-review agent**, now run by the CI. Canonical flow (shown in the embedded video): a PR is opened → a GHA workflow checks out and runs the agent with the provider key injected from secrets → the agent returns a scored verdict → labels `ai-cr:passed`/`ai-cr:failed` land and a verdict status check gates the merge. Across the lesson the same agent is (1) packaged as a Composite Action, (2) compared across models with a promptfoo matrix over OpenRouter, and (3) extended with a first read-only tool (`readPlan`) to show the scorer→actor move. Secondary, read-not-built: `10x-impl-review-ci` as the production reference (Deep Dive).

## Structural Logic Map

This maps the **shipped draft**'s sections (six main + a two-part Deep Dive).

1. **Intro (no heading) — from localhost to the autostrada.**
   - Question answered: "I built an agent on the SDK — what's the next step?"
   - Introduces: the localhost→pipeline gap; one-line recap of the l2 artifact; the lesson roadmap (infra → build → test → Deep Dive skills).
   - Risk: re-explaining how the agent was built (l2's job) — recap in one breath.

2. **GitHub Actions: minimum, żeby ruszyć.**
   - Question answered: "How does my script run on every PR, automatically?"
   - Introduces: GHA vocabulary (workflow/trigger/job/step/action/runner) as a composition hierarchy (**mermaid**); runner types & cost; a minimal `review.yml` (`pull_request` to master + `workflow_dispatch`; checkout + setup-node + `npm ci` + `npm run review` with the key from `secrets`). Folds in the secrets/ephemeral-runner idea.
   - Diagram: **yes** — the workflow→trigger→job→step→action composition hierarchy.
   - Risk: GHA-from-zero rabbit hole — cap at "enough to run the agent."

3. **Composite Action: agent jako reużywalny plugin.**
   - Question answered: "How do I stop copying this workflow into ten repos?"
   - Introduces: the one-repo problem; Composite Actions as a parametrized, injectable unit (vs reusable workflows); `action.yml` (`using: composite`, branding, inputs/outputs, `github.action_path`, per-step `shell`); two hosting options (separate repo vs `.github/actions/<name>/`); the consumer workflow shrinking to one step; the SHA-pinning supply-chain rule.
   - Diagram: **yes** — reusable actions → master workflow.
   - Risk: turning into a full actions-authoring course — keep to packaging the agent.

4. **Integracja Github Actions z Agentem do Code Review.**
   - Question answered: "How do I actually build this — the same way as app code?"
   - Introduces: the 10x research→plan→implement flow; `requirements.md` as a brainstorm seed; the MVP review contract (input params, 1–10 criteria `{{CR_CRITERIA}}`, parked items, side-effect labels, retry behavior); CI/CD as a feature, not magic config. Closes with the embedded course video.
   - Diagram: empty (the video carries the demo).
   - Risk: re-teaching the 10x workflow (prior modules) — frame as "same pattern, new target."

5. **Testowanie zmian w Agentach z promptfoo.**
   - Question answered: "I changed the model/prompt — is it actually better?"
   - Introduces: the optimization-carousel trap (sample-size-one fortune-telling); promptfoo's three pieces (prompts/providers/tests); **OpenRouter** multi-vendor providers; assertions (`is-json`/`llm-rubric`/`javascript`); the result matrix (pass/fail + cost + time); silent-regression catching; `PROMPTFOO_PASS_RATE_THRESHOLD`.
   - Diagram: empty (a result-matrix asset + a video placeholder stand in).
   - Risk: re-introducing promptfoo from zero (m5-l2 did) — operationalize only.

6. **Więcej możliwości dla agenta.**
   - Question answered: "Why is this even an 'agent' and not a chatbot — and where does it go next?"
   - Introduces: the scorer form (`ToolLoopAgent` + `Output.object`) as a conscious MVP; the name *Tool**Loop**Agent* as the hint; `tool()` (description/inputSchema/execute); the `readPlan` example; the tool loop (**mermaid**); step-limit safety (`stopWhen: stepCountIs`, the `isLoopFinished` cost trap, `onStepFinish`); the read → write → whole-GitHub → external **ladder of agency**.
   - Diagram: **yes** — the tool loop (model ↔ validate ↔ execute, with the step-limit safety valve).
   - Risk: drifting into an SDK API tour — keep to the scorer→actor move and the ladder.

7. **🧑🏻‍💻 Zadania praktyczne** — four tasks (criteria → forced-shape agent → promptfoo model comparison → optional agency).

8. **🔎 Deep Dive (two parts):**
   - **D-A — Dwie warstwy skilla `10x-impl-review-ci`:** the production skill read as two layers — `SKILL.md` (run-mechanics tied to Claude Code Action: subagents, tasks, MCP inline comments, the `[skip ci]` commit, the verdict status check) vs `references/impl-review-instructions.md` (portable criteria: plan as source of truth, three analyses, seven dimensions, severity/impact finding grammar). Why the split: durable criteria vs swappable mechanics; and the structuring contrast (we enforce a schema because we own the loop; the skill keeps prose criteria because the harness self-structures).
   - **D-B — Code review w skali zespołu:** AI review as throughput-not-replacement; four threads — triage (not every PR is equal), triage deciding who has the last word, cost/time as a metric (via `onStepFinish` → dashboard), the learning loop (human-override / bug-on-green) feeding back into the review criteria and the promptfoo set.

## Failure Mode To Disarm

The learner treats CI/CD as opaque config to copy, ships their agent once and never guards it, and assumes a turnkey tool is automatically better than their own. The lesson disarms this by (1) building the pipeline as a normal feature with research→plan→implement, (2) putting a promptfoo eval matrix *in front of* the agent before it judges the team, and (3) reading the production reference honestly — what it adds, what it assumes, and why its structure differs — so adoption is a choice, not a default. Secondary (Deep Dive): "AI can review everything, drop the humans" — disarmed by risk-based triage + the override/bug-on-green learning loop.

## Suggested Structure

(Mirrors the shipped draft. Transitions noted as previous → this → next.)

1. **Intro prose (no heading)** — localhost→autostrada; recap the l2 artifact; roadmap.
2. **GitHub Actions: minimum, żeby ruszyć** — vocabulary + minimal `review.yml` + secrets.
3. **Composite Action: agent jako reużywalny plugin** — `action.yml`, hosting, SHA pinning.
4. **Integracja Github Actions z Agentem do Code Review** — 10x flow + `requirements.md` MVP + video.
5. **Testowanie zmian w Agentach z promptfoo** — OpenRouter matrix, assertions, regression gate.
6. **Więcej możliwości dla agenta** — scorer→actor, `tool()`, the loop, step safety, ladder of agency.
7. **🧑🏻‍💻 Zadania praktyczne** — (1) define review criteria; (2) wire criteria into the agent with a forced output shape (structured output + schema); (3) compare 2–3 models with a promptfoo matrix and leave it as a regression gate; (4) **optional** — add 1–2 tools, read-mode first.
8. **🔎 Deep Dive** — two parts: the two-layer `10x-impl-review-ci`; scaling AI review across a team.
9. **📚 Materiały dodatkowe** — GitHub Actions docs, Creating a composite action, Using secrets, promptfoo docs, Vercel AI SDK Tools, OpenRouter Quickstart.

> Note: the draft does **not** include a standalone "Odbierz swoją odznakę" badge line, nor a dedicated "DoD jako schemat Zod" section. Structured output appears inside section 6 (the scorer) and as the Deep Dive contrast. The merge-gate mechanics live in the video, not the prose.

## Video Placeholders

- **Course video-scenario (requiredArtifact), embedded after section 4** (Vimeo 1200973339): the canonical flow on the self-built agent — open a PR with a planted SQL injection, the GHA workflow runs the agent, `ai-cr:failed` + a red `ai-cr/verdict` status land and block the merge; fix the code and add tests, push, the verdict flips to `ai-cr:passed`/green and the merge unblocks. **The status-check + gh-api gate mechanics live here, not in the prose.** Validated end-to-end 2026-06-10 on przeprogramowani/10xCards PR #19 (fail: score 1.4 → fix: score 4.6).
- **Inline VIDEO PLACEHOLDER in section 5:** promptfoo as an anti-optimization-carousel — a short `promptfooconfig.yaml` with two–three OpenRouter models on the same diff set, `npx promptfoo eval`, walking the result matrix, showing a silent regression after a prompt edit, and how the same eval blocks merge as a CI step.

## Bridge In

From m5-l2: "You have a working, measured local review agent — now it runs *without you*, on every PR, as a reusable step in the pipeline." From prework [4.2]: CI/CD was a good-project requirement; here an AI agent lives inside it.

## Bridge Out

The review-agent mission (m5-l2 → m5-l3) is complete: a measured, eval-guarded agent runs on every PR as a reusable action and has started climbing the ladder of agency. The pivot to m5-l4 is **light and implicit** — the Deep Dive forward-references extending the agent (plan-as-review-input), and m5-l4 separately tackles how a whole team **shares** its AI artifacts (skills, commands, rules). No hard setup of m5-l4's content.

## Open Questions

- **Merge-gate teaching depth (carried forward).** The draft defers the status-check + `gh api` gate mechanics to the video and only alludes to "bramka, która zatrzyma merge" in prose (intro to sections 2–3). Decide whether the text should teach the required-status-check vs label distinction explicitly or keep deferring to the video — potential unpaid promise. (Grounding has the full status-check research ready if the text should be expanded.)
- **`stepCountIs(20)` as the default.** The draft asserts the AI SDK default is "stops after 20 steps." Verified `stepCountIs(20)` is the canonical example in AI SDK v6, but the default-when-omitted value was not confirmed from primary source — verify at publish.
- **Toolkit wiring gap.** `10x-toolkit` course-content `module-05/lesson-03.ts` still carries the m5-l4 title and wires no skills; the draft's `npx @przeprogramowani/10x-cli@latest get m5l3` delivery claim requires wiring `10x-impl-review-ci` to m5l3 before publish.
- **promptfoo version freshness.** Behavior pinned on 0.120.15 (0.121.x hard-requires Node ≥22.22; TS provider hit `ERR_UNKNOWN_FILE_EXTENSION`, `.mjs` provider used) — re-verify at publish.
- **Model-ID freshness.** OpenRouter slugs in the draft (`claude-haiku-4.5`, `claude-sonnet-4.6`, `gpt-5-mini`) are current-not-perennial — re-verify at publish.

## Side-Effect Ledger

New claims introduced: Composite Actions mechanics + SHA-pinning; AI SDK v6 tool loop (`tool()`, `ToolLoopAgent`+`tools`, `stopWhen`/`stepCountIs`, `isLoopFinished`, `onStepFinish`); the read→write→whole-GitHub→external ladder of agency; OpenRouter as a single-key multi-vendor promptfoo provider; the `requirements.md`-seeded MVP for a CI/CD feature; the two-layer structure of `10x-impl-review-ci`.
Claims removed (vs the original plan): the dedicated "DoD as a Zod schema" beat and the explicit "required status check vs label" merge-gate teaching — not in the shipped draft (gate deferred to video; structuring shown via `Output.object`).
Neighboring lesson references changed: none edited — m5-l2 referenced as the CI's artifact + the tool-loop class; m5-l4 boundary unchanged (mustNotCover).
Prework references used: [1.2] harness; [4.2] CI/CD as a project requirement; [3.5] models.
Prework concepts repeated intentionally: (none — assumed, not retaught).
Potential duplicates: m5-l2 (agent build, promptfoo, cost/privacy — fenced to referencesOnly); m5-l4 (standards authoring/distribution — fenced to mustNotCover).
Unsupported facts: the `stepCountIs(20)`-default claim (verify); the Deep Dive team-scaling framework + override-rate sketch (reasoned design, not measured consensus); the claude-code-action buffering-classifier model string (unpinned); OpenRouter model IDs (current-not-perennial).
Video/text mismatches: the video shows the full merge-gate flow; the prose only alludes to the gate — intentional but flagged (see Open Questions).
Needs human decision: merge-gate teaching depth; `stepCountIs(20)` default; toolkit wiring; promptfoo version; model-ID freshness.
