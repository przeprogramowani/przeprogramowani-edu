import { SceneKey } from '../config/sceneRegistry';
import { COLORS, WALK_FRAME_RATE, NPC_TYPE_ROWS, NPC_SPRITE_COLS, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT } from '../config/constants';
import { devLog } from '../utils/logger';
import { BaseScene } from './BaseScene';
import { audioManager } from '../audio/AudioManager';

export class PreloaderScene extends BaseScene {
  constructor() {
    super({ key: SceneKey.PRELOADER });
  }

  preload(): void {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Title text
    this.add
      .text(cx, cy - 60, '10x EXPLORERS', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#00d4aa',
      })
      .setOrigin(0.5);

    // Progress bar background
    const barW = 240;
    const barH = 16;
    const barX = cx - barW / 2;
    const barY = cy;

    this.add
      .rectangle(cx, barY + barH / 2, barW, barH)
      .setStrokeStyle(1, COLORS.TEAL)
      .setOrigin(0.5);

    const progressFill = this.add.rectangle(barX + 2, barY + 2, 0, barH - 4, COLORS.TEAL).setOrigin(0, 0);

    // Progress text
    const progressText = this.add
      .text(cx, barY + barH + 20, '0%', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Load global assets
    this.load.spritesheet('astronaut', '/game/sprites/astronaut.png', {
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
    });
    this.load.spritesheet('npc-characters', '/game/sprites/npc-characters.png', {
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
    });
    this.load.image('tileset-placeholder', '/game/tilesets/placeholder.png');

    // Queue audio assets
    audioManager.preloadAssets(this);

    this.load.on('progress', (value: number) => {
      progressFill.width = (barW - 4) * value;
      progressText.setText(`${Math.round(value * 100)}%`);
    });
  }

  create(): void {
    devLog('[PreloaderScene] Assets loaded');

    // Register walk animations
    const directions = ['down', 'left', 'right', 'up'];
    directions.forEach((dir, rowIndex) => {
      const start = rowIndex * 4;
      this.anims.create({
        key: `walk-${dir}`,
        frames: this.anims.generateFrameNumbers('astronaut', {
          start,
          end: start + 3,
        }),
        frameRate: WALK_FRAME_RATE,
        repeat: -1,
      });
    });
    devLog('[PreloaderScene] Walk animations registered');

    // Register NPC walk animations — 4 frames per direction
    // Layout: directions as rows (up=0, down=1, left=2, right=3),
    //         characters as column blocks of 4 frames each
    // Frame index = dirRow * NPC_SPRITE_COLS + charIdx * 4
    const npcDirRows = [
      { dir: 'up',    row: 0 },
      { dir: 'down',  row: 1 },
      { dir: 'left',  row: 2 },
      { dir: 'right', row: 3 },
    ] as const;
    for (const [typeName, charIdx] of Object.entries(NPC_TYPE_ROWS)) {
      for (const { dir, row: dirRow } of npcDirRows) {
        const start = dirRow * NPC_SPRITE_COLS + charIdx * 4;
        this.anims.create({
          key: `npc-${typeName}-walk-${dir}`,
          frames: this.anims.generateFrameNumbers('npc-characters', { start, end: start + 3 }),
          frameRate: WALK_FRAME_RATE,
          repeat: -1,
        });
      }
    }
    devLog('[PreloaderScene] NPC animations registered');

    const state = this.gameState;

    // Start GameScene with current map from state
    this.scene.start(SceneKey.GAME, {
      mapKey: state.currentMap,
      spawnX: state.position.x,
      spawnY: state.position.y,
    });

  }
}
