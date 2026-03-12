alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.notices enable row level security;
alter table public.comments enable row level security;
-- profiles: app reads any user's avatar_url; allow authenticated read all
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles for
select to authenticated using (true);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for
insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for
update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- posts: feed shows all posts; only owner can write
drop policy if exists "posts_select_authenticated" on public.posts;
create policy "posts_select_authenticated" on public.posts for
select to authenticated using (true);
drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own" on public.posts for
insert to authenticated with check (user_id = auth.uid());
drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own" on public.posts for
update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own" on public.posts for delete to authenticated using (user_id = auth.uid());
-- notices: shows all; only owner can write
drop policy if exists "notices_select_authenticated" on public.notices;
create policy "notices_select_authenticated" on public.notices for
select to authenticated using (true);
drop policy if exists "notices_insert_own" on public.notices;
create policy "notices_insert_own" on public.notices for
insert to authenticated with check (user_id = auth.uid());
drop policy if exists "notices_update_own" on public.notices;
create policy "notices_update_own" on public.notices for
update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "notices_delete_own" on public.notices;
create policy "notices_delete_own" on public.notices for delete to authenticated using (user_id = auth.uid());
-- comments: shown per post; only owner can write
drop policy if exists "comments_select_authenticated" on public.comments;
create policy "comments_select_authenticated" on public.comments for
select to authenticated using (true);
drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments for
insert to authenticated with check (user_id = auth.uid());
drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own" on public.comments for
update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own" on public.comments for delete to authenticated using (user_id = auth.uid());