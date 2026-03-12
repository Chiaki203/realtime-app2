-- 0) Backup table to store the current favorites data just in case
create table if not exists public.profiles_favorites_backup (
  id uuid primary key,
  username text,
  favorites text,
  avatar_url text,
  backed_up_at timestamptz not null default now()
);
insert into public.profiles_favorites_backup (id, username, favorites, avatar_url)
select p.id,
  p.username,
  p.favorites,
  p.avatar_url
from public.profiles p
where p.favorites is not null
  and btrim(p.favorites) <> ''
  and not exists (
    select 1
    from public.profiles_favorites_backup b
    where b.id = p.id
  );
-- 1) Function for automatically updating updated_at
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now();
return new;
end $$;
-- 2) Private notes table
create table if not exists public.my_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 3) index
create index if not exists my_notes_user_id_created_at_idx on public.my_notes (user_id, created_at desc);
-- 4) Trigger to automatically update updated_at
drop trigger if exists set_my_notes_updated_at on public.my_notes;
create trigger set_my_notes_updated_at before
update on public.my_notes for each row execute function public.set_updated_at();