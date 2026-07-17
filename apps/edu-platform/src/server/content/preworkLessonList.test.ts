import { describe, expect, it } from 'vitest';
import { formatPreworkLessonCount, getPreworkLessonListItems } from './preworkLessonList';

describe('getPreworkLessonListItems', () => {
  it('preserves zero-padded lesson IDs for localized navigation links', () => {
    const items = getPreworkLessonListItems([
      {
        id: '02',
        data: {
          name: 'Second lesson',
          order: 2,
        },
      },
    ]);

    expect(items[0]).toMatchObject({
      id: '02',
      name: 'Second lesson',
      position: 2,
      sectionId: 1,
    });
  });
});

describe('formatPreworkLessonCount', () => {
  it('formats Polish lesson counts for prework index descriptions', () => {
    expect(formatPreworkLessonCount(1, 'pl')).toBe('1 lekcja');
    expect(formatPreworkLessonCount(2, 'pl')).toBe('2 lekcje');
    expect(formatPreworkLessonCount(5, 'pl')).toBe('5 lekcji');
  });

  it('formats English lesson counts for prework index descriptions', () => {
    expect(formatPreworkLessonCount(1, 'en')).toBe('1 lesson');
    expect(formatPreworkLessonCount(16, 'en')).toBe('16 lessons');
  });
});
