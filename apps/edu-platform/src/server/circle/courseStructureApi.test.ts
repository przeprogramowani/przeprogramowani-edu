import { describe, expect, it } from 'vitest';
import { sortLessonsForSection } from './courseStructureApi';
import type { LessonListItem } from './courseStructureTypes';

function lesson(
  id: number,
  name: string,
  overrides: Partial<LessonListItem> = {}
): LessonListItem {
  return {
    id,
    name,
    sectionId: 1,
    ...overrides,
  };
}

describe('sortLessonsForSection', () => {
  it('sorts by Circle position when available', () => {
    const lessons = [
      lesson(3, 'Third', { position: 3 }),
      lesson(1, 'First', { position: 1 }),
      lesson(2, 'Second', { position: 2 }),
    ];

    const sorted = sortLessonsForSection(lessons);

    expect(sorted.map((l) => l.id)).toEqual([1, 2, 3]);
  });

  it('falls back to numeric title prefixes when position is missing', () => {
    const lessons = [
      lesson(101, '[1x1] Intro'),
      lesson(103, '[1x3] Terminal'),
      lesson(105, '[1x5] Part 1'),
      lesson(107, '[1x7] Mindset'),
      lesson(102, '[1x2] IDE'),
      lesson(104, '[1x4] Agent'),
      lesson(106, '[1x6] Part 2'),
    ];

    const sorted = sortLessonsForSection(lessons);

    expect(sorted.map((l) => l.name)).toEqual([
      '[1x1] Intro',
      '[1x2] IDE',
      '[1x3] Terminal',
      '[1x4] Agent',
      '[1x5] Part 1',
      '[1x6] Part 2',
      '[1x7] Mindset',
    ]);
  });

  it('keeps non-prefixed lessons anchored while reordering prefixed lessons', () => {
    const lessons = [
      lesson(201, '[2x1] Plan'),
      lesson(299, 'Guide - Practice'),
      lesson(203, '[2x3] UI'),
      lesson(202, '[2x2] Bootstrap'),
    ];

    const sorted = sortLessonsForSection(lessons);

    expect(sorted.map((l) => l.name)).toEqual([
      '[2x1] Plan',
      'Guide - Practice',
      '[2x2] Bootstrap',
      '[2x3] UI',
    ]);
  });
});
