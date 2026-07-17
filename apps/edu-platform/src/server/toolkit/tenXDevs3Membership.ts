import { upsertGrant } from '@/server/supabase/accessService';

export const TEN_X_DEVS_3_COURSE_ID = '10xdevs-3';
export const TEN_X_DEVS_3_PREWORK_COURSE_ID = '10xdevs-3-prework';
export const TOOLKIT_KV_MODE = 'toolkit_kv';
export const LEGACY_MODE = 'legacy';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

// Temporary pre-broker bridge for 10xDevs 3 external auth.
// Plan: thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md
type ToolkitAuthMode = typeof TOOLKIT_KV_MODE | typeof LEGACY_MODE;
type ResolvedToolkitAuthMode = ToolkitAuthMode | 'invalid';
type ToolkitMembershipSource = 'bulk_sync' | 'webhook' | 'seed' | 'email_migration';

export type ToolkitDeactivatedReason = 'circle_email_changed';
export type ToolkitManualOverrideReason = 'circle_email_changed';

const DEACTIVATED_REASONS: ReadonlySet<ToolkitDeactivatedReason> = new Set(['circle_email_changed']);
const MANUAL_OVERRIDE_REASONS: ReadonlySet<ToolkitManualOverrideReason> = new Set([
  'circle_email_changed',
]);

interface ToolkitMembershipRecord {
  memberId: number;
  email: string;
  hasAccess: boolean;
  syncedAt: string;
  source: ToolkitMembershipSource;
  // Manual override metadata. Written by ops when the upstream toolkit sync
  // can't reconcile a case (e.g. Circle email change). The reader gates only
  // on `hasAccess`; these fields exist for audit/support traceability.
  deactivatedAt?: string;
  deactivatedReason?: ToolkitDeactivatedReason;
  supersededBy?: string;
  manualOverrideReason?: ToolkitManualOverrideReason;
}

export interface TenXDevs3ToolkitEnv {
  ENV?: string;
  TOOLKIT_10X3_MEMBERSHIP_KV?: Pick<KVNamespace, 'get'>;
  TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE?: string;
  // Temporary: when "true", a `missing_record` KV result falls back to the
  // legacy Circle membership check instead of denying access. Mitigates the
  // case where a Circle email change leaves the KV with only the old hash.
  // Remove once the toolkit reacts to email changes promptly. See
  // thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md.
  TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING?: string;
}

export type TenXDevs3ToolkitMembershipDecision =
  | {
      applies: false;
      reason:
        | 'not_10xdevs_3'
        | 'legacy_mode'
        | 'dev_missing_binding_fallback'
        | 'legacy_fallback_missing_record';
    }
  | {
      applies: true;
      allowed: true;
      emailHash: string;
      record: { memberId: number; source: string; syncedAt: string };
    }
  | {
      applies: true;
      allowed: false;
      emailHash?: string;
      reason: 'missing_binding' | 'missing_record' | 'malformed_record' | 'inactive_record' | 'invalid_mode';
    };

export async function hashEmail(email: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getToolkitMemberKey(emailHash: string): string {
  return `member:${emailHash}`;
}

export function resolveTenXDevs3AuthMode(env: TenXDevs3ToolkitEnv): ResolvedToolkitAuthMode {
  const configuredMode = env.TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE?.trim();

  if (!configuredMode) {
    return env.ENV === 'PROD' ? TOOLKIT_KV_MODE : LEGACY_MODE;
  }

  if (configuredMode === TOOLKIT_KV_MODE || configuredMode === LEGACY_MODE) {
    return configuredMode;
  }

  return 'invalid';
}

export async function checkTenXDevs3ToolkitMembership(
  email: string,
  courseId: string,
  env: TenXDevs3ToolkitEnv
): Promise<TenXDevs3ToolkitMembershipDecision> {
  if (courseId !== TEN_X_DEVS_3_COURSE_ID && courseId !== TEN_X_DEVS_3_PREWORK_COURSE_ID) {
    return { applies: false, reason: 'not_10xdevs_3' };
  }

  const mode = resolveTenXDevs3AuthMode(env);

  if (mode === LEGACY_MODE) {
    console.log(
      JSON.stringify({
        event: 'tenx3_toolkit_access.legacy_fallback',
        courseId,
        mode,
      })
    );
    return { applies: false, reason: 'legacy_mode' };
  }

  if (mode === 'invalid') {
    return logAndReturn(courseId, mode, {
      applies: true,
      allowed: false,
      reason: 'invalid_mode',
    });
  }

  const kv = env.TOOLKIT_10X3_MEMBERSHIP_KV;
  if (!kv) {
    if (env.ENV === 'PROD') {
      console.error(
        JSON.stringify({
          event: 'tenx3_toolkit_access.misconfigured',
          courseId,
          mode,
          reason: 'missing_binding',
        })
      );
      return { applies: true, allowed: false, reason: 'missing_binding' };
    }

    console.log(
      JSON.stringify({
        event: 'tenx3_toolkit_access.legacy_fallback',
        courseId,
        mode,
        reason: 'dev_missing_binding_fallback',
      })
    );
    return { applies: false, reason: 'dev_missing_binding_fallback' };
  }

  const emailHash = await hashEmail(email);
  const rawRecord = await kv.get(getToolkitMemberKey(emailHash));

  if (!rawRecord) {
    if (env.TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING === 'true') {
      console.log(
        JSON.stringify({
          event: 'tenx3_toolkit_access.legacy_fallback_missing_record',
          courseId,
          mode,
          emailHash,
        })
      );
      return { applies: false, reason: 'legacy_fallback_missing_record' };
    }

    return logAndReturn(courseId, mode, {
      applies: true,
      allowed: false,
      emailHash,
      reason: 'missing_record',
    });
  }

  const record = parseToolkitMembershipRecord(rawRecord);
  if (!record) {
    return logAndReturn(courseId, mode, {
      applies: true,
      allowed: false,
      emailHash,
      reason: 'malformed_record',
    });
  }

  if (record.hasAccess !== true) {
    return logAndReturn(courseId, mode, {
      applies: true,
      allowed: false,
      emailHash,
      reason: 'inactive_record',
    });
  }

  return logAndReturn(courseId, mode, {
    applies: true,
    allowed: true,
    emailHash,
    record: {
      memberId: record.memberId,
      source: record.source,
      syncedAt: record.syncedAt,
    },
  });
}

/**
 * Persist an `access_grants` row when the toolkit KV decision authorises the user.
 * Shared between `/external/[courseId]/verify.astro` and `/10xdevs-3/mission-log.astro`
 * so the toolkit grant metadata shape stays in one place.
 *
 * Returns true when a grant was written, false otherwise (decision didn't apply or denied).
 */
export async function syncTenXDevs3ToolkitGrant(
  userId: string,
  courseId: string,
  decision: TenXDevs3ToolkitMembershipDecision,
  env: SupabaseEnv
): Promise<boolean> {
  if (!decision.applies || !decision.allowed) return false;

  await upsertGrant(userId, courseId, 'circle', env, {
    toolkit10x3Membership: true,
    toolkitSource: decision.record.source,
    toolkitSyncedAt: decision.record.syncedAt,
    toolkitMemberId: decision.record.memberId,
  });
  return true;
}

function parseToolkitMembershipRecord(rawRecord: string): ToolkitMembershipRecord | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawRecord);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;

  const source = parsed.source;
  if (
    source !== 'bulk_sync' &&
    source !== 'webhook' &&
    source !== 'seed' &&
    source !== 'email_migration'
  ) {
    return null;
  }

  if (
    typeof parsed.memberId !== 'number' ||
    typeof parsed.email !== 'string' ||
    typeof parsed.hasAccess !== 'boolean' ||
    typeof parsed.syncedAt !== 'string'
  ) {
    return null;
  }

  const deactivatedAt = typeof parsed.deactivatedAt === 'string' ? parsed.deactivatedAt : undefined;
  const supersededBy = typeof parsed.supersededBy === 'string' ? parsed.supersededBy : undefined;
  const deactivatedReason = isDeactivatedReason(parsed.deactivatedReason)
    ? parsed.deactivatedReason
    : undefined;
  const manualOverrideReason = isManualOverrideReason(parsed.manualOverrideReason)
    ? parsed.manualOverrideReason
    : undefined;

  return {
    memberId: parsed.memberId,
    email: parsed.email,
    hasAccess: parsed.hasAccess,
    syncedAt: parsed.syncedAt,
    source,
    ...(deactivatedAt !== undefined && { deactivatedAt }),
    ...(deactivatedReason !== undefined && { deactivatedReason }),
    ...(supersededBy !== undefined && { supersededBy }),
    ...(manualOverrideReason !== undefined && { manualOverrideReason }),
  };
}

function isDeactivatedReason(value: unknown): value is ToolkitDeactivatedReason {
  return (
    typeof value === 'string' && DEACTIVATED_REASONS.has(value as ToolkitDeactivatedReason)
  );
}

function isManualOverrideReason(value: unknown): value is ToolkitManualOverrideReason {
  return (
    typeof value === 'string' &&
    MANUAL_OVERRIDE_REASONS.has(value as ToolkitManualOverrideReason)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function logAndReturn<T extends Extract<TenXDevs3ToolkitMembershipDecision, { applies: true }>>(
  courseId: string,
  mode: ResolvedToolkitAuthMode,
  decision: T
): T {
  console.log(
    JSON.stringify({
      event: 'tenx3_toolkit_access.check',
      courseId,
      mode,
      allowed: decision.allowed,
      emailHash: decision.emailHash,
      reason: decision.allowed ? undefined : decision.reason,
      recordSource: decision.allowed ? decision.record.source : undefined,
    })
  );

  return decision;
}
