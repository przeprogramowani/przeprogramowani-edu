import type { CollectionEntry } from 'astro:content';
import type { LessonCollection } from '@/models/LessonCollection';
import type { CourseSection } from '@/server/circle/courseStructureTypes';
import { getLessonFromCourseCollection, getLessonsForCourseCollection } from './courseContent';

export const MAIN_COURSE_ID = '10xdevs-3';
export type MainCourseLanguage = 'pl' | 'en';

type MainCourseLessonEntry = CollectionEntry<LessonCollection>;

const MAIN_COURSE_COLLECTION_BY_LANGUAGE: Record<MainCourseLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3',
  en: 'lessons10xDevs3En',
};

export function isMainCourseLanguage(language: string | undefined): language is MainCourseLanguage {
  return language === 'pl' || language === 'en';
}

export async function getMainCourseLessons(
  language: MainCourseLanguage
): Promise<MainCourseLessonEntry[]> {
  return getLessonsForCourseCollection(MAIN_COURSE_COLLECTION_BY_LANGUAGE[language]);
}

export async function getMainCourseLesson(
  language: MainCourseLanguage,
  lessonId: string
): Promise<MainCourseLessonEntry | null> {
  return getLessonFromCourseCollection(MAIN_COURSE_COLLECTION_BY_LANGUAGE[language], lessonId);
}

export function getAdjacentMainCourseLessonIds(
  lessons: MainCourseLessonEntry[],
  activeLessonId: string
): { prevLessonId: string | null; nextLessonId: string | null } {
  const activeIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);

  if (activeIndex === -1) {
    return { prevLessonId: null, nextLessonId: null };
  }

  return {
    prevLessonId: activeIndex > 0 ? lessons[activeIndex - 1].id : null,
    nextLessonId: activeIndex < lessons.length - 1 ? lessons[activeIndex + 1].id : null,
  };
}

const SECTION_NAMES: Record<MainCourseLanguage, string[]> = {
  pl: [
    'Moduł 1: Agentic Environment',
    'Moduł 2: 10xWorkflow',
    'Moduł 3: AI Development Quality & Maintenance',
    'Moduł 4: Large scale & legacy projects',
    'Moduł 5: AI-Native Teamwork',
  ],
  en: [
    'Module 1: Agentic Environment',
    'Module 2: 10xWorkflow',
    'Module 3: AI Development Quality & Maintenance',
    'Module 4: Large scale & legacy projects',
    'Module 5: AI-Native Teamwork',
  ],
};

export function getMainCourseSections(language: MainCourseLanguage): CourseSection[] {
  return SECTION_NAMES[language].map((name, index) => ({
    id: index + 1,
    name,
    position: index + 1,
  }));
}

export function getMainCourseCollectionForLanguage(language: MainCourseLanguage): LessonCollection {
  return MAIN_COURSE_COLLECTION_BY_LANGUAGE[language];
}

export function formatMainCourseLessonCount(count: number, language: MainCourseLanguage): string {
  if (language === 'en') {
    return count === 1 ? '1 lesson available' : `${count} lessons available`;
  }

  if (count === 1) {
    return '1 lekcja dostępna';
  }

  if (count > 1 && count < 5) {
    return `${count} lekcje dostępne`;
  }

  return `${count} lekcji dostępnych`;
}
