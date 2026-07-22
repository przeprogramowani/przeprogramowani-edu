import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

/**
 * Cartograph — map the collapsed galleries before the machines are sent in.
 * A covered grid is the cross-section of the vault's caved-in galleries. A single
 * true corridor snakes column-by-column from a known ENTRY to a known EXIT; the
 * middle is buried. The player moves a cursor (WSAD) and drives a ground probe
 * (SPACE) into a cell, revealing a fragment: a live CORRIDOR node whose stubs point
 * to its real neighbours, or — the moon's thesis in miniature — a fragment of an
 * OLDER, out-of-date floor that looks like a corridor but connects to nothing.
 * Following the real stubs reconstructs the route; chasing stale fragments wastes
 * probes (each probe is drill wear). ENTER commits the reconstructed route. A map
 * that fails to link ENTRY→EXIT never certifies the passage — you don't send the
 * gantries down an unverified plan.
 */

const COLS = 6;
const ROWS = 4;

// CRT palette (mirrors the other arcade renderers)
const COLOR_BG = 0x05100c;
const COLOR_GRID = 0x123326;
const COLOR_FOG = 0x0c2019;
const COLOR_NODE = 0x3f8f77;
const COLOR_REAL = 0x7cff7c;
const COLOR_STALE = 0xffd166;
const COLOR_EMPTY = 0x2f6f5a;
const COLOR_CURSOR = 0x00d4aa;
const COLOR_ENDPOINT = 0x00d4aa;
const COLOR_TEXT_PRIMARY = '#a6f5df';
const COLOR_TEXT_CONTROLS = '#ffffff';

const HEADER_H = 46;
const FOOTER_H = 26;
const SIDE_PAD = 26;

type CellKind = 'real' | 'stale' | 'empty';

export class CartographRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private bounds!: Phaser.Geom.Rectangle;

  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  private background!: Phaser.GameObjects.Rectangle;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private cursorGraphics!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private reportText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private scanlines: Phaser.GameObjects.Rectangle[] = [];

  // Geometry
  private cellW = 0;
  private cellH = 0;
  private gridLeft = 0;
  private gridTop = 0;

  // Round state
  private kind: CellKind[][] = []; // [c][r]
  private pathRow: number[] = []; // pathRow[c] = row of the true corridor in column c
  private staleStubs: Map<number, Array<{ dc: number; dr: number }>> = new Map();
  private revealed: Set<number> = new Set();
  private cursorC = 0;
  private cursorR = 0;
  private probesLeft = 8;
  private probesUsed = 0;
  private wasted = 0;
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
    this.scanlines = [];
    this.revealed = new Set();
    this.staleStubs = new Map();
    this.committed = false;
    this.finished = false;
    this.score = 0;
    this.probesUsed = 0;
    this.wasted = 0;
    this.finishDelayTimer = null;

    // Budget: the vault runs this at difficulty 3 → probes to spare over the
    // COLS-2 middle cells that must be revealed, punishing if the player chases
    // stale fragments instead of following the real stubs.
    this.probesLeft = (COLS - 2) + 4 + (3 - config.difficulty);

    this.generateRound();

    // Geometry — grid fills the play area between header and footer.
    this.gridLeft = bounds.x + SIDE_PAD;
    this.gridTop = bounds.y + HEADER_H;
    const gridW = bounds.width - SIDE_PAD * 2;
    const gridH = bounds.height - HEADER_H - FOOTER_H - 20;
    this.cellW = gridW / COLS;
    this.cellH = gridH / ROWS;
    this.cursorC = 1;
    this.cursorR = this.pathRow[1];

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

    this.gridGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4)
      .setMask(this.geometryMask);

    this.cursorGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.titleText = scene.add
      .text(bounds.x + 12, bounds.y + 10, t('arcade.cg.title'), {
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
      .text(bounds.centerX, bounds.bottom - 40, '', {
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
      .text(bounds.x + 12, bounds.bottom - 18, t('arcade.cg.controls'), {
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

    this.drawGrid();
    this.drawCursor(scene.time.now);
    this.updateStatusText();

    // Input — grid stepping (WSAD), edge-triggered SPACE/ENTER.
    this.keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'w') this.step(0, -1);
      else if (key === 's') this.step(0, 1);
      else if (key === 'a') this.step(-1, 0);
      else if (key === 'd') this.step(1, 0);
    };
    this.spaceHandler = () => this.probe();
    this.enterHandler = () => this.commit();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.enterHandler);

    this.virtualDirDownHandler = ({ dir }) => {
      if (dir === 'up') this.step(0, -1);
      else if (dir === 'down') this.step(0, 1);
      else if (dir === 'left') this.step(-1, 0);
      else if (dir === 'right') this.step(1, 0);
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

  private cellIndex(c: number, r: number): number {
    return c * ROWS + r;
  }

  private generateRound(): void {
    // True corridor: one cell per column, adjacent columns differ by at most one row.
    this.pathRow = [];
    let r = Phaser.Math.Between(0, ROWS - 1);
    this.pathRow.push(r);
    for (let c = 1; c < COLS; c++) {
      const delta = Phaser.Math.Between(-1, 1);
      r = Phaser.Math.Clamp(r + delta, 0, ROWS - 1);
      this.pathRow.push(r);
    }

    // Classify every cell: path cells are real; a handful of off-path cells are
    // stale (old-floor decoys); the rest is rubble.
    this.kind = [];
    for (let c = 0; c < COLS; c++) {
      const col: CellKind[] = [];
      for (let rr = 0; rr < ROWS; rr++) col.push('empty');
      this.kind.push(col);
    }
    for (let c = 0; c < COLS; c++) this.kind[c][this.pathRow[c]] = 'real';

    // Seed stale fragments on off-path cells, biased toward cells adjacent to the
    // path so they genuinely tempt the player.
    const offPath: Array<{ c: number; r: number }> = [];
    for (let c = 0; c < COLS; c++) {
      for (let rr = 0; rr < ROWS; rr++) {
        if (this.kind[c][rr] !== 'real') offPath.push({ c, r: rr });
      }
    }
    const staleCount = Math.min(offPath.length, 4);
    for (let i = 0; i < staleCount; i++) {
      const idx = Phaser.Math.Between(0, offPath.length - 1);
      const cell = offPath.splice(idx, 1)[0];
      this.kind[cell.c][cell.r] = 'stale';
      // Stale stubs point at 1-2 neighbours that are NOT real path-neighbours —
      // they look like connections but lead nowhere.
      const dirs = [
        { dc: -1, dr: 0 },
        { dc: 1, dr: 0 },
        { dc: 0, dr: -1 },
        { dc: 0, dr: 1 },
      ].filter(({ dc, dr }) => {
        const nc = cell.c + dc;
        const nr = cell.r + dr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) return false;
        return this.kind[nc][nr] !== 'real';
      });
      const stubs: Array<{ dc: number; dr: number }> = [];
      const stubCount = Math.min(dirs.length, Phaser.Math.Between(1, 2));
      for (let s = 0; s < stubCount; s++) {
        const di = Phaser.Math.Between(0, dirs.length - 1);
        stubs.push(dirs.splice(di, 1)[0]);
      }
      this.staleStubs.set(this.cellIndex(cell.c, cell.r), stubs);
    }

    // Known endpoints are pre-revealed; the buried middle must be reconstructed.
    this.revealed.add(this.cellIndex(0, this.pathRow[0]));
    this.revealed.add(this.cellIndex(COLS - 1, this.pathRow[COLS - 1]));
  }

  private step(dc: number, dr: number): void {
    if (this.committed || this.finished) return;
    this.cursorC = Phaser.Math.Clamp(this.cursorC + dc, 0, COLS - 1);
    this.cursorR = Phaser.Math.Clamp(this.cursorR + dr, 0, ROWS - 1);
    this.drawCursor(this.scene.time.now);
  }

  private probe(): void {
    if (this.committed || this.finished) return;
    const idx = this.cellIndex(this.cursorC, this.cursorR);
    if (this.revealed.has(idx)) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }
    if (this.probesLeft <= 0) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }
    this.probesLeft--;
    this.probesUsed++;
    this.revealed.add(idx);

    const kind = this.kind[this.cursorC][this.cursorR];
    if (kind === 'real') {
      audioManager.playSfx(SfxKey.SIGNAL_BEEP);
      this.reportText.setText(t('arcade.cg.reportReal'));
      this.reportText.setColor('#7cff7c');
      this.hintText.setText(t('arcade.cg.controls'));
      this.hintText.setColor(COLOR_TEXT_CONTROLS);
    } else if (kind === 'stale') {
      this.wasted++;
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      this.reportText.setText(t('arcade.cg.reportStale'));
      this.reportText.setColor('#ffd166');
      this.hintText.setText(t('arcade.cg.staleHint'));
      this.hintText.setColor('#ffd166');
    } else {
      this.wasted++;
      audioManager.playSfx(SfxKey.CELL_CLICK);
      this.reportText.setText(t('arcade.cg.reportEmpty'));
      this.reportText.setColor('#8fd7c4');
      this.hintText.setText(t('arcade.cg.controls'));
      this.hintText.setColor(COLOR_TEXT_CONTROLS);
    }

    this.drawGrid();
    this.updateStatusText();

    if (this.probesLeft <= 0) {
      this.hintText.setText(t('arcade.cg.outOfProbes'));
      this.hintText.setColor('#ffb347');
    }
  }

  private revealedMiddleCount(): number {
    let n = 0;
    for (let c = 1; c < COLS - 1; c++) {
      if (this.revealed.has(this.cellIndex(c, this.pathRow[c]))) n++;
    }
    return n;
  }

  private commit(): void {
    if (this.committed || this.finished) return;
    this.committed = true;

    const middleTotal = COLS - 2;
    const revealedMiddle = this.revealedMiddleCount();
    const coverage = middleTotal > 0 ? revealedMiddle / middleTotal : 1;
    const connected = revealedMiddle === middleTotal;

    if (connected) {
      // Full ENTRY→EXIT reconstruction; only wasted probes on stale/rubble cost.
      this.score = Phaser.Math.Clamp(100 - 10 * this.wasted, 30, 100);
    } else {
      // A partial map never certifies the passage (score capped below the pass line).
      this.score = Phaser.Math.Clamp(Math.round(65 * coverage) - 5 * this.wasted, 0, 64);
    }

    audioManager.playSfx(this.score >= 70 ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
    this.revealResult();

    this.finishDelayTimer = this.scene.time.delayedCall(2000, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  private revealResult(): void {
    // Reveal the whole board so the player learns which fragments were stale.
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) this.revealed.add(this.cellIndex(c, r));
    }
    this.drawGrid();
    this.statusText.setText(t('arcade.cg.result', { score: this.score }));
    this.statusText.setColor(this.score >= 70 ? COLOR_TEXT_PRIMARY : '#e74c3c');
    this.reportText.setText('');
    this.hintText.setText(t('arcade.cg.finishHint'));
    this.hintText.setColor('#00d4aa');
  }

  private cellCenter(c: number, r: number): { x: number; y: number } {
    return {
      x: this.gridLeft + c * this.cellW + this.cellW / 2,
      y: this.gridTop + r * this.cellH + this.cellH / 2,
    };
  }

  private drawGrid(): void {
    const g = this.gridGraphics;
    g.clear();

    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const x = this.gridLeft + c * this.cellW;
        const y = this.gridTop + r * this.cellH;
        const cx = x + this.cellW / 2;
        const cy = y + this.cellH / 2;
        const idx = this.cellIndex(c, r);
        const revealed = this.revealed.has(idx);

        // Cell frame.
        g.lineStyle(1, COLOR_GRID, 0.8);
        g.strokeRect(x + 2, y + 2, this.cellW - 4, this.cellH - 4);

        if (!revealed) {
          g.fillStyle(COLOR_FOG, 1);
          g.fillRect(x + 3, y + 3, this.cellW - 6, this.cellH - 6);
          continue;
        }

        const kind = this.kind[c][r];
        if (kind === 'real') {
          // Node + stubs toward its real path-neighbours.
          g.fillStyle(COLOR_NODE, 1);
          g.fillCircle(cx, cy, 5);
          g.lineStyle(2, COLOR_REAL, 0.95);
          for (const nc of [c - 1, c + 1]) {
            if (nc < 0 || nc >= COLS) continue;
            const nr = this.pathRow[nc];
            const nCenter = this.cellCenter(nc, nr);
            g.lineBetween(cx, cy, (cx + nCenter.x) / 2, (cy + nCenter.y) / 2);
          }
        } else if (kind === 'stale') {
          // Looks like a corridor, but its stubs dead-end at rubble/old floor.
          g.fillStyle(COLOR_STALE, 0.85);
          g.fillCircle(cx, cy, 4);
          g.lineStyle(2, COLOR_STALE, 0.85);
          const stubs = this.staleStubs.get(idx) ?? [];
          for (const { dc, dr } of stubs) {
            g.lineBetween(cx, cy, cx + dc * (this.cellW * 0.32), cy + dr * (this.cellH * 0.32));
          }
        } else {
          // Rubble.
          g.lineStyle(1, COLOR_EMPTY, 0.7);
          g.lineBetween(cx - 5, cy - 5, cx + 5, cy + 5);
          g.lineBetween(cx - 5, cy + 5, cx + 5, cy - 5);
        }
      }
    }

    // Endpoint rings — the known ENTRY and EXIT of the corridor.
    for (const c of [0, COLS - 1]) {
      const center = this.cellCenter(c, this.pathRow[c]);
      this.gridGraphics.lineStyle(2, COLOR_ENDPOINT, 0.9);
      this.gridGraphics.strokeCircle(center.x, center.y, 9);
    }
  }

  private drawCursor(time: number): void {
    const g = this.cursorGraphics;
    g.clear();
    if (this.committed) return;

    const pulse = 0.55 + 0.45 * Math.sin(time / 180);
    const x = this.gridLeft + this.cursorC * this.cellW;
    const y = this.gridTop + this.cursorR * this.cellH;

    g.lineStyle(2, COLOR_CURSOR, 0.9 * pulse);
    g.strokeRect(x + 2, y + 2, this.cellW - 4, this.cellH - 4);
  }

  private updateStatusText(): void {
    if (this.committed) return;
    this.statusText.setText(t('arcade.cg.status', { probes: this.probesLeft.toString().padStart(2, '0') }));
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

    for (const line of this.scanlines) line.destroy();
    this.scanlines = [];

    this.cursorGraphics?.destroy();
    this.gridGraphics?.destroy();
    this.background?.destroy();
    this.titleText?.destroy();
    this.statusText?.destroy();
    this.reportText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.cg.title'));
    if (this.committed) {
      this.statusText.setText(t('arcade.cg.result', { score: this.score }));
      this.hintText.setText(t('arcade.cg.finishHint'));
    } else {
      this.updateStatusText();
      this.hintText.setText(
        this.probesLeft > 0 ? t('arcade.cg.controls') : t('arcade.cg.outOfProbes')
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
