import { SceneKey } from '../config/sceneRegistry';
import { DEPTH, COLORS } from '../config/constants';
import { GameEvents } from '../events/GameEvents';
import { BaseScene } from './BaseScene';
import { getArcadeGame } from '../levels/levelLoader';
import type { ArcadeCompletedPayload, ArcadeShowPayload } from '../events/GameEvents';
import { createRenderer } from '../arcade/rendererRegistry';
import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult, ArcadeStationContext } from '../systems/ArcadeTypes';
import { devLog } from '../utils/logger';
import { getArcadeStationClearFlag } from '../state/arcadeFlags';
import { resolveArcadeRunOutcome } from '../systems/arcadeMission';
import { t } from '../i18n';
import { localized } from '../i18n/types';

type ArcadePhase = 'idle' | 'intro' | 'countdown' | 'playing' | 'results';

export class ArcadeScene extends BaseScene {
  private phase: ArcadePhase = 'idle';
  private currentDefinition: ArcadeGameDefinition | null = null;
  private currentContext: ArcadeStationContext | null = null;
  private currentStationCleared = false;
  private gameRenderer: ArcadeGameRenderer | null = null;
  private uiObjects: Phaser.GameObjects.GameObject[] = [];
  private escHandler: (() => void) | null = null;
  private enterHandler: (() => void) | null = null;
  private resultsDismissHandler: (() => void) | null = null;
  private resultsDismissTimer: Phaser.Time.TimerEvent | null = null;
  private timerEvent: Phaser.Time.TimerEvent | null = null;
  private remainingSeconds = 0;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private timerText: Phaser.GameObjects.Text | null = null;
  private gameBounds!: Phaser.Geom.Rectangle;
  private pendingCompletionDialogueId: string | null = null;
  private pendingLocaleSwap = false;

  constructor() {
    super({ key: SceneKey.ARCADE });
  }

  create(): void {
    devLog('[ArcadeScene] Created');

    const onArcadeShow = (payload: ArcadeShowPayload) => {
      this.showGame(payload);
    };
    this.bus.on(GameEvents.ARCADE_SHOW, onArcadeShow);

    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.ARCADE_SHOW, onArcadeShow);
    });

    // Match other overlay scenes: start asleep and wake only when needed.
    this.scene.sleep();
  }

  update(time: number, delta: number): void {
    if (this.phase !== 'playing' || !this.gameRenderer) return;

    this.gameRenderer.update(time, delta);

    // Update score display
    if (this.scoreText) {
      this.scoreText.setText(t('arcade.scoreLabel', { score: this.gameRenderer.getScore() }));
    }

    // Check if renderer signals completion
    if (this.gameRenderer.isFinished()) {
      this.onGameEnd();
    }
  }

  private showGame(payload: ArcadeShowPayload): void {
    const definition = getArcadeGame(payload.arcadeGameId);
    if (!definition) {
      devLog(`[ArcadeScene] No arcade game found for: ${payload.arcadeGameId}`);
      this.bus.emit(GameEvents.ARCADE_DISMISSED);
      return;
    }

    if (this.phase !== 'idle') {
      devLog(`[ArcadeScene] Already active (phase=${this.phase}), ignoring`);
      return;
    }

    if (this.scene.isSleeping(SceneKey.ARCADE)) {
      this.scene.wake();
    }
    this.scene.bringToTop();

    this.currentContext = {
      mapKey: payload.mapKey,
      zoneId: payload.zoneId,
      arcadeGameId: payload.arcadeGameId,
    };
    this.currentDefinition = definition;
    const stationFlag = getArcadeStationClearFlag(this.currentContext);
    this.currentStationCleared = this.hasFlag(stationFlag);
    this.pendingCompletionDialogueId = null;
    this.phase = 'intro';

    devLog(
      `[ArcadeScene] Showing game: ${definition.title.pl} (${definition.type}) map=${payload.mapKey} zone=${payload.zoneId} solved=${this.currentStationCleared}`
    );

    // Register ESC handler
    this.escHandler = () => this.dismissGame();
    this.input.keyboard?.on('keydown-ESC', this.escHandler);

    this.renderIntro();
  }

  private renderIntro(): void {
    this.clearUI();
    if (!this.currentDefinition) return;

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE);
    this.uiObjects.push(overlay);

    // Title
    const title = this.add
      .text(cx, cy - 60, localized(this.currentDefinition.title), {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(title);

    // Description
    const desc = this.add
      .text(cx, cy - 20, localized(this.currentDefinition.description), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#cccccc',
        wordWrap: { width: 500 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(desc);

    // Difficulty stars
    const stars = '\u2605'.repeat(this.currentDefinition.difficulty) +
      '\u2606'.repeat(5 - this.currentDefinition.difficulty);
    const diffText = this.add
      .text(cx, cy + 20, t('arcade.difficultyLabel', { stars }), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffb347',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(diffText);

    if (this.currentStationCleared) {
      const bannerBg = this.add
        .rectangle(cx, cy + 70, 560, 72, 0x093b32, 0.95)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 1)
        .setStrokeStyle(1, 0x00d4aa, 0.7);
      this.uiObjects.push(bannerBg);

      const bannerText = this.add
        .text(cx, cy + 70, t('arcade.replay.disclaimer'), {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#d8fff5',
          wordWrap: { width: 520 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 2);
      this.uiObjects.push(bannerText);
    }

    // Start prompt
    const startPrompt = this.add
      .text(cx, this.currentStationCleared ? cy + 135 : cy + 60, t('arcade.startHint'), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(startPrompt);

    // Pulse animation on start prompt
    this.tweens.add({
      targets: startPrompt,
      alpha: { from: 1, to: 0.4 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // ESC hint
    const escHint = this.add
      .text(cx, this.currentStationCleared ? cy + 170 : cy + 100, t('arcade.escHint'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#666666',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(escHint);

    // Enter to start
    this.enterHandler = () => {
      if (this.phase === 'intro') {
        this.startCountdown();
      }
    };
    this.input.keyboard?.on('keydown-ENTER', this.enterHandler);
  }

  private startCountdown(): void {
    this.phase = 'countdown';
    this.clearUI();
    this.clearEnterHandler();

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE);
    this.uiObjects.push(overlay);

    const countdownText = this.add
      .text(cx, cy, '3', {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(countdownText);

    let count = 3;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.phase !== 'countdown') {
          return;
        }
        count--;
        if (count > 0) {
          countdownText.setText(`${count}`);
          // Scale pulse
          this.tweens.add({
            targets: countdownText,
            scale: { from: 1.3, to: 1 },
            duration: 300,
          });
        } else {
          this.timerEvent?.destroy();
          this.timerEvent = null;
          this.startPlaying();
        }
      },
      repeat: 2,
    });
  }

  private startPlaying(): void {
    this.phase = 'playing';
    this.clearUI();

    if (!this.currentDefinition) return;

    const { width, height } = this.scale;
    const cx = width / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, height / 2, width, height, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE);
    this.uiObjects.push(overlay);

    // Calculate game bounds (centered panel with header/footer)
    const panelW = Math.min(700, width - 40);
    const panelH = Math.min(500, height - 40);
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    const headerH = 40;
    const footerH = 30;

    // Panel border
    const panelBorder = this.add
      .rectangle(cx, height / 2, panelW, panelH, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 1)
      .setStrokeStyle(1, COLORS.TEAL, 0.5);
    this.uiObjects.push(panelBorder);

    // Header bar
    const headerBg = this.add
      .rectangle(cx, panelY + headerH / 2, panelW, headerH, 0x111111, 0.9)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 1);
    this.uiObjects.push(headerBg);

    // Title in header
    const titleText = this.add
      .text(panelX + 10, panelY + headerH / 2, localized(this.currentDefinition.title), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(titleText);

    // Score display
    this.scoreText = this.add
      .text(panelX + panelW - 200, panelY + headerH / 2, t('arcade.scoreLabelInitial'), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffb347',
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(this.scoreText);

    // Timer display (only for timed games)
    if (this.currentDefinition.durationSeconds > 0) {
      this.remainingSeconds = this.currentDefinition.durationSeconds;
      this.timerText = this.add
        .text(panelX + panelW - 80, panelY + headerH / 2, t('arcade.timerLabel', { seconds: this.remainingSeconds }), {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#ffffff',
        })
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 2);
      this.uiObjects.push(this.timerText);

      // Timer countdown
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.remainingSeconds--;
          if (this.timerText) {
            this.timerText.setText(t('arcade.timerLabel', { seconds: this.remainingSeconds }));
            if (this.remainingSeconds <= 10) {
              this.timerText.setColor('#e74c3c');
            }
          }
          if (this.remainingSeconds <= 0) {
            this.onGameEnd();
          }
        },
        repeat: this.currentDefinition.durationSeconds - 1,
      });
    }

    // Footer bar
    const footerY = panelY + panelH - footerH;
    const footerBg = this.add
      .rectangle(cx, footerY + footerH / 2, panelW, footerH, 0x111111, 0.9)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 1);
    this.uiObjects.push(footerBg);

    // ESC hint in footer
    const escText = this.add
      .text(panelX + 10, footerY + footerH / 2, t('arcade.escHint'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#666666',
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(escText);

    // Difficulty stars in footer
    const stars = '\u2605'.repeat(this.currentDefinition.difficulty) +
      '\u2606'.repeat(5 - this.currentDefinition.difficulty);
    const starsText = this.add
      .text(panelX + panelW - 10, footerY + footerH / 2, t('arcade.difficultyLabel', { stars }), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffb347',
      })
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(starsText);

    // Game area bounds (between header and footer)
    this.gameBounds = new Phaser.Geom.Rectangle(
      panelX + 2,
      panelY + headerH + 2,
      panelW - 4,
      panelH - headerH - footerH - 4
    );

    // Instantiate and start renderer
    try {
      this.gameRenderer = createRenderer(this.currentDefinition.type);
      this.gameRenderer.create(this, this.currentDefinition, this.gameBounds);
    } catch (err) {
      devLog(`[ArcadeScene] Failed to create renderer: ${err}`);
      this.dismissGame();
    }
  }

  private onGameEnd(): void {
    if (this.phase !== 'playing') return;
    this.phase = 'results';
    this.drainPendingLocaleSwap();

    // Stop timer
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = null;
    }

    // Get result from renderer
    const result: ArcadeGameResult = this.gameRenderer
      ? this.gameRenderer.getResult()
      : { score: 0, completed: false };

    // Destroy renderer
    if (this.gameRenderer) {
      this.gameRenderer.destroy();
      this.gameRenderer = null;
    }

    const definition = this.currentDefinition!;
    const context = this.currentContext!;

    let resolution = resolveArcadeRunOutcome({
      definition,
      context,
      result,
      alreadyCleared: this.currentStationCleared,
    });

    if (resolution.solved && !this.currentStationCleared) {
      const flagWasSet = this.setFlag(resolution.stationFlag);
      resolution = resolveArcadeRunOutcome({
        definition,
        context,
        result,
        alreadyCleared: false,
        flagWasSet,
      });
      if (flagWasSet) {
        this.currentStationCleared = true;
      }
    }

    const completionPayload: ArcadeCompletedPayload = {
      mapKey: context.mapKey,
      zoneId: context.zoneId,
      arcadeGameId: definition.id,
      stationFlag: resolution.stationFlag,
      score: result.score,
      maxScore: result.maxScore,
      solved: resolution.solved,
      firstClear: resolution.firstClear,
      xpGained: resolution.xpGained,
      timestamp: Date.now(),
    };

    if (resolution.xpGained > 0) {
      const newXp = this.gameState.xp + resolution.xpGained;
      this.updateState(() => ({ xp: newXp }));
      this.bus.emit(GameEvents.XP_GAINED, { amount: resolution.xpGained, total: newXp });
    }
    this.bus.emit(GameEvents.ARCADE_COMPLETED, completionPayload);

    this.pendingCompletionDialogueId = resolution.queuedDialogueId;

    devLog(
      `[ArcadeScene] Game ended: map=${context.mapKey}, zone=${context.zoneId}, game=${definition.id}, score=${result.score}, solved=${resolution.solved}, firstClear=${resolution.firstClear}`
    );

    this.showResults(result, resolution);
  }

  private showResults(
    result: ArcadeGameResult,
    resolution: ReturnType<typeof resolveArcadeRunOutcome>
  ): void {
    this.clearUI();

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE);
    this.uiObjects.push(overlay);

    const title = this.add
      .text(cx, cy - 70, t(resolution.resultTitleKey), {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: resolution.resultColor,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(title);

    // Score
    const scoreLabel = result.maxScore
      ? t('arcade.resultsScoreFull', { score: result.score, max: result.maxScore })
      : t('arcade.resultsScoreSimple', { score: result.score });
    const score = this.add
      .text(cx, cy - 20, scoreLabel, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(score);

    const message = this.add
      .text(cx, cy + 30, t(resolution.resultMessageKey), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#cccccc',
        wordWrap: { width: 520 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 2);
    this.uiObjects.push(message);

    if (resolution.xpGained > 0) {
      const xpBadge = this.add
        .text(cx, cy + 85, `+${resolution.xpGained} XP`, {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffb347',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 2);
      this.uiObjects.push(xpBadge);
    }

    // Auto-dismiss after 3s or Enter/click
    this.resultsDismissTimer = this.time.delayedCall(3000, () => {
      this.dismissGame();
    });

    overlay.setInteractive();
    overlay.on('pointerup', () => {
      this.clearResultsDismissState();
      this.dismissGame();
    });

    this.resultsDismissHandler = () => {
      this.clearResultsDismissState();
      this.dismissGame();
    };
    this.input.keyboard?.on('keydown-ENTER', this.resultsDismissHandler);
  }

  private dismissGame(): void {
    if (this.phase === 'idle') return;

    devLog(`[ArcadeScene] Dismissing game, phase=${this.phase}`);
    this.phase = 'idle';
    this.drainPendingLocaleSwap();

    try {
      if (this.timerEvent) {
        this.timerEvent.destroy();
        this.timerEvent = null;
      }
      this.clearResultsDismissState();
      if (this.gameRenderer) {
        this.gameRenderer.destroy();
        this.gameRenderer = null;
      }
      this.tweens.killAll();
      this.clearUI();
      this.clearEscHandler();
      this.clearEnterHandler();
      this.scoreText = null;
      this.timerText = null;
      this.currentDefinition = null;
      this.currentContext = null;
      this.currentStationCleared = false;
    } catch (err) {
      devLog(`[ArcadeScene] Error during cleanup: ${err}`);
    }

    // ALWAYS emit so GameScene restores movement
    this.bus.emit(GameEvents.ARCADE_DISMISSED);
    if (this.pendingCompletionDialogueId) {
      const dialogueId = this.pendingCompletionDialogueId;
      this.pendingCompletionDialogueId = null;
      devLog(`[ArcadeScene] Queueing first-clear dialogue: ${dialogueId}`);
      this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
    }
    this.scene.sleep();
  }

  private clearUI(): void {
    for (const obj of this.uiObjects) {
      obj.destroy();
    }
    this.uiObjects = [];
  }

  private clearEscHandler(): void {
    if (this.escHandler) {
      this.input.keyboard?.off('keydown-ESC', this.escHandler);
      this.escHandler = null;
    }
  }

  private clearEnterHandler(): void {
    if (this.enterHandler) {
      this.input.keyboard?.off('keydown-ENTER', this.enterHandler);
      this.enterHandler = null;
    }
  }

  protected override onLocaleChanged(): void {
    if (this.phase === 'idle') return;
    if (this.phase === 'playing') {
      // Score/timer text auto-refresh on next update tick. Mid-round panel
      // re-render would scramble the renderer; defer to round-end.
      this.pendingLocaleSwap = true;
      this.gameRenderer?.applyLocale?.();
      devLog('[Locale] deferring swap (zone=arcade-playing)');
      return;
    }
    if (this.phase === 'intro') {
      this.clearEnterHandler();
      this.renderIntro();
    }
    // countdown: no locale-sensitive UI; results: auto-dismisses, leave as-is.
  }

  private drainPendingLocaleSwap(): void {
    if (!this.pendingLocaleSwap) return;
    this.pendingLocaleSwap = false;
    devLog('[Locale] applying deferred swap');
  }

  private clearResultsDismissState(): void {
    if (this.resultsDismissTimer) {
      this.resultsDismissTimer.destroy();
      this.resultsDismissTimer = null;
    }
    if (this.resultsDismissHandler) {
      this.input.keyboard?.off('keydown-ENTER', this.resultsDismissHandler);
      this.resultsDismissHandler = null;
    }
  }
}
