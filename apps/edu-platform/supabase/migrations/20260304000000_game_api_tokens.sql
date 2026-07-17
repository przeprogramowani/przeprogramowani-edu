-- Player-issued API tokens for external game state access.
-- Raw tokens are NEVER stored — only their SHA-256 hex hash.
create table public.game_api_tokens (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  token_hash  text unique not null,   -- hex(sha256(raw_token))
  created_at  timestamptz default now(),
  last_used   timestamptz,
  expires_at  timestamptz,            -- null = governed by KV TTL (30d)
  revoked     boolean default false
);

create index on public.game_api_tokens(user_id);
create index on public.game_api_tokens(token_hash);
