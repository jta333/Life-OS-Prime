"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { SINGLE_USER_ID } from "@/lib/constants";
import { computeScores } from "@/lib/scoring";

export interface OnboardingPayload {
  name: string;
  age: string;
  country: string;
  occupation: string;
  mainGoals: string;
  struggles: string;
  personaGoal: string;
  satisfaction: number;
  stress: number;
  discipline: number;
  wakeTime: string;
  sleepTime: string;
  morningRoutine: string;
  workSchedule: string;
  exerciseHabits: string;
  screenTimeHours: string;
  socialMediaHours: string;
  mealTiming: string;
  waterLiters: string;
  breakHabits: string;
  focusMinutes: string;
  peakHours: string;
  distractions: string;
  wastedMinutes: string;
  currentHabits: string;
}

export async function saveOnboarding(
  payload: OnboardingPayload
): Promise<{ ok: boolean; demo?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, demo: true };
  }

  const supabase = createClient();
  const now = new Date().toISOString();

  const { error: profileErr } = await supabase
    .from("profiles")
    .upsert({
      id: SINGLE_USER_ID,
      name: payload.name,
      age: payload.age ? Number(payload.age) : null,
      country: payload.country,
      occupation: payload.occupation,
      main_goals: payload.mainGoals,
      struggles: payload.struggles,
      persona_goal: payload.personaGoal,
      satisfaction: payload.satisfaction,
      stress: payload.stress,
      discipline: payload.discipline,
      onboarded_at: now,
      updated_at: now,
    });
  if (profileErr) return { ok: false, error: profileErr.message };

  await supabase.from("routine_profile").upsert({
    user_id: SINGLE_USER_ID,
    wake_time: payload.wakeTime || null,
    sleep_time: payload.sleepTime || null,
    morning_routine: payload.morningRoutine,
    work_schedule: payload.workSchedule,
    exercise_habits: payload.exerciseHabits,
    screen_time_hours: numOrNull(payload.screenTimeHours),
    social_media_hours: numOrNull(payload.socialMediaHours),
    meal_timing: payload.mealTiming,
    water_liters: numOrNull(payload.waterLiters),
    break_habits: payload.breakHabits,
    focus_minutes: numOrNull(payload.focusMinutes),
    peak_hours: payload.peakHours,
    distractions: payload.distractions,
    wasted_minutes: numOrNull(payload.wastedMinutes),
    current_habits: payload.currentHabits,
    updated_at: now,
  });

  const scores = computeScores({
    satisfaction: payload.satisfaction,
    stress: payload.stress,
    discipline: payload.discipline,
    wakeTime: payload.wakeTime,
    sleepTime: payload.sleepTime,
    screenTimeHours: numOrNull(payload.screenTimeHours) ?? 0,
    socialMediaHours: numOrNull(payload.socialMediaHours) ?? 0,
    focusMinutes: numOrNull(payload.focusMinutes) ?? 60,
    wastedMinutes: numOrNull(payload.wastedMinutes) ?? 60,
  });

  await supabase.from("scores").upsert({
    user_id: SINGLE_USER_ID,
    productivity: scores.productivity,
    discipline: scores.discipline,
    lifestyle: scores.lifestyle,
    stress_index: scores.stressIndex,
    balance: scores.balance,
    energy: scores.energy,
    focus: scores.focus,
    burnout_risk: scores.burnoutRisk,
    computed_at: now,
  });

  // Fire-and-forget Claude-powered Life Status Overview, stored in `insights`.
  if (process.env.ANTHROPIC_API_KEY) {
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/onboarding/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    ).catch(() => {});
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

function numOrNull(v: string): number | null {
  if (!v || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
