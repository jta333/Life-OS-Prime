-- LIFE OS PRIME — single-user schema.
-- No auth dependency. The app references a single hardcoded user_id
-- defined in src/lib/constants.ts (SINGLE_USER_ID).
--
-- This migration is for self-hosted use. Run it once in your Supabase
-- project (SQL editor or `supabase db push`). No RLS is enabled —
-- this is a private single-user dashboard. Lock down access via the
-- service-role key, network rules, or by keeping the project private.

create extension if not exists "pgcrypto";

-------------------------------------------------------------------------------
-- profiles
-------------------------------------------------------------------------------
create table public.profiles (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  age             int,
  country         text,
  occupation      text,
  timezone        text default 'UTC',
  vision          text,
  persona_goal    text,
  main_goals      text,
  struggles       text,
  satisfaction    int check (satisfaction between 1 and 10),
  stress          int check (stress between 1 and 10),
  discipline      int check (discipline between 1 and 10),
  onboarded_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-------------------------------------------------------------------------------
-- scores
-------------------------------------------------------------------------------
create table public.scores (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  productivity     int default 0,
  discipline       int default 0,
  lifestyle        int default 0,
  stress_index     int default 0,
  balance          int default 0,
  energy           int default 0,
  focus            int default 0,
  burnout_risk     int default 0,
  computed_at      timestamptz not null default now()
);

-------------------------------------------------------------------------------
-- routine_profile
-------------------------------------------------------------------------------
create table public.routine_profile (
  user_id              uuid primary key references public.profiles(id) on delete cascade,
  wake_time            time,
  sleep_time           time,
  morning_routine      text,
  work_schedule        text,
  exercise_habits      text,
  screen_time_hours    numeric,
  social_media_hours   numeric,
  meal_timing          text,
  water_liters         numeric,
  break_habits         text,
  focus_minutes        int,
  peak_hours           text,
  distractions         text,
  wasted_minutes       int,
  current_habits       text,
  updated_at           timestamptz not null default now()
);

-------------------------------------------------------------------------------
-- habits
-------------------------------------------------------------------------------
create type habit_kind as enum ('positive','negative');

create table public.habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  kind         habit_kind default 'positive',
  icon         text,
  color        text default 'gold',
  target       int default 1,
  target_unit  text default 'check',
  sort_order   int default 0,
  archived     boolean default false,
  created_at   timestamptz not null default now()
);
create index habits_user_idx on public.habits(user_id, sort_order);

-------------------------------------------------------------------------------
-- habit_logs
-------------------------------------------------------------------------------
create table public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  log_date    date not null,
  value       int default 1,
  completed   boolean default true,
  note        text,
  created_at  timestamptz not null default now(),
  unique(habit_id, log_date)
);
create index habit_logs_user_idx on public.habit_logs(user_id, log_date desc);

-------------------------------------------------------------------------------
-- insights (cached AI-generated Life Status Overview, etc.)
-------------------------------------------------------------------------------
create type insight_scope as enum ('onboarding','daily','weekly','monthly');

create table public.insights (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  scope         insight_scope not null,
  period_start  date not null,
  period_end    date,
  payload       jsonb not null,
  model         text,
  created_at    timestamptz not null default now()
);
create index insights_user_scope_idx on public.insights(user_id, scope, created_at desc);

-------------------------------------------------------------------------------
-- Seed the single user row with the fixed SINGLE_USER_ID and 10 default habits
-------------------------------------------------------------------------------
insert into public.profiles (id) values ('00000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into public.habits (user_id, name, kind, icon, color, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'Wake up on time',           'positive', 'sunrise',     'amber',   1),
  ('00000000-0000-0000-0000-000000000001', 'Deep work completed',       'positive', 'brain',       'cyan',    2),
  ('00000000-0000-0000-0000-000000000001', 'Workout done',              'positive', 'dumbbell',    'emerald', 3),
  ('00000000-0000-0000-0000-000000000001', 'Reading done',              'positive', 'book-open',   'violet',  4),
  ('00000000-0000-0000-0000-000000000001', 'Healthy eating',            'positive', 'apple',       'emerald', 5),
  ('00000000-0000-0000-0000-000000000001', 'Water target',              'positive', 'droplets',    'cyan',    6),
  ('00000000-0000-0000-0000-000000000001', 'Meditation',                'positive', 'sparkles',    'violet',  7),
  ('00000000-0000-0000-0000-000000000001', 'No procrastination',        'negative', 'shield',      'gold',    8),
  ('00000000-0000-0000-0000-000000000001', 'No excessive social media', 'negative', 'phone-off',   'rose',    9),
  ('00000000-0000-0000-0000-000000000001', 'Sleep target achieved',     'positive', 'moon',       'cyan',   10)
on conflict do nothing;
