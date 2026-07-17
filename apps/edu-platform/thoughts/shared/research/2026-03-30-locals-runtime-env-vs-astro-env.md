---
date: 2026-03-30T12:00:00+02:00
researcher: Claude
git_commit: ce969e55
branch: master
repository: przeprogramowani-sites
topic: "locals.runtime.env vs astro:env/server migration audit"
tags: [research, codebase, env-variables, astro-env, cloudflare, migration]
status: complete
last_updated: 2026-03-30
last_updated_by: Claude
---

# Research: locals.runtime.env vs astro:env/server migration audit

**Date**: 2026-03-30T12:00:00+02:00
**Researcher**: Claude
**Git Commit**: ce969e55
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Find all places where `locals.runtime.env` is used and verify they should use static `astro:env/server` imports instead. Identify gaps between the `Env` interface (`env.d.ts`) and the `ASTRO_ENV_SCHEMA` (`astro-env.ts`).

## Summary

There are **~25 files** still accessing env vars via `locals.runtime.env`. Of these:
- **5 files** are simple cases that can be fully migrated to `astro:env/server`
- **4 files** are partially migrated (use both patterns)
- **16+ files** pass the full `env` object to functions needing KV namespace bindings (cannot fully migrate)
- **2 env variables** (`10XDEVS_MAILERLITE_API_KEY`, `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID`) are accessed at runtime but missing from both `astro-env.ts` and the `Env` interface
- **2 env variables** (`CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN`, `CIRCLE_BRAVE_V1_TOKEN`) are in the `Env` interface but missing from `astro-env.ts`

## Detailed Findings

### 1. astro-env.ts schema (18 variables)

These are declared in `astro-env.ts` and available via `import { X } from 'astro:env/server'`:

| Variable | Type | Access | Optional |
|----------|------|--------|----------|
| ENV | string | secret | no |
| SITE_URL | string | secret | no |
| MAILING_SERVICE_URL | string | secret | no |
| AIRTABLE_API_KEY | string | secret | no |
| SUPABASE_URL | string | secret | no |
| SUPABASE_SERVICE_KEY | string | secret | no |
| JWT_SECRET | string | secret | no |
| GITHUB_CLIENT_ID | string | secret | no |
| GITHUB_CLIENT_SECRET | string | secret | no |
| GOOGLE_CLIENT_ID | string | secret | no |
| GOOGLE_CLIENT_SECRET | string | secret | no |
| CF_CAPTCHA_SITE_KEY | string | secret | no |
| CF_CAPTCHA_SECRET_KEY | string | secret | no |
| RESEND_API_KEY | string | secret | yes |
| LESSON_CACHE_TTL_HOURS | number | public | yes (default: 24) |
| EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS | number | secret | yes (default: 1440) |
| EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS | number | secret | yes (default: 2160) |
| EXTERNAL_MEMBERSHIP_REFRESH_SECRET | string | secret | yes |

### 2. Files already fully using astro:env/server (no locals.runtime.env)

| File | Imported variables |
|------|-------------------|
| `src/pages/api/captcha/verify.ts` | CF_CAPTCHA_SECRET_KEY |
| `src/pages/explorers-editor.astro` | ENV |
| `src/pages/api/auth/google.ts` | SITE_URL, GOOGLE_CLIENT_ID |
| `src/pages/api/auth/github.ts` | SITE_URL, GITHUB_CLIENT_ID |
| `src/server/circle/lessonCache.ts` | LESSON_CACHE_TTL_HOURS |
| `src/server/verifyAuth.ts` | JWT_SECRET, AIRTABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY |

### 3. Files that CAN be fully migrated (only need simple env vars)

| File | Current usage | Should import |
|------|--------------|---------------|
| `src/pages/index.astro:10` | `Astro.locals.runtime.env.JWT_SECRET` | `JWT_SECRET` |
| `src/pages/login.astro:7` | `Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY` | `CF_CAPTCHA_SITE_KEY` |
| `src/pages/signup.astro:7` | `Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY` | `CF_CAPTCHA_SITE_KEY` |
| `src/pages/explorers.astro:10` | `Astro.locals.runtime.env.JWT_SECRET` | `JWT_SECRET` |
| `src/pages/api/customer-purchases.ts:17` | `locals.runtime.env.AIRTABLE_API_KEY` | `AIRTABLE_API_KEY` |

### 4. Files partially migrated (use both patterns)

| File | astro:env imports | Still uses locals.runtime for |
|------|------------------|-------------------------------|
| `src/pages/api/auth.ts` | SITE_URL, MAILING_SERVICE_URL, JWT_SECRET, ENV, RESEND_API_KEY | `10XDEVS_MAILERLITE_API_KEY`, `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` (not in schema!), `runtime.ctx.waitUntil()`, `runtime.env` for `storeMagicLink()` (needs KV) |
| `src/pages/verify.astro` | JWT_SECRET | `runtime.env` for `verifyMagicLink()` (needs MAGIC_LINKS KV), `runtime.ctx.waitUntil()` |
| `src/pages/api/auth/github/callback.ts` | SITE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET | `locals.runtime.env` passed to `handleSocialAuth()` + sync functions (need SUPABASE_URL/KEY) |
| `src/pages/api/auth/google/callback.ts` | SITE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | `locals.runtime.env` passed to `handleSocialAuth()` + sync functions |

### 5. Files that NEED locals.runtime.env for KV bindings

These pass the full `env` object to functions that need Cloudflare KV namespaces (GAME_STATE, MAGIC_LINKS, CIRCLE_MEMBERS, PLATFORM_LESSON_CACHE, GAME_API_TOKENS). These **cannot fully migrate** because KV bindings are only available via `locals.runtime.env`.

However, individual string/number env vars accessed directly (like `env.JWT_SECRET`) could be imported from `astro:env/server` instead.

**External routes:**
- `src/pages/external/[courseId]/index.astro:22` - env for `verifyExternalAuth()` + `getCourseStructure()`
- `src/pages/external/[courseId]/login.astro:23` - `CF_CAPTCHA_SITE_KEY` + env for auth
- `src/pages/external/[courseId]/verify.astro:17` - env for magic link KV + sync
- `src/pages/external/[courseId]/[lessonId].astro:17` - env for auth + lesson cache
- `src/pages/external/[courseId]/[lessonId]/markdown.astro:12` - env for auth + lesson cache
- `src/pages/external/10xdevs-2/checklists/index.astro:10` - env for auth
- `src/pages/external/10xdevs-2/checklists/[slug].astro:22` - env for auth
- `src/pages/external/10xdevs-2/checklists/[slug]/markdown.astro:17` - env for auth

**Game API routes:**
- `src/pages/api/game/token.ts:7` - env for GAME_API_TOKENS KV + Supabase
- `src/pages/api/game/mission.ts:7` - env for game state
- `src/pages/api/game/pending.ts:14,23` - `env.JWT_SECRET` directly + env for game state KV
- `src/pages/api/game/state.ts:39,54-56,81,125,127` - `env.JWT_SECRET` directly + env for GAME_STATE KV
- `src/pages/api/game/submit.ts:21` - env for game state + Supabase

**External API routes:**
- `src/pages/api/external/auth.ts:25` - env for MAGIC_LINKS KV + membership
- `src/pages/api/external/membership-debug.ts:33` - env for Circle membership
- `src/pages/api/external/membership-refresh.ts:120` - env for CIRCLE_MEMBERS KV

### 6. Missing from astro-env.ts (schema gaps)

#### Variables in `Env` interface but NOT in `astro-env.ts`:

| Variable | Type | Notes |
|----------|------|-------|
| `CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN` | string (optional) | Used for Circle API calls in external routes |
| `CIRCLE_BRAVE_V1_TOKEN` | string (optional) | Used for Circle API calls in external routes |

These are simple string variables that **should be added** to `astro-env.ts`.

#### Variables accessed at runtime but NOT in any schema:

| Variable | Used in | Notes |
|----------|---------|-------|
| `10XDEVS_MAILERLITE_API_KEY` | `src/pages/api/auth.ts:28` | MailerLite newsletter API key |
| `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` | `src/pages/api/auth.ts:29` | MailerLite group ID |

These are accessed via bracket notation `locals.runtime.env['10XDEVS_MAILERLITE_API_KEY']` and are **missing from both** `astro-env.ts` and the `Env` interface. They should be added to both.

#### KV Namespaces (cannot be in astro-env.ts):

These are Cloudflare bindings, not simple env vars. They must remain in `Env` interface and be accessed via `locals.runtime.env`:

- `PLATFORM_LESSON_CACHE: KVNamespace`
- `CIRCLE_MEMBERS: KVNamespace`
- `MAGIC_LINKS: KVNamespace`
- `GAME_STATE: KVNamespace`
- `GAME_API_TOKENS: KVNamespace`

### 7. `locals.runtime.ctx` usage

Two files also access `locals.runtime.ctx` for Cloudflare's execution context (`ctx.waitUntil()`). This is **not an env variable** and will always require `locals.runtime`:

- `src/pages/api/auth.ts:34` - `locals.runtime.ctx.waitUntil(nlPromise)`
- `src/pages/verify.astro:56` - `ctx.waitUntil(syncPromise)`

## Architecture Insights

### Why both patterns coexist

1. **`astro:env/server`** provides type-safe, validated env vars at build time. Ideal for simple string/number config.
2. **`locals.runtime.env`** is the Cloudflare Workers runtime binding. It's the **only way** to access KV namespaces, D1 databases, and other Cloudflare-specific bindings.
3. **`locals.runtime.ctx`** is needed for `waitUntil()` calls (fire-and-forget async work after response).

### The env pass-through pattern

Many server functions accept a full `env: Env` parameter because they need KV bindings. This creates a pattern where the route handler does `const env = locals.runtime.env` and passes it down. Even if a function only needs `SUPABASE_URL`, if it's typed as `env: Env`, the caller must pass the full runtime env. This could be refactored to accept narrower types (like `getSupabaseAdmin` already does: `env: { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string }`).

## Recommended Actions

### Quick wins (5 files, straightforward):
1. `src/pages/index.astro` - replace `Astro.locals.runtime.env.JWT_SECRET` with `import { JWT_SECRET } from 'astro:env/server'`
2. `src/pages/login.astro` - replace `Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY` with astro:env import
3. `src/pages/signup.astro` - same as login.astro
4. `src/pages/explorers.astro` - replace `Astro.locals.runtime.env.JWT_SECRET` with astro:env import
5. `src/pages/api/customer-purchases.ts` - replace `locals.runtime.env.AIRTABLE_API_KEY` with astro:env import

### Schema gaps to fix:
1. Add `CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN` to `astro-env.ts` (optional string, secret)
2. Add `CIRCLE_BRAVE_V1_TOKEN` to `astro-env.ts` (optional string, secret)
3. Add `10XDEVS_MAILERLITE_API_KEY` to `astro-env.ts` AND `Env` interface (optional string, secret)
4. Add `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` to `astro-env.ts` AND `Env` interface (optional string, secret)

### Larger refactor (game/external routes):
For files that pass the full `env` to functions, consider importing individual astro:env vars where accessed directly (e.g., `env.JWT_SECRET` in game/state.ts:39) while keeping `locals.runtime.env` for KV-dependent function calls. This requires narrowing function signatures to separate "config vars" from "KV bindings".

## Code References

- `astro-env.ts:1-86` - ASTRO_ENV_SCHEMA definition
- `src/env.d.ts:1-57` - Env interface and Locals type
- `src/pages/index.astro:10` - JWT_SECRET via locals.runtime.env
- `src/pages/login.astro:7` - CF_CAPTCHA_SITE_KEY via locals.runtime.env
- `src/pages/signup.astro:7` - CF_CAPTCHA_SITE_KEY via locals.runtime.env
- `src/pages/explorers.astro:10` - JWT_SECRET via locals.runtime.env
- `src/pages/api/customer-purchases.ts:17` - AIRTABLE_API_KEY via locals.runtime.env
- `src/pages/api/auth.ts:28-29` - MailerLite vars not in any schema
- `src/pages/api/game/state.ts:39` - JWT_SECRET via locals.runtime.env (could use astro:env)
- `src/server/game/remoteGameStateKV.ts:6-8` - GameStateEnv needs GAME_STATE KVNamespace

## Open Questions

1. Should `10XDEVS_MAILERLITE_API_KEY` and `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` be added to astro-env.ts, or are they being phased out?
2. For game/external routes that pass full `env` to functions: is it worth refactoring function signatures to accept narrower types (separating config from KV bindings), or is the current pass-through pattern acceptable?
3. Should the `Env` interface in `env.d.ts` be kept in sync with `astro-env.ts` for simple string/number vars, or can the interface be removed once migration is complete?
