# User Profile Page Implementation Plan

## Overview

Add a `/profile` page where authenticated users can view their email and edit `first_name`, `last_name`, and an avatar image stored in Supabase. Unify the duplicated landing-page chrome (`/courses` inline header and `ExternalCourseHeader.astro`) into one shared `<AccountStrip>` Astro component that also provides the avatar entry point linking to the new page. Avatars live in a new public Supabase Storage bucket (`avatars`). Pre-fill profile fields on first-time OAuth signup using data Google already returns and one extra GitHub API call — never overwriting existing values on subsequent logins.

## Current State Analysis

- `public.profiles` has `id, email, created_at, last_login, newsletter_optin` (`supabase/migrations/20260303000000_initial_schema.sql:1-7`, `supabase/migrations/20260505000000_profiles_newsletter_optin.sql`). No name or avatar fields exist.
- `userService.ts:5-76` exposes `upsertUser(email, env, newsletterOptIn?)` and `getUserIdByEmail(email, env)`. No profile-read or profile-update methods exist.
- JWT contains only `email` (`src/server/auth.ts:28-59`). Pages call `verifyAuth(Astro)` which returns `{ isAuthenticated, email, purchases }` (`src/server/verifyAuth.ts:10-59`). External pages use `verifyExternalAuth` (`src/server/externalAuth.ts:27-117`).
- `/courses` renders an inline header in `src/pages/courses.astro:21-30` (logo + email text + logout icon). `/external/[courseId]/index.astro` uses `src/components/external/ExternalCourseHeader.astro:1-42` (logo + course name + email, **no logout**). These two surfaces are duplicated and inconsistent.
- `ContentTopBar.svelte` (lesson chrome) is already shared between regular and external lesson pages and handles only lesson navigation — out of scope here.
- Supabase Storage is enabled in `supabase/config.toml:109-127` (50MB limit, S3 protocol on) but **no buckets are configured** and no `.storage` calls exist in the worker. All Supabase access goes through the service-role key client (`src/server/supabase/client.ts`); RLS is enabled but bypassed.
- Form templates: `src/components/SignupForm.svelte` for state/error/success patterns, `src/pages/api/lesson-progress.ts:80-135` for protected POST endpoints with manual validation. No Zod, no existing avatar-upload UI in this project.
- Avatar binary upload pattern that we'll borrow: `projects/common/src/components/access-badge/AccessBadge.svelte:21-33` (FileReader → bytes).
- Existing migrations follow `YYYYMMDDHHMMSS_short_name.sql` naming. Latest is `20260505000000_profiles_newsletter_optin.sql`.

## Desired End State

1. Authenticated users can navigate to `/profile` from any of the three landing-style pages (`/courses`, `/external/[courseId]`, `/profile` itself) by clicking their avatar in a unified `<AccountStrip>`.
2. On `/profile` they can edit `first_name`, `last_name`, upload an avatar (PNG/JPEG/WebP, ≤2MB, square recommended via UI text), and remove an existing avatar.
3. Their avatar (or initials fallback) and greeting (`Hi, {first_name}` or email) appear in the strip on every landing page.
4. The strip on `/external/[courseId]` now also shows a logout link (new behavior, made possible by the unified token).
5. Lesson pages (`ContentTopBar`) are unchanged.

### Key Discoveries:
- JWT-only-`email` design means every authenticated request that touches profile data resolves email→userId via `getUserIdByEmail()` (`src/server/supabase/userService.ts:62-76`). `verifyAuth` already does this implicitly when fetching grants — extending its return shape to include profile fields is a natural fit.
- Service-role access bypasses RLS, so we can ignore Storage RLS policies and just gate uploads through the worker (`src/server/supabase/client.ts:1-7`).
- The token cookie is unified across `/external/*` and regular routes (per `CLAUDE.md`), so `/api/logout` already works for external users — adding a logout link to the external strip is purely a UI/UX addition.
- Existing migrations don't manipulate `storage.buckets`; this will be the first migration that does. `storage.buckets` is the canonical Supabase pattern for declaring buckets via SQL.

## What We're NOT Doing

- **Lesson chrome (`ContentTopBar.svelte`).** No avatar in the lesson topbar; identity stays on landing pages.
- **Avatar cropping UI.** Form UI text suggests a square image; we don't render a cropper or resize on the client.
- **Server-side image processing.** No format conversion, no resizing, no thumbnail generation. We accept what the user uploads (within size/MIME limits) and serve it as-is.
- **Required fields / backfill of existing users' names.** All new fields are nullable. Existing users keep working with NULL names — chrome falls back to email-initial. We do not retroactively fill in names/avatars for users who already exist (Phase 5 only fires on first-time signup).
- **Proxying external avatars.** When OAuth pre-fill stores a Google/GitHub CDN URL, we don't copy the bytes into our `avatars` bucket. The URL is used as-is until the user uploads a replacement on `/profile`.
- **Overwriting user edits on subsequent OAuth logins.** Phase 5 only writes profile fields on first-time creation; the returning-user branch is untouched.
- **Storage RLS policies.** Service-role uploads only; bucket is public-read. We do not expose anon write access.
- **Email change UX.** `/profile` shows email read-only — changing email is out of scope.
- **Cropping, drag-drop, multiple avatar variants, animations on hover.**

## Implementation Approach

Bottom-up: data → server → chrome → page. Each phase produces an independently verifiable artifact (migration applies, API routes work via curl, chrome renders on existing pages, then `/profile` lights up).

For avatar storage: object key is the user's UUID with no extension (`avatars/{user_id}`). Each upload calls `upload(..., { upsert: true, contentType })` so the same path is overwritten on replacement — no orphans and no rename logic. The `avatar_url` column stores the full public URL plus a `?v={epoch_ms}` cache-buster updated on every upload. Removal calls `storage.remove([userId])` and sets `avatar_url = NULL`.

For chrome unification: `<AccountStrip>` is an Astro component (no hydration) taking `email`, `firstName?`, `lastName?`, `avatarUrl?`, `courseName?`, `showLogout` (default true). `/courses`, `/profile`, and `/external/[courseId]/index.astro` all render it. The existing `ExternalCourseHeader.astro` is deleted once nothing imports it.

For auth context: `verifyAuth` and `verifyExternalAuth` are extended to load the profile row alongside what they already do (both already resolve `userId` by email or use it). The added fields are returned in their result objects so pages don't need a separate query.

## Critical Implementation Details

- **Bucket creation in SQL must be idempotent.** Use `INSERT ... ON CONFLICT (id) DO NOTHING` against `storage.buckets`, because `supabase db reset` runs migrations in order and the bucket may already exist if a previous local run left it.
- **Avatar URL cache busting is required.** Supabase's public URL is stable per object key, so without `?v=` browsers will keep showing the previous avatar after upload. Append `?v=${Date.now()}` server-side when writing `avatar_url`.
- **`upsertUser` already creates the `auth.users` row** (`src/server/supabase/userService.ts:5-60`); we must not duplicate user creation logic. The new methods only operate on users that already exist (have logged in at least once).

## Phase 1: Migration & Storage Bucket

### Overview
Add three nullable text columns to `public.profiles` and create a public `avatars` Storage bucket with size and MIME constraints. Establishes the data layer everything else depends on.

### Changes Required:

#### 1. New migration file
**File**: `supabase/migrations/20260508000000_profiles_name_avatar.sql`
**Changes**: Add `first_name text`, `last_name text`, `avatar_url text` columns to `public.profiles`. Create the `avatars` bucket in `storage.buckets` with `public = true`, `file_size_limit = 2097152` (2MB), and `allowed_mime_types = ARRAY['image/png','image/jpeg','image/webp']`. Use `ON CONFLICT (id) DO NOTHING` for the bucket insert so re-running the migration is safe.

### Success Criteria:

#### Automated Verification:
- [x] `supabase db reset` (or `supabase start`) applies the migration without errors
- [x] `psql` query confirms `first_name`, `last_name`, `avatar_url` columns exist on `public.profiles` and are nullable
- [x] `psql` query against `storage.buckets` shows the `avatars` bucket with `public = true` and the expected size limit and MIME types

#### Manual Verification:
- [ ] Supabase Studio (http://127.0.0.1:54323) shows the `avatars` bucket under Storage and the new columns under Database → profiles
- [ ] An existing local user can still log in (no breakage from schema change)

**Implementation Note**: After Phase 1 verification, pause for confirmation before Phase 2.

---

## Phase 2: userService Extensions & API Routes

### Overview
Extend the Supabase service layer with profile read/update, avatar upload, and avatar remove. Expose three API endpoints under `/api/profile`. Manual validation only (no Zod), following `src/pages/api/lesson-progress.ts:80-135` style.

### Changes Required:

#### 1. Extend `userService.ts`
**File**: `src/server/supabase/userService.ts`
**Changes**: Add `getProfile(userId, env)` that returns `{ email, firstName, lastName, avatarUrl } | null` (selects `id, email, first_name, last_name, avatar_url` from `profiles`). Add `updateProfile(userId, env, { firstName, lastName })` that updates only those two fields. Add `uploadAvatar(userId, env, bytes, contentType)` that calls `supabase.storage.from('avatars').upload(userId, bytes, { upsert: true, contentType })`, then computes the public URL via `getPublicUrl(userId)`, appends `?v=${Date.now()}` for cache busting, writes the result to `profiles.avatar_url`, and returns the URL. Add `removeAvatar(userId, env)` that calls `storage.remove([userId])` and sets `avatar_url = NULL`. All methods throw on Supabase error with descriptive messages, matching `upsertUser`'s pattern.

#### 2. New API endpoint: update name fields
**File**: `src/pages/api/profile/index.ts` (PUT handler)
**Changes**: Verify the JWT cookie via `verifyToken` (mirror `src/pages/api/lesson-progress.ts`'s auth helper); reject 401 if missing/invalid. Resolve `userId` via `getUserIdByEmail`. Parse JSON body, manually validate `firstName` and `lastName` are either `null`/empty or strings 1–60 chars after trim. Call `updateProfile`. Return `{ firstName, lastName }` on success.

#### 3. New API endpoint: upload avatar
**File**: `src/pages/api/profile/avatar.ts` (POST handler)
**Changes**: Same auth/userId resolution as PUT. Read the request as `multipart/form-data` (Astro/Cloudflare Workers `Request.formData()`); pull the `avatar` field. Validate: it must be a `File`, `file.type` must be one of `image/png|image/jpeg|image/webp`, `file.size` must be ≤ `2 * 1024 * 1024`. Reject 400 with a clear error code (`INVALID_TYPE`, `TOO_LARGE`, `MISSING_FILE`) on failure. Call `uploadAvatar` with `await file.arrayBuffer()` and `file.type`. Return `{ avatarUrl }`.

#### 4. New API endpoint: remove avatar
**File**: `src/pages/api/profile/avatar.ts` (DELETE handler in the same file)
**Changes**: Same auth/userId resolution. Call `removeAvatar`. Return `{ avatarUrl: null }`.

### Success Criteria:

#### Automated Verification:
- [x] `npm run build` and `npm run typecheck` pass with no errors
- [x] `npm run lint` passes
- [x] New unit tests in `src/server/supabase/userService.test.ts` cover `getProfile` (existing user, missing user), `updateProfile` (round-trip), `uploadAvatar` (returns a URL containing `?v=`), `removeAvatar` (sets `avatar_url` to NULL). Use a local Supabase instance per existing test conventions.

#### Manual Verification:
- [x] `curl -X PUT /api/profile -b token=...` updates names and returns 200
- [x] `curl -X POST /api/profile/avatar -F avatar=@small.png -b token=...` returns 200 and the avatar URL is reachable in a browser
- [x] `curl -X POST /api/profile/avatar -F avatar=@big.png` (>2MB) returns 400 with `TOO_LARGE`
- [x] `curl -X DELETE /api/profile/avatar -b token=...` returns 200 and the previous URL is no longer reachable
- [x] Unauthenticated calls return 401
- [ ] Supabase Studio confirms the `avatars` bucket contains an object keyed by the user's UUID after upload, and the row is gone after delete

**Implementation Note**: Pause after Phase 2 manual verification before Phase 3.

---

## Phase 3: Shared `<AccountStrip>` & Auth Context

### Overview
Extend `verifyAuth` and `verifyExternalAuth` to include profile fields in their result. Build the unified Astro component and roll it onto `/courses` and `/external/[courseId]/index.astro`, replacing the inline header and `ExternalCourseHeader.astro` respectively. The strip click-target is the avatar circle and links to `/profile`.

### Changes Required:

#### 1. Extend `AuthResult` model
**File**: `src/models/AuthResult.ts`
**Changes**: Add optional `firstName?: string | null`, `lastName?: string | null`, `avatarUrl?: string | null` to the `AuthResult` type.

#### 2. Extend `verifyAuth`
**File**: `src/server/verifyAuth.ts`
**Changes**: After resolving `userId` via `getUserIdByEmail`, additionally call the new `getProfile(userId, env)` (or fold the columns into the existing query) and surface `firstName`/`lastName`/`avatarUrl` on the returned object. Behavior on profile-fetch error: log and return the auth result with profile fields undefined (don't fail auth on a profile read).

#### 3. Extend `verifyExternalAuth`
**File**: `src/server/externalAuth.ts`
**Changes**: Same addition — when authenticated, populate the same three optional fields in the returned shape (or in a new `profile` sub-field if cleaner; keep the shape decision consistent with `verifyAuth`'s).

#### 4. New shared component
**File**: `src/components/AccountStrip.astro`
**Changes**: Astro component, no hydration. Props: `email: string`, `firstName?: string | null`, `lastName?: string | null`, `avatarUrl?: string | null`, `courseName?: string`, `showLogout?: boolean` (default true). Renders: logo (left, links to `/courses`), optional `courseName` heading next to logo, then on the right: avatar circle (32–40px) wrapped in `<a href="/profile">` showing the image if `avatarUrl` set otherwise initials computed from `firstName`+`lastName` or first letter of email — gray bg, white text. Greeting text `Cześć, {firstName}` if `firstName` present otherwise `{email}`. Logout icon link (`/api/logout`, `LogOutIcon` from `lucide-svelte`) when `showLogout` is true. Tailwind dark theme matching `courses.astro` (`text-gray-300`, hover `text-rose-400` on logout).

#### 5. Replace `/courses` inline header
**File**: `src/pages/courses.astro`
**Changes**: Replace the inline header block at lines 21–30 with `<AccountStrip email={authResult.email!} firstName={authResult.firstName} lastName={authResult.lastName} avatarUrl={authResult.avatarUrl} />`.

#### 6. Replace external course index header
**File**: `src/pages/external/[courseId]/index.astro`
**Changes**: Replace the `<ExternalCourseHeader>` usage with `<AccountStrip email={...} firstName={...} lastName={...} avatarUrl={...} courseName={courseName} />` (logout shown — new UX). Verify nothing else imports `ExternalCourseHeader.astro`; if not, delete it in this phase.

### Success Criteria:

#### Automated Verification:
- [x] `npm run build` and `npm run typecheck` pass
- [x] `npm run lint` passes (pre-existing `any` warning in `externalAuth.ts:74` not introduced here)
- [x] Existing tests in `src/server/auth.test.ts` and any `verifyAuth` tests still pass (no contract breakage)
- [ ] Search confirms `ExternalCourseHeader` has zero remaining imports — **N/A**: still imported by `src/pages/external/[courseId]/[lessonId].astro` for the prework language-index branch (out of scope for this phase). File kept.

#### Manual Verification:
- [x] `/courses` renders with the new strip; clicking the avatar navigates to `/profile` (Phase 4 not yet built — 404 acceptable here, just confirm the link target)
- [x] `/external/[courseId]` renders the new strip with `courseName` and a logout link; logout works end-to-end
- [x] An existing user with NULL `first_name` shows the email-initial fallback in the avatar circle and `{email}` in the greeting
- [ ] After Phase 4 lands and a user uploads an avatar, returning to `/courses` shows the new image (not the initial fallback) on next page load
- [ ] No layout regressions on mobile widths (320px, 375px, 768px)

**Implementation Note**: Pause for visual review before Phase 4.

---

## Phase 4: `/profile` Page & `ProfileForm.svelte`

### Overview
Ship the actual page. Astro shell renders `<AccountStrip>` plus a Svelte form island. Form provides name editing and avatar upload/remove with inline feedback.

### Changes Required:

#### 1. New page
**File**: `src/pages/profile.astro`
**Changes**: Verify auth via `verifyAuth(Astro)`; redirect to `/login` if not authenticated. Render `BaseLayout` + `<AccountStrip>` + `<ProfileForm client:load email={...} firstName={...} lastName={...} avatarUrl={...} />`. Page heading: "Profil".

#### 2. New Svelte form
**File**: `src/components/ProfileForm.svelte`
**Changes**: Svelte 5 runes. Props: `email`, `firstName`, `lastName`, `avatarUrl`. Local `$state` for editable fields, error, success, loading. Layout: read-only email row at top; two text inputs for first/last name (1–60 chars, optional); avatar section with current avatar preview (or initials fallback), a "Wybierz zdjęcie" button (opens hidden `<input type="file" accept="image/png,image/jpeg,image/webp">`), and a "Usuń zdjęcie" button (visible only when an avatar exists). UI text below the file picker: "Zalecane: kwadratowy obraz, max 2MB". On name save: `fetch('/api/profile', { method: 'PUT', body: JSON.stringify(...) })`, show inline success/error. On file pick: client-side check size and type; build `FormData`, `fetch('/api/profile/avatar', { method: 'POST', body: formData })`, update local `avatarUrl` from response. On remove click: `fetch('/api/profile/avatar', { method: 'DELETE' })`, clear local `avatarUrl`. Style: mirror `src/components/SignupForm.svelte` (input classes, indigo-600 buttons, `text-red-500`/`text-green-500` for messages). No captcha (authenticated form).

### Success Criteria:

#### Automated Verification:
- [x] `npm run build` succeeds
- [x] `npm run test` passes (no test regressions; 2 pre-existing failures in `tests/api/external/auth.test.ts` and `tests/e2e/external-*.spec.ts` are unrelated to Phase 4)
- [x] Lint and typecheck pass (`astro check` clean — 0 errors, 0 warnings)
- [x] Integration tests of `/api/profile` PUT and `/api/profile/avatar` POST/DELETE validation rules added in `tests/api/profile.test.ts` (14 tests covering auth, validation, success paths)

#### Manual Verification:
- [ ] Logging in and visiting `/profile` shows the form with the user's email read-only
- [ ] Saving first/last name persists across reload and is reflected in the strip's greeting on `/courses`
- [ ] Uploading a 1MB JPEG shows the new avatar in both `/profile` preview and `/courses` strip after navigating
- [ ] Uploading a 3MB file shows a clear inline error (size limit)
- [ ] Uploading a `.gif` shows a clear inline error (type)
- [ ] Removing the avatar restores the initials fallback everywhere on next page load
- [ ] Existing users with NULL names can save successfully and the form does not nag them
- [ ] On `/external/[courseId]`, the avatar in the strip also reflects the uploaded image

---

## Phase 5: Pre-fill Profile from OAuth Signup

### Overview
Capture name and avatar data that the existing OAuth callbacks already receive (Google) or can fetch with one extra call (GitHub) and use it to pre-fill `first_name`, `last_name`, `avatar_url` on **first-time user creation only**. Returning users and users whose profile was edited via `/profile` are never touched. Magic-link signup (`/verify`) gets no pre-fill — those users start with NULLs.

### Changes Required:

#### 1. Extend `upsertUser` signature
**File**: `src/server/supabase/userService.ts`
**Changes**: Add a third options-style argument (or extend the existing `newsletterOptIn` arg into an options object — `{ newsletterOptIn?, firstName?, lastName?, avatarUrl? }`) so callers can pass profile defaults. The function applies these **only on the first-time-creation branch** (the `else` block at lines 33–58 in the current file). On the returning-user branch (the `if (existing?.id)` branch) it must continue to update only `last_login` and never overwrite existing profile fields. New columns get inserted alongside `id, email, last_login, newsletter_optin` in the new-profile insert.

#### 2. Google callback passes name + avatar through
**File**: `src/pages/api/auth/google/callback.ts`
**Changes**: At the call site for `upsertUser` (around line 125), pass `given_name` → `firstName`, `family_name` → `lastName`, `picture` → `avatarUrl` from the already-parsed `GoogleUserInfo` object. The interface at lines 28–37 already declares these fields.

#### 3. GitHub callback fetches user profile and passes name + avatar through
**File**: `src/pages/api/auth/github/callback.ts`
**Changes**: After the existing `/user/emails` fetch (around line 111), add a `fetch('https://api.github.com/user', { headers: { Authorization: 'Bearer ...', 'User-Agent': '...' } })` call to retrieve `name` and `avatar_url`. Add a new `GitHubUserResponse` interface alongside the existing ones at lines 18–29. Split the GitHub `name` field on the first space into `firstName` / `lastName` (fall back: whole string → `firstName`, `lastName` NULL). Pass these to `upsertUser` at the call site (around line 160). Failure of the `/user` fetch must not block signup — log and continue with NULLs.

### Success Criteria:

#### Automated Verification:
- [x] `npm run build` and `npm run typecheck` pass (`astro check`: 0 errors / 0 warnings)
- [x] `npm run lint` passes for touched files (pre-existing repo-wide errors in `utils/` are unrelated)
- [x] Existing OAuth callback tests still pass; new test covers `upsertUser` with `firstName`/`lastName`/`avatarUrl` options on first-time creation
- [x] New test confirms returning-user branch of `upsertUser` does not overwrite existing `first_name`/`last_name`/`avatar_url` even when options are passed

#### Manual Verification:
- [ ] Fresh Google signup pre-fills the avatar circle on `/courses` and the name fields on `/profile` from Google's data
- [ ] Fresh GitHub signup pre-fills name (split on first space) and avatar from GitHub
- [ ] Existing users (created before Phase 1) who log back in via Google/GitHub do NOT have their NULL names overwritten — their fields stay NULL until they edit on `/profile`
- [ ] A user who pre-filled via Google then edits names + uploads a new avatar on `/profile`, then logs out and back in via Google, does NOT have their edits clobbered

**Implementation Note**: Pause for manual confirmation before considering the feature done.

---

## Testing Strategy

### Unit Tests:
- `userService.test.ts` — `getProfile` (existing/missing user), `updateProfile` (round-trip including NULL inputs), `uploadAvatar` (URL contains `?v=` cache-buster, row updated), `removeAvatar` (row NULL'd, object removed)
- API route tests — validation rules: name length, MIME type, file size, missing file, missing/invalid token returns 401

### Integration Tests:
- End-to-end: log in → visit `/profile` → save names → reload → names persist → upload avatar → strip on `/courses` shows new image → remove avatar → fallback shows
- External flow: log in via external course → visit `/external/[courseId]` → strip shows greeting + logout → logout works

### Manual Testing Steps:
1. `supabase start && npm run dev`, log in as a fresh user
2. Visit `/profile`, leave names empty, save — confirm success message and that nothing broke (NULL allowed)
3. Set first/last name, save, reload — values persist; `/courses` greeting shows "Cześć, {firstName}"
4. Upload a 200KB JPEG — preview updates immediately; navigate to `/courses` and confirm strip avatar updated
5. Try uploading a 5MB photo — inline error
6. Try uploading a `.svg` — inline error
7. Click "Usuń zdjęcie" — initials fallback returns; refresh confirms persistence
8. Log out, log in as a user with existing data (NULL names) — strip falls back to email; visiting `/profile` works without errors
9. On a mobile viewport (375px), confirm strip doesn't overflow with a long email or `firstName`

## Performance Considerations

- Public avatar URLs are served by Supabase Storage's CDN; no additional caching layer in the worker.
- `verifyAuth` adds one column-set to its existing profile query — no extra round-trip if folded into the existing select.
- Form upload posts a 2MB max payload directly to the worker; Cloudflare Workers handle this comfortably.

## Migration Notes

- Existing users keep working: all new columns are nullable; their `avatar_url` stays NULL until they upload.
- The `avatars` bucket is created idempotently — re-running the migration on a database where the bucket already exists is a no-op.
- No data backfill needed.
- Rollback: drop the three columns and the bucket entry. Avatar files in Storage become orphaned but harmless if the bucket is later removed.

## References

- Codebase patterns: `src/components/SignupForm.svelte`, `src/pages/api/lesson-progress.ts:80-135`, `src/server/supabase/userService.ts:5-76`, `src/server/verifyAuth.ts:10-59`
- Migration history: `supabase/migrations/`
- Topbar inventory: `src/pages/courses.astro:21-30`, `src/components/external/ExternalCourseHeader.astro:1-42`, `src/components/ContentTopBar.svelte`
- Project README: `projects/edu-platform/CLAUDE.md` (auth flow, KV namespaces, Supabase schema)

<!-- PLAN COMPLETED: 2026-05-08 -->
