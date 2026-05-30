import { format, subDays } from "date-fns";
import { CalendarDays, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { InsightCard } from "@/components/dashboard/insight-card";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";
import { RegenerateButton } from "../_components/regenerate-button";
import { getDashboardSnapshot } from "@/lib/data";

export default async function MonthlyReviewPage() {
  const snap = await getDashboardSnapshot();
  const { checkins, habitLogs, habits, goals, insights, isDemo } = snap;

  const last30 = checkins.filter((c) => {
    const d = new Date(c.check_date);
    return d >= subDays(new Date(), 30);
  });

  const previous30 = checkins.filter((c) => {
    const d = new Date(c.check_date);
    return d >= subDays(new Date(), 60) && d < subDays(new Date(), 30);
  });

  const avg = (arr: typeof checkins) =>
    arr.length
      ? Math.round(arr.reduce((a, c) => a + (c.daily_score ?? 0), 0) / arr.length)
      : 0;
  const monthScore = avg(last30);
  const prevScore = avg(previous30);
  const delta = monthScore - prevScore;

  const completedGoals = goals.filter(
    (g) => g.progress >= 100 || g.status === "completed"
  ).length;
  const activeGoals = goals.filter((g) => g.status === "active").length;
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
    : 0;

  // Heatmap
  const heatmap: Record<string, number> = {};
  for (let i = 0; i < 84; i++) {
    const key = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayLogs = habitLogs.filter((l) => l.log_date === key && l.completed).length;
    heatmap[key] = Math.min(1, dayLogs / Math.max(1, habits.length));
  }

  const monthly = insights.find((i) => i.scope === "monthly");

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Monthly Evolution Mode"
        title="Monthly evolution report"
        description="30-day rollup. Trajectory analysis, discipline trend, habit evolution, goal completion, strategic changes."
        icon={CalendarDays}
        action={!isDemo && <RegenerateButton scope="monthly" />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <BigStat label="Avg daily score" value={`${monthScore}`} delta={delta} suffix="/100" />
        <BigStat label="Goal completion" value={`${completedGoals}`} suffix={` / ${goals.length}`} />
        <BigStat label="Active goals"    value={`${activeGoals}`} />
        <BigStat label="Goal progress"   value={`${avgGoalProgress}%`} />
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="size-3.5 text-gold" />
            Habit consistency · 12 weeks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StreakHeatmap data={heatmap} days={84} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Habit evolution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="space-y-3 text-sm">
              {habits.map((h) => {
                const completions = habitLogs.filter(
                  (l) => l.habit_id === h.id && l.completed
                ).length;
                const consistency = Math.min(
                  100,
                  Math.round((completions / 30) * 100)
                );
                return (
                  <li key={h.id} className="flex items-center justify-between">
                    <span>{h.name}</span>
                    <UnicodeBar value={consistency} width={10} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Strategic changes recommended
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <Recommend tone="gold"    title="Compound the morning ritual" body="Move your highest-leverage task to before 10:00. Two months of this changes your year." />
            <Recommend tone="cyan"    title="Cap evening screens" body="Anything past 22:00 = sleep debt. Trade for journaling or reading." />
            <Recommend tone="emerald" title="Stack one micro-recovery" body="Add a single 10-minute walk between deep work blocks. Lift in mid-day energy is measurable in two weeks." />
            <Recommend tone="violet"  title="Re-rank goals quarterly" body="Top two get morning hours; everything else gets compounding small actions." />
          </CardContent>
        </Card>
      </div>

      {monthly?.payload?.markdown && (
        <InsightCard
          title="AI monthly evolution report"
          markdown={String(monthly.payload.markdown)}
          tone="violet"
        />
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  delta,
  suffix,
}: {
  label: string;
  value: string;
  delta?: number;
  suffix?: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-4xl">{value}</span>
        {suffix && (
          <span className="text-xs text-muted-foreground">{suffix}</span>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="mt-1 text-xs">
          <Badge variant={delta >= 0 ? "success" : "danger"}>
            {delta >= 0 ? "+" : ""}
            {delta} vs prior 30
          </Badge>
        </div>
      )}
    </Card>
  );
}

function Recommend({
  tone,
  title,
  body,
}: {
  tone: "gold" | "cyan" | "emerald" | "violet";
  title: string;
  body: string;
}) {
  const map = {
    gold:    "border-gold/40 bg-gold/[0.05]",
    cyan:    "border-cyan/40 bg-cyan/[0.05]",
    emerald: "border-emerald/40 bg-emerald/[0.05]",
    violet:  "border-violet/40 bg-violet/[0.05]",
  };
  const dot = {
    gold:    "bg-gold",
    cyan:    "bg-cyan",
    emerald: "bg-emerald-soft",
    violet:  "bg-violet-soft",
  };
  return (
    <div className={`rounded-xl border ${map[tone]} p-4`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`size-1.5 rounded-full ${dot[tone]}`} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
