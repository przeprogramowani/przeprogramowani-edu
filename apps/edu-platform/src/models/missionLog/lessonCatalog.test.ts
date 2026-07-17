import { describe, expect, it } from 'vitest';
import { MISSION_LOG_LESSON_CATALOG, type MissionLogModuleId } from './lessonCatalog';

describe('MISSION_LOG_LESSON_CATALOG', () => {
  it('has exactly 25 entries', () => {
    expect(MISSION_LOG_LESSON_CATALOG).toHaveLength(25);
  });

  it('has unique lessonId values', () => {
    const ids = MISSION_LOG_LESSON_CATALOG.map((l) => l.lessonId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('badgeId values are a permutation of 1..25', () => {
    const badgeIds = MISSION_LOG_LESSON_CATALOG.map((l) => l.badgeId).sort((a, b) => a - b);
    expect(badgeIds).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it('has exactly 5 lessons per module', () => {
    const modules: MissionLogModuleId[] = ['m1', 'm2', 'm3', 'm4', 'm5'];
    for (const m of modules) {
      const inModule = MISSION_LOG_LESSON_CATALOG.filter((l) => l.moduleId === m);
      expect(inModule).toHaveLength(5);
    }
  });

  it('within each module, order is 1..5', () => {
    const modules: MissionLogModuleId[] = ['m1', 'm2', 'm3', 'm4', 'm5'];
    for (const m of modules) {
      const orders = MISSION_LOG_LESSON_CATALOG.filter((l) => l.moduleId === m)
        .map((l) => l.order)
        .sort((a, b) => a - b);
      expect(orders).toEqual([1, 2, 3, 4, 5]);
    }
  });
});
