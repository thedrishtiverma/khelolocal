import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
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
  { label: "Athlete — Drishti", email: "drishti@sgsits.demo", to: "/athlete" as const },
  { label: "Organizer", email: "organizer@khelolocal.demo", to: "/organizer" as const },
  {
    label: "College — SGSITS",
    email: "college@khelolocal.demo",
    to: "/college" as const,
  },
  {
    label: "Volunteer — Vijay Nagar",
    email: "volunteer@khelolocal.demo",
    to: "/volunteer" as const,
  },
  { label: "Admin / verifier", email: "admin@khelolocal.demo", to: "/admin" as const },
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
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:gap-8 lg:py-12">
      <div className="relative isolate overflow-hidden rounded-2xl bg-primary p-7 text-primary-foreground shadow-card sm:p-10 lg:min-h-[38rem] lg:p-12 dark:bg-gradient-to-br dark:from-surface dark:via-background dark:to-surface dark:text-surface-foreground">
        <div className="absolute -right-20 -top-24 -z-10 size-96 rounded-full border-[2rem] border-lime/20 dark:border-lime/15" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(145deg,transparent_48%,rgba(255,255,255,.12)_49%,transparent_50%)] dark:opacity-40" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-lime dark:border-surface-foreground/15 dark:bg-surface-foreground/5">
              <span className="size-1.5 rounded-full bg-lime" />
              KheloLocal / member access
            </p>
            <h1 className="mt-9 max-w-lg font-display text-5xl font-black uppercase leading-[.9] tracking-tight sm:text-6xl lg:text-7xl">
              Back where
              <br />
              <span className="text-lime">the game is.</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-primary-foreground/80 dark:text-surface-foreground/80">
              Your tournaments, local connections and sporting record are waiting on the other side.
            </p>
          </div>
          <div className="mt-16 flex items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/80 dark:text-surface-foreground/80">
            <span className="grid size-9 place-items-center rounded-full border border-primary-foreground/25 dark:border-surface-foreground/25">
              <LockKeyhole className="size-4" />
            </span>
            Secure local session
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 lg:p-9">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">
          Member sign in
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase">Welcome back.</h2>
        <form
          className="mt-7 space-y-5"
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
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
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

        {demoMode ? (
          <section className="mt-7 border-t border-border pt-6" aria-labelledby="demo-access-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="demo-access-title" className="font-display text-lg font-bold">
                  Try a demo profile
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a role to explore KheloLocal.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="size-3.5" />7 profiles
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  onClick={() => void doLogin(d.email, "")}
                  className="group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-3 text-left transition-colors hover:border-lime hover:bg-muted/60"
                >
                  <span className="min-w-0 text-sm font-semibold text-foreground transition-colors group-hover:text-lime">
                    {d.label}
                  </span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-lime group-hover:text-lime-foreground">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
