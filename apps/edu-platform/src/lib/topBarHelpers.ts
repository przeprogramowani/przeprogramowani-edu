export interface GroupedLessonRef {
  id: string | number;
  sectionId: number;
}

export function findActiveSectionId(
  groupedLessons: GroupedLessonRef[],
  activeExternalLessonId: string | number | null
): number | null {
  if (activeExternalLessonId === null) return null;
  return groupedLessons.find((lesson) => lesson.id === activeExternalLessonId)?.sectionId ?? null;
}

export function buildDownloadHref(
  downloadUrl: string | null | undefined,
  downloadName: string | null | undefined
): string | null {
  if (!downloadUrl) return null;
  if (!downloadName) return downloadUrl;
  return `${downloadUrl}?filename=${encodeURIComponent(downloadName)}`;
}

export function getChecklistCountLabel(count: number): string {
  if (count === 1) return 'checklista';
  if (count < 5) return 'checklisty';
  return 'checklist';
}

export function buildLessonHref(lessonUrlPrefix: string, id: string | number): string {
  return `${lessonUrlPrefix}/${id}`;
}

export const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';
/** @deprecated Use SIDEBAR_STORAGE_KEY instead */
export const EXTERNAL_SIDEBAR_STORAGE_KEY = 'external-sidebar-collapsed';
