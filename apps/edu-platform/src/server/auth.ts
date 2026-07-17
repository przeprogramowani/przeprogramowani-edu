import jwt from '@tsndr/cloudflare-worker-jwt';

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const SESSION_REFRESH_THRESHOLD_SECONDS = 60 * 60;

export type SessionCookieOptions = {
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
};

export type SessionCookieWriter = {
  set?: (name: string, value: string, options: SessionCookieOptions) => void;
};

// Supabase Auth lowercases emails on `createUser`, and KV/Circle/game keys
// already use `email.toLowerCase().trim()` everywhere. Normalize at every auth
// ingress so the JWT, the `profiles` row, and downstream lookups all agree —
// otherwise mixed-case input from a provider leaves `auth.users` and
// `public.profiles` keyed differently and `upsertUser` can't reconcile them.
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function getSessionCookieOptions(): SessionCookieOptions {
  return {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function generateToken(email: string, jwtSecret: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const nbf = Math.floor(Date.now() / 1000); // Valid from now
  return await jwt.sign(
    {
      email,
      exp,
      nbf,
    },
    jwtSecret,
    {
      algorithm: 'HS256',
    }
  );
}

export async function verifyToken(token: string, jwtSecret: string) {
  try {
    const verified = await jwt.verify(token, jwtSecret, {
      algorithm: 'HS256',
      clockTolerance: 60, // 1 minute tolerance for slightly out of sync clocks
    });

    if (!verified) {
      return null;
    }

    const payload = verified.payload as { email: string; exp?: number };
    // Normalize the email at the JWT boundary so every downstream reader
    // (verifyAuth, externalAuth, missionLog/auth, game endpoints, …) compares
    // against the same canonical form as `auth.users` and `public.profiles`.
    // Pre-existing mixed-case tokens still validate; their email is just
    // lowercased on the way out, and the next session refresh writes a
    // normalized cookie via generateToken(payload.email, …).
    if (typeof payload?.email !== 'string') {
      return null;
    }
    payload.email = normalizeEmail(payload.email);
    return payload;
  } catch {
    return null;
  }
}

export async function refreshSessionCookieIfNeeded(
  cookies: SessionCookieWriter,
  payload: { email: string; exp?: number },
  jwtSecret: string
): Promise<boolean> {
  if (!cookies.set || !payload.exp || typeof payload.exp !== 'number') {
    return false;
  }

  const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000);
  if (timeUntilExpiry >= SESSION_REFRESH_THRESHOLD_SECONDS) {
    return false;
  }

  const newToken = await generateToken(payload.email, jwtSecret);
  cookies.set('token', newToken, getSessionCookieOptions());
  return true;
}
