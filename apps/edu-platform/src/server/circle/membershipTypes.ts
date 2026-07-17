import type { Platform } from '@edu/circle';

/**
 * Response from Circle API v1 space_member endpoint
 */
export interface CircleSpaceMember {
  id: number;
  space_id: number;
  user_id: number;
  status: 'active' | 'inactive' | 'pending';
  access_type: 'invite' | 'request' | 'public';
}

/**
 * Cached membership data stored in KV
 */
export interface CachedMembership {
  email: string;
  spaceId: number;
  status: 'active' | 'revoked' | 'unknown';
  verifiedAt: number;
  memberId: number | null;
}

/**
 * Configuration for external auth per course
 */
export interface ExternalAuthConfig {
  courseId: string;
  displayName: string;
  platform: Platform;
  communityId: number;
  spaceId: number;
  sectionIds: number[];
  brandColor?: string; // Hex color for email templates (e.g., '#2663EB')
}
