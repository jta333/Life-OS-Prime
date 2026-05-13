// Unified data access layer for single-user LIFE OS PRIME.
// Falls back to demo data when Supabase isn't configured.

import { SINGLE_USER_ID } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  DEMO_PROFILE,
  DEMO_SCORES,
  DEMO_ROUTINE,
  DEMO_HABITS,
  buildDemoHabitLogs,
  DEMO_INSIGHTS,
} from "@/lib/demo-data";
import type {
  Habit,
  HabitLog,
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
  habits: Habit[];
  habitLogs: HabitLog[];
  insights: Insight[];
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!isSupabaseConfigured()) {
    return demoSnapshot();
  }

  try {
    const supabase = createClient();
    const [
      { data: profile },
      { data: scores },
      { data: routine },
      { data: habits },
      { data: habitLogs },
      { data: insights },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", SINGLE_USER_ID).single(),
      supabase.from("scores").select("*").eq("user_id", SINGLE_USER_ID).maybeSingle(),
      supabase.from("routine_profile").select("*").eq("user_id", SINGLE_USER_ID).maybeSingle(),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", SINGLE_USER_ID)
        .eq("archived", false)
        .order("sort_order", { ascending: true }),
      supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", SINGLE_USER_ID)
        .order("log_date", { ascending: false })
        .limit(900),
      supabase
        .from("insights")
        .select("*")
        .eq("user_id", SINGLE_USER_ID)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (!profile) return demoSnapshot();

    return {
      isDemo: false,
      profile: profile as Profile,
      scores: (scores as Scores) ?? { ...DEMO_SCORES, user_id: SINGLE_USER_ID },
      routine: (routine as RoutineProfile) ?? null,
      habits: (habits as Habit[]) ?? [],
      habitLogs: (habitLogs as HabitLog[]) ?? [],
      insights: (insights as Insight[]) ?? [],
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
    habits: DEMO_HABITS,
    habitLogs: buildDemoHabitLogs(84),
    insights: DEMO_INSIGHTS,
  };
}
