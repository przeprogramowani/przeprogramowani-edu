import type { CircleSpaceMember } from './membershipTypes';
import { getExternalAuthConfig, getV1TokenForPlatform, type ExternalAuthEnv } from './externalAuthConfig';

const CIRCLE_V1_API_URL = 'https://app.circle.so/api/v1';

/**
 * Verifies if a user is a member of a specific Circle space.
 *
 * @param email - User's email address
 * @param communityId - Circle community ID
 * @param spaceId - Circle space ID
 * @param v1Token - Circle API v1 token
 * @returns The space member data if found, null if not a member
 */
export async function verifySpaceMembership(
  email: string,
  communityId: number,
  spaceId: number,
  v1Token: string
): Promise<CircleSpaceMember | null> {
  const url = new URL(`${CIRCLE_V1_API_URL}/space_member`);
  url.searchParams.set('community_id', communityId.toString());
  url.searchParams.set('email', email);
  url.searchParams.set('space_id', spaceId.toString());

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Token ${v1Token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null; // Not a member
  }

  if (!response.ok) {
    throw new Error(`Circle API error: ${response.status}`);
  }

  // Use response.text() for UTF-8 compatibility with Cloudflare Workers
  const text = await response.text();
  return JSON.parse(text) as CircleSpaceMember;
}

/**
 * Checks membership for a specific course.
 *
 * @param email - User's email address
 * @param courseId - Course identifier (e.g., 'opanuj-frontend')
 * @param env - Environment variables containing API tokens
 * @returns Object indicating if user is a member and the member data
 */
export async function checkMembershipForCourse(
  email: string,
  courseId: string,
  env: ExternalAuthEnv
): Promise<{ isMember: boolean; member: CircleSpaceMember | null }> {
  const config = getExternalAuthConfig(courseId);
  if (!config) {
    throw new Error(`Unknown course: ${courseId}`);
  }

  const v1Token = getV1TokenForPlatform(config.platform, env);
  if (!v1Token) {
    throw new Error(`Missing v1 token for platform: ${config.platform}`);
  }

  const member = await verifySpaceMembership(email, config.communityId, config.spaceId, v1Token);

  return {
    isMember: member !== null && member.status === 'active',
    member,
  };
}
