# 10xDevs 3 Prework Code Block Repair Implementation Plan

## Overview

Build a deterministic repair workflow for English 10xDevs 3 prework HTML where translated `<pre>` blocks were truncated to the first line.

The script will compare generated Polish HTML against translated English HTML, identify suspicious or missing `<pre>` blocks, translate only suspicious matched code blocks through OpenRouter, restore cut Mermaid blocks from the Polish source while flagging them for manual English translation, and cache every block decision per lesson prefix.

## Current State Analysis

The repository already has a generated-content pipeline for 10xDevs 3 prework:

- Polish authoring Markdown in `src/content-source/lessons10xDevs3Prework/pl/*.md` generates Polish HTML in `src/content/lessons10xDevs3Prework/pl/*.html`.
- English HTML in `src/content/lessons10xDevs3Prework/en/*.html` is translation-pipeline-owned.
- English HTML is then enriched with metadata by `scripts/enrich-lesson-html.ts`.
- `npm run check:lesson-html` currently verifies generated Polish HTML and enriched English metadata.

The defect is in English translated HTML body content, not metadata: multi-line Polish `<pre>` blocks became one-line English `<pre>` blocks after translation.

### Key Discoveries

- `package.json:13` already exposes `generate:lesson-html`, `enrich:lesson-html:en`, `prep:lesson-html`, and `check:lesson-html`, so this repair should be another content-pipeline script rather than a platform route change.
- `src/server/content/lessonHtmlEnricher.ts:65` derives lesson pairing from the Markdown/HTML file prefix, which is the correct pairing key for this repair as well.
- `src/server/content/lessonHtmlEnricher.ts:123` strips managed metadata before rewriting English HTML, so the repair must preserve those metadata blocks and operate on body `<pre>` nodes only.
- `scripts/generate-ebook-illustrations.ts:478` shows the existing OpenRouter request pattern: `OPENROUTER_API_KEY`, chat completions endpoint, `HTTP-Referer`, `X-Title`, and non-streaming requests.
- `src/server/content/generatedLessonHtml.test.ts:54` currently expects `checkEnrichedLessonHtml()` to pass, so the new repair report must not make metadata checks fail.
- The content audit found 20 Polish `<pre>` blocks and 19 English `<pre>` blocks. There are 19 suspicious truncated blocks and 1 missing block across lessons `02`, `03`, `04`, `09`, `10`, `11`, `12`, and `14`.

## Desired End State

After implementation:

1. A standalone script can report all cut or missing English prework `<pre>` blocks.
2. A write mode can repair suspicious matched code blocks by translating the full Polish block with OpenRouter.
3. A write mode can restore suspicious matched Mermaid blocks from Polish source, preserving full diagram syntax.
4. Mermaid blocks are clearly reported as requiring manual English translation.
5. Missing English blocks are reported, not inserted automatically.
6. Translation results and manual-review metadata are cached under `scripts/prework-code-translations/cache/<lesson-prefix>.cache.json`.
7. Re-running the repair reuses cached translations by Polish block hash and model.
8. Structural validation prevents obviously truncated or malformed model output from being written.
9. `npm run check:lesson-html` reports code-block issues without failing the build.
10. Focused tests cover detection, cache behavior, OpenRouter response parsing, validation, and write-mode DOM updates.

## What We're NOT Doing

- Not changing learner-facing routes.
- Not changing the Markdown-to-HTML generator.
- Not changing the English metadata enrichment contract.
- Not inserting missing English blocks automatically.
- Not translating Mermaid diagrams automatically in this first version.
- Not rewriting healthy English `<pre>` blocks by default.
- Not making `check:lesson-html` fail on code-block repair issues.
- Not committing API keys or requiring production environment changes.
- Not using OpenRouter during normal build/check commands.

## Implementation Approach

Add a pure repair module and a thin CLI:

- `src/server/content/preworkCodeBlockRepair.ts` contains pairing, extraction, classification, diagnostics, cache IO helpers, validation, and HTML patching.
- `scripts/repair-prework-code-blocks.ts` parses CLI arguments, loads env files only for API-backed write mode, calls OpenRouter one block at a time, updates per-lesson caches, and optionally writes patched English HTML.
- `scripts/prework-code-translations/cache/<lesson-prefix>.cache.json` stores cache entries by block hash, model, lesson prefix, block index, block type, status, and translated/restored output.

Default behavior should be conservative:

- Report suspicious and missing blocks.
- Translate and patch only suspicious matched `pre>code` blocks in explicit write mode.
- Restore suspicious matched Mermaid blocks from the full Polish source in explicit write mode and mark them as `manual-translation-required`.
- Preserve all existing `<pre>` / `<code>` attributes and classes; replace only text content.
- Do not insert missing blocks.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Pipeline Timing**: Run after `copy:10xdevs3-prework:en-from-i18n` and `enrich:lesson-html:en`, because the script repairs translated English HTML.
- **Build Timing**: `check:lesson-html` may run the repair script in report mode but must not fail because of code-block issues.
- **Write Timing**: API calls only happen in explicit write mode when a suspicious matched `pre>code` block has no valid cache entry.
- **Cache Timing**: Cache is read before any OpenRouter call and written after each successful translation or Mermaid restoration decision.
- **No Request-Time Work**: This is entirely an authoring/content-maintenance workflow. No runtime route or API handler should call OpenRouter.

### User Experience Specification

This is an internal content workflow. Learners should only see corrected English lessons:

- Multi-line code examples render as complete English blocks.
- Mermaid diagrams become complete again, even if their labels remain Polish until manual translation.
- Missing blocks are not silently inserted in the wrong place.
- Authors get a clear report showing repaired blocks, cached blocks, Mermaid manual-translation items, and missing blocks.

### Performance & Optimization Strategy

- One OpenRouter request per damaged code block, not per course.
- Cache key should include:
  - normalized Polish block text hash
  - block type
  - model
  - prompt version
  - lesson prefix
  - block ordinal
- Cache files are per lesson prefix, e.g. `scripts/prework-code-translations/cache/10.cache.json`, to keep diffs reviewable and retries small.
- The current damaged set is small enough for serial requests. Add optional `--lesson <prefix>` to support focused retries.

### State Management Sequencing

Repair flow:

1. Read Polish HTML files from `src/content/lessons10xDevs3Prework/pl`.
2. Read English HTML files from `src/content/lessons10xDevs3Prework/en`.
3. Pair files by lesson prefix.
4. Extract all `<pre>` blocks, including `pre>code` and `pre.mermaid`.
5. Compare PL and EN blocks by ordinal.
6. Classify each comparison:
   - `healthy`: EN block has enough content.
   - `suspicious-code`: PL is multi-line and matched EN `pre>code` is one-line or empty.
   - `suspicious-mermaid`: PL is multi-line and matched EN Mermaid is one-line or empty.
   - `missing`: PL block has no EN counterpart.
7. In report mode, print diagnostics and exit 0.
8. In write mode:
   - for `suspicious-code`, use cache or OpenRouter translation, validate, then replace EN code text.
   - for `suspicious-mermaid`, copy PL Mermaid text into EN and cache/report manual translation requirement.
   - for `missing`, report only.
9. Write modified EN HTML files.
10. Run `npm run check:lesson-html`, which reports remaining issues but exits 0 for repair diagnostics.

### Debug & Observability Plan

- **Verification Method**: Unit tests plus real-content report mode.
- **Logging Strategy**: Print concise per-lesson summaries:
  - `02: 1 code repaired, 3 mermaid restored, 0 missing`
  - `11: 0 repaired, 0 restored, 1 missing`
- **Debug Instrumentation**: Add `--json` to print machine-readable diagnostics for review and future automation.
- **Timing Debug**: Log OpenRouter request count, cache hits, cache misses, and validation failures.
- **Metrics**: No runtime metrics. The script-level summary is enough.

## Phase 1: Detection and Pairing Core

### Overview

Build the pure comparison engine that finds suspicious or missing `<pre>` blocks without writing files or calling external APIs.

### Changes Required

#### 1. Prework code block repair module

**File**: `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Define types:

```ts
export type PreworkPreBlockType = 'code' | 'mermaid' | 'other-pre';

export interface PreworkPreBlock {
  lessonPrefix: string;
  ordinal: number;
  type: PreworkPreBlockType;
  text: string;
  lineCount: number;
  className?: string;
  language?: string;
}

export type PreworkCodeBlockIssueKind =
  | 'suspicious-code'
  | 'suspicious-mermaid'
  | 'missing';
```

- Add functions:
  - `pairPreworkLessonHtmlFiles(plDir, enDir)`
  - `extractPreBlocks(html, lessonPrefix)`
  - `comparePreBlocks(plBlocks, enBlocks)`
  - `createDefaultPreworkCodeBlockRepairTargets(rootDir)`
  - `findPreworkCodeBlockIssues(targets)`

#### 2. Block classification rules

**File**: `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Treat any `<pre class="mermaid">` or `<pre data-language="mermaid">` as `mermaid`.
- Treat `<pre><code>` as `code`.
- Preserve raw text with line breaks via Cheerio `.text()`.
- Suspicious matched block rule:
  - PL line count is greater than 1.
  - EN block is missing, empty, or has at most 1 line.
  - For matched EN block present: classify by PL block type.
- Missing rule:
  - PL block exists at an ordinal where EN has no block.
  - Report only in later phases.

#### 3. Tests for detection

**File**: `src/server/content/preworkCodeBlockRepair.test.ts`

**Changes**:

- Use temp dirs like `lessonHtmlEnricher.test.ts`.
- Test:
  - lesson pairing by prefix.
  - `pre>code` extraction.
  - `pre.mermaid` extraction.
  - suspicious one-line EN blocks.
  - missing EN blocks.
  - healthy blocks are ignored.
  - attributes/classes are captured for later preservation.

### Success Criteria

#### Automated Verification

- [x] Detection tests pass: `npm run test -- src/server/content/preworkCodeBlockRepair.test.ts`
- [x] Real-content report identifies lessons `02`, `03`, `04`, `09`, `10`, `11`, `12`, and `14`.
- [x] No files are modified by detection functions.

#### Manual Verification

- [ ] Review report output and confirm it matches the known truncated blocks.
- [ ] Confirm Mermaid blocks are listed separately from code blocks.

**Implementation Note**: Pause after this phase if the detected issue count differs from the research count of 19 suspicious and 1 missing block.

---

## Phase 2: OpenRouter Translation and Cache

### Overview

Add cache-backed one-block-at-a-time translation for suspicious `pre>code` blocks and cache entries for Mermaid manual translation work.

### Changes Required

#### 1. Cache format

**Directory**: `scripts/prework-code-translations/cache/`

**Files**: `scripts/prework-code-translations/cache/<lesson-prefix>.cache.json`

**Changes**:

Use a stable JSON shape:

```json
{
  "lessonPrefix": "10",
  "updatedAt": "2026-04-28T00:00:00.000Z",
  "entries": [
    {
      "key": "sha256-model-promptVersion",
      "blockHash": "sha256...",
      "promptVersion": "prework-code-block-v1",
      "model": "google/gemini-2.5-flash",
      "blockType": "code",
      "ordinal": 0,
      "sourceLanguage": "pl",
      "targetLanguage": "en",
      "sourceText": "...",
      "translatedText": "...",
      "status": "translated",
      "createdAt": "2026-04-28T00:00:00.000Z"
    }
  ]
}
```

Allowed statuses:

- `translated`
- `restored-polish-mermaid`
- `manual-translation-required`
- `validation-failed`

#### 2. Cache helpers

**File**: `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Add pure helpers:
  - `createBlockCacheKey(block, model, promptVersion)`
  - `readLessonBlockCache(cacheDir, lessonPrefix)`
  - `writeLessonBlockCache(cacheDir, cache)`
  - `findCachedTranslation(cache, key)`
  - `upsertCacheEntry(cache, entry)`
- Avoid timestamps in generated HTML, but cache timestamps are acceptable because cache is operational state.

#### 3. OpenRouter request helper

**File**: `scripts/repair-prework-code-blocks.ts` or `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Prefer keeping network code in the script layer so content helpers remain mostly pure/testable.
- Use `OPENROUTER_API_KEY`.
- Default model: `google/gemini-2.5-flash`.
- Support `--model <id>`.
- Use endpoint `https://openrouter.ai/api/v1/chat/completions`.
- Use headers:
  - `Authorization: Bearer <key>`
  - `Content-Type: application/json`
  - `HTTP-Referer: https://przeprogramowani.pl`
  - `X-Title: 10xDevs Prework Code Block Repair`

Prompt requirements:

- Translate Polish text inside the code/prompt block to English.
- Preserve all code syntax, placeholders, indentation, shell line continuations, JSON structure, and variable names.
- Return only the translated block text.
- Do not wrap in Markdown fences.

#### 4. Structural validation

**File**: `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Add `validateTranslatedCodeBlock(sourceBlock, translatedText)`.
- Validation should reject:
  - empty output.
  - output that is only the first source line when source had multiple lines.
  - Markdown fences wrapping the result.
  - obvious JSON brace loss for JSON-like blocks.
  - obvious line-continuation loss for shell-like blocks.
- Validation should allow some line-count variation because translation may wrap natural-language prompt text differently.

#### 5. Tests for cache and validation

**File**: `src/server/content/preworkCodeBlockRepair.test.ts`

**Changes**:

- Test cache key stability.
- Test per-lesson cache read/write.
- Test cache hit by hash/model/prompt version.
- Test validation rejects first-line-only output.
- Test validation accepts translated multi-line prompt text.
- Test validation rejects fenced output.

### Success Criteria

#### Automated Verification

- [x] Cache and validation tests pass: `npm run test -- src/server/content/preworkCodeBlockRepair.test.ts`
- [x] OpenRouter request helper is testable without real network by injecting a fake fetch.
- [x] Missing `OPENROUTER_API_KEY` fails only in API-backed write mode.
- [x] Cached translations are reused without API calls.

#### Manual Verification

- [ ] Inspect one generated cache file and confirm it is readable and lesson-scoped.
- [ ] Confirm Mermaid entries are cached with manual-translation status and source text.

**Implementation Note**: Do not commit real API keys. If cache files include source/translated content, review them as content artifacts.

---

## Phase 3: Repair Writer CLI

### Overview

Add the author-facing script that reports, translates, caches, and optionally writes patched English HTML.

### Changes Required

#### 1. CLI script

**File**: `scripts/repair-prework-code-blocks.ts`

**Changes**:

Add modes and options:

```bash
tsx scripts/repair-prework-code-blocks.ts --report
tsx scripts/repair-prework-code-blocks.ts --dry-run
tsx scripts/repair-prework-code-blocks.ts --write
tsx scripts/repair-prework-code-blocks.ts --write --lesson 10
tsx scripts/repair-prework-code-blocks.ts --report --json
```

Option behavior:

- `--report`: no writes, no API calls, exit 0.
- `--dry-run`: use cache and show planned writes, but no API calls and no file writes.
- `--write`: repair suspicious matched blocks, update cache, write EN HTML.
- `--lesson <prefix>`: limit work to one lesson prefix.
- `--model <id>`: override model.
- `--force`: ignore existing valid cache for suspicious code blocks.
- `--json`: print diagnostics as JSON.

#### 2. Env loading

**File**: `scripts/repair-prework-code-blocks.ts`

**Changes**:

- Reuse the env-file loading pattern from `scripts/generate-ebook-illustrations.ts`.
- Load `.env.local` then `.env`.
- Require `OPENROUTER_API_KEY` only when a cache miss in `--write` mode needs an API call.

#### 3. HTML patching

**File**: `src/server/content/preworkCodeBlockRepair.ts`

**Changes**:

- Add `applyPreBlockRepairsToEnglishHtml(html, repairs)`.
- Use Cheerio with `decodeEntities: false`.
- Replace text content only:
  - `pre>code`: set code element text.
  - `pre.mermaid`: set pre text.
- Preserve existing classes and attributes on `<pre>` and `<code>`.
- Do not rewrite unrelated HTML formatting more than Cheerio requires. If Cheerio causes large serialization churn, patch text ranges from node offsets or isolate body-level replacement.

#### 4. Repair behavior

**File**: `scripts/repair-prework-code-blocks.ts`

**Changes**:

For each issue:

- `suspicious-code`:
  - use cache if valid.
  - otherwise call OpenRouter.
  - validate translated text.
  - cache the result.
  - patch EN block.
- `suspicious-mermaid`:
  - copy full PL Mermaid source into EN.
  - cache as `restored-polish-mermaid` and `manual-translation-required`.
  - report it for manual translation.
  - patch EN block.
- `missing`:
  - cache/report if useful.
  - never insert.
  - keep exit code 0 in report mode.

#### 5. Write-mode tests

**File**: `src/server/content/preworkCodeBlockRepair.test.ts`

**Changes**:

- Patch one suspicious `pre>code` block.
- Patch one suspicious `pre.mermaid` block.
- Preserve `class`, `data-language`, and `language-*` attributes.
- Do not insert missing blocks.
- Do not rewrite healthy blocks.

### Success Criteria

#### Automated Verification

- [x] CLI can run report mode: `tsx scripts/repair-prework-code-blocks.ts --report`
- [x] CLI can run JSON report: `tsx scripts/repair-prework-code-blocks.ts --report --json`
- [x] Write-mode helper tests pass.
- [x] Missing block in lesson `11` is reported and not inserted.
- [x] Mermaid blocks are restored from Polish and reported for manual translation.

#### Manual Verification

- [ ] Run `tsx scripts/repair-prework-code-blocks.ts --report` and inspect the summary.
- [ ] Run `tsx scripts/repair-prework-code-blocks.ts --write --lesson 10` with a valid API key and inspect the resulting diff.
- [ ] Confirm cache file `scripts/prework-code-translations/cache/10.cache.json` is created or updated.
- [ ] Confirm English lesson HTML still renders in the lesson shell.

**Implementation Note**: After first write-mode run, inspect a representative diff before running all lessons.

---

## Phase 4: Checks and NPM Integration

### Overview

Wire the repair script into npm scripts so authors can run repair explicitly and `check:lesson-html` reports issues without failing.

### Changes Required

#### 1. Add npm scripts

**File**: `package.json`

**Changes**:

Add:

```json
{
  "scripts": {
    "repair:prework-code-blocks": "tsx scripts/repair-prework-code-blocks.ts --write",
    "report:prework-code-blocks": "tsx scripts/repair-prework-code-blocks.ts --report",
    "check:prework-code-blocks": "tsx scripts/repair-prework-code-blocks.ts --report"
  }
}
```

Update `check:lesson-html` to report but not fail on code-block issues:

```json
"check:lesson-html": "tsx scripts/generate-lesson-html.ts --check && tsx scripts/enrich-lesson-html.ts --check --lang en && npm run check:prework-code-blocks"
```

Important: `check:prework-code-blocks` must exit 0 even when it reports issues.

#### 2. Non-failing report semantics

**File**: `scripts/repair-prework-code-blocks.ts`

**Changes**:

- `--report` exits 0 for found issues.
- Script exits non-zero only for operational errors:
  - unreadable directories.
  - duplicate lesson pairing.
  - invalid CLI args.
  - malformed cache JSON.
  - API/validation failure in write mode.

#### 3. Generated-content tests

**File**: `src/server/content/generatedLessonHtml.test.ts`

**Changes**:

- Do not require code-block repair report to be clean unless the team later wants strict enforcement.
- Optionally add a test that report generation itself works against real content and returns diagnostics in a stable shape.

### Success Criteria

#### Automated Verification

- [x] `npm run report:prework-code-blocks` exits 0.
- [x] `npm run check:lesson-html` exits 0 even when report mode finds remaining Mermaid manual-translation items or missing blocks.
- [x] `npm run test -- src/server/content/preworkCodeBlockRepair.test.ts`
- [x] Existing content tests still pass.

#### Manual Verification

- [ ] Confirm `check:lesson-html` output clearly reports code-block issues without looking like a build failure.
- [ ] Confirm `repair:prework-code-blocks` is clearly opt-in and can make API calls.

**Implementation Note**: Keep API-backed repair out of `prep:lesson-html` for now to avoid accidental paid requests.

---

## Phase 5: Docs and Manual Review Workflow

### Overview

Document the repair flow, cache location, and Mermaid/manual-review expectations.

### Changes Required

#### 1. Script README

**File**: `scripts/prework-code-translations/README.md`

**Changes**:

Document:

- Why this script exists.
- Commands:

```bash
npm run report:prework-code-blocks
npm run repair:prework-code-blocks
tsx scripts/repair-prework-code-blocks.ts --write --lesson 10
npm run check:lesson-html
```

- Required environment variable for repair mode:

```bash
OPENROUTER_API_KEY=...
```

- Default model:

```bash
google/gemini-2.5-flash
```

- Cache path:

```text
scripts/prework-code-translations/cache/<lesson-prefix>.cache.json
```

- Mermaid policy:
  - restored from Polish source for completeness.
  - reported for manual English translation.
  - stored in cache so later translation work can reuse source and metadata.

#### 2. Content workflow note

**File**: `src/content-source/lessons10xDevs3Prework/README.md`

**Changes**:

- Add a short note after translation/enrichment instructions:
  - run report after pulling translated EN HTML.
  - run repair if code blocks were truncated.
  - inspect Mermaid manual-translation report.

#### 3. Manual verification checklist

**File**: `scripts/prework-code-translations/README.md`

**Changes**:

Add checklist:

1. `npm run report:prework-code-blocks`
2. `tsx scripts/repair-prework-code-blocks.ts --write --lesson <prefix>`
3. Inspect cache and HTML diff.
4. Repeat for all affected lessons.
5. `npm run check:lesson-html`
6. Open affected EN lessons locally.
7. Manually translate Mermaid labels where reported.

### Success Criteria

#### Automated Verification

- [x] Documentation files exist.
- [x] Commands documented in README match `package.json`.
- [x] `npm run check:lesson-html` still works.

#### Manual Verification

- [ ] A maintainer can understand when report mode is enough and when write mode may call OpenRouter.
- [ ] Mermaid manual-translation responsibilities are explicit.

---

## Testing Strategy

### Unit Tests

- `preworkCodeBlockRepair.test.ts`:
  - pair PL and EN lessons by prefix.
  - extract `pre>code` and `pre.mermaid`.
  - classify suspicious and missing blocks.
  - preserve attributes during patching.
  - cache key and per-lesson cache read/write.
  - validation rejects first-line-only and fenced outputs.
  - validation accepts multi-line translated prompt/code.

### Script-Level Tests

- CLI argument parsing can be tested through exported pure parser or by invoking the script in temp fixtures if practical.
- OpenRouter helper should accept injectable `fetch` for success, API error, and malformed response tests.
- Report mode should not require `OPENROUTER_API_KEY`.
- Write mode should require `OPENROUTER_API_KEY` only on cache miss.

### Real-Content Checks

- `npm run report:prework-code-blocks`
- `npm run check:lesson-html`
- `npm run test -- src/server/content/preworkCodeBlockRepair.test.ts`
- `npm run build`

### Manual Testing Steps

1. Run `npm run report:prework-code-blocks`.
2. Confirm affected lessons include `02`, `03`, `04`, `09`, `10`, `11`, `12`, and `14`.
3. Set `OPENROUTER_API_KEY` locally.
4. Run `tsx scripts/repair-prework-code-blocks.ts --write --lesson 10`.
5. Inspect `src/content/lessons10xDevs3Prework/en/10-3x2.html`.
6. Inspect `scripts/prework-code-translations/cache/10.cache.json`.
7. Repeat for other affected lessons.
8. Run `npm run check:lesson-html`.
9. Start dev server with `npm run dev`.
10. Open affected EN lessons and verify code blocks render completely.
11. Manually translate reported Mermaid diagrams if needed.

## Performance Considerations

- The affected block count is small, so serial OpenRouter calls are adequate.
- Cache prevents repeated API cost during retries.
- Report mode performs only local file reads and DOM parsing.
- `check:lesson-html` remains suitable for regular builds because it does not call OpenRouter.

## Migration Notes

- English HTML files under `src/content/lessons10xDevs3Prework/en` will change after repair.
- New cache files under `scripts/prework-code-translations/cache` may be committed as content/provenance artifacts if the team wants reproducible repair output.
- If a translation is poor, update the cache entry manually or rerun with `--force --lesson <prefix>`.
- Missing blocks remain a manual content issue and are intentionally not inserted by the script.

## References

- Existing scripts: `package.json:13`
- English enrichment CLI: `scripts/enrich-lesson-html.ts:1`
- Lesson pairing and metadata enrichment: `src/server/content/lessonHtmlEnricher.ts:65`
- English metadata rendering: `src/server/content/lessonHtmlEnricher.ts:141`
- Polish HTML generation: `src/server/content/lessonHtmlGenerator.ts:99`
- OpenRouter script pattern: `scripts/generate-ebook-illustrations.ts:478`
- Generated/enriched content tests: `src/server/content/generatedLessonHtml.test.ts:54`
- OpenRouter chat completions docs: `https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request`
- OpenRouter Gemini 2.5 Flash model page: `https://openrouter.ai/google/gemini-2.5-flash/api`

<!-- PLAN COMPLETED: 2026-04-28 -->
