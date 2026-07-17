# Course Lesson Progress — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-28-course-lesson-progress.md`

## What & Why

Add Supabase-backed lesson completion progress for each authenticated student and course. The first version focuses on manual, reversible lesson completion with visible toggles in the sidebar and at the top and bottom of lesson pages, so students can track what they have actually finished.

## Starting Point

The platform already resolves authenticated users through Supabase-backed auth flows and renders regular, external, and prework lessons through shared sidebar components. There is no current lesson progress table, API, or UI state; tests are Vitest-based and there is no Playwright/e2e stack in `package.json`.

## Desired End State

Students can mark individual lessons complete or incomplete. Sidebar lesson rows show a separate completion toggle while the lesson anchor still only navigates. Regular courses, external courses, and `10xdevs-3-prework` PL/EN use the same progress model, with prework language treated as part of the course identity.

## Key Decisions Made

| Decision | Choice | Why |
| --- | --- | --- |
| Completion semantics | Manual completion | A student action is more trustworthy than passive page views. |
| Reversibility | Toggle complete/incomplete | Accidental clicks must be easy to undo. |
| Prework identity | PL and EN tracked separately | Language is part of the routed learning path and may diverge. |
| Sidebar indicator | Lesson-level toggle only | Course-wide aggregate progress is explicitly out of scope for v1. |
| Lesson page controls | Top and bottom | Long lessons need ergonomic access before and after reading. |
| Sidebar behavior | Separate toggle component beside navigation anchor | Clicking progress changes progress; clicking the lesson link navigates. |
| Mutation UX | Optimistic update with rollback | Keeps the UI responsive while preserving saved-state correctness. |
| Lesson identity | Stable route identity | `course_slug`, optional `language`, and `lesson_id` are debuggable and fit all current routes. |
| Checklist scope | Excluded | The first version tracks lessons only. |
| API shape | Batch read, single-item writes | Sidebars need efficient reads; toggles are simpler one item at a time. |
| Auth failure behavior | Hide progress controls | Course access should not break just because progress lookup fails. |
| E2E investment | Manual testing only for now | The repo has no e2e stack today and the user will verify manually. |

## Scope

**In scope:**

- New Supabase migration for lesson progress.
- Supabase service for course progress reads and one-lesson toggles.
- API endpoints or route helpers for authenticated progress read/write.
- Regular course, external course, and prework PL/EN integration.
- Svelte sidebar lesson toggle as a separate control from navigation.
- Lesson page controls at top and bottom.
- Optimistic client updates with rollback on failure.
- Vitest coverage for service/API/component behavior.
- Manual verification checklist.

**Out of scope:**

- Overall course progress percentage or progress bar.
- External checklist progress.
- Automatic viewed/read tracking.
- Admin reporting, analytics dashboards, or exports.
- Playwright/e2e setup.
- Backfilling historical completions.

## Architecture / Approach

Create a `lesson_progress` table keyed by `user_id`, `course_slug`, nullable `language`, and `lesson_id`. Server routes batch-load progress for the current course and pass completion state into the shared sidebar and lesson content controls. Client-side Svelte controls optimistically call a single-item toggle API, update all matching controls on the page, and rollback if the save fails.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Schema + Service | Migration and Supabase service for reads/toggles | Key shape must support regular, external, and prework routes without ambiguity. |
| 2. API | Authenticated batch read and single-item toggle endpoint | Must not leak or mutate progress across users/courses. |
| 3. Route Integration | Server-side progress loading for all lesson shells | Progress failures must hide controls without blocking course content. |
| 4. Sidebar UI | Separate progress toggle in `LessonSidebar` | Toggle must not interfere with anchor navigation or accessibility. |
| 5. Lesson Controls | Top/bottom lesson completion controls | Multiple controls for one lesson must stay synchronized. |
| 6. Tests + Manual QA | Vitest coverage and manual verification guide | No browser e2e safety net in v1. |

**Prerequisites:** Supabase service role env vars available locally/prod; migration applied before route code expects the table.

**Estimated effort:** ~2-3 implementation sessions across 6 phases.

## Open Risks & Assumptions

- Lesson IDs are stable enough for route identity to be the v1 key; if content IDs change later, progress migration tooling will be needed.
- `10xdevs-3-prework` language routes remain `pl` and `en`; language is nullable only for non-language courses.
- Progress UI should be hidden, not disabled with explanatory copy, when user ID or progress lookup is unavailable.
- Manual QA is acceptable for browser-level verification in the first release.

## Success Criteria (Summary)

- A student can complete and uncomplete a lesson from the sidebar and lesson content controls.
- Completion persists after reload and navigation, and prework PL/EN do not affect each other.
- Existing lesson access still works if progress lookup fails, with progress controls omitted.
