import { z } from 'zod';

export type BlockType = 'paragraph' | 'list' | 'code' | 'table' | 'image' | 'embed' | 'blockquote';

export interface Block {
  type: BlockType;
  markdown: string; // normalized markdown for this block
  rawText: string; // plain text (no md markup) to help estimates
  order: number; // index within its section
}

export interface Section {
  id: string; // stable uuid/slug with lesson scope
  level: number; // heading level
  title: string;
  slug: string; // kebab-case anchor
  breadcrumbs: string[]; // e.g., [H2, H3]
  blocks: Block[];
  order: number; // section index within the lesson
  context?: string; // LLM-generated context for this section
}

export const ChunkMeta = z.object({
  lessonId: z.string(),
  sourceFile: z.string(),
  sectionSlug: z.string(),
  sectionTitle: z.string(),
  breadcrumbs: z.array(z.string()),
  order: z.number(),
  blockSpan: z.tuple([z.number(), z.number()]),
  charCount: z.number(),
  tokenEstimate: z.number(),
  parentId: z.string().optional(),
  links: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  lang: z.string().optional(),
});
export type ChunkMeta = z.infer<typeof ChunkMeta>;

export interface Chunk {
  id: string;
  text: string; // final chunk text to embed (markdown, prefixed with title line)
  meta: ChunkMeta;
}

export interface ChunkingParams {
  targetTokens: number; // ~300
  maxTokens: number; // ~500
  minTokens: number; // ~120
  overlapTokens: number; // ~40
}

// Retrieval types
export type Meta = ChunkMeta; // Alias for consistency with retrieval code

export interface Hit {
  id: string;
  text: string;
  meta: Meta;
  distance: number; // from Chroma
  similarity: number; // our normalized similarity
  rank: number; // within its own collection
  collection: string;
}

export interface MultiQueryOpts {
  collectionNames: string[]; // e.g. ["course_a1b2c3d4", "course_e5f6g7h8"]
  nPerCollection?: number; // raw candidates per collection
  where?: Partial<Meta>; // e.g. { lessonId: "..." } or { sectionSlug: "..." }
  minSim?: number; // drop weak hits early (0..1)
  attachParent?: boolean; // bring parent chunks in
  accessibleLessonIds?: Set<string>; // lesson access control filter
}

export interface RetrieveOpts extends MultiQueryOpts {
  finalTopK?: number; // after fusion
  contextTokens?: number;
  similarityFloor?: number; // drop anything below this after fusion
}

export interface LessonSummaryMeta {
  lessonId: string;
  displayName: string;
  summary: string;
  tokenEstimate: number;
  releaseDate?: Date;
}
