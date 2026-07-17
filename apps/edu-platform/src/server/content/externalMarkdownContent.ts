import type { CollectionEntry } from 'astro:content';
import type { CourseSlug } from '@/models/CollectionMappings';
import type { LessonCollection } from '@/models/LessonCollection';
import type { LessonEntry } from '@/models/LessonEntry';
import type { CourseStructure } from '@/server/circle/courseStructureTypes';
import type { TocItem } from '@/types/toc';
import { extractHeadingsFromHtml } from '@/utils/extractHeadingsFromHtml';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';

type MarkdownLessonEntry = CollectionEntry<LessonCollection>;
type SupportedLanguage = 'pl' | 'en';

const PREWORK_COURSE_ID = '10xdevs-3-prework';
const MAIN_COURSE_ID = '10xdevs-3';

interface Env {
  PLATFORM_LESSON_CACHE?: KVNamespace;
}

type CircleLessonContent = (
  courseId: CourseSlug,
  lessonId: string,
  env?: Env
) => Promise<{ lesson: LessonEntry; headings: TocItem[] }>;

export interface ExternalMarkdownDependencies {
  getLessonFromCollection: (
    collection: LessonCollection,
    lessonId: string
  ) => Promise<MarkdownLessonEntry | null>;
  getLessonsForCollection: (collection: LessonCollection) => Promise<MarkdownLessonEntry[]>;
  getCircleLessonContent: CircleLessonContent;
}

interface MarkdownLookup {
  courseId: CourseSlug;
  lessonId: string;
  language?: SupportedLanguage;
}

export interface ExternalLessonContent {
  lesson: LessonEntry;
  headings: TocItem[];
  source: 'markdown' | 'html' | 'circle';
}

const defaultDependencies: ExternalMarkdownDependencies = {
  getLessonFromCollection: async (collection, lessonId) => {
    const { getLessonFromCourseCollection } = await import('./courseContent');
    return getLessonFromCourseCollection(collection, lessonId);
  },
  getLessonsForCollection: async (collection) => {
    const { getLessonsForCourseCollection } = await import('./courseContent');
    return getLessonsForCourseCollection(collection);
  },
  getCircleLessonContent: async (courseId, lessonId, env) => {
    const { getLessonContent } = await import('@/server/circle/circleClient');
    return getLessonContent(courseId, lessonId, env);
  },
};

const MAIN_COURSE_COLLECTIONS: Record<SupportedLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3',
  en: 'lessons10xDevs3En',
};

const PREWORK_COLLECTIONS: Record<SupportedLanguage, LessonCollection> = {
  pl: 'lessons10xDevs3Prework',
  en: 'lessons10xDevs3PreworkEn',
};

const LANGUAGE_AWARE_COURSES: Record<string, Record<SupportedLanguage, LessonCollection>> = {
  [MAIN_COURSE_ID]: MAIN_COURSE_COLLECTIONS,
  [PREWORK_COURSE_ID]: PREWORK_COLLECTIONS,
};

function getMarkdownCollection(courseId: CourseSlug, language?: SupportedLanguage): LessonCollection | null {
  const langMap = LANGUAGE_AWARE_COURSES[courseId];
  if (langMap) {
    return language ? langMap[language] : langMap['pl'];
  }

  return null;
}

function toLessonNumber(entry: MarkdownLessonEntry): number {
  return Number(entry.data.lessonId ?? entry.id);
}

const MAIN_COURSE_SECTION_RANGES: { id: number; lessonRange: [number, number] }[] = [
  { id: 1, lessonRange: [1, 5] },
  { id: 2, lessonRange: [6, 10] },
  { id: 3, lessonRange: [11, 15] },
  { id: 4, lessonRange: [16, 20] },
  { id: 5, lessonRange: [21, 25] },
];

const MAIN_COURSE_SECTION_NAMES: Record<SupportedLanguage, string[]> = {
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

function getMainCourseSection(
  lessonNumber: number,
  language: SupportedLanguage = 'pl'
): { id: number; name: string } {
  const range = MAIN_COURSE_SECTION_RANGES.find(
    (s) => lessonNumber >= s.lessonRange[0] && lessonNumber <= s.lessonRange[1]
  );

  if (!range) {
    return { id: 0, name: 'Lessons' };
  }

  return { id: range.id, name: MAIN_COURSE_SECTION_NAMES[language][range.id - 1] };
}

function toExternalMarkdownLesson(entry: MarkdownLessonEntry): ExternalLessonContent {
  const { headings: flatHeadings, modifiedHtml } = extractHeadingsFromHtml(entry.data.content);
  const toc = buildCompleteToc(flatHeadings);
  const source = entry.data.source === 'html' ? 'html' : 'markdown';

  return {
    source,
    lesson: {
      id: entry.id,
      data: {
        id: entry.id,
        name: entry.data.name,
        content: modifiedHtml,
      },
    },
    headings: toc.tree,
  };
}

function normalizeEntryId(lessonId: string): string {
  return lessonId.padStart(2, '0');
}

export async function getExternalMarkdownLesson(
  lookup: MarkdownLookup,
  dependencies: ExternalMarkdownDependencies = defaultDependencies
): Promise<ExternalLessonContent | null> {
  const collection = getMarkdownCollection(lookup.courseId, lookup.language);

  if (!collection) {
    return null;
  }

  const entryId = normalizeEntryId(lookup.lessonId);
  const lesson = await dependencies.getLessonFromCollection(collection, entryId);

  return lesson ? toExternalMarkdownLesson(lesson) : null;
}

export async function getExternalCourseLessonContent(
  courseId: CourseSlug,
  lessonId: string,
  env?: Env,
  dependencies: ExternalMarkdownDependencies = defaultDependencies
): Promise<ExternalLessonContent> {
  const markdownLesson = await getExternalMarkdownLesson({ courseId, lessonId }, dependencies);

  if (markdownLesson) {
    return markdownLesson;
  }

  const circleLesson = await dependencies.getCircleLessonContent(courseId, lessonId, env);

  return {
    ...circleLesson,
    source: 'circle',
  };
}

export async function getExternalMarkdownCourseStructure(
  courseId: CourseSlug,
  language?: SupportedLanguage,
  dependencies: ExternalMarkdownDependencies = defaultDependencies
): Promise<CourseStructure | null> {
  const collection = getMarkdownCollection(courseId, language);

  if (!collection) {
    return null;
  }

  const isMainCourse = courseId === MAIN_COURSE_ID;
  const lessons = await dependencies.getLessonsForCollection(collection);
  const lessonItems = lessons
    .map((lesson, index) => {
      const lessonNum = toLessonNumber(lesson);
      const section = isMainCourse
        ? getMainCourseSection(lessonNum, language ?? 'pl')
        : { id: 1, name: 'Prework' };
      return {
        id: lesson.id,
        numericId: lessonNum,
        name: lesson.data.name,
        position: lesson.data.order ?? index + 1,
        sectionId: section.id,
        sectionName: section.name,
      };
    })
    .filter((lesson) => Number.isFinite(lesson.numericId));

  if (lessonItems.length === 0) {
    return null;
  }

  const sectionIds = [...new Set(lessonItems.map((l) => l.sectionId))];
  const sections = sectionIds.map((id) => ({
    id,
    name: lessonItems.find((l) => l.sectionId === id)!.sectionName!,
    position: id,
  }));

  return {
    courseId,
    spaceId: 0,
    sections,
    lessons: lessonItems.sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0) || a.numericId - b.numericId
    ),
    cachedAt: Date.now(),
  };
}

export const __testUtils = {
  getMarkdownCollection,
  toExternalMarkdownLesson,
};
