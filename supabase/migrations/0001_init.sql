-- LIFE OS PRIME — initial schema
-- All tables have RLS enabled. Auth is via Supabase Auth (auth.users).

create extension if not exists "pgcrypto";

-------------------------------------------------------------------------------
-- profiles
-------------------------------------------------------------------------------
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
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

alter table public.profiles enable row level security;
create policy "profiles self select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-------------------------------------------------------------------------------
-- scores
-------------------------------------------------------------------------------
create table public.scores (
  user_id          uuid primary key references auth.users(id) on delete cascade,
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
alter table public.scores enable row level security;
create policy "scores self" on public.scores for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- routine_profile
-------------------------------------------------------------------------------
create table public.routine_profile (
  user_id              uuid primary key references auth.users(id) on delete cascade,
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
alter table public.routine_profile enable row level security;
create policy "routine self" on public.routine_profile for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- health_profile
-------------------------------------------------------------------------------
create table public.health_profile (
  user_id                  uuid primary key references auth.users(id) on delete cascade,
  sleep_quality            int check (sleep_quality between 1 and 10),
  exercise_freq_per_week   int,
  fitness_goals            text,
  water_liters             numeric,
  diet_quality             int check (diet_quality between 1 and 10),
  caffeine_mg              int,
  mental_state             int check (mental_state between 1 and 10),
  stress_triggers          text,
  energy_crashes           text,
  medical_limits           text,
  updated_at               timestamptz not null default now()
);
alter table public.health_profile enable row level security;
create policy "health self" on public.health_profile for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- goals
-------------------------------------------------------------------------------
create type goal_category as enum (
  'financial','career','relationship','learning','fitness',
  'social','business','monthly','vision','dream'
);
create type goal_status as enum ('active','paused','completed','abandoned');

create table public.goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category      goal_category not null,
  title         text not null,
  description   text,
  target_date   date,
  priority      int default 3 check (priority between 1 and 5),
  status        goal_status default 'active',
  progress      int default 0 check (progress between 0 and 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index goals_user_idx on public.goals(user_id, status, priority desc);
alter table public.goals enable row level security;
create policy "goals self" on public.goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- habits
-------------------------------------------------------------------------------
create type habit_kind as enum ('positive','negative');

create table public.habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
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
alter table public.habits enable row level security;
create policy "habits self" on public.habits for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- habit_logs
-------------------------------------------------------------------------------
create table public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  log_date    date not null,
  value       int default 1,
  completed   boolean default true,
  note        text,
  created_at  timestamptz not null default now(),
  unique(habit_id, log_date)
);
create index habit_logs_user_idx on public.habit_logs(user_id, log_date desc);
alter table public.habit_logs enable row level security;
create policy "habit_logs self" on public.habit_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- daily_checkins
-------------------------------------------------------------------------------
create table public.daily_checkins (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  check_date            date not null,
  wake_time             time,
  sleep_hours           numeric,
  mood                  int check (mood between 1 and 10),
  energy                int check (energy between 1 and 10),
  main_goal             text,
  workout               boolean default false,
  deep_work             boolean default false,
  biggest_distraction   text,
  productivity_rating   int check (productivity_rating between 1 and 10),
  wins                  text,
  failures              text,
  tomorrow_focus        text,
  daily_score           int,
  ai_summary            text,
  created_at            timestamptz not null default now(),
  unique(user_id, check_date)
);
create index checkins_user_date_idx on public.daily_checkins(user_id, check_date desc);
alter table public.daily_checkins enable row level security;
create policy "checkins self" on public.daily_checkins for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- coach_messages
-------------------------------------------------------------------------------
create type message_role as enum ('user','assistant','system');

create table public.coach_messages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         message_role not null,
  content      text not null,
  tokens_in    int,
  tokens_out   int,
  created_at   timestamptz not null default now()
);
create index coach_msgs_user_idx on public.coach_messages(user_id, created_at);
alter table public.coach_messages enable row level security;
create policy "coach_messages self" on public.coach_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- insights (cached AI-generated reports)
-------------------------------------------------------------------------------
create type insight_scope as enum ('daily','weekly','monthly','onboarding');

create table public.insights (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  scope         insight_scope not null,
  period_start  date not null,
  period_end    date,
  payload       jsonb not null,
  model         text,
  created_at    timestamptz not null default now()
);
create index insights_user_scope_idx on public.insights(user_id, scope, period_start desc);
alter table public.insights enable row level security;
create policy "insights self" on public.insights for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- Seed default habits on first profile creation
-------------------------------------------------------------------------------
create or replace function public.seed_default_habits()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- only seed when transitioning into onboarded state
  if new.onboarded_at is not null and (old.onboarded_at is null) then
    insert into public.habits (user_id, name, kind, icon, color, sort_order) values
      (new.id, 'Wake up on time',           'positive', 'sunrise',     'amber',   1),
      (new.id, 'Deep work completed',       'positive', 'brain',       'cyan',    2),
      (new.id, 'Workout done',              'positive', 'dumbbell',    'emerald', 3),
      (new.id, 'Reading done',              'positive', 'book-open',   'violet',  4),
      (new.id, 'Healthy eating',            'positive', 'apple',       'emerald', 5),
      (new.id, 'Water target',              'positive', 'droplets',    'cyan',    6),
      (new.id, 'Meditation',                'positive', 'sparkles',    'violet',  7),
      (new.id, 'No procrastination',        'negative', 'shield',      'gold',    8),
      (new.id, 'No excessive social media', 'negative', 'phone-off',   'rose',    9),
      (new.id, 'Sleep target achieved',     'positive', 'moon',        'cyan',   10);
  end if;
  return new;
end; $$;

drop trigger if exists on_profile_onboarded on public.profiles;
create trigger on_profile_onboarded
  after update on public.profiles
  for each row execute function public.seed_default_habits();
