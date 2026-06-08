// Realistic demo data used when Supabase is not configured.
// Lets the app render an interactive preview without any backend.

import { format, subDays } from "date-fns";
import type {
  CoachMessage,
  DailyCheckIn,
  Goal,
  Habit,
  HabitLog,
  HealthProfile,
  Insight,
  Profile,
  RoutineProfile,
  Scores,
} from "@/types/database";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
const today = new Date();

export const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  name: "Alex Mercer",
  age: 29,
  country: "United States",
  occupation: "Senior Engineer at a fintech startup",
  timezone: "America/Los_Angeles",
  vision:
    "Become an elite full-stack operator who launches a profitable product within 18 months while staying at peak physical and mental performance.",
  persona_goal:
    "Calm, disciplined, deep-working version of myself, early mornings, focused mid-days, recovery in the evenings.",
  main_goals:
    "Ship a SaaS side project, hit a sub-3:30 marathon, build a $50k emergency fund.",
  struggles: "Inconsistent mornings, evening doomscrolling, sporadic deep work.",
  satisfaction: 6,
  stress: 7,
  discipline: 6,
  onboarded_at: subDays(today, 21).toISOString(),
  created_at: subDays(today, 25).toISOString(),
  updated_at: today.toISOString(),
};

export const DEMO_SCORES: Scores = {
  user_id: DEMO_USER_ID,
  productivity: 78,
  discipline: 71,
  lifestyle: 64,
  stress_index: 52,
  balance: 73,
  energy: 76,
  focus: 69,
  burnout_risk: 38,
  computed_at: today.toISOString(),
};

export const DEMO_ROUTINE: RoutineProfile = {
  user_id: DEMO_USER_ID,
  wake_time: "06:00",
  sleep_time: "23:00",
  morning_routine: "Cold shower, 10-min meditation, espresso, 30-min reading",
  work_schedule: "9:00-18:00 with two 90-min deep work blocks",
  exercise_habits: "Strength 3×/week, Zone 2 run 2×/week",
  screen_time_hours: 5.5,
  social_media_hours: 1.2,
  meal_timing: "Breakfast 7:30, Lunch 12:30, Dinner 19:00",
  water_liters: 2.5,
  break_habits: "Pomodoro 90/15, short walks between blocks",
  focus_minutes: 180,
  peak_hours: "08:00-11:00, 15:00-17:00",
  distractions: "Slack, X, news sites",
  wasted_minutes: 75,
  current_habits:
    "Daily reading, morning meditation, journaling 4×/week, gym 3×/week",
  updated_at: today.toISOString(),
};

export const DEMO_HEALTH: HealthProfile = {
  user_id: DEMO_USER_ID,
  sleep_quality: 7,
  exercise_freq_per_week: 5,
  fitness_goals: "Sub-3:30 marathon, 5×5 bodyweight squat at 1.5×bodyweight",
  water_liters: 2.5,
  diet_quality: 7,
  caffeine_mg: 200,
  mental_state: 7,
  stress_triggers: "Tight deadlines, social media before bed, weekend planning gaps",
  energy_crashes: "Post-lunch slump around 14:00",
  medical_limits: "None significant; mild patellar tendonitis on right knee",
  updated_at: today.toISOString(),
};

export const DEMO_GOALS: Goal[] = [
  {
    id: "g1",
    user_id: DEMO_USER_ID,
    category: "business",
    title: "Launch SaaS MVP",
    description: "Ship a paid v1 to 25 early customers.",
    target_date: format(subDays(today, -120), "yyyy-MM-dd"),
    priority: 1,
    status: "active",
    progress: 42,
    created_at: subDays(today, 60).toISOString(),
    updated_at: today.toISOString(),
  },
  {
    id: "g2",
    user_id: DEMO_USER_ID,
    category: "fitness",
    title: "Sub-3:30 marathon",
    description: "Train through 16-week block, race in spring.",
    target_date: format(subDays(today, -180), "yyyy-MM-dd"),
    priority: 2,
    status: "active",
    progress: 28,
    created_at: subDays(today, 45).toISOString(),
    updated_at: today.toISOString(),
  },
  {
    id: "g3",
    user_id: DEMO_USER_ID,
    category: "financial",
    title: "Build $50k emergency fund",
    description: "Automated $2.5k/month to high-yield savings.",
    target_date: format(subDays(today, -300), "yyyy-MM-dd"),
    priority: 2,
    status: "active",
    progress: 55,
    created_at: subDays(today, 100).toISOString(),
    updated_at: today.toISOString(),
  },
  {
    id: "g4",
    user_id: DEMO_USER_ID,
    category: "learning",
    title: "Read 24 books this year",
    description: "Mix of fiction, business, and systems thinking.",
    target_date: format(subDays(today, -270), "yyyy-MM-dd"),
    priority: 3,
    status: "active",
    progress: 33,
    created_at: subDays(today, 30).toISOString(),
    updated_at: today.toISOString(),
  },
  {
    id: "g5",
    user_id: DEMO_USER_ID,
    category: "relationship",
    title: "Weekly date nights",
    description: "Protect a fixed evening every week.",
    target_date: null,
    priority: 3,
    status: "active",
    progress: 70,
    created_at: subDays(today, 30).toISOString(),
    updated_at: today.toISOString(),
  },
  {
    id: "g6",
    user_id: DEMO_USER_ID,
    category: "vision",
    title: "Sovereign operator by 32",
    description: "Run own profitable company, optimal health, deep relationships.",
    target_date: null,
    priority: 1,
    status: "active",
    progress: 22,
    created_at: subDays(today, 90).toISOString(),
    updated_at: today.toISOString(),
  },
];

export const DEMO_HABITS: Habit[] = [
  { id: "h1",  user_id: DEMO_USER_ID, name: "Wake up on time",           kind: "positive", icon: "sunrise",   color: "amber",   target: 1, target_unit: "check", sort_order: 1,  archived: false, created_at: today.toISOString() },
  { id: "h2",  user_id: DEMO_USER_ID, name: "Deep work completed",       kind: "positive", icon: "brain",     color: "cyan",    target: 1, target_unit: "check", sort_order: 2,  archived: false, created_at: today.toISOString() },
  { id: "h3",  user_id: DEMO_USER_ID, name: "Workout done",              kind: "positive", icon: "dumbbell",  color: "emerald", target: 1, target_unit: "check", sort_order: 3,  archived: false, created_at: today.toISOString() },
  { id: "h4",  user_id: DEMO_USER_ID, name: "Reading done",              kind: "positive", icon: "book-open", color: "violet",  target: 1, target_unit: "check", sort_order: 4,  archived: false, created_at: today.toISOString() },
  { id: "h5",  user_id: DEMO_USER_ID, name: "Healthy eating",            kind: "positive", icon: "apple",     color: "emerald", target: 1, target_unit: "check", sort_order: 5,  archived: false, created_at: today.toISOString() },
  { id: "h6",  user_id: DEMO_USER_ID, name: "Water target",              kind: "positive", icon: "droplets",  color: "cyan",    target: 1, target_unit: "check", sort_order: 6,  archived: false, created_at: today.toISOString() },
  { id: "h7",  user_id: DEMO_USER_ID, name: "Meditation",                kind: "positive", icon: "sparkles",  color: "violet",  target: 1, target_unit: "check", sort_order: 7,  archived: false, created_at: today.toISOString() },
  { id: "h8",  user_id: DEMO_USER_ID, name: "No procrastination",        kind: "negative", icon: "shield",    color: "gold",    target: 1, target_unit: "check", sort_order: 8,  archived: false, created_at: today.toISOString() },
  { id: "h9",  user_id: DEMO_USER_ID, name: "No excessive social media", kind: "negative", icon: "phone-off", color: "rose",    target: 1, target_unit: "check", sort_order: 9,  archived: false, created_at: today.toISOString() },
  { id: "h10", user_id: DEMO_USER_ID, name: "Sleep target achieved",     kind: "positive", icon: "moon",      color: "cyan",    target: 1, target_unit: "check", sort_order: 10, archived: false, created_at: today.toISOString() },
];

// Deterministic pseudo-random for demo logs so each day looks consistent
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildDemoHabitLogs(days = 84): HabitLog[] {
  const logs: HabitLog[] = [];
  for (let d = 0; d < days; d++) {
    const date = format(subDays(today, d), "yyyy-MM-dd");
    DEMO_HABITS.forEach((habit, i) => {
      const r = rng(d * 11 + i * 7)();
      // older days less consistent, newer more
      const baseline = 0.55 + (1 - d / days) * 0.3;
      const completed = r < baseline;
      if (completed || r < baseline + 0.08) {
        logs.push({
          id: `${habit.id}-${d}`,
          user_id: DEMO_USER_ID,
          habit_id: habit.id,
          log_date: date,
          value: completed ? 1 : 0,
          completed,
          note: null,
          created_at: subDays(today, d).toISOString(),
        });
      }
    });
  }
  return logs;
}

export function buildDemoCheckIns(days = 14): DailyCheckIn[] {
  const out: DailyCheckIn[] = [];
  for (let d = 0; d < days; d++) {
    const r = rng(d * 17)();
    out.push({
      id: `c-${d}`,
      user_id: DEMO_USER_ID,
      check_date: format(subDays(today, d), "yyyy-MM-dd"),
      wake_time: ["05:45", "06:00", "06:15", "06:30", "07:00"][d % 5]!,
      sleep_hours: 6.5 + r * 2,
      mood: Math.round(6 + r * 3),
      energy: Math.round(5 + r * 4),
      main_goal: ["Ship onboarding flow", "Run intervals", "Investor email", "Refactor billing", "Date night"][d % 5]!,
      workout: r > 0.35,
      deep_work: r > 0.3,
      biggest_distraction: ["Slack", "Twitter", "News", "Email", "Meetings"][d % 5]!,
      productivity_rating: Math.round(5 + r * 4),
      wins: "Two deep work blocks, hit step goal, no junk food.",
      failures: "Hit phone before bed; light sleep result.",
      tomorrow_focus: "Morning deep work before email.",
      daily_score: Math.round(60 + r * 35),
      ai_summary:
        "Solid execution with one recovery gap, protect morning focus and cap evening screens at 22:30.",
      created_at: subDays(today, d).toISOString(),
    });
  }
  return out;
}

export const DEMO_INSIGHTS: Insight[] = [
  {
    id: "i1",
    user_id: DEMO_USER_ID,
    scope: "weekly",
    period_start: format(subDays(today, 7), "yyyy-MM-dd"),
    period_end: format(today, "yyyy-MM-dd"),
    payload: {
      markdown: `## 📅 Weekly Performance Review

You operated at a **B+ baseline** with strong deep work but slipping evening discipline.

## 📈 Productivity Trend
\`████████░░ 78%\`, up 6 points from last week, driven by two protected mornings.

## 🔥 Habit Consistency
| Habit | Completions | Consistency | Verdict |
|---|---|---|---|
| Deep work | 5/7 | 71% | Strong |
| Workout | 4/7 | 57% | Solid |
| No social media | 3/7 | 43% | Needs work |
| Sleep target | 4/7 | 57% | Solid |

## 🎯 Top 3 Improvements For Next Week
1. **Cap screens at 22:30**, saves 35 min of sleep debt.
2. **Move workout to morning** twice, links exercise to peak energy window.
3. **One-block social media policy**, confine to 13:00-13:20 only.`,
    },
    model: "demo",
    created_at: today.toISOString(),
  },
];

export const DEMO_COACH_HISTORY: CoachMessage[] = [
  {
    id: "m1",
    user_id: DEMO_USER_ID,
    role: "assistant",
    content:
      "Welcome back, Alex. Your discipline trend is up 6 points, protect this momentum. What's the single focus you want to lock in today?",
    tokens_in: null,
    tokens_out: null,
    created_at: subDays(today, 0).toISOString(),
  },
];
