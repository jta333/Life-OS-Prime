"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegenerateButton({ scope }: { scope: "weekly" | "monthly" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Insight regenerated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={run} disabled={loading} size="sm" variant="outline">
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <>
          <RotateCw className="size-3.5" />
          Regenerate
        </>
      )}
    </Button>
  );
}
