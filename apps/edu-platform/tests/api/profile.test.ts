import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyTokenMock, getUserIdByEmailMock, updateProfileMock, uploadAvatarMock, removeAvatarMock } = vi.hoisted(
  () => ({
    verifyTokenMock: vi.fn(),
    getUserIdByEmailMock: vi.fn(),
    updateProfileMock: vi.fn(),
    uploadAvatarMock: vi.fn(),
    removeAvatarMock: vi.fn(),
  })
);

vi.mock('@/server/auth', () => ({
  verifyToken: verifyTokenMock,
}));

vi.mock('@/server/supabase/userService', () => ({
  getUserIdByEmail: getUserIdByEmailMock,
  updateProfile: updateProfileMock,
  uploadAvatar: uploadAvatarMock,
  removeAvatar: removeAvatarMock,
}));

import { PUT } from '../../src/pages/api/profile/index';
import { POST, DELETE } from '../../src/pages/api/profile/avatar';

const env = {
  JWT_SECRET: 'secret',
  SUPABASE_URL: 'https://supabase.test',
  SUPABASE_SERVICE_KEY: 'service-key',
};

function makeContext(options: {
  token?: string;
  jsonBody?: unknown;
  formData?: FormData;
}) {
  const cookies = {
    get: vi.fn().mockImplementation((name: string) => {
      if (name === 'token' && options.token) {
        return { value: options.token };
      }
      return undefined;
    }),
  };
  const request = {
    json: vi.fn().mockImplementation(async () => {
      if (options.jsonBody === undefined) throw new Error('no body');
      return options.jsonBody;
    }),
    formData: vi.fn().mockImplementation(async () => {
      if (!options.formData) throw new Error('no form data');
      return options.formData;
    }),
  };
  return {
    cookies,
    request,
    locals: { runtime: { env } },
  } as any;
}

describe('PUT /api/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyTokenMock.mockResolvedValue({ email: 'user@example.com' });
    getUserIdByEmailMock.mockResolvedValue('user-123');
    updateProfileMock.mockImplementation(async (_userId: string, _env: unknown, input: unknown) => input);
  });

  it('returns 401 when token cookie is missing', async () => {
    const response = await PUT(makeContext({ jsonBody: { firstName: 'A', lastName: 'B' } }));
    expect(response.status).toBe(401);
    expect(verifyTokenMock).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    verifyTokenMock.mockResolvedValueOnce(null);
    const response = await PUT(makeContext({ token: 'bad', jsonBody: { firstName: 'A', lastName: 'B' } }));
    expect(response.status).toBe(401);
  });

  it('returns 400 on invalid JSON body', async () => {
    const ctx = makeContext({ token: 'good' });
    const response = await PUT(ctx);
    expect(response.status).toBe(400);
  });

  it('rejects oversized first name', async () => {
    const longName = 'a'.repeat(61);
    const response = await PUT(makeContext({ token: 'good', jsonBody: { firstName: longName, lastName: null } }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('INVALID_FIRST_NAME');
    expect(updateProfileMock).not.toHaveBeenCalled();
  });

  it('rejects non-string last name', async () => {
    const response = await PUT(makeContext({ token: 'good', jsonBody: { firstName: 'Anna', lastName: 42 } }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('INVALID_LAST_NAME');
  });

  it('accepts trimmed names and persists them', async () => {
    const response = await PUT(
      makeContext({ token: 'good', jsonBody: { firstName: '  Anna  ', lastName: 'Kowalska' } })
    );
    expect(response.status).toBe(200);
    expect(updateProfileMock).toHaveBeenCalledWith('user-123', env, {
      firstName: 'Anna',
      lastName: 'Kowalska',
    });
  });

  it('coerces empty strings to null', async () => {
    const response = await PUT(makeContext({ token: 'good', jsonBody: { firstName: '   ', lastName: '' } }));
    expect(response.status).toBe(200);
    expect(updateProfileMock).toHaveBeenCalledWith('user-123', env, {
      firstName: null,
      lastName: null,
    });
  });
});

describe('POST /api/profile/avatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyTokenMock.mockResolvedValue({ email: 'user@example.com' });
    getUserIdByEmailMock.mockResolvedValue('user-123');
    uploadAvatarMock.mockResolvedValue('https://cdn/avatar?v=1');
  });

  it('returns 401 when unauthenticated', async () => {
    const response = await POST(makeContext({}));
    expect(response.status).toBe(401);
  });

  it('returns 400 when avatar field is missing', async () => {
    const formData = new FormData();
    const response = await POST(makeContext({ token: 'good', formData }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('MISSING_FILE');
  });

  it('rejects unsupported MIME types', async () => {
    const formData = new FormData();
    formData.append('avatar', new File(['x'], 'a.gif', { type: 'image/gif' }));
    const response = await POST(makeContext({ token: 'good', formData }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('INVALID_TYPE');
    expect(uploadAvatarMock).not.toHaveBeenCalled();
  });

  it('rejects oversized files', async () => {
    const big = new Uint8Array(2 * 1024 * 1024 + 1);
    const formData = new FormData();
    formData.append('avatar', new File([big], 'a.png', { type: 'image/png' }));
    const response = await POST(makeContext({ token: 'good', formData }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('TOO_LARGE');
    expect(uploadAvatarMock).not.toHaveBeenCalled();
  });

  it('uploads valid PNG and returns the URL', async () => {
    const formData = new FormData();
    formData.append('avatar', new File([new Uint8Array(10)], 'a.png', { type: 'image/png' }));
    const response = await POST(makeContext({ token: 'good', formData }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.avatarUrl).toBe('https://cdn/avatar?v=1');
    expect(uploadAvatarMock).toHaveBeenCalledWith('user-123', env, expect.any(ArrayBuffer), 'image/png');
  });
});

describe('DELETE /api/profile/avatar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyTokenMock.mockResolvedValue({ email: 'user@example.com' });
    getUserIdByEmailMock.mockResolvedValue('user-123');
    removeAvatarMock.mockResolvedValue(undefined);
  });

  it('returns 401 when unauthenticated', async () => {
    const response = await DELETE(makeContext({}));
    expect(response.status).toBe(401);
  });

  it('removes the avatar and returns null URL', async () => {
    const response = await DELETE(makeContext({ token: 'good' }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.avatarUrl).toBeNull();
    expect(removeAvatarMock).toHaveBeenCalledWith('user-123', env);
  });
});
