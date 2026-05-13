// Realistic demo data used when Supabase is not configured.
// Lets the app render an interactive preview without any backend.

import { format, subDays } from "date-fns";
import { SINGLE_USER_ID } from "@/lib/constants";
import type {
  Habit,
  HabitLog,
  Insight,
  Profile,
  RoutineProfile,
  Scores,
} from "@/types/database";

const today = new Date();

export const DEMO_PROFILE: Profile = {
  id: SINGLE_USER_ID,
  name: "Alex Mercer",
  age: 29,
  country: "United States",
  occupation: "Senior Engineer at a fintech startup",
  timezone: "America/Los_Angeles",
  vision:
    "Become an elite full-stack operator who launches a profitable product within 18 months while staying at peak physical and mental performance.",
  persona_goal:
    "Calm, disciplined, deep-working version of myself — early mornings, focused mid-days, recovery in the evenings.",
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
  user_id: SINGLE_USER_ID,
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
  user_id: SINGLE_USER_ID,
  wake_time: "06:00",
  sleep_time: "23:00",
  morning_routine: "Cold shower, 10-min meditation, espresso, 30-min reading",
  work_schedule: "9:00–18:00 with two 90-min deep work blocks",
  exercise_habits: "Strength 3×/week, Zone 2 run 2×/week",
  screen_time_hours: 5.5,
  social_media_hours: 1.2,
  meal_timing: "Breakfast 7:30, Lunch 12:30, Dinner 19:00",
  water_liters: 2.5,
  break_habits: "Pomodoro 90/15, short walks between blocks",
  focus_minutes: 180,
  peak_hours: "08:00–11:00, 15:00–17:00",
  distractions: "Slack, X, news sites",
  wasted_minutes: 75,
  current_habits:
    "Daily reading, morning meditation, journaling 4×/week, gym 3×/week",
  updated_at: today.toISOString(),
};

export const DEMO_HABITS: Habit[] = [
  { id: "h1",  user_id: SINGLE_USER_ID, name: "Wake up on time",           kind: "positive", icon: "sunrise",   color: "amber",   target: 1, target_unit: "check", sort_order: 1,  archived: false, created_at: today.toISOString() },
  { id: "h2",  user_id: SINGLE_USER_ID, name: "Deep work completed",       kind: "positive", icon: "brain",     color: "cyan",    target: 1, target_unit: "check", sort_order: 2,  archived: false, created_at: today.toISOString() },
  { id: "h3",  user_id: SINGLE_USER_ID, name: "Workout done",              kind: "positive", icon: "dumbbell",  color: "emerald", target: 1, target_unit: "check", sort_order: 3,  archived: false, created_at: today.toISOString() },
  { id: "h4",  user_id: SINGLE_USER_ID, name: "Reading done",              kind: "positive", icon: "book-open", color: "violet",  target: 1, target_unit: "check", sort_order: 4,  archived: false, created_at: today.toISOString() },
  { id: "h5",  user_id: SINGLE_USER_ID, name: "Healthy eating",            kind: "positive", icon: "apple",     color: "emerald", target: 1, target_unit: "check", sort_order: 5,  archived: false, created_at: today.toISOString() },
  { id: "h6",  user_id: SINGLE_USER_ID, name: "Water target",              kind: "positive", icon: "droplets",  color: "cyan",    target: 1, target_unit: "check", sort_order: 6,  archived: false, created_at: today.toISOString() },
  { id: "h7",  user_id: SINGLE_USER_ID, name: "Meditation",                kind: "positive", icon: "sparkles",  color: "violet",  target: 1, target_unit: "check", sort_order: 7,  archived: false, created_at: today.toISOString() },
  { id: "h8",  user_id: SINGLE_USER_ID, name: "No procrastination",        kind: "negative", icon: "shield",    color: "gold",    target: 1, target_unit: "check", sort_order: 8,  archived: false, created_at: today.toISOString() },
  { id: "h9",  user_id: SINGLE_USER_ID, name: "No excessive social media", kind: "negative", icon: "phone-off", color: "rose",    target: 1, target_unit: "check", sort_order: 9,  archived: false, created_at: today.toISOString() },
  { id: "h10", user_id: SINGLE_USER_ID, name: "Sleep target achieved",     kind: "positive", icon: "moon",      color: "cyan",    target: 1, target_unit: "check", sort_order: 10, archived: false, created_at: today.toISOString() },
];

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
          user_id: SINGLE_USER_ID,
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

export const DEMO_INSIGHTS: Insight[] = [
  {
    id: "i1",
    user_id: SINGLE_USER_ID,
    scope: "onboarding",
    period_start: format(subDays(today, 21), "yyyy-MM-dd"),
    period_end: null,
    payload: {
      markdown: `## 🌅 Life Status Overview

You're operating at a **high-tier baseline** — a solid 73 Balance score with clear leverage points around evening discipline and energy recovery.

## 📊 Performance Snapshot
| Score | Bar | Verdict |
|---|---|---|
| Productivity 78 | \`████████░░\` | Strong, room to compound |
| Discipline 71 | \`███████░░░\` | Solid baseline |
| Lifestyle 64 | \`██████░░░░\` | Needs sleep + nutrition lift |
| Stress Index 52 | \`█████░░░░░\` | Manageable, monitor weekly |
| Balance 73 | \`███████░░░\` | High tier |

## 🔍 Initial Observations
- Morning structure is intact — keep protecting the 06:00–10:30 window.
- Evening screen time + light sleep are the dominant tax on tomorrow's energy.
- Strength + Zone-2 mix is well calibrated for the marathon goal.

## ⚠️ Potential Risks
- **Med** — Late phone use erodes 30–45 min of sleep quality nightly.
- **Med** — Slack + X account for the 75 min daily waste; consolidate to one window.
- **Low** — Right-knee tendonitis: monitor mileage progression.

## 🚀 Improvement Potential
- **+5 to Balance** — Phone in another room post-22:00 (8h sleep target).
- **+7 to Focus** — Two no-Slack 90-min deep work windows daily.
- **+4 to Lifestyle** — Move workout to morning twice a week, link to peak energy.`,
    },
    model: "demo",
    created_at: today.toISOString(),
  },
];
