import { describe, it, expect } from 'vitest';
import { decodeHtmlEntities, sanitizeForYaml } from './decodeHtmlEntities';

describe('decodeHtmlEntities', () => {
  it('should decode &quot; to double quote', () => {
    expect(decodeHtmlEntities('&quot;Hello&quot;')).toBe('"Hello"');
  });

  it('should decode &apos; to apostrophe', () => {
    expect(decodeHtmlEntities("It&apos;s great")).toBe("It's great");
  });

  it('should decode &lt; and &gt;', () => {
    expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>');
  });

  it('should decode &nbsp; to space', () => {
    expect(decodeHtmlEntities('Hello&nbsp;World')).toBe('Hello World');
  });

  it('should decode &mdash; to em dash', () => {
    expect(decodeHtmlEntities('First&mdash;Second')).toBe('First—Second');
  });

  it('should decode &ndash; to en dash', () => {
    expect(decodeHtmlEntities('First&ndash;Second')).toBe('First–Second');
  });

  it('should decode &amp; to ampersand', () => {
    expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  it('should handle multiple entities in one string', () => {
    const input = '&quot;Hello&nbsp;World&quot; &amp; &quot;Goodbye&quot;';
    const expected = '"Hello World" & "Goodbye"';
    expect(decodeHtmlEntities(input)).toBe(expected);
  });

  it('should handle nested entities correctly', () => {
    // &amp;quot; should become &quot; (not ")
    const input = '&amp;amp;';
    const expected = '&amp;';
    expect(decodeHtmlEntities(input)).toBe(expected);
  });

  it('should not modify text without entities', () => {
    const input = 'Hello World';
    expect(decodeHtmlEntities(input)).toBe(input);
  });

  it('should handle empty string', () => {
    expect(decodeHtmlEntities('')).toBe('');
  });

  it('should handle real lesson title example', () => {
    const input = '&quot;[5x1] Poszerzanie wiedzy modelu - LLMs.txt&quot;';
    const expected = '"[5x1] Poszerzanie wiedzy modelu - LLMs.txt"';
    expect(decodeHtmlEntities(input)).toBe(expected);
  });

  it('should handle Polish characters with entities', () => {
    const input = 'Typy jako zbiory warto&nbsp;ści';
    const expected = 'Typy jako zbiory warto ści';
    expect(decodeHtmlEntities(input)).toBe(expected);
  });
});

describe('sanitizeForYaml', () => {
  it('should decode HTML entities', () => {
    const input = '&quot;Test Title&quot;';
    const expected = '"Test Title"';
    expect(sanitizeForYaml(input)).toBe(expected);
  });

  it('should handle complex title with multiple entities', () => {
    const input = '&quot;Hello &amp; Goodbye&quot; &mdash; A Story';
    const expected = '"Hello & Goodbye" — A Story';
    expect(sanitizeForYaml(input)).toBe(expected);
  });

  it('should handle title without entities', () => {
    const input = 'Simple Title';
    expect(sanitizeForYaml(input)).toBe(input);
  });

  it('should handle the problematic 10xdevs title', () => {
    const input = '&quot;[5x1] Poszerzanie wiedzy modelu - LLMs.txt&quot;';
    const result = sanitizeForYaml(input);

    // Should not have &quot;
    expect(result).not.toContain('&quot;');
    // Should have proper quotes
    expect(result).toContain('"[5x1]');
    expect(result).toContain('LLMs.txt"');
  });
});
