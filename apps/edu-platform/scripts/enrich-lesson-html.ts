#!/usr/bin/env tsx

import {
  checkEnrichedLessonHtml,
  createDefaultLessonHtmlEnrichmentTargets,
  writeEnrichedLessonHtml,
  type LessonHtmlEnrichmentLanguage,
} from '../src/server/content/lessonHtmlEnricher.js';

function getArgValue(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

function getLanguage(): LessonHtmlEnrichmentLanguage {
  const language = getArgValue('--lang');

  if (language === 'en') {
    return language;
  }

  throw new Error('Missing or unsupported language. Use: --lang en');
}

async function main(): Promise<void> {
  const checkMode = process.argv.includes('--check');
  const language = getLanguage();
  const targets = createDefaultLessonHtmlEnrichmentTargets(process.cwd(), language);

  if (checkMode) {
    const result = await checkEnrichedLessonHtml(targets);

    if (!result.ok) {
      console.error('Enriched lesson HTML metadata is stale.');
      for (const diagnostic of result.diagnostics) {
        console.error(`- ${diagnostic}`);
      }
      process.exit(1);
    }

    console.log(`Enriched lesson HTML metadata is up to date (${result.enriched.length} files checked).`);
    return;
  }

  const enriched = await writeEnrichedLessonHtml(targets);
  for (const lesson of enriched) {
    console.log(`Enriched ${lesson.outputPath}`);
  }
  console.log(`Enriched ${enriched.length} lesson HTML files.`);
}

main().catch((error) => {
  console.error('Failed to enrich lesson HTML:', (error as Error).message);
  process.exit(1);
});
