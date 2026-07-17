# M3-L4 Draft Iteration — Implementation Plan

## Overview

Revise the m3-l4 lesson draft (`lessons/m3-l4/lesson-draft.md`) to resolve all 8 [todo] markers, close 4 RC review items, align the E2E framing with the real 10xCards `test-plan.md` Phase 6, and verify cross-lesson coherence with m3-l1 through m3-l3. Video scenarios are deferred to a separate change.

## Current State Analysis

The draft is at RC-review stage ("ready with minor fixes"). The editor pass is complete. The dominant issue is a **framing problem**: the opening and thesis position E2E testing primarily as "what hooks can't see in the browser" (visual regression), but E2E's core value is testing the full integrated system. The 10xCards `test-plan.md` Phase 6 confirms this — its two E2E scenarios test full-stack user flows (generate→save, auth-gate roundtrip), not visual layout.

### Key Discoveries:

- 8 [todo] markers in draft: 1 HIGH (E2E framing), 3 MEDIUM (frontendless apps, storageState scope, VLM connection), 4 LOW (accessibility tree nuance, CLI origin, token numbers, Deep Dive fixtures)
- Cross-lesson bridges are structurally sound — only m3-l3→l4 framing is slightly narrow (visual-only), but we fix only in m3-l4 per user decision
- RC review has 4 open items: ambiguous "cztery lekcje", unpolonized "risk map" heading, missing Materiały links, video scenarios (deferred)
- 10xCards test-plan.md Phase 6 has two concrete E2E scenarios ready to use as primary examples
- test-plan.md explicitly excludes visual testing (§7) and mocks OpenRouter at network layer — both contradict the draft's pure framing

## Desired End State

A publication-ready m3-l4 draft with:
- All [todo] markers resolved and removed
- E2E framed as full-stack integration testing first, visual supplement second
- 10xCards Phase 6 scenarios used as concrete examples in the risk-to-E2E section
- "Mock expensive externals" pattern acknowledged
- All RC review items closed (except video scenarios — deferred)
- Cross-lesson coherence verified against latest m3-l1/l2/l3 drafts

Verification: re-run the RC review checklist mentally against the revised draft. All acceptance checklist items should be checkable.

## What We're NOT Doing

- Creating video scenarios (V1–V4) — deferred to separate change
- Modifying m3-l3's bridge-out text — m3-l3's framing isn't wrong, just incomplete; m3-l4's opening handles the widening
- Changing lesson structure, section order, or adding new major sections
- Updating `lessons-schema.json` — no schema-level changes needed
- Rewriting the entire draft — surgical edits to specific passages

## Implementation Approach

Phase-by-phase editorial revision, ordered by impact. Phase 1 tackles the highest-impact framing rewrite (intro + risk-to-E2E section). Phase 2 resolves scattered TODOs. Phase 3 closes RC review items. Phase 4 is a read-through coherence check.

All changes are in a single file (`lessons/m3-l4/lesson-draft.md`). No code, no config, no schema changes.

## Phase 1: Reframe E2E Opening and Risk-to-E2E Section

### Overview

Rewrite the lesson opening to lead with full-stack integration failure as the primary E2E motivation. Use 10xCards Phase 6 scenarios as concrete examples. Add "mock expensive externals" acknowledgment and frontendless-apps note. Remove TODO-1, TODO-6.

### Changes Required:

#### 1. Rewrite lesson opening (lines 1–12)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Replace the visual-only hook with a full-stack integration failure as the primary E2E motivation. The overlapping cards example moves to a secondary mention (and later serves the vision-mode section naturally). The key insight: hooks can't catch problems that cross system boundaries (auth→API→DB) — not just visual problems.

**Contract**: Lines 1–12, including TODO-1. The opening must still bridge from m3-l3 (hooks operate on source code) and must still land the thesis (seed test + rules + review). The new hook should reference a full-stack failure recognizable to 10xCards users (e.g., data not surviving a page refresh because auth→API→DB lost something). Remove the [todo] marker at line 12.

#### 2. Add frontendless-apps note (near line 125)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Acknowledge that E2E can mean API scenarios (request→routing→logic→DB) for apps without a frontend. The lesson's Playwright focus is browser-based, but the quality controls (seed test, rules, review) apply regardless of interaction layer.

**Contract**: 1–2 sentences after the current line 124 ("nie generujesz testów E2E od zera"). Remove the [todo] marker at line 125.

#### 3. Use 10xCards Phase 6 as concrete E2E examples (lines 116–153)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Ground the risk-to-E2E section in the real 10xCards `test-plan.md` Phase 6 scenarios. Show the generate→save scenario (full-stack: OpenRouter→API→DB→SSR) and the auth-gate roundtrip (middleware→cookie bridge→redirect) as the worked examples when explaining how to pick risks and feed them to the planner.

**Contract**: The section starting at "## Od ryzyk do testów E2E" (line 116) through the planner/generator/healer workflow (line 153). The existing generic "utrata fiszek po odświeżeniu strony" example (line 153) should be replaced or strengthened with the Phase 6 scenarios. The mermaid diagram (lines 142–151) can stay — it's structural, not content-specific.

#### 4. Acknowledge "mock expensive externals" pattern (near line 122)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Add 2–3 sentences acknowledging that E2E keeps internal boundaries real but may mock expensive/non-deterministic externals (LLM APIs, payment gateways) at the network layer. 10xCards Phase 6 does exactly this with OpenRouter.

**Contract**: Near the heuristic at line 122 ("jeśli ryzyko przechodzi przez wiele granic systemu..."). The note should feel natural, not like a disclaimer. It's a pragmatic pattern, not an exception.

### Success Criteria:

#### Automated Verification:

- Draft has no [todo] markers on lines 1–153

#### Manual Verification:

- Opening leads with a full-stack failure hook, not visual-only
- 10xCards Phase 6 scenarios are used as concrete examples
- "Mock expensive externals" pattern is acknowledged naturally
- Frontendless-apps note present and non-disruptive
- Bridge from m3-l3 still works (hooks operate on source code)
- Thesis still lands (seed test + rules + review)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Resolve Remaining TODOs

### Overview

Address TODO-2 through TODO-5, TODO-7, and TODO-8. Remove all [todo] markers from the draft.

### Changes Required:

#### 1. TODO-2 (line 19): Soften accessibility tree statement

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Add "Domyślnie" to the accessibility tree statement and optionally a forward reference to vision mode. The current text is accurate for default mode but reads as absolute.

**Contract**: Line 18–19. Change "Agent nie patrzy na piksele. Patrzy na drzewo dostępności." to something like "Agent domyślnie nie patrzy na piksele — patrzy na drzewo dostępności." Add optional forward reference ("za chwilę zobaczysz, kiedy piksele stają się potrzebne"). Remove [todo] at line 19.

#### 2. TODO-3 (line 42): Soften CLI origin claim

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Soften "narzędzie zaprojektowane specjalnie dla agentów kodujących" to something more accurately grounded in the docs, e.g., "narzędzie zoptymalizowane pod kątem agentów kodujących" or attributed to docs.

**Contract**: Line 41. Remove [todo] at line 42.

#### 3. TODO-4 (line 67): Remove resolved token numbers TODO

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: The current hedging ("około", "czterokrotna oszczędność") is sufficient. Remove the [todo] marker. Optionally add "(na podstawie benchmarków społeczności)" for transparency.

**Contract**: Line 67. Remove [todo] only — the prose is already appropriately hedged.

#### 4. TODO-5 (line 84): Frame storageState generically + add links

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Frame the storageState principle generically first ("most E2E frameworks let you save session state and inject it into subsequent runs"), then show the Playwright implementation. Add inline link to Playwright auth docs. Add Context7 encouragement note.

**Contract**: Lines 81–114 (storageState section). The Playwright code examples stay — we're adding context, not removing implementation. Remove [todo] at line 84.

#### 5. TODO-7 (line 331): Add VLM model connection guidance

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Add 2–3 sentences explaining how VLM models connect to Playwright vision mode operationally. The agent tool's configured model is used by default. For alternative models, configure through API provider or run locally.

**Contract**: After line 333 (model categories list). Remove [todo] at line 331. Must stay within mustNotCover boundaries (no model comparison, no cost optimization).

#### 6. TODO-8 (line 474): Add minimal fixtures example in Deep Dive

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Add a minimal before/after example (POM class vs fixture function, ~5–8 lines each) showing the practical difference. Note that the seed test pattern from core already pushes the agent toward fixtures.

**Contract**: After line 474 in the Composable Fixtures Deep Dive section. Remove [todo] at line 474.

### Success Criteria:

#### Automated Verification:

- `grep -c '\[todo' lessons/m3-l4/lesson-draft.md` returns 0

#### Manual Verification:

- Each TODO resolution reads naturally and doesn't break surrounding prose flow
- No new claims introduced without grounding support
- storageState section works for both Playwright and non-Playwright users conceptually
- VLM connection guidance is operational but not a tutorial
- Deep Dive fixtures example is minimal and illustrative

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Close RC Review Items

### Overview

Fix the 3 actionable RC review items (the 4th — video scenarios — is deferred).

### Changes Required:

#### 1. Fix ambiguous lesson count (line 339)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Remove ambiguity about whether "cztery lekcje" includes the current lesson.

**Contract**: Line 339. Change "W tym module zbudowaliśmy warstwowy system jakości:" — the RC review's recommended wording, which sidesteps the count entirely.

#### 2. Polonize "risk map" heading (line 390)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Make task heading consistent with the H2 which uses Polish "ryzyk."

**Contract**: Line 390. Change `### Scenariusze E2E z mapy ryzyk` — already in Polish. Verify it matches. (Note: RC review says line 382, but the current draft has it at line 390 after prior edits.)

#### 3. Add grounding sources to Materiały dodatkowe (lines 511–528)

**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Add the 2 learner-useful sources that support claims used in the lesson body but are missing from Materiały dodatkowe.

**Contract**: Add to the Materiały dodatkowe section (after line 524, before the prework references):
- BrowserStack waitForTimeout article — before/after examples for replacing hardcoded waits
- QA Wolf parallelization article — unique identifiers and cleanup patterns

### Success Criteria:

#### Automated Verification:

- `grep -c 'risk map' lessons/m3-l4/lesson-draft.md` returns 0 (no unpolonized "risk map" headings)
- `grep -c 'browserstack\|qawolf' lessons/m3-l4/lesson-draft.md` returns at least 1 each (new Materiały links present)

#### Manual Verification:

- Lesson count phrasing is unambiguous
- Heading terminology is internally consistent
- Materiały dodatkowe links are well-positioned and have helpful annotations

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Coherence Verification

### Overview

Read through the revised draft and verify cross-lesson coherence against m3-l1, m3-l2, m3-l3. Produce a brief coherence report.

### Changes Required:

#### 1. Cross-lesson bridge verification

**File**: `lessons/m3-l4/lesson-draft.md` (read-only unless issues found)

**Intent**: Verify that all cross-lesson references are still accurate after the Phase 1–3 edits. Check bridges in, bridges out, and terminology consistency.

**Contract**: Check these specific references:
- m3-l1 bridge: `context/foundation/test-plan.md` references (lines ~120, 124, 126, 169, 233, 393, 396)
- m3-l2 bridge: prompt-template → seed test reference (line ~150), anti-pattern extension (line ~222)
- m3-l3 bridge: opening hook (lines 1–9)
- m3-l5 bridge: healer→debugging (lines ~345–355)
- Pipeline diagram consistency with m3-l3's 4-layer diagram

#### 2. Side-effect ledger

**File**: `context/changes/m3l4-iteration/plan.md` (this file — append at review time)

**Intent**: Document what changed for curriculum tracking.

**Contract**: Produce a side-effect ledger covering new claims introduced, claims removed, neighboring lesson references changed, unsupported facts, and needs-human-decision items.

### Success Criteria:

#### Automated Verification:

- All `test-plan.md` references use consistent terminology (not "testing-guide.md")

#### Manual Verification:

- Bridges in/out still work after framing changes
- No scope drift into mustNotCover territory
- No prework concepts repeated as filler
- Pipeline diagram is consistent with m3-l3
- Side-effect ledger is complete and accurate

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Manual Review Steps:

1. Read the revised opening — does it land the full-stack E2E motivation before the thesis?
2. Check 10xCards Phase 6 examples — do they ground the risk-to-E2E section concretely?
3. Grep for `[todo` — should return 0 hits
4. Read the storageState section — does it work conceptually for non-Playwright users?
5. Read the VLM connection note — is it operational without being a tutorial?
6. Check Materiały dodatkowe — are the new links well-annotated?
7. Read bridges in/out — do they still connect cleanly to m3-l1/l2/l3/l5?

## References

- Research: `context/changes/m3l4-iteration/research.md`
- RC review: `lessons/m3-l4/rc-review.md`
- 10xCards test-plan: `/Users/admin/code/10xCards/context/foundation/test-plan.md`
- Lesson spec: `lessons/m3-l4/lesson-spec.md`
- Lesson grounding: `lessons/m3-l4/lesson-grounding.md`
- Neighboring drafts: `lessons/m3-l1/lesson-draft.md`, `lessons/m3-l2/lesson-draft.md`, `lessons/m3-l3/lesson-draft.md`

## Progress

### Phase 1: Reframe E2E Opening and Risk-to-E2E Section

#### Automated

- [x] 1.1 Draft has no [todo] markers on lines 1–153 — 5971c3a5

#### Manual

- [x] 1.2 Opening leads with full-stack failure hook, not visual-only — 5971c3a5
- [x] 1.3 10xCards Phase 6 scenarios used as concrete examples — 5971c3a5
- [x] 1.4 "Mock expensive externals" pattern acknowledged — 5971c3a5
- [x] 1.5 Frontendless-apps note present — 5971c3a5
- [x] 1.6 Bridge from m3-l3 and thesis still work — 5971c3a5

### Phase 2: Resolve Remaining TODOs

#### Automated

- [x] 2.1 `grep -c '\[todo' lessons/m3-l4/lesson-draft.md` returns 0 — 5971c3a5

#### Manual

- [x] 2.2 Each TODO resolution reads naturally — 5971c3a5
- [x] 2.3 No new ungrounded claims introduced — 5971c3a5
- [x] 2.4 storageState section works conceptually for non-Playwright users — 5971c3a5
- [x] 2.5 VLM connection guidance is operational but not tutorial-level — 5971c3a5
- [x] 2.6 Deep Dive fixtures example is minimal and illustrative — 5971c3a5

### Phase 3: Close RC Review Items

#### Automated

- [x] 3.1 No unpolonized "risk map" headings remain — 5971c3a5
- [x] 3.2 BrowserStack and QA Wolf links present in Materiały dodatkowe — 5971c3a5

#### Manual

- [x] 3.3 Lesson count phrasing is unambiguous — 5971c3a5
- [x] 3.4 Heading terminology is internally consistent — 5971c3a5
- [x] 3.5 New Materiały links are well-positioned — 5971c3a5

### Phase 4: Coherence Verification

#### Automated

- [x] 4.1 All test-plan.md references use consistent terminology — 5971c3a5

#### Manual

- [x] 4.2 Bridges in/out still work after framing changes — 5971c3a5
- [x] 4.3 No scope drift into mustNotCover territory — 5971c3a5
- [x] 4.4 Pipeline diagram consistent with m3-l3 — 5971c3a5
- [x] 4.5 Side-effect ledger complete and accurate — 5971c3a5

## Side-Effect Ledger

New claims introduced:
- Full-stack integration failure (auth→API→DB data loss) as primary E2E motivation (replaces visual-only hook)
- "E2E nie oznacza zero mockowania" — internal boundaries real, expensive externals mockable at network layer
- 10xCards OpenRouter mocked at HTTP layer in E2E (concrete example from test-plan.md Phase 6)
- 10xCards Phase 6 scenarios (generate→save, auth-gate roundtrip) as worked E2E examples
- API-only E2E valid for frontendless apps (request→routing→logika→baza)
- VLM connection: agent's configured model by default; alternatives via API provider or local
- POM vs fixtures concrete code comparison (Deep Dive)
- Token numbers attributed to "benchmarki społeczności"

Claims removed:
- "zaprojektowane specjalnie dla agentów kodujących" → softened to "zoptymalizowane pod kątem"

Neighboring lesson references changed:
- (none) — all bridges verified as consistent with m3-l1, m3-l2, m3-l3, m3-l5

Prework references used:
- [3.1] token budgets, [3.5] model recommendations, [4.1] Playwright in stack (all already present, unchanged)

Prework concepts repeated intentionally:
- (none)

Potential duplicates:
- (none new)

Unsupported facts:
- (none remaining — token numbers now attributed; CLI claim softened)

Video/text mismatches:
- (none — video scenarios deferred to separate change)

Needs human decision:
- (none remaining)
