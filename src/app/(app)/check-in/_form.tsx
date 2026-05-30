"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { saveCheckIn } from "./actions";
import type { DailyCheckIn } from "@/types/database";

interface Props {
  today: string;
  existing: DailyCheckIn | null;
  isDemo: boolean;
}

export function CheckInForm({ today, existing, isDemo }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(existing?.daily_score ?? null);

  const [wakeTime, setWakeTime] = useState(existing?.wake_time ?? "06:30");
  const [sleepHours, setSleepHours] = useState(String(existing?.sleep_hours ?? "7.5"));
  const [mood, setMood] = useState(existing?.mood ?? 7);
  const [energy, setEnergy] = useState(existing?.energy ?? 7);
  const [mainGoal, setMainGoal] = useState(existing?.main_goal ?? "");
  const [workout, setWorkout] = useState(existing?.workout ?? false);
  const [deepWork, setDeepWork] = useState(existing?.deep_work ?? false);
  const [biggestDistraction, setBiggestDistraction] = useState(existing?.biggest_distraction ?? "");
  const [productivityRating, setProductivityRating] = useState(existing?.productivity_rating ?? 7);
  const [wins, setWins] = useState(existing?.wins ?? "");
  const [failures, setFailures] = useState(existing?.failures ?? "");
  const [tomorrowFocus, setTomorrowFocus] = useState(existing?.tomorrow_focus ?? "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await saveCheckIn({
        date: today,
        wakeTime,
        sleepHours: Number(sleepHours),
        mood,
        energy,
        mainGoal,
        workout,
        deepWork,
        biggestDistraction,
        productivityRating,
        wins,
        failures,
        tomorrowFocus,
      });
      if (!result.ok && !result.demo) {
        toast.error(result.error || "Couldn't save");
        return;
      }
      setScore(result.score);
      toast.success(
        `Daily score: ${result.score}/100${isDemo || result.demo ? " (demo)" : ""}`
      );
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="What time did you wake up?">
          <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
        </Field>
        <Field label="Sleep hours">
          <Input
            type="number"
            step="0.1"
            min="0"
            max="14"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SliderField label="Mood" value={mood} onChange={setMood} />
        <SliderField label="Energy" value={energy} onChange={setEnergy} />
        <SliderField label="Productivity rating" value={productivityRating} onChange={setProductivityRating} />
      </div>

      <Field label="Main goal today">
        <Input value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToggleRow label="Workout completed" checked={workout} onChange={setWorkout} />
        <ToggleRow label="Deep work completed" checked={deepWork} onChange={setDeepWork} />
      </div>

      <Field label="Biggest distraction today">
        <Input value={biggestDistraction} onChange={(e) => setBiggestDistraction(e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Wins today">
          <Textarea rows={3} value={wins} onChange={(e) => setWins(e.target.value)} />
        </Field>
        <Field label="Failures / friction">
          <Textarea rows={3} value={failures} onChange={(e) => setFailures(e.target.value)} />
        </Field>
      </div>

      <Field label="Tomorrow's primary focus">
        <Textarea rows={2} value={tomorrowFocus} onChange={(e) => setTomorrowFocus(e.target.value)} />
      </Field>

      {score !== null && (
        <div className="rounded-xl border border-gold/30 bg-gold/[0.07] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Sparkles className="size-3.5 text-gold" /> Daily score
            </div>
            <span className="font-mono text-2xl tabular-nums text-gold">
              {score}/100
            </span>
          </div>
          <div className="mt-2">
            <UnicodeBar value={score} width={20} showPct={false} />
          </div>
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="size-4" />
            Score my day
          </>
        )}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-xs tabular-nums text-gold">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[oklch(0.78_0.13_85)]"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2.5">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
