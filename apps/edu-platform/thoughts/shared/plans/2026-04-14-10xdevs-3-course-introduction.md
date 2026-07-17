# 10xDevs 3.0 & 10xDevs 3.0 Prework — Course Introduction Implementation Plan

## Overview

Introduce two new internal course slugs to edu-platform: `10xdevs-3` and `10xdevs-3-prework`. Both slugs should resolve to one shared permission, `10XDEVS_3`, and access should be granted from the Brave Circle 3rd edition space (`2552674`) via the existing login-time Circle sync. The courses stay off the `/courses` listing for now and remain direct-URL-only.

The important correction versus the earlier draft is that the platform does **not** currently support an "empty course page" out of the box. If we want these slugs live before lesson HTML exists, we must add explicit empty-state handling for `/courses/[...courseSlug]` instead of assuming the current course shell can render with zero lessons.

## Current State Analysis

The repo already has the standard course-registration layers in place, but neither `10xdevs-3` nor `10xdevs-3-prework` exists in the type system, collection mappings, sync config, or content collections.

### Key Discoveries:

- Shared-permission precedent already exists: `opanuj-frontend` + `opanuj-frontend-live` both map to `OPANUJ_FRONTEND`, and `opanuj-typescript-core` + `opanuj-typescript-react` both map to `OPANUJ_TYPESCRIPT` in `src/models/CollectionMappings.ts:36-45`.
- Admin auto-grants come from `AIRTABLE_TO_SLUGS`, not from special-case course logic. `syncFromAirtable()` uses `ADMIN_COURSES = Object.values(AIRTABLE_TO_SLUGS).flat()` in `src/server/supabase/airtableSyncService.ts:12-22`.
- Circle login sync is driven by `CIRCLE_COURSE_IDS` in `src/server/supabase/circleSyncService.ts:8-10`; adding one slug there is enough to create a grant during login.
- The 3rd edition Circle space already exists in the sibling common package as `TEN_X_DEVS_THIRD_ED` in `../common/src/circle/course-config.ts:17-22`.
- `EXTERNAL_AUTH_CONFIG` already powers more than just external course pages. `src/pages/api/external/membership-refresh.ts:35-47` iterates `Object.values(EXTERNAL_AUTH_CONFIG)`, so adding `10xdevs-3` there also enrolls it in membership-refresh processing automatically.
- The existing course index route hardcodes lesson `01`: `src/pages/courses/[...courseSlug]/index.astro:20`.
- The course shell assumes the active lesson exists and dereferences it non-null: `src/components/Course.astro:19-28`. With zero lessons, this will throw.
- The lesson route also has an existing bad fallback redirect to `/course/...` instead of `/courses/...`: `src/pages/courses/[...courseSlug]/lesson/[...id].astro:18-20`.
- Unauthenticated or unauthorized access does **not** show a 403 page today; both course routes redirect to `/login` when `verifyAuth()` returns false in `src/pages/courses/[...courseSlug]/index.astro:13-16` and `src/pages/courses/[...courseSlug]/lesson/[...id].astro:13-16`.
- The repo’s real verification commands are `npm run build` and `npm run test`, from `package.json:5-13`. There is no dedicated typecheck or lint script in this project.

## Desired End State

After implementation:

1. `CourseSlug` includes `10xdevs-3` and `10xdevs-3-prework`.
2. `LessonCollection` includes `lessons10xDevs3` and `lessons10xDevs3Prework`.
3. `PERMISSION_MAPPINGS` maps both slugs to `10XDEVS_3`.
4. `AIRTABLE_TO_SLUGS` maps `10XDEVS_3` to both slugs so admin login grants both rows in `access_grants`.
5. `CIRCLE_COURSE_IDS` includes only `10xdevs-3`, and login-time Circle sync upserts the `10xdevs-3` grant for members of space `2552674`.
6. `EXTERNAL_AUTH_CONFIG` includes `10xdevs-3`, sourcing `spaceId` and `sectionIds` from `TEN_X_DEVS_THIRD_ED`.
7. Empty content directories exist at `src/content/lessons10xDevs3/` and `src/content/lessons10xDevs3Prework/`, and both are registered in `src/content.config.ts`.
8. Granted users can open `/courses/10xdevs-3` and `/courses/10xdevs-3-prework` before content exists and see an explicit empty-state page instead of a crash.
9. Non-granted users keep the current behavior: redirect to `/login` for both routes.
10. `/courses` stays unchanged; neither new course is listed there yet.

### Verification:

- Admin login creates `access_grants` rows for both `10xdevs-3` and `10xdevs-3-prework`.
- Circle member login creates or refreshes a `10xdevs-3` grant.
- Granted user opening `/courses/10xdevs-3` or `/courses/10xdevs-3-prework` with no lesson HTML sees the empty state, not a runtime error.
- Granted user opening `/courses/10xdevs-3/lesson/01` while the collection is still empty gets redirected back to `/courses/10xdevs-3`.
- Unauthorized user opening either course route is redirected to `/login`.
- `npm run build` passes.
- `npm run test` passes.

## What We're NOT Doing

- Adding entries to `src/components/CourseList.astro`
- Adding course thumbnails or other homepage assets
- Creating `/external/10xdevs-3/*` or `/external/10xdevs-3-prework/*` routes
- Adding shared GUID mappings in `src/models/LessonGuidMappingsData.ts`
- Adding checklist support
- Converting the markdown drafts in `utils/circle-lesson-backup/backup/10xdevs-3ed/prework/` into lesson HTML
- Changing auth UX from redirect-to-login to a dedicated 403/access-denied page
- Updating `../common/src/circle/course-config.ts`; the third-edition config already exists there

## Implementation Approach

Follow the existing course-registration pattern, but split the work into two tracks:

1. Register both slugs everywhere the permission and content system needs to know about them.
2. Add a small route-level empty-state path so direct URLs work immediately even with zero lessons.

The access model should stay intentionally asymmetric:

- Circle sync only grants `10xdevs-3`.
- `10xdevs-3-prework` gets access implicitly because both slugs resolve to `10XDEVS_3`.
- Admin sync grants both slugs explicitly because the admin path expands from `AIRTABLE_TO_SLUGS`.

For Circle config, avoid copy-pasting raw space metadata from the common package into comments or docs. Pull the values from `TEN_X_DEVS_THIRD_ED` when wiring `EXTERNAL_AUTH_CONFIG` so the platform-specific config stays aligned with the shared source of truth.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This work is type/config/routing focused. There are no React lifecycle or async UI race-condition changes beyond the existing login-time sync flow.

### User Experience Specification

- **Direct course URL with no lessons**: `/courses/10xdevs-3` and `/courses/10xdevs-3-prework` should render a simple empty state inside the normal course layout, not a blank page and not a server error.
- **Empty-state copy**: Use a neutral placeholder such as `Kurs w przygotowaniu` with supporting text like `Materiały pojawią się tutaj wkrótce.` and a link back to `/courses`.
- **Direct lesson URL with no lessons**: `/courses/<slug>/lesson/01` should redirect to `/courses/<slug>` so deep links fail safely while content is still absent.
- **Unauthorized access**: Preserve the current redirect to `/login`; do not introduce a new denied-access screen in this change.
- **Course listing**: `/courses` must remain unchanged, with no visible cards for the new slugs.

### Performance & Optimization Strategy

- `syncAllCircleCourses()` already uses `Promise.allSettled()` in `src/server/supabase/circleSyncService.ts:55-57`. Adding one course ID increases the fan-out from 3 to 4 and is negligible.
- The empty-state route should avoid loading extra data beyond `getCollection(courseCollection)` in the course index route.
- No caching changes are required; the existing membership resolution path already uses the current Circle cache layer.

### State Management Sequencing

Access flow after this change:

1. User logs in.
2. `syncFromAirtable()` grants both new slugs to admin emails because `ADMIN_COURSES` expands from `AIRTABLE_TO_SLUGS`.
3. `syncAllCircleCourses()` checks `10xdevs-3` because it is present in `CIRCLE_COURSE_IDS`.
4. If Circle membership is active, `upsertGrant(userId, '10xdevs-3', 'circle', ...)` runs.
5. On route access, `verifyAuth(Astro, '10xdevs-3-prework')` resolves `PERMISSION_MAPPINGS['10xdevs-3-prework']` to `10XDEVS_3`.
6. `grantsToAirtableCourses()` converts the stored `10xdevs-3` grant into `10XDEVS_3`, so prework access passes without storing a second Circle-origin grant.

### Debug & Observability Plan

- **Verification method**: Confirm new grants in Supabase `access_grants`, then smoke-test both direct URLs in a local/dev environment.
- **Logging strategy**: Rely on existing `console.info` / `console.error` output in `src/server/supabase/airtableSyncService.ts` and `src/server/supabase/circleSyncService.ts`; no new log category is needed.
- **Debug instrumentation**: For route-level empty-state behavior, use browser rendering plus server logs from Astro. For auth/debug, inspect the `verifyAuth` flow and `access_grants` rows.
- **Key failure signals**:
  - Missing `10XDEVS_3` in `grantsToAirtableCourses()` means shared-permission access is broken.
  - Missing `10xdevs-3` in `EXTERNAL_AUTH_CONFIG` means membership refresh and external membership resolution will skip the course.
  - Rendering `/courses/10xdevs-3` with no lessons should never dereference `activeLesson`.

## Phase 1: Register Slugs, Permissions, and Collections

### Overview

Add the two new course slugs to the core type system and content collection registry so the rest of the app can reference them safely.

### Changes Required:

#### 1. Extend `AirtableCourse`

**File**: `src/server/airtable/airtable-course.ts`  
**Changes**: Add `10XDEVS_3` to the union and add a placeholder mapping entry alongside the existing `notImplementedYET*` entries used for other 10xDevs editions.

```ts
export type AirtableCourse =
  | 'OPANUJ_FRONTEND'
  | 'CURSOR_AI'
  | 'OPANUJ_TYPESCRIPT'
  | '10XDEVS_1'
  | '10XDEVS_2'
  | '10XDEVS_2_EN'
  | '10XDEVS_3';

const AirtableCourseMappings: Record<string, AirtableCourse> = {
  // ...
  notImplementedYET4: '10XDEVS_3',
};
```

#### 2. Extend lesson collection types

**File**: `src/models/LessonCollection.ts`  
**Changes**: Add `lessons10xDevs3` and `lessons10xDevs3Prework` to the `LessonCollection` union.

#### 3. Extend slug/name/permission mappings

**File**: `src/models/CollectionMappings.ts`  
**Changes**:

- Add `10xdevs-3` and `10xdevs-3-prework` to `CourseSlug`
- Add display names to `COURSE_SLUG_TO_NAME`
- Add collection mappings for both slugs
- Map both slugs to `10XDEVS_3` in `PERMISSION_MAPPINGS`

Use the same local naming convention as existing course pages:

```ts
'10xdevs-3': '10xDevs III',
'10xdevs-3-prework': '10xDevs III: Prework',
```

#### 4. Register empty content collections

**File**: `src/content.config.ts`  
**Changes**:

- Define `lessons10xDevs3`
- Define `lessons10xDevs3Prework`
- Export both in `collections`

Create these tracked directories:

```bash
mkdir -p src/content/lessons10xDevs3
mkdir -p src/content/lessons10xDevs3Prework
touch src/content/lessons10xDevs3/.gitkeep
touch src/content/lessons10xDevs3Prework/.gitkeep
```

Implementation detail: `.gitkeep` is safe here because `htmlLoader()` only matches `*.html` in `src/content.config.ts:18-32`.

### Success Criteria:

#### Automated Verification:

- [x] `npm run build`
- [x] `ls src/content/lessons10xDevs3 src/content/lessons10xDevs3Prework`
- [x] `rg -n \"10xdevs-3|10xdevs-3-prework|10XDEVS_3\" src/models src/server/airtable src/content.config.ts`

#### Manual Verification:

- [x] None required in isolation for this phase

**Implementation Note**: Do not proceed to route/auth wiring until both new collections are registered and the build is clean.

---

## Phase 2: Make Direct URLs Safe Before Lessons Exist

### Overview

Add explicit empty-state handling so both new course URLs work immediately even when the collections contain zero HTML files.

### Changes Required:

#### 1. Replace the hardcoded first lesson assumption

**File**: `src/pages/courses/[...courseSlug]/index.astro`  
**Changes**:

- Import `getCollection` from `astro:content`
- Load the course collection before rendering
- Resolve the first available lesson dynamically with `lessons[0]?.id`
- If no lessons exist, render an empty state instead of calling `<Course ... lessonId={'01'} />`

Target structure:

```ts
const lessons = await getCollection(courseCollection);
const firstLessonId = lessons[0]?.id ?? null;

if (!firstLessonId) {
  // render empty state
}

<Course courseSlug={courseSlug} collection={courseCollection} lessonId={firstLessonId} />
```

This removes the hidden `01` assumption and makes future content drops work even if the first real lesson ID is derived from actual files rather than hardcoded.

#### 2. Add a dedicated empty-state component

**File**: `src/components/EmptyCourseState.astro`  
**Changes**: Create a small presentational component for the "course coming soon" view so the route stays simple and the UI copy is centralized.

Expected props:

```ts
interface Props {
  title: string;
  description: string;
}
```

Render it inside `CourseLayout` so the page still uses the course shell and browser title formatting.

#### 3. Render the empty state inside the existing course layout

**Files**:

- `src/pages/courses/[...courseSlug]/index.astro`
- `src/layouts/CourseLayout.astro` only if a tiny prop adjustment is needed

**Changes**:

- When no lessons exist, render `CourseLayout` with the new empty-state component
- Pass a stable placeholder `lessonName`, for example `Kurs w przygotowaniu`, so the `<title>` tag remains valid
- Do not touch `src/components/Course.astro`; keep that component responsible only for real lesson navigation/rendering

#### 4. Fix the invalid lesson fallback

**File**: `src/pages/courses/[...courseSlug]/lesson/[...id].astro`  
**Changes**:

- Replace `Astro.redirect(\`/course/${courseSlug}/lesson/01\`)` with `Astro.redirect(\`/courses/${courseSlug}\`)`
- This makes missing or premature lesson deep links resolve back to the safe index route

### Success Criteria:

#### Automated Verification:

- [x] `npm run build`
- [x] `rg -n \"Kurs w przygotowaniu|Materiały pojawią się tutaj wkrótce|EmptyCourseState\" src/pages src/components`

#### Manual Verification:

- [ ] Start the app with `npm run dev`
- [ ] Log in as a granted user and open `/courses/10xdevs-3` with an empty collection
- [ ] Confirm the route renders the empty state instead of crashing
- [ ] Open `/courses/10xdevs-3-prework` and confirm the same behavior
- [ ] Open `/courses/10xdevs-3/lesson/01` while the collection is empty and confirm redirect back to `/courses/10xdevs-3`

**Implementation Note**: This phase is mandatory. Without it, the new slugs are not safe to expose before lesson HTML lands.

---

## Phase 3: Wire Login-Time Grants and Add Regression Coverage

### Overview

Finish the access path by wiring admin grants, Circle membership sync, and focused regression tests around the new shared permission and Circle config.

### Changes Required:

#### 1. Expand admin grant mapping

**File**: `src/server/supabase/airtableSyncService.ts`  
**Changes**:

Add a `10XDEVS_3` mapping to both slugs:

```ts
'10XDEVS_3': ['10xdevs-3', '10xdevs-3-prework'],
```

This is what makes admin login create both grants, because the admin path never depends on real Airtable record IDs.

#### 2. Add the Circle-synced course ID

**File**: `src/server/supabase/circleSyncService.ts`  
**Changes**:

Append only `10xdevs-3` to `CIRCLE_COURSE_IDS`:

```ts
const CIRCLE_COURSE_IDS = ['opanuj-frontend', '10xdevs-1', '10xdevs-2', '10xdevs-3'];
```

Do **not** add `10xdevs-3-prework` here. One Circle-origin grant is enough because both slugs map to `10XDEVS_3`.

#### 3. Add 3rd edition Circle config using the shared source of truth

**File**: `src/server/circle/externalAuthConfig.ts`  
**Changes**:

- Import `TEN_X_DEVS_THIRD_ED` from `@przeprogramowani/common/src/circle`
- Add a `10xdevs-3` config block
- Source `platform`, `spaceId`, and `sectionIds` from `TEN_X_DEVS_THIRD_ED`

Recommended shape:

```ts
import { Platform, TEN_X_DEVS_THIRD_ED } from '@przeprogramowani/common/src/circle';

'10xdevs-3': {
  courseId: '10xdevs-3',
  displayName: '10xDevs 3.0',
  platform: TEN_X_DEVS_THIRD_ED.platform,
  communityId: 1272,
  spaceId: TEN_X_DEVS_THIRD_ED.space_id,
  sectionIds: TEN_X_DEVS_THIRD_ED.section_ids,
},
```

Leave `10xdevs-3-prework` out of `EXTERNAL_AUTH_CONFIG` because there are no external prework routes in this scope.

#### 4. Add focused regression tests

**Files**:

- `src/server/supabase/accessService.test.ts`
- `src/server/circle/externalAuthConfig.test.ts`

**Changes**:

Add pure-module tests for the two behaviors this feature depends on:

- `grantsToAirtableCourses(['10xdevs-3'])` returns `['10XDEVS_3']`
- `grantsToAirtableCourses(['10xdevs-3-prework'])` also returns `['10XDEVS_3']`
- `grantsToAirtableCourses(['10xdevs-3', '10xdevs-3-prework'])` still deduplicates to one `10XDEVS_3`
- `getExternalAuthConfig('10xdevs-3')` returns Brave config with space `2552674`
- `getSpaceIdsForExternalAuth()` includes `2552674`

These tests close the gap that currently exists: there is no targeted test coverage for either `accessService.ts` or `externalAuthConfig.ts`.

### Success Criteria:

#### Automated Verification:

- [x] `npm run test -- src/server/supabase/accessService.test.ts src/server/circle/externalAuthConfig.test.ts`
- [x] `npm run build`
- [x] `npm run test`

#### Manual Verification:

- [ ] Log in as `przeprogramowani+edu@gmail.com` and confirm Supabase contains both `10xdevs-3` and `10xdevs-3-prework`
- [ ] Log in as a user who belongs to Brave space `2552674` and confirm a `10xdevs-3` grant is created or refreshed
- [ ] Confirm the same user can open `/courses/10xdevs-3-prework`
- [ ] Confirm a logged-in user without the grant is redirected to `/login` when opening either new course URL
- [ ] Confirm `/courses` still shows no new course cards

**Implementation Note**: After this phase, pause for human confirmation on the manual access checks before considering the rollout complete.

---

## Testing Strategy

### Unit Tests:

- Add `src/server/supabase/accessService.test.ts` for the shared-permission reverse-mapping behavior
- Add `src/server/circle/externalAuthConfig.test.ts` for the 3rd edition Circle config
- Run the full suite afterward because `CourseSlug` and `AirtableCourse` unions are used broadly across the app

### Integration Tests:

- No dedicated integration harness exists for these routes today
- Treat `npm run build` plus direct route smoke-testing under `npm run dev` as the practical integration check for this repo

### Manual Testing Steps:

1. Run `npm run dev`.
2. Log in as an admin and verify both new slugs are inserted into `access_grants`.
3. Log in as a real member of Brave space `2552674` and verify `10xdevs-3` is granted.
4. Open `/courses/10xdevs-3` and `/courses/10xdevs-3-prework` as a granted user while both collections are still empty.
5. Open `/courses/10xdevs-3/lesson/01` and confirm it redirects safely to `/courses/10xdevs-3`.
6. Open the same routes as a non-granted user and confirm redirect to `/login`.
7. Open `/courses` and confirm there are still no new visible course cards.

## Performance Considerations

- One extra course ID in `syncAllCircleCourses()` is negligible compared with the existing login sync fan-out.
- The new index-route logic adds a single `getCollection(courseCollection)` call before rendering. That is acceptable because the route already depends on Astro content lookup, and the new collections are initially empty.
- No database migration, batching change, or cache invalidation strategy is required.

## Migration Notes

- No database migration is needed; `access_grants.course_slug` already stores free-text slugs.
- No new environment variables are required beyond the existing Brave Circle auth bindings already used for `10xdevs-1` and `10xdevs-2`.
- Existing users in the 3rd edition Circle space pick up access on their next login once `10xdevs-3` is part of `CIRCLE_COURSE_IDS`.
- Future lesson rollout only needs HTML files placed into `src/content/lessons10xDevs3/` or `src/content/lessons10xDevs3Prework/`; the index route will then use the real first lesson ID instead of a hardcoded `01`.

## References

- Research doc: `thoughts/shared/research/2026-04-14-10xdevs-3-prework-course-introduction.md`
- Course slug and permission mappings: `src/models/CollectionMappings.ts:4-45`
- Lesson collection registry: `src/content.config.ts:18-95`
- Admin auto-grant expansion: `src/server/supabase/airtableSyncService.ts:12-22`
- Circle login sync list: `src/server/supabase/circleSyncService.ts:8-10`
- External auth config: `src/server/circle/externalAuthConfig.ts:10-42`
- Shared 3rd edition Circle metadata: `../common/src/circle/course-config.ts:17-22`
- Broken empty-course assumptions today:
  - `src/pages/courses/[...courseSlug]/index.astro:20`
  - `src/components/Course.astro:19-28`
  - `src/pages/courses/[...courseSlug]/lesson/[...id].astro:18-20`
