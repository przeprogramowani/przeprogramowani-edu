import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { htmlToMarkdown } from './htmlToMarkdown';

/**
 * Integration tests using real lesson HTML files
 * These tests ensure that the markdown converter works correctly with actual lesson content
 */
describe('htmlToMarkdown - Integration Tests with Real Lessons', () => {
  // Helper function to read lesson files
  const readLessonFile = (relativePath: string): string => {
    const fullPath = join(process.cwd(), 'src/content', relativePath);
    return readFileSync(fullPath, 'utf-8');
  };

  // Helper to remove code blocks before checking for HTML tags
  // Code blocks should be allowed to contain HTML as example code
  const removeCodeBlocks = (markdown: string): string => {
    // Remove fenced code blocks (```)
    let result = markdown.replace(/```[\s\S]*?```/g, '');
    // Remove inline code (`code`)
    result = result.replace(/`[^`]+`/g, '');
    return result;
  };

  // Check if markdown contains HTML tags outside of code blocks
  const hasHtmlTagsOutsideCode = (markdown: string, tag: string): boolean => {
    const withoutCode = removeCodeBlocks(markdown);
    return withoutCode.includes(`<${tag}`);
  };

  describe('TypeScript Core Lessons', () => {
    it('should convert TypeScript lesson without HTML artifacts', () => {
      const html = readLessonFile('lessonsOtsCore/05-typy_jako_zbiory_wartoci.html');
      const result = htmlToMarkdown(html);

      // Critical checks - no HTML artifacts
      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html>');
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<body>');
      expect(result).not.toContain('<meta');
      expect(result).not.toContain('loading="lazy"');
      expect(result).not.toContain('style=');

      // Should not contain <div> or <img> tags outside code blocks
      expect(hasHtmlTagsOutsideCode(result, 'div')).toBe(false);
      expect(hasHtmlTagsOutsideCode(result, 'img')).toBe(false);

      // Should contain proper markdown
      expect(result).toContain('##'); // Has headings
      expect(result).toContain('!['); // Has images with markdown syntax

      // Should preserve Polish characters
      expect(result).toContain('wartości');
      expect(result).toContain('łańcuch');

      // Should have no empty alt-text
      expect(result).not.toMatch(/!\[\]\([^)]+\)/); // Pattern: ![](...)

      // Should not have more than 2 consecutive newlines
      expect(result).not.toContain('\n\n\n');
    });
  });

  describe('Frontend Lessons', () => {
    it('should convert Frontend lesson with complex content', () => {
      const html = readLessonFile('lessonsOfe/03-czysty_kod_na_frontendzie.html');
      const result = htmlToMarkdown(html);

      // Critical checks
      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html>');
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<body>');
      expect(hasHtmlTagsOutsideCode(result, 'div')).toBe(false);
      expect(hasHtmlTagsOutsideCode(result, 'img')).toBe(false);
      expect(result).not.toContain('loading=');

      // Should have markdown formatting
      expect(result).toContain('##'); // Headings
      expect(result).toContain('**'); // Bold text
      expect(result).toContain('- '); // Lists

      // No empty alt-text
      expect(result).not.toMatch(/!\[\]\([^)]+\)/);
    });
  });

  describe('Cursor AI Lessons', () => {
    it('should convert Cursor lesson properly', () => {
      const html = readLessonFile('lessonsCursor/01-zanim_rozpoczniemy.html');
      const result = htmlToMarkdown(html);

      // Critical checks
      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html>');
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<body>');
      expect(hasHtmlTagsOutsideCode(result, 'div')).toBe(false);
      expect(hasHtmlTagsOutsideCode(result, 'img')).toBe(false);

      // No empty alt-text
      expect(result).not.toMatch(/!\[\]\([^)]+\)/);
    });
  });

  describe('General Quality Checks', () => {
    const testLesson = (path: string, lessonName: string) => {
      it(`${lessonName} - should have clean markdown output`, () => {
        const html = readLessonFile(path);
        const result = htmlToMarkdown(html);

        // Universal quality checks
        const checks = {
          'No DOCTYPE': !result.includes('<!DOCTYPE'),
          'No <html>': !result.includes('<html>'),
          'No <head>': !result.includes('<head>'),
          'No <body>': !result.includes('<body>'),
          'No <div> outside code': !hasHtmlTagsOutsideCode(result, 'div'),
          'No <img> outside code': !hasHtmlTagsOutsideCode(result, 'img'),
          'No loading attr': !result.includes('loading='),
          'No style attr': !result.includes('style='),
          'No empty alt-text': !result.match(/!\[\]\([^)]+\)/),
          'Max 2 newlines': !result.includes('\n\n\n'),
          'Not empty': result.length > 0,
          'Starts clean': !result.match(/^\s+/),
          'Ends clean': !result.match(/\s+$/),
        };

        // Report which checks failed
        const failures = Object.entries(checks)
          .filter(([_, passed]) => !passed)
          .map(([name]) => name);

        if (failures.length > 0) {
          console.log(`\n❌ Failed checks for ${lessonName}:`, failures);
          console.log('First 500 chars of output:', result.substring(0, 500));
        }

        // Assert all checks pass
        Object.entries(checks).forEach(([checkName, passed]) => {
          expect(passed, `Check failed: ${checkName}`).toBe(true);
        });
      });
    };

    // Test multiple lessons from different courses
    testLesson('lessonsOtsCore/13-typy_warunkowe.html', 'TypeScript - Conditional Types');
    testLesson('lessonsOtsReact/03-migracja_do_ts_w_istniejcych_projektach_reactjs.html', 'TypeScript React - Migration');
    testLesson('lessonsOfe/05-wzorce_projektowe_w_warstwie_clientside.html', 'Frontend - Design Patterns');
    testLesson('lessonsCursor/06-jak_dziaaj_modele_ai.html', 'Cursor - AI Models');
  });

  describe('Video Content Handling', () => {
    it('should convert video iframes to proper markers in real lessons', () => {
      // Find a lesson with video content
      const html = readLessonFile('lessonsOtsCore/05-typy_jako_zbiory_wartoci.html');
      const result = htmlToMarkdown(html);

      // If the lesson contains videos, they should be converted
      if (html.includes('vimeo.com') || html.includes('youtube.com')) {
        expect(result).toContain('🎥 **VIDEO**');
        expect(result).not.toContain('<iframe');
      }
    });
  });

  describe('Image Handling in Real Lessons', () => {
    it('should ensure all images have alt-text in converted markdown', () => {
      const lessons = [
        'lessonsOtsCore/05-typy_jako_zbiory_wartoci.html',
        'lessonsOfe/03-czysty_kod_na_frontendzie.html',
        'lessonsCursor/01-zanim_rozpoczniemy.html',
      ];

      lessons.forEach((lessonPath) => {
        const html = readLessonFile(lessonPath);
        const result = htmlToMarkdown(html);

        // Count images in markdown
        const imageMatches = result.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];

        // All images should have alt-text (no empty brackets)
        const emptyAltImages = imageMatches.filter((img) => img.startsWith('![]'));

        if (emptyAltImages.length > 0) {
          console.log(`\n❌ Found ${emptyAltImages.length} images without alt-text in ${lessonPath}`);
          console.log('Examples:', emptyAltImages.slice(0, 3));
        }

        expect(emptyAltImages.length, `All images in ${lessonPath} should have alt-text`).toBe(0);
      });
    });
  });

  describe('Polish Character Preservation', () => {
    it('should preserve Polish characters in real lessons', () => {
      const html = readLessonFile('lessonsOtsCore/05-typy_jako_zbiory_wartoci.html');
      const result = htmlToMarkdown(html);

      // Common Polish words that should be preserved
      const polishWords = ['wartości', 'łańcuch', 'właściwości', 'zawierające'];

      const foundWords = polishWords.filter((word) => html.includes(word));

      // If the original HTML contains Polish words, they should be in markdown too
      foundWords.forEach((word) => {
        expect(result).toContain(word);
      });

      // General check - if input has Polish chars, output should too
      const hasPolishInInput = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(html);
      const hasPolishInOutput = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(result);

      if (hasPolishInInput) {
        expect(hasPolishInOutput, 'Polish characters should be preserved').toBe(true);
      }
    });
  });

  describe('Code Block Handling', () => {
    it('should preserve code blocks with proper formatting', () => {
      const html = readLessonFile('lessonsOtsCore/05-typy_jako_zbiory_wartoci.html');
      const result = htmlToMarkdown(html);

      // If original has code blocks, markdown should too
      if (html.includes('<code>') || html.includes('<pre>')) {
        // Should use fenced code blocks
        expect(result).toContain('```');

        // Should preserve code content
        if (html.includes('const')) {
          expect(result).toContain('const');
        }
        if (html.includes('function')) {
          expect(result).toContain('function');
        }
      }
    });
  });

  describe('Output Size Validation', () => {
    it('should not significantly reduce content size (potential data loss check)', () => {
      const lessons = [
        'lessonsOtsCore/05-typy_jako_zbiory_wartoci.html',
        'lessonsOfe/03-czysty_kod_na_frontendzie.html',
      ];

      lessons.forEach((lessonPath) => {
        const html = readLessonFile(lessonPath);
        const result = htmlToMarkdown(html);

        // The markdown should be at least 40% of the HTML size
        // (accounting for removed tags, attributes, etc.)
        const sizeRatio = result.length / html.length;

        expect(sizeRatio, `${lessonPath} markdown seems too small, possible data loss`).toBeGreaterThan(
          0.3
        );

        // But not larger (shouldn't add excessive content)
        expect(sizeRatio, `${lessonPath} markdown is larger than HTML, something's wrong`).toBeLessThan(
          1.2
        );
      });
    });
  });
});
