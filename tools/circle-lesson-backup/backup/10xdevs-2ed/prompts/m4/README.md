# M4 Legacy Code Prompts

This directory contains prompts for the M4 (Legacy Code) module of the 10xDevs course, focusing on onboarding to existing codebases and debugging legacy systems.

## Overview

**Total Prompts**: 7 individual prompts (14 files including both English and Polish versions)
**Collection**: `m4-legacy`
**Segments**:
- `l1-onboarding` (5 prompts) - Understanding legacy codebases
- `l2-analysis` (2 prompts) - Debugging and issue resolution

## File Structure

All prompts follow the naming pattern: `{lesson}-{seq}-{title-slug}-{locale}.md`

### 4x1: Legacy Code Onboarding (l1-onboarding)

Prompts focused on understanding and documenting existing codebases:

1. **4x1-1-initial-project-analysis** - Analyze git history to create comprehensive onboarding documentation
2. **4x1-2-module-analysis** - Deep dive into core modules based on onboarding docs
3. **4x1-3-key-files-analysis** - Three-phase analysis of key files (identification, git history, content)
4. **4x1-4-onboarding-synthesis** - Synthesize findings to enhance onboarding documentation
5. **4x1-5-no-git-history-analysis** - Alternative onboarding approach for projects without git history

### 4x2: Legacy Code Analysis (l2-analysis)

Prompts focused on debugging and resolving issues in legacy code:

1. **4x2-1-action-plan-structure** - Create comprehensive action plan for issue resolution
2. **4x2-2-logging-strategy** - Add strategic logging to identify bug sources

## M4 Unique Characteristics

Unlike M2 and M3 prompts which focus on building new features, M4 prompts are designed for:

- **Git-focused workflows**: Heavy use of git history analysis
- **Investigation patterns**: Multi-phase analytical approaches
- **Context organization**: XML-style tags (`<top_modules>`, `<project_onboarding_doc>`, etc.)
- **Placeholders**: Dynamic content injection (`{{top-modules}}`, `{{onboarding.md}}`, `{{issue-description}}`)
- **Tool integration**: References to `file_read`, `file_search`, `list_dir` tools

## Documentation-Only Lessons

The following lessons have documentation but no extractable prompts:

- **4x3_prompts.md**: Regression Testing (references external 10x-test-planner repository)
- **4x4_prompts.md**: Code Modernization (focuses on codemods and refactoring techniques)
- **4x5_prompts.md**: Architecture Modernization (covers DDD concepts and patterns)

## Archive

Original aggregated files are preserved in `_archive/`:
- `4x1_prompts.md` (5 prompts)
- `4x2_prompts.md` (2 prompts)

## Utility Scripts

- **split-m4-prompts.ts**: TypeScript utility for splitting aggregated files into individual bilingual prompts
  - Run: `npx tsx split-m4-prompts.ts` (Polish only)
  - Run: `npx tsx split-m4-prompts.ts --english` (Polish + English)

## Translation Notes

English translations preserve all technical elements:
- Placeholders: `{{variable-name}}`
- XML tags: `<tag_name>...</tag_name>`
- Tool names: `file_read`, `file_search`, `list_dir`
- Git commands: Command syntax unchanged
- File references: `.ai/onboarding.md`, `.ai/{issue-name}-action-plan.md`

## Usage

Each prompt is designed to be used with AI coding assistants (like Claude Code, Cursor, GitHub Copilot) to:
1. Analyze existing codebases systematically
2. Generate comprehensive onboarding documentation
3. Debug issues through structured investigation
4. Add strategic logging for troubleshooting

For detailed implementation guidelines, see `m4-split-prompts-plan.md`.

## Validation

✓ All 14 files created (7 Polish + 7 English)
✓ Naming convention follows M2 pattern: `{lesson}-{seq}-{slug}-{locale}.md`
✓ All frontmatter fields complete and accurate
✓ Collection set to `m4-legacy`
✓ Segments correctly assigned (`l1-onboarding`, `l2-analysis`)
✓ Placeholders preserved: `{{variable-name}}`
✓ XML tags preserved: `<tag_name>...</tag_name>`
✓ Git commands unchanged
✓ Tool references preserved
✓ Translations maintain technical accuracy
✓ Sort-order consistency across locale pairs
✓ Original files archived safely
✓ No Polish characters in English files
