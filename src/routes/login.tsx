import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKhelo } from "@/lib/services/store";

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
  { label: "Scout / Coach / Team", email: "scout@khelolocal.demo", to: "/discover" as const },
];

function LoginPage() {
  const { login } = useKhelo();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const doLogin = (value: string) => {
    setBusy(true);
    const user = login(value);
    setBusy(false);
    if (!user) {
      setError("We couldn't find an account with that email.");
      return;
    }
    toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
    const target =
      user.role === "ORGANIZER"
        ? "/organizer"
        : user.role === "SCOUT"
          ? "/discover"
          : user.role === "COLLEGE"
            ? "/college"
            : user.role === "VOLUNTEER"
              ? "/volunteer"
              : user.role === "ADMIN"
                ? "/admin"
                : "/athlete";
    navigate({ to: target });
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
            doLogin(email);
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
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-muted-foreground hover:underline">
              Forgot password?
            </button>
            <Link to="/signup" className="font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Demo access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One tap sign-in for every KheloLocal role.
        </p>
        <div className="mt-5 space-y-3">
          {DEMO.map((d) => (
            <button
              key={d.email}
              onClick={() => doLogin(d.email)}
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
    </div>
  );
}
