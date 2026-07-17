import { describe, it, expect } from 'vitest';
import { generateMagicLinkEmail } from './magicLink';

describe('generateMagicLinkEmail', () => {
  const testLink = 'https://example.com/verify?token=abc123';

  describe('main template', () => {
    it('generates Polish main template correctly', () => {
      const result = generateMagicLinkEmail({
        magicLink: testLink,
        type: 'main',
        lang: 'pl',
        ttlMinutes: 15,
      });

      expect(result.subject).toBe('Zaloguj się do platformy Przeprogramowani');
      expect(result.html).toContain(testLink);
      expect(result.html).toContain('Zaloguj się');
      expect(result.html).toContain('lang="pl"');
    });

    it('generates English main template correctly', () => {
      const result = generateMagicLinkEmail({
        magicLink: testLink,
        type: 'main',
        lang: 'en',
        ttlMinutes: 15,
      });

      expect(result.subject).toBe('Sign in to Przeprogramowani Platform');
      expect(result.html).toContain(testLink);
      expect(result.html).toContain('Sign In');
      expect(result.html).toContain('lang="en"');
    });
  });

  describe('external template', () => {
    it('generates Polish external template with course name', () => {
      const result = generateMagicLinkEmail({
        magicLink: testLink,
        type: 'external',
        lang: 'pl',
        ttlMinutes: 90,
        courseName: 'Opanuj Frontend',
      });

      expect(result.subject).toBe('Zaloguj się do kursu: Opanuj Frontend');
      expect(result.html).toContain('Opanuj Frontend');
      expect(result.html).toContain('Przejdź do kursu');
      expect(result.html).toContain(testLink);
    });

    it('generates English external template with course name', () => {
      const result = generateMagicLinkEmail({
        magicLink: testLink,
        type: 'external',
        lang: 'en',
        ttlMinutes: 90,
        courseName: 'Master Frontend',
      });

      expect(result.subject).toBe('Sign in to course: Master Frontend');
      expect(result.html).toContain('Master Frontend');
      expect(result.html).toContain('Go to Course');
    });

    it('throws error when courseName missing for external template', () => {
      expect(() =>
        generateMagicLinkEmail({
          magicLink: testLink,
          type: 'external',
          lang: 'pl',
          ttlMinutes: 90,
        })
      ).toThrow('courseName is required for external template');
    });
  });

  describe('email structure', () => {
    it('includes all required HTML elements', () => {
      const result = generateMagicLinkEmail({
        magicLink: testLink,
        type: 'main',
        lang: 'pl',
        ttlMinutes: 15,
      });

      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('<meta charset="UTF-8">');
      expect(result.html).toContain('href="' + testLink + '"');
      expect(result.html).toContain('Przeprogramowani');
    });
  });
});
