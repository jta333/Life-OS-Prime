"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-rose-soft">
          System fault
        </div>
        <h1 className="mt-3 font-display text-4xl">Something fell out of sync.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset} className="mt-6">
          <RotateCw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
