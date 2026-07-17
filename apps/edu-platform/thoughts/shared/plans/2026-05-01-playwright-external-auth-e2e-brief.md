# Playwright External Auth E2E — Plan Brief

> Full plan: `thoughts/shared/plans/2026-05-01-playwright-external-auth-e2e.md`

## What & Why

Add Playwright to edu-platform and establish reusable E2E tests based on page object models. The immediate value is a real browser-level regression test for external course magic-link login, including Resend email retrieval and authenticated page verification.

## Starting Point

Edu-platform currently uses Vitest for unit/component/API coverage and has no Playwright setup. The external auth flow already supports the chosen local happy path: in `DEV + TEST_MODE`, `10xdevs-3-prework` allows `przemek.smyrdek@gmail.com`, sends the magic link through Resend, and verifies into the unified `token` cookie.

## Desired End State

A developer can start the local dev server, run `npm run test:e2e`, and have Playwright submit the external login form, fetch the latest matching Resend email, open the magic link, and confirm successful login on `/external/10xdevs-3-prework/pl`. The test code is structured so future E2E specs reuse fixtures, page objects, and support helpers instead of duplicating browser flow details.

## Key Decisions Made

| Decision | Choice | Why |
| --- | --- | --- |
| Execution target | Local dev server | The first test relies on `ENV=DEV`, `TEST_MODE=true`, local secrets, and controlled developer execution. |
| First course | `10xdevs-3-prework` | This course has an existing local bypass for `przemek.smyrdek@gmail.com`, avoiding Circle/KV dependency in the first E2E. |
| DEV email recipient | Current behavior: `przeprogramowani@gmail.com` | The app already redirects DEV emails there, while the token remains bound to the submitted login email. |
| Magic-link retrieval | Resend `emails.list()` + `emails.get(id)` | This tests the real provider path without adding test-only server endpoints. |
| Captcha handling | Use current UI/test key behavior | Start with the app's existing browser flow and only add a hook if the real component proves unreliable. |
| Test structure | `tests/e2e/pages`, `tests/e2e/fixtures`, `tests/e2e/support` | Keeps specs readable and gives future browser tests clear reuse points. |
| Success assertion | Redirect path plus visible user email | Confirms both navigation and actual authenticated identity, not just cookie presence. |
| CI posture | CI-ready structure, no workflow yet | Real email and secrets should not start running on every PR until inbox isolation and secret handling are decided. |

## Scope

**In scope:**

- Add Playwright dependency, scripts, and config.
- Add E2E-specific directory structure.
- Add typed env helper and Resend magic-link polling helper.
- Add page objects for external login and external course assertions.
- Add first Resend-backed external auth E2E spec for `10xdevs-3-prework`.
- Document local env setup and future CI prerequisites.

**Out of scope:**

- GitHub Actions workflow for edu-platform E2E.
- Full external-course matrix.
- Test-only token endpoint.
- Production auth behavior changes.
- Visual regression suite.

## Architecture / Approach

Playwright lives beside the app as a separate browser test layer: `playwright.config.ts` points to `tests/e2e`, specs import a shared fixture, page objects encapsulate browser interactions, and support helpers own env validation plus Resend polling. The first flow is local-first: UI submit -> `/api/external/auth` -> Resend sent email lookup -> `/external/10xdevs-3-prework/verify` -> authenticated prework route.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Playwright setup | Dependency, scripts, config, ignored env/report files | Browser install or env file conventions can drift from monorepo expectations. |
| 2. E2E harness | Fixtures, env helper, Resend helper, page objects | Resend polling needs clear filtering to avoid stale magic links. |
| 3. First auth spec | Real browser magic-link login test | Turnstile readiness, email delivery delay, or rate limiting can cause flake. |
| 4. CI readiness | Documentation and stable command for later CI | Premature CI would send real emails without isolation. |

**Prerequisites:** working local app env, `RESEND_API_KEY`, access to list/retrieve sent Resend emails, local Supabase secrets, `ENV=DEV`, `TEST_MODE=true`, and `E2E_RESEND_INBOX_EMAIL=przeprogramowani@gmail.com`.

**Estimated effort:** ~2 implementation sessions across 4 phases.

## Open Risks & Assumptions

- Resend API key can list and retrieve sent emails.
- Resend email indexing is fast enough for a 60-second polling window.
- Turnstile's test key reliably enables the submit button in Playwright.
- Repeated local runs may hit the auth rate limit if executed too quickly.

## Success Criteria (Summary)

- `npm run test:e2e` runs a browser flow against local `localhost:3000`.
- The first spec logs in as `przemek.smyrdek@gmail.com` through the external login form and Resend magic link.
- The authenticated destination is `/external/10xdevs-3-prework/pl` and the page shows the submitted email.
