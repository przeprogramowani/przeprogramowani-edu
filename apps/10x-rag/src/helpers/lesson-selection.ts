import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import { LessonSummaryMeta } from '../types.js';
import { normalizeCosineDistance } from './utilities.js';

const LESSON_SUMMARY_COLLECTION = 'lesson_summaries';

export async function initLessonSummaryCollection(client: ChromaClient) {
  const embeddingFunction = new OpenAIEmbeddingFunction({
    modelName: 'text-embedding-3-small',
  });

  return await client.getOrCreateCollection({
    name: LESSON_SUMMARY_COLLECTION,
    metadata: { 'hnsw:space': 'cosine' },
    embeddingFunction,
  });
}

export async function indexLessonSummary(client: ChromaClient, metadata: LessonSummaryMeta): Promise<void> {
  const collection = await initLessonSummaryCollection(client);

  await collection.upsert({
    ids: [metadata.lessonId],
    documents: [metadata.summary],
    metadatas: [
      {
        lessonId: metadata.lessonId,
        displayName: metadata.displayName,
        releaseDate: metadata.releaseDate?.toISOString() ?? null,
      },
    ],
  });
}

export async function selectRelevantLessons(
  client: ChromaClient,
  query: string,
  topK = 3,
  minSimilarity = 0.2
): Promise<Array<{ lessonId: string; similarity: number }>> {
  const collection = await initLessonSummaryCollection(client);

  const results = await collection.query({
    queryTexts: [query],
    nResults: topK,
    include: ['distances', 'metadatas'],
  });

  const lessonIds = results.ids?.[0] ?? [];
  const distances = results.distances?.[0] ?? [];

  return lessonIds
    .map((id, idx) => ({
      lessonId: id as string,
      similarity: normalizeCosineDistance(distances[idx] ?? 2),
    }))
    .filter((item) => item.similarity >= minSimilarity);
}

/**
 * Get accessible lesson IDs from ChromaDB based on release dates.
 * Filters lessons whose release date is on or before the reference date.
 * Lessons without a release date are always considered accessible.
 */
export async function getAccessibleLessonIdsFromChroma(
  client: ChromaClient,
  referenceDate: Date = new Date()
): Promise<Set<string>> {
  const collection = await initLessonSummaryCollection(client);

  // Get all lessons from the collection
  const results = await collection.get({
    include: ['metadatas'],
  });

  const lessonIds = results.ids ?? [];
  const metadatas = results.metadatas ?? [];

  const accessibleIds = new Set<string>();

  lessonIds.forEach((id, idx) => {
    const meta = metadatas[idx];
    if (!meta) return;

    const releaseDateStr = meta.releaseDate as string | null;

    // No release date = always accessible
    if (!releaseDateStr) {
      accessibleIds.add(id as string);
      return;
    }

    // Check if lesson is released
    const releaseDate = new Date(releaseDateStr);
    if (referenceDate >= releaseDate) {
      accessibleIds.add(id as string);
    }
  });

  return accessibleIds;
}
