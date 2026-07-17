# Multi-Repo (Polyrepo) Context Engineering — the Harder Enterprise Case

> **Report for M4L5 · 10xDevs** — context engineering across *many separate repositories*, common at companies and harder than a monorepo.
> Date: 2026-06-02. **Sourcing note:** the deep-research harness glitched on its verification stage (subagents failed to emit structured output → all claims defaulted to "abstain", not genuine refutation). I therefore **re-verified the key facts myself against primary docs** (links inline); facts already confirmed in earlier passes are marked ✓prior.

## Why multi-repo is genuinely harder than monorepo

A monorepo gives agents **one file tree**: nested `AGENTS.md`/`CLAUDE.md` + root→cwd discovery work, the agent can read shared libraries directly, conventions live in one place, and one PR can span modules. **None of that holds across separate repos.** Instruction-file discovery is confined to a single repository tree (Claude Code walks up to the filesystem root *of that checkout*; Codex walks the git root down) — **it never reaches into sibling repos** (✓prior, [Claude memory](https://code.claude.com/docs/en/memory), [Codex](https://developers.openai.com/codex/guides/agents-md)). So in polyrepo you lose the whole nesting mechanism and must replace it with three separate moves:

1. **Apply universal conventions across all repos** (machine/org/user-level instructions).
2. **Distribute shared project context into each repo** (because each repo still needs its own committed files) — the N-way drift problem.
3. **Give the agent cross-repo runtime visibility** (sibling code, contracts, services).

> **Course framing (important):** the *infrastructure* for #2 — building a shared registry of skills, commands and rules and distributing it to every repo (an internal library package or a CLI like `@przeprogramowani/10x-cli`) — is **not built in this lesson**. It's the subject of **M5L3 — "Shared AI Registry: skills, commands and rules for the team."** And it matters **only for companies whose teams work across several repositories** — solo learners and single-repo MVPs do not need it. M4L5 only needs to make learners *aware* of the polyrepo problem and the shape of the solution.

---

## Layer 1 — Universal conventions across all repos (org / user / machine level)

What each tool actually supports machine- or org-wide (applies to *every* repo without per-repo files):

| Tool | Cross-repo mechanism | Scope | Source |
|---|---|---|---|
| **Claude Code** | **Managed-policy `CLAUDE.md`** (`/Library/Application Support/ClaudeCode/CLAUDE.md` macOS, `/etc/claude-code/CLAUDE.md` Linux) — org-wide, **cannot be excluded**; deploy via MDM/Group Policy/Ansible. Also `claudeMd` key in `managed-settings.json`. | Every session, every repo, every user on the machine | ✓prior [memory](https://code.claude.com/docs/en/memory) |
| **Claude Code** | **User** `~/.claude/CLAUDE.md` + `~/.claude/rules/` | All your projects, just you | ✓prior |
| **Codex CLI** | **Global** `~/.codex/AGENTS.override.md` (else `AGENTS.md`), `CODEX_HOME`-overridable | All your projects, just you | ✓prior |
| **GitHub Copilot** | **Organization custom instructions** — set in org settings, apply "across the organization" | ⚠️ **only** Copilot Chat / code review / cloud agent **on GitHub.com** — NOT the IDE or CLI; hierarchy with repo/personal instructions undocumented | [GH docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions) |
| **Cursor** | User/global rules (per-machine) | All projects, just you | (tool docs) |

**Strengths:** zero per-repo upkeep; true "write once, applies everywhere." **Limits to teach:** these are mostly **per-machine** (managed policy, `~/.claude`, `~/.codex` must exist on each developer's machine → needs MDM/onboarding automation) or **per-surface** (Copilot org instructions don't reach the IDE). They're right for **stable, universal** rules (security policy, "never commit secrets", company-wide style), **not** for project-specific architecture.

## Layer 2 — Distributing shared project context into each repo (the N-way drift problem)

Each repo still needs its own committed `AGENTS.md`/`CLAUDE.md`/`.mcp.json`. Copy-pasting them across 20 repos guarantees drift (no lockfile detects divergence). The documented fixes — a **single source of truth + a fan-out mechanism**:

| Mechanism | How | Versioning / drift control |
|---|---|---|
| **Shared package dependency** | Publish rules/skills as an npm (or internal) package; each repo depends on it | **semver** — best drift control; update = bump version |
| **CLI installer** (the 10x model) | A CLI pulls shared skills/rules/commands into each repo (`@przeprogramowani/10x-cli` ← `10x-toolkit`) | Re-run to update; pin CLI version |
| **Generator** | **[Ruler](https://github.com/intellectronica/ruler)** — one `.ruler/` source → fan-out to 30+ tools' native files (`CLAUDE.md`, `AGENTS.md`, Cursor, Copilot, Codex…); commit `.ruler/`, team runs `ruler apply`; global `~/.config/ruler` fallback. **Nx** `configure-ai-agents` similarly generates from one source. | Single source per repo; still must sync the source across repos |
| **Template repo** | New repos scaffolded from a standards template | Weakest — diverges after creation |
| **Git submodule / symlink** | Link a shared standards repo into each repo | Pinned by commit SHA; clunky |
| **CI sync bot** | A bot opens PRs syncing canonical files into every repo | Centralized; needs ownership |
| **Plugins** (Claude Code) | Bundle skills + MCP servers + rules; "everyone gets the same tools when the plugin is installed" | Versioned via plugin install | 

> ⚠️ **Subtlety:** tools like Ruler give a single source *per repo* fanned out across *tools* — they solve **multi-tool** drift inside one repo. **Multi-repo** drift still requires syncing that source across repos (package/CLI/submodule/bot). Don't conflate the two. **This whole layer is what M5L3 builds.**

## Layer 3 — Cross-repo runtime visibility (let the agent see the other repo)

Universal rules + distributed files still don't let an agent in repo A *see repo B's code/contracts*. Documented mechanisms:

- **Claude Code `--add-dir`** + `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` → bring a sibling repo into the session **and** load its `CLAUDE.md`/rules (off by default). The practical way to make a coordinated change across two checkouts. (✓prior)
- **Multi-root workspaces** (Cursor / VS Code) → open several repos in one window.
- **MCP servers** → expose *other systems and repos* to the agent: issue trackers, GitHub, databases, design tools, and **APIs/contracts defined elsewhere** (e.g. an OpenAPI service → MCP tools). Verbatim use case: *"Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."* MCP **scopes** matter for polyrepo ([MCP docs](https://code.claude.com/docs/en/mcp)):
  - **Project** `.mcp.json` (repo root, **checked into VC, shared with team**) — but **per-repo** → itself an N-way drift vector.
  - **User** `~/.claude.json` — **loads across ALL your projects** → the cross-repo personal layer for shared servers.
  - **Managed MCP** (`managed-mcp.json`, `allowedMcpServers`/`deniedMcpServers`) — org-level control.
  - **Plugin-bundled MCP** — distribute the same servers to every repo via a plugin.

> An **MCP server that exposes your shared contracts/design-system/API schemas** is often the cleanest answer to "the agent can't see the other repo" — the contract becomes a *tool/resource* every repo's agent can query, instead of context you must copy into each repo.

---

## What is NOT solved by any tool today (teach this honestly)

- **No automatic cross-repo awareness.** An agent in repo A does **not** discover repo B's conventions or code on its own. You must wire it (`--add-dir`, MCP, or distributed/duplicated context). There is no polyrepo equivalent of the monorepo single tree.
- **Org-wide instruction support is uneven.** Claude Code has managed-policy + user files; Codex has a per-user global; Copilot's org instructions are GitHub.com-surface-only; there's **no cross-tool, cross-repo org standard**.
- **Distribution ≠ runtime.** Even Ruler/Nx generate files you still commit per repo; keeping the *source* in sync across repos is your responsibility (package/CLI/bot).
- **Effectiveness is unmeasured** — these are documented capabilities and practitioner patterns, not benchmarked outcomes.

## Monorepo vs polyrepo for agents — the tradeoff

| | **Monorepo** | **Polyrepo** |
|---|---|---|
| Instruction discovery | Nested files + root→cwd **work** | **Break** at repo boundary |
| Shared libs/contracts | Agent reads them directly | Invisible by default → MCP / `--add-dir` |
| Convention source | One place | Org/user level **+** per-repo distribution |
| Drift risk | Low (one tree) | **High** (N copies) → needs single-source + fan-out |
| Cross-cutting change | One PR | Coordinated multi-PR |
| Right tool for context | Lean root + nested + `context/` (see [main report](./context-engineering-multi-module.md)) | Layer 1 + Layer 2 (**M5L3**) + Layer 3 |

**Takeaway:** monorepo pushes complexity *into the tree* (where the tools help you); polyrepo pushes it *into distribution and runtime wiring* (where you build infrastructure). That infrastructure is exactly the **Shared AI Registry** of M5L3.

## Where this leaves M4L5 (scope boundary)

M4L5 should **make learners aware** that:
1. nesting/`context/` strategies stop at the repo boundary,
2. universal rules go to org/user/machine level,
3. cross-repo visibility comes from `--add-dir` / MCP,
4. and the **team distribution infrastructure (internal package or a CLI like 10x-cli) is built in M5L3** — and is **only needed by companies operating across multiple repos.**

Do **not** teach the full registry build here; point forward to M5L3.

## Sources

- Claude Code memory (managed policy, user scope, `--add-dir`) — https://code.claude.com/docs/en/memory ✓prior + re-confirmed
- Claude Code MCP (scopes: project `.mcp.json` shared, user `~/.claude.json` cross-project; managed MCP; plugins) — https://code.claude.com/docs/en/mcp
- Codex global `~/.codex` AGENTS.md — https://developers.openai.com/codex/guides/agents-md ✓prior
- GitHub Copilot organization instructions (GitHub.com surfaces only) — https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions
- Ruler (single-source → 30+ agents, per-repo + `~/.config/ruler` global) — https://github.com/intellectronica/ruler
- Nx `configure-ai-agents` (single-source generation) — https://nx.dev/blog/nx-ai-agent-skills
- Practitioner: central-repo shared agent standards / distribution mechanisms — agentpatterns.ai (community)
