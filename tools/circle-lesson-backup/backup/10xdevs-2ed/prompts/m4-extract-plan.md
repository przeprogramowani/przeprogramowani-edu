# M4 Prompt Extraction Plan

## 🎯 Objective

Extract AI prompts from Module 4 (Legacy Code) HTML lesson files and convert them into structured markdown files with metadata for the course management system.

## 📋 Task Overview

**Source Files:**
- `backup/10xdevs-2ed/27-4x1_zrozumie_legacy_code_onboarding.html`
- `backup/10xdevs-2ed/28-4x2_zrozumie_legacy_code_analiza_kodu.html`
- `backup/10xdevs-2ed/29-4x3_testy_regresji_z_multimodalnym_ai.html`
- `backup/10xdevs-2ed/31-4x4_modernizacja_kodu_aplikacji_ai_vs_codemods.html`
- `backup/10xdevs-2ed/30-4x5_modernizacja_architektury_z_domaindriven_design.html`

**Target Output:**
```
backup/10xdevs-2ed/prompts/m4/
├── 4x1_prompts.md  (all prompts from 4x1 lesson)
├── 4x2_prompts.md  (all prompts from 4x2 lesson)
├── 4x3_prompts.md
├── 4x4_prompts.md
└── 4x5_prompts.md
```

## 🔍 Analysis Findings

### File Content Analysis

**Example from 4x1:**
- 19 `<pre><code>` blocks identified
- Mix of:
  - ✅ AI Prompts (large instructional text for LLMs)
  - ❌ Git commands/scripts
  - ❌ PowerShell scripts
  - ❌ Configuration examples

**Prompt Identification Criteria:**
- Starts with "You are..." or "Your task is..."
- Contains XML-style tags (`<project_description>`, `<thinking>`)
- Contains template variables (`{{variable}}`)
- Length > 500 characters
- Instructional tone, not executable code
- Usually preceded by explanatory heading

### Metadata Structure

**Required Frontmatter:**
```yaml
---
title: "Prompt Title"
description: "What this prompt does"
collection: m4-legacy
segment: l1-onboarding  # varies by lesson
sort-order: 0  # incremental
status: published
---
```

**Segment Mapping:**
```javascript
{
  '4x1': 'l1-onboarding',
  '4x2': 'l2-analysis',
  '4x3': 'l3-regression',
  '4x4': 'l4-code-modern',
  '4x5': 'l5-arch-modern'
}
```

### Reference Pattern (from m3)

Based on `backup/10xdevs-2ed/prompts/m3/_archive/3x1_prompts.md`:
- Multiple prompts per file
- Separated by `---` dividers
- Empty lines between sections
- Each prompt has complete frontmatter
- Sequential sort-order within file

## 📊 Implementation Strategy

### Phase 1: HTML Parsing & Classification

**For each HTML file (4x1-4x5):**

1. **Parse HTML structure**
   - Load and parse HTML content
   - Extract all `<pre><code>` blocks

2. **Extract context**
   - Find preceding `<h2>`, `<h3>` headings
   - Find preceding `<p>` paragraphs
   - Build context map for each code block

3. **Classify content**
   - Check length (prompts typically > 500 chars)
   - Check for prompt patterns:
     - "You are" / "Your task" / "Your goal"
     - `<thinking>`, `<exploration>`, etc.
     - `{{variables}}`
   - Check context headings for keywords
   - Filter out: git commands, shell scripts, config examples

### Phase 2: Extraction & Transformation

**For each identified prompt:**

1. **Clean content**
   - Decode HTML entities (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`)
   - Normalize whitespace
   - Preserve formatting and line breaks

2. **Extract metadata**
   - **Title**: From preceding heading OR first line OR infer from content
   - **Description**: From preceding paragraph OR first 2-3 sentences of prompt OR summarize purpose
   - **Collection**: Always `m4-legacy`
   - **Segment**: Map from lesson number (4x1 → l1-onboarding, etc.)
   - **Sort-order**: Sequential from 0 within each lesson
   - **Status**: Always `published`

3. **Validate metadata**
   - Ensure title is unique within file
   - Description is concise (1-2 sentences)
   - All required fields present

### Phase 3: Assembly & Output

**For each lesson:**

1. **Group prompts**
   - Sort by appearance order in HTML
   - Assign sequential sort-order

2. **Generate output**
   ```markdown
   ---
   title: "First Prompt Title"
   description: "First prompt description"
   collection: m4-legacy
   segment: l1-onboarding
   sort-order: 0
   status: published
   ---

   [First prompt content]



   ---
   title: "Second Prompt Title"
   description: "Second prompt description"
   collection: m4-legacy
   segment: l1-onboarding
   sort-order: 1
   status: published
   ---

   [Second prompt content]
   ```

3. **Write files**
   - Create `backup/10xdevs-2ed/prompts/m4/` directory if needed
   - Write `4x1_prompts.md`, `4x2_prompts.md`, etc.
   - Ensure UTF-8 encoding (preserve Polish characters: ł, ą, ę, ś, ź, ż, ć, ń)

### Phase 4: Validation

**Quality checks:**

- [ ] All 5 HTML files processed
- [ ] All 5 output markdown files created
- [ ] Only actual prompts extracted (no code snippets)
- [ ] All prompts have valid YAML frontmatter
- [ ] Polish characters preserved correctly
- [ ] Segment mapping correct for each lesson
- [ ] Sort-order sequential within each file (0, 1, 2, ...)
- [ ] No HTML entities remaining in content
- [ ] Proper markdown formatting maintained
- [ ] Empty lines between prompts (3 blank lines)
- [ ] Titles are unique and descriptive
- [ ] Descriptions are concise and clear

## ⚠️ Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Mixed content in code blocks** | Use pattern matching + length checks + context analysis |
| **Polish characters (ł, ą, ę)** | Ensure UTF-8 encoding throughout pipeline |
| **Extracting meaningful titles** | Use headings > paragraphs > first line > inference |
| **HTML entity decoding** | Systematic replacement: `&lt;` → `<`, `&gt;` → `>`, etc. |
| **Inconsistent HTML structure** | Flexible parsing with fallbacks |
| **Title uniqueness** | Add context/numbering if needed |
| **Missing descriptions** | Infer from prompt content or use generic description |

## 📈 Expected Outcomes

**Estimated Prompts:**
- 4x1 (Onboarding): ~3-5 prompts
- 4x2 (Analysis): ~3-5 prompts
- 4x3 (Regression): ~3-5 prompts
- 4x4 (Code Modern): ~3-5 prompts
- 4x5 (Arch Modern): ~3-5 prompts
- **Total**: ~15-25 prompts across all 5 lessons

**File Structure:**
```
backup/10xdevs-2ed/prompts/m4/
├── 4x1_prompts.md  (Onboarding prompts with l1-onboarding segment)
├── 4x2_prompts.md  (Analysis prompts with l2-analysis segment)
├── 4x3_prompts.md  (Regression prompts with l3-regression segment)
├── 4x4_prompts.md  (Code modernization prompts with l4-code-modern segment)
└── 4x5_prompts.md  (Architecture prompts with l5-arch-modern segment)
```

## 🔬 Quality Assurance

**Each prompt must have:**
- ✅ Valid YAML frontmatter (parseable)
- ✅ Unique, descriptive title
- ✅ Clear description of purpose
- ✅ Correct collection (`m4-legacy`)
- ✅ Proper segment mapping
- ✅ Sequential sort-order
- ✅ Published status
- ✅ Clean, formatted content
- ✅ No HTML artifacts

## 💡 Implementation Notes

1. **Incremental Processing**: Process one lesson at a time, validate, then continue
2. **Pattern Recognition**: The key challenge is distinguishing prompts from code examples
3. **Context is King**: Headings and surrounding text provide crucial metadata
4. **Flexibility Required**: HTML structure may vary; need adaptive parsing
5. **Cross-Reference**: Check against m2/m3 patterns for consistency
6. **UTF-8 Critical**: Polish language content requires proper encoding

## 🚀 Execution Steps

1. Create `backup/10xdevs-2ed/prompts/m4/` directory
2. Process 4x1 HTML → extract prompts → generate 4x1_prompts.md
3. Validate 4x1 output
4. Process 4x2 HTML → extract prompts → generate 4x2_prompts.md
5. Validate 4x2 output
6. Process 4x3 HTML → extract prompts → generate 4x3_prompts.md
7. Validate 4x3 output
8. Process 4x4 HTML → extract prompts → generate 4x4_prompts.md
9. Validate 4x4 output
10. Process 4x5 HTML → extract prompts → generate 4x5_prompts.md
11. Validate 4x5 output
12. Final cross-validation of all files

## ✅ Success Criteria

- All 5 markdown files created with correct naming
- All prompts extracted and properly formatted
- All metadata complete and valid
- Polish characters preserved
- No HTML entities or artifacts
- Consistent with m2/m3 patterns
- Ready for ingestion into course database
