import { describe, expect, it, vi } from 'vitest';

vi.mock('./courseContent', () => ({
  getLessonsForCourseCollection: vi.fn(async () => []),
  getLessonFromCourseCollection: vi.fn(async () => null),
}));

import {
  isMainCourseLanguage,
  getMainCourseSections,
  getAdjacentMainCourseLessonIds,
  getMainCourseCollectionForLanguage,
  formatMainCourseLessonCount,
  MAIN_COURSE_ID,
} from './mainCourseContent';

describe('mainCourseContent', () => {
  describe('MAIN_COURSE_ID', () => {
    it('is 10xdevs-3', () => {
      expect(MAIN_COURSE_ID).toBe('10xdevs-3');
    });
  });

  describe('isMainCourseLanguage', () => {
    it('returns true for pl', () => {
      expect(isMainCourseLanguage('pl')).toBe(true);
    });

    it('returns true for en', () => {
      expect(isMainCourseLanguage('en')).toBe(true);
    });

    it('returns false for unsupported languages', () => {
      expect(isMainCourseLanguage('fr')).toBe(false);
      expect(isMainCourseLanguage('de')).toBe(false);
      expect(isMainCourseLanguage('')).toBe(false);
      expect(isMainCourseLanguage(undefined)).toBe(false);
    });
  });

  describe('getMainCourseSections', () => {
    it('returns Polish section names for pl', () => {
      const sections = getMainCourseSections('pl');
      expect(sections).toHaveLength(5);
      expect(sections[0]).toEqual({ id: 1, name: 'Moduł 1: Agentic Environment', position: 1 });
      expect(sections[4]).toEqual({ id: 5, name: 'Moduł 5: AI-Native Teamwork', position: 5 });
    });

    it('returns English section names for en', () => {
      const sections = getMainCourseSections('en');
      expect(sections).toHaveLength(5);
      expect(sections[0]).toEqual({ id: 1, name: 'Module 1: Agentic Environment', position: 1 });
      expect(sections[4]).toEqual({ id: 5, name: 'Module 5: AI-Native Teamwork', position: 5 });
    });

    it('preserves module topic names across languages', () => {
      const plSections = getMainCourseSections('pl');
      const enSections = getMainCourseSections('en');
      for (let i = 0; i < plSections.length; i++) {
        const plTopic = plSections[i].name.split(': ')[1];
        const enTopic = enSections[i].name.split(': ')[1];
        expect(plTopic).toBe(enTopic);
      }
    });
  });

  describe('getMainCourseCollectionForLanguage', () => {
    it('returns PL collection for pl', () => {
      expect(getMainCourseCollectionForLanguage('pl')).toBe('lessons10xDevs3');
    });

    it('returns EN collection for en', () => {
      expect(getMainCourseCollectionForLanguage('en')).toBe('lessons10xDevs3En');
    });
  });

  describe('formatMainCourseLessonCount', () => {
    it('handles Polish singular (1)', () => {
      expect(formatMainCourseLessonCount(1, 'pl')).toBe('1 lekcja dostępna');
    });

    it('handles Polish few (2-4)', () => {
      expect(formatMainCourseLessonCount(2, 'pl')).toBe('2 lekcje dostępne');
      expect(formatMainCourseLessonCount(3, 'pl')).toBe('3 lekcje dostępne');
      expect(formatMainCourseLessonCount(4, 'pl')).toBe('4 lekcje dostępne');
    });

    it('handles Polish many (5+)', () => {
      expect(formatMainCourseLessonCount(0, 'pl')).toBe('0 lekcji dostępnych');
      expect(formatMainCourseLessonCount(5, 'pl')).toBe('5 lekcji dostępnych');
      expect(formatMainCourseLessonCount(21, 'pl')).toBe('21 lekcji dostępnych');
    });

    it('handles English singular', () => {
      expect(formatMainCourseLessonCount(1, 'en')).toBe('1 lesson available');
    });

    it('handles English plural', () => {
      expect(formatMainCourseLessonCount(0, 'en')).toBe('0 lessons available');
      expect(formatMainCourseLessonCount(2, 'en')).toBe('2 lessons available');
      expect(formatMainCourseLessonCount(5, 'en')).toBe('5 lessons available');
      expect(formatMainCourseLessonCount(21, 'en')).toBe('21 lessons available');
    });
  });

  describe('getAdjacentMainCourseLessonIds', () => {
    const lessons = [
      { id: '01' },
      { id: '02' },
      { id: '03' },
    ] as Parameters<typeof getAdjacentMainCourseLessonIds>[0];

    it('returns both neighbors for a middle lesson', () => {
      expect(getAdjacentMainCourseLessonIds(lessons, '02')).toEqual({
        prevLessonId: '01',
        nextLessonId: '03',
      });
    });

    it('returns null prev for the first lesson', () => {
      expect(getAdjacentMainCourseLessonIds(lessons, '01')).toEqual({
        prevLessonId: null,
        nextLessonId: '02',
      });
    });

    it('returns null next for the last lesson', () => {
      expect(getAdjacentMainCourseLessonIds(lessons, '03')).toEqual({
        prevLessonId: '02',
        nextLessonId: null,
      });
    });

    it('returns both null for unknown lesson', () => {
      expect(getAdjacentMainCourseLessonIds(lessons, '99')).toEqual({
        prevLessonId: null,
        nextLessonId: null,
      });
    });
  });
});
