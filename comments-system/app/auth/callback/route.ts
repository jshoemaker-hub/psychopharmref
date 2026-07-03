// app/auth/callback/route.ts
// Handles the OAuth redirect from Supabase (Google sign-in).
// Exchanges the auth code for a session, then redirects back to the page.

import { createServerSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to home with an error indicator
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
