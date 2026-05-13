import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Flame,
  Gauge,
  Sparkles,
  ShieldCheck,
  Activity,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(800px 500px at 80% -10%, oklch(0.78 0.13 85 / 0.16), transparent 65%), radial-gradient(700px 500px at 0% 110%, oklch(0.7 0.15 290 / 0.16), transparent 65%)",
        }}
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative size-8 rounded-lg bg-gradient-to-br from-gold via-amber to-gold/80 shadow-[0_0_24px_-2px_oklch(0.82_0.14_85/50%)]">
            <div className="absolute inset-1 rounded-md bg-card/80 backdrop-blur" />
            <div className="absolute inset-0 flex items-center justify-center font-display text-base text-gold">
              L
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground">
              LIFE OS
            </div>
            <div className="font-display text-base">PRIME</div>
          </div>
        </Link>
        <div className="hidden items-center gap-1 text-sm md:flex">
          <a href="#system" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground">
            The System
          </a>
          <a href="#dashboard" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground">
            Dashboard
          </a>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard">
            Enter dashboard
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-6">
            <Sparkles className="size-3 text-gold" />
            Single-user performance OS
          </Badge>
          <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Operate your life like the world's most disciplined CEO.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            LIFE OS PRIME is a luxury-class AI dashboard for elite routines,
            habit mastery, and daily performance — tracked, scored, and
            continuously optimized.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Begin onboarding
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Enter dashboard</Link>
            </Button>
          </div>
        </div>

        <div id="dashboard" className="mt-16">
          <div className="relative mx-auto max-w-5xl">
            <div
              aria-hidden
              className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-gold/30 via-transparent to-violet/30"
            />
            <div className="relative rounded-[26px] border border-border/60 bg-card/60 p-3 backdrop-blur-md">
              <div className="rounded-[20px] border border-border/40 bg-background/60 p-6 md:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/80">
                      Daily snapshot · {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <h2 className="font-display text-2xl">Operating at high tier</h2>
                  </div>
                  <Badge variant="default">
                    <Flame className="size-3" /> 11-day streak
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: "Productivity", value: 82, tone: "gold" as const, icon: Gauge },
                    { label: "Discipline",   value: 76, tone: "gold" as const, icon: ShieldCheck },
                    { label: "Energy",       value: 88, tone: "cyan" as const, icon: Activity },
                    { label: "Focus",        value: 71, tone: "violet" as const, icon: Brain },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-border/60 bg-card/40 p-4">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                        <m.icon className="size-3" />
                        {m.label}
                      </div>
                      <div className="text-3xl font-semibold tabular-nums">{m.value}</div>
                      <div className="mt-2">
                        <UnicodeBar value={m.value} tone={m.tone} width={12} showPct={false} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-gold/30 bg-gold/[0.05] p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                    <Sparkles className="size-3" /> AI Life Status Overview
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    Your <strong>deep work</strong> windows are landing 28% earlier than last week — protect 08:00–10:30 and cap evening screens at 22:30 to compound the gain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="system" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80">
            MVP scope
          </div>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">
            Three modules. One disciplined loop.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Onboarding → Dashboard → Habits. Each closes the loop on the next.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: ScanLine, title: "Onboarding", body: "Two-section capture of your life structure and routine. Drives every score." },
            { icon: Gauge,    title: "Dashboard",  body: "Six KPI scores, balance ring, streak heatmap, energy curve, AI Life Status Overview." },
            { icon: Flame,    title: "Habits",     body: "Daily tracker with streaks, 12-week consistency heatmap, weekly habit report." },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-gold/40">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold/30">
                <f.icon className="size-5 text-gold" />
              </div>
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground">
          <span>LIFE OS PRIME · A premium performance OS</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
