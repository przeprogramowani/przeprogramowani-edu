# Universal Prompt Splitter & Localizer

## Overview
Create an interactive tool that takes raw prompt text and produces individual bilingual prompt files following the established naming pattern across all modules (M2-M5).

## Workflow

### Phase 1: Initial Input Collection
Ask the user for:
1. **Module identifier** (m2/m3/m4/m5)
2. **Collection slug** (e.g., `m4-legacy`, `m3-prod`, `m2-foundations`)
3. **Collection title** (e.g., "M4: Legacy Code Mastery", "M3: Production Deployment")
   - User-facing, descriptive title (single language, suggest English)
   - Used in database `prompt_collections.title` field
4. **Collection description** (optional, e.g., "Techniques for understanding and modernizing legacy codebases")
5. **Lesson identifier** (e.g., `4x1`, `3x2`, `2x3`)
6. **Segment slug** (e.g., `l1-onboarding`, `l2-analysis`, `l1-auth`)
7. **Segment title** (e.g., "Legacy Code Onboarding", "Codebase Analysis")
   - Concise lesson section name (single language, suggest English)
   - Used in database `prompt_collection_segments.title` field
8. **Starting sequence number** (usually 1, unless adding to existing prompts)
9. **Target directory** (auto-suggest: `backup/10xdevs-2ed/prompts/{module}/`)

**Note**: Collections and segments use single-language titles (not bilingual). Only individual prompts have bilingual content.

### Phase 2: Prompt Text Input
Ask user for input method:
- **Option A**: Paste prompt text directly (single or multiple prompts)
- **Option B**: Provide reference file path (recommended for multiple prompts)

#### Reference File Format
For multiple prompts from the same module/lesson:
```markdown
Prompt content 1...
Multiple lines supported...

---

Prompt content 2...
Another prompt here...

---

Prompt content 3...
And so on...
```

**File format rules:**
- All prompts must be from the SAME module/lesson
- Use `---` (three hyphens) as the separator between prompts
- Separators must be on their own line
- Empty lines around separators are ignored
- Code blocks containing `---` are NOT treated as separators (context-aware parsing)
- Minimum 1 prompt, no maximum limit

### Phase 3: Prompt Text Analysis & Parsing
1. **Read input source** (pasted text or file path)
2. **Split by separator**: Parse using `---` as delimiter
   - Use context-aware parsing: ignore `---` inside code blocks (` ``` `)
   - Ignore `---` inside YAML frontmatter
   - Only split on `---` that appears on its own line
3. **Clean sections**:
   - Trim leading/trailing whitespace from each prompt
   - Filter out empty sections (separators at start/end of file)
   - Remove any existing frontmatter if present (will be regenerated)
4. **Validate and count**:
   - Confirm N prompts detected
   - Show preview of first 200 chars of each prompt
   - Ask user to confirm count is correct
5. **Auto-number prompts**: Assign sequence 1 to N using starting sequence number

### Phase 4: Metadata Collection (Per Prompt)
**Process each prompt sequentially from 1 to N:**

✓ All prompts have clear, actionable descriptions (1-2 sentences)
✓ Descriptions explain **what** the prompt does and **why** it's useful
✓ Titles are user-friendly and descriptive
- ✅ Clear, descriptive titles without technical suffixes
- ✅ Comprehensive 1-2 sentence descriptions
- ✅ Perfect alignment between EN/PL versions

**For each prompt**, interactively ask:
1. **Title (Polish)** - AI suggests based on content analysis, user confirms/edits
2. **Description (Polish)** - AI suggests brief summary of prompt purpose (1-2 sentences)
3. **Title slug** - auto-generate from Polish title, allow override
4. **Sort order** - auto-assigned (startSeq + promptIndex - 1)

**AI Content Analysis Guidelines:**
- Read first 500 characters of prompt content
- Identify key action verbs and domain concepts
- Extract main purpose and use case
- Suggest concise, descriptive title
- Generate actionable description explaining value

### Phase 5: Translation (Per Prompt)
1. **Translate title** (Polish → English)
   - Maintain technical terminology
   - Follow M2/M3/M4 translation patterns
2. **Translate description** (Polish → English)
3. **Translate content**:
   - **Preserve**: placeholders `{{...}}`, XML tags `<...>`, code blocks, commands
   - **Translate**: instructional text, section headings, comments
   - Use translation reference from M4 plan (lines 259-296)

### Phase 6: File Generation
**Batch generation for all N prompts:**

For each prompt (1 to N), create TWO files:
```
{lesson}-{seq}-{slug}-pl.md  (Polish version)
{lesson}-{seq}-{slug}-en.md  (English version)
```

Where:
- `{lesson}` = from session metadata (e.g., `4x1`)
- `{seq}` = auto-incremented (startSeq, startSeq+1, ..., startSeq+N-1)
- `{slug}` = generated from Polish title

**Frontmatter template**:
```yaml
---
title: "[Translated Title]"
description: "[Translated Description]"
collection: [from session metadata]
segment: [from session metadata]
sort-order: [auto-assigned sequence]
status: published
---
```

**Batch processing benefits:**
- All files written in one operation
- Consistent naming and numbering
- Atomic operation (all succeed or all fail)
- Progress indicator showing X of N files created

### Phase 7: Validation
**Batch validation for all generated files:**

- Verify file naming matches pattern for all N×2 files
- Check frontmatter completeness across all files
- Confirm locale pairs have identical structure (EN/PL alignment)
- Validate preserved technical elements in all prompts
- Check slug uniqueness within lesson
- Show complete file list for user review

**Validation report format:**
```
✓ Generated 10 prompt pairs (20 files total)
✓ All files follow naming convention
✓ All EN/PL pairs properly aligned
✓ All frontmatter complete
✓ All technical elements preserved
✓ No duplicate slugs detected

Files created:
  4x1-1-initial-analysis-pl.md / 4x1-1-initial-analysis-en.md
  4x1-2-module-review-pl.md / 4x1-2-module-review-en.md
  ... (8 more pairs)
```

### Phase 8: SQL Seed Generation
After all prompt files are created, optionally generate Supabase seed SQL file:

1. **Parse generated markdown files**
   - Read all EN/PL file pairs from target directory
   - Extract frontmatter (title, description, collection, segment, sort-order, status)
   - Extract markdown body content

2. **Group and analyze**
   - Pair EN/PL versions by base filename (`{lesson}-{seq}-{slug}`)
   - Extract unique collections from frontmatter `collection` field
   - Extract unique segments from frontmatter `segment` field
   - Determine collection/segment titles:
     * **Collections**: Use descriptive, user-facing titles (e.g., "M4: Legacy Code Mastery")
     * **Segments**: Use concise lesson section names (e.g., "Legacy Code Onboarding")
     * Default to English titles or ask user for preferred language
     * Can infer from lesson context or prompt titles

3. **Generate SQL structure**
   ```sql
   -- Get organization ID
   DO $$
   DECLARE
     v_org_id uuid;
     v_collection_id uuid;
     v_segment_id uuid;
   BEGIN
     -- Get organization
     SELECT id INTO v_org_id
     FROM organizations
     WHERE slug = '10xdevs';

     -- Insert/update collection (single title, not bilingual)
     INSERT INTO prompt_collections (
       organization_id,
       slug,
       title,
       description,
       sort_order,
       created_at,
       updated_at
     )
     VALUES (
       v_org_id,
       'm4-legacy',
       'M4: Legacy Code Mastery',  -- Single title (use English or ask user)
       'Techniques for understanding and modernizing legacy codebases',
       4,  -- Module number for sort order
       NOW(),
       NOW()
     )
     ON CONFLICT (organization_id, slug)
     DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       sort_order = EXCLUDED.sort_order,
       updated_at = NOW()
     RETURNING id INTO v_collection_id;

     -- Insert/update segments (single title, not bilingual)
     INSERT INTO prompt_collection_segments (
       collection_id,
       slug,
       title,
       sort_order,
       created_at,
       updated_at
     )
     VALUES
       (v_collection_id, 'l1-onboarding', 'Legacy Code Onboarding', 1, NOW(), NOW()),
       (v_collection_id, 'l2-analysis', 'Codebase Analysis', 2, NOW(), NOW()),
       (v_collection_id, 'l3-testing', 'Regression Testing', 3, NOW(), NOW())
     ON CONFLICT (collection_id, slug)
     DO UPDATE SET
       title = EXCLUDED.title,
       sort_order = EXCLUDED.sort_order,
       updated_at = NOW();

     -- Insert prompts with bilingual content
     -- Get segment ID for first prompt
     SELECT id INTO v_segment_id
     FROM prompt_collection_segments
     WHERE collection_id = v_collection_id AND slug = 'l1-onboarding';

     -- Delete existing prompt if it exists (for idempotency)
     DELETE FROM prompts
     WHERE organization_id = v_org_id
       AND collection_id = v_collection_id
       AND segment_id = v_segment_id
       AND sort_order = 1;

     -- Insert prompt (note: created_at/updated_at omitted - have defaults)
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
       sort_order
     )
     VALUES (
       v_org_id,
       v_collection_id,
       v_segment_id,
       'Initial Project Analysis',
       'Wstępna analiza projektu',
       'Interactive prompt for conducting initial legacy project analysis',
       'Interaktywny prompt do przeprowadzenia wstępnej analizy projektu legacy',
       $BODY$# Initial Project Analysis

You are an experienced software architect...$BODY$,
       $BODY$# Wstępna analiza projektu

Jesteś doświadczonym architektem...$BODY$,
       'published',
       1
     );

   END $$;
   ```

4. **SQL escaping rules**
   - Escape single quotes: `'` → `''`
   - Escape backslashes if needed: `\` → `\\`
   - **Recommended**: Use PostgreSQL tagged dollar-quoting for markdown: `$BODY$content$BODY$`
   - Alternative: Empty dollar-quotes `$$content$$` (less robust in Supabase)
   - Alternative tags: `$CONTENT$`, `$MD$`, `$TEXT$` (any identifier works)
   - Properly escape all frontmatter and body content

5. **Output file**
   - Create `backup/10xdevs-2ed/prompts/{module}/seed-{module}-prompts.sql`
   - Include helpful comments with file structure
   - Make idempotent using `DELETE + INSERT` pattern for prompts
   - Use `ON CONFLICT DO UPDATE` for collections and segments (they have unique constraints)
   - Set `created_by` to NULL (can be updated later)
   - Omit `created_at` and `updated_at` from INSERT statements (use defaults)

6. **Database schema reference**
   ```typescript
   // prompt_collections (NOT bilingual at collection level)
   {
     id: UUID                    // auto-generated
     organization_id: UUID       // FK to organizations
     slug: text                  // unique per organization
     title: text                 // SINGLE title (not bilingual)
     description?: text          // SINGLE description (optional, not bilingual)
     sort_order: integer         // default 0
     created_at: timestamptz     // auto-generated
     updated_at: timestamptz     // auto-generated
   }
   // Unique constraint: (organization_id, slug)
   // Index: (organization_id, sort_order)

   // prompt_collection_segments (NOT bilingual at segment level)
   {
     id: UUID                    // auto-generated
     collection_id: UUID         // FK to prompt_collections, CASCADE delete
     slug: text                  // unique per collection
     title: text                 // SINGLE title (not bilingual)
     sort_order: integer         // default 0
     created_at: timestamptz     // auto-generated
     updated_at: timestamptz     // auto-generated
   }
   // Unique constraint: (collection_id, slug)
   // Index: (collection_id, sort_order)
   // Note: NO description field in segments

   // prompts (BILINGUAL at prompt level only)
   {
     id: UUID                    // auto-generated
     organization_id: UUID       // FK to organizations
     collection_id: UUID         // FK to prompt_collections
     segment_id?: UUID           // FK to prompt_collection_segments (nullable)
     title_en: text              // REQUIRED English title
     title_pl?: text             // Optional Polish title
     description_en?: text       // Optional English description
     description_pl?: text       // Optional Polish description
     markdown_body_en: text      // REQUIRED English content
     markdown_body_pl?: text     // Optional Polish content
     status: text                // 'draft' | 'published'
     created_by?: UUID           // FK to users (nullable)
     created_at: timestamptz     // auto-generated
     updated_at: timestamptz     // auto-generated
   }
   // Unique constraint: (organization_id, collection_id, title_en)
   ```

   **Important schema notes:**
   - **Collections** and **segments** have SINGLE `title` fields (not bilingual)
   - Only **prompts** have bilingual content (`_en` and `_pl` suffixes)
   - Segments do NOT have a `description` field
   - Collection titles should be descriptive and user-facing (suggest English or ask user)
   - Segment titles should be concise lesson section names (suggest English or ask user)

7. **Validation**
   - Verify all EN/PL pairs are included
   - Check SQL syntax validity
   - Confirm proper escaping of special characters
   - Validate foreign key relationships
   - Show summary: X collections, Y segments, Z prompts

8. **SQL Generation Modes**
   - **Mode A - During session**: Generate SQL immediately after creating prompts in current session
   - **Mode B - Batch generation**: Scan entire module directory and generate SQL for all existing prompts
   - **Mode C - Incremental**: Add new prompts to existing SQL seed file (append mode)

   **Best practices:**
   - Use Mode A for new lessons/modules (guarantees fresh data)
   - Use Mode B for retroactive SQL generation across completed modules
   - Use Mode C when adding missing prompts to existing collections
   - Always backup existing SQL files before regenerating
   - Verify organization_id matches target environment (10xdevs)

9. **SQL Generation Best Practices & Common Pitfalls**

   **⚠️ CRITICAL: Prompts Table Idempotency Pattern**

   The `prompts` table does **NOT** have a unique constraint on `(organization_id, collection_id, title_en)`.
   Using `ON CONFLICT` on these columns will cause error:
   ```
   ERROR: 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification
   ```

   **✅ CORRECT PATTERN: DELETE + INSERT**

   Follow the pattern used in existing seed files (e.g., `seed-prompt-idea-analysis.sql`):

   ```sql
   -- Delete existing prompt if it exists (for idempotency)
   DELETE FROM prompts
   WHERE organization_id = v_org_id
     AND collection_id = v_coll_m2_foundations_id
     AND segment_id = v_seg_l1_planning_id
     AND sort_order = 6;  -- Use sort_order to identify specific prompt

   -- Insert prompt (omit created_at/updated_at - they have defaults)
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
     sort_order
   ) VALUES (
     v_org_id,
     v_coll_m2_foundations_id,
     v_seg_l1_planning_id,
     'PoC Generator for Key Feature',
     'Generator POC dla kluczowej funkcjonalności',
     'Description in English...',
     'Opis po polsku...',
     $BODY$Content in English...$BODY$,
     $BODY$Treść po polsku...$BODY$,
     'published',
     6
   );
   ```

   **Dollar-Quoting Best Practices:**

   - **Use tagged dollar-quoting** for markdown content: `$BODY$...$BODY$`
   - **Avoid empty dollar-quotes** (`$$...$$`) - less robust in Supabase SQL Editor
   - Tagged quotes are more explicit and handle edge cases better
   - Alternative tags: `$CONTENT$`, `$MD$`, `$TEXT$` (any tag works)

   **Field Handling:**

   - **Omit `created_at` and `updated_at`** from INSERT - they have default values
   - **Omit `created_by`** - can be NULL or updated later
   - Only specify fields you're explicitly setting

   **Identification Strategy for Prompts:**

   Use combination of:
   - `organization_id` (always required)
   - `collection_id` (identifies the module/collection)
   - `segment_id` (identifies the lesson segment)
   - `sort_order` (uniquely identifies prompt within segment)

   Do NOT rely on:
   - `title_en` or `title_pl` (not part of unique constraint)
   - Prompt ID (won't exist on first insert)

   **Collections & Segments CAN use ON CONFLICT:**

   These tables DO have unique constraints:
   ```sql
   -- Collections: (organization_id, slug) is unique
   INSERT INTO prompt_collections (...)
   ON CONFLICT (organization_id, slug) DO UPDATE SET ...;

   -- Segments: (collection_id, slug) is unique
   INSERT INTO prompt_collection_segments (...)
   ON CONFLICT (collection_id, slug) DO UPDATE SET ...;
   ```

   **Testing Checklist:**

   - [ ] Run SQL twice to verify idempotency (no errors on second run)
   - [ ] Check that prompts are updated, not duplicated
   - [ ] Verify collection and segment titles are correct
   - [ ] Confirm bilingual content is preserved
   - [ ] Test with special characters and placeholders ({{VARIABLE}})

## Interactive Q&A Flow

### Batch Processing Workflow (Recommended for Multiple Prompts)

**Session Start:**
```
Module (m2/m3/m4/m5): ? m4
Collection slug: ? m4-legacy
Collection title: ? M4: Legacy Code Mastery
Collection description (optional): ? Techniques for understanding and modernizing legacy codebases
Lesson identifier (e.g., 4x1): ? 4x1
Segment slug: ? l1-onboarding
Segment title: ? Legacy Code Onboarding
Starting sequence number (default: 1): ? 1
Target directory (default: backup/10xdevs-2ed/prompts/m4/): ? [Enter]
```

**Input Method Selection:**
```
How would you like to provide prompt content?
1. Paste directly (single or multiple prompts)
2. Provide file path (recommended for multiple prompts)

Choose option: ? 2
File path: ? ./m4-lesson-4x1-prompts.md
```

**Prompt Parsing & Preview:**
```
Reading file: ./m4-lesson-4x1-prompts.md
Parsing using '---' separator...

✓ Found 5 prompts in file

Preview:
[1] "Jesteś doświadczonym architektem... (437 chars)
[2] "Przeanalizuj strukturę katalogów... (523 chars)
[3] "Na podstawie analizy modułów... (612 chars)
[4] "Utwórz plan testów regresji... (445 chars)
[5] "Zaproponuj strategię logowania... (389 chars)

Confirm 5 prompts detected? (y/n): ? y
```

**Per Prompt Metadata Collection:**
```
━━━ Prompt 1 of 5 ━━━
Content preview: "Jesteś doświadczonym architektem..."

Suggested title (PL): "Wstępna analiza projektu legacy"
Accept/Edit/Regenerate (a/e/r): ? a

Suggested description (PL): "Interaktywny prompt przeprowadzający kompleksową analizę projektu legacy, zbierający informacje o architekturze, technologiach i kluczowych modułach"
Accept/Edit (a/e): ? a

Generated slug: "wstepna-analiza-projektu-legacy"
Override? (leave blank to accept): ? [Enter]

Sort order: 1 (auto-assigned)

English title: "Initial Legacy Project Analysis"
Accept/Edit (a/e): ? a

English description: "Interactive prompt conducting comprehensive legacy project analysis, gathering information about architecture, technologies, and key modules"
Accept/Edit (a/e): ? a

✓ Prompt 1 metadata complete
━━━━━━━━━━━━━━━━━━━━━

━━━ Prompt 2 of 5 ━━━
Content preview: "Przeanalizuj strukturę katalogów..."
[... repeat for remaining prompts ...]
```

**Batch File Generation:**
```
All metadata collected. Generating files...

✓ 1/10: 4x1-1-wstepna-analiza-projektu-legacy-pl.md
✓ 2/10: 4x1-1-wstepna-analiza-projektu-legacy-en.md
✓ 3/10: 4x1-2-analiza-struktury-modulow-pl.md
✓ 4/10: 4x1-2-analiza-struktury-modulow-en.md
✓ 5/10: 4x1-3-synteza-onboardingu-pl.md
✓ 6/10: 4x1-3-synteza-onboardingu-en.md
✓ 7/10: 4x1-4-plan-testow-regresji-pl.md
✓ 8/10: 4x1-4-plan-testow-regresji-en.md
✓ 9/10: 4x1-5-strategia-logowania-pl.md
✓ 10/10: 4x1-5-strategia-logowania-en.md

✓ Successfully generated 5 prompt pairs (10 files total)
```

**Validation Report:**
```
Running validation checks...

✓ All files follow naming convention
✓ All EN/PL pairs properly aligned
✓ All frontmatter fields complete
✓ All technical elements preserved
✓ No duplicate slugs detected

Files created in: backup/10xdevs-2ed/prompts/m4/
  4x1-1-wstepna-analiza-projektu-legacy-pl.md / -en.md
  4x1-2-analiza-struktury-modulow-pl.md / -en.md
  4x1-3-synteza-onboardingu-pl.md / -en.md
  4x1-4-plan-testow-regresji-pl.md / -en.md
  4x1-5-strategia-logowania-pl.md / -en.md
```

**SQL Generation Prompt:**
```
Generate SQL seed file now? (y/n/later): ? y

Scanning directory: backup/10xdevs-2ed/prompts/m4/
Found 5 new prompt pairs in session
Total in directory: 45 prompt pairs

SQL generation mode:
1. Session only (5 prompts just created)
2. Full directory (all 45 prompts)
3. Cancel

Choose mode: ? 1

Generating SQL for session prompts...
✓ Collection: m4-legacy (1)
✓ Segments: l1-onboarding (1)
✓ Prompts: 5 bilingual pairs

✓ Created: backup/10xdevs-2ed/prompts/m4/seed-m4-4x1-l1-prompts.sql
```

## Technical Implementation

### File Structure:
```typescript
interface SessionMetadata {
  module: 'm2' | 'm3' | 'm4' | 'm5'
  collectionSlug: string          // e.g., 'm4-legacy'
  collectionTitle: string         // e.g., 'M4: Legacy Code Mastery'
  collectionDescription?: string  // optional
  lesson: string                  // e.g., '4x1'
  segmentSlug: string             // e.g., 'l1-onboarding'
  segmentTitle: string            // e.g., 'Legacy Code Onboarding'
  startSeq: number
  targetDir: string
}

interface PromptData {
  seq: number
  titlePl: string          // Polish title for prompt
  titleEn: string          // English title for prompt
  descPl: string           // Polish description for prompt
  descEn: string           // English description for prompt
  slug: string             // URL-friendly slug
  contentPl: string        // Polish markdown body
  contentEn: string        // English markdown body
  sortOrder: number
}

interface SQLGenerationData {
  collections: {
    slug: string
    title: string
    description?: string
    sortOrder: number
  }[]
  segments: {
    collectionSlug: string
    slug: string
    title: string
    sortOrder: number
  }[]
  prompts: {
    collectionSlug: string
    segmentSlug: string
    titleEn: string
    titlePl?: string
    descriptionEn?: string
    descriptionPl?: string
    markdownBodyEn: string
    markdownBodyPl?: string
    status: 'draft' | 'published'
  }[]
}
```

### Context-Aware Separator Parsing Algorithm:

**Problem**: Need to split prompts by `---` but avoid splitting inside code blocks or YAML frontmatter

**Solution**: Track parsing state while processing line-by-line

```typescript
function parsePrompts(content: string): string[] {
  const lines = content.split('\n')
  const prompts: string[] = []
  let currentPrompt: string[] = []
  let inCodeBlock = false
  let inFrontmatter = false
  let lineIndex = 0

  for (const line of lines) {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      currentPrompt.push(line)
      continue
    }

    // Track frontmatter state
    if (lineIndex === 0 && line.trim() === '---') {
      inFrontmatter = true
      lineIndex++
      continue  // Skip opening frontmatter
    }
    if (inFrontmatter && line.trim() === '---') {
      inFrontmatter = false
      lineIndex++
      continue  // Skip closing frontmatter
    }

    // Check for separator (only when NOT in code block or frontmatter)
    if (!inCodeBlock && !inFrontmatter && line.trim() === '---') {
      // Save current prompt if not empty
      const promptText = currentPrompt.join('\n').trim()
      if (promptText.length > 0) {
        prompts.push(promptText)
      }
      currentPrompt = []
      lineIndex++
      continue
    }

    // Regular line - add to current prompt
    currentPrompt.push(line)
    lineIndex++
  }

  // Don't forget the last prompt
  const promptText = currentPrompt.join('\n').trim()
  if (promptText.length > 0) {
    prompts.push(promptText)
  }

  return prompts
}
```

**Edge cases handled:**
- `---` at the start/end of file → ignored
- Multiple consecutive `---` → empty sections filtered out
- `---` inside ` ``` code blocks ``` ` → ignored
- `---` inside YAML frontmatter → ignored
- Mixed whitespace around `---` → normalized

### Translation Preservation Rules:
1. **Placeholders**: `{{[a-zA-Z0-9-_]+}}` → unchanged
2. **XML tags**: `<[^>]+>` → unchanged
3. **Code blocks**: ` ```...``` ` → unchanged
4. **Git commands**: `git [command]` → unchanged
5. **File paths**: `.ai/...`, `src/...` → unchanged
6. **Tool names**: `file_read`, `file_search` → unchanged
7. **Phase markers**: `PHASE 1`, `PHASE 2` → unchanged
8. **Separator**: `---` inside code blocks → unchanged

### Slug Generation:
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
}
```

## Output Example

**Input:**
```
Module: m4
Collection slug: m4-legacy
Collection title: "M4: Legacy Code Mastery"
Collection description: "Techniques for understanding and modernizing legacy codebases"
Lesson: 4x1
Segment slug: l1-onboarding
Segment title: "Legacy Code Onboarding"
Prompts: 1
Polish title: "Wstępna analiza projektu"
English title: "Initial Project Analysis"
```

**Generated Files:**
```
backup/10xdevs-2ed/prompts/m4/
├── 4x1-1-wstepna-analiza-projektu-pl.md
└── 4x1-1-wstepna-analiza-projektu-en.md
```

**Frontmatter in generated files:**
```yaml
---
title: "Wstępna analiza projektu"  # (or English version)
description: "Interaktywny prompt..."
collection: m4-legacy
segment: l1-onboarding
sort-order: 1
status: published
---
```

## Advantages Over Current Process

### Core Benefits
1. **No HTML parsing** - eliminates missed prompts
2. **Universal** - works for any module (M2-M5)
3. **Interactive** - user controls all metadata with AI assistance
4. **Immediate bilingual output** - no separate split step
5. **Validation built-in** - catches issues before writing
6. **Reusable** - can process additional prompts anytime
7. **Database-ready** - generates SQL seed file for Supabase
8. **End-to-end workflow** - from raw text to database insertion

### Batch Processing Benefits (New)
9. **File-based input** - process 1 to N prompts from single file
10. **Context-aware parsing** - intelligent `---` separator handling
11. **Consistent metadata** - shared lesson/segment data across prompts
12. **Progress tracking** - visual feedback during batch processing
13. **Atomic operations** - all files generated or none (rollback on error)
14. **Efficient workflow** - process entire lessons in one session
15. **Auto-incrementing** - automatic sequence numbering
16. **Batch validation** - validate all prompts together

### AI-Assisted Features
17. **Smart title suggestions** - analyzes prompt content
18. **Description generation** - creates actionable descriptions
19. **Translation consistency** - maintains terminology across prompts
20. **Quality checks** - validates technical element preservation

## Usage Scenarios

### Scenario 1: Batch Processing from Reference File (Recommended)
```
User: "I have a file with 5 prompts from lesson 4x1, segment l1-onboarding, separated by ---"
Assistant: Perfect! Let's use the batch processing workflow.

[Session metadata collection]
- Module: m4
- Collection: m4-legacy, "M4: Legacy Code Mastery"
- Lesson: 4x1
- Segment: l1-onboarding, "Legacy Code Onboarding"
- Starting sequence: 1

[File input]
User provides: ./m4-4x1-l1-prompts.md

[Parsing]
✓ Detected 5 prompts separated by ---
✓ Preview shown, user confirms

[Metadata for each prompt]
For each of 5 prompts:
- AI suggests Polish title/description from content
- User confirms/edits
- AI translates to English
- Auto-generate slug and sequence

[File generation]
✓ Generated 10 files (5 pairs)
✓ Validation passed

[SQL generation]
✓ Generated seed-m4-4x1-l1-prompts.sql with 5 prompts

Result: Complete lesson segment processed in one session
```

### Scenario 2: Adding Missing Prompts (Legacy Approach)
```
User: "I found 2 short prompts in lesson 3x4 that were missed"
Assistant: [Starts Q&A flow]
- Module: m3
- Collection: m3-prod
- Lesson: 3x4
- Segment: l3-testing
- Current max sequence: 7
- Starting sequence: 8

User can either:
A) Paste both prompts separated by ---
B) Provide file with 2 prompts
C) Process one at a time (not recommended)

[Process 2 prompts with shared metadata]
✓ Generated 4 files (2 pairs)
✓ Appended to existing SQL seed
```

### Scenario 3: New Module - Process Multiple Lessons
```
User: "I want to process all 6 lessons from M5, each lesson has 3-5 prompts in separate files"
Assistant: [Batch process each lesson file]

For each lesson (5x1 through 5x6):
- Load lesson file: ./m5-5x{N}-prompts.md
- Detect prompts separated by ---
- Collect metadata for all prompts in lesson
- Generate files for that lesson
- Move to next lesson

Result: Entire module processed with consistent metadata
- 6 lesson files → 30 prompts → 60 files total
- Single SQL seed file for entire M5 module
```

### Scenario 4: Retroactive Correction
```
User: "Prompt 4x1-3 needs better translation"
Assistant: [Re-process single prompt]
Option 1: Edit files directly (faster for minor changes)
Option 2: Re-run workflow for single prompt (recommended for major changes)

If re-running:
- Same session metadata as original
- Sequence number: 3 (to overwrite)
- Update only that prompt pair
- Regenerate SQL or edit manually
```

### Scenario 5: Generate SQL Seed After Processing
```
User: "Now generate the SQL seed file for all M4 prompts"
Assistant: [Scans backup/10xdevs-2ed/prompts/m4/ directory]
Found 45 prompt pairs across 6 lessons (4x1-4x6)
Collections: m4-legacy (1)
Segments: l1-onboarding, l2-analysis, l3-testing, l4-architecture, l5-code-modernization, l6-ddd (6)
Generating SQL seed file...
✓ Created backup/10xdevs-2ed/prompts/m4/seed-m4-prompts.sql
  - 1 collection
  - 6 segments
  - 45 prompts (bilingual)
```

## Success Criteria

### Session Management
✅ Interactive Q&A captures all required metadata
✅ Supports both paste and file-based input methods
✅ Handles 1 to N prompts in single session
✅ Shared metadata across all prompts in session

### Parsing & Processing
✅ Context-aware `---` separator parsing
✅ Ignores separators in code blocks and frontmatter
✅ Filters empty sections automatically
✅ Preserves all technical elements during translation
✅ Auto-generates slugs and sequence numbers

### File Generation
✅ Generates valid frontmatter for both locales (EN/PL)
✅ Creates files matching established naming convention
✅ Batch generates all files atomically
✅ Shows progress indicator during generation

### Validation
✅ Validates output before writing
✅ Checks slug uniqueness within lesson
✅ Verifies EN/PL pair alignment
✅ Provides clear summary of generated files
✅ Reports any issues before completion

### SQL Generation
✅ Optionally generates Supabase seed SQL file
✅ SQL file is idempotent with ON CONFLICT handling
✅ Properly escapes all content for SQL insertion
✅ Maintains bilingual integrity in database schema
✅ Supports session-only or full-directory modes

### Cross-Module Support
✅ Reusable across all modules (M2-M5)
✅ Consistent workflow regardless of module
✅ Maintains naming conventions across modules

## Translation Reference (from M4 Plan)

### Key Translation Pairs:
| Polish | English |
|--------|---------|
| Wstępna analiza projektu | Initial Project Analysis |
| Prompt do analizy modułów | Module Analysis Prompt |
| Prompt do analizy kluczowych plików | Key Files Analysis Prompt |
| Prompt do syntezy i aktualizacji | Onboarding Synthesis Prompt |
| Struktura promptu dla action planu | Action Plan Structure Prompt |
| Struktura promptu dodającego logi | Logging Strategy Prompt |
| Jesteś doświadczonym | You are an experienced |
| Twoim zadaniem jest | Your task is to |
| Zapoznaj się z | Review / Familiarize yourself with |
| Na podstawie | Based on |
| Przeanalizuj | Analyze |
| Utwórz | Create |
| Dla każdego | For each |
| Upewnij się | Ensure |

### M4-Specific Terms:
| Polish | English |
|--------|---------|
| legacy code | legacy code (unchanged) |
| onboarding | onboarding (unchanged) |
| action plan | action plan (unchanged) |
| historia git | git history |
| moduł | module |
| plik | file |
| kontrybutor | contributor |
| analiza | analysis |
| logi | logs / logging |

---

## Quick Reference: Database Schema Bilingual Mapping

### Collections & Segments (NOT bilingual)
- `prompt_collections.title` → Single title (English recommended)
- `prompt_collections.description` → Single description (optional)
- `prompt_collection_segments.title` → Single title (English recommended)
- No description field in segments

### Prompts (BILINGUAL)
- `prompts.title_en` / `prompts.title_pl` → Bilingual titles
- `prompts.description_en` / `prompts.description_pl` → Bilingual descriptions
- `prompts.markdown_body_en` / `prompts.markdown_body_pl` → Bilingual content

### File Frontmatter → Database Mapping
```yaml
# Prompt file frontmatter:
title: "..."           → prompts.title_en or prompts.title_pl
description: "..."     → prompts.description_en or prompts.description_pl
collection: "m4-legacy" → lookup prompt_collections by slug
segment: "l1-onboarding" → lookup prompt_collection_segments by slug
sort-order: 1          → used for segment.sort_order inference
status: published      → prompts.status
# Body → prompts.markdown_body_en or prompts.markdown_body_pl
```

### SQL Generation Checklist
- [ ] Organization ID retrieved (`SELECT id FROM organizations WHERE slug = '10xdevs'`)
- [ ] Collection inserted with single title (not bilingual)
- [ ] Segments inserted with single title (not bilingual)
- [ ] Prompts inserted with bilingual content (_en/_pl suffixes)
- [ ] All foreign keys properly referenced
- [ ] ON CONFLICT clauses for idempotency
- [ ] Dollar-quoting ($$) used for markdown content
- [ ] Single quotes escaped ('') where needed
- [ ] created_at/updated_at set to NOW()
- [ ] created_by set to NULL

---

## Quick Start Example: Complete Batch Workflow

### Step 1: Prepare Your Reference File

Create `m4-4x1-l1-prompts.md`:
```markdown
Jesteś doświadczonym architektem oprogramowania specjalizującym się w analizie systemów legacy.
Twoim zadaniem jest przeprowadzenie wstępnej analizy projektu...

---

Przeanalizuj strukturę katalogów projektu i zidentyfikuj kluczowe moduły.
Dla każdego modułu określ...

---

Na podstawie zebranych informacji, utwórz dokument syntezy.
Dokument powinien zawierać...
```

### Step 2: Run the Workflow

```bash
> "Process prompts from m4-4x1-l1-prompts.md for lesson 4x1, segment l1-onboarding"
```

### Step 3: Interactive Session

The assistant will:
1. Collect session metadata (module, collection, lesson, segment)
2. Parse your file (detects 3 prompts)
3. For each prompt:
   - Suggest Polish title from content
   - Suggest Polish description
   - Translate to English
   - Generate slug
   - Assign sequence number
4. Generate 6 files (3 pairs)
5. Validate all files
6. Optionally generate SQL seed

### Step 4: Result

```
✓ Generated 3 prompt pairs (6 files):
  - 4x1-1-wstepna-analiza-projektu-pl.md / -en.md
  - 4x1-2-analiza-struktury-modulow-pl.md / -en.md
  - 4x1-3-synteza-onboardingu-pl.md / -en.md

✓ Generated SQL seed:
  - seed-m4-4x1-l1-prompts.sql (3 prompts)

Total time: ~5 minutes for 3 prompts
(vs. 15+ minutes doing manually)
```

### Benefits Demonstrated

- **Single file input** → Multiple output files
- **Consistent metadata** → All prompts share lesson/segment info
- **AI assistance** → Titles and descriptions suggested automatically
- **Validation** → All checks passed before writing
- **SQL ready** → Database seed file generated
- **Time saved** → 3x faster than manual processing

---

## Implementation Notes

When implementing this workflow, prioritize:

1. **Robust parsing** - The context-aware separator algorithm is critical
2. **User experience** - Clear progress indicators and error messages
3. **Validation** - Catch issues early before file writing
4. **Idempotency** - SQL files should be re-runnable
5. **Rollback** - If any step fails, don't leave partial state
6. **Logging** - Track what was processed for debugging

The batch processing approach reduces errors, saves time, and ensures consistency across all prompt files and database entries.
