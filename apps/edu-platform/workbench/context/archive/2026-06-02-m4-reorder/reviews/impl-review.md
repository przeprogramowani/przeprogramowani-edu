<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Module 4 Reorder — context-scaling → m4-l1

- **Plan**: context/changes/m4-reorder/plan.md
- **Scope**: All 3 phases (complete)
- **Date**: 2026-06-02
- **Verdict**: NEEDS ATTENTION
- **Findings**: 0 critical, 1 warning, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | WARNING |
| Safety & Quality | PASS (data-only — no code surface) |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | PASS (re-verified independently) |

## Findings

### F1 — Phase-1 commit absorbed pre-existing uncommitted enrichment

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Scope Discipline
- **Location**: lessons-schema.json (context lesson, commit a3c7c32d)
- **Detail**: `lessons-schema.json` was already dirty at session start (initial `git status: "M lessons-schema.json"`). That uncommitted delta populated the context lesson's `requiredFragments` (0→13) and `videoPlaceholders` (0→3) — verified empty at `0d9ebe6f`, full at `a3c7c32d`; the reorder transform never touches those fields. The Phase-1 commit staged `lessons-schema.json` wholesale, so this pre-existing enrichment rode in under a "renumber" message, contradicting the plan's "NOT rewording requiredFragments/videoPlaceholders" guardrail. The plan's Current State also wrongly assumed those arrays were populated at HEAD — it described the dirty working tree, not the committed baseline. Mechanics otherwise flawless. Commits unpushed (ahead 4). Contributing gap: success-criterion 1.5 compared pre-transform working tree vs post-transform (read "unchanged"), masking the working-tree-vs-HEAD divergence.
- **Fix A ⭐ Recommended**: Accept and document the absorbed enrichment.
  - Strength: The 13+3 items are the context lesson's OWN legit content that needed committing anyway; no rework; thematically part of the lesson being reordered.
  - Tradeoff: Commit a3c7c32d's message understates its contents; mild history impurity. Mitigated by a note in change.md.
  - Confidence: HIGH — content provenance fully traced.
  - Blind spot: Content correctness assumed (lesson author wrote these arrays).
- **Fix B**: Split history — extract enrichment into its own commit, leaving a3c7c32d structural-only.
  - Strength: Clean separation; honest commit messages.
  - Tradeoff: Interactive rebase of 4 local commits for marginal gain over WIP already in the tree.
  - Confidence: MED — rebase safe (unpushed) but non-trivial.
  - Blind spot: Haven't checked for references to a3c7c32d.
- **Decision**: FIXED via Fix A — documented in change.md "Implementation note (2026-06-02)". Enrichment accepted as legitimate context-lesson content; no history rewrite.

### F2 — plan-brief.md landed in the Phase-1 commit

- **Severity**: 📝 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious
- **Dimension**: Scope Discipline
- **Location**: context/changes/m4-reorder/plan-brief.md
- **Detail**: `plan-brief.md` was added in `a3c7c32d`. Expected and benign — a planning sidecar created this session, correctly grouped with the change-folder bootstrap files.
- **Decision**: SKIPPED — no action needed (working as intended).

## Clean-verified (no findings)

- Module 4 ladder matches Desired End State exactly (m4-l1…m4-l5; global 16–20; correct dependsOn/preparesFor); `lessons` array physically sorted.
- Boundaries slot-stable: `m3-l5.preparesFor=["m4-l1"]`, `m5-l1.dependsOn=["m4-l5"]` (unchanged).
- All non-m4 modules byte-identical between `a3c7c32d^` and HEAD; top-level keys unchanged; m4 lesson count 5→5.
- Folder moves recorded by git as renames (history preserved); `m4-l1/` = context bundle incl. `research/`, `m4-l5/` = DDD bundle, `m4-l4/` removed.
- Stale groundingSources URL repointed to `m4-l1/research/repo-case-studies.md` and resolves to a real file.
- `src/content*` and deployment untouched.
