import { beforeEach, describe, expect, it, vi } from 'vitest';

const scopeTags = new Map<string, string>();
const setTagMock = vi.fn((key: string, value: string) => {
  scopeTags.set(key, value);
});
const setUserMock = vi.fn();
const setContextMock = vi.fn();
const captureExceptionMock = vi.fn();
const captureMessageMock = vi.fn();
const wrapRequestHandlerMock = vi.fn(
  async (
    _options: { request: Request; context?: unknown; captureErrors?: boolean; options: unknown },
    handler: () => Promise<Response>,
  ) => handler(),
);

vi.mock('@sentry/cloudflare', () => ({
  wrapRequestHandler: (
    options: { request: Request; context?: unknown; captureErrors?: boolean; options: unknown },
    handler: () => Promise<Response>,
  ) => {
    scopeTags.clear();
    return wrapRequestHandlerMock(options, handler);
  },
  getCurrentScope: () => ({ setTag: setTagMock }),
  setUser: (...args: unknown[]) => setUserMock(...args),
  setContext: (...args: unknown[]) => setContextMock(...args),
  captureException: (...args: unknown[]) => captureExceptionMock(...args),
  captureMessage: (...args: unknown[]) => captureMessageMock(...args),
  consoleLoggingIntegration: vi.fn(() => ({ name: 'ConsoleLogging' })),
}));

import { withApiErrorReporting, type RouteContextWithSentry } from './withApiErrorReporting';

function buildContext(overrides: {
  method?: string;
  headers?: Record<string, string>;
  env?: Record<string, string>;
} = {}): RouteContextWithSentry {
  const headers = new Headers(overrides.headers ?? {});
  return {
    request: {
      method: overrides.method ?? 'GET',
      headers,
    } as Request,
    locals: {
      runtime: {
        env: overrides.env ?? { ENV: 'DEV' },
      },
    },
  } as unknown as RouteContextWithSentry;
}

describe('withApiErrorReporting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    scopeTags.clear();
  });

  it('passes through a successful 2xx response unchanged', async () => {
    const expected = new Response('{"ok":true}', { status: 200 });
    const handler = vi.fn().mockResolvedValue(expected);

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    const response = await wrapped(buildContext() as never);

    expect(response).toBe(expected);
    expect(captureExceptionMock).not.toHaveBeenCalled();
    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it('captures exceptions and returns a 500 JSON response', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('boom'));

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    const response = await wrapped(buildContext() as never);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    await expect(response.json()).resolves.toEqual({ error: 'Internal server error' });

    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error));
    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it('captures 5xx responses as warnings without altering the response', async () => {
    const expected = new Response('upstream bad gateway', { status: 502 });
    const handler = vi.fn().mockResolvedValue(expected);

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.generate' });
    const response = await wrapped(buildContext() as never);

    expect(response).toBe(expected);
    expect(captureMessageMock).toHaveBeenCalledTimes(1);
    expect(captureMessageMock).toHaveBeenCalledWith(
      '5xx from mission-log.generate: 502',
      'warning',
    );
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('does not capture 4xx responses', async () => {
    const expected = new Response('forbidden', { status: 403 });
    const handler = vi.fn().mockResolvedValue(expected);

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(buildContext() as never);

    expect(captureMessageMock).not.toHaveBeenCalled();
    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it('sets route, method, env, and cf-ray tags when present', async () => {
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.generate' });
    await wrapped(
      buildContext({
        method: 'POST',
        headers: { 'cf-ray': '90a1b2c3d4e5f607-WAW' },
        env: { ENV: 'PROD' },
      }) as never,
    );

    expect(scopeTags.get('route')).toBe('mission-log.generate');
    expect(scopeTags.get('method')).toBe('POST');
    expect(scopeTags.get('env')).toBe('PROD');
    expect(scopeTags.get('cf-ray')).toBe('90a1b2c3d4e5f607-WAW');
  });

  it('omits the cf-ray tag when the header is absent (no "undefined" leak)', async () => {
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(buildContext() as never);

    expect(scopeTags.has('cf-ray')).toBe(false);
    expect(setTagMock).not.toHaveBeenCalledWith('cf-ray', expect.anything());
  });

  it('omits the env tag when ENV is missing', async () => {
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(buildContext({ env: {} }) as never);

    expect(scopeTags.has('env')).toBe(false);
  });

  it('exposes a sentry accessor that delegates to Sentry.setUser and setContext', async () => {
    const handler = vi.fn(async (ctx: RouteContextWithSentry) => {
      ctx.sentry.setUser({ id: 'user-1', email: 'user@example.test' });
      ctx.sentry.setMissionLogContext({ lessonId: 'm1-l1', devBypassGating: false });
      return new Response(null, { status: 200 });
    });

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(buildContext() as never);

    expect(setUserMock).toHaveBeenCalledWith({ id: 'user-1', email: 'user@example.test' });
    expect(setContextMock).toHaveBeenCalledWith('mission_log', {
      lessonId: 'm1-l1',
      devBypassGating: false,
    });
  });

  it('passes runtime ctx (waitUntil-capable) to wrapRequestHandler so flush runs after response', async () => {
    const waitUntilCtx = { waitUntil: vi.fn() };
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const ctx = buildContext();
    (ctx.locals as { runtime: { ctx: unknown } }).runtime.ctx = waitUntilCtx;

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(ctx as never);

    expect(wrapRequestHandlerMock).toHaveBeenCalledTimes(1);
    expect(wrapRequestHandlerMock.mock.calls[0][0]).toMatchObject({
      context: waitUntilCtx,
      captureErrors: false,
    });
  });

  it('forwards the runtime DSN into wrapRequestHandler options', async () => {
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const ctx = buildContext({
      env: { ENV: 'PROD', PUBLIC_SENTRY_DSN: 'https://key@o0.ingest.sentry.io/1' },
    });

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    await wrapped(ctx as never);

    const passedOptions = (wrapRequestHandlerMock.mock.calls[0][0] as { options: { dsn?: string } })
      .options;
    expect(passedOptions.dsn).toBe('https://key@o0.ingest.sentry.io/1');
  });

  it('captures the exception even if the handler throws after the sentry accessor was used', async () => {
    const handler = vi.fn(async (ctx: RouteContextWithSentry) => {
      ctx.sentry.setUser({ id: 'user-1', email: 'user@example.test' });
      throw new Error('after-setUser');
    });

    const wrapped = withApiErrorReporting(handler, { route: 'mission-log.test' });
    const response = await wrapped(buildContext() as never);

    expect(response.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(setUserMock).toHaveBeenCalledTimes(1);
  });
});
