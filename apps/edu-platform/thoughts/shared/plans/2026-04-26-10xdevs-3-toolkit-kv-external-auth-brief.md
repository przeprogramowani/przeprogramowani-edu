# 10xDevs 3 Toolkit KV External Auth Bridge - Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md`

## What & Why

Add a temporary auth bridge for `/external/10xdevs-3` in `edu-platform` that reads the same Cloudflare KV membership namespace written by `10x-toolkit/packages/api`. This unblocks the 10xDevs 3 external course launch before the centralized toolkit access broker exists.

## Starting Point

`edu-platform` already has external auth, a `10xdevs-3` Circle config, and Supabase grant mirroring. But it currently reads its own `CIRCLE_MEMBERS` cache and can allow access through stale Supabase grants, while toolkit/CLI rely on toolkit's `CLI_10X3_MEMBERSHIP_KV`.

## Desired End State

For `/external/10xdevs-3`, login and page guards use toolkit KV as the production authority. Allowed users receive magic links and can open course pages; denied users are blocked before email is sent. Supabase is mirrored only after verified login for local UI compatibility, not used as authority in toolkit mode.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Scope | External `10xdevs-3` plus reusable helper | Fast launch path with a clean replacement point for the broker. |
| Authority | Toolkit KV only in production mode | Matches the current toolkit/CLI access source and avoids stale Supabase allows. |
| Binding | New `TOOLKIT_10X3_MEMBERSHIP_KV` binding | Keeps edu-platform's existing `CIRCLE_MEMBERS` schema separate from toolkit's `member:<hash>` schema. |
| Freshness | Trust toolkit KV record existence/`hasAccess` | Mirrors toolkit auth behavior and keeps Circle API off the request path. |
| Login denial | Deny before magic link | Keeps current external-course UX and avoids sending useless login emails. |
| Dev behavior | Non-prod missing binding can fall back to legacy | Keeps local development smooth while production fails closed. |
| Legacy fallback | 10xDevs 3.0 legacy checks Circle space `2552674` | Gives rollback a viable Lessons-space auth mechanism distinct from 10xDevs 2.0. |
| Supabase mirror | Mirror after successful verify | Preserves local read-model compatibility without making Supabase authoritative. |
| Rollback | `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy` | Allows operational rollback without code changes. |
| Verification | Unit tests plus preview smoke | Catches both code regressions and Cloudflare binding mistakes. |

## Scope

**In scope:**

- Add `TOOLKIT_10X3_MEMBERSHIP_KV` to edu-platform.
- Add `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE`.
- Add a small toolkit KV membership service.
- Use it for `/api/external/auth`, `/external/10xdevs-3/verify`, and `verifyExternalAuth()`.
- Mirror Supabase grant only after successful verify.
- Add tests and preview smoke checklist.
- Document binding, rollback, and cleanup.

**Out of scope:**

- Full toolkit access broker.
- Toolkit API changes.
- CLI changes.
- All-course migration.
- Rebinding/replacing `CIRCLE_MEMBERS`.
- Request-time Circle revalidation or `_sync:last` freshness enforcement.

## Architecture / Approach

`edu-platform` mounts toolkit's physical KV namespace under a new binding. A new service computes the same normalized email hash as toolkit, reads `member:<hash>`, and returns an allow/deny decision for `10xdevs-3`. External login, verify, and page guards call that service only when the course is `10xdevs-3` and mode is `toolkit_kv`; otherwise existing legacy behavior remains available.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|------------------|----------|
| 1. Toolkit KV Binding and Service | Env/binding/types plus tested KV lookup helper | Wrong KV namespace or hash mismatch denies valid users. |
| 2. External Login and Page Guard Integration | Toolkit authority for login, verify, and page guards | Accidentally preserving Supabase fast path for `10xdevs-3`. |
| 3. Tests and Preview Smoke | Coverage for allow/deny/fallback plus real preview checks | Preview config may differ from code assumptions. |
| 4. Ops Notes and Cleanup Hooks | Rollback/removal docs for launch and broker migration | Temporary bridge could linger without clear cleanup. |

**Prerequisites:** Cloudflare access to bind Pages project to toolkit KV namespace `dd7fed61a71d42bfbace69865f18e9bb`; one known allowed email and one denied email for preview smoke.

**Estimated effort:** ~1 implementation session across 4 small phases, plus preview/prod configuration time.

## Open Risks & Assumptions

- Toolkit KV sync is healthy and contains the launch cohort.
- `edu-platform` and `10x-toolkit` run in the same Cloudflare account or can share the namespace binding.
- Direct KV schema coupling is acceptable only as a temporary bridge.
- Existing external route shape for `10xdevs-3` remains canonical; no `10xdevs3` alias is added here.

## Success Criteria (Summary)

- Known allowed 10xDevs 3 email can complete external login and open course pages in preview.
- Known denied email receives `403` before any magic link is sent.
- A stale local Supabase grant cannot override a missing toolkit KV record in toolkit mode.
- `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy` restores current Circle fallback for rollback and checks 10xDevs 3.0 space `2552674`.
