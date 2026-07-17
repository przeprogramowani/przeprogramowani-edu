import fs from 'node:fs/promises';
import path from 'node:path';
import { htmlToCleanDOM, extractLessonId } from './dom.js';
import { sha1 } from './utilities.js';
import { LessonSummaryMeta } from '../types.js';

export type Lesson = {
  file: string;
  filePath: string;
  lessonId: string;
  displayName: string;
  summary?: string;
  releaseDate?: Date;
};

/**
 * Converts a lesson ID to a ChromaDB collection name using SHA1 hash.
 * Format: course_{first8CharsOfSHA1Hash}
 */
export function lessonToCollectionName(lessonId: string): string {
  return `course_${sha1(lessonId).slice(0, 8)}`;
}

/**
 * Scans the data/source directory and returns a list of lessons with their metadata.
 * Each lesson includes the filename, full path, extracted lessonId, and display name.
 */
export async function getLessonsFromSource(): Promise<Lesson[]> {
  const sourceDir = path.join(process.cwd(), 'data', 'source');

  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });
    const htmlFiles = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.html'))
      .map((entry) => entry.name);

    if (htmlFiles.length === 0) {
      return [];
    }

    // Extract lesson IDs from each file
    const lessons = await Promise.all(
      htmlFiles.map(async (file) => {
        const filePath = path.join(sourceDir, file);
        const html = await fs.readFile(filePath, 'utf8');
        const $ = htmlToCleanDOM(html);
        const lessonId = extractLessonId($) ?? file;

        return {
          file,
          filePath,
          lessonId,
          displayName: lessonId,
        };
      })
    );

    return lessons;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error('data/source directory does not exist.');
    }
    throw error;
  }
}

/**
 * Save lesson metadata (summary, release date) to JSON file.
 */
export async function saveLessonMetadata(lessonId: string, metadata: LessonSummaryMeta): Promise<void> {
  const metaDir = path.join(process.cwd(), 'data', 'metadata');
  await fs.mkdir(metaDir, { recursive: true });

  // Sanitize filename by replacing invalid characters
  const sanitizedFileName = lessonId.replace(/[/\\:*?"<>|]/g, '_');
  const metaFile = path.join(metaDir, `${sanitizedFileName}.json`);
  await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2));
}

/**
 * Get lesson metadata for a specific lesson.
 */
export async function getLessonMetadata(lessonId: string): Promise<LessonSummaryMeta | null> {
  // Sanitize filename by replacing invalid characters
  const sanitizedFileName = lessonId.replace(/[/\\:*?"<>|]/g, '_');
  const metaFile = path.join(process.cwd(), 'data', 'metadata', `${sanitizedFileName}.json`);

  try {
    const content = await fs.readFile(metaFile, 'utf8');
    const parsed = JSON.parse(content);
    // Convert releaseDate string back to Date object if present
    if (parsed.releaseDate) {
      parsed.releaseDate = new Date(parsed.releaseDate);
    }
    return parsed as LessonSummaryMeta;
  } catch {
    return null;
  }
}

/**
 * Get metadata for all lessons.
 */
export async function getAllLessonMetadata(): Promise<LessonSummaryMeta[]> {
  const metaDir = path.join(process.cwd(), 'data', 'metadata');

  try {
    const files = await fs.readdir(metaDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const metadata = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(metaDir, file), 'utf8');
        const parsed = JSON.parse(content);
        // Convert releaseDate string back to Date object if present
        if (parsed.releaseDate) {
          parsed.releaseDate = new Date(parsed.releaseDate);
        }
        return parsed as LessonSummaryMeta;
      })
    );

    return metadata;
  } catch {
    return [];
  }
}

/**
 * Filter lessons by accessibility based on release date.
 */
export function filterAccessibleLessons(
  metadata: LessonSummaryMeta[],
  referenceDate: Date = new Date()
): LessonSummaryMeta[] {
  return metadata.filter((lesson) => {
    if (!lesson.releaseDate) return true; // No release date = always accessible
    return referenceDate >= lesson.releaseDate;
  });
}

/**
 * Get set of accessible lesson IDs based on release dates from metadata files.
 */
export async function getAccessibleLessonIds(referenceDate: Date = new Date()): Promise<Set<string>> {
  const allMetadata = await getAllLessonMetadata();
  const accessible = filterAccessibleLessons(allMetadata, referenceDate);
  return new Set(accessible.map((m) => m.lessonId));
}
