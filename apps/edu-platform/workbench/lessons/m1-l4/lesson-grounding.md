# Lesson Grounding: m1-l4 — Agent Onboarding: Agents.md, AI Rules i feedback loops

## Scope

- Lesson source: schema + spec + draft + video placeholders + previous grounding
- Neighbor boundaries: m1-l3 owns bootstrap, permissions, scaffold verification, and hands off with "project exists, agent does not know conventions"; m1-l5 owns deployment, CI/CD, MCP, and production-operability outer loop
- Relevant prework: [2.2] Cursor as an AI IDE, [2.3] Claude Code as terminal agent with project memory, [3.2] instruction hierarchy, [3.3] context lifecycle and Write/Select/Compress/Isolate
- Research posture: deep refresh — current official docs were rechecked on 2026-05-14 because this lesson contains tool-behavior claims, slash-command claims, memory paths, hook syntax, and quantitative research claims

## Claims To Support

- "AGENTS.md can reduce agent execution time and output tokens" — thesis anchor — needs empirical support and tight caveats
- "Redundant or LLM-generated context files can raise cost and reduce task success" — core failure mode — needs empirical support and nuance
- "`/init` in Claude Code creates or improves CLAUDE.md" — demo anchor — needs current official docs
- "Codex reads AGENTS.md, but there is no confirmed built-in `/init` equivalent in current official Codex docs" — draft-risk check
- "Claude Code auto memory and Codex memories have concrete local storage behavior" — exact-path/tool-behavior claim
- "Formatter/test hooks can create an autonomous inner loop" — needs official hook syntax confirmation
- "GitHub Copilot supports `.github/copilot-instructions.md`, path-scoped instructions, and AGENTS.md precedence" — current tool-support claim
- "Cursor rules should be focused, actionable, scoped, and split by context" — current tool-support claim
- "Instruction placement matters because models use long context unevenly" — needs paper support, not generic intuition
- "`/10x-agents-md`, `/10x-rule-review`, and `/10x-lesson` exist in the m1l4 lesson pack and behave as the draft says" — internal course-delivery claim

## Strong Sources

### On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents

- URL: https://arxiv.org/abs/2601.20404
- Type: paper
- Author/publisher: Jai Lal Lulla, Seyedmoein Mohsenimofidi, Matthias Galster, Jie M. Zhang, Sebastian Baltes, Christoph Treude
- Checked: 2026-05-14
- Supports:
  - AGENTS.md was associated with 28.64% lower median wall-clock runtime and 16.58% lower output token use in the study setup.
  - The study covered 10 repositories and 124 pull requests.
  - The source is about operational efficiency, not a broad correctness guarantee.
- Use in lesson:
  - Keep in Deep Dive and Materiały dodatkowe.
  - Use as an empirical anchor for "good project context can reduce błądzenie", with caveats.
- Confidence: high
- Notes:
  - Current arXiv page shows v2 last revised on 2026-03-30.
  - The abstract names Codex and Claude Code as examples of AI coding agents, but the existing course notes say the measured setup was Codex-only. Keep the draft phrasing scoped: "w badaniu na OpenAI Codex, dla małych PR-ów".
  - Do not convert this into "AGENTS.md improves all agents by 28%".

### Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

- URL: https://arxiv.org/abs/2602.11988
- Type: paper
- Author/publisher: Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, Martin Vechev
- Checked: 2026-05-14
- Supports:
  - Context files can reduce task success while increasing inference cost by over 20%.
  - Both LLM-generated and developer-provided context files can encourage broader exploration and stronger obedience to instructions.
  - Human-written context files should describe minimal requirements.
- Use in lesson:
  - Core evidence for the inclusion test: do not pay context for redundant docs or generic framework advice.
  - Support the claim that AGENTS.md changes behavior, not just documentation.
- Confidence: high
- Notes:
  - The lesson should say "redundant / unnecessary requirements" rather than simply "long file".
  - The two AGENTS.md papers are not contradictory: one supports useful, scoped repo context; the other warns against noisy or redundant context.

### Claude Code Documentation — Memory, CLAUDE.md, /init, Rules

- URL: https://code.claude.com/docs/en/memory
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - `/init` generates a starting `CLAUDE.md`; if one exists, it suggests improvements rather than overwriting.
  - `CLAUDE_CODE_NEW_INIT=1` enables an interactive multi-phase `/init` flow that can set up CLAUDE.md files, skills, and hooks.
  - Claude Code reads `CLAUDE.md`, not `AGENTS.md`; `@AGENTS.md` import or a symlink is the recommended bridge.
  - Target size is under 200 lines per CLAUDE.md file; large files consume context and may reduce adherence.
  - `.claude/rules/` can hold modular and path-scoped rules.
  - Auto memory is on by default in current docs, requires Claude Code v2.1.59+, and can be toggled with `/memory`, `autoMemoryEnabled`, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY`.
  - Auto memory lives under `~/.claude/projects/<project>/memory/`; `MEMORY.md` is the entrypoint.
  - First 200 lines or 25KB of `MEMORY.md` load at session start; topic files load on demand.
- Use in lesson:
  - Authoritative anchor for `/init`, Claude-specific memory paths, `@AGENTS.md`, `.claude/rules/`, and the 200-line guidance.
- Confidence: high
- Notes:
  - Current docs explicitly distinguish context from enforcement: settings rules enforce, CLAUDE.md shapes behavior.
  - Auto memory is machine-local and shared across worktrees of the same git repository, not across machines or cloud environments.

### Claude Code Hooks Reference

- URL: https://code.claude.com/docs/en/hooks
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - Hooks are declared in JSON settings files and can react to lifecycle events such as `PostToolUse`.
  - `PostToolUse` can match tool names; `Edit|Write` is an exact alternation matcher.
  - The docs show a `PostToolUse` example that runs a lint check after edit/write tools.
- Use in lesson:
  - Use one minimal formatter/test-runner example in Core.
  - Keep hook architecture, event chains, and deeper policy design for m3-l3.
- Confidence: high
- Notes:
  - The lesson should present hooks as deterministic command/event wiring, not as a stronger natural-language instruction.

### OpenAI Codex Documentation — AGENTS.md and Memories

- URL: https://developers.openai.com/codex/guides/agents-md
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-05-14
- Supports:
  - Codex reads `AGENTS.md` files before doing any work.
  - Codex discovers global guidance in `CODEX_HOME` (default `~/.codex`) and project guidance from project root down to the current working directory.
  - Closer project guidance appears later in the combined prompt and overrides earlier guidance.
  - Codex stops adding instruction files when the combined size reaches `project_doc_max_bytes` (32 KiB default).
- Use in lesson:
  - Anchor the AGENTS.md hierarchy section and nested project-guidance behavior.
- Confidence: high
- Notes:
  - Current official docs do not confirm a built-in `/init` command that creates `AGENTS.md`. Treat the draft sentence "Codex na skutek tej samej komendy utworzy AGENTS.md" as unsupported until the product docs or local Codex app prove it.

### OpenAI Codex Documentation — Memories

- URL: https://developers.openai.com/codex/memories
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-05-14
- Supports:
  - Codex memories are off by default and unavailable in the EEA, UK, and Switzerland at launch.
  - Memories can be enabled in app settings or with `[features] memories = true` in `~/.codex/config.toml`.
  - Required team guidance belongs in AGENTS.md or checked-in docs; memories are local recall, not the only source for rules.
  - Main memory files live under `~/.codex/memories/` by default, under `CODEX_HOME`.
  - `/memories` controls current-thread memory behavior.
- Use in lesson:
  - Anchor the "Ślady po sesjach" Codex subsection.
- Confidence: high
- Notes:
  - Do not imply manual memory-file editing is the primary control surface. The docs explicitly frame those files as generated state.

### GitHub Copilot Documentation — Repository Custom Instructions

- URL: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- Type: official-docs
- Author/publisher: GitHub / Microsoft
- Checked: 2026-05-14
- Supports:
  - Repository-wide custom instructions live in `.github/copilot-instructions.md`.
  - Path-specific instructions live as `NAME.instructions.md` files under `.github/instructions/` and use `applyTo` globs.
  - AI-agent instructions can be expressed as one or more `AGENTS.md` files; the nearest AGENTS.md takes precedence.
  - Copilot cloud agent can be asked to generate a `.github/copilot-instructions.md` onboarding file.
  - Multiple types of custom instructions may all apply; GitHub warns against conflicting instructions.
- Use in lesson:
  - Replace older "GitHub changelog only" grounding with a stronger current docs source.
  - Supports the draft's "Copilot has no local CLI `/init`; cloud agent can generate custom instructions" framing.
- Confidence: high
- Notes:
  - The docs mention `excludeAgent` for path-specific instructions. If the lesson discusses agent-specific narrowing, use the current values from docs (`code-review`, `cloud-agent`) rather than stale changelog wording.

### Cursor Rules Documentation

- URL: https://docs.cursor.com/context/rules
- Type: official-docs
- Author/publisher: Cursor / Anysphere
- Checked: 2026-05-14
- Supports:
  - Cursor Project Rules live in `.cursor/rules`, are version-controlled, and can be scoped by path patterns.
  - Cursor also supports User Rules, Memories, and AGENTS.md as a simple instruction-file alternative.
  - Cursor docs frame good rules as focused, actionable, and scoped.
  - Best practices: keep rules concise, split large concepts, provide concrete examples or referenced files, avoid vague guidance, and reuse rules when prompts repeat.
- Use in lesson:
  - Supports the "Jak oczyścić szkic" and granular-rule sections.
- Confidence: high
- Notes:
  - Current docs mention AGENTS.md support more explicitly than the older grounding. Use Cursor as a rules-scoping source, not as the primary standard for all tools.

### Lost in the Middle: How Language Models Use Long Contexts

- URL: https://arxiv.org/abs/2307.03172
- Type: paper
- Author/publisher: Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, Percy Liang
- Checked: 2026-05-14
- Supports:
  - Models can perform best when relevant information is near the beginning or end of long context, and worse when information is in the middle.
  - Long-context availability does not imply robust use of every position inside the context.
- Use in lesson:
  - Supports the U-shaped attention explanation for ordering and splitting rules.
- Confidence: high
- Notes:
  - This is not an AGENTS.md-specific paper. Use it as context-shape support, not as direct proof that line 300 of every CLAUDE.md is ignored.

### system_prompts_leaks — Community System Prompt Collection

- URL: https://github.com/asgeirtj/system_prompts_leaks
- Type: repo
- Author/publisher: Community-maintained repository
- Checked: 2026-05-14
- Supports:
  - Provides illustration material for how agent prompts separate vendor/system behavior from project-specific context and tool instructions.
  - Current repository page lists Claude Code and Codex prompt examples and shows ongoing updates.
- Use in lesson:
  - Use only as illustrative material in Deep Dive.
  - Prefer structural observations over long quoted excerpts.
- Confidence: medium
- Notes:
  - Crowdsourced and unaudited. Do not present as official Anthropic/OpenAI/Cursor architecture.
  - The draft currently includes direct excerpts from the community Claude Code and Cursor prompts. Keep quotes short or convert them to paraphrased observations during RC polish.

### 10x Content Delivery Reference

- URL: /Users/admin/code/przeprogramowani-sites/projects/edu-platform/workbench/references/10x-content-delivery.md
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10xDevs 3.0 workbench
- Checked: 2026-05-14
- Supports:
  - Learner-facing lesson prose should use `npx @przeprogramowani/10x-cli@latest get m1l4`, not internal toolkit installation commands.
  - Canonical skill sources live in `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md`.
  - Lesson wiring lives under `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/`.
- Use in lesson:
  - Confirms the draft's CLI fetch command is learner-facing and correct.
- Confidence: high
- Notes:
  - The draft correctly uses `npx @przeprogramowani/10x-cli@latest get m1l4`.

### 10xDevs 3.0 Toolkit — m1l4 Lesson Wiring and Skills

- URL: /Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-01/lesson-04.ts
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-14
- Supports:
  - m1l4 delivers `10x-agents-md`, `10x-rule-review`, and `10x-lesson`.
  - `/10x-agents-md` creates or surgically updates AGENTS.md; it is optimized to be small, precise, reference-heavy, and ordered with critical rules first.
  - `/10x-rule-review` scores a rules file on length, snippets, precision, redundancy, and ordering.
  - `/10x-lesson` appends one recurring rule to `context/foundation/lessons.md`; it is not a one-off bug log.
- Use in lesson:
  - Supports the tool promises in Core and the `context/foundation/lessons.md` section.
- Confidence: high
- Notes:
  - This source creates a schema/draft tension: the current schema still requires `failure-modes.md`, while the draft and toolkit use `context/foundation/lessons.md` through `/10x-lesson`. Resolve before RC.

## Practitioner Signals

### Community prompt collections as language for "instruction anatomy"

- URL: https://github.com/asgeirtj/system_prompts_leaks
- Type: practitioner-signal / repo
- Signal:
  - The community treats system prompts as inspectable examples of how vendors partition behavior, safety, project context, tools, and task execution.
  - This is useful for teaching the hierarchy, but weak for factual claims about live product behavior.
- Useful language:
  - "warstwa producenta" vs. "warstwa projektu"
  - "AGENTS.md nie zastępuje system promptu; wypełnia lokalną lukę"
- Risk:
  - Individual prompt files may be stale, incomplete, or extracted through unknown methods.
- Confidence: medium

### Rule-file sprawl and scoped rules

- URL: practitioner discussions around Cursor/GitHub/Codex rule files
- Type: practitioner-signal
- Signal:
  - Developers increasingly keep a tiny always-on file and move domain rules into scoped files or referenced documents.
  - Common objection: too many tool-specific files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `.github/copilot-instructions.md`) drift unless there is one source of truth.
- Useful language:
  - "one rule should not live in three places"
  - "short always-on file + scoped rules"
- Risk:
  - Treat as practitioner language only. Official docs and internal skill wiring should carry the factual claims.
- Confidence: low

## Examples Worth Using

- **Inclusion test demo:** ask the agent to create an API handler with a project-specific error shape. Without a rule it likely uses a common generic shape; with a 1-3 sentence rule it should match the local convention.
- **No-rule-needed control:** ask for a mainstream framework default or a standard REST pattern. If the agent gets it right without AGENTS.md, do not add it.
- **Rule-review pass:** run `/10x-rule-review AGENTS.md` after creating or editing the file; frame it as static quality control before a fresh-session behavioral test.
- **Append-only lesson capture:** use `/10x-lesson` only for repeatable failure classes that should affect future framing, planning, implementation, or review. Store them in `context/foundation/lessons.md`.
- **Claude hook inner loop:** show one `PostToolUse` example with `Edit|Write` matcher and a project formatter/test command. Keep it as a simple local signal, not a hook architecture lesson.
- **Memory audit:** inspect `~/.claude/projects/<project>/memory/MEMORY.md` after a session; inspect Codex memory files under `~/.codex/memories/` only as generated state when troubleshooting.

## Claims To Avoid Or Soften

- "AGENTS.md reduces agent work by 28%" — soften to: "In one Codex small-PR study, AGENTS.md was associated with ~29% lower median runtime and ~17% fewer output tokens."
- "Long AGENTS.md files are bad" — soften to: "Redundant, unnecessary, or generic instructions are bad; length is a useful warning signal, not the causal mechanism by itself."
- "Codex has the same `/init` behavior as Claude Code" — avoid until verified. Current official Codex docs confirm AGENTS.md discovery and memory, not a built-in `/init` that writes AGENTS.md.
- "Community system prompt files prove vendor architecture" — avoid. They illustrate instruction anatomy but do not replace official docs.
- "Cursor prompt terminal-state behavior is a product fact" — avoid unless grounded in official Cursor docs. If used, present as a community prompt observation with medium confidence.
- "`failure-modes.md` is the current learner artifact" — avoid unless schema is brought back into alignment. Current toolkit and draft use `context/foundation/lessons.md`.
- "Manual editing of generated memory files is the normal control surface" — soften. Official docs allow inspection/editing in some contexts, but durable team rules belong in checked-in docs and AGENTS.md/CLAUDE.md.

## Open Verification Questions

- Does the current Codex app or Codex CLI expose a built-in `/init` that writes `AGENTS.md`? Official Codex docs checked on 2026-05-14 did not confirm it. Draft line 155 should be revised or verified in-product before RC.
- Should the lesson schema replace `failure-modes.md` with `context/foundation/lessons.md` / `/10x-lesson`? The draft and toolkit now agree on `lessons.md`; the schema still contains `failure-modes.md`.
- Should the Deep Dive keep literal community system-prompt excerpts? The grounding supports structural analysis, but RC should limit quotes and mark the repo as community-maintained.
- Should Copilot "generate instructions" be framed as GitHub cloud agent behavior, JetBrains IDE behavior, or both? Current GitHub docs support cloud-agent generation; a 2026 GitHub changelog supports JetBrains "Generate Agent Instructions" as well.

## Schema Source Update

Updated `workbench/lessons-schema.json` under `m1-l4.groundingSources`:

- Rechecked and updated dates for the two AGENTS.md papers.
- Replaced the older bundled "Claude Code Documentation — Memory, /init, Hooks" source with current `code.claude.com` memory and hooks sources.
- Replaced the GitHub changelog-only Copilot source with current GitHub Docs for repository instructions.
- Added Cursor Rules docs, Lost in the Middle, 10x content delivery, and the m1l4 toolkit wiring/skill sources.
- Preserved community system prompt collection as medium-confidence illustrative material only.

Updated `sideEffectLedger`:

- Added unsupported fact for Codex `/init` creating AGENTS.md.
- Added video/text mismatch for `failure-modes.md` schema language vs. `context/foundation/lessons.md` draft/toolkit reality.
- Added human-decision items for the Codex `/init` wording, `failure-modes.md` vs. `lessons.md`, and community prompt excerpt treatment.
