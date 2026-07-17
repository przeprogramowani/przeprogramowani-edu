/**
 * Lesson metadata for navigation (lightweight, no content)
 */
export interface LessonListItem {
  id: number | string;
  name: string;
  position?: number;
  sectionId: number;
  sectionName?: string;
}

/**
 * Section metadata for grouping lessons
 */
export interface CourseSection {
  id: number;
  name: string;
  position: number;
}

/**
 * Full course structure with sections and lessons
 */
export interface CourseStructure {
  courseId: string;
  spaceId: number;
  sections: CourseSection[];
  lessons: LessonListItem[];
  cachedAt: number;
}

/**
 * Raw section data from Circle API v2
 */
export interface CircleCourseSectionRecord {
  id: number;
  name: string;
  position: number;
  space_id: number;
  lessons_count: number;
}

/**
 * Raw lesson data from Circle API v2 (minimal fields for navigation)
 */
export interface CircleCourseLessonRecord {
  id: number;
  name: string;
  position?: number;
  section_id: number;
  status: 'draft' | 'published';
}

/**
 * Circle API v2 paginated response format
 */
export interface CirclePaginatedResponse<T> {
  page: number;
  per_page: number;
  has_next_page: boolean;
  count: number;
  page_count: number;
  records: T[];
}
