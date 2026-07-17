export const PREWORK_BASE_URL = 'https://platforma.przeprogramowani.pl';

const PREWORK_BRACKET_TO_LESSON_ID: Record<string, string> = {
  '1.1': '01',
  '1.2': '02',
  '1.3': '03',
  '2.1': '04',
  '2.2': '05',
  '2.3': '06',
  '2.4': '07',
  '3.1': '09',
  '3.2': '10',
  '3.3': '11',
  '3.4': '12',
  '3.5': '13',
  '4.1': '14',
  '4.2': '15',
  '4.3': '16',
};

const MERMAID_WITH_CDN_10X =
  /<pre class="mermaid" data-language="mermaid">[\s\S]*?<\/pre>\s*<!--\s*rendered:[^>]*-->\s*<!--\s*cdn-10x:\s*(https?:\/\/[^\s]+?)\s*-->/g;

const MERMAID_WITH_CDN_ONLY =
  /<pre class="mermaid" data-language="mermaid">[\s\S]*?<\/pre>\s*<!--\s*rendered:[^|]*\|\s*cdn:\s*(https?:\/\/[^\s]+?)\s*-->/g;

export function replaceMermaidWithCdnImages(html: string): string {
  let result = html.replace(MERMAID_WITH_CDN_10X, '<img src="$1" alt="Diagram">');
  result = result.replace(MERMAID_WITH_CDN_ONLY, '<img src="$1" alt="Diagram">');
  return result;
}

const IMG_WITH_CDN_COMMENT =
  /(<img\s[^>]*src=")([^"]*\/assets\/[^"]+)("[^>]*>)(\s*<\/p>)?\s*\n\s*<!--\s*cdn:\s*(https?:\/\/[^\s]+?)\s*-->/g;

export function replaceAssetsWithCdnUrls(html: string): string {
  return html.replace(IMG_WITH_CDN_COMMENT, '$1$5$3$4');
}

export function injectPreworkLinks(html: string, language: 'pl' | 'en', baseUrl: string): string {
  return html.replace(
    /<a[^>]*>[\s\S]*?<\/a>|\[(\d+\.\d+)\]/g,
    (match, bracketId: string | undefined) => {
      if (!bracketId) return match;
      const lessonId = PREWORK_BRACKET_TO_LESSON_ID[bracketId];
      if (!lessonId) return match;
      return `<a href="${baseUrl}/external/10xdevs-3-prework/${language}/${lessonId}">[${bracketId}]</a>`;
    }
  );
}
