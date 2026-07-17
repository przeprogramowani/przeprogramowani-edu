import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadLessonProgress, setLessonCompletion } from './lessonProgressService';
import { getSupabaseAdmin } from './client';

vi.mock('./client', () => ({
  getSupabaseAdmin: vi.fn(),
}));

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_KEY: 'service-key' };

type QueryMock = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  is: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
};

function createQueryMock(result: unknown) {
  const query: QueryMock = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    is: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    maybeSingle: vi.fn(() => result),
    single: vi.fn(() => result),
    then: vi.fn((resolve, reject) => Promise.resolve(result).then(resolve, reject)),
  };

  return query;
}

describe('lessonProgressService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads progress for the default language scope with an is null filter', async () => {
    const query = createQueryMock({
      data: [
        {
          course_slug: 'cursor-ai',
          language: null,
          lesson_id: 'intro',
          completed_at: '2026-04-28T10:00:00.000Z',
          updated_at: '2026-04-28T10:00:00.000Z',
        },
      ],
      error: null,
    });

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await expect(loadLessonProgress('user-id', { courseSlug: 'cursor-ai' }, env)).resolves.toEqual([
      {
        courseSlug: 'cursor-ai',
        language: null,
        lessonId: 'intro',
        completedAt: '2026-04-28T10:00:00.000Z',
        updatedAt: '2026-04-28T10:00:00.000Z',
      },
    ]);

    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-id');
    expect(query.eq).toHaveBeenCalledWith('course_slug', 'cursor-ai');
    expect(query.is).toHaveBeenCalledWith('language', null);
  });

  it('loads progress for a language-specific scope with an equality filter', async () => {
    const query = createQueryMock({ data: [], error: null });

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await loadLessonProgress('user-id', { courseSlug: '10xdevs-3-prework', language: 'pl' }, env);

    expect(query.eq).toHaveBeenCalledWith('language', 'pl');
    expect(query.is).not.toHaveBeenCalled();
  });

  it('throws when loading progress fails', async () => {
    const query = createQueryMock({ data: null, error: { message: 'database unavailable' } });

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await expect(loadLessonProgress('user-id', { courseSlug: 'cursor-ai' }, env)).rejects.toThrow(
      'Failed to load lesson progress: database unavailable'
    );
  });

  it('inserts a completed lesson when no existing row is present', async () => {
    const findQuery = createQueryMock({
      data: null,
      error: null,
    });
    const insertQuery = createQueryMock({
      data: {
        course_slug: '10xdevs-3-prework',
        language: 'en',
        lesson_id: 'setup',
        completed_at: '2026-04-28T11:00:00.000Z',
        updated_at: '2026-04-28T11:00:00.000Z',
      },
      error: null,
    });
    const from = vi.fn().mockReturnValueOnce(findQuery).mockReturnValueOnce(insertQuery);

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from } as never);

    await expect(
      setLessonCompletion(
        'user-id',
        { courseSlug: '10xdevs-3-prework', language: 'en', lessonId: 'setup', completed: true },
        env
      )
    ).resolves.toEqual({
      courseSlug: '10xdevs-3-prework',
      language: 'en',
      lessonId: 'setup',
      completedAt: '2026-04-28T11:00:00.000Z',
      updatedAt: '2026-04-28T11:00:00.000Z',
    });

    expect(findQuery.maybeSingle).toHaveBeenCalled();
    expect(insertQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-id',
        course_slug: '10xdevs-3-prework',
        language: 'en',
        lesson_id: 'setup',
      })
    );
  });

  it('updates a completed lesson when an exact row already exists', async () => {
    const findQuery = createQueryMock({
      data: { id: 'progress-id' },
      error: null,
    });
    const updateQuery = createQueryMock({
      data: {
        course_slug: 'cursor-ai',
        language: null,
        lesson_id: 'intro',
        completed_at: '2026-04-28T11:30:00.000Z',
        updated_at: '2026-04-28T11:30:00.000Z',
      },
      error: null,
    });
    const from = vi.fn().mockReturnValueOnce(findQuery).mockReturnValueOnce(updateQuery);

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from } as never);

    await expect(
      setLessonCompletion('user-id', { courseSlug: 'cursor-ai', lessonId: 'intro', completed: true }, env)
    ).resolves.toMatchObject({
      courseSlug: 'cursor-ai',
      language: null,
      lessonId: 'intro',
    });

    expect(updateQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({
        completed_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
    expect(updateQuery.eq).toHaveBeenCalledWith('id', 'progress-id');
  });

  it('deletes a default-language lesson completion with an exact null language filter', async () => {
    const query = createQueryMock({ error: null });

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await expect(
      setLessonCompletion('user-id', { courseSlug: 'cursor-ai', lessonId: 'intro', completed: false }, env)
    ).resolves.toBeNull();

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-id');
    expect(query.eq).toHaveBeenCalledWith('course_slug', 'cursor-ai');
    expect(query.eq).toHaveBeenCalledWith('lesson_id', 'intro');
    expect(query.is).toHaveBeenCalledWith('language', null);
  });

  it('throws when deleting progress fails', async () => {
    const query = createQueryMock({ error: { message: 'delete failed' } });

    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await expect(
      setLessonCompletion('user-id', { courseSlug: 'cursor-ai', lessonId: 'intro', completed: false }, env)
    ).rejects.toThrow('Failed to delete lesson progress: delete failed');
  });
});
