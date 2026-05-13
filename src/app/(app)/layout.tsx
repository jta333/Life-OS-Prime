import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DemoBanner } from "@/components/layout/demo-banner";
import { getDashboardSnapshot } from "@/lib/data";
import { format, subDays } from "date-fns";

function computeStreak(checkins: { check_date: string }[]): number {
  if (!checkins.length) return 0;
  const dates = new Set(checkins.map((c) => c.check_date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (dates.has(key)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshot = await getDashboardSnapshot();
  const streak = computeStreak(snapshot.checkins);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {snapshot.isDemo && <DemoBanner />}
        <AppTopbar
          name={snapshot.profile.name}
          streak={streak}
          isDemo={snapshot.isDemo}
        />
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-8">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
