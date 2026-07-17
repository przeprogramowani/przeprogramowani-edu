# Lesson Grounding: m1-l2 — Od chatbota do Agenta: tech stack, skille i metaprompting

## Scope

- Lesson source: spec (`workbench/lessons/m1-l2/lesson-spec.md`); draft does not yet exist.
- Neighbor boundaries:
  - m1-l1 owns `/10x-shape` + `/10x-prd` mechanics and PRD-as-contract framing — m1-l2 references but does not redefine.
  - m1-l3 owns bootstrap on top of `tech-stack.md` + selected starter — m1-l2 stops at the file on disk, never scaffolds.
  - m1-l4 owns AGENTS.md/CLAUDE.md, custom instructions, /init, hooks, auto-memory, rules-vs-memory taxonomy — m1-l2 must avoid defining or contrasting these layers; one-sentence forward reference only.
  - m1-l5 owns MCP (servers, clients, OAuth, RPC, server design) — m1-l2 must avoid defining MCP; one-sentence forward reference allowed.
- Relevant prework:
  - `[1.2]` chatbot vs Agent vs harness — assumed.
  - `[3.1]` LLM-as-token-prediction + context window degradation + token budgeting — assumed (anchors progressive disclosure cost story).
  - `[3.2]` prompt as contract + instruction hierarchy (system → AGENTS.md → memory → **skille** → prompt) — assumed; m1-l2 promotes the `skille` bullet to full lesson topic.
  - `[3.3]` context engineering (Write/Select/Compress/Isolate) — assumed (anchor for progressive disclosure intuition, not redrawn).
  - `[4.1]` agent-friendly stack criteria — assumed; not relisted.
  - `[4.2]` good course project — assumed (PRD on hand from m1-l1 is the input).
- Research posture: standard. Spec is detailed and identifies its own unsupported facts; grounding focuses on the facts the spec flagged plus one positioning claim that needs softening.

## Claims To Support

- **Skills are an Anthropic-published, open format** — needed: official-docs evidence Anthropic publishes a spec and supports Skills across products (Claude Code / Claude.ai / API) and that the format is open.
- **Progressive disclosure has three loading levels with concrete token budgets (`~100 tokens` metadata, `under 5k tokens` SKILL.md, effectively unlimited resources)** — needed: official-docs source for the exact numbers used in the spec.
- **SKILL.md size guideline ~500 lines** — needed: an Anthropic-maintained source for the guideline (the public overview page does not state it).
- **Skills are not just an Anthropic-only thing — Cursor, Codex, Gemini CLI, GitHub Copilot, Cline and others read the same format** — needed: registry/CLI source listing supported clients.
- **Installation via `npx skills add <owner/repo>`** — needed: registry/CLI source for exact invocation.
- **`skills.sh` is a public registry of skills at scale** — needed: a current count or directional statement; the spec's `25,609` figure is stale.
- **External vendor skills exist at production quality (`supabase/agent-skills` Postgres best practices, `vercel-labs/agent-skills` React best practices)** — needed: repo evidence for both.
- **`/10x-tech-stack-selector` produces a structured `tech-stack.md` hand-off (`starter_id`, `bootstrapper_confidence`, `path_taken`, feature flags) that `/10x-bootstrapper` consumes** — needed: confirm against current 10x-toolkit source.
- **10xCards demo is real and reproducible: PRD on disk, `tech-stack.md` on disk with the documented frontmatter** — needed: file evidence in the sibling repo.
- **Forward-looking 10xWorkflow chain (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) is real and shipped as the same skill format** — needed: confirm the skill files exist before naming them in the lesson.
- **Metaprompting via `skill-creator` exists and frames skill authoring as "describe input/output contract"** — needed: source for skill-creator's behavior.
- **Skills are positioned in the ecosystem as "key", "officially defined", "most commonly used in practice", and "broader in scope than MCP"** — flagged by the spec itself as needing grounding. Two of the four sub-claims are cleanly supportable; one ("most commonly used") is weak; one ("broader in scope than MCP") is wrong as written and must be softened.
- **Skill vs jednorazowy prompt mechanics (description-driven invocation, parametrized run, replayability across sessions, contract on disk)** — supported by official Anthropic docs distinguishing Skills from prompts; needed for the prompt-or-skill picker section.

## Strong Sources

### Agent Skills overview (Anthropic Claude Platform docs)

- URL: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-04
- Supports:
  - Skills are a folder containing `SKILL.md` with YAML frontmatter (`name`, `description` required) plus optional bundled folders (additional `*.md`, `scripts/`, resources).
  - Three-level progressive disclosure with explicit token budgets:
    - Level 1 metadata: always loaded, **~100 tokens per Skill**.
    - Level 2 instructions: loaded when triggered, **under 5k tokens** (SKILL.md body).
    - Level 3 resources: as needed, **effectively unlimited** (files and scripts read via bash; script source code never enters context, only output).
  - Cross-product support: Claude API, Claude Code, Claude.ai (Anthropic's own ecosystem); custom Skills do not auto-sync across surfaces.
  - Anatomy contract: `name` ≤64 chars (lowercase letters, numbers, hyphens; cannot include `anthropic`/`claude`); `description` ≤1024 chars; both validated.
  - Security: explicit "use Skills only from trusted sources" warning, audit-thoroughly guidance, treat as installing software. Tool misuse and external-fetch risks called out.
  - Skill triggering is description-driven: at startup Claude only sees name+description; the SKILL.md body is read via bash when Claude decides the skill is relevant. This is the precise mechanism behind "agent knows *when* to reach for a skill" used in the spec's prompt-or-skill picker.
- Use in lesson:
  - Anatomy section ("Czym jest Agent Skill") cites this page directly for the three-level model and token budgets.
  - Security paragraph ("audyt SKILL.md przed instalacją") leans on the explicit Anthropic warning.
  - The "skill vs jednorazowy prompt" contrast cites the description-driven loading mechanic as something a prompt structurally cannot do.
- Confidence: high
- Notes:
  - Token figures (`~100`, `under 5k`) are exact from the table on this page; spec already uses them.
  - Page does **not** state a `~500 line` SKILL.md guideline. That figure is in `skill-creator` (see next source). Cite the right source for each.
  - Required-field constraints (name regex, description length) are useful for the "what an agent reads at startup" mechanic; do not surface as syntax dump.

### `skill-creator` SKILL.md (anthropics/skills, installed locally at `~/.claude/skills/skill-creator/SKILL.md`)

- URL: https://github.com/anthropics/skills/tree/main/skills/skill-creator
- Type: official-docs (Anthropic-published canonical skill)
- Author/publisher: Anthropic
- Checked: 2026-05-04
- Supports:
  - Anatomy diagram for the lesson's anatomy section: `SKILL.md` (required) + `scripts/` (executable code) + `references/` (docs loaded as needed) + `assets/` (templates/icons/fonts in output).
  - Progressive disclosure described as **three-level loading** with the same numbers as the public docs (~100 words metadata, <500 lines SKILL.md ideal, unlimited bundled resources). Adds the qualitative phrasing "Always in context", "In context whenever skill triggers", "As needed".
  - **`SKILL.md` ~500-line guideline** — explicitly stated: "Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of hierarchy along with clear pointers about where the model using the skill should go next to follow up."
  - Description-writing guidance: include both "what" and "when to use", lean slightly "pushy" because Claude tends to undertrigger skills. Useful color for the lesson's audit/trigger-design framing if it surfaces in deep-dive.
  - Metaprompting framing for the lesson's preview section: skill-creator helps "Capture intent → interview → write SKILL.md → bundle resources → progressive disclosure". Confirms the spec's "describe input/output contract → meta-skill drafts SKILL.md skeleton" framing.
- Use in lesson:
  - Anatomy section cites this skill for the canonical folder layout (`scripts/` / `references/` / `assets/`).
  - Deep Dive metaprompting preview points at this skill as the meta-skill that turns an input/output contract into a SKILL.md skeleton.
  - The 500-line guideline appears in the Core/Deep Dive split as a practical authoring rule, sourced here, not to the public overview.
- Confidence: high
- Notes:
  - Lives both in `~/.claude/skills/skill-creator/` (installed) and at `github.com/anthropics/skills`. The repo is the citable source for "Materiały dodatkowe".
  - Word/line counts come from Anthropic's own meta-skill — this is the strongest internal grounding for the SKILL.md size discipline.

### "Equipping agents for the real world with Agent Skills" (Anthropic Engineering blog)

- URL: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Type: technical-post (official Anthropic engineering post)
- Author/publisher: Anthropic
- Checked: 2026-05-04
- Supports:
  - Anthropic's own positioning of Skills as a **lightweight, open format** for extending agent capabilities.
  - Three-stage progressive disclosure restated: discovery (name + description) → instructions (SKILL.md) → resources/scripts.
  - Cross-product framing: "supported today across Claude.ai, Claude Code, the Claude Agent SDK, and the Claude Developer Platform".
  - Explicit security framing ("malicious skills may introduce vulnerabilities", "install only from trusted sources").
  - **Direct positioning vs MCP**: Skills are framed as **complementary** to MCP, not "broader in scope". Quote: *"we hope to enable agents to create, edit, and evaluate Skills on their own, letting them codify their own patterns of behavior into reusable capabilities. We'll also explore how Skills can complement Model Context Protocol (MCP) servers..."*
- Use in lesson:
  - Wstęp/positioning: cite this post for "open format" and the cross-surface support claim.
  - Skille-vs-MCP forward reference: this is the hard ground for **softening** the spec's "broader in scope than MCP" claim to "complementary, addressing a different layer of the agent stack". The lesson must not say MCP is a sub-layer of Skills.
- Confidence: high
- Notes:
  - This is the source that disarms the spec's `unsupportedFacts` entry on positioning. The honest framing: Skills are an officially defined and supported format that addresses the workflow/procedure layer; MCP is an officially defined protocol that addresses the tool/RPC layer. They compose.

### `skills.sh` — public agent-skills registry

- URL: https://skills.sh/
- Type: repo / registry (community-run, agent-agnostic)
- Author/publisher: skills.sh maintainers
- Checked: 2026-05-04
- Supports:
  - Public registry advertising **24 supported AI agent platforms** including Claude Code, GitHub Copilot, Cursor, Cline, VSCode, Gemini, OpenAI Codex, Windsurf, Roo, Goose, OpenCode, Trae, AMP, Antigravity, ClawdBot, Kilo, Nous Research, Droid, Kiro CLI.
  - Install-by-name pattern: `npx skills add <owner/repo>` (sometimes with `--skill <skill-name>` for multi-skill repos).
  - Scale signal: 91,051 all-time installations on the homepage leaderboard (snapshot 2026-05-04). The total *number of skills* listed is large but volatile; use directional language ("tysiące skilli", "dziesiątki tysięcy instalacji") rather than a hard count.
- Use in lesson:
  - Konsumpcja-skilli section: anchor for "skill standard works across many tools, not just Claude Code" — answers the "is this a Claude-only thing?" objection without saying every tool implements the format identically.
  - Forward-looking "wide adoption" claim: cite the 24-tool list directionally, not as a guarantee each tool implements every Skills feature.
  - Replaces the stale `25,609 skills` figure from the spec.
- Confidence: medium
- Notes:
  - Numbers change. Recheck before publish; in the draft, prefer directional phrasing.
  - Treat the 24-tool list as an "ecosystem signal", not a compatibility certification — different agents have different skill-loading paths and feature support; the lesson should flag this rather than imply uniform support.

### `vercel-labs/skills` — `npx skills` CLI source

- URL: https://github.com/vercel-labs/skills
- Type: repo
- Author/publisher: Vercel Labs
- Checked: 2026-05-04
- Supports:
  - This is the actual source of the `npx skills` CLI used by skills.sh. The CLI auto-detects installed agents (Claude Code at `.claude/skills/`, Cursor at `.agents/skills/` and `~/.cursor/skills/`, Codex at `.agents/skills/` and `~/.codex/skills/`, Gemini CLI at `.agents/skills/` and `~/.gemini/skills/`, etc.) and supports targeting specific agents via `-a` flags (e.g. `-a claude-code -a cursor`).
  - `find-skills` skill in `vercel-labs/skills/skills/find-skills/` is a meta-skill for discovering skills — useful as a side example if the lesson wants to show a "skill that finds skills".
- Use in lesson:
  - Konsumpcja-skilli section: this repo is what backs the "npx skills add" command — cite it as the implementation, separate from `skills.sh` which is the registry UI.
  - Implementation-detail note: install paths differ per tool (`.claude/skills/`, `~/.cursor/skills/`, `~/.codex/skills/`, etc.). Lesson should mention "different agents read skills from slightly different paths" so kursanci aren't surprised when skills.sh installs into multiple locations.
- Confidence: high
- Notes:
  - Distinct from `vercel-labs/agent-skills` (Vercel's curated skills) — easy to confuse. Cite by full repo name.

### `vercel-labs/agent-skills` — React best practices (and others)

- URL: https://github.com/vercel-labs/agent-skills
- Type: repo
- Author/publisher: Vercel Labs (Vercel Engineering)
- Checked: 2026-05-04
- Supports:
  - Production-grade vendor skill: `react-best-practices` packages **70+ rules in 8 categories** (server/client boundary, RSC composition, bundle/cache strategies, etc.) for use during writing, reviewing, and refactoring React/Next.js code.
  - Confirms the spec's "audit-quality, always-on" shape of vendor skills as a contrast to the "chain-style" 10xWorkflow shape.
- Use in lesson:
  - Worked example secondary mention: one or two sentences in Konsumpcja-skilli to show "skille przyjmują różne kształty — łańcuchowy (10x-toolkit) i always-on best-practices (vendor)".
  - Materiały Dodatkowe.
- Confidence: high
- Notes:
  - Spec referenced this as `vercel-labs/react-best-practices`; correct repo path is `vercel-labs/agent-skills` with the skill **inside** at `skills/react-best-practices/`. Use the full path in the draft.

### `supabase/agent-skills` — Postgres best practices

- URL: https://github.com/supabase/agent-skills
- Type: repo
- Author/publisher: Supabase
- Checked: 2026-05-04
- Supports:
  - Production-grade vendor skill: `supabase-postgres-best-practices`, organized into **8 rule categories** (query performance + connection management as critical, then security/RLS, schema design, concurrency, data access, monitoring, advanced features).
  - 95% of the guidance applies to any Postgres 12+ database, not just Supabase — strong evidence that "vendor skill" doesn't have to mean "vendor-locked workflow".
  - Install command: `npx skills add supabase/agent-skills --skill supabase-postgres-best-practices`.
- Use in lesson:
  - Worked example secondary mention: paired with `vercel-labs/agent-skills` in Konsumpcja-skilli.
  - Materiały Dodatkowe.
- Confidence: high
- Notes:
  - Different shape from `/10x-tech-stack-selector`: this skill is "always-on, advisory" (loads when you write Postgres code); 10x skills are "chain step, file in / file out". Both are valid skills; the lesson should name the difference, not flatten it.

### `/10x-tech-stack-selector` skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-tech-stack-selector/SKILL.md` (+ `references/`)
- Type: internal-course-material
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-04
- Supports:
  - Canonical mechanics for the worked example:
    - Reads `context/foundation/prd.md`; refuses if the file is absent and redirects to `/10x-shape` + `/10x-prd`.
    - Q0 path-fork (standard recommended-default vs custom interview), residual interview (`references/residual-interview.md`), agent-friendly quality gates (`references/agent-friendly-criteria.md`), starter-registry decision flow (`references/decision-flow.md`).
    - Writes `context/foundation/tech-stack.md` per `references/handoff-schema.md` with frontmatter: `starter_id`, `package_manager`, `project_name`, `hints.{language_family, team_size, deployment_target, ci_provider, ci_default_flow, bootstrapper_confidence, path_taken, quality_override, self_check_answers, has_auth, has_payments, has_realtime, has_ai, has_background_jobs}`.
    - "Rich rationale stays in conversation; the file hand-off is minimal."
    - `/10x-bootstrapper` is the downstream consumer.
  - Direct evidence for the spec's "skill robi z PRD-a coś, czego prompt nie robi": Q0 confirmation, agent-friendly gates, `bootstrapper_confidence` surfacing, structured frontmatter, collision policy on overwrite, language-aware starter registry — none of which a one-shot prompt produces deterministically.
- Use in lesson:
  - Worked example: before/after demo, frontmatter screenshot/diff, anatomy walk on this exact SKILL.md.
  - Skill-vs-prompt contrast paragraph: every mechanic listed above maps to a property prompts structurally cannot have (description-based triggering, `references/` loaded on demand, file hand-off as contract).
- Confidence: high
- Notes:
  - "Universal language only" guardrail (no private vault paths, no organizational branding) is a useful side example of what "shippable skill" means in practice — but easy to over-narrate; one-line mention max.

### 10xCards artifacts (PRD + `tech-stack.md`)

- URL: `/Users/admin/code/10xCards/context/foundation/prd.md`, `/Users/admin/code/10xCards/context/foundation/tech-stack.md`
- Type: internal-course-material (sibling repo, not learner-facing)
- Author/publisher: User session, 2026-05-03
- Checked: 2026-05-04
- Supports:
  - The 10xCards PRD exists with the expected schema frontmatter (`project: 10xCards`, `product_type: web-app`, `target_scale.users: small`, `timeline_budget.mvp_weeks: 1`, `after_hours_only: true`).
  - The `tech-stack.md` produced by `/10x-tech-stack-selector` exists with the documented frontmatter shape (`starter_id: 10x-astro-starter`, `bootstrapper_confidence: first-class`, `path_taken: standard`, `has_auth: true`, `has_ai: true`).
  - "Why this stack" section is one paragraph and explicitly ties FRs (FR-001..FR-005, FR-008) to starter capabilities — exactly the contract shape the lesson promises.
- Use in lesson:
  - Live walkthrough screenshots/diffs come from these files.
  - The lesson can claim *replayability* honestly because the artifacts exist; the demo isn't a mockup.
- Confidence: high
- Notes:
  - Sibling-repo path; do **not** link from learner-facing prose. Treat as internal validation evidence and demo source — paths visible in the video/screenshot only as relative paths the kursant can mirror in their own repo.

### Existing 10xWorkflow skills (forward-looking map)

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/{10x-research,10x-frame,10x-plan,10x-implement,10x-tdd,10x-impl-review}/SKILL.md`
- Type: internal-course-material
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-04
- Supports:
  - All six skills exist and ship as the same SKILL.md format with the same frontmatter pattern (`name`, `description`, `allowed-tools`).
  - Each has its own contract shape (e.g. `/10x-tdd` reads `context/changes/<change-id>/plan.md` and writes test files; `/10x-frame` runs framing-challenge interview before `/10x-plan`).
  - This validates the spec's framework claim: "to ten sam format, tylko inna zawartość kontraktu wejścia/wyjścia".
- Use in lesson:
  - Forward-looking map section (point 6 of suggested structure): name them, point at the moduł where each lands, and stop. No mechanics deep-dive.
- Confidence: high
- Notes:
  - **Risk**: skill names may evolve before m2–m5 RC. Re-verify the names at draft RC; if any rename happens, update both this brief and the lesson copy.
  - The 10x-toolkit also ships `/10x-shape`, `/10x-prd`, `/10x-bootstrapper`, `/10x-init`, `/10x-new`, `/10x-status`, `/10x-archive`, `/10x-contract`, `/10x-impl-review-ci`, `/10x-auto-implement`, `/10x-plan-review`, `/10x-lesson` — useful to mention in passing only if the lesson wants to underline scale; not required.

## Practitioner Signals

### "Skills vs MCP tools for agents: when to use what" (LlamaIndex blog)

- URL: https://www.llamaindex.ai/blog/skills-vs-mcp-tools-for-agents-when-to-use-what
- Type: technical-post (vendor blog, but author-credible)
- Signal:
  - Practitioners distinguish Skills and MCP as **different layers**, not as one being "broader" than the other:
    - "For the agent, the challenge it faces with an MCP tool is deciding which tool to run and when only. Whereas the challenge it faces with a skill is to decide which skill to use, when, and how."
    - MCP = "precise, predictable operations with clear inputs/outputs"; Skills = "behavioral guidance and contextual adaptation".
  - Real-world note: in LlamaAgents Builder, MCPs alone often gave enough planning context; Skills didn't always materially improve outcomes. Useful context for an honest lesson framing — Skills aren't a free win on every problem.
- Useful language:
  - "different abstraction levels", "alternative strategies", "behavioral guidance vs functional interface".
- Risk:
  - Lesson must **not** quote LlamaIndex saying Skills are universally better — the blog explicitly does not. Treat as practitioner support for "different layer", not as endorsement.
- Confidence: medium

### "MCP vs Agent Skills: Capabilities and Procedures Explained" (Layered.dev)

- URL: https://layered.dev/mcp-vs-agent-skills/
- Type: technical-post
- Signal:
  - Captures the now-common framing: **"MCP is the capabilities layer; Skills is the procedures layer."** "Access to tools doesn't mean you know how to use them correctly."
- Useful language:
  - "warstwa narzędziowa (capabilities) vs warstwa proceduralna (procedures)" — clean Polish translation usable in the draft.
- Risk:
  - Vendor-flavored post; framing is consensus-grade but the source is not authoritative on its own.
- Confidence: medium

### "MCP vs Skills Is the Wrong Debate" (Obot)

- URL: https://obot.ai/blog/skills-arent-the-mcp-killer-mcp-dev-summit/
- Type: technical-post (practitioner signal)
- Signal:
  - Direct practitioner pushback against the "Skills replace MCP" framing. Confirms that the "broader in scope" framing (which the spec flagged) is **a known overreach**, not a mainstream position.
- Useful language:
  - "the protocol layer and the instruction layer aren't substitutes, they're complements".
- Risk:
  - Vendor blog; cite as practitioner sentiment, not as authority.
- Confidence: medium

### Anthropic Cookbook — Agent Skills introduction notebook

- URL: https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction
- Type: official-docs (cookbook, code-first)
- Signal:
  - Practical entry point if a kursant wants to *write* a skill via the API rather than via Claude Code's filesystem layout. Worth a single line in Materiały dodatkowe for kursants on the API track.
- Useful language: n/a — code-first.
- Risk: pulls toward API-side details that belong outside m1-l2's scope; do not deep-link.
- Confidence: medium

## Examples Worth Using

- **Worked example: 10xCards PRD → `/10x-tech-stack-selector` → `tech-stack.md`** with the documented frontmatter (`starter_id: 10x-astro-starter`, `bootstrapper_confidence: first-class`, `path_taken: standard`, `has_auth: true`, `has_ai: true`). Real artifact, not a mockup.
- **Anatomy walkthrough on the live SKILL.md** of `/10x-tech-stack-selector`: the `description` field shows trigger phrases (`"what stack should I use"`, `"co wybrać do projektu"`); `allowed-tools` shows the runtime contract; `references/` shows progressive-disclosure split (registry, residual interview, decision flow, hand-off schema, agent-friendly criteria). All concrete, all readable.
- **Anatomy contrast pair**: `/10x-tech-stack-selector` (chain-style, file-in/file-out) vs `supabase/agent-skills/supabase-postgres-best-practices` (always-on advisory while writing Postgres). Two valid shapes, same format.
- **Side example for "skill knows when to fire itself"**: vendor `react-best-practices` triggers on React/Next.js work without an explicit invocation, because its `description` names the contexts. Strong evidence for the lesson's "agent reads the description at startup, not the body" mechanic.
- **Concrete failure mode for the prompt-or-skill picker**: pasting PRD into chat with "wybierz mi stack" produces a sensible answer once but no `tech-stack.md` on disk, no `bootstrapper_confidence`, no agent-friendly gates — `/10x-bootstrapper` then has nothing to read. Worth showing literally in video.
- **Heuristic anchor**: "trzeci raz piszesz podobny prompt — tam żyje skill". Aligned with `skill-creator`'s own framing of capturing repeating workflows.

## Claims To Avoid Or Soften

- **"Skille są szersze w zasięgu niż MCP" / "skille orkiestrują workflowy ponad MCP"** — wrong as written.
  - Anthropic's own engineering post calls Skills and MCP **complementary**, not "one broader than the other".
  - The mainstream practitioner framing (LlamaIndex, Layered, Obot, Maxim) is **two layers**: MCP = capabilities/tools (a protocol over RPC), Skills = procedures/workflows (a packaging format).
  - **Required softening**: replace any "broader in scope" / "ponad MCP" phrasing with "**inna warstwa stosu agentowego — skille pakują procedury, MCP standaryzuje narzędzia; składają się, nie wykluczają**". The forward reference to m1-l5 stays a single sentence.
- **"Skille są najczęściej używaną w praktyce abstrakcją"** — flagged by the spec; weak. There is no measured benchmark of "most-used abstraction"; skills.sh shows a six-figure install count but that proves adoption, not "most-used".
  - **Required softening**: "centralna abstrakcja w 10xWorkflow" or "podstawowy budulec łańcucha" — claim what we own and can demonstrate, not the ecosystem-wide superlative.
- **"Skille są kluczową, oficjalnie zdefiniowaną abstrakcją w pracy z agentem w programowaniu"** — partial: "officially defined" and "officially supported across Claude products" are clean (Anthropic docs); "kluczowa abstrakcja" is editorial framing, fine if scoped to "in this course / in our workflow" rather than "in the field at large".
- **"Ponad 25 609 skilli w skills.sh"** — stale and risky; also conflates "installations" with "skills". Snapshot 2026-05-04 shows ~91k installations on the leaderboard. Use directional language ("tysiące skilli", "dziesiątki tysięcy instalacji w rejestrze") and recheck before publish.
- **"Wszystkie 24 narzędzia obsługują skille tak samo"** — never claim this. The skills.sh list is an ecosystem signal; tool support varies (path conventions, frontmatter handling, tool subsets). Say "wiele agentów (m.in. Claude Code, Cursor, Codex, Gemini CLI) czyta ten format z lokalnych ścieżek" and stop.
- **"`skill-creator` napisze za ciebie skill"** — overstates. The lesson's preview should say "pomaga zarysować szkielet SKILL.md, kiedy znasz kontrakt wejścia i wyjścia"; full authorship still requires the user's interview answers and iteration. This matches the meta-skill's own framing.
- **"Pełen tour rejestru 25 starterów" / "cztery bramki agent-friendly"** — spec already forbids the deep tour. Hold to that: name the existence, never the contents.

## Open Verification Questions

- Does the 10x-toolkit ship a Polish wrapper for `skill-creator` (e.g. `/10x-skill-creator`), or do we point at `anthropics/skills/skill-creator` directly? Spec is ambiguous; current 10x-toolkit listing (`packages/ai-artifacts/skills/`) does not show one. Default: cite the upstream `skill-creator` and note the kursant's installed copy at `~/.claude/skills/skill-creator/`. **Needs human decision** before draft RC. Decision: 10x-toolkit will ship 10x-skill-creator (that will be automatically translated to polish for people that want to use it)
- Should the lesson cite Anthropic's `mcp-builder` skill (also in `anthropics/skills`) as the natural "MCP belongs in m1-l5, here's where you'll meet it" pointer, or stay silent and only forward-reference m1-l5 by lesson id? Default: stay silent; cite m1-l5 by lesson id only. Surfaces as **needsHumanDecision** if the m1-l5 spec later asks for an explicit pointer. Decision: stay silent, don't mention mcp-builder skill
- Will `/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review` keep their current names through m2–m5 RC? If any get renamed, the forward-looking map must be regenerated. Recheck against `lessons-schema.json` immediately before m1-l2 RC. Decision: names are set and won't change.
- Anthropic's own Skills security guidance is strong-worded ("treat like installing software"). Is the lesson comfortable with that level of caution in Polish, or do we want a softer phrasing for the audit step? Default: keep the strong framing — the failure mode (untrusted skill executes code) is real. Decision: keep strong framing

## Schema Source Update

Updated `workbench/lessons-schema.json` for lesson `m1-l2`:

- Added `groundingSources` (10 entries) covering official Anthropic docs, the canonical `skill-creator` skill, the engineering blog, the public registry (`skills.sh`), the CLI implementation (`vercel-labs/skills`), two production vendor skills (`vercel-labs/agent-skills` React, `supabase/agent-skills` Postgres), the `/10x-tech-stack-selector` source, the 10xCards demo artifacts, and the forward-looking 10xWorkflow skill set. Each entry carries `claimsSupported`, `confidence`, `checkedAt: 2026-05-04`, and notes that flag stale figures or scope risks.
- Updated `sideEffectLedger.unsupportedFacts` to:
  - mark the spec's `skills.sh > 25 609` figure as stale (use directional phrasing in the draft);
  - mark the "broader in scope than MCP" framing as **wrong as written, must be softened** to a complementary-layers framing;
  - keep the "tool adoption claim is real but uneven" caveat as a draft instruction, not a deletion.
- Updated `sideEffectLedger.needsHumanDecision` to call out:
  - whether to cite a Polish wrapper for `skill-creator` if/when 10x-toolkit ships one;
  - whether the lesson points at `anthropics/skills/mcp-builder` as a natural m1-l5 anchor or stays silent;
  - the schedule for re-verifying 10xWorkflow skill names before draft RC.

The lesson's `owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders` were **not** populated in this pass — those are the spec's "Schema Enrichment Proposal" and require an explicit schema-update decision separate from grounding.
