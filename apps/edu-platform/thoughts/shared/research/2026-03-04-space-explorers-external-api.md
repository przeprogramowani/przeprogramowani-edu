---
date: 2026-03-04T00:00:00+00:00
researcher: Claude Sonnet 4.6
git_commit: bb679fa9d745409e2316c9ae60db1d5f01ade7a7
branch: master
repository: przeprogramowani-sites
topic: "Server-side external API for Space Explorers game state (player-authenticated, one-time token)"
tags: [research, codebase, game-state, api, authentication, rate-limiting, cloudflare, kv, supabase]
status: complete
last_updated: 2026-03-04
last_updated_by: Claude Sonnet 4.6
---

# Research: Server-Side External API for Space Explorers Game State

**Date**: 2026-03-04
**Researcher**: Claude Sonnet 4.6
**Git Commit**: `bb679fa9d745409e2316c9ae60db1d5f01ade7a7`
**Branch**: master
**Repository**: przeprogramowani/przeprogramowani-sites

---

## Research Question

Introduce a server-side API, authenticated per player, that allows external clients to interact with Space Explorers game state. Each player first generates a one-time token, then communicates with this API to make changes to game state externally. Requirements: production-grade, rate-limited, abuse-prevention, perfect Cloudflare/Astro execution.

---

## Summary

The platform already has strong foundations in all required areas:

- **Auth**: HS256 JWT in HttpOnly cookies, magic-link one-time tokens via KV, OAuth with CSRF
- **Game state**: Three-tier persistence (localStorage → Cloudflare KV `GAME_STATE` → Supabase `game_state` table)
- **Rate limiting**: Cookie-based, currently only on `/api/auth` (10s limit). **Gap**: No server-side IP-based limiting
- **API pattern**: Standard Astro `APIRoute` (`export const GET/PUT/POST: APIRoute`)
- **Supabase**: `profiles` + `access_grants` + `game_state` tables; service-role server-only

The new external API should:
1. Add a new KV namespace (e.g. `GAME_API_TOKENS`) for short-lived player tokens
2. Add endpoints: `POST /api/game/token` (generate token) + `GET|PUT /api/game/external/state` (use token via Bearer header)
3. Upgrade rate limiting to KV-based (IP + token) for true server-side enforcement
4. Add strict `GameState` schema validation (already exists in `state.ts`) + mutation allow-listing

---

## Detailed Findings

### 1. JWT & Authentication Architecture

**JWT payload structure** (`src/server/auth.ts:3-17`):
```typescript
{ email: string; exp: number; nbf: number }
```
- Algorithm: HS256 via `@tsndr/cloudflare-worker-jwt`
- Lifetime: 24 hours, auto-refreshed if <1 hour remains
- Storage: `token` cookie (HttpOnly, Secure, SameSite=Lax)
- Clock tolerance: 60 seconds

**Magic link / one-time token pattern** (`src/server/magic-links/remoteMagicLinkManager.ts`):
- Store: KV namespace `MAGIC_LINKS`, key = token, value = `{ email, expiresAt }`, TTL = 900s
- Token consumed and deleted on first successful verification
- **This is the exact pattern to reuse for player API tokens**

**Token generation** is centralized in `src/server/auth.ts:generateToken()` — used everywhere consistently.

### 2. Game State Data Model

**Full `GameState` interface** (`src/explorers/state/types.ts:1-36`):
```typescript
interface GameState {
  version: 1;
  flags: string[];
  currentMap: MapKey;
  position: { x: number; y: number };
  facing: 'down' | 'up' | 'left' | 'right';
  quests: { active: string | null; completed: string[]; objectivesDone: Record<string, string[]> };
  hintIndex: Record<string, number>;
  xp: number;
  commandHistory: string[];
  activityLog: ActivityLogEntry[];
  exams: { completed: string[] };
  bookmarks: BookmarkEntry[];
}
```

**Validation function already exists** (`src/pages/api/game/state.ts:6-31`) — `isValidGameState()` covers all fields.

**State persistence tiers**:
1. `localStorage` (client, immediate, key: `10x-explorers-demo-state`)
2. Cloudflare KV `GAME_STATE` (primary server, key: `v1-game-state-{email}`, TTL: 365d)
3. Supabase `public.game_state` (durable backup, upsert on `user_id`)

**Write path** (`src/server/game/serverGameStateManager.ts:14-32`):
- KV write is blocking; Supabase write is fire-and-forget

### 3. Existing Game API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/game` | GET | none | Game manifest (levels, dialogues, quests) |
| `/api/game/state` | GET | JWT cookie | Load player state |
| `/api/game/state` | PUT | JWT cookie | Save player state (validated) |
| `/api/game-editor` | GET | none | Editor metadata |

Auth in these endpoints (`src/pages/api/game/state.ts:33-38`):
```typescript
const token = context.cookies.get('token')?.value;
const payload = await verifyToken(token, JWT_SECRET);
if (!payload) return new Response(null, { status: 401 });
```

### 4. Rate Limiting — Current State & Gaps

**Current implementation** (`src/middlewares/index.ts`, `src/server/rateLimiter.ts`):
- Type: **Cookie-based** — tracks last request time per route in `app_rl_v1` cookie
- Protected paths: `/api/auth` (10s), `/api/external/auth` (10s)
- Critical gap: **Client-controlled** — user can delete cookie to bypass

**Gap for external API**: External clients have no cookies. Need **KV-based server-side rate limiting**:
- Key pattern: `rl-{ip}-{route}` or `rl-token-{tokenHash}-{route}`
- Cloudflare KV supports `expirationTtl` for auto-expiry of rate limit windows

**Bearer token auth** already used for admin-only endpoints (`src/pages/api/external/membership-refresh.ts:28-35`):
```typescript
function isAuthorized(request: Request, secret?: string): boolean {
  const authHeader = request.headers.get('Authorization');
  return authHeader === `Bearer ${secret}`;
}
```

### 5. Supabase Layer

**`game_state` table** (`supabase/migrations/20260303000000_initial_schema.sql:22-28`):
```sql
create table public.game_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  version    int  default 1,
  updated_at timestamptz default now()
);
```

**Service pattern** (`src/server/supabase/gameSyncService.ts`):
- `saveGameState(userId, state, env)` — upsert on `user_id`
- `loadGameState(userId, env)` — single row select
- `getUserIdByEmail(email, env)` in `userService.ts` — needed to convert email → UUID

**New table needed**: `game_api_tokens` for persistent player-issued tokens:
```sql
create table public.game_api_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  token_hash text unique not null,   -- bcrypt/SHA-256 hash of raw token
  created_at timestamptz default now(),
  last_used  timestamptz,
  expires_at timestamptz,
  revoked    boolean default false
);
```

### 6. Cloudflare KV Namespaces (Current)

From `wrangler.toml:6-11`:
| Binding | Purpose |
|---------|---------|
| `MAGIC_LINKS` | One-time magic link tokens (900s TTL) |
| `PLATFORM_LESSON_CACHE` | Circle.so lesson HTML caching |
| `CIRCLE_MEMBERS` | Circle API membership L1 cache |
| `GAME_STATE` | Primary game state store (365d TTL) |

**New namespace needed**: `GAME_API_TOKENS` — for rate limit windows and token validation cache.

### 7. Astro API Route Pattern

All endpoints use:
```typescript
import type { APIContext, APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }: APIContext) => {
  const env = locals.runtime.env;
  // ...
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

Environment accessed via `locals.runtime.env` — consistent across all 14+ endpoints.

---

## Architecture Design: New External API

### Token Lifecycle

```
Player (in-game UI)
  └─> POST /api/game/token          (authenticated via 'token' cookie)
      └─> Generate random token (crypto.randomUUID() × 2 concatenated)
      └─> Store SHA-256 hash in Supabase game_api_tokens
      └─> Store in KV GAME_API_TOKENS (key=tokenHash, value={email}, TTL=30d)
      └─> Return raw token ONCE (never stored in plaintext)

External Client
  └─> GET /api/game/external/state  (Authorization: Bearer {raw_token})
      └─> Hash incoming token → lookup in KV → get email
      └─> Enforce rate limits (KV-based, IP + token)
      └─> Load state from serverGameStateManager
      └─> Return GameState JSON

  └─> PUT /api/game/external/state  (Authorization: Bearer {raw_token})
      └─> Hash token → validate
      └─> Enforce rate limits
      └─> Validate body with isValidGameState() + allowed-mutation check
      └─> Save via serverGameStateManager
```

### New Files Required

| File | Purpose |
|------|---------|
| `src/pages/api/game/token.ts` | `POST` — generate player API token |
| `src/pages/api/game/external/state.ts` | `GET` / `PUT` — external state access |
| `src/server/game/apiTokenManager.ts` | Token create/validate/revoke logic |
| `src/server/kvRateLimiter.ts` | KV-based server-side rate limiter |
| `supabase/migrations/YYYYMMDD_game_api_tokens.sql` | Token storage table |

### Rate Limiting Design (KV-based)

```typescript
// Key pattern: rl:{window}:{identifier}
// e.g. rl:60:ip:1.2.3.4 or rl:60:tok:abc123hash

async function kvRateLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${Math.floor(now / windowSeconds)}:${key}`;
  const current = Number(await kv.get(windowKey) ?? '0');
  if (current >= limit) {
    return { allowed: false, remaining: 0, resetAt: (Math.floor(now / windowSeconds) + 1) * windowSeconds };
  }
  await kv.put(windowKey, String(current + 1), { expirationTtl: windowSeconds * 2 });
  return { allowed: true, remaining: limit - current - 1, resetAt: (Math.floor(now / windowSeconds) + 1) * windowSeconds };
}
```

### Abuse Prevention Layers

1. **KV rate limit per IP**: 60 req/min for reads, 20 req/min for writes
2. **KV rate limit per token**: 100 req/min hard cap
3. **State mutation allow-list**: External API only allows writing specific fields (flags, xp, quests, exams) — not `commandHistory`, `activityLog`, `position`, `currentMap` (those are client-driven)
4. **Token expiry**: 30 days max, stored in Supabase + KV
5. **Token revocation**: `DELETE /api/game/token` endpoint sets `revoked=true` in Supabase + deletes from KV
6. **Supabase token table**: Allows audit log — `last_used` updated on each API call
7. **Response headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Code References

- `src/explorers/state/types.ts:1-36` — GameState interface
- `src/pages/api/game/state.ts:6-31` — isValidGameState() validation
- `src/pages/api/game/state.ts:40-100` — Existing GET/PUT pattern to follow
- `src/server/game/serverGameStateManager.ts:7-32` — Unified KV+Supabase write
- `src/server/game/remoteGameStateKV.ts:1-43` — KV read/write (key: `v1-game-state-{email}`, TTL: 365d)
- `src/server/auth.ts:3-17` — JWT generation (reuse for token generation)
- `src/server/magic-links/remoteMagicLinkManager.ts:23-45` — One-time token KV pattern to replicate
- `src/server/rateLimiter.ts:11-84` — Current cookie-based limiter (replace with KV for external API)
- `src/middlewares/index.ts:5-36` — Middleware config, needs new route entries
- `src/server/supabase/gameSyncService.ts:1-34` — Game state DB service
- `src/server/supabase/userService.ts:48-59` — `getUserIdByEmail()` for email→UUID
- `src/pages/api/external/membership-refresh.ts:28-35` — Bearer token auth pattern
- `wrangler.toml:6-11` — KV namespace config (add `GAME_API_TOKENS`)
- `supabase/migrations/20260303000000_initial_schema.sql:22-28` — game_state table structure
- `astro-env.ts:1-86` — Environment variable schema (add any new secrets here)

---

## Architecture Insights

### Patterns to Follow

1. **Fire-and-forget for Supabase** — all DB writes use `ctx.waitUntil()` (non-blocking on Cloudflare Workers). The external API PUT should do the same: KV write blocking, Supabase async.

2. **Email as stable identifier** — all game state is keyed by email in KV and by UUID in Supabase. The token lookup should return email, then `getUserIdByEmail()` maps to UUID for Supabase.

3. **Graceful degradation** — all existing services log errors and return null rather than throwing, keeping the request alive.

4. **ENV guard for local dev** — `serverGameStateManager` checks `env.ENV === 'PROD'` to switch between KV and in-memory store. Token manager should do the same.

5. **No RLS on Supabase** — all access is server-side via service role key. The game_api_tokens table requires the same approach.

### Key Constraints for Implementation

- **No `@apply` in CSS** — utility classes only
- **No React** — use Svelte for any UI additions (token management UI in game)
- **Server-rendered output** — all new pages/API routes work with `output: 'server'`
- **`nodejs_compat`** — available in Cloudflare Workers (wrangler.toml), so Node crypto APIs work
- **UTF-8**: Use `response.text()` not `.json()` for Circle API (not relevant here, but noted)

---

## Finalized Design (after user clarification)

### Core API surface (minimal, stable)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/game/submit` | POST | Submit quest answer (Bearer token) |
| `GET /api/game/mission` | GET | Get current active quest + hint (Bearer token) |
| `POST /api/game/token` | POST | Generate player API token (session cookie) |

Single endpoint forever — Navigator always calls the same URL. New moons add quest manifest entries, not endpoints.

### Passphrase model

Each quest in the level manifest gains two optional fields:
```typescript
'q-setup-mcp': {
  // ... existing fields ...
  answerHash: 'a3f2b1...',   // sha256(canonical_answer.trim().toLowerCase())
  hint: 'The name of the MCP server you configured'
}
```

Submit flow:
```
POST /api/game/submit
Authorization: Bearer 10X-DEXO-7F3A-K9M2
{ quest_id: 'q-setup-mcp', answer: 'CONTEXT7' }

Server: sha256('context7') === answerHash?
  → yes: set flags, grant XP, return { accepted, xp, flags, message }
  → no:  return { accepted: false, hint }
```

### HQ GitHub repo (parallel narrative)
- Public repo, one directory per moon/chapter
- Each chapter: `README.md` (mission brief, narrative) + `task.ts` or `task.md` (the challenge)
- Running the task locally produces a deterministic output (passphrase, number, model name, etc.)
- Navigator submits that output to the API
- Zero server-side AI cost — all LLM/AI work runs on Navigator's machine

### Token model

Token generation is triggered the first time the player runs `/support` in the SmartTerminal. The in-game terminal calls `GET /api/game/token` (authenticated via the existing session `token` cookie).

**Generation flow:**
```
GET /api/game/token
Cookie: token=<jwt>

Server:
1. Verify JWT → extract email
2. getUserIdByEmail(email) → userId
3. Check KV GAME_API_TOKENS key `api-token-exists:{userId}` (fast existence check)
   → exists: return masked token + "already generated" flag
   → not exists:
     a. Generate raw token: format `10X-{UUID_SEGMENT_1}-{UUID_SEGMENT_2}-{UUID_SEGMENT_3}`
        e.g. crypto.randomUUID() → take 3 groups of 4 chars → `10X-7F3A-K9M2-B4C1`
        Each user gets a unique value derived from UUID — format is narratively consistent,
        value is cryptographically unique per player.
     b. Compute SHA-256 hash of raw token (stored, never the raw value)
     c. Store in Supabase game_api_tokens: { user_id, token_hash, created_at }
     d. Store in KV GAME_API_TOKENS: key=token_hash → value=email, TTL=30d
     e. Store existence marker in KV: key=`api-token-exists:{userId}` → value='1', TTL=30d
     f. Return raw token ONCE in response body

Response (first time): { token: "10X-7F3A-K9M2-B4C1", generated: true }
Response (subsequent): { token: "10X-****-****-B4C1", generated: false }
```

**API auth flow (every submit call):**
```
Authorization: Bearer 10X-7F3A-K9M2-B4C1

Server:
1. Extract raw token from header
2. Compute SHA-256(rawToken)
3. KV lookup: GAME_API_TOKENS.get(hash) → email
4. If found: proceed (email is now trusted identity)
5. If not found: 401 Unauthorized
```

- Raw token never stored anywhere server-side — only the hash
- Displayed ONCE in SmartTerminal dialogue; masked on all subsequent checks
- Player can regenerate (invalidates old token: delete from KV + update Supabase row)

### Rate limiting (KV-based, not cookie-based)
- Per-token: 20 submissions/hour (brute-force prevention for answer hashes)
- Per-IP: 60 requests/minute (general abuse prevention)
- Key: `rl:{window}:{identifier}`, TTL = window × 2

### Real-time feedback
- V1: polling on terminal open / scene load (`/api/game/pending-events`)
- V2: SSE stream while game is active (Cloudflare-compatible, no Durable Objects)
- V3: WebSocket via Durable Objects (future, if multiplayer or live events needed)

## Open Questions

1. **Should token generation require the player to already have `explorers` access grant?** (Currently all logged-in users get this free, so likely yes — check `access_grants` for `course_slug = 'explorers'`)

2. **What mutations should external API allow?** Propose: only `flags` (add/check), `xp` (increment), `quests.completed` (add), `exams.completed` (add). Read-only for `position`, `currentMap`, `commandHistory`.

3. **Token UI location**: Should the token generation UI live in the game HUD, a settings panel, or a dedicated `/settings/api` page?

4. **Multiple tokens per player?** Supabase schema supports it (no unique on `user_id`), but needs UI for listing/revoking.

5. **Should the new KV namespace be `GAME_API_TOKENS` or reuse `MAGIC_LINKS`?** Reusing would require care around key namespace collisions. A dedicated namespace is cleaner.

6. **wrangler.toml local dev KV IDs** — need to create actual KV namespaces in Cloudflare dashboard for `GAME_API_TOKENS`.
