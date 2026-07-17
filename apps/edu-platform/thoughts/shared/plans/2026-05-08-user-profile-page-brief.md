# User Profile Page — Plan Brief

> Full plan: `thoughts/shared/plans/2026-05-08-user-profile-page.md`

## What & Why

Add a `/profile` page where authenticated users can view their email (read-only) and edit their first name, last name, and avatar. The same chrome that lets them get there — a unified `<AccountStrip>` — also replaces two duplicated landing-page headers (`/courses` inline + `ExternalCourseHeader.astro`) so identity is consistent across regular and external course pages. New OAuth signups (Google/GitHub) get their profile pre-filled from data the providers already return.

## Starting Point

`public.profiles` has just `email`, `last_login`, and `newsletter_optin`. Two separate landing-page headers exist today: `/courses` shows email + logout inline; `/external/[courseId]` uses a different Astro component that shows email but no logout. Lesson chrome (`ContentTopBar.svelte`) is already shared and is unchanged here. Supabase Storage is enabled but no buckets are configured — this will be the first.

## Desired End State

A user can click their avatar in the topbar from `/courses`, `/profile`, or `/external/[courseId]`, land on `/profile`, set their name and upload a square-ish image (≤2MB), and see their avatar and "Cześć, {firstName}" greeting reflected on every landing page after navigating. External course users also gain a logout link they didn't have before.

## Key Decisions Made

| Decision                    | Choice                                                                                | Why                                                                            | Source |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------ |
| Avatar storage              | New public Supabase Storage bucket `avatars`                                          | Keeps profile data + binaries in one platform; storage is enabled in config    | Plan   |
| Bucket constraints          | 2MB limit, PNG/JPEG/WebP only                                                         | Bounds cost; matches user direction                                            | Plan   |
| Object key                  | `avatars/{user_id}` (no extension, upsert on replace)                                 | One stable path; no orphans; cache-busted via `?v=` query                      | Plan   |
| Topbar strategy             | Extract shared `<AccountStrip>` Astro component                                       | Replaces both inline `/courses` header and `ExternalCourseHeader`              | Plan   |
| Strip reach                 | `/courses`, `/profile`, `/external/[courseId]` index — not lesson `ContentTopBar`     | Identity belongs on landing pages; lesson chrome stays focused on nav          | Plan   |
| External logout             | Add it (new behavior) via the unified strip                                           | Token cookie is already unified across regular and external routes             | Plan   |
| Avatar entry-point UI       | Avatar circle with initials fallback, links to `/profile`                             | Standard SaaS pattern; works with NULL name (falls back to email-initial)      | Plan   |
| Upload UX                   | Click-to-upload, 2MB max, UI text suggests square                                     | Simple; no cropper or client-side resize                                       | Plan   |
| Validation                  | All new fields optional/nullable; 1–60 chars for names; manual validation, no Zod     | Matches existing users without nagging; matches project conventions            | Plan   |
| Display elsewhere + removal | Strip greets with first name when set, else email; explicit "Usuń zdjęcie" button    | No nags for existing users; clean removal that also deletes the Storage object | Plan   |
| Auth context plumbing       | Extend `verifyAuth` and `verifyExternalAuth` to return `firstName/lastName/avatarUrl` | Both already resolve `userId` — folding profile fields in avoids extra queries | Plan   |
| OAuth signup pre-fill       | Use Google `given_name`/`family_name`/`picture` and GitHub `/user` (split name + `avatar_url`) to populate first-time profiles only | Data is already returned by Google; one extra GitHub API call is cheap; never overwrites later edits | Plan |
| Avatar source on signup     | Store the external Google/GitHub CDN URL as-is — no proxy copy into Storage         | Cheap pre-fill; user replaces it via /profile if they want a permanent owned copy | Plan   |

## Scope

**In scope:**
- Migration: 3 nullable columns on `profiles` + create `avatars` Storage bucket
- `userService` extensions: `getProfile`, `updateProfile`, `uploadAvatar`, `removeAvatar`
- API routes: `PUT /api/profile`, `POST /api/profile/avatar`, `DELETE /api/profile/avatar`
- Shared `<AccountStrip>` Astro component
- Replace inline header on `/courses` and replace `ExternalCourseHeader.astro` usage on `/external/[courseId]/index.astro` (with logout)
- New `/profile` page + `ProfileForm.svelte`
- Extend `verifyAuth` / `verifyExternalAuth` to surface profile fields
- Extend `upsertUser` to accept first-time `firstName`/`lastName`/`avatarUrl`
- Wire Google + GitHub OAuth callbacks to pass through provider-returned profile data on first-time signup

**Out of scope:**
- Avatar in `ContentTopBar.svelte` (lesson chrome)
- Cropping UI, client-side resize, server-side image processing
- Required name fields or backfill of existing users
- Email change UX
- Storage RLS policies (uploads always go through service-role worker)

## Architecture / Approach

```
/profile (Astro)        ──┐
/courses (Astro)        ──┼─→  <AccountStrip>  ──→  links to /profile
/external/[id] (Astro)  ──┘                          (avatar | initials | email-initial)

ProfileForm.svelte (client:load)
   ├── PUT  /api/profile          → userService.updateProfile      → public.profiles (first_name, last_name)
   ├── POST /api/profile/avatar   → userService.uploadAvatar       → storage:avatars/{user_id} + profiles.avatar_url
   └── DEL  /api/profile/avatar   → userService.removeAvatar       → storage.remove + profiles.avatar_url = NULL

verifyAuth / verifyExternalAuth   → loads profile fields alongside grants → AccountStrip props
```

Auth model is unchanged: JWT carries email only; the worker resolves `userId` via `getUserIdByEmail()` and uses the service-role Supabase client for all reads and writes. No browser→Supabase calls.

## Phases at a Glance

| Phase                               | What it delivers                                                                       | Key risk                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. Migration & Storage bucket       | New columns on `profiles`; `avatars` bucket with 2MB / MIME constraints                | First migration to touch `storage.buckets` — must be idempotent     |
| 2. userService + API routes         | 4 service methods, 3 API endpoints with manual validation                              | Multipart parsing in Cloudflare Workers needs end-to-end curl check |
| 3. `<AccountStrip>` + auth context  | Unified chrome on `/courses` and `/external/[courseId]`; `verifyAuth` returns profile  | External users gain a logout link — behavior change worth flagging  |
| 4. `/profile` page + `ProfileForm`  | Editable name + avatar upload/remove with inline feedback                              | Avatar cache-busting (`?v=`) must work on first load post-upload    |
| 5. OAuth signup pre-fill            | Google + GitHub callbacks pre-populate `first_name`/`last_name`/`avatar_url` on first-time creation | Must NOT overwrite values for returning users or after user edits |

**Prerequisites:** Local Supabase running (`supabase start`), `.env.local` populated with `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`, an existing test user.
**Estimated effort:** ~2–3 sessions: phases 1+2 together, then 3+4 together, then 5 as a small standalone follow-up.

## Open Risks & Assumptions

- Cloudflare Workers' `Request.formData()` handles 2MB multipart bodies smoothly — verified by Phase 2 manual curl tests.
- Adding logout to the external strip is a desired UX change; if external users complain about accidental logouts, we can hide it via the `showLogout={false}` prop without touching the component.
- Cache-busting via `?v={epoch_ms}` is sufficient — no S3-style content-addressed naming. Acceptable because avatars are per-user and rare.

## Success Criteria (Summary)

- A user with no profile data who logs in sees the strip with email-initial fallback and is not blocked anywhere
- A user who saves names and uploads an avatar on `/profile` sees those reflected in the strip on `/courses` and `/external/[courseId]` after navigating
- Existing tests pass; new tests cover service methods and API validation
