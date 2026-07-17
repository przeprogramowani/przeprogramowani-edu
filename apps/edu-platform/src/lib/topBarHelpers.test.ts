import { describe, it, expect } from 'vitest';
import {
  findActiveSectionId,
  buildDownloadHref,
  buildLessonHref,
  getChecklistCountLabel,
  EXTERNAL_SIDEBAR_STORAGE_KEY,
} from './topBarHelpers';

describe('findActiveSectionId', () => {
  const lessons = [
    { id: 100, sectionId: 1 },
    { id: 200, sectionId: 1 },
    { id: 300, sectionId: 2 },
    { id: 400, sectionId: 3 },
  ];

  it('returns the sectionId for the active lesson', () => {
    expect(findActiveSectionId(lessons, 300)).toBe(2);
  });

  it('returns the first matching sectionId when lesson is in a shared section', () => {
    expect(findActiveSectionId(lessons, 100)).toBe(1);
    expect(findActiveSectionId(lessons, 200)).toBe(1);
  });

  it('returns null when activeExternalLessonId is null', () => {
    expect(findActiveSectionId(lessons, null)).toBeNull();
  });

  it('returns null when the lesson is not found', () => {
    expect(findActiveSectionId(lessons, 999)).toBeNull();
  });

  it('returns null for empty lessons array', () => {
    expect(findActiveSectionId([], 100)).toBeNull();
  });
});

describe('buildDownloadHref', () => {
  it('returns null when downloadUrl is null', () => {
    expect(buildDownloadHref(null, 'file.md')).toBeNull();
  });

  it('returns null when downloadUrl is undefined', () => {
    expect(buildDownloadHref(undefined, 'file.md')).toBeNull();
  });

  it('returns the URL as-is when downloadName is null', () => {
    expect(buildDownloadHref('/download/123', null)).toBe('/download/123');
  });

  it('returns the URL as-is when downloadName is undefined', () => {
    expect(buildDownloadHref('/download/123', undefined)).toBe('/download/123');
  });

  it('appends encoded filename query param when both are provided', () => {
    expect(buildDownloadHref('/download/123', 'my file.md')).toBe(
      '/download/123?filename=my%20file.md'
    );
  });

  it('encodes special characters in downloadName', () => {
    expect(buildDownloadHref('/dl', 'lekcja (1).md')).toBe(
      '/dl?filename=lekcja%20(1).md'
    );
  });
});

describe('getChecklistCountLabel', () => {
  it('returns singular form for count of 1', () => {
    expect(getChecklistCountLabel(1)).toBe('checklista');
  });

  it('returns few-form for counts 2-4', () => {
    expect(getChecklistCountLabel(2)).toBe('checklisty');
    expect(getChecklistCountLabel(3)).toBe('checklisty');
    expect(getChecklistCountLabel(4)).toBe('checklisty');
  });

  it('returns many-form for counts >= 5', () => {
    expect(getChecklistCountLabel(5)).toBe('checklist');
    expect(getChecklistCountLabel(10)).toBe('checklist');
    expect(getChecklistCountLabel(100)).toBe('checklist');
  });
});

describe('buildLessonHref', () => {
  it('builds standard external lesson links', () => {
    expect(buildLessonHref('/external/10xdevs-2', 123)).toBe('/external/10xdevs-2/123');
  });

  it('builds localized prework lesson links', () => {
    expect(buildLessonHref('/external/10xdevs-3-prework/en', '02')).toBe(
      '/external/10xdevs-3-prework/en/02'
    );
  });
});

describe('EXTERNAL_SIDEBAR_STORAGE_KEY', () => {
  it('equals the expected localStorage key', () => {
    expect(EXTERNAL_SIDEBAR_STORAGE_KEY).toBe('external-sidebar-collapsed');
  });
});
