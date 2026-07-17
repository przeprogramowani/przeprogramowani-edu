# Bot Magic Link Protection — Plan Brief

> Full plan: `context/changes/bot-magic-link-protection/plan.md`
> Research: `context/changes/bot-magic-link-protection/research.md`

## What & Why

Corporate email security bots (Microsoft Safe Links, Google ATP, Proofpoint, Mimecast) pre-click magic link URLs, consuming the one-time token in Cloudflare KV before the real user can. This blocks legitimate users from logging in, particularly those with corporate email accounts on external courses.

## Starting Point

Both verify pages (`verify.astro` and `external/[courseId]/verify.astro`) call `verifyMagicLink()` unconditionally on page load, which reads AND deletes the token from KV in a single operation. No protection exists on verify pages — rate limiting and CAPTCHA only guard magic link generation endpoints.

## Desired End State

Scanner bots receive a benign 200 OK page without the token being consumed. Real users proceed normally. On the rare false positive, a branded "click here to continue" link bypasses detection. The fix lives in the Astro middleware pipeline — a single integration point covering all verify routes.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|----------|--------|-------------------|--------|
| Integration point | Astro middleware pipeline | Single integration point covers both verify pages and any future ones — avoids duplication. | Plan |
| False-positive handling | JS-based "click here" link with `?confirm=1` | Self-service recovery without support tickets; bots don't modify URLs. | Plan |
| Bypass security | Accept `confirm=1` unconditionally | Magic link's own TTL handles expiry — no need for signed tokens. | Plan |
| Response styling | Minimal branded (dark bg, white text) | Looks intentional if a user sees it; tiny payload. | Plan |
| Detection approach | Port ai-rules-builder middleware | Proven in production, stateless, no KV dependency. | Research |

## Scope

**In scope:**
- Port `emailScannerDetection.ts` from ai-rules-builder with `confirm` bypass
- Wire into Astro middleware pipeline for `/verify` and `/external/*/verify`
- Unit tests for all detection signals
- Manual curl verification of scanner vs browser behavior

**Out of scope:**
- Token lifecycle changes (single-use stays)
- Multi-use tokens or time-windowed reuse
- Mandatory JS-confirm for all users
- IP-based blocking or behavioral analysis
- Scanner detection on non-verify routes

## Architecture / Approach

Stateless middleware that inspects request headers (User-Agent, method, Accept, Referer) against known email scanner patterns. Returns a benign 200 HTML page for detected scanners; returns `null` (proceed) for real users. Sits in the Astro middleware `sequence()` between `rateLimiter` and `externalNoStore`, matching verify routes only.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Scanner Detection Module | `emailScannerDetection.ts` + unit tests | Low — direct port of working code |
| 2. Middleware Integration & Testing | Wired into pipeline, verified via curl | Low — 3-line middleware addition |

**Prerequisites:** None — standalone feature with no external dependencies
**Estimated effort:** ~1 session, single phase each

## Open Risks & Assumptions

- New scanner types not in the pattern list could slip through (mitigated by the `confirm` bypass fallback)
- The `confirm=1` bypass is trivially discoverable but email scanners follow exact URLs — they don't append query params

## Success Criteria (Summary)

- Scanner UA requests to verify pages get a 200 response without token consumption
- Normal browser requests proceed to verification as before
- False positive users can self-recover via "click here to continue"
