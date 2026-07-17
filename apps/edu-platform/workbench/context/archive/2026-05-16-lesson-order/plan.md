# Standardize M1 Lesson Section Order and Formatting — Implementation Plan

## Overview

Standardize all 5 M1 lesson drafts (`m1-l1` through `m1-l5`) to follow a canonical section order with consistent headings, emoji prefixes, and a universal link format in Materiały dodatkowe. Then codify these conventions in a reference document so future lesson-draft and lesson-editor-pl runs produce structurally consistent output.

## Current State Analysis

All 5 M1 lessons have inconsistent section ordering, heading names, and link formatting:

- Every lesson has a `## Wstęp` heading to remove
- L1, L2, L4, L5 have a `## Core` heading to remove (user decision: "Core" is an internal label, not a document heading)
- L4, L5 have Deep Dive before exercises (wrong order)
- Exercise heading varies: `Ćwiczenia praktyczne` (L1, L4, L5), `Zadania praktyczne` (L2), `### Zadania praktyczne` (L3 — wrong heading level)
- No lesson has emoji prefixes on any section heading
- Three distinct link formats across lessons in Materiały dodatkowe
- L4/L5 use capital-D `Materiały Dodatkowe`

### Key Discoveries:

- L3 has no `## Core` heading — all content is nested under `## Wstęp` as H3 subsections (`lessons/m1-l3/lesson-draft.md`)
- L4 reordering scope: Deep Dive runs from line 346 to line 467 (`lessons/m1-l4/lesson-draft.md`)
- L5 reordering scope: Deep Dive runs from line 282 to line 445 (`lessons/m1-l5/lesson-draft.md`)
- L4 Materiały entries use `**Title** / Author / source — description` format with no clickable URLs for ArXiv papers
- Badge section is consistently `## Odbierz swoją odznakę` across all 5 lessons — keep as-is
- `workbench/references/lesson-structure.md` does not exist yet
- `workbench/CLAUDE.md` has no section-order convention reference

## Desired End State

Every M1 lesson draft follows this canonical structure:

```
# Title
[intro prose — no Wstęp heading, no Core heading]
### subsections of main content...
## 🧑🏻‍💻 Zadania praktyczne
## Odbierz swoją odznakę
## 🔎 Deep Dive
[Deep Dive intro paragraph + topic list]
### subsections...
## 📚 Materiały dodatkowe
```

Every `## 🔎 Deep Dive` section starts with a standardized intro paragraph:

```markdown
Ta sekcja zawiera dodatkowe pogłębienie wiedzy na temat wybranych zagadnień związanych z lekcją. W tym Deep Dive znajdziesz:

- **Topic name** — 1-2 sentence description
- **Topic name** — 1-2 sentence description

Ta sekcja lekcji nie jest obowiązkowa, ale warto się z nią zapoznać jeżeli chcesz zostać ekspertem.
```

The topic list is derived from the H3 subsections within that lesson's Deep Dive.

Every entry in `📚 Materiały dodatkowe` uses the universal format:

```markdown
- [Title](URL) — description
```

Prework references use:

```markdown
- Prework [x.y] *Title* — relevance to this lesson
```

A new `workbench/references/lesson-structure.md` codifies these conventions, and `workbench/CLAUDE.md` references it so workbench skills enforce structural consistency.

## What We're NOT Doing

- Changing lesson content, examples, or subsection prose
- Adding or removing entries from Materiały dodatkowe (only reformatting existing ones)
- Modifying `lessons-schema.json`
- Touching lessons outside M1 (m2+ are out of scope)
- Changing the badge section text or URL
- Adding `## Core` as a prescribed heading (it's an internal label only)

## Implementation Approach

Three phases isolating risk: Phase 1 handles the 3 structurally simpler lessons (L1, L2, L3 — heading renames and reformatting only). Phase 2 handles the 2 lessons that need section reordering (L4, L5 — higher risk of content loss). Phase 3 creates the forward-looking convention documents.

---

## Phase 1: L1, L2, L3 — Safe Edits

### Overview

Apply heading changes, emoji prefixes, and link reformatting to the three lessons that already have correct section order. No content reordering needed.

### Changes Required:

#### 1. M1-L1 heading cleanup and link reformat

**File**: `lessons/m1-l1/lesson-draft.md`

**Intent**: Remove `## Wstęp` (line 5) and `## Core` (line 31) headings. Rename `## Ćwiczenia praktyczne` → `## 🧑🏻‍💻 Zadania praktyczne`. Add emoji prefixes to `## Deep Dive` → `## 🔎 Deep Dive` and `## Materiały dodatkowe` → `## 📚 Materiały dodatkowe`.

**Contract**: Five heading-line edits. Content between/around headings stays untouched.

#### 2. M1-L1 Materiały dodatkowe link reformat

**File**: `lessons/m1-l1/lesson-draft.md`

**Intent**: Convert all 8 entries from the `Author, "Title" — URL` format to the universal `[Title](URL) — description` format. For entries without a meaningful description beyond the title, use the author/source as the description suffix.

**Contract**: Each `- ` bullet in the Materiały dodatkowe section transforms from plain-text URL to a clickable markdown link. No entries added or removed.

#### 3. M1-L2 heading cleanup

**File**: `lessons/m1-l2/lesson-draft.md`

**Intent**: Remove `## Wstęp` (line 3) and `## Core` (line 17) headings. Rename `## Zadania praktyczne` → `## 🧑🏻‍💻 Zadania praktyczne`. Add emoji to `## Deep Dive` → `## 🔎 Deep Dive` and `## Materiały dodatkowe` → `## 📚 Materiały dodatkowe`.

**Contract**: Five heading-line edits. Links in Materiały dodatkowe already use `[Title](URL) — description` format — no link reformatting needed. Verify and leave as-is.

#### 4. M1-L3 heading cleanup and structural promotion

**File**: `lessons/m1-l3/lesson-draft.md`

**Intent**: Remove `## Wstęp` (line 3). This lesson has no `## Core` to remove. Promote `### Zadania praktyczne` (line 400) to `## 🧑🏻‍💻 Zadania praktyczne`. Add emoji to `## Deep Dive` → `## 🔎 Deep Dive` and `## Materiały dodatkowe` → `## 📚 Materiały dodatkowe`.

**Contract**: Four heading-line edits. After removing `## Wstęp`, the H3 subsections that were nested under it become top-level H3 headings under the implicit core content area — this is the desired structure. No heading level changes for those subsections.

#### 5. Deep Dive intro paragraphs for L1, L2, L3

**Files**: `lessons/m1-l1/lesson-draft.md`, `lessons/m1-l2/lesson-draft.md`, `lessons/m1-l3/lesson-draft.md`

**Intent**: Add a standardized intro paragraph at the start of each Deep Dive section, immediately after the `## 🔎 Deep Dive` heading. The intro lists the section's H3 subsections with 1-2 sentence descriptions and frames Deep Dive as optional but recommended.

**Contract**: Insert the intro block (opening sentence, bullet list of topics, closing sentence) between the `## 🔎 Deep Dive` heading and the first `###` subsection. Derive topic names and descriptions from the existing H3 subsection titles and their content. Do not modify subsection content itself.

L1 Deep Dive topics: Dlaczego Agent ma pytać, PRD jako kontrakt dla kolejnych kroków, Jakie modele i narzędzia wybrać.
L2 Deep Dive topics: Gdy skill sam się nie aktywuje, Tworzenie własnych skilli, Co dalej z warstwami.
L3 Deep Dive topics: Narzędzia po bootstrapie, Co jeśli delegacja zawodzi, Jak bootstrapper traktuje istniejące pliki, Cztery tryby awaryjne, YOLO mode od pierwszej osoby, Twój kod w chmurze: prywatność i trening modeli.

#### 6. M1-L3 Materiały dodatkowe link normalization

**File**: `lessons/m1-l3/lesson-draft.md`

**Intent**: Normalize link entries that embed the source in the link title (e.g., `[Title — Source](URL) — description`) to the universal format `[Title](URL) — description`. Preserve prework references in their existing `Prework [x.y] *Title* — description` format.

**Contract**: Link title text changes; URLs and descriptions preserved. Prework reference entries untouched.

### Success Criteria:

#### Automated Verification:

- All 3 files have no `## Wstęp` or `## Core` headings: `grep -n "^## Wstęp\|^## Core" lessons/m1-l{1,2,3}/lesson-draft.md` returns empty
- Exercise heading is correct: `grep -n "^## 🧑🏻‍💻 Zadania praktyczne" lessons/m1-l{1,2,3}/lesson-draft.md` returns 3 matches
- Emoji prefixes present: `grep -n "^## 🔎 Deep Dive" lessons/m1-l{1,2,3}/lesson-draft.md` returns 3 matches
- Materiały heading correct: `grep -n "^## 📚 Materiały dodatkowe" lessons/m1-l{1,2,3}/lesson-draft.md` returns 3 matches
- No plain-text URLs in L1 Materiały: `sed -n '/^## 📚/,/^## /p' lessons/m1-l1/lesson-draft.md | grep -c 'https://' ` matches count of `](https://` occurrences (all URLs are inside markdown links)
- Deep Dive intro present in all 3 files: `grep -c "Ta sekcja zawiera dodatkowe pogłębienie" lessons/m1-l{1,2,3}/lesson-draft.md` returns 1 per file

#### Manual Verification:

- Skim each file to confirm no content was accidentally deleted or reordered
- Verify L3 H3 subsections still flow naturally after Wstęp removal
- Verify Deep Dive intro topic lists match the actual subsections in each lesson

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: L4, L5 — Reorder and Reformat

### Overview

Apply the same heading and link changes as Phase 1, plus reorder sections in L4 and L5 where Deep Dive currently appears before exercises. This requires moving entire section blocks (Deep Dive + all its subsections) to their correct position after Odbierz swoją odznakę.

### Changes Required:

#### 1. M1-L4 section reorder and heading cleanup

**File**: `lessons/m1-l4/lesson-draft.md`

**Intent**: Remove `## Wstęp` (line 3) and `## Core` (line 25). The current order is: Core → Deep Dive (line 346) → Ćwiczenia (line 469) → Odbierz (line 474) → Materiały (line 478). Reorder to: [core content] → Zadania praktyczne → Odbierz → Deep Dive → Materiały. Rename headings and add emoji prefixes per the canonical structure.

**Contract**: The Deep Dive section (from `## Deep Dive` through the last subsection before `## Ćwiczenia praktyczne`) moves to sit between `## Odbierz swoją odznakę` and `## Materiały Dodatkowe`. All content within each section block stays intact. Heading renames: `## Ćwiczenia praktyczne` → `## 🧑🏻‍💻 Zadania praktyczne`, `## Deep Dive` → `## 🔎 Deep Dive`, `## Materiały Dodatkowe` → `## 📚 Materiały dodatkowe`.

#### 2. M1-L4 Materiały dodatkowe link reformat

**File**: `lessons/m1-l4/lesson-draft.md`

**Intent**: Convert all 6 entries from the `**Title** / Author / source — description` format to `[Title](URL) — description`. For ArXiv papers, construct clickable URLs from the paper IDs (e.g., `2601.20404` → `https://arxiv.org/abs/2601.20404`). For entries that reference a product/docs URL, extract and use that URL.

**Contract**: Each bullet becomes a clickable markdown link. Author/source info moves to the description suffix where informative. No entries added or removed.

#### 3. M1-L5 section reorder and heading cleanup

**File**: `lessons/m1-l5/lesson-draft.md`

**Intent**: Remove `## Wstęp` (line 3) and `## Core` (line 31). The current order is: Core → Deep Dive (line 282) → Ćwiczenia (line 447) → Odbierz (line 453) → Materiały (line 457). Reorder to: [core content] → Zadania praktyczne → Odbierz → Deep Dive → Materiały. Rename headings and add emoji prefixes.

**Contract**: Same reordering logic as L4 — Deep Dive block moves after Odbierz. Heading renames: `## Ćwiczenia praktyczne` → `## 🧑🏻‍💻 Zadania praktyczne`, `## Deep Dive` → `## 🔎 Deep Dive`, `## Materiały Dodatkowe` → `## 📚 Materiały dodatkowe`.

#### 4. Deep Dive intro paragraphs for L4, L5

**Files**: `lessons/m1-l4/lesson-draft.md`, `lessons/m1-l5/lesson-draft.md`

**Intent**: Add a standardized intro paragraph at the start of each Deep Dive section, same format as Phase 1.

**Contract**: Insert the intro block between the `## 🔎 Deep Dive` heading and the first `###` subsection in each file.

L4 Deep Dive topics: Systemowe prompty popularnych narzędzi, Ślady po sesjach.
L5 Deep Dive topics: CLI vs MCP — jak agent korzysta z żywej aplikacji, Demo: gotowy serwer MCP w sesji agenta, Wrangler i gh — kilka komend które warto znać, Granica dostępu agenta do produkcji.

#### 5. M1-L5 Materiały dodatkowe link reformat

**File**: `lessons/m1-l5/lesson-draft.md`

**Intent**: Convert all 5 entries from the `**Title** / Source / URL — description` format to `[Title](URL) — description`.

**Contract**: Same transformation as L4. Each bullet becomes a clickable markdown link.

### Success Criteria:

#### Automated Verification:

- No `## Wstęp`, `## Core`, `## Ćwiczenia`, or capital-D `Materiały Dodatkowe` headings remain: `grep -n "^## Wstęp\|^## Core\|^## Ćwiczenia\|Materiały Dodatkowe" lessons/m1-l{4,5}/lesson-draft.md` returns empty
- Section order is correct in both files: `grep -n "^## " lessons/m1-l4/lesson-draft.md` and `grep -n "^## " lessons/m1-l5/lesson-draft.md` show Zadania → Odbierz → Deep Dive → Materiały (in that order)
- Emoji prefixes present: `grep -c "^## 🧑🏻‍💻\|^## 🔎\|^## 📚" lessons/m1-l{4,5}/lesson-draft.md` returns 3 per file
- All Materiały entries are markdown links: no `**Title**` bold format remains in Materiały sections
- Deep Dive intro present in both files: `grep -c "Ta sekcja zawiera dodatkowe pogłębienie" lessons/m1-l{4,5}/lesson-draft.md` returns 1 per file

#### Manual Verification:

- Verify L4 Deep Dive content is intact after reordering — subsections (Systemowe prompty, Ślady po sesjach) preserved
- Verify L5 Deep Dive content is intact after reordering — subsections (CLI vs MCP, Demo: gotowy serwer MCP, Wrangler i gh, Granica dostępu) preserved
- Verify no content was lost between section boundaries during the move
- Verify ArXiv URLs in L4 resolve correctly
- Verify Deep Dive intro topic lists match the actual subsections in each lesson

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Convention Documents

### Overview

Create `lesson-structure.md` reference document codifying the canonical section structure, and update `workbench/CLAUDE.md` to reference it so all workbench skills enforce these conventions going forward.

### Changes Required:

#### 1. Create lesson-structure.md

**File**: `references/lesson-structure.md` (new file)

**Intent**: Codify the canonical lesson section order, emoji prefixes, link format rules, prework reference convention, and the decision that "Core" is a conceptual label (not a heading). This becomes the structural reference for `lesson-draft`, `lesson-editor-pl`, and `lesson-rc-review` skills.

**Contract**: The document must define:
- Canonical section order: title → intro prose → core subsections → `## 🧑🏻‍💻 Zadania praktyczne` → `## Odbierz swoją odznakę` → `## 🔎 Deep Dive` → `## 📚 Materiały dodatkowe`
- Rule: no `## Wstęp` or `## Core` headings
- Deep Dive intro convention: standardized paragraph template with topic list derived from H3 subsections
- Universal link format: `[Title](URL) — description`
- Prework reference format: `Prework [x.y] *Title* — relevance`
- Heading-level rules: H2 for canonical sections, H3 for subsections within core and Deep Dive

#### 2. Update workbench CLAUDE.md

**File**: `CLAUDE.md` (workbench root)

**Intent**: Add a reference to `lesson-structure.md` in the Lesson Workflow or Editing Discipline section so all workbench skills read and enforce these structural conventions when drafting, editing, or reviewing lessons.

**Contract**: Add a brief paragraph in the Editing Discipline section pointing to `workbench/references/lesson-structure.md` as the canonical section-order reference. Do not restructure existing CLAUDE.md content.

### Success Criteria:

#### Automated Verification:

- File exists: `test -f references/lesson-structure.md`
- CLAUDE.md references it: `grep -c "lesson-structure.md" CLAUDE.md` returns ≥ 1
- All key conventions documented: `grep -c "Zadania praktyczne\|Odbierz\|Deep Dive\|Materiały dodatkowe" references/lesson-structure.md` returns ≥ 4

#### Manual Verification:

- Review lesson-structure.md for completeness — all conventions from this plan are captured
- Verify CLAUDE.md integration is clean and doesn't break existing structure

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Automated Checks:

- Heading consistency: grep across all 5 lessons for forbidden headings (Wstęp, Core, Ćwiczenia, capital-D Dodatkowe)
- Section order: extract H2 headings per file and verify canonical sequence
- Link format: verify no plain-text URLs in Materiały sections
- Convention doc: verify file existence and key content

### Manual Review:

- Read through each reformatted lesson to confirm no content loss
- Verify Deep Dive subsections in L4/L5 survived reordering intact
- Spot-check ArXiv URLs resolve correctly
- Review lesson-structure.md for completeness

## References

- Research: `context/changes/lesson-order/research.md`
- Change spec: `context/changes/lesson-order/change.md`
- Style guide: `src/content/lessons10xDevs3Prework/style.md`
- Prework summary: `workbench/references/prework.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: L1, L2, L3 — Safe Edits

#### Automated

- [x] 1.1 No Wstęp or Core headings in L1/L2/L3 — f43e74f8
- [x] 1.2 Correct exercise heading with emoji in all 3 files — f43e74f8
- [x] 1.3 Deep Dive and Materiały emoji prefixes in all 3 files — f43e74f8
- [x] 1.4 All Materiały links use universal markdown format — f43e74f8
- [x] 1.5 Deep Dive intro present in all 3 files — f43e74f8

#### Manual

- [x] 1.6 No content accidentally deleted or reordered in L1/L2/L3 — f43e74f8
- [x] 1.7 L3 H3 subsections flow naturally after Wstęp removal — f43e74f8
- [x] 1.8 Deep Dive intro topic lists match actual subsections in L1/L2/L3 — f43e74f8

### Phase 2: L4, L5 — Reorder and Reformat

#### Automated

- [x] 2.1 No forbidden headings remain in L4/L5 — 19892193
- [x] 2.2 Section order is canonical in both files — 19892193
- [x] 2.3 Emoji prefixes present on all 3 target headings per file — 19892193
- [x] 2.4 All Materiały entries are clickable markdown links — 19892193
- [x] 2.5 Deep Dive intro present in both files — 19892193

#### Manual

- [x] 2.6 L4 Deep Dive content intact after reordering — 19892193
- [x] 2.7 L5 Deep Dive content intact after reordering — 19892193
- [x] 2.8 ArXiv URLs in L4 resolve correctly — 19892193
- [x] 2.9 Deep Dive intro topic lists match actual subsections in L4/L5 — 19892193

### Phase 3: Convention Documents

#### Automated

- [x] 3.1 lesson-structure.md exists with all key conventions — 59f9852c
- [x] 3.2 CLAUDE.md references lesson-structure.md — 59f9852c

#### Manual

- [x] 3.3 lesson-structure.md is complete and accurate — 59f9852c
- [x] 3.4 CLAUDE.md integration is clean — 59f9852c
