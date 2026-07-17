import { beforeEach, describe, expect, it, vi } from 'vitest';

const { resolveLessonProgressUserMock, loadLessonProgressMock, setLessonCompletionMock } = vi.hoisted(() => ({
  resolveLessonProgressUserMock: vi.fn(),
  loadLessonProgressMock: vi.fn(),
  setLessonCompletionMock: vi.fn(),
}));

vi.mock('@/server/progress/lessonProgressAuth', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/server/progress/lessonProgressAuth')>();
  return {
    ...original,
    resolveLessonProgressUser: resolveLessonProgressUserMock,
  };
});

vi.mock('@/server/supabase/lessonProgressService', () => ({
  loadLessonProgress: loadLessonProgressMock,
  setLessonCompletion: setLessonCompletionMock,
}));

import { GET, PUT } from '../../src/pages/api/lesson-progress';

const env = {
  JWT_SECRET: 'secret',
  SUPABASE_URL: 'https://supabase.test',
  SUPABASE_SERVICE_KEY: 'service-key',
};

function context(url: string, body?: unknown) {
  return {
    url: new URL(url),
    request: {
      json: vi.fn().mockResolvedValue(body),
    },
    cookies: {
      get: vi.fn(),
    },
    locals: {
      runtime: {
        env,
      },
    },
  } as any;
}

async function readJson(response: Response) {
  return response.json();
}

describe('/api/lesson-progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveLessonProgressUserMock.mockResolvedValue({
      ok: true,
      user: { userId: 'user-123', email: 'user@example.com' },
    });
  });

  it('rejects unsupported course slug', async () => {
    const response = await GET(context('https://example.com/api/lesson-progress?courseSlug=bad'));

    expect(response.status).toBe(400);
    expect(resolveLessonProgressUserMock).not.toHaveBeenCalled();
    expect(loadLessonProgressMock).not.toHaveBeenCalled();
  });

  it('rejects missing prework language', async () => {
    const response = await GET(
      context('https://example.com/api/lesson-progress?courseSlug=10xdevs-3-prework')
    );

    expect(response.status).toBe(400);
    expect(resolveLessonProgressUserMock).not.toHaveBeenCalled();
  });

  it('rejects non-prework language values', async () => {
    const response = await GET(
      context('https://example.com/api/lesson-progress?courseSlug=cursor-ai&language=pl')
    );

    expect(response.status).toBe(400);
    expect(resolveLessonProgressUserMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated request', async () => {
    resolveLessonProgressUserMock.mockResolvedValue({ ok: false, status: 401, error: 'Unauthorized' });

    const response = await GET(context('https://example.com/api/lesson-progress?courseSlug=cursor-ai'));

    expect(response.status).toBe(401);
    expect(loadLessonProgressMock).not.toHaveBeenCalled();
  });

  it('batch load calls service with user, course slug, and language', async () => {
    loadLessonProgressMock.mockResolvedValue([
      { lessonId: '01', completedAt: '2026-04-28T10:00:00.000Z' },
    ]);

    const response = await GET(
      context('https://example.com/api/lesson-progress?courseSlug=10xdevs-3-prework&language=en')
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      progress: [{ lessonId: '01', completedAt: '2026-04-28T10:00:00.000Z' }],
    });
    expect(loadLessonProgressMock).toHaveBeenCalledWith(
      'user-123',
      { courseSlug: '10xdevs-3-prework', language: 'en' },
      env
    );
  });

  it('rejects invalid lesson ID and completed value', async () => {
    const invalidLesson = await PUT(
      context('https://example.com/api/lesson-progress', {
        courseSlug: 'cursor-ai',
        lessonId: '   ',
        completed: true,
      })
    );
    const invalidCompleted = await PUT(
      context('https://example.com/api/lesson-progress', {
        courseSlug: 'cursor-ai',
        lessonId: 'intro',
        completed: 'yes',
      })
    );

    expect(invalidLesson.status).toBe(400);
    expect(invalidCompleted.status).toBe(400);
    expect(setLessonCompletionMock).not.toHaveBeenCalled();
  });

  it('toggle complete calls service with completed true', async () => {
    setLessonCompletionMock.mockResolvedValue({
      lessonId: 'intro',
      completedAt: '2026-04-28T10:00:00.000Z',
    });

    const response = await PUT(
      context('https://example.com/api/lesson-progress', {
        courseSlug: 'cursor-ai',
        lessonId: 'intro',
        completed: true,
      })
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      progress: { lessonId: 'intro', completed: true, completedAt: '2026-04-28T10:00:00.000Z' },
    });
    expect(setLessonCompletionMock).toHaveBeenCalledWith(
      'user-123',
      { courseSlug: 'cursor-ai', language: null, lessonId: 'intro', completed: true },
      env
    );
  });

  it('toggle incomplete calls service with completed false', async () => {
    setLessonCompletionMock.mockResolvedValue(null);

    const response = await PUT(
      context('https://example.com/api/lesson-progress', {
        courseSlug: '10xdevs-3-prework',
        language: 'pl',
        lessonId: '01',
        completed: false,
      })
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      progress: { lessonId: '01', completed: false, completedAt: null },
    });
    expect(setLessonCompletionMock).toHaveBeenCalledWith(
      'user-123',
      { courseSlug: '10xdevs-3-prework', language: 'pl', lessonId: '01', completed: false },
      env
    );
  });

  it('service errors return 500', async () => {
    loadLessonProgressMock.mockRejectedValue(new Error('database down'));

    const response = await GET(context('https://example.com/api/lesson-progress?courseSlug=cursor-ai'));

    expect(response.status).toBe(500);
  });
});
