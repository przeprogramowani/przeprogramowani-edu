import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { slugify } from './slugify';
import type { TocItem, TocConfig } from '@/types/toc';
import type { Heading, Text } from 'mdast';

/**
 * Extracts headings from Markdown content by parsing the AST
 *
 * This is useful when you need to extract headings before rendering markdown to HTML.
 * For already-rendered markdown (from Astro content collections), consider using
 * extractHeadingsFromHtml instead.
 *
 * @param markdownContent - Markdown string to extract headings from
 * @param config - Configuration options for extraction
 * @returns Flat list of extracted headings with generated IDs
 *
 * @example
 * ```ts
 * const headings = await extractHeadingsFromMarkdown('# Title\n## Section');
 * console.log(headings); // [{ id: 'title', text: 'Title', level: 1, ... }, ...]
 * ```
 */
export async function extractHeadingsFromMarkdown(
  markdownContent: string,
  config: TocConfig = {}
): Promise<TocItem[]> {
  const { minLevel = 1, maxLevel = 6 } = config;

  const tree = unified().use(remarkParse).parse(markdownContent);
  const headings: TocItem[] = [];
  const idCounts = new Map<string, number>(); // Track duplicate IDs

  visit(tree, 'heading', (node: Heading) => {
    const level = node.depth;

    // Filter by min/max level
    if (level < minLevel || level > maxLevel) {
      return;
    }

    // Extract text from heading children
    let text = '';

    // Helper function to recursively extract text from nodes
    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.value;
      } else if (node.type === 'inlineCode') {
        return node.value;
      } else if (node.type === 'link') {
        // Extract text from link children
        return node.children.map(extractText).join('');
      } else if (node.type === 'strong' || node.type === 'emphasis') {
        // Recursively extract text from formatting elements
        return node.children.map(extractText).join('');
      }
      return '';
    };

    for (const child of node.children) {
      text += extractText(child);
    }

    text = text.trim();

    if (!text) return; // Skip empty headings

    // Generate ID from text
    let id = slugify(text);

    // Handle duplicates by appending counter
    if (idCounts.has(id)) {
      const count = idCounts.get(id)! + 1;
      idCounts.set(id, count);
      id = `${id}-${count}`;
    } else {
      idCounts.set(id, 1);
    }

    headings.push({
      id,
      text,
      level,
      children: [],
      parentId: null,
    });
  });

  return headings;
}
