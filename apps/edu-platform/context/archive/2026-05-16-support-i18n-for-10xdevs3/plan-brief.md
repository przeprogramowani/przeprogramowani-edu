# i18n (PL/EN) Support for 10xDevs 3.0 — Plan Brief

> Full plan: `context/changes/support-i18n-for-10xdevs3/plan.md`
> Research: `context/changes/support-i18n-for-10xdevs3/research.md`

## What & Why

Add English language support to the `10xdevs-3` main course by replicating the existing prework i18n pattern. This enables international students to access course content in English via the same external route structure already proven for prework.

## Starting Point

The `10xdevs-3-prework` course already has full PL/EN support (separate collections, `[lang]` URL segment, enrichment pipeline). The main course currently serves 5 Polish lessons (Module 1) with no language awareness. The EN Circle space (2601706) exists but has no content or platform configuration.

## Desired End State

`/external/10xdevs-3/` shows a language picker. PL and EN lessons are served from separate collections via `/external/10xdevs-3/{lang}/{lessonId}`. Internal routes (`/courses/10xdevs-3/`) redirect to external. EN content appears automatically when translated HTML files are placed in the `en/` directory. Circle push works for both languages.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
|----------|--------|-------------------|--------|
| Route strategy | External-only (redirect internal → external) | Matches prework pattern; single code path for lesson rendering | Plan |
| Scope gating | None — EN available immediately | Zero config overhead; matches prework behavior | Plan |
| Service layer | Duplicate `preworkContent.ts` as `mainCourseContent.ts` | No premature generalization; clear ownership per course | Research |
| Content pipeline | Parameterize existing scripts with `--lang` flag | Single toolchain, language is just a parameter | Plan |
| EN enrichment | PL markdown as metadata source | EN files don't carry metadata — just translated body content | Plan |
| Progress tracking | Per-language (PL/EN independent) | Accurate completion tracking; matches prework behavior | Plan |
| Internal route default | `/courses/10xdevs-3/lesson/{id}` → `/external/10xdevs-3/pl/{id}` | Backward compat for existing PL links | Plan |
| Section names | "Moduł N" (PL) / "Module N" (EN) | Direct translation of prefix; topic names stay English in both | Research |

## Scope

**In scope:**
- EN content collection + type definitions
- Main course content service module
- Language-aware external routes (`[lang]` segment)
- Internal route redirects to external
- HTML enricher target for EN
- Circle prepare/push parameterization with `--lang`
- EN Circle config + lesson map (Module 1)
- Language picker UI on external index
- Per-language progress tracking

**Out of scope:**
- Translating actual lesson content
- In-lesson language switcher
- Feature flags for EN visibility
- Module 2+ EN lesson map entries (added later per module)
- Generalizing prework + main course into one service

## Architecture / Approach

Four-layer pattern (same as prework):
1. **Collections** — `lessons10xDevs3En` collection loading from `content/lessons10xDevs3/en/*.html`
2. **Service** — `mainCourseContent.ts` providing language → collection mapping + helpers
3. **Routes** — `[lang]/[lessonId].astro` extended for `10xdevs-3`; internal routes redirect
4. **Pipeline** — enricher + prepare + push scripts accept `--lang` parameter

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Content Collection & Service Layer | EN collection, type, `mainCourseContent.ts`, localized sections | Low — follows existing pattern exactly |
| 2. Route Structure | `[lang]` routes for 10xdevs-3, internal redirects, URL validation | Medium — breaking change for `/external/10xdevs-3/{numericId}` URLs |
| 3. Content Pipeline | Enricher + prepare + push with `--lang en`, Circle config | Low — scripts isolated from platform runtime |
| 4. Language Picker & UI | Language picker on index, lesson counts, progress per-language | Low — reuses existing prework UI pattern |

**Prerequisites:** None (EN Circle space exists, prework pattern is proven)
**Estimated effort:** ~2 sessions across 4 phases

## Open Risks & Assumptions

- Existing `/external/10xdevs-3/{numericLessonId}` URLs will break (404) — acceptable since course is early-stage (Module 1 only, limited external links)
- EN content quality depends on external translation process (out of scope)
- EN lesson filenames must match PL filenames exactly for enricher pairing to work

## Success Criteria (Summary)

- Language picker visible at `/external/10xdevs-3/` with correct lesson counts per language
- PL lessons accessible at `/external/10xdevs-3/pl/{id}`, EN at `/external/10xdevs-3/en/{id}`
- Existing prework i18n continues working without regression
