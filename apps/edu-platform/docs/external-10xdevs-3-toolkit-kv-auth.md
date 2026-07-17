# External 10xDevs 3 Toolkit KV Auth Bridge

## Purpose

`/external/10xdevs-3` temporarily uses the toolkit membership KV as its access authority. This bridge exists until the centralized 10x-toolkit access broker is ready.

Plan: `thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md`

## Binding

Cloudflare Pages must bind the toolkit membership namespace under this edu-platform name:

```text
TOOLKIT_10X3_MEMBERSHIP_KV -> 10x-toolkit CLI_10X3_MEMBERSHIP_KV -> dd7fed61a71d42bfbace69865f18e9bb
```

Do not replace or rebind `CIRCLE_MEMBERS`. It uses the edu-platform Circle cache schema and remains the legacy path for other external courses.

## Mode

Set the auth source with:

```text
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv
TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy
```

Behavior:

- `toolkit_kv`: `/external/10xdevs-3` login, verify, and page guards read `TOOLKIT_10X3_MEMBERSHIP_KV`.
- `legacy`: `/external/10xdevs-3` returns to the Supabase/Circle flow and checks Circle space `2552674`.
- Unset with `ENV=PROD`: production defaults to `toolkit_kv`.
- Unset outside production: local/dev falls back to `legacy` when the binding is missing.

## Request Path

Toolkit mode checks happen in three places:

- `src/pages/api/external/auth.ts`: before magic link generation.
- `src/pages/external/[courseId]/verify.astro`: after magic link verification and before setting the browser cookie.
- `src/server/externalAuth.ts`: on each external page guard before Supabase is consulted.

The service reads keys in the toolkit format:

```text
member:<sha256(lowercase_trimmed_email)>
```

Only records with `hasAccess: true` allow access.

## Preview Smoke

Before launch, verify preview with:

1. Confirm toolkit sync has written a known allowed email into namespace `dd7fed61a71d42bfbace69865f18e9bb`.
2. Bind `TOOLKIT_10X3_MEMBERSHIP_KV` to that namespace.
3. Set `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=toolkit_kv`.
4. POST `/api/external/auth` for an allowed email and `courseId=10xdevs-3`; expect `200`.
5. POST `/api/external/auth` for a denied email and `courseId=10xdevs-3`; expect `403`.
6. Complete magic-link verify for an allowed email; expect redirect to `/external/10xdevs-3/`.
7. Open one lesson and one markdown export under `/external/10xdevs-3`.
8. Spot-check another external course, for example `/external/10xdevs-2`, to confirm it still follows the legacy path.

## Rollback

To roll back without code changes:

1. Set `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE=legacy`.
2. Redeploy or restart the Cloudflare Pages environment if needed for env propagation.
3. Verify `/external/10xdevs-3` uses the Supabase/Circle path.
4. Confirm rollback checks Circle space `2552674`.

## Manual Overrides

The reader is the only edu-platform code that touches this KV — all writes are owned by the upstream `10x-toolkit` repo (sync + webhook). When the upstream sync cannot reconcile a case (most commonly a Circle email change, where the same `memberId` ends up under a new email and the old key is left orphaned), ops can hand-edit the namespace to unblock the user.

### Schema additions

The reader accepts these optional fields on a membership record. They are ignored by the access decision (which gates only on `hasAccess`) and exist for audit/support traceability:

| Field | Type | Where written |
|---|---|---|
| `deactivatedAt` | ISO timestamp | On the **stale** record being marked inactive |
| `deactivatedReason` | `'circle_email_changed'` | On the **stale** record |
| `supersededBy` | email | On the **stale** record, points to the active one |
| `manualOverrideReason` | `'circle_email_changed'` | On the **new active** record seeded by hand |

Type definitions: `src/server/toolkit/tenXDevs3Membership.ts` (`ToolkitDeactivatedReason`, `ToolkitManualOverrideReason`). Add new enum values there as new override scenarios appear; the parser drops unknown enum values silently (the rest of the record still loads), so ops mistakes don't lock anyone out.

### Procedure

1. Confirm the user's current email in Circle (Admin V1 `GET /api/v1/community_members/search?email=…`) and note the `id` (= `memberId`).
2. Compute both keys: `member:` + `sha256(email.toLowerCase().trim())` for the **old** and **new** emails.
3. Update the **stale** record: set `hasAccess: false`, append `deactivatedAt`, `deactivatedReason`, `supersededBy`. Keep `syncedAt` and `source` unchanged so the original audit trail stays intact.
4. Write a **new** record under the new-email key with the same `memberId`, `hasAccess: true`, `source: "seed"`, and `manualOverrideReason`.
5. Append a row to the override log below.

### Wrangler commands

```bash
# Deactivate stale record (use the old-email hash)
wrangler kv key put 'member:<sha256_old>' \
  '{"memberId":<id>,"email":"<old>","hasAccess":false,"syncedAt":"<original>","source":"webhook","deactivatedAt":"<now>","deactivatedReason":"circle_email_changed","supersededBy":"<new>"}' \
  --namespace-id=dd7fed61a71d42bfbace69865f18e9bb

# Seed active record (use the new-email hash, same memberId)
wrangler kv key put 'member:<sha256_new>' \
  '{"memberId":<id>,"email":"<new>","hasAccess":true,"syncedAt":"<now>","source":"seed","manualOverrideReason":"circle_email_changed"}' \
  --namespace-id=dd7fed61a71d42bfbace69865f18e9bb
```

### Override log

| Date | memberId | Old email → new email | Reason |
|---|---|---|---|
| 2026-04-29 | 80712963 | `w.dylag@cyberfolks.pl` → `d.jakubas@cyberfolks.pl` | `circle_email_changed` |
| 2026-06-10 | 80712115 | `konrad.krakowiak@nordsec.com` → `konrad.krakowiak1987@gmail.com` | `circle_email_changed` |
| 2026-06-11 | 36610625 | `mbmacura@novomatic-tech.com` → `mikolajmacura@proton.me` | `circle_email_changed` |

### Cleanup

Once the upstream toolkit handles Circle email-change events end-to-end (deletes the stale `member:<hash(old)>` and writes the new `member:<hash(new)>` keyed off `memberId`), a fresh bulk_sync will reconcile these manual records. After that, the entries in the override log can be removed and the schema additions can be considered for retirement.

## Removal

When the toolkit broker is ready:

1. Replace `checkTenXDevs3ToolkitMembership()` call sites with the broker HTTP client.
2. Remove the `TOOLKIT_10X3_MEMBERSHIP_KV` binding from Cloudflare Pages and `wrangler.toml`.
3. Remove `TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE` from runtime env typing and Cloudflare Pages config.
4. Delete `src/server/toolkit/tenXDevs3Membership.ts` and `src/server/toolkit/tenXDevs3Membership.test.ts`.
5. Update or delete this document.
