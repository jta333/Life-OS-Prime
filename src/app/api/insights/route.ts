import { NextResponse, type NextRequest } from "next/server";
import { format, subDays } from "date-fns";
import {
  DEEP_MODEL,
  cachedSystem,
  getAnthropic,
  hasAnthropic,
} from "@/lib/anthropic";
import { ANALYSIS_PROMPTS } from "@/lib/persona";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDashboardSnapshot } from "@/lib/data";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!hasAnthropic() || !isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "AI coach is offline. Add ANTHROPIC_API_KEY + Supabase env vars." },
      { status: 503 }
    );
  }
  const { scope } = (await req.json()) as { scope: "weekly" | "monthly" };
  if (scope !== "weekly" && scope !== "monthly") {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await getDashboardSnapshot();
  const promptKey = scope === "weekly" ? "weeklyReview" : "monthlyReview";
  const promptText = ANALYSIS_PROMPTS[promptKey];

  const days = scope === "weekly" ? 7 : 30;
  const relevantCheckins = snap.checkins.filter((c) => {
    return new Date(c.check_date) >= subDays(new Date(), days);
  });
  const relevantLogs = snap.habitLogs.filter((l) => {
    return new Date(l.log_date) >= subDays(new Date(), days);
  });

  const context = {
    profile: {
      name: snap.profile.name,
      vision: snap.profile.vision,
      struggles: snap.profile.struggles,
    },
    scores: snap.scores,
    checkins: relevantCheckins,
    habits: snap.habits.map((h) => ({
      name: h.name,
      completions: relevantLogs.filter((l) => l.habit_id === h.id && l.completed).length,
      window_days: days,
    })),
    goals: snap.goals.map((g) => ({
      title: g.title,
      category: g.category,
      progress: g.progress,
      priority: g.priority,
    })),
  };

  const client = getAnthropic();
  const result = await client.messages.create({
    model: DEEP_MODEL,
    max_tokens: 1400,
    system: cachedSystem,
    messages: [
      {
        role: "user",
        content: `${promptText}\n\nUSER DATA:\n${JSON.stringify(context, null, 2)}`,
      },
    ],
  });

  const markdown = result.content.find((c) => c.type === "text")?.text ?? "";

  const supabase = await createClient();
  await supabase.from("insights").insert({
    user_id: user.id,
    scope,
    period_start: format(subDays(new Date(), days), "yyyy-MM-dd"),
    period_end: format(new Date(), "yyyy-MM-dd"),
    payload: { markdown },
    model: DEEP_MODEL,
  });

  return NextResponse.json({ ok: true, markdown });
}
