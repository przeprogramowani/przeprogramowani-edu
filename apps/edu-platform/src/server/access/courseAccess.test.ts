import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getUserIdByEmailMock,
  getGrantsMock,
  upsertGrantMock,
  getCustomerPurchasesMock,
  checkTenXDevs3ToolkitMembershipMock,
  resolveMembershipMock,
} = vi.hoisted(() => ({
  getUserIdByEmailMock: vi.fn(),
  getGrantsMock: vi.fn(),
  upsertGrantMock: vi.fn(),
  getCustomerPurchasesMock: vi.fn(),
  checkTenXDevs3ToolkitMembershipMock: vi.fn(),
  resolveMembershipMock: vi.fn(),
}));

vi.mock('@/server/supabase/userService', () => ({
  getUserIdByEmail: getUserIdByEmailMock,
}));

vi.mock('@/server/supabase/accessService', () => ({
  getGrants: getGrantsMock,
  upsertGrant: upsertGrantMock,
}));

vi.mock('@/server/airtable/airtable-api', () => ({
  getCustomerPurchases: getCustomerPurchasesMock,
}));

vi.mock('@/server/toolkit/tenXDevs3Membership', async () => {
  const actual = await vi.importActual<
    typeof import('@/server/toolkit/tenXDevs3Membership')
  >('@/server/toolkit/tenXDevs3Membership');
  return {
    ...actual,
    checkTenXDevs3ToolkitMembership: checkTenXDevs3ToolkitMembershipMock,
  };
});

vi.mock('@/server/circle/membershipResolver', () => ({
  resolveMembership: resolveMembershipMock,
}));

import { getAccessibleCourseSlugs, type CourseAccessEnv } from './courseAccess';

const email = 'member@example.com';
const baseEnv: CourseAccessEnv = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_KEY: 'test-service-key',
  AIRTABLE_API_KEY: 'test-airtable-key',
  EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS: 1440,
  ENV: 'PROD',
};

describe('getAccessibleCourseSlugs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUserIdByEmailMock.mockResolvedValue('user-123');
    getGrantsMock.mockResolvedValue([]);
    upsertGrantMock.mockResolvedValue(undefined);
    getCustomerPurchasesMock.mockResolvedValue({ email, purchasedCourses: [] });
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'not_10xdevs_3',
    });
    resolveMembershipMock.mockResolvedValue({ status: 'revoked', source: 'circle' });
  });

  it('returns slugs from grants when prework grant is already present (no extra check fired)', async () => {
    getGrantsMock.mockResolvedValue([
      'opanuj-frontend',
      '10xdevs-3',
      '10xdevs-3-prework',
    ]);

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result.sort()).toEqual(
      ['opanuj-frontend', '10xdevs-3', '10xdevs-3-prework'].sort()
    );
    expect(checkTenXDevs3ToolkitMembershipMock).not.toHaveBeenCalled();
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(upsertGrantMock).not.toHaveBeenCalled();
  });

  it('adds 10xdevs-3 and prework via toolkit KV when allowed; no Circle call; no grant upsert', async () => {
    getGrantsMock.mockResolvedValue(['opanuj-frontend']);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: true,
      allowed: true,
      emailHash: 'email-hash',
      record: { memberId: 1, source: 'bulk_sync', syncedAt: 'now' },
    });

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).toContain('10xdevs-3');
    expect(result).toContain('10xdevs-3-prework');
    expect(result).toContain('opanuj-frontend');
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(upsertGrantMock).not.toHaveBeenCalled();
  });

  it('does not add 10xdevs-3 or prework when toolkit applies but disallows', async () => {
    getGrantsMock.mockResolvedValue(['opanuj-frontend']);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: true,
      allowed: false,
      emailHash: 'email-hash',
      reason: 'missing_record',
    });

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).not.toContain('10xdevs-3');
    expect(result).not.toContain('10xdevs-3-prework');
    expect(resolveMembershipMock).not.toHaveBeenCalled();
    expect(upsertGrantMock).not.toHaveBeenCalled();
  });

  it('falls through to Circle when toolkit does not apply, adds both courses on active and upserts circle grants', async () => {
    getGrantsMock.mockResolvedValue([]);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'legacy_mode',
    });
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'circle' });

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).toContain('10xdevs-3');
    expect(result).toContain('10xdevs-3-prework');
    expect(resolveMembershipMock).toHaveBeenCalledWith(
      email,
      '10xdevs-3',
      baseEnv,
      expect.objectContaining({ freshnessHours: 1440 })
    );
    expect(resolveMembershipMock).toHaveBeenCalledWith(
      email,
      '10xdevs-3-prework',
      baseEnv,
      expect.objectContaining({ freshnessHours: 1440 })
    );
    expect(upsertGrantMock).toHaveBeenCalledTimes(2);
    expect(upsertGrantMock).toHaveBeenCalledWith(
      'user-123',
      '10xdevs-3',
      'circle',
      expect.objectContaining({
        SUPABASE_URL: baseEnv.SUPABASE_URL,
        SUPABASE_SERVICE_KEY: baseEnv.SUPABASE_SERVICE_KEY,
      }),
      expect.objectContaining({ circleSource: 'circle' })
    );
    expect(upsertGrantMock).toHaveBeenCalledWith(
      'user-123',
      '10xdevs-3-prework',
      'circle',
      expect.objectContaining({
        SUPABASE_URL: baseEnv.SUPABASE_URL,
        SUPABASE_SERVICE_KEY: baseEnv.SUPABASE_SERVICE_KEY,
      }),
      expect.objectContaining({ circleSource: 'circle' })
    );
  });

  it('does not add 10xdevs-3 or prework when toolkit does not apply and Circle is inactive', async () => {
    getGrantsMock.mockResolvedValue([]);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'legacy_mode',
    });
    resolveMembershipMock.mockResolvedValue({ status: 'revoked', source: 'circle' });

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).not.toContain('10xdevs-3');
    expect(result).not.toContain('10xdevs-3-prework');
    expect(upsertGrantMock).not.toHaveBeenCalled();
  });

  it('falls back to Airtable when Supabase profile is missing and reverse-expands AirtableCourse to all matching slugs', async () => {
    getUserIdByEmailMock.mockResolvedValue(null);
    getCustomerPurchasesMock.mockResolvedValue({
      email,
      purchasedCourses: ['OPANUJ_FRONTEND'],
    });

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).toContain('opanuj-frontend');
    expect(result).toContain('opanuj-frontend-live');
    expect(getGrantsMock).not.toHaveBeenCalled();
  });

  it('still resolves with both slugs when upsertGrant throws (fire-and-forget)', async () => {
    getGrantsMock.mockResolvedValue([]);
    checkTenXDevs3ToolkitMembershipMock.mockResolvedValue({
      applies: false,
      reason: 'legacy_mode',
    });
    resolveMembershipMock.mockResolvedValue({ status: 'active', source: 'circle' });
    upsertGrantMock.mockRejectedValue(new Error('boom'));

    const result = await getAccessibleCourseSlugs(email, baseEnv);

    expect(result).toContain('10xdevs-3');
    expect(result).toContain('10xdevs-3-prework');
  });
});
