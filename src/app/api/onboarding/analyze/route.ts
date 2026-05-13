import { NextResponse } from "next/server";
import { format } from "date-fns";
import { DEEP_MODEL, cachedSystem, getAnthropic, hasAnthropic } from "@/lib/anthropic";
import { ANALYSIS_PROMPTS } from "@/lib/persona";
import { SINGLE_USER_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDashboardSnapshot } from "@/lib/data";

export const runtime = "nodejs";

// Generates an "Initial Life Status Overview" via Claude and caches it in
// the `insights` table with scope='onboarding'. Called by the onboarding
// server action after profile + routine + scores are persisted.
export async function POST() {
  if (!hasAnthropic() || !isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Requires both ANTHROPIC_API_KEY and Supabase env vars." },
      { status: 503 }
    );
  }

  const snap = await getDashboardSnapshot();

  const context = {
    profile: {
      name: snap.profile.name,
      age: snap.profile.age,
      occupation: snap.profile.occupation,
      main_goals: snap.profile.main_goals,
      struggles: snap.profile.struggles,
      persona_goal: snap.profile.persona_goal,
      satisfaction: snap.profile.satisfaction,
      stress: snap.profile.stress,
      discipline: snap.profile.discipline,
    },
    routine: snap.routine,
    scores: snap.scores,
  };

  try {
    const client = getAnthropic();
    const result = await client.messages.create({
      model: DEEP_MODEL,
      max_tokens: 1200,
      system: cachedSystem,
      messages: [
        {
          role: "user",
          content: `${ANALYSIS_PROMPTS.onboarding}\n\nUSER DATA:\n${JSON.stringify(context, null, 2)}`,
        },
      ],
    });

    const markdown = result.content.find((c) => c.type === "text")?.text ?? "";
    const supabase = createClient();
    await supabase.from("insights").insert({
      user_id: SINGLE_USER_ID,
      scope: "onboarding",
      period_start: format(new Date(), "yyyy-MM-dd"),
      payload: { markdown },
      model: DEEP_MODEL,
    });

    return NextResponse.json({ ok: true, markdown });
  } catch (err) {
    console.error("onboarding analyze error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
