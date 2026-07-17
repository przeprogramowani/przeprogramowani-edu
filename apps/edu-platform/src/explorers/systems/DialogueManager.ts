import type Phaser from 'phaser';
import { GameEvents } from '../events/GameEvents';
import { setFlag } from '../state/flagManager';
import { devLog, devWarn } from '../utils/logger';
import type { DialogueSequence, DialogueLine, DialogueEffect } from './DialogueTypes';
import { getAllDialogues } from '../levels/levelLoader';
import { addBookmark } from './BookmarkManager';
import { localized } from '../i18n/types';

export class DialogueManager {
  private sequences = new Map<string, DialogueSequence>();
  private currentSequence: DialogueSequence | null = null;
  private currentLineIndex = 0;
  private game: Phaser.Game;
  private bus: Phaser.Events.EventEmitter;

  constructor(game: Phaser.Game, bus: Phaser.Events.EventEmitter) {
    this.game = game;
    this.bus = bus;
    this.loadAllDialogues();
  }

  private loadAllDialogues(): void {
    const dialogues = getAllDialogues();
    for (const [id, seq] of dialogues) {
      this.sequences.set(id, seq);
    }
    devLog(`[DialogueManager] Loaded ${this.sequences.size} dialogue sequences`);
  }

  hasDialogue(id: string): boolean {
    return this.sequences.has(id);
  }

  startDialogue(id: string): DialogueLine | null {
    const seq = this.sequences.get(id);
    if (!seq) {
      devWarn(`[DialogueManager] Unknown dialogue: ${id}`);
      return null;
    }

    this.currentSequence = seq;
    this.currentLineIndex = 0;
    return this.getCurrentLine();
  }

  getCurrentLine(): DialogueLine | null {
    if (!this.currentSequence) return null;
    if (this.currentLineIndex >= this.currentSequence.lines.length) return null;
    return this.currentSequence.lines[this.currentLineIndex];
  }

  /** Advance to next line. Returns the next line, or null if sequence is done. */
  advance(): DialogueLine | null {
    if (!this.currentSequence) return null;

    this.currentLineIndex++;

    if (this.currentLineIndex >= this.currentSequence.lines.length) {
      // Sequence complete — apply effects
      this.applyEffects(this.currentSequence.onComplete);
      const completedId = this.currentSequence.id;
      this.currentSequence = null;
      this.currentLineIndex = 0;
      devLog(`[DialogueManager] Sequence complete: ${completedId}`);
      return null;
    }

    return this.getCurrentLine();
  }

  isActive(): boolean {
    return this.currentSequence !== null;
  }

  /** Skip to end of current sequence, applying effects */
  skip(): void {
    if (!this.currentSequence) return;
    this.applyEffects(this.currentSequence.onComplete);
    devLog(`[DialogueManager] Sequence skipped: ${this.currentSequence.id}`);
    this.currentSequence = null;
    this.currentLineIndex = 0;
  }

  private applyEffects(effects?: DialogueEffect): void {
    if (!effects) return;

    if (effects.setFlags) {
      for (const flag of effects.setFlags) {
        setFlag(this.game, flag);
      }
    }
    if (effects.activateQuest) {
      this.bus.emit(GameEvents.QUEST_ACTIVATE_REQUEST, { questId: effects.activateQuest });
    }
    if (effects.completeQuest) {
      this.bus.emit(GameEvents.QUEST_COMPLETE_REQUEST, { questId: effects.completeQuest });
    }
    if (effects.triggerEvent) {
      this.bus.emit(effects.triggerEvent);
    }
    if (effects.addBookmark) {
      addBookmark(this.game, this.bus, effects.addBookmark.url, localized(effects.addBookmark.title));
      if (effects.addBookmark.afterDialogue) {
        const dialogueId = effects.addBookmark.afterDialogue;
        this.bus.once(GameEvents.PREVIEW_DISMISSED, () => {
          this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
        });
      }
    }
    if (effects.openUrl) {
      this.bus.emit(GameEvents.PREVIEW_SHOW, {
        url: effects.openUrl,
        title: effects.openUrlTitle ? localized(effects.openUrlTitle) : undefined,
      });
    }
    if (effects.grantXp) {
      const state = this.game.registry.get('demoGameState') as import('../state/types').GameState;
      const newXp = state.xp + effects.grantXp;
      const next = { ...state, xp: newXp };
      this.game.registry.set('demoGameState', next);
      this.bus.emit(GameEvents.XP_GAINED, { amount: effects.grantXp, total: newXp });
      this.bus.emit(GameEvents.STATE_CHANGED, { state: next });
    }
  }
}
