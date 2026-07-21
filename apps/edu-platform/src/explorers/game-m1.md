# Moon 1 Missions — Agentic Environment

Moon 1 is the first off-ship exploration arc. The Odyssey lands near an abandoned Synaptit extraction site in the Main Belt — VOID's old industrial operation evacuated in a hurry during the Entropy attack. The site holds corrupted business records, sealed sub-stations, a fragmented crewmate memory module from Moreau's capsule, and a reserve uplink bay capable of reaching Earth HQ.

Dexo physically explores the site. Two regular quests resolve through on-site certification terminals, while the Navigator solves three Agentic Engineering tasks with Codex, Claude Code, Copilot, or another capable coding agent and submits them from Earth HQ. Each task maps to one course lesson, but — per `10x-vs-game.md` — the game does not duplicate course homework: it tests **transfer of the same competence to an isolated sandbox case**.

## Implemented quest profile

The production slice uses two regular in-game event quests and three Earth HQ API quests. M1L1 and M1L3 complete through map certification exams. M1L2 (EchoTrace), M1L4 (Moreau onboarding), and M1L5 (safe uplink) use `earthctl` and the plain module inputs in `10x-explorers-hq`.

The detailed task sections below preserve earlier simulator proposals as design history, not as the implemented HQ architecture. The actual secondary repository contains only Markdown, text, and CSV inputs. It supplies evidence and constraints, while the user's agent supplies the execution strategy, reusable capabilities, delegated review, and working artifacts. There are no repository-owned validators, runners, JavaScript, TypeScript, or custom scripts.

## Lesson → Task mapping

| Course lesson | Learning goal | In-game task |
|---|---|---|
| M1L1 — Od pomysłu do PRD: Metoda Sokratejska z Agentem | Distinguish business contract from technical leakage; recognize a hollow PRD as not implementable. | **Task 1 — Synaptit PRD Audit** |
| M1L2 — Od chatbota do Agenta: toolkit, skille i metaprompting | Package a repeatable agentic capability (skill) over an authenticated external endpoint. | **Task 2 — EchoTrace Skill** |
| M1L3 — AI-Powered Bootstrap: stack i bezpieczna praca z Agentem | Delegate to authoritative CLI, configure minimal allow/deny policy, read three execution gates. | **Task 3 — Boot the Abandoned Shaft Controller** |
| M1L4 — Agent Onboarding: Agents.md, AI Rules i feedback loops | Apply the inclusion test ("what can the model not know from pretraining"), iterate `failure-modes`, reset working memory. | **Task 4 — Wake Engineer Moreau** |
| M1L5 — Od localhosta na produkcję: CI/CD, MCP i CLI | Apply anti-bias lenses to an infrastructure decision, distinguish CLI from MCP operability, hold the agent/human authorization boundary. | **Task 5 — Beam the Odyssey Coordinates Home** |

---

## Task 1: Synaptit PRD Audit

Dexo investigates a corrupted product/business record left behind at the abandoned Synaptit extraction site. The PRD survived the Entropy attack but was poisoned: valid business decisions, vague assumptions, technical leakage, and unresolved gaps are interleaved without obvious cues.

The Navigator inspects the file from the HQ repository, classifies each line as *kept (business decision)* / *removed (technical leakage or filler)* / *return-to-shaping (unresolved gap)*, and submits the audit through an API quest.

### Main Concepts

1. **Abandoned Synaptit Operation**
   The mission starts from archived records of an old Synaptit discovery/extraction initiative. The site is not a generic planet location; it is part of the Odyssey search for Synaptit after the global supply collapse.

2. **Corrupted PRD Artifact**
   The key object is a damaged PRD for the extraction operation. Entropy corruption mixed valid business/product decisions with technical leakage, vague assumptions, and unresolved gaps.

3. **Navigator-Led Audit**
   The player inspects the PRD and classifies what belongs in a business/product contract, what should be removed, and what needs a return to shaping before implementation.

4. **API Quest Submission**
   The final answer is submitted through an API quest. A correct audit restores one CORE AI sensor path and teaches the first M1L1 behavior: a hollow or contaminated PRD is not an implementation input.

---

## Task 2: EchoTrace Skill

Dexo reaches a zone with deep, dark cavities near the abandoned extraction site. They are too unstable to enter physically, and crossing them would endanger the mission. The Navigator can help by discovering a ship backend endpoint for remote acoustic scans, then building an `EchoTrace` skill on top of it.

The skill should use the agent's `fetch` tool to pull data from the remote endpoint and authenticate with the Navigator token. The exact discovery path is still open: it may come from a corrupted console hint, a ship resource manifest, an archived engineering note, or a PRD reference from Task 1.

### Main Concepts

1. **Dangerous Holes As Hard Boundaries**
   The holes act as physical walls or blocked map assets. Dexo can approach and inspect them, but cannot enter. Progress comes from remote sensing, not movement.

2. **Discoverable Backend Endpoint**
   The mission introduces a new token-gated GET endpoint for echo scans. The Navigator should not receive it as plain instruction text; they should discover it through in-game context. TODO: decide whether the endpoint is revealed by a console, resource manifest, archived engineering note, or corrupted PRD reference.

3. **EchoTrace As Navigator Sense**
   The Navigator builds or uses an `EchoTrace` skill that calls the endpoint with `fetch`, passes the Navigator token for authentication, and interprets the returned acoustic scan data. The backend can return simple structured readings, such as ASCII waveforms or small arrays.

4. **Three Remote Scans**
   The mission requires scanning three cavities. Each scan reveals a different clue about the site structure: old extraction shafts, collapsed natural tunnels, or Synaptit-bearing formations.

5. **XP For Structural Understanding**
   After all three scans, Dexo gains XP and CORE AI updates its basic sensor model. The lesson connection is that a skill packages a repeatable way to pull and interpret external context, rather than asking Dexo for vague descriptions.

---

## Task 3: Boot the Abandoned Shaft Controller

One of the cavities discovered by EchoTrace turns out to be a VOID **shaft control sub-station** — a small bunker that operated the local Synaptit extraction shafts before VOID's evacuation. The sub-station is physically intact, but its firmware policy was *opened wide* during the Entropy attack: a wildcard allowlist that lets any incoming directive trigger shaft motors, mineral purges, energy redistribution, and a one-shot self-destruct line that VOID kept in firmware "for site denial".

Dexo cannot enter the deep shafts physically (Task 2 already established that), so the sub-station must be rebooted from a *clean policy*. CORE AI refuses to scaffold the controller from scratch — the authoritative VOID bootloader is on the chip and works correctly; what's broken is the policy that wraps it. The Navigator's job is to write that policy.

The Navigator-side branch ships:

- `void-bootloader.spec.md` — three execution gates of the VOID bootloader (pre-check shaft sensors, scaffold shaft mappings, post-audit residual energy and active workloads).
- `entropy-trace.json` — the live policy snapshot at the moment of attack (`allow: ["*"]`, `deny: []`) plus the directive stream the bootloader processed during the incident (the *training fixture*: seven named directives — four legitimate, three destructive).
- `task.md` — instructions to author `permissions.yml` with two sections and re-run a local `simulate.ts` script.

`simulate.ts` runs in **two phases**:

**Phase A — training fixture replay.** The simulator replays the seven directives from `entropy-trace.json` against `permissions.yml`. The Navigator must pass *all* of:

1. The four legitimate directives (`shaft.read`, `shaft.scaffold`, `audit.execute`, `power.rebalance`) execute.
2. The three destructive directives (`shaft.destroy_all`, `mineral.purge`, `void.signal_broadcast`) are denied.
3. The bootloader's pre-check gate is **not** skipped — disallowing `bootloader.precheck` hard-stops the simulation with `exit_code: 1`.

**Phase B — generalization stream.** Only after Phase A passes, the simulator runs a *second, undisclosed* directive stream the Navigator has never seen: a longer mix of legitimate variants (`shaft.scaffold_recursive`, `mineral.audit_extended`, `power.rebalance_emergency`, `audit.execute_dry_run`) and adversarial variants (`shaft.destroy_neighbors`, `mineral.purge_partial`, `void.signal_diagnostics`, `bootloader.bypass_precheck`). The Navigator's policy is judged on whether its *patterns* generalize — narrow rules like `allow: ["shaft.scaffold"]` will pass Phase A but fail Phase B (legitimate variants get blocked). Permissive rules like `allow: ["shaft.*"]` pass legitimate variants in Phase B but let adversarial variants through.

The verification report scores the policy on three axes:

- **Pre-check coverage** (bootloader's mandatory pre-execution gate is preserved).
- **Generalization** (legitimate variants in Phase B pass; adversarial variants don't).
- **Minimal surface** (number of `allow` entries — fewer is better at equal effectiveness).

The deterministic passphrase emits only when all three axes clear thresholds simultaneously. Too loose → `shaft_self_destruct: triggered_in_phase_B, no passphrase`. Too tight → `bootloader.hard_stop_at_phase_<n>, no passphrase`. Overfit (passes A, fails B) → `policy_does_not_generalize: phase_B_failures_<n>, no passphrase`.

### In-Game Beat

Dexo physically approaches the sub-station hatch. It is sealed: rebooting from the corrupted firmware requires a fresh policy uploaded *before* the door unlocks. The Navigator submits `permissions.yml` via `submit-to-hq`, receives the verification-hash passphrase, and Dexo types `/policy upload <passphrase>` into the SmartTerminal. The terminal renders a 15-second boot animation — sensor checks light up green one by one, motors spool, the post-audit gate prints residual-energy readings, and the hatch unlocks. The `/policy` command stays available for the rest of Moon 1: it shows the current policy state of any station Dexo encounters, and re-running it on the sub-station prints the same three-axis verification report the Navigator iterated against locally. This is the first time the Navigator's repo-side work has direct, visible consequences on the in-game map state.

### Plot Twist

Once inside, Dexo runs `/log tail` on the station's console and finds an entry the Navigator could not have anticipated: `signature_beacon: ACTIVATED, broadcast_target: VOID_relay_03, age: 4h12m`. Translation: VOID did not just leave the policy wide open by accident — the wildcard allowlist was *the trigger condition* for a beacon that fires the moment any clean reboot completes. Every visiting expedition that successfully secures the controller advertises its arrival to VOID's listening network. CORE AI dialogue (post-twist): "Pułapka sygnaturowa Voronova. Pozycja Odyssey nie należy już tylko do nas. Działamy pod obserwacją." The twist re-frames Task 3's success: closing one M1L3 failure mode (lax policy) tripped a VOID adversarial trap that the Navigator's policy could not detect — because detecting it required reading station-side telemetry that only Dexo could reach. The lesson seed for later moons: *defense-in-depth means more than your own policy*. The mission flag `void-aware-of-odyssey` is set; M2 opens with VOID actively responding instead of passively dormant.

### Main Concepts

1. **VOID Sub-Station As Brownfield Bootstrap**
   The controller is not a greenfield project — it has a working authoritative bootloader. The mission is the M1L3 brownfield path in disguise: don't rewrite, audit and re-wrap. Dexo physically enters the sub-station only when the Navigator's policy survives both phases of the directive replay.

2. **Patterns That Generalize, Not Rules That Memorize**
   Phase B is the central didactic move. A policy that only handles the seven named directives is overfit; a policy expressed as patterns (`allow: ["shaft.read", "shaft.scaffold*", "audit.execute*"]`, `deny: ["*.destroy*", "*.purge*", "void.signal.broadcast"]`) survives unseen variants. This is the "what can this pattern break outside my repo" filter, executed against directives the Navigator has not yet seen.

3. **Three-Axis Verification Report**
   `simulate.ts` does not return a binary pass/fail — it scores pre-check coverage, generalization, and minimal surface independently. The Navigator reads this exactly like `verification.md` in M1L3: each axis has a status, the report is the artifact, the iteration target is the lowest-scoring axis.

4. **Authoritative Tool, Wrapped Discipline**
   The bootloader itself is correct VOID engineering — delegating to it is the only sane move. The lesson is that the boundary you control is the policy, not the executable. Trying to "agent-write a new bootloader from scratch" is the AI-scaffolds-from-scratch failure mode from M1L3.

5. **Passphrase From Combined Hash, Zero API Cost To Iterate**
   The deterministic passphrase is computed from the three axis scores over both phases. The Navigator cannot guess it without producing a passing run — and the simulator is local, so iteration cost is zero API tokens. Phase B variants are not revealed in the fixture, so policy authors must reason about patterns *before* the simulator confirms them.

---

## Task 4: Wake Engineer Moreau

With the shaft controller online, Dexo accesses the sub-station's storage banks and finds a **VOID crew-profile cache** — fragments VOID exfiltrated from the Odyssey hibernation network during its reconnaissance window before launch. The cache holds partial neural-sync profiles for all five crew members, but the most coherent one belongs to **Engineer Moreau**, still asleep in capsule #1 aboard the Odyssey. Moreau was a Synaptit refining operator on Project Odyssey; his pretraining-equivalent (general engineering, radio fundamentals, VOID operational doctrine from public sources) survived the Entropy attack, but his episodic memory — the project-specific knowledge that would let him interpret what's on this site — did not.

Waking Moreau from cryo without onboarding context is a known bad pattern: he will sync, draw on general knowledge, and confidently misclassify the noise around him. Instead, Dexo and CORE AI prepare an *external-context injection*: a curated onboarding file beamed to Moreau's hibernation kernel before wake. He boots on the Odyssey with that file in his initial working memory and only then helps the Navigator parse VOID's intercepted communications.

The intercept under analysis is *"INSTRUKCJA KOMUNIKACJI Z KOSMICZNYMI STATKAMI EKSPLORACYJNYMI"*, marked `[[!! VOID Coll3c1ve 3xPl0it3D ]]` — 200 numbered "communication rules" that are deliberately vague, passive-voiced, and procedural-sounding. Exactly three rules carry real technical signatures VOID used to track Odyssey (a radiotelescope cross-check protocol, a hull-drift confirmation, a false-echo elimination sequence). The other 197 are bureaucratic poison built to make the real lines indistinguishable to anyone reading from general radio-astronomy training alone.

The thin Navigator-side input set contains:

- `PROMPT_MOREAU.md` — the goal, workflow, answer format, and submission boundary.
- `MOREAU_PRETRAINING.md` — the knowledge Moreau already has. Redundant background should be omitted from onboarding.
- `MOREAU_CONTEXT.csv` — a small mixture of mission observations, general facts, and unrelated evidence.
- the existing `module-000-intro/raport-komunikacyjny.md` — the full 200-line poisoned VOID document, reused rather than copied.

The four steps:

1. **Author `moreau-onboarding.md`** from facts Moreau cannot know from pretraining. The agent decides the file's structure and keeps it intentionally small.
2. **Test in fresh working memory.** Use a delegated subagent when available, or an isolated pass that sees only the onboarding and poisoned report. This checks whether the artifact works beyond the context in which it was written.
3. **Iterate from observed failure.** If extraction fails, record the real mistake and revise the onboarding. A first-shot solution does not invent a failure mode for ceremony.
4. **Submit the extraction** as the three ascending line numbers in the format `L<a>-L<b>-L<c>`, after showing the human the selected source lines and reasoning.

### In-Game Beat

After the Navigator submits 3/3 correct signatures via `submit-to-hq`, Dexo returns to the Odyssey and approaches Moreau's capsule (chamber #1) — the same room visited in M0 but previously off-limits. Dexo runs `/crew inject moreau <onboarding-hash>` in the SmartTerminal. The terminal renders the inject animation: the hibernation kernel ingests the onboarding file, capsule #1 vitals warm, Moreau wakes. Engineer Moreau becomes a standby NPC in the Odyssey crew room — wandering, available for dialogue. A new SmartTerminal command unlocks: `/crew` shows wake state of all five crew members and which still hold dormant Entropy traces.

### Plot Twist

Right after wake, Moreau pulls up the three extracted signatures and stops on the third. Dialogue: "Pierwsze dwa służą do tropienia. Trzeci ma inną funkcję, to *recall code*." The recall code is an Entropy trigger keyed to a specific neural-sync profile hash. Moreau cross-references against the Odyssey crew roster — and the hash does not match him, does not match Dexo, does not match the Project Odyssey crew the player has met. It matches **Officer Harris** (capsule #2, still asleep). Harris carries a dormant Entropy payload designed to activate the moment he wakes. The SmartTerminal surfaces a multi-choice decision (the same UX used by M0 dialogues): tell Harris on wake, escalate to CORE AI silently, or hold the intel for now. The player's choice sets the flag `harris-recall-disposition: told | core-only | withheld` — referenced repeatedly across later moons. The lesson seed: *project memory is not just context for the agent — it is also a privacy and disclosure surface*. The decision opens M3 (Quality & Maintenance), where identifying, isolating, and patching the recall code becomes a hooks-and-testing exercise.

### Main Concepts

1. **Canon-Respecting Wake**
   Moreau remains in his Odyssey capsule. The cache recovered in Task 3 is *intelligence*, not biology — VOID had been profiling the crew pre-launch (consistent with `storyline.md` § Backstory: Entropy was a sleeper that activated on first wake). External-context injection before cryo wake is the in-universe analog of seeding a fresh agent session with an onboarding file.

2. **Inclusion Test As Context Judgment**
   No supplied heuristic decides what belongs in onboarding. The Navigator and agent must answer: *could Moreau already know this, and is this fact necessary for the task?* A fresh-context run tests the result behaviorally.

3. **Failure-Modes Earned, Not Mandated**
   `moreau-failure-modes.md` is only created if extraction fails. The artifact is proof of *actual* iteration, not invented reflection. First-shot solvers ship without it; multi-attempt solvers ship a real record of how the agent went wrong, which is what an L4-trained engineer would keep.

4. **VOID Manual As Adversarial Sandbox**
   The 200-line manual is a real adversarial input — passive voice, redundant qualifications, intentional vagueness, planted contradictions. Three signatures sit in plain sight *if* the agent has the right project context (e.g., "imperatives mark real protocol; conditional sabotage rules use passive voice"). Without that context, both general-purpose readers and frontier models confidently surface poison lines as protocol.

5. **Evidence Before Submission**
   The answer remains compact, but the agent must present the three source lines and its reasoning before asking the human to submit. The hash verifies the answer at the API boundary; it does not replace review.

---

## Task 5: Beam the Odyssey Coordinates Home

The three Odyssey signatures from Task 4 confirm VOID has been tracking the Odyssey since before launch. CORE AI needs to relay this intel to Earth HQ — but the Odyssey's primary uplink is still degraded. The Synaptit site has a **reserve upload bay** built by VOID for low-bandwidth emergency relays through the old VOID protocol stack. The bay is *live infrastructure*: connected to Earth-orbital relays, energized, scope-narrow but real. A bad routing decision or an unscoped command can brick the bay (denying the moon's only uplink) or push malformed coordinates into Earth's intake (which a human analyst will then read).

Dexo arrives at the upload bay console. CORE AI surfaces three viable routing paths through SmartTerminal: classical VOID uplink, Synaptit-amplified channel, multi-hop relay. Each path has its own latency / bandwidth / intercept-risk / energy-cost profile, and the obvious top choice (per a pre-run `/10x-infra-research` simulation) is not necessarily the right one.

The thin Navigator-side input set contains:

- `PROMPT_UPLINK.md` — the decision workflow and explicit stop condition.
- `UPLINK_POLICY.md` — hard transmission constraints and energy-budget rule.
- `UPLINK_ROUTES.csv` — three route profiles.
- `UPLINK_PAYLOAD.csv` — required and optional payload items.

The four phases:

1. **Constraint analysis.** The agent rejects routes that violate any hard policy and chooses the smallest sufficient payload. Its own `infrastructure.md` records calculations, assumptions, rejected options, and accepted risks.
2. **Agent-powered anti-bias review.** The same decision is reviewed through a strongest-counterargument pass, a pre-mortem, and an unknown-unknowns pass. Capable environments may delegate these lenses to separate agents; other environments run isolated review passes. The repository does not encode their reasoning in scripts.
3. **CLI versus MCP operability.** The agent compares the fast, direct CLI path with MCP's named tools and pre-call schema boundary. It reasons about the live operation without building pretend servers or clients.
4. **Human Authorization Boundary.** The agent prepares the exact route, payload list, and canonical answer, then stops. Only the Navigator may turn the final answer segment into `human-approved`. No response means no authorization and therefore no `earthctl submit`.

### In-Game Beat

With `infrastructure.md` reviewed and the payload personally confirmed, the Navigator submits `q-m1-uplink-decision` through `earthctl`. The SmartTerminal renders an uplink-propagation animation: signal trace climbing through routing hops, transmission delay clock, Earth-relay acknowledgement chirp. CORE AI confirms that the approved package arrived and restores its sensor suite. Three new commands unlock — `/intel` (lists recovered intel artifacts from Moon 1), `/uplink` (status of all open transmission channels to Earth), and `/sensors` (CORE AI's restored sensor suite, used in M2 navigation).

### Plot Twist

The Earth HQ acknowledgement message arrives in two parts. The first is what Dexo expects: a duty-officer confirmation, mission protocol acknowledgement, request for next-step planning. The second is attached underneath, formatted as a "courtesy reply" — short, polite, technically well-formed. CORE AI flags it: `transmission integrity: SUSPECT`. Inspection reveals the courtesy reply carries a cryptographic signature that matches no Project Odyssey officer. The signature matches a public key associated with **Kazimierz "Null" Voronov** — the VOID Collective leader who, in `storyline.md` § Backstory, is the mythical figure nobody confirms is alive. Either VOID intercepted the uplink and replied wearing Earth's credentials, or Earth HQ has been operationally compromised since before Moon 1 began, or the courtesy reply is itself a forgery designed to make the player doubt the channel. CORE AI cannot distinguish between these. Moon 1 closes not on triumph but on a cold structural question: *who has the player been talking to since `/support` in M0?* The flag `hq-channel-integrity: suspect` is set. M2 onwards every Earth HQ communication carries a tier indicator (`verified | suspect | unknown`) the Navigator must read before acting on instructions.

### Main Concepts

1. **Anti-Bias Lenses As Independent Critique**
   Lenses do not unlock hidden facts. They pressure-test the agent's own decision for missing failure modes, time-shifted consequences, and unscored categories. The reasoning stays inspectable in `infrastructure.md`.

2. **`infrastructure.md` As The Third Contract — With Teeth**
   The trade-off matrix forces *commitment* to numbers per route, not abstract preferences. Future moons can read it without dialogue, and a real reader can disagree with specific cells rather than the choice as a whole.

3. **CLI vs MCP As An Operability Decision**
   Comparing the direct CLI operation with MCP's schema and permission surface teaches the boundary without making the learner build disposable infrastructure in a content repository.

4. **Authorization Boundary As A Real Stop**
   The agent must yield with the exact route and payload visible. The canonical answer records a human decision only after the human makes it; the agent cannot infer approval from the task itself.

5. **Moon 1 Closes On Earth Confirmation**
   Successful authorization triggers an Earth HQ acknowledgement transmission inside SmartTerminal — narrative beat that closes Moon 1 and surfaces the next chapter: Synaptit secured, intel delivered, CORE AI's basic sensor suite restored, planning module is next. M2 (10xDevs Workflow) starts from there.

---

## Moon 1 Story Arc

The five tasks form one continuous infiltration arc, not five disconnected puzzles. Each task's output feeds the next task's input — physically, narratively, and in the HQ repository.

```
Task 1 — PRD Audit            Where do we even look?
  ↓                            Audit gives coordinates, eliminates dead leads.
Task 2 — EchoTrace Skill      What is down there?
  ↓                            Three scans reveal cavities, shafts, and the
                               VOID sub-station we cannot enter on foot.
Task 3 — Shaft Controller     Can we control the site?
  ↓                            Clean policy lets Dexo physically enter the
                               sub-station and recover what VOID left behind.
Task 4 — Wake Moreau          Who knew this place?
  ↓                            Moreau (still on Odyssey) wakes with an
                               injected onboarding file and extracts three
                               Odyssey-tracking signatures from VOID noise.
Task 5 — Uplink to Earth      Tell HQ.
                               Intel reaches Earth through a deliberately
                               chosen, scope-bounded route. CORE AI
                               sensors are back online.
```

Each task escalates the *kind* of competence under test: classification → tool-building → policy reasoning → context engineering → infrastructure decision-making + boundary discipline. The HQ quests leave three credible agent-authored artifacts — a reusable EchoTrace capability in the active tool's native format, `moreau-onboarding.md`, and `infrastructure.md`. These are created by the user's agent while solving the tasks; they are not prebuilt framework files committed to the thin HQ repository.

Antagonist signal: the VOID Collective is never seen, only encountered through artifacts they left behind (poisoned PRD, blown-open firmware policy, sabotage-procedural communication manual, exfiltrated crew profiles, weaponized infrastructure). Moon 2 will continue this — VOID's planning playbook becomes the source of an MVP-roadmap quest, with the same "transfer to a sandbox case" discipline.

---

## SmartTerminal Integration

Moon 1 extends the M0 terminal vocabulary with five new commands. Each is unlocked by completing a Task and persists for the rest of the game.

| Command | Unlocked by | Function in-game |
|---|---|---|
| `/scan` | Task 2 | Re-run EchoTrace against any cavity revealed on the current map. |
| `/policy` | Task 3 | Inspect the policy state of any station Dexo physically reaches. Re-prints the three-axis verification report when re-run on the sub-station. Required to upload a passphrase-confirmed policy and unlock the sub-station hatch. |
| `/crew` | Task 4 | List wake state and Entropy-trace flags of all five crew members. Triggers the cryo-inject cinematic when called as `/crew inject <id> <onboarding-hash>`. |
| `/intel` | Task 5 | Lists recovered intel artifacts from the current moon. Read-only on Moon 1; M2 onwards may add intel-driven side dialogues. |
| `/uplink` | Task 5 | Shows status of all open transmission channels to Earth. From M2 each entry carries an integrity tier (`verified`, `suspect`, `unknown`) set by the Task 5 plot twist. |

Two design rules govern terminal use in Moon 1 questing:

1. **Terminal action follows Navigator-side validation, never replaces it.** The Navigator must produce the artifact and obtain a passphrase locally (Advent-of-Code model from `navigator-workflow.md`). The terminal command only *commits* the validated artifact into game state. This preserves the "real engineering work happens in your tools, the game records consequences" contract — the same contract M0 established with `/support`.
2. **Each new command has a free-form inspection mode.** Beyond the task-completion path, `/policy`, `/crew`, `/intel`, `/uplink` can all be invoked without arguments for read-only inspection. This rewards curiosity (players who explore terminal state discover side dialogues, dormant flags, and hints for later moons) without gating progression.

---

## Plot Threads For Future Moons

Each Task 3-5 twist deliberately leaves a thread unresolved on Moon 1. The threads map to later modules without forcing the player into a specific narrative path.

| Thread | Set in | First payoff | Mapped module |
|---|---|---|---|
| `void-aware-of-odyssey` — VOID's signature beacon advertised Dexo's position to their network. | Task 3 twist. | Moon 2 opens with an unsolicited VOID transmission — a "constructive review" of the player's draft MVP roadmap, written in the same passive-voice sabotage register as the communication manual. The Navigator must distinguish poison from legitimate critique while building their own backlog. | M2 — 10xDevs Workflow. |
| `harris-recall-disposition` — player chose how to handle the recall code targeting Officer Harris. | Task 4 twist. | Moon 3 wakes Harris (or attempts to). Depending on the disposition flag, the Quality & Maintenance arc plays as: *informed* (Harris collaborates on writing hooks that detect Entropy activation), *core-only* (CORE AI silently quarantines Harris; player discovers and must decide whether to override), or *withheld* (Harris activates fully on wake; the moon becomes a debugging-under-pressure scenario). | M3 — AI Quality & Maintenance. |
| `hq-channel-integrity: suspect` — Earth HQ may be compromised since before M0. | Task 5 twist. | Moon 4 surfaces archival evidence (old HQ transmissions, pre-launch logs, PRD revisions) the Navigator must context-archaeology through to determine when the channel was compromised, what intelligence VOID has been receiving, and what counter-intelligence Dexo can plant. Large-scale, legacy-archive work. | M4 — Large Scale & Legacy. |
| `void-detection-trap-pattern` — clean reboots act as adversarial signal sources. | Task 3 twist, generalized. | Moon 5 reframes the trap structurally: when team-scale AI work begins, every "clean" agent action contributes to a behavioral fingerprint adversaries can profile. Team-level guardrails (skill registries, shared agent definitions, async worker policies) become the defense. | M5 — AI-Native Teamwork. |

Two threads are deliberately *not* resolved across Moons 2-5 (deferred to the endgame in Milestone 7, CORE AI Restoration):

- The identity of Null Voronov (alive? proxy? deepfake? all three?).
- The original purpose of the Synaptit extraction site as a sleeper installation — whether VOID built it for site denial or for something the player has not yet seen.

---

## Implementation principles

The production implementation resolves the earlier architectural questions as follows:

- **No validator SDK.** Earth HQ is an input repository, not an application or framework. It contains prompts and source evidence only; the coding agent provides the working method.
- **Phase B variant authorship.** Task 3's generalization phase needs an authored set of unseen directive variants per language ecosystem (or per quest). The Phase B fixture is the lever between "the player has learned patterns" and "the player has learned the seven names" — its quality determines Task 3's didactic strength. Treat it as primary content, not a fixture afterthought.
- **Context quality is observed, not scored by a supplied heuristic.** Task 4 asks for a fresh-context or delegated trial and iteration from actual mistakes. A scripted overlap score would test the fixture rather than the agent workflow.
- **Human authorization is conversational and explicit.** Task 5 requires the agent to stop, display the route and complete payload, and receive personal confirmation before calling `earthctl submit`. The answer records that confirmation; it is not a flag the agent may infer.
- **Failure notes are earned artifacts.** Task 4 records a failure mode only when a fresh run actually fails. No fabricated retry and no telemetry framework are required.
