---
date: 2026-05-28T19:00:00+02:00
researcher: claude-opus
git_commit: 273138c8b02efec5d99a1a6ec7e034d69f6848d6
branch: master
repository: przeprogramowani-sites
topic: "M3-L5 lesson prep: bug design, Sentry setup, Wrangler debugging for 10xCards"
tags: [research, m3-l5, debugging, sentry, wrangler, 10xcards, bug-design]
status: complete
last_updated: 2026-05-28
last_updated_by: claude-opus
---

# Research: M3-L5 Lesson Prep — Bug Design, Sentry, and Wrangler for 10xCards

**Date**: 2026-05-28T19:00:00+02:00
**Researcher**: claude-opus
**Git Commit**: 273138c8
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How to prepare the 10xCards project for the m3-l5 debugging lesson: (1) design and introduce a realistic bug that escapes unit/E2E tests from m3-l2/l3/l4, (2) evaluate and set up Sentry as a free monitoring service, (3) document Wrangler tail capabilities for production debugging.

## Summary

- **Bug design**: A single-line change in `save-session.ts` that uses draft IDs instead of flashcard IDs when creating `review_states`. The FK constraint rejects the insert, but the error is swallowed. Result: flashcards appear in the deck, but review is empty. This escapes unit tests (Supabase is mocked, no FK enforcement), hooks (types check out), and typical E2E tests (which verify deck presence, not review functionality).
- **Sentry**: Free tier (5,000 errors/month, 30-day retention) is sufficient. `@sentry/astro` + `@sentry/cloudflare` works with Astro 6 on Cloudflare. DSN can be optional (empty = disabled). MCP server and CLI both work on free tier (except Seer AI features).
- **Wrangler**: `wrangler pages deployment tail --format json` provides real-time structured logs. Workers Logs (add `[observability]` to wrangler.toml) provides 3-day historical logs on the free plan. Key limitation: no response body or HTTP status code in tail — Sentry is complementary.

## Detailed Findings

### 1. 10xCards Codebase: Data Flow Analysis

The flashcard lifecycle has five critical phases:

| Phase | Route/File | What happens |
|-------|-----------|--------------|
| Generate | `POST /api/generate` → `openrouter.ts` → `flashcard_drafts` insert | AI generates cards, validates with Zod, inserts as drafts |
| Review drafts | `GET /generate/[sessionId]` → `CandidateReview.tsx` | SSR loads drafts, user accepts/rejects |
| Save | `POST /api/sessions/[sessionId]/save` → `save-session.ts` | Promotes accepted drafts to flashcards, creates review_states, deletes drafts |
| Deck | `GET /api/flashcards` → `flashcards` table | Lists flashcards directly by account_id |
| Review | `GET /review` → `review-queries.ts` → `review_states` INNER JOIN `flashcards` | Fetches due cards via review_states → flashcards join |

**Key architectural fact**: The deck page queries `flashcards` directly, but the review page queries via `review_states` with an INNER JOIN to `flashcards`. If review_states are missing, deck works but review is empty.

**Critical file**: `src/lib/save-session.ts:14-106` — the save orchestration:

1. Idempotency check (line 15-23): query flashcards by `(account_id, source_session_id)`
2. Fetch accepted drafts (line 25-29)
3. Upsert flashcards (line 72-75): `onConflict: "account_id,source_draft_id"`, `ignoreDuplicates: true`
4. Create review_states (line 83-92): maps `upserted` rows to review_states — **error is warned but not thrown**
5. Delete drafts (line 95-99): cleanup — **error is warned but not thrown**

Steps 4 and 5 have **swallowed errors** — they log `console.warn` and continue. The function returns `{ ok: true }` even if review_states or draft cleanup fails.

### 2. Test Coverage Gap Analysis

**Current state of 10xCards**: Zero test files, zero test dependencies, zero test scripts. A comprehensive `context/foundation/test-plan.md` (178 lines) exists with 7 risks and 6 phases, but none are implemented.

**What the learner WOULD have after m3-l2 through m3-l4:**

| Lesson | Test type | What it covers | What it misses |
|--------|-----------|---------------|----------------|
| m3-l2 | Unit/integration (Vitest) | OpenRouter contract validation, error dispatch, privacy guardrails | Save transaction, review_states creation, data persistence across flows |
| m3-l3 | Hooks | Lint, typecheck, scoped test triggers on file edit | Runtime behavior, data integrity, multi-step flows |
| m3-l4 | E2E (Playwright) | Generate → accept → save → deck shows cards | Review page (separate flow), review_states existence, SRS scheduling |

**The gap**: No test in the planned test-plan.md Phases 1-4 verifies that `review_states` are correctly created during the save flow. Phase 2 covers the "wedge state machine" (draft → flashcard promotion) but focuses on the flashcard upsert, not the review_states backfill. Phase 6 (E2E) plans two scenarios: (a) generate → review → save happy path and (b) auth-gate roundtrip — but scenario (a) verifies "save full happy path" ending at deck presence, not review functionality.

**Why this gap is realistic**: The review_states creation is a non-critical-path side effect from the save endpoint's perspective. The API returns 200 whether or not review_states succeed. A developer writing tests for "save works" would assert flashcard count and deck presence, not cross-check review_states existence.

### 3. Bug Design

#### The Bug

**File**: `10xCards/src/lib/save-session.ts`
**Line**: 84
**Mechanism**: Use `acceptedDrafts` (draft IDs) instead of `upserted` (flashcard IDs) when constructing review_states rows.

**Current code (correct)**:
```typescript
// save-session.ts:83-84
if (upserted && upserted.length > 0) {
  const reviewRows = upserted.map((row) => ({ flashcard_id: row.id, account_id: accountId }));
```

**Buggy code**:
```typescript
// save-session.ts:83-84
if (upserted && upserted.length > 0) {
  const reviewRows = acceptedDrafts.map((d) => ({ flashcard_id: d.id, account_id: accountId }));
```

**Diff**:
```diff
--- a/src/lib/save-session.ts
+++ b/src/lib/save-session.ts
@@ -81,7 +81,7 @@ export async function saveSession({ supabase, accountId, sessionId }: SaveSessio

   if (upserted && upserted.length > 0) {
-    const reviewRows = upserted.map((row) => ({ flashcard_id: row.id, account_id: accountId }));
+    const reviewRows = acceptedDrafts.map((d) => ({ flashcard_id: d.id, account_id: accountId }));
     const { error: reviewInsertError } = await supabase
       .from("review_states")
       .upsert(reviewRows, { onConflict: "flashcard_id", ignoreDuplicates: true });
```

#### Why It Works

1. `acceptedDrafts[i].id` = draft UUID from `flashcard_drafts` table
2. `upserted[i].id` = flashcard UUID from `flashcards` table
3. These are different UUIDs — drafts and flashcards have independent PKs
4. The FK constraint `review_states.flashcard_id → flashcards(id)` rejects the insert because no flashcard has the draft's UUID
5. Supabase returns an error like: `insert or update on table "review_states" violates foreign key constraint "review_states_flashcard_id_fkey"`
6. The error is caught at line 88 and logged as `console.warn` with `severity: "orphan_review_state"`
7. The function continues and returns `{ ok: true, savedCount: N }`
8. The API route returns HTTP 200

#### Observable Symptoms

| Surface | What the user/developer sees |
|---------|------------------------------|
| **UI: Save** | "Zapisano N fiszek" — success message ✅ |
| **UI: Deck** | Cards appear in the deck listing ✅ |
| **UI: Review** | "Brak fiszek do powtórki" — empty review ❌ |
| **Sentry** | `orphan_review_state` error with stack trace → save-session.ts |
| **Wrangler tail** | `console.warn` JSON with `severity: "orphan_review_state"`, `sessionId`, `accountId` |
| **Browser DevTools** | Network tab: `GET /review` returns HTML with empty cards array; no JS errors |

#### Why It Escapes Tests

| Layer | Why it passes |
|-------|--------------|
| **TypeScript** | Both `d.id` and `row.id` are `string` (UUID). Types check out. |
| **ESLint** | No lint rule flags this. |
| **Unit tests (m3-l2)** | Supabase is mocked. Mock `.upsert()` returns `{ error: null }`. No FK enforcement. |
| **Hooks (m3-l3)** | PostToolUse lint/typecheck hooks see valid TypeScript. Scoped tests run the unit tests above. |
| **E2E tests (m3-l4)** | E2E test: generate → accept → save → deck shows cards. Deck works! Test passes. No E2E scenario checks review page. |

#### The User Ticket

```
Tytuł: Powtórka jest pusta mimo zapisanych fiszek

Opis: Wygenerowałem fiszki z tekstu o TypeScript type guards. Fiszki pojawiły się
na ekranie, zaakceptowałem 5 z nich i zapisałem — widzę komunikat "Zapisano 5 fiszek."
Fiszki są w mojej talii, mogę je przeglądać i edytować.

Ale kiedy klikam "Powtórka" — strona pokazuje "Brak fiszek do powtórki."
Próbowałem wygenerować nowe i zapisać ponownie — to samo.
Talia ma fiszki, powtórka jest pusta.

Przeglądarka: Chrome 130
Konto: user@example.com
```

#### Lesson Debugging Workflow

1. **Parse ticket**: Extract structured debug input — steps to reproduce, scope (deck works, review broken), frequency (every time)
2. **Check Sentry**: `search_issues` → find `orphan_review_state` errors. `get_issue_details` → stack trace points to `save-session.ts:88`. Breadcrumbs show the upsert call context.
3. **Check Wrangler**: `wrangler pages deployment tail --format json --search "orphan_review_state"` → see the `console.warn` with `sessionId` and `accountId` after every save.
4. **Reproduce locally**: Generate flashcards → accept → save → deck shows cards → review is empty.
5. **Diagnose**: Agent reads `save-session.ts`. Notices line 84: `acceptedDrafts.map((d) => ({ flashcard_id: d.id }))`. Cross-references with line 72-75: upserted flashcards have different IDs than drafts. The FK `review_states.flashcard_id → flashcards(id)` rejects draft UUIDs.
6. **Debug-as-test**: Write integration test: save session → assert `review_states` rows exist with flashcard IDs (not draft IDs) → test fails.
7. **Fix**: Change `acceptedDrafts.map((d) => ({ flashcard_id: d.id }))` to `upserted.map((row) => ({ flashcard_id: row.id }))`.
8. **Verify**: Test passes. Review shows due cards. Sentry clears. Wrangler shows no more `orphan_review_state` warnings.

### 4. Sentry Free Tier Evaluation

#### Pricing

| Feature | Developer (Free) | Team ($26/mo) |
|---------|-----------------|---------------|
| Errors/month | 5,000 | 50,000 |
| Retention | 30 days | 90 days |
| Users | 1 | unlimited |
| Email alerts | ✅ | ✅ |
| API access | ✅ | ✅ |
| GitHub/Slack integration | ❌ | ✅ |
| Seer AI debugging | ❌ | ✅ ($40/user add-on) |
| Session Replays | 50/month | 500/month |

**Verdict**: 5,000 errors/month and 30-day retention are more than sufficient for a solo MVP demo. The 1-user limit is fine for solo dev. Missing GitHub integration is inconvenient but not blocking — CLI and MCP still provide programmatic access. Missing Seer AI is the biggest loss for a "debugging with AI" lesson, but the MCP's raw data tools (`get_issue_details`, `search_issues`, `get_trace_details`) work without Seer. **The free tier is viable.**

#### SDK Setup for 10xCards (Astro 6 + Cloudflare)

`@sentry/astro` alone does NOT work with Cloudflare Workers — it bundles Node.js built-ins. The solution: `@sentry/astro` + `@sentry/cloudflare` together. The Astro integration auto-detects the Cloudflare adapter.

10xCards already has `nodejs_compat` in `wrangler.toml` (required for `AsyncLocalStorage`).

**Minimal setup — files to change:**

1. **`package.json`** — add `@sentry/astro` and `@sentry/cloudflare`
2. **`astro.config.mjs`** — add `sentry()` integration with optional DSN:
   ```js
   import sentry from "@sentry/astro";
   // ...
   integrations: [react(), sitemap(), sentry({ dsn: process.env.SENTRY_DSN || "" })],
   ```
3. **`src/sentry.client.config.ts`** — browser-side init
4. **`.env.local`** — add `SENTRY_DSN` (optional — empty = Sentry disabled)
5. **`wrangler.toml`** — optionally add `upload_source_maps = true`

**Graceful degradation**: All Sentry SDKs initialize in no-op mode when DSN is empty. The project works without any Sentry configuration. Learners who don't want to create a Sentry account can skip it.

**Risk**: Astro 6 is newer than most tested Sentry configurations. `@astrojs/cloudflare` v13.5 should work with Sentry's auto-detection, but edge cases are possible.

#### Sentry MCP Server

Official MCP at `https://mcp.sentry.dev/mcp` or self-hosted via `@sentry/mcp-server`.

Key tools available on free tier:

| Tool | What it does |
|------|-------------|
| `get_issue_details` | Full issue details: stacktrace, breadcrumbs, user context |
| `search_issues` | Natural-language issue search (needs LLM key for inner agent) |
| `get_trace_details` | Distributed trace inspection |
| `update_issue` | Resolve, ignore, reassign issues |
| `find_projects` | List projects in organization |

**Not available on free tier**: `analyze_issue_with_seer` (AI root cause analysis — paid only).

**Setup**: `claude mcp add sentry-mcp -- npx -y @sentry/mcp-server --auth-token=<TOKEN>`

#### Sentry CLI

New CLI at `cli.sentry.dev` with `--json` output for agent parsing:

```bash
sentry issue list my-org/10xcards --json --limit 5
sentry issue events ISSUE-ID --full --json
sentry issue view ISSUE-ID --spans 3
```

Works on free tier. `sentry issue explain` and `sentry issue plan` (Seer AI) are paid only.

### 5. Wrangler Debugging Capabilities

#### Wrangler Tail

Real-time log streaming from deployed Workers/Pages:

```bash
# Pages variant
npx wrangler pages deployment tail --project-name 10xcards-30 --environment production --format json

# With filtering
npx wrangler pages deployment tail --project-name 10xcards-30 --format json --search "orphan_review_state"
```

**JSON output structure:**
```json
{
  "outcome": "ok",
  "scriptName": "10xcards-30",
  "exceptions": [],
  "logs": [
    {
      "message": ["{\"severity\":\"orphan_review_state\",\"sessionId\":\"abc\",\"accountId\":\"def\",\"savedCount\":5}"],
      "level": "warn",
      "timestamp": 1716900000000
    }
  ],
  "eventTimestamp": 1716900000000,
  "event": {
    "request": {
      "url": "https://10xcards.pages.dev/api/sessions/abc/save",
      "method": "POST",
      "headers": {},
      "cf": { "colo": "WAW" }
    }
  }
}
```

**Available filters**: `--status` (ok/error/canceled), `--method`, `--header`, `--search`, `--ip`, `--sampling-rate`

**NOT available**: URL path filter (use `jq` pipe), HTTP status code (only worker outcome)

**Latency**: Near-real-time (1-3 seconds). Max 10 concurrent tail clients.

#### Workers Logs (Historical)

Add to `wrangler.toml` (not currently enabled in 10xCards):
```toml
[observability]
enabled = true
head_sampling_rate = 1
```

| Plan | Included | Retention |
|------|----------|-----------|
| Free | 200,000 events/day | 3 days |
| Paid | 20M events/month | 7 days |

Provides persistent, queryable logs in Cloudflare Dashboard → Workers & Pages → Observability.

#### Console.log Behavior

`console.log/warn/error` in Workers/Pages:
- Shows in `wrangler tail` in the `logs` array
- Shows in Workers Logs dashboard (if `[observability]` enabled)
- Does NOT go to stdout (Workers are ephemeral)
- JSON objects are auto-parsed and queryable in Workers Logs

10xCards already uses semi-structured `console.warn`:
```
generate: persistence_failed code=23505 (userId=abc-123 sessionId=550e8400)
```

The `orphan_review_state` warning is logged as JSON:
```json
{"severity":"orphan_review_state","sessionId":"...","accountId":"...","savedCount":5}
```

#### Sentry + Wrangler Complementarity

| Capability | Wrangler tail | Workers Logs | Sentry |
|-----------|--------------|-------------|--------|
| Real-time | ✅ | ❌ | ❌ |
| Historical | ❌ | ✅ (3-7 days) | ✅ (30 days) |
| console.log | ✅ | ✅ | Via breadcrumbs |
| Response body | ❌ | ❌ | Via context |
| HTTP status code | ❌ (only outcome) | ❌ | ✅ |
| Stack trace | Via exceptions[] | Via exceptions | ✅ (full) |
| User context | ❌ | ❌ | ✅ |
| Agent-friendly | ✅ (JSON + jq) | Partial (dashboard) | ✅ (MCP + CLI) |

For the bug scenario: wrangler shows the `orphan_review_state` warning in real-time, Sentry provides the full error context with stack trace and user info for historical analysis.

### 6. Sentry Integration Patch for 10xCards

#### Dependencies

```bash
cd /Users/admin/code/10xCards
npm install @sentry/astro @sentry/cloudflare
```

#### astro.config.mjs

```diff
--- a/astro.config.mjs
+++ b/astro.config.mjs
@@ -4,12 +4,14 @@ import { defineConfig, envField } from "astro/config";
 import react from "@astrojs/react";
 import sitemap from "@astrojs/sitemap";
 import tailwindcss from "@tailwindcss/vite";
 import cloudflare from "@astrojs/cloudflare";
+import sentry from "@sentry/astro";

 export default defineConfig({
   output: "server",
-  integrations: [react(), sitemap()],
+  integrations: [react(), sitemap(), sentry({ dsn: process.env.SENTRY_DSN || "" })],
   server: { port: 3000 },
   vite: {
     plugins: [tailwindcss()],
   },
```

#### sentry.client.config.ts (new file)

```typescript
import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN || "",
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
```

#### wrangler.toml (add observability)

```diff
--- a/wrangler.toml
+++ b/wrangler.toml
@@ -8,3 +8,7 @@ id = "860aefe188c84f38ace73329181e2d94"

 [triggers]
 crons = ["0 3 * * *"]
+
+[observability]
+enabled = true
+head_sampling_rate = 1
```

#### save-session.ts (upgrade orphan warning to also capture in Sentry)

If Sentry is configured, the `console.warn` at line 89 should also capture the error:

```diff
--- a/src/lib/save-session.ts
+++ b/src/lib/save-session.ts
@@ -1,5 +1,6 @@
 import type { SupabaseClient } from "@supabase/supabase-js";
 import type { Database } from "@/types/database";
+import * as Sentry from "@sentry/astro";

 // ... existing code ...

     if (reviewInsertError) {
-      console.warn(
+      console.error(
         JSON.stringify({ severity: "orphan_review_state", sessionId, accountId, savedCount: upserted.length })
       );
+      Sentry.captureException(reviewInsertError, {
+        tags: { severity: "orphan_review_state" },
+        extra: { sessionId, accountId, savedCount: upserted.length },
+      });
     }
```

Note: `@sentry/astro` may not export `captureException` directly in all contexts. Verify import path during implementation. Alternative: use `console.error` (Sentry auto-captures uncaught exceptions; for caught exceptions, explicit capture is needed).

### 7. Implementation Order

For applying changes to 10xCards:

1. **Sentry setup first** (so we can verify it captures errors):
   - Install deps
   - Update astro.config.mjs
   - Create sentry.client.config.ts
   - Add `[observability]` to wrangler.toml
   - Add Sentry.captureException to save-session.ts orphan handler
   - Test: create a Sentry project (free tier), set DSN, deploy, verify errors appear

2. **Introduce the bug**:
   - Apply the one-line change in save-session.ts:84
   - Test locally: generate → save → deck (works) → review (empty)
   - Check Sentry: `orphan_review_state` error appears
   - Check wrangler tail: warning appears

3. **Verify the escape**:
   - If unit tests exist (from m3-l2): run `npm run test` → all pass
   - If hooks exist (from m3-l3): edit a file → hooks pass
   - If E2E tests exist (from m3-l4): run Playwright → deck test passes, no review test exists

## Code References

- `10xCards/src/lib/save-session.ts:14-106` — Save orchestration (bug target)
- `10xCards/src/lib/save-session.ts:83-92` — Review_states creation (bug line: 84)
- `10xCards/src/lib/review-queries.ts:5-41` — fetchDueCards with INNER JOIN (symptom source)
- `10xCards/src/pages/review/index.astro:12-13` — Review page SSR (shows empty when no review_states)
- `10xCards/src/pages/api/sessions/[sessionId]/save.ts:27-31` — Save API route (returns 200 even with bug)
- `10xCards/src/pages/api/flashcards/index.ts:42-71` — Deck listing (works even with bug)
- `10xCards/supabase/migrations/20260520120000_init_review_states.sql:11` — FK constraint definition
- `10xCards/astro.config.mjs:10-32` — Current Astro config (Sentry integration target)
- `10xCards/wrangler.toml:1-10` — Current Cloudflare config (observability target)

## Architecture Insights

1. **Swallowed errors are the lesson's real teaching point.** The `console.warn` pattern in save-session.ts (lines 89 and 102) is a deliberate design choice — the save should succeed even if side effects fail. But without monitoring (Sentry) and log inspection (Wrangler), these failures are invisible. The bug amplifies a real architectural pattern into a teaching moment.

2. **The INNER JOIN in fetchDueCards is load-bearing.** The query `review_states ... flashcards!inner(front, back, origin)` means both tables must have data for cards to appear in review. The deck query goes directly to `flashcards`, creating a split where deck works but review doesn't — a realistic symptom that requires understanding the data model to diagnose.

3. **Sentry and Wrangler are complementary, not competing.** Wrangler shows real-time request flow; Sentry shows historical errors with context. The lesson should teach BOTH, not pick one. For this bug: wrangler shows the warning on every save request, Sentry provides the aggregated error with stack trace and user context for root cause analysis.

4. **The free tier constraint is actually pedagogically useful.** Seer AI (root cause analysis) is paid-only, so the learner's agent must do its own diagnosis from the raw Sentry data. This is a better learning exercise than having Sentry explain the bug automatically.

## Open Questions

1. **When to apply the bug**: Before or after the learner implements tests from m3-l2/l3/l4? If before, the bug exists throughout their testing journey (and they don't catch it — powerful teaching moment). If after, it needs to be introduced as a "production incident."
   - **Recommendation**: Introduce after m3-l4. The lesson narrative is "you've built your quality pipeline, and then this ticket comes in." The bug pre-dates their test suite conceptually (it was always there), but the lesson reveals it.

2. **Sentry account creation**: Should the lesson require learners to create a Sentry account, or should it be optional?
   - **Recommendation**: Optional with fallback. Show Sentry as the primary path. For learners who skip it, wrangler tail + manual console.error inspection is the fallback. The debugging workflow works either way — Sentry adds convenience, not a fundamentally different technique.

3. **Should the bug also cause a visible error in the API response?** Currently it returns 200. Making it return 500 would be easier to debug but less realistic. The "silent 200 with corrupted side effect" is the harder, more educational scenario.
   - **Recommendation**: Keep the 200. Silent failures are the entire point of the lesson — tests pass, API returns success, but something is wrong downstream. This is what production debugging looks like.

4. **Sentry import path for server-side in Cloudflare Workers context.** `@sentry/astro` may not be importable directly in `save-session.ts` — the server SDK might need `@sentry/cloudflare` import. Verify during implementation.
   - **Recommendation**: Test the import during the Sentry setup phase. If `@sentry/astro` doesn't work in server files, use conditional import or a lightweight wrapper.

5. **Should we also enable Wrangler Workers Logs (`[observability]`) or keep it as something the lesson teaches to enable?**
   - **Recommendation**: Enable it in the wrangler.toml change. It costs nothing on the free plan (200K events/day) and provides the historical logs that make the debugging story complete. The lesson references it as "already enabled."

## Related Research

- `workbench/lessons/m3-l5/research/lesson-structure-input.md` — Lesson structure with 60/25/15 proportions and ticket-as-frame decision
- `workbench/lessons/m3-l5/research/ticket-scenario-input.md` — Original ticket scenario design (adapted in this research)
- `workbench/lessons/m3-l5/research/browser-debugging-tools-input.md` — BrowserTools MCP vs Playwright diagnostic capabilities
- `workbench/lessons/m3-l5/research/production-error-sources-input.md` — Sentry and Wrangler as production data sources
- `10xCards/context/foundation/test-plan.md` — Test rollout plan with 7 risks and 6 phases
- `10xCards/context/changes/testing-bootstrap-openrouter-privacy/research.md` — Phase 1 research (OpenRouter contract + privacy)
