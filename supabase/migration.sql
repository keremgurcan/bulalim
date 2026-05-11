-- ============ USERS ============
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text unique not null,
  tc_kimlik_hash text not null,
  full_name text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  city text,
  points integer default 0 not null,
  rank text default 'Yeni Üye' not null,
  is_verified boolean default false not null,
  created_at timestamptz default now() not null
);

-- ============ ITEMS ============
create type item_type as enum ('lost', 'found');
create type item_status as enum ('active', 'matched', 'resolved', 'expired');
create type item_category as enum (
  'electronics', 'wallet_card', 'keys', 'bag_luggage',
  'jewelry', 'documents', 'clothing', 'pet', 'other'
);

create table public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type item_type not null,
  title text not null,
  description text not null,
  category item_category not null,
  photo_urls text[] default '{}',
  lat double precision not null,
  lng double precision not null,
  location_text text not null,
  city text not null,
  date_lost_or_found date not null,
  status item_status default 'active' not null,
  view_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index items_category_idx on public.items(category);
create index items_status_idx on public.items(status);
create index items_type_idx on public.items(type);
create index items_city_idx on public.items(city);

-- ============ MESSAGES ============
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  initiator_id uuid references public.profiles(id) not null,
  owner_id uuid references public.profiles(id) not null,
  last_message_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  unique(item_id, initiator_id)
);

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

-- ============ BADGES ============
create type badge_type as enum (
  'first_post', 'first_match', 'helper_5', 'detective_10',
  'hero_25', 'legend_50', 'fast_responder', 'verified', 'community_pillar'
);

create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge badge_type not null,
  earned_at timestamptz default now() not null,
  unique(user_id, badge)
);

-- ============ MATCHES ============
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  lost_item_id uuid references public.items(id) on delete cascade not null,
  found_item_id uuid references public.items(id) on delete cascade not null,
  similarity_score float not null,
  status text default 'pending' not null,
  created_at timestamptz default now() not null,
  unique(lost_item_id, found_item_id)
);

-- ============ RLS POLICIES ============
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.user_badges enable row level security;
alter table public.matches enable row level security;

-- Profiles
create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = id);

-- Items
create policy "Active items viewable by everyone" on public.items for select using (status != 'expired');
create policy "Users can insert own items" on public.items for insert with check (auth.uid() = user_id);
create policy "Users can update own items" on public.items for update using (auth.uid() = user_id);
create policy "Users can delete own items" on public.items for delete using (auth.uid() = user_id);

-- Conversations
create policy "Users see own conversations" on public.conversations for select
  using (auth.uid() = initiator_id or auth.uid() = owner_id);
create policy "Users insert own conversations" on public.conversations for insert
  with check (auth.uid() = initiator_id);

-- Messages
create policy "Users see own messages" on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.initiator_id = auth.uid() or c.owner_id = auth.uid())
  ));
create policy "Users send messages in own conversations" on public.messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.initiator_id = auth.uid() or c.owner_id = auth.uid())
  ));

-- Badges
create policy "Badges viewable by everyone" on public.user_badges for select using (true);

-- Matches
create policy "Matches viewable by item owners" on public.matches for select
  using (
    exists (select 1 from public.items i where i.id = lost_item_id and i.user_id = auth.uid())
    or
    exists (select 1 from public.items i where i.id = found_item_id and i.user_id = auth.uid())
  );

-- ============ HELPER FUNCTION ============
create or replace function increment_points(user_id uuid, amount integer)
returns void language sql security definer as $$
  update public.profiles
  set points = points + amount,
      rank = case
        when points + amount >= 1000 then 'Efsane'
        when points + amount >= 500 then 'Kahraman'
        when points + amount >= 200 then 'Dedektif'
        when points + amount >= 50 then 'Yardımsever'
        else 'Yeni Üye'
      end
  where id = user_id;
$$;

-- ============ REALTIME ============
-- Enable realtime for messages table
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
