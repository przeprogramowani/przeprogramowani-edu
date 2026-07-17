# Real-World Repos: How They Actually Structure Agent Instructions

> **Case-study report for M4L5 · 10xDevs** — direct analysis of 5 reputable repositories, cloned at HEAD and inspected on disk (not web search).
> Date: 2026-06-02. Each repo cloned `--depth 1`; counts via `find -iname AGENTS.md` on the working tree (authoritative).

## Method note — why we cloned, and the "count" trap

GitHub **code-search counts are unreliable** for this question. Searching `filename:AGENTS.md` returned "31" for `twentyhq/twenty`, "6" for `vercel/ai`, "3" for `continue` — but cloning shows **1, 2, and 1** respectively. (Twenty's "31" were translated `*.mdx` **product docs** about its AI-agents feature, not instruction files.) **Lesson for learners:** count instruction files by cloning and `find`-ing, never by trusting search. Every number below is from the checked-out tree.

## The five repos at a glance

| Repo | Stars | `AGENTS.md` count | Root size | Leaf size range | Strategy |
|---|--:|--:|--:|--:|---|
| **openai/codex** | 87.9k | **2** | 286 L / 20 KB | 12 L | Minimal nesting (fat root + 1 hyper-local leaf) |
| **mastra-ai/mastra** | 24.7k | **16** | 47 L / 2 KB | 7–30 L | Lean nested, **implicit** (tool-driven) |
| **cloudflare/workers-sdk** | 4.1k* | **8** | 245 L / 15 KB | 31–91 L | Lean nested, **explicit child index** ⭐ model |
| **open-mercato/open-mercato** | 1.4k | **32** | 404 L / 40 KB | 39–1699 L | Heavy nested, **task router** |
| **twentyhq/twenty** | 48.9k | 1 (n/a) | `CLAUDE.md` 224 L | `.mdc` 30–326 L | **Different axis:** glob-scoped `.cursor/rules/*.mdc` + skills |

*Cloudflare/workers-sdk is the official Wrangler/Workers monorepo — infrastructure-grade despite a lower star count.

There is **no single "right" count.** The same task (give agents project context) is solved with 1, 2, 8, 16, or 32 files depending on repo size, team structure, and how "AI-native" the project is. What matters is the *strategy*, below.

---

## The spectrum of strategies (this is the lesson's spine)

### 1. Minimal nesting — `openai/codex` (2 files)

One **comprehensive, well-structured root** (286 L: Rust conventions, `codex-core`, Code Review Rules, TUI style, Tests, App-server API, Python) + **exactly one tiny leaf** (`codex-rs/tui/src/bottom_pane/AGENTS.md`, 12 L) created only where omitting it would cause **doc↔code drift** in tricky state machines.

- **Takeaway:** a single-product repo can run a fat *structured* root and add a leaf **only when a specific local hazard demands it** — not one-per-crate. The leaf adds a narrow concern and assumes the root.
- **`AGENTS.override.md` is gitignored** → the override file is a personal/local mechanism, never committed.
- **Myth-bust:** the widely-cited "OpenAI repo has 88 AGENTS.md files" is OpenAI's **internal** monorepo (per agents.md), **not** this public repo (which has 2). Don't cite "88" as observable. *Independently confirmed:* the GitHub Git-Trees API (recursive, 5,473 entries) returns exactly 2 `AGENTS.md`; `codex-rs/` has **96 subdirectories and 121 `Cargo.toml` manifests but only 1 nested `AGENTS.md`** — conclusive proof that **per-crate co-location is NOT the convention**. The one leaf sits *two levels below* its crate root, placed exactly where its rule applies.

#### OpenAI's *stated* philosophy (Harness engineering) — and a say-do nuance

A first-party OpenAI post, ["Harness engineering"](https://openai.com/index/harness-engineering/) (R. Lopopolo, Feb 2026), articulates the design principle behind lean instruction files — and it's the strongest on-thesis primary source we have:

> *"We tried the one big AGENTS.md approach. It failed in predictable ways… instead of treating AGENTS.md as the **encyclopedia**, we treat it as the **table of contents**. The repository's knowledge base lives in a structured `docs/` directory treated as the **system of record**. A short AGENTS.md (roughly **100 lines**) is injected into context and serves primarily as a **map**, with pointers to deeper sources of truth elsewhere. This enables **progressive disclosure**: agents start with a small, stable entry point and are taught where to look next."*

This is **exactly your hybrid decision** in OpenAI's words: *lean AGENTS.md (a map) → `docs/`/`context/` as the JIT system of record.* They name a layout (`ARCHITECTURE.md`, `docs/design-docs/`, `docs/exec-plans/`, `docs/references/*-llms.txt`) that maps onto our `context/foundation` + `context/changes`.

OpenAI also names **four failure modes of a monolithic instruction file** (verbatim — ideal for the lesson's "why" section):
1. **Crowds out the task** — "Context is a scarce resource. A giant instruction file crowds out the task."
2. **Dilutes guidance** — "When everything is important, nothing is."
3. **Rots instantly** — "A monolithic manual turns into a graveyard of stale rules."
4. **Resists verification** — "A single blob doesn't lend itself to mechanical checks (coverage, freshness, ownership, cross-links), so drift is inevitable."

> **Two honest caveats to teach alongside this:** (a) the Harness-engineering layout describes a *separate internal Codex-built product*, **not** the public `openai/codex` repo. (b) There's a **say-do gap**: the public repo's root `AGENTS.md` is a **286-line / 20 KB file scoped to the Rust subtree** (titled `# Rust/codex-rs`), *not* the ~100-line lean map the philosophy prescribes. So OpenAI's *principle* (lean map → docs system-of-record) and their *public repo's practice* (one fat structured root) differ — a useful real-world reminder that even the source defining the format hasn't fully migrated.

### 2. Lean nested, implicit — `mastra-ai/mastra` (16 files)

A **tiny 47-line root** whose key instruction is a one-liner: *"Prefer most specific AGENTS.md for changed area / For work in packages read package local `packages/<name>/AGENTS.md` first."* Leaves are **7–30 lines of almost pure operational commands** (build/test/typecheck for *this* package) plus a surgical warning (`packages/core`: "Keep changes here surgical; many packages depend on core").

- **No index, no router** — it relies entirely on the tool's nearest-file loading. Minimal authoring + maintenance.
- Also references skills/commands via `@.claude/commands/` and `@.claude/skills/` → multi-mechanism, lean core.
- **Takeaway:** if your leaves are mostly "how do I build/test this package," tiny per-package files + a one-line root pointer is enough.

### 3. Lean nested, explicit index — `cloudflare/workers-sdk` (8 files) ⭐ the copyable model

A **245-line root** that ends with an explicit **child index**:

> *"Packages with their own AGENTS.md for deeper context:*
> *- `packages/wrangler/AGENTS.md` — CLI architecture, command structure, test patterns*
> *- `packages/miniflare/AGENTS.md` — Worker simulation…"*

And every leaf opens with the **inheritance contract**:

> *"Wrangler-specific context only. **See root `AGENTS.md` for monorepo conventions.**"*

Leaf content (31–91 L) = package structure, **entry-point gotchas** ("Entry point is `src/cli.ts` NOT `src/index.ts`"), package-specific bans ("No `console.*` — use `logger`"; "No global `fetch` — use undici"), test-infra specifics, and an **Anti-Patterns** section.

- **Takeaway:** this is the cleanest, most teachable pattern — *lean root + self-documenting child index + small per-package leaf that explicitly says "I assume the root, I only add my specifics."* It directly embodies our report's teaching point ("module files should assume the root is present and not repeat it").

### 4. Heavy nested, task router — `open-mercato/open-mercato` (32 files)

The most sophisticated — and the repo is literally marketed as *"built with AI and designed for AI."* The 404-line root has `Always` / `Ask First` / `Never` operating rules, `Validation Commands`, and a **Task Router table** that maps a task → the exact nested file (and subsection) to read:

> *"Before any research or coding, match the task to the Task Router table. A single task often maps to multiple rows… Read all matching guides before starting."*
> e.g. `Adding bulk operations… → packages/core/src/modules/progress/AGENTS.md + packages/ui/AGENTS.md → DataTable Guidelines + packages/queue/AGENTS.md`

Leaves are **full module specs** (`packages/core` 644 L, `packages/search` 728 L, `packages/ai-assistant` **1699 L / 93 KB**, per-module files under `packages/core/src/modules/*`).

- **Takeaway:** treats AGENTS.md as a **routed knowledge base** — maximum power, maximum maintenance. Justified when the framework's *entire value prop* is "conventions already decided for agents." **Warning:** the 1699-line leaf would blow Codex's 32 KB cap (93 KB) — this layout assumes tools (Cursor/Claude) that load nearest-file lazily, not Codex's eager-concat-with-cap.

### Different axis — `twentyhq/twenty`: glob-scoped topic rules, not module files

Twenty (48.9k★) barely uses `AGENTS.md` — instead it demonstrates the **task/topic-scoped** approach with **`.cursor/rules/*.mdc` (16 files)** + a root **`CLAUDE.md` (224 L)** + **`.cursor/skills/`**. This is our report's approach (f) and Cursor's four rule types **in the wild**:

| Frontmatter | Behavior | Twenty examples |
|---|---|---|
| `alwaysApply: true`, `globs: []` | always loaded | `architecture`, `code-style`, `file-structure`, `nx-rules` |
| `alwaysApply: false`, `globs: [...]` | **path-triggered** | `creating-syncable-entity` → `**/metadata-modules/**`; `server-migrations` → `**/*.entity.ts`; `github-actions-security` → `**/.github/**`; `sdk-esm-dependencies` → `packages/twenty-sdk/**` |
| `alwaysApply: false`, no globs | agent-requested by `description` | `react-general-guidelines`, `react-state-management` |

Two standouts for our lesson:
- **`.cursor/skills/syncable-entity-*` (6 skills)** — one complex domain decomposed into builder/cache/integration/runner/testing/types skills (skills-as-decomposition).
- **`feedback-incorporation.mdc`** — a committed **self-maintenance meta-rule**: *"After each coding session… identify patterns in user corrections… suggest cursor rule updates… 'Would you like me to help incorporate these into your cursor rules?'"* This is the **learnings-loop / self-updating-rules pattern from [`instruction-file-maintenance.md`](./instruction-file-maintenance.md) — implemented in a real 49k-star repo.**
- **Key contrast:** instead of "rule lives in the module folder" (nested AGENTS.md), twenty does "rule lives centrally in `.cursor/rules/` but is **glob-scoped to fire only when matching files are touched**." Same goal (right context at the right time), opposite mechanism.

---

## What's *inside* these files — strong validation of m1-l4

Across all five, the content is overwhelmingly **"what the model can't infer"** — almost zero generic "write clean code" filler:

- **codex:** "Never modify `CODEX_SANDBOX_*` code"; "resist adding to `codex-core`"; "use `just test`, not `cargo test`"; sandbox-specific test early-exits.
- **mastra:** "Building whole monorepo is slow — last resort"; "some integration tests need `pnpm i --ignore-workspace`"; exact `pnpm --filter` commands.
- **cloudflare:** "Entry point is `src/cli.ts` NOT `src/index.ts`"; "wrangler's `vitest.config.mts` does NOT use `mergeConfig`… defaults are not inherited"; "Never import `expect` from vitest."
- **open-mercato:** "Never expose cross-tenant data"; "Never create direct ORM relationships between modules"; "Never edit generated files."
- **twenty:** "We don't use `useEffect`, handle state in event callbacks"; "named exports only."

**This is the m1-l4 thesis proven in production:** instruction files earn their tokens with non-obvious, project-specific rules, corner cases, and gotchas — not documentation the model already knows.

## Three connection/wiring models (pick one deliberately)

1. **Implicit (mastra, codex):** no index; rely on the tool's nearest-file loading + a one-line root pointer. Lowest maintenance; weakest discoverability for humans.
2. **Explicit child index (cloudflare):** lean root lists its children + one-line descriptions; leaves declare "see root." Self-documenting; small upkeep (keep the index honest).
3. **Task router (open-mercato):** root maps task → file(+section), supports multi-file fan-out per task. Most powerful for big AI-native repos; highest upkeep (the table itself drifts).

None of them duplicate the root in leaves — **every model treats leaves as additive**, matching how all four tools actually load files (see main report).

---

## Mapping to your hybrid decision (the ⭐ open question)

Your rule — *"root `context/` + `AGENTS.md` by default; escalate a module to its own only when not having it becomes problematic"* — is **exactly the spectrum these repos occupy**, and they sharpen your trigger into observable signals:

| Your situation | Repo precedent | Signal to escalate |
|---|---|---|
| Small/medium, one team | codex, mastra | Stay lean; add a leaf only for a **specific local hazard** (codex) or **package build/test commands** (mastra) |
| Several owned packages | cloudflare | Root crosses ~200 L → split per-package + add a **child index**; leaf opens with "see root" |
| AI-native, conventions are the product | open-mercato | Heavy per-module specs + **task router**; accept the maintenance cost |
| Topic rules cross-cut modules | twenty | Use **glob-scoped `.cursor/rules`** instead of nesting — co-locate by *topic*, not directory |

Concrete escalation triggers (for the spec): **root > ~200–300 lines** (codex 286, open-mercato 404 both split or escalated), **module has its own deploy/owner/PRD**, **agent repeatedly misses the same module context**, or **the module accumulates its own change stream**. Your ">300-line root" instinct matches the data exactly.

## What to copy into the 10xDevs workflow

1. **Default to cloudflare's model** — lean root + child index + small "see root" leaves. Most teachable, lowest-risk.
2. **Keep leaves additive** — open with "X-specific context only; see root for shared conventions."
3. **Escalate to open-mercato's router** only when one task routinely needs several module guides.
4. **Use twenty's glob-scoped `.cursor/rules`** for cross-cutting *topic* rules (testing, security, migrations) that don't belong to one module.
5. **Adopt twenty's `feedback-incorporation` meta-rule** as the seed of a `/10x-rule-review`-adjacent self-maintenance loop.
6. **Watch the byte cap** — open-mercato's 93 KB leaf is fine for Cursor/Claude (lazy, per-file) but would be silently truncated by Codex (32 KB combined). Layout choice and tool choice are coupled.

## Caveats

- **Single snapshot** (HEAD on 2026-06-02). These repos are fast-moving; counts will drift.
- **"88 files" is not the public codex repo** — it's OpenAI's internal monorepo, unverifiable here. Cite codex's real numbers (2 files) instead.
- **Code-search counts are unreliable** (the twenty "31" mirage) — clone to count.
- **Stars ≠ instruction-file quality.** Cloudflare (4.1k) has a better-structured setup than several higher-star repos with a single fat root.
- Effectiveness is **not** measured here — we observed *structure*, not whether these layouts demonstrably improve agent output.

## Sources (cloned at HEAD, 2026-06-02)

- `openai/codex` @ `3f1fb7e` — 2 `AGENTS.md`
- `mastra-ai/mastra` @ `07c1d42` — 16 `AGENTS.md`
- `cloudflare/workers-sdk` @ `94b29f7` — 8 `AGENTS.md`
- `open-mercato/open-mercato` @ `344ae76` — 32 `AGENTS.md`
- `twentyhq/twenty` @ `6a908b78` — 16 `.cursor/rules/*.mdc` + `CLAUDE.md` + 6 `.cursor/skills`
- Context: [agents.md](https://agents.md/) ("88 files" = OpenAI internal monorepo), [Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- OpenAI, ["Harness engineering"](https://openai.com/index/harness-engineering/) (Feb 2026) — AGENTS.md as ~100-line table-of-contents → `docs/` system of record; four failure modes of monolithic instruction files. *(Independently corroborated the 2-file finding via GitHub Git-Trees API, 5,473 entries.)*
