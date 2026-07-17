# Improve Webinar Skills — Plan Brief

> Full plan: `context/changes/improve-webinar-skills/plan.md`
> Research: `context/changes/improve-webinar-skills/research.md`

## What & Why

The webinar skill pipeline (planner → material → writer) produces excellent research but has three critical gaps: a hardcoded developer-only audience, zero editorial style guidance, and no structural or quality validation. These gaps block the immediate use case — a webinar for non-technical people (designers, PMs) learning Claude Code — and limit output quality for all webinars. We're importing 4 process patterns from the lesson pipeline (decision gates, style rules, argument validation, self-review) without its heavyweight data structures.

## Starting Point

Three working skills with lightweight file-based handoffs. The planner hardcodes "mid-to-senior developers" as the audience. The material skill has inline formatting rules but reads no external style guide and has no pre/post-draft validation. A completed research doc maps all gaps with concrete proposed content.

## Desired End State

The planner asks 4 structured audience/format questions before researching. A shared 14-rule style guide governs talking-point quality. The material skill validates argument structure before writing and runs a 5-dimension review after writing. The pipeline correctly produces output for non-technical audiences.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|---|---|---|---|
| Scope | All 4 improvements, skip #5 (feedback loop) | Each is independent and quick; feedback loop needs 2+ webinars to be useful. | Research / Plan |
| Style guide location | `.claude/skills/webinar-style.md` | Both planner and material skills reference it without path gymnastics; co-located with consumers. | Plan |
| BLUF integration | Fold into style rules directly | One authoritative file; BLUF examples are already in the right format for before/after rules. | Plan |
| Discovery UX | Always ask 4 questions, pre-select defaults | Consistent UX; technical-audience users accept defaults in 10 seconds; non-default users get full customization. | Plan |
| Rule count | 14-16 rules (full merge) | Comprehensive from day one; research + BLUF patterns deduplicate to ~14 natural rules across 6 categories. | Plan |
| Review placement | Inline in material skill, not a separate skill | A separate review skill adds pipeline complexity without proportional value for one-shot webinars. | Research |
| Audience propagation | Via `## Audience Profile` in research.md | Material skill already reads research.md — no new handoff mechanism needed. | Research |
| Verification approach | Dry-run on Claude Code non-tech webinar | Tests full pipeline on the actual next webinar; doubles as productive work. | Plan |

## Scope

**In scope:**
- New file: `.claude/skills/webinar-style.md` (14 rules, 6 categories, before/after examples)
- Edit: `.claude/skills/10x-webinar-planner/SKILL.md` (discovery flow + adaptive design contract + audience profile in research.md template)
- Edit: `.claude/skills/10x-webinar-material/SKILL.md` (argument map + post-draft review + style guide read)
- Dry-run verification on "Claude Code for designers/PMs" topic

**Out of scope:**
- Iterative style feedback loop (Improvement 5 — deferred until 2+ webinars done)
- Changes to the orchestrator (`10x-webinar-writer`)
- Schema JSON, ownership boundaries, side-effect ledgers
- Separate `10x-webinar-review` skill
- Changes to existing webinar output files

## Architecture / Approach

No architectural changes — the pipeline stays as 3 skills with file-based handoffs. Changes are additive: a new shared style file, new sections in existing skill definitions, and a conditional design contract in the planner. The audience profile propagates from planner to material via the existing research.md file (new section), requiring no new handoff mechanism.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Create webinar-style.md | 14-rule style guide with before/after examples | Rules may need iteration after real use; some may prove unnecessary |
| 2. Audience-adaptive discovery | 4-question discovery flow in planner + adaptive design contract | Discovery adds friction; defaults must feel effortless for the common case |
| 3. Argument flow + post-draft review | Pre-draft beat map + 5-dimension post-draft review in material skill | Review may be too verbose or catch false positives on first use |
| 4. Dry-run verification | End-to-end test on non-technical audience topic | Couples verification to a specific topic; bugs surface in real output |

**Prerequisites:** Research doc complete (done). BLUF input available (done). Access to all three skill SKILL.md files (confirmed).
**Estimated effort:** ~2 hours across 4 phases in a single session.

## Open Risks & Assumptions

- Style guide rules are seeded from research analysis, not from real post-webinar feedback — some rules may need adjustment after the first webinar produced with the new pipeline
- The discovery flow's "recommended defaults" assume the 80% case is technical mid-senior developers — if audience mix shifts, defaults may need updating
- The post-draft review's "spot-check 3 slides against style rules" is a heuristic — full compliance checking would be more expensive but may be unnecessary

## Success Criteria (Summary)

- The planner produces a correctly-framed plan when given a non-technical audience topic (designers/PMs)
- The material skill reads and applies the style guide, maps argument beats, and reports review findings
- The pipeline requires no manual workarounds to produce a non-technical webinar
