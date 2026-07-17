# Additional Notes — m5-l5 (Deep Reference Dossier)

> **What this is.** A "dig deeper" companion to the lean `lesson-grounding.md` and `lesson-spec.md`. The grounding brief is deliberately compressed for drafting; this file preserves the full verified detail, exact figures, direct quotes, comparison tables, and the loop-landscape map — so a drafter, video author, or future editor can mine specifics without re-running research.
>
> **Status of facts.** Everything here was either (a) verified 3-0 by adversarial deep research (2026-06-09), or (b) gathered in a focused loop-pattern pass (2026-06-09) and labeled with its source strength. **Nearly every cloud feature is research-preview / plan-gated / fast-moving** — treat figures as "as of mid-2026" and re-verify against live docs before publishing.
>
> **Not a draft.** Editorial reference only. Not learner-facing prose, not platform content. Boundary rules from the spec still apply (don't let this depth leak into re-teaching m2-l5's worktrees/orchestrators/Ralph).
>
> **Not the source of lesson structure.** This dossier is not the source of lesson structure, section order, Core/Deep Dive split, or final narrative choices. Future writers should follow the revised spec in `lesson-spec.md` first, then use this file only to mine details that fit that contract.

---

## 0. The three-architecture mental model (the spine)

The single most useful framing the research produced: "remote/async agent" is not one thing — it is **three architecturally distinct setups**, and most confusion comes from conflating them.

| | **A. Remote-control a LOCAL agent** | **B. Managed cloud sandbox** | **C. Scheduled autonomous loop** |
|---|---|---|---|
| Where compute runs | Your machine (or your VPS) | Vendor-managed VM/container | Vendor-managed cloud session |
| Canonical tools | SSH+tmux/mosh; **Happy** | **Claude Code on the web**; **Codex Cloud**; managed-agents API | **Claude Code routines**; `/loop` |
| You are | Driving, just from elsewhere | Delegating, can close laptop | Not present at all |
| Trust surface | Your box + (Happy: an E2E relay) | The vendor's sandbox + network policy | The vendor + the trigger + the prompt |
| Control point | Real-time, remote | Kick-off + review later | Review after the fact |
| Setup cost | Low–medium | Medium (configure env once) | Medium (configure + trigger) |
| Mobility | High (phone terminal / Happy app) | High (mobile-app monitoring) | N/A (runs itself) |

The lesson's decision table is a compression of this. The durable takeaway that survives tool churn: **pick by where you want compute, whom you must trust, and when control happens.**

---

## 1. Remote control of a LOCAL agent

### 1.1 Happy / Happy Coder — full detail

**What it is.** Open-source (**MIT**, confirmed via GitHub API on `slopus/happy`) mobile + web client for **both Claude Code and Codex**. Repo tagline: *"Mobile and Web client for Codex and Claude Code, with realtime voice, encryption and fully featured."*

**Usage model.** You run `happy` instead of `claude` (or `happy codex` instead of `codex`). From the README:
> "When you want to control your coding agent from your phone, it restarts the session in remote mode. To switch back to your computer, just press any key."

**Critical architecture point (corrects a common misconception).** The agent **runs locally on your machine** — Happy is NOT a cloud agent. From the official docs:
> "This runs on your computer. It starts Claude Code and watches what it does."

The cloud component is **only an end-to-end-encrypted relay**:
> "The server acts like a post office. Both your phone and computer connect out to the server."
> "Your phone and computer are usually on different networks. They can't talk directly."

**Why a relay and not SSH/P2P** (Happy's own justification — useful for the lesson's "vs SSH+tmux" contrast):
> "[with port forwarding] you'd need to set up port forwarding and deal with changing IP addresses... often doesn't work on mobile networks."

Both devices make **outgoing** connections to the relay, which firewalls allow.

**Encryption.** Phone + computer share a secret key via QR code that the relay never sees:
> "Your phone and computer share a secret key through a QR code. The server never sees this key. Before sending any data, your computer encrypts it... The server only sees encrypted blobs."

Third-party coverage (starlog.is) corroborates **AES-256-GCM**. The backend (`slopus/happy-server`, ~1,293 LOC TypeScript) is open source and auditable.

**Repo layout gotcha.** The app is `slopus/happy`; the CLI wrapper is the sibling repo **`slopus/happy-cli`**. Don't cite them as one.

**Team/security stance (editorial).** Because it's a third-party relay, a security-conscious team should evaluate before adoption. The honest pitch: lowest-friction way to control a *local* agent from a phone, compute and code never leave your machine, only encrypted blobs transit a third-party relay. Pair it with the first-party path (Claude Code on the web + mobile-app monitoring) rather than recommending it alone.

### 1.2 SSH + tmux / mosh — the zero-vendor baseline

**Pattern.** SSH or **mosh** into a dev box/VPS, run the agent inside **tmux** (session survives disconnect), reconnect from a phone terminal (Termius, Blink), use **`ntfy`** for push notifications when the agent needs you.

**Sources** (blogs, medium confidence — *no surviving primary-source verification this pass; present as a known practitioner pattern, not a sourced spec*):
- rogs.me — "Claude Code from the beach: my remote coding setup with mosh, tmux and ntfy" (Feb 2026)
- twingate.com — "Claude Code with Termius + tmux"

**Why it earns a slot.** It's the "you already own this, no new vendor, full control" archetype. mosh beats plain SSH on flaky mobile networks (roaming, sleep/wake). tmux is the persistence layer — the same reason it appears in cloud sandboxes' pre-installed tool lists.

**Trade-off to name.** Most setup and self-managed security (the box is yours to harden); no sandbox isolation unless you add it yourself — which is exactly the risk Section 4 addresses.

---

## 2. Cloud sandboxes — the deep configuration payload

This is the lesson's owned deep-dive. Three related-but-distinct products.

### 2.1 Claude Code on the web (Anthropic)

Source: https://code.claude.com/docs/en/claude-code-on-the-web — **research preview**, gated to Pro/Max/Team/eligible Enterprise.

**Execution model.**
> "Each session runs in a fresh Anthropic-managed VM with your repository cloned."
> "Sessions persist even if you close your browser, and you can monitor them from the Claude mobile app."

- `claude --remote` → each command creates its **own** cloud session; multiple run **simultaneously in separate sessions**.
- `--teleport` → interactive session picker to pull a cloud session back to a local interactive one.
- **No separate compute charge** — *"shares rate limits with all other Claude... There is no separate compute charge for the cloud VM."*
- Resource ceilings (**approximate, may change**): **4 vCPUs, 16 GB RAM, 30 GB disk**.

**Pre-installed tools (verbatim from the "Installed tools" section).** Use at *action level* in prose; this full list is for reference:
- **Python:** pip, poetry, uv, black, mypy, pytest, ruff
- **Node:** 20, 21, 22 via nvm — with npm, yarn, pnpm, bun
- **Ruby, PHP, Java** (OpenJDK 21), **Go, Rust, C/C++**
- **Docker**
- **Databases:** PostgreSQL 16, Redis 7.0
- **Utilities:** git, jq, yq, ripgrep, tmux, vim, nano
- **Explicitly NOT pre-installed: the `gh` CLI.** *"The gh CLI is not pre-installed."* → if a workflow needs it, install it in the setup script.

**Network access levels (the "Access levels" table).**
| Level | Behavior |
|---|---|
| **None** | No outbound |
| **Trusted** (default) | Allowlist of package registries, GitHub, cloud SDKs |
| **Full** | Any domain |
| **Custom** | Your own allowlist |

> "All outbound internet traffic passes through this proxy."

**Proxy gotcha:** *"Bun is installed but has known proxy compatibility issues for package fetching."*

**Setup script (the customization mechanism).**
> "A setup script is a Bash script that runs when a new cloud session starts, before Claude Code launches."
> "Scripts run as root on Ubuntu 24.04, so apt install and most language package managers work."
> "Keep the script's total runtime under roughly five minutes."

**Snapshot caching:** output is cached; rebuilt *"when you change the environment's setup script or allowed network hosts, and when the cache reaches its expiry after roughly seven days."*

**MCP carryover — the sharp gotcha.**
| Source | Carries to cloud? |
|---|---|
| Repo's committed `.mcp.json` | ✅ Yes |
| Servers from local `claude mcp add` | ❌ No |

> "Those write to your local user config, not the repo. Declare the server in .mcp.json instead."

This ties directly back to m5-l4 (`.mcp.json` as a distributed, committed artifact) — a clean continuity hook without re-teaching distribution.

### 2.2 Anthropic managed-agents API (the programmatic face)

Source: https://platform.claude.com/docs/en/managed-agents/environments — beta header **`managed-agents-2026-04-01`**. *Keep at references-only depth — m5-l2 owns the SDK story.*

- *"Multiple sessions can share the same environment, but each session gets its own isolated sandbox (a fresh Linux container)."* — *"Sessions do not share file system state."*
- **`packages` field** pre-installs across six managers, *"cached across sessions that share the same environment... they run in alphabetical order (apt, cargo, gem, go, npm, pip)"* with version pinning.
- **Network per environment:**
  - `unrestricted` — *"Full outbound network access, except for a general safety blocklist. This is the default."*
  - `limited` — *"Restricts... to the `allowed_hosts` list"*, with further opt-in via `allow_package_managers` and `allow_mcp_servers` (**both default false**).

### 2.3 OpenAI Codex Cloud

Sources: https://developers.openai.com/codex/cloud/environments , …/internet-access , …/mcp , https://github.com/openai/codex-universal

**Container image.**
> "The Codex agent runs in a default container image called `universal`... see openai/codex-universal for a reference Dockerfile." (Ubuntu 24.04)

Note: the Codex `universal` toolset is its **own** thing — **do not** reuse Anthropic's pre-installed list for Codex.

**Internet access — the headline gotcha.**
> "During the agent phase, internet access is off by default, but you can configure limited or unrestricted access."
> "Setup scripts still run with internet access so you can install dependencies."
> "All outbound internet traffic passes through this proxy."

**Two states, not three** (correction baked into grounding):
- **Off** — *"Completely blocks internet access."*
- **On** — adds a **domain allowlist** (presets: **None / Common-dependencies / All**) + an optional **HTTP-method restriction** limiting requests to **GET, HEAD, OPTIONS**.

(The "three" error came from conflating the two access states with the three allowlist presets.)

**Caching.**
> "Codex caches container state for up to 12 hours... automatically invalidates the cache if you change the setup script, maintenance script, environment variables, or secrets."

**MCP.**
- `codex mcp add <server-name> --env ... -- <stdio server-command>` (docs example uses `@upstash/context7-mcp`)
- `codex mcp login` — OAuth for streamable-HTTP MCP servers.

### 2.4 Side-by-side: Anthropic CC web vs Codex Cloud

| Dimension | Claude Code on the web | Codex Cloud |
|---|---|---|
| Base OS | Ubuntu 24.04 | Ubuntu 24.04 (`universal` image) |
| Network default | **Trusted** (allowlist of registries/GitHub/cloud SDKs) | **Off during agent phase** (on during setup) |
| Network model | 4 levels (None/Trusted/Full/Custom) | 2 states (Off/On) + allowlist presets + method limit |
| Setup network | Runs with network (allowlisted) | Setup scripts keep full internet |
| Cache | ~7-day snapshot | up to 12h; invalidated by script/env/secret change |
| MCP | committed `.mcp.json` only | `codex mcp add` / `codex mcp login` |
| Compute charge | none (shares rate limits) | (per OpenAI plan) |
| `gh` CLI | not pre-installed | verify against `codex-universal` |

The instructive contrast: **Anthropic defaults to a curated allowlist always-on; Codex defaults to internet-off-during-agent**. Same goal (don't let an autonomous agent talk to arbitrary hosts), two different defaults.

---

## 3. The loop landscape (Ralph → productized commands)

The user's original interest. Deep research could **not** verify the X-trending angle (community signal too weak); the focused pass below establishes it from primary/named sources. **Boundary reminder:** m2-l5 already links Ralph and teaches `/goal`. In m5-l5, the *only* new loop material is `/loop` + routines.

### 3.1 Ralph — the origin (Geoffrey Huntley)

Source: https://ghuntley.com/ralph/ (**14 Jul 2025**).

**Definition.** *"Ralph is a technique. In its purest form, Ralph is a Bash loop."*
```bash
while :; do cat PROMPT.md | claude-code ; done
```
> "Ralph works autonomously in a single repository as a single process that performs one task per loop."

Key properties: **fresh context every iteration**; **memory lives on disk / git, not in conversation history**; one task per loop; named after the Simpsons character (persistence despite setbacks).

**Author credibility.** Built **CURSED** (a production esoteric programming language) this way; taught the technique to SF engineers; published a **"$50k contract delivered for $297 USD"** case study.

**Author's OWN caveats (essential if the lesson mentions Ralph at all):**
> "There's no way in heck would I use Ralph in an existing code base."
> "You'll wake up to a broken code base from time to time."
- Requires *"a great deal of faith and a belief in eventual consistency."*
- *"Anyone claiming that engineers are no longer required... is peddling horseshit."*
- Non-deterministic search can cause duplicate implementations.

**Follow-up — "Everything is a Ralph Loop"** (https://ghuntley.com/loop/, **17 Jan 2026**): reframes looping as a *mindset shift* rather than a formal command. *"In practice this means doing the loop manually via prompting or via automation with a pause that involves having to press CTRL+C to progress onto the next task."* Warns about non-deterministic microservices-of-agents: *"a red hot mess."*

### 3.2 snarktank/ralph — the productionized community implementation

Source: https://github.com/snarktank/ralph — **~20.1k stars, 2k forks, 107 watchers, 20 commits** (popularity signal).

> "An autonomous AI agent loop that runs AI coding tools (Amp or Claude Code) repeatedly until all PRD items are complete."

**Loop mechanism (per iteration, fresh instance):**
1. Create a feature branch from PRD
2. Select highest-priority incomplete story (`passes: false`)
3. Implement that single story
4. Run quality checks (typecheck, tests)
5. Commit if checks pass
6. Mark story `passes: true` in `prd.json`
7. Append learnings to `progress.txt`
8. Repeat

**State persistence (the "disk is the context window" idea — ties to prework [3.3] Isolate / external memory):**
- **git history** — commits from previous iterations
- **`progress.txt`** — append-only learnings for future iterations
- **`prd.json`** — tracks which stories have `passes: true`

**Exit / safeguards (what the raw bash loop lacks):**
> "When all stories have `passes: true`, Ralph outputs `<promise>COMPLETE</promise>` and the loop exits." Default **max iterations = 10** (configurable).

Run:
```bash
./scripts/ralph/ralph.sh [max_iterations]
./scripts/ralph/ralph.sh --tool claude [max_iterations]
```

### 3.3 Codex `/goal` — built-in Ralph loop (⚠ m2-l5 already owns `/goal`)

- **Codex CLI 0.128.0 shipped 30 Apr 2026** with a built-in Ralph loop. **Greg Brockman on X:** *"codex now has a built in Ralph loop++."*
- `/goal` automates what teams built manually in bash: model-side completion audit (`continuation.md`), token-budget guardrails, an `update_goal` tool with structured states, and an explicit *"Do not accept proxy signals as completion"* guardrail.

| Aspect | Bash while-loop | `/goal` |
|---|---|---|
| Completion logic | Manual (DONE-file checks) | Model-side audit via `continuation.md` |
| Stop condition | Iteration cap (`MAX_ITERS`) | Token-budget enforcement |
| Evaluator | User script | Built-in `update_goal` tool, structured states |
| False-completion guard | None | *"Do not accept proxy signals as completion"* |

**Confidence: medium** — the primary anchors are the version number, date, and the Brockman quote; the framing came from an SEO blog (ralphable.com). **Re-verify against the OpenAI changelog before publishing.** And remember: **m2-l5 already documents `/goal`** — this is back-pointer material, not new.

### 3.4 Claude Code `/loop` — the ONE loop hook unique to m5-l5

This is the part m2-l5 does **not** cover. Sourced from the installed `/loop` skill behavior + corroborating write-ups (Better Stack, Developers Digest, MindStudio).

- Runs a prompt or slash command **on a recurring interval**: `/loop 5m /foo`.
- **Omit the interval → the model self-paces** (picks a sensible cadence for the task).
- **Loop-aware:** the agent knows it's in a recurring context and can reference prior cycles and adapt.
- Intervals via `--interval` (values like `30s`, `5m`, `1h`; **minimum 1 minute**) or `--cron` (standard five-field).
- **Maximum window ~3 days (72h)**, after which the loop auto-stops.
- Related: `/batch` (parallel agents across isolated worktrees — but that overlaps m2-l5's worktree territory, keep out of scope).

### 3.5 Claude Code routines — the scheduled cloud loop (first-party, verified)

Source: https://code.claude.com/docs/en/routines — **research preview**.

> "Routines execute on Anthropic-managed cloud infrastructure, so they keep working when your laptop is closed."
> "Routines run autonomously as full Claude Code cloud sessions: there is no permission-mode picker and no approval prompts during a run."

**Three trigger types (combinable in one routine):**
- **Scheduled** — recurring cron or one-off future time; **minimum interval 1 hour**.
- **API** — HTTP POST to a per-routine endpoint with a **bearer token**.
- **GitHub** — repository events (PRs, releases).

**Environment:** Default env uses **Trusted** network; other hosts fail with **`403` + `x-deny-reason: host_not_allowed`**. Setup-script result is cached.

**The trust caveat that must survive into the lesson:**
> A **green run status means the session exited without infrastructure error, NOT that the task succeeded.**

### 3.6 Recency — be honest about the timeline

The user recalled "loop commands trending the last week or two on X." The concrete dated events cluster in **spring 2026**, not the week of writing:
- **14 Jul 2025** — Ralph technique (Huntley)
- **17 Jan 2026** — "Everything is a Ralph Loop"
- **30 Apr 2026** — Codex built-in Ralph loop (CLI 0.128.0) + Brockman tweet
- **May 2026** — "/goal /loop /batch — finish work while you sleep" explainers (e.g. Rick Hightower, Towards AI); "Ralph + threads" think-pieces
- **`/loop` + routines** — current first-party productization

**Lesson guidance:** soften to "the loop-command wave of spring 2026" rather than "this week." The pattern is real and productized; the "this week" recency is not supportable.

---

## 4. Security & isolation model (the guardrail spine)

Source: https://www.anthropic.com/engineering/claude-code-sandboxing (blog **2025-10-20**); docs https://code.claude.com/docs/en/sandboxing ; open-source runtime https://github.com/anthropic-experimental/sandbox-runtime (bubblewrap / seatbelt).

**Both isolations are required — the core argument:**
> "Filesystem isolation, which ensures that Claude can only access or modify specific directories... Network isolation... effective sandboxing requires both... Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a compromised agent could easily escape the sandbox."

This is the vivid motivating threat for the whole lesson: **the SSH-key-exfiltration line is why "just `--dangerously-skip-permissions` and walk away on your laptop" is the wrong move** — and why the cloud sandbox's network restriction (which blocked your package install in §2.3) is a *feature*, not an annoyance. Same mechanism, two faces.

**The autonomy link (handle carefully):**
> Sandboxing *"safely reduces permission prompts by 84%."*

**⚠ The 84% is a vendor self-report** with undisclosed methodology (corroborated by InfoQ/TrueFoundry coverage, but those echo the vendor figure). **Attribute it to "Anthropic internal testing"; do not present as independently validated.** The *direction* (isolation → fewer prompts → more autonomy) is the durable point; the exact number is decorative.

**General security gotchas for remote/async/sandboxed agents** (from the secondary security sources — Docker "horror stories", tacticremote, leanopstech; treat as framing, not benchmark facts):
- Secrets in env/setup scripts persist in cached containers — rotate, scope minimally.
- An agent with `Full`/`unrestricted` network is a data-exfiltration path if compromised — default to the narrowest level that lets the task complete.
- Unattended runs amplify blast radius: a bad loop commits many times before you look.

---

## 5. Cost considerations

Lighter evidence (mostly secondary), so frame as practitioner guidance, not sourced figures:
- **Claude Code on the web:** *no separate compute charge* — it consumes your normal account rate limits. The cost is *attention/limits*, not a VM bill.
- **Loops are the real cost risk.** A naive `while`-loop or a self-pacing `/loop` can burn tokens fast — especially when it loops on a failing step (e.g. a package install blocked by network policy). This is the cost+failure interaction worth dramatizing: *the agent didn't break anything, it just spent your budget retrying a network call that was never going to succeed.*
- **Guardrails that double as cost control:** iteration caps (snarktank's default 10), token-budget enforcement (`/goal`), the 72h `/loop` ceiling, the 1h routine minimum.
- leanopstech (2026) "agentic AI cost runaway / token budget" — useful for the *language* of runaway cost; not a source for specific numbers.

---

## 6. Refuted / do-not-claim

- **No native Anthropic "Remote Control" mobile mode.** A widely-circulated VentureBeat report (Feb 24 2026: "Anthropic just released a mobile version of Claude Code called Remote", Max-only research preview) **did NOT survive verification (vote 1-2)**. Do **not** cite a first-party "Remote Control" feature. The verified mobile-control paths are: **Happy** (third-party, local agent) and **Claude Code on the web + Claude mobile app monitoring** (cloud agent). Re-check at publish time in case the landscape changes.
- **"Codex internet has three states"** — wrong; **two** (Off/On). See §2.3.
- **"Loops are trending this week"** — see §3.6; spring-2026 events, soften.
- **"84% prompt reduction (validated)"** — vendor self-report; attribute, don't validate.

---

## 7. Open verification questions (for the pre-draft re-check)

1. **GA vs preview + plan tiers at publish date** — the single most time-sensitive fact for learners. Re-check Claude Code on the web, routines, managed-agents API, Codex Cloud.
2. **Native Anthropic mobile remote-control** — refuted now; confirm nothing first-party shipped by publish date.
3. **Codex `/goal` built-in-loop specifics** — verify version/behavior against the official OpenAI changelog (currently SEO-blog + Brockman quote).
4. **itnext Ralph critique** — re-fetch (TLS cert error during grounding) before quoting the "innovative but I wouldn't use it for anything that matters" line directly.
5. **SSH+tmux/mosh path** — present as a known practitioner pattern; it lacks a surviving primary-source claim this pass.

---

## 8. Source ledger (with quality + angle)

**Primary (official docs / first-party repos):**
- https://github.com/slopus/happy · https://happy.engineering/docs/how-it-works/ · https://github.com/slopus/happy-server · https://github.com/slopus/happy-cli — Happy
- https://code.claude.com/docs/en/claude-code-on-the-web — CC web sandbox
- https://platform.claude.com/docs/en/managed-agents/environments — managed-agents API
- https://developers.openai.com/codex/cloud/environments · …/internet-access · …/mcp · https://github.com/openai/codex-universal — Codex Cloud
- https://www.anthropic.com/engineering/claude-code-sandboxing · https://code.claude.com/docs/en/sandboxing · https://github.com/anthropic-experimental/sandbox-runtime — security model
- https://code.claude.com/docs/en/routines — routines
- https://ghuntley.com/ralph/ · https://ghuntley.com/loop/ — Ralph (named author, technical-post)
- https://github.com/snarktank/ralph — productionized loop (repo, ~20.1k★)

**Secondary / blog (framing & practitioner signal — weak for facts):**
- https://venturebeat.com/orchestration/anthropic-just-released-a-mobile-version-of-claude-code-called-remote — **REFUTED claim source**
- https://rogs.me/2026/02/claude-code-from-the-beach-... · https://www.twingate.com/blog/claude-code-termius-tmux — SSH+tmux/mosh
- https://www.decodingai.com/p/ralph-loops · https://itnext.io/ralph-loop-is-innovative-... — Ralph critique/practitioner signal
- https://ralphable.com/blog/codex-goal-command-... — Codex `/goal` framing (SEO; anchor on the verifiable bits only)
- https://addyosmani.com/blog/coding-agents-manager/ · https://securityboulevard.com/2026/06/6-background-ai-agents-for-async-development/ — async/background framing
- https://www.docker.com/blog/ai-coding-agent-horror-stories-security-risks/ · https://leanopstech.com/blog/agentic-ai-cost-runaway-token-budget-2026/ · https://tacticremote.com/blog/2026-02-28-security-best-practices-remote-ai-coding/ — security/cost framing

**Research provenance:** deep-research run 2026-06-09 (5 angles, 25 sources fetched, 123 claims extracted, 25 verified, 24 confirmed / 1 killed, 107 agents) + focused loop pass 2026-06-09. The 9 strongest sources are recorded in `lessons-schema.json` → m5-l5 `groundingSources`.
