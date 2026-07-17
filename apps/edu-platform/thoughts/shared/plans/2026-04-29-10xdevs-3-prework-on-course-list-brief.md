# 10xDevs 3.0 Prework on /courses — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-29-10xdevs-3-prework-on-course-list.md`

## What & Why

Add a "10xDevs 3.0: Prework" tile to the authenticated `/courses` page so eligible users can navigate to prework content directly from their dashboard. Today, prework lives only at `/external/10xdevs-3-prework` and is invisible to users who land on `/courses` first.

## Starting Point

`CourseList.astro` filters tiles by `customerPurchases: AirtableCourse[]` from `verifyAuth`. That signal is built from Supabase `access_grants` (with Airtable fallback) collapsed through `PERMISSION_MAPPINGS` — which means `10xdevs-3` and `10xdevs-3-prework` share the same `10XDEVS_3` value and are indistinguishable. Prework's production-primary eligibility path (Toolkit KV) doesn't write to `access_grants` at all, so a non-trivial slice of eligible users wouldn't appear in the existing signal even after a type extension.

## Desired End State

Eligible users see a prework tile on `/courses` regardless of which path granted them access (Airtable, Toolkit KV, or Circle). CourseList becomes uniformly slug-driven: every tile, including prework, filters by `accessibleCourseSlugs.includes('<slug>')`. A new server-side helper `getAccessibleCourseSlugs(email, env)` is the single source of truth for "what should I show this user" — a clean extension point for future course tiles.

## Key Decisions Made

| Decision                                  | Choice                                                            | Why (1 sentence)                                                                                              | Source |
| ----------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------ |
| Eligibility source for tile visibility    | Dedicated server-side check at `/courses` render time             | Catches all three eligibility paths including Toolkit-KV-only users (production primary path)                 | Plan   |
| Tile placement                            | Inline in the existing 'Twoje szkolenia' grid                     | Matches user mental model of "a course I have access to"; no new UI structures                                | Plan   |
| Tile destination                          | `/external/10xdevs-3-prework`                                     | Existing canonical entry point; `verifyExternalAuth` handles auth + redirect on its own                       | Plan   |
| How CourseList knows about prework access | Replace `customerPurchases` entirely with `accessibleCourseSlugs: CourseSlug[]` | Treats prework like any other course — uniform filter, future-proofs other slug-specific tiles, no one-off    | Plan   |
| Where eligibility logic lives             | New module `src/server/access/courseAccess.ts`                    | Keeps `verifyAuth` focused on auth; `courseAccess` owns "who sees what"; easy to extend with new sources      | Plan   |
| Tile copy & visual                        | "10xDevs 3.0: Prework" + indigo/violet gradient + new thumbnail   | Polish-language consistency; gradient distinct from existing courses; new asset needed (none exists today)    | Plan   |

## Scope

**In scope:**
- New helper module `src/server/access/courseAccess.ts` with `getAccessibleCourseSlugs(email, env)`
- New helper `airtableCoursesToCourseSlugs` in `CollectionMappings.ts` for the Airtable fallback path
- CourseList prop refactor (`customerPurchases` → `accessibleCourseSlugs`) including all five existing tiles
- New prework tile entry + thumbnail asset
- `/courses.astro` wiring to call the helper and pass the new prop
- Unit tests for the new helper

**Out of scope:**
- Adding a tile for the 10xDevs 3.0 main course (only prework requested)
- Adding `10XDEVS_3_PREWORK` to the `AirtableCourse` enum
- Extending login-time sync to write Toolkit-KV → access_grants (Toolkit KV stays request-time-only)
- Refactoring `verifyAuth` to return slug arrays directly
- Replacing CourseList's static tile array with server-computed Course[] data

## Architecture / Approach

`/courses.astro` calls `verifyAuth` (unchanged), then calls the new `getAccessibleCourseSlugs(email, env)`, then passes the result to `<CourseList accessibleCourseSlugs={...} />`. The helper internally cascades: grants table (cheapest) → if prework not yet present, Toolkit KV check (production primary) → Circle membership resolution (slowest fallback), with fire-and-forget grant upsert on the Circle path. CourseList becomes a pure slug-filter renderer.

## Phases at a Glance

| Phase                                            | What it delivers                                                                                                                                  | Key risk                                                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1. Server-side unified course access helper      | `getAccessibleCourseSlugs` + `airtableCoursesToCourseSlugs` + unit tests. Not yet wired into pages.                                               | Misordered cascade or env-shape mismatch with existing helpers (mitigated by mirroring `verifyExternalAuth`).                  |
| 2. Refactor CourseList signal & add prework tile | Slug-based prop, 5 existing tile checks updated, new prework tile, thumbnail asset, `/courses.astro` wired up. Manual verification of all paths. | Slug typo in any of the five rewritten `isAvailable` checks silently hides a course; mitigated by manual regression check.    |

**Prerequisites:** No external dependencies. The Toolkit KV binding, Circle KV cache, Supabase secrets, and Airtable key are already provisioned. A 10xDevs 3.0 thumbnail asset needs to be obtained or created during Phase 2; if unavailable, Phase 2 ships with a gradient-only tile and the asset can land separately.

**Estimated effort:** ~1 focused session (2 phases, mostly straightforward composition of existing primitives).

## Open Risks & Assumptions

- Assumes the runtime env wiring pattern used by `verifyExternalAuth`'s callers (Astro.locals.runtime.env merged with `astro:env/server` secrets) is reproducible in `/courses.astro`. Verify during Phase 2.
- Assumes a usable 10xDevs 3.0 thumbnail will be available at implementation time; if not, ship Phase 2 with a gradient-only tile until art lands.
- Per-`/courses` render adds at most one Toolkit KV read + one Circle membership resolution for users not already holding a prework grant — assumed acceptable given existing KV cache TTLs and the Circle-source upsert that turns subsequent visits into grants-only reads.

## Success Criteria (Summary)

- A user with prework access via any of the three paths (Airtable, Toolkit KV, Circle) sees the tile on first `/courses` visit and can click through to `/external/10xdevs-3-prework`.
- All five existing tiles continue to appear correctly for paying customers (no regression from the slug refactor).
- `/courses` render time stays in the same range for users without prework eligibility.
