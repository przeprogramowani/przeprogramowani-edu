---
date: 2026-03-02T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: 9e9d54bc9fb659acba097c2af3dca7c26f1d63e3
branch: master
repository: przeprogramowani-sites
topic: "Connect 10x Explorers game state to platform user account"
tags: [research, game, explorers, localStorage, KV, auth, state]
status: complete
last_updated: 2026-03-02
last_updated_by: Claude Sonnet 4.6
---

# Research: Connect 10x Explorers Game State to Platform User Account

**Date**: 2026-03-02
**Researcher**: Claude Sonnet 4.6
**Git Commit**: `9e9d54bc9fb659acba097c2af3dca7c26f1d63e3`
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Connect the existing server-side, db-based account model with the 10x Explorers game.
Currently the whole game state (`DemoGameState`) sits in localStorage under the key
`10x-explorers-demo-state`. It needs to be tied to the authenticated platform user so that
progress persists across browsers and devices.

---

## Summary

The game is a fully client-side Phaser 3 canvas embedded via a Svelte island
(`client:only="svelte"`). All state is currently read/written from `localStorage`.

The platform already authenticates users with an HttpOnly JWT cookie that encodes the
user's **email** — the only stable user identifier available. The server stack is
Cloudflare Pages/Workers and already makes heavy use of **Cloudflare KV** for
per-user data (magic links, membership cache). No D1 database is configured.

The most natural integration strategy is:

1. **Add a new KV namespace** `GAME_STATE` for per-user game saves.
2. **Add a new API endpoint** `GET /api/game/state` and `PUT /api/game/state` that reads the
   JWT cookie server-side, verifies auth, and reads/writes the KV entry.
3. **Expose the user email** to the Svelte island by reading it in the SSR page
   (`src/pages/explorers.astro`) and passing it as a prop.
4. **Modify `GameStateManager`** to sync with the server: load from KV at boot, push
   to KV on every debounced save, keep localStorage as local cache / fallback.

---

## Detailed Findings

### 1. Current Game State — localStorage Only

**`src/explorers/state/types.ts:1-36`** — `DemoGameState` interface:

```typescript
interface DemoGameState {
  version: 1;
  flags: string[];
  currentMap: MapKey;
  position: { x: number; y: number };
  facing: FacingDirection;
  quests: {
    active: string | null;
    completed: string[];
    objectivesDone: Record<string, string[]>;
  };
  hintIndex: Record<string, number>;
  xp: number;
  commandHistory: string[];
  activityLog: ActivityLogEntry[];
  exams: { completed: string[] };
  bookmarks: BookmarkEntry[];
}
```

**`src/explorers/state/GameStateManager.ts:1-71`** — the persistence layer:
- `SAVE_KEY = '10x-explorers-demo-state'` (`src/explorers/config/constants.ts:43`)
- `loadState()` — reads from `localStorage` (lines 27-46)
- `saveState()` — writes to `localStorage` (lines 48-51)
- `debouncedSaveState()` — 200 ms debounce coalescing rapid writes (lines 56-62)
- `flushSaveState()` — forces immediate write before scene exit (lines 65-71)

**Save triggers** in `src/explorers/scenes/GameScene.ts`:
- Auto-save every 30 s (line 266)
- `flushSaveState()` on scene shutdown (line 287)
- Save on intro flag set (line 526)
- Save on end-screen shown (line 635)

**Save trigger in `src/explorers/PhaserGame.svelte`**:
- `beforeunload` event → `saveState()` (line 173)

No API calls for state — only one server fetch: `GET /api/game` for the static level
manifest (loaded in `BootScene.preload()`, line 22).

---

### 2. User Identity — JWT Cookie with Email

**`src/server/auth.ts:14-28`** — JWT payload contains **only** `{ email, exp, nbf }`.
There is no numeric user ID; **email is the primary user identifier**.

The token is stored in an `HttpOnly` cookie named `token`. Client-side JavaScript
**cannot** read it directly. It must be extracted on the SSR layer.

**`src/server/verifyAuth.ts:1-57`** — `verifyAuth(request, env, options?)`:
- Reads the `token` cookie
- Verifies the JWT signature
- Optionally looks up Airtable purchases
- Returns `{ isAuthenticated, email, purchases }`

The explorers page is an Astro page (SSR), so `verifyAuth` is callable inside its
frontmatter. The user email can then be passed as a prop to the Svelte island.

**`src/pages/explorers.astro`** — currently very thin (lines 1-8); no auth check, no
props passed to `PhaserGame`.

---

### 3. Existing KV Storage Patterns

All KV namespaces follow the same pattern established in `src/server/circle/`:

| Namespace | Key format | TTL | File |
|-----------|-----------|-----|------|
| `MAGIC_LINKS` | `{token}` | 15 min | `remoteMagicLinkManager.ts:23-28` |
| `PLATFORM_LESSON_CACHE` | `v2-{courseId}-{lessonId}` | 24 h | `lessonCache.ts:92-117` |
| `CIRCLE_MEMBERS` | `v1-membership-{platform}-{spaceId}-{email}` | 60-90 d | `membershipCache.ts:65-89` |

**Pattern for a new `GAME_STATE` namespace**:
```
Key: v1-game-{normalizedEmail}
TTL: no expiry (or very long, e.g. 365 days)
Value: JSON-serialised DemoGameState
```

The `membershipCache.ts` is the closest analogue — it is per-user, keyed by email,
with read/write/invalidate helpers. A `gameStateCache.ts` would mirror this structure.

**No D1 database** is configured anywhere — `wrangler.toml` only declares KV namespaces.

---

### 4. API Endpoint Pattern

Existing game API endpoints:
- **`src/pages/api/game.ts`** — `GET /api/game` — returns static level manifest.
  No auth required.
- **`src/pages/api/game-editor.ts`** — `GET /api/game-editor` — editor metadata.

New endpoints needed (mirrors `src/pages/api/customer-purchases.ts` for simplicity):
- **`GET /api/game/state`** — reads KV for current user, returns `DemoGameState | null`.
- **`PUT /api/game/state`** — validates body as `DemoGameState`, writes to KV.

Both endpoints must call `verifyAuth()` (same pattern as every authenticated page)
and return `401` if not authenticated.

---

### 5. Svelte Island — Data Boundary

**`src/pages/explorers.astro`** (currently lines 1-8) renders:
```astro
<PhaserGame client:only="svelte" />
```

To pass the user email, the page must:
1. Call `verifyAuth()` in the frontmatter.
2. Redirect to `/login` if not authenticated (or show a login prompt).
3. Pass `userEmail` as a prop: `<PhaserGame client:only="svelte" userEmail={email} />`.

**`src/explorers/PhaserGame.svelte`** must:
1. Accept `userEmail: string` prop (exported variable).
2. Store it in the Phaser registry so scenes and managers can access it.
3. On `STATE_CHANGED`, fire `PUT /api/game/state` with the current state.

---

### 6. Boot Flow Change

Current `BootScene.create()` (`src/explorers/scenes/BootScene.ts:35-38`):
```typescript
const saved = loadState();
const state = saved ?? createDefaultState();
this.registry.set('demoGameState', state);
```

New flow:
1. Phaser `PhaserGame.svelte` calls `GET /api/game/state` *before* starting Phaser (or
   BootScene does it via `fetch`).
2. If server returns a state → use it (and also write to localStorage as local cache).
3. If server returns null (new user) → fall back to localStorage, then default.
4. Merge strategy: server state wins (more authoritative — cross-device).

---

### 7. Save Flow Change

Current `saveState()` in `GameStateManager.ts:48-51`:
```typescript
export function saveState(state: DemoGameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
```

New `saveState()` should:
1. Still write to `localStorage` (instant, no latency).
2. Also call `PUT /api/game/state` (fire-and-forget or with error log).
3. The `debouncedSaveState()` 200 ms debounce already prevents flooding — but a
   separate, longer debounce (e.g. 5 s) may be desirable for network saves.

---

## Code References

- `src/explorers/state/types.ts:1-36` — `DemoGameState` shape
- `src/explorers/state/GameStateManager.ts:27-51` — load/save implementation
- `src/explorers/config/constants.ts:43-44` — `SAVE_KEY`, `SAVE_INTERVAL_MS`
- `src/explorers/scenes/BootScene.ts:22,35-38` — manifest fetch + state init
- `src/explorers/scenes/GameScene.ts:259-292` — auto-save triggers
- `src/explorers/PhaserGame.svelte:97-107,173` — state accessors + beforeunload save
- `src/server/auth.ts:14-28` — JWT generation (email-only payload)
- `src/server/verifyAuth.ts:1-57` — auth verification helper
- `src/server/circle/membershipCache.ts:32-89` — KV read/write pattern to clone
- `wrangler.toml:6-10` — existing KV namespace declarations
- `src/pages/api/game.ts:1-34` — existing game API endpoint (manifest)
- `src/pages/explorers.astro:1-8` — Svelte island entry point (needs auth + prop)

---

## Architecture Insights

### Recommended Storage Backend: Cloudflare KV

KV is already the proven data store for per-user server-side data in this project
(membership cache, magic links). It is globally replicated and available to Workers
with no additional setup. The read latency for KV in Cloudflare Workers is typically
< 5 ms with edge caching.

A new namespace `GAME_STATE` should be added to `wrangler.toml` with both a
production binding and a `preview_id` for local dev.

### Key format

```
v1-game-state-{normalizedEmail}
```

Normalise email to lowercase before constructing the key (follow the pattern in
`membershipCache.ts:14` where email is lowercased).

### Conflict resolution

The game is single-player and single-session at a time (no concurrent edits expected).
Simple "last write wins" is sufficient — no CRDT needed.

### Local cache strategy

`localStorage` should remain as a local write-through cache:
- Reads: prefer server state at boot, fall back to `localStorage`.
- Writes: write `localStorage` immediately, write KV asynchronously.

This ensures the game feels instant even on slow connections.

### No D1 needed

KV is appropriate here because:
- The access pattern is single key per user (no SQL queries needed).
- The value is a single JSON blob (the full `DemoGameState`).
- No relationships or secondary indices are required.

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `wrangler.toml` | Modify | Add `GAME_STATE` KV namespace binding |
| `src/server/game/gameStateKV.ts` | Create | KV read/write helpers (mirror `membershipCache.ts`) |
| `src/pages/api/game/state.ts` | Create | `GET` and `PUT` endpoint |
| `src/pages/explorers.astro` | Modify | Add auth check + pass `userEmail` prop |
| `src/explorers/PhaserGame.svelte` | Modify | Accept `userEmail`, pass to registry, sync saves to server |
| `src/explorers/scenes/BootScene.ts` | Modify | Load state from server before registry init |
| `src/explorers/state/GameStateManager.ts` | Modify | Add server save alongside localStorage save |
| `astro-env.ts` (env types) | Possibly modify | Add `GAME_STATE` KV type if needed |

---

## Open Questions

1. **Auth gate on `/explorers`** — Is the game accessible to non-authenticated users?
   If yes, the server state sync should be opt-in (only when user is logged in) and
   the game should still work fully with localStorage-only for unauthenticated visitors.

2. **State versioning and migration** — `DemoGameState.version` is currently `1`.
   When the schema changes in future, KV data will need a migration path. Should the
   KV key include the version? Recommendation: keep versioning in the value, not the key.

3. **State size limits** — Cloudflare KV values have a 25 MB limit per value.
   `DemoGameState` is tiny (flags, strings, numbers) — this is not a concern now but
   should be noted if large data (e.g. `commandHistory`, `activityLog`) grows unbounded.
   Consider capping `activityLog` entries (e.g. last 1000).

4. **PUT request security** — The `PUT /api/game/state` endpoint should validate the
   incoming body strictly (Zod schema matching `DemoGameState`) to prevent malformed
   data corrupting the KV store.

5. **Dev/preview environment** — The local dev server uses an in-memory KV mock
   (pattern from `localMagicLinkManager.ts`). A `localGameStateManager.ts` equivalent
   should be created for local development.
