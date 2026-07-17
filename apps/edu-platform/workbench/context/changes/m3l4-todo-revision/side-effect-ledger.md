# Side-Effect Ledger — m3l4-todo-revision

Scope: resolving the 10 `[todo]` comments in `lessons/m3-l4/lesson-draft.md`, the
M3L4→M3L5 vision boundary move, the `/10x-e2e` skill delivery change, and the
matching `lessons-schema.json` updates.

## New claims introduced

- **(M3L5)** Vision-based visual diagnosis as a supplementary local-reproduction
  signal for UI-only bugs (screenshot + VLM, open question "co tu jest nie tak?").
  Diagnostic use, subordinate to Sentry + Playwright console/network. Grounded by
  the Zak El Fassi VLM Visual Testing practitioner signal + M3L4's existing
  vision grounding.
- **(M3L5)** VLM model categories (frontier / budget / open-weight), per-screenshot
  cost/latency, and vision limits (coordinate drift toward viewport center,
  hallucinations — false alarm vs false negative). Moved verbatim-in-spirit from
  M3L4; framed category-over-exact-name with a refresh note.
- **(Toolkit)** `/10x-e2e` skill is the single source of truth for the E2E
  generation workflow (risk → seed + rules → generate → review 5 anti-patterns →
  re-prompt → verify).

## Claims removed

- **(M3L4)** VLM model categories/selection, per-screenshot cost (~$0.01 / 2–3s),
  model-refresh cadence, and the "czy ten układ wygląda poprawnie?" testing
  framing — removed from M3L4 (moved to M3L5). This also resolved a pre-existing
  M3L4 `mustNotCover` violation ("VLM model comparison, benchmarking, or cost
  optimization") that the draft was breaching.
- **(M3L4)** Full inline E2E rules block + 2 of 3 verbatim re-prompt blocks —
  removed from lesson prose; now delivered via the `/10x-e2e` skill references.
- **(Toolkit)** `m3l4-e2e-prompt` standalone prompt — deleted, absorbed into
  `skills/10x-e2e/references/e2e-prompt-template.md`. `CLAUDE-m3l4` shrank from
  ~84 lines to a thin pointer.

## Neighboring lesson references changed

- **M3L4 ↔ M3L5 vision cross-link** added both ways. M3L4 hands the vision-model
  material to M3L5 ("Wracamy do niego w M3L5…"); M3L5's new section back-references
  M3L4's testing use and the deterministic-tools boundary. Schema `referencesOnly`
  / `mustNotCover` updated on both slots (Phase 1).
- **M3L4 → `/10x-e2e`**: the lesson now references the skill as the canonical E2E
  artifact instead of inlining rules; `lesson-04.ts` manifest rewired
  (skills += `10x-e2e`, prompt dropped, summary updated).

## Prework references used

- (none new) — M3L4's existing prework refs (3.1 token budgets, 4.1 Playwright in
  stack) unchanged.

## Prework concepts repeated intentionally

- (none new)

## Potential duplicates

- M3L4 vision supplement vs M3L5 vision-as-diagnostic — boundary is explicit and
  cross-referenced: M3L4 = narrow, known assertion in *tests* (DOM-first,
  deterministic pixel tools); M3L5 = open diagnostic question during *reproduction*.
  No content overlap.

## Unsupported facts

- Per-screenshot VLM cost (~fraction of a cent, few seconds) and local-model
  latency are directional, from a single practitioner report (Zak El Fassi,
  Holo3 model). Stated category-level in M3L5, not as exact numbers.
- VLM spatial bias (coordinate drift toward viewport center) — single practitioner
  report, reproducibility unverified. Carried over from M3L4's grounding notes.

## Video/text mismatches

- **(M3L4)** V3b VIDEO PLACEHOLDER (re-prompt review) still demos three
  anti-pattern fixes live (hallucinated assertion, CSS selector, `waitForTimeout`),
  while the slimmed text now shows one inline re-prompt example and points the
  other two at the `/10x-e2e` anti-pattern reference. Not contradictory, but the
  video covers more than the text — confirm during the video pass.
- **(M3L4)** V4 vision placeholder sits against a lightened vision section; any
  model-selection content it might have implied now lives in M3L5. Re-check on
  re-cut.
- **(M3L5)** The existing video scenario (`videos/video-diagnostic-walkthrough.md`)
  has no beat for the new vision-as-diagnostic section. If the M3L5 video should
  cover it, add a beat. (Schema already flags the M3L5 video demos the retired
  bug and needs a re-cut.)

## Needs human decision

- **M3L5 has 6 pre-existing `[todo]` markers** (lines 12, 69, 78, 122, 216, 274)
  intentionally left for a separate session per the author. They must be resolved
  before M3L5 RC. Phase 5 check 5.2 reports them as remaining — expected, not a
  regression introduced by this change. **M3L4 is fully `[todo]`-free.**
- Author made concurrent intro edits to both `m3-l4` and `m3-l5` drafts during this
  change (committed alongside the planned edits); review them in the editorial pass.
- Whether the M3L5 vision section warrants its own video beat / re-cut.
