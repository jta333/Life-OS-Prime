"use server";

import { revalidatePath } from "next/cache";
import { computeDailyScore } from "@/lib/scoring";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface Payload {
  date: string;
  wakeTime: string;
  sleepHours: number;
  mood: number;
  energy: number;
  mainGoal: string;
  workout: boolean;
  deepWork: boolean;
  biggestDistraction: string;
  productivityRating: number;
  wins: string;
  failures: string;
  tomorrowFocus: string;
}

export async function saveCheckIn(p: Payload): Promise<{
  ok: boolean;
  demo?: boolean;
  score: number;
  error?: string;
}> {
  const score = computeDailyScore({
    sleepHours: p.sleepHours,
    mood: p.mood,
    energy: p.energy,
    workout: p.workout,
    deepWork: p.deepWork,
    productivityRating: p.productivityRating,
  });

  if (!isSupabaseConfigured()) {
    return { ok: false, demo: true, score };
  }

  const user = await getUser();
  if (!user) return { ok: false, score, error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase.from("daily_checkins").upsert(
    {
      user_id: user.id,
      check_date: p.date,
      wake_time: p.wakeTime,
      sleep_hours: p.sleepHours,
      mood: p.mood,
      energy: p.energy,
      main_goal: p.mainGoal,
      workout: p.workout,
      deep_work: p.deepWork,
      biggest_distraction: p.biggestDistraction,
      productivity_rating: p.productivityRating,
      wins: p.wins,
      failures: p.failures,
      tomorrow_focus: p.tomorrowFocus,
      daily_score: score,
    },
    { onConflict: "user_id,check_date" }
  );

  if (error) return { ok: false, score, error: error.message };

  // Fire-and-forget AI summary if configured.
  if (process.env.ANTHROPIC_API_KEY) {
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/check-in/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinDate: p.date, score }),
      }
    ).catch(() => {});
  }

  revalidatePath("/dashboard");
  revalidatePath("/check-in");
  return { ok: true, score };
}
