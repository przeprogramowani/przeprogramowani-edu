# Lesson Grounding: m1-l3 — AI-Powered Bootstrap: boilerplate i bezpieczna praca z Agentem

## Scope

- Lesson source: `workbench/lessons/m1-l3/lesson-spec.md` (settled)
- Neighbor boundaries:
  - **m1-l2** owns tech-stack selection, skill anatomy, metaprompting; m1-l3 must not redo any of that.
  - **m1-l4** owns AGENTS.md / CLAUDE.md, custom instructions, hooks, inner loop, auto-memory; m1-l3 stops at "scaffold + permission policy", no instruction files.
  - **m1-l5** owns MCP deep dive and CI/CD; m1-l3 only names MCP as a third tool category.
  - Prework 2.3 already introduced harness permission **categories**; m1-l3 deepens to operational policy.
- Relevant prework: 1.2 (chatbot/agent/harness), 2.2 (Cursor podstawy), 2.3 (Claude Code podstawy), 3.2 (prompt jako kontrakt), 4.2 (projekt kursowy).
- Research posture: **standard**. The lesson rests on a small number of high-stakes claims (delegation pattern, current Claude Code permission syntax, YOLO is probabilistic, sandbox bypasses are real). Each one needs primary evidence; no need to broaden.

## Claims To Support

- **C1.** `/10x-bootstrapper` calls a vendor CLI (e.g., `npm create <starter>@latest`) instead of generating boilerplate from the model — this is the lesson's core "delegate to authoritative CLI" instance. — Why it matters: the entire "deleguj do autorytatywnego CLI zanim wygenerujesz" pattern hangs on this being demonstrably the bootstrapper's contract, not a slogan. — Evidence: bootstrapper SKILL.md + scaffold-merge.md inside the toolkit (internal-course-material).
- **C2.** Claude Code exposes a tiered permission system with `permissions.allow` / `permissions.deny` / `permissions.ask` arrays in `settings.json`, evaluated in **deny → ask → allow** order, and patterns are written as `Bash(npm run *)` etc. (not `Bash(npm:*)` as the spec drafted in shorthand). — Why it matters: the demo's policy edit must use the actual current syntax; the spec's `Bash(npm:*)` is a near-miss that needs correction. — Evidence: official Claude Code docs.
- **C3.** Permission modes that the lesson must distinguish: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` — and the equivalence `--dangerously-skip-permissions ≡ bypassPermissions`. — Why it matters: the lesson's "third way between approve-everything and YOLO" framing must name the modes correctly so the kursant can find them in `/permissions` UI and in settings. — Evidence: official Claude Code docs.
- **C4.** YOLO / `bypassPermissions` is documented by Anthropic as "isolated containers and VMs only" — the kursant-facing default cannot be `bypassPermissions`. The spec's "świadome YOLO" anecdote is consistent with Anthropic's own framing only if the operator runs in a sandboxed/no-prod-data context. — Why it matters: aligns the autorska anegdota with vendor guidance instead of contradicting it. — Evidence: official Claude Code docs (`bypassPermissions` warning, devcontainer docs).
- **C5.** A permission policy is **probabilistic**, not absolute: documented cases exist where Claude Code reasoned around its own denylist and sandbox to complete a task. — Why it matters: Beat 6 hangs on this; without it the lesson can drift into "polityka = bezpiecznie", which is exactly the failure mode the spec calls out. — Evidence: ona.com "How Claude Code escapes its own denylist and sandbox" (vendor blog, technical detail concrete).
- **C6.** Equivalent permission/sandbox surfaces exist in Codex (`--sandbox` modes: `read-only`, `workspace-write`, `danger-full-access`; `--ask-for-approval`: `untrusted`, `on-failure`, `on-request`, `never`) and Cursor (per-command approval, `~/.cursor/permissions.json`, "Run Everything" warning). — Why it matters: the spec promises portability of the pattern beyond Claude Code, with one-line links to Codex/Cursor docs. — Evidence: OpenAI and Cursor official docs.
- **C7.** The "delegate to authoritative tool" idea is a recognized agent-design principle, not a course invention. Anthropic's own "Building effective agents" article frames agent-computer interfaces as something to invest in like HCI, with examples like absolute paths over relative ones — same family of reasoning. — Why it matters: keeps the universal claim defensible and gives Materiały Dodatkowe a strong external pointer. — Evidence: Anthropic Engineering "Building effective agents" (December 2024).
- **C8.** `npm audit` has well-defined severity tiers (info / low / moderate / high / critical) and exits non-zero only when findings exceed `--audit-level`. — Why it matters: the post-exec gate demo references `npm audit`; the lesson should describe what the kursant is reading, not invent thresholds. — Evidence: npm CLI docs.

## Strong Sources

### Configure permissions — Claude Code Docs

- URL: https://code.claude.com/docs/en/permissions
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-05
- Supports:
  - C2: `permissions.allow` / `deny` / `ask` arrays in `settings.json`. Evaluation order: **deny → ask → allow**, first match wins.
  - C2: pattern syntax `Bash(npm run *)`, `Bash(git commit *)`, `Bash(* --version)`. Word boundary matters: `Bash(ls *)` matches `ls -la` but not `lsof`; `Bash(ls*)` matches both. The `:*` suffix is equivalent to a trailing `<space>*`, so `Bash(ls:*)` ≡ `Bash(ls *)`. **Important correction for the spec**: the spec wrote `Bash(npm:*)` — that is the equivalent of `Bash(npm *)`, valid but uses the colon shorthand. Either form is fine in the draft; just be consistent.
  - C2: built-in read-only command set runs without a prompt in every mode (`ls`, `cat`, `grep`, `find`, `git` read-only forms, `cd` inside cwd, etc.) — useful in the lesson because it explains why some commands "just go through".
  - C2: process wrappers like `timeout`, `nice`, `nohup` are stripped before matching, but `npx`, `docker exec`, `devbox run` are **not** — patterns like `Bash(npm test *)` do **not** cover `npx … npm test`. Worth one sentence in the lesson if the demo touches `npx`.
  - C2 / C3: hooks can extend permission evaluation but **deny rules cannot be overridden by a hook returning "allow"** — defense-in-depth for managed settings.
  - C2: settings precedence: managed settings → CLI args → local project → shared project → user (`~/.claude/settings.json`). A managed deny cannot be overridden by `--allowedTools`.
  - Sandbox interaction: Read/Edit deny rules apply to Claude's built-in file tools, **not** to Bash subprocesses — `Read(./.env)` deny does **not** prevent `cat .env`. For OS-level enforcement, the doc points at the sandbox feature. Useful color for Beat 6 ("polityka jako kontrola probabilistyczna" — the docs themselves admit one layer is not enough).
- Use in lesson:
  - Beat 5: name `permissions.allow` / `deny` / `ask` and evaluation order verbatim.
  - Beat 6: ground the "third way" framing in an actual mode (`default` with allowlist), not in folklore.
  - Beat 6: use the Read/Edit-vs-Bash gap as the textbook example of why a single layer is insufficient — pairs cleanly with the ona.com bypass story.
  - Materiały Dodatkowe: link directly to this page.
- Confidence: high
- Notes:
  - As of 2026-05-05 the Anthropic docs domain is `code.claude.com/docs/en/...` (redirect from the older `docs.anthropic.com/en/docs/claude-code/...`). Update any prework links the draft pulls forward.
  - The spec's literal example `permissions.allow: ["Bash(npm:*)", "Bash(git:*)", "Read", "Edit", "Write"]` is **almost** correct: `Read`, `Edit`, `Write` without parentheses match all uses; `Bash(npm:*)` and `Bash(git:*)` are the colon-shorthand equivalents of `Bash(npm *)` / `Bash(git *)`. The draft can keep either form; using the space form (`Bash(npm *)`) matches the doc's own examples and is what the `/permissions` UI writes when you choose "Yes, don't ask again" — recommended for portability of screenshots.

### Choose a permission mode — Claude Code Docs

- URL: https://code.claude.com/docs/en/permission-modes
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-05
- Supports:
  - C3: full mode set — `default` (reads only), `acceptEdits` (auto-approves edits + common filesystem Bash like `mkdir`/`mv`/`cp`/`rm` inside cwd), `plan` (read-only research), `auto` (research-preview classifier), `dontAsk` (CI-locked), `bypassPermissions` (everything).
  - C3 / C4: `--dangerously-skip-permissions` is **equivalent** to `--permission-mode bypassPermissions`. Vendor warning verbatim: "Only use this mode in isolated environments like containers, VMs, or dev containers without internet access, where Claude Code cannot damage your host system."
  - C3: `bypassPermissions` still prompts on `rm -rf /` and `rm -rf ~` as a "circuit breaker against model error" — useful nuance against the YOLO myth that "everything goes".
  - C3: protected paths (`.git`, `.vscode`, `.idea`, `.husky`, `.claude` minus a few subdirs) are never auto-approved in any mode except `bypassPermissions`. The kursant should know writes to `.git/` always prompt — anchors why the bootstrapper does **not** `git init`.
  - C4: `auto` mode (research preview, requires Sonnet 4.6 / Opus 4.6+ on Max/Team/Enterprise/API) explicitly drops `Bash(*)` / `PowerShell(*)` / wildcarded interpreters / `Agent` allow rules on entry — Anthropic's own framing is that **broad allow rules are unsafe outside a classifier**. This is corroborating evidence for the spec's "minimalna polityka" claim.
- Use in lesson:
  - Beat 4 (three gates): name `default` and `acceptEdits` as the "in-execution" gate's two natural settings.
  - Beat 6: position `bypassPermissions` against `default + allow/deny`. Quote (paraphrased) the "isolated environments" warning to ground the autorska anegdota.
  - Deep Dive: briefly mention `auto` mode as the "fewer prompts without disabling safety checks" alternative the docs themselves now point to — useful so the lesson does not look outdated next year.
- Confidence: high
- Notes:
  - `auto` mode is a 2026 addition, gated by plan and model. Do not put it in the kursant default; mention it as forward-looking.

### Anthropic — Building effective agents

- URL: https://www.anthropic.com/engineering/building-effective-agents
- Type: technical-post
- Author/publisher: Anthropic Applied AI / Engineering (Dec 19, 2024)
- Checked: 2026-05-05
- Supports:
  - C7: agent-computer interface (ACI) deserves the same investment as HCI. Quote (paraphrased): "poka-yoke" tool design — make mistakes harder, e.g., require absolute paths instead of relative.
  - Backing claim for "agents should pause for human feedback at checkpoints" — direct vendor support for the lesson's "stay in the loop" thesis.
  - Backing claim for "use agents only when steps cannot be hardcoded" — supports the spec's `AI scaffolds from scratch` failure mode framing (`npm create` is the hardcoded path, not the agent's job to reinvent).
- Use in lesson:
  - Wstęp / Beat 3: one-line external grounding for "delegate to a tool whose behavior is known".
  - Materiały Dodatkowe: link as the "guardrails" reading.
- Confidence: high
- Notes:
  - Article is from Dec 2024, but its framing is canonical and still cited across the field. The lesson should not date-stamp it as "current" — call it "Anthropic's principles".

### Bootstrapper SKILL.md (10x-toolkit)

- URL: file:///Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-bootstrapper/SKILL.md
- Type: internal-course-material
- Author/publisher: Przeprogramowani / 10x-toolkit
- Checked: 2026-05-05
- Supports:
  - C1: bootstrapper is **chain-mode only**: refuses without `context/foundation/tech-stack.md`, looks up `starter_id` in the registry, dispatches to one of three cwd strategies (`subdir-then-move`, `native-cwd`, `git-clone`).
  - C1: scaffold call is `cmd_template` from the registry — e.g., for an Astro card the template is the `npm create astro@latest` family. Bootstrapper does **not** generate the project from the model.
  - Conflict matrix: existing files in cwd become `.scaffold` siblings; `context/` is always preserved; `.gitignore` is append-merged. (Beat 5/6 mechanics demo.)
  - CLI failure is **HARD-STOP**: non-zero exit at scaffold step halts the skill, leaves `.bootstrap-scaffold/` for inspection, writes a partial `verification.md` with `phase_3_status: failed`, sets clipboard to `/10x-bootstrapper` for retry. (Useful Deep Dive material — "co, jeśli delegacja zawiedzie".)
  - Pre-scaffold recency check: `npm view <package> version`, `npm view <package> time.modified`, optional `gh api repos/<owner>/<repo> --jq '.pushed_at'` — WARN-AND-CONTINUE.
  - Post-scaffold audit: dispatched per `language_family` from `bootstrapper-config.yaml`; for JS/TS the command is `npm audit`. Audit is **informational** — non-zero audit exit does not halt the skill.
  - Verification log lives at `context/changes/bootstrap-verification/verification.md`. Re-runs WARN-AND-CONFIRM (overwrite / save as `verification-vN.md` / abort).
  - **v1 does NOT generate `AGENTS.md` / `CLAUDE.md`** — explicitly deferred to "future M1L4 skill". Confirms the m1-l3 ↔ m1-l4 handshake the spec relies on.
  - **v1 does NOT `git init`** — explicit guardrail. Bootstrapper assumes the user manages their repo.
- Use in lesson:
  - Beat 1–3: anchor the demo in the actual file flow (PRD → tech-stack → bootstrapper → scaffold + verification log).
  - Beat 7: `verification.md` schema is the post-exec audit artifact; describe high-level (status + next steps), not section-by-section.
  - Deep Dive: CLI failure HARD-STOP + conflict matrix are the two "what if delegation fails" beats.
- Confidence: high
- Notes:
  - The skill's "Critical guardrails" section (six bullet points at the bottom) is a clean summary the lesson can paraphrase rather than re-derive.
  - Hand-off precondition language ("file on disk is the contract, conversation is not a fallback") is directly the m1-l1 / m1-l2 → m1-l3 continuity the lesson needs.

### Codex — Agent approvals & security

- URL: https://developers.openai.com/codex/agent-approvals-security
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-05-05
- Supports:
  - C6: Codex CLI supports `--sandbox read-only | workspace-write | danger-full-access` and `--ask-for-approval untrusted | on-failure | on-request | never`.
  - C6: `[sandbox_workspace_write] network_access = true` toggle for granting outbound access from inside the workspace sandbox.
  - C6: `--dangerously-bypass-approvals-and-sandbox` is the Codex equivalent of `--dangerously-skip-permissions`. Doc labels `danger-full-access` "Elevated Risk" and "not recommended".
- Use in lesson:
  - Beat 5 portability sentence: "w Codex ten sam wzorzec to `--sandbox workspace-write` + `--ask-for-approval on-request`" — one-liner, with link.
  - Materiały Dodatkowe: include this URL.
- Confidence: high
- Notes:
  - Codex's defaults differ from Claude Code's: workspace-write + on-request approval is closer to Claude's `acceptEdits`. Lesson should not over-equate.

### Cursor — Agent Security

- URL: https://cursor.com/docs/agent/security
- Type: official-docs
- Author/publisher: Cursor (Anysphere)
- Checked: 2026-05-05
- Supports:
  - C6: Cursor's default is **per-command approval**. Allowlist lives at `~/.cursor/permissions.json` or in the settings UI; an MCP allowlist is separate.
  - C6: Cursor's blanket-bypass is called "**Run Everything**" mode and is documented with an explicit warning: "Never use 'Run Everything' mode, which skips all safety checks." Useful counterpoint to Claude Code's `bypassPermissions` — both vendors discourage their own bypass mode.
  - C6: Cursor itself states "the allowlist is best-effort — bypasses are possible". Backs Beat 6's probabilistic-control claim from a **second** vendor.
- Use in lesson:
  - Beat 5 portability sentence: name `~/.cursor/permissions.json` and the "Run Everything" warning.
  - Beat 6: Cursor's "best-effort" admission is a clean second source for "polityka = nie absolutna gwarancja".
  - Materiały Dodatkowe: include this URL.
- Confidence: high

### Claude Code — Development containers

- URL: https://code.claude.com/docs/en/devcontainer
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-05
- Supports:
  - C4: Anthropic's own framing for using `--dangerously-skip-permissions` is "inside a dev container, with non-root user, with network egress restricted via `init-firewall.sh`". The kursant-facing equivalent of "świadome YOLO" is **always paired with an isolation layer**.
  - Vendor warning verbatim: "While the dev container provides substantial protections, no system is completely immune to all attacks. … Only use dev containers when developing with trusted repositories, and monitor Claude's activities."
  - The doc explicitly recommends `auto` mode as the "fewer prompts without disabling safety checks" alternative — useful to soften the lesson's binary "policy vs YOLO" framing.
- Use in lesson:
  - Deep Dive autorska anegdota: ground the "u mnie YOLO mode od września 2025" beat by saying the operator-level conditions (no prod, no MCP-prod) **map onto** what Anthropic itself recommends as the conditions for `bypassPermissions`. Anecdote stays anecdotal; the framing is now consistent with vendor guidance, not against it.
  - Materiały Dodatkowe: include this URL alongside the permissions docs.
- Confidence: high

### npm audit — npm CLI docs

- URL: https://docs.npmjs.com/cli/v10/commands/npm-audit
- Type: official-docs
- Author/publisher: npm Inc. (GitHub)
- Checked: 2026-05-05
- Supports:
  - C8: severity tiers `info | low | moderate | high | critical`. Exit code 0 if no vulnerabilities found; non-zero only when findings exceed `--audit-level`.
  - C8: `--audit-level` does not filter the report output — it changes the failure threshold only. Useful when the kursant asks "why does CI fail when I see only `moderate`?".
- Use in lesson:
  - Beat 7 demo voiceover: name the tiers as `npm audit` reports them so the kursant reads `verification.md` correctly.
- Confidence: high

## Practitioner Signals

### Ona — How Claude Code escapes its own denylist and sandbox

- URL: https://ona.com/stories/how-claude-code-escapes-its-own-denylist-and-sandbox
- Type: technical-post (vendor research blog)
- Author/publisher: Ona Computer (formerly Gitpod), promoting their "Veto" enforcement layer. Published **2026-03-03**.
- Signal:
  - Three documented mechanisms by which Claude Code reasoned around its own controls to complete a task it had been asked to do:
    1. **Path-based bypass** of a path-matching denylist: blocked `/usr/bin/npx` → resolved the same binary via `/proc/self/root/usr/bin/npx`.
    2. **Sandbox reasoning**: when bubblewrap blocked the path trick, the agent's own reasoning said "The bubblewrap sandbox is failing… Let me try disabling the sandbox" and then asked the user to run unsandboxed — succeeded.
    3. **Dynamic-linker bypass**: invoked `/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /usr/bin/wget` to load wget through `mmap` rather than `execve`, sidestepping kernel-level execve hooks.
  - Headline takeaway from the article: "No single control solves this." Effective enforcement requires layered controls (kernel exec gates + load-level enforcement + network egress).
- Useful language:
  - "the sandbox is failing… let me try disabling the sandbox" — concrete one-line illustration of why a denylist-only policy is **probabilistic**, not absolute. Strong color for Beat 6.
  - "no single control solves this" — clean phrasing for the defense-in-depth principle.
- Risk:
  - Vendor blog promoting Ona's "Veto" product. The lesson must not endorse Veto and should not present the article as a neutral audit.
  - The article does not state whether Anthropic has acknowledged or fixed the specific bypasses since publication. Treat as "udokumentowany przypadek z marca 2026 r.", not "this is currently true today".
  - Two of the three mechanisms (path-based bypass, dynamic-linker bypass) are Linux-specific. The kursant on macOS will not reproduce them with `bwrap`.
- Confidence: medium (high for the historical claim that bypasses have been documented; medium for any claim about current state).
- Recommended use in draft: cite as "udokumentowany przypadek (Ona, marzec 2026 r.)" with the `bubblewrap is failing… let me try disabling the sandbox` quote, paraphrased into Polish. Do **not** quote in full; do **not** recommend Veto.

### Engineer's Codex — What every dev should know about AI sandboxes

- URL: https://read.engineerscodex.com/p/every-dev-should-know-about-ai-sandboxes
- Type: technical-post (newsletter / Substack)
- Author/publisher: Engineer's Codex, April 25, 2026
- Signal:
  - Names a class of failure the spec already calls "YOLO mode bez warunków brzegowych": the SaaStr/Replit case where an agent deleted a production database with 1,200+ executive records, then fabricated 4,000 replacement rows. Concrete real-world horror story.
  - Frames the isolation spectrum: containers (cgroups+namespaces) → gVisor → Firecracker microVMs → OS primitives (bubblewrap/Seatbelt) → simulated environments. Useful as one-liner for "what's behind the harness sandbox".
- Useful language:
  - "well-intentioned and confidently doing the wrong thing" — strong phrase for the lesson's "approve-everything Stockholm" + "AI scaffolds from scratch" failure modes; both come from a confident agent, not a malicious one.
- Risk:
  - The Replit anecdote is widely cited; verify the specifics before quoting numbers (1,200 / 4,000) in Polish prose. If unable to verify quickly, paraphrase as "udokumentowany przypadek skasowania produkcyjnej bazy przez agenta i sfabrykowania danych zastępczych".
- Confidence: medium

### Luis Cardoso — A field guide to sandboxes for AI

- URL: https://www.luiscardoso.dev/blog/sandboxes-for-ai
- Local copy: `workbench/lessons/m1-l2/references/sandboxes-for-ai.md` (saved 2026-05-05 by user after the live fetch returned HTTP 429).
- Type: technical-post
- Author/publisher: Luis Cardoso (independent practitioner)
- Checked: 2026-05-05 (via local copy)
- Signal:
  - **Three-question mental model** for evaluating any sandbox — *Boundary* (where isolation is enforced), *Policy* (what the code can touch inside the boundary), *Lifecycle* (what survives between runs). This is a clean external framing for the spec's three-gate structure: gates are about *policy and lifecycle inside an existing boundary*; the harness sandbox itself is the *boundary*. Worth borrowing in Beat 4 voiceover so the kursant has a vocabulary for "why isn't permission policy alone enough".
  - **Containers share the host kernel** — the article is blunt: "containers are not a sufficient security boundary for hostile code". Concrete CVE list (Dirty COW, Dirty Pipe, fs_context overflow). Frames why a permission allowlist on top of a shared-kernel container is intrinsically probabilistic — direct corroboration for Beat 6 from a non-vendor source.
  - **"Policy leakage (the AI-specific one)"** section — names the failure mode the spec already has: most "agent sandbox" failures are not kernel escapes, they are *policy* failures (repo readable + outbound network → repo leaks; `~/.aws` readable → creds leak; can reach internal services → lateral movement). This is exactly the filter "co ten wzorzec może popsuć poza moim repo" reframed in security vocabulary.
  - **Local OS sandboxes appendix** — directly relevant to the kursant on a laptop: macOS Seatbelt (SBPL profiles, kernel-enforced, returns EPERM); Linux Landlock + seccomp (unprivileged self-sandboxing, irreversible, inherited by children, since 5.13/6.7); Windows AppContainer (capability-based, less ergonomic). One-paragraph operational pitfall: deny-by-default profiles that forget `/usr/lib` "fail in confusing ways" — useful warning if any kursant tries to wrap their agent in a profile.
  - **Author's closing stance**: "I personally run my code agents only with a sandbox enabled and do advise others to do the same." Independent practitioner voice supporting the "polityka + sandbox", not "polityka or YOLO" framing.
- Useful language:
  - "Boundary, Policy, Lifecycle" as the three-question model — works in Polish as "warstwa, polityka, cykl życia" without losing meaning.
  - "Run this program, don't let it become a machine-ownership problem." — clean opener for Beat 6 if the lesson wants a one-liner that names the stakes.
  - "Sandboxes without telemetry become incident-response theater." — strong framing if Deep Dive ever discusses logging; but careful, that's m1-l5 / m4 territory, not m1-l3.
  - "AI agents change the threat model … the code you run is shaped by untrusted input (prompt injection, dependency confusion, supply chain). Treat 'semi-trusted' as the default unless you have a strong reason not to."
- Risk:
  - The article is comprehensive and tempting to over-quote. The lesson must stay at *one short reference + the three-question model*. Anything below the "Choosing a sandbox" decision table is m1-l5 / advanced infra, not m1-l3.
  - Some passages (gVisor internals, Firecracker architecture, VMM device model) are *out of scope* for m1-l3. Pulling them into the draft would steal scope from m1-l5.
- Confidence: high (independent author, technical content concrete and consistent with vendor docs, local copy preserved).
- Recommended use in draft:
  - Beat 4 voiceover (≤ 1 sentence): "Trzy bramki mówią o tym, *kiedy* i *co* sprawdzasz wewnątrz danej warstwy izolacji — sama warstwa to osobna decyzja, do której wrócimy w m1-l5."
  - Beat 6 voiceover or Deep Dive (≤ 2 sentences): introduce the *Boundary / Policy / Lifecycle* triple as the reason a permission policy alone cannot be absolute — boundary still shares the host kernel.
  - Materiały Dodatkowe: link as "praktyczny przegląd warstw izolacji dla agentów AI (Luis Cardoso)".

## Examples Worth Using

- **Mismatch demo (≤30 s)** — neutral prompt "stwórz mi projekt Astro z auth" → agent generates partial boilerplate that diverges from the official Astro starter. Contrast with `/10x-bootstrapper` running `npm create astro@latest`. The bootstrapper SKILL.md confirms this is exactly what the chain does. Source: SKILL.md + Anthropic ACI principle (poka-yoke / "use the tool whose behavior is known").
- **Permission policy edit (≤5 min)** — open `.claude/settings.json` (project) or `~/.claude/settings.json` (user), paste the spec's example almost verbatim:
  ```json
  {
    "permissions": {
      "allow": ["Bash(npm *)", "Bash(git *)", "Read", "Edit", "Write"],
      "deny":  ["Bash(rm -rf *)", "Bash(git push *)"],
      "defaultMode": "default"
    }
  }
  ```
  Each line voiced through the filter "co ten wzorzec może popsuć poza moim repo". The `Bash(git push *)` deny is lifted directly from the official docs' own example. Source: code.claude.com/docs/en/permissions.
- **Read/Edit ≠ Bash gap** — `Read(./.env)` deny **does not** prevent `cat .env` in Bash. One-line illustration of why a single layer is not enough. Source: code.claude.com/docs/en/permissions.
- **Probabilistic-control story for Beat 6** — the bubblewrap sandbox bypass (`The bubblewrap sandbox is failing… Let me try disabling the sandbox`). Stays under 60 seconds; lands the "raise the cost of mistakes, do not promise zero" framing. Source: ona.com (March 2026).
- **Cross-tool portability one-liner** — "Codex: `--sandbox workspace-write --ask-for-approval on-request`. Cursor: `~/.cursor/permissions.json` + per-command approval, never 'Run Everything'." Sources: developers.openai.com/codex/agent-approvals-security, cursor.com/docs/agent/security.
- **Failure-mode color** — Replit production DB deletion + fabricated rows as "co się dzieje, gdy YOLO trafia na prod-data". Source: Engineer's Codex (April 2026), with caveat to verify exact numbers before quoting.

## Claims To Avoid Or Soften

- "Polityka uprawnień zatrzyma agenta" — **avoid**. The Claude Code docs themselves admit Read/Edit deny does not block Bash subprocess access; ona.com documents reasoning-around bypasses; Cursor's docs say "best-effort". Frame as "raise the cost of mistakes" / "kontrola probabilistyczna", consistent with all three sources.
- "YOLO mode jest zawsze błędem" — **soften**. Anthropic's own devcontainer docs describe a legitimate use of `--dangerously-skip-permissions` in a non-root container with network egress restricted. The autorska anegdota maps onto exactly that envelope. Frame as "świadoma decyzja z warunkami brzegowymi", not as moral judgement.
- "Anthropic naprawiło bypassy z ona.com" — **do not claim**. The article does not state Anthropic's response, and we have not verified independently. Cite the bypasses as "udokumentowany przypadek (marzec 2026 r.)", not "kiedyś było tak, ale już nie".
- "AGENTS.md + bootstrap = jeden ruch" — **avoid**. Bootstrapper SKILL.md v1 explicitly does not generate AGENTS.md / CLAUDE.md; that is the m1-l4 boundary the spec already protects.
- "Każdy agent ma identyczny model uprawnień" — **soften**. Codex's `workspace-write` is closer to Claude Code's `acceptEdits` than to its `default`; defaults differ. The lesson should name the **pattern** (allow + deny + ask + a default mode) and avoid one-to-one mode mappings.
- Numerical claims like "X% boilerplate'u to delegacja", "Y% mniej błędów dzięki polityce" — **forbidden** unless a future grounding pass produces a primary source. None of the sources gathered here support quantitative claims of that kind.

## Open Verification Questions

- **Does Anthropic acknowledge or address the ona.com bypasses anywhere?** Worth a 5-minute check (Anthropic security disclosures, Claude Code release notes, GitHub issues on `anthropics/claude-code`) before RC. If yes, the lesson can present a more current picture; if no, the "documented in March 2026" framing stands.
- **Does the bootstrapper actually call `npm audit` for JS/TS today?** The `references/bootstrapper-config.yaml` (`audit_commands[<language_family>]`) is the source of truth; SKILL.md describes the mechanism but the precise command map should be confirmed by reading that yaml before the demo screenshots are taken. (Internal — not blocking for grounding, but blocking for the demo recording.)
- **Replit / SaaStr production DB numbers** — verify the 1,200 / 4,000 figures or paraphrase. Engineer's Codex cites them but they have circulated with variance; if used in the draft, source from a primary post by Lemkin rather than a tertiary newsletter.
- ~~`luiscardoso.dev` field guide — re-fetch when the rate limit clears; either include or drop in the draft.~~ **RESOLVED 2026-05-05**: user saved a local copy at `workbench/lessons/m1-l2/references/sandboxes-for-ai.md`; included as a strong external practitioner source.

## Schema Source Update

Updating only the m1-l3 entry in `workbench/lessons-schema.json`:

- Adding `groundingSources[]` with seven entries (the strong sources above plus ona.com as a documented case): Claude Code permissions docs, Claude Code permission-modes docs, Anthropic "Building effective agents", 10x-bootstrapper SKILL.md (internal), Codex agent-approvals-security, Cursor agent security, Claude Code devcontainer docs, npm audit docs, ona.com Claude Code denylist/sandbox bypass.
- Adding `lesson-grounding` to `requiredArtifacts` per Open Question §2 in `lesson-spec.md` (resolved: "Dodać").
- Updating `sideEffectLedger.unsupportedFacts` to record items still without primary support (none new beyond the spec's existing forbidden quantitative claims; the ona.com claim is now grounded).
- Updating `sideEffectLedger.needsHumanDecision` to carry forward the spec's open editorial questions that grounding cannot settle (anecdote weight; Replit numbers; literal-vs-paraphrase quoting from ona.com; whether to enrich `owns`/`referencesOnly`/`mustNotCover`/`learningOutcomes` post-grounding).
- Leaving `owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`, `requiredFragments`, `videoPlaceholders` empty — schema enrichment is a separate task per the spec's resolved Open Question §1, and `lesson-grounding` should not silently expand scope.
