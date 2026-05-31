import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { GoogleAuthButton } from "../_google-button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const notice =
    error === "not_authorized"
      ? "That Google account isn't authorized for this app."
      : error === "auth"
        ? "Sign-in failed. Please try again."
        : null;
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(600px 400px at 80% 0%, oklch(0.78 0.13 85 / 0.18), transparent 70%)",
        }}
      />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-10">
        <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
          <div className="relative size-9 rounded-lg bg-gradient-to-br from-gold via-amber to-gold/80 shadow-[0_0_24px_-2px_oklch(0.82_0.14_85/50%)]">
            <div className="absolute inset-1 rounded-md bg-card/80 backdrop-blur" />
            <div className="absolute inset-0 flex items-center justify-center font-display text-base text-gold">
              L
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground">
              LIFE OS
            </div>
            <div className="font-display text-base">PRIME</div>
          </div>
        </Link>
        <Card className="w-full p-7">
          <h1 className="font-display text-2xl">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue your performance ritual.
          </p>
          {notice && (
            <div className="mt-4 rounded-lg border border-rose-soft/40 bg-rose-soft/10 px-3 py-2 text-xs text-rose-soft">
              {notice}
            </div>
          )}
          {isSupabaseConfigured() ? (
            <div className="mt-6">
              <GoogleAuthButton label="Sign in with Google" />
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-violet/30 bg-violet/10 p-4 text-sm text-violet-soft">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Sparkles className="size-3.5" />
                Demo mode active
              </div>
              <p className="text-violet-soft/90">
                Supabase isn't configured. The full dashboard works with demo data —
                no sign-in required.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/dashboard">
                  Open demo dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link href="/sign-up" className="text-gold hover:text-gold/80">
              Begin onboarding
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
