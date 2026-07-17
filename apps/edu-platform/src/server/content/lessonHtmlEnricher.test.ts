/* @vitest-environment jsdom */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  checkEnrichedLessonHtml,
  enrichLessonHtmlForTargets,
  renderEnrichedLessonHtml,
  type LessonHtmlEnrichmentTarget,
  writeEnrichedLessonHtml,
  __testUtils as enricherTestUtils,
} from './lessonHtmlEnricher';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lesson-html-enricher-'));
  tempDirs.push(dir);
  return dir;
}

async function writeFixture(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

function createTarget(rootDir: string): LessonHtmlEnrichmentTarget {
  return {
    courseKey: 'lessons10xDevs3PreworkEn',
    language: 'en',
    sourceGlob: path.join(rootDir, 'src/content-source/lessons10xDevs3Prework/pl/*.md'),
    htmlDir: path.join(rootDir, 'src/content/lessons10xDevs3Prework/en'),
    rootDir,
  };
}

async function writeCompleteFixture(rootDir: string): Promise<void> {
  await writeFixture(
    path.join(rootDir, 'src/content-source/lessons10xDevs3Prework/pl/01-1x1_polish-title.md'),
    `---
title: "[1.1] Polish title"
titleEn: "[1.1] English title"
lessonId: "01"
language: "pl"
order: 1
---

# Polish title`
  );
  await writeFixture(
    path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1.html'),
    '<html><head></head><body><h1>Translated body title</h1><p>Translated body.</p></body></html>\n'
  );
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('enrichLessonHtmlForTargets', () => {
  it('adds English lesson metadata and canonical metadata from Polish source frontmatter', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);

    const [enriched] = await enrichLessonHtmlForTargets([createTarget(rootDir)]);

    expect(enriched.outputPath).toBe(path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1.html'));
    expect(enriched.html).toContain('enriched by enrich-lesson-html');
    expect(enriched.html).toContain('<meta name="lesson-id" content="[1.1] English title">');
    expect(enriched.html).toContain('<meta name="canonical-lesson-id" content="01">');
    expect(enriched.html).toContain('<meta name="course-key" content="lessons10xDevs3PreworkEn">');
    expect(enriched.html).toContain('<meta name="source" content="translation-html">');
    expect(enriched.html).toContain('<meta name="language" content="en">');
    expect(enriched.html).toContain('<meta name="order" content="1">');
    expect(enriched.html).toContain('<h1>Translated body title</h1>');
  });

  it('replaces stale managed metadata without using body headings as lesson-id', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    await fs.writeFile(
      path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1.html'),
      [
        '<!-- enriched by enrich-lesson-html; metadata-source: old; hash: old -->',
        '<meta name="lesson-id" content="Wrong title">',
        '<meta name="canonical-lesson-id" content="wrong">',
        '<html><head></head><body><h1>Body heading is not metadata</h1></body></html>',
        '',
      ].join('\n'),
      'utf-8'
    );

    const [enriched] = await enrichLessonHtmlForTargets([createTarget(rootDir)]);

    expect(enriched.html).not.toContain('Wrong title');
    expect(enriched.html).not.toContain('canonical-lesson-id" content="wrong"');
    expect(enriched.html).toContain('<meta name="lesson-id" content="[1.1] English title">');
    expect(enriched.html).toContain('<h1>Body heading is not metadata</h1>');
  });

  it('localizes internal external lesson links to the enriched language', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    await fs.writeFile(
      path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1.html'),
      [
        '<html><head></head><body>',
        '<a href="/external/10xdevs-3-prework/pl/15">Project lesson</a>',
        '<a href="/external/10xdevs-3-prework/en/04?from=lesson">Already localized</a>',
        '<a href="/external/10xdevs-3/pl/08#section">Main course lesson</a>',
        '<a href="https://example.com/external/10xdevs-3-prework/pl/15">External URL</a>',
        '</body></html>',
        '',
      ].join('\n'),
      'utf-8'
    );

    const [enriched] = await enrichLessonHtmlForTargets([createTarget(rootDir)]);

    expect(enriched.html).toContain('href="/external/10xdevs-3-prework/en/15"');
    expect(enriched.html).toContain('href="/external/10xdevs-3-prework/en/04?from=lesson"');
    expect(enriched.html).toContain('href="/external/10xdevs-3/en/08#section"');
    expect(enriched.html).toContain('href="https://example.com/external/10xdevs-3-prework/pl/15"');
    expect(enriched.html).not.toContain('href="/external/10xdevs-3-prework/pl/15"');
    expect(enriched.html).not.toContain('href="/external/10xdevs-3/pl/08#section"');
  });

  it('fails when titleEn is missing', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    await fs.writeFile(
      path.join(rootDir, 'src/content-source/lessons10xDevs3Prework/pl/01-1x1_polish-title.md'),
      `---
title: "[1.1] Polish title"
lessonId: "01"
language: "pl"
order: 1
---

# Polish title`,
      'utf-8'
    );

    await expect(enrichLessonHtmlForTargets([createTarget(rootDir)])).rejects.toThrow(
      /Missing required titleEn/
    );
  });

  it('fails when multiple translated files share the same lesson prefix', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    await writeFixture(
      path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1_other-title.html'),
      '<html><body><p>Duplicate translation.</p></body></html>\n'
    );

    await expect(enrichLessonHtmlForTargets([createTarget(rootDir)])).rejects.toThrow(
      /Multiple translated HTML files with prefix 01-1x1/
    );
  });
});

describe('writeEnrichedLessonHtml and checkEnrichedLessonHtml', () => {
  it('writes enriched HTML and passes check mode immediately after enrichment', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    const target = createTarget(rootDir);

    const written = await writeEnrichedLessonHtml([target]);
    const check = await checkEnrichedLessonHtml([target]);

    expect(written).toHaveLength(1);
    await expect(
      fs.readFile(path.join(rootDir, 'src/content/lessons10xDevs3Prework/en/01-1x1.html'), 'utf-8')
    ).resolves.toContain(enricherTestUtils.ENRICHED_MARKER);
    expect(check).toMatchObject({
      ok: true,
      diagnostics: [],
    });
  });

  it('detects stale enriched metadata', async () => {
    const rootDir = await createTempDir();
    await writeCompleteFixture(rootDir);
    const target = createTarget(rootDir);

    await writeEnrichedLessonHtml([target]);
    await fs.writeFile(
      path.join(rootDir, 'src/content-source/lessons10xDevs3Prework/pl/01-1x1_polish-title.md'),
      `---
title: "[1.1] Polish title"
titleEn: "[1.1] Updated English title"
lessonId: "01"
language: "pl"
order: 1
---

# Polish title`,
      'utf-8'
    );

    const check = await checkEnrichedLessonHtml([target]);

    expect(check.ok).toBe(false);
    expect(check.diagnostics).toEqual([expect.stringContaining('Stale enriched HTML metadata')]);
  });
});

describe('renderEnrichedLessonHtml', () => {
  it('does not include timestamp metadata', () => {
    const html = renderEnrichedLessonHtml({
      bodyHtml: '<html><body><p>Body</p></body></html>',
      courseKey: 'lessons10xDevs3PreworkEn',
      displayLessonId: '[1.1] English title',
      language: 'en',
      lessonId: '01',
      metadataSourceHash: 'abc123',
      metadataSourcePath: 'src/content-source/lesson.md',
      order: 1,
    });

    expect(html).not.toMatch(/enriched-at|timestamp|updated-at|date/i);
  });
});
