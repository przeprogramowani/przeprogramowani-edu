import type { MiddlewareHandler } from 'astro';
import * as Sentry from '@sentry/cloudflare';

type CloudflareExecutionContext = { waitUntil(promise: Promise<unknown>): void };

type CloudflareRuntime = {
  env?: { PUBLIC_SENTRY_DSN?: string; ENV?: string };
  ctx?: CloudflareExecutionContext;
};

// Per-request Sentry instrumentation for page renders. API routes are wrapped
// individually by withApiErrorReporting (which also calls wrapRequestHandler);
// running this for /api/* would double-init the SDK and the nested isolation
// scopes are wasted work. wrapRequestHandler provides:
//   - the fetch-based makeCloudflareTransport that actually delivers events
//     from Workers (the @sentry/astro server SDK's Node-HTTP transport drops
//     them silently),
//   - a per-request isolation scope (no PII bleed across concurrent requests),
//   - automatic ctx.waitUntil(flushAndDispose) so responses are not held up
//     but the transport drains before the isolate terminates.
export const sentryReporter: MiddlewareHandler = async (context, next) => {
  if (context.url.pathname.startsWith('/api/')) {
    return next();
  }

  const runtime = (context.locals as { runtime?: CloudflareRuntime } | undefined)?.runtime;
  const dsn = runtime?.env?.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return next();
  }

  return Sentry.wrapRequestHandler(
    {
      options: {
        dsn,
        sendDefaultPii: true,
        tracesSampleRate: 0.1,
        enableLogs: true,
        integrations: (defaults) => [
          ...defaults,
          Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
        ],
      },
      request: context.request,
      context: runtime?.ctx as unknown as Parameters<
        typeof Sentry.wrapRequestHandler
      >[0]['context'],
    },
    async () => {
      const scope = Sentry.getCurrentScope();
      scope.setTag('route', context.url.pathname);
      scope.setTag('method', context.request.method);
      const envTag = runtime?.env?.ENV;
      if (envTag) {
        scope.setTag('env', envTag);
      }
      const cfRay = context.request.headers.get('cf-ray');
      if (cfRay) {
        scope.setTag('cf-ray', cfRay);
      }

      const response = await next();
      if (response.status >= 500) {
        Sentry.captureMessage(
          `5xx from ${context.url.pathname}: ${response.status}`,
          'warning',
        );
      }
      return response;
    },
  );
};
