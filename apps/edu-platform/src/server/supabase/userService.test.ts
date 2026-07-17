import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAvatarUrl,
  getProfile,
  removeAvatar,
  updateProfile,
  uploadAvatar,
  upsertUser,
} from './userService';
import { getSupabaseAdmin } from './client';

vi.mock('./client', () => ({
  getSupabaseAdmin: vi.fn(),
}));

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_KEY: 'service-key' };
const avatarEnv = { ...env, SITE_URL: 'https://platforma.test' };

type QueryMock = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
};

function createQueryMock(result: unknown) {
  const query: QueryMock = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    update: vi.fn(() => query),
    maybeSingle: vi.fn(() => result),
  };
  return query;
}

function createStorageBucketMock(opts: {
  uploadResult?: { error: { message: string } | null };
  removeResult?: { error: { message: string } | null };
  publicUrl?: string;
}) {
  return {
    upload: vi.fn(() => opts.uploadResult ?? { error: null }),
    remove: vi.fn(() => opts.removeResult ?? { error: null }),
    getPublicUrl: vi.fn(() => ({ data: { publicUrl: opts.publicUrl ?? 'https://cdn.test/avatars/u1' } })),
  };
}

describe('userService profile methods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns mapped profile for an existing user', async () => {
      const query = createQueryMock({
        data: {
          email: 'a@b.test',
          first_name: 'Ada',
          last_name: 'Lovelace',
          avatar_url: 'https://cdn.test/avatars/u1?v=1',
        },
        error: null,
      });
      vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

      await expect(getProfile('user-id', env)).resolves.toEqual({
        email: 'a@b.test',
        firstName: 'Ada',
        lastName: 'Lovelace',
        avatarUrl: 'https://cdn.test/avatars/u1?v=1',
      });
      expect(query.eq).toHaveBeenCalledWith('id', 'user-id');
    });

    it('returns null when no row exists', async () => {
      const query = createQueryMock({ data: null, error: null });
      vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

      await expect(getProfile('missing', env)).resolves.toBeNull();
    });

    it('throws when Supabase returns an error', async () => {
      const query = createQueryMock({ data: null, error: { message: 'boom' } });
      vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

      await expect(getProfile('user-id', env)).rejects.toThrow('Failed to load profile for user-id: boom');
    });
  });

  describe('updateProfile', () => {
    it('writes first_name and last_name and returns the input back', async () => {
      const query = createQueryMock({ error: null });
      // .update().eq() returns the query directly; there is no .maybeSingle terminal in our impl.
      // The update function awaits the query result; we simulate by making the chain Promise-like.
      const thenable = {
        ...query,
        then: (resolve: (value: unknown) => void) => Promise.resolve({ error: null }).then(resolve),
      };
      query.update.mockReturnValue(thenable);
      query.eq.mockReturnValue(thenable);

      vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

      await expect(
        updateProfile('user-id', env, { firstName: 'Ada', lastName: null })
      ).resolves.toEqual({ firstName: 'Ada', lastName: null });

      expect(query.update).toHaveBeenCalledWith({ first_name: 'Ada', last_name: null });
      expect(query.eq).toHaveBeenCalledWith('id', 'user-id');
    });

    it('throws when the update fails', async () => {
      const query = createQueryMock({ error: null });
      const thenable = {
        ...query,
        then: (resolve: (value: unknown) => void) =>
          Promise.resolve({ error: { message: 'denied' } }).then(resolve),
      };
      query.update.mockReturnValue(thenable);
      query.eq.mockReturnValue(thenable);

      vi.mocked(getSupabaseAdmin).mockReturnValue({ from: vi.fn(() => query) } as never);

      await expect(
        updateProfile('user-id', env, { firstName: null, lastName: null })
      ).rejects.toThrow('Failed to update profile for user-id: denied');
    });
  });

  describe('uploadAvatar', () => {
    it('uploads to the avatars bucket and persists a cache-busted URL', async () => {
      const bucket = createStorageBucketMock({ publicUrl: 'https://cdn.test/avatars/user-id' });
      const profileQuery = createQueryMock({ error: null });
      const thenable = {
        ...profileQuery,
        then: (resolve: (value: unknown) => void) => Promise.resolve({ error: null }).then(resolve),
      };
      profileQuery.update.mockReturnValue(thenable);
      profileQuery.eq.mockReturnValue(thenable);

      vi.mocked(getSupabaseAdmin).mockReturnValue({
        from: vi.fn(() => profileQuery),
        storage: { from: vi.fn(() => bucket) },
      } as never);

      const bytes = new Uint8Array([1, 2, 3]).buffer;
      const url = await uploadAvatar('user-id', avatarEnv, bytes, 'image/png');

      expect(bucket.upload).toHaveBeenCalledWith('user-id', bytes, {
        upsert: true,
        contentType: 'image/png',
      });
      expect(url).toMatch(/^https:\/\/platforma\.test\/api\/avatar\/user-id\?v=\d+$/);
      expect(profileQuery.update).toHaveBeenCalledWith({ avatar_url: url });
      expect(profileQuery.eq).toHaveBeenCalledWith('id', 'user-id');
    });

    it('throws when Storage upload fails', async () => {
      const bucket = createStorageBucketMock({ uploadResult: { error: { message: 'too big' } } });
      vi.mocked(getSupabaseAdmin).mockReturnValue({
        from: vi.fn(),
        storage: { from: vi.fn(() => bucket) },
      } as never);

      await expect(uploadAvatar('user-id', avatarEnv, new ArrayBuffer(0), 'image/png')).rejects.toThrow(
        'Failed to upload avatar for user-id: too big'
      );
    });
  });

  describe('upsertUser profile pre-fill', () => {
    function createUpsertMocks(opts: {
      existingUserId: string | null;
      createdUserId?: string;
      currentProfile?: {
        first_name: string | null;
        last_name: string | null;
        last_login?: string | null;
      };
    }) {
      const lookupQuery = createQueryMock({
        data: opts.existingUserId ? { id: opts.existingUserId } : null,
        error: null,
      });

      const readProfileQuery = createQueryMock({
        data: opts.currentProfile ?? {
          first_name: null,
          last_name: null,
          last_login: null,
        },
        error: null,
      });

      const updateThenable = {
        ...lookupQuery,
        then: (resolve: (value: unknown) => void) =>
          Promise.resolve({ error: null }).then(resolve),
      };
      const updateQuery: QueryMock = {
        select: vi.fn(),
        eq: vi.fn(() => updateThenable),
        update: vi.fn(() => updateThenable),
        maybeSingle: vi.fn(),
      };

      const insertCalls: Array<Record<string, unknown>> = [];
      const insertImpl = vi.fn((row: Record<string, unknown>) => {
        insertCalls.push(row);
        return { error: null };
      });

      const fromCalls: Array<'lookup' | 'read' | 'update' | 'insert'> = [];
      let step = 0;
      const fromImpl = vi.fn(() => {
        if (step === 0) {
          step = 1;
          fromCalls.push('lookup');
          return lookupQuery;
        }
        if (opts.existingUserId) {
          if (step === 1) {
            step = 2;
            fromCalls.push('read');
            return readProfileQuery;
          }
          fromCalls.push('update');
          return updateQuery;
        }
        fromCalls.push('insert');
        return { insert: insertImpl } as never;
      });

      const createUser = vi.fn(() => ({
        data: { user: { id: opts.createdUserId ?? 'new-user-id' } },
        error: null,
      }));

      vi.mocked(getSupabaseAdmin).mockReturnValue({
        from: fromImpl,
        auth: { admin: { createUser } },
      } as never);

      return { lookupQuery, readProfileQuery, updateQuery, insertCalls, createUser, fromCalls };
    }

    it('writes firstName/lastName on first-time creation when options provided', async () => {
      const { insertCalls, createUser } = createUpsertMocks({
        existingUserId: null,
        createdUserId: 'new-user',
      });

      const userId = await upsertUser('new@user.test', env, {
        newsletterOptIn: true,
        firstName: 'Ada',
        lastName: 'Lovelace',
      });

      expect(userId).toBe('new-user');
      expect(createUser).toHaveBeenCalledOnce();
      expect(insertCalls).toHaveLength(1);
      const row = insertCalls[0]!;
      expect(row.id).toBe('new-user');
      expect(row.email).toBe('new@user.test');
      expect(row.first_name).toBe('Ada');
      expect(row.last_name).toBe('Lovelace');
      expect(row).not.toHaveProperty('avatar_url');
      expect(row.newsletter_optin).toBe(true);
    });

    it('omits profile fields from insert when options are not provided', async () => {
      const { insertCalls } = createUpsertMocks({
        existingUserId: null,
        createdUserId: 'new-user',
      });

      await upsertUser('new@user.test', env);

      const row = insertCalls[0]!;
      expect(row).not.toHaveProperty('first_name');
      expect(row).not.toHaveProperty('last_name');
      expect(row).not.toHaveProperty('avatar_url');
      expect(row).not.toHaveProperty('newsletter_optin');
    });

    it('does not overwrite non-NULL name fields for returning users', async () => {
      const { updateQuery, insertCalls, createUser } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: 'UserEdited',
          last_name: 'AlsoEdited',
        },
      });

      const userId = await upsertUser('returning@user.test', env, {
        firstName: 'Should',
        lastName: 'NotWrite',
        newsletterOptIn: true,
      });

      expect(userId).toBe('existing-user');
      expect(createUser).not.toHaveBeenCalled();
      expect(insertCalls).toHaveLength(0);
      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(Object.keys(updateArg)).toEqual(['last_login']);
      expect(updateArg).not.toHaveProperty('first_name');
      expect(updateArg).not.toHaveProperty('last_name');
      expect(updateArg).not.toHaveProperty('avatar_url');
    });

    it('backfills NULL name fields for returning users when options provided', async () => {
      const { updateQuery, insertCalls, createUser } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: { first_name: null, last_name: null },
      });

      await upsertUser('returning@user.test', env, {
        firstName: 'Ada',
        lastName: 'Lovelace',
      });

      expect(createUser).not.toHaveBeenCalled();
      expect(insertCalls).toHaveLength(0);
      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(updateArg).toMatchObject({
        first_name: 'Ada',
        last_name: 'Lovelace',
      });
      expect(updateArg).not.toHaveProperty('avatar_url');
      expect(updateArg).toHaveProperty('last_login');
    });

    it('backfills only the NULL name fields and preserves the rest', async () => {
      const { updateQuery } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: 'KeepMe',
          last_name: null,
        },
      });

      await upsertUser('returning@user.test', env, {
        firstName: 'NewFirst',
        lastName: 'NewLast',
      });

      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(updateArg).not.toHaveProperty('first_name');
      expect(updateArg).toHaveProperty('last_name', 'NewLast');
      expect(updateArg).not.toHaveProperty('avatar_url');
    });

    it('skips the UPDATE entirely when last_login was bumped recently and no backfill is needed', async () => {
      const { updateQuery } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: 'Ada',
          last_name: 'Lovelace',
          last_login: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      });

      const userId = await upsertUser('returning@user.test', env);

      expect(userId).toBe('existing-user');
      expect(updateQuery.update).not.toHaveBeenCalled();
    });

    it('still backfills NULL name fields when last_login is recent', async () => {
      const { updateQuery } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: null,
          last_name: null,
          last_login: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      });

      await upsertUser('returning@user.test', env, {
        firstName: 'Ada',
        lastName: 'Lovelace',
      });

      expect(updateQuery.update).toHaveBeenCalledOnce();
      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(updateArg).toMatchObject({ first_name: 'Ada', last_name: 'Lovelace' });
      expect(updateArg).not.toHaveProperty('last_login');
    });

    it('bumps last_login when it is stale beyond the throttle window', async () => {
      const { updateQuery } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: 'Ada',
          last_name: 'Lovelace',
          last_login: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        },
      });

      await upsertUser('returning@user.test', env);

      expect(updateQuery.update).toHaveBeenCalledOnce();
      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(updateArg).toHaveProperty('last_login');
    });

    it('writes last_login when the profile has never recorded one', async () => {
      const { updateQuery } = createUpsertMocks({
        existingUserId: 'existing-user',
        currentProfile: {
          first_name: 'Ada',
          last_name: 'Lovelace',
          last_login: null,
        },
      });

      await upsertUser('returning@user.test', env);

      expect(updateQuery.update).toHaveBeenCalledOnce();
      const updateArg = updateQuery.update.mock.calls[0]?.[0] as Record<string, unknown>;
      expect(updateArg).toHaveProperty('last_login');
    });
  });

  describe('buildAvatarUrl', () => {
    it('produces an absolute proxy URL with the given version', () => {
      expect(buildAvatarUrl('user-1', 1234567890, 'https://platforma.test')).toBe(
        'https://platforma.test/api/avatar/user-1?v=1234567890'
      );
    });
  });

  describe('removeAvatar', () => {
    it('removes the storage object and clears avatar_url', async () => {
      const bucket = createStorageBucketMock({});
      const profileQuery = createQueryMock({ error: null });
      const thenable = {
        ...profileQuery,
        then: (resolve: (value: unknown) => void) => Promise.resolve({ error: null }).then(resolve),
      };
      profileQuery.update.mockReturnValue(thenable);
      profileQuery.eq.mockReturnValue(thenable);

      vi.mocked(getSupabaseAdmin).mockReturnValue({
        from: vi.fn(() => profileQuery),
        storage: { from: vi.fn(() => bucket) },
      } as never);

      await expect(removeAvatar('user-id', env)).resolves.toBeUndefined();

      expect(bucket.remove).toHaveBeenCalledWith(['user-id']);
      expect(profileQuery.update).toHaveBeenCalledWith({ avatar_url: null });
    });

    it('throws when Storage remove fails', async () => {
      const bucket = createStorageBucketMock({ removeResult: { error: { message: 'gone' } } });
      vi.mocked(getSupabaseAdmin).mockReturnValue({
        from: vi.fn(),
        storage: { from: vi.fn(() => bucket) },
      } as never);

      await expect(removeAvatar('user-id', env)).rejects.toThrow(
        'Failed to remove avatar for user-id: gone'
      );
    });
  });
});
