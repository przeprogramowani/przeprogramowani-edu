-- Public profiles — thin layer on top of auth.users
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  created_at timestamptz default now(),
  last_login timestamptz
);

-- Unified access grants for all content types
create table public.access_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,  -- matches CourseSlug values
  source      text not null check (source in ('free', 'airtable', 'circle', 'manual')),
  granted_at  timestamptz default now(),
  expires_at  timestamptz,    -- null = permanent
  synced_at   timestamptz,    -- last re-verified from source
  source_meta jsonb,          -- { airtableRecordId } or { circleSpaceId, memberId }
  unique(user_id, course_slug)
);

-- Durable game state backup (KV remains primary write path)
create table public.game_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  version    int  default 1,
  updated_at timestamptz default now()
);

create index on public.access_grants(user_id);
create index on public.access_grants(course_slug);
create index on public.access_grants(source);
create index on public.profiles(email);
