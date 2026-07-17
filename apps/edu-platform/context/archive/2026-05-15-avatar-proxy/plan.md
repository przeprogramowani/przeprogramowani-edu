# Avatar Proxy Implementation Plan

## Overview

Replace direct Supabase Storage public URLs with a backend proxy endpoint so the storage origin is never exposed to the browser. After this change, every avatar `<img>` source is a URL on our own domain (`/api/avatar/<userId>?v=<ts>`); the `avatars` bucket is made private and reachable only via the service-role admin client running inside the proxy.

## Current State Analysis

- Avatars upload via `POST /api/profile/avatar` (`src/pages/api/profile/avatar.ts:30-62`) → `uploadAvatar()` in `src/server/supabase/userService.ts:161-187`. The function stores bytes at storage key `<userId>` in the `avatars` bucket (PNG/JPEG/WebP, ≤2 MB, `upsert: true`), then writes the resulting `https://<project>.supabase.co/storage/v1/object/public/avatars/<userId>?v=<ts>` URL into `profiles.avatar_url`.
- The `avatars` bucket is public (`supabase/migrations/20260508000000_profiles_name_avatar.sql:9-17`, `public = true`), so the same URL can be fetched by anyone who knows it. No RLS policies on storage objects.
- `profiles.avatar_url` is `text`, nullable, no constraints (`supabase/migrations/20260508000000_profiles_name_avatar.sql:5`).
- Browser-rendering consumers: `src/components/ProfileForm.svelte:184` (profile page), `src/components/AccountStrip.astro:57` (header strip on `/profile`, `/courses`, `/10xdevs-3/mission-log`, `/external/*` pages), and indirectly `MissionLogGrid.svelte:14,22` via the state delivered by `/api/mission-log/state`.
- External consumer: `/api/mission-log/generate` (`src/pages/api/mission-log/generate.ts:92`) forwards `auth.user.avatarUrl` to `https://badges.10xdevs.pl` as `imageUrl`. This is the call that breaks in local dev today (it forwards `http://127.0.0.1:54321/...`).
- Production has **4 rows** out of 1331 profiles with `avatar_url` set; all four follow the canonical `…/storage/v1/object/public/avatars/<uuid>?v=<ts>` shape. Migration cost is trivial.
- Supabase JS SDK v2.98.0 supports `supabase.storage.from(bucket).download(key)` returning a `Blob` — usable directly from a Cloudflare Worker route.

## Desired End State

- All browser `<img>` tags rendering an avatar point at `https://platforma.przeprogramowani.pl/api/avatar/<userId>?v=<ts>` (or the equivalent on the current `SITE_URL`).
- `profiles.avatar_url` holds an absolute proxy URL; the Supabase project URL never appears in stored data.
- The `avatars` bucket is private; `supabase.storage.from('avatars').getPublicUrl(...)` no longer returns a fetchable URL. The proxy is the only access path.
- The mission-log badge generation continues to work in production because the proxy URL is publicly reachable.
- Failures (missing object, upstream 5xx) return HTTP `404`/`502` with no body; the two render sites fall back to user initials via an `onerror` handler.

### Key Discoveries

- Object key in storage is the bare `userId` UUID with no extension (`src/server/supabase/userService.ts:170`); content type is set on upload via the `contentType` option but isn't stored anywhere queryable. The proxy must trust the Blob's `type` returned by `.download()` for the response `Content-Type` header.
- `getSupabaseAdmin()` (`src/server/supabase/client.ts:1-7`) is the standard way to obtain a service-role client inside an API route and is already imported by every route that touches storage today.
- `env.SITE_URL` is set in `wrangler.toml` (`https://platforma.przeprogramowani.pl`) and in `.env` for dev (`http://localhost:3000` / `http://localhost:3001`). It's already passed via `context.locals.runtime.env.SITE_URL` to existing routes.
- No caches, KV bindings, or client-side stores hold avatar URLs — the only persistence is `profiles.avatar_url`. Cookies/sessions don't carry the URL.
- The badges API request shape (`src/server/badges/badgesApiClient.ts:109-121`) only accepts an absolute `imageUrl`, which is why the DB column needs to store an absolute URL (chosen over relative path).

## What We're NOT Doing

- Not introducing signed URLs or per-request tokens. The proxy is public-by-design, matching the current threat model (knowing a userId is enough to fetch the avatar).
- Not adding a Cloudflare edge cache via `caches.default`. Browser-level immutable caching is sufficient at current scale (≤ a few hundred active avatars expected); revisit if Supabase egress becomes a cost driver.
- Not changing the upload contract (`POST /api/profile/avatar` still accepts multipart form-data with `avatar`, returns `{ avatarUrl }`).
- Not changing `profiles.avatar_url` column type or renaming it. We stay with `text`, just write a different string into it.
- Not adding a default-avatar PNG. Onerror in the two render sites falls back to existing initials, which is already the empty-state pattern.
- Not migrating local-dev rows. If a developer has a `127.0.0.1:54321/...` row in their local DB, the next upload overwrites it; no special handling.

## Implementation Approach

Three phases inside a single PR / single release:

1. Add the proxy route + a small URL-builder helper. Bucket and DB are untouched — the route is dark code that's verifiable on its own (hit it directly against a userId whose avatar already exists).
2. Switch `uploadAvatar()` to write absolute proxy URLs into `profiles.avatar_url`; add `onerror` initials fallback to the two render sites. Bucket still public, so old direct URLs (if cached in any browser) keep resolving.
3. Ship a Supabase migration that (a) backfills the 4 existing rows from Supabase URLs to proxy URLs and (b) flips `storage.buckets.public = false` for `avatars`. This is the cutover.

Phases 1+2 land in code together; the migration is applied **after** the Cloudflare deploy is verified, so a deploy failure doesn't strand the 4 affected users with broken avatars.

## Critical Implementation Details

- **Migration ordering**: The Supabase migration in Phase 3 must run *after* the deploy is live. If the migration applies first and the deploy fails or is rolled back, the 4 affected users see broken avatars (DB points at proxy paths, but the proxy route doesn't exist). Operationally: deploy → smoke-test the proxy against an existing avatar → then `supabase db push`.
- **Content-Type fidelity**: `supabase.storage.from('avatars').download(userId)` returns a `Blob` with `.type` reflecting the originally-uploaded MIME type. The proxy uses that value verbatim on the response. If `.type` comes back empty (older Supabase clients), fall back to `application/octet-stream` — browsers still render via the `<img>` element if the bytes are valid.
- **userId path validation**: The route accepts `[userId]` as a path param. Validate it matches the UUID v4 regex `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i` before calling Supabase; reject with 400 otherwise. Prevents path-traversal-like inputs reaching the storage SDK.

## Phase 1: Proxy route + URL helper

### Overview

Add `GET /api/avatar/[userId]` that downloads the avatar via the admin Supabase client and streams the bytes back. Add a `buildAvatarUrl(userId, env)` helper that constructs the absolute proxy URL the rest of the code will write into the DB. No call sites are wired through yet.

### Changes Required:

#### 1. New proxy route

**File**: `src/pages/api/avatar/[userId].ts` (new)

**Intent**: Public `GET` endpoint that streams a user's avatar bytes from the (currently public, later private) `avatars` Supabase bucket. No auth; same accessibility as the current Supabase public URL.

**Contract**:
- Route param `userId: string`, validated against UUID regex; reject with `400` on mismatch.
- Calls `getSupabaseAdmin(env).storage.from('avatars').download(userId)`.
- On success: `200` with `Content-Type` taken from `blob.type` (fallback `application/octet-stream`), `Cache-Control: public, max-age=31536000, immutable`, body is the Blob stream.
- On storage `Object not found` (or equivalent error code from the SDK): `404` with empty body.
- On any other error: `502` with empty body; log via `console.error('[api/avatar GET] download failed', { userId, err })`.

#### 2. Avatar URL helper

**File**: `src/server/supabase/userService.ts`

**Intent**: Centralize the rule "given a userId and a version timestamp, here is the absolute URL clients should use". Used by `uploadAvatar()` (Phase 2) and is the single place that knows the route shape.

**Contract**: New exported function `buildAvatarUrl(userId: string, version: number, siteUrl: string): string` returning `${siteUrl}/api/avatar/${userId}?v=${version}`. No trailing slash handling needed beyond `siteUrl`'s own; document that callers pass `env.SITE_URL` directly.

#### 3. Route smoke test

**File**: `src/pages/api/avatar/[userId].test.ts` (new)

**Intent**: Verify the four response shapes (200 with correct headers, 400 on bad UUID, 404 on missing object, 502 on download error) by mocking `getSupabaseAdmin`. Mirror the mocking style already used in `src/server/supabase/userService.test.ts`.

**Contract**: Vitest suite with one test per case. No real network calls.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test -- src/pages/api/avatar`
- Type checking passes: `npm run build` (project uses `astro build` for typecheck via `astro check`)
- Linting passes: `npm run lint`

#### Manual Verification:

- With dev server running and a logged-in user that has an avatar in local Supabase, `curl -i http://localhost:3000/api/avatar/<their-userId>` returns `200`, `Content-Type: image/*`, `Cache-Control: public, max-age=31536000, immutable`, and a valid image payload.
- `curl -i http://localhost:3000/api/avatar/00000000-0000-0000-0000-000000000000` returns `404` with empty body.
- `curl -i http://localhost:3000/api/avatar/not-a-uuid` returns `400`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Switch writers + add client fallback

### Overview

`uploadAvatar()` now writes the absolute proxy URL into `profiles.avatar_url` instead of the Supabase URL. Adds graceful `onerror` fallback to the two `<img>` sites so a 404 from the proxy degrades to initials instead of a broken-image icon. Bucket remains public so any cached old URLs in user browsers still resolve until Phase 3.

### Changes Required:

#### 1. Switch upload to write proxy URL

**File**: `src/server/supabase/userService.ts`

**Intent**: After successfully uploading bytes to storage, write the absolute proxy URL — not the Supabase public URL — into `profiles.avatar_url`. The downstream contract (function returns a string suitable for direct use as an `<img src>` and as `imageUrl` to the badges API) is unchanged.

**Contract**:
- `uploadAvatar(userId, env, bytes, contentType)` no longer calls `supabase.storage.from(AVATAR_BUCKET).getPublicUrl(userId)`. Instead it calls `buildAvatarUrl(userId, Date.now(), env.SITE_URL)`.
- Function signature now requires `env.SITE_URL` to be present on the passed `env` object. `SupabaseEnv` type extends to `SiteEnv & SupabaseEnv` for this function (or the function gets a narrower env param that includes `SITE_URL`).
- The `?v=` value is `Date.now()` (same cache-busting semantics as today).
- Return value remains the same shape (`string`), so `POST /api/profile/avatar` callers don't change.

#### 2. Update `uploadAvatar` tests

**File**: `src/server/supabase/userService.test.ts`

**Intent**: Assertions that previously checked for a Supabase public URL substring now check for the proxy URL shape.

**Contract**: Update existing `uploadAvatar` test cases to assert the returned string matches `/^https?:\/\/[^/]+\/api\/avatar\/<userId>\?v=\d+$/` and that the same value is persisted to `profiles.avatar_url`. Pass `SITE_URL: 'https://example.test'` in the mocked env. No other test files need touching.

#### 3. `onerror` fallback in render sites

**File**: `src/components/AccountStrip.astro`

**Intent**: If the proxy returns 404 (object missing) or 502 (upstream down), the `<img>` should silently disappear and the existing initials `<span>` should appear in its place. Today there is no fallback path — a broken `<img>` would just show the browser's broken-image icon.

**Contract**: Wrap the existing `{avatarUrl ? <img …/> : <span>{initials}</span>}` ternary with state that toggles to initials if the image fails. Astro is SSR-only so the simplest pattern is an inline `<script>` that listens for `error` on the avatar image and toggles a `data-fallback` attribute on the parent — or, simpler still, attach `onerror="this.style.display='none'; this.parentElement.querySelector('[data-initials]').style.display='inline-flex'"` directly on the `<img>`. Either pattern is acceptable; pick whichever fits existing conventions in the file. The hidden initials `<span>` must exist alongside the `<img>` so it can be revealed.

**File**: `src/components/ProfileForm.svelte`

**Intent**: Same idea on the larger profile-page avatar (line 184). Svelte's reactive state makes this cleaner than Astro: introduce a `let avatarFailed = $state(false)` and switch the conditional from `{#if avatarUrl}` to `{#if avatarUrl && !avatarFailed}`. Set `avatarFailed = true` on the `<img>`'s `on:error`. Reset `avatarFailed = false` whenever `avatarUrl` is reassigned (after a successful re-upload).

**Contract**: New state variable; modified condition on the `{#if}`; new `on:error` handler on the `<img>`; reset logic in the upload response handler at `src/components/ProfileForm.svelte:123`.

#### 4. Badges API call — confirm no change needed

**File**: `src/pages/api/mission-log/generate.ts`

**Intent**: Document (in code comment or commit message) that this site continues to forward `auth.user.avatarUrl` verbatim because the column now holds an absolute proxy URL. No code change.

**Contract**: No code change in Phase 2. After Phase 3 lands, the absolute proxy URL reaches the badges API and is publicly fetchable. (Local dev still won't work with the real badges API for the same reason it doesn't today — known constraint.)

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- `userService.test.ts` updated assertions pass
- Type checking passes: `npm run build`
- Linting passes: `npm run lint`

#### Manual Verification:

- Local dev: upload an avatar via `/profile`; verify the stored value in `profiles.avatar_url` is `http://localhost:<port>/api/avatar/<userId>?v=<ts>` (check via `supabase db query --local`).
- The avatar renders correctly on `/profile`, `/courses` (header strip), and `/10xdevs-3/mission-log`.
- Force a failure: temporarily rename the storage object, reload `/profile` — the `<img>` should silently swap to initials, no broken-image icon.
- Mission Log "Generate badge" flow: with a valid avatar and (if testing against the real badges API) a tunneled or PROD-like `SITE_URL`, the badge generates successfully.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Backfill existing rows + lock bucket private

### Overview

A single Supabase migration that rewrites the 4 production rows from the canonical Supabase URL pattern to the proxy URL pattern, then flips `storage.buckets.public = false` for the `avatars` bucket. After this lands, the Supabase storage URL is no longer reachable; the proxy is the only path.

### Changes Required:

#### 1. Migration: backfill + lock

**File**: `supabase/migrations/20260515120000_avatar_proxy.sql` (new — timestamp set at write time)

**Intent**: Atomic cutover. Both statements run in the same transaction so a failure on either rolls back the other.

**Contract**: Two SQL statements:

```sql
-- 1. Rewrite existing public Supabase URLs to absolute proxy URLs. Pattern-match the
-- canonical shape; rows that don't match (none expected, but defensive) are left alone.
update public.profiles
set avatar_url = regexp_replace(
  avatar_url,
  '^https://[^/]+/storage/v1/object/public/avatars/',
  'https://platforma.przeprogramowani.pl/api/avatar/'
)
where avatar_url ~ '^https://[^/]+/storage/v1/object/public/avatars/';

-- 2. Make the avatars bucket private — proxy is now the only access path.
update storage.buckets set public = false where id = 'avatars';
```

The PROD `SITE_URL` value (`https://platforma.przeprogramowani.pl`) is hardcoded in the migration because SQL has no env access. Local dev has no matching rows to rewrite; if a developer's local DB contains a `127.0.0.1:54321/...` row it remains as-is, but the regex won't match it either (different prefix), so it stays untouched and gets overwritten naturally on the next upload.

#### 2. Update the original bucket-creation migration's stated invariant

**File**: `supabase/migrations/20260508000000_profiles_name_avatar.sql`

**Intent**: Add a comment line above the `insert into storage.buckets` block noting that the bucket is created `public = true` here and locked down in `20260515120000_avatar_proxy.sql`, so the apparent contradiction across the two migrations is documented.

**Contract**: Two lines of SQL comment. No code change.

### Success Criteria:

#### Automated Verification:

- Migration applies cleanly on a fresh local Supabase: `supabase db reset` succeeds with both migrations present.
- After `supabase db reset`, `supabase db query --local "select public from storage.buckets where id = 'avatars'"` returns `false`.
- After `supabase db reset`, a fresh upload via `/api/profile/avatar` succeeds (bytes get to storage even with the private bucket — the service-role key bypasses RLS).
- Type checking passes: `npm run build`
- All tests pass: `npm run test`

#### Manual Verification:

- Run `supabase db push --linked` against PROD only after the new Cloudflare Pages deploy is live and the proxy route has been smoke-tested.
- Immediately after migration: `supabase db query --linked "select avatar_url from public.profiles where avatar_url is not null"` returns 4 rows, all of shape `https://platforma.przeprogramowani.pl/api/avatar/<uuid>?v=<ts>`.
- Visit `/profile`, `/courses`, `/10xdevs-3/mission-log` while logged in as one of the 4 affected accounts — avatar renders.
- Direct access to a known-existing Supabase URL (e.g. the one captured pre-migration from any of the 4 rows) now returns `400 Bad Request` (bucket not public) from Supabase, not the image. The avatar on the page still renders because it goes through the proxy.
- Trigger a Mission Log badge generation as one of the 4 affected users — the badges API receives an absolute proxy URL it can fetch; badge is generated successfully.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that PROD verification was successful.

---

## Testing Strategy

### Unit Tests:

- Proxy route: 200 happy path (correct headers + body), 400 on invalid UUID, 404 on storage object missing, 502 on transient download error.
- `uploadAvatar` (existing tests updated): asserts `profiles.avatar_url` is set to the absolute proxy URL and that the function returns the same string.
- `buildAvatarUrl` helper: straightforward string-builder test (one happy case is enough).

### Integration Tests:

- None new. The proxy is exercised end-to-end by the manual verification steps.

### Manual Testing Steps:

1. Local dev: clear the local `profiles` row's avatar, upload a fresh one, confirm the stored URL is the local proxy URL and the avatar renders across all three render sites.
2. Trigger a proxy 404 by renaming the storage object behind the user's back; confirm the initials fallback appears.
3. PROD post-deploy smoke: `curl -i https://platforma.przeprogramowani.pl/api/avatar/<known-userId>` returns the image bytes.
4. PROD post-migration: confirm the 4 affected users' avatars still render and that direct Supabase URLs no longer fetch.

## Performance Considerations

- Every avatar render is one Cloudflare Worker invocation that opens a connection to Supabase Storage. At current scale (4 active avatars, low traffic) this is well within free-tier budgets.
- `Cache-Control: public, max-age=31536000, immutable` means a given `?v=<ts>` value is fetched at most once per browser per upload. The cache-bust value changes only on re-upload.
- If traffic grows beyond a low-thousands-per-day, add a Cloudflare Cache API memoization keyed on `userId+v` in a follow-up; the route's response shape is already cache-friendly.

## Migration Notes

- The PROD `SITE_URL` value is hardcoded in the migration SQL because Supabase migrations have no env access. If the production domain ever changes, the migration's hardcoded URL is fine — only old rows are affected, and they can be rewritten with a follow-up one-off migration.
- The two-step "deploy first, then migrate" pattern is what protects the 4 existing users from a deploy failure. Document this in the PR description and the team release notes.

## References

- Avatar upload flow: `src/server/supabase/userService.ts:161-187`
- Avatar render sites: `src/components/AccountStrip.astro:55-62`, `src/components/ProfileForm.svelte:181-188`
- Badges API forwarder: `src/pages/api/mission-log/generate.ts:84-115`
- Existing bucket migration: `supabase/migrations/20260508000000_profiles_name_avatar.sql`
- Supabase admin client: `src/server/supabase/client.ts:1-7`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Proxy route + URL helper

#### Automated

- [x] 1.1 Unit tests pass: `npm run test -- src/pages/api/avatar` — a884985d
- [x] 1.2 Type checking passes: `npm run build` — a884985d
- [x] 1.3 Linting passes: `npm run lint` — a884985d

#### Manual

- [x] 1.4 `curl /api/avatar/<existing-userId>` returns 200 with correct headers and image bytes — a884985d
- [x] 1.5 `curl /api/avatar/<unknown-uuid>` returns 404 with empty body — a884985d
- [x] 1.6 `curl /api/avatar/not-a-uuid` returns 400 — a884985d

### Phase 2: Switch writers + add client fallback

#### Automated

- [x] 2.1 Unit tests pass: `npm run test` — eae6b613
- [x] 2.2 `userService.test.ts` updated assertions pass — eae6b613
- [x] 2.3 Type checking passes: `npm run build` — eae6b613
- [x] 2.4 Linting passes: `npm run lint` — eae6b613

#### Manual

- [x] 2.5 Local upload writes proxy URL into `profiles.avatar_url` — eae6b613
- [x] 2.6 Avatar renders on `/profile`, `/courses`, `/10xdevs-3/mission-log` — eae6b613
- [x] 2.7 Forced proxy 404 swaps `<img>` to initials silently — eae6b613
- [x] 2.8 Mission Log badge generation succeeds against badges API — eae6b613

### Phase 3: Backfill existing rows + lock bucket private

#### Automated

- [x] 3.1 `supabase db reset` applies both migrations cleanly — 1bbb9010
- [x] 3.2 Post-reset, `storage.buckets.public = false` for `avatars` — 1bbb9010
- [x] 3.3 Post-reset, fresh upload succeeds via the private bucket (service-role bypasses RLS)
- [x] 3.4 Type checking passes: `npm run build` — 1bbb9010
- [x] 3.5 All tests pass: `npm run test` — 1bbb9010

#### Manual

- [x] 3.6 PROD migration applied only after deploy live and proxy smoke-tested
- [x] 3.7 4 affected rows now hold absolute proxy URLs
- [x] 3.8 Avatars render in PROD for the 4 affected users
- [x] 3.9 Direct Supabase URL no longer fetchable in PROD
- [x] 3.10 Mission Log badge generation succeeds in PROD
