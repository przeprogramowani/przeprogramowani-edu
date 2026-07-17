# Side-Effect Ledger — m3l4-e2e-skill-reframe

Scope: `lessons/m3-l4/lesson-draft.md` reframe + light `lessons-schema.json` `m3-l4` edit, to match the rewritten `/10x-e2e` skill (now a plan-execution skill, the E2E sibling of `/10x-implement` and `/10x-tdd`).

## New claims introduced

- `/10x-e2e` is a **plan-execution skill — the E2E sibling of `/10x-implement` and `/10x-tdd`**: reads the same `context/changes/<change-id>/plan.md`, mutates the same canonical `## Progress`, runs the same per-phase commit ritual; the inner loop is **PLAN → GENERATE → REVIEW → VERIFY**. (Grounded: toolkit `skills/10x-e2e/SKILL.md`.)
- `/10x-e2e` runs an **eligibility gate before each phase** — browser-level risk + feature already built + no passing E2E test yet — and otherwise **redirects the phase to `/10x-tdd` or `/10x-implement`** (or stops if the feature isn't built). (Grounded: `SKILL.md` §"E2E eligibility gate".)
- **Deliberate-break VERIFY** at the E2E level: after green, invert/weaken the protected production behavior, confirm the test goes red, then revert — never committed. (Grounded: `SKILL.md` VERIFY step.)
- You can **interleave** `/10x-implement`, `/10x-tdd`, and `/10x-e2e` within one plan because all three share `## Progress`. (Grounded: `SKILL.md`.)

## Claims removed

- The **inline E2E prompt template** and the **10xCards worked example** (removed from the lesson; now owned solely by the skill reference `references/e2e-prompt-template.md`).
- The **"`/10x-e2e` is the test generator"** framing and the **"two ways to use the skill" (Szablon promptu vs Planner→Generator)** framing — replaced by "two **PLAN strategies** inside one plan-execution loop."

## Neighboring lesson references changed

- **M3L2 bridge strengthened**: `/10x-e2e` is now explicitly the E2E sibling of `/10x-tdd`; the new VERIFY beat is named as the E2E lift of M3L2's "weryfikacja asercji przez celowe psucie" (m3-l2:148). The interleaving-modes example mirrors m3-l2's mixed-mode example.
- **M3L5 handoff unchanged**: vision-as-diagnostic and healer→debugging continuity intact (settled in `m3l4-todo-revision`).

## Prework references used

(none new) — existing prework refs (3.1 token budgets, 4.1 Playwright stack) untouched.

## Prework concepts repeated intentionally

(none new)

## Potential duplicates

- **m3-l2's `/10x-tdd` section vs m3-l4's `/10x-e2e` section** — an **intentional parallel** (same explanation pattern, different layer). Boundary is clear: `/10x-tdd` writes a failing unit test first against absent code; `/10x-e2e` generates + hardens a browser test against the running app. Not a content duplicate; the parallel is the point of the request.

## Unsupported facts

(none new introduced) — the reframe is structural. Pre-existing factual claims (Playwright 1.56 Test Agents, Debbie O'Brien's ~62% setup reduction, ~4× CLI/MCP token gap, healer selector-repair) are unchanged; their caveats remain tracked in the schema `sideEffectLedger.unsupportedFacts`.

## Video/text mismatches

- **V3b VIDEO PLACEHOLDER** (review of naive assertion / CSS selector / waitForTimeout) still matches the REVIEW content. The **new VERIFY (deliberate-break) beat has no video**; consider whether the demo should show the deliberate break going red.
- **Schema `videoPlaceholders` V3** ("Risk-to-E2E pipeline + seed test + review … planner→generator → review anti-wzorców") describes the old generation framing and stops at "review". It does not contradict the reframe, but a recording-time update to mention the PLAN→GENERATE→REVIEW→VERIFY loop + deliberate break would align it. Left as-is this session.

## Needs human decision

- **Render + renumber the new decision mermaid** via the `mermaid` skill (currently `<!-- rendered: TODO -->`); decide whether it supplements the four existing diagrams or replaces one. This is the only render-incomplete item.
- Whether to update schema `videoPlaceholders` V3 to mention the loop + deliberate break (deferred).
- Run `lesson-editor-pl` → `lesson-rc-review` on m3-l4 — the prior RC review is invalidated by the reframe.
