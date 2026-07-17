# Lesson Grounding: m3-l5 — Debugowanie z AI: od stack trace'a do gotowego fixa

## Scope

- Lesson source: lesson-spec.md + research files (bug-sentry-wrangler-research.md, browser-debugging-tools-input.md, lesson-structure-input.md, ticket-scenario-input.md, production-error-sources-input.md)
- Neighbor boundaries: m3-l4 (E2E testing, Playwright), m4-l1 (legacy codebase mapping)
- Relevant prework: 2.3 (MCP servers), 3.2 (prompt-as-contract), 3.3 (context lifecycle)
- Research posture: standard — verify tool APIs, ground conceptual claims, confirm pricing

## Claims To Support

1. **Sentry MCP tool names**: spec references `search_issues`, `get_issue_details` — need exact current API
2. **Sentry free tier**: 5K errors/month, 30-day retention, MCP works on free tier
3. **Sentry MCP setup command**: exact syntax for Claude Code
4. **@sentry/astro + @sentry/cloudflare compatibility**: with Astro version used in 10xCards
5. **Wrangler tail**: exact command, flags, JSON output, limitations
6. **Playwright CLI/MCP diagnostic tools**: already verified 2026-05-28
7. **Swallowed-error anti-pattern**: is this a recognized pattern?
8. **Debug-as-test**: is this a recognized technique?
9. **"Monitoring catches what tests miss"**: practitioner evidence

## Strong Sources

### Sentry MCP Server (getsentry/sentry-mcp)

- URL: https://github.com/getsentry/sentry-mcp
- Type: repo
- Author/publisher: Sentry (getsentry)
- Checked: 2026-05-29
- Supports:
  - Sentry MCP server is `@sentry/mcp-server` on npm, current version 0.35.0
  - `get_issue_details` and `get_trace_details` are **no longer directly exposed** — they are internal primitives behind `get_sentry_resource`
  - Externally exposed tools include: `search_issues`, `update_issue`, `find_projects`, `find_organizations`, `analyze_issue_with_seer`, `get_sentry_resource`, `search_events`, `search_issue_events`, and others
  - `search_issues` has an OPTIONAL embedded LLM agent for natural-language→Sentry-query translation. Without LLM keys (`OPENAI_API_KEY`/`ANTHROPIC_API_KEY`), the tool gracefully degrades to direct Sentry query pass-through — the `query` parameter is sent to Sentry API verbatim. Learners just write Sentry search syntax (e.g. `message:update_failed is:unresolved`) instead of natural language. **No LLM key required.**
  - `get_sentry_resource` is the unified fetcher. Two invocation modes: (a) URL mode — pass `url` (auto-detects resource type), (b) explicit mode — pass `resourceType` + `resourceId` + `organizationSlug`. For issues: `get_sentry_resource(resourceType="issue", resourceId="PROJECT-123", organizationSlug="my-org")`. Returns formatted markdown with stack trace, tags, breadcrumbs, etc.
  - `analyze_issue_with_seer` requires paid plan (Seer AI)
  - Setup for Claude Code: `npx @sentry/mcp-server@latest --access-token=<TOKEN>` (flag is `--access-token`, NOT `--auth-token`)
  - Plugin marketplace option: `claude plugin marketplace add getsentry/sentry-mcp`
  - Hosted endpoint: `https://mcp.sentry.dev/mcp` still available
- Use in lesson:
  - **CORRECTION**: The spec references `get_issue_details` as a direct tool. This is now internal — use `get_sentry_resource` with `resourceType="issue"`. The lesson can also describe the capability abstractly ("the agent queries Sentry for issue details").
  - **Practical workflow for the FK bug**: (1) `search_issues(query="update_failed", organizationSlug="...", projectSlugOrId="...")` → finds matching issue with short ID. (2) `get_sentry_resource(resourceType="issue", resourceId="PROJECT-123", organizationSlug="...")` → full stack trace, tags, event count. (3) Optionally `get_sentry_resource(resourceType="breadcrumbs", resourceId="PROJECT-123", ...)` → breadcrumbs.
  - **No LLM key gotcha** — ~~previously thought `search_issues` required LLM provider~~ — verified (source code: `handler.ts`) that it gracefully degrades to direct query pass-through. Free Sentry account + auth token is sufficient.
  - The free tier works for all data-reading tools. Only Seer AI analysis is paid-only.
- Confidence: high
- Notes: Tool surface is evolving (pre-1.0). The lesson should reference capabilities rather than exact tool names where possible in Core. Deep Dive can show the exact 2-step workflow (`search_issues` → `get_sentry_resource`) with a "verify against current docs" note. The `get_sentry_resource` URL mode is agent-friendly — if the agent has a Sentry issue URL, it can pass it directly.

### Sentry Pricing (Free Developer Plan)

- URL: https://sentry.io/pricing/
- Type: official-docs
- Author/publisher: Sentry
- Checked: 2026-05-29
- Supports:
  - 5,000 errors/month
  - 30-day data retention
  - 1 user limit
  - Includes: error monitoring, tracing, email alerts, API access, 10 custom dashboards, unlimited projects
  - Excludes: Seer AI debugging, third-party integrations (GitHub/Slack), SSO/SAML
  - 50 session replays/month
- Use in lesson:
  - Deep Dive can confirm free tier is sufficient for solo learner projects
  - Missing GitHub integration is inconvenient but MCP/CLI still work
- Confidence: high
- Notes: Pricing may change. The lesson should link to the pricing page rather than hardcoding numbers.

### Sentry Astro + Cloudflare SDK Guide

- URL: https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/astro/
- Type: official-docs
- Author/publisher: Sentry
- Checked: 2026-05-29
- Supports:
  - `@sentry/astro` + `@sentry/cloudflare` both required (separate packages)
  - Auto-detection of Cloudflare adapter since v10.40.0
  - `nodejs_compat` flag required in wrangler.toml
  - DSN empty/undefined = SDK initializes but silently discards events (no-op for sending)
  - Current versions: @sentry/astro 10.55.0, @sentry/cloudflare 10.55.0
  - Source maps: both wrangler.toml `upload_source_maps = true` and Sentry integration config (org, project, authToken) recommended
- Use in lesson:
  - Deep Dive setup section can reference this guide
  - Graceful degradation (empty DSN) is confirmed — learners without Sentry account can skip
- Confidence: high
- Notes:
  - **WARNING — Astro 6 NOT yet supported.** Open issue #19753 on sentry-javascript. Astro 5 works. If 10xCards uses Astro 5, no problem. If Astro 6, the lesson must note this limitation.
  - Issue #21008 (closed): `injectMetaTagsInResponse` silently dropped security headers on Cloudflare Workers. Fixed in recent versions (10.53+).
  - The lesson should NOT promise Astro 6 compatibility without verification at draft time.

### Wrangler Pages Deployment Tail

- URL: https://developers.cloudflare.com/workers/wrangler/commands/#deployment-tail
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-29
- Supports:
  - Command: `npx wrangler pages deployment tail [DEPLOYMENT] --project-name <name>`
  - `[DEPLOYMENT]` optional — defaults to latest deployment for given `--environment` (default: production)
  - Confirmed flags: `--format json|pretty`, `--search <text>`, `--status ok|error|canceled`, `--method`, `--header`, `--ip` (incl. `"self"`), `--sampling-rate`, `--environment`
  - JSON structure confirmed: `outcome`, `scriptName`, `exceptions[]`, `logs[]` (with `message`, `level`, `timestamp`), `event.request` (with `url`, `method`, `headers`, `cf`)
  - NOT available: HTTP response status code, response body — only worker outcome (ok/error/canceled)
  - Max 10 concurrent tail clients (dashboard + CLI combined)
  - Logs stop streaming if >100 req/s sustained for 5 minutes
- Use in lesson:
  - Beat 6 uses wrangler tail with `--format json --search "update_failed"` — syntax confirmed correct
  - The lesson should mention the 100 req/s streaming limit as a gotcha for high-traffic projects
- Confidence: high
- Notes: Near-real-time latency (1-3 seconds). The `--search` flag filters on console.log message content.

### Cloudflare Workers Logs (Persistent/Historical)

- URL: https://developers.cloudflare.com/workers/observability/
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-29
- Supports:
  - Enabled via `[observability]` section in wrangler.toml with `enabled = true` and optional `head_sampling_rate`
  - Free tier: 200,000 events/day, 3-day retention
  - Paid tier: 20M events/month, 7-day retention
  - Max log entry size: 256 KB (truncated if exceeded)
- Use in lesson:
  - Deep Dive can mention this as an alternative to real-time tail for post-incident investigation
- Confidence: medium-high
- Notes: **Pages compatibility not explicitly documented** — Workers Logs docs reference Workers only. Verify at draft time whether `[observability]` works in Pages Functions. If not, the lesson should note this limitation.

### Playwright CLI/MCP Diagnostic Tools

- URL: https://github.com/microsoft/playwright-mcp (README, source code)
- Type: repo
- Author/publisher: Microsoft Playwright team
- Checked: 2026-05-28
- Supports:
  - `browser_console_messages` — core tool (always available), filters by level (error/warning/info/debug)
  - `browser_network_requests` — core tool, lists all requests with method/URL/status, regex filtering
  - `browser_network_request` — core tool, full details for single request (headers, body, status, duration)
  - CLI equivalents: `console [min-level]`, `requests`, `request <index>`
  - All diagnostic tools are `capability: 'core'` — no `--caps` flag needed
  - `--caps=network` enables route mocking (not reading)
  - `--caps=devtools` enables tracing, video, highlighting (not console reading)
- Use in lesson:
  - Beat 7 uses these for local reproduction — confirmed available
  - The lesson can reference exact tool names since Playwright MCP is more stable (v0.0.75+)
- Confidence: high
- Notes: Already verified 2026-05-28. BrowserTools MCP confirmed abandoned and insecure — do not reference.

### OWASP Top 10:2025 — A10: Mishandling of Exceptional Conditions

- URL: https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/
- Type: official-docs
- Author/publisher: OWASP Foundation
- Checked: 2026-05-29
- Supports:
  - Silent error suppression and fail-open behaviors are classified as a top-10 security risk
  - "Mishandling of Exceptional Conditions" is a new category in the 2025 edition
  - Covers: catching exceptions without proper handling, failing to log/report errors
- Use in lesson:
  - Beat 11 (swallowed errors as a class) can reference OWASP A10:2025 as industry-standard classification
  - Strengthens the claim that swallowed errors are a recognized anti-pattern, not just a teaching construct
- Confidence: high
- Notes: This is a security framing. The lesson's angle is diagnostic (how to detect), not security (how to prevent). Reference OWASP to establish that the pattern is named and catalogued, not to frame the lesson as security training.

### Wikipedia: Error Hiding

- URL: https://en.wikipedia.org/wiki/Error_hiding
- Type: reference
- Author/publisher: Wikipedia (community)
- Checked: 2026-05-29
- Supports:
  - "Error hiding" defined as "catching an error or exception, and then continuing without logging, processing, or reporting the error"
  - Explicitly called "an anti-pattern in computer programming"
  - Academic citation: Padua & Shang (2019), "Studying the evolution of exception handling anti-patterns," Journal of the Brazilian Computer Society
- Use in lesson:
  - Background context for Beat 11 — the pattern has a name and academic study
  - Not for direct citation in lesson prose (Wikipedia), but the academic paper is citable
- Confidence: medium (Wikipedia as source, but the academic reference is solid)
- Notes: Use the academic paper for strong grounding, Wikipedia for confirmation that the term is established.

### Kent Beck — Test-Driven Development: By Example (2002)

- URL: (book, no URL)
- Type: paper (canonical book)
- Author/publisher: Kent Beck / Addison-Wesley
- Checked: 2026-05-29
- Supports:
  - Established the discipline: when a bug is found, write a failing test that reproduces it, then fix to green
  - The technique is called "test-driven bugfixing" in practitioner writing
  - Evolveum documents this as a formal practice: https://evolveum.com/test-driven-bugfixing/
  - End of Line Blog walkthrough: https://www.endoflineblog.com/real-life-tdd-fixing-a-reported-bug
- Use in lesson:
  - Beat 9 (debug-as-test) is grounded in Beck's TDD discipline
  - The lesson's framing ("test starts from symptom, works backward") is a restatement of Beck's principle
  - The lesson adds the agent dimension (agent writes the reproducing test) but the technique itself is canonical
- Confidence: high
- Notes: The lesson should acknowledge that this is an established practice. The novel claim is that the agent can drive this reactive testing workflow, not that the technique itself is new.

### Charity Majors — "I Test in Production" (InfoQ 2018)

- URL: https://www.infoq.com/presentations/testing-production-2018/
- Type: practitioner-signal
- Author/publisher: Charity Majors (Honeycomb co-founder)
- Checked: 2026-05-29
- Supports:
  - "Tests can't catch what they don't know to look for"
  - Advocates observability tooling to catch the ~80% of shipped bugs before users notice
  - Monitoring is complementary to testing, not a replacement
  - The proactive/reactive framing (tests = proactive, monitoring = reactive safety net) is validated
- Use in lesson:
  - Thesis validation: the lesson's "pipeline has blind spots, monitoring is the safety net" maps directly to Majors' argument
  - Suitable for Materiały dodatkowe as a talk recommendation
  - Language: "testing shows the presence of expected behavior; monitoring shows the presence of unexpected behavior"
- Confidence: high
- Notes: Charity Majors is the strongest single voice for the "observability catches what tests miss" thesis. The talk is from 2018 but the argument has only strengthened with agent-driven workflows.

## Practitioner Signals

### "200 OK but broken" / Soft Errors

- URL: https://www.compiler.today/api-development/200-ok-the-success-response-that-was-actually-a-critical-error (compiler.today)
- Type: practitioner-signal
- Signal:
  - The pattern is called "soft errors," "error tunneling," or "200-for-everything" anti-pattern
  - Monitoring dashboards report 100% availability while the system is broken, because tooling trusts status codes
  - Marcelo Cure's "REST anti-patterns" catalogs it: https://marcelocure.medium.com/rest-anti-patterns-b128597f5430
- Useful language:
  - "The 200 that lies" / "success code that hides failure"
  - "Your dashboard says 100% uptime. Your users say otherwise."
- Risk:
  - Easy to overstate. The 10xCards bug is a specific case (swallowed side-effect error), not a REST API design problem per se. The lesson should frame it as "the API tells the truth about the primary operation (the card was rated) but lies about the side effect (the review_states UPDATE failed and was swallowed)."
- Confidence: medium

### Michael Nygard — Release It! (2nd ed., 2018)

- URL: (book, no URL)
- Type: practitioner-signal (canonical SRE book)
- Signal:
  - **Cascading Failure** anti-pattern describes errors that fail to propagate correctly, causing silent downstream damage
  - **Fail Fast** pattern is the direct countermeasure — errors should propagate immediately, not be swallowed
  - The 10xCards bug is a textbook case: the rate endpoint swallows the review_states UPDATE error, returning 200 with an in-memory card so the schedule silently never persists and the card keeps coming back to review
- Useful language:
  - "Fail fast" as the opposite of error swallowing
  - "Errors that don't propagate become errors that can't be diagnosed"
- Risk:
  - Nygard's framing is about system design, not debugging workflow. The lesson should reference the pattern class but not import the full cascading-failure framework.
- Confidence: high

## Examples Worth Using

1. **The 10xCards swallow-rate-update-200 bug** (rate.ts) — replaces the retired save-session FK bug, now covered by test-plan Phase 2. The grounding confirms this is a textbook case of error hiding (OWASP A10:2025) with a canonical debugging approach (Beck's test-driven bugfixing). VERIFIED: the rate/SRS path has zero tests, so the bug escapes every per-commit gate; the exact deterministic UPDATE-failure variant must be confirmed against local Supabase before recording (bug-swap-plan.md §0). The bug is well-chosen.

2. **Sentry MCP `get_sentry_resource` workflow** — The lesson should show the agent querying Sentry via MCP. Since `get_issue_details` is now internal, the drafter should use `get_sentry_resource` or describe the capability abstractly. Example interaction: agent calls Sentry MCP → receives issue with stack trace, breadcrumbs, user context → uses this to locate the bug in codebase.

3. **Wrangler tail `--search` filtering** — `wrangler pages deployment tail --project-name 10xcards-30 --format json --search "update_failed"` is a concrete, verified command. Good for showing the agent tapping runtime logs.

4. **Playwright `browser_console_messages` for ruling out frontend** — agent checks console logs during reproduction, finds no JS errors, confirming the issue is server-side. Brief but useful diagnostic step.

## Claims To Avoid Or Soften

1. **"Sentry MCP exposes `get_issue_details` as a tool"** — WRONG as of v0.35.0. This tool is now internal. Use `get_sentry_resource` or describe the capability abstractly.

2. **"@sentry/astro works with Astro 6"** — NOT CONFIRMED. Open issue #19753. Astro 5 is supported. The lesson should say "Astro 5+" or check the issue status at draft time.

3. ~~**"`search_issues` requires LLM provider"**~~ — **CORRECTED (2026-05-29).** Source code analysis (handler.ts) confirms: the embedded LLM agent is OPTIONAL. Without LLM keys, `search_issues` gracefully degrades to direct Sentry query pass-through. Learners pass Sentry search syntax (e.g. `message:update_failed is:unresolved`) instead of natural language. **Free Sentry account + auth token is sufficient.**

4. **"Wrangler Workers Logs work with Pages"** — NOT EXPLICITLY DOCUMENTED. The `[observability]` feature is documented for Workers only. Verify at draft time or note as unverified.

5. **"Agent will diagnose the bug from Sentry data alone"** — OVERCLAIM. The agent synthesizes from multiple sources. No single source is sufficient. The lesson's thesis explicitly states this, but the drafter must resist simplifying to "just point the agent at Sentry."

## Open Verification Questions

1. **Astro version in 10xCards**: Is it Astro 5 or Astro 6? This determines whether the Sentry SDK setup in Deep Dive is viable. Check `10xCards/package.json`.

Decision: We use Astro 6.3.1

2. **Workers Logs with Pages**: Does `[observability]` in wrangler.toml actually work for Pages Functions? The research file assumes yes, but Cloudflare docs only mention Workers. Verify by enabling and checking dashboard.

Decision: it only works for Workers, not Pages. 10xCards is deployed via workers, not sure what we guide people to in m1l5.

3. **Sentry MCP `search_issues` LLM requirement**: Is this a hard requirement (tool fails without it) or a soft one (tool works but with reduced capability)?

Decision: **Resolved — soft requirement.** Source code analysis (handler.ts) confirms: without LLM keys, `search_issues` gracefully degrades to direct Sentry query pass-through. The `query` parameter is sent verbatim to the Sentry API. Learners use Sentry search syntax (e.g. `message:update_failed is:unresolved`) instead of natural language. No LLM key required for the lesson's diagnostic workflow.

4. **`get_sentry_resource` exact usage**: What parameters does this unified tool take?

Decision: **Resolved — verified from source.** `get_sentry_resource` is the unified fetcher with two invocation modes: (a) URL mode — pass `url` param, type auto-detected; (b) explicit mode — pass `resourceType` ("issue"/"breadcrumbs"/"trace"/etc.) + `resourceId` (issue short ID like "PROJECT-123") + `organizationSlug`. Returns formatted markdown. For the lesson workflow: `search_issues(query="update_failed", ...)` → get issue short ID → `get_sentry_resource(resourceType="issue", resourceId="PROJECT-123", organizationSlug="...")` → full stack trace + tags + breadcrumbs.

## Schema Source Update

Added 8 sources to `groundingSources` in lessons-schema.json for m3-l5:
1. Sentry MCP Server repo (corrected tool names, setup command)
2. Sentry pricing page (free tier verification)
3. Sentry Astro+Cloudflare SDK guide (compatibility, DSN no-op)
4. Wrangler tail docs (command syntax, JSON structure, limitations)
5. Playwright CLI/MCP repo (diagnostic tools — already verified)
6. OWASP A10:2025 (swallowed-error anti-pattern classification)
7. Kent Beck TDD by Example (debug-as-test canonical source)
8. Charity Majors "I Test in Production" (monitoring-over-testing thesis)

Updated `sideEffectLedger.unsupportedFacts`:
- Removed: "Sentry MCP tool names need verification" → verified, corrections applied
- Added: "@sentry/astro Astro 6 compatibility unconfirmed (issue #19753). 10xCards uses Astro 6.3.1."
- Added: "Workers Logs works for Workers only, not Pages. 10xCards deploys via Workers — OK."
- Corrected: "search_issues LLM provider is OPTIONAL — gracefully degrades to direct query (verified from source)"
- Resolved: "get_sentry_resource interface verified — unified fetcher with URL or explicit mode"
