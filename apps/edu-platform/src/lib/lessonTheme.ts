export const LESSON_THEME_STORAGE_KEY = 'lesson-theme';
export const LESSON_THEME_ATTRIBUTE = 'data-lesson-theme';

export type LessonTheme = 'dark' | 'light';

export function parseLessonTheme(value: string | null): LessonTheme | null {
  if (value === 'dark' || value === 'light') {
    return value;
  }

  return null;
}

export function getDefaultLessonTheme(): LessonTheme {
  return 'dark';
}

export function getStoredLessonTheme(): LessonTheme {
  if (typeof window === 'undefined') {
    return getDefaultLessonTheme();
  }

  try {
    return parseLessonTheme(window.localStorage.getItem(LESSON_THEME_STORAGE_KEY)) ?? getDefaultLessonTheme();
  } catch {
    return getDefaultLessonTheme();
  }
}

export function applyLessonTheme(theme: LessonTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.lessonTheme = theme;
}

export function storeLessonTheme(theme: LessonTheme): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LESSON_THEME_STORAGE_KEY, theme);
}
