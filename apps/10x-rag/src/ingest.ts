import fs from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Import helper functions
import { htmlToCleanDOM, extractLessonId } from './helpers/dom.js';
import { segmentDOM } from './helpers/segmentation.js';
import { toChunks } from './helpers/chunking.js';
import { createChromaClient, makeCollection, upsertChunks } from './helpers/chroma.js';
import {
  getLessonsFromSource,
  lessonToCollectionName,
  saveLessonMetadata,
  getLessonMetadata,
} from './helpers/lessons.js';
import { indexLessonSummary } from './helpers/lesson-selection.js';
import { getLessonReleaseDate } from './config/publication.js';
import { estimateTokens } from './helpers/utilities.js';
import { LESSON_SUMMARY_PROMPT } from './prompts/lesson-summary.prompt.js';
import { SECTION_CONTEXT_PROMPT } from './prompts/section-context.prompt.js';
import type { Section, LessonSummaryMeta } from './types.js';

async function generateLessonSummary(
  otherLessonTitles: string[],
  lessonId: string,
  sections: Section[]
): Promise<string> {
  // Build content preview (first ~2000 tokens from all sections)
  const preview = sections
    .flatMap((s) => s.blocks.map((b) => b.rawText))
    .join(' ')
    .slice(0, 8000); // ~2000 tokens

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: LESSON_SUMMARY_PROMPT(otherLessonTitles, lessonId, preview),
  });

  return text.trim();
}

async function generateSectionContext(lessonId: string, lessonSummary: string, section: Section): Promise<string> {
  // Build section content preview (first ~1500 tokens)
  const sectionContent = section.blocks
    .map((b) => b.markdown)
    .join('\n\n')
    .slice(0, 6000); // ~1500 tokens

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: SECTION_CONTEXT_PROMPT(lessonId, lessonSummary, section.breadcrumbs, sectionContent),
  });

  return text.trim();
}

async function ingestHtmlFile(filePath: string, allLessons: Awaited<ReturnType<typeof getLessonsFromSource>>) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  console.log(`   Path: ${filePath}`);

  const html = await fs.readFile(filePath, 'utf8');
  console.log(`   ✓ Read HTML file (${(html.length / 1024).toFixed(2)} KB)`);

  const $ = htmlToCleanDOM(html);
  const lessonId = extractLessonId($) ?? path.basename(filePath);
  console.log(`   ✓ Extracted lesson ID: ${lessonId}`);

  // Get release date from publication config
  const releaseDate = getLessonReleaseDate(lessonId);
  if (releaseDate) {
    console.log(`   ✓ Release date: ${releaseDate.toISOString()}`);
  }

  // Try to infer language quickly from document text (very rough)
  const bodyText = $('body').text().slice(0, 4000);
  const langHint = /[ąćęłńóśźż]/i.test(bodyText) ? 'pl' : undefined;
  console.log(`   ✓ Detected language: ${langHint ?? 'en (default)'}`);

  const sections = segmentDOM($);
  console.log(`   ✓ Segmented into ${sections.length} section(s)`);

  // Check if summary already exists
  const existingMetadata = await getLessonMetadata(lessonId);
  let summary: string;

  if (existingMetadata?.summary) {
    console.log(`   ✓ Using existing summary (${estimateTokens(existingMetadata.summary)} tokens)`);
    summary = existingMetadata.summary;
  } else {
    // Generate lesson summary with LLM
    const otherLessonTitles = allLessons.filter((l) => l.lessonId !== lessonId).map((l) => l.lessonId);
    console.log(`   ⏳ Generating lesson summary...`);
    summary = await generateLessonSummary(otherLessonTitles, lessonId, sections);
    console.log(`   ✓ Generated summary (${estimateTokens(summary)} tokens)`);
  }

  // Generate section contexts with LLM (in parallel for efficiency)
  console.log(`   ⏳ Generating contexts for ${sections.length} section(s)...`);
  const sectionContextPromises = sections.map((section) => generateSectionContext(lessonId, summary, section));
  const sectionContexts = await Promise.all(sectionContextPromises);

  // Attach contexts to sections
  sections.forEach((section, idx) => {
    section.context = sectionContexts[idx];
  });
  const totalContextTokens = sectionContexts.reduce((sum, ctx) => sum + estimateTokens(ctx), 0);
  console.log(
    `   ✓ Generated section contexts (${totalContextTokens} tokens total, avg ${Math.round(
      totalContextTokens / sections.length
    )} per section)`
  );

  const chunks = toChunks(lessonId, path.basename(filePath), sections, langHint);
  console.log(`   ✓ Created ${chunks.length} chunk(s)`);

  const client = createChromaClient();
  const collectionName = lessonToCollectionName(lessonId);
  const collection = await makeCollection(client, collectionName);
  console.log(`   ✓ Connected to collection: ${collectionName}`);

  await upsertChunks(collection, chunks);
  console.log(`   ✓ Upserted chunks to ChromaDB`);

  // Index lesson summary for semantic search
  const lessonMetadata: LessonSummaryMeta = {
    lessonId,
    displayName: lessonId,
    summary,
    tokenEstimate: estimateTokens(summary),
    ...(releaseDate && { releaseDate }),
  };
  await saveLessonMetadata(lessonId, lessonMetadata);
  await indexLessonSummary(client, lessonMetadata);
  console.log(`   ✓ Indexed lesson summary`);

  // Simple ingest manifest for debugging
  const manifest = {
    lessonId,
    file: path.basename(filePath),
    sections: sections.map((s) => ({ slug: s.slug, title: s.title, blocks: s.blocks.length, order: s.order })),
    chunks: chunks.map((c) => ({ id: c.id, tokenEstimate: c.meta.tokenEstimate, span: c.meta.blockSpan })),
  };

  // Save manifest to data/manifests directory (separate from source)
  const manifestsDir = path.join(process.cwd(), 'data', 'manifests');
  await fs.mkdir(manifestsDir, { recursive: true });
  const manifestFileName = path.basename(filePath) + '.ingest.json';
  const out = path.join(manifestsDir, manifestFileName);
  await fs.writeFile(out, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`   ✓ Saved manifest: ${manifestFileName}`);
  console.log(`   ✅ Successfully ingested!`);
}

// Scan data/source directory and ingest all HTML files
async function scanAndIngest() {
  try {
    const lessons = await getLessonsFromSource();

    if (lessons.length === 0) {
      console.log('No HTML files found in data/source directory.');
      return;
    }

    console.log(`\n🔍 Found ${lessons.length} HTML file(s) in data/source directory:`);
    lessons.forEach((lesson, idx) => {
      console.log(`   ${idx + 1}. ${lesson.file}`);
    });
    console.log('\n🚀 Starting ingestion with parallel processing (4 lessons at a time)...');

    const PARALLEL_LIMIT = 4;
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    // Process lessons in batches of PARALLEL_LIMIT
    for (let i = 0; i < lessons.length; i += PARALLEL_LIMIT) {
      const batch = lessons.slice(i, i + PARALLEL_LIMIT);
      const batchNum = Math.floor(i / PARALLEL_LIMIT) + 1;
      const totalBatches = Math.ceil(lessons.length / PARALLEL_LIMIT);

      console.log(`\n[${'='.repeat(60)}]`);
      console.log(`[Batch ${batchNum}/${totalBatches}] Processing ${batch.length} lesson(s) in parallel...`);

      // Process all lessons in this batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (lesson, batchIdx) => {
          const globalIdx = i + batchIdx + 1;
          console.log(`\n[${globalIdx}/${lessons.length}] Starting: ${lesson.file}`);
          try {
            await ingestHtmlFile(lesson.filePath, lessons);
            return { success: true, lesson: lesson.file };
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`\n[${globalIdx}/${lessons.length}] ❌ Failed to process ${lesson.file}: ${message}`);
            return { success: false, lesson: lesson.file, error: message };
          }
        })
      );

      // Count results
      results.forEach((result) => {
        processed++;
        if (result.status === 'fulfilled' && result.value.success) {
          succeeded++;
        } else {
          failed++;
        }
      });

      console.log(`\n[Batch ${batchNum}/${totalBatches}] Complete. Progress: ${processed}/${lessons.length}`);
    }

    console.log(`\n[${'='.repeat(60)}]`);
    console.log(`\n✨ Ingestion complete!`);
    console.log(`   Total: ${lessons.length} file(s)`);
    console.log(`   ✅ Succeeded: ${succeeded}`);
    if (failed > 0) {
      console.log(`   ❌ Failed: ${failed}`);
    }

    // Exit the process explicitly to close any open connections
    process.exit(0);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

scanAndIngest().catch((e) => {
  console.error(e);
  process.exit(1);
});
