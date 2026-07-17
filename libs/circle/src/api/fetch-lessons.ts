import type { Course } from '../types';

const API_URL = 'https://app.circle.so';

const headers = (token: string) => ({
  Authorization: `Token ${token}`,
});

interface LessonData {
  id: number;
  name: string;
  body_html: string;
  section_id: number;
  created_at: string;
  updated_at: string;
}

const lessonPredicates = [(lesson: LessonData) => !lesson.name.toLowerCase().includes('quiz')];

function isNewestVersion(lesson: LessonData, allLessons: LessonData[]): boolean {
  const lessonsWithSameName = allLessons.filter((l) => l.name === lesson.name);

  if (lessonsWithSameName.length <= 1) {
    return true;
  }

  // If there's another lesson with the same name that has a newer updated_at, skip this one
  const newestLesson = lessonsWithSameName.reduce((newest, current) => {
    const currentDate = new Date(current.updated_at);
    const newestDate = new Date(newest.updated_at);
    return currentDate > newestDate ? current : newest;
  });

  return lesson.id === newestLesson.id;
}

function extractValidLessons(lessons: LessonData[]): LessonData[] {
  return lessons
    .filter((lesson) => {
      // Apply all simple predicates
      const passesSimplePredicates = lessonPredicates.every((predicate) => predicate(lesson));
      if (!passesSimplePredicates) {
        return false;
      }

      // Apply cross-checking predicates
      return isNewestVersion(lesson, lessons);
    })
    .map((lesson) => ({
      id: lesson.id,
      name: lesson.name,
      body_html: lesson.body_html,
      section_id: lesson.section_id,
      created_at: lesson.created_at,
      updated_at: lesson.updated_at,
    }));
}

/**
 * Fetches lessons for a specific section from Circle API
 * Uses native fetch for compatibility with both Node.js and Cloudflare Workers
 */
export async function fetchLessonsForSection(
  token: string,
  spaceId: number,
  sectionId: number,
  status: 'draft' | 'published'
): Promise<LessonData[]> {
  const params = new URLSearchParams({
    space_id: spaceId.toString(),
    section_id: sectionId.toString(),
    status,
  });

  const response = await fetch(`${API_URL}/api/admin/v2/course_lessons?${params}`, {
    method: 'GET',
    headers: headers(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}`);
  }

  // Use .text() for proper UTF-8 handling in Cloudflare Workers
  const textContent = await response.text();
  const lessons: Course = JSON.parse(textContent);

  return extractValidLessons(lessons.records);
}

export type { LessonData };
