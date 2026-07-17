export interface PreworkLessonListItem {
  id: string;
  name: string;
  position?: number;
  sectionId: number;
  sectionName?: string;
}

export type PreworkLessonListLanguage = 'pl' | 'en';

interface PreworkLessonListSource {
  id: string;
  data: {
    name: string;
    order?: number;
  };
}

export function getPreworkLessonListItems(
  lessons: PreworkLessonListSource[]
): PreworkLessonListItem[] {
  return lessons.map((lesson, index) => ({
    id: lesson.id,
    name: lesson.data.name,
    position: lesson.data.order ?? index + 1,
    sectionId: 1,
    sectionName: 'Prework',
  }));
}

export function formatPreworkLessonCount(count: number, language: PreworkLessonListLanguage): string {
  if (language === 'en') {
    return count === 1 ? '1 lesson' : `${count} lessons`;
  }

  if (count === 1) {
    return '1 lekcja';
  }

  if (count > 1 && count < 5) {
    return `${count} lekcje`;
  }

  return `${count} lekcji`;
}
