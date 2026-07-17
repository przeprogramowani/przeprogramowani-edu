import { describe, it, expect } from 'vitest';
import { extractHeadingsFromHtml } from './extractHeadingsFromHtml';

describe('extractHeadingsFromHtml', () => {
  describe('Basic Extraction', () => {
    it('should extract all headings H1-H6', () => {
      const html = `
        <h1>Title</h1>
        <h2>Section</h2>
        <h3>Subsection</h3>
        <h4>Step</h4>
        <h5>Detail</h5>
        <h6>Note</h6>
      `;
      const result = extractHeadingsFromHtml(html);
      expect(result.headings).toHaveLength(6);
      expect(result.headings[0].text).toBe('Title');
      expect(result.headings[0].level).toBe(1);
      expect(result.headings[5].text).toBe('Note');
      expect(result.headings[5].level).toBe(6);
    });

    it('should extract headings with correct structure', () => {
      const html = '<h1>My Title</h1>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0]).toMatchObject({
        text: 'My Title',
        level: 1,
        children: [],
        parentId: null,
      });
      expect(result.headings[0].id).toBeTruthy();
    });

    it('should handle mixed heading levels', () => {
      const html = '<h2>First</h2><h1>Second</h1><h3>Third</h3>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings).toHaveLength(3);
      expect(result.headings[0].level).toBe(2);
      expect(result.headings[1].level).toBe(1);
      expect(result.headings[2].level).toBe(3);
    });
  });

  describe('ID Generation', () => {
    it('should generate IDs for headings without IDs', () => {
      const html = '<h1>My Title</h1>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].id).toBe('my-title');
    });

    it('should overwrite existing IDs with slugified version', () => {
      const html = '<h1 id="custom-id">Title</h1>';
      const result = extractHeadingsFromHtml(html);

      // ID should be regenerated from text using slugify, not preserved
      expect(result.headings[0].id).toBe('title');
    });

    it('should add IDs to HTML elements', () => {
      const html = '<h1>My Title</h1>';
      const result = extractHeadingsFromHtml(html);

      expect(result.modifiedHtml).toContain('id="my-title"');
    });

    it('should handle duplicate heading text with unique IDs', () => {
      const html = `
        <h1>Introduction</h1>
        <h2>Introduction</h2>
        <h3>Introduction</h3>
      `;
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].id).toBe('introduction');
      expect(result.headings[1].id).toBe('introduction-2');
      expect(result.headings[2].id).toBe('introduction-3');
    });

    it('should slugify special characters correctly', () => {
      const html = '<h1>Krok 1: Wybór pomysłu na projekt</h1>';
      const result = extractHeadingsFromHtml(html);

      // github-slugger preserves Polish characters (ó, ł, ś, ć, etc.)
      expect(result.headings[0].id).toBe('krok-1-wybór-pomysłu-na-projekt');
    });

    it('should handle headings with brackets and special syntax', () => {
      const html = '<h2>[2x1] Planowanie projektu - kontekst dla AI</h2>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].text).toBe('[2x1] Planowanie projektu - kontekst dla AI');
      // github-slugger converts " - " (space-hyphen-space) to "---" (triple hyphens)
      expect(result.headings[0].id).toBe('2x1-planowanie-projektu---kontekst-dla-ai');
    });
  });

  describe('Edge Cases', () => {
    it('should skip empty headings', () => {
      const html = '<h1></h1><h2>Valid</h2><h3>   </h3>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings).toHaveLength(1);
      expect(result.headings[0].text).toBe('Valid');
    });

    it('should handle headings with nested HTML tags', () => {
      const html = '<h1>Title with <strong>bold</strong> and <em>italic</em></h1>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].text).toBe('Title with bold and italic');
    });

    it('should handle headings with code blocks', () => {
      const html = '<h2>Using <code>useState</code> hook</h2>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].text).toBe('Using useState hook');
    });

    it('should handle empty HTML', () => {
      const html = '';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings).toHaveLength(0);
    });

    it('should handle HTML without headings', () => {
      const html = '<p>Just a paragraph</p><div>Some content</div>';
      const result = extractHeadingsFromHtml(html);

      expect(result.headings).toHaveLength(0);
    });
  });

  describe('Configuration Options', () => {
    it('should respect minLevel configuration', () => {
      const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3>';
      const result = extractHeadingsFromHtml(html, { minLevel: 2 });

      expect(result.headings).toHaveLength(2);
      expect(result.headings[0].level).toBe(2);
      expect(result.headings[1].level).toBe(3);
    });

    it('should respect maxLevel configuration', () => {
      const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4>';
      const result = extractHeadingsFromHtml(html, { maxLevel: 2 });

      expect(result.headings).toHaveLength(2);
      expect(result.headings[0].level).toBe(1);
      expect(result.headings[1].level).toBe(2);
    });

    it('should respect custom ID prefix when needed', () => {
      const html = '<h1>Title</h1>';
      const result = extractHeadingsFromHtml(html, {
        autoGenerateIds: false,
        idPrefix: 'section-'
      });

      // When autoGenerateIds is false and no ID exists, fallback to index-based
      expect(result.headings[0].id).toBe('section-0');
    });

    it('should disable ID generation when autoGenerateIds is false', () => {
      const html = '<h1>Title Without ID</h1>';
      const result = extractHeadingsFromHtml(html, { autoGenerateIds: false });

      // Should fallback to index-based ID
      expect(result.headings[0].id).toBe('heading-0');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle real checklist content structure', () => {
      const html = `
        <h1>Checklista Modułu 2 - Budowa Aplikacji od Podstaw</h1>
        <h2>Spis treści</h2>
        <h2>[2x1] Planowanie projektu - kontekst dla AI</h2>
        <h4>Krok 1: Wybór pomysłu na projekt</h4>
        <h4>Krok 2: Definiowanie wymagań funkcjonalnych</h4>
        <h2>[2x2] Konfiguracja środowiska</h2>
      `;
      const result = extractHeadingsFromHtml(html);

      expect(result.headings).toHaveLength(6);
      expect(result.headings[0].level).toBe(1);
      expect(result.headings[2].level).toBe(2);
      expect(result.headings[3].level).toBe(4);

      // Verify IDs are unique
      const ids = result.headings.map(h => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should handle long heading text', () => {
      const html = `
        <h2>This is a very long heading that contains multiple words and special characters like & and @ symbols</h2>
      `;
      const result = extractHeadingsFromHtml(html);

      expect(result.headings[0].text).toBe(
        'This is a very long heading that contains multiple words and special characters like & and @ symbols'
      );
      expect(result.headings[0].id).toMatch(/^this-is-a-very-long-heading/);
    });

    it('should preserve heading order', () => {
      const html = `
        <h1>First</h1>
        <h2>Second</h2>
        <h3>Third</h3>
        <h2>Fourth</h2>
        <h1>Fifth</h1>
      `;
      const result = extractHeadingsFromHtml(html);

      expect(result.headings.map(h => h.text)).toEqual([
        'First', 'Second', 'Third', 'Fourth', 'Fifth'
      ]);
    });
  });
});
