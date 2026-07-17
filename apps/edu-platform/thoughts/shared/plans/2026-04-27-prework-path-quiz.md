# Prework Path Quiz Implementation Plan

## Overview

Build a localized diagnostic quiz for 10xDevs 3.0 prework that recommends a personalized agenda of lessons and sections. The quiz should live under the localized prework shell, persist results cross-device in Supabase, and introduce a reusable quiz-results foundation for future courses and quizzes.

Canonical routes:

- `/external/10xdevs-3-prework/pl/quiz`
- `/external/10xdevs-3-prework/en/quiz`

The quiz is not a generic survey builder. Question definitions and recommendation mapping can remain server/code-side for now, but persistence must be generic enough for future quizzes across other courses.

## Current State Analysis

Prework lessons are served from localized external routes:

- `/external/[courseId]/[lang]/[lessonId].astro` renders individual localized prework lessons.
- `/external/[courseId]/[lessonId].astro` renders the language index for `pl` / `en`.
- `src/server/content/preworkContent.ts` defines `PREWORK_COURSE_ID`, `PreworkLanguage`, lesson loading, adjacency, and the single `Prework` course section.

Authentication for prework already goes through `verifyExternalAuth()`, which accepts the unified `token` cookie and validates access for `10xdevs-3-prework`. Supabase is already available server-side through service-role APIs, with existing patterns in `src/server/supabase/*`.

Supabase currently has durable tables for users, access grants, game state, API tokens, and system flags. There is no quiz-result table yet, so this feature needs a new generic persistence table.

The first prework lesson already introduces the quiz concept and has a visible place for CTA copy:

```md
## Rozwiąż Quiz i zbuduj swój prework
```

## Desired End State

Participants can open the quiz from the PL/EN prework index or lesson 1 CTA. After answering diagnostic questions, they see a localized agenda of recommended lessons in prework order, each with a short reason and a link to the correct localized lesson route.

The latest result is persisted cross-device in Supabase per user, course, quiz, and language. If API sync fails, the client still shows the result and stores it in `localStorage` as a fallback.

The data model supports future quizzes by using `course_slug + quiz_slug + language` instead of a prework-specific table.

## What We're NOT Doing

- Not building a full quiz CMS or admin editor.
- Not storing full attempt history in v1; only the latest result per user/course/quiz/language is stored.
- Not embedding the full interactive quiz inside lesson HTML in v1.
- Not adding a GitHub Copilot lesson; the tools branch is Cursor or Claude Code.
- Not replacing the existing `/pl` and `/en` language indexes with the quiz.
- Not changing the prework auth model.

## Key Decisions

- **Persistence**: Supabase from v1, not only `localStorage`.
- **Table shape**: generic `quiz_results`, not `prework_quiz_results`.
- **Uniqueness**: latest result keyed by `(user_id, course_slug, quiz_slug, language)`.
- **Quiz slug**: `prework-path`.
- **Question version**: fixed string version stored with results.
- **Routes**: `/external/10xdevs-3-prework/pl/quiz` and `/external/10xdevs-3-prework/en/quiz`.
- **Result UX**: agenda with reasons, not only a raw checklist.
- **Lesson 04**: always recommended.
- **Environment intros**: `05` Cursor and `06` Claude Code are conditional based on participant needs.

## Implementation Approach

Add a dedicated localized quiz route under the existing external lesson shell:

```text
src/pages/external/[courseId]/[lang]/quiz.astro
```

The route should:

- validate `courseId === PREWORK_COURSE_ID`
- validate `lang` with `isPreworkLanguage`
- require `verifyExternalAuth`
- use `ExternalLessonLayout` so the quiz feels like part of prework
- pass the current localized lesson list/sidebar context
- render a Svelte island for the interactive quiz

Add a shared TypeScript quiz module for prework:

```text
src/lib/quiz/preworkPathQuiz.ts
```

This module should own:

- quiz slug and version constants
- PL/EN question copy
- PL/EN result copy
- answer/result types
- recommendation-building logic
- localized lesson links

Add a generic Supabase service and API:

```text
src/server/supabase/quizResultService.ts
src/pages/api/quiz-result.ts
```

The API should support:

- `GET /api/quiz-result?courseSlug=...&quizSlug=...&language=...`
- `PUT /api/quiz-result`

The API recalculates the quiz result from submitted answers server-side before saving. The client can calculate locally for immediate fallback UX, but server-side mapping remains authoritative for persisted data.

## Supabase Schema

Add migration:

```text
supabase/migrations/20260427000000_quiz_results.sql
```

Create:

```sql
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,
  quiz_slug text not null,
  language text not null,
  question_version text not null,
  answers jsonb not null,
  result jsonb not null,
  completed_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_slug, quiz_slug, language)
);

create index on public.quiz_results(user_id);
create index on public.quiz_results(course_slug, quiz_slug);

alter table public.quiz_results enable row level security;
```

RLS remains enabled for defense in depth. Application access goes through service-role server-side code, consistent with existing Supabase tables.

## Prework Recommendation Logic

Always recommend:

- `04` Agent w IDE, Terminalu czy w Chmurze?
- `07` Agent-Native IDE
- `15` Dobry i zły projekt kursowy
- `16` Checklista uczestnika i support

Conditionally recommend:

- `02` if the participant is not confident distinguishing chatbot, agent, model, and harness.
- `03` if the participant lacks a deliberate way to learn with AI.
- `05` if the participant wants a Cursor intro or chooses the IDE/Cursor path.
- `06` if the participant wants a Claude Code intro or chooses the terminal path.
- `09` if the participant is not confident about LLM impact on everyday programming work.
- `10` if the participant lacks prompting patterns.
- `11` if the participant does not consciously manage context/thread lifecycle.
- `12` if the participant is unsure how to communicate with an agent.
- `13` if the participant is unsure how to choose models and stay current.
- `14` if any core stack element is unclear: Astro, React, TypeScript, Tailwind CSS, Supabase, Cloudflare, HTTP/API, or running a starter.

Recommendations must be sorted by numeric lesson order and link to the active language:

```text
/external/10xdevs-3-prework/{pl|en}/{lessonId}
```

## Phase 1: Generic Quiz Persistence

### Changes Required

1. Add `quiz_results` Supabase migration.
2. Add `src/server/supabase/quizResultService.ts` with `loadQuizResult()` and `saveQuizResult()`.
3. Add `src/pages/api/quiz-result.ts`.
4. Use `verifyExternalAuth()` for the requested `courseSlug`.
5. Use `upsertUser()` after auth so toolkit-backed users without a profile can still persist quiz results.
6. Validate supported quiz identifiers in v1:
   - `courseSlug === '10xdevs-3-prework'`
   - `quizSlug === 'prework-path'`
   - `language in ('pl', 'en')`

### Acceptance Criteria

- Unauthorized users get `401`.
- Unsupported quiz/course/language gets `400`.
- Valid `GET` returns the latest stored result or `null`.
- Valid `PUT` recalculates result and upserts the row.
- Re-solving the same quiz overwrites the latest result for that user/course/quiz/language.
- PL and EN results do not overwrite each other.

## Phase 2: Prework Quiz Domain Module

### Changes Required

1. Add `src/lib/quiz/preworkPathQuiz.ts`.
2. Define serializable question data for PL and EN.
3. Define localized intro/result UI copy.
4. Define `buildPreworkQuizResult(answers, language)`.
5. Keep the recommendation logic deterministic and pure.

### Acceptance Criteria

- Always-recommended lessons are present for minimal answers.
- Cursor and Claude Code intros are independent conditional recommendations.
- Each 3.x diagnostic question maps to its own lesson.
- Missing any stack item recommends lesson `14`.
- PL and EN results have the same lesson IDs but localized titles/links.

## Phase 3: Quiz UI and Routes

### Changes Required

1. Add `src/pages/external/[courseId]/[lang]/quiz.astro`.
2. Add `src/components/prework/PreworkPathQuiz.svelte`.
3. Render quiz inside `ExternalLessonLayout`.
4. On mount, load local fallback first, then remote Supabase result.
5. On submit, calculate result locally for immediate display and save via API.
6. If save/read fails, keep result in `localStorage` and show a warning.
7. Add "take again" flow that resets the visible result and lets the participant submit new answers.

### Acceptance Criteria

- `/pl/quiz` and `/en/quiz` are protected by existing external auth.
- Unauthenticated users are redirected to external login with a return URL.
- Authenticated users see localized quiz copy.
- Saved results load when revisiting.
- Result cards show lesson title, reason, and localized lesson link.
- Client remains usable when `/api/quiz-result` fails.

## Phase 4: Entry Points

### Changes Required

1. Add a prominent quiz card/link to the top of existing PL/EN prework language indexes.
2. Add CTA copy to lesson 1:
   - PL source Markdown links to `/external/10xdevs-3-prework/pl/quiz`.
   - EN generated/scaffold content links to `/external/10xdevs-3-prework/en/quiz` if applicable in the current content pipeline.
3. Regenerate/check lesson HTML using existing scripts.

### Acceptance Criteria

- `/external/10xdevs-3-prework/pl` shows a visible quiz entry point.
- `/external/10xdevs-3-prework/en` shows a visible quiz entry point.
- Lesson 1 includes a visible CTA to the quiz.
- Generated lesson HTML checks pass.

## Phase 5: Tests and Verification

### Automated Tests

Add tests for:

- `buildPreworkQuizResult`
- `/api/quiz-result`
- unsupported quiz validation
- unauthenticated API access
- save/load service behavior through mocked Supabase/service dependencies

Run:

```bash
npx vitest run src/lib/quiz/preworkPathQuiz.test.ts tests/api/quiz-result.test.ts
npm run test
npm run build
```

### Manual Verification

Verify on a built/deployed environment:

- Unauthenticated `/external/10xdevs-3-prework/pl/quiz` redirects to login.
- Authenticated `/external/10xdevs-3-prework/pl/quiz` renders the quiz page, not 404.
- `/api/quiz-result` exists in production after deploy.
- The `PreworkPathQuiz` client asset exists in production after deploy.
- Solving the quiz inserts/updates a row in `quiz_results`.
- Refreshing the page loads the saved result.

## Deployment Notes

The database migration must be pushed before relying on cross-device persistence:

```bash
supabase db push
```

Cloudflare Pages production must deploy a build that contains:

- `src/pages/external/[courseId]/[lang]/quiz.astro`
- `src/pages/api/quiz-result.ts`
- `src/components/prework/PreworkPathQuiz.svelte`

If production returns:

- `302` for unauthenticated `/external/10xdevs-3-prework/pl/quiz`: route exists and auth is working.
- `404` for authenticated `/external/10xdevs-3-prework/pl/quiz`: production is likely running a build without the quiz route, or routing priority is not updated.
- `404` for `/api/quiz-result`: production is definitely running a build without the quiz API endpoint.

## Rollback Plan

If the UI causes issues, remove or hide the quiz entry points while leaving the table in place. The `quiz_results` table is additive and does not affect existing auth/content flows.

If the API causes runtime errors, disable the client sync calls temporarily and rely on `localStorage` while debugging. Existing course access and lesson rendering remain independent from quiz persistence.

## Success Criteria

- Participants can access the localized quiz after login.
- The quiz recommends the intended lessons according to the agreed logic.
- Results persist across devices via Supabase.
- Future quizzes can reuse the same `quiz_results` table by choosing a different `quiz_slug`.
- `npm run test` and `npm run build` pass.
