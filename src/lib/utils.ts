import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

export function pct(n: number): string {
  return `${Math.round(clamp(n))}%`;
}

export function initials(name?: string | null): string {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function formatTime(value?: string | null): string {
  if (!value) return "-";
  const [h, m] = value.split(":");
  if (!h || !m) return value;
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m.padStart(2, "0")} ${ampm}`;
}
