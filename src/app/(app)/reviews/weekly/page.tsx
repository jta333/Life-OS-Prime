import { format, subDays } from "date-fns";
import { CalendarRange, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { InsightCard } from "@/components/dashboard/insight-card";
import { EnergyCurve } from "@/components/dashboard/energy-curve";
import { RegenerateButton } from "../_components/regenerate-button";
import { getDashboardSnapshot } from "@/lib/data";

export default async function WeeklyReviewPage() {
  const snap = await getDashboardSnapshot();
  const { checkins, habitLogs, habits, insights, isDemo } = snap;

  const last7 = checkins
    .filter((c) => {
      const d = new Date(c.check_date);
      return d >= subDays(new Date(), 7);
    });

  const avgScore = last7.length
    ? Math.round(last7.reduce((a, c) => a + (c.daily_score ?? 0), 0) / last7.length)
    : 0;
  const workouts = last7.filter((c) => c.workout).length;
  const deepWorks = last7.filter((c) => c.deep_work).length;
  const avgSleep = last7.length
    ? (last7.reduce((a, c) => a + (c.sleep_hours ?? 0), 0) / last7.length).toFixed(1)
    : "—";

  // Habit completions in last 7 days
  const last7Set = new Set(
    Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), "yyyy-MM-dd"))
  );
  const habitWeek = habits.map((h) => {
    const completions = habitLogs.filter(
      (l) => l.habit_id === h.id && l.completed && last7Set.has(l.log_date)
    ).length;
    return {
      id: h.id,
      name: h.name,
      completions,
      consistency: Math.round((completions / 7) * 100),
    };
  });

  const curveData = [...last7]
    .reverse()
    .map((c) => ({
      date: format(new Date(c.check_date), "EEE"),
      energy: (c.energy ?? 6) * 10,
      productivity: (c.productivity_rating ?? 6) * 10,
    }));

  const weekly = insights.find((i) => i.scope === "weekly");

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Weekly Review Mode"
        title="Weekly performance review"
        description="Seven-day rollup of productivity, habits, sleep, and trajectory."
        icon={CalendarRange}
        action={
          !isDemo && (
            <RegenerateButton scope="weekly" />
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Weekly score
              </div>
              <h2 className="font-display text-2xl">{avgScore}/100</h2>
            </div>
            <ScoreRing value={avgScore} tone="gold" label="Avg" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <Stat label="Workouts"    value={`${workouts}/7`} />
            <Stat label="Deep work"   value={`${deepWorks}/7`} />
            <Stat label="Avg sleep"   value={`${avgSleep}h`} />
            <Stat label="Check-ins"   value={`${last7.length}/7`} />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <TrendingUp className="size-3.5 text-gold" />
              Energy × productivity — last 7 days
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EnergyCurve data={curveData} />
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Habit consistency this week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 text-left font-medium">Habit</th>
                  <th className="py-2 text-right font-medium">Completions</th>
                  <th className="py-2 text-right font-medium">Consistency</th>
                  <th className="py-2 text-right font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {habitWeek.map((h) => (
                  <tr key={h.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2.5">{h.name}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {h.completions}/7
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="inline-block w-40 text-right">
                        <UnicodeBar value={h.consistency} width={10} />
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge
                        variant={
                          h.consistency >= 80
                            ? "success"
                            : h.consistency >= 50
                              ? "default"
                              : "danger"
                        }
                      >
                        {h.consistency >= 80
                          ? "Elite"
                          : h.consistency >= 50
                            ? "Solid"
                            : "Needs work"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {weekly?.payload?.markdown && (
        <InsightCard
          title="AI weekly review"
          markdown={String(weekly.payload.markdown)}
          tone="gold"
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
