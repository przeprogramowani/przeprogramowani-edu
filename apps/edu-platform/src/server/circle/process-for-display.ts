import '../../utils/nodeWebCompat';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { extractHeadingsFromHtml } from '@/utils/extractHeadingsFromHtml';
import { buildCompleteToc } from '@/utils/buildTocHierarchy';
import type { TocItem } from '@/types/toc';

function transformVimeoIframe($iframe: cheerio.Cheerio<Element>) {
  const EMBEDLY_PREFIX = '//cdn.embedly.com/widgets/media.html?src=';
  const originalSrc = $iframe.attr('src') || '';

  // Only transform if the src contains 'vimeo' and starts with our known prefix
  if (!originalSrc.includes('vimeo') || !originalSrc.startsWith(EMBEDLY_PREFIX)) {
    return;
  }

  let vimeoUrl = originalSrc.replace(EMBEDLY_PREFIX, '');
  vimeoUrl = decodeURIComponent(vimeoUrl);

  // Create new iframe element with desired attributes
  const $newIframe = cheerio.load('<iframe></iframe>')('iframe');
  $newIframe.attr('src', vimeoUrl);
  $newIframe.attr('loading', 'lazy');
  $newIframe.attr('class', 'w-full aspect-video');
  $newIframe.attr('title', 'Vimeo Player');
  $newIframe.attr(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  );
  $newIframe.attr('allowfullscreen', 'true');

  // Replace old iframe with new one
  $iframe.replaceWith($newIframe);
}

function preventIframeOverflow($iframe: cheerio.Cheerio<Element>) {
  const title = $iframe.attr('title') || '';
  if (!['Google Docs embed', 'YouTube embed', 'Tally Forms embed'].includes(title)) {
    return;
  }

  const existingClasses = $iframe.attr('class') || '';
  $iframe.attr('class', `${existingClasses} max-w-full`.trim());
}

export function transformIframes(htmlContent: string): string {
  const $ = cheerio.load(htmlContent, null, false);

  $('iframe.embedly-embed').each((_, el) => {
    const $iframe = $(el);
    transformVimeoIframe($iframe);
    preventIframeOverflow($iframe);
  });

  return $.root().html() || '';
}

function lazyImages(html: string): string {
  return html.replace(/<img /g, '<img loading="lazy" ');
}

function removeFocusModeLinks(html: string): string {
  const $ = cheerio.load(html, null, false);

  const focusPattern = /wersja\s+focus\s+mode/i;

  $('p')
    .slice(0, 10)
    .each((_, element) => {
      const $paragraph = $(element);
      const text = $paragraph.text().replace(/\s+/g, ' ').trim();

      if (!text) {
        return;
      }

      if (!focusPattern.test(text)) {
        return;
      }

      const containsSharedLink =
        $paragraph.find('a[href*="platforma.przeprogramowani.pl/shared/"]').length > 0 ||
        $paragraph.find('a[href*="platforma.przeprogramowani.pl/external/"]').length > 0;

      if (!containsSharedLink) {
        return;
      }

      $paragraph.remove();
    });

  return $.root().html() || '';
}

export function processHtmlForDisplay(
  lessonHtml: string,
  lessonName: string
): { html: string; headings: TocItem[] } {
  const withResponsiveIframes = transformIframes(lessonHtml);
  const withoutFocusModeLinks = removeFocusModeLinks(withResponsiveIframes);
  const withLazyImages = lazyImages(withoutFocusModeLinks);

  // Extract headings and add IDs
  const { headings: flatHeadings, modifiedHtml } = extractHeadingsFromHtml(withLazyImages);

  // Build hierarchy
  const tocData = buildCompleteToc(flatHeadings);

  // Clean up any DOCTYPE or HTML structure tags that may have been added by Cheerio
  const cleaned = modifiedHtml
    .replace(/<!DOCTYPE[^>]*>/gi, '') // Remove DOCTYPE
    .replace(/<\/?html[^>]*>/gi, '') // Remove <html>, </html>
    .replace(/<head[^>]*>.*?<\/head>/gis, '') // Remove entire <head> section
    .replace(/<\/?title[^>]*>/gi, '') // Remove <title>, </title> (in case they're outside <head>)
    .replace(/<\/?body[^>]*>/gi, '') // Remove <body>, </body>
    .trim();

  return {
    html: `<meta name="lesson-id" content="${lessonName}">${cleaned}`,
    headings: tocData.tree, // Return hierarchical tree
  };
}
