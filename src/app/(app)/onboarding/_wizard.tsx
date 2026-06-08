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

interface FormState {
  // Section 1
  name: string;
  age: string;
  country: string;
  occupation: string;
  mainGoals: string;
  struggles: string;
  personaGoal: string;
  satisfaction: number;
  stress: number;
  discipline: number;
  // Section 2
  wakeTime: string;
  sleepTime: string;
  morningRoutine: string;
  workSchedule: string;
  exerciseHabits: string;
  screenTimeHours: string;
  socialMediaHours: string;
  mealTiming: string;
  waterLiters: string;
  breakHabits: string;
  focusMinutes: string;
  peakHours: string;
  distractions: string;
  wastedMinutes: string;
  currentHabits: string;
  // Section 3
  sleepQuality: number;
  exerciseFreqPerWeek: string;
  fitnessGoals: string;
  dietQuality: number;
  caffeineMg: string;
  mentalState: number;
  stressTriggers: string;
  energyCrashes: string;
  medicalLimits: string;
  // Section 4 (goals captured as free-text per category for v1)
  financialGoals: string;
  careerGoals: string;
  relationshipGoals: string;
  learningGoals: string;
  fitnessGoals2: string;
  socialGoals: string;
  businessGoals: string;
  monthlyTargets: string;
  vision: string;
  dreams: string;
}

const INITIAL: FormState = {
  name: "", age: "", country: "", occupation: "",
  mainGoals: "", struggles: "", personaGoal: "",
  satisfaction: 6, stress: 5, discipline: 6,
  wakeTime: "06:30", sleepTime: "23:00",
  morningRoutine: "", workSchedule: "", exerciseHabits: "",
  screenTimeHours: "5", socialMediaHours: "1.5",
  mealTiming: "", waterLiters: "2", breakHabits: "",
  focusMinutes: "90", peakHours: "", distractions: "",
  wastedMinutes: "60", currentHabits: "",
  sleepQuality: 7, exerciseFreqPerWeek: "3", fitnessGoals: "",
  dietQuality: 7, caffeineMg: "200", mentalState: 7,
  stressTriggers: "", energyCrashes: "", medicalLimits: "",
  financialGoals: "", careerGoals: "", relationshipGoals: "",
  learningGoals: "", fitnessGoals2: "", socialGoals: "",
  businessGoals: "", monthlyTargets: "", vision: "", dreams: "",
};

const SECTIONS = [
  { id: 1, label: "Basic life structure" },
  { id: 2, label: "Daily routine" },
  { id: 3, label: "Health & energy" },
  { id: 4, label: "Goals & ambition" },
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
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
        {step === 3 && <Section3 data={data} update={update} />}
        {step === 4 && <Section4 data={data} update={update} />}

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
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 1"
        title="Basic life structure"
        description="The foundation. Used to compute your Life Status Overview, Performance Snapshot, and Improvement Potential."
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
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 2"
        title="Daily routine analysis"
        description="Used to build your daily timeline, energy curve, focus blocks and optimized routine."
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
      <Field label="Work / study schedule">
        <Textarea rows={2} value={data.workSchedule} onChange={(e) => update("workSchedule", e.target.value)} />
      </Field>
      <Field label="Exercise habits">
        <Textarea rows={2} value={data.exerciseHabits} onChange={(e) => update("exerciseHabits", e.target.value)} />
      </Field>
      <FieldRow>
        <Field label="Screen time (hrs/day)">
          <Input type="number" step="0.1" value={data.screenTimeHours} onChange={(e) => update("screenTimeHours", e.target.value)} />
        </Field>
        <Field label="Social media (hrs/day)">
          <Input type="number" step="0.1" value={data.socialMediaHours} onChange={(e) => update("socialMediaHours", e.target.value)} />
        </Field>
        <Field label="Water intake (L/day)">
          <Input type="number" step="0.1" value={data.waterLiters} onChange={(e) => update("waterLiters", e.target.value)} />
        </Field>
        <Field label="Focus duration (min)">
          <Input type="number" value={data.focusMinutes} onChange={(e) => update("focusMinutes", e.target.value)} />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field label="Meal timing">
          <Input value={data.mealTiming} onChange={(e) => update("mealTiming", e.target.value)} placeholder="7:30, 12:30, 19:00" />
        </Field>
        <Field label="Break habits">
          <Input value={data.breakHabits} onChange={(e) => update("breakHabits", e.target.value)} placeholder="Pomodoro, short walks..." />
        </Field>
        <Field label="Most productive hours">
          <Input value={data.peakHours} onChange={(e) => update("peakHours", e.target.value)} placeholder="08:00-11:00" />
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

function Section3({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 3"
        title="Health & energy system"
        description="Feeds your health dashboard, energy curve, burnout risk analysis, and recovery score."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Slider10 value={data.sleepQuality} onChange={(n) => update("sleepQuality", n)} label="Sleep quality" />
        <Slider10 value={data.dietQuality}  onChange={(n) => update("dietQuality", n)}  label="Diet quality" />
        <Slider10 value={data.mentalState}  onChange={(n) => update("mentalState", n)}  label="Mental state" />
      </div>
      <FieldRow>
        <Field label="Exercise frequency (×/week)">
          <Input type="number" value={data.exerciseFreqPerWeek} onChange={(e) => update("exerciseFreqPerWeek", e.target.value)} />
        </Field>
        <Field label="Caffeine (mg/day)">
          <Input type="number" value={data.caffeineMg} onChange={(e) => update("caffeineMg", e.target.value)} />
        </Field>
      </FieldRow>
      <Field label="Fitness goals">
        <Textarea rows={2} value={data.fitnessGoals} onChange={(e) => update("fitnessGoals", e.target.value)} />
      </Field>
      <Field label="Stress triggers">
        <Textarea rows={2} value={data.stressTriggers} onChange={(e) => update("stressTriggers", e.target.value)} />
      </Field>
      <Field label="Energy crashes">
        <Textarea rows={2} value={data.energyCrashes} onChange={(e) => update("energyCrashes", e.target.value)} placeholder="Post-lunch slump..." />
      </Field>
      <Field label="Medical limitations">
        <Textarea rows={2} value={data.medicalLimits} onChange={(e) => update("medicalLimits", e.target.value)} placeholder="Anything we should respect" />
      </Field>
    </div>
  );
}

function Section4({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <Header
        label="Section 4"
        title="Goals & ambition system"
        description="Used to generate your goal architecture map, priority matrix, milestone tracker and strategic roadmap."
      />
      <FieldRow>
        <Field label="Financial goals">
          <Textarea rows={2} value={data.financialGoals} onChange={(e) => update("financialGoals", e.target.value)} />
        </Field>
        <Field label="Career goals">
          <Textarea rows={2} value={data.careerGoals} onChange={(e) => update("careerGoals", e.target.value)} />
        </Field>
        <Field label="Relationship goals">
          <Textarea rows={2} value={data.relationshipGoals} onChange={(e) => update("relationshipGoals", e.target.value)} />
        </Field>
        <Field label="Learning goals">
          <Textarea rows={2} value={data.learningGoals} onChange={(e) => update("learningGoals", e.target.value)} />
        </Field>
        <Field label="Fitness goals">
          <Textarea rows={2} value={data.fitnessGoals2} onChange={(e) => update("fitnessGoals2", e.target.value)} />
        </Field>
        <Field label="Social goals">
          <Textarea rows={2} value={data.socialGoals} onChange={(e) => update("socialGoals", e.target.value)} />
        </Field>
        <Field label="Business goals">
          <Textarea rows={2} value={data.businessGoals} onChange={(e) => update("businessGoals", e.target.value)} />
        </Field>
        <Field label="Monthly targets">
          <Textarea rows={2} value={data.monthlyTargets} onChange={(e) => update("monthlyTargets", e.target.value)} />
        </Field>
      </FieldRow>
      <Field label="Long-term vision">
        <Textarea rows={3} value={data.vision} onChange={(e) => update("vision", e.target.value)} placeholder="Where do you want to be in 5 years?" />
      </Field>
      <Field label="Biggest dreams">
        <Textarea rows={3} value={data.dreams} onChange={(e) => update("dreams", e.target.value)} />
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
