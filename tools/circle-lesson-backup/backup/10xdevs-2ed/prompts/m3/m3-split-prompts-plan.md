# Plan: Split and Localize M3 Prompts Following M2 Pattern

## Overview
Transform aggregated M3 prompt files (`3x1_prompts.md` through `3x6_prompts.md`) into individual, bilingual prompt files matching the M2 naming pattern and structure.

## Current State Analysis

### M2 Pattern (Target):
- **Naming**: `{lesson}-{seq}-{title-slug}-{locale}.md`
- **Example**: `1x1-1-prd-planning-buddy-en.md` / `1x1-1-prd-planning-buddy-pl.md`
- **Frontmatter**: title, description, collection, segment, sort-order, status
- **Localization**: Complete translation of title, description, and content

### M3 Current State:
- **Files**: 6 aggregated files (`3x1_prompts.md` → `3x6_prompts.md`)
- **Format**: Multiple prompts per file, separated by `---`
- **Language**: Polish only
- **Total prompts**: ~24 individual prompts to extract

## Detailed Breakdown by Lesson

### 3x1 (Authentication) - 8 prompts
| Seq | Title | Sort | Suggested Slug |
|-----|-------|------|----------------|
| 1 | Authentication Architecture Specification | 0 | auth-architecture-spec |
| 2 | Authentication Spec Validation | 1 | auth-spec-validation |
| 3 | Authentication Flow Diagram | 2 | auth-flow-diagram |
| 4 | Authentication UI Implementation | 3 | auth-ui-implementation |
| 5 | Login Backend Integration Planning | 4 | login-backend-planning |
| 6 | Logout Functionality Implementation | 5 | logout-implementation |
| 7 | Route Protection Implementation | 6 | route-protection |
| 8 | Signup Backend Implementation | 7 | signup-backend-implementation |

### 3x2 (Unit Tests) - 3 prompts
| Seq | Title | Sort | Suggested Slug |
|-----|-------|------|----------------|
| 1 | Component Structure Visualization | 0 | component-structure-viz |
| 2 | Unit Testing Candidate Analysis | 1 | unit-test-candidates |
| 3 | Unit Tests Implementation | 2 | unit-tests-implementation |

### 3x3 (Unknown/Empty) - 0 prompts
*File appears empty - will investigate during execution*

### 3x4 (Refactoring) - 8 prompts
| Seq | Title | Sort | Suggested Slug |
|-----|-------|------|----------------|
| 1 | Component Complexity Analysis | 0 | component-complexity |
| 2 | React Hook Form Refactoring Plan | 1 | rhf-refactoring-plan |
| 3 | Accessibility Evaluation | 2 | accessibility-evaluation |
| 4 | Mobile Navigation Specification | 3 | mobile-nav-spec |
| 5 | Mobile Navigation Implementation | 4 | mobile-nav-implementation |
| 6 | React 19 Migration Assessment | 5 | react19-migration |
| 7 | Domain-Driven Design Restructuring | 6 | ddd-restructuring |
| 8 | Row Level Security Migration | 7 | rls-migration |

### 3x5 (CI/CD) - 1 prompt
| Seq | Title | Sort | Suggested Slug |
|-----|-------|------|----------------|
| 1 | Pull Request CI/CD Workflow | 0 | pr-cicd-workflow |

### 3x6 (Deployment) - 4 prompts
| Seq | Title | Sort | Suggested Slug |
|-----|-------|------|----------------|
| 1 | Feature Flags System Design | 0 | feature-flags-design |
| 2 | Cloudflare Pages Deployment Setup | 1 | cloudflare-deployment |
| 3 | Docker DigitalOcean Deployment Pipeline | 2 | docker-digitalocean-pipeline |
| 4 | GitHub Action Version Fix | 3 | github-action-fix |

## Translation Strategy

### For English Versions (`-en.md`):
1. **Title**: Translate from Polish to English (professional/technical tone)
2. **Description**: Translate maintaining clarity and technical accuracy
3. **Content**:
   - Translate all instructional text
   - Preserve variable references: `{{project-prd}}`, `{{COMPONENTS}}`
   - Preserve file references: `@project-prd.md`, `@tech-stack.md`
   - Preserve MDC references: `@astro.mdc`, `@react.mdc`, `@vitest-unit-testing.mdc`
   - Keep XML/HTML tag names unchanged
   - Maintain code examples in original form

### For Polish Versions (`-pl.md`):
- Keep original content unchanged
- Extract as-is from source files

## Implementation Steps

### Phase 1: Preparation
1. Create utility script `split-m3-prompts.ts` to automate extraction
2. Read all M3 aggregated files
3. Parse frontmatter and content for each prompt
4. Generate mapping of prompts to target filenames

### Phase 2: Extraction & Polish Files
1. Split each aggregated file into individual prompts
2. Create Polish version files (`3x1-1-auth-architecture-spec-pl.md`, etc.)
3. Validate frontmatter completeness
4. Ensure all references are preserved

### Phase 3: Translation & English Files
1. For each Polish file, create corresponding English file
2. Translate title and description fields
3. Translate prompt content (instructional text only)
4. Preserve all technical references and variable placeholders
5. Review for technical accuracy

### Phase 4: Validation
1. Verify file count: 48 files (24 prompts × 2 locales)
2. Check naming convention compliance
3. Validate frontmatter consistency
4. Ensure sort-order matches across locales
5. Test sample prompts for completeness

### Phase 5: Cleanup
1. Archive original aggregated files (keep as backup)
2. Update any documentation referencing old structure
3. Create index or manifest of all M3 prompts

## Technical Considerations

### Filename Generation Rules:
- Sequential number: 1-based counter within each lesson
- Title slug: Abbreviated, descriptive, kebab-case
- Keep slugs concise (3-5 words max)
- Use common abbreviations: `auth`, `spec`, `impl`, `viz`

### Quality Checks:
- [ ] All frontmatter fields present in both locales
- [ ] Titles and descriptions properly translated
- [ ] Content translated without losing technical meaning
- [ ] Variable/file references intact: `@`, `{{`, `}}`
- [ ] Sort-order identical between locale pairs
- [ ] Status field remains "published"
- [ ] Collection remains "m3-prod"
- [ ] Segments preserved correctly

## Deliverables

**Output**: 48 individual prompt files organized as:
```
backup/10xdevs-2ed/prompts/m3/
├── 3x1-1-auth-architecture-spec-en.md
├── 3x1-1-auth-architecture-spec-pl.md
├── 3x1-2-auth-spec-validation-en.md
├── 3x1-2-auth-spec-validation-pl.md
...
├── 3x6-4-github-action-fix-en.md
└── 3x6-4-github-action-fix-pl.md
```

**Backup**: Original aggregated files moved to `backup/10xdevs-2ed/prompts/m3/_archive/`

## Execution Approach

1. **Tool Creation**: Build TypeScript utility for automated splitting
2. **Manual Review**: Human verification of translations for accuracy
3. **Iterative Process**: Process one lesson at a time for quality control
4. **Testing**: Validate sample prompts work as expected after split

## Translation Quality Standards

### Polish to English Translation Guidelines:
- Use professional technical vocabulary
- Maintain consistency with M2 English terminology
- Preserve imperative/instructional tone
- Keep instructions clear and actionable
- Avoid over-translation of technical terms (e.g., "frontend" stays "frontend")

### Key Translation Pairs (Reference):
| Polish | English |
|--------|---------|
| Jesteś doświadczonym | You are an experienced |
| Twoim zadaniem jest | Your task is to |
| Zapoznaj się z | Review / Familiarize yourself with |
| Utwórz | Create |
| Zaimplementuj | Implement |
| Zadbaj o zgodność | Ensure compliance/compatibility with |
| Weź pod uwagę | Take into account / Consider |
| Pamiętaj o | Remember to / Keep in mind |

## Success Criteria

✅ All 24 prompts successfully split into individual files
✅ Each prompt has both English and Polish versions (48 total files)
✅ Naming convention matches M2 pattern exactly
✅ All frontmatter fields complete and accurate
✅ Technical references preserved (@ and {{ }} syntax)
✅ Translations maintain technical accuracy
✅ Sort-order consistency across locale pairs
✅ Original files archived safely
✅ No regression in prompt functionality
