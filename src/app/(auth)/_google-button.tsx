"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton({
  label = "Continue with Google",
}: {
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Always let the user pick which Google account to use.
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error;
      // On success the browser is redirected to Google — keep the spinner up.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <GoogleIcon />
          {label}
        </>
      )}
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.29 5.29 0 0 1-2.3 3.47v2.88h3.72c2.18-2 3.45-4.96 3.45-8.36z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.12 0 5.73-1.03 7.64-2.79l-3.72-2.88c-1.03.69-2.36 1.1-3.92 1.1-3.01 0-5.56-2.03-6.47-4.77H1.69v2.97A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.53 14.66A7.2 7.2 0 0 1 5.15 12c0-.92.16-1.82.38-2.66V6.37H1.69A11.99 11.99 0 0 0 .42 12c0 1.94.46 3.77 1.27 5.63l3.84-2.97z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.7 0 3.22.58 4.42 1.72l3.3-3.3C17.73 1.18 15.12 0 12 0 7.31 0 3.26 2.69 1.69 6.37l3.84 2.97C6.44 6.6 8.99 4.77 12 4.77z"
      />
    </svg>
  );
}
