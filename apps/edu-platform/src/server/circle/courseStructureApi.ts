import { getTokenForPlatform } from '@edu/circle/tokens';
import { getExternalAuthConfig, type ExternalAuthEnv } from './externalAuthConfig';
import { filterOutQuizLessons } from '@/utils/lessonFilter';
import type {
  CourseSection,
  CourseStructure,
  LessonListItem,
  CircleCourseSectionRecord,
  CircleCourseLessonRecord,
  CirclePaginatedResponse,
} from './courseStructureTypes';

const CIRCLE_V2_API_URL = 'https://app.circle.so/api/admin/v2';

type LessonOrderKey = {
  major: number;
  minor: number | null;
};

function hasNumericPosition(position: number | undefined): position is number {
  return typeof position === 'number' && Number.isFinite(position);
}

function parseLessonOrderKey(name: string): LessonOrderKey | null {
  const bracketMatch = name.match(/^\[\s*(\d+)(?:\s*[xX._:-]\s*(\d+))?\s*\]/);
  if (bracketMatch) {
    return {
      major: Number(bracketMatch[1]),
      minor: bracketMatch[2] ? Number(bracketMatch[2]) : null,
    };
  }

  const leadingMatch = name.match(/^\s*(\d+)(?:\s*[xX._:-]\s*(\d+))?(?=\D|$)/);
  if (!leadingMatch) {
    return null;
  }

  return {
    major: Number(leadingMatch[1]),
    minor: leadingMatch[2] ? Number(leadingMatch[2]) : null,
  };
}

function compareLessonOrderKey(a: LessonOrderKey, b: LessonOrderKey): number {
  if (a.major !== b.major) {
    return a.major - b.major;
  }

  const aMinor = a.minor ?? 0;
  const bMinor = b.minor ?? 0;
  return aMinor - bMinor;
}

/**
 * Sorts lessons within a section.
 *
 * Primary strategy uses Circle `position` when present.
 * Fallback strategy (when `position` is missing) reorders lessons with numeric
 * title prefixes like `[1x2]`, `01`, `1.2`, while leaving non-matching lessons
 * anchored in their original API positions.
 */
export function sortLessonsForSection(lessons: LessonListItem[]): LessonListItem[] {
  if (lessons.length < 2) {
    return lessons;
  }

  if (lessons.every((lesson) => hasNumericPosition(lesson.position))) {
    return [...lessons].sort((a, b) => {
      const byPosition = (a.position as number) - (b.position as number);
      if (byPosition !== 0) {
        return byPosition;
      }

      return Number(a.id) - Number(b.id);
    });
  }

  const parsedSlots = lessons
    .map((lesson, originalIndex) => ({
      lesson,
      originalIndex,
      key: parseLessonOrderKey(lesson.name),
    }))
    .filter((entry): entry is { lesson: LessonListItem; originalIndex: number; key: LessonOrderKey } =>
      entry.key !== null
    );

  if (parsedSlots.length < 2) {
    return lessons;
  }

  const sortedParseableLessons = [...parsedSlots].sort((a, b) => {
    const byKey = compareLessonOrderKey(a.key, b.key);
    if (byKey !== 0) {
      return byKey;
    }

    return a.originalIndex - b.originalIndex;
  });

  const parseableIndexes = new Set(parsedSlots.map((entry) => entry.originalIndex));
  const sortedLessons = [...lessons];
  let sortedIndex = 0;

  for (let i = 0; i < lessons.length; i++) {
    if (!parseableIndexes.has(i)) {
      continue;
    }

    sortedLessons[i] = sortedParseableLessons[sortedIndex].lesson;
    sortedIndex++;
  }

  return sortedLessons;
}

/**
 * Creates authorization headers for Circle API v2
 */
function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetches a single page of course sections from Circle API v2
 */
async function fetchCourseSectionsPage(
  spaceId: number,
  token: string,
  page: number = 1
): Promise<CirclePaginatedResponse<CircleCourseSectionRecord>> {
  const params = new URLSearchParams({
    space_id: spaceId.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${CIRCLE_V2_API_URL}/course_sections?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch course sections: ${response.status} ${response.statusText}`);
  }

  // Use .text() for proper UTF-8 handling in Cloudflare Workers
  const textContent = await response.text();
  return JSON.parse(textContent) as CirclePaginatedResponse<CircleCourseSectionRecord>;
}

/**
 * Fetches all course sections for a space (handles pagination)
 */
async function fetchAllCourseSections(spaceId: number, token: string): Promise<CourseSection[]> {
  const allSections: CircleCourseSectionRecord[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetchCourseSectionsPage(spaceId, token, page);
    allSections.push(...response.records);
    hasNextPage = response.has_next_page;
    page++;
  }

  // Transform to our internal type and sort by position
  return allSections
    .map((section) => ({
      id: section.id,
      name: section.name,
      position: section.position,
    }))
    .sort((a, b) => a.position - b.position);
}

/**
 * Fetches a single page of lessons for a section from Circle API v2
 */
async function fetchLessonsForSectionPage(
  spaceId: number,
  sectionId: number,
  token: string,
  page: number = 1
): Promise<CirclePaginatedResponse<CircleCourseLessonRecord>> {
  const params = new URLSearchParams({
    space_id: spaceId.toString(),
    section_id: sectionId.toString(),
    status: 'published',
    page: page.toString(),
  });

  const response = await fetch(`${CIRCLE_V2_API_URL}/course_lessons?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch lessons for section ${sectionId}: ${response.status} ${response.statusText}`
    );
  }

  // Use .text() for proper UTF-8 handling in Cloudflare Workers
  const textContent = await response.text();
  return JSON.parse(textContent) as CirclePaginatedResponse<CircleCourseLessonRecord>;
}

/**
 * Fetches all lessons for a specific section (handles pagination)
 */
async function fetchAllLessonsForSection(
  spaceId: number,
  sectionId: number,
  sectionName: string,
  token: string
): Promise<LessonListItem[]> {
  const allLessons: CircleCourseLessonRecord[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetchLessonsForSectionPage(spaceId, sectionId, token, page);
    allLessons.push(...response.records);
    hasNextPage = response.has_next_page;
    page++;
  }

  // Transform to our internal type and sort by position (with title-prefix fallback)
  const lessons = allLessons
    .map((lesson) => ({
      id: lesson.id,
      name: lesson.name,
      position: lesson.position,
      sectionId: lesson.section_id,
      sectionName,
    }));

  const sortedLessons = sortLessonsForSection(lessons);

  // Filter out quiz lessons before returning
  return filterOutQuizLessons(sortedLessons);
}

/**
 * Fetches complete course structure from Circle API v2 (all sections + lessons)
 *
 * @param courseId - Course identifier (e.g., 'opanuj-frontend')
 * @param _env - Environment variables (currently unused, token from common package)
 * @returns Full course structure with sections and lessons
 */
export async function fetchCourseStructure(
  courseId: string,
  _env: ExternalAuthEnv
): Promise<CourseStructure> {
  const config = getExternalAuthConfig(courseId);
  if (!config) {
    throw new Error(`Unknown course: ${courseId}`);
  }

  // Use v2 token from common package
  const token = getTokenForPlatform(config.platform);
  if (!token) {
    throw new Error(`Missing v2 token for platform: ${config.platform}`);
  }

  const { spaceId, sectionIds } = config;

  // Fetch all sections first
  const allSections = await fetchAllCourseSections(spaceId, token);

  // Filter to only configured sections and maintain their order
  const sections = sectionIds
    .map((sectionId) => allSections.find((s) => s.id === sectionId))
    .filter((s): s is CourseSection => s !== undefined);

  // Fetch lessons for each configured section in order
  const lessonsPromises = sections.map((section) =>
    fetchAllLessonsForSection(spaceId, section.id, section.name, token)
  );

  const lessonsPerSection = await Promise.all(lessonsPromises);

  // Flatten lessons while maintaining section order
  const lessons = lessonsPerSection.flat();

  return {
    courseId,
    spaceId,
    sections,
    lessons,
    cachedAt: Date.now(),
  };
}

/**
 * Finds the next and previous lesson IDs relative to a given lesson
 *
 * @param structure - Course structure containing all lessons
 * @param currentLessonId - ID of the current lesson
 * @returns Object with prevLessonId and nextLessonId (null if at boundary)
 */
export function findAdjacentLessons(
  structure: CourseStructure,
  currentLessonId: number | string
): { prevLessonId: number | string | null; nextLessonId: number | string | null } {
  const lessonIndex = structure.lessons.findIndex((l) => String(l.id) === String(currentLessonId));

  if (lessonIndex === -1) {
    return { prevLessonId: null, nextLessonId: null };
  }

  const prevLessonId = lessonIndex > 0 ? structure.lessons[lessonIndex - 1].id : null;
  const nextLessonId =
    lessonIndex < structure.lessons.length - 1 ? structure.lessons[lessonIndex + 1].id : null;

  return { prevLessonId, nextLessonId };
}

/**
 * Groups lessons by section for display purposes
 *
 * @param structure - Course structure
 * @returns Map of section ID to lessons in that section
 */
export function groupLessonsBySection(
  structure: CourseStructure
): Map<number, { section: CourseSection; lessons: LessonListItem[] }> {
  const grouped = new Map<number, { section: CourseSection; lessons: LessonListItem[] }>();

  for (const section of structure.sections) {
    grouped.set(section.id, {
      section,
      lessons: structure.lessons.filter((l) => l.sectionId === section.id),
    });
  }

  return grouped;
}
