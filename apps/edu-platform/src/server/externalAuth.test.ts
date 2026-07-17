import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  resolveMembershipMock,
  checkTenXDevs3ToolkitMembershipMock,
  getUserIdByEmailMock,
  getProfileMock,
  hasGrantMock,
  upsertGrantMock,
} = vi.hoisted(
  () => ({
    resolveMembershipMock: vi.fn(),
    checkTenXDevs3ToolkitMembershipMock: vi.fn(),
    getUserIdByEmailMock: vi.fn(),
    getProfileMock: vi.fn().mockResolvedValue(null),
    hasGrantMock: vi.fn(),
    upsertGrantMock: vi.fn(),
  })
);

vi.mock('./circle/membershipResolver', () => ({
  resolveMembership: resolveMembershipMock,
}));

vi.mock('./toolkit/tenXDevs3Membership', () => ({
  checkTenXDevs3ToolkitMembership: checkTenXDevs3ToolkitMembershipMock,
}));

vi.mock('./supabase/userService', () => ({
  getUserIdByEmail: getUserIdByEmailMock,
  getProfile: getProfileMock,
}));

vi.mock('./supabase/accessService', () => ({
  hasGrant: hasGrantMock,
  upsertGrant: upsertGrantMock,
}));

import { SESSION_MAX_AGE_SECONDS, generateToken, getSessionCookieOptions, verifyToken } from './auth';
import { verifyExternalAuth } from './externalAuth';

const courseId = 'opanuj-frontend';
const email = 'member@example.com';
const baseEnv = {
  JWT_SECRET: 'test-secret',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_KEY: 'test-service-key',
  EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS: 1440,
};

function createCookies(token: string, cookieName = 'token') {
  return {
    get(name: string) {
      if (name === cookieName) {
        return { value: token };
      }
      return undefined;
    },
  };
}

function createWritableCookies(token: string, cookieName = 'token') {
  return {
    set: vi.fn(),
    get(name: string) {
      if (name === cookieName) {
        return { value: token };
      }
      return undefined;
    },
  };
}

async function signToken(payload: Record<string, unknown>) {
  const jwt = await import('@tsndr/cloudflare-worker-jwt');
  return jwt.default.sign(payload, baseEnv.JWT_SECRET, { algorithm: 'HS256' });
}

describe('verifyExternalAuth regression matrix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: user not yet in Supabase (sync in flight) → falls through to Circle
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'not_10xdevs_3',
    });
    getUserIdByEmailMock.mockResolvedValue(null);
    getProfileMock.mockResolvedValue(null);
    hasGrantMock.mockResolvedValue(false);
    upsertGrantMock.mockResolvedValue(undefined);
  });

  it('returns unauthenticated when no token cookie is present', async () => {
    const cookies = { get: () => undefined };
    const result = await verifyExternalAuth(cookies, courseId, baseEnv as any);
    expect(result).toEqual({ isAuthenticated: false });
  });

  it('authenticates via Supabase fast path when grant exists', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    getUserIdByEmailMock.mockResolvedValue('user-123');
    hasGrantMock.mockResolvedValue(true);

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result).toEqual({ isAuthenticated: true, email, courseId });
    expect(resolveMembershipMock).not.toHaveBeenCalled();
  });

  it('refreshes near-expiry unified token after successful external auth', async () => {
    const exp = Math.floor(Date.now() / 1000) + 30 * 60;
    const token = await signToken({ email, exp });
    const cookies = createWritableCookies(token);
    getUserIdByEmailMock.mockResolvedValue('user-123');
    hasGrantMock.mockResolvedValue(true);

    const result = await verifyExternalAuth(cookies, courseId, baseEnv as any);

    expect(result).toEqual({ isAuthenticated: true, email, courseId });
    expect(cookies.set).toHaveBeenCalledOnce();
    expect(cookies.set).toHaveBeenCalledWith('token', expect.any(String), getSessionCookieOptions());

    const refreshedToken = cookies.set.mock.calls[0][1];
    const refreshedPayload = await verifyToken(refreshedToken, baseEnv.JWT_SECRET);
    expect(refreshedPayload?.exp).toBeGreaterThanOrEqual(
      Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS - 1
    );
  });

  it('authenticates on fresh active cache decision (Circle fallback)', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'cache' });

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result).toEqual({ isAuthenticated: true, email, courseId });
  });

  it('authenticates on stale active recheck decision (Circle fallback)', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'recheck' });

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result.isAuthenticated).toBe(true);
    expect(result.email).toBe(email);
  });

  it('denies access for fresh revoked cache decision', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    resolveMembershipMock.mockResolvedValue({ status: 'revoked', source: 'recheck' });

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result).toEqual({ isAuthenticated: false });
  });

  it('authenticates when cache miss resolves via Circle', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'circle' });

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result.isAuthenticated).toBe(true);
    expect(resolveMembershipMock).toHaveBeenCalledWith(
      email,
      courseId,
      expect.anything(),
      expect.objectContaining({
        freshnessHours: 1440,
      })
    );
  });

  it('denies access on Circle error decision', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    resolveMembershipMock.mockResolvedValue({
      status: 'error',
      reason: 'circle_api_error',
      source: 'circle',
    });

    const result = await verifyExternalAuth(createCookies(token), courseId, baseEnv as any);

    expect(result).toEqual({ isAuthenticated: false });
  });

  it('authenticates 10xdevs-3 via toolkit KV even when Supabase lacks a grant', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    getUserIdByEmailMock.mockResolvedValue('user-123');
    hasGrantMock.mockResolvedValue(false);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: true,
      allowed: true,
      emailHash: 'email-hash',
      record: {
        memberId: 123,
        source: 'bulk_sync',
        syncedAt: '2026-04-26T10:00:00.000Z',
      },
    });

    const result = await verifyExternalAuth(createCookies(token), '10xdevs-3', baseEnv as any);

    expect(result).toEqual({ isAuthenticated: true, email, courseId: '10xdevs-3' });
    expect(checkTenXDevs3ToolkitMembershipMock).toHaveBeenCalledWith(
      email,
      '10xdevs-3',
      expect.objectContaining({ JWT_SECRET: 'test-secret' })
    );
    // Note: getUserIdByEmail is now also called by the AccountStrip profile lookup
    // (loadProfileFields). The toolkit path still skips grant verification and Circle membership.
    expect(hasGrantMock).not.toHaveBeenCalled();
    expect(resolveMembershipMock).not.toHaveBeenCalled();
  });

  it('denies 10xdevs-3 via toolkit KV even when Supabase would have a stale grant', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    getUserIdByEmailMock.mockResolvedValue('user-123');
    hasGrantMock.mockResolvedValue(true);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: true,
      allowed: false,
      emailHash: 'email-hash',
      reason: 'missing_record',
    });

    const result = await verifyExternalAuth(createCookies(token), '10xdevs-3', baseEnv as any);

    expect(result).toEqual({ isAuthenticated: false });
    expect(getUserIdByEmailMock).not.toHaveBeenCalled();
    expect(hasGrantMock).not.toHaveBeenCalled();
    expect(resolveMembershipMock).not.toHaveBeenCalled();
  });

  it('uses legacy Supabase/Circle path for 10xdevs-3 when toolkit service is in legacy mode', async () => {
    const token = await generateToken(email, baseEnv.JWT_SECRET);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'legacy_mode',
    });
    getUserIdByEmailMock.mockResolvedValue('user-123');
    hasGrantMock.mockResolvedValue(true);

    const result = await verifyExternalAuth(createCookies(token), '10xdevs-3', baseEnv as any);

    expect(result).toEqual({ isAuthenticated: true, email, courseId: '10xdevs-3' });
    expect(getUserIdByEmailMock).toHaveBeenCalledWith(
      email,
      expect.objectContaining({
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_SERVICE_KEY: 'test-service-key',
      })
    );
    expect(hasGrantMock).toHaveBeenCalledWith(
      'user-123',
      '10xdevs-3',
      expect.objectContaining({
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_SERVICE_KEY: 'test-service-key',
      })
    );
    expect(resolveMembershipMock).not.toHaveBeenCalled();
  });

  it('accepts legacy external_token_{courseId} cookie (backward compat)', async () => {
    // Legacy tokens were signed with the same JWT_SECRET and had courseId in payload
    const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const legacyToken = await signToken({ email, courseId, spaceId: 944958, exp });
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'cache' });

    const result = await verifyExternalAuth(
      createCookies(legacyToken, `external_token_${courseId}`),
      courseId,
      baseEnv as any
    );

    expect(result.isAuthenticated).toBe(true);
    expect(result.email).toBe(email);
  });

  it('does not refresh accepted legacy external_token_{courseId} cookies', async () => {
    const exp = Math.floor(Date.now() / 1000) + 30 * 60;
    const legacyToken = await signToken({ email, courseId, spaceId: 944958, exp });
    const cookies = createWritableCookies(legacyToken, `external_token_${courseId}`);
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'cache' });

    const result = await verifyExternalAuth(cookies, courseId, baseEnv as any);

    expect(result.isAuthenticated).toBe(true);
    expect(cookies.set).not.toHaveBeenCalled();
  });

  it('denies legacy external_token_{courseId} cookie when courseId does not match', async () => {
    const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    // Token signed for a different course
    const legacyToken = await signToken({ email, courseId: 'other-course', exp });

    const result = await verifyExternalAuth(
      createCookies(legacyToken, `external_token_${courseId}`),
      courseId,
      baseEnv as any
    );

    expect(result).toEqual({ isAuthenticated: false });
  });
});
