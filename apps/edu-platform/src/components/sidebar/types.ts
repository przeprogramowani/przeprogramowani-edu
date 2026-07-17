/**
 * Lightweight lesson item for sidebar navigation (no content HTML).
 * Used by both flat and grouped sidebar modes.
 */
export interface SidebarLessonItem {
  id: string | number;
  name: string;
  sectionId?: number;
  personalization?: {
    label: string;
    tooltip: string;
  };
  progress?: {
    completed: boolean;
    lessonId: string;
  };
}

/**
 * Section metadata for grouped sidebar mode.
 */
export interface SidebarSection {
  id: number;
  name: string;
  position: number;
}

/**
 * Checklist item for grouped sidebar mode (optional).
 */
export interface SidebarChecklistItem {
  id: string;
  title: string;
}

export interface LessonSidebarLabels {
  lessons: string;
  inCourseSuffix: string;
  lessonSingular: string;
  lessonPlural: string;
  htmlLang?: 'pl' | 'en';
  markComplete?: string;
  completed?: string;
  markIncomplete?: string;
  error?: string;
}

interface SidebarLabelProps {
  labels?: LessonSidebarLabels;
}

export interface SidebarProgressScope {
  courseSlug: string;
  language?: string | null;
}

/**
 * Props for flat sidebar mode (regular courses).
 *
 * Note: we intentionally pass `lessonUrlPrefix` (a plain string) rather than
 * a URL-building function. The sidebar is hydrated as a `client:load` Svelte
 * island, and Astro serializes island props to JSON — functions cannot cross
 * that boundary.
 */
export interface FlatSidebarProps extends SidebarLabelProps {
  mode: 'flat';
  lessons: SidebarLessonItem[];
  activeLessonId: string;
  lessonUrlPrefix: string; // e.g. "/courses/opanuj-frontend/lesson"
  progressScope?: SidebarProgressScope;
}

/**
 * Props for grouped sidebar mode (external courses).
 *
 * Note: `courseId` and `lessonUrlPrefix` are plain strings instead of
 * URL-building functions for the same reason as `FlatSidebarProps` —
 * Astro island props must be JSON-serializable.
 */
export interface GroupedSidebarProps extends SidebarLabelProps {
  mode: 'grouped';
  lessons: SidebarLessonItem[];
  sections: SidebarSection[];
  activeLessonId: string | number;
  courseId: string; // used to build `/external/${courseId}/checklists/${id}`
  lessonUrlPrefix?: string; // defaults to `/external/${courseId}`
  checklists?: SidebarChecklistItem[];
  activeChecklistId?: string | null;
  progressScope?: SidebarProgressScope;
}

export type LessonSidebarProps = FlatSidebarProps | GroupedSidebarProps;
