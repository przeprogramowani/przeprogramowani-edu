# Lesson Spec: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym

> **Source-of-truth note:** this spec is the editorial contract for drafting, editing and review. Treat `lesson-grounding.md` and `additional-notes.md` as evidence and reference material, not as the lesson structure. The current `m5-l5` object in `lessons-schema.json` records the ownership boundaries, learning outcomes, grounding sources and side-effect ledger used by this draft.

## Editorial Decisions

The lesson's job in human terms: teach the learner how to let agent work continue when they are away from the desk without pretending control disappeared. Control moves from live supervision into setup, monitoring, and review: choose the right remote-control mode, configure the environment so the agent can actually run, monitor the task from a phone when useful, and judge the result later with clear boundaries.

| Decision | Final choice | Drafting consequence |
|---|---|---|
| Narrative spine | Control moves to review time | Every section should answer "where does human control happen now?" rather than listing tools. |
| Organizing principle | Control moment | Compare modes by real-time remote control, kick-off-and-monitor, or after-the-fact scheduled review. |
| Archetype depth | Own all three archetypes | SSH/tmux, Happy, and managed cloud sandboxes are all legitimate modes; none becomes a full tutorial. |
| Happy stance | Serious option, not course default | Present local compute + encrypted relay + phone takeover, with a third-party trust evaluation caveat. |
| Cloud comparison | Tool-agnostic model first, vendor details second | Teach setup script, network policy, MCP, cache, and secrets as transferable knobs before Anthropic/Codex differences. |
| Cloudflare Agents stance | Async runtime option, not remote coding sandbox | Include as a Deep Dive / references-only path for durable agents, schedules, Workflows, and loop-connected async work; do not turn Core into a build-on-Cloudflare tutorial. |
| Demo anchor | Cloud sandbox config plus phone monitoring | The demo proves remote async operation and bridges from m5-l4's committed `.mcp.json`. |
| Loops/routines | Main pillar, bounded to m5-l5's slice | Own `/loop` and routines as unattended control modes; Ralph and `/goal` stay back-pointers to m2-l5. |
| Security placement | After sandbox config, before phone/loop payoff | Use setup/network friction to explain why isolation enables walking away. |
| Failure mode | Control did not disappear, it moved | Green run, cost, security, scope, and review risk all resolve through better setup/review boundaries. |
| Practical task | Run a real remote/cloud agent task | Include access-gate fallback later, but the default task should be real delegation, not only reflection. |
| Schema update | Recorded in schema | Keep future schema edits scoped to the `m5-l5` lesson object and aligned with this spec. |

## Stay / Deep Dive / Materials / Cut Map

| Treatment | Material | Boundary for drafting |
|---|---|---|
| **Core** | Control-moment model | The central mental model: real-time remote control vs kick-off-and-monitor vs scheduled review. |
| **Core** | Three archetypes: SSH/tmux, Happy, managed cloud sandbox | Use a comparison table and short explanatory beats. SSH/tmux is a practitioner baseline; Happy is local compute via relay; cloud sandbox is true managed execution. |
| **Core** | Tool-agnostic cloud config | Setup script, network policy, MCP via committed config, cache, and secrets are the owned operational skill. |
| **Core** | Isolation as autonomy enabler | Explain why filesystem + network isolation makes "walk away" safer; avoid a broad security lecture. |
| **Core** | Phone monitoring | Show how control moves to monitoring/steering and review, using Claude mobile app or Happy as examples. |
| **Core** | `/loop` and routines | Treat as unattended control modes. Cover review criteria and failure risk; do not re-teach Ralph or `/goal`. |
| **Core** | Failure mode | Green run != task success; network-blocked retries, runaway cost, preview gates, and broken branches are guardrails, not fear theater. |
| **Deep Dive** | Extra product details | Installed tools, resource ceilings, plan gates, cache expiry, exact network presets, and command syntax go deeper only after pre-draft verification. |
| **Deep Dive** | Advanced source notes | Vendor-specific quirks, managed-agents API details, and longer loop lineage belong below the main spine. |
| **Deep Dive** | Cloudflare Agents + Workflows | Interesting option for custom async work: durable agent identity/state, scheduled tasks, recoverable execution, Workflows, MCP/tools, and loop-style polling or callbacks. Keep it as "build your own durable async agent runtime", not as a fourth Core remote-coding archetype. |
| **Deep Dive** | SSH/tmux implementation specifics | Mention the pattern in Core, but keep terminal apps, mosh, ntfy, VPS hardening, and phone-terminal setup out of the main path. |
| **Deep Dive** | Longer Ralph lineage | If needed, credit Ralph as ancestor and discuss caveats in Deep Dive; Core only points back to m2-l5. |
| **Materials only** | Full docs/source list | Keep exhaustive source links in `lesson-grounding.md` / `additional-notes.md` / `Materiały dodatkowe`, not in Core prose. |
| **Cut or avoid** | First-party Anthropic "Remote Control" | Do not claim it. Grounding refuted this; verified mobile paths are Happy and Claude Code on the web/mobile monitoring. |
| **Cut or avoid** | Re-teaching `/goal`, Ralph, or worktree mechanics | m2-l5 owns these. Use only contrast/back-pointer language: m2-l5 = parallel at desk; m5-l5 = remote/away. |
| **Cut or avoid** | Product survey sprawl | Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View, and VS Code Agents are m2-l5's orchestrator roundup, not this lesson. |

## Schema Context

- Course: 10xdevs-3
- Module: m5 — AI-Native Teamwork
- Position: moduleOrder 5 / globalOrder 25 — **module finale**
- Depends on: m5-l4 (Shared AI Registry: skille, komendy i reguły dla zespołu)
- Prepares for: none (closes the module)
- Grounding: `workbench/lessons/m5-l5/lesson-grounding.md` plus `additional-notes.md`; use them as evidence, not structure. Cloud/mobile/loop product details are time-sensitive and require pre-draft verification.

## Prework Continuity

- **Assume [2.1]**: learner knows IDE, terminal and cloud agents are different operating environments with mobility, control, parallelism and background-work tradeoffs. This lesson does not repeat the comparison; it teaches how to operate the remote/cloud side.
- **Assume [2.4]**: learner has already heard that agent-native/background work needs clean repo state, bounded scope, tests, review, secrets discipline and cost awareness. This lesson turns those warnings into setup/review mechanics for work done away from the desk.
- **Assume [3.3]**: learner knows Isolate, external memory and fresh-context work. This lesson applies those ideas to cloud sandboxes, loops and scheduled runs where filesystem/network boundaries decide what the agent can safely do.
- **Assume [1.2]**: learner has harness/permissions vocabulary. This lesson deepens the harness idea by showing how the control layer changes when execution moves from local interactive work to remote control, managed sandboxes or scheduled loops.

## Lesson Job

This is the "Innovate" capstone of the teamwork module. m2-l5 showed how to scale work while still sitting at the desk and managing parallel work. m5-l5 moves control away from the desk: the learner chooses when control should happen, configures the remote/cloud environment before the task starts, monitors only when needed, and takes responsibility again at review time. The lesson is not "more agent tools"; it is a practical contract for delegating bounded work when the laptop can be closed, the phone is the control surface, or the next check happens on a schedule.

## Thesis

Gdy zadanie jest ograniczone, kontrola nie musi dziać się w czasie rzeczywistym. Wybierasz moment kontroli, konfigurujesz sandbox i granice sieci/sekretów przed startem, delegujesz pracę agentowi, a odpowiedzialność wraca do Ciebie w monitoringu i review.

## Learning Outcomes

- Learner can compare SSH/tmux, Happy and managed cloud sandboxes by **control moment**: real-time remote control, kick-off-and-monitor, or review after the fact.
- Learner can configure a managed cloud sandbox using a transferable model: setup script, network policy, MCP/config, cache, secrets and pre-installed tool assumptions.
- Learner can explain why filesystem and network isolation are autonomy enablers, not only security constraints.
- Learner can delegate a bounded task, monitor or steer it from a phone when needed, and review the result against explicit success criteria.
- Learner can use `/loop` or routines as scheduled/recurring control modes while naming their failure modes: green run != task success, loops can burn budget, and unattended work still needs review.

## Audience Starting Point

A working developer who has run agents interactively at their desk and has seen m2-l5's parallel-at-desk model. They know cloud/background agents exist, but they may still treat "remote agent" as one fuzzy category. Likely misconceptions: Happy means cloud compute; a managed sandbox is just their local terminal elsewhere; walking away is reckless by definition; loops are only Ralph hype; a green scheduled run means the work succeeded. Their real worry is losing control, leaking secrets, or waking up to a broken branch and a big bill.

## Behavioral Change

The learner stops treating "I have to be at my machine watching it" as a constraint — they pick a remote mode, configure the sandbox once, delegate the bounded work, and reclaim their attention (and mobility) while keeping control at review time.

## Owned Concepts (provisional)

- **The three remote-execution archetypes as a task/audience-driven choice:** SSH+tmux (own everything, zero new vendor) / Happy (local compute, one-keypress phone takeover, E2E relay) / managed cloud sandbox (true fire-and-forget). Pick by control, mobility, setup cost, security — one decision table.
- **Cloud-sandbox configuration as the deep skill:** setup script (root, Ubuntu 24.04, cached, keep <~5 min) for deps; MCP loaded only from committed `.mcp.json`; network levels (None/Trusted/Full/Custom on Anthropic; Off/On + allowlist on Codex); the "internet off during agent phase, on during setup" asymmetry.
- **The remote/sandbox security model:** filesystem + network isolation are both required; isolation is what *enables* unattended autonomy (the link, not a tangent) — vivid anchor: a non-isolated agent could exfiltrate SSH keys.
- **First-party autonomous loops as the unattended enabler:** `/loop` (self-pacing or recurring interval) + scheduled routines (cron/API/GitHub triggers) — the "delegate-and-walk-away" extension m2-l5 does not cover. Green run ≠ success.
- **Delegate-and-monitor-from-phone as the async workflow:** kick off a bounded task → close the laptop → monitor/steer from the Claude mobile app or Happy → review the PR later. Control shifts to review time, not real time.

## References Only (provisional)

- Ralph technique + `/goal` delegation — **owned by m2-l5**; named once as the loop ancestor, then point back. Not re-taught.
- git worktrees / parallel-at-desk — **m2-l5**; used only as the explicit contrast ("tam równolegle przy biurku; tu zdalnie").
- managed-agents SDK/API — **m5-l2 owns SDK**; one pointer as "the programmatic face of the same sandbox model."
- Cloudflare Agents / Workflows — references-only unless a later approved Deep Dive claims it. Useful as a "build your own durable async agent runtime" option with persistent agent state, schedules, recoverable execution, Workflows, and MCP/tools; not the same thing as Claude Code on the web or Codex Cloud running a coding task for the learner.
- Shared AI artifacts / `.mcp.json` as a distributed artifact — **m5-l4**; assumed, referenced when configuring sandbox MCP.

## Must Not Cover

- git worktree mechanics, independent-slice selection, the multi-agent orchestrator roundup (Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View, VS Code Agents) — all m2-l5.
- Re-teaching Ralph or `/goal` from scratch — m2-l5.
- Building an agent from the SDK — m5-l2.
- Building a Cloudflare Agents app, Durable Object architecture, or Workflows implementation — mention as optional infrastructure path only, not a tutorial.
- Review standards / DoD depth — m5-l3.
- A beginner cloud/IaC tutorial — cloud surfaces only as concrete config, gotchas, and cost lines, not an AWS/infra primer.
- Asserting a first-party Anthropic "Remote Control" mobile mode — refuted in grounding; does not exist.

## Required Example Or Demo

Two-part anchor (per user choice):
1. **Cloud-sandbox config payload (the deep artifact):** configure a Claude Code on the web (or Codex Cloud) environment for the course project — setup script installs deps, MCP declared in committed `.mcp.json`, network level chosen deliberately, and the Codex "internet off during agent phase" gotcha shown concretely.
2. **Delegate-from-phone walkthrough (the visceral async story):** kick off a bounded slice remotely, close the laptop, monitor/steer from the Claude mobile app or Happy, review the resulting PR later. The same task could even be one of the 10xCards slices from m2-l5's roadmap — now run remotely instead of at-desk (continuity, not duplication).

## Structural Logic Map

1. **Open — m2-l5 scaled work at the desk; this lesson moves control away from the desk.**
   - Question answered: "Czy to nie powtórka z m2-l5?"
   - Introduces: parallel-at-desk vs remote/away; control as the through-line.
   - Depends on: m2-l5 awareness, prework [2.1]/[2.4].
   - Sets up: choosing the control moment.
   - Risk: mentioning worktrees too much. Keep them as contrast only.

2. **Control moment table — real-time remote, kick-off-and-monitor, scheduled review.**
   - Question answered: "Kiedy człowiek kontroluje pracę?"
   - Introduces: the lesson's decision axis before any tool names dominate.
   - Depends on: beat 1.
   - Sets up: three archetypes as examples of the same axis.
   - Diagram opportunity: yes — table with control moment, compute location, trust surface, setup cost and best-fit task.
   - Risk: turning the table into a product survey. Keep it task-first.

3. **Archetype 1 — SSH/tmux and Happy as real-time remote control.**
   - Question answered: "Jak sterować agentem zdalnie, gdy compute zostaje mój?"
   - Introduces: SSH/tmux as zero-new-vendor baseline; Happy as local compute + encrypted relay + phone takeover.
   - Depends on: control-moment table.
   - Sets up: contrast with cloud compute.
   - Risk: SSH/mosh/Happy tutorial sprawl. One short explanation each, plus trust caveat for Happy.

4. **Archetype 2 — managed cloud sandbox as kick-off-and-monitor.**
   - Question answered: "Co zmienia się, gdy agent działa w zarządzanym sandboxie?"
   - Introduces: fresh managed environment, repo cloned, laptop can close, mobile monitoring/review later.
   - Depends on: beat 2.
   - Sets up: the need for environment configuration.
   - Risk: dumping installed-tool/resource lists. Keep exact product facts in Deep Dive or materials unless needed for the demo.

5. **Tool-agnostic sandbox configuration model — setup, network, MCP, cache, secrets.**
   - Question answered: "Co muszę przygotować, zanim agent ruszy?"
   - Introduces: the transferable knobs that matter across vendors.
   - Depends on: beat 4; bridges from m5-l4's committed `.mcp.json`.
   - Sets up: vendor differences as examples, not separate lessons.
   - Diagram opportunity: maybe — session start -> setup/cache -> agent phase -> review.
   - Risk: cloud/IaC tutorial drift. Stay at operational config for agent execution.

6. **Anthropic and Codex differences as examples of the same model.**
   - Question answered: "Dlaczego ta sama konfiguracja wygląda inaczej w różnych narzędziach?"
   - Introduces: Anthropic network/setup/MCP model and Codex setup-vs-agent internet behavior as concrete examples of setup/network/cache differences.
   - Depends on: beat 5.
   - Sets up: restrictions as a security/autonomy feature.
   - Risk: blending vendor facts. Label each example clearly and defer exact version/tier/resource claims to verification.

7. **Isolation — why restrictions enable walking away.**
   - Question answered: "Czy ograniczenia sandboxa przeszkadzają, czy chronią?"
   - Introduces: filesystem + network isolation; restrictions prevent exfiltration and reduce unattended blast radius.
   - Depends on: beats 5-6.
   - Sets up: the phone-monitoring demo and loops.
   - Risk: compliance/security lecture. Keep it tied to the concrete "agent cannot fetch this / agent cannot leak that" experience.

8. **Demo — cloud sandbox config plus phone monitoring.**
   - Question answered: "Jak to wygląda w jednym realnym przebiegu?"
   - Introduces: choose bounded task -> configure environment -> start remote/cloud run -> close laptop -> monitor/steer from phone -> review output later.
   - Depends on: beats 3-7.
   - Sets up: recurring/scheduled variants.
   - Risk: video/text mismatch. The demo must prove the text, not add new product claims.

9. **Archetype 3 — `/loop` and routines as scheduled or recurring control.**
   - Question answered: "Co jeśli kontrola ma wracać co jakiś czas, nie teraz?"
   - Introduces: `/loop` and routines as first-party unattended control modes; Ralph and `/goal` are ancestor/back-pointer only.
   - Depends on: isolation and review-time responsibility.
   - Sets up: failure mode.
   - Risk: stealing m2-l5. Keep `/goal`, Ralph and worktree-based `/batch` out of the owned explanation.

10. **Failure mode — control did not disappear, it moved.**
    - Question answered: "Co może pójść źle, gdy mnie nie ma?"
    - Introduces: green run != success; network-blocked retries; token/cost burn; preview/plan gates; broken branch after unattended work.
    - Depends on: all execution modes.
    - Sets up: final capstone takeaway.
    - Risk: fear list. Frame each risk as a review/setup criterion.

11. **Close — module-level takeaway.**
    - Question answered: "Co teraz umiem jako AI-native team?"
    - Introduces: team standards + shared artifacts + team agents + remote/async execution = complete teamwork loop.
    - Depends on: whole module.
    - Risk: inspirational fog. End with the practical sentence: choose the control mode, configure the sandbox, delegate bounded work, review later.

## Failure Mode To Disarm

The learner fires off a long unattended task (cloud or loop), assumes "it ran = it worked," and either trusts a green-but-failed routine, wakes up to a broken branch, or burns tokens because the agent looped trying to reach a network-blocked package registry. The lesson exposes this by making "green ≠ success," the install-in-setup rule, and the cost ceiling explicit *before* celebrating the convenience.

## Suggested Structure

1. **Intro prose under H1, no `## Wstęp` heading** — m2-l5 scaled work at the desk; this lesson moves control away from the desk.
   - `Previous -> this -> next: parallel-at-desk -> control moment -> three archetypes.`
   - Must not re-teach worktrees, `/goal`, Ralph or background-agent warnings.

2. **Main content section: "Kiedy kontrolujesz pracę agenta?"** — control-moment table: real-time remote, kick-off-and-monitor, scheduled review.
   - Core beats: 1-2.
   - Visual: decision table.

3. **Main content section: "Tryb 1: zdalna kontrola lokalnego agenta"** — SSH/tmux baseline and Happy as local-compute phone control.
   - Core beat: 3.
   - Keep implementation specifics for Deep Dive.

4. **Main content section: "Tryb 2: sandbox w chmurze"** — managed cloud sandbox plus transferable setup/network/MCP/cache/secrets model.
   - Core beats: 4-6.
   - Place optional **[video: sandbox-config]** here if text needs a short walkthrough of setup script, committed `.mcp.json`, network policy and cache.

5. **Main content section: "Dlaczego ograniczenia pozwalają odejść od biurka"** — isolation and the phone-monitoring demo.
   - Core beats: 7-8.
   - Place primary **[video: delegate-from-phone]** here after the isolation explanation, before loops.

6. **Main content section: "Tryb 3: pętle i routines"** — `/loop` and routines as scheduled/recurring control, plus review criteria.
   - Core beat: 9.
   - Ralph and `/goal` appear only as one back-pointer to m2-l5.

7. **Main content section: "Kontrola nie zniknęła, tylko zmieniła miejsce"** — failure mode and module close.
   - Core beats: 10-11.
   - Summarize: choose the control mode, configure the sandbox, delegate bounded work, review later.

8. **`## 🧑🏻‍💻 Zadania praktyczne`** — task should ask learner to choose one bounded task, choose control mode, define setup/network/MCP needs, run if access allows, then review against criteria.

9. **`## Odbierz swoją odznakę`** — standard badge section from `references/lesson-structure.md`.

10. **`## 🔎 Deep Dive`** — product details, SSH/tmux specifics, Cloudflare Agents + Workflows as durable async runtime option, managed-agents API as references-only, longer Ralph lineage if needed.

11. **`## 📚 Materiały dodatkowe`** — official docs and strongest source links from grounding, plus Cloudflare Agents docs if the Deep Dive keeps that option.

## Video Placeholders

- **[video: delegate-from-phone]** — primary video, placed after the isolation/config explanation in "Dlaczego ograniczenia pozwalają odejść od biurka". Screencast: choose bounded task, start a Claude Code on the web or equivalent cloud sandbox run, close laptop, monitor/steer from phone, then review the resulting output/PR. It must not introduce product behavior absent from the text.
- **[video: sandbox-config]** — optional support video, placed inside "Tryb 2: sandbox w chmurze" only if the setup/config model is too dense in prose. It should show setup script, committed `.mcp.json`, network policy, cache and secrets at concept level; no vendor claim should appear here unless it was verified for the draft.

## Draft-Ready Outline

Use this as the drafting handoff. The headings below describe section intent; the final draft can rename H2/H3 headings for Polish flow, but must preserve the order and boundaries.

1. **`# Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym`**
   - H1 only. No frontmatter assumptions in this workbench file.

2. **Intro prose, no `## Wstęp` heading**
   - Job: connect from m2-l5 without re-teaching it. m2-l5 scaled parallel work at the desk; this lesson moves control away from the desk.
   - Must land the one-sentence promise: choose the control mode, configure the sandbox, delegate bounded work, review later.

3. **Core section: `Kiedy kontrolujesz pracę agenta?`**
   - Explain the control-moment model before naming too many tools.
   - Include a table with three rows: real-time remote control, kick-off-and-monitor, scheduled/recurring review.
   - Each row should include: where compute runs, who/what is trusted, best-fit task, main risk, review point.

4. **Core section: `Tryb 1: zdalna kontrola lokalnego agenta`**
   - Cover SSH/tmux as the "you own the box" baseline and Happy as local compute with phone takeover via encrypted relay.
   - Keep it shallow: enough to distinguish local remote control from cloud execution, not enough to become an SSH/Happy tutorial.
   - Include Happy trust caveat: third-party relay, evaluate before team adoption.

5. **Core section: `Tryb 2: sandbox w chmurze`**
   - Explain what a managed cloud sandbox changes: environment is remote, repo is prepared there, laptop can close, review happens later.
   - Teach the transferable sandbox setup model: setup script, network policy, MCP/config, cache, secrets, pre-installed tool assumptions.
   - Use Anthropic and Codex as examples of the same model, not as two separate product chapters.
   - Optional embed: `[video: sandbox-config]`.

6. **Core section: `Dlaczego ograniczenia pozwalają odejść od biurka`**
   - Connect setup/network friction to safety: the same restrictions that block a package install can also block exfiltration.
   - Explain filesystem + network isolation as autonomy enablers.
   - Primary embed: `[video: delegate-from-phone]`.

7. **Core section: `Tryb 3: pętle i routines`**
   - Cover `/loop` and routines as scheduled/recurring control modes.
   - One back-pointer only: Ralph and `/goal` are already introduced in m2-l5.
   - Include review criteria: what the run should prove, when to stop it, what counts as failure.

8. **Core section: `Kontrola nie zniknęła, tylko zmieniła miejsce`**
   - Disarm the failure mode: green run != success, network-blocked retries can burn budget, preview/plan gates can block execution, unattended work still needs review.
   - Close the module: standards + shared artifacts + team agents + async/remote execution.

9. **`## 🧑🏻‍💻 Zadania praktyczne`**
   - Use the practical task spec below.

10. **`## Odbierz swoją odznakę`**
    - Use the standard badge paragraph from `references/lesson-structure.md`.

11. **`## 🔎 Deep Dive`**
    - Topics to consider:
      - Exact product details after verification: tiers, installed tools, resource limits, cache windows, network presets.
      - SSH/tmux/mosh implementation notes.
      - Cloudflare Agents + Workflows as a durable async runtime for teams building their own agent loop.
      - Managed-agents API as the programmatic face of the sandbox model.
      - Longer Ralph lineage and why Core does not re-teach it.

12. **`## 📚 Materiały dodatkowe`**
    - Use verified official docs first. Include weak/practitioner links only with their role clearly described.
    - Candidate groups: Claude Code on the web, Claude Code routines, OpenAI Codex Cloud environments/internet/MCP, Happy, Cloudflare Agents, Cloudflare Workflows, Anthropic sandboxing, selected Ralph/loop references.

## Practical Task Specification

Primary task: run one real remote/cloud agent task, then review the result.

Required steps for learner:

1. Pick one bounded task that can be evaluated later, such as documentation cleanup, test-plan update, small dependency/setup fix, or a narrow backlog slice. Avoid tasks that require live product decisions or secret-heavy production access.
2. Choose the control mode:
   - SSH/tmux or Happy if compute should stay on the learner's machine.
   - Managed cloud sandbox if the learner wants kick-off-and-monitor execution.
   - `/loop` or routine if the task should recur or self-check on a schedule.
3. Write a runbook before execution:
   - goal and stop condition,
   - files/areas in scope,
   - setup requirements,
   - network requirements,
   - MCP/config requirements, especially committed `.mcp.json` where relevant,
   - secrets/access limits,
   - review checklist.
4. Run the task if account access, plan tier and preview gates allow it.
5. Monitor or steer from phone only if the chosen control mode needs it.
6. Review output against the criteria, not against "the agent finished".
7. Record what would need to change before using this mode in a team setting.

Fallback if access is blocked by preview/plan gates:

- The learner writes the same runbook and marks each blocked step as `wykonane`, `zablokowane przez dostęp`, or `do sprawdzenia przed wdrożeniem`.
- The learner still chooses the control mode, defines setup/network/MCP needs, and writes the review checklist.
- The fallback should not become a theoretical essay; it is a dry-run operational plan.

## Video Map

- **Primary video: cloud sandbox config plus phone monitoring**
  - Placement: after the isolation section, before loops.
  - Shows: bounded task selection, setup/network/MCP choices, remote/cloud run start, laptop-away moment, phone monitoring/steering, review of output.
  - Must prove the text's thesis: control moved to setup, monitoring and review.

- **Optional supporting footage: Happy local-agent phone takeover**
  - Placement: Deep Dive or short supporting clip near "Tryb 1".
  - Shows: local compute stays on the developer machine, phone takes over through Happy, return to desktop.
  - Must include third-party trust caveat if surfaced in the lesson body.

- **Optional supporting footage: routine or `/loop` inspection**
  - Placement: near "Tryb 3".
  - Shows: schedule/loop configuration, run status, review criteria, and the "green != success" caveat.
  - Must not re-teach Ralph or `/goal`.

Video/text rule: video must not introduce claims absent from the text. Any new product behavior discovered while preparing video goes back to `lesson-grounding.md` first.

## Schema Contract Recorded

The current `m5-l5` object in `lessons-schema.json` records this lesson contract.

```json
{
  "status": "drafted",
  "owns": [
    "Control-moment model for async/remote agent work: real-time remote control, kick-off-and-monitor, scheduled/recurring review",
    "Three remote-execution archetypes as a task-driven choice: SSH/tmux baseline, Happy local-compute phone control, managed cloud sandbox",
    "Transferable managed-cloud sandbox configuration model: setup script, network policy, MCP/config, cache, secrets, pre-installed tool assumptions",
    "Isolation as autonomy enabler: filesystem and network restrictions make unattended work safer instead of merely slowing the agent down",
    "Delegate-and-monitor-from-phone workflow for bounded tasks, ending in explicit review criteria",
    "`/loop` and routines as scheduled or recurring control modes with review-time responsibility and failure awareness",
    "Failure mode: control did not disappear; green run, cost, security, access gates and review risk moved into setup and review boundaries"
  ],
  "referencesOnly": [
    "Ralph technique and `/goal` delegation as ancestor/back-pointer material already owned by m2-l5",
    "git worktrees, independent slice selection and parallel-at-desk workflow owned by m2-l5",
    "multi-agent orchestrator roundup (Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View, VS Code Agents) owned by m2-l5",
    "managed-agents SDK/API as the programmatic face of sandboxing; SDK-building depth owned by m5-l2",
    "Cloudflare Agents / Workflows as an optional durable async runtime path for teams building their own agent loop; not a Core remote-coding sandbox",
    "Shared AI artifacts and committed `.mcp.json` as distribution concepts owned by m5-l4",
    "Prework [2.1], [2.4], [3.3] and [1.2] as assumed vocabulary, not repeated theory"
  ],
  "mustNotCover": [
    "Teaching git worktree mechanics or independent-slice selection",
    "Re-teaching Ralph or `/goal` from scratch",
    "Building an agent from an SDK or implementing managed-agents API flows",
    "Building a Cloudflare Agents app, Durable Object architecture or Workflows implementation tutorial",
    "Repeating the m2-l5 product/orchestrator survey",
    "Review standards and Definition of Done depth from m5-l3",
    "Beginner cloud/IaC tutorial",
    "Asserting first-party Anthropic Remote Control mobile mode unless official docs verify it before drafting",
    "Exact product tiers, pricing, resource limits, installed tool lists or cache windows without pre-draft verification"
  ],
  "learningOutcomes": [
    "Learner can compare SSH/tmux, Happy and managed cloud sandboxes by control moment, compute location, trust surface, setup cost and review point.",
    "Learner can configure a managed cloud sandbox using a transferable setup/network/MCP/cache/secrets model before starting a bounded task.",
    "Learner can explain why filesystem and network isolation enable safer unattended autonomy.",
    "Learner can delegate a bounded task, monitor or steer it from a phone when useful, and review output against explicit criteria.",
    "Learner can use `/loop` or routines as scheduled/recurring control modes while recognizing green-run, cost, access-gate and review failure modes."
  ]
}
```

## Bridge In

From m5-l4: "Masz już wspólne artefakty AI dla zespołu (skille, reguły, `.mcp.json`). Ale dotąd zakładaliśmy, że agent działa tam, gdzie Ty — w Twoim terminalu, przy Twoim biurku." Plus prework [2.1]/[2.4]: "Słyszałeś o agentach w chmurze i w tle — teraz nauczymy się nimi *operować*." Explicit contrast with m2-l5: parallel-at-desk → remote-and-away.

## Bridge Out

Module finale — no next lesson. Close the "AI-Native Teamwork" module: the team now has standards, shared artifacts, its own agents, and the ability to run them remotely/async. Frame the durable takeaway (mode-by-task, isolation-enables-autonomy, control-at-review-time) as what survives the fast tool churn, and hand off to the learner's own practice rather than a next lesson.

## Open Questions

- **Re-verify before draft:** GA-vs-preview status and plan tiers at publish date (most time-sensitive); Codex `/goal` built-in-loop details against OpenAI changelog (currently SEO-blog + Brockman X quote); re-fetch the itnext Ralph critique (TLS error during grounding).
- **Cloudflare Agents placement:** user flagged Cloudflare Agents as an interesting async option. Current placement: Deep Dive / references-only path for durable async agents, schedules, Workflows, and loop-connected background work; keep exact platform limits out of learner-facing prose unless verified before publication.
- **SSH+tmux depth:** kept as the "own everything" archetype but unverified by primary source this pass — confirm the draft presents it as a known pattern, not a sourced spec.
- **Happy team-adoption stance:** how strongly to recommend a 3rd-party relay tool in a teamwork/security module — present-and-let-them-evaluate vs first-party-first. Lean: show it, pair it with the first-party path, flag the trust evaluation.

## Ready for Review

This spec was used as the editorial contract for the draft, review and polish passes.

What changed:

- The lesson spine is now "control moves to setup, monitoring and review", not a tool roundup.
- Core is organized around control moment: real-time remote control, kick-off-and-monitor, scheduled/recurring review.
- Drafting boundaries are explicit: m2-l5 keeps worktrees, `/goal`, Ralph and orchestrator surveys; m5-l2 keeps SDK/API implementation; m5-l4 keeps shared-artifact distribution.
- Cloudflare Agents / Workflows were added as a Deep Dive / references-only async runtime option, not as a Core remote-coding sandbox.
- The spec now contains a draft-ready outline, practical task, video map and recorded schema contract.

Still verification-gated:

- Claude Code on the web status, tiers, setup script behavior, network levels, `.mcp.json`, mobile monitoring, `--remote`, `--teleport`.
- Claude Code routines status, triggers, minimum interval, environment/network behavior and "green run" semantics.
- OpenAI Codex Cloud setup scripts, internet access during setup vs agent phase, MCP config and cache behavior.
- Happy repo/docs availability, local-compute architecture and relay/encryption wording.
- Cloudflare Agents / Workflows current docs, platform limits, schedule/recovery/workflow semantics and MCP/tools support.
- Any exact compute, resource, installed-tool, pricing, tier, cache or preview claim.

Schema update status:

- The `m5-l5` object in `lessons-schema.json` records the ownership boundaries, references-only boundaries, must-not-cover rules, learning outcomes, Cloudflare grounding addition and side-effect ledger.
- Future schema changes should stay scoped to `m5-l5` unless the curriculum sequence itself changes.

If approved, the next agent should:

1. Update only `m5-l5` in `lessons-schema.json`.
2. Parse/validate JSON and run `node scripts/lesson-context.mjs m5-l5`.
3. Confirm the context output shows the new ownership boundaries.
4. Start `lesson-draft` using `lesson-spec.md`, `lesson-grounding.md`, `additional-notes.md`, `references/prework.md` and `references/lesson-structure.md`.
5. Before drafting exact product behavior, complete the `Pre-draft Verification Checklist` in `lesson-grounding.md`.

## Side-Effect Ledger

New claims introduced: Direction A scope (three-archetype decision table; cloud-sandbox config as owned skill; isolation-enables-autonomy; `/loop`+routines as the m2-l5-complement). All trace to populated `groundingSources`.
New claims introduced in Phase 1 addendum: Cloudflare Agents / Workflows as a Deep Dive references-only async runtime option for durable state, scheduled/background work, recoverable execution, MCP/tools, and loop-connected callbacks/polling; source checked against official Cloudflare docs and landing page on 2026-06-12, but not yet added to schema `groundingSources`.
Claims removed: (none)
Neighboring lesson references changed: (none in schema; spec names m2-l5 as the contrast partner and m5-l2/m5-l4 as referencesOnly anchors)
Prework references used: [2.1] cloud/mobile axis, [2.4] background-agent discipline, [3.3] Isolate/external memory, [1.2] harness/permissions vocab
Prework concepts repeated intentionally: the existence of cloud/background agents ([2.1]/[2.4]) — referenced as known starting point, explicitly NOT re-taught
Potential duplicates: m2-l5 (Ralph/`goal`, worktrees, orchestrators) — fenced via Must Not Cover + back-pointer cap; m5-l2 (SDK) — referencesOnly
Unsupported facts: carried from grounding — no native Anthropic "Remote Control" (refuted); 84% prompt reduction (vendor self-report); SSH+tmux & Codex-`/goal` framing lack primary verification; preview/plan-gating; "loops trending this week" recency soften
Video/text mismatches: (none yet — video must not exceed draft claims)
Needs human decision: Happy team-adoption stance; pre-publish re-verification of preview status; recording tool and phone capture format
