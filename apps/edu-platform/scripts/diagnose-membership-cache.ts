import { getExternalAuthConfig } from '../src/server/circle/externalAuthConfig';
import {
  DEFAULT_MEMBERSHIP_FRESHNESS_HOURS,
  getCacheKey,
  isMembershipCacheStale,
} from '../src/server/circle/membershipCache';
import type { CachedMembership } from '../src/server/circle/membershipTypes';

interface Args {
  courseId: string;
  email: string;
  key: string;
  value: string;
  freshnessHours?: number;
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      continue;
    }

    if (flag === '--course') args.courseId = value;
    if (flag === '--email') args.email = value;
    if (flag === '--key') args.key = value;
    if (flag === '--value') args.value = value;
    if (flag === '--freshness-hours') args.freshnessHours = Number(value);
  }

  if (!args.courseId || !args.email || !args.key || !args.value) {
    throw new Error(
      'Usage: tsx scripts/diagnose-membership-cache.ts --course <courseId> --email <email> --key <kvKey> --value <kvJson> [--freshness-hours <hours>]'
    );
  }

  return args as Args;
}

function parseMembership(value: string): CachedMembership {
  const parsed = JSON.parse(value) as CachedMembership;
  if (typeof parsed.verifiedAt !== 'number') {
    throw new Error('Invalid payload: verifiedAt must be a number in milliseconds.');
  }
  return parsed;
}

function inferDecision(cached: CachedMembership, stale: boolean): string {
  if (cached.status === 'active' && !stale) {
    return 'active (source=cache)';
  }
  if (cached.status === 'active' && stale) {
    return 'requires Circle re-check (stale active)';
  }
  if (cached.status === 'revoked') {
    return 'requires Circle re-check (cached revoked)';
  }
  return `unexpected cached status: ${cached.status}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = getExternalAuthConfig(args.courseId);

  if (!config) {
    throw new Error(`Unknown courseId: ${args.courseId}`);
  }

  const expectedKey = getCacheKey(config.platform, config.spaceId, args.email);
  const cached = parseMembership(args.value);
  const freshnessHours = args.freshnessHours ?? DEFAULT_MEMBERSHIP_FRESHNESS_HOURS;
  const stale = isMembershipCacheStale(cached, freshnessHours);

  console.log('courseId:', args.courseId);
  console.log('email:', args.email.toLowerCase().trim());
  console.log('expectedKey:', expectedKey);
  console.log('providedKey:', args.key);
  console.log('keyMatchesExpected:', expectedKey === args.key);
  console.log('cachedStatus:', cached.status);
  console.log('cachedSpaceId:', cached.spaceId);
  console.log('verifiedAtMs:', cached.verifiedAt);
  console.log('verifiedAtISO:', new Date(cached.verifiedAt).toISOString());
  console.log('freshnessHours:', freshnessHours);
  console.log('isStale:', stale);
  console.log('decisionIfCacheIsRead:', inferDecision(cached, stale));
}

main();
