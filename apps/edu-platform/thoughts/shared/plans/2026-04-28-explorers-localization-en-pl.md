# Space Explorers Localization (en/pl) Implementation Plan

## Overview

Add a runtime `pl/en` language toggle to Space Explorers, surfaced in `src/explorers/GameHud.svelte`. The toggle persists to localStorage only, defaults to `pl`, and flips the entire game canvas + adjacent Svelte shells (HUD, terminal, preview overlay, grant notifications, lock screen). Mid-flight swaps apply instantly except in three risky zones (typewriter mid-line, arcade `playing` phase, GameScene cinematic intro), which defer to the next clean boundary. Single big-bang release — no partial English in production.

## Current State Analysis

- ~10,000 words of player-facing Polish text across ~30 source files in `src/explorers/`. Roughly 60% lives in already key-addressed content (dialogues, exams, quests, arcade definitions, command registry, rank flavor); 40% lives as inline Polish literals in scene-rendering code.
- Zero existing i18n infrastructure in the explorers tree. The `pl|en` flag at `src/server/urlValidation.ts:38` is content-routing metadata for prework, unrelated to UI locale.
- Static assets are clean: tilemaps store numeric ids, sprites/audio use English keys, fonts cover Polish diacritics. No asset rework.
- The Svelte ↔ Phaser bridge already has a precedent for cross-cutting state: `isTouchMode` writable store at `src/explorers/utils/touchDetection.ts:17`. The event bus `game.events` carries 28 events at `src/explorers/events/GameEvents.ts:5-60` with the established pattern of `registry.set + bus.emit(STATE_CHANGED)`.
- Two re-render seams already exist: `ExamScene.ts:47-54, 469` and `ArcadeScene.ts:637-642` rebuild on resize via `clearUI()` — locale handler reuses these for free. Long-lived UI (`DialogueBar`, `InteractionPrompt`, `MemoryMatrixRenderer`) holds retained text refs that need only `setText` calls.
- AudioManager mute uses a separate localStorage key (`audio/AudioManager.ts:88`), establishing a precedent for non-`GameState`-resident preferences.

## Desired End State

After this plan completes:

1. A button in `GameHud.svelte` (next to the mute control on desktop, in the mobile drawer cluster) flips the game's UI between `pl` and `en` instantly.
2. Every player-facing surface inside the explorers scope renders in the active locale: HUD chrome, terminal output, dialogues, exams, arcade chrome and renderers, GameScene cinematic, preview overlay, grant notifications, terminal lock screen.
3. The choice persists to `localStorage` (`space-explorers-locale`) and is restored on next visit. Anonymous and authenticated users behave identically.
4. Mid-flight swaps cleanly re-render scenes that already rebuild on resize; retain-ref scenes update via `setText`; risky zones defer to the next clean boundary (next dialogue line, next arcade round, after `introPlaying` clears).
5. Vitest tests guarantee that every locale dictionary has the same key set as its counterpart and that bilingual content fields (`text: { pl, en }`) are non-empty for both locales.
6. Default first-boot locale is `pl`. No marketing surfaces (`/courses` Space Explorers card, badge OG share, study-notes page) are touched.

### Key Discoveries:

- `src/explorers/utils/touchDetection.ts:17` — Svelte `writable` precedent for cross-cutting client state. Mirror exactly for `locale`.
- `src/explorers/audio/AudioManager.ts:88` — localStorage preference precedent for a non-`GameState`-resident toggle.
- `src/explorers/events/GameEvents.ts:5-60` — extension point for a new `LOCALE_CHANGED` event; matches the established 28-event playbook.
- `src/explorers/levels/levelLoader.ts:74-95` — central `Map<string, DialogueSequence>` builder; bilingual content lands here without changing the registry shape.
- `src/explorers/systems/DialogueTypes.ts:6-11` — `DialogueLine.text: string` is the type-level seam for the per-line bilingual migration. Same pattern at `src/explorers/systems/ExamTypes.ts:20-38`.
- `src/explorers/scenes/ExamScene.ts:47-54, 469` — onResize already triggers `clearUI()` + `renderQuestion()`; the locale handler reuses this exact path.
- `src/explorers/scenes/ArcadeScene.ts:637-642` — `clearUI()` is safe outside the `playing` phase; deferral logic gates the `playing` case.
- `src/explorers/ui/DialogueBar.ts:21-23, 50, 120-121, 180-184` — retains `speakerText`/`bodyText`/`hintText`; needs `applyLocale()` that calls `setText`. Hardcoded `[Spacja] dalej ▸` at `:180-184` must be extracted.
- `src/explorers/ui/TypewriterEffect.ts:33-44` — typewriter advances character-by-character; mid-flight swap must complete the current line before re-rendering.
- `src/explorers/scenes/GameScene.ts:608-617, 619-629, 706-737` — cinematic intro tweens; `introPlaying` flag already exists and gates other behaviors. Reuse for locale deferral.
- `src/explorers/terminal/commandHandler.ts` — hundreds of inline Polish literals across switch branches. The single largest extraction surface; key naming will namespace by command (`terminal.help.*`, `terminal.me.*`, `terminal.quest.*`).
- `src/explorers/config/ranks.ts:11-17, 80-87, 93-113` — rank `name` fields stay English by design; `RANK_FLAVOR` block localizes; `buildRankUpDialogues()` at `:93-113` consumes flavor by current locale.
- `src/explorers/levels/levelLoader.ts:7, 146-154` — `buildRankUpDialogues()` is invoked during boot; bilingual `RANK_FLAVOR` flows through the existing registration without further plumbing.

## What We're NOT Doing

- **No marketing/SSR-rendered surfaces**: `CourseList.astro` Space Explorers card description, `/explorers/badges/rank.astro` OG template, `/explorers/resources/m0-study-notes` lesson page stay Polish-only. A Polish marketing context flowing into an English-locale game session is acceptable — the toggle is post-launch, not pre-launch.
- **No `GameState` schema bump (v2 → v3)**: locale is not added to `GameState`. No `isValidGameState` change at `src/pages/api/game/state.ts:13-34`. No `mergeServerProgressIntoLocal` change at `src/explorers/state/GameStateManager.ts:118-148`. No KV/Supabase migration.
- **No `profiles.locale` column**: no Supabase migration, no `/api/user/locale` endpoint, no SSR locale resolution.
- **No `navigator.language` detection**: first boot defaults to `pl`. English-locale browsers see Polish until the player explicitly toggles.
- **No first-boot prompt or banner**: HUD button is the sole discovery surface.
- **No `t(key)` Polish fallback in production behavior**: the helper falls back at runtime for safety, but the parity test treats a missing `en` key as a failing build. Big-bang launch ships only when all keys/fields are populated in both locales.
- **No transcript translation**: terminal lines already printed before a locale swap stay frozen in their original locale; only future output uses the new locale.
- **No localization of rank name fields**: `Space Adept`, `Moon Engineer`, etc. at `src/explorers/config/ranks.ts:11-17` stay English in both locales by design intent.
- **No localization of character proper nouns**: `Floobert`, `Moreau`, `Harris`, `Dexo` stay as written. Only the role titles (`inżynier` → `Engineer`, `oficer` → `Officer`) translate.
- **No new logging infrastructure**: existing `devLog` covers locale-store updates; production-grade telemetry on locale usage is out of scope.
- **No QA overlay translation**: `QaOverlay.svelte` is dev-only and stays Polish.
- **No mobile control aria-label translation in Tier 1**: `MobileControls.svelte` aria-labels (`Góra`, `Dół`, etc.) are screen-reader-only and add disproportionate complexity to test on touch hardware. Track for a follow-up if accessibility owner flags it; not in scope here.

## Implementation Approach

A Svelte `writable<Locale>` store mirrors the `isTouchMode` precedent and is the front door for HUD/SmartTerminal/PreviewOverlay reactivity. A single subscription in `PhaserGame.svelte` re-emits the change as a new `LOCALE_CHANGED` event on `game.events`, so Phaser scenes consume the change identically to all other state changes. Persistence is `localStorage` only, mirroring the AudioManager mute precedent.

Inline-literal scene strings extract into per-feature dictionary modules under `src/explorers/i18n/`, exposing a single `t(key, params?)` helper plus a typed key union. Bilingual content (dialogue lines, exam questions/options, quest titles/briefings/hints, `RANK_FLAVOR`) migrates from `text: string` → `text: { pl: string; en: string }` at the type level, with read paths in `DialogueManager`, `ExamScene`, and `QuestManager` selecting the right field by current locale.

Re-render policy:
- **Resize-rebuild scenes** (`ExamScene`, `ArcadeScene`) hook `LOCALE_CHANGED` to the existing `clearUI()` path.
- **Retain-ref UI** (`DialogueBar`, `InteractionPrompt`, `MemoryMatrixRenderer`, `OscilloscopeRenderer`, `AsteroidRangeRenderer`) implements `applyLocale()` that calls `setText` on cached refs.
- **Risky zones** subscribe but defer: typewriter completes the current line first; arcade waits for round end; cinematic waits for `introPlaying === false`.

Translation strategy: LLM-assisted draft + human review for narrative (~5,000 words of dialogue + exam content + `RANK_FLAVOR`); LLM verbatim for mechanical chrome (`Zamknij`, `Następne`, etc.). Names policy: keep proper nouns, localize titles only.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Locale store subscription timing**: The Svelte `locale` store is created at module load (`utils/locale.ts`) and reads `localStorage` synchronously. `PhaserGame.svelte` subscribes inside `onMount` after `game = new Phaser.Game(...)` is constructed and `game.events` is available; otherwise the first emit fires before the bus exists.
- **Boot-time initial locale broadcast**: Scenes that read `t()` during `create()` already use the current store value via the synchronous getter `getLocale()`. They do not need `LOCALE_CHANGED` to fire during boot; they pick up the persisted value naturally.
- **`LOCALE_CHANGED` payload**: `{ locale: 'pl' | 'en' }`. Emitted only on explicit user toggle, never on boot.
- **Deferral seams**:
  - `TypewriterEffect`: stash pending locale on `LOCALE_CHANGED`; on `complete()` callback, re-render the just-finished line in new locale (no replay) and clear pending.
  - `ArcadeScene`: gate `clearUI()` behind `arcadeState !== 'playing'`. If `playing`, stash pending locale; on round end (`completed` / `failed` transition), apply.
  - `GameScene` cinematic: gate full re-render behind `!introPlaying`. If `introPlaying`, stash pending; on cinematic complete, apply.

**Derived from**: research at `src/explorers/ui/TypewriterEffect.ts:33-44`, `ArcadeScene.ts:637-642`, `GameScene.ts:608-737`.

### User Experience Specification

- **HUD toggle button placement**: desktop — adjacent to the mute button at `GameHud.svelte:238-255`; mobile — in the right cluster at `:165-176` and mirrored in the drawer.
- **Toggle visual**: small pill/button labeled `PL` / `EN`. Single click cycles to the other locale. Reuses `preventHudFocusSteal` + `blurHudButton` patterns to avoid stealing focus from terminal input.
- **Active-locale indicator**: bold the current locale on the button label (`**PL** EN` styling); `class:hotkey-active={...}` matches the existing mute button visual treatment.
- **Title attribute**: localized — `Język: Polski` / `Language: English`, mirroring the mute button's `title={muted ? 'Włącz dźwięk' : 'Wycisz'}` pattern.
- **Visible feedback on click**: HUD chrome flips immediately (Svelte reactivity); Phaser scenes flip on the next frame after `LOCALE_CHANGED` propagates. No spinner or modal needed.
- **Edge case — toggling during dialogue typewriter**: current line continues to its end in the original locale, then on completion the line text re-renders in the new locale; player sees a brief flicker as the just-finished line swaps. Subsequent lines render in the new locale.
- **Edge case — toggling during arcade play**: HUD chrome flips immediately; arcade canvas waits until the round ends. Players see the score/timer chrome flip but their playing-field text (parameter labels, hints) hold until round end.
- **Edge case — toggling during cinematic intro**: HUD flips immediately; cinematic title/subtitle hold their original locale until the intro completes. The end-screen renders in the new locale on first paint.

**Derived from**: research at `GameHud.svelte:181, 235, 154, 245, 277, 323` + user decisions in Round 2.

### Performance & Optimization Strategy

- **No re-render storms**: `LOCALE_CHANGED` fires once per user click, never during normal play. Scenes attach a single bus listener at `create()` and detach at `shutdown()`.
- **Dictionary access cost**: `t(key)` is a two-level object access (`STRINGS[locale][key]`). No memoization needed; access is O(1) and infrequent.
- **Bilingual content access cost**: per-line lookup `line.text[locale]` is O(1) per render. No measurable impact at the dialogue/exam/quest scale (~1k entries total).
- **localStorage write**: throttled to one write per click; no debouncing needed.

**Derived from**: research showing `LOCALE_CHANGED` is user-driven, not state-machine-driven.

### State Management Sequencing

Event flow on user toggle:
1. User clicks HUD toggle button.
2. Svelte handler calls `setLocale('en')` → `locale.set('en')` (writable update) → subscriber writes to localStorage.
3. Svelte components consuming `$locale` re-render reactively in the new locale.
4. `PhaserGame.svelte`'s store subscriber receives the change → `game.events.emit(GameEvents.LOCALE_CHANGED, { locale: 'en' })`.
5. Each Phaser scene's bus listener receives the event:
   - Resize-rebuild scenes (Exam, Arcade) call their existing `clearUI()` + render path (gated by phase for Arcade).
   - Retain-ref UI calls its `applyLocale()` that re-`setText` on cached refs.
   - Risky-zone owners stash pending locale and re-check at the next clean boundary.

**Derived from**: research at `src/explorers/scenes/BaseScene.ts:14-16` (bus access) + the established pattern for `STATE_CHANGED`.

### Debug & Observability Plan

- **Verification method**:
  - Toggle HUD button → both Svelte chrome and Phaser canvas flip; localStorage has the new value; reload page → locale persists.
  - Vitest parity test: `i18n/strings.test.ts` enumerates all dictionary modules and asserts `Object.keys(STRINGS.pl).sort()` equals `Object.keys(STRINGS.en).sort()` per module. Same for bilingual content modules.
  - Mid-flight swap manual test: trigger toggle during typewriter, during arcade `playing`, during cinematic intro — verify deferral works.
- **Logging strategy**: `devLog('[Locale] changed pl → en')` at the store subscriber. No production-grade telemetry.
- **Debug instrumentation**: optional QA-overlay toggle to dump the dictionary key set and verify coverage. Out of scope for Tier 1; revisit if translation drift becomes a problem.
- **Timing debug**: when investigating a deferral bug, log `[Locale] deferring swap (zone=arcade-playing)` and `[Locale] applying deferred swap (zone=arcade-playing)` at the deferral seams.
- **Metrics**: none for Tier 1. If the toggle is heavily used we may want to add an analytics event in a follow-up; not in scope.

**Derived from**: existing `devLog` patterns in `src/explorers/state/GameStateManager.ts:51` and AudioManager.

---

## Phase 1: Locale infrastructure & HUD toggle

### Overview

Build the foundation: Svelte locale store with localStorage persistence, `LOCALE_CHANGED` event, store→bus subscription in `PhaserGame.svelte`, and the HUD toggle button. No content is translated yet — toggling the button persists the choice but no game text changes.

### Changes Required:

#### 1. Locale store + localStorage persistence

**File**: `src/explorers/utils/locale.ts` (new)
**Changes**: Mirror the `isTouchMode` precedent (`utils/touchDetection.ts:17`) with a `writable<Locale>` plus localStorage read/write. Default to `'pl'` when no stored value.

```ts
import { writable, type Writable, get } from 'svelte/store';
import { devLog } from './logger';

export type Locale = 'pl' | 'en';

const STORAGE_KEY = 'space-explorers-locale';

function loadInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'pl';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'pl';
}

export const locale: Writable<Locale> = writable(loadInitialLocale());

let initialised = false;

export function initLocaleStore(): () => void {
  if (initialised || typeof window === 'undefined') return () => {};
  initialised = true;

  const unsubscribe = locale.subscribe((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable; ignore */
    }
  });

  return () => {
    unsubscribe();
    initialised = false;
  };
}

export function getLocale(): Locale {
  return get(locale);
}

export function setLocale(next: Locale): void {
  if (get(locale) === next) return;
  devLog(`[Locale] changed ${get(locale)} → ${next}`);
  locale.set(next);
}

export function toggleLocale(): void {
  setLocale(get(locale) === 'pl' ? 'en' : 'pl');
}
```

#### 2. Add `LOCALE_CHANGED` event + payload type

**File**: `src/explorers/events/GameEvents.ts`
**Changes**: extend the enum and payload interface union.

```ts
// In GameEvents constant, add to a new "Locale" section after RANK_UP:
LOCALE_CHANGED: 'locale:changed',

// At the bottom of the file, add the payload interface:
export interface LocaleChangedPayload {
  locale: import('../utils/locale').Locale;
}
```

#### 3. Wire store → bus in `PhaserGame.svelte`

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: import `locale` store + `initLocaleStore`; in `onMount` after the game instance is constructed, call `initLocaleStore()` and subscribe with the bus emit. Cleanup in `onDestroy`.

```ts
import { locale, initLocaleStore } from './utils/locale';
import { GameEvents } from './events/GameEvents';

// inside onMount, after `game = new Phaser.Game(...)`:
const cleanupLocaleStore = initLocaleStore();
const unsubscribeLocale = locale.subscribe((value) => {
  if (!game) return;
  game.events.emit(GameEvents.LOCALE_CHANGED, { locale: value });
});

// inside onDestroy:
unsubscribeLocale();
cleanupLocaleStore();
```

#### 4. HUD toggle button

**File**: `src/explorers/GameHud.svelte`
**Changes**: import `locale` + `toggleLocale`; add a `PL/EN` button next to the mute button (around `:238-255` for desktop, `:165-176` for mobile cluster) and mirrored in the mobile drawer (`:271-289`). Use `preventHudFocusSteal` + `blurHudButton` patterns.

```svelte
<script lang="ts">
  import { locale, toggleLocale } from './utils/locale';
  // ...existing imports...

  function onToggleLocale(event: MouseEvent) {
    blurHudButton(event);
    toggleLocale();
  }
</script>

<!-- In the hotkey cluster, adjacent to the mute button: -->
<button
  type="button"
  tabindex="-1"
  class="hotkey hotkey-locale"
  on:mousedown={preventHudFocusSteal}
  on:click={onToggleLocale}
  title={$locale === 'pl' ? 'Język: Polski' : 'Language: English'}
  aria-label={$locale === 'pl' ? 'Zmień język na angielski' : 'Switch language to Polish'}>
  <span class:locale-active={$locale === 'pl'}>PL</span>
  <span class="locale-divider">/</span>
  <span class:locale-active={$locale === 'en'}>EN</span>
</button>

<style>
  .hotkey-locale {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
  }
  .locale-active {
    font-weight: 700;
    color: var(--hud-active-color, currentColor);
  }
  .locale-divider {
    opacity: 0.4;
    margin: 0 2px;
  }
</style>
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build --workspace=projects/edu-platform`
- [x] No new lint errors: `npm run lint`
- [x] Existing test suite passes: `npm run test --workspace=projects/edu-platform`

#### Manual Verification:

- [x] HUD shows a `PL / EN` button next to the mute control on desktop and in the mobile drawer.
- [x] Clicking the button toggles which side is bold.
- [x] `localStorage.getItem('space-explorers-locale')` reflects the new value after each click.
- [x] Reloading the page restores the persisted choice.
- [x] No game text changes yet — only the button visual flips. (This is the expected end state for Phase 1.)
- [x] No console errors; the `[Locale] changed pl → en` devLog appears in dev mode.
- [x] Toggling the button while the terminal is open does not steal focus from the terminal input (verifies `preventHudFocusSteal` + `blurHudButton` work).

**Implementation Note**: After Phase 1, pause for manual confirmation that the toggle persists, the bus emit fires (verifiable via a temporary console.log in PhaserGame.svelte's subscriber), and no Phaser scenes throw on the new event before proceeding to Phase 2.

---

## Phase 2: Bilingual content schema migration

### Overview

Convert `text: string` to `text: { pl: string; en: string }` on all key-addressed content types: dialogue lines, exam questions/options, quest titles/briefings/hints, `RANK_FLAVOR`. Update read paths to pick by current locale. Initial `en` values are placeholders equal to `pl` values — game plays identically in both locales until Phase 4 ships translations.

### Changes Required:

#### 1. Bilingual type alias

**File**: `src/explorers/i18n/types.ts` (new)
**Changes**: a tiny shared type so dialogue/exam/quest/rank modules don't each define their own.

```ts
import type { Locale } from '../utils/locale';

export type BilingualText = Record<Locale, string>;
```

#### 2. Update `DialogueLine.text` to bilingual

**File**: `src/explorers/systems/DialogueTypes.ts`
**Changes**: change `text: string` to `text: BilingualText` on `DialogueLine`. Update `DialogueEffect.openUrlTitle` similarly (it's player-facing).

```ts
import type { BilingualText } from '../i18n/types';

export interface DialogueLine {
  speaker: 'astronaut' | 'system' | string;
  text: BilingualText;
  mode: DialogueMode;
  autoAdvance?: number;
}

export interface DialogueEffect {
  // ...
  openUrlTitle?: BilingualText;
  addBookmark?: { url: string; title: BilingualText; afterDialogue?: string };
  // ...
}
```

#### 3. Update `ExamDefinition`, `ExamQuestion`, `ExamOption`

**File**: `src/explorers/systems/ExamTypes.ts`
**Changes**: change `title`, `description`, `text` (on question and option) to `BilingualText`.

```ts
import type { BilingualText } from '../i18n/types';

export interface ExamDefinition {
  id: string;
  title: BilingualText;
  description: BilingualText;
  questions: ExamQuestion[];
  passingScore: number;
  rewards: { xp: number; flags: GameFlag[] };
  completionDialogue?: string;
}

export interface ExamQuestion {
  id: string;
  text: BilingualText;
  type: 'single' | 'multi';
  options: ExamOption[];
  correctOptionIds: string[];
}

export interface ExamOption {
  id: string;
  text: BilingualText;
}
```

#### 4. Update `QuestDefinition`

**File**: `src/explorers/systems/QuestManager.ts` (find `QuestDefinition` interface)
**Changes**: `title: BilingualText`, `briefing: BilingualText`, `hints: BilingualText[]`, `objectiveLabel: BilingualText` (or whichever fields are user-facing).

#### 5. Update `RANK_FLAVOR`

**File**: `src/explorers/config/ranks.ts`
**Changes**: change the `RANK_FLAVOR` block at `:80-87` from `Record<number, string>` to `Record<number, BilingualText>`. Update `buildRankUpDialogues()` at `:93-113` to pass current-locale flavor. Rank `name` fields at `:11-17` stay `string` (English by design).

#### 6. Read paths pick by current locale

**Files**:
- `src/explorers/systems/DialogueManager.ts` — when emitting/rendering a line, read `line.text[getLocale()]`. Also in any place that consumes `DialogueEffect.openUrlTitle` or `addBookmark.title`.
- `src/explorers/scenes/ExamScene.ts:191, 228, 469` — `EGZAMIN: ${title}` uses `title[getLocale()]`; question rendering uses `question.text[getLocale()]`; options use `option.text[getLocale()]`.
- `src/explorers/systems/QuestManager.ts` — quest-title broadcasts and runtime briefings pick by locale.
- `src/explorers/config/ranks.ts:93-113` — `buildRankUpDialogues()` produces bilingual lines (since `DialogueLine.text` is now `BilingualText`); locale selection happens at the `DialogueManager` read seam, not here.

#### 7. Migrate existing content with placeholder `en`

**Files**: every `levels/m0-*/dialogues.ts`, `levels/m0-exam-room/exams.ts`, `levels/m0-*/quests.ts`, plus `RANK_FLAVOR` in `config/ranks.ts`.
**Changes**: programmatically convert every `text: '<polish>'` to `text: { pl: '<polish>', en: '<polish>' }`. Same transform for `title`, `description`, `briefing`, `hints[]`, `objectiveLabel`. The `en` value is a temporary placeholder — Phase 4 replaces these.

A one-shot codemod script (committed in `scripts/i18n-migrate-content.ts`, removed after Phase 4):

```ts
// Walks levels/**/{dialogues,exams,quests}.ts and config/ranks.ts.
// For every `text: '...'` (and similarly title/description/briefing/hints[]),
// rewrites to `text: { pl: '...', en: '...' }`.
// Idempotent: skips files already in bilingual shape.
// Run once: `npx tsx scripts/i18n-migrate-content.ts`
```

#### 8. Bus listener wiring (no-op for now)

**File**: `src/explorers/scenes/BaseScene.ts`
**Changes**: add an empty `onLocaleChanged()` hook that subclasses override in Phase 3. No-op default keeps Phase 2 a pure data refactor.

```ts
import { GameEvents } from '../events/GameEvents';

// In create(), after existing event subscriptions:
this.bus.on(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);

// In shutdown():
this.bus.off(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);

// Default hook (subclasses override):
protected onLocaleChanged(_payload: { locale: import('../utils/locale').Locale }): void {
  // no-op; subclasses override in Phase 3
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles end-to-end: `npm run build --workspace=projects/edu-platform`
- [x] All existing tests pass: `npm run test --workspace=projects/edu-platform`
- [x] Codemod runs idempotently: running it twice produces no diff on the second pass.
- [x] No new lint errors: `npm run lint`

#### Manual Verification:

- [ ] In `pl` mode, the game plays identically to before this phase: same dialogue text, exam questions, quest briefings.
- [ ] Toggling to `en` does not crash; in `en` mode the player sees Polish text everywhere (because placeholder `en` values equal `pl` values). This is expected and proves the read path works.
- [ ] Rank-up dialogue at `RANK_FLAVOR` boundary (test by gaining XP to cross a tier) renders correctly in both modes.
- [ ] Spot-check m0-awakening intro, m0-core-ai dialogue, m0-exam-room exam, m0-crew-room dialogue — none throws, all advance normally.

**Implementation Note**: After Phase 2, pause for manual confirmation that the bilingual type migration plays through every level cleanly in both locales (with `en` showing Polish placeholders) before proceeding to Phase 3.

---

## Phase 3: Inline-literal extraction + per-feature dictionaries + re-render plumbing

### Overview

Extract every inline Polish literal in Phaser scenes and Svelte shells into per-feature dictionary modules. Wire `LOCALE_CHANGED` to scene-rebuild paths and retain-ref `applyLocale()` calls. Implement deferred-update logic for the three risky zones. Like Phase 2, `en` values are placeholders — game still plays in Polish in both modes, but every literal is now key-addressed and reactive.

### Changes Required:

#### 1. Central `i18n` module + `t()` helper

**Files**:
- `src/explorers/i18n/index.ts` (new) — re-exports `t()` and merges per-feature dictionaries into a typed key union.
- Per-feature modules: `i18n/hud.ts`, `i18n/scene.ts`, `i18n/exam.ts`, `i18n/arcade.ts`, `i18n/terminal.ts`, `i18n/cinematic.ts`, `i18n/preview.ts`, `i18n/grant.ts`, `i18n/lockscreen.ts`.

```ts
// src/explorers/i18n/index.ts
import type { Locale } from '../utils/locale';
import { getLocale } from '../utils/locale';
import { hudStrings } from './hud';
import { sceneStrings } from './scene';
import { examStrings } from './exam';
import { arcadeStrings } from './arcade';
import { terminalStrings } from './terminal';
import { cinematicStrings } from './cinematic';
import { previewStrings } from './preview';
import { grantStrings } from './grant';
import { lockscreenStrings } from './lockscreen';

const ALL = {
  ...hudStrings, ...sceneStrings, ...examStrings, ...arcadeStrings,
  ...terminalStrings, ...cinematicStrings, ...previewStrings,
  ...grantStrings, ...lockscreenStrings,
} as const satisfies Record<Locale, Record<string, string>>;
// Note: structural form is { pl: {...}, en: {...} } per module; merge concatenates per locale.

export type StringKey = keyof (typeof ALL)['pl'];

export function t(key: StringKey, params?: Record<string, string | number>): string {
  const locale = getLocale();
  const raw = ALL[locale][key] ?? ALL.pl[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`));
}
```

```ts
// src/explorers/i18n/exam.ts (illustrative)
export const examStrings = {
  pl: {
    'exam.title': 'EGZAMIN: {title}',
    'exam.selectAllMatching': 'Wybierz wszystkie pasujące:',
    'exam.close': 'Zamknij',
    'exam.previous': '← Poprzednie',
    'exam.next': 'Następne →',
    'exam.finish': 'Zakończ egzamin',
    'exam.passed': 'EGZAMIN ZALICZONY',
    'exam.failed': 'EGZAMIN NIEZALICZONY',
    'exam.score': '{score}/{total} poprawnych odpowiedzi',
    'exam.requiredHint': 'Wymagane: {required} z {total}',
    'exam.closeHint': 'Zamknij [Enter]',
    'exam.tryAgain': 'Spróbuj ponownie',
  },
  en: {
    // placeholders during Phase 3; Phase 4 fills these in
    'exam.title': 'EGZAMIN: {title}',
    'exam.selectAllMatching': 'Wybierz wszystkie pasujące:',
    // ...etc, copy of pl
  },
} as const;
```

A reactive Svelte derived store for use in `.svelte` files:

```ts
// src/explorers/i18n/store.ts
import { derived } from 'svelte/store';
import { locale } from '../utils/locale';
import { t as tStatic, type StringKey } from '.';

export const t = derived(locale, () => (key: StringKey, params?: Record<string, string | number>) => tStatic(key, params));
```

#### 2. Phaser scene extractions

**File**: `src/explorers/scenes/ExamScene.ts`
**Changes**: replace 18 inline Polish literals (at `:191, 228, 242, 349, 378, 397, 519, 536, 548, 622, 655` per research) with `t('exam.*', { ... })`. Override `onLocaleChanged()` to call existing `clearUI()` + render path (the same path used by resize at `:47-54`).

**File**: `src/explorers/scenes/ArcadeScene.ts`
**Changes**: replace 16 inline literals (at `:125-134, 138-148, 154-162, 188, 210, 246-255, 325, 339, 352, 391, 525, 541, 552`). Override `onLocaleChanged()`:
```ts
protected override onLocaleChanged(): void {
  if (this.arcadeState === 'playing') {
    this.pendingLocaleSwap = true;
    return;
  }
  this.clearUI();
  this.renderCurrentPanel();
}

// At round-end transition (existing handler), check and apply pending:
if (this.pendingLocaleSwap) {
  this.pendingLocaleSwap = false;
  this.clearUI();
  this.renderCurrentPanel();
}
```

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: extract cinematic strings (`:608-617, 619-629, 706-737`) and per-frame interaction labels (`:418-422`). Override `onLocaleChanged()`:
```ts
protected override onLocaleChanged(): void {
  if (this.introPlaying) {
    this.pendingLocaleSwap = true;
    return;
  }
  this.refreshLocaleSensitiveText();
}
```

**File**: `src/explorers/ui/DialogueBar.ts`
**Changes**: extract `[Spacja] dalej ▸` hint at `:180-184`. Add `applyLocale()` that calls `setText` on retained `speakerText`/`bodyText`/`hintText` refs (`:21-23`). Subscribe to `LOCALE_CHANGED` in constructor; deferred until typewriter completes.

**File**: `src/explorers/ui/InteractionPrompt.ts`
**Changes**: extract `[E] Interakcja` default at `:16, 28, 34`. Add `applyLocale()` calling `this.label.setText(t('interaction.prompt'))`.

**File**: `src/explorers/ui/TypewriterEffect.ts`
**Changes**: add `pendingLocaleAfterComplete` state; on `start()`, snapshot the source text in current locale; on `LOCALE_CHANGED` mid-line, stash the new locale; on `complete()`, if pending, re-emit the just-finished line in the new locale.

**Files**:
- `src/explorers/arcade/MemoryMatrixRenderer.ts` (literals at `:252, 259, 287, 392, 396, 415-416`)
- `src/explorers/arcade/OscilloscopeRenderer.ts` (at `:28-70, 258, 392, 542`)
- `src/explorers/arcade/AsteroidRangeRenderer.ts` (at `:131-160, 383`)

**Changes**: extract literals into `i18n/arcade.ts`. Each renderer adds an `applyLocale()` method that calls `setText` on its retained refs. ArcadeScene's `onLocaleChanged()` calls each child renderer's `applyLocale()` when not in `playing` phase.

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: 2 `add.text` calls — extract loading screen literals (verify these are player-facing; if dev-only, skip).

#### 3. Terminal extractions

**File**: `src/explorers/terminal/commandRegistry.ts:11-19`
**Changes**: change `description: string` to `description: BilingualText` on each command entry. Read path uses current locale.

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes**: highest-volume extraction in the project. Every inline Polish literal across `/help`, `/me`, `/time`, `/quest`, `/solve`, `/hint`, `/bookmarks`, `/navi` extracts to `i18n/terminal.ts` with key namespace `terminal.<command>.<purpose>`. Output emit calls become `t('terminal.me.profileHeader')` etc.

**File**: `src/explorers/terminal/supportCommand.ts:21, 37, 50, 63`
**Changes**: extract 4 literals into `i18n/terminal.ts` under `terminal.support.*`.

#### 4. Svelte shell extractions

**Files**:
- `src/explorers/GameHud.svelte` — `:181, 235, 154, 245, 277, 323` (`Powrót do platformy`, `Logowanie`, mute titles, drawer copy)
- `src/explorers/SmartTerminal.svelte` — `:108-112, 116, 131, 186-187, 268-270` (support flow + terminal hints)
- `src/explorers/PreviewOverlay.svelte` — `:12, 16` (default title `Notatki z podróży`)
- `src/explorers/GrantNotification.svelte` — `:69, 86` (`Misja zaliczona!`, `+{totalXp} XP łącznie`)
- `src/explorers/terminal/TerminalLockScreen.svelte` — `:20, 35-38` (lock screen copy)
- `src/explorers/terminal/TerminalInput.svelte` — `:104` (placeholder)
- `src/explorers/terminal/TerminalTokenBar.svelte` — `:43, 52` (token bar buttons)

**Changes**: import the reactive `t` derived store; replace static literals with `{$t('hud.homeButton')}` etc.

```svelte
<script>
  import { t } from './i18n/store';
</script>
<a href="/courses" title={$t('hud.homeButton')} aria-label={$t('hud.homeButton')}>
  ...
</a>
```

**Out of scope for Phase 3**: `MobileControls.svelte` aria-labels, `QaOverlay.svelte` (dev-only).

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npm run build --workspace=projects/edu-platform`
- [ ] All existing tests pass: `npm run test --workspace=projects/edu-platform`
- [ ] Static analysis: a grep for hardcoded Polish characters in `src/explorers/**/*.{ts,svelte}` (excluding `i18n/` and `levels/`) returns no results — implemented as a Vitest test that scans file contents.
- [ ] No new lint errors: `npm run lint`

#### Manual Verification:

- [ ] In `pl`, the game plays identically to before this phase.
- [ ] In `en`, every surface still shows Polish text (because placeholder `en` values equal `pl` values), but every string now flows through `t()`. Confirm by temporarily changing one `en` value in `i18n/hud.ts` to a unique English string and verifying it appears.
- [ ] Mid-flight swap test: trigger toggle while a dialogue typewriter is running — current line completes in original locale, then re-renders in new locale.
- [ ] Mid-flight swap test: trigger toggle while in arcade `playing` phase — HUD chrome flips immediately; arcade canvas waits until round end.
- [ ] Mid-flight swap test: trigger toggle during GameScene cinematic intro — HUD flips; cinematic holds until intro completes; end-screen renders in new locale.
- [ ] Reload page mid-session — locale persists; all surfaces render in the persisted locale on first paint.
- [ ] Terminal: open it, run `/help`, `/me`, `/quest`, `/solve` after toggling; new output is in current locale; prior transcript is unchanged.
- [ ] No console errors in any test scenario.

**Implementation Note**: Phase 3 is the largest in line count touched and the most prone to missed literals. Budget extra manual time for spot-checks across all m0 levels. After Phase 3, pause for manual confirmation that every surface flips reactively before proceeding to Phase 4.

---

## Phase 4: Translation production

### Overview

Replace all placeholder `en` values with reviewed English translations. LLM-assisted draft + human review for narrative content; LLM verbatim for mechanical chrome. Add Vitest parity tests that block CI on missing or empty `en` keys.

### Changes Required:

#### 1. Translation generation pipeline

**File**: `scripts/i18n-translate.ts` (new)
**Changes**: a script that reads each i18n module + each bilingual content file (dialogues, exams, quests, ranks), extracts the `pl` field, sends to an LLM with a project-specific voice brief, writes the result back to the corresponding `en` field. Idempotent: skips entries where `en !== pl` (already translated/reviewed).

The voice brief lives at `scripts/i18n-translate-voice.md` and includes:
- Game setting summary (sci-fi crash-on-Moon awakening, neural sync trauma, AI-team training metaphor).
- Character voice notes: astronaut narrator (terse, bewildered), Floobert (eccentric crew member), Officer Harris (formal/military), system messages (clinical/short).
- Term glossary: `inteligencja agentowa` → `agentic intelligence`, `pokład` → `deck`, `sygnał z Ziemi` → `signal from Earth`, `synchronizacja neuronalna` → `neural synchronisation`, `notatki z podróży` → `travel notes`, etc.
- Name policy: keep proper nouns (`Floobert`, `Moreau`, `Harris`, `Dexo`); localize titles (`inżynier` → `Engineer`, `oficer` → `Officer`).
- Rank policy: `RANK_FLAVOR` localizes; rank `name` fields stay English in both locales.

#### 2. Narrative review pass

**Process** (not files):
- After running the script, a reviewer reads through every `en` field in `levels/m0-*/dialogues.ts`, `levels/m0-exam-room/exams.ts`, `levels/m0-*/quests.ts`, `config/ranks.ts` (RANK_FLAVOR).
- Edits for tone, character voice consistency, term consistency, line length (English often runs ~10–15% longer than Polish — flag any line that overflows the dialogue bar or exam panel).
- Mechanical chrome dictionaries (`i18n/hud.ts`, `i18n/exam.ts` UI labels, `i18n/arcade.ts` chrome, `i18n/terminal.ts` non-narrative output, `i18n/scene.ts`, `i18n/preview.ts`, `i18n/grant.ts`, `i18n/lockscreen.ts`, `i18n/cinematic.ts`) — spot-check only; LLM output usually correct for these.

#### 3. Parity test

**File**: `src/explorers/i18n/strings.test.ts` (new)
**Changes**: Vitest test that imports each per-feature module and asserts:
1. `Object.keys(STRINGS.pl).sort()` deep-equals `Object.keys(STRINGS.en).sort()` per module.
2. No `en` value equals its `pl` counterpart (placeholder check) — except for whitelisted cases where the value is intentionally the same in both locales (e.g., `'PROFIL'` if it stays `PROFIL`, identifier symbols, formatting tokens).
3. All `{param}` placeholders in `pl` are present in `en` and vice versa (no missing interpolation slots).

```ts
import { describe, it, expect } from 'vitest';
import { hudStrings } from './hud';
// ...all modules

const MODULES = [
  ['hud', hudStrings],
  // ...
] as const;

describe('i18n parity', () => {
  for (const [name, mod] of MODULES) {
    it(`${name}: pl and en have identical key sets`, () => {
      expect(Object.keys(mod.pl).sort()).toEqual(Object.keys(mod.en).sort());
    });
    it(`${name}: no placeholder en values left`, () => {
      const placeholders: string[] = [];
      for (const key of Object.keys(mod.pl)) {
        if (mod.pl[key] === mod.en[key] && !INTENTIONALLY_IDENTICAL.has(`${name}.${key}`)) {
          placeholders.push(`${name}.${key}`);
        }
      }
      expect(placeholders).toEqual([]);
    });
    it(`${name}: interpolation slots match`, () => {
      for (const key of Object.keys(mod.pl)) {
        const plSlots = (mod.pl[key].match(/\{\w+\}/g) ?? []).sort();
        const enSlots = (mod.en[key].match(/\{\w+\}/g) ?? []).sort();
        expect(enSlots, `${name}.${key}`).toEqual(plSlots);
      }
    });
  }
});

const INTENTIONALLY_IDENTICAL = new Set<string>([
  // populate during review with cases that don't translate
  // e.g., 'terminal.token.copyIcon' if it's a glyph string
]);
```

#### 4. Bilingual content parity test

**File**: `src/explorers/levels/levelLoader.test.ts` (extend or create)
**Changes**: load all levels via `loadLevelsFromData`, walk every dialogue line / exam question/option / quest title/briefing/hints / rank flavor, and assert every `BilingualText` has non-empty `pl` and non-empty `en`. Also check that `pl !== en` (placeholder check).

### Success Criteria:

#### Automated Verification:

- [ ] Parity tests pass: `npm run test --workspace=projects/edu-platform -- i18n`
- [ ] All other tests pass: `npm run test --workspace=projects/edu-platform`
- [ ] TypeScript compiles: `npm run build --workspace=projects/edu-platform`
- [ ] Translation script idempotent: re-running produces no diff.

#### Manual Verification:

- [ ] In `en`, every visible surface reads natural English (spot-check at minimum: HUD chrome, terminal `/help` and `/me`, m0-awakening intro dialogue, m0-exam-room exam questions, MemoryMatrix arcade, GameScene end-screen).
- [ ] Character voice consistency: spot-check Floobert's lines, Officer Harris's lines, system messages, astronaut monologue.
- [ ] Term consistency: search `en` corpus for the agreed term mappings (`agentic intelligence`, `deck`, `Engineer`, `Officer`) — no stragglers.
- [ ] Line length: long English exam questions and arcade hints fit within their panel widths without truncation. Note any wrap-quality issues for the QA pass in Phase 5.
- [ ] Names policy: Floobert, Moreau, Harris, Dexo unchanged; titles consistently `Engineer`/`Officer`.
- [ ] Rank names: `Space Adept`, `Moon Engineer` etc. unchanged; rank-up flavor reads naturally in both locales.

**Implementation Note**: After Phase 4, the parity tests guard against future drift. Translation is a content-quality gate, not just a code gate — block merge until at least one human reviewer has signed off on the narrative passages.

---

## Phase 5: QA, mid-flight verification, launch readiness

### Overview

Full manual play-through in both locales, targeted tests for mid-flight swap behavior, visual-fit verification, and final polish. No new code paths — only fixes for bugs surfaced during verification.

### Changes Required:

#### 1. Full play-through, both locales

**Process**:
- `pl` regression pass: complete m0-awakening → m0-core-ai → m0-exam-room → m0-crew-room with all dialogues, all 3 exams, MemoryMatrix arcade, Oscilloscope arcade, AsteroidRange arcade, all terminal commands (`/help`, `/me`, `/time`, `/quest`, `/solve`, `/hint`, `/bookmarks`, `/navi`, `/support`). Compare against pre-localization behavior.
- `en` translation pass: same path in English mode. Note any awkward phrasings, untranslated stragglers, line-length overflows.

#### 2. Mid-flight swap pass

**Process**:
- Toggle during `m0-awakening` cinematic intro → confirm cinematic holds, end-screen flips.
- Toggle during dialogue with typewriter active (e.g., NPC Moreau conversation) → confirm current line completes, next renders in new locale.
- Toggle during arcade `playing` phase (MemoryMatrix mid-round) → confirm playfield text holds, HUD chrome flips, round-end applies pending swap.
- Toggle during exam mid-question (after selecting an option but before submitting) → confirm panel rebuilds in new locale, selected option preserved (selection is keyed by `option.id`, not text).
- Toggle in terminal mid-typing → confirm input doesn't lose focus; placeholder updates; transcript stays mixed.
- Toggle on `/explorers` page during boot before any scene has fully created → confirm no race; scene picks up persisted locale on first render.

#### 3. Visual fit pass

**Process**:
- Walk through all exam questions in `en` and verify text fits the panel width at 1920×1080, 1366×768, and 768×1024 (mobile portrait). Look for truncated lines or wrapping that breaks the visual grid.
- Same for arcade chrome (`MemoryMatrixRenderer` headers, `OscilloscopeRenderer` parameter labels).
- Same for GameScene cinematic (long English title/subtitle).
- Same for `DialogueBar` body text — English lines may wrap differently than Polish; verify nothing overflows the bar.

#### 4. Edge case sweep

**Process**:
- Anonymous user: toggle works, persists in localStorage, server doesn't see it (no `/api/game/state` mutation), reload restores choice.
- Authenticated user: same as anonymous (since persistence is localStorage-only by decision); confirm no Supabase / KV writes related to locale.
- Private/incognito browsing: toggle works during session; choice does not persist after window close (acceptable trade-off for the chosen persistence story).
- localStorage disabled: toggle still works in-session; defaults to `pl` on each fresh load. Confirm no thrown exceptions.
- Browser back/forward across `/explorers` ↔ `/courses`: locale store survives navigation back to `/explorers`.

#### 5. Polish + launch

**Process**:
- Apply any string fixes flagged in passes 1–4.
- Re-run parity tests + full Vitest suite.
- Update `projects/edu-platform/CLAUDE.md` constraint list to add: "**Localization**: All player-facing strings in `src/explorers/` must use the `t()` helper or bilingual content fields. Adding a new string requires both `pl` and `en` values; the parity test will fail otherwise."
- Update `.ai/10x-devs/game/cookbook.md` with a section on adding new localized strings and the `LOCALE_CHANGED` re-render policy.
- Final commit, deploy to preview, tag release.

### Success Criteria:

#### Automated Verification:

- [ ] All tests pass including parity tests: `npm run test --workspace=projects/edu-platform`
- [ ] No regressions in existing test suite.
- [ ] Build succeeds: `npm run build --workspace=projects/edu-platform`
- [ ] Preview deploy succeeds.

#### Manual Verification:

- [ ] Full play-through in `pl` is a clean regression — no behavior changes vs pre-plan baseline.
- [ ] Full play-through in `en` reads naturally end-to-end; no untranslated Polish stragglers in scope.
- [ ] All five mid-flight swap scenarios behave per spec (immediate vs deferred per zone).
- [ ] No visual overflow in `en` across the three test viewports.
- [ ] Edge cases (anon, auth, incognito, localStorage disabled, navigation) all behave correctly.
- [ ] CLAUDE.md and cookbook updates land alongside the launch commit.
- [ ] No console errors or warnings in any tested path.

**Implementation Note**: This phase is verification-heavy and may surface a long tail of small string fixes. Budget at least one full session per locale for the play-through. After Phase 5 sign-off, the toggle ships to production.

---

## Testing Strategy

### Unit Tests:

- `src/explorers/i18n/strings.test.ts` — parity check: pl/en key sets identical per module; no placeholder values; interpolation slots match.
- `src/explorers/levels/levelLoader.test.ts` (extended) — bilingual content parity: every `BilingualText` field has non-empty `pl` and `en` after Phase 4; `pl !== en` for non-whitelisted entries.
- `src/explorers/utils/locale.test.ts` (new) — `loadInitialLocale` reads from localStorage; `setLocale` writes back; `toggleLocale` flips correctly.
- Static analysis test scanning `src/explorers/**/*.{ts,svelte}` (excluding `i18n/`, `levels/`, `__tests__/`) for hardcoded Polish characters in string literals — fails the build if a new untranslated literal sneaks in.

### Integration Tests:

- Manual mid-flight swap matrix (5 scenarios in Phase 5) — automated coverage is impractical without Phaser test harness; rely on manual checks documented in the QA checklist.
- Save/load round-trip: persist locale to localStorage, reload, confirm scenes render in persisted locale on first paint.

### Manual Testing Steps:

(See Phase 5 success criteria — full play-through both locales, mid-flight swap matrix, visual fit at 3 viewports, edge case sweep.)

## Performance Considerations

- `t(key)` is O(1) object access; no measurable cost.
- `LOCALE_CHANGED` fires once per user click; no animation-frame impact.
- Bilingual content doubles the in-memory string footprint by ~10 KB (10k words × ~5 bytes × 2 locales — negligible compared to texture atlases).
- localStorage write per toggle: synchronous, microsecond scale.

No optimization work expected.

## Migration Notes

- localStorage key `space-explorers-locale` is new; no migration needed (default to `pl` if absent).
- No `GameState` schema change; no KV/Supabase migration.
- Codemod script `scripts/i18n-migrate-content.ts` (Phase 2) is idempotent and removed after Phase 4 ships.
- No production config changes required (no new env vars, no Cloudflare Pages settings).

## References

- Research: `thoughts/shared/research/2026-04-27-explorers-localization-en-pl.md`
- Touch-mode store precedent: `src/explorers/utils/touchDetection.ts:17`
- Mute pref localStorage precedent: `src/explorers/audio/AudioManager.ts:88`
- Event bus enum: `src/explorers/events/GameEvents.ts:5-60`
- Bilingual content seam: `src/explorers/levels/levelLoader.ts:74-95`
- Resize-rebuild precedent: `src/explorers/scenes/ExamScene.ts:47-54, 469`; `src/explorers/scenes/ArcadeScene.ts:637-642`
- Risky-zone references: `src/explorers/ui/TypewriterEffect.ts:33-44`; `src/explorers/scenes/GameScene.ts:608-737`
- Rank flavor seam: `src/explorers/config/ranks.ts:80-87, 93-113`

<!-- PLAN STATUS: Last Phase Completed: 2, Next Phase: 3, Updated: 2026-04-28 -->

---

## Phase 3 — In-Progress Checkpoint (2026-04-28)

Stopped mid-Phase-3 to free context. Resume here.

### Done

**i18n core** (Phase 3.1 complete):

- `src/explorers/i18n/index.ts` — central `STRINGS` (`pl`/`en` merged from per-feature modules) + `t(key, params?)` helper with `{name}` interpolation, `pl` fallback. Exports `StringKey` type union.
- `src/explorers/i18n/store.ts` — Svelte derived `t` store reactive on the `locale` store (for `$t('hud.homeButton')` in `.svelte` files).
- Per-feature modules created with `pl`/`en` placeholder parity (en === pl this phase):
  - `i18n/hud.ts` — HUD chrome (home button, mute titles, locale labels, signup CTA, drawer copy).
  - `i18n/scene.ts` — interaction prompts (`[E] Zobacz`/`Przejdź`/`Egzamin`/`Zadanie`/`Rozmawiaj`/`Interakcja`), dialogue advance hint, speaker labels (`ASTRONAUTA`, `SYSTEM`), end-screen lines + CTA.
  - `i18n/exam.ts` — title prefix, multi-choice hint, navigation buttons, results screen labels.
  - `i18n/arcade.ts` — intro chrome, MemoryMatrix labels, Oscilloscope param labels + controls, AsteroidRange title + status line.
  - `i18n/terminal.ts` — header/boot/hints, lock screen, command-registry descriptions, all `/help`, `/me`, `/time`, `/quest`, `/solve`, `/hint`, `/bookmarks`, `/navi`, `/badges`, `/support` (sync + async paths), SmartTerminal hints/notifications.
  - `i18n/preview.ts` — preview overlay default title.
  - `i18n/grant.ts` — grant notification labels.

**Phaser scenes** (Phase 3.2 partial):

- `scenes/ExamScene.ts` — fully extracted (title prefix, "Wybierz wszystkie pasujące", Zamknij/Poprzednie/Następne/Zakończ egzamin, EGZAMIN ZALICZONY/NIEZALICZONY, score, Wymagane, Zamknij [Enter], Spróbuj ponownie, dismiss). Override `onLocaleChanged()` re-renders via `renderQuestion()` or `showResults()`. `attachLocaleListener()` called in `create()`.
- `scenes/ArcadeScene.ts` — fully extracted (Poziom: stars, [Enter] Start, [ESC] Wyjdź ×2, WYNIK: live + initial, CZAS: live, Wynik: results full/simple). Override `onLocaleChanged()` defers when `phase === 'playing'` (sets `pendingLocaleSwap`, calls `gameRenderer.applyLocale?.()`); applies on intro/results via `applyLocaleSwap()`. `pendingLocaleSwap` drained in `onGameEnd()` and reset in `dismissGame()`.
- `systems/ArcadeTypes.ts` — added optional `applyLocale?(): void` to `ArcadeGameRenderer` interface.
- `scenes/GameScene.ts` — fully extracted (5 interaction prompt labels in `update()`, all 17 end-screen lines incl. divider, "Dowiedz się więcej →" CTA). Override `onLocaleChanged()` sets `pendingLocaleSwap` if `introPlaying` (cinematic deferral) — interaction prompts auto-refresh next frame since `update()` recomputes them.
- `scenes/PreloaderScene.ts` — **skipped per plan** (only `10x EXPLORERS` brand + numeric `0%`).

**Retain-ref UI** (Phase 3.3 partial):

- `ui/DialogueBar.ts` — extracted `[Spacja] dalej ▸` via `dialogueBarPresentation`. Added `applyLocale()` that re-applies presentation (speaker, hint) and re-renders body text only if typewriter is complete (deferral spec). Caches `activeLine`.
- `ui/dialogueBarPresentation.ts` — `ADVANCE_HINT_TEXT` constant removed; uses `t('scene.dialogueAdvanceHint')`. `getSpeakerDisplay` uses `t('scene.speakerAstronaut')` / `t('scene.speakerSystem')`. System mode `speakerText` also uses `t()`. Test file unchanged (still passes — uses `'Spacja'` substring).
- `scenes/DialogueScene.ts` — `attachLocaleListener()` + `onLocaleChanged()` override calls `dialogueBar.applyLocale()` when active.
- `ui/InteractionPrompt.ts` — extracted `[E] Interakcja` default (constructor + `show()` default param). No `applyLocale` needed — GameScene reasserts label every frame.
- `arcade/MemoryMatrixRenderer.ts` — fully extracted: header signal, hint memorize, hint controls, feedback correct/incorrect, transmission ended, rounds completed. **No `applyLocale()` method yet** — needs adding (just a no-op or refresh of header/hint refs).

### Not Done — Resume Here

**Retain-ref UI (continue Phase 3.3)**:

- `arcade/OscilloscopeRenderer.ts` — extract:
  - `DIFFICULTY_CONFIG` param `label` fields (`'Amplituda'`, `'Częstotl.'`, `'Faza'`, `'Przesunięcie'`) — these are static config objects evaluated at module load. Keys exist: `arcade.osc.paramAmplitude/paramFrequency/paramPhase/paramOffset`. Strategy: change `label: string` → `labelKey: 'arcade.osc.paramAmplitude' | ...`, resolve via `t(labelKey)` at render time in `updateParamDisplay()`.
  - `'[W/S] zmień parametr\n[A/D] dopasuj  [Enter] zatwierdź'` (line ~258) — replace with `t('arcade.osc.controls')`.
  - `'Dopasowanie: ???'` (line ~542) — `t('arcade.osc.matchUnknown')`.
  - `` `Dopasowanie: ${this.matchPercent}%` `` (line ~551) — `t('arcade.osc.matchKnown', { percent: this.matchPercent })`.
  - `'Zatwierdzone! [Enter] zakończ'` (line ~392) — `t('arcade.osc.submittedHint')`.
  - Add `applyLocale()` that re-runs `updateParamDisplay()` + re-sets `hintText`.
- `arcade/AsteroidRangeRenderer.ts` — extract:
  - `'STRZELNICA ASTEROIDÓW'` (line ~131) — `t('arcade.ast.title')`.
  - `'[WASD] celuj   [SPACE] strzelaj'` (line ~153) — `t('arcade.ast.controls')`.
  - `updateStatusText()` (line ~381-388): `'GOTOWY'` / `` `LADOWANIE ${cooldownLeft}ms` `` → `t('arcade.ast.statusReady')` / `t('arcade.ast.statusCooldown', { ms: cooldownLeft })`. Two-line status template → `t('arcade.ast.statusLine', { targets: ..., score: ..., laser: ... })`.
  - Add `applyLocale()` that re-sets `titleText` / `hintText` and calls `updateStatusText()`.
- `arcade/MemoryMatrixRenderer.ts` — add `applyLocale()` no-op or refresh hint/header (current text is recomputed each phase transition; safe to leave or add a stub).
- `ui/TypewriterEffect.ts` — plan calls for `pendingLocaleAfterComplete` field + re-emit on complete. **DialogueBar.applyLocale() already handles the "post-complete refresh" branch**, so TypewriterEffect changes are optional for Phase 3 (en === pl placeholder means no visible mid-flight effect). Recommend skipping TypewriterEffect changes until Phase 4.

**Terminal extractions (Phase 3.4 — not started)**:

- `terminal/commandRegistry.ts` — change `description: string` → `description: BilingualText` per Phase 2 plan, OR (simpler) keep `description` but add `descriptionKey: StringKey` and render via `t()` at read time. **Recommend the second approach** since dictionary keys already exist (`terminal.cmd.me/time/bookmarks/quest/solve/hint/navi/support/badges`). Update `getAvailableCommands()` consumers in `commandHandler.ts` (`/help` output) and `SmartTerminal.svelte` (autocomplete + new-command notification).
- `terminal/commandHandler.ts` — replace every Polish literal in `cmdHelp` (header, "Pomoc w obsłudze"), `cmdMe` (header, ranga/poziom/xp labels, "Kolejne rangi:", "brakuje X XP", "odblokowana", "Osiągnięto najwyższą rangę!"), `cmdTime` (CHRONOMETR header, Data line, Cykl line + DZIENNY/NOCNY, Strefa line), `cmdQuest` + `cmdQuestEvent` (all narrative + objectives), `cmdSolve`, `cmdHint`, `cmdBookmarks` (header, empty), `cmdNavi` (header, "W TOKU", ETA, TERAZ), `cmdBadges` (header, "— pokaż odznakę", "Odznaka rangi" preview title), `cmdSupport` (header + active-header + uplink errors). Also the unknown-command fallbacks at top of `handleCommand`. All keys already exist in `i18n/terminal.ts`.
- `terminal/supportCommand.ts` — replace 11 inline literals (header, error states, token labels). All keys already exist.

**Svelte shells (Phase 3.5 — not started)**:

- `GameHud.svelte` — replace static literals: `title`/`aria-label` for home button (3 locations), `'Powrót do platformy'`, `'Logowanie'`, mute titles `'Włącz dźwięk'` / `'Wycisz'` (currently inline), `'Terminal'` button (×2), drawer `'Zaloguj się, aby zapisać postęp'`, `'Menu'` aria-label. Locale title/aria are already derived from `$locale` — fine. Use `import { t } from './i18n/store';` and `{$t('hud.homeButton')}` etc.
- `SmartTerminal.svelte` — replace `'UPLINK TERMINAL'` header (line ~245), boot strings (`'UPLINK v3.0/v2.1 — Kosmiczne Łącze Kwantowe'`, `'Sesja aktywna.'`), bottom hints (`'[↑↓] wybierz komendę'` / `'[Enter] zatwierdź'` / `'[Esc] zamknij'`), support flow (`'Wymagana aktywna sesja.'`, `'Zaloguj się, aby uzyskać dostęp do Centrum Wsparcia.'`, `'▸ Zaloguj się'`/`'Logowanie'`, `'Łączenie z Centrum Wsparcia...'`, `'BŁĄD połączenia z Centrum Wsparcia.'`), notification templates (`◆ Misja aktywowana: ...`, `✓ Misja ukończona: ...`, `▸ Nowa komenda dostępna: ...`).
- `PreviewOverlay.svelte` — `title = 'Notatki z podróży'` default (line ~12, 16) → `$t('preview.defaultTitle')` (note: `title` is a local variable populated from payload; default fallback uses `t('preview.defaultTitle')` via static `t()`).
- `GrantNotification.svelte` — `'Misja zaliczona!'` (line ~69), `+{totalXp} XP łącznie` (line ~86) → `$t('grant.questCompleted')` and `$t('grant.totalXp', { xp: totalXp })`.
- `terminal/TerminalLockScreen.svelte` — `'Witaj, Dexo!'` (line ~35), `'Blokada aktywna.'` / `'Podaj kod odblokowujący:'` (lines ~37-38), `'Nieprawidłowy kod.'` (line ~21), `'✨ Per Aspera Ad Astra ✨'` (line ~55) → `$t('terminal.lock*')`.
- `terminal/TerminalInput.svelte` — placeholder `'wpisz / aby zobaczyć komendy...'` (line ~104) → `$t('terminal.inputPlaceholder')`.
- `terminal/TerminalTokenBar.svelte` — `'Skopiowano ✓'` / `'Kopiuj token'` (line ~43), `'Generowanie...'` / `'Regeneruj token'` (line ~52) → `$t('terminal.tokenCopied/tokenCopy/tokenGenerating/tokenRegenerate')`.

**Out of scope (Phase 3) — confirmed by plan**:

- `MobileControls.svelte` aria-labels (Phase 3 deferred).
- `QaOverlay.svelte` (dev-only).
- `PreloaderScene.ts` (only brand + numeric).

**Automated verification (Phase 3.6 — not started)**:

- Run `npm run build --workspace=projects/edu-platform`, `npm run test --workspace=projects/edu-platform`, `npm run lint`. Fix any TypeScript errors (likely candidates: ArcadeScene's `gameRenderer?.applyLocale?.()` call before `applyLocale` is implemented in MemoryMatrix — currently optional on interface so fine; but verify Oscilloscope/AsteroidRange compile after their changes).
- Static-analysis Vitest test for hardcoded Polish characters — defer until end of Phase 3.

### Files Modified (Phase 3 so far)

- `src/explorers/i18n/{index.ts,store.ts,hud.ts,scene.ts,exam.ts,arcade.ts,terminal.ts,preview.ts,grant.ts}` (new).
- `src/explorers/scenes/{ExamScene,ArcadeScene,GameScene,DialogueScene}.ts` (locale listener + extractions).
- `src/explorers/systems/ArcadeTypes.ts` (renderer interface).
- `src/explorers/ui/{DialogueBar,InteractionPrompt,dialogueBarPresentation}.ts` (extractions + applyLocale).
- `src/explorers/arcade/MemoryMatrixRenderer.ts` (extractions, no applyLocale yet).

### Suggested resume command

```
/10x-implement @thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md phase 3
```

Resume points (in order):
1. Finish `OscilloscopeRenderer.ts` and `AsteroidRangeRenderer.ts` extractions + `applyLocale()` for all three arcade renderers.
2. Terminal: `commandRegistry.ts` (descriptionKey approach), `commandHandler.ts` (largest extraction), `supportCommand.ts`.
3. Svelte shells: `GameHud`, `SmartTerminal`, `PreviewOverlay`, `GrantNotification`, `Terminal*.svelte`.
4. Run `npm run build` + `npm run test` + `npm run lint`. Fix failures.

<!-- PLAN STATUS: Last Phase Completed: 3, Next Phase: 4, Updated: 2026-04-29 -->
<!-- Phase 3 fully completed 2026-04-28: all arcade renderers, terminal extractions, Svelte shells done. Build/tests pass. -->
<!-- Phase 2 remediation completed 2026-04-29: bilingual content schema migration done via thoughts/shared/plans/2026-04-28-explorers-localization-content-remediation.md. All content files (dialogues, exams, quests, ranks) use BilingualText. English translations filled in. Bilingual parity test passes. Build/tests/lint pass with no new errors. -->

