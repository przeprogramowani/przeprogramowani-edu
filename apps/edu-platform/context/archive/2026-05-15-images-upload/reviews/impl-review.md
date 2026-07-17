<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Lesson-Assets Upload Pipeline

- **Plan**: context/changes/images-upload/plan.md
- **Scope**: Phases 1-3 (full plan)
- **Date**: 2026-05-15
- **Verdict**: APPROVED
- **Findings**: 0 critical, 1 warning, 3 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | PASS |
| Safety & Quality | PASS |
| Architecture | PASS |
| Pattern Consistency | WARNING |
| Success Criteria | PASS |

## Findings

### F1 — reportOrphans runs in --urls mode with misleading text

- **Severity**: WARNING
- **Impact**: LOW
- **Dimension**: Pattern Consistency
- **Location**: workbench/scripts/upload-assets.mjs:366
- **Detail**: reportOrphans() was called before the urlsOnly early-exit. The warning text says "uploading anyway" but in --urls mode the script never uploads — misleading output for that path.
- **Fix**: Move reportOrphans(lessonEntries) to after the if (urlsOnly) block.
- **Decision**: FIXED via df55202d

### F2 — Function name drift: applyCommentWriteback vs rewriteCommentsForLesson

- **Severity**: OBSERVATION
- **Impact**: LOW
- **Dimension**: Plan Adherence
- **Location**: workbench/scripts/upload-assets.mjs:269
- **Detail**: Plan §Phase 3 #2 contract names the function rewriteCommentsForLesson(lessonDir, uploadedAssets). Implementation used applyCommentWriteback(entries, {apply}) and grouped by lessonId internally. Behavior equivalent.
- **Fix**: Extract rewriteCommentsForLesson(lessonDir, entries, {apply}) matching the planned signature; keep applyCommentWriteback as a thin grouping wrapper that calls it per lesson.
- **Decision**: FIXED via df55202d

### F3 — Walker duplicated three times

- **Severity**: OBSERVATION
- **Impact**: LOW
- **Dimension**: Pattern Consistency
- **Location**: workbench/scripts/upload-assets.mjs:153, :222, :285
- **Detail**: Three near-identical iterative directory walks (walkFiles, findReferencedAssets, inner walker in rewriteCommentsForLesson). Functionally correct; minor DRY.
- **Fix**: Generalize walkFiles(dir, {excludeDir}); use it from findReferencedAssets and rewriteCommentsForLesson.
- **Decision**: FIXED via df55202d

### F4 — Diagrams base dir lacks dot-prefix filter

- **Severity**: OBSERVATION
- **Impact**: LOW
- **Dimension**: Pattern Consistency
- **Location**: workbench/scripts/upload-assets.mjs:123 vs :136
- **Detail**: discoverDiagrams() filtered !f.startsWith('.') on the diagrams-10x branch but not on the base diagrams branch. Practical impact nil thanks to the .endsWith('.png') guard, but inconsistent.
- **Fix**: Add && !f.startsWith('.') to the base diagrams filter to match the 10x branch.
- **Decision**: FIXED via df55202d

## Verified clean

- All 4 automated checks across phases 1-2 pass at HEAD
- Manual checks 1.5-1.7, 2.5-2.8, 3.6-3.8 user-confirmed
- "What We're NOT Doing" list: every item honored
- Entry shape contract matches plan exactly
- Cache migration: silent in-memory rewrite to "diagrams/<key>"
- Orphan warning text: byte-identical to plan
- buildAssetRefRegex: character-for-character match with plan
- Idempotent writeback: existingComment !== desired correctly gates counting; replacement is unconditional so manual edits restore
- execFileSync uses argv array (no shell), no injection risk
- No hardcoded secrets; AWS auth via CLI
