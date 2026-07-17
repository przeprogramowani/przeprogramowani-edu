-- Avatar proxy cutover: rewrite existing public Supabase URLs to absolute proxy URLs,
-- then lock the avatars bucket so the proxy becomes the only access path.
-- Both statements run in the same transaction; failure on either rolls back the other.

-- 1. Rewrite existing public Supabase URLs to absolute proxy URLs. Pattern-match the
-- canonical shape; rows that don't match (none expected, but defensive) are left alone.
update public.profiles
set avatar_url = regexp_replace(
  avatar_url,
  '^https://[^/]+/storage/v1/object/public/avatars/',
  'https://platforma.przeprogramowani.pl/api/avatar/'
)
where avatar_url ~ '^https://[^/]+/storage/v1/object/public/avatars/';

-- 2. Make the avatars bucket private — proxy is now the only access path.
update storage.buckets set public = false where id = 'avatars';
