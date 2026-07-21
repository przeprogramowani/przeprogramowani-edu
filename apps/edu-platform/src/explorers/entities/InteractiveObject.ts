import Phaser from 'phaser';
import { DEPTH } from '../config/constants';

export interface InteractiveObjectConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  objectId: string;
  objectType: 'trigger' | 'door' | 'terminal' | 'exam' | 'arcade' | 'navigation';
  eventId?: string;
  properties: Record<string, unknown>;
}

export class InteractiveObject {
  readonly objectId: string;
  readonly objectType: 'trigger' | 'door' | 'terminal' | 'exam' | 'arcade' | 'navigation';
  readonly eventId: string;
  readonly properties: Record<string, unknown>;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;

  private zone: Phaser.GameObjects.Zone;

  constructor(config: InteractiveObjectConfig) {
    this.objectId = config.objectId;
    this.objectType = config.objectType;
    this.eventId = config.eventId ?? config.objectId;
    this.properties = config.properties;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.centerX = config.x + config.width / 2;
    this.centerY = config.y + config.height / 2;

    this.zone = config.scene.add.zone(
      this.centerX,
      this.centerY,
      config.width,
      config.height
    );
    this.zone.setDepth(DEPTH.OBJECTS);
  }

  get requiredFlag(): string | undefined {
    return this.properties['requiredFlag'] as string | undefined;
  }

  /** Comma-separated required flags (AND logic). Empty array = no requirements. */
  get requiredFlags(): string[] {
    const raw = this.properties['requiredFlags'] as string | undefined;
    if (!raw) return [];
    return raw.split(',').map((f) => f.trim()).filter(Boolean);
  }

  getZone(): Phaser.GameObjects.Zone {
    return this.zone;
  }

  destroy(): void {
    this.zone.destroy();
  }
}
