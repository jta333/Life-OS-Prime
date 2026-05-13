// Unified data access layer.
// Falls back to demo data when Supabase isn't configured so the app
// renders out-of-the-box for previews.

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient, getUser } from "@/lib/supabase/server";
import {
  DEMO_PROFILE,
  DEMO_SCORES,
  DEMO_ROUTINE,
  DEMO_HEALTH,
  DEMO_GOALS,
  DEMO_HABITS,
  buildDemoHabitLogs,
  buildDemoCheckIns,
  DEMO_INSIGHTS,
  DEMO_COACH_HISTORY,
} from "@/lib/demo-data";
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

export interface DashboardSnapshot {
  isDemo: boolean;
  profile: Profile;
  scores: Scores;
  routine: RoutineProfile | null;
  health: HealthProfile | null;
  goals: Goal[];
  habits: Habit[];
  habitLogs: HabitLog[];
  checkins: DailyCheckIn[];
  insights: Insight[];
  coachHistory: CoachMessage[];
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!isSupabaseConfigured()) {
    return demoSnapshot();
  }

  try {
    const user = await getUser();
    if (!user) return demoSnapshot();

    const supabase = await createClient();
    const [
      { data: profile },
      { data: scores },
      { data: routine },
      { data: health },
      { data: goals },
      { data: habits },
      { data: habitLogs },
      { data: checkins },
      { data: insights },
      { data: coachHistory },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("scores").select("*").eq("user_id", user.id).single(),
      supabase.from("routine_profile").select("*").eq("user_id", user.id).single(),
      supabase.from("health_profile").select("*").eq("user_id", user.id).single(),
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true }),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("sort_order", { ascending: true }),
      supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false })
        .limit(900),
      supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .order("check_date", { ascending: false })
        .limit(30),
      supabase
        .from("insights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("coach_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(50),
    ]);

    if (!profile) return demoSnapshot();

    return {
      isDemo: false,
      profile: profile as Profile,
      scores: (scores as Scores) ?? { ...DEMO_SCORES, user_id: user.id },
      routine: (routine as RoutineProfile) ?? null,
      health: (health as HealthProfile) ?? null,
      goals: (goals as Goal[]) ?? [],
      habits: (habits as Habit[]) ?? [],
      habitLogs: (habitLogs as HabitLog[]) ?? [],
      checkins: (checkins as DailyCheckIn[]) ?? [],
      insights: (insights as Insight[]) ?? [],
      coachHistory: (coachHistory as CoachMessage[]) ?? [],
    };
  } catch {
    return demoSnapshot();
  }
}

function demoSnapshot(): DashboardSnapshot {
  return {
    isDemo: true,
    profile: DEMO_PROFILE,
    scores: DEMO_SCORES,
    routine: DEMO_ROUTINE,
    health: DEMO_HEALTH,
    goals: DEMO_GOALS,
    habits: DEMO_HABITS,
    habitLogs: buildDemoHabitLogs(84),
    checkins: buildDemoCheckIns(14),
    insights: DEMO_INSIGHTS,
    coachHistory: DEMO_COACH_HISTORY,
  };
}
