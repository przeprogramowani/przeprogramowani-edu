import type { APIRoute } from 'astro';
import { SITE_URL, GOOGLE_CLIENT_ID } from 'astro:env/server';

/**
 * Google OAuth flow - authorization endpoint
 * This endpoint initiates the Google OAuth flow by redirecting to Google's authorization page
 */
export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Generate a random state for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie for verification later
  cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // Valid for 10 minutes
  });

  // Redirect to Google auth URL
  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  redirectUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
  redirectUrl.searchParams.append('redirect_uri', `${SITE_URL}/api/auth/google/callback`);
  redirectUrl.searchParams.append('response_type', 'code');
  redirectUrl.searchParams.append('scope', 'email profile');
  redirectUrl.searchParams.append('state', state);
  redirectUrl.searchParams.append('access_type', 'offline');
  redirectUrl.searchParams.append('prompt', 'consent');

  return redirect(redirectUrl.toString());
};
