import { describe, expect, it } from 'vitest';
import {
  formatExternalLessonCount,
  formatExternalLessonsInCourseCount,
  getExternalLessonShellCopy,
} from './externalLessonShellCopy';

describe('externalLessonShellCopy', () => {
  it('returns Polish shell copy by default', () => {
    const copy = getExternalLessonShellCopy();

    expect(copy.htmlLang).toBe('pl');
    expect(copy.downloadMarkdown).toBe('Pobierz Markdown');
  });

  it('returns English shell copy when requested', () => {
    const copy = getExternalLessonShellCopy('en');

    expect(copy.htmlLang).toBe('en');
    expect(copy.downloadMarkdown).toBe('Download Markdown');
  });

  it('formats basic English lesson counts', () => {
    const copy = getExternalLessonShellCopy('en');

    expect(formatExternalLessonCount(1, copy)).toBe('1 lesson');
    expect(formatExternalLessonCount(2, copy)).toBe('2 lessons');
    expect(formatExternalLessonsInCourseCount(2, copy)).toBe('2 in course');
  });
});
