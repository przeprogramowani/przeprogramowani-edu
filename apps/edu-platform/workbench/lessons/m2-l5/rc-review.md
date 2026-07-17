# RC Review: m2-l5 — Innovate: Więcej ficzerów, mniej czekania

## Verdict

**Ready with minor fixes**

The draft is structurally sound, voice is publication-grade, and the argument architecture follows a clean learner decision path. No blockers. Two major findings relate to stale supporting artifacts (video p2 scenario, spec "Required Example" section) that need human decision before production handoff but do not block the draft text itself.

## Findings

### Major: Video scenario p2 is fully stale

- Evidence: `videos/p2-ci-review-archive.md` is a 6-segment, 10-14 minute scenario entirely about `/10x-impl-review-ci` and `/10x-archive` — both removed from the draft per lesson-todo.md.
- Why it matters: Video scenario contradicts the current lesson direction. If recorded as-is, the video would teach content the lesson text explicitly omits.
- Required fix: Replace p2 with a new scenario (e.g., multi-session tools overview matching the new draft section) or delete and consolidate into p1/p3. Human decision needed on video count and format.
- Source check: `lesson-todo.md` line 1 ("Nie chcemy w tej lekcji wprowadzać /impl-review-ci"), line 9 ("archive zostało już zaprezentowane").

### Major: Spec "Required Example Or Demo" is stale

- Evidence: `lesson-spec.md` lines 89 ("uruchamia `/10x-auto-implement`… pokazuje `/10x-impl-review-ci`… archiwuje oba przez `/10x-archive`, sprawdza `/10x-status`").
- Why it matters: A future contributor reading the spec would expect CI review and archive in the lesson. Creates confusion between spec and draft.
- Required fix: Update the "Required Example Or Demo" section to reflect the current draft: guided parallel run with `/goal` and headless `claude -p`, multi-session tools overview, quality pain bridge. Remove all `/10x-impl-review-ci`, `/10x-archive`, `/10x-status` references.
- Source check: internal spec vs. draft comparison.

### Minor: Spec side-effect ledger partially stale

- Evidence: `lesson-spec.md` lines 228-251 still reference "CI review jako automated pre-scan" in new claims, "`/10x-archive` vs m2-l1 change folder" in potential duplicates, and "CI review vs m2-l3 interactive review" in potential duplicates.
- Why it matters: Stale ledger entries could mislead future editorial reviews.
- Required fix: Remove CI review and archive references from the side-effect ledger. Add new claims about Ralph Wiggum loop and multi-session tools ecosystem.
- Source check: internal consistency.

### Minor: Grounding doc references CI review extensively

- Evidence: `lesson-grounding.md` contains strong-source entries for `/10x-impl-review-ci` skill, Claude Code GitHub Actions, and GitHub Actions permissions — all removed from the draft.
- Why it matters: Not learner-facing, so not a blocker. But a stale grounding doc can mislead future editorial work.
- Required fix: Add a note at the top of grounding that CI review and archive sources are retained for historical reference but no longer active in the draft. Optionally add grounding entries for Superset, Conductor, Antigravity, and Ralph Wiggum loop.
- Source check: internal consistency.

### Minor: Missing Materiały dodatkowe closing entry

- Evidence: The previous draft version had a closing sentence after the link list ("Z praktycznego punktu widzenia najważniejszy wniosek..."). The current version ends abruptly after the last link.
- Why it matters: Style guide suggests a closing practical sentence, and the previous version had one.
- Required fix: Optional — add a 1-sentence practical closing or leave as-is (the link list is self-contained).
- Source check: style preference.

### Note: Video p1 cross-references stale p2 content

- Evidence: `videos/p1-parallel-run.md` line 16: "Wideo NIE wchodzi w CI review, archive ani status — to tematy p2 i p3."
- Why it matters: Minor — p1 is otherwise aligned with the draft. The cross-reference to p2 topics is informational only but will need updating when p2 is rewritten.
- Required fix: Update when p2 scenario is rewritten.

### Note: Canonical section `## 🧑🏻‍💻 Zadania praktyczne` absent

- Evidence: Per `workbench/references/lesson-structure.md`, canonical order includes this section. The draft embeds the challenge checklist directly in Core under "### Twoja pierwsza równoległa sesja".
- Why it matters: This may be intentional for the hybrid Innovate format. No other Innovate lesson reference to compare.
- Required fix: Human decision — either add the canonical heading or confirm this format is correct for Innovate lessons.

## Spec Compliance

- Thesis: **Pass** — "skalujesz cykl, nie chaos" + review capacity bottleneck clearly present.
- Learning outcomes:
  - Parallel workflow with worktrees: **Pass** (Core section "Worktree to osobny pas ruchu")
  - Two execution modes: **Pass** (Core section "Dwa tryby: rozmowa albo delegowanie")
  - Ralph Wiggum loop as universal pattern: **Pass** (Core section "Wzorzec delegowania celu")
  - Multi-session tools ecosystem: **Pass** (Core section "Wiele sesji, jedno biurko")
  - Quality pain bridge: **Pass** (end of "Twoja pierwsza równoległa sesja")
- Behavioral change: **Pass** — checklist embodies the target behavior.
- Required example/demo: **Stale spec** — spec still says `/10x-auto-implement` + CI review + archive; draft correctly uses `/goal` + headless + Ralph Wiggum.
- Failure mode: **Pass** — over-parallelization addressed in Deep Dive with heuristic.
- Bridge in: **Pass** — opens with "pełny cykl jednej zmiany" from m2-l3.
- Bridge out: **Pass** — quality pain bridge to M3 is explicit and organic.

## Grounding And External Checks

- Verified claims:
  - `/goal` mechanics (ewaluator, headless mode): consistent with Claude Code docs and grounding
  - `git worktree add` behavior: consistent with official Git docs
  - `claude -p` print mode: consistent with Anthropic CLI reference
  - Ralph Wiggum loop (Stop hook, completion promise): verified against local plugin README
- Unsupported or softened claims:
  - (none — tool descriptions in "Wiele sesji" are framed as survey, not factual claims)
- Open verification:
  - Superset URL (https://superset.sh/) — product page stability uncertain
  - Conductor.build URL — product page stability uncertain
  - Antigravity Google blog URL — may change with product updates
  - VS Code Agents window docs URL — preview feature, URL may change

## Curriculum Continuity

- Previous lesson fit: m2-l3 ends with "AI review jako wsparcie, nie zastępstwo" and forward reference to quality automation in CI/CD. m2-l5 picks up naturally with "co z resztą roadmapy?" Good bridge.
- Next lesson setup: Quality pain bridge ("skąd wiem, że to naprawdę działa?") directly sets up m3-l1 (test planning). Clean handoff.
- Potential duplicates: Worktrees overlap with prework [2.4] is clearly operationalized, not repeated. Multi-session tools could overlap with prework [2.4] Agent-Native IDE section but the focus is different (orchestration vs. concept introduction).
- Scope theft risk: None detected. CI review correctly removed (m2-l3 mustNotCover already stated it belongs in M3 pipeline). Archive/status not repeated.

## Editorial Quality

- Style guide fit: Good. Bridge opening, punchy "Nadal ty.", casual asides ("Zgadnij kto.", "Serio, nie zaczynaj.", "Żadnej magii."), short paragraphs, no code in intro.
- AI-sounding patterns: None detected in current version. Two editor passes cleaned the prose effectively.
- Polish/prose issues: Clean. No remaining Polglish or awkward half-translated phrases detected.

## Diagram Quality

- Diagrams present: 2 (roadmap flow, worktree isolation)
- Placement: Both appear next to the claims they visualize. Roadmap diagram follows the slice selection table. Worktree diagram follows the `git worktree add` commands.
- Missing opportunities: None — the lesson's remaining flows (goal execution, ralph wiggum loop) are sequential and well-served by code blocks.
- Decorative or redundant: None.
- Syntax/rendering: Valid mermaid syntax. Both use `flowchart` with clear node labels.

## Video Alignment

- **p1 (Guided parallel run):** Mostly aligned with draft. Uses `/goal` and headless `claude -p`. Cross-reference to p2 stale topics is a minor issue.
- **p2 (CI review + archive):** **Fully stale.** Entire scenario covers removed content. Must be rewritten or replaced.
- **p3 (Quality pain bridge):** Partially stale. References `/10x-status` and 3 archived changes, but the core message ("szybciej shipuję, ale skąd wiem, że to działa?") still works. Needs light update to remove `/10x-status` dependency.

## Side-Effect Ledger

New claims introduced:
- Ralph Wiggum loop as universal autonomous loop pattern (Stop hook, completion promise, while-true)
- Multi-session tools ecosystem (Superset, Conductor, Antigravity, Agent View) as orchestration options
- Two execution modes (interactive vs. goal-directed) as a deliberate choice based on plan maturity

Claims removed:
- `/10x-impl-review-ci` as automated PR review
- `/10x-archive` as lifecycle closure
- `/10x-status` as dashboard

Neighboring lesson references changed:
- m2-l3 bridge in unchanged
- m3-l1 bridge out: quality pain framing unchanged but no longer goes through archive/status

Prework references used:
- [2.4] worktrees and parallel work — operationalized
- [3.3] Isolate strategy — referenced organically

Prework concepts repeated intentionally:
(none)

Potential duplicates:
- Multi-session tools vs prework [2.4] Agent-Native IDE — different focus (orchestration vs. concept), acceptable

Unsupported facts:
- Product URLs for Superset, Conductor, Antigravity, VS Code Agents may change

Video/text mismatches:
- p2 scenario is entirely stale (CI review + archive content removed from lesson)
- p3 references `/10x-status` which is no longer in the lesson

Needs human decision:
- Video p2: rewrite to cover multi-session tools, or merge content into p1/p3 and reduce to 2 videos?
- Canonical `## 🧑🏻‍💻 Zadania praktyczne` heading: add or confirm Innovate format skips it?
- S-04 / S-05 demo readiness (unchanged from previous reviews)

## Acceptance Checklist

- [x] Spec compliance blockers resolved (no blockers found)
- [x] Unsupported factual claims resolved or removed (tool descriptions framed as survey)
- [x] Neighboring lesson drift resolved (CI review correctly removed per m2-l3 mustNotCover)
- [x] Editorial polish accepted (two editor passes, voice is publication-grade)
- [ ] Video scenario aligned or explicitly deferred — **p2 needs rewrite, p3 needs light update**
- [ ] Spec "Required Example Or Demo" stale section updated
- [ ] Spec side-effect ledger updated
