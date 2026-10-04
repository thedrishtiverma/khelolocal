import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKhelo } from "@/lib/services/store";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in | KheloLocal" },
      {
        name: "description",
        content: "Log in to KheloLocal to manage tournaments, results and your sporting profile.",
      },
      { property: "og:title", content: "Log in | KheloLocal" },
      { property: "og:description", content: "Log in to your KheloLocal account." },
    ],
  }),
  component: LoginPage,
});

const DEMO = [
  { label: "Athlete", email: "athlete@khelolocal.demo", to: "/athlete" as const },
  { label: "Athlete (SGSITS — Drishti)", email: "drishti@sgsits.demo", to: "/athlete" as const },
  { label: "Organizer", email: "organizer@khelolocal.demo", to: "/organizer" as const },
  {
    label: "College (SGSITS Sports Cell)",
    email: "college@khelolocal.demo",
    to: "/college" as const,
  },
  {
    label: "Volunteer (Vijay Nagar zone)",
    email: "volunteer@khelolocal.demo",
    to: "/volunteer" as const,
  },
  { label: "Admin (DB manager + verifier)", email: "admin@khelolocal.demo", to: "/admin" as const },
  { label: "Scout / Coach / Team", email: "scout@khelolocal.demo", to: "/scout" as const },
];

function LoginPage() {
  const { login } = useKhelo();
  const demoMode = !isSupabaseConfigured();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const doLogin = async (value: string, valuePassword = password) => {
    setBusy(true);
    try {
      const user = await login(value, valuePassword);
      setBusy(false);
      if (!user) {
        setError("We couldn't find an account with that email or password.");
        return;
      }
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      const target =
        user.role === "ORGANIZER"
          ? "/organizer"
          : user.role === "SCOUT"
            ? "/scout"
            : user.role === "COLLEGE"
              ? "/college"
              : user.role === "VOLUNTEER"
                ? "/volunteer"
                : user.role === "ADMIN"
                  ? "/admin"
                  : "/athlete";
      navigate({ to: target });
    } catch (error) {
      setBusy(false);
      setError(error instanceof Error ? error.message : "Unable to log in right now.");
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-black">Log in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick up where you left off in your city's sports network.
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            void doLogin(email, password);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            {demoMode ? (
              <span className="text-xs text-muted-foreground">
                Demo accounts are available beside this form.
              </span>
            ) : (
              <Link
                to="/forgot-password"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            )}
            <Link to="/signup" className="font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>

      {demoMode ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Demo access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One tap sign-in for every KheloLocal role.
          </p>
          <div className="mt-5 space-y-3">
            {DEMO.map((d) => (
              <button
                key={d.email}
                onClick={() => void doLogin(d.email, "")}
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-left transition-colors hover:border-lime"
              >
                <span>
                  <span className="block font-semibold">{d.label}</span>
                  <span className="block text-xs text-muted-foreground">{d.email}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-lime">Enter</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="font-display text-2xl font-black uppercase leading-none">
            Your local game,
            <br />
            your account.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Sign in with the email and password you used to join KheloLocal. Your session stays
            active on this device until you log out.
          </p>
          <div className="mt-8 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
            New here? Choose a role first, then create an account built around how you play,
            organize or support local sport.
          </div>
        </div>
      )}
    </div>
  );
}
