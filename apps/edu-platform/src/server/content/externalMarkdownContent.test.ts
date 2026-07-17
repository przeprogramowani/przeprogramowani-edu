import { describe, expect, it, vi } from 'vitest';
import {
  __testUtils,
  getExternalCourseLessonContent,
  getExternalMarkdownCourseStructure,
  getExternalMarkdownLesson,
  type ExternalMarkdownDependencies,
} from './externalMarkdownContent';
import type { CourseSlug } from '@/models/CollectionMappings';
import type { LessonCollection } from '@/models/LessonCollection';

type LocalMarkdownEntry = NonNullable<
  Awaited<ReturnType<ExternalMarkdownDependencies['getLessonFromCollection']>>
>;

function localEntry(id: string, name = `Lesson ${id}`, source: 'markdown' | 'html' = 'html'): LocalMarkdownEntry {
  return {
    id,
    data: {
      id,
      name,
      content: `<h2>${name}</h2><p>Body ${id}</p>`,
      lessonId: id,
      order: Number(id),
      source,
    },
  } as LocalMarkdownEntry;
}

function dependenciesWithMarkdown(
  entries: Record<string, ReturnType<typeof localEntry>>
): ExternalMarkdownDependencies {
  return {
    getLessonFromCollection: vi.fn(async (_collection: LessonCollection, lessonId: string) => entries[lessonId] ?? null),
    getLessonsForCollection: vi.fn(async () => Object.values(entries)),
    getCircleLessonContent: vi.fn(async (courseId: CourseSlug, lessonId: string) => ({
      lesson: {
        id: lessonId,
        data: {
          id: lessonId,
          name: `Circle ${courseId} ${lessonId}`,
          content: '<p>Circle body</p>',
        },
      },
      headings: [],
    })),
  };
}

describe('externalMarkdownContent', () => {
  // Regression guard for local collection-backed content:
  // 10xdevs-3 resolves local HTML before Circle, localized prework resolves by language, and
  // 10xdevs-2 remains Circle-backed.
  it('preserves the local collection mapping baseline', () => {
    expect(__testUtils.getMarkdownCollection('10xdevs-3')).toBe('lessons10xDevs3');
    expect(__testUtils.getMarkdownCollection('10xdevs-3', 'pl')).toBe('lessons10xDevs3');
    expect(__testUtils.getMarkdownCollection('10xdevs-3', 'en')).toBe('lessons10xDevs3En');
    expect(__testUtils.getMarkdownCollection('10xdevs-3-prework', 'pl')).toBe('lessons10xDevs3Prework');
    expect(__testUtils.getMarkdownCollection('10xdevs-3-prework', 'en')).toBe('lessons10xDevs3PreworkEn');
    expect(__testUtils.getMarkdownCollection('10xdevs-3-prework')).toBe('lessons10xDevs3Prework');
    expect(__testUtils.getMarkdownCollection('10xdevs-2')).toBeNull();
  });

  it('resolves localized prework local HTML by course, language, and lessonId', async () => {
    const dependencies = dependenciesWithMarkdown({
      '02': localEntry('02', 'Prework lesson'),
    });

    const lesson = await getExternalMarkdownLesson(
      { courseId: '10xdevs-3-prework', language: 'pl', lessonId: '02' },
      dependencies
    );

    expect(dependencies.getLessonFromCollection).toHaveBeenCalledWith('lessons10xDevs3Prework', '02');
    expect(lesson?.source).toBe('html');
    expect(lesson?.lesson.data.name).toBe('Prework lesson');
    expect(lesson?.lesson.data.content).toContain('id="prework-lesson"');
    expect(lesson?.headings[0].text).toBe('Prework lesson');
  });

  it('uses local HTML-backed 10xdevs-3 lessons before Circle', async () => {
    const dependencies = dependenciesWithMarkdown({
      '01': localEntry('01', 'Main course HTML'),
    });

    const lesson = await getExternalCourseLessonContent('10xdevs-3', '01', undefined, dependencies);

    expect(dependencies.getLessonFromCollection).toHaveBeenCalledWith('lessons10xDevs3', '01');
    expect(dependencies.getCircleLessonContent).not.toHaveBeenCalled();
    expect(lesson.source).toBe('html');
    expect(lesson.lesson.data.name).toBe('Main course HTML');
  });

  it('preserves explicit HTML source on 10xdevs-3 lessons before Circle', async () => {
    const dependencies = dependenciesWithMarkdown({
      '02': localEntry('02', 'Main course HTML', 'html'),
    });

    const lesson = await getExternalCourseLessonContent('10xdevs-3', '02', undefined, dependencies);

    expect(dependencies.getLessonFromCollection).toHaveBeenCalledWith('lessons10xDevs3', '02');
    expect(dependencies.getCircleLessonContent).not.toHaveBeenCalled();
    expect(lesson.source).toBe('html');
    expect(lesson.lesson.data.name).toBe('Main course HTML');
  });

  it('falls back to Circle when 10xdevs-3 has no local lesson', async () => {
    const dependencies = dependenciesWithMarkdown({});

    const lesson = await getExternalCourseLessonContent('10xdevs-3', '999', undefined, dependencies);

    expect(dependencies.getLessonFromCollection).toHaveBeenCalledWith('lessons10xDevs3', '999');
    expect(dependencies.getCircleLessonContent).toHaveBeenCalledWith('10xdevs-3', '999', undefined);
    expect(lesson.source).toBe('circle');
  });

  it('keeps HTML/Circle-backed 10xdevs-2 on the existing Circle path', async () => {
    const dependencies = dependenciesWithMarkdown({});

    const lesson = await getExternalCourseLessonContent('10xdevs-2', '123', undefined, dependencies);

    expect(dependencies.getLessonFromCollection).not.toHaveBeenCalled();
    expect(dependencies.getCircleLessonContent).toHaveBeenCalledWith('10xdevs-2', '123', undefined);
    expect(lesson.source).toBe('circle');
    expect(lesson.lesson.data.name).toBe('Circle 10xdevs-2 123');
  });

  it('builds Markdown course structure for configured resources and returns null for unsupported courses', async () => {
    const dependencies = dependenciesWithMarkdown({
      '02': localEntry('02', 'Second'),
      '01': localEntry('01', 'First'),
    });

    const structure = await getExternalMarkdownCourseStructure('10xdevs-3', undefined, dependencies);
    const unsupported = await getExternalMarkdownCourseStructure('10xdevs-2', undefined, dependencies);

    expect(structure?.lessons.map((lesson) => lesson.id)).toEqual(['01', '02']);
    expect(structure?.sections[0].name).toBe('Moduł 1: Agentic Environment');
    expect(unsupported).toBeNull();
  });

  it('returns English section names for 10xdevs-3 course structure with en language', async () => {
    const dependencies = dependenciesWithMarkdown({
      '01': localEntry('01', 'First'),
    });

    const structure = await getExternalMarkdownCourseStructure('10xdevs-3', 'en', dependencies);

    expect(dependencies.getLessonsForCollection).toHaveBeenCalledWith('lessons10xDevs3En');
    expect(structure?.sections[0].name).toBe('Module 1: Agentic Environment');
  });
});
