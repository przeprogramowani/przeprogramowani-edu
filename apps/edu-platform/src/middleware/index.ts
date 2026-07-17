import { sequence, defineMiddleware } from 'astro:middleware';
import { checkRateLimit, setRateLimitCookie } from '../server/rateLimiter';
import { emailScannerMiddleware } from '../server/emailScannerDetection';
import { sentryReporter } from './sentryReporter';

// Define rate limit configurations: exact path -> seconds.
// Exact match only — OAuth sub-routes (/api/auth/google, /api/auth/github, and their
// callbacks) are gated by the OAuth `state` CSRF check and must not share a bucket
// with the magic-link endpoint, otherwise the init→Google→callback round-trip trips
// the limiter on the callback before its handler can run.
const RATE_LIMIT_CONFIG: { [path: string]: number } = {
  '/api/auth': 10,
  '/api/external/auth': 10,
};

const rateLimiter = defineMiddleware(async ({ cookies, url }, next) => {
  const currentPath = url.pathname;
  const matchedLimit = RATE_LIMIT_CONFIG[currentPath];
  const matchedPath = matchedLimit !== undefined ? currentPath : undefined;

  if (matchedPath && matchedLimit !== undefined) {
    if (checkRateLimit(cookies, matchedPath, matchedLimit)) {
      setRateLimitCookie(cookies, matchedPath, matchedLimit);
      return next();
    }
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next();
});

const VERIFY_ROUTE_PATTERN = /^\/external\/[^/]+\/verify$/;

const scannerDetection = defineMiddleware(async ({ url, request }, next) => {
  if (url.pathname === '/verify' || VERIFY_ROUTE_PATTERN.test(url.pathname)) {
    const scannerResponse = emailScannerMiddleware(request);
    if (scannerResponse) return scannerResponse;
  }
  return next();
});

const externalNoStore = defineMiddleware(async ({ url }, next) => {
  const response = await next();

  if (url.pathname.startsWith('/external/')) {
    // External pages are auth-sensitive and frequently updated; avoid stale browser HTML.
    response.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.append('Vary', 'Cookie');
  }

  return response;
});

export const onRequest = sequence(sentryReporter, rateLimiter, scannerDetection, externalNoStore);
