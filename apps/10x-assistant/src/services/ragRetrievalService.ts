import type { Answer } from '../types/answer';
import { executeQuery, executeQueryStream } from '../../../10x-rag/src/lib/query-service.js';
import type { Hit } from '../../../10x-rag/src/types.js';
import { createChromaClient, type ChromaCredentials } from '../../../10x-rag/src/helpers/chroma.js';
import { CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE, CHROMA_DB_URL } from 'astro:env/server';

// Cache the Chroma client to avoid recreating it on every request
let chromaClient: ReturnType<typeof createChromaClient> | null = null;

function getChromaClient() {
  if (!chromaClient) {
    const credentials: ChromaCredentials = {
      apiKey: CHROMA_API_KEY,
      tenant: CHROMA_TENANT,
      database: CHROMA_DATABASE,
      url: CHROMA_DB_URL,
    };
    chromaClient = createChromaClient(credentials);
  }
  return chromaClient;
}

export async function processQuery(query: string): Promise<Answer> {
  try {
    const client = getChromaClient();

    // Execute the query using the RAG pipeline
    const result = await executeQuery(client, query, {
      topLessons: 3,
      minLessonSimilarity: 0.2,
      nPerCollection: 24,
      minChunkSimilarity: 0.15,
      finalTopK: 12,
      contextTokens: 900,
      similarityFloor: 0.18,
      attachParent: true,
      model: 'gpt-5-mini',
    });

    // Map the result to the Answer interface
    const sources = result.sourceLessons.map((lessonId) => {
      // Find chunks from this lesson to get the title
      const chunk = result.chunks.find((c) => c.meta.lessonId === lessonId);
      return chunk ? `${chunk.meta.sectionTitle} (Lesson ${lessonId})` : `Lesson ${lessonId}`;
    });

    return {
      response: result.answer || 'No relevant information found for your query.',
      sources: sources.length > 0 ? sources : ['No sources available'],
    };
  } catch (error) {
    console.error('Error processing RAG query:', error);
    throw new Error('Failed to process query');
  }
}

/**
 * Streaming version that yields progress events for real-time UI updates
 * Returns SSE-compatible event strings
 */
export async function* processQueryStream(query: string): AsyncGenerator<string, void, unknown> {
  try {
    const client = getChromaClient();

    // Execute the streaming query
    for await (const event of executeQueryStream(client, query, {
      topLessons: 3,
      minLessonSimilarity: 0.2,
      nPerCollection: 24,
      minChunkSimilarity: 0.15,
      finalTopK: 12,
      contextTokens: 900,
      similarityFloor: 0.18,
      attachParent: true,
      model: 'gpt-5-mini',
    })) {
      // Transform events for the UI
      if (event.type === 'lessons') {
        const { accessibleRelevant } = event.data;
        yield formatSSE('lessons', {
          lessons: accessibleRelevant.map((l) => ({
            lessonId: l.lessonId,
            similarity: l.similarity,
          })),
        });
      } else if (event.type === 'chunks') {
        const { chunks, sourceLessons } = event.data;
        // Transform chunks to sources with better formatting
        const sources = sourceLessons.map((lessonId) => {
          const chunk = chunks.find((c: Hit) => c.meta.lessonId === lessonId);
          return {
            lessonId,
            title: chunk ? `${lessonId} - ${chunk.meta.sectionTitle}` : `Lesson ${lessonId}`,
          };
        });
        yield formatSSE('sources', { sources });
      } else if (event.type === 'answer_chunk') {
        yield formatSSE('answer_chunk', { chunk: event.data.chunk });
      } else if (event.type === 'answer_complete') {
        yield formatSSE('answer_complete', { answer: event.data.answer });
      } else if (event.type === 'complete') {
        const { sourceLessons, chunks } = event.data;
        const sources = sourceLessons.map((lessonId) => {
          const chunk = chunks.find((c) => c.meta.lessonId === lessonId);
          return chunk ? `${lessonId} - ${chunk.meta.sectionTitle}` : `${lessonId}`;
        });
        yield formatSSE('complete', {
          response: event.data.answer || 'Nie odnaleziono źródeł dla Twojego zapytania.',
          sources: sources.length > 0 ? sources : ['No sources available'],
        });
      } else if (event.type === 'error') {
        yield formatSSE('error', { message: event.data.message });
      }
    }
  } catch (error) {
    console.error('Błąd podczas przetwarzania zapytania:', error);
    yield formatSSE('error', {
      message: error instanceof Error ? error.message : 'Błąd podczas przetwarzania zapytania',
    });
  }
}

/**
 * Format data as Server-Sent Events (SSE)
 */
function formatSSE(eventType: string, data: unknown): string {
  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
}
