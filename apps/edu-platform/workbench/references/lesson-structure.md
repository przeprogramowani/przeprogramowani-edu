# Lesson Structure Reference

Canonical section order and formatting conventions for 10xDevs 3.0 main-course lesson drafts.

## Canonical Section Order

Every lesson draft follows this top-level structure:

```
# Title
[intro prose — no heading]
### subsections of main content...
## 🧑🏻‍💻 Zadania praktyczne
## Odbierz swoją odznakę
## 🔎 Deep Dive
### subsections...
## 📚 Materiały dodatkowe
```

## Heading Rules

| Level | Usage |
|-------|-------|
| H1 (`#`) | Lesson title — exactly one per file |
| H2 (`##`) | Canonical sections (see order above) and major core-content sections when warranted |
| H3 (`###`) | Subsections within core content and Deep Dive |

### Forbidden Headings

- `## Wstęp` — intro prose sits directly under the H1 title with no heading.
- `## Core` — "Core" is an internal editorial label, not a document heading. Core content lives between the title and `## 🧑🏻‍💻 Zadania praktyczne` without a wrapping heading.

### Emoji Prefixes

Three canonical sections carry emoji prefixes:

- `## 🧑🏻‍💻 Zadania praktyczne`
- `## 🔎 Deep Dive`
- `## 📚 Materiały dodatkowe`

`## Odbierz swoją odznakę` has no emoji prefix.

## Odbierz swoją odznakę — Content Convention

Every lesson includes this section between `## 🧑🏻‍💻 Zadania praktyczne` and `## 🔎 Deep Dive`.

### Standard format (content-source)

Published lessons use a one-liner linking to the Mission Log:

```markdown
## Odbierz swoją odznakę

Po ukończeniu tej lekcji odbierz odznakę w sekcji [10xDevs Mission Log](https://platforma.przeprogramowani.pl/10xdevs-3/mission-log) a następnie pochwal się swoim osiągnięciem!
```

## Deep Dive Intro Convention

Every `## 🔎 Deep Dive` section opens with a standardized intro paragraph immediately after the heading:

```markdown
## 🔎 Deep Dive

Ta sekcja zawiera dodatkowe pogłębienie wiedzy na temat wybranych zagadnień związanych z lekcją. W tym Deep Dive znajdziesz:

- **Topic name** — 1-2 sentence description
- **Topic name** — 1-2 sentence description

Ta sekcja lekcji nie jest obowiązkowa, ale warto się z nią zapoznać jeżeli chcesz zostać ekspertem.

### First subsection...
```

The topic list is derived from the H3 subsections within that lesson's Deep Dive. Topic names match the subsection titles; descriptions summarize what each subsection covers.

## Materialy dodatkowe — Link Format

### Universal format

Every entry uses a clickable markdown link:

```markdown
- [Title](URL) — description
```

The description follows the em dash and provides author, source, or relevance context.

### Prework references

Prework entries use a distinct format with the lesson tag for cross-linking:

```markdown
- Prework [x.y] *Title* — relevance to this lesson
```

### What to avoid

- Plain-text URLs not wrapped in markdown links.
- Bold-title format (`**Title** / Author / source — description`).
- Embedding source name inside the link title (`[Title — Source](URL)`).
- Capital-D `Materiały Dodatkowe` in the heading (use lowercase `dodatkowe`).
