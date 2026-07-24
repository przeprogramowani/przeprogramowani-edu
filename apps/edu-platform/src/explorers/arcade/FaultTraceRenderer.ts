import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';
import {
  FIRST_REVISION,
  applyRevisionTest,
  getFaultTraceDifficulty,
  getIdealMidpoints,
  resolveRevisionTest,
  scoreFaultTrace,
  type RevisionTestState,
} from './FaultTraceLogic';

/**
 * Fault Trace — find the first controller revision that breaks the cooling
 * loop. The first revision is known good and the last is known bad. Testing a
 * midpoint narrows the highlighted range exactly like `git bisect`.
 *
 * Depending on difficulty, selected CI runs return a visibly suspicious false
 * pass the first time. Those results do not move the range until the player
 * repeats them, keeping the reliability wrinkle fair and legible instead of
 * silently corrupting the investigation.
 */

const COLOR_BG = 0x06110e;
const COLOR_GRID = 0x17382e;
const COLOR_MUTED = 0x37695b;
const COLOR_GOOD = 0x6fffa1;
const COLOR_BAD = 0xff635f;
const COLOR_UNSTABLE = 0xffc857;
const COLOR_CURSOR = 0x00e0b8;
const COLOR_TEXT_PRIMARY = '#b9f7e6';
const COLOR_TEXT_CONTROLS = '#ffffff';

const HEADER_H = 72;
const FOOTER_H = 30;
const SIDE_PAD = 38;

interface LastTest {
  revision: number;
  state: RevisionTestState;
}

export class FaultTraceRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private bounds!: Phaser.Geom.Rectangle;

  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;
  private background!: Phaser.GameObjects.Rectangle;
  private schematicGraphics!: Phaser.GameObjects.Graphics;
  private cursorGraphics!: Phaser.GameObjects.Graphics;
  private revealGraphics: Phaser.GameObjects.Graphics | null = null;
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private boundaryText!: Phaser.GameObjects.Text;
  private selectionText!: Phaser.GameObjects.Text;
  private reportText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private revisionLabels: Phaser.GameObjects.Text[] = [];
  private scanlines: Phaser.GameObjects.Rectangle[] = [];

  private revisionX: number[] = [];
  private timelineY = 0;

  private revisionCount = 16;
  private lastRevision = 15;
  private unstableRuns = 2;
  private parTests = 6;
  private firstBadRevision = 1;
  private unstableRevisions = new Set<number>();
  private cursorRevision = 7;
  private knownGood = FIRST_REVISION;
  private knownBad = 15;
  private testsLeft = 6;
  private testsUsed = 0;
  private testStates = new Map<number, RevisionTestState>();
  private lastTest: LastTest | null = null;
  private selectedRevision: number | null = null;
  private committed = false;
  private finished = false;
  private score = 0;

  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private spaceHandler: (() => void) | null = null;
  private enterHandler: (() => void) | null = null;
  private virtualDirDownHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualSpaceHandler: (() => void) | null = null;
  private virtualEnterHandler: (() => void) | null = null;
  private finishDelayTimer: Phaser.Time.TimerEvent | null = null;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.bounds = bounds;
    this.revisionLabels = [];
    this.scanlines = [];
    this.testStates = new Map();
    this.lastTest = null;
    this.selectedRevision = null;
    this.committed = false;
    this.finished = false;
    this.score = 0;
    this.revealGraphics = null;
    this.finishDelayTimer = null;
    const difficulty = getFaultTraceDifficulty(config.difficulty);
    this.revisionCount = difficulty.revisionCount;
    this.lastRevision = difficulty.revisionCount - 1;
    this.unstableRuns = difficulty.unstableRuns;
    this.parTests = difficulty.parTests;
    this.unstableRevisions = new Set();
    this.knownGood = FIRST_REVISION;
    this.knownBad = this.lastRevision;
    this.testsLeft = difficulty.testBudget;
    this.testsUsed = 0;

    this.generateRound();

    const left = bounds.x + SIDE_PAD;
    const right = bounds.right - SIDE_PAD;
    const step = (right - left) / this.lastRevision;
    this.revisionX = Array.from(
      { length: this.revisionCount },
      (_, index) => left + index * step
    );
    this.timelineY = bounds.y + Math.min(178, bounds.height * 0.44);
    this.cursorRevision = Math.floor(this.lastRevision / 2);

    this.maskGraphics = scene.make.graphics({ x: 0, y: 0 }, false);
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.geometryMask = this.maskGraphics.createGeometryMask();

    this.background = scene.add
      .rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height, COLOR_BG)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 3)
      .setMask(this.geometryMask);

    this.schematicGraphics = scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4)
      .setMask(this.geometryMask);

    this.cursorGraphics = scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.titleText = this.makeText(
      bounds.x + 12,
      bounds.y + 9,
      t('arcade.ft.title'),
      '10px',
      '#6fffa1',
      'left',
      true
    );

    this.statusText = this.makeText(
      bounds.x + 12,
      bounds.y + 26,
      '',
      '9px',
      COLOR_TEXT_PRIMARY,
      'left'
    ).setWordWrapWidth(bounds.width - 24);

    this.boundaryText = this.makeText(
      bounds.centerX,
      bounds.y + 48,
      '',
      '9px',
      '#8ecfbd',
      'center'
    ).setOrigin(0.5, 0);

    this.selectionText = this.makeText(
      bounds.centerX,
      this.timelineY + 40,
      '',
      '11px',
      COLOR_TEXT_PRIMARY,
      'center',
      true
    ).setOrigin(0.5, 0);

    this.reportText = this.makeText(
      bounds.centerX,
      this.timelineY + 63,
      '',
      '9px',
      COLOR_TEXT_PRIMARY,
      'center'
    )
      .setOrigin(0.5, 0)
      .setWordWrapWidth(bounds.width - 50);

    this.hintText = this.makeText(
      bounds.x + 12,
      bounds.bottom - 19,
      t('arcade.ft.controls'),
      '9px',
      COLOR_TEXT_CONTROLS,
      'left'
    );

    const labelInterval = this.revisionCount > 20 ? 2 : 1;
    for (let index = 0; index < this.revisionCount; index++) {
      if (
        index !== FIRST_REVISION &&
        index !== this.lastRevision &&
        index % labelInterval !== 0
      ) {
        continue;
      }
      const label = this.makeText(
        this.revisionX[index],
        this.timelineY + 14,
        `#${index.toString().padStart(2, '0')}`,
        '8px',
        '#78aa9c',
        'center'
      ).setOrigin(0.5, 0);
      this.revisionLabels.push(label);
    }

    for (let y = bounds.y; y < bounds.bottom; y += 3) {
      const line = scene.add
        .rectangle(bounds.centerX, y, bounds.width, 1, 0x000000, 0.13)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 9)
        .setMask(this.geometryMask);
      this.scanlines.push(line);
    }

    this.drawSchematic();
    this.drawCursor(scene.time.now);
    this.refreshCopy();

    this.keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') this.step(-1);
      else if (key === 'd' || key === 'arrowright') this.step(1);
    };
    this.spaceHandler = () => this.runTest();
    this.enterHandler = () => this.commit();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.enterHandler);

    this.virtualDirDownHandler = ({ dir }) => {
      if (dir === 'left') this.step(-1);
      else if (dir === 'right') this.step(1);
    };
    this.virtualSpaceHandler = () => this.runTest();
    this.virtualEnterHandler = () => this.commit();

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);
  }

  update(time: number): void {
    if (this.finished || this.committed) return;
    this.drawCursor(time);
  }

  private makeText(
    x: number,
    y: number,
    text: string,
    fontSize: string,
    color: string,
    align: 'left' | 'center',
    bold = false
  ): Phaser.GameObjects.Text {
    return this.scene.add
      .text(x, y, text, {
        fontFamily: 'monospace',
        fontSize,
        color,
        align,
        fontStyle: bold ? 'bold' : 'normal',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
  }

  private generateRound(): void {
    this.firstBadRevision = Phaser.Math.Between(1, this.lastRevision - 1);
    const idealMidpoints = getIdealMidpoints(this.firstBadRevision, this.lastRevision);
    const shuffledMidpoints = Phaser.Utils.Array.Shuffle([...idealMidpoints]);
    this.unstableRevisions = new Set(shuffledMidpoints.slice(0, this.unstableRuns));
  }

  private step(direction: number): void {
    if (this.committed || this.finished) return;
    this.cursorRevision = Phaser.Math.Clamp(
      this.cursorRevision + direction,
      FIRST_REVISION + 1,
      this.lastRevision
    );
    this.drawSchematic();
    this.drawCursor(this.scene.time.now);
    this.refreshCopy();
  }

  private runTest(): void {
    if (this.committed || this.finished) return;
    if (this.testsLeft <= 0) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }

    this.testsLeft--;
    this.testsUsed++;
    const previousState = this.testStates.get(this.cursorRevision);
    const state = resolveRevisionTest(
      this.cursorRevision,
      this.firstBadRevision,
      this.unstableRevisions,
      previousState
    );
    this.testStates.set(this.cursorRevision, state);
    this.lastTest = { revision: this.cursorRevision, state };

    if (state === 'unstable') {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
    } else {
      audioManager.playSfx(SfxKey.SIGNAL_BEEP);
      const nextBounds = applyRevisionTest(
        { knownGood: this.knownGood, knownBad: this.knownBad },
        this.cursorRevision,
        state
      );
      this.knownGood = nextBounds.knownGood;
      this.knownBad = nextBounds.knownBad;
    }

    this.drawSchematic();
    this.drawCursor(this.scene.time.now);
    this.refreshCopy();
  }

  private commit(): void {
    if (this.committed || this.finished) return;
    this.committed = true;
    this.selectedRevision = this.cursorRevision;
    this.score = scoreFaultTrace(
      this.selectedRevision,
      this.firstBadRevision,
      this.testsUsed,
      this.parTests,
      this.lastRevision
    );

    audioManager.playSfx(this.score >= 70 ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
    this.revealResult();
    this.finishDelayTimer = this.scene.time.delayedCall(2400, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  private drawSchematic(): void {
    const g = this.schematicGraphics;
    g.clear();

    for (let x = this.bounds.x + 10; x < this.bounds.right; x += 32) {
      g.lineStyle(1, COLOR_GRID, 0.18);
      g.lineBetween(x, this.bounds.y + HEADER_H, x, this.bounds.bottom - FOOTER_H);
    }
    for (let y = this.bounds.y + HEADER_H; y < this.bounds.bottom - FOOTER_H; y += 28) {
      g.lineStyle(1, COLOR_GRID, 0.18);
      g.lineBetween(this.bounds.x + 10, y, this.bounds.right - 10, y);
    }

    const y = this.timelineY;
    for (let index = 0; index < this.lastRevision; index++) {
      let color = COLOR_UNSTABLE;
      let alpha = 0.58;
      if (index < this.knownGood) {
        color = COLOR_GOOD;
        alpha = 0.8;
      } else if (index >= this.knownBad) {
        color = COLOR_BAD;
        alpha = 0.8;
      }
      g.lineStyle(4, color, alpha);
      g.lineBetween(this.revisionX[index], y, this.revisionX[index + 1], y);
    }

    for (let index = 0; index < this.revisionCount; index++) {
      const state = this.testStates.get(index);
      const insideRange = index > this.knownGood && index < this.knownBad;
      let color = COLOR_MUTED;
      let fillAlpha = 0.9;

      if (state === 'unstable') {
        color = COLOR_UNSTABLE;
      } else if (index <= this.knownGood) {
        color = COLOR_GOOD;
      } else if (index >= this.knownBad) {
        color = COLOR_BAD;
      } else if (insideRange) {
        color = COLOR_UNSTABLE;
        fillAlpha = 0.24;
      }

      g.fillStyle(color, fillAlpha);
      g.fillCircle(this.revisionX[index], y, 5);
      g.lineStyle(state === 'unstable' ? 2 : 1, color, 1);
      g.strokeCircle(this.revisionX[index], y, state === 'unstable' ? 9 : 6);

      if (state === 'good') {
        g.lineStyle(2, COLOR_GOOD, 1);
        g.lineBetween(this.revisionX[index] - 3, y, this.revisionX[index] - 1, y + 3);
        g.lineBetween(this.revisionX[index] - 1, y + 3, this.revisionX[index] + 4, y - 4);
      } else if (state === 'bad') {
        g.lineStyle(2, COLOR_BAD, 1);
        g.lineBetween(this.revisionX[index] - 3, y - 3, this.revisionX[index] + 3, y + 3);
        g.lineBetween(this.revisionX[index] + 3, y - 3, this.revisionX[index] - 3, y + 3);
      } else if (state === 'unstable') {
        g.lineStyle(2, COLOR_UNSTABLE, 1);
        g.lineBetween(this.revisionX[index], y - 4, this.revisionX[index], y + 1);
        g.fillStyle(COLOR_UNSTABLE, 1);
        g.fillCircle(this.revisionX[index], y + 4, 1);
      }
    }

    const rangeStart = this.revisionX[this.knownGood] + 8;
    const rangeEnd = this.revisionX[this.knownBad] - 8;
    const bracketY = y - 36;
    g.lineStyle(2, COLOR_UNSTABLE, 0.85);
    g.lineBetween(rangeStart, bracketY, rangeEnd, bracketY);
    g.lineBetween(rangeStart, bracketY, rangeStart, bracketY + 7);
    g.lineBetween(rangeEnd, bracketY, rangeEnd, bracketY + 7);

    this.drawTelemetry(g);
  }

  private drawTelemetry(g: Phaser.GameObjects.Graphics): void {
    const state = this.testStates.get(this.cursorRevision);
    const x0 = this.bounds.x + 92;
    const x1 = this.bounds.right - 92;
    const y = this.timelineY + 111;

    g.lineStyle(1, COLOR_GRID, 0.8);
    g.lineBetween(x0, y, x1, y);

    if (!state) {
      g.lineStyle(2, COLOR_MUTED, 0.65);
      for (let x = x0; x < x1; x += 14) g.lineBetween(x, y, Math.min(x + 6, x1), y);
      return;
    }

    const color =
      state === 'good' ? COLOR_GOOD : state === 'bad' ? COLOR_BAD : COLOR_UNSTABLE;
    const points = 44;
    g.lineStyle(2, color, 0.95);
    for (let index = 0; index < points - 1; index++) {
      const progress0 = index / (points - 1);
      const progress1 = (index + 1) / (points - 1);
      const px0 = Phaser.Math.Linear(x0, x1, progress0);
      const px1 = Phaser.Math.Linear(x0, x1, progress1);
      const wave0 = this.telemetryOffset(state, progress0);
      const wave1 = this.telemetryOffset(state, progress1);
      g.lineBetween(px0, y + wave0, px1, y + wave1);
    }
  }

  private telemetryOffset(state: RevisionTestState, progress: number): number {
    if (state === 'good') return Math.sin(progress * Math.PI * 8) * 5;
    if (state === 'unstable') {
      return Math.sin(progress * Math.PI * 8) * 5 + Math.sin(progress * Math.PI * 25) * 4;
    }
    if (progress < 0.45) return Math.sin(progress * Math.PI * 8) * 5;
    return Math.sin(progress * Math.PI * 17) * 12 - progress * 12;
  }

  private drawCursor(time: number): void {
    const g = this.cursorGraphics;
    g.clear();
    if (this.committed) return;

    const pulse = 0.68 + 0.32 * Math.sin(time / 180);
    const x = this.revisionX[this.cursorRevision];
    const y = this.timelineY;
    g.lineStyle(2, COLOR_CURSOR, 0.95 * pulse);
    g.strokeCircle(x, y, 12 + pulse * 2);
    g.lineBetween(x - 6, y - 22, x, y - 15);
    g.lineBetween(x + 6, y - 22, x, y - 15);
    g.fillStyle(COLOR_CURSOR, 0.9);
    g.fillTriangle(x - 4, y - 25, x + 4, y - 25, x, y - 19);
  }

  private refreshCopy(): void {
    if (this.committed) return;

    const candidates = this.knownBad - this.knownGood;
    this.statusText.setText(
      t('arcade.ft.status', {
        tests: this.testsLeft.toString().padStart(2, '0'),
        candidates,
        unstable: this.unstableRuns,
      })
    );
    this.boundaryText.setText(
      t('arcade.ft.range', {
        good: this.formatRevision(this.knownGood),
        bad: this.formatRevision(this.knownBad),
      })
    );

    const selectedState = this.testStates.get(this.cursorRevision);
    const selectedKey =
      selectedState === 'good'
        ? 'arcade.ft.selectedGood'
        : selectedState === 'bad'
          ? 'arcade.ft.selectedBad'
          : selectedState === 'unstable'
            ? 'arcade.ft.selectedUnstable'
            : 'arcade.ft.selectedUnknown';
    this.selectionText.setText(
      t(selectedKey, { revision: this.formatRevision(this.cursorRevision) })
    );
    this.selectionText.setColor(
      selectedState === 'good'
        ? '#6fffa1'
        : selectedState === 'bad'
          ? '#ff7f7b'
          : selectedState === 'unstable'
            ? '#ffd978'
            : COLOR_TEXT_PRIMARY
    );

    this.updateReportText();

    if (candidates === 1) {
      this.hintText.setText(
        t('arcade.ft.readyHint', { revision: this.formatRevision(this.knownBad) })
      );
      this.hintText.setColor('#6fffa1');
    } else if (this.testsLeft <= 0) {
      this.hintText.setText(t('arcade.ft.outOfTests'));
      this.hintText.setColor('#ffb36b');
    } else if (this.lastTest?.state === 'unstable') {
      this.hintText.setText(t('arcade.ft.repeatHint'));
      this.hintText.setColor('#ffd978');
    } else {
      this.hintText.setText(t('arcade.ft.controls'));
      this.hintText.setColor(COLOR_TEXT_CONTROLS);
    }
  }

  private updateReportText(): void {
    if (!this.lastTest) {
      this.reportText.setText(t('arcade.ft.startHint'));
      this.reportText.setColor('#8ecfbd');
      return;
    }

    const key =
      this.lastTest.state === 'good'
        ? 'arcade.ft.reportGood'
        : this.lastTest.state === 'bad'
          ? 'arcade.ft.reportBad'
          : 'arcade.ft.reportUnstable';
    this.reportText.setText(
      t(key, { revision: this.formatRevision(this.lastTest.revision) })
    );
    this.reportText.setColor(
      this.lastTest.state === 'good'
        ? '#6fffa1'
        : this.lastTest.state === 'bad'
          ? '#ff7f7b'
          : '#ffd978'
    );
  }

  private revealResult(): void {
    this.revealGraphics = this.scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);
    const g = this.revealGraphics;
    const trueX = this.revisionX[this.firstBadRevision];
    const selectedX = this.revisionX[this.selectedRevision ?? this.cursorRevision];

    g.lineStyle(3, COLOR_BAD, 1);
    g.strokeCircle(trueX, this.timelineY, 14);
    g.lineBetween(trueX, this.timelineY - 30, trueX, this.timelineY - 17);

    g.lineStyle(2, COLOR_CURSOR, 1);
    g.lineBetween(selectedX - 7, this.timelineY + 36, selectedX, this.timelineY + 27);
    g.lineBetween(selectedX + 7, this.timelineY + 36, selectedX, this.timelineY + 27);

    this.statusText.setText(t('arcade.ft.result', { score: this.score }));
    this.statusText.setColor(this.score >= 70 ? COLOR_TEXT_PRIMARY : '#ff7f7b');
    this.boundaryText.setText(
      t('arcade.ft.resultDetail', {
        fault: this.formatRevision(this.firstBadRevision),
        selected: this.formatRevision(this.selectedRevision ?? this.cursorRevision),
      })
    );
    this.boundaryText.setColor(this.score >= 70 ? '#6fffa1' : '#ff7f7b');
    this.selectionText.setText('');
    this.reportText.setText('');
    this.hintText.setText(t('arcade.ft.finishHint'));
    this.hintText.setColor('#00e0b8');
  }

  private formatRevision(revision: number): string {
    return `#${revision.toString().padStart(2, '0')}`;
  }

  destroy(): void {
    if (this.keydownHandler) {
      this.scene.input.keyboard?.off('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.spaceHandler) {
      this.scene.input.keyboard?.off('keydown-SPACE', this.spaceHandler);
      this.spaceHandler = null;
    }
    if (this.enterHandler) {
      this.scene.input.keyboard?.off('keydown-ENTER', this.enterHandler);
      this.enterHandler = null;
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
    if (this.finishDelayTimer) {
      this.finishDelayTimer.destroy();
      this.finishDelayTimer = null;
    }

    for (const label of this.revisionLabels) label.destroy();
    this.revisionLabels = [];
    for (const line of this.scanlines) line.destroy();
    this.scanlines = [];

    this.revealGraphics?.destroy();
    this.revealGraphics = null;
    this.cursorGraphics?.destroy();
    this.schematicGraphics?.destroy();
    this.background?.destroy();
    this.titleText?.destroy();
    this.statusText?.destroy();
    this.boundaryText?.destroy();
    this.selectionText?.destroy();
    this.reportText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.ft.title'));
    if (this.committed) {
      this.statusText.setText(t('arcade.ft.result', { score: this.score }));
      this.boundaryText.setText(
        t('arcade.ft.resultDetail', {
          fault: this.formatRevision(this.firstBadRevision),
          selected: this.formatRevision(this.selectedRevision ?? this.cursorRevision),
        })
      );
      this.hintText.setText(t('arcade.ft.finishHint'));
    } else {
      this.refreshCopy();
    }
  }

  isFinished(): boolean {
    return this.finished;
  }

  getScore(): number {
    return this.score;
  }

  getResult(): ArcadeGameResult {
    return {
      score: this.score,
      maxScore: 100,
      completed: this.committed && this.score >= 70,
    };
  }
}
