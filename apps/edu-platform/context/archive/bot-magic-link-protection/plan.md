# Bot Magic Link Protection Implementation Plan

## Overview

Port the email scanner detection middleware from ai-rules-builder to edu-platform to prevent corporate email security bots (Microsoft Safe Links, Google ATP, Proofpoint, Mimecast, etc.) from consuming one-time magic link tokens before real users can click them.

## Current State Analysis

Both verify pages (`src/pages/verify.astro:24` and `src/pages/external/[courseId]/verify.astro:38`) call `verifyMagicLink()` unconditionally on page load. This function reads the token from Cloudflare KV and **immediately deletes it** (`remoteMagicLinkManager.ts:58`). Any HTTP GET to the verify URL — including from an email scanner bot — permanently consumes the token.

Existing protections (rate limiting, CAPTCHA) only guard magic link *generation* endpoints, not the verify pages themselves.

### Key Discoveries:

- `remoteMagicLinkManager.ts:58` — token is deleted on first read, making it strictly single-use
- `src/middlewares/index.ts` — Astro middleware pipeline already exists with `rateLimiter` and `externalNoStore` in a `sequence()`
- `/Users/admin/code/ai-rules-builder/src/middleware/email-scanner-detection.ts` — proven solution with 11 known scanner User-Agent patterns, HEAD detection, and bot heuristics
- No tests exist for middleware or `rateLimiter.ts` — unit tests for the scanner module will be the first middleware-level tests

## Desired End State

Corporate email scanner bots hitting `/verify?token=...` or `/external/*/verify?token=...` receive a benign 200 OK response without the magic link token being consumed. Real users clicking from their email client proceed normally. On the rare false positive, the user sees a branded page with a "Click here to continue" link that bypasses scanner detection.

Verification:
- Scanner User-Agents (e.g. `Microsoft-Threat-Protection`) get a 200 response without token consumption
- HEAD requests get a 200 response without token consumption
- Normal browser requests proceed to token verification as before
- Requests with `?confirm=1` bypass scanner detection entirely
- Unit tests cover all detection signals and the bypass mechanism

## What We're NOT Doing

- Changing the token lifecycle (single-use deletion stays as-is)
- Adding multi-use tokens or time-windowed reuse
- Adding a mandatory JS-confirm step for all users
- Modifying the magic link generation or email sending flow
- Adding IP-based blocking or behavioral analysis
- Adding scanner detection to non-verify routes

## Implementation Approach

Port the `emailScannerMiddleware()` from ai-rules-builder as a new module at `src/server/emailScannerDetection.ts`. Wire it into the existing Astro middleware pipeline in `src/middlewares/index.ts` to intercept verify routes before any token processing. The middleware is stateless — pure request header inspection with no KV or DB dependencies.

The scanner response page will be a minimal branded HTML page (dark bg, white text) with a "click here to continue" fallback link that reloads with `?confirm=1` to bypass detection. The `confirm` param is accepted unconditionally — the magic link's own TTL in `verifyMagicLink()` handles expiry.

## Phase 1: Scanner Detection Module

### Overview

Create the email scanner detection module adapted from ai-rules-builder, with the `confirm` bypass mechanism and a branded response page.

### Changes Required:

#### 1. Email Scanner Detection Module

**File**: `src/server/emailScannerDetection.ts` (new)

**Intent**: Port the scanner detection logic from ai-rules-builder. The module exports three functions: `detectEmailScanner()` for signal-based detection, `shouldBlockScanner()` for confidence threshold gating, and `emailScannerMiddleware()` as the main entry point. The `emailScannerMiddleware()` function also checks for the `confirm=1` query param and skips detection if present.

**Contract**: 
- `detectEmailScanner(request: Request): ScannerDetectionResult` — returns `{ isScanner, confidence, reason?, scannerType? }`
- `shouldBlockScanner(result, minConfidence = 'medium'): boolean`
- `emailScannerMiddleware(request: Request): Response | null` — returns a Response for blocked scanners, or `null` to proceed. Checks `url.searchParams.get('confirm')` and returns `null` immediately if truthy.
- `createScannerResponse(url: URL, detectionResult): Response` — produces a branded 200 HTML page with inline dark styles, `noindex`/`nofollow`, no-cache headers, and a "click here to continue" link pointing to the same URL with `&confirm=1` appended.

#### 2. Unit Tests

**File**: `src/server/emailScannerDetection.test.ts` (new)

**Intent**: Cover all detection signals (known scanner UAs, HEAD method, missing referer + non-browser Accept, bot patterns, short UA), the confidence threshold logic, the `confirm` bypass, and the response content.

**Contract**: Vitest test file using `describe`/`it` blocks. Each detection signal gets its own test case with a crafted `Request` object. The `confirm` bypass test verifies `emailScannerMiddleware()` returns `null` when `?confirm=1` is present even for a known scanner UA.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npx vitest run src/server/emailScannerDetection.test.ts`
- Type checking passes: `npx tsc --noEmit`

#### Manual Verification:

- None for this phase — pure logic module with no integration yet

**Implementation Note**: After completing this phase and all automated verification passes, proceed to Phase 2.

---

## Phase 2: Middleware Integration & Testing

### Overview

Wire the scanner detection into the Astro middleware pipeline so it intercepts verify routes before token processing. Verify the full flow in dev.

### Changes Required:

#### 1. Middleware Pipeline Integration

**File**: `src/middlewares/index.ts`

**Intent**: Add a `scannerDetection` middleware to the existing `sequence()` that runs before `externalNoStore`. It matches verify routes (`/verify` and `/external/*/verify`) and calls `emailScannerMiddleware()`. Non-matching routes pass through untouched.

**Contract**: New `scannerDetection` middleware added to the `sequence()` export. Route matching: `url.pathname === '/verify'` or regex `/^\/external\/[^/]+\/verify$/`. The middleware sits between `rateLimiter` and `externalNoStore` in the sequence.

#### 2. Integration Verification

**Intent**: Manually verify the full flow: start dev server, request `/verify?token=fake` with a scanner User-Agent via curl, confirm 200 response with branded page. Then request the same URL with a normal browser User-Agent, confirm normal redirect/error flow. Then request with scanner UA + `?confirm=1`, confirm bypass works.

**Contract**: Three curl commands for verification:

```bash
# Scanner detected — should return 200 with branded HTML
curl -v -H "User-Agent: Microsoft-Threat-Protection" "http://localhost:3000/verify?token=test"

# Normal browser — should proceed to normal flow (redirect to login with error)
curl -v -H "User-Agent: Mozilla/5.0" "http://localhost:3000/verify?token=test"

# Scanner with confirm bypass — should proceed to normal flow
curl -v -H "User-Agent: Microsoft-Threat-Protection" "http://localhost:3000/verify?token=test&confirm=1"
```

### Success Criteria:

#### Automated Verification:

- All existing tests still pass: `npm run test`
- Type checking passes: `npx tsc --noEmit`
- Linting passes: `npm run lint`

#### Manual Verification:

- Scanner UA curl returns 200 with branded HTML containing "click here to continue" link
- Normal browser UA curl proceeds to normal verify flow (redirect to `/login?error=MISSING_TOKEN`)
- Scanner UA with `?confirm=1` curl proceeds to normal verify flow
- Dev server login flow works end-to-end (send magic link, click it in browser, verify login succeeds)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before considering the task done.

---

## Testing Strategy

### Unit Tests:

- Each detection signal (11 known scanner UAs, HEAD method, no-referer heuristic, bot patterns, short UA)
- Confidence threshold gating (high/medium/low)
- `confirm=1` bypass returns `null` for all scanner types
- Response content includes expected HTML elements (dark background, continue link, noindex)
- Non-scanner requests return `null`

### Integration Tests:

- Not needed — the middleware is stateless and the integration is a 3-line addition to the pipeline

### Manual Testing Steps:

1. Start dev server: `npm run dev`
2. Curl with scanner UA → verify 200 branded page
3. Curl with normal UA → verify normal redirect
4. Curl with scanner UA + `confirm=1` → verify bypass
5. Full login flow in browser → verify no regression

## References

- Research: `context/changes/bot-magic-link-protection/research.md`
- Prior art: `/Users/admin/code/ai-rules-builder/src/middleware/email-scanner-detection.ts`
- Main verify page: `src/pages/verify.astro:24`
- External verify page: `src/pages/external/[courseId]/verify.astro:38`
- Token deletion: `src/server/magic-links/remoteMagicLinkManager.ts:58`
- Middleware pipeline: `src/middleware/index.ts:52`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Scanner Detection Module

#### Automated

- [x] 1.1 Unit tests pass: `npx vitest run src/server/emailScannerDetection.test.ts` — 459c476c
- [x] 1.2 Type checking passes: `npx tsc --noEmit` — 459c476c

### Phase 2: Middleware Integration & Testing

#### Automated

- [x] 2.1 All existing tests still pass: `npm run test` — d6448035
- [x] 2.2 Type checking passes: `npx tsc --noEmit` — d6448035
- [x] 2.3 Linting passes: `npm run lint` — d6448035

#### Manual

- [x] 2.4 Scanner UA curl returns 200 with branded HTML — 8fff1ac9
- [x] 2.5 Normal browser UA curl proceeds to normal verify flow — 8fff1ac9
- [x] 2.6 Scanner UA with `confirm=1` bypasses detection — 8fff1ac9
- [x] 2.7 Dev server login flow works end-to-end without regression — 8fff1ac9
