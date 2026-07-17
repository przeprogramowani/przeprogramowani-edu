# 10xDevs 3 Ebook Illustrations (OpenRouter) Implementation Plan

## Overview

Add AI-generated visuals to `src/content/resources/10xdevs3-ebook.md` by:
1. Selecting high-value insertion anchors in the ebook
2. Generating conceptual illustrations through OpenRouter
3. Recommending source-grounded infographic chunks for manual creation in NotebookLM
3. Manually approving factual correctness
4. Embedding approved assets into the ebook markdown using web paths

Confirmed product decisions from user:
- 1-2 assets per chapter (target 12-16 total)
- Include 1 hero image
- Automated pipeline covers illustrations only; text-heavy infographics will be created manually in NotebookLM from ebook chunks
- Minimal text on generated illustrations
- No extra facts beyond ebook content
- Max 2 generation attempts per asset
- No captions under images
- Dark visual style, neutral educational tone, subtle cosmic 10xDevs vibe
- Main palette is fixed to: `#F68F09`, `#CD84FF`, `#1F36E4`
- For now: web-path embedding in ebook; export-specific path strategy deferred

## Current State Analysis

- Ebook content is a single markdown file: `src/content/resources/10xdevs3-ebook.md` (1280 lines)
- Ebook page renders markdown directly via Astro content collection:
  - `src/pages/10xdevs-3/ebook/index.astro:7`
  - `src/pages/10xdevs-3/ebook/index.astro:53`
- Markdown export endpoint returns raw markdown body, so inserted image links will also be present in downloaded markdown:
  - `src/pages/10xdevs-3/ebook/markdown.astro:11`
  - `src/pages/10xdevs-3/ebook/markdown.astro:33`
- No current image embeds in `10xdevs3-ebook.md` (`![...]` not present)
- No existing OpenRouter image-generation automation in `scripts/` (requires new script/workflow)

## Desired End State

The ebook includes a complete visual layer:
- 1 hero image near the top
- 10-11 chapter illustrations generated through the scripted pipeline
- 1 NotebookLM brief listing recommended infographic chunks for each chapter
- Every scripted illustration is generated from a deterministic prompt spec and saved in a stable public path
- Every asset is manually approved for factual correctness before markdown insertion
- Ebook page and markdown export both include valid links

Verification at end:
- `/10xdevs-3/ebook` renders all images correctly
- `/10xdevs-3/ebook/markdown` download includes image links and remains valid markdown
- Asset generation process is repeatable from config + script

### Key Discoveries:

- Ebook rendering path is direct markdown content render: `src/pages/10xdevs-3/ebook/index.astro:53`
- Download endpoint forwards raw markdown body: `src/pages/10xdevs-3/ebook/markdown.astro:11`
- Good insertion anchors already exist as strong conceptual section headers:
  - `src/content/resources/10xdevs3-ebook.md:147` (`Cykl życia benchmarku`)
  - `src/content/resources/10xdevs3-ebook.md:372` (`pass@k vs pass^k`)
  - `src/content/resources/10xdevs3-ebook.md:661` (`Szybki przewodnik wyboru`)
  - `src/content/resources/10xdevs3-ebook.md:1026` (`Co chcesz ustalić?`)
  - `src/content/resources/10xdevs3-ebook.md:1147` (`Krok 1`)
- Extracted reference style traits to enforce in prompts:
  - dark cosmic scenes with cinematic blue/purple base and warm orange highlights
  - strong rim-light and neon glow accents
  - high-contrast hero framing with central subject and depth layers
  - clean sci-fi UI panels for infographic-like technical scenes

## What We're NOT Doing

- Building an alternate export-link transformation layer in this task
- Changing ebook chapter text or claims (except adding image markdown lines)
- Adding image captions under each figure
- Creating dynamic image CDN/service logic in runtime
- Adding new page components for galleries/carousels
- Rewriting visual style of the ebook page

## Implementation Approach

Use a config-driven asset pipeline:
1. Define a single source of truth for assets (anchor, prompt, model, output filename)
2. Generate assets with OpenRouter via scripted fetch
3. Save deterministic metadata (model, prompt hash, attempts, output path)
4. Manually approve assets in a review checklist
5. Embed only approved assets into markdown

This keeps regeneration possible without re-deciding placements or prompts.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- Ebook page is static markdown rendering (`<Content />`), so no UI lifecycle complexity is required.
- Image loading behavior will be browser-default for markdown image syntax.
- Because images are on page load path, optimize asset size at generation time (resolution/compression) to avoid excessive initial payload.

**Derived from**: static render flow in `src/pages/10xdevs-3/ebook/index.astro:53`

### User Experience Specification

- Visual pacing:
  - Hero image after title/introduction opening
  - Remaining images inserted after key section intros or framework blocks
  - Do not break existing tables in half
- No captions (explicit user decision)
- Alt text required for all images (Polish)
- Visual language:
  - Automated visuals are conceptual illustrations only
  - Text-heavy infographics are handled manually in NotebookLM from tightly scoped ebook chunks
  - Dark theme baseline for all assets
  - Main palette lock: `#F68F09`, `#CD84FF`, `#1F36E4`
  - Must match reference style family from `/Users/admin/Downloads/referance-images`
  - Prefer cinematic depth, glow edges, and rounded-mask compositions from reference pack
  - No heavy brand overlays/logos

**Derived from**: user answers + ebook structure

### Performance & Optimization Strategy

- Store assets as `.webp` in `public/assets/10xdevs/ebook-evals/`
- Target width per asset:
  - Hero: 1600px
  - Section visuals: 1200-1400px
- Target size:
  - Hero <= 350 KB
  - Section visual <= 250 KB each
- Keep total added image payload budget <= ~4 MB for first version

**Derived from**: static markdown render + no runtime lazy-loading control in markdown syntax

### State Management Sequencing

**N/A**: This change is content + static assets + generation script, with no frontend state flow changes.

### Debug & Observability Plan

- Script logs one JSONL/JSON manifest entry per asset generation attempt:
  - `assetId`, `model`, `promptHash`, `attempt`, `outputPath`, `status`, `error`
- Maintain human-readable review checklist:
  - factual correctness
  - readability
  - visual consistency
- Add `--dry-run` and `--validate-only` script modes
- Validation checks before markdown insertion:
  - all `must_have` assets approved
  - files exist at expected public paths

**Derived from**: requirement for manual factual gate + reproducible generation process

## Asset Blueprint (Approved Scope)

Target total: 21 scripted illustrations (1 hero + 20 chapter illustrations), plus a manual NotebookLM infographic brief.

| Asset ID | Anchor (file:line) | Type | Intent |
|---|---|---|---|
| hero-overview | `10xdevs3-ebook.md:43` | Illustration | Cosmic meta-visual of noisy rankings vs grounded evaluation |
| ch1-metric-reductionism | `10xdevs3-ebook.md:136` | Illustration | Single-number trap (pass@1 vs reality) |
| ch1-benchmark-lifecycle-orbit | `10xdevs3-ebook.md:147` | Illustration | Benchmark lifecycle as one orbital process |
| ch2-maturity-spectrum | `10xdevs3-ebook.md:184` | Illustration | Maturity spectrum shown as adjacent visual zones |
| ch2-benchmark-landscape | `10xdevs3-ebook.md:200` | Illustration | Ecosystem map of benchmark families |
| ch3-agent-vs-inline | `10xdevs3-ebook.md:451` | Illustration | Inline completion vs multi-step agent work |
| ch3-cost-vs-value | `10xdevs3-ebook.md:376` | Illustration | Cost-versus-value tension behind coding eval metrics |
| ch4-harness-system-model | `10xdevs3-ebook.md:488` | Illustration | Model vs harness system analogy |
| ch4-architecture-paradigms | `10xdevs3-ebook.md:495` | Illustration | Workflow vs agentic vs hybrid as distinct operating modes |
| ch5-technique-spectrum | `10xdevs3-ebook.md:586` | Illustration | Vibe coding -> TDAID maturity spectrum |
| ch5-perception-gap | `10xdevs3-ebook.md:600` | Illustration | Perception gap between felt and measured productivity |
| ch6-hybrid-eval-stack | `10xdevs3-ebook.md:741` | Illustration | Buy infrastructure, build domain logic pattern |
| ch6-framework-selector | `10xdevs3-ebook.md:661` | Illustration | Framework choice mapped to situation and team needs |
| ch7-10xbench-criteria | `10xdevs3-ebook.md:881` | Illustration | Hybrid scoring and hallucination failure concept |
| ch7-quality-gate | `10xdevs3-ebook.md:781` | Illustration | Quality gate for AI-generated code before merge |
| ch8-price-frontier | `10xdevs3-ebook.md:985` | Illustration | Cost-quality frontier as a visual path |
| ch8-tier-routing | `10xdevs3-ebook.md:991` | Illustration | Task difficulty routed to the right model tier |
| ch9-decision-scorecard | `10xdevs3-ebook.md:1051` | Illustration | Weighted decision scorecard for tool choice |
| ch9-decision-tree | `10xdevs3-ebook.md:1026` | Illustration | Decision tree for choosing the evaluation path |
| ch10-rollout-mission | `10xdevs3-ebook.md:1147` | Illustration | 3-step rollout as a staged mission |
| ch10-daily-quality-workflow | `10xdevs3-ebook.md:1194` | Illustration | Daily verification workflow from AI generation to merge |

Must-have subset (if schedule compresses):
- `hero-overview`
- `ch1-metric-reductionism`
- `ch1-benchmark-lifecycle-orbit`
- `ch2-maturity-spectrum`
- `ch2-benchmark-landscape`
- `ch3-agent-vs-inline`
- `ch3-cost-vs-value`
- `ch4-harness-system-model`
- `ch4-architecture-paradigms`
- `ch5-technique-spectrum`
- `ch5-perception-gap`
- `ch6-hybrid-eval-stack`
- `ch6-framework-selector`
- `ch7-10xbench-criteria`
- `ch7-quality-gate`
- `ch8-price-frontier`
- `ch8-tier-routing`
- `ch9-decision-scorecard`
- `ch9-decision-tree`
- `ch10-rollout-mission`
- `ch10-daily-quality-workflow`

## Phase 1: Visual Blueprint & Prompt Specification

### Overview

Create a deterministic illustration specification, style framework, and NotebookLM handoff brief before any generation.

### Changes Required:

#### 1. Asset Spec File

**File**: `scripts/ebook-illustrations/spec.json`
**Changes**:
- Add 21 illustration asset entries with:
  - `id`
  - `anchorHeading` / `anchorLine`
  - `assetType` (`illustration`)
  - `stylePreset` (`dark-cosmic-10xdevs`)
  - `paletteHex` (`["#F68F09","#CD84FF","#1F36E4"]`)
  - `promptPl`
  - `negativePromptPl`
  - `modelPrimary`
  - `modelFallback`
  - `mustHave` (boolean)
  - `outputFilename`
  - `altTextPl`
  - `styleReferenceIds` (list of filenames from reference pack)

```json
{
  "ebook": "10xdevs3-ebook",
  "assetBasePath": "/assets/10xdevs/ebook-evals",
  "assets": [
    {
      "id": "ch3-agent-vs-inline",
      "anchorLine": 451,
      "assetType": "illustration",
      "stylePreset": "dark-cosmic-10xdevs",
      "paletteHex": ["#F68F09", "#CD84FF", "#1F36E4"],
      "mustHave": true,
      "outputFilename": "ch3-agent-vs-inline.webp"
    }
  ]
}
```

#### 2. Style Reference Manifest

**File**: `scripts/ebook-illustrations/style-references.json`
**Changes**:
- Add curated subset of reference files (4-6 key visuals) and extracted style notes:
  - lighting pattern
  - composition pattern
  - texture/detail expectations
  - forbidden traits (flat stock-photo look, generic clipart style)
- This manifest is used to compose common prompt prefix for all assets
#### 3. Human Review Checklist

**File**: `scripts/ebook-illustrations/review.md`
**Changes**:
- Add per-asset review sections with checkbox fields:
  - factual correctness vs source lines
  - readability
  - style consistency
  - matches reference-style cues (lighting/composition)
  - final selected attempt

### Success Criteria:

#### Automated Verification:

- [x] Spec file exists and includes 21 assets: `rg -n '"id":' scripts/ebook-illustrations/spec.json | wc -l`
- [x] Must-have set defined: `rg -n '"mustHave": true' scripts/ebook-illustrations/spec.json | wc -l`
- [x] Style reference manifest exists and has curated references: `cat scripts/ebook-illustrations/style-references.json`
- [x] Review checklist includes all asset IDs: `rg -n '^## asset:' scripts/ebook-illustrations/review.md | wc -l`

#### Manual Verification:

- [ ] Every asset has clear anchor and purpose
- [ ] Every prompt is constrained to facts already present in ebook
- [ ] Every prompt explicitly enforces dark style + palette (`#F68F09`, `#CD84FF`, `#1F36E4`)
- [ ] Every prompt includes shared style prefix derived from reference pack
- [ ] Illustration coverage gives each numbered chapter exactly two strong visual anchors

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: OpenRouter Generation Pipeline

### Overview

Implement script-based generation via OpenRouter with retry cap and deterministic output paths.

### Changes Required:

#### 1. Generation Script

**File**: `scripts/generate-ebook-illustrations.ts`
**Changes**:
- Read `spec.json`
- Support CLI flags:
  - `--validate-only`
  - `--dry-run`
  - `--asset <id>`
  - `--attempts <n>` (cap to 2 by default)
- Call OpenRouter image endpoint with `OPENROUTER_API_KEY`
- Save outputs under:
  - `public/assets/10xdevs/ebook-evals/*.webp`
- Write generation manifest:
  - `scripts/ebook-illustrations/generation-manifest.json`

```ts
// Pseudocode flow
loadSpec();
for (const asset of selectedAssets) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await generateViaOpenRouter(asset, attempt);
    saveImage(result, publicPath);
    appendManifest({...});
    if (result.ok) break;
  }
}
```

#### 2. Package Script

**File**: `package.json`
**Changes**:
- Add script command:
  - `"generate:ebook-illustrations": "tsx scripts/generate-ebook-illustrations.ts"`

### Success Criteria:

#### Automated Verification:

- [x] Validator mode works: `npm run generate:ebook-illustrations -- --validate-only`
- [x] Dry-run works without network writes: `npm run generate:ebook-illustrations -- --dry-run`
- [x] Single-asset generation works: `npm run generate:ebook-illustrations -- --asset hero-overview --attempts 1`
- [x] Build still passes: `npm run build`

#### Manual Verification:

- [ ] Manifest contains model, prompt hash, attempt, and output path for generated asset
- [ ] Generated sample asset is readable and on-style
- [ ] Retry cap behavior is correct (max 2 attempts)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Illustration Generation + NotebookLM Brief

### Overview

Generate all scripted illustrations, approve final variants with a strict factual gate, and prepare chapter-by-chapter NotebookLM infographic recommendations.

### Changes Required:

#### 1. Final Illustration Batch

**Files**: `public/assets/10xdevs/ebook-evals/*.webp`
**Changes**:
- Generate all illustration assets in scope
- Keep final selected variant per asset

#### 2. QA Completion

**Files**:
- `scripts/ebook-illustrations/review.md`
- `scripts/ebook-illustrations/generation-manifest.json`
**Changes**:
- Mark final approved version for each illustration asset
- Explicitly reject/record failed attempts

#### 3. Manual Infographic Brief

**File**: `scripts/ebook-illustrations/notebooklm-infographic-brief.md`
**Changes**:
- Recommend 1 strong source chunk per chapter for manual NotebookLM infographic generation
- Include 16:9 guardrails and a reusable prompting template

### Success Criteria:

#### Automated Verification:

- [x] All must-have illustration files exist in `public/assets/10xdevs/ebook-evals/`
- [x] Manifest has entries for all illustration assets in scope
- [x] NotebookLM brief exists and covers chapters 1-10
- [x] Average file size is within defined budget (script or manual file check)

#### Manual Verification:

- [x] Every approved asset contains no new unsupported facts
- [x] Visual style remains coherent (dark + neutral educational + subtle cosmic feel)
- [x] Approved assets consistently apply palette (`#F68F09`, `#CD84FF`, `#1F36E4`)
- [x] Polish language quality is correct where text exists
- [x] NotebookLM chunk recommendations map cleanly to real ebook passages and stay narrow enough to avoid mixed-source infographics

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Ebook Integration

### Overview

Insert the hero and scripted chapter illustrations into markdown at defined anchors using web paths.

### Changes Required:

#### 1. Markdown Embedding

**File**: `src/content/resources/10xdevs3-ebook.md`
**Changes**:
- Add hero image near opening section
- Add the approved chapter illustrations after selected anchor sections
- Use web path format:
  - `/assets/10xdevs/ebook-evals/<file>.webp`
- Use alt text from spec
- Keep no captions (user decision)

```md
![Cykl życia benchmarku jako orbitalny proces iteracji](/assets/10xdevs/ebook-evals/ch1-benchmark-lifecycle-orbit.webp)
```

#### 2. Minimal Rendering Safeguards (Optional if needed)

**File**: `src/pages/10xdevs-3/ebook/index.astro`
**Changes**:
- Only if needed, add global prose image style tuning (max width, border radius, spacing)
- Avoid structural component refactor

### Success Criteria:

#### Automated Verification:

- [x] Markdown references expected asset path prefix: `rg -n '/assets/10xdevs/ebook-evals/' src/content/resources/10xdevs3-ebook.md`
- [x] Must-have anchors have image lines inserted
- [x] Site build passes: `npm run build`

#### Manual Verification:

- [ ] `/10xdevs-3/ebook` visually renders all inserted images in correct order
- [ ] Images do not break table readability or TOC behavior
- [ ] `/10xdevs-3/ebook/markdown` download keeps valid image markdown links

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Documentation & Handoff

### Overview

Document repeatable generation workflow and explicitly record deferred export-link enhancement.

### Changes Required:

#### 1. Runbook

**File**: `docs/10xdevs3-ebook-illustrations.md`
**Changes**:
- Prerequisites (`OPENROUTER_API_KEY`)
- Illustration generation commands
- Approval flow
- Re-generation rules
- Cost-control notes (attempt cap = 2)
- How to use the manual NotebookLM infographic brief
- Deferred item: export-specific path strategy

#### 2. Scope Record

**File**: `scripts/ebook-illustrations/review.md`
**Changes**:
- Mark final accepted asset count and approved IDs
- List rejected assets and reasons

### Success Criteria:

#### Automated Verification:

- [x] Runbook exists and includes required commands/variables
- [x] Final asset count recorded and matches markdown embeddings
- [x] Final build passes: `npm run build`

#### Manual Verification:

- [ ] Team can regenerate one chosen asset from runbook instructions
- [ ] Deferred export-path task is clearly documented and non-ambiguous

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- Validate generation script argument parsing and config validation logic
- Validate manifest entry schema for each generation attempt
- Validate path normalization to `public/assets/10xdevs/ebook-evals/`

### Integration Tests:

- Dry-run -> single-asset generation -> full generation workflow
- Markdown integration check for all must-have asset references
- Ebook page render check in local dev/build

### Manual Testing Steps:

1. Run generator on one must-have asset in dry-run, then real mode.
2. Open ebook page and verify image position/style around anchor sections.
3. Download markdown version and verify links are preserved and readable.
4. Review must-have assets against source claims for factual correctness.

## Performance Considerations

- Keep assets web-optimized (`.webp`) and sized for content column width.
- Avoid image over-density around heavy table blocks.
- Keep image payload bounded to avoid degrading ebook reading flow.

## Migration Notes

- No database or API schema migration.
- Content migration is additive only (image markdown lines + static files).
- If any image path changes later, update both markdown references and review manifest.
- Export-link variant remains a separate follow-up task.

## References

- Ebook source: `src/content/resources/10xdevs3-ebook.md:1`
- Ebook render entrypoint: `src/pages/10xdevs-3/ebook/index.astro:7`
- Ebook content render location: `src/pages/10xdevs-3/ebook/index.astro:53`
- Markdown export raw content source: `src/pages/10xdevs-3/ebook/markdown.astro:11`
- Markdown export response assembly: `src/pages/10xdevs-3/ebook/markdown.astro:33`
- Key anchors:
  - `src/content/resources/10xdevs3-ebook.md:147`
  - `src/content/resources/10xdevs3-ebook.md:372`
  - `src/content/resources/10xdevs3-ebook.md:661`
  - `src/content/resources/10xdevs3-ebook.md:781`
  - `src/content/resources/10xdevs3-ebook.md:937`
  - `src/content/resources/10xdevs3-ebook.md:1026`
  - `src/content/resources/10xdevs3-ebook.md:1147`
<!-- PLAN COMPLETED: 2026-03-28 -->
