---
date: 2026-04-14T12:00:00+02:00
researcher: Claude
git_commit: 9ee0acd7ab518c08ead19c22d0c457ad2fed4d17
branch: master
repository: przeprogramowani-sites
topic: "How to introduce new course '10xDevs 3.0 - Prework' - available only for admins or people with 10xDevs 3.0 access"
tags: [research, codebase, 10xdevs-3, prework, course-access, permissions]
status: complete
last_updated: 2026-04-14
last_updated_by: Claude
last_updated_note: "Corrected: Airtable is NOT a real access source for 10xDevs — Circle (Brave) is the primary gate"
---

# Research: Introducing "10xDevs 3.0 - Prework" Course

**Date**: 2026-04-14T12:00:00+02:00
**Researcher**: Claude
**Git Commit**: 9ee0acd7ab518c08ead19c22d0c457ad2fed4d17
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How to introduce a new course "10xDevs 3.0 - Prework" that is available only:
a) for admins, or
b) for people who have access to 10xDevs 3.0

## Summary

Adding the prework course requires changes across **7 layers** of the system: types, mappings, content collection, Circle config, sync services, admin grants, and UI. The access control can reuse the existing `PERMISSION_MAPPINGS` pattern — either by sharing a permission identifier with the future 10xDevs 3.0 course, or by introducing a dedicated one. The admin concept is a simple email whitelist (`ADMIN_EMAILS`) that auto-grants all courses, so admins get access automatically once the course slug is added to the mappings.

The key design decision is: **should prework share the same permission as the full 10xDevs 3.0 course?** This determines whether a single `10XDEVS_3` permission covers both, or whether prework needs its own `10XDEVS_3_PREWORK` permission.

## Detailed Findings

### 1. Current Course Registration Pattern

Every course requires entries in these files:

| Layer | File | What to add |
|-------|------|-------------|
| **CourseSlug type** | `src/models/CollectionMappings.ts:4-12` | New union member, e.g. `'10xdevs-3-prework'` |
| **LessonCollection type** | `src/models/LessonCollection.ts:1-9` | New union member, e.g. `'lessons10xDevs3Prework'` |
| **COLLECTION_MAPPINGS** | `src/models/CollectionMappings.ts:25-34` | Map slug → collection |
| **PERMISSION_MAPPINGS** | `src/models/CollectionMappings.ts:36-45` | Map slug → AirtableCourse permission |
| **COURSE_SLUG_TO_NAME** | `src/models/CollectionMappings.ts:14-23` | Display name |
| **AirtableCourse type** | `src/server/airtable/airtable-course.ts:1-7` | New permission identifier (if not sharing) |
| **Content collection** | `src/content.config.ts` | New `defineCollection()` + export |
| **Content directory** | `src/content/lessons10xDevs3Prework/` | HTML lesson files |

### 2. Access Control Architecture

The access flow works in two layers:

**Layer A — Grant storage (Supabase `access_grants` table):**
- `course_slug` column stores `CourseSlug` values (e.g. `'10xdevs-2'`)
- Grants are created by: airtableSyncService, circleSyncService, or manual insert
- `grantsToAirtableCourses()` in `src/server/supabase/accessService.ts:53-58` converts slugs back to `AirtableCourse[]` for backward compat

**Layer B — Permission check (`verifyAuth`):**
- `src/server/verifyAuth.ts:69-74` — looks up `PERMISSION_MAPPINGS[courseSlug]` and checks if user's `purchasedCourses` includes that permission
- Multiple slugs can map to the same permission (e.g. `opanuj-frontend` and `opanuj-frontend-live` both map to `OPANUJ_FRONTEND`)

### 3. Admin Access

**File:** `src/server/admins.ts:1` — single hardcoded email: `przeprogramowani+edu@gmail.com`

**How admins get all courses:**
- `src/server/supabase/airtableSyncService.ts:22` — `ADMIN_COURSES = Object.values(AIRTABLE_TO_SLUGS).flat()` — all course slugs derived from the AIRTABLE_TO_SLUGS mapping
- On login sync, admin emails receive grants for every slug in the mapping
- **Implication:** Adding the prework slug to `AIRTABLE_TO_SLUGS` automatically grants it to admins

### 4. Circle Config for 10xDevs 3.0

The 3rd edition Circle space already exists:

**File:** `projects/common/src/circle/course-config.ts:17-22`
```
TEN_X_DEVS_THIRD_ED: space_id: 2552674, section_ids: [966234, 966235, 966236, 966240, 966241]
```

**But it's NOT yet wired into edu-platform:**
- Not in `EXTERNAL_AUTH_CONFIG` (`src/server/circle/externalAuthConfig.ts`)
- Not in `CIRCLE_COURSE_IDS` (`src/server/supabase/circleSyncService.ts:9`)
- Not in `CourseSlug` type

### 5. Prework Content Already Exists

Located at: `utils/circle-lesson-backup/backup/10xdevs-3ed/prework/`
- `3ed-prework-draft.md` — 4-module onboarding program
- `3ed-prework-quiz.md` — diagnostic self-assessment quiz
- `3ed-m1-journey.md` — Module 1 user journey
- `3ed-program.md` — full course program overview

This content needs to be converted to HTML and placed in a content collection directory.

### 6. CourseList UI (Homepage Display)

**File:** `src/components/CourseList.astro:23-71`

Courses are hardcoded in `allCourses` array. Only courses where `isAvailable` is `true` (based on `customerPurchases.includes(...)`) are shown. Courses without a purchase are completely hidden — there's no "locked" or "coming soon" state.

To show the prework course on the `/courses` page, a new entry must be added to this array with the appropriate `isAvailable` check.

## Implementation Options

### Option A: Shared Permission with 10xDevs 3.0 (Recommended)

The prework uses the same permission as the full 10xDevs 3.0 course. Anyone who has access to 10xDevs 3.0 automatically has access to prework.

**Changes required:**

1. **Add `AirtableCourse` value:** `'10XDEVS_3'` in `src/server/airtable/airtable-course.ts`
2. **Add `CourseSlug`:** `'10xdevs-3-prework'` in `src/models/CollectionMappings.ts`
3. **Add `LessonCollection`:** `'lessons10xDevs3Prework'` in `src/models/LessonCollection.ts`
4. **Add mappings:**
   ```
   COLLECTION_MAPPINGS['10xdevs-3-prework'] = 'lessons10xDevs3Prework'
   PERMISSION_MAPPINGS['10xdevs-3-prework'] = '10XDEVS_3'
   COURSE_SLUG_TO_NAME['10xdevs-3-prework'] = '10xDevs 3.0: Prework'
   ```
5. **Add to AIRTABLE_TO_SLUGS** in `airtableSyncService.ts`:
   ```
   '10XDEVS_3': ['10xdevs-3-prework']
   ```
   (Later expand to `['10xdevs-3-prework', '10xdevs-3']` when full course is added)
6. **Content collection:** Create `src/content/lessons10xDevs3Prework/` with HTML files and register in `content.config.ts`
7. **CourseList.astro:** Add prework entry with `isAvailable: customerPurchases.includes('10XDEVS_3')`
8. **Add thumbnail image** to `src/images/courses/`

**Admin access:** Automatic — adding `'10XDEVS_3'` to `AIRTABLE_TO_SLUGS` makes `ADMIN_COURSES` include `'10xdevs-3-prework'`.

**Circle sync (optional now):** When ready, add to `EXTERNAL_AUTH_CONFIG` and `CIRCLE_COURSE_IDS`:
```
'10xdevs-3-prework': {
  courseId: '10xdevs-3-prework',
  displayName: '10xDevs 3.0: Prework',
  platform: Platform.CIRCLE_BRAVE,
  communityId: 1272,
  spaceId: 2552674,
  sectionIds: [/* prework-specific section IDs */],
}
```

**How to grant access before Circle sync is wired:**
- Manual Supabase insert: `INSERT INTO access_grants (user_id, course_slug, source) VALUES (uuid, '10xdevs-3-prework', 'manual')`
- Or add the user's email to a future Airtable record mapping

### Option B: Dedicated Prework Permission

Separate permission `'10XDEVS_3_PREWORK'` — requires independent grant management. More granular but more work. Only needed if prework access should be decoupled from the full course.

### Option C: Admin-Only (Simplest, for initial testing)

Don't add to `CourseList.astro` at all — just register the type system entries and content collection. Admins get access via `ADMIN_COURSES`. Access the course directly via URL `/courses/10xdevs-3-prework`.

**Minimal changes:**
1. Type definitions (CourseSlug, LessonCollection, AirtableCourse)
2. All three mapping records
3. Content collection + HTML files
4. AIRTABLE_TO_SLUGS entry

No UI entry needed — admins navigate by URL. Non-admins won't see it or access it (no grant exists).

## Code References

- `src/models/CollectionMappings.ts:4-45` — All course type definitions and mappings
- `src/models/LessonCollection.ts:1-9` — LessonCollection union type
- `src/server/airtable/airtable-course.ts:1-7` — AirtableCourse permission enum
- `src/server/admins.ts:1` — Admin email whitelist
- `src/server/supabase/airtableSyncService.ts:12-22` — AIRTABLE_TO_SLUGS + ADMIN_COURSES
- `src/server/supabase/circleSyncService.ts:9` — CIRCLE_COURSE_IDS
- `src/server/supabase/accessService.ts:29-47` — upsertGrant function
- `src/server/verifyAuth.ts:69-74` — Permission check logic
- `src/server/circle/externalAuthConfig.ts:10-42` — Circle space config
- `src/components/CourseList.astro:23-71` — Course list UI
- `src/content.config.ts:60-73` — Content collection definitions
- `projects/common/src/circle/course-config.ts:17-22` — TEN_X_DEVS_THIRD_ED Circle config

## Architecture Insights

1. **Permission sharing pattern** is already proven: `opanuj-frontend` and `opanuj-frontend-live` share `OPANUJ_FRONTEND`; `opanuj-typescript-core` and `opanuj-typescript-react` share `OPANUJ_TYPESCRIPT`. Prework + full course can share `10XDEVS_3`.

2. **Admin auto-grant** is derived from `AIRTABLE_TO_SLUGS`, not hardcoded. Adding any new entry to that mapping auto-expands admin access.

3. **`grantsToAirtableCourses()` reverse mapping** means the Supabase grant system works bidirectionally — grants stored as slugs, checked as AirtableCourse permissions. Both the prework slug and the future full-course slug would resolve to the same `10XDEVS_3` permission.

4. **Airtable is NOT a real access source for 10xDevs courses.** The record IDs in `airtable-course.ts:14-18` are placeholders (`notImplementedYET`, `notImplementedYET2`, etc.) that will never match real Airtable records. For 10xDevs, **Circle (Brave platform)** is the actual access gate — membership is checked via `circleSyncService` and `externalAuthConfig`. Airtable only truly works for OFE, Cursor, and OTS courses (which have real record IDs). The `AIRTABLE_TO_SLUGS` mapping in `airtableSyncService.ts` still lists 10xDevs entries, but they only serve the admin auto-grant path (since admin emails skip the Airtable lookup entirely).

5. **Circle sync is optional** for initial deployment. The course can be access-gated purely via Supabase grants (manual inserts) before Circle integration is wired up.

6. **No database migration needed** — `access_grants.course_slug` is a free-text column, any new slug value works immediately.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-03-10xdevs-courses-homepage-integration.md` — Previous research on adding 10xDevs courses to homepage. Documented that 10xDevs 3.0 does not exist yet and lists all required layers.
- `thoughts/shared/research/2026-03-25-implicit-string-references-audit.md` — References planned `m1-prework` map (intentional but unresolved) in Space Explorers game context.
- `thoughts/shared/research/2026-03-03-supabase-centralized-access-management.md` — Architecture of the Supabase access system and migration from Airtable.

## Related Research

- [2026-03-03-10xdevs-courses-homepage-integration.md](./2026-03-03-10xdevs-courses-homepage-integration.md)
- [2026-03-03-supabase-centralized-access-management.md](./2026-03-03-supabase-centralized-access-management.md)

## Open Questions

1. **Should prework have its own Circle space/section, or reuse sections from the full 3.0 space (2552674)?** The prework content drafts exist as markdown but no Circle lesson IDs for prework specifically were found.
2. **Content format:** The prework drafts are markdown. Do they need to be converted to HTML (like existing collections) or loaded from Circle API?
3. **Should the prework appear on the CourseList immediately, or be admin/URL-only during initial rollout?**
4. **External route support:** Should `/external/10xdevs-3-prework/[lessonId]` be supported for Circle-embedded viewing?
5. **Prework-specific section IDs:** The 3rd edition Circle space has 5 sections (966234-966241). Which of these are prework vs. main course content?
