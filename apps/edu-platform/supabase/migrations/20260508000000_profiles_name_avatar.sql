-- Profile name + avatar fields (all nullable; existing users keep working)
alter table public.profiles
  add column first_name text,
  add column last_name  text,
  add column avatar_url text;

-- Public avatars bucket: 2MB limit, PNG/JPEG/WebP only.
-- Idempotent so re-running the migration is safe (e.g. after `supabase db reset`).
-- Note: bucket is created `public = true` here and flipped to private in
-- 20260515120000_avatar_proxy.sql once the proxy route ships.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;
