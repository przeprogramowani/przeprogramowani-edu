# Navigator Workflow

> Design document describing the real-world player (Navigator) experience outside the game.
> The in-game counterpart is documented in `storyline.md` (Milestone 0, Map 4 — CORE AI).
>
> **Important distinction:** In-game dialogue always uses in-universe language (uplink, HQ transmission, mission data, data packet). Technical terms like "GitHub", "branch", "git checkout" never appear inside the game — those are Navigator-side concepts only.

---

## Core Idea: Advent of Code for Agentic Engineering

The HQ repository is designed around the same principle as **Advent of Code**: the puzzle complexity lives in the task description and runs entirely on the player's machine. The server only validates a short, deterministic result — a passphrase, number, or code. Zero server-side AI cost, zero ambiguity.

The difference: instead of algorithmic puzzles, the challenges are **agentic engineering tasks** — configuring MCP, crafting prompts, running AI-assisted workflows, writing tests with Copilot. The Navigator uses their real tools (Claude Code, Cursor, Copilot) to solve each challenge, and the act of solving it *is* the learning.

---

## Overview

The Navigator is the real-world programmer cooperating with Dexo (the astronaut) via the SmartTerminal uplink. While Dexo explores the ship and moons inside the game, the Navigator solves engineering challenges locally on their machine and submits results back to the game API to unlock progression.

The Navigator's tools: any AI coding assistant (Claude Code, Copilot, Codex, Cursor, etc.).

---

## The HQ Repository

When Dexo runs `/support` for the first time, the SmartTerminal displays:
- A unique **identification token** (generated server-side, unique per player, shown only once)
- An **HQ uplink address** — in-universe framing for the GitHub repository URL

The Navigator clones that repository and interacts with it throughout the entire course. From the Navigator's perspective this is a plain GitHub repo; from Dexo's perspective it is the Earth-side mission control archive.

---

## Branch-per-Quest Progression

The repository uses a **branch-per-quest model**. Each quest in the game maps to exactly one branch — granularity follows the quest system, not the moon/milestone structure.

```
master                        ← always available; base Skill + onboarding README
q-first-contact               ← Milestone 0, first HQ handshake
q-setup-mcp                   ← Moon 1, quest: configure agentic environment
q-craft-system-prompt         ← Moon 1, quest: prompt engineering
q-write-unit-test             ← Moon 3, quest: AI-assisted testing
q-review-pr                   ← Moon 4, quest: AI code review
...                           ← one branch per quest, indefinitely
```

**How it works — Navigator side:**
1. Navigator checks out the branch named after the active quest
2. New task files appear in the working tree
3. Navigator completes the task using their AI tools, obtains a passphrase
4. Navigator submits the passphrase via the Skill
5. Game state updates: flags set, XP granted, Dexo reacts

**How it works — in-game side (Dexo's perspective):**
- Dexo receives a "data packet transmission" or "mission update from HQ"
- Dialogue references a **mission code** (the quest ID, presented as a transmission identifier)
- No mention of GitHub, branches, or git — Dexo simply knows the next mission code to relay to the Navigator via the SmartTerminal uplink

The Navigator never needs to know the API internals — the Skill handles all of that.

---

## The Base Skill (master branch)

The `master` branch contains exactly **one Claude Code Skill**: `submit-to-hq`.

```
.claude/
  commands/
    submit-to-hq.md    ← the only Skill on master
README.md              ← narrative onboarding, how to configure the token
```

The Skill accepts a quest ID and an answer, then calls `POST /api/game/submit` with the player's token:

```
/submit-to-hq quest_id=q-setup-mcp answer=CONTEXT7
```

This is the **only API surface the Navigator ever sees**. The underlying endpoint never changes — only the quest ID and answer change as the game progresses. New branches add tasks, never new Skills.

---

## Task Structure (per quest branch)

Each quest branch adds one directory with a self-contained mission:

```
missions/
  q-setup-mcp/
    README.md    ← mission brief written as an in-universe HQ transmission
    task.md      ← the engineering challenge (or task.ts for runnable scripts)
```

**`README.md`** — written as a mission briefing from HQ Earth. Sets the narrative context and tells the Navigator what they need to produce. Uses in-universe language ("transmission", "mission data", "uplink response") while describing a real engineering task.

**`task.md` / `task.ts`** — the engineering challenge. The Navigator works through it using their AI tools. Completing the task always produces a **deterministic passphrase** (a word, number, model name, short code — format always specified in the task description).

---

## Passphrase Validation

The game never evaluates free-form text server-side. All validation is a simple hash comparison:

```
sha256(answer.trim().toLowerCase()) === quest.answerHash
```

This means:
- Zero server-side AI cost
- Deterministic, instant validation
- All the real learning (LLM calls, code writing, analysis) happens on the Navigator's machine
- The passphrase format is always described in the task (e.g. "the model name in ALL_CAPS", "a 4-digit number", "the first word of the output")

If the answer is wrong, the API returns the quest's `hint` field to guide the Navigator.

---

## Token Lifecycle

- Token is generated server-side on first `/support` call inside the game
- Format: `10X-{A4}-{B4}-{C4}` (UUID-derived segments, unique per player)
- Shown **once** in the SmartTerminal; masked on all subsequent checks
- Stored only as a SHA-256 hash server-side (raw value never persisted)
- Used as `Authorization: Bearer <token>` in all Skill calls
- Can be regenerated via the game UI (invalidates the old token)

---

## Progression Summary

| Step | Where | What happens |
|------|-------|-------------|
| 1 | In game | Dexo runs `/support` → token + HQ uplink address displayed |
| 2 | Terminal | Navigator clones HQ repo, reads `master` README, stores token |
| 3 | In game | Dexo receives mission update — relays quest mission code to Navigator |
| 4 | Terminal | `git checkout q-{quest-id}` → task files appear |
| 5 | Terminal | Navigator completes task with AI tools → gets passphrase |
| 6 | Terminal | `/submit-to-hq quest_id=... answer=...` |
| 7 | In game | Flags set, XP granted, Dexo reacts on next terminal open |
| 8 | In game | Next mission code unlocked → repeat from step 3 |
