"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Flame,
  Heart,
  Target,
  Sparkles,
  CalendarCheck,
  CalendarRange,
  CalendarDays,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  hint?: string;
}

const NAV: NavItem[] = [
  { href: "/dashboard",        label: "Dashboard",   icon: LayoutDashboard, group: "Overview" },
  { href: "/coach",            label: "AI Coach",    icon: Sparkles,        group: "Overview" },
  { href: "/check-in",         label: "Check-in",    icon: CalendarCheck,   group: "Daily" },
  { href: "/habits",           label: "Habits",      icon: Flame,           group: "Daily" },
  { href: "/routine",          label: "Routine",     icon: Activity,        group: "Daily" },
  { href: "/health",           label: "Health",      icon: Heart,           group: "Systems" },
  { href: "/goals",            label: "Goals",       icon: Target,          group: "Systems" },
  { href: "/reviews/weekly",   label: "Weekly",      icon: CalendarRange,   group: "Reviews" },
  { href: "/reviews/monthly",  label: "Monthly",     icon: CalendarDays,    group: "Reviews" },
  { href: "/settings",         label: "Settings",    icon: Settings,        group: "Account" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const groups: Record<string, NavItem[]> = {};
  NAV.forEach((item) => {
    const g = item.group ?? "Other";
    (groups[g] ||= []).push(item);
  });

  return (
    <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-border/40 md:bg-card/30 md:backdrop-blur-md">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/40 px-5">
        <div className="relative size-8 rounded-lg bg-gradient-to-br from-gold via-amber to-gold/80 shadow-[0_0_20px_-2px_oklch(0.82_0.14_85/40%)]">
          <div className="absolute inset-1 rounded-md bg-card/80 backdrop-blur" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-base text-gold">
            L
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
            LIFE OS
          </div>
          <div className="font-display text-base text-foreground">PRIME</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-luxury px-3 py-4">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-4">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              {group}
            </div>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-gold/10 text-foreground shadow-[inset_0_0_0_1px_oklch(0.78_0.13_85/25%)]"
                          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active ? "text-gold" : "text-muted-foreground/70"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span className="size-1 rounded-full bg-gold shadow-[0_0_6px_oklch(0.82_0.14_85)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border/40 px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        <div className="flex items-center justify-between">
          <span>v0.1, luxury build</span>
          <span className="size-1.5 rounded-full bg-emerald-soft" />
        </div>
      </div>
    </aside>
  );
}
