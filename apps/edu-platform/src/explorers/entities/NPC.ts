import Phaser from 'phaser';
import {
  WALK_FRAME_RATE,
  PLAYER_SPEED,
  NPC_SPEED,
  NPC_WANDER_TIMER_MIN,
  NPC_WANDER_TIMER_MAX,
  NPC_IDLE_CHANCE,
  NPC_IDLE_DURATION_MIN,
  NPC_IDLE_DURATION_MAX,
  NPC_WALL_RECOVERY_MIN_MS,
  NPC_COLOR_VARIANTS,
  NPC_TYPE_ROWS,
  NPC_SPRITE_COLS,
  PLAYER_BODY_WIDTH,
  PLAYER_BODY_HEIGHT,
  PLAYER_BODY_OFFSET_X,
  PLAYER_BODY_OFFSET_Y,
} from '../config/constants';
import type { FacingDirection } from '../state/types';
import type { ActorMovementBounds } from '../state/actorMovementBounds';
import type { NpcBlendMode } from '../config/constants';
import { isActorPositionWithinBounds } from '../state/actorMovementBounds';
import { actorDepth } from './actorDepth';
import {
  updateMovement,
  freezeMotion,
  unfreezeMotion,
  computeFacing,
  MOVEMENT_EPSILON,
  type NpcMotionState,
  type NpcMovementState,
  type BlockedFlags,
} from './npcMovement';

// Spritesheet layout: directions as rows, characters as column blocks (4 frames each)
// row 0 = up, row 1 = down, row 2 = left, row 3 = right
const NPC_DIR_ROW: Record<FacingDirection, number> = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

const NPC_BLEND_MODES: Record<NpcBlendMode, number> = {
  add: Phaser.BlendModes.ADD,
  screen: Phaser.BlendModes.SCREEN,
};

function idleFrame(charIdx: number, facing: FacingDirection): number {
  return NPC_DIR_ROW[facing] * NPC_SPRITE_COLS + charIdx * 4;
}

function randomDuration(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomDirection(): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

export class NPC extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string;
  readonly npcTypeName: string;
  private readonly npcCharIdx: number;
  private readonly speed: number;
  private readonly frameRate: number;
  private readonly movementBounds?: ActorMovementBounds;
  private facing: FacingDirection = 'down';
  private motionState: NpcMotionState;
  private lastAllowedPosition: { x: number; y: number };
  private hasAllowedPosition = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    npcId: string,
    npcTypeName = 'scientist',
    npcVariantName?: string,
    movementBounds?: ActorMovementBounds,
  ) {
    const charIdx = NPC_TYPE_ROWS[npcTypeName] ?? 0;
    // Initial frame: first frame of down direction for this character
    super(scene, x, y, 'npc-characters', idleFrame(charIdx, 'down'));

    scene.add.existing(this as Phaser.GameObjects.GameObject);
    scene.physics.add.existing(this as Phaser.GameObjects.GameObject);

    this.npcId = npcId;
    this.npcTypeName = npcTypeName;
    this.npcCharIdx = charIdx;
    this.speed = NPC_SPEED;
    this.movementBounds = movementBounds;
    this.lastAllowedPosition = { x, y };
    this.hasAllowedPosition = movementBounds
      ? isActorPositionWithinBounds(movementBounds, this.lastAllowedPosition)
      : true;
    // Scale animation frame rate proportionally to movement speed
    this.frameRate = Math.max(1, Math.round((this.speed / PLAYER_SPEED) * WALK_FRAME_RATE));

    // Same body config as Astronaut — proportional to frame
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT);
    body.setOffset(PLAYER_BODY_OFFSET_X, PLAYER_BODY_OFFSET_Y);
    body.setCollideWorldBounds(true);
    body.setImmovable(false);

    const colorVariant = npcVariantName ? NPC_COLOR_VARIANTS[npcVariantName] : undefined;
    if (colorVariant?.mode === 'fill') {
      this.setTintFill(colorVariant.color);
    } else if (colorVariant) {
      this.setTint(colorVariant.color);
    }
    if (colorVariant?.blendMode) {
      this.setBlendMode(NPC_BLEND_MODES[colorVariant.blendMode]);
    }

    this.setDepth(actorDepth(this.y));

    // Initialize motion state and stagger initial wander decisions
    this.motionState = {
      movementState: 'idle',
      stateTimer: 0,
      blockedTimer: 0,
      clearTimer: 0,
      moveX: 0,
      moveY: 0,
    };
    this.startWandering(Math.random() * NPC_WANDER_TIMER_MAX);
  }

  // Interactable interface — dynamic position getters
  get objectId(): string {
    return this.npcId;
  }

  get objectType(): 'npc' {
    return 'npc';
  }

  get centerX(): number {
    return this.x;
  }

  get centerY(): number {
    return this.y;
  }

  get requiredFlag(): undefined {
    return undefined;
  }

  freeze(): void {
    this.motionState = freezeMotion();
    this.stopMoving();
    if (this.anims.isPlaying) {
      this.stop();
    }
    this.setFrame(idleFrame(this.npcCharIdx, this.facing));
  }

  unfreeze(): void {
    this.motionState = unfreezeMotion();
    this.stopMoving();
  }

  faceTowards(targetX: number, targetY: number): void {
    this.facing = computeFacing(targetX - this.x, targetY - this.y);

    if (this.anims.isPlaying) {
      this.stop();
    }

    this.setFrame(idleFrame(this.npcCharIdx, this.facing));
  }

  update(delta: number): void {
    this.enforceMovementBounds();
    this.setDepth(actorDepth(this.y));

    const body = this.body as Phaser.Physics.Arcade.Body;
    const prevState = this.motionState.movementState;

    const blocked: BlockedFlags = {
      left: body.blocked.left,
      right: body.blocked.right,
      up: body.blocked.up,
      down: body.blocked.down,
    };
    const result = updateMovement(this.motionState, blocked, delta, this.speed);
    this.motionState = result.state;
    body.setVelocity(result.velocityX, result.velocityY);
    body.setImmovable(result.immovable);

    if (result.state.movementState !== prevState) {
      this.traceStateTransition(prevState, result.state.movementState);
    }

    if (result.needsNewPhase) {
      if (prevState === 'idle') {
        this.startWandering();
      } else {
        this.chooseNextMovementPhase();
      }
    }

    this.updateFacing(body);

    // Play walk animation or show idle frame
    if (body.velocity.x === 0 && body.velocity.y === 0) {
      if (this.anims.isPlaying) {
        this.stop();
        this.setFrame(idleFrame(this.npcCharIdx, this.facing));
      }
    } else {
      const animKey = `npc-${this.npcTypeName}-walk-${this.facing}`;
      if (!this.anims.isPlaying || this.anims.currentAnim?.key !== animKey) {
        const anim = this.scene.anims.get(animKey);
        if (anim && anim.frames.length > 0) {
          this.play({ key: animKey, frameRate: this.frameRate });
        }
      }
    }
  }

  private updateFacing(body: Phaser.Physics.Arcade.Body): void {
    if (
      Math.abs(body.velocity.x) <= MOVEMENT_EPSILON &&
      Math.abs(body.velocity.y) <= MOVEMENT_EPSILON
    ) {
      return;
    }

    this.facing = computeFacing(body.velocity.x, body.velocity.y);
  }

  private chooseNextMovementPhase(): void {
    if (Math.random() < NPC_IDLE_CHANCE) {
      this.enterIdle(randomDuration(NPC_IDLE_DURATION_MIN, NPC_IDLE_DURATION_MAX));
      return;
    }

    this.startWandering();
  }

  private startWandering(duration = randomDuration(NPC_WANDER_TIMER_MIN, NPC_WANDER_TIMER_MAX)): void {
    const direction = randomDirection();
    const previousState = this.motionState.movementState;
    this.motionState = {
      movementState: 'wandering',
      stateTimer: duration,
      blockedTimer: 0,
      clearTimer: 0,
      moveX: direction.x,
      moveY: direction.y,
    };
    this.traceStateTransition(previousState, 'wandering');
  }

  private enterIdle(duration: number): void {
    const previousState = this.motionState.movementState;
    this.motionState = {
      movementState: 'idle',
      stateTimer: duration,
      blockedTimer: 0,
      clearTimer: 0,
      moveX: 0,
      moveY: 0,
    };
    this.stopMoving();
    this.traceStateTransition(previousState, 'idle');
  }

  private enterWallRecovery(): void {
    const previousState = this.motionState.movementState;
    this.motionState = {
      movementState: 'wallRecovery',
      stateTimer: NPC_WALL_RECOVERY_MIN_MS,
      blockedTimer: 0,
      clearTimer: 0,
      moveX: this.motionState.moveX,
      moveY: this.motionState.moveY,
    };
    this.stopMoving();
    this.traceStateTransition(previousState, 'wallRecovery');
  }

  private stopMoving(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  private enforceMovementBounds(): void {
    if (!this.movementBounds) {
      return;
    }

    const currentPosition = { x: this.x, y: this.y };

    if (isActorPositionWithinBounds(this.movementBounds, currentPosition)) {
      this.lastAllowedPosition = currentPosition;
      this.hasAllowedPosition = true;
      return;
    }

    if (!this.hasAllowedPosition) {
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(this.lastAllowedPosition.x, this.lastAllowedPosition.y);
    this.setDepth(actorDepth(this.y));

    if (this.motionState.movementState !== 'frozen') {
      this.enterWallRecovery();
      return;
    }

    this.stopMoving();
  }

  private traceStateTransition(from: NpcMovementState, to: NpcMovementState): void {
    if (from === to) {
      return;
    }
  }
}
