// TODO: Każda lekcja wymaga ręcznego oblokowania, nie korzystamy z API Circle

/**
 * Module configuration with release date and lesson IDs
 */
type Module = {
  releaseDate: string; // ISO 8601 date-time string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  lessons: number[];
};

/**
 * 10xDevs 2.0 course modules with date-based access control
 * Each module unlocks on its release date
 */
export const TEN_X_DEVS_2_MODULES: Record<string, Module> = {
  M3: {
    releaseDate: '2025-10-13T03:00:00Z', // 05:00 UTC+2
    lessons: [2580238, 2580242, 2580247, 2580251, 2580254, 2580256],
  },
  M4: {
    releaseDate: '2025-10-20T03:00:00Z', // 05:00 UTC+2
    lessons: [2580237, 2580243, 2580245, 2580248, 2580253, 2580639],
  },
  M5: {
    releaseDate: '2025-10-27T03:00:00Z', // 05:00 UTC+2
    lessons: [2580239, 2580250, 2580257, 2580258, 2580259],
  },
};

/**
 * Finds the module containing a specific lesson ID
 * @param lessonId - The lesson ID to search for
 * @returns The module containing the lesson, or undefined if not found
 */
export const findModuleByLessonId = (lessonId: number): Module | undefined => {
  return Object.values(TEN_X_DEVS_2_MODULES).find((module) =>
    module.lessons.includes(lessonId)
  );
};

/**
 * Checks if access to a lesson is allowed based on module release date-time
 * @param lessonId - The lesson ID to check
 * @returns true if access is allowed, false otherwise
 *
 * Access is allowed if:
 * - The lesson is not in any module (unrestricted content)
 * - The current date-time is on or after the module's release date-time
 */
export const isAccessAllowed = (lessonId: number): boolean => {
  const module = findModuleByLessonId(lessonId);

  // If lesson not in any module, allow access (backward compatibility)
  if (!module) {
    return true;
  }

  // Check if current date-time is >= release date-time (includes time precision)
  const now = new Date();
  const releaseDate = new Date(module.releaseDate);

  return now >= releaseDate;
};
