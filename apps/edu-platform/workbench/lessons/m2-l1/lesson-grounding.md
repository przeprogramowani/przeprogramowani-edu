# Lesson Grounding: m2-l1 — Roadmapa MVP: Technical Project Manager, milestony i backlog dla agenta

## Scope

- Lesson source: `workbench/lessons/m2-l1/lesson-spec.md` plus schema slot in `workbench/lessons-schema.json`.
- Neighbor boundaries:
  - `m1-l5` owns deployment, CLI vs MCP for live infrastructure, production access boundaries, and `deploy-plan.md`.
  - `m2-l2` owns detailed architecture and per-change implementation planning for one selected milestone.
  - `m2-l4` owns implementation, context control during coding, and the 80% ready challenge.
  - `m2-l3` owns AI code review and QA.
  - `m2-l5` owns real multi-agent/worktree orchestration.
- Relevant prework: [1.2] agent vs harness, [2.4] agent-native IDE, [3.2] prompt as contract, [3.3] context lifecycle, [4.2] good course project with a small MVP and first working user path.
- Research posture: standard. Tool behavior and MCP details are current enough to require official docs; vertical-first slicing uses stable agile/product sources plus agent-tool docs.

## Claims To Support

- Working with coding agents shifts the programmer toward a TPM-like role — because agent throughput makes sequencing, scope, dependencies, and verification more important.
- Vertical slices should be the default roadmap unit for AI coding agents — because they are user-visible, testable, and reduce late integration risk.
- Horizontal work should be framed as a short enabler/foundation/spike, not an equal roadmap strategy — because broad layer-first work delays feedback and can create false progress.
- `10x-roadmap` is a decomposition and sequencing skill, not a low-level implementation planner.
- Backlog tools such as Jira / Linear can become shared project memory when exposed to agents through MCP, but write access and permissions need explicit control.
- Roadmap and backlog are different artifacts: roadmap explains sequence and risk; backlog tracks execution state, owners, dependencies, and acceptance criteria.

## Strong Sources

### 10x-roadmap Skill

- URL: `/Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-roadmap/SKILL.md`
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-12
- Supports:
  - `10x-roadmap` generates `context/foundation/roadmap.md` from PRD as ordered vertical, end-to-end slices.
  - The skill bridges product (`prd.md`) and per-change planning (`/10x-plan`).
  - The skill is explicitly decomposition + sequencing, not framework/schema/file-level planning.
  - It sequences by dependency graph, surfaces blockers/unknowns, and avoids calendar estimates.
- Use in lesson:
  - Anchor the demo and the boundary between m2-l1 and m2-l2.
  - Use the skill's own wording to avoid overexplaining implementation planning in m2-l1.
- Confidence: high
- Notes:
  - The current skill already favors vertical slices. If the lesson introduces horizontal enablers, they should be described as `Foundations` or blockers that unlock a named slice, not as a rival roadmap mode.

### Claude Code Best Practices

- URL: https://code.claude.com/docs/en/best-practices
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-12
- Supports:
  - Coding agents perform better when they can verify work with tests, screenshots, or expected output.
  - Complex work should separate exploration, planning, implementation, and verification.
  - Context is a scarce resource; long/noisy sessions degrade reliability.
  - Specific files, constraints, patterns, and verification criteria reduce correction loops.
- Use in lesson:
  - Support the argument that vertical slices are agent-friendly because they provide a verifiable end-to-end result.
  - Support the TPM framing: the human supplies goal, scope, constraints, and verification gates.
- Confidence: high
- Notes:
  - Avoid turning this into a Claude Code tutorial. The lesson should extract principles: verify, scope, plan, keep context focused.

### Introducing Codex

- URL: https://openai.com/index/introducing-codex/
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-05-12
- Supports:
  - Codex tasks run independently in isolated environments with the repository loaded.
  - Codex can edit files and run test harnesses, linters, and type checks.
  - Codex works best with configured environments, reliable tests, and clear documentation such as `AGENTS.md`.
  - OpenAI frames Codex as suitable for writing features, fixing bugs, answering codebase questions, tests, and PR proposals.
- Use in lesson:
  - Support the claim that agents need scoped, reviewable tasks rather than one broad "build the app" prompt.
  - Ground the need for backlog items with acceptance criteria and verification.
- Confidence: high
- Notes:
  - Do not use old availability/pricing details in the learner-facing draft without rechecking. The stable claim is about task shape and verification, not pricing.

### GitHub Copilot Coding Agent

- URL: https://docs.github.com/en/copilot/using-github-copilot/coding-agent/about-assigning-tasks-to-copilot
- Type: official-docs
- Author/publisher: GitHub
- Checked: 2026-05-12
- Supports:
  - A coding agent can be assigned GitHub issues and produce pull requests for human review.
  - The agent works in an ephemeral development environment where it can explore code and run tests/linters.
  - GitHub describes incremental features, bug fixes, test coverage, documentation, and technical debt as suitable tasks.
  - Review and permission controls remain important: the agent cannot approve/merge its own PR and has security mitigations.
- Use in lesson:
  - Support backlog-as-work-queue framing: issue -> agent task -> PR -> human review.
  - Useful comparison point when explaining Jira/Linear backlog items as "agent-ready" tasks even if the actual demo uses Linear/Jira MCP.
- Confidence: high
- Notes:
  - Keep GitHub-specific mechanics out of the core lesson unless used as a short analogy. Jira/Linear + MCP is the requested Part 3.

### Agile Alliance — Story Splitting

- URL: https://agilealliance.org/glossary/story-splitting/
- Type: technical-post
- Author/publisher: Agile Alliance
- Checked: 2026-05-12
- Supports:
  - A story should be split into smaller stories while preserving measurable business value.
  - Smaller stories should be schedulable within an iteration.
- Use in lesson:
  - Anchor the vertical-first stance in a stable agile principle: small increments should still carry value.
  - Use to soften claims: vertical slicing is a practical default, not a magic guarantee.
- Confidence: high
- Notes:
  - This source does not specifically discuss AI agents. The agent-specific bridge comes from Claude/Codex/GitHub docs.

### Agile Alliance — Story Mapping

- URL: https://agilealliance.org/glossary/story-mapping/
- Type: technical-post
- Author/publisher: Agile Alliance
- Checked: 2026-05-12
- Supports:
  - Story maps order user activities and then prioritize sophistication/depth.
  - The first row can represent a walking skeleton: a barebones but usable version of the product.
  - Story mapping helps avoid delivering high-priority features that are unusable because dependent capabilities were deferred.
- Use in lesson:
  - Strong grounding for "first working user path" and vertical-first roadmap.
  - Good language for the 10xCards demo: walking skeleton before polish.
- Confidence: high
- Notes:
  - Be careful with terminology: story maps create horizontal release rows across a user journey, which is not the same as "horizontal technical layers." The draft must distinguish these.

### Agile Alliance — A Tale of Slicing and Imagination

- URL: https://agilealliance.org/resources/experience-reports/a-tale-of-slicing-and-imagination/
- Type: practitioner-signal
- Author/publisher: Agile Alliance experience report
- Checked: 2026-05-12
- Supports:
  - Vertical slice means a user story crossing UI/backend/architectural layers.
  - Horizontal slicing by frontend/backend/database can feel natural to specialized teams but is weaker from the user/business point of view.
  - T-shaped collaboration helps teams complete vertical slices despite specialization.
- Use in lesson:
  - Good practitioner example for "solo-dev vs team": team specialization is exactly why horizontal slicing feels tempting.
  - Supports the teaching point that horizontal work should be constrained and tied to downstream value.
- Confidence: medium
- Notes:
  - It is an experience report, not a formal standard. Use for language and practical tension, not as universal proof.

### 10xDevs 1.0 / 2.0 internal continuity

- URL: internal course memory / prior 10xDevs production experience
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10xDevs
- Checked: 2026-05-12
- Supports:
  - Earlier 10xDevs editions could naturally plan more horizontally: foundations, stack layers, rules, scaffolding, and implementation stages.
  - 10xDevs 3.0 can explicitly name this as an evolution rather than pretending vertical-first was always the operating model.
  - The shift is grounded in 2026 agent capabilities: Claude Code, Codex, and similar agents can execute scoped, verifiable, end-to-end tasks more effectively than broad layer-first work.
- Use in lesson:
  - Add a short "why our recommendation changed" paragraph in Part 2.
  - This helps alumni understand the shift without making horizontal work sound foolish or obsolete.
- Confidence: medium
- Notes:
  - This is an internal continuity claim, not a public benchmark. If used in learner-facing prose, phrase as course evolution: "W poprzednich edycjach częściej myśleliśmy warstwami..." rather than as a measured industry trend.

### Atlassian — What is a Project Roadmap and How to Create One

- URL: https://www.atlassian.com/agile/project-management/create-project-roadmap
- Type: technical-post
- Author/publisher: Atlassian
- Checked: 2026-05-12
- Supports:
  - Roadmaps define goals/scope, stakeholders, requirements, phases or milestones, tasks/resources, and dependencies.
  - Roadmap is higher-level than a granular project plan.
  - Mapping dependencies helps identify bottlenecks, constraints, and resource loads.
- Use in lesson:
  - Ground the distinction between PRD, roadmap, backlog, and implementation plan.
  - Support TPM duties: define goals, milestones, dependencies, and resource/capacity constraints.
- Confidence: high
- Notes:
  - Atlassian includes timelines/estimates. The 10x roadmap skill intentionally avoids calendar estimates for agentic execution, so use only the parts about goals, milestones, dependencies, and alignment.

### Atlassian — Project Manager Roles and Responsibilities

- URL: https://www.atlassian.com/en/work-management/project-management/project-manager
- Type: technical-post
- Author/publisher: Atlassian
- Checked: 2026-05-12
- Supports:
  - Project managers connect project goals to day-to-day work.
  - Responsibilities include project planning, team coordination, risk management, scope/focus, communication, and quality standards.
  - Effective project management is not task traffic control; it decides what matters, in what order, and why.
- Use in lesson:
  - Ground Part 1: programmer as TPM in agentic workflow.
  - Use as source for "TPM is about sequencing, risk, and alignment, not meetings."
- Confidence: high
- Notes:
  - The lesson should avoid overformal PM career content. Use only role/responsibility framing.

### Model Context Protocol — Server Concepts

- URL: https://modelcontextprotocol.io/docs/learn/server-concepts
- Type: official-docs
- Author/publisher: Model Context Protocol
- Checked: 2026-05-12
- Supports:
  - MCP servers expose capabilities through tools, resources, and prompts.
  - Tools let a model perform actions; resources expose data as context.
  - Tool execution can require user consent; clients can show approval dialogs and activity logs.
- Use in lesson:
  - Ground the minimal mental model for connecting an agent to Jira/Linear through MCP.
  - Distinguish read/context operations from write/action operations.
- Confidence: high
- Notes:
  - Do not teach JSON-RPC internals here. That belongs to later MCP-specific material.

### Linear MCP Server

- URL: https://linear.app/docs/mcp
- Type: official-docs
- Author/publisher: Linear
- Checked: 2026-05-12
- Supports:
  - Linear offers a centrally hosted remote MCP server.
  - The server can find, create, and update Linear objects such as issues, projects, and comments.
  - It supports OAuth-based remote MCP setup and `mcp-remote` compatibility.
- Use in lesson:
  - Strong default for the Part 3 demo because the docs are direct and task-shaped.
  - Supports backlog-as-shared-memory: issues/projects/comments are accessible to compatible agents.
- Confidence: high
- Notes:
  - Confirm the demo client configuration immediately before recording; remote MCP behavior may evolve.

### Atlassian Rovo MCP Server

- URL: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/
- Type: official-docs
- Author/publisher: Atlassian
- Checked: 2026-05-12
- Supports:
  - Atlassian Rovo MCP Server connects compatible tools to Jira, Compass, and Confluence data.
  - It supports searching/summarizing and creating/updating issues or pages through natural language commands.
  - Authentication uses OAuth 2.1 and respects existing access controls.
  - Atlassian recommends `/mcp`; the older `/sse` endpoint is unsupported after 2026-06-30.
- Use in lesson:
  - Ground Jira as the enterprise-oriented option.
  - Use for the caution that MCP tools inherit real user permissions and need least-privilege setup.
- Confidence: high
- Notes:
  - Mention exact endpoint only in demo notes, not core prose, unless rechecked at recording time.

## Practitioner Signals

### GitHub issue-to-agent workflow

- URL: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/assign-copilot-to-an-issue
- Type: official-docs used as practitioner signal
- Signal:
  - Mainstream tools are converging on "issue/task -> agent session -> PR -> human review".
  - Backlog items need enough context for the agent at assignment time; later issue comments may not automatically reach the original agent task in some workflows.
- Useful language:
  - "agent-ready issue", "reviewable PR", "task packet", "human review gate".
- Risk:
  - This is GitHub-specific. Do not imply Jira/Linear automatically trigger the same implementation behavior unless the configured agent/client supports it.
- Confidence: high

### Agile Alliance experience report on vertical slices

- URL: https://agilealliance.org/resources/experience-reports/a-tale-of-slicing-and-imagination/
- Type: practitioner-signal
- Signal:
  - Horizontal slicing is attractive to specialized frontend/backend teams, but it can misalign work with business/user value.
  - Vertical slicing may require broader skills or collaboration across specializations.
- Useful language:
  - "horizontal sounded reasonable from task division, not from the user/business point of view."
- Risk:
  - Experience reports are contextual; use as an example, not a universal theorem.
- Confidence: medium

## Examples Worth Using

- **10xCards vertical milestone:** "User creates first card and sees it in a list" touches UI, validation, persistence, and read path. It gives the agent a concrete verification target.
- **Valid horizontal enabler:** "Create minimal card table + migration + test seed" only if S-01 requires persistence and there is no data layer. It must point to S-01 and should remain small.
- **Invalid horizontal work:** "Build the whole database schema, all API endpoints, and all UI components first." This creates progress-looking artifacts but delays the first usable workflow.
- **10xDevs continuity paragraph:** "W 10xDevs 1.0 i 2.0 częściej planowaliśmy pracę warstwowo: najpierw fundamenty, potem kolejne części aplikacji. To miało sens przy starszym trybie pracy z AI, w którym człowiek częściej ręcznie kleił wyniki. W 2026 roku agenci typu Claude Code i Codex lepiej wykorzystują małe, weryfikowalne zadania end-to-end, dlatego w 10xDevs 3.0 przechodzimy na vertical-first."
- **Backlog mapping example:**
  - Roadmap S-01 -> Linear/Jira issue "Create first flashcard flow".
  - Acceptance criteria: create card, see validation error, reload and see saved card.
  - Dependency: F-01 minimal persistence if absent.
  - Link: `context/foundation/roadmap.md#s-01`.
- **MCP demo shape:** agent reads existing roadmap issue/project, creates one issue, links dependency, adds acceptance criteria, and leaves high-impact status changes for human confirmation.

## Claims To Avoid Or Soften

- "Horizontal slicing is always wrong" — soften to: broad horizontal tracks are dangerous; short horizontal enablers can be valid when they unlock a named vertical milestone.
- "Vertical slices are enough for every project" — soften to: vertical-first is the default; some projects need a short foundation/spike before the first vertical slice is verifiable.
- "MCP makes Jira/Linear safe" — MCP standardizes access; safety still depends on auth, permissions, consent, audit logs, and human review.
- "Roadmap replaces backlog" — roadmap is strategy/sequence/risk; backlog is operational state.
- "Backlog replaces `/10x-plan`" — backlog item is the input packet; `/10x-plan` still designs the specific implementation.
- "Agent can own the project" — agent can execute and update tools; the human owns goal, priority, trade-off, and approval.
- "Atlassian/Linear MCP setup is stable forever" — current docs should be rechecked before recording because MCP transports/endpoints are evolving.

## Open Verification Questions

- Czy oficjalne demo ma iść przez Linear czy Jira? Linear ma prostszy remote MCP setup; Jira ma mocniejsze enterprise rozpoznanie.
- Czy learner-facing setup ma pokazywać rzeczywistą konfigurację MCP, czy tylko prowadzący używa gotowego środowiska demo?
- Czy schema ma zostać zsynchronizowana z najnowszym specem vertical-first, czy na razie tylko wzbogacona o `groundingSources`?
- Czy `10x-roadmap` ma zostać zmodyfikowany w toolkit, żeby jawnie kodować "horizontal enablers only when linked to downstream vertical milestone"?
- Przed nagraniem trzeba potwierdzić aktualne dostępne narzędzia Linear/Jira MCP w wybranym kliencie agenta.

## Schema Source Update

Added `groundingSources` to the `m2-l1` lesson entry in `workbench/lessons-schema.json` with the strongest sources:

- internal `10x-roadmap` skill,
- Claude Code best practices,
- OpenAI Codex launch/docs page,
- GitHub Copilot coding agent docs,
- Agile Alliance story splitting and story mapping,
- Agile Alliance vertical slicing experience report,
- Atlassian project roadmap and PM role pages,
- MCP server concepts,
- Linear MCP server,
- Atlassian Rovo MCP server.

Updated `sideEffectLedger.unsupportedFacts` and `sideEffectLedger.needsHumanDecision` to reflect remaining MCP demo/tooling decisions and the schema/spec drift.
