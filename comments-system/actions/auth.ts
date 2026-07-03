"use server";

// actions/auth.ts
// Server actions for authentication: sign up with email, sign in, sign out.

import { createServerSupabase } from "@/lib/supabase";
import type { AuthResult } from "@/types";

/**
 * Sign up a new user with email and password.
 * Stores newsletter preference in raw_user_meta_data and optionally
 * inserts into the newsletter_subscribers table via a DB trigger.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  newsletterSubscribed: boolean
): Promise<AuthResult> {
  const supabase = await createServerSupabase();

  // Derive a display name from the email (part before @)
  const username = email.split("@")[0].slice(0, 30);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        newsletter_subscribed: newsletterSubscribed,
      },
    },
  });

  if (error) {
    // Supabase returns specific error messages we can relay
    if (error.message.includes("already registered")) {
      return { success: false, error: "This email is already registered. Try signing in instead." };
    }
    if (error.message.includes("Password")) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    return { success: false, error: error.message };
  }

  // If email confirmation is enabled, user won't be immediately logged in
  if (data.user && !data.session) {
    return {
      success: true,
      message: "Check your email to confirm your account, then sign in.",
      newsletterSubscribed,
    };
  }

  return {
    success: true,
    message: newsletterSubscribed
      ? "Welcome! You're now subscribed to the newsletter."
      : "Account created successfully!",
    newsletterSubscribed,
  };
}

/**
 * Sign in an existing user with email and password.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { success: false, error: "Invalid email or password." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { success: false, error: "Please confirm your email before signing in. Check your inbox." };
    }
    return { success: false, error: error.message };
  }

  return { success: true, message: "Signed in successfully." };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Signed out." };
}
