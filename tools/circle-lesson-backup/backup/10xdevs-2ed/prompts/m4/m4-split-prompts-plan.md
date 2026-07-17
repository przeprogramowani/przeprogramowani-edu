# Plan: Split and Localize M4 Prompts Following M2 Pattern

## Overview
Transform aggregated M4 prompt files (`4x1_prompts.md` and `4x2_prompts.md`) into individual, bilingual prompt files matching the M2 naming pattern and structure.

## Current State Analysis

### M2 Pattern (Target):
- **Naming**: `{lesson}-{seq}-{title-short-slug}-{locale}.md`
- **Example**: `1x1-1-prd-planning-buddy-en.md` / `1x1-1-prd-planning-buddy-pl.md`
- **Frontmatter**: title, description, collection, segment, sort-order, status
- **Localization**: Complete translation of title, description, and content

### M4 Current State:
- **Files**: 5 aggregated files (`4x1_prompts.md` → `4x5_prompts.md`)
- **Files with prompts**: 2 files (4x1, 4x2)
- **Format**: Multiple prompts per file, separated by `---`
- **Language**: Mixed - English content with Polish titles
- **Total prompts**: 7 individual prompts to extract (5 from 4x1, 2 from 4x2)
- **Collection**: `m4-legacy`
- **Segments**: `l1-onboarding`, `l2-analysis`

### M4 Unique Characteristics:
- **Git-focused**: Heavy use of git history analysis placeholders
- **Tool references**: Contains references to `file_read`, `file_search`, `list_dir` tools
- **Placeholders**: Uses `{{top-modules}}`, `{{onboarding.md}}`, `{{issue-description}}`, etc.
- **Context sections**: XML-style tags like `<top_modules>`, `<project_onboarding_doc>`, `<action_plan_development>`
- **Phase-based prompts**: Some prompts use PHASE 1, PHASE 2, PHASE 3 structure

## Detailed Breakdown by Lesson

### 4x1 (Legacy Code Onboarding) - 5 prompts
| Seq | Title (Polish) | Sort | Suggested Slug | Key Focus |
|-----|----------------|------|----------------|-----------|
| 1 | Wstępna analiza projektu | 0 | initial-project-analysis | Git history + module analysis |
| 2 | Prompt do analizy modułów | 1 | module-analysis | Module-level deep dive |
| 3 | Prompt do analizy kluczowych plików | 2 | key-files-analysis | File-level investigation |
| 4 | Prompt do syntezy i aktualizacji dokumentu onboardingowego | 3 | onboarding-synthesis | Documentation update |
| 5 | Prompt do analizy projektów bez rozbudowanej historii git | 4 | no-git-history-analysis | Alternative onboarding |

### 4x2 (Legacy Code Analysis) - 2 prompts
| Seq | Title (Polish) | Sort | Suggested Slug | Key Focus |
|-----|----------------|------|----------------|-----------|
| 1 | Struktura promptu dla action planu | 0 | action-plan-structure | Issue investigation |
| 2 | Struktura promptu dodającego logi do kluczowych plików | 1 | logging-strategy | Debug logging |

### 4x3 (Regression Testing) - 0 prompts
*No extractable prompts - lesson references external repository (10x-test-planner)*

### 4x4 (Code Modernization) - 0 prompts
*No extractable prompts - lesson focuses on codemods and refactoring techniques*

### 4x5 (Architecture Modernization) - 0 prompts
*No extractable prompts - lesson covers DDD concepts and architecture patterns*

## Translation Strategy

### For English Versions (`-en.md`):
1. **Title**: Translate from Polish to English (professional/technical tone)
   - "Wstępna analiza projektu" → "Initial Project Analysis"
   - "Prompt do analizy modułów" → "Module Analysis Prompt"
   - "Struktura promptu dla action planu" → "Action Plan Structure Prompt"

2. **Description**: Translate maintaining clarity and technical accuracy

3. **Content**:
   - **Preserve placeholders**: `{{top-modules}}`, `{{onboarding.md}}`, `{{issue-description}}`
   - **Preserve XML tags**: `<top_modules>`, `<project_onboarding_doc>`, `<action_plan_development>`
   - **Preserve tool names**: `file_read`, `file_search`, `list_dir`
   - **Preserve git commands**: Keep git command syntax unchanged
   - **Translate instructions**: Convert Polish instructional text to English
   - **Preserve markdown structure**: Code blocks, lists, headings
   - **Keep phase markers**: "PHASE 1", "PHASE 2", "PHASE 3"

4. **Special Considerations**:
   - Git command comments: Translate Polish comments in git commands
   - File references: Keep `.ai/onboarding.md`, `.ai/{issue-name}-action-plan.md` unchanged
   - Technical terms: "onboarding", "legacy code", "action plan" stay as-is

### For Polish Versions (`-pl.md`):
- Keep original content unchanged
- Extract as-is from source files
- Preserve all frontmatter and formatting

## Implementation Steps

### Phase 1: Preparation
1. Create utility script `split-m4-prompts.ts` to automate extraction
2. Read both M4 aggregated files (4x1, 4x2)
3. Parse frontmatter and content for each prompt
4. Generate mapping of prompts to target filenames
5. Validate segment assignments (l1-onboarding vs l2-analysis)

### Phase 2: Extraction & Polish Files
1. Split each aggregated file into individual prompts
2. Create Polish version files:
   - `4x1-1-initial-project-analysis-pl.md`
   - `4x1-2-module-analysis-pl.md`
   - `4x1-3-key-files-analysis-pl.md`
   - `4x1-4-onboarding-synthesis-pl.md`
   - `4x1-5-no-git-history-analysis-pl.md`
   - `4x2-1-action-plan-structure-pl.md`
   - `4x2-2-logging-strategy-pl.md`
3. Validate frontmatter completeness
4. Ensure all placeholders and references are preserved

### Phase 3: Translation & English Files
1. For each Polish file, create corresponding English file
2. Translate title fields:
   ```yaml
   # Polish
   title: "Wstępna analiza projektu"

   # English
   title: "Initial Project Analysis"
   ```
3. Translate description fields (if not empty)
4. Translate prompt content:
   - Instructional text
   - Section headings
   - Comments and explanations
5. Preserve all technical elements:
   - Placeholders: `{{variable-name}}`
   - XML tags: `<tag_name>` ... `</tag_name>`
   - Tool names: `file_read`, `git log`
   - Code blocks and commands
6. Review for technical accuracy

### Phase 4: Validation
1. **File count check**: Verify 14 files (7 prompts × 2 locales)
2. **Naming convention**: Confirm `4x{lesson}-{seq}-{slug}-{locale}.md` pattern
3. **Frontmatter validation**:
   - All required fields present
   - Collection = `m4-legacy`
   - Segments = `l1-onboarding` or `l2-analysis`
   - Sort-order sequential within each lesson
   - Status = `published`
4. **Content integrity**:
   - All placeholders intact: `{{...}}`
   - All XML tags preserved: `<...>...</...>`
   - Git commands unchanged
   - Tool references preserved
5. **Translation quality**:
   - Titles translated accurately
   - Instructions clear and actionable
   - Technical terms consistent with M2/M3

### Phase 5: Cleanup
1. Archive original aggregated files:
   - Move to `backup/10xdevs-2ed/prompts/m4/_archive/`
   - Keep `4x3_prompts.md`, `4x4_prompts.md`, `4x5_prompts.md` (documentation only)
   - Archive `4x1_prompts.md` and `4x2_prompts.md`
2. Update `README.md` to reflect new structure
3. Create manifest/index of all M4 prompts

## Technical Considerations

### Filename Generation Rules:
- **Lesson prefix**: `4x1`, `4x2` (matches lesson numbers)
- **Sequential number**: 1-based counter within each lesson
- **Title slug**: Descriptive, kebab-case, 2-4 words
- **Locale suffix**: `-en` or `-pl`
- **Use abbreviations**: `analysis`, `plan`, `structure`, `onboarding`

### Segment Assignment:
- **l1-onboarding**: All 5 prompts from 4x1
  - Focus: Understanding legacy codebases
  - Tools: Git history, file exploration, documentation
- **l2-analysis**: Both 2 prompts from 4x2
  - Focus: Debugging and issue resolution
  - Tools: Action plans, logging strategies

### Placeholder Preservation:
All M4 prompts use placeholders that must be preserved exactly:
- `{{top-modules}}` - Git script output for modules
- `{{top-files}}` - Git script output for files
- `{{top-contributors}}` - Git script output for contributors
- `{{onboarding.md}}` - Reference to onboarding document
- `{{issue-description}}` - Issue/bug description
- `{{action-plan}}` - Reference to action plan file
- `{{investigation-questions}}` - Questions from action plan
- `{{suggested-files}}` - Files suspected of bug

### Quality Checks:
- [ ] All frontmatter fields present in both locales
- [ ] Titles and descriptions properly translated
- [ ] Content translated without losing technical meaning
- [ ] Placeholders intact: `{{`, `}}`
- [ ] XML tags intact: `<tag>`, `</tag>`
- [ ] Git commands unchanged
- [ ] Tool references preserved: `file_read`, `file_search`, `list_dir`
- [ ] Sort-order identical between locale pairs
- [ ] Status field remains "published"
- [ ] Collection remains "m4-legacy"
- [ ] Segments correctly assigned (l1-onboarding, l2-analysis)
- [ ] Phase markers preserved (PHASE 1, PHASE 2, PHASE 3)

## Deliverables

**Output**: 14 individual prompt files organized as:
```
backup/10xdevs-2ed/prompts/m4/
├── 4x1-1-initial-project-analysis-en.md
├── 4x1-1-initial-project-analysis-pl.md
├── 4x1-2-module-analysis-en.md
├── 4x1-2-module-analysis-pl.md
├── 4x1-3-key-files-analysis-en.md
├── 4x1-3-key-files-analysis-pl.md
├── 4x1-4-onboarding-synthesis-en.md
├── 4x1-4-onboarding-synthesis-pl.md
├── 4x1-5-no-git-history-analysis-en.md
├── 4x1-5-no-git-history-analysis-pl.md
├── 4x2-1-action-plan-structure-en.md
├── 4x2-1-action-plan-structure-pl.md
├── 4x2-2-logging-strategy-en.md
└── 4x2-2-logging-strategy-pl.md
```

**Archive**: Original aggregated files in `backup/10xdevs-2ed/prompts/m4/_archive/`
```
_archive/
├── 4x1_prompts.md (5 prompts)
└── 4x2_prompts.md (2 prompts)
```

**Documentation**: Keep as reference (no extraction needed)
```
4x3_prompts.md (references external repo)
4x4_prompts.md (no extractable prompts)
4x5_prompts.md (no extractable prompts)
README.md (extraction summary)
```

## Execution Approach

1. **Tool Creation**: Build TypeScript utility for automated splitting
   - Parse frontmatter with YAML parser
   - Split on `---` delimiters
   - Generate filenames from slugs
   - Preserve exact formatting

2. **Manual Translation**: Human verification of translations for accuracy
   - Focus on instructional clarity
   - Maintain technical precision
   - Ensure consistency with M2/M3 terminology

3. **Iterative Process**: Process one lesson at a time for quality control
   - Complete 4x1 (5 prompts) first
   - Then 4x2 (2 prompts)
   - Validate after each lesson

4. **Testing**: Validate sample prompts work as expected after split
   - Test placeholder substitution
   - Verify XML tag parsing
   - Check git command execution

## Translation Quality Standards

### Polish to English Translation Guidelines:
- Use professional technical vocabulary
- Maintain consistency with M2/M3 English terminology
- Preserve imperative/instructional tone
- Keep instructions clear and actionable
- Avoid over-translation of technical terms

### Key Translation Pairs (Reference):
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

## Success Criteria

✅ All 7 prompts successfully split into individual files
✅ Each prompt has both English and Polish versions (14 total files)
✅ Naming convention matches M2 pattern exactly
✅ All frontmatter fields complete and accurate
✅ Collection set to `m4-legacy`
✅ Segments correctly assigned (`l1-onboarding`, `l2-analysis`)
✅ Placeholders preserved: `{{variable-name}}`
✅ XML tags preserved: `<tag_name>...</tag_name>`
✅ Git commands unchanged
✅ Tool references preserved
✅ Translations maintain technical accuracy
✅ Sort-order consistency across locale pairs
✅ Original files archived safely
✅ No regression in prompt functionality
✅ Phase markers preserved in multi-phase prompts

## Differences from M3 Split

| Aspect | M3 | M4 |
|--------|----|----|
| Total prompts | 24 | 7 |
| Total files | 48 | 14 |
| Collection | m3-prod | m4-legacy |
| Segments | Lesson-based (3x1-auth, 3x2-tests, etc.) | Theme-based (l1-onboarding, l2-analysis) |
| Content type | Implementation prompts | Analysis/diagnostic prompts |
| Placeholders | Project refs (`{{project-prd}}`) | Git refs (`{{top-modules}}`) |
| Tools | Code generation | Code exploration |
| Complexity | Implementation details | Investigation workflows |

## Notes

- M4 has fewer prompts than M3 (7 vs 24) but they are longer and more complex
- M4 prompts are workflow-oriented (multi-step analysis processes)
- Three lessons (4x3, 4x4, 4x5) have no extractable prompts by design
- Git history analysis is central to M4 prompts
- XML-style tags are used extensively for context organization
- Some prompts include multi-phase structures that must be preserved
