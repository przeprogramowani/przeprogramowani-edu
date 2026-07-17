create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,
  language text,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index lesson_progress_unique_default_language
  on public.lesson_progress(user_id, course_slug, lesson_id)
  where language is null;

create unique index lesson_progress_unique_language
  on public.lesson_progress(user_id, course_slug, language, lesson_id)
  where language is not null;

create index lesson_progress_user_course_language_idx
  on public.lesson_progress(user_id, course_slug, language);

create index lesson_progress_course_lesson_idx
  on public.lesson_progress(course_slug, lesson_id);

alter table public.lesson_progress enable row level security;
