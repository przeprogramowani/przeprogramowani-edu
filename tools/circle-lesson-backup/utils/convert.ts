import TurndownService from 'turndown';
import { marked } from 'marked';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Keep iframes as raw HTML in markdown (no markdown equivalent)
turndown.keep(['iframe']);

/**
 * Converts Circle lesson HTML to Markdown.
 * Strips any <meta> tags and extracts the body content.
 */
export function htmlToMarkdown(html: string): string {
  // Remove meta tags injected by the old backup pipeline
  const cleaned = html.replace(/<meta[^>]*>/gi, '');
  return turndown.turndown(cleaned).trim();
}

/**
 * Converts Markdown back to HTML for pushing to Circle.
 */
export function markdownToHtml(markdown: string): string {
  return (marked.parse(markdown) as string).trim();
}

/**
 * Builds a markdown file with YAML frontmatter.
 */
export function buildMarkdownFile(
  lessonId: number,
  sectionId: number,
  name: string,
  markdownBody: string
): string {
  return `---
lessonId: ${lessonId}
sectionId: ${sectionId}
name: "${name}"
---

${markdownBody}
`;
}

/**
 * Parses a markdown file with YAML frontmatter.
 * Returns the metadata and the markdown body.
 */
export function parseMarkdownFile(content: string): {
  lessonId: number;
  sectionId: number;
  name: string;
  body: string;
} {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    throw new Error('Missing YAML frontmatter in markdown file');
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trim();

  const lessonId = Number(frontmatter.match(/lessonId:\s*(\d+)/)?.[1]);
  const sectionId = Number(frontmatter.match(/sectionId:\s*(\d+)/)?.[1]);
  const name = frontmatter.match(/name:\s*"(.+?)"/)?.[1] ?? '';

  if (!lessonId || !sectionId) {
    throw new Error('Invalid frontmatter: missing lessonId or sectionId');
  }

  return { lessonId, sectionId, name, body };
}
