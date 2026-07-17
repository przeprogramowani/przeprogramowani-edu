import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';

type PreworkLanguage = 'pl' | 'en';
type PreworkSource = 'pl-source' | 'en-html';

interface LessonFrontmatter {
  hidden?: boolean;
  lessonId?: string;
  language?: PreworkLanguage;
  order?: number;
}

interface LessonMetadata {
  fileName: string;
  lessonId: string;
  order: number;
}

const preworkDir = fileURLToPath(new URL('../../content/lessons10xDevs3Prework/', import.meta.url));
const preworkSourceDir = fileURLToPath(new URL('../../content-source/lessons10xDevs3Prework/', import.meta.url));

async function listMarkdownFiles(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).filter((fileName) => fileName.endsWith('.md')).sort();
}

async function listHtmlFiles(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).filter((fileName) => fileName.endsWith('.html')).sort();
}

async function readFrontmatter(filePath: string): Promise<LessonFrontmatter> {
  const source = await fs.readFile(filePath, 'utf-8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? (parseYaml(match[1]) as LessonFrontmatter) : {};
}

function extractMetaContent(content: string, name: string): string | null {
  const metaTags = content.match(/<meta\b[^>]*>/gi) ?? [];

  for (const metaTag of metaTags) {
    const nameMatch = metaTag.match(/\bname=["']([^"']*)["']/i);
    if (!nameMatch || nameMatch[1] !== name) {
      continue;
    }

    const contentMatch = metaTag.match(/\bcontent=["']([^"']*)["']/i);
    return contentMatch ? contentMatch[1] : null;
  }

  return null;
}

async function readPolishSourceLessons(): Promise<LessonMetadata[]> {
  const dir = path.join(preworkSourceDir, 'pl');
  const files = await listMarkdownFiles(dir);
  const lessons: LessonMetadata[] = [];

  for (const fileName of files) {
    const frontmatter = await readFrontmatter(path.join(dir, fileName));

    if (frontmatter.hidden) {
      continue;
    }

    expect(frontmatter.lessonId, `pl/${fileName} is missing lessonId`).toBeDefined();
    expect(frontmatter.language, `pl/${fileName} has wrong language`).toBe('pl');
    expect(typeof frontmatter.order, `pl/${fileName} is missing numeric order`).toBe('number');
    expect(Number.isFinite(frontmatter.order), `pl/${fileName} order must be finite`).toBe(true);
    expect(fileName.startsWith(`${frontmatter.lessonId}-`), `pl/${fileName} must start with lessonId`).toBe(true);

    lessons.push({
      fileName,
      lessonId: frontmatter.lessonId!,
      order: frontmatter.order!,
    });
  }

  return lessons.sort((a, b) => a.order - b.order || a.lessonId.localeCompare(b.lessonId));
}

async function readEnglishHtmlLessons(): Promise<LessonMetadata[]> {
  const dir = path.join(preworkDir, 'en');
  const files = await listHtmlFiles(dir);
  const lessons: LessonMetadata[] = [];

  for (const fileName of files) {
    const content = await fs.readFile(path.join(dir, fileName), 'utf-8');
    const lessonId = extractMetaContent(content, 'canonical-lesson-id');
    const language = extractMetaContent(content, 'language');
    const order = Number(extractMetaContent(content, 'order'));

    expect(lessonId, `en/${fileName} is missing canonical-lesson-id`).toBeDefined();
    expect(language, `en/${fileName} has wrong language`).toBe('en');
    expect(Number.isFinite(order), `en/${fileName} is missing numeric order`).toBe(true);
    expect(fileName.startsWith(`${lessonId}-`), `en/${fileName} must start with lessonId`).toBe(true);

    lessons.push({
      fileName,
      lessonId: lessonId!,
      order,
    });
  }

  return lessons.sort((a, b) => a.order - b.order || a.lessonId.localeCompare(b.lessonId));
}

function expectUniqueLessonIds(source: PreworkSource, lessons: LessonMetadata[]) {
  const lessonIds = lessons.map((lesson) => lesson.lessonId);
  expect(new Set(lessonIds).size, `${source} lessonIds must be unique`).toBe(lessonIds.length);
}

describe('10xDevs 3 prework lesson pairs', () => {
  it('keeps learner-facing lessons out of the root editorial folder', async () => {
    const rootFiles = await listMarkdownFiles(preworkSourceDir);
    const learnerFiles = rootFiles.filter((fileName) => /^\d{2}-.+\.md$/.test(fileName) && !fileName.startsWith('00-'));

    expect(learnerFiles).toEqual([]);
  });

  it('does not keep English Markdown sources in the authoring tree', async () => {
    await expect(fs.readdir(path.join(preworkSourceDir, 'en'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('keeps PL Markdown and EN HTML lesson pairs aligned', async () => {
    const [plLessons, enLessons] = await Promise.all([
      readPolishSourceLessons(),
      readEnglishHtmlLessons(),
    ]);

    expectUniqueLessonIds('pl-source', plLessons);
    expectUniqueLessonIds('en-html', enLessons);

    expect(plLessons.map((lesson) => lesson.lessonId)).toEqual(enLessons.map((lesson) => lesson.lessonId));
    expect(plLessons.map((lesson) => lesson.order)).toEqual(enLessons.map((lesson) => lesson.order));
  });
});
