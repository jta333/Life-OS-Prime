"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { saveOnboarding } from "./actions";
import type { OnboardingPayload } from "./actions";

const INITIAL: OnboardingPayload = {
  name: "", age: "", country: "", occupation: "",
  mainGoals: "", struggles: "", personaGoal: "",
  satisfaction: 6, stress: 5, discipline: 6,
  wakeTime: "06:30", sleepTime: "23:00",
  morningRoutine: "", workSchedule: "", exerciseHabits: "",
  screenTimeHours: "5", socialMediaHours: "1.5",
  mealTiming: "", waterLiters: "2", breakHabits: "",
  focusMinutes: "90", peakHours: "", distractions: "",
  wastedMinutes: "60", currentHabits: "",
};

const SECTIONS = [
  { id: 1, label: "Basic life structure" },
  { id: 2, label: "Daily routine" },
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingPayload>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof OnboardingPayload>(
    key: K,
    value: OnboardingPayload[K]
  ) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit() {
    setSubmitting(true);
    try {
      const result = await saveOnboarding(data);
      if (!result.ok) {
        if (result.demo) {
          toast.success("Onboarding captured (demo).", {
            description: "Connect Supabase to persist your profile.",
          });
          router.push("/dashboard");
          return;
        }
        toast.error(result.error || "Couldn't save onboarding");
        return;
      }
      toast.success("Profile locked in. Welcome to your OS.");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  const progress = (step / SECTIONS.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
          <span>
            Section {step} of {SECTIONS.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="mt-3" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                step === s.id
                  ? "border-gold/50 bg-gold/15 text-gold"
                  : s.id < step
                    ? "border-emerald/40 bg-emerald/10 text-emerald-soft"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {s.id < step && <CircleCheck className="mr-1 inline size-3" />}
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        {step === 1 && <Section1 data={data} update={update} />}
        {step === 2 && <Section2 data={data} update={update} />}

        <Separator className="my-6" />
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < SECTIONS.length ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Activate LIFE OS PRIME
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Slider10({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-sm tabular-nums text-gold">{value}/10</span>
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

function Section1({
  data,
  update,
}: {
  data: OnboardingPayload;
  update: <K extends keyof OnboardingPayload>(k: K, v: OnboardingPayload[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 1"
        title="Basic life structure"
        description="The foundation. Used to compute your Life Status Overview and Performance Snapshot."
      />
      <FieldRow>
        <Field label="Name">
          <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Alex Mercer" />
        </Field>
        <Field label="Age">
          <Input type="number" value={data.age} onChange={(e) => update("age", e.target.value)} placeholder="29" />
        </Field>
        <Field label="Country">
          <Input value={data.country} onChange={(e) => update("country", e.target.value)} placeholder="United States" />
        </Field>
        <Field label="Occupation">
          <Input value={data.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="Senior engineer" />
        </Field>
      </FieldRow>
      <Field label="Main goals in life">
        <Textarea value={data.mainGoals} onChange={(e) => update("mainGoals", e.target.value)} placeholder="Ship a SaaS, run sub-3:30 marathon, build emergency fund..." rows={3} />
      </Field>
      <Field label="Biggest current struggles">
        <Textarea value={data.struggles} onChange={(e) => update("struggles", e.target.value)} placeholder="Inconsistent mornings, evening scrolling..." rows={3} />
      </Field>
      <Field label="What kind of person you want to become" hint="One sentence. Aspirational but specific.">
        <Textarea value={data.personaGoal} onChange={(e) => update("personaGoal", e.target.value)} rows={2} />
      </Field>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Slider10 value={data.satisfaction} onChange={(n) => update("satisfaction", n)} label="Satisfaction" />
        <Slider10 value={data.stress}       onChange={(n) => update("stress", n)}       label="Stress level" />
        <Slider10 value={data.discipline}   onChange={(n) => update("discipline", n)}   label="Discipline level" />
      </div>
    </div>
  );
}

function Section2({
  data,
  update,
}: {
  data: OnboardingPayload;
  update: <K extends keyof OnboardingPayload>(k: K, v: OnboardingPayload[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 2"
        title="Daily routine"
        description="Used to compute your productivity, focus, energy and lifestyle scores."
      />
      <FieldRow>
        <Field label="Wake-up time">
          <Input type="time" value={data.wakeTime} onChange={(e) => update("wakeTime", e.target.value)} />
        </Field>
        <Field label="Sleep time">
          <Input type="time" value={data.sleepTime} onChange={(e) => update("sleepTime", e.target.value)} />
        </Field>
      </FieldRow>
      <Field label="Morning routine">
        <Textarea rows={2} value={data.morningRoutine} onChange={(e) => update("morningRoutine", e.target.value)} placeholder="Cold shower, meditation, espresso..." />
      </Field>
      <FieldRow>
        <Field label="Screen time (hrs/day)">
          <Input type="number" step="0.1" value={data.screenTimeHours} onChange={(e) => update("screenTimeHours", e.target.value)} />
        </Field>
        <Field label="Social media (hrs/day)">
          <Input type="number" step="0.1" value={data.socialMediaHours} onChange={(e) => update("socialMediaHours", e.target.value)} />
        </Field>
        <Field label="Water (L/day)">
          <Input type="number" step="0.1" value={data.waterLiters} onChange={(e) => update("waterLiters", e.target.value)} />
        </Field>
        <Field label="Focus window (min)">
          <Input type="number" value={data.focusMinutes} onChange={(e) => update("focusMinutes", e.target.value)} />
        </Field>
        <Field label="Most productive hours">
          <Input value={data.peakHours} onChange={(e) => update("peakHours", e.target.value)} placeholder="08:00–11:00" />
        </Field>
        <Field label="Wasted minutes / day">
          <Input type="number" value={data.wastedMinutes} onChange={(e) => update("wastedMinutes", e.target.value)} />
        </Field>
      </FieldRow>
      <Field label="Biggest distractions">
        <Textarea rows={2} value={data.distractions} onChange={(e) => update("distractions", e.target.value)} placeholder="Slack, X, news sites" />
      </Field>
      <Field label="Current habits">
        <Textarea rows={2} value={data.currentHabits} onChange={(e) => update("currentHabits", e.target.value)} placeholder="Reading, journaling, gym..." />
      </Field>
    </div>
  );
}

function Header({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80">
        {label}
      </div>
      <h2 className="mt-1 font-display text-2xl tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
