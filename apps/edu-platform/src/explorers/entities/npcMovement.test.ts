// These tests define the expected behavior for NPC movement state machine (Phase 2).
// They will fail until pure helpers are extracted from NPC.ts
// into ./npcMovement.ts.
// Run with: npm run test:explorers

import { describe, it, expect } from 'vitest';
import {
  isBlockedInTravelDirection,
  updateMovement,
  freezeMotion,
  unfreezeMotion,
  computeFacing,
  MOVEMENT_EPSILON,
  type NpcMotionState,
} from './npcMovement';
import {
  NPC_WALL_BLOCKED_GRACE_MS,
  NPC_WALL_RECOVERY_MIN_MS,
  NPC_WALL_CLEAR_STABLE_MS,
  NPC_SPEED,
  NPC_IDLE_AFTER_UNFREEZE_MS,
} from '../config/constants';

// ── Test fixtures ──

function noBlocked() {
  return { left: false, right: false, up: false, down: false };
}

function wanderingState(overrides: Partial<NpcMotionState> = {}): NpcMotionState {
  return {
    movementState: 'wandering',
    stateTimer: 2000,
    blockedTimer: 0,
    clearTimer: 0,
    moveX: 1,
    moveY: 0,
    ...overrides,
  };
}

function wallRecoveryState(overrides: Partial<NpcMotionState> = {}): NpcMotionState {
  return {
    movementState: 'wallRecovery',
    stateTimer: NPC_WALL_RECOVERY_MIN_MS,
    blockedTimer: 0,
    clearTimer: 0,
    moveX: 1,
    moveY: 0,
    ...overrides,
  };
}

// ── isBlockedInTravelDirection ──

describe('isBlockedInTravelDirection', () => {
  it('returns true when blocked in the direction of travel', () => {
    const blocked = { ...noBlocked(), right: true };
    expect(isBlockedInTravelDirection(blocked, 1, 0)).toBe(true);
  });

  it('returns false when blocked in a direction other than travel', () => {
    const blocked = { ...noBlocked(), left: true };
    expect(isBlockedInTravelDirection(blocked, 1, 0)).toBe(false);
  });

  it('returns false when movement is below epsilon', () => {
    const blocked = { ...noBlocked(), right: true };
    expect(isBlockedInTravelDirection(blocked, MOVEMENT_EPSILON / 2, 0)).toBe(false);
  });
});

// ── Wall recovery — grace window and entry ──

describe('wall recovery entry', () => {
  it('does not enter wall recovery on first blocked frame', () => {
    const state = wanderingState();
    const blocked = { ...noBlocked(), right: true };
    const result = updateMovement(state, blocked, 16, NPC_SPEED);
    expect(result.state.movementState).toBe('wandering');
    expect(result.state.blockedTimer).toBe(16);
  });

  it('enters wall recovery after blocked grace period expires', () => {
    const state = wanderingState({ blockedTimer: NPC_WALL_BLOCKED_GRACE_MS - 1 });
    const blocked = { ...noBlocked(), right: true };
    const result = updateMovement(state, blocked, 16, NPC_SPEED);
    expect(result.state.movementState).toBe('wallRecovery');
  });

  it('sets velocity to zero on entering wall recovery', () => {
    const state = wanderingState({ blockedTimer: NPC_WALL_BLOCKED_GRACE_MS });
    const blocked = { ...noBlocked(), right: true };
    const result = updateMovement(state, blocked, 16, NPC_SPEED);
    expect(result.velocityX).toBe(0);
    expect(result.velocityY).toBe(0);
  });
});

// ── Wall recovery — staying and exiting ──

describe('wall recovery hold and exit', () => {
  it('stays in wall recovery while still blocked after minimum duration', () => {
    const state = wallRecoveryState({ stateTimer: 0 });
    const blocked = { ...noBlocked(), right: true };
    const result = updateMovement(state, blocked, 16, NPC_SPEED);
    expect(result.state.movementState).toBe('wallRecovery');
    expect(result.state.clearTimer).toBe(0);
  });

  it('exits wall recovery only after clear for stability window', () => {
    const state = wallRecoveryState({
      stateTimer: 0,
      clearTimer: NPC_WALL_CLEAR_STABLE_MS - 1,
    });
    const blocked = noBlocked();
    const result = updateMovement(state, blocked, 16, NPC_SPEED);
    // clearTimer should have accumulated past the threshold
    expect(result.state.movementState).not.toBe('wallRecovery');
  });
});

// ── Freeze / unfreeze ──

describe('freeze and unfreeze', () => {
  it('freeze resets all timers and zeroes movement', () => {
    const state = freezeMotion();
    expect(state.movementState).toBe('frozen');
    expect(state.stateTimer).toBe(0);
    expect(state.blockedTimer).toBe(0);
    expect(state.clearTimer).toBe(0);
    expect(state.moveX).toBe(0);
    expect(state.moveY).toBe(0);
  });

  it('unfreeze transitions to idle with configured delay', () => {
    const state = unfreezeMotion();
    expect(state.movementState).toBe('idle');
    expect(state.stateTimer).toBe(NPC_IDLE_AFTER_UNFREEZE_MS);
  });
});

// ── faceTowards direction computation ──

describe('computeFacing', () => {
  it('picks the dominant axis for facing direction', () => {
    // Horizontal dominant
    expect(computeFacing(10, 5)).toBe('right');
    expect(computeFacing(-10, 5)).toBe('left');
    // Vertical dominant
    expect(computeFacing(5, 10)).toBe('down');
    expect(computeFacing(5, -10)).toBe('up');
    // Equal magnitude — horizontal wins
    expect(computeFacing(10, 10)).toBe('right');
    expect(computeFacing(-10, -10)).toBe('left');
  });
});
