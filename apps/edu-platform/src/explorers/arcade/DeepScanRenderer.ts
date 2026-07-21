import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

/**
 * Deep Scan — CORE AI is blind, so the astronaut probes the ravine by feel.
 * A hidden deposit (a gaussian intensity peak) sits somewhere on an invisible
 * field, surrounded by 2-3 false echo sources that flicker and decay. The player
 * moves a cursor (WSAD), emits pings (SPACE) that read the combined field at the
 * cursor, and finally marks the spot they believe holds the pure vein (ENTER).
 * Ping budget is the camp battery — a wasted ping is power taken from the mission.
 */

interface FieldSource {
  x: number;
  y: number;
  /** Peak contribution 0..1 at the source centre. */
  amplitude: number;
  /** Falloff radius in pixels. */
  sigma: number;
  /** True deposit vs. false echo. */
  real: boolean;
}

interface PingMarker {
  container: Phaser.GameObjects.Container;
  x: number;
  y: number;
}

// CRT palette (mirrors the other arcade renderers)
const COLOR_BG = 0x05100c;
const COLOR_GRID = 0x123326;
const COLOR_GRID_FAINT = 0x0b1f17;
const COLOR_CURSOR = 0x00d4aa;
const COLOR_PING_HOT = 0x7cff7c;
const COLOR_PING_COLD = 0x2f6f5a;
const COLOR_MARK = 0xffd166;
const COLOR_TEXT_PRIMARY = '#a6f5df';
const COLOR_TEXT_DIM = '#5f8d7f';
const COLOR_TEXT_CONTROLS = '#ffffff';

const CURSOR_SPEED = 320;
const CLAMP_MARGIN = 16;
const HEADER_H = 46;
const FOOTER_H = 26;

export class DeepScanRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private config!: ArcadeGameDefinition;
  private bounds!: Phaser.Geom.Rectangle;

  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  private background!: Phaser.GameObjects.Rectangle;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private cursorGraphics!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private scanlines: Phaser.GameObjects.Rectangle[] = [];
  private pingMarkers: PingMarker[] = [];
  private ringEffects: Phaser.GameObjects.Graphics[] = [];
  private markGraphics: Phaser.GameObjects.Graphics | null = null;

  // Playable field (inside header/footer chrome)
  private fieldRect!: Phaser.Geom.Rectangle;
  private fieldDiag = 1;

  private sources: FieldSource[] = [];
  private deposit!: FieldSource;

  private cursorX = 0;
  private cursorY = 0;
  private pingsLeft = 0;
  private markX = 0;
  private markY = 0;
  private marked = false;
  private finished = false;
  private score = 0;

  private keys: Record<string, boolean> = {};
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private keyupHandler: ((event: KeyboardEvent) => void) | null = null;
  private spaceHandler: (() => void) | null = null;
  private enterHandler: (() => void) | null = null;
  private virtualDirDownHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualDirUpHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualSpaceHandler: (() => void) | null = null;
  private virtualEnterHandler: (() => void) | null = null;
  private finishDelayTimer: Phaser.Time.TimerEvent | null = null;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.config = config;
    this.bounds = bounds;
    this.keys = {};
    this.pingMarkers = [];
    this.ringEffects = [];
    this.scanlines = [];
    this.marked = false;
    this.finished = false;
    this.score = 0;
    this.markGraphics = null;
    this.finishDelayTimer = null;

    // Ping budget from difficulty: harder = fewer pings (battery pressure).
    this.pingsLeft = 8 + (5 - config.difficulty);

    // Playable field
    this.fieldRect = new Phaser.Geom.Rectangle(
      bounds.x + CLAMP_MARGIN,
      bounds.y + HEADER_H,
      bounds.width - CLAMP_MARGIN * 2,
      bounds.height - HEADER_H - FOOTER_H
    );
    this.fieldDiag = Math.hypot(this.fieldRect.width, this.fieldRect.height);

    this.generateField();

    this.cursorX = this.fieldRect.centerX;
    this.cursorY = this.fieldRect.centerY;

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
      .text(bounds.x + 12, bounds.y + 10, t('arcade.ds.title'), {
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

    this.hintText = scene.add
      .text(bounds.x + 12, bounds.bottom - 18, t('arcade.ds.controls'), {
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

    // Input — held movement keys (WSAD), edge-triggered SPACE/ENTER
    this.keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) this.keys[key] = true;
    };
    this.keyupHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) this.keys[key] = false;
    };
    this.spaceHandler = () => this.emitPing();
    this.enterHandler = () => this.mark();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keyup', this.keyupHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.enterHandler);

    const dirToKey: Record<string, 'w' | 'a' | 's' | 'd'> = {
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
    };
    this.virtualDirDownHandler = ({ dir }) => {
      const key = dirToKey[dir];
      if (key) this.keys[key] = true;
    };
    this.virtualDirUpHandler = ({ dir }) => {
      const key = dirToKey[dir];
      if (key) this.keys[key] = false;
    };
    this.virtualSpaceHandler = () => this.emitPing();
    this.virtualEnterHandler = () => this.mark();

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-dir-up', this.virtualDirUpHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);
  }

  update(time: number, delta: number): void {
    if (this.finished || this.marked) return;

    const dt = delta / 1000;
    if (this.keys.w) this.cursorY -= CURSOR_SPEED * dt;
    if (this.keys.s) this.cursorY += CURSOR_SPEED * dt;
    if (this.keys.a) this.cursorX -= CURSOR_SPEED * dt;
    if (this.keys.d) this.cursorX += CURSOR_SPEED * dt;

    this.cursorX = Phaser.Math.Clamp(this.cursorX, this.fieldRect.left, this.fieldRect.right);
    this.cursorY = Phaser.Math.Clamp(this.cursorY, this.fieldRect.top, this.fieldRect.bottom);

    this.drawCursor(time);
  }

  private generateField(): void {
    const diag = this.fieldDiag;
    // True deposit — keep it away from the edges so it is always reachable.
    const inset = 0.16;
    const dx = Phaser.Math.FloatBetween(this.fieldRect.left + this.fieldRect.width * inset, this.fieldRect.right - this.fieldRect.width * inset);
    const dy = Phaser.Math.FloatBetween(this.fieldRect.top + this.fieldRect.height * inset, this.fieldRect.bottom - this.fieldRect.height * inset);
    this.deposit = {
      x: dx,
      y: dy,
      amplitude: 1,
      sigma: diag * 0.19,
      real: true,
    };

    this.sources = [this.deposit];

    // False echoes — flicker/decay differently; placed at least a deposit-radius away.
    const falseCount = 2 + (this.config.difficulty >= 4 ? 1 : 0);
    let attempts = 0;
    while (this.sources.length < falseCount + 1 && attempts < 200) {
      attempts++;
      const fx = Phaser.Math.FloatBetween(this.fieldRect.left + 8, this.fieldRect.right - 8);
      const fy = Phaser.Math.FloatBetween(this.fieldRect.top + 8, this.fieldRect.bottom - 8);
      if (Math.hypot(fx - dx, fy - dy) < diag * 0.28) continue;
      this.sources.push({
        x: fx,
        y: fy,
        amplitude: Phaser.Math.FloatBetween(0.55, 0.85),
        sigma: diag * Phaser.Math.FloatBetween(0.09, 0.13),
        real: false,
      });
    }
  }

  /** Combined field reading at a point, 0..1. False echoes flicker per ping. */
  private sampleField(x: number, y: number): number {
    let value = 0;
    for (const s of this.sources) {
      const d = Math.hypot(x - s.x, y - s.y);
      const g = s.amplitude * Math.exp(-(d * d) / (2 * s.sigma * s.sigma));
      // False echoes are unreliable: a random flicker multiplier makes any single
      // reading untrustworthy, so the player must ping several spots.
      const flicker = s.real ? 1 : Phaser.Math.FloatBetween(0.35, 1.25);
      value += g * flicker;
    }
    // Background sensor noise.
    value += Phaser.Math.FloatBetween(0, 0.06);
    return Phaser.Math.Clamp(value, 0, 1);
  }

  private emitPing(): void {
    if (this.marked || this.finished) return;
    if (this.pingsLeft <= 0) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }

    this.pingsLeft--;
    audioManager.playSfx(SfxKey.SIGNAL_BEEP);

    const intensity = this.sampleField(this.cursorX, this.cursorY);
    this.spawnPingMarker(this.cursorX, this.cursorY, intensity);
    this.spawnRing(this.cursorX, this.cursorY, intensity);
    this.updateStatusText();

    // Out of pings and still not marked — auto-mark at the cursor so the round resolves.
    if (this.pingsLeft <= 0) {
      this.hintText.setText(t('arcade.ds.outOfPings'));
      this.hintText.setColor('#ffb347');
    }
  }

  private spawnPingMarker(x: number, y: number, intensity: number): void {
    const hot = intensity;
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(COLOR_PING_COLD),
      Phaser.Display.Color.ValueToColor(COLOR_PING_HOT),
      100,
      Math.round(hot * 100)
    );
    const tint = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    const radius = 4 + hot * 12;

    const container = this.scene.add.container(x, y)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 6)
      .setMask(this.geometryMask);

    const g = this.scene.add.graphics();
    g.fillStyle(tint, 0.18);
    g.fillCircle(0, 0, radius);
    g.lineStyle(1, tint, 0.9);
    g.strokeCircle(0, 0, radius);
    g.fillStyle(tint, 1);
    g.fillCircle(0, 0, 1.5);
    container.add(g);

    const label = this.scene.add
      .text(0, radius + 2, `${Math.round(hot * 100)}`, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: hot >= 0.6 ? '#7cff7c' : COLOR_TEXT_DIM,
      })
      .setOrigin(0.5, 0);
    container.add(label);

    this.pingMarkers.push({ container, x, y });
  }

  private spawnRing(x: number, y: number, intensity: number): void {
    const ring = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);
    ring.lineStyle(2, intensity >= 0.6 ? COLOR_PING_HOT : COLOR_CURSOR, 0.7);
    ring.strokeCircle(0, 0, 6);
    ring.setPosition(x, y);
    this.ringEffects.push(ring);

    this.scene.tweens.add({
      targets: ring,
      scaleX: 6,
      scaleY: 6,
      alpha: 0,
      duration: 520,
      onComplete: () => {
        ring.destroy();
        const idx = this.ringEffects.indexOf(ring);
        if (idx >= 0) this.ringEffects.splice(idx, 1);
      },
    });
  }

  private mark(): void {
    if (this.marked || this.finished) return;
    this.marked = true;
    this.markX = this.cursorX;
    this.markY = this.cursorY;

    // Score from distance between the mark and the true deposit.
    const dist = Math.hypot(this.markX - this.deposit.x, this.markY - this.deposit.y);
    const maxUseful = this.fieldDiag * 0.5;
    this.score = Phaser.Math.Clamp(Math.round(100 * (1 - dist / maxUseful)), 0, 100);

    audioManager.playSfx(this.score >= 70 ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);
    this.revealResult();

    this.finishDelayTimer = this.scene.time.delayedCall(2000, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  private revealResult(): void {
    // Draw the mark and the revealed deposit so the player sees how close they were.
    this.markGraphics = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    const g = this.markGraphics;

    // Mark (X)
    g.lineStyle(2, COLOR_MARK, 1);
    g.lineBetween(this.markX - 8, this.markY - 8, this.markX + 8, this.markY + 8);
    g.lineBetween(this.markX - 8, this.markY + 8, this.markX + 8, this.markY - 8);

    // Revealed true deposit
    g.lineStyle(2, COLOR_PING_HOT, 0.9);
    g.strokeCircle(this.deposit.x, this.deposit.y, 10);
    g.fillStyle(COLOR_PING_HOT, 0.25);
    g.fillCircle(this.deposit.x, this.deposit.y, 10);
    g.lineStyle(1, COLOR_PING_HOT, 0.5);
    g.lineBetween(this.markX, this.markY, this.deposit.x, this.deposit.y);

    this.statusText.setText(t('arcade.ds.result', { score: this.score }));
    this.statusText.setColor(this.score >= 70 ? COLOR_TEXT_PRIMARY : '#e74c3c');
    this.hintText.setText(t('arcade.ds.finishHint'));
    this.hintText.setColor('#00d4aa');
  }

  private drawGrid(): void {
    const g = this.gridGraphics;
    g.clear();

    // Outer frame
    g.lineStyle(1, COLOR_GRID, 0.5);
    g.strokeRect(this.fieldRect.left, this.fieldRect.top, this.fieldRect.width, this.fieldRect.height);

    // Faint grid
    g.lineStyle(1, COLOR_GRID_FAINT, 0.8);
    for (let x = this.fieldRect.left + 24; x < this.fieldRect.right; x += 24) {
      g.lineBetween(x, this.fieldRect.top, x, this.fieldRect.bottom);
    }
    for (let y = this.fieldRect.top + 24; y < this.fieldRect.bottom; y += 24) {
      g.lineBetween(this.fieldRect.left, y, this.fieldRect.right, y);
    }
  }

  private drawCursor(time: number): void {
    const g = this.cursorGraphics;
    g.clear();
    if (this.marked) return;

    const pulse = 0.7 + 0.3 * Math.sin(time / 180);
    const r = 10 + 1.5 * Math.sin(time / 150);

    g.lineStyle(1, COLOR_CURSOR, 0.9 * pulse);
    g.strokeCircle(this.cursorX, this.cursorY, r);
    g.lineBetween(this.cursorX - 14, this.cursorY, this.cursorX - 5, this.cursorY);
    g.lineBetween(this.cursorX + 5, this.cursorY, this.cursorX + 14, this.cursorY);
    g.lineBetween(this.cursorX, this.cursorY - 14, this.cursorX, this.cursorY - 5);
    g.lineBetween(this.cursorX, this.cursorY + 5, this.cursorX, this.cursorY + 14);
    g.fillStyle(COLOR_CURSOR, 1);
    g.fillCircle(this.cursorX, this.cursorY, 1.5);
  }

  private updateStatusText(): void {
    if (this.marked) return;
    this.statusText.setText(t('arcade.ds.status', { pings: this.pingsLeft.toString().padStart(2, '0') }));
    this.statusText.setColor(this.pingsLeft > 0 ? COLOR_TEXT_PRIMARY : COLOR_TEXT_DIM);
  }

  destroy(): void {
    if (this.keydownHandler) {
      this.scene.input.keyboard?.off('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.keyupHandler) {
      this.scene.input.keyboard?.off('keyup', this.keyupHandler);
      this.keyupHandler = null;
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
    if (this.virtualDirUpHandler) {
      this.scene.game.events.off('virtual-dir-up', this.virtualDirUpHandler);
      this.virtualDirUpHandler = null;
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

    for (const marker of this.pingMarkers) marker.container.destroy();
    this.pingMarkers = [];
    for (const ring of this.ringEffects) ring.destroy();
    this.ringEffects = [];
    for (const line of this.scanlines) line.destroy();
    this.scanlines = [];

    this.markGraphics?.destroy();
    this.markGraphics = null;
    this.cursorGraphics?.destroy();
    this.gridGraphics?.destroy();
    this.background?.destroy();
    this.titleText?.destroy();
    this.statusText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();

    this.keys = {};
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.ds.title'));
    if (this.marked) {
      this.statusText.setText(t('arcade.ds.result', { score: this.score }));
      this.hintText.setText(t('arcade.ds.finishHint'));
    } else {
      this.updateStatusText();
      this.hintText.setText(
        this.pingsLeft > 0 ? t('arcade.ds.controls') : t('arcade.ds.outOfPings')
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
      completed: this.marked && this.score >= 70,
    };
  }
}
