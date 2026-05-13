"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function toggleHabit(
  habitId: string,
  date: string,
  completed: boolean
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };
  const user = await getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const supabase = await createClient();

  if (completed) {
    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        {
          user_id: user.id,
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
