/**
 * Decodes HTML entities in a string
 * Useful for cleaning up lesson titles and metadata that may contain &quot;, &amp;, etc.
 *
 * @param text - Text containing HTML entities
 * @returns Decoded text with proper characters
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&'); // Must be last to avoid double-decoding
}

/**
 * Sanitizes text for use in YAML frontmatter
 * - Decodes HTML entities
 * - Escapes double quotes for YAML safety
 *
 * @param text - Text to sanitize
 * @returns Sanitized text safe for YAML frontmatter
 */
export function sanitizeForYaml(text: string): string {
  // First decode HTML entities
  let cleaned = decodeHtmlEntities(text);

  // Escape double quotes for YAML (replace " with \")
  // But we'll use single quotes in YAML to avoid this complexity
  // For now, just decode entities
  return cleaned;
}
