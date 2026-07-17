---
date: 2026-05-16T12:00:00+02:00
researcher: mkczarkowski
git_commit: 21939221
branch: master
repository: przeprogramowani-sites
topic: "M1 lesson section order, emoji formatting, and Materiały dodatkowe link conventions"
tags: [research, codebase, workbench, lessons, formatting]
status: complete
last_updated: 2026-05-16
last_updated_by: mkczarkowski
---

# Research: M1 Lesson Section Order and Formatting

**Date**: 2026-05-16T12:00:00+02:00
**Researcher**: mkczarkowski
**Git Commit**: 21939221
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

What is the current section structure, ordering, emoji usage, and link format across all M1 lesson drafts (`workbench/lessons/m1-l{1..5}/lesson-draft.md`)? What changes are needed to standardize them per the `lesson-order` change spec?

## Summary

All 5 M1 lessons have inconsistent section ordering, naming, and formatting. The target structure is achievable with targeted edits. Main issues: presence of `## Wstęp` headings to remove, inconsistent section names ("Ćwiczenia" vs "Zadania"), wrong ordering in L4/L5, missing emoji prefixes everywhere, and three distinct link formats in "Materiały dodatkowe" that need unification.

## Detailed Findings

### Current Section Order Per Lesson

| Lesson | Order |
|--------|-------|
| **M1-L1** | `## Wstęp` → `## Core` → `## Ćwiczenia praktyczne` → `## Odbierz swoją odznakę` → `## Deep Dive` → `## Materiały dodatkowe` |
| **M1-L2** | `## Wstęp` → `## Core` → `## Zadania praktyczne` → `## Odbierz swoją odznakę` → `## Deep Dive` → `## Materiały dodatkowe` |
| **M1-L3** | `## Wstęp` (all content nested as ### inside Wstęp, no `## Core`) → `### Zadania praktyczne` → `## Odbierz swoją odznakę` → `## Deep Dive` → `## Materiały dodatkowe` |
| **M1-L4** | `## Wstęp` → `## Core` → `## Deep Dive` → `## Ćwiczenia praktyczne` → `## Odbierz swoją odznakę` → `## Materiały Dodatkowe` |
| **M1-L5** | `## Wstęp` → `## Core` → `## Deep Dive` → `## Ćwiczenia praktyczne` → `## Odbierz swoją odznakę` → `## Materiały Dodatkowe` |

### Target Order (from change spec)

```
# Title
[content - no "Wstęp" heading]
## 🧑🏻‍💻 Zadania praktyczne
## Odbierz odznakę
## 🔎 Deep Dive
## 📚 Materiały dodatkowe
```

### Issues Per Lesson

**M1-L1** (`lessons/m1-l1/lesson-draft.md`):
- Has `## Wstęp` at line 5 → REMOVE heading, keep content (integrate with following Core)
- Section named `## Ćwiczenia praktyczne` → RENAME to `## 🧑🏻‍💻 Zadania praktyczne`
- Order is already correct (exercises → badge → DD → materials)
- `## Deep Dive` → ADD emoji prefix `## 🔎 Deep Dive`
- `## Materiały dodatkowe` → ADD emoji prefix `## 📚 Materiały dodatkowe`
- Link format: plain text `Author, "Title" — URL` → needs conversion

**M1-L2** (`lessons/m1-l2/lesson-draft.md`):
- Has `## Wstęp` at line 3 → REMOVE heading, keep content
- Already uses `## Zadania praktyczne` → ADD emoji `## 🧑🏻‍💻 Zadania praktyczne`
- Order is already correct
- `## Deep Dive` → `## 🔎 Deep Dive`
- `## Materiały dodatkowe` → `## 📚 Materiały dodatkowe`
- Link format: `[Title](URL) — description` ✓ (closest to target)
- Prework refs already use `[x.y]` inline tags

**M1-L3** (`lessons/m1-l3/lesson-draft.md`):
- Has `## Wstęp` at line 3 as umbrella for ALL content (no separate `## Core`) → REMOVE `## Wstęp`, promote content as top-level Core
- `### Zadania praktyczne` at wrong heading level → PROMOTE to `## 🧑🏻‍💻 Zadania praktyczne`
- Order is already correct after restructure
- `## Deep Dive` → `## 🔎 Deep Dive`
- `## Materiały dodatkowe` → `## 📚 Materiały dodatkowe`
- Link format: `[Title — Source](URL) — description` → normalize to universal format
- Prework refs in materials: `Prework [x.y] *Title* — description` (good pattern)

**M1-L4** (`lessons/m1-l4/lesson-draft.md`):
- Has `## Wstęp` at line 3 → REMOVE heading
- **WRONG ORDER**: Deep Dive comes before exercises → REORDER to: Core → Exercises → Badge → DD → Materials
- `## Ćwiczenia praktyczne` → RENAME to `## ���🏻‍💻 Zadania praktyczne`
- `## Deep Dive` → `## 🔎 Deep Dive`
- `## Materiały Dodatkowe` (capital D) → `## 📚 Materiały dodatkowe` (lowercase d)
- Link format: `**Title** / Author / source — description` → needs conversion
- No prework references in Materiały (only inline in body)

**M1-L5** (`lessons/m1-l5/lesson-draft.md`):
- Has `## Wstęp` at line 3 → REMOVE heading
- **WRONG ORDER**: Deep Dive comes before exercises → REORDER to: Core → Exercises → Badge → DD → Materials
- `## Ćwiczenia praktyczne` → RENAME to `## 🧑🏻‍💻 Zadania praktyczne`
- `## Deep Dive` → `## 🔎 Deep Dive`
- `## Materiały Dodatkowe` (capital D) → `## 📚 Materiały dodatkowe` (lowercase d)
- Link format: `**Title** / Source / URL — description` → needs conversion
- Inline prework ref `[4.1]` in body text (no prework in materials section)

### Materiały dodatkowe — Link Format Analysis

Three distinct formats currently in use:

| Lesson | Format | Example |
|--------|--------|---------|
| M1-L1 | `Author, "Title" — URL` | `Atlassian, "What is a Product Requirements Document?" — https://www.atlassian.com/...` |
| M1-L2, L3 | `[Title](URL) — description` | `[Agent Skills — overview](https://platform.claude.com/...) — oficjalna dokumentacja...` |
| M1-L4, L5 | `**Title** / Author / source — description` | `**On the Impact of AGENTS.md...** / Lulla et al. / arXiv 2601.20404 - badanie na...` |

**Proposed universal format:**

```markdown
- [Title](URL) — description
```

For prework references (no external URL):

```markdown
- Prework [x.y] *Title* — relevance to this lesson
```

This matches the format already used in M1-L2 and M1-L3, which is the most markdown-native and linkable.

### Prework Reference Convention

Prework tags follow the pattern `[module.lesson]`:
- `[1.1]` through `[1.3]` — Module 1
- `[2.1]` through `[2.4]` — Module 2
- `[3.1]` through `[3.5]` — Module 3
- `[4.1]` through `[4.3]` — Module 4

Current inline usage in lesson bodies: `prework [3.2]` or `preworku [4.1]` — these remain as-is (body text, not the materials section).

In "📚 Materiały dodatkowe" section, prework references should appear as:
```markdown
- Prework [3.2] *Wzorce i antywzorce promptowania* — hierarchia instrukcji jako kontekst dla tej lekcji.
```

### "Odbierz odznakę" Section

All lessons have identical badge text pointing to the same URL. Current text is consistent:

```markdown
## Odbierz swoją odznakę

Po ukończeniu tej lekcji odbierz odznakę w sekcji [10xDevs Mission Log](https://platforma.przeprogramowani.pl/10xdevs-3/mission-log) a następnie pochwal się swoim osiągnięciem!
```

The change spec says "Odbierz odznakę" (without "swoją"). Decision needed: keep "swoją" or drop it.

## Architecture Insights

The lessons are independent markdown files with no shared template or frontmatter enforcing structure. Any enforcement must be manual or via the `lesson-rc-review` / `lesson-editor-pl` skills that validate against spec.

The `lessons-schema.json` does not currently define section order as a schema constraint — it defines content boundaries (`owns`, `mustNotCover`) but not structural formatting.

## Decisions (resolved)

1. **"Odbierz swoją odznakę"** — keep the full heading with "swoją".
2. **M1-L3 structural issue** — after removing `## Wstęp`, leave core content implicit (no explicit `## Core` heading). Content flows from title directly into the lesson body.
3. **ArXiv and citation-style references** — convert all entries to clickable URLs (e.g., `https://arxiv.org/abs/2601.20404`). Every item in "📚 Materiały dodatkowe" must be a proper markdown link.
4. **Scope** — same as above; all references get full URLs in the universal `[Title](URL) — description` format.
5. **Forward-looking convention** — the plan must include a phase that:
   - Creates `workbench/references/lesson-structure.md` with the canonical section order, emoji prefixes, link format rules, and prework reference convention.
   - Updates `workbench/CLAUDE.md` to reference that file in the "Lesson Workflow" or "Editing Discipline" section, so all workbench skills (`lesson-draft`, `lesson-editor-pl`, `lesson-rc-review`) pick up these structural rules when creating or reviewing future lessons.
