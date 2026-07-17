import Phaser from 'phaser';
import {
  DEPTH,
  DIALOGUE_SPEAKER_FONT_SIZE,
  DIALOGUE_BODY_FONT_SIZE,
  DIALOGUE_HINT_FONT_SIZE,
  DIALOGUE_SPEAKER_FONT_SIZE_NARROW,
  DIALOGUE_BODY_FONT_SIZE_NARROW,
  DIALOGUE_HINT_FONT_SIZE_NARROW,
  DIALOGUE_NARROW_WIDTH_PX,
} from '../config/constants';
import { TypewriterEffect } from './TypewriterEffect';
import type { DialogueLine } from '../systems/DialogueTypes';
import { audioManager } from '../audio/AudioManager';
import { getDialogueBarPresentation } from './dialogueBarPresentation';
import { localized } from '../i18n/types';
import { t } from '../i18n';

export class DialogueBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private hintText: Phaser.GameObjects.Text;
  private typewriter: TypewriterEffect;
  private hintTween: Phaser.Tweens.Tween | null = null;
  private visible = false;
  private activeLine: DialogueLine | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Game objects are created at (0, 0); positions and sizes are applied
    // in recalculateLayout() so they can be re-applied on canvas resize.
    this.bg = scene.add.rectangle(0, 0, 0, 0, 0x000000, 0.85);

    this.speakerText = scene.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: `${DIALOGUE_SPEAKER_FONT_SIZE}px`,
      color: '#00d4aa',
      fontStyle: 'bold',
    });

    this.bodyText = scene.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: `${DIALOGUE_BODY_FONT_SIZE}px`,
      color: '#ffffff',
      wordWrap: { width: 0 },
      lineSpacing: 4,
    });

    this.hintText = scene.add.text(0, 0, t('scene.dialogueAdvanceHint'), {
      fontFamily: 'monospace',
      fontSize: `${DIALOGUE_HINT_FONT_SIZE}px`,
      color: '#aaaaaa',
    });
    this.hintText.setOrigin(1, 1);

    this.container = scene.add.container(0, 0, [
      this.bg,
      this.speakerText,
      this.bodyText,
      this.hintText,
    ]);
    this.container.setDepth(DEPTH.DIALOGUE);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);

    this.typewriter = new TypewriterEffect(this.bodyText);

    this.recalculateLayout();
  }

  /**
   * Reposition the bar relative to the current scene scale.
   * Called once at construction and again whenever the canvas resizes
   * (e.g. mobile control bar mount/unmount, device rotation).
   */
  relayout(): void {
    this.recalculateLayout();
  }

  private recalculateLayout(): void {
    const { width, height } = this.scene.scale;
    const barHeight = Math.floor(height * 0.3);
    const barY = height - barHeight;

    // Pick smaller font sizes on narrow viewports so text doesn't overflow.
    const isNarrow = width < DIALOGUE_NARROW_WIDTH_PX;
    const speakerSize = isNarrow ? DIALOGUE_SPEAKER_FONT_SIZE_NARROW : DIALOGUE_SPEAKER_FONT_SIZE;
    const bodySize = isNarrow ? DIALOGUE_BODY_FONT_SIZE_NARROW : DIALOGUE_BODY_FONT_SIZE;
    const hintSize = isNarrow ? DIALOGUE_HINT_FONT_SIZE_NARROW : DIALOGUE_HINT_FONT_SIZE;
    const sidePadding = isNarrow ? 12 : 24;

    this.bg.setPosition(width / 2, barY + barHeight / 2);
    this.bg.setSize(width, barHeight);

    this.speakerText.setStyle({ fontSize: `${speakerSize}px` });
    this.speakerText.setPosition(sidePadding, barY + 12);

    this.bodyText.setStyle({
      fontSize: `${bodySize}px`,
      wordWrap: { width: width - sidePadding * 2 },
    });
    this.bodyText.setPosition(sidePadding, barY + 12 + speakerSize + 8);

    this.hintText.setStyle({ fontSize: `${hintSize}px` });
    this.hintText.setPosition(width - sidePadding, barY + barHeight - 12);
  }

  show(line: DialogueLine, onTypewriterDone?: () => void): void {
    this.activeLine = line;
    const presentation = getDialogueBarPresentation(line);
    this.applyPresentation(presentation);

    this.typewriter.start(localized(line.text), this.scene, onTypewriterDone, () => audioManager.playBlip());

    if (!this.visible) {
      this.container.setVisible(true);
      this.visible = true;
    }

    this.hintText.setText(presentation.hintText);
    this.hintText.setVisible(presentation.hintVisible);
    this.hintText.setAlpha(1);

    if (presentation.hintVisible) {
      this.startHintPulse();
    } else {
      this.stopHintPulse();
    }
  }

  hide(): void {
    this.typewriter.stop();
    this.stopHintPulse();
    this.activeLine = null;
    if (this.visible) {
      this.container.setVisible(false);
      this.visible = false;
    }
  }

  /**
   * Refresh chrome (speaker label + advance hint) and the body text if the
   * typewriter has finished revealing. Mid-typewriter swaps would corrupt
   * the partial output, so the body is left alone until the line completes.
   */
  applyLocale(): void {
    if (!this.activeLine) return;
    const presentation = getDialogueBarPresentation(this.activeLine);
    this.speakerText.setText(presentation.speakerText);
    this.hintText.setText(presentation.hintText);
    if (this.typewriter.isComplete) {
      this.bodyText.setText(localized(this.activeLine.text));
    }
  }

  /** If typing, reveal all. Returns true if text was being typed. */
  tryRevealAll(): boolean {
    if (!this.typewriter.isComplete) {
      this.typewriter.revealAll();
      return true;
    }
    return false;
  }

  get isTypewriterComplete(): boolean {
    return this.typewriter.isComplete;
  }

  destroy(): void {
    this.typewriter.stop();
    this.stopHintPulse();
    this.container.destroy();
  }

  private startHintPulse(): void {
    this.stopHintPulse();
    this.hintTween = this.scene.tweens.add({
      targets: this.hintText,
      alpha: { from: 1, to: 0.25 },
      duration: 700,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private stopHintPulse(): void {
    if (this.hintTween) {
      this.hintTween.stop();
      this.hintTween = null;
      this.hintText.setAlpha(1);
    }
  }

  private applyPresentation(presentation: ReturnType<typeof getDialogueBarPresentation>): void {
    this.speakerText.setText(presentation.speakerText);
    this.speakerText.setColor(presentation.speakerColor);
    this.speakerText.setVisible(presentation.speakerVisible);
    this.bodyText.setColor(presentation.bodyColor);
    this.bodyText.setFontStyle(presentation.bodyFontStyle);
  }
}
