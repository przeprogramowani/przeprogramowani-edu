# Free User Sign-Up + Games Section Implementation Plan

## Overview

Allow any email to sign in (magic link, GitHub, Google) without requiring an Airtable purchase
record. After login, free users land on `/courses` which shows all course tiles in a **locked**
state (with a "Kup kurs" CTA) plus a new **"Gry"** section that links to the Space Explorers game.
Paying customers are unaffected.

---

## Current State Analysis

The platform is 100% Airtable-gated: every auth path verifies the user's email against Airtable
"Klienci" before issuing a JWT. There is no concept of a free user.

Key blockers identified:

- `src/pages/api/auth.ts:26-34` — magic link blocked before sending if email not in Airtable
- `src/server/socialAuth.ts:46-53` — `handleSocialAuth()` fails with `MISSING_USER` for unknown emails
- `src/pages/api/auth/github/callback.ts:127-131` — secondary `purchasedCourses.length === 0` check
- `src/pages/api/auth/google/callback.ts:92-95` — same secondary check
- `src/pages/verify.astro:21-25` — magic link redemption blocked if no purchases
- `src/server/verifyAuth.ts:43-45` — `getCustomerPurchases()` returning `null` → `isAuthenticated: false`
- `src/server/airtable/airtable-api.ts:42-44` — `getCustomerPurchases()` returns `null` for unknown emails
- `src/components/CourseList.astro:69` — `.filter((c) => c.isAvailable)` hides all courses from free users
- `src/components/Login.svelte:134-136` — purchase-hint text misleads free users

---

## Desired End State

After this plan is complete:

1. Any email address can receive a magic link and sign in.
2. Any GitHub / Google account can sign in regardless of Airtable.
3. Post-login, all users land on `/courses`.
4. Free users see all course tiles in a locked state with a "Kup kurs" button per tile.
5. A "Gry" section appears below the course grid for all authenticated users, linking to `/explorers`.
6. Paid users see their purchased courses unlocked and all others locked (no change to course access).
7. Course content pages (`/courses/[slug]`, `/courses/[slug]/lesson/[id]`) remain inaccessible to
   free users — `verifyAuth(Astro, courseSlug)` already enforces the `PERMISSION_MAPPINGS` check
   and will redirect unpurchased users to `/login`.
8. External Circle-auth routes (`/external/...`) are **completely unaffected** — they use
   `verifyExternalAuth` (separate JWT + Circle membership check).

---

## Key Discoveries

- `verifyCustomerEmail()` (`src/server/auth.ts:4-12`) is a thin wrapper: `!!getCustomerPurchases()`.
  Once `getCustomerPurchases` never returns `null`, this function is meaningless and should be
  removed along with all its call sites.
- GitHub and Google callbacks make **two** redundant Airtable calls: one inside `handleSocialAuth()`
  and a second explicit `getCustomerPurchases()` + purchases check. Both must be removed.
- `verify.astro` has its own purchases check (`src/pages/verify.astro:23-25`) which would still
  block free users even after fixing `api/auth.ts`. This is not mentioned in the original research
  and must be fixed.
- Course-level protection is safe: `verifyAuth(Astro, courseSlug)` at
  `src/server/verifyAuth.ts:47-53` checks `PERMISSION_MAPPINGS` against `purchasedCourses`. Free
  users have `purchasedCourses: []`, so they are rejected. No changes needed there.
- External (`/external`) routes use `verifyExternalAuth` + Circle `resolveMembership` — entirely
  independent from platform JWT and Airtable. Zero impact.
- `src/pages/shared/[guid].astro` is intentionally public (no auth). Unchanged.
- `src/components/CourseList.astro:74-86` already contains conditional CSS for locked tiles (dead
  code today); these styles become the lock overlay foundation.

---

## What We're NOT Doing

- No new database, KV namespace, or user table.
- No change to course content pages — free users are still blocked by `verifyAuth(courseSlug)`.
- No change to `/external` routes — Circle auth is independent.
- No separate `/games` route — the Games section lives on `/courses`.
- No special redirect to `/explorers` for first-time free users — `/courses` is the post-login
  destination for everyone.
- No per-email magic-link rate limit beyond what Turnstile + the existing 10 s IP rate limit provide.
- No JWT payload changes (`type: 'free' | 'customer'`) — `purchases.length === 0` at render time
  is sufficient.
- No migration of existing localStorage game state for free users — they start fresh.

---

## Implementation Approach

Two sequential phases.

**Phase 1** removes the Airtable-existence gate from all auth paths. After Phase 1, any email
can obtain a JWT. Course content pages still protect themselves via `PERMISSION_MAPPINGS`.

**Phase 2** updates the platform UI: locked tile treatment for unpurchased courses, the new
"Gry" section, and removal of the purchase-hint message from the login form.

---

## Critical Implementation Details

### State Management Sequencing

- **`getCustomerPurchases` return type**: Changes from `Promise<CustomerPurchase | null>` to
  `Promise<CustomerPurchase>`. For unknown emails it returns `{ email: customerEmail, purchasedCourses: [] }`.
  Airtable errors still `throw` (existing behavior). This means the `if (!customerPurchases)` null
  check in `verifyAuth.ts` becomes dead code and must be removed to keep TypeScript clean.
- **`verifyCustomerEmail` removal**: All three callers (`api/auth.ts`, `socialAuth.ts`, `verify.astro`
  indirectly) are updated in Phase 1. The function itself is deleted from `auth.ts`. No other
  files import it.
- **`socialAuth.ts` env type**: The `AIRTABLE_API_KEY` is removed from the env destructuring since
  `handleSocialAuth` no longer calls Airtable. `JWT_SECRET` is still required.

### User Experience Specification

- **Locked tile**: dark overlay (`bg-black/50`) on the image with a centred lock SVG (`w-8 h-8 text-white`).
  Title and description slightly dimmed. CTA changes to "Kup kurs" → `purchaseUrl` with
  `target="_blank" rel="noopener noreferrer"`.
- **Unlocked tile**: unchanged from current appearance.
- **Games section**: appears below the course grid for all authenticated users. Uses a placeholder
  thumbnail (reuse `thumbnailCursor` until a custom asset is created). Gradient:
  `bg-gradient-to-tr from-violet-900 to-purple-950`. CTA: "Zagraj teraz" → `/explorers`.
- **Login form**: the "Adres email na danej platformie..." helper text is removed; no replacement
  text needed.

### Debug & Observability Plan

- **Verification**: TypeScript compile (`npx tsc --noEmit`) after each phase catches type errors
  from the return-type change.
- **Runtime check for Phase 1**: verify that a brand-new email (not in Airtable) successfully
  receives a magic link and can log in.
- **Runtime check for Phase 2**: verify that a free user sees locked tiles and the Games section;
  verify that clicking a locked tile opens the marketing URL in a new tab.

---

## Phase 1: Remove Airtable Existence Gate

### Overview

Change `getCustomerPurchases` to return empty purchases for unknown emails, then remove every
downstream Airtable-existence check across all auth paths.

### Changes Required

#### 1. `src/server/airtable/airtable-api.ts`

**Change**: Return `{ email: customerEmail, purchasedCourses: [] }` instead of `null` for records
not found. Update return type to non-nullable.

```typescript
// Line 21 — update signature:
export async function getCustomerPurchases(
  customerEmail: string,
  apiKey: string
): Promise<CustomerPurchase> {   // was: Promise<CustomerPurchase | null>

  // ... admin shortcut unchanged ...

  // Lines 42-44 — replace null return:
  if (records.length === 0) {
    return { email: customerEmail, purchasedCourses: [] };  // was: return null;
  }

  // ... rest unchanged ...
}
```

#### 2. `src/server/auth.ts`

**Change**: Delete `verifyCustomerEmail()` entirely (lines 4-12). It was only a thin wrapper
around `getCustomerPurchases` used to gate auth; that gate is now removed.

```typescript
// Remove these lines completely:
export async function verifyCustomerEmail(email: string, apiKey: string) {
  try {
    const purchases = await getCustomerPurchases(email, apiKey);
    return !!purchases;
  } catch (error) {
    console.error('Error verifying customer:', error);
    return false;
  }
}
// Also remove the getCustomerPurchases import if it becomes unused in this file.
```

#### 3. `src/pages/api/auth.ts`

**Change**: Remove `verifyCustomerEmail` import and the Airtable gate (lines 2, 26-34).

```typescript
// Remove this import:
import { verifyCustomerEmail, generateToken } from '../../server/auth';
// Replace with:
import { generateToken } from '../../server/auth';

// Remove these lines (26-34):
const isValidCustomer = await verifyCustomerEmail(email, AIRTABLE_API_KEY);
if (!isValidCustomer) {
  return createJsonResponse(
    { error: 'Upewnij się, że przy zakupie kursu został użyty ten sam email.' },
    401,
    responseHeaders
  );
}

// Also remove AIRTABLE_API_KEY from the astro:env/server import if no longer used.
```

#### 4. `src/server/socialAuth.ts`

**Change**: Remove `verifyCustomerEmail` import and check (lines 1, 44-53). Remove
`AIRTABLE_API_KEY` from the env destructuring (no longer needed).

```typescript
// Remove this import:
import { verifyCustomerEmail, generateToken } from './auth';
// Replace with:
import { generateToken } from './auth';

// Update env destructuring (line 13-16) — remove AIRTABLE_API_KEY:
const { JWT_SECRET } = env as { JWT_SECRET: string };

// Remove the AIRTABLE_API_KEY guard (lines 19-25) and the verifyCustomerEmail block (lines 44-53):
// Delete:
if (!AIRTABLE_API_KEY) { ... }
const isValidCustomer = await verifyCustomerEmail(email, AIRTABLE_API_KEY);
if (!isValidCustomer) { return { success: false, error: 'MISSING_USER' }; }
```

#### 5. `src/pages/api/auth/github/callback.ts`

**Change**: Remove `getCustomerPurchases` import, `AIRTABLE_API_KEY` import, and the secondary
purchase check (lines 3-4, 127-131).

```typescript
// Remove:
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
// and AIRTABLE_API_KEY from the astro:env/server import

// Remove lines 127-131:
const customerPurchases = await getCustomerPurchases(primaryEmail, AIRTABLE_API_KEY);
if (!customerPurchases || customerPurchases.purchasedCourses.length === 0) {
  return redirect('/login?error=MISSING_COURSES');
}
```

#### 6. `src/pages/api/auth/google/callback.ts`

**Change**: Same pattern as GitHub callback — remove `getCustomerPurchases` import,
`AIRTABLE_API_KEY` import, and the secondary purchase check (lines 3-4, 92-95).

```typescript
// Remove:
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
// and AIRTABLE_API_KEY from the astro:env/server import

// Remove lines 92-95:
const customerPurchases = await getCustomerPurchases(userInfo.email, AIRTABLE_API_KEY);
if (!customerPurchases || customerPurchases.purchasedCourses.length === 0) {
  return redirect('/login?error=MISSING_COURSES');
}
```

#### 7. `src/pages/verify.astro`

**Change**: Remove `getCustomerPurchases` import and the purchases check (lines 5, 21-25).

```typescript
// Remove:
import { getCustomerPurchases } from '@/server/airtable/airtable-api';

// Remove lines 21-25:
const customerPurchases = await getCustomerPurchases(email as string, env.AIRTABLE_API_KEY);
if (!customerPurchases || customerPurchases.purchasedCourses.length === 0) {
  return Astro.redirect('/login?error=MISSING_COURSES');
}
```

#### 8. `src/server/verifyAuth.ts`

**Change**: Remove the now-dead null check (lines 43-45) — `getCustomerPurchases` no longer
returns `null` for valid emails.

```typescript
// Remove lines 43-45:
if (!customerPurchases) {
  return { isAuthenticated: false };
}
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles without errors: `npx tsc --noEmit` (run from `projects/edu-platform`)
- [x] No remaining references to `verifyCustomerEmail` in the codebase

#### Manual Verification

- [ ] A brand-new email (not in Airtable) receives a magic link and successfully logs in
- [ ] A GitHub account not in Airtable completes OAuth and lands on `/courses`
- [ ] A Google account not in Airtable completes OAuth and lands on `/courses`
- [ ] A free user trying to open `/courses/opanuj-frontend` is redirected to `/login`
- [ ] A paying customer's login flow and course access are unaffected

**Pause here for manual verification before proceeding to Phase 2.**

---

## Phase 2: Platform UI — Locked Tiles, Games Section, Login Form

### Overview

Update `CourseList.astro` to show all courses (locked for unpurchased), add a "Gry" section with
the Space Explorers tile, and remove the purchase-hint message from `Login.svelte`.

### Changes Required

#### 1. `src/components/Login.svelte`

**Change**: Remove the purchase-hint text at lines 134-136.

```svelte
<!-- Remove this block entirely: -->
<div class="mt-3 text-xs text-center text-gray-400">
  Adres email na danej platformie musi być taki sam, jak ten użyty podczas zakupu kursu.
</div>
```

#### 2. `src/components/CourseList.astro`

**Change**: Multiple updates to the Course interface, tile rendering, and section structure.

**2a. Add `purchaseUrl` to the `Course` interface and tile definitions:**

```typescript
interface Course {
  title: string;
  description: string;
  imageUrl: string;
  theme: string;
  href: string;
  isAvailable: boolean;
  purchaseUrl: string;  // add this field
}

const courses: Course[] = [
  {
    title: 'Opanuj Frontend',
    // ... existing fields ...
    isAvailable: customerPurchases.includes('OPANUJ_FRONTEND'),
    purchaseUrl: 'https://opanujfrontend.pl',
  },
  {
    title: 'Opanuj Frontend: Nagrania spotkań z ekspertami',
    // ...
    isAvailable: customerPurchases.includes('OPANUJ_FRONTEND'),
    purchaseUrl: 'https://opanujfrontend.pl',
  },
  {
    title: 'Cursor: Programuj z AI',
    // ...
    isAvailable: customerPurchases.includes('CURSOR_AI'),
    purchaseUrl: 'https://opanuj.ai',
  },
  {
    title: 'Opanuj TypeScript: Core Pro',
    // ...
    isAvailable: customerPurchases.includes('OPANUJ_TYPESCRIPT'),
    purchaseUrl: 'https://opanujtypescript.pl',
  },
  {
    title: 'Opanuj TypeScript: React Pro',
    // ...
    isAvailable: customerPurchases.includes('OPANUJ_TYPESCRIPT'),
    purchaseUrl: 'https://opanujtypescript.pl',
  },
];
```

**2b. Remove the `.filter((c) => c.isAvailable)` on line 69 and update tile rendering:**

Replace the current filtered map with a version that shows all courses, with locked treatment:

```astro
<div class='py-12'>
  <div class='grid grid-cols-1 md:grid-cols-2 gap-8'>
    {
      courses.map((course) => (
        <div class={`${course.theme} rounded-xl overflow-hidden flex flex-col`}>
          <div class="relative">
            <img src={course.imageUrl} alt={course.title} class='w-full h-72 object-cover' />
            {!course.isAvailable && (
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
          </div>
          <div class='p-8 flex flex-col'>
            <h3 class={`text-2xl font-semibold mb-3 ${course.isAvailable ? 'text-white' : 'text-gray-400'}`}>
              {course.title}
            </h3>
            <p class={`text-sm leading-relaxed mb-6 ${course.isAvailable ? 'text-gray-100' : 'text-gray-500'}`}>
              {course.description}
            </p>
            {course.isAvailable ? (
              <a
                href={course.href}
                class="w-full text-center py-3 px-6 rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-gray-900">
                Otwórz kurs
              </a>
            ) : (
              <a
                href={course.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full text-center py-3 px-6 rounded-lg transition-all duration-300 bg-gray-800/80 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-200">
                Kup kurs
              </a>
            )}
          </div>
        </div>
      ))
    }
  </div>

  <!-- Games section — always visible for authenticated users -->
  <div class="mt-12">
    <h2 class="text-xl font-semibold text-white mb-6">Gry</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gradient-to-tr from-violet-900 to-purple-950 rounded-xl overflow-hidden flex flex-col">
        <img src={thumbnailCursor.src} alt="10x Explorers" class="w-full h-72 object-cover" />
        <div class="p-8 flex flex-col">
          <h3 class="text-2xl font-semibold mb-3 text-white">10x Explorers</h3>
          <p class="text-sm leading-relaxed mb-6 text-gray-100">
            Wciel się w rolę developera i odkrywaj tajniki programowania w interaktywnej przygodzie.
          </p>
          <a
            href="/explorers"
            class="w-full text-center py-3 px-6 rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white hover:text-gray-900">
            Zagraj teraz
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Dev server starts without errors: `npm run dev`

#### Manual Verification

- [x] **Free user**: all 5 course tiles visible with dark overlay + lock icon + "Kup kurs" button
- [x] **Free user**: clicking "Kup kurs" opens the marketing URL in a new tab
- [x] **Free user**: "Gry" section visible with Space Explorers tile and "Zagraj teraz" button
- [x] **Free user**: clicking "Zagraj teraz" navigates to `/explorers`
- [x] **Paying customer**: their purchased courses show "Otwórz kurs" (unlocked), others show "Kup kurs" (locked)
- [x] **Login page**: "Adres email na danej platformie musi być taki sam..." text is gone
- [x] No layout regression on mobile (single column) or desktop (two-column grid)

---

## Testing Strategy

### Manual Testing Steps

1. **Magic link — free user**: Submit a brand-new email on `/login`. Verify magic link received.
   Click link → lands on `/courses`. Verify locked tiles + Games section visible.
2. **OAuth — free user**: Use GitHub/Google with an account not in Airtable.
   Verify same `/courses` landing with locked tiles.
3. **Course access protection**: As a free user, navigate directly to
   `/courses/opanuj-frontend`. Verify redirect to `/login`.
4. **Paying customer — unchanged**: Log in as a paying customer. Verify their courses are
   unlocked and others are locked. Verify course content accessible.
5. **External routes**: Verify `/external/10xdevs-2/...` login and lesson access are unaffected
   (use Circle-auth test account).
6. **Games tile**: Click "Zagraj teraz" as a free user → `/explorers` loads and game plays.
7. **Locked CTA**: Click "Kup kurs" on a locked tile → correct marketing URL opens in new tab.

---

## Performance Considerations

- No new Airtable calls are added; fewer calls are made (removed redundant double-checks in
  GitHub/Google callbacks).
- `verifyAuth` on `/courses` still calls Airtable once (for purchase data). This is unchanged.

---

## References

- Research: `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md`
- Related plan (game state persistence — already complete): `thoughts/shared/plans/2026-03-02-game-state-user-integration.md`
- Auth gate — magic link: `src/pages/api/auth.ts:26-34`
- Auth gate — verify: `src/pages/verify.astro:21-25`
- Auth gate — GitHub: `src/pages/api/auth/github/callback.ts:127-131`
- Auth gate — Google: `src/pages/api/auth/google/callback.ts:92-95`
- Auth gate — socialAuth: `src/server/socialAuth.ts:46-53`
- Airtable null return: `src/server/airtable/airtable-api.ts:42-44`
- verifyAuth null check: `src/server/verifyAuth.ts:43-45`
- Course permission check (safe — no change): `src/server/verifyAuth.ts:47-53`
- External auth (independent — no change): `src/server/externalAuth.ts`
- CourseList filter: `src/components/CourseList.astro:69`
- Login hint text: `src/components/Login.svelte:134-136`
