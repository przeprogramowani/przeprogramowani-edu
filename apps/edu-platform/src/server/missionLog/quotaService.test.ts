import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_GENERATIONS_PER_LESSON,
  QuotaExhaustedError,
  getQuotaForUser,
  recordGeneration,
} from './quotaService';
import { getSupabaseAdmin } from '@/server/supabase/client';

vi.mock('@/server/supabase/client', () => ({
  getSupabaseAdmin: vi.fn(),
}));

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_KEY: 'service-key' };

function createQueryMock(result: unknown) {
  const query: Record<string, ReturnType<typeof vi.fn>> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.insert = vi.fn(() => Promise.resolve(result) as never);
  query.update = vi.fn(() => query);
  query.maybeSingle = vi.fn(() => Promise.resolve(result) as never);
  query.then = vi.fn((resolve, reject) =>
    Promise.resolve(result).then(resolve, reject),
  );
  return query;
}

describe('getQuotaForUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped rows', async () => {
    const query = createQueryMock({
      data: [
        {
          lesson_id: 'm1-l1',
          count: 1,
          last_badge_image_url: 'https://example.test/a.png',
          last_badge_id: 1,
        },
      ],
      error: null,
    });
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

    await expect(getQuotaForUser('user-id', env)).resolves.toEqual([
      { lessonId: 'm1-l1', count: 1, lastBadgeImageUrl: 'https://example.test/a.png', lastBadgeId: 1 },
    ]);
  });

  it('throws on supabase error', async () => {
    const query = createQueryMock({ data: null, error: { message: 'db down' } });
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);
    await expect(getQuotaForUser('user-id', env)).rejects.toThrow(
      'Failed to load mission log quota: db down',
    );
  });
});

describe('recordGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const input = {
    userId: 'user-id',
    lessonId: 'm1-l1',
    badgeId: 1,
    badgeImageUrl: 'https://example.test/a.png',
  };

  it('first generation inserts a row with count=1', async () => {
    const findQuery = createQueryMock({ data: null, error: null });
    const insertQuery = createQueryMock({ error: null });
    const from = vi.fn().mockReturnValueOnce(findQuery).mockReturnValueOnce(insertQuery);
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from } as never);

    await expect(recordGeneration(input, env)).resolves.toEqual({ count: 1 });

    expect(insertQuery.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-id',
        lesson_id: 'm1-l1',
        count: 1,
        last_badge_id: 1,
        last_badge_image_url: 'https://example.test/a.png',
      }),
    );
  });

  it('second generation increments count to 2', async () => {
    const findQuery = createQueryMock({ data: { count: 1 }, error: null });
    const updateQuery = createQueryMock({ error: null });
    const from = vi.fn().mockReturnValueOnce(findQuery).mockReturnValueOnce(updateQuery);
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from } as never);

    await expect(recordGeneration(input, env)).resolves.toEqual({ count: 2 });

    expect(updateQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({ count: 2 }),
    );
  });

  it('third generation throws QuotaExhaustedError', async () => {
    const findQuery = createQueryMock({ data: { count: MAX_GENERATIONS_PER_LESSON }, error: null });
    const from = vi.fn().mockReturnValueOnce(findQuery);
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from } as never);

    await expect(recordGeneration(input, env)).rejects.toBeInstanceOf(QuotaExhaustedError);
  });
});
