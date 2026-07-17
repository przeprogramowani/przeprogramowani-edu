import Phaser from 'phaser';
import { SceneKey } from '../config/sceneRegistry';
import { GameEvents } from '../events/GameEvents';
import { TRANSITION_FADE_MS, DEPTH, TILE_SIZE } from '../config/constants';
import { devLog } from '../utils/logger';
import { BaseScene } from './BaseScene';
import type { TransitionStartPayload } from '../events/GameEvents';
import type { MapKey } from '../config/mapRegistry';

export class TransitionScene extends BaseScene {
  private overlay!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: SceneKey.TRANSITION });
  }

  create(): void {
    devLog('[TransitionScene] Created');

    const { width, height } = this.scale;

    // Full-screen black overlay
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(DEPTH.TRANSITION);
    this.overlay.setAlpha(0);

    // Listen for transition events
    const onTransitionStart = (payload: TransitionStartPayload) => {
      this.startTransition(payload);
    };
    this.bus.on(GameEvents.TRANSITION_START, onTransitionStart);

    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.TRANSITION_START, onTransitionStart);
    });

    // Start in sleep mode
    this.scene.sleep();
  }

  private startTransition(payload: TransitionStartPayload): void {
    // Wake up
    if (this.scene.isSleeping(SceneKey.TRANSITION)) {
      this.scene.wake();
    }

    // Bring to front
    this.scene.bringToTop();

    // Save current state before transition
    this.updateState((s) => ({
      currentMap: payload.targetMap as MapKey,
      position: {
        x: payload.spawnX * TILE_SIZE,
        y: payload.spawnY * TILE_SIZE,
      },
    }));

    // Fade in to black
    this.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: TRANSITION_FADE_MS,
      onComplete: () => {
        // Restart GameScene with new map data
        this.scene.get(SceneKey.GAME).scene.restart({
          mapKey: payload.targetMap,
          spawnX: payload.spawnX * TILE_SIZE,
          spawnY: payload.spawnY * TILE_SIZE,
        });

        // Brief pause for scene rebuild, then fade out
        this.time.delayedCall(200, () => {
          this.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: TRANSITION_FADE_MS,
            onComplete: () => {
              this.bus.emit(GameEvents.TRANSITION_COMPLETE);
              this.scene.sleep();
            },
          });
        });
      },
    });
  }
}
