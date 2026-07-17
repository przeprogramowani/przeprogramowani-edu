import {
  OPANUJ_FRONTEND,
  Platform,
  TEN_X_DEVS_FIRST_ED,
  TEN_X_DEVS_SECOND_ED,
  TEN_X_DEVS_THIRD_ED,
} from '@edu/circle';
import type { ExternalAuthConfig } from './membershipTypes';

/**
 * Maps external course IDs to their Circle space configuration.
 *
 * Phase 1: opanuj-frontend using Przeprogramowani v1 token
 * Phase 2: 10xdevs-1, 10xdevs-2 when Brave v1 token is obtained
 */
export const EXTERNAL_AUTH_CONFIG: Record<string, ExternalAuthConfig> = {
  // Phase 1: Przeprogramowani platform (v1 token available)
  'opanuj-frontend': {
    courseId: 'opanuj-frontend',
    displayName: 'Opanuj Frontend',
    platform: OPANUJ_FRONTEND.platform,
    communityId: 109682,
    spaceId: OPANUJ_FRONTEND.space_id,
    sectionIds: OPANUJ_FRONTEND.section_ids,
  },

  // Phase 2: Brave platform (v1 token pending)
  // Uncomment when CIRCLE_BRAVE_V1_TOKEN is available
  '10xdevs-1': {
    courseId: '10xdevs-1',
    displayName: '10xDevs 1.0',
    platform: TEN_X_DEVS_FIRST_ED.platform,
    communityId: 1272,
    spaceId: TEN_X_DEVS_FIRST_ED.space_id,
    sectionIds: TEN_X_DEVS_FIRST_ED.section_ids,
  },
  '10xdevs-2': {
    courseId: '10xdevs-2',
    displayName: '10xDevs 2.0',
    platform: TEN_X_DEVS_SECOND_ED.platform,
    communityId: 1272,
    spaceId: TEN_X_DEVS_SECOND_ED.space_id,
    sectionIds: TEN_X_DEVS_SECOND_ED.section_ids,
    brandColor: '#2663EB',
  },
  '10xdevs-3': {
    courseId: '10xdevs-3',
    displayName: '10xDevs 3.0',
    platform: TEN_X_DEVS_THIRD_ED.platform,
    communityId: 1272,
    spaceId: TEN_X_DEVS_THIRD_ED.space_id,
    sectionIds: TEN_X_DEVS_THIRD_ED.section_ids,
    brandColor: '#652B90',
  },
  '10xdevs-3-prework': {
    courseId: '10xdevs-3-prework',
    displayName: '10xDevs 3.0: Prework',
    platform: TEN_X_DEVS_THIRD_ED.platform,
    communityId: 1272,
    spaceId: TEN_X_DEVS_THIRD_ED.space_id,
    sectionIds: TEN_X_DEVS_THIRD_ED.section_ids,
    brandColor: '#652B90',
  },
};

/**
 * Retrieves external auth configuration for a course
 */
export function getExternalAuthConfig(courseId: string): ExternalAuthConfig | null {
  return EXTERNAL_AUTH_CONFIG[courseId] || null;
}

/**
 * Gets the display name for a course, falling back to courseId if not found
 */
export function getCourseDisplayName(courseId: string): string {
  return EXTERNAL_AUTH_CONFIG[courseId]?.displayName || courseId;
}

/**
 * Returns all configured space IDs for external auth
 */
export function getSpaceIdsForExternalAuth(): number[] {
  return [...new Set(Object.values(EXTERNAL_AUTH_CONFIG).map((c) => c.spaceId))];
}

/**
 * Gets the v1 API token for a platform from environment variables
 */
export function getV1TokenForPlatform(platform: Platform, env: ExternalAuthEnv): string | null {
  switch (platform) {
    case Platform.CIRCLE_PRZEPROGRAMOWANI:
      return env.CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN || null;
    case Platform.CIRCLE_BRAVE:
      return env.CIRCLE_BRAVE_V1_TOKEN || null;
    default:
      return null;
  }
}

/**
 * Environment variables required for external auth
 */
export interface ExternalAuthEnv {
  CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN?: string;
  CIRCLE_BRAVE_V1_TOKEN?: string;
  CIRCLE_MEMBERS?: KVNamespace;
  EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS?: number;
  EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS?: number;
  EXTERNAL_MEMBERSHIP_REFRESH_SECRET?: string;
}
