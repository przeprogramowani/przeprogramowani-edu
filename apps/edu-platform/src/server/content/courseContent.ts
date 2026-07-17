import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { LessonCollection } from '@/models/LessonCollection';

type CourseLessonEntry = CollectionEntry<LessonCollection>;

function isMissingOrEmptyCollectionError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false;
  }

  return /does not exist|is empty/i.test(error.message);
}

export async function getLessonsForCourseCollection(
  collection: LessonCollection
): Promise<CourseLessonEntry[]> {
  try {
    return await getCollection(collection);
  } catch (error) {
    if (isMissingOrEmptyCollectionError(error)) {
      console.warn('[courseContent] treating missing or empty collection as no lessons', {
        collection,
        error: error.message,
      });
      return [];
    }

    throw error;
  }
}

export async function getLessonFromCourseCollection(
  collection: LessonCollection,
  lessonId: string
): Promise<CourseLessonEntry | null> {
  try {
    return (await getEntry(collection, lessonId)) ?? null;
  } catch (error) {
    if (isMissingOrEmptyCollectionError(error)) {
      console.warn('[courseContent] treating missing or empty collection as missing lesson', {
        collection,
        lessonId,
        error: error.message,
      });
      return null;
    }

    throw error;
  }
}
