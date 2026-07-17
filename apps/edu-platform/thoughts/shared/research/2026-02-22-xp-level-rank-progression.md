---
date: 2026-02-22T00:00:00+01:00
researcher: Claude
git_commit: d788f9e5
branch: master
repository: przeprogramowani-sites
topic: "XP, Level Progression, and Rank System in 10x Explorers"
tags: [research, codebase, xp, ranks, progression, game-hud, terminal]
status: complete
last_updated: 2026-02-22
last_updated_by: Claude
---

# Research: XP, Level Progression, and Rank System in 10x Explorers

**Date**: 2026-02-22
**Researcher**: Claude
**Git Commit**: d788f9e5
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How do EXP and level progression work in the 10x Explorers game? Where are ranks defined?

## Summary

The XP system is **accumulation-only** with no dynamic level or rank progression. XP is tracked as a simple `number` field in game state, granted by quest and exam completion, and displayed in the HUD and terminal. The rank ("Kadet") and level ("Lv.1") are **hardcoded** in the GameHud and terminal output. There are no rank thresholds, level-up mechanics, or progression formulas implemented.

## Detailed Findings

### XP State & Storage

- **State field**: `DemoGameState.xp: number` — `src/explorers/state/types.ts:19`
- **Default value**: `0` — initialized in `createDefaultState()`
- **Storage**: localStorage key `'10x-explorers-demo-state'`
- **Auto-save**: Every 30 seconds via `SAVE_INTERVAL_MS` in GameScene
- **Event**: `GameEvents.XP_GAINED` (`'xp:gained'`) with `{ amount, total }` payload — `src/explorers/events/GameEvents.ts:29, 97-100`

### XP Reward Sources

| Source | Location | XP Amount |
|--------|----------|-----------|
| Quest 1: Restore Holographic Map | `src/explorers/levels/ship-bridge/quests.ts:16` | 75 XP |
| Quest 2: Determine Ship Position | `src/explorers/levels/ship-bridge/quests.ts:30` | 100 XP |
| Exam: Bridge Systems | `src/explorers/levels/ship-bridge/exams.ts:60` | 150 XP |
| **Total possible** | | **325 XP** |

### XP Granting Mechanism

- **QuestManager** — `src/explorers/systems/QuestManager.ts:76-93`
  - `completeQuest()` calculates `newXp = state.xp + quest.rewards.xp`
  - Emits `XP_GAINED` event
- **ExamManager** — `src/explorers/systems/ExamManager.ts:69-109`
  - `completeExam()` calculates `newXp = state.xp + exam.rewards.xp`
  - Emits `XP_GAINED` event

### Rank & Level — Hardcoded (Not Dynamic)

**Rank**: "Kadet" (Cadet)
- HUD: `<span class="rank">★ Kadet</span>` — `src/explorers/GameHud.svelte:72`
- Terminal `/status`: `Poziom: 1 (Kadet)` — `src/explorers/terminal/commandHandler.ts:108`

**Level**: "Lv.1"
- HUD: `<span class="level">Lv.1</span>` — `src/explorers/GameHud.svelte:73`
- Terminal `/status`: `Poziom: 1 (Kadet)` — `src/explorers/terminal/commandHandler.ts:108`

**There are NO:**
- Rank definitions/thresholds
- Level calculation functions
- Level-up triggers
- Rank progression arrays
- XP-to-level formulas

Per the technical exam plan (`thoughts/shared/plans/2026-02-22-technical-exam-mechanic.md:45`), level-ups are explicitly **excluded** from current design: "No level-up system (XP remains accumulation-only)".

### XP Display Locations

**1. GameHud (top bar)** — `src/explorers/GameHud.svelte`
- XP bar: 120px wide, gradient teal-400→teal-300 fill
- Text: `{xp}/{XP_MAX} XP` where `XP_MAX = 100` (line 13, 77)
- Animated bar fill: 300ms duration, cubicOut easing (line 19)
- Flash effect: text turns amber (#ffb347) on XP gain (lines 30-33)

**2. Terminal `/status`** — `src/explorers/terminal/commandHandler.ts:109`
- Shows `XP: {state.xp}/100`

**3. Exam completion screen** — `src/explorers/scenes/ExamScene.ts:416-427`
- Shows `+{rewards.xp} XP` with pulse animation

**4. QA overlay** — `src/explorers/QaOverlay.svelte:135-137`
- Shows raw `XP: {state.xp}` in amber

### XP_MAX Anomaly

The HUD defines `XP_MAX = 100` and displays XP as `xp/100`. However, the total possible XP from all current content is **325 XP** (75 + 100 + 150). The bar caps at 100% width via `Math.min(...)` but the counter keeps showing the actual total (e.g., "325/100 XP"). This suggests either:
1. `XP_MAX` was a placeholder for future level-up mechanics (100 XP per level)
2. It's a display bug that hasn't been addressed yet

## Code References

- `src/explorers/state/types.ts:19` — XP field definition
- `src/explorers/GameHud.svelte:13` — XP_MAX = 100 constant
- `src/explorers/GameHud.svelte:72-73` — Hardcoded "Kadet" rank and "Lv.1"
- `src/explorers/terminal/commandHandler.ts:90-119` — `/status` command with rank/XP
- `src/explorers/systems/QuestManager.ts:76-93` — Quest XP granting
- `src/explorers/systems/ExamManager.ts:69-109` — Exam XP granting
- `src/explorers/events/GameEvents.ts:29, 97-100` — XP_GAINED event
- `src/explorers/levels/ship-bridge/quests.ts:16,30` — Quest reward values
- `src/explorers/levels/ship-bridge/exams.ts:60` — Exam reward value

## Architecture Insights

- XP is a **simple additive counter** — no decay, multipliers, or caps
- Flags drive progression (not XP) — flag-gated interactions, quest chaining, terminal commands
- The rank/level display is **cosmetic only** — not tied to any game mechanic
- The system was designed with room for future expansion (XP_MAX per level, rank arrays) but intentionally left minimal
- The XP_GAINED event + animated HUD provides satisfying feedback despite no level-up mechanic

## Open Questions

1. Should `XP_MAX` adapt dynamically as more content is added? (e.g., increase to 500 for chapter 2)
2. Will rank progression be implemented? If so, what are the rank names and thresholds?
3. Is the XP bar overflow (325/100) intentional or should it be addressed?
4. Should ranks unlock gameplay mechanics (new terminal commands, areas) or remain cosmetic?
