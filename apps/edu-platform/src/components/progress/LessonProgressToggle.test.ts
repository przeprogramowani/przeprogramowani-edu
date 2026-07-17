import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LessonProgressToggle from './LessonProgressToggle.svelte';

describe('LessonProgressToggle', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('optimistically toggles completion and calls the progress API', async () => {
    render(LessonProgressToggle, {
      courseSlug: 'cursor-ai',
      lessonId: 'intro',
      language: null,
      completed: false,
      lessonName: 'Intro',
      variant: 'sidebar',
    });

    const button = screen.getByRole('button', { name: 'Oznacz jako ukończone: Intro' });

    await fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(fetch).toHaveBeenCalledWith(
      '/api/lesson-progress',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: 'cursor-ai',
          language: null,
          lessonId: 'intro',
          completed: true,
        }),
      })
    );
  });

  it('rolls back and shows a local error when the API request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    render(LessonProgressToggle, {
      courseSlug: 'cursor-ai',
      lessonId: 'intro',
      completed: false,
      lessonName: 'Intro',
      variant: 'content',
    });

    const button = screen.getByRole('button', { name: 'Oznacz jako ukończone: Intro' });

    await fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Nie udało się zapisać postępu')).toBeInTheDocument();
  });

  it('syncs controls with the same progress identity through the browser event', async () => {
    render(LessonProgressToggle, {
      courseSlug: '10xdevs-3-prework',
      language: 'en',
      lessonId: '01',
      completed: false,
      lessonName: 'First lesson',
      labels: { htmlLang: 'en' },
    });

    const button = screen.getByRole('button', { name: 'Mark as complete: First lesson' });

    window.dispatchEvent(
      new CustomEvent('lesson-progress:changed', {
        detail: {
          key: '10xdevs-3-prework:en:01',
          completed: true,
        },
      })
    );

    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'));
  });

  it('syncs two mounted controls after one toggle changes state', async () => {
    render(LessonProgressToggle, {
      courseSlug: 'cursor-ai',
      lessonId: 'intro',
      completed: false,
      lessonName: 'Intro',
      variant: 'content',
    });
    render(LessonProgressToggle, {
      courseSlug: 'cursor-ai',
      lessonId: 'intro',
      completed: false,
      lessonName: 'Intro',
      variant: 'sidebar',
    });

    const buttons = screen.getAllByRole('button', { name: 'Oznacz jako ukończone: Intro' });

    await fireEvent.click(buttons[0]);

    await waitFor(() => {
      for (const button of buttons) {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      }
    });
  });
});
