import { format } from "date-fns";
import { CalendarCheck } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnicodeBar } from "@/components/dashboard/unicode-bar";
import { getDashboardSnapshot } from "@/lib/data";
import { CheckInForm } from "./_form";

export default async function CheckInPage() {
  const snap = await getDashboardSnapshot();
  const today = format(new Date(), "yyyy-MM-dd");
  const todays = snap.checkins.find((c) => c.check_date === today);

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Daily Check-In Mode"
        title={todays ? "Today's check-in" : "Run today's check-in"}
        description="12 questions. One daily score. One tomorrow plan. Compounding clarity."
        icon={CalendarCheck}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <CheckInForm
            today={today}
            existing={todays ?? null}
            isDemo={snap.isDemo}
          />
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Last 7 check-ins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 text-sm">
            {snap.checkins.slice(0, 7).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 px-3 py-2"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {format(new Date(c.check_date), "MMM d")}
                </span>
                <UnicodeBar value={c.daily_score ?? 0} width={8} />
              </div>
            ))}
            {!snap.checkins.length && (
              <p className="text-muted-foreground">
                No history yet, your first check-in starts the streak.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {todays?.ai_summary && (
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Badge variant="default">AI Summary</Badge>
            <span>Today's review</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {todays.ai_summary}
          </p>
        </Card>
      )}
    </div>
  );
}
