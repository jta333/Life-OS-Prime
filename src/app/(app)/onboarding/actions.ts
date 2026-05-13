"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient, getUser } from "@/lib/supabase/server";
import { computeScores } from "@/lib/scoring";
import type { GoalCategory } from "@/types/database";

interface OnboardingPayload {
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
  sleepQuality: number;
  exerciseFreqPerWeek: string;
  fitnessGoals: string;
  dietQuality: number;
  caffeineMg: string;
  mentalState: number;
  stressTriggers: string;
  energyCrashes: string;
  medicalLimits: string;
  financialGoals: string;
  careerGoals: string;
  relationshipGoals: string;
  learningGoals: string;
  fitnessGoals2: string;
  socialGoals: string;
  businessGoals: string;
  monthlyTargets: string;
  vision: string;
  dreams: string;
}

export async function saveOnboarding(
  payload: OnboardingPayload
): Promise<{ ok: boolean; demo?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, demo: true };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. Profile
  const { error: profileErr } = await supabase.from("profiles").upsert({
    id: user.id,
    name: payload.name,
    age: payload.age ? Number(payload.age) : null,
    country: payload.country,
    occupation: payload.occupation,
    main_goals: payload.mainGoals,
    struggles: payload.struggles,
    persona_goal: payload.personaGoal,
    vision: payload.vision,
    satisfaction: payload.satisfaction,
    stress: payload.stress,
    discipline: payload.discipline,
    onboarded_at: now,
    updated_at: now,
  });
  if (profileErr) return { ok: false, error: profileErr.message };

  // 2. Routine profile
  await supabase.from("routine_profile").upsert({
    user_id: user.id,
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

  // 3. Health profile
  await supabase.from("health_profile").upsert({
    user_id: user.id,
    sleep_quality: payload.sleepQuality,
    exercise_freq_per_week: numOrNull(payload.exerciseFreqPerWeek),
    fitness_goals: payload.fitnessGoals,
    water_liters: numOrNull(payload.waterLiters),
    diet_quality: payload.dietQuality,
    caffeine_mg: numOrNull(payload.caffeineMg),
    mental_state: payload.mentalState,
    stress_triggers: payload.stressTriggers,
    energy_crashes: payload.energyCrashes,
    medical_limits: payload.medicalLimits,
    updated_at: now,
  });

  // 4. Goals
  const goalEntries: { category: GoalCategory; title: string }[] = (
    [
      { category: "financial",    title: payload.financialGoals },
      { category: "career",       title: payload.careerGoals },
      { category: "relationship", title: payload.relationshipGoals },
      { category: "learning",     title: payload.learningGoals },
      { category: "fitness",      title: payload.fitnessGoals2 },
      { category: "social",       title: payload.socialGoals },
      { category: "business",     title: payload.businessGoals },
      { category: "monthly",      title: payload.monthlyTargets },
      { category: "vision",       title: payload.vision },
      { category: "dream",        title: payload.dreams },
    ] satisfies { category: GoalCategory; title: string }[]
  ).filter((g) => g.title.trim().length > 0);

  if (goalEntries.length) {
    await supabase.from("goals").insert(
      goalEntries.map((g) => ({
        user_id: user.id,
        category: g.category,
        title: g.title.slice(0, 200),
        description: g.title.length > 200 ? g.title : null,
        priority: 3,
        status: "active" as const,
        progress: 0,
      }))
    );
  }

  // 5. Compute and persist scores
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
    exerciseFreqPerWeek: numOrNull(payload.exerciseFreqPerWeek) ?? 0,
    sleepQuality: payload.sleepQuality,
    dietQuality: payload.dietQuality,
    mentalState: payload.mentalState,
    waterLiters: numOrNull(payload.waterLiters) ?? 1,
  });

  await supabase.from("scores").upsert({
    user_id: user.id,
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

  revalidatePath("/dashboard");
  return { ok: true };
}

function numOrNull(v: string): number | null {
  if (!v || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
