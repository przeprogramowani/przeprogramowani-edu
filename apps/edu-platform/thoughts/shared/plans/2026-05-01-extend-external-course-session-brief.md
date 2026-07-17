# Extend External Course Session Lifetime — Plan Brief

> Full plan: `thoughts/shared/plans/2026-05-01-extend-external-course-session.md`

## What & Why

Users reported that external courses require authentication every day. The root cause was a 24-hour unified session lifetime: both the JWT `exp` claim and the `token` cookie `maxAge` were hard-coded to one day.

## Starting Point

External courses already use the unified platform `token` cookie. That means fixing only the external route cookie would not be enough: the JWT itself also had to live longer.

## Desired End State

After a successful login, external-course users stay authenticated for 7 days, assuming their browser keeps the cookie and course access remains valid. JWT expiry and browser cookie expiry are driven by the same shared constant.

## Key Decisions Made

| Decision | Choice | Why |
| --- | --- | --- |
| Session duration | 7 days | Directly addresses daily re-authentication while staying within a bounded session window. |
| Source of truth | `SESSION_MAX_AGE_SECONDS` in `src/server/auth.ts` | Prevents JWT and cookie lifetimes from drifting. |
| Scope | Update all unified `token` cookie writers | External courses share the main platform token, so all login paths must stay consistent. |
| Magic-link expiry | Keep 15 minutes | Email links should not become reusable for 7 days; store-level TTL already handles this. |
| Refresh model | Keep existing near-expiry refresh behavior | No need for refresh-token architecture for this narrow issue. |

## Scope

**In scope:**

- Extend unified JWT session expiration to 7 days.
- Align `token` cookie `maxAge` across external verification, main verification, OAuth callbacks, and token refresh.
- Add a regression test for 7-day JWT expiration.
- Confirm magic links remain short-lived.

**Out of scope:**

- Refresh tokens.
- Environment-configurable session duration.
- Circle/Supabase membership rule changes.
- Legacy external cookie migration.

## Architecture / Approach

The platform signs a unified JWT with `generateToken()`, stores it in an HttpOnly `token` cookie, and verifies it on protected routes. The implementation centralizes the session lifetime in `src/server/auth.ts`, then imports that constant everywhere the unified session cookie is written.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Centralize lifetime | JWTs expire after 7 days via one shared constant. | Accidentally extending magic-link usability. |
| 2. Align cookie writers | Browser cookie max age matches JWT lifetime everywhere. | Missing one login path and keeping a hidden 24-hour limit. |
| 3. Preserve magic-link safety | Confirms email links still expire after 15 minutes. | Confusing signed-token expiry with magic-link store TTL. |

**Prerequisites:** None beyond the existing unified token auth model.
**Estimated effort:** Completed in one small implementation pass.

## Open Risks & Assumptions

- Existing users with already-issued 24-hour tokens must log in once after deployment to receive a 7-day token.
- Longer sessions increase the window for a stolen cookie; this keeps the window bounded at 7 days and preserves HttpOnly/Secure/SameSite cookie settings.

## Success Criteria (Summary)

- External-course login no longer expires after one day for newly issued sessions.
- JWT and cookie lifetimes are both 7 days.
- `npm run test` passes, including auth and external auth regression tests.
