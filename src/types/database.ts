// Typed shapes mirroring supabase/migrations/0001_init.sql.
// Hand-maintained for now; regenerate via `supabase gen types typescript` after schema changes.

export type GoalCategory =
  | "financial"
  | "career"
  | "relationship"
  | "learning"
  | "fitness"
  | "social"
  | "business"
  | "monthly"
  | "vision"
  | "dream";

export type GoalStatus = "active" | "paused" | "completed" | "abandoned";

export type HabitKind = "positive" | "negative";

export type MessageRole = "user" | "assistant" | "system";

export type InsightScope = "daily" | "weekly" | "monthly" | "onboarding";

export interface Profile {
  id: string;
  name: string | null;
  age: number | null;
  country: string | null;
  occupation: string | null;
  timezone: string | null;
  vision: string | null;
  persona_goal: string | null;
  main_goals: string | null;
  struggles: string | null;
  satisfaction: number | null;
  stress: number | null;
  discipline: number | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Scores {
  user_id: string;
  productivity: number;
  discipline: number;
  lifestyle: number;
  stress_index: number;
  balance: number;
  energy: number;
  focus: number;
  burnout_risk: number;
  computed_at: string;
}

export interface RoutineProfile {
  user_id: string;
  wake_time: string | null;
  sleep_time: string | null;
  morning_routine: string | null;
  work_schedule: string | null;
  exercise_habits: string | null;
  screen_time_hours: number | null;
  social_media_hours: number | null;
  meal_timing: string | null;
  water_liters: number | null;
  break_habits: string | null;
  focus_minutes: number | null;
  peak_hours: string | null;
  distractions: string | null;
  wasted_minutes: number | null;
  current_habits: string | null;
  updated_at: string;
}

export interface HealthProfile {
  user_id: string;
  sleep_quality: number | null;
  exercise_freq_per_week: number | null;
  fitness_goals: string | null;
  water_liters: number | null;
  diet_quality: number | null;
  caffeine_mg: number | null;
  mental_state: number | null;
  stress_triggers: string | null;
  energy_crashes: string | null;
  medical_limits: string | null;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  category: GoalCategory;
  title: string;
  description: string | null;
  target_date: string | null;
  priority: number;
  status: GoalStatus;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  kind: HabitKind;
  icon: string | null;
  color: string;
  target: number;
  target_unit: string;
  sort_order: number;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  log_date: string;
  value: number;
  completed: boolean;
  note: string | null;
  created_at: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  check_date: string;
  wake_time: string | null;
  sleep_hours: number | null;
  mood: number | null;
  energy: number | null;
  main_goal: string | null;
  workout: boolean;
  deep_work: boolean;
  biggest_distraction: string | null;
  productivity_rating: number | null;
  wins: string | null;
  failures: string | null;
  tomorrow_focus: string | null;
  daily_score: number | null;
  ai_summary: string | null;
  created_at: string;
}

export interface CoachMessage {
  id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  tokens_in: number | null;
  tokens_out: number | null;
  created_at: string;
}

export interface Insight {
  id: string;
  user_id: string;
  scope: InsightScope;
  period_start: string;
  period_end: string | null;
  payload: { markdown?: string; [key: string]: unknown };
  model: string | null;
  created_at: string;
}
