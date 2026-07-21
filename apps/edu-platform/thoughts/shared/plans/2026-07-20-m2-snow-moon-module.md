# Implementation Plan — Module 2: Moon 2 (Snow World), "Węzeł Planistyczny PN-0"

**Date:** 2026-07-20
**Design source of truth:** `.ai/10x-devs/game/m2-narrative-bible.md` (approved narrative bible — canon bridge, spine, threads, cast, per-level beats, contract tables). This plan covers *how to build it*; the bible covers *what to write*.
**Reference conventions:** `narrative-snapshot.md`, `m1-narrative-bible.md`, `cookbook.md`, and the five implemented `src/explorers/levels/m1-*` levels.

## Overview

Build the five snow-moon levels end to end: map sources, manifests, dialogues, quests, exams, flags, terminal commands, registration, and the Earth HQ mission files in `~/dev/10x-explorers-hq/module-002-10xdevs-workflow/`. Course topic: 10xDevs Workflow (plan-first, MVP milestones, architecture with agents, implementation control, solo code review). Quest mix mirrors m1 exactly: 2 event quests + 3 api-answer HQ missions; one "Przechwycony test VOID" exam per level; total module XP 1025.

**Do not commit anything** — all work stays in the working tree.

## Module contract (from the bible, §8 — repeated here for execution)

| # | Map key | Display (pl / en) | Quest (type, XP) | Exam id | New cmd |
|---|---------|-------------------|------------------|---------|---------|
| 1 | `m2-planning` | Zamarznięte Atrium / The Frozen Atrium | `q-m2-plan-contract` (event, 75) | `m2-exam-plan-first` | `/plan` |
| 2 | `m2-staging-yard` | Zajezdnia Etapowa / The Staging Yard | `q-m2-mvp-milestones` (api, 150) | `m2-exam-mvp-milestones` | — |
| 3 | `m2-drafting-hall` | Kreślarnia / The Drafting Hall | `q-m2-agent-architecture` (event, 125) | `m2-exam-agent-architecture` | — |
| 4 | `m2-assembly-line` | Hala Montażowa / The Assembly Hall | `q-m2-impl-control` (api, 200) | `m2-exam-impl-control` | — |
| 5 | `m2-planning-core` | Rdzeń Planowania / The Planning Core | `q-m2-solo-review` (api, 225) | `m2-exam-solo-review` | `/planner` |

Exams: 50 XP each, `passingScore: 3`, 3 questions, title pattern `Przechwycony test VOID: <temat>` (m1 shape: `src/explorers/levels/m1-uplink-bay/exams.ts`).

Event quests copy the m1 shape exactly (`m1-landing-pad/quests.ts`): single objective, `event: 'exam:completed'`, `matchPayload: { examId, passed: true }`, `requireFlag` = the exam-done flag.

Retired quest IDs — never reuse: `q-synaptit-prd-audit`, `q-echotrace-skill`, `q-shaft-controller-policy`, `q-moreau-context`, `q-uplink-to-earth`.

## Verification commands (used throughout)

```bash
# After every level's content phase:
npx vitest run src/explorers/levels/contentValidation.test.ts src/explorers/levels/bilingualParity.test.ts
npm run levels:check
# After any yaml change:
npm run levels:build            # regenerates public/game/maps/*.json — never edit JSON by hand
npm run levels:render -- <key> --zones   # visual inspection PNG
# Module completion:
npx vitest run                  # full suite (includes mapSync, i18n parity, noHardcodedPolish)
```

---

## Phase 0 — Flags & scaffolding

**File:** `src/explorers/config/flags.ts`

Add all M2 constants in one pass (full list in bible §8): 5 intro-seen, 5 quest-done, 5 exam-done, 3 narrative-event flags (`m2-side-channel-established`, `m2-inbound-contact-logged`, `m2-insider-work-order-found`), 2 finale flags (`m2-planning-module-restored`, `m2-void-intercept-plan-found`), 2 command flags (`cmds:plan`, `cmds:planner`), and `SYS_COURSE_M3_AVAILABLE: 'sys:course-m3-available'` (constant only — the Supabase `system_flags` row is an ops task, note it in the final summary, do not attempt here).

**Verify:** `npm run check` (flags.ts is imported server-side via manifests).

---

## Phase 1 — Map sources (all five before first content phase)

Author all five `src/explorers/levels/m2-*/map.level.yaml` files with `theme: 3` (snow). Validation loads the whole source set, so create all five before the first build.

**Topology table (write door zones from this; every row needs explicit yaml):**

| Map | Doors out | Gating (`requiredFlags`) |
|-----|-----------|--------------------------|
| `m2-planning` | west → `m1-uplink-bay` (return); east → `m2-staging-yard` | east: `m2-plan-contract-done` |
| `m2-staging-yard` | west → `m2-planning`; east → `m2-drafting-hall` | east: `m2-milestones-done` |
| `m2-drafting-hall` | west → `m2-staging-yard`; east → `m2-assembly-line` | east: `m2-architecture-done` |
| `m2-assembly-line` | west → `m2-drafting-hall`; east → `m2-planning-core` | east: `m2-impl-control-done` |
| `m2-planning-core` | west → `m2-assembly-line`; east → `m3-diagnostics` (future map, validator warning OK) | east: `m2-solo-review-done,sys:course-m3-available` |

**Spawn constraint:** `m1-uplink-bay/map.level.yaml` `moon-two-door` targets `m2-planning` with `spawnX: 1, spawnY: 5`. The grid alphabet requires an outside `~` ring in practice, so tile (1,5) will likely be wall. **Decision: adjust the m1 spawn** to match the final `m2-planning` layout (e.g. `spawnX: 2`) — this is the single permitted m1 touch (bible §11). Rebuild both maps afterward.

**Per-level design briefs (cookbook quality gate — no default rectangles):**

- `m2-planning` — entry airlock chamber (west, from m1) opening into a wide atrium hub dominated by the frozen operations board (landmark, north); registry alcove (L-4) offset east; certification terminal south; frozen units as solid props mid-stride; desk/mug/coat ambient props. Zones: `ops-board`, `plan-registry`, `frozen-units` (1–2 trigger tableaux), `comms-console` (Moreau side-channel beat), `cert-terminal` (exam), NPCs `usher-u1`, `registrar-l4`, doors.
- `m2-staging-yard` — long yard with tram spine (parallel prop rows), schedule board landmark, heat-plant side room (B-6), dispatch box (D-2); milestone console where HQ results land. Zones: `schedule-board`, `heat-plant`, `milestone-console`, `tram-alpha/beta/gamma` (pre/post-thaw variants), NPCs `dispatcher-d2`, `stoker-b6`, `cert-terminal`, doors.
- `m2-drafting-hall` — drafting tables in bays breaking sightlines, model plinth landmark, approach-control array alcove (the L3 reaction beat) north; architecture console. Zones: `drafting-tables`, `model-plinth`, `approach-array`, `architecture-console`, NPC `draftsman-a3`, `cert-terminal`, doors.
- `m2-assembly-line` — linear fabricator line with checkpoint gates (CP props) the player walks along (quest geography = the line itself), archive terminal side room (insider work-order reveal), control console. Zones: `fabricator-line`, `checkpoint-gate` (×2), `line-archive`, `control-console`, NPCs `foreman-f6`, `controller-cp5`, `cert-terminal`, doors.
- `m2-planning-core` — ceremonial approach corridor narrowing into the core rotunda (biggest landmark of the module), plan-queue console, review console, approval pedestal (the human-decision beat, rhyme with m1's human-auth panel). Zones: `core-face`, `plan-queue`, `review-console`, `approval-pedestal`, NPCs `core-warden-z9`, `plan-echo` (npc or trigger — prefer trigger with prop if it's "a document, not a unit"), `cert-terminal`, doors.

**Steps:** author all five yamls → `npm run levels:build` → `npm run levels:render -- <key> --zones` for each → iterate on geometry/props → adjust `m1-uplink-bay` spawn → rebuild.

**Verify:** `npm run levels:check` clean (only the `m3-diagnostics` future-map warning allowed); rendered PNGs reviewed for repeated composition/dead space.

---

## Phases 2–6 — Level content, one level per phase, in map order

Each phase produces `manifest.ts`, `dialogues.ts`, `quests.ts`, `exams.ts` for its level, registers the manifest in `src/explorers/levels/index.ts`, and runs the per-level verification. All prose follows the bible's per-level beats (§9), cast voices (§6), explicitness checklist (§10), and constraints (§11): bilingual `{pl,en}`, Polish primary, `autoAdvance` only on system/cinematic lines (1500–3500 ms), Dexo monologue on every big reveal, "Jednostka … Kolektywu VOID" intros, Moreau pad-confirmation line on every HQ mission completion.

Manifest shape mirrors `m1-uplink-bay/manifest.ts`: `interactionRoutes` with `flagVariants` (post-quest states for every quest-relevant zone and NPC), `questCompletionDialogues`, `examCompletionDialogues`, `introDialogue` + `introFlag` + `introCinematicTitle/Subtitle` (titles in bible §9).

### Phase 2 — `m2-planning` (L1, plan-first)

- Intro dialogue: full seven-point canon bridge (bible §2) + CORE AI first-sight-of-snow beat + Moreau side-channel setup (`setFlags: m2-side-channel-established`) + thesis line + approved-plan rule + counter-lesson. This is the longest intro of the module (~10 lines, cinematic → dialogue).
- Exam `m2-exam-plan-first` — 3 questions on plan-first development (course-accurate, m1 question style: scenario-based, one correct option).
- Event quest `q-m2-plan-contract` — rewards `{ xp: 75, flags: [M2_PLAN_CONTRACT_DONE, CMDS_PLAN] }`.
- Key dialogues: ops-board, registry pre/post (L-4's "pierwszy nowy plan od 847 cykli"), U-1 pre/post, locked east door ("zdaj test Plan przed kodem…"), exam-done certificate beat, quest completion.

### Phase 3 — `m2-staging-yard` (L2, MVP milestones) + HQ mission 1

- Api quest `q-m2-mvp-milestones` — rewards `{ xp: 150, flags: [M2_MILESTONES_DONE] }`. Briefing/hint reference `module-002-10xdevs-workflow/PROMPT_MILESTONES.md` explicitly (m1 hint convention).
- **HQ side first, then hash:** author `MILESTONE_CANDIDATES.csv` (~8–10 candidates: id, value, heat-cost, prereqs) and `THAW_BUDGET.md` (budget + selection rules) so that **exactly one ordered chain** satisfies the rules; derive the canonical answer (e.g. `M04>M02>M07`); confirm the normalization rule in `src/pages/api/game/submit.ts` before hashing; compute SHA-256 of the normalized answer → `answerHash`. Add `QUEST_INDEX.csv` row. Static files only — no runners/validators.
- Dialogues: thaw beat on completion (first movement in 847 cycles, D-2 joy beat), Moreau confirmation, tram pre/post variants, B-6 heat-budget creed.
- Exam `m2-exam-mvp-milestones`.

### Phase 4 — `m2-drafting-hall` (L3, architecture with agents)

- Event quest `q-m2-agent-architecture` — rewards `{ xp: 125, flags: [M2_ARCHITECTURE_DONE] }`.
- Exam `m2-exam-agent-architecture`.
- **Reaction beat:** approach-array dialogue sets `m2-inbound-contact-logged` (trajectory-change sting, Dexo monologue: "Na Księżycu 1 nas usłyszeli. Tu widzę, że odpowiedzieli."). Post-state flagVariant on the array.

### Phase 5 — `m2-assembly-line` (L4, implementation control) + HQ mission 2

- Api quest `q-m2-impl-control` — rewards `{ xp: 200, flags: [M2_IMPL_CONTROL_DONE] }`.
- **HQ side:** `PLAN_STEPS.csv` (approved steps + checkpoints), `FABRICATOR_TRACE.csv` (trace with exactly one unambiguous first drift), `CONTROL_POLICY.md` (drift classes → corrective actions). Canonical answer shape `CP4:ROLLBACK`-style; same hash procedure; `QUEST_INDEX.csv` row.
- **Insider beat:** line-archive dialogue sets `m2-insider-work-order-found` (0x7F work order, "[DOSTĘP: NULL]", Dexo monologue, Moreau worried check-in).
- Exam `m2-exam-impl-control`; F-6/CP-5 double-act dialogues with pre/post variants.

### Phase 6 — `m2-planning-core` (L5, solo review; finale) + HQ mission 3

- Api quest `q-m2-solo-review` — rewards `{ xp: 225, flags: [M2_SOLO_REVIEW_DONE, M2_PLANNING_MODULE_RESTORED, M2_VOID_INTERCEPT_PLAN_FOUND, CMDS_PLANNER] }`.
- **HQ side:** `REVIEW_PACKET.md` (final plan/change-set with seeded genuine defects + decoys), `REVIEW_CHECKLIST.md` (defect criteria). Canonical answer = sorted genuine defect IDs (`R-03,R-07,R-11` shape); hash; `QUEST_INDEX.csv` row.
- Finale completion dialogue (~10–12 lines) exactly per bible §9 L5: approval beat (Plan Echo falls silent) → PLANNING MODULE: RESTORED ("Planuję. Widzę jutro.") → intercept-plan sting (Voronov-key match + one HARRIS line, no discussion) → Moreau sober reaction → Dexo wrap-up + Moon 3 hook.
- moon-three-door locked dialogue; exam `m2-exam-solo-review`; Z-9 and Plan Echo dialogues with post-finale variants.

**Per-phase verification (2–6):** content tests + `levels:check` (see commands above), plus a quick read-through of the new dialogue file for voice drift.

---

## Phase 7 — Terminal commands & i18n

**Files:** `src/explorers/terminal/commandHandler.ts`, `src/explorers/i18n/terminal.ts` (+ wherever command gating lists `cmds:*` flags — follow how `scan`/`sensors` are gated).

- `/plan` (`cmds:plan`) — statusBlock showing the extraction plan artifact; sections appear by flag (contract always; milestones after `M2_MILESTONES_DONE`; architecture after `M2_ARCHITECTURE_DONE`; execution after `M2_IMPL_CONTROL_DONE`; verdict + ZATWIERDZONY after `M2_SOLO_REVIEW_DONE`) — same pattern as `cmdCrew`/`cmdUplink` flag branching.
- `/planner` (`cmds:planner`) — planning-module status, mirror of `cmdSensors`.
- **Continuity fix:** `terminal.sensors.planning` currently hardcodes "moduł planowania OFFLINE" — make `cmdSensors` flag-branch that line to AKTYWNE after `M2_PLANNING_MODULE_RESTORED` (same technique as the existing `sensors.online/offline` pair).
- All new strings added to both `pl` and `en` blocks (i18n `strings.test.ts` parity gates this).

**Verify:** `npx vitest run src/explorers/i18n` + manual `/plan`, `/planner`, `/sensors` in dev.

---

## Phase 8 — Registration & navigation

- `src/explorers/levels/index.ts` — confirm all five manifests registered (done incrementally in phases 2–6; verify order/completeness here).
- `src/explorers/levels/navigationDestinations.ts` — moon-2 entry: `targetMap: 'm2-planning'`, spawn on walkable floor near the west entry, `requiredFlags: [FLAGS.M1_UPLINK_DONE, FLAGS.SYS_COURSE_M2_AVAILABLE]`, keep codename "Wormhole Workflows", description loses "Sygnał niedostępny" (bilingual update).

**Verify:** `npm run levels:check` (nav spawn walkability), content tests.

---

## Phase 9 — Final verification & QA pass

1. Full suite: `npx vitest run` (mapSync, contentValidation, bilingualParity, i18n parity, noHardcodedPolish, everything else).
2. `npm run levels:build` idempotency (no diff on rebuild) + `npm run levels:check` clean.
3. Sequential read-through of all five `dialogues.ts` files: voice consistency (§6), glossary consistency (§7), thread continuity (§5), explicitness checklist (§10) ticked per level.
4. Manual browser pass (dev server): full path m1-uplink-bay → moon-two-door → all five rooms → moon-three-door locked message; both directions on every door; exam flow per level; `/plan` growth after each level (QA overlay can force flags); rank-up cadence (~1 rank-up across the module at 1025 XP).
5. HQ dry-run: from `~/dev/10x-explorers-hq`, follow each PROMPT_*.md by hand and confirm the canonical answer is deterministically derivable from the static inputs alone; confirm `QUEST_INDEX.csv` rows.
6. Report leftover ops tasks in the summary: Supabase rows for `sys:course-m2-available` toggle timing and new `sys:course-m3-available`; do not commit anything.

---

## Open decisions (defaulted; flag in the final summary)

1. **m1 spawn touch** — adjusting `moon-two-door` `spawnX/spawnY` in `m1-uplink-bay/map.level.yaml` to fit the m2-planning layout (rebuilds `m1-uplink-bay.json`). Default: yes, it's the sanctioned single m1 change.
2. **`/sensors` continuity flip** (Phase 7) — default: yes, one-line flag branch.
3. **`Plan Echo` embodiment** — trigger-with-prop (a document, not a unit) rather than an npc zone. Default: trigger.
4. **HQ module dir name** — `module-002-10xdevs-workflow` (matches `module-001-agentic-environment` convention).

## What this plan does NOT touch

m0 content, m1 content (except the one spawn), other modules' `exams.ts`, `src/server/**`, `wrangler.toml`, Supabase migrations, HQ repo runners/validators (none are created), git history (no commits).
