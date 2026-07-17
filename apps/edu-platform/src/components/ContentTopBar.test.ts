import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import type { ComponentProps } from 'svelte';
import ContentTopBar from './ContentTopBar.svelte';
import { getExternalLessonShellCopy } from '@/lib/externalLessonShellCopy';
import type { TocItem } from '@/types/toc';

const TEST_STORAGE_KEY = 'content-topbar-test';
const TEST_HEADING_ID = 'sekcja-testowa';
const TEST_HEADINGS: TocItem[] = [
  {
    id: TEST_HEADING_ID,
    text: 'Sekcja testowa',
    level: 2,
    children: [],
    parentId: null,
  },
];

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
const originalWindowScrollTo = window.scrollTo;
const originalElementScrollTo = HTMLElement.prototype.scrollTo;
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');

function createContentFixture(top = 200) {
  const content = document.createElement('article');
  content.className = 'ebook-content';

  const heading = document.createElement('h2');
  heading.id = TEST_HEADING_ID;
  heading.textContent = 'Sekcja testowa';
  heading.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: top,
    top,
    left: 0,
    bottom: top + 40,
    right: 640,
    width: 640,
    height: 40,
    toJSON: () => ({}),
  }));

  content.appendChild(heading);
  document.body.appendChild(content);

  return { content, heading };
}

function renderTopBar(props: Partial<ComponentProps<typeof ContentTopBar>> = {}) {
  return render(ContentTopBar, {
    logoSrc: '/logo.png',
    logoSmallSrc: '/logo-small.png',
    headings: TEST_HEADINGS,
    tocStorageKey: TEST_STORAGE_KEY,
    contentSelector: '.ebook-content',
    sectionPanelLabel: 'Sekcje',
    breadcrumb: {
      primary: '10xDevs 3.0',
      secondary: 'Ebook',
    },
    ...props,
  });
}

describe('ContentTopBar', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    document.body.innerHTML = '';
    document.documentElement.className = '';
    window.history.replaceState(null, '', '/ebook');

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return this.classList.contains('sticky') ? 64 : 0;
      },
    });

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120,
    });

    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
    document.documentElement.className = '';
    localStorage.clear();
    vi.clearAllMocks();

    if (originalOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    }

    if (originalWindowScrollTo) {
      Object.defineProperty(window, 'scrollTo', {
        configurable: true,
        value: originalWindowScrollTo,
      });
    }

    if (originalElementScrollTo) {
      Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
        configurable: true,
        value: originalElementScrollTo,
      });
    }

    if (originalScrollIntoView) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
        configurable: true,
        value: originalScrollIntoView,
      });
    }

    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY);
    }

    window.history.replaceState(null, '', '/ebook');
  });

  it('restores the desktop TOC widget as open from localStorage', async () => {
    localStorage.setItem(TEST_STORAGE_KEY, 'true');
    createContentFixture();

    const { container } = renderTopBar();

    await waitFor(() => {
      expect(container.querySelector('.toc-desktop-widget')).toBeInTheDocument();
    });

    const desktopToggle = container.querySelector('.toc-toggle-desktop');
    expect(desktopToggle).toHaveAttribute('aria-expanded', 'true');
    expect(desktopToggle).toHaveAttribute('aria-label', 'Ukryj Sekcje');
  });

  it('restores the desktop TOC widget as closed from localStorage', async () => {
    localStorage.setItem(TEST_STORAGE_KEY, 'false');
    createContentFixture();

    const { container } = renderTopBar();

    await waitFor(() => {
      const desktopToggle = container.querySelector('.toc-toggle-desktop');
      expect(desktopToggle).toHaveAttribute('aria-expanded', 'false');
    });

    expect(container.querySelector('.toc-desktop-widget')).not.toBeInTheDocument();
    expect(container.querySelector('.toc-toggle-desktop')).toHaveAttribute('aria-label', 'Pokaż Sekcje');
  });

  it('scrolls to the hashed heading with the sticky topbar offset on init', async () => {
    localStorage.setItem(TEST_STORAGE_KEY, 'true');
    createContentFixture(200);
    window.history.replaceState(null, '', `/ebook#${TEST_HEADING_ID}`);

    const { container } = renderTopBar({ sticky: true });

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 256, behavior: 'auto' });
    });

    const activeLink = container.querySelector(`a[href="#${TEST_HEADING_ID}"]`);
    expect(activeLink).toHaveAttribute('data-toc-active', 'true');
  });

  it('updates the hash and uses smooth scrolling when a TOC item is clicked', async () => {
    localStorage.setItem(TEST_STORAGE_KEY, 'true');
    createContentFixture(200);

    const { container } = renderTopBar({ sticky: true });

    await waitFor(() => {
      expect(container.querySelector('.toc-desktop-widget')).toBeInTheDocument();
    });

    vi.mocked(window.scrollTo).mockClear();

    const tocLink = container.querySelector(`a[href="#${TEST_HEADING_ID}"]`);
    expect(tocLink).toBeInTheDocument();

    await fireEvent.click(tocLink!);

    expect(window.location.hash).toBe(`#${TEST_HEADING_ID}`);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 256, behavior: 'smooth' });
  });

  describe('SSR-rendered toggle buttons (no hydration gate)', () => {
    it('renders the theme toggle only when opted in', () => {
      const hidden = renderTopBar({ showThemeToggle: false });
      expect(hidden.container.querySelector('.lesson-theme-toggle')).not.toBeInTheDocument();
      hidden.unmount();

      const visible = renderTopBar({ showThemeToggle: true });
      expect(visible.container.querySelector('.lesson-theme-toggle')).toBeInTheDocument();
    });

    it('renders English shell copy when provided', async () => {
      localStorage.setItem(TEST_STORAGE_KEY, 'true');
      createContentFixture();

      const englishCopy = getExternalLessonShellCopy('en');
      const { container } = renderTopBar({
        breadcrumb: null,
        shellCopy: englishCopy,
        sectionPanelLabel: undefined,
        prevUrl: '/previous',
        nextUrl: '/next',
        downloadUrl: '/lesson/markdown',
        downloadName: 'lesson',
        lessons: [
          { id: '01', name: 'First lesson' },
          { id: '02', name: 'Second lesson' },
        ],
        activeLessonId: '01',
        lessonUrlPrefix: '/courses/example/lesson',
      });

      expect(container).toHaveTextContent('Lessons');
      expect(container).toHaveTextContent('Sections');
      expect(container).toHaveTextContent('← Previous');
      expect(container).toHaveTextContent('Next →');
      expect(container).toHaveTextContent('Download Markdown');
      expect(container.querySelector('a[title="Home"]')).toBeInTheDocument();
      expect(container.querySelector('a[title="Download in Markdown format"]')).toBeInTheDocument();

      await waitFor(() => {
        expect(container.querySelector('.toc-desktop-widget')).toBeInTheDocument();
      });
      expect(container.querySelector('.toc-desktop-widget')).toHaveTextContent('Table of contents');
    });

    it('renders the Lekcje toggle button synchronously when lessons are provided', () => {
      const { container } = renderTopBar({
        breadcrumb: null,
        headings: [],
        lessons: [
          { id: '01', name: 'Pierwsza lekcja' },
          { id: '02', name: 'Druga lekcja' },
        ],
        activeLessonId: '01',
        lessonUrlPrefix: '/courses/opanuj-frontend/lesson',
        lessonPanelLabel: 'Lekcje',
      });

      const lessonsToggle = container.querySelector('button[aria-controls^="topbar-lessons-"]');
      expect(lessonsToggle).toBeInTheDocument();
      expect(lessonsToggle).toHaveAttribute('aria-label', 'Pokaż Lekcje');
    });

    it('renders both Sekcje toggle buttons (desktop + mobile) synchronously when headings are provided', () => {
      const { container } = renderTopBar();

      expect(container.querySelector('.toc-toggle-desktop')).toBeInTheDocument();
      expect(container.querySelector('.toc-toggle-mobile')).toBeInTheDocument();
    });

    it('uses lessonUrlPrefix for grouped mobile lesson links', async () => {
      const { container } = renderTopBar({
        breadcrumb: null,
        headings: [],
        homeUrl: '/external/10xdevs-3-prework/en',
        courseId: '10xdevs-3-prework',
        sections: [{ id: 1, name: 'Prework' }],
        groupedLessons: [
          { id: '02', name: 'Second lesson', sectionId: 1 },
          { id: '03', name: 'Third lesson', sectionId: 1 },
        ],
        activeExternalLessonId: '02',
        lessonUrlPrefix: '/external/10xdevs-3-prework/en',
        lessonPanelLabel: 'Lekcje',
      });

      const lessonsToggle = container.querySelector('button[aria-controls^="topbar-lessons-"]');
      expect(lessonsToggle).toBeInTheDocument();

      await fireEvent.click(lessonsToggle!);

      await waitFor(() => {
        expect(container.querySelector('a[href="/external/10xdevs-3-prework/en/02"]')).toBeInTheDocument();
      });
      expect(container.querySelector('a[href="/external/10xdevs-3-prework/en"]')).toBeInTheDocument();
    });

    it('renders quiz personalization markers in the grouped mobile lesson panel', async () => {
      const { container } = renderTopBar({
        breadcrumb: null,
        headings: [],
        homeUrl: '/external/10xdevs-3-prework/pl',
        courseId: '10xdevs-3-prework',
        sections: [{ id: 1, name: 'Prework' }],
        groupedLessons: [
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
        activeExternalLessonId: '02',
        lessonUrlPrefix: '/external/10xdevs-3-prework/pl',
        lessonPanelLabel: 'Lekcje',
      });

      const lessonsToggle = container.querySelector('button[aria-controls^="topbar-lessons-"]');
      expect(lessonsToggle).toBeInTheDocument();

      await fireEvent.click(lessonsToggle!);

      await waitFor(() => {
        expect(screen.getByLabelText('Sugestia na podstawie quizu: Warto uporządkować definicje.')).toBeInTheDocument();
      });
      expect(screen.getAllByText('💡')).toHaveLength(1);
    });

    it('defaults grouped mobile lesson links to standard external course URLs', async () => {
      const { container } = renderTopBar({
        breadcrumb: null,
        headings: [],
        courseId: '10xdevs-2',
        sections: [{ id: 1, name: 'Module' }],
        groupedLessons: [
          { id: 123, name: 'External lesson', sectionId: 1 },
        ],
        activeExternalLessonId: 123,
      });

      const lessonsToggle = container.querySelector('button[aria-controls^="topbar-lessons-"]');
      expect(lessonsToggle).toBeInTheDocument();

      await fireEvent.click(lessonsToggle!);

      await waitFor(() => {
        expect(container.querySelector('a[href="/external/10xdevs-2/123"]')).toBeInTheDocument();
      });
    });
  });
});
