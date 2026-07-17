import { NodeHtmlMarkdown } from 'node-html-markdown';

/**
 * Converts HTML lesson content to clean, readable Markdown
 *
 * Features:
 * - Removes meta tags and inline styles
 * - Adds descriptive alt-text to images
 * - Converts video embeds to readable markers
 * - Cleans up excessive whitespace
 * - Handles Polish characters correctly
 */
export function htmlToMarkdown(html: string): string {
  // 1. Pre-processing: Clean HTML structure and Circle.so artifacts
  let cleanedHtml = html
    // Convert generated Mermaid containers back to language-marked code blocks
    // before generic class stripping so Markdown export keeps ```mermaid fences.
    .replace(
      /<pre\b([^>]*\bclass=["'][^"']*\bmermaid\b[^"']*["'][^>]*)>([\s\S]*?)<\/pre>/gi,
      (_match, _attributes: string, content: string) => {
        if (/<code\b/i.test(content)) {
          return `<pre>${content}</pre>`;
        }

        return `<pre><code class="language-mermaid">${content}</code></pre>`;
      }
    )
    // Remove DOCTYPE and HTML structure tags
    .replace(/<!DOCTYPE[^>]*>/gi, '') // Remove DOCTYPE declaration
    .replace(/<html[^>]*>/gi, '') // Remove opening html tag
    .replace(/<\/html>/gi, '') // Remove closing html tag
    .replace(/<head[^>]*>.*?<\/head>/gis, '') // Remove entire head section
    .replace(/<body[^>]*>/gi, '') // Remove opening body tag
    .replace(/<\/body>/gi, '') // Remove closing body tag
    // Remove meta and style attributes
    .replace(/<meta[^>]*>/gi, '') // Remove meta tags
    .replace(/loading="lazy"\s*/gi, '') // Remove loading attributes
    .replace(/style="[^"]*"\s*/gi, '') // Strip inline styles
    .replace(/class="([^"]*)"\s*/gi, (_match, classes: string) => {
      // Preserve language-* classes so ```<lang> fences round-trip through NodeHtmlMarkdown.
      const preserved = classes
        .split(/\s+/)
        .filter((c: string) => c.startsWith('language-'))
        .join(' ');
      return preserved ? `class="${preserved}" ` : '';
    })
    .replace(/rel="[^"]*"\s*/gi, ''); // Strip rel attributes

  // 2. Enhanced translation config
  const markdown = NodeHtmlMarkdown.translate(
    cleanedHtml,
    {
      // Core formatting options
      useInlineLinks: true, // Use <url> for links where text equals url
      maxConsecutiveNewlines: 2, // Limit blank lines
      keepDataImages: false, // Skip data URIs (they're huge)
      bulletMarker: '-', // Consistent list style
      codeBlockStyle: 'fenced', // Always use ```
      strongDelimiter: '**', // Bold
      emDelimiter: '_', // Italic
      strikeDelimiter: '~~', // Strikethrough

      // Text cleanup
      textReplace: [
        // Replace common HTML entities
        [/&nbsp;/g, ' '],
        [/&mdash;/g, '—'],
        [/&ndash;/g, '–'],
        [/&quot;/g, '"'],
        [/&apos;/g, "'"],
        [/&lt;/g, '<'],
        [/&gt;/g, '>'],
        [/&amp;/g, '&'],
      ] as const,
    },
    {
      // Custom translators for specific elements

      // Video iframes → readable markers
      iframe: ({ node }) => {
        const src = node.getAttribute('src') || '';
        const isVideoEmbed = src.includes('youtube.com') || src.includes('vimeo.com');

        if (isVideoEmbed) {
          return {
            preserveIfEmpty: true,
            content: `\n\n🎥 **VIDEO**: [Watch here](${src})\n\n`,
          };
        }

        return {
          preserveIfEmpty: true,
          content: '', // Skip non-video iframes
        };
      },

      // Images with better alt-text
      img: ({ node }) => {
        const src = node.getAttribute('src') || '';
        const alt = node.getAttribute('alt') || '';

        // Skip empty/invalid images
        if (!src || src.startsWith('data:')) {
          return { content: '' };
        }

        // Generate descriptive alt if missing
        let altText = alt;
        if (!altText) {
          // Try to infer from URL
          if (src.includes('circle.so')) {
            altText = 'Ilustracja z lekcji';
          } else {
            altText = 'Obraz';
          }
        }

        return {
          content: `![${altText}](${src})`,
        };
      },

      // Clean embed divs (just process children)
      div: ({ node }) => {
        const className = node.getAttribute('class') || '';

        // For embed divs, just extract content without extra markup
        if (className.includes('embed')) {
          return {
            prefix: '',
            postfix: '',
          };
        }

        return {}; // Default behavior for other divs
      },
    }
  );

  // 3. Post-processing cleanup
  let finalMarkdown = markdown
    // Remove any remaining HTML artifacts
    .replace(/<!DOCTYPE[^>]*>/gi, '') // Remove DOCTYPE (safety check)
    .replace(/<html[^>]*>/gi, '') // Remove html tags (safety check)
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>/gi, '') // Remove head tags (safety check)
    .replace(/<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '') // Remove body tags (safety check)
    .replace(/<\/body>/gi, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/\[FRAGMENT VIDEO\]/g, '🎥 VIDEO') // Better video marker (backup)
    .replace(/\n\s+\n/g, '\n\n') // Remove lines with only whitespace
    .replace(/^\s+/g, '') // Remove leading whitespace
    .replace(/\s+$/g, '') // Remove trailing whitespace
    .trim();

  return finalMarkdown;
}
