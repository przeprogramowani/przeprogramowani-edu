# Space Explorers Localization (en/pl) — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md`

## What & Why

Add a runtime `pl/en` language toggle to Space Explorers, surfaced as a button in `GameHud.svelte`. The game has ~10,000 words of Polish text across ~30 files; an English option opens it to non-Polish-speaking players (10xDevs international audience, English-locale browsers landing on `/explorers`) without rewriting the asset pipeline — static assets and fonts already work in both languages.

## Starting Point

The explorers tree has zero i18n today. All player-facing strings are Polish: ~60% lives in already key-addressed content (dialogues, exams, quests, arcade definitions, command registry, rank flavor) and ~40% as inline literals in scene-rendering code (HUD chrome, terminal `commandHandler.ts`, exam/arcade scene labels, GameScene cinematic). The Svelte ↔ Phaser bridge has a 28-event bus and one cross-cutting Svelte store (`isTouchMode`) — both serve as templates for the locale plumbing.

## Desired End State

A `PL / EN` button next to the mute control flips the entire game between Polish and English instantly. HUD chrome, terminal, dialogues, exams, arcade chrome and renderers, GameScene cinematic, preview overlay, grant notifications, and lock screen all render in the active locale. The choice persists to `localStorage` and survives reload. Mid-game swaps flip immediately except in three risky zones (typewriter mid-line, arcade `playing` phase, cinematic intro), which defer to the next clean boundary. Default is `pl`. No marketing surfaces are touched.

## Key Decisions Made

| Decision | Choice | Why |
|---|---|---|
| Scope | Game canvas + adjacent Svelte shells; no marketing | Self-contained client-side scope; avoids SSR coupling and Supabase migration |
| Launch shape | Single big-bang release | All strings translated before merge; avoids mixed-locale window in production |
| Default locale | Always `pl`; no `navigator.language` detection | Preserves current behavior for returning Polish players; HUD button is sole discovery surface |
| Persistence | localStorage only | Anonymous-friendly; zero schema churn; matches AudioManager mute precedent |
| Mid-flight UX | Instant flip + defer in 3 risky zones | Best UX in the common case; protects typewriter, arcade rounds, cinematic tweens |
| Transcript on swap | Leave as-is; new output uses new locale | Transcript is conceptually immutable log; trivial to implement |
| Translation source | LLM-assisted draft + human review for narrative; LLM verbatim for chrome | Best speed/quality ratio for ~10k words; protects character voice |
| Names policy | Keep proper nouns (Floobert, Moreau, Harris, Dexo); localize titles (`inżynier` → `Engineer`) | Preserves character identity across locales |
| Rank names | English in both locales (existing design intent); `RANK_FLAVOR` localizes | Rank names read as in-fiction sci-fi titulature |
| i18n dictionary shape | Per-feature modules (`i18n/hud.ts`, `i18n/exam.ts`, ...) with central `t()` helper | Smaller files, fewer merge conflicts, key namespace implicit per file |
| Bilingual content shape | Inline `text: { pl, en }` per line on dialogue/exam/quest types | One file per level for review; structural parity enforced by TypeScript |
| Verification | Type-enforced parity + Vitest tests + manual play-through both locales | Catches drift cheaply; manual covers tone/layout fit |

## Scope

**In scope:**
- HUD chrome (`GameHud.svelte`), Phaser scene rendering (`ExamScene`, `ArcadeScene`, `GameScene` cinematic), all dialogue UI (`DialogueBar`, `InteractionPrompt`, typewriter), arcade renderers (MemoryMatrix, Oscilloscope, AsteroidRange).
- Terminal: `commandHandler.ts` output, `commandRegistry.ts`, `supportCommand.ts`, `SmartTerminal.svelte`, `TerminalLockScreen.svelte`, `TerminalInput.svelte`, `TerminalTokenBar.svelte`.
- Adjacent Svelte shells: `PreviewOverlay.svelte`, `GrantNotification.svelte`.
- Bilingual content: every `levels/m0-*/dialogues.ts`, `levels/m0-exam-room/exams.ts`, all `quests.ts`, `RANK_FLAVOR` in `config/ranks.ts`.

**Out of scope:**
- Marketing surfaces (`/courses` Space Explorers card, `/explorers/badges/rank.astro` OG share, `/explorers/resources/m0-study-notes`).
- `GameState` schema bump or Supabase migration.
- `MobileControls.svelte` aria-labels (accessibility follow-up).
- `QaOverlay.svelte` (dev-only).
- Rank `name` fields (English in both locales by design).

## Architecture / Approach

A Svelte `writable<Locale>` store at `utils/locale.ts` mirrors the `isTouchMode` precedent and is the front door for HUD/SmartTerminal/PreviewOverlay reactivity. A single subscription in `PhaserGame.svelte` re-emits the change as a new `LOCALE_CHANGED` event on `game.events`, so Phaser scenes consume it identically to all other state changes.

Inline-literal scene strings extract into per-feature dictionary modules under `src/explorers/i18n/` (`hud.ts`, `scene.ts`, `exam.ts`, `arcade.ts`, `terminal.ts`, `cinematic.ts`, `preview.ts`, `grant.ts`, `lockscreen.ts`), with a central `t(key, params?)` helper. Bilingual content (dialogue lines, exam questions/options, quest fields, `RANK_FLAVOR`) migrates from `text: string` → `text: { pl: string; en: string }` at the type level, with read paths in `DialogueManager`, `ExamScene`, `QuestManager` selecting the right field by current locale.

Re-render policy: resize-rebuild scenes (`ExamScene`, `ArcadeScene`) hook `LOCALE_CHANGED` to the existing `clearUI()` path; retain-ref UI calls `applyLocale()` that re-`setText` on cached refs; risky zones stash pending locale and apply at the next clean boundary.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Locale infrastructure & HUD toggle | Svelte store + localStorage + `LOCALE_CHANGED` event + HUD button. Persists, no content change yet. | Toggle wired but visually inert until later phases — easy to misread as broken |
| 2. Bilingual content schema migration | Type-level migration of dialogue/exam/quest/rank-flavor to `{ pl, en }`; `en` placeholders = `pl` values. Both locales play identically (Polish text). | Type changes ripple through DialogueManager/ExamScene/QuestManager; codemod must be idempotent |
| 3. Inline-literal extraction + per-feature dictionaries + re-render plumbing | Every literal moves to `i18n/*.ts`; scenes wire `LOCALE_CHANGED` to rebuild paths; risky zones implement deferral | Largest line-count touched; missed literals only surface in manual QA |
| 4. Translation production | LLM-assisted draft + human review; parity tests block CI on missing/empty `en` | Translation quality is content-quality gate; reviewer time on ~5k narrative words is the long pole |
| 5. QA, mid-flight verification, launch readiness | Full play-through both locales; mid-flight swap matrix; visual-fit pass at 3 viewports; CLAUDE.md / cookbook updates | Long tail of small string fixes from QA; English line lengths may overflow exam panels |

**Prerequisites:** None — net-new feature, no upstream dependencies. Translation reviewer time (~8–12h) needs to be scheduled before Phase 4 start.

**Estimated effort:** ~40–60h engineering + ~8–12h human review for translations, across 5 phases over roughly 2–3 weeks if worked steadily, or 4–5 sessions if dedicated.

## Open Risks & Assumptions

- English line lengths may exceed Polish for some exam questions and arcade renderer text; if visual overflow is widespread, line-break or font-size tuning may need to land in Phase 5.
- LLM-drafted character voice for Floobert (eccentric register) and Officer Harris (formal/military) may flatten without explicit voice brief in the prompt — mitigated by review pass.
- Players who flip mid-session see a mixed-locale terminal transcript until commands re-run; assumed acceptable per UX decision.
- localStorage-only persistence means cross-device divergence (player toggles to English on phone, opens on desktop, sees Polish until they re-toggle); assumed acceptable for Tier 1.

## Success Criteria (Summary)

- A new player landing on `/explorers` can switch to English with one HUD click and replay m0-awakening through m0-crew-room entirely in English with natural-reading text and no untranslated Polish stragglers in scope.
- A returning Polish player sees no behavioral change from baseline (default `pl`, original content unchanged in `pl` locale).
- Toggling mid-game during dialogue, arcade, or cinematic doesn't break those experiences (deferred application per zone).
- Vitest parity tests block CI on any future regression where a `pl` key is added without its `en` counterpart.
