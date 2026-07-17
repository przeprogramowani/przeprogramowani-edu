# 10xDevs 3 Prework - release candidate improvement report

Date: 2026-04-24

Scope: lessons listed as release candidates in `todo.md`, including crossed-out items that are already drafted or represented by video-script placeholders.

Additional scenario materials reviewed:

- `scenarios/scenario_pattern.md`
- `scenarios/cursor_scenario.md`
- `scenarios/claude_code_scenario.md`

Main course context reviewed:

- `.ai/10x-devs/course/10x-devs-spec.md`

Reviewed files:

- `01-1x1_co_potrafi_ai_w_2026r.md`
- `02-1x2_chatbot_vs_agent_vs_harness.md`
- `04-2x1_agent_w_ide_terminalu_czy_chmurze.md`
- `05-2x2_cursor_podstawy_operacyjne.md`
- `06-2x3_claude_code_podstawy_operacyjne.md`
- `07-2x4_agent_native_ide.md`
- `09-3x1_llmy_i_ich_wplyw_na_codzienna_prace.md`
- `10-3x2_wzorce_i_antywzorce_promptowania.md`
- `11-3x3_cykl_zycia_watku_i_zarzadzanie_kontekstem.md`
- `12-3x4_jezyk_pracy_z_ai.md`

## Executive summary

The release candidates have a strong and commercially relevant thesis: 2026 AI work is less about "asking ChatGPT" and more about operating agents, harnesses, tools, context, and asynchronous workflows. This direction is well aligned with demanding programmers.

The main risk is credibility. Several lessons make very specific claims about current product names, model versions, commands, context windows, and benchmarks. Because the audience is technical and current tooling changes quickly, unsupported or slightly wrong claims will be noticed immediately.

The second risk is source-of-truth clarity across mixed lesson formats. Lessons 01, 02, 04, 09, 10, 11, and 12 are self-contained text lessons. Lessons 05 and 06 are video lessons whose public lesson files intentionally contain lightweight wrappers, while the substantive scripts live in `scenarios/cursor_scenario.md` and `scenarios/claude_code_scenario.md`. That is a valid structure for prework, but it should be explicit in the content workflow so reviewers, editors, and future maintainers know that the scenario files are the authoritative body for those lessons. Lesson 07 still looks like a raw bullet script and needs either the same explicit scenario treatment or a rewrite into a learner-facing lesson.

The third risk is that the prework is currently heavy on conceptual framing and light on operational artifacts. For programmers using AI daily, the most valuable missing layer is "what do I do on Monday morning": concrete checklists, command examples, safety gates, prompt contracts, escalation patterns, and failure signals.

After reviewing the main course specification, this should be interpreted as a prework calibration issue, not a request to move the whole main course into prework. The prework should not fully teach MCP, eval systems, worktrees, QA agents, CI/CD automation, legacy-project context architecture, or team AI registries. Those are explicitly core-module topics. The prework should instead create readiness: shared vocabulary, expectations, risk awareness, tool orientation, and clear handoffs into the main modules.

## Priority findings

### P0 - Fix before publishing

Updated.

### P1 - High-impact improvements

**Add a repeated "operational takeaway" pattern to every lesson.**
   Each lesson should end with 3 items:
   - one decision rule,
   - one safety check,
   - one action the participant can apply in their own workflow.

**Make every lesson answer: "what changes in my daily engineering work?"**
   The current texts explain the ecosystem well, but often stop before concrete behavior. Add explicit patterns such as: when to start a new thread, when to ask for plan mode, when to use a terminal agent, when to refuse autonomous edits, when to split agents into worktrees, when to downgrade reasoning effort.

**Add "failure modes" to each major concept.**
   Demanding programmers will expect edge cases. For every recommended workflow, add how it fails:
   - agent in cloud cannot reproduce local environment and require dedicated config,
   - tool-call loop burns budget,
   - context compaction drops a key decision,
   - worktrees create merge/integration burden,
   - subagents improve isolation but increase coordination and cost.

### P2 - Editorial cleanup

**Fix typos and Polish grammar before release.**
   Examples found: `Naprawde`, `skutecznize`, `tera`, `zabiera siędo`, `co raz`, `konfigurać`, `zachowanej`, `zdala`, `poinedynke`, `Curora`.

**Unify capitalization.**
   The lessons alternate between `agent`, `Agent`, `Agenci`, `LLMem`, `Ciebie`. House style should choose one convention. Recommended: lowercase `agent` unless it starts a sentence or is part of a product/name.

**Avoid expanding common acronyms.**
   The style guide says not to expand common acronyms, but `CLI (Command Line Interface)` appears in `02`.

**Reduce dramatic absolutes.**
   Claims like "gwarancja porażki", "bezlitośnie tnie trafność", "nowa epoka" can work occasionally, but frequent absolutes reduce credibility with senior engineers. Prefer "często", "zwiększa ryzyko", "w praktyce".

## Systemic content gaps

### Missing repo-state discipline

The current lessons mention worktrees and branches, but not the day-to-day discipline that makes agents safe:

- start from clean `git status`,
- isolate large tasks in worktrees or branches,
- ask the agent to summarize intended write scope,
- commit checkpoints before `/clear`,
- inspect diff before continuing,
- never mix exploratory edits with final implementation,
- keep generated context files separate from source files.

This should be previewed especially in lessons 04, 10, and 11, then handed off explicitly to Module 1 and Module 2.

### Missing team workflow dimension

The audience is programmers using AI in daily work, often inside teams. The main course covers AI-native teamwork in Module 5, so prework should not over-index on this. Still, add a short teaser that solo habits eventually become team conventions:

- shared `AGENTS.md` / `CLAUDE.md` ownership,
- PR review norms for AI-authored code,
- documenting accepted agent workflows,
- naming conventions for agent branches/worktrees,
- CI as a non-negotiable verification layer,
- when agent output needs senior review,
- how to prevent "AI changed this because it looked cleaner" diffs.

This would make the material feel more serious without prematurely teaching the full Module 5 material.

### Missing examples of "bad but plausible" AI work

The lessons describe hallucination and context rot, but examples are often abstract. Add one or two short, realistic failure snippets where the concept is introduced:

- a migration that passes tests but locks a table,
- a React/Svelte mismatch imported from training priors,
- a test that asserts the implementation instead of behavior,
- a "fixed" error by swallowing exceptions,
- a refactor that changes public API,
- a generated dependency update that violates team policy.

The audience will learn faster from plausible failures than from general warnings. Keep the exhaustive failure taxonomy for the main modules.

## Lesson-by-lesson review

### `02-1x2_chatbot_vs_agent_vs_harness.md`

**What works**

- The core distinction between model, agent, and harness is valuable and under-taught.
- The JSON `tool_use` example makes the agent loop tangible.
- The section on cost of autonomy is important.

**Missing or too vague**

- Harness is defined mostly as tools, guardrails, and context. Add scheduling, permission prompts, sandboxing, filesystem write policy, tool schemas, compaction, telemetry, and UI affordances.
- The lesson should explicitly separate:
  - model capability,
  - harness capability,
  - local environment capability,
  - user permission policy.
- Add "same model, different result" example: Claude/GPT inside a weak plugin versus inside a strong coding harness.

**Inconsistent or risky**

- `CLI (Command Line Interface)` violates the local style guide.
- The OODA expansion is heavier than needed for prework and introduces extra jargon.
- The quote "Humans steer. Agents execute" should be verified or paraphrased if not exact.
- The "rozkażesz" tone in examples can be softened; the course otherwise emphasizes steering and contracts.

**Recommended additions**

- Add a simple harness checklist:
  - can it read/search files well?
  - can it edit safely?
  - can it run commands with permissions?
  - can it preserve or compact context?
  - can it show a reviewable diff?
  - can it recover from failed tool calls?
- Add a section "Kiedy chatbot nadal wystarcza": quick explanation, naming, regex, tiny snippets, brainstorming. This prevents over-selling agents.

### `04-2x1_agent_w_ide_terminalu_czy_chmurze.md`

**What works**

- The three-environment comparison is useful and practical.
- The terminal/headless example is strong and concrete.
- The recommendation to combine an IDE with terminal agents is pragmatic.

**Missing or too vague**

- The cloud/agent-native section needs a risk model: environment parity, secrets, billing, repo permissions, review latency, and loss of visibility.
- Add task-to-environment mapping. The current table is good, but too broad. Senior programmers will want examples:
  - tiny UI copy edit -> IDE,
  - broad migration -> terminal agent with worktree,
  - dependency audit -> terminal/headless,
  - five independent prototype variants -> agent-native/worktrees,
  - production incident -> supervised mode only.
- Add minimum setup prerequisites for each environment.

**Inconsistent or risky**

- `todo.md` names this file differently, but the actual filename should be treated as the source of truth.
- The bottom links point to `/`.
- "Co raz" should be "Coraz".
- "Interesuje cię pracy" should be "Interesuje cię praca".
- "zabiera siędo pracy" needs spacing.
- Product claims around `Cursor 3.0`, `Claude Desktop`, and `Codex Desktop` should be verified or phrased less absolutely.

**Recommended additions**

- Add a "decision tree" instead of only a comparison table.
- Add an explicit warning: agent-native/cloud workflows are strongest when verification is automated and weakest when success depends on visual/product judgment.
- Add "recommended starting stack" with setup assumptions and why.

### `05-2x2_cursor_podstawy_operacyjne.md`

**What works**

- The intro frames Cursor as an evolving AI environment, not just an editor.
- The materials list covers modes, context, privacy, pricing, and best practices.
- The missing operational body largely exists in `scenarios/cursor_scenario.md`, which covers installation, subscription choices, privacy settings, indexing, modes, terminal AI, Agent mode, and project rules.

**Missing or too vague**

- The learner-facing lesson body is still not present. `{film - placeholder}` is not enough unless the platform embeds the final video and the scenario is treated as an internal production artifact.
- There are no learning goals, no prerequisites, no post-video checklist, no transcript, and no operational summary in the lesson file itself.
- The title promises "pięć trybów, trzy strumienie danych, jedna decyzja o modelu", but neither the lesson page nor the scenario clearly enumerates those five modes, three data streams, and one model decision in a way the learner can retain.
- The scenario has strong setup coverage, but it needs a clearer single demo flow. It currently reads more like a feature tour than one linear task completed from start to finish.

**Inconsistent or risky**

- `pokaże` should be `pokażę`.
- Cursor 3.0 should be fact-checked or qualified.
- If this is a video-only asset, status in `todo.md` should not imply text release readiness.
- Scenario-specific volatile claims need verification close to publication: `Composer` based on `Kimi K2.5`, `GPT-5.4`, exact Cursor pricing (`Pro+` at `$60`), and the exact privacy-mode labels.
- Typos in the scenario: `wykorzytują`, `zespołwoych`.

**Recommended additions**

- Convert `scenarios/cursor_scenario.md` into either the embedded transcript or a structured companion text:
  - What you will configure.
  - The five modes and when to use each, explicitly matching the title.
  - Context sources: selected files, codebase search, docs/rules.
  - Model selection: fast/default/reasoning, with cost and latency tradeoffs.
  - Safety: privacy settings, indexing, allowed actions, diff review.
  - 5-minute exercise.
- Add a concrete "first safe Cursor task" demo: open repo, add context with `@`, ask for a narrow change, inspect Code Review, run tests, accept/reject diff.

### `06-2x3_claude_code_podstawy_operacyjne.md`

**What works**

- Good positioning of Claude Code as a harness-driven terminal agent.
- The materials list covers quickstart, setup, slash commands, costs, permissions, and session management.
- The missing operational body largely exists in `scenarios/claude_code_scenario.md`, which covers install/login, subscription paths, `/init`, first prompt, permissions, `/rewind`, `/model`, `/clear`, and `/compact`.

**Missing or too vague**

- The actual learner-facing lesson body is missing. `{film - placeholder}` is not publishable alone unless the scenario is linked or embedded through the video player flow.
- The scenario provides a minimal command path, but the lesson page does not expose it:
  - install,
  - start in repo,
  - initialize memory,
  - inspect permissions,
  - plan,
  - edit,
  - review diff,
  - run tests,
  - clear/compact.
- The scenario covers permissions, but it needs a stronger warning about destructive shell commands, secrets, network access, accidental production operations, and when not to use `--dangerously-skip-permissions`.

**Inconsistent or risky**

- "Opus czy Sonnet" is vague; model names change quickly. Use "frontier/reasoning models" unless exact current names matter.
- "jakościowy harness" sounds imprecise. Prefer "dojrzały harness" or define what makes it mature.
- The scenario repeats the opening "Cześć..." in sections 1 and 2.
- Slash commands in the scenario need verification against the exact Claude Code version used in the recording: `/context`, `/diff`, `/rewind`, and double Escape are not listed in the checked public slash-command reference, while `/clear`, `/compact`, `/model`, `/cost`, `/permissions`, `/agents`, and `/init` are.
- Subscription prices and plan names (`Pro` at `$17`, `Max 5x` at `$100`) should be verified immediately before recording/release.
- Typos in the scenario: `pozostaniem`, `elementy konfiguracji`, `sesje`, `wszytko`.

**Recommended additions**

- Convert `scenarios/claude_code_scenario.md` into a learner-facing companion or transcript and add a "first safe session" script:
  - run on a clean branch,
  - ask for a plan first,
  - restrict write scope,
  - require tests,
  - inspect `git diff`.
- Add a small table of slash commands with when to use them: `/init`, `/permissions`, `/model`, `/compact`, `/clear`, `/agents`, `/cost`.
- Add an explicit "permission levels" warning: session-level approval is convenient, project-level approval should be intentional, and skip-permissions belongs only in disposable/sandboxed repos.

### `07-2x4_agent_native_ide.md`

**What works**

- Good intuition: the interface changes from code editing to agent/session control.
- Worktrees and parallel evaluation are the right topics for 2026 agent-native workflows.
- The manager metaphor can help participants understand the shift.

**Missing or too vague**

- This is a bullet outline, not a lesson.
- No H1 after frontmatter.
- No opening bridge, no coherent prose, no takeaway section, no materials.
- The `10xBench` example may be too internal unless you explain the generalizable pattern.
- The manager analogy needs constraints: managers still need review, metrics, integration, and accountability.

**Inconsistent or risky**

- `Codex Desktop`, `Claude Code` desktop wording, `Cursor 3.0`, and cloud VM claims should be verified.
- Typos: `poinedynke`, `Curora`, `zdala`.
- "magia" weakens the engineering tone.

**Recommended additions**

- Rewrite as a full lesson with this structure:
  - Why code disappears from the center of the UI.
  - Sessions are now the main unit of work.
  - Worktrees as isolation, not just convenience.
  - Parallel evaluation pattern.
  - Local vs cloud execution.
  - New review responsibilities.
  - When not to use agent-native tooling.
- Add a concrete workflow:
  - create 3 worktrees,
  - run 3 independent agents,
  - compare diffs,
  - merge one approach,
  - discard the rest.

### `09-3x1_llmy_i_ich_wplyw_na_codzienna_prace.md`

**What works**

- Strong conceptual lesson on probabilistic generation, reasoning tokens, context degradation, and token budgeting.
- The "potential vs expectations" framing is appropriate for serious programmers.
- The token budget section is useful and should be expanded across the course.

**Missing or too vague**

- The lesson needs more concrete examples of model failures in code that "looks right."
- The MECW concept needs clearer sourcing and qualification. If it is a course-specific heuristic, say so. If it is a research term, cite the source directly and avoid making it sound universal across all models.
- The context degradation diagram uses fixed thresholds (`40K`, `80K`, `120K+`) that may be misleading across models, harnesses, and task types. Mark them as heuristic, not rule.
- "Reasoning models" section should mention that hidden reasoning does not replace external verification.

**Inconsistent or risky**

- Model names `GPT-5.4`, `Claude Opus 4.7`, `Gemini 3.1 Pro`, and `GPT-5.3-Codex` should be verified. Official OpenAI docs currently show GPT-5.2/GPT-5.1/GPT-5 rather than GPT-5.4; if GPT-5.4 is internal or anticipated, do not present it as a public current model.
- "Chain of Thought" wording can imply visible or controllable reasoning. Modern systems often expose summaries, not raw chain of thought. Use "ukryte tokeny rozumowania" or "reasoning budget" instead.
- "Wrzucanie całego repozytorium to gwarancja porażki" is too absolute. Some tools index/search large repos well; the problem is unfiltered context, not repo size itself.

**Recommended additions**

- Add "three failure examples":
  - syntactically correct but semantically wrong,
  - test added without testing behavior,
  - context midpoint ignored.
- Add a "model selection" table:
  - fast model for mechanical edits,
  - reasoning model for ambiguous architecture,
  - specialized coding model for repo edits,
  - deep research only when source synthesis matters.
- Add a reminder: always move from model confidence to external verification.

### `10-3x2_wzorce_i_antywzorce_promptowania.md`

**What works**

- The thesis "prompt agenta jako kontrakt" is excellent.
- The layered prompt stack is one of the strongest parts of the prework.
- The anti-patterns are practical and relevant.

**Missing or too vague**

- Add prompt templates that participants can immediately reuse:
  - bugfix prompt,
  - refactor prompt,
  - code review prompt,
  - exploration-only prompt,
  - implementation-after-plan prompt.
- Add a distinction between "ask for plan" and "allow edits." This is central to safe agent work.
- Add examples of constraints beyond tests: write scope, files not to touch, public API, migration safety, performance budgets, accessibility, logging, observability.

**Inconsistent or risky**

- "Nie narzucaj kroków" is directionally correct for many reasoning models, but too broad. In regulated code, migrations, security-sensitive areas, and team conventions, steps can be necessary.
- The advice against examples needs nuance. Few-shot examples can still be useful for style, output format, or custom DSLs. The warning should target over-constraining problem-solving, not examples in general.
- `GPT-5.4` should be verified or generalized.
- "Pamięć" is described as automatic, but memory behavior differs widely by tool and organization settings.

**Recommended additions**

- Add a prompt contract checklist:
  - objective,
  - scope,
  - constraints,
  - context sources,
  - verification command,
  - output/report format,
  - permission boundary.
- Add "explore first, edit later" as a core pattern.
- Add a bad/good prompt pair for each major task type.

### `11-3x3_cykl_zycia_watku_i_zarzadzanie_kontekstem.md`

**What works**

- Very relevant and non-obvious topic.
- The `Write / Select / Compress / Isolate` map is a strong organizing framework.
- The lesson connects context management to practical commands and subagents.

**Missing or too vague**

- Add concrete thresholds as signals, not token counts:
  - agent repeats previous findings,
  - invents file paths,
  - ignores accepted constraints,
  - keeps patching around a failing test,
  - summary grows but decisions shrink.
- Add "what to save before clearing": current goal, accepted decisions, changed files, open risks, verification status, next prompt.
- Add a template for compacting:
  - "Preserve: final decisions, file paths, commands run, test status, unresolved risks. Drop: failed attempts, duplicate logs, intermediate speculation."

**Inconsistent or risky**

- Direct X quotes and product-specific claims should be either sourced carefully or paraphrased.
- `/rewind` and `Esc Esc` should be verified for the specific tool/version. If tool-specific, label it clearly.
- "Subagents in Claude Code and Codex" should be checked against the exact product capabilities available to participants.
- "Historia wątku jest nadal dostępna" after compacting may not be universally true depending on tool semantics.

**Recommended additions**

- Add a lifecycle diagram:
  - fresh thread,
  - exploration,
  - plan,
  - implementation,
  - verification,
  - compaction or handoff,
  - close/restart.
- Add "thread hygiene rules" for daily work:
  - one task per thread,
  - checkpoint decisions to files,
  - clear after topic change,
  - isolate exploration in subagents,
  - never continue a confused thread by adding more instructions.

### `12-3x4_jezyk_pracy_z_ai.md`

**What works**

- The core argument is strong: language choice is an engineering tradeoff, not a culture war.
- Tokenization, context rot, and ergonomics are a useful framing.
- The final recommendation is pragmatic: English for operational control, Polish for thinking/debugging when it helps the human.

**Missing or too vague**

- Add a clear policy for course participants:
  - project rules in English,
  - code identifiers in English,
  - prompts preferably in English,
  - UI/user-facing copy in product language,
  - planning can be Polish when clarity improves.
- Add a warning that "Think step-by-step" may be suboptimal or ignored in modern reasoning systems; ask for concise reasoning summary or plan instead.
- Add examples where Polish is the better choice: domain nuance, business rules, support conversation, Polish UI copy, stakeholder requirements.

**Inconsistent or risky**

- Exact token counts should be verified and reproducible with the named tokenizer. Tokenizers vary by model and date.
- Fertility ratio values for Polish should be sourced or softened.
- The OneRuler claim about Polish reaching top effectiveness needs careful citation and context. It is a surprising claim; technical readers will expect precision.
- "Większość modeli używa BPE" is generally true historically, but current tokenizers vary. Safer: "w praktyce nadal spotkasz tokenizatory oparte o podejścia z rodziny BPE/unigram".
- "Łańcuch CoT i kod po angielsku" should be rephrased because hidden CoT is not directly controlled or visible.

**Recommended additions**

- Add a small prompt-language matrix:
  - operational command -> English,
  - product copy -> target language,
  - planning with team context -> language of clearest domain expression,
  - reusable project instructions -> English unless team policy says otherwise,
  - support/debug narrative -> Polish acceptable.
- Add a reproducible mini-test: compare 3 Polish and English prompts in a tokenizer and observe token count, not quality.

## Cross-file inconsistencies

| Area | Current issue | Recommendation |
|---|---|---|
| Readiness | Some RC files are polished; others are placeholders or bullet notes. | Add explicit status labels: `text ready`, `video wrapper`, `script outline`, `needs rewrite`. |
| Scenario integration | Video scripts for `05` and `06` exist under `scenarios/`, but the lesson pages do not reference their operational content. | Treat scenario files as source material and publish a companion summary/transcript or link them through the video lesson structure. |
| Product naming | `Claude Codex`, `Codex Desktop`, `Claude Desktop`, `Cursor 3.0` used inconsistently. | Maintain a single glossary with canonical names and "verified on" dates. |
| Capitalization | `Agent`, `Agenci`, `agent`, `LLMem`, `Ciebie` mixed. | Lowercase generic terms; keep product names capitalized. |
| Lesson structure | Some lessons have takeaways/materials; some do not. | Require a common lesson skeleton. |
| Source style | Some lessons include inline citations; style guide prefers organic flow plus materials. | Move citations to `Materiały dodatkowe`, paraphrase in body. |
| Specific claims | Model names, context sizes, command names, benchmark results may age fast. | Use versioned notes or durable phrasing, and verify close to release. |
| Safety | Guardrails are mentioned but not systematized. | Add a safety taxonomy and repeat it across relevant lessons. |
| Team usage | Mostly solo workflow. | Add team conventions, PR review norms, and shared config ownership. |

## Suggested course-level additions

### A. Glossary

Create a short shared glossary for prework:

- model
- agent
- harness
- tool call
- MCP
- context window
- context rot
- compaction
- worktree
- subagent
- reasoning budget
- skill / slash command
- project rules / memory

This will reduce repeated definitions and prevent drift between lessons.

### B. "AI workflow maturity ladder"

Introduce a ladder in lesson 01 and reuse it:

1. Autocomplete.
2. Chat for explanation.
3. Agent edits local files under supervision.
4. Agent executes verified task loop.
5. Agent works asynchronously in isolated environment.
6. Multiple agents explore or implement alternatives.
7. Agent workflow becomes part of CI/CD or team process.

For each level, show required guardrails and verification.

### C. "Prompt contract" reusable artifact

Add a small copyable preview template in lesson 10:

```md
Goal:
Scope:
Do not touch:
Context to inspect first:
Constraints:
Verification command:
Definition of done:
Report back with:
```

Then refer to it in lessons 04, 09, 11, and 12 as "the full version becomes part of your 10xWorkflow in Module 2."

### D. "Thread handoff" template

Add a lightweight handoff preview in lesson 11:

```md
Current objective:
Accepted decisions:
Files changed:
Commands run:
Current test/build status:
Open risks:
Next recommended step:
```

This directly previews the artifact-management and living-documentation habits from Module 2 without teaching the full system yet.

### E. "Safe first agent task" exercise

Prework should include one small hands-on task before the main course:

- clone/open a repo,
- start clean branch,
- ask agent to inspect only,
- request plan,
- approve narrow edit,
- run tests,
- review diff,
- summarize what context mattered.

This makes lessons 01-12 feel connected to real practice.

This should stay intentionally small. The main course already builds the full Agentic Environment, Context Stack, eval system, feature delivery pipeline, QA infrastructure, and team registry.

## Source and verification notes

The following current/official sources were checked because several lesson claims are time-sensitive:

- OpenAI, `Unrolling the Codex agent loop`, 2026-01-23: confirms the Codex harness/agent-loop framing, tool calls, context construction, and compaction concepts.
- OpenAI API model docs, current model list: show GPT-5.2/GPT-5.1/GPT-5 families in the checked docs, not GPT-5.4. Treat exact model names in lessons as volatile.
- Anthropic Claude Code slash command docs: list built-ins such as `/clear`, `/compact`, `/agents`, `/permissions`, `/cost`, `/model`; no `/remote-control` or `/teleport` were visible in the checked slash-command reference.

Recommended process before publication: run a final "volatile facts" pass no more than 48 hours before release and replace exact product/model/command names with either verified current names or durable categories.

Scenario-specific verification should include pricing, plan names, privacy-mode labels, model names exposed in Cursor/Claude Code, and exact command availability in the versions used for recording.

## Proposed fix order

1. Decide whether `05`, `06`, and `07` are text lessons, video wrappers, or scripts. For `05` and `06`, use `scenarios/cursor_scenario.md` and `scenarios/claude_code_scenario.md` as the source of the companion text or transcript; do not mark them as text-ready until each has a complete learner-facing page.
2. Keep internal prework links aligned with Astro lesson IDs (`/external/10xdevs-3-prework/pl/:lessonId` and `/external/10xdevs-3-prework/en/:lessonId`) when lesson filenames change.
3. Create a shared glossary and naming policy.
4. Fact-check or soften volatile product/model/command claims.
5. Add operational checklists to lessons 01, 04, 10, and 11.
6. Add safety/team workflow material across 02, 04, 10, and 11.
7. Add concrete failure examples to 09, 10, 11, and 12.
8. Run editorial cleanup against `style.md`.
