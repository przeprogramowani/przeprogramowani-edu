# Avatar Proxy — Plan Brief

> Full plan: `context/changes/avatar-proxy/plan.md`

## What & Why

Replace the direct Supabase Storage public URL with a backend proxy at `/api/avatar/<userId>` so the storage origin is never exposed to the browser. Today the user's profile page, header strip, and mission-log UI all render `<img src="https://<project>.supabase.co/storage/v1/object/public/avatars/…">`, and the same URL is forwarded to the external badges API. After this change, every consumer sees a URL on our own domain and the underlying bucket is private.

## Starting Point

Avatars upload via `POST /api/profile/avatar` → `uploadAvatar()` in `src/server/supabase/userService.ts`, which stores bytes at object key `<userId>` in the public `avatars` Supabase bucket (≤2 MB, PNG/JPEG/WebP, `upsert: true`) and writes the resulting Supabase public URL into `profiles.avatar_url`. Production currently has only **4 of 1331 profiles** with an avatar set, all matching the canonical pattern — backfill cost is negligible.

## Desired End State

Every avatar `<img>` in the app points at `https://platforma.przeprogramowani.pl/api/avatar/<userId>?v=<ts>`. The `avatars` bucket is `public = false`; the proxy is the only access path. `profiles.avatar_url` holds the absolute proxy URL so the badges API call works verbatim with no per-call URL construction. Proxy 404/502 responses degrade gracefully to the existing initials fallback.

## Key Decisions Made

| Decision                       | Choice                                                 | Why (1 sentence)                                                                                       | Source |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------ |
| URL identifier                 | User UUID in path                                      | userId is already the storage key; one-to-one mapping; no extra column or token-management surface     | Plan   |
| Bucket privacy                 | Make `avatars` bucket private                          | Real defense in depth — without this, the Supabase URL is still discoverable and the goal is half-met  | Plan   |
| Proxy auth                     | Public (no auth)                                       | Matches today's threat model; required so the external badges API can fetch the URL                    | Plan   |
| `profiles.avatar_url` contents | **Absolute proxy URL** (overridden from initial pick)  | One field directly usable everywhere including the badges API forwarder — no per-call URL construction | Plan   |
| Cache strategy                 | `Cache-Control: public, max-age=31536000, immutable`   | `?v=<ts>` cache-buster makes "immutable" honest; browser cache absorbs repeat renders                  | Plan   |
| Failure mode                   | 404 / 502 with empty body; client onerror → initials   | Honest semantics; initials are already the empty-state pattern                                         | Plan   |
| Rollout                        | Single release; deploy first, then migrate             | Only 4 affected rows; the deploy-before-migrate order protects them if the deploy regresses            | Plan   |

## Scope

**In scope:**

- New `GET /api/avatar/[userId]` route that streams from Supabase Storage via the service-role admin client
- `buildAvatarUrl()` helper in `src/server/supabase/userService.ts`
- `uploadAvatar()` writes absolute proxy URL instead of Supabase URL
- `onerror` initials fallback in `AccountStrip.astro` and `ProfileForm.svelte`
- Migration: backfill the 4 existing rows + flip `avatars` bucket to `public = false`

**Out of scope:**

- Signed URLs or per-request tokens
- Cloudflare edge cache (`caches.default`)
- Renaming `profiles.avatar_url` or changing its type
- A default-avatar PNG asset
- Migration of local-dev rows (overwritten naturally on next upload)

## Architecture / Approach

```
Browser <img src="https://platforma.przeprogramowani.pl/api/avatar/<id>?v=<ts>">
   │
   ▼
GET /api/avatar/[userId]   ◀── Cloudflare Pages route (no auth)
   │
   ▼
getSupabaseAdmin(env).storage.from('avatars').download(userId)
   │
   ▼
Stream Blob back with Content-Type from blob.type
+ Cache-Control: public, max-age=31536000, immutable
```

Storage stays at object key `<userId>`. `profiles.avatar_url` holds the absolute URL; consumers continue treating it as an opaque string.

## Phases at a Glance

| Phase                                          | What it delivers                                                                          | Key risk                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1. Proxy route + URL helper                    | `GET /api/avatar/[userId]` and `buildAvatarUrl()`; nothing wired through yet              | Misjudging the Blob response shape from Supabase JS SDK; mitigated by route smoke test pre-merge    |
| 2. Switch writers + client fallback            | `uploadAvatar()` writes proxy URL; render sites get onerror → initials                    | Caching: stale DB rows still hold the Supabase URL until Phase 3, but bucket is still public so OK  |
| 3. Backfill rows + lock bucket private         | One migration: rewrite 4 rows + `public = false` on `avatars` bucket                      | Migration runs before deploy is live → 4 users see broken avatars; ordering note is in the plan     |

**Prerequisites:** Production deploy must be verified live before `supabase db push --linked` is run. Supabase CLI linked to `uxankjtsfdgrlogkdioz` (already the case).

**Estimated effort:** One focused session — proxy + helper + writer swap + 2 small UI fallbacks + one migration. ~3-4 hours including local verification, plus a coordinated PROD deploy + migration step.

## Open Risks & Assumptions

- The Supabase JS SDK's `.download()` returns a `Blob` whose `.type` reflects the originally-uploaded MIME type. Verified in SDK v2.98.0 docs but should be confirmed by the Phase 1 smoke test.
- The badges API at `https://badges.10xdevs.pl` accepts any publicly-fetchable `imageUrl`; no allowlist on the URL host is documented. If they later allowlist origins, the new proxy host needs to be added.
- Local-dev rows with `127.0.0.1:54321/...` are left alone by the regex-based migration. Developers who care can re-upload locally; this is a one-time, per-developer concern.

## Success Criteria (Summary)

- No browser network tab on the platform shows a `*.supabase.co` URL for an avatar.
- Direct fetch of the old Supabase URL pattern returns an error from Supabase (bucket private).
- Mission Log badge generation succeeds in PROD because the badges API can fetch the proxy URL.
