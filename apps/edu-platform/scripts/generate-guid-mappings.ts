#!/usr/bin/env tsx

import { readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { COLLECTION_MAPPINGS } from '../src/models/CollectionMappings.js';
import type { LessonCollection } from '../src/models/LessonCollection.js';
import type { CourseSlug } from '../src/models/CollectionMappings.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '../src/content');

// Invert COLLECTION_MAPPINGS to get collection -> slug mapping
const COLLECTION_TO_SLUG: Record<LessonCollection, CourseSlug> = Object.fromEntries(
  Object.entries(COLLECTION_MAPPINGS).map(([slug, collection]) => [collection, slug])
) as Record<LessonCollection, CourseSlug>;

/**
 * Generate deterministic GUID from course collection and lesson filename
 * This ensures same lesson always gets same GUID
 */
function generateGuid(courseCollection: LessonCollection, lessonFilename: string): string {
  const input = `${courseCollection}:${lessonFilename}`;
  const hash = createHash('sha256').update(input).digest('hex');

  // Format as GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return [hash.slice(0, 8), hash.slice(8, 12), hash.slice(12, 16), hash.slice(16, 20), hash.slice(20, 32)].join('-');
}

/**
 * Extract lesson ID from HTML filename
 * e.g., "01-zanim_rozpoczniemy.html" -> "01"
 */
function extractLessonId(filename: string): string {
  const match = filename.match(/^(\d+)/);
  return match ? match[1] : filename.replace('.html', '');
}

/**
 * Check if directory name is a valid lesson collection
 */
function isValidCollection(dirName: string): dirName is LessonCollection {
  return dirName in COLLECTION_TO_SLUG;
}

/**
 * Read all lesson files and generate GUID mappings
 */
async function generateGuidMappings(): Promise<
  Record<string, { courseCollection: LessonCollection; courseSlug: CourseSlug; lessonId: string }>
> {
  const mappings: Record<string, { courseCollection: LessonCollection; courseSlug: CourseSlug; lessonId: string }> = {};

  try {
    // Read all course collections
    const collections = await readdir(contentDir);

    for (const collection of collections) {
      // Skip if not a valid collection
      if (!isValidCollection(collection)) {
        console.log(`⚠️  Skipping unknown collection: ${collection}`);
        continue;
      }

      const collectionPath = join(contentDir, collection);

      try {
        const lessons = await readdir(collectionPath);

        for (const lessonFile of lessons) {
          if (!lessonFile.endsWith('.html')) {
            continue;
          }

          const lessonId = extractLessonId(lessonFile);
          const courseSlug = COLLECTION_TO_SLUG[collection];
          const guid = generateGuid(collection, lessonFile);

          mappings[guid] = {
            courseCollection: collection,
            courseSlug: courseSlug,
            lessonId: lessonId,
          };

          console.log(`Generated mapping: ${guid} -> ${collection}/${lessonId}`);
        }
      } catch (error) {
        console.error(`Error reading collection ${collection}:`, (error as Error).message);
      }
    }

    return mappings;
  } catch (error) {
    console.error('Error reading content directory:', (error as Error).message);
    throw error;
  }
}

/**
 * Generate TypeScript file content for mappings only
 */
function generateMappingsContent(
  mappings: Record<string, { courseCollection: LessonCollection; courseSlug: CourseSlug; lessonId: string }>
): string {
  const mappingEntries = Object.entries(mappings)
    .map(
      ([guid, mapping]) =>
        `  '${guid}': {\n` +
        `    courseCollection: '${mapping.courseCollection}',\n` +
        `    courseSlug: '${mapping.courseSlug}',\n` +
        `    lessonId: '${mapping.lessonId}',\n` +
        `  }`
    )
    .join(',\n');

  return `
// IMPORTANT: Do not modify this file manually.
// Run 'npm run generate:guid-mappings' to regenerate.

import type { CourseSlug } from './CollectionMappings';
import type { LessonCollection } from './LessonCollection';

export interface LessonGuidMapping {
  courseCollection: LessonCollection;
  courseSlug: CourseSlug;
  lessonId: string;
}

export const LESSON_GUID_MAPPINGS: Record<string, LessonGuidMapping> = {
${mappingEntries}
};

`;
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    console.log('🔍 Scanning content directory...');
    const mappings = await generateGuidMappings();

    console.log(`\n📝 Generated ${Object.keys(mappings).length} GUID mappings`);

    const mappingsContent = generateMappingsContent(mappings);

    const mappingsPath = join(__dirname, '../src/models/LessonGuidMappingsData.ts');

    await writeFile(mappingsPath, mappingsContent);

    console.log(`✅ Successfully generated ${mappingsPath}`);
    console.log('\n💡 GUID mappings have been auto-generated based on your content structure.');
    console.log('🎯 Using existing types from CollectionMappings.ts - no manual mapping required!');
  } catch (error) {
    console.error('❌ Error generating GUID mappings:', (error as Error).message);
    process.exit(1);
  }
}

main();
