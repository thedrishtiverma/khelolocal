import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
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
      if (
        !demoMode &&
        !user.cityId &&
        !localStorage.getItem(`khelolocal.profile-ready.${user.id}`)
      ) {
        navigate({ to: "/profile/setup" });
        return;
      }
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
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-0 px-4 py-8 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:py-12">
      <div className="relative overflow-hidden rounded-t-2xl bg-primary p-7 text-primary-foreground sm:p-12 lg:min-h-[37rem] lg:rounded-l-2xl lg:rounded-tr-none">
        <div className="absolute -right-20 -top-24 size-96 rounded-full border-[2rem] border-lime/20" />
        <div className="absolute bottom-0 right-0 h-1/2 w-3/4 bg-[linear-gradient(145deg,transparent_48%,rgba(255,255,255,.12)_49%,transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-lime">
              KheloLocal / member access
            </p>
            <h1 className="mt-7 max-w-lg font-display text-5xl font-black uppercase leading-[.78] tracking-tight sm:text-7xl">
              Back where
              <br />
              <span className="text-lime">the game is.</span>
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-6 text-primary-foreground/75">
              Your tournaments, local connections and sporting record are waiting on the other side.
            </p>
          </div>
          <div className="mt-16 flex items-center gap-3 text-xs font-bold uppercase tracking-[.14em]">
            <span className="grid size-9 place-items-center rounded-full border border-primary-foreground/25">
              <LockKeyhole className="size-4" />
            </span>{" "}
            Secure local session
          </div>
        </div>
      </div>
      <div className="rounded-b-2xl border border-border bg-card p-7 sm:p-12 lg:rounded-r-2xl lg:rounded-bl-none">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">
          Member sign in
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase">Welcome back.</h2>
        <form
          className="mt-8 space-y-5"
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
            {busy ? (
              "Opening your workspace…"
            ) : (
              <>
                Enter KheloLocal <ArrowUpRight className="size-4" />
              </>
            )}
          </Button>
          <div className="flex items-center justify-between text-sm">
            {demoMode ? (
              <span className="text-xs text-muted-foreground">
                Demo accounts are available below.
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
        <div className="rounded-b-2xl border border-t-0 border-border bg-card p-6 lg:col-start-2 lg:rounded-b-2xl">
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
      ) : null}
    </div>
  );
}
