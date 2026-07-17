import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import LessonThemeToggle from './LessonThemeToggle.svelte';
import { LESSON_THEME_STORAGE_KEY } from '@/lib/lessonTheme';

describe('LessonThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-lesson-theme');
  });

  it('defaults to dark and offers light as the next action', () => {
    render(LessonThemeToggle);

    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement.dataset.lessonTheme).toBe('dark');
  });

  it('toggles to light, stores the value, and updates the document attribute', async () => {
    render(LessonThemeToggle);

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(localStorage.getItem(LESSON_THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.dataset.lessonTheme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toHaveAttribute('data-theme', 'light');
  });

  it('uses a stored light preference on mount', () => {
    localStorage.setItem(LESSON_THEME_STORAGE_KEY, 'light');

    render(LessonThemeToggle);

    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement.dataset.lessonTheme).toBe('light');
  });

  it('keeps visual state when storage writes fail', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    render(LessonThemeToggle);

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(document.documentElement.dataset.lessonTheme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();

    setItem.mockRestore();
  });
});
