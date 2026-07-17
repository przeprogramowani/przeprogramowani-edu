import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  resolveMembershipMock,
  checkTenXDevs3ToolkitMembershipMock,
  storeMagicLinkMock,
  sendMagicLinkEmailMock,
  generateTokenMock,
} = vi.hoisted(() => ({
  resolveMembershipMock: vi.fn(),
  checkTenXDevs3ToolkitMembershipMock: vi.fn(),
  storeMagicLinkMock: vi.fn(),
  sendMagicLinkEmailMock: vi.fn(),
  generateTokenMock: vi.fn(),
}));

vi.mock('@/server/circle/membershipResolver', () => ({
  resolveMembership: resolveMembershipMock,
}));

vi.mock('@/server/toolkit/tenXDevs3Membership', () => ({
  checkTenXDevs3ToolkitMembership: checkTenXDevs3ToolkitMembershipMock,
}));

vi.mock('@/server/magicLinkManager', () => ({
  storeMagicLink: storeMagicLinkMock,
}));

vi.mock('@/server/email', () => ({
  sendMagicLinkEmail: sendMagicLinkEmailMock,
}));

vi.mock('@/server/auth', () => ({
  generateToken: generateTokenMock,
}));

import { POST } from '@/pages/api/external/auth';

function createContext(body: Record<string, unknown>) {
  const env = {
    JWT_SECRET: 'test-secret',
    SITE_URL: 'https://example.com',
    ENV: 'DEV',
    TEST_MODE: 'true',
    RESEND_API_KEY: 'resend-key',
    MAILING_SERVICE_URL: 'https://mailing.example.com',
    EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS: 1440,
  };

  const request = new Request('https://example.com/api/external/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return {
    request,
    locals: {
      runtime: {
        env,
      },
    },
  } as any;
}

describe('POST /api/external/auth regression matrix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'not_10xdevs_3',
    });
    sendMagicLinkEmailMock.mockResolvedValue({ success: true });
    generateTokenMock.mockResolvedValue('magic-token');
    storeMagicLinkMock.mockResolvedValue(undefined);
  });

  it('succeeds for fresh active cache decision', async () => {
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'cache' });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: 'opanuj-frontend',
        returnUrl: '/external/opanuj-frontend',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it('succeeds for stale active recheck decision', async () => {
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'recheck' });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: 'opanuj-frontend',
        returnUrl: '/external/opanuj-frontend',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it('succeeds for cache miss resolved by Circle decision', async () => {
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'circle' });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: 'opanuj-frontend',
        returnUrl: '/external/opanuj-frontend',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it('returns 403 for revoked cache decision', async () => {
    resolveMembershipMock.mockResolvedValue({ status: 'revoked', source: 'recheck' });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: 'opanuj-frontend',
        returnUrl: '/external/opanuj-frontend',
      })
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      success: false,
      errorCode: 'NOT_MEMBER',
      error: 'Nie jesteś członkiem tej społeczności w Circle. Sprawdź, czy używasz właściwego adresu email.',
    });
  });

  it('returns 500 for Circle error decision', async () => {
    resolveMembershipMock.mockResolvedValue({
      status: 'error',
      reason: 'circle_api_error',
      source: 'circle',
    });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: 'opanuj-frontend',
        returnUrl: '/external/opanuj-frontend',
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      errorCode: 'AUTH_ERROR',
      error: 'Wystąpił błąd podczas weryfikacji.',
    });
  });

  it('succeeds for 10xdevs-3 when toolkit KV allows and skips Circle membership', async () => {
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

    const response = await POST(
      createContext({
        email: 'Member@Example.com',
        courseId: '10xdevs-3',
        returnUrl: '/external/10xdevs-3',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(checkTenXDevs3ToolkitMembershipMock).toHaveBeenCalledWith(
      'member@example.com',
      '10xdevs-3',
      expect.objectContaining({ ENV: 'DEV' })
    );
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(generateTokenMock).toHaveBeenCalledWith('member@example.com', 'test-secret');
    expect(storeMagicLinkMock).toHaveBeenCalledWith(
      'magic-token',
      'member@example.com',
      expect.objectContaining({ ENV: 'DEV' }),
      90
    );
    expect(sendMagicLinkEmailMock).toHaveBeenCalled();
  });

  it('returns 403 for 10xdevs-3 when toolkit KV denies before token and email side effects', async () => {
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: true,
      allowed: false,
      emailHash: 'email-hash',
      reason: 'missing_record',
    });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: '10xdevs-3',
        returnUrl: '/external/10xdevs-3',
      })
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      success: false,
      errorCode: 'NO_ACCESS',
      error: 'Nie masz aktywnego dostępu do 10xDevs 3.0 dla tego adresu email. Sprawdź, czy używasz właściwego adresu.',
    });
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(generateTokenMock).not.toHaveBeenCalled();
    expect(storeMagicLinkMock).not.toHaveBeenCalled();
    expect(sendMagicLinkEmailMock).not.toHaveBeenCalled();
  });

  it('uses legacy Circle membership path when toolkit service returns dev fallback', async () => {
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'dev_missing_binding_fallback',
    });
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'circle' });

    const response = await POST(
      createContext({
        email: 'member@example.com',
        courseId: '10xdevs-3',
        returnUrl: '/external/10xdevs-3',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(resolveMembershipMock).toHaveBeenCalledWith(
      'member@example.com',
      '10xdevs-3',
      expect.objectContaining({ ENV: 'DEV' }),
      expect.objectContaining({ freshnessHours: 1440 })
    );
    expect(generateTokenMock).toHaveBeenCalledWith('member@example.com', 'test-secret');
    expect(sendMagicLinkEmailMock).toHaveBeenCalled();
  });

  it('allows configured local emails into 10xdevs-3-prework in test mode and sends the magic link to the dev inbox', async () => {
    const response = await POST(
      createContext({
        email: 'Marcin@Przeprogramowani.pl',
        courseId: '10xdevs-3-prework',
        returnUrl: '/external/10xdevs-3-prework/pl',
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(checkTenXDevs3ToolkitMembershipMock).not.toHaveBeenCalled();
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(generateTokenMock).toHaveBeenCalledWith('marcin@przeprogramowani.pl', 'test-secret');
    expect(storeMagicLinkMock).toHaveBeenCalledWith(
      'magic-token',
      'marcin@przeprogramowani.pl',
      expect.objectContaining({ ENV: 'DEV', TEST_MODE: 'true' }),
      90
    );
    expect(sendMagicLinkEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'przeprogramowani@gmail.com',
        magicLink: 'https://example.com/external/10xdevs-3-prework/verify?token=magic-token&returnUrl=%2Fexternal%2F10xdevs-3-prework%2Fpl',
      })
    );
  });
});
