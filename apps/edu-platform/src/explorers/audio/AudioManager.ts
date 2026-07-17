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

type VolumeControllableSound = Phaser.Sound.BaseSound & {
  setVolume: (volume: number) => Phaser.Sound.BaseSound;
};

class AudioManagerImpl {
  private game: Phaser.Game | null = null;
  private currentMusic: Phaser.Sound.BaseSound | null = null;
  private currentMusicKey: MusicKeyValue | null = null;
  private desiredMusicKey: MusicKeyValue | null = null;
  private isDucked = false;
  private lastBlipTime = 0;
  private subscribedBus: Phaser.Events.EventEmitter | null = null;
  private subscribedSoundManager: Phaser.Events.EventEmitter | null = null;
  private interactionRecoveryAttached = false;

  private readonly onSceneEntered = () => {
    this.playMusic(MusicKey.BG_EXPLORATION);
  };

  private readonly onTransitionStart = () => {
    this.playSfx(SfxKey.TRANSITION_WHOOSH);
  };

  private readonly onDialogueShow = () => {
    this.duckMusic();
  };

  private readonly onDialogueDismissed = () => {
    this.unduckMusic();
  };

  private readonly onArcadeShow = () => {
    this.playMusic(MusicKey.ARCADE_ACTION);
  };

  private readonly onArcadeDismissed = () => {
    this.playMusic(MusicKey.BG_EXPLORATION);
  };

  private readonly onXpGained = () => {
    this.playSfx(SfxKey.XP_DING);
  };

  private readonly onRankUp = () => {
    this.playSfx(SfxKey.RANK_UP);
  };

  private readonly onQuestActivated = () => {
    this.playSfx(SfxKey.QUEST_ACCEPT);
  };

  private readonly onQuestCompleted = () => {
    this.playSfx(SfxKey.QUEST_COMPLETE);
  };

  private readonly onQuestObjectiveCompleted = () => {
    this.playSfx(SfxKey.OBJECTIVE_TICK);
  };

  private readonly onTerminalFocusChanged = (payload: { focused: boolean }) => {
    this.playSfx(payload.focused ? SfxKey.TERMINAL_OPEN : SfxKey.TERMINAL_CLOSE);
  };

  private readonly onExamCompleted = (payload: { passed: boolean }) => {
    this.playSfx(payload.passed ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
  };

  private readonly onSoundUnlocked = () => {
    this.ensureDesiredMusicPlaying(0);
  };

  private readonly onInteractionRecovery = () => {
    this.ensureDesiredMusicPlaying(0);
  };

  private setMusicVolume(volume: number): void {
    (this.currentMusic as VolumeControllableSound | null)?.setVolume(volume);
  }

  private getStoredMutePreference(): boolean {
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  }

  /** Get the tween manager from any active scene */
  private getTweens(): Phaser.Tweens.TweenManager | null {
    if (!this.game) return null;
    const scenes = this.game.scene.getScenes(true);
    return scenes.length > 0 ? scenes[0].tweens : null;
  }

  private stopCurrentMusicInstance(fadeMs: number): void {
    const music = this.currentMusic;
    if (!music) return;

    this.currentMusic = null;
    this.currentMusicKey = null;

    if (!music.isPlaying) {
      music.destroy();
      return;
    }

    const tweens = this.getTweens();
    if (!tweens) {
      music.stop();
      music.destroy();
      return;
    }

    tweens.add({
      targets: music,
      volume: 0,
      duration: fadeMs,
      onComplete: () => {
        music.stop();
        music.destroy();
      },
    });
  }

  private startMusicInstance(key: MusicKeyValue, fadeMs: number): void {
    if (!this.game) return;

    if (!this.game.cache.audio.exists(key)) {
      devLog(`[AudioManager] Music asset not found: ${key}`);
      return;
    }

    const music = this.game.sound.add(key, {
      loop: true,
      volume: 0,
    });

    this.currentMusic = music;
    this.currentMusicKey = key;
    this.isDucked = false;
    music.play();

    const tweens = this.getTweens();
    if (!tweens) {
      music.setVolume(MUSIC_VOLUME);
    } else {
      tweens.add({
        targets: music,
        volume: MUSIC_VOLUME,
        duration: fadeMs,
      });
    }

    devLog(`[AudioManager] Playing music: ${key}`);
  }

  private ensureDesiredMusicPlaying(fadeMs = 0): void {
    if (!this.game || this.game.sound.mute || !this.desiredMusicKey) return;

    if (this.currentMusicKey === this.desiredMusicKey && this.currentMusic?.isPlaying) {
      return;
    }

    this.stopCurrentMusicInstance(fadeMs);
    this.startMusicInstance(this.desiredMusicKey, fadeMs);
  }

  /** Initialize the manager — call once from BootScene.create() */
  init(game: Phaser.Game): void {
    if (this.subscribedBus) {
      this.unsubscribeFromEvents(this.subscribedBus);
      this.subscribedBus = null;
    }
    if (this.subscribedSoundManager) {
      this.subscribedSoundManager.off('unlocked', this.onSoundUnlocked);
      this.subscribedSoundManager = null;
    }

    this.game = game;
    this.currentMusic = null;
    this.currentMusicKey = null;
    this.desiredMusicKey = null;
    this.isDucked = false;

    // Restore mute preference regardless of HUD mount timing.
    game.sound.mute = this.getStoredMutePreference();

    this.subscribeToEvents();

    const soundManager = game.sound as Phaser.Sound.BaseSoundManager & Phaser.Events.EventEmitter;
    soundManager.on('unlocked', this.onSoundUnlocked);
    this.subscribedSoundManager = soundManager;

    if (!this.interactionRecoveryAttached && typeof window !== 'undefined') {
      window.addEventListener('pointerdown', this.onInteractionRecovery);
      window.addEventListener('keydown', this.onInteractionRecovery);
      window.addEventListener('focus', this.onInteractionRecovery);
      this.interactionRecoveryAttached = true;
    }

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
    this.desiredMusicKey = key;
    if (!this.game) return;

    if (this.currentMusicKey === key && this.currentMusic?.isPlaying) {
      return;
    }

    this.stopCurrentMusicInstance(fadeMs);
    this.startMusicInstance(key, fadeMs);
  }

  ensureBackgroundMusic(fadeMs = 0): void {
    this.desiredMusicKey = MusicKey.BG_EXPLORATION;
    this.ensureDesiredMusicPlaying(fadeMs);
  }

  stopMusic(fadeMs = MUSIC_FADE_MS): void {
    this.desiredMusicKey = null;
    this.stopCurrentMusicInstance(fadeMs);
  }

  private duckMusic(): void {
    if (!this.game || !this.currentMusic || this.isDucked) return;
    this.isDucked = true;
    const tweens = this.getTweens();
    if (!tweens) {
      this.setMusicVolume(MUSIC_DUCK_VOLUME);
    } else {
      tweens.add({
        targets: this.currentMusic,
        volume: MUSIC_DUCK_VOLUME,
        duration: MUSIC_DUCK_MS,
      });
    }
    devLog('[AudioManager] Music ducked');
  }

  private unduckMusic(): void {
    if (!this.game || !this.currentMusic || !this.isDucked) return;
    this.isDucked = false;
    const tweens = this.getTweens();
    if (!tweens) {
      this.setMusicVolume(MUSIC_VOLUME);
    } else {
      tweens.add({
        targets: this.currentMusic,
        volume: MUSIC_VOLUME,
        duration: MUSIC_DUCK_MS,
      });
    }
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

    if (!muted) {
      this.ensureDesiredMusicPlaying(0);
    }

    devLog(`[AudioManager] Muted: ${muted}`);
    return muted;
  }

  getMuteState(): boolean {
    return this.game?.sound.mute ?? this.getStoredMutePreference();
  }

  // ── Event Subscriptions ────────────────────────────────

  private subscribeToEvents(): void {
    if (!this.game) return;
    const bus = this.game.events;

    bus.on(GameEvents.SCENE_ENTERED, this.onSceneEntered);
    bus.on(GameEvents.TRANSITION_START, this.onTransitionStart);
    bus.on(GameEvents.DIALOGUE_SHOW, this.onDialogueShow);
    bus.on(GameEvents.DIALOGUE_DISMISSED, this.onDialogueDismissed);
    bus.on(GameEvents.ARCADE_SHOW, this.onArcadeShow);
    bus.on(GameEvents.ARCADE_DISMISSED, this.onArcadeDismissed);
    bus.on(GameEvents.XP_GAINED, this.onXpGained);
    bus.on(GameEvents.RANK_UP, this.onRankUp);
    bus.on(GameEvents.QUEST_ACTIVATED, this.onQuestActivated);
    bus.on(GameEvents.QUEST_COMPLETED, this.onQuestCompleted);
    bus.on(GameEvents.QUEST_OBJECTIVE_COMPLETED, this.onQuestObjectiveCompleted);
    bus.on(GameEvents.TERMINAL_FOCUS_CHANGED, this.onTerminalFocusChanged);
    bus.on(GameEvents.EXAM_COMPLETED, this.onExamCompleted);
    this.subscribedBus = bus;

    devLog('[AudioManager] Event subscriptions registered');
  }

  private unsubscribeFromEvents(bus: Phaser.Events.EventEmitter): void {
    bus.off(GameEvents.SCENE_ENTERED, this.onSceneEntered);
    bus.off(GameEvents.TRANSITION_START, this.onTransitionStart);
    bus.off(GameEvents.DIALOGUE_SHOW, this.onDialogueShow);
    bus.off(GameEvents.DIALOGUE_DISMISSED, this.onDialogueDismissed);
    bus.off(GameEvents.ARCADE_SHOW, this.onArcadeShow);
    bus.off(GameEvents.ARCADE_DISMISSED, this.onArcadeDismissed);
    bus.off(GameEvents.XP_GAINED, this.onXpGained);
    bus.off(GameEvents.RANK_UP, this.onRankUp);
    bus.off(GameEvents.QUEST_ACTIVATED, this.onQuestActivated);
    bus.off(GameEvents.QUEST_COMPLETED, this.onQuestCompleted);
    bus.off(GameEvents.QUEST_OBJECTIVE_COMPLETED, this.onQuestObjectiveCompleted);
    bus.off(GameEvents.TERMINAL_FOCUS_CHANGED, this.onTerminalFocusChanged);
    bus.off(GameEvents.EXAM_COMPLETED, this.onExamCompleted);
  }
}

/** Module-scoped singleton — import and use from any file */
export const audioManager = new AudioManagerImpl();
