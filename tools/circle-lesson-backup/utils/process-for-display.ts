import * as cheerio from 'cheerio';

function transformVimeoIframe($iframe: cheerio.Cheerio) {
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

function preventIframeOverflow($iframe: cheerio.Cheerio) {
  const title = $iframe.attr('title') || '';
  if (!['Google Docs embed', 'YouTube embed', 'Tally Forms embed'].includes(title)) {
    return;
  }

  const existingClasses = $iframe.attr('class') || '';
  $iframe.attr('class', `${existingClasses} max-w-full`.trim());
}

export function transformIframes(htmlContent: string): string {
  const $ = cheerio.load(htmlContent);

  $('iframe.embedly-embed').each((_, el) => {
    const $iframe = $(el);
    transformVimeoIframe($iframe);
    preventIframeOverflow($iframe);
  });

  return $.html();
}

function lazyImages(html: string): string {
  return html.replace(/<img /g, '<img loading="lazy" ');
}

function removeFocusModeLinks(html: string): string {
  const $ = cheerio.load(html);

  const focusPattern = /wersja\s+focus\s+mode/i;

  $('p').each((_, element) => {
    const $paragraph = $(element);
    const text = $paragraph.text().replace(/\s+/g, ' ').trim();

    if (!text) {
      return;
    }

    if (!focusPattern.test(text)) {
      return;
    }

    const containsSharedLink = $paragraph
      .find('a[href*="platforma.przeprogramowani.pl/shared/"]')
      .length > 0;

    if (!containsSharedLink) {
      return;
    }

    $paragraph.remove();
  });

  return $.html();
}

export function processHtmlForDisplay(lessonHtml: string, lessonName: string) {
  const withResponsiveIframes = transformIframes(lessonHtml);
  const withoutFocusModeLinks = removeFocusModeLinks(withResponsiveIframes);
  const withLazyImages = lazyImages(withoutFocusModeLinks);
  return `<meta name="lesson-id" content="${lessonName}">${withLazyImages}`;
}
