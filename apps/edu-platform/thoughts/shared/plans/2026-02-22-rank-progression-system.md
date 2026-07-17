# Rank Progression System — Implementation Plan

## Overview

Introduce a rank progression system to the 10x Explorers game. Players earn XP through quests and exams, and as they accumulate XP they advance through 7 ranked tiers. Currently, rank ("Kadet") and level ("Lv.1") are hardcoded. This plan replaces them with a dynamic, XP-driven rank system displayed in the HUD, terminal, and QA overlay, with a system dialogue + HUD flash on rank-up.

## Current State Analysis

- **XP**: Simple `number` field in `DemoGameState` (`state/types.ts:19`), initialized to 0
- **Rank/Level display**: Hardcoded "★ Kadet" and "Lv.1" in `GameHud.svelte:72-73`, hardcoded "Poziom: 1 (Kadet)" in `commandHandler.ts:108`
- **XP bar**: Fixed `XP_MAX = 100` in `GameHud.svelte:13`, bar progress = `xp/100`
- **XP sources**: Quest completion (`QuestManager.ts:76-93`) and exam completion (`ExamManager.ts:69-109`), both emit `XP_GAINED` with `{ amount, total }`
- **Total possible XP**: 325 (75 + 100 + 150 from ship-bridge content)
- **No existing**: rank thresholds, level-up detection, progression events, or rank-up feedback

### Key Discoveries:

- `GameHud.svelte` already has XP animation (tweened bar, 600ms flash) — we extend this for rank-up
- `PhaserGame.svelte:83-101` already wires activity log entries for quests/exams — rank-up log entry goes here
- `DialogueManager` loads dialogues from `getAllDialogues()` in `levelLoader.ts` — rank-up dialogues register here
- Quest/exam completion always triggers a completion dialogue before the user sees the rank change — rank-up dialogue must queue after

## Desired End State

After implementation:

1. **HUD** shows dynamic rank name (e.g. "★ Space Scout"), tier number (e.g. "Lv.2"), and per-rank XP bar
2. **Terminal `/status`** displays current rank, tier, and XP progress toward next rank
3. **QA overlay** shows rank name and tier alongside raw XP
4. **Rank-up** triggers a system dialogue ("AWANS: {rank name}") + HUD flash/pulse
5. **Rank is derived** from XP at runtime — no new state fields, no state migration

### Verification:

- Start new game → HUD shows "★ ??? Lv.1", XP bar at 0/101
- Complete quest 1 (+75 XP) → bar fills to ~74%, still rank ???
- Complete quest 2 (+100 XP, total 175) → rank-up to Space Scout triggers dialogue "AWANS: Space Scout", HUD updates to "★ Space Scout Lv.2", bar resets to show 74/900
- Terminal `/status` shows "Poziom: 2 (Space Scout)" and "XP: 175/1001"

## What We're NOT Doing

- **Rank unlocking gameplay mechanics** — ranks are cosmetic only (no command gating, area unlocking)
- **Persisting rank in state** — rank is always derived from XP
- **Polish rank names** — names stay in English per decision
- **Level-up sound effects** — only visual feedback (dialogue + HUD flash)
- **Rank-down mechanics** — XP never decreases

## Implementation Approach

Rank is a **pure derived value** from XP. A new `ranks.ts` module defines the 7 tiers and exports utility functions. All display consumers (HUD, terminal, QA) call these functions with the current XP to get rank info. Rank-up detection happens in `PhaserGame.svelte` by comparing old/new rank on `XP_GAINED` events, triggering a system dialogue after any existing dialogue completes.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Rank-up dialogue timing**: When XP is gained from quests/exams, a completion dialogue always plays first. The rank-up dialogue must wait for `DIALOGUE_DISMISSED` before firing. `PhaserGame.svelte` stores a `pendingRankUpDialogue` ID on rank-up detection, then triggers it on the next `DIALOGUE_DISMISSED` event.
- **HUD update timing**: The HUD's `onXpGained` handler updates the bar. Rank-up flash should be triggered by the `RANK_UP` event (separate from XP flash) to ensure it fires even if the bar animation is already in progress.

### User Experience Specification

- **XP bar per-rank**: Bar fills from 0% to 100% within the current rank's XP range, then resets to 0% on rank-up
- **HUD text**: Shows `{totalXP}/{nextRankThreshold} XP` (e.g. "175/1001 XP"). At max rank: "{totalXP} XP" (no denominator)
- **Rank-up dialogue**: 3-line system dialogue with auto-advance:
  - Line 1: "═══ AWANS ═══" (system, 2000ms)
  - Line 2: "Nowa ranga: {rank name}" (system, 2500ms)
  - Line 3: Flavor text per rank (system, 2500ms)
- **HUD rank-up flash**: 1200ms amber pulse on rank name + level text (longer than normal XP flash of 600ms)
- **Activity log**: Entry "Awans: {rank name}" added on rank-up

### Performance & Optimization Strategy

**N/A**: Rank calculation is a simple threshold lookup (O(1)), called only on XP change events (infrequent). No memoization needed.

### State Management Sequencing

- **No state changes**: Rank is derived from `state.xp` via `getRankForXP(xp)`. No new fields in `DemoGameState`.
- **Event flow**: `XP_GAINED` → `PhaserGame` detects rank change → emits `RANK_UP` → `GameHud` flashes → `DIALOGUE_DISMISSED` (from completion dialogue) → `PhaserGame` triggers rank-up dialogue via `DIALOGUE_SHOW`

### Debug & Observability Plan

- **QA overlay** shows: rank name, tier number, raw XP (already shows XP, add rank)
- **Dev log**: `[Ranks] Rank up: ??? → Space Scout (XP: 175)` on rank change
- **Terminal `/status`**: Shows full rank info including XP progress

---

## Phase 1: Core Rank Definitions & Events

### Overview

Create the rank definitions module and add the RANK_UP event.

### Changes Required:

#### 1. New file: Rank definitions and utilities

**File**: `src/explorers/config/ranks.ts`
**Changes**: Create new module with rank definitions, lookup function, and progress calculator

```typescript
import type { DialogueSequence } from '../systems/DialogueTypes';

export interface RankDefinition {
  tier: number;
  name: string;
  minXP: number;
}

export const RANKS: readonly RankDefinition[] = [
  { tier: 1, name: '???',                minXP: 0 },
  { tier: 2, name: 'Space Scout',        minXP: 101 },
  { tier: 3, name: 'Moon Engineer',      minXP: 1001 },
  { tier: 4, name: 'Solar Builder',      minXP: 2001 },
  { tier: 5, name: 'Stellar Explorer',   minXP: 3001 },
  { tier: 6, name: 'Cosmic Architect',   minXP: 4001 },
  { tier: 7, name: 'Deep Space Pioneer', minXP: 5001 },
] as const;

export interface RankInfo {
  rank: RankDefinition;
  nextRank: RankDefinition | null;
}

export interface RankProgress {
  xpInRank: number;
  xpForRank: number;
  percent: number;
  displayCurrent: number;  // total XP
  displayMax: number | null;  // next rank threshold, null for max rank
}

/** Get the rank for a given XP value. */
export function getRankForXP(xp: number): RankInfo {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXP) {
      current = rank;
    } else {
      break;
    }
  }

  const currentIndex = RANKS.indexOf(current);
  const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  return { rank: current, nextRank };
}

/** Get XP bar progress within the current rank. */
export function getRankProgress(xp: number): RankProgress {
  const { rank, nextRank } = getRankForXP(xp);

  if (!nextRank) {
    // Max rank — bar is full
    return {
      xpInRank: xp - rank.minXP,
      xpForRank: 0,
      percent: 100,
      displayCurrent: xp,
      displayMax: null,
    };
  }

  const xpInRank = xp - rank.minXP;
  const xpForRank = nextRank.minXP - rank.minXP;
  const percent = Math.min((xpInRank / xpForRank) * 100, 100);

  return {
    xpInRank,
    xpForRank,
    percent,
    displayCurrent: xp,
    displayMax: nextRank.minXP,
  };
}

// Rank-up dialogue definitions — registered into the global dialogue registry
// Polish in-game text, English rank names
const RANK_FLAVOR: Record<number, string> = {
  2: 'Systemy pokładowe rozpoznają twoje kompetencje.',
  3: 'Twoje umiejętności inżynieryjne robią wrażenie.',
  4: 'Budujesz coś wielkiego w kosmosie.',
  5: 'Gwiazdy nie mają przed tobą tajemnic.',
  6: 'Projektujesz przyszłość stacji kosmicznych.',
  7: 'Głęboka przestrzeń jest twoim domem.',
};

export function getRankUpDialogueId(tier: number): string {
  return `rank-up-tier-${tier}`;
}

export function buildRankUpDialogues(): Record<string, DialogueSequence> {
  const dialogues: Record<string, DialogueSequence> = {};

  for (const rank of RANKS) {
    if (rank.tier === 1) continue; // No rank-up dialogue for starting rank

    const id = getRankUpDialogueId(rank.tier);
    dialogues[id] = {
      id,
      lines: [
        { speaker: 'system', text: '═══ AWANS ═══', mode: 'system', autoAdvance: 2000 },
        { speaker: 'system', text: `Nowa ranga: ${rank.name}`, mode: 'system', autoAdvance: 2500 },
        { speaker: 'system', text: RANK_FLAVOR[rank.tier] ?? '', mode: 'system', autoAdvance: 2500 },
      ],
    };
  }

  return dialogues;
}
```

#### 2. Add RANK_UP event

**File**: `src/explorers/events/GameEvents.ts`
**Changes**: Add `RANK_UP` event constant and payload interface

Add to the `GameEvents` object under the `// Progression` comment:
```typescript
  // Progression
  XP_GAINED: 'xp:gained',
  RANK_UP: 'rank:up',
```

Add payload interface:
```typescript
export interface RankUpPayload {
  oldTier: number;
  oldName: string;
  newTier: number;
  newName: string;
  totalXP: number;
}
```

#### 3. Register rank-up dialogues in level loader

**File**: `src/explorers/levels/levelLoader.ts`
**Changes**: Import and merge rank-up dialogues into `allDialogues` during `loadAllLevels()`

At the end of the `loadAllLevels()` function, after processing all level manifests:
```typescript
import { buildRankUpDialogues } from '../config/ranks';

// Inside loadAllLevels(), after the manifest loop:
const rankUpDialogues = buildRankUpDialogues();
for (const [id, seq] of Object.entries(rankUpDialogues)) {
  allDialogues.set(id, seq);
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] `getRankForXP(0)` returns tier 1, `getRankForXP(101)` returns tier 2, `getRankForXP(5001)` returns tier 7
- [x] `getRankProgress(50)` returns `{ percent: ~49.5, displayCurrent: 50, displayMax: 101 }`
- [x] `buildRankUpDialogues()` returns 6 dialogues (tier 2–7)
- [x] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] N/A for this phase — no visible changes yet

**Implementation Note**: After completing this phase and all automated verification passes, proceed to Phase 2.

---

## Phase 2: HUD Integration

### Overview

Replace hardcoded rank/level/XP in the HUD with dynamic values derived from XP. Add rank-up flash animation.

### Changes Required:

#### 1. Update GameHud.svelte

**File**: `src/explorers/GameHud.svelte`
**Changes**: Import rank utilities, replace hardcoded values, add RANK_UP listener, extend flash for rank-up

**Script section changes:**

```typescript
// Add imports
import { getRankForXP, getRankProgress } from './config/ranks';
import type { RankUpPayload } from './events/GameEvents';

// Remove: const XP_MAX = 100;

// Add state
let rankName = '???';
let rankTier = 1;
let rankUpFlash = false;

// Replace onXpGained:
function onXpGained(payload: XpGainedPayload) {
  xp = payload.total;
  const progress = getRankProgress(payload.total);
  const info = getRankForXP(payload.total);
  rankName = info.rank.name;
  rankTier = info.rank.tier;
  xpWidth.set(progress.percent);

  // Flash effect
  xpFlash = true;
  setTimeout(() => { xpFlash = false; }, 600);
}

// Replace onStateChanged:
function onStateChanged(payload: StateChangedPayload) {
  xp = payload.state.xp;
  const progress = getRankProgress(payload.state.xp);
  const info = getRankForXP(payload.state.xp);
  rankName = info.rank.name;
  rankTier = info.rank.tier;
  xpWidth.set(progress.percent, { duration: 0 });
}

// Add rank-up handler:
function onRankUp(payload: RankUpPayload) {
  rankUpFlash = true;
  setTimeout(() => { rankUpFlash = false; }, 1200);
}

// Update onMount initial state read:
if (state) {
  xp = state.xp;
  const progress = getRankProgress(state.xp);
  const info = getRankForXP(state.xp);
  rankName = info.rank.name;
  rankTier = info.rank.tier;
  xpWidth.set(progress.percent, { duration: 0 });
}

// Add event listener in onMount:
game.events.on(GameEvents.RANK_UP, onRankUp);

// Add cleanup in onDestroy:
game.events.off(GameEvents.RANK_UP, onRankUp);
```

**Template section changes:**

Replace lines 72-77:
```svelte
<span class="rank" class:rank-up-flash={rankUpFlash}>★ {rankName}</span>
<span class="level" class:rank-up-flash={rankUpFlash}>Lv.{rankTier}</span>
<div class="xp-bar-bg">
  <div class="xp-bar-fill" style="width: {$xpWidth}%"></div>
</div>
{@const progress = getRankProgress(xp)}
<span class="xp-text" class:xp-flash={xpFlash}>
  {#if progress.displayMax !== null}
    {xp}/{progress.displayMax} XP
  {:else}
    {xp} XP
  {/if}
</span>
```

**Style section — add rank-up flash:**
```css
.rank-up-flash {
  color: #ffb347;
  text-shadow: 0 0 8px rgba(255, 179, 71, 0.6);
  animation: rank-pulse 1.2s ease-out;
}

@keyframes rank-pulse {
  0% { transform: scale(1); }
  20% { transform: scale(1.15); }
  40% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] New game: HUD shows "★ ??? Lv.1" and "0/101 XP"
- [ ] After earning 75 XP (quest 1): HUD shows "★ ??? Lv.1" and "75/101 XP", bar at ~74%
- [ ] After earning 175 XP total (quest 1+2): HUD shows "★ Space Scout Lv.2" and "175/1001 XP", bar at ~8%
- [ ] XP gain flash still works (600ms amber)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Terminal & QA Overlay

### Overview

Update the terminal `/status` command and QA overlay to display dynamic rank information.

### Changes Required:

#### 1. Update terminal /status command

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes**: Import rank utilities, replace hardcoded rank/XP display

Add import:
```typescript
import { getRankForXP, getRankProgress } from '../config/ranks';
```

Replace lines 107-109 in `cmdStatus()`:
```typescript
const { rank, nextRank } = getRankForXP(state.xp);
const progress = getRankProgress(state.xp);
const xpDisplay = progress.displayMax !== null
  ? `${state.xp}/${progress.displayMax}`
  : `${state.xp}`;

// In the output array, replace:
`  Poziom: ${rank.tier} (${rank.name})`,
`  XP: ${xpDisplay}`,
```

The full status astronaut section becomes:
```typescript
'Astronauta:',
`  Poziom: ${rank.tier} (${rank.name})`,
`  XP: ${xpDisplay}`,
`  Certyfikacje: ${state.exams?.completed.length ?? 0}`,
`  Lokalizacja: ${locationName}`,
```

#### 2. Update QA overlay

**File**: `src/explorers/QaOverlay.svelte`
**Changes**: Show rank name and tier alongside XP

Add import:
```typescript
import { getRankForXP } from './config/ranks';
```

Replace lines 134-137 (the XP display section):
```svelte
<div>
  <span class="text-gray-500">XP:</span>
  <span class="text-amber-300">{state.xp}</span>
  <span class="text-gray-500 ml-1">Rank:</span>
  <span class="text-teal-400">{getRankForXP(state.xp).rank.name} (Lv.{getRankForXP(state.xp).rank.tier})</span>
</div>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] Terminal `/status` shows "Poziom: 1 (???)" and "XP: 0/101" at start
- [ ] After earning XP, terminal shows updated rank and XP
- [ ] QA overlay (append `?qa` to URL) shows rank name and tier next to XP value

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Rank-Up Detection & Dialogue

### Overview

Wire rank-up detection, trigger rank-up system dialogue after any active dialogue completes, add activity log entry, and emit RANK_UP event for HUD flash.

### Changes Required:

#### 1. Add rank-up detection to PhaserGame.svelte

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Import rank utilities, detect rank changes on XP_GAINED, queue rank-up dialogue after DIALOGUE_DISMISSED, add activity log entry, emit RANK_UP

Add imports:
```typescript
import { getRankForXP, getRankUpDialogueId } from './config/ranks';
import type { XpGainedPayload } from './events/GameEvents';
```

Add rank-up wiring inside the `onMount()` block (after the existing activity log wiring, around line 101):
```typescript
// Rank-up detection
let pendingRankUpDialogue: string | null = null;

game.events.on(GameEvents.XP_GAINED, (p: XpGainedPayload) => {
  const oldRank = getRankForXP(p.total - p.amount);
  const newRank = getRankForXP(p.total);

  if (oldRank.rank.tier !== newRank.rank.tier) {
    pendingRankUpDialogue = getRankUpDialogueId(newRank.rank.tier);
    addLogEntry(`Awans: ${newRank.rank.name}`);

    game!.events.emit(GameEvents.RANK_UP, {
      oldTier: oldRank.rank.tier,
      oldName: oldRank.rank.name,
      newTier: newRank.rank.tier,
      newName: newRank.rank.name,
      totalXP: p.total,
    });
  }
});

game.events.on(GameEvents.DIALOGUE_DISMISSED, () => {
  if (pendingRankUpDialogue) {
    const dialogueId = pendingRankUpDialogue;
    pendingRankUpDialogue = null;
    // Short delay for visual breathing room between dialogues
    setTimeout(() => {
      game!.events.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
    }, 400);
  }
});
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] Complete quest 1 (+75 XP → total 75): NO rank-up (still ???)
- [ ] Complete quest 2 (+100 XP → total 175): rank-up triggers
  - Quest completion dialogue plays first
  - After dismissing, rank-up dialogue appears: "═══ AWANS ═══ / Nowa ranga: Space Scout / Systemy pokładowe rozpoznają twoje kompetencje."
  - HUD flashes amber on rank name and level text for ~1.2s
  - HUD updates to "★ Space Scout Lv.2"
- [ ] Activity log (`/log`) shows "Awans: Space Scout" entry
- [ ] After completing exam (+150 XP → total 325): NO rank-up (still Space Scout since 325 < 1001)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

---

## Testing Strategy

### Unit Tests:

Add tests in `src/explorers/config/ranks.test.ts`:
- `getRankForXP` returns correct rank for boundary values: 0, 100, 101, 1000, 1001, 5000, 5001, 9999
- `getRankProgress` returns correct percentages at boundaries
- `getRankProgress` returns 100% for max rank
- `buildRankUpDialogues` returns 6 dialogues (tiers 2–7)
- `getRankUpDialogueId` returns expected format

### Manual Testing Steps:

1. Start fresh game (reset state) → verify "★ ??? Lv.1" in HUD
2. Earn XP through quests → verify bar fills within rank range
3. Cross a rank threshold → verify rank-up dialogue + HUD flash
4. Check `/status` shows correct rank at each stage
5. Check `/log` contains rank-up entries
6. Check QA overlay shows rank info

## Performance Considerations

None significant. `getRankForXP()` is an O(1) linear scan over 7 items, called only on XP events (infrequent). No caching or memoization needed.

## Migration Notes

**No state migration required.** Rank is derived from `state.xp` at runtime. Existing saves with accumulated XP will immediately show the correct rank on load.

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/explorers/config/ranks.ts` | **CREATE** | Rank definitions, utility functions, rank-up dialogues |
| `src/explorers/config/ranks.test.ts` | **CREATE** | Unit tests for rank utilities |
| `src/explorers/events/GameEvents.ts` | MODIFY | Add `RANK_UP` event + `RankUpPayload` |
| `src/explorers/levels/levelLoader.ts` | MODIFY | Register rank-up dialogues in global registry |
| `src/explorers/GameHud.svelte` | MODIFY | Dynamic rank/level/XP bar, rank-up flash |
| `src/explorers/terminal/commandHandler.ts` | MODIFY | Dynamic `/status` rank display |
| `src/explorers/QaOverlay.svelte` | MODIFY | Show rank info in QA overlay |
| `src/explorers/PhaserGame.svelte` | MODIFY | Rank-up detection, dialogue triggering, activity log |

## References

- Research: `thoughts/shared/research/2026-02-22-xp-level-rank-progression.md`
- Game cookbook: `.ai/10x-devs/game/cookbook.md`
- Current XP handling: `src/explorers/systems/QuestManager.ts:76-93`, `src/explorers/systems/ExamManager.ts:69-109`
