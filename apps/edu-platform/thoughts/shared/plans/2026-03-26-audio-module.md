# Audio Module Implementation Plan

## Overview

Add a Phaser-compatible, event-driven audio system to 10x Explorers supporting: global background music, arcade game music, sound effects (shooting, XP, quests, rank-up), dialogue typewriter blips, and a mute toggle in the HUD. Audio assets will be provided by the user — the module defines placeholder keys and paths only.

## Current State Analysis

- **Zero audio implementation** exists in the codebase
- Phaser WebAudio is already enabled: `gameConfig.ts:23-25`
- `AssetManifest.ts:4` only supports `'image' | 'spritesheet' | 'tilemapJSON'`
- `GameEvents.ts` provides 15+ events that map directly to audio triggers
- `GameHud.svelte` demonstrates the established Svelte-Phaser HUD pattern (prop-based game ref, event subscriptions in onMount, cleanup in onDestroy)
- `TypewriterEffect.ts:34` reveals characters one-by-one via a Phaser timer — the exact hook point for blip sounds
- Arcade renderers receive `scene: Phaser.Scene` in `create()` and can access `scene.game.registry`

### Key Discoveries:

- `TypewriterEffect.ts:30-44` — Timer-based loop, ~33ms/char. No per-character callback exists; needs an `onCharRevealed` hook
- `DialogueScene.ts:58` — `showDialogue()` entry point for music ducking
- `DialogueScene.ts:116` — `DIALOGUE_DISMISSED` emitted in `finishDialogue()` for duck restore
- `TransitionScene.ts:63-85` — 300ms fade-in → 200ms load → 300ms fade-out timeline for music crossfade
- `GameStateManager.ts:50` — `saveState()` serializes to localStorage. Mute pref will use a separate localStorage key to avoid GameState version migration
- `PhaserGame.svelte:331-332` — GameHud receives `game` as Svelte prop
- `ArcadeTypes.ts:48` — `create(scene, config, bounds)` gives renderers scene access

## Desired End State

After implementation:
1. A single `AudioManager` module manages all audio playback
2. Global background music plays on loop, crossfades during map transitions
3. Arcade scenes switch to dedicated arcade music, resume background on dismiss
4. SFX fire on game events (XP gain, quest complete, rank up, exam pass/fail)
5. Arcade renderers play SFX directly (laser shot, asteroid hit, miss, etc.)
6. Dialogue typewriter produces throttled blip sounds (~every 2-3 chars)
7. Music ducks to ~30% volume during dialogue
8. HUD has a mute toggle button; mute state persists in localStorage
9. Dropping audio files into `public/game/audio/` is all that's needed to hear sounds

### Verification:
- Drop a test `.ogg` file into `public/game/audio/music/` as `bg-exploration.ogg`
- Launch the game — background music should play
- Click mute button in HUD — music stops, icon changes
- Reload page — mute preference persists
- Enter arcade — music switches to arcade track
- Exit arcade — background music resumes
- Trigger dialogue — music ducks, typewriter blips play
- Complete a quest — SFX plays

## What We're NOT Doing

- Per-map background tracks (single global track for now)
- Volume slider UI (mute toggle only; volume slider is a future enhancement)
- Spotlight reveal audio cue (separate concern)
- Audio for terminal interactions
- GameState version migration (mute stored in separate localStorage key)
- MP3 fallbacks (OGG is sufficient for all modern browsers)

## Implementation Approach

Module-scoped singleton `AudioManager` initialized from `BootScene`, wired to the `GameEvents` bus for music/SFX lifecycle. Arcade renderers import the singleton directly for low-latency SFX. TypewriterEffect gets an `onCharRevealed` callback for throttled blips. HUD mute button follows the existing `GameHud.svelte` pattern.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **AudioManager initialization**: Must happen in `BootScene.create()` AFTER Phaser's sound system is ready. The `game.sound` SoundManager is available after the game boots.
- **Asset preloading**: All audio assets loaded in `PreloaderScene.preload()` via `scene.load.audio()`. Phaser handles decode/buffer creation.
- **Music crossfade on transition**: `TRANSITION_START` triggers fade-out (300ms), `TRANSITION_COMPLETE` triggers fade-in (300ms) — matching the existing visual fade timeline.
- **Dialogue duck/restore**: `DIALOGUE_SHOW` ducks music to 30% over 200ms. `DIALOGUE_DISMISSED` restores to 100% over 200ms.
- **Typewriter blip throttle**: A cooldown timer (~80ms) prevents overlapping blips. At 30 chars/sec, this means roughly every 2-3 characters trigger a sound.

### User Experience Specification

- **Mute button**: Appears in `hud-right` section of GameHud, styled like existing `.hotkey` buttons. Speaker icon (unmuted) / speaker-off icon (muted). Always visible — no flag gating.
- **Mute behavior**: Toggles ALL audio (music + SFX). `game.sound.mute` is the single control.
- **First-visit**: Audio starts unmuted unless localStorage has `audio-muted: true`.
- **Loading**: No special loading state — audio files load during PreloaderScene progress bar (already shows percentage).

### Performance & Optimization Strategy

- **Lazy loading**: NOT used initially — all audio loads in PreloaderScene. Total budget is small (< 5MB expected). Can revisit if assets grow.
- **SFX pooling**: Phaser's `SoundManager.play()` handles overlapping sounds natively. No manual pooling needed.
- **Blip throttle**: Simple timestamp comparison, no Phaser timer needed.

### State Management Sequencing

- **Mute persistence**: Stored in `localStorage` under key `space-explorers-audio-muted`. Read on `AudioManager.init()`, written on toggle.
- **Music state machine**: `idle → playing → fading-out → fading-in → playing`. Prevents double-play or interrupted crossfades.
- **Event ordering**: AudioManager subscribes to bus events in `init()` and never unsubscribes (singleton lifetime = game lifetime).

### Debug & Observability Plan

- **devLog**: All AudioManager actions logged via existing `devLog()` utility (e.g., `[AudioManager] Playing music: bg-exploration`, `[AudioManager] Muted: true`)
- **Verification**: Drop any `.ogg` file matching a key path to hear it immediately
- **Missing asset handling**: If an audio key isn't loaded, `playSfx()`/`playMusic()` silently no-ops with a `devLog` warning. No runtime errors.

---

## Phase 1: AudioManager Core + Asset Infrastructure + HUD Mute Button

### Overview

Create the AudioManager singleton, define all audio keys/paths, load assets in PreloaderScene, and add a mute toggle to the HUD.

### Changes Required:

#### 1. Audio Keys Constants

**File**: `src/explorers/audio/AudioKeys.ts` (NEW)

```typescript
/** Typed string constants for all audio asset keys */
export const MusicKey = {
  BG_EXPLORATION: 'music-bg-exploration',
  ARCADE_ACTION: 'music-arcade-action',
} as const;

export type MusicKeyValue = (typeof MusicKey)[keyof typeof MusicKey];

export const SfxKey = {
  // Progression
  XP_DING: 'sfx-xp-ding',
  RANK_UP: 'sfx-rank-up',
  QUEST_ACCEPT: 'sfx-quest-accept',
  QUEST_COMPLETE: 'sfx-quest-complete',
  OBJECTIVE_TICK: 'sfx-objective-tick',

  // Arcade — Asteroid Range
  LASER_SHOT: 'sfx-laser-shot',
  ASTEROID_HIT: 'sfx-asteroid-hit',
  MISS_WHIFF: 'sfx-miss-whiff',

  // Arcade — Memory Matrix
  SIGNAL_BEEP: 'sfx-signal-beep',
  CELL_CLICK: 'sfx-cell-click',

  // Arcade — Oscilloscope
  PARAM_BEEP: 'sfx-param-beep',
  SUBMIT_CONFIRM: 'sfx-submit-confirm',

  // Arcade — shared
  SUCCESS_CHIME: 'sfx-success-chime',
  ERROR_BUZZ: 'sfx-error-buzz',

  // Dialogue
  DIALOGUE_BLIP: 'sfx-dialogue-blip',

  // Transitions
  TRANSITION_WHOOSH: 'sfx-transition-whoosh',
} as const;

export type SfxKeyValue = (typeof SfxKey)[keyof typeof SfxKey];
```

#### 2. Audio Asset Manifest

**File**: `src/explorers/audio/audioAssets.ts` (NEW)

```typescript
import { MusicKey, SfxKey } from './AudioKeys';

export interface AudioAssetEntry {
  key: string;
  url: string;
}

export const MUSIC_ASSETS: AudioAssetEntry[] = [
  { key: MusicKey.BG_EXPLORATION, url: '/game/audio/music/bg-exploration.ogg' },
  { key: MusicKey.ARCADE_ACTION, url: '/game/audio/music/arcade-action.ogg' },
];

export const SFX_ASSETS: AudioAssetEntry[] = [
  { key: SfxKey.XP_DING, url: '/game/audio/sfx/xp-ding.ogg' },
  { key: SfxKey.RANK_UP, url: '/game/audio/sfx/rank-up.ogg' },
  { key: SfxKey.QUEST_ACCEPT, url: '/game/audio/sfx/quest-accept.ogg' },
  { key: SfxKey.QUEST_COMPLETE, url: '/game/audio/sfx/quest-complete.ogg' },
  { key: SfxKey.OBJECTIVE_TICK, url: '/game/audio/sfx/objective-tick.ogg' },
  { key: SfxKey.LASER_SHOT, url: '/game/audio/sfx/laser-shot.ogg' },
  { key: SfxKey.ASTEROID_HIT, url: '/game/audio/sfx/asteroid-hit.ogg' },
  { key: SfxKey.MISS_WHIFF, url: '/game/audio/sfx/miss-whiff.ogg' },
  { key: SfxKey.SIGNAL_BEEP, url: '/game/audio/sfx/signal-beep.ogg' },
  { key: SfxKey.CELL_CLICK, url: '/game/audio/sfx/cell-click.ogg' },
  { key: SfxKey.PARAM_BEEP, url: '/game/audio/sfx/param-beep.ogg' },
  { key: SfxKey.SUBMIT_CONFIRM, url: '/game/audio/sfx/submit-confirm.ogg' },
  { key: SfxKey.SUCCESS_CHIME, url: '/game/audio/sfx/success-chime.ogg' },
  { key: SfxKey.ERROR_BUZZ, url: '/game/audio/sfx/error-buzz.ogg' },
  { key: SfxKey.DIALOGUE_BLIP, url: '/game/audio/sfx/dialogue-blip.ogg' },
  { key: SfxKey.TRANSITION_WHOOSH, url: '/game/audio/sfx/transition-whoosh.ogg' },
];

export const ALL_AUDIO_ASSETS: AudioAssetEntry[] = [...MUSIC_ASSETS, ...SFX_ASSETS];
```

#### 3. AudioManager Singleton

**File**: `src/explorers/audio/AudioManager.ts` (NEW)

```typescript
import Phaser from 'phaser';
import { GameEvents } from '../events/GameEvents';
import { MusicKey, SfxKey } from './AudioKeys';
import type { MusicKeyValue, SfxKeyValue } from './AudioKeys';
import { ALL_AUDIO_ASSETS } from './audioAssets';
import { devLog } from '../utils/logger';

const MUTE_STORAGE_KEY = 'space-explorers-audio-muted';
const MUSIC_VOLUME = 0.4;
const MUSIC_DUCK_VOLUME = 0.12;
const MUSIC_FADE_MS = 300;
const MUSIC_DUCK_MS = 200;
const SFX_VOLUME = 0.6;
const BLIP_THROTTLE_MS = 80;

class AudioManagerImpl {
  private game: Phaser.Game | null = null;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private currentMusicKey: string | null = null;
  private isDucked = false;
  private lastBlipTime = 0;

  /** Initialize the manager — call once from BootScene.create() */
  init(game: Phaser.Game): void {
    this.game = game;

    // Restore mute preference
    const savedMute = localStorage.getItem(MUTE_STORAGE_KEY);
    if (savedMute === 'true') {
      game.sound.mute = true;
    }

    this.subscribeToEvents();
    devLog('[AudioManager] Initialized');
  }

  /** Queue all audio assets for loading — call from PreloaderScene.preload() */
  preloadAssets(scene: Phaser.Scene): void {
    for (const asset of ALL_AUDIO_ASSETS) {
      scene.load.audio(asset.key, asset.url);
    }
    devLog(`[AudioManager] Queued ${ALL_AUDIO_ASSETS.length} audio assets for preload`);
  }

  // ── Music ──────────────────────────────────────────────

  playMusic(key: MusicKeyValue, fadeMs = MUSIC_FADE_MS): void {
    if (!this.game) return;
    if (this.currentMusicKey === key) return;

    // Fade out current music
    if (this.currentMusic && this.currentMusic.isPlaying) {
      const old = this.currentMusic;
      (this.game.sound as Phaser.Sound.WebAudioSoundManager).setRate?.(1);
      this.game.tweens.add({
        targets: old,
        volume: 0,
        duration: fadeMs,
        onComplete: () => old.stop(),
      });
    }

    // Start new music
    if (!this.game.cache.audio.exists(key)) {
      devLog(`[AudioManager] Music asset not found: ${key}`);
      this.currentMusic = null;
      this.currentMusicKey = null;
      return;
    }

    this.currentMusic = this.game.sound.add(key, {
      loop: true,
      volume: 0,
    });
    this.currentMusicKey = key;
    this.currentMusic.play();
    this.isDucked = false;

    this.game.tweens.add({
      targets: this.currentMusic,
      volume: MUSIC_VOLUME,
      duration: fadeMs,
    });

    devLog(`[AudioManager] Playing music: ${key}`);
  }

  stopMusic(fadeMs = MUSIC_FADE_MS): void {
    if (!this.game || !this.currentMusic) return;

    const music = this.currentMusic;
    this.currentMusic = null;
    this.currentMusicKey = null;

    this.game.tweens.add({
      targets: music,
      volume: 0,
      duration: fadeMs,
      onComplete: () => music.stop(),
    });
  }

  private duckMusic(): void {
    if (!this.game || !this.currentMusic || this.isDucked) return;
    this.isDucked = true;
    this.game.tweens.add({
      targets: this.currentMusic,
      volume: MUSIC_DUCK_VOLUME,
      duration: MUSIC_DUCK_MS,
    });
    devLog('[AudioManager] Music ducked');
  }

  private unduckMusic(): void {
    if (!this.game || !this.currentMusic || !this.isDucked) return;
    this.isDucked = false;
    this.game.tweens.add({
      targets: this.currentMusic,
      volume: MUSIC_VOLUME,
      duration: MUSIC_DUCK_MS,
    });
    devLog('[AudioManager] Music unducked');
  }

  // ── SFX ────────────────────────────────────────────────

  playSfx(key: SfxKeyValue): void {
    if (!this.game) return;
    if (!this.game.cache.audio.exists(key)) {
      devLog(`[AudioManager] SFX asset not found: ${key}`);
      return;
    }
    this.game.sound.play(key, { volume: SFX_VOLUME });
  }

  /** Throttled blip for typewriter — returns true if blip was played */
  playBlip(): boolean {
    const now = performance.now();
    if (now - this.lastBlipTime < BLIP_THROTTLE_MS) return false;
    this.lastBlipTime = now;
    this.playSfx(SfxKey.DIALOGUE_BLIP);
    return true;
  }

  // ── Mute ───────────────────────────────────────────────

  toggleMute(): boolean {
    if (!this.game) return false;
    const muted = !this.game.sound.mute;
    this.game.sound.mute = muted;
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
    devLog(`[AudioManager] Muted: ${muted}`);
    return muted;
  }

  isMuted(): boolean {
    return this.game?.sound.mute ?? false;
  }

  // ── Event Subscriptions ────────────────────────────────

  private subscribeToEvents(): void {
    if (!this.game) return;
    const bus = this.game.events;

    // Scene entered — start/resume background music
    bus.on(GameEvents.SCENE_ENTERED, () => {
      this.playMusic(MusicKey.BG_EXPLORATION);
    });

    // Transitions
    bus.on(GameEvents.TRANSITION_START, () => {
      this.playSfx(SfxKey.TRANSITION_WHOOSH);
    });

    // Dialogue — duck/unduck
    bus.on(GameEvents.DIALOGUE_SHOW, () => {
      this.duckMusic();
    });
    bus.on(GameEvents.DIALOGUE_DISMISSED, () => {
      this.unduckMusic();
    });

    // Arcade — switch music
    bus.on(GameEvents.ARCADE_SHOW, () => {
      this.playMusic(MusicKey.ARCADE_ACTION);
    });
    bus.on(GameEvents.ARCADE_DISMISSED, () => {
      this.playMusic(MusicKey.BG_EXPLORATION);
    });

    // Progression SFX
    bus.on(GameEvents.XP_GAINED, () => {
      this.playSfx(SfxKey.XP_DING);
    });
    bus.on(GameEvents.RANK_UP, () => {
      this.playSfx(SfxKey.RANK_UP);
    });
    bus.on(GameEvents.QUEST_ACTIVATED, () => {
      this.playSfx(SfxKey.QUEST_ACCEPT);
    });
    bus.on(GameEvents.QUEST_COMPLETED, () => {
      this.playSfx(SfxKey.QUEST_COMPLETE);
    });
    bus.on(GameEvents.QUEST_OBJECTIVE_COMPLETED, () => {
      this.playSfx(SfxKey.OBJECTIVE_TICK);
    });

    // Exam SFX
    bus.on(GameEvents.EXAM_COMPLETED, (payload: { passed: boolean }) => {
      this.playSfx(payload.passed ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
    });

    devLog('[AudioManager] Event subscriptions registered');
  }
}

/** Module-scoped singleton — import and use from any file */
export const audioManager = new AudioManagerImpl();
```

#### 4. Wire AudioManager into BootScene

**File**: `src/explorers/scenes/BootScene.ts`
**Change**: Import and init AudioManager after scene/state setup.

Add after line 53 (after system flags loaded):
```typescript
import { audioManager } from '../audio/AudioManager';

// In create(), after system flags:
audioManager.init(this.game);
```

#### 5. Wire AudioManager into PreloaderScene

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Change**: Call `preloadAssets()` in `preload()`.

Add after line 56 (after existing asset loads):
```typescript
import { audioManager } from '../audio/AudioManager';

// In preload(), after existing loads:
audioManager.preloadAssets(this);
```

#### 6. Add Mute Toggle to GameHud

**File**: `src/explorers/GameHud.svelte`
**Change**: Add mute button in `hud-right` section, following existing `.hotkey` pattern.

Add import and state:
```typescript
import { audioManager } from './audio/AudioManager';

let muted = false;

// In onMount, after existing event subscriptions:
muted = audioManager.isMuted();
```

Add button in template (before the terminal button):
```svelte
<button class="hotkey" class:hotkey-active={muted} on:click={onToggleMute} title={muted ? 'Włącz dźwięk' : 'Wycisz'}>
  {#if muted}
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  {/if}
</button>
```

Add handler:
```typescript
function onToggleMute() {
  muted = audioManager.toggleMute();
}
```

#### 7. Create Audio Asset Directory

Create empty directory structure:
```
public/game/audio/
  music/
  sfx/
```

With a `.gitkeep` in each subdirectory so git tracks them.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] No lint errors in new files
- [ ] Game boots without console errors (AudioManager logs initialization)
- [ ] `devLog` messages appear: `[AudioManager] Initialized`, `[AudioManager] Queued N audio assets`

#### Manual Verification:

- [x] Game loads with progress bar (audio assets attempted but 404s are OK — no crashes)
- [x] Mute button visible in HUD right section
- [x] Clicking mute button toggles icon between speaker/speaker-off
- [x] Mute state persists after page reload (check localStorage for `space-explorers-audio-muted`)
- [x] Drop a test `.ogg` file as `public/game/audio/music/bg-exploration.ogg` — music should play on scene enter

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Dialogue Typewriter Blip

### Overview

Add an `onCharRevealed` callback to TypewriterEffect and wire it to AudioManager's throttled blip.

### Changes Required:

#### 1. Extend TypewriterEffect

**File**: `src/explorers/ui/TypewriterEffect.ts`
**Change**: Add optional `onCharRevealed` callback parameter.

In the constructor/start method, accept a new parameter:
```typescript
// Add to the options/parameters:
onCharRevealed?: () => void;

// In the timer callback (line 34 area), after setText:
this.textObject.setText(this.fullText.substring(0, this.currentIndex));
this.onCharRevealedCb?.();
```

Skip calling the callback for whitespace characters to reduce blip density:
```typescript
const char = this.fullText[this.currentIndex - 1];
if (char && char.trim() && this.onCharRevealedCb) {
  this.onCharRevealedCb();
}
```

In `revealAll()` — do NOT call the callback (instant reveal = no blips).

#### 2. Wire DialogueBar to Pass Blip Callback

**File**: `src/explorers/ui/DialogueBar.ts`
**Change**: Pass `audioManager.playBlip` as the `onCharRevealed` callback when creating/starting the TypewriterEffect.

```typescript
import { audioManager } from '../audio/AudioManager';

// Where TypewriterEffect is started:
typewriter.start(text, {
  onCharRevealed: () => audioManager.playBlip(),
  // ...existing options
});
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors
- [x] No lint errors

#### Manual Verification:

- [x] Drop `public/game/audio/sfx/dialogue-blip.ogg` test file
- [x] Trigger any dialogue — blip sounds play at ~2-3 char intervals
- [x] Pressing Space to reveal-all stops blips immediately
- [x] Blips don't play when muted

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Phase 3: Arcade Renderer SFX

### Overview

Add direct `audioManager.playSfx()` calls into the three arcade renderers at their identified hook points.

### Changes Required:

#### 1. AsteroidRangeRenderer SFX

**File**: `src/explorers/arcade/AsteroidRangeRenderer.ts`
**Change**: Add SFX calls at shoot/hit/miss points.

```typescript
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';

// In shoot() method (~line 462), before hit detection:
audioManager.playSfx(SfxKey.LASER_SHOT);

// On hit (~line 479, after score +=):
audioManager.playSfx(SfxKey.ASTEROID_HIT);

// On miss (~line 498):
audioManager.playSfx(SfxKey.MISS_WHIFF);
```

#### 2. MemoryMatrixRenderer SFX

**File**: `src/explorers/arcade/MemoryMatrixRenderer.ts`
**Change**: Add SFX at signal/toggle/pass/fail points.

```typescript
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';

// In renderPatternSignal() (~line 398):
audioManager.playSfx(SfxKey.SIGNAL_BEEP);

// In toggleCell() (~line 298):
audioManager.playSfx(SfxKey.CELL_CLICK);

// On round pass (~line 343):
audioManager.playSfx(SfxKey.SUCCESS_CHIME);

// On round fail (~line 352):
audioManager.playSfx(SfxKey.ERROR_BUZZ);
```

#### 3. OscilloscopeRenderer SFX

**File**: `src/explorers/arcade/OscilloscopeRenderer.ts`
**Change**: Add SFX at param adjust and submit points.

```typescript
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';

// On parameter adjustment (~line 304-320, when dirty = true):
audioManager.playSfx(SfxKey.PARAM_BEEP);

// On submission (~line 329):
audioManager.playSfx(SfxKey.SUBMIT_CONFIRM);
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors
- [x] No lint errors

#### Manual Verification:

- [ ] Drop test SFX files into `public/game/audio/sfx/`
- [ ] In Asteroid Range: laser sound on Space, impact on hit, whiff on miss
- [ ] In Memory Matrix: beep on pattern signal, click on cell toggle, chime/buzz on pass/fail
- [ ] In Oscilloscope: beep on param adjust, confirm on submit
- [ ] All SFX silent when muted
- [ ] Arcade music plays during arcade, background resumes on dismiss

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Testing Strategy

### Unit Tests:

- `AudioKeys.ts` — No tests needed (static constants)
- `audioAssets.ts` — No tests needed (static data)
- `AudioManager.ts` — Difficult to unit test (depends on Phaser.Game). Rely on integration testing.

### Integration Tests:

- Not applicable — audio requires a running Phaser instance with WebAudio

### Manual Testing Steps:

1. Boot game with no audio files — verify no errors, just devLog warnings
2. Add `bg-exploration.ogg` — verify music plays on scene enter
3. Toggle mute — verify all audio stops
4. Reload page — verify mute persists
5. Enter arcade zone — verify music crossfades to arcade track
6. Exit arcade — verify background music resumes
7. Trigger dialogue — verify music ducks, blips play
8. Dismiss dialogue — verify music restores
9. Complete quest — verify quest-complete SFX
10. Gain XP — verify XP ding
11. Navigate through door — verify transition whoosh + music crossfade

## Performance Considerations

- Audio files are loaded during PreloaderScene alongside other assets. Total audio bundle should stay under 5MB.
- Missing audio files produce 404s but no runtime errors — graceful degradation by design.
- Phaser's WebAudio SoundManager handles audio decoding and playback efficiently. No manual buffer management needed.

## References

- Research: `thoughts/shared/research/2026-03-26-audio-module-design.md`
- Game spec: `.ai/10x-devs/game/` directory
- Arcade feasibility: `thoughts/shared/research/2026-03-25-arcade-minigames-feasibility.md`
- Phaser Sound Manager: Uses `game.sound.add()`, `game.sound.play()`, `game.sound.mute`
