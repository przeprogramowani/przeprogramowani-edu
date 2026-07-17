# 10xDevs 3 Prework Content

This directory is consumed by Astro content collections.

- `pl/*.html` is generated from Polish Markdown in `src/content-source/lessons10xDevs3Prework/pl`.
- `en/*.html` is produced by the translation pipeline, then enriched with metadata from Polish Markdown frontmatter.

Do not hand-edit generated Polish HTML. Edit the Polish Markdown source and run:

```bash
npm run generate:lesson-html
npm run enrich:lesson-html:en
```
