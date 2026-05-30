"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title?: string;
  markdown: string;
  className?: string;
  tone?: "gold" | "cyan" | "violet";
}

const toneRing: Record<NonNullable<InsightCardProps["tone"]>, string> = {
  gold: "from-gold/25 via-amber/10 to-transparent",
  cyan: "from-cyan/25 via-cyan/10 to-transparent",
  violet: "from-violet/25 via-violet/10 to-transparent",
};

export function InsightCard({
  title = "AI Coach Insight",
  markdown,
  className,
  tone = "gold",
}: InsightCardProps) {
  return (
    <Card className={cn("relative overflow-hidden p-6", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-50",
          toneRing[tone]
        )}
        style={{ maskImage: "radial-gradient(closest-side, black, transparent)" }}
      />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-full bg-gold/15 p-1.5">
            <Sparkles className="size-3.5 text-gold" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
        </div>
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => (
                <h2 className="mt-4 mb-2 text-base font-semibold" {...props} />
              ),
              h2: (props) => (
                <h3 className="mt-4 mb-2 text-sm font-semibold tracking-tight text-foreground" {...props} />
              ),
              h3: (props) => (
                <h4 className="mt-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground" {...props} />
              ),
              p: (props) => (
                <p className="my-2 text-sm leading-relaxed text-foreground/90" {...props} />
              ),
              ul: (props) => (
                <ul className="my-2 ml-5 list-disc space-y-1 text-sm text-foreground/90" {...props} />
              ),
              ol: (props) => (
                <ol className="my-2 ml-5 list-decimal space-y-1 text-sm text-foreground/90" {...props} />
              ),
              code: ({ className, children, ...props }) => (
                <code
                  className={cn(
                    "rounded bg-foreground/[0.07] px-1.5 py-0.5 font-mono text-[12px] text-gold",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              ),
              table: (props) => (
                <div className="my-3 overflow-hidden rounded-lg border border-border/60">
                  <table className="w-full text-sm" {...props} />
                </div>
              ),
              th: (props) => (
                <th className="border-b border-border/60 bg-card/60 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" {...props} />
              ),
              td: (props) => (
                <td className="border-b border-border/40 px-3 py-2 text-foreground/90 last:border-0" {...props} />
              ),
              strong: (props) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </Card>
  );
}
