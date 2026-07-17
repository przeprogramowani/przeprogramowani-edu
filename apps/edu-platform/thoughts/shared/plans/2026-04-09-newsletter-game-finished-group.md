# Newsletter "Game Finished" Group Assignment Implementation Plan

## Overview

When a Navigator solves the final server-side quest (`q-earth-signal` in M0 Core AI) via `POST /api/game/submit`, attempt to assign their email to the MailerLite "game finished" group. This is a group-membership update for existing MailerLite subscribers only, not a new subscription flow. Use a new isolated helper that calls MailerLite's dedicated **assign-subscriber-to-group** endpoint, so only the group membership is touched — `status`, `opted_in_at`, `optin_ip`, and the previously assigned "account created" group all stay untouched.

## Current State Analysis

- `src/server/newsletter.ts:9-25` exposes only `subscribeToNewsletter()`, which calls `mailerlite.subscribers.createOrUpdate()` and writes `status`, `groups`, `opted_in_at`, and `optin_ip` in one shot.
- `subscribeToNewsletter()` is currently used by:
  - `src/pages/api/auth.ts:39-42` (magic-link request)
  - `src/pages/api/auth/github/callback.ts:175-178` (GitHub OAuth)
  - `src/pages/api/auth/google/callback.ts:140-143` (Google OAuth)
  All three pass `TEN_X_DEVS_MAILERLITE_API_KEY` + `TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID`, status `'active'`, and the CF-Connecting-IP. They run fire-and-forget via `locals.runtime.ctx.waitUntil()`.
- `astro-env.ts:107-116` already declares both env fields:
  - `TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID` — used today
  - `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` — declared, currently unused
- `src/pages/api/game/submit.ts:1-148` is the only consumer of `ApiAnswerQuest`. Today the **only** quest with `completionType: 'api-answer'` is `q-earth-signal` in `src/explorers/levels/m0-core-ai/quests.ts:5-19` (the "Sygnał z Ziemi" final-arc quest). Submit flow today: auth → rate limit → parse → idempotency check (completed + pending) → quest lookup → answer hash compare → `appendPendingGrant()` → return JSON. No MailerLite hook.
- The MailerLite SDK exposes `mailerlite.groups.assignSubscriber(subscriber_id, group_id)` (`node_modules/@mailerlite/mailerlite-nodejs/dist/index.d.ts:9`). Per the MailerLite REST API, `subscriber_id` accepts **either** the numeric ID **or** the email address — so we can call it directly with an email and skip a lookup round-trip. This endpoint only mutates group membership; it does not touch any other subscriber field.
- Established fire-and-forget pattern: `src/pages/api/auth/github/callback.ts:181`, `src/pages/api/auth/google/callback.ts:146` register sync work via `locals.runtime.ctx.waitUntil(...)` after building (but before returning) the redirect response.

### Key Discoveries

- MailerLite's `groups.assignSubscriber` is the surgical "update only group" call we want — `src/server/newsletter.ts` doesn't expose it yet.
- The submit endpoint already has access to `context.locals.runtime.ctx`, so the same `ctx.waitUntil` pattern used in OAuth callbacks works here.
- The submit endpoint's existing idempotency check (already-completed + already-pending) means a retry of the same quest will return early **before** the MailerLite assignment fires — so we naturally avoid re-spamming MailerLite on client retries.
- `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` is declared as `optional: true` in `astro-env.ts:112-116`, so it can be `undefined` at runtime — code must guard for that (matches the pattern in `auth.ts:35-37`).
- Existing MailerLite subscriber creation today only happens when the user opted into newsletter during auth. Therefore this plan adds the "game finished" group only for users who already exist in MailerLite; it does **not** subscribe previously non-opted-in users.

## Desired End State

1. `src/server/newsletter.ts` exports a new `assignSubscriberToGroup(email, apiKey, groupId)` helper that calls **only** `mailerlite.groups.assignSubscriber(email, groupId)` and logs the outcome. No other subscriber fields are written.
2. `src/pages/api/game/submit.ts`, after a successful `appendPendingGrant()` for the "game finished" quest, registers a fire-and-forget MailerLite group assignment via `context.locals.runtime.ctx.waitUntil(...)`.
3. Behavior:
   - When `quest_id === 'q-earth-signal'` AND both env vars are set → MailerLite is called once per first successful submission.
   - When that email already exists as a MailerLite subscriber → they are added to the game-finished group, without changing any other subscriber fields.
   - When that email does **not** exist in MailerLite → the assignment fails, is logged, and is otherwise ignored. We do not auto-create subscribers here.
   - When env vars are missing → call is skipped silently (no log spam in dev / local).
   - When MailerLite returns an error → it is logged via `console.error`, never thrown.
   - The user's HTTP response and the pending-grant flow are unaffected by MailerLite latency or failure.
4. The user's existing "account created" group membership in MailerLite is preserved (the new call only **adds** a group, it does not replace). `status`, `opted_in_at`, and `optin_ip` are untouched.

### How to verify

- `npm run build` and `npm run lint` pass.
- Hitting `POST /api/game/submit` with `quest_id=q-earth-signal` and the correct answer (`"hello world"`, hashed to `b94d27b9...`) when both env vars are set for an email that already exists in MailerLite → user appears in the game-finished group, with their other groups (account-created) intact and their `opted_in_at`/`status` unchanged.
- Replaying the same call → response includes `already_completed: true` and **no** new MailerLite request is made.
- Submitting with a wrong answer → no MailerLite call.
- Running in dev with envs unset → endpoint still works, no errors.

## What We're NOT Doing

- Not modifying `subscribeToNewsletter()` or any of its existing callers.
- Not changing the magic-link or OAuth flows in `auth.ts`, `github/callback.ts`, or `google/callback.ts`.
- Not adding a generic "any quest fires a newsletter event" framework — the trigger is hardcoded to `q-earth-signal` (the single existing api-answer quest, which represents "game finished").
- Not extending `ApiAnswerQuest` with newsletter-related fields.
- Not auto-creating subscribers in MailerLite if they don't exist there yet (a 404 from `assignSubscriber` will be logged and ignored).
- Not changing newsletter consent semantics. Completing the game does not subscribe a user to MailerLite; it only adds a group for users who are already subscribers there.
- Not persisting "did we already assign the group" state — we rely on the existing pending-grant idempotency to avoid re-firing on retries, and on MailerLite's natural idempotency for the assignment itself.
- Not adding new tests — `src/server/newsletter.ts` has no existing test file, and the new helper is a thin wrapper around the SDK.
- Not changing `astro-env.ts` (the env field is already declared).

## Implementation Approach

Two small, surgical changes:

1. **Helper** — Add a single new exported function `assignSubscriberToGroup` to `src/server/newsletter.ts`. It instantiates the MailerLite client, calls `groups.assignSubscriber(email, groupId)`, and logs success. Errors propagate so callers can decide how to handle them (the submit endpoint will catch and log).

2. **Wire** — In `src/pages/api/game/submit.ts`, import the helper and the two env vars. Define a `GAME_FINISHED_QUEST_ID = 'q-earth-signal'` constant near the top of the file (explicit, greppable). After the existing `appendPendingGrant()` call, conditionally register a `ctx.waitUntil(nlPromise)` if the quest matches and both env vars are set. Errors are caught and logged — never thrown.

Order of operations matters: we must register on `ctx.waitUntil` **before** returning the `Response`, otherwise CF Workers may tear down the execution context and drop the in-flight MailerLite request. This mirrors the OAuth callback pattern.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- The MailerLite call must be kicked off **after** `appendPendingGrant()` resolves, so a failed grant never produces a "game finished" notification. (If `appendPendingGrant` throws, the `try`/catch-style flow returns early — there's no try block today, it just throws and the framework returns 500. That's fine: no MailerLite call happens.)
- The `ctx.waitUntil(nlPromise)` registration must happen **before** the `return new Response(...)` line. CF Workers will then keep the execution context alive until the promise settles.
- The MailerLite call happens **after** the idempotency early-return check, so client retries that hit `already_completed: true` do not re-fire the MailerLite request.

**Derived from**: Established `ctx.waitUntil` usage in `src/pages/api/auth/github/callback.ts:165-181` and `src/pages/api/auth/google/callback.ts:130-146`.

### User Experience Specification

**N/A**: This is a backend side-effect with no user-visible UI. The Navigator sees the same "Misja zaliczona!" response regardless of whether the MailerLite call succeeds, fails, or is skipped due to missing envs.

### Performance & Optimization Strategy

- One additional outbound HTTP POST per first successful submission of `q-earth-signal`. Fired async via `ctx.waitUntil` — zero impact on the user-visible response latency.
- No batching, caching, or memoization needed: this is a low-frequency event (once per Navigator who finishes the game).
- The MailerLite SDK reuses axios internally; no connection-pool concerns at this volume.

### State Management Sequencing

- **Sequence**: Auth → rate-limit → parse body → state load → completed-idempotency → pending-idempotency → quest lookup → answer hash compare → `appendPendingGrant` → **(new)** register MailerLite assignment via `ctx.waitUntil` → `console.info('quest_grant_queued', ...)` → return Response.
- **Idempotency layering**:
  - Layer 1: pending-grant idempotency in submit.ts means a second submission for the same quest never reaches the MailerLite trigger.
  - Layer 2: MailerLite's `assignSubscriber` is itself idempotent — re-assigning a subscriber to a group they already belong to is a no-op.
- **Failure mode**: If `appendPendingGrant` succeeds and the MailerLite call fails (logged), a future retry will hit the pending-grant early-return and **not** retry MailerLite. This is an accepted trade-off documented here: simplicity over guaranteed delivery. Logged errors give us visibility to fix manually.

**Derived from**: Idempotency checks in `src/pages/api/game/submit.ts:88-103` and the `groups.assignSubscriber` semantics in the MailerLite SDK.

### Debug & Observability Plan

- **Verification**: `console.info('[newsletter] Group assigned', { email: masked, groupId, status })` in the helper, plus a `console.info('[api/game/submit] game_finished_group_queued', { quest_id, email: masked })` in submit.ts when the trigger is registered (mirrors the existing `quest_grant_queued` log style with masked email).
- **Failure logging**: `console.error('[api/game/submit] Newsletter group assign failed:', err)` in the `.catch()` of the `nlPromise`. Matches the existing `[github/callback] Supabase sync failed:` style.
- **Skip-due-to-missing-env**: silent. We do **not** log when env vars are missing — this is the steady-state in local dev and would be log noise. If a developer needs to debug locally, they can set the envs in `.env.local`.
- **Log sampling**: MailerLite responses include `status` (HTTP status from axios) — useful for distinguishing 200/204 success from any error path.

**Derived from**: Existing log patterns in `src/server/newsletter.ts:24` and `src/pages/api/game/submit.ts:134-137`.

---

## Phase 1: Add isolated helper to the newsletter module

### Overview

Add a single new exported function to `src/server/newsletter.ts` that wraps `mailerlite.groups.assignSubscriber`. No other changes in this phase.

### Changes Required

#### 1. New helper function

**File**: `src/server/newsletter.ts`
**Changes**: Append a new function after `subscribeToNewsletter`. Reuses the existing `MailerLite` import. Does **not** touch the existing function.

```ts
/**
 * Assigns an existing MailerLite subscriber to a group.
 *
 * Only mutates group membership — does NOT modify status, opted_in_at, optin_ip,
 * or any other subscriber field. Idempotent on the MailerLite side: re-assigning
 * a subscriber to a group they already belong to is a no-op.
 *
 * The MailerLite REST endpoint is POST /api/subscribers/{subscriber_id}/groups/{group_id};
 * subscriber_id accepts either the numeric ID or the subscriber's email address.
 *
 * Throws on API errors. Callers should catch and log (this is typically called
 * fire-and-forget via ctx.waitUntil).
 */
export async function assignSubscriberToGroup(
  email: string,
  apiKey: string,
  groupId: string
): Promise<void> {
  const mailerlite = new MailerLite({ api_key: apiKey });
  const res = await mailerlite.groups.assignSubscriber(email, groupId);
  console.info('[newsletter] Group assigned', {
    email: email.slice(0, 3) + '...',
    groupId,
    status: res.status,
  });
}
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles: `npm run build` (from `projects/edu-platform`)
- [ ] Linting passes: `npm run lint` (from monorepo root)
- [ ] Existing tests still pass: `npm run test`

#### Manual Verification

- [ ] `assignSubscriberToGroup` is importable from `@/server/newsletter` in IDE autocomplete.
- [ ] `subscribeToNewsletter` signature is unchanged (no caller breakage).

**Implementation Note**: After Phase 1's automated checks pass, pause for confirmation before wiring it into submit.ts.

---

## Phase 2: Wire trigger into `/api/game/submit`

### Overview

Import the helper and env vars in `submit.ts`, define the quest-id constant, and register the fire-and-forget MailerLite call right after the existing `appendPendingGrant()` succeeds.

### Changes Required

#### 1. Imports and constant

**File**: `src/pages/api/game/submit.ts`
**Changes**: Add new imports alongside the existing ones, and a quest-id constant near the top of the file (after imports, before the `sha256hex` helper).

```ts
import { assignSubscriberToGroup } from '@/server/newsletter';
import {
  TEN_X_DEVS_MAILERLITE_API_KEY,
  TEN_X_DEVS_GAME_FINISHED_GROUP_ID,
} from 'astro:env/server';

// Server-side trigger: completing this quest marks the Navigator as "game finished"
// in MailerLite. Currently the only api-answer quest in the game; kept explicit
// (rather than firing on every api-answer quest) so future server-side puzzles
// don't accidentally retag users as game-finished.
const GAME_FINISHED_QUEST_ID = 'q-earth-signal';
```

#### 2. Fire-and-forget MailerLite assignment after `appendPendingGrant`

**File**: `src/pages/api/game/submit.ts`
**Changes**: After the existing `await appendPendingGrant(...)` call (around line 132) and before the `console.info('[api/game/submit] quest_grant_queued', ...)` log, insert the trigger block. Must be **before** the final `return new Response(...)` so `ctx.waitUntil` registers in time.

```ts
// Newsletter group sync — fire-and-forget. Registered with ctx.waitUntil so
// CF Workers keeps the execution context alive after the response is sent.
// Only fires for the "game finished" quest, only when env vars are present.
// MailerLite's assignSubscriber endpoint only mutates group membership — it
// does NOT modify status, opted_in_at, optin_ip, or any other subscriber field.
if (
  quest_id === GAME_FINISHED_QUEST_ID &&
  TEN_X_DEVS_MAILERLITE_API_KEY &&
  TEN_X_DEVS_GAME_FINISHED_GROUP_ID
) {
  const nlPromise = assignSubscriberToGroup(
    email,
    TEN_X_DEVS_MAILERLITE_API_KEY,
    TEN_X_DEVS_GAME_FINISHED_GROUP_ID
  ).catch((err) =>
    console.error('[api/game/submit] Newsletter group assign failed:', err)
  );
  context.locals.runtime.ctx.waitUntil(nlPromise);
  console.info('[api/game/submit] game_finished_group_queued', {
    quest_id,
    email: email.slice(0, 3) + '...',
  });
}
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Existing submit endpoint logic untouched (auth, rate limit, idempotency, hash compare): verified by reading diff.

#### Manual Verification

- [ ] In dev with `TEN_X_DEVS_MAILERLITE_API_KEY` and `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` set in `.env.local`, submit `q-earth-signal` with the correct answer (`hello world`) for an email that already exists in MailerLite:
  - Response is `{ accepted: true, xp: 100, ... }`.
  - Server logs include `[api/game/submit] game_finished_group_queued` and `[newsletter] Group assigned`.
  - In MailerLite dashboard: subscriber appears in the game-finished group **and** still in the account-created group. Their `status`, `opted_in_at`, `optin_ip` are unchanged compared to before the call.
- [ ] Submit the same payload for an email that does **not** exist in MailerLite → quest is still granted normally, MailerLite error is logged, no subscriber is created.
- [ ] Submit the same payload again → response is `{ accepted: true, already_completed: true, ... }`, **no** `game_finished_group_queued` log, no new MailerLite request.
- [ ] Submit with a wrong answer → response is `{ accepted: false, hint: ... }`, no MailerLite call.
- [ ] In dev with envs **unset**, submit the correct answer → quest is granted normally, no MailerLite-related logs, no errors.
- [ ] Hitting submit for a non-existent quest id → 404 error path unchanged, no MailerLite call.
- [ ] Spot-check that other api-answer quests (if added later) would not accidentally fire MailerLite — only `quest_id === 'q-earth-signal'` triggers it.

**Implementation Note**: Manual verification of the MailerLite dashboard is the load-bearing check for the "untouched fields" requirement. Confirm subscriber state in MailerLite **before** and **after** the call.

---

## Testing Strategy

### Unit Tests

None added. `src/server/newsletter.ts` has no existing test file, and the new helper is a 3-line wrapper around the SDK. Adding a unit test would require mocking the MailerLite SDK with no real coverage benefit.

### Integration Tests

None added. The end-to-end path is verified manually via the steps above.

### Manual Testing Steps

1. Set `TEN_X_DEVS_MAILERLITE_API_KEY` and `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` in `.env.local`.
2. Sign up a fresh test user via the magic-link flow with `newsletterOptIn=true` so they land in MailerLite's account-created group. Note their MailerLite subscriber state (status, opted_in_at, groups).
3. Generate an API token for that user (`/api/game/token` or whatever the established flow is — see `src/server/game/apiTokenManager.ts`).
4. `POST /api/game/submit` with `Authorization: Bearer <token>`, body `{ "quest_id": "q-earth-signal", "answer": "hello world" }`.
5. Verify response, server logs, and MailerLite subscriber state per the Phase 2 manual verification list.
6. Repeat the call → verify idempotency.
7. Repeat with a user who never opted into newsletter and therefore does not exist in MailerLite → verify quest success, logged MailerLite failure, and no subscriber auto-created.
8. Try with envs unset → verify silent skip.

## Performance Considerations

- One extra HTTP POST per first successful `q-earth-signal` submission. Async via `ctx.waitUntil`, zero impact on the user-visible response.
- No KV reads/writes added.
- No new dependencies — `@mailerlite/mailerlite-nodejs` is already in the workspace.

## Migration Notes

- **Production deployment**: `TEN_X_DEVS_GAME_FINISHED_GROUP_ID` must be set in the Cloudflare Pages dashboard (Settings → Environment Variables) for production. Until then, the code path is silently skipped — no broken behavior, just no group assignments.
- **No data migration**: No DB or KV schema changes. Existing subscribers are unaffected until they trigger the quest.

## References

- New helper home: `src/server/newsletter.ts:9-25` (existing `subscribeToNewsletter`)
- MailerLite SDK type for `assignSubscriber`: `node_modules/@mailerlite/mailerlite-nodejs/dist/index.d.ts:9`
- Trigger site: `src/pages/api/game/submit.ts:124-148` (after `appendPendingGrant`)
- Quest definition: `src/explorers/levels/m0-core-ai/quests.ts:5-19`
- Env field declaration: `astro-env.ts:107-116`
- Existing fire-and-forget pattern: `src/pages/api/auth/github/callback.ts:161-181`, `src/pages/api/auth/google/callback.ts:126-146`
- Existing `subscribeToNewsletter` callers (unchanged by this plan): `src/pages/api/auth.ts:34-43`, `src/pages/api/auth/github/callback.ts:172-178`, `src/pages/api/auth/google/callback.ts:137-143`
