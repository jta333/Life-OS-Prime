import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Server-only allowlist. ALLOWED_EMAILS is a comma-separated list of the only
// addresses permitted to sign in. Left unset (e.g. for self-hosters) the app
// is open; set it to your own email to lock the app down to you alone. The
// value lives only in the environment, never in the public repo.
function isAllowedEmail(email: string | undefined | null): boolean {
  const raw = process.env.ALLOWED_EMAILS;
  if (!raw) return true; // no allowlist configured -> no restriction
  if (!email) return false;
  const allowed = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/sign-in?error=auth`);
    }

    // Enforce the email allowlist: reject anyone who isn't permitted.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!isAllowedEmail(user?.email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/sign-in?error=not_authorized`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
