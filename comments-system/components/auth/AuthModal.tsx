"use client";

// components/auth/AuthModal.tsx
// Beautiful auth modal with Login | Register tabs.
// Register tab includes community guidelines checkbox (required)
// and newsletter subscribe checkbox (optional, default checked).

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { signUpWithEmail, signInWithEmail } from "@/actions/auth";
import { createClient } from "@/lib/supabase";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-center">
            Join the conversation
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Sign in to leave a comment
          </p>
        </DialogHeader>

        <Tabs defaultValue="login" className="px-6 pb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>

        {/* Google OAuth divider */}
        <div className="px-6 pb-6">
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <GoogleSignInButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Login Form ──────────────────────────────────────────────────────────
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await signInWithEmail(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

// ── Register Form ───────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!guidelinesAccepted) {
      toast.error("You must agree to the community guidelines to register.");
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(email, password, newsletterOptIn);
    setLoading(false);

    if (result.success) {
      if (result.newsletterSubscribed) {
        toast.success("Welcome! You're now subscribed to the newsletter.", {
          duration: 5000,
        });
      } else {
        toast.success(result.message);
      }
      onSuccess();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-confirm">Confirm Password</Label>
        <Input
          id="reg-confirm"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          className={
            confirmPassword && password !== confirmPassword
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-500">Passwords do not match.</p>
        )}
      </div>

      {/* ── Community Guidelines Checkbox (REQUIRED) ────────────────── */}
      <div className="flex items-start space-x-3 rounded-md border p-3 bg-muted/30">
        <Checkbox
          id="reg-guidelines"
          checked={guidelinesAccepted}
          onCheckedChange={(checked) => setGuidelinesAccepted(checked === true)}
          className="mt-0.5"
          required
        />
        <Label htmlFor="reg-guidelines" className="text-xs leading-relaxed cursor-pointer">
          I agree to the community guidelines: No posting links, no posting pictures or
          images (including markdown or embeds), no foul words or profanity of any kind,
          and all comments must remain respectful and on-topic. I understand that the site
          administrator has the absolute right to remove any comment or permanently ban any
          user for any reason whatsoever, at any time, without notice or appeal.
        </Label>
      </div>

      {/* ── Newsletter Checkbox (OPTIONAL, checked by default) ──────── */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="reg-newsletter"
          checked={newsletterOptIn}
          onCheckedChange={(checked) => setNewsletterOptIn(checked === true)}
          className="mt-0.5"
        />
        <Label htmlFor="reg-newsletter" className="text-xs leading-relaxed cursor-pointer">
          Subscribe me to the newsletter — receive occasional updates, new posts, and
          exclusive content via email. You can unsubscribe anytime.
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading || !guidelinesAccepted}>
        {loading ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

// ── Google OAuth Button ─────────────────────────────────────────────────
function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
    }
    // If successful, the page will redirect to Google
  }

  return (
    <Button
      variant="outline"
      className="w-full mt-3"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
