import Link from "next/link";
import { Settings as Cog, KeyRound, Database, LogOut, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { hasAnthropic } from "@/lib/anthropic";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDashboardSnapshot } from "@/lib/data";
import { SignOutButton } from "./_sign-out";

export default async function SettingsPage() {
  const snap = await getDashboardSnapshot();
  const supabaseOn = isSupabaseConfigured();
  const aiOn = hasAnthropic();

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Account · Configuration"
        title="Settings"
        description="Profile, integrations, data, and AI configuration."
        icon={Cog}
      />

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          <Row label="Name"        value={snap.profile.name ?? "—"} />
          <Row label="Age"         value={snap.profile.age?.toString() ?? "—"} />
          <Row label="Country"     value={snap.profile.country ?? "—"} />
          <Row label="Occupation"  value={snap.profile.occupation ?? "—"} />
          <Row label="Timezone"    value={snap.profile.timezone ?? "UTC"} />
          <Row label="Onboarded"   value={snap.profile.onboarded_at ? "Yes" : "No"} />
        </CardContent>
        <Separator className="my-5" />
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding">Re-run onboarding</Link>
        </Button>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Database className="size-3.5 text-cyan" />
              Supabase backend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <StatusRow
              ok={supabaseOn}
              label={supabaseOn ? "Connected — data is persisted." : "Not configured — demo mode is active."}
            />
            <p className="text-xs text-muted-foreground">
              Add the following to your <code className="rounded bg-foreground/[0.07] px-1 py-0.5 font-mono">.env.local</code>:
            </p>
            <pre className="rounded-lg border border-border/60 bg-card/40 p-3 font-mono text-[11px] leading-relaxed text-foreground/85">
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co{"\n"}
NEXT_PUBLIC_SUPABASE_ANON_KEY=...{"\n"}
SUPABASE_SERVICE_ROLE_KEY=...
            </pre>
            <p className="text-xs text-muted-foreground">
              Migration is at <code className="rounded bg-foreground/[0.07] px-1 py-0.5 font-mono">supabase/migrations/0001_init.sql</code>.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="size-3.5 text-gold" />
              AI coach (Anthropic)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0 text-sm">
            <StatusRow
              ok={aiOn}
              label={aiOn ? "Coach is live — streaming responses enabled." : "No ANTHROPIC_API_KEY — deterministic scores only."}
            />
            <p className="text-xs text-muted-foreground">
              Add to <code className="rounded bg-foreground/[0.07] px-1 py-0.5 font-mono">.env.local</code>:
            </p>
            <pre className="rounded-lg border border-border/60 bg-card/40 p-3 font-mono text-[11px] leading-relaxed text-foreground/85">
ANTHROPIC_API_KEY=sk-ant-...
            </pre>
            <p className="text-xs text-muted-foreground">
              Coach uses Claude Haiku for chat and Claude Opus for weekly/monthly reviews.
              Prompt caching is enabled on the persona block.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <KeyRound className="size-3.5 text-rose-soft" />
            Session
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-0">
          <p className="text-sm text-muted-foreground">
            Sign out of your account. Demo sessions don't persist.
          </p>
          <SignOutButton disabled={!supabaseOn || snap.isDemo} />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={ok ? "success" : "danger"}>
        {ok ? "Active" : "Inactive"}
      </Badge>
      <span className="text-sm">{label}</span>
    </div>
  );
}
