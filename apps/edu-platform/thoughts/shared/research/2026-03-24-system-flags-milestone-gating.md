---
date: 2026-03-24T12:00:00+01:00
researcher: Claude
git_commit: b024a71e
branch: master
repository: przeprogramowani-sites
topic: "System flags for milestone gating — extending the flag system with server-controlled flags"
tags: [research, codebase, game-flags, milestone-gating, system-flags, game-state]
status: complete
last_updated: 2026-03-24
last_updated_by: Claude
last_updated_note: "Revised design: system flags as separate read-only registry key, never mixed into GameState.flags"
---

# Research: System Flags for Milestone Gating

**Date**: 2026-03-24T12:00:00+01:00
**Researcher**: Claude
**Git Commit**: b024a71e
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Jak rozszerzyć obecny system flag o **flagi systemowe** (server-side), które umożliwią odblokowywanie milestone'ów (np. `course-m1-available` otwiera drzwi do kolejnej części gry)? Flagi systemowe mają być zarządzane server-side, ale client-side powinny być mergowane z flagami gracza przy starcie gry — tak żeby reszta gry (drzwi, dialogues, quests) nie musiała rozróżniać między flagą gracza a flagą systemową.

## Summary

Obecna architektura jest **idealnie przygotowana** na rozszerzenie o flagi systemowe. Kluczowe spostrzeżenia:

1. **Flagi to `string[]`** — brak typowej enum-owej walidacji na poziomie DB. Dodanie nowych flag nie wymaga migracji.
2. **Merge przy starcie** — `PhaserGame.svelte` już merguje server state z local state (union flag). Wystarczy dodać trzecie źródło: system flags.
3. **Drzwi używają `requiredFlags`** — comma-separated string z AND logic. Flagę systemową można dodać jako kolejny wymagany flag.
4. **`InteractionRoute.flagVariants`** — już obsługuje wariantowe dialogi w zależności od flag. System flags naturalnie wchodzą w ten mechanizm.
5. **Brak potrzeby zmian w game engine** — wystarczy rozszerzyć `/api/game/state` o zwracanie system flags i zmergować je client-side.

## Detailed Findings

### Current Flag System

#### Flag Registry (`src/explorers/config/flags.ts`)
Central registry of string constants. All flags are player-earned (progression, exams, quests).

```typescript
export const FLAGS = {
  TERMINAL_FOUND: 'terminal-found',
  M0_EXAM_LLM_BASICS_DONE: 'm0-exam-llm-basics-done',
  // ... 18 total flags
};
export type GameFlag = (typeof FLAGS)[keyof typeof FLAGS];
```

#### Flag Storage (`src/explorers/state/types.ts`)
Flags are stored as `string[]` in `GameState`:
```typescript
export interface GameState {
  version: 2;
  flags: string[];
  // ...
}
```

#### Flag Manager (`src/explorers/state/flagManager.ts`)
Three functions: `setFlag()`, `removeFlag()`, `hasFlag()` — all operate on the game registry's `GameState.flags` array. `setFlag` emits `STATE_CHANGED` + `FLAG_SET` events and auto-saves.

#### Door Gating (`src/explorers/scenes/GameScene.ts`)
Doors check `requiredFlags` (comma-separated, AND logic):
```typescript
case 'door': {
  const requiredFlags = ioObj.requiredFlags;
  if (requiredFlags.length > 0) {
    const missingFlags = requiredFlags.filter((f) => !this.hasFlag(f));
    if (missingFlags.length > 0) {
      this.startDialogue(this.resolveDialogueId(obj.objectId));
      break;
    }
  }
  this.triggerDoorTransition(ioObj);
  break;
}
```

#### Dialogue Variants (`src/explorers/levels/types.ts`)
```typescript
export interface InteractionRoute {
  zoneId: string;
  defaultDialogue: string;
  flagVariants?: { flag: string; dialogue: string; }[];
}
```

### Server-Side State Flow

#### GET /api/game/state (`src/pages/api/game/state.ts`)
Returns `{ state: GameState | null, pending: PendingGrant[] }`. State comes from KV (primary) or in-memory (dev).

#### Merge at Boot (`src/explorers/PhaserGame.svelte` lines 93-126)
```
1. loadState() → local localStorage
2. fetch('/api/game/state') → { state, pending }
3. mergeServerProgressIntoLocal(localState, serverState)
   → flags: uniqueStrings([...serverState.flags, ...localState.flags])
4. applyPendingGrants(baseState, pending) → adds quest reward flags
5. setPreloadedState(mergedState)
6. saveState(mergedState) → localStorage
```

**Key insight**: Flags from server and local are already merged via union. Adding system flags as a third source fits naturally.

#### State Persistence
- **Primary**: Cloudflare KV (`GAME_STATE` namespace), 365-day TTL
- **Backup**: Supabase `game_state` table (JSONB, async fire-and-forget)
- **Local**: localStorage (session persistence)

### Existing Infrastructure for System Flags

#### Option A: KV-based system flags
A dedicated KV key (e.g., `v1-system-flags`) storing a global `string[]`. Simple, fast, but no per-user targeting and requires manual KV updates.

#### Option B: Supabase table (recommended)
New `public.system_flags` table. Queryable, auditable, supports conditions. The `/api/game/state` endpoint already queries Supabase for game state backup — adding a system flags query is trivial.

#### Option C: Static config in code
Add system flags to the `/api/game` manifest response. No DB needed, but requires deployment to change flags.

## Proposed Design (v2 — read-only separate registry)

### Design Principle

System flags are **never mixed into `GameState.flags`**. They live in a separate, read-only registry key on the Phaser `game.registry`. The only change to the game engine is in `BaseScene.hasFlag()` — it checks both sources. This means:
- **No stripping on save** — player state never contains system flags
- **No prefix convention needed** — namespaces are structurally separate
- **No save/merge complexity** — system flags are a pure read-only overlay

### 1. Database Schema

```sql
create table public.system_flags (
  id          uuid primary key default gen_random_uuid(),
  flag        text unique not null,
  enabled     boolean default false,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Seed initial flags (disabled by default)
insert into system_flags (flag, description) values
  ('sys:course-m1-available', 'Unlocks Module 1 doors in the game'),
  ('sys:course-m2-available', 'Unlocks Module 2 doors in the game');
```

**Why `sys:` prefix?** — Even though structural separation prevents collisions, the prefix makes it immediately obvious in Tiled map configs and FLAGS registry which flags are admin-controlled vs player-earned.

### 2. Server-Side: System Flags Service

New file: `src/server/supabase/systemFlagsService.ts`

```typescript
export async function getEnabledSystemFlags(env: Env): Promise<string[]> {
  const client = getSupabaseClient(env);
  const { data } = await client
    .from('system_flags')
    .select('flag')
    .eq('enabled', true);
  return (data ?? []).map((row) => row.flag);
}
```

### 3. API Change: `/api/game/state` GET

Extend the response to include `systemFlags`:

```typescript
const [state, pending, systemFlags] = await Promise.all([
  loadGameState(email, env),
  getPendingGrants(email, env),
  getEnabledSystemFlags(env),
]);

return Response.json({ state, pending, systemFlags });
```

### 4. Client-Side: Store System Flags in Separate Registry Key

In `PhaserGame.svelte`, store system flags separately — never touch `GameState.flags`:

```typescript
// New registry key for system flags (read-only, never saved)
const SYSTEM_FLAGS_KEY = 'systemFlags';

// In onMount, after fetching server state:
const { state: serverState, pending, systemFlags } = await res.json();

if (serverState) {
  const baseState = mergeServerProgressIntoLocal(localState, serverState);
  const mergedState = applyPendingGrants(baseState, pending);
  setPreloadedState(mergedState);
  saveState(mergedState);
}

// Store system flags for BootScene to pick up (separate from preloaded state)
if (systemFlags?.length) {
  setPreloadedSystemFlags(systemFlags);
}
```

New exports in `GameStateManager.ts`:

```typescript
let preloadedSystemFlags: string[] = [];

export function setPreloadedSystemFlags(flags: string[]): void {
  preloadedSystemFlags = flags;
}

export function getPreloadedSystemFlags(): string[] {
  return preloadedSystemFlags;
}

export function clearPreloadedSystemFlags(): void {
  preloadedSystemFlags = [];
}
```

### 5. BootScene: Set System Flags on Registry

In `BootScene.create()`, after setting `demoGameState`:

```typescript
import { getPreloadedSystemFlags, clearPreloadedSystemFlags } from '../state/GameStateManager';

// In create():
const systemFlags = getPreloadedSystemFlags();
clearPreloadedSystemFlags();
this.registry.set('systemFlags', new Set(systemFlags));
devLog(`[BootScene] System flags loaded: ${systemFlags.length} flags`);
```

### 6. BaseScene: Check Both Sources in `hasFlag()`

The **only game engine change** — `BaseScene.hasFlag()` checks player flags AND system flags:

```typescript
// In BaseScene (src/explorers/scenes/BaseScene.ts)

/** Cached Set view of system flags (read-only, set once at boot) */
private get systemFlagsSet(): Set<string> {
  return (this.registry.get('systemFlags') as Set<string>) ?? new Set();
}

/** Check whether a flag is set — checks player flags AND system flags */
hasFlag(flag: string): boolean {
  return this.flagsSet.has(flag) || this.systemFlagsSet.has(flag);
}
```

That's it. **One getter + one `||` in `hasFlag()`**. Every downstream consumer (doors, dialogues, quests) works unchanged.

### 7. flagManager.ts: Check Both Sources

The standalone `hasFlag()` in `flagManager.ts` also needs the same change:

```typescript
export function hasFlag(game: Phaser.Game, flag: string): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return true;
  const systemFlags = game.registry.get('systemFlags') as Set<string> | undefined;
  return systemFlags?.has(flag) ?? false;
}
```

### 8. Flag Registry Update

Add system flag constants to `src/explorers/config/flags.ts`:

```typescript
export const FLAGS = {
  // ... existing player flags ...

  // System flags (controlled server-side via Supabase, never saved in player state)
  SYS_COURSE_M1_AVAILABLE: 'sys:course-m1-available',
  SYS_COURSE_M2_AVAILABLE: 'sys:course-m2-available',
} as const;
```

### 9. Usage in Tiled Maps

In the Tiled map editor, add `sys:course-m1-available` to a door's `requiredFlags`:

```json
{
  "type": "door",
  "properties": [
    { "name": "id", "value": "m1-entrance-door" },
    { "name": "targetMap", "value": "m1-lobby" },
    { "name": "spawnX", "value": 5 },
    { "name": "spawnY", "value": 8 },
    { "name": "requiredFlags", "value": "sys:course-m1-available,quest:exams-done" }
  ]
}
```

This door requires BOTH the system flag (admin-controlled) AND the player flag (earned by completing exams). The door's `requiredFlags` check in `GameScene` calls `this.hasFlag()` which now checks both sources — no changes needed there.

## Architecture Insights

### Why This Design Is Elegant

1. **True separation** — System flags never enter `GameState.flags`. No stripping, no filtering, no save-time cleanup.
2. **Minimal game engine change** — One `||` added to `BaseScene.hasFlag()` + one to `flagManager.hasFlag()`. Everything else works unchanged.
3. **Read-only by construction** — System flags are a `Set<string>` on the registry, set once at boot. No setter exposed. `setFlag()` only writes to player state.
4. **No save complexity** — `debouncedServerSave`, `beforeunload`, `saveState` all save `GameState` as-is. System flags aren't there.
5. **Composable gating** — `requiredFlags: "sys:course-m1-available,quest:exams-done"` combines admin gate + player earned. `hasFlag()` resolves both transparently.
6. **Instant toggle** — Flip `enabled` in Supabase → effect on next page load.

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Server (boot)                         │
│                                                          │
│  GET /api/game/state                                     │
│  ├─ state: GameState (KV)        → player flags          │
│  ├─ pending: PendingGrant[]      → quest rewards         │
│  └─ systemFlags: string[]        → enabled system flags  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               PhaserGame.svelte (onMount)                │
│                                                          │
│  Player state → mergeServerProgressIntoLocal()           │
│               → applyPendingGrants()                     │
│               → setPreloadedState(merged)                │
│               → saveState(merged)  ← NO system flags     │
│                                                          │
│  System flags → setPreloadedSystemFlags(flags)           │
│               ← separate path, never saved               │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               BootScene.create()                         │
│                                                          │
│  registry.set('demoGameState', playerState)              │
│  registry.set('systemFlags', Set(systemFlags))           │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               BaseScene.hasFlag(flag)                    │
│                                                          │
│  return flagsSet.has(flag)       ← player flags          │
│      || systemFlagsSet.has(flag) ← system flags          │
│                                                          │
│  Used by: doors, dialogues, quests, exams — unchanged    │
└─────────────────────────────────────────────────────────┘
```

### Edge Cases Addressed

- **Offline/localStorage**: System flags aren't in localStorage. Offline load → doors stay locked (safe default).
- **Flag collision**: Structural separation (different registry keys) + `sys:` prefix = double protection.
- **Backward compatibility**: Old clients without system flags → `registry.get('systemFlags')` returns undefined → `?? new Set()` → graceful fallback.
- **`setFlag('sys:...')`**: If someone calls `setFlag` with a system flag string, it would add to player state. The `sys:` prefix convention makes this an obvious code-review catch, but it's not enforced at runtime. Could add a guard in `setFlag()` if needed.
- **QA Overlay**: The QA overlay reads `GameState.flags` for debugging. It should also display system flags from the registry for full visibility.

### Alternative: KV Cache Layer

For production performance, system flags could be cached in KV with a short TTL (e.g., 5 minutes):

```typescript
const CACHE_KEY = 'v1-system-flags';

export async function getEnabledSystemFlags(env: Env): Promise<string[]> {
  const cached = await env.GAME_STATE.get(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const flags = await fetchFromSupabase(env);
  await env.GAME_STATE.put(CACHE_KEY, JSON.stringify(flags), { expirationTtl: 300 });
  return flags;
}
```

## Code References

- `src/explorers/scenes/BaseScene.ts:46-49` — `hasFlag()` — add `|| systemFlagsSet.has(flag)` check
- `src/explorers/state/flagManager.ts:41-44` — standalone `hasFlag()` — add system flags check
- `src/explorers/scenes/BootScene.ts:39-48` — state setup — add `registry.set('systemFlags', ...)`
- `src/explorers/PhaserGame.svelte:93-126` — boot merge — store system flags separately
- `src/explorers/state/GameStateManager.ts` — add preloaded system flags getter/setter
- `src/pages/api/game/state.ts:42-67` — GET handler — add `systemFlags` to response
- `src/explorers/config/flags.ts` — add `SYS_*` constants
- `src/explorers/scenes/GameScene.ts:428-441` — door requiredFlags check — **no changes needed**
- `src/explorers/levels/types.ts:11-15` — InteractionRoute flagVariants — **no changes needed**

## Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| CREATE | `supabase/migrations/YYYYMMDD_system_flags.sql` | New table |
| CREATE | `src/server/supabase/systemFlagsService.ts` | Query enabled system flags |
| MODIFY | `src/pages/api/game/state.ts` | Add `systemFlags` to GET response |
| MODIFY | `src/explorers/state/GameStateManager.ts` | Add preloaded system flags getter/setter/clear |
| MODIFY | `src/explorers/PhaserGame.svelte` | Store system flags via `setPreloadedSystemFlags()` |
| MODIFY | `src/explorers/scenes/BootScene.ts` | Set `systemFlags` on registry |
| MODIFY | `src/explorers/scenes/BaseScene.ts` | Add system flags check to `hasFlag()` |
| MODIFY | `src/explorers/state/flagManager.ts` | Add system flags check to standalone `hasFlag()` |
| MODIFY | `src/explorers/config/flags.ts` | Add `SYS_*` constants |

## Open Questions

1. **Admin UI** — Should there be an admin interface for toggling system flags, or is Supabase Studio sufficient for now?
2. **Per-user system flags** — Should some system flags be user-specific (e.g., beta features for specific users)? Current design is global-only.
3. **Conditional system flags** — Should system flags support conditions (e.g., "available after date X")? Could add `valid_from`/`valid_until` columns.
4. **Real-time updates** — Should system flag changes propagate mid-session (via polling or SSE), or is "on next page load" sufficient?
5. **Runtime guard** — Should `setFlag()` reject strings starting with `sys:` to prevent accidental writes to player state?
