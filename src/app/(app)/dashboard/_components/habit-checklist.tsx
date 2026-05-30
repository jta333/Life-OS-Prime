"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toggleHabit } from "../actions";
import type { Habit, HabitLog } from "@/types/database";

interface Props {
  habits: Habit[];
  todaysLogs: HabitLog[];
  todayKey: string;
  isDemo: boolean;
}

export function HabitChecklist({ habits, todaysLogs, todayKey, isDemo }: Props) {
  const initial: Record<string, boolean> = {};
  habits.forEach((h) => {
    initial[h.id] = todaysLogs.some(
      (l) => l.habit_id === h.id && l.completed
    );
  });
  const [state, setState] = useState(initial);
  const [, startTransition] = useTransition();

  function onToggle(habitId: string, next: boolean) {
    setState((s) => ({ ...s, [habitId]: next }));
    if (isDemo) {
      toast(next ? "Marked complete (demo)" : "Unmarked (demo)", {
        description: "Connect Supabase to persist habits.",
      });
      return;
    }
    startTransition(async () => {
      const res = await toggleHabit(habitId, todayKey, next);
      if (!res.ok) {
        toast.error("Couldn't save");
        setState((s) => ({ ...s, [habitId]: !next }));
      }
    });
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {habits.map((h) => {
        const done = state[h.id] ?? false;
        return (
          <li key={h.id}>
            <label
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5 transition-all",
                done && "border-gold/40 bg-gold/[0.05]"
              )}
            >
              <Checkbox
                checked={done}
                onCheckedChange={(v) => onToggle(h.id, Boolean(v))}
              />
              <span
                className={cn(
                  "flex-1 text-sm transition-colors",
                  done && "text-muted-foreground line-through decoration-gold/70"
                )}
              >
                {h.name}
              </span>
              {h.kind === "negative" && (
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  avoid
                </span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
