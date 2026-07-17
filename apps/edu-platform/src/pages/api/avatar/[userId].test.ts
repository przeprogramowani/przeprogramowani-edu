import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/supabase/client', () => ({
  getSupabaseAdmin: vi.fn(),
}));

import { GET } from './[userId]';
import { getSupabaseAdmin } from '@/server/supabase/client';

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_KEY: 'service-key' };

function buildContext(userId: string | undefined) {
  return {
    params: { userId },
    locals: { runtime: { env } },
  } as never;
}

function mockDownload(result: {
  data?: { type: string; stream: () => ReadableStream } | null;
  error?: { message: string } | null;
}) {
  const bucket = { download: vi.fn(() => result) };
  vi.mocked(getSupabaseAdmin).mockReturnValue({
    storage: { from: vi.fn(() => bucket) },
  } as never);
  return bucket;
}

function makeBlobLike(type: string, bytes = new Uint8Array([1, 2, 3])) {
  return {
    type,
    stream: () =>
      new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
  };
}

const VALID_UUID = '11111111-2222-3333-4444-555555555555';

describe('GET /api/avatar/[userId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with content-type and cache headers on success', async () => {
    mockDownload({ data: makeBlobLike('image/png'), error: null });

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(res.body).not.toBeNull();
  });

  it('falls back to application/octet-stream when blob type is empty', async () => {
    mockDownload({ data: makeBlobLike(''), error: null });

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/octet-stream');
  });

  it('returns 400 on invalid UUID', async () => {
    const res = await GET(buildContext('not-a-uuid'));

    expect(res.status).toBe(400);
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('returns 400 on missing userId param', async () => {
    const res = await GET(buildContext(undefined));

    expect(res.status).toBe(400);
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('returns 404 when storage object is missing (StorageApiError shape)', async () => {
    mockDownload({ data: null, error: { message: 'Object not found' } });

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(404);
  });

  it('returns 404 when storage object is missing (StorageUnknownError shape)', async () => {
    // The Supabase JS SDK surfaces some missing-object responses as StorageUnknownError
    // with the original HTTP status hung off `originalError.status`.
    mockDownload({
      data: null,
      error: { message: '{}', originalError: { status: 400 } } as never,
    });

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(404);
  });

  it('returns 502 on any other download error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockDownload({ data: null, error: { message: 'Internal Server Error' } });

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(502);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('returns 502 when the SDK throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      storage: {
        from: vi.fn(() => ({
          download: vi.fn(() => {
            throw new Error('network');
          }),
        })),
      },
    } as never);

    const res = await GET(buildContext(VALID_UUID));

    expect(res.status).toBe(502);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
