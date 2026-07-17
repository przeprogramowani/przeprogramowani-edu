# External Membership Cache Operations

## Overview

External membership checks use a cache-first policy:

- Fresh cache (`<= 60 days`) is trusted.
- Missing cache triggers a Circle membership check and cache write.
- Revoked cache triggers one Circle re-check before denial.
- Stale cache (`> 60 days`) is synchronously revalidated against Circle.

## Required Environment Variables

Set these variables in your runtime environment:

- `EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS` (default `1440`)
- `EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS` (default `2160`)
- `EXTERNAL_MEMBERSHIP_REFRESH_SECRET` (required for scheduler + manual refresh endpoint calls)

## Internal Refresh Endpoint

- Endpoint: `POST /api/external/membership-refresh`
- Auth: `Authorization: Bearer <EXTERNAL_MEMBERSHIP_REFRESH_SECRET>`
- Behavior:
  - Lists cached membership keys from `CIRCLE_MEMBERS` KV.
  - Re-checks Circle membership for each cached row.
  - Updates cached status (`active` or `revoked`) and `verifiedAt`.
  - On Circle/API failures, logs errors and keeps existing cache entry unchanged.

## Scheduled Refresh Worker

Files:

- `workers/membership-refresh-cron.ts`
- `wrangler.membership-refresh.toml`

Cron schedule is set to every 2 months:

- `0 3 1 */2 *` (03:00 UTC on day 1 every second month)

The worker posts to `/api/external/membership-refresh` using `EXTERNAL_MEMBERSHIP_REFRESH_SECRET`.

## Deploying The Scheduler

1. Set secret for the cron worker:

```bash
wrangler secret put EXTERNAL_MEMBERSHIP_REFRESH_SECRET --config wrangler.membership-refresh.toml
```

2. Deploy worker:

```bash
wrangler deploy --config wrangler.membership-refresh.toml
```

3. Ensure `SITE_URL` points to your deployed app domain for that worker environment.

## Manual Recovery Run

Run a one-off refresh manually:

```bash
curl -X POST "${SITE_URL}/api/external/membership-refresh" \
  -H "Authorization: Bearer ${EXTERNAL_MEMBERSHIP_REFRESH_SECRET}"
```

Expected response:

```json
{
  "success": true,
  "checked": 0,
  "updated_active": 0,
  "updated_revoked": 0,
  "errors": 0
}
```
