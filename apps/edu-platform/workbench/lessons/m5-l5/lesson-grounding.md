# Lesson Grounding: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym

## Scope

- Lesson source: revised `lesson-spec.md` is now the editorial contract; this grounding file supplies evidence and verification targets, not lesson structure.
- Research posture: **deep but bounded** (current, fast-moving tooling; most cloud features are research preview / beta). Do not rerun broad research by default; re-check only the exact facts listed below before drafting.
- Provenance: built from a completed deep-research pass (24 verified 3-0 adversarial findings) + a dedicated loop-pattern grounding pass run 2026-06-09.

### Neighbor boundaries (HARD — do not steal scope)

- **m5-l4 (dependsOn)** owns AI-artifact distribution (GitHub Packages, API+CLI, sentinel markers, SKILL.md portability). Not relevant to this lesson's mechanics beyond "your team already has shared artifacts; now run agents that use them remotely."
- **m2-l5 (already drafted, "Innovate: więcej ficzerów, mniej czekania")** already owns and must NOT be re-taught here:
  - git worktrees as parallel "lanes" (`git worktree add`, env-isolation caveat: ports/DB/payment sandbox)
  - selecting independent slices for parallel work
  - the two modes framing: interactive session vs `/goal` delegation with completion condition + per-turn evaluator
  - the multi-agent **orchestrator roundup**: Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View, VS Code Agents window
  - it **already links the Ralph Wiggum technique** (ghuntley.com/ralph) in Materiały dodatkowe and already documents `/goal`.
- **Clean carve for m5-l5:** m2-l5 = "run several isolated agents in parallel *at your desk*"; m5-l5 = "**delegate and leave** — kick a long task off, walk away, monitor/steer from your phone, pick it back up later." The unique surface is **remote/mobile control + cloud sandboxes + scheduled cloud loops + the remote/sandbox security model.**

### Relevant prework (assume known, do not re-teach)

- **[2.1] Agent w IDE, Terminalu czy w Chmurze?** — already introduces mobilność, równoległość, and "narzędzia agent-native lub chmurowe... zadania w tle" as a tradeoff axis. This lesson *operationalizes* that cloud/mobile axis.
- **[2.4] Agent-Native IDE** — already names "równoległa praca, worktrees i delegowanie zadań w tle" plus the discipline it requires (clean repo, scope, tests, review, sekrety, koszty). m5-l5 deepens the *remote/async* slice of this.
- **[1.2] Chatbot vs Agent vs Harness** + **[3.3] context lifecycle (Write/Select/Compress/Isolate)** — supply the vocabulary for why fresh-context loops and isolated sandboxes work.

---

## Pre-draft Verification Checklist

Re-check these exact facts immediately before writing learner-facing prose. If official docs contradict the 2026-06-09 grounding, update this file first; otherwise do not reopen broad research.

### Claude Code on the web

- Source: https://code.claude.com/docs/en/claude-code-on-the-web
- Verify: GA/research-preview status, plan tiers, whether sessions still run in fresh managed VMs, whether sessions persist after browser/laptop close, mobile monitoring path, `claude --remote`, `--teleport`, setup script behavior, network levels, security proxy behavior, `.mcp.json` carryover, and whether local `claude mcp add` still does not carry over.
- Verify only if needed for prose: exact pre-installed tools, `gh` availability, resource ceilings, setup-script cache window, and any "no separate compute charge" wording.

### Claude Code routines

- Source: https://code.claude.com/docs/en/routines
- Verify: GA/research-preview status, supported trigger types, minimum schedule interval, run status semantics, whether a green run still means infrastructure/session success rather than task success, environment/network behavior, setup-script/cache behavior, and mobile/web visibility of routine runs.

### OpenAI Codex Cloud

- Sources: https://developers.openai.com/codex/cloud/environments , https://developers.openai.com/codex/cloud/internet-access , https://developers.openai.com/codex/mcp , https://github.com/openai/codex-universal
- Verify: setup script behavior, internet access during setup vs agent phase, allowlist/method restrictions, cache invalidation and duration, MCP configuration path, `codex-universal` tool assumptions, and any exact plan/resource claims.

### Happy

- Sources: https://github.com/slopus/happy , https://happy.engineering/docs/how-it-works/ , https://github.com/slopus/happy-cli
- Verify: repo/docs availability, license, Claude Code/Codex support, local-compute architecture, relay wording, encryption wording, QR/shared-secret behavior, phone takeover flow, and any claims about code never leaving the machine.

### Cloudflare Agents / Workflows

- Sources: https://developers.cloudflare.com/agents/ , https://developers.cloudflare.com/agents/concepts/workflows/ , https://developers.cloudflare.com/agents/concepts/agentic-patterns/long-running-agents/ , https://developers.cloudflare.com/agents/runtime/lifecycle/agent-class/ , https://developers.cloudflare.com/agents/runtime/execution/run-workflows/
- Verify: durable identity/state/session model, local SQL storage, scheduled work, queue/schedule APIs, recoverable execution/fibers wording, when Workflows are recommended over Agents alone, human-in-the-loop/waiting semantics, MCP/tools support, and current platform limits.
- Drafting boundary: use as **Deep Dive / references-only** for "build your own durable async agent runtime", not as a Core remote-coding sandbox like Claude Code on the web or Codex Cloud.

### Exact product facts

- Re-check before surfacing any exact compute/resource/pre-installed-tool/price/tier/preview/cache/interval/timeout claim.
- Prefer durable model prose over exact numbers when exact values are not central to the lesson.

## Claims To Support

- Remote control of a *local* agent from a phone is possible without exposing SSH to the internet — needs source on Happy's architecture. → official-docs/repo
- Cloud sandboxes run each task in a fresh isolated managed VM with the repo cloned, persisting when you close the laptop. → official-docs
- What is actually pre-installed / configurable in those sandboxes (runtimes, network, setup script, MCP). → official-docs (time-sensitive, verify against live docs at draft time)
- Codex Cloud's network/sandbox model differs from Anthropic's. → official-docs
- "Loop" as a real pattern (Ralph) and as productized commands (`/goal`, `/loop`, routines) — what it is, who promotes it, risks. → technical-post + repo + practitioner-signal. **Boundary:** Core owns `/loop` + routines only; Ralph and `/goal` are references-only because m2-l5 already owns them.
- Sandbox security rationale: why both filesystem AND network isolation matter; the prompt-reduction claim. → official-docs (vendor self-report — soften)
- Cloudflare Agents / Workflows as an optional custom async runtime for durable agents, schedules, Workflows, MCP/tools and loop-connected background work. → official-docs. **Boundary:** Deep Dive / references-only, not Core.

## Grounding Delta Labels

- Do **not** rerun all research by default. The revised spec is narrower than the dossier; use the checklist above to re-check only facts that will appear in draft prose, video, task instructions or `Materiały dodatkowe`.
- **SSH/tmux/mosh** is a practitioner pattern with medium confidence, not a sourced product spec. It can appear as the "you own the box" archetype, but exact app/VPS/hardening details belong in Deep Dive or materials.
- **Ralph-loop skepticism** is a practitioner signal, not proof of failure rates. Use it for risk language ("wake up to a broken codebase", token burn, duplicate work), not as factual benchmark evidence.
- **Codex `/goal` framing** is references-only because m2-l5 owns `/goal`; current grounding is medium confidence and must be re-verified against official OpenAI changelog before any publication claim.
- **Cloudflare Agents / Workflows** is a new 2026-06-13 official-docs addition to support the Deep Dive option. It should not cause the Core to expand into SDK/API implementation; m5-l2 owns building agents from SDK depth.

---

## Strong Sources

### Cloudflare Agents / Workflows — durable async agent runtime (Deep Dive / references-only)

- URL: https://developers.cloudflare.com/agents/ , https://developers.cloudflare.com/agents/concepts/workflows/ , https://developers.cloudflare.com/agents/concepts/agentic-patterns/long-running-agents/ , https://developers.cloudflare.com/agents/runtime/lifecycle/agent-class/ , https://developers.cloudflare.com/agents/runtime/execution/run-workflows/
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-06-13
- Supports:
  - Agents on Cloudflare provide a durable agent runtime: durable identity, local SQL state, sessions/routing, WebSockets, scheduling, recovery/observability, and tools including MCP/browser/sandbox-oriented capabilities.
  - Long-running agents are durable identities rather than always-on processes; state, SQL data, schedules and recovery checkpoints survive hibernation/restarts, while in-memory variables/timers/open fetches do not.
  - Workflows complement Agents for durable multi-step background processing, automatic retries/recovery, waiting for external events and human approval flows. Use Agents for real-time/stateful interaction; use Agents + Workflows for longer-running, multi-step, retry/approval-heavy work.
  - Agent scheduling/queues can support deferred or recurring work; exact APIs and limits must be verified before learner-facing instructions.
- Use in lesson:
  - Deep Dive / references-only option: "if you want to build your own durable async agent runtime, Cloudflare Agents + Workflows is an interesting platform path." This is not a Core remote-coding sandbox and should not become a build tutorial.
- Confidence: high
- Notes:
  - Added after user request on 2026-06-13 and recorded in the `m5-l5` schema `groundingSources`. Keep it references-only / Deep Dive.

### Happy (Happy Coder) — mobile/web client wrapping a LOCAL agent

- URL: https://github.com/slopus/happy , https://happy.engineering/docs/how-it-works/
- Type: repo + official-docs
- Author/publisher: slopus (open source, MIT)
- Checked: 2026-06-09
- Supports:
  - Open-source MIT mobile+web client for **Claude Code and Codex**; you run `happy` instead of `claude` (or `happy codex`). Take over from a phone; **one keypress** hands control back to desktop.
  - The agent **runs on your own machine** — the cloud component is only an **end-to-end-encrypted relay** ("post office"). Phone + computer share a secret key via QR code that the relay never sees; the server only handles encrypted blobs.
  - Relay (not P2P/SSH) because both devices sit behind firewalls on different networks; both make *outgoing* connections to the relay. Explicitly contrasts itself with SSH port-forwarding ("you'd need port forwarding... changing IP addresses... often doesn't work on mobile networks").
- Use in lesson:
  - The "control a local agent from your phone" path — the low-setup, keep-compute-local option. Good contrast partner to cloud sandboxes.
- Confidence: high
- Notes:
  - Frequently **mis-described as a cloud agent — it is not.** The CLI wrapper lives in sibling repo `slopus/happy-cli`; `slopus/happy` is the app. Third-party (starlog.is) corroborates AES-256-GCM. Flag it's a third-party tool, not first-party.

### Claude Code on the web (cloud sandbox)

- URL: https://code.claude.com/docs/en/claude-code-on-the-web
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-09
- Supports:
  - Each session runs in a **fresh Anthropic-managed VM** with the repo cloned; **sessions persist when you close the browser** and are **monitorable from the Claude mobile app**.
  - `claude --remote` spawns an independent cloud session → multiple run in parallel; `--teleport` pulls one back to an interactive local session.
  - **No separate compute charge** (shares the account's normal rate limits). Resource ceilings ~**4 vCPU / 16 GB RAM / 30 GB disk** (approximate, may change).
  - Pre-installed: Python (pip/poetry/uv/pytest/ruff), Node 20/21/22 via nvm (npm/yarn/pnpm/bun), Ruby, PHP, Java (OpenJDK 21), Go, Rust, C/C++, Docker, PostgreSQL 16, Redis 7.0, plus git/jq/ripgrep/tmux/vim/nano. **`gh` CLI is NOT pre-installed.**
  - Network: 4 levels — **None / Trusted (default) / Full / Custom**; all outbound passes through a security proxy (Bun has known proxy issues).
  - Customization: a **Bash setup script runs as root on Ubuntu 24.04 before Claude launches**, output snapshot-cached (~7-day expiry or on script/host change), keep under ~5 min. **MCP servers load only from the repo's committed `.mcp.json`** — servers added via `claude mcp add` locally do NOT carry over.
- Use in lesson:
  - The canonical "true async delegation" path; the pre-installed-list + setup-script + `.mcp.json` rule is the concrete "configure available libraries/CLIs/MCP" payload the lesson brief asked for.
- Confidence: high
- Notes:
  - **RESEARCH PREVIEW**, gated to Pro/Max/Team/eligible Enterprise. Tool list is Anthropic-specific (NOT Codex). Verify the installed-tools list against live docs at draft time — most likely field to drift.

### Anthropic managed-agents API — environments

- URL: https://platform.claude.com/docs/en/managed-agents/environments
- Type: official-docs
- Author/publisher: Anthropic (beta header `managed-agents-2026-04-01`)
- Checked: 2026-06-09
- Supports:
  - Each session = its own **isolated fresh Linux container**; sessions can share an environment but **do not share filesystem state**.
  - `packages` field pre-installs across six managers (apt, cargo, gem, go, npm, pip) with version pinning, cached across sessions sharing the environment.
  - Network per environment: `unrestricted` (full outbound minus safety blocklist — default) or `limited` (confined to `allowed_hosts` + opt-in toggles for MCP servers and package registries, both default false).
- Use in lesson:
  - The programmatic/API face of the same sandbox model — useful as the "team builds this into their own pipeline" angle (ties back to m5-l4's distribution mindset without re-teaching it). Likely *referencesOnly* depth, not owned.
- Confidence: high
- Notes: beta API; keep shallow unless the spec decides to own the SDK path (overlaps m5-l2 "Twój pierwszy Agent zespołowy: SDK").

### OpenAI Codex Cloud — environments, internet access, MCP

- URL: https://developers.openai.com/codex/cloud/environments , https://developers.openai.com/codex/cloud/internet-access , https://developers.openai.com/codex/mcp , https://github.com/openai/codex-universal
- Type: official-docs + repo
- Author/publisher: OpenAI
- Checked: 2026-06-09
- Supports:
  - Default container image **`universal`** (reference Dockerfile `openai/codex-universal`, Ubuntu 24.04).
  - **Internet OFF by default during the agent phase**, configurable; **setup scripts keep internet** for dependency installation; all outbound passes through an HTTP/HTTPS proxy.
  - Internet access has **TWO states (Off / On)**; On adds a domain allowlist (**None / Common-dependencies preset / All**) + optional HTTP-method restriction to GET/HEAD/OPTIONS.
  - Container state **cached up to 12 h**, invalidated when setup script, env vars, or secrets change.
  - MCP: `codex mcp add <name> -- <stdio command>`; `codex mcp login` (OAuth) for HTTP MCP servers.
- Use in lesson:
  - The Codex side of the cloud-sandbox comparison. The "internet off during agent phase, on during setup" asymmetry is a great concrete gotcha.
- Confidence: high
- Notes:
  - **CORRECTION baked in:** it is TWO access states, not three — earlier phrasing conflated states with the three allowlist presets. Codex universal toolset ≠ Anthropic's list; don't blend them.

### Claude Code sandboxing (security rationale)

- URL: https://www.anthropic.com/engineering/claude-code-sandboxing , https://code.claude.com/docs/en/sandboxing , https://github.com/anthropic-experimental/sandbox-runtime
- Type: official-docs + repo
- Author/publisher: Anthropic (blog published 2025-10-20)
- Checked: 2026-06-09
- Supports:
  - Effective sandboxing needs **BOTH** filesystem isolation AND network isolation. "Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a compromised agent could easily escape the sandbox."
  - Sandboxing "safely reduces permission prompts by **84%**" → enables more autonomous unattended work (the link between security and async delegation).
- Use in lesson:
  - The security spine. The SSH-key-exfiltration line is the vivid "why you don't just `--dangerously-skip-permissions` on your laptop and walk away" argument.
- Confidence: high
- Notes:
  - **84% is a vendor self-report** with undisclosed methodology — attribute as "Anthropic internal testing," do not present as independently validated. Open-sourced runtime uses bubblewrap/seatbelt.

### Claude Code routines (scheduled autonomous cloud loops)

- URL: https://code.claude.com/docs/en/routines
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-09
- Supports:
  - Routines run autonomously on Anthropic-managed cloud as **full Claude Code sessions — no permission prompts during a run** — so they "keep working when your laptop is closed."
  - Three trigger types: **Scheduled** (recurring cron / one-off future time, **min interval 1 hour**), **API** (HTTP POST to a per-routine endpoint + bearer token), **GitHub** (repo events: PRs/releases). A single routine can combine triggers.
  - Cloud environment controls network/env/setup-script; Default env = Trusted network; other hosts fail with `403` + `x-deny-reason: host_not_allowed`.
- Use in lesson:
  - The **first-party, productized "loop"** — the safe, verified answer to "autonomous loops" that does NOT require re-teaching Ralph. This is the recommended framing anchor for the loop angle.
- Confidence: high
- Notes:
  - **RESEARCH PREVIEW.** A green run status means "session exited without infra error," NOT "task succeeded" — important caveat for unattended trust.

### The Ralph technique / loop pattern (the X-trending idea)

- URL: https://ghuntley.com/ralph/ (14 Jul 2025) , https://ghuntley.com/loop/ (17 Jan 2026)
- Type: technical-post (named author)
- Author/publisher: **Geoffrey Huntley** — built CURSED (an esoteric language) this way; taught it to SF engineers; published "$50k contract delivered for $297" case study.
- Checked: 2026-06-09
- Supports:
  - Ralph in its purest form is a Bash loop: **`while :; do cat PROMPT.md | claude-code ; done`**. "Ralph works autonomously in a single repository as a single process that performs one task per loop." Memory lives on disk / git, not in conversation history; each iteration is fresh context.
  - "Everything is a Ralph loop" (Jan 2026) reframes looping as a **mindset shift**, often run manually ("doing the loop... via prompting or via automation with a pause that involves... CTRL+C to progress").
- Use in lesson:
  - Name the pattern and credit it, but **do NOT re-teach from scratch — m2-l5 already links it.** Use it only as the conceptual ancestor of the productized loop commands. Mention once, point forward to the first-party tools.
- Confidence: high (for what the pattern IS and who originated it)
- Notes:
  - Author himself warns: "**There's no way in heck would I use Ralph in an existing code base**"; "you'll wake up to a broken code base from time to time"; requires "faith and a belief in eventual consistency"; "anyone claiming that engineers are no longer required... is peddling horseshit." These caveats are essential if the lesson touches Ralph at all.

### Productized loop commands — `/goal`, `/loop`, Codex built-in loop

- URL: https://github.com/snarktank/ralph (repo) ; https://code.claude.com/docs/en/goal (referenced by m2-l5) ; Claude Code `/loop` skill (installed tool behavior) ; Codex CLI 0.128.0 release (30 Apr 2026)
- Type: repo + official-docs + tool behavior
- Author/publisher: snarktank (community), Anthropic, OpenAI
- Checked: 2026-06-09
- Supports:
  - **snarktank/ralph** (~20.1k stars): productionized loop — fresh instance per iteration, state via **git history + `progress.txt` (append-only learnings) + `prd.json` (story `passes:` flags)**; emits `<promise>COMPLETE</promise>` and exits when all stories pass; default max 10 iterations. Shows the "safeguards against infinite loops" the raw bash loop lacks.
  - **Codex got a built-in Ralph loop** in CLI **0.128.0 (30 Apr 2026)**; Greg Brockman on X: "codex now has a built in Ralph loop++." Exposed via `/goal` — adds model-side completion audit (`continuation.md`), token-budget guardrails, and an `update_goal` tool with explicit "do not accept proxy signals as completion." **NOTE: m2-l5 already teaches Codex/Claude `/goal`** — so `/goal` is owned upstream.
  - **Claude Code `/loop`** (installed skill): runs a prompt/slash-command on a **recurring interval** (`/loop 5m /foo`), or **omit the interval to let the model self-pace**; loop-aware (can reference prior cycles); intervals via `--interval` (min 1 min) or `--cron`, max window ~3 days then auto-stops. This is the "self-pacing loop command" the brief asked about, and it is **NOT yet referenced by m2-l5** — strongest unique loop hook for m5-l5.
- Use in lesson:
  - If the lesson covers loops, anchor on **`/loop` (self-pacing/recurring) + routines (scheduled cloud)** as the parts m2-l5 does NOT own; treat Ralph and `/goal` as already-introduced and point back.
- Confidence: high for `/loop` and snarktank mechanics; **medium** for the Codex-`/goal` framing (ralphable.com is an SEO blog; the version/date and Brockman quote are the verifiable anchors — re-verify against OpenAI changelog before publishing).

### SSH + tmux / mosh remote-to-a-box path

- URL: https://rogs.me/2026/02/claude-code-from-the-beach-my-remote-coding-setup-with-mosh-tmux-and-ntfy/ , https://www.twingate.com/blog/claude-code-termius-tmux
- Type: technical-post (blogs)
- Checked: 2026-06-09
- Supports:
  - The classic path: SSH/mosh into a dev box/VPS, run the agent inside **tmux** (persistent session survives disconnect), reconnect from a phone terminal (Termius/Blink); `ntfy` for push notifications when the agent needs you.
- Use in lesson:
  - The "you already own this, zero new vendor" baseline option. Pairs with Happy (low-setup) and cloud (managed) as the three remote-control archetypes.
- Confidence: medium (well-established practitioner pattern, but **no surviving primary-source verification** in this pass — present as a known pattern, not a sourced spec).

---

## Practitioner Signals

### Ralph-loop skepticism (cost / reliability)

- URL: https://itnext.io/ralph-loop-is-innovative-i-wouldnt-use-it-for-anything-that-matters-... , https://www.decodingai.com/p/ralph-loops
- Type: practitioner-signal / technical-post
- Signal: Loud "innovative but I wouldn't use it for anything that matters" current; recurring themes = unpredictable token burn, non-deterministic duplicate work, fine for greenfield throwaways, dangerous on code that matters.
- Useful language: "ship features while you sleep," "delegate and walk away," "wake up to a broken codebase."
- Risk: easy to overclaim. Do NOT present loops as hands-off magic. (itnext URL had a TLS cert error on fetch 2026-06-09 — re-fetch before quoting.)
- Confidence: medium

### "Loops are trending" recency

- Signal: the wave the user noticed peaked ~late Apr–May 2026: Codex built-in loop (30 Apr), "/goal /loop /batch — finish work while you sleep" explainers (Rick Hightower, Towards AI, May 2026), "Ralph + threads" think-pieces.
- Risk: **the user said "last week or two on X" but the concrete dated events are Apr–May 2026.** Flag the recency honestly; don't pin a "this week" claim the sources don't support.
- Confidence: medium

---

## Examples Worth Using

- **Three remote-control archetypes** as the lesson's spine: (1) SSH+tmux to your own box (own everything, most setup), (2) Happy (local compute, E2E relay, lowest-friction phone control), (3) Claude Code on the web / Codex Cloud (managed sandbox, true fire-and-forget). One table, audience-driven choice — echoes m5-l4's "pick by audience" muscle without re-teaching distribution.
- **The setup-script + `.mcp.json` gotcha**: "your local `claude mcp add` does NOT travel to the cloud — declare it in the repo's `.mcp.json`." Concrete, surprising, exactly the "proper configuration of MCP" the brief wanted.
- **Codex "internet off during agent phase, on during setup"** — the single best concrete sandbox gotcha (install deps in setup, then the agent runs network-restricted).
- **The SSH-key-exfiltration line** as the motivating threat for why you don't just skip permissions and walk away — leads into sandbox network isolation.
- **`progress.txt` + `prd.json` as filesystem memory** (snarktank/ralph) — the "disk is the context window" idea, ties to prework [3.3] Isolate/external memory.
- **Routines green ≠ success** — the trust caveat for unattended runs.

## Claims To Avoid Or Soften

- **No native Anthropic "Remote Control" mobile mode.** A VentureBeat report (Feb 24 2026) was **refuted (1-2 vote)**. Do not assert a first-party "Remote Control" feature; the verified mobile-control paths are Happy (3rd-party, local agent) and Claude Code on the web + mobile-app monitoring.
- **84% prompt reduction** — attribute to Anthropic internal testing, don't validate it.
- **Codex internet "three states"** — it's two (Off/On). Bake the correction in.
- **"Loops let you ship while you sleep" / replace engineers** — present as the marketing claim AND the Huntley/critic caveat; net message is "great for bounded throwaway/greenfield, risky on code that matters."
- **Pre-installed tool lists & resource ceilings** — explicitly "as of mid-2026, research preview, may change." Re-verify at draft time.
- **"trending this week on X"** — soften to "the loop-command wave of spring 2026."

## Open Verification Questions

- Which of these are GA vs research preview at the lesson's *publish* date, and at which plan tiers? (Most time-sensitive fact for learners — re-check Claude Code on the web, routines, managed-agents API, Codex Cloud.)
- Is there, by publish date, any first-party Anthropic mobile remote-control feature distinct from web + mobile-app monitoring? (Refuted as of now — recheck.)
- Re-fetch the itnext Ralph critique (TLS error this pass) before quoting it directly.
- Confirm the Codex `/goal` built-in-loop details against OpenAI's official changelog (currently leaning on an SEO blog + the Brockman X quote).

## Needs Human Decision (editorial boundary)

- **Loop overlap with m2-l5.** m2-l5 already links Ralph and teaches `/goal`. Decision required: does m5-l5 (a) cover loops only as the **self-pacing `/loop` + scheduled routines** "delegate-and-walk-away" enabler and point back to m2-l5 for Ralph/`/goal`, (b) drop loops entirely and stay purely remote+cloud, or (c) own a deeper loop treatment and have m2-l5 demoted to a pointer? Recommended: **(a)** — least duplication, keeps the X-relevant `/loop`+routines hook that m2-l5 lacks. User already chose a dedicated grounding pass; this is the remaining placement call for the spec.
- **Depth of the SDK/API sandbox path** vs m5-l2 ("Twój pierwszy Agent zespołowy: SDK") — keep managed-agents API at referencesOnly depth unless the spec consciously claims it.

## Schema Source Update

Added a `groundingSources` array (9 entries) to the m5-l5 lesson object in `workbench/lessons-schema.json` (it had none), covering: Happy, Claude Code on the web, managed-agents environments, Codex Cloud (envs/internet/MCP), Claude Code sandboxing, Claude Code routines, the Ralph technique (ghuntley), productized loop commands (snarktank/ralph + `/loop` + Codex `/goal`), and the SSH+tmux path. Recorded unsupported/soften facts in `sideEffectLedger.unsupportedFacts` and the loop-boundary call in `sideEffectLedger.needsHumanDecision`.
