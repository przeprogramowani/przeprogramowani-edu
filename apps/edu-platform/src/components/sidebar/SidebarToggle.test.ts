import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import SidebarToggle from './SidebarToggle.svelte';
import { getExternalLessonShellCopy } from '@/lib/externalLessonShellCopy';
import { SIDEBAR_STORAGE_KEY, EXTERNAL_SIDEBAR_STORAGE_KEY } from '@/lib/topBarHelpers';

describe('SidebarToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('renders a toggle button after mount', () => {
    render(SidebarToggle);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has correct aria-label when expanded', () => {
    render(SidebarToggle);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Zwiń menu');
  });

  it('toggles collapsed state on click and updates localStorage', async () => {
    render(SidebarToggle);
    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe('true');
    expect(button).toHaveAttribute('aria-label', 'Rozwiń menu');
  });

  it('uses custom English labels when provided', async () => {
    render(SidebarToggle, {
      labels: getExternalLessonShellCopy('en'),
    });
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Collapse menu');

    await fireEvent.click(button);

    expect(button).toHaveAttribute('aria-label', 'Expand menu');
  });

  it('reads initial collapsed state from localStorage', () => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');
    render(SidebarToggle);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Rozwiń menu');
  });

  it('adds sidebar-collapsed class to body when collapsed', async () => {
    render(SidebarToggle);
    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(document.body.classList.contains('sidebar-collapsed')).toBe(true);
  });

  it('removes sidebar-collapsed class from body on second click', async () => {
    render(SidebarToggle);
    const button = screen.getByRole('button');

    await fireEvent.click(button);
    await fireEvent.click(button);

    expect(document.body.classList.contains('sidebar-collapsed')).toBe(false);
  });

  it('migrates from EXTERNAL_SIDEBAR_STORAGE_KEY to SIDEBAR_STORAGE_KEY on mount', () => {
    localStorage.setItem(EXTERNAL_SIDEBAR_STORAGE_KEY, 'true');

    render(SidebarToggle);

    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe('true');
    expect(localStorage.getItem(EXTERNAL_SIDEBAR_STORAGE_KEY)).toBeNull();

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Rozwiń menu');
  });
});
