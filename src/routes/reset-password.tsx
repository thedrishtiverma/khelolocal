import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseClientIfConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Choose a new password | KheloLocal" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (password.length < 8) return toast.error("Use at least 8 characters.");
    if (password !== confirmation) return toast.error("Passwords do not match.");
    const client = getSupabaseClientIfConfigured();
    if (!client) return toast.error("Password reset is not configured.");
    setBusy(true);
    const { error } = await client.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You can log in now.");
    navigate({ to: "/login" });
  };
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">
        Account recovery
      </p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none">
        Choose a new password.
      </h1>
      <form
        className="mt-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-new-password">Confirm new password</Label>
          <Input
            id="confirm-new-password"
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-semibold text-foreground hover:underline">
            Back to log in
          </Link>
        </p>
      </form>
    </div>
  );
}
