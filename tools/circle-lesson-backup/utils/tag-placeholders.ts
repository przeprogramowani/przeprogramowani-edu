import * as cheerio from 'cheerio';

/**
 * Replaces HTML tags that Circle strips (iframe, img, etc.) with
 * human-readable placeholders built from Circle-safe tags.
 *
 * Placeholders are visible in Circle's editor so the author knows
 * what to embed manually.
 */

interface TagRule {
  /** CSS selector to match elements */
  selector: string;
  /** Builds placeholder HTML from the matched element */
  toPlaceholder: ($el: cheerio.Cheerio) => string;
}

const TAG_RULES: TagRule[] = [
  {
    selector: 'iframe',
    toPlaceholder: ($el) => {
      const src = $el.attr('src') || '';

      const parts = [`<strong>IFRAME</strong>`];
      parts.push(`<a href="${src}">${src}</a>`);

      return `<blockquote><p>${parts.join(' — ')}</p></blockquote>`;
    },
  },
  {
    selector: 'img',
    toPlaceholder: ($el) => {
      const src = $el.attr('src') || '';

      const parts = [`<strong>IMAGE</strong>`];
      parts.push(`<a href="${src}">${src}</a>`);

      return `<blockquote><p>${parts.join(' — ')}</p></blockquote>`;
    },
  },
];

export function tagsToPlaceholders(html: string): string {
  const $ = cheerio.load(html, null, false);

  for (const rule of TAG_RULES) {
    $(rule.selector).each((_, el) => {
      const $el = $(el);
      const placeholder = rule.toPlaceholder($el);
      const $parent = $el.parent();

      // If the element is the only child of a <p>, replace the whole <p>
      // to avoid invalid <blockquote> nested inside <p>
      if ($parent.is('p') && $parent.children().length === 1 && $parent.text().trim() === '') {
        $parent.replaceWith(placeholder);
      } else {
        $el.replaceWith(placeholder);
      }
    });
  }

  return $.root().html() || '';
}
