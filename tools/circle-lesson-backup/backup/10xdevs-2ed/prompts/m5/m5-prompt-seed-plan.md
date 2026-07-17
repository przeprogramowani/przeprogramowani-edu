# Plan: Generate Supabase Seed File for 10xDevs M5 Prompts

## Overview
Parse markdown prompt files from `backup/10xdevs-2ed/prompts/m5/` and generate a Supabase seed SQL file that populates the database with bilingual prompts (EN/PL) for the M5 (Innovation) course module.

## Database Structure Analysis

### Tables to populate:
- `prompt_collections` - Collection groupings (e.g., "m5-innovation")
- `prompt_collection_segments` - Segments within collections (e.g., "l2-mcp")
- `prompts` - Individual prompts with bilingual content (en/pl)

### File Naming Pattern:
- `{lesson}-{seq}-{slug}-en.md` + `{lesson}-{seq}-{slug}-pl.md` → 1 prompt row
- Example: `5x2-1-mcp-server-planning-en.md` + `5x2-1-mcp-server-planning-pl.md`

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
- `m5-innovation` (Innovation module)
  - Title: "M5 Innovation"
  - Description: "Extending AI capabilities through llms.txt documentation, Model Context Protocol (MCP) servers, AI agents in CI/CD pipelines, and model evaluation frameworks for AI-assisted development"

### Segments:
1. **l2-mcp** (3 prompts)
   - Title: "Model Context Protocol"
   - Description: "Designing and implementing MCP servers for extending Claude's capabilities with custom tools, resources, and data sources"
   - Sort order: 1

### Total: 3 prompts × 2 locales = 6 files

## Detailed Prompt Breakdown

### L2: Model Context Protocol (5x2-*) - 3 prompts
| Sort | Slug | Title (EN) | Title (PL) |
|------|------|------------|------------|
| 0 | mcp-server-planning | MCP Server Planning | MCP Server Planning |
| 1 | mcp-implementation-plan | MCP Implementation Plan Creation | MCP Implementation Plan Creation |
| 2 | mcp-server-implementation | MCP Server Implementation | MCP Server Implementation |

**Note**: Titles are identical in both locales (technical terminology kept in English)

## Implementation Steps

1. **Parse all markdown files**
   - Scan `backup/10xdevs-2ed/prompts/m5/` directory
   - Extract frontmatter (using gray-matter or similar) and body from each file
   - Handle both `-en.md` and `-pl.md` variants
   - Exclude `_archive/` subdirectory and documentation-only files

2. **Group by base filename**
   - Pair EN/PL versions together (e.g., `5x2-1-mcp-server-planning-{en,pl}.md`)
   - Extract metadata: lesson (5x2), sequence (1), slug (mcp-server-planning)

3. **Extract collection and segments**
   - Collection: `m5-innovation`
   - Segment from frontmatter `segment` field: l2-mcp
   - Map segment to human-readable titles and descriptions

4. **Generate seed SQL** with structure:
   ```sql
   -- Get 10xdevs org ID
   DO $$
   DECLARE
       org_id UUID;
       collection_id UUID;
       segment_l2_id UUID;
   BEGIN
       -- Lookup organization
       SELECT id INTO org_id FROM organizations WHERE slug = '10xdevs';

       -- Insert/update collection
       INSERT INTO prompt_collections (organization_id, slug, title_en, title_pl, description_en, description_pl, status)
       VALUES (
           org_id,
           'm5-innovation',
           'M5 Innovation',
           'Moduł 5: Innowacyjne podejścia do AI',
           'Extending AI capabilities through llms.txt documentation, Model Context Protocol (MCP) servers, AI agents in CI/CD pipelines, and model evaluation frameworks for AI-assisted development',
           'Rozszerzanie możliwości AI poprzez dokumentację llms.txt, serwery Model Context Protocol (MCP), agenty AI w CI/CD oraz frameworki ewaluacji modeli dla AI-assisted development',
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

       -- Insert/update segment (l2-mcp)
       -- ... (similar pattern)

       -- Insert prompts with bilingual content
       -- ... (for each of 3 prompts)
   END $$;
   ```

5. **Handle sort_order**
   - Use frontmatter `sort-order` field to order prompts within segments
   - L2 segment: 0-2 (3 prompts)

6. **Output format**
   - Create `supabase/seed-prompts-10xdevs-m5.sql`
   - Follow existing seed file patterns from M2, M3, and M4
   - Use `ON CONFLICT DO UPDATE` for idempotency
   - Special SQL escaping for M5-specific content (MCP terminology, SDK references)

## Technical Details

### SQL Generation Considerations:
- Use `ON CONFLICT DO UPDATE` for idempotency (can re-run seed safely)
- **M5-Specific Escaping Requirements**:
  - XML tags: `<tech_stack>`, `<session_notes>`, `<mcp_server_planning_output>`, `<pytania>`, `<rekomendacje>`, `<implementation_plan>`, `<implementation_rules>`, `<implementation_approach>` must be preserved
  - Placeholders: `{{tech-stack}}`, `{{session-notes}}`, `{{implementation-plan}}`, `{{sciezka}}`, `{{implementation-rules}}` must be preserved
  - SDK references: `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `McpAgent`, `tool()`, `init()`, `execute` must be preserved
  - File paths: `.ai/mcp-implementation-plan.md`, `mcp-server/src`, `wrangler.jsonc` must be preserved
  - TypeScript/JS code: `new McpServer()`, `this.server.tool()`, `inputSchema`, `outputSchema`, `safeParse`
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
- `5x2-1-mcp-server-planning-en.md`
- `5x2-1-mcp-server-planning-pl.md`

### Frontmatter (English version):
```yaml
---
title: "MCP Server Planning"
description: "Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy."
collection: m5-innovation
segment: l2-mcp
sort-order: 0
status: published
---
```

### Frontmatter (Polish version):
```yaml
---
title: "MCP Server Planning"
description: "Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy."
collection: m5-innovation
segment: l2-mcp
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
    segment_l2_id,
    'MCP Server Planning',
    'MCP Server Planning',
    'Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy.',
    'Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy.',
    $$You are an AI assistant whose task is to help plan the tools, resources, prompts, and overall structure of an MCP (Model Context Protocol) server for an MCP server MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to implement the MCP server, its tools, and logic.

Please carefully review the following information:

<tech_stack>
{{tech-stack}}
</tech_stack>

[... rest of English prompt content ...]$$,
    $$Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu narzędzi, zasobów, promptów i ogólnej struktury serwera MCP (Model Context Protocol) dla MVP serwera MCP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do zaimplementowania serwera MCP, jego narzędzi oraz logiki.

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<tech_stack>
{{tech-stack}}
</tech_stack>

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

## M5 Unique Characteristics

### Content Features to Preserve:
1. **XML-style Context Tags**: `<tech_stack>`, `<session_notes>`, `<mcp_server_planning_output>`, `<pytania>`, `<rekomendacje>`, `<implementation_plan>`, `<implementation_rules>`, `<implementation_approach>`
2. **Dynamic Placeholders**: `{{tech-stack}}`, `{{session-notes}}`, `{{implementation-plan}}`, `{{sciezka}}`, `{{implementation-rules}}`
3. **SDK References**: `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `McpAgent`
4. **Method Names**: `tool()`, `init()`, `execute`, `fetch`, `this.server.tool()`
5. **Schema References**: `inputSchema`, `outputSchema`, `safeParse`, Zod
6. **File Path References**: `.ai/mcp-implementation-plan.md`, `mcp-server/src`, `wrangler.jsonc`, `wrangler.toml`
7. **Deployment Tools**: Cloudflare Workers, `@modelcontextprotocol/inspector`
8. **Data Structures**: `{ content: [...] }`, JSON-RPC protocol
9. **TypeScript Code**: Class definitions, type annotations, imports

### Special SQL Escaping Needs:
- **XML Tags**: Must preserve `<` and `>` characters within dollar-quoted strings
- **Double Braces**: Must preserve `{{` and `}}` for placeholder syntax
- **Code Blocks**: Multi-line markdown code blocks with backticks
- **SDK Paths**: NPM package paths with `@` symbols and version references
- **TypeScript Syntax**: Arrow functions, async/await, class methods

## Key Differences from M2/M3/M4

| Aspect | M2 (Bootstrap) | M3 (Production) | M4 (Legacy) | M5 (Innovation) |
|--------|----------------|-----------------|-------------|-----------------|
| Collection slug | `m2-bootstrap` | `m3-prod` | `m4-legacy` | `m5-innovation` |
| Total prompts | ~30 | 24 | 7 | **3** |
| Segments | 6 lesson-based | 5 lesson-based | 2 theme-based | **1 topic-based** |
| File prefix | `1x*-`, `2x*-` | `3x*-` | `4x*-` | `5x*-` |
| Focus | Building new apps | Production readiness | Legacy code analysis | **MCP architecture** |
| Prompt type | Implementation | Advanced patterns | Investigation/debugging | **Design & architecture** |
| Content style | Direct instructions | Multi-step workflows | Analysis frameworks | **Sequential workflow** |
| Placeholders | `@file.md` refs | Project docs | Git data, XML contexts | **MCP refs, SDK paths** |
| Tools used | Code generation | Testing, deployment | Git, file exploration | **MCP SDK, TypeScript** |
| Avg length | Medium | Medium-long | Long (workflow-based) | **Very long (architectural)** |
| Lessons with prompts | 5 | 8 | 2 | **1** |

## Validation Checklist

Before finalizing the seed file:

- [ ] All 6 files successfully parsed (3 EN + 3 PL)
- [ ] All locale pairs correctly matched
- [ ] Frontmatter fields extracted: title, description, collection, segment, sort-order, status
- [ ] Markdown bodies preserved with proper escaping
- [ ] Collection metadata complete (title EN/PL, description EN/PL)
- [ ] Segment created with proper title and sort order
- [ ] Sort order sequential within segment (0, 1, 2)
- [ ] SQL syntax valid (test with `psql --dry-run` or similar)
- [ ] Idempotency verified (can run seed multiple times safely)
- [ ] **M5-Specific Checks**:
  - [ ] XML tags preserved: `<tech_stack>`, `<session_notes>`, `<mcp_server_planning_output>`, etc.
  - [ ] Placeholders preserved: `{{tech-stack}}`, `{{session-notes}}`, `{{implementation-plan}}`, etc.
  - [ ] SDK references intact: `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `McpAgent`
  - [ ] Method names preserved: `tool()`, `init()`, `execute`, `this.server.tool()`
  - [ ] Schema references intact: `inputSchema`, `outputSchema`, `safeParse`
  - [ ] File path references intact: `.ai/mcp-implementation-plan.md`, `mcp-server/src`
  - [ ] Configuration files preserved: `wrangler.jsonc`, `wrangler.toml`
  - [ ] TypeScript code blocks intact
- [ ] Special characters properly escaped within dollar-quoted strings

## Next Steps

1. **Create seed generator script** (`generate-m5-seed.ts`)
   - Parse M5 individual prompt files (6 files)
   - Exclude `_archive/` directory
   - Extract and group by locale pairs
   - Generate SQL according to this plan
   - Handle M5-specific escaping requirements (MCP, SDK, TypeScript)

2. **Generate SQL file** (`supabase/seed-prompts-10xdevs-m5.sql`)
   - Run generator script
   - Review output for correctness
   - Verify XML tags, placeholders, and SDK references are intact

3. **Test seed file**
   - Run against local Supabase instance
   - Verify prompt count: 3 prompts
   - Verify segment distribution: 3 (l2-mcp)
   - Check bilingual content integrity
   - Test placeholder substitution works correctly
   - Verify MCP SDK references are functional

4. **Document seed process**
   - Update README with M5 seed instructions
   - Document any manual adjustments made
   - Note differences from M2/M3/M4 seed process

## Files to Process

### Include (6 files):
```
5x2-1-mcp-server-planning-en.md
5x2-1-mcp-server-planning-pl.md
5x2-2-mcp-implementation-plan-en.md
5x2-2-mcp-implementation-plan-pl.md
5x2-3-mcp-server-implementation-en.md
5x2-3-mcp-server-implementation-pl.md
```

### Exclude:
- `_archive/` directory (original aggregated file: `5x2_prompts.md`)
- `5x3_prompts.md` (empty - no prompts)
- `5x4_prompts.md` (empty - no prompts)
- `M5_EXTRACTION_SUMMARY.md` (documentation)
- `m5-extract-plan.md` (planning doc)
- `m5-split-prompts-plan.md` (planning doc)
- `extract-m5-prompts.ts` (script)
- `improve-m5-metadata.ts` (script)

## Notes

- **Smallest module**: M5 has the fewest prompts (only 3) compared to all other modules
- **Single segment**: Unlike M2/M3/M4, M5 has only 1 segment (by design)
- **Single lesson with prompts**: Only 5x2 (MCP) has prompts, lessons 5x1, 5x3, 5x4, 5x5 have none
- **Titles identical**: English and Polish versions use same titles (technical terminology)
- **Descriptions identical**: English descriptions used in both locales (technical content)
- **Highly technical**: Heavy MCP SDK and TypeScript focus
- **Sequential workflow**: 3 prompts form a complete workflow (Planning → Plan → Implementation)
- **MCP-centric**: All prompts about Model Context Protocol server development
- **Longer prompts**: M5 prompts are architectural/design-focused and significantly longer than M2/M3
- **File references**: Heavy use of `.ai/mcp-implementation-plan.md` for workflow coordination
- **Deployment-specific**: Cloudflare Workers configuration and deployment
- **SDK integration**: Deep integration with `@modelcontextprotocol/sdk` package

## M5 Workflow Pattern

The 3 prompts follow a sequential workflow pattern:

**Phase 1: Planning (Prompt 1)**
- Input: Project tech stack description
- Output: Planning questions and recommendations
- File: None (output to conversation)

**Phase 2: Implementation Plan (Prompt 2)**
- Input: Planning session notes + tech stack
- Output: Detailed implementation plan document
- File: `.ai/mcp-implementation-plan.md`

**Phase 3: Implementation (Prompt 3)**
- Input: Implementation plan + implementation rules
- Output: Complete MCP server code
- File: Code in `mcp-server/src/`

This workflow must be preserved in the seed data structure and documentation.

---

**Source files**: `backup/10xdevs-2ed/prompts/m5/*.md` (6 individual bilingual files)
**Target output**: `supabase/seed-prompts-10xdevs-m5.sql`
**Based on**: M4 seed plan pattern (m4-prompt-seed-plan.md)
**Date**: 2025-10-26
