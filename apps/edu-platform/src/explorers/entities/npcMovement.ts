import type { FacingDirection } from '../state/types';
import {
  NPC_WALL_BLOCKED_GRACE_MS,
  NPC_WALL_RECOVERY_MIN_MS,
  NPC_WALL_CLEAR_STABLE_MS,
  NPC_IDLE_AFTER_UNFREEZE_MS,
} from '../config/constants';

export const MOVEMENT_EPSILON = 0.001;

export type NpcMovementState = 'wandering' | 'idle' | 'wallRecovery' | 'frozen';

export interface BlockedFlags {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface NpcMotionState {
  movementState: NpcMovementState;
  stateTimer: number;
  blockedTimer: number;
  clearTimer: number;
  moveX: number;
  moveY: number;
}

export interface UpdateMovementResult {
  state: NpcMotionState;
  velocityX: number;
  velocityY: number;
  immovable: boolean;
  needsNewPhase: boolean;
}

export function isBlockedInTravelDirection(
  blocked: BlockedFlags,
  moveX: number,
  moveY: number,
): boolean {
  return (
    (moveX < -MOVEMENT_EPSILON && blocked.left) ||
    (moveX > MOVEMENT_EPSILON && blocked.right) ||
    (moveY < -MOVEMENT_EPSILON && blocked.up) ||
    (moveY > MOVEMENT_EPSILON && blocked.down)
  );
}

export function computeFacing(dx: number, dy: number): FacingDirection {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx < 0 ? 'left' : 'right';
  }
  return dy < 0 ? 'up' : 'down';
}

export function freezeMotion(): NpcMotionState {
  return {
    movementState: 'frozen',
    stateTimer: 0,
    blockedTimer: 0,
    clearTimer: 0,
    moveX: 0,
    moveY: 0,
  };
}

export function unfreezeMotion(): NpcMotionState {
  return {
    movementState: 'idle',
    stateTimer: NPC_IDLE_AFTER_UNFREEZE_MS,
    blockedTimer: 0,
    clearTimer: 0,
    moveX: 0,
    moveY: 0,
  };
}

export function updateMovement(
  state: NpcMotionState,
  blocked: BlockedFlags,
  delta: number,
  speed: number,
): UpdateMovementResult {
  switch (state.movementState) {
    case 'frozen':
      return {
        state,
        velocityX: 0,
        velocityY: 0,
        immovable: true,
        needsNewPhase: false,
      };

    case 'idle': {
      const newTimer = state.stateTimer - delta;
      if (newTimer <= 0) {
        return {
          state: { ...state, stateTimer: 0 },
          velocityX: 0,
          velocityY: 0,
          immovable: false,
          needsNewPhase: true,
        };
      }
      return {
        state: { ...state, stateTimer: newTimer },
        velocityX: 0,
        velocityY: 0,
        immovable: false,
        needsNewPhase: false,
      };
    }

    case 'wandering': {
      const newTimer = state.stateTimer - delta;
      const isBlocked = isBlockedInTravelDirection(blocked, state.moveX, state.moveY);

      let newBlockedTimer = state.blockedTimer;

      if (isBlocked) {
        newBlockedTimer += delta;
        if (newBlockedTimer >= NPC_WALL_BLOCKED_GRACE_MS) {
          const recoveryState: NpcMotionState = {
            movementState: 'wallRecovery',
            stateTimer: NPC_WALL_RECOVERY_MIN_MS,
            blockedTimer: 0,
            clearTimer: 0,
            moveX: state.moveX,
            moveY: state.moveY,
          };
          return {
            state: recoveryState,
            velocityX: 0,
            velocityY: 0,
            immovable: true,
            needsNewPhase: false,
          };
        }
      } else {
        newBlockedTimer = 0;
      }

      if (newTimer <= 0) {
        return {
          state: { ...state, stateTimer: 0, blockedTimer: newBlockedTimer },
          velocityX: state.moveX * speed,
          velocityY: state.moveY * speed,
          immovable: false,
          needsNewPhase: true,
        };
      }

      return {
        state: { ...state, stateTimer: newTimer, blockedTimer: newBlockedTimer },
        velocityX: state.moveX * speed,
        velocityY: state.moveY * speed,
        immovable: false,
        needsNewPhase: false,
      };
    }

    case 'wallRecovery': {
      const stillBlocked = isBlockedInTravelDirection(blocked, state.moveX, state.moveY);
      let newStateTimer = state.stateTimer;
      if (newStateTimer > 0) {
        newStateTimer = Math.max(0, newStateTimer - delta);
      }

      if (newStateTimer > 0) {
        return {
          state: { ...state, stateTimer: newStateTimer },
          velocityX: 0,
          velocityY: 0,
          immovable: true,
          needsNewPhase: false,
        };
      }

      if (stillBlocked) {
        return {
          state: { ...state, stateTimer: 0, clearTimer: 0 },
          velocityX: 0,
          velocityY: 0,
          immovable: true,
          needsNewPhase: false,
        };
      }

      const newClearTimer = state.clearTimer + delta;
      if (newClearTimer >= NPC_WALL_CLEAR_STABLE_MS) {
        return {
          state: {
            movementState: 'idle',
            stateTimer: 0,
            blockedTimer: 0,
            clearTimer: 0,
            moveX: 0,
            moveY: 0,
          },
          velocityX: 0,
          velocityY: 0,
          immovable: false,
          needsNewPhase: true,
        };
      }

      return {
        state: { ...state, stateTimer: 0, clearTimer: newClearTimer },
        velocityX: 0,
        velocityY: 0,
        immovable: true,
        needsNewPhase: false,
      };
    }
  }
}
