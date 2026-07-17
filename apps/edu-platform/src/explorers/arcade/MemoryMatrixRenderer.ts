import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

type MemoryPhase = 'showing' | 'input' | 'feedback' | 'done';

interface Cell {
  bg: Phaser.GameObjects.Rectangle;
  row: number;
  col: number;
}

// Difficulty scaling
const DIFFICULTY_CONFIG: Record<number, {
  gridSize: number;
  startingPatternSize: number;
  displayTimeMs: number;
  displayDecayMs: number;
  minDisplayMs: number;
  totalRounds: number;
  patternGrowth: number;
}> = {
  1: { gridSize: 3, startingPatternSize: 2, displayTimeMs: 3000, displayDecayMs: 200, minDisplayMs: 800, totalRounds: 5, patternGrowth: 1 },
  2: { gridSize: 3, startingPatternSize: 2, displayTimeMs: 2500, displayDecayMs: 225, minDisplayMs: 650, totalRounds: 6, patternGrowth: 1 },
  3: { gridSize: 4, startingPatternSize: 3, displayTimeMs: 2000, displayDecayMs: 250, minDisplayMs: 500, totalRounds: 7, patternGrowth: 1 },
  4: { gridSize: 4, startingPatternSize: 3, displayTimeMs: 1600, displayDecayMs: 275, minDisplayMs: 400, totalRounds: 8, patternGrowth: 2 },
  5: { gridSize: 5, startingPatternSize: 4, displayTimeMs: 1200, displayDecayMs: 300, minDisplayMs: 300, totalRounds: 10, patternGrowth: 2 },
};

const COLOR_BG = 0x0a1a0a;
const COLOR_CELL = 0x112211;
const COLOR_CELL_BORDER = 0x1a3a1a;
const COLOR_PATTERN_ACTIVE = 0x00ff66;
const COLOR_CURSOR = 0x00d4aa;
const COLOR_SELECTED = 0x00aa44;
const COLOR_CORRECT = 0x00ff66;
const COLOR_INCORRECT = 0xe74c3c;
const COLOR_HINT_SHOWING = '#1a5a1a';
const COLOR_HINT_CONTROLS = '#ffffff';

export class MemoryMatrixRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private config!: ArcadeGameDefinition;
  private bounds!: Phaser.Geom.Rectangle;
  private diffConfig!: typeof DIFFICULTY_CONFIG[1];

  private cells: Cell[] = [];
  private scanlines: Phaser.GameObjects.Rectangle[] = [];
  private background!: Phaser.GameObjects.Rectangle;
  private headerText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private cursorRect!: Phaser.GameObjects.Rectangle;
  private gameObjects: Phaser.GameObjects.GameObject[] = [];

  private phase: MemoryPhase = 'showing';
  private currentRound = 0;
  private score = 0;
  private finished = false;
  private roundsCompletedCount = 0;
  private lastFeedback:
    | { passed: true; points: number }
    | { passed: false; correct: number; total: number }
    | null = null;

  private pattern: Set<string> = new Set(); // "row,col" keys
  private selected: Set<string> = new Set();
  private cursorRow = 0;
  private cursorCol = 0;
  private gridSize = 4;

  // Grid layout
  private gridOffsetX = 0;
  private gridOffsetY = 0;
  private cellSize = 0;
  private cellGap = 4;

  // Input handlers
  private keyHandler: ((event: KeyboardEvent) => void) | null = null;
  private virtualDirDownHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualSpaceHandler: (() => void) | null = null;
  private virtualEnterHandler: (() => void) | null = null;

  // Timers
  private phaseTimer: Phaser.Time.TimerEvent | null = null;
  private flickerTimers: Phaser.Time.TimerEvent[] = [];
  private showPhaseStartedAt = 0;
  private showPhaseDurationMs = 0;

  // Mask
  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.config = config;
    this.bounds = bounds;
    this.diffConfig = DIFFICULTY_CONFIG[config.difficulty] ?? DIFFICULTY_CONFIG[3];
    this.gridSize = this.diffConfig.gridSize;
    this.score = 0;
    this.finished = false;
    this.currentRound = 0;
    this.gameObjects = [];
    this.flickerTimers = [];

    // Mask for clipping
    this.maskGraphics = scene.make.graphics({ x: 0, y: 0 }, false);
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.geometryMask = this.maskGraphics.createGeometryMask();

    // Dark green-black background
    this.background = scene.add
      .rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height, COLOR_BG)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 3)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.background);

    // CRT scanlines
    this.scanlines = [];
    for (let y = bounds.y; y < bounds.bottom; y += 3) {
      const line = scene.add
        .rectangle(bounds.centerX, y, bounds.width, 1, 0x000000, 0.15)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 9)
        .setMask(this.geometryMask);
      this.scanlines.push(line);
      this.gameObjects.push(line);
    }

    // Header text
    this.headerText = scene.add
      .text(bounds.x + 10, bounds.y + 8, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#00ff66',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.headerText);

    // Hint text (below grid)
    this.hintText = scene.add
      .text(bounds.centerX, bounds.bottom - 20, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#1a5a1a',
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.hintText);

    // Calculate grid layout
    const availableH = bounds.height - 60; // header + hint space
    const availableW = bounds.width - 20;
    const maxCellSize = Math.floor(Math.min(availableW, availableH) / this.gridSize) - this.cellGap;
    this.cellSize = Math.min(maxCellSize, 64);
    const gridTotalSize = this.gridSize * (this.cellSize + this.cellGap) - this.cellGap;
    this.gridOffsetX = bounds.centerX - gridTotalSize / 2;
    this.gridOffsetY = bounds.y + 35 + (availableH - gridTotalSize) / 2;

    // Create grid cells
    this.cells = [];
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = this.gridOffsetX + col * (this.cellSize + this.cellGap) + this.cellSize / 2;
        const y = this.gridOffsetY + row * (this.cellSize + this.cellGap) + this.cellSize / 2;
        const bg = scene.add
          .rectangle(x, y, this.cellSize, this.cellSize, COLOR_CELL)
          .setScrollFactor(0)
          .setDepth(DEPTH.ARCADE + 5)
          .setStrokeStyle(1, COLOR_CELL_BORDER)
          .setMask(this.geometryMask);
        this.cells.push({ bg, row, col });
        this.gameObjects.push(bg);
      }
    }

    // Cursor highlight
    const firstCell = this.cells[0];
    this.cursorRect = scene.add
      .rectangle(firstCell.bg.x, firstCell.bg.y, this.cellSize + 4, this.cellSize + 4)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 6)
      .setStrokeStyle(2, COLOR_CURSOR)
      .setFillStyle(0x000000, 0)
      .setVisible(false)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.cursorRect);

    // Register keyboard input
    this.keyHandler = (event: KeyboardEvent) => this.handleKey(event);
    scene.input.keyboard?.on('keydown', this.keyHandler);

    // Virtual controls — only act during input phase to mirror handleKey()
    const moveCursor = (dir: 'up' | 'down' | 'left' | 'right') => {
      if (this.phase !== 'input') return;
      switch (dir) {
        case 'up':
          this.cursorRow = (this.cursorRow - 1 + this.gridSize) % this.gridSize;
          break;
        case 'down':
          this.cursorRow = (this.cursorRow + 1) % this.gridSize;
          break;
        case 'left':
          this.cursorCol = (this.cursorCol - 1 + this.gridSize) % this.gridSize;
          break;
        case 'right':
          this.cursorCol = (this.cursorCol + 1) % this.gridSize;
          break;
      }
      this.updateCursorPosition();
    };

    this.virtualDirDownHandler = ({ dir }) => moveCursor(dir);
    this.virtualSpaceHandler = () => {
      if (this.phase === 'input') this.toggleCell();
    };
    this.virtualEnterHandler = () => {
      if (this.phase === 'input') this.submitSelection();
    };

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);

    // Start first round
    this.startRound();
  }

  update(_time: number, _delta: number): void {
    if (this.phase === 'showing') {
      this.renderPatternSignal(_time);
    }
  }

  private startRound(): void {
    this.currentRound++;
    this.selected.clear();
    this.cursorRow = 0;
    this.cursorCol = 0;

    // Generate pattern
    const patternSize = this.diffConfig.startingPatternSize +
      (this.currentRound - 1) * this.diffConfig.patternGrowth;
    const clamped = Math.min(patternSize, this.gridSize * this.gridSize - 1);
    this.pattern = this.generatePattern(clamped);

    // Update header
    this.headerText.setText(
      t('arcade.mm.headerSignal', {
        current: this.currentRound,
        total: this.diffConfig.totalRounds,
      })
    );

    // Show phase
    this.phase = 'showing';
    this.lastFeedback = null;
    this.cursorRect.setVisible(false);
    this.hintText.setText(t('arcade.mm.hintMemorize'));
    this.hintText.setColor(COLOR_HINT_SHOWING);

    this.resetCellColors();

    // Add random static noise flickers
    this.addStaticNoise();

    // After display time, switch to input phase
    const displayTime = Math.max(
      this.diffConfig.minDisplayMs,
      this.diffConfig.displayTimeMs - (this.currentRound - 1) * this.diffConfig.displayDecayMs
    );
    this.showPhaseStartedAt = this.scene.time.now;
    this.showPhaseDurationMs = displayTime;
    audioManager.playSfx(SfxKey.SIGNAL_BEEP);
    this.renderPatternSignal(this.showPhaseStartedAt);

    this.phaseTimer = this.scene.time.delayedCall(displayTime, () => {
      this.enterInputPhase();
    });
  }

  private enterInputPhase(): void {
    this.phase = 'input';
    this.resetCellColors();
    this.cursorRect.setVisible(true);
    this.updateCursorPosition();
    this.hintText.setText(t('arcade.mm.hintControls'));
    this.hintText.setColor(COLOR_HINT_CONTROLS);

    // Clear any remaining flicker timers
    for (const timer of this.flickerTimers) {
      timer.destroy();
    }
    this.flickerTimers = [];
  }

  private handleKey(event: KeyboardEvent): void {
    if (this.phase === 'input') {
      switch (event.key) {
        case 'w':
        case 'W':
          this.cursorRow = (this.cursorRow - 1 + this.gridSize) % this.gridSize;
          this.updateCursorPosition();
          break;
        case 's':
        case 'S':
          this.cursorRow = (this.cursorRow + 1) % this.gridSize;
          this.updateCursorPosition();
          break;
        case 'a':
        case 'A':
          this.cursorCol = (this.cursorCol - 1 + this.gridSize) % this.gridSize;
          this.updateCursorPosition();
          break;
        case 'd':
        case 'D':
          this.cursorCol = (this.cursorCol + 1) % this.gridSize;
          this.updateCursorPosition();
          break;
        case ' ':
          event.preventDefault();
          this.toggleCell();
          break;
        case 'Enter':
          this.submitSelection();
          break;
      }
    }
  }

  private updateCursorPosition(): void {
    const cell = this.getCell(this.cursorRow, this.cursorCol);
    if (cell) {
      this.cursorRect.setPosition(cell.bg.x, cell.bg.y);
    }
  }

  private toggleCell(): void {
    const key = `${this.cursorRow},${this.cursorCol}`;
    const cell = this.getCell(this.cursorRow, this.cursorCol);
    if (!cell) return;
    audioManager.playSfx(SfxKey.CELL_CLICK);

    if (this.selected.has(key)) {
      this.selected.delete(key);
      cell.bg.setFillStyle(COLOR_CELL);
    } else {
      this.selected.add(key);
      cell.bg.setFillStyle(COLOR_SELECTED);
    }
  }

  private submitSelection(): void {
    this.phase = 'feedback';
    this.cursorRect.setVisible(false);

    // Calculate correct matches
    let correct = 0;
    for (const key of this.pattern) {
      if (this.selected.has(key)) correct++;
    }

    // Show feedback
    for (const cell of this.cells) {
      const key = `${cell.row},${cell.col}`;
      const isPattern = this.pattern.has(key);
      const isSelected = this.selected.has(key);

      if (isPattern && isSelected) {
        cell.bg.setFillStyle(COLOR_CORRECT);
      } else if (isPattern && !isSelected) {
        // Missed — show dimmed green
        cell.bg.setFillStyle(COLOR_CORRECT, 0.3);
      } else if (!isPattern && isSelected) {
        cell.bg.setFillStyle(COLOR_INCORRECT);
      } else {
        cell.bg.setFillStyle(COLOR_CELL);
      }
    }

    const roundPassed = correct === this.pattern.size &&
      this.selected.size === this.pattern.size;

    if (roundPassed) {
      this.score += this.pattern.size;
    }

    const isLastRound = this.currentRound >= this.diffConfig.totalRounds;

    if (roundPassed) {
      this.lastFeedback = { passed: true, points: correct };
      audioManager.playSfx(SfxKey.SUCCESS_CHIME);
      this.hintText.setText(t('arcade.mm.feedbackCorrect', { points: correct }));
      this.hintText.setColor('#00ff66');
    } else {
      this.lastFeedback = { passed: false, correct, total: this.pattern.size };
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      this.hintText.setText(t('arcade.mm.feedbackIncorrect', { correct, total: this.pattern.size }));
      this.hintText.setColor('#e74c3c');
    }

    // After feedback delay, proceed
    this.phaseTimer = this.scene.time.delayedCall(1500, () => {
      if (!roundPassed || isLastRound) {
        this.endGame();
      } else {
        this.hintText.setColor(COLOR_HINT_SHOWING);
        this.startRound();
      }
    });
  }

  private endGame(): void {
    this.phase = 'done';
    this.finished = true;
    this.roundsCompletedCount = this.currentRound;
    this.cursorRect.setVisible(false);
    this.headerText.setText(t('arcade.mm.transmissionEnded'));
    this.hintText.setText(t('arcade.mm.roundsCompleted', { count: this.roundsCompletedCount }));
    this.hintText.setColor('#00ff66');
  }

  applyLocale(): void {
    this.refreshActivePhaseText();
  }

  private refreshActivePhaseText(): void {
    if (this.phase === 'done') {
      this.headerText.setText(t('arcade.mm.transmissionEnded'));
      this.hintText.setText(
        t('arcade.mm.roundsCompleted', { count: this.roundsCompletedCount })
      );
      return;
    }
    this.headerText.setText(
      t('arcade.mm.headerSignal', {
        current: this.currentRound,
        total: this.diffConfig.totalRounds,
      })
    );
    if (this.phase === 'showing') {
      this.hintText.setText(t('arcade.mm.hintMemorize'));
    } else if (this.phase === 'input') {
      this.hintText.setText(t('arcade.mm.hintControls'));
    } else if (this.phase === 'feedback' && this.lastFeedback) {
      if (this.lastFeedback.passed) {
        this.hintText.setText(
          t('arcade.mm.feedbackCorrect', { points: this.lastFeedback.points })
        );
      } else {
        this.hintText.setText(
          t('arcade.mm.feedbackIncorrect', {
            correct: this.lastFeedback.correct,
            total: this.lastFeedback.total,
          })
        );
      }
    }
  }

  private generatePattern(size: number): Set<string> {
    const pattern = new Set<string>();
    while (pattern.size < size) {
      const row = Phaser.Math.Between(0, this.gridSize - 1);
      const col = Phaser.Math.Between(0, this.gridSize - 1);
      pattern.add(`${row},${col}`);
    }
    return pattern;
  }

  private getCell(row: number, col: number): Cell | undefined {
    return this.cells.find((c) => c.row === row && c.col === col);
  }

  private resetCellColors(): void {
    for (const cell of this.cells) {
      cell.bg.setFillStyle(COLOR_CELL);
      cell.bg.setAlpha(1);
    }
  }

  private renderPatternSignal(time: number): void {
    const elapsed = Math.max(0, time - this.showPhaseStartedAt);
    const progress = this.showPhaseDurationMs > 0
      ? Phaser.Math.Clamp(elapsed / this.showPhaseDurationMs, 0, 1)
      : 0;

    for (const cell of this.cells) {
      const key = `${cell.row},${cell.col}`;
      if (!this.pattern.has(key)) continue;

      const seed = cell.row * 17 + cell.col * 31;
      const primaryWave = Math.sin((elapsed + seed * 83) / 120);
      const secondaryWave = Math.sin((elapsed + seed * 47) / 55);
      const signalStrength = primaryWave + secondaryWave * 0.35;
      const visible = signalStrength > 0.45;

      if (visible) {
        const brightness = Phaser.Math.Clamp(0.6 + Math.abs(secondaryWave) * 0.3, 0.6, 0.9);
        cell.bg.setFillStyle(COLOR_PATTERN_ACTIVE);
        cell.bg.setAlpha(brightness * (1 - progress * 0.2));
      } else {
        cell.bg.setFillStyle(COLOR_CELL);
        cell.bg.setAlpha(1);
      }
    }
  }

  private addStaticNoise(): void {
    // Random brief flickers on non-pattern cells during show phase
    const nonPatternCells = this.cells.filter(
      (c) => !this.pattern.has(`${c.row},${c.col}`)
    );
    const flickerCount = Math.min(3, nonPatternCells.length);

    for (let i = 0; i < flickerCount; i++) {
      const cell = nonPatternCells[Phaser.Math.Between(0, nonPatternCells.length - 1)];
      const delay = Phaser.Math.Between(200, 800);
      const timer = this.scene.time.delayedCall(delay, () => {
        if (this.phase !== 'showing') return;
        const dimColor = Phaser.Math.Between(0x0a1a0a, 0x1a3a1a);
        cell.bg.setFillStyle(dimColor);
        this.scene.time.delayedCall(100, () => {
          if (this.phase === 'showing' && !this.pattern.has(`${cell.row},${cell.col}`)) {
            cell.bg.setFillStyle(COLOR_CELL);
          }
        });
      });
      this.flickerTimers.push(timer);
    }
  }

  destroy(): void {
    if (this.keyHandler) {
      this.scene.input.keyboard?.off('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.virtualDirDownHandler) {
      this.scene.game.events.off('virtual-dir-down', this.virtualDirDownHandler);
      this.virtualDirDownHandler = null;
    }
    if (this.virtualSpaceHandler) {
      this.scene.game.events.off('virtual-space', this.virtualSpaceHandler);
      this.virtualSpaceHandler = null;
    }
    if (this.virtualEnterHandler) {
      this.scene.game.events.off('virtual-enter', this.virtualEnterHandler);
      this.virtualEnterHandler = null;
    }

    if (this.phaseTimer) {
      this.phaseTimer.destroy();
      this.phaseTimer = null;
    }

    for (const timer of this.flickerTimers) {
      timer.destroy();
    }
    this.flickerTimers = [];

    for (const obj of this.gameObjects) {
      obj.destroy();
    }
    this.gameObjects = [];
    this.cells = [];
    this.scanlines = [];

    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();
  }

  isFinished(): boolean {
    return this.finished;
  }

  getScore(): number {
    return this.score;
  }

  getResult(): ArcadeGameResult {
    const firstRoundScore = this.diffConfig.startingPatternSize;
    const lastRoundScore =
      this.diffConfig.startingPatternSize +
      (this.diffConfig.totalRounds - 1) * this.diffConfig.patternGrowth;
    const maxScore = (this.diffConfig.totalRounds * (firstRoundScore + lastRoundScore)) / 2;
    return {
      score: this.score,
      maxScore,
      completed: this.currentRound >= this.diffConfig.totalRounds,
    };
  }
}
