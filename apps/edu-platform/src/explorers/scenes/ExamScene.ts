import Phaser from 'phaser';
import { SceneKey } from '../config/sceneRegistry';
import { DEPTH, COLORS } from '../config/constants';
import { GameEvents } from '../events/GameEvents';
import { BaseScene } from './BaseScene';
import { ExamManager } from '../systems/ExamManager';
import type { ExamDefinition, ExamQuestion } from '../systems/ExamTypes';
import { devLog } from '../utils/logger';
import { localized } from '../i18n/types';
import { t } from '../i18n';

export class ExamScene extends BaseScene {
  private examManager!: ExamManager;
  private currentExam: ExamDefinition | null = null;
  private currentQuestionIndex = 0;
  private answers: Map<string, string[]> = new Map();
  private uiObjects: Phaser.GameObjects.GameObject[] = [];
  private active = false;
  private escDismiss: (() => void) | null = null;
  private numKeyHandler: ((event: KeyboardEvent) => void) | null = null;
  /** Currently displayed result panel, or null if showing a question. */
  private currentResult: { score: number; total: number; passed: boolean } | null = null;
  /** Auto-dismiss timer for the results screen — tracked so we can cancel it on re-render or dismiss. */
  private resultDismissTimer: Phaser.Time.TimerEvent | null = null;
  /** Enter-key handler bound during the results screen — tracked so we can unbind on re-render or dismiss. */
  private resultEnterHandler: (() => void) | null = null;

  constructor() {
    super({ key: SceneKey.EXAM });
  }

  create(): void {
    devLog('[ExamScene] Created');

    this.examManager = new ExamManager(
      this.game,
      this.bus,
      () => this.gameState,
      (updater) => this.updateState(updater)
    );

    const onExamShow = (payload: { examId: string }) => {
      this.showExam(payload.examId);
    };
    this.bus.on(GameEvents.EXAM_SHOW, onExamShow);

    // Re-render the current exam UI on canvas resize so the panel stays
    // centered and sized to the viewport (mobile bar mount/unmount, rotation).
    const onResize = () => {
      if (!this.active) return;
      if (this.currentResult) {
        this.showResults(this.currentResult);
      } else if (this.currentExam) {
        this.renderQuestion();
      }
    };
    this.scale.on('resize', onResize);

    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.EXAM_SHOW, onExamShow);
      this.scale.off('resize', onResize);
    });

    // Start in sleep mode
    this.scene.sleep();
  }

  private showExam(examId: string): void {
    const exam = this.examManager.getExamDef(examId);
    if (!exam) {
      devLog(`[ExamScene] No exam found for: ${examId}`);
      this.bus.emit(GameEvents.EXAM_DISMISSED);
      return;
    }

    // Wake up scene
    if (this.scene.isSleeping(SceneKey.EXAM)) {
      this.scene.wake();
    }
    this.active = true;
    this.currentExam = exam;
    this.currentQuestionIndex = 0;
    this.answers = new Map();
    this.currentResult = null;

    devLog(`[ExamScene] Starting exam: ${localized(exam.title)}`);
    this.renderQuestion();

    // ESC key to close exam
    this.escDismiss = () => this.dismissExam();
    this.input.keyboard?.on('keydown-ESC', this.escDismiss);
  }

  private clearNumKeyHandler(): void {
    if (this.numKeyHandler) {
      this.input.keyboard?.off('keydown', this.numKeyHandler);
      this.numKeyHandler = null;
    }
  }

  private clearUI(): void {
    for (const obj of this.uiObjects) {
      obj.destroy();
    }
    this.uiObjects = [];
  }

  private clearResultsHandlers(): void {
    if (this.resultDismissTimer) {
      this.resultDismissTimer.destroy();
      this.resultDismissTimer = null;
    }
    if (this.resultEnterHandler) {
      this.input.keyboard?.off('keydown-ENTER', this.resultEnterHandler);
      this.resultEnterHandler = null;
    }
  }

  private renderQuestion(): void {
    this.clearNumKeyHandler();
    this.clearUI();
    if (!this.currentExam) return;

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const question = this.currentExam.questions[this.currentQuestionIndex];
    const isLast = this.currentQuestionIndex === this.currentExam.questions.length - 1;
    const isFirst = this.currentQuestionIndex === 0;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.75)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM);
    this.uiObjects.push(overlay);

    // Panel dimensions
    const panelW = Math.min(560, width - 40);
    const optionW = panelW - 40;
    const optionGap = 6;
    const optionMinH = 32;
    const optionPadding = 12;
    const textWrapWidth = optionW - 16;

    // Pre-measure question text height
    const questionMeasure = this.add
      .text(0, 0, localized(question.text), {
        fontFamily: 'monospace',
        fontSize: '12px',
        wordWrap: { width: panelW - 40 },
        lineSpacing: 4,
      })
      .setVisible(false);
    const questionTextHeight = questionMeasure.height;
    questionMeasure.destroy();

    // Pre-measure option text heights for dynamic layout
    const optionHeights: number[] = [];
    for (const opt of question.options) {
      const measure = this.add
        .text(0, 0, `\u25CB ${localized(opt.text)}`, {
          fontFamily: 'monospace',
          fontSize: '11px',
          wordWrap: { width: textWrapWidth },
        })
        .setVisible(false);
      optionHeights.push(Math.max(optionMinH, measure.height + optionPadding));
      measure.destroy();
    }

    const totalOptionsH =
      optionHeights.reduce((sum, h) => sum + h, 0) + (optionHeights.length - 1) * optionGap;
    const multiHintH = question.type === 'multi' ? 28 : 12;
    // title(48) + questionText + hint/gap + options + nav(68) + padding(24)
    const contentH = 48 + questionTextHeight + multiHintH + totalOptionsH + 68 + 24;
    const panelH = Math.min(Math.max(contentH, 280), height - 40);

    const panelX = cx;
    const panelY = cy;
    const panelLeft = panelX - panelW / 2;
    const panelTop = panelY - panelH / 2;

    // Panel background
    const panel = this.add
      .rectangle(panelX, panelY, panelW, panelH, 0x111111, 0.95)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 1)
      .setStrokeStyle(2, COLORS.TEAL);
    this.uiObjects.push(panel);

    // Title bar
    const titleText = this.add
      .text(panelLeft + 16, panelTop + 12, t('exam.titlePrefix', { title: localized(this.currentExam.title) }), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(titleText);

    // Separator line
    const sepLine = this.add
      .rectangle(panelX, panelTop + 36, panelW - 16, 1, COLORS.TEAL, 0.4)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(sepLine);

    // Question counter
    const counter = this.add
      .text(
        panelLeft + panelW - 16,
        panelTop + 12,
        `${this.currentQuestionIndex + 1}/${this.currentExam.questions.length}`,
        {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#888888',
        }
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(counter);

    // Question text
    const questionText = this.add
      .text(panelLeft + 16, panelTop + 48, localized(question.text), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
        wordWrap: { width: panelW - 40 },
        lineSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(questionText);

    // Multi-choice hint
    if (question.type === 'multi') {
      const hint = this.add
        .text(panelLeft + 16, panelTop + 48 + questionText.height + 6, t('exam.selectAllMatching'), {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#888888',
          fontStyle: 'italic',
        })
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2);
      this.uiObjects.push(hint);
    }

    // Options
    const optionStartY = panelTop + 48 + questionText.height + (question.type === 'multi' ? 28 : 12);
    const selectedAnswers = this.answers.get(question.id) ?? [];

    let cumulativeY = optionStartY;
    for (let i = 0; i < question.options.length; i++) {
      const opt = question.options[i];
      const optH = optionHeights[i];
      const optY = cumulativeY;
      const isSelected = selectedAnswers.includes(opt.id);

      // Option background
      const optBg = this.add
        .rectangle(panelX, optY + optH / 2, optionW, optH, isSelected ? 0x0a2a2a : 0x1a1a1a, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2)
        .setStrokeStyle(1, isSelected ? COLORS.EXAM_SELECTED : 0x444444)
        .setInteractive({ useHandCursor: true });
      this.uiObjects.push(optBg);

      // Selection indicator
      const indicator = question.type === 'single'
        ? (isSelected ? '\u25C9' : '\u25CB')
        : (isSelected ? '\u25A0' : '\u25A1');

      const optLabel = this.add
        .text(panelLeft + 28, optY + optH / 2, `${indicator} ${localized(opt.text)}`, {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: isSelected ? '#00d4aa' : '#cccccc',
          wordWrap: { width: textWrapWidth },
        })
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3);
      this.uiObjects.push(optLabel);

      // Hover effects
      optBg.on('pointerover', () => {
        if (!selectedAnswers.includes(opt.id)) {
          optBg.setFillStyle(COLORS.EXAM_HOVER, 1);
        }
      });
      optBg.on('pointerout', () => {
        const currentSelected = this.answers.get(question.id) ?? [];
        if (!currentSelected.includes(opt.id)) {
          optBg.setFillStyle(0x1a1a1a, 1);
        }
      });

      // Click handler
      optBg.on('pointerup', () => {
        this.selectOption(question, opt.id);
      });

      cumulativeY += optH + optionGap;
    }

    // Keyboard shortcuts
    this.numKeyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!this.answers.has(question.id)) return;
        if (isLast) {
          this.submitExam();
        } else {
          this.currentQuestionIndex++;
          this.renderQuestion();
        }
        return;
      }
      if (question.type === 'single') {
        const index = parseInt(event.key, 10) - 1;
        if (index >= 0 && index < question.options.length) {
          this.selectOption(question, question.options[index].id);
        }
      }
    };
    this.input.keyboard?.on('keydown', this.numKeyHandler);

    // Navigation buttons — aligned to option area edges
    const navY = panelTop + panelH - 50;
    const areaLeft = panelLeft + 8;
    const areaRight = panelLeft + panelW - 8;

    // Close button (always visible)
    const closeBtnW = 90;
    const closeBtnX = areaLeft + closeBtnW / 2;
    const closeBg = this.add
      .rectangle(closeBtnX, navY, closeBtnW, 28, 0x222222, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2)
      .setStrokeStyle(1, 0x444444)
      .setInteractive({ useHandCursor: true });
    this.uiObjects.push(closeBg);

    const closeText = this.add
      .text(closeBtnX, navY, t('exam.close'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 3);
    this.uiObjects.push(closeText);

    closeBg.on('pointerover', () => closeBg.setFillStyle(0x333333, 1));
    closeBg.on('pointerout', () => closeBg.setFillStyle(0x222222, 1));
    closeBg.on('pointerup', () => {
      this.dismissExam();
    });

    // Previous button
    if (!isFirst) {
      const prevBtnW = 130;
      const prevBtnX = areaLeft + closeBtnW + 10 + prevBtnW / 2;
      const prevBg = this.add
        .rectangle(prevBtnX, navY, prevBtnW, 28, 0x222222, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2)
        .setStrokeStyle(1, 0x444444)
        .setInteractive({ useHandCursor: true });
      this.uiObjects.push(prevBg);

      const prevText = this.add
        .text(prevBtnX, navY, t('exam.previous'), {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#cccccc',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3);
      this.uiObjects.push(prevText);

      prevBg.on('pointerover', () => prevBg.setFillStyle(0x333333, 1));
      prevBg.on('pointerout', () => prevBg.setFillStyle(0x222222, 1));
      prevBg.on('pointerup', () => {
        this.currentQuestionIndex--;
        this.renderQuestion();
      });
    }

    // Next / Submit button
    const nextLabel = isLast ? t('exam.finish') : t('exam.next');
    const nextColor = isLast ? COLORS.TEAL : 0x222222;
    const nextTextColor = isLast ? '#000000' : '#cccccc';
    const nextBorderColor = isLast ? COLORS.TEAL : 0x444444;
    const nextBtnW = 140;
    const nextBtnX = areaRight - nextBtnW / 2;

    const nextBg = this.add
      .rectangle(nextBtnX, navY, nextBtnW, 28, nextColor, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2)
      .setStrokeStyle(1, nextBorderColor)
      .setInteractive({ useHandCursor: true });
    this.uiObjects.push(nextBg);

    const nextText = this.add
      .text(nextBtnX, navY, nextLabel, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: nextTextColor,
        fontStyle: isLast ? 'bold' : 'normal',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 3);
    this.uiObjects.push(nextText);

    nextBg.on('pointerover', () => nextBg.setFillStyle(isLast ? 0x00b894 : 0x333333, 1));
    nextBg.on('pointerout', () => nextBg.setFillStyle(nextColor, 1));
    nextBg.on('pointerup', () => {
      if (!this.answers.has(question.id)) return;
      if (isLast) {
        this.submitExam();
      } else {
        this.currentQuestionIndex++;
        this.renderQuestion();
      }
    });

    // Progress bar — aligned to option area
    const progressY = panelTop + panelH - 18;
    const progressW = optionW;
    const segW = progressW / this.currentExam.questions.length;
    for (let i = 0; i < this.currentExam.questions.length; i++) {
      const answered = this.answers.has(this.currentExam.questions[i].id);
      const isCurrent = i === this.currentQuestionIndex;
      const segColor = isCurrent ? COLORS.TEAL : (answered ? 0x00d4aa : 0x333333);
      const segAlpha = isCurrent ? 1 : (answered ? 0.5 : 0.3);

      const seg = this.add
        .rectangle(areaLeft + i * segW + segW / 2, progressY, segW - 2, 4, segColor, segAlpha)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2);
      this.uiObjects.push(seg);
    }
  }

  private selectOption(question: ExamQuestion, optionId: string): void {
    const current = this.answers.get(question.id) ?? [];

    if (question.type === 'single') {
      this.answers.set(question.id, [optionId]);
    } else {
      // Multi-choice: toggle
      if (current.includes(optionId)) {
        this.answers.set(question.id, current.filter((id) => id !== optionId));
      } else {
        this.answers.set(question.id, [...current, optionId]);
      }
    }

    // Re-render to reflect selection change
    this.renderQuestion();
  }

  private submitExam(): void {
    if (!this.currentExam) return;

    const answersRecord: Record<string, string[]> = {};
    for (const [key, val] of this.answers) {
      answersRecord[key] = val;
    }

    const result = this.examManager.evaluate(this.currentExam.id, answersRecord);
    devLog(`[ExamScene] Exam result: ${result.score}/${result.total}, passed: ${result.passed}`);

    this.showResults(result);
  }

  private showResults(result: { score: number; total: number; passed: boolean }): void {
    this.currentResult = result;
    this.clearUI();
    this.clearResultsHandlers();
    if (!this.currentExam) return;

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.75)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM);
    this.uiObjects.push(overlay);

    // Panel
    const panelW = Math.min(400, width - 40);
    const panelH = 280;
    const panelX = cx;
    const panelY = cy;
    const panelLeft = panelX - panelW / 2;
    const panelTop = panelY - panelH / 2;

    const panel = this.add
      .rectangle(panelX, panelY, panelW, panelH, 0x111111, 0.95)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 1)
      .setStrokeStyle(2, result.passed ? COLORS.EXAM_CORRECT : COLORS.EXAM_INCORRECT);
    this.uiObjects.push(panel);

    // Result title
    const resultTitle = result.passed ? t('exam.passed') : t('exam.failed');
    const resultColor = result.passed ? '#2ecc71' : '#e74c3c';

    const titleText = this.add
      .text(cx, panelTop + 30, resultTitle, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: resultColor,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(titleText);

    // Score
    const scoreText = this.add
      .text(cx, panelTop + 70, t('exam.score', { score: result.score, total: result.total }), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#cccccc',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(scoreText);

    // Passing threshold
    const thresholdText = this.add
      .text(cx, panelTop + 95, t('exam.requiredHint', { required: this.currentExam.passingScore, total: result.total }), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.EXAM + 2);
    this.uiObjects.push(thresholdText);

    if (result.passed) {
      // XP reward
      const xpText = this.add
        .text(cx, panelTop + 130, `+${this.currentExam.rewards.xp} XP`, {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffb347',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2);
      this.uiObjects.push(xpText);

      // XP pulse animation
      this.tweens.add({
        targets: xpText,
        scale: { from: 1, to: 1.15 },
        duration: 500,
        yoyo: true,
        repeat: 2,
      });

      // Apply rewards
      this.examManager.completeExam(this.currentExam.id);

      // Auto-dismiss after 3s or click. Tracked on the scene so the
      // resize handler can re-render this panel without leaking timers.
      this.resultDismissTimer = this.time.delayedCall(3000, () => {
        this.dismissExam();
      });

      overlay.setInteractive();
      overlay.on('pointerup', () => {
        this.dismissExam();
      });

      // Close (X) button in header
      const closeX = this.add
        .text(panelX + panelW / 2 - 15, panelTop + 15, '\u2715', {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#888888',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3)
        .setInteractive({ useHandCursor: true });
      closeX.on('pointerover', () => closeX.setColor('#ffffff'));
      closeX.on('pointerout', () => closeX.setColor('#888888'));
      closeX.on('pointerup', () => {
        this.dismissExam();
      });
      this.uiObjects.push(closeX);

      // Close button
      const closeBg = this.add
        .rectangle(cx, panelTop + panelH - 30, 180, 28, 0x222222, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2)
        .setStrokeStyle(1, 0x444444)
        .setInteractive({ useHandCursor: true });
      this.uiObjects.push(closeBg);

      const closeText = this.add
        .text(cx, panelTop + panelH - 30, t('exam.closeEnter'), {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#888888',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3);
      this.uiObjects.push(closeText);

      closeBg.on('pointerover', () => closeBg.setFillStyle(0x333333, 1));
      closeBg.on('pointerout', () => closeBg.setFillStyle(0x222222, 1));
      closeBg.on('pointerup', () => {
        this.dismissExam();
      });

      // Enter key to close results — tracked so it can be unbound if
      // the panel is re-rendered (e.g. on canvas resize) or dismissed.
      this.resultEnterHandler = () => {
        this.dismissExam();
      };
      this.input.keyboard?.on('keydown-ENTER', this.resultEnterHandler);
    } else {
      // Retry button
      const retryBg = this.add
        .rectangle(cx, panelTop + 160, 180, 32, COLORS.TEAL, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2)
        .setInteractive({ useHandCursor: true });
      this.uiObjects.push(retryBg);

      const retryText = this.add
        .text(cx, panelTop + 160, t('exam.tryAgain'), {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#000000',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3);
      this.uiObjects.push(retryText);

      retryBg.on('pointerover', () => retryBg.setFillStyle(0x00b894, 1));
      retryBg.on('pointerout', () => retryBg.setFillStyle(COLORS.TEAL, 1));
      retryBg.on('pointerup', () => {
        this.answers = new Map();
        this.currentQuestionIndex = 0;
        this.currentResult = null;
        this.clearResultsHandlers();
        this.renderQuestion();
      });

      // Dismiss button
      const dismissBg = this.add
        .rectangle(cx, panelTop + 205, 180, 28, 0x222222, 1)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 2)
        .setStrokeStyle(1, 0x444444)
        .setInteractive({ useHandCursor: true });
      this.uiObjects.push(dismissBg);

      const dismissText = this.add
        .text(cx, panelTop + 205, t('exam.close'), {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#888888',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.EXAM + 3);
      this.uiObjects.push(dismissText);

      dismissBg.on('pointerover', () => dismissBg.setFillStyle(0x333333, 1));
      dismissBg.on('pointerout', () => dismissBg.setFillStyle(0x222222, 1));
      dismissBg.on('pointerup', () => {
        this.dismissExam();
      });
    }
  }

  protected override onLocaleChanged(): void {
    if (!this.active) return;
    if (this.currentResult) {
      this.showResults(this.currentResult);
    } else if (this.currentExam) {
      this.renderQuestion();
    }
  }

  private dismissExam(): void {
    if (!this.active) return;
    this.clearNumKeyHandler();
    this.clearResultsHandlers();
    this.clearUI();
    this.active = false;
    this.currentExam = null;
    this.currentResult = null;

    if (this.escDismiss) {
      this.input.keyboard?.off('keydown-ESC', this.escDismiss);
      this.escDismiss = null;
    }

    this.bus.emit(GameEvents.EXAM_DISMISSED);
    this.scene.sleep();

    devLog('[ExamScene] Exam dismissed');
  }
}
