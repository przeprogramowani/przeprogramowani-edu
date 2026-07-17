import Phaser from 'phaser';
import { DEPTH } from '../config/constants';
import { devLog } from '../utils/logger';

const INITIAL_RADIUS = 40;
const EXPAND_DURATION = 1500;
const FADE_DURATION = 300;

interface SpotlightConfig {
  scene: Phaser.Scene;
  centerX: number;
  centerY: number;
}

/**
 * Creates a black overlay with a small spotlight circle at the given position.
 * Returns `expand()` which animates the spotlight open and resolves when done.
 */
export function createSpotlightReveal({ scene, centerX, centerY }: SpotlightConfig): {
  expand: () => Promise<void>;
} {
  const { width, height } = scene.scale;

  const rt = scene.add.renderTexture(0, 0, width, height);
  rt.setOrigin(0);
  rt.setScrollFactor(0);
  rt.setDepth(DEPTH.TRANSITION + 1);

  const eraseGraphics = new Phaser.GameObjects.Graphics(scene);
  const maxRadius = Math.ceil(Math.sqrt(width * width + height * height) / 2);

  const drawSpotlight = (radius: number) => {
    const r = Math.round(radius);
    rt.clear();
    rt.fill(0x000000, 1);
    eraseGraphics.clear();
    eraseGraphics.fillStyle(0xffffff);
    eraseGraphics.fillCircle(centerX, centerY, r);
    rt.erase(eraseGraphics);
  };

  drawSpotlight(INITIAL_RADIUS);
  devLog('[SpotlightReveal] Spotlight created');

  const expand = (): Promise<void> =>
    new Promise((resolve) => {
      const state = { radius: INITIAL_RADIUS };
      scene.tweens.add({
        targets: state,
        radius: maxRadius,
        duration: EXPAND_DURATION,
        ease: 'Cubic.easeOut',
        onUpdate: () => drawSpotlight(state.radius),
        onComplete: () => {
          scene.tweens.add({
            targets: rt,
            alpha: 0,
            duration: FADE_DURATION,
            onComplete: () => {
              rt.destroy();
              eraseGraphics.destroy();
              devLog('[SpotlightReveal] Spotlight reveal complete');
              resolve();
            },
          });
        },
      });
    });

  return { expand };
}
