import { describe, expect, it, vi } from 'vitest';
import {
  LEGACY_MODE,
  TEN_X_DEVS_3_COURSE_ID,
  TEN_X_DEVS_3_PREWORK_COURSE_ID,
  TOOLKIT_KV_MODE,
  checkTenXDevs3ToolkitMembership,
  getToolkitMemberKey,
  hashEmail,
} from './tenXDevs3Membership';

function createKv(records: Record<string, string> = {}): Pick<KVNamespace, 'get'> {
  return {
    get: vi.fn(async (key: string) => records[key] ?? null),
  };
}

function createRecord(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    memberId: 123,
    email: 'member@example.com',
    hasAccess: true,
    syncedAt: '2026-04-26T10:00:00.000Z',
    source: 'bulk_sync',
    ...overrides,
  });
}

describe('10xDevs 3 toolkit membership bridge', () => {
  it('hashes normalized email using toolkit-compatible SHA-256', async () => {
    await expect(hashEmail('  MEMBER@example.com  ')).resolves.toBe(
      'b6e346dee08f8e8cf029179eb5177b5c2fc1a6e8ba01ab8ff4e1b8d56e89298c'
    );
  });

  it('constructs toolkit member KV keys', () => {
    expect(getToolkitMemberKey('abc123')).toBe('member:abc123');
  });

  it('allows an active toolkit record', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({ [getToolkitMemberKey(emailHash)]: createRecord() });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: true,
      emailHash,
      record: {
        memberId: 123,
        source: 'bulk_sync',
        syncedAt: '2026-04-26T10:00:00.000Z',
      },
    });
  });

  it('allows an active record with email_migration source', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({
      [getToolkitMemberKey(emailHash)]: createRecord({ source: 'email_migration' }),
    });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: true,
      emailHash,
      record: {
        memberId: 123,
        source: 'email_migration',
        syncedAt: '2026-04-26T10:00:00.000Z',
      },
    });
  });

  it('applies the same toolkit access bridge to 10xDevs 3 prework', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({ [getToolkitMemberKey(emailHash)]: createRecord() });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_PREWORK_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toMatchObject({
      applies: true,
      allowed: true,
      emailHash,
    });
  });

  it('denies missing records', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: createKv(),
    });

    expect(decision).toMatchObject({
      applies: true,
      allowed: false,
      reason: 'missing_record',
    });
  });

  it('falls back to legacy when missing record and fallback flag is enabled', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: createKv(),
      TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING: 'true',
    });

    expect(decision).toEqual({
      applies: false,
      reason: 'legacy_fallback_missing_record',
    });
  });

  it('does not fall back on inactive records even when the flag is enabled', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({ [getToolkitMemberKey(emailHash)]: createRecord({ hasAccess: false }) });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
      TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING: 'true',
    });

    expect(decision).toMatchObject({
      applies: true,
      allowed: false,
      reason: 'inactive_record',
    });
  });

  it('denies malformed records', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({ [getToolkitMemberKey(emailHash)]: '{"memberId":"bad"}' });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: false,
      emailHash,
      reason: 'malformed_record',
    });
  });

  it('denies inactive records', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({ [getToolkitMemberKey(emailHash)]: createRecord({ hasAccess: false }) });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: false,
      emailHash,
      reason: 'inactive_record',
    });
  });

  it('treats records carrying manual override metadata as inactive', async () => {
    const emailHash = await hashEmail('old@example.com');
    const kv = createKv({
      [getToolkitMemberKey(emailHash)]: createRecord({
        email: 'old@example.com',
        hasAccess: false,
        deactivatedAt: '2026-04-29T11:30:00.000Z',
        deactivatedReason: 'circle_email_changed',
        supersededBy: 'new@example.com',
      }),
    });

    const decision = await checkTenXDevs3ToolkitMembership('old@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: false,
      emailHash,
      reason: 'inactive_record',
    });
  });

  it('ignores override fields with unknown enum values without rejecting the record', async () => {
    const emailHash = await hashEmail('member@example.com');
    const kv = createKv({
      [getToolkitMemberKey(emailHash)]: createRecord({
        deactivatedReason: 'something_unrecognized',
        manualOverrideReason: 'also_unrecognized',
      }),
    });

    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
      TOOLKIT_10X3_MEMBERSHIP_KV: kv,
    });

    expect(decision).toMatchObject({ applies: true, allowed: true });
  });

  it('denies production missing binding', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
    });

    expect(decision).toEqual({
      applies: true,
      allowed: false,
      reason: 'missing_binding',
    });
  });

  it('falls back outside production when toolkit mode is configured without a binding', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'DEV',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
    });

    expect(decision).toEqual({
      applies: false,
      reason: 'dev_missing_binding_fallback',
    });
  });

  it('does not apply in explicit legacy mode', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', TEN_X_DEVS_3_COURSE_ID, {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: LEGACY_MODE,
    });

    expect(decision).toEqual({
      applies: false,
      reason: 'legacy_mode',
    });
  });

  it('does not apply to other courses', async () => {
    const decision = await checkTenXDevs3ToolkitMembership('member@example.com', '10xdevs-2', {
      ENV: 'PROD',
      TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: TOOLKIT_KV_MODE,
    });

    expect(decision).toEqual({
      applies: false,
      reason: 'not_10xdevs_3',
    });
  });
});
