import { afterEach, describe, expect, it, vi } from 'vitest';

import { SESSION_MAX_AGE_SECONDS, generateToken, verifyToken } from './auth';

describe('auth session tokens', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('generates tokens that expire after seven days', async () => {
    vi.setSystemTime(new Date('2026-05-01T10:00:00.000Z'));

    const token = await generateToken('member@example.com', 'test-secret');
    const payload = await verifyToken(token, 'test-secret');
    const nowSeconds = Math.floor(Date.now() / 1000);

    expect(SESSION_MAX_AGE_SECONDS).toBe(60 * 60 * 24 * 7);
    expect(payload).toMatchObject({
      email: 'member@example.com',
      exp: nowSeconds + SESSION_MAX_AGE_SECONDS,
    });
  });
});
