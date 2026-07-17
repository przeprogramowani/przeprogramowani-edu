import { describe, it, expect } from 'vitest';
import { isQuizLesson, filterOutQuizLessons } from './lessonFilter';

describe('isQuizLesson', () => {
  it('returns true for lessons with [QUIZ] in name', () => {
    expect(isQuizLesson('[QUIZ] Module Test')).toBe(true);
    expect(isQuizLesson('Module 1 [QUIZ]')).toBe(true);
    expect(isQuizLesson('Module [QUIZ] Test')).toBe(true);
  });

  it('returns false for regular lessons', () => {
    expect(isQuizLesson('Introduction to TypeScript')).toBe(false);
    expect(isQuizLesson('Variables and Types')).toBe(false);
    expect(isQuizLesson('Quiz about Types')).toBe(false); // No brackets
  });

  it('is case sensitive', () => {
    expect(isQuizLesson('[quiz] Test')).toBe(false);
    expect(isQuizLesson('[Quiz] Test')).toBe(false);
  });
});

describe('filterOutQuizLessons', () => {
  it('filters out lessons with [QUIZ] in name', () => {
    const lessons = [
      { id: 1, name: 'Intro' },
      { id: 2, name: '[QUIZ] Test 1' },
      { id: 3, name: 'Chapter 2' },
      { id: 4, name: 'Final [QUIZ]' },
    ];

    const result = filterOutQuizLessons(lessons);

    expect(result).toHaveLength(2);
    expect(result.map((l) => l.id)).toEqual([1, 3]);
  });

  it('returns empty array when all are quizzes', () => {
    const lessons = [
      { id: 1, name: '[QUIZ] Test 1' },
      { id: 2, name: '[QUIZ] Test 2' },
    ];

    expect(filterOutQuizLessons(lessons)).toEqual([]);
  });

  it('returns all lessons when none are quizzes', () => {
    const lessons = [
      { id: 1, name: 'Intro' },
      { id: 2, name: 'Chapter 1' },
    ];

    expect(filterOutQuizLessons(lessons)).toEqual(lessons);
  });

  it('handles empty array', () => {
    expect(filterOutQuizLessons([])).toEqual([]);
  });

  it('preserves all properties of filtered lessons', () => {
    const lessons = [
      { id: 1, name: 'Intro', position: 1, sectionId: 100 },
      { id: 2, name: '[QUIZ] Test', position: 2, sectionId: 100 },
      { id: 3, name: 'Chapter 1', position: 3, sectionId: 200 },
    ];

    const result = filterOutQuizLessons(lessons);

    expect(result).toEqual([
      { id: 1, name: 'Intro', position: 1, sectionId: 100 },
      { id: 3, name: 'Chapter 1', position: 3, sectionId: 200 },
    ]);
  });
});
