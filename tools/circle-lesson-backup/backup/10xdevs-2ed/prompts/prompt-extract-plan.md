# Prompt Extraction Plan for M3 Module

## Executive Summary

Extract **35 prompts** from 6 HTML lesson files (3x1 through 3x6) in root of `backup/10xdevs-2ed/` and save them as structured markdown files with YAML frontmatter metadata in `backup/10xdevs-2ed/prompts/m3/`.

## Verified Prompt Counts

| File | Lesson | Prompts | Output File | Segment |
|------|--------|---------|-------------|---------|
| 21-3x1_implementacja_uwierzytelniania_z_supabase_auth.html | Authentication with Supabase Auth | **9** | 3x1_prompts.md | l1-auth |
| 22-3x2_test_plan_i_testy_jednostkowe_z_vitest.html | Test Plan & Unit Tests | **3** | 3x2_prompts.md | l2-unit-tests |
| 23-3x3_testy_e2e_z_playwright.html | E2E Tests with Playwright | **7** | 3x3_prompts.md | l3-e2e-tests |
| 24-3x4_refaktoryzacja_projektu_z_ai.html | Project Refactoring with AI | **7** | 3x4_prompts.md | l4-refactor |
| 25-3x5_wdraanie_cicd_z_github_actions.html | CI/CD with GitHub Actions | **2** | 3x5_prompts.md | l5-cicd |
| 26-3x6_wdroenie_na_produkcj.html | Production Deployment | **7** | 3x6_prompts.md | l6-deploy |
| **TOTAL** | | **35** | 6 files | |

## Metadata Schema

Each prompt will have the following YAML frontmatter:

```yaml
---
title: "Descriptive Title"
description: "Brief description of what the prompt does"
collection: m3-prod
segment: [l1-auth|l2-unit-tests|l3-e2e-tests|l4-refactor|l5-cicd|l6-deploy]
sort-order: [0-5]
status: published
---
```

### Segment Mapping
- **3x1** → `l1-auth` (sort-order: 0)
- **3x2** → `l2-unit-tests` (sort-order: 1)
- **3x3** → `l3-e2e-tests` (sort-order: 2)
- **3x4** → `l4-refactor` (sort-order: 3)
- **3x5** → `l5-cicd` (sort-order: 4)
- **3x6** → `l6-deploy` (sort-order: 5)

## Extraction Methodology

### Phase 1: HTML Parsing
1. Read each HTML file
2. Locate all `<pre><code>` blocks
3. Extract content between `<code>` and `</code>` tags
4. Decode HTML entities if present

### Phase 2: Context Analysis
For each extracted prompt:
1. Read surrounding HTML context (h2, h3, p tags)
2. Determine prompt's purpose from context
3. Generate meaningful title and description
4. Identify if prompt relates to planning, implementation, or validation

### Phase 3: Metadata Generation
1. Apply fixed values (collection: m3-prod, status: published)
2. Map lesson number to segment
3. Assign sort-order based on lesson number
4. Generate contextual title and description

### Phase 4: Formatting
1. Add YAML frontmatter to each prompt
2. Separate prompts with 3-4 blank lines
3. Preserve original prompt formatting (code blocks, line breaks)
4. Write to output file

## Output Structure

Each output file will follow this pattern:

```markdown
---
title: "Authentication Architecture Planning"
description: "Prompt for creating detailed authentication system architecture with Supabase Auth"
collection: m3-prod
segment: l1-auth
sort-order: 0
status: published
---

[Prompt content here]



---
title: "Login UI Implementation"
description: "Implement login page and form components"
collection: m3-prod
segment: l1-auth
sort-order: 0
status: published
---

[Prompt content here]
```

## Quality Assurance

### Pre-execution Checks
- ✅ Verified all 6 HTML files exist
- ✅ Verified prompt counts (35 total)
- ✅ Confirmed output directory exists (`prompts/m3/`)
- ✅ Reviewed m2 examples for formatting consistency

### Post-execution Validation
1. Verify 6 output files created
2. Count total prompts across all files (should be 35)
3. Validate YAML frontmatter syntax
4. Check segment assignments
5. Ensure prompts are properly separated
6. Verify no HTML artifacts remain in prompts

## Edge Cases & Considerations

1. **Nested code blocks**: Some prompts may contain nested examples
2. **Multi-line prompts**: Preserve formatting and indentation
3. **Special characters**: Handle HTML entities (&lt;, &gt;, &amp;)
4. **Context ambiguity**: Use surrounding headings for title generation
5. **Empty code blocks**: Skip if encountered
6. **Duplicate content**: Each `<pre><code>` is a separate prompt

## Success Criteria

- [ ] 6 markdown files created in `prompts/m3/`
- [ ] Total of 35 prompts extracted
- [ ] All prompts have valid YAML frontmatter
- [ ] Segments correctly mapped (l1-auth through l6-deploy)
- [ ] Sort-orders correctly assigned (0-5)
- [ ] Prompts properly separated with blank lines
- [ ] Format matches existing m2 examples
- [ ] No HTML artifacts in prompt content

---

This plan ensures comprehensive, accurate extraction of all prompts with proper metadata and formatting consistency with the existing m2 module structure.
