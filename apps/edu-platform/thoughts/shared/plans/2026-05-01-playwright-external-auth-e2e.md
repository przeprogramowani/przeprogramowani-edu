# Playwright External Auth E2E Implementation Plan

## Overview

Add Playwright to edu-platform and introduce a reusable E2E test structure based on page object models. The first end-to-end scenario should run against a local dev server, request a magic link for `przemek.smyrdek@gmail.com` on `10xdevs-3-prework`, read the sent email through Resend, open the verification link, and assert that the user lands in the authenticated external course view.

## Current State Analysis

Edu-platform currently has Vitest tests only. `package.json` exposes `test`, `test:watch`, `test:coverage`, and `test:explorers`, but no Playwright dependency or E2E script. Existing tests live either next to source files as `*.test.ts` or under `tests/api`, so browser E2E tests need a separate home to avoid mixing test layers.

The external auth flow already has the right user-visible and server-side contracts for E2E coverage:

- `/external/[courseId]/login` renders `ExternalLogin` and passes `courseId`, `returnUrl`, language, and Turnstile site key into the Svelte form.
- `ExternalLogin.svelte` posts `{ email, courseId, returnUrl, lang }` to `/api/external/auth` and shows a success message after `{ success: true }`.
- `/api/external/auth` normalizes the email, verifies access, stores a 90-minute magic link, and sends email via Resend when `RESEND_API_KEY` is configured.
- In `ENV=DEV`, the email is delivered to `przeprogramowani@gmail.com`, while the token remains bound to the normalized requested email.
- `/external/[courseId]/verify` consumes the magic link, sets the unified `token` cookie, syncs Supabase grants, and redirects to the safe return URL.
- `/external/[courseId]/index` checks `verifyExternalAuth()` and renders `ExternalCourseHeader` with `courseName` and `userEmail` after successful auth.

The nearby `opanuj-frontend` project already has a simple Playwright pattern: root-level `playwright.config.ts`, `test:e2e` scripts, HTML report under `tests/playwright-report`, Chromium first, and `PLAYWRIGHT_TEST_BASE_URL` defaulting to `http://localhost:3000`. Edu-platform should mirror the useful parts while keeping tests under `tests/e2e`.

## Desired End State

Edu-platform has a Playwright E2E foundation with reusable fixtures, page objects, and support helpers. A developer can run the local server with E2E env values, execute `npm run test:e2e`, and verify the external magic-link login path without manually opening Gmail or copying tokens.

The first spec logs in to `/external/10xdevs-3-prework/login?returnUrl=/external/10xdevs-3-prework/pl`, submits `przemek.smyrdek@gmail.com`, waits for the success UI, polls Resend for the newest matching email delivered to the DEV inbox, extracts the external verify URL, visits it, and confirms the authenticated prework page shows the expected route and user email.

### Key Discoveries:

- `package.json` has no `test:e2e` script or Playwright dependency today.
- `vitest.config.ts` already keeps unit/component test concerns separate; Playwright should not be wired into Vitest.
- `src/pages/api/external/auth.ts` has a DEV/test-mode bypass for `10xdevs-3-prework` and includes `przemek.smyrdek@gmail.com` in the allowed set.
- `src/pages/api/external/auth.ts` sends to `przeprogramowani@gmail.com` whenever `ENV === 'DEV'`.
- `src/components/ExternalLogin.svelte` uses accessible form controls (`input[name=email]`, submit button text), so Playwright can use user-facing selectors.
- `src/pages/external/[courseId]/verify.astro` sets the unified `token` cookie, not the legacy `external_token_{courseId}` cookie.
- Resend supports listing sent emails and retrieving a single email body through `emails.list()` and `emails.get(id)`.
- Root `.gitignore` ignores `.env` and `.env.production`, but not `.env.e2e` or `.env.test`.

## What We're NOT Doing

- Not adding a CI workflow in the first phase. The structure should be CI-ready, but the first executable flow depends on local E2E secrets.
- Not testing every external course or every auth failure path in the initial spec.
- Not bypassing the browser UI by calling `/api/external/auth` directly.
- Not adding a test-only endpoint for reading magic links.
- Not changing production auth semantics.
- Not introducing broad visual regression testing.
- Not storing real Resend or application secrets in the repository.

## Implementation Approach

Add a small, conventional Playwright setup to edu-platform and keep all E2E-specific code under `tests/e2e`. Use page objects for route interactions, fixtures for shared browser/test setup, and support helpers for Resend polling and environment validation.

The first test should exercise the real browser form and real Resend API while using the existing local prework bypass to avoid dependency on Circle or toolkit KV for the selected email. The test remains local-first because it relies on `ENV=DEV`, `TEST_MODE=true`, Resend credentials, Supabase credentials, and the configured DEV inbox behavior.

## Critical Implementation Details

The first test must account for the DEV destination behavior in `POST /api/external/auth`: the submitted login email is `przemek.smyrdek@gmail.com`, but the sent email is addressed to `przeprogramowani@gmail.com` when `ENV=DEV`. The Resend helper should therefore filter by configured inbox plus recent send time and then assert that the verify URL ultimately authenticates as the submitted email.

Resend's default API limit is low enough that the polling helper should use a modest interval and a hard timeout instead of tight loops. Prefer one `emails.list()` call per polling interval and only call `emails.get(id)` for plausible candidates.

## Phase 1: Install Playwright and Define E2E Configuration

### Overview

Add Playwright as a dev dependency, add scripts, ignore local E2E env files and reports, and create a config that mirrors the monorepo's existing Playwright convention while targeting `tests/e2e`.

### Changes Required:

#### 1. Package Scripts and Dependency

**File**: `package.json`
**Changes**: Add `@playwright/test` as a dev dependency and add `test:e2e` plus `test:e2e:update` scripts. Keep existing Vitest scripts unchanged.

#### 2. Playwright Config

**File**: `playwright.config.ts`
**Changes**: Add a root-level Playwright config with `testDir: './tests/e2e'`, `outputDir: './tests/playwright-report'`, Chromium as the first project, `PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'`, HTML reporter, CI retries/workers/forbidOnly, and trace capture on retry.

#### 3. Git Ignore

**File**: `../../.gitignore`
**Changes**: Ignore `.env.local`, `.env.test`, `.env.e2e`, and Playwright report/output folders generated by edu-platform tests. This prevents local secrets and heavy browser artifacts from entering the repo.

#### 4. E2E Environment Documentation

**File**: `tests/e2e/README.md`
**Changes**: Document required local env variables, the expected DEV inbox behavior, the command sequence for starting the app and running E2E tests, and the fact that secrets must live outside git.

### Success Criteria:

#### Automated Verification:

- [ ] Dependency install succeeds: `npm install`
- [ ] Playwright browsers install succeeds: `npx playwright install chromium`
- [ ] Existing tests still pass: `npm run test`
- [ ] Playwright can load config: `npx playwright test --list`

#### Manual Verification:

- [ ] Developer can identify where `.env.e2e` values should live without reading source code.
- [ ] No secret-bearing env file is tracked by git.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that local E2E env setup is available before proceeding.

---

## Phase 2: Build the Reusable E2E Test Harness

### Overview

Create the shared E2E structure: typed environment access, base fixture, page object model classes, and Resend helper. This phase establishes reusable conventions before writing the first auth spec.

### Changes Required:

#### 1. Test Environment Helper

**File**: `tests/e2e/support/env.ts`
**Changes**: Centralize E2E env parsing and validation. Required values should include `E2E_EXTERNAL_LOGIN_EMAIL`, `E2E_RESEND_API_KEY`, and `E2E_RESEND_INBOX_EMAIL`; defaults can cover `E2E_EXTERNAL_COURSE_ID=10xdevs-3-prework`, `E2E_EXTERNAL_RETURN_PATH=/external/10xdevs-3-prework/pl`, and `PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000`.

#### 2. Resend Magic Link Helper

**File**: `tests/e2e/support/resendMagicLinks.ts`
**Changes**: Add a helper that polls Resend sent emails after a captured `startedAt` timestamp, filters plausible messages by destination inbox and external auth email shape, retrieves candidate HTML via `emails.get(id)`, extracts the first matching `/external/{courseId}/verify?...` URL, and returns an absolute URL safe for Playwright navigation.

Use the official Resend SDK APIs already present in the app dependency graph: `resend.emails.list()` to find recent sent emails and `resend.emails.get(id)` to retrieve HTML.

#### 3. Base Test Fixture

**File**: `tests/e2e/fixtures/test.ts`
**Changes**: Export the Playwright `test` and `expect` objects with project-wide fixtures for validated E2E env and support helpers. Keep this thin so future specs can import from one stable path.

#### 4. External Login Page Object

**File**: `tests/e2e/pages/ExternalLoginPage.ts`
**Changes**: Encapsulate navigation to the external login route, email submission, success-message assertion, and any Turnstile readiness wait needed for the current UI. Use role/name or label-based locators where possible.

#### 5. External Course Page Object

**File**: `tests/e2e/pages/ExternalCoursePage.ts`
**Changes**: Encapsulate assertions for the authenticated external course page: expected path, visible course title, and visible authenticated user email in the header.

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles the E2E support files through Playwright: `npx playwright test --list`
- [ ] Existing Vitest suite remains unaffected: `npm run test`

#### Manual Verification:

- [ ] Page object names clearly map to route surfaces.
- [ ] Resend helper fails with actionable messages when required env values are missing or no email arrives.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that the helper contracts are understandable before adding specs.

---

## Phase 3: Add the First External Auth E2E Spec

### Overview

Write the first browser E2E test for the selected happy path: local dev server, `10xdevs-3-prework`, `przemek.smyrdek@gmail.com`, Resend lookup, magic link verification, and authenticated prework page assertion.

### Changes Required:

#### 1. External Auth Spec

**File**: `tests/e2e/external-auth.spec.ts`
**Changes**: Add a serial happy-path test that records `startedAt`, opens the login page for `10xdevs-3-prework` with `returnUrl=/external/10xdevs-3-prework/pl`, submits `przemek.smyrdek@gmail.com`, waits for the success message, fetches the matching magic link from Resend, navigates to it, and asserts the authenticated page.

#### 2. Rate Limit and Email Collision Guardrails

**File**: `tests/e2e/external-auth.spec.ts`
**Changes**: Ensure the test is isolated enough for local runs: clear browser context state before the scenario, use the `startedAt` timestamp to avoid stale emails, and document that repeated runs can hit the app's cookie rate limit if executed too quickly.

#### 3. Optional Smoke Test Skeletons

**File**: `tests/e2e/external-login.spec.ts`
**Changes**: If useful during implementation, add a lightweight login-page render smoke test that does not send email. Keep it separate from the real magic-link spec so local developers can run a cheap browser check without Resend.

### Success Criteria:

#### Automated Verification:

- [ ] App starts locally with E2E env: `npm run dev`
- [ ] Playwright spec passes locally: `npm run test:e2e`
- [ ] Existing tests pass after E2E additions: `npm run test`

#### Manual Verification:

- [ ] Browser reaches `/external/10xdevs-3-prework/pl` after opening the Resend magic link.
- [ ] Authenticated page visibly shows `przemek.smyrdek@gmail.com`.
- [ ] Resend helper selected an email sent after the test started, not a stale magic link.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that the local Resend-backed scenario is reliable enough before expanding coverage.

---

## Phase 4: CI Readiness Without Enabling CI

### Overview

Leave the E2E setup ready for future CI but do not wire it into GitHub Actions yet. The first scenario uses real secrets and a real email provider, so CI should be added only after deciding how those secrets and inbox isolation should work.

### Changes Required:

#### 1. CI Notes

**File**: `tests/e2e/README.md`
**Changes**: Add a short section listing what future CI will need: deployment/base URL, Resend API key, target inbox, E2E login email, app runtime env values, report artifact path, and rate-limit strategy.

#### 2. Package Script Stability

**File**: `package.json`
**Changes**: Keep `npm run test:e2e` as the single stable command future CI can call. Avoid adding CI-only scripts unless implementation reveals a concrete need.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run test:e2e -- --list` works without starting the server.
- [ ] `npm run test:e2e` remains the canonical local execution command.

#### Manual Verification:

- [ ] Future CI prerequisites are documented clearly enough to turn into a workflow later.
- [ ] No GitHub Actions workflow starts sending real emails on every PR in this phase.

---

## Testing Strategy

### Unit Tests:

- Existing Vitest tests continue to cover auth handlers, external auth verification, email template generation, and related server logic.
- No new unit tests are required for Playwright page objects unless implementation extracts non-trivial pure parsing logic.
- If magic-link extraction uses a custom parser beyond simple URL matching, add a small Vitest test for that parser.

### Integration Tests:

- The first Playwright test is the integration test: browser UI → `/api/external/auth` → Resend → magic link verification → authenticated external page.
- A cheap login-page smoke spec can verify page rendering without sending email.

### Manual Testing Steps:

1. Populate local E2E env values, including `ENV=DEV`, `TEST_MODE=true`, `RESEND_API_KEY`, Supabase secrets, and `E2E_RESEND_INBOX_EMAIL=przeprogramowani@gmail.com`.
2. Start the local server: `npm run dev`.
3. Run: `npm run test:e2e`.
4. Confirm the test submits `przemek.smyrdek@gmail.com`.
5. Confirm the browser lands on `/external/10xdevs-3-prework/pl`.
6. Confirm the authenticated page shows `przemek.smyrdek@gmail.com`.

## Performance Considerations

Keep Resend polling conservative. A 2-second interval with a 60-second timeout is a reasonable starting point; avoid tight polling because Resend's default API limit is low. Keep the first test serial because it sends real email and depends on rate-limited auth behavior.

## Migration Notes

No database migration is required. The test depends on existing local `DEV + TEST_MODE` bypass behavior for `10xdevs-3-prework` and on existing Supabase sync behavior during verify. If local Supabase credentials are missing, the verify path can fail even after the magic link is valid, so env documentation must make this explicit.

## Open Risks & Assumptions

- Assumption: local E2E env can provide a working `RESEND_API_KEY` with permission to list and retrieve sent emails.
- Assumption: `przeprogramowani@gmail.com` is the correct DEV destination inbox for this setup.
- Risk: real email delivery and Resend indexing can be eventually consistent, so the test needs polling and a clear timeout.
- Risk: app cookie rate limiting can affect repeated local runs; the spec should clear browser state and the README should mention the 10-second retry window.
- Risk: Turnstile's test key behavior must be validated in the browser. If it does not mark the component as verified reliably, the implementation may need a small test-mode hook, but that is not the planned first approach.

## References

- Existing external login UI: `src/pages/external/[courseId]/login.astro`
- External login Svelte form: `src/components/ExternalLogin.svelte`
- External auth API: `src/pages/api/external/auth.ts`
- Magic link verification page: `src/pages/external/[courseId]/verify.astro`
- Authenticated external course page: `src/pages/external/[courseId]/index.astro`
- External auth verifier: `src/server/externalAuth.ts`
- Existing unit coverage: `tests/api/external/auth.test.ts`, `src/server/externalAuth.test.ts`
- Nearby Playwright convention: `../opanuj-frontend/playwright.config.ts`
- Resend sent email APIs: `https://resend.com/docs/api-reference/emails/list-emails`, `https://resend.com/docs/api-reference/emails/retrieve-email`
