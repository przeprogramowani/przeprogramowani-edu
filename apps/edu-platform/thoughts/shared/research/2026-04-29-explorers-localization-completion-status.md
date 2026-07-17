---
date: 2026-04-29T05:35:00+0000
researcher: Przemek Smyrdek
git_commit: 383926d2da10b895768c7da0a5e5e55d3daf105a
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "Space Explorers localization — what remains to ship the pl/en toggle"
tags: [research, codebase, explorers, i18n, localization]
status: complete
last_updated: 2026-04-29
last_updated_by: Przemek Smyrdek
---

# Research: Space Explorers localization — what remains to ship the pl/en toggle

**Date**: 2026-04-29 05:35 UTC
**Researcher**: Przemek Smyrdek
**Git Commit**: `383926d2` (1 commit ahead of `origin/master`; localization work entirely uncommitted in working tree)
**Branch**: `master`
**Repository**: `przeprogramowani/przeprogramowani-sites`

## Research Question

The plan `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md` plus its remediation companion `2026-04-28-explorers-localization-content-remediation.md` are both marked **completed**, yet the user reports the work was abandoned mid-progress. Establish the actual state of the working tree against the plans and produce the punch list of what still has to be done before the toggle ships.

## Summary

**The plan footers are misleading.** Phase 2 (content schema migration, English translations, parity tests) is genuinely complete in the working tree. **Phase 1 is partially complete and Phase 3 is essentially untouched in the consumers.** The dictionaries, locale store, and translated content are all authored — but every UI component that should be reading from those dictionaries (Phaser scenes, arcade renderers, dialogue UI, terminal command handler, every Svelte shell except none) still hardcodes Polish strings. There is no `LOCALE_CHANGED` event, no store→bus subscription, no PL/EN toggle button, and no `onLocaleChanged` hook on `BaseScene`. **The player today has no way to switch languages.**

If you manually wrote `localStorage.setItem('space-explorers-locale', 'en')` and reloaded, only **content** (dialogue lines, exam questions, quest text, RANK_FLAVOR) would render in English — because those go through `localized()` already. **All chrome would stay Polish:** HUD, exam buttons, arcade labels, terminal output, every Svelte component.

Effort estimate to finish: ~5–7 focused sessions, plus translation reviewer time is **not** needed (translations are already in place and pass the parity tests).

### Verdict matrix

| Plan area | Plan claims | Actual state |
|-----------|-------------|--------------|
| Phase 1: locale store + persistence | Done | **Done** (uncommitted) |
| Phase 1: `LOCALE_CHANGED` event | Done | **Not done** — no entry in `events/GameEvents.ts` |
| Phase 1: store→bus wiring in `PhaserGame.svelte` | Done | **Not done** — no `locale` import |
| Phase 1: PL/EN toggle button in `GameHud.svelte` | Done | **Not done** — no button, no import |
| Phase 2: bilingual content schema + translations | Done | **Done** (uncommitted, all 205+ dialogue lines + 45 exam fields + 6 RANK_FLAVOR + quests fully translated) |
| Phase 2: parity tests | Done | **Done** — both pass (`vitest` confirms 26 tests pass) |
| Phase 3: i18n dictionaries authored | Done | **Done** — `i18n/{hud,scene,exam,arcade,terminal,preview,grant}.ts` all present with full English |
| Phase 3: `BaseScene.onLocaleChanged` hook | Done | **Not done** |
| Phase 3: ExamScene/ArcadeScene/GameScene/DialogueScene listener wiring | Done | **Not done** |
| Phase 3: arcade renderer `applyLocale()` (Memory/Oscilloscope/AsteroidRange) | Done | **Not done** |
| Phase 3: DialogueBar / InteractionPrompt / TypewriterEffect / dialogueBarPresentation extractions | Done | **Not done** (DialogueBar uses `localized()` for content but hardcodes `[Spacja] dalej ▸`) |
| Phase 3: Terminal extractions (`commandRegistry`, `commandHandler`, `supportCommand`) | Done | **Not done** (commandHandler imports `localized` for quest reads only; chrome strings raw) |
| Phase 3: Svelte shell extractions (SmartTerminal, PreviewOverlay, GrantNotification, TerminalLockScreen, TerminalInput, TerminalTokenBar) | Done | **Not done** — zero `import { t } from './i18n/store'` anywhere |
| Phase 5: QA + mid-flight swap matrix + viewport fit + CLAUDE.md/cookbook | Pending | Pending |

## Detailed Findings

### What exists and works

**Locale store + persistence** — `src/explorers/utils/locale.ts` (untracked):
- Svelte `writable<Locale>` mirroring `utils/touchDetection.ts:17` precedent
- localStorage key `space-explorers-locale`, default `'pl'`
- Exports `getLocale`, `setLocale`, `toggleLocale`, `initLocaleStore`

**Bilingual type + helper** — `src/explorers/i18n/types.ts:1-…`:
- `BilingualText = Record<Locale, string>`
- `localized(value: BilingualText)` reads `value[getLocale()]`

**UI chrome dictionaries** — all under `src/explorers/i18n/`:
- `hud.ts` (11 entries), `scene.ts` (14), `exam.ts` (12), `arcade.ts` (40), `terminal.ts` (137), `preview.ts` (1), `grant.ts` (2)
- All have real English (sampled and confirmed `pl !== en` everywhere)
- `index.ts` merges into `STRINGS` and exposes `t(key, params?)` with `{name}` interpolation + `pl` fallback
- `store.ts` provides a Svelte derived `t` store reactive on `locale`

**Phase 2 type migration** (modified files in git status):
- `systems/DialogueTypes.ts` — `DialogueLine.text: BilingualText`; `DialogueEffect.openUrlTitle/addBookmark.title: BilingualText`
- `systems/ExamTypes.ts` — `ExamDefinition.title/description`, `ExamQuestion.text`, `ExamOption.text`: all `BilingualText`
- `systems/QuestManager.ts` — `BaseQuestDefinition.title/briefing/hints[]`, `EventObjective.label`: all `BilingualText`
- `config/ranks.ts` — `RANK_FLAVOR: Record<number, BilingualText>`

**Phase 2 content + translations** (modified files):
- `levels/m0-awakening/dialogues.ts` — 41 lines, all bilingual
- `levels/m0-core-ai/dialogues.ts` — 72 lines
- `levels/m0-exam-room/dialogues.ts` — 41 lines
- `levels/m0-crew-room/dialogues.ts` — 51 lines
- `levels/m0-exam-room/exams.ts` — 3 titles + 3 descriptions + 9 questions + 30 options
- `levels/m0-exam-room/quests.ts`, `levels/m0-core-ai/quests.ts` — quest titles/briefings/hints/objective labels
- `config/ranks.ts` — RANK_FLAVOR tiers 2–7

**Phase 2 read-path fixes** (modified files use `localized()` correctly):
- `ui/DialogueBar.ts:16,113` — wraps `line.text`
- `scenes/ExamScene.ts:9` — wraps `exam.title`, `question.text`, `option.text`
- `terminal/commandHandler.ts:4` — wraps `quest.title`, `quest.briefing`, `objective.label`
- `systems/DialogueManager.ts:8` — wraps `effects.openUrlTitle`, `effects.addBookmark.title`
- `config/ranks.ts:3` — wraps `RANK_FLAVOR[rank.tier]`

**Tests passing** (verified via `npm run test --workspace=projects/edu-platform -- --run src/explorers/i18n src/explorers/levels/bilingualParity.test.ts`):
- `src/explorers/i18n/strings.test.ts` — 21 tests, all pass
- `src/explorers/levels/bilingualParity.test.ts` — 5 tests, all pass
- Both enforce `pl !== en` (with allowlist for proper nouns / brand strings)
- Both enforce key-set parity and interpolation slot parity

**Codemod** — `scripts/i18n-migrate-content.ts` (untracked) — already used; idempotent.

### What's missing — the actual punch list

#### A. Phase 1 wrap-up: bus event, store→bus bridge, HUD button (~0.5 session)

1. **`src/explorers/events/GameEvents.ts`** — add `LOCALE_CHANGED: 'locale:changed'` plus `LocaleChangedPayload { locale: Locale }`. Confirmed absent: zero references in current source.

2. **`src/explorers/PhaserGame.svelte`** — import `locale` + `initLocaleStore`; in `onMount` after `game = new Phaser.Game(...)`, call `initLocaleStore()` and subscribe with `game.events.emit(GameEvents.LOCALE_CHANGED, { locale: value })`. Cleanup in `onDestroy`. Confirmed absent.

3. **`src/explorers/GameHud.svelte`** — import `locale, toggleLocale`; add `PL / EN` button with `preventHudFocusSteal` + `blurHudButton`. Desktop adjacent to mute (~`:238-255`); mobile cluster (~`:165-176`); drawer (~`:271-289`). Reactive title/aria via `$locale`. Confirmed absent.

4. **`src/explorers/scenes/BaseScene.ts`** — add `onLocaleChanged()` no-op hook + `LOCALE_CHANGED` listener attach in `create()` and detach in `shutdown()`. Confirmed absent (file is 67 lines; no locale awareness).

#### B. Phase 3 scene wiring + extractions (~1.5 sessions)

5. **`src/explorers/scenes/ExamScene.ts`** — extract remaining inline literals: `:243` `'Wybierz wszystkie pasujące:'`, `:350,687` `'Zamknij'`, `:520` `'EGZAMIN ZALICZONY' / 'EGZAMIN NIEZALICZONY'`. Title prefix already uses `localized()` for content but the `'EGZAMIN: '` prefix is mixed — should use `t('exam.titlePrefix', { title: localized(exam.title) })`. Override `onLocaleChanged()` to reuse the existing resize→`clearUI()`+`renderQuestion()` path at `:47-54, 469`.

6. **`src/explorers/scenes/ArcadeScene.ts`** — extract `:339` `'WYNIK: 0'`, plus all `WYNIK:`/`CZAS:`/`Poziom:`/`[Enter] Start`/`[ESC] Wyjdź` literals. Override `onLocaleChanged()` with deferral: when `phase === 'playing'`, set `pendingLocaleSwap = true`; on round-end transition, drain by calling `clearUI()`+`renderCurrentPanel()`. Reuse the existing `:637-642` `clearUI()` path.

7. **`src/explorers/scenes/GameScene.ts`** — extract 5 interaction-prompt assignments at `:418-422` (currently `'[E] Zobacz' | '[E] Przejdź' | '[E] Egzamin' | '[E] Zadanie' | '[E] Rozmawiaj'`) — replace with `t('scene.interactionLook' | 'scene.interactionDoor' | …)`. Extract end-screen at `:709` (`'DEMO UKOŃCZONE'`) and `:748` (`'Dowiedz się więcej →'`) plus the rest of the cinematic block (`:608-617, 619-629, 706-737`). Override `onLocaleChanged()` with deferral when `introPlaying` is true; interaction prompts auto-refresh next frame because `update()` recomputes them.

8. **`src/explorers/scenes/DialogueScene.ts`** — `attachLocaleListener()` + `onLocaleChanged()` override that calls `dialogueBar.applyLocale()` when active.

#### C. Phase 3 UI extractions + applyLocale (~1 session)

9. **`src/explorers/ui/DialogueBar.ts`** — already imports `localized` for content; add `applyLocale()` that re-applies presentation (calls `dialogueBarPresentation.getSpeakerDisplay`, refreshes hint via `t('scene.dialogueAdvanceHint')`) and re-renders body via `setText(localized(activeLine.text))` only when typewriter is complete (deferral spec). Cache `activeLine` ref. Need to extract the `'[Spacja] dalej ▸'` literal currently in `dialogueBarPresentation.ts:24`.

10. **`src/explorers/ui/InteractionPrompt.ts`** — replace `:16` and `:28` `'[E] Interakcja'` defaults with `t('scene.interactionDefault')`. No listener needed: `GameScene.update()` reasserts the label every frame.

11. **`src/explorers/ui/dialogueBarPresentation.ts`** — replace the `ADVANCE_HINT_TEXT` constant with a `t('scene.dialogueAdvanceHint')` call (must be re-evaluated each render, not module-load constant). `getSpeakerDisplay` should use `t('scene.speakerAstronaut' | 'scene.speakerSystem')` keys.

12. **`src/explorers/ui/TypewriterEffect.ts`** — optional for first ship: `pendingLocaleAfterComplete` state; on `LOCALE_CHANGED` mid-line, stash; on `complete()`, if pending, re-render the just-finished line in new locale. Recommend deferring — DialogueBar's post-complete branch handles the common case.

#### D. Phase 3 arcade renderers (~1 session)

13. **`src/explorers/arcade/MemoryMatrixRenderer.ts`** — extract header/hint/feedback strings → `t('arcade.mm.*')` (keys already exist in `i18n/arcade.ts`). Add `applyLocale()` that re-runs the active-phase render.

14. **`src/explorers/arcade/OscilloscopeRenderer.ts`** — `:29,37,46,55,65` hardcodes `'Amplituda'` (and similar for Częstotl/Faza/Przesunięcie) inside `DIFFICULTY_CONFIG` — change `label: string` → `labelKey: 'arcade.osc.paramAmplitude' | …` and resolve via `t(labelKey)` at render time in `updateParamDisplay()`. Extract `:258` controls, `:392` submitted hint, `:542,551` `Dopasowanie:` + percentage. Add `applyLocale()` that re-runs `updateParamDisplay()` and resets `hintText`.

15. **`src/explorers/arcade/AsteroidRangeRenderer.ts`** — extract `:131` `'STRZELNICA ASTEROIDÓW'`, `:153` `'[WASD] celuj   [SPACE] strzelaj'`, `:383` `LADOWANIE {ms}ms` / `GOTOWY` plus the two-line status template. All keys exist in `i18n/arcade.ts`. Add `applyLocale()` that resets `titleText`/`hintText` and calls `updateStatusText()`.

16. **`src/explorers/systems/ArcadeTypes.ts`** — add `applyLocale?(): void` to the `ArcadeGameRenderer` interface so `ArcadeScene.onLocaleChanged()` can call it.

#### E. Phase 3 terminal extractions (~1 session, biggest extraction surface)

17. **`src/explorers/terminal/commandRegistry.ts`** — change `description: string` → `descriptionKey: StringKey` (terminal dictionary already has `terminal.cmd.me/time/quest/solve/hint/bookmarks/navi/badges/support`); render via `t()` at read time. Update `getAvailableCommands()` consumers (`/help` rendering in `commandHandler.ts` + autocomplete in `SmartTerminal.svelte`).

18. **`src/explorers/terminal/commandHandler.ts`** — already imports `localized` for content reads. Replace every Polish chrome literal across `cmdHelp`, `cmdMe`, `cmdTime`, `cmdQuest`, `cmdQuestEvent`, `cmdSolve`, `cmdHint`, `cmdBookmarks`, `cmdNavi`, `cmdBadges`, `cmdSupport`, plus unknown-command fallbacks. ~70-100 inline literals; all keys already exist in `i18n/terminal.ts` under `terminal.help.*`, `terminal.me.*`, `terminal.time.*`, etc.

19. **`src/explorers/terminal/supportCommand.ts`** — replace 11 inline literals (header, error states, token labels). Keys exist.

#### F. Phase 3 Svelte shells (~1 session)

20. **`src/explorers/SmartTerminal.svelte`** — `import { t } from './i18n/store'`; replace `'UPLINK TERMINAL'`, `'UPLINK v3.0/v2.1 — Kosmiczne Łącze Kwantowe'`, `'Sesja aktywna.'`, bottom hints (`'[↑↓] wybierz komendę'` / `'[Enter] zatwierdź'` / `'[Esc] zamknij'`), support flow strings, notification templates (`◆ Misja aktywowana: …`).

21. **`src/explorers/PreviewOverlay.svelte`** — `:12` and `:16` `'Notatki z podróży'` defaults → `$t('preview.defaultTitle')` (note the local `title` variable receives a payload override; default fallback uses static `t()`).

22. **`src/explorers/GrantNotification.svelte`** — `:69` `'Misja zaliczona!'` → `$t('grant.questCompleted')`; `:86` `+{totalXp} XP łącznie` → `$t('grant.totalXp', { xp: totalXp })`.

23. **`src/explorers/terminal/TerminalLockScreen.svelte`** — extract `'Witaj, Dexo!'`, `'Blokada aktywna.'`, `'Podaj kod odblokowujący:'`, `'Nieprawidłowy kod.'`, `'✨ Per Aspera Ad Astra ✨'`. Keys live under `terminal.lock*`.

24. **`src/explorers/terminal/TerminalInput.svelte`** — `:104` placeholder `'wpisz / aby zobaczyć komendy...'` → `$t('terminal.inputPlaceholder')`.

25. **`src/explorers/terminal/TerminalTokenBar.svelte`** — `:43,52` four token-bar literals → `$t('terminal.tokenCopied|tokenCopy|tokenGenerating|tokenRegenerate')`.

#### G. Phase 5 QA + launch (~1 session)

26. Mid-flight swap matrix in dev: typewriter, arcade `playing`, GameScene cinematic, exam mid-question, terminal mid-typing, boot race.
27. Visual fit at 1920×1080, 1366×768, 768×1024 — English runs ~10–15% longer; flag DialogueBar / exam panel / arcade chrome wrap issues.
28. Edge cases: anonymous, authenticated, incognito, localStorage disabled, navigation back to `/explorers`.
29. Optional: add a Vitest static-analysis test that scans `src/explorers/**/*.{ts,svelte}` (excluding `i18n/`, `levels/`, tests) for hardcoded Polish characters — guards against future regressions.
30. Update `projects/edu-platform/CLAUDE.md` constraint list (add localization rule) and `.ai/10x-devs/game/cookbook.md` (new-string workflow + LOCALE_CHANGED re-render policy).

#### H. Commit grouping for the launch (~30 min)

The working tree currently spans 16 modified files + 4 untracked groups. Suggested commits:
1. `feat(explorers/i18n): add locale store + bilingual content type` — `utils/locale.ts`, `i18n/types.ts`, the type-migration files (DialogueTypes, ExamTypes, QuestManager, config/ranks types only)
2. `feat(explorers/i18n): translate dialogues/exams/quests/RANK_FLAVOR to English` — all `levels/m0-*` and `config/ranks.ts` content; `scripts/i18n-migrate-content.ts`
3. `feat(explorers/i18n): wire localized() read paths` — DialogueBar, ExamScene, commandHandler, DialogueManager read-path edits
4. `test(explorers/i18n): add bilingual parity tests` — `i18n/strings.test.ts` parity, `levels/bilingualParity.test.ts`
5. (Then phase A+B+C+D+E+F items above land as further commits — one per area or one bundle, your call.)

## Code References

Locale infrastructure (working-tree, untracked):
- `src/explorers/utils/locale.ts` — Svelte writable + localStorage persistence + getLocale/setLocale/toggleLocale
- `src/explorers/i18n/types.ts` — `BilingualText` + `localized()`
- `src/explorers/i18n/{hud,scene,exam,arcade,terminal,preview,grant}.ts` — UI chrome dictionaries with full English
- `src/explorers/i18n/index.ts` — `t(key, params?)` helper
- `src/explorers/i18n/store.ts` — Svelte derived `t` store

Phase 2 modifications (working-tree, modified):
- `src/explorers/systems/DialogueTypes.ts:3,22` — bilingual content schema
- `src/explorers/systems/ExamTypes.ts:2` — bilingual exam schema
- `src/explorers/systems/QuestManager.ts:9-10` — bilingual quest schema + `localized()` reads
- `src/explorers/systems/DialogueManager.ts:8` — `localized()` reads for effects
- `src/explorers/config/ranks.ts:3,105` — `RANK_FLAVOR` bilingual + `localized()` read
- `src/explorers/ui/DialogueBar.ts:16,113` — `localized()` for `line.text`
- `src/explorers/scenes/ExamScene.ts:9` — `localized()` for exam reads
- `src/explorers/terminal/commandHandler.ts:4` — `localized()` for quest reads
- `src/explorers/levels/m0-{awakening,core-ai,exam-room,crew-room}/dialogues.ts` — 205 dialogue lines, all bilingual
- `src/explorers/levels/m0-{exam-room,core-ai}/quests.ts` — bilingual quest content
- `src/explorers/levels/m0-exam-room/exams.ts` — 45 bilingual exam fields
- `src/explorers/levels/bilingualParity.test.ts` — content parity test
- `src/explorers/i18n/strings.test.ts` — UI chrome parity test
- `scripts/i18n-migrate-content.ts` — codemod (idempotent)

Files that **should be modified per the plans but currently are not**:
- `src/explorers/events/GameEvents.ts` — no `LOCALE_CHANGED`
- `src/explorers/PhaserGame.svelte` — no locale store→bus subscription
- `src/explorers/GameHud.svelte` — no PL/EN toggle button
- `src/explorers/scenes/BaseScene.ts` — no `onLocaleChanged` hook
- `src/explorers/scenes/{GameScene,ArcadeScene,ExamScene,DialogueScene}.ts` — no listener wiring; many inline Polish chrome literals remain
- `src/explorers/arcade/{MemoryMatrixRenderer,OscilloscopeRenderer,AsteroidRangeRenderer}.ts` — no `applyLocale()`, no i18n import, raw Polish (`'Amplituda'`×5, `'STRZELNICA ASTEROIDÓW'`, `'[WASD] celuj   [SPACE] strzelaj'`, `'GOTOWY'`/`LADOWANIE`)
- `src/explorers/ui/InteractionPrompt.ts:16,28` — `'[E] Interakcja'` raw
- `src/explorers/ui/dialogueBarPresentation.ts:24` — `[Spacja] dalej ▸` raw
- `src/explorers/ui/TypewriterEffect.ts` — no deferral logic
- `src/explorers/terminal/commandRegistry.ts` — no `descriptionKey`
- `src/explorers/terminal/supportCommand.ts` — raw Polish
- `src/explorers/SmartTerminal.svelte`, `src/explorers/PreviewOverlay.svelte`, `src/explorers/GrantNotification.svelte`, `src/explorers/terminal/TerminalLockScreen.svelte`, `src/explorers/terminal/TerminalInput.svelte`, `src/explorers/terminal/TerminalTokenBar.svelte` — zero `import { t }` usage anywhere

Verification commands used:
- `rg -n "from ['\"]\\.\\./i18n|from ['\"]\\./i18n|i18n/index|i18n/store" src/explorers/` → only 9 files import i18n; none of them are scenes/UI components/svelte shells (other than for `localized()` content reads).
- `rg -ln "applyLocale|onLocaleChanged|attachLocaleListener|LOCALE_CHANGED|pendingLocaleSwap" src/explorers/` → **zero matches**, confirming the entire runtime locale-switching pipeline is absent.
- `git log --oneline --all -- 'src/explorers/i18n/*' 'src/explorers/utils/locale.ts' 'src/explorers/events/GameEvents.ts'` → no localization-related commit anywhere; nothing has shipped to a branch.

## Architecture Insights

- **The work split is unconventional**: dictionaries were authored top-down before any consumer wires up to them. This is the inverse of the usual "extract one literal at a time as you encounter it." It works only if a coordinated consumer pass follows; otherwise the dictionary code is dead weight.
- **Plan footers are unreliable as truth source.** The `<!-- Phase 3 fully completed 2026-04-28 -->` footer in the parent plan and the "C. Full regression — completed" claim in the remediation plan are both inaccurate vs. working-tree reality. Do not trust plan footers as a substitute for git verification.
- **The split between "content" (`BilingualText` via `localized()`) and "chrome" (`t(key)` via dictionaries)** is sound and already proven in the read paths that exist. Continuing this split for the remaining work avoids re-architecting.
- **`BaseScene.onLocaleChanged()` as a no-op default is a clean extension point** — most scenes won't need anything beyond what `update()` already does (e.g., GameScene's per-frame interaction prompt). Only ExamScene/ArcadeScene/DialogueScene need real overrides.
- **Boot-time correctness** is already in place: scenes that call `localized()` at `create()` synchronously read the persisted locale via `getLocale()`. They do not need `LOCALE_CHANGED` to fire on boot — only on user toggle. This means the missing wiring is purely about *runtime swap*, not first-paint correctness.

## Historical Context (from thoughts/)

- `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md` — original 5-phase plan; Phase 3 footer claim is inaccurate.
- `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl-brief.md` — high-level brief; no phase status claims.
- `thoughts/shared/plans/2026-04-28-explorers-localization-content-remediation.md` — picked up Phase 2 (which had been skipped); it correctly states Phase 2 is now done. Its claim that "Scene extractions + LOCALE_CHANGED wiring in ExamScene, ArcadeScene, GameScene, DialogueScene" was already done is **not accurate** — none of those wirings exist in the working tree.

## Related Research

None directly. The original plan references a research doc at `thoughts/shared/research/2026-04-27-explorers-localization-en-pl.md` but that file is not present in the working tree.

## Open Questions

1. **Was Phase 3 attempted in a different branch and lost?** `git log --all` shows no localization-related commits anywhere. Either Phase 3 was never executed, or it was executed and the work was not committed before being lost.
2. **`scripts/i18n-migrate-content.ts` retention**: the original plan said the codemod gets removed after Phase 4 ships. Decide whether to keep it (cheap insurance for later content additions) or honor the original cleanup intent.
3. **Static-analysis Polish-character test**: optional Phase 5 deliverable. Worth investing 30 min for the regression guard; or skip and rely on the parity tests + manual QA.
4. **Mobile aria-labels** (`MobileControls.svelte`): out of scope for v1 per plan. Reconfirm before launch or defer to follow-up.

## Suggested resume command

```
/10x-implement @thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md phase 3
```

Resume points (in order, mapped to sections above): A → B → C → D → E → F → G → H. The first session of work should land items 1–4 (bus event, store→bus, HUD button, BaseScene hook) and gate manual confirmation that the toggle persists and emits before continuing into the larger extraction passes.
