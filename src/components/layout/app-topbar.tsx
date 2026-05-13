"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Flame,
  Sparkles,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";

interface AppTopbarProps {
  name?: string | null;
  streak: number;
  isDemo: boolean;
}

export function AppTopbar({ name, streak, isDemo }: AppTopbarProps) {
  const now = new Date();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/40 bg-background/60 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex md:items-center md:gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.18em]">
            {format(now, "EEE · MMM d, yyyy")}
          </span>
          <ChevronRight className="size-3" />
          <span className="text-foreground">Today's operating window</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isDemo && (
          <Badge variant="violet" className="hidden sm:inline-flex">
            <Sparkles className="size-3" />
            Demo data
          </Badge>
        )}
        <Badge variant="default">
          <Flame className="size-3" />
          {streak}-day streak
        </Badge>
        <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
          <Link href="/check-in">
            <Sparkles className="size-3.5" />
            Daily check-in
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/settings" aria-label="Settings">
            <Settings className="size-4" />
          </Link>
        </Button>
        <div className="ml-1 flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-gold/70 to-amber/40 text-xs font-semibold text-[oklch(0.18_0.02_70)] ring-1 ring-gold/30">
          {initials(name)}
        </div>
      </div>
    </header>
  );
}
