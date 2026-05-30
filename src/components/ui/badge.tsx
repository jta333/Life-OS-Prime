import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-gold/40 bg-gold/10 text-gold",
        secondary: "border-border bg-card/60 text-muted-foreground",
        outline: "border-border/60 text-foreground/80",
        success: "border-emerald/40 bg-emerald/10 text-emerald-soft",
        danger: "border-rose/40 bg-rose/10 text-rose-soft",
        cyan: "border-cyan/40 bg-cyan/10 text-cyan",
        violet: "border-violet/40 bg-violet/10 text-violet-soft",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
