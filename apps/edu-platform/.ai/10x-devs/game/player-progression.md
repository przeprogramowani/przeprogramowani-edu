# 10x Explorers — Player Progression

> Rank system, XP economy, and how progression surfaces across the game.
>
> **Audience:** Game designers, AI coding agents, and developers tuning content balance.
>
> For content authoring (quests, exams, dialogues that grant XP), see the [Level Framework Cookbook](./cookbook.md). For general project constraints (language rules, tech stack), see the project's `CLAUDE.md`.

---

## Core Concept

Rank is a **pure derived value** — there is no `rank` field in game state. All rank information is computed at runtime from `state.xp` via utility functions in `src/explorers/config/ranks.ts`. This means:

- No state migration when rank thresholds change
- Existing saves instantly reflect updated tier boundaries
- A single source of truth: XP

---

## Rank Tiers

| Tier | Name | Min XP | XP to next |
|------|------|--------|-----------|
| 1 | ??? | 0 | 100 |
| 2 | Space Adept | 100 | 900 |
| 3 | Moon Engineer | 1,000 | 1,000 |
| 4 | Solar Builder | 2,000 | 1,000 |
| 5 | Stellar Explorer | 3,000 | 1,000 |
| 6 | Cosmic Architect | 4,000 | 1,000 |
| 7 | Deep Space Pioneer | 5,000 | — (max) |

Tier 1 ("???") is the initial unknown rank — the player hasn't proven themselves yet. Rank names are in English by design (they are proper titles, not UI labels).



---

## Where Progression Appears

### HUD (`GameHud.svelte`)

- **Rank name**: `★ {rankName}` — dynamic, updates on XP gain
- **Tier**: `Lv.{tier}`
- **XP bar**: Fills within the current rank's XP range (0%–100%), resets on rank-up
- **XP text**: `{current}/{nextThreshold} XP` — at max rank, shows `{current} XP` without denominator
- **Rank-up flash**: 1.2s amber pulse on rank name and tier text (triggered by `RANK_UP` event, separate from the 600ms XP flash)

### Terminal `/me` command

Displays full astronaut profile: rank name, tier, XP, ASCII progress bar, and a list of all remaining ranks with XP needed for each. The next rank is marked with `►`.

### QA overlay

Shows rank name and tier inline with XP value for quick debugging.

### Activity log

Entry `"Awans: {rank name}"` is added on every rank-up, visible via `/log` in the terminal.

---

## Rank-Up Flow

```
XP_GAINED event fires (from quest or exam completion)
  │
  ├─ PhaserGame.svelte compares old rank vs new rank
  │   (getRankForXP(total - amount) vs getRankForXP(total))
  │
  ├─ If tier changed:
  │   ├─ Emit RANK_UP event (payload: oldTier, newTier, names, totalXP)
  │   ├─ Add activity log entry: "Awans: {rank name}"
  │   └─ Store pending rank-up dialogue ID
  │
  ├─ GameHud receives RANK_UP → triggers 1.2s amber flash
  │
  └─ On next DIALOGUE_DISMISSED:
      └─ After 400ms delay, emit DIALOGUE_SHOW for rank-up dialogue
```

The delay ensures the rank-up dialogue plays **after** the quest/exam completion dialogue, not on top of it.

### Rank-up dialogue (3 auto-advancing lines)

| Line | Content | Duration |
|------|---------|----------|
| 1 | `═══ AWANS ═══` | 2,000ms |
| 2 | `Nowa ranga: {rank name}` | 2,500ms |
| 3 | Flavor text (Polish, per tier) | 2,500ms |

Rank-up dialogues are registered globally at boot via `buildRankUpDialogues()` in `levelLoader.ts`, not tied to any specific level.

---

## API Reference

### `getRankForXP(xp: number): RankInfo`

Returns the current rank definition and the next rank (or `null` at max tier).

### `getRankProgress(xp: number): RankProgress`

Returns per-rank XP bar data: `xpInRank`, `xpForRank`, `percent`, `displayCurrent`, `displayMax`.

### `buildRankUpDialogues(): Record<string, DialogueSequence>`

Returns 6 dialogue sequences (tiers 2–7) for registration into the global dialogue registry.

### `getRankUpDialogueId(tier: number): string`

Returns the dialogue ID for a given tier's rank-up sequence: `rank-up-tier-{tier}`.

### `RANKS: readonly RankDefinition[]`

The 7-tier rank table. Used by `/me` to display progression toward remaining ranks.

---

## Events

| Event | Payload | Emitted by | Consumed by |
|-------|---------|-----------|-------------|
| `XP_GAINED` | `{ amount, total }` | QuestManager, ExamManager | GameHud, PhaserGame (rank detection) |
| `RANK_UP` | `{ oldTier, oldName, newTier, newName, totalXP }` | PhaserGame | GameHud (flash) |
| `DIALOGUE_SHOW` | `{ dialogueId }` | PhaserGame (rank-up) | DialogueManager |
| `DIALOGUE_DISMISSED` | — | DialogueManager | PhaserGame (queued rank-up dialogue) |

---

## File Reference

| File | Purpose |
|------|---------|
| `src/explorers/config/ranks.ts` | Rank definitions, lookup functions, rank-up dialogue builder |
| `src/explorers/config/ranks.test.ts` | Unit tests for rank utilities |
| `src/explorers/events/GameEvents.ts` | `RANK_UP` event constant + `RankUpPayload` type |
| `src/explorers/levels/levelLoader.ts` | Registers rank-up dialogues at boot |
| `src/explorers/GameHud.svelte` | Dynamic rank display + rank-up flash |
| `src/explorers/terminal/commandHandler.ts` | `/me` command with rank progression |
| `src/explorers/QaOverlay.svelte` | Rank info in debug overlay |
| `src/explorers/PhaserGame.svelte` | Rank-up detection, dialogue queueing, activity log |

---

## Balancing Guidelines

When designing new chapters, keep in mind:

- **Tier 1 → 2** is intentionally fast (100 XP) — the player should leave "???" status early to feel progress
- **Tiers 3–7** each require 1,000 XP — steady, predictable pacing
- A typical quest rewards 50–150 XP; a typical exam rewards 100–200 XP
- Aim for 1–2 rank-ups per major chapter to maintain momentum
- The rank-up dialogue is purely visual feedback — ranks do not gate gameplay mechanics
