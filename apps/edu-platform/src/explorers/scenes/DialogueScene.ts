import Phaser from 'phaser';
import { SceneKey } from '../config/sceneRegistry';
import { GameEvents } from '../events/GameEvents';
import { SYSTEM_MESSAGE_DURATION_MS } from '../config/constants';
import { BaseScene } from './BaseScene';
import { DialogueBar } from '../ui/DialogueBar';
import { DialogueManager } from '../systems/DialogueManager';
import { devLog, devWarn } from '../utils/logger';
import type { DialogueLine } from '../systems/DialogueTypes';

export class DialogueScene extends BaseScene {
  private dialogueBar!: DialogueBar;
  private dialogueManager!: DialogueManager;
  private autoAdvanceTimer: Phaser.Time.TimerEvent | null = null;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  private active = false;

  constructor() {
    super({ key: SceneKey.DIALOGUE });
  }

  create(): void {
    devLog('[DialogueScene] Created');

    this.dialogueBar = new DialogueBar(this);
    this.dialogueManager = new DialogueManager(this.game, this.bus);

    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Listen for dialogue show events
    const onDialogueShow = (payload: { dialogueId: string }) => {
      this.showDialogue(payload.dialogueId);
    };
    this.bus.on(GameEvents.DIALOGUE_SHOW, onDialogueShow);

    // Virtual buttons from MobileControls (mirrors SPACE/ESC handling above)
    const onVirtualSpace = () => {
      if (this.active) this.handleAdvance();
    };
    const onVirtualEsc = () => {
      if (this.active) this.handleSkip();
    };
    this.game.events.on('virtual-space', onVirtualSpace);
    this.game.events.on('virtual-esc', onVirtualEsc);

    // Reposition the dialogue bar when the canvas resizes (e.g. mobile
    // control bar mount/unmount, device rotation).
    const onResize = () => this.dialogueBar.relayout();
    this.scale.on('resize', onResize);

    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.DIALOGUE_SHOW, onDialogueShow);
      this.game.events.off('virtual-space', onVirtualSpace);
      this.game.events.off('virtual-esc', onVirtualEsc);
      this.scale.off('resize', onResize);
    });
  }

  protected override onLocaleChanged(): void {
    if (this.active) {
      this.dialogueBar?.applyLocale();
    }
  }

  update(): void {
    if (!this.active) return;

    // Space: reveal all or advance
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.handleAdvance();
    }

    // Esc: skip entire sequence
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.handleSkip();
    }
  }

  private showDialogue(dialogueId: string): void {
    const firstLine = this.dialogueManager.startDialogue(dialogueId);
    if (!firstLine) {
      devWarn(`[DialogueScene] No dialogue found for: ${dialogueId}`);
      this.bus.emit(GameEvents.DIALOGUE_DISMISSED);
      return;
    }

    this.active = true;

    this.showLine(firstLine);
  }

  private showLine(line: DialogueLine): void {
    // Clear any existing auto-advance timer
    this.clearAutoAdvance();

    this.dialogueBar.show(line, () => {
      // Typewriter done callback — set up auto-advance if needed
      if (line.autoAdvance) {
        this.autoAdvanceTimer = this.time.delayedCall(line.autoAdvance, () => {
          this.advanceToNext();
        });
      }
    });
  }

  private handleAdvance(): void {
    // If typewriter still typing, reveal all
    if (this.dialogueBar.tryRevealAll()) {
      return;
    }

    // Otherwise advance to next line
    this.clearAutoAdvance();
    this.advanceToNext();
  }

  private handleSkip(): void {
    this.clearAutoAdvance();
    this.dialogueManager.skip();
    this.finishDialogue();
  }

  private advanceToNext(): void {
    const nextLine = this.dialogueManager.advance();
    if (nextLine) {
      this.showLine(nextLine);
    } else {
      this.finishDialogue();
    }
  }

  private finishDialogue(): void {
    this.clearAutoAdvance();
    this.dialogueBar.hide();
    this.active = false;

    // Emit dismissed event
    this.bus.emit(GameEvents.DIALOGUE_DISMISSED);
  }

  private clearAutoAdvance(): void {
    if (this.autoAdvanceTimer) {
      this.autoAdvanceTimer.destroy();
      this.autoAdvanceTimer = null;
    }
  }
}
