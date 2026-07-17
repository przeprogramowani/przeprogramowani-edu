---
date: 2026-05-06T12:00:00+02:00
researcher: claude
git_commit: 2dc4845df3834c403acad1c85c566ebcad845199
branch: master
repository: przeprogramowani-sites
topic: "Protect magic link auth from corporate email bot pre-clicking"
tags: [research, codebase, magic-links, email-scanners, auth, external-auth]
status: complete
last_updated: 2026-05-06
last_updated_by: claude
---

# Research: Protect magic link auth from corporate email bot pre-clicking

**Date**: 2026-05-06T12:00:00+02:00
**Researcher**: claude
**Git Commit**: 2dc4845df3834c403acad1c85c566ebcad845199
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Corporate email security bots (Microsoft Safe Links, Google ATP, Proofpoint, Mimecast, etc.) automatically follow links in emails, consuming one-time magic link tokens before the real user can click them. How is the token consumed today, and how did we solve this before in ai-rules-builder?

## Summary

The vulnerability is clear: both verify pages (`/verify` and `/external/[courseId]/verify`) immediately call `verifyMagicLink()` on page load, which reads AND deletes the token from KV in a single operation. Any HTTP GET to the verify URL — including from an email scanner bot — permanently consumes the token. The ai-rules-builder project solved this with an `email-scanner-detection.ts` middleware that intercepts scanner requests before any token processing and returns a benign 200 response. This middleware is directly portable to edu-platform.

## Detailed Findings

### 1. Token Lifecycle — The Vulnerability

Magic link tokens are stored in Cloudflare KV (`MAGIC_LINKS` namespace) and are **strictly single-use**:

- **Storage**: `remoteMagicLinkManager.ts:31-43` — token stored with `expirationTtl`
- **Verification**: `remoteMagicLinkManager.ts:45-60` — `verifyMagicLink()` reads the token from KV, then **immediately deletes it** (line 58) before returning the email
- **Main verify page**: `src/pages/verify.astro:24` — calls `verifyMagicLink(token, env)` unconditionally on page load
- **External verify page**: `src/pages/external/[courseId]/verify.astro:38` — same pattern

When a bot GETs the verify URL, the token is consumed at `remoteMagicLinkManager.ts:58` (`await MAGIC_LINKS.delete(token)`). When the real user clicks the same link, `MAGIC_LINKS.get(token)` returns `null` and they're redirected to login with a `MISSING_USER` / `MISSING_TOKEN` error.

### 2. Affected Flows

| Flow | Token Generation | TTL | Verify Page | Token Consumption |
|------|-----------------|-----|-------------|-------------------|
| **Main platform** | `src/pages/api/auth.ts:50-52` | 15 min | `src/pages/verify.astro:24` | `remoteMagicLinkManager.ts:58` |
| **External courses** | `src/pages/api/external/auth.ts:132-134` | 90 min | `src/pages/external/[courseId]/verify.astro:38` | `remoteMagicLinkManager.ts:58` |

Both flows share the same `verifyMagicLink()` function and suffer from the same vulnerability.

### 3. Existing Protections (Insufficient)

- **Rate limiting** (`src/middlewares/index.ts:5-8`): 10-second cookie-based cooldown on `/api/auth` and `/api/external/auth`. This only limits magic link *generation*, not *consumption*. The verify pages have no rate limiting.
- **CAPTCHA** (`src/pages/external/[courseId]/login.astro`): Turnstile on the external login form. Again, only protects generation, not the verify URL itself.
- **Membership check** (`src/pages/api/external/auth.ts:104-129`): Prevents unauthorized users from triggering emails, but doesn't help once a legitimate magic link is sent.

**No protection exists on the verify pages themselves.**

### 4. Prior Art — ai-rules-builder Solution

The ai-rules-builder project at `/Users/admin/code/ai-rules-builder` implemented a comprehensive solution:

**File: `src/middleware/email-scanner-detection.ts`**

A middleware that detects email scanner requests via multiple signals:

| Signal | Confidence | Detection |
|--------|-----------|-----------|
| Known scanner User-Agents (MS Safe Links, Google Safety, Proofpoint, Mimecast, Barracuda, Cisco) | HIGH | Regex match against 11 known patterns |
| HEAD request | MEDIUM | Method check |
| No referer + non-browser Accept header | MEDIUM | Header analysis |
| Bot-like User-Agent patterns (bot, crawler, spider, scanner, checker, validator, monitor) | MEDIUM | Generic regex patterns |
| Empty or very short User-Agent (< 20 chars) | LOW | Length check |

**Integration point: `src/pages/auth/verify.astro:16-19`**

```typescript
const scannerResponse = emailScannerMiddleware(Astro.request);
if (scannerResponse) {
  return scannerResponse; // Return benign 200 HTML without touching the token
}
```

The middleware returns a benign `200 OK` HTML response with `no-cache` headers and `noindex, nofollow` meta. Scanners see a success page and stop probing. The token is never read or deleted.

**Key design decisions:**
- Blocks at MEDIUM confidence or above (configurable threshold)
- Returns 200 (not 403/302) to satisfy scanners — some retry on non-200
- Logs detections for monitoring (`[EMAIL-SCANNER-DETECTION]` prefix)
- Stateless — no KV/DB dependency, pure request inspection

### 5. Alternative Approaches Considered

**A. Two-step verification (JS-required confirm)**

Instead of consuming the token on the initial GET, render a page with a "Confirm login" button. The button triggers a POST/fetch that actually verifies the token. Since bots don't execute JavaScript, the token is safe.

- **Pros**: Works against any bot, including unknown ones; doesn't rely on heuristic detection
- **Cons**: Adds friction (one extra click); breaks for users with JS disabled (edge case for this platform)

**B. Multi-use tokens with time window**

Allow the token to be consumed N times within a short window (e.g., 3 uses in 5 minutes). The first consumption (bot) creates the session and stores it temporarily; subsequent uses (real user) look up the cached session.

- **Pros**: Transparent to users; no extra clicks
- **Cons**: Complex state management; security trade-off (token reuse window); requires KV schema changes

**C. Hybrid: Scanner detection + JS confirm fallback**

Use scanner detection as the primary defense. For LOW-confidence or undetected bots that still slip through, the verify page could include an optional JS-based confirm step triggered only when the initial verify fails (i.e., redirect to a "link expired, click to retry" page that re-checks a secondary token).

- **Pros**: Best coverage; transparent for 95%+ of users
- **Cons**: Most complex to implement

## Code References

- `src/pages/verify.astro:24` — Main platform token consumption (vulnerable line)
- `src/pages/external/[courseId]/verify.astro:38` — External courses token consumption (vulnerable line)
- `src/server/magic-links/remoteMagicLinkManager.ts:45-60` — `verifyMagicLink()` function (reads & deletes token)
- `src/server/magic-links/remoteMagicLinkManager.ts:58` — The actual `MAGIC_LINKS.delete(token)` call
- `src/server/magic-links/constants.ts:1` — `DEFAULT_MAGIC_LINK_TTL_MINUTES = 15`
- `src/pages/api/auth.ts:50-52` — Main magic link generation
- `src/pages/api/external/auth.ts:132-137` — External magic link generation (90-min TTL)
- `src/server/auth.ts:28-42` — JWT token generation (HS256, 7-day session)
- `src/middlewares/index.ts:5-8` — Rate limit config (only on generation endpoints)

**Prior art (ai-rules-builder):**
- `/Users/admin/code/ai-rules-builder/src/middleware/email-scanner-detection.ts` — Full scanner detection middleware
- `/Users/admin/code/ai-rules-builder/src/pages/auth/verify.astro:16-19` — Integration point

## Architecture Insights

1. **Token deletion is the root cause**: The one-time-use design (`delete` on first read) is correct for security but creates the bot vulnerability. The fix should happen *before* `verifyMagicLink()` is called, not by changing the token lifecycle.

2. **Both verify pages share the same pattern**: The fix needs to be applied to both `src/pages/verify.astro` and `src/pages/external/[courseId]/verify.astro`. A shared middleware function (like ai-rules-builder's) avoids duplication.

3. **The middleware is stateless and lightweight**: It only inspects request headers — no KV lookups, no external calls. It can be inserted at the very top of both verify pages with zero performance impact.

4. **Logging is important**: Scanner detection events should be logged for monitoring. This helps track how often bots are hitting verify URLs and whether new scanner patterns need to be added.

## Recommendation

**Port the `email-scanner-detection.ts` middleware from ai-rules-builder** with minimal adaptation:

1. Copy the middleware to `src/server/emailScannerDetection.ts` (or `src/middlewares/`)
2. Add the scanner check at the top of both `src/pages/verify.astro` and `src/pages/external/[courseId]/verify.astro`, before any token processing
3. The middleware is directly portable — it has no project-specific dependencies

This is the simplest, lowest-risk, and most battle-tested approach. The scanner detection patterns are already proven in production on ai-rules-builder.

If scanner detection alone proves insufficient (new bot types slipping through), the two-step JS confirm can be layered on later as a second defense.

## Open Questions

1. **Do we have logs/metrics on how often this happens?** Knowing the frequency and which scanner types are involved could help prioritize the implementation.
2. **Should we add the scanner detection to the Astro middleware pipeline** (`src/middlewares/index.ts`) instead of inline in each verify page? Centralizing would be cleaner but couples it to route matching.
3. **Should the scanner response page include a "click here to continue" link** as a belt-and-suspenders approach? If a real user somehow triggers the scanner detection (false positive), they could still proceed.
