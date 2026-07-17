import type { APIRoute } from 'astro';
import { SITE_URL, GITHUB_CLIENT_ID } from 'astro:env/server';

/**
 * GitHub OAuth flow - authorization endpoint
 * This endpoint initiates the GitHub OAuth flow by redirecting to GitHub's authorization page
 */
export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Validate required environment variables
  if (!GITHUB_CLIENT_ID) {
    console.error('GitHub OAuth configuration error: Missing GITHUB_CLIENT_ID');
    return redirect('/login?error=OAUTH_CONFIG_ERROR');
  }

  if (!SITE_URL) {
    console.error('GitHub OAuth configuration error: Missing SITE_URL');
    return redirect('/login?error=OAUTH_CONFIG_ERROR');
  }

  // Generate a random state for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie for verification later
  // Valid for 10 minutes
  cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  // Redirect to GitHub auth URL
  const redirectUrl = new URL('https://github.com/login/oauth/authorize');
  redirectUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
  redirectUrl.searchParams.append('redirect_uri', `${SITE_URL}/api/auth/github/callback`);
  redirectUrl.searchParams.append('scope', 'user:email'); // We only need email scope
  redirectUrl.searchParams.append('state', state);

  return redirect(redirectUrl.toString());
};
