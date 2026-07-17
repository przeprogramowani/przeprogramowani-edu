import { sanitizeForYaml } from '@/utils/decodeHtmlEntities';
import { htmlToMarkdown } from '@/utils/htmlToMarkdown';
import type { PreworkLanguage } from './preworkContent';

interface LocalizedPreworkMarkdownExportOptions {
  title: string;
  courseId: string;
  language: PreworkLanguage;
  htmlContent: string;
  exportedDate?: string;
}

export function buildLocalizedPreworkMarkdownExport({
  title,
  courseId,
  language,
  htmlContent,
  exportedDate = new Date().toISOString().split('T')[0],
}: LocalizedPreworkMarkdownExportOptions): string {
  let markdownContent = htmlToMarkdown(htmlContent);

  markdownContent = markdownContent.replace(/^<!DOCTYPE[^>]*>/i, '').trim();
  markdownContent = markdownContent.replace(/^<html[^>]*>/i, '').trim();

  const cleanTitle = sanitizeForYaml(title);
  const frontmatter = `---
title: "${cleanTitle}"
course: "${courseId}"
language: "${language}"
source: "Przeprogramowani.pl"
exported: "${exportedDate}"
format: "markdown"
---

`;

  return frontmatter + markdownContent;
}
