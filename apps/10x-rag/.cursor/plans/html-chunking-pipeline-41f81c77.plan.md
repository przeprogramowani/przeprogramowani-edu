<!-- 41f81c77-367d-466c-a8a8-80514a8b111b 3dc6cc7a-19b1-4a58-a0ef-58771ec0f97a -->
# HTML Chunking Pipeline Implementation

## Overview

Create a pipeline that processes HTML files from `data/source/`, splits them by `<h2>` headers, and saves cleaned chunks to `data/chunks/` with naming format: `{prefix}_{number}_{h2-text}.html` (e.g., `2x5_01_wprowadzenie.html`).

## Implementation Steps

### 1. Install Dependencies

Add `cheerio` for HTML parsing and `@types/cheerio` for TypeScript support.

### 2. Define TypeScript Types (`src/types.ts`)

Create interfaces for:

- `SourceFile` - represents an HTML file to process
- `Chunk` - represents a processed chunk with metadata
- `ChunkingStrategy` - interface for chunking strategies
- `ProcessingResult` - pipeline execution result

### 3. Create HTML Cleanup Helper (`src/helpers/cleanup.ts`)

Implement `cleanupHtml()` function that:

- Takes raw HTML string as input
- Returns cleaned HTML string
- Initial implementation can be pass-through (return as-is)
- Designed to be enhanced later with specific cleanup rules

### 4. Implement Chunking Strategy (`src/strategies/chunking-per-header.ts`)

Create `chunkByHeader()` function that:

- Parses HTML using cheerio
- Extracts meta tag with `name="lesson-id"` to get prefix (e.g., `[2x5]`)
- Splits content by `<h2>` tags
- Generates chunk objects with:
- Sequential numbering (01, 02, 03...)
- Sanitized h2 text for filename
- Full HTML content for each section
- Returns array of chunks

### 5. Build Main Pipeline (`src/pipeline.ts`)

Implement pipeline that:

- Reads all HTML files from `data/source/`
- For each file:
- Applies chunking strategy
- Cleans HTML content
- Generates output filename: `{prefix}_{number}_{h2-slug}.html`
- Writes chunks to `data/chunks/`
- Logs progress and summary statistics

### 6. Test Execution

Run pipeline with `npm start` and verify:

- Chunks are created in `data/chunks/`
- Naming convention is correct
- Content is properly split by h2 headers

## Key Files to Create/Modify

- `src/types.ts` - Type definitions
- `src/helpers/cleanup.ts` - HTML cleanup helper
- `src/strategies/chunking-per-header.ts` - Chunking logic
- `src/pipeline.ts` - Main orchestration
- `package.json` - Add cheerio dependency

## Example Output

For file `18-2x5_generowanie_interfejsu_uytkownika.html` with meta `[2x5]`:

- `2x5_01_wprowadzenie.html`
- `2x5_02_tailwind.html`
- `2x5_03_shadcnui.html`
- etc.

### To-dos

- [ ] Install cheerio and @types/cheerio dependencies
- [ ] Define TypeScript interfaces in src/types.ts
- [ ] Implement HTML cleanup helper in src/helpers/cleanup.ts
- [ ] Build chunking-per-header strategy with h2 splitting logic
- [ ] Create main pipeline orchestration in src/pipeline.ts
- [ ] Execute pipeline and verify chunk output