# Lesson Grounding: m2-l2 — Architektura z Agentami: od roadmapy do pierwszego działającego streamu

## Scope

- Lesson source: `lessons/m2-l2/lesson-spec.md` plus schema slot `m2-l2`
- Neighbor boundaries: m2-l1 owns roadmap generation and backlog sequencing; m2-l4 owns SRS as the harder stream; m2-l3 owns implementation review after code is written.
- Relevant prework: [3.2] prompt as contract, [3.3] context lifecycle, [1.2] agent/harness, [4.2] MVP as small valuable flow.
- Research posture: standard. The lesson needs credible grounding for plan-first workflows, built-in Plan Mode, model-role split, and why plans improve control/predictability without becoming ceremony.

## Claims To Support

- "Planning before implementation is now a mainstream agentic coding surface, not tylko nasz 10xWorkflow." — supports the lesson's big-picture bridge from built-in Plan Mode to `/10x-plan`.
- "Plan Mode is useful, but has overhead and should be skipped for tiny clear changes." — protects the lesson from ritualizing plan/research/frame.
- "A plan artifact improves control because the human can review/edit/verify the approach before long implementation." — supports `/10x-plan` + `/10x-plan-review`.
- "Different model roles for planning vs coding are a real tool pattern." — supports the architect + coder framing.
- "Execution plans should be self-contained enough for long-running agent work." — supports `plan.md` / `plan-brief.md` as implementation contracts.
- "Agents work better with structure, scoped tasks, configured environments, tests, and persistent instructions." — supports predictability/control framing.

## Strong Sources

### Cursor — Introducing Plan Mode

- URL: https://cursor.com/blog/plan-mode
- Type: official-docs
- Author/publisher: Cursor
- Checked: 2026-05-14
- Supports:
  - Cursor positions Plan Mode as a built-in path where the agent researches the codebase, asks clarifying questions, creates a Markdown plan, and lets the user review/edit before building.
  - Cursor says it suggests Plan Mode automatically for complex tasks.
- Use in lesson:
  - Early "industry pattern" beat: Plan Mode is a visible product pattern across tools, but 10xWorkflow makes the plan a durable repo artifact.
  - Use as support for "plan is not bureaucracy; it is the control surface before edits."
- Confidence: high
- Notes:
  - Do not overclaim "all tools implement Plan Mode the same way." Cursor's behavior is Cursor-specific.

### Claude Code Docs — Best Practices

- URL: https://code.claude.com/docs/en/best-practices
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - Plan Mode is useful but adds overhead.
  - Planning is most useful when approach is uncertain, change touches multiple files, or code is unfamiliar.
  - Small clear changes can skip a plan.
- Use in lesson:
  - Directly ground the "plan as default router, not ceremony" message.
  - Use in the complexity gradation table: low-clear change may go straight to plan/implementation; higher uncertainty may need more explicit planning/research.
- Confidence: high
- Notes:
  - This source is especially useful because it supports the user's desired warning: do not make learners feel every item requires full pipeline.

### Claude Code Docs — Common Workflows

- URL: https://code.claude.com/docs/en/common-workflows
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - Claude Code documents "plan before editing" as a workflow where Claude reads files and proposes a plan before edits.
  - It also documents delegating research to subagents to keep the main context clean.
- Use in lesson:
  - Ground the distinction between plan, research, and implementation as separate operational modes.
  - Useful for explaining why our `/10x-plan` externalizes a pattern already present in coding agents.
- Confidence: high
- Notes:
  - Keep this as tool behavior support, not a tutorial for Claude Code.

### Claude Code Docs — Model Configuration (`opusplan`)

- URL: https://code.claude.com/docs/en/model-config
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - The `opusplan` alias uses Opus for plan mode and Sonnet for execution mode.
  - This directly supports a two-role "architect + coder" mental model.
- Use in lesson:
  - Add a short sidebar or paragraph: many tools increasingly separate planning-grade reasoning from execution-grade coding; in 10xWorkflow the artifact boundary is more important than model branding.
- Confidence: high
- Notes:
  - Time-sensitive model names. Recheck before learner-facing syntax. Teach the pattern, not the specific default.

### OpenAI Cookbook — Using PLANS.md for multi-hour problem solving

- URL: https://developers.openai.com/cookbook/articles/codex_exec_plans
- Type: official-docs
- Author/publisher: OpenAI / Aaron Friel
- Checked: 2026-05-14
- Supports:
  - Codex can use thorough design documents as living documents for complex tasks that take significant time to research, design, and implement.
  - Plans let users verify the approach before long implementation.
  - Self-contained execution plans help the agent work without hidden prior context.
- Use in lesson:
  - Strong support for `plan.md` as a durable contract, not a chat transcript.
  - Useful for explaining why `plan-brief.md` and `## Progress` exist.
- Confidence: high
- Notes:
  - Do not import the full ExecPlan format into the lesson; use it as parallel evidence for the artifact pattern.

### OpenAI — How OpenAI uses Codex

- URL: https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf
- Type: technical-post
- Author/publisher: OpenAI
- Checked: 2026-05-14
- Supports:
  - For large changes, OpenAI recommends starting with Ask Mode to create an implementation plan, then switching to Code Mode.
  - Codex works best with structure, context, scoped tasks, configured environments, and prompts that look like issues/PRs.
  - Codex is useful for exploring alternatives and pressure-testing assumptions.
- Use in lesson:
  - Ground the "plan → review → implement" bridge as a broader coding-agent practice.
  - Useful for explaining why roadmap fields become inputs to plan questions rather than hidden context.
- Confidence: high
- Notes:
  - Treat as OpenAI practitioner guidance, not universal empirical proof.

### 10x-toolkit — `/10x-plan`, `/10x-plan-review`, `/10x-implement`, `/10x-roadmap`

- URL: /Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/
- Type: internal-course-material
- Author/publisher: 10xDevs toolkit
- Checked: 2026-05-14
- Supports:
  - `/10x-plan` accepts task-only, task+research, task+frame, and task+frame+research; upstream artifacts reduce question count but are not required.
  - `/10x-plan-review` reviews plans before code across substance, feasibility and completeness.
  - `/10x-implement` uses `## Progress` as single source of truth, phase gates, manual confirmation, commit ritual, and context assessment.
  - `/10x-roadmap` routes roadmap items downstream to `/10x-plan`; it is not per-change planning.
- Use in lesson:
  - This is the canonical source for exact 10xWorkflow mechanics.
  - Use to keep lesson text aligned with actual CLI-delivered skills.
- Confidence: high
- Notes:
  - Course-content wiring verified in `/Users/psmyrdek/dev/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-02/lesson-02.ts`: learner-facing lesson ref is `m2l2`.

## Practitioner Signals

### Cursor and Claude Code product convergence around Plan Mode

- URL: https://cursor.com/blog/plan-mode and https://code.claude.com/docs/en/common-workflows
- Type: practitioner-signal
- Signal:
  - Planning before editing is no longer only a prompt-engineering trick; it is a productized workflow in agentic coding tools.
- Useful language:
  - "Plan is a control surface before edits."
  - "Plan Mode is useful, but it has overhead."
- Risk:
  - If the lesson leans too hard on vendor-specific UI, it will age quickly. Keep examples tool-agnostic and tie back to artifacts.
- Confidence: high

## Examples Worth Using

- `F-01 gate-product-routes`: low-complexity item where Plan Mode/full research would be overhead. Use to prove "none → plan" is legitimate.
- `S-01/S-02`: medium-complexity CRUD/generation stream where `/10x-plan` should absorb roadmap `Unknowns` and decide whether extra research is needed.
- A short comparison table:
  - Built-in Plan Mode: ephemeral or tool-local planning surface.
  - 10x `/10x-plan`: repo artifact with phases, contracts, success criteria and `## Progress`.
  - Both: increase predictability before edits.

## Claims To Avoid Or Soften

- "Plan Mode always improves generated code." — Cursor says they have seen improvement, but this is product claim, not a controlled universal result.
- "Always plan before code." — Anthropic explicitly says plan mode adds overhead and clear small changes can skip it.
- "Architect model + coder model is the universal best setup." — it is a real pattern (`opusplan`), but model names and defaults change. Teach role separation, not a fixed model prescription.
- "Research is mandatory before planning." — `/10x-plan` itself does research; standalone `/10x-research` is for durable, deeper or blocking decisions.

## Open Verification Questions

- Decide whether the lesson names Cursor/Claude/OpenAI in the main text or keeps them in "Materiały dodatkowe" and uses only abstracted patterns.
- Confirm whether demo uses `S-01` or `S-02` as the main slice.

## Schema Source Update

Add these as `groundingSources` for m2-l2:

- Cursor Plan Mode official blog
- Claude Code Best Practices
- Claude Code Common Workflows
- Claude Code Model Configuration (`opusplan`)
- OpenAI Codex ExecPlans cookbook
- OpenAI "How OpenAI uses Codex"
- 10x-toolkit skills directory for `/10x-plan`, `/10x-plan-review`, `/10x-implement`, `/10x-roadmap`
