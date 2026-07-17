# Space Explorers External API — Implementation Plan

## Overview

Implement a production-grade server-side external API for the Space Explorers game that lets external clients (the "Navigator" developer workflow) submit quest answers and query active missions using a per-player Bearer token. The system includes player-authenticated token generation, KV-based rate limiting, SHA-256 answer validation against hashed quest solutions, and automatic game state updates on correct submission.

**Scope:** 3 endpoints + KV rate limiter + middleware bug fix + Supabase migration + `ApiAnswerQuest` type + SmartTerminal `/support` command.

**Out of scope:** `GET /api/game/pending-events`, HQ GitHub repository, token revocation UI, multiple tokens per player.

---

## Current State Analysis

**What exists:**
- Full game state persistence: KV (`GAME_STATE`) → Supabase `game_state` backup (`src/server/game/serverGameStateManager.ts:13-32`)
- JWT-based session auth via HttpOnly `token` cookie (`src/server/auth.ts`)
- Two quest completion types: `TextAnswerQuest` (via `/solve` in terminal) and `EventQuest` (auto-complete on game events) — `src/explorers/systems/QuestManager.ts`
- Existing API route pattern: `src/pages/api/game/state.ts` (GET/PUT with cookie auth)
- Bearer token auth pattern: `src/pages/api/external/membership-refresh.ts:28-35`
- Magic link one-time token pattern: `src/server/magic-links/remoteMagicLinkManager.ts`

**Critical bug discovered:**
`src/middlewares/index.ts:15-22` — `matchedLimit` is declared but never assigned inside the for loop (only `matchedPath` is set). The condition `matchedLimit !== undefined` at line 24 is always `false` → rate limiting middleware is **completely non-functional** in production. Must be fixed in Phase 2.

**What's missing:**
- `ApiAnswerQuest` quest type (quests solved via external API)
- `GAME_API_TOKENS` KV namespace (for token hash→email lookup + rate limit windows)
- Supabase `game_api_tokens` table (durable audit record)
- `src/server/game/apiTokenManager.ts` — token lifecycle logic
- `src/server/kvRateLimiter.ts` — IP + token KV-based rate limiting
- 3 new API endpoints: `GET /api/game/token`, `GET /api/game/mission`, `POST /api/game/submit`
- Server-side `getAllQuests()` helper for manifest access in submit endpoint
- SmartTerminal `/support` command

---

## Desired End State

1. A logged-in player with `explorers` access grant calls `GET /api/game/token` (with session cookie) and receives a unique token formatted as `10X-XXXX-XXXX-XXXX`.
2. The SmartTerminal `/support` command shows the token (masked on subsequent calls: `10X-****-****-XXXX`).
3. An external client (Navigator) calls `GET /api/game/mission` with `Authorization: Bearer 10X-...` to see the active api-answer quest.
4. The Navigator calls `POST /api/game/submit` with `{ quest_id, answer }` — if the answer's SHA-256 hash matches the quest manifest, game state updates (quest completed, XP granted, flags set).
5. Rate limiting enforced server-side via KV: 20 submissions/hour per token, 60 requests/min per IP.

**Verification:**
- `GET /api/game/token` with valid session + explorers grant → `200 { token: "10X-...", generated: true }`
- `POST /api/game/submit` correct answer → `200 { accepted: true, xp: 10, flags: ["..."] }`
- `POST /api/game/submit` wrong answer → `200 { accepted: false, hint: "..." }`
- `POST /api/game/submit` 21st call in 1h → `429` with `X-RateLimit-*` headers

### Key Discoveries:

- `src/explorers/systems/QuestManager.ts` — discriminated union `QuestDefinition = TextAnswerQuest | EventQuest`
- `src/explorers/levels/index.ts` — aggregates all level manifests (server-importable)
- `src/middlewares/index.ts:15-22` — matchedLimit never assigned (rate limiting bug)
- `src/server/game/remoteGameStateKV.ts:10-15` — KV key: `v1-game-state-{email.toLowerCase().trim()}`
- `src/server/magic-links/remoteMagicLinkManager.ts:22-27` — KV token storage pattern to replicate
- `src/server/supabase/userService.ts:45-55` — `getUserIdByEmail()` for email→UUID
- `wrangler.toml:6-11` — KV namespace config (needs `GAME_API_TOKENS` added)

---

## What We're NOT Doing

- `GET /api/game/pending-events` (polling for server-pushed events) — V2
- HQ GitHub repository setup — separate project
- Token revocation endpoint — V2 (players regenerate by manual DB action for now)
- Multiple tokens per player (one active token per player in V1)
- WebSocket/SSE real-time updates — V3

---

## Implementation Approach

Build bottom-up: types first (quest model), then infrastructure (KV namespace, rate limiter, middleware fix), then Supabase persistence (migration), then token management service + endpoint, then external API endpoints, finally SmartTerminal integration.

**Security constraint:** `answerHash` is stored in level manifest TypeScript files and must be **stripped from the public `/api/game` response** — clients must never see the hash to prevent brute-force precomputation.

**Submit idempotency:** If quest is already in `quests.completed`, return `{ accepted: true, already_completed: true }` without modifying state (no double XP).

**Local dev:** `env.ENV !== 'PROD'` → `resolveTokenToEmail()` returns `null` → external endpoints return 401 locally (KV not available in dev). Token generation still works via Supabase only.

---

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: Pure backend API with no React/Svelte lifecycle concerns. SmartTerminal integration is a simple `fetch()` call in an existing Svelte event handler.

### User Experience Specification (SmartTerminal)

- `/support` command: first call shows full token `10X-XXXX-XXXX-XXXX` with Polish narrative framing ("Token nawigacyjny wygenerowany").
- Subsequent calls show masked `10X-****-****-XXXX` (last segment visible for identification).
- Token generation is synchronous — terminal awaits API response before printing lines.
- All terminal output in Polish (per project constraint).

### Performance & Optimization Strategy

- Token lookup: SHA-256 → KV `GAME_API_TOKENS.get(hash)` → O(1), ~5ms edge-local.
- Submit total: 2 rate limit KV reads/writes + 1 token KV lookup + 1 state KV load + 1 state KV write ≈ 50–100ms.
- Supabase state backup: fire-and-forget (non-blocking), consistent with `serverGameStateManager.ts:21-29`.
- Rate limit window key: `rl:{windowStart}:{identifier}` with TTL = window × 2 seconds (auto-expiry).

### State Management Sequencing (Submit)

```
1. Extract raw token from Authorization header
2. SHA-256(rawToken) → tokenHash
3. GAME_API_TOKENS.get(tokenHash) → email  [or 401]
4. kvRateLimit(ip, 60req/min)             [or 429]
5. kvRateLimit(tokenHash, 20req/hour)     [or 429]
6. loadGameState(email, env)              [KV]
7. quest_id in quests.completed?          → 200 already_completed
8. getAllQuests().get(quest_id)            [server-side manifest import]
9. quest.completionType === 'api-answer'? [or 404]
10. sha256(answer.trim().toLowerCase()) === quest.answerHash?
    → no:  200 { accepted: false, hint }
    → yes: update state + saveGameState() + 200 { accepted: true, xp, flags }
```

### Debug & Observability Plan

- Console log prefixes: `[api/game/token]`, `[api/game/mission]`, `[api/game/submit]`, `[apiTokenManager]`, `[kvRateLimiter]`
- Rate limit responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers.
- Token operations log `{ userId }` (never email in full, truncated for logs).
- Quest completion logs: `{ quest_id, email: email.slice(0,3) + '...' }`.

---

## Phase 1: Quest Type Extension

### Overview

Add `ApiAnswerQuest` to the quest type system and strip `answerHash` from the public `/api/game` response.

### Changes Required:

#### 1. Extend QuestDefinition union

**File**: `src/explorers/systems/QuestManager.ts`

Add `ApiAnswerQuest` interface and extend the `QuestDefinition` union:

```typescript
export interface ApiAnswerQuest extends BaseQuestDefinition {
  completionType: 'api-answer';
  /** SHA-256 hex digest of canonical answer (trim + lowercase) — server-side only, stripped from public API */
  answerHash: string;
  /** Hint returned to Navigator on wrong answer */
  hint: string;
}

export type QuestDefinition = TextAnswerQuest | EventQuest | ApiAnswerQuest;
```

The `QuestManager` does not handle `api-answer` completion — that is the submit endpoint's responsibility. `QuestManager` handles activation and `/quest` display only.

#### 2. Strip answerHash from public API response

**File**: `src/pages/api/game.ts`

Add a sanitization helper and apply it when building the quests array in the response:

```typescript
function sanitizeQuest(quest: QuestDefinition): Omit<QuestDefinition, 'answerHash'> {
  if (quest.completionType === 'api-answer') {
    const { answerHash: _stripped, ...publicQuest } = quest;
    return publicQuest;
  }
  return quest;
}
```

Apply `sanitizeQuest()` for every quest when serializing `GameManifestLevel.quests`.

#### 3. Add server-side getAllQuests helper

**File**: `src/explorers/levels/index.ts`

Export a server-side helper that flattens all quests from all manifests into a Map:

```typescript
export function getAllQuests(): Map<string, QuestDefinition> {
  const map = new Map<string, QuestDefinition>();
  for (const manifest of Object.values(allLevels)) {
    for (const quest of manifest.quests ?? []) {
      map.set(quest.id, quest);
    }
  }
  return map;
}
```

### Success Criteria:

#### Automated Verification:
- [x] `npx tsc --noEmit` passes
- [x] `npx vitest run` passes (no regressions)

#### Manual Verification:
- [ ] `GET /api/game` response does NOT include `answerHash` for any `api-answer` quest
- [ ] A test `ApiAnswerQuest` defined in a level manifest compiles without TypeScript errors

**Implementation Note**: After this phase passes automated checks, confirm manually that the public `/api/game` response JSON does not contain `answerHash` before proceeding.

---

## Phase 2: Infrastructure — KV Namespace + Rate Limiter + Middleware Fix

### Overview

Fix the non-functional rate limiting middleware, create a reusable KV-based rate limiter, and register the new `GAME_API_TOKENS` KV namespace.

### Changes Required:

#### 1. Fix middleware bug

**File**: `src/middlewares/index.ts`

Current broken loop (lines 15–22) — `matchedLimit` is never set:

```typescript
// BROKEN: matchedLimit is always undefined
for (const pathPrefix in RATE_LIMIT_CONFIG) {
  if (currentPath.startsWith(pathPrefix)) {
    matchedPath = pathPrefix;
    break; // matchedLimit never assigned!
  }
}
```

Fixed:

```typescript
for (const pathPrefix in RATE_LIMIT_CONFIG) {
  if (currentPath.startsWith(pathPrefix)) {
    matchedPath = pathPrefix;
    matchedLimit = RATE_LIMIT_CONFIG[pathPrefix]; // ← add this line
    break;
  }
}
```

#### 2. Add GAME_API_TOKENS to wrangler.toml

**File**: `wrangler.toml`

```toml
kv_namespaces = [
  { binding = "MAGIC_LINKS",           id = "a67fe4e98cbd459088d056668f9fe302" },
  { binding = "PLATFORM_LESSON_CACHE", id = "b14217e30ebf42cb82d9afb708d3c418" },
  { binding = "CIRCLE_MEMBERS",        id = "1f0379f28e60442f9dc0455a70387dba" },
  { binding = "GAME_STATE",            id = "20d16620dfdb441a99454c15fea0dc09" },
  { binding = "GAME_API_TOKENS",       id = "REPLACE_WITH_REAL_KV_ID" }
]
```

> **Action required before deployment**: Create the `GAME_API_TOKENS` namespace in the Cloudflare dashboard (Workers & Pages → KV) and substitute the real ID.

#### 3. Create KV-based rate limiter

**New File**: `src/server/kvRateLimiter.ts`

```typescript
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp (seconds)
}

export async function kvRateLimit(
  kv: KVNamespace,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds);
  const key = `rl:${windowStart}:${identifier}`;
  const resetAt = (windowStart + 1) * windowSeconds;

  const current = Number((await kv.get(key)) ?? '0');
  if (current >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  await kv.put(key, String(current + 1), { expirationTtl: windowSeconds * 2 });
  return { allowed: true, remaining: limit - current - 1, resetAt };
}

export function rateLimitHeaders(
  result: RateLimitResult,
  limit: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetAt),
  };
}
```

### Success Criteria:

#### Automated Verification:
- [x] `npx tsc --noEmit` passes
- [x] `wrangler.toml` has `GAME_API_TOKENS` binding entry

#### Manual Verification:
- [ ] Rapid repeated calls to `/api/auth` within 10s now return 429 (middleware bug confirmed fixed)
- [ ] `kvRateLimiter.ts` compiles with correct KVNamespace type

**Implementation Note**: Verify the middleware fix by making two quick POST requests to `/api/auth` — the second should return 429.

---

## Phase 3: Supabase Migration

### Overview

Create the `game_api_tokens` table for durable token storage and audit trail (last_used tracking).

### Changes Required:

#### 1. New migration file

**New File**: `supabase/migrations/20260304000000_game_api_tokens.sql`

```sql
-- Player-issued API tokens for external game state access.
-- Raw tokens are NEVER stored — only their SHA-256 hex hash.
create table public.game_api_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  token_hash  text unique not null,   -- hex(sha256(raw_token))
  created_at  timestamptz default now(),
  last_used   timestamptz,
  expires_at  timestamptz,            -- null = governed by KV TTL (30d)
  revoked     boolean default false
);

create index on public.game_api_tokens(user_id);
create index on public.game_api_tokens(token_hash);
```

### Success Criteria:

#### Automated Verification:
- [x] `npx supabase db push` completes without errors (local Supabase)
- [ ] Table visible in local Supabase Studio at `http://127.0.0.1:54323`

#### Manual Verification:
- [ ] Insert test row succeeds
- [ ] Inserting a duplicate `token_hash` value fails with unique constraint error

---

## Phase 4: Token Management Service + GET /api/game/token

### Overview

Build the token lifecycle service (`apiTokenManager.ts`) and the token generation/retrieval endpoint. Players call this once from the SmartTerminal `/support` command.

### Changes Required:

#### 1. Token manager service

**New File**: `src/server/game/apiTokenManager.ts`

```typescript
import { getUserIdByEmail } from '@/server/supabase/userService';
import { getSupabaseAdmin } from '@/server/supabase/client';

interface TokenEnv {
  GAME_API_TOKENS: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ENV: string;
}

const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateRawToken(): string {
  // Format: 10X-XXXX-XXXX-XXXX (3 groups of 4 uppercase hex chars from UUID)
  const segments = crypto.randomUUID().split('-'); // [8, 4, 4, 4, 12]
  return `10X-${segments[1].toUpperCase()}-${segments[2].toUpperCase()}-${segments[3].toUpperCase()}`;
}

function maskToken(rawToken: string): string {
  const parts = rawToken.split('-');
  return `10X-****-****-${parts[3]}`; // keep last segment for identification
}

export async function getOrCreateToken(
  email: string,
  env: TokenEnv
): Promise<{ token: string; generated: boolean }> {
  const userId = await getUserIdByEmail(email, env);
  if (!userId) throw new Error(`[apiTokenManager] User not found: ${email}`);

  const existenceKey = `api-token-exists:${userId}`;

  if (env.ENV === 'PROD') {
    const maskedExisting = await env.GAME_API_TOKENS.get(existenceKey);
    if (maskedExisting) {
      console.info('[apiTokenManager] token_retrieved', { userId: userId.slice(0, 8) });
      return { token: maskedExisting, generated: false };
    }
  }

  // Generate new token
  const rawToken = generateRawToken();
  const tokenHash = await sha256hex(rawToken);

  // Persist hash in Supabase (durable audit record)
  const supabase = getSupabaseAdmin(env);
  await supabase.from('game_api_tokens').insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString(),
  });

  if (env.ENV === 'PROD') {
    // hash → email for Bearer token lookup
    await env.GAME_API_TOKENS.put(tokenHash, email, { expirationTtl: TOKEN_TTL_SECONDS });
    // existence marker with masked token for subsequent /support calls
    await env.GAME_API_TOKENS.put(existenceKey, maskToken(rawToken), {
      expirationTtl: TOKEN_TTL_SECONDS,
    });
  }

  console.info('[apiTokenManager] token_generated', { userId: userId.slice(0, 8) });
  return { token: rawToken, generated: true };
}

export async function resolveTokenToEmail(
  rawToken: string,
  env: TokenEnv
): Promise<string | null> {
  // Basic format guard before hashing
  if (!/^10X-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(rawToken)) return null;
  if (env.ENV !== 'PROD') return null; // KV not available locally

  const tokenHash = await sha256hex(rawToken);
  return env.GAME_API_TOKENS.get(tokenHash);
}
```

#### 2. Token endpoint

**New File**: `src/pages/api/game/token.ts`

```typescript
import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { getOrCreateToken } from '@/server/game/apiTokenManager';
import { getSupabaseAdmin } from '@/server/supabase/client';

export const GET: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  // Authenticate via session cookie
  const sessionToken = context.cookies.get('token')?.value;
  const payload = await verifyToken(sessionToken, env.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email } = payload;
  const supabase = getSupabaseAdmin(env);

  // Lookup user profile (needed for access_grants check)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check explorers access grant
  const { data: accessGrant } = await supabase
    .from('access_grants')
    .select('id')
    .eq('user_id', profile.id)
    .eq('course_slug', 'explorers')
    .maybeSingle();

  if (!accessGrant) {
    return new Response(JSON.stringify({ error: 'Forbidden: explorers access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await getOrCreateToken(email, env);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/game/token GET] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

### Success Criteria:

#### Automated Verification:
- [x] `npx tsc --noEmit` passes
- [x] `npx vitest run` passes

#### Manual Verification:
- [ ] `GET /api/game/token` with valid session + explorers grant → `200 { token: "10X-...", generated: true }`
- [ ] Second call → `200 { token: "10X-****-****-XXXX", generated: false }`
- [ ] Without session cookie → `401`
- [ ] Session valid but no explorers grant → `403`
- [ ] Token row inserted in Supabase `game_api_tokens` table (verify via Studio)

---

## Phase 5: External API Endpoints

### Overview

Implement `GET /api/game/mission` (active quest for Navigator) and `POST /api/game/submit` (answer submission with SHA-256 validation and game state update).

### Changes Required:

#### 1. Mission endpoint

**New File**: `src/pages/api/game/mission.ts`

```typescript
import type { APIContext, APIRoute } from 'astro';
import { resolveTokenToEmail } from '@/server/game/apiTokenManager';
import { loadGameState } from '@/server/game/serverGameStateManager';
import { getAllQuests } from '@/explorers/levels/index';

export const GET: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  const authHeader = context.request.headers.get('Authorization');
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!rawToken) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = await resolveTokenToEmail(rawToken, env);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const state = await loadGameState(email, env);
  if (!state?.quests.active) {
    return new Response(JSON.stringify({ error: 'No active mission' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const quest = getAllQuests().get(state.quests.active);
  if (!quest || quest.completionType !== 'api-answer') {
    return new Response(
      JSON.stringify({ error: 'Active quest does not support external submission' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      mission: {
        quest_id: quest.id,
        title: quest.title,
        briefing: quest.briefing,
        hint: quest.hint,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

#### 2. Submit endpoint

**New File**: `src/pages/api/game/submit.ts`

```typescript
import type { APIContext, APIRoute } from 'astro';
import { resolveTokenToEmail } from '@/server/game/apiTokenManager';
import { loadGameState, saveGameState } from '@/server/game/serverGameStateManager';
import { kvRateLimit, rateLimitHeaders } from '@/server/kvRateLimiter';
import { getAllQuests } from '@/explorers/levels/index';
import type { ApiAnswerQuest } from '@/explorers/systems/QuestManager';

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const POST: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  // Auth
  const authHeader = context.request.headers.get('Authorization');
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!rawToken) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = await resolveTokenToEmail(rawToken, env);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Rate limiting (PROD only — KV not available locally)
  if (env.ENV === 'PROD') {
    const ip = context.request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const tokenHash = await sha256hex(rawToken);

    const ipResult = await kvRateLimit(env.GAME_API_TOKENS, `ip:${ip}`, 60, 60);
    const tokenResult = await kvRateLimit(env.GAME_API_TOKENS, `tok:${tokenHash}`, 20, 3600);

    if (!ipResult.allowed || !tokenResult.allowed) {
      const binding = !ipResult.allowed ? ipResult : tokenResult;
      const limit = !ipResult.allowed ? 60 : 20;
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...rateLimitHeaders(binding, limit) },
      });
    }
  }

  // Parse body
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { quest_id, answer } = body as { quest_id?: string; answer?: string };
  if (!quest_id || typeof answer !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing quest_id or answer' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Load game state
  const state = await loadGameState(email, env);
  if (!state) {
    return new Response(JSON.stringify({ error: 'Game state not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Idempotency check
  if (state.quests.completed.includes(quest_id)) {
    return new Response(
      JSON.stringify({ accepted: true, already_completed: true, message: 'Misja już zaliczona.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Quest lookup (server-side manifest — includes answerHash)
  const quest = getAllQuests().get(quest_id);
  if (!quest || quest.completionType !== 'api-answer') {
    return new Response(
      JSON.stringify({ error: 'Quest not found or not externally submittable' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiQuest = quest as ApiAnswerQuest;
  const candidateHash = await sha256hex(answer.trim().toLowerCase());

  if (candidateHash !== apiQuest.answerHash) {
    return new Response(
      JSON.stringify({ accepted: false, hint: apiQuest.hint }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Correct answer — update state
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

  console.info('[api/game/submit] quest_completed', {
    quest_id,
    email: email.slice(0, 3) + '...',
  });

  return new Response(
    JSON.stringify({
      accepted: true,
      xp: apiQuest.rewards.xp ?? 0,
      flags: apiQuest.rewards.flags,
      message: 'Misja zaliczona! Dobra robota, Navigatorze!',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

### Success Criteria:

#### Automated Verification:
- [x] `npx tsc --noEmit` passes
- [x] `npx vitest run` passes

#### Manual Verification:
- [ ] `GET /api/game/mission` with valid Bearer + active api-answer quest → `200` with `{ mission: { quest_id, title, briefing, hint } }`
- [ ] `GET /api/game/mission` with no active quest → `404`
- [ ] `GET /api/game/mission` with active non-api-answer quest → `404`
- [ ] `POST /api/game/submit` correct answer → `200 { accepted: true, xp: N, flags: [...] }`
- [ ] `POST /api/game/submit` wrong answer → `200 { accepted: false, hint: "..." }`
- [ ] `POST /api/game/submit` already-completed quest → `200 { accepted: true, already_completed: true }`
- [ ] `POST /api/game/submit` invalid token → `401`
- [ ] `POST /api/game/submit` missing fields → `400`
- [ ] Game state in KV/Supabase correctly reflects XP + flags + quest in completed after successful submit

---

## Phase 6: SmartTerminal Integration

### Overview

Add the `/support` command to SmartTerminal. It calls `GET /api/game/token` and displays the token to the player with narrative polish-language framing.

### Changes Required:

#### 1. Add /support to SmartTerminal

**File**: `src/explorers/SmartTerminal.svelte`

In the `handleCommand()` function, add a new case for `/support`:

```typescript
case '/support': {
  pushLine('> Łączenie z Centrum Wsparcia...', 'system');
  try {
    const res = await fetch('/api/game/token');
    if (res.status === 403) {
      pushLine('> Błąd: Brak uprawnień do systemu Navigatora.', 'error');
      break;
    }
    if (!res.ok) {
      pushLine('> Błąd: Nie udało się połączyć z Centrum Wsparcia.', 'error');
      break;
    }
    const { token, generated } = await res.json() as { token: string; generated: boolean };
    if (generated) {
      pushLine('> Token nawigacyjny wygenerowany:', 'system');
      pushLine(`>   ${token}`, 'highlight');
      pushLine('> Zachowaj go w bezpiecznym miejscu — wyświetlany tylko raz w pełnej formie.', 'system');
    } else {
      pushLine('> Token nawigacyjny (aktywny):', 'system');
      pushLine(`>   ${token}`, 'highlight');
    }
  } catch {
    pushLine('> Błąd połączenia z Centrum Wsparcia.', 'error');
  }
  break;
}
```

Register `/support` in the autocomplete suggestions list alongside other commands.

### Success Criteria:

#### Automated Verification:
- [x] `npx tsc --noEmit` passes (Svelte TypeScript check)

#### Manual Verification:
- [ ] Typing `/support` in SmartTerminal shows loading message, then token
- [ ] First call: full token `10X-XXXX-XXXX-XXXX` displayed
- [ ] Second call (same session): masked token `10X-****-****-XXXX`
- [ ] Player without explorers grant sees Polish error message
- [ ] Network error shows Polish fallback error

---

## Testing Strategy

### Unit Tests:

**New file**: `src/server/kvRateLimiter.test.ts`
- Test with mock KV: first N calls `allowed: true`, call N+1 `allowed: false`
- Test `rateLimitHeaders()` returns correct values

**New file**: `src/server/game/apiTokenManager.test.ts`
- Test `generateRawToken()` matches format `10X-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}`
- Test `maskToken("10X-E29B-41D4-A716")` → `"10X-****-****-A716"`
- Test `sha256hex()` produces consistent hex output

### Manual Testing Steps:

1. Log in as player with `explorers` access grant
2. Open SmartTerminal, type `/support` → note full token
3. Type `/support` again → should see masked version
4. From terminal: `curl -H "Authorization: Bearer 10X-..." http://localhost:3000/api/game/mission` → 404 (no quest)
5. In game: activate an `api-answer` quest
6. Repeat mission call → 200 with quest data
7. Submit wrong answer: `curl -X POST -H "Authorization: Bearer 10X-..." -H "Content-Type: application/json" -d '{"quest_id":"q-xxx","answer":"wrong"}' .../api/game/submit` → `{ accepted: false, hint: "..." }`
8. Submit correct answer → `{ accepted: true, xp: N, flags: [...] }`
9. Verify game state updated (XP, flags, quest in completed array) by reloading game

---

## Performance Considerations

- **Token lookup**: SHA-256 + KV get ≈ 5ms (Cloudflare edge)
- **Submit critical path**: 2 rate limit KV ops + 1 token KV lookup + 1 state KV read + 1 state KV write ≈ 50–100ms
- **No blocking Supabase calls in hot path**: state backup is fire-and-forget (consistent with `serverGameStateManager.ts:21-29`)
- **Rate limit key TTL**: `windowSeconds × 2` ensures automatic cleanup with no explicit deletion

---

## Migration Notes

- Run `npx supabase db push` after Phase 3 to apply the migration to local Supabase
- Create `GAME_API_TOKENS` KV namespace in Cloudflare dashboard before deploying Phase 4 to production
- Substitute the real KV namespace ID in `wrangler.toml` before any deployment

---

## References

- Research document: `thoughts/shared/research/2026-03-04-space-explorers-external-api.md`
- Existing GET/PUT state endpoint: `src/pages/api/game/state.ts:38-100`
- State persistence manager: `src/server/game/serverGameStateManager.ts:13-32`
- Quest type definitions: `src/explorers/systems/QuestManager.ts`
- Magic link KV pattern: `src/server/magic-links/remoteMagicLinkManager.ts:22-27`
- Middleware bug location: `src/middlewares/index.ts:15-22`
- Bearer token auth pattern: `src/pages/api/external/membership-refresh.ts:28-35`
- KV game state read/write: `src/server/game/remoteGameStateKV.ts:17-41`
- Supabase initial schema: `supabase/migrations/20260303000000_initial_schema.sql`
