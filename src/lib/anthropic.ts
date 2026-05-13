import Anthropic from "@anthropic-ai/sdk";
import { LIFE_OS_PRIME_PERSONA } from "@/lib/persona";

export const COACH_MODEL = "claude-haiku-4-5-20251001";
export const DEEP_MODEL = "claude-opus-4-7";

let cached: Anthropic | null = null;

export function hasAnthropic(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getAnthropic(): Anthropic {
  if (cached) return cached;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to your environment to enable the AI coach."
    );
  }
  cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return cached;
}

// Reusable cached system block so persona stays in prompt cache.
export const cachedSystem = [
  {
    type: "text" as const,
    text: LIFE_OS_PRIME_PERSONA,
    cache_control: { type: "ephemeral" as const },
  },
];
