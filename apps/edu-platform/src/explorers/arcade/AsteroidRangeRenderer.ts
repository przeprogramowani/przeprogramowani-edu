import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

interface Asteroid {
  graphics: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  radius: number;
  speed: number;
  points: number;
  rotation: number;
  spin: number;
  pulseOffset: number;
  vertices: Phaser.Math.Vector2[];
  craters: Array<{ x: number; y: number; radius: number }>;
  active: boolean;
  recycling: boolean;
}

const DIFFICULTY_CONFIG: Record<number, { speedMul: number; spawnInterval: number; waveMin: number; waveMax: number }> = {
  1: { speedMul: 0.7, spawnInterval: 1200, waveMin: 2, waveMax: 4 },
  2: { speedMul: 0.85, spawnInterval: 1000, waveMin: 2, waveMax: 5 },
  3: { speedMul: 1.0, spawnInterval: 800, waveMin: 3, waveMax: 6 },
  4: { speedMul: 1.25, spawnInterval: 600, waveMin: 4, waveMax: 7 },
  5: { speedMul: 1.5, spawnInterval: 400, waveMin: 5, waveMax: 8 },
};

const POOL_SIZE = 30;
const SHOT_COOLDOWN_MS = 200;
const CROSSHAIR_SPEED = 400;
const CLAMP_MARGIN = 12;

const ASTEROID_SIZES = [
  { radius: 24, speedMin: 80, speedMax: 120, points: 10 },
  { radius: 16, speedMin: 140, speedMax: 200, points: 25 },
  { radius: 10, speedMin: 220, speedMax: 300, points: 50 },
];

const COLOR_BG = 0x05070a;
const COLOR_GRID = 0x153326;
const COLOR_GRID_FAINT = 0x0d1d17;
const COLOR_SCOPE = 0x00d4aa;
const COLOR_TARGET = 0x7cff7c;
const COLOR_WARNING = 0xffb347;
const COLOR_TEXT_PRIMARY = '#a6f5df';
const COLOR_TEXT_DIM = '#5f8d7f';
const COLOR_TEXT_CONTROLS = '#ffffff';
const COLOR_SHOT = 0xd9fff4;

export class AsteroidRangeRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private config!: ArcadeGameDefinition;
  private bounds!: Phaser.Geom.Rectangle;
  private pool: Asteroid[] = [];
  private background!: Phaser.GameObjects.Rectangle;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private sweepGraphics!: Phaser.GameObjects.Graphics;
  private crosshairGraphics!: Phaser.GameObjects.Graphics;
  private statusText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private scanlines: Phaser.GameObjects.Rectangle[] = [];

  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  private crosshairX = 0;
  private crosshairY = 0;
  private score = 0;
  private finished = false;
  private lastShotTime = -SHOT_COOLDOWN_MS;
  private spawnAccumulator = 0;
  private hitEffects: Phaser.GameObjects.Graphics[] = [];
  private shotEffects: Phaser.GameObjects.Graphics[] = [];

  private keys: Record<string, boolean> = {};
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private keyupHandler: ((event: KeyboardEvent) => void) | null = null;
  private spaceHandler: (() => void) | null = null;
  private virtualDirDownHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualDirUpHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualSpaceHandler: (() => void) | null = null;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.config = config;
    this.bounds = bounds;
    this.score = 0;
    this.finished = false;
    this.lastShotTime = -SHOT_COOLDOWN_MS;
    this.spawnAccumulator = 0;
    this.keys = {};
    this.pool = [];
    this.hitEffects = [];
    this.shotEffects = [];
    this.scanlines = [];

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

    this.sweepGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4.5)
      .setMask(this.geometryMask);

    this.crosshairGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.titleText = scene.add
      .text(bounds.x + 12, bounds.y + 10, t('arcade.ast.title'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ffb347',
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
      .text(bounds.x + 12, bounds.bottom - 20, t('arcade.ast.controls'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: COLOR_TEXT_CONTROLS,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.crosshairX = bounds.centerX;
    this.crosshairY = bounds.centerY;

    for (let y = bounds.y; y < bounds.bottom; y += 3) {
      const line = scene.add
        .rectangle(bounds.centerX, y, bounds.width, 1, 0x000000, 0.14)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 9)
        .setMask(this.geometryMask);
      this.scanlines.push(line);
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      const graphics = scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 6)
        .setVisible(false)
        .setMask(this.geometryMask);
      this.pool.push({
        graphics,
        x: 0,
        y: 0,
        radius: 16,
        speed: 100,
        points: 25,
        rotation: 0,
        spin: 0,
        pulseOffset: 0,
        vertices: [],
        craters: [],
        active: false,
        recycling: false,
      });
    }

    this.drawScopeFrame();
    this.drawSweep(scene.time.now);
    this.drawCrosshair(scene.time.now);
    this.updateStatusText();

    this.keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        this.keys[key] = true;
      }
    };
    this.keyupHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        this.keys[key] = false;
      }
    };
    this.spaceHandler = () => this.shoot();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keyup', this.keyupHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);

    // Virtual D-pad → WASD map (mirrors keydown/keyup behavior)
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
    this.virtualSpaceHandler = () => this.shoot();

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-dir-up', this.virtualDirUpHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
  }

  update(time: number, delta: number): void {
    if (this.finished) return;

    const dt = delta / 1000;
    this.updateCrosshair(dt);
    this.drawCrosshair(time);
    this.drawSweep(time);

    const diff = DIFFICULTY_CONFIG[this.config.difficulty] ?? DIFFICULTY_CONFIG[3];
    this.spawnAccumulator += delta;
    if (this.spawnAccumulator >= diff.spawnInterval) {
      this.spawnAccumulator -= diff.spawnInterval;
      const waveSize = Phaser.Math.Between(diff.waveMin, diff.waveMax);
      this.spawnWave(waveSize, diff.speedMul);
    }

    let activeTargets = 0;
    for (const asteroid of this.pool) {
      if (!asteroid.active) continue;

      activeTargets++;
      asteroid.x -= asteroid.speed * dt;
      asteroid.rotation += asteroid.spin * dt;
      asteroid.graphics.setPosition(asteroid.x, asteroid.y);
      asteroid.graphics.setRotation(asteroid.rotation);
      asteroid.graphics.setAlpha(0.78 + 0.18 * Math.sin(time / 180 + asteroid.pulseOffset));

      if (asteroid.x + asteroid.radius < this.bounds.x - 8) {
        this.recycleAsteroid(asteroid);
      }
    }

    this.updateStatusText(activeTargets);
  }

  private updateCrosshair(dt: number): void {
    if (this.keys.w) this.crosshairY -= CROSSHAIR_SPEED * dt;
    if (this.keys.s) this.crosshairY += CROSSHAIR_SPEED * dt;
    if (this.keys.a) this.crosshairX -= CROSSHAIR_SPEED * dt;
    if (this.keys.d) this.crosshairX += CROSSHAIR_SPEED * dt;

    this.crosshairX = Phaser.Math.Clamp(
      this.crosshairX,
      this.bounds.x + CLAMP_MARGIN,
      this.bounds.right - CLAMP_MARGIN
    );
    this.crosshairY = Phaser.Math.Clamp(
      this.crosshairY,
      this.bounds.y + 48,
      this.bounds.bottom - 36
    );
  }

  private drawScopeFrame(): void {
    const g = this.gridGraphics;
    g.clear();

    g.lineStyle(1, COLOR_SCOPE, 0.25);
    g.strokeRect(this.bounds.x + 1, this.bounds.y + 1, this.bounds.width - 2, this.bounds.height - 2);

    const usableTop = this.bounds.y + 44;
    const usableBottom = this.bounds.bottom - 30;
    const usableHeight = usableBottom - usableTop;
    const centerX = this.bounds.centerX;
    const centerY = usableTop + usableHeight / 2;

    g.lineStyle(1, COLOR_GRID_FAINT, 0.8);
    for (let x = this.bounds.x + 24; x < this.bounds.right; x += 24) {
      g.lineBetween(x, usableTop, x, usableBottom);
    }
    for (let y = usableTop; y <= usableBottom; y += 24) {
      g.lineBetween(this.bounds.x + 6, y, this.bounds.right - 6, y);
    }

    g.lineStyle(1, COLOR_GRID, 0.95);
    g.lineBetween(this.bounds.x + 6, centerY, this.bounds.right - 6, centerY);
    g.lineBetween(centerX, usableTop, centerX, usableBottom);

    for (let i = 1; i <= 3; i++) {
      g.strokeCircle(centerX, centerY, i * 56);
    }

    for (let i = 0; i < 36; i++) {
      const starX = Phaser.Math.Between(this.bounds.x + 8, this.bounds.right - 8);
      const starY = Phaser.Math.Between(usableTop + 4, usableBottom - 4);
      const alpha = Phaser.Math.FloatBetween(0.12, 0.4);
      g.fillStyle(COLOR_TEXT_PRIMARY.startsWith('#') ? 0xa6f5df : COLOR_SCOPE, alpha);
      g.fillRect(starX, starY, 1, 1);
    }

    g.lineStyle(1, COLOR_WARNING, 0.35);
    for (let i = 0; i < 5; i++) {
      const y = usableTop + i * ((usableBottom - usableTop) / 4);
      g.lineBetween(this.bounds.right - 12, y, this.bounds.right - 6, y);
    }
  }

  private drawSweep(time: number): void {
    const g = this.sweepGraphics;
    g.clear();

    const usableTop = this.bounds.y + 44;
    const usableBottom = this.bounds.bottom - 30;
    const span = this.bounds.width - 24;
    const normalized = ((time * 0.00018) % 1 + 1) % 1;
    const sweepX = this.bounds.x + 12 + span * normalized;

    g.fillStyle(COLOR_SCOPE, 0.04);
    g.fillRect(sweepX - 22, usableTop, 22, usableBottom - usableTop);
    g.fillStyle(COLOR_SCOPE, 0.08);
    g.fillRect(sweepX - 8, usableTop, 8, usableBottom - usableTop);
    g.lineStyle(1, COLOR_SCOPE, 0.3);
    g.lineBetween(sweepX, usableTop, sweepX, usableBottom);
  }

  private drawCrosshair(time: number): void {
    const g = this.crosshairGraphics;
    g.clear();

    const pulse = 0.8 + 0.2 * Math.sin(time / 170);
    const ringRadius = 14 + 1.5 * Math.sin(time / 150);

    g.lineStyle(4, COLOR_SCOPE, 0.12 * pulse);
    g.lineBetween(this.crosshairX - 24, this.crosshairY, this.crosshairX - 7, this.crosshairY);
    g.lineBetween(this.crosshairX + 7, this.crosshairY, this.crosshairX + 24, this.crosshairY);
    g.lineBetween(this.crosshairX, this.crosshairY - 24, this.crosshairX, this.crosshairY - 7);
    g.lineBetween(this.crosshairX, this.crosshairY + 7, this.crosshairX, this.crosshairY + 24);
    g.strokeCircle(this.crosshairX, this.crosshairY, ringRadius + 2);

    g.lineStyle(1, COLOR_SHOT, 0.95);
    g.lineBetween(this.crosshairX - 20, this.crosshairY, this.crosshairX - 6, this.crosshairY);
    g.lineBetween(this.crosshairX + 6, this.crosshairY, this.crosshairX + 20, this.crosshairY);
    g.lineBetween(this.crosshairX, this.crosshairY - 20, this.crosshairX, this.crosshairY - 6);
    g.lineBetween(this.crosshairX, this.crosshairY + 6, this.crosshairX, this.crosshairY + 20);
    g.strokeCircle(this.crosshairX, this.crosshairY, ringRadius);
    g.fillStyle(COLOR_SHOT, 1);
    g.fillCircle(this.crosshairX, this.crosshairY, 1.5);
  }

  private updateStatusText(activeTargets = this.pool.filter((asteroid) => asteroid.active).length): void {
    const cooldownLeft = Math.max(0, SHOT_COOLDOWN_MS - (this.scene.time.now - this.lastShotTime));
    const laserState =
      cooldownLeft > 0
        ? t('arcade.ast.statusCooldown', { ms: cooldownLeft })
        : t('arcade.ast.statusReady');
    this.statusText.setText(
      t('arcade.ast.statusLine', {
        targets: activeTargets.toString().padStart(2, '0'),
        score: this.score.toString().padStart(4, '0'),
        laser: laserState,
      })
    );
    this.statusText.setColor(cooldownLeft > 0 ? COLOR_TEXT_DIM : COLOR_TEXT_PRIMARY);
  }

  private spawnWave(count: number, speedMul: number): void {
    for (let i = 0; i < count; i++) {
      const asteroid = this.pool.find((candidate) => !candidate.active && !candidate.recycling);
      if (!asteroid) break;

      const sizeDef = ASTEROID_SIZES[Phaser.Math.Between(0, ASTEROID_SIZES.length - 1)];

      asteroid.radius = sizeDef.radius;
      asteroid.speed = Phaser.Math.Between(sizeDef.speedMin, sizeDef.speedMax) * speedMul;
      asteroid.points = sizeDef.points;
      asteroid.x = this.bounds.right + asteroid.radius + i * Phaser.Math.Between(24, 54);
      asteroid.y = Phaser.Math.Between(this.bounds.y + 58, this.bounds.bottom - 42);
      asteroid.rotation = Phaser.Math.FloatBetween(0, Math.PI * 2);
      asteroid.spin = Phaser.Math.FloatBetween(-0.9, 0.9);
      asteroid.pulseOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);
      asteroid.vertices = this.createAsteroidVertices(asteroid.radius);
      asteroid.craters = this.createAsteroidCraters(asteroid.radius);
      asteroid.active = true;
      asteroid.recycling = false;

      this.drawAsteroid(asteroid);
      asteroid.graphics
        .setPosition(asteroid.x, asteroid.y)
        .setRotation(asteroid.rotation)
        .setScale(1)
        .setAlpha(1)
        .setVisible(true);
    }
  }

  private createAsteroidVertices(radius: number): Phaser.Math.Vector2[] {
    const points = Phaser.Math.Between(7, 10);
    const vertices: Phaser.Math.Vector2[] = [];
    for (let i = 0; i < points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const variance = Phaser.Math.FloatBetween(0.72, 1.14);
      vertices.push(new Phaser.Math.Vector2(
        Math.cos(angle) * radius * variance,
        Math.sin(angle) * radius * variance
      ));
    }
    return vertices;
  }

  private createAsteroidCraters(radius: number): Array<{ x: number; y: number; radius: number }> {
    const craterCount = radius >= 20 ? 3 : radius >= 14 ? 2 : 1;
    const craters: Array<{ x: number; y: number; radius: number }> = [];
    for (let i = 0; i < craterCount; i++) {
      craters.push({
        x: Phaser.Math.FloatBetween(-radius * 0.35, radius * 0.35),
        y: Phaser.Math.FloatBetween(-radius * 0.35, radius * 0.35),
        radius: Phaser.Math.FloatBetween(radius * 0.12, radius * 0.24),
      });
    }
    return craters;
  }

  private drawAsteroid(asteroid: Asteroid): void {
    const g = asteroid.graphics;
    g.clear();

    g.fillStyle(0x0d261b, 0.45);
    this.tracePolygon(g, asteroid.vertices, true);

    g.lineStyle(6, COLOR_TARGET, 0.06);
    this.tracePolygon(g, asteroid.vertices, false);

    g.lineStyle(2, COLOR_TARGET, 0.22);
    this.tracePolygon(g, asteroid.vertices, false);

    g.lineStyle(1, COLOR_SHOT, 0.9);
    this.tracePolygon(g, asteroid.vertices, false);

    g.lineStyle(1, COLOR_SCOPE, 0.25);
    for (const crater of asteroid.craters) {
      g.strokeCircle(crater.x, crater.y, crater.radius);
    }
  }

  private tracePolygon(
    graphics: Phaser.GameObjects.Graphics,
    vertices: Phaser.Math.Vector2[],
    fill: boolean
  ): void {
    if (vertices.length === 0) return;

    graphics.beginPath();
    graphics.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
      graphics.lineTo(vertices[i].x, vertices[i].y);
    }
    graphics.closePath();

    if (fill) {
      graphics.fillPath();
    } else {
      graphics.strokePath();
    }
  }

  private shoot(): void {
    const now = this.scene.time.now;
    if (now - this.lastShotTime < SHOT_COOLDOWN_MS) return;
    this.lastShotTime = now;

    audioManager.playSfx(SfxKey.LASER_SHOT);

    let hitAsteroid: Asteroid | null = null;
    for (const asteroid of this.pool) {
      if (!asteroid.active) continue;

      const dx = this.crosshairX - asteroid.x;
      const dy = this.crosshairY - asteroid.y;
      if (dx * dx + dy * dy <= asteroid.radius * asteroid.radius) {
        hitAsteroid = asteroid;
        break;
      }
    }

    if (hitAsteroid) {
      this.score += hitAsteroid.points;
      hitAsteroid.active = false;
      hitAsteroid.recycling = true;
      audioManager.playSfx(SfxKey.ASTEROID_HIT);
      this.showShotPulse(this.crosshairX, this.crosshairY, true);
      this.showHitEffect(hitAsteroid.x, hitAsteroid.y);

      this.scene.tweens.add({
        targets: hitAsteroid.graphics,
        scaleX: 0.15,
        scaleY: 0.15,
        alpha: 0,
        duration: 140,
        onComplete: () => {
          hitAsteroid.graphics.setVisible(false);
          hitAsteroid.graphics.setScale(1);
          hitAsteroid.graphics.setAlpha(1);
          hitAsteroid.recycling = false;
        },
      });
    } else {
      audioManager.playSfx(SfxKey.MISS_WHIFF);
      this.showShotPulse(this.crosshairX, this.crosshairY, false);
    }

    this.updateStatusText();
  }

  private showShotPulse(x: number, y: number, successful: boolean): void {
    const pulse = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);

    pulse.lineStyle(1, successful ? COLOR_TARGET : COLOR_SHOT, successful ? 0.9 : 0.7);
    pulse.strokeCircle(0, 0, successful ? 10 : 8);
    pulse.lineBetween(-14, 0, -5, 0);
    pulse.lineBetween(14, 0, 5, 0);
    pulse.lineBetween(0, -14, 0, -5);
    pulse.lineBetween(0, 14, 0, 5);
    pulse.setPosition(x, y);
    this.shotEffects.push(pulse);

    this.scene.tweens.add({
      targets: pulse,
      scaleX: successful ? 2.2 : 1.5,
      scaleY: successful ? 2.2 : 1.5,
      alpha: 0,
      duration: successful ? 180 : 120,
      onComplete: () => {
        pulse.destroy();
        const index = this.shotEffects.indexOf(pulse);
        if (index >= 0) this.shotEffects.splice(index, 1);
      },
    });
  }

  private showHitEffect(x: number, y: number): void {
    const burst = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);

    burst.lineStyle(1, COLOR_TARGET, 0.95);
    burst.strokeCircle(0, 0, 10);
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      burst.lineBetween(
        Math.cos(angle) * 6,
        Math.sin(angle) * 6,
        Math.cos(angle) * 15,
        Math.sin(angle) * 15
      );
    }
    burst.setPosition(x, y);
    this.hitEffects.push(burst);

    this.scene.tweens.add({
      targets: burst,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      duration: 220,
      onComplete: () => {
        burst.destroy();
        const index = this.hitEffects.indexOf(burst);
        if (index >= 0) this.hitEffects.splice(index, 1);
      },
    });
  }

  private recycleAsteroid(asteroid: Asteroid): void {
    asteroid.active = false;
    asteroid.recycling = false;
    asteroid.graphics
      .setVisible(false)
      .setScale(1)
      .setAlpha(1)
      .setRotation(0);
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

    for (const asteroid of this.pool) {
      asteroid.graphics.destroy();
    }
    this.pool = [];

    for (const effect of this.hitEffects) {
      effect.destroy();
    }
    this.hitEffects = [];

    for (const effect of this.shotEffects) {
      effect.destroy();
    }
    this.shotEffects = [];

    for (const line of this.scanlines) {
      line.destroy();
    }
    this.scanlines = [];

    this.crosshairGraphics?.destroy();
    this.sweepGraphics?.destroy();
    this.gridGraphics?.destroy();
    this.background?.destroy();
    this.statusText?.destroy();
    this.titleText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();

    this.keys = {};
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.ast.title'));
    this.hintText.setText(t('arcade.ast.controls'));
    this.updateStatusText();
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
      completed: true,
    };
  }
}
