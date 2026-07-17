import Phaser from 'phaser';
import type { GameFlag } from '../config/flags';
import { SceneKey } from '../config/sceneRegistry';
import { GameEvents } from '../events/GameEvents';
import {
  TILE_SIZE,
  CAMERA_LERP,
  CAMERA_DEADZONE_X,
  CAMERA_DEADZONE_Y,
  DEPTH,
  SAVE_INTERVAL_MS,
} from '../config/constants';
import { getMapAssets } from '../assets/AssetManifest';
import { MAP_DISPLAY_NAMES } from '../config/mapRegistry';
import { getInteractionRoutes, getIntroConfig, getAllExams } from '../levels/levelLoader';
import { BaseScene } from './BaseScene';
import { InputController } from '../systems/InputController';
import { Astronaut } from '../entities/Astronaut';
import { InteractiveObject } from '../entities/InteractiveObject';
import { NPC } from '../entities/NPC';
import { InteractionDetector } from '../systems/InteractionDetector';
import type { Interactable } from '../systems/InteractionDetector';
import { InteractionPrompt } from '../ui/InteractionPrompt';
import { devLog } from '../utils/logger';
import { createSpotlightReveal } from '../effects/spotlightReveal';
import type { ArcadeShowPayload } from '../events/GameEvents';
import { sanitizeSpawnPosition, type SpawnCollisionGrid } from '../state/spawnValidation';
import { buildActorMovementBounds } from '../state/actorMovementBounds';
import { t } from '../i18n';

interface GameSceneData {
  mapKey: string;
  spawnX: number;
  spawnY: number;
}

export interface ZoneObject {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, unknown>;
}

export class GameScene extends BaseScene {
  private mapKey = 'm0-awakening';
  private spawnX = 0;
  private spawnY = 0;
  private player!: Astronaut;
  private inputController!: InputController;
  private wallLayer!: Phaser.Tilemaps.TilemapLayer;
  private collisionGrid!: SpawnCollisionGrid;
  private interactionDetector!: InteractionDetector;
  private interactionPrompt!: InteractionPrompt;
  private interactiveObjects: InteractiveObject[] = [];
  private npcs: NPC[] = [];
  private npcGroup!: Phaser.Physics.Arcade.Group;
  public zoneObjects: ZoneObject[] = [];
  private zoneDebugRects: Phaser.GameObjects.Rectangle[] = [];
  private inDialogue = false;
  private introPlaying = false;
  private autoSaveTimer?: Phaser.Time.TimerEvent;
  private pendingLocaleSwap = false;
  private endScreenTextObj: Phaser.GameObjects.Text | null = null;
  private endScreenCtaText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: SceneKey.GAME });
  }

  init(data: GameSceneData): void {
    super.init(data);
    this.mapKey = data.mapKey ?? 'm0-awakening';
    this.spawnX = data.spawnX ?? 0;
    this.spawnY = data.spawnY ?? 0;
  }

  preload(): void {
    const mapAssets = getMapAssets(this.mapKey);

    for (const asset of mapAssets) {
      if (this.textures.exists(asset.key) || this.cache.tilemap.exists(asset.key)) continue;
      if (asset.type === 'tilemapJSON') {
        this.load.tilemapTiledJSON(asset.key, asset.url);
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.url);
      }
    }
  }

  create(): void {
    devLog(`[GameScene] Entering map: ${this.mapKey} at (${this.spawnX}, ${this.spawnY})`);

    this.inDialogue = false;

    // Build tilemap
    const mapKey = `map-${this.mapKey}`;
    const map = this.make.tilemap({ key: mapKey });
    const tileset = map.addTilesetImage('placeholder', 'tileset-placeholder')!;

    // Create layers
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    if (groundLayer) {
      groundLayer.setDepth(DEPTH.GROUND);
    }

    const wallLayer = map.createLayer('Walls', tileset, 0, 0);
    if (wallLayer) {
      wallLayer.setDepth(DEPTH.WALLS);
      wallLayer.setCollisionByExclusion([-1, 0]);
      this.wallLayer = wallLayer;
    }

    this.collisionGrid = this.buildCollisionGrid(map);

    const safeSpawn = this.resolveSafeSpawnPosition(map);
    this.spawnX = safeSpawn.x;
    this.spawnY = safeSpawn.y;

    // Above layer (optional — only exists if map defines it)
    const aboveLayer = map.createLayer('Above', tileset, 0, 0);
    if (aboveLayer) {
      aboveLayer.setDepth(DEPTH.ABOVE);
    }

    // Background tile — fills viewport space outside the map (placeholder row 0, col 4)
    if (!this.textures.get('tileset-placeholder').has('bg-tile')) {
      this.textures.get('tileset-placeholder').add('bg-tile', 0, 4 * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
    }
    const bgTile = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, 'tileset-placeholder', 'bg-tile')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.GROUND - 1);

    // Parse zones for interactive objects
    this.zoneObjects = [];
    const npcZones: ZoneObject[] = [];
    const zonesLayer = map.getObjectLayer('Zones');
    if (zonesLayer) {
      for (const obj of zonesLayer.objects) {
        const props: Record<string, unknown> = {};
        if (obj.properties) {
          for (const p of obj.properties as Array<{ name: string; value: unknown }>) {
            props[p.name] = p.value;
          }
        }
        const zoneData: ZoneObject = {
          id: (props['id'] as string) ?? obj.name,
          name: obj.name,
          type: obj.type ?? 'trigger',
          x: obj.x ?? 0,
          y: obj.y ?? 0,
          width: obj.width ?? TILE_SIZE,
          height: obj.height ?? TILE_SIZE,
          properties: props,
        };
        if (zoneData.type === 'npc') {
          npcZones.push(zoneData);
        } else {
          this.zoneObjects.push(zoneData);
        }
      }
      devLog(`[GameScene] Parsed ${this.zoneObjects.length} zone objects, ${npcZones.length} NPC zone(s)`);
    }

    // Render zone debug overlays (dev only)
    this.zoneDebugRects = [];
    if (import.meta.env.DEV) {
      for (const zone of this.zoneObjects) {
        let color = 0xffb347;
        if (zone.type === 'door') color = 0x00d4aa;
        if (zone.type === 'terminal') color = 0x00d4aa;
        if (zone.type === 'exam') color = 0x9b59b6;
        if (zone.type === 'arcade') color = 0xe67e22;
        if (zone.type === 'npc') color = 0xe879f9;

        const rect = this.add.rectangle(zone.x + zone.width / 2, zone.y + zone.height / 2, zone.width, zone.height);
        rect.setStrokeStyle(2, color);
        rect.setFillStyle(color, 0.1);
        rect.setDepth(DEPTH.OBJECTS);
        this.zoneDebugRects.push(rect);
      }
    }

    // Create interaction system
    this.interactionDetector = new InteractionDetector();
    this.interactionPrompt = new InteractionPrompt(this);
    this.interactiveObjects = [];

    // Create InteractiveObject entities from parsed zones
    for (const zone of this.zoneObjects) {
      const obj = new InteractiveObject({
        scene: this,
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
        objectId: zone.id,
        objectType: zone.type as 'trigger' | 'door' | 'terminal' | 'exam' | 'arcade',
        eventId: (zone.properties['eventId'] as string) ?? zone.id,
        properties: zone.properties,
      });
      this.interactiveObjects.push(obj);
    }
    this.interactionDetector.registerAll(this.interactiveObjects);

    // Create NPC group and spawn NPCs from parsed npc zones
    this.npcGroup = this.physics.add.group();
    this.npcs = [];

    for (const zone of npcZones) {
      const npcTypeName = (zone.properties['npcType'] as string) ?? 'scientist';
      const npc = new NPC(
        this,
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        zone.id,
        npcTypeName,
        buildActorMovementBounds(this.collisionGrid, {
          x: zone.x + zone.width / 2,
          y: zone.y + zone.height / 2,
        }),
      );
      this.npcGroup.add(npc as unknown as Phaser.GameObjects.GameObject);
      this.npcs.push(npc);
    }
    devLog(`[GameScene] Spawned ${this.npcs.length} NPC(s)`);
    this.interactionDetector.registerAll(this.npcs);

    // Create input controller
    this.inputController = new InputController(this);

    // Wire terminal focus to input controller
    const onTerminalFocus = (payload: { focused: boolean }) => {
      this.inputController.setEnabled(!payload.focused);
    };
    this.bus.on(GameEvents.TERMINAL_FOCUS_CHANGED, onTerminalFocus);

    // Listen for dialogue dismissed
    const onDialogueDismissed = () => {
      this.inDialogue = false;
      this.player.enterState('idle');
      this.inputController.setEnabled(true);
      this.npcs.forEach((npc) => npc.unfreeze());
      devLog('[GameScene] Dialogue dismissed, movement restored');
    };
    this.bus.on(GameEvents.DIALOGUE_DISMISSED, onDialogueDismissed);

    // Listen for exam dismissed
    const onExamDismissed = () => {
      this.player.enterState('idle');
      this.inputController.setEnabled(true);
      this.npcs.forEach((npc) => npc.unfreeze());
      devLog('[GameScene] Exam dismissed, movement restored');
    };
    this.bus.on(GameEvents.EXAM_DISMISSED, onExamDismissed);

    // Listen for arcade dismissed
    const onArcadeDismissed = () => {
      this.player.enterState('idle');
      this.inputController.setEnabled(true);
      this.npcs.forEach((npc) => npc.unfreeze());
      devLog('[GameScene] Arcade dismissed, movement restored');
    };
    this.bus.on(GameEvents.ARCADE_DISMISSED, onArcadeDismissed);

    // Invalidate cached flags Set when a flag is set externally (e.g. via flagManager)
    const onFlagSet = (payload: { flag: string }) => {
      devLog(`[GameScene] Flag set: ${payload.flag}`);
      this.invalidateFlagsCache();
    };
    this.bus.on(GameEvents.FLAG_SET, onFlagSet);

    // Spawn astronaut
    this.player = new Astronaut(this, this.spawnX + TILE_SIZE / 2, this.spawnY + TILE_SIZE / 2, this.inputController);

    // Wall collision
    if (this.wallLayer) {
      this.physics.add.collider(this.player as unknown as Phaser.Types.Physics.Arcade.ArcadeColliderType, this.wallLayer);
      this.physics.add.collider(this.npcGroup, this.wallLayer);
    }

    // NPC colliders
    this.physics.add.collider(
      this.npcGroup,
      this.player as unknown as Phaser.Types.Physics.Arcade.ArcadeColliderType
    );
    this.physics.add.collider(this.npcGroup, this.npcGroup);

    // Set world bounds
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Camera setup
    this.cameras.main.startFollow(this.player, true, CAMERA_LERP, CAMERA_LERP);
    this.cameras.main.setDeadzone(CAMERA_DEADZONE_X, CAMERA_DEADZONE_Y);

    const updateCameraForViewport = () => {
      const canvasWidth = this.scale.width;
      const canvasHeight = this.scale.height;
      const zoomX = canvasWidth / Math.min(mapWidth, 1280);
      const zoomY = canvasHeight / Math.min(mapHeight, 720);
      const zoom = Math.max(1.0, Math.min(zoomX, zoomY));
      this.cameras.main.setZoom(zoom);

      // When map is smaller than viewport, allow negative scroll so map stays centered
      const viewportWidth = canvasWidth / zoom;
      const viewportHeight = canvasHeight / zoom;
      const offsetX = Math.max(0, (viewportWidth - mapWidth) / 2);
      const offsetY = Math.max(0, (viewportHeight - mapHeight) / 2);
      this.cameras.main.setBounds(
        -offsetX,
        -offsetY,
        Math.max(mapWidth, viewportWidth),
        Math.max(mapHeight, viewportHeight),
      );

      bgTile.setSize(canvasWidth, canvasHeight);
    };

    updateCameraForViewport();
    this.scale.on('resize', updateCameraForViewport);

    // Emit scene entered
    this.bus.emit(GameEvents.SCENE_ENTERED, {
      mapKey: this.mapKey,
      displayName: MAP_DISPLAY_NAMES[this.mapKey] ?? { pl: this.mapKey, en: this.mapKey },
    });

    // Launch overlay scenes (sleep/wake pattern)
    if (!this.scene.isActive(SceneKey.DIALOGUE)) {
      this.scene.launch(SceneKey.DIALOGUE);
    }
    if (!this.scene.isActive(SceneKey.TRANSITION)) {
      this.scene.launch(SceneKey.TRANSITION);
    }
    if (!this.scene.isActive(SceneKey.EXAM)) {
      this.scene.launch(SceneKey.EXAM);
    }
    if (!this.scene.isActive(SceneKey.ARCADE)) {
      this.scene.launch(SceneKey.ARCADE);
    }

    // Listen for demo-end-screen event
    const onDemoEndScreen = () => {
      this.time.delayedCall(500, () => this.showEndScreen());
    };
    this.bus.on('demo-end-screen', onDemoEndScreen);

    // Periodic position capture (STATE_CHANGED → unified persistence handler saves)
    this.autoSaveTimer = this.time.addEvent({
      delay: SAVE_INTERVAL_MS,
      callback: () => {
        this.updateState((s) => ({
          position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
          facing: this.player.facing,
        }));
      },
      loop: true,
    });

    // Cinematic intro from level manifest
    const introConfig = getIntroConfig(this.mapKey);
    if (introConfig && !this.hasFlag(introConfig.flag)) {
      this.playCinematicIntro(introConfig);
    }

    // Cleanup on scene shutdown
    this.events.on('shutdown', () => {
      this.scale.off('resize', updateCameraForViewport);
      this.bus.off(GameEvents.TERMINAL_FOCUS_CHANGED, onTerminalFocus);
      this.bus.off(GameEvents.DIALOGUE_DISMISSED, onDialogueDismissed);
      this.bus.off(GameEvents.EXAM_DISMISSED, onExamDismissed);
      this.bus.off(GameEvents.ARCADE_DISMISSED, onArcadeDismissed);
      this.bus.off(GameEvents.FLAG_SET, onFlagSet);
      this.bus.off('demo-end-screen', onDemoEndScreen);
      this.autoSaveTimer?.destroy();
      // Capture final position (STATE_CHANGED → unified persistence handler saves)
      this.updateState((s) => ({
        position: { x: this.player.x - TILE_SIZE / 2, y: this.player.y - TILE_SIZE / 2 },
        facing: this.player.facing,
      }));
      this.interactiveObjects.forEach((obj) => obj.destroy());
      this.interactiveObjects = [];
      this.npcs.forEach((npc) => npc.destroy());
      this.npcs = [];
      this.npcGroup.destroy(true);
      this.interactionDetector.clear();
    });
  }

  update(): void {
    if (!this.player || this.introPlaying) return;

    this.player.update();

    const delta = this.game.loop.delta;
    for (const npc of this.npcs) {
      npc.update(delta);
    }

    // Skip interaction checks during dialogue
    if (this.inDialogue) {
      this.interactionPrompt.hide();
      return;
    }

    // Interaction proximity check (triggers, terminals, doors, npcs)
    const nearest = this.interactionDetector.getNearest(
      this.player.x,
      this.player.y,
      this.player.facing,
      this.flagsSet
    );

    if (nearest) {
      let promptLabel = t('scene.interactionLook');
      if (nearest.objectType === 'door') promptLabel = t('scene.interactionDoor');
      if (nearest.objectType === 'exam') promptLabel = t('scene.interactionExam');
      if (nearest.objectType === 'arcade') promptLabel = t('scene.interactionArcade');
      if (nearest.objectType === 'npc') promptLabel = t('scene.interactionNpc');
      this.interactionPrompt.show(nearest.centerX, nearest.centerY, promptLabel);

      if (this.inputController.isInteractJustPressed()) {
        this.handleInteraction(nearest);
      }
    } else {
      this.interactionPrompt.hide();
    }
  }

  private handleInteraction(obj: Interactable): void {
    devLog(`[GameScene] Interaction: ${obj.objectId} (${obj.objectType})`);

    switch (obj.objectType) {
      case 'npc': {
        obj.faceTowards?.(this.player.x, this.player.y);
        const dialogueId = this.resolveDialogueId(obj.objectId);
        this.startDialogue(dialogueId);
        break;
      }
      case 'trigger': {
        const dialogueId = this.resolveDialogueId(obj.objectId);
        this.startDialogue(dialogueId);
        break;
      }
      case 'terminal':
        devLog(`[GameScene] Terminal interaction: ${obj.objectId}`);
        this.startDialogue('terminal-first-use');
        break;
      case 'door': {
        const ioObj = obj as InteractiveObject;
        const requiredFlags = ioObj.requiredFlags;
        if (requiredFlags.length > 0) {
          const missingFlags = requiredFlags.filter((f) => !this.hasFlag(f));
          if (missingFlags.length > 0) {
            devLog(`[GameScene] Door ${obj.objectId} locked — missing flags: ${missingFlags.join(', ')}`);
            this.startDialogue(this.resolveDialogueId(obj.objectId));
            break;
          }
        }
        this.triggerDoorTransition(ioObj);
        break;
      }
      case 'arcade': {
        const ioObj = obj as InteractiveObject;
        const arcadeGameId = ioObj.properties['arcadeGameId'] as string;
        if (!arcadeGameId) {
          devLog(`[GameScene] Arcade zone ${obj.objectId} missing arcadeGameId property`);
          break;
        }
        this.inputController.setEnabled(false);
        this.player.enterState('cutscene');
        this.interactionPrompt.hide();
        this.npcs.forEach((npc) => npc.freeze());
        const arcadePayload: ArcadeShowPayload = {
          mapKey: this.mapKey,
          zoneId: obj.objectId,
          arcadeGameId,
        };
        devLog(
          `[GameScene] Arcade launch: map=${arcadePayload.mapKey}, zone=${arcadePayload.zoneId}, game=${arcadePayload.arcadeGameId}`
        );
        this.bus.emit(GameEvents.ARCADE_SHOW, arcadePayload);
        break;
      }
      case 'exam': {
        const ioObj = obj as InteractiveObject;
        const examId = ioObj.properties['examId'] as string;
        if (!examId) {
          devLog(`[GameScene] Exam zone ${obj.objectId} missing examId property`);
          break;
        }
        // Check if exam is already completed (all reward flags present)
        const examDef = getAllExams().get(examId);
        const examDone = examDef
          ? examDef.rewards.flags.every((f) => this.gameState.flags.includes(f))
          : false;
        if (examDone) {
          this.startDialogue(this.resolveDialogueId(obj.objectId));
        } else {
          this.inputController.setEnabled(false);
          this.player.enterState('cutscene');
          this.interactionPrompt.hide();
          this.npcs.forEach((npc) => npc.freeze());
          this.bus.emit(GameEvents.EXAM_SHOW, { examId });
        }
        break;
      }
    }
  }

  /** Resolve dialogue ID for an interaction using manifest routes */
  private resolveDialogueId(objectId: string): string {
    const routes = getInteractionRoutes(this.mapKey);
    const route = routes.find((r) => r.zoneId === objectId);

    if (!route) {
      // No route defined — fall back to objectId directly
      return objectId;
    }

    // Check flag variants in order — first match wins
    if (route.flagVariants) {
      for (const variant of route.flagVariants) {
        if (this.hasFlag(variant.flag)) {
          devLog(`[GameScene] Route resolved: ${objectId} → ${variant.dialogue} (flag: ${variant.flag})`);
          return variant.dialogue;
        }
      }
    }

    devLog(`[GameScene] Route resolved: ${objectId} → ${route.defaultDialogue} (default)`);
    return route.defaultDialogue;
  }

  private triggerDoorTransition(door: InteractiveObject): void {
    const targetMap = door.properties['targetMap'] as string;
    const spawnX = door.properties['spawnX'] as number;
    const spawnY = door.properties['spawnY'] as number;

    devLog(`[GameScene] Door transition: ${door.objectId} → ${targetMap} at (${spawnX}, ${spawnY})`);

    this.interactionPrompt.hide();
    this.player.enterState('cutscene');
    this.inputController.setEnabled(false);
    this.bus.emit(GameEvents.TRANSITION_START, { targetMap, spawnX, spawnY });
  }

  private startDialogue(dialogueId: string): void {
    this.inDialogue = true;
    this.player.enterState('dialogue');
    this.inputController.setEnabled(false);
    this.interactionPrompt.hide();
    this.npcs.forEach((npc) => npc.freeze());

    this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
  }

  getPlayer(): Astronaut {
    return this.player;
  }

  getInputController(): InputController {
    return this.inputController;
  }

  /** Toggle visibility of zone debug overlays. Returns new visibility state. */
  toggleZoneDebug(): boolean {
    const newVisible = this.zoneDebugRects.length > 0 && !this.zoneDebugRects[0]?.visible;
    for (const rect of this.zoneDebugRects) {
      rect.setVisible(newVisible);
    }
    return newVisible;
  }

  /** Get current visibility of zone debug overlays. */
  getZoneDebugVisible(): boolean {
    return this.zoneDebugRects.length > 0 && (this.zoneDebugRects[0]?.visible ?? false);
  }

  private playCinematicIntro(introConfig: { dialogueId: string; flag: GameFlag; cinematicTitle?: string; cinematicSubtitle?: string }): void {
    // No cinematic title card — go straight to dialogue without touching player state
    if (!introConfig.cinematicTitle) {
      this.setFlag(introConfig.flag);
      this.startDialogue(introConfig.dialogueId);
      devLog('[GameScene] Intro dialogue started (no cinematic card)');
      return;
    }

    this.introPlaying = true;
    this.player.setVisible(false);
    this.player.enterState('cutscene');
    this.inputController.setEnabled(false);

    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Black overlay (covers everything, fixed to camera)
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 1);

    // Title text
    const titleText = this.add
      .text(cx, cy - 20, introConfig.cinematicTitle, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 2)
      .setAlpha(0);

    // Subtitle text
    const subtitleText = this.add
      .text(cx, cy + 20, introConfig.cinematicSubtitle ?? '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 2)
      .setAlpha(0);

    // Sequence: fade in title, then subtitle, hold, fade out, reveal player
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.tweens.add({
          targets: subtitleText,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            // Hold for 2s, then fade everything out
            this.time.delayedCall(2000, () => {
              this.tweens.add({
                targets: [titleText, subtitleText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                  // Destroy text and original overlay — spotlight RT replaces it
                  titleText.destroy();
                  subtitleText.destroy();
                  overlay.destroy();

                  // Show player (hidden behind spotlight overlay)
                  this.player.setVisible(true);
                  this.player.setAlpha(1);

                  // Create spotlight overlay centered on player
                  const cam = this.cameras.main;
                  const spotlight = createSpotlightReveal({
                    scene: this,
                    centerX: this.player.x - cam.scrollX,
                    centerY: this.player.y - cam.scrollY,
                  });

                  // Start dialogue — spotlight stays dimmed until dialogue ends
                  const onDismissed = () => {
                    this.bus.off(GameEvents.DIALOGUE_DISMISSED, onDismissed);
                    spotlight.expand().then(() => {
                      this.introPlaying = false;
                      this.setFlag(introConfig.flag);
                      if (this.pendingLocaleSwap) {
                        this.pendingLocaleSwap = false;
                        this.refreshLocaleSensitiveText();
                      }
                    });
                  };
                  this.bus.on(GameEvents.DIALOGUE_DISMISSED, onDismissed);

                  this.startDialogue(introConfig.dialogueId);
                },
              });
            });
          },
        });
      },
    });
  }

  protected override onLocaleChanged(): void {
    if (this.introPlaying) {
      this.pendingLocaleSwap = true;
      devLog('[Locale] deferring swap (zone=intro-playing)');
      return;
    }
    this.refreshLocaleSensitiveText();
  }

  private refreshLocaleSensitiveText(): void {
    // Per-frame interaction prompts auto-refresh from update().
    if (this.endScreenTextObj) {
      const divider = '──────────────────────────';
      const lines = [
        divider,
        t('scene.endTitle'),
        divider,
        '',
        t('scene.endLine1'),
        t('scene.endLine2'),
        t('scene.endLine3'),
        t('scene.endLine4'),
        '',
        t('scene.endLine5'),
        t('scene.endLine6'),
        t('scene.endLine7'),
        '',
        divider,
        t('scene.endScheduleHeader'),
        t('scene.endScheduleLine'),
        divider,
      ];
      this.endScreenTextObj.setText(lines.join('\n'));
    }
    if (this.endScreenCtaText) {
      this.endScreenCtaText.setText(t('scene.endCta'));
    }
  }

  private showEndScreen(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark overlay
    const overlay = this.add
      .rectangle(cx, cy, width, height, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 1);

    // Panel background
    const panelW = 380;
    const panelH = 300;
    const panel = this.add
      .rectangle(cx, cy, panelW, panelH, 0x111111, 0.95)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 2)
      .setStrokeStyle(1, 0x00d4aa);

    // Panel text
    const divider = '──────────────────────────';
    const lines = [
      divider,
      t('scene.endTitle'),
      divider,
      '',
      t('scene.endLine1'),
      t('scene.endLine2'),
      t('scene.endLine3'),
      t('scene.endLine4'),
      '',
      t('scene.endLine5'),
      t('scene.endLine6'),
      t('scene.endLine7'),
      '',
      divider,
      t('scene.endScheduleHeader'),
      t('scene.endScheduleLine'),
      divider,
    ];

    const textObj = this.add
      .text(cx, cy - panelH / 2 + 20, lines.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#cccccc',
        align: 'center',
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 3);
    this.endScreenTextObj = textObj;

    // CTA button
    const ctaY = cy + panelH / 2 - 40;
    const ctaBg = this.add
      .rectangle(cx, ctaY, 200, 30, 0x00d4aa, 1)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 3)
      .setInteractive({ useHandCursor: true });

    const ctaText = this.add
      .text(cx, ctaY, t('scene.endCta'), {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#000000',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.TRANSITION + 4);
    this.endScreenCtaText = ctaText;

    ctaBg.on('pointerup', () => {
      window.open('https://10xdevs.pl', '_blank');
    });

    // Dismiss on Esc or click outside panel
    const dismiss = () => {
      overlay.destroy();
      panel.destroy();
      textObj.destroy();
      ctaBg.destroy();
      ctaText.destroy();
      this.endScreenTextObj = null;
      this.endScreenCtaText = null;
      this.input.keyboard?.off('keydown-ESC', dismiss);
    };

    this.input.keyboard?.on('keydown-ESC', dismiss);
    overlay.setInteractive();
    overlay.on('pointerup', dismiss);

    devLog('[GameScene] End screen shown');
  }

  private resolveSafeSpawnPosition(map: Phaser.Tilemaps.Tilemap): { x: number; y: number } {
    const result = sanitizeSpawnPosition(this.collisionGrid, {
      x: this.spawnX,
      y: this.spawnY,
    });

    if (result.corrected) {
      devLog(
        `[GameScene] Corrected invalid spawn for ${this.mapKey}: (${this.spawnX}, ${this.spawnY}) → (${result.position.x}, ${result.position.y})`
      );
      this.updateState(() => ({
        currentMap: this.mapKey,
        position: result.position,
      }));
    }

    return result.position;
  }

  private buildCollisionGrid(map: Phaser.Tilemaps.Tilemap): SpawnCollisionGrid {
    const collisions: boolean[][] = [];

    for (let tileY = 0; tileY < map.height; tileY += 1) {
      const row: boolean[] = [];
      for (let tileX = 0; tileX < map.width; tileX += 1) {
        row.push(this.wallLayer?.getTileAt(tileX, tileY)?.collides ?? false);
      }
      collisions.push(row);
    }

    return {
      width: map.width,
      height: map.height,
      collisions,
    };
  }
}
