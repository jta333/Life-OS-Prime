import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { cn } from "@/lib/utils";
import { scoreVerdict } from "@/lib/scoring";

interface KpiCardProps {
  label: string;
  value: number;
  delta?: number;
  icon?: LucideIcon;
  tone?: "gold" | "cyan" | "emerald" | "rose" | "violet" | "amber";
  invert?: boolean;
  hint?: string;
}

const toneRing: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  gold: "from-gold/30 via-amber/10 to-transparent",
  cyan: "from-cyan/30 via-cyan/10 to-transparent",
  emerald: "from-emerald/30 via-emerald/10 to-transparent",
  rose: "from-rose/30 via-rose/10 to-transparent",
  violet: "from-violet/30 via-violet/10 to-transparent",
  amber: "from-amber/30 via-gold/10 to-transparent",
};

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "gold",
  invert = false,
  hint,
}: KpiCardProps) {
  const verdict = scoreVerdict(invert ? 100 - value : value);
  return (
    <Card className="group relative overflow-hidden p-5">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-80",
          toneRing[tone]
        )}
        style={{ maskImage: "radial-gradient(closest-side, black, transparent)" }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {Icon && <Icon className="size-3.5" />}
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
              {Math.round(value)}
            </span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              / 100
            </span>
          </div>
          {hint && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest",
              verdict.tone === "emerald" && "text-emerald-soft border-emerald/30",
              verdict.tone === "gold" && "text-gold border-gold/30",
              verdict.tone === "amber" && "text-amber border-amber/30",
              verdict.tone === "rose" && "text-rose-soft border-rose/30"
            )}
          >
            {verdict.label}
          </span>
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                delta >= 0 ? "text-emerald-soft" : "text-rose-soft"
              )}
            >
              {delta >= 0 ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>
      <div className="relative mt-4">
        <UnicodeBar value={value} tone={tone} width={14} />
      </div>
    </Card>
  );
}
