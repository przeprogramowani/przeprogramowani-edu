# M2 Snow Moon — Implementation Progress

Status: **ALL PHASES (0–9) COMPLETE** — 2026-07-20. Nothing committed; all work in the working tree (edu-platform + `~/dev/10x-explorers-hq`).

## What was built

- **Flags** (`src/explorers/config/flags.ts`): all M2 constants + `SYS_COURSE_M3_AVAILABLE`.
- **Maps**: five `src/explorers/levels/m2-*/map.level.yaml` (theme 3) + compiled JSON artifacts. No m1 touch needed — m2-planning honors the authored spawn (1,5). Props ordered row-major (mapSync round-trip requirement).
- **Level content**: manifest/dialogues/quests/exams for all five levels; registered in `levels/index.ts`; QA spawns in `config/qaMapSpawns.ts`.
- **HQ missions** (`~/dev/10x-explorers-hq/module-002-10xdevs-workflow/`): PROMPT_MILESTONES/CONTROL/REVIEW + inputs + QUEST_INDEX.csv (3 rows). Canonical answers (spoilers): L2 `M02>M05>M07`, L4 `CP4:KWARANTANNA`, L5 `R-02,R-03,R-05,R-07,R-09`. Hashes = SHA-256 of trim().toLowerCase() — verified against `api/game/submit.ts` normalization.
- **Terminal**: `/plan` (flag-gated growing sections) + `/planner` in `commandHandler.ts`/`commandRegistry.ts`; i18n pl+en; `/sensors` planning line + next-objective line now flag-branch on `M2_PLANNING_MODULE_RESTORED`.
- **Navigation**: moon-2 entry live (`m2-planning`, spawn 2,6, flags `M1_UPLINK_DONE`+`SYS_COURSE_M2_AVAILABLE`), "Sygnał niedostępny" removed.

## Verification results

- `npx vitest run`: 89 files / 882 tests green.
- `npm run levels:check`: 0 errors; only expected warning (moon-three-door → future `m3-diagnostics`).
- `npm run levels:build`: idempotent (no diff on rebuild).
- `npm run check` (astro): clean. `npm run build`: clean incl. content postcheck.
- HQ dry-run: all three answers deterministically derivable; boundary decoys (0.19/0.20 mm, R-08) resolve via explicit boundary rules in the policy docs.
- Module XP: 5×50 (exams) + 75+150+125+200+225 = 1025.

## Pre-existing branch failures fixed along the way (not part of M2 scope)

1. `src/explorers/config/npcConstants.test.ts` — stale `jungle-dark-green` color (0x88bb77 → 0x8fa383, constants changed in "chore: sprites").
2. `src/explorers/levels/mapAuthoring/mapSync.test.ts` — m0-core-ai excluded from the one-off migration-equivalence fixture test (map intentionally redesigned post-migration in eacf8230).
3. `src/explorers/i18n/strings.test.ts` — `scene.debugNpcMagentaTint` added to INTENTIONALLY_IDENTICAL (debug label, same in both locales).

## Leftover ops / manual QA (cannot be done from the repo)

- **Supabase system_flags**: decide `sys:course-m2-available` toggle timing; add the new `sys:course-m3-available` row (constant exists in code; row is an ops task).
- **Manual browser pass**: full path m1-uplink-bay → moon-two-door → five rooms → moon-three-door locked message; both directions per door; exam flow per level; `/plan` growth after each level (QA overlay can force flags); rank-up cadence at 1025 XP.
