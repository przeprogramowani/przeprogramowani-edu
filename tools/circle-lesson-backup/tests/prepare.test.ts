import { describe, it, expect } from 'vitest';
import { replaceInlineCodeWithStrong, unwrapTableStructureTags, convertH4ToH3, convertTablesToLists, prepareForCircle } from '../prepare';

describe('replaceInlineCodeWithStrong', () => {
  it('replaces inline <code> with <strong>', () => {
    const input = '<p>Use <code>npm install</code> to install.</p>';
    const expected = '<p>Use <strong>npm install</strong> to install.</p>';
    expect(replaceInlineCodeWithStrong(input)).toBe(expected);
  });

  it('handles multiple inline codes in one paragraph', () => {
    const input = '<p>Run <code>build</code> then <code>deploy</code>.</p>';
    const expected = '<p>Run <strong>build</strong> then <strong>deploy</strong>.</p>';
    expect(replaceInlineCodeWithStrong(input)).toBe(expected);
  });

  it('preserves <code> inside <pre> blocks', () => {
    const input = '<pre><code class="language-ts">const x = 1;</code></pre>';
    expect(replaceInlineCodeWithStrong(input)).toBe(input);
  });

  it('preserves <pre><code> while replacing inline <code> elsewhere', () => {
    const input = [
      '<p>Use <code>foo</code> like this:</p>',
      '<pre><code class="language-ts">foo();</code></pre>',
      '<p>Then call <code>bar</code>.</p>',
    ].join('\n');
    const expected = [
      '<p>Use <strong>foo</strong> like this:</p>',
      '<pre><code class="language-ts">foo();</code></pre>',
      '<p>Then call <strong>bar</strong>.</p>',
    ].join('\n');
    expect(replaceInlineCodeWithStrong(input)).toBe(expected);
  });

  it('handles empty <code> tags', () => {
    const input = '<p>Empty: <code></code></p>';
    const expected = '<p>Empty: <strong></strong></p>';
    expect(replaceInlineCodeWithStrong(input)).toBe(expected);
  });

  it('preserves multi-line <pre> blocks', () => {
    const input = [
      '<pre><code>',
      'line 1',
      'line 2',
      '</code></pre>',
    ].join('\n');
    expect(replaceInlineCodeWithStrong(input)).toBe(input);
  });
});

describe('unwrapTableStructureTags', () => {
  it('removes thead and tbody wrappers but keeps content', () => {
    const input = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>';
    const expected = '<table><tr><th>A</th></tr><tr><td>1</td></tr></table>';
    expect(unwrapTableStructureTags(input)).toBe(expected);
  });

  it('handles tables without thead/tbody', () => {
    const input = '<table><tr><td>1</td></tr></table>';
    expect(unwrapTableStructureTags(input)).toBe(input);
  });
});

describe('convertTablesToLists', () => {
  it('converts a table with headers to a list', () => {
    const input = '<table><tr><th>Name</th><th>Value</th></tr><tr><td>A</td><td>1</td></tr><tr><td>B</td><td>2</td></tr></table>';
    const result = convertTablesToLists(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<strong>Name</strong>: A');
    expect(result).toContain('<strong>Value</strong>: 1');
    expect(result).toContain('<strong>Name</strong>: B');
    expect(result).not.toContain('<table>');
  });

  it('returns empty string for empty tables', () => {
    const input = '<table></table>';
    expect(convertTablesToLists(input)).toBe('');
  });
});

describe('convertH4ToH3', () => {
  it('converts h4 to h3', () => {
    expect(convertH4ToH3('<h4>Title</h4>')).toBe('<h3>Title</h3>');
  });

  it('handles h4 with attributes', () => {
    expect(convertH4ToH3('<h4 id="x">Title</h4>')).toBe('<h3 id="x">Title</h3>');
  });

  it('leaves h2 and h3 untouched', () => {
    const input = '<h2>A</h2><h3>B</h3>';
    expect(convertH4ToH3(input)).toBe(input);
  });
});

describe('prepareForCircle', () => {
  it('replaces inline code and converts img to placeholder', () => {
    const input = [
      '<p>Use <code>shape</code>:</p>',
      '<p><img src="https://cdn.example.com/diagram.png" alt="Flow"></p>',
    ].join('\n');
    const result = prepareForCircle(input);

    expect(result).toContain('<strong>shape</strong>');
    expect(result).not.toContain('<code>shape</code>');
    expect(result).not.toContain('<img');
    expect(result).toContain('IMAGE');
    expect(result).toContain('https://cdn.example.com/diagram.png');
  });

  it('preserves block-level code inside <pre>', () => {
    const input = '<pre><code class="language-bash">npm run build</code></pre>';
    const result = prepareForCircle(input);
    expect(result).toContain('<pre><code class="language-bash">npm run build</code></pre>');
  });
});
