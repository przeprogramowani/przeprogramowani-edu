# Circle Lesson Backup & Push

## Overview

Pull lessons from Circle as Markdown files, edit locally, push back as HTML.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Pull lessons from Circle -> save as `.md` with frontmatter |
| `npm run push` | Push changed lessons to Circle (per-lesson y/n/a/q confirmation) |
| `npm run push:pick` | Push with interactive picker (select by number: `1,3` / `all` / `none`) |
| `npm run push:dry` | Preview push mapping without calling API |

## Circle API

- **Base URL**: `https://app.circle.so`
- **Auth**: `Authorization: Token {token}` header
- **Read**: `GET /api/admin/v2/course_lessons?space_id=X&section_id=Y&status=Z`
- **Write**: `PATCH /api/admin/v2/course_lessons/{id}` with `{ "body_html": "..." }` at top level
  - PUT silently no-ops (returns 200 but writes nothing)
  - Wrapping in `{ "course_lesson": { ... } }` is silently ignored
  - Circle wraps submitted HTML in a `<div>` automatically
- **Swagger UI**: `https://api-headless.circle.so/?urls.primaryName=Admin%20API%20V2`

## Markdown file format

```markdown
---
lessonId: 3662385
sectionId: 966234
name: "Lesson title"
---

## Wprowadzenie

Content here...
```

Frontmatter is the source of truth for lesson/section IDs during push. No separate mapping file needed.

## Conversion pipeline

- **Pull**: `body_html` -> turndown (HTML to Markdown) -> `.md` file with YAML frontmatter
- **Push**: parse frontmatter -> marked (Markdown to HTML) -> `PATCH` to Circle API
- iframes are kept as raw HTML in markdown (turndown `keep` rule)

## Tag placeholders (push-only)

Circle's API strips certain HTML tags (iframe, img, video, etc.) from pushed content. To preserve intent, the push pipeline converts these tags into human-readable **blockquote placeholders** before sending to Circle.

- **Config**: `utils/tag-placeholders.ts` — `TAG_RULES` array defines which tags to replace
- **Currently handled**: `iframe`, `img`
- **Placeholder format**: `<blockquote><p><strong>TAG</strong> — metadata — <a href="url">url</a></p></blockquote>`
- **Flow**: markdown → `markdownToHtml()` → `tagsToPlaceholders()` → push to Circle
- **Purpose**: placeholders survive Circle's sanitizer and show up as quoted blocks in the editor, telling the author what to embed manually
- **One-way**: this is not reversible — pulled lessons contain actual embeds added via Circle's editor, not placeholders

### Circle HTML tag allowlist (tested)

Tags Circle **preserves**: `strong`, `em`, `u`, `s`, `h2`, `h3`, `a`, `ul`, `ol`, `li`, `pre > code`, `blockquote`, `hr`, `p`, `br`, `table`, `tr`, `th`, `td`

Tags Circle **modifies**: `h1` → `h2`, `h4` → `h3`, `del` → `s`, all links get `target="_blank" rel="noopener noreferrer"`, `li` content wrapped in `p`, `code` language class stripped, `thead`/`tbody` wrappers stripped

Tags Circle **strips**: `iframe`, `img`, `video`, `audio`, `figure`, `figcaption`, `details`, `summary`, `mark`, `sup`, `sub`, `code` (inline), `kbd`, `abbr`, `span`, `div` (converted to `p`), `button`, `form`, `input`, `script`, `style`, `object`, `embed`, all `style` attributes, all `data-*` attributes, all event handlers, HTML comments

## Course config

Courses are defined in `projects/common/src/circle/course-config.ts`. Default: `TEN_X_DEVS_THIRD_ED` (space 2552674, 5 sections). Change `SELECTED_COURSE` in `index.ts` / `push.ts` to target a different course.
