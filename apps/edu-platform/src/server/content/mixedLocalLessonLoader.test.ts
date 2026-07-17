/* @vitest-environment jsdom */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { mixedLocalLessonLoader } from './mixedLocalLessonLoader';

const tempDirs: string[] = [];

async function createFixture(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mixed-local-lesson-loader-'));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(([fileName, content]) => fs.writeFile(path.join(dir, fileName), content))
  );

  return dir;
}

async function loadFixture(dir: string) {
  return mixedLocalLessonLoader({
    markdownPattern: `${dir}/*.md`,
    htmlPattern: `${dir}/*.html`,
  });
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('mixedLocalLessonLoader', () => {
  it('loads Markdown-only lessons', async () => {
    const dir = await createFixture({
      '02-markdown.md': '# Markdown lesson\n\nBody',
    });

    const entries = await loadFixture(dir);

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: '02',
      name: 'Markdown lesson',
      source: 'markdown',
    });
    expect(entries[0].content).toContain('<p>Body</p>');
  });

  it('loads HTML-only lessons with legacy filename and meta parsing', async () => {
    const dir = await createFixture({
      '03-html.html': '<html><head><meta name="lesson-id" content="HTML lesson"></head><body>Body</body></html>',
    });

    const entries = await loadFixture(dir);

    expect(entries).toEqual([
      {
        id: '03',
        name: 'HTML lesson',
        source: 'html',
        content: '<html><head><meta name="lesson-id" content="HTML lesson"></head><body>Body</body></html>',
      },
    ]);
  });

  it('loads mixed unique Markdown and HTML lessons sorted by numeric-aware ID', async () => {
    const dir = await createFixture({
      '10-html.html': '<meta name="lesson-id" content="Tenth">',
      '02-markdown.md': '# Second\n\nBody',
    });

    const entries = await loadFixture(dir);

    expect(entries.map((entry) => `${entry.id}:${entry.source}`)).toEqual(['02:markdown', '10:html']);
  });

  it('fails loudly when Markdown and HTML lessons share an ID', async () => {
    const dir = await createFixture({
      '02-markdown.md': '# Markdown lesson',
      '02-html.html': '<meta name="lesson-id" content="HTML lesson">',
    });

    await expect(loadFixture(dir)).rejects.toThrow(
      'Duplicate local lesson id "02" found in markdown and html entries'
    );
  });

  it('returns an empty list when no local lessons exist', async () => {
    const dir = await createFixture({});

    await expect(loadFixture(dir)).resolves.toEqual([]);
  });
});
