# Course Lesson Progress Implementation Plan

## Overview

Implement Supabase-backed lesson completion progress for each authenticated student and course. The feature tracks manual, reversible lesson completion only, then exposes that state through separate toggle controls in the lesson sidebar and at the top and bottom of each lesson page.

## Current State Analysis

The application has a protected course platform with three relevant lesson surfaces:

- Regular course lessons render through `src/components/Course.astro`, which loads the Astro content collection and passes flat lesson props to `LessonSidebar`.
- External lessons render through `src/layouts/ExternalLessonLayout.astro`, which passes grouped lesson props, optional checklist props, and prework quiz personalization to the same `LessonSidebar`.
- `10xdevs-3-prework` is routed through `/external/10xdevs-3-prework/{lang}/{lessonId}` and already passes language-specific lesson lists through `ExternalLessonLayout`.

Authentication and Supabase patterns already exist:

- Regular course auth uses `verifyAuth()` and loads Supabase grants before falling back to Airtable.
- External auth uses `verifyExternalAuth()` and checks Supabase grants before falling back to Circle membership.
- `/api/quiz-result` shows the current pattern for authenticated user lookup, request validation, Supabase service calls, JSON responses, and Vitest API tests.

There is no existing lesson progress table, progress API, progress service, or sidebar completion state. There is also no Playwright/e2e setup in `package.json`; browser-level verification will be manual for this first version.

## Desired End State

After this plan is implemented:

- Each authenticated student has per-lesson completion state stored in Supabase.
- The key is based on stable route identity: `course_slug`, optional `language`, and `lesson_id`.
- Students can mark a lesson complete/incomplete from a separate sidebar toggle.
- Clicking the lesson link still only navigates to the lesson.
- The same lesson completion state is visible and controllable at the top and bottom of the lesson page.
- Progress reads are batched for the current course/route; writes toggle a single lesson at a time.
- If progress auth/user lookup or progress loading fails, lesson content remains accessible and progress controls are omitted.
- Prework PL and EN progress are separate.

### Key Discoveries

- Regular course sidebar props are created in `src/components/Course.astro:62`, currently as `{ id, name }` only.
- External/prework sidebar props are normalized in `src/layouts/ExternalLessonLayout.astro:79` and then passed to `LessonSidebar`.
- `LessonSidebar` already supports flat and grouped modes through JSON-serializable Svelte props in `src/components/sidebar/types.ts:5`.
- Sidebar anchors are currently the full clickable lesson row in `src/components/sidebar/LessonSidebar.svelte:55` and `src/components/sidebar/LessonSidebar.svelte:97`, so adding a separate toggle requires restructuring row markup.
- Regular auth can return the email but not the user ID from `src/server/verifyAuth.ts:76`; progress integration will need a reliable user ID lookup after auth succeeds.
- External auth returns email/course only from `src/server/externalAuth.ts:108`; route integration should reuse `getUserIdByEmail()` or a small helper after auth succeeds.
- `/api/quiz-result` already uses `verifyExternalAuth()` plus `upsertUser()` for authenticated Supabase writes in `src/pages/api/quiz-result.ts:37`.
- `package.json:20` exposes Vitest only; no browser e2e framework is currently installed.

## What We're NOT Doing

- No aggregate course progress percentage, progress bar, or course-level completion indicator.
- No external checklist progress.
- No automatic viewed/read tracking.
- No admin/reporting dashboard.
- No analytics events or exports.
- No Playwright/e2e test setup in this version.
- No historical backfill for lessons already read before the feature ships.
- No migration tooling for lesson ID renames beyond documenting the implication.

## Implementation Approach

Use Supabase as the source of truth for manual lesson completion. Add a narrow table and service layer first, then expose a validated API for client-side toggles. Route rendering should batch-load progress server-side whenever the authenticated user ID is available and pass completed lesson IDs into shared UI components.

The UI should be composed around a reusable Svelte `LessonProgressToggle` component. `LessonSidebar` receives lesson-level progress state and renders the toggle as a sibling control beside the lesson navigation anchor. The current lesson page renders the same control twice, once near the title/action area and once after the content. All controls on the page share client-side optimistic state through props/events or a small page-local Svelte wrapper so state remains synchronized after a toggle.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- Render initial completion state from server-loaded progress to avoid a post-hydration flicker.
- Hydrated Svelte controls should initialize from serialized `completed` values passed through Astro props.
- On toggle click, update local state immediately, send the API request, then rollback and show a compact error if the request fails.
- Do not block lesson content rendering on progress loading. If progress cannot be loaded, pass no progress config and omit controls.
- Keep sidebar collapsed-state scripts unchanged; progress UI should not alter existing sidebar hydration behavior.

### User Experience Specification

- Sidebar rows must separate navigation from completion:
  - The lesson title/name remains an anchor.
  - The completion toggle is a button or checkbox-like button adjacent to the anchor.
  - Clicking the toggle does not navigate.
  - Clicking the anchor does not toggle progress.
- Completed lessons show a compact visual indicator in the sidebar toggle.
- Incomplete lessons show a compact inactive toggle.
- Top and bottom lesson page controls use the same state and labels:
  - Incomplete: "Oznacz jako ukończone" / "Mark as complete" where English shell copy applies.
  - Completed: "Ukończone" / "Completed".
- Existing Polish-first platform copy should be used for regular courses and Polish prework; English prework should use English labels.
- If progress controls are hidden because progress state could not be loaded, the lesson page should look like the current page rather than showing an error box.
- Error after failed optimistic toggle should be small and local to the control, not a blocking modal.

### Performance & Optimization Strategy

- Use one batch progress read per page render for the current course/language:
  - Regular courses: all lessons in the content collection.
  - External courses: all lessons in the fetched course structure.
  - Prework: all lessons for the current language.
- Use a single-item write API for toggles.
- Return a compact payload from reads, ideally a set/list of completed lesson IDs plus timestamps only if needed by the UI.
- Add an index matching the batch query pattern: `user_id`, `course_slug`, `language`.
- Avoid per-lesson API reads from Svelte components.

### State Management Sequencing

For a toggle:

1. User clicks the sidebar or content completion control.
2. Svelte component prevents anchor/navigation side effects.
3. Component flips local completion state optimistically for the affected lesson.
4. All controls for the same lesson on the page receive/update the same state.
5. Component sends `PUT /api/lesson-progress` with `courseSlug`, optional `language`, `lessonId`, and target `completed` boolean.
6. API authenticates, resolves user ID, validates access to the course, and writes/deletes/upserts progress.
7. On success, UI keeps the optimistic state.
8. On failure, UI rolls back and displays a compact local error.

### Debug & Observability Plan

- Log server-side progress read failures with `console.error('[lesson-progress] ...')`, including course slug and language but never secret tokens.
- Log API validation/auth failures only at normal response level; avoid noisy logs for expected 400/401 cases.
- Log Supabase service failures with table operation context.
- Use Vitest assertions to verify failure behavior returns non-2xx and does not call the service when validation fails.
- Manual verification covers persistence after reload/navigation and no cross-language bleed for prework.

## Phase 1: Schema + Progress Service

### Overview

Create the Supabase persistence model and a typed service module for batch reads and single-item completion updates.

### Changes Required

#### 1. Supabase Migration

**File**: `supabase/migrations/20260428000000_lesson_progress.sql`

**Changes**:

- Create `public.lesson_progress`.
- Key by `user_id`, `course_slug`, nullable `language`, and `lesson_id`.
- Store `completed_at` and `updated_at`.
- Enable RLS to match recent table migrations, while all app access still uses the service role key.

Suggested schema:

```sql
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,
  language text,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_slug, language, lesson_id)
);

create index on public.lesson_progress(user_id, course_slug, language);
create index on public.lesson_progress(course_slug, lesson_id);

alter table public.lesson_progress enable row level security;
```

Important: PostgreSQL unique constraints treat `null` values as distinct. For non-language courses, either:

- Use a normalized sentinel language value in writes, e.g. `language = 'default'`; or
- Add two partial unique indexes, one for `language is null` and one for `language is not null`.

Recommended implementation: use partial unique indexes so the stored model keeps `language` truly optional:

```sql
create unique index lesson_progress_unique_default_language
  on public.lesson_progress(user_id, course_slug, lesson_id)
  where language is null;

create unique index lesson_progress_unique_language
  on public.lesson_progress(user_id, course_slug, language, lesson_id)
  where language is not null;
```

Do not keep the inline `unique(user_id, course_slug, language, lesson_id)` if using partial indexes.

#### 2. Supabase Service

**File**: `src/server/supabase/lessonProgressService.ts`

**Changes**:

Add:

- `loadLessonProgress(userId, { courseSlug, language }, env)`
- `setLessonCompletion(userId, { courseSlug, language, lessonId, completed }, env)`
- Small mapping helpers returning app-level records.

Recommended types:

```ts
type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface LessonProgressScope {
  courseSlug: string;
  language?: string | null;
}

export interface LessonProgressItem extends LessonProgressScope {
  lessonId: string;
  completedAt: string;
  updatedAt?: string;
}

export interface LessonCompletionInput extends LessonProgressScope {
  lessonId: string;
  completed: boolean;
}
```

Implementation notes:

- For batch reads, query by `user_id`, `course_slug`, and `language`:
  - `.is('language', null)` when no language.
  - `.eq('language', language)` when language exists.
- For completion:
  - If `completed = true`, `upsert` record and set timestamps.
  - If `completed = false`, delete the row for that exact key.
- Use `.select(...)` after upsert if the API needs to return the updated record.
- Throw clear errors with operation names, matching `quizResultService.ts`.

### Success Criteria

#### Automated Verification

- [x] Migration applies cleanly to local Supabase.
- [x] `npm run test -- src/server/supabase/lessonProgressService.test.ts` passes.
- [x] Existing Supabase service tests still pass: `npm run test -- src/server/supabase`.

#### Manual Verification

- [ ] Inspect local Supabase table and confirm uniqueness prevents duplicate progress for the same user/course/language/lesson.
- [ ] Confirm PL and EN prework can store separate rows for the same `lesson_id`.

**Implementation Note**: Pause after this phase if the migration or uniqueness strategy needs human review before API/UI code depends on it.

---

## Phase 2: Progress API

### Overview

Expose authenticated API endpoints for batch progress read and single lesson completion toggle.

### Changes Required

#### 1. API Route

**File**: `src/pages/api/lesson-progress.ts`

**Changes**:

Add:

- `GET /api/lesson-progress?courseSlug=...&language=...`
- `PUT /api/lesson-progress`

Request/response shape:

```ts
// GET response
{
  progress: [
    { lessonId: "01", completedAt: "2026-04-28T..." }
  ]
}

// PUT body
{
  courseSlug: "10xdevs-3-prework",
  language: "pl",
  lessonId: "01",
  completed: true
}

// PUT response
{
  progress: { lessonId: "01", completed: true, completedAt: "..." }
}
```

Validation:

- `courseSlug` must be one of `CourseSlug`.
- `language` is optional; when present, allow only `pl` or `en` for `10xdevs-3-prework`.
- Require `language` for prework progress.
- Reject non-prework language values for regular/external courses unless a future course explicitly needs language.
- `lessonId` must be a non-empty string.
- `completed` must be boolean.

Authentication:

- For `courseSlug === '10xdevs-3-prework'`, use `verifyExternalAuth(context.cookies, courseSlug, env)` to match prework routes.
- For other external courses also use `verifyExternalAuth()` if the course is known only in external auth config.
- For regular course slugs, either:
  - Reuse `verifyAuth()` by adapting an auth helper that accepts `APIContext`; or
  - Extract shared token/email/course access logic into a server helper used by both routes and API.

Recommended helper:

**File**: `src/server/progress/lessonProgressAuth.ts`

Responsibilities:

- Resolve authenticated email and user ID for a course slug.
- Verify access using existing route auth semantics.
- Return `{ userId, email }` or a typed failure.
- Never create users during read/toggle unless existing app flow already created them. Prefer `getUserIdByEmail()` and hide controls when missing.

For API writes, if the profile does not exist, return `401` or `404` rather than creating a user implicitly, unless route auth patterns require `upsertUser()`.

#### 2. Tests

**File**: `tests/api/lesson-progress.test.ts`

**Changes**:

Add Vitest tests mirroring `tests/api/quiz-result.test.ts`:

- Reject unsupported course slug.
- Reject missing prework language.
- Reject invalid lesson ID/completed value.
- Reject unauthenticated request.
- Batch load calls service with `userId`, `courseSlug`, `language`.
- Toggle complete calls `setLessonCompletion(... completed: true)`.
- Toggle incomplete calls `setLessonCompletion(... completed: false)`.
- Service errors return `500`.

### Success Criteria

#### Automated Verification

- [x] API tests pass: `npm run test -- tests/api/lesson-progress.test.ts`.
- [x] Existing quiz API tests still pass: `npm run test -- tests/api/quiz-result.test.ts`.
- [ ] Full tests pass: `npm run test`.

#### Manual Verification

- [ ] Calling `GET /api/lesson-progress` while authenticated returns only the current user's course progress.
- [ ] Calling `PUT /api/lesson-progress` toggles one lesson without changing other lessons.

**Implementation Note**: Pause after this phase if auth helper extraction changes existing route auth behavior.

---

## Phase 3: Route Integration

### Overview

Load progress server-side in lesson routes/layouts and pass serialized state into Svelte UI props.

### Changes Required

#### 1. Progress Loader Helper

**File**: `src/server/progress/lessonProgressLoader.ts`

**Changes**:

Add helper:

```ts
export async function loadProgressForCourseSidebar({
  email,
  courseSlug,
  language,
  env,
}: {
  email?: string;
  courseSlug: string;
  language?: string | null;
  env: SupabaseEnv;
}): Promise<LessonProgressById | null>
```

Behavior:

- If no email, return `null`.
- Resolve user ID with `getUserIdByEmail()`.
- If no user ID, return `null`.
- Call `loadLessonProgress()`.
- Return a map keyed by `lessonId`.
- Catch and log errors, then return `null` so UI can hide controls.

#### 2. Regular Course Integration

**File**: `src/pages/courses/[...courseSlug]/lesson/[...id].astro`

**Changes**:

- `verifyAuth()` already returns `authResult.email`.
- Pass `authResult.email` into `Course`.

**File**: `src/components/Course.astro`

**Changes**:

- Add optional `userEmail` prop.
- Load progress with `courseSlug` and `language: null`.
- Pass progress props to:
  - `LessonSidebar`.
  - New lesson-level top/bottom progress control wrapper.

#### 3. External Course Integration

**File**: `src/pages/external/[courseId]/[lessonId].astro`

**Changes**:

- After `verifyExternalAuth()`, load progress with `courseSlug = courseId` and `language: null`.
- Pass progress into `ExternalLessonLayout`.
- Do not include checklists in progress.

#### 4. Prework Integration

**File**: `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:

- Load progress with `courseSlug = courseId` and `language = lang`.
- Pass progress into `ExternalLessonLayout`.
- Ensure PL/EN states are isolated.

#### 5. External Layout Props

**File**: `src/layouts/ExternalLessonLayout.astro`

**Changes**:

- Add `lessonProgress?: LessonProgressById | null`.
- Merge progress into `personalizedLessons` or directly into `LessonSidebar` lesson props.
- Pass current lesson progress identity to the lesson content control slot/wrapper if needed.

Important: `ExternalLessonLayout` currently owns the title and shell, while lesson page content is supplied as a slot. If top/bottom controls need to render inside the content area around the `h1`, either:

- Render controls in each route page around the lesson title/body; or
- Add named slots/props to `ExternalLessonLayout`.

Recommended: route pages render the content controls because they already render the lesson title and body.

### Success Criteria

#### Automated Verification

- [x] Component/page type checks pass via `npm run build`.
- [ ] Existing route-related tests still pass: `npm run test`.

#### Manual Verification

- [ ] Regular course lesson page renders with progress controls when progress loads.
- [ ] External course lesson page renders with progress controls when progress loads.
- [ ] Prework PL lesson page renders PL progress only.
- [ ] Prework EN lesson page renders EN progress only.
- [ ] Simulated progress load failure leaves the lesson readable and hides controls.

**Implementation Note**: Pause after this phase for manual confirmation that server-side rendering still works before adding interactive UI polish.

---

## Phase 4: Reusable Sidebar Progress UI

### Overview

Add a reusable Svelte toggle and integrate it into `LessonSidebar` as a separate control beside lesson navigation.

### Changes Required

#### 1. Sidebar Types

**File**: `src/components/sidebar/types.ts`

**Changes**:

Extend `SidebarLessonItem`:

```ts
progress?: {
  enabled: boolean;
  completed: boolean;
  courseSlug: string;
  language?: string | null;
  lessonId: string;
};
```

Alternatively, keep course/language at top-level sidebar props and only store `completed`/`lessonId` on each item. Recommended: keep repeated props minimal:

```ts
progress?: {
  completed: boolean;
  lessonId: string;
};

progressScope?: {
  courseSlug: string;
  language?: string | null;
};
```

Add `progressScope` to flat/grouped sidebar props when progress is available.

#### 2. Lesson Progress Toggle Component

**File**: `src/components/progress/LessonProgressToggle.svelte`

**Changes**:

Create a Svelte component with props:

```ts
interface Props {
  courseSlug: string;
  lessonId: string;
  language?: string | null;
  completed: boolean;
  variant?: 'sidebar' | 'content';
  labels?: {
    markComplete: string;
    completed: string;
    error: string;
  };
}
```

Behavior:

- Uses button semantics.
- `aria-pressed={completed}`.
- Optimistically toggles state.
- Calls `PUT /api/lesson-progress`.
- Dispatches a custom event on success/optimistic change so sibling controls can synchronize.
- Rolls back on failure and displays a compact error.

For cross-control synchronization, use one of:

- A page-local Svelte wrapper that owns state and renders all controls; or
- A browser `CustomEvent`, e.g. `lesson-progress:changed`, listened to by all toggle instances.

Recommended for minimal Astro integration: use `CustomEvent` keyed by `{ courseSlug, language, lessonId }`, because sidebar and lesson content controls are separate islands.

#### 3. Sidebar Integration

**File**: `src/components/sidebar/LessonSidebar.svelte`

**Changes**:

- Import `LessonProgressToggle`.
- For each lesson with progress enabled, render a row layout:
  - Toggle button as a sibling.
  - Anchor around the lesson label only.
- Ensure `click` on toggle does not trigger navigation.
- Preserve active lesson styling.
- Preserve personalization marker rendering.
- Keep checklist section unchanged.

Accessibility:

- Toggle has an explicit label:
  - Polish: `Oznacz lekcję jako ukończoną: {lesson.name}` or `Oznacz lekcję jako nieukończoną: {lesson.name}`.
  - English equivalent for English shell copy.
- Anchor remains keyboard-focusable.
- Toggle is keyboard-focusable separately.

#### 4. Sidebar Tests

**File**: `src/components/sidebar/LessonSidebar.test.ts`

**Changes**:

Add tests:

- Renders progress toggle separately from lesson anchor.
- Toggle button has `aria-pressed`.
- Lesson anchor href remains correct.
- Checklist items do not render lesson progress toggles.
- English labels are used when provided.

### Success Criteria

#### Automated Verification

- [x] Sidebar component tests pass: `npm run test -- src/components/sidebar/LessonSidebar.test.ts`.
- [x] Svelte tests pass for the toggle component.
- [ ] Full tests pass: `npm run test`.

#### Manual Verification

- [ ] Clicking sidebar toggle changes only progress.
- [ ] Clicking sidebar lesson title navigates only.
- [ ] Keyboard navigation can focus both the toggle and the link.
- [ ] Sidebar layout remains stable in flat and grouped modes.

**Implementation Note**: Pause after this phase for manual confirmation of sidebar ergonomics before adding top/bottom content controls.

---

## Phase 5: Lesson Page Top/Bottom Controls

### Overview

Render the same progress state as top and bottom controls on lesson pages, synchronized with sidebar toggles.

### Changes Required

#### 1. Content Control Wrapper

**File**: `src/components/progress/LessonCompletionControls.svelte`

**Changes**:

Optional wrapper around `LessonProgressToggle` for content variant:

- Larger button text than sidebar variant.
- Shows local error.
- Accepts same identity props.

If `LessonProgressToggle` can handle both variants cleanly, a wrapper may not be necessary.

#### 2. Regular Lesson Content

**File**: `src/components/Course.astro`

**Changes**:

- Render top control near the title/action area. Since `Lesson.astro` currently owns the title, inspect whether to:
  - Extend `Lesson.astro` with top/bottom slots/props; or
  - Move title rendering/control composition into `Course.astro`.

Recommended conservative approach:

- Extend `Lesson.astro` to accept optional `topControls` and `bottomControls` slots if Astro slots are practical.
- Otherwise add explicit props to render progress controls.

#### 3. External Lesson Content

**Files**:

- `src/pages/external/[courseId]/[lessonId].astro`
- `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Changes**:

- Render content variant control after the `h1`/Markdown button area.
- Render second content variant control after the lesson body.
- Use English labels for English prework.

#### 4. Synchronization

**Files**:

- `src/components/progress/LessonProgressToggle.svelte`
- Any related tests.

**Changes**:

- All toggles for the same identity on a page must update after one changes.
- Use a deterministic identity key:

```ts
`${courseSlug}:${language ?? ''}:${lessonId}`
```

- When one toggle changes, dispatch `window.dispatchEvent(new CustomEvent('lesson-progress:changed', { detail }))`.
- Other toggle instances listen and update if the key matches.
- Rollback should also emit the corrected state so all instances stay consistent.

### Success Criteria

#### Automated Verification

- [x] Toggle synchronization tests pass.
- [ ] Regular lesson rendering tests, if added, pass.
- [ ] Full test suite passes: `npm run test`.
- [x] Production build passes: `npm run build`.

#### Manual Verification

- [ ] Top control toggles sidebar state immediately.
- [ ] Bottom control toggles sidebar state immediately.
- [ ] Sidebar toggle updates top and bottom controls immediately.
- [ ] Failed save rolls all controls back to the previous state.
- [ ] Long lesson pages keep controls visually understandable and non-overlapping.

**Implementation Note**: Pause after this phase for manual confirmation across regular, external, and prework lessons.

---

## Phase 6: Tests + Manual Verification Guide

### Overview

Finish focused automated coverage and document manual browser verification since e2e automation is out of scope for v1.

### Changes Required

#### 1. Service Tests

**File**: `src/server/supabase/lessonProgressService.test.ts`

Cover:

- Batch read maps rows to app records.
- Language `null` query uses `.is('language', null)`.
- Language-specific query uses `.eq('language', lang)`.
- Completing a lesson upserts exact identity.
- Uncompleting deletes exact identity.
- Supabase errors throw useful messages.

#### 2. API Tests

**File**: `tests/api/lesson-progress.test.ts`

Cover the cases listed in Phase 2.

#### 3. Component Tests

**Files**:

- `src/components/progress/LessonProgressToggle.test.ts`
- `src/components/sidebar/LessonSidebar.test.ts`

Cover:

- Initial complete/incomplete render.
- Optimistic success.
- Optimistic failure rollback.
- Custom event synchronization across two controls.
- Sidebar anchor and toggle separation.

#### 4. Manual QA Notes

**File**: `thoughts/shared/plans/2026-04-28-course-lesson-progress.md`

Keep the manual checklist below in the plan; no separate doc is required unless implementation starts to drift.

Manual test matrix:

1. Regular course:
   - Open `/courses/cursor-ai/lesson/{lessonId}` as an authenticated user with access.
   - Toggle complete from sidebar.
   - Reload page.
   - Confirm sidebar/top/bottom controls remain completed.
   - Toggle incomplete from bottom control.
   - Navigate to next lesson and back.
   - Confirm previous lesson remains incomplete.
2. External course:
   - Open `/external/{courseId}/{lessonId}`.
   - Toggle from top control.
   - Confirm sidebar updates without navigation.
   - Navigate to another lesson and back.
3. Prework PL/EN:
   - Open `/external/10xdevs-3-prework/pl/01`.
   - Mark complete.
   - Open `/external/10xdevs-3-prework/en/01`.
   - Confirm EN is still incomplete.
   - Mark EN complete.
   - Return to PL and confirm PL remains complete.
4. Failure behavior:
   - Temporarily force progress loader failure locally.
   - Confirm lesson content renders and progress controls are hidden.
   - Temporarily force API failure.
   - Confirm optimistic UI rolls back and shows local error.
5. Accessibility:
   - Tab through sidebar.
   - Confirm toggle and lesson link are separate focus targets.
   - Confirm Enter/Space on toggle changes progress.
   - Confirm Enter on link navigates.

### Success Criteria

#### Automated Verification

- [x] `npm run test -- src/server/supabase/lessonProgressService.test.ts`
- [x] `npm run test -- tests/api/lesson-progress.test.ts`
- [x] `npm run test -- src/components/progress src/components/sidebar/LessonSidebar.test.ts`
- [ ] `npm run test`
- [x] `npm run build`

#### Manual Verification

- [ ] Manual test matrix above passes.
- [ ] No browser e2e test setup was added.
- [ ] No checklist progress UI appears.
- [ ] No aggregate course progress appears.

**Implementation Note**: After automated verification passes, pause for human manual testing before considering the feature done.

---

## Testing Strategy

### Unit Tests

- `lessonProgressService` maps/query/writes/deletes correctly.
- Validation helpers reject unsupported route identities.
- `LessonProgressToggle` handles optimistic success/failure.
- Toggle synchronization updates all controls with the same identity key.

### API Tests

- Authenticated batch read.
- Authenticated complete/incomplete toggle.
- Unauthorized request.
- Invalid course/language/lesson/completed payloads.
- Service failure response.

### Component Tests

- Sidebar renders progress toggles only when progress scope exists.
- Sidebar toggle is not inside the lesson anchor.
- Checklist rows do not receive progress toggles.
- English labels render for English prework.

### Manual Testing

Manual verification is required for:

- Real browser click separation between sidebar toggle and anchor.
- Persistence across reload/navigation.
- Prework PL/EN isolation.
- Failure fallback behavior.
- Keyboard accessibility.

## Performance Considerations

- One server-side batch read per lesson page is acceptable for current course sizes.
- Avoid per-lesson fetches during sidebar render.
- Single-item writes keep mutation payloads small and easy to retry/rollback.
- The table index on `user_id, course_slug, language` matches the primary read path.
- The UI should not compute aggregate progress because that is out of scope.

## Migration Notes

- Apply the migration before deploying route/UI code that expects `lesson_progress`.
- There is no backfill; all students start with no completed lessons.
- Route identity means future lesson ID changes create new progress identities. If content IDs are renamed later, add a one-off SQL migration to update `lesson_id` for affected course/language rows.
- If the nullable-language unique index strategy is used, test both null and non-null language uniqueness locally before deployment.

## Rollback Strategy

- If UI/API code causes issues, hide progress controls by not passing progress props while leaving the table in place.
- If API writes fail in production, existing lesson access remains unaffected.
- The migration is additive. Rolling back the feature does not require dropping the table immediately.

## References

- Regular course lesson shell: `src/components/Course.astro:24`
- Regular sidebar props: `src/components/Course.astro:62`
- External lesson shell progress/personalization merge point: `src/layouts/ExternalLessonLayout.astro:79`
- Shared sidebar component: `src/components/sidebar/LessonSidebar.svelte:46`
- Sidebar prop types: `src/components/sidebar/types.ts:5`
- Regular Supabase-backed auth: `src/server/verifyAuth.ts:43`
- External Supabase-backed auth: `src/server/externalAuth.ts:67`
- Supabase service pattern: `src/server/supabase/quizResultService.ts`
- API auth/service/test pattern: `src/pages/api/quiz-result.ts:37`
- Current test scripts: `package.json:20`

<!-- PLAN STATUS: Last Phase Completed: 5, Next Phase: 6, Updated: 2026-04-28 -->
