# Przeprogramowani.pl - Edu Platform

Protected course platform deployed on Cloudflare Pages.

**Production URL:** https://przeprogramowani-edu.pages.dev

## Stack

- **Runtime** - Cloudflare Pages (SSR via Workers)
- **Framework** - Astro 5 + Svelte 5 islands
- **Auth** - Magic link + GitHub/Google OAuth → HttpOnly JWT cookie
- **Access control** - Supabase (`access_grants` table); Airtable as fallback
- **Content** - Static HTML collections + Circle.so API with KV cache
- **Game** - Phaser 3 (`src/explorers/`), state in Cloudflare KV + Supabase backup

## Local Development

```bash
# Start Supabase (required for auth/access checks)
supabase start

# Start dev server (port 3000)
npm run dev

# Stop Supabase when done
supabase stop
```

Supabase Studio: http://127.0.0.1:54323

## Environment

Copy `.env.local` values from a teammate or set up your own:

```
ENV=dev
SITE_URL=http://localhost:3000
JWT_SECRET=...
AIRTABLE_API_KEY=...
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=<service_role key from supabase status>
# + GitHub/Google OAuth, Captcha, etc.
```

## Key Directories

| Path | Purpose |
|------|---------|
| `src/pages/` | Astro routes |
| `src/server/supabase/` | Supabase service layer (access, user, game sync) |
| `src/server/airtable/` | Airtable client (purchase lookup, fallback) |
| `src/server/circle/` | Circle.so membership + KV cache |
| `src/explorers/` | 10x Explorers Phaser game |
| `src/content/` | Pre-exported lesson HTML |
| `supabase/migrations/` | Database schema |
