import { Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { OnboardingWizard } from "./_wizard";

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        label="Phase 1 · Life Analysis"
        title="Welcome to LIFE OS PRIME."
        description="We'll capture four sections — basic life structure, daily routine, health system, and goals. Two minutes per section. After this, every panel becomes yours."
        icon={Sparkles}
      />
      <OnboardingWizard />
    </div>
  );
}
