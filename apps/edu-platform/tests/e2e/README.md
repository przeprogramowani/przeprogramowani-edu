# Edu Platform E2E Tests

Playwright tests for edu-platform live in this directory. They are separate from Vitest unit and integration tests.

## Local Environment

Keep E2E secrets outside git, for example in `projects/edu-platform/.env.e2e` or your shell profile. Do not commit secret-bearing env files.

Required app runtime values for the external magic-link flow:

- `ENV=DEV`
- `TEST_MODE=true`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `SITE_URL=http://localhost:3000`

Required Playwright E2E values:

- `E2E_EXTERNAL_LOGIN_EMAIL=przemek.smyrdek@gmail.com`
- `E2E_RESEND_API_KEY`
- `E2E_RESEND_INBOX_EMAIL=przeprogramowani@gmail.com`

Optional Playwright E2E values:

- `PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000`
- `E2E_EXTERNAL_COURSE_ID=10xdevs-3-prework`
- `E2E_EXTERNAL_RETURN_PATH=/external/10xdevs-3-prework/pl`

## DEV Inbox Behavior

When the app runs with `ENV=DEV`, `/api/external/auth` sends external auth emails to `przeprogramowani@gmail.com` even when the submitted login email is different. The magic link token still belongs to the submitted login email, so the authenticated page should show `przemek.smyrdek@gmail.com`.

## Running Locally

Install dependencies and Playwright's Chromium browser once:

```bash
npm install
npx playwright install chromium --with-deps
```

Start the app with the E2E runtime environment loaded:

```bash
npm run dev
```

Run the browser tests from `projects/edu-platform`:

```bash
npm run test:e2e
```

To inspect available tests without starting the app:

```bash
npm run test:e2e -- --list
```

Repeated real magic-link runs can hit the local auth rate limit. Wait at least 10 seconds before retrying the same email if the app reports a rate-limit response.

## CI Prerequisites

The E2E suite is structured for CI but no workflow is wired up yet. When adding one, the runner needs:

1. **Install Playwright browsers** — `npx playwright install chromium --with-deps` before running tests. The config uses Playwright-managed Chromium, so no system Chrome is required.
2. **App runtime secrets** — configure as CI secrets and expose to the dev-server process: `ENV=DEV`, `TEST_MODE=true`, `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `SITE_URL`.
3. **E2E secrets** — configure as CI secrets: `E2E_RESEND_API_KEY`, `E2E_RESEND_INBOX_EMAIL`, `E2E_EXTERNAL_LOGIN_EMAIL`.
4. **Base URL** — set `PLAYWRIGHT_TEST_BASE_URL` to the dev-server or staging URL the runner starts.
5. **Report artifact** — upload `projects/edu-platform/playwright-report/` after the run so test results are inspectable on failure.
6. **Rate limiting** — serialise E2E job runs or add a minimum 10-second gap between retries to avoid the magic-link rate window. The spec already uses `test.describe.serial` and a 90-second timeout; do not run E2E jobs in parallel on the same email address.
7. **Inbox isolation** — `E2E_RESEND_INBOX_EMAIL` should be a dedicated CI inbox to avoid picking up stale magic links from concurrent developer runs.
