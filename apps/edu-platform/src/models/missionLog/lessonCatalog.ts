export type MissionLogModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5';

export interface MissionLogLesson {
  lessonId: string;
  title: string;
  moduleId: MissionLogModuleId;
  order: number;
  badgeId: number;
}

// Placeholder titles. Replace with actual 10xDevs 3.0 lesson titles before launch.
// Invariants enforced by lessonCatalog.test.ts:
//   - exactly 25 entries, 5 per module
//   - lessonId values are unique
//   - badgeId values are a permutation of 1..25
//   - within each module, order is 1..5
export const MISSION_LOG_LESSON_CATALOG: readonly MissionLogLesson[] = [
  // Module 1
  { lessonId: 'm1-l1', title: 'Utworzenie PRD', moduleId: 'm1', order: 1, badgeId: 1 },
  { lessonId: 'm1-l2', title: 'Konfiguracja Skilli', moduleId: 'm1', order: 2, badgeId: 2 },
  { lessonId: 'm1-l3', title: 'Bootstrap Projektu', moduleId: 'm1', order: 3, badgeId: 3 },
  { lessonId: 'm1-l4', title: 'Przygotowanie Reguł', moduleId: 'm1', order: 4, badgeId: 4 },
  { lessonId: 'm1-l5', title: 'Pierwsze Wdrożenie', moduleId: 'm1', order: 5, badgeId: 5 },
  // Module 2
  { lessonId: 'm2-l1', title: 'Moduł 2, Lekcja 1', moduleId: 'm2', order: 1, badgeId: 6 },
  { lessonId: 'm2-l2', title: 'Moduł 2, Lekcja 2', moduleId: 'm2', order: 2, badgeId: 7 },
  { lessonId: 'm2-l3', title: 'Moduł 2, Lekcja 3', moduleId: 'm2', order: 3, badgeId: 8 },
  { lessonId: 'm2-l4', title: 'Moduł 2, Lekcja 4', moduleId: 'm2', order: 4, badgeId: 9 },
  { lessonId: 'm2-l5', title: 'Moduł 2, Lekcja 5', moduleId: 'm2', order: 5, badgeId: 10 },
  // Module 3
  { lessonId: 'm3-l1', title: 'Moduł 3, Lekcja 1', moduleId: 'm3', order: 1, badgeId: 11 },
  { lessonId: 'm3-l2', title: 'Moduł 3, Lekcja 2', moduleId: 'm3', order: 2, badgeId: 12 },
  { lessonId: 'm3-l3', title: 'Moduł 3, Lekcja 3', moduleId: 'm3', order: 3, badgeId: 13 },
  { lessonId: 'm3-l4', title: 'Moduł 3, Lekcja 4', moduleId: 'm3', order: 4, badgeId: 14 },
  { lessonId: 'm3-l5', title: 'Moduł 3, Lekcja 5', moduleId: 'm3', order: 5, badgeId: 15 },
  // Module 4
  { lessonId: 'm4-l1', title: 'Moduł 4, Lekcja 1', moduleId: 'm4', order: 1, badgeId: 16 },
  { lessonId: 'm4-l2', title: 'Moduł 4, Lekcja 2', moduleId: 'm4', order: 2, badgeId: 17 },
  { lessonId: 'm4-l3', title: 'Moduł 4, Lekcja 3', moduleId: 'm4', order: 3, badgeId: 18 },
  { lessonId: 'm4-l4', title: 'Moduł 4, Lekcja 4', moduleId: 'm4', order: 4, badgeId: 19 },
  { lessonId: 'm4-l5', title: 'Moduł 4, Lekcja 5', moduleId: 'm4', order: 5, badgeId: 20 },
  // Module 5
  { lessonId: 'm5-l1', title: 'Moduł 5, Lekcja 1', moduleId: 'm5', order: 1, badgeId: 21 },
  { lessonId: 'm5-l2', title: 'Moduł 5, Lekcja 2', moduleId: 'm5', order: 2, badgeId: 22 },
  { lessonId: 'm5-l3', title: 'Moduł 5, Lekcja 3', moduleId: 'm5', order: 3, badgeId: 23 },
  { lessonId: 'm5-l4', title: 'Moduł 5, Lekcja 4', moduleId: 'm5', order: 4, badgeId: 24 },
  { lessonId: 'm5-l5', title: 'Moduł 5, Lekcja 5', moduleId: 'm5', order: 5, badgeId: 25 },
];

export function findMissionLogLesson(lessonId: string): MissionLogLesson | undefined {
  return MISSION_LOG_LESSON_CATALOG.find((l) => l.lessonId === lessonId);
}
