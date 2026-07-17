import Phaser from 'phaser';
import { SceneKey } from '../config/sceneRegistry';
import {
  createDefaultState,
  loadState,
  getPreloadedState,
  clearPreloadedState,
  getPreloadedSystemFlags,
  clearPreloadedSystemFlags,
} from '../state/GameStateManager';
import { devLog } from '../utils/logger';
import { loadLevelsFromData } from '../levels/levelLoader';
import type { GameManifestResponse } from '../levels/levelLoader';
import { GameEvents } from '../events/GameEvents';
import { audioManager } from '../audio/AudioManager';
import { PreloaderScene } from './PreloaderScene';
import { GameScene } from './GameScene';
import { DialogueScene } from './DialogueScene';
import { TransitionScene } from './TransitionScene';
import { ExamScene } from './ExamScene';
import { ArcadeScene } from './ArcadeScene';

const STATE_REGISTRY_KEY = 'demoGameState';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.BOOT });
  }

  preload(): void {
    this.load.json('game-manifest', '/api/game');
  }

  create(): void {
    devLog(
      `[BootScene] Phaser ${Phaser.VERSION} | 10x Explorers`
    );

    // Load level manifests from fetched API data
    const data = this.cache.json.get('game-manifest') as GameManifestResponse;
    loadLevelsFromData(data);

    // Load or create game state (prefer server pre-load > localStorage > default)
    const preloaded = getPreloadedState();
    clearPreloadedState();
    const saved = loadState();
    const state = preloaded ?? saved ?? createDefaultState();
    this.registry.set(STATE_REGISTRY_KEY, state);
    this.game.events.emit(GameEvents.STATE_CHANGED, { state });

    // Load system flags into separate read-only registry key
    const systemFlags = getPreloadedSystemFlags();
    clearPreloadedSystemFlags();
    this.registry.set('systemFlags', new Set(systemFlags));
    devLog(`[BootScene] System flags loaded: ${systemFlags.length} flags`);

    // Initialize audio system
    audioManager.init(this.game);

    devLog(
      `[BootScene] State loaded (source=${preloaded ? 'server' : saved ? 'localStorage' : 'default'}): map=${state.currentMap}`
    );

    // Register all other scenes dynamically
    this.scene.add(SceneKey.PRELOADER, PreloaderScene, false);
    this.scene.add(SceneKey.GAME, GameScene, false);
    this.scene.add(SceneKey.DIALOGUE, DialogueScene, false);
    this.scene.add(SceneKey.TRANSITION, TransitionScene, false);
    this.scene.add(SceneKey.EXAM, ExamScene, false);
    this.scene.add(SceneKey.ARCADE, ArcadeScene, false);

    // Transition to preloader
    this.scene.start(SceneKey.PRELOADER);
  }
}
