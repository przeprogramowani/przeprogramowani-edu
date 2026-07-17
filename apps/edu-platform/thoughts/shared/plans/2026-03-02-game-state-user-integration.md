# Game State User Integration Implementation Plan

## Overview

Connect the 10x Explorers game state (`GameState`) to the authenticated platform user so that
progress persists across browsers and devices. Currently the entire game state lives in
`localStorage` only. The platform already authenticates users with an HttpOnly JWT cookie — we add a
Cloudflare KV namespace as a server-side save store and wire it to the game's load/save lifecycle.

The page remains **publicly accessible**. When a user is not logged in, the game runs with
localStorage-only state and the HUD shows "Zaloguj się aby zapisać stan". Logged-in users silently
get server-backed persistence.

---

## Current State Analysis

- **Game state**: `GameState` stored under `localStorage` key `10x-explorers-demo-state`
  (`src/explorers/config/constants.ts:43`). Managed by `src/explorers/state/GameStateManager.ts`.
- **BootScene** (`src/explorers/scenes/BootScene.ts:35-38`): reads from localStorage immediately on
  `create()`.
- **Save triggers**: auto-save every 30 s (`GameScene.ts:259-269`), flush on shutdown
  (`GameScene.ts:278-293`), `beforeunload` (`PhaserGame.svelte:173-177`).
- **Auth**: JWT stored in HttpOnly `token` cookie; payload is `{ email, exp, nbf }`. Verified via
  `verifyToken()` (`src/server/auth.ts:30-43`). Full `verifyAuth()` also checks Airtable purchases
  — not needed for game state (any logged-in user can persist state).
- **KV pattern**: Three existing namespaces (`MAGIC_LINKS`, `PLATFORM_LESSON_CACHE`,
  `CIRCLE_MEMBERS`). `membershipCache.ts` is the closest analogue.
- **Dev/prod switching**: `magicLinkManager.ts:4-18` switches on `env.ENV === 'PROD'`.
- **No Zod** in API routes; manual validation throughout.
- **`explorers.astro`**: currently has zero auth logic — renders `<PhaserGame />` with no props.

---

## Desired End State

After this plan is complete:

1. An authenticated user opening `/explorers` sees their progress restored from the server,
   regardless of which browser or device they use.
2. An unauthenticated user sees "Zaloguj się aby zapisać stan" in the HUD and plays normally with
   localStorage persistence.
3. State saves hit the server automatically (5 s debounced, plus flush on unload) when logged in.
4. `server wins` on first load — if the server returns a state, localStorage is overwritten; if the
   server returns null, the game starts fresh.

### Key Discoveries

- `verifyAuth()` (`src/server/verifyAuth.ts:8`) requires `AstroGlobal` and always hits Airtable.
  API routes need a lighter check (just `verifyToken`) — no Airtable lookup required for game state.
- `explorers.astro` renders the game as a `client:only="svelte"` island. User email extracted on the
  SSR layer must be passed as a Svelte prop.
- `GameHud.svelte:130-143` uses `pointer-events: none` on the whole HUD; the save-hint span follows
  the same pattern (informational text, not a link).
- The 200 ms `debouncedSaveState()` debounce is for localStorage; a separate 5 s debounce is added
  for network saves.

---

## What We're NOT Doing

- No merging of localStorage and server state on first login — server wins, localStorage discarded.
- No purchase verification for game state access — any valid JWT can load/save state.
- No real-time multi-device sync — single-player, last-write-wins.
- No `activityLog` or `commandHistory` size caps in this plan (noted as future work).
- No state import/export UI.
- No `astro-env.ts` changes — KV bindings are Cloudflare-specific, not Astro env vars.

---

## Implementation Approach

Six sequential phases. Each phase is independently deployable and testable.

1. **KV Infrastructure** — wrangler namespace + server-side helpers (local + remote).
2. **API Endpoints** — `GET /api/game/state` and `PUT /api/game/state` with JWT auth.
3. **Soft Auth in explorers.astro** — extract email from JWT cookie without Airtable.
4. **PhaserGame.svelte** — pre-fetch server state before Phaser boots, debounced server saves.
5. **BootScene + GameStateManager** — use pre-loaded state instead of raw localStorage.
6. **GameHud** — show "Zaloguj się aby zapisać stan" for unauthenticated users.

---

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Pre-load timing**: `onMount` in `PhaserGame.svelte` is made `async`. It `await`s
  `GET /api/game/state` _before_ calling `new Phaser.Game(config)`. This ensures `BootScene.create()`
  finds the pre-loaded state already set.
- **Module-level pre-load variable**: `setPreloadedState()` / `getPreloadedState()` /
  `clearPreloadedState()` added to `GameStateManager.ts`. BootScene calls `clearPreloadedState()`
  after reading to avoid stale state across game resets.
- **Debounce separation**: 200 ms debounce remains for localStorage writes; a new 5 s debounce
  wraps the `fetch PUT` call to limit network traffic.
- **Unload save**: `fetch(..., { keepalive: true })` in the `beforeunload` handler — the browser
  allows the request to outlive page close without blocking unload.

### User Experience Specification

- **Loading state**: `PhaserGame.svelte` shows `opacity-0` until `settled = true`. The server fetch
  is added _before_ Phaser boot, so the canvas fade-in already covers the ~50–200 ms fetch latency.
  No additional spinner needed.
- **Unauthenticated HUD**: A `save-hint` text element appears in `hud-right` when `userEmail` is
  falsy. It disappears when the user is logged in.
- **Save errors**: Silent — `console.error` only. The game continues normally using localStorage.

### State Management Sequencing

- **Boot sequence**: `PhaserGame.svelte` fetches → calls `setPreloadedState()` → creates
  `Phaser.Game` → `BootScene.create()` reads `getPreloadedState()` → falls back to `loadState()`
  (localStorage) → falls back to `createDefaultState()`.
- **Save sequence on STATE_CHANGED**: localStorage write (instant) + `debouncedServerSave()`
  (5 s, only if `userEmail` is set).

---

## Phase 1: KV Infrastructure

### Overview

Create the `GAME_STATE` Cloudflare KV namespace and the server-side read/write helpers that mirror
the existing `membershipCache.ts` pattern.

### Changes Required

#### 1. Create KV Namespace (Manual CLI Step)

Run in the project root:

```bash
npx wrangler kv namespace create GAME_STATE
```

Copy the printed `id` into the next step.

#### 2. `wrangler.toml` — Add GAME_STATE binding

**File**: `wrangler.toml`
**Change**: Add the new namespace to `kv_namespaces`:

```toml
kv_namespaces = [
  { binding = "MAGIC_LINKS",            id = "a67fe4e98cbd459088d056668f9fe302" },
  { binding = "PLATFORM_LESSON_CACHE",  id = "b14217e30ebf42cb82d9afb708d3c418" },
  { binding = "CIRCLE_MEMBERS",         id = "1f0379f28e60442f9dc0455a70387dba" },
  { binding = "GAME_STATE",             id = "<paste-id-from-wrangler-output>" }
]
```

#### 3. `src/server/game/localGameStateManager.ts` — Create (in-memory dev store)

```typescript
import type { GameState } from '@/explorers/state/types';

const store = new Map<string, string>();

export async function getGameState(email: string): Promise<GameState | null> {
  const raw = store.get(email.toLowerCase().trim());
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export async function setGameState(email: string, state: GameState): Promise<void> {
  store.set(email.toLowerCase().trim(), JSON.stringify(state));
}
```

#### 4. `src/server/game/remoteGameStateKV.ts` — Create (Cloudflare KV store)

```typescript
import type { GameState } from '@/explorers/state/types';

const CACHE_VERSION = 'v1';
const TTL_SECONDS = 365 * 24 * 60 * 60; // 1 year

interface GameStateEnv {
  GAME_STATE: KVNamespace;
}

function getKey(email: string): string {
  return `${CACHE_VERSION}-game-state-${email.toLowerCase().trim()}`;
}

function getKV(env: GameStateEnv): KVNamespace | null {
  return env.GAME_STATE || null;
}

export async function getGameState(email: string, env: GameStateEnv): Promise<GameState | null> {
  const kv = getKV(env);
  if (!kv) return null;
  try {
    const data = await kv.get(getKey(email));
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch (error) {
    console.error('[GameState] Error reading from KV:', error);
    return null;
  }
}

export async function setGameState(
  email: string,
  state: GameState,
  env: GameStateEnv
): Promise<void> {
  const kv = getKV(env);
  if (!kv) return;
  try {
    await kv.put(getKey(email), JSON.stringify(state), { expirationTtl: TTL_SECONDS });
  } catch (error) {
    console.error('[GameState] Error writing to KV:', error);
  }
}
```

#### 5. `src/server/game/serverGameStateManager.ts` — Create (ENV switch)

```typescript
import type { GameState } from '@/explorers/state/types';
import * as local from './localGameStateManager';
import * as remote from './remoteGameStateKV';

export async function loadGameState(email: string, env: any): Promise<GameState | null> {
  if (env.ENV === 'PROD') {
    return remote.getGameState(email, env);
  }
  return local.getGameState(email);
}

export async function saveGameState(
  email: string,
  state: GameState,
  env: any
): Promise<void> {
  if (env.ENV === 'PROD') {
    return remote.setGameState(email, state, env);
  }
  return local.setGameState(email, state);
}
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] New files exist: `src/server/game/localGameStateManager.ts`,
      `src/server/game/remoteGameStateKV.ts`, `src/server/game/serverGameStateManager.ts`
- [x] `wrangler.toml` contains `GAME_STATE` binding

#### Manual Verification

- [ ] `npx wrangler kv namespace list` shows `GAME_STATE` namespace (requires real KV namespace creation + ID update)

**Pause here before Phase 2.**

---

## Phase 2: API Endpoints

### Overview

Expose `GET /api/game/state` and `PUT /api/game/state`. Both verify the JWT cookie directly (no
Airtable check). GET returns the user's saved state or `null`. PUT validates the body and overwrites
the KV entry.

### Changes Required

#### 1. `src/pages/api/game/state.ts` — Create

```typescript
import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { loadGameState, saveGameState } from '@/server/game/serverGameStateManager';
import type { GameState } from '@/explorers/state/types';

function isValidGameState(body: unknown): body is GameState {
  if (typeof body !== 'object' || body === null) return false;
  const s = body as Record<string, unknown>;
  const pos = s.position as Record<string, unknown> | undefined;
  const quests = s.quests as Record<string, unknown> | undefined;
  return (
    s.version === 1 &&
    Array.isArray(s.flags) &&
    typeof s.currentMap === 'string' &&
    typeof pos === 'object' && pos !== null &&
    typeof pos.x === 'number' &&
    typeof pos.y === 'number' &&
    typeof s.xp === 'number' &&
    Array.isArray(s.commandHistory) &&
    Array.isArray(s.activityLog) &&
    typeof quests === 'object' && quests !== null &&
    typeof quests.active !== 'undefined' &&
    Array.isArray(quests.completed) &&
    typeof s.exams === 'object' && s.exams !== null &&
    Array.isArray((s.exams as Record<string, unknown>).completed) &&
    Array.isArray(s.bookmarks)
  );
}

async function getEmailFromRequest(context: APIContext): Promise<string | null> {
  const token = context.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token, context.locals.runtime.env.JWT_SECRET);
  return payload?.email ?? null;
}

export const GET: APIRoute = async (context: APIContext) => {
  const email = await getEmailFromRequest(context);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const state = await loadGameState(email, context.locals.runtime.env);
    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/game/state GET] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async (context: APIContext) => {
  const email = await getEmailFromRequest(context);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!isValidGameState(body)) {
    return new Response(JSON.stringify({ error: 'Invalid game state shape' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await saveGameState(email, body, context.locals.runtime.env);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/game/state PUT] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] File exists: `src/pages/api/game/state.ts`

#### Manual Verification

- [ ] `GET /api/game/state` without cookie → 401
- [ ] `GET /api/game/state` with valid cookie → 200 `null` (no state saved yet)
- [ ] `PUT /api/game/state` with valid cookie and valid body → 204
- [ ] `GET /api/game/state` after PUT → 200 with the saved state
- [ ] `PUT /api/game/state` with malformed body → 400

**Pause here before Phase 3.**

---

## Phase 3: Soft Auth in `explorers.astro`

### Overview

Read the JWT cookie in the SSR frontmatter (using `verifyToken` directly — no Airtable roundtrip),
extract the user email, and pass it as an optional prop to the Svelte island.

### Changes Required

#### 1. `src/pages/explorers.astro` — Modify

```astro
---
import GameLayout from '@/layouts/GameLayout.astro';
import PhaserGame from '@/explorers/PhaserGame.svelte';
import { verifyToken } from '@/server/auth';

const token = Astro.cookies.get('token')?.value;
let userEmail: string | undefined;

if (token) {
  const payload = await verifyToken(token, Astro.locals.runtime.env.JWT_SECRET);
  if (payload) userEmail = payload.email;
}
---

<GameLayout>
  <PhaserGame client:only="svelte" userEmail={userEmail} />
</GameLayout>
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification

- [ ] Visiting `/explorers` without a cookie renders the game normally (no redirect).
- [ ] Visiting `/explorers` with a valid JWT cookie does not throw a server error.
- [ ] No Airtable network call is made when loading `/explorers` (check network tab).

**Pause here before Phase 4.**

---

## Phase 4: PhaserGame.svelte — Pre-load & Server Save

### Overview

Accept `userEmail` prop. Before booting Phaser, fetch server state if the user is logged in.
On `STATE_CHANGED`, fire a debounced `PUT /api/game/state`. On `beforeunload`, fire a `keepalive`
PUT. Pass `userEmail` to `GameHud`.

### Changes Required

#### 1. `src/explorers/PhaserGame.svelte` — Modify

Key changes (show diff-style context):

**Add prop and server-save debounce variables** (top of `<script>`, after existing imports):

```typescript
import { setPreloadedState } from './state/GameStateManager';
import type { StateChangedPayload } from './events/GameEvents';

export let userEmail: string | undefined = undefined;

let serverSaveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedServerSave(state: GameState): void {
  if (!userEmail) return;
  if (serverSaveTimeout) clearTimeout(serverSaveTimeout);
  serverSaveTimeout = setTimeout(() => {
    serverSaveTimeout = null;
    fetch('/api/game/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch((err) => console.error('[GameState] Server save failed:', err));
  }, 5000);
}
```

**Make `onMount` async and add pre-load before Phaser boot**:

```typescript
onMount(async () => {
  qaMode = new URLSearchParams(window.location.search).has('qa');

  // Pre-load server state before booting Phaser (server wins)
  if (userEmail) {
    try {
      const res = await fetch('/api/game/state');
      if (res.ok) {
        const serverState = (await res.json()) as GameState | null;
        if (serverState) {
          setPreloadedState(serverState);
          // Mirror to localStorage as local cache
          saveState(serverState);
        }
      }
    } catch (err) {
      console.error('[GameState] Failed to load server state:', err);
    }
  }

  const config = createGameConfig(container);
  config.scene = [BootScene];
  game = new Phaser.Game(config);

  // ... (all existing game event wiring continues unchanged) ...

  // Add server save listener after existing STATE_CHANGED wiring:
  game.events.on(GameEvents.STATE_CHANGED, ({ state }: StateChangedPayload) => {
    debouncedServerSave(state);
  });

  // Update beforeunload to also attempt server save:
  function onBeforeUnload() {
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
  window.addEventListener('beforeunload', onBeforeUnload);

  return () => {
    window.removeEventListener('keydown', onGlobalKey);
    window.removeEventListener('beforeunload', onBeforeUnload);
    if (serverSaveTimeout) clearTimeout(serverSaveTimeout);
  };
});
```

**Update GameHud usage in template** (pass `userEmail`):

```svelte
<GameHud {game} {userEmail} />
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification

- [ ] Opening the game while logged in: check network tab shows `GET /api/game/state` before
  canvas appears.
- [ ] After playing for 5+ seconds: check network tab shows `PUT /api/game/state` with valid body.
- [ ] Closing the tab (logged in): check network tab shows a `keepalive` PUT request.
- [ ] Opening the game while NOT logged in: no `/api/game/state` requests in network tab.

**Pause here before Phase 5.**

---

## Phase 5: BootScene + GameStateManager Pre-load Hooks

### Overview

Add three module-level functions to `GameStateManager.ts` for pre-loaded state handoff. Modify
`BootScene.ts` to use the pre-loaded state before falling back to localStorage.

### Changes Required

#### 1. `src/explorers/state/GameStateManager.ts` — Modify

Add at the bottom of the file:

```typescript
let preloadedState: GameState | null = null;

/** Called by PhaserGame.svelte after fetching server state, before Phaser boot. */
export function setPreloadedState(state: GameState): void {
  preloadedState = state;
}

/** Called once by BootScene to consume the pre-loaded state. */
export function getPreloadedState(): GameState | null {
  return preloadedState;
}

/** Called by BootScene after consuming the pre-loaded state. */
export function clearPreloadedState(): void {
  preloadedState = null;
}
```

#### 2. `src/explorers/scenes/BootScene.ts` — Modify

Update the import line and the state init block in `create()`:

```typescript
import {
  createDefaultState,
  loadState,
  getPreloadedState,
  clearPreloadedState,
} from '../state/GameStateManager';
```

Replace the state init block (`BootScene.ts:34-38`):

```typescript
// Load or create game state (prefer server pre-load > localStorage > default)
const preloaded = getPreloadedState();
clearPreloadedState();
const saved = loadState();
const state = preloaded ?? saved ?? createDefaultState();
this.registry.set(STATE_REGISTRY_KEY, state);
this.game.events.emit(GameEvents.STATE_CHANGED, { state });
devLog(
  `[BootScene] State loaded (source=${preloaded ? 'server' : saved ? 'localStorage' : 'default'}): map=${state.currentMap}`
);
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification

- [ ] Logged-in user on a fresh browser: game starts at the map/position from the server state.
- [ ] Logged-in user with no server state yet: game starts fresh (default state), not from
  any stale localStorage on that device.
- [ ] Unauthenticated user: game still loads from localStorage (existing behavior preserved).

**Pause here before Phase 6.**

---

## Phase 6: GameHud — Unauthenticated Save Hint

### Overview

Add an optional `userEmail` prop to `GameHud.svelte`. When `userEmail` is falsy, show
"Zaloguj się aby zapisać stan" in the right side of the HUD.

### Changes Required

#### 1. `src/explorers/GameHud.svelte` — Modify

**Add prop** after `export let game: Phaser.Game;`:

```typescript
export let userEmail: string | undefined = undefined;
```

**Add hint to template** in the `hud-right` div (before the `{#if import.meta.env.DEV}` block):

```svelte
<div class="hud-right">
  {#if !userEmail}
    <span class="save-hint">Zaloguj się aby zapisać stan</span>
  {/if}
  {#if import.meta.env.DEV}
    <a href="/explorers-editor" class="editor-link">Editor</a>
  {/if}
  {#if terminalFound}
    <span class="hotkey">
      <kbd>Ctrl</kbd>+<kbd>`</kbd> Terminal
    </span>
  {/if}
</div>
```

**Add CSS** (in `<style>`, after `.editor-link:hover`):

```css
.save-hint {
  color: #666;
  font-size: 11px;
  opacity: 0.7;
}
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`

#### Manual Verification

- [ ] Unauthenticated user: "Zaloguj się aby zapisać stan" appears in top-right HUD.
- [ ] Authenticated user: the hint does NOT appear.
- [ ] No layout breakage when terminal shortcut is also visible (after `terminal-found` flag set).

---

## Testing Strategy

### Unit Tests

No new unit tests required for this plan — the KV helpers follow the same pattern as
`membershipCache.ts` which is tested indirectly.

### Manual Testing Steps

1. **Anonymous user flow**: Open `/explorers` without a cookie. Verify "Zaloguj się" text in HUD.
   Play for 1 min. Refresh — state is restored from localStorage. No network calls to
   `/api/game/state`.
2. **Authenticated first visit** (no server state): Log in. Open `/explorers`. Verify no prior
   localStorage state is loaded (fresh start). Network tab: `GET /api/game/state` → `null`.
3. **Authenticated returning user**: After step 2, play and wait 5 s. Verify PUT request fired.
   Open a new incognito browser, log in with the same account, open `/explorers`. Verify game
   resumes at the same map and XP.
4. **Cross-device sync**: Repeat step 3 on a different device.
5. **Error resilience**: With browser DevTools network throttled to Offline, play the game.
   Verify that save failures are silent and the game continues with localStorage fallback.

---

## Performance Considerations

- Server state fetch adds ~50–200 ms before Phaser boot. This is hidden within the existing
  `opacity-0 → opacity-100` fade-in transition of the game container.
- KV reads are < 5 ms at Cloudflare edge. Total cold-start impact is network RTT, not KV latency.
- The 5 s debounce prevents flooding KV with writes during rapid gameplay.

---

## Migration Notes

Existing players have state in `localStorage` only. On their first authenticated session:

- Server returns `null` (no KV entry).
- Game starts fresh (server wins rule).
- After 5 s of play, current state is pushed to KV.

**This is intentional** (per requirements: server wins, discard localStorage on first login).
Players who want to preserve offline progress should not log in until they're ready to sync —
there is no migration path in this plan.

---

## References

- Research document: `thoughts/shared/research/2026-03-02-game-state-user-integration.md`
- KV pattern: `src/server/circle/membershipCache.ts`
- ENV switch pattern: `src/server/magicLinkManager.ts`
- Auth verification: `src/server/auth.ts:30-43`
- Game state types: `src/explorers/state/types.ts:5-24`
- Current BootScene: `src/explorers/scenes/BootScene.ts:34-41`
- Current GameHud: `src/explorers/GameHud.svelte:12,117-126`
