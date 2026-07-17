-- Enable Row-Level Security on all public tables (defense-in-depth).
-- All application queries use the service_role key which bypasses RLS.
-- This blocks the auto-generated anon key from accessing data.

alter table public.profiles enable row level security;
alter table public.access_grants enable row level security;
alter table public.game_state enable row level security;
alter table public.game_api_tokens enable row level security;
alter table public.system_flags enable row level security;
