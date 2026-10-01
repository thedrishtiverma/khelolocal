import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, MapPin, Search, Trophy, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ageFromDob } from "@/lib/format";
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
          "Create a KheloLocal account as an athlete, tournament organizer, or scout, coach, or team.",
      },
      { property: "og:title", content: "Join KheloLocal" },
      {
        property: "og:description",
        content: "Pick your role and join your city's sports network.",
      },
    ],
  }),
  component: SignupPage,
});

const ROLES: { role: Role; title: string; body: string; icon: typeof User }[] = [
  {
    role: "ATHLETE",
    title: "Athlete",
    body: "Join tournaments and build a verified record.",
    icon: User,
  },
  {
    role: "ORGANIZER",
    title: "Organizer",
    body: "Run tournaments and verify results.",
    icon: Trophy,
  },
  {
    role: "COLLEGE",
    title: "College",
    body: "Verify annual sports records and discover campus talent.",
    icon: GraduationCap,
  },
  {
    role: "VOLUNTEER",
    title: "Volunteer",
    body: "Map tournaments, turfs and academies in your zone.",
    icon: MapPin,
  },
  { role: "SCOUT", title: "Scout / Coach / Team", body: "Discover local talent.", icon: Search },
];

function SignupPage() {
  const { signup } = useKhelo();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianAcknowledged, setGuardianAcknowledged] = useState(false);
  const athleteAge = ageFromDob(dateOfBirth);
  const guardianConsentRequired = role === "ATHLETE" && athleteAge !== null && athleteAge < 18;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-black">How will you use KheloLocal?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a role — you can fill in the rest of your profile later.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <button
            key={r.role}
            onClick={() => {
              setRole(r.role);
              setGuardianAcknowledged(false);
              setDateOfBirth("");
            }}
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
          onSubmit={async (e) => {
            e.preventDefault();
            let user;
            try {
              if (!password || password.length < 8) {
                toast.error("Choose a password with at least 8 characters.");
                return;
              }
              if (password !== confirmPassword) {
                toast.error("Passwords do not match.");
                return;
              }
              if (role === "ATHLETE" && !dateOfBirth) {
                toast.error("Enter your date of birth to continue.");
                return;
              }
              user = await signup({
                name,
                email,
                role,
                password,
                ...(role === "ATHLETE" ? { dateOfBirth } : {}),
                guardianConsent: role === "ATHLETE" && guardianAcknowledged,
              });
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Unable to create your account.");
              return;
            }
            toast.success("Account created", { description: "Welcome to KheloLocal." });
            navigate({
              to:
                user.role === "ORGANIZER"
                  ? "/organizer"
                  : user.role === "SCOUT"
                    ? "/discover"
                    : user.role === "COLLEGE"
                      ? "/college"
                      : user.role === "VOLUNTEER"
                        ? "/volunteer"
                        : "/athlete",
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              {role === "ORGANIZER"
                ? "Organization name"
                : role === "COLLEGE"
                  ? "College name"
                  : "Full name"}
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
            />
          </div>
          {role === "ATHLETE" ? (
            <div className="space-y-2">
              <Label htmlFor="athlete-date-of-birth">Date of birth</Label>
              <Input
                id="athlete-date-of-birth"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={dateOfBirth}
                onChange={(event) => {
                  setDateOfBirth(event.target.value);
                  setGuardianAcknowledged(false);
                }}
                required
              />
            </div>
          ) : null}
          {guardianConsentRequired ? (
            <div className="rounded-md border border-border p-3">
              <label htmlFor="guardian-consent" className="flex items-start gap-2 text-sm">
                <input
                  id="guardian-consent"
                  type="checkbox"
                  required
                  checked={guardianAcknowledged}
                  onChange={(event) => setGuardianAcknowledged(event.target.checked)}
                  className="mt-1 size-4 accent-primary"
                />
                <span>
                  I am the athlete’s parent or legal guardian, and I agree to this account and
                  sporting profile.
                </span>
              </label>
              <p className="ml-6 mt-2 text-xs text-muted-foreground">
                Until guardian verification and age-based visibility controls are available, this
                profile will not appear in public athlete discovery.
              </p>
            </div>
          ) : null}
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
