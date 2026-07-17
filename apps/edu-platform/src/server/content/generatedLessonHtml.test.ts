/* @vitest-environment jsdom */

import fs from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';
import {
  checkGeneratedLessonHtml,
  createDefaultLessonHtmlGenerationTargets,
  __testUtils as generatorTestUtils,
} from './lessonHtmlGenerator';
import {
  checkEnrichedLessonHtml,
  createDefaultLessonHtmlEnrichmentTargets,
  __testUtils as enricherTestUtils,
} from './lessonHtmlEnricher';

const projectRoot = process.cwd();
const plSourceDir = path.join(projectRoot, 'src/content-source/lessons10xDevs3Prework/pl');
const plOutputDir = path.join(projectRoot, 'src/content/lessons10xDevs3Prework/pl');
const enOutputDir = path.join(projectRoot, 'src/content/lessons10xDevs3Prework/en');

async function listFiles(dir: string, extension: string): Promise<string[]> {
  return (await fs.readdir(dir)).filter((fileName) => fileName.endsWith(extension)).sort();
}

describe('generated lesson HTML files', () => {
  it('keeps generator-owned HTML up to date', async () => {
    const result = await checkGeneratedLessonHtml(createDefaultLessonHtmlGenerationTargets(projectRoot));

    expect(result.ok, result.diagnostics.join('\n')).toBe(true);
  });

  it('has matching generated PL HTML for each non-hidden PL Markdown source', async () => {
    const sourceFiles = await listFiles(plSourceDir, '.md');
    const generatedFiles = await listFiles(plOutputDir, '.html');

    expect(generatedFiles).toEqual(
      sourceFiles.map((fileName) => fileName.replace(/\.md$/, '.html'))
    );
  });

  it('does not mark translation-owned EN HTML as generator-owned', async () => {
    const englishFiles = await listFiles(enOutputDir, '.html');

    expect(englishFiles.length).toBeGreaterThan(0);

    for (const fileName of englishFiles) {
      const content = await fs.readFile(path.join(enOutputDir, fileName), 'utf-8');
      expect(content).not.toContain(generatorTestUtils.GENERATED_MARKER);
    }
  });

  it('keeps translation-owned EN HTML metadata enriched', async () => {
    const result = await checkEnrichedLessonHtml(createDefaultLessonHtmlEnrichmentTargets(projectRoot, 'en'));

    expect(result.ok, result.diagnostics.join('\n')).toBe(true);
    expect(result.enriched.length).toBeGreaterThan(0);
  });

  it('marks translation-owned EN HTML with the enrichment marker', async () => {
    const englishFiles = await listFiles(enOutputDir, '.html');

    for (const fileName of englishFiles) {
      const content = await fs.readFile(path.join(enOutputDir, fileName), 'utf-8');
      expect(content).toContain(enricherTestUtils.ENRICHED_MARKER);
    }
  });

  it('does not include timestamp-like generator metadata in generated PL HTML', async () => {
    const generatedFiles = await listFiles(plOutputDir, '.html');

    for (const fileName of generatedFiles) {
      const content = await fs.readFile(path.join(plOutputDir, fileName), 'utf-8');
      expect(content).not.toMatch(/<meta name="(?:generated-at|timestamp|updated-at|date)"/i);
    }
  });
});
