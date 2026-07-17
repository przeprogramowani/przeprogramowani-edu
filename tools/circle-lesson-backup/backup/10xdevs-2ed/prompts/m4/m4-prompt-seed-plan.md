# Plan: Generate Supabase Seed File for 10xDevs M4 Prompts

## Overview
Parse markdown prompt files from `backup/10xdevs-2ed/prompts/m4/` and generate a Supabase seed SQL file that populates the database with bilingual prompts (EN/PL) for the M4 (Legacy Code) course module.

## Database Structure Analysis

### Tables to populate:
- `prompt_collections` - Collection groupings (e.g., "m4-legacy")
- `prompt_collection_segments` - Segments within collections (e.g., "l1-onboarding", "l2-analysis")
- `prompts` - Individual prompts with bilingual content (en/pl)

### File Naming Pattern:
- `{lesson}-{seq}-{slug}-en.md` + `{lesson}-{seq}-{slug}-pl.md` → 1 prompt row
- Example: `4x1-1-initial-project-analysis-en.md` + `4x1-1-initial-project-analysis-pl.md`

### Frontmatter → Database Mapping:
```yaml
frontmatter.title → prompts.title_en / title_pl
frontmatter.description → prompts.description_en / description_pl
frontmatter.collection → prompt_collections.slug
frontmatter.segment → prompt_collection_segments.slug
frontmatter.sort-order → determine prompt order within segment
frontmatter.status → prompts.status
markdown body → prompts.markdown_body_en / markdown_body_pl
```

## Discovered Structure

### Collection:
- `m4-legacy` (Legacy Code module)
  - Title: "M4 Legacy"
  - Description: "Understanding and working with legacy codebases through git history analysis, systematic onboarding, debugging strategies, and issue resolution workflows"

### Segments:
1. **l1-onboarding** (5 prompts)
   - Title: "Onboarding"
   - Description: "Systematic approaches to understanding existing codebases through git history, module analysis, and comprehensive documentation"
   - Sort order: 1

2. **l2-analysis** (2 prompts)
   - Title: "Analysis & Debugging"
   - Description: "Issue investigation, action planning, and strategic logging for debugging legacy systems"
   - Sort order: 2

### Total: 7 prompts × 2 locales = 14 files

## Detailed Prompt Breakdown

### L1: Onboarding (4x1-*) - 5 prompts
| Sort | Slug | Title (EN) |
|------|------|------------|
| 0 | initial-project-analysis | Initial Project Analysis |
| 1 | module-analysis | Module Analysis |
| 2 | key-files-analysis | Key Files Analysis |
| 3 | onboarding-synthesis | Onboarding Synthesis |
| 4 | no-git-history-analysis | No Git History Analysis |

### L2: Analysis (4x2-*) - 2 prompts
| Sort | Slug | Title (EN) |
|------|------|------------|
| 0 | action-plan-structure | Issue Resolution Action Plan |
| 1 | logging-strategy | Strategic Logging Implementation |

## Implementation Steps

1. **Parse all markdown files**
   - Scan `backup/10xdevs-2ed/prompts/m4/` directory
   - Extract frontmatter (using gray-matter or similar) and body from each file
   - Handle both `-en.md` and `-pl.md` variants
   - Exclude `_archive/` subdirectory and documentation-only files (4x3, 4x4, 4x5)

2. **Group by base filename**
   - Pair EN/PL versions together (e.g., `4x1-1-initial-project-analysis-{en,pl}.md`)
   - Extract metadata: lesson (4x1), sequence (1), slug (initial-project-analysis)

3. **Extract collection and segments**
   - Collection: `m4-legacy`
   - Segments from frontmatter `segment` field: l1-onboarding, l2-analysis
   - Map segments to human-readable titles and descriptions

4. **Generate seed SQL** with structure:
   ```sql
   -- Get 10xdevs org ID
   DO $$
   DECLARE
       org_id UUID;
       collection_id UUID;
       segment_l1_id UUID;
       segment_l2_id UUID;
   BEGIN
       -- Lookup organization
       SELECT id INTO org_id FROM organizations WHERE slug = '10xdevs';

       -- Insert/update collection
       INSERT INTO prompt_collections (organization_id, slug, title_en, title_pl, description_en, description_pl, status)
       VALUES (
           org_id,
           'm4-legacy',
           'M4 Legacy',
           'Moduł 4: Mistrzostwo Legacy Code',
           'Understanding and working with legacy codebases through git history analysis, systematic onboarding, debugging strategies, and issue resolution workflows',
           'Zrozumienie i praca z legacy codebase poprzez analizę historii git, systematyczny onboarding, strategie debugowania i workflow rozwiązywania problemów',
           'published'
       )
       ON CONFLICT (organization_id, slug)
       DO UPDATE SET
           title_en = EXCLUDED.title_en,
           title_pl = EXCLUDED.title_pl,
           description_en = EXCLUDED.description_en,
           description_pl = EXCLUDED.description_pl,
           updated_at = NOW()
       RETURNING id INTO collection_id;

       -- Insert/update segments (l1-onboarding, l2-analysis)
       -- ... (similar pattern for each segment)

       -- Insert prompts with bilingual content
       -- ... (for each of 7 prompts)
   END $$;
   ```

5. **Handle sort_order**
   - Use frontmatter `sort-order` field to order prompts within segments
   - L1 segment: 0-4 (5 prompts)
   - L2 segment: 0-1 (2 prompts)

6. **Output format**
   - Create `supabase/seed-prompts-10xdevs-m4.sql`
   - Follow existing seed file patterns from M2 and M3
   - Use `ON CONFLICT DO UPDATE` for idempotency
   - Special SQL escaping for M4-specific content (XML tags, placeholders)

## Technical Details

### SQL Generation Considerations:
- Use `ON CONFLICT DO UPDATE` for idempotency (can re-run seed safely)
- **M4-Specific Escaping Requirements**:
  - XML tags: `<top_modules>`, `<action_plan>`, `<investigation-questions>` must be preserved
  - Placeholders: `{{top-modules}}`, `{{onboarding.md}}`, `{{issue-description}}` must be preserved
  - Tool references: `file_read`, `file_search`, `list_dir` must be preserved
  - Git commands: Complex multi-line git commands with proper formatting
  - Use PostgreSQL dollar-quoting for complex strings: `$$content$$`
- Maintain `organization_id` reference throughout all inserts
- Set `created_by` to NULL (can be updated later)
- Default `status` from frontmatter or 'published'
- Use `RETURNING id INTO variable` to capture UUIDs for foreign key references

### Database Schema Reference

#### prompts table columns:
- `id` (UUID, auto-generated)
- `organization_id` (UUID, references organizations)
- `collection_id` (UUID, references prompt_collections)
- `segment_id` (UUID, references prompt_collection_segments, nullable)
- `title_en` (TEXT, required)
- `title_pl` (TEXT, nullable)
- `description_en` (TEXT, nullable)
- `description_pl` (TEXT, nullable)
- `markdown_body_en` (TEXT, required)
- `markdown_body_pl` (TEXT, nullable)
- `status` (TEXT, 'draft' or 'published')
- `created_by` (UUID, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Example Pairing

### Files:
- `4x1-1-initial-project-analysis-en.md`
- `4x1-1-initial-project-analysis-pl.md`

### Frontmatter (English version):
```yaml
---
title: "Initial Project Analysis"
description: "Analyzes git history, top modules, and contributors to create comprehensive onboarding documentation. Helps new developers quickly understand project structure and recent developments."
collection: m4-legacy
segment: l1-onboarding
sort-order: 0
status: published
---
```

### Frontmatter (Polish version):
```yaml
---
title: "Wstępna analiza projektu"
description: "Analizuje historię git, główne moduły i kontrybutorów, aby stworzyć kompleksową dokumentację onboardingową. Pomaga nowym programistom szybko zrozumieć strukturę projektu i ostatnie zmiany."
collection: m4-legacy
segment: l1-onboarding
sort-order: 0
status: published
---
```

### Becomes one prompt row:
```sql
INSERT INTO prompts (
    organization_id,
    collection_id,
    segment_id,
    title_en,
    title_pl,
    description_en,
    description_pl,
    markdown_body_en,
    markdown_body_pl,
    status,
    created_by
) VALUES (
    org_id,
    collection_id,
    segment_l1_id,
    'Initial Project Analysis',
    'Wstępna analiza projektu',
    'Analyzes git history, top modules, and contributors to create comprehensive onboarding documentation. Helps new developers quickly understand project structure and recent developments.',
    'Analizuje historię git, główne moduły i kontrybutorów, aby stworzyć kompleksową dokumentację onboardingową. Pomaga nowym programistom szybko zrozumieć strukturę projektu i ostatnie zmiany.',
    $$You are an AI assistant tasked with onboarding a new developer to a big project. Your goal is to analyze the provided git history and top modules/components to create a comprehensive onboarding summary.

First, review the following information:

<top_modules>
{{top-modules}} - replace with git script output for modules
</top_modules>

<top_files>
{{top-files}} - replace with git script output for files
</top_files>

<top_contributors>
{{top-contributors}} - replace with git script output for contributors
</top_contributors>

[... rest of English prompt content ...]$$,
    $$You are an AI assistant tasked with onboarding a new developer to a big project. Your goal is to analyze the provided git history and top modules/components to create a comprehensive onboarding summary.

First, review the following information:

<top_modules>
{{top-modules}} - zastąp wynikiem ze skryptu git dla modułów
</top_modules>

<top_files>
{{top-files}} - zastąp wynikiem ze skryptu git dla plików
</top_files>

<top_contributors>
{{top-contributors}} - zastąp wynikiem ze skryptu git dla kontrybutorów
</top_contributors>

[... rest of Polish prompt content ...]$$,
    'published',
    NULL
)
ON CONFLICT (organization_id, collection_id, segment_id, title_en)
DO UPDATE SET
    title_pl = EXCLUDED.title_pl,
    description_en = EXCLUDED.description_en,
    description_pl = EXCLUDED.description_pl,
    markdown_body_en = EXCLUDED.markdown_body_en,
    markdown_body_pl = EXCLUDED.markdown_body_pl,
    status = EXCLUDED.status,
    updated_at = NOW();
```

## M4 Unique Characteristics

### Content Features to Preserve:
1. **XML-style Context Tags**: `<top_modules>`, `<action_plan>`, `<investigation-questions>`, `<suggested-files>`
2. **Dynamic Placeholders**: `{{top-modules}}`, `{{onboarding.md}}`, `{{issue-description}}`, `{{action-plan}}`
3. **Tool References**: `file_read`, `file_search`, `list_dir`
4. **Git Commands**: Multi-line git log commands with specific formatting
5. **Thinking Block Tags**: `<action_plan_development>`, `<perform_action>`
6. **File Path References**: `.ai/onboarding.md`, `.ai/{issue-name}-action-plan.md`

### Special SQL Escaping Needs:
- **XML Tags**: Must preserve `<` and `>` characters within dollar-quoted strings
- **Double Braces**: Must preserve `{{` and `}}` for placeholder syntax
- **Code Blocks**: Multi-line markdown code blocks with backticks
- **Git Commands**: Complex command strings with quotes and special characters

## Key Differences from M2/M3

| Aspect | M2 (Bootstrap) | M3 (Production) | M4 (Legacy) |
|--------|----------------|-----------------|-------------|
| Collection slug | `m2-bootstrap` | `m3-prod` | `m4-legacy` |
| Total prompts | ~24 | 24 | 7 |
| Segments | 6 lesson-based | 5 lesson-based | 2 theme-based |
| File prefix | `1x*-`, `2x*-` | `3x*-` | `4x*-` |
| Focus | Building new apps | Production readiness | Legacy code analysis |
| Prompt type | Implementation | Advanced patterns | Investigation/debugging |
| Content style | Direct instructions | Multi-step workflows | Analysis frameworks |
| Placeholders | `@file.md` refs | Project docs | Git data, XML contexts |
| Tools used | Code generation | Testing, deployment | Git, file exploration |
| Avg length | Medium | Medium-long | Long (workflow-based) |

## Validation Checklist

Before finalizing the seed file:

- [ ] All 14 files successfully parsed (7 EN + 7 PL)
- [ ] All locale pairs correctly matched
- [ ] Frontmatter fields extracted: title, description, collection, segment, sort-order, status
- [ ] Markdown bodies preserved with proper escaping
- [ ] Collection metadata complete (title EN/PL, description EN/PL)
- [ ] Both segments created with proper titles and sort orders
- [ ] Sort order sequential within each segment (L1: 0-4, L2: 0-1)
- [ ] SQL syntax valid (test with `psql --dry-run` or similar)
- [ ] Idempotency verified (can run seed multiple times safely)
- [ ] **M4-Specific Checks**:
  - [ ] XML tags preserved: `<top_modules>`, `<action_plan>`, etc.
  - [ ] Placeholders preserved: `{{top-modules}}`, `{{onboarding.md}}`, etc.
  - [ ] Tool references intact: `file_read`, `file_search`, `list_dir`
  - [ ] Git commands formatted correctly
  - [ ] Thinking block tags preserved: `<action_plan_development>`
  - [ ] File path references intact: `.ai/onboarding.md`
- [ ] Special characters properly escaped within dollar-quoted strings

## Next Steps

1. **Create seed generator script** (`generate-m4-seed.ts`)
   - Parse M4 individual prompt files
   - Exclude `_archive/` and documentation files (4x3, 4x4, 4x5)
   - Extract and group by locale pairs
   - Generate SQL according to this plan
   - Handle M4-specific escaping requirements

2. **Generate SQL file** (`supabase/seed-prompts-10xdevs-m4.sql`)
   - Run generator script
   - Review output for correctness
   - Verify XML tags and placeholders are intact

3. **Test seed file**
   - Run against local Supabase instance
   - Verify prompt count: 7 prompts
   - Verify segment distribution: 5 (l1) + 2 (l2) = 7
   - Check bilingual content integrity
   - Test placeholder substitution works correctly

4. **Document seed process**
   - Update README with M4 seed instructions
   - Document any manual adjustments made
   - Note differences from M2/M3 seed process

## Files to Process

### Include (14 files):
```
4x1-1-initial-project-analysis-en.md
4x1-1-initial-project-analysis-pl.md
4x1-2-module-analysis-en.md
4x1-2-module-analysis-pl.md
4x1-3-key-files-analysis-en.md
4x1-3-key-files-analysis-pl.md
4x1-4-onboarding-synthesis-en.md
4x1-4-onboarding-synthesis-pl.md
4x1-5-no-git-history-analysis-en.md
4x1-5-no-git-history-analysis-pl.md
4x2-1-action-plan-structure-en.md
4x2-1-action-plan-structure-pl.md
4x2-2-logging-strategy-en.md
4x2-2-logging-strategy-pl.md
```

### Exclude:
- `_archive/` directory (original aggregated files)
- `4x3_prompts.md` (references external repo)
- `4x4_prompts.md` (no extractable prompts)
- `4x5_prompts.md` (no extractable prompts)
- `README.md` (documentation)
- `m4-split-prompts-plan.md` (planning doc)

## Notes

- **Frontmatter language**: Titles/descriptions are language-specific (unlike some M3 prompts)
- **Markdown bodies**: Fully bilingual - different instructional text for EN vs PL
- **Technical references**: Must preserve all `{{}}`, `<>`, and tool syntax exactly
- **Status**: All prompts marked as 'published'
- **No L3-L6 segments**: M4 only has 2 segments (by design)
- **Longer prompts**: M4 prompts are workflow-based and significantly longer than M2/M3
- **Git-centric**: Heavy emphasis on git history analysis and repository exploration

---

**Source files**: `backup/10xdevs-2ed/prompts/m4/*.md` (14 individual files)
**Target output**: `supabase/seed-prompts-10xdevs-m4.sql`
**Based on**: M3 seed plan pattern (m3-prompt-seed-plan.md)
**Date**: 2025-10-19
