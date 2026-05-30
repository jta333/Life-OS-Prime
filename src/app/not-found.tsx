import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-gold/80">
          404 · Off-grid
        </div>
        <h1 className="mt-3 font-display text-5xl">Unmapped territory.</h1>
        <p className="mt-3 text-muted-foreground">
          This page isn't in your OS. Let's get you back on system.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
