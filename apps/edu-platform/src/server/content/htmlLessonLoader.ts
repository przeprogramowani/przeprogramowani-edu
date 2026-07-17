import fs from 'fs';
import { glob } from 'glob';

export interface HtmlLessonEntry {
  id: string;
  name: string;
  content: string;
  lessonId?: string;
  language?: 'pl' | 'en';
  order?: number;
  source?: 'html';
}

function getFilenamePrefixId(file: string): string {
  return file.split('/').pop()?.substring(0, 2) || '';
}

function extractLegacyLessonName(content: string): string {
  return extractMetaContent(content, 'lesson-id') ?? '';
}

function extractMetaContent(content: string, name: string): string | null {
  const metaTags = content.match(/<meta\b[^>]*>/gi) ?? [];

  for (const metaTag of metaTags) {
    const nameMatch = metaTag.match(/\bname=["']([^"']*)["']/i);
    if (!nameMatch || nameMatch[1] !== name) {
      continue;
    }

    const contentMatch = metaTag.match(/\bcontent=["']([^"']*)["']/i);
    if (contentMatch) {
      return decodeHtmlAttribute(contentMatch[1]);
    }
  }

  return null;
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function extractLanguage(content: string): 'pl' | 'en' | undefined {
  const language = extractMetaContent(content, 'language');

  if (language === 'pl' || language === 'en') {
    return language;
  }

  return undefined;
}

function extractOrder(content: string): number | undefined {
  const order = extractMetaContent(content, 'order');
  if (!order) {
    return undefined;
  }

  const parsedOrder = Number(order);
  return Number.isFinite(parsedOrder) ? parsedOrder : undefined;
}

export async function htmlLessonLoader(pattern: string): Promise<HtmlLessonEntry[]> {
  const files = await glob(pattern);
  const entries = await Promise.all(
    files.map(async (file): Promise<HtmlLessonEntry> => {
      const content = await fs.promises.readFile(file, 'utf-8');
      const lessonId = extractMetaContent(content, 'canonical-lesson-id');
      const language = extractLanguage(content);
      const order = extractOrder(content);

      return {
        id: getFilenamePrefixId(file),
        name: extractLegacyLessonName(content),
        content,
        ...(lessonId ? { lessonId } : {}),
        ...(language ? { language } : {}),
        ...(typeof order === 'number' ? { order } : {}),
        source: 'html',
      };
    })
  );

  return entries.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export const __testUtils = {
  decodeHtmlAttribute,
  extractMetaContent,
  extractLegacyLessonName,
  getFilenamePrefixId,
};
