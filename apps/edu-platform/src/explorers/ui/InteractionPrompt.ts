import Phaser from 'phaser';
import { DEPTH, COLORS } from '../config/constants';
import { t } from '../i18n';

export class InteractionPrompt {
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private visible = false;
  private lastX = -1;
  private lastY = -1;

  constructor(scene: Phaser.Scene) {
    this.bg = scene.add.rectangle(0, 0, 120, 28, 0x000000, 0.7);
    this.bg.setStrokeStyle(1, COLORS.TEAL);

    this.label = scene.add.text(0, 0, t('scene.interactionDefault'), {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#00d4aa',
    });
    this.label.setOrigin(0.5);

    this.container = scene.add.container(0, 0, [this.bg, this.label]);
    this.container.setDepth(DEPTH.INTERACTION_PROMPT);
    this.container.setVisible(false);
  }

  show(x: number, y: number, text?: string): void {
    text = text ?? t('scene.interactionDefault');
    if (x !== this.lastX || y !== this.lastY) {
      this.container.setPosition(x, y - 36);
      this.lastX = x;
      this.lastY = y;
    }
    if (this.label.text !== text) {
      this.label.setText(text);
    }
    if (!this.visible) {
      this.container.setVisible(true);
      this.visible = true;
    }
  }

  hide(): void {
    if (this.visible) {
      this.container.setVisible(false);
      this.visible = false;
    }
  }

  destroy(): void {
    this.container.destroy();
  }
}
