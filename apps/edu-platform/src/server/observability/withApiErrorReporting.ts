import type { APIContext, APIRoute } from 'astro';
import * as Sentry from '@sentry/cloudflare';

export interface ApiErrorReporterOptions {
  route: string;
}

export type RouteContextWithSentry = APIContext & {
  sentry: {
    setUser(user: { id: string; email: string }): void;
    setMissionLogContext(ctx: Record<string, unknown>): void;
  };
};

const jsonHeaders = { 'Content-Type': 'application/json' };

function internalServerErrorResponse(): Response {
  return new Response(JSON.stringify({ error: 'Internal server error' }), {
    status: 500,
    headers: jsonHeaders,
  });
}

// Structural Cloudflare ExecutionContext shape — avoids depending on the
// @cloudflare/workers-types ambient type, which astro check does not surface
// here. wrapRequestHandler only reads `waitUntil`.
type CloudflareExecutionContext = { waitUntil(promise: Promise<unknown>): void };

type CloudflareRuntime = {
  env?: { ENV?: string; PUBLIC_SENTRY_DSN?: string };
  ctx?: CloudflareExecutionContext;
};

function readRuntime(context: APIContext): CloudflareRuntime | undefined {
  return (context.locals as { runtime?: CloudflareRuntime } | undefined)?.runtime;
}

// On Cloudflare Pages the @sentry/astro integration cannot install the worker-entry
// withSentry wrap, so a single boot-time Sentry.init() is not viable. Instead we
// initialize the Cloudflare SDK per request via wrapRequestHandler, which gives us:
//  - the fetch-based makeCloudflareTransport that actually ships events from Workers
//    (unlike @sentry/node's Node-HTTP transport, which silently drops events here),
//  - per-request isolation scope (no PII bleed across concurrent requests),
//  - automatic ctx.waitUntil(flushAndDispose) so the response is not held up but the
//    transport still drains before the isolate terminates.
export function withApiErrorReporting(
  handler: (context: RouteContextWithSentry) => Promise<Response> | Response,
  options: ApiErrorReporterOptions,
): APIRoute {
  return async (context) => {
    const runtime = readRuntime(context);
    const dsn = runtime?.env?.PUBLIC_SENTRY_DSN;
    const envTag = runtime?.env?.ENV;

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
        // wrapRequestHandler types this as @cloudflare/workers-types
        // ExecutionContext<unknown>; our runtime ctx is structurally identical
        // (waitUntil + passThroughOnException). Cast via unknown to match the
        // existing project convention for this seam.
        context: runtime?.ctx as unknown as Parameters<typeof Sentry.wrapRequestHandler>[0]['context'],
        // We capture-and-shape errors ourselves below to preserve the existing
        // JSON 500 response contract; wrapRequestHandler's auto-capture would
        // double-report and rethrow.
        captureErrors: false,
      },
      async () => {
        const scope = Sentry.getCurrentScope();
        scope.setTag('route', options.route);
        scope.setTag('method', context.request.method);
        if (envTag) {
          scope.setTag('env', envTag);
        }
        const cfRay = context.request.headers.get('cf-ray');
        if (cfRay) {
          scope.setTag('cf-ray', cfRay);
        }

        const sentryAccessor: RouteContextWithSentry['sentry'] = {
          setUser(user) {
            Sentry.setUser({ id: user.id, email: user.email });
          },
          setMissionLogContext(ctx) {
            Sentry.setContext('mission_log', ctx);
          },
        };

        const contextWithSentry = Object.assign(context, {
          sentry: sentryAccessor,
        }) as RouteContextWithSentry;

        try {
          const response = await handler(contextWithSentry);
          if (response.status >= 500) {
            Sentry.captureMessage(
              `5xx from ${options.route}: ${response.status}`,
              'warning',
            );
          }
          return response;
        } catch (err) {
          Sentry.captureException(err);
          return internalServerErrorResponse();
        }
      },
    );
  };
}
