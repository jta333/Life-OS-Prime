import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { CoachChat } from "./_chat";
import { getDashboardSnapshot } from "@/lib/data";
import { hasAnthropic } from "@/lib/anthropic";

export default async function CoachPage() {
  const snap = await getDashboardSnapshot();

  return (
    <div className="space-y-8">
      <SectionHeading
        label="Section 6 · AI Coach"
        title="Your performance strategist"
        description="Elite productivity coach, behavioral psychologist, discipline mentor and systems architect — with full context of your data."
        icon={Sparkles}
      />

      <Card className="p-0 overflow-hidden">
        <CoachChat
          initialMessages={snap.coachHistory.map((m) => ({
            role: m.role,
            content: m.content,
          }))}
          aiEnabled={hasAnthropic()}
          isDemo={snap.isDemo}
          userName={snap.profile.name}
        />
      </Card>
    </div>
  );
}
