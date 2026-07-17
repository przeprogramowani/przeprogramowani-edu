import type { APIContext, MiddlewareNext } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const scopeTags = new Map<string, string>();
const setTagMock = vi.fn((key: string, value: string) => {
  scopeTags.set(key, value);
});
const captureMessageMock = vi.fn();
const wrapRequestHandlerMock = vi.fn(
  async (
    _options: { request: Request; context?: unknown; options: unknown },
    handler: () => Promise<Response>,
  ) => handler(),
);

vi.mock('@sentry/cloudflare', () => ({
  wrapRequestHandler: (
    options: { request: Request; context?: unknown; options: unknown },
    handler: () => Promise<Response>,
  ) => {
    scopeTags.clear();
    return wrapRequestHandlerMock(options, handler);
  },
  getCurrentScope: () => ({ setTag: setTagMock }),
  captureMessage: (...args: unknown[]) => captureMessageMock(...args),
  consoleLoggingIntegration: vi.fn(() => ({ name: 'ConsoleLogging' })),
}));

import { sentryReporter } from './sentryReporter';

const DSN = 'https://key@o0.ingest.sentry.io/1';

function buildContext(overrides: {
  pathname?: string;
  method?: string;
  headers?: Record<string, string>;
  env?: Record<string, string>;
  ctx?: unknown;
} = {}): APIContext {
  const headers = new Headers(overrides.headers ?? {});
  const pathname = overrides.pathname ?? '/courses';
  return {
    request: {
      method: overrides.method ?? 'GET',
      headers,
    } as Request,
    url: new URL(`https://platforma.example${pathname}`),
    locals: {
      runtime: {
        env: overrides.env ?? { ENV: 'DEV' },
        ctx: overrides.ctx,
      },
    },
  } as unknown as APIContext;
}

function invokeReporter(context: APIContext, next: MiddlewareNext) {
  return sentryReporter(context, next);
}

describe('sentryReporter middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    scopeTags.clear();
  });

  it('skips /api/* routes (handled by withApiErrorReporting)', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(buildContext({ pathname: '/api/auth' }), next);

    expect(wrapRequestHandlerMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('skips when DSN is missing (e.g. local dev without the env var)', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({ pathname: '/courses', env: { ENV: 'PROD' } }),
      next,
    );

    expect(wrapRequestHandlerMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('wraps non-API routes with wrapRequestHandler when DSN is present', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({ env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN } }),
      next,
    );

    expect(wrapRequestHandlerMock).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('sets route, method, env, and cf-ray scope tags', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({
        pathname: '/courses/cursor-ai',
        method: 'POST',
        env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN },
        headers: { 'cf-ray': '90a1b2c3d4e5f607-WAW' },
      }),
      next,
    );

    expect(scopeTags.get('route')).toBe('/courses/cursor-ai');
    expect(scopeTags.get('method')).toBe('POST');
    expect(scopeTags.get('env')).toBe('PROD');
    expect(scopeTags.get('cf-ray')).toBe('90a1b2c3d4e5f607-WAW');
  });

  it('omits the cf-ray tag when the header is absent (no "undefined" leak)', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({ env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN } }),
      next,
    );

    expect(scopeTags.has('cf-ray')).toBe(false);
    expect(setTagMock).not.toHaveBeenCalledWith('cf-ray', expect.anything());
  });

  it('omits the env tag when ENV is missing', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({ env: { PUBLIC_SENTRY_DSN: DSN } }),
      next,
    );

    expect(scopeTags.has('env')).toBe(false);
  });

  it('captures 5xx response as a warning without altering the response', async () => {
    const expected = new Response('boom', { status: 503 });
    const next = vi.fn().mockResolvedValue(expected);
    const response = await invokeReporter(
      buildContext({
        pathname: '/courses/opanuj-frontend',
        env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN },
      }),
      next,
    );

    expect(response).toBe(expected);
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    expect(captureMessageMock).toHaveBeenCalledWith(
      '5xx from /courses/opanuj-frontend: 503',
      'warning',
    );
  });

  it('does not capture 4xx responses', async () => {
    const next = vi.fn().mockResolvedValue(new Response('forbidden', { status: 403 }));
    await invokeReporter(
      buildContext({ env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN } }),
      next,
    );

    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it('passes runtime ctx (waitUntil-capable) into wrapRequestHandler', async () => {
    const waitUntilCtx = { waitUntil: vi.fn() };
    const next = vi.fn().mockResolvedValue(new Response('ok'));

    await invokeReporter(
      buildContext({
        env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN },
        ctx: waitUntilCtx,
      }),
      next,
    );

    expect(wrapRequestHandlerMock).toHaveBeenCalledTimes(1);
    expect(wrapRequestHandlerMock.mock.calls[0][0]).toMatchObject({
      context: waitUntilCtx,
    });
  });

  it('forwards the runtime DSN into wrapRequestHandler options', async () => {
    const next = vi.fn().mockResolvedValue(new Response('ok'));
    await invokeReporter(
      buildContext({ env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: DSN } }),
      next,
    );

    const passedOptions = (wrapRequestHandlerMock.mock.calls[0][0] as {
      options: { dsn?: string };
    }).options;
    expect(passedOptions.dsn).toBe(DSN);
  });
});
