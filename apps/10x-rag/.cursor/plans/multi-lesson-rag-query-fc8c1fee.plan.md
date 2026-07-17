<!-- fc8c1fee-764e-4b0d-9ca0-48b2126f0ab8 0233e15f-dd2d-4b8f-9a9d-b75f3f83038e -->
# Multi-Lesson RAG Query with Access Control

## Overview

Transformacja CLI z lesson-selection flow na direct-query flow z automatycznym:

1. Lesson discovery (semantic search po LLM-generated summaries)
2. Access control filtering (date-based: today >= releaseDate)
3. Multi-lesson retrieval z hard filteringiem niedostępnych lekcji

## Architecture Changes

### New Data Flow

```
User Query (no lesson selection)
  ↓
Generate Lesson Summaries (during ingest, cached)
  ↓
Semantic Search: Query → Lesson Summaries → Top-N Lessons
  ↓
Access Control Filter: today >= lesson.releaseDate
  ↓
Multi-Collection Retrieval (only accessible lessons)
  ↓
Hard Filter: Remove chunks from inaccessible lessons
  ↓
LLM Generation (only from accessible content)
```

## Implementation Steps

### 1. Extend Data Types (src/types.ts)

Add new fields to Lesson type:

```typescript
export interface Lesson {
  file: string;
  filePath: string;
  lessonId: string;
  displayName: string;
  summary?: string;           // LLM-generated summary (~200-300 tokens)
  releaseDate?: Date;         // Access control date
}

export interface LessonSummaryMeta {
  lessonId: string;
  displayName: string;
  summary: string;
  tokenEstimate: number;
  releaseDate?: Date;
}
```

### 2. Create Publication Config (src/config/publication.ts)

Create TypeScript config module with release dates (GMT+1 Warsaw timezone):

```typescript
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
  // Add more lessons here...
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
export function isLessonAccessible(
  lessonId: string,
  referenceDate: Date = new Date()
): boolean {
  const releaseDate = getLessonReleaseDate(lessonId);
  if (!releaseDate) return true; // No release date = always accessible
  return referenceDate >= releaseDate;
}

/**
 * Get all accessible lesson IDs at the given reference date.
 */
export function getAccessibleLessonIdsFromConfig(
  referenceDate: Date = new Date()
): Set<string> {
  return new Set(
    Object.keys(publicationConfig).filter(lessonId =>
      isLessonAccessible(lessonId, referenceDate)
    )
  );
}
```

**Note:** Dates use ISO 8601 format with timezone offset (+01:00 for GMT+1).

### 3. Generate Lesson Summary with LLM (src/ingest.ts)

Add function to generate summary during ingest:

```typescript
async function generateLessonSummary(
  lessonId: string,
  sections: Section[]
): Promise<string> {
  // Build content preview (first ~2000 tokens from all sections)
  const preview = sections
    .flatMap(s => s.blocks.map(b => b.rawText))
    .join(' ')
    .slice(0, 8000); // ~2000 tokens
  
  const { text } = await generateText({
    model: openai('gpt-5-mini'),
    prompt: `Wygeneruj zwięzłe streszczenie (2-3 zdania) poniższej lekcji kursu programowania. 
    Skup się na kluczowych tematach i technologiach omawianych w lekcji.
    
    Lekcja: ${lessonId}
    
    Treść:
    ${preview}
    
    Streszczenie:`,
  });
  
  return text.trim();
}
```

Modify `ingestHtmlFile()` to:

1. Generate summary after segmentation
2. Extract releaseDate
3. Save to manifest with metadata

### 4. Store Lesson Summaries (src/helpers/lessons.ts)

Create lesson metadata storage and retrieval:

```typescript
export async function saveLessonMetadata(
  lessonId: string,
  metadata: LessonSummaryMeta
): Promise<void> {
  const metaDir = path.join(process.cwd(), 'data', 'metadata');
  await fs.mkdir(metaDir, { recursive: true });
  
  const metaFile = path.join(metaDir, `${lessonId}.json`);
  await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2));
}

export async function getLessonMetadata(
  lessonId: string
): Promise<LessonSummaryMeta | null> {
  const metaFile = path.join(
    process.cwd(), 
    'data', 
    'metadata', 
    `${lessonId}.json`
  );
  
  try {
    const content = await fs.readFile(metaFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function getAllLessonMetadata(): Promise<LessonSummaryMeta[]> {
  const metaDir = path.join(process.cwd(), 'data', 'metadata');
  
  try {
    const files = await fs.readdir(metaDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const metadata = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(metaDir, file), 
          'utf8'
        );
        return JSON.parse(content) as LessonSummaryMeta;
      })
    );
    
    return metadata;
  } catch {
    return [];
  }
}
```

### 5. Lesson Selection via Semantic Search (NEW: src/helpers/lesson-selection.ts)

Create new file for lesson discovery:

```typescript
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import { LessonSummaryMeta } from '../types.js';
import { normalizeCosineDistance } from './utilities.js';

const LESSON_SUMMARY_COLLECTION = 'lesson_summaries';

export async function initLessonSummaryCollection(
  client: ChromaClient
) {
  const embeddingFunction = new OpenAIEmbeddingFunction({
    modelName: 'text-embedding-3-small',
  });
  
  return await client.getOrCreateCollection({
    name: LESSON_SUMMARY_COLLECTION,
    metadata: { 'hnsw:space': 'cosine' },
    embeddingFunction,
  });
}

export async function indexLessonSummary(
  client: ChromaClient,
  metadata: LessonSummaryMeta
): Promise<void> {
  const collection = await initLessonSummaryCollection(client);
  
  await collection.upsert({
    ids: [metadata.lessonId],
    documents: [metadata.summary],
    metadatas: [{
      lessonId: metadata.lessonId,
      displayName: metadata.displayName,
      releaseDate: metadata.releaseDate?.toISOString() ?? null,
    }],
  });
}

export async function selectRelevantLessons(
  client: ChromaClient,
  query: string,
  topK = 3,
  minSimilarity = 0.20
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
    .filter(item => item.similarity >= minSimilarity);
}
```

### 6. Access Control Filtering (src/helpers/lessons.ts)

Add date-based access control:

```typescript
export function filterAccessibleLessons(
  metadata: LessonSummaryMeta[],
  referenceDate: Date = new Date()
): LessonSummaryMeta[] {
  return metadata.filter(lesson => {
    if (!lesson.releaseDate) return true; // No release date = always accessible
    return referenceDate >= lesson.releaseDate;
  });
}

export async function getAccessibleLessonIds(
  referenceDate: Date = new Date()
): Promise<Set<string>> {
  const allMetadata = await getAllLessonMetadata();
  const accessible = filterAccessibleLessons(allMetadata, referenceDate);
  return new Set(accessible.map(m => m.lessonId));
}
```

### 7. Modify Retrieval to Filter by Lesson Access (src/retrieval.ts)

Update `queryAcrossCollections()` to accept accessible lesson filter:

```typescript
export async function queryAcrossCollections(
  client: ChromaClient,
  query: string,
  {
    collectionNames,
    nPerCollection = 24,
    where,
    minSim = 0.15,
    attachParent = true,
    accessibleLessonIds, // NEW parameter
  }: MultiQueryOpts & { accessibleLessonIds?: Set<string> }
): Promise<{ fused: Hit[]; byCollection: Record<string, Hit[]> }> {
  // ... existing code ...
  
  // After building hits, filter by accessible lessons
  const results = await Promise.all(
    cols.map(async ({ name, col }) => {
      // ... query logic ...
      
      let hits: Hit[] = [/* ... build hits ... */];
      
      // Apply access control filter
      if (accessibleLessonIds) {
        hits = hits.filter(h => 
          accessibleLessonIds.has(h.meta.lessonId)
        );
      }
      
      return hits.filter((h) => h.similarity >= minSim);
    })
  );
  
  // ... rest of fusion logic ...
}
```

Update `MultiQueryOpts` type in src/types.ts:

```typescript
export interface MultiQueryOpts {
  collectionNames: string[];
  nPerCollection?: number;
  where?: Partial<Meta>;
  minSim?: number;
  attachParent?: boolean;
  accessibleLessonIds?: Set<string>; // NEW
}
```

### 8. Update Ingest Pipeline (src/ingest.ts)

Modify `ingestHtmlFile()`:

```typescript
async function ingestHtmlFile(filePath: string) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  
  const html = await fs.readFile(filePath, 'utf8');
  const $ = htmlToCleanDOM(html);
  const lessonId = extractLessonId($) ?? path.basename(filePath);
  const releaseDate = extractReleaseDate($); // NEW
  
  console.log(`   ✓ Extracted lesson ID: ${lessonId}`);
  if (releaseDate) {
    console.log(`   ✓ Release date: ${releaseDate.toISOString().split('T')[0]}`);
  }
  
  const bodyText = $('body').text().slice(0, 4000);
  const langHint = /[ąćęłńóśźż]/i.test(bodyText) ? 'pl' : undefined;
  
  const sections = segmentDOM($);
  console.log(`   ✓ Segmented into ${sections.length} section(s)`);
  
  // Generate lesson summary with LLM
  console.log(`   ⏳ Generating lesson summary...`);
  const summary = await generateLessonSummary(lessonId, sections);
  console.log(`   ✓ Generated summary (${estimateTokens(summary)} tokens)`);
  
  const chunks = toChunks(lessonId, path.basename(filePath), sections, langHint);
  
  // Store chunks in ChromaDB
  const client = new ChromaClient();
  const collectionName = lessonToCollectionName(lessonId);
  const collection = await makeCollection(client, collectionName);
  await upsertChunks(collection, chunks);
  console.log(`   ✓ Upserted chunks to ChromaDB`);
  
  // Index lesson summary for semantic search
  const lessonMetadata: LessonSummaryMeta = {
    lessonId,
    displayName: lessonId,
    summary,
    tokenEstimate: estimateTokens(summary),
    releaseDate: releaseDate ?? undefined,
  };
  await saveLessonMetadata(lessonId, lessonMetadata);
  await indexLessonSummary(client, lessonMetadata);
  console.log(`   ✓ Indexed lesson summary`);
  
  // Save manifest (existing code)
  // ...
}
```

### 9. Transform Query System (src/query.ts)

Replace lesson selection with direct query flow:

```typescript
async function queryLoop() {
  console.log('\n✅ Connected to RAG system');
  console.log('📖 Ready to answer questions from all accessible lessons');
  console.log('\nℹ️  Type your question (or "exit" to quit)\n');

  let running = true;
  const client = new ChromaClient();
  
  while (running) {
    const query = await rl.question('❓ Your question: ');

    if (query.trim().toLowerCase() === 'exit') {
      console.log('\n👋 Goodbye!');
      running = false;
      break;
    }

    if (!query.trim()) continue;

    try {
      console.log('\n⏳ Searching for relevant lessons...\n');
      
      // Step 1: Select relevant lessons via semantic search on summaries
      const relevantLessons = await selectRelevantLessons(
        client,
        query.trim(),
        3, // top-3 lessons
        0.20 // minimum similarity
      );
      
      if (relevantLessons.length === 0) {
        console.log('❌ No relevant lessons found for your query.\n');
        continue;
      }
      
      console.log(`   ✓ Found ${relevantLessons.length} relevant lesson(s):`);
      relevantLessons.forEach((l, idx) => {
        console.log(`     ${idx + 1}. ${l.lessonId} (similarity: ${l.similarity.toFixed(3)})`);
      });
      
      // Step 2: Get accessible lesson IDs (date-based filter)
      const accessibleLessonIds = await getAccessibleLessonIds();
      
      // Step 3: Filter relevant lessons by access
      const accessibleRelevant = relevantLessons.filter(l =>
        accessibleLessonIds.has(l.lessonId)
      );
      
      if (accessibleRelevant.length === 0) {
        console.log('\n⚠️  Found relevant lessons, but none are currently accessible.\n');
        console.log('   Lessons found (not accessible):');
        relevantLessons.forEach(l => {
          console.log(`     - ${l.lessonId}`);
        });
        console.log('\n');
        continue;
      }
      
      console.log(`   ✓ ${accessibleRelevant.length} accessible lesson(s)`);
      
      // Step 4: Retrieve context from accessible lessons
      const collectionNames = accessibleRelevant.map(l =>
        lessonToCollectionName(l.lessonId)
      );
      
      console.log('\n⏳ Retrieving relevant content...\n');
      
      const { context, chunks } = await retrieveContext(client, query.trim(), {
        collectionNames,
        nPerCollection: 24,
        minSim: 0.15,
        attachParent: true,
        finalTopK: 12,
        contextTokens: 900,
        similarityFloor: 0.18,
        accessibleLessonIds, // Pass to ensure hard filtering
      });
      
      if (chunks.length === 0) {
        console.log('❌ No relevant content found in accessible lessons.\n');
        continue;
      }
      
      console.log(`   ✓ Retrieved ${chunks.length} relevant chunk(s)`);
      
      // Step 5: Generate answer with LLM
      console.log('\n🤖 Generating answer...\n');
      
      const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        system: SYSTEM_PROMPT(context),
        prompt: query.trim(),
      });

      console.log('💬 ANSWER:');
      console.log('─'.repeat(80));
      console.log(text);
      console.log('─'.repeat(80));
      
      // Optional: Show source lessons
      const sourceLessons = new Set(chunks.map(c => c.meta.lessonId));
      console.log(`\n📚 Sources: ${[...sourceLessons].join(', ')}`);
      console.log('\n');
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Error: ${message}\n`);
    }
  }
}

async function main() {
  console.log('🚀 Interactive Multi-Lesson Query Tool');
  console.log('═'.repeat(80));

  try {
    await queryLoop();
    rl.close();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error: ${message}`);
    rl.close();
    process.exit(1);
  }
}
```

Remove `selectLesson()` function entirely.

## Testing Strategy

### 1. Test Data Preparation

Add release dates to test HTML files:

```html
<meta name="release-date" content="2024-01-15">
<meta name="release-date" content="2025-12-31">
```

### 2. Test Scenarios

1. Query relevant to single accessible lesson
2. Query relevant to multiple lessons (accessible + inaccessible)
3. Query relevant only to inaccessible lessons
4. Query with no relevant lessons
5. Verify chunks from inaccessible lessons never appear in results

### 3. Manual Testing

```bash
# Re-ingest with summary generation
npm start

# Test query flow
npm run query
# Enter: "Jak działa useState w React?"
# Should find React lessons, filter by date, retrieve & answer

# Test with future-dated lesson
# Should show "found but not accessible" message
```

## Configuration

### Environment Variables

Add to `.env`:

```bash
OPENAI_API_KEY=sk-...
# Optional: Override reference date for testing
ACCESS_REFERENCE_DATE=2024-12-01
```

### Data Directory Structure

```
data/
  source/          # HTML files
  metadata/        # NEW: Lesson summaries & metadata
    lesson-1.json
    lesson-2.json
  chunks/          # (existing, unused currently)
```

## Performance Considerations

1. **Summary Generation**: ~1-3s per lesson during ingest (one-time cost)
2. **Lesson Selection**: ~100-300ms (embedding + HNSW search on small collection)
3. **Multi-Collection Retrieval**: Same as current (~200-500ms)
4. **Total Query Latency**: +100-300ms vs current single-lesson query

## Cost Impact

Per lesson ingest:

- Summary generation: ~500 tokens input, ~100 tokens output = $0.0001
- 100 lessons = $0.01 (negligible)

Per query:

- Lesson selection embedding: ~$0.00001
- No significant cost increase

## Migration Path

1. Run new ingest on existing lessons → generates summaries
2. Update query.ts to new flow
3. No data migration needed (chunks remain compatible)
4. Can run both old and new query systems in parallel during transition

### To-dos

- [ ] Extend Lesson type with summary and releaseDate fields in src/types.ts
- [ ] Add extractReleaseDate() function in src/helpers/dom.ts
- [ ] Create lesson metadata storage functions in src/helpers/lessons.ts (save, get, getAll)
- [ ] Add filterAccessibleLessons() and getAccessibleLessonIds() in src/helpers/lessons.ts
- [ ] Create new src/helpers/lesson-selection.ts with semantic search over summaries
- [ ] Add generateLessonSummary() function in src/ingest.ts using LLM
- [ ] Modify ingestHtmlFile() to generate summaries, extract release dates, and index them
- [ ] Modify queryAcrossCollections() in src/retrieval.ts to accept and filter by accessibleLessonIds
- [ ] Replace lesson selection flow in src/query.ts with direct query → lesson discovery → access filter → retrieval
- [ ] Test with HTML files containing release dates, verify access control and multi-lesson retrieval