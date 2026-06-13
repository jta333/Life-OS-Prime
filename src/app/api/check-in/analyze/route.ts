import { NextResponse, type NextRequest } from "next/server";
import { COACH_MODEL, cachedSystem, getAnthropic, hasAnthropic } from "@/lib/anthropic";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!hasAnthropic() || !isSupabaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const { checkinDate } = (await req.json()) as { checkinDate: string };
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const supabase = await createClient();
  const { data: checkin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .eq("check_date", checkinDate)
    .single();
  if (!checkin) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const client = getAnthropic();
    const result = await client.messages.create({
      model: COACH_MODEL,
      max_tokens: 350,
      system: cachedSystem,
      messages: [
        {
          role: "user",
          content: `Analyze today's check-in. Respond in 2-3 short sentences as the coach, specific, decisive, non-generic. Reference numbers from the data.\n\nDATA:\n${JSON.stringify(checkin, null, 2)}`,
        },
      ],
    });
    const text =
      result.content.find((c) => c.type === "text")?.text ?? null;
    if (text) {
      await supabase
        .from("daily_checkins")
        .update({ ai_summary: text })
        .eq("id", checkin.id);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("check-in analyze error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
