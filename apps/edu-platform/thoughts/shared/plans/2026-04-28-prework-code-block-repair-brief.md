# 10xDevs 3 Prework Code Block Repair - Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-28-prework-code-block-repair.md`

## What & Why

We are adding a repair workflow for English 10xDevs 3 prework HTML where translated `<pre>` blocks were cut to their first line. The script will recover full blocks from Polish HTML, translate code/prompt examples through OpenRouter when needed, restore Mermaid diagrams from Polish source, and cache all work so it can be rerun safely.

## Starting Point

Polish authoring Markdown already generates committed PL HTML, and EN HTML is translation-pipeline-owned plus metadata-enriched. The broken content lives in EN HTML body `<pre>` blocks, while the surrounding metadata and route pipeline are already working.

## Desired End State

Authors can run a report to see all truncated or missing EN `<pre>` blocks, then opt into an API-backed repair command. Code examples become full English blocks, Mermaid diagrams become complete again but are clearly flagged for manual English translation, and `check:lesson-html` reports remaining issues without failing.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Block scope | Handle all `<pre>` blocks | The real damage includes both `pre>code` examples and Mermaid diagrams. |
| Missing blocks | Report only | Avoids inserting content into uncertain EN structure automatically. |
| Rewrite policy | Repair suspicious/missing by default | Preserves existing good human/machine translations. |
| API granularity | One OpenRouter call per block | Makes retries and cache keys precise. |
| Cache location | `scripts/prework-code-translations/cache/<lesson-prefix>.cache.json` | Keeps cache reviewable and scoped per lesson. |
| Mermaid policy | Restore Polish source and report manual translation | Completes diagrams safely without risking broken Mermaid syntax. |
| Validation | Structural validation before write | Prevents first-line-only or malformed model output from replacing content. |
| Build integration | Non-failing `check:lesson-html` report | Keeps visibility high without blocking builds on known content repair work. |

## Scope

**In scope:**

- Detect suspicious and missing EN `<pre>` blocks by comparing PL/EN HTML.
- Translate suspicious matched `pre>code` blocks through OpenRouter.
- Restore suspicious matched Mermaid blocks from Polish.
- Cache translations and Mermaid review entries per lesson prefix.
- Add report/dry-run/write CLI modes.
- Add tests and npm scripts.
- Document the repair workflow.

**Out of scope:**

- Route or auth changes.
- Generator/enricher redesign.
- Automatic insertion of missing EN blocks.
- Automatic Mermaid label translation.
- Failing builds when report mode finds code-block issues.
- Calling OpenRouter during build/check.

## Architecture / Approach

The repair uses the existing lesson-prefix pairing model from the enrichment pipeline. A pure helper module parses PL/EN HTML with Cheerio, extracts `<pre>` blocks, classifies issues, validates candidate translations, and patches only target text nodes. A thin CLI handles env loading, OpenRouter calls, cache IO, reporting, and file writes.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|------------------|----------|
| 1. Detection and Pairing Core | Local report of suspicious/missing blocks | Detection count may not match known real-content audit. |
| 2. OpenRouter Translation and Cache | Per-block API translation plus per-lesson cache | Bad model output must be rejected before writes. |
| 3. Repair Writer CLI | Report/dry-run/write command that patches EN HTML | Cheerio serialization could create noisy diffs. |
| 4. Checks and NPM Integration | Standalone repair scripts plus non-failing check report | Check output must not look like a failed build. |
| 5. Docs and Manual Review Workflow | Maintainer instructions and Mermaid review process | Manual Mermaid translation could be forgotten without clear report. |

**Prerequisites:** Local `OPENROUTER_API_KEY` for write mode on cache misses; current PL generated HTML and EN enriched HTML present.

**Estimated effort:** Around 2 focused sessions across 5 phases, plus manual review of repaired lesson diffs.

## Open Risks & Assumptions

- OpenRouter output may occasionally preserve syntax poorly, so validation and cache review matter.
- Mermaid diagrams restored from Polish will be complete but may still have Polish labels.
- Missing block insertion is deferred because automatic placement could damage translated lesson flow.
- Cache files may contain source and translated course content, so they should be reviewed as content artifacts.

## Success Criteria (Summary)

- `npm run report:prework-code-blocks` identifies the known affected lessons and exits 0.
- `repair:prework-code-blocks` repairs suspicious code blocks through cache/OpenRouter and restores Mermaid blocks from Polish.
- `npm run check:lesson-html` reports remaining issues without failing, and affected EN lessons render complete code blocks after repair.

