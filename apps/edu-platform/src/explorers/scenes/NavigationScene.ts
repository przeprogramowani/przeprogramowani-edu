import Phaser from 'phaser';
import { SceneKey } from '../config/sceneRegistry';
import { DEPTH, COLORS } from '../config/constants';
import { GameEvents } from '../events/GameEvents';
import { BaseScene } from './BaseScene';
import {
  NAV_DESTINATIONS,
  getDestinationStatus,
  type NavDestination,
  type DestinationStatus,
} from '../levels/navigationDestinations';
import { devLog } from '../utils/logger';
import { localized } from '../i18n/types';
import { t } from '../i18n';

/**
 * Ship navigation deck — an overlay scene (same lifecycle as ExamScene) that
 * lets the player pick one of the 5 mission moons. Selecting an available
 * destination plays a short flight cinematic, then triggers a map transition.
 */
export class NavigationScene extends BaseScene {
  private uiObjects: Phaser.GameObjects.GameObject[] = [];
  private active = false;
  private launching = false;
  private escDismiss: (() => void) | null = null;
  private flightTimers: Phaser.Time.TimerEvent[] = [];

  constructor() {
    super({ key: SceneKey.NAVIGATION });
  }

  create(): void {
    devLog('[NavigationScene] Created');

    const onNavigationShow = () => {
      this.showNavigation();
    };
    this.bus.on(GameEvents.NAVIGATION_SHOW, onNavigationShow);

    // Re-render on canvas resize so the panel stays centered (mirrors ExamScene)
    const onResize = () => {
      if (!this.active || this.launching) return;
      this.renderDestinations();
    };
    this.scale.on('resize', onResize);

    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.NAVIGATION_SHOW, onNavigationShow);
      this.scale.off('resize', onResize);
    });

    // Start in sleep mode
    this.scene.sleep();
  }

  private showNavigation(): void {
    if (this.scene.isSleeping(SceneKey.NAVIGATION)) {
      this.scene.wake();
    }
    this.active = true;
    this.launching = false;

    devLog('[NavigationScene] Navigation deck opened');
    this.renderDestinations();

    this.escDismiss = () => {
      if (!this.launching) this.dismiss();
    };
    this.input.keyboard?.on('keydown-ESC', this.escDismiss);
  }

  private clearUI(): void {
    for (const obj of this.uiObjects) {
      obj.destroy();
    }
    this.uiObjects = [];
  }

  private clearFlightTimers(): void {
    for (const timer of this.flightTimers) {
      timer.destroy();
    }
    this.flightTimers = [];
  }

  private getStatus(dest: NavDestination): DestinationStatus {
    return getDestinationStatus(dest, (flag) => this.hasFlag(flag));
  }

  private renderDestinations(): void {
    this.clearUI();

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.75)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION);
    this.uiObjects.push(overlay);

    // Panel dimensions
    const panelW = Math.min(560, width - 40);
    const rowH = 58;
    const rowGap = 8;
    const rowsH = NAV_DESTINATIONS.length * rowH + (NAV_DESTINATIONS.length - 1) * rowGap;
    // title(36) + subtitle(24) + rows + close(56)
    const panelH = Math.min(36 + 24 + rowsH + 56 + 16, height - 40);

    const panelLeft = cx - panelW / 2;
    const panelTop = cy - panelH / 2;

    const panel = this.add
      .rectangle(cx, cy, panelW, panelH, 0x111111, 0.95)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 1)
      .setStrokeStyle(2, COLORS.TEAL);
    this.uiObjects.push(panel);

    // Title bar
    const titleText = this.add
      .text(panelLeft + 16, panelTop + 12, t('nav.title'), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2);
    this.uiObjects.push(titleText);

    const subtitle = this.add
      .text(panelLeft + 16, panelTop + 34, t('nav.subtitle'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2);
    this.uiObjects.push(subtitle);

    const sepLine = this.add
      .rectangle(cx, panelTop + 54, panelW - 16, 1, COLORS.TEAL, 0.4)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2);
    this.uiObjects.push(sepLine);

    // Destination rows
    const rowW = panelW - 32;
    let rowY = panelTop + 64;
    for (const dest of NAV_DESTINATIONS) {
      this.renderDestinationRow(dest, cx, rowY, rowW, rowH, panelLeft);
      rowY += rowH + rowGap;
    }

    // Close button
    const closeY = panelTop + panelH - 28;
    const closeBg = this.add
      .rectangle(cx, closeY, 160, 28, 0x222222, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2)
      .setStrokeStyle(1, 0x444444)
      .setInteractive({ useHandCursor: true });
    this.uiObjects.push(closeBg);

    const closeText = this.add
      .text(cx, closeY, t('nav.close'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 3);
    this.uiObjects.push(closeText);

    closeBg.on('pointerover', () => closeBg.setFillStyle(0x333333, 1));
    closeBg.on('pointerout', () => closeBg.setFillStyle(0x222222, 1));
    closeBg.on('pointerup', () => this.dismiss());
  }

  private renderDestinationRow(
    dest: NavDestination,
    cx: number,
    rowY: number,
    rowW: number,
    rowH: number,
    panelLeft: number
  ): void {
    const status = this.getStatus(dest);
    const isAvailable = status === 'available';

    const rowBg = this.add
      .rectangle(cx, rowY + rowH / 2, rowW, rowH, isAvailable ? 0x0a2a2a : 0x1a1a1a, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2)
      .setStrokeStyle(1, isAvailable ? COLORS.TEAL : 0x333333);
    this.uiObjects.push(rowBg);

    const nameColor = isAvailable ? '#00d4aa' : status === 'locked' ? '#cccccc' : '#555555';
    const nameText = this.add
      .text(panelLeft + 28, rowY + 12, localized(dest.name), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: nameColor,
        fontStyle: isAvailable ? 'bold' : 'normal',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 3);
    this.uiObjects.push(nameText);

    const descText = this.add
      .text(panelLeft + 28, rowY + 32, localized(dest.description), {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: status === 'no-signal' ? '#444444' : '#888888',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 3);
    this.uiObjects.push(descText);

    const statusKey =
      status === 'available' ? 'nav.statusAvailable' : status === 'locked' ? 'nav.statusLocked' : 'nav.statusNoSignal';
    const statusColor = status === 'available' ? '#2ecc71' : status === 'locked' ? '#ffb347' : '#555555';
    const statusText = this.add
      .text(panelLeft + rowW + 4, rowY + 12, t(statusKey), {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: statusColor,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 3);
    this.uiObjects.push(statusText);

    if (isAvailable) {
      rowBg.setInteractive({ useHandCursor: true });
      rowBg.on('pointerover', () => rowBg.setFillStyle(COLORS.EXAM_HOVER, 1));
      rowBg.on('pointerout', () => rowBg.setFillStyle(0x0a2a2a, 1));
      rowBg.on('pointerup', () => this.launchTo(dest));
    }
  }

  /** Flight cinematic: black screen, star streaks, course text — then map transition. */
  private launchTo(dest: NavDestination): void {
    if (this.launching || !dest.targetMap) return;
    this.launching = true;

    devLog(`[NavigationScene] Launching to ${dest.id} → ${dest.targetMap}`);
    this.clearUI();

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION);
    this.uiObjects.push(overlay);

    // Star streaks radiating from the center — cheap warp effect
    const spawnStreak = () => {
      const angle = Math.random() * Math.PI * 2;
      const startRadius = 20 + Math.random() * 60;
      const startX = cx + Math.cos(angle) * startRadius;
      const startY = cy + Math.sin(angle) * startRadius;
      const endRadius = Math.max(width, height);
      const endX = cx + Math.cos(angle) * endRadius;
      const endY = cy + Math.sin(angle) * endRadius;

      const streak = this.add
        .rectangle(startX, startY, 2, 2, 0xffffff, 0.9)
        .setScrollFactor(0)
        .setDepth(DEPTH.NAVIGATION + 1);
      this.uiObjects.push(streak);

      this.tweens.add({
        targets: streak,
        x: endX,
        y: endY,
        scaleX: 6,
        scaleY: 0.8,
        alpha: 0,
        duration: 700 + Math.random() * 500,
        ease: 'Cubic.easeIn',
        onComplete: () => streak.destroy(),
      });
    };

    const streakSpawner = this.time.addEvent({
      delay: 40,
      callback: spawnStreak,
      loop: true,
    });
    this.flightTimers.push(streakSpawner);

    // Course text
    const courseText = this.add
      .text(cx, cy - 16, t('nav.flightCourse', { name: localized(dest.name) }), {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#00d4aa',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2)
      .setAlpha(0);
    this.uiObjects.push(courseText);

    const engagedText = this.add
      .text(cx, cy + 14, t('nav.flightEngaged'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.NAVIGATION + 2)
      .setAlpha(0);
    this.uiObjects.push(engagedText);

    this.tweens.add({ targets: [courseText, engagedText], alpha: 1, duration: 600 });

    // Hold the flight, then hand over to the regular map transition
    const departTimer = this.time.delayedCall(2800, () => {
      this.clearFlightTimers();
      this.clearUI();
      this.active = false;
      this.launching = false;
      this.unbindEsc();

      this.bus.emit(GameEvents.TRANSITION_START, {
        targetMap: dest.targetMap,
        spawnX: dest.spawnX,
        spawnY: dest.spawnY,
      });
      this.scene.sleep();
    });
    this.flightTimers.push(departTimer);
  }

  protected override onLocaleChanged(): void {
    if (!this.active || this.launching) return;
    this.renderDestinations();
  }

  private unbindEsc(): void {
    if (this.escDismiss) {
      this.input.keyboard?.off('keydown-ESC', this.escDismiss);
      this.escDismiss = null;
    }
  }

  private dismiss(): void {
    if (!this.active) return;
    this.clearFlightTimers();
    this.clearUI();
    this.active = false;
    this.launching = false;
    this.unbindEsc();

    this.bus.emit(GameEvents.NAVIGATION_DISMISSED);
    this.scene.sleep();

    devLog('[NavigationScene] Navigation deck dismissed');
  }
}
