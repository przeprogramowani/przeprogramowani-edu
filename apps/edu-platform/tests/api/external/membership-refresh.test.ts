import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  checkMembershipForCourseMock,
  setCachedMembershipMock,
} = vi.hoisted(() => ({
  checkMembershipForCourseMock: vi.fn(),
  setCachedMembershipMock: vi.fn(),
}));

vi.mock('@/server/circle/membershipApi', () => ({
  checkMembershipForCourse: checkMembershipForCourseMock,
}));

vi.mock('@/server/circle/membershipCache', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/server/circle/membershipCache')>();
  return {
    ...actual,
    setCachedMembership: setCachedMembershipMock,
  };
});

import { POST } from '@/pages/api/external/membership-refresh';

function createContext(request: Request, env: Record<string, unknown>) {
  return {
    request,
    locals: {
      runtime: {
        env,
      },
    },
  } as any;
}

describe('POST /api/external/membership-refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthorized requests', async () => {
    const listMock = vi.fn();
    const env = {
      EXTERNAL_MEMBERSHIP_REFRESH_SECRET: 'secret',
      CIRCLE_MEMBERS: {
        list: listMock,
      },
    };

    const request = new Request('https://example.com/api/external/membership-refresh', {
      method: 'POST',
    });
    const response = await POST(createContext(request, env));

    expect(response.status).toBe(401);
    expect(listMock).not.toHaveBeenCalled();
  });

  it('refreshes active and revoked keys from paginated KV list', async () => {
    const listMock = vi
      .fn()
      .mockResolvedValueOnce({
        keys: [
          { name: 'v1-membership-circle-przeprogramowani-944958-active@example.com' },
          { name: 'v1-membership-circle-brave-1905722-revoked@example.com' },
        ],
        list_complete: false,
        cursor: 'next-cursor',
      })
      .mockResolvedValueOnce({
        keys: [],
        list_complete: true,
      });

    checkMembershipForCourseMock.mockImplementation(async (email: string) => {
      if (email === 'active@example.com') {
        return {
          isMember: true,
          member: {
            id: 11,
            space_id: 944958,
          },
        };
      }

      return {
        isMember: false,
        member: null,
      };
    });

    const env = {
      EXTERNAL_MEMBERSHIP_REFRESH_SECRET: 'secret',
      CIRCLE_MEMBERS: {
        list: listMock,
      },
    };

    const request = new Request('https://example.com/api/external/membership-refresh', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer secret',
      },
    });

    const response = await POST(createContext(request, env));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      checked: 2,
      updated_active: 1,
      updated_revoked: 1,
      errors: 0,
    });
    expect(checkMembershipForCourseMock).toHaveBeenCalledWith(
      'active@example.com',
      'opanuj-frontend',
      env
    );
    expect(checkMembershipForCourseMock).toHaveBeenCalledWith('revoked@example.com', '10xdevs-1', env);
    expect(setCachedMembershipMock).toHaveBeenCalledTimes(2);
    expect(listMock).toHaveBeenCalledTimes(2);
  });

  it('keeps cache unchanged when Circle check fails for a key', async () => {
    const listMock = vi.fn().mockResolvedValue({
      keys: [{ name: 'v1-membership-circle-przeprogramowani-944958-error@example.com' }],
      list_complete: true,
    });

    checkMembershipForCourseMock.mockRejectedValue(new Error('Circle API error: 503'));

    const env = {
      EXTERNAL_MEMBERSHIP_REFRESH_SECRET: 'secret',
      CIRCLE_MEMBERS: {
        list: listMock,
      },
    };

    const request = new Request('https://example.com/api/external/membership-refresh', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer secret',
      },
    });

    const response = await POST(createContext(request, env));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      checked: 1,
      updated_active: 0,
      updated_revoked: 0,
      errors: 1,
    });
    expect(setCachedMembershipMock).not.toHaveBeenCalled();
  });
});
