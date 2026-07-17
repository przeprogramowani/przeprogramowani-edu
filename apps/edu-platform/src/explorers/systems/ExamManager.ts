import type Phaser from 'phaser';
import type { ExamDefinition } from './ExamTypes';
import { GameEvents } from '../events/GameEvents';
import { setFlag } from '../state/flagManager';
import { devLog } from '../utils/logger';
import type { GameState } from '../state/types';
import { getAllExams, getExamCompletionDialogues } from '../levels/levelLoader';

export class ExamManager {
  private game: Phaser.Game;
  private bus: Phaser.Events.EventEmitter;
  private getState: () => GameState;
  private setState: (updater: (prev: GameState) => Partial<GameState>) => void;
  private examDefs: Map<string, ExamDefinition>;
  private examCompletionDialogues: Record<string, string>;

  constructor(
    game: Phaser.Game,
    bus: Phaser.Events.EventEmitter,
    getState: () => GameState,
    setState: (updater: (prev: GameState) => Partial<GameState>) => void
  ) {
    this.game = game;
    this.bus = bus;
    this.getState = getState;
    this.setState = setState;
    this.examDefs = getAllExams();
    this.examCompletionDialogues = getExamCompletionDialogues();
  }

  private emitSafely(event: string, payload: Record<string, unknown>, context: string): void {
    try {
      this.bus.emit(event, payload);
    } catch (error) {
      console.error(`[ExamManager] Failed to emit ${event} (${context}):`, {
        error,
        payload,
      });
    }
  }

  getExamDef(id: string): ExamDefinition | null {
    return this.examDefs.get(id) ?? null;
  }

  isCompleted(examId: string): boolean {
    const exam = this.examDefs.get(examId);
    if (!exam) return false;
    const flags = this.getState().flags;
    return exam.rewards.flags.every((f) => flags.includes(f));
  }

  /** Evaluate answers and return result. Does NOT apply rewards yet. */
  evaluate(
    examId: string,
    answers: Record<string, string[]>
  ): {
    score: number;
    total: number;
    passed: boolean;
  } {
    const exam = this.examDefs.get(examId);
    if (!exam) return { score: 0, total: 0, passed: false };

    let score = 0;
    for (const q of exam.questions) {
      const selected = answers[q.id] ?? [];
      const correct = q.correctOptionIds;
      // Must match exactly — same items, same count
      if (selected.length === correct.length && selected.every((s) => correct.includes(s))) {
        score++;
      }
    }

    return {
      score,
      total: exam.questions.length,
      passed: score >= exam.passingScore,
    };
  }

  /** Complete a passed exam — grant rewards, set flags, emit events. */
  completeExam(examId: string): void {
    try {
      const exam = this.examDefs.get(examId);
      if (!exam) return;

      const state = this.getState();
      const newXp = state.xp + exam.rewards.xp;

      // Grant XP
      this.setState(() => ({
        xp: newXp,
      }));

      // Set reward flags first, so progression is applied even if any event listener throws.
      for (const flag of exam.rewards.flags) {
        try {
          setFlag(this.game, flag);
        } catch (error) {
          console.error('[ExamManager] Failed to set reward flag after exam completion:', {
            error,
            examId,
            flag,
          });
        }
      }

      // Emit progression events
      this.emitSafely(
        GameEvents.XP_GAINED,
        { amount: exam.rewards.xp, total: newXp },
        `examId=${examId}`
      );
      this.emitSafely(
        GameEvents.EXAM_COMPLETED,
        {
          examId,
          score: exam.questions.length,
          total: exam.questions.length,
          passed: true,
          rewards: exam.rewards,
        },
        `examId=${examId}`
      );

      // Trigger completion dialogue
      const dialogueId = this.examCompletionDialogues[examId];
      if (dialogueId) {
        this.emitSafely(
          GameEvents.DIALOGUE_SHOW,
          { dialogueId },
          `examId=${examId}, dialogueId=${dialogueId}`
        );
      }

      devLog(`[ExamManager] Exam completed: ${exam.title} (+${exam.rewards.xp} XP)`);
    } catch (error) {
      console.error('[ExamManager] Unexpected error during completeExam:', { error, examId });
    }
  }
}
