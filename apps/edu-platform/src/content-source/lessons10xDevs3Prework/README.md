# 10xDevs 3 Prework Authoring

This directory contains editable Markdown source for Polish 10xDevs 3 prework lessons.

Generated HTML lives in `src/content/lessons10xDevs3Prework/` and is consumed by Astro collections. Do not edit generated HTML by hand.

English lesson HTML is produced by the translation pipeline and committed directly to `src/content/lessons10xDevs3Prework/en/`. There are no English Markdown source files in this repo.

English display titles live in the `titleEn` field of Polish lesson frontmatter. The enrichment script combines `titleEn`, canonical `lessonId`, and `order` from Polish Markdown frontmatter, then writes metadata into translated English HTML.

## Workflow

```bash
npm run generate:lesson-html
npm run enrich:lesson-html:en
npm run check:lesson-html
npm run build
```

After pulling translated English HTML from the translation pipeline, run:

```bash
npm run report:prework-code-blocks
```

If the report shows truncated code blocks, run the explicit repair workflow for the affected lesson prefix:

```bash
tsx scripts/repair-prework-code-blocks.ts --write --lesson <prefix>
```

Repair mode can call OpenRouter for uncached code-block translations. Use `--force` with `--lesson <prefix>` to regenerate cached code translations after prompt or model changes. Code translation is Polish-to-English only: already-English comments, strings, and visible HTML text should stay English. Mermaid blocks are restored from Polish source for completeness and reported for manual English translation by default. To try model-backed Mermaid label translation, opt in with `--translate-mermaid` and inspect the resulting diagram diff carefully.

## Lesson Frontmatter

Every learner-facing Polish lesson needs `lessonId`, `language`, and `order`.

```yaml
---
title: "[1.1] Example title"
titleEn: "[1.1] Example title in English"
lessonId: "01"
language: "pl"
order: 1
---
```

When adding a Polish lesson:

1. Add the Polish Markdown file in `pl/`.
2. Run `npm run generate:lesson-html`.
3. Inspect the generated HTML diff in `src/content/lessons10xDevs3Prework/pl/`.
4. Add the matching English `lessonId` title to the lesson's `titleEn` frontmatter field.
5. Ensure the translation pipeline produces the matching English HTML in `src/content/lessons10xDevs3Prework/en/`.
6. Run `npm run enrich:lesson-html:en`.
