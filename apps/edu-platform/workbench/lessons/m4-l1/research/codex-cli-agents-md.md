# OpenAI Codex CLI: How `AGENTS.md` Is Discovered, Merged, and Applied

> **Follow-up report for M4L5 · 10xDevs** — closes the Codex CLI gap from `context-engineering-multi-module.md`.
> Produced via deep-research harness: 15 sources fetched, 62 claims extracted, 25 adversarially verified (23 confirmed, **2 refuted** — see end).
> Date: 2026-06-02

## TL;DR

Codex CLI implements `AGENTS.md` as a **concrete, documented algorithm that goes beyond the open `AGENTS.md` spec.** At session start it builds **one instruction chain**: global scope first (`~/.codex`), then it walks **downward** from the project (git) root to your current working directory, taking **at most one file per directory**, and **concatenates them additively** (root-first, leaf-last). Nothing is replaced — files nearer the cwd "win" on conflict only because they appear later in the prompt. The chain is **capped at 32 KiB** by default and **silently truncated** past that. This is materially different from Claude Code's lazy, on-demand subtree loading.

## 1. Discovery & precedence order (verified, primary docs)

Codex builds the chain in this order ([OpenAI Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)):

1. **Global scope** — in the Codex home dir (`~/.codex`, or `CODEX_HOME` if set): reads `AGENTS.override.md` if present, **otherwise** `AGENTS.md`.
2. **Project scope** — starting at the **project root (typically the Git root)**, walks **down** to the cwd. In each directory on that path it checks `AGENTS.override.md` → `AGENTS.md` → `project_doc_fallback_filenames`, taking the **first found**, **at most one file per directory**.
3. If no project root is found, Codex **only checks the current directory**.

> **Root detection vs. file loading are two separate phases.** Codex may walk *up* from the cwd to *find* the git root, but it then loads `AGENTS.md` files walking *down* from that root to the cwd. (One refuted claim wrongly said loading walks upward — it does not.)

## 2. Merge vs. override — Codex MERGES

> **VERBATIM (OpenAI docs):** *"Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt."*

So the **entire chain persists** (global + root + intermediate + cwd). "Precedence" is achieved purely by ordering — the nearer file is read last, so on a direct conflict the model tends to follow it. This is *additive merge with late-override*, **not** whole-chain replacement.

**One real exception:** `AGENTS.override.md` **hard-replaces** the regular `AGENTS.md` *at the same directory level*. That is a true override (regular `AGENTS.md` files only ever merge).

## 3. Context / token behavior

- **Built once, at start.** The chain is assembled **once per run** ("in the TUI, once per launched session"), **rebuilt every run**, **not cached**, and — critically — **not re-read mid-session** (open issue [#8547](https://github.com/openai/codex/issues/8547) requests mid-session reload; today, edits made after launch are ignored until restart).
- **No lazy/on-demand loading.** Unlike Claude Code, Codex does **not** pull in a subtree's `AGENTS.md` when it later edits files there. If a file isn't on the root→cwd path **at launch**, it never loads that session.
- **32 KiB combined cap.** Controlled by `project_doc_max_bytes` (default `32 * 1024 = 32768` bytes). Codex **stops adding files** once the combined size hits the cap, and oversized content is **silently truncated with no TUI warning** (issues [#7138](https://github.com/openai/codex/issues/7138), [#13386](https://github.com/openai/codex/issues/13386)). Source comment: *"Larger files are silently truncated… so we do not take up too much of the context window."*
  - It's a **combined budget across the merged chain** (stops at a file boundary), though a single oversized file is also truncated mid-file. (A refuted claim called it a strict *per-file* cap — it's a combined budget.)
  - **Version-sensitive:** some 2026 writeups note newer builds may default to **64 KiB**; raise explicitly with `project_doc_max_bytes = 65536`. Verify against your installed version's [config reference](https://developers.openai.com/codex/config-reference).

## 4. Filenames & fallbacks / legacy

- **Primary filename:** `AGENTS.md`. `project_doc_fallback_filenames` (e.g. `["TEAM_GUIDE.md", ".agents.md"]`) are tried **only when `AGENTS.md` is absent** in a directory.
- **`model_instructions_file`** can wholesale replace the built-in instructions instead of `AGENTS.md`.
- **Legacy `codex.md` → `AGENTS.md` migration was NOT resolved** by verified claims (config keys like `project_doc_max_bytes` are confirmed; the explicit `codex.md` migration path is an open question). Treat `codex.md` history as unverified.

## 5. Monorepo guidance for Codex specifically

- **Only files on the single root→cwd path load.** Sibling packages (`apps/api/AGENTS.md` while you're in `packages/ui/`) **never load** — by design, so only relevant context enters the prompt.
- **cwd is decisive.** Launch Codex **from the package you're working in** so its `AGENTS.md` is on the path. **Running from the repo root will NOT pick up package-specific rules** (no on-demand fallback to rescue you). This is Codex's analog of Claude Code's launch-location sensitivity — but stricter, because Codex has no lazy loading to compensate.
- **Keep the root `AGENTS.md` lean** — it always loads and eats the shared 32 KiB budget. Push package detail into per-package files; **split across nested dirs to stay under the cap.** OpenAI's *internal* monorepo (per agents.md) ships **88 `AGENTS.md` files** — but the **public** `openai/codex` repo has only 2 (1 fat root + 1 tiny leaf); see [`repo-case-studies.md`](./repo-case-studies.md).

**Strengths:** deterministic (whole chain known at launch, no "did it read it?" ambiguity); only path-relevant context loads; simple mental model.
**Downsides:** cwd footgun (root launch misses package rules); no mid-session reload; silent truncation can drop instructions invisibly; sibling-package context is unreachable without changing cwd.

## 6. Open `AGENTS.md` spec vs. Codex's implementation

Codex is one of **20+ tools** in the open [`agents.md`](https://agents.md/) ecosystem (listed separately from GitHub Copilot's coding agent). The **open spec only says** agents "read the **nearest** file… so the closest one takes precedence" — which is ambiguous between *replace* and *merge-with-priority*. As of issue [#53](https://github.com/agentsmd/agents.md/issues/53) (Sept 2025) the spec had **not** documented whether root + nested files merge or one fully overrides. The v1.1 proposal ([#135](https://github.com/agentsmd/agents.md/issues/135), Jan 2026) adds: *"A local AGENTS.md file extends and builds upon the guidance in ancestor AGENTS.md files rather than replacing it entirely."* — codifying what Codex already does. **Takeaway for the lesson: the shared filename does not guarantee shared semantics; Codex's concatenation is its own resolution of a spec ambiguity, and other tools reading "nearest wins" as full replacement is a real divergence.**

## Claude Code vs. Codex CLI — the sharp contrast (lesson-ready)

| | **Claude Code** | **Codex CLI** |
|---|---|---|
| Nested file loading | **Lazy / on-demand** — loads a subtree `CLAUDE.md` when it reads files there | **Eager at launch only** — builds the whole root→cwd chain at start; **no on-demand** |
| Launch from repo root, then edit a package | Package `CLAUDE.md` **can** load on-demand when files there are read | Package `AGENTS.md` **never loads** that session |
| Merge model | Additive concatenate, root→cwd | Additive concatenate, root→cwd |
| Size discipline | Soft target **<200 lines/file** | Hard **32 KiB combined cap**, silent truncation |
| Mid-session reload | n/a (lazy anyway) | **No** — rebuilt only on restart |
| Hard override file | — | **`AGENTS.override.md`** replaces `AGENTS.md` at same level |

## Refuted claims (corrections worth teaching)

1. ❌ *"Codex walks UP from cwd merging all `AGENTS.md`."* — Wrong. Loading walks **down** from the project root; only root-*detection* walks up.
2. ❌ *"`project_doc_max_bytes` is a per-file cap."* — Wrong. It's a **combined budget** across the merged chain (Codex stops adding at a file boundary).

## Caveats

- `github.com/openai/codex/blob/main/docs/agents_md.md` is now a **stub redirecting** to `developers.openai.com/codex/guides/agents-md` — that's where the quoted text lives.
- The "three-level precedence" phrasing is a secondary-source paraphrase; OpenAI says "Discovery follows this precedence order."
- The legacy `~/.codex/instructions.md` filename (from the original question) is **not** current — global filenames are now `AGENTS.override.md` / `AGENTS.md` in the Codex home dir.
- 32 KiB default is confirmed in source + docs but **may be 64 KiB on newer builds** — version-check.

## Open questions

1. Current default for `project_doc_max_bytes` in the latest release (32 vs 64 KiB)?
2. `codex.md` → `AGENTS.md` migration: was there an automated path; is `codex.md` still a fallback?
3. Has agents.md v1.1 (#135) been merged into the official spec, formally codifying merge-vs-override across conforming tools?

## Sources (primary)

- OpenAI Codex — AGENTS.md guide — https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex — config reference (`project_doc_max_bytes`, fallbacks) — https://developers.openai.com/codex/config-reference
- `agents.md` open spec — https://agents.md/
- agents.md issue #53 (merge-vs-override ambiguity) — https://github.com/agentsmd/agents.md/issues/53
- agents.md issue #135 (v1.1 "extends ancestor files") — https://github.com/agentsmd/agents.md/issues/135
- openai/codex issue #7138 (silent truncation) — https://github.com/openai/codex/issues/7138
- openai/codex issue #8547 (no mid-session reload) — https://github.com/openai/codex/issues/8547
