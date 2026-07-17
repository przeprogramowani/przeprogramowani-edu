# m3-l3 Iteration — Plan Brief

> Full plan: `context/changes/m2l3-iteration/plan.md`
> Research: `context/changes/m2l3-iteration/research.md`

## What & Why

Resolve all 8 `[todo]` editorial markers in the m3-l3 lesson draft, fix the 1 pending RC review item (jq/Windows dependency), and verify cross-lesson coherence with m3-l1/l2. The highest-impact fix is rewriting the gate mapping heuristic — the current version contradicts the real 10xCards test-plan that m3-l1 teaches from, creating the only terminology inconsistency across the three-lesson arc.

## Starting Point

The m3-l3 draft is complete, has passed RC review with 3/4 items addressed, and has clean cross-lesson bridges. Eight `[todo]` comments mark the author's editorial doubts — 5 are minor (remove/rephrase), 2 need paragraph-level rewrites (gate mapping, tool-agnostic tasks), and 1 RC item (jq dependency) is outstanding.

## Desired End State

The m3-l3 draft has zero `[todo]` markers, zero pending RC items, and consistent gate terminology with m3-l1. The gate mapping section teaches a decision framework grounded in the real 10xCards example. Practical tasks work for learners on any tool. The draft is ready for `/lesson-editor-pl` → `/lesson-rc-review`.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|---|---|---|---|
| Gate mapping approach | Question-based decision + real 10xCards example | Teaches the tradeoff honestly; shows the three-layer model as a menu, not a mandate | Plan |
| Tool-agnosticism depth | Lead with principle, offer 1-2 tool examples + doc links | Matches spec ("generalizable with one concrete example each") without becoming a product comparison | Plan |
| jq dependency handling | Inline mention with cross-platform install hints (macOS/Linux/Windows) | Prevents "command not found" wall for all platforms; the real challenge is Windows users | Plan |
| "Sygnał konwergencji" fix | Restructure sentence — drop the label, let the 1Password example speak for itself | Natural Polish; the reader gets the convergence point from the example without an awkward calque | Plan |
| m3-l4 scope | Out of scope — focus on m3-l3 only | Bridges verified clean by research; no reason to touch m3-l4 | Plan |

## Scope

**In scope:**
- Remove/resolve all 8 `[todo]` markers
- Rewrite gate mapping section (lines 276-285)
- Rewrite practical tasks for tool-agnosticism (lines 293-313)
- Add jq/Windows dependency note (near line 116)
- Cross-lesson coherence verification

**Out of scope:**
- Structural changes (section order, new sections)
- Schema updates to `lessons-schema.json`
- Edits to m3-l1, m3-l2, or m3-l4
- Video scenario work
- Full editorial polish (separate `/lesson-editor-pl` pass)

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Minor TODO Resolves | 5 todo markers removed, small clarifications added | Low — each is a line-level edit with clear research backing |
| 2. Gate Mapping Rewrite | Correct gate taxonomy + decision framework + real 10xCards example | Medium — must teach the tradeoff without undermining the lesson's thesis on per-edit hooks |
| 3. Tool-Agnostic Tasks | Tasks work for Claude Code, Cursor, Codex, and beyond | Low — pattern is clear from spec; implementation is straightforward |
| 4. jq/Windows Fix | Cross-platform jq install note | Low — 2-3 sentences |
| 5. Coherence Verification | Zero todos, consistent terminology, clean bridges | Low — verification only |

**Prerequisites:** Research doc complete (done), all human decisions made during planning (done)
**Estimated effort:** ~1 session, single phase-by-phase pass through the draft

## Open Risks & Assumptions

- The gate mapping rewrite could undermine the lesson's per-edit hook advocacy if the "10xCards deferred them" message is too prominent — needs careful framing balance
- Windows jq note is best-effort; if learners use WSL, the Unix path works directly

## Success Criteria (Summary)

- `grep -c '\[todo' lessons/m3-l3/lesson-draft.md` returns `0`
- Gate terminology in m3-l3 matches m3-l1's `required / required-after-phase / deferred` scheme
- A learner on Cursor (not Claude Code) can follow the practical tasks without feeling lost
