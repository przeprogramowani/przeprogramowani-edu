# Ebook Markdown Export Images Implementation Plan

## Overview

Make image links in the downloaded 10xDevs 3 ebook markdown work outside the site context by rewriting ebook illustration URLs from root-relative `/assets/...` paths to absolute `https://platforma.przeprogramowani.pl/assets/...` URLs in the export response only.

This plan keeps the scope intentionally narrow:
- ebook export only
- plain `.md` download only
- no offline packaging
- no shared export refactor

## Current State Analysis

- The ebook page renders markdown directly from the content collection, so the on-site reader correctly uses root-relative asset paths from the markdown source.
- The ebook markdown export route currently returns `rawContent()` with only minimal HTML-shell cleanup, so every `/assets/...` image path is preserved verbatim in the downloaded file.
- The illustration runbook explicitly recorded export-specific path handling as deferred, so the current behavior is known but intentionally unfinished.

## Desired End State

After this change:
- `/10xdevs-3/ebook` still renders the original markdown with root-relative `/assets/...` image paths.
- `/10xdevs-3/ebook/markdown` still downloads a plain markdown file, but ebook illustration links are rewritten to absolute `https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/...` URLs.
- The rewrite is scoped only to ebook illustration image URLs in the exported markdown response.
- Non-image links, anchor links, and the source markdown file remain unchanged.

Verification at end:
- Downloaded markdown contains absolute illustration URLs for the hero image and chapter images.
- Downloaded markdown no longer contains root-relative `/assets/10xdevs/ebook-evals/...` image links.
- Ebook page rendering remains unchanged.

### Key Discoveries:

- Ebook export currently passes through raw markdown content with only wrapper stripping: `src/pages/10xdevs-3/ebook/markdown.astro:11-17`
- Ebook page renders the source markdown directly via Astro content collection: `src/pages/10xdevs-3/ebook/index.astro:53`
- The source ebook markdown now contains 21 illustration embeds using root-relative asset paths, starting at:
  - `src/content/resources/10xdevs3-ebook.md:3`
  - `src/content/resources/10xdevs3-ebook.md:149`
  - `src/content/resources/10xdevs3-ebook.md:1243`
- Existing runbook explicitly marks export path handling as deferred: `docs/10xdevs3-ebook-illustrations.md:145-151`

## What We're NOT Doing

- Bundling images for offline export
- Replacing the markdown download with `.zip` or any multi-file artifact
- Generalizing the change to shared lessons, external lessons, or checklist exports
- Rewriting non-image links to the platform domain
- Changing the ebook source markdown to absolute URLs
- Introducing environment-driven export domains in this task

## Implementation Approach

Implement a route-local rewrite step inside `src/pages/10xdevs-3/ebook/markdown.astro`:

1. Read the raw ebook markdown as today.
2. Strip any accidental HTML shell markers as today.
3. Rewrite only markdown image URLs that target `/assets/10xdevs/ebook-evals/...` by prefixing them with `https://platforma.przeprogramowani.pl`.
4. Keep frontmatter generation and `Content-Disposition` handling unchanged.

This preserves the site reading experience while making the downloaded markdown portable across markdown readers that do not resolve root-relative paths against the platform domain.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This is a synchronous server-side string transformation in a markdown download response. There is no client lifecycle or async UI behavior involved.

### User Experience Specification

- The visible ebook page keeps current behavior and current image URLs.
- The user still clicks the same `Pobierz Markdown` button and receives a plain `.md` file.
- Inside the downloaded markdown:
  - ebook illustration images use absolute production URLs
  - anchor links like `(#...)` remain untouched
  - normal external links remain untouched
- If a root-relative image path somehow escapes the rewrite, the export still downloads; this task does not fail the response at runtime.

**Derived from**: user decisions in planning rounds

### Performance & Optimization Strategy

- Use a single deterministic string rewrite on the response body.
- Scope the rewrite to ebook illustration markdown image paths only to avoid unnecessary replacements.
- Avoid filesystem checks, network requests, or asset manifest lookups during export.

**Derived from**: current raw markdown export path and narrow ebook-only scope

### State Management Sequencing

**N/A**: No client state, server cache, or cross-request sequencing is involved.

### Debug & Observability Plan

- Keep the rewrite logic explicit and adjacent to the existing cleanup block in `src/pages/10xdevs-3/ebook/markdown.astro`.
- Verify behavior with direct route output inspection rather than runtime logging.
- Use deterministic smoke checks:
  - exported markdown contains `https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/`
  - exported markdown no longer contains `](/assets/10xdevs/ebook-evals/`
  - exported markdown still contains expected frontmatter and internal anchors

**Derived from**: simple response-transform design and existing repo testing patterns

## Phase 1: Export Rewrite Rules

### Overview

Add the route-local transformation that rewrites ebook illustration image URLs in the markdown download response only.

### Changes Required:

#### 1. Ebook Markdown Export Route

**File**: `src/pages/10xdevs-3/ebook/markdown.astro`
**Changes**:
- Add a fixed production asset base constant:
  - `https://platforma.przeprogramowani.pl`
- After the current HTML-wrapper cleanup and before frontmatter assembly, add a route-local rewrite step for markdown image links that point to `/assets/10xdevs/ebook-evals/...`
- Keep the rewrite narrow:
  - rewrite image URLs only
  - rewrite only the ebook illustration directory
  - do not touch anchor links or ordinary links
- Add a short comment explaining why export URLs differ from on-site page URLs

```ts
const EBOOK_EXPORT_ASSET_ORIGIN = 'https://platforma.przeprogramowani.pl';

markdownContent = markdownContent.replace(
  /(!\[[^\]]*]\()(?=\/assets\/10xdevs\/ebook-evals\/)/g,
  `$1${EBOOK_EXPORT_ASSET_ORIGIN}`
);
```

### Success Criteria:

#### Automated Verification:

- [x] Route contains a fixed production export origin and scoped rewrite logic
- [x] `npm run build`
- [x] Source still reads markdown from `rawContent()` and still returns a plain markdown response

#### Manual Verification:

- [ ] Hero image link in downloaded markdown starts with `https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/hero-overview.webp`
- [ ] At least one later chapter image link is also absolute
- [ ] Ebook page at `/10xdevs-3/ebook` still renders normally with no content regression

**Implementation Note**: After completing this phase and automated verification, pause for human confirmation of the downloaded markdown behavior before proceeding.

---

## Phase 2: Endpoint Verification

### Overview

Prove that the export response now contains portable image URLs and that unrelated markdown links remain unchanged.

### Changes Required:

#### 1. Export Smoke Verification

**File**: `src/pages/10xdevs-3/ebook/markdown.astro`
**Changes**:
- No additional shared helper extraction in this phase
- Verification stays route-focused because the task is intentionally ebook-only

#### 2. Verification Procedure

**Operational checks**:
- Run the app locally
- Request `/10xdevs-3/ebook/markdown`
- Inspect the response body for rewritten illustration URLs and unchanged non-image markdown links

```bash
npm run dev
curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg 'https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/'
curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg '\]\\(/assets/10xdevs/ebook-evals/' && exit 1 || true
```

### Success Criteria:

#### Automated Verification:

- [x] `curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg 'https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/'`
- [x] `curl -s 'http://localhost:4321/10xdevs-3/ebook/markdown' | rg '\]\\(/assets/10xdevs/ebook-evals/' && exit 1 || true`
- [x] Export response still includes expected YAML frontmatter fields:
  - `title`
  - `type: "ebook"`
  - `format: "markdown"`

#### Manual Verification:

- [ ] Open the downloaded markdown in a markdown viewer outside the platform site context and confirm illustrations resolve
- [ ] Confirm table of contents anchors and ordinary external source links were not rewritten to `platforma.przeprogramowani.pl`
- [ ] Confirm the export remains a single `.md` file download, not a packaged artifact

**Implementation Note**: After completing this phase and automated verification, pause for human confirmation that a real markdown viewer resolves the exported image URLs as expected.

---

## Phase 3: Documentation Update

### Overview

Replace the stale “deferred” export-path note with the now-approved production-domain behavior and explicitly document what remains out of scope.

### Changes Required:

#### 1. Illustration Runbook

**File**: `docs/10xdevs3-ebook-illustrations.md`
**Changes**:
- Update the deferred-item section to reflect the implemented behavior:
  - ebook page keeps `/assets/...` image links
  - markdown export rewrites ebook illustration links to `https://platforma.przeprogramowani.pl/assets/...`
- Explicitly document current non-goals:
  - no offline packaging
  - no export bundling
  - no shared export refactor in this task

#### 2. Verification Guidance

**File**: `docs/10xdevs3-ebook-illustrations.md`
**Changes**:
- Add a concrete validation command for checking rewritten export URLs in the downloaded markdown response
- Keep the source markdown verification command for the on-site content path

### Success Criteria:

#### Automated Verification:

- [x] Runbook no longer says the export path strategy is deferred for the ebook markdown export
- [x] Runbook includes the fixed production-domain export behavior
- [x] `rg -n 'platforma\\.przeprogramowani\\.pl/assets/10xdevs/ebook-evals' docs/10xdevs3-ebook-illustrations.md`

#### Manual Verification:

- [ ] Another team member can read the runbook and understand why the page and export use different image URL shapes
- [ ] The runbook clearly states that offline packaging is not supported in this phase

**Implementation Note**: After completing this phase and automated verification, pause for human confirmation that the documented behavior matches the shipped route behavior.

---

## Testing Strategy

### Unit Tests:

- None required if the rewrite remains route-local and verification stays response-based.
- If implementation complexity grows during execution, reassess and extract an ebook-specific pure function only if necessary to keep the change correct.

### Integration Tests:

- Local route smoke check against `/10xdevs-3/ebook/markdown`
- Build verification with `npm run build`
- Response-body assertions for:
  - absolute illustration URLs present
  - root-relative illustration URLs absent
  - frontmatter preserved

### Manual Testing Steps:

1. Start the app locally and trigger the ebook markdown download.
2. Open the downloaded file in a markdown reader outside the platform site context.
3. Verify hero and chapter illustrations load from `https://platforma.przeprogramowani.pl/assets/10xdevs/ebook-evals/...`.
4. Verify on-page ebook rendering at `/10xdevs-3/ebook` is unchanged.
5. Confirm the artifact is still a plain `.md` file.

## Performance Considerations

- The rewrite is a single pass over the markdown string and should be negligible relative to response generation.
- Keeping the transformation route-local avoids broader refactor risk in unrelated markdown exports.

## Migration Notes

- No data migration.
- No asset relocation.
- No content-file migration.
- Source markdown remains root-relative by design; only the export response changes.

## References

- Ebook source image embeds: `src/content/resources/10xdevs3-ebook.md:3`, `:149`, `:165`, `:202`, `:1243`
- Ebook page render path: `src/pages/10xdevs-3/ebook/index.astro:53`
- Ebook markdown export passthrough: `src/pages/10xdevs-3/ebook/markdown.astro:11-17`
- Ebook markdown response assembly: `src/pages/10xdevs-3/ebook/markdown.astro:23-37`
- Existing deferred export note: `docs/10xdevs3-ebook-illustrations.md:145-151`
<!-- PLAN COMPLETED: 2026-03-28 -->
