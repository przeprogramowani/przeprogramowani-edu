# AGENTS.md / CLAUDE.md

This file provides guidance to AI Agents such as Codex or Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Edu-platform is a protected course platform deployed on Cloudflare Pages. It provides authenticated access to educational content from multiple courses, integrating with Airtable for customer data and Circle.so for lesson content.

**Production URL:** https://przeprogramowani-edu.pages.dev

## Development Commands

```bash
# Start dev server (port 3000)
npm run dev

# Start dev server accessible on LAN
npm run dev:lan

# Build for production
npm run build

# Preview production build
npm run preview

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run game tests only
npm run test:explorers

# Run specific test file
npx vitest run src/utils/htmlToMarkdown.test.ts

# Generate GUID mappings for lessons
npm run generate:guid-mappings

# Generate placeholder game assets
npm run generate:assets
```

## Architecture

### Authentication Flow

1. **Magic Link Auth** - Email-based passwordless login via `/api/auth`
2. **Social Auth** - GitHub/Google OAuth via `/api/auth/github` and `/api/auth/google`
3. **JWT Tokens** - 24-hour tokens stored in HttpOnly `token` cookie (unified across all routes including `/external`)
4. **Access Verification** - Supabase `access_grants` table is the primary source; Airtable is a legacy fallback
5. **Login sync** - On every login, `upsertUser()` + `syncFromAirtable()` + `syncAllCircleCourses()` run fire-and-forget to populate Supabase grants

Key files:
- `src/server/auth.ts` - JWT generation/verification
- `src/server/socialAuth.ts` - OAuth helpers
- `src/server/verifyAuth.ts` - Access check (Supabase primary → Airtable fallback)
- `src/server/externalAuth.ts` - External route auth (unified token + Supabase grants)
- `src/server/supabase/` - Supabase service layer (client, userService, accessService, airtableSyncService, circleSyncService, gameSyncService, systemFlagsService)
- `src/server/airtable/airtable-api.ts` - Customer purchase lookup (legacy fallback)
- `src/middlewares/index.ts` - Rate limiting middleware

### Content Delivery

Content flows from two sources:

1. **Static HTML Collections** (`src/content/`) - Pre-exported lessons stored as HTML files
2. **Circle.so API** - Dynamic lesson fetching with KV caching

The `getLessonContent()` function in `src/server/circle/circleClient.ts` handles caching logic with configurable TTL.

### Content Collections

Defined in `src/content.config.ts`, lessons are organized by course:
- `lessonsOfe`, `livesOfe` - Opanuj Frontend
- `lessonsOtsCore`, `lessonsOtsReact` - Opanuj TypeScript
- `lessonsCursor` - Cursor AI
- `lessons10xDevs1`, `lessons10xDevs2`, `lessons10xDevs2EN` - 10xDevs editions 1 & 2
- `lessons10xDevs3`, `lessons10xDevs3Prework` - 10xDevs 3.0
- `checklists` - Markdown-based checklists

### Course Mappings

`src/models/CollectionMappings.ts` defines the mapping between:
- `CourseSlug` - URL-friendly course identifiers (e.g. `cursor-ai`, `opanuj-frontend`, `10xdevs-3`, `10xdevs-3-prework`)
- `LessonCollection` - Astro content collection names
- `AirtableCourse` - Permission identifiers for purchase verification (e.g. `CURSOR_AI`, `10XDEVS_3`)

### Course Artifact Assets

Downloadable per-module artifact bundles (e.g. agent resources/skills for 10xDevs 3) are registered in `src/server/content/courseAssets.ts`.

To attach a new artifact zip:
1. Drop the zip in `src/assets/ai-artifacts/` (e.g. `10xdevs3-artifacts-m3.zip`).
2. Add a Vite `?url` import for it at the top of `courseAssets.ts`.
3. Add a `CourseAssetGroup` (with `moduleLabel`) containing a `CourseAssetItem` (`slug`, `label`, `filename`, `assetUrl`) to the relevant course array (e.g. `TEN_X_DEVS_3_ASSETS`).

The `REGISTRY` maps course IDs to these groups; `getCourseAssets()` / `findCourseAsset()` serve them. Note this touches server-side code — run the pre-push verification below.

### Supabase Database

Three tables serve as the unified access and state store. Schema lives in `supabase/migrations/`.

- `public.profiles` - One row per user, keyed by email (tracks `last_login`)
- `public.access_grants` - Per-user course access (`source`: `free | airtable | circle | manual`). `course_slug` matches `CourseSlug` values.
- `public.game_state` - Durable game state backup (KV is primary read path)

All queries go through the service role key — RLS is disabled because all access is server-side only (no direct browser→Supabase calls).

Local development: `supabase start` / `supabase stop`. Studio at http://127.0.0.1:54323.

### Cloudflare KV Namespaces

Configured in `wrangler.toml`:
- `MAGIC_LINKS` - Stores magic link tokens
- `PLATFORM_LESSON_CACHE` - Caches Circle.so lesson content
- `CIRCLE_MEMBERS` - L1 cache for Circle API membership checks
- `TOOLKIT_10X3_MEMBERSHIP_KV` - Bridge to 10x-toolkit `CLI_10X3_MEMBERSHIP_KV` (id `dd7fed61a71d42bfbace69865f18e9bb`). Source of truth for 10xDevs 3 / 3-prework external auth in PROD. Two binding aliases (`TOOLKIT_10X3_MEMBERSHIP_KV` and `CLI_10X3_MEMBERSHIP_KV`) point at the same namespace id. When `TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING="true"`, a `missing_record` lookup falls back to the legacy Circle membership check (mitigates Circle email changes leaving the KV with only the old hash); flip to `"false"` to disable.
- `GAME_STATE` - Primary game state store (fast edge reads/writes)
- `GAME_API_TOKENS` - Game API authentication tokens

#### Looking up a 10xDevs 3 membership record

Records are keyed by `member:<sha256(lowercased-email)>`. Lookup logic and record shape live in `src/server/toolkit/tenXDevs3Membership.ts`. Record JSON: `{ memberId, email, hasAccess, syncedAt, source: 'bulk_sync' | 'webhook' | 'seed' }`.

Wrangler one-liner (run from `projects/edu-platform/`):

```bash
EMAIL="user@example.com"
HASH=$(printf '%s' "$EMAIL" | tr '[:upper:]' '[:lower:]' | shasum -a 256 | awk '{print $1}')
npx wrangler kv key get "member:$HASH" --namespace-id dd7fed61a71d42bfbace69865f18e9bb --text
```

**Pitfall — do not trim with `xargs`.** `xargs` appends a trailing newline before piping to `shasum`, producing the wrong hash and a false 404. Always feed the email to `shasum` via `printf '%s'` (or `echo -n`). The hash must be over the lowercased email with no surrounding whitespace.

### Analytics Engine

- `ANON_GAME_STARTS` - Tracks anonymous game start events (dataset: `anon_game_starts`)

### Route Structure

**Pages:**
- `/` - Login redirect
- `/login` - Authentication page
- `/signup` - Registration page
- `/verify` - Magic link verification
- `/courses` - Course listing (authenticated)
- `/courses/[...courseSlug]` - Course overview
- `/courses/[...courseSlug]/lesson/[...id]` - Lesson view
- `/shared/[guid]` - Shared lesson via GUID
- `/shared/[guid]/markdown` - Shared lesson markdown export
- `/external/[courseId]` - External course index
- `/external/[courseId]/login` - External course login
- `/external/[courseId]/verify` - External course verification
- `/external/[courseId]/[lessonId]` - External lesson embedding
- `/external/[courseId]/[lessonId]/markdown` - External lesson markdown export
- `/external/10xdevs-2/checklists/[slug]` - Course checklists
- `/10xdevs-3/ebook/` - 10xDevs 3.0 ebook page
- `/explorers` - Space Explorers game
- `/explorers-editor` - Space Explorers level editor
- `/explorers/badges/rank` - Player rank badge
- `/explorers/resources/m0-study-notes` - Game study notes

**API routes:**
- `/api/auth` - Magic link auth
- `/api/auth/github`, `/api/auth/github/callback` - GitHub OAuth
- `/api/auth/google`, `/api/auth/google/callback` - Google OAuth
- `/api/logout` - Session logout
- `/api/captcha/verify` - Turnstile captcha verification
- `/api/customer-purchases` - Customer purchase lookup
- `/api/external/auth` - External course auth
- `/api/external/membership-debug` - Circle membership debug
- `/api/external/membership-refresh` - Circle membership cache refresh
- `/api/game`, `/api/game/state`, `/api/game/submit`, `/api/game/mission`, `/api/game/pending`, `/api/game/token` - Game endpoints
- `/api/game-editor` - Level editor API

## Environment Variables

Required secrets defined in `astro-env.ts`. For local dev, set in `.env.local`. For production, set in Cloudflare Pages dashboard (Settings → Environment Variables).

**Required:**
- `SITE_URL`, `ENV` - Deployment config
- `JWT_SECRET` - Token signing
- `AIRTABLE_API_KEY` - Customer data access (legacy fallback)
- `SUPABASE_URL` - Supabase project URL (in `wrangler.toml [vars]` for prod; `.env.local` for dev)
- `SUPABASE_SERVICE_KEY` - Supabase service role key (**secret** — Cloudflare dashboard only, never in wrangler.toml)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `CF_CAPTCHA_SITE_KEY`, `CF_CAPTCHA_SECRET_KEY` - Turnstile captcha
- `MAILING_SERVICE_URL` - Email service endpoint

**Optional:**
- `LESSON_CACHE_TTL_HOURS` - Lesson cache TTL (default: 24)
- `RESEND_API_KEY` - Resend email service
- `CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN`, `CIRCLE_BRAVE_V1_TOKEN` - Circle.so API tokens
- `EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS` - Circle membership cache TTL (default: 1440)
- `EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS` - Circle membership stale cache retention (default: 2160)
- `EXTERNAL_MEMBERSHIP_REFRESH_SECRET` - Secret for membership cache refresh endpoint
- `TEN_X_DEVS_MAILERLITE_API_KEY` - MailerLite integration for 10xDevs
- `TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID`, `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` - MailerLite group IDs for game events

## TypeScript Path Aliases

Configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@/components/*`, `@/layouts/*`, `@/models/*`, `@/middlewares/*`, `@/utils/*`, `@/server/*`, `@/explorers/*` → respective `src/` subdirs
- `@/images/*` → `src/assets/images/*`
- `@przeprogramowani/common/*` → `../common/*`

### Space Explorers Game

A Phaser 3 browser game developed at `src/explorers/`. The `/explorers` page renders a full-viewport Phaser canvas via a Svelte island (`client:only="svelte"`).

Key directories:
- `src/explorers/` - All game source code (~25 subdirectories)
- `src/explorers/scenes/` - Phaser scenes (GameScene, DialogueScene, ExamScene, TransitionScene, BootScene, PreloaderScene, ArcadeScene)
- `src/explorers/state/` - Game state management
- `src/explorers/entities/` - Game object definitions
- `src/explorers/terminal/` - In-game terminal system
- `src/explorers/arcade/` - Mini-game renderers (MemoryMatrix, Oscilloscope, AsteroidRange)
- `src/explorers/audio/` - Sound management
- `src/explorers/effects/` - Visual effects (spotlight reveal, etc.)
- `src/explorers/editor/` - Level Editor (map editing tools, tile palette, layer management)
- `src/explorers/config/` - Game configuration (gameConfig, sceneRegistry, mapRegistry, ranks, flags)

Key files:
- `src/pages/explorers.astro` - Game page entry point
- `src/pages/explorers-editor.astro` - Level editor page
- `src/layouts/GameLayout.astro` - Full-viewport layout (no header/footer)

Maps are authored as text sources — `src/explorers/levels/<map-key>/map.level.yaml` (see the cookbook's "Map Authoring Pipeline" section); the Tiled JSON in `public/game/maps/` is a compiled artifact regenerated with `npm run levels:build`. Never edit the JSON by hand — a Vitest sync test gates source/artifact drift.

Game documentation:
- `.ai/10x-devs/game/cookbook.md` - Game development cookbook
- `.ai/10x-devs/game/storyline.md` - Game storyline
- `.ai/10x-devs/game/backstory.md` - Game backstory
- `.ai/10x-devs/game/player-progression.md` - Player progression design

## Key Constraints

- **No React** - Use Svelte for interactive components
- **No `@apply`** - Use Tailwind utility classes directly
- **Server-rendered** - Output mode is `server` for SSR on Cloudflare Workers
- **UTF-8 handling** - Use `response.text()` instead of `.json()` for Circle API responses (Cloudflare Workers UTF-8 compatibility)
- **Localization (Space Explorers)** - All player-facing strings in `src/explorers/` must use `t()` for chrome (HUD, scene labels, terminal output, arcade results) or `BilingualText` for content (dialogues, exams, quests, arcade game titles/descriptions). Adding a new string requires both `pl` and `en` values; the bilingual parity test, the i18n strings parity test, and the static-analysis `noHardcodedPolish` test will fail otherwise. Spec/design documents and code comments remain in English.

### Lesson Shell Theming

- Keep regular and external lesson-reader theming scoped to lesson layouts and shared lesson shell components. Do not move lesson theme CSS into `BaseLayout` unless non-lesson routes should intentionally inherit it.
- Use `src/styles/lesson-theme.css` as the semantic theme layer: CSS variables plus classes such as `lesson-shell`, `lesson-surface`, `lesson-panel`, `lesson-topbar`, `lesson-nav-row`, `lesson-button-*`, and `lesson-prose`. Prefer these tokens over direct `bg-gray-*`, `text-gray-*`, `border-gray-*`, or one-off light/dark Tailwind replacements.
- Apply `data-lesson-theme` before paint in lesson layouts. The lesson theme defaults to dark, persists per device in `localStorage`, and should not depend on user profile, cookies, server data, or `prefers-color-scheme`.
- Typography and Highlight.js need explicit checks. If `prose-invert` or the dark highlight stylesheet remains as a fallback, light mode must override prose text, links, inline code, fenced code, and embedded controls. Watch for `.lesson-prose a` overriding button text; semantic button classes must win inside prose.
- Logo variants should keep stable dimensions and transparent backgrounds. Pass both white-on-dark and dark-on-light assets into the top bar, then swap them via theme CSS to avoid layout shift.
- Mobile topbar controls should stay compact: hide visible text labels where space is tight, preserve `aria-label`, and use distinct icons for distinct actions such as lesson list versus sections/TOC.
- Verify theme work on regular course lessons and external lessons, in desktop and mobile widths, including reload with stored light preference, clear-storage dark default, TOC/mobile panels, markdown download buttons, progress controls, code blocks, and logo swapping.

## Pre-push verification for server-side changes

When touching anything that runs server-side (API routes, `src/server/**`, middleware, the Sentry wrapper, Astro config, the Cloudflare adapter setup), always run **all three** locally before pushing — in this order:

```bash
npm run check           # astro check — catches Astro/Cloudflare type issues that `tsc --noEmit` alone misses (e.g. ExecutionContext shape)
npx vitest run          # full suite — server tests share mocks across files (e.g. @sentry/astro `flush` export)
npm run build           # catches bundler regressions and the content-bundling postcheck
```

`tsc --noEmit` is NOT a substitute for `npm run check` — Astro's checker uses a different config and surfaces errors that plain tsc skips. CI runs `nx affected -t lint check test`, and each failed round-trip costs a build + deploy cycle.

## User Interaction rules

- When you see conflicting instructions or requirements, always highlight all of them and ask (AskUserQuestion tool) before making a decision or change.
