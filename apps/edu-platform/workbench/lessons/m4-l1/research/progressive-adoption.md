# Progressive Adoption: What Do I Actually Do — in Course vs at Work

> **Synthesis report for M4L5 · 10xDevs** — turns the research into a staged playbook for two audiences: building a small certification MVP, and applying this in bigger repos at work.
> Grounds: [`context-engineering-multi-module.md`](./context-engineering-multi-module.md), [`repo-case-studies.md`](./repo-case-studies.md), [`instruction-file-maintenance.md`](./instruction-file-maintenance.md), [`codex-cli-agents-md.md`](./codex-cli-agents-md.md), m1-l4, `/10x-workflow`. Date: 2026-06-02.
> Note: a follow-up specifically hunting *measured* ROI/threshold evidence was attempted but returned nothing usable (and prior research already concluded effectiveness is **undocumented**). The tiers and triggers below are therefore grounded heuristics — drawn from vendor targets + the [repo case studies](./repo-case-studies.md) — not benchmarks. Treat thresholds as judgment calls.

## The one principle that prevents over-engineering

**Context engineering is a cost you pay to fix a problem you can observe — never a structure you build in advance.** Every tier below is justified only by a *trigger signal*. If you can't name the problem a layer solves, you don't need that layer yet.

This isn't our opinion — it's the convergent message of every primary source:
- **Anthropic:** "Ruthlessly prune. If Claude already does something correctly without the instruction, delete it." Target **<200 lines**. ([best practices](https://www.anthropic.com/engineering/claude-code-best-practices))
- **OpenAI (Harness engineering):** start with "a small, stable entry point" and use **progressive disclosure** — "agents are taught where to look next," not everything up front.
- **m1-l4 thesis:** put in the file only what the model **can't infer**; a file padded with docs/generic patterns *raises cost ~20% and worsens results* (arXiv 2602.11988).

> **Corollary for small apps:** a 1–2 module MVP gets **most of its value from a single lean instruction file + an inner loop**, and **little-to-nothing** from nesting, routers, or a big `context/` tree. Adding them early is pure overhead.

---

## The maturity ladder (climb only on a signal)

| Tier | What you set up | Trigger to climb to next tier |
|---|---|---|
| **0 · Nothing** | Default agent, no project context | Agent breaks the same convention twice, or wastes a session exploring |
| **1 · Lean root** | One `AGENTS.md`/`CLAUDE.md` (conventions the model *can't infer*) + an **inner loop** (formatter/test hook) | You keep re-explaining "what/why we build", or re-pasting plans |
| **2 · Root `context/`** | `/10x-init` → `context/foundation/` (PRD, tech-stack, lessons) + `context/changes/<id>/` (plans). Root file stays lean and **references** these | A *specific module* needs rules/specs too detailed for the (now ~200–300-line) root |
| **3 · Per-module escalation** | The hot module gets its **own lean `AGENTS.md`** (its special conventions) and/or its **own `context/`** (`/10x-init` inside it). Root adds a **child index** (cloudflare model) | Many modules, multiple teams/tools, or one task routinely needs several module guides |
| **4 · Governance at scale** | Task router (open-mercato), glob-scoped `.cursor/rules` (twenty), CODEOWNERS + CI gate, single-source generation (Nx), self-maintenance loop (`/10x-rule-review` + `/10x-lesson`) | — (this is the ceiling) |

**The trigger signals between tiers (observable, from the repo case studies + your hybrid rule):**
- root file **crosses ~200–300 lines** (codex root 286, open-mercato 404 — both the point where you split or escalate),
- a module has its **own deploy target / owner / PRD** (independent lifecycle),
- the agent **repeatedly misses the same module-specific context**,
- the module **accumulates its own stream of changes**,
- you run **more than one tool** (→ standardize on `AGENTS.md` + a Claude bridge, or generate from one source).

---

## TRACK A — COURSE: your certification MVP (1–2 modules)

**You live at Tier 1, optionally Tier 2. Do NOT go past it — per-module splitting on a 1-module app is an anti-pattern that just burns context.**

### What you have to DO (the whole list)

1. **Write ONE lean `AGENTS.md` (or `CLAUDE.md`).** Use the m1-l4 inclusion test on every line: *"could the agent know this without the file?"* If yes, cut it. Keep only:
   - exact build/test/run commands,
   - **non-obvious** conventions, corner cases, forbidden patterns (your error-response shape, file-naming, import alias, date handling),
   - tech-stack specifics the model would otherwise guess wrong.
   Use `/10x-agents-md` to generate the lean first draft, then `/10x-rule-review` to score it. Target well under 200 lines.
2. **Set up an inner loop** — a formatter + a hook (or a simple test command) the agent runs after edits, so reality (lint/tests) corrects it without you nagging. (m1-l4)
3. **(Optional, recommended) `/10x-init` a single root `context/`.** Put your **PRD in `context/foundation/`** and each change's **plan in `context/changes/<id>/`**. Reference them from `AGENTS.md`; don't inline them. This is the JIT system-of-record — and it's what graders/reviewers and future-you read.
4. **Capture pitfalls as you go** with `/10x-lesson` → `context/foundation/lessons.md`, and keep a `failure-modes.md`. That's your whole "maintenance loop" at this scale.

### What you must NOT do (certification anti-patterns)
- ❌ One `AGENTS.md` per folder in a 1–2 module app — no payoff, pure overhead.
- ❌ A task router or glob-scoped rule matrix (open-mercato/twenty scale) — wildly premature.
- ❌ An "encyclopedia" `AGENTS.md` stuffed with architecture prose and generic best-practices — *measurably worse* (arXiv 2602.11988).
- ❌ Inlining the PRD into `AGENTS.md` via `@import` thinking it "saves context" — it doesn't ([main report (c)](./context-engineering-multi-module.md)).

> **Bottom line for the MVP:** a lean `AGENTS.md` + inner loop + a root `context/` with your PRD and plans is the **complete, certification-grade setup**. If you only do step 1+2, you're already 80% of the way there. Climbing higher won't improve a small app — it'll slow you down.

---

## TRACK B — WORK: bigger repos (many modules / teams / tools)

**You start at Tier 2 and escalate per-module on the trigger signals — you do NOT build Tier 4 up front either.**

### What you have to DO (staged)

1. **Start exactly like Track A** — lean root `AGENTS.md` + root `context/` + inner loop. Even a 50-module monorepo begins here. (OpenAI's own public codex repo is *one* structured root + *one* leaf.)
2. **Escalate a module to its own lean `AGENTS.md` only when it trips a signal** (own deploy/owner, root bloating past ~200–300 lines, agent missing its context). Write the leaf to **assume the root** and add only its specifics — open it with the cloudflare contract line: *"X-specific context only; see root `AGENTS.md` for shared conventions."*
3. **Add a child index to the root** once you have ≥3 nested files (cloudflare model): a short list of "packages with their own `AGENTS.md`, and what each covers." Keeps the set discoverable.
4. **Give a hot module its own `context/`** (`/10x-init` inside it) when it needs its own PRD/plans/research — your hybrid rule. Otherwise the root `context/` is enough.
5. **Reach for Tier-4 tools only when their specific problem appears:**
   - one task routinely needs several module guides → **task router** (open-mercato),
   - cross-cutting *topic* rules (testing, security, migrations) that don't belong to one module → **glob-scoped `.cursor/rules`** (twenty),
   - **multiple AI tools** in the team → standardize on `AGENTS.md` + Claude bridge, or **generate from one source** (Nx `configure-ai-agents`) to kill cross-tool drift,
   - drift/ownership pain → **CODEOWNERS on instruction files + a CI gate**, and a self-maintenance loop (`/10x-rule-review` periodic audit + `/10x-lesson` capture; cf. twenty's `feedback-incorporation.mdc`).
6. **Mind the tool's loading model** ([codex-cli report](./codex-cli-agents-md.md)): Codex eagerly concatenates root→cwd with a **32 KiB cap (silent truncation)** and **no lazy loading** — keep each file small and launch from the working package; Claude Code lazily loads subtree files and walks to the filesystem root (use `claudeMdExcludes` in big monorepos).

### What you must NOT do
- ❌ Pre-build per-crate files "for consistency" (codex has 121 crates, 1 leaf).
- ❌ Let the root grow into an encyclopedia — that's OpenAI's four failure modes (crowds out the task, dilutes guidance, rots, resists verification).
- ❌ Assume nested-file semantics are identical across tools — they merge additively but cap/precedence/lazy-loading differ.

---

## TRACK C — WORK: multiple separate repos (polyrepo)

**This is the hardest case and the most common at companies — and it breaks the whole ladder above, because nesting and `context/` stop at the repo boundary.** Full analysis: [`multi-repo-context.md`](./multi-repo-context.md).

The mindset shift: in polyrepo you can't nest your way to shared context. You work in **three layers** instead:

1. **Universal rules → org/user/machine level** (not per-repo): Claude Code managed-policy `CLAUDE.md` + `~/.claude/`, Codex `~/.codex/`, Copilot org instructions. Use for stable company-wide rules only.
2. **Per-repo shared context → distribute from one source** (the N-way drift problem): a shared package, a generator (Ruler/Nx), or **a CLI that installs shared skills/rules into each repo** — the `@przeprogramowani/10x-cli` model.
3. **Cross-repo visibility → `--add-dir` / multi-root / MCP**: bring a sibling repo into the session, or expose its contracts/APIs as an MCP server so every repo's agent can query them.

### What you have to DO (awareness-level for M4L5)
- Put **only universal** conventions at org/user level; keep project specifics in each repo's lean `AGENTS.md`.
- For a coordinated change across two repos, use **`--add-dir`** (load the sibling repo + its rules) or a **multi-root workspace**.
- Expose **shared contracts/design-system/APIs via MCP** so agents stop guessing at the other repo.

> 🚩 **Building the team distribution infrastructure — a shared registry of skills, commands and rules, delivered to every repo via an internal library package or a CLI like `10x-cli` — is NOT done here. That is the subject of [M5L3 — "Shared AI Registry: skills, commands and rules for the team"].** And it is **required only for companies whose teams work across several repositories** — if you're building a single-repo MVP (Track A) or work in one monorepo (Track B), you don't need it. M4L5 only makes you *aware* of the polyrepo problem and points you to M5L3 for the build-out.

## Course ↔ Work: the same ladder, different stopping point

The skill you actually teach is **not "build the big structure"** — it's **"recognize which rung you're on and what signal moves you up."** The MVP-builder and the staff engineer use the *same* lean-root-first method; they just stop at different tiers. That makes the lesson land for both: nobody wastes effort on structure they don't need, and everybody knows the upgrade path when their repo grows.

| | **Course MVP** | **Work monorepo** |
|---|---|---|
| Start | Lean `AGENTS.md` + inner loop | Same |
| Reference layer | Root `context/` (PRD + plans) | Root `context/`, then per-module on signal |
| Per-module files | **No** (anti-pattern at this size) | **Yes, on trigger** + child index |
| Governance | `/10x-lesson` + `failure-modes.md` | + CODEOWNERS, CI gate, single-source gen, self-maintenance loop |
| Ceiling | Tier 2 | Tier 4 |
| Driving question | "What can't the agent infer?" | "What signal says I must climb?" |

## Honesty / caveats (do not teach as settled)
- **The exact thresholds are judgment calls, not measured.** Our research found mechanisms documented but **effectiveness/ROI unmeasured** ([maintenance report](./instruction-file-maintenance.md)). The "~200–300 line" and "own deploy/owner" triggers are heuristics drawn from the repo case studies + vendor targets, not benchmarks.
- The arXiv efficiency figures (−28% time, +20% cost) are **Codex-specific, small-PR** results — directional, not universal.
- The follow-up research (running) may add practitioner staged-adoption playbooks and any measured "when it pays off" evidence — this section will be updated.
