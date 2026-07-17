import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getCachedMembershipMock,
  setCachedMembershipMock,
  isMembershipCacheStaleMock,
  checkMembershipForCourseMock,
} = vi.hoisted(() => ({
  getCachedMembershipMock: vi.fn(),
  setCachedMembershipMock: vi.fn(),
  isMembershipCacheStaleMock: vi.fn(),
  checkMembershipForCourseMock: vi.fn(),
}));

vi.mock('./membershipCache', () => ({
  getCachedMembership: getCachedMembershipMock,
  setCachedMembership: setCachedMembershipMock,
  isMembershipCacheStale: isMembershipCacheStaleMock,
  DEFAULT_MEMBERSHIP_FRESHNESS_HOURS: 24 * 60,
}));

vi.mock('./membershipApi', () => ({
  checkMembershipForCourse: checkMembershipForCourseMock,
}));

import { resolveMembership } from './membershipResolver';

describe('resolveMembership', () => {
  const env = {
    CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN: 'token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns active cache decision for fresh active cache', async () => {
    getCachedMembershipMock.mockResolvedValue({
      email: 'user@example.com',
      spaceId: 944958,
      status: 'active',
      verifiedAt: Date.now(),
      memberId: 123,
    });
    isMembershipCacheStaleMock.mockReturnValue(false);

    const result = await resolveMembership('User@Example.com', 'opanuj-frontend', env, {
      freshnessHours: 1440,
    });

    expect(result).toEqual({ status: 'active', source: 'cache' });
    expect(checkMembershipForCourseMock).not.toHaveBeenCalled();
  });

  it('rechecks stale active cache and refreshes as active', async () => {
    getCachedMembershipMock.mockResolvedValue({
      email: 'user@example.com',
      spaceId: 944958,
      status: 'active',
      verifiedAt: Date.now() - 70 * 24 * 60 * 60 * 1000,
      memberId: 123,
    });
    isMembershipCacheStaleMock.mockReturnValue(true);
    checkMembershipForCourseMock.mockResolvedValue({
      isMember: true,
      member: {
        id: 321,
        space_id: 944958,
      },
    });

    const result = await resolveMembership('user@example.com', 'opanuj-frontend', env, {
      freshnessHours: 1440,
    });

    expect(result).toEqual({ status: 'active', source: 'recheck' });
    expect(checkMembershipForCourseMock).toHaveBeenCalledWith('user@example.com', 'opanuj-frontend', env);
    expect(setCachedMembershipMock).toHaveBeenCalledWith(
      'user@example.com',
      'opanuj-frontend',
      expect.objectContaining({
        email: 'user@example.com',
        status: 'active',
        memberId: 321,
      }),
      env
    );
  });

  it('rechecks revoked cache and keeps it revoked', async () => {
    getCachedMembershipMock.mockResolvedValue({
      email: 'user@example.com',
      spaceId: 944958,
      status: 'revoked',
      verifiedAt: Date.now(),
      memberId: null,
    });
    checkMembershipForCourseMock.mockResolvedValue({
      isMember: false,
      member: null,
    });

    const result = await resolveMembership('user@example.com', 'opanuj-frontend', env, {
      freshnessHours: 1440,
    });

    expect(result).toEqual({ status: 'revoked', source: 'recheck' });
    expect(setCachedMembershipMock).toHaveBeenCalledWith(
      'user@example.com',
      'opanuj-frontend',
      expect.objectContaining({
        email: 'user@example.com',
        status: 'revoked',
        spaceId: 944958,
      }),
      env
    );
  });

  it('checks Circle when cache is missing', async () => {
    getCachedMembershipMock.mockResolvedValue(null);
    checkMembershipForCourseMock.mockResolvedValue({
      isMember: true,
      member: {
        id: 999,
        space_id: 944958,
      },
    });

    const result = await resolveMembership('new@example.com', 'opanuj-frontend', env, {
      freshnessHours: 1440,
    });

    expect(result).toEqual({ status: 'active', source: 'circle' });
    expect(checkMembershipForCourseMock).toHaveBeenCalledWith('new@example.com', 'opanuj-frontend', env);
  });

  it('returns an error decision when Circle check fails', async () => {
    getCachedMembershipMock.mockResolvedValue(null);
    checkMembershipForCourseMock.mockRejectedValue(new Error('Circle API error: 500'));

    const result = await resolveMembership('user@example.com', 'opanuj-frontend', env, {
      freshnessHours: 1440,
    });

    expect(result).toEqual({
      status: 'error',
      reason: 'circle_api_error',
      source: 'circle',
    });
  });
});
