import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  dcOffset?: number;
}

type ParamLabelKey =
  | 'arcade.osc.paramAmplitude'
  | 'arcade.osc.paramFrequency'
  | 'arcade.osc.paramPhase'
  | 'arcade.osc.paramOffset';

interface ParamDef {
  key: keyof WaveParams;
  labelKey: ParamLabelKey;
  min: number;
  max: number;
  step: number;
}

// Difficulty scaling
const DIFFICULTY_CONFIG: Record<number, {
  params: ParamDef[];
  targetComplexity: 'simple' | 'harmonic' | 'composite';
  passThreshold: number;
}> = {
  1: {
    params: [
      { key: 'amplitude', labelKey: 'arcade.osc.paramAmplitude', min: 0.1, max: 2.0, step: 0.1 },
      { key: 'frequency', labelKey: 'arcade.osc.paramFrequency', min: 0.5, max: 4.0, step: 0.1 },
    ],
    targetComplexity: 'simple',
    passThreshold: 70,
  },
  2: {
    params: [
      { key: 'amplitude', labelKey: 'arcade.osc.paramAmplitude', min: 0.1, max: 2.0, step: 0.1 },
      { key: 'frequency', labelKey: 'arcade.osc.paramFrequency', min: 0.5, max: 4.0, step: 0.1 },
      { key: 'phase', labelKey: 'arcade.osc.paramPhase', min: 0, max: 6.2, step: 0.05 },
    ],
    targetComplexity: 'simple',
    passThreshold: 75,
  },
  3: {
    params: [
      { key: 'amplitude', labelKey: 'arcade.osc.paramAmplitude', min: 0.1, max: 2.0, step: 0.05 },
      { key: 'frequency', labelKey: 'arcade.osc.paramFrequency', min: 0.5, max: 4.0, step: 0.05 },
      { key: 'phase', labelKey: 'arcade.osc.paramPhase', min: 0, max: 6.2, step: 0.05 },
    ],
    targetComplexity: 'harmonic',
    passThreshold: 80,
  },
  4: {
    params: [
      { key: 'amplitude', labelKey: 'arcade.osc.paramAmplitude', min: 0.1, max: 2.0, step: 0.05 },
      { key: 'frequency', labelKey: 'arcade.osc.paramFrequency', min: 0.5, max: 4.0, step: 0.05 },
      { key: 'phase', labelKey: 'arcade.osc.paramPhase', min: 0, max: 6.2, step: 0.02 },
      { key: 'dcOffset', labelKey: 'arcade.osc.paramOffset', min: -1.0, max: 1.0, step: 0.05 },
    ],
    targetComplexity: 'harmonic',
    passThreshold: 85,
  },
  5: {
    params: [
      { key: 'amplitude', labelKey: 'arcade.osc.paramAmplitude', min: 0.1, max: 2.0, step: 0.02 },
      { key: 'frequency', labelKey: 'arcade.osc.paramFrequency', min: 0.5, max: 4.0, step: 0.02 },
      { key: 'phase', labelKey: 'arcade.osc.paramPhase', min: 0, max: 6.2, step: 0.02 },
      { key: 'dcOffset', labelKey: 'arcade.osc.paramOffset', min: -1.0, max: 1.0, step: 0.02 },
    ],
    targetComplexity: 'composite',
    passThreshold: 90,
  },
};

const SAMPLE_COUNT = 200;
const COLOR_BG = 0x0a0a0a;
const COLOR_GRID = 0x1a3a1a;
const COLOR_TARGET = 0x00ff66;
const COLOR_PLAYER = 0x00d4aa;

export class OscilloscopeRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;
  private config!: ArcadeGameDefinition;
  private bounds!: Phaser.Geom.Rectangle;
  private diffConfig!: typeof DIFFICULTY_CONFIG[1];

  private targetParams!: WaveParams;
  private playerParams!: WaveParams;
  private activeParamIndex = 0;
  private dirty = true;
  private submitted = false;
  private finished = false;
  private matchPercent = 0;

  // Graphics
  private background!: Phaser.GameObjects.Rectangle;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private targetGlow!: Phaser.GameObjects.Graphics;
  private targetLine!: Phaser.GameObjects.Graphics;
  private playerLine!: Phaser.GameObjects.Graphics;
  private paramTexts: Phaser.GameObjects.Text[] = [];
  private paramBars: Phaser.GameObjects.Rectangle[] = [];
  private paramBarFills: Phaser.GameObjects.Rectangle[] = [];
  private matchText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private gameObjects: Phaser.GameObjects.GameObject[] = [];

  // Scope area
  private scopeX = 0;
  private scopeY = 0;
  private scopeW = 0;
  private scopeH = 0;

  // Input
  private keyHandler: ((event: KeyboardEvent) => void) | null = null;
  private virtualDirDownHandler:
    | ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void)
    | null = null;
  private virtualEnterHandler: (() => void) | null = null;
  private finishDelayTimer: Phaser.Time.TimerEvent | null = null;

  // Mask
  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.config = config;
    this.bounds = bounds;
    this.diffConfig = DIFFICULTY_CONFIG[config.difficulty] ?? DIFFICULTY_CONFIG[3];
    this.submitted = false;
    this.finished = false;
    this.activeParamIndex = 0;
    this.dirty = true;
    this.gameObjects = [];
    this.paramTexts = [];
    this.paramBars = [];
    this.paramBarFills = [];
    this.finishDelayTimer = null;

    // Mask
    this.maskGraphics = scene.make.graphics({ x: 0, y: 0 }, false);
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.geometryMask = this.maskGraphics.createGeometryMask();

    // Generate target wave parameters
    this.targetParams = this.generateTarget();
    // Start player at neutral values
    this.playerParams = { amplitude: 1.0, frequency: 1.0, phase: 0, dcOffset: 0 };

    // Layout: scope on left (60%), params on right (40%)
    const panelSplit = 0.6;
    this.scopeX = bounds.x + 4;
    this.scopeY = bounds.y + 4;
    this.scopeW = Math.floor(bounds.width * panelSplit) - 8;
    this.scopeH = bounds.height - 8;

    const paramX = bounds.x + Math.floor(bounds.width * panelSplit);
    const paramW = bounds.width - Math.floor(bounds.width * panelSplit) - 4;

    // Background
    this.background = scene.add
      .rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height, COLOR_BG)
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 3)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.background);

    // Grid
    this.gridGraphics = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.gridGraphics);
    this.drawGrid();

    // Waveform graphics (glow first, then sharp lines on top)
    this.targetGlow = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 5)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.targetGlow);

    this.targetLine = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 6)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.targetLine);

    this.playerLine = scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 6)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.playerLine);

    // Parameter controls on the right side
    const params = this.diffConfig.params;
    const paramStartY = bounds.y + 20;
    const paramLineH = 40;
    const barW = paramW - 20;
    const barH = 8;

    for (let i = 0; i < params.length; i++) {
      const py = paramStartY + i * paramLineH;
      const isActive = i === this.activeParamIndex;

      // Label + value
      const label = scene.add
        .text(paramX + 10, py, '', {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: isActive ? '#00d4aa' : '#888888',
        })
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 8)
        .setMask(this.geometryMask);
      this.paramTexts.push(label);
      this.gameObjects.push(label);

      // Bar background
      const barBg = scene.add
        .rectangle(paramX + 10 + barW / 2, py + 18, barW, barH, 0x222222)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 7)
        .setStrokeStyle(1, isActive ? 0x00d4aa : 0x444444)
        .setMask(this.geometryMask);
      this.paramBars.push(barBg);
      this.gameObjects.push(barBg);

      // Bar fill
      const barFill = scene.add
        .rectangle(paramX + 10, py + 18, 0, barH - 2, isActive ? 0x00d4aa : 0x666666)
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 7.5)
        .setMask(this.geometryMask);
      this.paramBarFills.push(barFill);
      this.gameObjects.push(barFill);
    }

    // Match percentage text
    const matchY = paramStartY + params.length * paramLineH + 20;
    this.matchText = scene.add
      .text(paramX + 10, matchY, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#e74c3c',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.matchText);

    // Hint text
    this.hintText = scene.add
      .text(paramX + 10, bounds.bottom - 40, t('arcade.osc.controls'), {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#555555',
        lineSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);
    this.gameObjects.push(this.hintText);

    // Input
    this.keyHandler = (event: KeyboardEvent) => this.handleKey(event);
    scene.input.keyboard?.on('keydown', this.keyHandler);

    // Virtual D-pad → param scroll/adjust (mirrors handleKey() WSAD branches)
    this.virtualDirDownHandler = ({ dir }) => {
      if (this.submitted) return;
      const params = this.diffConfig.params;
      switch (dir) {
        case 'up':
          this.activeParamIndex =
            (this.activeParamIndex - 1 + params.length) % params.length;
          this.dirty = true;
          break;
        case 'down':
          this.activeParamIndex = (this.activeParamIndex + 1) % params.length;
          this.dirty = true;
          break;
        case 'right': {
          const param = params[this.activeParamIndex];
          const current = this.playerParams[param.key] ?? 0;
          this.playerParams[param.key] = Math.min(
            param.max,
            round(current + param.step, 3)
          );
          this.dirty = true;
          audioManager.playSfx(SfxKey.PARAM_BEEP);
          break;
        }
        case 'left': {
          const param = params[this.activeParamIndex];
          const current = this.playerParams[param.key] ?? 0;
          this.playerParams[param.key] = Math.max(
            param.min,
            round(current - param.step, 3)
          );
          this.dirty = true;
          audioManager.playSfx(SfxKey.PARAM_BEEP);
          break;
        }
      }
    };

    this.virtualEnterHandler = () => {
      if (this.submitted) {
        this.finishDelayTimer?.destroy();
        this.finishDelayTimer = null;
        this.finished = true;
      } else {
        this.submit();
      }
    };

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);

    // Initial draw
    this.updateParamDisplay();
    this.drawWaveforms();
  }

  update(_time: number, _delta: number): void {
    if (this.dirty && !this.submitted) {
      this.drawWaveforms();
      this.updateParamDisplay();
      this.dirty = false;
    }
  }

  private handleKey(event: KeyboardEvent): void {
    if (this.submitted) {
      if (event.key === 'Enter') {
        this.finishDelayTimer?.destroy();
        this.finishDelayTimer = null;
        this.finished = true;
      }
      return;
    }

    const params = this.diffConfig.params;

    switch (event.key) {
      case 'w':
      case 'W':
        this.activeParamIndex = (this.activeParamIndex - 1 + params.length) % params.length;
        this.dirty = true;
        break;
      case 's':
      case 'S':
        this.activeParamIndex = (this.activeParamIndex + 1) % params.length;
        this.dirty = true;
        break;
      case 'd':
      case 'D': {
        const param = params[this.activeParamIndex];
        const step = event.shiftKey ? param.step / 5 : param.step;
        const current = this.playerParams[param.key] ?? 0;
        this.playerParams[param.key] = Math.min(param.max, round(current + step, 3));
        this.dirty = true;
        audioManager.playSfx(SfxKey.PARAM_BEEP);
        break;
      }
      case 'a':
      case 'A': {
        const param = params[this.activeParamIndex];
        const step = event.shiftKey ? param.step / 5 : param.step;
        const current = this.playerParams[param.key] ?? 0;
        this.playerParams[param.key] = Math.max(param.min, round(current - step, 3));
        this.dirty = true;
        audioManager.playSfx(SfxKey.PARAM_BEEP);
        break;
      }
      case 'Enter':
        this.submit();
        break;
    }
  }

  private submit(): void {
    audioManager.playSfx(SfxKey.SUBMIT_CONFIRM);
    this.drawWaveforms();
    this.submitted = true;
    this.updateParamDisplay();
    this.hintText.setText(t('arcade.osc.submittedHint'));
    this.hintText.setColor('#00d4aa');
    this.finishDelayTimer = this.scene.time.delayedCall(1800, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  private generateTarget(): WaveParams {
    const params = this.diffConfig.params;
    const target: WaveParams = {
      amplitude: 1.0,
      frequency: 1.0,
      phase: 0,
      dcOffset: 0,
    };

    for (const p of params) {
      target[p.key] = round(
        Phaser.Math.FloatBetween(p.min + (p.max - p.min) * 0.2, p.max - (p.max - p.min) * 0.2),
        2
      );
    }

    return target;
  }

  private computeWave(x: number, params: WaveParams): number {
    let y = params.amplitude * Math.sin(2 * Math.PI * params.frequency * x + params.phase);
    if (params.dcOffset !== undefined) y += params.dcOffset;
    // Harmonic/composite: add secondary component for higher complexities
    if (this.diffConfig.targetComplexity === 'harmonic' || this.diffConfig.targetComplexity === 'composite') {
      if (params === this.targetParams) {
        y += (params.amplitude * 0.3) * Math.sin(2 * Math.PI * params.frequency * 2 * x);
      }
    }
    return y;
  }

  private calculateMatch(): number {
    let totalError = 0;
    let maxAmplitude = 0;

    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = i / SAMPLE_COUNT;
      const tVal = this.computeWave(x, this.targetParams);
      const pVal = this.computeWave(x, this.playerParams);
      totalError += Math.abs(tVal - pVal);
      maxAmplitude = Math.max(maxAmplitude, Math.abs(tVal), Math.abs(pVal));
    }

    const maxPossibleError = SAMPLE_COUNT * Math.max(maxAmplitude * 2, 1);
    return Math.max(0, Math.round(100 * (1 - totalError / maxPossibleError)));
  }

  private drawGrid(): void {
    const g = this.gridGraphics;
    g.clear();
    g.lineStyle(1, COLOR_GRID, 0.3);

    // Vertical grid lines (8 divisions)
    for (let i = 0; i <= 8; i++) {
      const x = this.scopeX + (this.scopeW / 8) * i;
      g.moveTo(x, this.scopeY);
      g.lineTo(x, this.scopeY + this.scopeH);
    }
    // Horizontal grid lines (6 divisions)
    for (let i = 0; i <= 6; i++) {
      const y = this.scopeY + (this.scopeH / 6) * i;
      g.moveTo(this.scopeX, y);
      g.lineTo(this.scopeX + this.scopeW, y);
    }
    g.strokePath();

    // Center axis — slightly brighter
    g.lineStyle(1, COLOR_GRID, 0.6);
    const centerY = this.scopeY + this.scopeH / 2;
    g.moveTo(this.scopeX, centerY);
    g.lineTo(this.scopeX + this.scopeW, centerY);
    g.strokePath();
  }

  private drawWaveforms(): void {
    this.matchPercent = this.calculateMatch();

    const centerY = this.scopeY + this.scopeH / 2;
    const yScale = this.scopeH / 5; // maps wave amplitude to pixels

    // Target waveform — glow layer (wider, transparent)
    this.targetGlow.clear();
    this.targetGlow.lineStyle(4, COLOR_TARGET, 0.25);
    this.targetGlow.beginPath();
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = this.scopeX + (i / SAMPLE_COUNT) * this.scopeW;
      const y = centerY - this.computeWave(i / SAMPLE_COUNT, this.targetParams) * yScale;
      if (i === 0) this.targetGlow.moveTo(x, y);
      else this.targetGlow.lineTo(x, y);
    }
    this.targetGlow.strokePath();

    // Target waveform — sharp line
    this.targetLine.clear();
    this.targetLine.lineStyle(2, COLOR_TARGET, 0.9);
    this.targetLine.beginPath();
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = this.scopeX + (i / SAMPLE_COUNT) * this.scopeW;
      const y = centerY - this.computeWave(i / SAMPLE_COUNT, this.targetParams) * yScale;
      if (i === 0) this.targetLine.moveTo(x, y);
      else this.targetLine.lineTo(x, y);
    }
    this.targetLine.strokePath();

    // Player waveform
    this.playerLine.clear();
    this.playerLine.lineStyle(2, COLOR_PLAYER, 0.8);
    this.playerLine.beginPath();
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const x = this.scopeX + (i / SAMPLE_COUNT) * this.scopeW;
      const y = centerY - this.computeWave(i / SAMPLE_COUNT, this.playerParams) * yScale;
      if (i === 0) this.playerLine.moveTo(x, y);
      else this.playerLine.lineTo(x, y);
    }
    this.playerLine.strokePath();
  }

  private updateParamDisplay(): void {
    const params = this.diffConfig.params;
    const barW = (this.bounds.width * 0.4) - 20;

    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      const isActive = i === this.activeParamIndex;
      const value = this.playerParams[p.key] ?? 0;

      // Update label
      const indicator = isActive ? '\u25B8' : ' ';
      this.paramTexts[i].setText(`${indicator} ${t(p.labelKey)}: ${value.toFixed(2)}`);
      this.paramTexts[i].setColor(isActive ? '#00d4aa' : '#888888');

      // Update bar
      this.paramBars[i].setStrokeStyle(1, isActive ? 0x00d4aa : 0x444444);

      // Update fill
      const fillRatio = (value - p.min) / (p.max - p.min);
      const fillW = Math.max(1, fillRatio * (barW - 2));
      this.paramBarFills[i].setSize(fillW, 6);
      this.paramBarFills[i].setFillStyle(isActive ? 0x00d4aa : 0x666666);
    }

    if (!this.submitted) {
      this.matchText.setText(t('arcade.osc.matchUnknown'));
      this.matchText.setColor('#888888');
      return;
    }

    let matchColor = '#e74c3c'; // red
    if (this.matchPercent >= 80) matchColor = '#2ecc71'; // green
    else if (this.matchPercent >= 50) matchColor = '#f39c12'; // yellow

    this.matchText.setText(t('arcade.osc.matchKnown', { percent: this.matchPercent }));
    this.matchText.setColor(matchColor);
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
    if (this.virtualEnterHandler) {
      this.scene.game.events.off('virtual-enter', this.virtualEnterHandler);
      this.virtualEnterHandler = null;
    }

    if (this.finishDelayTimer) {
      this.finishDelayTimer.destroy();
      this.finishDelayTimer = null;
    }

    for (const obj of this.gameObjects) {
      obj.destroy();
    }
    this.gameObjects = [];
    this.paramTexts = [];
    this.paramBars = [];
    this.paramBarFills = [];

    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();
  }

  applyLocale(): void {
    this.updateParamDisplay();
    this.hintText?.setText(
      this.submitted ? t('arcade.osc.submittedHint') : t('arcade.osc.controls')
    );
  }

  isFinished(): boolean {
    return this.finished;
  }

  getScore(): number {
    return this.matchPercent;
  }

  getResult(): ArcadeGameResult {
    return {
      score: this.matchPercent,
      maxScore: 100,
      completed: this.matchPercent >= this.diffConfig.passThreshold,
    };
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
