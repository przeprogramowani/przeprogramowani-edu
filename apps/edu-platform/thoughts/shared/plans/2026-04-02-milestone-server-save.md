# Milestone-Triggered Immediate Server Saves — Implementation Plan

## Overview

Currently, game state is saved to the server via a 5-second debounced handler on `STATE_CHANGED` events. This means high-value milestones (quest completion, flag reception, exam completion, rank-up) can be lost if the browser closes within the debounce window.

This plan adds **immediate server saves** for milestone events, ensuring progression is persisted reliably without relying solely on the debounce timer or the `beforeunload` fallback.

## Current State Analysis

### Server save triggers today

| Trigger | Mechanism | Timing | Reliability |
|---------|-----------|--------|-------------|
| `STATE_CHANGED` | Debounced fetch | 5s delay | Good, but 5s window risk |
| `beforeunload` | `keepalive: true` fetch | On page exit | Unreliable across browsers |
| Pending grants applied | Direct fetch | Immediate | Good |

### Event chain on quest completion (`QuestManager.completeQuest`)

1. `setState()` → emits `STATE_CHANGED` → starts 5s debounce
2. Emits `XP_GAINED`
3. Emits `QUEST_COMPLETED`
4. Sets reward flags (1..N) → each emits `STATE_CHANGED` + `FLAG_SET`

Key insight: reward flags are set **after** `QUEST_COMPLETED` fires. A naive immediate save on `QUEST_COMPLETED` would miss the flags.

### Key files

- `src/explorers/PhaserGame.svelte:61-72` — `debouncedServerSave()` (5s debounce)
- `src/explorers/PhaserGame.svelte:285-288` — `STATE_CHANGED` listener
- `src/explorers/state/flagManager.ts:11-28` — `setFlag()` emits `STATE_CHANGED` + `FLAG_SET`
- `src/explorers/systems/QuestManager.ts:286-333` — `completeQuest()` event chain
- `src/explorers/systems/ExamManager.ts:82-141` — `completeExam()` event chain
- `src/explorers/events/GameEvents.ts` — event constants

## Desired End State

After implementation:
- Quest completions, flag receptions, exam completions, and rank-ups trigger an **immediate** server save
- Multiple milestone events in the same synchronous chain (e.g., quest completion + 3 reward flags) are **coalesced into a single save**
- The existing 5s debounced save for routine state changes (position, facing) remains unchanged
- The 30s localStorage auto-save timer remains unchanged
- No user-visible feedback for saves

### Verification

- Complete a quest → check server logs or KV → state is saved within ~0ms, not 5s
- Set a flag via dialogue → same immediate save
- Complete an exam → same
- Gain enough XP for rank-up → same
- Rapid flag setting (e.g., quest with 3 reward flags) → only 1 server save, not 3

## What We're NOT Doing

- Not changing the 30s localStorage auto-save timer
- Not adding UI feedback for saves
- Not changing the `beforeunload` save behavior
- Not adding retry logic for failed milestone saves
- Not changing server-side save logic (KV + Supabase dual-write)

## Implementation Approach

Use a **microtask coalescing pattern**: when any milestone event fires, queue a microtask to save. Multiple milestone events in the same synchronous chain (e.g., quest completion → flag1 → flag2 → flag3) will only produce a single save because subsequent calls see the microtask already queued.

The microtask reads the **current** state from the Phaser registry, which by that point includes all synchronous mutations from the entire event chain. It also cancels any pending debounce timer to avoid a redundant save 5s later.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**Microtask vs setTimeout**: `queueMicrotask` runs after all synchronous code in the current task completes but before any macrotasks (like the 5s debounce `setTimeout`). This guarantees:
1. All synchronous state mutations from the event chain are applied
2. The save fires before any debounce timeout could
3. No unnecessary delay

**Race with debounce**: The microtask clears the pending debounce timer, preventing a duplicate save 5s later. If new `STATE_CHANGED` events fire after the microtask (e.g., from user movement), they'll start a fresh debounce normally.

### Performance & Optimization Strategy

- **Coalescing**: The `milestoneSavePending` flag ensures at most one microtask is queued per synchronous event chain
- **No extra network calls**: A quest completion with 3 reward flags produces 1 fetch instead of 4
- **Fire-and-forget**: Like the existing debounced save, errors are logged but don't block gameplay

### Debug & Observability Plan

- Add `[GameState] Milestone save` console log to distinguish milestone saves from debounced saves
- Existing `[GameState] Server save failed:` error logging applies to milestone saves too

---

## Phase 1: Add Immediate Milestone Save

### Overview

Add a `scheduleImmediateServerSave()` function and wire it to milestone events, all within `PhaserGame.svelte`.

### Changes Required:

#### 1. Add `scheduleImmediateServerSave` function

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Add a new function after `debouncedServerSave`, and a `milestoneSavePending` flag.

```typescript
let milestoneSavePending = false;

function scheduleImmediateServerSave(): void {
  if (!userEmail || milestoneSavePending) return;
  milestoneSavePending = true;
  queueMicrotask(() => {
    milestoneSavePending = false;
    // Cancel pending debounce — this immediate save supersedes it
    if (serverSaveTimeout) {
      clearTimeout(serverSaveTimeout);
      serverSaveTimeout = null;
    }
    const state = game?.registry.get('demoGameState') as GameState | undefined;
    if (state) {
      console.log('[GameState] Milestone save');
      fetch('/api/game/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      }).catch((err) => console.error('[GameState] Milestone server save failed:', err));
    }
  });
}
```

#### 2. Wire milestone event listeners

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Add listeners after the existing `STATE_CHANGED` listener (line 288).

```typescript
// Immediate server save on milestones (bypasses 5s debounce)
game.events.on(GameEvents.QUEST_COMPLETED, () => scheduleImmediateServerSave());
game.events.on(GameEvents.FLAG_SET, () => scheduleImmediateServerSave());
game.events.on(GameEvents.EXAM_COMPLETED, () => scheduleImmediateServerSave());
game.events.on(GameEvents.RANK_UP, () => scheduleImmediateServerSave());
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test` (4 pre-existing failures unrelated to this change — missing `@przeprogramowani/common/src/circle` module)
- [x] No lint errors

#### Manual Verification:

- [ ] Complete a quest → browser DevTools Network tab shows immediate PUT to `/api/game/state` (not delayed 5s)
- [ ] The console shows `[GameState] Milestone save` log
- [ ] Complete a quest with multiple reward flags → only 1 milestone save in Network tab (coalescing works)
- [ ] Walk around after milestone → normal debounced saves still happen after 5s
- [ ] Close browser tab immediately after quest completion → state is preserved on next load

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

No new unit tests needed — the change is a thin wiring layer in the Svelte component using existing Phaser event infrastructure. The coalescing logic is simple enough (single boolean flag + `queueMicrotask`) that it doesn't warrant isolated testing.

### Manual Testing Steps:

1. **Quest completion**: Activate and complete a quest. Verify Network tab shows immediate PUT request with full state (including reward flags and XP).
2. **Exam completion**: Pass an exam. Verify immediate save.
3. **Flag via dialogue**: Trigger a dialogue that sets a flag. Verify immediate save.
4. **Coalescing**: Complete a quest with 3+ reward flags. Verify only 1 milestone save (not 4+).
5. **No regression**: Walk around. Verify debounced saves still fire after 5s of movement.
6. **Page close resilience**: Complete a quest, immediately close the tab. Reopen → verify progression is saved.

## Performance Considerations

- Milestone events are infrequent (minutes apart in normal gameplay), so the additional immediate saves add negligible load
- Coalescing prevents burst saves during quest completion chains
- No change to the KV + Supabase dual-write server path — just triggered sooner

## References

- Current save architecture: `src/explorers/PhaserGame.svelte:61-72` (debounce), `src/server/game/serverGameStateManager.ts:65-83` (dual-write)
- Flag manager: `src/explorers/state/flagManager.ts`
- Quest completion flow: `src/explorers/systems/QuestManager.ts:286-333`
- Exam completion flow: `src/explorers/systems/ExamManager.ts:82-141`
