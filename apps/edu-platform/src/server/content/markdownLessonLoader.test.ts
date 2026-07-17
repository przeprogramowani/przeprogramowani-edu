/* @vitest-environment jsdom */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { markdownLessonLoader } from './markdownLessonLoader';

const tempDirs: string[] = [];

async function createFixture(files: Record<string, string>): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'markdown-lesson-loader-'));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(([fileName, content]) => fs.writeFile(path.join(dir, fileName), content))
  );

  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('markdownLessonLoader', () => {
  it('uses lessonId frontmatter as entry ID in frontmatterLessonId mode', async () => {
    const dir = await createFixture({
      'lesson-two.md': `---
title: "Second lesson"
lessonId: "02"
language: "pl"
order: 2
---

# Second lesson

Body`,
    });

    const entries = await markdownLessonLoader(`${dir}/*.md`, {
      idStrategy: 'frontmatterLessonId',
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      id: '02',
      lessonId: '02',
      language: 'pl',
      order: 2,
      name: 'Second lesson',
    });
  });

  it('sorts lessonId-mode entries by numeric order and then lessonId', async () => {
    const dir = await createFixture({
      'third.md': `---
title: "Third"
lessonId: "03"
language: "pl"
order: 2
---

# Third`,
      'second.md': `---
title: "Second"
lessonId: "02"
language: "pl"
order: 1
---

# Second`,
      'tenth.md': `---
title: "Tenth"
lessonId: "10"
language: "pl"
order: 2
---

# Tenth`,
    });

    const entries = await markdownLessonLoader(`${dir}/*.md`, {
      idStrategy: 'frontmatterLessonId',
    });

    expect(entries.map((entry) => entry.id)).toEqual(['02', '03', '10']);
  });

  it('allows hidden lessons without lessonId metadata', async () => {
    const dir = await createFixture({
      '00-meta.md': `---
title: "Editorial notes"
hidden: true
---

# Editorial notes`,
      'lesson.md': `---
title: "Visible"
lessonId: "02"
language: "pl"
order: 2
---

# Visible`,
    });

    const entries = await markdownLessonLoader(`${dir}/*.md`, {
      idStrategy: 'frontmatterLessonId',
    });

    expect(entries.map((entry) => entry.id)).toEqual(['02']);
  });

  it('fails with a useful error when lessonId is missing in lessonId mode', async () => {
    const dir = await createFixture({
      'missing-id.md': `---
title: "Missing ID"
language: "pl"
order: 1
---

# Missing ID`,
    });

    await expect(
      markdownLessonLoader(`${dir}/*.md`, {
        idStrategy: 'frontmatterLessonId',
      })
    ).rejects.toThrow(/Missing required lessonId in Markdown lesson: .*missing-id\.md/);
  });

  it('uses defaultLanguage when language frontmatter is omitted', async () => {
    const dir = await createFixture({
      'english.md': `---
title: "English lesson"
lessonId: "02"
order: 2
---

# English lesson`,
    });

    const entries = await markdownLessonLoader(`${dir}/*.md`, {
      idStrategy: 'frontmatterLessonId',
      defaultLanguage: 'en',
    });

    expect(entries[0].language).toBe('en');
  });
});
