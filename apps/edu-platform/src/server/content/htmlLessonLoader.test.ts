/* @vitest-environment jsdom */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { __testUtils, htmlLessonLoader } from './htmlLessonLoader';

const tempDirs: string[] = [];

async function createFixture(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-lesson-loader-'));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(([fileName, content]) => fs.writeFile(path.join(dir, fileName), content))
  );

  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('htmlLessonLoader helpers', () => {
  it('extracts legacy lesson name from lesson-id meta', () => {
    expect(__testUtils.extractLegacyLessonName('<meta name="lesson-id" content="Legacy title">')).toBe(
      'Legacy title'
    );
  });

  it('decodes HTML attributes in meta values', () => {
    expect(__testUtils.decodeHtmlAttribute('A &amp; &quot;quoted&quot; &lt;title&gt;')).toBe(
      'A & "quoted" <title>'
    );
  });

  it('extracts meta content regardless of attribute order', () => {
    expect(__testUtils.extractMetaContent('<meta content="02" name="canonical-lesson-id">', 'canonical-lesson-id')).toBe(
      '02'
    );
  });
});

describe('htmlLessonLoader', () => {
  it('loads legacy HTML lessons using filename ID and lesson-id title', async () => {
    const dir = await createFixture({
      '03-html.html': '<meta name="lesson-id" content="HTML lesson"><p>Body</p>',
    });

    const entries = await htmlLessonLoader(`${dir}/*.html`);

    expect(entries).toEqual([
      {
        id: '03',
        name: 'HTML lesson',
        content: '<meta name="lesson-id" content="HTML lesson"><p>Body</p>',
        source: 'html',
      },
    ]);
  });

  it('loads generated/translation metadata when present', async () => {
    const dir = await createFixture({
      '02-generated.html': `<meta name="lesson-id" content="[1.2] Generated lesson">
<meta name="canonical-lesson-id" content="02">
<meta name="language" content="pl">
<meta name="order" content="2">
<html><body><p>Body</p></body></html>`,
    });

    const entries = await htmlLessonLoader(`${dir}/*.html`);

    expect(entries[0]).toMatchObject({
      id: '02',
      name: '[1.2] Generated lesson',
      lessonId: '02',
      language: 'pl',
      order: 2,
      source: 'html',
    });
  });

  it('sorts entries by numeric-aware filename ID', async () => {
    const dir = await createFixture({
      '10-tenth.html': '<meta name="lesson-id" content="Tenth">',
      '02-second.html': '<meta name="lesson-id" content="Second">',
    });

    const entries = await htmlLessonLoader(`${dir}/*.html`);

    expect(entries.map((entry) => entry.id)).toEqual(['02', '10']);
  });
});
