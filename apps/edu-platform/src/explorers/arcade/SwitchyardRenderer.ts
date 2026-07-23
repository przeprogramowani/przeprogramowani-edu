import type { ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult } from '../systems/ArcadeTypes';
import { DEPTH } from '../config/constants';
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';
import { t } from '../i18n';

/**
 * Switchyard — the theme *is* the mechanic: plan first, then let the plan run.
 *
 * Planning phase: the trams stand still on a track graph of 2-4 parallel lanes
 * (difficulty-scaled). Each lane spans the same distance but has a different
 * number of stops, so it takes a different number of beats to reach the shared
 * merge node before the smelter sink. Every tram has its own route switch that
 * cycles it through the lanes; a lane is a siding with limited capacity
 * (ceil(trams/lanes)), so parking the whole fleet on one lane is impossible.
 * The player moves a cursor (WSAD) and presses SPACE to either cycle the
 * nearest switch (lane) or cycle the nearest tram's departure slot (order).
 * Two trams that ever occupy the same node on the same beat spill their cargo —
 * which happens exactly when two trams' (departure slot + lane length) sums
 * coincide at the merge. The puzzle is scheduling.
 *
 * Execution phase: ENTER starts the schedule. The trams run on their own along
 * the routed tracks in slot order; the player only has a scarce budget of manual
 * holds (SPACE pauses the nearest running tram for one beat) to rescue a
 * near-collision the plan didn't foresee. A clean plan needs no holds at all.
 */

interface TrackNode {
  id: string;
  x: number;
  y: number;
}

interface Junction {
  id: string;
  x: number;
  y: number;
  laneIndex: number;
}

interface Tram {
  index: number;
  rowY: number;
  spawnX: number;
  junctionIndex: number;
  departSlot: number;
  route: TrackNode[];
  nodeIndex: number; // -1 = parked at spawn (route[0])
  state: 'parked' | 'running' | 'delivered' | 'spilled';
  pendingHold: boolean;
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Rectangle;
  badge: Phaser.GameObjects.Text;
}

// CRT palette (mirrors the other arcade renderers)
const COLOR_BG = 0x05100c;
const COLOR_TRACK = 0x123326;
// One color per lane so a tram's route reads at a glance (max 4 lanes).
const LANE_COLORS = [0x00d4aa, 0xffb347, 0x4fc3f7, 0xd18cff];
const COLOR_CURSOR = 0x7cff7c;
const COLOR_SOURCE = 0x2f6f5a;
const COLOR_SINK = 0xffd166;
const COLOR_TRAM = 0x9fe8d6;
const COLOR_TEXT_PRIMARY = '#a6f5df';
const COLOR_TEXT_WARN = '#ffb347';
const COLOR_TEXT_CONTROLS = '#ffffff';

const CURSOR_SPEED = 320;
const HEADER_H = 46;
const FOOTER_H = 26;
const EXEC_TICK_LIMIT = 18;
const COLLISION_PENALTY = 5;
const INTERACTION_RADIUS = 34;

export class SwitchyardRenderer implements ArcadeGameRenderer {
  private scene!: Phaser.Scene;

  private maskGraphics!: Phaser.GameObjects.Graphics;
  private geometryMask!: Phaser.Display.Masks.GeometryMask;

  private background!: Phaser.GameObjects.Rectangle;
  private trackGraphics!: Phaser.GameObjects.Graphics;
  private cursorGraphics!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private scanlines: Phaser.GameObjects.Rectangle[] = [];
  private effects: Phaser.GameObjects.GameObject[] = [];

  private fieldRect!: Phaser.Geom.Rectangle;

  // One route switch per tram; all lanes funnel into the shared merge node.
  private junctions: Junction[] = [];
  private lanes: TrackNode[][] = [];
  private mergeNode!: TrackNode;
  private sinkNode!: TrackNode;

  private trams: Tram[] = [];
  private tramCount = 4;
  private laneCount = 2;
  private maxPerLane = 2;
  private maxHolds = 3;
  private tickMs = 440;

  private phase: 'planning' | 'executing' | 'done' = 'planning';
  private cursorX = 0;
  private cursorY = 0;
  private holdsLeft = 3;
  private delivered = 0;
  private collisions = 0;
  private score = 0;
  private finished = false;

  private execTimer: Phaser.Time.TimerEvent | null = null;
  private execTick = 0;
  private finishDelayTimer: Phaser.Time.TimerEvent | null = null;

  private keys: Record<string, boolean> = {};
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private keyupHandler: ((event: KeyboardEvent) => void) | null = null;
  private spaceHandler: (() => void) | null = null;
  private enterHandler: (() => void) | null = null;
  private virtualDirDownHandler: ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void) | null = null;
  private virtualDirUpHandler: ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void) | null = null;
  private virtualSpaceHandler: (() => void) | null = null;
  private virtualEnterHandler: (() => void) | null = null;

  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
    this.scene = scene;
    this.keys = {};
    this.scanlines = [];
    this.effects = [];
    this.trams = [];
    this.phase = 'planning';
    this.delivered = 0;
    this.collisions = 0;
    this.score = 0;
    this.finished = false;
    this.execTimer = null;
    this.execTick = 0;
    this.finishDelayTimer = null;

    // Difficulty 1..5 drives the whole curve:
    //   trams 3/3/4/4/5 (more merge traffic to plan around),
    //   lanes 2/2/3/3/4 (more lane lengths to schedule against each other),
    //   holds 5/4/3/2/1 (less room to rescue a bad plan),
    //   beat 490..370ms (less reaction time per hold).
    this.tramCount = Phaser.Math.Clamp(2 + Math.ceil(config.difficulty / 2), 3, 5);
    this.laneCount = Phaser.Math.Clamp(1 + Math.ceil(config.difficulty / 2), 2, 4);
    // Sidings are short: capping trams-per-lane forbids the degenerate plan of
    // routing the whole fleet down one lane in single file.
    this.maxPerLane = Math.ceil(this.tramCount / this.laneCount);
    this.maxHolds = Phaser.Math.Clamp(6 - config.difficulty, 1, 5);
    this.holdsLeft = this.maxHolds;
    this.tickMs = 520 - config.difficulty * 30;

    this.fieldRect = new Phaser.Geom.Rectangle(
      bounds.x + 12,
      bounds.y + HEADER_H,
      bounds.width - 24,
      bounds.height - HEADER_H - FOOTER_H
    );

    this.buildGraph();

    this.cursorX = this.fieldRect.left + this.fieldRect.width * 0.14;
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

    this.trackGraphics = scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 4)
      .setMask(this.geometryMask);

    this.cursorGraphics = scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.titleText = scene.add
      .text(bounds.x + 12, bounds.y + 10, t('arcade.sw.title'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7cff7c',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 8)
      .setMask(this.geometryMask);

    this.phaseText = scene.add
      .text(bounds.right - 12, bounds.y + 10, t('arcade.sw.phasePlanning'), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: COLOR_TEXT_WARN,
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
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
      .text(bounds.x + 12, bounds.bottom - 18, t('arcade.sw.controlsPlanning'), {
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

    this.buildTrams();
    this.drawTracks();
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
    this.spaceHandler = () => this.onSpace();
    this.enterHandler = () => this.onEnter();

    scene.input.keyboard?.on('keydown', this.keydownHandler);
    scene.input.keyboard?.on('keyup', this.keyupHandler);
    scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);
    scene.input.keyboard?.on('keydown-ENTER', this.enterHandler);

    const dirToKey: Record<string, 'w' | 'a' | 's' | 'd'> = { up: 'w', down: 's', left: 'a', right: 'd' };
    this.virtualDirDownHandler = ({ dir }) => {
      const key = dirToKey[dir];
      if (key) this.keys[key] = true;
    };
    this.virtualDirUpHandler = ({ dir }) => {
      const key = dirToKey[dir];
      if (key) this.keys[key] = false;
    };
    this.virtualSpaceHandler = () => this.onSpace();
    this.virtualEnterHandler = () => this.onEnter();

    scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
    scene.game.events.on('virtual-dir-up', this.virtualDirUpHandler);
    scene.game.events.on('virtual-space', this.virtualSpaceHandler);
    scene.game.events.on('virtual-enter', this.virtualEnterHandler);
  }

  update(time: number, delta: number): void {
    if (this.finished || this.phase === 'done') return;

    const dt = delta / 1000;
    if (this.keys.w) this.cursorY -= CURSOR_SPEED * dt;
    if (this.keys.s) this.cursorY += CURSOR_SPEED * dt;
    if (this.keys.a) this.cursorX -= CURSOR_SPEED * dt;
    if (this.keys.d) this.cursorX += CURSOR_SPEED * dt;

    this.cursorX = Phaser.Math.Clamp(this.cursorX, this.fieldRect.left, this.fieldRect.right);
    this.cursorY = Phaser.Math.Clamp(this.cursorY, this.fieldRect.top, this.fieldRect.bottom);

    this.drawCursor(time);
  }

  // --- Graph -----------------------------------------------------------------

  private buildGraph(): void {
    const r = this.fieldRect;
    const x = (f: number) => r.left + r.width * f;

    // Lane i has 2+i stops over the same horizontal span, so lower lanes take
    // more beats to reach the merge. Lane length is the scheduling currency:
    // a tram arrives at the merge on beat (departSlot + lane length + const).
    this.lanes = [];
    for (let laneIdx = 0; laneIdx < this.laneCount; laneIdx++) {
      const laneY =
        r.top + r.height * (this.laneCount === 1 ? 0.5 : 0.2 + 0.6 * (laneIdx / (this.laneCount - 1)));
      const stops = 2 + laneIdx;
      const nodes: TrackNode[] = [];
      for (let k = 0; k < stops; k++) {
        nodes.push({
          id: `l${laneIdx}n${k}`,
          x: x(0.32 + 0.4 * (stops === 1 ? 0.5 : k / (stops - 1))),
          y: laneY,
        });
      }
      this.lanes.push(nodes);
    }

    this.mergeNode = { id: 'merge', x: x(0.84), y: r.centerY };
    this.sinkNode = { id: 'sink', x: x(0.93), y: r.centerY };
  }

  private buildRoute(tram: Tram): TrackNode[] {
    const spawn: TrackNode = { id: `s${tram.index}`, x: tram.spawnX, y: tram.rowY };
    const junction = this.junctions[tram.junctionIndex];
    const junctionNode: TrackNode = { id: junction.id, x: junction.x, y: junction.y };
    const lane = this.lanes[junction.laneIndex];
    return [spawn, junctionNode, ...lane, this.mergeNode, this.sinkNode];
  }

  private buildTrams(): void {
    const r = this.fieldRect;
    const spawnX = r.left + r.width * 0.05;
    const switchX = r.left + r.width * 0.17;
    const n = this.tramCount;

    this.junctions = [];
    for (let i = 0; i < n; i++) {
      const rowY = r.top + r.height * (0.16 + 0.68 * (n === 1 ? 0.5 : i / (n - 1)));
      // One switch per tram, right after its spawn: cycling it picks the lane.
      this.junctions.push({ id: `j${i}`, x: switchX, y: rowY, laneIndex: i % this.laneCount });
      // Departure slots always form a real queue. The initial lane switches,
      // not an invalid queue, create the deterministic merge collision.
      const departSlot = i;

      const body = this.scene.add.rectangle(0, 0, 28, 11, COLOR_TRAM).setStrokeStyle(1, 0x0a1a14);
      const badge = this.scene.add
        .text(0, 0, `${i + 1}:${departSlot + 1}`, {
          fontFamily: 'monospace',
          fontSize: '9px',
          color: '#04120d',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      const container = this.scene.add
        .container(spawnX, rowY, [body, badge])
        .setScrollFactor(0)
        .setDepth(DEPTH.ARCADE + 6)
        .setMask(this.geometryMask);

      const tram: Tram = {
        index: i,
        rowY,
        spawnX,
        junctionIndex: i,
        departSlot,
        route: [],
        nodeIndex: -1,
        state: 'parked',
        pendingHold: false,
        container,
        body,
        badge,
      };
      this.trams.push(tram);
    }

    this.ensureInitialConflict();
    for (const tram of this.trams) tram.route = this.buildRoute(tram);
  }

  /**
   * The starting plan must contain at least one merge collision, or pressing
   * ENTER immediately wins. Two trams collide at the merge exactly when their
   * (departSlot + laneIndex) sums are equal (all lanes span the same distance,
   * lane i just has i extra stops). If the default lane spread happens to be
   * collision-free, re-lane the last tram onto a colliding sum.
   */
  private ensureInitialConflict(): void {
    const sums = this.trams.map((tram) => tram.departSlot + this.junctions[tram.junctionIndex].laneIndex);
    if (new Set(sums).size < sums.length) return;

    const last = this.trams[this.trams.length - 1];
    const ownLane = this.junctions[last.junctionIndex].laneIndex;
    for (let lane = 0; lane < this.laneCount; lane++) {
      const candidate = last.departSlot + lane;
      const hasRoom = lane === ownLane || this.laneLoad(lane) < this.maxPerLane;
      if (hasRoom && sums.slice(0, -1).includes(candidate)) {
        this.junctions[last.junctionIndex].laneIndex = lane;
        return;
      }
    }
  }

  /** How many trams are currently routed onto the given lane. */
  private laneLoad(laneIndex: number): number {
    return this.junctions.filter((junction) => junction.laneIndex === laneIndex).length;
  }

  // --- Input actions ---------------------------------------------------------

  private onSpace(): void {
    if (this.phase === 'planning') {
      this.planningAction();
    } else if (this.phase === 'executing') {
      this.holdNearestTram();
    }
  }

  private onEnter(): void {
    if (this.phase === 'planning') {
      this.startExecution();
    } else if (this.phase === 'done') {
      this.finished = true;
    }
  }

  /** In planning, SPACE flips a nearby junction or cycles a nearby tram's slot. */
  private planningAction(): void {
    let best:
      | { kind: 'switch'; junction: Junction; dist: number }
      | { kind: 'order'; tram: Tram; dist: number }
      | null = null;
    for (const tram of this.trams) {
      const dOrder = Math.hypot(this.cursorX - tram.spawnX, this.cursorY - tram.rowY);
      if (!best || dOrder < best.dist) best = { kind: 'order', tram, dist: dOrder };
    }
    for (const junction of this.junctions) {
      const dist = Math.hypot(this.cursorX - junction.x, this.cursorY - junction.y);
      if (!best || dist < best.dist) best = { kind: 'switch', junction, dist };
    }
    if (!best || best.dist > INTERACTION_RADIUS) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }

    if (best.kind === 'switch') {
      // Cycle to the next lane with free siding capacity (own lane always counts
      // as free once this tram leaves it).
      const previousLane = best.junction.laneIndex;
      for (let step = 1; step <= this.laneCount; step++) {
        const candidate = (previousLane + step) % this.laneCount;
        if (candidate === previousLane || this.laneLoad(candidate) < this.maxPerLane) {
          best.junction.laneIndex = candidate;
          break;
        }
      }
      if (best.junction.laneIndex === previousLane) {
        audioManager.playSfx(SfxKey.ERROR_BUZZ);
        return;
      }
      for (const tram of this.trams) {
        if (this.junctions[tram.junctionIndex] === best.junction) {
          tram.route = this.buildRoute(tram);
        }
      }
      audioManager.playSfx(SfxKey.PARAM_BEEP);
    } else {
      const previousSlot = best.tram.departSlot;
      const nextSlot = (previousSlot + 1) % this.tramCount;
      const displaced = this.trams.find((tram) => tram !== best.tram && tram.departSlot === nextSlot);
      if (displaced) {
        displaced.departSlot = previousSlot;
        displaced.badge.setText(`${displaced.index + 1}:${displaced.departSlot + 1}`);
      }
      best.tram.departSlot = nextSlot;
      best.tram.badge.setText(`${best.tram.index + 1}:${best.tram.departSlot + 1}`);
      audioManager.playSfx(SfxKey.CELL_CLICK);
    }
    this.drawTracks();
    this.updateStatusText();
  }

  private holdNearestTram(): void {
    if (this.holdsLeft <= 0) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }
    let target: Tram | null = null;
    let bestDist = Infinity;
    for (const tram of this.trams) {
      if (tram.state !== 'running' || tram.pendingHold) continue;
      const d = Math.hypot(this.cursorX - tram.container.x, this.cursorY - tram.container.y);
      if (d < bestDist) {
        bestDist = d;
        target = tram;
      }
    }
    if (!target || bestDist > INTERACTION_RADIUS) {
      audioManager.playSfx(SfxKey.ERROR_BUZZ);
      return;
    }
    target.pendingHold = true;
    this.holdsLeft--;
    audioManager.playSfx(SfxKey.SIGNAL_BEEP);
    this.flash(target.container.x, target.container.y, COLOR_CURSOR);
    this.updateStatusText();
  }

  // --- Execution -------------------------------------------------------------

  private startExecution(): void {
    this.phase = 'executing';
    for (const tram of this.trams) {
      tram.nodeIndex = -1;
      tram.state = 'running';
      tram.pendingHold = false;
    }
    this.drawTracks();
    this.phaseText.setText(t('arcade.sw.phaseExecution'));
    this.phaseText.setColor('#7cff7c');
    this.hintText.setText(t('arcade.sw.controlsExecution', { holds: this.holdsLeft }));
    this.updateStatusText();
    audioManager.playSfx(SfxKey.SUBMIT_CONFIRM);

    this.execTick = 0;
    this.execTimer = this.scene.time.addEvent({
      delay: this.tickMs,
      loop: true,
      callback: () => this.doTick(),
    });
  }

  private doTick(): void {
    if (this.phase !== 'executing') return;
    this.execTick++;

    // Advance every running tram one node (unless held or not yet departed).
    for (const tram of this.trams) {
      if (tram.state !== 'running') continue;
      if (tram.pendingHold) {
        tram.pendingHold = false;
        continue;
      }
      // departSlot n departs on execTick n+1 (first move onto route[0]).
      if (this.execTick <= tram.departSlot) continue;
      if (tram.nodeIndex >= tram.route.length - 1) continue;
      tram.nodeIndex++;
      const node = tram.route[tram.nodeIndex];
      this.scene.tweens.add({
        targets: tram.container,
        x: node.x,
        y: node.y,
        duration: this.tickMs * 0.85,
        ease: 'Sine.easeInOut',
      });
    }

    this.resolveTick();
    this.updateStatusText();

    const anyRunning = this.trams.some((tram) => tram.state === 'running');
    if (!anyRunning || this.execTick >= EXEC_TICK_LIMIT) this.finishExecution();
  }

  /** Collision + delivery resolution by shared node id. */
  private resolveTick(): void {
    const occupancy = new Map<string, Tram[]>();
    for (const tram of this.trams) {
      if (tram.state !== 'running' || tram.nodeIndex < 0) continue;
      const id = tram.route[tram.nodeIndex].id;
      const list = occupancy.get(id) ?? [];
      list.push(tram);
      occupancy.set(id, list);
    }

    for (const [, list] of occupancy) {
      if (list.length >= 2) {
        this.collisions++;
        for (const tram of list) this.spill(tram);
      }
    }

    // Trams that reached the sink alone this beat are delivered.
    for (const tram of this.trams) {
      if (tram.state !== 'running') continue;
      if (tram.route[tram.nodeIndex]?.id === this.sinkNode.id) this.deliver(tram);
    }
  }

  private spill(tram: Tram): void {
    tram.state = 'spilled';
    audioManager.playSfx(SfxKey.ERROR_BUZZ);
    this.scene.tweens.killTweensOf(tram.container);
    this.flash(tram.container.x, tram.container.y, 0xe74c3c);
    this.scene.tweens.add({
      targets: tram.container,
      alpha: 0,
      scaleX: 1.6,
      scaleY: 1.6,
      duration: 260,
      onComplete: () => tram.container.setVisible(false),
    });
  }

  private deliver(tram: Tram): void {
    tram.state = 'delivered';
    this.delivered++;
    audioManager.playSfx(SfxKey.OBJECTIVE_TICK);
    this.flash(this.sinkNode.x, this.sinkNode.y, COLOR_SINK);
    this.scene.tweens.add({
      targets: tram.container,
      alpha: 0,
      duration: 240,
      onComplete: () => tram.container.setVisible(false),
    });
  }

  private finishExecution(): void {
    if (this.execTimer) {
      this.execTimer.destroy();
      this.execTimer = null;
    }
    this.phase = 'done';

    const base = Math.round((100 * this.delivered) / this.tramCount);
    this.score = Phaser.Math.Clamp(base - this.collisions * COLLISION_PENALTY, 0, 100);

    audioManager.playSfx(this.score >= 70 ? SfxKey.SUCCESS_CHIME : SfxKey.ERROR_BUZZ);

    this.phaseText.setText(t('arcade.sw.result', { score: this.score }));
    this.phaseText.setColor(this.score >= 70 ? '#7cff7c' : '#e74c3c');
    this.statusText.setText(t('arcade.sw.result', { score: this.score }));
    this.statusText.setColor(this.score >= 70 ? COLOR_TEXT_PRIMARY : '#e74c3c');
    this.hintText.setText(t('arcade.sw.finishHint'));
    this.hintText.setColor('#00d4aa');
    this.cursorGraphics.clear();

    // Auto-resolve even if the player never presses ENTER on the results beat.
    this.finishDelayTimer = this.scene.time.delayedCall(2600, () => {
      this.finished = true;
      this.finishDelayTimer = null;
    });
  }

  // --- Drawing ---------------------------------------------------------------

  private drawTracks(): void {
    const g = this.trackGraphics;
    g.clear();

    // Source (gallery) and sink (smelter) posts.
    const srcX = this.fieldRect.left + this.fieldRect.width * 0.05;
    g.fillStyle(COLOR_SOURCE, 0.5);
    g.fillRect(srcX - 6, this.fieldRect.top, 4, this.fieldRect.height);
    g.fillStyle(COLOR_SINK, 0.85);
    g.fillCircle(this.sinkNode.x, this.sinkNode.y, 9);
    g.lineStyle(2, COLOR_SINK, 0.9);
    g.strokeCircle(this.sinkNode.x, this.sinkNode.y, 13);

    // Merge node.
    g.fillStyle(0x1a3a2e, 1);
    g.fillCircle(this.mergeNode.x, this.mergeNode.y, 6);
    g.lineStyle(1, LANE_COLORS[0], 0.5);
    g.strokeCircle(this.mergeNode.x, this.mergeNode.y, 6);

    // Faint skeleton of every lane so the alternatives are visible while planning.
    g.lineStyle(1, COLOR_TRACK, 0.9);
    for (const lane of this.lanes) {
      for (let i = 0; i < lane.length - 1; i++) {
        g.lineBetween(lane[i].x, lane[i].y, lane[i + 1].x, lane[i + 1].y);
      }
      g.lineBetween(lane[lane.length - 1].x, lane[lane.length - 1].y, this.mergeNode.x, this.mergeNode.y);
    }

    // Each tram's routed polyline; active lane bright, colored by lane.
    for (const tram of this.trams) {
      const junction = this.junctions[tram.junctionIndex];
      const laneColor = LANE_COLORS[junction.laneIndex % LANE_COLORS.length];
      const alpha = tram.state === 'spilled' ? 0.15 : 0.55;

      g.lineStyle(2, laneColor, alpha);
      const pts = tram.route;
      for (let i = 0; i < pts.length - 1; i++) {
        g.lineBetween(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
      }
    }

    // One route switch per tram, colored by its currently selected lane.
    for (const junction of this.junctions) {
      const laneColor = LANE_COLORS[junction.laneIndex % LANE_COLORS.length];
      g.fillStyle(laneColor, 0.9);
      g.beginPath();
      g.moveTo(junction.x, junction.y - 7);
      g.lineTo(junction.x + 7, junction.y);
      g.lineTo(junction.x, junction.y + 7);
      g.lineTo(junction.x - 7, junction.y);
      g.closePath();
      g.fillPath();
    }

    // Shared stop dots — more stops on a lane = more beats to cross it.
    g.fillStyle(COLOR_TRACK, 1);
    for (const lane of this.lanes) {
      for (const node of lane) {
        g.fillCircle(node.x, node.y, 3);
      }
    }

    // Siding capacity pips at each lane entry: filled = trams routed here.
    for (let laneIdx = 0; laneIdx < this.lanes.length; laneIdx++) {
      const entry = this.lanes[laneIdx][0];
      const load = this.laneLoad(laneIdx);
      const laneColor = LANE_COLORS[laneIdx % LANE_COLORS.length];
      for (let p = 0; p < this.maxPerLane; p++) {
        const px = entry.x - 16 - p * 8;
        if (p < load) {
          g.fillStyle(laneColor, 0.9);
          g.fillRect(px - 2, entry.y - 2, 5, 5);
        } else {
          g.lineStyle(1, laneColor, 0.5);
          g.strokeRect(px - 2, entry.y - 2, 5, 5);
        }
      }
    }
  }

  private drawCursor(time: number): void {
    const g = this.cursorGraphics;
    g.clear();
    if (this.phase === 'done') return;

    const pulse = 0.7 + 0.3 * Math.sin(time / 180);
    const r = 9 + 1.5 * Math.sin(time / 150);

    g.lineStyle(1, COLOR_CURSOR, 0.9 * pulse);
    g.strokeCircle(this.cursorX, this.cursorY, r);
    g.lineBetween(this.cursorX - 13, this.cursorY, this.cursorX - 5, this.cursorY);
    g.lineBetween(this.cursorX + 5, this.cursorY, this.cursorX + 13, this.cursorY);
    g.lineBetween(this.cursorX, this.cursorY - 13, this.cursorX, this.cursorY - 5);
    g.lineBetween(this.cursorX, this.cursorY + 5, this.cursorX, this.cursorY + 13);
    g.fillStyle(COLOR_CURSOR, 1);
    g.fillCircle(this.cursorX, this.cursorY, 1.5);
  }

  private flash(x: number, y: number, color: number): void {
    const ring = this.scene.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(DEPTH.ARCADE + 7)
      .setMask(this.geometryMask);
    ring.lineStyle(2, color, 0.8);
    ring.strokeCircle(0, 0, 8);
    ring.setPosition(x, y);
    this.effects.push(ring);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 420,
      onComplete: () => {
        ring.destroy();
        const idx = this.effects.indexOf(ring);
        if (idx >= 0) this.effects.splice(idx, 1);
      },
    });
  }

  private updateStatusText(): void {
    if (this.phase === 'planning') {
      const order = [...this.trams]
        .sort((a, b) => a.departSlot - b.departSlot || a.index - b.index)
        .map((tram) => `#${tram.index + 1}@${tram.departSlot + 1}`)
        .join(' ');
      const queue = t('arcade.sw.queue', { order });
      this.statusText.setText(queue);
      this.statusText.setColor(COLOR_TEXT_PRIMARY);
    } else if (this.phase === 'executing') {
      this.statusText.setText(
        t('arcade.sw.delivered', {
          done: this.delivered,
          total: this.tramCount,
          holds: this.holdsLeft,
        })
      );
      this.statusText.setColor(COLOR_TEXT_PRIMARY);
      this.hintText.setText(t('arcade.sw.controlsExecution', { holds: this.holdsLeft }));
    }
  }

  applyLocale(): void {
    this.titleText.setText(t('arcade.sw.title'));
    if (this.phase === 'planning') {
      this.phaseText.setText(t('arcade.sw.phasePlanning'));
      this.hintText.setText(t('arcade.sw.controlsPlanning'));
      this.updateStatusText();
    } else if (this.phase === 'executing') {
      this.phaseText.setText(t('arcade.sw.phaseExecution'));
      this.updateStatusText();
    } else {
      this.phaseText.setText(t('arcade.sw.result', { score: this.score }));
      this.statusText.setText(t('arcade.sw.result', { score: this.score }));
      this.hintText.setText(t('arcade.sw.finishHint'));
    }
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
    if (this.execTimer) {
      this.execTimer.destroy();
      this.execTimer = null;
    }
    if (this.finishDelayTimer) {
      this.finishDelayTimer.destroy();
      this.finishDelayTimer = null;
    }

    for (const tram of this.trams) {
      this.scene.tweens.killTweensOf(tram.container);
      tram.container.destroy();
    }
    this.trams = [];
    for (const fx of this.effects) fx.destroy();
    this.effects = [];
    for (const line of this.scanlines) line.destroy();
    this.scanlines = [];

    this.cursorGraphics?.destroy();
    this.trackGraphics?.destroy();
    this.background?.destroy();
    this.titleText?.destroy();
    this.phaseText?.destroy();
    this.statusText?.destroy();
    this.hintText?.destroy();
    this.maskGraphics?.destroy();
    this.geometryMask?.destroy();

    this.keys = {};
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
      completed: this.phase === 'done',
    };
  }
}
