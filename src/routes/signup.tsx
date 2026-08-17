import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Trophy, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useKhelo } from "@/lib/services/store";
import type { Role } from "@/types";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join KheloLocal — Athlete, organizer or scout" },
      {
        name: "description",
        content:
          "Create a KheloLocal account as an athlete, tournament organizer, or scout/coach/team in Indore.",
      },
      { property: "og:title", content: "Join KheloLocal" },
      { property: "og:description", content: "Pick your role and join your city's sports network." },
    ],
  }),
  component: SignupPage,
});

const ROLES: { role: Role; title: string; body: string; icon: typeof User }[] = [
  { role: "ATHLETE", title: "Athlete", body: "Join tournaments and build a verified record.", icon: User },
  { role: "ORGANIZER", title: "Organizer", body: "Run tournaments and verify results.", icon: Trophy },
  { role: "SCOUT", title: "Scout / Coach / Team", body: "Discover local talent.", icon: Search },
];

function SignupPage() {
  const { signup } = useKhelo();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-black">How will you use KheloLocal?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a role — you can fill in the rest of your profile later.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {ROLES.map((r) => (
          <button
            key={r.role}
            onClick={() => setRole(r.role)}
            className={cn(
              "rounded-lg border p-5 text-left transition-colors",
              role === r.role
                ? "border-lime bg-lime/10"
                : "border-border bg-card hover:border-foreground/30",
            )}
          >
            <r.icon className="size-5" />
            <p className="mt-3 font-display font-bold">{r.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
          </button>
        ))}
      </div>

      {role ? (
        <form
          className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const user = signup({ name, email, role });
            toast.success("Account created", { description: "Welcome to KheloLocal." });
            navigate({
              to: user.role === "ORGANIZER" ? "/organizer" : user.role === "SCOUT" ? "/discover" : "/athlete",
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              {role === "ORGANIZER" ? "Organization name" : "Full name"}
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">City: Indore, Madhya Pradesh</p>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      ) : null}

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-foreground hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}