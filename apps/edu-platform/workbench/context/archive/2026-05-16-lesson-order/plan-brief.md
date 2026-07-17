# Standardize M1 Lesson Section Order — Plan Brief

> Full plan: `context/changes/lesson-order/plan.md`
> Research: `context/changes/lesson-order/research.md`

## What & Why

All 5 M1 lesson drafts have inconsistent section ordering, heading names, emoji usage, and link formatting in Materiały dodatkowe. This change standardizes them to a canonical structure and codifies the conventions so future lessons are structurally consistent from first draft.

## Starting Point

Each lesson uses a different combination of heading names (`Ćwiczenia` vs `Zadania`), has a `## Wstęp` heading to remove, lacks emoji prefixes, and formats reference links differently. L4 and L5 have Deep Dive before exercises (wrong order). No structural convention document exists.

## Desired End State

Every M1 lesson follows: title → intro prose → core subsections → `## 🧑🏻‍💻 Zadania praktyczne` → `## Odbierz swoją odznakę` → `## 🔎 Deep Dive` → `## 📚 Materiały dodatkowe`. Each Deep Dive opens with a standardized intro paragraph listing topics with short descriptions. All reference links use `[Title](URL) — description`. A `lesson-structure.md` reference codifies these rules for future workbench skills.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|----------|--------|-------------------|--------|
| `## Core` heading | Remove from all lessons | "Core" is an internal conceptual label, not a document heading — per user clarification. | Plan |
| `## Wstęp` heading | Remove from all lessons | Lessons should flow from title directly into content. | Research |
| Exercise heading name | `Zadania praktyczne` (not `Ćwiczenia`) | Consistent naming; L2 already uses this form. | Research |
| Badge heading | Keep `Odbierz swoją odznakę` (with "swoją") | All 5 lessons already use this; no reason to shorten. | Research |
| Link format | `[Title](URL) — description` | Most markdown-native, already used in L2/L3, clickable. | Research |
| Prework reference format | `Prework [x.y] *Title* — relevance` | Tags enable future linking; matches L2/L3 pattern. | Research |
| ArXiv entries | Construct full `arxiv.org/abs/` URLs | Every Materiały entry must be a clickable markdown link. | Research |
| Deep Dive intro | Standardized opening paragraph + topic list | Frames Deep Dive as optional but recommended; gives reader a TOC before diving in. | Plan |

## Scope

**In scope:** All 5 M1 lesson drafts, `lesson-structure.md` creation, `CLAUDE.md` update

**Out of scope:** Lesson content/prose changes, Materiały entry additions/removals, `lessons-schema.json` changes, M2+ lessons

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. L1, L2, L3 — Safe Edits | 3 lessons with correct headings, emoji prefixes, Deep Dive intros, reformatted links | Low — no reordering, heading edits only |
| 2. L4, L5 — Reorder + Reformat | 2 lessons with sections moved to canonical order + Deep Dive intros + formatting | Medium — section block moves risk content loss |
| 3. Convention Documents | `lesson-structure.md` + `CLAUDE.md` reference | Low — new file + small edit |

**Prerequisites:** None — all files are local workbench drafts
**Estimated effort:** ~1 session across 3 phases

## Open Risks & Assumptions

- L4/L5 reordering assumes section boundaries are cleanly delimited by H2 headings (verified in research)
- ArXiv paper IDs in L4 assumed to be correct as written (URLs constructed from them)

## Success Criteria (Summary)

- All 5 M1 lessons follow the canonical section order with correct headings and emoji prefixes
- Every Deep Dive section opens with a standardized intro paragraph listing its topics
- All Materiały dodatkowe entries are clickable markdown links in the universal format
- `lesson-structure.md` codifies the conventions for future lesson production
