-- =================================================================
-- VIRTUAL LIBRARY SCHEMAS & POLICIES FOR SUPABASE
-- =================================================================

-- 1. Rooms Table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type text not null check (type in ('community', 'private', 'coding', 'interview')),
  owner_id text not null,
  owner_name text default 'Anonymous',
  privacy text not null default 'public' check (privacy in ('public', 'private')),
  max_members int default 50,
  capabilities jsonb not null default '{"camera": true, "voice": false, "chat": true, "screen_share": false, "coding": true, "whiteboard": false, "ask_to_talk": true}'::jsonb,
  topic_distribution jsonb default '{"DSA": 10, "DBMS": 5, "Coding": 8}'::jsonb,
  active_students_count int default 0,
  created_at timestamptz default now()
);

-- 2. Room Members Table
create table if not exists public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  user_avatar text default 'AC',
  role text default 'member' check (role in ('owner', 'moderator', 'member')),
  topic text default 'General Study',
  camera_on boolean default false,
  mic_on boolean default false,
  hand_raised boolean default false,
  joined_at timestamptz default now(),
  study_started_at timestamptz default now(),
  unique(room_id, user_id)
);

-- 3. Room Messages Table (Chat Persistence)
create table if not exists public.room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  user_avatar text default 'AC',
  message text not null,
  created_at timestamptz default now()
);

-- 4. Study Sessions Table (Analytics & History)
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete set null,
  room_name text default 'Community Hall',
  user_id text not null,
  topic text not null,
  goal text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_seconds int default 0,
  created_at timestamptz default now()
);

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================
create index if not exists idx_room_members_room on public.room_members(room_id);
create index if not exists idx_room_members_user on public.room_members(user_id);
create index if not exists idx_room_messages_room_time on public.room_messages(room_id, created_at desc);
create index if not exists idx_study_sessions_user_time on public.study_sessions(user_id, started_at desc);
create index if not exists idx_study_sessions_room_time on public.study_sessions(room_id, started_at desc);

-- =================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.room_messages enable row level security;
alter table public.study_sessions enable row level security;

-- Public read access to rooms
create policy "Allow public read of rooms" on public.rooms for select using (true);
create policy "Allow insert rooms" on public.rooms for insert with check (true);
create policy "Allow update room owners" on public.rooms for update using (true);

-- Room Members policies
create policy "Allow read room members" on public.room_members for select using (true);
create policy "Allow insert room members" on public.room_members for insert with check (true);
create policy "Allow update own member state" on public.room_members for update using (true);
create policy "Allow delete own member state" on public.room_members for delete using (true);

-- Room Messages policies
create policy "Allow read room messages" on public.room_messages for select using (true);
create policy "Allow insert room messages" on public.room_messages for insert with check (true);

-- Study Sessions policies
create policy "Allow read study sessions" on public.study_sessions for select using (true);
create policy "Allow insert study sessions" on public.study_sessions for insert with check (true);
create policy "Allow update study sessions" on public.study_sessions for update using (true);
