import type * as cheerio from 'cheerio';
import { BlockType, Section } from '../types.js';
import { slugify } from './utilities.js';
import { buildTurndown } from './turndown.js';

export function segmentDOM($: cheerio.CheerioAPI): Section[] {
  // Strategy: iterate body children, start a new section at each heading.
  const sections: Section[] = [];
  let current: Section | null = null;

  const makeSection = (level: number, title: string, order: number): Section => {
    const slug = slugify(title);
    const breadcrumbs: string[] = level === 1 ? [title] : [];
    return {
      id: `${slug}-${order}`,
      level,
      title,
      slug,
      breadcrumbs, // we will backfill with proper hierarchy below
      blocks: [],
      order,
    };
  };

  // Build a flat list of top-level nodes; we'll still catch nested elements via traversal.
  const domNodes = $('body').first().children().toArray();

  const td = buildTurndown();
  let sectionOrder = 0;

  // We'll track heading stack to compute breadcrumbs
  const stack: { level: number; title: string; slug: string }[] = [];

  const pushHeading = (level: number, title: string) => {
    while (stack.length > 0) {
      const last = stack[stack.length - 1];
      if (last && last.level >= level) {
        stack.pop();
      } else {
        break;
      }
    }
    stack.push({ level, title, slug: slugify(title) });
  };

  const currentBreadcrumbs = (): string[] => stack.map((h) => h.title);

  const addBlock = (type: BlockType, node: cheerio.Element, idx: number) => {
    const md = td.turndown($.html(node));
    const raw = $(node).text().replace(/\s+/g, ' ').trim();
    if (!md.trim() && !raw) return;
    if (!current) return;
    current.blocks.push({ type, markdown: md.trim(), rawText: raw, order: idx });
  };

  const walk = (el: cheerio.Element, idx: number) => {
    if (el.type !== 'tag') return;

    const tag = el.tagName.toLowerCase();

    // Heading?
    const hMatch = tag.match(/^h([1-6])$/);
    if (hMatch && hMatch[1]) {
      const level = parseInt(hMatch[1], 10);
      const title = $(el).text().trim();
      if (!title) return;

      pushHeading(level, title);
      current = makeSection(level, title, sectionOrder++);
      current.breadcrumbs = currentBreadcrumbs();
      sections.push(current);
      return;
    }

    // If no current section yet, create a synthetic one from document title or H1
    if (!current) {
      const docTitle = $('title').text().trim() || 'Document';
      pushHeading(1, docTitle);
      current = makeSection(1, docTitle, sectionOrder++);
      current.breadcrumbs = currentBreadcrumbs();
      sections.push(current);
    }

    // Block dispatcher
    if (['p'].includes(tag)) addBlock('paragraph', el, idx);
    else if (['ul', 'ol'].includes(tag)) addBlock('list', el, idx);
    else if (tag === 'pre') addBlock('code', el, idx);
    else if (tag === 'table') addBlock('table', el, idx);
    else if (tag === 'blockquote') addBlock('blockquote', el, idx);
    else if (tag === 'img') addBlock('image', el, idx);
    else if (tag === 'iframe') addBlock('embed', el, idx);
    else {
      // Recurse into container-like nodes (div/section/article/figure, etc.)
      if (['div', 'section', 'article', 'figure'].includes(tag)) {
        $(el)
          .children()
          .toArray()
          .forEach((child: cheerio.Element, i: number) => walk(child, i));
      }
    }
  };

  domNodes.forEach((n: cheerio.Element, i: number) => walk(n, i));
  return sections;
}
