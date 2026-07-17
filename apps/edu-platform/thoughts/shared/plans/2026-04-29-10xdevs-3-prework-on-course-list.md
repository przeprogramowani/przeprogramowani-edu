# 10xDevs 3.0 Prework on /courses Implementation Plan

## Overview

Surface a "10xDevs 3.0: Prework" tile on the authenticated `/courses` page for every user who is eligible — across all three eligibility paths (Airtable purchase grant, Toolkit KV membership, Circle space membership). To avoid one-off conditionals in the UI, introduce a unified server-side helper `getAccessibleCourseSlugs(email, env)` that returns a `CourseSlug[]`. CourseList becomes a uniform, slug-driven tile renderer, with prework treated as just another course entry.

## Current State Analysis

- `src/pages/courses.astro:28` calls `verifyAuth(Astro)` and passes `authResult.purchases!` (an `AirtableCourse[]`) to `<CourseList />`.
- `src/components/CourseList.astro:23-69` defines a static `allCourses` array; each tile sets `isAvailable: customerPurchases.includes('<AIRTABLE_COURSE>')` and the array is filtered down to available courses on render.
- `verifyAuth` (`src/server/verifyAuth.ts:11-77`) reads `access_grants` (Supabase) → maps `course_slug[]` to `AirtableCourse[]` via `grantsToAirtableCourses` (`src/server/supabase/accessService.ts:53-59`) → falls back to Airtable on error / missing profile.
- `AirtableCourse` does NOT include a separate `10XDEVS_3_PREWORK`; `PERMISSION_MAPPINGS['10xdevs-3-prework'] = '10XDEVS_3'` (`src/models/CollectionMappings.ts:52`). Reverse-mapping grants → AirtableCourse therefore collapses prework and the main 10xDevs 3.0 grant into a single signal — the existing prop shape cannot distinguish them.
- The three prework eligibility sources today:
  - **Airtable sync** (`src/server/supabase/airtableSyncService.ts:19`) — granting `10XDEVS_3` writes both `10xdevs-3` and `10xdevs-3-prework` slugs to `access_grants`.
  - **Toolkit KV** (`src/server/toolkit/tenXDevs3Membership.ts:82-178`) — `checkTenXDevs3ToolkitMembership(email, '10xdevs-3-prework', env)` already handles the prework courseId (line 87). Production primary path. **Does NOT persist to access_grants** by design.
  - **Circle membership** (`src/server/circle/membershipResolver.ts` via `resolveMembership`) — `EXTERNAL_AUTH_CONFIG['10xdevs-3-prework']` exists (`src/server/circle/externalAuthConfig.ts:54-61`).
- `verifyExternalAuth` (`src/server/externalAuth.ts:27-109`) already cascades these three checks for one course at a time, and writes a Circle-source grant on success (line 100). It is the existing template for the helper this plan introduces.
- Available course thumbnails in `src/assets/images/courses/`: `kurs-ofe.jpg`, `kurs-ots.jpg`, `kurs-cursor.png`, `game-explorers.png`. **No 10xDevs prework thumbnail exists today.**

## Desired End State

A user who logs in to `/courses` sees a "10xDevs 3.0: Prework" tile alongside their other course tiles whenever they have access via any of the three eligibility paths. Clicking the tile takes them to `/external/10xdevs-3-prework`. CourseList no longer reads `AirtableCourse[]`; every existing tile filters on a `CourseSlug` instead. The prework tile is added as a regular row in the same `allCourses` array — no special-casing. A new server-side helper `getAccessibleCourseSlugs(email, env)` is the single source of truth for "which courses can this user see."

### Verification:
- Authenticated user with only Toolkit-KV prework access (no Supabase grant) sees the prework tile on first `/courses` visit and is redirected into `/external/10xdevs-3-prework` content (not the login page) when they click it.
- Authenticated user with no 10xDevs 3.0 access does NOT see the tile.
- All five existing tiles (OFE, OFE Live, Cursor, OTS Core, OTS React) continue to appear correctly for users with the corresponding Airtable purchase.
- `npm run build` passes; `npm run test` passes.

### Key Discoveries:

- `checkTenXDevs3ToolkitMembership` already supports prework as `courseId` (`src/server/toolkit/tenXDevs3Membership.ts:87`).
- `EXTERNAL_AUTH_CONFIG` already has a prework entry (`src/server/circle/externalAuthConfig.ts:54-61`), so `resolveMembership(email, '10xdevs-3-prework', env)` works without new config.
- `accessService.upsertGrant` accepts `source: 'free' | 'airtable' | 'circle' | 'manual'` (`src/server/supabase/accessService.ts:32`). The Circle-source value matches the precedent set by `verifyExternalAuth:100`.
- `grantsToAirtableCourses` deduplicates by AirtableCourse value but loses CourseSlug granularity — that's why prework cannot be detected through the existing prop without also returning the underlying slug list.
- One Airtable fallback edge: `verifyAuth` returns `AirtableCourse[]` from Airtable when the user has no Supabase profile yet. The new helper must reverse-expand AirtableCourse[] back to all CourseSlug[] that share that permission (e.g. `OPANUJ_FRONTEND` → `['opanuj-frontend', 'opanuj-frontend-live']`).

## What We're NOT Doing

- Not adding a tile for the 10xDevs 3.0 main course (only prework, per the task scope).
- Not adding `10XDEVS_3_PREWORK` to the `AirtableCourse` enum (prework is not a separate Airtable product).
- Not extending login-time sync to write Toolkit-KV → access_grants. The helper grants on-demand from the `/courses` render path; that's enough to make the tile appear, and it preserves Toolkit KV's request-time-only design.
- Not refactoring `verifyAuth` to return `accessibleCourseSlugs` directly. The new helper composes on top of `verifyAuth` and stays separately testable.
- Not changing the `AuthResult.purchases` shape used elsewhere (e.g. for course-specific gating in `verifyAuth(Astro, courseSlug)`); we only change what `/courses` passes to CourseList.
- Not introducing a Course[] data structure computed server-side. Tile UI metadata (title, theme, image) stays in CourseList where it logically lives.

## Implementation Approach

Build a single-purpose server-side helper that combines the existing grants signal with a prework-specific eligibility cascade (toolkit KV → Circle), upserting the grant on Circle hit. Then refactor CourseList to consume `accessibleCourseSlugs: CourseSlug[]` and add prework as one more entry in `allCourses`. The component shape becomes uniform — every tile filters by `accessibleCourseSlugs.includes('<slug>')`, with no special branches.

## Critical Implementation Details

- **Order of checks in the helper**: grants table is checked first (cheapest, covers Airtable-synced and previously-Circle-synced users). Toolkit KV is checked second when the courseId is `10xdevs-3-prework` — production primary path, single KV read. Circle membership is the slowest fallback and may hit the Circle API. This ordering matches `verifyExternalAuth` precedent (`src/server/externalAuth.ts:53-94`) and keeps `/courses` fast for the common case.
- **Grant upsert is fire-and-forget**: when the Circle path succeeds, upsert the grant inside a try/catch with `console.error` on failure — matches `verifyExternalAuth:96-106`. A failed upsert must not block the page render.
- **Toolkit KV deliberately does NOT trigger a grant upsert**: per the toolkit KV design, that path is request-time-only. Re-checking on each `/courses` render is one fast KV `get` per render and avoids polluting the grants table with a parallel state.

---

## Phase 1: Server-side unified course access helper

### Overview

Create a new module that returns the deduped list of `CourseSlug` values a given user can access, combining the Supabase grants table with a prework-specific eligibility check. This is the single function `/courses` (and any future surface) calls to know "what should I show this user."

### Changes Required:

#### 1. New helper module

**File**: `src/server/access/courseAccess.ts`
**Changes**: Export `getAccessibleCourseSlugs(email: string, env): Promise<CourseSlug[]>`. The function (1) looks up `userId` via `getUserIdByEmail`, (2) loads grants via `getGrants` and filters down to known `CourseSlug` values (since the table column is plain `text`), (3) on Supabase miss/error falls back to `getCustomerPurchases` (Airtable) and reverse-expands `AirtableCourse[]` → `CourseSlug[]` using `PERMISSION_MAPPINGS` (one AirtableCourse may map to multiple slugs — must expand all), (4) if `'10xdevs-3-prework'` is not yet in the resulting set, calls a private `checkPreworkEligibility(email, env)` that runs `checkTenXDevs3ToolkitMembership` first, then `resolveMembership` for prework — adding `'10xdevs-3-prework'` to the set on either success and (Circle path only) firing `upsertGrant(userId, '10xdevs-3-prework', 'circle', ...)` inside a try/catch. Returns the deduped slug array.

The `env` parameter type is the union of envs the cascade needs: `ExternalAuthEnv & TenXDevs3ToolkitEnv & { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string; AIRTABLE_API_KEY: string; EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS?: number; }` — same shape `verifyExternalAuth` already uses, minus `JWT_SECRET` (not needed; this helper takes the email, not a token).

#### 2. AirtableCourse → CourseSlug[] reverse-expansion helper

**File**: `src/models/CollectionMappings.ts`
**Changes**: Add an exported helper `airtableCoursesToCourseSlugs(courses: AirtableCourse[]): CourseSlug[]` that returns every `CourseSlug` whose `PERMISSION_MAPPINGS` value is in the input set. Unlike `grantsToAirtableCourses` (which deduplicates by AirtableCourse), this expansion is multi-valued (e.g. `OPANUJ_FRONTEND` → `['opanuj-frontend', 'opanuj-frontend-live']`) and is required for the Airtable fallback path in `getAccessibleCourseSlugs` to produce the full list of accessible slugs.

#### 3. Unit tests for the new helper

**File**: `src/server/access/courseAccess.test.ts`
**Changes**: Vitest tests covering the matrix:
- User with grants only (including `10xdevs-3-prework`) → returns slugs from grants, no extra check fired.
- User with grants but no prework slug, toolkit KV `applies && allowed` → prework slug added; no Circle call; no grant upsert.
- User with grants but no prework slug, toolkit `applies && !allowed` → prework NOT added.
- User with grants but no prework slug, toolkit `!applies`, Circle `active` → prework added; `upsertGrant` called once with `'circle'`.
- User with grants but no prework slug, toolkit `!applies`, Circle `inactive` → prework NOT added.
- Supabase profile missing → Airtable fallback returns `[OPANUJ_FRONTEND]` → result includes both `opanuj-frontend` and `opanuj-frontend-live`.
- `upsertGrant` throws → still resolves with prework slug present (fire-and-forget semantics).

Mock Supabase, toolkit KV, Circle, and Airtable using existing patterns from `tenXDevs3Membership.test.ts`.

### Success Criteria:

#### Automated Verification:

- [x] Unit tests pass: `npm run test -- courseAccess`
- [x] Type checking passes: `npm run build` (or `npx tsc --noEmit` if a faster check exists)
- [x] Linting passes: `npm run lint`

#### Manual Verification:

- [ ] (Skipped at this phase — helper is exercised in Phase 2.)

**Implementation Note**: Helper is not yet wired into any page in this phase. Land it green, then move to Phase 2.

---

## Phase 2: Refactor CourseList signal & add prework tile

### Overview

Replace `customerPurchases: AirtableCourse[]` with `accessibleCourseSlugs: CourseSlug[]` on CourseList; convert all five existing `isAvailable` checks to slug-based; add the prework tile entry; import the new thumbnail; wire `/courses.astro` to call the helper from Phase 1.

### Changes Required:

#### 1. CourseList prop and tile entries

**File**: `src/components/CourseList.astro`
**Changes**:
- Replace the `Props` interface so it accepts `accessibleCourseSlugs: CourseSlug[]` (importing `CourseSlug` from `@/models/CollectionMappings`). Drop the `AirtableCourse` import.
- Update each existing tile's `isAvailable` to a `CourseSlug` membership check:
  - `'opanuj-frontend'` for the Opanuj Frontend tile
  - `'opanuj-frontend-live'` for the OFE Live tile
  - `'cursor-ai'` for the Cursor tile
  - `'opanuj-typescript-core'` for OTS Core
  - `'opanuj-typescript-react'` for OTS React
- Add a sixth entry to `allCourses` for prework:
  - `title: '10xDevs 3.0: Prework'`
  - `description: 'Przygotuj się do kursu 10xDevs 3.0 — fundamenty pracy z AI w developmencie.'`
  - `imageUrl: thumbnail10xDevs3.src` (new asset, see change #4)
  - `theme: 'bg-gradient-to-br from-indigo-950 to-violet-950'`
  - `href: '/external/10xdevs-3-prework'`
  - `isAvailable: accessibleCourseSlugs.includes('10xdevs-3-prework')`
  - `purchaseUrl: 'https://10xdevs.pl'` (kept for prop-shape parity with other tiles; not surfaced for available courses, so the value is non-load-bearing)

#### 2. Wire helper into the courses page

**File**: `src/pages/courses.astro`
**Changes**: Import `getAccessibleCourseSlugs` from `@/server/access/courseAccess`. After the existing `verifyAuth(Astro)` check, call the helper with `authResult.email!` and the relevant env imports (Supabase, Airtable, Toolkit KV, Circle — same env shape used by `verifyExternalAuth`'s callers; mirror that import pattern). Pass the resulting `accessibleCourseSlugs` to `<CourseList />` instead of `authResult.purchases!`.

#### 3. Pass-through env wiring

**File**: `src/pages/courses.astro` (continued)
**Changes**: The helper needs KV bindings (`TOOLKIT_10X3_MEMBERSHIP_KV`, `CIRCLE_MEMBERS`) which are only reachable through `Astro.locals.runtime.env` on Cloudflare. Read them from `Astro.locals.runtime.env` and merge with the `astro:env/server` secrets when calling the helper — copy the exact pattern from how `verifyExternalAuth` is invoked elsewhere (likely `src/pages/external/[courseId]/index.astro`). Verify the runtime env shape during implementation.

#### 4. Prework thumbnail asset

**File**: `src/assets/images/courses/kurs-10xdevs-3.jpg` (new file)
**Changes**: Add a 16:9 thumbnail for the 10xDevs 3.0 / prework tile. Reuse the official 10xDevs 3.0 marketing artwork if available; otherwise create a placeholder consistent with existing thumbnails (1280×720 or 800×450 JPG, ~50–150 KB). The exact asset choice is a design call — flag during implementation if the asset isn't available and use a temporary gradient-only tile (omit the `<img>` and rely on the gradient theme) until art lands. Import it in CourseList as `thumbnail10xDevs3`.

#### 5. Update or remove obsolete CourseList tests (if any)

**File**: any existing CourseList test (search `src/components/CourseList.*` — likely none, but verify)
**Changes**: If a test exists, update mock prop shape to `accessibleCourseSlugs`. Otherwise no-op.

### Success Criteria:

#### Automated Verification:

- [x] Build passes: `npm run build`
- [x] All tests pass: `npm run test`
- [x] Linting passes: `npm run lint`
- [x] No remaining references to `customerPurchases` in `CourseList.astro` or `courses.astro`: `grep -r 'customerPurchases' src/components src/pages/courses.astro`

#### Manual Verification:

- [ ] Log in as a user with `10XDEVS_3` Airtable purchase (Airtable-sourced grant): prework tile appears on `/courses`, links to `/external/10xdevs-3-prework`, and clicking it opens prework content.
- [ ] Log in as a user with Toolkit-KV-only prework access (no Airtable purchase, no prior `/external/10xdevs-3-prework` visit): prework tile appears on first `/courses` visit. Confirm via server logs that the toolkit KV path was the matching source (existing `tenx3_toolkit_access.check` log lines should fire).
- [ ] Log in as a user with no 10xDevs 3.0 access: prework tile is NOT shown.
- [ ] Existing OFE / OFE Live / Cursor / OTS Core / OTS React tiles still appear correctly for users holding the corresponding Airtable purchases (regression check on the slug refactor).
- [ ] Page render time on `/courses` is not noticeably slower for users without prework eligibility (worst case: one Toolkit KV miss + one Circle membership call). Confirm against current baseline.
- [ ] Tile thumbnail/gradient looks acceptable on desktop and mobile breakpoints.

**Implementation Note**: After Phase 2's automated verification passes, pause for the manual checks above before considering this complete.

---

## Testing Strategy

### Unit Tests:

- `getAccessibleCourseSlugs` covers all eligibility-source matrix cases (see Phase 1 list).
- `airtableCoursesToCourseSlugs` covers single-slug and multi-slug expansions plus empty input.

### Integration Tests:

- None required for this change. Eligibility-path coverage at the unit level + manual verification at the page level is sufficient given the helper is a pure composition of already-tested primitives (`getGrants`, `checkTenXDevs3ToolkitMembership`, `resolveMembership`).

### Manual Testing Steps:

1. With three test accounts representing the three eligibility paths (Airtable purchaser, Toolkit-KV-only, no access), visit `/courses` and verify tile visibility per the manual checks in Phase 2.
2. From a logged-in session, click the prework tile and confirm the destination behaves as expected (loads content for eligible users; redirects to `/external/10xdevs-3-prework/login` for stale-cookie cases).
3. Sanity check the five legacy tiles still filter correctly for at least one paid-customer test account.

## Performance Considerations

- One additional Supabase grant query is already paid for by `verifyAuth`. The helper reuses `getGrants`, so the only added cost on `/courses` is at most one Toolkit KV read + one Circle membership resolution, and only when prework is not already in grants. For users with the prework grant in Supabase (Airtable-synced), there's no extra cost.
- Circle membership resolution uses the existing CIRCLE_MEMBERS KV cache (TTL `EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS`, default 1440 hours) so cold hits should be rare.
- A Circle-source grant upsert on the helper's success path turns subsequent visits into pure grants-table reads.

## Migration Notes

No data migration. The new helper is additive; existing access_grants entries are read as-is. Once the helper is live, Toolkit-KV-only users naturally accrue Circle-source prework grants during `/external/10xdevs-3-prework` visits (existing `verifyExternalAuth` behavior) — independent of this change.

## References

- External auth cascade precedent: `src/server/externalAuth.ts:27-109`
- Toolkit KV check (already supports prework): `src/server/toolkit/tenXDevs3Membership.ts:82-178`
- Grant model and helpers: `src/server/supabase/accessService.ts`
- Course slug ↔ permission map: `src/models/CollectionMappings.ts`
- Existing CourseList component: `src/components/CourseList.astro`
- Courses page entry: `src/pages/courses.astro`


<!-- PLAN STATUS: Last Phase Completed: 2 (automated), Next Phase: manual verification, Updated: 2026-04-29 -->
