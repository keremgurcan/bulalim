-- ============================================================
-- ARKADAŞLIK + ARKADAŞ SOHBETİ
-- Supabase Dashboard > SQL Editor'da bir kez çalıştır.
-- ============================================================

-- 1) Arkadaşlık istekleri / arkadaşlıklar
create table if not exists public.friend_requests (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  addressee_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' not null check (status in ('pending', 'accepted')),
  created_at timestamptz default now() not null,
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

alter table public.friend_requests enable row level security;

create policy "see own friend requests" on public.friend_requests for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "send friend request" on public.friend_requests for insert
  with check (auth.uid() = requester_id);
create policy "respond to friend request" on public.friend_requests for update
  using (auth.uid() = addressee_id or auth.uid() = requester_id);
create policy "delete friend request" on public.friend_requests for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

alter publication supabase_realtime add table public.friend_requests;

-- 2) Arkadaş (ilan'sız) sohbetlere izin: item_id artık opsiyonel
alter table public.conversations alter column item_id drop not null;

-- İki arkadaş arasında tek bir arkadaş sohbeti olsun (item_id boşken)
create unique index if not exists conversations_friend_unique
  on public.conversations (least(initiator_id, owner_id), greatest(initiator_id, owner_id))
  where item_id is null;
