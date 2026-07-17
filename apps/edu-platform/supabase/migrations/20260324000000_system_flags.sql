create table public.system_flags (
  id          uuid primary key default gen_random_uuid(),
  flag        text unique not null,
  enabled     boolean default false,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

comment on table public.system_flags is 'Server-controlled flags for milestone gating. Toggled via Supabase Studio.';

-- Seed initial milestone flags (disabled by default)
insert into public.system_flags (flag, description) values
  ('sys:course-m1-available', 'Unlocks Module 1 doors in the game'),
  ('sys:course-m2-available', 'Unlocks Module 2 doors in the game');
