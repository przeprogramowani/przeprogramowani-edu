import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyExternalAuthMock, upsertUserMock, loadQuizResultMock, saveQuizResultMock } = vi.hoisted(() => ({
  verifyExternalAuthMock: vi.fn(),
  upsertUserMock: vi.fn(),
  loadQuizResultMock: vi.fn(),
  saveQuizResultMock: vi.fn(),
}));

vi.mock('@/server/externalAuth', () => ({
  verifyExternalAuth: verifyExternalAuthMock,
}));

vi.mock('@/server/supabase/userService', () => ({
  upsertUser: upsertUserMock,
}));

vi.mock('@/server/supabase/quizResultService', () => ({
  loadQuizResult: loadQuizResultMock,
  saveQuizResult: saveQuizResultMock,
}));

import { GET, PUT } from '../../src/pages/api/quiz-result';

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

describe('/api/quiz-result', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyExternalAuthMock.mockResolvedValue({
      isAuthenticated: true,
      email: 'user@example.com',
      courseId: '10xdevs-3-prework',
    });
    upsertUserMock.mockResolvedValue('user-123');
  });

  it('rejects unsupported quiz requests', async () => {
    const response = await GET(
      context('https://example.com/api/quiz-result?courseSlug=bad&quizSlug=prework-path&language=pl')
    );

    expect(response.status).toBe(400);
  });

  it('rejects unauthenticated reads', async () => {
    verifyExternalAuthMock.mockResolvedValue({ isAuthenticated: false });

    const response = await GET(
      context('https://example.com/api/quiz-result?courseSlug=10xdevs-3-prework&quizSlug=prework-path&language=pl')
    );

    expect(response.status).toBe(401);
  });

  it('loads the latest quiz result for course, quiz, and language', async () => {
    loadQuizResultMock.mockResolvedValue({ result: { recommendations: [] } });

    const response = await GET(
      context('https://example.com/api/quiz-result?courseSlug=10xdevs-3-prework&quizSlug=prework-path&language=en')
    );

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ result: { result: { recommendations: [] } } });
    expect(loadQuizResultMock).toHaveBeenCalledWith(
      'user-123',
      '10xdevs-3-prework',
      'prework-path',
      'en',
      env
    );
  });

  it('saves a recomputed quiz result', async () => {
    saveQuizResultMock.mockImplementation(async (_userId, record) => record);

    const response = await PUT(
      context('https://example.com/api/quiz-result', {
        courseSlug: '10xdevs-3-prework',
        quizSlug: 'prework-path',
        language: 'pl',
        answers: {
          foundations: 'unsure',
          stackKnown: [],
        },
      })
    );

    expect(response.status).toBe(200);
    expect(saveQuizResultMock).toHaveBeenCalledWith(
      'user-123',
      expect.objectContaining({
        courseSlug: '10xdevs-3-prework',
        quizSlug: 'prework-path',
        language: 'pl',
        result: expect.objectContaining({
          recommendations: expect.arrayContaining([
            expect.objectContaining({ lessonId: '02' }),
            expect.objectContaining({ lessonId: '14' }),
          ]),
        }),
      }),
      env
    );
  });

  it('rejects invalid answers', async () => {
    const response = await PUT(
      context('https://example.com/api/quiz-result', {
        courseSlug: '10xdevs-3-prework',
        quizSlug: 'prework-path',
        language: 'pl',
        answers: {
          foundations: { nested: true },
        },
      })
    );

    expect(response.status).toBe(400);
    expect(saveQuizResultMock).not.toHaveBeenCalled();
  });
});
