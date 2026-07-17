import { describe, it, expect } from 'vitest';
import { extractHeadingsFromMarkdown } from './extractHeadingsFromMarkdown';

describe('extractHeadingsFromMarkdown', () => {
  describe('Basic Extraction', () => {
    it('should extract all heading levels', async () => {
      const markdown = `
# Title
## Section
### Subsection
#### Step
##### Detail
###### Note
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(6);
      expect(headings[0].text).toBe('Title');
      expect(headings[0].level).toBe(1);
      expect(headings[5].text).toBe('Note');
      expect(headings[5].level).toBe(6);
    });

    it('should extract headings with correct structure', async () => {
      const markdown = '# My Title';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0]).toMatchObject({
        text: 'My Title',
        level: 1,
        children: [],
        parentId: null,
      });
      expect(headings[0].id).toBeTruthy();
    });

    it('should handle mixed heading levels', async () => {
      const markdown = `
## First
# Second
### Third
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(3);
      expect(headings[0].level).toBe(2);
      expect(headings[1].level).toBe(1);
      expect(headings[2].level).toBe(3);
    });
  });

  describe('ID Generation', () => {
    it('should generate IDs from heading text', async () => {
      const markdown = '# My Title';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].id).toBe('my-title');
    });

    it('should handle duplicate heading text with unique IDs', async () => {
      const markdown = `
# Introduction
## Introduction
### Introduction
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].id).toBe('introduction');
      expect(headings[1].id).toBe('introduction-2');
      expect(headings[2].id).toBe('introduction-3');
    });

    it('should slugify Polish characters correctly', async () => {
      const markdown = '# Krok 1: Wybór pomysłu na projekt';
      const headings = await extractHeadingsFromMarkdown(markdown);

      // github-slugger preserves Polish characters (ó, ł, ś, ć, etc.)
      expect(headings[0].id).toBe('krok-1-wybór-pomysłu-na-projekt');
    });

    it('should handle headings with brackets', async () => {
      const markdown = '## [2x1] Planowanie projektu - kontekst dla AI';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('[2x1] Planowanie projektu - kontekst dla AI');
      // github-slugger converts " - " (space-hyphen-space) to "---" (triple hyphens)
      expect(headings[0].id).toBe('2x1-planowanie-projektu---kontekst-dla-ai');
    });
  });

  describe('Markdown Formatting', () => {
    it('should handle headings with bold text', async () => {
      const markdown = '# Title with **bold** text';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('Title with bold text');
    });

    it('should handle headings with italic text', async () => {
      const markdown = '# Title with *italic* text';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('Title with italic text');
    });

    it('should handle headings with inline code', async () => {
      const markdown = '## Using `useState` hook';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('Using useState hook');
    });

    it('should handle headings with combined formatting', async () => {
      const markdown = '# Title with **bold**, *italic*, and `code`';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('Title with bold, italic, and code');
    });

    it('should handle both ATX and Setext style headings', async () => {
      const markdown = `
# ATX Style H1
## ATX Style H2

Setext Style H1
================

Setext Style H2
----------------
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(4);
      expect(headings[0].text).toBe('ATX Style H1');
      expect(headings[2].text).toBe('Setext Style H1');
      expect(headings[2].level).toBe(1);
      expect(headings[3].level).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should skip empty headings', async () => {
      const markdown = `
#
## Valid Heading
###
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(1);
      expect(headings[0].text).toBe('Valid Heading');
    });

    it('should handle empty markdown', async () => {
      const markdown = '';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(0);
    });

    it('should handle markdown without headings', async () => {
      const markdown = 'Just a paragraph\n\nAnother paragraph';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(0);
    });

    it('should trim whitespace from heading text', async () => {
      const markdown = '#   Title with spaces   ';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('Title with spaces');
    });
  });

  describe('Configuration Options', () => {
    it('should respect minLevel configuration', async () => {
      const markdown = `
# H1
## H2
### H3
      `;
      const headings = await extractHeadingsFromMarkdown(markdown, { minLevel: 2 });

      expect(headings).toHaveLength(2);
      expect(headings[0].level).toBe(2);
      expect(headings[1].level).toBe(3);
    });

    it('should respect maxLevel configuration', async () => {
      const markdown = `
# H1
## H2
### H3
#### H4
      `;
      const headings = await extractHeadingsFromMarkdown(markdown, { maxLevel: 2 });

      expect(headings).toHaveLength(2);
      expect(headings[0].level).toBe(1);
      expect(headings[1].level).toBe(2);
    });

    it('should handle level range configuration', async () => {
      const markdown = `
# H1
## H2
### H3
#### H4
##### H5
      `;
      const headings = await extractHeadingsFromMarkdown(markdown, {
        minLevel: 2,
        maxLevel: 4
      });

      expect(headings).toHaveLength(3);
      expect(headings.map(h => h.level)).toEqual([2, 3, 4]);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle checklist markdown structure', async () => {
      const markdown = `
# Checklista Modułu 2 - Budowa Aplikacji od Podstaw

## Spis treści

## [2x1] Planowanie projektu - kontekst dla AI

#### Krok 1: Wybór pomysłu na projekt

- [ ] Wybierz pomysł

#### Krok 2: Definiowanie wymagań funkcjonalnych

- [ ] Zdefiniuj wymagania

## [2x2] Konfiguracja środowiska
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings).toHaveLength(6);
      expect(headings[0].level).toBe(1);
      expect(headings[2].level).toBe(2);
      expect(headings[3].level).toBe(4);

      // Verify IDs are unique
      const ids = headings.map(h => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should handle long heading text', async () => {
      const markdown = `
## This is a very long heading that contains multiple words and special characters
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe(
        'This is a very long heading that contains multiple words and special characters'
      );
      expect(headings[0].id).toMatch(/^this-is-a-very-long-heading/);
    });

    it('should preserve heading order', async () => {
      const markdown = `
# First
## Second
### Third
## Fourth
# Fifth
      `;
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings.map(h => h.text)).toEqual([
        'First', 'Second', 'Third', 'Fourth', 'Fifth'
      ]);
    });

    it('should handle headings with links', async () => {
      const markdown = '## Check out [this link](https://example.com)';
      const headings = await extractHeadingsFromMarkdown(markdown);

      // Link text should be extracted, URL ignored
      expect(headings[0].text).toBe('Check out this link');
    });

    it('should handle headings with emojis', async () => {
      const markdown = '# 🚀 Getting Started';
      const headings = await extractHeadingsFromMarkdown(markdown);

      expect(headings[0].text).toBe('🚀 Getting Started');
      // github-slugger removes emojis, leaving a leading hyphen when emoji is at start
      expect(headings[0].id).toBe('-getting-started');
    });
  });
});
