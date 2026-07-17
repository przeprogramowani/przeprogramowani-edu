# Space Explorers Localization — Phase 3 Shipping Plan

## Overview

Phase 2 (commit `82cca10d`) landed the bilingual content schema, the locale store, the i18n dictionaries, the `t()` helper, and the parity tests. **The toggle still does not work** — every chrome surface in the game (HUD, scenes, arcade renderers, dialogue UI, terminal output, every Svelte shell) hardcodes Polish strings. There is no `LOCALE_CHANGED` event, no PL/EN button, and no listener wiring. This plan finishes the work the original `2026-04-28-explorers-localization-en-pl.md` plan footer claimed was done but never executed.

## Current State Analysis

- The **content layer** is fully localized: 205+ dialogue lines, 45 exam fields, both quests, all 6 RANK_FLAVOR tiers — all bilingual, all reviewed-English, parity tests passing.
- The **dictionary layer** is fully authored: `src/explorers/i18n/{hud,scene,exam,arcade,terminal,preview,grant}.ts` plus `index.ts` (`t()` helper) and `store.ts` (Svelte derived `t`). All 217+ chrome keys have real English values.
- The **consumer layer** is empty: `rg -ln "applyLocale|onLocaleChanged|attachLocaleListener|LOCALE_CHANGED|pendingLocaleSwap" src/explorers/` returns **zero matches**. Only `localized()` (content) is consumed today.
- **Test status (post-`82cca10d`)**: 132/132 explorers tests passing; build green.
- **Reference docs**:
  - Audit: `thoughts/shared/research/2026-04-29-explorers-localization-completion-status.md`
  - Original plan (footer is misleading): `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md`

### Key Discoveries

- **`getLocale()` already works at boot**: every consumer that already calls `localized()` (DialogueBar, ExamScene reads, commandHandler reads, DialogueManager effects, ranks) reads the persisted locale synchronously at `create()`. `LOCALE_CHANGED` only needs to fire on **runtime user toggle**, not on boot.
- **`scenes/BaseScene.ts` is 67 lines** and has no locale awareness — adding the hook + listener attach/detach there gives every subclass a free no-op default.
- **`ExamScene` and `ArcadeScene` already rebuild on resize** via `clearUI()` paths (`ExamScene.ts:47-54, 469`, `ArcadeScene.ts:637-642`) — the locale handler reuses these paths; no new render code.
- **`GameScene.update()` recomputes interaction prompts every frame**, so once `[E] Zobacz` etc. switch to `t('scene.interactionLook')`, the next frame after toggle picks up the new locale automatically — no listener override needed for the prompt path.
- **`DialogueBar.ts` already imports `localized` for content reads**; only the `[Spacja] dalej ▸` advance hint and speaker labels need extraction, plus an `applyLocale()` method.
- **`OscilloscopeRenderer.DIFFICULTY_CONFIG`** stores `label: string` evaluated at module load. The fix is `label: string` → `labelKey: 'arcade.osc.paramAmplitude' | …` resolved via `t(labelKey)` at render time inside `updateParamDisplay()`. This is the only schema-shape change needed in arcade renderers.
- **`commandRegistry.ts`** stores `description: string` per command. Cheapest fix: add `descriptionKey: StringKey` field, leave `description` for the dev-only fallback, render `t(descriptionKey)` in `/help` output and `SmartTerminal.svelte` autocomplete.

## Desired End State

After this plan completes:

1. A PL/EN toggle button on the HUD flips the entire game between Polish and English instantly.
2. Every player-facing surface inside `src/explorers/` renders in the active locale: HUD chrome, terminal output, dialogues, exams, arcade chrome and renderers, GameScene cinematic, preview overlay, grant notifications, terminal lock screen.
3. `localStorage` persists the choice; reload restores it.
4. Mid-flight swaps apply instantly except in three risky zones (typewriter mid-line, arcade `playing` phase, GameScene cinematic intro), which defer to the next clean boundary.
5. A static-analysis Vitest test scans `src/explorers/**/*.{ts,svelte}` (excluding `i18n/`, `levels/`, tests) for hardcoded Polish characters in string literals — fails CI if a new untranslated literal sneaks in.
6. `projects/edu-platform/CLAUDE.md` and `.ai/10x-devs/game/cookbook.md` document the contributor workflow for adding new strings.

## What We're NOT Doing

- **No marketing surfaces**: `/courses` Space Explorers card, badge OG share, study-notes page — out of scope, Polish-only by design.
- **No `GameState` schema bump**: locale lives in `localStorage` only, mirroring `AudioManager` mute precedent. No KV/Supabase migration.
- **No `profiles.locale` column**: localStorage only.
- **No `navigator.language` detection**: first-boot default stays `pl`.
- **No mobile aria-label translation** (`MobileControls.svelte`): tracked as a follow-up, not in scope.
- **No `QaOverlay.svelte` translation**: dev-only.
- **No transcript translation in terminal**: lines already printed before a swap stay in their original locale; only future output uses the new locale.
- **No `TypewriterEffect` deferral logic in this ship**: `DialogueBar.applyLocale()` already handles the post-complete refresh branch; the visible flicker on mid-line swap is acceptable for v1. Revisit if QA flags it.
- **No AskUserQuestion gates between phases**: stop only for the manual confirmation gate after Phase 1 (verify the toggle persists + emits before the bigger extractions).

## Implementation Approach

Build the missing wiring in the order of `bus → consumers → polish`:

1. **Phase 1 wrap-up** (Section A): `LOCALE_CHANGED` bus event, store→bus subscription in `PhaserGame.svelte`, PL/EN button in `GameHud.svelte`, `BaseScene.onLocaleChanged()` no-op hook + listener attach/detach.
2. **Scene + UI extractions** (Sections B–D): replace inline Polish chrome literals with `t(key)` calls; add `applyLocale()` overrides to scenes/renderers that need re-render; gate risky zones with `pendingLocaleSwap`.
3. **Terminal extractions** (Section E): the largest mechanical pass; `commandRegistry.descriptionKey`, `commandHandler` chrome strings, `supportCommand`.
4. **Svelte shells** (Section F): import the derived `t` store, replace literals with `{$t('...')}`.
5. **QA + launch** (Section G): mid-flight swap matrix, viewport fit pass, edge-case sweep, static-analysis test, docs.

## Critical Implementation Details

### Timing & Lifecycle

- **Boot**: scenes call `getLocale()` synchronously inside `create()`; persisted locale is read before any render. `LOCALE_CHANGED` does not fire on boot.
- **Runtime toggle**: Svelte handler → `setLocale()` → `locale.set()` → subscriber writes `localStorage` + (after Phase 1) `PhaserGame.svelte` subscriber emits `game.events.emit(LOCALE_CHANGED, { locale })`.
- **Listener lifecycle**: `BaseScene.create()` attaches; `BaseScene.shutdown()` detaches. Scenes must detach before destruction or risk handlers firing on dead scenes.

### Re-render Policy by Scene Type

| Scene/component | Pattern | Why |
|---|---|---|
| `ExamScene` | `clearUI()` + `renderQuestion()` (or `showResults()`) | Already rebuilds on resize; reuse the same path. |
| `ArcadeScene` | `clearUI()` + `renderCurrentPanel()`; defer when `phase === 'playing'` | Mid-round swap would scramble player state; wait for round end. |
| `GameScene` | Reassert prompts in next `update()` tick; full re-render gated on `!introPlaying` | Per-frame prompts auto-refresh; cinematic deferral protects tweens. |
| `DialogueScene` | `dialogueBar.applyLocale()` | DialogueBar owns retained refs. |
| `DialogueBar` | `applyLocale()` re-renders speaker/hint immediately, body only when typewriter is complete | Prevents mid-line corruption. |
| Arcade renderers (Memory/Oscilloscope/AsteroidRange) | `applyLocale()` re-runs `setText` on cached refs | Retained refs; no re-instantiation needed. |

### Deferral Seams

- **`ArcadeScene`**: `pendingLocaleSwap` flag. On `LOCALE_CHANGED` while `phase === 'playing'`, set flag and bail. On round-end transition (`onGameEnd` / `dismissGame`), drain the flag with `clearUI()` + `renderCurrentPanel()`.
- **`GameScene`**: same pattern, gated on `introPlaying`. Drain when cinematic completes.
- **`DialogueBar`**: `applyLocale()` checks `typewriter.isComplete()`; re-renders body only if complete; speaker/hint refresh always.

### State Sequencing

```
User clicks button
  ↓
Svelte handler → toggleLocale()
  ↓
locale.set(next) → writable update
  ↓
1. localStorage subscriber writes 'space-explorers-locale'
2. Svelte components consuming $t reactively re-render
3. PhaserGame.svelte subscriber: game.events.emit(LOCALE_CHANGED, { locale })
  ↓
Each Phaser scene's BaseScene listener fires onLocaleChanged({ locale })
  ↓
- ExamScene/ArcadeScene/GameScene/DialogueScene each apply their override
- Risky-zone owners stash pending; apply at next clean boundary
```

### Debug & Observability

- `devLog('[Locale] changed pl → en')` already exists in `utils/locale.ts:setLocale`.
- Add `devLog('[Locale] deferring swap (zone=arcade-playing)')` and `devLog('[Locale] applying deferred swap')` at deferral seams.
- No production telemetry. If toggle adoption matters post-launch, add an analytics event in a follow-up.

---

## Phase A: Locale infrastructure wrap-up + HUD toggle

### Overview

Land the bus event, store→bus bridge, HUD button, and `BaseScene` hook. After Phase A the toggle button persists, emits an event, but does not visibly change anything in-game (no consumer is wired yet).

### Changes Required

#### A1. `LOCALE_CHANGED` event + payload

**File**: `src/explorers/events/GameEvents.ts`

```ts
// In GameEvents constant (existing dictionary):
LOCALE_CHANGED: 'locale:changed',

// At end of file, add to existing payload union types:
import type { Locale } from '../utils/locale';

export interface LocaleChangedPayload {
  locale: Locale;
}
```

#### A2. Store→bus wiring in `PhaserGame.svelte`

**File**: `src/explorers/PhaserGame.svelte`

Add to imports:
```ts
import { locale, initLocaleStore } from './utils/locale';
import { GameEvents } from './events/GameEvents';
```

Inside `onMount`, after `game = new Phaser.Game(...)`:
```ts
const cleanupLocaleStore = initLocaleStore();
const unsubscribeLocale = locale.subscribe((value) => {
  if (!game) return;
  game.events.emit(GameEvents.LOCALE_CHANGED, { locale: value });
});
```

Inside `onDestroy`:
```ts
unsubscribeLocale();
cleanupLocaleStore();
```

#### A3. PL/EN button in `GameHud.svelte`

**File**: `src/explorers/GameHud.svelte`

Add to script:
```ts
import { locale, toggleLocale } from './utils/locale';

function onToggleLocale(event: MouseEvent) {
  blurHudButton(event);
  toggleLocale();
}
```

Add to desktop hotkey cluster (adjacent to mute button, around the existing mute button block):
```svelte
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
```

Mirror in mobile right cluster + drawer. Add styles:
```svelte
<style>
  .hotkey-locale { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }
  .locale-active { font-weight: 700; color: var(--hud-active-color, currentColor); }
  .locale-divider { opacity: 0.4; margin: 0 2px; }
</style>
```

#### A4. `BaseScene.onLocaleChanged` hook

**File**: `src/explorers/scenes/BaseScene.ts`

Inside `create()`, after existing event subscriptions:
```ts
this.bus.on(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);
```

Inside `shutdown()`:
```ts
this.bus.off(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);
```

Add the no-op default (subclasses override):
```ts
protected onLocaleChanged(_payload: LocaleChangedPayload): void {
  // no-op; subclasses override
}
```

### Success Criteria

#### Automated

- [ ] `npm run build --workspace=projects/edu-platform` passes
- [ ] `npm run test --workspace=projects/edu-platform` passes (132+ tests)
- [ ] `npm run lint` clean

#### Manual (gate before Phase B)

- [ ] HUD shows `PL / EN` button on desktop and mobile drawer.
- [ ] Click toggles which side is bold; `localStorage.getItem('space-explorers-locale')` flips.
- [ ] Reload restores choice.
- [ ] Temporarily add `console.log('[bus] LOCALE_CHANGED', payload)` to a scene's `onLocaleChanged` override; verify it fires on click.
- [ ] No console errors. `[Locale] changed pl → en` devLog appears in dev mode.
- [ ] Toggle does not steal focus from terminal input.

**Stop here for manual confirmation before Phase B.** No game text changes yet — that is the expected end state.

---

## Phase B: Phaser scene + dialogue UI extractions

### Overview

Replace inline Polish chrome literals in `ExamScene`, `ArcadeScene`, `GameScene`, `DialogueScene`, `DialogueBar`, `InteractionPrompt`, and `dialogueBarPresentation` with `t(key)` calls. Wire `onLocaleChanged()` overrides for each scene that needs explicit re-render.

### Changes Required

#### B1. `ExamScene.ts`

Replace inline literals with keys from `i18n/exam.ts` (already authored):
- `:243` `'Wybierz wszystkie pasujące:'` → `t('exam.selectAllMatching')`
- `:350,687` `'Zamknij'` → `t('exam.close')`
- `:520` `'EGZAMIN ZALICZONY' / 'EGZAMIN NIEZALICZONY'` → `t('exam.passed') / t('exam.failed')`
- Any remaining `'Następne →'`, `'← Poprzednie'`, `'Zakończ egzamin'`, `'Wymagane: …'`, `'Spróbuj ponownie'` → corresponding `t('exam.*')` keys.
- Mixed title prefix: replace `'EGZAMIN: ${localized(exam.title)}'` with `t('exam.titlePrefix', { title: localized(exam.title) })` (verify the key in `i18n/exam.ts`; add if missing).

Override:
```ts
protected override onLocaleChanged(): void {
  if (!this.scene.isActive()) return;
  this.clearUI();
  if (this.showingResults) this.showResults();
  else this.renderQuestion();
}
```

#### B2. `ArcadeScene.ts`

Replace inline literals with keys from `i18n/arcade.ts`:
- Score/timer: `:339` `'WYNIK: 0'` → `t('arcade.scoreLabelInitial')`; `'WYNIK: ${score}'` → `t('arcade.scoreLabel', { score })`; `'CZAS: ${seconds}'` → `t('arcade.timerLabel', { seconds })`.
- Intro chrome: `'Poziom: ★…'`, `'[Enter] Start'`, `'[ESC] Wyjdź'`.

Override:
```ts
protected pendingLocaleSwap = false;

protected override onLocaleChanged(): void {
  if (this.phase === 'playing') {
    this.pendingLocaleSwap = true;
    this.gameRenderer?.applyLocale?.();
    return;
  }
  this.applyLocaleSwap();
}

private applyLocaleSwap(): void {
  this.clearUI();
  this.renderCurrentPanel();
}
```

In `onGameEnd()` and `dismissGame()`, drain the flag:
```ts
if (this.pendingLocaleSwap) {
  this.pendingLocaleSwap = false;
  this.applyLocaleSwap();
}
```

#### B3. `GameScene.ts`

Replace `:418-422` interaction-prompt assignments:
```ts
let promptLabel = t('scene.interactionLook');
if (nearest.objectType === 'door') promptLabel = t('scene.interactionDoor');
if (nearest.objectType === 'exam') promptLabel = t('scene.interactionExam');
if (nearest.objectType === 'arcade') promptLabel = t('scene.interactionArcade');
if (nearest.objectType === 'npc') promptLabel = t('scene.interactionNpc');
```

Replace cinematic intro chrome (`:608-617, 619-629, 706-737`) with `t('scene.*')` keys (`scene.endTitle`, `scene.endCta`, plus the rest of the cinematic block — keys exist).

Override:
```ts
private pendingLocaleSwap = false;

protected override onLocaleChanged(): void {
  if (this.introPlaying) {
    this.pendingLocaleSwap = true;
    return;
  }
  this.refreshLocaleSensitiveText();
}
```

`refreshLocaleSensitiveText()` re-`setText`s any retained refs in the cinematic and end-screen path. Per-frame interaction prompts auto-refresh from `update()`.

When the intro completes (existing handler), drain `pendingLocaleSwap`.

#### B4. `DialogueScene.ts`

Override:
```ts
protected override onLocaleChanged(): void {
  this.dialogueBar?.applyLocale();
}
```

#### B5. `DialogueBar.ts`

Add `applyLocale()`:
```ts
applyLocale(): void {
  if (!this.activeLine) return;
  this.refreshSpeakerAndHint();
  if (this.typewriter.isComplete()) {
    this.bodyText.setText(localized(this.activeLine.text));
  }
}

private refreshSpeakerAndHint(): void {
  const presentation = getSpeakerDisplay(this.activeLine.speaker);
  this.speakerText.setText(presentation.label);
  this.hintText.setText(t('scene.dialogueAdvanceHint'));
}
```

Cache `activeLine` ref.

#### B6. `dialogueBarPresentation.ts`

Replace `ADVANCE_HINT_TEXT` constant with a function that calls `t('scene.dialogueAdvanceHint')` at render time. `getSpeakerDisplay` returns `t('scene.speakerAstronaut' | 'scene.speakerSystem')` (keys exist).

#### B7. `InteractionPrompt.ts`

Replace `:16,28` `'[E] Interakcja'` defaults with `t('scene.interactionDefault')`. No listener — `GameScene.update()` reasserts every frame.

### Success Criteria

#### Automated

- [ ] Build + tests + lint clean
- [ ] No new TypeScript errors

#### Manual

- [ ] In `pl`, behaviour identical to before this phase.
- [ ] Toggle to `en` mid-game: HUD chrome flips immediately; ExamScene flips on next render or via `onLocaleChanged`; GameScene interaction prompts flip on next frame; cinematic holds if `introPlaying`.
- [ ] Toggle during dialogue: current line completes in original locale; speaker label and hint flip immediately; body re-renders to new locale only when line completes.
- [ ] Toggle during arcade `playing`: HUD flips; arcade canvas waits until round end.
- [ ] No console errors.

---

## Phase C: Arcade renderers

### Overview

Extract the three arcade renderers' inline literals and wire `applyLocale()` so `ArcadeScene.onLocaleChanged()` can call into them.

### Changes Required

#### C1. `systems/ArcadeTypes.ts`

Add to `ArcadeGameRenderer`:
```ts
applyLocale?(): void;
```

#### C2. `arcade/MemoryMatrixRenderer.ts`

Extract header/hint/feedback/transmission strings → `t('arcade.mm.*')` (keys exist). Add:
```ts
applyLocale(): void {
  this.refreshActivePhaseText();
}
```

#### C3. `arcade/OscilloscopeRenderer.ts`

Schema change:
```ts
type ParamConfig = {
  key: 'amplitude' | 'frequency' | 'phase' | 'offset';
  labelKey: 'arcade.osc.paramAmplitude' | 'arcade.osc.paramFrequency' | 'arcade.osc.paramPhase' | 'arcade.osc.paramOffset';
  min: number;
  max: number;
  step: number;
};
```

Replace `label: 'Amplituda'` (5 instances at `:29,37,46,55,65`) with `labelKey: 'arcade.osc.paramAmplitude'` (and matching for the other params). Inside `updateParamDisplay()`, resolve via `t(param.labelKey)`.

Extract:
- `:258` `'[W/S] zmień parametr\\n[A/D] dopasuj  [Enter] zatwierdź'` → `t('arcade.osc.controls')`
- `:392` `'Zatwierdzone! [Enter] zakończ'` → `t('arcade.osc.submittedHint')`
- `:542` `'Dopasowanie: ???'` → `t('arcade.osc.matchUnknown')`
- `:551` `` `Dopasowanie: ${this.matchPercent}%` `` → `t('arcade.osc.matchKnown', { percent: this.matchPercent })`

Add:
```ts
applyLocale(): void {
  this.updateParamDisplay();
  this.hintText?.setText(t('arcade.osc.controls'));
}
```

#### C4. `arcade/AsteroidRangeRenderer.ts`

Extract:
- `:131` `'STRZELNICA ASTEROIDÓW'` → `t('arcade.ast.title')`
- `:153` `'[WASD] celuj   [SPACE] strzelaj'` → `t('arcade.ast.controls')`
- `:381-388` `updateStatusText()`: `'GOTOWY'` / `` `LADOWANIE ${cooldownLeft}ms` `` → `t('arcade.ast.statusReady') / t('arcade.ast.statusCooldown', { ms: cooldownLeft })`. Two-line status template → `t('arcade.ast.statusLine', { … })`.

Add:
```ts
applyLocale(): void {
  this.titleText.setText(t('arcade.ast.title'));
  this.hintText.setText(t('arcade.ast.controls'));
  this.updateStatusText();
}
```

### Success Criteria

#### Automated

- [x] Build + tests + lint clean

#### Manual

- [ ] MemoryMatrix in `en`: header, memorize hint, controls, feedback all read English.
- [ ] Oscilloscope in `en`: parameter labels (Amplitude/Frequency/Phase/Offset), controls, match readout all read English.
- [ ] AsteroidRange in `en`: title, controls, status (READY / RELOADING) all read English.
- [ ] Toggle during arcade `playing` defers; on round end, panel rebuilds in new locale.

---

## Phase D: Terminal extractions

### Overview

Largest extraction surface. `commandRegistry`, `commandHandler`, `supportCommand`. All keys already exist in `i18n/terminal.ts`.

### Changes Required

#### D1. `terminal/commandRegistry.ts`

Add `descriptionKey: StringKey` field to each command entry. Existing `description: string` becomes the dev-only fallback (or remove entirely if no consumer needs it). Update `getAvailableCommands()` shape to include `descriptionKey`.

Update consumers:
- `commandHandler.ts` `cmdHelp` rendering: read `t(command.descriptionKey)`
- `SmartTerminal.svelte` autocomplete + new-command notification: same

#### D2. `terminal/commandHandler.ts`

Replace every inline Polish chrome literal with `t('terminal.*')` calls. Per the original plan, the keys exist under:
- `terminal.help.*` (header, "Pomoc w obsłudze")
- `terminal.me.*` (PROFIL ASTRONAUTY header, ranga/poziom/xp labels, "Kolejne rangi:", "brakuje X XP", "odblokowana", "Osiągnięto najwyższą rangę!")
- `terminal.time.*` (CHRONOMETR header, Data line, Cykl + DZIENNY/NOCNY, Strefa)
- `terminal.quest.*`, `terminal.solve.*`, `terminal.hint.*`
- `terminal.bookmarks.*` (header, empty-state)
- `terminal.navi.*` (header, "W TOKU", ETA, TERAZ)
- `terminal.badges.*` (header, "— pokaż odznakę", "Odznaka rangi")
- `terminal.support.*` (header + active-header + uplink errors)
- `terminal.unknown.*` (fallbacks at top of `handleCommand`)

Estimated 70-100 string sites.

#### D3. `terminal/supportCommand.ts`

Replace 11 inline literals (header, error states, token labels) with `t('terminal.support.*')`.

### Success Criteria

#### Automated

- [x] Build + tests + lint clean

#### Manual

- [ ] In `en`, run `/help` → English command descriptions.
- [ ] `/me`, `/time`, `/quest`, `/solve`, `/hint`, `/bookmarks`, `/navi`, `/badges`, `/support` → all output in English.
- [ ] Unknown command fallback in English.
- [ ] Switch locale mid-session: prior transcript stays Polish; new commands render English. (Expected behaviour per UX decision.)

---

## Phase E: Svelte shells

### Overview

Wire the Svelte derived `t` store into the six remaining Svelte components. Each gets one import line + literal replacements.

### Changes Required

For each file below, add at the top of the script block:
```ts
import { t } from './i18n/store';
```
(adjust path; some are nested in `terminal/`).

Then replace literals with `{$t('...')}`.

#### E1. `SmartTerminal.svelte`

Replace:
- `'UPLINK TERMINAL'` (header)
- `'UPLINK v3.0/v2.1 — Kosmiczne Łącze Kwantowe'`, `'Sesja aktywna.'` (boot strings)
- Bottom hints: `'[↑↓] wybierz komendę'`, `'[Enter] zatwierdź'`, `'[Esc] zamknij'`
- Support flow: `'Wymagana aktywna sesja.'`, `'Zaloguj się, aby uzyskać dostęp do Centrum Wsparcia.'`, `'▸ Zaloguj się'`, `'Logowanie'`, `'Łączenie z Centrum Wsparcia...'`, `'BŁĄD połączenia z Centrum Wsparcia.'`
- Notification templates: `◆ Misja aktywowana: …`, `✓ Misja ukończona: …`, `▸ Nowa komenda dostępna: …`

#### E2. `PreviewOverlay.svelte`

`:12` and `:16` `'Notatki z podróży'` defaults → static `t('preview.defaultTitle')` (since `title` is a local variable, the static form is fine here).

#### E3. `GrantNotification.svelte`

- `:69` `'Misja zaliczona!'` → `{$t('grant.questCompleted')}`
- `:86` `+{totalXp} XP łącznie` → `{$t('grant.totalXp', { xp: totalXp })}`

#### E4. `terminal/TerminalLockScreen.svelte`

Replace:
- `'Witaj, Dexo!'`, `'Blokada aktywna.'`, `'Podaj kod odblokowujący:'`, `'Nieprawidłowy kod.'`, `'✨ Per Aspera Ad Astra ✨'`

#### E5. `terminal/TerminalInput.svelte`

`:104` placeholder `'wpisz / aby zobaczyć komendy...'` → `{$t('terminal.inputPlaceholder')}`.

#### E6. `terminal/TerminalTokenBar.svelte`

`:43,52` four labels → `{$t('terminal.tokenCopied|tokenCopy|tokenGenerating|tokenRegenerate')}`.

#### E7. `GameHud.svelte` (also)

Replace its existing static literals (separate from Phase A's button addition):
- `'Powrót do platformy'` (×3 home button title/aria)
- `'Logowanie'` (signup CTA)
- Mute titles `'Włącz dźwięk'` / `'Wycisz'` (currently inline; switch to keys)
- `'Terminal'` button (×2)
- Drawer `'Zaloguj się, aby zapisać postęp'`
- `'Menu'` aria-label

Locale title/aria from Phase A already use `$locale` directly — leave those.

### Success Criteria

#### Automated

- [x] Build + tests + lint clean

#### Manual

- [ ] Toggle to `en`: SmartTerminal header, hints, support flow read English.
- [ ] PreviewOverlay default title reads English.
- [ ] GrantNotification mission-complete + XP line reads English.
- [ ] TerminalLockScreen reads English.
- [ ] TerminalInput placeholder reads English.
- [ ] TerminalTokenBar buttons read English.
- [ ] HUD home button title/aria, signup CTA, mute titles, terminal button, drawer copy all read English.

---

## Phase F: QA, static analysis, launch readiness

### Overview

Full play-through both locales, mid-flight swap matrix, viewport fit, edge cases, regression-guard test, docs.

### Changes Required

#### F1. Mid-flight swap matrix (manual)

Run each scenario, confirm against spec:
- Toggle during `m0-awakening` cinematic intro → cinematic holds; end-screen renders in new locale.
- Toggle during dialogue with typewriter active → current line completes in original; next renders new.
- Toggle during arcade `playing` → HUD chrome flips; playfield holds; round-end applies pending.
- Toggle during exam mid-question → panel rebuilds in new locale; selected option preserved (keyed by `option.id`).
- Toggle in terminal mid-typing → input doesn't lose focus; placeholder updates; transcript stays mixed.
- Toggle during boot before any scene fully created → no race; persisted locale picked up on first paint.

#### F2. Visual fit pass

- 1920×1080, 1366×768, 768×1024 (mobile portrait).
- Surfaces: exam questions, arcade chrome (MemoryMatrix headers, Oscilloscope param labels), GameScene cinematic title/subtitle, DialogueBar body. Flag overflow.

#### F3. Edge cases

- Anonymous: toggle works, persists, no `/api/game/state` mutation.
- Authenticated: same; no Supabase / KV writes for locale.
- Incognito: works in-session; doesn't persist across window close.
- localStorage disabled: defaults to `pl` per fresh load; no thrown exceptions.
- Browser back/forward `/explorers` ↔ `/courses`: locale survives.

#### F4. Static-analysis Vitest test (regression guard)

**File**: `src/explorers/i18n/noHardcodedPolish.test.ts` (new)

Scan `src/explorers/**/*.{ts,svelte}` excluding `i18n/`, `levels/`, `*.test.ts`, `__tests__/`. Match string literals containing Polish-specific characters (`ąćęłńóśźż` plus capitals). Fail with the file:line:offending-string list.

Implementation sketch:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'glob';

const POLISH_CHARS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
const STRING_LITERAL = /(['"`])((?:\\.|(?!\1).)*?)\1/g;

describe('no hardcoded Polish in explorers chrome', () => {
  it('finds zero offending literals', () => {
    const files = globSync('src/explorers/**/*.{ts,svelte}', {
      ignore: [
        'src/explorers/i18n/**',
        'src/explorers/levels/**',
        'src/explorers/**/*.test.ts',
        'src/explorers/__tests__/**',
      ],
    });
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const lines = src.split('\n');
      lines.forEach((line, idx) => {
        const matches = line.matchAll(STRING_LITERAL);
        for (const m of matches) {
          if (POLISH_CHARS.test(m[2])) {
            offenders.push(`${file}:${idx + 1}: ${m[0]}`);
          }
        }
      });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
```

Allowlist mechanism (a `// i18n-allow` trailing comment on offending lines) if any intentional cases survive.

#### F5. Documentation

**File**: `projects/edu-platform/CLAUDE.md`

Add to Key Constraints:
> **Localization**: All player-facing strings in `src/explorers/` must use `t()` for chrome (HUD, scene labels, terminal output) or `BilingualText` for content (dialogues, exams, quests). Adding a new string requires both `pl` and `en` values; the parity tests + static-analysis test will fail otherwise.

**File**: `.ai/10x-devs/game/cookbook.md`

Add a section "Adding a localized string":
- For chrome: pick the right `i18n/*.ts` module, add `pl` + `en` keys with matching interpolation slots, call `t('module.key', params?)`.
- For content (dialogue line / exam question / quest field): use `{ pl: '...', en: '...' }` shape; bilingual parity test enforces non-empty + distinct.
- For risky-zone work (typewriter, arcade `playing`, cinematic): describe the deferral pattern with `pendingLocaleSwap` flag drained on next clean boundary.

#### F6. Final commit + deploy

Stage everything. Commit grouping suggestion: one commit per phase letter (A–E), one for QA + static-analysis test + docs (F).

### Success Criteria

#### Automated

- [x] All tests pass (parity + static-analysis + regression suite)
- [x] Build + lint clean
- [ ] Preview deploy succeeds

#### Manual

- [ ] Full play-through in `pl` reads identically to baseline (no behavior changes).
- [ ] Full play-through in `en` reads naturally end-to-end; no untranslated stragglers in scope.
- [ ] All 5 mid-flight swap scenarios behave per spec.
- [ ] No visual overflow in `en` across the 3 viewports.
- [ ] Edge cases all behave correctly.
- [ ] CLAUDE.md and cookbook updates land.
- [ ] No console errors.

---

## Effort Estimate

| Phase | Description | Estimate |
|---|---|---|
| A | Bus event + store→bus + HUD button + BaseScene hook | 0.5 session |
| B | Scene + dialogue UI extractions | 1.5 sessions |
| C | Arcade renderers | 1 session |
| D | Terminal extractions (largest mechanical pass) | 1 session |
| E | Svelte shells | 1 session |
| F | QA + static-analysis + docs + launch | 1 session |

**Total: ~6 sessions.** Translation reviewer time **not** required — translations already in place.

## Migration Notes

- No KV/Supabase migration; localStorage only.
- No `GameState` schema change.
- `scripts/i18n-migrate-content.ts` already shipped in `82cca10d`; can be removed after Phase F lands (or kept as cheap insurance for future content additions).

## References

- Audit / current state: `thoughts/shared/research/2026-04-29-explorers-localization-completion-status.md`
- Original 5-phase plan: `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md`
- Content remediation plan: `thoughts/shared/plans/2026-04-28-explorers-localization-content-remediation.md`
- Phase 2 commit: `82cca10d`
- Locale store: `src/explorers/utils/locale.ts`
- Dictionaries: `src/explorers/i18n/{hud,scene,exam,arcade,terminal,preview,grant}.ts`
- Bus: `src/explorers/events/GameEvents.ts`
- HUD: `src/explorers/GameHud.svelte`
- BaseScene: `src/explorers/scenes/BaseScene.ts`

<!-- PLAN STATUS: Last Phase Completed: F (automated portions; manual QA + preview deploy still pending), Next Phase: F-manual, Updated: 2026-04-29 -->
