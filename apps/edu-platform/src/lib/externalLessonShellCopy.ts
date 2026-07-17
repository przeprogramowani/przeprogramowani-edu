export type ExternalLessonShellLanguage = 'pl' | 'en';

export interface ExternalLessonShellLabels {
  htmlLang: ExternalLessonShellLanguage;
  downloadMarkdown: string;
  previous: string;
  next: string;
  lessons: string;
  sections: string;
  tableOfContents: string;
  courseContents: string;
  home: string;
  show: string;
  hide: string;
  close: string;
  collapseMenu: string;
  expandMenu: string;
  markdownTitle: string;
  inCourseSuffix: string;
  lessonSingular: string;
  lessonPlural: string;
}

export type ExternalLessonCountLabels = Pick<
  ExternalLessonShellLabels,
  'inCourseSuffix' | 'lessonSingular' | 'lessonPlural'
>;

const EXTERNAL_LESSON_SHELL_COPY: Record<ExternalLessonShellLanguage, ExternalLessonShellLabels> = {
  pl: {
    htmlLang: 'pl',
    downloadMarkdown: 'Pobierz Markdown',
    previous: 'Poprzednia',
    next: 'Następna',
    lessons: 'Lekcje',
    sections: 'Sekcje',
    tableOfContents: 'Spis treści',
    courseContents: 'Spis treści',
    home: 'Strona główna',
    show: 'Pokaż',
    hide: 'Ukryj',
    close: 'Zamknij',
    collapseMenu: 'Zwiń menu',
    expandMenu: 'Rozwiń menu',
    markdownTitle: 'Pobierz w formacie Markdown - czyste formatowanie tekstowe bez HTML',
    inCourseSuffix: 'w kursie',
    lessonSingular: 'lekcja',
    lessonPlural: 'lekcji',
  },
  en: {
    htmlLang: 'en',
    downloadMarkdown: 'Download Markdown',
    previous: 'Previous',
    next: 'Next',
    lessons: 'Lessons',
    sections: 'Sections',
    tableOfContents: 'Table of contents',
    courseContents: 'Table of contents',
    home: 'Home',
    show: 'Show',
    hide: 'Hide',
    close: 'Close',
    collapseMenu: 'Collapse menu',
    expandMenu: 'Expand menu',
    markdownTitle: 'Download in Markdown format',
    inCourseSuffix: 'in course',
    lessonSingular: 'lesson',
    lessonPlural: 'lessons',
  },
};

export const DEFAULT_EXTERNAL_LESSON_SHELL_LANGUAGE: ExternalLessonShellLanguage = 'pl';

export function getExternalLessonShellCopy(
  language: ExternalLessonShellLanguage = DEFAULT_EXTERNAL_LESSON_SHELL_LANGUAGE
): ExternalLessonShellLabels {
  return EXTERNAL_LESSON_SHELL_COPY[language] ?? EXTERNAL_LESSON_SHELL_COPY[DEFAULT_EXTERNAL_LESSON_SHELL_LANGUAGE];
}

export function formatExternalLessonCount(count: number, copy: ExternalLessonCountLabels): string {
  return `${count} ${count === 1 ? copy.lessonSingular : copy.lessonPlural}`;
}

export function formatExternalLessonsInCourseCount(count: number, copy: ExternalLessonCountLabels): string {
  return `${count} ${copy.inCourseSuffix}`;
}
