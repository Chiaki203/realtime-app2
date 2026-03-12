create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  favorites text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now();
return new;
end $$;
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before
update on public.profiles for each row execute function public.set_updated_at();
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  post_url text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_at_idx on public.posts(created_at);
create index if not exists notices_created_at_idx on public.notices(created_at);
create index if not exists comments_post_id_created_at_idx on public.comments(post_id, created_at);