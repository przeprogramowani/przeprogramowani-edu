<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Brownfield Support for M1 Lessons

- **Plan**: context/changes/prd-for-brownfields/plan.md
- **Scope**: All 9 Phases (full plan review)
- **Date**: 2026-05-09
- **Verdict**: NEEDS ATTENTION
- **Findings**: 0 critical, 3 warnings, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | PASS |
| Safety & Quality | WARNING |
| Architecture | PASS |
| Pattern Consistency | WARNING |
| Success Criteria | PASS |

## Findings

### F1 — health-check SKILL.md contains course-specific lesson IDs

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: ~/code/10x-toolkit/packages/ai-artifacts/skills/10x-health-check/SKILL.md:248,261,294,316-321,372
- **Detail**: The SKILL.md and health-check-schema.md hardcoded course lesson IDs (m1-l4, m1-l5) in content that flows into shipped artifacts. This contradicted guardrail #9: "Universal language only."
- **Fix A ⭐ Recommended**: Make course references conditional — use generic descriptions by default, provide course-chain mapping note with proper lesson titles, tags, and links.
  - Strength: standalone-vs-course distinction already existed; wrapping refs in a course-chain condition satisfies the guardrail while keeping pedagogical value.
  - Tradeoff: Adds conditional complexity to output template.
  - Confidence: HIGH — standalone mode already documented.
  - Blind spot: None significant.
- **Decision**: FIXED via Fix A — replaced all hardcoded lesson IDs with generic descriptions; added course-chain mapping note with proper lesson titles and platform links.

### F2 — prd-schema.md header says "11 sections" after adding 12 brownfield

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: ~/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/references/prd-schema.md:7
- **Detail**: Line 7 read "PRD frontmatter + 11 required sections" but the document now defines both 11 greenfield and 12 brownfield sections.
- **Fix**: Update to "PRD frontmatter + required sections (11 greenfield / 12 brownfield)".
- **Decision**: FIXED — header updated to reflect both section counts.

### F3 — m1-l3 draft missing dual CTA pattern

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: workbench/lessons/m1-l3/lesson-draft.md
- **Detail**: m1-l1 and m1-l2 both had explicit dual CTAs ("Greenfield: run X / Brownfield: run Y"). m1-l3 ended with tool surface overview and bridge-out but no actionable dual CTA.
- **Fix**: Add dual CTA block matching the m1-l1/m1-l2 pattern.
- **Decision**: FIXED — added "Zadanie do wykonania" section with Greenfield/Brownfield CTAs before Materiały dodatkowe.

### F4 — m1-l2 schema status is "planned" despite having a full draft

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: workbench/lessons-schema.json (m1-l2 entry, line 253)
- **Detail**: m1-l1 status was "drafted", m1-l3 status was "drafted", but m1-l2 was still "planned" despite having a full 295-line lesson-draft.md.
- **Fix**: Update m1-l2 status to "drafted".
- **Decision**: FIXED — status updated to "drafted".
