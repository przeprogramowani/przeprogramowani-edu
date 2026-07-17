---
date: 2026-03-26T12:00:00+01:00
researcher: Claude
git_commit: 38d1e96c13951c4182f4aab4169143c681bd32c5
branch: master
repository: przeprogramowani-sites
topic: "Design Phaser-compatible audio module for 10x Explorers"
tags: [research, codebase, audio, phaser, game, sfx, music, 10x-explorers]
status: complete
last_updated: 2026-03-26
last_updated_by: Claude
---

# Research: Audio Module Design for 10x Explorers

**Date**: 2026-03-26T12:00:00+01:00
**Researcher**: Claude
**Git Commit**: 38d1e96c13951c4182f4aab4169143c681bd32c5
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Design a Phaser-compatible and easy-to-extend audio module that supports: background music, arcade game music, sound effects (shooting asteroids), quest/XP gain sounds, and other game events.

## Summary

The 10x Explorers game currently has **zero audio implementation** — no audio files, no sound manager, no playback code. However, Phaser's WebAudio is already enabled in `gameConfig.ts`. The existing event-driven architecture (`GameEvents` bus) provides natural integration points for a centralized `AudioManager`. The level manifest system (`LevelManifest`) can be extended to declare per-map audio tracks. The Svelte HUD layer (`GameHud.svelte`) follows established patterns for adding mute/volume UI controls.

### Proposed Architecture: `AudioManager` singleton

A single `AudioManager` class initialized in `BootScene` or `PreloaderScene` that:
1. Loads audio assets during preload
2. Listens to `GameEvents` bus for playback triggers
3. Manages background music crossfades on map transitions
4. Exposes a simple `playSfx(key)` API for renderers and scenes
5. Persists volume/mute preferences in game state
6. Provides a Svelte-accessible interface for HUD controls

## Detailed Findings

### 1. Current Audio State

**No audio exists.** Verified across the entire codebase:
- No audio files (`.mp3`, `.ogg`, `.wav`) in `public/game/` or anywhere else
- No `this.sound` usage in any scene or renderer
- `AssetManifest.ts` only supports `'image' | 'spritesheet' | 'tilemapJSON'` types
- `PreloaderScene.ts` only loads spritesheets and images
- `gameConfig.ts:23-25` enables WebAudio: `audio: { disableWebAudio: false }`
- Multiple prior plans explicitly defer audio: "game has no audio system yet"

### 2. Event Bus Integration Points

`GameEvents.ts` defines typed events that map directly to audio triggers:

| Event | File:Line | Audio Use |
|-------|-----------|-----------|
| `SCENE_ENTERED` | GameEvents.ts:10 | Start/crossfade background music for new map |
| `TRANSITION_START` | GameEvents.ts:11 | Fade out current music, play transition whoosh |
| `TRANSITION_COMPLETE` | GameEvents.ts:12 | Fade in new map music |
| `DIALOGUE_SHOW` | GameEvents.ts:15 | Duck music volume, play dialogue blip |
| `DIALOGUE_DISMISSED` | GameEvents.ts:16 | Restore music volume |
| `QUEST_ACTIVATED` | GameEvents.ts:24 | Play quest accept chime |
| `QUEST_COMPLETED` | GameEvents.ts:25 | Play quest complete fanfare |
| `QUEST_OBJECTIVE_COMPLETED` | GameEvents.ts:26 | Play objective tick sound |
| `XP_GAINED` | GameEvents.ts:33 | Play XP gain ding |
| `RANK_UP` | GameEvents.ts:34 | Play rank-up fanfare |
| `FLAG_SET` | GameEvents.ts:37 | Optionally play achievement sound |
| `ARCADE_SHOW` | GameEvents.ts:46 | Switch to arcade music |
| `ARCADE_COMPLETED` | GameEvents.ts:47 | Play win/lose jingle |
| `ARCADE_DISMISSED` | GameEvents.ts:48 | Resume map music |
| `EXAM_SHOW` | GameEvents.ts:43 | Switch to exam ambience |
| `EXAM_COMPLETED` | GameEvents.ts:44 | Play pass/fail sound |

### 3. Arcade Renderer SFX Hook Points

The three arcade renderers have specific moments where sound effects would enhance gameplay:

#### AsteroidRangeRenderer (`arcade/AsteroidRangeRenderer.ts`)
| Action | Line | SFX |
|--------|------|-----|
| Player fires | ~462 | Laser/shot sound |
| Asteroid hit | ~478-483 | Impact/explosion |
| Miss | ~498-500 | Miss beep / whiff |
| Visual effect done | ~520-531 | Sparkle decay |

#### MemoryMatrixRenderer (`arcade/MemoryMatrixRenderer.ts`)
| Action | Line | SFX |
|--------|------|-----|
| Pattern signal appears | ~398 | Signal beep |
| Cell toggled | ~298-310 | Selection click |
| Round passed | ~343-345 | Success chime |
| Round failed | ~352-355 | Error buzz |
| Game complete | ~370-375 | Completion fanfare |

#### OscilloscopeRenderer (`arcade/OscilloscopeRenderer.ts`)
| Action | Line | SFX |
|--------|------|-----|
| Parameter adjusted | ~304-320 | Pitch sweep / beep |
| Submission confirmed | ~329 | Confirmation sound |
| Auto-finish | ~333-336 | Completion ding |

### 4. Asset Manifest Extension

Current `AssetManifest.ts` (`src/explorers/assets/AssetManifest.ts:3-8`):
```typescript
export interface AssetEntry {
  type: 'image' | 'spritesheet' | 'tilemapJSON';
  key: string;
  url: string;
  frameConfig?: { frameWidth: number; frameHeight: number };
}
```

Needs extension to support audio:
```typescript
export interface AssetEntry {
  type: 'image' | 'spritesheet' | 'tilemapJSON' | 'audio';
  key: string;
  url: string;
  frameConfig?: { frameWidth: number; frameHeight: number };
}
```

### 5. Level Manifest Extension

Current `LevelManifest` (`src/explorers/levels/types.ts`):
```typescript
export interface LevelManifest {
  id: string;
  displayName: string;
  dialogues: Record<string, DialogueSequence>;
  interactionRoutes: InteractionRoute[];
  quests?: QuestDefinition[];
  exams?: ExamDefinition[];
  arcadeGames?: ArcadeGameDefinition[];
  introDialogue?: string;
  introFlag?: string;
  introCinematicTitle?: string;
  introCinematicSubtitle?: string;
}
```

Could add optional `audioTrack` field:
```typescript
export interface LevelManifest {
  // ... existing fields
  audioTrack?: string; // key referencing a preloaded audio asset
}
```

### 6. Svelte HUD Communication Pattern

`GameHud.svelte` demonstrates the established pattern for Svelte-Phaser communication:
- Subscribe to Phaser events in `onMount` (lines 79-82)
- Use Svelte `tweened` stores for animated state (line 25)
- Conditional rendering based on game flags (line 54)
- Button controls calling Svelte functions (line 154)
- Cleanup in `onDestroy`

A mute/volume control would follow this exact pattern — subscribe to `AUDIO_STATE_CHANGED` events, render a toggle button, and emit volume changes back to Phaser.

### 7. Scene Lifecycle & Cleanup

Scenes follow a disciplined cleanup pattern (`GameScene.ts:365-388`):
- `events.on('shutdown', ...)` for scene-level cleanup
- Remove all event listeners
- Destroy all game objects
- This pattern must be followed by `AudioManager` for any per-scene listeners

### 8. Game State Persistence

Volume/mute preferences should be stored in `GameState` (`state/types.ts`) and persisted alongside other state via `saveState()` / `loadState()` in `GameStateManager.ts`. The auto-save timer in `GameScene.ts:345-356` runs every `SAVE_INTERVAL_MS`.

## Proposed Module Architecture

### File Structure
```
src/explorers/
├── audio/
│   ├── AudioManager.ts      # Singleton, event-driven audio controller
│   ├── AudioKeys.ts         # Typed string constants for all audio asset keys
│   └── audioAssets.ts       # Audio asset manifest (URLs, keys)
```

### AudioManager Design

```typescript
// Conceptual API — not implementation code
class AudioManager {
  // Lifecycle
  init(game: Phaser.Game): void           // Called once from BootScene
  preloadAssets(scene: Phaser.Scene): void // Called from PreloaderScene.preload()

  // Music (looping, crossfade support)
  playMusic(key: string, fadeMs?: number): void
  stopMusic(fadeMs?: number): void

  // SFX (fire-and-forget, overlapping OK)
  playSfx(key: string): void

  // Volume control (Svelte HUD integration)
  setMusicVolume(volume: number): void   // 0.0 – 1.0
  setSfxVolume(volume: number): void     // 0.0 – 1.0
  setMuted(muted: boolean): void
  isMuted(): boolean

  // State persistence
  getAudioPreferences(): AudioPreferences
  loadAudioPreferences(prefs: AudioPreferences): void
}
```

### Integration Points

1. **BootScene.create()** — Initialize AudioManager, register event listeners
2. **PreloaderScene.preload()** — Load all audio assets via `AudioManager.preloadAssets()`
3. **GameScene.create()** — AudioManager listens to `SCENE_ENTERED` to switch background tracks
4. **ArcadeScene** — AudioManager listens to `ARCADE_SHOW`/`ARCADE_DISMISSED` for music switching
5. **Arcade Renderers** — Call `AudioManager.playSfx()` at hit/miss/score moments
6. **GameHud.svelte** — Add mute toggle button following existing HUD pattern
7. **GameStateManager** — Persist volume/mute preferences

### Audio Asset Organization
```
public/game/audio/
├── music/
│   ├── ambient-exploration.ogg    # Default map background
│   ├── arcade-action.ogg          # Arcade mini-game track
│   └── exam-tension.ogg           # Exam ambience
├── sfx/
│   ├── laser-shot.ogg             # Asteroid Range: fire
│   ├── asteroid-hit.ogg           # Asteroid Range: hit
│   ├── miss-whiff.ogg             # Asteroid Range: miss
│   ├── signal-beep.ogg            # Memory Matrix: pattern signal
│   ├── cell-click.ogg             # Memory Matrix: cell toggle
│   ├── success-chime.ogg          # Round pass / objective complete
│   ├── error-buzz.ogg             # Round fail
│   ├── quest-accept.ogg           # Quest activated
│   ├── quest-complete.ogg         # Quest completed fanfare
│   ├── xp-ding.ogg               # XP gained
│   ├── rank-up-fanfare.ogg        # Rank up
│   ├── transition-whoosh.ogg      # Map transition
│   └── dialogue-blip.ogg          # Dialogue typewriter tick
└── ui/
    └── button-click.ogg           # General UI interaction
```

### Key Design Decisions

1. **OGG format preferred** — Best compression/quality for web, supported by all modern browsers. Provide MP3 fallback if needed for Safari compatibility (though Safari 15+ supports OGG).
2. **Singleton pattern** — AudioManager lives on `game.registry` or as a module-scoped instance, accessible from any scene or Svelte component.
3. **Event-driven, not scene-coupled** — AudioManager subscribes to the global `game.events` bus, not individual scenes. This avoids cleanup complexity and ensures music persists across scene transitions.
4. **Lazy loading for SFX** — Core music loads in PreloaderScene; arcade-specific SFX can load in ArcadeScene.preload() to keep initial load fast.
5. **Volume ducking** — When dialogue is shown, music volume temporarily reduces (ducks) and restores on dismiss.
6. **Crossfade** — Map transitions use a brief crossfade (fade out old → fade in new) rather than hard cuts.

## Code References

- `src/explorers/config/gameConfig.ts:23-25` — WebAudio enabled
- `src/explorers/assets/AssetManifest.ts:3-8` — Asset entry types (needs `'audio'`)
- `src/explorers/events/GameEvents.ts:1-60` — All event constants for audio hooks
- `src/explorers/scenes/BootScene.ts:33-69` — Boot sequence (AudioManager init point)
- `src/explorers/scenes/PreloaderScene.ts:11-62` — Preload sequence (audio asset loading point)
- `src/explorers/scenes/GameScene.ts:87-389` — GameScene lifecycle (music integration)
- `src/explorers/scenes/ArcadeScene.ts:284-431` — Arcade playing phase (SFX integration)
- `src/explorers/arcade/AsteroidRangeRenderer.ts:461-500` — Shooting mechanic (SFX hooks)
- `src/explorers/arcade/MemoryMatrixRenderer.ts:298-375` — Input/feedback (SFX hooks)
- `src/explorers/arcade/OscilloscopeRenderer.ts:304-337` — Parameter/submission (SFX hooks)
- `src/explorers/GameHud.svelte` — HUD pattern for mute/volume controls
- `src/explorers/PhaserGame.svelte` — Svelte-Phaser bridge
- `src/explorers/levels/types.ts` — LevelManifest (audio track field extension)
- `src/explorers/state/types.ts` — GameState (volume/mute persistence)

## Architecture Insights

1. **Event bus is the backbone** — The `game.events` EventEmitter is used universally for cross-scene and Svelte-Phaser communication. AudioManager should subscribe to this bus rather than coupling to individual scenes.
2. **Registry for singletons** — `game.registry` stores shared state (game state, system flags). AudioManager can live here for cross-scene access.
3. **Overlay scene pattern** — DialogueScene, ExamScene, ArcadeScene all use sleep/wake. AudioManager should be scene-independent.
4. **Renderer isolation** — Arcade renderers only have a `scene` reference. They'd need access to AudioManager either through `scene.registry` or a module-scoped import.
5. **Asset convention** — Maps use convention-based URL derivation (`getMapAssets(mapKey)` → `/game/maps/${mapKey}.json`). Audio could follow a similar pattern for per-map tracks.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-10-awakening-spotlight-reveal.md` — Raised open question: "Should there be an audio cue accompanying the spotlight light expansion?" No resolution yet.
- `thoughts/shared/plans/2026-03-10-awakening-spotlight-reveal.md` — Explicitly deferred audio: "No sound effects for the spotlight (audio is a separate concern)"
- `thoughts/shared/research/2026-03-25-arcade-minigames-feasibility.md` — Notes "No sound effects or audio (game has no audio system yet)" in scope exclusions
- `thoughts/shared/plans/2026-03-25-arcade-minigames.md` — Audio excluded from arcade implementation scope

## Related Research

- `thoughts/shared/research/2026-03-25-arcade-minigames-feasibility.md` — Arcade system architecture (audio excluded)
- `thoughts/shared/research/2026-03-10-awakening-spotlight-reveal.md` — Cinematic intro (audio question raised)
- `thoughts/shared/research/2026-02-19-game-level-framework.md` — Level framework design
- `thoughts/shared/research/2026-02-22-xp-level-rank-progression.md` — XP/rank system (rank-up audio trigger)

## Open Questions

1. **Audio asset sourcing** — Where will the actual audio files come from? License-free game music libraries? Custom compositions? This affects file format and quality decisions.
2. **Per-map vs global music** — Should each map have its own background track (declared in `LevelManifest.audioTrack`), or should there be a single exploration track with mood variations?
3. **Arcade-specific music** — Should each arcade game type have its own music, or share a common "arcade action" track?
4. **Mobile/tablet support** — iOS Safari requires a user gesture before WebAudio can play. The first interaction (clicking "Start" on login, or the first keyboard input) should trigger `this.sound.unlock()`. Phaser handles this automatically in most cases, but testing is needed.
5. **File size budget** — Compressed OGG music loops at 128kbps are ~960KB/minute. What's the acceptable total audio bundle size? Consider lazy loading arcade/exam audio.
6. **Dialogue typewriter sound** — Should each character of dialogue text produce a "blip" sound (Animal Crossing style), or should it be silent? This would integrate with `TypewriterEffect.ts`.
7. **Spotlight reveal audio** — The open question from the spotlight reveal research: should the awakening cinematic have an audio cue?
