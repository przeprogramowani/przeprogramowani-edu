import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

/**
 * Fault Trace — certify the annealing yard's cooling loop before the first batch.
 * The loop is a segmented schematic with one hidden fault segment. The player
 * moves a cursor across the measure points (A/D), pins probes (SPACE) that read
 * „POWYŻEJ: OK" upstream of the fault or „PONIŻEJ: BŁĄD" downstream — a binary
 * search that beats guessing. The catch, and the moon's thesis in miniature: one
 * measure point always reports green (the lying sensor), so a single reading must
 * be confirmed by a second probe. Probe budget is coolant — a wasted probe is
 * coolant lost. The player commits the faulty segment with ENTER.
 */

interface ProbeMarker {
  container: Phaser.GameObjects.Container;
  index: number;
}

// CRT palette (mirrors the other arcade renderers)
const COLOR_BG = 0x05100c;
const COLOR_GRID = 0x123326;
const COLOR_PIPE = 0x2f6f5a;
const COLOR_NODE = 0x3f8f77;
const COLOR_OK = 0x7cff7c;
const COLOR_FAULT = 0xe74c3c;
const COLOR_LIAR = 0xffd166;
const COLOR_CURSOR = 0x00d4aa;
const COLOR_TEXT_PRIMARY = '#a6f5df';
const COLOR_TEXT_CONTROLS = '#ffffff';

const SEGMENTS = 16;
const POINTS = SEGMENTS + 1;
const PROBE_BUDGET = 6;
const OPTIMAL_PROBES = 4; // log2(16); extra probes past this cost score on an exact hit
const HEADER_H = 46;
const FOOTER_H = 26;
const SIDE_PAD = 34;

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
  private reportText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private scanlines: Phaser.GameObjects.Rectangle[] = [];
  private probeMarkers: ProbeMarker[] = [];

  // Geometry
  private pointsX: number[] = [];
  private lineY = 0;

  // Round state
  private faultSegment = 0; // 0..SEGMENTS-1
  private liarPoint = 0; // 0..SEGMENTS — always reports OK regardless of truth
  private cursorIndex = 0; // 0..SEGMENTS (measure points)
  private probesLeft = PROBE_BUDGET;
  private probesUsed = 0;
  private probedFault = new Map<number, boolean>(); // index -> reported-as-faulty (post-lie)
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
    this.probeMarkers = [];
    this.scanlines = [];
    this.probedFault = new Map();
    this.committed = false;
    this.finished = false;
    this.score = 0;
    this.revealGraphics = null;
    this.finishDelayTimer = null;
    // Probe budget from difficulty: the annealing yard runs this at 3 → 6 probes,
    // a comfortable margin over log2(16)=4 if played cleanly, punishing if guessed.
    this.probesLeft = PROBE_BUDGET + (3 - config.difficulty);
    this.probesUsed = 0;

    this.generateRound();

    // Geometry — measure points evenly spaced along a horizontal loop line.
    const left = bounds.x + SIDE_PAD;
    const right = bounds.right - SIDE_PAD;
    const step = (right - left) / SEGMENTS;
    this.pointsX = [];
    for (let i = 0; i < POINTS; i++) this.pointsX.push(left + i * step);
    this.lineY = bounds.y + HEADER_H + (bounds.height - HEADER_H - FOOTER_H) * 0.42;
    this.cursorIndex = Math.floor(SEGMENTS / 2);

    // Mask
    this.maskGraphics = scene.make.graphics({ x: 0, y: 0 }, false);
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.geometryMask = this.maskGraphics.createGeometryMask();

    this.background = scene.add
      .rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height, COLOR_BG)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 3)
      .setMask(this.geometryMask);

    this.schematicGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4)
      .setMask(this.geometryMask);

    this.cursorGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.titleText = scene.add
      .text(bounds.x + 12, bounds.y + 10, t('arcade.ft.title'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7cff7c',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.statusText = scene.add
      .text(bounds.x + 12, bounds.y + 26, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: COLOR_TEXT_PRIMARY,
        lineSpacing: 3,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.reportText = scene.add
      .text(bounds.centerX, this.lineY + 46, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: COLOR_TEXT_PRIMARY,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.hintText = scene.add
      .text(bounds.x + 12, bounds.bottom - 18, t('arcade.ft.controls'), {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: COLOR_TEXT_CONTROLS,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    // Scanlines
    for (let y = bounds.y; y < bounds.bottom; y += 3) {
      const line = scene.add
        .rectangle(bounds.centerX, y, bounds.width, 1, 0x000000, 0.14)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 9)
        .setMask(this.geometryMask);
      this.scanlines.push(line);
    }

    this.drawSchematic();
    this.drawCursor(scene.time.now);
    this.updateStatusText();

    // Input — discrete stepping (A/D), edge-triggered SPACE/ENTER.
    this.keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'a') this.step(-1);
      else if (key === 'd') this.step(1);
    };
    this.spaceHandler = () => this.probe();
    this.enterHandler = () => this.commit();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.enterHandler);

    this.virtualDirDownHandler = ({ dir }) => {
      if (dir === 'left') this.step(-1);
      else if (dir === 'right') this.step(1);
    };
    this.virtualSpaceHandler = () => this.probe();
    this.virtualEnterHandler = () => this.commit();

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);
  }

  update(time: number): void {
    if (this.finished || this.committed) return;
    this.drawCursor(time);
  }

  private generateRound(): void {
    this.faultSegment = Phaser.Math.Between(0, SEGMENTS - 1);
    // The lying sensor sits downstream of the fault, where it would otherwise read
    // BŁĄD — that is the only placement that actually deceives. If the fault is in
    // the last segment there is no downstream point; fall back to any point.
    if (this.faultSegment < SEGMENTS - 1) {
      this.liarPoint = Phaser.Math.Between(this.faultSegment + 1, SEGMENTS);
    } else {
      this.liarPoint = Phaser.Math.Between(0, SEGMENTS);
    }
  }

  /** Truthful reading at a measure point: faulty (BŁĄD) if downstream of the fault. */
  private trueFaulty(index: number): boolean {
    return index > this.faultSegment;
  }

  /** Reported reading — the lying sensor always reports clean (OK). */
  private reportedFaulty(index: number): boolean {
    if (index === this.liarPoint) return false;
    return this.trueFaulty(index);
  }

  private step(dir: number): void {
    if (this.committed || this.finished) return;
    this.cursorIndex = Phaser.Math.Clamp(this.cursorIndex + dir, 0, SEGMENTS);
    this.drawCursor(this.scene.time.now);
  }

  private probe(): void {
    if (this.committed || this.finished) return;
    if (this.probesLeft <= 0) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }
    this.probesLeft--;
    this.probesUsed++;
    audioManager.playSfx(SfxKey.SIGNAL_BEEP);

    const faulty = this.reportedFaulty(this.cursorIndex);
    this.probedFault.set(this.cursorIndex, faulty);
    this.spawnProbeMarker(this.cursorIndex, faulty);

    this.reportText.setText(faulty ? t('arcade.ft.reportFault') : t('arcade.ft.reportOk'));
    this.reportText.setColor(faulty ? '#ffb347' : '#7cff7c');

    this.updateStatusText();

    if (this.probesLeft <= 0) {
      this.hintText.setText(t('arcade.ft.outOfProbes'));
      this.hintText.setColor('#ffb347');
    } else {
      this.hintText.setText(t('arcade.ft.confirmHint'));
      this.hintText.setColor('#8fd7c4');
    }
  }

  private spawnProbeMarker(index: number, faulty: boolean): void {
    // Drop a stacked pin above the point; repeated probes on one point stack up.
    const existing = this.probeMarkers.filter((m) => m.index === index).length;
    const x = this.pointsX[index];
    const y = this.lineY - 16 - existing * 12;
    const tint = faulty ? COLOR_FAULT : COLOR_OK;

    const container = this.scene.add.container(x, y)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 6)
      .setMask(this.geometryMask);

    const g = this.scene.add.graphics();
    g.lineStyle(1, tint, 0.9);
    g.lineBetween(0, 4, 0, 14); // stem down to the pipe
    g.fillStyle(tint, 0.85);
    g.fillCircle(0, 0, 4);
    g.lineStyle(1, tint, 1);
    g.strokeCircle(0, 0, 6);
    container.add(g);

    const label = this.scene.add
      .text(0, -14, faulty ? '×' : '✓', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: faulty ? '#e74c3c' : '#7cff7c',
      })
      .setOrigin(0.5, 0.5);
    container.add(label);

    this.probeMarkers.push({ container, index });
  }

  private commit(): void {
    if (this.committed || this.finished) return;
    this.committed = true;
    const guess = Math.min(this.cursorIndex, SEGMENTS - 1);
    const dist = Math.abs(guess - this.faultSegment);

    if (dist === 0) {
      const penalty = 10 * Math.max(0, this.probesUsed - OPTIMAL_PROBES);
      this.score = Phaser.Math.Clamp(100 - penalty, 0, 100);
    } else {
      // Wrong localization — partial credit by distance, capped below the pass line
      // so „prawie" never certifies the loop (never trust a near-miss green).
      this.score = Phaser.Math.Clamp(Math.round(60 * (1 - dist / SEGMENTS)), 0, 60);
    }

    audioManager.playSfx(this.score >= 70 ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
    this.revealResult(guess);

    this.finishDelayTimer = this.scene.time.delayedCall(2000, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  private revealResult(guess: number): void {
    this.revealGraphics = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);
    const g = this.revealGraphics;

    // True fault segment — burn it red.
    const fx0 = this.pointsX[this.faultSegment];
    const fx1 = this.pointsX[this.faultSegment + 1];
    g.lineStyle(4, COLOR_FAULT, 1);
    g.lineBetween(fx0, this.lineY, fx1, this.lineY);
    g.fillStyle(COLOR_FAULT, 0.9);
    g.fillCircle((fx0 + fx1) / 2, this.lineY, 4);

    // The lying sensor — mark it amber so the player learns which green lied.
    const lx = this.pointsX[this.liarPoint];
    g.lineStyle(2, COLOR_LIAR, 1);
    g.strokeCircle(lx, this.lineY, 9);
    const liarLabel = this.scene.add
      .text(lx, this.lineY + 16, '≠', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffd166',
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    // Fold the liar label into the scanline cleanup list so destroy() clears it.
    this.scanlines.push(liarLabel as unknown as Phaser.GameObjects.Rectangle);

    // Player's guess — a caret under the guessed segment.
    const gx = (this.pointsX[guess] + this.pointsX[guess + 1]) / 2;
    g.lineStyle(2, COLOR_CURSOR, 1);
    g.lineBetween(gx - 6, this.lineY + 30, gx, this.lineY + 22);
    g.lineBetween(gx + 6, this.lineY + 30, gx, this.lineY + 22);

    this.statusText.setText(t('arcade.ft.result', { score: this.score }));
    this.statusText.setColor(this.score >= 70 ? COLOR_TEXT_PRIMARY : '#e74c3c');
    this.reportText.setText('');
    this.hintText.setText(t('arcade.ft.finishHint'));
    this.hintText.setColor('#00d4aa');
  }

  private drawSchematic(): void {
    const g = this.schematicGraphics;
    g.clear();

    const left = this.pointsX[0];
    const right = this.pointsX[SEGMENTS];
    const y = this.lineY;

    // Faint frame + return-loop decoration (aesthetic; mechanics live on the line).
    g.lineStyle(1, COLOR_GRID, 0.5);
    g.strokeRect(this.bounds.x + 10, this.bounds.y + HEADER_H - 6, this.bounds.width - 20, this.bounds.height - HEADER_H - FOOTER_H + 6);
    const returnY = y + 70;
    g.lineStyle(2, COLOR_GRID, 0.9);
    g.lineBetween(left, y, left, returnY);
    g.lineBetween(right, y, right, returnY);
    g.lineBetween(left, returnY, right, returnY);

    // Main cooling line — segment by segment.
    g.lineStyle(3, COLOR_PIPE, 1);
    g.lineBetween(left, y, right, y);

    // Measure nodes.
    for (let i = 0; i < POINTS; i++) {
      g.fillStyle(COLOR_NODE, 1);
      g.fillCircle(this.pointsX[i], y, 3);
    }
  }

  private drawCursor(time: number): void {
    const g = this.cursorGraphics;
    g.clear();
    if (this.committed) return;

    const pulse = 0.6 + 0.4 * Math.sin(time / 180);
    const x = this.pointsX[this.cursorIndex];
    const y = this.lineY;

    // Candidate segment (what ENTER will commit) — the segment right of the cursor.
    const seg = Math.min(this.cursorIndex, SEGMENTS - 1);
    const sx0 = this.pointsX[seg];
    const sx1 = this.pointsX[seg + 1];
    g.lineStyle(4, COLOR_CURSOR, 0.35 * pulse);
    g.lineBetween(sx0, y, sx1, y);

    // Cursor caret over the measure point.
    g.lineStyle(2, COLOR_CURSOR, 0.9 * pulse);
    g.lineBetween(x - 6, y - 30, x, y - 22);
    g.lineBetween(x + 6, y - 30, x, y - 22);
    g.lineBetween(x, y - 22, x, y - 8);
    g.fillStyle(COLOR_CURSOR, 1);
    g.fillCircle(x, y, 4);
  }

  private updateStatusText(): void {
    if (this.committed) return;
    this.statusText.setText(t('arcade.ft.status', { probes: this.probesLeft.toString().padStart(2, '0') }));
    this.statusText.setColor(this.probesLeft > 0 ? COLOR_TEXT_PRIMARY : '#8fd7c4');
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

    for (const marker of this.probeMarkers) marker.container.destroy();
    this.probeMarkers = [];
    for (const line of this.scanlines) line.destroy();
    this.scanlines = [];

    this.revealGraphics?.destroy();
    this.revealGraphics = null;
    this.cursorGraphics?.destroy();
    this.schematicGraphics?.destroy();
    this.background?.destroy();
    this.titleText?.destroy();
    this.statusText?.destroy();
    this.reportText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.ft.title'));
    if (this.committed) {
      this.statusText.setText(t('arcade.ft.result', { score: this.score }));
      this.hintText.setText(t('arcade.ft.finishHint'));
    } else {
      this.updateStatusText();
      this.hintText.setText(
        this.probesLeft > 0 ? t('arcade.ft.controls') : t('arcade.ft.outOfProbes')
      );
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
