import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseClientIfConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password | KheloLocal" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendReset = async () => {
    const client = getSupabaseClientIfConfigured();
    if (!client) {
      toast.error("Password reset is available when KheloLocal is connected to Supabase.");
      return;
    }
    setBusy(true);
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">
        Account recovery
      </p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none">
        Get back in the game.
      </h1>
      {sent ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="font-semibold">Check your inbox.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            If an account exists for {email}, we’ve sent a password-reset link.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm font-bold hover:underline">
            Back to log in
          </Link>
        </div>
      ) : (
        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void sendReset();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email address</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Sending link…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
