import { beforeEach, describe, expect, it, vi } from 'vitest';

const { resolveTokenToEmailMock, loadGameStateMock } = vi.hoisted(() => ({
  resolveTokenToEmailMock: vi.fn(),
  loadGameStateMock: vi.fn(),
}));

vi.mock('@/server/game/apiTokenManager', () => ({
  resolveTokenToEmail: resolveTokenToEmailMock,
}));

vi.mock('@/server/game/serverGameStateManager', () => ({
  loadGameState: loadGameStateMock,
}));

import { GET } from './[scanId]';

function context(scanId: string, authorization = 'Bearer 10X-AAAA-BBBB-CCCC') {
  return {
    params: { scanId },
    request: new Request(`https://example.com/api/game/resources/echo/${scanId}`, {
      headers: authorization ? { Authorization: authorization } : {},
    }),
    locals: { runtime: { env: { ENV: 'PROD' } } },
  } as any;
}

describe('GET /api/game/resources/echo/[scanId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveTokenToEmailMock.mockResolvedValue('navigator@example.com');
    loadGameStateMock.mockResolvedValue({
      quests: { active: 'q-m1-echotrace', completed: [] },
    });
  });

  it('requires a Bearer token', async () => {
    const response = await GET(context('ECH-A17', ''));
    expect(response.status).toBe(401);
    expect(resolveTokenToEmailMock).not.toHaveBeenCalled();
  });

  it('requires the active or completed EchoTrace quest', async () => {
    loadGameStateMock.mockResolvedValue({ quests: { active: 'q-other', completed: [] } });
    const response = await GET(context('ECH-A17'));
    expect(response.status).toBe(403);
  });

  it('returns a deterministic scan without caching it publicly', async () => {
    const response = await GET(context('ech-b04'));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(await response.json()).toEqual({
      reading: expect.objectContaining({
        scan_id: 'ECH-B04',
        material_response: { synaptit: 0.964 },
      }),
    });
  });

  it('rejects unknown scan identifiers', async () => {
    const response = await GET(context('ECH-Z99'));
    expect(response.status).toBe(404);
  });
});
