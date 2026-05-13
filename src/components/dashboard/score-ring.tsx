import { cn } from "@/lib/utils";

interface ScoreRingProps {
  value: number;
  label?: string;
  size?: number;
  stroke?: number;
  tone?: "gold" | "cyan" | "emerald" | "rose" | "violet";
  className?: string;
}

const toneColor: Record<NonNullable<ScoreRingProps["tone"]>, string> = {
  gold: "var(--gold)",
  cyan: "var(--cyan)",
  emerald: "var(--emerald)",
  rose: "var(--rose)",
  violet: "var(--violet)",
};

export function ScoreRing({
  value,
  label,
  size = 140,
  stroke = 10,
  tone = "gold",
  className,
}: ScoreRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c * (1 - v / 100);
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={toneColor[tone]}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold tabular-nums tracking-tight">
          {Math.round(v)}
        </div>
        {label && (
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
