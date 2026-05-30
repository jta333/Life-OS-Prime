"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  CalendarCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard",  label: "Home",   icon: LayoutDashboard },
  { href: "/habits",     label: "Habits", icon: Flame },
  { href: "/check-in",   label: "Daily",  icon: CalendarCheck },
  { href: "/goals",      label: "Goals",  icon: Target },
  { href: "/coach",      label: "Coach",  icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/40 bg-background/85 backdrop-blur-md">
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wider transition-colors",
                  active
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="size-[18px]" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
