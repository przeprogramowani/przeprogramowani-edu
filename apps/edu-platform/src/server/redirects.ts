/**
 * Redirect target resolution for post-auth flows.
 * Prevents open redirects by mapping known keys to internal paths.
 */

const VALID_REDIRECTS: Record<string, string> = {
  explorers: '/explorers',
  courses: '/courses',
};

const DEFAULT_REDIRECT = '/courses';

/**
 * Resolves a redirect key to a valid internal path.
 * Returns DEFAULT_REDIRECT for unknown/missing keys.
 */
export function resolveRedirect(key: string | null | undefined): string {
  if (!key) return DEFAULT_REDIRECT;
  return VALID_REDIRECTS[key] || DEFAULT_REDIRECT;
}

export { DEFAULT_REDIRECT };
