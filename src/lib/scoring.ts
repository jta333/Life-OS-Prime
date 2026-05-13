import { clamp } from "@/lib/utils";

export interface OnboardingInput {
  satisfaction?: number | null;
  stress?: number | null;
  discipline?: number | null;
  wakeTime?: string | null;
  sleepTime?: string | null;
  screenTimeHours?: number | null;
  socialMediaHours?: number | null;
  focusMinutes?: number | null;
  wastedMinutes?: number | null;
  exerciseFreqPerWeek?: number | null;
  sleepQuality?: number | null;
  dietQuality?: number | null;
  mentalState?: number | null;
  waterLiters?: number | null;
}

export interface ScoreBundle {
  productivity: number;
  discipline: number;
  lifestyle: number;
  stressIndex: number;
  balance: number;
  energy: number;
  focus: number;
  burnoutRisk: number;
}

function score10to100(n?: number | null): number {
  if (n === null || n === undefined) return 50;
  return clamp(n * 10);
}

function sleepHoursFromTimes(wake?: string | null, sleep?: string | null): number {
  if (!wake || !sleep) return 7;
  const [wh, wm] = wake.split(":").map(Number);
  const [sh, sm] = sleep.split(":").map(Number);
  if ([wh, wm, sh, sm].some((x) => Number.isNaN(x))) return 7;
  const wakeMin = wh * 60 + wm;
  const sleepMin = sh * 60 + sm;
  let diff = wakeMin - sleepMin;
  if (diff < 0) diff += 24 * 60;
  return diff / 60;
}

export function computeScores(input: OnboardingInput): ScoreBundle {
  const {
    satisfaction,
    stress,
    discipline,
    wakeTime,
    sleepTime,
    screenTimeHours = 0,
    socialMediaHours = 0,
    focusMinutes = 60,
    wastedMinutes = 60,
    exerciseFreqPerWeek = 0,
    sleepQuality,
    dietQuality,
    mentalState,
    waterLiters = 1,
  } = input;

  const hoursSleep = sleepHoursFromTimes(wakeTime, sleepTime);

  // Productivity: focus minutes vs wasted minutes, penalize heavy social media
  const focusComponent = clamp(((focusMinutes ?? 60) / 180) * 100);
  const wastePenalty = clamp(((wastedMinutes ?? 60) / 240) * 100);
  const screenPenalty = clamp(((screenTimeHours ?? 0) / 12) * 100);
  const productivity = Math.round(
    clamp(0.55 * focusComponent + 0.25 * (100 - wastePenalty) + 0.2 * (100 - screenPenalty))
  );

  // Discipline: self-reported × consistency proxy (low social media, low waste)
  const socialPenalty = clamp(((socialMediaHours ?? 0) / 6) * 100);
  const disciplineScore = Math.round(
    clamp(
      0.6 * score10to100(discipline) +
        0.2 * (100 - wastePenalty) +
        0.2 * (100 - socialPenalty)
    )
  );

  // Lifestyle: sleep + exercise + diet + hydration
  const sleepScore = clamp(
    hoursSleep >= 7 && hoursSleep <= 9 ? 95 : 100 - Math.abs(8 - hoursSleep) * 12
  );
  const exerciseScore = clamp(((exerciseFreqPerWeek ?? 0) / 6) * 100);
  const dietScore = score10to100(dietQuality);
  const waterScore = clamp(((waterLiters ?? 1) / 3) * 100);
  const lifestyle = Math.round(
    0.35 * sleepScore + 0.3 * exerciseScore + 0.25 * dietScore + 0.1 * waterScore
  );

  // Stress index 0-100 (higher = more stress)
  const stressIndex = Math.round(
    clamp(
      0.55 * score10to100(stress) +
        0.25 * (100 - score10to100(mentalState)) +
        0.2 * (100 - score10to100(sleepQuality))
    )
  );

  // Energy: inverse of stress + sleep + diet + exercise
  const energy = Math.round(
    clamp(
      0.35 * sleepScore +
        0.25 * exerciseScore +
        0.2 * (100 - stressIndex) +
        0.2 * dietScore
    )
  );

  // Focus: productivity × low-distraction
  const focus = Math.round(
    clamp(0.6 * productivity + 0.4 * (100 - socialPenalty))
  );

  // Balance: average of productivity, lifestyle, and inverse stress
  const balance = Math.round((productivity + lifestyle + (100 - stressIndex)) / 3);

  // Burnout risk: high stress + low recovery
  const burnoutRisk = Math.round(
    clamp(
      0.5 * stressIndex +
        0.25 * (100 - sleepScore) +
        0.15 * (100 - exerciseScore) +
        0.1 * (100 - score10to100(satisfaction))
    )
  );

  return {
    productivity,
    discipline: disciplineScore,
    lifestyle,
    stressIndex,
    balance,
    energy,
    focus,
    burnoutRisk,
  };
}

export interface DailyCheckInInput {
  sleepHours?: number | null;
  mood?: number | null;
  energy?: number | null;
  workout?: boolean | null;
  deepWork?: boolean | null;
  productivityRating?: number | null;
}

export function computeDailyScore(input: DailyCheckInInput): number {
  const {
    sleepHours = 7,
    mood = 6,
    energy = 6,
    workout = false,
    deepWork = false,
    productivityRating = 6,
  } = input;

  const sleepScore = clamp(
    (sleepHours ?? 7) >= 7 && (sleepHours ?? 7) <= 9
      ? 95
      : 100 - Math.abs(8 - (sleepHours ?? 7)) * 14
  );
  const moodScore = score10to100(mood);
  const energyScore = score10to100(energy);
  const prodScore = score10to100(productivityRating);
  const workoutBonus = workout ? 100 : 50;
  const deepWorkBonus = deepWork ? 100 : 40;

  return Math.round(
    0.25 * sleepScore +
      0.15 * moodScore +
      0.15 * energyScore +
      0.25 * prodScore +
      0.1 * workoutBonus +
      0.1 * deepWorkBonus
  );
}

export function unicodeBar(value: number, width = 10): string {
  const filled = Math.round((clamp(value) / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export function scoreVerdict(value: number): { label: string; tone: "rose" | "amber" | "gold" | "emerald" } {
  if (value >= 85) return { label: "Elite", tone: "emerald" };
  if (value >= 70) return { label: "Strong", tone: "gold" };
  if (value >= 55) return { label: "Solid", tone: "gold" };
  if (value >= 40) return { label: "Needs work", tone: "amber" };
  return { label: "Critical", tone: "rose" };
}
