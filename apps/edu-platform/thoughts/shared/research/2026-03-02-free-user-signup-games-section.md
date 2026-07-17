---
date: 2026-03-02T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: 9e9d54bc9fb659acba097c2af3dca7c26f1d63e3
branch: master
repository: przeprogramowani-sites/projects/edu-platform
topic: "Free user sign up/sign in (no course required) + Games section with Space Explorers"
tags: [research, auth, free-users, games, explorers, courses, airtable, jwt]
status: complete
last_updated: 2026-03-02
last_updated_by: Claude Sonnet 4.6
last_updated_note: "Added locked tile UX — show all courses with lock icon + purchase redirect for non-owners"
---

# Research: Free User Sign Up / Games Section (Space Explorers)

**Date**: 2026-03-02
**Git Commit**: `9e9d54bc`
**Branch**: master

## Research Question

Currently `Login.svelte` says _"Adres email na danej platformie musi być taki sam, jak ten użyty podczas zakupu kursu."_ — we want to introduce sign up / sign in that does not require any courses, but makes the Space Explorers game available to all authenticated users as a new "Games" tile/section.

---

## Summary

The platform is **100% Airtable-gated**: every auth path (magic link, GitHub, Google) verifies the user's email against the Airtable "Klienci" table and rejects anyone without a purchase record. There is no concept of a free user, no registration flow, and no open endpoint that creates users.

The Space Explorers game (`/explorers`) is already **not** behind a purchase gate — it uses `verifyToken()` (JWT-only) rather than `verifyAuth()` (JWT + Airtable). The full game-state persistence infrastructure (Cloudflare KV `GAME_STATE`, `/api/game/state` GET/PUT) is also already in place and works for any valid JWT regardless of course ownership.

The primary work is therefore in **the auth layer** (allow any email in without Airtable check) and **the platform UI** (expose a Games section for free users after they log in).

---

## Detailed Findings

### 1. Current Auth Gates — What Blocks Free Users

#### 1a. Magic Link (`src/pages/api/auth.ts`)

```
22:34:src/pages/api/auth.ts
```

```typescript
const customer = await verifyCustomerEmail(email, env);
if (!customer) {
  return new Response(
    JSON.stringify({ error: 'Upewnij się, że przy zakupie kursu został użyty ten sam email.' }),
    { status: 401 }
  );
}
```

Any email not in Airtable gets a **401** before a magic link is even sent.

#### 1b. GitHub OAuth Callback (`src/pages/api/auth/github/callback.ts`)

```
127:131:src/pages/api/auth/github/callback.ts
```

```typescript
const customerPurchases = await getCustomerPurchases(primaryEmail, env);
if (!customerPurchases || customerPurchases.purchasedCourses.length === 0) {
  return redirect('/login?error=MISSING_COURSES');
}
```

#### 1c. Google OAuth Callback (`src/pages/api/auth/google/callback.ts`)

```
85:95:src/pages/api/auth/google/callback.ts
```

Same pattern — redirects to `/login?error=MISSING_COURSES` for users not in Airtable.

#### 1d. `socialAuth.ts` helper

```
46:52:src/server/socialAuth.ts
```

`handleSocialAuth()` calls `verifyCustomerEmail()` and returns `{ success: false, error: 'MISSING_USER' }` for unknown emails.

#### 1e. `verify.astro` (magic link redemption)

```
22:30:src/pages/verify.astro
```

After redeeming the token it calls `getCustomerPurchases()` and redirects to `/courses`. No crash for empty purchases here — but the empty state is never reached because `api/auth.ts` blocks first.

---

### 2. What Does NOT Block Free Users (Already Good)

#### 2a. `explorers.astro` — no purchase check

```
6:12:src/pages/explorers.astro
```

```typescript
if (token) {
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (payload) userEmail = payload.email;
}
```

Uses `verifyToken()` (signature + expiry only). Unauthenticated visitors can already play; authenticated visitors get cloud save. **No Airtable call here.**

#### 2b. `/api/game/state` — JWT-only auth

```
33:47:src/pages/api/game/state.ts
```

```typescript
const token = cookies.get('token')?.value;
const payload = await verifyToken(token, env.JWT_SECRET);
if (!payload) return new Response(null, { status: 401 });
```

**No Airtable call.** Any valid JWT (including future free-user JWTs) can read/write game state.

#### 2c. KV `GAME_STATE` namespace

```
wrangler.toml
```

Already provisioned (`id: 20d16620dfdb441a99454c15fea0dc09`). State key: `v1-game-state-{email.toLowerCase()}`. TTL 365 days.

---

### 3. Platform UI — Where Free Users Would Land

#### 3a. `courses.astro` — hard redirect on auth failure

```
10:14:src/pages/courses.astro
```

```typescript
const authResult = await verifyAuth(Astro);
if (!authResult.isAuthenticated) return Astro.redirect('/login');
```

`verifyAuth()` calls `getCustomerPurchases()`. If the email is not in Airtable, it returns `null` → `isAuthenticated: false` → redirect to login. Free users would be kicked back.

#### 3b. `CourseList.astro` — single flat grid, no sections

```
21:69:src/components/CourseList.astro
```

Accepts `customerPurchases: AirtableCourse[]`. Defines 5 courses, filters by `isAvailable` flag. **No sections or groupings exist today.** Free users with no purchases would see an empty list.

#### 3c. Game not linked from anywhere

The `/explorers` route exists but is not referenced in any `.astro` page. Users reach it only via direct URL.

---

### 4. JWT & User Data Model

```
14:28:src/server/auth.ts
```

JWT payload is minimal: `{ email, exp, nbf }`. No role, no user type. The token is stored as an HttpOnly cookie `token`, valid 24 h.

There is **no user record** in any database created by the platform itself. Identity lives in Airtable + the JWT cookie. The game-state KV entry is the only server-side artifact created per-user.

---

## Architecture Insights

### The Core Tension

The game already works for any email (JWT-only). The platform UI and auth endpoints assume every user is a paying Airtable customer. The gap is narrow:

| Layer | Today | Needs to change |
|---|---|---|
| `api/auth.ts` (magic link) | Rejects non-customers | Allow any email → send magic link |
| `api/auth/github/callback.ts` | Rejects on 0 purchases | Allow 0 purchases → continue |
| `api/auth/google/callback.ts` | Rejects on 0 purchases | Allow 0 purchases → continue |
| `socialAuth.ts` | Fails on `MISSING_USER` | Return success with empty purchases |
| `verify.astro` | Redirects to `/courses` | Same destination is fine; page adapts |
| `verifyAuth.ts` | Returns `isAuthenticated: false` if no Airtable record | Return `true` with empty purchases |
| `getCustomerPurchases()` | Returns `null` for unknown email | Return empty array for unknown email |
| `courses.astro` | Redirects free users to login | Accept free users, show empty courses + Games section |
| `CourseList.astro` | Shows nothing for free users | Add "Gry" section always visible to authenticated users |
| `Login.svelte` | Shows course-purchase message | Remove or conditionalize the message |

### Approach — Minimal Disruption

The least-risky approach keeps Airtable as the **course permission** source but removes it as an **existence gate**. Anyone with a valid email can get a JWT; Airtable is only consulted for course tiles.

No new database, no new KV namespace, no new user table needed. The `GAME_STATE` KV already handles free-user persistence.

### Locked Tile UX — Incentivise Course Purchase

Rather than hiding unpurchased courses, **show all courses to all authenticated users** with a visual lock treatment for courses the user doesn't own. Locked tiles link out to the marketing/purchase page for the relevant course. This surfaces the course catalogue to free users and drives purchase intent.

**Key observations from `CourseList.astro`:**
- Line 69: `.filter((c) => c.isAvailable)` currently hides locked courses entirely — this filter is removed
- Lines 74–86: Conditional styles for `isAvailable` already exist in the code but are dead (never triggered due to the filter) — these become the foundation for the locked visual state
- A new `purchaseUrl` field is added to the `Course` interface per tile

**Marketing site URLs (confirmed from monorepo `astro.config.mjs` files):**

| Course | Marketing URL |
|---|---|
| Opanuj Frontend | `https://opanujfrontend.pl` |
| Opanuj Frontend: Live | `https://opanujfrontend.pl` |
| Cursor: Programuj z AI | `https://opanuj.ai` |
| Opanuj TypeScript: Core Pro | `https://opanujtypescript.pl` |
| Opanuj TypeScript: React Pro | `https://opanujtypescript.pl` |

**Locked tile behaviour:**
- Image gets a dark overlay with a centred lock icon (SVG, `w-8 h-8`)
- Title and description remain visible (slightly dimmed)
- CTA button changes to "Kup kurs" and links to `purchaseUrl` with `target="_blank" rel="noopener noreferrer"`
- Unlocked tile behaviour is unchanged

---

## Files That Must Change

### Auth Layer

| File | Change |
|---|---|
| `src/pages/api/auth.ts` | Remove `verifyCustomerEmail()` gate; allow any email to receive a magic link |
| `src/pages/api/auth/github/callback.ts` | Remove `MISSING_COURSES` rejection; allow 0 purchases through |
| `src/pages/api/auth/google/callback.ts` | Same as GitHub |
| `src/server/socialAuth.ts` | Remove `MISSING_USER` failure path; return success with `purchasedCourses: []` |
| `src/server/airtable/airtable-api.ts` | `getCustomerPurchases()` returns `{ email, purchasedCourses: [] }` instead of `null` for unknown emails |
| `src/server/verifyAuth.ts` | When Airtable returns empty purchases, still set `isAuthenticated: true` |
| `src/pages/verify.astro` | Verify it handles the empty-purchases case gracefully (no redirect to login) |

### Platform UI

| File | Change |
|---|---|
| `src/components/Login.svelte` | Remove "Adres email na danej platformie musi być taki sam..." helper text |
| `src/pages/courses.astro` | Do not redirect on empty purchases; pass purchases (possibly empty) to `CourseList` |
| `src/components/CourseList.astro` | (1) Add `purchaseUrl` field to `Course` interface; (2) remove `.filter((c) => c.isAvailable)` so all courses are shown; (3) render lock overlay + "Kup kurs" CTA for locked courses linking to `purchaseUrl`; (4) add "Gry" section always visible with Space Explorers tile |

---

## Post-Login Redirect for Free Users

After OAuth or magic-link redemption, the user is currently sent to `/courses`. This remains correct — the `/courses` page will now show an empty courses grid plus the new "Gry" section. No new routing needed.

For OAuth callbacks (`verify.astro` / GitHub / Google), the redirect target is `/courses` — no change needed there.

---

## Edge Cases / Risk Areas

1. **Rate limiting** — `/api/auth` is rate-limited to 10 s between requests (`src/middlewares/index.ts:5-8`). No change needed; still applies to free-user magic links.

2. **Admin shortcut** — `src/server/admins.ts` hard-codes one admin email. Unaffected; admins still get all courses.

3. **`verifyCustomerEmail()`** — currently used in `api/auth.ts` and `socialAuth.ts`. Once removed as a gate, it may become unused. Check before deleting; it is also the source of the "course purchase" error message.

4. **Email spoofing / abuse** — Removing the Airtable gate means anyone who knows the URL can sign up. If abuse is a concern, Cloudflare Turnstile (already on the login page) provides the only friction. Consider whether magic links should have an additional rate limit per email.

5. **`getCustomerPurchases()` returning `null` vs empty** — Multiple call sites check `if (!customerPurchases)`. Changing the return type to always return an object (with empty `purchasedCourses`) is the cleanest fix and avoids null-check divergence.

6. **CourseList tile assets** — The new Games tile will need an image/asset and gradient style consistent with the existing course tiles.

7. **Locked tile click target** — The whole card could be made a link (or just the CTA button). Recommend linking only the CTA button to keep the UX predictable and avoid accidental navigations.

---

## Open Questions

1. **Should free users be distinguished in the JWT payload?** (e.g., `type: 'free' | 'customer'`) — or is checking `purchases.length === 0` at render-time sufficient?

2. **Games section content**: One tile (Space Explorers) for now — will more games be added? Should the section be a standalone page (`/games`) or just a section on `/courses`?

3. **Free-user post-login UX**: Should a first-time free user land on `/explorers` directly (game) rather than `/courses` (which shows only Games)? Requires detecting "no courses, first login".

4. **Magic link for unverified emails**: Should we verify email ownership (already handled by the magic link flow — they click the link in their inbox) or add email format validation? The existing Turnstile captcha handles bot spam at submission time.

5. **Removing `verifyCustomerEmail()` call in `api/auth.ts`**: Does any other system rely on this check (e.g., logging, analytics)?

---

## Code References

- `src/pages/api/auth.ts:22-34` — Airtable gate in magic link flow
- `src/pages/api/auth/github/callback.ts:127-131` — MISSING_COURSES rejection
- `src/pages/api/auth/google/callback.ts:85-95` — MISSING_COURSES rejection
- `src/server/socialAuth.ts:46-52` — MISSING_USER error
- `src/server/airtable/airtable-api.ts:36-53` — `getCustomerPurchases()` null return
- `src/server/verifyAuth.ts:41-53` — purchase lookup + course-specific gate
- `src/pages/courses.astro:10-14` — auth redirect guard
- `src/components/CourseList.astro:21-69` — tile grid, `isAvailable` filter (line 69 removed); dormant locked styles at 74–86 repurposed for lock overlay
- `src/components/CourseList.astro:74-86` — existing conditional styles for locked state (dead code today, reused for lock overlay)
- `src/pages/explorers.astro:6-12` — JWT-only soft auth (already correct)
- `src/pages/api/game/state.ts:33-47` — JWT-only game state API (already correct)
- `src/components/Login.svelte:134-136` — "must use same email as purchase" message
- `wrangler.toml` (kv_namespaces) — GAME_STATE already provisioned

## Related Research

- `thoughts/shared/research/2026-03-02-game-state-user-integration.md` — game state persistence research
- `thoughts/shared/plans/2026-03-02-game-state-user-integration.md` — game state integration plan (all 6 phases complete)
