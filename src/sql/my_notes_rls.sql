alter table public.my_notes enable row level security;
drop policy if exists "users can view their own notes" on public.my_notes;
create policy "users can view their own notes" on public.my_notes for
select using (auth.uid() = user_id);
drop policy if exists "users can insert their own notes" on public.my_notes;
create policy "users can insert their own notes" on public.my_notes for
insert with check (auth.uid() = user_id);
drop policy if exists "users can update their own notes" on public.my_notes;
create policy "users can update their own notes" on public.my_notes for
update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "users can delete their own notes" on public.my_notes;
create policy "users can delete their own notes" on public.my_notes for delete using (auth.uid() = user_id);