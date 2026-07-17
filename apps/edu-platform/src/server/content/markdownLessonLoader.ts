import fs from 'fs';
import { glob } from 'glob';
import {
  extractLeadingHeading,
  parseFrontmatter,
  renderMarkdown,
  stripLeadingH1,
  type LessonFrontmatter,
} from './markdownLessonTransforms';

export interface MarkdownLessonEntry {
  id: string;
  name: string;
  content: string;
  lessonId?: string;
  language?: 'pl' | 'en';
  order?: number;
  slug?: string;
}

interface MarkdownLessonLoaderOptions {
  idStrategy?: 'filenamePrefix' | 'frontmatterLessonId';
  defaultLanguage?: 'pl' | 'en';
}

function getFilenamePrefixId(file: string): string {
  return file.split('/').pop()?.substring(0, 2) || '';
}

function normalizeLanguage(
  data: LessonFrontmatter,
  options: MarkdownLessonLoaderOptions
): 'pl' | 'en' | undefined {
  return data.language ?? options.defaultLanguage;
}

function validateLessonMetadata(
  file: string,
  data: LessonFrontmatter,
  options: MarkdownLessonLoaderOptions
): Required<Pick<LessonFrontmatter, 'lessonId' | 'language' | 'order'>> {
  const lessonId = data.lessonId?.trim();
  if (!lessonId) {
    throw new Error(`Missing required lessonId in Markdown lesson: ${file}`);
  }

  const language = normalizeLanguage(data, options);
  if (!language) {
    throw new Error(`Missing required language in Markdown lesson: ${file}`);
  }

  if (language !== 'pl' && language !== 'en') {
    throw new Error(`Invalid language "${language}" in Markdown lesson: ${file}`);
  }

  if (typeof data.order !== 'number' || !Number.isFinite(data.order)) {
    throw new Error(`Missing required numeric order in Markdown lesson: ${file}`);
  }

  return {
    lessonId,
    language,
    order: data.order,
  };
}

export async function markdownLessonLoader(
  pattern: string,
  options: MarkdownLessonLoaderOptions = {}
): Promise<MarkdownLessonEntry[]> {
  const idStrategy = options.idStrategy ?? 'filenamePrefix';
  const files = await glob(pattern);
  const entries = await Promise.all(
    files.map(async (file) => {
      const source = await fs.promises.readFile(file, 'utf-8');
      const { data, body } = parseFrontmatter(source);

      if (data.hidden) {
        return null;
      }

      const fallbackTitle = extractLeadingHeading(body) ?? '';
      const name = data.title?.trim() || fallbackTitle;
      const content = await renderMarkdown(stripLeadingH1(body));
      const validatedMetadata =
        idStrategy === 'frontmatterLessonId'
          ? validateLessonMetadata(file, data, options)
          : null;
      const language = normalizeLanguage(data, options);
      if (language && language !== 'pl' && language !== 'en') {
        throw new Error(`Invalid language "${language}" in Markdown lesson: ${file}`);
      }
      const lessonId = validatedMetadata?.lessonId ?? data.lessonId?.trim();
      const order = validatedMetadata?.order ?? data.order;

      return {
        id: idStrategy === 'frontmatterLessonId' ? validatedMetadata!.lessonId : getFilenamePrefixId(file),
        name,
        content,
        ...(lessonId ? { lessonId } : {}),
        ...(language ? { language } : {}),
        ...(typeof order === 'number' ? { order } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
      };
    })
  );

  return entries
    .filter((entry): entry is MarkdownLessonEntry => entry !== null)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const lessonIdA = a.lessonId ?? a.id;
      const lessonIdB = b.lessonId ?? b.id;
      return lessonIdA.localeCompare(lessonIdB, undefined, { numeric: true });
    });
}

export const __testUtils = {
  parseFrontmatter,
  extractLeadingHeading,
  stripLeadingH1,
  renderMarkdown,
};
