import {
  HeartPulse,
  Moon,
  Droplets,
  Dumbbell,
  Brain,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { getDashboardSnapshot } from "@/lib/data";

export default async function HealthPage() {
  const snap = await getDashboardSnapshot();
  const { health, scores } = snap;

  const recoveryScore = 100 - scores.burnout_risk;
  const sleepQ = (health?.sleep_quality ?? 6) * 10;
  const dietQ = (health?.diet_quality ?? 6) * 10;
  const mentalQ = (health?.mental_state ?? 6) * 10;

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Section 3 · Health & Energy System"
        title="Recovery, vitality, performance"
        description="The biological foundation underneath every score on your dashboard."
        icon={HeartPulse}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="relative overflow-hidden p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Burnout risk
              </div>
              <h2 className="font-display text-2xl tracking-tight">
                {burnoutLabel(scores.burnout_risk)}
              </h2>
            </div>
            <ScoreRing value={scores.burnout_risk} tone="rose" label="Risk" />
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Risk is computed from stress, sleep deficit, recovery quality and life
            satisfaction. Treat anything above 60 as a warning sign.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Recovery score
              </div>
              <h2 className="font-display text-2xl">{recoveryScore}/100</h2>
            </div>
            <ScoreRing value={recoveryScore} tone="emerald" label="Recovery" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <Row icon={Moon}     label="Sleep quality" pct={sleepQ}  tone="cyan" />
            <Row icon={Dumbbell} label="Diet quality"  pct={dietQ}   tone="emerald" />
            <Row icon={Brain}    label="Mental state"  pct={mentalQ} tone="violet" />
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Vital signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <KV icon={Droplets}    label="Water" value={`${health?.water_liters ?? "—"} L`} />
            <KV icon={Dumbbell}    label="Exercise" value={`${health?.exercise_freq_per_week ?? 0}×/week`} />
            <KV icon={ShieldCheck} label="Caffeine" value={`${health?.caffeine_mg ?? 0} mg`} />
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="size-3.5 text-rose-soft" />
            Risk surface
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          <Block title="Stress triggers" body={health?.stress_triggers || "Not captured yet — add via onboarding."} tone="rose" />
          <Block title="Energy crashes" body={health?.energy_crashes || "Not captured yet."} tone="amber" />
          <Block title="Medical limits" body={health?.medical_limits || "None on file."} tone="violet" />
          <Block title="Fitness goals" body={health?.fitness_goals || "Set fitness goals in onboarding."} tone="emerald" />
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Optimization moves
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
          <Move title="Protect 7–9 h sleep window" body="Lights down at 22:00, phone in another room. Aim 8 h consistent." />
          <Move title="Hydrate at 0.5 L pre-workout" body="Prevents the 14:00 crash and improves perceived exertion." />
          <Move title="Two weekly strength + two Zone-2" body="Compounding fat-loss + heart-rate variability gains." />
          <Move title="Caffeine cutoff at 14:00" body="Eliminates the late-afternoon stimulant tail that erodes sleep." />
          <Move title="Sunlight within 30 min of wake" body="Anchors circadian rhythm and morning energy peak." />
          <Move title="Single shutdown ritual" body="Same trigger every night — your nervous system follows the cue." />
        </CardContent>
      </Card>
    </div>
  );
}

function burnoutLabel(v: number): string {
  if (v < 30) return "Recovered & resilient";
  if (v < 50) return "Stable baseline";
  if (v < 65) return "Monitor closely";
  return "Intervene now";
}

function Row({ icon: Icon, label, pct, tone }: { icon: React.ElementType; label: string; pct: number; tone: "cyan" | "emerald" | "violet" | "gold" | "rose" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </span>
      <span className="text-right">
        <UnicodeBar value={pct} tone={tone} width={8} />
      </span>
    </div>
  );
}

function KV({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

function Block({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "rose" | "amber" | "violet" | "emerald";
}) {
  const map = {
    rose: "border-rose/30 bg-rose/[0.05]",
    amber: "border-amber/40 bg-amber/[0.05]",
    violet: "border-violet/30 bg-violet/[0.05]",
    emerald: "border-emerald/30 bg-emerald/[0.05]",
  } as const;
  return (
    <div className={`rounded-xl border ${map[tone]} p-4`}>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <p className="mt-2 text-sm text-foreground/85">{body}</p>
    </div>
  );
}

function Move({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
