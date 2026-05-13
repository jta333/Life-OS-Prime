import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="relative overflow-hidden border-b border-violet/30 bg-violet/10 px-4 py-2.5 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-violet-soft">
        <div className="flex items-center gap-2">
          <Info className="size-3.5 shrink-0" />
          <span>
            You're viewing <strong className="font-semibold">demo data</strong>.
            Add <code className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and <code className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-[11px]">ANTHROPIC_API_KEY</code> to go live.
          </span>
        </div>
      </div>
    </div>
  );
}
