# locals.runtime.env → astro:env/server Migration Plan

## Overview

Migrate 5 files that only need simple string/number env vars from `locals.runtime.env` to `astro:env/server` imports, and fix 4 schema gaps where env variables are used at runtime but missing from `astro-env.ts` and/or the `Env` interface.

## Current State Analysis

The codebase has two patterns for accessing env vars:
1. **`astro:env/server`** — type-safe, validated at build time. Used by ~6 files already.
2. **`locals.runtime.env`** — Cloudflare Workers runtime binding. Required for KV namespaces; still used by ~25 files.

### Key Discoveries:

- `astro-env.ts:1-86` — 18 variables declared in the schema
- `src/env.d.ts:29-57` — `Env` interface has 2 vars (`CIRCLE_*_TOKEN`) not in `astro-env.ts`
- `src/pages/api/auth.ts:28-29` — 2 MailerLite vars accessed at runtime but missing from both schemas
- `src/server/verifyAuth.ts:5` — established pattern: `import { JWT_SECRET, ... } from 'astro:env/server'`
- `src/pages/explorers.astro:6` — already partially migrated (imports `ENV` but still uses `locals.runtime.env.JWT_SECRET`)

## Desired End State

1. **5 files** use `astro:env/server` imports instead of `locals.runtime.env` for simple vars
2. **2 Circle API tokens** added to `astro-env.ts` (optional, secret)
3. **2 MailerLite vars** renamed from `10XDEVS_MAILERLITE_*` to `TEN_X_DEVS_MAILERLITE_*` and added to both `astro-env.ts` and `Env` interface
4. All code references updated to use the new names
5. `Env` interface otherwise unchanged (no removal of migrated vars)
6. `npm run build` passes with no import errors

### Verification:

- `npm run build` succeeds
- `npm run dev` starts and affected pages load without errors
- No TypeScript errors in affected files

## What We're NOT Doing

- Not migrating partially-migrated files (auth.ts, verify.astro, OAuth callbacks)
- Not migrating game/external routes that need KV bindings
- Not removing migrated vars from the `Env` interface
- Not refactoring function signatures that accept `env: Env`
- Not migrating the MailerLite vars' *usage* in auth.ts/callbacks to `astro:env/server` imports (those files are partially migrated and out of scope)

## Implementation Approach

Two sequential phases: (1) migrate 5 quick-win files, (2) fix schema gaps. Each change is a simple import addition and variable reference swap.

## Critical Implementation Details

### MailerLite Variable Rename

`10XDEVS_MAILERLITE_API_KEY` and `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` start with a digit, making them invalid JavaScript identifiers. They are renamed to `TEN_X_DEVS_MAILERLITE_API_KEY` and `TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID` so they can be added to `astro-env.ts` and imported from `astro:env/server`.

This requires:
1. Adding new names to `astro-env.ts` and `Env` interface
2. Updating all code references (3 files: `auth.ts`, `github/callback.ts`, `google/callback.ts`)
3. Renaming the env vars in Cloudflare dashboard and `.env.local`

### Migration Pattern

Established by existing migrated files (e.g., `src/server/verifyAuth.ts:5`):

```typescript
// Before:
const env = Astro.locals.runtime.env;
const secret = env.JWT_SECRET;

// After:
import { JWT_SECRET } from 'astro:env/server';
// Use JWT_SECRET directly
```

### Debug & Observability Plan

- **Verification Method**: `npm run build` + `npm run dev` confirm imports resolve
- **Logging Strategy**: No logging changes needed — these are simple variable reference swaps
- **Failure Mode**: If a variable is not set in `.env.local` or Cloudflare, `astro:env/server` throws at build/startup time (fail-fast behavior, better than silent `undefined` from `locals.runtime.env`)

---

## Phase 1: Quick Wins — Migrate 5 Files

### Overview

Replace `locals.runtime.env.X` with `import { X } from 'astro:env/server'` in 5 files that only access simple string vars.

### Changes Required:

#### 1. `src/pages/index.astro`

**Current** (line 10): `Astro.locals.runtime.env.JWT_SECRET`
**Change**: Add import, use directly.

```astro
---
import { JWT_SECRET } from 'astro:env/server';
// ... existing imports ...

const token = Astro.cookies.get('token')?.value;
const isAuthenticated = token ? await verifyToken(token, JWT_SECRET) : false;
---
```

Remove: any `locals.runtime.env` reference.

#### 2. `src/pages/login.astro`

**Current** (line 7): `Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY`
**Change**: Add import, use directly.

```astro
---
import { CF_CAPTCHA_SITE_KEY } from 'astro:env/server';
// ... existing imports ...

const captchaSiteKey = CF_CAPTCHA_SITE_KEY ?? '';
---
```

Remove: any `locals.runtime.env` reference.

#### 3. `src/pages/signup.astro`

**Current** (line 7): `Astro.locals.runtime.env.CF_CAPTCHA_SITE_KEY`
**Change**: Identical pattern to login.astro.

```astro
---
import { CF_CAPTCHA_SITE_KEY } from 'astro:env/server';
// ... existing imports ...

const captchaSiteKey = CF_CAPTCHA_SITE_KEY ?? '';
---
```

Remove: any `locals.runtime.env` reference.

#### 4. `src/pages/explorers.astro`

**Current** (line 6): Already imports `ENV` from `astro:env/server`
**Current** (line 12): Still uses `Astro.locals.runtime.env.JWT_SECRET`
**Change**: Add `JWT_SECRET` to existing import.

```astro
---
import { ENV, JWT_SECRET } from 'astro:env/server';
// ... existing imports ...

const token = Astro.cookies.get('token')?.value;
const isAuthenticated = token ? await verifyToken(token, JWT_SECRET) : false;
---
```

Remove: `Astro.locals.runtime.env` reference for JWT_SECRET.

#### 5. `src/pages/api/customer-purchases.ts`

**Current** (line 17): `locals.runtime.env.AIRTABLE_API_KEY`
**Change**: Add import, use directly.

```typescript
import { AIRTABLE_API_KEY } from 'astro:env/server';

// In handler:
const purchases = await getCustomerPurchases(email, AIRTABLE_API_KEY);
```

Remove: `locals.runtime.env.AIRTABLE_API_KEY` usage.

### Success Criteria:

#### Automated Verification:

- [x] Build passes: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [x] No TypeScript errors: `npx tsc --noEmit` (or build implies this)

#### Manual Verification:

- [ ] `/` (index) redirects correctly for authenticated/unauthenticated users
- [ ] `/login` shows captcha widget
- [ ] `/signup` shows captcha widget
- [ ] `/explorers` loads for authenticated users
- [ ] `/api/customer-purchases` returns data for valid requests

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Schema Gaps — Add Missing Variables

### Overview

Add 4 missing environment variables to the appropriate schemas so they are typed and discoverable.

### Changes Required:

#### 1. Add Circle API tokens to `astro-env.ts`

**File**: `astro-env.ts`
**Why**: `CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN` and `CIRCLE_BRAVE_V1_TOKEN` are in the `Env` interface but not in `astro-env.ts`. Adding them enables future migration of Circle-related code to `astro:env/server`.

```typescript
// Add after EXTERNAL_MEMBERSHIP_REFRESH_SECRET block (line 85):
CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
CIRCLE_BRAVE_V1_TOKEN: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
```

#### 2. Rename and add MailerLite variables

**Rename**: `10XDEVS_MAILERLITE_*` → `TEN_X_DEVS_MAILERLITE_*` (numeric prefix → valid JS identifier).

**File**: `astro-env.ts`

```typescript
// Add after CIRCLE_BRAVE_V1_TOKEN block:
TEN_X_DEVS_MAILERLITE_API_KEY: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
```

**File**: `src/env.d.ts`

```typescript
// Add after GAME_API_TOKENS line (line 56) in the Env interface:
// MailerLite newsletter integration
TEN_X_DEVS_MAILERLITE_API_KEY?: string;
TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID?: string;
```

#### 3. Update code references to use new names

**File**: `src/pages/api/auth.ts` (lines 28-29)

```typescript
// Before:
const mlApiKey = locals.runtime.env['10XDEVS_MAILERLITE_API_KEY'];
const mlGroupId = locals.runtime.env['10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID'];

// After:
const mlApiKey = locals.runtime.env.TEN_X_DEVS_MAILERLITE_API_KEY;
const mlGroupId = locals.runtime.env.TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID;
```

**File**: `src/pages/api/auth/github/callback.ts` (lines 167-168)

```typescript
// Before:
const mlApiKey = syncEnv['10XDEVS_MAILERLITE_API_KEY'];
const mlGroupId = syncEnv['10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID'];

// After:
const mlApiKey = syncEnv.TEN_X_DEVS_MAILERLITE_API_KEY;
const mlGroupId = syncEnv.TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID;
```

**File**: `src/pages/api/auth/google/callback.ts` (lines 132-133)

```typescript
// Before:
const mlApiKey = syncEnv['10XDEVS_MAILERLITE_API_KEY'];
const mlGroupId = syncEnv['10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID'];

// After:
const mlApiKey = syncEnv.TEN_X_DEVS_MAILERLITE_API_KEY;
const mlGroupId = syncEnv.TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID;
```

#### 4. Cloudflare & local env rename (manual)

- Rename `10XDEVS_MAILERLITE_API_KEY` → `TEN_X_DEVS_MAILERLITE_API_KEY` in Cloudflare Pages dashboard
- Rename `10XDEVS_MAILERLITE_NEWSLETTER_GROUP_ID` → `TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID` in Cloudflare Pages dashboard
- Update `.env.local` if present

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`
- [x] No TypeScript errors in files that access these variables
- [x] `astro-env.ts` schema is valid (build would fail otherwise)
- [x] Grep for `10XDEVS_MAILERLITE` returns zero hits in `src/` (all renamed)

#### Manual Verification:

- [ ] Env vars renamed in Cloudflare Pages dashboard
- [ ] Newsletter subscription still works after deployment with new var names

---

## Testing Strategy

### Automated:

- `npm run build` — validates all `astro:env/server` imports resolve against the schema
- `npm run dev` — confirms dev server starts with the new import pattern
- Existing tests should continue passing (no behavioral changes)

### Manual:

- Visit each affected page in dev mode to confirm no runtime errors
- Verify captcha widget loads on login/signup (proves `CF_CAPTCHA_SITE_KEY` resolves)

## Performance Considerations

None. `astro:env/server` imports are resolved at build time, which is equivalent to or faster than runtime `locals.runtime.env` access.

## References

- Research document: `thoughts/shared/research/2026-03-30-locals-runtime-env-vs-astro-env.md`
- Signup plan (overlapping MailerLite vars): `thoughts/shared/plans/2026-03-30-signup-page-newsletter-checkbox.md`
- Established migration pattern: `src/server/verifyAuth.ts:5`
- Astro env schema: `astro-env.ts:1-86`
- Env interface: `src/env.d.ts:29-57`
