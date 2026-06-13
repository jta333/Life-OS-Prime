import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Gauge,
  ShieldCheck,
  HeartPulse,
  Activity,
  ScanLine,
  Flame,
  CalendarCheck,
  Sparkles,
  Brain,
  ChevronRight,
  Moon,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";
import { EnergyCurve } from "@/components/dashboard/energy-curve";
import { InsightCard } from "@/components/dashboard/insight-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { getDashboardSnapshot } from "@/lib/data";
import { HabitChecklist } from "./_components/habit-checklist";

export default async function DashboardPage() {
  const snap = await getDashboardSnapshot();

  // A signed-in user who hasn't completed onboarding has no real scores yet,
  // so the dashboard would fall back to placeholder sample numbers. Send them
  // to onboarding instead. (Demo/preview mode keeps the sample dashboard.)
  if (!snap.isDemo && !snap.profile.onboarded_at) {
    redirect("/onboarding");
  }

  const { profile, scores, habits, habitLogs, checkins, insights, goals } = snap;

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todaysLogs = habitLogs.filter((l) => l.log_date === todayKey);
  const habitsTotal = habits.length || 1;
  const habitsDone = todaysLogs.filter((l) => l.completed).length;

  const heatmap: Record<string, number> = {};
  for (let i = 0; i < 84; i++) {
    const key = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayLogs = habitLogs.filter(
      (l) => l.log_date === key && l.completed
    ).length;
    heatmap[key] = Math.min(1, dayLogs / habitsTotal);
  }

  const curveData = [...checkins]
    .slice(0, 14)
    .reverse()
    .map((c) => ({
      date: format(new Date(c.check_date), "MMM d"),
      energy: (c.energy ?? 6) * 10,
      productivity: (c.productivity_rating ?? 6) * 10,
    }));

  const latestCheckin = checkins[0];
  const hasCheckinToday = latestCheckin?.check_date === todayKey;

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Life OS · Today"
        title={`Welcome back${profile.name ? `, ${profile.name.split(" ")[0]}` : ""}.`}
        description="Your performance, energy, discipline, and momentum in one luxury panel."
        icon={Gauge}
        action={
          !hasCheckinToday && (
            <Button asChild>
              <Link href="/check-in">
                <CalendarCheck className="size-4" />
                Run today's check-in
              </Link>
            </Button>
          )
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Productivity" value={scores.productivity} icon={Gauge}     tone="gold"    delta={6} />
        <KpiCard label="Discipline"   value={scores.discipline}   icon={ShieldCheck} tone="amber"  delta={4} />
        <KpiCard label="Lifestyle"    value={scores.lifestyle}    icon={HeartPulse}  tone="emerald" delta={-2} />
        <KpiCard label="Energy"       value={scores.energy}       icon={Activity}    tone="cyan"    delta={3} />
        <KpiCard label="Focus"        value={scores.focus}        icon={ScanLine}    tone="violet"  delta={5} />
        <KpiCard label="Stress Index" value={scores.stress_index} icon={Brain}       tone="rose"    invert delta={-4} hint="Lower is better" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Balance ring + verdict */}
        <Card className="relative overflow-hidden p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Life Balance
              </div>
              <h2 className="font-display text-2xl tracking-tight">
                Operating at {scoreVerdictLabel(scores.balance)}
              </h2>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Composite of productivity, lifestyle and recovery. Burnout risk is
                tracked separately.
              </p>
            </div>
            <ScoreRing value={scores.balance} tone="gold" label="Balance" />
          </div>
          <Separator className="my-5" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                Burnout risk
              </div>
              <UnicodeBar value={scores.burnout_risk} tone="rose" />
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                Recovery score
              </div>
              <UnicodeBar value={100 - scores.burnout_risk} tone="emerald" />
            </div>
          </div>
        </Card>

        {/* Today's habits */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Flame className="size-3.5 text-gold" />
                Today's habits
              </div>
              <h2 className="font-display text-xl tracking-tight">
                {habitsDone} / {habitsTotal} completed
              </h2>
            </div>
            <Badge variant="outline">
              {Math.round((habitsDone / habitsTotal) * 100)}% today
            </Badge>
          </div>
          <HabitChecklist
            habits={habits.slice(0, 8)}
            todaysLogs={todaysLogs}
            todayKey={todayKey}
            isDemo={snap.isDemo}
          />
          <div className="mt-4">
            <Link
              href="/habits"
              className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-gold/90 hover:text-gold"
            >
              All habits & streaks
              <ChevronRight className="size-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Charts + insight */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Energy × Productivity: last 14 days
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EnergyCurve data={curveData} />
            <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-gold" />
                Productivity
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan" />
                Energy
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Flame className="size-3.5 text-gold" />
              Consistency · 12 weeks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StreakHeatmap data={heatmap} days={84} />
            <p className="mt-4 text-xs text-muted-foreground">
              Each cell is one day; intensity = % of habits completed.
            </p>
          </CardContent>
        </Card>
      </div>

      {insights[0]?.payload?.markdown && (
        <InsightCard
          title="AI Coach: latest insight"
          markdown={insights[0].payload.markdown as string}
          tone="gold"
        />
      )}

      {/* Goals strip + check-in summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Top goals</span>
              <Link
                href="/goals"
                className="inline-flex items-center gap-1 text-gold/90 hover:text-gold"
              >
                View all <ChevronRight className="size-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {goals.slice(0, 4).map((g) => (
              <Link
                key={g.id}
                href="/goals"
                className="group rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-gold/40"
              >
                <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{g.category}</span>
                  {g.priority <= 2 && (
                    <Badge variant="default" className="text-[9px]">
                      P{g.priority}
                    </Badge>
                  )}
                </div>
                <div className="font-medium leading-snug">{g.title}</div>
                <div className="mt-3">
                  <UnicodeBar value={g.progress} tone="gold" width={12} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Moon className="size-3.5 text-cyan" />
              Last check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            {latestCheckin ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Daily score</span>
                  <span className="font-mono text-gold">
                    {latestCheckin.daily_score ?? "-"}/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sleep</span>
                  <span className="font-mono">
                    {latestCheckin.sleep_hours?.toFixed(1)}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Energy</span>
                  <UnicodeBar
                    value={(latestCheckin.energy ?? 5) * 10}
                    tone="cyan"
                    width={8}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mood</span>
                  <UnicodeBar
                    value={(latestCheckin.mood ?? 5) * 10}
                    tone="violet"
                    width={8}
                  />
                </div>
                <Separator />
                {latestCheckin.ai_summary && (
                  <p className="text-xs leading-relaxed text-foreground/85">
                    <Sparkles className="mr-1 inline size-3 text-gold" />
                    {latestCheckin.ai_summary}
                  </p>
                )}
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/check-in">Run today's check-in</Link>
                </Button>
              </>
            ) : (
              <div className="text-muted-foreground">
                No check-ins yet, start your daily ritual.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function scoreVerdictLabel(v: number): string {
  if (v >= 85) return "elite";
  if (v >= 70) return "high tier";
  if (v >= 55) return "solid pace";
  if (v >= 40) return "developing";
  return "needs reset";
}
