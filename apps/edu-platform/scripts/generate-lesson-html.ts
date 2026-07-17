#!/usr/bin/env tsx

import { readFile } from 'node:fs/promises';

import {
  checkGeneratedLessonHtml,
  createDefaultLessonHtmlGenerationTargets,
  generateLessonHtmlForTargets,
  writeGeneratedLessonHtml,
  type LessonHtmlGenerationTarget,
} from '../src/server/content/lessonHtmlGenerator.js';

function filterToGlobPattern(filter: string): string {
  if (/^m\d+$/.test(filter)) {
    return `*-${filter}l*.md`;
  }
  if (/^m\d+-l\d+$/.test(filter)) {
    return `*-${filter.replace('-l', 'l')}-*.md`;
  }
  throw new Error(`Unrecognized --filter format: "${filter}". Expected "m<N>" or "m<N>-l<N>".`);
}

function applyFilters(
  targets: LessonHtmlGenerationTarget[],
  filters: string[]
): LessonHtmlGenerationTarget[] {
  const result: LessonHtmlGenerationTarget[] = [];

  for (const target of targets) {
    if (target.courseKey !== 'lessons10xDevs3Pl') continue;

    for (const filter of filters) {
      const globPattern = filterToGlobPattern(filter);
      result.push({
        ...target,
        sourceGlob: target.sourceGlob.replace('*.md', globPattern),
      });
    }
  }

  return result;
}

async function dryRunStatus(outputPath: string, html: string): Promise<'new' | 'changed' | 'unchanged'> {
  try {
    const existing = await readFile(outputPath, 'utf-8');
    return existing === html ? 'unchanged' : 'changed';
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return 'new';
    }
    throw error;
  }
}

async function main(): Promise<void> {
  const checkMode = process.argv.includes('--check');
  const dryRunMode = process.argv.includes('--dry-run');
  const filters = process.argv
    .filter((a) => a.startsWith('--filter='))
    .map((a) => a.slice('--filter='.length));

  let targets = createDefaultLessonHtmlGenerationTargets();

  if (checkMode) {
    const result = await checkGeneratedLessonHtml(targets);

    if (!result.ok) {
      console.error('Generated lesson HTML is stale.');
      for (const diagnostic of result.diagnostics) {
        console.error(`- ${diagnostic}`);
      }
      process.exit(1);
    }

    console.log(`Generated lesson HTML is up to date (${result.generated.length} files checked).`);
    return;
  }

  if (filters.length > 0) {
    targets = applyFilters(targets, filters);
    console.log(`Filtering to: ${filters.join(', ')}`);
  }

  if (dryRunMode) {
    const generated = await generateLessonHtmlForTargets(targets);
    for (const lesson of generated) {
      const status = await dryRunStatus(lesson.outputPath, lesson.html);
      console.log(`[dry-run] ${status}: ${lesson.outputPath}`);
    }
    console.log(`[dry-run] ${generated.length} lesson HTML files would be written. No files were changed.`);
    return;
  }

  const generated = await writeGeneratedLessonHtml(targets);
  for (const lesson of generated) {
    console.log(`Generated ${lesson.outputPath}`);
  }
  console.log(`Generated ${generated.length} lesson HTML files.`);
}

main().catch((error) => {
  console.error('Failed to generate lesson HTML:', (error as Error).message);
  process.exit(1);
});
