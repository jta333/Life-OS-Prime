import { Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { OnboardingWizard } from "./_wizard";

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        label="Phase 1 · Life Analysis"
        title="Welcome to LIFE OS PRIME."
        description="Two sections — basic life structure and daily routine. Three minutes total. After this, every panel becomes yours."
        icon={Sparkles}
      />
      <OnboardingWizard />
    </div>
  );
}
