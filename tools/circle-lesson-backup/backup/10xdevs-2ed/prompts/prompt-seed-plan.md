# Plan: Generate Supabase Seed File for 10xDevs Prompts

## Overview
Parse markdown prompt files from `.ai/prompt-library/prompts10xDevs/` and generate a Supabase seed SQL file that populates the database with bilingual prompts (EN/PL).

## Database Structure Analysis

### Tables to populate:
- `prompt_collections` - Collection groupings (e.g., "m2-bootstrap")
- `prompt_collection_segments` - Segments within collections (e.g., "l1-planning", "l2-rules-for-ai")
- `prompts` - Individual prompts with bilingual content (en/pl)

### File Naming Pattern:
- `{prefix}-{num}-{slug}-en.md` + `{prefix}-{num}-{slug}-pl.md` → 1 prompt row
- Example: `1x1-1-prd-planning-buddy-en.md` + `1x1-1-prd-planning-buddy-pl.md`

### Frontmatter → Database Mapping:
```yaml
frontmatter.title → prompts.title_en / title_pl
frontmatter.description → prompts.description_en / description_pl
frontmatter.collection → prompt_collections.slug
frontmatter.segment → prompt_collection_segments.slug
frontmatter.sort-order → determine prompt order
frontmatter.status → prompts.status
markdown body → prompts.markdown_body_en / markdown_body_pl
```

## Discovered Structure

### Collection:
- `m2-bootstrap` (need proper title/description)

### Segments:
- `l1-planning`
- `l2-rules-for-ai`
- `l3-database`
- `l4-api`
- `l5-ui`
- `l6-business-logic`

## Implementation Steps

1. **Parse all markdown files** - Extract frontmatter and body from each file
2. **Group by base filename** - Pair EN/PL versions together
3. **Extract unique collections/segments** - Determine proper titles from context
4. **Generate seed SQL** with structure:
   - Get 10xdevs org ID
   - Insert/update collection with proper title
   - Insert/update segments with titles and sort_order
   - Insert prompts with bilingual content
5. **Handle sort_order** - Use frontmatter sort-order to order prompts within segments
6. **Output format** - Create `supabase/seed-prompts-10xdevs.sql` following existing seed file patterns

## Technical Details

- Use `ON CONFLICT DO UPDATE` for idempotency
- Proper escaping for SQL strings (especially markdown content with quotes)
- Maintain organization_id reference throughout
- Set created_by to NULL (can be updated later)
- Default status from frontmatter or 'published'

## Database Schema Reference

### prompts table columns:
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

Files:
- `1x1-1-prd-planning-buddy-en.md`
- `1x1-1-prd-planning-buddy-pl.md`

Becomes one prompt row:
- `title_en`: "PRD Planning Assistant"
- `title_pl`: "Asystent planowania PRD"
- `description_en`: "Interactive planning session for creating..."
- `description_pl`: "Interaktywna sesja planistyczna do tworzenia..."
- `collection_id`: (lookup from 'm2-bootstrap')
- `segment_id`: (lookup from 'l1-planning')
- `sort_order`: 0
- `status`: 'published'
