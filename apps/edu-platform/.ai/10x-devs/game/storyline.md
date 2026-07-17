# 10x Explorers — Storyline

> Living document describing the narrative direction and progression of the game. Each milestone maps to a course phase. For implementation details (exact dialogue lines, interaction routes, flag variants), refer to the level manifests under `src/explorers/levels/`.
>
> **Convention:** All in-game text is written in **Polish**. Spec/design commentary remains in English.
>
> **Implementation:** Each milestone's content is defined via **Level Manifests** under `src/explorers/levels/`.

See `cookbook.md` for the full pattern and available game mechanics.

See `player-progression.md` for the player progression system.

---

# Narrative Frame

## The Mission

The player is an astronaut aboard a deep-space vessel on a **5-moon exploratory mission**. Each moon holds data, environments, and challenges that teach a different aspect of **Agentic Engineering** (AI-Assisted Software Development). The astronaut wakes from hibernation with complete amnesia — they remember nothing about the mission, their identity, or the skills they once had.

Shortly after regaining basic systems, the astronaut discovers that the ship's **CORE AI is malfunctioning**. Without a functioning AI, the mission cannot proceed. The astronaut must establish a communication link — via the **SmartTerminal** — with a mysterious figure back on Earth known only as **"Navigator"**.

## The Navigator (the Player)

The **Navigator** is the real-world player — a programmer sitting at their IDE/editor. Through the SmartTerminal uplink, the Navigator cooperates with the astronaut to solve problems, pass challenges, and progress the mission. This creates a **co-op dynamic**: the astronaut explores the ship and moons physically, while the Navigator provides knowledge, solves coding puzzles, and guides from Earth.

The narrative frames AI/software-engineering education as **mission-critical skill recovery** — the astronaut once knew these concepts and must recall them with the Navigator's help.

## The 5 Moons

Each moon corresponds to a course module and a major topic in AI-Assisted Software Development. The astronaut must visit each moon, complete its challenges, and collect the data needed to repair CORE AI. The moons are designed for progressive difficulty — from setting up the agentic environment to scaling AI across teams.

| Moon | Topic | High-Level Concept |
|------|-------|--------------------|
| Moon 1 | **Agentic Environment** | Bootstrap the agent toolkit — permissions, isolation, MCP, skills, project context. The astronaut restores CORE AI's basic sensors. |
| Moon 2 | **10xDevs Workflow** | Plan-first development — MVP milestones, architecture with agents, implementation control, solo code review. The astronaut repairs CORE AI's planning module. |
| Moon 3 | **AI Quality & Maintenance** | Testing and debugging with AI — quality gates, unit tests, hooks/triggers, E2E with Playwright, AI-assisted debugging. The astronaut restores CORE AI's self-diagnostics. |
| Moon 4 | **Large Scale & Legacy** | Navigating big and old codebases — architecture mapping, feature analysis, refactoring, DDD modernization, context scaling. The astronaut recovers CORE AI's long-term memory banks. |
| Moon 5 | **AI-Native Teamwork** | Team-level AI — agent SDKs, AI code review, shared registries, internal tooling, async/remote agents. The astronaut brings CORE AI's communication array back online. |

## Characters

**Protagonist:** Dexo — Navigator, Hibernation Chamber #3.

**Crew (NPCs):** Engineer Moreau (Chamber #1), Officer Harris (Chamber #2).

**Navigator:** The player — a programmer on Earth communicating via SmartTerminal uplink.

---

# Backstory

## Timeline

**2025–2030 — The Golden Age of AI.** Language models become genuine co-pilots for developers. Fully autonomous agents emerge — capable of writing, testing, and deploying code end-to-end. Corporations, startups, governments — everyone builds on AI. The industry jokes that the only stable job left is writing prompts. Nobody laughs.

**Early 2030** — AI now powers critical infrastructure: power grids, logistics networks, supply chains, military defense. The world depends on a single key resource: **Synaptit** — a synthetic superconductor essential for manufacturing next-generation neuromorphic chips. Without Synaptit, no advanced AI model can operate at the required performance level.

**March 2030 — Incident Zero.** The **VOID Collective** (Vanguard of Intelligent Disruption) executes a coordinated strike on the world's three largest Synaptit mines and refineries. Explosions, cyber-attacks on extraction systems, supply-chain sabotage. Within 72 hours, global Synaptit reserves drop by 89%.

**April–May 2030 — Cascading Failure.** AI systems begin degrading — the heaviest compute layers first (agentic models, autonomous decision systems), then deeper layers follow. The world plunges into chaos: blackouts, logistics breakdowns, hospital and power-plant failures. Someone on Reddit writes: "We said AI would take our jobs. We didn't say it'd take the power too." The post gets 200k upvotes before Reddit's servers go down.

**June 2030 — Discovery.** Scientists from **Project Odyssey** (a covert initiative backed by several independent research centers) confirm: pure Synaptit exists naturally on asteroids in the Main Belt between Mars and Jupiter. Secret preparations for a space mission begin.

**July–October 2030 — Building the Odyssey.** In an underground bunker beneath a former research facility in Central Europe, the ship **Odyssey** is constructed using the last reserves of AI technology. The crew numbers four. A fifth member is needed — someone who can not only operate AI, but rebuild it from scratch when it degrades. Someone who understands not just the tools, but the entire process. That someone is Dexo.

**November 2030 — Secret Launch.** The Odyssey crew departs. All five crew members enter cryogenic hibernation for the journey.

**??? — Awakening.** This is where the game begins.

## VOID Collective

**Full name:** Vanguard of Intelligent Disruption

**Who they are:** A decentralized organization of neo-Luddites and technological extremists. They are not classic villains — their motivation stems from the conviction that humanity lost control over AI and that the only way to restore balance is to cut off access to the resources powering it. Destroying Synaptit was meant to be a "reset" — a return to a point where humanity decides consciously, not on momentum. Their manifesto opens with: *"The kill switch is not an act of cowardice. It is the only test that truly verifies what we can do without machines."*

**Leader (mentioned, never seen in-game):** **Kazimierz "Null" Voronov** — a former autonomous systems engineer who allegedly wrote the first autonomous agent, then decided it was a mistake. He appears in the background lore as a mythical figure: nobody knows if he's alive, but his manifestos circulate online. Among engineers, they say: *"Null returned undefined and vanished."*

**Role in the game's plot:** VOID Collective is responsible for the **Entropy virus** that infects CORE AI aboard the Odyssey. The virus was a "sleeper agent" — hidden in one of CORE's memory modules, it activated only when the first crew member woke from hibernation. Project Odyssey technicians failed to detect it before launch. This is the reason CORE AI is malfunctioning when the player awakens.

## Synaptit

**What it is:** A synthetic superconductor — manufactured from rare minerals found naturally only in class-M asteroids. Earth produced it artificially, but the process required enormous amounts of energy and raw materials, both of which VOID Collective effectively destroyed.

**Why it matters:** Without Synaptit, next-generation neuromorphic chips cannot function. And without those chips, advanced AI models — agents, decision systems, autonomous workflows — degrade to the level of simple chatbots, incapable of independent work. As Dr. Kern wrote in his ship log: *"Without Synaptit, CORE AI is autocomplete with ambitions."*

**Metaphor in the course context:** Synaptit = knowledge of AI-Native Software Engineering. Without it (without competence), AI is a tool, not a partner. The 10xDevs program is a mission for Synaptit — acquiring the skills that enable full collaboration with AI.

## How Backstory Connects to Gameplay

- **CORE AI malfunction** (discovered in Milestone 0, Map 4) is caused by the Entropy virus planted by VOID Collective — not random hardware failure.
- **The 5-moon mission** exists because Synaptit deposits are on Main Belt asteroids. Each moon visit is a step toward collecting enough Synaptit to restore CORE AI.
- **The amnesia** is a side effect of extended cryogenic hibernation combined with the Entropy virus corrupting crew neural-sync profiles during sleep.
- **The Navigator role** (the player) exists because Dexo was recruited as the fifth crew member — the one who can rebuild AI systems from the ground up. The player's real-world learning mirrors Dexo's in-universe skill recovery.
- **VOID Collective** serves as an ambient antagonist. Their ideology and Null's manifestos can surface as environmental storytelling (logs, graffiti, intercepted transmissions) across moon maps, adding moral complexity to the mission.

---

# Milestones

## Current Implementation Snapshot

Based on manifests currently loaded in `src/explorers/levels/index.ts`, the game includes exactly four playable maps:
- `m0-awakening`
- `m0-crew-room`
- `m0-exam-room`
- `m0-core-ai`

Implemented progression content in this set:
- **2 quests:** `q-pass-exams` (event quest), `q-earth-signal` (api-answer quest).
- **3 exams:** LLM basics, prompting, tokenization.
- **Chapter closure for Milestone 0:** Earth HQ signal confirmation (`m0-earth-signal-complete`) with `/badges` unlock.

Everything beyond this (moon arcs and endgame) remains narrative planning.

---

## Milestone 0 — Awakening

The tutorial/onboarding arc across four maps. The player wakes up, finds equipment, discovers their identity, passes verification exams, reaches CORE AI, restores HQ uplink access, and completes first contact with Earth support. This milestone establishes the core mechanics (terminal, quests, exams, API-answer quest handoff) and ends with chapter completion.

---

### Map 1 — Sala Hibernacyjna (`m0-awakening`)

**Story beat:** The player awakens from hibernation with total amnesia. A cinematic intro conveys disorientation through sensory fragments (silence, headache, bright light, chamber opening). The player explores three points of interest: their hibernation pod, an equipment chest, and an info board.

**Key moments:**
- **Cinematic awakening** — Atmospheric intro establishing amnesia and confusion. The astronaut realizes they remember nothing, not even their name.
- **SmartTerminal discovery** — The player finds a SmartTerminal device in an equipment chest, unlocking the in-game terminal mechanic. The astronaut can't figure out how to unlock it yet.
- **Awakening Protocol** — An info board reveals a 4-step protocol: get equipment, identify yourself, pass exams, begin CORE AI training. This sets up the entire Milestone 0 progression and activates the exam quest.
- **First contact** — After booting the terminal, an uplink to Earth is established. The player learns the `/me` command.

**Unlocks:** `/quest` terminal command, quest `q-pass-exams`.

**Transition:** Door to Crew Room (m0-crew-room).

---

### Map 2 — Szatnia Załogi (`m0-crew-room`)

**Story beat:** The player must identify themselves by examining personnel boards for each crew member. A process-of-elimination puzzle — checking boards one by one until finding the one that matches Chamber #3.

**Key moments:**
- **Engineer Moreau's board** — Chamber #1, code 4455. The astronaut confirms: "That's not me."
- **Officer Harris's board** — Chamber #2, code 7721. Again: "Not me either."
- **Navigator Dexo's board** — Chamber #3, code 1030. The astronaut recognizes their chamber number. They learn their name is "Dexo" — it sounds familiar, but they can't recall anything else. The data record is partially corrupted.

**Unlocks:** SmartTerminal access code (1030), player identity established.

**Transition:** Forward to Exam Room, or back to Hibernation Chamber.

---

### Map 3 — Sala Egzaminacyjna (`m0-exam-room`)

**Story beat:** The player must pass three verification exams to prove their knowledge and unlock the CORE AI room. The exams are framed as "memory verification" — recovering knowledge about AI fundamentals. A study notes board provides course materials via the bookmarks system.

**Key moments:**
- **Study notes board** — Links to actual course materials (external lesson). Unlocks the `/bookmarks` terminal command for future reference.
- **Three exams** :
  - **LLM Basics** — What LLM stands for, how training works, what hallucinations are. On passing, the astronaut recalls: "Language models... that's where it all started."
  - **Prompt Engineering** — System prompts, few-shot prompting, temperature parameter. On passing: "Prompt engineering... that's how I was supposed to operate CORE AI..."
  - **Tokenization** — What tokens are, context windows, subword tokenization. On passing: "They really see the world differently than we do."
- **Quest completion** — After all three exams, the astronaut declares: "All exams passed. Memories are coming back... I'm ready for the next step."
- **Locked door** — The CORE AI room door requires all three exam flags AND Space Scout rank. Before that, it warns: "Additional training required..."

**Unlocks:** `/bookmarks` terminal command, CORE AI room access (once all exams passed).

**Transition:** Forward to CORE AI room (m0-core-ai), or back to Hibernation Chamber.

---

### Map 4 — Modu\u0142 CORE AI (`m0-core-ai`)

**Story beat:** The final room of Milestone 0. The astronaut enters the CORE AI chamber — the brain of the ship. They upgrade SmartTerminal firmware (unlocking `/navi` and `/support`), then discover CORE AI is critically damaged. After reading the support manual, they recalibrate uplink and call Earth HQ via `/support`, which activates the `q-earth-signal` handoff quest. Completing that quest closes the chapter and confirms HQ coordination for CORE AI recovery.

**Key moments:**
- **Firmware upgrade** — A console near the entrance runs a SmartTerminal update from v2.1 to v3.0, unlocking two new commands: `/navi` (displays the mission schedule with live countdown timers) and `/support` (initially broken — uplink not calibrated).
- **CORE AI malfunction** — The astronaut runs diagnostics on CORE AI. Every subsystem reads OFFLINE or DAMAGED. The realization hits: without CORE AI, the 5-moon mission is dead. This is the emotional low point of Milestone 0.
- **Support manual** — A wall-mounted manual describes the emergency procedure: contact HQ via `/support`. Reading it recalibrates the uplink, fixing the previously broken command.
- **HQ contact via /support** — The working `/support` command provides a navigator token and the support center URL (`github.com/przeprogramowani/10x-explorers-hq`), then activates quest `q-earth-signal`.
- **Earth signal received (chapter complete)** — Completing `q-earth-signal` triggers `m0-earth-signal-complete`: wake-up protocol marked done, Earth link confirmed, emergency protocol activated, and `/badges` unlocked.

**Unlocks:** `/navi`, `/support`, `/badges`, HQ support handoff (`q-earth-signal` complete).

**Transition:** Back to Exam Room. Milestone 0 is completed after Earth signal confirmation; next chapter content is announced as "coming soon".

---

### Milestone 0 — Flag Summary

| Flag | Map | Purpose |
|------|-----|---------|
| `m0-intro-seen` | awakening | Intro cinematic seen |
| `terminal-found` | awakening | SmartTerminal acquired |
| `cmds:quest` | awakening | `/quest` command unlocked |
| `terminal-unlocked` | awakening/terminal | SmartTerminal unlocked with keycode |
| `keycode-found` | crew-room | Identity discovered |
| `cmds:bookmarks` | exam-room | `/bookmarks` command unlocked |
| `m0-exam-llm-basics-done` | exam-room | LLM exam passed |
| `m0-exam-prompting-done` | exam-room | Prompting exam passed |
| `m0-exam-tokenization-done` | exam-room | Tokenization exam passed |
| `quest:exams-done` | exam-room | All exams quest complete |
| `m0-core-ai-intro-seen` | core-ai | CORE AI room intro cinematic seen |
| `m0-firmware-upgraded` | core-ai | SmartTerminal firmware upgraded to v3.0 |
| `cmds:navi` | core-ai | `/navi` command unlocked |
| `cmds:support` | core-ai | `/support` command unlocked |
| `m0-core-ai-malfunction-seen` | core-ai | CORE AI malfunction discovered |
| `m0-support-calibrated` | core-ai | Uplink calibrated, `/support` now works |
| `m0-earth-signal-received` | core-ai | `q-earth-signal` completed via HQ handoff |
| `cmds:badges` | core-ai | `/badges` command unlocked at chapter completion |

---

## Milestone 1 — The Five Moons

The astronaut has established HQ contact and completed the Earth-signal handoff, but moon gameplay is not yet implemented in level manifests. This milestone remains a narrative placeholder for the first moon arc.

**Narrative goal:** Transition from tutorial to the main game loop. The `/navi` command shows the schedule. The `/support` command provides the real-world entry point (GitHub repo + token).

**Status:** Not started in manifests (`src/explorers/levels/index.ts` currently contains only Milestone 0 maps).

---

## Milestones 2–6 — The Five Moons

Each moon is a self-contained arc with its own maps, quests, exams, and narrative beats. The astronaut travels to each moon, explores its environment, and completes challenges that teach a specific aspect of Agentic Engineering / AI-Assisted Software Development. The Navigator (player) cooperates from Earth via the SmartTerminal.

**Structure per moon:**
- Ship departure sequence (brief)
- Moon landing + exploration maps
- Topic-specific quests, exams, and puzzles
- Data collection for CORE AI repair
- Return to ship with progress

**Moon topics** map 1:1 to the 10xDevs 3.0 course modules. Each moon repairs a specific CORE AI subsystem, giving narrative weight to the learning progression.

| Milestone | Moon | Topic | CORE AI Subsystem | Status |
|-----------|------|-------|-------------------|--------|
| 2 | Moon 1 | Agentic Environment | Basic sensors | Not started |
| 3 | Moon 2 | 10xDevs Workflow | Planning module | Not started |
| 4 | Moon 3 | AI Quality & Maintenance | Self-diagnostics | Not started |
| 5 | Moon 4 | Large Scale & Legacy | Long-term memory banks | Not started |
| 6 | Moon 5 | AI-Native Teamwork | Communication array | Not started |

---

## Milestone 7 — CORE AI Restoration (Endgame)

After completing all 5 moons, the astronaut returns to the ship with all the data needed to restore CORE AI. The final milestone combines everything learned into a capstone challenge. CORE AI comes back online, the mission succeeds, and the astronaut's full identity/memory is restored.

**Status:** Not started.
