---
date: 2026-03-03T00:00:00+01:00
researcher: claude-sonnet-4-6
git_commit: 9e9d54bc9fb659acba097c2af3dca7c26f1d63e3
branch: master
repository: przeprogramowani-sites
topic: "Adding 10xDevs 1.0, 2.0, 3.0 courses to homepage CourseList"
tags: [research, codebase, courses, circle, supabase, access-grants, 10xdevs, course-list]
status: complete
last_updated: 2026-03-03
last_updated_by: claude-sonnet-4-6
---

# Research: Adding 10xDevs 1.0, 2.0, 3.0 to the Homepage CourseList

**Date**: 2026-03-03
**Researcher**: claude-sonnet-4-6
**Git Commit**: 9e9d54bc9fb659acba097c2af3dca7c26f1d63e3
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

We want to add three new courses — 10xDevs 1.0, 2.0, and 3.0 — to the homepage CourseList. How is access checked (Circle lookup) and what changes are needed to enable these on the homepage?

## Summary

10xDevs 1.0 and 2.0 are **fully wired in the backend** (types, slugs, Circle sync, Supabase grants) but are **not yet shown in `CourseList.astro`**. They are currently only reachable via `/external/` and `/shared/[guid]` routes. Enabling them on the homepage requires:

1. Adding course entries to `CourseList.astro` (with a 10xDevs thumbnail image)
2. Verifying `circleSyncService` already syncs grants for both courses (it does — `10xdevs-1` and `10xdevs-2`)
3. **10xDevs 3.0 does not exist yet** in any layer of the codebase — it would require new types, slugs, Circle config, content collection, and lesson HTML files.

## Detailed Findings

### Access Verification Flow

Access for authenticated users flows through:

1. **Login** (GitHub/Google OAuth callback) triggers non-blocking sync:
   `src/pages/api/auth/github/callback.ts:138-148` / same in `google/callback.ts`

2. `syncAllCircleCourses()` iterates over:
   `src/server/supabase/circleSyncService.ts:9`
   ```ts
   const CIRCLE_COURSE_IDS = ['opanuj-frontend', '10xdevs-1', '10xdevs-2'];
   ```
   → **Both 10xdevs-1 and 10xdevs-2 are already synced at login.** 10xdevs-2-en is NOT.

3. For each course, `resolveMembership()` is called:
   `src/server/circle/membershipResolver.ts:19-46`
   - Checks `CIRCLE_MEMBERS` KV cache (60-day freshness, 90-day retention)
   - Cache miss → calls Circle v1 API (`membershipApi.ts:54-75`) using `CIRCLE_BRAVE_V1_TOKEN`
   - Verifies space membership via `communityId` + `spaceId` from `externalAuthConfig.ts`

4. If active → `upsertGrant(userId, courseId, 'circle', ...)` writes to Supabase `access_grants`

5. On `/courses` page load, `verifyAuth()` reads from Supabase `access_grants`:
   `src/server/verifyAuth.ts:43-59`
   → Returns `AirtableCourse[]` (e.g. `['10XDEVS_1', '10XDEVS_2']`)

6. `CourseList.astro` receives `customerPurchases: AirtableCourse[]` and filters cards by
   `customerPurchases.includes('10XDEVS_1')` etc.

### Types Already Defined

**`AirtableCourse`** — `src/server/airtable/airtable-course.ts:1-7`
```ts
export type AirtableCourse =
  | 'OPANUJ_FRONTEND'
  | 'CURSOR_AI'
  | 'OPANUJ_TYPESCRIPT'
  | '10XDEVS_1'
  | '10XDEVS_2'
  | '10XDEVS_2_EN';
```
Note: Airtable record IDs for 10xDevs are placeholders (`notImplementedYET`). Access comes from Circle, not Airtable.

**`CourseSlug`** — `src/models/CollectionMappings.ts:4-12`
```ts
export type CourseSlug =
  | 'cursor-ai' | 'opanuj-frontend' | 'opanuj-frontend-live'
  | 'opanuj-typescript-core' | 'opanuj-typescript-react'
  | '10xdevs-1' | '10xdevs-2' | '10xdevs-2-en';
```

**PERMISSION_MAPPINGS** — `src/models/CollectionMappings.ts:36-45`
```ts
'10xdevs-1': '10XDEVS_1',
'10xdevs-2': '10XDEVS_2',
'10xdevs-2-en': '10XDEVS_2_EN',
```

### Circle Configuration

`src/server/circle/externalAuthConfig.ts:25-41`:
- `10xdevs-1`: `communityId: 1272`, `spaceId: 1905722`, `Platform.CIRCLE_BRAVE`
- `10xdevs-2`: `communityId: 1272`, `spaceId: 2166705`, `Platform.CIRCLE_BRAVE`
- No config for `10xdevs-2-en` or any 10xDevs 3.0

Both require `CIRCLE_BRAVE_V1_TOKEN` environment variable.

### Content Already Available

- `src/content/lessons10xDevs1/` — 25 HTML lessons
- `src/content/lessons10xDevs2/` — 14 HTML lessons
- `src/content/lessons10xDevs2EN/` — 2 HTML lessons (stub)
- Content collections defined in `src/content.config.ts:60-73`
- Course routes exist at `/courses/10xdevs-1` and `/courses/10xdevs-2` via `src/pages/courses/[...courseSlug]/`

### What's Missing for Homepage

**1. No 10xDevs thumbnail image:**
`src/assets/images/courses/` contains `kurs-cursor.png`, `kurs-ofe.jpg`, `kurs-ots.jpg`, `game-explorers.png` only — **no 10xDevs image**.

**2. No CourseList entries for 10xDevs:**
`src/components/CourseList.astro` does not include `10XDEVS_1`, `10XDEVS_2`, or `10XDEVS_2_EN` in the `allCourses` array.

**3. 10xDevs 3.0 does not exist:**
No CourseSlug, no AirtableCourse type, no Circle config, no content collection, no lesson files. All layers would need to be built from scratch.

## Code References

- `src/components/CourseList.astro:23-71` — allCourses array to extend
- `src/server/airtable/airtable-course.ts:1-18` — AirtableCourse type (add `'10XDEVS_3'` for 3.0)
- `src/models/CollectionMappings.ts:4-45` — CourseSlug, display names, collection + permission mappings (add `'10xdevs-3'`)
- `src/server/supabase/circleSyncService.ts:9` — CIRCLE_COURSE_IDS (add `'10xdevs-3'`)
- `src/server/circle/externalAuthConfig.ts:25-41` — Circle space config (add 10xdevs-3 block)
- `src/content.config.ts:60-73` — content collection definitions (add `lessons10xDevs3`)
- `src/models/LessonCollection.ts:1-9` — LessonCollection type (add `'lessons10xDevs3'`)
- `src/assets/images/courses/` — thumbnail images (add `10xdevs.png` or similar)

## Architecture Insights

- **Single login sync** is the primary grant mechanism for Circle-gated courses. No per-request API call.
- **`CIRCLE_BRAVE_V1_TOKEN`** must be present in env for Circle checks to work. Without it, Circle membership checks fail silently and no grant is written.
- **Airtable is not used** for 10xDevs access — the `notImplementedYET` placeholders confirm this. Circle is the sole source.
- **`10xdevs-2-en`** is defined in types and mappings but is NOT in `CIRCLE_COURSE_IDS` — it won't be auto-synced at login. Adding it would require both a Circle config entry and adding it to the sync list.

## Implementation Plan for Homepage

### For 10xDevs 1.0 and 2.0 (already backend-ready):

1. **Add thumbnail image** to `src/assets/images/courses/` (e.g. `kurs-10xdevs.png`)
2. **Add entries in `CourseList.astro`** importing the thumbnail and adding two objects to `allCourses`:
   ```ts
   {
     title: '10xDevs 1.0',
     description: '...',
     imageUrl: thumbnail10xDevs.src,
     theme: 'bg-gradient-to-br from-indigo-950 to-violet-950',
     href: '/courses/10xdevs-1',
     isAvailable: customerPurchases.includes('10XDEVS_1'),
     purchaseUrl: 'https://...',
   },
   {
     title: '10xDevs 2.0',
     ...
     isAvailable: customerPurchases.includes('10XDEVS_2'),
   }
   ```
3. **Verify `CIRCLE_BRAVE_V1_TOKEN`** is set in Cloudflare Pages env

### For 10xDevs 3.0 (not yet in codebase):

1. Add `'10XDEVS_3'` to `AirtableCourse` type
2. Add `'10xdevs-3'` to `CourseSlug` type
3. Add display name, collection, permission mappings in `CollectionMappings.ts`
4. Add `'lessons10xDevs3'` to `LessonCollection` type
5. Create content collection in `content.config.ts`
6. Add Circle space config in `externalAuthConfig.ts` (requires community/space IDs from Circle admin)
7. Add `'10xdevs-3'` to `CIRCLE_COURSE_IDS` in `circleSyncService.ts`
8. Create lesson HTML files in `src/content/lessons10xDevs3/`
9. Add CourseList entry

## Open Questions

1. **What is the Circle space ID / community ID for 10xDevs 3.0?** Required for `externalAuthConfig.ts`.
2. **Is 10xDevs 3.0 already launched on Circle?** Without an active space, membership checks would always return `false`.
3. **What thumbnail image to use for 10xDevs courses?** No dedicated asset exists yet.
4. **Should `10xdevs-2-en` be shown on the homepage?** It's not in Circle sync and has only 2 stub lessons.
5. **Purchase URLs for the 10xDevs courses?** Needed for `purchaseUrl` field (only shown when user doesn't have access — but since we now filter to available-only, this is less relevant).
