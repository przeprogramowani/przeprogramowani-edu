create table public.mission_log_generations (
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id text not null,
  count integer not null default 0 check (count >= 0),
  first_generated_at timestamptz,
  last_generated_at timestamptz,
  last_badge_image_url text,
  last_badge_id integer,
  primary key (user_id, lesson_id)
);

create index mission_log_generations_user_idx
  on public.mission_log_generations(user_id);

alter table public.mission_log_generations enable row level security;
