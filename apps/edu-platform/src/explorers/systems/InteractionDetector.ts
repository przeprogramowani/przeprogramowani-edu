import { INTERACTION_RADIUS, TILE_SIZE } from '../config/constants';
import type { FacingDirection } from '../state/types';

export interface Interactable {
  readonly objectId: string;
  readonly objectType: string;
  readonly centerX: number;
  readonly centerY: number;
  readonly requiredFlag: string | undefined;
  faceTowards?: (targetX: number, targetY: number) => void;
}

export class InteractionDetector {
  private interactables: Interactable[] = [];

  register(obj: Interactable): void {
    this.interactables.push(obj);
  }

  registerAll(objects: Interactable[]): void {
    this.interactables.push(...objects);
  }

  clear(): void {
    this.interactables = [];
  }

  /** Find the closest interactable within range of the player's facing point */
  getNearest(
    playerX: number,
    playerY: number,
    facing: FacingDirection,
    flags: Set<string>
  ): Interactable | null {
    // Calculate the point in front of the player
    let probeX = playerX;
    let probeY = playerY;
    const offset = TILE_SIZE * 0.6;

    switch (facing) {
      case 'up':
        probeY -= offset;
        break;
      case 'down':
        probeY += offset;
        break;
      case 'left':
        probeX -= offset;
        break;
      case 'right':
        probeX += offset;
        break;
    }

    let closest: Interactable | null = null;
    // Compare squared distances to avoid Math.sqrt per interactable
    let closestDistSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

    for (const obj of this.interactables) {
      const dx = probeX - obj.centerX;
      const dy = probeY - obj.centerY;
      const distSq = dx * dx + dy * dy;

      if (distSq < closestDistSq) {
        // Skip objects with unmet flag requirements
        if (obj.requiredFlag && !flags.has(obj.requiredFlag)) {
          // Still interactable, but shows different dialogue (handled by caller)
        }
        closest = obj;
        closestDistSq = distSq;
      }
    }

    return closest;
  }

  getAll(): Interactable[] {
    return this.interactables;
  }
}
