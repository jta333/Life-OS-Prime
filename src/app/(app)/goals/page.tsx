import { Target, Sparkles, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { getDashboardSnapshot } from "@/lib/data";
import type { Goal, GoalCategory } from "@/types/database";

const CATEGORY_LABEL: Record<GoalCategory, string> = {
  financial: "Financial",
  career: "Career",
  relationship: "Relationship",
  learning: "Learning",
  fitness: "Fitness",
  social: "Social",
  business: "Business",
  monthly: "Monthly",
  vision: "Vision",
  dream: "Dream",
};

const CATEGORY_TONE: Record<GoalCategory, "gold" | "cyan" | "emerald" | "violet" | "rose"> = {
  financial: "gold",
  career: "gold",
  business: "gold",
  fitness: "emerald",
  learning: "violet",
  relationship: "rose",
  social: "rose",
  monthly: "cyan",
  vision: "violet",
  dream: "violet",
};

export default async function GoalsPage() {
  const snap = await getDashboardSnapshot();
  const goals = snap.goals;
  const byCategory: Record<string, Goal[]> = {};
  goals.forEach((g) => {
    (byCategory[g.category] ||= []).push(g);
  });

  const urgent = goals.filter((g) => g.priority <= 2 && g.status === "active");
  const completed = goals.filter((g) => g.progress >= 100 || g.status === "completed");
  const avgProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Section 4 · Goals & Ambition System"
        title="Goal architecture map"
        description="Priority matrix, milestone tracker, strategic roadmap — vision to Tuesday."
        icon={Target}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Active goals
          </div>
          <div className="mt-1 font-display text-3xl">{goals.length}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {urgent.length} priority 1–2 · {completed.length} completed
          </div>
          <Separator className="my-4" />
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Avg progress
          </div>
          <div className="mt-1">
            <UnicodeBar value={avgProgress} width={14} />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="size-3.5 text-gold" />
              Priority matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 text-sm">
              <Quadrant title="Now · High value" tone="gold">
                {goals
                  .filter((g) => g.priority <= 2 && g.progress < 70)
                  .slice(0, 4)
                  .map((g) => (
                    <li key={g.id} className="truncate">
                      <span className="text-foreground">{g.title}</span>
                    </li>
                  ))}
              </Quadrant>
              <Quadrant title="Compound · Sustain" tone="emerald">
                {goals
                  .filter((g) => g.priority <= 2 && g.progress >= 70)
                  .slice(0, 4)
                  .map((g) => (
                    <li key={g.id} className="truncate">
                      <span className="text-foreground">{g.title}</span>
                    </li>
                  ))}
              </Quadrant>
              <Quadrant title="Background · Defer" tone="violet">
                {goals
                  .filter((g) => g.priority >= 3 && g.progress < 50)
                  .slice(0, 4)
                  .map((g) => (
                    <li key={g.id} className="truncate">
                      <span className="text-foreground">{g.title}</span>
                    </li>
                  ))}
              </Quadrant>
              <Quadrant title="Vision · North star" tone="cyan">
                {goals
                  .filter((g) => g.category === "vision" || g.category === "dream")
                  .slice(0, 4)
                  .map((g) => (
                    <li key={g.id} className="truncate">
                      <span className="text-foreground">{g.title}</span>
                    </li>
                  ))}
              </Quadrant>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Milestone tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <MapPin className="size-3" />
                {CATEGORY_LABEL[g.category]}
                {g.priority <= 2 && (
                  <Badge variant="default" className="text-[9px]">
                    P{g.priority}
                  </Badge>
                )}
              </div>
              <div className="mt-1 font-medium leading-snug">{g.title}</div>
              {g.description && g.description !== g.title && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3" />
                  {g.target_date ?? "Open-ended"}
                </span>
                <span className="font-mono tabular-nums text-gold">
                  {g.progress}%
                </span>
              </div>
              <div className="mt-2">
                <UnicodeBar
                  value={g.progress}
                  tone={CATEGORY_TONE[g.category]}
                  width={14}
                  showPct={false}
                />
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              No goals captured yet — add them via onboarding.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Strategic roadmap by category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          {Object.entries(byCategory).map(([cat, items]) => {
            const c = cat as GoalCategory;
            const avg = Math.round(
              items.reduce((a, g) => a + g.progress, 0) / items.length
            );
            return (
              <div key={cat}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{CATEGORY_LABEL[c]}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {items.length}
                    </Badge>
                  </div>
                  <UnicodeBar value={avg} tone={CATEGORY_TONE[c]} width={12} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function Quadrant({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "gold" | "cyan" | "emerald" | "violet";
  children: React.ReactNode;
}) {
  const tones = {
    gold:    "border-gold/40 bg-gold/[0.05] text-gold",
    cyan:    "border-cyan/40 bg-cyan/[0.05] text-cyan",
    emerald: "border-emerald/40 bg-emerald/[0.05] text-emerald-soft",
    violet:  "border-violet/40 bg-violet/[0.05] text-violet-soft",
  };
  return (
    <div className={`rounded-xl border ${tones[tone]} p-4`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest">
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-foreground/85">{children}</ul>
    </div>
  );
}
