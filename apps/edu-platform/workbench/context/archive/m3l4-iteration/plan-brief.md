# M3-L4 Draft Iteration — Plan Brief

> Full plan: `context/changes/m3l4-iteration/plan.md`
> Research: `context/changes/m3l4-iteration/research.md`

## What & Why

Revise the m3-l4 lesson draft to fix a framing problem: the opening positions E2E testing as "catching visual regressions hooks can't see," but E2E's core value is testing the full integrated system (auth→API→DB→UI without mocking). The 10xCards `test-plan.md` Phase 6 confirms this — both its E2E scenarios are full-stack flow tests, not visual ones. The draft also has 8 unresolved [todo] markers and 4 open RC review items.

## Starting Point

The draft is at RC-review stage ("ready with minor fixes") with a completed editor pass. Cross-lesson bridges to m3-l1/l2/l3 are structurally sound. The main problem is conceptual: the opening hook (overlapping cards on mobile) and several passages frame E2E too narrowly as browser-UI testing.

## Desired End State

A publication-ready draft where E2E is framed as full-stack integration testing first, visual supplement second. All [todo] markers resolved and removed. 10xCards Phase 6 scenarios grounding the risk-to-E2E section. All RC review items closed (except video scenarios — deferred).

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|---|---|---|---|
| E2E opening hook | Lead with full-stack failure, demote visual | 10xCards Phase 6 has zero visual scenarios; leading with visual misrepresents E2E | Plan |
| Primary E2E examples | Use 10xCards Phase 6 scenarios | Grounds the lesson in the course's narrative project and proves test-plan.md is actionable | Plan |
| Mock expensive externals | Acknowledge with 2-3 sentences | 10xCards mocks OpenRouter at network layer — honest, practical pattern learners will use | Plan |
| Frontendless apps | 1-2 sentence note | Acknowledges API-only E2E without derailing the Playwright focus | Plan |
| m3-l3 bridge text | Fix only in m3-l4 | m3-l3's bridge isn't wrong, just incomplete; minimal blast radius | Plan |
| Video scenarios | Defer to separate change | Distinct artifact requiring own discovery; keeps this plan focused | Plan |

## Scope

**In scope:**
- Resolve all 8 [todo] markers with prose edits
- Reframe E2E opening and risk-to-E2E section
- Add 10xCards Phase 6 as concrete examples
- Close 3 RC review items (lesson count, heading, Materiały links)
- Cross-lesson coherence verification

**Out of scope:**
- Video scenario creation (V1–V4)
- m3-l3 bridge-out text changes
- lessons-schema.json updates
- New sections or structural changes

## Architecture / Approach

Single-file editorial revision (`lessons/m3-l4/lesson-draft.md`), ordered by impact: framing rewrite first (intro + risk section), scattered TODO fixes second, RC review items third, coherence read-through last.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Reframe E2E opening | Full-stack hook, Phase 6 examples, mock-externals note | Opening must still bridge from m3-l3 and land the thesis |
| 2. Resolve remaining TODOs | All 6 remaining TODOs addressed, markers removed | storageState and VLM notes must stay within mustNotCover |
| 3. Close RC review items | Lesson count, heading, Materiały links fixed | Line numbers may have shifted after Phase 1–2 edits |
| 4. Coherence verification | Side-effect ledger, bridge checks | Framing changes could drift bridges |

**Prerequisites:** Research doc complete, RC review available, 10xCards test-plan.md accessible
**Estimated effort:** ~1 session across 4 phases

## Open Risks & Assumptions

- Line numbers in the plan reference the current draft state; they will shift as edits land (implementer should search by content, not line number)
- The 10xCards Phase 6 scenarios assume the reader has context about 10xcards from the course — this is safe because 10xcards is the narrative project throughout M1–M3

## Success Criteria (Summary)

- All 8 [todo] markers resolved and removed from draft
- E2E framing leads with full-stack integration, visual is supplement
- Cross-lesson bridges to m3-l1/l2/l3/l5 verified intact after edits
