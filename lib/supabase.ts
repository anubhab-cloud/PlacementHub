import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = url && anon
  ? createClient(url, anon)
  : null;

// Schema SQL — run this in your Supabase SQL editor once:
export const SCHEMA_SQL = `
-- Users
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  github_id     text unique,
  username      text not null,
  avatar_url    text,
  streak        int  default 0,
  github_pushes int  default 0,
  layout_config jsonb,
  created_at    timestamptz default now()
);

-- Problems
create table if not exists problems (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  topic       text not null,
  difficulty  text check (difficulty in ('Easy','Medium','Hard')),
  platform    text default 'PlacementHub',
  created_at  timestamptz default now()
);

-- Submissions
create table if not exists submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id),
  problem_id  uuid references problems(id),
  code        text not null,
  language    text not null,
  status      text check (status in ('Accepted','Wrong Answer','TLE','CE','RE')),
  github_url  text,
  runtime_ms  real,
  memory_kb   real,
  created_at  timestamptz default now()
);

-- Events
create table if not exists events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id),
  title      text not null,
  company    text,
  event_date date not null,
  type       text,
  created_at timestamptz default now()
);

-- Notes
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subject     text not null,
  semester    int,
  file_url    text,
  note_type   text check (note_type in ('note','pyq','syllabus')),
  uploaded_by uuid references users(id),
  created_at  timestamptz default now()
);
`;
