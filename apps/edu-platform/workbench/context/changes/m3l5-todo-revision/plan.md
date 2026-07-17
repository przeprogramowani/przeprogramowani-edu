# M3L5 Lesson Draft — Todo Revision Implementation Plan

## Overview

The author left six `[todo]` markers in `workbench/lessons/m3-l5/lesson-draft.md`
("Debugowanie z AI: od stack trace'a do gotowego fixa"). They cluster around the
lesson's diagnostic spine — whether Sentry can honestly lead the investigation, how
the soon-to-exist E2E suite squares with the "pipeline missed it" premise, why a
multi-source investigation is justified when an agent could just read the code, and a
missing reproduction-test prompt. This plan resolves all six, then reconciles the
`m3-l5` entry in `lessons-schema.json` so the contract matches the revised draft.

## Current State Analysis

The draft is structurally complete and grounded (status `grounded` in schema), but four
factual/narrative tensions sit unresolved behind the todos:

1. **Sentry can't see the bug as written.** The planted bug is `console.warn(…)` +
   `jsonResponse(200, …)` (schema `requiredFragments`, line 4054). The draft then claims
   the agent "finds issue `review/rate: update_failed`" in Sentry (draft line 80). But:
   - The `10xcards-m3l5-debug` worktree (branch `video/m3l5-debug-prep`) has **no
     `@sentry/*` dependency and no Sentry wiring at all** (verified 2026-05-31). The
     project's roadmap explicitly parks observability for v1.
   - Sentry's `captureConsoleIntegration` is **opt-in, not a default** (Context7 +
     Sentry docs). A bare `console.warn` emits nothing to Sentry even when installed.
   - So the Sentry-first beat is currently unsupported on two counts. Resolution:
     enable `captureConsoleIntegration` so the existing warn becomes the issue — the
     bug stays unchanged.
2. **E2E will exist by recording time.** The author is adding E2E before recording
   (todo line 12) and asked how to keep it from catching this bug. M3L4's E2E covers the
   generate→save path, not rate/SRS (verified). Decision: the new E2E covers that same
   different flow, so "no standing gate touches the rate path" stays literally true.
3. **The bug is code-local.** An agent reading `rate.ts` would find the swallow in
   seconds (todos line 69, 122). The lesson needs to say *why* it still teaches a
   multi-source investigation.
4. **No reproduction-test prompt.** The draft shows an integration test (draft lines
   223-236) but no prompt and no skill pointer (todo line 237).

### Key Discoveries

- Planted-bug spec: `lessons-schema.json:4054` — `console.warn` + return 200, type-clean
  `jsonResponse(200, { ok: true })`.
- `rate.ts` failed-UPDATE block today (worktree): `console.warn('review/rate:
  update_failed …')` then `return jsonResponse(500, …)` — the 500→200 swallow is the
  planted change the author owns; this plan does not touch the worktree.
- `review API + srs.ts have zero tests` — verified against 10xCards source
  (`lessons-schema.json:4103`); the draft's claim is correct and should be stated plainly.
- `captureConsoleIntegration` is officially supported in `@sentry/cloudflare` (dedicated
  Sentry docs page), captures `console.warn` by default level, routes to
  `captureMessage`/`captureException`. Free-plan compatible (SDK-side; consumes the
  5000 events/month error quota).
- `sentry-cli` scope: `releases`, `sourcemaps`, `debug-files`, `deploys` — no
  issue-*search* command; the MCP server is what exposes `search_issues` →
  `get_sentry_resource`. The draft's MCP-vs-CLI claim is essentially accurate, needs
  only tightening.
- Skills: `/10x-tdd` (delivered m3l2, integration/unit test-first, **no** `references/`
  subdir), `/10x-e2e` (delivered m3l4, ships `references/e2e-prompt-template.md` +
  `seed-test-pattern.md`, browser-level). m3l5 ships no new skill.
- Structure/voice contracts: `workbench/references/lesson-structure.md`,
  `workbench/references/style.md`.

## Desired End State

`m3-l5/lesson-draft.md` contains zero `[todo]` markers; the Sentry beat is factually
true given `captureConsoleIntegration`; the E2E and zero-test framing is consistent and
explicit about the deliberately-planted bug; a "why not just read the code" passage
answers the code-vs-investigation objection; the reproduction test has a concrete inline
prompt plus `/10x-tdd` (primary) and `/10x-e2e` references. The `m3-l5` schema entry
reflects these changes. Verify: `grep -c '\[todo' lesson-draft.md` is 0;
`jq . lessons-schema.json` parses; mermaid blocks still render; the side-effect ledger
is updated.

## What We're NOT Doing

- **Not** wiring Sentry into the `10xcards-m3l5-debug` worktree (separate repo; author
  owns it). The plan produces the exact wiring steps as a handoff note inside the draft's
  Deep Dive, but executes nothing in that repo.
- **Not** re-cutting the video scenario (`videos/video-diagnostic-walkthrough.md`) —
  already flagged in schema `videoTextMismatches`; tracked separately.
- **Not** changing the planted bug, the lesson's section order, the curriculum sequence,
  or any other lesson's schema entry.
- **Not** rewriting the vision-as-diagnostic section (lines 127-146) — no todo there.
- **Not** adding/altering grounding sources beyond marking resolved facts.

## Implementation Approach

Edit the draft top-to-bottom by decision area (Phases 1-4), each phase removing its
todo(s) and leaving the surrounding prose consistent with `style.md` and
`lesson-structure.md`. Phase 5 reconciles the schema after the draft is final, touching
only the `m3-l5` object. Polish/voice pass is deferred to `lesson-editor-pl` per the
workbench convention (editor before RC review) — this plan resolves substance, not final
copy-edit.

## Critical Implementation Details

- **Swallow definition stays precise.** With `captureConsoleIntegration`, the error is
  hidden from the user (200) but visible in monitoring *because* console capture was
  enabled. Word this as the sharper thesis — do not imply the error was never logged.
  Avoid suggesting Sentry auto-captures console by default; it's an explicit opt-in.
- **Quota caveat is load-bearing, not decorative.** `captureConsoleIntegration` emits
  **error-category** events (via `captureMessage`/`captureException`), so each captured
  `warn` shares the *same* 5000 errors/month free quota — and the same Issues stream — as
  uncaught client-side exceptions. It is not a separate "console" or "logs" bucket (the
  Logs quota applies only to Sentry's Logs product: `enableLogs`/`consoleLoggingIntegration`,
  off by default). A per-rating `warn` therefore both burns quota and adds noise to genuine
  production errors. Frame "scope `levels` deliberately" as a cost *and* signal-hygiene
  decision, not just billing. **Required stance:** capturing *all* warns/errors is fine in
  early / low-traffic stages (you want maximum visibility while the project is small and the
  free quota is ample), but it does not scale — as traffic grows, narrow `levels` (e.g.
  `['error']`) or move to surgical `captureException` on genuinely exceptional paths so you
  don't burn the shared errors quota or drown real crashes in console noise. The lesson must
  say this explicitly, not imply "always capture everything."
- **Astro 6 + Cloudflare is supported — resolved, not tentative.** Per the maintainer
  comment on issue #19762
  (https://github.com/getsentry/sentry-javascript/issues/19762#issuecomment-4040024798),
  Astro 6 works out of the box with `@sentry/cloudflare` by pointing `wrangler`'s `main`
  at a custom `sentry.server.config.ts` that wraps `@astrojs/cloudflare/entrypoints/server`
  in `Sentry.withSentry(...)` — exactly the snippet already in the draft's Deep Dive
  (lines 370-384). State this as confirmed; drop the "verify at setup time" hedging for the
  Cloudflare-adapter path. Issue #19753 (frontend-only Astro, no adapter) is a separate case
  and not 10xCards'.
- **Skill-layer correctness.** The reproduction test is an *integration* test
  (`rateCard`/`getReviewState`), so `/10x-tdd` is primary; `/10x-e2e` is named only for
  the e2e layer. Do not point at `/10x-e2e`'s reference files for the integration test —
  that risks drifting into M3L4's owned scope, which `m3-l5` `mustNotCover` forbids.

---

## Phase 1: Sentry beat made honest

### Overview

Make the Sentry-first investigation truthful by introducing `captureConsoleIntegration`
as the mechanism that turns the planted `console.warn` into the `review/rate:
update_failed` issue, tighten the MCP-vs-`sentry-cli` claim, and extend the Deep Dive
Sentry setup. Resolves todos at draft lines 69 and 78.

### Changes Required

#### 1. Sentry section — console capture as the bridge from warn to issue

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (section "Sentry MCP — dane z
produkcji", ~lines 73-90; triage line 68-69)

**Intent**: Insert a short, honest explanation that the planted handler only does
`console.warn`, and that Sentry surfaces it because the project enables
`captureConsoleIntegration` (with a one-line quota/`levels` caveat). This makes "Agent
znajduje issue `review/rate: update_failed`" true without changing the bug, and answers
the line-69 todo ("czy sentry faktycznie nam tutaj pomoże skoro leci 200?") in the text:
yes — not because Sentry auto-sees 200s, but because console capture forwards the warn.
Remove the line-69 and line-78 `[todo]` markers.

**Contract**: Prose only. The claim chain must read: handler swallows error → returns
200 to client → `console.warn` is forwarded to Sentry by `captureConsoleIntegration` →
issue `review/rate: update_failed` exists. Keep the swallowed-error definition intact
(hidden from user, visible in monitoring by deliberate opt-in).

#### 2. Tighten the MCP vs `sentry-cli` paragraph (todo line 78)

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (~lines 77-78)

**Intent**: Verify and tighten the claim that `sentry-cli` is for publishing tasks, not
issue search, and that the MCP server is the structured-issue query surface. Replace the
vague claim with the accurate scope.

**Contract**: `sentry-cli` covers `releases` / `sourcemaps` / `debug-files` / `deploys`
(no issue-search command); Sentry MCP exposes `search_issues` → `get_sentry_resource`.
Phrase as accurate, not absolute ("nie ma dedykowanej komendy do przeszukiwania issues",
not "nie służy do błędów").

#### 3. Deep Dive — add console-capture setup to the Sentry config block

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (Deep Dive "Sentry — konfiguracja i
darmowy plan", ~lines 362-390)

**Intent**: Add the `captureConsoleIntegration({ levels: ['warn','error'] })` option to
the Sentry init guidance, with the quota/signal-hygiene note and the worktree wiring as a
handoff (this is where a learner — and the author setting up the recording — sees the exact
steps). Reframe the existing Astro 6 note as **confirmed-supported** per the issue #19762
maintainer comment, not tentative.

**Contract**: Show the integration added to the `Sentry.withSentry(...)` /
`@sentry/cloudflare` init options. Snippet justified here (non-obvious API): the
`integrations: [Sentry.captureConsoleIntegration({ levels: ['warn', 'error'] })]` line in
the existing `sentry.server.config.ts` example. Keep that example's `main =
./sentry.server.config.ts` wiring — it is the maintainer-endorsed Astro 6 + Cloudflare
path (issue #19762); state support as confirmed. Note free-plan compatibility, and that
captured warns draw from the **same errors quota and Issues stream** as uncaught
client-side exceptions (5000/month free). Include an explicit warning: capturing all
warns/errors is a reasonable early / low-traffic default for maximum visibility, but it
does not scale — narrow `levels` or switch to surgical `captureException` as traffic grows.
#19753 (frontend-only Astro) is out of scope for 10xCards.

### Success Criteria

#### Automated Verification

- No `[todo]` markers remain at the former lines 69 and 78:
  `grep -n '\[todo' workbench/lessons/m3-l5/lesson-draft.md` shows neither.
- The string `captureConsoleIntegration` appears in both the Core Sentry section and the
  Deep Dive: `grep -c captureConsoleIntegration workbench/lessons/m3-l5/lesson-draft.md`
  is ≥ 2.

#### Manual Verification

- The warn→issue claim chain reads honestly; no implication that Sentry auto-captures
  console by default.
- The quota/`levels` caveat is present and framed as a real consideration, including the
  explicit warning that capturing all warns/errors suits early / low-traffic stages but
  should be narrowed (or replaced with surgical `captureException`) as traffic grows.
- MCP-vs-`sentry-cli` paragraph is accurate (no overstated absolute).
- Deep Dive snippet matches the existing `sentry.server.config.ts` example shape.

**Implementation Note**: Pause for author confirmation that the Sentry framing matches
the intended recording setup before proceeding.

---

## Phase 2: Pipeline & E2E framing

### Overview

Make the "proactive pipeline missed it" premise hold against the soon-to-exist E2E suite,
and state plainly that the rate/SRS path has zero tests and the bug was deliberately
planted. Resolves todos at draft lines 12 and 295.

### Changes Required

#### 1. Intro — reconcile with the existing E2E (todo line 12)

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (intro, ~lines 11-12)

**Intent**: Adjust the intro so it does not claim E2E is absent. Instead: the E2E suite
exists but covers the generate→save flow (the M3L4 path), not the rate/SRS path — so no
standing gate exercises `rate.ts`. Remove the line-12 `[todo]`.

**Contract**: Prose. Must stay consistent with the "Połknięte błędy" section (change #3
below) and with M3L4's actual E2E coverage (generate→review→save happy path). Do not
claim E2E "doesn't exist"; claim it "doesn't touch this path."

#### 2. Swallowed-errors section — E2E line (todo proximity, draft line 297)

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (~line 297)

**Intent**: Update the M3L4 bullet from "E2E for the full review flow doesn't exist yet"
to "E2E exists but covers a different flow (generate→save) and asserts the visible
outcome, not the rate path's persisted reschedule."

**Contract**: One bullet rewrite; keep parallel structure with the other pipeline-layer
bullets (M3L2/M3L3/M3L1).

#### 3. Zero-test + deliberate-bug framing (todo line 295)

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (~lines 294-295, and intro line 18)

**Intent**: State explicitly that (a) the rate/SRS path genuinely has zero tests — not an
oversight in the lesson's logic but because that risk's rollout phase (test-plan Risk #6
/ Phase 4) isn't built yet, and (b) the bug was deliberately injected for the lesson
(already at line 18 — cross-reference so the two statements reinforce, not repeat). Remove
the line-295 `[todo]`.

**Contract**: Prose. The zero-test claim is verified (`srs.ts` + review API untested);
frame it as "not yet implemented for every risk," not "we forgot." Tie the deliberate-bug
note to the existing line-18 sentence rather than duplicating it.

### Success Criteria

#### Automated Verification

- No `[todo]` markers remain at former lines 12 and 295:
  `grep -n '\[todo' workbench/lessons/m3-l5/lesson-draft.md` shows neither.
- The draft no longer asserts E2E is absent: `grep -ni 'e2e.*jeszcze nie istniej\|nie
  istnieją' workbench/lessons/m3-l5/lesson-draft.md` returns nothing for the review-flow
  claim.

#### Manual Verification

- Intro, the "Połknięte błędy" section, and the M3L4 bullet tell one consistent story
  about what E2E covers.
- The zero-test claim reads as "rollout not built yet," and the deliberate-bug framing is
  stated once, clearly, without redundant repetition.

**Implementation Note**: Pause for author confirmation that the E2E framing matches the
test suite they will record with.

---

## Phase 3: "Why not just read the code" beat

### Overview

Answer the objection that for this bug an agent could just read `rate.ts`. Resolves todo
at draft line 122.

### Changes Required

#### 1. Add a short reflective passage

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (near the end of "Reprodukcja
lokalna" / before "Synteza", ~lines 122-125; remove the line-122 `[todo]`)

**Intent**: Acknowledge that code-reading is fast *here*, then frame multi-source
diagnosis as the method you reach for when code-reading alone won't do: prod-only bugs,
bugs not reproducible locally, unfamiliar/large codebases, intermittent failures. Note the
evidence still earns its place even for this bug — scale (every rating), server-vs-client
isolation, and a regression signal — so the section isn't pure meta-commentary.

**Contract**: One short paragraph (3-5 sentences). Must not undercut the workflow being
taught — the framing is "the bug is a clean teaching vehicle for a transferable method,"
echoing the closing "Jeden workflow, cztery punkty wejścia" section. Place it where the
reader has just seen the evidence converge, so the reflection lands with context.

### Success Criteria

#### Automated Verification

- No `[todo]` marker remains at former line 122:
  `grep -n '\[todo' workbench/lessons/m3-l5/lesson-draft.md` shows none in that region.

#### Manual Verification

- The passage directly addresses "why not just read the code" and names the
  generalization cases.
- It reads as honest framing, not rationalization, and connects to the lesson's
  four-entry-points close.

**Implementation Note**: Pause for author confirmation on tone (must not undercut the
method).

---

## Phase 4: Reproduction-test prompt + skill references

### Overview

Give the reproduction test a concrete generating prompt and the right skill pointers.
Resolves todo at draft line 237.

### Changes Required

#### 1. Inline prompt for the integration reproduction test

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (after the test code block, ~lines
236-239; remove the line-237 `[todo]`)

**Intent**: Add a short, copyable prompt that drives an agent to generate the integration
test shown — assert the *persisted* `review_states` row advanced (not the API response),
seed a due card, rate it, re-read the row. Frame it as the debug-as-test (failing-first)
loop.

**Contract**: A fenced prompt block in Polish, consistent with how m3l2/m3l4 present
prompts. The prompt must target the persisted-state assertion (the swallowed-error tell),
not the 200 response.

#### 2. Skill references — `/10x-tdd` primary, `/10x-e2e` for e2e

**File**: `workbench/lessons/m3-l5/lesson-draft.md` (same region)

**Intent**: Point learners at `/10x-tdd` to drive the failing-test-first loop for this
integration test (the layer-correct, already-installed skill; what most learners will
use), and name `/10x-e2e` for when the reproduction is browser-level instead. Keep it to
the skills, not their internal reference files, to respect the referencesOnly discipline
and avoid M3L4 scope overlap.

**Contract**: Prose + slash-command references `/10x-tdd` and `/10x-e2e`. Do not cite
`/10x-e2e`'s `references/*.md` for the integration test. Use learner-facing command form
consistent with `10x-content-delivery.md`.

### Success Criteria

#### Automated Verification

- Zero `[todo]` markers remain in the whole file:
  `grep -c '\[todo' workbench/lessons/m3-l5/lesson-draft.md` is `0`.
- Both skills are referenced: `grep -c '/10x-tdd\|/10x-e2e'
  workbench/lessons/m3-l5/lesson-draft.md` is ≥ 2.

#### Manual Verification

- The inline prompt asserts persisted state, not the API response.
- `/10x-tdd` is clearly primary; `/10x-e2e` is scoped to the e2e layer; no pointer into
  `/10x-e2e` reference files for the integration test.

**Implementation Note**: Pause for author confirmation that the prompt matches how they
want learners to invoke the skill.

---

## Phase 5: Schema reconciliation

### Overview

Update only the `m3-l5` entry in `lessons-schema.json` to match the revised draft. No
other lesson is touched.

### Changes Required

#### 1. `owns` / `requiredFragments` — console capture + E2E framing

**File**: `workbench/lessons-schema.json` (`m3-l5` object, ~lines 3998-4240)

**Intent**: Reflect that the Sentry signal depends on `captureConsoleIntegration`
(refine the `owns` "Sentry MCP as primary production source" entry and the
`requiredFragments` Sentry/Deep-Dive items) and that E2E covers a different flow
(refine the swallowed-error `owns` entry, line 4017).

**Contract**: Edit existing array entries in place; prefer enriching wording over adding
new concepts. Keep within the `m3-l5` object.

#### 2. `sideEffectLedger` — resolve and record

**File**: `workbench/lessons-schema.json` (`m3-l5.sideEffectLedger`, ~lines 4076-4114)

**Intent**: Add a `newClaimsIntroduced` entry for "captureConsoleIntegration turns the
planted console.warn into the Sentry issue (free-plan; shares the errors quota + Issues
stream with uncaught client-side exceptions)"; update `unsupportedFacts` to (a) mark the
Sentry-on-200 concern resolved via console capture and (b) mark the Astro 6 compatibility
fact RESOLVED per issue #19762 maintainer comment (custom entry point;
`@astrojs/cloudflare` adapter path), correcting the line-4098 entry that currently cites
#19753 as open; resolve the `needsHumanDecision` entries (narrative shift confirmed;
E2E-different-flow chosen; console-capture chosen) by moving the settled decisions out of
open status; keep the `videoTextMismatches` re-cut note.

**Contract**: JSON edits within `m3-l5.sideEffectLedger` only. Must remain valid JSON.

### Success Criteria

#### Automated Verification

- Schema parses: `jq . workbench/lessons-schema.json > /dev/null` exits 0.
- `captureConsoleIntegration` referenced in the `m3-l5` entry: `jq '.. | objects |
  select(.lessonId? == "m3-l5")' workbench/lessons-schema.json | grep -c
  captureConsoleIntegration` is ≥ 1.
- Only `m3-l5` changed: `git diff --unified=0 workbench/lessons-schema.json` shows hunks
  only within the `m3-l5` object.

#### Manual Verification

- `owns` / `requiredFragments` match the revised draft's Sentry and E2E framing.
- `sideEffectLedger` open decisions are resolved; the video re-cut note remains.
- No other lesson entry was touched.

**Implementation Note**: Final phase — after this, hand off to `lesson-editor-pl` (voice
polish) then `lesson-rc-review`, per the workbench convention (editor before review).

---

## Testing Strategy

### Automated checks

- `grep -c '\[todo' workbench/lessons/m3-l5/lesson-draft.md` → `0`.
- `jq . workbench/lessons-schema.json` parses.
- Mermaid blocks unchanged — optional render via the `mermaid` skill if any diagram text
  shifts (none expected).

### Manual review

1. Read the draft end-to-end: Sentry beat, E2E framing, the "why investigate" passage,
   and the test prompt all tell one consistent story.
2. Confirm the swallowed-error definition is intact and the quota caveat is present.
3. Confirm the schema diff is scoped to `m3-l5`.

## Migration Notes

Out-of-scope follow-ups the author owns before recording:

- Wire `@sentry/astro` + `@sentry/cloudflare` into `10xcards-m3l5-debug` and enable
  `captureConsoleIntegration({ levels: ['warn','error'] })`, following the custom
  entry-point approach (`wrangler` `main` → `sentry.server.config.ts` wrapping
  `@astrojs/cloudflare/entrypoints/server`) — the maintainer-confirmed Astro 6 + Cloudflare
  path (issue #19762). The exact steps live in the draft's Deep Dive.
- Re-cut `videos/video-diagnostic-walkthrough.md` for the rate-path bug + Sentry console
  capture (already flagged in schema `videoTextMismatches`).

## References

- Lesson draft: `workbench/lessons/m3-l5/lesson-draft.md`
- Schema entry: `workbench/lessons-schema.json` (`m3-l5`, lines 3998-4240)
- Prep/grounding: `context/changes/m3l5-preps/research.md`
- Prior pattern: `context/changes/m3l4-todo-revision/`
- Structure/voice: `workbench/references/lesson-structure.md`, `workbench/references/style.md`
- Sentry console capture: https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/captureconsole/
- Skills: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/{10x-tdd,10x-e2e}/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands.
> Do not rename step titles.

### Phase 1: Sentry beat made honest

#### Automated

- [x] 1.1 No `[todo]` markers remain at former lines 69 and 78
- [x] 1.2 `captureConsoleIntegration` appears in both Core and Deep Dive (≥ 2)

#### Manual

- [ ] 1.3 warn→issue chain reads honestly; no "auto-captures console" implication
- [ ] 1.4 quota/`levels` caveat present, incl. explicit "capture-all is fine early / low-traffic, narrow as traffic grows" warning
- [ ] 1.5 MCP-vs-`sentry-cli` paragraph accurate
- [ ] 1.6 Deep Dive snippet matches existing config example shape

### Phase 2: Pipeline & E2E framing

#### Automated

- [x] 2.1 No `[todo]` markers remain at former lines 12 and 295
- [x] 2.2 Draft no longer asserts the review-flow E2E is absent

#### Manual

- [ ] 2.3 Intro, swallowed-errors section, and M3L4 bullet are consistent on E2E coverage
- [ ] 2.4 Zero-test framed as "rollout not built yet"; deliberate-bug stated once

### Phase 3: "Why not just read the code" beat

#### Automated

- [x] 3.1 No `[todo]` marker remains at former line 122

#### Manual

- [ ] 3.2 Passage addresses the objection and names the generalization cases
- [ ] 3.3 Tone is honest framing, connects to the four-entry-points close

### Phase 4: Reproduction-test prompt + skill references

#### Automated

- [x] 4.1 Zero `[todo]` markers remain in the whole file
- [x] 4.2 Both `/10x-tdd` and `/10x-e2e` referenced (≥ 2)

#### Manual

- [ ] 4.3 Inline prompt asserts persisted state, not the API response
- [ ] 4.4 `/10x-tdd` primary; `/10x-e2e` scoped to e2e; no e2e reference-file pointer for the integration test

### Phase 5: Schema reconciliation

#### Automated

- [x] 5.1 `jq . lessons-schema.json` parses
- [x] 5.2 `captureConsoleIntegration` referenced in the `m3-l5` entry
- [x] 5.3 `git diff` shows hunks only within the `m3-l5` object

#### Manual

- [ ] 5.4 `owns` / `requiredFragments` match the revised draft
- [ ] 5.5 `sideEffectLedger` open decisions resolved; video re-cut note kept
- [ ] 5.6 No other lesson entry touched
