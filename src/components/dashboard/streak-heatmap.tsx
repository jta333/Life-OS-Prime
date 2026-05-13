"use client";

import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

interface StreakHeatmapProps {
  // dateKey -> intensity 0..1
  data: Record<string, number>;
  days?: number;
  className?: string;
}

export function StreakHeatmap({
  data,
  days = 84,
  className,
}: StreakHeatmapProps) {
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    const key = format(date, "yyyy-MM-dd");
    return { key, value: data[key] ?? 0, date };
  });

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className="grid grid-flow-col gap-1"
        style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
      >
        {cells.map(({ key, value, date }) => {
          const intensity = Math.max(0, Math.min(1, value));
          return (
            <div
              key={key}
              title={`${format(date, "MMM d")} — ${Math.round(intensity * 100)}%`}
              className="size-3 rounded-[3px] border border-border/30"
              style={{
                backgroundColor:
                  intensity === 0
                    ? "color-mix(in oklch, var(--card) 70%, transparent)"
                    : `color-mix(in oklch, var(--gold) ${
                        15 + intensity * 75
                      }%, transparent)`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{format(subDays(today, days - 1), "MMM d")}</span>
        <span>Today</span>
      </div>
    </div>
  );
}
