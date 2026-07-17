import { ChromaClient } from 'chromadb';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { retrieveContext } from '../retrieval.js';
import { lessonToCollectionName } from '../helpers/lessons.js';
import { selectRelevantLessons, getAccessibleLessonIdsFromChroma } from '../helpers/lesson-selection.js';
import { SYSTEM_PROMPT } from '../prompts/rag-query.prompt.js';
import { Hit } from '../types.js';

export interface RelevantLesson {
  lessonId: string;
  similarity: number;
}

export interface QueryResult {
  relevantLessons: RelevantLesson[];
  accessibleRelevant: RelevantLesson[];
  chunks: Hit[];
  answer: string;
  sourceLessons: string[];
}

export interface QueryOptions {
  topLessons?: number;
  minLessonSimilarity?: number;
  nPerCollection?: number;
  minChunkSimilarity?: number;
  finalTopK?: number;
  contextTokens?: number;
  similarityFloor?: number;
  attachParent?: boolean;
  model?: string;
}

// Progress event types for streaming
export type QueryProgress =
  | { type: 'lessons'; data: { relevantLessons: RelevantLesson[]; accessibleRelevant: RelevantLesson[] } }
  | { type: 'chunks'; data: { chunks: Hit[]; sourceLessons: string[] } }
  | { type: 'answer_chunk'; data: { chunk: string } }
  | { type: 'answer_complete'; data: { answer: string } }
  | { type: 'error'; data: { message: string } }
  | { type: 'complete'; data: QueryResult };

const DEFAULT_OPTIONS: Required<QueryOptions> = {
  topLessons: 3,
  minLessonSimilarity: 0.2,
  nPerCollection: 24,
  minChunkSimilarity: 0.15,
  finalTopK: 12,
  contextTokens: 900,
  similarityFloor: 0.18,
  attachParent: true,
  model: 'gpt-5-mini',
};

export async function executeQuery(
  client: ChromaClient,
  query: string,
  options: QueryOptions = {}
): Promise<QueryResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Step 1: Select relevant lessons via semantic search on summaries
  const relevantLessons = await selectRelevantLessons(client, query.trim(), opts.topLessons, opts.minLessonSimilarity);

  if (relevantLessons.length === 0) {
    return {
      relevantLessons: [],
      accessibleRelevant: [],
      chunks: [],
      answer: '',
      sourceLessons: [],
    };
  }

  // Step 2: Get accessible lesson IDs from ChromaDB (date-based filter)
  const accessibleLessonIds = await getAccessibleLessonIdsFromChroma(client);

  // Step 3: Filter relevant lessons by access
  const accessibleRelevant = relevantLessons.filter((l) => accessibleLessonIds.has(l.lessonId));

  if (accessibleRelevant.length === 0) {
    return {
      relevantLessons,
      accessibleRelevant: [],
      chunks: [],
      answer: '',
      sourceLessons: [],
    };
  }

  // Step 4: Retrieve context from accessible lessons
  const collectionNames = accessibleRelevant.map((l) => lessonToCollectionName(l.lessonId));

  const { context, chunks } = await retrieveContext(client, query.trim(), {
    collectionNames,
    nPerCollection: opts.nPerCollection,
    minSim: opts.minChunkSimilarity,
    attachParent: opts.attachParent,
    finalTopK: opts.finalTopK,
    contextTokens: opts.contextTokens,
    similarityFloor: opts.similarityFloor,
    accessibleLessonIds,
  });

  if (chunks.length === 0) {
    return {
      relevantLessons,
      accessibleRelevant,
      chunks: [],
      answer: '',
      sourceLessons: [],
    };
  }

  // Step 5: Generate answer with LLM
  const { text } = await generateText({
    model: openai(opts.model),
    system: SYSTEM_PROMPT(context),
    prompt: query.trim(),
  });

  // Extract source lessons
  const sourceLessons = [...new Set(chunks.map((c) => c.meta.lessonId))];

  return {
    relevantLessons,
    accessibleRelevant,
    chunks,
    answer: text,
    sourceLessons,
  };
}

/**
 * Streaming version of executeQuery that yields progress events
 * Allows UI to show progressive results as they become available
 */
export async function* executeQueryStream(
  client: ChromaClient,
  query: string,
  options: QueryOptions = {}
): AsyncGenerator<QueryProgress, void, unknown> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Step 1: Select relevant lessons via semantic search on summaries
    const relevantLessons = await selectRelevantLessons(
      client,
      query.trim(),
      opts.topLessons,
      opts.minLessonSimilarity
    );

    if (relevantLessons.length === 0) {
      yield {
        type: 'complete',
        data: {
          relevantLessons: [],
          accessibleRelevant: [],
          chunks: [],
          answer: '',
          sourceLessons: [],
        },
      };
      return;
    }

    // Step 2: Get accessible lesson IDs from ChromaDB (date-based filter)
    const accessibleLessonIds = await getAccessibleLessonIdsFromChroma(client);

    // Step 3: Filter relevant lessons by access
    const accessibleRelevant = relevantLessons.filter((l) => accessibleLessonIds.has(l.lessonId));

    // Yield lessons immediately so UI can show them
    yield {
      type: 'lessons',
      data: {
        relevantLessons,
        accessibleRelevant,
      },
    };

    if (accessibleRelevant.length === 0) {
      yield {
        type: 'complete',
        data: {
          relevantLessons,
          accessibleRelevant: [],
          chunks: [],
          answer: '',
          sourceLessons: [],
        },
      };
      return;
    }

    // Step 4: Retrieve context from accessible lessons
    const collectionNames = accessibleRelevant.map((l) => lessonToCollectionName(l.lessonId));

    const { context, chunks } = await retrieveContext(client, query.trim(), {
      collectionNames,
      nPerCollection: opts.nPerCollection,
      minSim: opts.minChunkSimilarity,
      attachParent: opts.attachParent,
      finalTopK: opts.finalTopK,
      contextTokens: opts.contextTokens,
      similarityFloor: opts.similarityFloor,
      accessibleLessonIds,
    });

    const sourceLessons = [...new Set(chunks.map((c) => c.meta.lessonId))];

    // Yield chunks so UI can show source references
    yield {
      type: 'chunks',
      data: {
        chunks,
        sourceLessons,
      },
    };

    if (chunks.length === 0) {
      yield {
        type: 'complete',
        data: {
          relevantLessons,
          accessibleRelevant,
          chunks: [],
          answer: '',
          sourceLessons: [],
        },
      };
      return;
    }

    // Step 5: Generate answer with LLM using streaming
    const result = await streamText({
      model: openai(opts.model),
      system: SYSTEM_PROMPT(context),
      prompt: query.trim(),
    });

    let fullAnswer = '';

    // Stream the answer chunk by chunk
    for await (const chunk of result.textStream) {
      fullAnswer += chunk;
      yield {
        type: 'answer_chunk',
        data: { chunk },
      };
    }

    // Yield final answer
    yield {
      type: 'answer_complete',
      data: { answer: fullAnswer },
    };

    // Yield complete result
    yield {
      type: 'complete',
      data: {
        relevantLessons,
        accessibleRelevant,
        chunks,
        answer: fullAnswer,
        sourceLessons,
      },
    };
  } catch (error) {
    yield {
      type: 'error',
      data: {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
    };
  }
}
