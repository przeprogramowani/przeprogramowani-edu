/**
 * Checks if a lesson name indicates it's a quiz lesson.
 * Quiz lessons contain "[QUIZ]" in their name.
 */
export function isQuizLesson(lessonName: string): boolean {
  return lessonName.includes('[QUIZ]');
}

/**
 * Filters out quiz lessons from an array.
 * Works with any object that has a 'name' property.
 */
export function filterOutQuizLessons<T extends { name: string }>(lessons: T[]): T[] {
  return lessons.filter((lesson) => !isQuizLesson(lesson.name));
}
