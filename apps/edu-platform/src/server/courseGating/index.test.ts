import { describe, expect, it } from 'vitest';
import {
  getModuleStatuses,
  getNextUnlockAt,
  isModuleUnlocked,
  loadCourseGatingConfig,
} from './index';
import { TEN_X_DEVS_3_GATING } from './tenXDevs3';

describe('courseGating', () => {
  const config = TEN_X_DEVS_3_GATING;

  it('returns all locked before m1 unlock', () => {
    const now = new Date('2026-05-17T23:59:59+02:00');
    const statuses = getModuleStatuses(config, now);
    expect(statuses.every((s) => !s.unlocked)).toBe(true);
  });

  it('unlocks m1 exactly at its unlock timestamp', () => {
    const now = new Date('2026-05-18T00:00:00+02:00');
    expect(isModuleUnlocked(config, 'm1', now)).toBe(true);
    expect(isModuleUnlocked(config, 'm2', now)).toBe(false);
    expect(isModuleUnlocked(config, 'm5', now)).toBe(false);
  });

  it('unlocks m1..m3 between m3 and m4', () => {
    const now = new Date('2026-06-05T12:00:00+02:00');
    expect(isModuleUnlocked(config, 'm1', now)).toBe(true);
    expect(isModuleUnlocked(config, 'm2', now)).toBe(true);
    expect(isModuleUnlocked(config, 'm3', now)).toBe(true);
    expect(isModuleUnlocked(config, 'm4', now)).toBe(false);
    expect(isModuleUnlocked(config, 'm5', now)).toBe(false);
  });

  it('unlocks every module after m5', () => {
    const now = new Date('2026-06-16T00:00:00+02:00');
    const statuses = getModuleStatuses(config, now);
    expect(statuses.every((s) => s.unlocked)).toBe(true);
  });

  it('getNextUnlockAt returns null when everything is unlocked', () => {
    const now = new Date('2026-07-01T00:00:00+02:00');
    expect(getNextUnlockAt(config, now)).toBeNull();
  });

  it('getNextUnlockAt returns the soonest pending module', () => {
    const now = new Date('2026-05-26T00:00:00+02:00');
    expect(getNextUnlockAt(config, now)).toBe('2026-06-01T00:00:00+02:00');
  });

  it('isModuleUnlocked returns false for unknown module id', () => {
    expect(isModuleUnlocked(config, 'nonexistent', new Date('2030-01-01T00:00:00+02:00'))).toBe(
      false,
    );
  });

  it('loadCourseGatingConfig returns the 10xdevs-3 config', () => {
    expect(loadCourseGatingConfig('10xdevs-3')).toBe(TEN_X_DEVS_3_GATING);
  });

  it('loadCourseGatingConfig throws for unregistered course slug', () => {
    expect(() => loadCourseGatingConfig('cursor-ai')).toThrow();
  });
});
