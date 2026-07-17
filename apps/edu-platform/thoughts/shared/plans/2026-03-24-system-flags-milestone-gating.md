# System Flags for Milestone Gating — Implementation Plan

## Overview

Add server-controlled **system flags** to the 10x Explorers game, enabling admin-toggled milestone gating (e.g., `sys:course-m1-available` unlocks doors to Module 1). System flags live in a Supabase table, are cached in KV, delivered alongside game state at boot, stored in a **separate read-only registry key** (never mixed into `GameState.flags`), and checked transparently by `hasFlag()`.

## Current State Analysis

- **Flag registry** (`src/explorers/config/flags.ts:1-37`): 18 player-earned flags as string constants. `GameFlag` type derived from `FLAGS` object.
- **GameState.flags** (`src/explorers/state/types.ts:8`): `string[]` — no validation beyond array check.
- **BaseScene.hasFlag()** (`src/explorers/scenes/BaseScene.ts:47-49`): Uses cached `Set<string>` for O(1) lookups.
- **flagManager.hasFlag()** (`src/explorers/state/flagManager.ts:41-44`): Uses `state.flags.includes()`.
- **Door gating** (`src/explorers/scenes/GameScene.ts:428-441`): Checks `requiredFlags` via `this.hasFlag()` — AND logic.
- **Server merge** (`src/explorers/PhaserGame.svelte:93-126`): Fetches `{ state, pending }` from `/api/game/state`, merges, applies grants, sets preloaded state.
- **BootScene** (`src/explorers/scenes/BootScene.ts:39-48`): Consumes preloaded state, sets it on registry.
- **KV namespace** `GAME_STATE` is already available in `Env` (`src/env.d.ts:55`).

### Key Discoveries:

- `BaseScene` has a **cached `_flagsSet`** (line 10) rebuilt on demand — system flags need their own cache
- `flagManager.setFlag()` writes to `GameState.flags` and saves — system flags must be excluded
- The `GAME_STATE` KV namespace is already used for player state — we can reuse it for system flags cache with a distinct key prefix
- `serverGameStateManager.ts` uses `env.ENV === 'PROD'` branching — system flags service should follow the same pattern
- Two existing Supabase migrations exist in `supabase/migrations/`

## Desired End State

After implementation:
1. A `system_flags` Supabase table holds admin-managed flags with `enabled` boolean
2. `GET /api/game/state` returns `{ state, pending, systemFlags }` — system flags cached in KV (5-min TTL)
3. Client stores system flags in a separate `'systemFlags'` registry key (never in `GameState.flags`)
4. `BaseScene.hasFlag()` and `flagManager.hasFlag()` check both player and system flags
5. `setFlag()` rejects `sys:` prefixed flags with a devLog warning
6. Doors, dialogues, and quests work unchanged — `hasFlag()` resolves both sources transparently
7. Toggling a flag in Supabase Studio propagates within 5 minutes (KV TTL) on next page load

**Verification**: Enable `sys:course-m1-available` in Supabase → refresh game → door with `requiredFlags: "sys:course-m1-available"` becomes passable.

## What We're NOT Doing

- No admin UI — Supabase Studio is sufficient
- No mid-session propagation — flags take effect on next page load only
- No per-user system flags — global only
- No conditional flags (date ranges, cohorts) — simple enabled/disabled
- No QA overlay changes — can be added later if needed

## Implementation Approach

Minimal, surgical changes following the research doc's v2 design (separate read-only registry). The only game engine change is adding `|| systemFlagsSet.has(flag)` to `hasFlag()` in two places. Everything else is plumbing: DB table → service → API → client preload → registry.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- System flags are fetched **once** at page load in `PhaserGame.svelte` (alongside existing state fetch)
- Stored via `setPreloadedSystemFlags()` before Phaser boots — consumed by `BootScene.create()`
- Registry key `'systemFlags'` is set once at boot, never mutated during session
- No cache invalidation needed for system flags (read-only, session-scoped)

### Performance & Optimization Strategy

- **KV cache**: System flags cached in `GAME_STATE` KV under key `v1-system-flags` with 300s TTL. One KV read per boot (fast edge read) instead of Supabase query.
- **Client-side**: `Set<string>` for O(1) lookups, same pattern as `BaseScene._flagsSet`
- **No extra network requests**: System flags piggyback on existing `/api/game/state` GET response

### State Management Sequencing

```
Boot sequence (unchanged flow, new data):
1. PhaserGame.svelte: fetch /api/game/state → { state, pending, systemFlags }
2. PhaserGame.svelte: merge player state (existing), store system flags separately
3. BootScene.create(): set 'demoGameState' (existing) + set 'systemFlags' (new)
4. BaseScene.hasFlag(): check player flags || system flags
```

### Debug & Observability Plan

- `devLog` in BootScene showing count of loaded system flags
- `devLog` warning in `setFlag()` if someone attempts to set a `sys:` flag
- System flags visible in QA overlay (future enhancement, not in scope)

## Phase 1: Database & Server-Side Service

### Overview

Create the `system_flags` Supabase table and a service to query enabled flags with KV caching.

### Changes Required:

#### 1. Supabase Migration

**File**: `supabase/migrations/20260324000000_system_flags.sql` (CREATE)

```sql
create table public.system_flags (
  id          uuid primary key default gen_random_uuid(),
  flag        text unique not null,
  enabled     boolean default false,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

comment on table public.system_flags is 'Server-controlled flags for milestone gating. Toggled via Supabase Studio.';

-- Seed initial milestone flags (disabled by default)
insert into public.system_flags (flag, description) values
  ('sys:course-m1-available', 'Unlocks Module 1 doors in the game'),
  ('sys:course-m2-available', 'Unlocks Module 2 doors in the game');
```

#### 2. System Flags Service

**File**: `src/server/supabase/systemFlagsService.ts` (CREATE)

```typescript
import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function getEnabledSystemFlags(env: SupabaseEnv): Promise<string[]> {
  const supabase = getSupabaseAdmin(env);
  const { data } = await supabase
    .from('system_flags')
    .select('flag')
    .eq('enabled', true);
  return (data ?? []).map((row) => row.flag);
}
```

#### 3. System Flags with KV Cache

**File**: `src/server/game/systemFlagsCache.ts` (CREATE)

```typescript
import { getEnabledSystemFlags } from '@/server/supabase/systemFlagsService';

const CACHE_KEY = 'v1-system-flags';
const CACHE_TTL_SECONDS = 300; // 5 minutes

type SystemFlagsCacheEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  GAME_STATE?: KVNamespace;
  ENV: string;
};

export async function getCachedSystemFlags(env: SystemFlagsCacheEnv): Promise<string[]> {
  // In dev mode, always query Supabase directly
  if (env.ENV !== 'PROD' || !env.GAME_STATE) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return [];
    return getEnabledSystemFlags(env);
  }

  // Try KV cache first
  const cached = await env.GAME_STATE.get(CACHE_KEY);
  if (cached) return JSON.parse(cached) as string[];

  // Cache miss — query Supabase and cache result
  const flags = await getEnabledSystemFlags(env);
  await env.GAME_STATE.put(CACHE_KEY, JSON.stringify(flags), {
    expirationTtl: CACHE_TTL_SECONDS,
  });
  return flags;
}
```

### Success Criteria:

#### Automated Verification:

- [x] Migration applies cleanly: `supabase db reset` (local)
- [x] TypeScript compiles: `npm run build` passes
- [ ] `system_flags` table exists with 2 seed rows (both `enabled = false`)

#### Manual Verification:

- [ ] In Supabase Studio, toggle `sys:course-m1-available` to `enabled = true`
- [ ] Query returns the enabled flag

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: API & Client Integration

### Overview

Extend `/api/game/state` GET to return `systemFlags`, update client boot flow to store them separately, and wire into BootScene.

### Changes Required:

#### 1. API Endpoint Change

**File**: `src/pages/api/game/state.ts`
**Changes**: Add `systemFlags` to GET response (lines 51-59)

Replace the existing `Promise.all` and response:

```typescript
// Before (lines 52-59):
const [state, pending] = await Promise.all([
  loadGameState(email, context.locals.runtime.env),
  getPendingGrants(email, context.locals.runtime.env),
]);
return new Response(JSON.stringify({ state, pending }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});
```

With:

```typescript
import { getCachedSystemFlags } from '@/server/game/systemFlagsCache';

const [state, pending, systemFlags] = await Promise.all([
  loadGameState(email, context.locals.runtime.env),
  getPendingGrants(email, context.locals.runtime.env),
  getCachedSystemFlags(context.locals.runtime.env),
]);
return new Response(JSON.stringify({ state, pending, systemFlags }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});
```

#### 2. GameStateManager: Preloaded System Flags

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Add system flags preload getter/setter/clear (after line 164)

```typescript
let preloadedSystemFlags: string[] = [];

/** Called by PhaserGame.svelte after fetching server state, before Phaser boot. */
export function setPreloadedSystemFlags(flags: string[]): void {
  preloadedSystemFlags = flags;
}

/** Called once by BootScene to consume the pre-loaded system flags. */
export function getPreloadedSystemFlags(): string[] {
  return preloadedSystemFlags;
}

/** Called by BootScene after consuming the pre-loaded system flags. */
export function clearPreloadedSystemFlags(): void {
  preloadedSystemFlags = [];
}
```

#### 3. PhaserGame.svelte: Store System Flags

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Import new functions, extract `systemFlags` from response, store via preloader

Add import (line 13 area):

```typescript
import {
  loadState,
  mergeServerProgressIntoLocal,
  saveState,
  setPreloadedState,
  setPreloadedSystemFlags,
} from './state/GameStateManager';
```

Update the fetch response parsing (lines 103-106):

```typescript
// Before:
const { state: serverState, pending } = (await res.json()) as {
  state: GameState | null;
  pending: PendingGrant[];
};

// After:
const { state: serverState, pending, systemFlags } = (await res.json()) as {
  state: GameState | null;
  pending: PendingGrant[];
  systemFlags?: string[];
};
if (systemFlags?.length) {
  setPreloadedSystemFlags(systemFlags);
}
```

#### 4. BootScene: Set System Flags on Registry

**File**: `src/explorers/scenes/BootScene.ts`
**Changes**: Import system flags functions, set on registry after state

Add import:

```typescript
import {
  getPreloadedSystemFlags,
  clearPreloadedSystemFlags,
} from '../state/GameStateManager';
```

After line 45 (`this.game.events.emit(GameEvents.STATE_CHANGED, { state })`), add:

```typescript
// Load system flags into separate read-only registry key
const systemFlags = getPreloadedSystemFlags();
clearPreloadedSystemFlags();
this.registry.set('systemFlags', new Set(systemFlags));
devLog(`[BootScene] System flags loaded: ${systemFlags.length} flags`);
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build` passes
- [x] No regressions in existing tests: `npm run test`

#### Manual Verification:

- [ ] Start dev server, open game, check console for `[BootScene] System flags loaded: N flags`
- [ ] With no flags enabled: `N = 0`
- [ ] Enable a flag in Supabase → refresh → `N = 1`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 3.

---

## Phase 3: Game Engine Integration

### Overview

Update `hasFlag()` in both `BaseScene` and `flagManager` to check system flags. Add runtime guard to `setFlag()`. Update flag registry with system flag constants.

### Changes Required:

#### 1. BaseScene: Check System Flags

**File**: `src/explorers/scenes/BaseScene.ts`
**Changes**: Add system flags getter and update `hasFlag()`

Add after `flagsSet` getter (after line 28):

```typescript
/** Cached Set view of system flags (read-only, set once at boot) */
private get systemFlagsSet(): Set<string> {
  return (this.registry.get('systemFlags') as Set<string>) ?? new Set();
}
```

Update `hasFlag()` (line 47-49):

```typescript
// Before:
hasFlag(flag: string): boolean {
  return this.flagsSet.has(flag);
}

// After:
hasFlag(flag: string): boolean {
  return this.flagsSet.has(flag) || this.systemFlagsSet.has(flag);
}
```

#### 2. flagManager: Check System Flags + Runtime Guard

**File**: `src/explorers/state/flagManager.ts`
**Changes**: Update `hasFlag()` to check system flags, add `sys:` guard to `setFlag()`

Update `setFlag()` (line 10):

```typescript
// Before:
export function setFlag(game: Phaser.Game, flag: string): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return false;

// After:
export function setFlag(game: Phaser.Game, flag: string): boolean {
  if (flag.startsWith('sys:')) {
    devLog(`[Flag] Rejected sys: flag "${flag}" — system flags are read-only`);
    return false;
  }
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return false;
```

Update `hasFlag()` (lines 41-44):

```typescript
// Before:
export function hasFlag(game: Phaser.Game, flag: string): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  return state.flags.includes(flag);
}

// After:
export function hasFlag(game: Phaser.Game, flag: string): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return true;
  const systemFlags = game.registry.get('systemFlags') as Set<string> | undefined;
  return systemFlags?.has(flag) ?? false;
}
```

#### 3. Flag Registry: Add System Constants

**File**: `src/explorers/config/flags.ts`
**Changes**: Add system flag constants after existing flags

```typescript
// After line 31 (M0_EXAM_TOKENIZATION_DONE):

  // System flags (controlled server-side via Supabase, never saved in player state)
  SYS_COURSE_M1_AVAILABLE: 'sys:course-m1-available',
  SYS_COURSE_M2_AVAILABLE: 'sys:course-m2-available',
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build` passes
- [x] All existing tests pass: `npm run test`
- [ ] No lint errors: `npm run lint` (if available)

#### Manual Verification:

- [ ] Enable `sys:course-m1-available` in Supabase → refresh game
- [ ] A door with `requiredFlags: "sys:course-m1-available"` is passable
- [ ] Disable the flag → refresh → door is locked again
- [ ] Player state in localStorage does NOT contain any `sys:` flags
- [ ] Combined gating works: door with `requiredFlags: "sys:course-m1-available,quest:exams-done"` requires BOTH

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Testing Strategy

### Unit Tests:

- `systemFlagsService.ts` — mock Supabase, verify `getEnabledSystemFlags` returns only enabled flags
- `systemFlagsCache.ts` — mock KV, verify cache hit/miss behavior and TTL
- `flagManager.ts` — verify `setFlag` rejects `sys:` prefix, `hasFlag` checks both sources

### Manual Testing Steps:

1. Boot game with no system flags enabled → all `sys:` gated doors locked
2. Enable `sys:course-m1-available` in Supabase → refresh → door unlocks
3. Disable flag → refresh → door re-locks
4. Check localStorage — no `sys:` flags present in saved state
5. Check KV — `v1-system-flags` key exists with correct JSON after first boot

## Performance Considerations

- **KV cache** prevents Supabase query on every boot (5-min TTL = ~288 queries/day max globally)
- **System flags `Set<string>`** is created once at boot — no per-frame allocation
- **No additional network requests** — system flags piggyback on existing `/api/game/state` response

## Migration Notes

- The `system_flags` table is new — no data migration needed
- Seed rows are inserted as `enabled = false` — no impact until admin explicitly enables
- Old clients without system flags support gracefully degrade: `registry.get('systemFlags')` returns `undefined` → `?? new Set()` → doors stay locked (safe default)

## References

- Research: `thoughts/shared/research/2026-03-24-system-flags-milestone-gating.md`
- Flag registry: `src/explorers/config/flags.ts`
- BaseScene.hasFlag: `src/explorers/scenes/BaseScene.ts:47-49`
- flagManager.hasFlag: `src/explorers/state/flagManager.ts:41-44`
- API endpoint: `src/pages/api/game/state.ts:42-67`
- Boot flow: `src/explorers/PhaserGame.svelte:93-126`
- BootScene: `src/explorers/scenes/BootScene.ts:39-48`
