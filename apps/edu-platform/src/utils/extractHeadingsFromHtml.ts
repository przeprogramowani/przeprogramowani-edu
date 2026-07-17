import './nodeWebCompat';
import * as cheerio from 'cheerio';
import { slugify } from './slugify';
import type { TocItem, TocConfig, HtmlExtractionResult } from '@/types/toc';

/**
 * Extracts headings from HTML content and optionally generates IDs for them
 *
 * @param htmlContent - HTML string to extract headings from
 * @param config - Configuration options for extraction
 * @returns Object containing extracted headings and modified HTML with IDs
 *
 * @example
 * ```ts
 * const { headings, modifiedHtml } = extractHeadingsFromHtml('<h1>Title</h1><h2>Section</h2>');
 * console.log(headings); // [{ id: 'title', text: 'Title', level: 1, ... }, ...]
 * ```
 */
export function extractHeadingsFromHtml(
  htmlContent: string,
  config: TocConfig = {}
): HtmlExtractionResult {
  const {
    minLevel = 1,
    maxLevel = 6,
    autoGenerateIds = true,
    idPrefix = 'heading-',
  } = config;

  const $ = cheerio.load(htmlContent, null, false);
  const headings: TocItem[] = [];
  const idCounts = new Map<string, number>(); // Track duplicate IDs

  // Build selector for heading levels
  const headingSelector = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, i) => `h${minLevel + i}`
  ).join(', ');

  $(headingSelector).each((index, element) => {
    const $heading = $(element);
    if (!('tagName' in element)) {
      return;
    }
    const tagName = element.tagName.toLowerCase();
    const level = parseInt(tagName.substring(1), 10);

    // Extract text content, removing any nested HTML tags
    let text = $heading.text().trim();
    if (!text) return; // Skip empty headings

    // Always generate ID from text using slugify to ensure consistency
    // This overwrites any existing IDs (including those with Polish characters)
    let id: string;

    if (autoGenerateIds) {
      // Generate ID from text using slugify (preserves Polish characters via github-slugger)
      id = slugify(text);

      // Handle duplicates by appending counter
      if (idCounts.has(id)) {
        const count = idCounts.get(id)! + 1;
        idCounts.set(id, count);
        id = `${id}-${count}`;
      } else {
        idCounts.set(id, 1);
      }
    } else {
      // If autoGenerateIds is false, try to preserve existing ID or use fallback
      id = $heading.attr('id') || `${idPrefix}${index}`;
    }

    // Always set the ID on the element to ensure HTML matches TOC
    $heading.attr('id', id);

    headings.push({
      id,
      text,
      level,
      children: [],
      parentId: null,
    });
  });

  // Return modified HTML (with IDs added) and headings
  return {
    headings,
    modifiedHtml: $.root().html() || htmlContent,
  };
}
