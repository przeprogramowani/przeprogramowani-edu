create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,
  quiz_slug text not null,
  language text not null,
  question_version text not null,
  answers jsonb not null,
  result jsonb not null,
  completed_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_slug, quiz_slug, language)
);

create index on public.quiz_results(user_id);
create index on public.quiz_results(course_slug, quiz_slug);

alter table public.quiz_results enable row level security;
