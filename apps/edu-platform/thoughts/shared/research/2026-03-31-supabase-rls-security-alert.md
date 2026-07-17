---
date: 2026-03-31T19:09:17Z
researcher: Claude
git_commit: cb9e956b
branch: master
repository: przeprogramowani-sites
topic: "Supabase RLS Security Alert - Tables Publicly Accessible"
tags: [research, codebase, supabase, rls, security, database]
status: complete
last_updated: 2026-03-31
last_updated_by: Claude
---

# Research: Supabase RLS Security Alert - Tables Publicly Accessible

**Date**: 2026-03-31T19:09:17Z
**Researcher**: Claude
**Git Commit**: cb9e956b
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Supabase dashboard reports a critical security vulnerability: "Table publicly accessible — Anyone with your project URL can read, edit, and delete all data in this table because Row-Level Security is not enabled." (`rls_disabled_in_public`) for project `platforma.przeprogramowani.pl` (ID: `uxankjtsfdgrlogkdioz`). What is the actual risk and what should be done?

## Summary

**RLS is intentionally disabled** as an explicit architectural decision. All Supabase access goes through the **service role key on the server side only** — no anon key exists, no browser-to-Supabase calls exist. The Supabase alert is technically correct (RLS is off), but the real-world risk depends on whether the `anon` key is exposed. Since the anon key is never used or referenced in the codebase, the practical risk is **low but not zero** — Supabase auto-generates an anon key for every project, and if someone discovers it (e.g., from Supabase dashboard access or a leaked config), they could access all tables without restriction.

**Recommendation**: Enable RLS on all tables and create permissive policies for the service role. This is a 5-minute fix that silences the alert and adds defense-in-depth without changing any application behavior.

## Detailed Findings

### 1. Tables Without RLS (5 tables)

All public tables have RLS disabled:

| Table | Migration | Contains |
|-------|-----------|----------|
| `public.profiles` | `20260303000000_initial_schema.sql` | User emails, IDs, login timestamps |
| `public.access_grants` | `20260303000000_initial_schema.sql` | Course access permissions per user |
| `public.game_state` | `20260303000000_initial_schema.sql` | Player game state (JSONB) |
| `public.game_api_tokens` | `20260304000000_game_api_tokens.sql` | SHA-256 token hashes, expiry |
| `public.system_flags` | `20260324000000_system_flags.sql` | Feature flags for milestone gating |

### 2. Why RLS Was Disabled (Intentional Decision)

From the original research (`thoughts/shared/research/2026-03-03-supabase-centralized-access-management.md`):
> "Row-Level Security: Enable Supabase RLS so users can only read their own grants? Or use service key for all server-side queries (simpler, but requires careful API design)?"
> **Decision**: Service key for all queries.

From `CLAUDE.md`:
> "All queries go through the service role key — RLS is disabled because all access is server-side only (no direct browser->Supabase calls)."

### 3. Access Pattern Analysis

- **Client factory**: `getSupabaseAdmin()` in `src/server/supabase/client.ts` — uses `SUPABASE_SERVICE_KEY` exclusively
- **No anon key** defined in `astro-env.ts`, `wrangler.toml`, or any env file
- **No client-side Supabase imports** — zero matches in `.svelte`, `.astro` client scripts, or any browser-facing code
- **All 6 service modules** (`accessService`, `userService`, `airtableSyncService`, `circleSyncService`, `gameSyncService`, `systemFlagsService`) call `getSupabaseAdmin()` with the service role key
- **Service key is secret** — stored only in Cloudflare Pages dashboard and `.env.local`, never in `wrangler.toml` or committed files

### 4. Risk Assessment

| Risk | Level | Explanation |
|------|-------|-------------|
| Browser exploits via anon key | **Low** | Anon key is never used or exposed in app code |
| Supabase anon key leakage | **Medium** | Every Supabase project has an auto-generated anon key visible in the dashboard; anyone with dashboard access could use it |
| Service key compromise | **Critical** | Would bypass everything regardless of RLS (service role bypasses RLS by design) |
| Data exposure if RLS stays off | **Medium** | Without RLS, the anon key grants full CRUD on all public tables |

### 5. Recommended Fix

Create a new migration that enables RLS on all tables with a single permissive policy for the `service_role`. This:
- Silences the Supabase security alert
- Blocks the `anon` key from accessing any data
- Has zero impact on application behavior (service role bypasses RLS)
- Adds defense-in-depth against accidental anon key exposure

```sql
-- Enable RLS on all public tables (defense-in-depth)
-- All application queries use service_role key which bypasses RLS.
-- This blocks the auto-generated anon key from accessing data.

alter table public.profiles enable row level security;
alter table public.access_grants enable row level security;
alter table public.game_state enable row level security;
alter table public.game_api_tokens enable row level security;
alter table public.system_flags enable row level security;

-- No policies needed: service_role bypasses RLS entirely.
-- If anon access is ever needed in the future, add explicit policies then.
```

## Code References

- `supabase/migrations/20260303000000_initial_schema.sql` - profiles, access_grants, game_state (no RLS)
- `supabase/migrations/20260304000000_game_api_tokens.sql` - game_api_tokens (no RLS)
- `supabase/migrations/20260324000000_system_flags.sql` - system_flags (no RLS)
- `src/server/supabase/client.ts` - getSupabaseAdmin() uses service role key only
- `astro-env.ts:20-27` - SUPABASE_URL and SUPABASE_SERVICE_KEY (no anon key)

## Architecture Insights

The decision to disable RLS was sound at project inception — it simplified the initial Supabase integration when the team was migrating from Airtable. However, enabling RLS with no policies is a zero-cost hardening measure that should be applied as a matter of hygiene. The service role key bypasses RLS by design, so no application code changes are needed.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-03-supabase-centralized-access-management.md` - Original decision to skip RLS documented here
- `thoughts/shared/plans/2026-03-03-supabase-centralized-access-management.md` - Implementation plan explicitly notes "Not enabling Supabase Row-Level Security"
- `thoughts/shared/research/2026-03-04-space-explorers-external-api.md` - Reaffirms "No RLS on Supabase — all access is server-side via service role key"

## Open Questions

1. Should read-only policies be added for `system_flags` via the anon key (for potential future public feature flag checks)?
2. Is the Supabase dashboard access restricted to team members only, or could contractors/third parties see the anon key?
