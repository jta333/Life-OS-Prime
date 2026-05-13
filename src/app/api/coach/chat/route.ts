import { NextResponse, type NextRequest } from "next/server";
import { COACH_MODEL, cachedSystem, getAnthropic, hasAnthropic } from "@/lib/anthropic";
import { getDashboardSnapshot } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  if (!hasAnthropic()) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const body = (await req.json()) as { messages: ChatMessage[] };
  const messages = body.messages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );
  if (!messages.length) {
    return NextResponse.json({ error: "no messages" }, { status: 400 });
  }

  const snap = await getDashboardSnapshot();
  const contextBlock = buildContext(snap);

  const client = getAnthropic();
  const stream = await client.messages.stream({
    model: COACH_MODEL,
    max_tokens: 1024,
    system: [
      ...cachedSystem,
      {
        type: "text",
        text: `USER CONTEXT (live):\n${contextBlock}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (
            ev.type === "content_block_delta" &&
            ev.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
      } catch (err) {
        console.error("Coach stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function buildContext(snap: Awaited<ReturnType<typeof getDashboardSnapshot>>): string {
  const { profile, scores, routine, health, habits, habitLogs, checkins, goals } = snap;
  const recentCheckins = checkins.slice(0, 5).map((c) => ({
    date: c.check_date,
    score: c.daily_score,
    sleep: c.sleep_hours,
    mood: c.mood,
    energy: c.energy,
    workout: c.workout,
    deepWork: c.deep_work,
    distraction: c.biggest_distraction,
  }));
  const habitSummary = habits.map((h) => {
    const completions = habitLogs.filter((l) => l.habit_id === h.id && l.completed).length;
    return { name: h.name, completions };
  });
  const topGoals = goals.slice(0, 5).map((g) => ({
    title: g.title,
    category: g.category,
    progress: g.progress,
    priority: g.priority,
  }));

  return JSON.stringify(
    {
      profile: {
        name: profile.name,
        age: profile.age,
        occupation: profile.occupation,
        vision: profile.vision,
        persona_goal: profile.persona_goal,
        struggles: profile.struggles,
      },
      scores: {
        productivity: scores.productivity,
        discipline: scores.discipline,
        lifestyle: scores.lifestyle,
        stress_index: scores.stress_index,
        balance: scores.balance,
        energy: scores.energy,
        focus: scores.focus,
        burnout_risk: scores.burnout_risk,
      },
      routine: routine && {
        wake: routine.wake_time,
        sleep: routine.sleep_time,
        focus_minutes: routine.focus_minutes,
        peak_hours: routine.peak_hours,
        distractions: routine.distractions,
        wasted_minutes: routine.wasted_minutes,
      },
      health: health && {
        sleep_quality: health.sleep_quality,
        exercise_freq: health.exercise_freq_per_week,
        diet_quality: health.diet_quality,
        mental_state: health.mental_state,
        triggers: health.stress_triggers,
        crashes: health.energy_crashes,
      },
      habits: habitSummary,
      checkins: recentCheckins,
      goals: topGoals,
    },
    null,
    2
  );
}
