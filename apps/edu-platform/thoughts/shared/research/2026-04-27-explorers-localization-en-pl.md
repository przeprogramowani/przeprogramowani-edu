---
date: 2026-04-27
researcher: psmyrdek
git_commit: fbbf8bb83b731ed78cd5c33132d589de1c152750
branch: master
repository: przeprogramowani-sites
topic: "Localization (en/pl) of Space Explorers — runtime language toggle in GameHud.svelte"
tags: [research, codebase, explorers, i18n, localization, game-hud, dialogue, terminal]
status: complete
last_updated: 2026-04-27
last_updated_by: psmyrdek
---

# Research: Localization (en/pl) of Space Explorers

**Date**: 2026-04-27
**Researcher**: psmyrdek
**Git Commit**: fbbf8bb83b731ed78cd5c33132d589de1c152750
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Add a runtime language toggle (en / pl) to the Space Explorers game, surfaced in `src/explorers/GameHud.svelte`. Audit every Polish surface that would need to be localized (HUD chrome, dialogues & narrative content, static assets) and propose an architecture that fits the existing Phaser↔Svelte bridge.

## Summary

- **Volume**: ~10,000 words of player-facing Polish text across ~30 source files. Split roughly 50/50 between dialogue/narrative (`levels/m0-*/`, `~5,000 words`) and the rest (terminal, exam, arcade, HUD, ranks, quests, scene labels).
- **No existing i18n**: zero translation framework, zero locale store, no `navigator.language` detection in `src/explorers/`. The only `pl|en` flag in the wider codebase is for prework content URL routing (`src/server/urlValidation.ts:38`) — unrelated to UI.
- **Static assets are clean**: no Polish text is baked into images, sprites, tilemaps, or audio. Tilemaps store numeric ids only, sprites/audio are referenced by English keys, fonts are the standard JetBrains Mono / Fira Code stack which already supports Polish diacritics. Localization is a pure-text refactor with no asset rework.
- **Two strong storage seams**:
  1. **Already key-addressed** (easy): dialogues (id-keyed `Map<string, DialogueSequence>` via `levelLoader.ts:74-95`), exams (`exams.ts` keyed by `id`), quests (`QuestDefinition.id`), arcade games, command registry (`commandRegistry.ts:11-19`), rank flavor text (`config/ranks.ts:80-87`).
  2. **Hard-coded literals** (needs key extraction): scene UI labels in `ExamScene.ts`, `ArcadeScene.ts`, `GameScene.ts` cinematic, `DialogueBar.ts`, `InteractionPrompt.ts`, arcade renderers, terminal command output strings inline in `commandHandler.ts`.
- **Recommended architecture**: locale lives as a **Svelte writable store** mirrored to Phaser via a new `GameEvents.LOCALE_CHANGED` event — matching the existing `isTouchMode` pattern (`utils/touchDetection.ts:17`) and the established 28-event bus playbook (`events/GameEvents.ts`). Persistence: `localStorage` for everyone (anon-friendly), plus an opt-in mirror to the user's `profiles` row (or a new field on `GameState`) for cross-device continuity. Default is `'pl'`; optional `navigator.language` detection on first boot.
- **Mid-flight switching risk**: panel-style scenes (Exam, Arcade non-playing, GameScene end-screen) reuse their existing `clearUI()` rebuild path safely. Long-lived UI (DialogueBar, InteractionPrompt, MemoryMatrixRenderer) needs `setText` on retained references. Three risky hot zones — typewriter mid-line, arcade `playing` phase, and cinematic intro tweens — should defer the swap to the next clean boundary.

## Detailed Findings

### Surface 1 — Svelte HUD & UI chrome

All player-visible Polish strings in Svelte/Astro shells. None are routed through any translation helper today.

| File | Notable Polish strings | Lines |
|---|---|---|
| `src/explorers/GameHud.svelte` | `Powrót do platformy`, `Logowanie`, `Włącz dźwięk`/`Wycisz`, `Zaloguj się, aby zapisać postęp` | `181, 235, 154, 245, 277, 323` |
| `src/explorers/SmartTerminal.svelte` | Support flow: `Wymagana aktywna sesja`, `Łączenie z Centrum Wsparcia...`, `BŁĄD połączenia`, terminal hints `[↑↓] wybierz komendę` | `108-112, 116, 131, 186-187, 268-270` |
| `src/explorers/MobileControls.svelte` | aria-labels only: `Góra`, `Dół`, `Lewo`, `Prawo`, `Interakcja`, `Spacja`, `Enter`, `Anuluj` | `40-101` |
| `src/explorers/PreviewOverlay.svelte` | Default title `Notatki z podróży` | `12, 16` |
| `src/explorers/GrantNotification.svelte` | `Misja zaliczona!`, `+{totalXp} XP łącznie` | `69, 86` |
| `src/explorers/terminal/TerminalLockScreen.svelte` | `Witaj, Dexo!`, `Blokada aktywna.`, `Podaj kod odblokowujący:`, `Nieprawidłowy kod.` | `20, 35-38` |
| `src/explorers/terminal/TerminalInput.svelte` | placeholder `wpisz / aby zobaczyć komendy...` | `104` |
| `src/explorers/terminal/TerminalTokenBar.svelte` | `Skopiowano ✓`/`Kopiuj token`, `Generowanie...`/`Regeneruj token` | `43, 52` |
| `src/explorers/QaOverlay.svelte` | `WŁ`/`WYŁ` (QA-only) | `419` |

Layout duplication: `GameHud.svelte` stores the home button copy twice (desktop + mobile drawer at `:181, :277`). Rendering: all are static template literals; conditional pairs flip on local `let` bindings. There is **no `lang=`** attribute anywhere except `GameLayout.astro:6` which sets `lang='en'` on the document.

### Surface 2 — Phaser scene text rendering

The game uses **only** `Phaser.GameObjects.Text` (the standard `this.add.text(...)`). No bitmap text, no Rex/BBCode, no `add.dom`. Counts of `this.add.text(` per file:

| File | Calls |
|---|---|
| `src/explorers/scenes/ExamScene.ts` | 18 |
| `src/explorers/scenes/ArcadeScene.ts` | 16 |
| `src/explorers/scenes/GameScene.ts` | 4 |
| `src/explorers/scenes/PreloaderScene.ts` | 2 |
| `src/explorers/ui/DialogueBar.ts` | 3 |
| `src/explorers/ui/InteractionPrompt.ts` | 1 |
| `src/explorers/arcade/AsteroidRangeRenderer.ts` | 3 |
| `src/explorers/arcade/MemoryMatrixRenderer.ts` | 2 |
| `src/explorers/arcade/OscilloscopeRenderer.ts` | 3 |

Three update patterns coexist:

1. **Retained reference + `setText`** — used for HUD-style live counters: `ArcadeScene` keeps `scoreText`/`timerText` (`:28-29`, mutated `:60, :369-371`); `DialogueBar` keeps `speakerText`/`bodyText`/`hintText` (`:21-23`); `InteractionPrompt.label` (`:34`); `MemoryMatrixRenderer.headerText`/`hintText` (`:252, :259, :287`). These are easy to retranslate via a `setText` on locale change.
2. **Full re-render on every state change** — `ExamScene` uses a `uiObjects[]` array and `clearUI()` to destroy everything, then `renderQuestion()` rebuilds the whole panel (`:99-104, :117, :469`). Same idea in `ArcadeScene.clearUI()` (`:637-642`, called from `:110, :232, :286, :512`). Onresize already routes here (`ExamScene.ts:47-54`), so a locale handler reuses the same path for free.
3. **Emit event → Svelte HUD reactively re-renders** — chrome-only, via `XP_GAINED`/`STATE_CHANGED`/`RANK_UP`/`SCENE_ENTERED` (`GameHud.svelte:113-116`).

### Surface 3 — Cross-scene event bus & registry

- The bus is `game.events`, exposed as `BaseScene.bus` (`scenes/BaseScene.ts:14-16`). The Svelte HUD uses the same emitter (`GameHud.svelte:113-123`).
- `GameEvents` enum lives at `events/GameEvents.ts:5-60` (28 names). Most-used: `STATE_CHANGED` (22 refs), `DIALOGUE_SHOW` (15), `XP_GAINED` (11), `QUEST_COMPLETED` (9), `DIALOGUE_DISMISSED` (9), `TERMINAL_FOCUS_CHANGED` (8), `PREVIEW_SHOW` (8), `RANK_UP` (6).
- `game.registry` keys in use: `'demoGameState'` (the GameState; written by `BaseScene.ts:36`, `flagManager.ts:19/32`, `BookmarkManager.ts:28`, `DialogueManager.ts:120`, `PhaserGame.svelte:169`), `'systemFlags'` (read-only, `BootScene.ts:54`), `'questManager'` (`PhaserGame.svelte:232`), `'skipSave'` (QA, `QaOverlay.svelte:180`).
- **Phaser `DataManager` `changedata` events are NOT used anywhere** (grep returns 0). The discipline is: write registry → emit `STATE_CHANGED`. Adding a new notification channel for locale would deviate from this convention.

### Surface 4 — Dialogue & narrative content (~5,000 words)

All dialogue is **already key-addressed** through `levelLoader.ts:74-95`, which normalizes per-level dialogue exports into a `Map<string, DialogueSequence>` consumed by `DialogueManager.loadAllDialogues()` (`systems/DialogueManager.ts:22-28`). Sources:

| File | Sequences | Approx. word count |
|---|---|---|
| `src/explorers/levels/m0-awakening/dialogues.ts` | 7 (`m0-awakening-intro`, `m0-pod-examine`, `m0-loot-terminal-open`, `m0-info-board`, `m0-npc-moreau`, `first-contact`, ...) | ~800 |
| `src/explorers/levels/m0-core-ai/dialogues.ts` | 12 (`m0-core-ai-intro`, `m0-firmware-upgrade`, `m0-core-ai-malfunction`, `m0-support-manual-read`, `m0-earth-signal-complete`, ...) | ~2,200 |
| `src/explorers/levels/m0-exam-room/dialogues.ts` | 11 (`m0-study-notes-board`, `m0-exam-*-done` ×3, `npc-officer-harris`, `q-pass-exams-done`, ...) | ~1,100 |
| `src/explorers/levels/m0-crew-room/dialogues.ts` | 12 (`m0-board-eng/ofc/nav`, `npc-floobert`, `m0-whiteboard`, ...) | ~900 |

Each `DialogueSequence` has `id` + `lines[].{ speaker, text, mode }` — `text` is the localizable field. NPC names (`inżynier Moreau`, `oficer Harris`) embed the role title in Polish; in English they would become `Engineer Moreau` / `Officer Harris`.

### Surface 5 — Exams (~1,500 words)

`src/explorers/levels/m0-exam-room/exams.ts:4-140` — three exams (`Systemy agentowe`, `Procedury operacyjne`, `Context Engineering`), each with 3 questions × 4 options. ExamDefinition has `id`, `title`, `description`, `questions[].text`, `options[].text`, all localizable, none keyed by text. Selection state in `ExamScene` is keyed by `question.id` (not by text), so a mid-exam locale flip would **not** lose answers — but it would force a `clearUI()` + `renderQuestion()` rebuild (`ExamScene.ts:469`).

Inline UI labels in `ExamScene.ts` (need extraction): `:191 EGZAMIN: ${title}`, `:228` question text, `:242 Wybierz wszystkie pasujące:`, `:349 Zamknij`, `:378 ← Poprzednie`, `:397 Następne →`/`Zakończ egzamin`, `:519 EGZAMIN ZALICZONY`/`EGZAMIN NIEZALICZONY`, `:536 ${score}/${total} poprawnych odpowiedzi`, `:548 Wymagane: ...`, `:622 Zamknij [Enter]`, `:655 Spróbuj ponownie`.

### Surface 6 — Terminal output (~2,600 words)

Two layers, very different ergonomics:

- `src/explorers/terminal/commandRegistry.ts:11-19` — clean key-addressed table of `{ name, description }`. Localization is a one-line swap.
- `src/explorers/terminal/commandHandler.ts:1-400+` — **hundreds of inline Polish literals** in switch branches: `/help` headers, `/me` profile lines (`PROFIL ASTRONAUTY`, `Ranga:`, `Poziom:`, `XP:`, `Osiągnięto najwyższą rangę!`), `/time` chronometer (`CHRONOMETR POKŁADOWY`, `Strefa: UTC+0 (pokładowy)`), `/quest` runtime briefings (`Brak aktywnej misji. Zbadaj statek.`, `Cele (${totalCount}):`, `Postęp: ${doneCount}/${totalCount}`), `/solve` results (`Odpowiedź poprawna! Weryfikacja zakończona.`, `Nieprawidłowa odpowiedź. Spróbuj ponownie.`), `/hint` (`💡 Wskazówka: ${hint}`), `/bookmarks`, `/navi`. Plus `terminal/supportCommand.ts:21,37,50,63` for `/support` flow.
- Historical transcript: previously emitted lines are immutable log entries in `SmartTerminal.svelte` blocks. Don't retro-translate — only translate new prompts/output.

### Surface 7 — Arcade mini-games

`src/explorers/scenes/ArcadeScene.ts` outer chrome: `:125-134` title, `:138-148` description, `:154-162 Poziom: ${stars}`, `:188 [Enter] Start`, `:210 [ESC] Wyjdź`, `:246-255` countdown, `:325` panel title, `:339 WYNIK: 0`, `:352 CZAS: ...`, `:391 [ESC] Wyjdź`, `:525` result title, `:541` Wynik, `:552` resolution. Renderer-internal:

- `src/explorers/arcade/MemoryMatrixRenderer.ts:252,259,287,392,396,415-416` — `SYGNAŁ Z GŁĘBOKIEGO KOSMOSU — Runda ${cur}/${total}`, `Zapamiętaj wzór...`, `[WSAD] poruszaj  [SPACE] zaznacz  [ENTER] zatwierdź`, `Poprawnie! +${correct} punktów`, `Błąd! ${correct}/${total} poprawnych`, `TRANSMISJA ZAKOŃCZONA`.
- `src/explorers/arcade/OscilloscopeRenderer.ts:28-70,258,392,542` — parameter labels (`Amplituda`, `Częstotl.`, `Faza`, `Przesunięcie`), control hint, `Zatwierdzone! [Enter] zakończ`, `Dopasowanie: ???`/`Dopasowanie: ${pct}%`.
- `src/explorers/arcade/AsteroidRangeRenderer.ts:131-160,383` — `STRZELNICA ASTEROIDÓW`, status `SEKTOR B-12 | CELE ... | MINERAŁY ... | LASER ...`, `ŁADOWANIE ${ms}ms`/`GOTOWY`, `[WASD] celuj   [SPACE] strzelaj`.

### Surface 8 — Quests, ranks, GameScene cinematic

- Quests: `src/explorers/levels/m0-exam-room/quests.ts:4-42` (`q-pass-exams` — title `Zdaj egzaminy weryfikacyjne`, briefing, 3 hints, 3 objective labels) and `src/explorers/levels/m0-core-ai/quests.ts:4-24` (`q-earth-signal` — title `Sygnał z Ziemi`, briefing ~60 words, 3 hints). All key-addressed by `id`.
- Ranks: `src/explorers/config/ranks.ts:11-17` rank `name` fields are **English** (`Space Adept`, `Moon Engineer`, ...) — leave as-is. The `RANK_FLAVOR` block at `:80-87` is Polish narrative (`Systemy pokładowe rozpoznają twoje kompetencje...`, `Twoje umiejętności inżynieryjne robią wrażenie.`, ...) and feeds the rank-up dialogue auto-generation at `:93-113`.
- GameScene cinematic: `src/explorers/scenes/GameScene.ts:608-617` title, `:619-629` subtitle, `:706-737` end-screen (`został zapisany.`, `Gdy etap Prework się odblokuje...`, `Dołącz do 10xDevs 3.0...`, `Księżyc 1: 18 maj 2026`, `Dowiedz się więcej →`). Per-frame interaction labels at `:418-422`. Tween-driven; locale flips during animation should be ignored until `introPlaying` clears.
- Asset manifest, scene/map ids, NPC ids — all English keys, **no localization needed**.

### Surface 9 — Static assets

Confirmed clean.

- **Images / sprites / tilemaps**: `public/game/sprites/`, `public/game/tilesets/`, `public/game/headers/` — no text baked into image assets. Tilemaps in `maps/m0-*.json` store numeric tile indices and object ids only. Asset manifest (`src/explorers/assets/AssetManifest.ts`) uses English code-safe keys.
- **Fonts**: standard CSS stack (JetBrains Mono, Fira Code) — full Polish diacritic coverage, no custom bitmap fonts to regenerate.
- **Audio**: `public/game/audio/music/` (instrumental loops) and `public/game/audio/sfx/` (effects) — all music and sound effects, no voiceover or TTS. File names are English keys (`arcade-action.ogg`, `bg-exploration.ogg`, `dialogue-blip.ogg`).
- **Generated assets**: `npm run generate:assets` is a placeholder PNG generator (no text-rendering pipeline that needs per-locale variants).
- **Marketing surfaces** (parallel to localization but not strictly in-game): `CourseList.astro` carries the Space Explorers card description in Polish; `/explorers/badges/rank.astro` has the share template `Hej! Właśnie zdobyłem rangę {name} w Space Explorers — zagraj ze mną!`. These would need parallel English copy if the toggle is meant to flow outside the canvas.

### Surface 10 — State, persistence, anonymous vs authenticated

- `GameState` shape (`src/explorers/state/types.ts:6-21`): `version: 2`, `flags`, `currentMap`, `position`, `facing`, `quests`, `hintIndex`, `xp`, `commandHistory`, `bookmarks`. `version: 2` is a literal type — bumping it requires a migrator at `state/GameStateManager.ts:30`.
- Mutation pattern (immutable spread + `registry.set('demoGameState', next)` + emit `STATE_CHANGED`): Svelte side at `PhaserGame.svelte:165-171`, Phaser side at `BaseScene.ts:32-40`.
- localStorage: keyed `space-explorers-state-v2` (`config/constants.ts:67`), written on every `STATE_CHANGED` (`state/GamePersistence.ts:26-35`). Mute uses a separate key in `audio/AudioManager.ts:88,297`.
- KV: `GAME_STATE` namespace, written via `PUT /api/game/state` (`pages/api/game/state.ts:92-137`) → `serverGameStateManager.saveGameState` (`server/game/serverGameStateManager.ts:65-71`). Reads from KV at `:9-14`.
- Supabase: `public.game_state` (`supabase/migrations/20260303000000_initial_schema.sql:23-28`) is **fire-and-forget backup** — written after KV (`serverGameStateManager.ts:74-82`), never read on boot.
- Save cadence (`PhaserGame.svelte:284-291`): every `STATE_CHANGED` → localStorage immediately + debounced 5s server PUT; milestone events (`QUEST_COMPLETED`, `FLAG_SET`, `EXAM_COMPLETED`, `RANK_UP`) → microtask flush; `beforeunload` → `keepalive` PUT.
- **Anon path**: localStorage only. `GamePersistence` constructor takes `authenticated: !!userEmail` and gates every server call. The endpoint also rejects anon (`pages/api/game/state.ts:45-50, 94-99`). Only telemetry exists for anon (`trackAnonymousGameStart` cookie, `pages/explorers.astro:23-29`).
- Boot resolution order (`scenes/BootScene.ts:43-48`): `getPreloadedState() ?? loadState() ?? createDefaultState()` — server-merged → localStorage → fresh defaults. Anonymous skips the first leg.
- **No existing locale infra in the explorers tree**. The wider codebase has a `language: 'pl' | 'en'` flag for prework content URL routing (`src/server/urlValidation.ts:38,43,51,56`, `src/content.config.ts:11`, `src/server/content/htmlLessonLoader.ts:9,49-52`), but it is **content metadata**, not user UI locale, and is unrelated to the game.

## Code References

- `src/explorers/GameHud.svelte:113-123` — Svelte HUD's `game.events.on/off` lifecycle: the natural seam to add `LOCALE_CHANGED` handling.
- `src/explorers/utils/touchDetection.ts:17` — `writable<boolean>` precedent for a cross-cutting Svelte store; mirror this for `locale`.
- `src/explorers/audio/AudioManager.ts:88, 297` — `localStorage` mute pref pattern; mirror this for anon locale persistence.
- `src/explorers/events/GameEvents.ts:5-60` — enum to extend with `LOCALE_CHANGED`.
- `src/explorers/state/types.ts:6-21` — `GameState` shape; candidate location for `locale` field if persisting through KV+Supabase.
- `src/explorers/state/GameStateManager.ts:25-47` — version migrator hook; would need to default missing `locale` to `'pl'` for v2 saves.
- `src/explorers/state/GameStateManager.ts:118-148` — `mergeServerProgressIntoLocal`; decide whether server's locale wins (recommended: yes, it's the user's last explicit choice across devices).
- `src/pages/api/game/state.ts:13-34` — `isValidGameState` validator; extend if `locale` rides `GameState`.
- `src/explorers/scenes/BaseScene.ts:14-16, 19-21, 32-40` — bus and `gameState` access for scenes; locale flows via `STATE_CHANGED` already.
- `src/explorers/levels/levelLoader.ts:74-95` — central `Map<string, DialogueSequence>` builder; ideal place to host a locale-keyed dialogue manifest.
- `src/explorers/systems/DialogueManager.ts:22-28` — consumes the dialogue map; adding a `locale` parameter on lookup is a small change.
- `src/explorers/terminal/commandRegistry.ts:11-19` — clean key-addressed command table; localize via a `descriptions[locale][name]` lookup.
- `src/explorers/terminal/commandHandler.ts` — bulk of inline Polish literals; the highest-effort extraction in the project.
- `src/explorers/scenes/ExamScene.ts:47-54, 469` — onResize already triggers panel re-render; locale handler reuses the same path.
- `src/explorers/scenes/ArcadeScene.ts:637-642` — `clearUI()`/rebuild path; safe for non-`playing` phases.
- `src/explorers/ui/DialogueBar.ts:21-23, 50, 120-121, 180-184` — retained text refs + `[Spacja] dalej ▸` hardcoded fallback.
- `src/explorers/ui/InteractionPrompt.ts:16, 28, 34` — `[E] Interakcja` default + diff-only `setText`.

## Architecture Insights

- **Bus discipline**: every state mutation pairs `registry.set('demoGameState', next)` with `bus.emit(GameEvents.STATE_CHANGED, ...)`. Adding `LOCALE_CHANGED` follows the same playbook — there are 28 events in the enum already, one more is idiomatic. Phaser's built-in `DataManager.changedata-<key>` events are unused in this codebase; introducing them just for locale would create a second notification convention.
- **Svelte store as the front door**: the codebase uses module-level singletons (`audioManager`) and one writable store (`isTouchMode`). Locale fits the `isTouchMode` shape exactly — a tiny `writable<'pl'|'en'>` in `utils/locale.ts` consumed reactively by HUD/SmartTerminal/PreviewOverlay, plus a one-line subscription that re-emits to `game.events`. Phaser scenes never need to know the store exists; they consume `LOCALE_CHANGED`.
- **Key-keyed content is already 60% of the volume**: dialogues, exams, quests, arcade definitions, command registry, rank flavor, scene/map names. These can be localized by adding a parallel `pl` / `en` map (or by colocating `text_pl` / `text_en` on each line) — no rendering changes required, only data shape.
- **The remaining 40%** lives as inline Polish literals in scene-rendering code (`ExamScene` UI labels, `ArcadeScene` chrome, `commandHandler.ts` output, `MemoryMatrixRenderer` headers). Extract to a single typed dictionary (e.g. `src/explorers/i18n/strings.ts` with `Record<Locale, Record<Key, string>>`) and replace each literal with `t(key, params)`.
- **Re-render seams already exist**: `ExamScene` and `ArcadeScene` rebuild on resize via `clearUI()`; reuse that path for locale flips. `DialogueBar`, `InteractionPrompt`, and `MemoryMatrixRenderer.headerText` retain references and need only `setText` calls. Three risky zones — `TypewriterEffect.start()` mid-line (`ui/TypewriterEffect.ts:33-44`), `ArcadeScene` `playing` phase, `GameScene` cinematic intro tweens — should defer the swap to the next clean boundary (next dialogue line / next round / after `introPlaying` clears).
- **Persistence story for an anon-friendly toggle**: `localStorage` covers everyone, including anon. For authenticated users wanting cross-device continuity, two viable options:
  1. **Add `locale` to `GameState`** — bumps `version` to 3, rides the existing KV+Supabase pipeline for free, no new endpoint, no schema migration.
  2. **Add a `locale` column to `profiles`** — cleaner conceptually (locale is identity-level, not run-level), survives `/api/game/state` DELETE, but requires a Supabase migration and a new endpoint (or piggyback on login sync).

  Given how cheap option 1 is and how aggressively the existing pipeline already debounces+flushes, option 1 is the pragmatic default; option 2 is the right move if the toggle ever needs to inform server-rendered surfaces (emails, `/courses` cards, badge share OG image).

## Recommended approach

**Architecture (5 changes, in order)**:

1. `src/explorers/utils/locale.ts` — new file. `export const locale = writable<'pl' | 'en'>(loadInitialLocale())`. `loadInitialLocale` reads `localStorage` → falls back to `navigator.language.startsWith('pl') ? 'pl' : 'en'` → falls back to `'pl'`. Subscribe and persist to `localStorage` on every change.
2. `src/explorers/events/GameEvents.ts` — add `LOCALE_CHANGED = 'locale-changed'` (and a payload type `{ locale: 'pl' | 'en' }`).
3. `src/explorers/PhaserGame.svelte` — subscribe to the `locale` store and call `game.events.emit(GameEvents.LOCALE_CHANGED, { locale })` on change. If persisting authenticated users via `GameState`, also call the existing `updateGameState({ locale })` and `persistence.persistMilestone()` so it rides the milestone-flush path (avoids the 5s debounce lag).
4. `src/explorers/i18n/strings.ts` — typed dictionary `Record<Locale, Record<StringKey, string>>` plus `t(key, params?)` helper. Migrate scene-rendering literals (highest priority: `ExamScene`, `ArcadeScene`, `commandHandler`, `DialogueBar`, `InteractionPrompt`, arcade renderers, `GameScene` cinematic).
5. **Per-level dialogue localization** — extend `levels/m0-*/dialogues.ts` with `text_en` (or split into per-locale files) and update `levels/levelLoader.ts:74-95` + `systems/DialogueManager.ts:22-28` to pick lines by current locale.

**HUD toggle**: add a button to `GameHud.svelte` adjacent to the mute button (desktop `:238-255`, mobile right cluster `:165-176`). Click flips the `locale` store. Use the same focus-stealing-prevention pattern (`preventHudFocusSteal` + `blurHudButton`).

**Re-render policy**:
- Scenes that already rebuild on resize: just hook `LOCALE_CHANGED` to the same path (`ExamScene.ts:47-54`, `ArcadeScene.ts:637-642`).
- Scenes with retained refs: implement `applyLocale()` that calls `setText` on cached objects (`DialogueBar`, `InteractionPrompt`, `MemoryMatrixRenderer`).
- Risky zones: subscribe but **defer** until next boundary — don't tear typewriter mid-reveal, don't reset arcade `playing`, don't rerun cinematic tweens.

**Default locale**: `'pl'` to preserve current behavior. Optional `navigator.language` detection only on first boot when no localStorage and no preloaded state exist (so returning players keep their last choice). No prompt — toggle is enough.

**Effort estimate**: ~40–60 hours including translation. Pure-text refactor — no asset rework, no font work, no migration if option 1 (state-resident locale) is chosen, one Supabase migration if option 2 is chosen.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-02-19-game-level-framework.md` — establishes the level loader pattern (`levels/levelLoader.ts`) and per-level data files (dialogues/quests/exams) that are now the i18n-friendly surface.
- `thoughts/shared/research/2026-02-22-xp-level-rank-progression.md` — context on `RANKS[]` + `RANK_FLAVOR` design that informs why rank names stay English while flavor text is Polish.
- `thoughts/shared/research/2026-03-02-game-state-user-integration.md` — the KV+Supabase persistence story used here as the basis for the "locale rides GameState" recommendation.
- `thoughts/shared/research/2026-03-04-npc-system-design.md` — NPC dialogue conventions (DialogueScene + DialogueManager) that define how a localized line is selected and rendered.
- `thoughts/shared/research/2026-03-05-cinematic-intros-bugs.md` — context on `introPlaying` and tween fragility that motivates the "defer locale swap during cinematics" rule.

## Related Research

- `thoughts/shared/research/2026-02-22-external-10xdevs2-sidebar-ordering.md` — adjacent surface where `language: 'pl' | 'en'` is used as content metadata (URL routing) for prework, but unrelated to runtime UI locale.

## Open Questions

1. **Scope of the toggle**: should it also affect non-canvas surfaces (the `/courses` Space Explorers card description in `CourseList.astro`, the badge-share OG template at `/explorers/badges/rank.astro`)? If yes, persistence option 2 (locale on `profiles`) becomes more attractive because the value is needed at SSR time.
2. **Translation owner**: ~10,000 words including narrative — is this an in-house translation, an LLM-assisted draft + human review, or community/external? Affects timeline more than architecture.
3. **`Dexo` vs other character names**: keep proper nouns or transliterate? The `Witaj, Dexo!` lockscreen and NPC names (`Floobert`, `Moreau`, `Harris`) feel safe to keep; `inżynier` / `oficer` titles need localized variants.
4. **Already-emitted terminal lines**: confirmed not retro-translated (immutable transcript). Confirm UX is acceptable — players who flip mid-session will see a mixed transcript until commands rerun.
5. **Tier-1 launch scope**: is the goal to ship the toggle + HUD chrome + terminal commands first, with dialogue/exam translation following in a v2? The architecture supports incremental rollout — the `t(key)` helper can fall through to Polish for unknown keys.
6. **Rank names**: stay English (current design intent) or localize for consistency? Currently `Space Adept` etc. read as in-fiction English regardless of UI locale; arguably a feature.
