"use server";

import { revalidatePath } from "next/cache";
import { SINGLE_USER_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function toggleHabit(
  habitId: string,
  date: string,
  completed: boolean
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  const supabase = createClient();

  if (completed) {
    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        {
          user_id: SINGLE_USER_ID,
          habit_id: habitId,
          log_date: date,
          completed: true,
          value: 1,
        },
        { onConflict: "habit_id,log_date" }
      );
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("log_date", date);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { ok: true };
}
