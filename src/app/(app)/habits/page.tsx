import { format, subDays } from "date-fns";
import { Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";
import { getDashboardSnapshot } from "@/lib/data";
import { HabitChecklist } from "../dashboard/_components/habit-checklist";

interface HabitStat {
  id: string;
  name: string;
  completions7: number;
  consistency30: number;
  streak: number;
}

export default async function HabitsPage() {
  const snap = await getDashboardSnapshot();
  const { habits, habitLogs } = snap;
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todaysLogs = habitLogs.filter((l) => l.log_date === todayKey);

  const stats: HabitStat[] = habits.map((h) => {
    const logs = habitLogs.filter((l) => l.habit_id === h.id && l.completed);
    const set = new Set(logs.map((l) => l.log_date));
    // last 7 days
    let comp7 = 0;
    for (let i = 0; i < 7; i++) {
      if (set.has(format(subDays(new Date(), i), "yyyy-MM-dd"))) comp7++;
    }
    // last 30 days
    let comp30 = 0;
    for (let i = 0; i < 30; i++) {
      if (set.has(format(subDays(new Date(), i), "yyyy-MM-dd"))) comp30++;
    }
    // streak
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      if (set.has(format(subDays(new Date(), i), "yyyy-MM-dd"))) streak++;
      else if (i === 0) continue;
      else break;
    }
    return {
      id: h.id,
      name: h.name,
      completions7: comp7,
      consistency30: Math.round((comp30 / 30) * 100),
      streak,
    };
  });

  const overallConsistency = Math.round(
    stats.reduce((a, s) => a + s.consistency30, 0) / Math.max(1, stats.length)
  );

  const heatmap: Record<string, number> = {};
  for (let i = 0; i < 84; i++) {
    const key = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayLogs = habitLogs.filter((l) => l.log_date === key && l.completed).length;
    heatmap[key] = Math.min(1, dayLogs / Math.max(1, habits.length));
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Section 5 · Habit Tracking System"
        title="Discipline analytics"
        description="Daily trackers, streaks, consistency analytics and weekly habit reports."
        icon={Flame}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Consistency · 30 days
              </div>
              <h2 className="font-display text-2xl">
                {overallConsistency}% locked in
              </h2>
            </div>
            <ScoreRing value={overallConsistency} tone="gold" label="Habits" />
          </div>
          <Separator className="my-5" />
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Top streak</span>
              <span className="font-mono text-gold">
                {Math.max(0, ...stats.map((s) => s.streak))} days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total habits</span>
              <span className="font-mono">{habits.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completed today</span>
              <span className="font-mono">
                {todaysLogs.filter((l) => l.completed).length} / {habits.length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Flame className="size-3.5 text-gold" />
              Consistency heatmap · 12 weeks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StreakHeatmap data={heatmap} days={84} />
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span>Today's tracker</span>
            <Badge variant="outline">Tap to log</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <HabitChecklist
            habits={habits}
            todaysLogs={todaysLogs}
            todayKey={todayKey}
            isDemo={snap.isDemo}
          />
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="size-3.5 text-gold" />
            Weekly habit report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 text-left font-medium">Habit</th>
                  <th className="py-2 text-right font-medium">Last 7</th>
                  <th className="py-2 text-right font-medium">Streak</th>
                  <th className="py-2 text-right font-medium">30-day consistency</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2.5">{s.name}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {s.completions7}/7
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-gold">
                      {s.streak}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="inline-block w-44 text-right">
                        <UnicodeBar value={s.consistency30} width={12} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
