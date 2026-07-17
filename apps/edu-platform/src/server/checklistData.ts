import { getCollection } from 'astro:content';

export interface ChecklistItem {
  id: string;
  title: string;
  module: string;
  description: string;
  order: number;
}

/**
 * Retrieves checklist data for a given course.
 * Currently only the 10xdevs-2 course has checklists.
 *
 * @param courseId - The course identifier (e.g., '10xdevs-2')
 * @returns Array of checklist items sorted by order, or empty array if course has no checklists
 */
export async function getChecklistsForCourse(
  courseId: string
): Promise<ChecklistItem[]> {
  // Only return checklists for 10xdevs-2
  if (courseId !== '10xdevs-2') {
    return [];
  }

  const checklists = await getCollection('checklists');
  return checklists
    .map((c) => ({
      id: c.id,
      title: c.data.title,
      module: c.data.module,
      description: c.data.description,
      order: c.data.order ?? 99,
    }))
    .sort((a, b) => a.order - b.order);
}
