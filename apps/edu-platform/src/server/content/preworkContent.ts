import type { CollectionEntry } from 'astro:content';
import type { LessonCollection } from '@/models/LessonCollection';
import type { CourseSection } from '@/server/circle/courseStructureTypes';
import { getLessonFromCourseCollection, getLessonsForCourseCollection } from './courseContent';
export { getPreworkLessonListItems, type PreworkLessonListItem } from './preworkLessonList';

export const PREWORK_COURSE_ID = '10xdevs-3-prework';
export type PreworkLanguage = 'pl' | 'en';

type PreworkLessonEntry = CollectionEntry<LessonCollection>;

const PREWORK_COLLECTION_BY_LANGUAGE: Record<PreworkLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3Prework',
  en: 'lessons10xDevs3PreworkEn',
};

export function isPreworkLanguage(language: string | undefined): language is PreworkLanguage {
  return language === 'pl' || language === 'en';
}

export async function getPreworkLessons(language: PreworkLanguage): Promise<PreworkLessonEntry[]> {
  return getLessonsForCourseCollection(PREWORK_COLLECTION_BY_LANGUAGE[language]);
}

export async function getPreworkLesson(
  language: PreworkLanguage,
  lessonId: string
): Promise<PreworkLessonEntry | null> {
  return getLessonFromCourseCollection(
    PREWORK_COLLECTION_BY_LANGUAGE[language],
    lessonId
  );
}

export function getAdjacentPreworkLessonIds(
  lessons: PreworkLessonEntry[],
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

export function getPreworkCourseSections(language: PreworkLanguage): CourseSection[] {
  return [
    {
      id: 1,
      name: language === 'pl' ? 'Prework' : 'Prework',
      position: 1,
    },
  ];
}
