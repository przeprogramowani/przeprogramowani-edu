# 10xDevs Mission Log Implementation Plan

## Overview

Build a new authenticated subpage **10xDevs Mission Log** at `/10xdevs-3/mission-log` that lets 10xDevs 3.0 students browse 25 course lessons (5 modules × 5) and generate a personal badge per lesson via the external `https://badges.10xdevs.pl` API. Module-level time gating (one module unlocks per week, starting **2026-05-18**) is provided by a new reusable `courseGating` module so the same mechanism powers the future main 10xDevs 3.0 course launch. Quota is **2 generations lifetime per (user, lesson)**. Calls to the badges API are server-proxied. A new tile in the `/courses` "Dodatki do szkoleń" section is the entry point; the tile is shown only when the user has `10XDEVS_3` access.

## Current State Analysis

- `src/components/CourseList.astro:141-176` hosts the "Dodatki do szkoleń" section with a hardcoded Space Explorers card and `SHOW_GAMES_SECTION = true` flag; **no per-card access gating exists yet**.
- `verifyAuth(Astro, '10xdevs-3')` (`src/server/verifyAuth.ts:11-78`) is the canonical page-level guard; passing a `courseSlug` triggers permission check via `PERMISSION_MAPPINGS` (`src/models/CollectionMappings.ts:51`). `10xdevs-3` → `10XDEVS_3`.
- 10xDevs 3.0 access is authoritatively decided by `checkTenXDevs3ToolkitMembership` (`src/server/toolkit/tenXDevs3Membership.ts:95-203`) against `TOOLKIT_10X3_MEMBERSHIP_KV`. After `verifyAuth`, `purchases` already reflects that decision via the grants flow, so the courses-tile gate can read `purchases.includes('10XDEVS_3')` directly.
- The `lessons10xDevs3` Astro collection (`src/content.config.ts:61-64`) is **empty** (only `.gitkeep`); the lesson catalog must be defined as a typed constant decoupled from Astro content for now. Prework lessons are unrelated to Mission Log.
- Profile + avatar already exist: `src/pages/profile.astro` for the page, `src/pages/api/profile/avatar.ts` for upload, `profiles.avatar_url` in Supabase pointing at the platform's own Storage bucket. The bucket policy is "never use OAuth avatar URL" (`src/pages/api/auth/github/callback.ts:199-202`) — meaning `profile.avatarUrl` is safe to hand to a third-party API.
- No per-user daily/lifetime quota system exists. `src/server/kvRateLimiter.ts` is a windowed-counter helper but unused; the codebase pattern for durable per-user counters is Supabase tables with FK to `auth.users(id)` (see `lesson_progress` / `quiz_results` migrations).
- Supabase migration naming: `YYYYMMDDHHMMSS_description.sql`. RLS is enabled by `20260331000000_enable_rls.sql` but the platform reads via the service role key (CLAUDE.md), so RLS is effectively bypassed; new tables should still `enable row level security` for safety.
- The Worker runtime has no MCP for the badges API; a plain `fetch` from `src/server/...` is the right pattern (see `src/server/circle/membershipApi.ts:26-39`).

### Key Discoveries

- **Badges API contract** (resolved from `https://badges.10xdevs.pl/api-docs`):
  - `GET  /api/catalog-badge` → `{ count: 25, canvas, badges: [{ id 1-25, name, overlayPath, useAstronautCompositionHints }] }`
  - `POST /api/catalog-badge/generate` body `{ email, badgeId (int 1-25), imageUrl (http(s) or `data:image/...;base64`) }` → `{ imageUrl, name, persistedToDatabase, recordId }`. **Idempotent on (email, badgeId)** — resubmitting replaces the prior record.
  - `POST /api/catalog-badge/list` body `{ email }` → `{ count, badges: [{ badgeId, name, imageUrl, generatedAt, updatedAt, recordId }] }`.
  - Auth is **origin/referer based**, not a token. Production whitelist includes `https://platforma.przeprogramowani.pl`. Status codes used: `400` validation, `403` origin not whitelisted, `429` rate limit, `500` server error.
- The user `email` from the JWT is what we send upstream — it identifies the badge owner on the badges-API side.
- The platform's Supabase `avatar_url` is an http URL with `?v=<ts>` cache buster; the badges API accepts `http(s)` URLs directly, so no base64 transcoding is needed.

## Desired End State

A 10xDevs 3.0 student lands on `/courses`, sees a new **10xDevs Mission Log** tile (deep-purple/cyan/green, space-themed) in "Dodatki do szkoleń". Clicking it opens `/10xdevs-3/mission-log` where they see five module rows. Modules whose unlock date has not passed are locked with a countdown. For unlocked modules, each lesson tile shows either (a) "Wygeneruj odznakę" CTA, (b) the rendered badge image with a "Wygeneruj ponownie" CTA (counts as the 2nd lifetime attempt), or (c) "Limit wykorzystany" if both attempts are spent. Clicking generate without an avatar opens a modal linking to `/profile?next=...` and returning the user to the same page on save. The action goes through `POST /api/mission-log/generate` which authoritatively checks: signed in → has `10xdevs-3` access → has avatar → module unlocked → `count < 2` → upstream `generate` → row in `mission_log_generations` upserted. Verification: `npm run build` passes, all new unit tests pass, manual run through the flow on a staging account shows the badge image and decrements the counter; locked modules cannot be bypassed via direct API call; quota is enforced by the server even if client state is tampered with.

## What We're NOT Doing

- Not authoring or migrating actual 10xDevs 3.0 lesson HTML; Mission Log uses a typed catalog constant (`MISSION_LOG_LESSON_CATALOG`) that does not depend on the (currently empty) `lessons10xDevs3` Astro collection.
- Not building a Mission Log embed/external route under `/external/...`; the page is platform-internal only.
- Not adding KV caching for the live badges list — answer to Q "list read" was always-live.
- Not adding a Mission Log entry to MailerLite / analytics / Slack notifications.
- Not mirroring badge artifacts (images) into our Supabase Storage; the badges API is authoritative for the image asset.
- Not adding an admin UI for editing module unlock dates — config is code-resident with a fixed cohort schedule.
- Not changing the existing Space Explorers card or the courses listing for any other course.
- Not generalising the lesson catalog into a content-collection extension; we keep it scoped to Mission Log and revisit if/when the main `lessons10xDevs3` collection is populated.

## Implementation Approach

Three thin vertical phases, each independently testable:

1. **Foundation** — reusable `courseGating` module (config map + pure helpers) and a typed `MISSION_LOG_LESSON_CATALOG` constant with a curated lesson→badgeId map. Pure code + unit tests. No DB, no network.
2. **Server** — Supabase migration for the quota table, a `quotaService`, a thin `badgesApiClient`, and two API routes (`GET /api/mission-log/state`, `POST /api/mission-log/generate`) that compose all the policy (auth, access, avatar, gating, quota) before calling upstream.
3. **UI** — server-rendered Astro page, a Svelte island for the interactive grid, an `AvatarRequiredModal` Svelte component, `?next=` round-trip in `/profile`, and the new conditional courses-index tile.

Tests live alongside the modules they cover (Vitest); integration verification is manual (real upstream call against staging).

## Critical Implementation Details

- **Origin / whitelist coordination prerequisite.** Badges API enforces an origin whitelist (production list currently includes only `https://platforma.przeprogramowani.pl`). Our Worker must set an explicit `Origin: <env.SITE_URL>` header on every call to `badges.10xdevs.pl` (`fetch` from Workers does not auto-send `Origin`). Before launch, the badges team must add `https://przeprogramowani-edu.pages.dev` (and any preview origin used for staging tests) to the whitelist. If this is not done, both `generate` and `list` will 403. Add a release-prerequisite item to Phase 2 manual verification.
- **Idempotency vs. quota.** Upstream `generate` is idempotent on (email, badgeId): a resubmit replaces the prior record. Our quota counter must increment on every successful upstream call, not on "first time". A user's two attempts therefore manifest as one final image (the second overwrites the first), but the local counter knows both attempts were spent. The local counter is the source of truth for the cap.
- **Avatar URL cache-buster.** `profile.avatarUrl` is `<bucket-url>?v=<timestamp>`. Pass it verbatim to the badges API; the query string is part of the URL the badges API will fetch, and the bucket is publicly readable.
- **Time zone for module unlock.** Module unlock targets `2026-05-18` etc. at **00:00 Europe/Warsaw**. Store the wall-clock target in the config as ISO with the +02:00 offset (CEST in May–October) and compare against `Date.now()` directly; no further TZ math needed.
- **Upstream 429.** Cohort launch Mondays (a module unlocks → many users press Generate within the same hour) can hit the badges API's per-origin rate limit. The client should treat upstream 429 as a soft retryable error: return `503 mission-log/upstream-busy` to the browser, *do not* increment our quota counter (the call did not succeed), and the UI shows "Spróbuj za chwilę". No automatic retry from the Worker — the user retries on their own.

## Phase 1: Foundation — course gating + lesson catalog + badge map

### Overview

Lay down the two pure code modules that everything else depends on: a reusable `courseGating` module and the Mission Log lesson catalog with the static lesson→badgeId map. No DB, no network, no UI — fully unit-testable.

### Changes Required:

#### 1. Course-gating module

**File**: `src/server/courseGating/types.ts`

**Intent**: Define the shape that any course's per-module unlock schedule must follow, so the same helpers can serve Mission Log today and the future main 10xDevs 3.0 course rollout.

**Contract**: Export `type ModuleId = string` (opaque), `type CourseSlug` re-imported from `@/models/CollectionMappings`, and `interface CourseGatingConfig { courseSlug: CourseSlug; modules: { id: ModuleId; unlocksAt: string /* ISO-8601 with TZ offset */ }[] }`. No code logic.

---

**File**: `src/server/courseGating/index.ts`

**Intent**: Pure helpers for "is this module unlocked yet?" and "when does the next-to-unlock module open?". Takes a `now: Date` parameter (defaulting to `new Date()`) for testability.

**Contract**: Export `isModuleUnlocked(config: CourseGatingConfig, moduleId: ModuleId, now?: Date): boolean`, `getModuleStatuses(config, now?): { id: ModuleId; unlocksAt: string; unlocked: boolean }[]`, `getNextUnlockAt(config, now?): string | null`. Also export `loadCourseGatingConfig(courseSlug: CourseSlug): CourseGatingConfig` that delegates to a per-course config file (see next).

---

**File**: `src/server/courseGating/tenXDevs3.ts`

**Intent**: Concrete config for `10xdevs-3` with the five Monday unlock dates (Europe/Warsaw, 00:00 local → +02:00 in May/June).

**Contract**: Export `const TEN_X_DEVS_3_GATING: CourseGatingConfig` with five modules `m1`..`m5` and `unlocksAt` values `2026-05-18T00:00:00+02:00`, `2026-05-25T...`, `2026-06-01T...`, `2026-06-08T...`, `2026-06-15T...`. `loadCourseGatingConfig('10xdevs-3')` in `index.ts` returns this constant.

---

**File**: `src/server/courseGating/index.test.ts`

**Intent**: Lock down helper semantics so the rollout doesn't drift.

**Contract**: Cases: (a) `now` before m1 unlock → all locked; (b) `now` exactly at m1 unlock → m1 unlocked, m2..m5 locked; (c) `now` between m3 and m4 → m1..m3 unlocked, m4..m5 locked; (d) `now` after m5 → all unlocked; (e) `getNextUnlockAt` returns `null` when all unlocked.

#### 2. Mission Log lesson catalog + badge map

**File**: `src/models/missionLog/lessonCatalog.ts`

**Intent**: Define the 25 lessons of 10xDevs 3.0 as a typed constant array (since the Astro collection is empty), each tied to a module and to a catalog-badge id.

**Contract**: Export `interface MissionLogLesson { lessonId: string; title: string; moduleId: 'm1' | 'm2' | 'm3' | 'm4' | 'm5'; order: number; badgeId: number /* 1..25 */ }` and `const MISSION_LOG_LESSON_CATALOG: readonly MissionLogLesson[]` (25 entries). `lessonId` is a stable kebab-case identifier the user-facing UI never shows; `title` is the Polish display string. `badgeId` values 1..25 each appear exactly once. The actual titles must be supplied by the user during implementation — the catalog ships with placeholder titles (`"Moduł 1, Lekcja 1"`, …) that the implementer fills in from the course outline.

---

**File**: `src/models/missionLog/lessonCatalog.test.ts`

**Intent**: Guard the catalog's invariants so a careless edit can't break Mission Log.

**Contract**: Assert that the catalog has exactly 25 entries; that `lessonId` values are all unique; that `badgeId` values are a permutation of `1..25`; that exactly 5 lessons exist per module; that within each module, `order` is `1..5`.

### Success Criteria:

#### Automated Verification:

- Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit`
- Unit tests pass: `npx vitest run src/server/courseGating src/models/missionLog`
- Lint passes: `npm run lint`

#### Manual Verification:

- The 25 placeholder lesson titles in `lessonCatalog.ts` have been replaced with the actual Polish titles (or confirmed acceptable for first ship).
- The five module unlock dates in `tenXDevs3.ts` have been confirmed with the course operator (correct Mondays, correct TZ).

---

## Phase 2: Server — badges proxy + quota + Mission Log API

### Overview

Persist quota state, wrap the upstream badges API, and expose two thin Worker routes that compose every policy check (auth → 10xDevs 3.0 access → avatar present → module unlocked → quota OK) before forwarding to upstream. Tests cover the policy composition with the upstream mocked.

### Changes Required:

#### 1. Quota persistence

**File**: `supabase/migrations/20260515000000_mission_log_generations.sql`

**Intent**: Track per-user, per-lesson generation count so the 2-lifetime cap can be enforced authoritatively.

**Contract**: Create table `public.mission_log_generations` with columns `user_id uuid not null references auth.users(id) on delete cascade`, `lesson_id text not null`, `count integer not null default 0 check (count >= 0)`, `first_generated_at timestamptz`, `last_generated_at timestamptz`, `last_badge_image_url text`, `last_badge_id integer`, primary key `(user_id, lesson_id)`. Add index on `(user_id)`. `alter table enable row level security`. Run order matches the existing `YYYYMMDDHHMMSS_*` convention (newer than `20260508000000_profiles_name_avatar.sql`).

---

**File**: `src/server/missionLog/quotaService.ts`

**Intent**: One module that knows the 2-lifetime cap rule, reads / writes `mission_log_generations`, and exposes the operations the routes need.

**Contract**: Export `const MAX_GENERATIONS_PER_LESSON = 2`, `interface QuotaEntry { lessonId: string; count: number; lastBadgeImageUrl: string | null; lastBadgeId: number | null }`, `getQuotaForUser(userId: string, env): Promise<QuotaEntry[]>` (returns rows from DB; missing lessons have implicit count 0 — caller composes the full lesson grid), `recordGeneration({ userId, lessonId, badgeId, badgeImageUrl }, env): Promise<{ count: number }>` which atomically upserts and increments by 1 (use Supabase `rpc` or read-then-upsert; race is acceptable because the upstream upsert makes a double-call idempotent, but increment must be monotonic; prefer `on conflict do update set count = mission_log_generations.count + 1`). Throws if `count` would exceed `MAX_GENERATIONS_PER_LESSON` after increment — callers must precheck with `getQuotaForUser` and only call `recordGeneration` after a successful upstream call.

---

**File**: `src/server/missionLog/quotaService.test.ts`

**Intent**: Lock the cap behavior.

**Contract**: Mock Supabase client. Cases: (a) first generation creates row with `count=1`; (b) second generation increments to `count=2`; (c) third generation rejected (`count` already 2). Verify the SQL conflict clause via the mock.

#### 2. Badges API client

**File**: `src/server/badges/badgesApiClient.ts`

**Intent**: Single module that knows how to talk to `https://badges.10xdevs.pl`. All policy stays in routes; this module is dumb transport.

**Contract**: Export `interface BadgesApiEnv { BADGES_API_BASE_URL: string; SITE_URL: string }`, and three async functions: `getCatalog(env): Promise<CatalogResponse>`, `generateBadge({ email, badgeId, imageUrl }, env): Promise<GenerateResponse>`, `listBadges({ email }, env): Promise<ListResponse>`. Every call sets `Origin: env.SITE_URL` and `Content-Type: application/json`. Error shape: throw `BadgesApiError` (custom class with `status: number | null`, `code: 'origin_forbidden' | 'rate_limited' | 'validation' | 'upstream_error' | 'network'`); routes translate that into HTTP responses. No retries.

---

**File**: `astro-env.ts`

**Intent**: Register the new env var so type-checked access works.

**Contract**: Add `BADGES_API_BASE_URL: envField.string({ context: 'server', access: 'public', default: 'https://badges.10xdevs.pl' })` alongside the existing entries.

#### 3. API routes

**File**: `src/pages/api/mission-log/state.ts`

**Intent**: One trip that gives the page everything it needs to render: who's allowed in, the gating state, the quota map, and the upstream-known badge URLs.

**Contract**: `GET`. Calls `verifyAuth(Astro, '10xdevs-3')`. On unauth → `401`. On no access → `403`. Otherwise composes and returns JSON: `{ now: ISO, avatarUrl: string | null, modules: ModuleStatus[], lessons: LessonState[] }` where `LessonState = { lessonId, title, moduleId, order, badgeId, count, remaining, badgeImageUrl: string | null, locked: boolean }`. `badgeImageUrl` is taken from `mission_log_generations.last_badge_image_url` only — we do NOT call upstream `/list` here (decision: always-live read happens on demand, but on initial render we hydrate from our own table to keep the page fast and not coupled to upstream availability). `locked` is computed from `courseGating`.

---

**File**: `src/pages/api/mission-log/generate.ts`

**Intent**: The single mutating endpoint. Composes every policy gate in order, calls upstream, records the successful attempt, and returns the new image URL.

**Contract**: `POST` body `{ lessonId: string }`. Flow:
1. `verifyAuth(Astro, '10xdevs-3')` → 401/403 as above.
2. Look up the lesson in `MISSION_LOG_LESSON_CATALOG`. Missing → `404 lesson_not_found`.
3. Reject if `auth.avatarUrl` is empty/null → `409 avatar_missing`.
4. `isModuleUnlocked(TEN_X_DEVS_3_GATING, lesson.moduleId)` → `403 module_locked` with `unlocksAt` in body.
5. Pre-check quota: `getQuotaForUser` → if existing `count >= MAX_GENERATIONS_PER_LESSON` → `429 quota_exhausted`.
6. Call `badgesApiClient.generateBadge({ email, badgeId, imageUrl: avatarUrl })`.
   - `BadgesApiError code=rate_limited` → `503 upstream_busy` (do **not** increment counter).
   - `code=origin_forbidden` → `502 upstream_origin_forbidden` (log loudly; release-prereq broken).
   - other → `502 upstream_error`.
7. On success, `recordGeneration({ userId, lessonId, badgeId, badgeImageUrl: response.imageUrl })`. Return `{ badgeImageUrl, count, remaining: MAX_GENERATIONS_PER_LESSON - count }`.

---

**File**: `src/pages/api/mission-log/generate.test.ts`

**Intent**: Catch any policy ordering regression.

**Contract**: Vitest + mocked `verifyAuth`, mocked `badgesApiClient`, mocked Supabase. Cases for each branch above (401, 403 no-access, 404 lesson, 409 avatar, 403 locked, 429 quota, 503 upstream-busy, 200 success), and one case verifying counter is NOT incremented when upstream returns 429.

### Success Criteria:

#### Automated Verification:

- Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit`
- Unit tests pass: `npx vitest run src/server/missionLog src/pages/api/mission-log`
- Migration applies cleanly against a local Supabase: `supabase db reset` (in `projects/edu-platform`)
- Lint passes: `npm run lint`

#### Manual Verification:

- Badges API team has whitelisted `https://przeprogramowani-edu.pages.dev` (and the preview/staging origin) — verified by a manual `curl -X POST -H 'Origin: https://przeprogramowani-edu.pages.dev' …/api/catalog-badge/list -d '{"email":"…"}'` returning 200, not 403.
- `BADGES_API_BASE_URL` env var is present in Cloudflare Pages (or left unset to default).
- A direct `curl` against `/api/mission-log/state` for an authenticated 10xDevs 3.0 test user returns the 5-module + 25-lesson payload.
- A direct `curl` against `/api/mission-log/generate` for a locked module returns `403 module_locked` (verified before May 18 unlock, or by temporarily overriding `now` via a debug hook).

---

## Phase 3: UI — Mission Log page + grid + courses index tile

### Overview

Server-render the Mission Log page, mount a Svelte island for the interactive grid, add the avatar-missing modal with a profile round-trip, and surface a new conditional tile in the courses index.

### Changes Required:

#### 1. Mission Log page

**File**: `src/pages/10xdevs-3/mission-log.astro`

**Intent**: Authenticated page that fetches initial state server-side (so the user sees the grid without a loading flash) and hands it to the Svelte island.

**Contract**: Uses `BaseLayout`. Calls `verifyAuth(Astro, '10xdevs-3')`; unauthenticated → redirect to `/login?next=/10xdevs-3/mission-log`; no access → redirect to `/courses`. Fetches initial Mission Log state by calling the same composer the `/api/mission-log/state` route uses (extract that composer into `src/server/missionLog/buildState.ts` to avoid an internal HTTP hop). Passes `{ initialState, avatarUrl, email }` to a `<MissionLogGrid client:load />` Svelte island. Title: "10xDevs Mission Log".

---

**File**: `src/server/missionLog/buildState.ts`

**Intent**: Single function that produces the Mission Log state payload, callable from both the page and the route.

**Contract**: Export `buildMissionLogState({ userId, env }): Promise<MissionLogState>`. The state route becomes a thin JSON wrapper around this.

#### 2. Interactive grid

**File**: `src/components/missionLog/MissionLogGrid.svelte`

**Intent**: The 5-module × 5-lesson grid with the custom space theme; orchestrates generate calls and the avatar modal.

**Contract**: Props `{ initialState, avatarUrl, email }`. Local writable store mirrors `initialState`. Renders five module rows; each row's header shows status and (if locked) the unlock countdown. Lessons render as cards in a `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3` layout. Card states: locked (greyed, padlock icon), unredeemed (CTA "Wygeneruj odznakę"), generated (shows `badgeImageUrl` with "Wygeneruj ponownie", visible only while `remaining > 0`), exhausted ("Limit wykorzystany"). Theme: card background `bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950`, accent borders `border-purple-500/30`, success state accent `text-emerald-300`, locked overlay `bg-black/60 backdrop-blur-sm`. On generate click: if `!avatarUrl` → mount `<AvatarRequiredModal>` and stop; else `POST /api/mission-log/generate` with the lesson id, then patch the local store with the response, or surface an inline error banner per status code (avatar / quota / module / upstream-busy).

---

**File**: `src/components/missionLog/AvatarRequiredModal.svelte`

**Intent**: Tells the user they need an avatar and round-trips them through `/profile`, returning to the same page on success.

**Contract**: Props `{ onClose }`. Renders an overlay with a one-paragraph explanation and a primary button `Ustaw avatar` linking to `/profile?next=%2F10xdevs-3%2Fmission-log` (URL-encoded). Secondary button closes the modal.

#### 3. `/profile` `?next=` round-trip

**File**: `src/pages/profile.astro`

**Intent**: When the profile page is opened with `?next=<relative-path>`, redirect the user back there after a successful avatar upload.

**Contract**: Read `Astro.url.searchParams.get('next')`. Validate as a same-origin path (starts with `/`, no `//`, no protocol). Pass the validated value into the existing profile component so its save handler can redirect on success. If invalid or absent, fall back to current behavior.

#### 4. Courses index tile

**File**: `src/components/CourseList.astro`

**Intent**: Add a second tile in "Dodatki do szkoleń" that's visible only to 10xDevs 3.0 students, alongside the existing Space Explorers card.

**Contract**: At the top of the frontmatter, derive `const SHOW_MISSION_LOG = accessibleCourseSlugs.includes('10xdevs-3');` (re-using the same `accessibleCourseSlugs` already computed above). Inside the existing `{SHOW_GAMES_SECTION && …}` block at `src/components/CourseList.astro:141-176`, render a second card next to Space Explorers, wrapped in `{SHOW_MISSION_LOG && …}`. Card mirrors the Space Explorers structure (`aspect-video` thumb, hover lift, status badge), with theme `from-purple-950 via-indigo-950 to-cyan-950`, badge text "Mission Log" in `text-cyan-300`, title "10xDevs Mission Log", subtitle "Zdobądź odznaki za ukończone lekcje 10xDevs 3.0", CTA "Otwórz" linking to `/10xdevs-3/mission-log`. No thumbnail image — use the gradient fallback already in the file at lines 103-109.

#### 5. (Optional) Theme tokens

**File**: `src/components/missionLog/theme.ts`

**Intent**: Centralise the Tailwind class strings used across the grid + tile so future polish doesn't drift.

**Contract**: Export named constants like `MISSION_LOG_CARD_GRADIENT`, `MISSION_LOG_LOCKED_OVERLAY`, `MISSION_LOG_BADGE_TEXT` returning Tailwind class strings. Include only if the grid + tile actually share more than one or two strings; otherwise omit.

### Success Criteria:

#### Automated Verification:

- Build passes: `npm run -w projects/edu-platform build`
- Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit`
- Lint passes: `npm run lint`
- Existing tests still pass: `npm run -w projects/edu-platform test`

#### Manual Verification:

- Logged in as a 10xDevs 3.0 user before May 18, the courses index shows the Mission Log tile, and `/10xdevs-3/mission-log` renders 5 module rows, all locked, each with the correct unlock date.
- Logged in as a user **without** 10xDevs 3.0 access, the Mission Log tile is NOT shown on `/courses`, and `/10xdevs-3/mission-log` redirects to `/courses`.
- With a profile that has no avatar, clicking Generate opens the Avatar Required modal; clicking "Ustaw avatar" lands on `/profile?next=...`; uploading an avatar and saving returns to `/10xdevs-3/mission-log`.
- With an avatar and an unlocked module (verify by temporarily overriding `now` or testing after May 18), clicking Generate produces a real badge image from `badges.10xdevs.pl`; the card shows the image and "Wygeneruj ponownie"; a second generate succeeds, after which the card shows "Limit wykorzystany"; a third attempt is rejected by the server.
- A page reload preserves the rendered badges and the per-lesson counter.
- On mobile (375px), the grid is readable and tappable.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before declaring the change done.

---

## Testing Strategy

### Unit Tests

- `courseGating/index.test.ts` — boundary conditions around module unlock timestamps.
- `lessonCatalog.test.ts` — invariants on the 25-entry catalog.
- `quotaService.test.ts` — first/second/third generation behavior; idempotency of `recordGeneration` semantics.
- `api/mission-log/generate.test.ts` — every policy branch (auth, access, lesson lookup, avatar, gating, quota, upstream variants).

### Manual Testing Steps

1. Open `/courses` as a user with `10XDEVS_3` access → confirm Mission Log tile appears.
2. Open `/courses` as a user without `10XDEVS_3` access → confirm tile is absent.
3. Open `/10xdevs-3/mission-log` as the 10xDevs 3.0 user before May 18 → confirm all modules locked with correct countdown.
4. Remove the profile avatar in the database, click Generate on any lesson → modal appears; round-trip through `/profile` and confirm return to the page.
5. Upload an avatar, click Generate on an unlocked-module lesson → confirm badge image renders.
6. Click Generate again → confirm `count=2` and "Limit wykorzystany".
7. Press Generate a third time via DevTools (bypassing UI) → confirm 429 from the server.
8. Direct-curl `/api/mission-log/generate` against a locked module → confirm 403 even when avatar present.
9. Reload page → confirm state is persistent.

### Edge cases to verify explicitly

- Avatar URL with `?v=` cache buster reaches the badges API verbatim.
- A user who logs in, generates, then logs out and back in still sees the same badge image (state comes from our DB).
- Upstream 429 does not consume a generation slot.
- Mission Log tile is hidden for prework-only users (`10xdevs-3-prework` grant without `10xdevs-3`).

## Performance Considerations

The page renders synchronously from `buildMissionLogState`, which is one Supabase read (`select * from mission_log_generations where user_id = ...`) and a synchronous computation over a 25-entry catalog — comfortably under typical SSR budgets. Generate is one Supabase read (precheck), one external POST (~hundreds of ms — badges API uses Replicate), and one Supabase upsert. No batching is needed at expected cohort sizes (10xDevs 3.0 students × 25 lessons × 2 lifetime). No precomputation, no cache.

## Migration Notes

The new `mission_log_generations` table is additive; no backfill is required. Schema is forward-compatible: when the main 10xDevs 3.0 course launches and reuses the gating module, the same table works for it (the `lesson_id` column is opaque text).

## References

- Frame brief: not produced for this change.
- Research: in-line above (no `research.md` was created).
- Badges API contract: `https://badges.10xdevs.pl/api-docs` (resolved during planning).
- Existing pattern for external HTTPS calls from the Worker: `src/server/circle/membershipApi.ts:26-39`.
- Existing Supabase migration convention: `supabase/migrations/20260428000000_lesson_progress.sql`.
- Existing access guard pattern: `src/server/verifyAuth.ts:11-78`, `src/models/CollectionMappings.ts:51`.
- Existing courses-index card layout: `src/components/CourseList.astro:141-176`.
- 10xDevs 3.0 toolkit membership module: `src/server/toolkit/tenXDevs3Membership.ts`.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Foundation — course gating + lesson catalog + badge map

#### Automated

- [x] 1.1 Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit` — 614515d0
- [x] 1.2 Unit tests pass: `npx vitest run src/server/courseGating src/models/missionLog` — 614515d0
- [x] 1.3 Lint passes: `npm run lint` — 614515d0

#### Manual

- [x] 1.4 The 25 placeholder lesson titles in `lessonCatalog.ts` have been replaced with the actual Polish titles (or confirmed acceptable for first ship). — 614515d0
- [x] 1.5 The five module unlock dates in `tenXDevs3.ts` have been confirmed with the course operator (correct Mondays, correct TZ). — 614515d0

### Phase 2: Server — badges proxy + quota + Mission Log API

#### Automated

- [x] 2.1 Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit` — ff1f5390
- [x] 2.2 Unit tests pass: `npx vitest run src/server/missionLog src/pages/api/mission-log` — ff1f5390
- [x] 2.3 Migration applies cleanly against a local Supabase: `supabase db reset` (in `projects/edu-platform`) — ff1f5390
- [x] 2.4 Lint passes: `npm run lint` — ff1f5390

#### Manual

- [x] 2.5 Badges API team has whitelisted `https://przeprogramowani-edu.pages.dev` (and the preview/staging origin); manual `curl -X POST -H 'Origin: https://przeprogramowani-edu.pages.dev' …/api/catalog-badge/list` returns 200. — ff1f5390
- [x] 2.6 `BADGES_API_BASE_URL` env var is present in Cloudflare Pages (or left unset to default). — ff1f5390
- [x] 2.7 `curl /api/mission-log/state` for an authenticated 10xDevs 3.0 test user returns the 5-module + 25-lesson payload. — ff1f5390
- [x] 2.8 `curl /api/mission-log/generate` against a locked module returns `403 module_locked`. — ff1f5390

### Phase 3: UI — Mission Log page + grid + courses index tile

#### Automated

- [x] 3.1 Build passes: `npm run -w projects/edu-platform build` — 9220c9ec
- [x] 3.2 Type check passes: `npm run -w projects/edu-platform exec -- tsc --noEmit` — 9220c9ec
- [x] 3.3 Lint passes: `npm run lint` — 9220c9ec
- [x] 3.4 Existing tests still pass: `npm run -w projects/edu-platform test` — 9220c9ec

#### Manual

- [x] 3.5 As a 10xDevs 3.0 user before May 18, the courses index shows the Mission Log tile, and `/10xdevs-3/mission-log` renders 5 module rows, all locked, with correct unlock dates. — 9220c9ec
- [x] 3.6 As a user without 10xDevs 3.0 access, the Mission Log tile is hidden on `/courses` and `/10xdevs-3/mission-log` redirects to `/courses`. — 9220c9ec
- [x] 3.7 With no avatar, clicking Generate opens the Avatar Required modal; round-trip through `/profile?next=...` returns to the Mission Log page on save. — 9220c9ec
- [x] 3.8 With an avatar and an unlocked module, clicking Generate renders a real badge image; a second click succeeds; a third is rejected by the server with `429 quota_exhausted`. — 9220c9ec
- [x] 3.9 A direct `curl` against `/api/mission-log/generate` for a locked module returns `403 module_locked` even when the avatar is present. — 9220c9ec
- [x] 3.10 Page reload preserves rendered badges and per-lesson counters. — 9220c9ec
- [x] 3.11 On mobile (375px) the grid is readable and tappable. — 9220c9ec
