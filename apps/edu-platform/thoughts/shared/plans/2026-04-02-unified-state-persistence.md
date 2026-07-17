# Unified Game State Persistence — Implementation Plan

## Overview

Refactor game state persistence so that a single `GamePersistence` module handles **all** save operations — localStorage writes on every state change, plus conditional server sync for authenticated users. This replaces the current scattered pattern where `saveState()` calls are sprinkled across 13+ call sites and server saves are handled separately by `ServerSaveManager`.

## Current State Analysis

### The problem

State persistence is split across two unrelated systems with no shared entry point:

1. **localStorage** — `saveState()` from `GameStateManager.ts` called explicitly at 13+ scattered sites
2. **Server** — `ServerSaveManager` wired via event listeners in `PhaserGame.svelte`

This creates duplication, inconsistency (some mutations save to localStorage, others don't), and cognitive overhead (developers must remember to call `saveState()` at the right time).

### Key Discoveries

- **13 explicit `saveState()` calls** across flagManager, GameScene, TransitionScene, SmartTerminal, QaOverlay, PhaserGame
- **8 sites emit STATE_CHANGED** (flagManager, BaseScene, DialogueManager, BookmarkManager, PhaserGame, SmartTerminal, QaOverlay)
- **30s auto-save timer** in `GameScene.ts:344-356` calls both `updateState()` (→ STATE_CHANGED) and `saveState()` — redundant if STATE_CHANGED handles localStorage
- **`skipSave` flag** checked at 5 different sites — should be centralized
- **Two special cases** that must remain outside the unified flow:
  - `PhaserGame.svelte:105` — init merge before Phaser boots (no events yet)
  - `QaOverlay.svelte:183` — reset flow intentionally bypasses normal persistence

### Key files

- `src/explorers/state/GameStateManager.ts` — `saveState()` / `loadState()` / merge functions
- `src/explorers/state/ServerSaveManager.ts` — server-only save logic (to be replaced)
- `src/explorers/PhaserGame.svelte` — event wiring, beforeunload handler
- `src/explorers/state/flagManager.ts:23-25` — explicit `saveState()` after flag set
- `src/explorers/scenes/GameScene.ts:344-356` — 30s auto-save timer
- `src/explorers/scenes/GameScene.ts:375-381` — shutdown save
- `src/explorers/scenes/GameScene.ts:579-580` — intro (no cinematic) save
- `src/explorers/scenes/GameScene.ts:665-666` — intro spotlight complete save
- `src/explorers/scenes/GameScene.ts:771-772` — end screen save
- `src/explorers/scenes/TransitionScene.ts:60` — map transition save
- `src/explorers/SmartTerminal.svelte:92` — boot sequence save
- `src/explorers/QaOverlay.svelte:148-158,168-176` — QA debug saves

## Desired End State

After implementation:

- **One module** (`GamePersistence`) owns all save decisions
- Every `STATE_CHANGED` event writes to localStorage immediately and (if authenticated) queues a debounced server save
- Milestone events (`QUEST_COMPLETED`, `FLAG_SET`, `EXAM_COMPLETED`, `RANK_UP`) upgrade the pending server save to immediate (via microtask coalescing)
- `beforeunload` calls `GamePersistence.flush()` for a sync localStorage write + keepalive server save
- `skipSave` is checked in exactly one place — inside `GamePersistence`
- All redundant `saveState()` calls across the codebase are removed
- The 30s auto-save timer in GameScene is removed (STATE_CHANGED already persists every mutation)
- `ServerSaveManager.ts` is deleted

### Verification

- Complete a quest → state appears in localStorage immediately, server save fires within microtask
- Walk around → localStorage updates on every position change, server save fires after 5s debounce
- Set `skipSave` via QA → no saves occur
- Close browser tab → beforeunload flushes to both localStorage and server
- Reset via QA overlay → special flow still works (bypasses unified handler)
- Boot the game → init merge still saves to localStorage before Phaser starts

## What We're NOT Doing

- Not changing server-side save logic (KV + Supabase dual-write)
- Not changing the merge/load logic in `GameStateManager.ts`
- Not adding retry logic or offline queue
- Not changing the `QaOverlay` reset flow (it intentionally bypasses normal persistence)
- Not changing the init merge in `PhaserGame.svelte` (happens before Phaser boots)
- Not adding UI feedback for saves

## Implementation Approach

Replace `ServerSaveManager` with `GamePersistence` — a module that always writes to localStorage on state changes and conditionally delegates to the server. The `STATE_CHANGED` event becomes the single trigger for all routine persistence. Milestone events upgrade the server save timing from debounced to immediate.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**localStorage writes are synchronous** (~1ms) and happen inside the `STATE_CHANGED` handler, so state is persisted before any subsequent code runs. This is safer than the current approach where some mutations rely on the 30s timer to eventually persist.

**Server saves remain async fire-and-forget**, with the same debounce (5s) and milestone microtask coalescing patterns from the previous `ServerSaveManager`.

**The 30s auto-save timer becomes unnecessary**: currently it calls `updateState()` (which emits STATE_CHANGED) and then `saveState()`. With the unified handler, the `updateState()` call already triggers localStorage + server save. The explicit `saveState()` and the timer itself are redundant. However, the `updateState()` call that captures player position still needs to happen — it should be triggered by player movement or scene updates, not a timer. Looking at the code, the 30s timer's `updateState()` captures position/facing. Without the timer, position will still be saved whenever any other STATE_CHANGED fires (flag set, quest progress, etc.) since position is part of the full state. For the edge case where a player only walks around without triggering any events, the debounced server save from the STATE_CHANGED emitted by `updateState` during scene shutdown (line 376) covers it. The `beforeunload` handler is the ultimate safety net.

**Wait — the 30s timer also EMITS STATE_CHANGED** via `updateState()`. So if we keep the timer but remove the explicit `saveState()`, the unified STATE_CHANGED handler picks up the localStorage write automatically. But the plan is to remove the timer entirely since STATE_CHANGED already handles persistence. The question is: what triggers position capture without the timer? Answer: Scene shutdown (`GameScene.ts:376`) captures position, and `beforeunload` saves the full state. For mid-session position persistence, the GameScene auto-save timer served that purpose. We should keep the timer but simplify it — it should only call `updateState()` to capture position, and let the STATE_CHANGED handler do the rest. Remove the explicit `saveState()` call.

### Performance & Optimization Strategy

- localStorage writes on every STATE_CHANGED add negligible overhead (~1ms per write, JSON.stringify of ~2KB state)
- Server debounce (5s) unchanged — no additional network calls
- Milestone coalescing unchanged — quest with 3 reward flags still produces 1 server save
- Removing the 30s timer's explicit `saveState()` call eliminates one redundant localStorage write every 30s

### Debug & Observability Plan

- `[GamePersistence] State persisted` log on every localStorage write (behind `devLog` so production-silent)
- `[GamePersistence] Server save (debounced)` on debounced server save fire
- `[GamePersistence] Milestone save` on immediate milestone save
- `[GamePersistence] Flush` on beforeunload
- `[GamePersistence] Skipped (skipSave)` when skipSave gate prevents a save

---

## Phase 1: Create GamePersistence Module

### Overview

Create `GamePersistence` to replace `ServerSaveManager`, handling both localStorage and server saves through a unified API.

### Changes Required:

#### 1. Create `GamePersistence` module

**File**: `src/explorers/state/GamePersistence.ts`
**Changes**: New file replacing `ServerSaveManager.ts`

```typescript
import { saveState } from './GameStateManager';
import { devLog } from '../utils/logger';
import type { GameState } from './types';

const SAVE_ENDPOINT = '/api/game/state';
const DEBOUNCE_MS = 5000;

export class GamePersistence {
  private getState: () => GameState | undefined;
  private skipSaveCheck: () => boolean;
  private authenticated: boolean;
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  private milestonePending = false;

  constructor(options: {
    getState: () => GameState | undefined;
    authenticated: boolean;
    skipSaveCheck: () => boolean;
  }) {
    this.getState = options.getState;
    this.authenticated = options.authenticated;
    this.skipSaveCheck = options.skipSaveCheck;
  }

  /** Called on every STATE_CHANGED — always saves to localStorage, queues debounced server save. */
  persist(state: GameState): void {
    if (this.skipSaveCheck()) {
      devLog('[GamePersistence] Skipped (skipSave)');
      return;
    }
    saveState(state);
    if (this.authenticated) {
      this.debouncedServerSave(state);
    }
  }

  /** Called on milestone events — upgrades pending server save to immediate via microtask. */
  persistMilestone(): void {
    if (!this.authenticated || this.milestonePending) return;
    this.milestonePending = true;
    queueMicrotask(() => {
      this.milestonePending = false;
      if (this.skipSaveCheck()) return;
      // Cancel pending debounce — this immediate save supersedes it
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = null;
      }
      const state = this.getState();
      if (state) {
        console.log('[GamePersistence] Milestone save');
        fetch(SAVE_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        }).catch((err) => console.error('[GamePersistence] Milestone server save failed:', err));
      }
    });
  }

  /** Emergency save for beforeunload — sync localStorage + keepalive server save. */
  flush(state: GameState): void {
    saveState(state);
    if (this.authenticated) {
      fetch(SAVE_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  /** Cancel pending timers. Call on component teardown. */
  destroy(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  private debouncedServerSave(state: GameState): void {
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.debounceTimeout = null;
      fetch(SAVE_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      }).catch((err) => console.error('[GamePersistence] Server save failed:', err));
    }, DEBOUNCE_MS);
  }
}
```

#### 2. Delete `ServerSaveManager.ts`

**File**: `src/explorers/state/ServerSaveManager.ts`
**Changes**: Delete this file entirely.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test`

#### Manual Verification:

- [x] N/A — module not yet wired up

**Implementation Note**: Phase 1 and Phase 2 should be implemented together since deleting `ServerSaveManager.ts` will break the build until `PhaserGame.svelte` is updated.

---

## Phase 2: Wire GamePersistence and Remove Redundant Saves

### Overview

Replace `ServerSaveManager` usage in `PhaserGame.svelte`, remove all redundant `saveState()` calls across the codebase, and simplify the 30s auto-save timer.

### Changes Required:

#### 1. Update `PhaserGame.svelte`

**File**: `src/explorers/PhaserGame.svelte`
**Changes**:
- Replace `ServerSaveManager` import with `GamePersistence`
- Replace `serverSaveManager` variable with `persistence`
- Instantiate with `skipSaveCheck` that reads from game registry
- Update STATE_CHANGED listener to call `persistence.persist(state)`
- Update milestone listeners to call `persistence.persistMilestone()`
- Update beforeunload to call `persistence.flush(state)`
- Remove `saveState` import (no longer needed in this file except for the init merge)

```typescript
// Import change
import { GamePersistence } from './state/GamePersistence';

// Variable change
let persistence: GamePersistence | null = null;

// Instantiation (after game is created, inside onMount)
persistence = new GamePersistence({
  getState: () => game?.registry.get('demoGameState') as GameState | undefined,
  authenticated: !!userEmail,
  skipSaveCheck: () => !!game?.registry.get('skipSave'),
});

// STATE_CHANGED listener — unified persistence
game.events.on(GameEvents.STATE_CHANGED, ({ state }: StateChangedPayload) => {
  persistence!.persist(state);
});

// Milestone listeners
game.events.on(GameEvents.QUEST_COMPLETED, () => persistence!.persistMilestone());
game.events.on(GameEvents.FLAG_SET, () => persistence!.persistMilestone());
game.events.on(GameEvents.EXAM_COMPLETED, () => persistence!.persistMilestone());
game.events.on(GameEvents.RANK_UP, () => persistence!.persistMilestone());

// beforeunload — simplified
function onBeforeUnload() {
  if (game?.registry.get('skipSave')) return;
  const state = game?.registry.get('demoGameState') as GameState | undefined;
  if (state) {
    persistence?.flush(state);
  }
}

// Cleanup
persistence?.destroy();
```

Note: The `saveState` import must remain for the **init merge** path (`saveState(mergedState)` at line 105) since that runs before Phaser boots and before `GamePersistence` is instantiated.

Note: The milestone listeners no longer need the `if (userEmail)` gate since `GamePersistence.persistMilestone()` handles the `authenticated` check internally. The STATE_CHANGED listener also no longer needs the `if (userEmail)` gate since `persist()` always saves to localStorage (the server save is internally gated on `authenticated`).

#### 2. Remove `saveState()` from `flagManager.ts`

**File**: `src/explorers/state/flagManager.ts`
**Changes**: Remove the `saveState` import and both `saveState()` calls. The `STATE_CHANGED` event emitted by `setFlag` and `removeFlag` now triggers the unified persistence handler.

Remove from `setFlag()` (lines 23-25):
```typescript
// DELETE these lines:
if (!game.registry.get('skipSave')) {
  saveState(next);
}
```

Remove from `removeFlag()` (lines 38-39):
```typescript
// DELETE these lines:
if (!game.registry.get('skipSave')) {
  saveState(next);
}
```

Remove import:
```typescript
// DELETE: import { saveState } from './GameStateManager';
```

The `skipSave` check is now handled centrally in `GamePersistence.persist()`.

#### 3. Simplify auto-save timer in `GameScene.ts`

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Remove the explicit `saveState()` call from the 30s auto-save timer. The timer still captures position/facing via `updateState()` (which emits STATE_CHANGED → unified handler saves to localStorage + server).

```typescript
// BEFORE:
this.autoSaveTimer = this.time.addEvent({
  delay: SAVE_INTERVAL_MS,
  callback: () => {
    if (this.game.registry.get('skipSave')) return;
    this.updateState((s) => ({
      position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
      facing: this.player.facing,
    }));
    saveState(this.gameState);
  },
  loop: true,
});

// AFTER:
this.autoSaveTimer = this.time.addEvent({
  delay: SAVE_INTERVAL_MS,
  callback: () => {
    this.updateState((s) => ({
      position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
      facing: this.player.facing,
    }));
  },
  loop: true,
});
```

The `skipSave` check is removed because `GamePersistence.persist()` handles it centrally.

#### 4. Remove `saveState()` from GameScene shutdown handler

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Remove the explicit `saveState()` and `skipSave` check from the shutdown handler (lines 374-381). The `updateState()` call emits STATE_CHANGED which triggers unified persistence.

```typescript
// BEFORE:
if (!this.game.registry.get('skipSave')) {
  this.updateState((s) => ({
    position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
    facing: this.player.facing,
  }));
  saveState(this.gameState);
}

// AFTER:
this.updateState((s) => ({
  position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
  facing: this.player.facing,
}));
```

#### 5. Remove `saveState()` from GameScene intro paths

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Remove explicit `saveState()` calls after `setFlag()` in intro sequences. `setFlag()` emits STATE_CHANGED → unified handler saves.

Line 580 (no cinematic path):
```typescript
// BEFORE:
this.setFlag(introConfig.flag);
saveState(this.gameState);

// AFTER:
this.setFlag(introConfig.flag);
```

Line 665-666 (spotlight complete):
```typescript
// BEFORE:
this.setFlag(introConfig.flag);
saveState(this.gameState);

// AFTER:
this.setFlag(introConfig.flag);
```

Line 772 (end screen):
```typescript
// BEFORE:
saveState(this.gameState);

// AFTER:
// Remove entirely — state was already saved by the most recent STATE_CHANGED
```

After removing all `saveState()` calls, remove the `saveState` import from `GameScene.ts`.

#### 6. Remove `saveState()` from `TransitionScene.ts`

**File**: `src/explorers/scenes/TransitionScene.ts`
**Changes**: Remove explicit `saveState()` after `updateState()`. The `updateState()` call emits STATE_CHANGED → unified handler saves.

```typescript
// BEFORE:
this.updateState((s) => ({
  currentMap: payload.targetMap as MapKey,
  position: { ... },
}));
saveState(this.gameState);

// AFTER:
this.updateState((s) => ({
  currentMap: payload.targetMap as MapKey,
  position: { ... },
}));
```

Remove the `saveState` import from `TransitionScene.ts`.

#### 7. Remove `saveState()` from `SmartTerminal.svelte`

**File**: `src/explorers/SmartTerminal.svelte`
**Changes**: Remove explicit `saveState()` after boot sequence. `setFlag()` (line 90) already emits STATE_CHANGED.

```typescript
// BEFORE:
setFlag(game, FLAGS.TERMINAL_UNLOCKED);
getBus().emit(GameEvents.TERMINAL_UNLOCK);
saveState(getState());

// AFTER:
setFlag(game, FLAGS.TERMINAL_UNLOCKED);
getBus().emit(GameEvents.TERMINAL_UNLOCK);
```

Remove the `saveState` import from `SmartTerminal.svelte`.

#### 8. Remove redundant `saveState()` from `QaOverlay.svelte`

**File**: `src/explorers/QaOverlay.svelte`
**Changes**: Remove the explicit `saveState()` call in `setXP()` (line 174). The `STATE_CHANGED` emission on line 173 triggers the unified handler.

```typescript
// BEFORE (setXP):
game.events.emit(GameEvents.STATE_CHANGED, { state: next });
saveState(next);
syncStateToServer(next);

// AFTER (setXP):
game.events.emit(GameEvents.STATE_CHANGED, { state: next });
syncStateToServer(next);
```

**Keep unchanged**: `resetState()` (line 183) — this intentionally bypasses normal persistence since `skipSave` is set.

Remove the `saveState` import from `QaOverlay.svelte` — **only if** `resetState()` doesn't need it. Check: `resetState()` at line 183 calls `saveState(freshState)` while `skipSave` is true, intentionally bypassing the unified handler. This import must remain.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test`
- [x] No lint errors

#### Manual Verification:

- [ ] Complete a quest → localStorage has updated state immediately, Network tab shows immediate PUT
- [ ] Console shows `[GamePersistence] Milestone save` log
- [ ] Walk around for 30s → localStorage updates on auto-save timer, server save fires after 5s debounce
- [ ] Complete a quest with multiple reward flags → only 1 milestone server save (coalescing works)
- [ ] Walk around after milestone → debounced server saves resume normally
- [ ] Close browser tab immediately after quest completion → state preserved on next load
- [ ] QA overlay: reset state → clears properly, no stale state leaks
- [ ] QA overlay: set XP → syncs to both localStorage and server
- [ ] Map transition (walk through door) → state saved before transition completes
- [ ] `skipSave` set via QA → no saves occur until unset

**Implementation Note**: After completing both phases and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful.

---

## Testing Strategy

### Unit Tests:

No new unit tests needed. The change is a thin wiring/coordination layer. The individual `saveState()` function and server save logic are unchanged — only the call sites are consolidated.

### Manual Testing Steps:

1. **Quest completion**: Complete a quest. Verify Network tab shows immediate PUT and localStorage is updated.
2. **Position persistence**: Walk around, wait 30s. Verify localStorage has current position (auto-save timer still captures position).
3. **Flag via dialogue**: Trigger a dialogue that sets a flag. Verify localStorage updates immediately.
4. **Map transition**: Walk through a door. Reload page. Verify you're on the new map.
5. **Browser close**: Complete a quest, immediately close tab. Reopen → verify progression saved.
6. **QA reset**: Use QA overlay to reset state. Verify clean reset.
7. **skipSave**: Set skipSave via QA, make state changes, verify nothing is saved.

## Performance Considerations

- localStorage writes on every STATE_CHANGED: ~1ms per write for ~2KB JSON. Negligible.
- No increase in server save frequency — debounce and milestone coalescing unchanged.
- Removing redundant `saveState()` calls slightly reduces total localStorage writes.

## References

- Previous plan: `thoughts/shared/plans/2026-04-02-milestone-server-save.md`
- Current server save logic: `src/explorers/state/ServerSaveManager.ts`
- localStorage save function: `src/explorers/state/GameStateManager.ts:49-52`
- Auto-save timer: `src/explorers/scenes/GameScene.ts:344-356`
- Flag manager saves: `src/explorers/state/flagManager.ts:23-25, 38-39`
