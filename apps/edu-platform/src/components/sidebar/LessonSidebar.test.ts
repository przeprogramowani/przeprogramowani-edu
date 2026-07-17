import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import LessonSidebar from './LessonSidebar.svelte';
import { getExternalLessonShellCopy } from '@/lib/externalLessonShellCopy';

describe('LessonSidebar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Polish flat sidebar labels by default', () => {
    render(LessonSidebar, {
      mode: 'flat',
      lessons: [
        { id: '01', name: 'Pierwsza lekcja' },
        { id: '02', name: 'Druga lekcja' },
      ],
      activeLessonId: '01',
      lessonUrlPrefix: '/courses/example/lesson',
    });

    expect(screen.getByText('Lekcje')).toBeInTheDocument();
    expect(screen.getByText('2 w kursie')).toBeInTheDocument();
  });

  it('renders English grouped lesson counts when labels are provided', () => {
    render(LessonSidebar, {
      mode: 'grouped',
      courseId: '10xdevs-3-prework',
      sections: [{ id: 1, name: 'Prework', position: 1 }],
      lessons: [
        { id: '01', name: 'First lesson', sectionId: 1 },
        { id: '02', name: 'Second lesson', sectionId: 1 },
      ],
      activeLessonId: '01',
      lessonUrlPrefix: '/external/10xdevs-3-prework/en',
      labels: getExternalLessonShellCopy('en'),
    });

    expect(screen.getByText('2 lessons')).toBeInTheDocument();
  });

  it('renders a quiz personalization marker for recommended grouped lessons only', () => {
    render(LessonSidebar, {
      mode: 'grouped',
      courseId: '10xdevs-3-prework',
      sections: [{ id: 1, name: 'Prework', position: 1 }],
      lessons: [
        {
          id: '02',
          name: 'Chatbot vs Agent',
          sectionId: 1,
          personalization: {
            label: '💡',
            tooltip: 'Sugestia na podstawie quizu: Warto uporządkować definicje.',
          },
        },
        { id: '03', name: 'Jak uczyć się z AI', sectionId: 1 },
      ],
      activeLessonId: '02',
      lessonUrlPrefix: '/external/10xdevs-3-prework/pl',
    });

    const marker = screen.getByLabelText('Sugestia na podstawie quizu: Warto uporządkować definicje.');
    expect(marker).toBeInTheDocument();
    expect(marker).toHaveTextContent('💡');
    expect(marker).toHaveTextContent('Sugestia na podstawie quizu: Warto uporządkować definicje.');
    expect(screen.getAllByText('💡')).toHaveLength(1);
  });

  it('renders progress toggle separately from the lesson anchor', () => {
    render(LessonSidebar, {
      mode: 'flat',
      lessons: [
        { id: '01', name: 'Pierwsza lekcja', progress: { completed: false, lessonId: '01' } },
      ],
      activeLessonId: '01',
      lessonUrlPrefix: '/courses/example/lesson',
      progressScope: { courseSlug: 'cursor-ai', language: null },
    });

    const toggle = screen.getByRole('button', { name: 'Oznacz jako ukończone: Pierwsza lekcja' });
    const link = screen.getByRole('link', { name: 'Pierwsza lekcja' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle.closest('a')).toBeNull();
    expect(link).toHaveAttribute('href', '/courses/example/lesson/01');
  });

  it('keeps the link-only row when progress is unavailable', () => {
    render(LessonSidebar, {
      mode: 'flat',
      lessons: [{ id: '01', name: 'Pierwsza lekcja' }],
      activeLessonId: '01',
      lessonUrlPrefix: '/courses/example/lesson',
    });

    expect(screen.queryByRole('button', { name: /Pierwsza lekcja/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pierwsza lekcja' })).toHaveAttribute(
      'href',
      '/courses/example/lesson/01'
    );
  });

  it('renders grouped progress toggle separately from the lesson anchor', () => {
    render(LessonSidebar, {
      mode: 'grouped',
      courseId: '10xdevs-2',
      sections: [{ id: 1, name: 'Module', position: 1 }],
      lessons: [{ id: '100', name: 'Grouped lesson', sectionId: 1, progress: { completed: false, lessonId: '100' } }],
      activeLessonId: '100',
      lessonUrlPrefix: '/external/10xdevs-2',
      progressScope: { courseSlug: '10xdevs-2', language: null },
    });

    const toggle = screen.getByRole('button', { name: 'Oznacz jako ukończone: Grouped lesson' });
    const link = screen.getByRole('link', { name: 'Grouped lesson' });

    expect(toggle.closest('a')).toBeNull();
    expect(link).toHaveAttribute('href', '/external/10xdevs-2/100');
  });

  it('does not render lesson progress toggles for checklist items', () => {
    render(LessonSidebar, {
      mode: 'grouped',
      courseId: '10xdevs-2',
      sections: [{ id: 1, name: 'Module', position: 1 }],
      lessons: [{ id: '100', name: 'Lesson', sectionId: 1, progress: { completed: true, lessonId: '100' } }],
      activeLessonId: '100',
      lessonUrlPrefix: '/external/10xdevs-2',
      progressScope: { courseSlug: '10xdevs-2', language: null },
      checklists: [{ id: 'setup', title: 'Setup checklist' }],
      activeChecklistId: null,
    });

    expect(screen.getByRole('button', { name: 'Oznacz jako nieukończone: Lesson' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Setup checklist' })).toHaveAttribute(
      'href',
      '/external/10xdevs-2/checklists/setup'
    );
    expect(screen.queryByRole('button', { name: /Setup checklist/ })).not.toBeInTheDocument();
  });

  it('uses English progress labels when English shell copy is provided', () => {
    render(LessonSidebar, {
      mode: 'grouped',
      courseId: '10xdevs-3-prework',
      sections: [{ id: 1, name: 'Prework', position: 1 }],
      lessons: [{ id: '01', name: 'First lesson', sectionId: 1, progress: { completed: true, lessonId: '01' } }],
      activeLessonId: '01',
      lessonUrlPrefix: '/external/10xdevs-3-prework/en',
      labels: getExternalLessonShellCopy('en'),
      progressScope: { courseSlug: '10xdevs-3-prework', language: 'en' },
    });

    expect(screen.getByRole('button', { name: 'Mark as incomplete: First lesson' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
