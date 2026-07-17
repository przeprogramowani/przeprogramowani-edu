---
date: 2026-03-05T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: f0dfda764d4eb65cdea1566b82890ddbb381927c
branch: master
repository: przeprogramowani-sites
topic: "XP not updated in game after external API quest completion"
tags: [research, game-state, kv, beforeunload, race-condition, xp, quest, submit-api]
status: complete
last_updated: 2026-03-05
last_updated_by: Claude Sonnet 4.6
---

# Research: XP not updated after external API quest completion

**Date**: 2026-03-05
**Git Commit**: f0dfda764d4eb65cdea1566b82890ddbb381927c
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

When a quest is resolved via `POST /api/game/submit` (curl), the API returns `accepted: true, xp: 100`.
But after refreshing the game the astronaut does NOT gain this extra XP — it reverts to the old value.
Are server-side missions actually updating state? Does the browser have a chance to notice it?

---

## Summary

**The state IS saved correctly by the submit API** — KV is updated synchronously.

The bug is a **`beforeunload` race condition** in `PhaserGame.svelte`.

When the user presses F5, the browser fires `beforeunload` **before** the new page load begins.
The `onBeforeUnload` handler reads the stale in-memory game state (which still has the old XP)
and fires a `PUT /api/game/state` with `keepalive: true`, **overwriting the KV entry** with the old value.
The new page then loads, fetches from KV, and gets the stale data — so the +100 XP is gone.

---

## Detailed Findings

### 1. `POST /api/game/submit` — state IS saved correctly

`src/pages/api/game/submit.ts:112-123`

```ts
const updatedState = {
  ...state,
  xp: state.xp + (apiQuest.rewards.xp ?? 0),
  flags: [...new Set([...state.flags, ...apiQuest.rewards.flags])],
  quests: {
    ...state.quests,
    active: state.quests.active === quest_id ? null : state.quests.active,
    completed: [...state.quests.completed, quest_id],
  },
};

await saveGameState(email, updatedState, env);
```

`saveGameState` in `src/server/game/serverGameStateManager.ts:34-40` **awaits** the KV write:

```ts
if (env.ENV === 'PROD') {
  await remote.setGameState(email, state, env);  // synchronous KV write
}
// Supabase write is fire-and-forget (non-blocking)
```

At this point KV contains the correct updated XP. The submit API itself is not the bug.

---

### 2. The `beforeunload` handler overwrites KV on page refresh

`src/explorers/PhaserGame.svelte:194-209`

```ts
function onBeforeUnload() {
  if (game?.registry.get('skipSave')) return;
  const state = game?.registry.get('demoGameState') as GameState | undefined;
  if (state) {
    saveState(state);            // overwrites localStorage with stale XP
    if (userEmail) {
      fetch('/api/game/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),   // ← stale XP sent to server
        keepalive: true,               // ← fires even as page unloads
      }).catch(() => {});
    }
  }
}
window.addEventListener('beforeunload', onBeforeUnload);
```

**The exact failure sequence:**

| Step | What happens |
|------|-------------|
| 1 | Browser game has `xp: N` in Phaser registry + localStorage |
| 2 | `curl POST /api/game/submit` → KV updated to `xp: N+100` ✅ |
| 3 | User presses F5 → `beforeunload` fires |
| 4 | `onBeforeUnload` reads Phaser registry → still `xp: N` (game doesn't know about curl) |
| 5 | `keepalive` PUT sends `xp: N` to `/api/game/state` → KV overwritten back to `xp: N` ❌ |
| 6 | New page loads → `GET /api/game/state` → KV returns `xp: N` |
| 7 | XP gain is lost |

---

### 3. Read path on refresh — correctly reads from KV

`src/explorers/PhaserGame.svelte:62-80` (onMount):

```ts
const res = await fetch('/api/game/state');
if (res.ok) {
  const serverState = (await res.json()) as GameState | null;
  if (serverState) {
    setPreloadedState(serverState);
    saveState(serverState);   // overwrites localStorage with server value
  }
}
```

`src/pages/api/game/state.ts:48-50` (GET handler) → `loadGameState()` →
`src/server/game/serverGameStateManager.ts:7-11` → `remote.getGameState()` → reads from KV.

This chain is correct. **The problem is that by the time the new page fetches from KV,
`beforeunload` has already re-written the stale XP into KV via a keepalive PUT.**

---

### 4. No local-state override issue (confirmed not the cause)

`BootScene` priority: `preloaded (server) ?? saved (localStorage) ?? createDefaultState()`

Server state always wins on startup. localStorage is NOT the source of the bug.

---

## Code References

- `src/explorers/PhaserGame.svelte:194-209` — **`onBeforeUnload` handler — the bug location**
- `src/explorers/PhaserGame.svelte:28-39` — `debouncedServerSave` (5 s debounce, triggered by STATE_CHANGED)
- `src/pages/api/game/submit.ts:112-123` — updatedState construction + saveGameState call (correct)
- `src/server/game/serverGameStateManager.ts:34-40` — synchronous KV write (correct)
- `src/pages/api/game/state.ts:48-50` — GET reads from KV (correct)
- `src/explorers/state/GameStateManager.ts:47-50` — localStorage saveState

---

## Root Cause

`onBeforeUnload` **unconditionally** saves in-memory game state to both localStorage and KV
regardless of whether any local changes have been made since the last server sync.

External API changes (via curl or any tool that doesn't go through the in-browser game)
are invisible to the Phaser registry. The `beforeunload` PUT therefore acts as a
**rollback**, reverting the server's authoritative KV state to the browser's stale snapshot.

---

## Recommended Fix

Add a `localDirty` flag to track whether in-memory state has changed since the last
server sync. Only run the `beforeunload` PUT if there are actual local changes.

In `src/explorers/PhaserGame.svelte`:

```ts
// 1. Add a dirty flag at module scope (alongside serverSaveTimeout)
let localDirty = false;

// 2. Set dirty on every local state change (already goes through STATE_CHANGED)
game.events.on(GameEvents.STATE_CHANGED, ({ state }: StateChangedPayload) => {
  localDirty = true;
  debouncedServerSave(state);
});

// 3. Clear dirty after a successful debounced server save
function debouncedServerSave(state: GameState): void {
  if (!userEmail) return;
  if (serverSaveTimeout) clearTimeout(serverSaveTimeout);
  serverSaveTimeout = setTimeout(() => {
    serverSaveTimeout = null;
    fetch('/api/game/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })
      .then(() => { localDirty = false; })
      .catch((err) => console.error('[GameState] Server save failed:', err));
  }, 5000);
}

// 4. Gate beforeunload save on dirty flag
function onBeforeUnload() {
  if (!localDirty) return;          // ← no local changes since last server sync, skip PUT
  if (game?.registry.get('skipSave')) return;
  const state = game?.registry.get('demoGameState') as GameState | undefined;
  if (state) {
    saveState(state);
    if (userEmail) {
      fetch('/api/game/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
        keepalive: true,
      }).catch(() => {});
    }
  }
}
```

With this change: if the user makes no in-game moves/actions after an external API call,
`localDirty` remains `false`, `beforeunload` skips the PUT, and the server's state
(updated by the API) is preserved across the refresh.

---

## Open Questions

- Should the `beforeunload` flush also cancel any pending `serverSaveTimeout` before firing
  the immediate PUT? Currently if the debounce is in-flight, `beforeunload` fires a second
  PUT. These are ordered by the browser but it is redundant.
- Consider whether Supabase should be on the **read** path as a fallback if KV returns a
  version older than Supabase. Currently Supabase is write-only and unreachable on read.
