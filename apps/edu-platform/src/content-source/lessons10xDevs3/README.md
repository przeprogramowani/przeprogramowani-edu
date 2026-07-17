---
hidden: true
---

# 10xDevs 3 Authoring

## Do not edit files in this directory directly

Markdown files in `pl/` are **mapped reflections** of the editorial source of truth:

```
workbench/lessons/<lessonId>/lesson-draft.md
```

To update a lesson:

1. Edit the draft in `workbench/lessons/<lessonId>/lesson-draft.md`.
2. Run the transport script from `workbench/`:

```bash
npm run transport              # all available drafts
npm run transport -- m1        # all lessons in module 1
npm run transport -- m1-l3     # single lesson
```

The script reads `workbench/lessons-schema.json` for ordering and titles, prepends YAML frontmatter, and writes the result here.

## Generated HTML

Generated HTML lives in `src/content/lessons10xDevs3/` and is consumed by Astro collections. Do not edit generated HTML by hand.

Run the generator after transporting lessons:

```bash
npm run generate:lesson-html
npm run check:lesson-html
```
