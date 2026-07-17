---
date: 2026-03-03T00:00:00+01:00
researcher: claude-sonnet-4-6
git_commit: 9e9d54bc9fb659acba097c2af3dca7c26f1d63e3
branch: master
repository: przeprogramowani-sites
topic: "Centralized course and content access management via Supabase DB"
tags: [research, supabase, supabase-auth, authentication, airtable, circle, cloudflare-kv, access-control, course-access, external-routes]
status: complete
last_updated: 2026-03-03
last_updated_by: claude-sonnet-4-6
last_updated_note: "Added Supabase Auth schema clarification, /external route access model, business logic placement constraints"
---

# Research: Centralized Course & Content Access Management via Supabase

**Date**: 2026-03-03
**Researcher**: claude-sonnet-4-6
**Git Commit**: `9e9d54bc9fb659acba097c2af3dca7c26f1d63e3`
**Branch**: master
**Repository**: przeprogramowani-sites

---

## Research Question

> Centralize course and content access management via dedicated Supabase DB. There are at least three types of content — free content / extensions for all (like Space Explorers game), courses from Airtable, courses from Circle. We need to design solution for both existing and new users, and also to take care of all existing storages like Cloudflare KV Cache. Sign-up or sign-in should probably auto-populate the new database where we store access (design better flow for first-time access within this new model).

---

## Summary

The platform currently uses **Airtable as the sole source of truth** for course purchase verification, with no persistent user records on the platform itself. Every auth request triggers an Airtable lookup. Three separate KV namespaces handle ephemeral data (magic links, lesson cache, Circle membership, game state). Introducing Supabase as a centralized access layer would decouple the purchase data from the auth hot path, enable free-user sign-up, unify all access types (free / Airtable-purchased / Circle-gated), and provide a foundation for richer user management.

Key constraint: the existing KV caches should be **kept in place** (lesson content, magic links) — Supabase does not replace Cloudflare edge caching, only the **access grant logic**.

---

## Detailed Findings

### 1. Current Auth Architecture

- **Primary identifier**: email address (never a numeric ID)
- **JWT payload**: `{ email, exp, nbf }` — signed with HS256, stored in `HttpOnly` cookie, 24h TTL
- **Token refresh**: automatic when < 1 hour remaining (`src/server/verifyAuth.ts:22-39`)
- **Three auth paths** all converge on `generateToken(email)`:
  - Magic Link: `src/pages/api/auth.ts` → `src/pages/verify.astro`
  - GitHub OAuth: `src/pages/api/auth/github/callback.ts`
  - Google OAuth: `src/pages/api/auth/google/callback.ts`
- After login all three redirect to `/courses`

### 2. Current Purchase Verification (Airtable)

Every protected page calls `verifyAuth(Astro, courseSlug?)` which:
1. Validates JWT from cookie (`src/server/verifyAuth.ts:11-20`)
2. Calls `getCustomerPurchases(email, AIRTABLE_API_KEY)` **on every request**
3. Checks `PERMISSION_MAPPINGS[courseSlug]` against returned courses

**Airtable data model** (`src/server/airtable/airtable-api.ts`):
- Base: `appBN64leXIbQ1gDe`, Table: `Klienci`
- Query: `FIND(email, {Login email})` → `Posiadane produkty[]`
- Returns one of 6 course IDs: `OPANUJ_FRONTEND | CURSOR_AI | OPANUJ_TYPESCRIPT | 10XDEVS_1 | 10XDEVS_2 | 10XDEVS_2_EN`

**Active enforcement** (3 of 6 courses have auth guards):
| CourseSlug | AirtableCourse | Status |
|---|---|---|
| `opanuj-frontend` + `opanuj-frontend-live` | `OPANUJ_FRONTEND` | Enforced |
| `cursor-ai` | `CURSOR_AI` | Enforced |
| `opanuj-typescript-core` + `opanuj-typescript-react` | `OPANUJ_TYPESCRIPT` | Enforced |
| `10xdevs-1/2/2-en` | `10XDEVS_*` | Guid-only (no course-slug auth) |

### 3. Content Types & Access Model

| Content Type | Current Gate | Example |
|---|---|---|
| **Free** | None (or JWT-only for state) | `/explorers` game page |
| **Airtable-purchased** | Airtable lookup per request | Opanuj Frontend, Cursor AI, TypeScript |
| **Circle-gated** | Circle API + `CIRCLE_MEMBERS` KV cache | 10xDevs 1, 2 (only via `/shared/{guid}`) |

`src/components/CourseList.astro` renders free supplements (game) in a separate "Dodatki do szkoleń" section with no purchase check. Paid courses show a lock icon + `isAvailable` flag from `customerPurchases.includes('COURSE_ID')`.

### 4. Cloudflare KV Namespaces (current)

| Binding | ID | Data | TTL | Keep with Supabase? |
|---|---|---|---|---|
| `MAGIC_LINKS` | `a67fe4e9...` | `{email, expiresAt}` keyed by JWT token | 15 min | **Yes** — ephemeral, edge-native |
| `PLATFORM_LESSON_CACHE` | `b14217e3...` | Lesson HTML + headings, course structure | 24h / 30d | **Yes** — performance cache |
| `CIRCLE_MEMBERS` | `1f0379f2...` | Membership status `{email, spaceId, status}` | 60-90 days | **Migrate** → Supabase `access_grants` |
| `GAME_STATE` | `20d16620...` | Full `GameState` JSON keyed by email | 1 year | **Migrate optional** → Supabase `game_state` |

### 5. Existing Plans Context

Two plans were written on 2026-03-02 and are **partially implemented**:

- `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md`:
  - Remove Airtable gate from auth (allow any email)
  - Show all courses locked with "Kup kurs" CTA for free users
  - Add Games section in CourseList
  - Decision: **no new DB** (just remove Airtable check, empty purchases array for unknown emails)

- `thoughts/shared/plans/2026-03-02-game-state-user-integration.md`:
  - Cross-device game state via `GAME_STATE` KV namespace
  - Decision: **KV not DB** (GAME_STATE namespace already provisioned)

Both plans chose KV over a database. The Supabase proposal supersedes this — it provides a better long-term foundation, especially for access grants and user records.

---

## Proposed Architecture: Supabase as Access Layer

### Design Principles

1. **Supabase = access source of truth** for all three content types
2. **Airtable remains a sync source** (not removed, just queried less frequently)
3. **KV stays for performance** (lesson cache, magic links) — not replaced
4. **Email stays primary identifier** (no breaking change to JWT)
5. **Sync on first login** — existing customers auto-populated from Airtable on first sign-in after migration
6. **Free users get explicit DB record** with no course grants initially

---

### Supabase Schema

```sql
-- Core user registry
create table users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  created_at  timestamptz default now(),
  last_login  timestamptz,
  metadata    jsonb  -- future: display name, avatar, etc.
);

-- Unified access grants (all content types)
create table access_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade not null,
  course_slug text not null,  -- matches CourseSlug enum
  source      text not null,  -- 'free' | 'airtable' | 'circle' | 'manual'
  granted_at  timestamptz default now(),
  expires_at  timestamptz,    -- null = permanent
  synced_at   timestamptz,    -- last time re-verified from source
  source_meta jsonb,          -- airtable record id, circle member id, etc.
  unique(user_id, course_slug)
);

-- Game state (optional, replaces/mirrors GAME_STATE KV)
create table game_state (
  user_id    uuid primary key references users(id) on delete cascade,
  state      jsonb not null,
  version    int  default 1,
  updated_at timestamptz default now()
);

-- Indexes
create index on access_grants(user_id);
create index on access_grants(course_slug);
create index on access_grants(source);
```

---

### Sign-in / Sign-up Flow (First-Time Access)

```
User authenticates (magic link / GitHub / Google)
         │
         ▼
generateToken(email) → JWT cookie set
         │
         ▼
UPSERT users(email) → get user.id (new or existing)
         │
         ├─ New user? ──► Run "Access Sync"
         │                     ├─ Query Airtable → insert access_grants (source='airtable')
         │                     ├─ Query Circle API → insert access_grants (source='circle')
         │                     └─ Insert free grants (source='free') for open content
         │
         └─ Existing user? → skip sync (or re-sync if synced_at > threshold)
         │
         ▼
Redirect to /courses
```

**Free content grant**: On user upsert, always ensure a `course_slug='explorers'` grant with `source='free'` exists. This makes the access model explicit and queryable.

---

### verifyAuth() — New Hot Path

Replace Airtable call with Supabase query:

```typescript
// Before (Airtable, ~200-500ms per request):
const { purchasedCourses } = await getCustomerPurchases(email, AIRTABLE_API_KEY);

// After (Supabase, ~5-20ms, or cached in JWT claims):
const grants = await supabase
  .from('access_grants')
  .select('course_slug')
  .eq('user_id', userId)
  .is('expires_at', null); // or expires_at > now()
```

**Option A — Query per request** (simplest): Direct Supabase query on every protected page. ~5-20ms from Cloudflare Workers (Supabase supports connection pooling via pgbouncer + REST).

**Option B — Cache in JWT claims** (advanced): Add `grants` array to JWT payload on login. Token becomes source of truth until expiry (24h). Grant changes require re-login to take effect. Risk: stale grants for revoked access.

**Recommended: Option A** for correctness; can add edge caching later if latency is a concern.

---

### Airtable Sync Strategy

| Scenario | Action |
|---|---|
| Existing user, first login after migration | Sync Airtable → `access_grants` with `source='airtable'` |
| New user, no Airtable record | Create `users` record, no course grants (free-user model) |
| Returning user, recent sync | Skip Airtable (check `synced_at > 7 days` threshold) |
| Admin needs to update | Background job / webhook from Airtable to `/api/sync/airtable` |

The `synced_at` field on `access_grants` allows background re-verification without blocking the auth hot path.

---

### Circle Membership Migration

Current `CIRCLE_MEMBERS` KV caches `{email, spaceId, status}`. Proposed migration:

- On first login, query Circle API for all known spaces (`opanuj-frontend-live`, `10xdevs-1/2`)
- Insert/update `access_grants` with `source='circle'` and `source_meta={circleSpaceId, memberId}`
- The `CIRCLE_MEMBERS` KV namespace can be **kept as L1 cache** for Circle API calls but is no longer the authoritative source — Supabase is

---

### Game State Migration

Current: `GAME_STATE` KV with 1-year TTL.

Options:
1. **Keep KV** — simplest, KV is already provisioned. Supabase game_state table is optional.
2. **Migrate to Supabase** — enables SQL queries on game state (leaderboards, analytics, XP rankings). Better long-term.

**Recommended**: Keep KV as the **write-through cache** (fast edge writes), and add async sync to Supabase for durability and analytics. The 5-second debounce in `PhaserGame.svelte` can fire two saves: KV (fast) + Supabase (durable).

---

### Transition Plan for Existing Users

1. **Deploy Supabase schema** with empty tables
2. **Add sync middleware** to `verifyAuth()`: on each auth, if `users` record missing → run full sync from Airtable + Circle
3. **Keep Airtable fallback** during transition: if Supabase query fails, fall back to direct Airtable call
4. **Monitor sync coverage**: track `%users synced` via Supabase dashboard
5. **After 30 days** (all active users synced): remove Airtable fallback from hot path, keep only as background re-sync

---

## Code References

- `src/server/auth.ts` — JWT generation (no changes needed)
- `src/server/verifyAuth.ts:41` — `getCustomerPurchases()` call to be replaced
- `src/server/airtable/airtable-api.ts` — becomes a sync helper, not auth hot path
- `src/server/socialAuth.ts` — add `upsertUser()` + access sync after `generateToken()`
- `src/pages/verify.astro:21-25` — same: add sync after token generation
- `src/pages/api/auth/github/callback.ts:127-131` — same
- `src/pages/api/auth/google/callback.ts:92-95` — same
- `src/models/CollectionMappings.ts` — `CourseSlug` enum used as `course_slug` in DB
- `src/server/game/remoteGameStateKV.ts` — extend to also write to Supabase
- `wrangler.toml` — add Supabase env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`)

---

## Architecture Insights

### What Changes
| Layer | Before | After |
|---|---|---|
| User record | None (email-only in JWT) | `users` table in Supabase |
| Course access | Airtable lookup per request | Supabase `access_grants` query |
| Free content access | Implicit (no check or JWT-only) | Explicit `source='free'` grant in DB |
| Circle membership | `CIRCLE_MEMBERS` KV (cache only) | Supabase + KV as L1 cache |
| Game state | `GAME_STATE` KV only | KV (fast) + Supabase (durable) |
| Auth hot path latency | ~200-500ms (Airtable) | ~5-20ms (Supabase REST) |

### What Stays
- JWT structure (`{ email, exp, nbf }`) — no breaking change
- `HttpOnly` cookie flow — unchanged
- `MAGIC_LINKS` KV — ephemeral, stays at edge
- `PLATFORM_LESSON_CACHE` KV — lesson content cache, unchanged
- `CIRCLE_MEMBERS` KV — stays as L1 cache for Circle API calls

### New Capability Unlocked
- Free-user sign-up without Airtable record (resolves existing plan)
- Access can be granted/revoked by operators without code changes
- Game state durable backups with SQL queries (leaderboards, analytics)
- Single query to answer "what can this user access?" across all content types
- Webhook / API surface to sync Airtable changes to Supabase in real time

---

## Historical Context (from thoughts/)

- `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md` — Planned to remove Airtable gate without a DB (just empty purchases array). Supabase approach supersedes this by making the free access model explicit.
- `thoughts/shared/plans/2026-03-02-game-state-user-integration.md` — Planned GAME_STATE KV (already provisioned). Supabase adds durability on top.
- `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md` — Identified all Airtable blockers in the codebase (6 files). These become the Supabase integration points.
- `thoughts/shared/research/2026-03-02-game-state-user-integration.md` — Confirmed no numeric user ID exists; email is the only stable key. Supabase UUID will coexist alongside email as the platform user ID.

---

## Open Questions

1. **Supabase hosting**: Self-hosted (Cloudflare D1 alternative) or Supabase cloud? D1 is closer to Cloudflare Workers but lacks Supabase's auth/RLS ecosystem.
2. **JWT claims caching**: Should course grants be embedded in the JWT at login time (Option B) to reduce Supabase queries? Trade-off: stale grants vs. latency.
3. **Airtable webhook**: Should Airtable trigger a sync webhook to `/api/sync/airtable` on record update? Or is periodic re-sync (every 7 days on login) sufficient?
4. **Game state migration**: Migrate existing `GAME_STATE` KV entries to Supabase on first login, or start fresh? (recommendation: migrate on first authenticated game load)
5. **CIRCLE_MEMBERS KV fate**: Keep as L1 cache indefinitely, or deprecate once Circle data is in Supabase? Likely keep as cache since Circle API is slow.
6. **Row-Level Security**: Enable Supabase RLS so users can only read their own grants? Or use service key for all server-side queries (simpler, but requires careful API design)?

---

## Follow-up Research 2026-03-03

### User clarifications:
1. **Build on Supabase Auth schema** (`auth.users`) — not a custom `users` table from scratch
2. **Check `/external` routes access model** — separate Circle-based auth system
3. **Business logic in application code** — all grant logic in TypeScript services in `src/server/`, no Supabase triggers, no DB-level functions

---

### Correction: Supabase Auth as the User Schema Foundation

Instead of a custom `users` table, build on top of `auth.users` (Supabase Auth's managed table):

```sql
-- auth.users is managed by Supabase Auth:
-- id (uuid), email, created_at, last_sign_in_at, user_metadata (jsonb), app_metadata (jsonb)

-- Public profiles table — only what we add on top:
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,  -- denormalized for fast email → id lookup
  created_at timestamptz default now(),
  last_login timestamptz
);

-- Access grants reference auth.users directly:
create table public.access_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,   -- matches CourseSlug / externalAuthConfig courseId
  source      text not null,   -- 'free' | 'airtable' | 'circle' | 'manual'
  granted_at  timestamptz default now(),
  expires_at  timestamptz,     -- null = permanent
  synced_at   timestamptz,     -- last re-verified from source
  source_meta jsonb,           -- { airtableRecordId } or { circleSpaceId, memberId }
  unique(user_id, course_slug)
);

-- Game state (optional Supabase-backed durability):
create table public.game_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  version    int  default 1,
  updated_at timestamptz default now()
);

create index on public.access_grants(user_id);
create index on public.access_grants(course_slug);
create index on public.access_grants(source);
```

**How users are created via application code** (no Supabase Auth email flow used):
```typescript
// src/server/supabase/userService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function upsertUser(email: string): Promise<string> {
  // Try to find existing auth.users record
  const { data: existing } = await supabaseAdmin.auth.admin.getUserByEmail(email);

  if (existing.user) {
    // Update last_login in profiles
    await supabaseAdmin.from('profiles').upsert({ id: existing.user.id, email, last_login: new Date().toISOString() });
    return existing.user.id;
  }

  // Create new user in auth.users (no password, no email confirmation)
  const { data: created } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,   // mark as confirmed — our own magic link handles verification
    user_metadata: { source: 'platform' }
  });

  // Create public profile
  await supabaseAdmin.from('profiles').insert({ id: created.user.id, email });
  return created.user.id;
}
```

> All business logic lives in `src/server/supabase/` TypeScript modules. No Supabase DB triggers, no Supabase Edge Functions, no RPC stored procedures. Our Cloudflare Worker is the only place where business rules are encoded.

---

### /external Routes: Third Content Access Model

The `/external/*` routes implement a **completely separate auth system** from the main `/courses` routes.

**Key facts:**
- Auth gate: **Circle.so space membership** (not Airtable purchase)
- Session cookie: **`external_token_{courseId}`** (course-scoped, 24h JWT)
- Claims: `{ email, courseId, spaceId, exp, nbf }` — not the same token as main platform
- Access check on every request: `verifyExternalAuth()` → `resolveMembership()` → Circle API + KV

**Supported courses** (`src/server/circle/externalAuthConfig.ts`):
| courseId | Circle Platform | spaceId | Enforcement |
|---|---|---|---|
| `opanuj-frontend` | CIRCLE_PRZEPROGRAMOWANI | 944958 | Active (community members) |
| `10xdevs-1` | CIRCLE_BRAVE | 1905722 | Active |
| `10xdevs-2` | CIRCLE_BRAVE | 2166705 | Active + module release dates |

**Login flow** (magic link, Circle-gated):
```
POST /api/external/auth
  → resolveMembership(email, courseId)   ← Circle API + CIRCLE_MEMBERS KV cache
  → If not member → 403
  → If member → generate magic link → store in MAGIC_LINKS KV → send email
User clicks link
  → /external/{courseId}/verify?token=X
  → verifyMagicLink() → generateExternalToken({ email, courseId, spaceId })
  → set HttpOnly cookie external_token_{courseId}
```

**Lesson release gating** (10xDevs 2 only, `src/server/circle/lessonPlan.ts`):
- Lessons organized into modules (M3 released 2025-10-13, M4 released 2025-10-20, etc.)
- `isAccessAllowed(lessonId)` checks current time against module release date
- Unreleased lessons redirect to `/external/locked`

**Implication for Supabase integration:**
- `/external` users are a **superset** of `/courses` users — they may not have Airtable purchases at all
- Both paths should share the same `auth.users` record (email = primary key)
- Access grants need a new source: `source='circle'` with `source_meta: { circleSpaceId, memberId }`
- `CIRCLE_MEMBERS` KV stays as **L1 cache** for Circle API calls — Supabase `access_grants` becomes the **durable record**

---

### Revised Unified Access Grant Flow (all four content types)

```
User authenticates (any path: magic link / GitHub / Google / external magic link)
         │
         ▼
upsertUser(email) via Supabase Admin API
  → creates or returns auth.users record
  → upserts public.profiles
         │
         ▼
syncAccessGrants(userId, email)   ← runs in application code, src/server/supabase/
  ├─ Airtable sync (for main /courses users):
  │    getCustomerPurchases(email) → upsert access_grants source='airtable'
  ├─ Circle sync (for /external users):
  │    resolveMembership(email, each courseId) → upsert access_grants source='circle'
  └─ Free grants:
       upsert access_grants(course_slug='explorers', source='free')
         │
         ▼
Redirect to /courses  OR  /external/{courseId}
```

**verifyAuth() hot path** (replaces Airtable call):
```typescript
// src/server/verifyAuth.ts — new implementation
const { data: grants } = await supabaseAdmin
  .from('access_grants')
  .select('course_slug')
  .eq('user_id', userId)
  .or('expires_at.is.null,expires_at.gt.now()');

const purchasedCourses = grants.map(g => AIRTABLE_FROM_SLUG[g.course_slug]).filter(Boolean);
```

**verifyExternalAuth() hot path** (simplified — Circle check deferred to background sync):
```typescript
// On token validation: check access_grants first (fast Supabase query)
// If not found or stale (synced_at > 24h): re-check Circle API and update grant
```

---

### Business Logic Placement (confirmed architecture)

All sync and grant logic implemented as TypeScript services, called from existing Astro API routes and middleware:

```
src/server/supabase/
  ├── client.ts               — Supabase Admin client singleton
  ├── userService.ts          — upsertUser(), getUserByEmail()
  ├── accessService.ts        — getGrants(), hasGrant(), upsertGrant(), revokeGrant()
  ├── airtableSyncService.ts  — syncFromAirtable(userId, email)
  └── circleSyncService.ts    — syncFromCircle(userId, email, courseId)
```

Integration points (no new abstractions, just calling services from existing files):
- `src/pages/verify.astro` → after JWT set: `await upsertUser(email); await syncAccessGrants(userId, email)`
- `src/pages/api/auth/github/callback.ts` → same
- `src/pages/api/auth/google/callback.ts` → same
- `src/pages/external/[courseId]/verify.astro` → same, but with `courseId` for circle-only sync
- `src/server/verifyAuth.ts` → replace `getCustomerPurchases()` with `accessService.getGrants()`
- `src/server/externalAuth.ts` → replace KV-only membership with `accessService.hasGrant()` + Circle re-sync if stale

**No Supabase triggers.** No Supabase Edge Functions. No DB-level stored procedures. The Cloudflare Worker is the single enforcement point.

---

### Revised Open Questions

1. **Supabase Admin API from Cloudflare Workers**: Supabase JS SDK v2 works in Workers via `@supabase/supabase-js`. Use `createClient(url, serviceKey, { auth: { persistSession: false } })`.
2. **Circle re-sync frequency**: Current `CIRCLE_MEMBERS` KV TTL is 60 days freshness. With Supabase, use `synced_at > 7 days` threshold in `verifyExternalAuth()` to trigger a re-sync, keeping Circle API calls minimal.
3. **`/api/external/membership-refresh` background job**: Keep this endpoint but have it update both KV cache AND Supabase `access_grants` — dual write during migration, then drop KV once Supabase is stable.
4. **Module release date logic** (`src/server/circle/lessonPlan.ts`): This stays in application code as-is — no change needed; it's already a pure function not touching any storage.

---

## Follow-up Research 2026-03-03 (JWT Unification)

### Requirement
Single JWT schema across the entire platform. All auth paths — main platform and `/external` — must produce an identical token. Backward compatibility required for users with existing `external_token_{courseId}` cookies.

---

### Current JWT Divergence (problem)

| | Main platform | External (current) |
|---|---|---|
| **Payload** | `{ email, exp, nbf }` | `{ email, courseId, spaceId, exp, nbf }` |
| **Cookie name** | `token` | `external_token_{courseId}` |
| **Generator** | `generateToken()` in `src/server/auth.ts` | `generateExternalToken()` in `src/server/externalAuth.ts` |
| **Verifier** | `verifyToken()` in `src/server/auth.ts` | `verifyExternalToken()` in `src/server/externalAuth.ts` |

`courseId` and `spaceId` are embedded in the external JWT to scope the session. With Supabase `access_grants`, this information comes from the database — the JWT no longer needs to carry it.

---

### Target: Unified JWT

```
payload:     { email, exp, nbf }          ← identical for all auth paths
cookie name: token                        ← single cookie
generator:   generateToken()              ← src/server/auth.ts (unchanged)
verifier:    verifyToken()                ← src/server/auth.ts (unchanged)
```

Course scope (which Circle space the user belongs to) is resolved by querying `access_grants WHERE source='circle'` — not from the JWT.

---

### Files to Change

#### `src/server/externalAuth.ts`

**Remove:**
- `ExternalTokenPayload` interface (courseId, spaceId fields no longer in JWT)
- `generateExternalToken()` function entirely
- `verifyExternalToken()` function entirely

**Update `verifyExternalAuth()`:**
```typescript
// NEW: reads unified token from 'token' cookie, with fallback to old external cookie
export async function verifyExternalAuth(
  cookies,
  courseId: string,
  env
): Promise<ExternalAuthResult> {
  // 1. Try new unified token cookie
  let token = cookies.get('token')?.value;
  let isLegacyToken = false;

  // 2. Backward compat: fall back to old course-scoped cookie
  if (!token) {
    token = cookies.get(`external_token_${courseId}`)?.value;
    isLegacyToken = !!token;
  }

  if (!token) return { isAuthenticated: false };

  // 3. Verify with unified verifyToken() — works for both old and new tokens
  //    Old tokens have extra claims (courseId, spaceId) which are ignored
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload?.email) return { isAuthenticated: false };

  // 4. (Legacy only) validate old token's courseId claim matches URL
  if (isLegacyToken && (payload as any).courseId !== courseId) {
    return { isAuthenticated: false };
  }

  const email = payload.email;

  // 5. Check access via Supabase (or KV cache fallback during migration)
  const hasAccess = await accessService.hasGrant(email, courseId, env);
  if (!hasAccess) {
    // Re-sync from Circle API (application code, not a trigger)
    const decision = await resolveMembership(email, courseId, env, { ... });
    if (decision.status !== 'active') return { isAuthenticated: false };
    // Sync result to Supabase access_grants (application code)
    await circleSyncService.upsertGrant(email, courseId, decision, env);
  }

  return { isAuthenticated: true, email, courseId };
}
```

**Key**: `verifyToken()` from `auth.ts` accepts old external tokens fine — HS256 + same secret — extra claims (`courseId`, `spaceId`) are present in the payload but simply ignored when reading only `email`.

---

#### `src/pages/external/[courseId]/verify.astro`

**Remove** (lines 5, 37, 40-47):
```typescript
// BEFORE:
import { generateExternalToken } from '@/server/externalAuth';
const sessionToken = await generateExternalToken(email, courseId, config.spaceId, env.JWT_SECRET);
const cookieName = `external_token_${courseId}`;
Astro.cookies.set(cookieName, sessionToken, { ... });
```

**Replace with:**
```typescript
// AFTER:
import { generateToken } from '@/server/auth';
const sessionToken = await generateToken(email, env.JWT_SECRET);
Astro.cookies.set('token', sessionToken, {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24,
});
// upsertUser + circleSyncService.syncForCourse(userId, email, courseId, env)
```

No cookie name change needed in the `/external/[courseId]/login.astro` — it just renders the email form; it reads no cookie.

---

#### `src/server/externalAuth.ts` — `ExternalAuthResult` type

`courseId` field can stay in `ExternalAuthResult` for now (consumed by `/external` pages for redirect logic), but it comes from the **URL parameter**, not the JWT.

---

### Backward Compatibility Strategy

Since external JWT tokens expire after **24 hours**, the legacy token window is naturally bounded. However, for users mid-session at deploy time:

| Scenario | Behavior |
|---|---|
| User has valid `token` cookie (new unified) | Works immediately — single code path |
| User has valid `external_token_{courseId}` (legacy, < 24h old) | `verifyExternalAuth()` falls back to old cookie, validates with `verifyToken()`, extracts email, proceeds — **transparent** |
| User has expired `external_token_{courseId}` | Redirected to login, gets new unified `token` on next auth |
| User has both cookies | New `token` takes priority, old cookie ignored |

**No explicit migration step required.** After 24h from deploy, all active sessions will have unified tokens. The fallback code can be removed in a follow-up cleanup.

---

### What Gets Deleted

| Code | Location | Reason |
|---|---|---|
| `ExternalTokenPayload` interface | `src/server/externalAuth.ts:10-16` | courseId/spaceId no longer in JWT |
| `generateExternalToken()` | `src/server/externalAuth.ts:36-50` | Replaced by `generateToken()` from auth.ts |
| `verifyExternalToken()` | `src/server/externalAuth.ts:59-75` | Replaced by `verifyToken()` from auth.ts |
| `external_token_${courseId}` cookie write | `src/pages/external/[courseId]/verify.astro:40-47` | Replaced by unified `token` cookie |
| `external_token_${courseId}` cookie read | `src/server/externalAuth.ts:92-93` | Replaced by `token` cookie read (with legacy fallback) |

**`src/server/auth.ts` is not changed.** `generateToken()` and `verifyToken()` remain exactly as-is.

---

### Impact on `/external` Pages (lesson-release gating)

The module release date check (`isAccessAllowed(lessonId)` in `src/server/circle/lessonPlan.ts`) does not read from the JWT — it takes `courseId` from the URL parameter and `lessonId` from the URL. **No change needed there.**

The `courseId` needed by `verifyExternalAuth()` always comes from `Astro.params.courseId` (URL), never from the JWT claim. So removing it from the JWT is safe.
