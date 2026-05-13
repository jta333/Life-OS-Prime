import { cn } from "@/lib/utils";
import { unicodeBar } from "@/lib/scoring";

interface UnicodeBarProps {
  value: number;
  width?: number;
  showPct?: boolean;
  className?: string;
  tone?: "gold" | "cyan" | "emerald" | "rose" | "violet" | "amber";
}

const toneMap: Record<NonNullable<UnicodeBarProps["tone"]>, string> = {
  gold: "text-gold",
  cyan: "text-cyan",
  emerald: "text-emerald-soft",
  rose: "text-rose-soft",
  violet: "text-violet-soft",
  amber: "text-amber",
};

export function UnicodeBar({
  value,
  width = 10,
  showPct = true,
  className,
  tone = "gold",
}: UnicodeBarProps) {
  return (
    <span
      className={cn(
        "ascii-bar inline-flex items-baseline gap-2 text-sm tabular-nums",
        toneMap[tone],
        className
      )}
    >
      <span aria-hidden>{unicodeBar(value, width)}</span>
      {showPct && (
        <span className="text-foreground/85 font-semibold">
          {Math.round(value)}%
        </span>
      )}
    </span>
  );
}
