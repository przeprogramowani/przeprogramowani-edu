import Phaser from 'phaser';
import { TYPEWRITER_CHARS_PER_SEC } from '../config/constants';

export class TypewriterEffect {
  private fullText = '';
  private currentIndex = 0;
  private timer: Phaser.Time.TimerEvent | null = null;
  private textObject: Phaser.GameObjects.Text;
  private onCompleteCb: (() => void) | null = null;
  private onCharRevealedCb: (() => void) | null = null;
  private _isComplete = false;

  constructor(textObject: Phaser.GameObjects.Text) {
    this.textObject = textObject;
  }

  get isComplete(): boolean {
    return this._isComplete;
  }

  start(
    text: string,
    scene: Phaser.Scene,
    onComplete?: () => void,
    onCharRevealed?: () => void,
  ): void {
    this.stop();
    this.fullText = text;
    this.currentIndex = 0;
    this._isComplete = false;
    this.onCompleteCb = onComplete ?? null;
    this.onCharRevealedCb = onCharRevealed ?? null;
    this.textObject.setText('');

    const delay = 1000 / TYPEWRITER_CHARS_PER_SEC;

    this.timer = scene.time.addEvent({
      delay,
      callback: () => {
        this.currentIndex++;
        this.textObject.setText(this.fullText.substring(0, this.currentIndex));

        // Fire blip callback for non-whitespace characters
        const char = this.fullText[this.currentIndex - 1];
        if (char && char.trim() && this.onCharRevealedCb) {
          this.onCharRevealedCb();
        }

        if (this.currentIndex >= this.fullText.length) {
          this.timer?.destroy();
          this.timer = null;
          this._isComplete = true;
          this.onCompleteCb?.();
        }
      },
      loop: true,
    });
  }

  revealAll(): void {
    if (this._isComplete) return;
    this.timer?.destroy();
    this.timer = null;
    this.currentIndex = this.fullText.length;
    this.textObject.setText(this.fullText);
    this._isComplete = true;
    this.onCompleteCb?.();
  }

  stop(): void {
    this.timer?.destroy();
    this.timer = null;
    this._isComplete = true;
  }
}
