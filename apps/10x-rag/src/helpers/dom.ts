import * as cheerio from 'cheerio';

export function htmlToCleanDOM(html: string): cheerio.CheerioAPI {
  // Remove zero-width and normalize newlines
  const cleaned = html.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\r\n/g, '\n');
  const $ = cheerio.load(cleaned, { decodeEntities: true }) as cheerio.CheerioAPI;

  // Remove non-content noise early
  $('script, style, noscript, img, iframe').remove();
  // Optional: drop nav/footer if present
  $('[role="navigation"], nav, footer, header').remove();

  return $;
}

export function extractLessonId($: cheerio.CheerioAPI): string | null {
  const meta = $('meta[name="lesson-id"]').attr('content');
  return meta ?? null;
}
