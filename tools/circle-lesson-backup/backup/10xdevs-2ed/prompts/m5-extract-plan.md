# M5 Prompt Extraction Plan

## 🎯 Objective

Extract AI prompts from Module 5 (Innovation) HTML lesson files and convert them into structured markdown files with **high-quality metadata** for the course management system.

## ✨ Key Improvements (Based on M3 Learnings)

This plan incorporates **metadata quality best practices** from M3 module improvements:

**From M3_METADATA_IMPROVEMENTS.md:**
1. ✅ **No generic suffixes** - Avoid " - Prompt {number}" in titles
2. ✅ **Action-oriented titles** - Use verbs and deliverables (e.g., "MCP Server Planning" not "MCP - Prompt 1")
3. ✅ **Descriptive descriptions** - Include action verb + outcome + technical context (1-2 sentences)
4. ✅ **Technical specificity** - Mention tools, frameworks, patterns explicitly
5. ✅ **Searchable metadata** - Titles and descriptions help users find relevant prompts

**From M4 Splitting Pattern:**
- Optional bilingual approach (`-en.md` / `-pl.md` files)
- Individual files per prompt for better organization
- Professional translation preserving technical elements

**Quality Over Speed:**
- Focus on extracting **meaningful metadata** from HTML context
- Infer purpose from headings, paragraphs, and prompt content
- Follow M3 description patterns consistently
- Validate metadata quality, not just technical validity

## 📊 Scope Analysis

**Source Files Status:**
- ✅ 33-5x2_model_context_protocol_mcp.html → 10 `<pre><code>` blocks
- ✅ 34-5x3_agent_ai_w_scenariuszach_cicd.html → 13 `<pre><code>` blocks
- ✅ 35-5x4_ewaluacja_modeli_pod_aiassisted_development.html → 10 `<pre><code>` blocks
- ⚠️ 32-5x1_poszerzanie_wiedzy_modelu_llmstxt.html → 0 blocks (SKIP - empty)
- ⚠️ 36-5x5_rozwj_10xdeva_w_epoce_ai.html → 0 blocks (SKIP - empty)

**Total Estimated Prompts:** ~33 code blocks across 3 files

**Target Output:**
```
backup/10xdevs-2ed/prompts/m5/
├── 5x2_prompts.md  (MCP prompts)
├── 5x3_prompts.md  (Agent CI/CD prompts)
└── 5x4_prompts.md  (Evaluation prompts)
```

## 📋 Metadata Schema

**Frontmatter Structure:**
```yaml
---
title: "[Prompt Title]"
description: "[Brief description or empty string]"
collection: m5-innovation
segment: [lesson-specific - see mapping below]
sort-order: [0, 1, 2... sequential within file]
status: published
---
```

**Segment Mapping:**
```javascript
{
  '5x1': 'l1-knowledge-expansion',  // SKIP - no prompts
  '5x2': 'l2-mcp',                  // ✅ Process
  '5x3': 'l3-agent-cicd',           // ✅ Process
  '5x4': 'l4-evaluation',           // ✅ Process
  '5x5': 'l5-development'           // SKIP - no prompts
}
```

## 🎨 Metadata Quality Guidelines

> **Inspired by M3 Metadata Improvements** - See `backup/10xdevs-2ed/prompts/m3/M3_METADATA_IMPROVEMENTS.md`

### Title Best Practices

**✅ DO:**
- Use specific, action-oriented titles
- Focus on the deliverable or outcome
- Keep concise (3-6 words ideal)
- Use nouns for concrete artifacts (e.g., "Specification", "Plan", "Implementation")
- Make titles searchable and descriptive

**❌ DON'T:**
- Add " - Prompt {number}" suffixes
- Use generic lesson names (e.g., "Model Context Protocol - Prompt 1")
- Leave titles vague or ambiguous
- Repeat collection/segment info in title

**Examples for M5:**
- ❌ Bad: "Model Context Protocol - Prompt 1"
- ✅ Good: "MCP Server Planning"

- ❌ Bad: "Agent AI w scenariuszach CI/CD - Prompt 3"
- ✅ Good: "GitHub Actions Agent Workflow"

- ❌ Bad: "Ewaluacja modeli - Prompt 2"
- ✅ Good: "Model Benchmarking Framework"

### Description Writing Patterns

**Pattern 1: Creates/Generates + Output**
- "Creates comprehensive MCP server specification for integrating external APIs with Claude Desktop."
- "Generates evaluation framework for comparing AI models on code generation tasks."

**Pattern 2: Implements/Builds + Feature + Constraints**
- "Implements MCP tool definitions with JSON-RPC protocol support and error handling."
- "Builds CI/CD pipeline leveraging AI agents for automated testing and deployment."

**Pattern 3: Analyzes/Evaluates + Target + Criteria**
- "Analyzes MCP server capabilities to identify integration opportunities and limitations."
- "Evaluates model performance across multiple dimensions: accuracy, speed, cost, and code quality."

**Pattern 4: Configures/Designs + System + Purpose**
- "Designs MCP resource schema for exposing database queries and file operations to AI models."
- "Configures GitHub Actions workflow with AI-powered code review and test generation."

**Pattern 5: Plans/Proposes + Strategy + Approach**
- "Plans MCP server deployment strategy balancing local execution with remote API calls."
- "Proposes agent orchestration pattern for multi-step CI/CD automation workflows."

### M5-Specific Title Patterns

**For 5x2 (MCP):**
- MCP [Component] [Action] (e.g., "MCP Server Planning", "MCP Tool Definition")
- [Integration] MCP Setup (e.g., "Cloudflare Workers MCP Setup")
- MCP [Feature] Implementation (e.g., "MCP Resource Implementation")

**For 5x3 (Agent CI/CD):**
- [Platform] Agent Workflow (e.g., "GitHub Actions Agent Workflow")
- CI/CD [Task] Automation (e.g., "CI/CD Test Automation")
- Agent [Operation] Strategy (e.g., "Agent Deployment Strategy")

**For 5x4 (Evaluation):**
- Model [Aspect] Evaluation (e.g., "Model Performance Evaluation")
- [Metric] Benchmarking Framework (e.g., "Code Quality Benchmarking Framework")
- Evaluation [Methodology] Design (e.g., "Evaluation Harness Design")

### Description Quality Criteria

**Must Include:**
1. **Action verb** (Creates, Implements, Analyzes, Configures, Plans, etc.)
2. **What it does** (the primary function or outcome)
3. **Technical context** (tools, frameworks, patterns used)
4. **Scope or constraints** (what's included, limitations, prerequisites)

**Length:** 1-2 sentences (15-40 words ideal)

**Tone:** Professional, technical, action-oriented

**Examples:**

```yaml
# Example 1: MCP Server Planning
title: "MCP Server Planning Prompt"
description: "Analyzes project requirements and designs MCP server architecture with tool definitions, resource schemas, and integration patterns for Claude Desktop compatibility."

# Example 2: CI/CD Agent Workflow
title: "GitHub Actions Agent Workflow"
description: "Creates GitHub Actions workflow leveraging AI agents for automated code review, test generation, and deployment validation across multiple environments."

# Example 3: Model Evaluation Framework
title: "Code Generation Benchmarking"
description: "Implements comprehensive evaluation framework measuring AI model performance on code generation tasks across accuracy, speed, cost, and code quality dimensions."
```

### Metadata Extraction Strategy

**Step 1: Identify Prompt Purpose from Context**
- Read preceding `<h2>` or `<h3>` heading
- Scan preceding `<p>` paragraphs for explanatory text
- Look for first line of prompt (often states purpose)
- Check for XML tags like `<task>`, `<goal>`, `<objective>`

**Step 2: Extract Action and Deliverable**
- Identify main verb (analyze, create, implement, configure, etc.)
- Identify key deliverable (plan, specification, workflow, framework, etc.)
- Note any tools/technologies mentioned (MCP, GitHub Actions, Vitest, etc.)

**Step 3: Craft Concise Title**
- Format: `[Deliverable/Component] [Action/Type]` or `[Technology] [Feature] [Action]`
- Keep to 3-6 words
- Use proper nouns for tools/platforms (MCP, GitHub Actions, Claude)
- Avoid generic words like "Prompt", lesson numbers

**Step 4: Write Action-Oriented Description**
- Start with action verb
- Specify what is created/analyzed/implemented
- Add technical context (frameworks, patterns, constraints)
- Keep to 1-2 sentences
- Reference key technologies explicitly

**Step 5: Validate Quality**
- Is title searchable and specific?
- Does description explain what the prompt does?
- Are tools/technologies mentioned?
- Is expected outcome clear?
- Does it match M3 quality patterns?

## 🔄 Implementation Strategy

### Phase 1: Environment Setup
1. Create directory `backup/10xdevs-2ed/prompts/m5/`
2. Verify HTML files exist and are readable

### Phase 2: Extraction Process (Per File)

For each HTML file (5x2, 5x3, 5x4):

**Step 1: Parse & Extract**
- Load HTML content
- Find all `<pre><code>...</code></pre>` blocks
- Extract preceding context (headings, paragraphs)
- Decode HTML entities (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`)

**Step 2: Classify Content**
- Identify actual prompts vs code examples
- **Prompt indicators:**
  - Contains instructional language ("You are...", "Your task is...")
  - Has XML-style tags (`<thinking>`, `<project_description>`)
  - Contains template variables (`{{variable}}`)
  - Length typically > 500 characters
  - Instructional tone, not executable code

**Step 3: Extract Metadata**
- **Title:** From preceding `<h2>`/`<h3>` or infer from content
- **Description:** From preceding paragraph or leave empty
- **Segment:** Map from lesson number (5x2 → l2-mcp, etc.)
- **Sort-order:** Sequential from 0

**Step 4: Generate Output**
- Format each prompt with frontmatter
- Separate prompts with `---` divider
- Add 3 blank lines between prompts
- Save as `5x[N]_prompts.md`

### Phase 3: Quality Validation

**Per-file checks:**
- ✅ All code blocks reviewed (prompts vs snippets)
- ✅ Valid YAML frontmatter
- ✅ Unique, descriptive titles
- ✅ Correct collection (`m5-innovation`)
- ✅ Proper segment mapping
- ✅ Sequential sort-order (0, 1, 2...)
- ✅ No HTML entities remaining
- ✅ Polish characters preserved (ł, ą, ę, ś, ź, ż, ć, ń)

## 🛠️ Technical Approach

**Option 1: TypeScript/Node.js Script** (Recommended)
- Use cheerio for HTML parsing
- Zod for schema validation
- he library for HTML entity decoding
- Based on similar pattern from m4 extraction

**Option 2: Python Script**
- Use BeautifulSoup for HTML parsing
- Regular expressions for pattern matching
- Built-in html.unescape() for entities

**Option 3: Manual Extraction with AI Assistance**
- Claude reads each HTML file
- Identifies prompts manually
- Generates markdown with proper formatting

## 📝 Output Format Reference

```markdown
---
title: "Przykładowy tytuł promptu"
description: "Krótki opis lub puste pole"
collection: m5-innovation
segment: l2-mcp
sort-order: 0
status: published
---

[Treść pierwszego promptu]



---
title: "Drugi prompt"
description: ""
collection: m5-innovation
segment: l2-mcp
sort-order: 1
status: published
---

[Treść drugiego promptu]
```

## ⚠️ Key Considerations

1. **Empty Files:** Skip 5x1 and 5x5 (no content) - don't create empty .md files
2. **Polish Language:** Preserve UTF-8 encoding for special characters
3. **Code vs Prompts:** Not all `<pre><code>` blocks are prompts - need filtering
4. **Context Extraction:** Titles/descriptions from surrounding HTML may require inference
5. **Consistency:** Match format of existing m2/m3/m4 prompt files

## 🌍 Bilingual Approach (Optional Enhancement)

> **Following M4 Pattern** - See `backup/10xdevs-2ed/prompts/m4/m4-split-prompts-plan.md`

After initial extraction, consider splitting prompts into bilingual files following M4 naming convention:

**Naming Pattern:** `{lesson}-{seq}-{title-slug}-{locale}.md`

**Example:**
```
prompts/m5/
├── 5x2-1-mcp-server-planning-en.md
├── 5x2-1-mcp-server-planning-pl.md
├── 5x2-2-mcp-tool-definition-en.md
├── 5x2-2-mcp-tool-definition-pl.md
└── ...
```

**Translation Guidelines:**
- **Preserve:** Placeholders (`{{variable}}`), XML tags (`<tag>`), code blocks, tool names
- **Translate:** Titles, descriptions, instructional text, comments
- **Keep identical:** sort-order, collection, segment, status across locale pairs
- **Professional tone:** Use technical vocabulary consistent with M2/M3/M4

**Decision Point:** Bilingual split can be done either:
1. **During extraction** - Generate both -en and -pl files directly
2. **Post-extraction** - Extract as aggregated files first, then split and translate
3. **Skip entirely** - Keep aggregated format like M3 (Polish titles, English content)

**Recommendation:** Extract as aggregated files first (Phase 1), validate metadata quality, then optionally split into bilingual format (Phase 2) following M4 workflow.

## 📈 Success Criteria

### Phase 1: Initial Extraction
- ✅ 3 markdown files created (5x2, 5x3, 5x4)
- ✅ All actual prompts extracted (code snippets filtered out)
- ✅ Valid YAML frontmatter on all prompts
- ✅ Correct segment mapping per lesson
- ✅ Sequential sort-order within each file
- ✅ Polish characters intact
- ✅ No HTML entities in content
- ✅ Ready for course platform ingestion

### Phase 2: Metadata Quality (M3-Style)
- ✅ Titles are specific and action-oriented (no "Prompt N" suffixes)
- ✅ Descriptions follow M3 patterns (action verb + outcome + context)
- ✅ Technical tools/frameworks explicitly mentioned
- ✅ Expected deliverables clear from description
- ✅ Titles searchable and unique within file
- ✅ Consistency with M2/M3/M4 quality standards

### Phase 3: Bilingual Split (Optional, M4-Style)
- ✅ Each prompt split into -en.md and -pl.md files
- ✅ Naming follows M4 convention: `5x{lesson}-{seq}-{slug}-{locale}.md`
- ✅ Placeholders and technical elements preserved in both locales
- ✅ Translations professionally done with technical accuracy
- ✅ Locale pairs have identical metadata (except title/description)
- ✅ Original aggregated files archived in `_archive/`

## 🚀 Execution Plan

### Workflow 1: Quick Extraction (Aggregated Files)
1. **Create m5 directory**
2. **Process 5x2 file** → generate 5x2_prompts.md (aggregated)
3. **Validate 5x2 output** (technical + metadata quality)
4. **Process 5x3 file** → generate 5x3_prompts.md (aggregated)
5. **Validate 5x3 output** (technical + metadata quality)
6. **Process 5x4 file** → generate 5x4_prompts.md (aggregated)
7. **Validate 5x4 output** (technical + metadata quality)
8. **Final review** of all 3 files

### Workflow 2: High-Quality Extraction (M3-Style with Improvements)
1. **Extract prompts** following Workflow 1
2. **Review metadata quality** for all prompts
3. **Improve titles** - Remove "Prompt N" suffixes, make action-oriented
4. **Write descriptions** - Follow M3 patterns (action verb + outcome + context)
5. **Validate consistency** - Check against M3 quality standards
6. **Document improvements** - Create M5_METADATA_IMPROVEMENTS.md similar to M3

### Workflow 3: Full Bilingual Extraction (M4-Style)
1. **Extract prompts** following Workflow 2
2. **Split into individual files** - One file per prompt
3. **Create Polish versions** - `5x{N}-{seq}-{slug}-pl.md`
4. **Translate to English** - `5x{N}-{seq}-{slug}-en.md`
5. **Validate translations** - Preserve technical elements, verify accuracy
6. **Archive originals** - Move aggregated files to `_archive/`
7. **Update documentation** - Create bilingual manifest

**Recommended:** Start with **Workflow 2** (M3-style) for best quality-to-effort ratio.

## 📝 M5-Specific Metadata Examples

### Example 1: MCP Server Planning (5x2)

**Before (Poor Quality):**
```yaml
title: "Model Context Protocol - Prompt 1"
description: "Prompt for MCP server planning"
```

**After (M3-Quality):**
```yaml
title: "MCP Server Planning Prompt"
description: "Analyzes project requirements and designs MCP server architecture with tool definitions, resource schemas, and integration patterns for Claude Desktop compatibility."
```

### Example 2: GitHub Actions Agent (5x3)

**Before (Poor Quality):**
```yaml
title: "Agent AI w scenariuszach CI/CD - Prompt 2"
description: "Prompt for GitHub Actions workflow"
```

**After (M3-Quality):**
```yaml
title: "GitHub Actions Agent Workflow"
description: "Creates GitHub Actions workflow leveraging AI agents for automated code review, test generation, and deployment validation across multiple environments."
```

### Example 3: Model Evaluation (5x4)

**Before (Poor Quality):**
```yaml
title: "Ewaluacja modeli - Prompt 3"
description: "Prompt for model benchmarking"
```

**After (M3-Quality):**
```yaml
title: "Code Generation Benchmarking"
description: "Implements comprehensive evaluation framework measuring AI model performance on code generation tasks across accuracy, speed, cost, and code quality dimensions."
```

### Example 4: MCP Tool Implementation (5x2)

**Context from HTML:**
```html
<h3>Jak zbudować własny serwer MCP w TypeScript z Cloudflare Workers?</h3>
<p>W tym przykładzie pokażemy jak zdefiniować narzędzia (tools) dla serwera MCP...</p>
<pre><code>Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu narzędzi...</code></pre>
```

**Extracted Metadata:**
```yaml
title: "MCP Tool Definition with TypeScript"
description: "Defines MCP server tools using TypeScript SDK and Cloudflare Workers. Includes schema validation with Zod, JSON-RPC protocol implementation, and deployment configuration."
collection: m5-innovation
segment: l2-mcp
sort-order: 2
status: published
```

### Example 5: CI/CD Agent Orchestration (5x3)

**Context from HTML:**
```html
<h3>Orkiestracja agentów w pipeline CI/CD</h3>
<p>Agent może koordynować wiele zadań automatyzacyjnych...</p>
<pre><code>Your task is to design an agent orchestration pattern for CI/CD...</code></pre>
```

**Extracted Metadata:**
```yaml
title: "CI/CD Agent Orchestration Pattern"
description: "Designs multi-agent orchestration pattern for CI/CD pipelines coordinating test execution, code analysis, deployment verification, and rollback strategies."
collection: m5-innovation
segment: l3-agent-cicd
sort-order: 4
status: published
```

## 📚 Reference Documents

**Metadata Quality:**
- `backup/10xdevs-2ed/prompts/m3/M3_METADATA_IMPROVEMENTS.md` - Primary reference for quality standards
- `backup/10xdevs-2ed/prompts/m2/2x1-1-prd-creation-en.md` - Example of excellent metadata

**Extraction Patterns:**
- `backup/10xdevs-2ed/prompts/m4-extract-plan.md` - Technical extraction approach
- `backup/10xdevs-2ed/prompts/m4/_archive/4x1_prompts.md` - Aggregated format example
- `backup/10xdevs-2ed/prompts/m4/4x1-1-initial-project-analysis-en.md` - Bilingual format example

**Splitting & Translation:**
- `backup/10xdevs-2ed/prompts/m4/m4-split-prompts-plan.md` - Bilingual workflow reference

## 🔍 Detailed Analysis

### File: 33-5x2_model_context_protocol_mcp.html
- **Lesson:** Model Context Protocol (MCP)
- **Segment:** l2-mcp
- **Estimated code blocks:** 10
- **Content type:** MCP server implementation, JSON-RPC examples, planning prompts

### File: 34-5x3_agent_ai_w_scenariuszach_cicd.html
- **Lesson:** Agent AI w scenariuszach CI/CD
- **Segment:** l3-agent-cicd
- **Estimated code blocks:** 13
- **Content type:** CI/CD automation prompts, agent workflows

### File: 35-5x4_ewaluacja_modeli_pod_aiassisted_development.html
- **Lesson:** Ewaluacja modeli pod AI-assisted development
- **Segment:** l4-evaluation
- **Estimated code blocks:** 10
- **Content type:** Evaluation frameworks, testing prompts, benchmarking

## 💡 Implementation Notes

1. **Incremental Processing:** Process one lesson at a time, validate, then continue
2. **Pattern Recognition:** Distinguish between:
   - AI prompts (instructional, template-based)
   - Code examples (JSON, TypeScript, shell commands)
   - Configuration samples (YAML, JSON config)
3. **Context is King:** Headings and surrounding text provide crucial metadata
4. **Flexibility Required:** HTML structure may vary; need adaptive parsing
5. **Cross-Reference:** Check against m2/m3/m4 patterns for consistency
6. **UTF-8 Critical:** Polish language content requires proper encoding

## 🧪 Testing & Validation

After extraction, verify:
1. Each markdown file is valid (parseable YAML frontmatter)
2. Titles are descriptive and unique within file
3. All template variables preserved (e.g., `{{variable}}`)
4. XML tags intact (e.g., `<thinking>`, `<context>`)
5. No encoding issues with Polish characters
6. Proper separation between prompts (3 blank lines)
7. Sequential sort-order matches prompt order in HTML

## 🎯 Deliverables

**Primary Output:**
- `backup/10xdevs-2ed/prompts/m5/5x2_prompts.md`
- `backup/10xdevs-2ed/prompts/m5/5x3_prompts.md`
- `backup/10xdevs-2ed/prompts/m5/5x4_prompts.md`

**Supporting Materials:**
- This extraction plan document
- Validation checklist
- Any extraction scripts developed
