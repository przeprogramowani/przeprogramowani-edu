---
date: 2026-05-16T15:18:41Z
researcher: Claude (Opus 4.6)
git_commit: 9178815f529fc3683f3761c61e8bf909fbb09efe
branch: master
repository: przeprogramowani-sites
topic: "How does auth differ between 10xdevs-3 and 10xdevs-3-prework, and what needs to change for 10xdevs-3 to use kv_toolkit exclusively?"
tags: [research, codebase, external-auth, toolkit-kv, 10xdevs-3]
status: complete
last_updated: 2026-05-16
last_updated_by: Claude (Opus 4.6)
---

# Research: KV Toolkit Auth for 10xDevs 3 Course

**Date**: 2026-05-16T15:18:41Z
**Researcher**: Claude (Opus 4.6)
**Git Commit**: 9178815f
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

10xdevs-3 course (both language versions) should use the same logic mechanism as 10xdevs-3-prework, which is `kv_toolkit` (not legacy). What is the current state, and what are the asymmetries?

## Summary

Both `10xdevs-3` and `10xdevs-3-prework` already share the **same** `checkTenXDevs3ToolkitMembership()` function in all three external auth integration points (login pre-check, verify, page guard). In PROD, both default to `toolkit_kv` mode via `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE = "toolkit_kv"`.

However, the legacy Circle membership check is **not fully removed** — it remains as a fallback at two levels:

1. **KV miss fallback** (`TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING = "true"`) — when a user's email hash is absent from the KV, the toolkit check returns `applies: false`, causing `externalAuth.ts` and `auth.ts` to fall through to the Supabase → Circle legacy pipeline. This applies **identically** to both courses.

2. **Course listing asymmetry in `courseAccess.ts`** — `getAccessibleCourseSlugs()` checks toolkit KV for prework eligibility but explicitly does NOT check it for the main `10xdevs-3` course tile. The main course tile only appears if the user has a Supabase grant or Airtable record.

## Detailed Findings

### 1. Shared Toolkit KV Mechanism (already in place)

Both courses go through `checkTenXDevs3ToolkitMembership()` at three integration points:

| Integration Point | File | Line |
|---|---|---|
| Login pre-check | `src/pages/api/external/auth.ts` | 108 |
| Verify (magic link) | `src/pages/external/[courseId]/verify.astro` | 48 |
| Page guard | `src/server/externalAuth.ts` | 87 |

The function (`src/server/toolkit/tenXDevs3Membership.ts:100`) explicitly handles both course IDs:

```typescript
if (courseId !== TEN_X_DEVS_3_COURSE_ID && courseId !== TEN_X_DEVS_3_PREWORK_COURSE_ID) {
  return { applies: false, reason: 'not_10xdevs_3' };
}
```

Mode resolution (`tenXDevs3Membership.ts:81-93`):
- If `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE` is set → use that value
- If not set → `PROD` defaults to `toolkit_kv`, non-PROD defaults to `legacy`
- Current `wrangler.toml` setting: `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE = "toolkit_kv"` (line 27)

**Conclusion**: The external auth pipeline is **already identical** for both courses.

### 2. Legacy Fallback Still Active

`wrangler.toml:32`: `TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING = "true"`

When a user's email hash is not found in the KV namespace, `checkTenXDevs3ToolkitMembership` returns `{ applies: false, reason: 'legacy_fallback_missing_record' }`. This causes the caller to fall through to the Circle membership check:

- In `externalAuth.ts:99-138` → Supabase grants → Circle `resolveMembership()`
- In `auth.ts:115-130` → Circle `resolveMembership()`

This fallback is a safety net for Circle email changes that leave the KV with only the old hash. It applies equally to both `10xdevs-3` and `10xdevs-3-prework`.

### 3. Course Listing Asymmetry (`courseAccess.ts`)

`src/server/access/courseAccess.ts:83-93`:

```typescript
// Comment (lines 83-87): To surface the main 10xDevs 3.0 course tile to
// toolkit-KV-only / Circle-only members, extend this block with a parallel
// eligibility check for '10xdevs-3'. Keep it prework-only to gate the main
// course tile to paid customers via grants.
if (!slugSet.has(TEN_X_DEVS_3_PREWORK_COURSE_ID)) {
  const preworkAccess = await checkPreworkEligibility(email, userId, env, supabaseEnv);
  if (preworkAccess) {
    slugSet.add(TEN_X_DEVS_3_PREWORK_COURSE_ID);
  }
}
```

- **Prework**: Gets a dedicated `checkPreworkEligibility()` function (lines 98-139) that calls `checkTenXDevs3ToolkitMembership` first, then falls back to Circle.
- **Main course**: Only appears if the user already has a Supabase grant or Airtable record (`10XDEVS_3`). No toolkit KV check is performed for the course listing.

This is an **intentional design choice** per the comment: the main course tile is gated to paid customers.

### 4. External Auth Config (Circle spaces)

`src/server/circle/externalAuthConfig.ts:46-63`:

Both `10xdevs-3` and `10xdevs-3-prework` are configured with the same `TEN_X_DEVS_THIRD_ED` platform settings (same community ID 1272, same space_id, same section_ids). The Circle legacy fallback would behave identically for both.

### 5. Language Versions (i18n)

"Both language versions" refers to the recently added i18n support (commits 684968e5 through 495e5772):

- `src/content.config.ts:61-69`: Two collections per course — `lessons10xDevs3` (PL) and `lessons10xDevs3En` (EN)
- `src/models/LessonCollection.ts:10-13`: Both PL and EN collections registered
- Routes: `/external/10xdevs-3/pl/[lessonId]` and `/external/10xdevs-3/en/[lessonId]` via `src/pages/external/[courseId]/[lang]/[lessonId].astro`

**Auth impact**: Language is a content-routing parameter, not an auth parameter. Both language versions use the same `courseId = '10xdevs-3'` for auth checks. No auth changes are needed for i18n.

### 6. Route Structure

Both courses are **external-only**. The internal `/courses/` routes redirect to `/external/`:
- `src/pages/courses/[...courseSlug]/index.astro:12-18`: Redirects `10xdevs-3` and `10xdevs-3-prework` to `/external/`
- `src/pages/courses/[...courseSlug]/lesson/[...id].astro:10-19`: Same redirects

`verifyAuth.ts` (the internal auth function) never executes for these courses and does NOT call `checkTenXDevs3ToolkitMembership`.

## Code References

- `src/server/toolkit/tenXDevs3Membership.ts:1-4` — Course ID constants and mode constants
- `src/server/toolkit/tenXDevs3Membership.ts:81-93` — Mode resolution logic
- `src/server/toolkit/tenXDevs3Membership.ts:95-203` — Main membership check function
- `src/server/externalAuth.ts:85-97` — Page guard toolkit integration
- `src/pages/api/external/auth.ts:106-130` — Login pre-check toolkit integration
- `src/pages/external/[courseId]/verify.astro:46-61` — Verify page toolkit integration
- `src/server/access/courseAccess.ts:83-96` — Course listing (prework-only KV check)
- `src/server/access/courseAccess.ts:98-139` — Prework eligibility check
- `src/server/circle/externalAuthConfig.ts:46-63` — Circle config for both courses
- `src/models/CollectionMappings.ts:42-53` — Permission mappings (both → `10XDEVS_3`)
- `wrangler.toml:27` — `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE = "toolkit_kv"`
- `wrangler.toml:32` — `TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING = "true"`

## Architecture Insights

The toolkit KV auth was designed as a **temporary pre-broker bridge** (per code comments and `thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md`). It has three call sites that run in sequence during a user session:

```
[Login]  auth.ts:108  →  checkTenXDevs3ToolkitMembership()
                         ↓ applies:false → Circle fallback
[Verify] verify.astro:48 → checkTenXDevs3ToolkitMembership()
                         ↓ applies:false → skip (already verified at login)
[Guard]  externalAuth.ts:87 → checkTenXDevs3ToolkitMembership()
                         ↓ applies:false → Supabase → Circle fallback
```

The env var `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE` is a **shared** toggle — it applies to both `10xdevs-3` and `10xdevs-3-prework` simultaneously. There is no per-course mode override.

## Historical Context

- **Plan**: `thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md` — original implementation plan
- **Ops guide**: `docs/external-10xdevs-3-toolkit-kv-auth.md` — operational documentation including rollback and manual override procedures
- **i18n archive**: `context/archive/2026-05-16-support-i18n-for-10xdevs3/` — recently completed i18n support

## Open Questions

1. **Is the goal to disable `TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING`?** — Setting it to `"false"` would make both courses pure toolkit_kv with no Circle fallback. This is the simplest change but has a risk: users whose Circle email changed (and whose KV record still has the old hash) would lose access until the KV is updated.

2. **Should `courseAccess.ts` also check toolkit KV for the main `10xdevs-3` course tile?** — Currently the comment at line 83-87 explicitly defers this. Adding it would make the course listing tile visible to toolkit-KV-only members who don't yet have a Supabase grant.

3. **Is the local dev bypass in `auth.ts:66-72` needed for `10xdevs-3` too?** — Currently only `10xdevs-3-prework` has a local bypass for test emails in DEV mode.

4. **Should the Circle `EXTERNAL_AUTH_CONFIG` entries for `10xdevs-3` be removed entirely if going pure toolkit_kv?** — The config is still needed for the legacy fallback path; removing it would break the fallback.
