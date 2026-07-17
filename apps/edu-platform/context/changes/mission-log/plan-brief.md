# 10xDevs Mission Log — Plan Brief

> Full plan: `context/changes/mission-log/plan.md`

## What & Why

Add a personal mission log for 10xDevs 3.0 students where they can browse the 25 course lessons (5 modules × 5) and generate a custom space-themed badge per lesson via the external `https://badges.10xdevs.pl` API. The feature ships into the `/courses` "Dodatki do szkoleń" section as a sibling of Space Explorers and is the first user of a new reusable course-gating mechanism that the main 10xDevs 3.0 course rollout will also consume.

## Starting Point

The edu-platform already has 10xDevs 3.0 access detection, profile + Supabase-hosted avatars, and a hardcoded "Dodatki do szkoleń" section. The main `lessons10xDevs3` content collection is empty today, no per-user quota system exists yet, and there is no time-based content gating anywhere in the codebase.

## Desired End State

A 10xDevs 3.0 student sees a "10xDevs Mission Log" tile on `/courses` and lands on `/10xdevs-3/mission-log`, where five module rows reveal one per week starting 2026-05-18. For each unlocked lesson they can press Generate, which calls our Worker proxy → badges.10xdevs.pl with their avatar URL → returns a personalised badge image. The student gets two lifetime attempts per lesson; the server enforces the cap regardless of client state.

## Key Decisions Made

| Decision                | Choice                                                       | Why                                                                                                   | Source |
| ----------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------ |
| Lesson scope            | 25 lessons in 5 modules × 5 (typed catalog)                  | Main `lessons10xDevs3` collection is empty; catalog decouples Mission Log from content authoring      | Plan   |
| Module gating           | New shared `src/server/courseGating/` module + config map    | Reusable for the future main 10xDevs 3.0 launch (user-stated requirement)                             | Plan   |
| Lesson → badge mapping  | Static curated map in code (`MISSION_LOG_LESSON_CATALOG`)    | Editorial control, stable identity, mirrors `CollectionMappings.ts` pattern                           | Plan   |
| Quota                   | 2 lifetime per (user, lesson), Supabase-backed counter       | Matches "max 10/week across 5 lessons" arithmetic; simplest durable state; no clock math              | Plan   |
| API path                | Server proxy via `/api/mission-log/*` Worker routes          | Origin matches whitelist, email/avatar unspoofable, quota authoritative, mirrors Circle/Airtable      | Plan   |
| Avatar precondition UX  | Inline modal + CTA to `/profile?next=/10xdevs-3/mission-log` | Preserves intent on round-trip; doesn't duplicate avatar upload UI                                    | Plan   |
| List read               | Always live (no cache)                                       | Page hydrates from our own `mission_log_generations` table; upstream `/list` not used in render path  | Plan   |
| 10xDevs 3.0 access gate | `verifyAuth(Astro, '10xdevs-3')` + `purchases.includes(...)` | Already authoritative for prework gating; pattern composes cleanly with the toolkit-KV membership     | Plan   |

## Scope

**In scope**
- New page `/10xdevs-3/mission-log` (Astro + Svelte island)
- `GET /api/mission-log/state` and `POST /api/mission-log/generate`
- New `mission_log_generations` Supabase table + migration
- Reusable `courseGating` module (config + helpers) seeded with 10xDevs 3.0 dates
- Avatar-required modal + `?next=` round-trip on `/profile`
- New conditional tile in `CourseList.astro` "Dodatki do szkoleń" section

**Out of scope**
- Authoring/migrating real 10xDevs 3.0 lesson HTML
- `/external/...` embed of Mission Log
- Mirroring badge image artifacts into our storage
- MailerLite / analytics / Slack notifications on generation
- Admin UI for editing module unlock dates

## Architecture / Approach

Three thin vertical phases. Phase 1 is pure code (gating helpers + lesson catalog, fully unit-testable). Phase 2 adds the Supabase quota table, a `quotaService`, a `badgesApiClient`, and two Worker routes that compose all policy in one place: `auth → 10xDevs 3.0 access → avatar → module unlocked → quota → upstream generate → record`. Phase 3 builds the Astro page, the Svelte island grid (custom deep-purple/cyan/green theme), the avatar modal, and the conditional courses-index tile. The upstream badges API is treated as a dumb image generator — our DB is the source of truth for quota and what the user has earned; the upstream is the source of truth for the image asset itself.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Foundation — gating + catalog | Reusable `courseGating` module; 25-lesson static catalog with 1:1 badge map | Catalog placeholder titles need replacement before launch |
| 2. Server — proxy + quota + API | Supabase migration, `quotaService`, `badgesApiClient`, two Worker routes with full policy gates | Badges API must whitelist our origin (`https://przeprogramowani-edu.pages.dev`) before launch — coordination prerequisite |
| 3. UI — page + grid + tile | Astro page, Svelte grid, avatar modal, conditional courses-index tile | Theming work + first-time-use UX (avatar round-trip) needs hands-on verification |

**Prerequisites**: badges.10xdevs.pl origin-whitelist update for `https://przeprogramowani-edu.pages.dev`; cohort schedule confirmed (5 Mondays starting 2026-05-18); 25 Polish lesson titles supplied (or placeholders accepted for first ship).

**Estimated effort**: ~3 focused sessions (one per phase), each shippable.

## Open Risks & Assumptions

- Badges API origin whitelist for our domain is a hard release blocker; tracked as Phase 2 manual verification item.
- Upstream 429 on cohort-launch Mondays is plausible; mitigation is "do not consume quota on upstream failure" + a UI "Spróbuj za chwilę" banner, no automatic retries.
- The lesson catalog ships with placeholder titles unless final copy is supplied during Phase 1; that copy update is the only Phase 1 manual item.
- `purchases.includes('10XDEVS_3')` semantics assume the existing prework-eligibility / toolkit-KV pipeline correctly surfaces `10xdevs-3` for paying customers — already in place for the prework path, reused here.

## Success Criteria (Summary)

- A 10xDevs 3.0 student sees the Mission Log tile in `/courses`, lands on the page, sees five module rows with correct unlock dates, and can generate up to 2 badges per lesson once the module unlocks and the avatar is set.
- A non-10xDevs-3.0 user does not see the tile and cannot reach the page.
- The server rejects every off-policy attempt (missing avatar, locked module, exhausted quota, missing access) regardless of client state.
