# Context Engineering for Programming Agents in Multi-Module Systems

> **Report for M4L5 · 10xDevs**
> Produced via deep-research harness: 23 sources fetched, 114 claims extracted, 25 adversarially verified (25 confirmed 3-0, 0 killed).
> Date: 2026-06-02

## The core constraint that drives every approach

Before comparing approaches, the single fact that explains *why* this is hard: **the context window is a finite resource with diminishing marginal returns.** As token count rises, the model's ability to recall any specific instruction degrades — Anthropic frames it as the model spending a finite "attention budget," a phenomenon independently corroborated by Chroma's *context-rot* study and Liu et al.'s *Lost in the Middle*. ([Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))

This is the load-bearing claim. Every approach below is really a different answer to one question: *which module's conventions deserve a slice of the attention budget right now?* A single fat root file spends the budget on every subsystem at once; per-module files spend it only when relevant; JIT mechanisms defer the spend until the agent actually asks.

## How the four tools actually load and merge files

This is the part most teams get wrong, because the tools **converge on an *additive/hierarchical* model, not an *override* model.** Nested files don't replace the root — they stack on top of it.

| Tool | Discovery & merge behavior | Path-scoping mechanism |
|---|---|---|
| **Claude Code** | Walks up the directory tree and **concatenates all ancestor `CLAUDE.md` files** (never overrides), ordered root→cwd so the closest file is read last. Subdirectory files load **on-demand**, only when Claude reads a file in that subtree. Four scopes by precedence: managed-policy → user → project → local. ([memory docs](https://code.claude.com/docs/en/memory), [large codebases](https://code.claude.com/docs/en/large-codebases)) | `paths:` YAML frontmatter on rules in a rules dir; `claudeMdExcludes` glob to skip other teams' ancestor files |
| **GitHub Copilot** | **Merges, never selects.** A path-specific match *plus* the repo-wide file → both are used. Nested `AGENTS.md`: nearest file takes precedence, others remain additional. Three mechanisms: one repo-wide `copilot-instructions.md`; `*.instructions.md` scoped by `applyTo` globs; `AGENTS.md` anywhere (`CLAUDE.md`/`GEMINI.md` root-only). ([IDE docs](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot), [CLI docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)) | `applyTo:` globs (comma-combinable) |
| **Cursor** | Four rule **application types** that map directly onto the task-vs-module split (below). ([Cursor rules docs](https://cursor.com/docs/rules)) | `globs:` frontmatter + `alwaysApply` + `description` |
| **Codex CLI** | **Eager additive merge, no lazy loading.** At launch builds one chain: global `~/.codex` → walk **down** from git root to cwd, one file per dir, concatenated root→cwd (nearer wins by ordering). **Only files on the root→cwd path load** — sibling packages and (unlike Claude Code) subtrees you edit *after* launch never load. Combined chain **capped at 32 KiB, silently truncated**. Full report → [`codex-cli-agents-md.md`](./codex-cli-agents-md.md). ([Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md), [config ref](https://developers.openai.com/codex/config-reference)) | `project_doc_fallback_filenames`; `AGENTS.override.md` hard-replaces at same level; `project_doc_max_bytes` raises the cap |

> **Teaching point for the lesson:** the mental model "the nearest file wins and replaces the root" is *wrong* for all three verified tools. The root always stays in context; module files **add** to it. This changes how you write them — module files should assume the root is present and not repeat it.

**My question**: When Claude Code stops walking up the directory tree? at system root? or it can detect PROJECT root and then stops + only loads global rules from a selected global directory?

> **Answer (verified against the live memory docs): Claude Code walks up to the FILESYSTEM root, not a detected project root — and this is the key difference from Codex.**
>
> The docs are explicit: it reads `CLAUDE.md`/`CLAUDE.local.md` "by walking up the directory tree from your current working directory, checking each directory along the way," and the result is "ordered **from the filesystem root down to your working directory**." There is **no git/project-root detection** for this walk — it keeps going all the way up. ([memory docs](https://code.claude.com/docs/en/memory))
>
> **Contrast with Codex CLI:** Codex *does* detect the **git root** and walks down from there (stops at the project boundary). So: **Claude Code = filesystem-root walk; Codex = project-root walk.** ([Codex guide](https://developers.openai.com/codex/guides/agents-md))
>
> **The "global" rules are separate, fixed locations** — *not* part of the upward walk — loaded by scope, broadest→specific:
> | Scope | Location |
> |---|---|
> | **Managed policy** (org, can't be excluded) | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) · `/etc/claude-code/CLAUDE.md` (Linux) |
> | **User** (your global) | `~/.claude/CLAUDE.md` |
> | **Project** (the upward tree-walk) | `./CLAUDE.md` up to filesystem root |
> | **Local** | `./CLAUDE.local.md` |
>
> **Practical consequence for monorepos:** because the walk reaches the filesystem root, a deeply nested project *can* pick up unrelated ancestor `CLAUDE.md` files above the repo. That's exactly why Claude Code provides **`claudeMdExcludes`** (glob/path) to skip them — Codex doesn't need an equivalent because it stops at the git root. **Teaching point:** the boundary model differs by tool, and "where does the walk stop?" is a concrete, demonstrable difference worth showing in the lesson.

---

## The six approaches, with strengths and downsides

### (a) Single root PRD and/or single root `CLAUDE.md`/`AGENTS.md`

**Strengths:** One file to own, trivially discoverable, loaded in full at launch so nothing depends on the agent "deciding" to read it. Fine for small or single-domain repos.

**Downsides — and this is documented by Anthropic, not just folklore:** a single root file "tends to either grow to cover every subsystem's conventions or stay too generic to be useful." ([large codebases](https://code.claude.com/docs/en/large-codebases)) The fat version taxes *every* session's attention budget with rules irrelevant to the current task; the generic version helps no one. Claude Code's documented target is **under 200 lines per file** — a hard signal that the single-root strategy doesn't scale past a few modules.

### (b) Per-module / nested `CLAUDE.md` / `AGENTS.md`

**Strengths:** Module conventions enter context only when that module is touched (Claude Code's on-demand subtree loading; Copilot's nearest-file precedence). Ownership maps to team boundaries. This is the **strongest documented default** for monorepos.

**Downsides:** Two distinct failure modes.
1. **Launch-location sensitivity (Claude Code):** launching from root loads *only* root (subdirs on demand); launching from a subdirectory loads that file **plus every ancestor**. Where you start the agent silently changes what it knows. ([memory docs](https://code.claude.com/docs/en/memory))

**My question**: so lets say I work on monorepo like /Users/admin/code/przeprogramowani-sites - if I start the claude code session from the root and then give a task to an agent inside edu-platform module/package/project - would it load edu-platform/CLAUDE.md? What happens if I run claude code from edu-platform level?

> **Answer (verified — and this very session proves it):**
>
> **Launch from the monorepo root** (`przeprogramowani-sites/`): only the **root `CLAUDE.md` loads at launch**. `projects/edu-platform/CLAUDE.md` is *not* loaded up front — it loads **on-demand**, the moment Claude reads or edits a file under `projects/edu-platform/` ("Subdirectory files are included when Claude reads files in those subdirectories" — [memory docs](https://code.claude.com/docs/en/memory)). So giving a task "inside edu-platform" *will* pull in `edu-platform/CLAUDE.md` — but lazily, only once it touches that subtree. ⚠️ This on-demand step has documented real-world reliability complaints, so don't rely on it for must-have rules.
>
> **Launch from `projects/edu-platform/`** (cwd = that dir): loads `edu-platform/CLAUDE.md` **plus every ancestor** — i.e. the root `przeprogramowani-sites/CLAUDE.md` too — **at launch, guaranteed** (not lazy).
>
> **Live proof:** this session's cwd is `…/edu-platform/workbench`, and the loaded context contains the root + `edu-platform/CLAUDE.md` + `workbench/CLAUDE.md` — the full ancestor chain, concatenated. That's the "launch from a subdirectory loads that file plus every ancestor" rule, observable right now.
>
> **Sub-agents wrinkle:** a spawned sub-agent (Task tool) has its own context window and follows the *same* on-demand subtree rule when it reads files — so it's still the lazy path. **Practical rule for the lesson:** if edu-platform's rules are load-bearing, either launch from inside edu-platform, reference them explicitly from the root `CLAUDE.md`, or move them into a Skill (deterministic, not launch-location-dependent).

2. **Governance collapse at scale:** Anthropic explicitly documents that per-directory layering *stops scaling* — "conventions drift, files go stale, and no one owns the root." ([large codebases](https://code.claude.com/docs/en/large-codebases)) The mechanism works; the *maintenance* is what breaks.

**My question**: are there any frameworks/case studies that help to mitigate the maintanance issue? maybe we need a skill that will help with keeping rules and updating them?

> **Answer (part internal, part pending external research):**
>
> **The course already ships two pieces of this maintenance loop** — worth anchoring the lesson to them rather than inventing new ones:
> - **`/10x-rule-review`** — scores an AI rules file (e.g. `AGENTS.md`) on 5 axes, **audit-only / scorecard, doesn't edit**. This is exactly the "is this rule file still good?" gate.
> - **`/10x-lesson`** — appends a recurring rule or pitfall to `context/foundation/lessons.md`, which is then **read as a prior by `frame`/`research`/`plan`/`implement`/`review`**. That's a working "learnings capture" loop: incidents → durable rules → consumed downstream.
> - (Plus m1-l4's own `failure-modes.md` register and the Claude Code `#` memory shortcut.)
>
> So a "skill to keep rules updated" is a sound instinct — and partially **already exists** in the course. **Full verified findings → [`instruction-file-maintenance.md`](./instruction-file-maintenance.md)** (21 sources, 25 claims confirmed). Headlines:
> - **Three vendor-documented anti-staleness mechanisms:** (1) *co-locate* rules with the code they govern (nested files, edited in the same PR); (2) *treat the file like code* — Anthropic's per-line inclusion test, "exclude information that changes frequently," ruthless pruning, periodic audits, empirical behavior testing; (3) *self-updating learnings loops* — Claude Code **auto memory** (default-on), sub-agent persistent memory, and the OSS **`claude-reflect`** (auto-capture corrections → human-approved sync to `CLAUDE.md`/`AGENTS.md`).
> - **A read-only reviewer/auditor sub-agent** is the canonical documented pattern and the closest thing to a "rule-maintenance specialist" — but *no vendor doc* describes one dedicated to instruction-file auditing, so building one is a legitimate **course contribution** (templates: `/10x-rule-review` + `/10x-lesson` + `claude-reflect`'s capture→approve design).
> - **At scale:** **Nx `configure-ai-agents`** generates all instruction files from a single source of truth across 6 tools to kill *cross-tool* drift. (Note: the oft-cited "88 `AGENTS.md` files" is OpenAI's *internal* monorepo, not the public `openai/codex` repo, which has 2 — see [`repo-case-studies.md`](./repo-case-studies.md) for 5 verified real-world repos.)
> - **The honest gap:** **CODEOWNERS ownership + CI review gates for instruction files are NOT vendor-documented** — teach them as team convention, not documented practice. And *no source measured* whether any of this actually reduces drift — existence is documented, effectiveness isn't.

### (c) Hierarchical / layered memory imports (`@path`)

**Strengths:** Organizational clarity — split a monolith file into themed includes.

**Critical downside to teach:** **`@path` imports do NOT reduce token cost.** Imported files are expanded and loaded into context **at launch**, recursively up to four hops. ([memory docs](https://code.claude.com/docs/en/memory)) Students routinely assume imports = lazy loading. They don't. Importing ten module files into the root just rebuilds the fat-root problem with extra steps. Imports are for *human* readability, not context economy.

**My question**: does it always works like this or it depends on the agent harness?

> **Answer (verified): it's harness-specific — teach the principle as universal, the mechanics as Claude-Code-only.**
>
> The exact behavior above (`@path` syntax, **four-hop recursion, expanded at launch, doesn't save tokens**) is a **Claude Code** feature ([memory docs](https://code.claude.com/docs/en/memory)). The other tools do *not* share it:
> - **Codex CLI** — no `@path` import at all; it concatenates `AGENTS.md` files along the root→cwd path and hard-caps the result at **32 KiB (silent truncation)**. See [`codex-cli-agents-md.md`](./codex-cli-agents-md.md).
> - **Cursor** — inclusion via MDC rule files with `globs`/`alwaysApply`/`description` and `@`-mentions; a different model, not recursive markdown imports.
> - **Copilot** — `applyTo` globs on `*.instructions.md`; no recursive `@import`.
>
> **What *is* universal:** any *static include that gets expanded into the prompt* costs its tokens at load time and does **not** lazy-load — bundling files into the always-loaded layer never saves context, in any harness. **What's harness-dependent:** the syntax, the hop limit, whether expansion is eager vs. lazy, and any size cap. The only mechanism that genuinely defers token cost is *tool-driven* retrieval (glob/grep, Skills) — not includes.

*(Caveat: some stale third-party copies cite "five hops" — the current primary source says four.)*

### (d) Per-module PRDs / spec files

**Honest gap:** none of the 25 verified claims gives a decision rule for per-module PRD vs per-module `CLAUDE.md` vs Skill. What the evidence *does* support by extension: a PRD is reference material, and reference material is exactly what should **not** sit in always-loaded instruction files. The principled placement is a **Skill or an on-demand file the agent retrieves when working that module** (see (e)), not an `@import` in the root. Flag this in the lesson as "principled inference, not vendor-documented."

### (e) Dynamic / just-in-time loading (Skills, sub-agents, retrieval)

This is the documented **answer to scaling**, and the most lesson-worthy section.

Anthropic's recommended strategy is **just-in-time / hybrid context**: agents hold lightweight identifiers (paths, queries, links) and load data at runtime via tools, rather than pre-loading. Claude Code is the cited exemplar — "`CLAUDE.md` files are naively dropped into context up front, while `glob` and `grep` retrieve files just-in-time." ([context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))

**Agent Skills make this concrete via three-tier progressive disclosure** ([Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills), [Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)):

| Tier | What loads | Cost | When |
|---|---|---|---|
| **L1** | name + description | ~100 tokens/skill | always, at startup |
| **L2** | full `SKILL.md` | <5k tokens | only when matched |
| **L3+** | bundled resources | effectively unbounded | via bash, as-needed |

The payoff for multi-module systems: **you can install many Skills with no upfront context penalty**, and bundled per-module reference material consumes **zero tokens until read.** That's the only verified mechanism that breaks the "more modules = more always-on context" curve. (Caveat: files the agent *does* read still enter context — JIT defers cost, it doesn't erase it.)

**Strengths:** Scales to arbitrary module count; reference material is unbounded; no attention-budget tax for unused modules.
**Downsides:** Relies on the agent correctly *deciding* to load the right Skill (non-deterministic), and Claude Code's on-demand subtree loading has real-world reliability complaints. More moving parts to author and maintain.

### (f) Splitting context by task vs by module

Cursor operationalizes this split cleanly with four rule types ([Cursor rules](https://cursor.com/docs/rules)):

| Type | Trigger | Split it serves |
|---|---|---|
| **Always Apply** | every session | global / cross-cutting |
| **Apply Intelligently** | agent decides from `description` | **by task** |
| **Apply to Specific Files** | `globs` match | **by module** |
| **Apply Manually** | `@`-mentioned | explicit opt-in |

**Strength:** lets you separate "TypeScript style rules" (by module/glob) from "how we write a migration" (by task/intelligent). **Downside:** the "Apply Intelligently" path depends on the model reading the `description` and choosing correctly — same non-determinism as Skills.

---

## The synthesized recommendation

The tools and Anthropic's own guidance converge on a **hybrid**:

1. **Small, stable root** (`CLAUDE.md`/`AGENTS.md`, <200 lines) — only truly global, cross-module rules.
2. **Per-module instruction files** for conventions, scoped by path — accept that they need *ownership and a staleness process*, because that's the documented failure point.
3. **Move reference material (PRDs, deep specs, runbooks) into Skills or on-demand files** — keep it out of always-loaded context so module count stops driving token cost.
4. **Use glob/grep + retrieval as the navigation layer**, the "most effective agents" pattern: small up-front context + on-demand lookup.

**My question**: so for agents/claude.md we should focus only on conventions, project/modules specifics as it was described in /Users/admin/code/przeprogramowani-sites/projects/edu-platform/workbench/lessons/m1-l4 ? and then create per module /context directories as taught by /10x-workflow? @/Users/admin/code/przeprogramowani-sites/projects/edu-platform/workbench/artifacts/workflow-cheatsheet/workflow-cheatsheet.html

> **Answer: yes — and that split *is* this report's hybrid recommendation, already operationalized by the course. M4L5's job is to extend it from one project to many modules.**
>
> The two layers map cleanly onto what the course already teaches:
>
> | Layer | What it holds | Course mechanism | Report approach |
> |---|---|---|---|
> | **Instruction file** (`AGENTS.md`/`CLAUDE.md`) | *only* conventions + non-obvious project specifics — "what the model can't infer" | **m1-l4** + **`/10x-agents-md`** (generates a *"short, referencing, critical-rules-first"* file) | (a)/(b) done lean |
> | **`context/` directory** (JIT reference) | PRD, tech-stack, plans, research, lessons — read on demand when working a change | **`/10x-workflow`**: `context/foundation/` (`prd.md`, `tech-stack.md`, `lessons.md`) + `context/changes/<id>/` (`plan.md`, `research.md`) | (d) per-module specs + (e) JIT loading |
>
> So the instinct is exactly right: **lean instruction file that *references* → on-demand `context/` docs.** That's the whole thesis of this report, and m1-l4 + `/10x-workflow` already build both halves. The instruction file should *point at* `context/foundation/prd.md` and `context/changes/<id>/plan.md`, not inline them (per (c): inlining via `@import` doesn't save tokens).
>
> **The one genuine design decision M4L5 owns — flag it, don't pretend it's settled.** As taught today, `/10x-workflow` scaffolds **one root `context/` per project** (`/10x-init`). For a *multi-module* system you must choose:
> - **(i) One root `context/` with module-scoped subfolders** — e.g. `context/foundation/<module>/`, `context/changes/<module>-<id>/`. Best when modules are tightly coupled / shipped together; one roadmap, one owner.
> - **(ii) Per-module `context/` directories** (each module gets its own `context/` *and* its own lean `AGENTS.md`) — best when modules are independently owned/deployed (think `projects/edu-platform/` vs `projects/opanuj-frontend/` in *this* monorepo). Mirrors the per-module instruction-file layering, and keeps each module's PRD/plans next to its code so the right `context/` is on the agent's path.
>
> **Recommended decision rule:** split by **deployment + ownership boundary**, not by folder count. Independent deploy/team → per-module `context/` (ii). Shared release train → root `context/` with module subfolders (i). Either way the root `AGENTS.md` stays lean and *references* the right `context/` path; the maintenance loop (`/10x-rule-review`, `/10x-lesson`) runs per-module. **Caveat:** the per-module `context/` layout is a sound extension of the workflow, but it is *not* yet vendor- or course-documented — present it as M4L5's contribution, not as established `/10x-workflow` canon.

One-sentence thesis for slides: *In a multi-module system, the question is never "what should the agent know?" but "what should the agent know **right now**?" — and the winning architectures answer that with layering plus just-in-time loading, not one big file.*

---

## Caveats & gaps — do not teach as settled

- **Codex CLI now verified separately** → [`codex-cli-agents-md.md`](./codex-cli-agents-md.md). Key correction: the original pass-1 `AGENTS.md` behavior was *Copilot CLI's*; Codex's own model is eager root→cwd concatenation with a 32 KiB silent-truncation cap and **no lazy loading** (sharp contrast with Claude Code).
- **No cross-tool `AGENTS.md` standard is verified** — each tool implements its own discovery rules despite the shared filename.
- **Per-module PRD vs per-module instruction file** has no vendor-documented decision rule (open question).
- Copilot's nested precedence is "intended" but has **surface gaps** (CLI historically walked only cwd→git-root; VS Code needed a nested-files setting) and conflict resolution is **explicitly non-deterministic**.
- Context-rot is real but **thresholds are model- and task-specific** — don't quote a hard token number.

---

## Open questions for follow-up

### ⭐ DECISION TO LOCK BEFORE `lesson-spec` — `context/` layout for multi-module repos

This is the core teaching choice M4L5 owns (see the Q4 box above). The `/10x-workflow` as taught scaffolds **one root `context/` per project**; for a multi-module system we must decide how `context/` (and per-module `AGENTS.md`) is laid out. **Marek — answer inline below; your answer reshapes the lesson thesis and may trigger a follow-up research pass before we draft.**

- **Option (i) — One root `context/` with module-scoped subfolders** (`context/foundation/<module>/`, `context/changes/<module>-<id>/`). Single roadmap/owner; best for tightly-coupled, co-released modules.
- **Option (ii) — Per-module `context/` directories** (each module owns its `context/` *and* a lean `AGENTS.md`). Best for independently owned/deployed modules; keeps PRD/plans next to code so the right `context/` is on the agent's path.
- **Option (iii) — Hybrid / something else** (e.g. shared root `context/foundation/` for cross-cutting docs + per-module `context/changes/`).

Sub-questions that depend on this answer:
- Does the lesson teach **one** canonical layout, or a **decision rule** (deployment/ownership boundary) that learners apply to their own repo?
- Is the layout **course-prescribed canon** (we update `/10x-workflow` / `/10x-init` to scaffold it) or presented as **M4L5's proposed extension** (clearly non-canonical)?
- Does `/10x-init` need a multi-module mode, or do learners run it per module?

> **Marcin's answer:**
>
> Hybrid - we have main /context at root - if a module is big enough that requires its own, well-organized module context/ files we use /10x-init there - but we dont force to do this for every module. Do it when fill that not having it becomes problematic (you fill that you lack structure, miss/forget to add important context references into your skills/prompts)

---

1. ~~Exact OpenAI Codex CLI `AGENTS.md` mechanics.~~ ✅ **Resolved** → [`codex-cli-agents-md.md`](./codex-cli-agents-md.md).
2. A decision rule for per-module PRD vs instruction-file vs Skill. *(Partially answered in the Q4 box above; the `context/` mapping is the working rule.)*
Answer: as described above per-module PRD if module requires its own well-organized context otherwise root context/ is enough, for instruction-file similarly we can add AGENTS/CLAUDE.md if module has some special conventions, requirements that are module specific and too detailed to be included in the root AGENTS.md that is already big (above 300 lines)
3. Whether a real cross-tool `AGENTS.md` standard is emerging (Codex, Copilot, Cursor, Amp). *(Codex follow-up found the agents.md v1.1 proposal #135, Jan 2026 — "local extends ancestor" — not yet merged into the spec.)*
Answer: from what I know only Claude Code among popular tools doesnt support AGENTS.md
4. Staleness/governance at scale. ✅ **Resolved** → [`instruction-file-maintenance.md`](./instruction-file-maintenance.md). Residual gap: *measured* effectiveness of these mechanisms is still undocumented (existence yes, outcomes no), and CODEOWNERS/CI-gate governance remains team convention.

---

## Verified sources (primary)

- Claude Code memory — https://code.claude.com/docs/en/memory
- Claude Code large codebases — https://code.claude.com/docs/en/large-codebases
- Anthropic, Effective context engineering — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, Equipping agents with Skills — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Claude Agent Skills overview — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- GitHub Copilot custom instructions (IDE) — https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
- GitHub Copilot CLI custom instructions — https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
- Cursor rules — https://cursor.com/docs/rules
