import { Activity, Coffee, Moon, Sunrise, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { getDashboardSnapshot } from "@/lib/data";
import { formatTime } from "@/lib/utils";

interface Block {
  time: string;
  title: string;
  kind: "deep" | "recovery" | "wellness" | "work" | "shutdown";
  detail: string;
}

const KIND_TONE: Record<Block["kind"], string> = {
  deep: "from-gold/30 to-amber/10 border-gold/40 text-gold",
  recovery: "from-cyan/30 to-cyan/10 border-cyan/40 text-cyan",
  wellness: "from-emerald/30 to-emerald/10 border-emerald/40 text-emerald-soft",
  work: "from-violet/30 to-violet/10 border-violet/40 text-violet-soft",
  shutdown: "from-rose/30 to-rose/10 border-rose/40 text-rose-soft",
};

export default async function RoutinePage() {
  const snap = await getDashboardSnapshot();
  const { routine, scores } = snap;

  // Build a stylized 12-hour timeline anchored to user's wake time
  const blocks: Block[] = [
    { time: routine?.wake_time ?? "06:30", title: "Wake & light exposure",  kind: "wellness", detail: "Cold shower, 10-min meditation, hydrate." },
    { time: "07:30", title: "Morning routine",       kind: "wellness", detail: "Breakfast + 20-min reading." },
    { time: "08:30", title: "Deep work block 1",     kind: "deep",     detail: "Highest-leverage task, no Slack, no email." },
    { time: "11:00", title: "Active recovery",       kind: "recovery", detail: "20-min walk + light snack." },
    { time: "11:30", title: "Shallow work",          kind: "work",     detail: "Meetings, comms, admin." },
    { time: "13:00", title: "Lunch + decompression", kind: "recovery", detail: "Protein-forward, no screens." },
    { time: "14:00", title: "Deep work block 2",     kind: "deep",     detail: "Strategic / creative work." },
    { time: "16:30", title: "Movement",              kind: "wellness", detail: "Strength or Zone-2 run." },
    { time: "18:30", title: "Dinner & people",       kind: "recovery", detail: "Real food, real conversation." },
    { time: "21:00", title: "Wind-down",             kind: "shutdown", detail: "Screens off. Journal + read." },
    { time: routine?.sleep_time ?? "23:00", title: "Sleep window",          kind: "shutdown", detail: "Phone in another room." },
  ];

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Section 2 · Daily Routine"
        title="Your operating timeline"
        description="An engineered day — deep work, recovery, wellness and shutdown — calibrated to your peak hours."
        icon={Activity}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Routine inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <Row icon={Sunrise} label="Wake" value={formatTime(routine?.wake_time)} />
            <Row icon={Moon}    label="Sleep" value={formatTime(routine?.sleep_time)} />
            <Row icon={Zap}     label="Peak hours" value={routine?.peak_hours ?? "—"} />
            <Row icon={Coffee}  label="Focus window" value={`${routine?.focus_minutes ?? 90} min`} />
          </CardContent>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Daily performance signals
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
            <Signal label="Productivity" value={scores.productivity} tone="gold" />
            <Signal label="Focus"        value={scores.focus}        tone="violet" />
            <Signal label="Energy"       value={scores.energy}       tone="cyan" />
            <Signal label="Distractions" value={100 - Math.min(100, (snap.routine?.social_media_hours ?? 1.5) * 25)} tone="rose" />
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3.5 text-gold" />
            Optimized routine
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ol className="relative ml-3 space-y-3 border-l border-border/40 pl-6">
            {blocks.map((b, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[31px] top-2 inline-flex size-3 items-center justify-center rounded-full border bg-gradient-to-br ${KIND_TONE[b.kind]}`}
                />
                <div className="flex flex-wrap items-baseline gap-3 rounded-xl border border-border/60 bg-card/40 p-3.5">
                  <span className="font-mono text-sm tabular-nums text-gold">
                    {formatTime(b.time)}
                  </span>
                  <span className="font-medium">{b.title}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] capitalize">
                    {b.kind}
                  </Badge>
                  <p className="basis-full text-xs text-muted-foreground">
                    {b.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Time leak watchlist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Watch label="Screen time" value={Number(routine?.screen_time_hours ?? 0)} unit="hrs" target={4} />
            <Watch label="Social media" value={Number(routine?.social_media_hours ?? 0)} unit="hrs" target={1} />
            <Watch label="Wasted time" value={Number(routine?.wasted_minutes ?? 0)} unit="min" target={45} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}

function Signal({ label, value, tone }: { label: string; value: number; tone: "gold" | "cyan" | "violet" | "rose" }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{Math.round(value)}</div>
      <div className="mt-2">
        <UnicodeBar value={value} tone={tone} width={12} showPct={false} />
      </div>
    </div>
  );
}

function Watch({ label, value, unit, target }: { label: string; value: number; unit: string; target: number }) {
  const over = value > target;
  const pct = Math.min(100, (value / (target * 2.5)) * 100);
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
        <Badge
          variant={over ? "danger" : "success"}
          className="ml-auto text-[10px]"
        >
          {over ? "Over target" : "On target"}
        </Badge>
      </div>
      <div className="mt-2">
        <UnicodeBar value={pct} tone={over ? "rose" : "emerald"} width={12} showPct={false} />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">
        Target ≤ {target} {unit}
      </div>
    </div>
  );
}
