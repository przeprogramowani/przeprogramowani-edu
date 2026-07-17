# Keeping AI Instruction Files from Going Stale (Multi-Module Repos)

> **Follow-up report for M4L5 · 10xDevs** — answers the maintenance/governance question from `context-engineering-multi-module.md` (Q2).
> Produced via deep-research harness: 21 sources fetched, 99 claims extracted, 25 adversarially verified (25 confirmed, 0 killed).
> Date: 2026-06-02

## TL;DR

There are **three vendor-documented anti-staleness mechanisms** — co-locate rules with code, treat the instruction file like code (prune/audit), and run a self-updating learnings loop — plus a reviewer/auditor sub-agent pattern. The **one real gap** is governance: **CODEOWNERS ownership and CI review gates for instruction files are NOT vendor-documented** — they remain team convention. The course already ships two of the pieces (`/10x-rule-review`, `/10x-lesson`).

## Mechanism 1 — Co-locate rules with the code they govern

The strongest anti-drift move is structural: put the rule next to what it governs, so it's edited in the same PR as the code. Vendor-documented across every major tool:

- **Codex** recommends placing overrides "as close to specialized work as possible"; agents.md cites **88 `AGENTS.md` files** in OpenAI's *internal* monorepo ([Codex guide](https://developers.openai.com/codex/guides/agents-md), [agents.md](https://agents.md/)). ⚠️ Note: the **public** `openai/codex` repo has only **2** — see [`repo-case-studies.md`](./repo-case-studies.md) for verified real-world counts (8–32 in genuinely nested repos).
- **Claude Code** auto-loads ancestor `CLAUDE.md` and lazily loads subdirectory files when it reads code there ([memory docs](https://code.claude.com/docs/en/memory)).
- **Copilot** binds rules to code regions via `applyTo` globs (e.g. `applyTo: "app/models/**/*.rb"`) ([Copilot docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide)).

> Why it fights staleness: a rule physically next to the code is far more likely to be updated when that code changes than a distant root file no one revisits. **Caveat:** this is *necessary but not sufficient* — co-location reduces drift, it doesn't eliminate the no-owner / accumulation problem (Mechanism 2).

**`AGENTS.md` as a structural mitigation against *cross-tool* drift:** it's an open standard (24 tools, **Linux Foundation / Agentic AI Foundation** stewardship as of Dec 2025, 60k+ repos), so you maintain one file instead of N per-tool files diverging ([agents.md](https://agents.md/)).

## Mechanism 2 — Treat the instruction file like code (prune + audit)

Anthropic's **most explicit** anti-staleness prescription ([best practices](https://www.anthropic.com/engineering/claude-code-best-practices), [memory docs](https://code.claude.com/docs/en/memory)):

- **"Bloated CLAUDE.md files cause Claude to ignore your actual instructions"** — rules get "lost in the noise."
- **Per-line inclusion test:** *"For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it."*
- **Explicitly exclude "information that changes frequently"** — the single best staleness-avoidance rule: don't put fast-moving facts in a slow-moving file.
- **Ruthlessly prune:** *"If Claude already does something correctly without the instruction, delete it or convert it to a hook."*
- **Periodic audit:** *"Review your CLAUDE.md files, nested CLAUDE.md files in subdirectories, and `.claude/rules/` periodically to remove outdated or conflicting instructions"* — because contradictions make Claude "pick one arbitrarily."
- **Test empirically:** *"test changes by observing whether Claude's behavior actually shifts."*

> This is vendor *best-practice/opinion*, not a measured study. But it's the closest thing to a documented maintenance discipline, and it maps 1:1 onto the course's **`/10x-rule-review`** (5-axis scorecard, audit-only).

## Mechanism 3 — Self-updating "learnings" loops

Turn corrections into durable rules automatically, so the file keeps up with reality:

- **Claude Code auto memory** — *default-on* (v2.1.59+), Claude writes its own learnings to `~/.claude/projects/<project>/memory/MEMORY.md` (first 200 lines / 25 KB loaded each session). **Distinct from `CLAUDE.md`**: auto memory = Claude-written learnings; `CLAUDE.md` = human-written instructions. Conversational capture: "always use pnpm" → auto memory; "add this to CLAUDE.md" → the instruction file ([memory docs](https://code.claude.com/docs/en/memory)).
- **Sub-agent persistent memory** — a sub-agent's `memory` field is "a persistent directory that survives across conversations" for "codebase patterns, debugging insights, architectural decisions"; documented pattern: *"Ask the sub-agent to update its memory after completing a task"* ([sub-agents docs](https://code.claude.com/docs/en/sub-agents)). (Note: this maintains the *sub-agent's own* store, not `CLAUDE.md` — the staleness bridge is interpretive.)
- **Reflexion** (academic grounding) — language agents improve "not by updating weights, but through linguistic feedback" ([arXiv 2303.11366](https://arxiv.org/abs/2303.11366)). It uses an episodic buffer, not rule-file edits — the bridge to `CLAUDE.md` is analogical.
- **`claude-reflect`** (concrete OSS) — hook scripts detect corrections ("no, use X" / "actually…") via regex + an AI semantic filter, then **sync approved learnings to `CLAUDE.md`/`AGENTS.md`** across global/project/nested scopes — **gated by an explicit human-approval step** (`/reflect → Apply? [y/n]`) ([repo](https://github.com/BayramAnnakov/claude-reflect)). *Caveat: single niche project, not a standard.*

> Course analog: **`/10x-lesson`** appends recurring pitfalls to `context/foundation/lessons.md`, read as priors by `frame`/`research`/`plan`/`implement`/`review` — a working, human-in-the-loop learnings loop.

## Mechanism 4 — A reviewer/auditor sub-agent (closest thing to a "rule-maintenance specialist")

The user's instinct ("maybe we need a skill that keeps rules updated") matches a documented pattern — but only partially:

- Anthropic's **canonical first sub-agent example is a read-only reviewer** (tools: Read, Grep, Glob, Bash; **no Edit/Write**), checked into version control "so your team can use and improve them collaboratively" ([sub-agents docs](https://code.claude.com/docs/en/sub-agents)).
- **But:** *no vendor doc describes a sub-agent dedicated specifically to instruction-file/rule auditing.* That remains an **emergent composition** (reviewer pattern + persistent memory), not a named published pattern. So a dedicated "rule-maintenance skill" is a legitimate **course contribution**, not a reinvention — and `/10x-rule-review` + `/10x-lesson` + `claude-reflect`'s capture→human-approval design are the templates to build it from.

## Mechanism 5 — Monorepo tooling at scale

- **Nx** ships `npx nx configure-ai-agents` — generates `CLAUDE.md` / `AGENTS.md` / MCP server / skills **from a single source of truth** across six tools (Claude Code, Cursor, Copilot, Gemini, Codex, OpenCode). Nx frames the exact problem: *"Different AI agents require instructions in different files… leading to manual duplication and drift,"* solved by single-source generation ([Nx blog](https://nx.dev/blog/nx-ai-agent-skills)). *Caveat: "every tool gets the same capabilities" is Nx's design statement, not an audited drift-elimination result.*
- **Community drift-detection CLIs** exist (e.g. a Cursor-forum tool that flags missing commands, dead paths, and conflicting nested `AGENTS.md` files) — a sign that **automated drift linting is an emerging practice**, not yet vendor-standard.

## The gap to teach honestly: governance is NOT vendor-documented

The two governance-heavy asks have **no vendor framework**:

- **Ownership** — CODEOWNERS on `CLAUDE.md`/`AGENTS.md` so each module's rules have an accountable maintainer.
- **CI review gates** — a lint/PR check that fails when code conventions change without a matching instruction-file update.

GitHub's Copilot instruction-file docs provide **no** ownership / change-management / staleness guidance (the only split 2-1 vote in this research — governance content is *absent*, not present). GitHub's blog elsewhere says "treat it as a living document" and warns conflict-resolution is "non-deterministic," but that's advice, not a framework. **Net: present CODEOWNERS + CI gates as practitioner convention the team must adopt, not as documented practice.** No source measured whether *any* of these mechanisms actually reduce drift in production — existence is documented, effectiveness is not.

## Recommended composite for M4L5 (multi-module)

1. **Co-locate** — per-module `AGENTS.md`/`CLAUDE.md`, lean, next to the code (Mechanism 1).
2. **Discipline** — per-line inclusion test + exclude fast-moving facts + periodic audit via **`/10x-rule-review`** (Mechanism 2).
3. **Loop** — capture corrections into rules via **`/10x-lesson`** / auto memory, human-approved (Mechanism 3).
4. **Audit agent** — a read-only reviewer/`/10x-rule-review` run, ideally per-module (Mechanism 4).
5. **Governance (team-owned, not vendor)** — CODEOWNERS per instruction file + a CI gate flagging convention changes without a rules update (the gap).
6. **At scale** — single-source generation (Nx-style) if you support multiple tools, to kill cross-tool drift (Mechanism 5).

## Open questions

1. Any vendor/named-blog framework for instruction-file **ownership + CI review gates**? (Evidence here is an *absence*, not a positive pattern.)
2. Cross-tool **conflict-resolution** semantics when nested files actively conflict (vs. merely stack)?
3. **Measured** effectiveness — does pruning / auto memory / claude-reflect actually reduce drift at scale? (No source measured outcomes.)
4. How do large OSS monorepos beyond openai/codex (88 files) and Nx **operate** instruction files day-to-day (review cadence, who edits, audit tooling)?

## Sources

**Primary:** [Anthropic best practices](https://www.anthropic.com/engineering/claude-code-best-practices) · [Claude Code memory](https://code.claude.com/docs/en/memory) · [Claude Code sub-agents](https://code.claude.com/docs/en/sub-agents) · [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md) · [agents.md](https://agents.md/) · [Copilot repo instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide) · [Nx AI agent skills](https://nx.dev/blog/nx-ai-agent-skills) · [Reflexion (arXiv 2303.11366)](https://arxiv.org/abs/2303.11366)
**OSS / community:** [claude-reflect](https://github.com/BayramAnnakov/claude-reflect) · AGENTS.md drift-detection CLI (Cursor forum)
