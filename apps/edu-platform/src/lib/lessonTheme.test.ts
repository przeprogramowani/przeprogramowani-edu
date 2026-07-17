import { describe, expect, it } from 'vitest';
import { getDefaultLessonTheme, parseLessonTheme } from './lessonTheme';

describe('lessonTheme', () => {
  it('parses supported lesson themes', () => {
    expect(parseLessonTheme('dark')).toBe('dark');
    expect(parseLessonTheme('light')).toBe('light');
  });

  it('rejects unsupported values', () => {
    expect(parseLessonTheme(null)).toBeNull();
    expect(parseLessonTheme('system')).toBeNull();
    expect(parseLessonTheme('')).toBeNull();
  });

  it('defaults to dark', () => {
    expect(getDefaultLessonTheme()).toBe('dark');
  });
});
