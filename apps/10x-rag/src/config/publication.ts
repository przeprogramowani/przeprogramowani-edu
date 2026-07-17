/**
 * Publication configuration for lessons.
 * All dates are in GMT+1 (Europe/Warsaw timezone).
 */
export interface PublicationConfig {
  [lessonId: string]: {
    releaseDate: Date;
    description?: string; // Optional description for admin reference
  };
}

export const publicationConfig: PublicationConfig = {
  'react-hooks-intro-2024': {
    releaseDate: new Date('2024-01-15T10:00:00+01:00'),
    description: 'React Hooks - Introduction',
  },
  'typescript-advanced-types': {
    releaseDate: new Date('2024-02-01T09:00:00+01:00'),
    description: 'TypeScript Advanced Types',
  },
  'nodejs-streams': {
    releaseDate: new Date('2025-12-31T23:59:00+01:00'),
    description: 'Node.js Streams (future release)',
  },
  // Add more lessons here as needed
};

/**
 * Get release date for a specific lesson.
 */
export function getLessonReleaseDate(lessonId: string): Date | null {
  return publicationConfig[lessonId]?.releaseDate ?? null;
}

/**
 * Check if a lesson is accessible at the given reference date.
 */
export function isLessonAccessible(lessonId: string, referenceDate: Date = new Date()): boolean {
  const releaseDate = getLessonReleaseDate(lessonId);
  if (!releaseDate) return true; // No release date = always accessible
  return referenceDate >= releaseDate;
}

/**
 * Get all accessible lesson IDs at the given reference date.
 */
export function getAccessibleLessonIdsFromConfig(referenceDate: Date = new Date()): Set<string> {
  return new Set(Object.keys(publicationConfig).filter((lessonId) => isLessonAccessible(lessonId, referenceDate)));
}
