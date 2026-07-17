# Supabase Centralized Access Management — Implementation Plan

## Overview

Replace Airtable as the per-request access check with a Supabase database that serves as the unified source of truth for all three content types: free (game), Airtable-purchased courses, and Circle-gated courses. Additionally unify the split JWT / cookie scheme for `/external` routes, and add Supabase as a durable backup layer for game state.

**Prerequisite**: Both preceding plans (`2026-03-02-free-user-signup-games-section` and `2026-03-02-game-state-user-integration`) are fully implemented. This plan builds on top of them.

---

## Current State Analysis

- **verifyAuth hot path** (`src/server/verifyAuth.ts:41`): calls `getCustomerPurchases(email, AIRTABLE_API_KEY)` on **every protected page request** — 200–500 ms latency
- **No persistent user records**: only email in JWT; no server-side user identity beyond Airtable lookup
- **External auth split** (`src/server/externalAuth.ts`): separate `generateExternalToken` / `verifyExternalToken` producing `external_token_{courseId}` cookies — diverges from main `token` cookie
- **Game state**: KV-only (`GAME_STATE` namespace, `src/server/game/remoteGameStateKV.ts`) — no durable DB backup, no analytics
- **Free users**: already allowed in (Airtable gate removed by previous plan), get empty purchases array

---

## Desired End State

After this plan:

1. Every login upserts a record in `auth.users` (via Supabase Auth Admin API) + `public.profiles`
2. First-time login runs `syncAccessGrants(userId, email)` — pulls from Airtable + Circle → writes to `access_grants` table
3. `verifyAuth()` queries Supabase `access_grants` (5–20 ms) instead of Airtable (200–500 ms); Airtable is fallback during 30-day transition
4. `/external` routes use the same `token` cookie (unified JWT) — `verifyExternalAuth()` reads from Supabase grants + Circle re-sync if stale
5. Game state writes go to KV (fast) + Supabase async (durable) simultaneously

**Verification:**
- Log in as a new email (not in Airtable) → user record appears in Supabase `profiles` table
- Log in as existing Airtable customer → `access_grants` rows appear for their purchased courses
- Navigate to `/courses/opanuj-frontend` → page loads without Airtable call (verify via network tab or logs)
- Log into `/external/10xdevs-1` → unified `token` cookie set (not `external_token_10xdevs-1`)

---

## Key Discoveries

- `astro-env.ts:16–19` — `AIRTABLE_API_KEY` already defined as `secret`; we add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` with the same pattern
- `src/server/verifyAuth.ts:41` — single line `getCustomerPurchases` call to replace; Airtable fallback wraps this replacement
- `src/models/CollectionMappings.ts:36–44` — `PERMISSION_MAPPINGS: CourseSlug → AirtableCourse` must be inverted to build `AIRTABLE_TO_SLUGS: AirtableCourse → CourseSlug[]` in airtableSyncService
- `src/server/externalAuth.ts:10–75` — `ExternalTokenPayload`, `generateExternalToken`, `verifyExternalToken` all removable; `verifyExternalAuth` gets rewritten
- `src/pages/external/[courseId]/verify.astro:37–47` — cookie write line swapped from `generateExternalToken` + `external_token_{courseId}` to `generateToken` + `token`
- `src/server/game/serverGameStateManager.ts` — already dispatches to KV; extend `saveGameState` to also write to Supabase async
- `src/server/circle/membershipResolver.ts:19` — `resolveMembership(email, courseId, env)` is the Circle API entry point used by `circleSyncService`
- `wrangler.toml` — only has `kv_namespaces`; add `[vars]` for `SUPABASE_URL` and a Cloudflare secret for `SUPABASE_SERVICE_KEY`

---

## What We Are NOT Doing

- Not replacing KV for lesson cache (`PLATFORM_LESSON_CACHE`) or magic links (`MAGIC_LINKS`)
- Not replacing KV for `CIRCLE_MEMBERS` (stays as L1 cache for Circle API — Supabase is the durable record)
- Not enabling Supabase Row-Level Security (all queries go through service key server-side)
- Not using Supabase Auth email flows (our own magic link + OAuth handles auth; Supabase is just the user registry)
- Not adding Airtable webhooks (periodic re-sync on login with 7-day threshold is sufficient)
- Not adding a Supabase Edge Function or DB triggers — all business logic in TypeScript services
- Not removing Airtable fallback immediately (kept for 30-day transition safety)

---

## Critical Implementation Details

### Schema: `course_slug` uses `CourseSlug` values (not `AirtableCourse`)

`access_grants.course_slug` stores URL-friendly values matching the `CourseSlug` type: `'opanuj-frontend'`, `'cursor-ai'`, `'10xdevs-1'`, etc. This unifies Airtable and Circle access under a single key space.

**Consequence**: `airtableSyncService` must expand each `AirtableCourse` into multiple `CourseSlug` rows:

```typescript
const AIRTABLE_TO_SLUGS: Record<string, string[]> = {
  OPANUJ_FRONTEND:   ['opanuj-frontend', 'opanuj-frontend-live'],
  CURSOR_AI:         ['cursor-ai'],
  OPANUJ_TYPESCRIPT: ['opanuj-typescript-core', 'opanuj-typescript-react'],
  '10XDEVS_1':       ['10xdevs-1'],
  '10XDEVS_2':       ['10xdevs-2'],
  '10XDEVS_2_EN':    ['10xdevs-2-en'],
};
```

**verifyAuth backward compat**: convert Supabase `course_slug` back to `AirtableCourse[]` for the `purchases` field on `AuthResult`:

```typescript
const grantSlugs = new Set(grants.map(g => g.course_slug));
const purchases = Object.entries(PERMISSION_MAPPINGS)
  .filter(([slug]) => grantSlugs.has(slug))
  .map(([, perm]) => perm);
const uniquePurchases = [...new Set(purchases)];
```

### Two Supabase queries per verifyAuth request (acceptable)

1. `profiles.select('id').eq('email', email).single()` → get `userId`
2. `access_grants.select('course_slug').eq('user_id', userId).or(...)` → get grants

Total ~10–40 ms — still far better than 200–500 ms Airtable. Can be optimized later with a JOIN view if needed.

### Airtable fallback (30-day transition)

During the transition, `verifyAuth` wraps the Supabase query in try/catch; on Supabase failure it falls back to `getCustomerPurchases()`. This makes the migration zero-downtime with no data loss risk.

### JWT backward compat for /external

Old `external_token_{courseId}` cookies contain `{ email, courseId, spaceId, exp, nbf }`. `verifyToken()` from `auth.ts` (HS256, same secret) can verify them — extra claims are ignored when reading only `email`. The fallback reads old cookie for up to 24 h after deploy, then it expires naturally.

### Circle re-sync threshold

`circleSyncService.syncForCourse()` is called on every `/external` login. Subsequent `verifyExternalAuth()` calls re-sync only if `synced_at` is older than `EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS` (default 24×60 min = 24 days). This mirrors the current KV freshness logic.

### Game state: write-through, not blocking

`serverGameStateManager.saveGameState()` will fire both KV write and Supabase write in `Promise.allSettled()` — KV failure does not block, Supabase failure does not block KV. The 5-second debounce stays in `PhaserGame.svelte` unchanged.

---

## Phase 1: Infrastructure Setup

### Overview

Install Supabase SDK, declare env vars, configure wrangler. This phase has no runtime behavior change — it's purely additive.

### Changes Required

#### 1. Install Supabase JS SDK

```bash
npm install @supabase/supabase-js --workspace=projects/edu-platform
```

#### 2. `astro-env.ts` — add Supabase secrets

**File**: `astro-env.ts`

Add after `AIRTABLE_API_KEY` block (line 19):

```typescript
  SUPABASE_URL: envField.string({
    context: 'server',
    access: 'secret',
  }),
  SUPABASE_SERVICE_KEY: envField.string({
    context: 'server',
    access: 'secret',
  }),
```

#### 3. `wrangler.toml` — add Supabase URL as a var

**File**: `wrangler.toml`

Add after the `kv_namespaces` block:

```toml
[vars]
SUPABASE_URL = "https://<your-project-ref>.supabase.co"
```

`SUPABASE_SERVICE_KEY` is a secret and must **not** go in wrangler.toml. Add it via:
- **Local dev**: `.dev.vars` file: `SUPABASE_SERVICE_KEY=<key>`
- **Production**: Cloudflare Pages dashboard → Settings → Environment Variables → Add secret

#### 4. Create Supabase project (manual step)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy Project URL (`https://<ref>.supabase.co`) → use in wrangler.toml `[vars]`
3. Copy service role key (Settings → API → service_role) → add as Cloudflare secret

### Success Criteria

#### Automated Verification
- [x] `npm run build --workspace=projects/edu-platform` passes with new env fields (Astro validates env schema at build time)
- [x] TypeScript passes: `npx tsc --noEmit` in edu-platform

#### Manual Verification
- [ ] Supabase project dashboard is accessible
- [ ] `.dev.vars` contains `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

---

## Phase 2: Database Schema

### Overview

Create the three tables in Supabase. All migrations run via the Supabase SQL editor (no migration tool needed at this stage).

### Changes Required

#### SQL Migration to run in Supabase SQL Editor

```sql
-- Public profiles — thin layer on top of auth.users
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  created_at timestamptz default now(),
  last_login timestamptz
);

-- Unified access grants for all content types
create table public.access_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,  -- matches CourseSlug values
  source      text not null check (source in ('free', 'airtable', 'circle', 'manual')),
  granted_at  timestamptz default now(),
  expires_at  timestamptz,    -- null = permanent
  synced_at   timestamptz,    -- last re-verified from source
  source_meta jsonb,          -- { airtableRecordId } or { circleSpaceId, memberId }
  unique(user_id, course_slug)
);

-- Durable game state backup (KV remains primary write path)
create table public.game_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  version    int  default 1,
  updated_at timestamptz default now()
);

create index on public.access_grants(user_id);
create index on public.access_grants(course_slug);
create index on public.access_grants(source);
create index on public.profiles(email);
```

### Success Criteria

#### Manual Verification
- [ ] All three tables appear in Supabase dashboard → Table Editor
- [ ] Constraints visible: `unique(user_id, course_slug)` on `access_grants`, `check(source in (...))` on source column
- [ ] Can manually insert a test row via dashboard and delete it

---

## Phase 3: Supabase Service Layer

### Overview

Create `src/server/supabase/` with six TypeScript modules. No existing file is changed in this phase.

### Changes Required

#### 1. `src/server/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin(env: { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string }) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
}
```

#### 2. `src/server/supabase/userService.ts`

```typescript
import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function upsertUser(email: string, env: SupabaseEnv): Promise<string> {
  const supabase = getSupabaseAdmin(env);

  const { data: existing } = await supabase.auth.admin.getUserByEmail(email);
  let userId: string;

  if (existing?.user) {
    userId = existing.user.id;
  } else {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { source: 'platform' },
    });
    if (error || !created.user) {
      throw new Error(`Failed to create Supabase user for ${email}: ${error?.message}`);
    }
    userId = created.user.id;
  }

  await supabase.from('profiles').upsert(
    { id: userId, email, last_login: new Date().toISOString() },
    { onConflict: 'id' }
  );

  return userId;
}

export async function getUserIdByEmail(
  email: string,
  env: SupabaseEnv
): Promise<string | null> {
  const supabase = getSupabaseAdmin(env);
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
  return data?.id ?? null;
}
```

#### 3. `src/server/supabase/accessService.ts`

```typescript
import { getSupabaseAdmin } from './client';
import { PERMISSION_MAPPINGS, type CourseSlug } from '@/models/CollectionMappings';
import type { AirtableCourse } from '@/server/airtable/airtable-course';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function getGrants(userId: string, env: SupabaseEnv): Promise<string[]> {
  const supabase = getSupabaseAdmin(env);
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('access_grants')
    .select('course_slug')
    .eq('user_id', userId)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  if (error) throw new Error(`getGrants failed: ${error.message}`);
  return (data ?? []).map((r) => r.course_slug);
}

export async function hasGrant(
  userId: string,
  courseSlug: string,
  env: SupabaseEnv
): Promise<boolean> {
  const grants = await getGrants(userId, env);
  return grants.includes(courseSlug);
}

export async function upsertGrant(
  userId: string,
  courseSlug: string,
  source: 'free' | 'airtable' | 'circle' | 'manual',
  env: SupabaseEnv,
  sourceMeta?: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  await supabase.from('access_grants').upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      source,
      synced_at: new Date().toISOString(),
      source_meta: sourceMeta ?? null,
    },
    { onConflict: 'user_id,course_slug' }
  );
}

/**
 * Convert Supabase course_slug grants back to AirtableCourse[] for backward compat
 * with AuthResult.purchases field used by CourseList.
 */
export function grantsToAirtableCourses(grantSlugs: string[]): AirtableCourse[] {
  const slugSet = new Set(grantSlugs);
  const courses = Object.entries(PERMISSION_MAPPINGS)
    .filter(([slug]) => slugSet.has(slug))
    .map(([, perm]) => perm);
  return [...new Set(courses)] as AirtableCourse[];
}
```

#### 4. `src/server/supabase/airtableSyncService.ts`

```typescript
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { upsertGrant } from './accessService';
import { ADMIN_EMAILS } from '@/server/admins';

type SyncEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  AIRTABLE_API_KEY: string;
};

// Expand AirtableCourse enum values to CourseSlug values in DB
const AIRTABLE_TO_SLUGS: Record<string, string[]> = {
  OPANUJ_FRONTEND:   ['opanuj-frontend', 'opanuj-frontend-live'],
  CURSOR_AI:         ['cursor-ai'],
  OPANUJ_TYPESCRIPT: ['opanuj-typescript-core', 'opanuj-typescript-react'],
  '10XDEVS_1':       ['10xdevs-1'],
  '10XDEVS_2':       ['10xdevs-2'],
  '10XDEVS_2_EN':    ['10xdevs-2-en'],
};

// All courses for admin emails
const ADMIN_COURSES = Object.values(AIRTABLE_TO_SLUGS).flat();

export async function syncFromAirtable(
  userId: string,
  email: string,
  env: SyncEnv
): Promise<void> {
  try {
    let slugsToGrant: string[];

    if (ADMIN_EMAILS.includes(email)) {
      slugsToGrant = ADMIN_COURSES;
    } else {
      const { purchasedCourses } = await getCustomerPurchases(email, env.AIRTABLE_API_KEY);
      slugsToGrant = purchasedCourses.flatMap((c) => AIRTABLE_TO_SLUGS[c] ?? []);
    }

    await Promise.all(
      slugsToGrant.map((slug) =>
        upsertGrant(userId, slug, 'airtable', env, { syncedFromAirtable: true })
      )
    );

    console.info('[airtableSyncService] synced', { email, count: slugsToGrant.length });
  } catch (error) {
    // Log but do not throw — sync failure should not block login
    console.error('[airtableSyncService] sync failed:', error);
  }
}
```

#### 5. `src/server/supabase/circleSyncService.ts`

```typescript
import { resolveMembership } from '@/server/circle/membershipResolver';
import { getSpaceIdsForExternalAuth } from '@/server/circle/externalAuthConfig';
import { upsertGrant } from './accessService';

type SyncEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  [key: string]: unknown; // ExternalAuthEnv fields (V1 tokens, etc.)
};

// All Circle-gated courseIds that can produce access_grants
const CIRCLE_COURSE_IDS = ['opanuj-frontend', '10xdevs-1', '10xdevs-2'];

export async function syncForCourse(
  userId: string,
  email: string,
  courseId: string,
  env: SyncEnv
): Promise<void> {
  try {
    const decision = await resolveMembership(email, courseId, env as any, {});
    if (decision.status === 'active') {
      await upsertGrant(userId, courseId, 'circle', env, {
        circleSource: decision.source,
      });
      console.info('[circleSyncService] synced', { email, courseId });
    }
  } catch (error) {
    console.error('[circleSyncService] sync failed:', { courseId, error });
  }
}

/**
 * Sync all known Circle courses for a user logging in via main platform.
 * Called on main login (magic link / OAuth) — checks each Circle course.
 * Expensive first time; subsequent calls are fast via KV cache.
 */
export async function syncAllCircleCourses(
  userId: string,
  email: string,
  env: SyncEnv
): Promise<void> {
  await Promise.allSettled(
    CIRCLE_COURSE_IDS.map((courseId) => syncForCourse(userId, email, courseId, env))
  );
}
```

#### 6. `src/server/supabase/gameSyncService.ts`

```typescript
import { getSupabaseAdmin } from './client';
import type { GameState } from '@/explorers/state/types';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function saveGameState(
  userId: string,
  state: GameState,
  env: SupabaseEnv
): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  await supabase.from('game_state').upsert(
    {
      user_id: userId,
      state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

export async function loadGameState(
  userId: string,
  env: SupabaseEnv
): Promise<GameState | null> {
  const supabase = getSupabaseAdmin(env);
  const { data } = await supabase
    .from('game_state')
    .select('state')
    .eq('user_id', userId)
    .single();
  return (data?.state as GameState) ?? null;
}
```

### Success Criteria

#### Automated Verification
- [x] TypeScript compiles: `npx tsc --noEmit` passes with no errors in new files
- [x] No circular imports (services import from each other only through client.ts)

#### Manual Verification
- [ ] Can call `upsertUser('test@example.com', env)` from a test endpoint and see row in Supabase dashboard

---

## Phase 4: Auth Path Integration

### Overview

Add `upsertUser` + `syncAccessGrants` after token generation in all four auth entry points. This is the "populate Supabase on first login" step. Free grant for `explorers` is always inserted.

### Changes Required

#### 1. `src/pages/verify.astro` — after JWT set

Add after line 31 (after `Astro.cookies.set`):

```typescript
import { upsertUser } from '@/server/supabase/userService';
import { syncFromAirtable } from '@/server/supabase/airtableSyncService';
import { syncAllCircleCourses } from '@/server/supabase/circleSyncService';
import { upsertGrant } from '@/server/supabase/accessService';

// Supabase sync (non-blocking — do not await to keep login fast)
const syncEnv = env; // Astro.locals.runtime.env
upsertUser(email as string, syncEnv)
  .then(async (userId) => {
    await upsertGrant(userId, 'explorers', 'free', syncEnv);
    await Promise.allSettled([
      syncFromAirtable(userId, email as string, syncEnv),
      syncAllCircleCourses(userId, email as string, syncEnv),
    ]);
  })
  .catch((err) => console.error('[verify] Supabase sync failed:', err));
```

> **Note**: The sync is intentionally fire-and-forget (`upsertUser().then(...)` without `await`) to keep the login redirect instant. The first page load after login hits Airtable (fallback) while sync completes in background.

#### 2. `src/pages/api/auth/github/callback.ts` — after cookie set (line 130)

Same pattern as verify.astro:

```typescript
import { upsertUser } from '@/server/supabase/userService';
import { syncFromAirtable } from '@/server/supabase/airtableSyncService';
import { syncAllCircleCourses } from '@/server/supabase/circleSyncService';
import { upsertGrant } from '@/server/supabase/accessService';

// After cookies.set('token', ...) and before return redirect('/courses'):
const syncEnv = locals.runtime.env;
upsertUser(primaryEmail, syncEnv)
  .then(async (userId) => {
    await upsertGrant(userId, 'explorers', 'free', syncEnv);
    await Promise.allSettled([
      syncFromAirtable(userId, primaryEmail, syncEnv),
      syncAllCircleCourses(userId, primaryEmail, syncEnv),
    ]);
  })
  .catch((err) => console.error('[github/callback] Supabase sync failed:', err));
```

#### 3. `src/pages/api/auth/google/callback.ts` — same pattern after cookie set (line 96)

Identical to GitHub callback, using `userInfo.email`.

#### 4. `src/pages/external/[courseId]/verify.astro` — JWT unification + Supabase sync

**Remove** (lines 5, 37, 40–47):
```typescript
// REMOVE:
import { generateExternalToken } from '@/server/externalAuth';
const sessionToken = await generateExternalToken(email, courseId, config.spaceId, env.JWT_SECRET);
const cookieName = `external_token_${courseId}`;
Astro.cookies.set(cookieName, sessionToken, { ... });
```

**Replace with:**
```typescript
// ADD:
import { generateToken } from '@/server/auth';
import { upsertUser } from '@/server/supabase/userService';
import { syncForCourse } from '@/server/supabase/circleSyncService';
import { upsertGrant } from '@/server/supabase/accessService';

const jwtToken = await generateToken(email, env.JWT_SECRET);
Astro.cookies.set('token', jwtToken, {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24,
});

// Supabase sync (fire-and-forget)
upsertUser(email, env)
  .then(async (userId) => {
    await upsertGrant(userId, 'explorers', 'free', env);
    await syncForCourse(userId, email, courseId, env);
  })
  .catch((err) => console.error('[external/verify] Supabase sync failed:', err));
```

### Success Criteria

#### Automated Verification
- [x] TypeScript compiles with no errors
- [x] `npm run build` succeeds

#### Manual Verification
- [ ] Log in via magic link → user row appears in Supabase `profiles` table
- [ ] Log in as Airtable customer → `access_grants` rows appear with `source='airtable'`
- [ ] Log in as new email (no Airtable record) → `profiles` row appears, `access_grants` has only `explorers` free grant
- [ ] Log in via GitHub → same behavior as magic link

**Implementation Note**: Pause here for manual verification before proceeding to Phase 5, as Phase 5 switches the verifyAuth hot path.

---

## Phase 5: Replace verifyAuth Hot Path

### Overview

Replace `getCustomerPurchases()` in `verifyAuth.ts` with a Supabase query. Keep Airtable as a fallback for 30-day transition safety.

### Changes Required

#### `src/server/verifyAuth.ts` — replace Airtable call

**File**: `src/server/verifyAuth.ts`
**Changes**: Replace lines 3, 5, 41–48 with Supabase query + Airtable fallback

```typescript
// BEFORE (lines 1-51):
import { type AuthResult } from '@/models/AuthResult';
import { PERMISSION_MAPPINGS, type CourseSlug } from '@/models/CollectionMappings';
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { generateToken, verifyToken } from '@/server/auth';
import { JWT_SECRET, AIRTABLE_API_KEY } from 'astro:env/server';
import { AstroGlobal } from 'astro';
// ...
const customerPurchases = await getCustomerPurchases(payload.email, AIRTABLE_API_KEY);
if (courseSlug) {
  const permission = PERMISSION_MAPPINGS[courseSlug];
  if (!customerPurchases.purchasedCourses.includes(permission)) {
    return { isAuthenticated: false };
  }
}
return { isAuthenticated: true, email: payload.email, purchases: customerPurchases.purchasedCourses };
```

```typescript
// AFTER:
import { type AuthResult } from '@/models/AuthResult';
import { PERMISSION_MAPPINGS, type CourseSlug } from '@/models/CollectionMappings';
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { generateToken, verifyToken } from '@/server/auth';
import { JWT_SECRET, AIRTABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } from 'astro:env/server';
import { getUserIdByEmail } from '@/server/supabase/userService';
import { getGrants, grantsToAirtableCourses } from '@/server/supabase/accessService';
import { AstroGlobal } from 'astro';

// (replace the hot-path section after payload validation:)

let purchasedCourses;
try {
  const userId = await getUserIdByEmail(payload.email, { SUPABASE_URL, SUPABASE_SERVICE_KEY });
  if (userId) {
    const grantSlugs = await getGrants(userId, { SUPABASE_URL, SUPABASE_SERVICE_KEY });
    purchasedCourses = grantsToAirtableCourses(grantSlugs);
  } else {
    // User not yet in Supabase (e.g. sync still in flight) — fall back to Airtable
    const fallback = await getCustomerPurchases(payload.email, AIRTABLE_API_KEY);
    purchasedCourses = fallback.purchasedCourses;
  }
} catch (supabaseError) {
  // Supabase unreachable — fall back to Airtable for zero-downtime migration
  console.error('[verifyAuth] Supabase query failed, falling back to Airtable:', supabaseError);
  const fallback = await getCustomerPurchases(payload.email, AIRTABLE_API_KEY);
  purchasedCourses = fallback.purchasedCourses;
}

if (courseSlug) {
  const permission = PERMISSION_MAPPINGS[courseSlug];
  if (!purchasedCourses.includes(permission)) {
    return { isAuthenticated: false };
  }
}

return { isAuthenticated: true, email: payload.email, purchases: purchasedCourses };
```

### Success Criteria

#### Automated Verification
- [x] TypeScript compiles with no errors
- [x] `npm run build` succeeds

#### Manual Verification
- [ ] Navigate to a protected course page as a logged-in Airtable customer → access granted, no 500 error
- [ ] Navigate to a protected course as a free user → redirected (as expected, no grant)
- [ ] Navigate to courses as a free user → `/courses` loads showing locked tiles (not redirected)
- [ ] Check server logs: no `[verifyAuth] Supabase query failed` errors for normal logins
- [ ] Response time improvement visible in browser DevTools Network tab (target: < 100ms vs 200–500ms before)

**Implementation Note**: Pause here to verify latency improvement and that no users are blocked erroneously before proceeding.

---

## Phase 6: JWT Unification for /external Routes

### Overview

Update `verifyExternalAuth()` to accept the unified `token` cookie, with backward-compatible fallback for old `external_token_{courseId}` cookies (valid for 24 h post-deploy). Replace the Circle-API-on-every-request pattern with Supabase access_grants + stale re-sync.

### Changes Required

#### `src/server/externalAuth.ts`

**Remove entirely:**
- `ExternalTokenPayload` interface (lines 10–16)
- `generateExternalToken()` function (lines 36–50)
- `verifyExternalToken()` function (lines 59–75)

**Keep:**
- `ExternalAuthResult` interface (lines 21–25) — `courseId` field stays, comes from URL param

**Rewrite `verifyExternalAuth()`** (lines 85–127):

```typescript
import { verifyToken } from '@/server/auth';
import { resolveMembership } from './circle/membershipResolver';
import { getUserIdByEmail } from '@/server/supabase/userService';
import { hasGrant, upsertGrant } from '@/server/supabase/accessService';
import type { ExternalAuthEnv } from './circle/externalAuthConfig';

export async function verifyExternalAuth(
  cookies: { get: (name: string) => { value: string } | undefined },
  courseId: string,
  env: ExternalAuthEnv & { JWT_SECRET: string; SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string }
): Promise<ExternalAuthResult> {
  // 1. Try unified token cookie first
  let token = cookies.get('token')?.value;
  let isLegacyToken = false;

  // 2. Backward compat: fall back to old course-scoped cookie (expires after 24h naturally)
  if (!token) {
    token = cookies.get(`external_token_${courseId}`)?.value;
    isLegacyToken = !!token;
  }

  if (!token) return { isAuthenticated: false };

  // 3. Verify with unified verifyToken() — works for both old and new tokens
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload?.email) return { isAuthenticated: false };

  // 4. Legacy only: validate old token's courseId claim matches URL
  if (isLegacyToken && (payload as any).courseId !== courseId) {
    return { isAuthenticated: false };
  }

  const email = payload.email;
  const supabaseEnv = { SUPABASE_URL: env.SUPABASE_URL, SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY };

  // 5. Check Supabase access_grants first (fast path)
  try {
    const userId = await getUserIdByEmail(email, supabaseEnv);
    if (userId) {
      const granted = await hasGrant(userId, courseId, supabaseEnv);
      if (granted) {
        return { isAuthenticated: true, email, courseId };
      }
    }
  } catch (supabaseError) {
    console.error('[verifyExternalAuth] Supabase check failed, falling through to Circle:', supabaseError);
  }

  // 6. Not in Supabase (or stale): re-check Circle API (mirrors current behavior)
  const decision = await resolveMembership(email, courseId, env, {
    freshnessHours: (env as any).EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS,
  });

  if (decision.status !== 'active') {
    if (decision.status === 'error') {
      console.error('[verifyExternalAuth] Membership resolution failed:', {
        courseId, email, reason: decision.reason,
      });
    }
    return { isAuthenticated: false };
  }

  // 7. Sync Circle result to Supabase (async, non-blocking)
  try {
    const userId = await getUserIdByEmail(email, supabaseEnv);
    if (userId) {
      await upsertGrant(userId, courseId, 'circle', supabaseEnv, {
        circleSource: decision.source,
      });
    }
  } catch (syncError) {
    console.error('[verifyExternalAuth] Failed to sync Circle grant to Supabase:', syncError);
  }

  return { isAuthenticated: true, email, courseId };
}
```

### Success Criteria

#### Automated Verification
- [x] TypeScript compiles with no errors — especially: no references to removed `generateExternalToken` / `verifyExternalToken` anywhere

#### Manual Verification
- [ ] Log into `/external/10xdevs-1` → browser shows `token` cookie (not `external_token_10xdevs-1`)
- [ ] After logging in: navigate to a lesson page → `verifyExternalAuth` accepts unified cookie
- [ ] User with old `external_token_{courseId}` cookie still accesses lesson (within 24h of deploy)
- [ ] Non-member email is rejected at login (403 from `/api/external/auth`)
- [ ] `access_grants` row with `source='circle'` appears in Supabase after successful external login

**Implementation Note**: Pause here for manual verification of /external login before proceeding.

---

## Phase 7: Game State Supabase Durability

### Overview

Extend `serverGameStateManager.ts` to write to both KV and Supabase simultaneously. KV remains the primary read path (fast edge); Supabase is the durable backup and analytics layer.

### Changes Required

#### `src/server/game/serverGameStateManager.ts`

```typescript
import type { GameState } from '@/explorers/state/types';
import * as local from './localGameStateManager';
import * as remote from './remoteGameStateKV';
import * as supabaseGame from '@/server/supabase/gameSyncService';
import { getUserIdByEmail } from '@/server/supabase/userService';

export async function loadGameState(email: string, env: any): Promise<GameState | null> {
  if (env.ENV === 'PROD') {
    return remote.getGameState(email, env);
  }
  return local.getGameState(email);
}

export async function saveGameState(email: string, state: GameState, env: any): Promise<void> {
  // Write to KV first (primary, fast)
  if (env.ENV === 'PROD') {
    await remote.setGameState(email, state, env);
  } else {
    await local.setGameState(email, state);
  }

  // Write to Supabase async (durable backup, non-blocking)
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    getUserIdByEmail(email, env)
      .then((userId) => {
        if (userId) {
          return supabaseGame.saveGameState(userId, state, env);
        }
      })
      .catch((err) => console.error('[serverGameStateManager] Supabase game sync failed:', err));
  }
}
```

### Success Criteria

#### Automated Verification
- [x] TypeScript compiles with no errors

#### Manual Verification
- [ ] Play the game for 30+ seconds (trigger debounced save) → row appears in Supabase `game_state` table
- [ ] Verify KV still works: game state loads on next page load
- [ ] Supabase failure (e.g. bad key in test) does not break game save to KV (errors are logged, not thrown)

---

## Testing Strategy

### Unit Tests

- `accessService.grantsToAirtableCourses()` — test all AirtableCourse combinations
- `airtableSyncService.AIRTABLE_TO_SLUGS` mapping — verify each AirtableCourse expands to correct slugs
- `verifyExternalAuth` — test: unified token path, legacy token path, legacy token with wrong courseId

### Integration Tests

No new Playwright tests needed; existing auth flows cover the behavior. Verify manually per phase.

### Manual Testing Checklist

1. **New free user**: sign up with unknown email → `profiles` row exists, `access_grants` has only `explorers`
2. **Airtable customer (OFE)**: log in → `access_grants` has `opanuj-frontend` + `opanuj-frontend-live`; lesson page loads
3. **Admin email**: log in → all course grants present in Supabase
4. **Circle member**: log into `/external/10xdevs-1` → `access_grants` has `10xdevs-1` with `source='circle'`
5. **Latency**: `/courses/opanuj-frontend` TTFB before vs. after (target: < 100 ms)
6. **Game state**: play game → both KV and Supabase `game_state` table updated

---

## Migration Notes

### Existing Users

Existing users (already in Airtable, possibly with active `GAME_STATE` KV) are handled transparently:

1. **First login after deploy**: `upsertUser()` creates their `auth.users` record → `syncFromAirtable()` populates `access_grants`. The login-page redirect fires immediately (sync is fire-and-forget).
2. **Subsequent requests**: Supabase query returns their grants. Airtable fallback only triggers if Supabase is unreachable.
3. **Game state**: existing KV game state continues to load via `remote.getGameState()`. Next game save writes to both KV and Supabase (if userId found). Old KV data is not migrated retrospectively — it will appear in Supabase after first save.

### Airtable Fallback Removal (after 30 days)

After ~30 days of operation (all active users will have logged in and been synced), remove:
- The try/catch Airtable fallback in `verifyAuth.ts`
- The `getCustomerPurchases` import and `AIRTABLE_API_KEY` import from `verifyAuth.ts`

Airtable remains available for `airtableSyncService` background syncs.

### Legacy /external Cookie Removal (after 24 hours)

The fallback `cookies.get(`external_token_${courseId}`)` in `verifyExternalAuth()` can be removed after 24 hours of deploy time, as all in-flight sessions will have expired. Leave it for a week as safety margin, then remove in a follow-up cleanup commit.

---

## References

- Research document: `thoughts/shared/research/2026-03-03-supabase-centralized-access-management.md`
- Supersedes: `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md`
- Builds on: `thoughts/shared/plans/2026-03-02-game-state-user-integration.md`
- `src/server/verifyAuth.ts:41` — Airtable hot path replaced in Phase 5
- `src/server/externalAuth.ts:85–127` — verifyExternalAuth rewritten in Phase 6
- `src/server/game/serverGameStateManager.ts` — extended in Phase 7
- `astro-env.ts` — new env fields in Phase 1
- `wrangler.toml` — new vars section in Phase 1
